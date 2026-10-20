import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";

const scope = vm.createContext({});
vm.runInContext(
  readFileSync("src/domain/identity.js", "utf8") +
    "\n" +
    readFileSync("src/domain/classroom-roster.js", "utf8") +
    "\nglobalThis.api = ClassroomRoster;",
  scope,
);

const groups = [
  {
    id: 1,
    groupUid: "group-live-1",
    name: "一组",
    score: 20,
    members: ["旧甲"],
  },
  {
    id: 2,
    groupUid: "group-live-2",
    name: "二组",
    score: -2,
    members: ["旧乙"],
  },
];
const roster = scope.api.createRosterDocument({
  profiles: [{ userProfileId: "profile-teacher-1", displayName: "教师" }],
  classrooms: [
    {
      classroomId: "classroom-1",
      name: "一班",
      studentIds: ["student-1", "student-2", "student-3"],
    },
  ],
  students: [
    {
      studentUid: "student-1",
      classroomId: "classroom-1",
      displayName: "同名",
      number: "01",
      avatarResourceId: null,
    },
    {
      studentUid: "student-2",
      classroomId: "classroom-1",
      displayName: "同名",
      number: "02",
      avatarResourceId: null,
    },
    {
      studentUid: "student-3",
      classroomId: "classroom-1",
      displayName: "新同学",
      number: "03",
      avatarResourceId: null,
    },
  ],
  assignments: [
    {
      userProfileId: "profile-teacher-1",
      classroomId: "classroom-1",
      mode: "group",
      groupAssignments: [
        { studentUid: "student-1", groupUid: "group-live-1" },
        { studentUid: "student-2", groupUid: "group-live-1" },
        { studentUid: "student-3", groupUid: "group-live-2" },
      ],
    },
  ],
});

test("application plan matches stable group IDs, preserves duplicate names and all non-member state", () => {
  const before = JSON.stringify(groups);
  const plan = scope.api.planCompetitionMemberUpdate({
    groups,
    rosterData: roster,
    userProfileId: "profile-teacher-1",
    classroomId: "classroom-1",
  });
  assert.deepEqual(
    JSON.parse(JSON.stringify(plan.groups.map((group) => group.members))),
    [["同名", "同名"], ["新同学"]],
  );
  assert.equal(plan.changedGroups, 2);
  assert.equal(plan.beforeMemberCount, 2);
  assert.equal(plan.afterMemberCount, 3);
  assert.equal(plan.groups[0].score, 20);
  assert.equal(plan.groups[1].score, -2);
  assert.equal(
    JSON.stringify(groups),
    before,
    "preview must not mutate live state",
  );
});

test("individual mode cannot be projected into group competition", () => {
  const individual = scope.api.createRosterDocument({
    ...JSON.parse(JSON.stringify(roster)),
    assignments: [
      {
        userProfileId: "profile-teacher-1",
        classroomId: "classroom-1",
        mode: "individual",
        groupAssignments: [],
      },
    ],
  });
  assert.throws(
    () =>
      scope.api.planCompetitionMemberUpdate({
        groups,
        rosterData: individual,
        userProfileId: "profile-teacher-1",
        classroomId: "classroom-1",
      }),
    /individual/,
  );
});

test("unknown profiles, classrooms, groups and empty competition cannot silently redirect", () => {
  for (const changes of [
    { userProfileId: "profile-missing", classroomId: "classroom-1" },
    { userProfileId: "profile-teacher-1", classroomId: "classroom-missing" },
  ])
    assert.throws(() =>
      scope.api.planCompetitionMemberUpdate({
        groups,
        rosterData: roster,
        ...changes,
      }),
    );
  assert.throws(() =>
    scope.api.planCompetitionMemberUpdate({
      groups: [],
      rosterData: roster,
      userProfileId: "profile-teacher-1",
      classroomId: "classroom-1",
    }),
  );
  const invalidGroups = [
    { ...groups[0], groupUid: "group-not-live" },
    groups[1],
  ];
  assert.throws(
    () =>
      scope.api.planCompetitionMemberUpdate({
        groups: invalidGroups,
        rosterData: roster,
        userProfileId: "profile-teacher-1",
        classroomId: "classroom-1",
      }),
    /unknown group/,
  );
});
