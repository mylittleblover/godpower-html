/* Competition achievements reduced strictly from confirmed formal round/item facts. */
const CompetitionAchievementRules = (() => {
  const SEASON_THRESHOLDS = [
    ["ACH-013", (p) => p.competitionStats.positiveGainSeason >= 10],
    ["ACH-020", (p) => p.competitionStats.allInStreakSeason >= 3],
  ];
  const PERMANENT_THRESHOLDS = [
    ["ACH-014", (p) => p.competitionStats.positiveGainLifetime >= 100],
    ["ACH-016", (p) => p.competitionStats.top3In5PlusLifetime >= 10],
  ];

  function unlockPermanent(progress, id, occurredAt, unlocked) {
    if (progress.permanentUnlocks[id]) return;
    progress.permanentUnlocks[id] = { unlockedAt: occurredAt };
    unlocked.push({ achievementId: id, layer: "permanent" });
  }

  function unlockSeason(progress, id, seasonId, occurredAt, unlocked) {
    if (progress.seasonUnlocks[id]) return;
    progress.seasonUnlocks[id] = {
      status: "pending-archive",
      seasonId: seasonId || progress.seasonId || null,
      unlockedAt: occurredAt,
    };
    unlocked.push({ achievementId: id, layer: "season" });
  }

  function addPositiveGain(progress, delta) {
    if (!Number.isSafeInteger(delta) || delta <= 0) return;
    progress.competitionStats.positiveGainSeason += delta;
    progress.competitionStats.positiveGainLifetime += delta;
  }

  function checkThresholds(progress, seasonId, occurredAt, unlocked) {
    for (const [id, condition] of PERMANENT_THRESHOLDS) {
      if (condition(progress))
        unlockPermanent(progress, id, occurredAt, unlocked);
    }
    for (const [id, condition] of SEASON_THRESHOLDS) {
      if (condition(progress))
        unlockSeason(progress, id, seasonId, occurredAt, unlocked);
    }
  }

  function evaluateRound(progress, event, unlocked) {
    const facts = event.payload;
    if (
      !facts ||
      typeof facts.answered !== "boolean" ||
      typeof facts.correct !== "boolean"
    )
      return;

    const comp = progress.competitionStats;
    const before = Number(facts.scoreBefore);
    const after = Number(facts.scoreAfter);
    const hasScores =
      Number.isSafeInteger(before) && Number.isSafeInteger(after);
    if (hasScores && after > before) addPositiveGain(progress, after - before);

    const doubledAllIn =
      facts.allIn === true &&
      facts.answered &&
      facts.correct &&
      hasScores &&
      before > 0 &&
      after > before;
    if (doubledAllIn) {
      comp.allInStreakSeason++;
      unlockPermanent(progress, "ACH-019", event.occurredAt, unlocked);
      if (after - before >= 20)
        unlockPermanent(progress, "ACH-022", event.occurredAt, unlocked);
    } else {
      comp.allInStreakSeason = 0;
    }

    const groupCount = Number(facts.groupCount);
    const rankAfter = Number(facts.rankAfter);
    const rankBefore = Number(facts.rankBefore);
    if (Number.isSafeInteger(groupCount) && Number.isSafeInteger(rankAfter)) {
      if (groupCount >= 4 && rankAfter === 1)
        unlockPermanent(progress, "ACH-015", event.occurredAt, unlocked);
      if (groupCount >= 5 && facts.answered && rankAfter >= 1 && rankAfter <= 3)
        comp.top3In5PlusLifetime++;
      if (
        groupCount >= 5 &&
        Number.isSafeInteger(rankBefore) &&
        rankBefore - rankAfter >= 3
      )
        unlockPermanent(progress, "ACH-017", event.occurredAt, unlocked);
      if (groupCount >= 5 && comp.wasLastInSeason && rankAfter <= 3)
        unlockSeason(
          progress,
          "ACH-018",
          facts.seasonId,
          event.occurredAt,
          unlocked,
        );
      if (groupCount >= 5 && facts.isLastInSeason === true)
        comp.wasLastInSeason = true;
      const leaderBefore = Number(facts.leaderScoreBefore);
      if (
        groupCount >= 4 &&
        Number.isSafeInteger(leaderBefore) &&
        Number.isSafeInteger(before) &&
        leaderBefore - before >= 10 &&
        rankAfter === 1
      )
        unlockPermanent(progress, "ACH-021", event.occurredAt, unlocked);
    }

    checkThresholds(progress, facts.seasonId, event.occurredAt, unlocked);
  }

  function evaluate(progress, event) {
    if (!event || !progress?.competitionStats) return [];
    const unlocked = [];
    const payload = event.payload || {};
    if (event.type === "ROUND_SETTLED") {
      evaluateRound(progress, event, unlocked);
      return unlocked;
    }
    if (event.type === "ITEM_USED") {
      addPositiveGain(progress, Number(payload.casterDelta));
      checkThresholds(progress, payload.seasonId, event.occurredAt, unlocked);
      return unlocked;
    }
    if (event.type === "SCORE_CHANGED" && payload.origin === "item-boost") {
      addPositiveGain(progress, Number(payload.delta));
      checkThresholds(progress, payload.seasonId, event.occurredAt, unlocked);
      return unlocked;
    }
    return unlocked;
  }

  return { evaluate };
})();
