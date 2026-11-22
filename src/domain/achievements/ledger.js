/* Durable per-group progress receipts; rule evaluation stays in later stages. */
const AchievementLedger = (() => {
  const SCHEMA_VERSION = 1;
  const clone = (value) => DomainValues.cloneJson(value);

  function empty() {
    return { schemaVersion: SCHEMA_VERSION, groups: {} };
  }

  function normalize(value) {
    if (value == null) return empty();
    if (
      typeof value !== "object" ||
      Array.isArray(value) ||
      value.schemaVersion !== SCHEMA_VERSION ||
      !value.groups ||
      typeof value.groups !== "object" ||
      Array.isArray(value.groups)
    )
      throw new TypeError("achievement ledger format is invalid");
    const ledger = clone(value);
    for (const [uid, progress] of Object.entries(ledger.groups)) {
      if (!StableIdentity.isValidGroupUid(uid))
        throw new TypeError("achievement group identity is invalid");
      if (
        !progress ||
        typeof progress !== "object" ||
        Array.isArray(progress) ||
        !progress.historicalCounters ||
        typeof progress.historicalCounters !== "object" ||
        !progress.seasonCounters ||
        typeof progress.seasonCounters !== "object" ||
        !Array.isArray(progress.processedEvents)
      )
        throw new TypeError("achievement progress format is invalid");
      for (const bucket of [
        "permanentUnlocks",
        "historicalCounters",
        "seasonCounters",
        "seasonUnlocks",
      ]) {
        if (!progress[bucket]) progress[bucket] = {};
        if (
          typeof progress[bucket] !== "object" ||
          Array.isArray(progress[bucket])
        )
          throw new TypeError("achievement bucket format is invalid");
      }
      for (const counters of [
        progress.historicalCounters,
        progress.seasonCounters,
      ])
        if (
          Object.values(counters).some(
            (count) => !Number.isSafeInteger(count) || count < 0,
          )
        )
          throw new TypeError("achievement counter is invalid");
      if (progress.seasonProgress == null)
        progress.seasonProgress = emptySeasonProgress();
      if (
        typeof progress.seasonProgress !== "object" ||
        Array.isArray(progress.seasonProgress) ||
        Object.entries(progress.seasonProgress).some(
          ([key, count]) =>
            key !== "recoveryReady" &&
            (!Number.isSafeInteger(count) || count < 0),
        ) ||
        typeof progress.seasonProgress.recoveryReady !== "boolean"
      )
        throw new TypeError("achievement seasonal progress is invalid");
      if (!Array.isArray(progress.itemDiscovery)) progress.itemDiscovery = [];
      if (!Array.isArray(progress.itemMastery)) progress.itemMastery = [];
      if (progress.processedEvents.some((id) => typeof id !== "string" || !id))
        throw new TypeError("achievement event receipt is invalid");
      progress.archivedUnlocks = normalizeArchivedUnlocks(
        progress.archivedUnlocks,
      );
      progress.competitionStats = normalizeCompetitionStats(
        progress.competitionStats,
      );
      progress.itemProgress = normalizeItemProgress(progress.itemProgress);
      progress.honorStats = normalizeHonorStats(progress.honorStats);
    }
    return ledger;
  }

  function assertPlainObject(value, label) {
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw new TypeError(label);
  }

  function assertNonNegInt(value, label) {
    if (!Number.isSafeInteger(value) || value < 0) throw new TypeError(label);
  }

  function normalizeArchivedUnlocks(raw) {
    if (raw == null) return {};
    assertPlainObject(raw, "achievement archived unlocks format is invalid");
    return raw;
  }

  function emptyCompetitionStats() {
    return {
      positiveGainLifetime: 0,
      top3In5PlusLifetime: 0,
      positiveGainSeason: 0,
      allInStreakSeason: 0,
      wasLastInSeason: false,
    };
  }

  function normalizeCompetitionStats(raw) {
    if (raw == null) return emptyCompetitionStats();
    assertPlainObject(raw, "achievement competition stats are invalid");
    const out = { ...emptyCompetitionStats(), ...raw };
    for (const k of [
      "positiveGainLifetime",
      "top3In5PlusLifetime",
      "positiveGainSeason",
      "allInStreakSeason",
    ])
      assertNonNegInt(out[k], "achievement competition counter is invalid");
    if (typeof out.wasLastInSeason !== "boolean")
      throw new TypeError("achievement seasonal rank flag is invalid");
    return out;
  }

  function emptyItemProgress() {
    return {
      formalAcquires: 0,
      byInstance: {},
      defensesByActivation: {},
    };
  }

  function normalizeItemProgress(raw) {
    if (raw == null) return emptyItemProgress();
    assertPlainObject(raw, "achievement item progress is invalid");
    const out = { ...emptyItemProgress(), ...raw };
    assertNonNegInt(out.formalAcquires, "achievement acquire count is invalid");
    assertPlainObject(out.byInstance, "achievement item instances are invalid");
    assertPlainObject(
      out.defensesByActivation,
      "achievement defense progress is invalid",
    );
    return out;
  }

  function emptyHonorStats() {
    return {
      seasonsCompleted: 0,
      championCount: 0,
      runnerUpCount: 0,
      top3Count: 0,
    };
  }

  function normalizeHonorStats(raw) {
    if (raw == null) return emptyHonorStats();
    assertPlainObject(raw, "achievement honor stats are invalid");
    const out = { ...emptyHonorStats(), ...raw };
    for (const k of Object.keys(emptyHonorStats()))
      assertNonNegInt(out[k], "achievement honor counter is invalid");
    return out;
  }

  function newGroupProgress(seasonId) {
    return {
      seasonId: seasonId || null,
      permanentUnlocks: {},
      archivedUnlocks: {},
      historicalCounters: {},
      seasonCounters: {},
      seasonUnlocks: {},
      seasonProgress: emptySeasonProgress(),
      competitionStats: emptyCompetitionStats(),
      itemProgress: emptyItemProgress(),
      honorStats: emptyHonorStats(),
      itemDiscovery: [],
      itemMastery: [],
      processedEvents: [],
    };
  }

  function emptySeasonProgress() {
    return {
      answered: 0,
      correct: 0,
      correctStreak: 0,
      answeredStreak: 0,
      recoveryRemaining: 0,
      recoveryReady: false,
    };
  }

  function apply(value, events, { seasonId = null } = {}) {
    const ledger = normalize(value);
    const seenInBatch = new Set();
    const processedByGroup = new Map();
    const discoveryByGroup = new Map();
    const unlocked = [];
    let applied = 0;
    let duplicates = 0;
    for (const event of Array.isArray(events) ? events : []) {
      if (!DomainEvents.isAchievementEligible(event)) continue;
      if (
        event.aggregate?.type !== "group" ||
        !StableIdentity.isValidGroupUid(event.aggregate.id) ||
        typeof event.eventId !== "string" ||
        !event.eventId
      )
        continue;
      const uid = event.aggregate.id;
      const progress =
        ledger.groups[uid] || (ledger.groups[uid] = newGroupProgress(seasonId));
      let processedSet = processedByGroup.get(uid);
      if (!processedSet) {
        processedSet = new Set(progress.processedEvents);
        processedByGroup.set(uid, processedSet);
      }
      if (seenInBatch.has(event.eventId) || processedSet.has(event.eventId)) {
        duplicates++;
        continue;
      }
      seenInBatch.add(event.eventId);
      const eventSeason = StableIdentity.isValidSeasonId(
        event.payload?.seasonId,
      )
        ? event.payload.seasonId
        : seasonId;
      if (eventSeason && progress.seasonId !== eventSeason) {
        progress.seasonId = eventSeason;
        progress.seasonCounters = {};
        progress.seasonUnlocks = {};
        progress.seasonProgress = emptySeasonProgress();
        progress.competitionStats.positiveGainSeason = 0;
        progress.competitionStats.allInStreakSeason = 0;
        progress.competitionStats.wasLastInSeason = false;
      }
      progress.historicalCounters[event.type] =
        (progress.historicalCounters[event.type] || 0) + 1;
      progress.seasonCounters[event.type] =
        (progress.seasonCounters[event.type] || 0) + 1;
      if (
        event.type === "ITEM_ACQUIRED" &&
        typeof event.payload?.itemKey === "string"
      ) {
        let discoverySet = discoveryByGroup.get(uid);
        if (!discoverySet) {
          discoverySet = new Set(progress.itemDiscovery);
          discoveryByGroup.set(uid, discoverySet);
        }
        if (!discoverySet.has(event.payload.itemKey)) {
          discoverySet.add(event.payload.itemKey);
          progress.itemDiscovery.push(event.payload.itemKey);
        }
      }
      const groupUnlocks = [];
      const seenUnlocked = new Set();
      const pushUnlock = (entry) => {
        const achievementId =
          typeof entry === "string" ? entry : entry?.achievementId;
        if (!achievementId || seenUnlocked.has(achievementId)) return;
        seenUnlocked.add(achievementId);
        const layer =
          typeof entry === "object" && entry?.layer
            ? entry.layer
            : progress.permanentUnlocks[achievementId]
              ? "permanent"
              : "season";
        groupUnlocks.push({ groupUid: uid, achievementId, layer });
      };
      if (typeof LearningAchievementRules !== "undefined")
        LearningAchievementRules.evaluate(progress, event).forEach(pushUnlock);
      if (typeof CompetitionAchievementRules !== "undefined")
        CompetitionAchievementRules.evaluate(progress, event).forEach(
          pushUnlock,
        );
      if (typeof CollectionAchievementRules !== "undefined")
        CollectionAchievementRules.evaluate(progress, event).forEach(
          pushUnlock,
        );
      if (typeof HonorAchievementRules !== "undefined")
        HonorAchievementRules.evaluate(progress, event).forEach(pushUnlock);
      processedSet.add(event.eventId);
      progress.processedEvents.push(event.eventId);
      applied++;
      unlocked.push(...groupUnlocks);
    }
    return { ledger, applied, duplicates, unlocked };
  }

  return { schemaVersion: SCHEMA_VERSION, empty, normalize, apply };
})();
