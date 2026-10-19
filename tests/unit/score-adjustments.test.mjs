import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import vm from "node:vm";
const file = "src/domain/competition/score-adjustments.js",
  context = vm.createContext({});
vm.runInContext(
  (existsSync(file) ? readFileSync(file, "utf8") : "") +
    '\nglobalThis.api=typeof ScoreAdjustments==="undefined"?null:ScoreAdjustments;',
  context,
);
const api = context.api;
test("manual score planning is independent of persistence and presentation", () =>
  assert.equal(typeof api?.delta, "function"));
for (const [score, delta, expected, milestone] of [
  [10, 5, 15, false],
  [0, -5, -5, false],
  [99, 1, 100, true],
  [-10, 9, -1, false],
  [9, -10, -1, false],
])
  test(`${score} plus ${delta} plans ${expected}`, () => {
    const group = Object.freeze({ id: 7, score });
    const result = api.delta(group, delta);
    assert.equal(result.before, score);
    assert.equal(result.after, expected);
    assert.equal(result.delta, delta);
    assert.equal(result.milestone, milestone);
    assert.equal(group.score, score);
  });
test("absolute score set preserves negative and unchanged values", () => {
  assert.equal(api.set({ id: 1, score: 9 }, -20).after, -20);
  assert.equal(api.set({ id: 1, score: 9 }, 9).delta, 0);
});
test("overflow and noninteger inputs are rejected before mutation", () => {
  for (const [score, delta] of [
    [Number.MAX_SAFE_INTEGER, 1],
    [0, 0.5],
    [0, Infinity],
    [NaN, 1],
  ])
    assert.throws(() => api.delta({ id: 1, score }, delta));
});
