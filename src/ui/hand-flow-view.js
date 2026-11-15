/* Owns hand card presentation; every judgment/reward goes through the shared session. */
(function installHandFlowView(root) {
  "use strict";
  let active = false,
    stage = "CLOSED",
    owner = 0,
    pending = false,
    presentation = null,
    frame = null,
    timer = null,
    oldFocus = null;
  const cardAttributes = new Map();
  const animations = new Set();
  let shadeNode = null,
    shadeSvg = null,
    shadeMask = null,
    shadeBgRect = null,
    shadeSig = "";
  const shadeHolePool = [];
  function clearAnimations() {
    for (const animation of animations) animation.cancel();
    animations.clear();
  }
  const E = (value) => escapeHtml(String(value ?? ""));
  const content = () => document.getElementById("handFlowContent");
  const backdrop = () => document.getElementById("handRaiseBackdrop");
  const snapshot = () => ClassroomHandSession.getSnapshot();
  const token = () => {
    const s = snapshot();
    return { groupId: s.groupId, selectionId: s.selectionId };
  };
  const icon = (path) =>
    `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;
  function ensureShadeNode() {
    if (shadeNode) return shadeNode;
    shadeNode = document.createElement("div");
    shadeNode.id = "handFlowShade";
    shadeNode.className = "hand-flow-shade";
    shadeNode.setAttribute("aria-hidden", "true");
    shadeNode.innerHTML =
      '<svg width="100%" height="100%" preserveAspectRatio="none"><defs><mask id="handFlowShadeMask"><rect width="100%" height="100%" fill="white"/></mask></defs><rect width="100%" height="100%" fill="black" opacity=".66" mask="url(#handFlowShadeMask)"/></svg><div class="hand-flow-hint">点击举手的小组<button type="button" data-hand-close aria-label="退出举手模式">退出举手 ×</button></div>';
    shadeSvg = shadeNode.querySelector("svg");
    shadeMask = shadeNode.querySelector("#handFlowShadeMask");
    shadeBgRect = shadeMask.firstElementChild;
    return shadeNode;
  }
  function shade() {
    if (!active || stage !== "SELECT_GROUP") return;
    const node = ensureShadeNode();
    if (!node.isConnected) document.body.append(node);
    const cards = document.querySelectorAll("#groupList>.group-row-card");
    const bounds = node.getBoundingClientRect();
    const rects = [];
    let sig = `${bounds.width},${bounds.height},${cards.length}`;
    for (let i = 0; i < cards.length; i++) {
      const r = cards[i].getBoundingClientRect();
      const x = r.x - bounds.x - 2,
        y = r.y - bounds.y - 2,
        w = r.width + 4,
        h = r.height + 4;
      rects.push([x, y, w, h]);
      sig += `;${x},${y},${w},${h}`;
    }
    if (sig === shadeSig && shadeMask.childElementCount === rects.length + 1)
      return;
    shadeSig = sig;
    const viewBox = `0 0 ${bounds.width} ${bounds.height}`;
    if (shadeSvg.getAttribute("viewBox") !== viewBox)
      shadeSvg.setAttribute("viewBox", viewBox);
    while (shadeHolePool.length < rects.length) {
      const rect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect",
      );
      rect.setAttribute("rx", "14");
      rect.setAttribute("fill", "black");
      shadeHolePool.push(rect);
    }
    const desiredCount = rects.length + 1;
    while (shadeMask.childElementCount > desiredCount)
      shadeMask.lastElementChild.remove();
    for (let i = 0; i < rects.length; i++) {
      const rect = shadeHolePool[i],
        [x, y, w, h] = rects[i];
      rect.setAttribute("x", String(x));
      rect.setAttribute("y", String(y));
      rect.setAttribute("width", String(w));
      rect.setAttribute("height", String(h));
      if (rect.parentNode !== shadeMask) shadeMask.append(rect);
    }
  }
  function scheduleShade(event) {
    if (!active || stage !== "SELECT_GROUP") return;
    if (event && event.type === "scroll") {
      const target = event.target;
      const groupList = document.getElementById("groupList");
      if (
        target !== document &&
        target !== window &&
        target !== document.documentElement &&
        target !== document.body &&
        target.id !== "view-battle" &&
        target !== groupList &&
        !target.contains?.(groupList)
      )
        return;
    }
    if (frame !== null) return;
    frame = requestAnimationFrame(() => {
      frame = null;
      shade();
    });
  }
  function clearPresentation() {
    clearTimeout(timer);
    timer = null;
    presentation = null;
    content()?.replaceChildren();
  }
  function selectMode() {
    stage = "SELECT_GROUP";
    hideClassroomWindow(backdrop());
    shade();
    document.body.dataset.handFlow = stage;
    for (const card of cardAttributes.keys())
      if (!card.isConnected) cardAttributes.delete(card);
    for (const card of document.querySelectorAll(
      "#groupList>.group-row-card",
    )) {
      if (!cardAttributes.has(card))
        cardAttributes.set(card, {
          tabindex: card.getAttribute("tabindex"),
          role: card.getAttribute("role"),
          label: card.getAttribute("aria-label"),
        });
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute(
        "aria-label",
        `选择举手小组：${card.querySelector(".group-name")?.textContent || card.dataset.groupId}`,
      );
    }
  }
  function enterCards() {
    clearAnimations();
    shadeSig = "";
    document.getElementById("handFlowShade")?.remove();
    document.body.dataset.handFlow = stage;
    const preferences = root.DesktopUI?.getPreferences();
    const reduced =
      preferences?.motion === "off" ||
      (preferences?.systemMotion &&
        matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (!reduced)
      for (const [i, card] of [
        ...content().querySelectorAll(".hand-flow-card"),
      ].entries()) {
        const animation = card.animate(
          [
            { opacity: 0, transform: "translateY(16px) scale(.97)" },
            { opacity: 1, transform: "translateY(0) scale(1)" },
          ],
          { duration: 240, delay: i * 35, easing: "cubic-bezier(.23,1,.32,1)" },
        );
        animations.add(animation);
        animation.finished.then(
          () => animations.delete(animation),
          () => animations.delete(animation),
        );
      }
    showClassroomWindow(backdrop());
  }
  function render() {
    if (!active || pending || presentation) return;
    const s = snapshot();
    if (!s.selectionId || s.phase === "SELECT_GROUP" || s.phase === "CLOSED") {
      selectMode();
      return;
    }
    stage = s.phase;
    const group = state.groups.find((g) => g.id === s.groupId);
    document.getElementById("handFlowTitle").textContent =
      group?.name || "课堂举手";
    const meta = document.getElementById("handFlowMeta");
    if (meta) {
      meta.hidden = !group;
      if (group)
        meta.textContent = `${groupNoTextV213(group)} · ${group.score} 分`;
    }
    const avatar = document.getElementById("handFlowAvatar");
    const src = root.ClassroomAvatarDisplay?.ownGroupUrl(group) || "";
    avatar.hidden = !src;
    if (src) avatar.src = src;
    else avatar.removeAttribute("src");
    if (stage === "JUDGE")
      content().innerHTML = `<p class="hand-flow-description">这一次回答，是否正确？</p><div class="hand-flow-grid"><button type="button" class="hand-flow-card positive" data-hand-judge="correct">${icon("M9 16.17L5.53 12.7a.996.996 0 1 0-1.41 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71a.996.996 0 1 0-1.41-1.41L9 16.17z")}<strong>回答正确</strong><span>记录参与，选择本次奖励</span></button><button type="button" class="hand-flow-card negative" data-hand-judge="wrong">${icon("M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z")}<strong>回答错误</strong><span>记录勇敢参与，继续下一组</span></button></div>`;
    else
      content().innerHTML = `<p class="hand-flow-description">回答正确 · 本次选择一项奖励</p><div class="hand-flow-grid three"><button type="button" class="hand-flow-card positive" data-hand-reward="score" ${s.canScore ? "" : "disabled"}>${icon("M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z")}<strong>我要加分</strong><span>六个预设或自由输入</span></button><button type="button" class="hand-flow-card" data-hand-reward="draw" ${s.canDraw ? "" : "disabled"}>${icon("M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4l3.38 4.6L17 10.83 14.92 8H20v6z")}<strong>我要抽道具</strong><span>${s.canDraw ? "正式奖池，抽取一次" : s.inventoryCount >= 3 ? "道具槽已满" : "当前状态不可获得道具"}</span></button><button type="button" class="hand-flow-card" data-hand-reward="use" ${s.canUse ? "" : "disabled"}>${icon("M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66l.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z")}<strong>我要用道具</strong><span>${E(s.mainItemName || "暂无可用主要道具")}</span></button></div>`;
    enterCards();
  }
  function scoreCards() {
    stage = "SCORE";
    document.body.dataset.handFlow = stage;
    content().innerHTML = `<p class="hand-flow-description">正数加分，负数扣分 · 成功后完成本次奖励</p><div class="hand-flow-grid six">${ClassroomFeedback.getOptions()
      .slots.map(
        (n) =>
          `<button type="button" class="hand-flow-card ${n > 0 ? "positive" : "negative"}" data-hand-score="${n}"><strong>${n > 0 ? "+" : ""}${n}</strong><span>分</span></button>`,
      )
      .join(
        "",
      )}</div><form id="handFlowScoreForm" class="hand-flow-score-form"><label>自定义分数<input id="handFlowScoreInput" type="number" step="1" required aria-label="举手自由分值"></label><button class="btn btn-primary" type="submit" data-hand-score-submit>确认赋分</button><button class="btn" type="button" data-hand-back>返回奖励</button></form>`;
    enterCards();
  }
  async function execute(action, payload = {}, after = null) {
    if (pending) return;
    const generation = owner;
    pending = true;
    content()?.setAttribute("aria-busy", "true");
    content()
      ?.querySelectorAll("button,input")
      .forEach((el) => (el.disabled = true));
    try {
      const result = await ClassroomHandSession.command(action, {
        ...token(),
        ...payload,
      });
      if (!active || owner !== generation) return;
      if (!result.ok) {
        showToast(result.error || "操作未完成，请重试");
        return;
      }
      if (after) await after(result, generation);
    } catch (error) {
      if (active && owner === generation) showToast(error.message);
    } finally {
      if (active && owner === generation) {
        pending = false;
        content()?.removeAttribute("aria-busy");
        if (!presentation) render();
      }
    }
  }
  async function select(groupId) {
    if (!active) return;
    await execute("handSelect", { groupId });
  }
  function drawPresentation(result, generation) {
    presentation = true;
    stage = "DRAW";
    document.body.dataset.handFlow = stage;
    const key =
      result.itemKey ||
      Object.keys(ITEM_DEFS).find((k) => ITEM_DEFS[k].name === result.itemName);
    const keys = Object.keys(ITEM_DEFS).slice(0, 8);
    const strip = [...keys, ...keys]
      .map((k) => `<div>${itemVisual(k)}</div>`)
      .join("");
    content().innerHTML = `<p class="hand-flow-description">抽取结果已保存 · 正在揭晓</p><div class="hand-flow-reel" aria-label="道具滚动揭晓"><div class="hand-flow-strip">${strip}</div></div><div id="handFlowDrawResult" class="hand-flow-reveal" hidden></div><button type="button" class="btn" data-hand-skip>跳过演出</button>`;
    enterCards();
    const motionPreferences = DesktopUI.getPreferences();
    const reduced =
      motionPreferences.motion === "off" ||
      (motionPreferences.systemMotion &&
        matchMedia("(prefers-reduced-motion: reduce)").matches);
    timer = setTimeout(
      () => {
        if (owner !== generation || !active) return;
        content().querySelector(".hand-flow-reel")?.remove();
        const reveal = document.getElementById("handFlowDrawResult");
        reveal.hidden = false;
        reveal.innerHTML = `${key ? itemVisual(key) : ""}<strong>${E(result.itemName || "道具已入库")}</strong>`;
        if (!reduced) {
          const animation = reveal.animate(
            [
              { opacity: 0, transform: "translateY(20px) scale(.96)" },
              { opacity: 1, transform: "translateY(0) scale(1)" },
            ],
            { duration: 350, easing: "cubic-bezier(.23,1,.32,1)" },
          );
          animations.add(animation);
          animation.finished.then(
            () => animations.delete(animation),
            () => animations.delete(animation),
          );
        }
        timer = setTimeout(
          () => {
            if (owner !== generation || !active) return;
            clearPresentation();
            render();
          },
          reduced ? 0 : 1100,
        );
      },
      reduced ? 0 : 900,
    );
  }
  function reward(kind) {
    if (kind === "score") {
      scoreCards();
      return;
    }
    return execute(
      kind === "draw" ? "handDraw" : "handUse",
      {},
      kind === "draw" ? drawPresentation : null,
    );
  }
  function close() {
    if (!active) return;
    active = false;
    owner++;
    pending = false;
    clearPresentation();
    clearAnimations();
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    document.getElementById("handFlowShade")?.remove();
    delete document.body.dataset.handFlow;
    for (const [card, attributes] of cardAttributes)
      for (const [key, name] of [
        ["tabindex", "tabindex"],
        ["role", "role"],
        ["label", "aria-label"],
      ]) {
        if (attributes[key] === null) card.removeAttribute(name);
        else card.setAttribute(name, attributes[key]);
      }
    cardAttributes.clear();
    hideClassroomWindow(backdrop());
    ClassroomHandSession.invalidate();
    handRaiseGroupId = null;
    if (oldFocus?.isConnected) oldFocus.focus({ preventScroll: true });
    oldFocus = null;
  }
  function toggle() {
    if (active) {
      close();
      return;
    }
    if (!ClassroomWriteBarrier.allow()) return;
    window.GodpowerTooltips?.dismiss?.();
    if (currentView !== "battle") switchView("battle");
    active = true;
    owner++;
    oldFocus = document.activeElement;
    ClassroomHandSession.invalidate();
    selectMode();
  }
  document.addEventListener(
    "click",
    (event) => {
      if (!active) return;
      if (stage === "SELECT_GROUP") {
        const target = event.target.closest?.(
          '[data-hand-close],.bottom-dock [onclick*="openHandRaise"]',
        );
        if (target?.matches("[data-hand-close]")) {
          event.preventDefault();
          event.stopImmediatePropagation();
          close();
          return;
        }
        if (target) return;
        const card = event.target.closest?.("#groupList>.group-row-card");
        event.preventDefault();
        event.stopImmediatePropagation();
        if (card && !pending) void select(Number(card.dataset.groupId));
        return;
      }
      const button = event.target.closest?.("#handRaiseBackdrop button");
      if (!button) return;
      if (button.hasAttribute("data-hand-judge"))
        void execute("handJudge", {
          correct: button.dataset.handJudge === "correct",
        });
      if (button.hasAttribute("data-hand-reward"))
        void reward(button.dataset.handReward);
      if (button.hasAttribute("data-hand-score"))
        void execute("handScore", { delta: Number(button.dataset.handScore) });
      if (button.hasAttribute("data-hand-back")) render();
      if (button.hasAttribute("data-hand-skip")) {
        clearPresentation();
        render();
      }
    },
    true,
  );
  document.addEventListener("submit", (event) => {
    if (event.target.id !== "handFlowScoreForm") return;
    event.preventDefault();
    const delta = Number(document.getElementById("handFlowScoreInput").value);
    if (!Number.isSafeInteger(delta) || !delta) {
      showToast("请输入非零安全整数");
      return;
    }
    void execute("handScore", { delta });
  });
  document.addEventListener(
    "keydown",
    (event) => {
      if (!active) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        close();
        return;
      }
      if (stage !== "SELECT_GROUP") return;
      const cards = [...cardAttributes.keys()];
      if (event.key === "Tab") {
        event.preventDefault();
        const index = cards.indexOf(document.activeElement);
        cards[
          (index + (event.shiftKey ? -1 : 1) + cards.length) % cards.length
        ]?.focus({ preventScroll: true });
      }
      if (event.key === "Enter" || event.key === " ") {
        const card = event.target.closest?.(".group-row-card");
        if (card) {
          event.preventDefault();
          event.stopImmediatePropagation();
          void select(Number(card.dataset.groupId));
        }
      }
    },
    true,
  );
  root.addEventListener("resize", scheduleShade);
  document.addEventListener("scroll", scheduleShade, {
    capture: true,
    passive: true,
  });
  root.addEventListener("godpower:active-save-changed", close);
  root.addEventListener("pagehide", close, { once: true });
  ClassroomHandSession.subscribe(render);
  root.HandFlowView = Object.freeze({
    toggle,
    close,
    render,
    select,
    reward,
    judge: (correct) => execute("handJudge", { correct }),
    score: (delta) => execute("handScore", { delta }),
    status: () => ({ active, stage, pending }),
  });
})(globalThis);
