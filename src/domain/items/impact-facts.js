/* Facts derived only from the committed before/after score of one item command. */
const ItemImpactFacts = (() => {
  function scoreLosses(
    beforeGroups,
    afterGroups,
    { actorGroupUid, itemKey, seasonId },
  ) {
    if (!Array.isArray(beforeGroups) || !Array.isArray(afterGroups)) return [];
    if (typeof actorGroupUid !== "string" || !actorGroupUid) return [];
    if (typeof itemKey !== "string" || !itemKey) return [];

    const beforeByUid = new Map(
      beforeGroups
        .filter((group) => typeof group?.groupUid === "string")
        .map((group) => [group.groupUid, group]),
    );
    const facts = [];
    for (const after of afterGroups) {
      if (
        !after ||
        typeof after.groupUid !== "string" ||
        after.groupUid === actorGroupUid
      )
        continue;
      const before = beforeByUid.get(after.groupUid);
      const scoreBefore = before?.score;
      const scoreAfter = after.score;
      if (
        !Number.isSafeInteger(scoreBefore) ||
        !Number.isSafeInteger(scoreAfter) ||
        scoreAfter >= scoreBefore
      )
        continue;
      facts.push({
        aggregate: { type: "group", id: after.groupUid },
        payload: {
          seasonId: typeof seasonId === "string" ? seasonId : null,
          itemKey,
          attackerGroupUid: actorGroupUid,
          scoreBefore,
          scoreAfter,
          scoreLost: scoreBefore - scoreAfter,
        },
      });
    }
    return facts;
  }

  return { scoreLosses };
})();
