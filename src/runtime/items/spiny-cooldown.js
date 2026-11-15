/* ===== 刺刺龟壳冷却兼容性视图：实际门控已统一由 ItemDrawPolicy (MKWorld Product.180 ItemIntervalLimitDefault: 开局 2100f/35s · 冷却 5400f/90s · 场上上限 1) 接管 ===== */

function ensureSpinyCooldownV21717() {
  const t = ensureDrawSessionThrottleV21710();
  if (!Number.isFinite(Number(t.nextEligibleSession.spiny))) {
    t.nextEligibleSession.spiny = 0;
  }
  t.nextEligibleSession.spiny = Math.max(
    0,
    Math.floor(Number(t.nextEligibleSession.spiny) || 0),
  );
  return t;
}

if (typeof refreshDrawCooldownInfoV21710 === "function") {
  const _v21717RefreshCooldownInfo = refreshDrawCooldownInfoV21710;
  refreshDrawCooldownInfoV21710 = function () {
    _v21717RefreshCooldownInfo.call(this);

    const host = document.getElementById("drawCooldownInfoV2179");
    if (!host || document.getElementById("spinyCooldownLineV21717")) return;

    const mkw = state.itemGlobal?.mkwState || {};
    const lastSpiny = Number(mkw.lastUsedAt?.spiny || 0);
    const extra = document.createElement("small");
    extra.id = "spinyCooldownLineV21717";
    extra.textContent = !lastSpiny
      ? "刺刺龟壳：按 Product.180 规则判定（开局 35s · 冷却 90s · 上限 1）"
      : `刺刺龟壳：上次触发于 ${Math.max(0, Math.round((Date.now() - lastSpiny) / 1000))} 秒前`;
    host.appendChild(extra);
  };
}

setTimeout(() => {
  try {
    refreshDrawCooldownInfoV21710();
  } catch (e) {}
}, 350);
