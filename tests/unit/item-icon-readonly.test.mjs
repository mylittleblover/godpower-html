import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
test("rendering item icons never renormalizes classroom inventories and reuses safe source encoding", () => {
  let normalizations = 0,
    sourceEscapes = 0;
  const ctx = {
    state: {
      itemGlobal: { customIcons: { coin: "data:image/png;base64,YQ==" } },
    },
    ensureItemState: () => normalizations++,
    ITEM_DEFS: { coin: { name: "金币", icon: "💰" } },
    Reliability: {
      safeImage: (v) =>
        typeof v === "string" && v.startsWith("data:image/png;base64,")
          ? v
          : "",
    },
    STORAGE: { getJSON: () => ({}) },
    escapeHtml: (v) => {
      if (String(v).startsWith("data:")) sourceEscapes++;
      return String(v).replaceAll('"', "&quot;");
    },
  };
  vm.runInNewContext(
    readFileSync("src/runtime/picker/classroom-tools.js", "utf8").split(
      "function setPickerInfoTab",
    )[0],
    ctx,
  );
  normalizations = 0;
  for (let i = 0; i < 20; i++)
    assert.match(ctx.itemVisual("coin", "slot-" + i), /YQ==/);
  assert.equal(
    normalizations,
    0,
    "pure display must not rewrite every inventory",
  );
  assert.equal(sourceEscapes, 1);
  ctx.state.itemGlobal.customIcons.coin = "data:image/png;base64,Yg==";
  assert.match(ctx.itemVisual("coin"), /Yg==/);
  assert.equal(sourceEscapes, 2);
  assert.equal(ctx.itemIconDataUrl("coin"), "data:image/png;base64,Yg==");
  assert.equal(normalizations, 0);
});
