import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { parseSourceBlocks } from "../../scripts/source-manifest.mjs";
import {
  scanCssBlocks,
  scanDeclarations,
  removeEmptyStyleRules,
  mandatorySelectorClasses,
} from "../../scripts/css-source.mjs";

test("grouped sources remain one execution unit with ordered immutable provenance", () => {
  const blocks = parseSourceBlocks(
    '<script id="core">@@SOURCE:a.js@@@@SOURCE:b.js@@</script><style>@@SOURCE:c.css@@</style>',
  );
  assert.deepEqual(
    blocks.map((b) => b.path),
    ["a.js", "b.js", "c.css"],
  );
  assert.equal(blocks[0].executionGroup, blocks[1].executionGroup);
  assert.equal(blocks[0].attributes, ' id="core"');
  assert.equal(blocks[2].executionGroup, undefined);
  assert.throws(
    () => parseSourceBlocks("<script>@@SOURCE:a.js@@evil()</script>"),
    /Mixed source/,
  );
});

test("CSS source scanner retains conditional blocks and quoted braces, comments and URL semicolons", () => {
  const s =
    '/* header */ .a {content:"a;{}/* literal */";background:url("data:a;b");color:red} @media (width > 1px){.a{color:blue}} .b\\{x {--Case:{x:y;};}';
  const blocks = scanCssBlocks(s);
  assert.equal(blocks.length, 3);
  assert.equal(blocks[0].prelude, ".a");
  assert.ok(blocks[1].prelude.startsWith("@media"));
  const decls = scanDeclarations(blocks[0].body);
  assert.deepEqual(
    decls.map((d) => [d.property, d.value]),
    [
      ["content", '"a;{}/* literal */"'],
      ["background", 'url("data:a;b")'],
      ["color", "red"],
    ],
  );
  assert.equal(scanDeclarations(blocks[2].body)[0].property, "--Case");
  assert.throws(() => scanCssBlocks(".a{color:red"), /Unclosed/);
});

test("all numbered source files are retired and all replacement owners are included in the build", () => {
  assert.equal(existsSync("src/script"), false);
  assert.equal(existsSync("src/style"), false);
  const map = JSON.parse(
    readFileSync("artifacts/cleanup-3.0.60/source-map.json", "utf8"),
  );
  const blocks = JSON.parse(readFileSync("src/manifest.json", "utf8")).blocks;
  const sources = new Set(blocks.map((b) => b.path));
  const relocations = JSON.parse(
    readFileSync("src/source-relocations.json", "utf8"),
  );
  const retirements = JSON.parse(
    readFileSync("src/source-retirements.json", "utf8"),
  );
  for (const row of map) {
    let path = row.to;
    const visited = new Set();
    while (relocations[path]) {
      assert.ok(!visited.has(path), "Cyclic source relocation: " + path);
      visited.add(path);
      assert.equal(
        existsSync("src/" + path),
        false,
        "Retired source must be absent",
      );
      path = relocations[path];
    }
    if (retirements[path]) {
      const receipt = retirements[path];
      assert.equal(existsSync("src/" + path), false);
      assert.ok(
        receipt.reason && receipt.evidence && existsSync(receipt.evidence),
      );
      assert.ok(receipt.owners.length);
      for (const owner of receipt.owners)
        assert.ok(sources.has(owner) && existsSync("src/" + owner));
      continue;
    }
    assert.ok(sources.has(path), path);
    assert.ok(existsSync("src/" + path), path);
  }
  assert.equal(map.filter((row) => row.from === "script/00.js").length, 55);
  assert.equal(new Set(map.map((row) => row.from)).size, 66);
});

test("empty rule cleanup preserves keyframes, layers and quoted declarations", () => {
  const input =
    '.empty {} @media (width > 1px) {.nested {} .live {content:"{}"}} @keyframes hold {from {} to {opacity:1}} @layer reserved {}';
  const result = removeEmptyStyleRules(input);
  assert.ok(!result.includes(".empty"));
  assert.ok(!result.includes(".nested"));
  assert.ok(result.includes('.live {content:"{}"}'));
  assert.ok(result.includes("@keyframes hold {from {} to {opacity:1}}"));
  assert.ok(result.includes("@layer reserved {}"));
});

test("empty conditional scopes can be removed without dropping layer or keyframe semantics", () => {
  const source =
    "@media (width>1px){/* old scope */ .gone {}} @supports (display:grid){@media (width>2px){}} @layer reserved {} @keyframes still {from {} to {opacity:1}}";
  const result = removeEmptyStyleRules(source, { dropEmptyConditions: true });
  assert.ok(!result.includes("@media"));
  assert.ok(!result.includes("@supports"));
  assert.ok(result.includes("@layer reserved {}"));
  assert.ok(result.includes("@keyframes still {from {} to {opacity:1}}"));
});

test("retired selectors only match mandatory classes outside pseudo functions", () => {
  assert.deepEqual(
    mandatorySelectorClasses('.group:not([data-mode="single"]) .old:hover'),
    ["group", "old"],
  );
  assert.deepEqual(mandatorySelectorClasses(":not(.old) :is(.old,.live)"), []);
  assert.deepEqual(mandatorySelectorClasses('[data-label=".old"] .live'), [
    "live",
  ]);
  assert.deepEqual(mandatorySelectorClasses(".old\\:variant .live"), ["live"]);
});

test("all shipped CSS has a single canonical styles root", () => {
  const manifest = JSON.parse(readFileSync("src/manifest.json"));
  assert.ok(
    manifest.blocks
      .filter((b) => b.type === "style")
      .every((b) => b.path.startsWith("styles/")),
  );
  const moves = JSON.parse(
    readFileSync(
      "artifacts/css-consolidation-3.0.66/style-directory-moves.json",
    ),
  );
  for (const [oldPath, newPath] of Object.entries(moves.moves)) {
    assert.equal(existsSync("src/" + oldPath), false);
    assert.ok(existsSync("src/" + newPath));
  }
});
