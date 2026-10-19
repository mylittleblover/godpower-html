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
    const result = settleBaseRoundLegacy();
    RoundItemEffects.settle(context);
    ensureV2State();
    state.itemGlobal.pkTotal = (state.itemGlobal.pkTotal || 0) + 1;
    saveState();
    RoundFeedback.afterPowerRound(context.powerBefore);
    RoundItemEffects.expire(context);
    return result;
  }
  return { execute };
})();
