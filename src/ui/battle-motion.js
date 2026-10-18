/* Finite visual sessions: no scores, inventory or random results are calculated here. */
const BattleMotion = (() => {
  const sessions = new Map(),
    draws = new Map();
  const duration = 1700,
    fade = 600;
  function enabled() {
    const p = DesktopUI.getPreferences();
    return (
      currentView === "battle" &&
      p.itemFx &&
      p.motion !== "off" &&
      !(
        p.systemMotion && matchMedia("(prefers-reduced-motion: reduce)").matches
      )
    );
  }
  function mount(session, card) {
    if (!card || !enabled()) return;
    const node = document.createElement("div");
    node.className = "bm-layer";
    node.dataset.bmKey = session.id;
    node.dataset.kind = session.kind;
    node.dataset.family = session.family;
    node.style.setProperty("--bm-color", session.color);
    const badge = document.createElement("div");
    badge.className = "bm-badge";
    badge.innerHTML = `<span>${ITEM_DEFS[session.key] ? itemVisual(session.key) : "✦"}</span><b>${escapeHtml(session.label)}</b>`;
    node.append(badge);
    card.append(node);
    const simple = DesktopUI.getPreferences().motion === "simple";
    node.animate(
      simple
        ? [
            { opacity: 0 },
            { opacity: 1, offset: 0.18 },
            { opacity: 1, offset: 0.64 },
            { opacity: 0 },
          ]
        : [
            { opacity: 0, filter: "brightness(1.25)" },
            { opacity: 1, filter: "brightness(1)", offset: 0.18 },
            { opacity: 1, offset: 0.64 },
            { opacity: 0 },
          ],
      { duration, easing: "cubic-bezier(.22,.7,.25,1)", fill: "both" },
    ).currentTime = Math.max(0, performance.now() - session.started);
  }
  function show(kind, gid, key, label) {
    if (!enabled()) return;
    const id = String(gid) + ":" + kind,
      prior = sessions.get(id);
    if (prior) clearTimeout(prior.timer);
    document.querySelectorAll(".bm-layer").forEach((el) => {
      if (el.dataset.bmKey === id) {
        el.getAnimations().forEach((a) => a.cancel());
        el.remove();
      }
    });
    const family = /fire/.test(key)
      ? "fire"
      : /ice/.test(key)
        ? "ice"
        : /lightning/.test(key)
          ? "lightning"
          : /green|red|spiny|shell/.test(key)
            ? "shell"
            : /bomb/.test(key)
              ? "bomb"
              : /boomerang/.test(key)
                ? "boomerang"
                : /banana/.test(key)
                  ? "banana"
                  : /horn/.test(key)
                    ? "horn"
                    : /blooper/.test(key)
                      ? "ink"
                      : /boo/.test(key)
                        ? "ghost"
                        : /hammer/.test(key)
                          ? "hammer"
                          : /bullet/.test(key)
                            ? "bullet"
                            : /star|mega|power|mushroom|feather|coin/.test(key)
                              ? "buff"
                              : "pulse";
    const aliases = {
      green: "green_shell",
      red: "red_shell",
      spiny: "spiny_shell",
      horn: "super_horn",
      bomb: "bob_omb",
      mega: "giant_mushroom",
      power: "power_mushroom",
      bullet: "bullet_bill",
    };
    const color =
      kind === "defend"
        ? "#249ad0"
        : kind === "heal"
          ? "#1caa73"
          : CARD_HIT_COLOR[key] ||
            CARD_HIT_COLOR[aliases[key]] ||
            (family === "buff" ? "#20a47a" : "#e97359");
    const session = {
      id,
      gid,
      key,
      kind,
      family,
      color,
      label:
        label ||
        (kind === "use"
          ? "发动 · "
          : kind === "defend"
            ? "防御成功 · "
            : kind === "heal"
              ? "恢复 · "
              : "受到 · ") + (ITEM_DEFS[key]?.name || "状态变化"),
      started: performance.now(),
    };
    session.timer = setTimeout(() => {
      if (sessions.get(id) !== session) return;
      sessions.delete(id);
      document.querySelectorAll(".bm-layer").forEach((el) => {
        if (el.dataset.bmKey === id) el.remove();
      });
    }, duration + 40);
    sessions.set(id, session);
    mount(
      session,
      document.querySelector(
        `#groupList [data-group-id="${CSS.escape(String(gid))}"]`,
      ),
    );
  }
  function restore(card, gid) {
    for (const session of sessions.values())
      if (
        String(session.gid) === String(gid) &&
        performance.now() - session.started < duration
      )
        mount(session, card);
    const draw = draws.get(String(gid));
    if (draw && !draw.isConnected && currentView === "battle") {
      card.classList.add("item-draw-spinning");
      card.classList.toggle("bm-draw-fading", draw.dataset.fading === "true");
      card.append(draw);
    }
  }
  function event(type, detail) {
    if (type === "ITEM_EFFECT_EXPIRED")
      show("expired", detail.groupId, detail.key, "持续状态已解除");
    else if (type === "ITEM_EFFECT_APPLIED")
      show("applied", detail.groupId, detail.key, "持续状态已更新");
    else if (type === "ITEM_QUEUE_PROMOTED")
      show("queue", detail.groupId, detail.key, "次要道具晋升主要队列");
  }
  function clear() {
    for (const s of sessions.values()) clearTimeout(s.timer);
    sessions.clear();
    document.querySelectorAll(".bm-layer").forEach((el) => {
      el.getAnimations().forEach((a) => a.cancel());
      el.remove();
    });
    for (const node of draws.values()) {
      node.parentElement?.classList.remove(
        "item-draw-spinning",
        "bm-draw-fading",
      );
      node.remove();
    }
    draws.clear();
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clear();
  });
  return {
    show,
    restore,
    event,
    clear,
    duration,
    fade,
    enterDrawContent: (node) => {
      if (!node || !enabled()) return;
      node.animate(
        [
          { opacity: 0, translate: "0 7px" },
          { opacity: 1, translate: "0 0" },
        ],
        { duration: 380, easing: "cubic-bezier(.18,.75,.25,1)" },
      );
    },
    trackDraw: (id, node) => {
      draws.set(String(id), node);
      if (enabled()) {
        node.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 380,
          easing: "cubic-bezier(.18,.75,.25,1)",
        });
        node.querySelectorAll(".r-icon,.r-name,.r-hint").forEach((el, i) =>
          el.animate(
            [
              { opacity: 0, translate: "0 5px" },
              { opacity: 1, translate: "0 0" },
            ],
            {
              duration: 400,
              delay: 60 + i * 60,
              fill: "backwards",
              easing: "cubic-bezier(.18,.75,.25,1)",
            },
          ),
        );
      }
    },
    fadeDraw: (node) => {
      node.dataset.fading = "true";
      node.parentElement?.classList.add("bm-draw-fading");
      const opacity = getComputedStyle(node).opacity;
      node.getAnimations().forEach((a) => a.cancel());
      node.style.setProperty("animation", "none", "important");
      if (enabled())
        node.animate([{ opacity }, { opacity: 0 }], {
          duration: 620,
          easing: "cubic-bezier(.22,.7,.25,1)",
          fill: "forwards",
        });
      else node.style.opacity = "0";
    },
    releaseDraw: (id, node) => {
      if (draws.get(String(id)) === node) draws.delete(String(id));
    },
    activeCount: () => sessions.size,
  };
})();
