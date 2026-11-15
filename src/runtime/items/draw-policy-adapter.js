/* The only compatibility entry for ordinary draw weights; the pure MKWorld Product.180 policy owns calculation. */
function collectMkwFieldCounts() {
  ensureItemState();
  const counts = {};
  if (Number(state.itemGlobal?.blooperUntil || 0) > Date.now()) {
    counts.blooper = 1;
  }
  for (const g of state.groups || []) {
    for (const it of g?.inventory || []) {
      if (it?.key) counts[it.key] = (counts[it.key] || 0) + 1;
    }
  }
  return counts;
}

function getMkwDrawConfig() {
  ensureItemState();
  const normalized = ItemDrawPolicy.normalizeConfig(
    state.itemGlobal?.drawConfig,
  );
  if (state?.itemGlobal) state.itemGlobal.drawConfig = normalized;
  return normalized;
}

function ensureMkwDrawState() {
  ensureItemState();
  const mkw = state.itemGlobal.mkwState;
  return mkw;
}

function itemDropWeights(pos, total, opts = {}) {
  const ordered = ranking();
  const safeTotal = Math.max(1, Number(total) || ordered.length || 1);
  const position = Math.max(
    1,
    Math.min(safeTotal, Math.trunc(Number(pos) || 1)),
  );
  const group = ordered[position - 1];
  const cfg = opts.config || getMkwDrawConfig();
  const mkw = ensureMkwDrawState();
  const sessionNo =
    (typeof activeDrawSessionV21710 !== "undefined" &&
      activeDrawSessionV21710?.no) ||
    state.itemGlobal?.drawSessionThrottleV21710?.sessionNo ||
    1;
  return ItemDrawPolicy.weights({
    config: cfg,
    position,
    total: safeTotal,
    score: opts.score ?? (group?.score || 0),
    eligible: opts.eligible ?? (group ? eligibleForItems(group) : true),
    held: opts.held ?? (group?.inventory?.map((item) => item.key) || []),
    batch: opts.batch || [],
    field: opts.field ?? collectMkwFieldCounts(),
    moduleConfig:
      opts.moduleConfig ??
      (globalThis.ItemModules ? ItemModules.configuration().items : null),
    nowMs: opts.nowMs ?? (opts.live ? Date.now() : undefined),
    matchStartedAt: opts.matchStartedAt ?? mkw.matchStartedAt,
    elapsedFrames: opts.elapsedFrames,
    applyRankClamp: opts.applyRankClamp ?? false,
    lastUsedAt: opts.lastUsedAt ?? mkw.lastUsedAt,
    lastUsedSession: opts.lastUsedSession ?? mkw.lastUsedSession,
    sessionNo: opts.sessionNo ?? sessionNo,
    exactColumn: opts.exactColumn,
    strictPreview: opts.strictPreview,
  });
}
