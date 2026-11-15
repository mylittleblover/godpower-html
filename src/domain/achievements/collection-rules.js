/* Collection, tactical and item-mastery hidden achievements reduced from formal classroom events. */
const CollectionAchievementRules = (() => {
  const FORMAL_ACQUIRE_SOURCES = new Set([
    "global-draw",
    "hand-raise-reward",
    "item-box",
    "draw",
    "pk",
    "hand",
  ]);
  const FULL_DISCOVERY_TARGET = 28;
  const MAX_TRACKED_INSTANCES = 400;

  function unlockPermanent(progress, id, occurredAt, unlocked) {
    if (progress.permanentUnlocks[id]) return;
    progress.permanentUnlocks[id] = { unlockedAt: occurredAt };
    unlocked.push({ achievementId: id, layer: "permanent" });
  }

  function trimOldestKeys(map, maxKeys) {
    const keys = Object.keys(map);
    if (keys.length <= maxKeys) return;
    for (const key of keys.slice(0, keys.length - maxKeys)) delete map[key];
  }

  function trackInstance(progress, instanceId, itemKey) {
    if (typeof instanceId !== "string" || !instanceId.trim()) return null;
    const byInstance = progress.itemProgress.byInstance;
    if (!byInstance[instanceId]) {
      byInstance[instanceId] = {
        key: itemKey,
        gainUses: 0,
        damageUses: 0,
        targetsHit: [],
        roundDamageCounts: {},
      };
      trimOldestKeys(byInstance, MAX_TRACKED_INSTANCES);
    }
    return byInstance[instanceId];
  }

  function evaluateAcquire(progress, event, unlocked) {
    const payload = event.payload || {};
    const source = payload.source || "draw";
    if (FORMAL_ACQUIRE_SOURCES.has(source)) {
      progress.itemProgress.formalAcquires++;
      if (progress.itemProgress.formalAcquires >= 1)
        unlockPermanent(progress, "ACH-023", event.occurredAt, unlocked);
      if (progress.itemProgress.formalAcquires >= 20)
        unlockPermanent(progress, "ACH-024", event.occurredAt, unlocked);
    }
    if (progress.itemDiscovery.length >= 13)
      unlockPermanent(progress, "ACH-025", event.occurredAt, unlocked);
    if (progress.itemDiscovery.length >= FULL_DISCOVERY_TARGET)
      unlockPermanent(progress, "ACH-026", event.occurredAt, unlocked);
  }

  function evaluateItemUsed(progress, event, unlocked) {
    const payload = event.payload || {};
    const key = payload.itemKey;
    if (typeof key !== "string" || !key) return;

    const casterDelta = Number(payload.casterDelta) || 0;
    const hitUids = Array.isArray(payload.hitTargetUids)
      ? payload.hitTargetUids.filter((id) => typeof id === "string" && id)
      : [];
    const instance = trackInstance(progress, payload.itemInstanceId, key);

    if (instance) {
      if (casterDelta > 0) instance.gainUses++;
      if (hitUids.length > 0) {
        instance.damageUses++;
        for (const uid of hitUids) {
          if (!instance.targetsHit.includes(uid)) instance.targetsHit.push(uid);
        }
        const roundKey = String(
          Number.isSafeInteger(payload.roundNumber) ? payload.roundNumber : 0,
        );
        instance.roundDamageCounts[roundKey] =
          (instance.roundDamageCounts[roundKey] || 0) + 1;
      }
    }

    switch (key) {
      case "coin":
        if (casterDelta >= 2)
          unlockPermanent(progress, "ACH-027", event.occurredAt, unlocked);
        break;
      case "coin_shell":
        if (casterDelta > 0 && (Number(payload.boostedAheadCount) || 0) >= 1)
          unlockPermanent(progress, "ACH-028", event.occurredAt, unlocked);
        break;
      case "question":
        if (casterDelta > 0 && (Number(payload.boostedBehindCount) || 0) >= 2)
          unlockPermanent(progress, "ACH-029", event.occurredAt, unlocked);
        break;
      case "mushroom":
        if (casterDelta >= 1)
          unlockPermanent(progress, "ACH-030", event.occurredAt, unlocked);
        break;
      case "triple_mushroom":
        if (instance && instance.gainUses >= 3)
          unlockPermanent(progress, "ACH-031", event.occurredAt, unlocked);
        break;
      case "green":
        if (hitUids.length >= 1)
          unlockPermanent(progress, "ACH-033", event.occurredAt, unlocked);
        break;
      case "triple_green":
        if (
          instance &&
          instance.damageUses >= 3 &&
          instance.targetsHit.length >= 3
        )
          unlockPermanent(progress, "ACH-034", event.occurredAt, unlocked);
        break;
      case "red":
        if (payload.hitAdjacentAbove === true)
          unlockPermanent(progress, "ACH-035", event.occurredAt, unlocked);
        break;
      case "triple_red":
        if (
          instance &&
          instance.damageUses >= 3 &&
          instance.targetsHit.length >= 2
        )
          unlockPermanent(progress, "ACH-036", event.occurredAt, unlocked);
        break;
      case "spiny":
        if (payload.hitLeader === true)
          unlockPermanent(progress, "ACH-037", event.occurredAt, unlocked);
        break;
      case "banana":
        if (payload.hitAdjacentBelow === true)
          unlockPermanent(progress, "ACH-038", event.occurredAt, unlocked);
        break;
      case "triple_banana": {
        const roundKey = String(
          Number.isSafeInteger(payload.roundNumber) ? payload.roundNumber : 0,
        );
        if (instance && (instance.roundDamageCounts[roundKey] || 0) >= 3)
          unlockPermanent(progress, "ACH-039", event.occurredAt, unlocked);
        break;
      }
      case "bomb":
        if (hitUids.length >= 2)
          unlockPermanent(progress, "ACH-040", event.occurredAt, unlocked);
        break;
      case "hammer":
        if ((Number(payload.hitAheadCount) || 0) >= 3)
          unlockPermanent(progress, "ACH-041", event.occurredAt, unlocked);
        break;
      case "lightning":
        if ((Number(payload.hitAheadCount) || 0) >= 3)
          unlockPermanent(progress, "ACH-042", event.occurredAt, unlocked);
        break;
      case "boo":
        if (payload.booAlternateMushroom === true)
          unlockPermanent(progress, "ACH-053", event.occurredAt, unlocked);
        break;
      case "bullet": {
        const rankBefore = Number(payload.casterRankBefore);
        const rankAfter = Number(payload.casterRankAfter);
        if (
          (Number(payload.groupCount) || 0) >= 5 &&
          Number.isSafeInteger(rankBefore) &&
          Number.isSafeInteger(rankAfter) &&
          rankBefore - rankAfter >= 3
        )
          unlockPermanent(progress, "ACH-055", event.occurredAt, unlocked);
        break;
      }
      case "fire_flower":
        if (instance && instance.damageUses >= 3)
          unlockPermanent(progress, "ACH-058", event.occurredAt, unlocked);
        break;
      case "boomerang_flower":
        if (
          payload.hitAdjacentAbove === true &&
          payload.hitAdjacentBelow === true
        )
          unlockPermanent(progress, "ACH-060", event.occurredAt, unlocked);
        break;
    }
  }

  function evaluateDefense(progress, event, unlocked) {
    const payload = event.payload || {};
    if (payload.blocked !== true) return;
    const defenderKey = payload.defenderKey;
    if (defenderKey === "horn" && payload.attackerItemKey === "spiny")
      unlockPermanent(progress, "ACH-032", event.occurredAt, unlocked);
    if (defenderKey === "feather")
      unlockPermanent(progress, "ACH-057", event.occurredAt, unlocked);
    if (defenderKey === "star" || defenderKey === "mega") {
      const actKey = `${defenderKey}:${payload.effectActivationId || "default"}`;
      const counts = progress.itemProgress.defensesByActivation;
      counts[actKey] = (counts[actKey] || 0) + 1;
      trimOldestKeys(counts, MAX_TRACKED_INSTANCES);
      if (counts[actKey] >= 3)
        unlockPermanent(
          progress,
          defenderKey === "star" ? "ACH-043" : "ACH-044",
          event.occurredAt,
          unlocked,
        );
    }
  }

  function evaluateRound(progress, event, unlocked) {
    const payload = event.payload || {};
    if (payload.blooperActiveScored === true)
      unlockPermanent(progress, "ACH-054", event.occurredAt, unlocked);
    const power = payload.powerCompleted;
    if (
      power &&
      Number.isSafeInteger(power.totalAnswered) &&
      Number.isSafeInteger(power.totalCorrect) &&
      power.totalAnswered >= 3 &&
      power.totalCorrect === power.totalAnswered
    )
      unlockPermanent(progress, "ACH-056", event.occurredAt, unlocked);
  }

  function evaluate(progress, event) {
    if (!event || !progress?.itemProgress) return [];
    const unlocked = [];
    if (event.type === "ITEM_ACQUIRED") {
      evaluateAcquire(progress, event, unlocked);
    } else if (event.type === "ITEM_USED") {
      evaluateItemUsed(progress, event, unlocked);
    } else if (event.type === "DEFENSE_RESOLVED") {
      evaluateDefense(progress, event, unlocked);
    } else if (
      event.type === "EFFECT_EXPIRED" &&
      event.payload?.effectKey === "freeze" &&
      event.payload?.reason === "use-cancelled"
    ) {
      unlockPermanent(progress, "ACH-059", event.occurredAt, unlocked);
    } else if (event.type === "ROUND_SETTLED") {
      evaluateRound(progress, event, unlocked);
    }
    return unlocked;
  }

  return { evaluate };
})();
