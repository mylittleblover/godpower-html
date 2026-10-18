/* Draw-only blocks: special pool -> probability -> restricted weights -> no-repeat -> cooldown commit. */
const ItemDrawBlocks = (() => {
  function pick(group, batchUsed = new Set()) {
    const config = ItemModules.configuration().items;
    const held = heldItemKeysV281(group);
    if (handItemDrawGroupId === group?.id && firstHandDrawPendingV218) {
      const pool = FIRST_HAND_POOL_V218.filter(
        (key) =>
          ITEM_DEFS[key] &&
          !held.has(key) &&
          config[key].draw.enabled &&
          config[key].draw.weight > 0,
      );
      firstHandDrawPendingV218 = false;
      if (pool.length) {
        const equal = pool.every(
          (key) => config[key].draw.weight === config[pool[0]].draw.weight,
        );
        const key = equal
          ? pool[Math.floor(Math.random() * pool.length)]
          : weightedPick(
              Object.fromEntries(
                pool.map((key) => [key, config[key].draw.weight]),
              ),
            );
        commitSessionDrawV21710(group, key);
        return key;
      }
    }
    const leader = rankIndex(group.id) === 0;
    if (leader && !held.has("horn")) {
      const weight = config.horn.draw.enabled ? config.horn.draw.weight : 0;
      const chance = weight ? (0.1 * weight) / (0.9 + 0.1 * weight) : 0;
      if (Math.random() < chance) {
        commitSessionDrawV21710(group, "horn");
        return "horn";
      }
    }
    const before = suppressFirstHornV218;
    if (leader) suppressFirstHornV218 = true;
    let weights;
    try {
      weights = sessionRestrictedWeightsV21710(group);
    } finally {
      suppressFirstHornV218 = before;
    }
    let key = weightedPickNoRepeatV281(
      weights,
      new Set([...batchUsed, ...held]),
    );
    if (!key) key = weightedPickNoRepeatV281(weights, held);
    if (!key) return null;
    commitSessionDrawV21710(group, key);
    return key;
  }
  return { pick };
})();
