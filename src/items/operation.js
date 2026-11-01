/* Operation pipeline. Draw policy has no access to this executor. */
globalThis.RedirectedItemInstances = new WeakSet();
const ItemOperationBlocks = (() => {
  const targets = Object.fromEntries(
    [
      "self",
      "randomOther",
      "above",
      "below",
      "leader",
      "adjacent",
      "aheadInclusive",
      "behindInclusive",
      "allAhead",
      "threeAhead",
      "randomAhead",
      "randomUnfrozen",
      "blast",
    ].map((kind) => [
      kind,
      (context) =>
        ItemTargets.select(kind, context, {
          random: () => Math.random(),
          eligible: eligibleForItems,
        }),
    ]),
  );
  const effects = {
    kamek(c) {
      const pool = [...c.others];
      if (!pool.length) return false;
      const count = 1 + Math.floor(Math.random() * Math.min(3, pool.length));
      c.targets = [];
      for (let i = 0; i < count; i++) {
        const target = pool.splice(
          Math.floor(Math.random() * pool.length),
          1,
        )[0];
        c.targets.push(target);
        if (tryDefend(target, "kamek")) {
          c.blocked.add(target.id);
          continue;
        }
        const key =
          CompetitionEffects.negative[
            Math.floor(Math.random() * CompetitionEffects.negative.length)
          ];
        CompetitionEffects.apply(target, key);
      }
      return true;
    },
    itemBox(c) {
      // Free the caster's consumed slot before distributing; one session, one transaction.
      consumeInventoryItem(c.group, c.index, 1);
      c.consumed = true;
      const previous = activeDrawSessionV21710;
      const t = ensureDrawSessionThrottleV21710();
      activeDrawSessionV21710 = {
        no: ++t.sessionNo,
        kind: "item-box",
        selectedGlobalUnique: new Set(),
      };
      const batch = new Set();
      c.targets = [];
      try {
        const recipients = state.groups
          .filter((g) => eligibleForItems(g) && g.inventory.length < 3)
          .sort((a, b) =>
            String(a.groupUid || a.id).localeCompare(
              String(b.groupUid || b.id),
            ),
          );
        for (const group of recipients) {
          const key = pickItemForGroupV281(group, batch);
          if (!key) continue;
          if (!addItemToGroup(group, key)) throw Error("道具箱分发失败");
          batch.add(key);
          c.targets.push(group);
          const acquired = group.inventory.at(-1);
          c.command?.emit(
            "ITEM_ACQUIRED",
            { type: "group", id: group.groupUid },
            {
              seasonId: state.seasonId,
              itemKey: key,
              itemInstanceId: acquired?.itemInstanceId || null,
              source: "item-box",
            },
          );
        }
      } finally {
        activeDrawSessionV21710 = previous;
      }
      return true;
    },
    fraction(c) {
      for (const target of c.targets) {
        let result;
        if (c.blueprint.denominator === 5) {
          const amount = Math.round(Math.max(0, Number(target.score) || 0) / 5);
          result =
            amount > 0
              ? applyItemScore(target, -amount, c.group.id, c.key)
              : { blocked: tryDefend(target, c.key) };
        } else
          result = damageFraction(
            target,
            c.blueprint.denominator,
            c.group.id,
            c.key,
          );
        if (
          c.key === "fire_flower" &&
          !result?.blocked &&
          !result?.changed &&
          roundQuarter(target.score) === 0
        )
          result = { ...result, blocked: tryDefend(target, c.key) };
        if (result?.blocked) c.blocked.add(target.id);
        if (!result?.blocked) {
          if (c.key === "fire_flower") CompetitionEffects.apply(target, "burn");
          if (c.key === "boomerang_flower")
            CompetitionEffects.apply(target, "dizziness");
        }
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
            : { changed: false, blocked: tryDefend(t, c.key) };
        if (result.blocked) c.blocked.add(t.id);
        if (!result.blocked) CompetitionEffects.apply(t, "freeze");
      }
      return true;
    },
    mask(c) {
      state.itemGlobal.blooperUntil = Date.now() + c.blueprint.milliseconds;
      startBlooperClock();
      return true;
    },
    lightning(c) {
      c.targets.forEach((t) => {
        if (!applyLightningHitV2116(c.group, t)) c.blocked.add(t.id);
      });
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
  function run(key, group, index, command, presentation = {}) {
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
      command,
      blocked: new Set(),
    };
    context.targets =
      targets[blueprint.target](context).filter(eligibleForItems);
    if (!context.targets.length && !blueprint.allowEmpty) {
      showToast("当前没有可用目标");
      return false;
    }
    const targeted = ["fraction", "freeze"].includes(blueprint.effect);
    if (CompetitionEffects.redirect(group, targeted, () => Math.random())) {
      if (!eligibleForItems(group)) return false;
      context.targets = [group];
      context.redirectedItem = group.inventory[index];
      RedirectedItemInstances.add(context.redirectedItem);
    }
    const before = snapshotScoresV21732();
    const beforeEffects = new Map(
      state.groups.map((g) => [
        g.id,
        JSON.stringify(g.competitionEffects || {}),
      ]),
    );
    itemScoreBatchDepthV21732++;
    try {
      if (effects[blueprint.effect](context) === false) return false;
      Object.assign(presentation, {
        key,
        caster: { id: group.id, name: group.name },
        targets: context.targets.map((target) => ({
          id: target.id,
          name: target.name,
          blocked: context.blocked.has(target.id),
          delta:
            Number(target.score) -
            (before.get(String(target.id)) ?? Number(target.score)),
          status: CompetitionEffects.labels(target).join("；"),
          effectChanged:
            beforeEffects.get(target.id) !==
            JSON.stringify(target.competitionEffects || {}),
        })),
      });
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
      if (!presentation.fromHand)
        showItemUseFx(
          key,
          group.id,
          context.targets.length
            ? "目标：" + context.targets.map((g) => g.name).join("、")
            : "没有可用目标 · 本次已消耗",
        );
      if (!presentation.fromHand)
        showToast(`${group.name} 使用了 ${ITEM_DEFS[key].name}`);
      return true;
    } finally {
      if (context.redirectedItem)
        RedirectedItemInstances.delete(context.redirectedItem);
      itemScoreBatchDepthV21732 = Math.max(0, itemScoreBatchDepthV21732 - 1);
      queueItemScoreChangesV21732(before);
    }
  }
  return { run, blueprints: () => ItemBlueprints };
})();
