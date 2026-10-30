import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";

const scope = vm.createContext({
  crypto: {
    randomUUID: (() => {
      let id = 0;
      return () => `uuid-${++id}`;
    })(),
  },
});
vm.runInContext(
  readFileSync("src/domain/identity.js", "utf8") +
    "\nglobalThis.api = StableIdentity",
  scope,
);

test("keeps existing group UIDs and assigns distinct stable UIDs to legacy groups", () => {
  const input = [{ id: 1 }, { id: 2, groupUid: "group-existing" }, { id: 3 }];
  const groups = scope.api.assignGroupUids(input);

  assert.deepEqual(
    groups.map((group) => group.groupUid),
    ["group-uuid-1", "group-existing", "group-uuid-2"],
  );
  assert.deepEqual(input, [
    { id: 1 },
    { id: 2, groupUid: "group-existing" },
    { id: 3 },
  ]);
  assert.deepEqual(
    scope.api.assignGroupUids(groups).map((group) => group.groupUid),
    groups.map((group) => group.groupUid),
  );
});

test("repairs duplicate and invalid group UIDs without changing group IDs", () => {
  let id = 0;
  const groups = scope.api.assignGroupUids(
    [
      { id: 11, groupUid: "duplicate" },
      { id: 12, groupUid: "duplicate" },
      { id: 13, groupUid: "" },
    ],
    () => `generated-${++id}`,
  );

  assert.deepEqual(
    groups.map((group) => group.id),
    [11, 12, 13],
  );
  assert.deepEqual(
    groups.map((group) => group.groupUid),
    ["duplicate", "generated-1", "generated-2"],
  );
  assert.equal(
    new Set(groups.map((group) => group.groupUid)).size,
    groups.length,
  );
});

test("rejects invalid identity factories instead of silently creating unstable IDs", () => {
  assert.throws(
    () => scope.api.assignGroupUids([{ id: 1 }], () => ""),
    /could not produce a unique group identity/i,
  );
});

test("generates distinct item instance IDs with the item namespace", () => {
  const first = scope.api.createItemInstanceId();
  const second = scope.api.createItemInstanceId();
  assert.match(first, /^item-/);
  assert.notEqual(first, second);
  assert.equal(scope.api.isValidItemInstanceId(first), true);
  assert.equal(scope.api.isValidItemInstanceId("group-123"), false);
});

test("fallback identity generation never consumes the gameplay random generator", () => {
  const isolated = vm.createContext({
    Math: {
      random() {
        throw Error("gameplay RNG must not be consumed");
      },
    },
  });
  vm.runInContext(
    readFileSync("src/domain/identity.js", "utf8") +
      "\nglobalThis.api=StableIdentity;",
    isolated,
  );
  const group = isolated.api.createGroupUid();
  const item = isolated.api.createItemInstanceId();
  assert.ok(group.startsWith("group-"));
  assert.ok(item.startsWith("item-"));
  assert.notEqual(isolated.api.createGroupUid(), group);
});

test("creates distinct user profile, classroom and student identities", () => {
  const userProfileId = scope.api.createUserProfileId();
  const classroomId = scope.api.createClassroomId();
  const studentUid = scope.api.createStudentUid();
  assert.match(userProfileId, /^profile-/);
  assert.match(classroomId, /^classroom-/);
  assert.match(studentUid, /^student-/);
  assert.equal(scope.api.isValidUserProfileId(userProfileId), true);
  assert.equal(scope.api.isValidClassroomId(classroomId), true);
  assert.equal(scope.api.isValidStudentUid(studentUid), true);
});

test("assignStudentUids preserves valid IDs, repairs duplicates, and clones input", () => {
  let id = 0;
  const input = [
    { displayName: "A" },
    { displayName: "B", studentUid: "student-old" },
    { displayName: "C", studentUid: "student-old" },
  ];
  const result = scope.api.assignStudentUids(
    input,
    () => `student-test-${++id}`,
  );
  assert.deepEqual(
    result.map((student) => student.studentUid),
    ["student-test-1", "student-old", "student-test-2"],
  );
  assert.equal(input[0].studentUid, undefined);
  assert.equal(result[0] === input[0], false);
});
