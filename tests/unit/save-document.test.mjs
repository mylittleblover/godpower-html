import test from "node:test";
import assert from "node:assert/strict";
import { saveCore, legacy } from "../fixtures/save-v2.mjs";
test("legacy schemaVersion 2 must not be mistaken for a new SaveDocument", () => {
  const { schema } = saveCore();
  assert.throws(() => schema.validateV2(legacy()), /format|kind/);
});
test("new save validates stable identities, revisions and roster references", async () => {
  const { schema, migration } = saveCore();
  const p = await migration.preview({
    rawText: JSON.stringify(legacy()),
    name: "测试存档",
  });
  const d = p.documents[0];
  assert.equal(schema.validateV2(d).kind, "godpower.save");
  assert.equal(d.roster.students.length, 3);
  assert.equal(d.roster.groups.length, 2);
  assert.equal(new Set(d.roster.students.map((s) => s.studentUid)).size, 3);
  const bad = structuredClone(d);
  bad.roster.assignments[0].studentUid = "student-missing";
  assert.throws(() => schema.validateV2(bad), /student|学生/);
});
test("negative revisions, duplicate identities and unsafe scores are rejected", async () => {
  const { schema, migration } = saveCore();
  const d = (await migration.preview({ rawText: JSON.stringify(legacy()) }))
    .documents[0];
  for (const change of [
    (x) => (x.revision = -1),
    (x) => (x.match.groups[0].score = "2"),
    (x) => (x.match.groups[0].score = null),
    (x) => x.roster.students.push(x.roster.students[0]),
    (x) => (x.match.groups[0].score = Number.MAX_SAFE_INTEGER + 1),
  ]) {
    const bad = structuredClone(d);
    change(bad);
    assert.throws(() => schema.validateV2(bad));
  }
});

test("malformed canonical archives and roster/match metadata are rejected before activation", async () => {
  const { schema, migration } = saveCore();
  const doc = (await migration.preview({ rawText: JSON.stringify(legacy()) }))
    .documents[0];
  for (const mutate of [
    (d) => delete d.archives,
    (d) => (d.archives = {}),
    (d) => (d.archives = [null]),
    (d) => (d.archives = [{ groups: {} }]),
    (d) => delete d.roster.revision,
    (d) => (d.match.season = null),
    (d) => (d.match.round = []),
    (d) => (d.match.picker = "bad"),
    (d) => (d.achievements = null),
    (d) => (d.perSaveOptions = []),
    (d) =>
      (d.match.pendingSettlement = {
        seasonId: d.match.season.seasonId,
        recordId: 999,
      }),
    (d) => {
      d.archives = [{ seasonId: d.match.season.seasonId }];
      d.match.pendingSettlement = { seasonId: d.match.season.seasonId };
    },
  ]) {
    const bad = structuredClone(doc);
    mutate(bad);
    assert.throws(() => schema.validateV2(bad));
  }
});
