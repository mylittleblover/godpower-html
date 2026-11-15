/* Deterministic random events engine (EV01-EV16). Pure domain logic: no DOM or storage. */
(function installRandomEvents(root) {
  "use strict";

  const CATEGORIES = Object.freeze([
    { id: "score", name: "得分狂欢", weight: 25 },
    { id: "item", name: "道具补给", weight: 25 },
    { id: "status", name: "状态与防护", weight: 20 },
    { id: "comeback", name: "追赶逆转", weight: 20 },
    { id: "special", name: "特殊机制", weight: 10 },
  ]);

  const DEFAULT_RARE_ITEMS = Object.freeze([
    "star",
    "mega",
    "bullet",
    "lightning",
    "power",
    "spiny",
    "blooper",
    "kamek",
    "item_box",
  ]);

  const CATALOG = Object.freeze([
    {
      id: "EV01",
      name: "双倍狂欢",
      category: "score",
      weight: 3,
      duration: 2,
      scope: "全体",
      description: "未来 2 回合内，正向答题基础积分翻倍（×2）。",
    },
    {
      id: "EV02",
      name: "黄金时刻",
      category: "score",
      weight: 4,
      duration: 3,
      scope: "全体",
      description: "未来 3 回合内，所有正确答题小组额外固定 +3 分。",
    },
    {
      id: "EV03",
      name: "幸运头奖",
      category: "score",
      weight: 3,
      duration: 0,
      scope: "随机 1 组",
      description: "随机 1 个小组立即获得 +5～+15 整数积分。",
    },
    {
      id: "EV04",
      name: "命运轮盘",
      category: "score",
      weight: 1,
      duration: 0,
      scope: "随机 1 组",
      description: "随机 1 个小组在 -10/-5/0/+5/+10 中抽取一次积分变化。",
    },
    {
      id: "EV05",
      name: "道具雨",
      category: "item",
      weight: 3,
      duration: 0,
      cooldown: 2,
      scope: "全体",
      description:
        "全体有空位且非负分的小组各抽 1 件合法道具；触发后冷却 2 次成功事件。",
    },
    {
      id: "EV06",
      name: "神秘补给",
      category: "item",
      weight: 4,
      duration: 0,
      scope: "随机 1 组",
      description: "随机 1 个有空位且非负分的小组立即获得 1 件合法道具。",
    },
    {
      id: "EV07",
      name: "稀有补给",
      category: "item",
      weight: 2,
      duration: 0,
      scope: "后半区随机 1 组",
      description:
        "触发时后半区随机 1 个有空位且非负分的小组获得 1 件稀有道具。",
    },
    {
      id: "EV08",
      name: "道具重组",
      category: "item",
      weight: 2,
      duration: 0,
      scope: "有可交换库存者随机 1 组",
      description:
        "随机 1 个持有可交换道具的小组，将其随机 1 件道具替换为另一件合法道具。",
    },
    {
      id: "EV09",
      name: "魔法风暴",
      category: "status",
      weight: 3,
      duration: 0,
      cooldown: 2,
      scope: "随机 2～3 组",
      description:
        "随机 2～3 个小组各自施加 1 个随机负面状态；触发后冷却 2 次成功事件。",
    },
    {
      id: "EV10",
      name: "和平协定",
      category: "status",
      weight: 3,
      duration: 2,
      conflictsWith: ["EV12"],
      scope: "全体",
      description: "未来 2 回合内，暂禁主动攻击类道具（与混乱磁场互斥）。",
    },
    {
      id: "EV11",
      name: "净化之光",
      category: "status",
      weight: 4,
      duration: 0,
      scope: "全体",
      description: "立即清除所有小组身上可净化的负面状态。",
    },
    {
      id: "EV12",
      name: "混乱磁场",
      category: "status",
      weight: 2,
      duration: 2,
      conflictsWith: ["EV10"],
      scope: "全体",
      description:
        "未来 2 回合内，使用定向攻击道具时有 25% 概率随机重选合法目标。",
    },
    {
      id: "EV13",
      name: "后来居上",
      category: "comeback",
      weight: 3,
      duration: 3,
      scope: "触发时后半区",
      description:
        "触发时排名后半区的小组，在未来 3 回合内正向答题基础积分 ×1.5。",
    },
    {
      id: "EV14",
      name: "王者挑战",
      category: "comeback",
      weight: 3,
      duration: 2,
      scope: "触发时非第一名",
      description: "触发时非第一名的小组，在未来 2 回合内答对额外固定 +2 分。",
    },
    {
      id: "EV15",
      name: "追赶之星",
      category: "comeback",
      weight: 3,
      duration: 2,
      scope: "触发时末位 1 组",
      description:
        "触发时末位（并列末位随机选 1 组），在 2 回合内首次答对额外 +10 分，生效后移除。",
    },
    {
      id: "EV16",
      name: "幸运交换",
      category: "special",
      weight: 1,
      duration: 0,
      scope: "随机 2 组持有可交换道具者",
      description: "随机两名各持有可交换道具的小组，各随机选取 1 件自动互换。",
    },
  ]);

  const BY_ID = new Map(CATALOG.map((item) => [item.id, item]));
  const NEGATIVE_STATUSES = Object.freeze([
    "burn",
    "freeze",
    "paralysis",
    "poison",
    "dizziness",
  ]);
  const PERSISTENT_PRIMARY = new Set(["star", "mega", "power"]);
  const ATTACK_EFFECTS = new Set(["fraction", "freeze", "lightning", "kamek"]);
  const DIRECT_TARGET_TYPES = new Set([
    "above",
    "below",
    "leader",
    "randomOther",
    "randomUnfrozen",
  ]);

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function uint32(value, fallback = 0x5a0072f6) {
    const num = Number(value);
    return Number.isFinite(num) ? num >>> 0 : fallback >>> 0;
  }

  function createRng(seed) {
    const cleanSeed = uint32(seed, 0x5a0072f6) || 0x5a0072f6;
    return {
      algorithmVersion: 1,
      seed: cleanSeed,
      state: cleanSeed,
      cursor: 0,
    };
  }

  function normalizeRng(raw) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw))
      return createRng(0x5a0072f6);
    const seed = uint32(raw.seed, 0x5a0072f6) || 0x5a0072f6;
    const state = uint32(raw.state, seed);
    const cursor =
      Number.isSafeInteger(Number(raw.cursor)) && Number(raw.cursor) >= 0
        ? Number(raw.cursor)
        : 0;
    return { algorithmVersion: 1, seed, state, cursor };
  }

  function nextFloat(rng) {
    rng.state = (rng.state + 0x6d2b79f5) >>> 0;
    let t = rng.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    rng.cursor = (Number(rng.cursor) || 0) + 1;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function nextInt(rng, min, max) {
    const lo = Math.trunc(min);
    const hi = Math.trunc(max);
    if (hi <= lo) return lo;
    return lo + Math.floor(nextFloat(rng) * (hi - lo + 1));
  }

  function pickOne(rng, list) {
    if (!Array.isArray(list) || !list.length) return null;
    return list[nextInt(rng, 0, list.length - 1)];
  }

  function pickDistinct(rng, list, count) {
    const pool = [...list];
    const out = [];
    const target = Math.min(Math.max(0, Math.trunc(count)), pool.length);
    for (let i = 0; i < target; i++) {
      const idx = nextInt(rng, 0, pool.length - 1);
      out.push(pool.splice(idx, 1)[0]);
    }
    return out;
  }

  function defaultConfig() {
    return {
      enabled: true,
      minInterval: 4,
      maxInterval: 8,
      disabledIds: [],
      categoryWeights: Object.fromEntries(
        CATEGORIES.map((c) => [c.id, c.weight]),
      ),
      eventWeights: Object.fromEntries(CATALOG.map((e) => [e.id, e.weight])),
      durations: Object.fromEntries(
        CATALOG.filter((e) => e.duration > 0).map((e) => [e.id, e.duration]),
      ),
    };
  }

  function normalizeConfig(raw) {
    const base = defaultConfig();
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return base;
    const minInterval = Number.isSafeInteger(Number(raw.minInterval))
      ? Math.max(1, Math.min(20, Number(raw.minInterval)))
      : base.minInterval;
    const maxRaw = Number.isSafeInteger(Number(raw.maxInterval))
      ? Math.max(1, Math.min(30, Number(raw.maxInterval)))
      : base.maxInterval;
    const maxInterval = Math.max(minInterval, maxRaw);
    const disabledIds = Array.isArray(raw.disabledIds)
      ? [...new Set(raw.disabledIds.filter((id) => BY_ID.has(id)))]
      : [];
    const categoryWeights = { ...base.categoryWeights };
    if (raw.categoryWeights && typeof raw.categoryWeights === "object") {
      for (const c of CATEGORIES) {
        const val = Number(raw.categoryWeights[c.id]);
        if (Number.isFinite(val) && val >= 0)
          categoryWeights[c.id] = Math.min(1000, Math.round(val));
      }
    }
    const eventWeights = { ...base.eventWeights };
    if (raw.eventWeights && typeof raw.eventWeights === "object") {
      for (const e of CATALOG) {
        const val = Number(raw.eventWeights[e.id]);
        if (Number.isFinite(val) && val >= 0)
          eventWeights[e.id] = Math.min(1000, Math.round(val));
      }
    }
    const durations = { ...base.durations };
    if (raw.durations && typeof raw.durations === "object") {
      for (const e of CATALOG) {
        if (e.duration <= 0) continue;
        const val = Number(raw.durations[e.id]);
        if (Number.isSafeInteger(val) && val >= 1 && val <= 10)
          durations[e.id] = val;
      }
    }
    return {
      enabled: raw.enabled !== false,
      minInterval,
      maxInterval,
      disabledIds,
      categoryWeights,
      eventWeights,
      durations,
    };
  }

  function createState({ seed, config } = {}) {
    const cfg = normalizeConfig(config);
    const rng = createRng(seed ?? 0x5a0072f6);
    const roundsUntilNext = nextInt(rng, cfg.minInterval, cfg.maxInterval);
    return {
      schemaVersion: 1,
      rng,
      validRounds: 0,
      roundsUntilNext,
      active: [],
      lastEventId: null,
      cooldowns: {},
      history: [],
      lastResult: null,
    };
  }

  function normalizeActiveEntry(entry) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry))
      return null;
    if (!BY_ID.has(entry.id)) return null;
    const remaining = Number(entry.remaining);
    if (!Number.isSafeInteger(remaining) || remaining <= 0) return null;
    return {
      id: entry.id,
      name: BY_ID.get(entry.id).name,
      category: BY_ID.get(entry.id).category,
      scope: String(entry.scope || BY_ID.get(entry.id).scope),
      description: String(entry.description || BY_ID.get(entry.id).description),
      remaining,
      targetGroupUids: Array.isArray(entry.targetGroupUids)
        ? entry.targetGroupUids.filter((id) => typeof id === "string" && id)
        : null,
      triggeredRound:
        Number.isSafeInteger(Number(entry.triggeredRound)) &&
        Number(entry.triggeredRound) >= 0
          ? Number(entry.triggeredRound)
          : 0,
    };
  }

  function normalizeState(raw, config) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw))
      return createState({ config });
    const cfg = normalizeConfig(config);
    const rng = normalizeRng(raw.rng);
    const validRounds =
      Number.isSafeInteger(Number(raw.validRounds)) &&
      Number(raw.validRounds) >= 0
        ? Number(raw.validRounds)
        : 0;
    const roundsUntilNext =
      Number.isSafeInteger(Number(raw.roundsUntilNext)) &&
      Number(raw.roundsUntilNext) >= 1
        ? Number(raw.roundsUntilNext)
        : nextInt(rng, cfg.minInterval, cfg.maxInterval);
    const active = Array.isArray(raw.active)
      ? raw.active.map(normalizeActiveEntry).filter(Boolean)
      : [];
    const lastEventId = BY_ID.has(raw.lastEventId) ? raw.lastEventId : null;
    const cooldowns = {};
    if (
      raw.cooldowns &&
      typeof raw.cooldowns === "object" &&
      !Array.isArray(raw.cooldowns)
    ) {
      for (const [k, v] of Object.entries(raw.cooldowns)) {
        const n = Number(v);
        if (BY_ID.has(k) && Number.isSafeInteger(n) && n > 0)
          cooldowns[k] = Math.min(20, n);
      }
    }
    const history = Array.isArray(raw.history)
      ? raw.history
          .filter((h) => h && typeof h === "object" && !Array.isArray(h))
          .slice(-50)
          .map((h) => clone(h))
      : [];
    const lastResult =
      raw.lastResult &&
      typeof raw.lastResult === "object" &&
      !Array.isArray(raw.lastResult)
        ? clone(raw.lastResult)
        : null;
    return {
      schemaVersion: 1,
      rng,
      validRounds,
      roundsUntilNext,
      active,
      lastEventId,
      cooldowns,
      history,
      lastResult,
    };
  }

  function groupIdentity(group) {
    return String(group?.groupUid || group?.id || "");
  }

  function sortGroups(groups) {
    return [...(groups || [])].sort((a, b) => {
      const diff = (Number(b?.score) || 0) - (Number(a?.score) || 0);
      if (diff !== 0) return diff;
      return groupIdentity(a).localeCompare(groupIdentity(b));
    });
  }

  function exchangeableIndices(group) {
    const inv = Array.isArray(group?.inventory) ? group.inventory : [];
    const activePersistent =
      inv[0] &&
      PERSISTENT_PRIMARY.has(group?.itemEffect?.type) &&
      group.itemEffect.type === inv[0].key;
    const indices = [];
    for (let i = 0; i < inv.length; i++) {
      if (i === 0 && activePersistent) continue;
      if (inv[i]?.key) indices.push(i);
    }
    return indices;
  }

  function isEligibleGroup(group) {
    return !!group && (Number(group.score) || 0) >= 0;
  }

  function fieldUniquePresent(groups, itemKey, uniqueKeys) {
    if (!uniqueKeys.includes(itemKey)) return false;
    return (groups || []).some((g) =>
      (g.inventory || []).some((it) => it?.key === itemKey),
    );
  }

  function drawableKeysForGroup(group, groups, pool, excludeKeys = []) {
    const held = new Set((group?.inventory || []).map((it) => it?.key));
    const excluded = new Set(excludeKeys);
    const uniqueKeys = pool.uniqueKeys || [
      "lightning",
      "blooper",
      "kamek",
      "item_box",
    ];
    const disabled = new Set(pool.disabledItemKeys || []);
    return (pool.allKeys || []).filter(
      (k) =>
        !disabled.has(k) &&
        !held.has(k) &&
        !excluded.has(k) &&
        !fieldUniquePresent(groups, k, uniqueKeys),
    );
  }

  function defaultItemPool() {
    if (root.ItemDrawPolicy?.keys) {
      const config = root.ItemModules?.configuration?.().items || {};
      const disabledItemKeys = Object.entries(config)
        .filter(([, cfg]) => cfg?.draw?.enabled === false)
        .map(([k]) => k);
      const weights = Object.fromEntries(
        Object.entries(config)
          .map(([k, cfg]) => [k, Number(cfg?.draw?.weight ?? 1)])
          .filter(([, w]) => w > 0),
      );
      return {
        allKeys: [...root.ItemDrawPolicy.keys].filter(
          (k) => (weights[k] ?? 1) > 0,
        ),
        rareKeys: [
          ...new Set([
            ...(root.ItemDrawPolicy.highImpact || []),
            ...(root.ItemDrawPolicy.unique || []),
          ]),
        ],
        uniqueKeys: [...(root.ItemDrawPolicy.unique || [])],
        disabledItemKeys,
        weights,
      };
    }
    return {
      allKeys: Object.keys(root.ITEM_DEFS || {}),
      rareKeys: [...DEFAULT_RARE_ITEMS],
      uniqueKeys: ["lightning", "blooper", "kamek", "item_box"],
      disabledItemKeys: [],
      weights: {},
    };
  }

  function weightedPickFromKeys(rng, keys, weights = {}) {
    if (!keys.length) return null;
    const total = keys.reduce(
      (s, k) => s + Math.max(0.1, Number(weights[k] ?? 1)),
      0,
    );
    if (!(total > 0)) return pickOne(rng, keys);
    let roll = nextFloat(rng) * total;
    for (const k of keys) {
      roll -= Math.max(0.1, Number(weights[k] ?? 1));
      if (roll <= 0) return k;
    }
    return keys[keys.length - 1];
  }

  function hasCleanseableNegativeStatus(group) {
    if (group?.itemEffect?.iceLock) return true;
    const effects = group?.competitionEffects;
    if (!effects || typeof effects !== "object") return false;
    return NEGATIVE_STATUSES.some((k) => Number(effects[k]?.remaining) > 0);
  }

  function hasActiveModifier(evState, id) {
    return (evState?.active || []).some((entry) => entry.id === id);
  }

  function isEventEligible(
    def,
    { groups = [], itemPool = defaultItemPool(), state: evState } = {},
  ) {
    if (!def) return false;
    if (evState) {
      if (def.id === evState.lastEventId) return false;
      if (Number(evState.cooldowns?.[def.id] || 0) > 0) return false;
      if (
        Array.isArray(def.conflictsWith) &&
        def.conflictsWith.some((cid) => hasActiveModifier(evState, cid))
      )
        return false;
    }
    const n = groups.length;
    if (n < 1) return false;
    const sorted = sortGroups(groups);
    switch (def.id) {
      case "EV01":
      case "EV02":
      case "EV03":
      case "EV04":
        return true;
      case "EV05":
      case "EV06":
        return groups.some(
          (g) =>
            isEligibleGroup(g) &&
            (g.inventory?.length || 0) < 3 &&
            drawableKeysForGroup(g, groups, itemPool).length > 0,
        );
      case "EV07": {
        if (n < 2) return false;
        const rareSet = new Set(itemPool.rareKeys || []);
        if (!rareSet.size) return false;
        const rearCount = Math.max(1, Math.ceil(n / 2));
        const rear = sorted.slice(n - rearCount);
        return rear.some(
          (g) =>
            isEligibleGroup(g) &&
            (g.inventory?.length || 0) < 3 &&
            drawableKeysForGroup(g, groups, itemPool).some((k) =>
              rareSet.has(k),
            ),
        );
      }
      case "EV08":
        return groups.some(
          (g) =>
            exchangeableIndices(g).length > 0 &&
            drawableKeysForGroup(g, groups, itemPool).length > 0,
        );
      case "EV09":
        return n >= 2 && typeof root.CompetitionEffects?.apply === "function";
      case "EV10":
        return true;
      case "EV11":
        return groups.some(hasCleanseableNegativeStatus);
      case "EV12":
        return groups.filter(isEligibleGroup).length >= 3;
      case "EV13":
        return n >= 2;
      case "EV14": {
        if (n < 2) return false;
        const maxScore = Math.max(...groups.map((g) => Number(g.score) || 0));
        return groups.some((g) => (Number(g.score) || 0) < maxScore);
      }
      case "EV15":
        return n >= 2;
      case "EV16":
        return (
          groups.filter((g) => exchangeableIndices(g).length > 0).length >= 2
        );
      default:
        return false;
    }
  }

  function applyScoreDelta(group, delta) {
    const before = Number(group.score) || 0;
    const next = Math.trunc(before + delta);
    if (!Number.isSafeInteger(next))
      throw new Error("随机事件积分计算超出安全整数范围");
    group.score = next;
    group.displayScore = next;
    return {
      groupId: group.id,
      groupUid: groupIdentity(group),
      name: group.name,
      before,
      after: next,
      delta: next - before,
    };
  }

  function makeInventoryItem(key) {
    if (root.ItemModules?.inventory) return root.ItemModules.inventory(key);
    const def = root.ITEM_DEFS?.[key];
    return {
      key,
      charges: def?.charges || 1,
      acquiredAt: Date.now(),
      itemInstanceId:
        "rnd-" + key + "-" + Math.random().toString(36).slice(2, 8),
    };
  }

  function executeEvent(def, { evState, groups, rng, config, itemPool }) {
    const sorted = sortGroups(groups);
    const n = groups.length;
    const duration =
      def.duration > 0 ? config.durations[def.id] || def.duration : 0;
    const baseEntry = {
      id: def.id,
      name: def.name,
      category: def.category,
      roundNumber: evState.validRounds,
      scope: def.scope,
      summary: def.description,
      changes: [],
      grantedItems: [],
      statusChanges: [],
    };

    switch (def.id) {
      case "EV01":
      case "EV02":
      case "EV10":
      case "EV12": {
        evState.active.push({
          id: def.id,
          name: def.name,
          category: def.category,
          scope: def.scope,
          description: def.description,
          remaining: duration,
          targetGroupUids: null,
          triggeredRound: evState.validRounds,
        });
        baseEntry.summary = `${def.name}已激活（下回合生效，持续 ${duration} 轮）：${def.description}`;
        break;
      }
      case "EV03": {
        const target = pickOne(rng, groups);
        const amount = nextInt(rng, 5, 15);
        const ch = applyScoreDelta(target, amount);
        baseEntry.changes.push(ch);
        baseEntry.summary = `${target.name} 获得幸运头奖 +${amount} 分`;
        break;
      }
      case "EV04": {
        const target = pickOne(rng, groups);
        const delta = pickOne(rng, [-10, -5, 0, 5, 10]);
        const ch = applyScoreDelta(target, delta);
        baseEntry.changes.push(ch);
        const sign = delta > 0 ? `+${delta}` : String(delta);
        baseEntry.summary = `${target.name} 转动命运轮盘：${sign} 分`;
        break;
      }
      case "EV05": {
        const recipients = [...groups]
          .filter((g) => isEligibleGroup(g) && (g.inventory?.length || 0) < 3)
          .sort((a, b) => groupIdentity(a).localeCompare(groupIdentity(b)));
        const names = [];
        for (const g of recipients) {
          const candidates = drawableKeysForGroup(g, groups, itemPool);
          const key = weightedPickFromKeys(rng, candidates, itemPool.weights);
          if (!key) continue;
          const item = makeInventoryItem(key);
          g.inventory = Array.isArray(g.inventory) ? g.inventory : [];
          g.inventory.push(item);
          baseEntry.grantedItems.push({
            groupUid: groupIdentity(g),
            groupId: g.id,
            itemKey: key,
            itemInstanceId: item.itemInstanceId || null,
          });
          names.push(`${g.name}(${root.ITEM_DEFS?.[key]?.name || key})`);
        }
        baseEntry.summary = names.length
          ? `道具雨降临：${names.join("、")}`
          : "道具雨降临，但无人有空位";
        break;
      }
      case "EV06": {
        const eligible = groups.filter(
          (g) =>
            isEligibleGroup(g) &&
            (g.inventory?.length || 0) < 3 &&
            drawableKeysForGroup(g, groups, itemPool).length > 0,
        );
        const target = pickOne(rng, eligible);
        const candidates = drawableKeysForGroup(target, groups, itemPool);
        const key = weightedPickFromKeys(rng, candidates, itemPool.weights);
        const item = makeInventoryItem(key);
        target.inventory = Array.isArray(target.inventory)
          ? target.inventory
          : [];
        target.inventory.push(item);
        baseEntry.grantedItems.push({
          groupUid: groupIdentity(target),
          groupId: target.id,
          itemKey: key,
          itemInstanceId: item.itemInstanceId || null,
        });
        baseEntry.summary = `${target.name} 获得神秘补给：${root.ITEM_DEFS?.[key]?.name || key}`;
        break;
      }
      case "EV07": {
        const rareSet = new Set(itemPool.rareKeys || []);
        const rearCount = Math.max(1, Math.ceil(n / 2));
        const rear = sorted
          .slice(n - rearCount)
          .filter(
            (g) =>
              isEligibleGroup(g) &&
              (g.inventory?.length || 0) < 3 &&
              drawableKeysForGroup(g, groups, itemPool).some((k) =>
                rareSet.has(k),
              ),
          );
        const target = pickOne(rng, rear);
        const candidates = drawableKeysForGroup(
          target,
          groups,
          itemPool,
        ).filter((k) => rareSet.has(k));
        const key = weightedPickFromKeys(rng, candidates, itemPool.weights);
        const item = makeInventoryItem(key);
        target.inventory = Array.isArray(target.inventory)
          ? target.inventory
          : [];
        target.inventory.push(item);
        baseEntry.grantedItems.push({
          groupUid: groupIdentity(target),
          groupId: target.id,
          itemKey: key,
          itemInstanceId: item.itemInstanceId || null,
        });
        baseEntry.summary = `后半区 ${target.name} 获得稀有补给：${root.ITEM_DEFS?.[key]?.name || key}`;
        break;
      }
      case "EV08": {
        const holders = groups.filter(
          (g) =>
            exchangeableIndices(g).length > 0 &&
            drawableKeysForGroup(g, groups, itemPool).length > 0,
        );
        const target = pickOne(rng, holders);
        const slotIdx = pickOne(rng, exchangeableIndices(target));
        const oldItem = target.inventory[slotIdx];
        const candidates = drawableKeysForGroup(target, groups, itemPool, [
          oldItem.key,
        ]);
        const newKey =
          weightedPickFromKeys(rng, candidates, itemPool.weights) ||
          weightedPickFromKeys(
            rng,
            drawableKeysForGroup(target, groups, itemPool),
            itemPool.weights,
          );
        const newItem = makeInventoryItem(newKey);
        target.inventory.splice(slotIdx, 1, newItem);
        baseEntry.grantedItems.push({
          groupUid: groupIdentity(target),
          groupId: target.id,
          itemKey: newKey,
          itemInstanceId: newItem.itemInstanceId || null,
          replacedKey: oldItem.key,
        });
        baseEntry.summary = `${target.name} 的 ${root.ITEM_DEFS?.[oldItem.key]?.name || oldItem.key} 重组为 ${root.ITEM_DEFS?.[newKey]?.name || newKey}`;
        break;
      }
      case "EV09": {
        const count = n === 2 ? 2 : nextInt(rng, 2, Math.min(3, n));
        const chosen = pickDistinct(rng, groups, count);
        const notes = [];
        for (const g of chosen) {
          const statusKey = pickOne(rng, NEGATIVE_STATUSES);
          const applied = root.CompetitionEffects?.apply(g, statusKey);
          baseEntry.statusChanges.push({
            groupUid: groupIdentity(g),
            groupId: g.id,
            statusKey,
            applied: !!applied,
          });
          const label =
            root.CompetitionEffects?.definitions?.[statusKey]?.name ||
            statusKey;
          notes.push(`${g.name}${applied ? `(${label})` : "(免疫/已有状态)"}`);
        }
        baseEntry.summary = `魔法风暴席卷：${notes.join("、")}`;
        break;
      }
      case "EV11": {
        const cleansedNames = [];
        for (const g of groups) {
          if (!hasCleanseableNegativeStatus(g)) continue;
          if (root.CompetitionEffects?.cleanse)
            root.CompetitionEffects.cleanse(g);
          if (g.itemEffect?.iceLock) {
            delete g.itemEffect.iceLock;
            delete g.itemEffect.iceRoundsLeftV218;
            if (!Object.keys(g.itemEffect).length) g.itemEffect = null;
          }
          baseEntry.statusChanges.push({
            groupUid: groupIdentity(g),
            groupId: g.id,
            cleansed: true,
          });
          cleansedNames.push(g.name);
        }
        baseEntry.summary = cleansedNames.length
          ? `净化之光清除了 ${cleansedNames.join("、")} 的负面状态`
          : "净化之光照耀全场";
        break;
      }
      case "EV13": {
        const rearCount = Math.max(1, Math.ceil(n / 2));
        const rear = sorted.slice(n - rearCount);
        const targetGroupUids = rear.map(groupIdentity);
        evState.active.push({
          id: def.id,
          name: def.name,
          category: def.category,
          scope: `${rear.map((g) => g.name).join("、")}`,
          description: def.description,
          remaining: duration,
          targetGroupUids,
          triggeredRound: evState.validRounds,
        });
        baseEntry.summary = `后来居上激活（${rear.map((g) => g.name).join("、")} 下 ${duration} 回合基础答对×1.5）`;
        break;
      }
      case "EV14": {
        const maxScore = Math.max(...groups.map((g) => Number(g.score) || 0));
        const challengers = groups.filter(
          (g) => (Number(g.score) || 0) < maxScore,
        );
        const targetGroupUids = challengers.map(groupIdentity);
        evState.active.push({
          id: def.id,
          name: def.name,
          category: def.category,
          scope: `${challengers.length} 个追赶组`,
          description: def.description,
          remaining: duration,
          targetGroupUids,
          triggeredRound: evState.validRounds,
        });
        baseEntry.summary = `王者挑战开启（非第一名未来 ${duration} 轮答对固定 +2）`;
        break;
      }
      case "EV15": {
        const minScore = Math.min(...groups.map((g) => Number(g.score) || 0));
        const tiedLast = groups.filter(
          (g) => (Number(g.score) || 0) === minScore,
        );
        const chosen = pickOne(rng, tiedLast);
        const uid = groupIdentity(chosen);
        evState.active.push({
          id: def.id,
          name: def.name,
          category: def.category,
          scope: chosen.name,
          description: def.description,
          remaining: duration,
          targetGroupUids: [uid],
          triggeredRound: evState.validRounds,
        });
        baseEntry.summary = `追赶之星降临 ${chosen.name}（${duration} 轮内首次答对额外 +10）`;
        break;
      }
      case "EV16": {
        const eligible = groups.filter(
          (g) => exchangeableIndices(g).length > 0,
        );
        const [a, b] = pickDistinct(rng, eligible, 2);
        const idxA = pickOne(rng, exchangeableIndices(a));
        const idxB = pickOne(rng, exchangeableIndices(b));
        const itemA = a.inventory[idxA];
        const itemB = b.inventory[idxB];
        a.inventory.splice(idxA, 1, itemB);
        b.inventory.splice(idxB, 1, itemA);
        baseEntry.grantedItems.push(
          {
            groupUid: groupIdentity(a),
            groupId: a.id,
            itemKey: itemB.key,
            itemInstanceId: itemB.itemInstanceId || null,
            swappedOutKey: itemA.key,
          },
          {
            groupUid: groupIdentity(b),
            groupId: b.id,
            itemKey: itemA.key,
            itemInstanceId: itemA.itemInstanceId || null,
            swappedOutKey: itemB.key,
          },
        );
        baseEntry.summary = `幸运交换：${a.name}(${root.ITEM_DEFS?.[itemA.key]?.name || itemA.key}) ⇄ ${b.name}(${root.ITEM_DEFS?.[itemB.key]?.name || itemB.key})`;
        break;
      }
    }
    return baseEntry;
  }

  function advanceRound(evState, groups, config, itemPool = defaultItemPool()) {
    const cfg = normalizeConfig(config);
    const next = normalizeState(evState, cfg);
    const expired = [];

    // 1. Tick previously active modifiers; newly triggered events activate on the NEXT round (CR-03).
    const surviving = [];
    for (const active of next.active) {
      active.remaining -= 1;
      if (active.remaining > 0) surviving.push(active);
      else expired.push(active.id);
    }
    next.active = surviving;

    if (!cfg.enabled) {
      next.lastResult = { triggered: false, reason: "disabled", expired };
      return { state: next, outcome: next.lastResult };
    }

    next.validRounds += 1;
    next.roundsUntilNext -= 1;
    if (next.roundsUntilNext > 0) {
      next.lastResult = {
        triggered: false,
        reason: "countdown",
        roundsUntilNext: next.roundsUntilNext,
        expired,
      };
      return { state: next, outcome: next.lastResult };
    }

    // 2. Countdown reached 0: filter eligible events across categories
    const eligibleByCat = new Map();
    for (const def of CATALOG) {
      if (cfg.disabledIds.includes(def.id)) continue;
      if ((cfg.categoryWeights[def.category] ?? 0) <= 0) continue;
      if ((cfg.eventWeights[def.id] ?? 0) <= 0) continue;
      if (!isEventEligible(def, { groups, itemPool, state: next })) continue;
      if (!eligibleByCat.has(def.category)) eligibleByCat.set(def.category, []);
      eligibleByCat.get(def.category).push(def);
    }

    if (!eligibleByCat.size) {
      const nextCountdown = nextInt(next.rng, cfg.minInterval, cfg.maxInterval);
      next.roundsUntilNext = nextCountdown;
      const entry = {
        id: null,
        name: "无合法随机事件",
        roundNumber: next.validRounds,
        triggered: false,
        reason: "noEligibleEvent",
        roundsUntilNext: nextCountdown,
      };
      next.history = [...next.history.slice(-49), entry];
      next.lastResult = {
        triggered: false,
        reason: "noEligibleEvent",
        roundsUntilNext: nextCountdown,
        expired,
      };
      return { state: next, outcome: next.lastResult };
    }

    // 3. Re-normalize remaining category weights, then draw category -> event
    const activeCats = [...eligibleByCat.keys()];
    const totalCatWeight = activeCats.reduce(
      (sum, c) => sum + Math.max(0, cfg.categoryWeights[c] || 0),
      0,
    );
    let catRoll = nextFloat(next.rng) * totalCatWeight;
    let chosenCategory = activeCats[activeCats.length - 1];
    for (const c of activeCats) {
      catRoll -= Math.max(0, cfg.categoryWeights[c] || 0);
      if (catRoll <= 0) {
        chosenCategory = c;
        break;
      }
    }

    const candidates = eligibleByCat.get(chosenCategory);
    const totalEventWeight = candidates.reduce(
      (sum, def) => sum + Math.max(0, cfg.eventWeights[def.id] || 0),
      0,
    );
    let evRoll = nextFloat(next.rng) * totalEventWeight;
    let chosen = candidates[candidates.length - 1];
    for (const def of candidates) {
      evRoll -= Math.max(0, cfg.eventWeights[def.id] || 0);
      if (evRoll <= 0) {
        chosen = def;
        break;
      }
    }

    // 4. Advance cooldowns before applying new cooldown for EV05 / EV09
    const updatedCooldowns = {};
    for (const [k, v] of Object.entries(next.cooldowns)) {
      if (v > 1) updatedCooldowns[k] = v - 1;
    }
    if (chosen.cooldown > 0) updatedCooldowns[chosen.id] = chosen.cooldown;
    next.cooldowns = updatedCooldowns;
    next.lastEventId = chosen.id;

    // 5. Execute chosen event and schedule next countdown
    const executed = executeEvent(chosen, {
      evState: next,
      groups,
      rng: next.rng,
      config: cfg,
      itemPool,
    });
    const nextCountdown = nextInt(next.rng, cfg.minInterval, cfg.maxInterval);
    next.roundsUntilNext = nextCountdown;
    const historyRecord = {
      ...executed,
      triggered: true,
      roundsUntilNext: nextCountdown,
    };
    next.history = [...next.history.slice(-49), historyRecord];
    next.lastResult = {
      ...historyRecord,
      expired,
    };
    return { state: next, outcome: next.lastResult };
  }

  // Returns answer scoring adjustments for a group given the active events BEFORE this round settles.
  function roundAnswerAdjustment(evState, group, { correct, allIn }) {
    if (!evState?.active?.length || !correct) {
      return { baseMultiplier: 1, flatBonus: 0, consumedStar: false };
    }
    const uid = groupIdentity(group);
    let baseMultiplier = 1;
    let flatBonus = 0;
    let consumedStar = false;

    for (const entry of evState.active) {
      if (
        Array.isArray(entry.targetGroupUids) &&
        !entry.targetGroupUids.includes(uid)
      )
        continue;
      if (entry.id === "EV01" && !allIn) baseMultiplier *= 2;
      if (entry.id === "EV13" && !allIn) baseMultiplier *= 1.5;
      if (entry.id === "EV02") flatBonus += 3;
      if (entry.id === "EV14") flatBonus += 2;
      if (entry.id === "EV15") {
        flatBonus += 10;
        consumedStar = true;
      }
    }
    return { baseMultiplier, flatBonus, consumedStar };
  }

  // Consumes single-use EV15 after the round's answer settlement commits for groups that triggered it.
  function consumeStarTargets(evState, consumedUids) {
    if (!evState?.active?.length || !consumedUids?.length) return evState;
    const used = new Set(consumedUids);
    evState.active = evState.active.filter((entry) => {
      if (entry.id !== "EV15") return true;
      const left = (entry.targetGroupUids || []).filter(
        (uid) => !used.has(uid),
      );
      if (!left.length) return false;
      entry.targetGroupUids = left;
      return true;
    });
    return evState;
  }

  function blocksAttackItem(evState, blueprint) {
    if (!hasActiveModifier(evState, "EV10")) return false;
    return !!blueprint && ATTACK_EFFECTS.has(blueprint.effect);
  }

  function applyChaosMagneticField(
    evState,
    context,
    eligibleFn = isEligibleGroup,
  ) {
    if (!hasActiveModifier(evState, "EV12")) return null;
    if (!context?.blueprint) return null;
    if (!DIRECT_TARGET_TYPES.has(context.blueprint.target)) return null;
    if (!ATTACK_EFFECTS.has(context.blueprint.effect)) return null;
    const pool = (context.groups || context.ranking || []).filter(
      (g) => g.id !== context.group?.id && eligibleFn(g),
    );
    if (pool.length < 2) return null;
    const roll = nextFloat(evState.rng);
    if (roll >= 0.25) return null;
    const currentId = context.targets?.[0]?.id;
    const alternatives = pool.filter((g) => g.id !== currentId);
    if (!alternatives.length) return null;
    const picked = pickOne(evState.rng, alternatives);
    return picked ? [picked] : null;
  }

  root.RandomEvents = Object.freeze({
    CATEGORIES,
    CATALOG,
    get: (id) => BY_ID.get(id) || null,
    createRng,
    normalizeRng,
    nextFloat,
    nextInt,
    defaultConfig,
    normalizeConfig,
    createState,
    normalizeState,
    isEventEligible,
    advanceRound,
    roundAnswerAdjustment,
    consumeStarTargets,
    blocksAttackItem,
    applyChaosMagneticField,
  });
})(globalThis);
