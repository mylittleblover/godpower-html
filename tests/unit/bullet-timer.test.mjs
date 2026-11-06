import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
const source = readFileSync("src/runtime/items/attack-legacy.js", "utf8")
  .split("function startBulletTimer() {")[1]
  .split("function startBlooperClock()")[0];
function fixture(groups) {
  let tick,
    saves = 0,
    renders = 0,
    clears = 0;
  const c = {
    bulletTimer: null,
    state: { groups },
    setInterval: (fn) => ((tick = fn), 1),
    clearInterval: () => clears++,
    ensureItemState: () => {},
    rankIndex: (id) => id,
    eligibleForItems: () => true,
    saveState: () => saves++,
    renderGrid: () => renders++,
    renderChart: () => renders++,
    renderDashboard: () => renders++,
    showToast: () => {},
  };
  vm.runInNewContext(
    "function startBulletTimer() {" + source + ";startBulletTimer()",
    c,
  );
  return { tick: () => tick(), counts: () => ({ saves, renders, clears }) };
}
test("idle bullet timer stops without saving or rebuilding the classroom", () => {
  const f = fixture([{ id: 1, score: 10, inventory: [] }]);
  f.tick();
  assert.deepEqual(f.counts(), { saves: 0, renders: 0, clears: 1 });
});
test("active bullet tick still adds one point and persists once", () => {
  const g = {
    id: 2,
    score: 10,
    inventory: [{ key: "bullet" }],
    itemEffect: { type: "bullet", targetId: 1 },
  };
  const f = fixture([{ id: 1, score: 20 }, g]);
  f.tick();
  assert.equal(g.score, 11);
  assert.deepEqual(f.counts(), { saves: 1, renders: 3, clears: 0 });
});
