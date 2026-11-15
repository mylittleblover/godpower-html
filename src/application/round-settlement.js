/* One ordered settlement pipeline replacing the legacy function override chain. */
const RoundSettlement = (() => {
  function execute() {
    if (!state.roundActive || state.evaluated || !state.correctAns)
      return false;
    if (typeof ensureRandomEventState === "function") ensureRandomEventState();
    for (const group of state.groups)
      if (CompetitionEffects.blockedAllIn(group)) group.allIn = false;
    const context = {
      rankingsBefore: ranking().map((group) => group.id),
      groupsBefore: state.groups.map((group) => ({
        id: group.id,
        score: group.score,
      })),
      answersBefore: state.groups.map((group) => ({
        id: group.id,
        groupUid: group.groupUid,
        answer: group.selectedOpt || "",
        allIn: !!group.allIn,
        scoreBefore: group.score,
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
    const blooperWasActive =
      (Number(state.itemGlobal?.blooperUntil) || 0) > Date.now() &&
      !state.itemGlobal?.blooperAchRecorded &&
      !!state.itemGlobal?.blooperCasterUid;
    const presentation = settleBaseRoundLegacy();
    if (!presentation) return false;
    for (const answer of context.answersBefore) {
      const fx = presentation.eventEffectsById?.[answer.id];
      if (fx) {
        answer.eventFlatBonus = fx.flatBonus || 0;
        answer.consumedStar = !!fx.consumedStar;
      }
    }
    RoundItemEffects.settle(context);
    ensureV2State();
    state.itemGlobal.pkTotal = (state.itemGlobal.pkTotal || 0) + 1;
    RoundItemEffects.expire(context);
    let randomEventOutcome = null;
    if (typeof RandomEvents !== "undefined") {
      const consumedUids = context.answersBefore
        .filter((a) => a.consumedStar && a.correct && a.groupUid)
        .map((a) => a.groupUid);
      if (consumedUids.length)
        RandomEvents.consumeStarTargets(state.randomEvents, consumedUids);
      const evStep = RandomEvents.advanceRound(
        state.randomEvents,
        state.groups,
        state.randomEventConfig,
      );
      state.randomEvents = evStep.state;
      randomEventOutcome = evStep.outcome;
    }
    const anyScoreChanged = context.groupsBefore.some((before) =>
      state.groups.some((g) => g.id === before.id && g.score !== before.score),
    );
    let blooperCasterTriggeredUid = null;
    if (blooperWasActive && anyScoreChanged) {
      state.itemGlobal.blooperAchRecorded = true;
      blooperCasterTriggeredUid = state.itemGlobal.blooperCasterUid;
    }
    const rankingsAfter = ranking();
    const groupCount = state.groups.length;
    const leaderScoreBefore = context.groupsBefore.length
      ? Math.max(...context.groupsBefore.map((g) => Number(g.score) || 0))
      : 0;
    const minScoreAfter = state.groups.length
      ? Math.min(...state.groups.map((g) => Number(g.score) || 0))
      : 0;
    const maxScoreAfter = state.groups.length
      ? Math.max(...state.groups.map((g) => Number(g.score) || 0))
      : 0;
    const rankOf = (groups, id) => {
      const group = groups.find((candidate) => candidate.id === id);
      return group
        ? 1 + groups.filter((candidate) => candidate.score > group.score).length
        : null;
    };
    return {
      ...presentation,
      randomEventOutcome,
      scoreUpdates: context.groupsBefore
        .filter((before) =>
          state.groups.some(
            (g) => g.id === before.id && g.score !== before.score,
          ),
        )
        .map((before) => ({
          groupId: before.id,
          start: before.score,
          target: state.groups.find((g) => g.id === before.id).score,
        })),
      powerBefore: context.powerBefore,
      roundFacts: context.answersBefore.map((answer) => {
        const group = state.groups.find(
          (candidate) => candidate.id === answer.id,
        );
        return {
          seasonId: state.seasonId,
          roundNumber: state.itemGlobal.pkTotal,
          groupCount,
          leaderScoreBefore,
          isLastInSeason:
            groupCount >= 5 &&
            minScoreAfter < maxScoreAfter &&
            (Number(group?.score) || 0) === minScoreAfter,
          powerCompleted: context.powerCompletedById?.[answer.id] || null,
          blooperActiveScored:
            !!blooperCasterTriggeredUid &&
            answer.groupUid === blooperCasterTriggeredUid,
          groupUid: answer.groupUid,
          answered: answer.answered,
          correct: answer.correct,
          answer: answer.answer,
          correctAnswer: state.correctAns,
          allIn: answer.allIn,
          scoreBefore: answer.scoreBefore,
          scoreAfter: group?.score ?? answer.scoreBefore,
          rankBefore: rankOf(context.groupsBefore, answer.id),
          rankAfter: rankOf(rankingsAfter, answer.id),
        };
      }),
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
    if (presentation.randomEventOutcome)
      globalThis.RandomEventUI?.presentOutcome?.(
        presentation.randomEventOutcome,
      );
    globalThis.RandomEventUI?.renderBattleStrip?.();
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
