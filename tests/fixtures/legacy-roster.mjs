export const legacyRoster = () => ({
  schemaVersion: 1,
  revision: 2,
  rosterData: {
    schemaVersion: 1,
    profiles: [
      { userProfileId: "profile-one", displayName: "教师一" },
      { userProfileId: "profile-two", displayName: "教师二" },
    ],
    classrooms: [
      {
        classroomId: "classroom-one",
        name: "同名班级",
        studentIds: ["student-one", "student-two"],
      },
      {
        classroomId: "classroom-two",
        name: "同名班级",
        studentIds: ["student-three"],
      },
    ],
    students: [
      {
        studentUid: "student-one",
        classroomId: "classroom-one",
        displayName: "同名",
        number: "01",
        avatarResourceId: null,
      },
      {
        studentUid: "student-two",
        classroomId: "classroom-one",
        displayName: "同名",
        number: "02",
        avatarResourceId: null,
      },
      {
        studentUid: "student-three",
        classroomId: "classroom-two",
        displayName: "同名",
        number: "01",
        avatarResourceId: null,
      },
    ],
    assignments: [
      {
        userProfileId: "profile-one",
        classroomId: "classroom-one",
        mode: "group",
        groupAssignments: [
          { studentUid: "student-one", groupUid: "group-old" },
        ],
      },
      {
        userProfileId: "profile-two",
        classroomId: "classroom-one",
        mode: "individual",
        groupAssignments: [],
      },
    ],
  },
});
