import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
const source = readFileSync("src/ui/classroom-feedback.js", "utf8");
const api = runInNewContext(source + "\nClassroomFeedback;");
test("Shared score defaults include exactly six signed values and independent presentation toggles", () => {
  const d = JSON.parse(JSON.stringify(api.getOptions()));
  assert.deepEqual(d.slots, [1, 2, 5, -1, -2, -5]);
  assert.equal(d.pickEffects, true);
  assert.equal(d.scoreEffects, true);
  assert.equal(d.clickEnabled, true);
});
test("Malformed slot data cannot become scoring commands", () => {
  for (const slots of [
    [],
    [1, 2, 3],
    Array(6).fill(0),
    Array(6).fill(1.5),
    Array(6).fill(NaN),
    Array(6).fill("2"),
    Array(6).fill(Number.MAX_SAFE_INTEGER + 1),
  ])
    assert.throws(() => api.validate({ slots }), /六个槽位/);
});
test("Extreme valid scores stay exact and configuration clamps only audio volume", () => {
  const d = api.validate({
    slots: [Number.MAX_SAFE_INTEGER, 2, 3, -Number.MAX_SAFE_INTEGER, -2, -3],
    clickVolume: 4,
    duration: 99,
    style: "unknown",
  });
  assert.equal(d.slots[0], Number.MAX_SAFE_INTEGER);
  assert.equal(d.slots[3], -Number.MAX_SAFE_INTEGER);
  assert.equal(d.clickVolume, 1);
  assert.equal(d.duration, 1800);
  assert.equal(d.style, "aurora");
});
test("External option reads cannot mutate shared scoring slots", () => {
  const a = api.getOptions();
  a.slots[0] = 999;
  assert.equal(api.getOptions().slots[0], 1);
});
