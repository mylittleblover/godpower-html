/* Pure, additive migrations for the legacy classroom envelope. */
const SchemaMigrations = (() => {
  const CURRENT_SCHEMA_VERSION = 2;
  const LEGACY_SCHEMA_VERSION = 1;

  function copy(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function parseKey(storage, key, fallback) {
    const raw = storage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  }

  function optionalNumber(storage, key) {
    const raw = storage.getItem(key);
    return raw == null || raw === "" ? undefined : Number(raw);
  }

  function optionalBoolean(storage, key) {
    const raw = storage.getItem(key);
    return raw == null ? undefined : raw === "true";
  }

  function fromLegacyKeys(storage, { now = () => new Date() } = {}) {
    const groups = parseKey(storage, "politics_groups_data", null);
    if (!Array.isArray(groups) || !groups.length) return null;
    const history =
      parseKey(storage, "politics_history_stack_v26", null) ??
      parseKey(storage, "politics_history_v26", []);
    return {
      schemaVersion: LEGACY_SCHEMA_VERSION,
      timestamp: now().toISOString(),
      groups,
      picker: parseKey(storage, "politics_picker_state", {}),
      itemGlobal: parseKey(storage, "politics_item_global", {}),
      history,
      round: {
        roundActive: false,
        evaluated: false,
        correctAns: "",
        hasStartedOnce: false,
      },
      adminPin: storage.getItem("politics_admin_pin") ?? undefined,
      masterVolume: optionalNumber(storage, "politics_master_volume"),
      sfxVolume: optionalNumber(storage, "politics_sfx_volume"),
      zoomLevel: optionalNumber(storage, "politics_zoom_level"),
      resizerEnabled: optionalBoolean(storage, "politics_resizer_enabled"),
      resizerHeight: optionalNumber(storage, "politics_resizer_height"),
      columnMode: storage.getItem("politics_column_mode") ?? undefined,
      saveAllIn: optionalBoolean(storage, "politics_save_allin"),
    };
  }

  function migrateBackup(
    raw,
    { identity = StableIdentity, now = () => new Date() } = {},
  ) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw))
      throw new TypeError("备份必须是 JSON 对象");
    const version =
      raw.schemaVersion == null ? LEGACY_SCHEMA_VERSION : raw.schemaVersion;
    if (
      !Number.isInteger(version) ||
      version < LEGACY_SCHEMA_VERSION ||
      version > CURRENT_SCHEMA_VERSION
    )
      throw new Error(`不支持的存档版本：${version}`);
    const output = copy(raw);
    if (version === CURRENT_SCHEMA_VERSION) return output;
    if (!Array.isArray(output.groups) || !output.groups.length)
      throw new Error("旧版存档缺少小组数据");

    const currentGroups = identity.assignGroupUids(output.groups);
    const byLegacyId = new Map(
      currentGroups.map((group) => [String(group.id), group.groupUid]),
    );
    const currentItemIds = new Map();
    const historicItemIds = new Map();
    function signatureFor(uid, item) {
      return `${uid}|${String(item.key || "")}|${String(item.acquiredAt ?? "")}`;
    }
    function normalizeInventory(group, uid, historic = false) {
      if (!Array.isArray(group.inventory)) return;
      const local = new Set();
      const occurrences = new Map();
      group.inventory = group.inventory.map((item) => {
        const value =
          item && typeof item === "object" && !Array.isArray(item)
            ? { ...item }
            : {};
        const signature = signatureFor(uid, value);
        const index = occurrences.get(signature) || 0;
        occurrences.set(signature, index + 1);
        const currentIds = currentItemIds.get(signature) || [];
        const historyIds = historicItemIds.get(signature) || [];
        let id = identity.isValidItemInstanceId(value.itemInstanceId)
          ? value.itemInstanceId
          : historic
            ? currentIds[index] || historyIds[index]
            : null;
        if (!id || local.has(id)) id = identity.createItemInstanceId();
        value.itemInstanceId = id;
        local.add(id);
        if (historic) {
          if (!historicItemIds.has(signature))
            historicItemIds.set(signature, []);
          historicItemIds.get(signature)[index] = id;
        } else {
          if (!currentItemIds.has(signature)) currentItemIds.set(signature, []);
          currentItemIds.get(signature)[index] = id;
        }
        return value;
      });
    }
    currentGroups.forEach((group) => normalizeInventory(group, group.groupUid));
    output.groups = currentGroups;

    if (Array.isArray(output.history)) {
      output.history = output.history.map((snapshot) => {
        if (!snapshot || typeof snapshot !== "object") return snapshot;
        const migrated = { ...snapshot };
        if (Array.isArray(migrated.groups)) {
          const assigned = identity.assignGroupUids(
            migrated.groups.map((group) => ({
              ...group,
              groupUid: identity.isValidGroupUid(group?.groupUid)
                ? group.groupUid
                : byLegacyId.get(String(group?.id)) || "",
            })),
          );
          assigned.forEach((group) =>
            normalizeInventory(group, group.groupUid, true),
          );
          migrated.groups = assigned;
        }
        return migrated;
      });
    }
    output.seasonId = identity.isValidSeasonId(output.seasonId)
      ? output.seasonId
      : identity.createSeasonId();
    output.schemaVersion = CURRENT_SCHEMA_VERSION;
    output.migratedAt = now().toISOString();
    return output;
  }

  return {
    CURRENT_SCHEMA_VERSION,
    LEGACY_SCHEMA_VERSION,
    migrateBackup,
    fromLegacyKeys,
  };
})();
