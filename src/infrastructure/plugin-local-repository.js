(function installPluginLocalRepository(root) {
  "use strict";
  const KEY = "godpower_plugins_v1";
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const fail = (message) => {
    throw new Error(message);
  };
  function createPluginLocalRepository(storage) {
    if (
      !storage ||
      typeof storage.getItem !== "function" ||
      typeof storage.setItem !== "function"
    )
      fail("plugin storage is unavailable");
    function read() {
      const raw = storage.getItem(KEY);
      if (raw === null) return { schemaVersion: 1, records: {} };
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        fail("plugin repository is corrupt; existing data was left untouched");
      }
      if (
        !parsed ||
        parsed.schemaVersion !== 1 ||
        !parsed.records ||
        typeof parsed.records !== "object" ||
        Array.isArray(parsed.records)
      )
        fail(
          "plugin repository schema is invalid; existing data was left untouched",
        );
      return parsed;
    }
    function commit(next) {
      const previous = storage.getItem(KEY);
      const encoded = JSON.stringify(next);
      try {
        storage.setItem(KEY, encoded);
        if (storage.getItem(KEY) !== encoded)
          fail("plugin repository readback verification failed");
      } catch (error) {
        try {
          if (previous === null) storage.removeItem(KEY);
          else storage.setItem(KEY, previous);
          if (storage.getItem(KEY) !== previous)
            throw new Error("plugin repository rollback readback failed");
        } catch (rollbackError) {
          throw new Error(
            `${error.message}; rollback failed: ${rollbackError.message}`,
          );
        }
        throw error;
      }
    }
    return Object.freeze({
      load(id) {
        const value = read().records[id];
        return value ? clone(value) : null;
      },
      list() {
        return Object.values(read().records).map(clone);
      },
      save(id, value) {
        const current = read();
        const next = {
          schemaVersion: 1,
          records: { ...current.records, [id]: clone(value) },
        };
        commit(next);
      },
      delete(id) {
        const current = read();
        if (!(id in current.records)) return false;
        const records = { ...current.records };
        delete records[id];
        commit({ schemaVersion: 1, records });
        return true;
      },
    });
  }
  root.GodPowerPluginLocalRepository = Object.freeze({
    createPluginLocalRepository,
    key: KEY,
  });
})(globalThis);
