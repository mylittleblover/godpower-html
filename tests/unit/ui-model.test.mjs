import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
const context = vm.createContext({ Date });
vm.runInContext(readFileSync("src/ui/model.js", "utf8"), context);
const M = context.GodpowerUIModel;
test("daily content is stable across same-day reloads and changes next date", () => {
  const a = new Date(2026, 9, 16, 0, 1),
    b = new Date(2026, 9, 16, 23, 59),
    c = new Date(2026, 9, 17);
  assert.equal(
    M.daily(M.examples.challenges, a).id,
    M.daily(M.examples.challenges, b).id,
  );
  assert.notEqual(
    M.daily(M.examples.challenges, a).id,
    M.daily(M.examples.challenges, c).id,
  );
});
test("local civil day handles month and year boundaries", () => {
  assert.equal(
    M.dayIndex(new Date(2027, 0, 1)) - M.dayIndex(new Date(2026, 11, 31)),
    1,
  );
  assert.equal(
    M.dayIndex(new Date(2026, 10, 1)) - M.dayIndex(new Date(2026, 9, 31)),
    1,
  );
});
test("empty bank has no fabricated fallback question", () =>
  assert.equal(M.daily([]), null));
test("built-in examples have sources and corresponding answers", () => {
  M.validateBank(M.examples);
  for (const q of M.examples.challenges) {
    assert.ok(q.options[q.answer]);
    assert.ok(q.source.includes("宪法"));
    assert.ok(q.explanation);
  }
});
for (const invalid of [
  {},
  {
    knowledge: [],
    challenges: [
      {
        id: "q",
        title: "x",
        subject: "politics",
        source: "source",
        options: ["a", "b", "c", "d"],
        answer: 4,
        explanation: "x",
      },
    ],
  },
  { knowledge: [{ id: "a", title: "x", subject: "politics" }], challenges: [] },
])
  test("invalid local bank rejected " + JSON.stringify(invalid), () =>
    assert.throws(() => M.validateBank(invalid)),
  );
test("history differences use real snapshots without mutations", () => {
  const a = {
      groups: [
        {
          id: 1,
          name: "甲",
          score: 10,
          inventory: [{ key: "coin", charges: 1 }],
          itemEffect: { type: "star", hitsLeft: 3 },
        },
        { id: 2, name: "乙", score: 12 },
      ],
    },
    b = {
      groups: [
        { id: 1, name: "甲", score: 20, inventory: [], itemEffect: null },
        { id: 3, name: "丙", score: -3 },
      ],
    };
  const saved = JSON.stringify([a, b]),
    diff = M.differences(a, b);
  assert.equal(diff[0].delta, 10);
  assert.equal(diff[0].rankBefore, 2);
  assert.equal(diff[0].rankAfter, 1);
  assert.equal(diff[0].effectsBefore.type, "star");
  assert.equal(diff[1].removed, true);
  assert.equal(diff[2].added, true);
  assert.equal(JSON.stringify([a, b]), saved);
});
