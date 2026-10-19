import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";

const scope = vm.createContext({});
vm.runInContext(
  readFileSync("src/domain/events.js", "utf8") +
    "\nglobalThis.api = DomainEvents",
  scope,
);

test("command event scope emits immutable, sequenced, JSON-safe envelopes", () => {
  const events = scope.api.createScope({
    commandId: "cmd-1",
    actorId: "teacher-1",
    source: "classroom",
    now: () => "2026-10-19T10:00:00.000Z",
  });
  const input = {
    groupUid: "group-1",
    before: { score: 10 },
    after: { score: 12 },
  };
  const first = events.emit(
    "ROUND_SETTLED",
    { type: "group", id: "group-1" },
    input,
  );
  const second = events.emit(
    "SCORE_CHANGED",
    { type: "group", id: "group-1" },
    { delta: 2 },
  );

  input.after.score = 999;
  assert.equal(first.eventId, "cmd-1:1");
  assert.equal(first.sequence, 1);
  assert.equal(first.payload.after.score, 12);
  assert.equal(second.eventId, "cmd-1:2");
  assert.equal(Object.isFrozen(first.payload.after), true);
  assert.equal(events.list().length, 2);
});

test("rejects unsupported event types, missing aggregate identity and non-JSON payloads", () => {
  const events = scope.api.createScope({
    commandId: "cmd-2",
    now: () => "2026-10-19T10:00:00.000Z",
  });
  assert.throws(
    () => events.emit("CLICKED_BUTTON", { type: "group", id: "g" }, {}),
    /unsupported domain event/i,
  );
  assert.throws(
    () => events.emit("ITEM_USED", { type: "group", id: "" }, {}),
    /aggregate/i,
  );
  assert.throws(
    () =>
      events.emit("ITEM_USED", { type: "group", id: "g" }, { callback() {} }),
    /JSON/i,
  );
});

test("keeps event origin explicit so manual edits and imports can be excluded from achievements", () => {
  const classroom = scope.api.createScope({
    commandId: "cmd-3",
    source: "classroom",
    now: () => 0,
  });
  const manual = scope.api.createScope({
    commandId: "cmd-4",
    source: "manual",
    now: () => 0,
  });
  assert.equal(
    classroom.emit("ROUND_SETTLED", { type: "group", id: "g" }, {}).source,
    "classroom",
  );
  assert.equal(
    manual.emit("SCORE_CHANGED", { type: "group", id: "g" }, {}).source,
    "manual",
  );
  assert.equal(scope.api.isAchievementEligible(classroom.list()[0]), true);
  assert.equal(scope.api.isAchievementEligible(manual.list()[0]), false);
});

test("closed command scopes cannot produce late events", () => {
  const events = scope.api.createScope({ commandId: "cmd-5", now: () => 0 });
  events.close();
  assert.throws(
    () => events.emit("ITEM_USED", { type: "group", id: "g" }, {}),
    /closed/i,
  );
});
