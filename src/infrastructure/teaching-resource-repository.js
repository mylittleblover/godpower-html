(function installTeachingResourceRepository(root) {
  "use strict";
  const DATABASE = "godpower_teaching_resources_v1";
  const STORE = "resources";
  const BLOB_STORE = "resourceBlobs";
  const fault = (code, message) => Object.assign(new Error(message), { code });

  function requestValue(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        reject(
          request.error || fault("REQUEST_FAILED", "IndexedDB request failed"),
        );
    });
  }

  function transactionDone(transaction) {
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onabort = () =>
        reject(
          transaction.error ||
            fault("TRANSACTION_ABORTED", "Resource transaction was aborted"),
        );
      transaction.onerror = () =>
        reject(
          transaction.error ||
            fault("TRANSACTION_FAILED", "Resource transaction failed"),
        );
    });
  }

  function hex(bytes) {
    return [...new Uint8Array(bytes)]
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("");
  }

  async function open({
    indexedDB = root.indexedDB,
    crypto = root.crypto,
    storageManager = root.navigator?.storage,
    now = () => new Date(),
  } = {}) {
    if (!indexedDB) throw fault("UNAVAILABLE", "IndexedDB is unavailable");
    if (!crypto?.subtle)
      throw fault("CRYPTO_UNAVAILABLE", "SHA-256 is unavailable");
    const database = await new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE, 1);
      request.onupgradeneeded = () => {
        const metadata = request.result.createObjectStore(STORE, {
          keyPath: "resourceId",
        });
        metadata.createIndex("profileId", "profileId");
        metadata.createIndex("classroomId", "classroomId");
        metadata.createIndex("subjectId", "subjectId");
        metadata.createIndex("sha256", "sha256", { unique: true });
        request.result.createObjectStore(BLOB_STORE, { keyPath: "resourceId" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        reject(
          fault(
            "OPEN_FAILED",
            request.error?.message || "Resource database could not open",
          ),
        );
      request.onblocked = () =>
        reject(
          fault(
            "OPEN_BLOCKED",
            "Another window is blocking the resource database",
          ),
        );
    });
    database.onversionchange = () => database.close();

    async function hash(bytes) {
      return hex(await crypto.subtle.digest("SHA-256", bytes));
    }

    async function prepare(input) {
      const file = input?.file;
      if (!file || typeof file.arrayBuffer !== "function")
        throw fault("INVALID_FILE", "A local File is required");
      if (file.size > root.TeachingResource.MAX_BYTES)
        throw fault("TOO_LARGE", "Each resource must be 20 MiB or smaller");
      const bytes = new Uint8Array(await file.arrayBuffer());
      const metadata = root.TeachingResource.validateFile(
        {
          resourceId:
            input.resourceId || root.StableIdentity.createResourceId(),
          profileId: input.profileId,
          classroomId: input.classroomId,
          subjectId: input.subjectId,
          title: input.title || file.name.replace(/\.[^.]+$/, ""),
          tags: input.tags || [],
          fileName: file.name,
          mimeType: file.type,
          byteSize: bytes.byteLength,
          sha256: await hash(bytes),
          importedAt: input.importedAt || now().toISOString(),
          schemaVersion: 1,
        },
        bytes,
      );
      if (
        input.expectedSha256 &&
        input.expectedSha256.toLowerCase() !== metadata.sha256
      )
        throw fault(
          "INTEGRITY_MISMATCH",
          "Imported resource digest does not match its bytes",
        );
      if (
        input.expectedByteSize !== undefined &&
        input.expectedByteSize !== metadata.byteSize
      )
        throw fault(
          "INTEGRITY_MISMATCH",
          "Imported resource size does not match its bytes",
        );
      return {
        ...metadata,
        blob: new Blob([bytes], { type: metadata.mimeType }),
      };
    }

    async function addBatch(files) {
      if (!Array.isArray(files) || !files.length)
        throw fault("INVALID_BATCH", "At least one file is required");
      // Preflight every entry before opening a write transaction, so one bad file
      // cannot leave a partial import behind.
      const prepared = await Promise.all(files.map(prepare));
      const ids = new Set();
      const hashes = new Set();
      for (const item of prepared) {
        if (ids.has(item.resourceId))
          throw fault("DUPLICATE_ID", "Resource IDs in a batch must be unique");
        if (hashes.has(item.sha256))
          throw fault(
            "DUPLICATE_CONTENT",
            "The batch contains duplicate file content",
          );
        ids.add(item.resourceId);
        hashes.add(item.sha256);
      }
      if (typeof storageManager?.estimate === "function") {
        try {
          const estimate = await storageManager.estimate();
          const requestedBytes = prepared.reduce(
            (sum, item) => sum + item.byteSize,
            0,
          );
          if (
            Number.isFinite(estimate.quota) &&
            Number.isFinite(estimate.usage) &&
            estimate.usage + requestedBytes > estimate.quota
          )
            throw fault(
              "QUOTA_PREDICTED",
              "Browser storage estimate indicates insufficient space",
            );
        } catch (error) {
          if (error?.code === "QUOTA_PREDICTED") throw error;
          // Estimates are advisory; the actual transaction remains authoritative.
        }
      }
      const tx = database.transaction([STORE, BLOB_STORE], "readwrite");
      const done = transactionDone(tx);
      const store = tx.objectStore(STORE);
      const existingChecks = prepared.map((item) =>
        requestValue(store.index("sha256").get(item.sha256)),
      );
      const existing = await Promise.all(existingChecks);
      if (existing.some(Boolean)) {
        tx.abort();
        try {
          await done;
        } catch {
          /* abort is expected during duplicate preflight */
        }
        throw fault(
          "DUPLICATE_CONTENT",
          "Identical content already exists; existing resources were not changed",
        );
      }
      for (const item of prepared) {
        const { blob, ...metadata } = item;
        store.add(metadata);
        tx.objectStore(BLOB_STORE).add({ resourceId: item.resourceId, blob });
      }
      await done;
      try {
        const readBack = await Promise.all(
          prepared.map((item) => get(item.resourceId)),
        );
        for (let index = 0; index < prepared.length; index++) {
          const actual = readBack[index];
          if (
            !actual ||
            actual.sha256 !== prepared[index].sha256 ||
            actual.byteSize !== prepared[index].byteSize ||
            actual.blob.size !== prepared[index].byteSize
          )
            throw fault(
              "READBACK_MISMATCH",
              "Resource readback verification failed",
            );
          if (
            (await hash(new Uint8Array(await actual.blob.arrayBuffer()))) !==
            prepared[index].sha256
          )
            throw fault(
              "READBACK_MISMATCH",
              "Resource bytes do not match their SHA-256 digest",
            );
        }
        return readBack;
      } catch (error) {
        const rollback = database.transaction([STORE, BLOB_STORE], "readwrite");
        const rollbackDone = transactionDone(rollback);
        for (const item of prepared) {
          rollback.objectStore(STORE).delete(item.resourceId);
          rollback.objectStore(BLOB_STORE).delete(item.resourceId);
        }
        await rollbackDone;
        throw error;
      }
    }

    async function get(resourceId) {
      const tx = database.transaction([STORE, BLOB_STORE], "readonly");
      const done = transactionDone(tx);
      const [metadata, storedBlob] = await Promise.all([
        requestValue(tx.objectStore(STORE).get(resourceId)),
        requestValue(tx.objectStore(BLOB_STORE).get(resourceId)),
      ]);
      await done;
      return metadata && storedBlob
        ? { ...metadata, blob: storedBlob.blob }
        : null;
    }

    async function list(filter = {}) {
      const tx = database.transaction(STORE, "readonly");
      const done = transactionDone(tx);
      const all = await requestValue(tx.objectStore(STORE).getAll());
      await done;
      const query = String(filter.query || "")
        .trim()
        .toLocaleLowerCase();
      return all
        .filter(
          (item) =>
            (!filter.profileId || item.profileId === filter.profileId) &&
            (!filter.classroomId || item.classroomId === filter.classroomId) &&
            (!filter.subjectId || item.subjectId === filter.subjectId),
        )
        .filter(
          (item) =>
            !query ||
            [item.title, item.subjectId, item.fileName, ...item.tags].some(
              (value) => value.toLocaleLowerCase().includes(query),
            ),
        )
        .sort((left, right) => right.importedAt.localeCompare(left.importedAt));
    }

    async function remove(resourceId) {
      const tx = database.transaction([STORE, BLOB_STORE], "readwrite");
      const done = transactionDone(tx);
      tx.objectStore(STORE).delete(resourceId);
      tx.objectStore(BLOB_STORE).delete(resourceId);
      await done;
    }

    async function exportAll(filter = {}) {
      const metadata = await list(filter);
      return Promise.all(metadata.map((item) => get(item.resourceId)));
    }

    return Object.freeze({
      addBatch,
      get,
      list,
      remove,
      exportAll,
      close: () => database.close(),
    });
  }

  root.TeachingResourceRepository = Object.freeze({ DATABASE, open });
})(globalThis);
