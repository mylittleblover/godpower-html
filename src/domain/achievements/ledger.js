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
    }
    return ledger;
  }

  function newGroupProgress(seasonId) {
    return {
      seasonId: seasonId || null,
      permanentUnlocks: {},
      historicalCounters: {},
      seasonCounters: {},
      seasonUnlocks: {},
      seasonProgress: emptySeasonProgress(),
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
      if (
        seenInBatch.has(event.eventId) ||
        progress.processedEvents.includes(event.eventId)
      ) {
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
      }
      progress.historicalCounters[event.type] =
        (progress.historicalCounters[event.type] || 0) + 1;
      progress.seasonCounters[event.type] =
        (progress.seasonCounters[event.type] || 0) + 1;
      if (
        event.type === "ITEM_ACQUIRED" &&
        typeof event.payload?.itemKey === "string" &&
        !progress.itemDiscovery.includes(event.payload.itemKey)
      )
        progress.itemDiscovery.push(event.payload.itemKey);
      const groupUnlocks = LearningAchievementRules.evaluate(progress, event);
      progress.processedEvents.push(event.eventId);
      applied++;
      unlocked.push(
        ...groupUnlocks.map((achievementId) => ({
          groupUid: uid,
          achievementId,
        })),
      );
    }
    return { ledger, applied, duplicates, unlocked };
  }

  return { schemaVersion: SCHEMA_VERSION, empty, normalize, apply };
})();
