import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
import { saveCore, legacy } from "../fixtures/save-v2.mjs";
async function fixture() {
  const { context, migration } = saveCore();
  vm.runInContext(readFileSync("src/domain/save-roster.js", "utf8"), context);
  const document = (
    await migration.preview({ rawText: JSON.stringify(legacy()) })
  ).documents[0];
  return { roster: context.SaveRoster, document };
}
test("visual assignment moves stable students between groups without merging equal names", async () => {
  const { roster, document } = await fixture();
  const [one, two, three] = document.roster.students;
  const next = roster.assign(document, "group-two", [
    one.studentUid,
    three.studentUid,
  ]);
  assert.equal(document.roster.assignments.length, 3);
  assert.equal(
    next.roster.assignments.find((a) => a.studentUid === one.studentUid)
      .groupUid,
    "group-two",
  );
  assert.deepEqual(Array.from(next.match.groups[0].members), [two.legacyLabel]);
  assert.deepEqual(Array.from(next.match.groups[1].members), [
    one.legacyLabel,
    three.legacyLabel,
  ]);
  assert.equal(next.roster.students.length, 3);
});
test("editing a student updates current labels while historical snapshots remain unchanged", async () => {
  const { roster, document } = await fixture();
  document.match.history = [
    { groups: structuredClone(document.match.groups), desc: "之前" },
  ];
  const old = JSON.stringify(document.match.history);
  const student = document.roster.students[0];
  const next = roster.editStudent(document, student.studentUid, {
    displayName: "新名字",
    number: "18",
  });
  assert.equal(next.match.groups[0].members[0], "18 新名字");
  assert.equal(JSON.stringify(next.match.history), old);
  assert.equal(next.roster.students[0].studentUid, student.studentUid);
});
test("adding an unassigned student and assigning avatars preserve scores, inventory and identities", async () => {
  const { roster, document } = await fixture();
  const added = roster.addStudent(document, {
    displayName: "新同学",
    number: "19",
  });
  assert.equal(added.roster.students.length, 4);
  assert.equal(added.roster.assignments.length, 3);
  const id = "asset-" + "a".repeat(64);
  added.assetReferences.push(id);
  const next = roster.setAvatar(
    added,
    "student",
    added.roster.students[3].studentUid,
    id,
  );
  assert.equal(next.roster.students[3].avatarResourceId, id);
  assert.equal(JSON.stringify(next.match), JSON.stringify(document.match));
  assert.throws(
    () =>
      roster.setAvatar(
        added,
        "student",
        added.roster.students[3].studentUid,
        "asset-" + "b".repeat(64),
      ),
    /asset|资源/,
  );
});
test("invalid student references, duplicated selection and blank names cannot change roster data", async () => {
  const { roster, document } = await fixture();
  const before = JSON.stringify(document);
  const id = document.roster.students[0].studentUid;
  assert.throws(() =>
    roster.assign(document, "group-one", ["student-missing"]),
  );
  assert.throws(() => roster.assign(document, "group-one", [id, id]));
  assert.throws(() => roster.editStudent(document, id, { displayName: " " }));
  assert.equal(JSON.stringify(document), before);
});
