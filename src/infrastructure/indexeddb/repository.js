/* Transactional repository port shared by HTML and Electron's authoritative renderer.
   It is opt-in until legacy import and async command cutover have been verified. */
const TransactionalRepository = (() => {
  const STORES = [
    "aggregates",
    "commands",
    "events",
    "archives",
    "resources",
    "migrations",
  ];
  const KEYS = [
    "id",
    "commandId",
    "eventId",
    "archiveId",
    "resourceId",
    "migrationId",
  ];
  function fault(code, message) {
    const error = new Error(message);
    error.code = code;
    return error;
  }
  function identifier(value, label) {
    if (typeof value !== "string" || !value.trim() || value.length > 200)
      throw fault(
        "INVALID_REQUEST",
        `${label} must be a bounded, non-empty string`,
      );
    return value;
  }
  async function fingerprint(value) {
    if (!globalThis.crypto?.subtle)
      throw fault(
        "HASH_UNAVAILABLE",
        "SHA-256 is unavailable in this browser context",
      );
    const bytes = new TextEncoder().encode(JSON.stringify(value));
    const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(digest)]
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }
  function transaction(db, names, operation) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(names, "readwrite");
      let result = null;
      let failure = null;
      const abort = (error) => {
        failure =
          typeof error?.code === "string"
            ? error
            : fault("TRANSACTION_ABORTED", String(error?.message || error));
        try {
          tx.abort();
        } catch (abortError) {
          reject(failure || abortError);
        }
      };
      const guard = (fn) => (event) => {
        try {
          fn(event);
        } catch (error) {
          abort(error);
        }
      };
      tx.oncomplete = () => resolve(result);
      tx.onabort = () =>
        reject(
          failure ||
            fault(
              "TRANSACTION_ABORTED",
              tx.error?.message || "IndexedDB transaction aborted",
            ),
        );
      tx.onerror = () => {
        failure ||= fault(
          "TRANSACTION_ABORTED",
          tx.error?.message || "IndexedDB request failed",
        );
      };
      try {
        operation(
          tx,
          (value) => {
            result = value;
          },
          abort,
          guard,
        );
      } catch (error) {
        abort(error);
      }
    });
  }
  function readOne(db, store, key) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, "readonly");
      const request = tx.objectStore(store).get(key);
      tx.oncomplete = () => resolve(request.result ?? null);
      tx.onabort = () =>
        reject(
          fault("READ_FAILED", tx.error?.message || "IndexedDB read aborted"),
        );
      tx.onerror = () =>
        reject(
          fault(
            "READ_FAILED",
            request.error?.message || "IndexedDB read failed",
          ),
        );
    });
  }
  async function open({
    name = "godpower-domain-v1",
    indexedDB = globalThis.indexedDB,
    validateSnapshot = () => {},
  } = {}) {
    identifier(name, "database name");
    if (!indexedDB) throw fault("UNAVAILABLE", "IndexedDB is unavailable");
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(name, 1);
      request.onupgradeneeded = () => {
        const database = request.result;
        STORES.forEach((store, index) => {
          if (!database.objectStoreNames.contains(store))
            database.createObjectStore(store, { keyPath: KEYS[index] });
        });
        const events = request.transaction.objectStore("events");
        if (!events.indexNames.contains("aggregateId"))
          events.createIndex("aggregateId", "aggregateId");
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        reject(
          fault(
            "OPEN_FAILED",
            request.error?.message || "IndexedDB open failed",
          ),
        );
      request.onblocked = () =>
        reject(
          fault(
            "OPEN_BLOCKED",
            "Another application window is blocking the database upgrade",
          ),
        );
    });
    db.onversionchange = () => db.close();

    async function commit(request) {
      const {
        commandId,
        aggregateId,
        expectedRevision,
        snapshot,
        events = [],
        archive = null,
        intent = null,
      } = structuredClone(request);
      identifier(commandId, "commandId");
      identifier(aggregateId, "aggregateId");
      if (!Number.isSafeInteger(expectedRevision) || expectedRevision < 0)
        throw fault(
          "INVALID_REQUEST",
          "expectedRevision must be a non-negative safe integer",
        );
      validateSnapshot(snapshot);
      if (!Array.isArray(events))
        throw fault("INVALID_REQUEST", "events must be an array");
      for (const event of events) {
        identifier(event?.eventId, "eventId");
        if (event.commandId !== commandId)
          throw fault("INVALID_REQUEST", "event must belong to this command");
      }
      if (archive) identifier(archive.archiveId, "archiveId");
      const requestHash = await fingerprint({
        commandId,
        aggregateId,
        expectedRevision,
        snapshot,
        events,
        archive,
        intent,
      });
      const intentHash = intent === null ? null : await fingerprint(intent);
      return transaction(
        db,
        ["aggregates", "commands", "events", "archives"],
        (tx, done, abort, guard) => {
          const commands = tx.objectStore("commands");
          const existing = commands.get(commandId);
          existing.onsuccess = guard(() => {
            if (existing.result) {
              if (
                intentHash !== null
                  ? existing.result.intentHash !== intentHash ||
                    existing.result.aggregateId !== aggregateId
                  : existing.result.requestHash !== requestHash
              )
                return abort(
                  fault(
                    "COMMAND_REUSED",
                    "Command ID was reused for a different request",
                  ),
                );
              return done({ ...existing.result.result, duplicate: true });
            }
            const aggregates = tx.objectStore("aggregates");
            const current = aggregates.get(aggregateId);
            current.onsuccess = guard(() => {
              const revision = current.result?.revision || 0;
              if (revision !== expectedRevision)
                return abort(
                  fault(
                    "REVISION_CONFLICT",
                    `Expected revision ${expectedRevision}, found ${revision}`,
                  ),
                );
              if (!Number.isSafeInteger(revision + 1))
                return abort(
                  fault(
                    "REVISION_CONFLICT",
                    "Revision exhausted safe integer range",
                  ),
                );
              const result = {
                ok: true,
                revision: revision + 1,
                duplicate: false,
                eventsPersisted: events.length > 0,
              };
              aggregates.put({
                id: aggregateId,
                revision: revision + 1,
                snapshot,
              });
              for (const event of events)
                tx.objectStore("events").add({ ...event, aggregateId });
              if (archive) tx.objectStore("archives").add(archive);
              commands.add({
                commandId,
                aggregateId,
                requestHash,
                intentHash,
                result,
              });
              done(result);
            });
          });
        },
      );
    }

    async function importSnapshot(request) {
      // Keep caller mutations outside the transaction while hashes are calculated.
      // Resource clone errors are normalized without opening/writing a transaction.
      let captured;
      try {
        captured = structuredClone(request);
      } catch (error) {
        throw fault("TRANSACTION_ABORTED", String(error?.message || error));
      }
      const {
        migrationId,
        sourceManifest,
        aggregateId,
        snapshot,
        archives = [],
        resources = [],
      } = captured;
      identifier(migrationId, "migrationId");
      identifier(aggregateId, "aggregateId");
      validateSnapshot(snapshot);
      if (
        !Array.isArray(sourceManifest) ||
        !Array.isArray(archives) ||
        !Array.isArray(resources)
      )
        throw fault("INVALID_REQUEST", "Migration collections must be arrays");
      for (const archive of archives)
        identifier(archive?.archiveId, "archiveId");
      for (const resource of resources)
        identifier(resource?.resourceId, "resourceId");
      const sourceHash = await fingerprint({ aggregateId, sourceManifest });
      return transaction(
        db,
        ["aggregates", "archives", "resources", "migrations"],
        (tx, done, abort, guard) => {
          const migrations = tx.objectStore("migrations");
          const receipt = migrations.get(migrationId);
          receipt.onsuccess = guard(() => {
            if (receipt.result) {
              if (receipt.result.sourceHash !== sourceHash)
                return abort(
                  fault(
                    "MIGRATION_REUSED",
                    "Migration ID was reused with different source data",
                  ),
                );
              return done({ ...receipt.result, duplicate: true });
            }
            const aggregates = tx.objectStore("aggregates");
            const current = aggregates.get(aggregateId);
            current.onsuccess = guard(() => {
              if (current.result)
                return abort(
                  fault(
                    "MIGRATION_CONFLICT",
                    "Destination classroom already contains data",
                  ),
                );
              aggregates.add({ id: aggregateId, revision: 1, snapshot });
              for (const archive of archives)
                tx.objectStore("archives").add(archive);
              for (const resource of resources)
                tx.objectStore("resources").add(resource);
              const result = {
                migrationId,
                sourceHash,
                aggregateId,
                complete: true,
                archives: archives.length,
                resources: resources.length,
                completedAt: new Date().toISOString(),
              };
              migrations.add(result);
              done(result);
            });
          });
        },
      );
    }
    async function recordMigrationStatus(plan, report) {
      const { migrationId, aggregateId, sourceManifest } = structuredClone({
        migrationId: plan.migrationId,
        aggregateId: plan.aggregateId,
        sourceManifest: plan.sourceManifest,
      });
      const check = structuredClone(report);
      identifier(migrationId, "migrationId");
      identifier(aggregateId, "aggregateId");
      const allowed = [
        "VERIFYING",
        "VERIFIED",
        "DESTINATION_INVALID",
        "STAGED_SOURCE_CHANGED",
        "CANCELLED_STAGED",
      ];
      if (!allowed.includes(check?.status))
        throw fault("INVALID_REQUEST", "Unknown migration verification status");
      const sourceHash = await fingerprint({ aggregateId, sourceManifest });
      return transaction(
        db,
        ["migrations", "aggregates"],
        (tx, done, abort, guard) => {
          const store = tx.objectStore("migrations");
          const request = store.get(migrationId);
          request.onsuccess = guard(() => {
            const receipt = request.result;
            if (
              !receipt?.complete ||
              receipt.aggregateId !== aggregateId ||
              receipt.sourceHash !== sourceHash
            )
              return abort(
                fault(
                  "MIGRATION_REUSED",
                  "Verification does not match an imported source",
                ),
              );
            const current = tx.objectStore("aggregates").get(aggregateId);
            current.onsuccess = guard(() => {
              if (!current.result || current.result.revision !== 1)
                return abort(
                  fault(
                    "REVISION_CONFLICT",
                    "Staging data changed after import",
                  ),
                );
              if (
                check.status === "VERIFIED" &&
                (!check.sourceRechecked ||
                  !check.integrity?.ok ||
                  check.integrity.verifiedArchives !== receipt.archives ||
                  check.integrity.verifiedResources !== receipt.resources)
              )
                return abort(
                  fault(
                    "INVALID_REQUEST",
                    "Verified staging requires complete readback and source checks",
                  ),
                );
              const verification = {
                status: check.status,
                checkedAt: new Date().toISOString(),
                sourceHash,
                sourceRechecked: check.sourceRechecked === true,
                authorityChanged: false,
                integrity: check.integrity || null,
              };
              store.put({ ...receipt, verification });
              done(verification);
            });
          });
        },
      );
    }
    function listEvents(aggregateId) {
      return new Promise((resolve, reject) => {
        const tx = db.transaction("events", "readonly");
        const request = tx
          .objectStore("events")
          .index("aggregateId")
          .getAll(aggregateId);
        tx.oncomplete = () => resolve(request.result);
        tx.onabort = () =>
          reject(
            fault("READ_FAILED", tx.error?.message || "Event read aborted"),
          );
      });
    }
    async function findCommand(commandId, intent) {
      identifier(commandId, "commandId");
      const intentHash = await fingerprint(structuredClone(intent));
      const record = await readOne(db, "commands", commandId);
      if (!record) return null;
      if (record.intentHash !== intentHash)
        throw fault(
          "COMMAND_REUSED",
          "Command ID was reused for a different intent",
        );
      return { ...record.result, duplicate: true };
    }
    return {
      commit,
      findCommand,
      importSnapshot,
      recordMigrationStatus,
      listEvents,
      read: (aggregateId) => readOne(db, "aggregates", aggregateId),
      readArchive: (archiveId) => readOne(db, "archives", archiveId),
      readResource: (resourceId) => readOne(db, "resources", resourceId),
      getMigration: (migrationId) => readOne(db, "migrations", migrationId),
      close: () => db.close(),
    };
  }
  return { open };
})();
