/* Homepage-only composition and cancellable entrance. Business state is read-only. */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let started = false,
    introOpened = false,
    introBusy = false,
    introFinished = false,
    slidePx = 0;
  let activePointer = null,
    settleEntrance = null,
    focusBeforeIntro = null;
  let frame = null,
    cruiseTimer = null,
    pauseUntil = 0;
  let trackHovered = false,
    trackFocused = false,
    draggingTrack = false;
  let rankSignature = "",
    feedSignature = "";
  const background = new Map(),
    animations = new Set();
  const esc = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (ch) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[ch],
    );
  const preferences = () =>
    (typeof DesktopUI !== "undefined" ? DesktopUI.getPreferences() : null) || {
      motion: "full",
      speed: 1,
      systemMotion: true,
      pageMotion: true,
      groupCruise: false,
    };
  const canAnimate = () =>
    preferences().motion !== "off" &&
    !(preferences().systemMotion && reduceMotion.matches);
  const realGroups = () => (Array.isArray(state.groups) ? state.groups : []);
  const score = (g) => Number(g.score) || 0;
  function setText(id, value) {
    const el = $(id),
      text = String(value);
    if (el && el.textContent !== text) el.textContent = text;
  }
  function render() {
    if (!$("gpRankList")) return;
    const groups = realGroups(),
      mask = Number(state.itemGlobal?.blooperUntil || 0) > Date.now();
    // Use the established stable ranking, never invent an id-based tie-break.
    const ordered = ranking(),
      ranked = mask ? groups : ordered;
    const summary = GodpowerUIModel.standings(ordered);
    setText("wGroupCount", summary.count);
    setText("wTotalScore", mask ? "???" : summary.total);
    setText("wMaxScore", mask ? "???" : summary.highest);
    setText("wLeaderName", mask ? "已遮蔽" : summary.leader);
    for (const id of ["wTotalScore", "wMaxScore", "wLeaderName"])
      $(id).title = $(id).textContent;
    const signature = JSON.stringify([
      mask,
      ranked.map((g) => [g.id, g.name, g.score]),
    ]);
    setText("gpHeroCount", groups.length + " 组");
    setText(
      "gpRankNote",
      mask
        ? "积分与名次暂时遮蔽"
        : groups.length
          ? `共 ${groups.length} 组 · 积分从高到低`
          : "尚未添加小组",
    );
    if (signature !== rankSignature) {
      rankSignature = signature;
      const max = Math.max(1, ...ranked.map(score));
      $("gpRankList").innerHTML = ranked.length
        ? ranked
            .map((g, i) => {
              const medal = mask
                ? ""
                : i === 0
                  ? " gp-medal"
                  : i === 1
                    ? " gp-medal gp-second"
                    : i === 2
                      ? " gp-medal gp-third"
                      : "";
              const pct = mask
                ? 0
                : Math.max(0, Math.min(100, (score(g) / max) * 100));
              return `<div class="gp-rank-row" role="listitem"><span class="gp-rank-index${medal}">${mask ? "—" : i + 1}</span><span class="gp-rank-name" title="${esc(g.name)}">${esc(g.name)}</span><span class="gp-rank-bar" aria-hidden="true"><i style="width:${pct.toFixed(2)}%"></i></span><span class="gp-rank-points">${mask ? "???" : esc(g.score)}</span><span class="gp-rank-state">${mask ? "已遮蔽" : i === 0 ? "领跑" : "参赛中"}</span></div>`;
            })
            .join("")
        : '<div class="gp-rank-empty">还没有小组。请在设置或比赛页面添加小组。</div>';
    }
    const phases = {
      NOT_STARTED: ["赛场准备就绪", "随时可以前往比赛页面开始新回合"],
      FINISHED: ["本场比赛已结束", "可查看档案或准备下一届比赛"],
      SETTLED: ["本题已结算", "积分已更新，可前往赛场进入下一题"],
      ANSWER_SELECTED: ["正确答案已选定", "等待教师判定结算 · 尚未完成本题"],
      ANSWERING: ["新一轮比赛进行中", "当前回合正在进行 · 分数实时更新"],
    };
    const phase = phases[Reliability.phase(state)];
    setText("gpRoundTitle", phase[0]);
    setText("gpRoundDetail", phase[1]);
    const recent = historyStack.slice(-4).reverse(),
      nextFeed = JSON.stringify(recent.map((h) => [h.desc, h.time]));
    if (nextFeed !== feedSignature) {
      feedSignature = nextFeed;
      $("gpFeedList").innerHTML = recent.length
        ? recent
            .map(
              (h) =>
                `<div class="gp-feed-row"><span class="gp-feed-icon">↗</span><div class="gp-feed-copy"><strong>${esc(h.desc || "课堂操作")}</strong><p>操作记录已保留，可在历史页面查看快照</p></div><span class="gp-feed-time">${esc(h.time || "")}</span></div>`,
            )
            .join("")
        : '<div class="gp-feed-row"><span class="gp-feed-icon">✦</span><div class="gp-feed-copy"><strong>等待第一条课堂动态</strong><p>开始答题、调整积分或使用道具后，相关操作将出现在这里。</p></div></div>';
    }
    syncCruise();
  }
  function stopCruise() {
    clearTimeout(cruiseTimer);
    cruiseTimer = null;
  }
  function cruiseAllowed() {
    const track = $("uiGroupTrack");
    return !!(
      started &&
      preferences().groupCruise &&
      canAnimate() &&
      introFinished &&
      !document.hidden &&
      currentView === "welcome" &&
      !trackHovered &&
      !trackFocused &&
      !draggingTrack &&
      track &&
      track.scrollWidth > track.clientWidth + 6
    );
  }
  function syncCruise() {
    if (!started) return;
    const enabled = !!preferences().groupCruise;
    setText("gpCruiseToggle", enabled ? "暂停自动巡航" : "开启自动巡航");
    $("gpCruiseToggle").setAttribute("aria-pressed", String(enabled));
    setText(
      "gpCruiseStatus",
      enabled ? (cruiseAllowed() ? "自动巡航" : "巡航暂停") : "手动浏览",
    );
    if (!cruiseAllowed()) {
      stopCruise();
      return;
    }
    if (cruiseTimer !== null) return;
    cruiseTimer = setTimeout(
      () => {
        cruiseTimer = null;
        if (!cruiseAllowed()) return;
        const track = $("uiGroupTrack"),
          edge = track.scrollWidth - track.clientWidth;
        const first = track.querySelector(".ui-group-card"),
          step = (first?.offsetWidth || 203) + 11;
        track.scrollTo({
          left:
            track.scrollLeft >= edge - 2
              ? 0
              : Math.min(edge, track.scrollLeft + step),
          behavior: "smooth",
        });
        syncCruise();
      },
      Math.max(3800, pauseUntil - Date.now()),
    );
  }
  function setupCruise() {
    const track = $("uiGroupTrack");
    track.addEventListener("pointerenter", () => {
      trackHovered = true;
      syncCruise();
    });
    track.addEventListener("pointerleave", () => {
      trackHovered = false;
      pauseUntil = Date.now() + 2300;
      syncCruise();
    });
    track.addEventListener("focusin", () => {
      trackFocused = true;
      syncCruise();
    });
    track.addEventListener("focusout", (e) => {
      trackFocused = track.contains(e.relatedTarget);
      pauseUntil = Date.now() + 2300;
      syncCruise();
    });
    track.addEventListener("pointerdown", () => {
      draggingTrack = true;
      syncCruise();
    });
    window.addEventListener("pointerup", () => {
      draggingTrack = false;
      pauseUntil = Date.now() + 2300;
      syncCruise();
    });
    window.addEventListener("pointercancel", () => {
      draggingTrack = false;
      syncCruise();
    });
    for (const id of ["uiGroupPrev", "uiGroupNext"])
      $(id).addEventListener("click", () => {
        pauseUntil = Date.now() + 5000;
        stopCruise();
        syncCruise();
      });
    $("gpCruiseToggle").addEventListener("click", () =>
      DesktopUI.setGroupCruise(!preferences().groupCruise),
    );
    new ResizeObserver(syncCruise).observe(track);
  }
  function isolateBackground() {
    for (const el of document.body.children) {
      if (
        el.id === "gpIntro" ||
        el.id === "toast" ||
        ["SCRIPT", "STYLE", "LINK"].includes(el.tagName)
      )
        continue;
      background.set(el, el.inert);
      el.inert = true;
    }
  }
  function releaseBackground() {
    for (const [el, inert] of background) el.inert = inert;
    background.clear();
  }
  function activeIntro() {
    return started && introOpened && !$("gpIntro").hidden;
  }
  function focusIntro() {
    if (activeIntro())
      $(introBusy ? "gpIntroSkip" : "gpSlideTrack").focus({
        preventScroll: true,
      });
  }
  function showIntro(replay) {
    if (introBusy) return;
    const modal = [
      ...document.querySelectorAll('[role="dialog"][aria-modal="true"]'),
    ].find(
      (el) =>
        el.id !== "gpIntro" &&
        el.getClientRects().length &&
        getComputedStyle(el).visibility !== "hidden",
    );
    if (modal && replay) {
      showToast("请先关闭当前弹窗，再重播入场动画");
      return;
    }
    const overlay = $("gpIntro"),
      logo = $("gpIntroLogo"),
      svg = $("gpBrandMount").querySelector("svg");
    if (svg) logo.appendChild(svg);
    if (!background.size) {
      focusBeforeIntro = document.activeElement;
      isolateBackground();
    }
    logo.removeAttribute("style");
    $("gpIntroTitle").removeAttribute("style");
    overlay.hidden = false;
    overlay.setAttribute("aria-hidden", "false");
    overlay.classList.remove("departing", "ready");
    overlay.classList.add("active");
    introOpened = true;
    introFinished = false;
    resetPointer();
    drawSlide(0);
    document.body.classList.add("gp-intro-active");
    document.body.classList.remove("gp-intro-reveal");
    stopCruise();
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      frame = null;
      overlay.classList.add("ready");
    });
    if (!canAnimate()) finish(true);
    else focusIntro();
  }
  function drawSlide(px) {
    const track = $("gpSlideTrack"),
      max = Math.max(1, track.clientWidth - 56);
    slidePx = Math.min(Math.max(0, px), max);
    track.style.setProperty("--gp-slide", slidePx + "px");
    $("gpSlideFill").style.width = slidePx + 54 + "px";
    track.setAttribute("aria-valuenow", Math.round((slidePx / max) * 100));
  }
  function resetPointer() {
    const track = $("gpSlideTrack"),
      pointer = activePointer;
    activePointer = null;
    track.classList.remove("dragging");
    if (pointer !== null && track.hasPointerCapture(pointer))
      track.releasePointerCapture(pointer);
  }
  function finish(skip) {
    if (introBusy) {
      if (skip) settleEntrance?.();
      return;
    }
    if (introFinished) return;
    introBusy = true;
    resetPointer();
    cancelAnimationFrame(frame);
    frame = null;
    const overlay = $("gpIntro"),
      logo = $("gpIntroLogo"),
      title = $("gpIntroTitle"),
      mount = $("gpBrandMount"),
      svg = logo.querySelector("svg");
    const label = document.querySelector(".gp-brand-label");
    document.body.classList.remove("gp-intro-active");
    const animate = !skip && canAnimate() && logo.animate;
    if (animate && preferences().pageMotion)
      document.body.classList.add("gp-intro-reveal");
    overlay.classList.add("departing");
    overlay.setAttribute("aria-busy", "true");
    $("gpSlideTrack").setAttribute("aria-disabled", "true");
    // Resume inside the actual unlock gesture, before waiting for animation completion.
    window.startResumeRetry?.();
    window.tryAutoResumeAndPlay?.();
    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      settleEntrance = null;
      for (const animation of animations) animation.cancel();
      animations.clear();
      if (svg) mount.appendChild(svg);
      logo.removeAttribute("style");
      title.removeAttribute("style");
      overlay.classList.remove("active", "ready", "departing");
      overlay.hidden = true;
      overlay.setAttribute("aria-hidden", "true");
      overlay.removeAttribute("aria-busy");
      $("gpSlideTrack").removeAttribute("aria-disabled");
      introBusy = false;
      introFinished = true;
      releaseBackground();
      const prior = focusBeforeIntro;
      const target =
        prior &&
        prior !== document.body &&
        prior.isConnected &&
        prior.getClientRects().length &&
        !prior.closest("[inert]") &&
        (!prior.closest(".view") ||
          prior.closest(".view").id === "view-" + currentView)
          ? prior
          : currentView === "welcome"
            ? document.querySelector(".welcome-enter-btn")
            : document.querySelector(`.nav-tab[data-view="${currentView}"]`);
      target?.focus({ preventScroll: true });
      syncCruise();
    };
    settleEntrance = settle;
    if (!animate) {
      settle();
      return;
    }
    // Early unlock may interrupt the initial scale/fade; measure a stable box.
    for (const el of [logo, title]) {
      el.style.transition = "none";
      el.style.transform = "none";
      el.style.opacity = "1";
    }
    const a = logo.getBoundingClientRect(),
      b = mount.getBoundingClientRect(),
      t = title.getBoundingClientRect(),
      v = label.getBoundingClientRect();
    const zoom = Number(getComputedStyle(document.body).zoom) || 1;
    const options = {
      duration:
        (preferences().motion === "simple" ? 260 : 840) / preferences().speed,
      easing: "cubic-bezier(.22,.8,.22,1)",
      fill: "forwards",
    };
    const movement = (from, to) =>
      `translate(${(to.left + to.width / 2 - from.left - from.width / 2) / zoom}px,${(to.top + to.height / 2 - from.top - from.height / 2) / zoom}px)`;
    try {
      if (preferences().pageMotion) {
        document
          .querySelectorAll(".app-topnav .nav-tab")
          .forEach((tab, index) => {
            animations.add(
              tab.animate(
                [
                  {
                    opacity: 0,
                    translate:
                      preferences().motion === "simple" ? "0 -5px" : "0 -22px",
                  },
                  { opacity: 1, translate: "0 0" },
                ],
                {
                  duration:
                    (preferences().motion === "simple" ? 180 : 340) /
                    preferences().speed,
                  delay:
                    ((preferences().motion === "simple" ? 25 : 75) * index) /
                    preferences().speed,
                  easing: "cubic-bezier(.2,.8,.2,1)",
                  fill: "backwards",
                },
              ),
            );
          });
      }
      animations.add(
        logo.animate(
          [
            { transform: "translate(0,0) scale(1)", opacity: 1 },
            {
              transform: movement(a, b) + ` scale(${b.width / a.width})`,
              opacity: 1,
            },
          ],
          options,
        ),
      );
      animations.add(
        title.animate(
          [
            { transform: "translate(0,0) scale(1)", opacity: 1 },
            {
              transform:
                movement(t, v) + ` scale(${Math.min(1, v.height / t.height)})`,
              opacity: 0,
            },
          ],
          options,
        ),
      );
      Promise.all(
        [...animations].map((animation) =>
          animation.finished.then(
            () => true,
            () => false,
          ),
        ),
      ).then(settle);
    } catch (error) {
      console.warn("入场动画未完成，已进入首页", error);
      settle();
    }
  }
  function setupSlider() {
    const track = $("gpSlideTrack");
    const fromEvent = (event) => {
      const box = track.getBoundingClientRect();
      drawSlide(
        (event.clientX - box.left) / (box.width / track.offsetWidth) - 28,
      );
    };
    track.addEventListener("pointerdown", (event) => {
      if (introBusy || !event.isPrimary || event.button !== 0) return;
      activePointer = event.pointerId;
      track.classList.add("dragging");
      track.setPointerCapture(event.pointerId);
      fromEvent(event);
    });
    track.addEventListener("pointermove", (event) => {
      if (event.pointerId === activePointer) fromEvent(event);
    });
    track.addEventListener("pointerup", (event) => {
      if (event.pointerId !== activePointer) return;
      resetPointer();
      if (Number(track.getAttribute("aria-valuenow")) >= 83) finish(false);
      else drawSlide(0);
    });
    const cancel = (event) => {
      if (event.pointerId === activePointer) {
        resetPointer();
        drawSlide(0);
      }
    };
    track.addEventListener("pointercancel", cancel);
    track.addEventListener("lostpointercapture", cancel);
    track.addEventListener("keydown", (event) => {
      if (introBusy) return;
      if (
        ["ArrowRight", "ArrowLeft", "End", "Home", "Enter", " "].includes(
          event.key,
        )
      )
        event.preventDefault();
      if (event.key === "ArrowRight" || event.key === "ArrowLeft")
        drawSlide(slidePx + (event.key === "ArrowRight" ? 30 : -30));
      else if (event.key === "End") drawSlide(track.clientWidth - 56);
      else if (event.key === "Home") drawSlide(0);
      else if (
        (event.key === "Enter" || event.key === " ") &&
        Number(track.getAttribute("aria-valuenow")) >= 83
      )
        finish(false);
    });
    document.addEventListener(
      "keydown",
      (event) => {
        if (!activeIntro()) return;
        if (event.key === "Escape") {
          event.preventDefault();
          finish(true);
        }
        if (event.key === "Tab") {
          event.preventDefault();
          const controls = introBusy
            ? [$("gpIntroSkip")]
            : [track, $("gpIntroSkip")];
          const at = controls.indexOf(document.activeElement);
          controls[
            (at + (event.shiftKey ? -1 : 1) + controls.length) % controls.length
          ].focus();
        }
      },
      true,
    );
    document.addEventListener(
      "focusin",
      (event) => {
        if (activeIntro() && !$("gpIntro").contains(event.target)) focusIntro();
      },
      true,
    );
  }
  function preferencesChanged() {
    document.body.dataset.welcomeMotion = canAnimate()
      ? preferences().motion
      : "off";
    if (!started) return;
    if (!canAnimate() && activeIntro()) finish(true);
    syncCruise();
  }
  function viewChanged(name) {
    if (!started) return;
    if (name !== "welcome" && activeIntro()) finish(true);
    if (name !== "welcome") stopCruise();
    else syncCruise();
  }
  function init() {
    if (started) return;
    started = true;
    const logo = $("gpIntroLogo").querySelector("svg"),
      favicon = document.querySelector('link[rel="icon"]');
    if (logo && favicon)
      favicon.href = "data:image/svg+xml," + encodeURIComponent(logo.outerHTML);
    setupSlider();
    setupCruise();
    preferencesChanged();
    $("gpIntroSkip").addEventListener("click", () => finish(true));
    $("gpReplayIntro").addEventListener("click", () => showIntro(true));
    reduceMotion.addEventListener("change", preferencesChanged);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && introBusy) settleEntrance?.();
      syncCruise();
    });
    window.addEventListener("blur", () => {
      if (activePointer !== null) {
        resetPointer();
        drawSlide(0);
      }
      draggingTrack = false;
      syncCruise();
    });
    window.addEventListener("resize", () => {
      if (introBusy) settleEntrance?.();
      else if (activeIntro()) {
        resetPointer();
        drawSlide(0);
      }
      syncCruise();
    });
    window.addEventListener("pagehide", () => {
      stopCruise();
      settleEntrance?.();
    });
    window.addEventListener("pageshow", syncCruise);
    showIntro(false);
    render();
  }
  window.WelcomeV2 = {
    render,
    replay: () => showIntro(true),
    viewChanged,
    preferencesChanged,
    getStatus: () => ({
      introFinished,
      introBusy,
      animations: animations.size,
      cruiseTimerActive: cruiseTimer !== null,
      backgroundLocks: background.size,
    }),
  };
  if (document.readyState === "loading")
    window.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
