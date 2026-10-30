import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { scanCssBlocks, scanDeclarations } from "../../scripts/css-source.mjs";
const baseline = "48c199f";
test("every CSS deletion has a later unconditional identical selector/property/value witness", () => {
  const report = JSON.parse(
    readFileSync("artifacts/cleanup-3.0.60/css-removals.json", "utf8"),
  );
  const manifest = JSON.parse(
    execFileSync("git", ["show", baseline + ":src/manifest.json"], {
      encoding: "utf8",
    }),
  );
  const order = new Map(manifest.blocks.map((b, i) => ["src/" + b.path, i]));
  const cache = new Map();
  function rules(path) {
    if (!cache.has(path))
      cache.set(
        path,
        scanCssBlocks(
          execFileSync("git", ["show", baseline + ":" + path], {
            encoding: "utf8",
            maxBuffer: 1e6,
          }),
        ),
      );
    return cache.get(path);
  }
  assert.equal(report.removed.length, 33);
  for (const row of report.removed) {
    const earlier = rules(row.path).find(
      (rule) => rule.line === row.line && rule.prelude === row.selector,
    );
    const later = rules(row.coveredBy.path).find(
      (rule) =>
        rule.line === row.coveredBy.line && rule.prelude === row.selector,
    );
    assert.ok(earlier && later, JSON.stringify(row));
    assert.ok(
      !earlier.prelude.startsWith("@") && !later.prelude.startsWith("@"),
    );
    for (const rule of [earlier, later])
      assert.ok(
        scanDeclarations(rule.body).some(
          (d) => d.property === row.property && d.value === row.value,
        ),
        row.selector + " " + row.property,
      );
    assert.ok(
      order.get(row.coveredBy.path) > order.get(row.path) ||
        (row.coveredBy.path === row.path && later.start >= earlier.start),
    );
  }
});
