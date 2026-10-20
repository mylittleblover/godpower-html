(function installHomeLayoutRepository(root) {
  "use strict";
  const KEY = "godpower_home_layout_v1";
  const clone = (value) => JSON.parse(JSON.stringify(value));

  function createHomeLayoutRepository({ storage, key = KEY }) {
    if (
      !storage ||
      typeof storage.getItem !== "function" ||
      typeof storage.setItem !== "function" ||
      typeof storage.removeItem !== "function"
    )
      throw new TypeError("home layout storage is unavailable");

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
        return { ok: true, revision: 0, layout: null, source: "empty" };
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
          layout: root.HomeLayout.validateLayout(envelope.layout),
          source: "saved",
        };
      } catch (error) {
        return {
          ok: false,
          code: "CORRUPT_REPOSITORY",
          message: error.message,
        };
      }
    }

    function write(layout, { expectedRevision } = {}) {
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
        valid = root.HomeLayout.validateLayout(layout);
      } catch (error) {
        return { ok: false, code: "INVALID_LAYOUT", message: error.message };
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
      const envelope = { schemaVersion: 1, revision, layout: valid };
      const encoded = JSON.stringify(envelope);
      try {
        storage.setItem(key, encoded);
        if (storage.getItem(key) !== encoded)
          throw new Error("home layout readback verification failed");
        return { ok: true, revision, layout: clone(valid) };
      } catch (error) {
        try {
          if (previous === null) storage.removeItem(key);
          else storage.setItem(key, previous);
          if (storage.getItem(key) !== previous)
            throw new Error("home layout rollback verification failed");
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
      previewLegacyMigration(defaultLayout) {
        const current = read();
        if (!current.ok) return current;
        let layout;
        try {
          layout = root.HomeLayout.validateLayout(defaultLayout);
        } catch (error) {
          return {
            ok: false,
            code: "INVALID_MIGRATION_PREVIEW",
            message: error.message,
          };
        }
        return {
          ok: true,
          source: current.revision ? "saved" : "legacy-fixed-home",
          requiresConfirmation: current.revision === 0,
          revision: current.revision,
          layout: clone(current.layout || layout),
          unchanged: true,
        };
      },
    });
  }

  root.HomeLayoutRepository = Object.freeze({
    KEY,
    createHomeLayoutRepository,
  });
})(globalThis);
