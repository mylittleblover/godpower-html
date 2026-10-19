/* Legacy audio copy: source databases remain read-only; destination writes are atomic. */
const LegacyAudioMigration = (() => {
  function alias(id) {
    const fixed = {
      bgm_intro_0: "bgm_set_0_intro_normal",
      bgm_thinking: "bgm_set_0_thinking",
      bgm_battle: "bgm_set_0_battle",
      bgm_victory: "bgm_set_0_victory",
    };
    return (
      fixed[id] ||
      (id.startsWith("bgm_trans_") ? `bgm_set_0_trans_${id.slice(10)}` : id)
    );
  }
  function openExisting(indexedDB, name) {
    return new Promise((resolve, reject) => {
      let missing = false;
      const request = indexedDB.open(name);
      request.onupgradeneeded = () => {
        missing = true;
        request.transaction.abort();
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => (missing ? resolve(null) : reject(request.error));
      request.onblocked = () =>
        reject(new Error(`旧音频数据库被其他窗口占用：${name}`));
    });
  }
  async function readSource(indexedDB, name) {
    const source = await openExisting(indexedDB, name);
    if (!source) return [];
    try {
      if (!source.objectStoreNames.contains("sounds")) return [];
      return await new Promise((resolve, reject) => {
        const tx = source.transaction("sounds", "readonly");
        const request = tx.objectStore("sounds").getAll();
        tx.oncomplete = () => resolve(request.result || []);
        tx.onabort = () =>
          reject(tx.error || new Error(`无法读取旧音频：${name}`));
      });
    } finally {
      source.close();
    }
  }
  async function run({
    indexedDB = globalThis.indexedDB,
    destination,
    storage,
    sourceNames = ["PoliticsScoreSoundDB_v3", "PoliticsScoreSoundDB"],
    markerKey = "politics_audio_migration_v2",
  }) {
    if (storage.getItem(markerKey) === "1")
      return { status: "current", copied: 0, skipped: 0 };
    if (!destination?.objectStoreNames.contains("sounds"))
      throw new Error("目标音频数据库尚未准备好");
    const records = new Map();
    for (const name of sourceNames) {
      for (const record of await readSource(indexedDB, name)) {
        if (
          typeof record?.id !== "string" ||
          !record.id ||
          !(record.arrayBuffer instanceof ArrayBuffer)
        )
          throw new Error(`旧音频记录格式无效，已保留来源：${name}`);
        const id = alias(record.id);
        if (!records.has(id)) records.set(id, { ...record, id });
      }
    }
    const copiedRecords = [];
    const counts = await new Promise((resolve, reject) => {
      const tx = destination.transaction("sounds", "readwrite");
      const store = tx.objectStore("sounds");
      let copied = 0,
        skipped = 0,
        failure = null;
      for (const record of records.values()) {
        const existing = store.get(record.id);
        existing.onsuccess = () => {
          try {
            if (existing.result !== undefined) {
              skipped++;
              return;
            }
            store.add(record);
            copiedRecords.push(record);
            copied++;
          } catch (error) {
            failure = error;
            tx.abort();
          }
        };
      }
      tx.oncomplete = () => resolve({ copied, skipped });
      tx.onabort = () =>
        reject(failure || tx.error || new Error("旧音频复制事务未完成"));
    });
    if (copiedRecords.length)
      await new Promise((resolve, reject) => {
        const tx = destination.transaction("sounds", "readonly");
        const checks = copiedRecords.map((record) => ({
          record,
          request: tx.objectStore("sounds").get(record.id),
        }));
        tx.oncomplete = () => {
          for (const { record, request } of checks) {
            const actual = request.result?.arrayBuffer;
            const expected = new Uint8Array(record.arrayBuffer);
            if (
              !(actual instanceof ArrayBuffer) ||
              actual.byteLength !== expected.byteLength ||
              new Uint8Array(actual).some(
                (byte, index) => byte !== expected[index],
              )
            ) {
              reject(new Error("旧音频复制后读回校验失败：" + record.id));
              return;
            }
          }
          resolve();
        };
        tx.onabort = () => reject(tx.error || new Error("旧音频读回校验中断"));
      });
    // A failed marker write is retryable: the next run skips already-copied records.
    storage.setItem(markerKey, "1");
    if (storage.getItem(markerKey) !== "1")
      throw new Error("音频已复制，但迁移完成标记校验失败");
    return { status: "migrated", ...counts };
  }
  return { run };
})();
