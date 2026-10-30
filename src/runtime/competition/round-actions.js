function handleMainAction() {
  if (!state.roundActive && !state.evaluated) {
    startRound();
  } else if (state.roundActive && !state.evaluated) {
    judgeRound();
  }
}

async function preloadInitialAudio() {
  try {
    await getAudioContext();
    if (!bgmEngine.preloadedSet) {
      await bgmPreloadNextSet();
    }
  } catch (e) {}
}

async function startRound() {
  if (isStartingRound || isSwitchingRound) return false;
  Reliability.invalidateDefenseDecisions();
  const roundToken = RoundSettlement.captureRoundToken();
  isStartingRound = true;
  const overlay = document.getElementById("initProgressOverlay");
  const fill = document.getElementById("initProgressFill");
  const txt = document.getElementById("initProgressText");

  // 零资源容错：无任何可播放的战斗音频时，0.05s 内跳过加载动画，静音启动全部教学功能
  try {
    await getAudioContext();
    const playable = await Promise.race([
      hasAnyPlayableBgm(),
      new Promise((res) => setTimeout(() => res(false), 2500)),
    ]);
    if (!playable) {
      if (overlay) overlay.style.display = "none";
      if (!RoundSettlement.isRoundTokenCurrent(roundToken)) {
        showToast("课堂状态已变化，未启动旧回合。");
        isStartingRound = false;
        return false;
      }
      await finishStartRound();
      showToast("未检测到战斗音频：已静音启动（0.05s 跳过加载）");
      isStartingRound = false;
      return true;
    }
  } catch (e) {
    if (overlay) overlay.style.display = "none";
    if (!RoundSettlement.isRoundTokenCurrent(roundToken)) {
      showToast("课堂状态已变化，未启动旧回合。");
      isStartingRound = false;
      return false;
    }
    await finishStartRound();
    showToast("音频初始化异常：已强制启动");
    isStartingRound = false;
    return true;
  }

  if (overlay && fill) {
    overlay.style.display = "flex";
    fill.style.width = "0%";
    if (txt) txt.innerText = "正在初始化...";
  }

  try {
    await bgmStartNewRoundMusicWithProgress((percent) => {
      if (fill) fill.style.width = `${percent}%`;
    });
    if (overlay) overlay.style.display = "none";
    if (!RoundSettlement.isRoundTokenCurrent(roundToken)) {
      showToast("课堂状态已变化，未启动旧回合。");
      return false;
    }
    await finishStartRound();
    playSound("score_add");
    showToast("初始化完毕");
    return true;
  } catch (e) {
    if (overlay) overlay.style.display = "none";
    if (!RoundSettlement.isRoundTokenCurrent(roundToken)) {
      showToast("课堂状态已变化，未启动旧回合。");
      return false;
    }
    showToast("初始化异常，已强制启动");
    await finishStartRound();
    return false;
  } finally {
    isStartingRound = false;
    if (overlay) overlay.style.display = "none";
  }
}

function finishStartRound() {
  return RoundSettlement.start();
}

async function hasAnyPlayableBgm() {
  try {
    if (!dbInitPromise) initDB();
    await dbInitPromise;
  } catch (e) {}
  if (!db) return false;
  try {
    await refreshSoundIdCache();
    const complete = await getAllCompleteSetIndices();
    if (complete.length > 0) return true;
    const fb = await getFallbackSetIndex();
    return fb !== -1;
  } catch (e) {
    return false;
  }
}

async function nextRound() {
  if (isSwitchingRound) return;
  if (!state.evaluated) {
    themeAlert(
      "请先公布正解并点击「判定结算」后，才可进入下一题 (或点击强制结束)",
    );
    return;
  }
  Reliability.invalidateDefenseDecisions();
  const roundToken = RoundSettlement.captureRoundToken();
  isSwitchingRound = true;

  const overlay = document.getElementById("initProgressOverlay");
  const fill = document.getElementById("initProgressFill");
  const txt = document.getElementById("initProgressText");

  if (overlay && fill) {
    overlay.style.display = "flex";
    fill.style.width = "0%";
    if (txt) txt.innerText = "正在初始化下一题...";
  }

  try {
    bgmStopAll();
    await bgmStartNewRoundMusicWithProgress((percent) => {
      if (fill) fill.style.width = `${percent}%`;
    });
    if (!RoundSettlement.isRoundTokenCurrent(roundToken)) {
      showToast("课堂状态已变化，未切换到下一题。");
      return false;
    }

    if (overlay) overlay.style.display = "none";
    playSound("ui_click");

    const flipSnapshotV21725 = captureCardRectsV21725();

    v213SuppressReorderAnimation = true;
    let committed;
    try {
      committed = runClassroomCommand(
        "进入下一题",
        () => {
          resetRoundItemUseLocksV2177();
          state.correctAns = "";
          state.evaluated = false;
          state.roundActive = true;
          state.groups.forEach((g) => {
            g.selectedOpt = "";
            if (!state.saveAllIn) g.allIn = false;
            g.resultText = "";
            g.animState = "";
          });
          return true;
        },
        { recordHistory: false },
      );
    } finally {
      v213SuppressReorderAnimation = false;
    }
    if (!committed) return false;
    const result = await classroomCommands.whenIdle();
    if (!result.ok) return false;
    // 根据本题初始化后的 All In 状态重新决定思考轨 / 战斗轨。
    const nextRoundAllIn = checkAllInRatio();
    if (nextRoundAllIn) {
      if (bgmEngine.state === "THINKING") bgmTransitionThinkingToBattle();
    } else if (
      bgmEngine.state === "BATTLE" ||
      bgmEngine.state === "TRANSITION"
    ) {
      bgmTransitionBattleToThinking();
    }
    animateCardsFromSnapshotV21725(flipSnapshotV21725);
    showToast("初始化完毕");
  } finally {
    isSwitchingRound = false;
    if (overlay) overlay.style.display = "none";
  }
}

function forceEndRound() {
  return RoundSettlement.forceEnd();
}
