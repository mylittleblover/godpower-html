/* Explicit compatibility owner for item effects applied after base answer scoring. */
const RoundItemEffects = (() => {
  function settle(context) {
    const { rankingsBefore, groupsBefore, answersBefore } = context;
    context.powerCompletedById = context.powerCompletedById || {};
    const powerIds = state.groups
      .filter(
        (g) =>
          g.itemEffect?.type === "power" &&
          eligibleForItems(g) &&
          answersBefore.some((a) => a.id === g.id && a.answered),
      )
      .map((g) => g.id);
    answersBefore.forEach((answer) => {
      const group = state.groups.find(
        (candidate) => candidate.id === answer.id,
      );
      if (!group || !answer.answered) return;
      if (answer.correct) group.itemStats.correct++;
      else group.itemStats.wrong++;
      if (group.itemEffect && group.itemEffect.type === "power") {
        group.itemEffect.totalAnswered =
          (Number(group.itemEffect.totalAnswered) || 0) + 1;
        if (answer.correct)
          group.itemEffect.totalCorrect =
            (Number(group.itemEffect.totalCorrect) || 0) + 1;
        group.itemEffect.roundsLeft--;

        if (group.itemEffect && group.itemEffect.roundsLeft <= 0) {
          context.powerCompletedById[group.id] = {
            totalAnswered: group.itemEffect.totalAnswered,
            totalCorrect: group.itemEffect.totalCorrect,
          };
          const index = group.inventory.findIndex(
            (item) => item.key === "power",
          );
          if (index >= 0) group.inventory.splice(index, 1);
          group.itemEffect = null;
        }
      }
      if (
        CompetitionEffects.has(group, "invincible") ||
        CompetitionEffects.has(group, "mega")
      )
        group.resultText = answer.correct
          ? answer.allIn
            ? "状态答对（总分×3）"
            : "状态答对（总分×2）"
          : "状态保护（答错保分）";
      const result = CompetitionEffects.answer(
        group,
        answer.scoreBefore,
        group.score,
        () => Math.random(),
        answer,
      );
      group.score = result.score;
      group.displayScore = group.score;
      if (!powerIds.length) detectOvertakePunish(group.id, rankingsBefore);
    });
    const before =
      groupsBefore ||
      rankingsBefore.map((id) => ({
        id,
        score: answersBefore.find((a) => a.id === id)?.scoreBefore || 0,
      }));
    const updates = PowerRound.calculate({
      before,
      after: state.groups,
      answers: answersBefore,
      activeIds: powerIds,
    });
    for (const update of updates) {
      const group = state.groups.find((g) => g.id === update.id);
      group.score = group.displayScore = update.score;
    }
    if (powerIds.length)
      for (const answer of answersBefore)
        if (answer.answered) detectOvertakePunish(answer.id, rankingsBefore);
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
      ItemRoundUse.reset(group);
    });
    return true;
  }
  return { settle, expire };
})();
