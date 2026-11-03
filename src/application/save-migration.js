/* Read-only legacy conversion, resource extraction and reversible projection. */
(function installSaveMigration(root) {
  "use strict";
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const known = new Set([
    "schemaVersion",
    "appVersion",
    "timestamp",
    "seasonId",
    "achievementLedger",
    "groups",
    "picker",
    "itemGlobal",
    "round",
    "history",
    "firstHandDrawPending",
    "saveAllIn",
    ...root.SaveSchema.appPreferenceKeys,
  ]);
  const digest = async (bytes) =>
    [...new Uint8Array(await root.crypto.subtle.digest("SHA-256", bytes))]
      .map((n) => n.toString(16).padStart(2, "0"))
      .join("");
  const textDigest = (text) => digest(new TextEncoder().encode(text));
  function parseMember(label) {
    const m = label.trim().match(/^(\d+)[\s.．、:：-]*(.*)$/);
    return {
      number: m ? m[1] : null,
      displayName: (m ? m[2] : label).trim() || label.trim() || "未命名学生",
    };
  }
  async function validateAssets(input) {
    if (!Array.isArray(input) || input.length > 10000)
      throw Error("invalid asset collection");
    const result = [],
      ids = new Set();
    let total = 0;
    for (const asset of input) {
      if (
        !asset ||
        typeof asset.dataBase64 !== "string" ||
        !/^image\/(png|jpeg|webp)$/.test(asset.mimeType)
      )
        throw Error("invalid avatar asset");
      const bytes = Uint8Array.from(atob(asset.dataBase64), (c) =>
        c.charCodeAt(0),
      );
      total += bytes.length;
      if (total > 96 * 1024 * 1024)
        throw Error("asset collection exceeds import limit");
      const sha256 = await digest(bytes);
      if (
        asset.resourceId !== "asset-" + sha256 ||
        asset.sha256 !== sha256 ||
        asset.byteLength !== bytes.length ||
        ids.has(asset.resourceId)
      )
        throw Error("asset digest/identity mismatch");
      ids.add(asset.resourceId);
      result.push({
        resourceId: asset.resourceId,
        mimeType: asset.mimeType,
        sha256,
        byteLength: bytes.length,
        dataBase64: asset.dataBase64,
      });
    }
    return result;
  }
  function bundle(document, assets) {
    const doc = root.SaveSchema.validateV2(document);
    const byId = new Map(assets.map((a) => [a.resourceId, a]));
    const resources = doc.assetReferences.map((id) => {
      const asset = byId.get(id);
      if (!asset) throw Error("缺少头像资源 asset " + id);
      return {
        resourceId: asset.resourceId,
        mimeType: asset.mimeType,
        sha256: asset.sha256,
        byteLength: asset.byteLength,
        dataBase64: asset.dataBase64,
      };
    });
    return {
      kind: "godpower.save-bundle",
      schemaVersion: 2,
      documents: [doc],
      assets: resources,
    };
  }
  async function preview({
    rawText,
    name = "导入课堂",
    rosterData = null,
  } = {}) {
    if (
      typeof rawText !== "string" ||
      new TextEncoder().encode(rawText).byteLength > 128 * 1024 * 1024
    )
      throw Error("source text is missing or exceeds import limit");
    const raw = JSON.parse(rawText);
    root.SaveSchema.safeTree(raw);
    if (raw?.kind === "godpower.save-bundle") {
      if (
        raw.schemaVersion !== 2 ||
        !Array.isArray(raw.documents) ||
        !raw.documents.length
      )
        throw Error("unsupported save bundle");
      const documents = raw.documents.map(root.SaveSchema.validateV2);
      if (new Set(documents.map((d) => d.saveId)).size !== documents.length)
        throw Error("duplicate save identity");
      const assets = await validateAssets(raw.assets),
        ids = new Set(assets.map((a) => a.resourceId));
      for (const doc of documents)
        for (const id of doc.assetReferences)
          if (!ids.has(id)) throw Error("缺少头像资源 asset " + id);
      return {
        documents,
        assets,
        appPreferences: { schemaVersion: 1, values: {} },
        sourceDigest: await textDigest(rawText),
        sourceText: rawText,
        warnings: [],
        report: {
          saves: documents.length,
          groups: documents.reduce((n, d) => n + d.roster.groups.length, 0),
          students: documents.reduce((n, d) => n + d.roster.students.length, 0),
          assets: assets.length,
        },
      };
    }
    if (raw?.kind === "godpower.save")
      return {
        documents: [root.SaveSchema.validateV2(raw)],
        assets: [],
        appPreferences: { schemaVersion: 1, values: {} },
        sourceDigest: await textDigest(rawText),
        report: {
          groups: raw.roster.groups.length,
          students: raw.roster.students.length,
          history: raw.match.history.length,
          extractedOccurrences: 0,
        },
        warnings: [],
        sourceText: rawText,
      };
    if (
      !raw ||
      typeof raw !== "object" ||
      Array.isArray(raw) ||
      ![1, 2].includes(raw.schemaVersion ?? 1)
    )
      throw Error("unsupported legacy save");
    if (!Array.isArray(raw.groups))
      throw Error("legacy save groups are missing");
    root.SaveSchema.validateGroups(raw.groups, false);
    const sourceDigest = await textDigest(rawText),
      assets = new Map(),
      warnings = [];
    let occurrences = 0;
    async function extract(value, key = "") {
      if (
        key === "groupAvatar" &&
        typeof value === "string" &&
        value.startsWith("data:image/")
      ) {
        const m = value.match(
          /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/,
        );
        if (!m) {
          warnings.push({ code: "UNSUPPORTED_LEGACY_AVATAR" });
          return value;
        }
        const bytes = Uint8Array.from(atob(m[2]), (c) => c.charCodeAt(0));
        const sha256 = await digest(bytes),
          resourceId = "asset-" + sha256;
        occurrences++;
        if (!assets.has(resourceId))
          assets.set(resourceId, {
            resourceId,
            mimeType: m[1],
            sha256,
            byteLength: bytes.byteLength,
            dataBase64: m[2],
          });
        return { $asset: resourceId };
      }
      if (Array.isArray(value))
        return Promise.all(value.map((v) => extract(v)));
      if (value && typeof value === "object") {
        const out = {};
        for (const [k, v] of Object.entries(value))
          out[k] = await extract(v, k);
        return out;
      }
      return value;
    }
    const groups = await extract(raw.groups),
      used = new Set();
    for (let i = 0; i < groups.length; i++) {
      const g = groups[i];
      if (
        g.groupUid != null &&
        (!root.StableIdentity.isValidGroupUid(g.groupUid) ||
          used.has(g.groupUid))
      )
        throw Error("invalid or duplicate group identity");
      g.groupUid ||=
        "group-" + (await textDigest(sourceDigest + ":group:" + i));
      used.add(g.groupUid);
      g.score = Number(g.score ?? 0);
    }
    const students = [],
      assignments = [],
      rosterGroups = [];
    for (const [i, g] of groups.entries()) {
      rosterGroups.push({
        groupUid: g.groupUid,
        name: String(g.name || `第${i + 1}组`),
        groupNo: g.groupNo ?? i + 1,
        color: g.color || "#0f766e",
        avatarResourceId: g.groupAvatar?.$asset || null,
      });
      for (const [j, label] of (g.members || []).entries()) {
        const studentUid =
          "student-" +
          (await textDigest(sourceDigest + ":" + g.groupUid + ":" + j));
        students.push({
          studentUid,
          ...parseMember(label),
          legacyLabel: label,
          avatarResourceId: null,
        });
        assignments.push({ studentUid, groupUid: g.groupUid });
      }
    }
    if (rosterData)
      warnings.push({
        code: "ROSTER_REQUIRES_EXPLICIT_MAPPING",
        message: "独立名单身份需按来源映射，不按同名自动合并",
      });
    const prefs = {};
    for (const key of root.SaveSchema.appPreferenceKeys)
      if (Object.hasOwn(raw, key)) prefs[key] = clone(raw[key]);
    const extensions = {};
    for (const [k, v] of Object.entries(raw))
      if (!known.has(k)) extensions[k] = clone(v);
    const history = await extract(raw.history || []);
    const date =
      typeof raw.timestamp === "string"
        ? raw.timestamp
        : new Date().toISOString();
    const doc = {
      kind: "godpower.save",
      schemaVersion: 2,
      saveId: "save-" + sourceDigest,
      revision: 1,
      name: name.trim() || "导入课堂",
      createdAt: date,
      updatedAt: date,
      roster: { revision: 1, students, groups: rosterGroups, assignments },
      match: {
        season: { seasonId: raw.seasonId || "season-" + sourceDigest },
        groups,
        round: clone(raw.round || {}),
        picker: clone(raw.picker || {}),
        itemGlobal: clone(raw.itemGlobal || {}),
        history,
        firstHandDrawPending: raw.firstHandDrawPending ?? false,
        extensions,
      },
      achievements: clone(
        raw.achievementLedger || { schemaVersion: 1, groups: {} },
      ),
      archives: [],
      perSaveOptions: Object.hasOwn(raw, "saveAllIn")
        ? { saveAllIn: raw.saveAllIn }
        : {},
      assetReferences: [...assets.keys()],
      migration: {
        sourceDigest,
        rootOrder: Object.keys(raw),
        legacyMeta: {
          schemaVersion: raw.schemaVersion,
          appVersion: raw.appVersion,
          timestamp: raw.timestamp,
        },
        sourceType: "legacy-classroom",
        warnings,
      },
    };
    const valid = root.SaveSchema.validateV2(doc);
    return {
      documents: [valid],
      assets: [...assets.values()],
      appPreferences: { schemaVersion: 1, values: prefs },
      sourceDigest,
      sourceText: rawText,
      warnings,
      report: {
        groups: groups.length,
        students: students.length,
        history: history.length,
        assets: assets.size,
        extractedOccurrences: occurrences,
        sourceBytes: new TextEncoder().encode(rawText).byteLength,
        documentBytes: new TextEncoder().encode(JSON.stringify(valid))
          .byteLength,
      },
    };
  }
  function toLegacy(document, assets = [], preferences = { values: {} }) {
    const doc = root.SaveSchema.validateV2(document);
    const byId = new Map(assets.map((a) => [a.resourceId, a]));
    function expand(v) {
      if (Array.isArray(v)) return v.map(expand);
      if (v && typeof v === "object") {
        if (Object.keys(v).length === 1 && typeof v.$asset === "string") {
          const asset = byId.get(v.$asset);
          if (!asset) throw Error("缺少头像资源 asset " + v.$asset);
          return `data:${asset.mimeType};base64,${asset.dataBase64}`;
        }
        return Object.fromEntries(
          Object.entries(v).map(([k, x]) => [k, expand(x)]),
        );
      }
      return v;
    }
    const match = expand(doc.match);
    const values = {
      ...match.extensions,
      ...doc.migration?.legacyMeta,
      seasonId: match.season.seasonId,
      achievementLedger: clone(doc.achievements),
      groups: match.groups,
      picker: match.picker,
      itemGlobal: match.itemGlobal,
      round: match.round,
      history: match.history,
      firstHandDrawPending: match.firstHandDrawPending,
      ...preferences.values,
      ...doc.perSaveOptions,
    };
    const order = doc.migration?.rootOrder || Object.keys(values);
    const result = {};
    for (const k of order) if (Object.hasOwn(values, k)) result[k] = values[k];
    return result;
  }
  root.SaveMigration = Object.freeze({
    preview,
    bundle,
    validateAssets,
    convert: (p) => ({
      documents: clone(p.documents),
      assets: clone(p.assets),
      appPreferences: clone(p.appPreferences),
      sourceDigest: p.sourceDigest,
      sourceText: p.sourceText,
    }),
    toLegacy,
    textDigest,
    parseMember,
  });
})(globalThis);
