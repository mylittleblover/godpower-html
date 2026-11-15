/* Simultaneous power overtake calculation; neither array traversal nor UI determines results. */
const PowerRound = (() => {
  function calculate({ before, after, answers, activeIds }) {
    const ordered = before
        .map((g, i) => ({ ...g, index: i }))
        .sort((a, b) => b.score - a.score || a.index - b.index),
      scores = new Map(after.map((g) => [g.id, g.score])),
      active = new Set(activeIds),
      valid = new Map(answers.map((a) => [a.id, a]));
    const updates = [];
    for (const group of ordered) {
      const answer = valid.get(group.id);
      if (!active.has(group.id) || !answer?.answered || !answer.correct)
        continue;
      const position = ordered.findIndex((g) => g.id === group.id);
      const upper = ordered
        .slice(0, position)
        .toReversed()
        .find((g) => g.score > group.score);
      if (!upper || !scores.has(group.id) || !scores.has(upper.id)) continue;
      const score = Math.max(scores.get(group.id), scores.get(upper.id) + 1);
      if (!Number.isSafeInteger(score))
        throw Error("强力冲刺蘑菇计分超出安全整数范围");
      updates.push({ id: group.id, score });
    }
    return updates;
  }
  return Object.freeze({ calculate });
})();
