window.addEventListener("DOMContentLoaded", () => {
  if (state.zoomLevel !== 1.0) {
    document.body.style.zoom = state.zoomLevel;
  }
  initResizerDrag();
  renderAll();
  renderWelcomePage();
  startWelcomeClock();

  // ===== 滑动解锁入场与音频启动 =====
  // 欢迎弹窗已被独立的 SVG 入场动画替代；首次解锁手势由 WelcomeV2 处理。

  window.hideAudioHint = () => {
    const bar = document.getElementById("audioHintBar");
    if (bar) bar.style.display = "none";
  };
  window.tryAutoResumeAndPlay = () => {
    getAudioContext()
      .then(() => {
        if (
          audioCtx &&
          audioCtx.state === "running" &&
          menuCfg.enabled &&
          bgmEngine.state === "IDLE" &&
          !menuBgm.active &&
          currentView !== "battle"
        ) {
          menuStartOrSwitch(getMenuTrackKeyForView(currentView));
          hideAudioHint();
        }
      })
      .catch(() => {});
  };
  // 关闭弹窗后启动重试兜底：每秒尝试恢复，连续 3 次失败（约 3 秒）显示提示条
  let autoPlayRetries = 0;
  let resumeRetryTimer = null;
  window.startResumeRetry = () => {
    if (resumeRetryTimer) return;
    resumeRetryTimer = setInterval(() => {
      if (audioCtx && audioCtx.state === "running") {
        clearInterval(resumeRetryTimer);
        resumeRetryTimer = null;
        hideAudioHint();
        return;
      }
      autoPlayRetries++;
      if (autoPlayRetries === 3) {
        const bar = document.getElementById("audioHintBar");
        if (bar && currentView !== "battle") bar.style.display = "block";
      }
      if (autoPlayRetries > 30) {
        clearInterval(resumeRetryTimer);
        resumeRetryTimer = null;
        return;
      }
      tryAutoResumeAndPlay();
    }, 1000);
  };
  window.closeWelcomeModal = () => {
    const m = document.getElementById("welcomeModal");
    if (m) hideClassroomWindow(m);
    hideAudioHint();
    startResumeRetry();
    tryAutoResumeAndPlay();
  };

  // 首次手势兜底：任意点击/按键/触摸即恢复音频并启动当前页面菜单配乐（欢迎弹窗未关闭时不启动）
  const unlockByGesture = () => {
    getAudioContext()
      .then(() => {
        hideAudioHint();
        const wm = document.getElementById("welcomeModal");
        if (wm && wm.classList.contains("active")) return;
        startResumeRetry();
        if (
          menuCfg.enabled &&
          bgmEngine.state === "IDLE" &&
          currentView !== "battle"
        ) {
          if (!menuBgm.active)
            menuStartOrSwitch(getMenuTrackKeyForView(currentView));
        }
      })
      .catch(() => {});
  };
  ["pointerdown", "keydown", "touchstart"].forEach((ev) =>
    window.addEventListener(ev, unlockByGesture, { once: true, passive: true }),
  );

  initDB().then(() => {
    scheduleIdleTask(() => preloadInitialAudio(), 800);
    // 后台预加载全部菜单配乐：消除首次切页的加载延迟，保证任意页面切换即时无缝过渡
    scheduleIdleTask(() => {
      if (menuCfg.enabled && typeof MENU_TRACK_KEYS !== "undefined") {
        MENU_TRACK_KEYS.forEach((k) => {
          menuLoadBuffer(k).catch(() => {});
        });
      }
    }, 1000);
  });
});

/* ================= 道具系统 V1 ================= */
