(function installClassroomRoster(root) {
  "use strict";
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const fail = (message) => {
    throw new TypeError(message);
  };
  const validId = (value, check) => root.StableIdentity[check](value);

  function validateRosterDocument(input) {
    if (
      !input ||
      typeof input !== "object" ||
      Array.isArray(input) ||
      input.schemaVersion !== 1
    )
      fail("roster schemaVersion must be 1");
    for (const key of ["profiles", "classrooms", "students", "assignments"])
      if (!Array.isArray(input[key])) fail(`roster ${key} must be an array`);
    const profileIds = new Set();
    for (const profile of input.profiles) {
      if (
        !profile ||
        !validId(profile.userProfileId, "isValidUserProfileId") ||
        profileIds.has(profile.userProfileId)
      )
        fail("invalid or duplicate user profile identity");
      if (
        typeof profile.displayName !== "string" ||
        !profile.displayName.trim()
      )
        fail("profile displayName is required");
      if (profile.subjectId != null && typeof profile.subjectId !== "string")
        fail("profile subjectId must be a string or null");
      profileIds.add(profile.userProfileId);
    }
    const classrooms = new Map();
    for (const classroom of input.classrooms) {
      if (
        !classroom ||
        !validId(classroom.classroomId, "isValidClassroomId") ||
        classrooms.has(classroom.classroomId)
      )
        fail("invalid or duplicate classroom identity");
      if (
        typeof classroom.name !== "string" ||
        !classroom.name.trim() ||
        !Array.isArray(classroom.studentIds)
      )
        fail("invalid classroom fields");
      if (
        new Set(classroom.studentIds).size !== classroom.studentIds.length ||
        classroom.studentIds.some((id) => !validId(id, "isValidStudentUid"))
      )
        fail("invalid or duplicate student reference in classroom");
      classrooms.set(classroom.classroomId, classroom);
    }
    const students = new Map();
    for (const student of input.students) {
      if (
        !student ||
        !validId(student.studentUid, "isValidStudentUid") ||
        students.has(student.studentUid)
      )
        fail("invalid or duplicate student identity");
      if (
        !classrooms.has(student.classroomId) ||
        typeof student.displayName !== "string" ||
        !student.displayName.trim()
      )
        fail("invalid student classroom reference or displayName");
      if (student.number != null && typeof student.number !== "string")
        fail("student number must be a string or null");
      if (
        student.avatarResourceId != null &&
        typeof student.avatarResourceId !== "string"
      )
        fail("avatarResourceId must be a string or null");
      students.set(student.studentUid, student);
    }
    for (const [classroomId, classroom] of classrooms) {
      for (const studentUid of classroom.studentIds) {
        if (students.get(studentUid)?.classroomId !== classroomId)
          fail("student reference is missing or belongs to another classroom");
      }
    }
    for (const student of students.values()) {
      if (
        !classrooms
          .get(student.classroomId)
          .studentIds.includes(student.studentUid)
      )
        fail("student is not listed in its classroom roster");
    }
    const assignmentKeys = new Set();
    for (const assignment of input.assignments) {
      if (
        !assignment ||
        !profileIds.has(assignment.userProfileId) ||
        !classrooms.has(assignment.classroomId)
      )
        fail("assignment profile or classroom reference is invalid");
      if (assignment.mode !== "group" && assignment.mode !== "individual")
        fail("assignment mode must be group or individual");
      if (!Array.isArray(assignment.groupAssignments))
        fail("groupAssignments must be an array");
      const key = `${assignment.userProfileId}\u0000${assignment.classroomId}`;
      if (assignmentKeys.has(key))
        fail("duplicate profile classroom assignment");
      assignmentKeys.add(key);
      const assignedStudents = new Set();
      for (const item of assignment.groupAssignments) {
        if (assignment.mode === "individual")
          fail("individual mode cannot require group assignments");
        if (
          !item ||
          !validId(item.studentUid, "isValidStudentUid") ||
          !validId(item.groupUid, "isValidGroupUid") ||
          assignedStudents.has(item.studentUid)
        )
          fail("invalid or duplicate group assignment");
        if (
          students.get(item.studentUid)?.classroomId !== assignment.classroomId
        )
          fail("assignment student belongs to another classroom");
        assignedStudents.add(item.studentUid);
      }
    }
    return clone(input);
  }

  function createRosterDocument(input) {
    return validateRosterDocument({
      schemaVersion: 1,
      profiles: [],
      classrooms: [],
      students: [],
      assignments: [],
      ...clone(input),
    });
  }

  function previewLegacyRoster({
    classroomId,
    userProfileId,
    classroomName = "课堂",
    profileName = "教师",
    mode = "group",
    groups,
    idFactory = root.StableIdentity.createStudentUid,
  }) {
    if (
      !validId(classroomId, "isValidClassroomId") ||
      !validId(userProfileId, "isValidUserProfileId")
    )
      fail("classroom or profile identity is invalid");
    if (!Array.isArray(groups)) fail("groups must be an array");
    if (mode !== "group" && mode !== "individual")
      fail("mode must be group or individual");
    const students = [];
    const studentIds = [];
    const groupAssignments = [];
    const seenGroups = new Set();
    for (const group of groups) {
      if (
        !group ||
        !validId(group.groupUid, "isValidGroupUid") ||
        seenGroups.has(group.groupUid)
      )
        fail("legacy group identity is invalid or duplicated");
      seenGroups.add(group.groupUid);
      if (!Array.isArray(group.members))
        fail("legacy group members must be an array");
      for (const member of group.members) {
        if (typeof member !== "string" || !member.trim())
          fail("legacy member name is invalid");
        const studentUid = idFactory();
        if (
          !validId(studentUid, "isValidStudentUid") ||
          studentIds.includes(studentUid)
        )
          fail("student identity factory returned an invalid or duplicate ID");
        students.push({
          studentUid,
          classroomId,
          displayName: member,
          number: null,
          avatarResourceId: null,
        });
        studentIds.push(studentUid);
        if (mode === "group")
          groupAssignments.push({ studentUid, groupUid: group.groupUid });
      }
    }
    return createRosterDocument({
      profiles: [{ userProfileId, displayName: profileName, subjectId: null }],
      classrooms: [{ classroomId, name: classroomName, studentIds }],
      students,
      assignments: [
        {
          userProfileId,
          classroomId,
          mode,
          groupAssignments: mode === "group" ? groupAssignments : [],
        },
      ],
    });
  }

  function projectLegacyMembers({
    groups,
    rosterData,
    userProfileId,
    classroomId,
  }) {
    const valid = validateRosterDocument(rosterData);
    const assignment = valid.assignments.find(
      (entry) =>
        entry.userProfileId === userProfileId &&
        entry.classroomId === classroomId,
    );
    if (!assignment) fail("profile classroom assignment was not found");
    const availableGroups = new Set(groups.map((group) => group.groupUid));
    const byGroup = new Map();
    for (const item of assignment.groupAssignments) {
      if (!availableGroups.has(item.groupUid))
        fail("assignment references an unknown group");
      const student = valid.students.find(
        (entry) => entry.studentUid === item.studentUid,
      );
      const names = byGroup.get(item.groupUid) || [];
      names.push(student.displayName);
      byGroup.set(item.groupUid, names);
    }
    return groups.map((group) => ({
      ...group,
      members: [...(byGroup.get(group.groupUid) || [])],
    }));
  }

  function planCompetitionMemberUpdate({
    groups,
    rosterData,
    userProfileId,
    classroomId,
  }) {
    if (!Array.isArray(groups) || !groups.length)
      fail("an active group competition is required");
    const valid = validateRosterDocument(rosterData);
    const assignment = valid.assignments.find(
      (entry) =>
        entry.userProfileId === userProfileId &&
        entry.classroomId === classroomId,
    );
    if (!assignment) fail("profile classroom assignment was not found");
    if (assignment.mode !== "group")
      fail("individual roster mode cannot be applied to group competition");
    const ids = new Set();
    for (const group of groups) {
      if (
        !group ||
        !validId(group.groupUid, "isValidGroupUid") ||
        ids.has(group.groupUid)
      )
        fail("live group identity is invalid or duplicated");
      ids.add(group.groupUid);
    }
    const original = groups.map(clone);
    const projected = projectLegacyMembers({
      groups: original,
      rosterData: valid,
      userProfileId,
      classroomId,
    });
    const groupChanges = projected.map((group, index) => ({
      groupUid: group.groupUid,
      groupName: group.name || `第 ${index + 1} 组`,
      before: [...original[index].members],
      after: [...group.members],
      changed:
        JSON.stringify(original[index].members) !==
        JSON.stringify(group.members),
    }));
    return {
      groups: projected,
      groupChanges,
      changedGroups: groupChanges.filter((change) => change.changed).length,
      beforeMemberCount: groupChanges.reduce(
        (total, change) => total + change.before.length,
        0,
      ),
      afterMemberCount: groupChanges.reduce(
        (total, change) => total + change.after.length,
        0,
      ),
    };
  }

  root.ClassroomRoster = Object.freeze({
    validateRosterDocument,
    createRosterDocument,
    previewLegacyRoster,
    projectLegacyMembers,
    planCompetitionMemberUpdate,
  });
})(globalThis);
