import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { existsSync, readFileSync } from "node:fs";
function api() {
  const c = vm.createContext({});
  if (existsSync("src/domain/items/round-use.js"))
    vm.runInContext(readFileSync("src/domain/items/round-use.js", "utf8"), c);
  const module = vm.runInContext(
    "typeof ItemRoundUse === 'undefined' ? null : ItemRoundUse",
    c,
  );
  assert.ok(module, "instance-bound round item policy must exist");
  return module;
}
test("round continuation belongs to the same physical item, including flower charges", () => {
  const f = api(),
    item = {
      key: "fire_flower",
      itemInstanceId: "item-instance-a",
      charges: 2,
    };
  const g = { itemUsedThisRound: false };
  assert.equal(f.canContinue(g, item), false);
  f.mark(g, item);
  assert.equal(f.canContinue(g, item), true);
  assert.equal(
    f.canContinue(g, { ...item, itemInstanceId: "item-instance-b" }),
    false,
  );
  assert.equal(f.canContinue(g, { ...item, charges: 0 }), false);
  assert.equal(f.canContinue({ ...g, roundItemInstanceId: "" }, item), false);
  f.reset(g);
  assert.equal(g.itemUsedThisRound, false);
  assert.equal(f.canContinue(g, item), false);
});
test("no instance identity is guessed from a same-name or old key-only lock", () => {
  const f = api();
  assert.equal(
    f.canContinue(
      { itemUsedThisRound: true, roundItemContinuationKeyV218: "triple_green" },
      { key: "triple_green", charges: 2 },
    ),
    false,
  );
});
