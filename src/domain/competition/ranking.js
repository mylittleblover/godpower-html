/* Stable score ordering; no rank-rule changes or mutation of caller data. */
const RankingRules = (() => {
  function ordered(groups) {
    return groups
      .map((group, index) => ({ group, index }))
      .sort(
        (a, b) =>
          (Number(b.group.score) || 0) - (Number(a.group.score) || 0) ||
          a.index - b.index,
      )
      .map((entry) => entry.group);
  }
  return { ordered };
})();
