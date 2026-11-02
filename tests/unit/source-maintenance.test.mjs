import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { parseSourceBlocks } from "../../scripts/source-manifest.mjs";
import {
  scanCssBlocks,
  scanDeclarations,
  removeEmptyStyleRules,
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
