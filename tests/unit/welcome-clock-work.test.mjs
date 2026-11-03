import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
const source = readFileSync("src/runtime/ui/navigation-and-clock.js", "utf8");
test("clock refreshes header while hidden, without rebuilding hidden welcome UI", () => {
  let headers = 0,
    renders = 0;
  const ctx = {
    window: {},
    document: { getElementById: () => null },
    updateHeaderStats: () => headers++,
    DesktopUI: { renderWelcome: () => renders++ },
  };
  vm.createContext(ctx);
  vm.runInContext(source, ctx);
  vm.runInContext("currentView='battle';updateWelcomeClock()", ctx);
  assert.equal(headers, 1);
  assert.equal(renders, 0);
  vm.runInContext("currentView='welcome';updateWelcomeClock()", ctx);
  assert.equal(headers, 2);
  assert.equal(renders, 1);
});
