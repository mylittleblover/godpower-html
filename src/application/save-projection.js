/* Bridge the unchanged competition envelope to canonical save/roster storage. */
(function installSaveProjection(root) {
  "use strict";
  const copy = (value) => root.SaveSchema.clone(value);
  let cachedRuntimeKeys = null;
  let cachedKnownKeys = null;
  function knownRuntimeKeys() {
    const keys = root.SaveSchema.runtimeKeys;
    if (cachedRuntimeKeys !== keys) {
      cachedRuntimeKeys = keys;
      cachedKnownKeys = new Set(keys);
    }
    return cachedKnownKeys;
  }
  function sameJsonIgnoringRootKey(a, b, ignoredKey, isRoot = true) {
    if (a === b) return true;
    if (!a || !b || typeof a !== "object" || typeof b !== "object")
      return false;
    if (Array.isArray(a) || Array.isArray(b)) {
      if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length)
        return false;
      for (let i = 0; i < a.length; i++) {
        const av = a[i] === undefined ? null : a[i];
        const bv = b[i] === undefined ? null : b[i];
        if (!sameJsonIgnoringRootKey(av, bv, null, false)) return false;
      }
      return true;
    }
    const aKeysAll = Object.keys(a);
    const aKeys = [];
    for (let i = 0; i < aKeysAll.length; i++) {
      const k = aKeysAll[i];
      if (!(isRoot && k === ignoredKey) && a[k] !== undefined) aKeys.push(k);
    }
    const bKeysAll = Object.keys(b);
    let bIndex = 0;
    for (let i = 0; i < bKeysAll.length; i++) {
      const k = bKeysAll[i];
      if ((isRoot && k === ignoredKey) || b[k] === undefined) continue;
      if (bIndex >= aKeys.length || k !== aKeys[bIndex]) return false;
      if (!sameJsonIgnoringRootKey(a[k], b[k], null, false)) return false;
      bIndex++;
    }
    return bIndex === aKeys.length;
  }
  function toRuntime(input, preferences = { values: {} }) {
    const doc = root.SaveSchema.validateV2(input);
    function compact(value) {
      if (Array.isArray(value)) return value.map(compact);
      if (value && typeof value === "object") {
        const out = {};
        for (const [key, child] of Object.entries(value)) {
          if (key === "groupAvatar" && child?.$asset) {
            out.groupAvatar = "";
            out.avatarResourceId = child.$asset;
          } else out[key] = compact(child);
        }
        return out;
      }
      return value;
    }
    const compactDoc = { ...doc, match: compact(doc.match) };
    const runtime = root.SaveMigration.toLegacy(compactDoc, [], preferences);
    runtime.rosterSnapshot = doc.roster;
    const rosterGroupsByUid = new Map();
    for (const g of doc.roster.groups) rosterGroupsByUid.set(g.groupUid, g);
    const memberUidsByGroup = new Map();
    for (const a of doc.roster.assignments) {
      let list = memberUidsByGroup.get(a.groupUid);
      if (!list) {
        list = [];
        memberUidsByGroup.set(a.groupUid, list);
      }
      list.push(a.studentUid);
    }
    for (const group of runtime.groups) {
      const row = rosterGroupsByUid.get(group.groupUid);
      group.avatarResourceId = row?.avatarResourceId || null;
      group.memberStudentUids = memberUidsByGroup.get(group.groupUid) || [];
    }
    return runtime;
  }
  async function projectRuntime(input, payload, owned) {
    const current = root.SaveSchema.assertV2(input),
      snapshot = owned ? payload : copy(payload);
    // Runtime saves already have stable identities and resource references.
    // Full old-file migration is an import operation, never an every-click operation.
    root.SaveSchema.validateGroups(snapshot.groups, true);
    const known = knownRuntimeKeys();
    const extensions = {};
    for (const [key, value] of Object.entries(snapshot)) {
      if (!known.has(key)) extensions[key] = value;
    }
    const replacement = {
      match: {
        season: { seasonId: snapshot.seasonId },
        groups: snapshot.groups,
        round: snapshot.round || {},
        picker: snapshot.picker || {},
        itemGlobal: snapshot.itemGlobal || {},
        history: snapshot.history || [],
        firstHandDrawPending: snapshot.firstHandDrawPending ?? false,
        extensions,
      },
      achievements: snapshot.achievementLedger || {
        schemaVersion: 1,
        groups: {},
      },
      perSaveOptions: Object.hasOwn(snapshot, "saveAllIn")
        ? { saveAllIn: snapshot.saveAllIn }
        : {},
      assetReferences: [],
    };
    const prefValues = {};
    for (const key of root.SaveSchema.appPreferenceKeys) {
      if (Object.hasOwn(snapshot, key)) prefValues[key] = snapshot[key];
    }
    const appPreferences = {
      schemaVersion: 1,
      values: prefValues,
    };
    const roster = snapshot.rosterSnapshot
      ? owned
        ? copy(snapshot.rosterSnapshot)
        : snapshot.rosterSnapshot
      : copy(current.roster);
    const oldAssignments = roster.assignments,
      assigned = new Set(),
      assignments = [];
    const prevGroupsByUid = new Map();
    for (const g of roster.groups) prevGroupsByUid.set(g.groupUid, g);
    const oldGroupByStudent = new Map();
    for (const a of oldAssignments) {
      let groups = oldGroupByStudent.get(a.studentUid);
      if (!groups) {
        groups = new Set();
        oldGroupByStudent.set(a.studentUid, groups);
      }
      groups.add(a.groupUid);
    }
    const oldMembersByGroupLabel = new Map();
    for (const s of roster.students) {
      const groups = oldGroupByStudent.get(s.studentUid);
      if (!groups) continue;
      const studentLabel = root.SaveRoster.label(s);
      for (const groupUid of groups) {
        let byLabel = oldMembersByGroupLabel.get(groupUid);
        if (!byLabel) {
          byLabel = new Map();
          oldMembersByGroupLabel.set(groupUid, byLabel);
        }
        let list = byLabel.get(studentLabel);
        if (!list) {
          list = [];
          byLabel.set(studentLabel, list);
        }
        list.push(s);
      }
    }
    const groupRows = [];
    for (const group of replacement.match.groups) {
      const previous = prevGroupsByUid.get(group.groupUid);
      const avatarResourceId =
        group.groupAvatar?.$asset ||
        (Object.hasOwn(group, "avatarResourceId")
          ? group.avatarResourceId
          : previous?.avatarResourceId) ||
        null;
      const resolvedGroupNo = group.groupNo ?? previous?.groupNo;
      const groupRow = {
        groupUid: group.groupUid,
        name: group.name,
        ...(resolvedGroupNo !== undefined ? { groupNo: resolvedGroupNo } : {}),
        color: group.color,
        avatarResourceId,
      };
      groupRows.push(groupRow);
      const byLabel = oldMembersByGroupLabel.get(group.groupUid);
      for (const label of group.members || []) {
        // Same-name students in different groups never become one identity.
        const candidates = byLabel?.get(label);
        let student;
        if (candidates) {
          for (let i = 0; i < candidates.length; i++) {
            if (!assigned.has(candidates[i].studentUid)) {
              student = candidates[i];
              break;
            }
          }
        }
        if (!student) {
          student = {
            studentUid: root.StableIdentity.createStudentUid(),
            ...root.SaveMigration.parseMember(label),
            legacyLabel: label,
            avatarResourceId: null,
          };
          roster.students.push(student);
        }
        assigned.add(student.studentUid);
        assignments.push({
          studentUid: student.studentUid,
          groupUid: group.groupUid,
        });
      }
    }
    roster.groups = groupRows;
    roster.assignments = assignments;
    roster.revision =
      current.roster.revision +
      (sameJsonIgnoringRootKey(roster, current.roster, "revision") ? 0 : 1);
    const refsSet = new Set(current.assetReferences);
    for (const refId of replacement.assetReferences) refsSet.add(refId);
    for (const r of roster.students)
      if (r.avatarResourceId) refsSet.add(r.avatarResourceId);
    for (const r of roster.groups)
      if (r.avatarResourceId) refsSet.add(r.avatarResourceId);
    const document = {
      ...current,
      archives: copy(current.archives),
      roster,
      match: replacement.match,
      achievements: replacement.achievements,
      perSaveOptions: replacement.perSaveOptions,
      assetReferences: [...refsSet],
    };
    if (
      current.match.pendingSettlement &&
      current.match.season.seasonId === document.match.season.seasonId
    )
      document.match.pendingSettlement = copy(current.match.pendingSettlement);
    for (const group of document.match.groups) {
      if (
        typeof group.avatarResourceId === "string" &&
        refsSet.has(group.avatarResourceId)
      )
        group.groupAvatar = { $asset: group.avatarResourceId };
    }
    let copiedHistory = null;
    for (let hi = 0; hi < document.match.history.length; hi++) {
      const row = document.match.history[hi];
      let copiedGroups = null;
      for (let gi = 0; gi < row.groups.length; gi++) {
        const group = row.groups[gi];
        if (
          typeof group.avatarResourceId === "string" &&
          refsSet.has(group.avatarResourceId) &&
          group.groupAvatar?.$asset !== group.avatarResourceId
        ) {
          if (!copiedHistory) copiedHistory = document.match.history.slice();
          if (!copiedGroups) copiedGroups = row.groups.slice();
          copiedGroups[gi] = {
            ...group,
            groupAvatar: { $asset: group.avatarResourceId },
          };
        }
      }
      if (copiedGroups) copiedHistory[hi] = { ...row, groups: copiedGroups };
    }
    if (copiedHistory) document.match.history = copiedHistory;
    delete document.match.extensions.rosterSnapshot;
    return {
      document: root.SaveSchema.assertV2(document),
      assets: [],
      appPreferences,
    };
  }
  root.SaveProjection = Object.freeze({
    toRuntime,
    fromRuntime: (input, payload) => projectRuntime(input, payload, false),
    // Internal ownership-transfer port: SaveSession supplies its private draft,
    // SaveManager supplies a private payload. Neither may be reused after this call.
    fromOwnedRuntime: (input, payload) => projectRuntime(input, payload, true),
  });
})(globalThis);
