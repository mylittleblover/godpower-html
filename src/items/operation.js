/* Operation pipeline. Draw policy has no access to this executor. */
globalThis.RedirectedItemInstances = new WeakSet();
const ItemOperationBlocks = (() => {
  function ensureMkwRuntimeState() {
    state.itemGlobal = state.itemGlobal || {};
    if (
      !state.itemGlobal.mkwState ||
      typeof state.itemGlobal.mkwState !== "object"
    ) {
      state.itemGlobal.mkwState = {
        matchStartedAt: Date.now(),
        lastUsedAt: {},
        lastUsedSession: {},
      };
    }
    state.itemGlobal.mkwState.lastUsedAt =
      state.itemGlobal.mkwState.lastUsedAt || {};
    state.itemGlobal.mkwState.lastUsedSession =
      state.itemGlobal.mkwState.lastUsedSession || {};
    return state.itemGlobal.mkwState;
  }
  function resolveRankParam(position1, totalGroups) {
    const policy = globalThis.ItemDrawPolicy;
    if (!policy || typeof policy.resolveRank !== "function") return null;
    const globalState = state.itemGlobal || {};
    const cfg =
      typeof policy.normalizeConfig === "function"
        ? policy.normalizeConfig(globalState.drawConfig)
        : globalState.drawConfig || {};
    if (cfg.applyPostDrawRankParams === false) return null;
    const mkw = ensureMkwRuntimeState();
    const resolved = policy.resolveRank(position1, totalGroups, {
      mode: cfg.mode,
      nowMs: Date.now(),
      matchStartedAt: mkw.matchStartedAt,
      applyRankClamp: true,
    });
    const param = policy.paramByRank(resolved.rank);
    return { cfg, mkw, resolved, param };
  }
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
      /* Statuses are exclusive, so a target that already carries one would just
         eat the curse for nothing. Prefer clean groups and only fall back to
         occupied ones once the clean pool is exhausted. */
      const hasStatus = (g) =>
        CompetitionEffects.negative.some((k) => CompetitionEffects.has(g, k)) ||
        CompetitionEffects.has(g, "invincible") ||
        CompetitionEffects.has(g, "mega");
      const clean = pool.filter((g) => !hasStatus(g));
      const pickFrom = (list) =>
        list.splice(Math.floor(Math.random() * list.length), 1)[0];
      c.targets = [];
      for (let i = 0; i < count; i++) {
        const candidates = clean.length ? clean : pool;
        if (!candidates.length) break;
        const target = pickFrom(candidates);
        // Keep the two pools in sync so a group is never chosen twice.
        const mirrored = pool.indexOf(target);
        if (mirrored >= 0) pool.splice(mirrored, 1);
        const cleanIndex = clean.indexOf(target);
        if (cleanIndex >= 0) clean.splice(cleanIndex, 1);
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
        if (
          !result.blocked &&
          CompetitionEffects.apply(t, "freeze") &&
          c.group?.groupUid
        ) {
          t.competitionEffects.freeze.casterGroupUid = c.group.groupUid;
        }
      }
      return true;
    },
    mask(c) {
      const baseMs = Number(c.blueprint.milliseconds) || 120000;
      const rp = resolveRankParam(
        Math.max(1, c.position + 1),
        c.ranking.length,
      );
      const inkLevel = rp?.param?.inkLevel || 3;
      const scale = inkLevel === 1 ? 0.5 : inkLevel === 2 ? 0.75 : 1;
      const durationMs = Math.round(baseMs * scale);
      state.itemGlobal.blooperUntil = Date.now() + durationMs;
      state.itemGlobal.blooperCasterUid = c.group?.groupUid || null;
      state.itemGlobal.blooperAchRecorded = false;
      state.itemGlobal.lastInkLevel = inkLevel;
      if (rp) {
        rp.mkw.lastParamEffect = {
          key: "blooper",
          rank: rp.resolved.rank,
          inkLevel,
          durationMs,
          at: Date.now(),
        };
        c.rankParamLabel = `Rank ${rp.resolved.rank + 1} · InkLevel ${inkLevel}`;
      }
      startBlooperClock();
      return true;
    },
    lightning(c) {
      const targetParams = c.targets
        .map((t) => {
          const pos1 = Math.max(
            1,
            c.ranking.findIndex((g) => g.id === t.id) + 1,
          );
          const rpT = resolveRankParam(pos1, c.ranking.length);
          return rpT
            ? {
                groupId: t.id,
                rank: rpT.resolved.rank,
                thunderFrame: rpT.param.thunderFrame,
              }
            : null;
        })
        .filter(Boolean);
      c.targets.forEach((t) => {
        if (!applyLightningHitV2116(c.group, t)) c.blocked.add(t.id);
      });
      if (targetParams.length) {
        const mkw = ensureMkwRuntimeState();
        mkw.lastLightningTargets = targetParams;
        mkw.lastParamEffect = {
          key: "lightning",
          targetCount: targetParams.length,
          minThunderFrame: Math.min(...targetParams.map((x) => x.thunderFrame)),
          maxThunderFrame: Math.max(...targetParams.map((x) => x.thunderFrame)),
          at: Date.now(),
        };
        c.rankParamLabel = `缩小帧 ${mkw.lastParamEffect.minThunderFrame}~${mkw.lastParamEffect.maxThunderFrame}f`;
      }
      return true;
    },
    status(c) {
      /* Status rules:
         - An existing status cannot stack a second one.
         - Invincible and mega replace the existing state outright, including
           every negative status already ticking on the group.
         - They never replace each other, so neither can be overwritten. */
      const mine = c.blueprint.type;
      const current = c.group.itemEffect?.type || null;
      const defensive = mine === "star" || mine === "mega";
      const currentDefensive = current === "star" || current === "mega";
      if (current === mine) {
        showToast("该状态已经生效，不能重复叠加");
        return false;
      }
      if (current && !defensive) {
        showToast(
          currentDefensive
            ? "当前处于无敌或巨大化，无法被其他状态替换"
            : "已有持续型状态，当前不能叠加新的状态",
        );
        return false;
      }
      if (defensive && currentDefensive) {
        showToast("无敌与巨大化不能互相替换");
        return false;
      }
      // A defensive state replaces an ordinary one; both charge counters reset.
      if (defensive && globalThis.CompetitionEffects?.arm) {
        // Defensive states live on the round clock, not on absorbed attacks.
        CompetitionEffects.arm(c.group, mine);
        c.group.itemEffect.activationId =
          globalThis.StableIdentity?.createCommandId?.() ||
          `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      } else {
        c.group.itemEffect = {
          type: mine,
          ...(c.blueprint.hits
            ? { hitsLeft: c.blueprint.hits }
            : { roundsLeft: c.blueprint.rounds }),
          ...(mine === "power" ? { totalAnswered: 0, totalCorrect: 0 } : {}),
          startedAt: Date.now(),
        };
      }
      if (current) c.replacedStatus = current;
      /* 无敌/巨大化是「强制替换」：它不仅要挡住之后施加的状态，还必须把这一刻
         已经挂在小组上的灼烧、冰冻、麻痹、中毒、眩晕全部清掉，否则界面会同时
         显示负面状态与无敌光环。 */
      if (defensive && c.group.competitionEffects) {
        const cleared = Object.keys(c.group.competitionEffects).filter(
          (name) => c.group.competitionEffects[name],
        );
        if (cleared.length) {
          c.group.competitionEffects = {};
          c.clearedStatuses = cleared;
        }
      }
      return true;
    },
    dodge(c) {
      c.group.itemEffect = { ...(c.group.itemEffect || {}), featherDodge: 1 };
      return true;
    },
    overtake(c) {
      const rp = resolveRankParam(
        Math.max(1, c.position + 1),
        c.ranking.length,
      );
      if (rp) {
        rp.mkw.lastParamEffect = {
          key: "bullet",
          rank: rp.resolved.rank,
          killerTargetRank: rp.param.killerTargetRank,
          at: Date.now(),
        };
        c.rankParamLabel = `Rank ${rp.resolved.rank + 1} · 冲刺目标名次 +${rp.param.killerTargetRank}`;
      }
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
        c.booAlternateMushroom = true;
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
  function snapshotGroupEffects(fx) {
    if (!fx || typeof fx !== "object") return null;
    const keys = Object.keys(fx);
    if (!keys.length) return null;
    const out = {};
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i],
        v = fx[k];
      out[k] = v && typeof v === "object" ? { ...v } : v;
    }
    return out;
  }
  function groupEffectsEqual(before, after) {
    const a = before || null;
    const b =
      after && typeof after === "object" && Object.keys(after).length
        ? after
        : null;
    if (a === b) return true;
    if (!a || !b) return false;
    const ak = Object.keys(a);
    const bk = Object.keys(b);
    if (ak.length !== bk.length) return false;
    for (let i = 0; i < ak.length; i++) {
      const k = ak[i];
      if (!Object.hasOwn(b, k)) return false;
      const av = a[k],
        bv = b[k];
      if (av === bv) continue;
      if (!av || !bv || typeof av !== "object" || typeof bv !== "object")
        return false;
      const avk = Object.keys(av),
        bvk = Object.keys(bv);
      if (avk.length !== bvk.length) return false;
      for (let j = 0; j < avk.length; j++) {
        const sub = avk[j];
        if (!Object.hasOwn(bv, sub) || av[sub] !== bv[sub]) return false;
      }
    }
    return true;
  }
  function run(key, group, index, command, presentation = {}) {
    const blueprint = ItemBlueprints[key];
    if (!blueprint) throw Error("道具模块未注册：" + key);
    if (
      globalThis.RandomEvents?.blocksAttackItem?.(state.randomEvents, blueprint)
    ) {
      showToast("和平协定生效中，本轮暂禁攻击类道具");
      return false;
    }
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
    if (ItemTargets.randomKinds.includes(blueprint.target))
      context.others = ItemTargets.randomCandidates(context, eligibleForItems);
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
    } else if (globalThis.RandomEvents?.applyChaosMagneticField) {
      const diverted = RandomEvents.applyChaosMagneticField(
        state.randomEvents,
        { ...context, groups: state.groups },
        eligibleForItems,
      );
      if (diverted) {
        context.targets = diverted;
        context.chaosDivertedTo = diverted[0]?.name || "";
      }
    }
    const before = snapshotScoresV21732();
    const beforeEffects = new Map(
      state.groups.map((g) => [
        g.id,
        snapshotGroupEffects(g.competitionEffects),
      ]),
    );
    itemScoreBatchDepthV21732++;
    try {
      if (effects[blueprint.effect](context) === false) return false;
      const mkw = ensureMkwRuntimeState();
      mkw.lastUsedAt[key] = Date.now();
      mkw.lastUsedSession[key] = Number(
        state.itemGlobal?.drawSessionThrottleV21710?.sessionNo || 0,
      );
      Object.assign(presentation, {
        key,
        booAlternateMushroom: !!context.booAlternateMushroom,
        ...(context.rankParamLabel
          ? { rankParamLabel: context.rankParamLabel }
          : {}),
        caster: { id: group.id, groupUid: group.groupUid, name: group.name },
        targets: context.targets.map((target) => ({
          id: target.id,
          groupUid: target.groupUid,
          name: target.name,
          blocked: context.blocked.has(target.id),
          delta:
            Number(target.score) -
            (before.get(String(target.id)) ?? Number(target.score)),
          status: CompetitionEffects.labels(target).join("；"),
          effectChanged: !groupEffectsEqual(
            beforeEffects.get(target.id),
            target.competitionEffects,
          ),
        })),
      });
      if (!context.consumed && !blueprint.retain)
        consumeInventoryItem(group, index, 1);
      group.itemStats = group.itemStats || {};
      if (!context.noStats)
        group.itemStats.used = (Number(group.itemStats.used) || 0) + 1;
      if (blueprint.punishOvertake !== false)
        detectOvertakePunish(
          group.id,
          ordered.map((g) => g.id),
        );
      // The card animation still plays; the small text toast under it is gone.
      if (context.chaosDivertedTo)
        showToast(`混乱磁场生效，攻击偏转至 ${context.chaosDivertedTo}`);
      if (!presentation.fromHand) showItemUseFx(key, group.id, "");
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
