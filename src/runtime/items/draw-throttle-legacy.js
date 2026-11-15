/* ===== V2.17.9：道具抽取冷却限制 =====
   1. 闪电 / 鱿鱿：全局冷却。抽中后必须间隔 4 次其他实际抽取，
      到第 5 次实际抽取才重新进入候选池。
   2. 仅统计真正的最终抽取结果，不统计轮盘预览，不统计上帝模式追加。 */

const GLOBAL_FIVE_DRAW_ITEMS_V2179 = new Set(["lightning", "blooper"]);

function ensureDrawThrottleV2179() {
  ensureItemState();

  if (
    !state.itemGlobal.drawThrottleV2179 ||
    typeof state.itemGlobal.drawThrottleV2179 !== "object"
  ) {
    state.itemGlobal.drawThrottleV2179 = {
      sequence: 0,
      nextEligible: { lightning: 0, blooper: 0 },
    };
  }

  const t = state.itemGlobal.drawThrottleV2179;

  if (!Number.isFinite(Number(t.sequence))) t.sequence = 0;
  t.sequence = Math.max(0, Math.floor(Number(t.sequence) || 0));

  if (!t.nextEligible || typeof t.nextEligible !== "object")
    t.nextEligible = {};
  ["lightning", "blooper"].forEach((k) => {
    if (!Number.isFinite(Number(t.nextEligible[k]))) t.nextEligible[k] = 0;
    t.nextEligible[k] = Math.max(0, Math.floor(Number(t.nextEligible[k]) || 0));
  });

  return t;
}

function restrictedItemWeightsV2179(g) {
  const r = ranking();
  const pos = Math.max(1, r.findIndex((x) => x.id === g.id) + 1);
  const W = { ...itemDropWeights(pos, r.length) };
  const t = ensureDrawThrottleV2179();

  /* 当前即将产生的是第 sequence+1 次“实际最终抽取”。 */
  const drawNo = t.sequence + 1;

  /* 全局五抽冷却。
     例如第 10 抽抽中闪电，则 11~14 抽禁用，15 抽重新开放。 */
  for (const k of GLOBAL_FIVE_DRAW_ITEMS_V2179) {
    const next = Math.max(0, Number(t.nextEligible[k]) || 0);
    if (drawNo < next) W[k] = 0;
  }

  return { weights: W, drawNo, throttle: t };
}

function commitDrawThrottleV2179(g, key, drawNo, t) {
  /* 闪电 / 鱿鱿：本次之后至少间隔 4 次其他抽取，第 5 次重新开放。 */
  if (GLOBAL_FIVE_DRAW_ITEMS_V2179.has(key)) {
    t.nextEligible[key] = drawNo + 5;
  }

  t.sequence = drawNo;
}

/* 完整替换最终挑选器，确保所有 fallback 都不能绕过新限制。
   现已统一收口至 ItemDrawBlocks.pick / ItemDrawPolicy，此处不再覆写挑选器与官方百科描述。 */

/* 给设置页的道具区补一个小状态说明，便于实际使用时判断 MKWorld Product.180 与冷却有没有工作。 */
function installDrawCooldownInfoV2179() {
  const host = document.getElementById("clearAllItemsV2172");
  if (!host || document.getElementById("drawCooldownInfoV2179")) return;

  const t = ensureDrawThrottleV2179();
  const info = document.createElement("div");
  info.id = "drawCooldownInfoV2179";
  info.className = "cooldown-note";
  info.innerHTML = `
    <b>抽取冷却规则（MKWorld Product.180）</b>
    <span>由 ItemIntervalLimitDefault + 抽取轮次双轨管理全局冷却与场上上限。</span>
    <small>当前累计实际抽取序号：${t.sequence}</small>
  `;
  host.appendChild(info);
}

if (typeof installClearItemsSettingV2172 === "function") {
  const _v2179InstallClearItems = installClearItemsSettingV2172;
  installClearItemsSettingV2172 = function (...args) {
    const r = _v2179InstallClearItems.apply(this, args);
    installDrawCooldownInfoV2179();
    return r;
  };
}

setTimeout(() => {
  try {
    installDrawCooldownInfoV2179();
  } catch (e) {}
}, 300);
