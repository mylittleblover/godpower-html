import test from "node:test";
import assert from "node:assert/strict";
import { core } from "../fixtures/core.mjs";
for (const score of [0, 1, -1, 9999999, Number.MAX_SAFE_INTEGER])
  test(`valid score ${score}`, () =>
    assert.equal(
      core.validateBackup({ groups: [{ score }] }).groups[0].score,
      score,
    ));
for (const input of [
  null,
  [],
  {},
  { groups: [] },
  { schemaVersion: 2, groups: [{}] },
  { groups: [{ score: Infinity }] },
  { groups: [{ score: 1.5 }] },
  { groups: [{ score: Number.MAX_SAFE_INTEGER + 1 }] },
  { groups: [{ members: "abc" }] },
  { groups: [{ members: [null] }] },
  { groups: [{ inventory: {} }] },
  { groups: [{ inventory: [1, 2, 3, 4] }] },
  { groups: [{ itemEffect: [] }] },
  { groups: [{}], picker: [] },
])
  test(`invalid backup ${JSON.stringify(input)}`, () =>
    assert.throws(() => core.validateBackup(input)));
for (const [s, expected] of [
  [{}, "NOT_STARTED"],
  [{ hasStartedOnce: true }, "FINISHED"],
  [{ hasStartedOnce: true, roundActive: true }, "ANSWERING"],
  [
    { hasStartedOnce: true, roundActive: true, correctAns: "D" },
    "ANSWER_SELECTED",
  ],
  [{ hasStartedOnce: true, roundActive: true, evaluated: true }, "SETTLED"],
])
  test(`phase ${expected}`, () => assert.equal(core.phase(s), expected));
for (const hasStartedOnce of [false, true])
  for (const roundActive of [false, true])
    for (const evaluated of [false, true])
      for (const correctAns of ["", "A"])
        test(
          `legacy phase precedence ${+hasStartedOnce}${+roundActive}${+evaluated}:${correctAns || "none"}`,
          () => {
            const round = {
              hasStartedOnce,
              roundActive,
              evaluated,
              correctAns,
            };
            const expected = !hasStartedOnce
              ? "NOT_STARTED"
              : !roundActive
                ? "FINISHED"
                : evaluated
                  ? "SETTLED"
                  : correctAns
                    ? "ANSWER_SELECTED"
                    : "ANSWERING";
            assert.equal(core.phase(round), expected);
          },
        );
for (const uri of [
  'x" onerror="alert(1)',
  "javascript:alert(1)",
  "https://example.com/x",
  "data:image/svg+xml;base64,AAAA",
])
  test(`reject image ${uri}`, () => assert.equal(core.safeImage(uri), ""));
test("raster data image accepted", () =>
  assert.equal(
    core.safeImage("data:image/png;base64,AAAA"),
    "data:image/png;base64,AAAA",
  ));
test("CSV formula neutralization preserves numeric input externally", () => {
  assert.equal(core.csvText("=WEBSERVICE(1)"), "'=WEBSERVICE(1)");
  assert.equal(core.csvText("甲,乙"), "甲,乙");
});
test("unsafe All In score is rejected before mutation", () => {
  const s = {
    correctAns: "A",
    groups: [{ score: Number.MAX_SAFE_INTEGER, selectedOpt: "A", allIn: true }],
  };
  assert.throws(() => core.calculateRoundScores(s));
  assert.equal(s.groups[0].score, Number.MAX_SAFE_INTEGER);
});
test("round calculation preserves answer and All In rules", () =>
  assert.deepEqual(
    Array.from(
      core.calculateRoundScores({
        correctAns: "D",
        groups: [
          { score: 7, selectedOpt: "D" },
          { score: 8, selectedOpt: "D", allIn: true },
          { score: 20, selectedOpt: "B", allIn: true },
          { score: -3, selectedOpt: "" },
        ],
      }),
    ),
    [9, 16, 0, -3],
  ));
test("statistics and effects reject injected strings", () => {
  assert.equal(
    core.normalizeStats({ correct: "<img onerror=alert(1)>" }).correct,
    0,
  );
  assert.equal(
    core.normalizeEffect({ type: "<img>", hitsLeft: "x" }).type,
    undefined,
  );
});
test("corrupt undo snapshots rejected on import", () =>
  assert.throws(() =>
    core.validateBackup({
      groups: [{ score: 1 }],
      history: [{ groups: [{ score: "bad" }] }],
    }),
  ));
test("picker arrays reject oversized or non-primitive identifiers", () => {
  assert.throws(() =>
    core.validateBackup({
      groups: [{ score: 0 }],
      picker: { pickedStudentKeys: Array(10001).fill("s") },
    }),
  );
  assert.throws(() =>
    core.validateBackup({
      groups: [{ score: 0 }],
      picker: { pickedGroupIds: [{ id: 1 }] },
    }),
  );
});
test("cooldown and picker history reject malformed nested records", () => {
  assert.throws(() =>
    core.validateBackup({
      groups: [{ score: 0 }],
      itemGlobal: {
        drawThrottleV2179: {
          sequence: 1,
          nextEligible: { lightning: "javascript:alert(1)" },
        },
      },
    }),
  );
  assert.throws(() =>
    core.validateBackup({
      groups: [{ score: 0 }],
      itemGlobal: { pickerHistory: [{ time: "bad", text: "x" }] },
    }),
  );
});
test("valid legacy picker cooldown and classroom histories remain importable", () => {
  const data = {
    schemaVersion: 1,
    groups: [{ id: 1, score: 2, members: ["学生"] }],
    picker: {
      mode: "two_tier",
      antiRepeat: true,
      pickedStudentKeys: ["1__学生"],
      pickedGroupIds: [1],
      preselectedGroupIds: [1],
    },
    itemGlobal: {
      drawThrottleV2179: {
        sequence: 2,
        nextEligible: { lightning: 7, blooper: 0 },
        groupStrongSkip: { 1: 1 },
      },
      drawSessionThrottleV21710: {
        sessionNo: 3,
        nextEligibleSession: { lightning: 8, blooper: 0 },
      },
      pickerHistory: [{ time: 100, text: "抽中学生（第1组）" }],
      handRaiseHistory: [{ time: 101, groupId: 1, correct: true }],
    },
  };
  assert.equal(core.validateBackup(data), data);
});
