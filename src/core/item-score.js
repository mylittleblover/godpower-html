/* Single score application entry; defense choices and dialogs live in application. */
function commitItemScore(
  target,
  delta,
  sourceId,
  attackType,
  isAttack = delta < 0,
) {
  let result;
  if (!target || !eligibleForItems(target))
    result = { changed: false, blocked: "negative" };
  else if (isAttack && tryDefend(target, attackType))
    result = { changed: false, blocked: "defense" };
  else {
    const before = target.score;
    target.score = Math.round((Number(target.score) || 0) + delta);
    target.displayScore = target.score;
    result = { changed: before !== target.score, before, after: target.score };
  }
  if (isAttack && target && ITEM_DEFS[attackType]) {
    const liveState = state;
    scheduleScoreEffect(() => {
      if (state === liveState && state.groups.includes(target))
        playAttackTargetFxV2116(
          target.id,
          attackType,
          result.blocked === "defense",
        );
    }, 110);
  }
  return result;
}

function applyItemScoreAfterHorn(
  target,
  delta,
  sourceId,
  attackType,
  isAttack = delta < 0,
) {
  const before = target ? Number(target.score) || 0 : null;
  if (isAttack && target && eligibleForItems(target))
    attackRenderGateV21713 = true;
  let result;
  if (isAttack && target && attackType === "spiny") {
    destroyPrimaryBasicDefenseV2170(target, sourceId, "刺龟壳");
    const main = target.inventory?.[0];
    if (
      main &&
      ["mushroom", "triple_mushroom"].includes(main.key) &&
      !target.__spinyMushroomDeclinedV21727 &&
      !target.__spinyDecisionPendingV21727
    ) {
      result = requestSpinyDefense(target, main.key, () =>
        commitItemScore(target, delta, sourceId, attackType, isAttack),
      );
    }
  } else if (isAttack && target && attackType === "boomerang_flower") {
    destroyPrimaryBasicDefenseV2170(target, sourceId, "回旋镖");
  }
  result =
    result || commitItemScore(target, delta, sourceId, attackType, isAttack);
  if (
    itemScoreBatchDepthV21732 === 0 &&
    target &&
    result.changed &&
    before !== null &&
    Number(target.score) !== before
  ) {
    queueItemScoreChangesV21732(new Map([[String(target.id), before]]));
  }
  return result;
}

function applyItemScore(target, delta, sourceId, attackType = "normal") {
  const isAttack = delta < 0;
  if (globalThis.ItemModules) delta = ItemModules.scoreDelta(attackType, delta);
  if (
    isAttack &&
    attackType === "spiny" &&
    target?.inventory?.[0]?.key === "horn" &&
    !target.__spinyHornDecisionPendingV218 &&
    !target.__spinyHornDeclinedV218
  ) {
    return requestSpinyDefense(target, "horn", () =>
      applyItemScoreAfterHorn(target, delta, sourceId, attackType, isAttack),
    );
  }
  return applyItemScoreAfterHorn(target, delta, sourceId, attackType, isAttack);
}
