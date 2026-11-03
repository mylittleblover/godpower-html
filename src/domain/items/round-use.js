/* Round use belongs to an inventory instance, never its type or visible slot. */
const ItemRoundUse = (() => {
  function canContinue(group, item) {
    return (
      !!group?.itemUsedThisRound &&
      typeof group.roundItemInstanceId === "string" &&
      !!group.roundItemInstanceId &&
      group.roundItemInstanceId === item?.itemInstanceId &&
      Number(item.charges) > 0
    );
  }
  function mark(group, item) {
    group.itemUsedThisRound = true;
    group.roundItemInstanceId =
      typeof item?.itemInstanceId === "string" ? item.itemInstanceId : "";
    delete group.roundItemContinuationKeyV218;
  }
  function reset(group) {
    group.itemUsedThisRound = false;
    delete group.roundItemInstanceId;
    delete group.roundItemContinuationKeyV218;
  }
  return Object.freeze({ canContinue, mark, reset });
})();
