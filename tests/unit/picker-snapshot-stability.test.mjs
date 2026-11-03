import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
const source = readFileSync("src/core/picker-bridge.js", "utf8");
function fixture() {
  let draws = 0;
  const ctx = {
    window: {},
    slotEngine: { isSpinning: false, chosenResult: null },
    state: { groups: [], picker: { mode: "individual" }, itemGlobal: {} },
    ClassroomFeedback: {
      getOptions: () => ({ pickEffects: true, slots: [1, 2], duration: 3600 }),
    },
    DesktopUI: {
      getPreferences: () => ({ motion: "full", systemMotion: false }),
    },
    document: { getElementById: () => null },
    matchMedia: () => ({ matches: false }),
    Math: Object.assign(Object.create(Math), {
      random: () => (++draws % 10) / 10,
    }),
    console,
  };
  ctx.globalThis = ctx;
  vm.runInNewContext(source, ctx);
  return { api: ctx.window.GodpowerPicker, ctx, draws: () => draws };
}
test("idle snapshots stay identical and never advance the random source", () => {
  const { api, draws } = fixture();
  const before = draws();
  const first = JSON.stringify(api.getSnapshot());
  for (let i = 0; i < 100; i++)
    assert.equal(JSON.stringify(api.getSnapshot()), first);
  assert.equal(draws(), before);
});
test("a new reveal cycle selects one style, snapshot polling retains it", () => {
  const { api, draws, ctx } = fixture();
  ctx.slotEngine.isSpinning = true;
  api.notify("rolling");
  const n = draws(),
    style = api.getSnapshot().effects.style;
  for (let i = 0; i < 100; i++)
    assert.equal(api.getSnapshot().effects.style, style);
  assert.equal(draws(), n);
  api.notify("rolling");
  assert.equal(draws(), n + 1);
});
