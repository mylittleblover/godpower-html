/* Operation pipeline. Draw policy has no access to this executor. */
const ItemOperationBlocks = (() => {
  const randomOne = (pool) =>
    pool.length ? [pool[Math.floor(Math.random() * pool.length)]] : [];
  const targets = {
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
    threeAhead: (c) => [c.ranking[Math.max(0, c.position - 3)]].filter(Boolean),
    randomAhead: (c) =>
      c.ranking
        .slice(0, c.position)
        .filter(eligibleForItems)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3),
    randomUnfrozen: (c) =>
      randomOne(c.others.filter((t) => !t.itemEffect?.iceLock)),
    blast: (c) => {
      const [center] = randomOne(c.others);
      if (!center) return [];
      const i = c.ranking.indexOf(center);
      return [c.ranking[i - 1], center, c.ranking[i + 1]].filter(
        (t) => t && t.id !== c.group.id,
      );
    },
  };
  const effects = {
    fraction(c) {
      for (const target of c.targets) {
        if (c.blueprint.denominator === 5) {
          const amount = Math.round(Math.max(0, Number(target.score) || 0) / 5);
          if (amount > 0) applyItemScore(target, -amount, c.group.id, c.key);
        } else
          damageFraction(target, c.blueprint.denominator, c.group.id, c.key);
        if (c.key === "bomb") flashBomb(target.id);
      }
      return true;
    },
    boost(c) {
      c.targets.forEach((t) => boostFraction(t, c.blueprint.denominator));
      return true;
    },
    flat(c) {
      c.group.score += ItemModules.scoreDelta(c.key, c.blueprint.amount);
      c.group.displayScore = c.group.score;
      return true;
    },
    freeze(c) {
      for (const t of c.targets) {
        const amount = Math.round(
          Math.max(0, Number(t.score) || 0) / c.blueprint.denominator,
        );
        const result =
          amount > 0
            ? applyItemScore(t, -amount, c.group.id, c.key)
            : { changed: false };
        if (!result.blocked)
          t.itemEffect = {
            ...(t.itemEffect || {}),
            iceLock: 1,
            iceRoundsLeftV218: c.blueprint.rounds,
          };
      }
      return true;
    },
    mask(c) {
      state.itemGlobal.blooperUntil = Date.now() + c.blueprint.milliseconds;
      startBlooperClock();
      return true;
    },
    lightning(c) {
      c.targets.forEach((t) => applyLightningHitV2116(c.group, t));
      return true;
    },
    status(c) {
      if (c.group.itemEffect) {
        showToast("已有持续型状态，当前不能激活新的持续道具");
        return false;
      }
      c.group.itemEffect = {
        type: c.blueprint.type,
        ...(c.blueprint.hits
          ? { hitsLeft: c.blueprint.hits }
          : { roundsLeft: c.blueprint.rounds }),
        startedAt: Date.now(),
      };
      return true;
    },
    dodge(c) {
      c.group.itemEffect = { ...(c.group.itemEffect || {}), featherDodge: 1 };
      return true;
    },
    overtake(c) {
      c.group.score = Number(c.targets[0].score) + 1;
      c.group.displayScore = c.group.score;
      c.group.itemEffect = null;
      return true;
    },
    steal(c) {
      const above = c.targets[0];
      if (!above || !above.inventory?.length) {
        consumeInventoryItem(c.group, c.index, 1);
        c.consumed = true;
        if (
          !c.group.inventory.some((it) => it.key === "mushroom") &&
          c.group.inventory.length < 3
        )
          c.group.inventory.push(ItemModules.inventory("mushroom"));
      } else {
        const ix = above.inventory.length - 1;
        if (
          ix === 0 &&
          above.itemEffect?.type === above.inventory[0]?.key &&
          ["star", "mega", "power"].includes(above.itemEffect.type)
        ) {
          // Compatibility: an occupied persistent slot cannot be stolen; the old
          // handler still grants timed protection without consuming boo or used stats.
          c.group.booShield = 1;
          c.group.booRoundsLeftV218 = 3;
          c.consumed = true;
          c.noStats = true;
          return true;
        }
        const stolen = above.inventory.splice(ix, 1)[0];
        consumeInventoryItem(c.group, c.index, 1);
        c.consumed = true;
        c.group.inventory.push(stolen);
      }
      c.group.booShield = 1;
      c.group.booRoundsLeftV218 = 3;
      return true;
    },
  };
  function run(key, group, index) {
    const blueprint = ItemBlueprints[key];
    if (!blueprint) throw Error("道具模块未注册：" + key);
    const ordered = ranking(),
      position = ordered.findIndex((g) => g.id === group.id);
    const context = {
      key,
      group,
      index,
      blueprint,
      ranking: ordered,
      position,
      others: state.groups.filter(
        (g) => g.id !== group.id && eligibleForItems(g),
      ),
      consumed: false,
    };
    context.targets =
      targets[blueprint.target](context).filter(eligibleForItems);
    if (!context.targets.length && !blueprint.allowEmpty) {
      showToast("当前没有可用目标");
      return false;
    }
    const before = snapshotScoresV21732();
    itemScoreBatchDepthV21732++;
    try {
      if (effects[blueprint.effect](context) === false) return false;
      if (!context.consumed && !blueprint.retain)
        consumeInventoryItem(group, index, 1);
      group.itemStats = group.itemStats || {};
      if (!context.noStats)
        group.itemStats.used = (Number(group.itemStats.used) || 0) + 1;
      if (
        blueprint.continuation &&
        group.inventory?.[0]?.key === key &&
        group.inventory[0].charges > 0
      )
        group.roundItemContinuationKeyV218 = key;
      else if (blueprint.continuation)
        delete group.roundItemContinuationKeyV218;
      if (blueprint.punishOvertake !== false)
        detectOvertakePunish(
          group.id,
          ordered.map((g) => g.id),
        );
      showItemUseFx(
        key,
        group.id,
        context.targets.length
          ? "目标：" + context.targets.map((g) => g.name).join("、")
          : "没有可用目标 · 本次已消耗",
      );
      showToast(`${group.name} 使用了 ${ITEM_DEFS[key].name}`);
      return true;
    } finally {
      itemScoreBatchDepthV21732 = Math.max(0, itemScoreBatchDepthV21732 - 1);
      queueItemScoreChangesV21732(before);
    }
  }
  return { run, blueprints: () => ItemBlueprints };
})();
