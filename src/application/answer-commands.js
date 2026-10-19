/* Answer controls share transaction safety without changing the legacy undo list. */
const AnswerCommands = (() => {
  function select(groupId, opt) {
    if (!state.roundActive || state.evaluated) return;
    const group = state.groups.find((g) => g.id === groupId);
    if (!group) return;
    playSound("ui_click");
    return runClassroomCommand(
      `${group.name} 选择答案`,
      () => {
        group.selectedOpt = group.selectedOpt === opt ? "" : opt;
        return true;
      },
      { recordHistory: false },
    );
  }
  function toggleAllIn(groupId) {
    const group = state.groups.find((g) => g.id === groupId);
    if (
      group &&
      state.roundActive &&
      !state.evaluated &&
      group.itemUsedThisRound
    ) {
      showToast(`${group.name} 本题已经使用过道具，不能再 All In`);
      return false;
    }
    if (!state.roundActive || state.evaluated || !group) return;
    playSound("ui_click");
    const committed = runClassroomCommand(
      `${group.name} 切换 All In`,
      () => {
        group.allIn = !group.allIn;
        return true;
      },
      { recordHistory: false },
    );
    if (!committed) return false;
    const ratioMet = checkAllInRatio();
    if (ratioMet) {
      if (bgmEngine.state === "THINKING") {
        bgmTransitionThinkingToBattle();
      }
    } else {
      if (bgmEngine.state === "BATTLE" || bgmEngine.state === "TRANSITION") {
        bgmTransitionBattleToThinking();
      }
    }
  }

  return { select, toggleAllIn };
})();
