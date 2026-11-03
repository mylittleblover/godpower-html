/* Bridge the unchanged competition envelope to canonical save/roster storage. */
(function installSaveProjection(root) {
  "use strict";
  const copy = (value) => root.SaveSchema.clone(value);
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
    runtime.rosterSnapshot = copy(doc.roster);
    for (const group of runtime.groups) {
      const row = doc.roster.groups.find((g) => g.groupUid === group.groupUid);
      group.avatarResourceId = row?.avatarResourceId || null;
      group.memberStudentUids = doc.roster.assignments
        .filter((a) => a.groupUid === group.groupUid)
        .map((a) => a.studentUid);
    }
    return runtime;
  }
  async function fromRuntime(input, payload) {
    const current = root.SaveSchema.validateV2(input),
      snapshot = copy(payload);
    const imported = await root.SaveMigration.preview({
        rawText: JSON.stringify(snapshot),
      }),
      replacement = imported.documents[0];
    const roster = copy(snapshot.rosterSnapshot || current.roster);
    const oldAssignments = roster.assignments,
      assigned = new Set(),
      assignments = [];
    const groupRows = [];
    for (const group of replacement.match.groups) {
      const previous = roster.groups.find((g) => g.groupUid === group.groupUid);
      groupRows.push({
        groupUid: group.groupUid,
        name: group.name,
        groupNo: group.groupNo ?? previous?.groupNo,
        color: group.color,
        avatarResourceId:
          group.groupAvatar?.$asset ||
          (Object.hasOwn(group, "avatarResourceId")
            ? group.avatarResourceId
            : previous?.avatarResourceId) ||
          null,
      });
      const oldIds = oldAssignments
        .filter((a) => a.groupUid === group.groupUid)
        .map((a) => a.studentUid);
      for (const label of group.members || []) {
        // Same-name students in different groups never become one identity.
        const candidates = roster.students.filter(
          (s) =>
            oldIds.includes(s.studentUid) &&
            !assigned.has(s.studentUid) &&
            root.SaveRoster.label(s) === label,
        );
        let student = candidates[0];
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
    const a = copy(roster),
      b = copy(current.roster);
    delete a.revision;
    delete b.revision;
    roster.revision =
      current.roster.revision +
      (JSON.stringify(a) === JSON.stringify(b) ? 0 : 1);
    const document = {
      ...current,
      roster,
      match: replacement.match,
      achievements: replacement.achievements,
      perSaveOptions: replacement.perSaveOptions,
      assetReferences: [
        ...new Set([
          ...current.assetReferences,
          ...replacement.assetReferences,
          ...[...roster.students, ...roster.groups]
            .map((r) => r.avatarResourceId)
            .filter(Boolean),
        ]),
      ],
    };
    if (
      current.match.pendingSettlement &&
      current.match.season.seasonId === document.match.season.seasonId
    )
      document.match.pendingSettlement = copy(current.match.pendingSettlement);
    const refs = new Set(document.assetReferences);
    for (const group of [
      ...document.match.groups,
      ...document.match.history.flatMap((row) => row.groups),
    ]) {
      if (
        typeof group.avatarResourceId === "string" &&
        refs.has(group.avatarResourceId)
      )
        group.groupAvatar = { $asset: group.avatarResourceId };
    }
    delete document.match.extensions.rosterSnapshot;
    return {
      document: root.SaveSchema.validateV2(document),
      assets: imported.assets,
      appPreferences: imported.appPreferences,
    };
  }
  root.SaveProjection = Object.freeze({ toRuntime, fromRuntime });
})(globalThis);
