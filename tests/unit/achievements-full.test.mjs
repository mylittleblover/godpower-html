import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";

const context = vm.createContext({});
for (const file of [
  "src/domain/achievements/catalog.js",
  "src/domain/values.js",
  "src/domain/identity.js",
  "src/domain/events.js",
  "src/domain/achievements/learning-rules.js",
  "src/domain/achievements/competition-rules.js",
  "src/domain/achievements/collection-rules.js",
  "src/domain/achievements/honor-rules.js",
  "src/domain/achievements/ledger.js",
]) {
  vm.runInContext(readFileSync(file, "utf8"), context);
}
const Ledger = vm.runInContext("AchievementLedger", context);
const Catalog = vm.runInContext("AchievementCatalog", context);

let seq = 1;
function mkEvent(type, payload = {}, opts = {}) {
  const id = `cmd-${seq++}:1`;
  return {
    schemaVersion: 1,
    eventId: id,
    commandId: id.split(":")[0],
    sequence: 1,
    type,
    occurredAt: opts.at || "2026-11-15T10:00:00.000Z",
    source: opts.source || "classroom",
    actorId: null,
    causationId: null,
    aggregate: { type: "group", id: opts.group || "g-1" },
    payload: { seasonId: opts.season || "season-1", ...payload },
  };
}

function roundPayload(overrides = {}) {
  const answered = overrides.answered ?? true;
  const correct = overrides.correct ?? true;
  return {
    answered,
    correct,
    answer: correct ? "A" : answered ? "B" : "",
    correctAnswer: "A",
    scoreBefore: 10,
    scoreAfter: correct ? 12 : 10,
    allIn: false,
    groupCount: 5,
    rankBefore: 3,
    rankAfter: 3,
    leaderScoreBefore: 12,
    isLastInSeason: false,
    ...overrides,
  };
}

function applyAll(ledger, events, seasonId = "season-1") {
  return Ledger.apply(ledger, events, { seasonId });
}

test("unlocks every learning and competition achievement (ACH-001..ACH-022) strictly from classroom events", () => {
  let ledger = Ledger.empty();
  const seen = new Set();
  const push = (res) => {
    ledger = res.ledger;
    res.unlocked.forEach((u) => seen.add(u.achievementId));
  };

  // Manual and import events cannot trigger ACH-013/014/023
  push(
    applyAll(ledger, [
      mkEvent(
        "SCORE_CHANGED",
        { origin: "item-boost", delta: 200 },
        { source: "manual" },
      ),
      mkEvent("ITEM_ACQUIRED", { itemKey: "coin" }, { source: "import" }),
    ]),
  );
  assert.equal(seen.size, 0);

  // Round 1: last in 5-group game, wrong answer -> starts recovery + records bottom rank
  push(
    applyAll(ledger, [
      mkEvent(
        "ROUND_SETTLED",
        roundPayload({
          answered: true,
          correct: false,
          scoreBefore: 0,
          scoreAfter: 0,
          rankBefore: 5,
          rankAfter: 5,
          leaderScoreBefore: 20,
          isLastInSeason: true,
        }),
      ),
    ]),
  );
  assert.ok(!seen.has("ACH-018"));

  // Next 3 rounds: All In consecutive wins reaching rank 1 from 10+ behind, gaining >= 20
  push(
    applyAll(ledger, [
      mkEvent(
        "ROUND_SETTLED",
        roundPayload({
          answered: true,
          correct: true,
          allIn: true,
          scoreBefore: 10,
          scoreAfter: 20,
          rankBefore: 5,
          rankAfter: 2,
          leaderScoreBefore: 22,
        }),
      ),
      mkEvent(
        "ROUND_SETTLED",
        roundPayload({
          answered: true,
          correct: true,
          allIn: true,
          scoreBefore: 20,
          scoreAfter: 40,
          rankBefore: 2,
          rankAfter: 1,
          leaderScoreBefore: 35,
        }),
      ),
      mkEvent(
        "ROUND_SETTLED",
        roundPayload({
          answered: true,
          correct: true,
          allIn: true,
          scoreBefore: 40,
          scoreAfter: 80,
          rankBefore: 1,
          rankAfter: 1,
          leaderScoreBefore: 40,
        }),
      ),
    ]),
  );
  for (const id of [
    "ACH-001",
    "ACH-005",
    "ACH-012",
    "ACH-013",
    "ACH-015",
    "ACH-017",
    "ACH-018",
    "ACH-019",
    "ACH-020",
    "ACH-021",
    "ACH-022",
  ]) {
    assert.ok(seen.has(id), `Expected ${id} to unlock`);
  }

  // Continue across seasons to reach 100 cumulative answers, 50 answered rounds, 100 positive gain, 10 top3 rounds
  for (let i = 0; i < 97; i++) {
    const season = `season-${1 + Math.floor(i / 20)}`;
    push(
      applyAll(
        ledger,
        [
          mkEvent(
            "ROUND_SETTLED",
            roundPayload({
              scoreBefore: 10,
              scoreAfter: 12,
              rankBefore: 2,
              rankAfter: 2,
              groupCount: 5,
            }),
            { season },
          ),
        ],
        season,
      ),
    );
  }
  for (let i = 1; i <= 22; i++) {
    const id = `ACH-${String(i).padStart(3, "0")}`;
    assert.ok(seen.has(id), `Missing ${id}`);
  }
});

test("unlocks every collection, tactical and hidden achievement (ACH-023..044, ACH-053..060) and enforces instance isolation", () => {
  let ledger = Ledger.empty();
  const seen = new Set();
  const push = (events) => {
    const res = applyAll(ledger, events);
    ledger = res.ledger;
    res.unlocked.forEach((u) => seen.add(u.achievementId));
  };

  // Discover all 28 item keys via formal draws
  const allKeys = Catalog.itemKeys();
  assert.equal(allKeys.length, 28);
  push(
    allKeys.map((itemKey, idx) =>
      mkEvent("ITEM_ACQUIRED", {
        itemKey,
        itemInstanceId: `inst-${idx}`,
        source: idx % 2 === 0 ? "global-draw" : "hand-raise-reward",
      }),
    ),
  );
  for (const id of ["ACH-023", "ACH-024", "ACH-025", "ACH-026"]) {
    assert.ok(seen.has(id), `Missing ${id}`);
  }

  // Two DIFFERENT triple_mushroom instances gaining 2+1 should NOT unlock ACH-031
  push([
    mkEvent("ITEM_USED", {
      itemKey: "triple_mushroom",
      itemInstanceId: "tm-a",
      casterDelta: 2,
    }),
    mkEvent("ITEM_USED", {
      itemKey: "triple_mushroom",
      itemInstanceId: "tm-a",
      casterDelta: 2,
    }),
    mkEvent("ITEM_USED", {
      itemKey: "triple_mushroom",
      itemInstanceId: "tm-b",
      casterDelta: 2,
    }),
  ]);
  assert.equal(seen.has("ACH-031"), false);
  push([
    mkEvent("ITEM_USED", {
      itemKey: "triple_mushroom",
      itemInstanceId: "tm-a",
      casterDelta: 2,
    }),
  ]);
  assert.equal(seen.has("ACH-031"), true);

  // Single-use & tactical items
  push([
    mkEvent("ITEM_USED", { itemKey: "coin", casterDelta: 2 }),
    mkEvent("ITEM_USED", {
      itemKey: "coin_shell",
      casterDelta: 3,
      boostedAheadCount: 1,
    }),
    mkEvent("ITEM_USED", {
      itemKey: "question",
      casterDelta: 2,
      boostedBehindCount: 2,
    }),
    mkEvent("ITEM_USED", { itemKey: "mushroom", casterDelta: 1 }),
    mkEvent("ITEM_USED", { itemKey: "green", hitTargetUids: ["g-2"] }),
    mkEvent("ITEM_USED", {
      itemKey: "red",
      hitTargetUids: ["g-2"],
      hitAdjacentAbove: true,
    }),
    mkEvent("ITEM_USED", {
      itemKey: "spiny",
      hitTargetUids: ["g-2"],
      hitLeader: true,
    }),
    mkEvent("ITEM_USED", {
      itemKey: "banana",
      hitTargetUids: ["g-2"],
      hitAdjacentBelow: true,
    }),
    mkEvent("ITEM_USED", {
      itemKey: "bomb",
      hitTargetUids: ["g-2", "g-3"],
    }),
    mkEvent("ITEM_USED", {
      itemKey: "hammer",
      hitTargetUids: ["g-2", "g-3", "g-4"],
      hitAheadCount: 3,
    }),
    mkEvent("ITEM_USED", {
      itemKey: "lightning",
      hitTargetUids: ["g-2", "g-3", "g-4"],
      hitAheadCount: 3,
    }),
    mkEvent("ITEM_USED", { itemKey: "boo", booAlternateMushroom: true }),
    mkEvent("ITEM_USED", {
      itemKey: "bullet",
      groupCount: 5,
      casterRankBefore: 5,
      casterRankAfter: 2,
    }),
    mkEvent("ITEM_USED", {
      itemKey: "boomerang_flower",
      hitTargetUids: ["g-2", "g-3"],
      hitAdjacentAbove: true,
      hitAdjacentBelow: true,
    }),
  ]);

  // Multi-charge triples & fire_flower
  push([
    mkEvent("ITEM_USED", {
      itemKey: "triple_green",
      itemInstanceId: "tg-1",
      hitTargetUids: ["g-2"],
    }),
    mkEvent("ITEM_USED", {
      itemKey: "triple_green",
      itemInstanceId: "tg-1",
      hitTargetUids: ["g-3"],
    }),
    mkEvent("ITEM_USED", {
      itemKey: "triple_green",
      itemInstanceId: "tg-1",
      hitTargetUids: ["g-4"],
    }),
    mkEvent("ITEM_USED", {
      itemKey: "triple_red",
      itemInstanceId: "tr-1",
      hitTargetUids: ["g-2"],
    }),
    mkEvent("ITEM_USED", {
      itemKey: "triple_red",
      itemInstanceId: "tr-1",
      hitTargetUids: ["g-3"],
    }),
    mkEvent("ITEM_USED", {
      itemKey: "triple_red",
      itemInstanceId: "tr-1",
      hitTargetUids: ["g-2"],
    }),
    mkEvent("ITEM_USED", {
      itemKey: "triple_banana",
      itemInstanceId: "tb-1",
      roundNumber: 4,
      hitTargetUids: ["g-5"],
    }),
    mkEvent("ITEM_USED", {
      itemKey: "triple_banana",
      itemInstanceId: "tb-1",
      roundNumber: 4,
      hitTargetUids: ["g-5"],
    }),
    mkEvent("ITEM_USED", {
      itemKey: "triple_banana",
      itemInstanceId: "tb-1",
      roundNumber: 4,
      hitTargetUids: ["g-5"],
    }),
    mkEvent("ITEM_USED", {
      itemKey: "fire_flower",
      itemInstanceId: "ff-1",
      hitTargetUids: ["g-2"],
    }),
    mkEvent("ITEM_USED", {
      itemKey: "fire_flower",
      itemInstanceId: "ff-1",
      hitTargetUids: ["g-3"],
    }),
    mkEvent("ITEM_USED", {
      itemKey: "fire_flower",
      itemInstanceId: "ff-1",
      hitTargetUids: ["g-4"],
    }),
  ]);

  // Defenses: horn vs spiny, feather, star x3 (same activation vs different), mega x3
  push([
    mkEvent("DEFENSE_RESOLVED", {
      blocked: true,
      defenderKey: "horn",
      attackerItemKey: "spiny",
    }),
    mkEvent("DEFENSE_RESOLVED", {
      blocked: true,
      defenderKey: "feather",
      attackerItemKey: "red",
    }),
    // 2 blocks on star-act-1 + 1 on star-act-2 must not unlock ACH-043 yet
    mkEvent("DEFENSE_RESOLVED", {
      blocked: true,
      defenderKey: "star",
      effectActivationId: "star-act-1",
      attackerItemKey: "green",
    }),
    mkEvent("DEFENSE_RESOLVED", {
      blocked: true,
      defenderKey: "star",
      effectActivationId: "star-act-1",
      attackerItemKey: "red",
    }),
    mkEvent("DEFENSE_RESOLVED", {
      blocked: true,
      defenderKey: "star",
      effectActivationId: "star-act-2",
      attackerItemKey: "bomb",
    }),
  ]);
  assert.equal(seen.has("ACH-043"), false);
  push([
    mkEvent("DEFENSE_RESOLVED", {
      blocked: true,
      defenderKey: "star",
      effectActivationId: "star-act-1",
      attackerItemKey: "lightning",
    }),
    mkEvent("DEFENSE_RESOLVED", {
      blocked: true,
      defenderKey: "mega",
      effectActivationId: "mega-act-1",
      attackerItemKey: "green",
    }),
    mkEvent("DEFENSE_RESOLVED", {
      blocked: true,
      defenderKey: "mega",
      effectActivationId: "mega-act-1",
      attackerItemKey: "red",
    }),
    mkEvent("DEFENSE_RESOLVED", {
      blocked: true,
      defenderKey: "mega",
      effectActivationId: "mega-act-1",
      attackerItemKey: "spiny",
    }),
  ]);

  // Blooper, Power (3/3 completed), Ice-flower cancelled
  push([
    mkEvent(
      "ROUND_SETTLED",
      roundPayload({
        blooperActiveScored: true,
        powerCompleted: { totalAnswered: 5, totalCorrect: 5 },
      }),
    ),
    mkEvent("EFFECT_EXPIRED", {
      effectKey: "freeze",
      reason: "use-cancelled",
    }),
  ]);

  for (let i = 23; i <= 44; i++) {
    const id = `ACH-${String(i).padStart(3, "0")}`;
    assert.ok(seen.has(id), `Missing ${id}`);
  }
  for (let i = 53; i <= 60; i++) {
    const id = `ACH-${String(i).padStart(3, "0")}`;
    assert.ok(seen.has(id), `Missing ${id}`);
  }
});

test("unlocks every honor achievement (ACH-045..ACH-052) and archives seasonal unlocks on SEASON_ARCHIVED", () => {
  let ledger = Ledger.empty();
  const seen = new Set();

  // Ineffective season is ignored
  let res = applyAll(ledger, [
    mkEvent("SEASON_ARCHIVED", {
      effectiveSeason: false,
      groupCount: 4,
      rank: 1,
      marginOverSecond: 20,
      roundsCompleted: 12,
    }),
  ]);
  assert.equal(res.unlocked.length, 0);

  // One runner-up season
  res = applyAll(
    res.ledger,
    [
      mkEvent(
        "SEASON_ARCHIVED",
        {
          effectiveSeason: true,
          groupCount: 4,
          rank: 2,
          marginOverSecond: 0,
          roundsCompleted: 5,
        },
        { season: "s-run" },
      ),
    ],
    "s-run",
  );
  ledger = res.ledger;
  res.unlocked.forEach((u) => seen.add(u.achievementId));

  // 10 championship seasons (first qualifies ACH-010 -> archived, ACH-051, ACH-052)
  for (let s = 1; s <= 10; s++) {
    const season = `s-champ-${s}`;
    for (let q = 0; q < 10; q++) {
      res = applyAll(ledger, [mkEvent("ROUND_SETTLED", roundPayload(), { season })], season);
      ledger = res.ledger;
      res.unlocked.forEach((u) => seen.add(u.achievementId));
    }
    res = applyAll(
      ledger,
      [
        mkEvent(
          "SEASON_ARCHIVED",
          {
            effectiveSeason: true,
            groupCount: 5,
            rank: 1,
            marginOverSecond: 12,
            roundsCompleted: 10,
          },
          { season },
        ),
      ],
      season,
    );
    ledger = res.ledger;
    res.unlocked.forEach((u) => seen.add(u.achievementId));
  }

  for (let i = 45; i <= 52; i++) {
    const id = `ACH-${String(i).padStart(3, "0")}`;
    assert.ok(seen.has(id), `Missing ${id}`);
  }
  assert.ok(ledger.groups["g-1"].archivedUnlocks["ACH-010"]);
  assert.equal(ledger.groups["g-1"].archivedUnlocks["ACH-010"].count, 10);
});
