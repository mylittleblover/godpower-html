/* Power-mushroom second score phase, retaining the established 720ms handoff. */
const RoundFeedback = (() => {
  function afterPowerRound(powerBefore) {
    const targets = powerBefore
      .filter((answer) => answer.answered && answer.correct)
      .map((answer) => state.groups.find((group) => group.id === answer.id))
      .filter(Boolean)
      .map((group) => group.id);
    if (!targets.length) return;
    setTimeout(() => {
      try {
        if (activeScoreAnimId) {
          cancelAnimationFrame(activeScoreAnimId);
          activeScoreAnimId = null;
        }
        const updates = [];
        targets.forEach((id) => {
          const group = state.groups.find((candidate) => candidate.id === id);
          if (!group) return;
          const target = Number(group.score) || 0,
            start = Number(group.displayScore);
          const visible = Number.isFinite(start) ? start : target;
          if (visible !== target)
            updates.push({ groupId: group.id, start: visible, target });
          else group.displayScore = target;
        });
        const refresh = () => {
          try {
            renderDashboard();
            renderChart();
            updateHeaderStats();
          } catch (error) {
            console.warn("Power round presentation refresh failed", error);
          }
        };
        if (updates.length) animateScores(updates, refresh);
        else refresh();
      } catch (error) {
        console.warn("Power mushroom score sync failed", error);
      }
    }, 720);
  }
  return { afterPowerRound };
})();
