/* 小组信息不能继续展示旧时代考古资料。统一从 V2.18 规则生成说明。 */
const GROUP_ITEM_ORDER_V2182 = [
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

const GROUP_ITEM_DESC_V2182 = {
  green: "随机攻击一个其他小组，扣除当前积分的 1/3；主要栏可用于基础防御。",
  triple_green:
    "3 次绿龟壳；每次随机攻击一个其他小组 -1/3，也可逐次用于基础防御。",
  red: "攻击当前排名紧邻的上一组 -1/3；若没有上方排名，道具仍会消耗但不产生效果。",
  triple_red:
    "3 次红龟壳；每一发都按发动时的最新排名重新寻找紧邻上一组；无上方排名时该发直接消耗。",
  banana: "攻击当前排名紧邻的下一组 -1/4；主要栏可用于基础防御。",
  triple_banana:
    "3 次香蕉皮；每一发都按发动时的最新排名重新寻找紧邻下一组，也可逐次用于基础防御。",
  horn: "攻击紧邻自己的上一组与下一组，各 -1/4；也可防御一次攻击。遭遇刺龟壳时会询问是否主动消耗超级喇叭。",
  bomb: "随机攻击目标并波及其实际排名相邻组，各 -1/4；主要栏还能防御龟壳，被摧毁或触发防御时会爆炸。",
  hammer: "只从排名高于自己的小组中随机选择最多 3 组，各扣除当前积分的 1/4。",
  coin: "立即 +2 分。",
  coin_shell: "自己 +1/4，同时所有排名高于自己的小组也 +1/4。",
  question: "自己 +1/4，同时所有排名低于自己的小组也 +1/4。",
  mushroom: "自己 +1/3；主要栏持有时，遭遇刺龟壳可选择主动消耗进行闪避。",
  triple_mushroom:
    "3 次 +1/3；答题期间首次使用后禁止 All In，但同一枚三重蘑菇剩余次数仍可继续使用。",
  boo: "偷取紧邻上方小组最新获得的道具；若无上方排名或上方没有道具，则自动获得一个蘑菇。使用后获得持续 3 次答题的攻击防护，受攻击不会消耗持续次数。",
  blooper:
    "全场比分遮蔽 2 分钟；积分、领奖台、图表与比赛页顶部排名预览均显示为 ???。",
  lightning:
    "攻击所有排名高于自己的小组；成功命中后积分减半，并清除其道具及强力蘑菇状态；部分特殊防御可抵挡。",
  star: "立即释放主要道具槽，并获得 3 轮答题的无敌；还能处理超越惩罚与基础防御。",
  mega: "获得 3 轮答题的巨大化，状态期间持续占据主要道具位置。",
  bullet:
    "若前方至少有 3 组，积分提升到当前领先自己 3 名的小组积分 +1；前方不足 3 组则追到第一名积分 +1；第一名使用则 +1。",
  power:
    "持续 5 次有效答题；答对以答题前紧邻的更高分组为目标，补至其常规与状态结算后积分 +1；自然超过不降分，多组发动不顺序连锁。",
  feather: "闪避下一次来自外部的攻击，触发后消失。",
  fire_flower: "3 次火球；每次随机攻击一个其他小组，扣除其当前积分的 1/5。",
  ice_flower:
    "3 次冰球；每次随机攻击一个其他小组 -1/5，并冻结其主动道具。目标尝试使用道具时强制解除并取消该次使用；若一直不用，3 次答题后自动解除。",
  boomerang_flower:
    "3 次回旋镖；每次攻击当前排名紧邻自己的上一组和下一组，各扣除当前积分的 1/5，并按每次发动时的最新排名重新计算目标。",
  spiny:
    "攻击当前第一名并扣除其当前积分的 1/2；会先处理第一名主要栏的基础防御，特殊防御仍可能抵挡。",
};

function groupItemDescV2182(key) {
  return GROUP_ITEM_DESC_V2182[key] || ITEM_DEFS[key]?.desc || "";
}

/* 更新 ITEM_DEFS 本身，避免任何仍读取旧 desc 的界面继续显示旧规则。 */
Object.keys(GROUP_ITEM_DESC_V2182).forEach((k) => {
  if (ITEM_DEFS[k]) ITEM_DEFS[k].desc = GROUP_ITEM_DESC_V2182[k];
});
if (ITEM_DEFS.blooper) ITEM_DEFS.blooper.name = "鱿鱿";

/* 找到小组信息里“上帝模式 · 强制追加到队尾”的按钮网格并重新排序，
   同时把按钮 title 同步成新版效果，避免另一处说明又活成化石。 */
function syncGodItemPickerV2182() {
  const root = document.querySelector("#itemWindowBody .god-item-grid");
  if (!root) return;

  const buttons = [...root.querySelectorAll("button")];
  const byKey = new Map();
  buttons.forEach((btn) => {
    const oc = btn.getAttribute("onclick") || "";
    const m = oc.match(/['"]([a-z_]+)['"]/);
    if (m && ITEM_DEFS[m[1]]) byKey.set(m[1], btn);
  });
  if (byKey.size < 10) return;

  const parent = [...byKey.values()][0].parentElement;
  if (!parent) return;
  GROUP_ITEM_ORDER_V2182.forEach((k) => {
    const btn = byKey.get(k);
    if (btn) {
      btn.title = groupItemDescV2182(k);
      parent.appendChild(btn);
    }
  });
}

/* 小组信息里的主要/次要道具卡说明，按当前持有 key 强制同步。
   通过按钮 onclick 取 key，不依赖旧版具体 DOM 类名。 */
function syncOwnedItemCardsV2182() {
  const group = state.groups.find((g) => g.id === activeItemGroupId);
  if (!group || activeItemTab !== "items") return;
  document
    .querySelectorAll("#itemWindowBody .queue-item-card")
    .forEach((card, index) => {
      const key = group.inventory[index]?.key;
      const target = card.querySelector(".item-big-desc");
      if (key && target) target.textContent = groupItemDescV2182(key);
    });
}

function syncGroupItemInfoV2182() {
  syncGodItemPickerV2182();
  syncOwnedItemCardsV2182();
}

/* renderItemWindow 是小组详情/道具页的最终渲染入口，旧内容渲染完后再同步。 */
const _v2182RenderItemWindow = renderItemWindow;
renderItemWindow = function () {
  const r = _v2182RenderItemWindow.apply(this, arguments);
  requestAnimationFrame(syncGroupItemInfoV2182);
  return r;
};

/* 管理员追加道具后界面重绘也再同步一次。 */
if (typeof adminAddItem === "function") {
  const _v2182AdminAddItem = adminAddItem;
  adminAddItem = function () {
    const r = _v2182AdminAddItem.apply(this, arguments);
    setTimeout(syncGroupItemInfoV2182, 0);
    return r;
  };
}

/* 初始打开已有详情时也修正。 */
setTimeout(syncGroupItemInfoV2182, 0);
