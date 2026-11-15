/* Pure schema / storage primitives. No DOM, no remote dependencies. */
const Reliability = (() => {
  const schemaVersion = 2;
  const stateKey = "godpower_state_v2";
  const legacyStateKey = "godpower_state_v1";
  function validateBackup(data, depth = 0) {
    if (!data || typeof data !== "object" || Array.isArray(data))
      throw Error("备份必须是 JSON 对象");
    if (depth > 1) throw Error("历史嵌套层级过深");
    if (
      data.schemaVersion != null &&
      ![1, schemaVersion].includes(data.schemaVersion)
    )
      throw Error("不支持此存档版本");
    if (
      data.schemaVersion === schemaVersion &&
      !StableIdentity.isValidSeasonId(data.seasonId)
    )
      throw Error("赛季身份无效");
    if (data.achievementLedger != null)
      AchievementLedger.normalize(data.achievementLedger);
    if (
      !Array.isArray(data.groups) ||
      !data.groups.length ||
      data.groups.length > 1000
    )
      throw Error("小组数据为空或超过 1000 组");
    const groupUids = new Set();
    data.groups.forEach((g) => {
      if (!g || typeof g !== "object" || Array.isArray(g))
        throw Error("小组格式无效");
      if (data.schemaVersion === schemaVersion) {
        if (
          !StableIdentity.isValidGroupUid(g.groupUid) ||
          groupUids.has(g.groupUid)
        )
          throw Error("小组身份无效或重复");
        groupUids.add(g.groupUid);
      }
      if (!Number.isSafeInteger(Number(g.score ?? 0)))
        throw Error("分数必须是安全整数");
      if (
        g.members != null &&
        (!Array.isArray(g.members) ||
          g.members.some((m) => typeof m !== "string"))
      )
        throw Error("成员格式无效");
      if (
        g.inventory != null &&
        (!Array.isArray(g.inventory) || g.inventory.length > 3)
      )
        throw Error("道具队列格式无效");
      if (
        g.inventory?.some(
          (it) => !it || typeof it !== "object" || Array.isArray(it),
        )
      )
        throw Error("道具格式无效");
      if (
        g.itemEffect != null &&
        (typeof g.itemEffect !== "object" || Array.isArray(g.itemEffect))
      )
        throw Error("持续状态格式无效");
      if (g.competitionEffects != null) {
        if (
          typeof g.competitionEffects !== "object" ||
          Array.isArray(g.competitionEffects)
        )
          throw Error("竞技状态格式无效");
        for (const effect of Object.values(g.competitionEffects))
          if (
            !effect ||
            !Number.isSafeInteger(effect.remaining) ||
            effect.remaining < 1 ||
            effect.remaining > 999
          )
            throw Error("竞技状态次数无效");
      }
    });
    if (data.picker != null) {
      if (typeof data.picker !== "object" || Array.isArray(data.picker))
        throw Error("点名数据格式无效");
      if (
        data.picker.mode != null &&
        !["individual", "group", "two_tier", ""].includes(data.picker.mode)
      )
        throw Error("点名模式无效");
      if (
        data.picker.antiRepeat != null &&
        typeof data.picker.antiRepeat !== "boolean"
      )
        throw Error("防重复设置无效");
      for (const key of [
        "pickedStudentKeys",
        "pickedGroupIds",
        "preselectedGroupIds",
      ]) {
        const values = data.picker[key];
        if (
          values != null &&
          (!Array.isArray(values) ||
            values.length > 10000 ||
            values.some(
              (value) =>
                !["string", "number"].includes(typeof value) ||
                (typeof value === "number" && !Number.isSafeInteger(value)) ||
                (typeof value === "string" && value.length > 500),
            ))
        )
          throw Error("点名候选记录无效");
      }
    }
    if (data.itemGlobal != null) {
      const global = data.itemGlobal;
      if (typeof global !== "object" || Array.isArray(global))
        throw Error("全局道具数据格式无效");
      for (const key of [
        "blooperUntil",
        "totalDraws",
        "handRaiseTotal",
        "pkTotal",
      ])
        if (
          global[key] != null &&
          (!Number.isSafeInteger(Number(global[key])) ||
            Number(global[key]) < 0)
        )
          throw Error("全局计数格式无效");
      for (const key of ["pickerHistory", "handRaiseHistory"]) {
        const records = global[key];
        if (
          records != null &&
          (!Array.isArray(records) || records.length > 10000)
        )
          throw Error("课堂工具历史格式无效");
        for (const record of records || []) {
          if (
            !record ||
            typeof record !== "object" ||
            Array.isArray(record) ||
            !Number.isSafeInteger(Number(record.time)) ||
            Number(record.time) < 0
          )
            throw Error("课堂工具历史节点无效");
          if (
            key === "pickerHistory" &&
            (typeof record.text !== "string" || record.text.length > 2000)
          )
            throw Error("点名历史内容无效");
          if (
            key === "handRaiseHistory" &&
            (!Number.isSafeInteger(Number(record.groupId)) ||
              typeof record.correct !== "boolean")
          )
            throw Error("举手历史内容无效");
        }
      }
      for (const [key, sequenceKey, eligibleKey] of [
        ["drawThrottleV2179", "sequence", "nextEligible"],
        ["drawSessionThrottleV21710", "sessionNo", "nextEligibleSession"],
      ]) {
        const throttle = global[key];
        if (throttle == null) continue;
        if (typeof throttle !== "object" || Array.isArray(throttle))
          throw Error("道具冷却数据无效");
        if (
          throttle[sequenceKey] != null &&
          (!Number.isSafeInteger(Number(throttle[sequenceKey])) ||
            Number(throttle[sequenceKey]) < 0)
        )
          throw Error("道具冷却序号无效");
        const eligible = throttle[eligibleKey];
        if (
          eligible != null &&
          (typeof eligible !== "object" ||
            Array.isArray(eligible) ||
            Object.values(eligible).some(
              (value) =>
                !Number.isSafeInteger(Number(value)) || Number(value) < 0,
            ))
        )
          throw Error("道具可用序号无效");
        if (
          key === "drawThrottleV2179" &&
          throttle.groupStrongSkip != null &&
          (typeof throttle.groupStrongSkip !== "object" ||
            Array.isArray(throttle.groupStrongSkip) ||
            Object.values(throttle.groupStrongSkip).some(
              (value) =>
                !Number.isSafeInteger(Number(value)) || Number(value) < 0,
            ))
        )
          throw Error("小组道具冷却数据无效");
        if (
          key === "drawSessionThrottleV21710" &&
          throttle.activeDrawSession != null
        ) {
          const session = throttle.activeDrawSession;
          if (
            !session ||
            typeof session !== "object" ||
            Array.isArray(session) ||
            !Number.isSafeInteger(Number(session.no)) ||
            Number(session.no) < 0 ||
            typeof session.kind !== "string" ||
            session.kind.length > 100
          )
            throw Error("道具抽取会话无效");
        }
      }
    }
    if (data.randomEvents != null) {
      if (
        typeof data.randomEvents !== "object" ||
        Array.isArray(data.randomEvents)
      )
        throw Error("随机事件状态格式无效");
    }
    if (data.history != null) {
      if (!Array.isArray(data.history) || data.history.length > 40)
        throw Error("历史格式无效");
      for (const h of data.history) {
        if (!h || typeof h !== "object") throw Error("历史节点格式无效");
        validateBackup(
          {
            groups: h.groups,
            picker: h.picker,
            itemGlobal: h.itemGlobal,
            achievementLedger: h.achievementLedger,
          },
          depth + 1,
        );
      }
    }
    return data;
  }
  const writeVerified = ClassroomRepository.writeVerified;
  const appendArchive = ClassroomRepository.appendArchive;
  function phase(s) {
    return CompetitionPhase.derive(s);
  }
  function validateItem(s, g, index, enabled) {
    if (!enabled) return "共产主义模式已关闭";
    if (!g || !g.inventory?.[index]) return "没有可用道具";
    if (index !== 0) return "次要道具需要等待主要道具";
    if (Number(g.score) < 0) return "负分保护：该组不能使用道具";
    const key = g.inventory[index].key;
    const continuation = ItemRoundUse.canContinue(g, g.inventory[index]);
    if (s.roundActive && !s.evaluated && g.itemUsedThisRound && !continuation)
      return "本题已经使用过道具";
    if (
      ["star", "mega", "power"].includes(g.itemEffect?.type) &&
      g.itemEffect.type === key
    )
      return "主要道具持续状态尚未结束";
    return null;
  }
  // Stale asynchronous defense dialogs must never modify a different round or item.
  let defenseDecisionEpoch = 0;
  const defenseInvalidationHandlers = new Set();
  function onDefenseInvalidation(handler) {
    if (typeof handler !== "function")
      throw new TypeError("Defense invalidation requires a function");
    defenseInvalidationHandlers.add(handler);
    return () => defenseInvalidationHandlers.delete(handler);
  }
  function invalidateDefenseDecisions() {
    ++defenseDecisionEpoch;
    // A visual subscriber must never replace command cancellation. Snapshot the
    // listeners so subscriptions added during notification start next time.
    for (const handler of [...defenseInvalidationHandlers]) handler();
    return defenseDecisionEpoch;
  }
  function captureDefenseDecision(s, target, key) {
    const item = target?.inventory?.[0];
    if (
      !s ||
      !Array.isArray(s.groups) ||
      !s.groups.includes(target) ||
      !item ||
      item.key !== key
    )
      return null;
    return {
      epoch: defenseDecisionEpoch,
      state: s,
      groups: s.groups,
      target,
      targetId: target.id,
      item,
      key,
      phase: phase(s),
      round: s.round,
      roundActive: s.roundActive,
      evaluated: s.evaluated,
      hasStartedOnce: s.hasStartedOnce,
      correctAns: s.correctAns,
      settlements: s.itemGlobal?.pkTotal,
    };
  }
  function isDefenseDecisionCurrent(s, d) {
    if (
      !s ||
      !d ||
      d.epoch !== defenseDecisionEpoch ||
      s !== d.state ||
      s.groups !== d.groups ||
      !Array.isArray(s.groups) ||
      s.groups.find((g) => g.id === d.targetId) !== d.target ||
      d.target.inventory?.[0] !== d.item ||
      d.item.key !== d.key ||
      phase(s) !== d.phase
    )
      return false;
    return (
      Object.is(s.round, d.round) &&
      s.roundActive === d.roundActive &&
      s.evaluated === d.evaluated &&
      s.hasStartedOnce === d.hasStartedOnce &&
      s.correctAns === d.correctAns &&
      s.itemGlobal?.pkTotal === d.settlements
    );
  }

  function planBatchScoreChanges(groups, groupCounts, points) {
    if (!Number.isSafeInteger(points) || points === 0)
      throw Error("分值必须为非零安全整数");
    if (!Array.isArray(groups) || !Array.isArray(groupCounts))
      throw Error("小组列表无效");
    const groupMap = new Map(groups.map((g) => [g.id, g]));
    return groupCounts.map(([id, count]) => {
      const g = groupMap.get(id);
      if (!g || !Number.isSafeInteger(count) || count < 1)
        throw Error("批量计分对象无效");
      const old = Number(g.score),
        delta = points * count,
        score = old + delta;
      if (
        !Number.isSafeInteger(old) ||
        !Number.isSafeInteger(delta) ||
        !Number.isSafeInteger(score)
      )
        throw Error("批量计分超出安全整数范围");
      return { id, old, delta, score };
    });
  }
  function safeImage(value) {
    return typeof value === "string" &&
      /^data:image\/(?:png|jpe?g|webp|gif);base64,[a-zA-Z0-9+/=\s]+$/.test(
        value,
      )
      ? value
      : "";
  }
  function count(value) {
    const n = Number(value);
    return Number.isSafeInteger(n) && n >= 0 ? n : 0;
  }
  function normalizeStats(raw) {
    return Object.fromEntries(
      ["correct", "wrong", "draws", "used"].map((k) => [k, count(raw?.[k])]),
    );
  }
  function normalizeEffect(raw) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
    const out = {};
    if (["star", "mega", "power", "bullet"].includes(raw.type))
      out.type = raw.type;
    for (const k of [
      "hitsLeft",
      "roundsLeft",
      "startedAt",
      "targetId",
      "featherDodge",
      "iceLock",
      "iceRoundsLeftV218",
    ])
      if (Object.hasOwn(raw, k)) out[k] = count(raw[k]);
    return Object.keys(out).length ? out : null;
  }
  function calculateRoundScores(s) {
    return CompetitionRules.calculateRound(s).map(
      (result) => result.scoreAfter,
    );
  }
  function csvText(text) {
    text = String(text);
    return /^[\s]*[=+@-]/.test(text) ? "'" + text : text;
  }
  return {
    schemaVersion,
    stateKey,
    legacyStateKey,
    validateBackup,
    writeVerified,
    appendArchive,
    phase,
    validateItem,
    safeImage,
    csvText,
    count,
    normalizeStats,
    normalizeEffect,
    calculateRoundScores,
    invalidateDefenseDecisions,
    captureDefenseDecision,
    isDefenseDecisionCurrent,
    onDefenseInvalidation,
    planBatchScoreChanges,
  };
})();

// Resolve the browser storage getter inside operations so access denial is
// reported by the same verified-write failure path as quota errors.
const CLASSROOM_STORAGE = {
  getItem(key) {
    return localStorage.getItem(key);
  },
  setItem(key, value) {
    localStorage.setItem(key, value);
  },
  removeItem(key) {
    localStorage.removeItem(key);
  },
};
