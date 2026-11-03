/* Read-only compatibility export. Original bytes and keys are never migrated here. */
(function installLegacyTeachingBackup(root) {
  "use strict";
  const keys = Object.freeze([
    "godpower_teaching_schedule_v1",
    "godpower_active_classroom_context_v1",
    "godpower_classroom_roster_v1",
  ]);
  async function collect({
    storage = root.localStorage,
    openRepository = () => root.TeachingResourceRepository.open(),
    maxBytes = 128 * 1024 * 1024,
  } = {}) {
    const rawStorage = {};
    let size = 0;
    for (const key of keys) {
      const raw = storage.getItem(key);
      rawStorage[key] = raw;
      size += new TextEncoder().encode(raw ?? "").byteLength;
    }
    if (size > maxBytes)
      throw Error("旧教学数据超过单次导出上限（128 MiB），未生成不完整备份。");
    const repository = await openRepository();
    try {
      const entries = await repository.exportAll();
      const resources = [];
      for (const entry of entries) {
        if (!entry?.blob) throw Error("旧资源缺失，不能生成完整备份。");
        size += entry.blob.size;
        if (size > maxBytes)
          throw Error(
            "旧教学资源超过单次导出上限（128 MiB），未生成不完整备份。",
          );
        const bytes = new Uint8Array(await entry.blob.arrayBuffer());
        const hash = [
          ...new Uint8Array(await root.crypto.subtle.digest("SHA-256", bytes)),
        ]
          .map((v) => v.toString(16).padStart(2, "0"))
          .join("");
        if (
          hash !== entry.sha256 ||
          (entry.byteSize !== undefined && entry.byteSize !== bytes.length)
        )
          throw Error("旧资源校验失败，原数据保持不变。");
        let binary = "";
        for (let i = 0; i < bytes.length; i += 0x8000)
          binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
        const { blob, ...metadata } = entry;
        resources.push({ ...metadata, dataBase64: btoa(binary) });
      }
      return {
        format: "godpower-legacy-teaching-backup",
        schemaVersion: 1,
        rawStorage,
        resources,
      };
    } finally {
      repository.close();
    }
  }
  root.LegacyTeachingBackup = Object.freeze({ keys, collect });
})(globalThis);
