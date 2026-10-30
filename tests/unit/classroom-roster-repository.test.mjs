import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";

const scope = vm.createContext({
  crypto: { randomUUID: () => "generated" },
});
vm.runInContext(
  readFileSync("src/domain/identity.js", "utf8") +
    "\n" +
    readFileSync("src/domain/classroom-roster.js", "utf8") +
    "\n" +
    readFileSync("src/infrastructure/classroom-roster-repository.js", "utf8") +
    "\nglobalThis.api = ClassroomRosterRepository;",
  scope,
);

function fakeStorage(seed = {}) {
  const map = new Map(Object.entries(seed));
  return {
    map,
    getItem(key) {
      return map.has(key) ? map.get(key) : null;
    },
    setItem(key, value) {
      map.set(key, String(value));
    },
    removeItem(key) {
      map.delete(key);
    },
  };
}

const document = () =>
  scope.ClassroomRoster.createRosterDocument({
    profiles: [{ userProfileId: "profile-1", displayName: "教师" }],
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
        mode: "individual",
        groupAssignments: [],
      },
    ],
  });

test("repository writes, verifies and compares revisions without touching legacy classroom key", () => {
  const legacy = JSON.stringify({ groups: [{ members: ["原始名单"] }] });
  const storage = fakeStorage({ godpower_state_v2: legacy });
  const repo = scope.api.createClassroomRosterRepository({ storage });
  const created = repo.write(document(), { expectedRevision: 0 });
  assert.equal(created.ok, true);
  assert.equal(created.revision, 1);
  assert.equal(repo.read().revision, 1);
  assert.equal(repo.read().rosterData.students.length, 1);
  assert.equal(storage.getItem("godpower_state_v2"), legacy);
  assert.equal(
    repo.write(document(), { expectedRevision: 0 }).code,
    "REVISION_CONFLICT",
  );
});

test("quota and readback failures restore prior roster bytes and preserve legacy bytes", () => {
  const legacy = "legacy-bytes";
  const storage = fakeStorage({ godpower_state_v2: legacy });
  const repo = scope.api.createClassroomRosterRepository({ storage });
  assert.equal(repo.write(document(), { expectedRevision: 0 }).ok, true);
  const prior = storage.getItem(repo.key);
  const set = storage.setItem;
  let failNextWrite = true;
  storage.setItem = (key, value) => {
    if (key === repo.key && failNextWrite) {
      failNextWrite = false;
      throw new Error("quota");
    }
    set(key, value);
  };
  const failed = scope.api
    .createClassroomRosterRepository({ storage })
    .write(document(), { expectedRevision: 1 });
  assert.equal(failed.ok, false);
  assert.equal(failed.code, "STORAGE_WRITE_FAILED");
  assert.equal(storage.getItem(repo.key), prior);
  assert.equal(storage.getItem("godpower_state_v2"), legacy);
});

test("readback mismatch rolls back the previous roster document", () => {
  const storage = fakeStorage();
  const repo = scope.api.createClassroomRosterRepository({ storage });
  assert.equal(repo.write(document(), { expectedRevision: 0 }).ok, true);
  const previous = storage.getItem(repo.key);
  const set = storage.setItem;
  let corruptNextWrite = true;
  storage.setItem = (key, value) => {
    if (key === repo.key && corruptNextWrite) {
      corruptNextWrite = false;
      set(key, `${value} `);
      return;
    }
    set(key, value);
  };
  const failed = scope.api
    .createClassroomRosterRepository({ storage })
    .write(document(), { expectedRevision: 1 });
  assert.equal(failed.ok, false);
  assert.equal(failed.code, "STORAGE_WRITE_FAILED");
  assert.equal(storage.getItem(repo.key), previous);
});

test("corrupt repository is reported and never overwritten", () => {
  const storage = fakeStorage({
    [scope.api.key]: "bad json",
    godpower_state_v2: "legacy",
  });
  const repo = scope.api.createClassroomRosterRepository({ storage });
  assert.equal(repo.read().code, "CORRUPT_REPOSITORY");
  assert.equal(
    repo.write(document(), { expectedRevision: 0 }).code,
    "CORRUPT_REPOSITORY",
  );
  assert.equal(storage.getItem(scope.api.key), "bad json");
});
