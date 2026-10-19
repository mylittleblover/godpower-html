import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";

const context = vm.createContext({});
for (const file of [
  "src/domain/values.js",
  "src/domain/identity.js",
  "src/domain/events.js",
  "src/domain/achievements/learning-rules.js",
  "src/domain/achievements/ledger.js",
]) {
  vm.runInContext(readFileSync(file, "utf8"), context);
}
const api = vm.runInContext("AchievementLedger", context);

function event({
  id = "cmd-1:1",
  source = "classroom",
  season = "season-1",
  type = "ROUND_SETTLED",
  group = "group-1",
  answered = true,
  correct = true,
} = {}) {
  return {
    schemaVersion: 1,
    eventId: id,
    commandId: id.split(":")[0],
    sequence: 1,
    type,
    occurredAt: "2026-10-19T10:00:00.000Z",
    source,
    actorId: null,
    causationId: null,
    aggregate: { type: "group", id: group },
    payload: {
      seasonId: season,
      answered,
      correct,
      answer: correct ? "A" : answered ? "B" : "",
      correctAnswer: "A",
    },
  };
}

test("durably counts a confirmed classroom event once per stable group and season", () => {
  const first = api.apply(api.empty(), [event()], { seasonId: "season-1" });
  const progress = first.ledger.groups["group-1"];
  assert.equal(first.applied, 1);
  assert.equal(progress.historicalCounters.ROUND_SETTLED, 1);
  assert.equal(progress.seasonCounters.ROUND_SETTLED, 1);
  const duplicate = api.apply(first.ledger, [event()], {
    seasonId: "season-1",
  });
  assert.equal(duplicate.applied, 0);
  assert.equal(duplicate.duplicates, 1);
  assert.equal(
    duplicate.ledger.groups["group-1"].historicalCounters.ROUND_SETTLED,
    1,
  );
});

test("manual and imported events never create achievement facts", () => {
  const result = api.apply(api.empty(), [
    event({ id: "manual:1", source: "manual" }),
    event({ id: "import:1", source: "import" }),
  ]);
  assert.equal(result.applied, 0);
  assert.deepEqual(Object.keys(result.ledger.groups), []);
});

test("a new season resets seasonal counters but keeps lifetime counters and unlock buckets", () => {
  const initial = api.apply(api.empty(), [event()], {
    seasonId: "season-1",
  }).ledger;
  const next = api.apply(
    initial,
    [event({ id: "cmd-2:1", season: "season-2" })],
    { seasonId: "season-2" },
  );
  const progress = next.ledger.groups["group-1"];
  assert.equal(progress.historicalCounters.ROUND_SETTLED, 2);
  assert.equal(progress.seasonCounters.ROUND_SETTLED, 1);
  assert.equal(progress.seasonId, "season-2");
});

test("learning streak, participation and accuracy achievements use formal rounds", () => {
  let ledger = api.empty();
  let unlocked = [];
  for (let index = 1; index <= 10; index++) {
    const result = api.apply(ledger, [event({ id: `cmd-${index}:1` })], {
      seasonId: "season-1",
    });
    ledger = result.ledger;
    unlocked.push(...result.unlocked.map((item) => item.achievementId));
  }
  assert.ok(unlocked.includes("ACH-001"));
  assert.ok(unlocked.includes("ACH-005"));
  assert.ok(unlocked.includes("ACH-006"));
  assert.ok(unlocked.includes("ACH-007"));
  assert.ok(unlocked.includes("ACH-008"));
  assert.ok(unlocked.includes("ACH-010"));
  const progress = ledger.groups["group-1"];
  assert.equal(progress.historicalCounters.correctAnswers, 10);
  assert.equal(progress.seasonProgress.correctStreak, 10);
  assert.equal(progress.seasonUnlocks["ACH-010"].status, "pending-archive");
});

test("unanswered rounds break answer streaks and wrong answers restart recovery", () => {
  let ledger = api.empty();
  let unlocked = [];
  const rounds = [
    { answered: true, correct: false },
    { answered: true, correct: true },
    { answered: false, correct: false },
    { answered: true, correct: false },
    { answered: true, correct: true },
    { answered: true, correct: true },
    { answered: true, correct: true },
  ];
  rounds.forEach((facts, index) => {
    const result = api.apply(
      ledger,
      [event({ ...facts, id: `recover-${index}:1` })],
      { seasonId: "season-1" },
    );
    ledger = result.ledger;
    unlocked.push(...result.unlocked.map((item) => item.achievementId));
  });
  const progress = ledger.groups["group-1"];
  assert.ok(unlocked.includes("ACH-012"));
  assert.equal(progress.seasonProgress.answeredStreak, 4);
  assert.equal(progress.seasonProgress.recoveryRemaining, 0);
  assert.equal(progress.historicalCounters.answeredRounds, 6);
});
