/* Manual score application commands; one pre-operation snapshot and one persistence result. */
const ManualScoreCommands = (() => {
  function adjust(groupId, delta) {
    Reliability.invalidateDefenseDecisions();
    cancelScoreAnimationAndSync();
    if (state.isLocked) {
      openPwdModal();
      return;
    }
    const g = state.groups.find((x) => x.id === groupId);
    if (!g) return;

    let plan;
    try {
      plan = ScoreAdjustments.delta(g, delta);
    } catch (error) {
      showToast(error.message);
      return false;
    }
    const {
      before: oldScore,
      after: targetScore,
      delta: actualDelta,
      milestone: isMilestone,
    } = plan;
    const clipped = false;
    if (actualDelta === 0) {
      showToast(`${g.name} 已是 0 分，无法继续扣分`);
      return;
    }
    const committed = runClassroomCommand(
      `${g.name} 积分调整 (${actualDelta > 0 ? "+" : ""}${actualDelta})`,
      () => {
        g.score = targetScore;
        return true;
      },
      { source: "manual" },
    );
    if (!committed) return false;

    if (isMilestone) {
      playSound("big_win");
      showMilestoneBanner(groupId);
    } else {
      if (delta >= 4) playSound("big_win");
      else if (delta > 0) playSound("score_add");
      else playSound("score_sub");
    }

    animateScores([{ groupId, start: oldScore, target: targetScore }]);
    ClassroomFeedback.score(g.name, actualDelta);
    showToast(
      clipped
        ? `${g.name} 扣 ${-actualDelta} 分（输入 ${delta}，已截断至 0 分）`
        : `${g.name} 积分更新：${delta > 0 ? "+" : ""}${delta}`,
    );
    return true;
  }

  function set(groupId, targetScore) {
    const group = state.groups.find((g) => g.id === groupId);
    if (!group) return false;
    let plan;
    try {
      plan = ScoreAdjustments.set(group, targetScore);
    } catch (error) {
      showToast(error.message);
      return false;
    }
    const committed = runClassroomCommand(
      `${group.name} 手动设定分数为 ${targetScore}`,
      () => {
        group.score = plan.after;
        state.editingScoreId = null;
        return true;
      },
      { source: "manual" },
    );
    if (!committed) return false;
    playSound("score_add");
    animateScores([{ groupId, start: plan.before, target: plan.after }]);
    return true;
  }
  return { adjust, set };
})();
