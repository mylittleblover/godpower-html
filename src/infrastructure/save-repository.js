/* Atomic browser save library. The active generation rejects stale classroom writes. */
(function installSaveRepository(root) {
  "use strict";
  const stores = [
    "meta",
    "documents",
    "assets",
    "sources",
    "receipts",
    "preferences",
  ];
  const copy = (value) => root.SaveSchema.clone(value);
  const request = (req) =>
    new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  const emptyIndex = () => ({
    kind: "godpower.save-index",
    schemaVersion: 2,
    revision: 0,
    generation: 0,
    activeSaveId: null,
    entries: [],
  });
  const failure = (code, message) =>
    Object.assign(new Error(message || code), { code });
  async function open({ name = "godpower_save_library_v2" } = {}) {
    const opening = root.indexedDB.open(name, 1);
    opening.onupgradeneeded = () => {
      for (const store of stores) opening.result.createObjectStore(store);
    };
    const db = await request(opening);
    db.onversionchange = () => db.close();
    async function transact(names, mode, operation) {
      const tx = db.transaction(names, mode);
      // Always await the durable transaction outcome, including aborts after a successful put.
      const done = new Promise((resolve) => {
        tx.oncomplete = () => resolve(null);
        tx.onabort = () => resolve(tx.error || failure("TRANSACTION_ABORTED"));
        tx.onerror = () => {}; // Abort supplies the final error; requests still reject normally.
      });
      const api = {
        get: (store, key) => request(tx.objectStore(store).get(key)),
        put: (store, key, value) =>
          request(tx.objectStore(store).put(value, key)),
      };
      try {
        const result = await operation(api);
        const error = await done;
        if (error) throw error;
        return result;
      } catch (error) {
        try {
          tx.abort();
        } catch {} // Already completed or aborted.
        await done;
        return {
          ok: false,
          code: error.code || error.name || "STORAGE_ERROR",
          message: error.message,
        };
      }
    }
    const indexOf = async (api) =>
      root.SaveSchema.validateIndex(
        (await api.get("meta", "index")) || emptyIndex(),
      );
    const entry = (doc) => ({
      saveId: doc.saveId,
      name: doc.name,
      revision: doc.revision,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
    const checkGeneration = (index, expected) => {
      if (expected !== undefined && index.generation !== expected)
        throw failure("GENERATION_CONFLICT");
    };
    async function importPreview(preview, { activate = false } = {}) {
      // Hashing is outside the transaction: crypto promises must not make IDB inactive.
      let documents, assets;
      try {
        documents = preview.documents.map(root.SaveSchema.validateV2);
        if (
          !documents.length ||
          new Set(documents.map((d) => d.saveId)).size !== documents.length
        )
          throw failure("INVALID_IMPORT");
        if (
          (await root.SaveMigration.textDigest(preview.sourceText)) !==
          preview.sourceDigest
        )
          throw failure("SOURCE_DIGEST_MISMATCH");
        assets = [];
        for (const asset of preview.assets || []) {
          if (!/^image\/(png|jpeg|webp)$/.test(asset.mimeType))
            throw failure("INVALID_ASSET_TYPE");
          const bytes = Uint8Array.from(atob(asset.dataBase64), (c) =>
            c.charCodeAt(0),
          );
          const hash = [
            ...new Uint8Array(
              await root.crypto.subtle.digest("SHA-256", bytes),
            ),
          ]
            .map((n) => n.toString(16).padStart(2, "0"))
            .join("");
          if (
            asset.resourceId !== "asset-" + hash ||
            asset.sha256 !== hash ||
            asset.byteLength !== bytes.length
          )
            throw failure("ASSET_DIGEST_MISMATCH");
          assets.push({
            ...asset,
            raw: new Blob([bytes], { type: asset.mimeType }),
          });
        }
      } catch (error) {
        return {
          ok: false,
          code: error.code || "INVALID_IMPORT",
          message: error.message,
        };
      }
      return transact(stores, "readwrite", async (api) => {
        const index = await indexOf(api);
        const prior = await api.get("receipts", preview.sourceDigest);
        if (prior)
          return { ok: true, idempotent: true, saveIds: prior.saveIds };
        for (const doc of documents)
          if (await api.get("documents", doc.saveId))
            throw failure("SAVE_ALREADY_EXISTS");
        for (const asset of assets)
          await api.put("assets", asset.resourceId, asset);
        for (const doc of documents) {
          for (const id of doc.assetReferences)
            if (!(await api.get("assets", id)))
              throw failure("MISSING_ASSET", id);
          await api.put("documents", doc.saveId, doc);
          index.entries.push(entry(doc));
        }
        if (activate && index.activeSaveId !== documents[0].saveId) {
          index.activeSaveId = documents[0].saveId;
          index.generation++;
        }
        index.revision++;
        await api.put("sources", preview.sourceDigest, {
          sourceDigest: preview.sourceDigest,
          raw: new Blob([preview.sourceText], { type: "application/json" }),
        });
        await api.put("receipts", preview.sourceDigest, {
          saveIds: documents.map((d) => d.saveId),
          createdAt: new Date().toISOString(),
        });
        await api.put("meta", "index", root.SaveSchema.validateIndex(index));
        return {
          ok: true,
          idempotent: false,
          index,
          saveIds: documents.map((d) => d.saveId),
        };
      });
    }
    return Object.freeze({
      name,
      close: () => db.close(),
      importPreview,
      list: () =>
        transact(["meta"], "readonly", async (api) => ({
          ok: true,
          index: await indexOf(api),
        })),
      load: (saveId) =>
        transact(["documents"], "readonly", async (api) => {
          const doc = await api.get("documents", saveId);
          if (!doc) throw failure("SAVE_NOT_FOUND");
          return { ok: true, document: root.SaveSchema.validateV2(doc) };
        }),
      getSource: (digest) =>
        transact(
          ["sources"],
          "readonly",
          async (api) => (await api.get("sources", digest)) || null,
        ),
      getAsset: (id) =>
        transact(
          ["assets"],
          "readonly",
          async (api) => (await api.get("assets", id)) || null,
        ),
      commit: (
        saveId,
        expectedRevision,
        saveDoc,
        { expectedGeneration } = {},
      ) =>
        transact(["meta", "documents", "assets"], "readwrite", async (api) => {
          const index = await indexOf(api);
          checkGeneration(index, expectedGeneration);
          const old = await api.get("documents", saveId);
          if (!old) throw failure("SAVE_NOT_FOUND");
          if (old.revision !== expectedRevision)
            throw failure("REVISION_CONFLICT");
          if (
            saveDoc.saveId !== saveId ||
            saveDoc.revision !== expectedRevision
          )
            throw failure("INVALID_REVISION");
          const doc = root.SaveSchema.validateV2({
            ...copy(saveDoc),
            revision: expectedRevision + 1,
            updatedAt: new Date().toISOString(),
          });
          for (const id of doc.assetReferences)
            if (!(await api.get("assets", id)))
              throw failure("MISSING_ASSET", id);
          await api.put("documents", saveId, doc);
          index.entries = index.entries.map((e) =>
            e.saveId === saveId ? entry(doc) : e,
          );
          index.revision++;
          await api.put("meta", "index", index);
          return { ok: true, document: doc, index };
        }),
      switchActive: (saveId, { expectedGeneration } = {}) =>
        transact(["meta", "documents"], "readwrite", async (api) => {
          const index = await indexOf(api);
          checkGeneration(index, expectedGeneration);
          const doc = await api.get("documents", saveId);
          if (!doc) throw failure("SAVE_NOT_FOUND");
          root.SaveSchema.validateV2(doc);
          if (index.activeSaveId !== saveId) {
            index.activeSaveId = saveId;
            index.generation++;
            index.revision++;
            await api.put("meta", "index", index);
          }
          return { ok: true, index, document: doc };
        }),
      loadPreferences: () =>
        transact(["preferences"], "readonly", async (api) => ({
          ok: true,
          preferences: (await api.get("preferences", "global")) || {
            schemaVersion: 1,
            revision: 0,
            values: {},
          },
        })),
      savePreferences: (values, { expectedRevision } = {}) =>
        transact(["preferences"], "readwrite", async (api) => {
          root.SaveSchema.safeTree(values);
          if (!values || typeof values !== "object" || Array.isArray(values))
            throw failure("INVALID_PREFERENCES");
          const old = (await api.get("preferences", "global")) || {
            revision: 0,
          };
          if (
            expectedRevision !== undefined &&
            old.revision !== expectedRevision
          )
            throw failure("REVISION_CONFLICT");
          const preferences = {
            schemaVersion: 1,
            revision: old.revision + 1,
            values: copy(values),
          };
          await api.put("preferences", "global", preferences);
          return { ok: true, preferences };
        }),
    });
  }
  root.SaveRepository = Object.freeze({ open });
})(globalThis);
