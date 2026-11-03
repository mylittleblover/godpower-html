/* Read-only migration of legacy teacher/class rosters; never infer match results. */
(function installClassroomRosterMigration(root) {
  "use strict";
  const copy = (value) => root.SaveSchema.clone(value);
  const digest = async (bytes) =>
    [...new Uint8Array(await root.crypto.subtle.digest("SHA-256", bytes))]
      .map((n) => n.toString(16).padStart(2, "0"))
      .join("");
  const hashText = (text) => digest(new TextEncoder().encode(text));
  const matches = (raw) =>
    raw?.schemaVersion === 1 &&
    (!!raw.rosterData || Array.isArray(raw.profiles));
  async function preview({ rawText, readAsset = async () => null }) {
    if (
      typeof rawText !== "string" ||
      new TextEncoder().encode(rawText).length > 128 * 1024 * 1024
    )
      throw Error("旧名单超过导入限制");
    const raw = JSON.parse(rawText);
    root.SaveSchema.safeTree(raw);
    if (!matches(raw)) throw Error("不支持的旧名单格式");
    const data = root.ClassroomRoster.validateRosterDocument(
        raw.rosterData || raw,
      ),
      sourceDigest = await hashText(rawText);
    const warnings = [
        {
          code: "NO_COMPETITION_SNAPSHOT",
          message:
            "旧名单未记录比赛快照；转换为未开始课堂，积分为零，不推测历史战绩。",
        },
      ],
      assets = new Map(),
      avatarIds = new Map();
    const embedded = new Map();
    if (raw.avatars !== undefined) {
      if (!Array.isArray(raw.avatars) || raw.avatars.length > 10000)
        throw Error("旧头像备份格式错误");
      for (const asset of raw.avatars) {
        if (
          !asset ||
          typeof asset.resourceId !== "string" ||
          embedded.has(asset.resourceId)
        )
          throw Error("旧头像标识重复或无效");
        embedded.set(asset.resourceId, asset);
      }
    }
    let totalBytes = 0;
    for (const student of data.students) {
      const oldId = student.avatarResourceId;
      if (!oldId) continue;
      const key = student.classroomId + ":" + oldId;
      if (avatarIds.has(key)) continue;
      let entry = embedded.get(oldId);
      try {
        entry ||= await readAsset(oldId);
        if (
          !entry ||
          entry.classroomId !== student.classroomId ||
          entry.subjectId !== "student-avatar" ||
          !/^image\/(png|jpeg|webp)$/.test(entry.mimeType)
        )
          throw Error("头像课堂或格式不匹配");
        const bytes = entry.blob
          ? new Uint8Array(await entry.blob.arrayBuffer())
          : Uint8Array.from(atob(entry.bytesBase64), (c) => c.charCodeAt(0));
        if (!bytes.length || bytes.length > 2 * 1024 * 1024)
          throw Error("旧头像大小无效");
        totalBytes += bytes.length;
        if (totalBytes > 50 * 1024 * 1024) throw Error("旧头像总大小超过50MiB");
        const sha256 = await digest(bytes);
        if (entry.sha256 && sha256 !== entry.sha256.toLowerCase())
          throw Error("旧头像摘要不匹配");
        const resourceId = "asset-" + sha256;
        let dataBase64 = "";
        for (let i = 0; i < bytes.length; i += 0x8000)
          dataBase64 += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
        assets.set(resourceId, {
          resourceId,
          sha256,
          mimeType: entry.mimeType,
          byteLength: bytes.length,
          dataBase64: btoa(dataBase64),
        });
        avatarIds.set(key, resourceId);
      } catch (error) {
        if (embedded.has(oldId))
          throw Error("备份头像校验失败：" + error.message);
        avatarIds.set(key, null);
        warnings.push({
          code: "LEGACY_AVATAR_UNAVAILABLE",
          studentUid: student.studentUid,
          resourceId: oldId,
          message: error.message,
        });
      }
    }
    const contexts = [...data.assignments];
    for (const classroom of data.classrooms)
      if (!contexts.some((a) => a.classroomId === classroom.classroomId))
        contexts.push({
          userProfileId: null,
          classroomId: classroom.classroomId,
          mode: "individual",
          groupAssignments: [],
        });
    if (!contexts.length) throw Error("旧名单没有可转换的课堂；原文保持不变");
    const documents = [];
    for (const context of contexts) {
      const classroom = data.classrooms.find(
          (c) => c.classroomId === context.classroomId,
        ),
        profile = data.profiles.find(
          (p) => p.userProfileId === context.userProfileId,
        );
      const identity = await hashText(
        sourceDigest +
          ":" +
          (context.userProfileId || "unowned") +
          ":" +
          context.classroomId,
      );
      const students = data.students
        .filter((s) => s.classroomId === context.classroomId)
        .map((s) => ({
          studentUid: s.studentUid,
          displayName: s.displayName,
          number: s.number ?? null,
          avatarResourceId:
            avatarIds.get(s.classroomId + ":" + s.avatarResourceId) || null,
        }));
      const groupIds = [
        ...new Set(context.groupAssignments.map((a) => a.groupUid)),
      ];
      const empty = groupIds.length === 0;
      if (empty) groupIds.push("group-" + identity);
      const groups = groupIds.map((groupUid, i) => ({
        id: i + 1,
        groupUid,
        groupNo: i + 1,
        name: empty ? "待分组" : "原分组 " + (i + 1) + "（名称未记录）",
        color: "#0f766e",
        score: 0,
        displayScore: 0,
        members: context.groupAssignments
          .filter((a) => a.groupUid === groupUid)
          .map((a) =>
            root.SaveRoster.label(
              students.find((s) => s.studentUid === a.studentUid),
            ),
          ),
        inventory: [],
        itemStats: { correct: 0, wrong: 0, draws: 0, used: 0 },
      }));
      const base = await root.SaveMigration.preview({
        rawText: JSON.stringify({
          schemaVersion: 2,
          seasonId: "season-" + identity,
          timestamp: "1970-01-01T00:00:00.000Z",
          groups,
          history: [],
          round: {
            roundActive: false,
            evaluated: false,
            hasStartedOnce: false,
            correctAns: "",
          },
          picker: {
            mode: context.mode,
            antiRepeat: true,
            pickedStudentKeys: [],
            pickedGroupIds: [],
            preselectedGroupIds: [],
          },
          itemGlobal: {},
          achievementLedger: { schemaVersion: 1, groups: {} },
        }),
        name: classroom.name + " · " + (profile?.displayName || "旧名单"),
      });
      const doc = base.documents[0];
      doc.saveId = "save-" + identity;
      doc.roster.students = students;
      doc.roster.assignments = copy(context.groupAssignments);
      doc.assetReferences = [
        ...new Set(students.map((s) => s.avatarResourceId).filter(Boolean)),
      ];
      doc.migration = {
        ...doc.migration,
        sourceDigest,
        sourceType: "legacy-roster-only",
        userProfileId: context.userProfileId,
        classroomId: context.classroomId,
        mode: context.mode,
        warnings: copy(warnings),
      };
      documents.push(root.SaveSchema.validateV2(doc));
    }
    return {
      documents,
      assets: [...assets.values()],
      sourceDigest,
      sourceText: rawText,
      warnings,
      appPreferences: { schemaVersion: 1, values: {} },
      report: {
        saves: documents.length,
        students: documents.reduce((n, d) => n + d.roster.students.length, 0),
        groups: documents.reduce((n, d) => n + d.roster.groups.length, 0),
        assets: assets.size,
      },
    };
  }
  root.ClassroomRosterMigration = Object.freeze({ matches, preview });
})(globalThis);
