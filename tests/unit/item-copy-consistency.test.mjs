import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
test("all current item encyclopedia effects share canonical descriptions without star/mega examples", () => {
  const source = readFileSync("src/items/expansion-copy.js", "utf8");
  const keys = vm.runInNewContext(
    source.match(/const order = (\[[\s\S]*?\]);/)[1],
  );
  const ctx = {
    ITEM_DEFS: Object.fromEntries(
      keys.map((key) => [key, { desc: "canonical " + key }]),
    ),
    ITEM_KEYS: [],
    ITEM_ORDER_V283: [],
    ITEM_ORDER_V218: [],
    GROUP_ITEM_ORDER_V2182: [],
    GROUP_ITEM_DESC_V2182: {},
    ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715: {},
    ITEM_TIPS_V218: {},
    ITEM_FUNNY_COPY_V2184: {},
  };
  vm.runInNewContext(source, ctx);
  for (const key of keys) {
    assert.equal(ctx.GROUP_ITEM_DESC_V2182[key], ctx.ITEM_DEFS[key].desc);
    assert.equal(
      ctx.ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715[key],
      ctx.ITEM_DEFS[key].desc,
    );
  }
  for (const key of ["star", "mega"]) {
    assert.ok(!/例[:：]|例如|比如/.test(ctx.ITEM_DEFS[key].desc));
    assert.match(ctx.ITEM_DEFS[key].desc, /3 轮/);
    assert.match(ctx.ITEM_DEFS[key].desc, /×2/);
    assert.match(ctx.ITEM_DEFS[key].desc, /×3/);
  }
});
