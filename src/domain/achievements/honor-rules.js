/* Season-archive honor achievements reduced from effective SEASON_ARCHIVED facts. */
const HonorAchievementRules = (() => {
  const THRESHOLDS = [
    ["ACH-045", (h) => h.championCount >= 1],
    ["ACH-046", (h) => h.championCount >= 3],
    ["ACH-047", (h) => h.championCount >= 10],
    ["ACH-048", (h) => h.runnerUpCount >= 1],
    ["ACH-049", (h) => h.top3Count >= 5],
    ["ACH-050", (h) => h.seasonsCompleted >= 5],
  ];

  function unlockPermanent(progress, id, occurredAt, unlocked) {
    if (progress.permanentUnlocks[id]) return;
    progress.permanentUnlocks[id] = { unlockedAt: occurredAt };
    unlocked.push({ achievementId: id, layer: "permanent" });
  }

  function evaluate(progress, event) {
    if (event?.type !== "SEASON_ARCHIVED") return [];
    const facts = event.payload || {};
    if (facts.effectiveSeason !== true) return [];

    const honors = progress.honorStats;
    const rank = Number(facts.rank);
    const groupCount = Number(facts.groupCount) || 0;
    if (!Number.isSafeInteger(rank) || rank < 1 || groupCount < 2) return [];

    honors.seasonsCompleted++;
    if (rank === 1) honors.championCount++;
    if (rank === 2) honors.runnerUpCount++;
    if (rank <= 3) honors.top3Count++;

    const unlocked = [];
    for (const [id, condition] of THRESHOLDS) {
      if (condition(honors))
        unlockPermanent(progress, id, event.occurredAt, unlocked);
    }

    const answered = Number.isSafeInteger(facts.answered)
      ? facts.answered
      : progress.seasonProgress.answered;
    const correct = Number.isSafeInteger(facts.correct)
      ? facts.correct
      : progress.seasonProgress.correct;
    const marginOverSecond = Number(facts.marginOverSecond) || 0;
    const roundsCompleted = Number(facts.roundsCompleted) || 0;

    if (rank === 1 && answered >= 10 && correct / answered >= 0.8)
      unlockPermanent(progress, "ACH-051", event.occurredAt, unlocked);

    if (rank === 1 && marginOverSecond >= 10 && roundsCompleted >= 10)
      unlockPermanent(progress, "ACH-052", event.occurredAt, unlocked);

    const seasonId = facts.seasonId || progress.seasonId || null;
    for (const [id, entry] of Object.entries(progress.seasonUnlocks || {})) {
      if (!entry || typeof entry !== "object") continue;
      entry.status = "archived";
      const prev = progress.archivedUnlocks[id];
      progress.archivedUnlocks[id] = {
        count: (prev?.count || 0) + 1,
        firstUnlockedAt:
          prev?.firstUnlockedAt || entry.unlockedAt || event.occurredAt,
        lastSeasonId: seasonId || prev?.lastSeasonId || null,
      };
    }

    return unlocked;
  }

  return { evaluate };
})();
