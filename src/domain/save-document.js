/* Versioned save contract. No DOM, storage or competition calculations. */
(function installSaveSchema(root) {
  "use strict";
  const APP_KEYS = Object.freeze([
    "adminPin",
    "masterVolume",
    "sfxVolume",
    "zoomLevel",
    "resizerEnabled",
    "resizerHeight",
    "columnMode",
  ]);
  const copy = (value) => JSON.parse(JSON.stringify(value));
  const object = (v) => !!v && typeof v === "object" && !Array.isArray(v);
  const fail = (message) => {
    throw new TypeError(message);
  };
  const uid = (v) =>
    typeof v === "string" && /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(v);
  function safeTree(value, depth = 0) {
    if (depth > 40) fail("save nesting exceeds limit");
    if (typeof value === "number" && !Number.isFinite(value))
      fail("non-finite save number");
    if (value && typeof value === "object")
      for (const key of Object.keys(value)) {
        if (["__proto__", "prototype", "constructor"].includes(key))
          fail("unsafe save property");
        safeTree(value[key], depth + 1);
      }
  }
  function unique(rows, key, label) {
    if (!Array.isArray(rows)) fail(label + " must be an array");
    const ids = new Set();
    for (const row of rows) {
      if (!object(row) || !uid(row[key]) || ids.has(row[key]))
        fail("invalid or duplicate " + label + " identity");
      ids.add(row[key]);
    }
    return ids;
  }
  function validateGroups(groups, current = true) {
    if (!Array.isArray(groups) || groups.length > 1000)
      fail("invalid match groups");
    if (current) unique(groups, "groupUid", "match group");
    for (const g of groups) {
      if (current && typeof g.score !== "number")
        fail("canonical score must be a number");
      if (!object(g) || !Number.isSafeInteger(Number(g.score ?? 0)))
        fail("score must be a safe integer");
      if (
        g.members != null &&
        (!Array.isArray(g.members) ||
          g.members.some((x) => typeof x !== "string"))
      )
        fail("invalid members");
      if (
        g.inventory != null &&
        (!Array.isArray(g.inventory) ||
          g.inventory.length > 3 ||
          g.inventory.some((x) => !object(x)))
      )
        fail("invalid inventory");
    }
  }
  function validateV2(input) {
    if (
      !object(input) ||
      input.kind !== "godpower.save" ||
      input.schemaVersion !== 2
    )
      fail("unsupported save kind/format");
    safeTree(input);
    if (
      typeof input.saveId !== "string" ||
      !/^save-[A-Za-z0-9_-]{1,96}$/.test(input.saveId)
    )
      fail("invalid save identity");
    if (!Number.isSafeInteger(input.revision) || input.revision < 1)
      fail("invalid save revision");
    if (typeof input.name !== "string" || !input.name.trim())
      fail("save name is required");
    if (!object(input.roster) || !object(input.match))
      fail("missing roster or match");
    if (
      !Number.isSafeInteger(input.roster.revision) ||
      input.roster.revision < 1
    )
      fail("invalid roster revision");
    if (
      !object(input.match.season) ||
      !uid(input.match.season.seasonId) ||
      !input.match.season.seasonId.startsWith("season-")
    )
      fail("invalid match season");
    for (const key of ["round", "picker", "itemGlobal"])
      if (!object(input.match[key])) fail("invalid match " + key);
    if (!object(input.achievements) || !object(input.perSaveOptions))
      fail("invalid achievement/options metadata");
    if (
      input.perSaveOptions.saveAllIn !== undefined &&
      typeof input.perSaveOptions.saveAllIn !== "boolean"
    )
      fail("invalid saveAllIn option");
    if (!Array.isArray(input.archives) || input.archives.length > 10000)
      fail("archives must be an array");
    for (const archive of input.archives) {
      if (!object(archive)) fail("invalid archive entry");
      if (archive.groups !== undefined) validateGroups(archive.groups, false);
    }
    if (input.match.pendingSettlement !== undefined) {
      const pending = input.match.pendingSettlement;
      if (
        !object(pending) ||
        !(typeof pending.recordId === "string"
          ? pending.recordId.length > 0
          : Number.isSafeInteger(pending.recordId)) ||
        pending.seasonId !== input.match.season.seasonId ||
        !input.archives.some(
          (a) => a.id === pending.recordId && a.seasonId === pending.seasonId,
        )
      )
        fail("invalid pending settlement");
    }
    const students = unique(input.roster.students, "studentUid", "student");
    const groups = unique(input.roster.groups, "groupUid", "roster group");
    if (students.size > 100000 || groups.size > 1000)
      fail("roster exceeds limit");
    for (const s of input.roster.students)
      if (typeof s.displayName !== "string" || !s.displayName.trim())
        fail("student displayName is required");
    if (!Array.isArray(input.roster.assignments))
      fail("assignments must be an array");
    const assigned = new Set();
    for (const a of input.roster.assignments) {
      if (!object(a) || !students.has(a.studentUid))
        fail("assignment student is missing");
      if (!groups.has(a.groupUid)) fail("assignment group is missing");
      if (assigned.has(a.studentUid)) fail("duplicate student assignment");
      assigned.add(a.studentUid);
    }
    validateGroups(input.match.groups);
    for (const g of input.match.groups)
      if (!groups.has(g.groupUid)) fail("match group has no roster entry");
    if (!Array.isArray(input.match.history) || input.match.history.length > 40)
      fail("invalid history");
    for (const h of input.match.history) {
      if (!object(h)) fail("invalid history entry");
      validateGroups(h.groups, false);
    }
    if (
      !Array.isArray(input.assetReferences) ||
      new Set(input.assetReferences).size !== input.assetReferences.length
    )
      fail("invalid asset references");
    const refs = new Set(input.assetReferences);
    if (
      [...refs].some(
        (x) => typeof x !== "string" || !/^asset-[a-f0-9]{64}$/.test(x),
      )
    )
      fail("invalid asset identity");
    for (const row of [...input.roster.students, ...input.roster.groups])
      if (row.avatarResourceId != null && !refs.has(row.avatarResourceId))
        fail("avatar asset reference is missing");
    function checkRefs(v) {
      if (!v || typeof v !== "object") return;
      if (
        Object.keys(v).length === 1 &&
        typeof v.$asset === "string" &&
        !refs.has(v.$asset)
      )
        fail("match asset reference is missing");
      for (const child of Object.values(v)) checkRefs(child);
    }
    checkRefs(input.match);
    if (APP_KEYS.some((k) => Object.hasOwn(input.match, k)))
      fail("program preferences belong outside match");
    return copy(input);
  }
  function validateIndex(input) {
    if (
      !object(input) ||
      input.kind !== "godpower.save-index" ||
      input.schemaVersion !== 2
    )
      fail("invalid save index");
    safeTree(input);
    if (
      !Number.isSafeInteger(input.revision) ||
      input.revision < 0 ||
      !Number.isSafeInteger(input.generation) ||
      input.generation < 0
    )
      fail("invalid index revision/generation");
    const ids = unique(input.entries, "saveId", "index entry");
    const trashed = input.trashedEntries || [];
    unique(trashed, "saveId", "trashed entry");
    if (trashed.some((e) => ids.has(e.saveId)))
      fail("save cannot be active and trashed");
    for (const e of [...input.entries, ...trashed])
      if (
        !Number.isSafeInteger(e.revision) ||
        e.revision < 1 ||
        typeof e.name !== "string"
      )
        fail("invalid index entry");
    if (input.activeSaveId !== null && !ids.has(input.activeSaveId))
      fail("active save is missing");
    return copy(input);
  }
  root.SaveSchema = Object.freeze({
    validateV2,
    validateIndex,
    validateGroups,
    safeTree,
    appPreferenceKeys: APP_KEYS,
    clone: copy,
  });
})(globalThis);
