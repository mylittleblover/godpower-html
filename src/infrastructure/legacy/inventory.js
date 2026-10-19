/* Read-only legacy inventory and dry-run import planning. Never deletes or updates a source. */
const LegacyStorageInventory = (() => {
  const DATABASES = [
    "PoliticsScoreSoundDB_Unified",
    "PoliticsScoreSoundDB_v3",
    "PoliticsScoreSoundDB",
    "PoliticsUiDB",
  ];
  async function digest(bytes) {
    if (!globalThis.crypto?.subtle)
      throw new Error("当前环境无法执行 SHA-256，迁移预检未完成");
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(hash)]
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }
  const utf8 = (value) => new TextEncoder().encode(value);
  async function canonical(value, seen = new Set()) {
    if (value === undefined) return ["undefined"];
    if (
      value === null ||
      ["string", "boolean", "number"].includes(typeof value)
    )
      return value;
    if (value instanceof ArrayBuffer)
      return ["ArrayBuffer", value.byteLength, await digest(value)];
    if (ArrayBuffer.isView(value))
      return [
        "view",
        value.constructor.name,
        await canonical(
          value.buffer.slice(
            value.byteOffset,
            value.byteOffset + value.byteLength,
          ),
        ),
      ];
    if (value instanceof Blob)
      return [
        "Blob",
        value.type,
        value.size,
        await digest(await value.arrayBuffer()),
      ];
    if (value instanceof Date) return ["Date", value.toISOString()];
    if (typeof value !== "object" || seen.has(value))
      throw new Error("迁移来源含不支持或循环的数据结构");
    seen.add(value);
    const result = Array.isArray(value)
      ? [
          "array",
          await Promise.all(
            value.map((entry) => canonical(entry, new Set(seen))),
          ),
        ]
      : [
          "object",
          await Promise.all(
            Object.keys(value)
              .sort()
              .map(async (key) => [
                key,
                await canonical(value[key], new Set(seen)),
              ]),
          ),
        ];
    return result;
  }
  async function hashValue(value) {
    return digest(utf8(JSON.stringify(await canonical(value))));
  }
  function readLocal(storage) {
    const keys = Array.from({ length: storage.length }, (_, index) =>
      storage.key(index),
    )
      .filter(
        (key) => typeof key === "string" && /^(godpower_|politics_)/.test(key),
      )
      .sort();
    return keys.map((key) => ({ key, raw: storage.getItem(key) }));
  }
  async function readDatabase(indexedDB, name) {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(name);
      request.onupgradeneeded = () => {
        request.transaction.abort();
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        reject(
          new Error(`读取来源数据库失败：${name}：${request.error?.message}`),
        );
      request.onblocked = () =>
        reject(new Error(`来源数据库被其他窗口占用：${name}`));
    });
    try {
      const stores = [...db.objectStoreNames];
      if (!stores.length) return [];
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(stores, "readonly");
        const requests = stores.map((store) => ({
          store,
          values: tx.objectStore(store).getAll(),
          keys: tx.objectStore(store).getAllKeys(),
        }));
        tx.oncomplete = () =>
          resolve(
            requests.flatMap(({ store, values, keys }) =>
              values.result.map((payload, index) => ({
                store,
                key: keys.result[index],
                payload,
              })),
            ),
          );
        tx.onabort = () =>
          reject(tx.error || new Error(`来源数据库读取中断：${name}`));
      });
    } finally {
      db.close();
    }
  }
  async function capture({
    storage = globalThis.localStorage,
    indexedDB = globalThis.indexedDB,
    sourceOrigin = globalThis.location?.origin || "unknown",
  } = {}) {
    if (typeof indexedDB?.databases !== "function")
      throw new Error("无法安全枚举旧数据库，迁移预检未完成");
    const localEntries = readLocal(storage);
    const resources = [];
    const sourceManifest = [];
    for (const entry of localEntries) {
      sourceManifest.push({
        id: `local:${entry.key}`,
        kind: "localStorage",
        sha256: await digest(utf8(entry.raw)),
        bytes: utf8(entry.raw).byteLength,
      });
    }
    const existing = new Map(
      (await indexedDB.databases()).map((database) => [
        database.name,
        database.version,
      ]),
    );
    for (const database of DATABASES) {
      const present = existing.has(database);
      sourceManifest.push({
        id: `database:${database}`,
        kind: "database",
        sha256: await hashValue({
          present,
          version: existing.get(database) || null,
        }),
        bytes: 0,
      });
      if (!present) continue;
      for (const record of await readDatabase(indexedDB, database)) {
        const identity = `${database}|${record.store}|${JSON.stringify(await canonical(record.key))}`;
        const resourceId = "legacy-resource-" + (await hashValue(identity));
        const sha256 = await hashValue(record.payload);
        sourceManifest.push({
          id: identity,
          kind: "indexedDB",
          sha256,
          bytes:
            record.payload?.arrayBuffer?.byteLength ??
            record.payload?.size ??
            null,
        });
        resources.push({
          resourceId,
          database,
          store: record.store,
          sourceKey: record.key,
          payload: record.payload,
          sha256,
        });
      }
    }
    sourceManifest.sort((a, b) => a.id.localeCompare(b.id));
    const changedDuringRead =
      JSON.stringify(localEntries) !== JSON.stringify(readLocal(storage));
    return {
      ready: !changedDuringRead,
      sourceOrigin,
      sourceManifest,
      localEntries,
      resources,
      conflicts: changedDuringRead
        ? ["读取期间课堂数据发生变化，请停止操作后重新预检"]
        : [],
    };
  }
  async function prepare(captured, { aggregateId } = {}) {
    if (!captured?.ready) throw new Error("来源预检尚未通过");
    const map = new Map(
      captured.localEntries.map((entry) => [entry.key, entry.raw]),
    );
    const storage = { getItem: (key) => map.get(key) ?? null };
    const raw =
      storage.getItem("godpower_state_v2") ??
      storage.getItem("godpower_state_v1");
    const legacy =
      raw === null ? SchemaMigrations.fromLegacyKeys(storage) : JSON.parse(raw);
    if (!legacy) throw new Error("来源没有可迁移的课堂数据");
    Reliability.validateBackup(legacy);
    const snapshot = SchemaMigrations.migrateBackup(legacy);
    Reliability.validateBackup(snapshot);
    const sourceHash = await hashValue({
      sourceOrigin: captured.sourceOrigin,
      manifest: captured.sourceManifest,
    });
    const resources = captured.resources.slice();
    for (const entry of captured.localEntries) {
      resources.push({
        resourceId: "legacy-local-" + (await hashValue(entry.key)),
        sourceKey: entry.key,
        raw: entry.raw,
      });
    }
    const archives = JSON.parse(
      storage.getItem("politics_settlement_history") || "[]",
    );
    if (
      !Array.isArray(archives) ||
      archives.some(
        (record) =>
          !record || typeof record !== "object" || Array.isArray(record),
      )
    )
      throw new Error("旧档案格式无效，禁止跳过后迁移");
    return {
      migrationId: "legacy-" + sourceHash,
      sourceOrigin: captured.sourceOrigin,
      sourceManifest: captured.sourceManifest,
      aggregateId:
        aggregateId ||
        "legacy-classroom-" +
          (await hashValue(captured.sourceOrigin)).slice(0, 32),
      snapshot,
      resources,
      archives: await Promise.all(
        archives.map(async (data, index) => ({
          archiveId: `legacy-${index}-${await hashValue(data)}`,
          data,
        })),
      ),
    };
  }
  async function verify(plan, options = {}) {
    const captured = await capture({
      ...options,
      sourceOrigin: options.sourceOrigin || plan.sourceOrigin,
    });
    const ok =
      captured.ready &&
      JSON.stringify(captured.sourceManifest) ===
        JSON.stringify(plan.sourceManifest);
    return {
      ok,
      conflicts: ok ? [] : ["来源数据已改变，旧预检结果不可提交，请重新预检"],
    };
  }
  return { capture, prepare, verify };
})();
