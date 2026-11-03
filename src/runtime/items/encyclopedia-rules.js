const ITEM_ORDER_V218 = [
  "mushroom",
  "triple_mushroom",
  "green",
  "triple_green",
  "red",
  "triple_red",
  "banana",
  "triple_banana",
  "horn",
  "feather",
  "fire_flower",
  "ice_flower",
  "boomerang_flower",
  "kamek",
  "item_box",
  "bomb",
  "hammer",
  "spiny",
  "coin",
  "coin_shell",
  "question",
  "boo",
  "blooper",
  "lightning",
  "star",
  "mega",
  "bullet",
  "power",
];
const ITEM_TIPS_V218 = {
  mushroom: "既能主动加分，也能在刺龟壳来袭时选择主动消耗闪避。",
  triple_mushroom:
    "答题期间第一次使用后不能 All In，但同一枚三重蘑菇的剩余次数仍可继续使用；手动举手可选择一次或连发。",
  green: "主要栏可作为防御资源；领先时不要急着主动丢掉。",
  triple_green:
    "三次耐久可用于进攻或逐次防御；答题中可以继续消耗同一枚三重道具。",
  red: "只攻击紧邻上位；已经第一名时也可主动丢弃，用后无效果。",
  triple_red: "连发时每一发都会重新读取最新排名，因此目标可能变化。",
  banana: "可攻击紧邻下位，同时作为主要栏基础防御。",
  triple_banana: "连发会按每一发发动时的最新排名重新计算下位目标。",
  horn: "前 60% 排名都可能获得；第一名每次正常抽取时获得概率为 10%。遭遇刺龟壳时会询问是否主动消耗。",
  feather: "适合保留到预期会遭受攻击时使用，触发后自动消失。",
  fire_flower: "每发随机攻击一个其他小组 -1/4，适合直接压低对手分数。",
  ice_flower:
    "命中后冻结目标；目标下一次尝试主动使用道具会解除冻结并取消该次使用，若不用则 3 次答题后自然解除。",
  boomerang_flower: "同时压制紧邻上下位；每次发动都会根据最新排名重新找目标。",
  bomb: "既能进攻又能防龟壳；被摧毁或用于防御时可能爆炸波及相邻组。",
  hammer: "只会从排名高于自己的组中随机选择最多 3 个目标。",
  spiny: "专门针对第一名；对方若主要栏有超级喇叭或蘑菇，可能主动选择防御。",
  coin: "稳定 +2，适合小分差时直接使用。",
  coin_shell: "会连带给所有领先组加分，使用前先确认是否真的有利。",
  question: "自己与所有落后组一起获得增益，适合领先组制造整体抬升。",
  boo: "若上方组无道具或自己已第一，会自动获得一个蘑菇；使用后获得持续 3 次答题的攻击防护，受攻击不减少持续次数。",
  blooper: "会遮蔽积分、图表、领奖台以及顶部排名预览，适合制造信息压力。",
  lightning: "影响所有领先组，但无敌星、巨大蘑菇和害羞幽灵等状态可能阻挡。",
  star: "立即释放主要栏，并获得持续 3 轮答题的无敌状态，适合需要腾出道具槽时使用。",
  mega: "占据主要栏 3 轮答题，期间抵挡全部攻击。",
  bullet: "追赶效果依赖当前排名和前方组数，越靠后通常收益越明显。",
  power: "仅持续 5 次答题；答错也会消耗次数，因此最好在把握较高时启用。",
};



/* 修正百科旧文案 */
if (typeof ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715 !== "undefined") {
  ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715.blooper =
    "暂时遮蔽全场积分、领奖台、图表以及比赛页顶部排名预览，使其显示为未知状态。";
  ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715.power =
    "效果持续 5 次有效答题；答错也消耗，答对以答题前紧邻的更高分组为目标，补至其常规与状态结算后积分 +1；已自然超过则不降分，多组同时发动不按数组顺序连锁。";
  ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715.fire_flower =
    "拥有 3 次火之花攻击次数；每次随机攻击一个其他小组，扣除其当前积分的 1/4。";
  ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715.ice_flower =
    "拥有 3 次冰之花攻击次数；每次随机攻击一个其他小组，扣除其当前积分的 1/5，并冻结其主动道具使用。";
  ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715.boomerang_flower =
    "拥有 3 次回旋镖攻击次数；每次攻击当前排名紧邻自己的上方和下方小组，各扣除其当前积分的 1/5。";
}

/* 初始化 / 兼容旧存档 */
state.groups.forEach((g) => {
  if (
    g.itemEffect?.iceLock &&
    !Number.isFinite(Number(g.itemEffect.iceRoundsLeftV218))
  )
    g.itemEffect.iceRoundsLeftV218 = 3;
  if (
    Number(g.booShield || 0) > 0 &&
    !Number.isFinite(Number(g.booRoundsLeftV218))
  )
    g.booRoundsLeftV218 = 3;
});
saveState();
