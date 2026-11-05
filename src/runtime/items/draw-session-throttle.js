/* ===== V2.17.10：修复闪电 / 鱿鱿冷却计数单位 =====
   V2.17.9 的问题：
   “全局抽取一次”会给很多小组各发 1 个道具，但旧逻辑把“每个小组拿到 1 个道具”
   都计成一次抽取。因此 16 组一次全局抽取里，冷却序号会连续 +16，
   闪电 / 鱿鱿甚至可能在同一轮全局抽取里重新解禁。

   新规则：
   - 点一次“全局道具抽取” = 1 个全局抽取轮次；
   - 点一次“举手奖励抽取” = 1 个全局抽取轮次；
   - 闪电 / 鱿鱿被抽中后，接下来 4 个“抽取轮次”完全禁用；
   - 到第 5 个抽取轮次才重新开放；
   - 同一个全局抽取轮次内，闪电 / 鱿鱿各最多出现 1 次。
*/

function ensureDrawSessionThrottleV21710() {
  ensureItemState();

  if (
    !state.itemGlobal.drawSessionThrottleV21710 ||
    typeof state.itemGlobal.drawSessionThrottleV21710 !== "object"
  ) {
    state.itemGlobal.drawSessionThrottleV21710 = {
      sessionNo: 0,
      nextEligibleSession: { lightning: 0, blooper: 0 },
    };
  }

  const t = state.itemGlobal.drawSessionThrottleV21710;
  t.sessionNo = Math.max(0, Math.floor(Number(t.sessionNo) || 0));

  if (!t.nextEligibleSession || typeof t.nextEligibleSession !== "object") {
    t.nextEligibleSession = { lightning: 0, blooper: 0 };
  }
  ["lightning", "blooper"].forEach((k) => {
    t.nextEligibleSession[k] = Math.max(
      0,
      Math.floor(Number(t.nextEligibleSession[k]) || 0),
    );
  });

  return t;
}

let activeDrawSessionV21710 = null;

function beginDrawSessionV21710(kind) {
  const t = ensureDrawSessionThrottleV21710();
  t.sessionNo += 1;

  activeDrawSessionV21710 = {
    no: t.sessionNo,
    kind,
    selectedGlobalUnique: new Set(),
  };

  /* 状态在动画开始时就存下来，刷新页面也不会把轮次吃掉。 */
  try {
    saveState();
  } catch (e) {}
  return activeDrawSessionV21710;
}

function sessionRestrictedWeightsV21710(g) {
  const r = ranking();
  const pos = Math.max(1, r.findIndex((x) => x.id === g.id) + 1);
  const W = { ...itemDropWeights(pos, r.length) };

  const t = ensureDrawSessionThrottleV21710();
  const sessionNo = activeDrawSessionV21710?.no || t.sessionNo;

  for (const key of ["lightning", "blooper"]) {
    const next = Math.max(0, Number(t.nextEligibleSession[key]) || 0);

    /* 还没到重新开放的轮次。 */
    if (sessionNo < next) {
      W[key] = 0;
      continue;
    }

    /* 同一轮全局抽取里已经有人拿过，就绝不再出现第二个。 */
    if (activeDrawSessionV21710?.selectedGlobalUnique?.has(key)) {
      W[key] = 0;
    }
  }

  /* 原有场上唯一性仍继续生效。 */
  if (itemExistsOnFieldV2172("lightning")) W.lightning = 0;
  if (itemExistsOnFieldV2172("blooper")) W.blooper = 0;

  return W;
}

function commitSessionDrawV21710(g, key) {
  const t = ensureDrawSessionThrottleV21710();
  const sessionNo = activeDrawSessionV21710?.no || t.sessionNo;

  if (GLOBAL_FIVE_DRAW_ITEMS_V2179.has(key)) {
    /* 本轮抽中后，第 1~4 个后续轮次禁用，第 5 个后续轮次恢复。
       例如第 10 轮抽中，则 11~14 禁用，第 15 轮重新开放。 */
    t.nextEligibleSession[key] = sessionNo + 5;

    if (activeDrawSessionV21710) {
      activeDrawSessionV21710.selectedGlobalUnique.add(key);
    }
  }
}

/* 最终挑选器再次接管。
   注意：这里完全不使用 V2.17.9 的 sequence / nextEligible 来判断闪电和鱿鱿，
   否则老 bug 会从坟里爬回来继续数“小组数”。 */
pickItemForGroupV281 = function (g, batchUsed = new Set()) {
  const held = heldItemKeysV281(g);
  const weights = sessionRestrictedWeightsV21710(g);

  let k = weightedPickNoRepeatV281(weights, new Set([...batchUsed, ...held]));

  if (!k) k = weightedPickNoRepeatV281(weights, held);
  if (!k) k = weightedPick(weights);

  if (!k) {
    const fallback = {};
    ITEM_KEYS.forEach((key) => {
      if (Number(weights[key]) > 0) fallback[key] = Number(weights[key]);
    });
    k = Object.keys(fallback).length ? weightedPick(fallback) : null;
  }

  if (k) commitSessionDrawV21710(g, k);
  return k;
};

/* 最外层全局抽取包装：
   只有确实具备可抽取小组、且不是正在抽取时，才开始计一个“抽取轮次”。 */

/* 举手奖励同样算一个抽取轮次。 */

/* 数据页说明改成“抽取轮次”，避免再把“发了几个道具”误认为“抽了几次”。 */
function refreshDrawCooldownInfoV21710() {
  const host = document.getElementById("drawCooldownInfoV2179");
  if (!host) return;

  const t = ensureDrawSessionThrottleV21710();

  const text = (key, label) => {
    const next = Number(t.nextEligibleSession[key] || 0);
    if (!next || t.sessionNo >= next) return `${label}：当前可抽取`;
    return `${label}：第 ${next} 个抽取轮次重新开放（当前第 ${t.sessionNo} 轮）`;
  };

  host.innerHTML = `
    <b>抽取冷却规则</b>
    <span>闪电 / 鱿鱿按“抽取轮次”计算，不按一次全局抽取发出了多少个道具计算。</span>
    <span>抽中后，接下来 4 个全局/举手抽取轮次禁用，第 5 个轮次重新开放。</span>
    <small>当前全局抽取轮次：${t.sessionNo}</small>
    <small>${text("lightning", "闪电")}</small>
    <small>${text("blooper", "鱿鱿")}</small>
  `;
}

/* 设置页面被重建时更新冷却状态说明。 */
if (typeof installDrawCooldownInfoV2179 === "function") {
  const _v21710InstallInfo = installDrawCooldownInfoV2179;
  installDrawCooldownInfoV2179 = function (...args) {
    const r = _v21710InstallInfo.apply(this, args);
    refreshDrawCooldownInfoV21710();
    return r;
  };
}

if (typeof showSettingsV26 === "function") {
  const _v21710ShowSettings = showSettingsV26;
  showSettingsV26 = function (which, ...args) {
    const r = _v21710ShowSettings.call(this, which, ...args);
    if (which === "data") {
      setTimeout(refreshDrawCooldownInfoV21710, 0);
    }
    return r;
  };
}

/* 百科文字同步为“抽取轮次”。 */
if (ITEM_DEFS.lightning) {
  ITEM_DEFS.lightning.desc =
    "攻击所有排名高于自己的小组并大幅削减积分；无敌星、巨大蘑菇、害羞幽灵可防御。仅后30%可抽取；整局按抽取轮次冷却，抽中后接下来4个抽取轮次不会出现，第5轮重新开放；场上同时最多存在1个。";
}
if (ITEM_DEFS.blooper) {
  ITEM_DEFS.blooper.desc =
    "使全场积分、领奖台与图表暂时被墨汁遮蔽。整局按抽取轮次冷却，抽中后接下来4个抽取轮次不会出现，第5轮重新开放；场上同时最多存在1个。";
}

/* 旧抽取序号和单组强力禁抽记录不参与现行候选判定。 */
setTimeout(() => {
  try {
    refreshDrawCooldownInfoV21710();
  } catch (e) {}
}, 300);
