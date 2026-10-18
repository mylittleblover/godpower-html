import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync, existsSync } from "node:fs";

const path = "src/ui/render.js";
function harness() {
  const calls = [],
    timers = new Map();
  let serial = 0;
  const c = vm.createContext({
    state: { roundActive: true, evaluated: false },
    attackRenderGateV21713: false,
    attackRenderTimerV21713: null,
    attackRenderFlushingV21713: false,
    pendingRenderArgsV21713: null,
    roundStateFlipBusyV21726: false,
    v213SuppressReorderAnimation: true,
    ATTACK_REORDER_DELAY_V21713: 340,
    setTimeout(fn, delay) {
      const id = ++serial;
      timers.set(id, { fn, delay });
      return id;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
  });
  for (const name of [
    "renderLockStatus",
    "renderControls",
    "renderBattleGridCards",
    "decorateBattleRanks",
    "decorateRoundItemLocks",
    "renderBattleRankPreviewV21721",
    "applyHeldDisplayScoresV21732",
    "restoreHeldScoreElementsV21732",
    "updateHeaderStats",
    "renderChart",
    "renderDashboard",
    "updateResizerUI",
    "renderWelcomePage",
    "updateWelcomeTrackIfNeeded",
  ])
    c[name] = () => calls.push(name);
  vm.runInContext(readFileSync(path, "utf8"), c);
  return {
    c,
    calls,
    timers,
    fire() {
      const [id, t] = timers.entries().next().value;
      timers.delete(id);
      t.fn();
    },
  };
}
test("render ownership module exists", () =>
  assert.ok(existsSync(path), "single rendering owner missing"));
test("full refresh renders each page once in the established order", () => {
  const { c, calls } = harness();
  c.renderAll();
  assert.deepEqual(calls, [
    "renderLockStatus",
    "renderControls",
    "applyHeldDisplayScoresV21732",
    "renderBattleGridCards",
    "decorateBattleRanks",
    "decorateRoundItemLocks",
    "renderBattleRankPreviewV21721",
    "applyHeldDisplayScoresV21732",
    "restoreHeldScoreElementsV21732",
    "updateHeaderStats",
    "renderChart",
    "renderDashboard",
    "updateResizerUI",
    "renderWelcomePage",
    "updateWelcomeTrackIfNeeded",
  ]);
});
test("attack keeps old cards until 340ms and coalesces targets", () => {
  const { c, calls, timers, fire } = harness();
  c.attackRenderGateV21713 = true;
  c.renderAll("first");
  c.attackRenderGateV21713 = true;
  c.renderAll("last");
  assert.equal(timers.size, 1);
  assert.equal([...timers.values()][0].delay, 340);
  assert.deepEqual(calls, []);
  c.renderGrid();
  assert.ok(!calls.includes("renderBattleGridCards"));
  assert.ok(calls.includes("renderBattleRankPreviewV21721"));
  calls.length = 0;
  fire();
  assert.ok(calls.includes("renderBattleGridCards"));
  assert.equal(c.attackRenderFlushingV21713, false);
  assert.equal(c.pendingRenderArgsV21713, null);
});
test("attack callback resets flushing even when renderer throws", () => {
  const { c, fire } = harness();
  c.renderControls = () => {
    throw Error("render failed");
  };
  c.attackRenderGateV21713 = true;
  c.renderAll();
  assert.throws(fire, /render failed/);
  assert.equal(c.attackRenderFlushingV21713, false);
  assert.equal(c.pendingRenderArgsV21713, null);
});
test("FLIP merges grid requests at 810ms and preserves held-score outer phase", () => {
  const { c, calls, timers, fire } = harness();
  c.roundStateFlipBusyV21726 = true;
  c.renderGrid();
  c.renderGrid();
  assert.equal(timers.size, 1);
  assert.equal([...timers.values()][0].delay, 810);
  assert.ok(!calls.includes("renderBattleGridCards"));
  assert.equal(
    calls.filter((x) => x === "restoreHeldScoreElementsV21732").length,
    2,
  );
  calls.length = 0;
  fire();
  assert.deepEqual(calls, [
    "renderBattleGridCards",
    "decorateBattleRanks",
    "decorateRoundItemLocks",
    "renderBattleRankPreviewV21721",
  ]);
});
test("attack gate also applies to delayed FLIP callback", () => {
  const { c, calls, fire } = harness();
  c.roundStateFlipBusyV21726 = true;
  c.renderGrid();
  c.attackRenderGateV21713 = true;
  calls.length = 0;
  fire();
  assert.deepEqual(calls, ["renderBattleRankPreviewV21721"]);
});
test("only non-answering refresh clears item reorder suppression", () => {
  const { c } = harness();
  c.renderGrid();
  assert.equal(c.v213SuppressReorderAnimation, true);
  c.state.evaluated = true;
  c.renderGrid();
  assert.equal(c.v213SuppressReorderAnimation, false);
});
