/* Mario Kart World (Product.180) item draw policy engine. Pure domain module: no DOM, storage or timers. */
const ItemDrawPolicy = (() => {
  const DATA =
    typeof MKWProduct180Data !== "undefined" ? MKWProduct180Data : null;

  const ITEM_KEYS_CANONICAL = Object.freeze([
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
  ]);

  const HIGH_IMPACT = Object.freeze([
    "star",
    "mega",
    "bullet",
    "lightning",
    "power",
    "spiny",
  ]);

  const UNIQUE_KEYS = Object.freeze([
    "spiny",
    "coin_shell",
    "question",
    "blooper",
    "kamek",
    "item_box",
  ]);

  const RACING_TABLES = new Set([
    "ItemTableStandard",
    "ItemTableDynamic",
    "ItemTableSimpleCom",
  ]);

  const BATTLE_MODES = new Set([
    "Battle",
    "BattleDynamic",
    "BattleCoin",
    "BattleCoinDynamic",
  ]);

  const SINGLE_COL_MODES = new Set(["FreeRun", "Mission", "NetInterval"]);

  const KINOKO_ONLY_SPEC = Object.freeze({
    id: "KinokoOnly",
    jpName: "キノコのみ",
    type: "KinokoOnly",
    table: "ItemTableKinokoOnly",
    gateTable: "ItemTableKinokoOnly",
    enableComTable: false,
    comTable: null,
    comGateTable: null,
    intervalTable: null,
    numLimitTable: null,
    enableSame: true,
    ignorePenalty: true,
    rankClamp: null,
  });

  const DEFAULT_CONFIG = Object.freeze({
    mode: "24KartRace",
    switchPreset: "ALL",
    useComTable: false,
    enableSame: false,
    ignorePenalty: false,
    timingMode: "realtime",
    positionMapping: "auto",
    includeClassroomItemBox: true,
    applyPostDrawRankParams: true,
  });

  const FRAMES_PER_SECOND = 60;
  const FRAMES_PER_ROUND = 1080; // 18s per classroom round equivalent

  function allModeSpecs() {
    const base = DATA?.MODES ? [...DATA.MODES] : [];
    const idx = base.findIndex((m) => m.id === "Kinoko3Only");
    if (idx >= 0) base.splice(idx, 0, KINOKO_ONLY_SPEC);
    else base.push(KINOKO_ONLY_SPEC);
    return base;
  }

  function modes() {
    const labels = DATA?.MODE_LABELS || {};
    return allModeSpecs().map((spec) => ({
      ...spec,
      ...(labels[spec.id] || { name: spec.id, group: "其他", desc: "" }),
    }));
  }

  function modeSpec(modeId) {
    const list = allModeSpecs();
    return list.find((m) => m.id === modeId) || list[0] || null;
  }

  function switchPresets() {
    const meta = DATA?.SWITCH_PRESET_META || {};
    const sets = DATA?.SWITCH_PRESETS || {};
    const out = [
      {
        id: "ALL",
        ...(meta.ALL || { name: "全道具开放（默认）", desc: "" }),
        keys: ITEM_KEYS_CANONICAL,
      },
    ];
    for (const id of Object.keys(sets)) {
      out.push({
        id,
        ...(meta[id] || { name: id, desc: "" }),
        keys: sets[id],
      });
    }
    return out;
  }

  function presetAllowedSet(presetId) {
    if (!presetId || presetId === "ALL") return null;
    const list = DATA?.SWITCH_PRESETS?.[presetId];
    return Array.isArray(list) ? new Set(list) : null;
  }

  function defaultConfig() {
    return { ...DEFAULT_CONFIG };
  }

  function normalizeConfig(raw = {}) {
    const src = raw && typeof raw === "object" ? raw : {};
    const validModes = new Set(allModeSpecs().map((m) => m.id));
    const mode = validModes.has(src.mode) ? src.mode : DEFAULT_CONFIG.mode;
    const presetIds = new Set([
      "ALL",
      ...Object.keys(DATA?.SWITCH_PRESETS || {}),
    ]);
    const switchPreset = presetIds.has(src.switchPreset)
      ? src.switchPreset
      : DEFAULT_CONFIG.switchPreset;
    return {
      mode,
      switchPreset,
      useComTable:
        typeof src.useComTable === "boolean"
          ? src.useComTable
          : DEFAULT_CONFIG.useComTable,
      enableSame:
        typeof src.enableSame === "boolean"
          ? src.enableSame
          : DEFAULT_CONFIG.enableSame,
      ignorePenalty:
        typeof src.ignorePenalty === "boolean"
          ? src.ignorePenalty
          : DEFAULT_CONFIG.ignorePenalty,
      timingMode:
        src.timingMode === "rounds" || src.timingMode === "realtime"
          ? src.timingMode
          : DEFAULT_CONFIG.timingMode,
      positionMapping:
        src.positionMapping === "exact" || src.positionMapping === "auto"
          ? src.positionMapping
          : DEFAULT_CONFIG.positionMapping,
      includeClassroomItemBox:
        typeof src.includeClassroomItemBox === "boolean"
          ? src.includeClassroomItemBox
          : DEFAULT_CONFIG.includeClassroomItemBox,
      applyPostDrawRankParams:
        typeof src.applyPostDrawRankParams === "boolean"
          ? src.applyPostDrawRankParams
          : DEFAULT_CONFIG.applyPostDrawRankParams,
    };
  }

  function framesToSessions(frames) {
    if (!Number.isFinite(frames) || frames <= 0) return 0;
    return Math.max(1, Math.round(frames / FRAMES_PER_ROUND));
  }

  function clampPosition(position, total) {
    const safeTotal = Math.max(1, Math.floor(Number(total) || 1));
    const safePos = Math.min(
      safeTotal,
      Math.max(1, Math.floor(Number(position) || 1)),
    );
    return { position: safePos, total: safeTotal };
  }

  function clampValueForFrame(rankClamp, elapsedFrames) {
    if (!rankClamp) return null;
    const f = Math.max(0, Number(elapsedFrames) || 0);
    if (f < rankClamp.minFrame) return rankClamp.firstValue;
    if (f >= rankClamp.maxFrame) return rankClamp.maxValue;
    const span = Math.max(1, rankClamp.maxFrame - rankClamp.minFrame);
    const ratio = (f - rankClamp.minFrame) / span;
    return (
      rankClamp.minValue + (rankClamp.maxValue - rankClamp.minValue) * ratio
    );
  }

  function resolveRank(position, total, options = {}) {
    const { position: pos, total: count } = clampPosition(position, total);
    const rankTable = DATA?.RANK_TABLE || [];
    let rowIdx;
    let colIdx;
    if (count <= 24) {
      rowIdx = count - 1;
      colIdx = pos - 1;
    } else {
      rowIdx = 23;
      colIdx =
        pos === 1
          ? 0
          : Math.min(23, Math.round(((pos - 1) / (count - 1)) * 23));
    }
    const rawRank = rankTable[rowIdx]?.[colIdx] ?? null;
    const spec = modeSpec(options.mode || DEFAULT_CONFIG.mode);
    const elapsedFrames =
      options.elapsedFrames ??
      Math.max(
        0,
        ((Number(options.nowMs) || 0) - (Number(options.matchStartedAt) || 0)) /
          (1000 / FRAMES_PER_SECOND),
      );
    const clampVal = clampValueForFrame(spec?.rankClamp, elapsedFrames);
    const effectiveRank =
      rawRank === null
        ? null
        : clampVal !== null && options.applyRankClamp
          ? Math.min(rawRank, Math.round(clampVal))
          : rawRank;
    return {
      rawRank,
      rank: effectiveRank,
      clampValue: clampVal,
    };
  }

  function resolveColumn(modeId, position, total, options = {}) {
    const { position: pos, total: count } = clampPosition(position, total);
    if (options.exactColumn || options.positionMapping === "exact") {
      return Math.min(24, pos);
    }
    if (SINGLE_COL_MODES.has(modeId)) return 1;
    if (BATTLE_MODES.has(modeId)) return Math.min(12, pos);
    if (count === 24) return pos;
    if (count > 24) {
      return 1 + Math.round(((pos - 1) / Math.max(1, count - 1)) * 23);
    }
    if (count >= 12) return pos;
    if (count <= 1 || pos <= 1) return 1;
    return Math.min(12, 1 + Math.round(((pos - 1) / (count - 1)) * 11));
  }

  function activeTableName(spec, useComTable) {
    if (!spec) return "ItemTableStandard";
    if (useComTable && spec.enableComTable && spec.comTable) {
      return spec.comTable;
    }
    return spec.table;
  }

  function zeroWeightMap() {
    return Object.fromEntries(ITEM_KEYS_CANONICAL.map((k) => [k, 0]));
  }

  function rawColumnWeights(modeId, position, total, options = {}) {
    const spec = modeSpec(modeId);
    const tableName = activeTableName(spec, !!options.useComTable);
    const col = resolveColumn(spec?.id || modeId, position, total, options);
    const table = DATA?.WEIGHT_TABLES?.[tableName] || {};
    const out = zeroWeightMap();
    for (const key of ITEM_KEYS_CANONICAL) {
      const row = table[key];
      if (row) out[key] = Number(row[col - 1]) || 0;
    }
    if (
      options.includeClassroomItemBox !== false &&
      RACING_TABLES.has(tableName) &&
      col >= 3 &&
      col <= 7
    ) {
      out.item_box = 4;
    }
    return { tableName, column: col, weights: out };
  }

  function intervalRule(spec, key) {
    const table =
      spec?.intervalTable === "ItemIntervalLimitBattle"
        ? DATA?.INTERVAL_LIMIT_BATTLE
        : DATA?.INTERVAL_LIMIT_DEFAULT;
    return table?.[key] || null;
  }

  function numLimit(spec, key, includeClassroomItemBox) {
    const table =
      spec?.numLimitTable === "ItemNumLimitBattle"
        ? DATA?.NUM_LIMIT_BATTLE
        : DATA?.NUM_LIMIT_DEFAULT;
    if (table && Object.prototype.hasOwnProperty.call(table, key)) {
      return table[key];
    }
    if (key === "item_box" && includeClassroomItemBox !== false) {
      return spec?.numLimitTable === "ItemNumLimitBattle" ? null : 1;
    }
    return null;
  }

  function moduleMultiplier(moduleConfig, key) {
    const draw = moduleConfig?.[key]?.draw;
    if (!draw) return 1;
    if (draw.enabled === false) return 0;
    const w = Number(draw.weight);
    return Number.isFinite(w) && w >= 0 ? w : 1;
  }

  function anyModuleEnabled(moduleConfig) {
    if (!moduleConfig) return true;
    return ITEM_KEYS_CANONICAL.some(
      (k) => moduleMultiplier(moduleConfig, k) > 0,
    );
  }

  function buildFieldCountMap(field) {
    const counts = {};
    if (!field) return counts;
    if (Array.isArray(field) || field instanceof Set) {
      for (const k of field) counts[k] = (counts[k] || 0) + 1;
      return counts;
    }
    if (typeof field === "object") {
      for (const [k, v] of Object.entries(field)) {
        counts[k] = Math.max(0, Number(v) || 0);
      }
    }
    return counts;
  }

  function positiveSum(w) {
    let total = 0;
    for (const key of ITEM_KEYS_CANONICAL) {
      const val = Number(w[key]) || 0;
      if (val > 0) total += val;
    }
    return total;
  }

  function evaluate(context = {}) {
    const config = normalizeConfig(context.config || context);
    const spec = modeSpec(config.mode);
    const effectiveSame = !!(spec?.enableSame || config.enableSame);
    const effectiveIgnorePenalty = !!(
      spec?.ignorePenalty || config.ignorePenalty
    );
    const pos = context.position ?? 1;
    const total = context.total ?? 1;
    const rankInfo = resolveRank(pos, total, {
      mode: spec?.id,
      nowMs: context.nowMs,
      matchStartedAt: context.matchStartedAt,
      elapsedFrames: context.elapsedFrames,
      applyRankClamp: context.applyRankClamp,
    });

    const rankKey = rankInfo.rawRank === null ? 0 : rankInfo.rawRank;
    const paramsForRank = paramByRank(rankKey);

    if (context.eligible === false || (Number(context.score) || 0) < 0) {
      return {
        mode: spec?.id || config.mode,
        tableName: activeTableName(spec, config.useComTable),
        column: resolveColumn(spec?.id || config.mode, pos, total, config),
        rawRank: rankInfo.rawRank,
        rank: rankInfo.rank,
        rankClampValue: rankInfo.clampValue,
        rawWeights: zeroWeightMap(),
        weights: zeroWeightMap(),
        blockedReasons: {},
        activeGates: {
          relaxedAntiRepeat: false,
          relaxedStartDelay: false,
          relaxedCooldown: false,
          relaxedFieldCap: false,
          relaxedPresetColumn: false,
        },
        paramsForRank,
      };
    }

    const raw = rawColumnWeights(spec?.id || config.mode, pos, total, {
      useComTable: config.useComTable,
      exactColumn: context.exactColumn || config.positionMapping === "exact",
      includeClassroomItemBox: config.includeClassroomItemBox,
    });

    const presetSet = presetAllowedSet(config.switchPreset);
    const moduleConfig = context.moduleConfig || null;
    const heldSet = new Set(context.held || []);
    const batchSet = new Set(context.batch || []);
    const fieldCounts = buildFieldCountMap(context.field);

    const hasNow = Number.isFinite(Number(context.nowMs));
    const nowMs = hasNow ? Number(context.nowMs) : 0;
    const startedAt = Number.isFinite(Number(context.matchStartedAt))
      ? Number(context.matchStartedAt)
      : nowMs;
    const elapsedFrames = Number.isFinite(Number(context.elapsedFrames))
      ? Math.max(0, Number(context.elapsedFrames))
      : hasNow
        ? Math.max(0, ((nowMs - startedAt) / 1000) * FRAMES_PER_SECOND)
        : Infinity;
    const lastUsedAt = context.lastUsedAt || {};
    const lastUsedSession = context.lastUsedSession || {};
    const sessionNo = Math.max(1, Math.floor(Number(context.sessionNo) || 1));

    const blockedReasons = {};
    for (const key of ITEM_KEYS_CANONICAL) {
      const reasons = [];
      if (raw.weights[key] <= 0) {
        blockedReasons[key] = reasons;
        continue;
      }
      if (presetSet && !presetSet.has(key)) reasons.push("switch_preset");
      if (moduleMultiplier(moduleConfig, key) <= 0)
        reasons.push("module_disabled");
      const cap = numLimit(spec, key, config.includeClassroomItemBox);
      if (cap !== null && (fieldCounts[key] || 0) >= cap)
        reasons.push("field_cap");
      if (!effectiveIgnorePenalty) {
        const rule = intervalRule(spec, key);
        if (rule) {
          if (config.timingMode === "rounds") {
            const startRounds = framesToSessions(rule.startFrame);
            if (startRounds > 0 && sessionNo <= startRounds)
              reasons.push("start_delay");
            const cdRounds = framesToSessions(rule.intervalFrame);
            const lastSess = Number(lastUsedSession[key]) || 0;
            if (cdRounds > 0 && lastSess > 0 && sessionNo < lastSess + cdRounds)
              reasons.push("cooldown");
          } else {
            if (rule.startFrame > 0 && elapsedFrames < rule.startFrame)
              reasons.push("start_delay");
            const cdFrames = Number(rule.intervalFrame) || 0;
            const lastMs = Number(lastUsedAt[key]) || 0;
            if (cdFrames > 0 && lastMs > 0 && hasNow) {
              const sinceFrames = Math.max(
                0,
                ((nowMs - lastMs) / 1000) * FRAMES_PER_SECOND,
              );
              if (sinceFrames < cdFrames) reasons.push("cooldown");
            }
          }
        }
      }
      if (!effectiveSame && heldSet.has(key)) reasons.push("held");
      if (batchSet.has(key)) reasons.push("batch");
      blockedReasons[key] = reasons;
    }

    function filterWith({
      allowAntiRepeat = false,
      allowStartDelay = false,
      allowCooldown = false,
      allowFieldCap = false,
      sourceWeights = raw.weights,
    }) {
      const out = zeroWeightMap();
      for (const key of ITEM_KEYS_CANONICAL) {
        const base = Number(sourceWeights[key]) || 0;
        if (base <= 0) continue;
        if (presetSet && !presetSet.has(key)) continue;
        const mult = moduleMultiplier(moduleConfig, key);
        if (mult <= 0) continue;
        if (!allowFieldCap) {
          const cap = numLimit(spec, key, config.includeClassroomItemBox);
          if (cap !== null && (fieldCounts[key] || 0) >= cap) continue;
        }
        if (!effectiveIgnorePenalty) {
          const rule = intervalRule(spec, key);
          if (rule) {
            if (!allowStartDelay && rule.startFrame > 0) {
              const blocked =
                config.timingMode === "rounds"
                  ? sessionNo <= framesToSessions(rule.startFrame)
                  : elapsedFrames < rule.startFrame;
              if (blocked) continue;
            }
            if (!allowCooldown && (Number(rule.intervalFrame) || 0) > 0) {
              let blocked = false;
              if (config.timingMode === "rounds") {
                const cdRounds = framesToSessions(rule.intervalFrame);
                const lastSess = Number(lastUsedSession[key]) || 0;
                blocked = lastSess > 0 && sessionNo < lastSess + cdRounds;
              } else if (hasNow) {
                const lastMs = Number(lastUsedAt[key]) || 0;
                const sinceFrames = Math.max(
                  0,
                  ((nowMs - lastMs) / 1000) * FRAMES_PER_SECOND,
                );
                blocked = lastMs > 0 && sinceFrames < rule.intervalFrame;
              }
              if (blocked) continue;
            }
          }
        }
        if (!allowAntiRepeat) {
          if (!effectiveSame && heldSet.has(key)) continue;
          if (batchSet.has(key)) continue;
        }
        out[key] = base * mult;
      }
      return out;
    }

    let weights = filterWith({});
    const activeGates = {
      relaxedAntiRepeat: false,
      relaxedStartDelay: false,
      relaxedCooldown: false,
      relaxedFieldCap: false,
      relaxedPresetColumn: false,
    };

    const strictPreview = !!context.strictPreview;
    if (
      !strictPreview &&
      positiveSum(weights) <= 0 &&
      anyModuleEnabled(moduleConfig)
    ) {
      weights = filterWith({ allowAntiRepeat: true });
      if (positiveSum(weights) > 0) activeGates.relaxedAntiRepeat = true;

      if (positiveSum(weights) <= 0) {
        weights = filterWith({ allowAntiRepeat: true, allowStartDelay: true });
        if (positiveSum(weights) > 0) activeGates.relaxedStartDelay = true;
      }
      if (positiveSum(weights) <= 0) {
        weights = filterWith({
          allowAntiRepeat: true,
          allowStartDelay: true,
          allowCooldown: true,
        });
        if (positiveSum(weights) > 0) activeGates.relaxedCooldown = true;
      }
      if (positiveSum(weights) <= 0) {
        weights = filterWith({
          allowAntiRepeat: true,
          allowStartDelay: true,
          allowCooldown: true,
          allowFieldCap: true,
        });
        if (positiveSum(weights) > 0) activeGates.relaxedFieldCap = true;
      }
      // If a Switch Preset excludes every item in this specific rank column,
      // fall back to preset items weighted across the table so players never soft-lock.
      if (positiveSum(weights) <= 0 && presetSet) {
        const table = DATA?.WEIGHT_TABLES?.[raw.tableName] || {};
        const fallbackWeights = zeroWeightMap();
        for (const key of presetSet) {
          const mult = moduleMultiplier(moduleConfig, key);
          if (mult <= 0) continue;
          const row = table[key];
          const maxCol = row ? Math.max(...row) : 0;
          fallbackWeights[key] = (maxCol > 0 ? maxCol : 10) * mult;
        }
        if (positiveSum(fallbackWeights) > 0) {
          weights = fallbackWeights;
          activeGates.relaxedPresetColumn = true;
        }
      }
    }

    return {
      mode: spec?.id || config.mode,
      tableName: raw.tableName,
      column: raw.column,
      rawRank: rankInfo.rawRank,
      rank: rankInfo.rank,
      rankClampValue: rankInfo.clampValue,
      rawWeights: raw.weights,
      weights,
      blockedReasons,
      activeGates,
      paramsForRank,
    };
  }

  function weights(options = {}) {
    return evaluate(options).weights;
  }

  function pickWeighted(weightMap, rng = Math.random) {
    const entries = Object.entries(weightMap || {}).filter(
      ([, w]) => Number(w) > 0,
    );
    const total = entries.reduce((sum, [, w]) => sum + Number(w), 0);
    if (total <= 0) return null;
    let roll = (typeof rng === "function" ? rng() : Math.random()) * total;
    for (const [key, w] of entries) {
      roll -= Number(w);
      if (roll <= 0) return key;
    }
    return entries[entries.length - 1][0];
  }

  function paramByRank(itemOrRank, maybeRank) {
    const rank =
      typeof itemOrRank === "number"
        ? itemOrRank
        : typeof maybeRank === "number"
          ? maybeRank
          : 0;
    const idx = Math.min(23, Math.max(0, Math.floor(rank || 0)));
    const p = DATA?.PARAM_BY_RANK || {};
    return {
      rank: idx,
      inkLevel: p.InkLevel?.[idx] ?? 1,
      killerTargetRank: p.KillerTargetRank?.[idx] ?? 1,
      thunderFrame: p.ThunderFrame?.[idx] ?? 45,
    };
  }

  function describeGateTiming(modeId = "24KartRace", timingMode = "realtime") {
    const spec = modeSpec(modeId);
    const items = [];
    for (const key of ITEM_KEYS_CANONICAL) {
      const rule = intervalRule(spec, key);
      const cap = numLimit(spec, key, true);
      if (!rule && cap === null) continue;
      items.push({
        key,
        name:
          DATA?.OFFICIAL_ITEMS?.[key]?.name ||
          (key === "item_box" ? "道具箱" : key),
        startFrame: rule?.startFrame ?? 0,
        startSec: rule?.startFrame
          ? Math.round((rule.startFrame / FRAMES_PER_SECOND) * 10) / 10
          : 0,
        startRounds: framesToSessions(rule?.startFrame ?? 0),
        intervalFrame: rule?.intervalFrame ?? 0,
        intervalSec: rule?.intervalFrame
          ? Math.round((rule.intervalFrame / FRAMES_PER_SECOND) * 10) / 10
          : 0,
        intervalRounds: framesToSessions(rule?.intervalFrame ?? 0),
        numLimit: cap,
        timingMode,
      });
    }
    return items;
  }

  return Object.freeze({
    version: "Product.180",
    summary:
      "按 MKWorld (Product.180) 六步规则抽取：模式配置 → ItemRankTable 名次映射 → Ratio 权重列 → Switch预设 / 开局延迟 / 冷却 / 场上上限门控 → 加权抽取 → Rank 事后强度参数；28 号道具箱可在竞速模式中段作为课堂扩展启用。",
    keys: ITEM_KEYS_CANONICAL,
    highImpact: HIGH_IMPACT,
    unique: UNIQUE_KEYS,
    modes,
    modeSpec,
    switchPresets,
    defaultConfig,
    normalizeConfig,
    framesToSessions,
    resolveRank,
    resolveColumn,
    rawColumnWeights,
    evaluate,
    weights,
    pickWeighted,
    paramByRank,
    describeGateTiming,
  });
})();
globalThis.ItemDrawPolicy = ItemDrawPolicy;
