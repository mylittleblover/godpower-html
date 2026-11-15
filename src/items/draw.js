/* Canonical MKWorld Product.180 draw executor: Mode -> Rank -> Ratio Table -> SwitchPreset/Interval/NumLimit Gates -> Weighted Pick -> ParamByRank telemetry -> Cooldown commit. */
const ItemDrawBlocks = (() => {
  function pick(group, batchUsed = new Set(), options = {}) {
    if (!group || !eligibleForItems(group)) return null;
    ensureItemState();
    const ordered = ranking();
    const total = Math.max(1, ordered.length);
    const found = ordered.findIndex((g) => g.id === group.id);
    const position = found >= 0 ? found + 1 : 1;
    const config =
      typeof getMkwDrawConfig === "function"
        ? getMkwDrawConfig()
        : ItemDrawPolicy.normalizeConfig(state.itemGlobal?.drawConfig);
    const mkw =
      typeof ensureMkwDrawState === "function"
        ? ensureMkwDrawState()
        : (state.itemGlobal.mkwState ||= {
            matchStartedAt: Date.now(),
            lastUsedAt: {},
            lastUsedSession: {},
          });
    const sessionState =
      typeof ensureDrawSessionThrottleV21710 === "function"
        ? ensureDrawSessionThrottleV21710()
        : { sessionNo: 1 };
    const sessionNo = Math.max(
      1,
      Number(
        (typeof activeDrawSessionV21710 !== "undefined" &&
          activeDrawSessionV21710?.no) ||
          sessionState.sessionNo ||
          1,
      ),
    );
    const held = (group.inventory || []).map((it) => it?.key).filter(Boolean);
    const nowMs = Number.isFinite(Number(options.nowMs))
      ? Number(options.nowMs)
      : Date.now();
    const field =
      typeof collectMkwFieldCounts === "function"
        ? collectMkwFieldCounts()
        : {};
    const evaluation = ItemDrawPolicy.evaluate({
      config,
      position,
      total,
      score: group.score,
      eligible: eligibleForItems(group),
      held,
      batch: batchUsed ? [...batchUsed] : [],
      field,
      moduleConfig: globalThis.ItemModules
        ? ItemModules.configuration().items
        : null,
      nowMs,
      matchStartedAt: mkw.matchStartedAt,
      applyRankClamp: true,
      lastUsedAt: mkw.lastUsedAt,
      lastUsedSession: mkw.lastUsedSession,
      sessionNo,
    });
    const key = ItemDrawPolicy.pickWeighted(
      evaluation.weights,
      options.random || (() => Math.random()),
    );
    if (
      typeof firstHandDrawPendingV218 !== "undefined" &&
      typeof handItemDrawGroupId !== "undefined" &&
      handItemDrawGroupId === group.id
    ) {
      firstHandDrawPendingV218 = false;
    }
    if (!key) return null;
    mkw.lastUsedAt[key] = nowMs;
    mkw.lastUsedSession[key] = sessionNo;
    mkw.lastDraw = {
      key,
      groupId: group.id,
      position,
      total,
      mode: evaluation.mode,
      tableName: evaluation.tableName,
      column: evaluation.column,
      rawRank: evaluation.rawRank,
      rank: evaluation.rank,
      paramsForRank: evaluation.paramsForRank,
      activeGates: evaluation.activeGates,
      at: nowMs,
    };
    if (typeof commitSessionDrawV21710 === "function") {
      commitSessionDrawV21710(group, key);
    }
    return key;
  }
  return { pick };
})();
globalThis.ItemDrawBlocks = ItemDrawBlocks;
