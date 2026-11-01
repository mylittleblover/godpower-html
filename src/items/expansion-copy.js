/* Canonical current descriptions override historical copy-only compatibility blocks. */
(() => {
  const order = [
    "coin",
    "mushroom",
    "triple_mushroom",
    "coin_shell",
    "question",
    "item_box",
    "green",
    "triple_green",
    "red",
    "triple_red",
    "banana",
    "triple_banana",
    "horn",
    "bomb",
    "hammer",
    "spiny",
    "fire_flower",
    "ice_flower",
    "boomerang_flower",
    "kamek",
    "lightning",
    "blooper",
    "boo",
    "feather",
    "star",
    "mega",
    "bullet",
    "power",
  ];
  const ordered = Object.fromEntries(order.map((key) => [key, ITEM_DEFS[key]]));
  for (const key of Object.keys(ITEM_DEFS)) delete ITEM_DEFS[key];
  Object.assign(ITEM_DEFS, ordered);
  ITEM_KEYS = [...order];
  for (const list of [ITEM_ORDER_V283, ITEM_ORDER_V218, GROUP_ITEM_ORDER_V2182])
    list.splice(0, list.length, ...order);
  const descriptions = {
    kamek:
      "随机选择 1～3 个不同的其他小组，分别施加灼烧、冰冻、麻痹、中毒、眩晕中的一种随机状态；现有防御可抵挡。",
    item_box:
      "为所有符合条件的小组按其排名抽取一个道具；负分或库存已满者跳过。使用者先释放道具箱槽位，再参与分发。",
    fire_flower:
      "3 发火球；每次随机攻击其他一组，扣当前积分 1/4；未被防御的命中追加灼烧，接下来 2 次答题后各扣 1～3 分。",
    ice_flower:
      "3 发冰球；每次随机攻击尚未冰冻的小组，扣当前积分 1/5 并冰冻：禁止 All In，正向答题收益最多 1 分；2 次答题或阻挡一次道具使用后解除，原道具不消耗。全场已冻结时消耗 1 发但无效果。",
    boomerang_flower:
      "3 次回旋镖；每次攻击相邻上下组，各扣当前积分 1/5，并追加眩晕：接下来 2 次定向道具尝试有 50% 概率转向自身。不会重复扣除 1/5。",
    star: "无敌星触发无敌状态：防御 3 次攻击；状态期间普通答对总分 ×2，All In 答对总分 ×3；答错不扣答题分，All In 失败不清零。第三次防御耗尽时状态结束。例：20 分答对变 40，All In 答对变 60；答错仍为 20。",
    mega: "巨大蘑菇触发巨大化状态：防御 3 次攻击并保留占据主要道具栏的机制；状态期间普通答对总分 ×2，All In 答对总分 ×3；答错不扣答题分，All In 失败不清零。第三次防御耗尽时状态结束。例：20 分答对变 40，All In 答对变 60；答错仍为 20。",
  };
  for (const [key, desc] of Object.entries(descriptions)) {
    ITEM_DEFS[key].desc = desc;
    for (const map of [
      GROUP_ITEM_DESC_V2182,
      ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715,
      ITEM_TIPS_V218,
    ])
      map[key] = desc;
  }
  Object.assign(ITEM_FUNNY_COPY_V2184, {
    kamek: "水晶球一亮，随机给几位对手安排一点小麻烦。每组一份，不重复点名。",
    item_box: "拆开一箱，全班补货。别忘了别人也会拿到道具。",
    fire_flower: "火球扣分之后还有余温；接下来的两次答题，灼烧仍会扣分。",
    ice_flower:
      "道具和 All In 一起暂停，答题加分也被冻住；两次答题或一次道具尝试后解冻。",
    boomerang_flower:
      "回旋镖回来之后，对手可能还没分清方向；下一次攻击要小心自己。",
  });
})();

function competitionStatusGuideMarkup() {
  const rows = [
    ["灼烧", "接下来 2 次答题结算后各扣 1～3 分；可与中毒并存。"],
    [
      "冰冻",
      "禁止 All In；答题正向收益最多 +1；2 次答题或取消一次道具使用后解除，取消时原道具不消耗。",
    ],
    [
      "麻痹",
      "接下来 2 次答题有 50% 概率取消答题得失；禁止 All In；不抵消后置灼烧、中毒扣分。",
    ],
    ["中毒", "接下来 3 次答题结算后各扣 2 分。"],
    [
      "眩晕",
      "接下来 2 次定向道具尝试，有 50% 概率把目标改为自己；非定向、全局道具不触发。",
    ],
    [
      "无敌",
      "由无敌星触发，防御 3 次攻击；普通答对总分×2，All In 答对总分×3；答错保分、All In 失败不清零。防御耗尽后结束。",
    ],
    [
      "巨大化",
      "由巨大蘑菇触发，防御及答题规则同无敌；保留主要道具占位，防御耗尽后释放。",
    ],
  ];
  return `<section class="competition-status-guide"><h3>七种状态效果</h3><p>不同负面状态可并存，同种状态刷新剩余次数、不叠伤害。仅实际作答递减答题次数；状态扣分与答题得失独立。无敌、巨大化保留现有防御规则；倍率按总分计算，不叠乘。道具顺序按资源、常规攻击、控制、特殊状态分组。</p><dl>${rows.map(([name, desc]) => `<dt>${escapeHtml(name)}</dt><dd>${escapeHtml(desc)}</dd>`).join("")}</dl></section>`;
}
