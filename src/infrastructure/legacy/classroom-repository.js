/* Storage adapters own serialization and migration receipts; domain rules stay separate. */
const ClassroomRepository = (() => {
  function writeVerified(storage, key, data) {
    try {
      const text = JSON.stringify(data);
      storage.setItem(key, text);
      if (storage.getItem(key) !== text) throw new Error("保存后校验不一致");
      return { ok: true };
    } catch (error) {
      return { ok: false, error: String(error?.message || error) };
    }
  }

  function appendArchive(storage, record) {
    try {
      const raw = storage.getItem("politics_settlement_history");
      const archives = raw == null ? [] : JSON.parse(raw);
      if (!Array.isArray(archives))
        throw new Error("原有归档格式损坏，请先导出恢复");
      const sameArchive = (old) =>
        record.seasonId && old?.seasonId
          ? old.seasonId === record.seasonId
          : !record.seasonId && old?.id === record.id;
      const existing = archives.find(sameArchive);
      if (existing) {
        const comparableSnapshot = (entry) => {
          const data = entry?.clearedData;
          if (!data || !Array.isArray(data.groups)) return null;
          return JSON.stringify({
            groups: data.groups,
            round: data.round,
            itemGlobal: data.itemGlobal,
            picker: data.picker,
          });
        };
        const previousSnapshot = comparableSnapshot(existing);
        const retrySnapshot = comparableSnapshot(record);
        if (previousSnapshot !== null && previousSnapshot === retrySnapshot)
          return { ok: true, idempotent: true };
        return {
          ok: false,
          error: "本赛季已有不同内容的正式归档，已保留原档案。",
        };
      }
      return writeVerified(storage, "politics_settlement_history", [
        record,
        ...archives,
      ]);
    } catch (error) {
      return { ok: false, error: String(error?.message || error) };
    }
  }

  function parse(raw, label) {
    try {
      return JSON.parse(raw);
    } catch (error) {
      throw new Error(`${label}无法解析：${error.message}`);
    }
  }

  function loadOrMigrate(storage, options) {
    const {
      currentKey,
      legacyKey,
      receiptKey,
      migrate,
      validate,
      fallbackData = null,
      fallbackSource = "legacy-mirror-keys",
      now = () => new Date(),
    } = options;
    let previousTarget = null;
    let targetWasWritten = false;
    let stage = "read-current";
    let candidate = null;
    try {
      const targetRaw = storage.getItem(currentKey);
      if (targetRaw !== null) {
        previousTarget = targetRaw;
        stage = "validate-current";
        const original = parse(targetRaw, "当前主存档");
        const current = migrate(original);
        validate(current);
        if (original.schemaVersion === current.schemaVersion)
          return { status: "current", data: current, sourceKey: currentKey };
        candidate = current;
        stage = "write-current-upgrade";
        const upgraded = JSON.stringify(current);
        storage.setItem(currentKey, upgraded);
        targetWasWritten = true;
        if (storage.getItem(currentKey) !== upgraded)
          throw new Error("当前主存档升级后的校验不一致");
        validate(parse(upgraded, "升级后的主存档"));
        return {
          status: "migrated-in-place",
          data: current,
          sourceKey: currentKey,
        };
      }

      stage = "read-legacy";
      const sourceRaw = legacyKey ? storage.getItem(legacyKey) : null;
      const source =
        sourceRaw === null
          ? typeof fallbackData === "function"
            ? fallbackData()
            : fallbackData
          : parse(sourceRaw, "旧版主存档");
      if (source == null)
        return { status: "missing", data: null, sourceKey: null };

      stage = "prepare-migration";
      const migrated = migrate(source);
      validate(migrated);
      candidate = migrated;
      const serialized = JSON.stringify(migrated);
      stage = "write-target";
      storage.setItem(currentKey, serialized);
      targetWasWritten = true;
      if (storage.getItem(currentKey) !== serialized)
        throw new Error("迁移后的主存档读回校验不一致");
      validate(parse(storage.getItem(currentKey), "迁移后的主存档"));

      const sourceLabel = sourceRaw === null ? fallbackSource : legacyKey;
      const receipt = {
        migrationId: "classroom-envelope-v1-to-v2",
        status: "complete",
        source: sourceLabel,
        target: currentKey,
        schemaVersion: migrated.schemaVersion,
        groups: migrated.groups.length,
        completedAt: now().toISOString(),
      };
      stage = "write-receipt";
      const receiptResult = writeVerified(storage, receiptKey, receipt);
      return {
        status: "migrated",
        data: migrated,
        sourceKey: sourceLabel,
        receiptPersisted: receiptResult.ok,
        receiptError: receiptResult.error || null,
      };
    } catch (error) {
      let rollbackError = null;
      if (targetWasWritten) {
        try {
          if (previousTarget === null) storage.removeItem(currentKey);
          else storage.setItem(currentKey, previousTarget);
        } catch (restoreError) {
          rollbackError = String(restoreError?.message || restoreError);
        }
      }
      return {
        status: "failed",
        data: candidate,
        sourceKey: legacyKey || null,
        stage,
        sourceValidated: !!candidate,
        rollbackError,
        error:
          String(error?.message || error) +
          (rollbackError ? "；目标回滚未完成：" + rollbackError : ""),
      };
    }
  }

  return { writeVerified, appendArchive, loadOrMigrate };
})();
