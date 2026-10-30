const TRIPLE_KEYS_V218 = new Set([
  "triple_green",
  "triple_red",
  "triple_banana",
  "triple_mushroom",
]);
function consumeOneV218(g, index) {
  const it = g.inventory?.[index];
  if (!it) return;
  it.charges = Math.max(0, (Number(it.charges) || 1) - 1);
  if (it.charges <= 0) g.inventory.splice(index, 1);
}
function attackOneFifthV218(caster, target, key) {
  const amount = Math.round(Math.max(0, Number(target.score) || 0) / 5);
  if (amount <= 0) return { changed: false };
  return applyItemScore(target, -amount, caster.id, key);
}
function finishOwnItemUseV218(g, key, index, targetText) {
  g.itemStats = g.itemStats || {};
  g.itemStats.used = (Number(g.itemStats.used) || 0) + 1;
  recordHistory(`${g.name} 使用道具：${ITEM_DEFS[key].name}`);
  saveState();
  renderAll();
  showItemUseFx(key, g.id, targetText);
  showToast(`${g.name} 使用了 ${ITEM_DEFS[key].name}`);
  return true;
}

/* 道具窗口状态：同一个三重道具在本题剩余次数仍可继续点。 */
if (typeof queueUseStateV2120 === "function") {
  const _v218QueueState = queueUseStateV2120;
  queueUseStateV2120 = function (g, index) {
    if (
      g?.inventory?.[index]?.key &&
      globalThis.ItemModules &&
      !ItemModules.canUse(g.inventory[index].key)
    )
      return { usable: false, label: "设置中已关闭主动使用" };
    if (
      index === 0 &&
      state.roundActive &&
      !state.evaluated &&
      g?.itemUsedThisRound &&
      TRIPLE_KEYS_V218.has(g.inventory?.[0]?.key) &&
      g.roundItemContinuationKeyV218 === g.inventory?.[0]?.key
    ) {
      return {
        usable: true,
        label: `继续使用（剩余 ${g.inventory[0].charges}）`,
      };
    }
    return _v218QueueState.call(this, g, index);
  };
}

/* 幽灵 3 题内无限防御，不因攻击消耗。 */

/* 超级喇叭防刺龟壳改为确认弹窗，机制参考蘑菇。 */

/* ---------- 5. 答题次数型状态 ---------- */
/* Answered-round expiry is owned by items/round-effects.js. */

/* 冰冻被主动使用触发时：立即解除，并继续沿用“本次使用被取消”的既有规则。 */

/* ---------- 6. 道具抽取：喇叭前 60%，第一名精确 10%；首次举手等概率池 ---------- */
