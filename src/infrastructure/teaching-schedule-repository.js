(function installTeachingScheduleRepository(root) {
  "use strict";
  const KEY = "godpower_teaching_schedule_v1";
  const clone = (value) => JSON.parse(JSON.stringify(value));

  function createTeachingScheduleRepository({ storage, key = KEY }) {
    if (
      !storage ||
      typeof storage.getItem !== "function" ||
      typeof storage.setItem !== "function" ||
      typeof storage.removeItem !== "function"
    )
      throw new TypeError("schedule storage is unavailable");
    function read() {
      let raw;
      try {
        raw = storage.getItem(key);
      } catch (error) {
        return {
          ok: false,
          code: "STORAGE_READ_FAILED",
          message: error.message,
        };
      }
      if (raw === null)
        return {
          ok: true,
          revision: 0,
          schedule: root.TeachingSchedule.createDocument(),
        };
      try {
        const envelope = JSON.parse(raw);
        if (
          envelope?.schemaVersion !== 1 ||
          !Number.isSafeInteger(envelope.revision) ||
          envelope.revision < 1
        )
          return { ok: false, code: "CORRUPT_REPOSITORY" };
        return {
          ok: true,
          revision: envelope.revision,
          schedule: root.TeachingSchedule.validateDocument(envelope.schedule),
        };
      } catch (error) {
        return {
          ok: false,
          code: "CORRUPT_REPOSITORY",
          message: error.message,
        };
      }
    }
    function write(schedule, { expectedRevision } = {}) {
      const current = read();
      if (!current.ok) return current;
      if (
        !Number.isSafeInteger(expectedRevision) ||
        current.revision !== expectedRevision
      )
        return {
          ok: false,
          code: "REVISION_CONFLICT",
          revision: current.revision,
        };
      let valid;
      try {
        valid = root.TeachingSchedule.validateDocument(schedule);
      } catch (error) {
        return { ok: false, code: "INVALID_DOCUMENT", message: error.message };
      }
      let previous;
      try {
        previous = storage.getItem(key);
      } catch (error) {
        return {
          ok: false,
          code: "STORAGE_READ_FAILED",
          message: error.message,
        };
      }
      const revision = current.revision + 1;
      const encoded = JSON.stringify({
        schemaVersion: 1,
        revision,
        schedule: valid,
      });
      try {
        storage.setItem(key, encoded);
        if (storage.getItem(key) !== encoded)
          throw new Error("schedule readback verification failed");
        return { ok: true, revision, schedule: clone(valid) };
      } catch (error) {
        try {
          if (previous === null) storage.removeItem(key);
          else storage.setItem(key, previous);
          if (storage.getItem(key) !== previous)
            throw new Error("schedule rollback verification failed");
        } catch (rollbackError) {
          return {
            ok: false,
            code: "ROLLBACK_FAILED",
            message: `${error.message}; ${rollbackError.message}`,
          };
        }
        return {
          ok: false,
          code: "STORAGE_WRITE_FAILED",
          message: error.message,
        };
      }
    }
    return Object.freeze({ key, read, write });
  }

  root.TeachingScheduleRepository = Object.freeze({
    key: KEY,
    createTeachingScheduleRepository,
  });
})(globalThis);
