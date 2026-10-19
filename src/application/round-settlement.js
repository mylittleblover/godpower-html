/* One ordered settlement pipeline replacing the legacy function override chain. */
const RoundSettlement = (() => {
  function execute() {
    if (!state.roundActive || state.evaluated || !state.correctAns)
      return false;
    const context = {
      rankingsBefore: ranking().map((group) => group.id),
      answersBefore: state.groups.map((group) => ({
        id: group.id,
        answered: !!group.selectedOpt,
        correct: group.selectedOpt === state.correctAns,
      })),
      powerBefore: state.groups
        .filter((group) => group?.itemEffect?.type === "power")
        .map((group) => ({
          id: group.id,
          answered: !!group.selectedOpt,
          correct:
            !!group.selectedOpt && group.selectedOpt === state.correctAns,
        })),
    };
    const presentation = settleBaseRoundLegacy();
    if (!presentation) return false;
    RoundItemEffects.settle(context);
    ensureV2State();
    state.itemGlobal.pkTotal = (state.itemGlobal.pkTotal || 0) + 1;
    RoundItemEffects.expire(context);
    return {
      ...presentation,
      powerBefore: context.powerBefore,
    };
  }
  function present(presentation) {
    if (!presentation) return;
    const {
      flipSnapshotV21725,
      scoreUpdates,
      allInWins,
      allInLosses,
      hasNormalWin,
      hasMilestone,
      milestoneGroups,
      powerBefore,
    } = presentation;
    RoundFeedback.afterPowerRound(
      powerBefore,
      RoundSettlement.captureRoundToken(),
    );
    animateCardsFromSnapshotV21725(flipSnapshotV21725);
    state.groups.forEach((group) => {
      if (!group.selectedOpt || !group.allIn) return;
      const card = document.querySelector(
        `.group-row-card[data-group-id="${group.id}"]`,
      );
      if (!card) return;
      card.classList.add(
        group.selectedOpt === state.correctAns ? "anim-win" : "anim-loss",
      );
      setTimeout(() => {
        card.classList.remove("anim-win", "anim-loss");
      }, 1100);
    });
    if (scoreUpdates.length) animateScores(scoreUpdates);
    if (hasMilestone) {
      playSound("big_win");
      milestoneGroups.forEach(showMilestoneBanner);
    }
    bgmTriggerVictory(() => {
      if (allInWins > 0) playSound("allin_win");
      else if (allInLosses > 0) playSound("allin_lose");
      else if (hasNormalWin) playSound("pk_correct");
    });
  }
  let forceEndGeneration = 0;
  async function start() {
    const flipSnapshot = captureCardRectsV21725();
    const committed = runClassroomCommand(
      "开始新回合",
      () => {
        resetRoundItemUseLocksV2177();
        state.hasStartedOnce = true;
        state.roundActive = true;
        state.evaluated = false;
        state.correctAns = "";
        state.groups.forEach((g) => {
          g.selectedOpt = "";
          g.allIn = false;
          g.resultText = "";
          g.animState = "";
        });
        return true;
      },
      { recordHistory: false },
    );
    if (!committed) return false;
    const result = await classroomCommands.whenIdle();
    if (!result.ok) return false;
    v213SuppressReorderAnimation = true;
    try {
      renderAll();
    } finally {
      v213SuppressReorderAnimation = false;
    }
    animateCardsFromSnapshotV21725(flipSnapshot);
    return true;
  }
  function captureRoundToken() {
    return {
      classroom: state,
      groups: state.groups,
      season: state.seasonId,
      generation: forceEndGeneration,
      phase: JSON.stringify({
        roundActive: state.roundActive,
        evaluated: state.evaluated,
        correctAns: state.correctAns,
        groups: state.groups.map((g) => [g.id, g.selectedOpt, g.allIn]),
      }),
    };
  }
  function isRoundTokenCurrent(token) {
    if (
      !token ||
      state !== token.classroom ||
      state.groups !== token.groups ||
      state.seasonId !== token.season ||
      forceEndGeneration !== token.generation
    )
      return false;
    return (
      token.phase ===
      JSON.stringify({
        roundActive: state.roundActive,
        evaluated: state.evaluated,
        correctAns: state.correctAns,
        groups: state.groups.map((g) => [g.id, g.selectedOpt, g.allIn]),
      })
    );
  }
  Reliability.onDefenseInvalidation(() => {
    forceEndGeneration++;
  });
  async function forceEnd() {
    if (!state.roundActive || state.evaluated) return false;
    const classroom = state,
      groups = state.groups,
      season = state.seasonId;
    const fingerprint = JSON.stringify({
      roundActive: state.roundActive,
      evaluated: state.evaluated,
      correctAns: state.correctAns,
      groups: state.groups.map((g) => [g.id, g.selectedOpt, g.allIn]),
    });
    const generation = forceEndGeneration;
    const accepted = await themeConfirm(
      "确认强制结束当前题目吗？（当前作答将作废，不进行加分结算）",
      { title: "强制结束题目", danger: true, confirmText: "强制结束" },
    );
    if (!accepted) return false;
    if (!ClassroomWriteBarrier.allow()) return false;
    if (
      state !== classroom ||
      state.groups !== groups ||
      state.seasonId !== season ||
      forceEndGeneration !== generation ||
      JSON.stringify({
        roundActive: state.roundActive,
        evaluated: state.evaluated,
        correctAns: state.correctAns,
        groups: state.groups.map((g) => [g.id, g.selectedOpt, g.allIn]),
      }) !== fingerprint
    ) {
      showToast("课堂状态已变化，未强制结束题目。");
      return false;
    }
    const flipSnapshot = captureCardRectsV21725();
    const committed = runClassroomCommand("教师强制结束本题", () => {
      state.roundActive = true;
      state.evaluated = true;
      return true;
    });
    if (!committed) return false;
    const result = await classroomCommands.whenIdle();
    if (!result.ok) return false;
    bgmStopAll();
    v213SuppressReorderAnimation = true;
    renderAll();
    v213SuppressReorderAnimation = false;
    animateCardsFromSnapshotV21725(flipSnapshot);
    showToast("当前题目已强制结束");
    return true;
  }
  return {
    execute,
    present,
    start,
    forceEnd,
    captureRoundToken,
    isRoundTokenCurrent,
  };
})();
