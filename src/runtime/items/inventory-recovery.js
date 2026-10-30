/* ===== V2.17.18：修复“道具栏偶发三个金币” =====
   1. 未知/损坏的旧道具 key 不再自动替换成 coin；
   2. 启动时清理同组重复道具，只保留最早的一件；
   3. 抽取器即使候选极端耗尽，也不会回退为本组已有同种道具。 */

pickItemForGroupV281 = function (g, batchUsed = new Set()) {
  const held = heldItemKeysV281(g);
  const weights = sessionRestrictedWeightsV21710(g);

  /* 首选：不和本组已有道具重复，也尽量不和本轮其他组重复。 */
  let k = weightedPickNoRepeatV281(weights, new Set([...batchUsed, ...held]));

  /* 本轮候选冲突时允许跨组重复，但仍严格禁止本组重复。 */
  if (!k) {
    k = weightedPickNoRepeatV281(weights, held);
  }

  /* 如果该组在当前排名、冷却和库存组合下确实没有合法候选，
     本轮宁可不给道具，也不凭空复制金币或其他已有道具。 */
  if (!k) return null;

  commitSessionDrawV21710(g, k);
  return k;
};

/* 再执行一次清洗，顺便修复旧存档里已经留下的重复金币/重复道具。 */
function repairDuplicateInventoryV21718() {
  let changed = false;
  state.groups.forEach((g) => {
    const before = JSON.stringify(g.inventory || []);
    g.inventory = normalizeInventoryV21718(g.inventory);
    if (JSON.stringify(g.inventory) !== before) changed = true;
  });
  if (changed) {
    try {
      saveState();
    } catch (e) {}
    try {
      renderAll();
    } catch (e) {}
  }
}

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(repairDuplicateInventoryV21718, 20);
});
