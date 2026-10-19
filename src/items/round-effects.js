/* Explicit compatibility owner for item effects applied after base answer scoring. */
const RoundItemEffects = (() => {
  function settle({ rankingsBefore, answersBefore }) {
    answersBefore.forEach((answer) => {
      const group = state.groups.find(
        (candidate) => candidate.id === answer.id,
      );
      if (!group || !answer.answered) return;
      if (answer.correct) group.itemStats.correct++;
      else group.itemStats.wrong++;
      if (group.itemEffect && group.itemEffect.type === "power") {
        group.itemEffect.roundsLeft--;
        if (answer.correct && eligibleForItems(group)) {
          const sorted = ranking(),
            position = sorted.findIndex(
              (candidate) => candidate.id === group.id,
            );
          if (position > 0) {
            group.score = sorted[position - 1].score + 1;
            group.displayScore = group.score;
          }
        }
        if (group.itemEffect && group.itemEffect.roundsLeft <= 0) {
          const index = group.inventory.findIndex(
            (item) => item.key === "power",
          );
          if (index >= 0) group.inventory.splice(index, 1);
          group.itemEffect = null;
        }
      }
      detectOvertakePunish(group.id, rankingsBefore);
    });
    return true;
  }
  function expire({ answersBefore }) {
    const answered = new Map(
      answersBefore.map((answer) => [answer.id, answer.answered]),
    );
    state.groups.forEach((group) => {
      if (group.itemEffect?.iceLock && answered.get(group.id)) {
        const left = Number(group.itemEffect.iceRoundsLeftV218 || 3) - 1;
        group.itemEffect.iceRoundsLeftV218 = left;
        if (left <= 0) {
          delete group.itemEffect.iceLock;
          delete group.itemEffect.iceRoundsLeftV218;
          if (!Object.keys(group.itemEffect).length) group.itemEffect = null;
          showToast(`${group.name} 的冰冻状态已自然解除`);
        }
      }
      if (Number(group.booRoundsLeftV218 || 0) > 0 && answered.get(group.id)) {
        group.booRoundsLeftV218 = Math.max(
          0,
          Number(group.booRoundsLeftV218) - 1,
        );
        if (group.booRoundsLeftV218 <= 0) {
          group.booShield = 0;
          delete group.booRoundsLeftV218;
        }
      }
      delete group.roundItemContinuationKeyV218;
    });
    return true;
  }
  return { settle, expire };
})();
