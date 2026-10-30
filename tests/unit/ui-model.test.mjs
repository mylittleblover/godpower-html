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

test("standings preserves canonical tie order and negative leader", () => {
  const groups = [
      { id: 9, name: "先加入", score: -10 },
      { id: 2, name: "后加入", score: -10 },
    ],
    before = JSON.stringify(groups);
  const result = M.standings(groups);
  assert.equal(result.highest, -10);
  assert.equal(result.leader, "先加入");
  assert.equal(result.total, "-20");
  assert.equal(JSON.stringify(groups), before);
});
test("standings aggregate is exact beyond individual safe-integer sum", () => {
  const result = M.standings([
    { score: Number.MAX_SAFE_INTEGER },
    { score: Number.MAX_SAFE_INTEGER },
    { score: 1 },
  ]);
  assert.equal(result.total, "18014398509481983");
  assert.equal(result.count, 3);
});
test("empty standings is a safe display model", () => {
  const result = M.standings([]);
  assert.equal(result.total, "0");
  assert.equal(result.highest, 0);
  assert.equal(result.count, 0);
  assert.equal(result.leader, "—");
});

test("daily offsets are independent of dates and wrap without mutating content", () => {
  const date = new Date(2026, 9, 16),
    list = ["a", "b", "c"];
  assert.equal(M.daily(list, date, 1), list[(M.dayIndex(date) + 1) % 3]);
  assert.equal(M.daily(list, date, 0), M.daily(list, date));
  assert.equal(M.daily(list, date, 4), M.daily(list, date, 1));
});
for (const mutate of [
  (b) => b.knowledge.push({ ...b.knowledge[0] }),
  (b) => (b.knowledge[0].id = " "),
  (b) => (b.knowledge[0].summary = 10),
  (b) => (b.knowledge[0].subject = " "),
  (b) => (b.challenges[0].options[0] = " "),
  (b) => (b.challenges[0].options[0] = "a".repeat(10001)),
  (b) => (b.challenges[0].source = " "),
  (b) =>
    b.challenges.push(
      ...Array.from({ length: 500 }, (_, i) => ({
        ...b.challenges[0],
        id: "extra" + i,
      })),
    ),
])
  test(
    "bank rejects malformed fields and duplicates atomically: " +
      mutate.toString(),
    () => {
      const candidate = JSON.parse(JSON.stringify(M.examples));
      mutate(candidate);
      const before = JSON.stringify(candidate);
      assert.throws(() => M.validateBank(candidate));
      assert.equal(JSON.stringify(candidate), before);
    },
  );

test("group badges retain exact group colors and use black ink on light fills", () => {
  for (const color of [
    "#ffff00",
    "#fff2cc",
    "#aaffcc",
    "#ffffff",
    "#0f766e",
    "#ff6600",
  ])
    assert.equal(M.badgeColors(color).background.toLowerCase(), color);
  for (const color of ["#ffff00", "#fff2cc", "#aaffcc", "#ffffff"])
    assert.equal(M.badgeColors(color).foreground, "#000000");
  assert.equal(M.badgeColors("#0f766e").foreground, "#FFFFFF");
});
