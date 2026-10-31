import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { createComponentInventory } from "../../scripts/component-inventory.mjs";
test("component catalog includes every shipped CSS class, token and animation with source owners", async () => {
  const generated = await createComponentInventory();
  const shipped = vm.runInNewContext(
    readFileSync("src/ui/component-catalog.js", "utf8") +
      "\nGodPowerComponentCatalog",
  );
  assert.deepEqual(JSON.parse(JSON.stringify(shipped)), generated);
  assert.ok(generated.classes.length > 800);
  assert.ok(generated.tokens.length > 250);
  assert.ok(generated.animations.length > 50);
  for (const list of [
    generated.classes,
    generated.tokens,
    generated.animations,
  ])
    for (const item of list) {
      assert.ok(item.sources.length);
      for (const path of item.sources) assert.ok(readFileSync(path).length);
    }
});
test("component reference has no direct command, persistence or native authority", () => {
  const source = readFileSync("src/ui/component-library.js", "utf8");
  for (const forbidden of [
    "localStorage.",
    "indexedDB.",
    "runClassroomCommand(",
    "useItem(",
    "saveState(",
    "globalItemDraw(",
    "itemVisual(",
    "godpowerDesktop.",
    "fetch(",
    "eval(",
  ])
    assert.ok(!source.includes(forbidden), forbidden);
  assert.match(source, /mode: "closed"/);
  assert.match(source, /tree\.inert = true/);
});

test("preview scoping preserves var shorthand declarations and only rewrites root selectors", () => {
  const model = vm.runInNewContext(
    readFileSync("src/ui/component-preview-style.js", "utf8") +
      "\nComponentPreviewStyle",
  );
  const input =
    '/* :root */ :root,body{--x:root;content:":root"} @media (width > 1px){:root .x{background:var(--c,red)!important;background-image:none!important}}';
  const result = model.scope(input);
  assert.equal(
    result,
    '/* :root */ :host,body{--x:root;content:":root"} @media (width > 1px){:host .x{background:var(--c,red)!important;background-image:none!important}}',
  );
});
