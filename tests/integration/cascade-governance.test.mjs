import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { format } from "prettier";
import {
  scanDeclarations,
  scanCssBlocks,
  removeEmptyStyleRules,
} from "../../scripts/css-source.mjs";
const report = JSON.parse(
  readFileSync("artifacts/semantic-governance-3.0.65/css-removals.json"),
);
const source = (path) =>
  execFileSync("git", ["show", report.baseline + ":" + path], {
    encoding: "utf8",
    maxBuffer: 2e6,
  });
const parsed = new Map();
function declarationAt(path, start) {
  if (!parsed.has(path)) {
    const rows = [];
    function visit(text, offset = 0, conditions = []) {
      for (const rule of scanCssBlocks(text)) {
        if (/^@(media|supports|container)\b/.test(rule.prelude)) {
          visit(rule.body, offset + rule.open + 1, [
            ...conditions,
            rule.prelude,
          ]);
          continue;
        }
        if (rule.prelude.startsWith("@")) continue;
        for (const d of scanDeclarations(rule.body))
          rows.push({
            ...d,
            start: offset + rule.open + 1 + d.start,
            selector: rule.prelude,
            conditions,
          });
      }
    }
    visit(source(path));
    parsed.set(path, rows);
  }
  return parsed.get(path).find((row) => row.start === start);
}
test("3.0.65 checkpoint CSS deletions have equally scoped witnesses and no stronger priority", async () => {
  const manifest = JSON.parse(
    execFileSync("git", ["show", report.baseline + ":src/manifest.json"], {
      encoding: "utf8",
    }),
  );
  const order = new Map(manifest.blocks.map((b, i) => ["src/" + b.path, i]));
  assert.equal(report.removed.length, 77);
  for (const row of report.removed) {
    const next = row.coveredBy;
    const earlier = declarationAt(row.path, row.start),
      later = declarationAt(next.path, next.start);
    assert.ok(earlier && later);
    assert.equal(earlier.selector, later.selector);
    assert.equal(earlier.property, later.property);
    assert.equal(later.value, next.value);
    assert.deepEqual(earlier.conditions, later.conditions);
    assert.ok(
      order.get(next.path) > order.get(row.path) ||
        (next.path === row.path && next.start > row.start),
    );
    assert.deepEqual(next.conditions, row.conditions);
    assert.ok(
      Number(/!important\s*$/.test(next.value)) >=
        Number(/!important\s*$/.test(row.value)),
    );
    assert.ok(
      scanDeclarations(source(row.path).slice(row.start, row.end)).some(
        (d) => d.property === row.property && d.value === row.value,
      ),
    );
    assert.ok(
      source(next.path)
        .slice(next.start)
        .trimStart()
        .startsWith(row.property + ":"),
    );
  }
  for (const path of new Set(report.removed.map((row) => row.path))) {
    let expected = source(path);
    for (const row of report.removed
      .filter((row) => row.path === path)
      .sort((a, b) => b.start - a.start))
      expected = expected.slice(0, row.start) + expected.slice(row.end);
    assert.equal(
      await format(
        execFileSync("git", ["show", "fc81d1f:" + path], {
          encoding: "utf8",
          maxBuffer: 2e6,
        }),
        { parser: "css" },
      ),
      await format(removeEmptyStyleRules(expected), { parser: "css" }),
      path,
    );
  }
});
test("about renderer has one declaration, no override chain, and retains non-view code", async () => {
  const manifest = JSON.parse(readFileSync("src/manifest.json"));
  let declarations = 0;
  for (const b of manifest.blocks.filter((b) => b.type === "script")) {
    const text = readFileSync("src/" + b.path, "utf8");
    declarations += (text.match(/function renderAbout\(/g) || []).length;
    assert.ok(!/\brenderAbout\s*=/.test(text), b.path);
  }
  assert.equal(declarations, 1);
  const removal = JSON.parse(
    readFileSync("artifacts/semantic-governance-3.0.65/about-removals.json"),
  );
  for (const row of removal.proof) {
    if (row.path === "src/runtime/ui/about-copy.js") continue;
    let expected = source(row.path);
    for (const edit of row.removals.toSorted((a, b) => b.start - a.start)) {
      assert.equal(expected.slice(edit.start, edit.end), edit.source);
      expected =
        expected.slice(0, edit.start) +
        edit.replacement +
        expected.slice(edit.end);
    }
    assert.equal(
      await format(readFileSync(row.path, "utf8"), { parser: "babel" }),
      await format(expected, { parser: "babel" }),
      row.path,
    );
  }
});
