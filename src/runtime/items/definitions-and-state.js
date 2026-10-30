const ITEM_DEFS = {
  green: {
    name: "绿龟壳",
    icon: "🟢",
    kind: "attack",
    def: "green",
    charges: 1,
    desc: "随机攻击其他小组 -1/4；可抵挡常规攻击与刺龟壳。",
  },
  triple_green: {
    name: "三重绿龟壳",
    icon: "🟢³",
    kind: "attack",
    def: "green",
    charges: 3,
    desc: "可分 3 次攻击/防御，每次 -1/4。",
  },
  red: {
    name: "红龟壳",
    icon: "🔴",
    kind: "attack",
    def: "red",
    charges: 1,
    desc: "攻击排名正上方一组 -1/3；可抵挡常规攻击。",
  },
  triple_red: {
    name: "三重红龟壳",
    icon: "🔴³",
    kind: "attack",
    def: "red",
    charges: 3,
    desc: "3 次红龟壳攻击/常规防御。",
  },
  spiny: {
    name: "刺龟壳",
    icon: "🔵",
    kind: "attack",
    charges: 1,
    desc: "攻击当前榜首 -1/2；仅特殊防御可化解。",
  },
  banana: {
    name: "香蕉皮",
    icon: "🍌",
    kind: "attack",
    def: "yellow",
    charges: 1,
    desc: "攻击排名正下方一组 -1/4；可抵挡常规攻击。",
  },
  triple_banana: {
    name: "三重香蕉皮",
    icon: "🍌³",
    kind: "attack",
    def: "yellow",
    charges: 3,
    desc: "3 次向后攻击/常规防御。",
  },
  horn: {
    name: "超级喇叭",
    icon: "📣",
    kind: "attack",
    def: "orange",
    charges: 1,
    desc: "上下相邻组各 -1/4；可抵挡任意攻击。",
  },
  bomb: {
    name: "炸弹兵",
    icon: "💣",
    kind: "attack",
    charges: 1,
    desc: "随机目标及实际存在的相邻组各 -1/4。",
  },
  hammer: {
    name: "锤子",
    icon: "🔨",
    kind: "attack",
    charges: 1,
    desc: "随机攻击 3 个不同小组，各 -1/4。",
  },
  coin: {
    name: "金币",
    icon: "🪙",
    kind: "boost",
    charges: 1,
    desc: "自身 +2 分。",
  },
  coin_shell: {
    name: "金币龟壳",
    icon: "🟡",
    kind: "boost",
    charges: 1,
    desc: "自身及所有领先组各 +1/4。",
  },
  question: {
    name: "？砖块",
    icon: "❓",
    kind: "boost",
    charges: 1,
    desc: "自身及所有落后组各 +1/4。",
  },
  mushroom: {
    name: "蘑菇",
    icon: "🍄",
    kind: "boost",
    charges: 1,
    desc: "自身 +1/4；刺龟壳来袭时可主动闪避。",
  },
  triple_mushroom: {
    name: "三重蘑菇",
    icon: "🍄³",
    kind: "boost",
    charges: 3,
    desc: "3 次 +1/4，也可分次主动闪避刺龟壳。",
  },
  boo: {
    name: "害羞幽灵",
    icon: "👻",
    kind: "tactic",
    charges: 1,
    desc: "偷取正上方对手最新获得的道具；若无可偷目标则获得一个蘑菇，并获得持续 3 次答题的攻击防护。",
  },
  blooper: {
    name: "鱿鱿",
    icon: "🦑",
    kind: "tactic",
    charges: 1,
    desc: "全场比分遮蔽 2 分钟，显示为 ???。",
  },
  lightning: {
    name: "闪电",
    icon: "⚡",
    kind: "tactic",
    charges: 1,
    desc: "劈中所有排名高于自己的小组：各降低当前分数 1/2，并清空全部道具与强力蘑菇效果；无敌星、巨大蘑菇和害羞幽灵保护可阻挡。",
  },
  star: {
    name: "无敌星",
    icon: "⭐",
    kind: "status",
    charges: 1,
    desc: "占据主要道具栏直到状态结束，抵挡接下来 3 次攻击；超车时压制被超组 -1/4。",
  },
  mega: {
    name: "巨大蘑菇",
    icon: "🍄‍🟫",
    kind: "status",
    charges: 1,
    desc: "占槽持续，抵挡 3 次攻击；超车时压制被超组 -1/4。",
  },
  bullet: {
    name: "炮弹刺客",
    icon: "🚀",
    kind: "instant",
    charges: 1,
    desc: "瞬间超越前方 3 名：分数直接变为目标名次的分数 +1；若前方不足 3 名，则直接超过当前第一名。",
  },
  power: {
    name: "强力蘑菇",
    icon: "🌟🍄",
    kind: "status",
    charges: 1,
    desc: "持续 3 次答题；答对后在常规结算后提升一名，答错也会消耗 1 次。",
  },

  /* V2.17.19：扩展道具必须在第一次 ensureItemState() 之前注册。
     否则重进页面时会被当成未知库存项清理；旧版还会错误兜底成金币。 */
  feather: {
    name: "羽毛",
    icon: "🪶",
    kind: "tactic",
    charges: 1,
    slots: 1,
    desc: "高高跃起闪避攻击。主动使用后获得 1 次任意外部攻击闪避，触发后消失。",
  },
  fire_flower: {
    name: "火之花",
    icon: "🌼",
    kind: "attack",
    charges: 3,
    slots: 1,
    desc: "3 发火球。每次随机命中一个其他小组，使其当前积分减少 1/4；3 发耗尽后释放槽位。",
  },
  ice_flower: {
    name: "冰之花",
    icon: "❄️",
    kind: "attack",
    charges: 3,
    slots: 1,
    desc: "3 发冰球。每次随机命中一个其他小组，扣除当前积分 1/5，并冻结其主动道具；使用道具时立即解除，若不使用则 3 次答题后自动解除。",
  },
  boomerang_flower: {
    name: "回旋镖花",
    icon: "🪃",
    kind: "attack",
    charges: 3,
    slots: 1,
    desc: "3 次回旋镖。每次命中当前排名紧邻自己的上一组和下一组，各扣当前积分 1/5。",
  },
};
let ITEM_KEYS = Object.keys(ITEM_DEFS);
globalThis.GodpowerItemCatalog = Object.freeze({
  list: () =>
    ITEM_KEYS.map((key) =>
      Object.freeze({
        key,
        name: ITEM_DEFS[key].name,
        desc: ITEM_DEFS[key].desc,
        kind: ITEM_DEFS[key].kind,
        charges: ITEM_DEFS[key].charges,
      }),
    ),
});
const ITEM_DEFENSE_KEYS = new Set([
  "green",
  "triple_green",
  "red",
  "triple_red",
  "banana",
  "triple_banana",
  "horn",
]);
let activeItemGroupId = null,
  activeItemTab = "detail",
  itemDrawBusy = false,
  bulletTimer = null;

/* V2.17.18：统一库存规范化。
   无效/旧版未知道具直接丢弃，不再错误替换成金币；
   同一小组同种道具只保留最早的一件。 */
function normalizeInventoryV21718(inventory) {
  const seen = new Set();
  return (Array.isArray(inventory) ? inventory : [])
    .slice(0, 3)
    .filter((it) => {
      const key = it && it.key;
      if (!ITEM_DEFS[key] || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((it, i) => {
      const configuredCharges =
        Number.isInteger(it.configuredCharges) &&
        it.configuredCharges >= 1 &&
        it.configuredCharges <= 99
          ? it.configuredCharges
          : null;
      const maxCharges =
        configuredCharges ||
        Math.max(1, Number(ITEM_DEFS[it.key]?.charges) || 1);
      const storedCharges = Number(it.charges);
      const charges = Number.isFinite(storedCharges)
        ? Math.max(1, Math.min(maxCharges, Math.trunc(storedCharges)))
        : maxCharges;
      const acquiredAt = Number(it.acquiredAt) || Date.now() + i;
      const itemInstanceId = StableIdentity.isValidItemInstanceId(
        it.itemInstanceId,
      )
        ? it.itemInstanceId
        : StableIdentity.createItemInstanceId();
      const expectedKeys = 3 + 1 + (configuredCharges ? 1 : 0);
      if (
        Object.keys(it).length === expectedKeys &&
        it.charges === charges &&
        it.acquiredAt === acquiredAt &&
        it.itemInstanceId === itemInstanceId
      )
        return it;
      return {
        key: it.key,
        charges,
        acquiredAt,
        itemInstanceId,
        ...(configuredCharges ? { configuredCharges } : {}),
      };
    });
}

function ensureItemState() {
  state.groups.forEach((g) => {
    if (!Array.isArray(g.inventory)) g.inventory = [];
    g.inventory = normalizeInventoryV21718(g.inventory);
    if (!g.itemStats || typeof g.itemStats !== "object")
      g.itemStats = { correct: 0, wrong: 0, draws: 0, used: 0 };
    if (!g.itemEffect || typeof g.itemEffect !== "object") g.itemEffect = null;
    if (!Number.isFinite(g.booShield)) g.booShield = 0;
  });
  if (!state.itemGlobal || typeof state.itemGlobal !== "object")
    state.itemGlobal = { blooperUntil: 0, totalDraws: 0 };
}
ensureItemState();
