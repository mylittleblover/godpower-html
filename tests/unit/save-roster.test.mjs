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
  return { roster: context.SaveRoster, document, context };
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

test("adding a student directly to a group preserves its existing members and rejects stale targets", async () => {
  const { roster, document } = await fixture();
  const before = JSON.stringify(document);
  const next = roster.addStudent(document, {
    displayName: "新同学",
    number: "20",
    groupUid: "group-two",
  });
  const added = next.roster.students.at(-1);
  assert.equal(
    next.roster.assignments.find((a) => a.studentUid === added.studentUid)
      ?.groupUid,
    "group-two",
  );
  assert.deepEqual(Array.from(next.match.groups[1].members), [
    "03 同名",
    "20 新同学",
  ]);
  assert.equal(JSON.stringify(document), before);
  assert.throws(
    () =>
      roster.addStudent(document, { displayName: "甲", groupUid: "missing" }),
    /小组不存在/,
  );
});
test("adding and editing a group leaves original scores, inventory, identities and history intact", async () => {
  const { roster, document } = await fixture();
  document.match.history = [
    { groups: structuredClone(document.match.groups), desc: "之前" },
  ];
  const old = JSON.stringify(document);
  const next = roster.addGroup(document, { name: "新小组", color: "#aabbcc" });
  const group = next.roster.groups.at(-1),
    match = next.match.groups.at(-1);
  assert.equal(group.groupUid, match.groupUid);
  assert.equal(match.score, 0);
  assert.equal(match.name, "新小组");
  assert.equal(new Set(next.match.groups.map((g) => g.id)).size, 3);
  assert.deepEqual(next.match.groups.slice(0, 2), document.match.groups);
  const renamed = roster.editGroup(next, group.groupUid, {
    name: "改名",
    color: "#ffeeaa",
  });
  assert.equal(renamed.roster.groups.at(-1).name, "改名");
  assert.equal(renamed.match.groups.at(-1).color, "#ffeeaa");
  assert.equal(
    JSON.stringify(renamed.match.history),
    JSON.stringify(document.match.history),
  );
  assert.equal(JSON.stringify(document), old);
  assert.throws(
    () => roster.editGroup(next, "missing", { name: "甲" }),
    /小组不存在/,
  );
  assert.throws(
    () => roster.addGroup(document, { name: " ", color: "#aabbcc" }),
    /小组名称/,
  );
  assert.throws(
    () => roster.addGroup(document, { name: "甲", color: "url(x)" }),
    /颜色/,
  );
});

test("new groups do not reuse retired numeric IDs still referenced by history", async () => {
  const { roster, document, context } = await fixture();
  vm.runInContext("Date.now = () => 3", context);
  document.match.history = [
    {
      groups: [{ id: 3, groupUid: "retired-group", score: 0, members: [] }],
      desc: "旧组",
    },
  ];
  const next = roster.addGroup(document, { name: "新组", color: "#123456" });
  assert.equal(next.match.groups.at(-1).id, 4);
});
test("editing a student's group moves only that identity and supports unassigned", async () => {
  const { roster, document } = await fixture();
  const id = document.roster.students[0].studentUid;
  const moved = roster.editStudent(document, id, {
    displayName: "甲",
    groupUid: "group-two",
  });
  assert.equal(
    moved.roster.assignments.find((a) => a.studentUid === id).groupUid,
    "group-two",
  );
  assert.equal(moved.match.groups[0].members.length, 1);
  assert.equal(moved.match.groups[1].members.length, 2);
  const unassigned = roster.editStudent(moved, id, {
    displayName: "甲",
    groupUid: null,
  });
  assert.equal(
    unassigned.roster.assignments.some((a) => a.studentUid === id),
    false,
  );
  assert.equal(unassigned.match.groups[1].members.length, 1);
});

test("editing a student without changing groups preserves the existing member order", async () => {
  const { roster, document } = await fixture();
  const student = document.roster.students[0];
  const next = roster.editStudent(document, student.studentUid, {
    displayName: "新姓名",
    groupUid: "group-one",
  });
  assert.deepEqual(Array.from(next.match.groups[0].members), [
    "01 新姓名",
    "02 同名",
  ]);
});
