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
  function shade() {
    if (!active || stage !== "SELECT_GROUP") return;
    let node = document.getElementById("handFlowShade");
    if (!node) {
      node = document.createElement("div");
      node.id = "handFlowShade";
      node.className = "hand-flow-shade";
      node.setAttribute("aria-hidden", "true");
      document.body.append(node);
    }
    const holes = [...document.querySelectorAll("#groupList>.group-row-card")]
      .map((card) => {
        const r = card.getBoundingClientRect();
        return `<rect x="${r.x - 2}" y="${r.y - 2}" width="${r.width + 4}" height="${r.height + 4}" rx="14" fill="black"/>`;
      })
      .join("");
    node.innerHTML = `<svg width="100%" height="100%"><defs><mask id="handFlowShadeMask"><rect width="100%" height="100%" fill="white"/>${holes}</mask></defs><rect width="100%" height="100%" fill="black" opacity=".66" mask="url(#handFlowShadeMask)"/></svg><div class="hand-flow-hint">点击举手的小组 · Escape 退出<button type="button" data-hand-close>❌</button></div>`;
  }
  function scheduleShade() {
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
    document.body.dataset.handFlow = stage;
    hideClassroomWindow(backdrop());
    shade();
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
    if (stage === "JUDGE")
      content().innerHTML = `<p class="hand-flow-description">这一次回答，是否正确？</p><div class="hand-flow-grid"><button type="button" class="hand-flow-card positive" data-hand-judge="correct">${icon("m5 12 4 4L19 6")}<strong>回答正确</strong><span>记录参与，选择本次奖励</span></button><button type="button" class="hand-flow-card negative" data-hand-judge="wrong">${icon("m6 6 12 12M18 6 6 18")}<strong>回答错误</strong><span>记录勇敢参与，继续下一组</span></button></div>`;
    else
      content().innerHTML = `<p class="hand-flow-description">回答正确 · 本次选择一项奖励</p><div class="hand-flow-grid three"><button type="button" class="hand-flow-card positive" data-hand-reward="score" ${s.canScore ? "" : "disabled"}>${icon("M12 5v14M5 12h14")}<strong>我要加分</strong><span>六个预设或自由输入</span></button><button type="button" class="hand-flow-card" data-hand-reward="draw" ${s.canDraw ? "" : "disabled"}>${icon("M3 8h18v12H3ZM12 8v12M3 12h18M12 8C4 8 5 1 9 4l3 4c8 0 7-7 3-4Z")}<strong>我要抽道具</strong><span>${s.canDraw ? "正式奖池，抽取一次" : s.inventoryCount >= 3 ? "道具槽已满" : "当前状态不可获得道具"}</span></button><button type="button" class="hand-flow-card" data-hand-reward="use" ${s.canUse ? "" : "disabled"}>${icon("m14 3 7 7-4 4-3-3-7 10-4-4 10-7-3-3Z")}<strong>我要用道具</strong><span>${E(s.mainItemName || "暂无可用主要道具")}</span></button></div>`;
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
  document.addEventListener("scroll", scheduleShade, true);
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
