/* Presentation only. Inputs are committed outcomes, never a second rule calculation. */
globalThis.HandItemCinematic = (() => {
  let origin = null,
    timer = null,
    dialog = null,
    priorFocus = null;
  function mark(id) {
    origin = id;
  }
  function take(id) {
    const result = origin === id;
    origin = null;
    return result;
  }
  function dismiss() {
    clearTimeout(timer);
    if (dialog) {
      dialog.close();
      dialog.remove();
      dialog = null;
    }
    if (priorFocus?.isConnected) priorFocus.focus();
    priorFocus = null;
  }
  /* The native reveal window cannot decode this document's DOM, so the
     cinematic travels as plain validated data. */
  function avatarFor(group) {
    if (!group?.groupUid) return "";
    const live = state.groups.find(
      (g) => g.id === group.id && g.groupUid === group.groupUid,
    );
    const url = live
      ? globalThis.ClassroomAvatarDisplay?.groupDataUrlCached(live) || ""
      : "";
    return url.length <= 180000 &&
      /^data:image\/webp;base64,[A-Za-z0-9+/=]+$/.test(url)
      ? url
      : "";
  }
  function avatarMarkup(url) {
    return url
      ? `<img class="hic-group-avatar" src="${escapeHtml(url)}" alt="小组头像">`
      : "";
  }
  function payload(result) {
    const targets = result.targets?.length
      ? result.targets
      : [{ name: "无可用目标", delta: 0 }];
    return {
      key: result.key,
      caster: result.caster?.name || "",
      casterAvatarDataUrl: avatarFor(result.caster),
      itemName: ITEM_DEFS[result.key]?.name || result.key,
      icon:
        typeof itemIconDataUrl === "function"
          ? itemIconDataUrl(result.key)
          : "",
      targets: targets.slice(0, 16).map((target) => ({
        name: String(target.name || ""),
        avatarDataUrl: avatarFor(target),
        delta: Number.isSafeInteger(target.delta) ? target.delta : 0,
        blocked: !!target.blocked,
        effectChanged: !!target.effectChanged,
        status: String(target.status || ""),
      })),
    };
  }
  function present(result) {
    dismiss();
    const p = DesktopUI.getPreferences();
    if (!p.itemFx || p.motion === "off" || !ItemModules.feedback(result.key))
      return;
    priorFocus = document.activeElement;
    // A docked main window may be hidden while the floating panel drives the
    // lesson, so the cinematic also runs on the native full-screen surface.
    if (
      window.godpowerDesktop?.role === "main" &&
      typeof window.godpowerDesktop.showItemFx === "function"
    ) {
      const data = payload(result);
      window.godpowerDesktop.showItemFx({
        ...data,
        effects: {
          style:
            typeof globalThis.randomEffectStyle === "function"
              ? globalThis.randomEffectStyle()
              : "aurora",
          duration: p.speed >= 1.5 ? 1200 : 2600,
        },
      });
      return;
    }
    dialog = document.createElement("dialog");
    dialog.className = "hand-item-cinematic";
    dialog.setAttribute("aria-label", "道具使用结果");
    const targets = result.targets.length
      ? result.targets
      : [{ name: "无可用目标", delta: 0 }];
    dialog.innerHTML = `<div class="hic-surface"><section class="hic-attacker"><small>攻击方 / 发动方</small>${avatarMarkup(avatarFor(result.caster))}<h2>${escapeHtml(result.caster.name)}</h2><div class="hic-icon">${itemVisual(result.key)}</div><strong>${escapeHtml(ITEM_DEFS[result.key].name)}</strong></section><span class="hic-arrow" aria-hidden="true">→</span><section class="hic-defender"><small>防守方 / 接收方</small><div class="hic-targets"></div></section></div><button class="btn ui-cinematic-skip">继续课堂 · 跳过特效</button>`;
    dialog.querySelector("button").onclick = dismiss;
    dialog.addEventListener("cancel", (e) => {
      e.preventDefault();
      dismiss();
    });
    document.body.append(dialog);
    let index = 0;
    const next = () => {
      if (!dialog) return;
      const target = targets[index++];
      const label = target.blocked
        ? "防御成功"
        : target.delta
          ? `${target.delta > 0 ? "+" : ""}${target.delta} 分`
          : target.effectChanged
            ? "状态已施加"
            : result.key === "item_box"
              ? "获得道具"
              : "效果已结算";
      dialog.querySelector(".hic-targets").innerHTML =
        `${avatarMarkup(avatarFor(target))}<h2>${escapeHtml(target.name)}</h2><strong>${escapeHtml(label)}</strong><p>${escapeHtml(target.status || "")}</p><small>${index} / ${targets.length}</small>`;
      timer = setTimeout(index < targets.length ? next : dismiss, 1500);
    };
    dialog.showModal();
    next();
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) dismiss();
  });
  Reliability.onDefenseInvalidation(dismiss);
  return { mark, take, present, dismiss, payload };
})();

globalThis.ScoreCardMotion = (() => {
  const sessions = new Map();
  const duration = 1900;
  function enabled() {
    const p = DesktopUI.getPreferences();
    return (
      currentView === "battle" &&
      p.motion !== "off" &&
      !(
        p.systemMotion && matchMedia("(prefers-reduced-motion: reduce)").matches
      )
    );
  }
  function remove(session) {
    session.nodes?.forEach((n) => n.remove());
    session.hidden?.classList.remove("score-motion-hidden");
  }
  function mount(session, card) {
    remove(session);
    if (!card) return;
    const score = card.querySelector(".row-score");
    if (!score) return;
    const cardRect = card.getBoundingClientRect(),
      scoreRect = score.getBoundingClientRect();
    const x =
      scoreRect.left + scoreRect.width / 2 - cardRect.left - cardRect.width / 2;
    const y =
      scoreRect.top + scoreRect.height / 2 - cardRect.top - cardRect.height / 2;
    const layer = document.createElement("div");
    layer.className = "score-card-wash";
    const number = document.createElement("div");
    number.className = "score-card-number";
    layer.style.background = session.color;
    number.style.color = session.ink;
    number.innerHTML = "<span></span><small></small>";
    number.firstChild.textContent = `${session.from}分`;
    number.lastChild.textContent = `${session.to - session.from > 0 ? "+" : ""}${session.to - session.from}`;
    score.classList.add("score-motion-hidden");
    session.hidden = score;
    session.nodes = [layer, number];
    card.append(layer, number);
    const elapsed = Math.max(0, performance.now() - session.started);
    const wash = layer.animate(
      [
        { clipPath: "circle(0% at 85% 35%)" },
        { clipPath: "circle(150% at 85% 35%)", offset: 0.23 },
        { clipPath: "circle(150% at 85% 35%)", offset: 0.78 },
        { clipPath: "circle(0% at 85% 35%)" },
      ],
      { duration, fill: "both", easing: "ease-in-out" },
    );
    const move = number.animate(
      [
        {
          transform: `translate(calc(-50% + ${x}px),calc(-50% + ${y}px)) scale(.6)`,
          opacity: 0,
        },
        {
          transform: "translate(-50%,-50%) scale(1)",
          opacity: 1,
          offset: 0.25,
        },
        {
          transform: "translate(-50%,-50%) scale(1)",
          opacity: 1,
          offset: 0.76,
        },
        {
          transform: `translate(calc(-50% + ${x}px),calc(-50% + ${y}px)) scale(.6)`,
          opacity: 0,
        },
      ],
      { duration, fill: "both", easing: "ease-in-out" },
    );
    wash.currentTime = elapsed;
    move.currentTime = elapsed;
    number.lastChild.style.opacity = elapsed >= 600 ? "1" : "0";
    const update = () => {
      if (sessions.get(String(session.id)) !== session || !number.isConnected)
        return;
      const raw = Math.min(
        1,
        Math.max(0, (performance.now() - session.started - 600) / 650),
      );
      // Ease-out quint: the counter decelerates into its final value instead of
      // stepping at a constant rate, so the last digits settle gently.
      const t = 1 - Math.pow(1 - raw, 5);
      number.firstChild.textContent = `${Math.round(session.from + (session.to - session.from) * t)}分`;
      number.lastChild.style.opacity = raw > 0 ? "1" : "0";
      if (raw < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }
  function finish(session) {
    if (sessions.get(String(session.id)) !== session) return;
    sessions.delete(String(session.id));
    remove(session);
    const g = state.groups.find((g) => g.id === session.id);
    if (g) g.displayScore = g.score;
    const score = document.getElementById("score-val-" + session.id);
    if (score && g) score.textContent = g.score + "分";
    itemScoreDisplayHoldV21732.delete(String(session.id));
    renderChart();
    renderDashboard();
    updateHeaderStats();
    session.done?.();
  }
  function play(updates, done) {
    let left = updates.length;
    if (!left) {
      done?.();
      return;
    }
    for (const update of updates) {
      const g = state.groups.find((g) => g.id === update.groupId);
      if (!g || !enabled() || update.start === update.target) {
        if (g) {
          const prior = sessions.get(String(g.id));
          if (prior) {
            clearTimeout(prior.timer);
            finish(prior);
          }
          g.displayScore = g.score;
          itemScoreDisplayHoldV21732.delete(String(g.id));
          const score = document.getElementById("score-val-" + g.id);
          if (score) score.textContent = g.score + "分";
        }
        if (--left === 0) done?.();
        continue;
      }
      const prior = sessions.get(String(g.id));
      if (prior) {
        clearTimeout(prior.timer);
        remove(prior);
        prior.done?.();
      }
      const color = GodpowerUIModel.badgeColors(g.color);
      const raw = color.background.slice(1);
      const channels = [0, 2, 4]
        .map((i) => parseInt(raw.slice(i, i + 2), 16) / 255)
        .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
      const luminance =
        channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
      color.foreground = luminance > 0.179 ? "#000000" : "#FFFFFF";
      const session = {
        id: g.id,
        from: update.start,
        to: update.target,
        color: color.background,
        ink: color.foreground,
        started: performance.now(),
        done: () => {
          if (--left === 0) done?.();
        },
      };
      sessions.set(String(g.id), session);
      g.displayScore = update.start;
      itemScoreDisplayHoldV21732.set(String(g.id), update.start);
      mount(
        session,
        document.querySelector(`#groupList [data-group-id="${g.id}"]`),
      );
      session.timer = setTimeout(() => finish(session), duration + 40);
    }
  }
  function restore(card, id) {
    const session = sessions.get(String(id));
    if (session) mount(session, card);
  }
  function cancel() {
    for (const session of [...sessions.values()]) {
      clearTimeout(session.timer);
      finish(session);
    }
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancel();
  });
  return { play, restore, cancel };
})();
