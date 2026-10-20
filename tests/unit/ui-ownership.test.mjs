import assert from "node:assert/strict";
import test from "node:test";
import { createUiOwnershipReport } from "../../scripts/ui-ownership.mjs";

test("UI ownership report follows the build manifest and records the five default pages", async () => {
  const report = await createUiOwnershipReport();
  assert.ok(report.manifestBlocks >= 125);
  assert.deepEqual(report.pages, [
    "view-welcome",
    "view-battle",
    "view-archives",
    "view-history",
    "view-settings",
  ]);
  assert.equal(report.duplicateStaticIds.length, 0);
  assert.equal(
    report.scripts.length + report.styles.length,
    report.manifestBlocks,
  );
  assert.ok(report.scripts.every((block) => block.lifecycleCalls));
  assert.ok(report.styles.every((block) => block.selectorParserNote));
  assert.ok(report.inlineHandlerCount > 0);
  assert.ok(
    report.caveats.some((note) => note.includes("not automatically redundant")),
  );
});

test("manifest order and file byte evidence are deterministic", async () => {
  const first = await createUiOwnershipReport();
  const second = await createUiOwnershipReport();
  assert.deepEqual(
    first.scripts.map(({ order, path }) => ({ order, path })),
    second.scripts.map(({ order, path }) => ({ order, path })),
  );
  assert.deepEqual(
    first.styles.map(({ order, path, bytes }) => ({ order, path, bytes })),
    second.styles.map(({ order, path, bytes }) => ({ order, path, bytes })),
  );
});
