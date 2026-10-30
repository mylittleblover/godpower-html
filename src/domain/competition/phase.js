/* Compatibility projection for the persisted pre-state-machine round flags. */
const CompetitionPhase = (() => {
  function derive(round) {
    if (!round.hasStartedOnce) return "NOT_STARTED";
    if (!round.roundActive) return "FINISHED";
    if (round.evaluated) return "SETTLED";
    return round.correctAns ? "ANSWER_SELECTED" : "ANSWERING";
  }

  return { derive };
})();
