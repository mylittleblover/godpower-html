import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { execFileSync } from "node:child_process";
import { createComponentInventory } from "../../scripts/component-inventory.mjs";
test("component catalog includes every shipped CSS class, token and animation with source owners", async () => {
  const generated = await createComponentInventory();
  const shipped = vm.runInNewContext(
    readFileSync("src/ui/component-catalog.js", "utf8") +
      "\nGodPowerComponentCatalog",
  );
  assert.deepEqual(JSON.parse(JSON.stringify(shipped)), generated);
  // A raw minimum count rewards retaining dead CSS. Instead account for every
  // original class, and require per-owner deletion evidence for every retirement.
  const proof = JSON.parse(
    readFileSync(
      "artifacts/css-consolidation-3.0.66/class-removals.json",
      "utf8",
    ),
  );
  const baseline = vm.runInNewContext(
    execFileSync(
      "git",
      ["show", proof.baseline + ":src/ui/component-catalog.js"],
      { encoding: "utf8", maxBuffer: 2e6 },
    ) + "\nGodPowerComponentCatalog",
  );
  const missing = baseline.classes.filter(
    (item) => !generated.classes.some((current) => current.name === item.name),
  );
  const retirements = JSON.parse(
    readFileSync("src/source-retirements.json", "utf8"),
  );
  const laterRetired = Array.from(missing).filter((item) =>
    item.sources.every((path) => {
      const moves = JSON.parse(
        readFileSync("src/source-relocations.json", "utf8"),
      );
      let next = path.slice(4);
      const seen = new Set();
      while (moves[next]) {
        assert.ok(!seen.has(next));
        seen.add(next);
        next = moves[next];
      }
      const receipt = retirements[next];
      return (
        receipt &&
        receipt.owners.every((owner) => readFileSync("src/" + owner).length) &&
        readFileSync(receipt.evidence).length
      );
    }),
  );
  assert.deepEqual(
    Array.from(missing, (item) => item.name).sort(),
    [
      ...new Set([
        ...proof.removed.map((item) => item.name),
        ...laterRetired.map((item) => item.name),
      ]),
    ].sort(),
  );
  const relocations = JSON.parse(readFileSync("src/source-relocations.json"));
  const currentOwner = (path) => {
    let next = path.slice(4);
    const seen = new Set();
    while (relocations[next]) {
      assert.ok(!seen.has(next));
      seen.add(next);
      next = relocations[next];
    }
    return "src/" + next;
  };
  for (const item of proof.removed)
    for (const path of item.sources) {
      const owner = item.proof.find(
        (row) => currentOwner(row.path) === currentOwner(path),
      );
      assert.ok(owner && owner.selectors.length, item.name + " in " + path);
      assert.ok(
        owner.selectors.every((selector) =>
          new RegExp("\\." + item.name + "(?![\\w-])").test(selector),
        ),
      );
    }
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
