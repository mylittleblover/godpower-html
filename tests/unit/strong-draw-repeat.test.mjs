import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
test("obsolete per-group strong skips no longer suppress a subsequent draw while global cooldown remains", () => {
  const group = { id: 1 };
  const c = vm.createContext({
    state: { itemGlobal: {} },
    ensureItemState() {},
    ranking: () => [group],
    itemDropWeights: () => ({
      bullet: 10,
      power: 10,
      mega: 10,
      star: 10,
      lightning: 10,
      blooper: 10,
    }),
    itemExistsOnFieldV2172: () => false,
  });
  vm.runInContext(
    readFileSync("src/runtime/items/draw-throttle-legacy.js", "utf8").split(
      "/* 完整替换最终挑选器",
    )[0],
    c,
  );
  vm.runInContext(
    readFileSync("src/runtime/items/draw-session-throttle.js", "utf8").split(
      "/* 最终挑选器再次接管",
    )[0],
    c,
  );
  c.ensureDrawThrottleV2179().groupStrongSkip = { 1: 1 };
  for (const weights of [
    c.restrictedItemWeightsV2179(group).weights,
    c.sessionRestrictedWeightsV21710(group),
  ])
    for (const key of ["bullet", "power", "mega", "star"])
      assert.equal(
        weights[key],
        10,
        key + " must remain eligible despite the retired flag",
      );
  c.commitSessionDrawV21710(group, "star");
  for (const key of ["bullet", "power", "mega", "star"])
    assert.equal(c.sessionRestrictedWeightsV21710(group)[key], 10);
  c.commitSessionDrawV21710(group, "lightning");
  assert.equal(c.sessionRestrictedWeightsV21710(group).lightning, 0);
  c.ensureDrawSessionThrottleV21710().sessionNo += 5;
  assert.equal(c.sessionRestrictedWeightsV21710(group).lightning, 10);
});
