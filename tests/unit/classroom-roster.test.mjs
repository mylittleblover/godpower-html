import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";

const scope = vm.createContext({
  crypto: {
    randomUUID: (() => {
      let id = 0;
      return () => `id-${++id}`;
    })(),
  },
});
vm.runInContext(
  readFileSync("src/domain/identity.js", "utf8") +
    "\n" +
    "\n" +
    readFileSync("src/domain/classroom-roster.js", "utf8") +
    "\nglobalThis.api = ClassroomRoster;",
  scope,
);

test("preview keeps duplicate legacy names distinct and never mutates input", () => {
  let id = 0;
  const groups = [
    { id: 1, groupUid: "group-a", name: "A组", members: ["小明", "小明"] },
    { id: 2, groupUid: "group-b", name: "B组", members: ["小红"] },
  ];
  const before = structuredClone(groups);
  const doc = scope.api.previewLegacyRoster({
    classroomId: "classroom-1",
    userProfileId: "profile-1",
    groups,
    idFactory: () => `student-test-${++id}`,
  });
  assert.equal(doc.students.length, 3);
  assert.equal(new Set(doc.students.map((s) => s.studentUid)).size, 3);
  assert.deepEqual(
    Array.from(doc.assignments[0].groupAssignments, (x) => x.groupUid),
    ["group-a", "group-a", "group-b"],
  );
  assert.deepEqual(groups, before);
});

test("individual mode retains roster and does not require group assignments", () => {
  const doc = scope.api.previewLegacyRoster({
    classroomId: "classroom-1",
    userProfileId: "profile-1",
    mode: "individual",
    groups: [{ id: 1, groupUid: "group-a", members: ["学生"] }],
    idFactory: () => "student-one",
  });
  assert.equal(doc.students.length, 1);
  assert.equal(doc.assignments[0].mode, "individual");
  assert.equal(doc.assignments[0].groupAssignments.length, 0);
});

test("projection is profile-scoped, supports rename, and returns copies", () => {
  const document = scope.api.createRosterDocument({
    profiles: [
      { userProfileId: "profile-a", displayName: "A" },
      { userProfileId: "profile-b", displayName: "B" },
    ],
    classrooms: [
      { classroomId: "classroom-1", name: "一班", studentIds: ["student-1"] },
    ],
    students: [
      {
        studentUid: "student-1",
        classroomId: "classroom-1",
        displayName: "新名字",
        number: "01",
        avatarResourceId: null,
      },
    ],
    assignments: [
      {
        userProfileId: "profile-a",
        classroomId: "classroom-1",
        mode: "group",
        groupAssignments: [{ studentUid: "student-1", groupUid: "group-a" }],
      },
      {
        userProfileId: "profile-b",
        classroomId: "classroom-1",
        mode: "group",
        groupAssignments: [],
      },
    ],
  });
  const groups = [
    { id: 1, groupUid: "group-a", members: ["旧名字"] },
    { id: 2, groupUid: "group-b", members: ["旧成员"] },
  ];
  const projected = scope.api.projectLegacyMembers({
    groups,
    rosterData: document,
    userProfileId: "profile-a",
    classroomId: "classroom-1",
  });
  assert.deepEqual(
    JSON.parse(JSON.stringify(projected.map((g) => g.members))),
    [["新名字"], []],
  );
  assert.deepEqual(
    groups.map((g) => g.members),
    [["旧名字"], ["旧成员"]],
  );
  assert.deepEqual(
    JSON.parse(
      JSON.stringify(
        scope.api
          .projectLegacyMembers({
            groups,
            rosterData: document,
            userProfileId: "profile-b",
            classroomId: "classroom-1",
          })
          .map((g) => g.members),
      ),
    ),
    [[], []],
  );
});

test("rejects repeated identities, cross-classroom students and malformed mode atomically", () => {
  const base = {
    profiles: [{ userProfileId: "profile-1", displayName: "老师" }],
    classrooms: [
      { classroomId: "classroom-1", name: "一班", studentIds: ["student-1"] },
    ],
    students: [
      {
        studentUid: "student-1",
        classroomId: "classroom-1",
        displayName: "学生",
        number: null,
        avatarResourceId: null,
      },
    ],
    assignments: [
      {
        userProfileId: "profile-1",
        classroomId: "classroom-1",
        mode: "group",
        groupAssignments: [],
      },
    ],
  };
  assert.throws(
    () =>
      scope.api.createRosterDocument({
        ...base,
        students: [...base.students, base.students[0]],
      }),
    /duplicate student/i,
  );
  assert.throws(
    () =>
      scope.api.createRosterDocument({
        ...base,
        classrooms: [
          { ...base.classrooms[0], studentIds: ["student-missing"] },
        ],
      }),
    /student reference/i,
  );
  assert.throws(
    () =>
      scope.api.createRosterDocument({
        ...base,
        assignments: [{ ...base.assignments[0], mode: "unknown" }],
      }),
    /mode/i,
  );
  assert.throws(
    () =>
      scope.api.createRosterDocument({
        ...base,
        assignments: [
          {
            ...base.assignments[0],
            mode: "individual",
            groupAssignments: [
              { studentUid: "student-1", groupUid: "group-a" },
            ],
          },
        ],
      }),
    /individual mode/i,
  );
  assert.throws(
    () =>
      scope.api.createRosterDocument({
        ...base,
        classrooms: [{ ...base.classrooms[0], studentIds: [] }],
      }),
    /not listed/i,
  );
});

test("refuses an unknown profile/group projection instead of redirecting a student", () => {
  const doc = scope.api.createRosterDocument({
    profiles: [{ userProfileId: "profile-1", displayName: "老师" }],
    classrooms: [
      { classroomId: "classroom-1", name: "一班", studentIds: ["student-1"] },
    ],
    students: [
      {
        studentUid: "student-1",
        classroomId: "classroom-1",
        displayName: "学生",
        number: null,
        avatarResourceId: null,
      },
    ],
    assignments: [
      {
        userProfileId: "profile-1",
        classroomId: "classroom-1",
        mode: "group",
        groupAssignments: [
          { studentUid: "student-1", groupUid: "group-missing" },
        ],
      },
    ],
  });
  assert.throws(
    () =>
      scope.api.projectLegacyMembers({
        groups: [{ id: 1, groupUid: "group-a", members: [] }],
        rosterData: doc,
        userProfileId: "profile-1",
        classroomId: "classroom-1",
      }),
    /unknown group/i,
  );
});
