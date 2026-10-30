(function installClassroomRosterRepository(root) {
  "use strict";
  const KEY = "godpower_classroom_roster_v1";
  const clone = (value) => JSON.parse(JSON.stringify(value));

  function createClassroomRosterRepository({ storage, key = KEY }) {
    if (
      !storage ||
      typeof storage.getItem !== "function" ||
      typeof storage.setItem !== "function" ||
      typeof storage.removeItem !== "function"
    )
      throw new TypeError("roster storage is unavailable");
    function read() {
      const raw = storage.getItem(key);
      if (raw === null) return { ok: true, revision: 0, rosterData: null };
      try {
        const envelope = JSON.parse(raw);
        if (
          !envelope ||
          envelope.schemaVersion !== 1 ||
          !Number.isSafeInteger(envelope.revision) ||
          envelope.revision < 1
        )
          return { ok: false, code: "CORRUPT_REPOSITORY" };
        return {
          ok: true,
          revision: envelope.revision,
          rosterData: root.ClassroomRoster.validateRosterDocument(
            envelope.rosterData,
          ),
        };
      } catch (_) {
        return { ok: false, code: "CORRUPT_REPOSITORY" };
      }
    }
    function write(rosterData, { expectedRevision } = {}) {
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
        valid = root.ClassroomRoster.validateRosterDocument(rosterData);
      } catch (error) {
        return { ok: false, code: "INVALID_DOCUMENT", message: error.message };
      }
      const previous = storage.getItem(key);
      const revision = current.revision + 1;
      const encoded = JSON.stringify({
        schemaVersion: 1,
        revision,
        rosterData: valid,
      });
      try {
        storage.setItem(key, encoded);
        if (storage.getItem(key) !== encoded)
          throw new Error("roster readback verification failed");
        return { ok: true, revision, rosterData: clone(valid) };
      } catch (error) {
        try {
          if (previous === null) storage.removeItem(key);
          else storage.setItem(key, previous);
          if (storage.getItem(key) !== previous)
            throw new Error("rollback readback verification failed");
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
    return Object.freeze({
      key,
      read,
      write,
      previewMigration: root.ClassroomRoster.previewLegacyRoster,
    });
  }

  root.ClassroomRosterRepository = Object.freeze({
    key: KEY,
    createClassroomRosterRepository,
  });
})(globalThis);
