import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
import { saveCore } from "../fixtures/save-v2.mjs";
import { legacyRoster as input } from "../fixtures/legacy-roster.mjs";

function core() {
  const c = saveCore();
  for (const f of [
    "domain/classroom-roster.js",
    "application/save-roster-migration.js",
  ])
    vm.runInContext(readFileSync("src/" + f, "utf8"), c.context);
  return c;
}
test("legacy roster converts actual assignments and unowned class without inventing matches", async () => {
  const { context, schema } = core();
  const rawText = JSON.stringify(input()),
    preview = await context.ClassroomRosterMigration.preview({ rawText });
  assert.equal(preview.documents.length, 3);
  assert.equal(preview.sourceText, rawText);
  const ids = new Set();
  for (const doc of preview.documents) {
    schema.validateV2(doc);
    ids.add(doc.saveId);
    assert.equal(doc.match.history.length, 0);
    assert.ok(doc.match.groups.every((g) => g.score === 0));
    assert.equal(doc.migration.sourceType, "legacy-roster-only");
  }
  assert.equal(ids.size, 3);
  const first = preview.documents[0];
  assert.equal(first.roster.students.length, 2);
  assert.equal(first.roster.students[0].studentUid, "student-one");
  assert.equal(first.roster.students[1].studentUid, "student-two");
  assert.equal(first.roster.assignments.length, 1);
  assert.equal(preview.documents[1].roster.assignments.length, 0);
  const again = await context.ClassroomRosterMigration.preview({ rawText });
  assert.deepEqual(
    JSON.parse(JSON.stringify(again)),
    JSON.parse(JSON.stringify(preview)),
  );
  assert.equal(JSON.stringify(input()), rawText);
});
test("legacy avatar bytes are hashed and re-owned only with matching classroom metadata", async () => {
  const { context } = core(),
    raw = input();
  raw.rosterData.students[0].avatarResourceId = "resource-old";
  const bytes = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
    "base64",
  );
  const source = {
    resourceId: "resource-old",
    classroomId: "classroom-one",
    subjectId: "student-avatar",
    mimeType: "image/png",
    blob: new Blob([bytes]),
  };
  const p = await context.ClassroomRosterMigration.preview({
    rawText: JSON.stringify(raw),
    readAsset: async () => source,
  });
  assert.equal(p.assets.length, 1);
  assert.ok(
    p.documents[0].roster.students[0].avatarResourceId.startsWith("asset-"),
  );
  const bad = await context.ClassroomRosterMigration.preview({
    rawText: JSON.stringify(raw),
    readAsset: async () => ({ ...source, classroomId: "classroom-two" }),
  });
  assert.equal(bad.assets.length, 0);
  assert.equal(bad.documents[0].roster.students[0].avatarResourceId, null);
  assert.ok(bad.warnings.some((w) => w.code === "LEGACY_AVATAR_UNAVAILABLE"));
});
