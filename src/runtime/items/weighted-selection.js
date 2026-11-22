function heldItemKeysV281(g) {
  return new Set((g?.inventory || []).map((it) => it?.key).filter(Boolean));
}
function weightedPickNoRepeatV281(weights, blocked = new Set()) {
  const filtered = {};
  Object.entries(weights || {}).forEach(([k, w]) => {
    const n = Number(w) || 0;
    if (n > 0 && !blocked.has(k)) filtered[k] = n;
  });
  if (Object.keys(filtered).length) return weightedPick(filtered);
  return null;
}
function pickItemForGroupV281(g, batchUsed = new Set()) {
  if (typeof ItemDrawBlocks !== "undefined" && ItemDrawBlocks?.pick) {
    return ItemDrawBlocks.pick(g, batchUsed);
  }
  const r = ranking(),
    pos = Math.max(1, r.findIndex((x) => x.id === g.id) + 1);
  const weights = itemDropWeights(pos, r.length);
  const held = heldItemKeysV281(g);
  let k = weightedPickNoRepeatV281(weights, new Set([...batchUsed, ...held]));
  if (!k) k = weightedPickNoRepeatV281(weights, held);
  if (!k) k = weightedPick(weights);
  return k;
}

/* 重写全局抽取：保留 V2.4 的平滑轮盘，只修改布局与最终防重复逻辑。 */

/* 举手抽取：同样避免抽到该组已持有的同种道具。 */

/* ===== V2.8.2：羽毛 / 火之花 / 冰之花 / 回旋镖花 =====
   V2.17.19 注意：这四种道具已在基础 ITEM_DEFS 阶段提前注册，
   此处只负责补充/覆盖同一套详细定义与后续行为，避免重进页面时库存先于定义被规范化。
   设计映射：
   羽毛：马车世界中用于跳跃、躲避攻击 -> 课堂版主动获得 1 次“任意攻击闪避”，使用后离开槽位。
   火之花：原作可连续投射多发火球 -> 课堂版 3 发火球，逐发攻击随机其他组，每发扣当前分 1/8。
   冰之花：原作命中使对手短暂失控 -> 课堂版 3 发冰球，每发随机攻击其他组，扣 1/10，并冻结其下一次主动道具使用。
   回旋镖花：原作可反复投掷并返回 -> 课堂版 3 次使用，每次攻击当前排名相邻的上/下组，各扣 1/8；使用次数耗尽才释放槽位。
*/
Object.assign(ITEM_DEFS, {
  feather: {
    name: "羽毛",
    icon: "🪶",
    charges: 1,
    slots: 1,
    desc: "高高跃起闪避攻击。主动使用后获得 1 次任意外部攻击闪避，触发后消失。",
  },
  fire_flower: {
    name: "火之花",
    icon: "🌼",
    charges: 3,
    slots: 1,
    desc: "3 发火球。每次随机命中一个其他小组，使其当前积分减少 1/4；3 发耗尽后释放槽位。",
  },
  ice_flower: {
    name: "冰之花",
    icon: "❄️",
    charges: 3,
    slots: 1,
    desc: "3 发冰球。每次随机命中一个其他小组，扣除当前积分 1/5，并冻结其主动道具；主动尝试使用会解除，若不用则 3 次答题后自动解除。",
  },
  boomerang_flower: {
    name: "回旋镖花",
    icon: "🪃",
    charges: 3,
    slots: 1,
    desc: "3 次回旋镖。每次命中当前排名紧邻自己的上一组和下一组，各扣当前积分 1/5。",
  },
});
ITEM_KEYS = Object.keys(ITEM_DEFS); // V2.8.4: 新增道具后刷新全局枚举，所有旧管理器自动获得 26 项

/* 默认图标兼容：若用户没上传图片，就用 emoji；百科/上传系统会自动读取 ITEM_DEFS。 */
/* 扩展 useItem。旧 26 种完全交回 V2.8 原逻辑。 */

/* 新增道具视觉语言 */
