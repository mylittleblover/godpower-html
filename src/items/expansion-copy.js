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

/* 七种状态的说明改成与道具卡片同构的列表：图标位 + 名称/标签 + 实际效果 + 使用要点。
   文案只保留规则要点，不再复述通用解释。 */
function competitionStatusGuideMarkup() {
  const rows = [
    {
      key: "burn",
      name: "灼烧",
      tag: "持续扣分",
      exact: "接下来 2 次答题结算后各扣 1～3 分。",
      tip: "与中毒可并存，两者扣分各自独立计算。",
    },
    {
      key: "freeze",
      name: "冰冻",
      tag: "限制 All In",
      exact: "禁止 All In；正向答题收益最多 +1。",
      tip: "2 次答题后自动解除；若中途尝试使用道具，该次使用作废并立刻解冻（道具不消耗）。",
    },
    {
      key: "paralysis",
      name: "麻痹",
      tag: "得失归零",
      exact: "接下来 2 次答题各有 50% 概率取消答题得失，并禁止 All In。",
      tip: "只影响答题得失，不抵消灼烧与中毒的扣分。",
    },
    {
      key: "poison",
      name: "中毒",
      tag: "稳定掉分",
      exact: "接下来 3 次答题结算后各扣 2 分。",
      tip: "持续最久，适合在对手追分阶段施加。",
    },
    {
      key: "dizziness",
      name: "眩晕",
      tag: "目标反转",
      exact: "接下来 2 次定向道具尝试，各有 50% 概率把目标改为自己。",
      tip: "只对定向道具生效；非定向与全局道具不触发。",
    },
    {
      key: "invincible",
      name: "无敌",
      tag: "无敌星",
      exact: "持续 3 轮答题：期间抵挡全部攻击，答对总分×2、All In 答对×3，答错保分。",
      tip: "按答题轮次计时，与是否被攻击无关；同时清空已有的负面状态。",
    },
    {
      key: "mega",
      name: "巨大化",
      tag: "巨大蘑菇",
      exact: "持续 3 轮答题：防御与得分规则同无敌。",
      tip: "按答题轮次计时；占用主要道具栏，到期后自动释放。",
    },
  ];
  return `<section class="competition-status-guide">
    <h3>七种状态效果</h3>
    <p class="competition-status-guide-sub">负面状态可以并存；同种状态刷新剩余次数而不叠加伤害。答题次数只在真正作答时递减。</p>
    <div class="v2170-ency-list competition-status-list">
      ${rows
        .map(
          (row) => `<div class="v2170-ency-row">
        <div class="v2170-ency-icon status-icon-${row.key}"><span>${statusGuideGlyph(row.key)}</span></div>
        <div class="v2170-ency-copy">
          <div class="v2170-ency-name">${escapeHtml(row.name)} <span style="font-size:11px;font-weight:800;color:#0f766e;background:#eaf7f4;border-radius:999px;padding:3px 7px;margin-left:5px">${escapeHtml(row.tag)}</span></div>
          <div class="v218-ency-tip"><b>实际效果：</b>${escapeHtml(row.exact)}</div>
          <div class="v218-ency-tip" style="background:#fff8eb;color:#6f5830"><b style="color:#b66a00">使用要点：</b>${escapeHtml(row.tip)}</div>
        </div>
      </div>`,
        )
        .join("")}
    </div>
  </section>`;
}
function statusGuideGlyph(key) {
  return (
    {
      burn: "🔥",
      freeze: "❄",
      paralysis: "⚡",
      poison: "☠",
      dizziness: "💫",
      invincible: "⭐",
      mega: "🍄",
    }[key] || "◆"
  );
}
