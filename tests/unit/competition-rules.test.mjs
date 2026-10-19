import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import vm from "node:vm";
const context = vm.createContext({});
const file = "src/domain/competition/rules.js";
vm.runInContext(
  (existsSync(file) ? readFileSync(file, "utf8") : "") +
    '\nglobalThis.api=typeof CompetitionRules === "undefined" ? null : CompetitionRules;',
  context,
);
const rules = context.api;
test("exports the pure round calculation port", () =>
  assert.equal(typeof rules?.calculateRound, "function"));
for (const [score, selectedOpt, allIn, expected, text] of [
  [0, "A", false, 2, "正确(+2)"],
  [10, "A", true, 20, "答对(×2)"],
  [0, "A", true, 0, "答对(×2)"],
  [10, "B", true, 0, "清零"],
  [-10, "B", true, 0, "清零"],
  [-10, "A", false, -8, "正确(+2)"],
  [10, "", true, 10, "未作答"],
  [10, "B", false, 10, "错误(+0)"],
  [Number.MAX_SAFE_INTEGER, "B", false, Number.MAX_SAFE_INTEGER, "错误(+0)"],
])
  test(`round score ${score} ${selectedOpt || "blank"} AllIn=${allIn}`, () => {
    const result = rules.calculateRound({
      correctAns: "A",
      groups: [{ id: 1, score, selectedOpt, allIn }],
    })[0];
    assert.equal(result.scoreAfter, expected);
    assert.equal(result.resultText, text);
    assert.equal(result.answered, !!selectedOpt);
    assert.equal(result.correct, selectedOpt === "A");
  });
test("rejects unsafe result before exposing any partial calculations", () => {
  assert.throws(
    () =>
      rules.calculateRound({
        correctAns: "A",
        groups: [
          { score: 1, selectedOpt: "A" },
          { score: Number.MAX_SAFE_INTEGER, selectedOpt: "A" },
        ],
      }),
    /安全整数/,
  );
  assert.throws(
    () =>
      rules.calculateRound({
        correctAns: "A",
        groups: [
          { score: Number.MAX_SAFE_INTEGER, selectedOpt: "A", allIn: true },
        ],
      }),
    /安全整数/,
  );
});
test("calculation preserves input and group ordering", () => {
  const input = Object.freeze({
    correctAns: "D",
    groups: Object.freeze([
      Object.freeze({ id: 4, score: 7, selectedOpt: "D" }),
      Object.freeze({ id: 1, score: 3, selectedOpt: "A" }),
    ]),
  });
  const result = rules.calculateRound(input);
  assert.deepEqual(
    Array.from(result, (row) => row.groupId),
    [4, 1],
  );
  assert.equal(input.groups[0].score, 7);
});
