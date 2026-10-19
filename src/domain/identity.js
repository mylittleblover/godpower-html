/* Stable entity identity for records that outlive display names and positions. */
const StableIdentity = (() => {
  const GROUP_UID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
  const fallbackEpoch = (
    globalThis.performance?.timeOrigin ?? Date.now()
  ).toString(36);
  let fallbackSequence = 0;

  function isValidGroupUid(value) {
    return typeof value === "string" && GROUP_UID_PATTERN.test(value);
  }

  function createUuid(prefix) {
    try {
      if (globalThis.crypto?.randomUUID)
        return `${prefix}-${globalThis.crypto.randomUUID()}`;
      if (globalThis.crypto?.getRandomValues) {
        const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        const hex = [...bytes]
          .map((value) => value.toString(16).padStart(2, "0"))
          .join("");
        return `${prefix}-${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
      }
    } catch (_) {
      // Some file:// browser contexts expose crypto without enabling its methods.
    }
    // Entity identity must not advance the RNG used by draw/attack rules.
    const clock = (globalThis.performance?.now?.() ?? 0).toString(36);
    return `${prefix}-${fallbackEpoch}-${Date.now().toString(36)}-${(++fallbackSequence).toString(36)}-${clock}`;
  }

  const createGroupUid = () => createUuid("group");
  const createItemInstanceId = () => createUuid("item");
  const createSeasonId = () => createUuid("season");
  const createCommandId = () => createUuid("command");

  function assignGroupUids(groups, idFactory = createGroupUid) {
    if (!Array.isArray(groups)) throw new TypeError("groups must be an array");
    if (typeof idFactory !== "function")
      throw new TypeError("idFactory must be a function");
    const used = new Set();
    return groups.map((group) => {
      const copy =
        group && typeof group === "object" && !Array.isArray(group)
          ? { ...group }
          : {};
      let uid =
        isValidGroupUid(copy.groupUid) && !used.has(copy.groupUid)
          ? copy.groupUid
          : "";
      for (let attempt = 0; !uid && attempt < 100; attempt++) {
        const candidate = idFactory();
        if (isValidGroupUid(candidate) && !used.has(candidate)) uid = candidate;
      }
      if (!uid) throw new Error("Could not produce a unique group identity");
      used.add(uid);
      copy.groupUid = uid;
      return copy;
    });
  }

  return {
    isValidGroupUid,
    isValidItemInstanceId: (value) =>
      isValidGroupUid(value) && value.startsWith("item-"),
    isValidSeasonId: (value) =>
      isValidGroupUid(value) && value.startsWith("season-"),
    createGroupUid,
    createItemInstanceId,
    createSeasonId,
    createCommandId,
    assignGroupUids,
  };
})();
