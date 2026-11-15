/* ===== V2.17.18：修复“道具栏偶发重复道具” =====
   1. 未知/损坏的旧道具 key 不再自动替换成 coin；
   2. 启动时清理同组重复道具，只保留最早的一件；
   3. pickItemForGroupV281 统一委托 ItemDrawBlocks.pick (Product.180)，不再堆叠覆写。 */

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
