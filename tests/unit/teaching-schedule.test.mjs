import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";

const scope = vm.createContext({});
vm.runInContext(
  readFileSync("src/domain/identity.js", "utf8") +
    "\n" +
    readFileSync("src/domain/teaching-schedule.js", "utf8") +
    "\n" +
    readFileSync("src/infrastructure/teaching-schedule-repository.js", "utf8") +
    "\nglobalThis.api = TeachingSchedule; globalThis.repo = TeachingScheduleRepository;",
  scope,
);

const slot = (changes = {}) => ({
  scheduleId: "schedule-monday-1",
  userProfileId: "profile-teacher-1",
  classroomId: "classroom-1",
  weekday: 1,
  startMinute: 8 * 60,
  endMinute: 8 * 60 + 45,
  subjectId: "politics",
  note: "第一节",
  ...changes,
});

test("schedule validates stable references, weekday and local minute boundaries", () => {
  const input = { schemaVersion: 1, entries: [slot()] };
  const result = scope.api.validateDocument(input);
  assert.deepEqual(JSON.parse(JSON.stringify(result)), input);
  for (const changes of [
    { weekday: 7 },
    { startMinute: -1 },
    { endMinute: 1441 },
    { endMinute: 480 },
    { endMinute: 470 },
    { classroomId: "invalid" },
  ])
    assert.throws(() =>
      scope.api.validateDocument({
        schemaVersion: 1,
        entries: [slot(changes)],
      }),
    );
});

test("schedule rejects overlaps for the same teacher, including different classrooms", () => {
  assert.throws(
    () =>
      scope.api.validateDocument({
        schemaVersion: 1,
        entries: [
          slot(),
          slot({
            scheduleId: "schedule-monday-2",
            classroomId: "classroom-2",
            startMinute: 8 * 60 + 44,
          }),
        ],
      }),
    /overlap/i,
  );
});

test("current lesson uses a half-open interval and requires explicit profile match", () => {
  const document = scope.api.validateDocument({
    schemaVersion: 1,
    entries: [slot()],
  });
  assert.equal(
    scope.api.findCurrentLesson(document, "profile-teacher-1", 1, 480)
      .scheduleId,
    "schedule-monday-1",
  );
  assert.equal(
    scope.api.findCurrentLesson(document, "profile-teacher-1", 1, 524)
      .scheduleId,
    "schedule-monday-1",
  );
  assert.equal(
    scope.api.findCurrentLesson(document, "profile-teacher-1", 1, 525),
    null,
  );
  assert.equal(
    scope.api.findCurrentLesson(document, "profile-other", 1, 480),
    null,
  );
  assert.equal(
    scope.api.findCurrentLesson(document, "profile-teacher-1", 2, 480),
    null,
  );
});

test("schedule repository verifies writes and rejects stale revisions", () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
  const repository = scope.repo.createTeachingScheduleRepository({ storage });
  const empty = repository.read();
  assert.equal(empty.ok, true);
  assert.equal(empty.revision, 0);
  const saved = repository.write(scope.api.createDocument([slot()]), {
    expectedRevision: 0,
  });
  assert.equal(saved.ok, true);
  assert.equal(repository.read().schedule.entries.length, 1);
  assert.equal(
    repository.write(scope.api.createDocument(), { expectedRevision: 0 }).code,
    "REVISION_CONFLICT",
  );
});

test("schedule write failure restores prior bytes and never clears other data", () => {
  const values = new Map([["godpower_state_v2", "classroom-bytes"]]);
  let failed = false;
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      if (!failed && key === "godpower_teaching_schedule_v1") {
        failed = true;
        throw new Error("quota");
      }
      values.set(key, value);
    },
    removeItem: (key) => values.delete(key),
  };
  const repository = scope.repo.createTeachingScheduleRepository({ storage });
  assert.equal(
    repository.write(scope.api.createDocument([slot()]), {
      expectedRevision: 0,
    }).code,
    "STORAGE_WRITE_FAILED",
  );
  assert.equal(values.has("godpower_teaching_schedule_v1"), false);
  assert.equal(values.get("godpower_state_v2"), "classroom-bytes");
});
