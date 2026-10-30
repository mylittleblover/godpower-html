Object.assign(CARD_ITEM_FX_CLASS, {
  feather: "cfx-feather",
  fire_flower: "cfx-fireflower",
  ice_flower: "cfx-iceflower",
  boomerang_flower: "cfx-boomerang",
});
Object.assign(CARD_HIT_COLOR, {
  fire_flower: "#f97316",
  ice_flower: "#38bdf8",
  boomerang_flower: "#3b82f6",
});

/* 轮盘预览必须制造期待感：预览阶段从“全部道具”均匀随机，
   只有最终定格时才调用排名权重 + 防重复。 */
function roulettePreviewPickV282() {
  const keys = Object.keys(ITEM_DEFS);
  return keys[Math.floor(Math.random() * keys.length)];
}

/* 基于 V2.8.1 重写全局抽取：预览无权重，最终结果仍严格按权重与防重复。 */

/* 举手抽取同理：动画展示全道具，最终才使用权重。 */

/* 冰冻限制：下一次主动使用道具时拦截并解除。 */

/* ===== V2.8.3：26 种道具真正接入所有静态/动态页面 ===== */
