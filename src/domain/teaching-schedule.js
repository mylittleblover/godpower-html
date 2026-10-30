(function installTeachingSchedule(root) {
  "use strict";
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const fail = (message) => {
    throw new TypeError(message);
  };

  function validateDocument(input) {
    if (
      !input ||
      typeof input !== "object" ||
      Array.isArray(input) ||
      input.schemaVersion !== 1 ||
      !Array.isArray(input.entries)
    )
      fail("schedule document schemaVersion 1 and entries are required");
    const ids = new Set();
    const entries = input.entries.map((entry) => {
      if (
        !entry ||
        typeof entry !== "object" ||
        !root.StableIdentity.isValidGroupUid(entry.scheduleId) ||
        !entry.scheduleId.startsWith("schedule-") ||
        ids.has(entry.scheduleId)
      )
        fail("schedule identity is invalid or duplicated");
      ids.add(entry.scheduleId);
      if (
        !root.StableIdentity.isValidUserProfileId(entry.userProfileId) ||
        !root.StableIdentity.isValidClassroomId(entry.classroomId)
      )
        fail("schedule profile or classroom identity is invalid");
      if (
        !Number.isInteger(entry.weekday) ||
        entry.weekday < 0 ||
        entry.weekday > 6
      )
        fail("weekday must be an integer from 0 to 6");
      if (
        !Number.isInteger(entry.startMinute) ||
        entry.startMinute < 0 ||
        entry.startMinute >= 1440 ||
        !Number.isInteger(entry.endMinute) ||
        entry.endMinute < 1 ||
        entry.endMinute > 1440 ||
        entry.startMinute >= entry.endMinute
      )
        fail(
          "schedule time range must be a non-empty same-day minute interval",
        );
      if (
        typeof entry.subjectId !== "string" ||
        !entry.subjectId.trim() ||
        entry.subjectId.length > 80
      )
        fail(
          "schedule subjectId is required and must be 80 characters or less",
        );
      if (
        entry.note != null &&
        (typeof entry.note !== "string" || entry.note.length > 500)
      )
        fail("schedule note must be at most 500 characters");
      return clone({ ...entry, note: entry.note ?? "" });
    });
    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const left = entries[i];
        const right = entries[j];
        if (
          left.userProfileId === right.userProfileId &&
          left.weekday === right.weekday &&
          left.startMinute < right.endMinute &&
          right.startMinute < left.endMinute
        )
          fail(`schedule slots overlap for profile on weekday ${left.weekday}`);
      }
    }
    return { schemaVersion: 1, entries };
  }

  function createDocument(entries = []) {
    return validateDocument({ schemaVersion: 1, entries });
  }

  function findCurrentLesson(
    scheduleDocument,
    userProfileId,
    weekday,
    minuteOfDay,
  ) {
    const valid = validateDocument(scheduleDocument);
    if (!root.StableIdentity.isValidUserProfileId(userProfileId))
      fail("profile identity is invalid");
    if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6)
      fail("weekday must be an integer from 0 to 6");
    if (
      !Number.isInteger(minuteOfDay) ||
      minuteOfDay < 0 ||
      minuteOfDay >= 1440
    )
      fail("minuteOfDay must be an integer from 0 to 1439");
    return (
      valid.entries.find(
        (entry) =>
          entry.userProfileId === userProfileId &&
          entry.weekday === weekday &&
          entry.startMinute <= minuteOfDay &&
          minuteOfDay < entry.endMinute,
      ) || null
    );
  }

  root.TeachingSchedule = Object.freeze({
    validateDocument,
    createDocument,
    findCurrentLesson,
  });
})(globalThis);
