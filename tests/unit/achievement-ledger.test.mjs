import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";

const context = vm.createContext({});
for (const file of [
  "src/domain/values.js",
  "src/domain/identity.js",
  "src/domain/events.js",
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
    payload: { seasonId: season, answered: true, correct: true },
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
