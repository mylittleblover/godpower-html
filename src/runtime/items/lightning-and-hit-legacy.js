function attackHitClassV2116(key) {
  if (["green", "triple_green"].includes(key)) return "hit-green-shell";
  if (["red", "triple_red"].includes(key)) return "hit-red-shell";
  if (key === "spiny") return "hit-spiny";
  if (["banana", "triple_banana"].includes(key)) return "hit-banana";
  if (key === "horn") return "hit-horn";
  if (key === "bomb") return "hit-bomb-v2116";
  if (key === "hammer") return "hit-hammer";
  if (key === "lightning") return "hit-lightning";
  if (key === "fire_flower") return "hit-fire";
  if (key === "ice_flower") return "hit-ice";
  if (key === "boomerang_flower") return "hit-boomerang";
  return "hit-generic-v2116";
}

function clearAttackHitFxV2116(card) {
  if (!card) return;
  [...card.classList]
    .filter((x) => x.startsWith("hit-"))
    .forEach((x) => card.classList.remove(x));
  card.classList.remove("card-defend-fx");
  card.style.removeProperty("--hitc");
}

/* 受击者动画。defended=true 时保留蓝色盾牌反馈，同时附加对应攻击的短促冲击。 */
function playAttackTargetFxV2116(groupId, key, defended = false) {
  if (typeof DesktopUI !== "undefined") {
    DesktopUI.visualEvent(defended ? "ITEM_DEFENDED" : "ITEM_HIT", {
      groupId,
      key,
    });
    if (
      !DesktopUI.getPreferences().itemFx ||
      DesktopUI.getPreferences().motion === "off"
    )
      return;
  }
  const card = battleCard(groupId);
  if (!card) return;
  clearAttackHitFxV2116(card);
  void card.offsetWidth;

  const cls = attackHitClassV2116(key);
  card.classList.add(cls);
  card.style.setProperty("--hitc", CARD_HIT_COLOR[key] || "#ef4444");

  if (defended) card.classList.add("card-defend-fx");

  const badge = document.createElement("div");
  badge.className = "attack-hit-badge-v2116";
  const d = ITEM_DEFS[key];
  badge.innerHTML = `<span>${itemVisual(key)}</span><b>${defended ? "已防御" : "受到 " + (d?.name || "攻击")}</b>`;
  card.appendChild(badge);

  setTimeout(() => {
    card.classList.remove(cls, "card-defend-fx");
    badge.remove();
    card.style.removeProperty("--hitc");
  }, 1750);
}

/* 用统一积分攻击入口捕获“真正命中 / 被普通防御挡下”的结果。
   setTimeout 放到 renderAll 之后执行，避免卡片刚加动画就被重绘掉。 */

/* 闪电专用防御：绝不经过普通龟壳、香蕉、喇叭或羽毛。
   只有害羞幽灵保护，以及正在生效的无敌星 / 巨大蘑菇可以挡住。 */
function tryDefendLightningV2116(target) {
  // 害羞幽灵的一次性保护也可以挡闪电，并且优先于持续状态消耗。
  if (Number(target?.booShield || 0) > 0) {
    target.booShield = Math.max(0, Number(target.booShield || 0) - 1);
    tinyDefenseToast(`${target.name} 的害羞幽灵保护阻挡了闪电`);
    setTimeout(
      () => playAttackTargetFxV2116(target.id, "lightning", true),
      120,
    );
    return true;
  }

  const type = target?.itemEffect?.type;
  if (!["star", "mega"].includes(type)) return false;

  const name = ITEM_DEFS[type]?.name || "持续状态";
  // 防御按答题轮次计时，挡下闪电不消耗轮次。
  tinyDefenseToast(`${target.name} 的${name}阻挡了闪电`);
  setTimeout(() => playAttackTargetFxV2116(target.id, "lightning", true), 120);
  return true;
}

function applyLightningHitV2116(caster, target) {
  if (!target || !eligibleForItems(target)) return false;

  if (tryDefendLightningV2116(target)) return false;

  const before = Number(target.score) || 0;
  target.score =
    before -
    (globalThis.ItemModules
      ? ItemModules.scoreDelta("lightning", roundHalf(before))
      : roundHalf(before));
  target.displayScore = target.score;

  // 被劈中后所有背包道具直接消失。
  target.inventory = [];

  // 强力蘑菇的持续效果强制解除。
  if (target.itemEffect?.type === "power") {
    target.itemEffect = null;
  }

  setTimeout(() => playAttackTargetFxV2116(target.id, "lightning", false), 120);
  return true;
}

/* 攻击者也必须有视觉反馈。
   showItemUseFx 本身在成功使用后触发，这里补一层当前真实 key 的卡片发动效果。 */
const _v2116ShowItemUseFx = showItemUseFx;
showItemUseFx = function (key, casterId = null, targetText = "") {
  if (casterId != null && ITEM_DEFS[key]) {
    setTimeout(() => playCasterCardFx(key, casterId), 30);
  }
  return _v2116ShowItemUseFx.call(this, key, casterId, targetText);
};

/* V2.11.9：开发期奖池完整性检查，避免以后再新增道具却忘了接概率表。 */
(function validateItemPoolCoverageV2119() {
  try {
    const sample = itemDropWeights(12, 24);
    const missing = Object.keys(ITEM_DEFS).filter((k) => !(k in sample));
    if (missing.length) console.warn("道具权重池缺失：", missing);
  } catch (e) {}
})();

/* ===== V2.12.0：主要道具 / 次要道具队列系统 =====
   规则：
   1. inventory[0] 永远是主要道具，只允许主要道具被主动使用；
   2. inventory[1]/[2] 为次要道具，严格按获得顺序晋升；
   3. 三重道具必须 charges 全部耗尽后才释放主栏；
   4. 无敌星 / 巨大蘑菇 / 强力蘑菇激活后都属于“卡手”主要道具，
      持续状态彻底结束前，后续道具不得晋升或使用；
   5. 被动防御同样只允许主要道具参与，避免次要道具绕过队列。
*/
