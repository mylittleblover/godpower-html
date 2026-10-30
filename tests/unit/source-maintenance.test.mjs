import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { parseSourceBlocks } from "../../scripts/source-manifest.mjs";
import { scanCssBlocks, scanDeclarations } from "../../scripts/css-source.mjs";

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
  for (const row of map) {
    assert.ok(sources.has(row.to), row.to);
    assert.ok(existsSync("src/" + row.to), row.to);
  }
  assert.equal(map.filter((row) => row.from === "script/00.js").length, 55);
  assert.equal(new Set(map.map((row) => row.from)).size, 66);
});
