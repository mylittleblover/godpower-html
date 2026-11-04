const FIRST_HAND_POOL_V218 = [
  "triple_mushroom",
  "mushroom",
  "triple_green",
  "green",
  "triple_red",
  "red",
  "banana",
  "triple_banana",
  "horn",
];
let firstHandDrawPendingV218 = true;
let suppressFirstHornV218 = false;




const _v218PickItem = pickItemForGroupV281;
pickItemForGroupV281 = function (g, batchUsed = new Set()) {
  return ItemDrawBlocks.pick(g, batchUsed);
};

/* ---------- 7. 手动举手：不关闭菜单；三重可单发 / 连发；中央效果结算 ---------- */
