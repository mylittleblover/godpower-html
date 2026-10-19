/* Learning achievements are reduced only from durable, formal round facts. */
const LearningAchievementRules = (() => {
  const PERMANENT_THRESHOLDS = [
    ["ACH-001", (p) => p.historicalCounters.correctAnswers >= 1],
    ["ACH-002", (p) => p.historicalCounters.correctAnswers >= 10],
    ["ACH-003", (p) => p.historicalCounters.correctAnswers >= 30],
    ["ACH-004", (p) => p.historicalCounters.correctAnswers >= 100],
    ["ACH-009", (p) => p.historicalCounters.answeredRounds >= 50],
  ];
  const SEASON_THRESHOLDS = [
    ["ACH-005", (p) => p.seasonProgress.correctStreak >= 3],
    ["ACH-006", (p) => p.seasonProgress.correctStreak >= 5],
    ["ACH-007", (p) => p.seasonProgress.correctStreak >= 10],
    ["ACH-008", (p) => p.seasonProgress.answeredStreak >= 10],
    [
      "ACH-010",
      (p) =>
        p.seasonProgress.answered >= 10 &&
        p.seasonProgress.correct / p.seasonProgress.answered >= 0.8,
    ],
    [
      "ACH-011",
      (p) =>
        p.seasonProgress.answered >= 15 &&
        p.seasonProgress.correct === p.seasonProgress.answered,
    ],
    [
      "ACH-012",
      (p) =>
        p.seasonProgress.recoveryRemaining === 0 &&
        p.seasonProgress.recoveryReady,
    ],
  ];

  function evaluate(progress, event) {
    const facts = event?.payload;
    if (
      event?.type !== "ROUND_SETTLED" ||
      !facts ||
      typeof facts.answered !== "boolean" ||
      typeof facts.correct !== "boolean" ||
      facts.correct !== (facts.answered && facts.answer === facts.correctAnswer)
    )
      return [];

    const learning = progress.seasonProgress;
    const correct = facts.answered && facts.correct;
    progress.historicalCounters.formalRounds =
      (progress.historicalCounters.formalRounds || 0) + 1;
    if (facts.answered) {
      progress.historicalCounters.answeredRounds =
        (progress.historicalCounters.answeredRounds || 0) + 1;
      learning.answered++;
      learning.answeredStreak++;
    } else {
      learning.answeredStreak = 0;
    }
    if (correct) {
      progress.historicalCounters.correctAnswers =
        (progress.historicalCounters.correctAnswers || 0) + 1;
      learning.correct++;
      learning.correctStreak++;
      if (learning.recoveryRemaining > 0) {
        learning.recoveryRemaining--;
        if (learning.recoveryRemaining === 0) learning.recoveryReady = true;
      }
    } else {
      learning.correctStreak = 0;
      if (facts.answered) {
        learning.recoveryRemaining = 3;
        learning.recoveryReady = false;
      } else {
        learning.recoveryRemaining = 0;
        learning.recoveryReady = false;
      }
    }

    const unlocked = [];
    for (const [id, condition] of PERMANENT_THRESHOLDS) {
      if (condition(progress) && !progress.permanentUnlocks[id]) {
        progress.permanentUnlocks[id] = { unlockedAt: event.occurredAt };
        unlocked.push(id);
      }
    }
    for (const [id, condition] of SEASON_THRESHOLDS) {
      if (condition(progress) && !progress.seasonUnlocks[id]) {
        progress.seasonUnlocks[id] = {
          status: "pending-archive",
          seasonId: facts.seasonId || null,
          unlockedAt: event.occurredAt,
        };
        unlocked.push(id);
      }
    }
    return unlocked;
  }

  return { evaluate };
})();
