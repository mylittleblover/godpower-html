/* Target policy only: no mutation, effects, UI or ambient random generator. */
const ItemTargets = (() => {
  function select(kind, context, { random, eligible }) {
    const randomOne = (pool) =>
      pool.length ? [pool[Math.floor(random() * pool.length)]] : [];
    const selectors = {
      self: (c) => [c.group],
      randomOther: (c) => randomOne(c.others),
      above: (c) => [c.ranking[c.position - 1]].filter(Boolean),
      below: (c) => [c.ranking[c.position + 1]].filter(Boolean),
      leader: (c) => (c.ranking[0]?.id !== c.group.id ? [c.ranking[0]] : []),
      adjacent: (c) =>
        [c.ranking[c.position - 1], c.ranking[c.position + 1]].filter(Boolean),
      aheadInclusive: (c) => c.ranking.slice(0, c.position + 1),
      behindInclusive: (c) => c.ranking.slice(c.position),
      allAhead: (c) => c.ranking.slice(0, c.position),
      threeAhead: (c) =>
        [c.ranking[Math.max(0, c.position - 3)]].filter(Boolean),
      randomAhead: (c) =>
        c.ranking
          .slice(0, c.position)
          .filter(eligible)
          .sort(() => random() - 0.5)
          .slice(0, 3),
      randomUnfrozen: (c) =>
        randomOne(
          c.others.filter(
            (t) =>
              !t.itemEffect?.iceLock &&
              !globalThis.CompetitionEffects?.has(t, "freeze"),
          ),
        ),
      blast: (c) => {
        const [center] = randomOne(c.others);
        if (!center) return [];
        const i = c.ranking.indexOf(center);
        return [c.ranking[i - 1], center, c.ranking[i + 1]].filter(
          (t) => t && t.id !== c.group.id,
        );
      },
    };
    const selector = selectors[kind];
    if (typeof selector !== "function" || !Object.hasOwn(selectors, kind))
      throw new Error("Unknown item target selector: " + kind);
    return selector(context);
  }
  return { select };
})();
