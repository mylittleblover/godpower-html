/* Runtime owner for the save library. Competition rules remain in their existing commands. */
(function installSaveManager(root) {
  "use strict";
  let legacyRosterMessage = "",
    libraryBlocked = false,
    deferredLegacySave = null,
    preferenceQueue = Promise.resolve({ ok: true });
  let repo = null,
    session = null,
    starting = true,
    readyPromise = null;
  let currentStatus = { phase: "starting" },
    preferences = { schemaVersion: 1, revision: 0, values: {} };
  const pendingAssets = new Map();
  const prefs = () =>
    Object.fromEntries(SaveSchema.appPreferenceKeys.map((k) => [k, state[k]]));
  function notify(detail) {
    currentStatus = detail;
    if (typeof refreshClassroomSaveWarning === "function")
      refreshClassroomSaveWarning();
    root.dispatchEvent(new CustomEvent("godpower:save-status", { detail }));
  }
  function applyDocument(doc) {
    Reliability.invalidateDefenseDecisions();
    root.GodpowerPicker?.invalidate();
    root.ClassroomHandSync?.notify(null);
    cancelScoreAnimationAndSync();
    root.ClassroomFeedback?.cancel();
    root.ItemScoreCinematics?.cancel?.();
    applyClassroomBackup(SaveProjection.toRuntime(doc, { values: prefs() }));
    root.classroomRecoveryRequired = false;
    renderAll();
    updatePickerPoolUI();
    root.dispatchEvent(
      new CustomEvent("godpower:active-save-changed", {
        detail: { saveId: doc.saveId, rosterRevision: doc.roster.revision },
      }),
    );
  }
  async function start() {
    const wasInert = document.body.inert;
    document.body.inert = true;
    try {
      await root.classroomHydrationPromise;
      repo = await SaveRepository.open();
      const listed = await repo.list();
      if (!listed?.ok)
        throw Error(listed?.message || listed?.code || "无法读取存档库");
      if (
        !listed.index.entries.length &&
        root.classroomStorageUnavailable &&
        ClassroomSaveFile?.sourceText?.() == null
      )
        throw Error("旧版存储暂不可读取，已停止自动迁移并保留原数据");
      if (
        !listed.index.entries.length &&
        ClassroomSaveFile?.available?.() &&
        ["error", "invalid", "restore-failed"].includes(
          root.classroomSaveFileStatus,
        )
      )
        throw Error("原始桌面存档读取失败，已停止自动迁移并保留原文件");
      const savedPrefs = await repo.loadPreferences();
      if (!savedPrefs?.ok)
        throw Error(
          savedPrefs?.message || savedPrefs?.code || "无法读取全局设置",
        );
      preferences = savedPrefs.preferences;
      if (preferences.revision > 0) {
        for (const key of SaveSchema.appPreferenceKeys)
          if (Object.hasOwn(preferences.values, key))
            state[key] = preferences.values[key];
      } else {
        const written = await repo.savePreferences(prefs(), {
          expectedRevision: 0,
        });
        if (!written.ok) throw Error(written.message || written.code);
        preferences = written.preferences;
      }
      if (!listed.index.activeSaveId) {
        if (listed.index.entries.length) {
          const chosen = await repo.switchActive(
            listed.index.entries[0].saveId,
            { expectedGeneration: listed.index.generation },
          );
          if (!chosen.ok) throw Error(chosen.message || chosen.code);
        } else {
          if (root.classroomRecoveryRequired)
            throw Error("旧存档需要恢复，原始数据已保留；请先使用恢复工具");
          const rawText =
            ClassroomSaveFile?.sourceText?.() ??
            CLASSROOM_STORAGE.getItem(Reliability.stateKey) ??
            JSON.stringify(buildClassroomBackup());
          const preview = await SaveMigration.preview({
            rawText,
            name: "当前课堂",
          });
          preview.documents[0].archives = getSettlementHistory();
          for (const doc of preview.documents)
            Reliability.validateBackup(
              SaveProjection.toRuntime(doc, { values: prefs() }),
            );
          const imported = await repo.importPreview(preview, {
            activate: true,
          });
          if (!imported.ok) throw Error(imported.message || imported.code);
        }
      }
      await discoverLegacyRoster();
      session = await SaveSession.create({
        repository: repo,
        apply: applyDocument,
        onStatus: notify,
        commandBusy: () =>
          classroomCommands.isPending() && !classroomCommands.isCommitting(),
        beforeSwitch: async () => {
          await classroomCommands.whenIdle();
          Reliability.invalidateDefenseDecisions();
          root.GodpowerPicker?.invalidate();
          root.ClassroomFeedback?.cancel();
          if (typeof closePickerModal === "function") closePickerModal();
        },
      });
      libraryBlocked = false;
      return { ok: true };
    } catch (error) {
      libraryBlocked = true;
      notify({ phase: "error", error: error.message });
      showClassroomSaveWarning(
        "新版存档未启用，旧数据仍保留：" + error.message,
      );
      return { ok: false, error: error.message };
    } finally {
      starting = false;
      document.body.inert = wasInert;
    }
  }
  const ready = () => (readyPromise ||= start());
  function persistPreferences(values) {
    const snapshot = SaveSchema.clone(values);
    const run = async () => {
      if (JSON.stringify(snapshot) === JSON.stringify(preferences.values))
        return { ok: true };
      const changed = await repo.savePreferences(snapshot, {
        expectedRevision: preferences.revision,
      });
      if (changed.ok) preferences = changed.preferences;
      return changed;
    };
    preferenceQueue = preferenceQueue
      .then(run, run)
      .catch((error) => ({ ok: false, error: error.message }));
    return preferenceQueue;
  }
  function scheduleLegacySave() {
    if (!session || deferredLegacySave) return deferredLegacySave;
    const token = session.token();
    deferredLegacySave = classroomCommands
      .whenIdle()
      .then(async () => {
        const current = session?.token();
        if (
          !current ||
          current.saveId !== token.saveId ||
          current.generation !== token.generation ||
          session.isSwitching()
        )
          return persistPreferences({ ...preferences.values, ...prefs() });
        const result = saveState();
        return result.completion || result;
      })
      .catch((error) => {
        showClassroomSaveWarning(error.message);
        return { ok: false, error: error.message };
      })
      .finally(() => {
        deferredLegacySave = null;
      });
    return deferredLegacySave;
  }
  async function persist(payload) {
    const token = session.token(),
      snapshot = SaveSchema.clone(payload);
    const assets = [...pendingAssets.values()]
      .filter(
        (a) => a.saveId === token.saveId && a.generation === token.generation,
      )
      .map((a) => a.asset);
    const result = await session.update(
      async (doc) => {
        const projected = await SaveProjection.fromOwnedRuntime(doc, snapshot);
        if (
          doc.match.pendingSettlement &&
          doc.match.season.seasonId === projected.document.match.season.seasonId
        ) {
          const before = SaveSchema.clone(doc.match),
            after = SaveSchema.clone(projected.document.match);
          delete before.pendingSettlement;
          delete after.pendingSettlement;
          if (JSON.stringify(before) !== JSON.stringify(after))
            throw Error("本届已归档，请先完成新一届初始化");
        }
        return {
          ...projected,
          assets: [
            ...new Map(
              [...projected.assets, ...assets].map((a) => [a.resourceId, a]),
            ).values(),
          ],
        };
      },
      { token },
    );
    if (!result.ok) {
      showClassroomSaveWarning(result.error || result.message || result.code);
      return result;
    }
    if (
      session.token().saveId === token.saveId &&
      session.token().generation === token.generation
    )
      if (
        JSON.stringify(state.rosterSnapshot) ===
        JSON.stringify(snapshot.rosterSnapshot)
      )
        state.rosterSnapshot = SaveSchema.clone(result.document.roster);
    for (const asset of assets)
      pendingAssets.delete(token.saveId + ":" + asset.resourceId);
    const values = Object.assign(
      {},
      preferences.values,
      ...SaveSchema.appPreferenceKeys.map((k) => ({ [k]: snapshot[k] })),
    );
    const prefResult = await persistPreferences(values);
    // The versioned vault ACK is authoritative. Do not re-serialize and
    // synchronously mirror the entire history into a superseded save format.
    root.classroomUnsavedChanges = false;
    const warning = document.getElementById("classroomSaveWarning");
    if (warning) warning.hidden = true;
    if (!prefResult.ok)
      showClassroomSaveWarning(
        "课堂已保存，全局设置保存失败：" +
          (prefResult.message || prefResult.error || prefResult.code),
      );
    return result;
  }
  async function edit(description, operation, { assets = [] } = {}) {
    await ready();
    if (!session) return { ok: false, error: "存档库尚未就绪" };
    if (!ClassroomWriteBarrier.allow())
      return { ok: false, error: "课堂正在保存或切换" };
    if (state.isLocked) {
      openPwdModal();
      return { ok: false, error: "请先解锁" };
    }
    const token = session.token();
    const accepted = runClassroomCommand(
      description,
      () => {
        const doc = operation(session.snapshot());
        for (const asset of assets)
          pendingAssets.set(token.saveId + ":" + asset.resourceId, {
            ...token,
            asset,
          });
        state.rosterSnapshot = SaveSchema.clone(doc.roster);
        state.groups = normalizeAllGroups(
          SaveProjection.toRuntime(doc, { values: prefs() }).groups,
        );
        return true;
      },
      { source: "manual", retainOnPersistenceFailure: false },
    );
    if (!accepted) return { ok: false, error: "操作未提交" };
    return classroomCommands.whenIdle();
  }
  async function discoverLegacyRoster() {
    try {
      const rawText = root.localStorage.getItem("godpower_classroom_roster_v1");
      if (!rawText) return;
      const digest = await SaveMigration.textDigest(rawText),
        previous = await repo.getSource(digest);
      if (previous?.raw) {
        legacyRosterMessage =
          "旧教师／课堂名单已保留为独立存档，原始名单与头像库未删除。";
        return;
      }
      const preview = await previewSource(rawText, "旧课堂名单");
      const result = await repo.importPreview(preview, { activate: false });
      if (!result.ok) throw Error(result.message || result.code);
      legacyRosterMessage = `已从旧名单建立 ${preview.documents.length} 个独立课堂存档；仅迁移真实分组，不推测比赛成绩。`;
      if (preview.warnings.some((w) => w.code === "LEGACY_AVATAR_UNAVAILABLE"))
        legacyRosterMessage += " 部分旧头像暂不可读，原资源和来源信息仍保留。";
    } catch (error) {
      legacyRosterMessage = "旧名单暂未转换，原文保持不变：" + error.message;
      console.warn(legacyRosterMessage);
    }
  }
  async function previewSource(rawText, name) {
    let resources = null,
      preview;
    try {
      preview = await SaveMigration.preview({
        rawText,
        name,
        readAsset: async (id) => {
          resources ||= await root.TeachingResourceRepository.open();
          return resources.get(id);
        },
      });
    } finally {
      resources?.close();
    }
    for (const doc of preview.documents)
      Reliability.validateBackup(
        SaveProjection.toRuntime(doc, { values: prefs() }),
      );
    return preview;
  }
  async function importSource(preview) {
    await ready();
    if (!repo) return { ok: false, error: "存档库尚未就绪，请重试读取" };
    if (state.isLocked) {
      openPwdModal();
      return { ok: false, error: "请先解锁" };
    }
    if (session && !ClassroomWriteBarrier.allow())
      return { ok: false, error: "课堂正在保存或切换" };
    const listed = await repo.list();
    if (!listed.ok) return listed;
    let imported = await repo.importPreview(preview, { activate: false });
    if (imported.code === "SAVE_ALREADY_EXISTS") {
      // A newer snapshot of the same save must never overwrite the classroom
      // being used. Store a separate recovery copy; the original source bytes
      // and its receipt still determine idempotency on retry.
      const copy = SaveSchema.clone(preview);
      for (const doc of copy.documents) {
        const originalSaveId = doc.saveId;
        doc.saveId = "save-" + crypto.randomUUID();
        doc.revision = 1;
        doc.name += "（导入副本）";
        doc.migration = {
          ...(doc.migration || {}),
          copiedFromSaveId: originalSaveId,
        };
      }
      imported = await repo.importPreview(copy, { activate: false });
    }
    if (!imported.ok) return imported;
    const currentIndex = await repo.list();
    if (!currentIndex.ok) return currentIndex;
    if (
      !currentIndex.index.entries.some((e) => e.saveId === imported.saveIds[0])
    )
      return {
        ok: false,
        code: "SAVE_IN_TRASH",
        error: "此来源已导入并移到回收站，请先从回收站恢复。",
      };
    if (session) return session.switchTo(imported.saveIds[0]);
    const active = await repo.switchActive(imported.saveIds[0], {
      expectedGeneration: listed.index.generation,
    });
    if (!active.ok) return active;
    readyPromise = null;
    starting = true;
    repo.close();
    return ready();
  }

  async function exportCurrent() {
    if (!session) throw Error("尚未读取可用存档，请先重试读取；原文件仍受保护");
    await session.whenIdle();
    const doc = session.snapshot(),
      assets = [];
    for (const id of doc.assetReferences) {
      const asset = await repo.getAsset(id);
      if (!asset || asset.ok === false) throw Error("缺少资源：" + id);
      assets.push(asset);
    }
    return SaveMigration.bundle(doc, assets);
  }
  root.SaveManager = Object.freeze({
    ready,
    blocked: () => libraryBlocked,
    pendingSettlement: () => !!currentStatus.pendingSettlement,
    retry: () => {
      if (starting) return ready();
      readyPromise = null;
      starting = true;
      session = null;
      repo?.close();
      return ready();
    },
    isStarting: () => starting,
    enabled: () => !!session,
    isSwitching: () => !!session?.isSwitching(),
    context: () =>
      session?.token() ||
      (currentStatus.saveId
        ? { saveId: currentStatus.saveId, generation: currentStatus.generation }
        : null),
    snapshot: () => session?.snapshot() || null,
    rosterContext: () => session?.rosterContext() || null,
    rosterView: () => session?.rosterView() || null,
    status: () => ({ ...currentStatus, legacyRosterMessage }),
    repository: () => repo,
    persist,
    scheduleLegacySave,
    edit,
    previewSource,
    importSource,
    exportCurrent,
    rename: async (name) => {
      const trimmed = String(name || "").trim();
      if (!trimmed || trimmed.length > 100)
        return { ok: false, error: "存档名称需为1至100字" };
      await ready();
      if (state.isLocked) {
        openPwdModal();
        return { ok: false, error: "请先解锁" };
      }
      if (!ClassroomWriteBarrier.allow())
        return { ok: false, error: "请等待当前操作完成" };
      return session.update((doc) => {
        doc.name = trimmed;
        return { document: doc };
      });
    },
    create: async ({ name = "新课堂", copy = false } = {}) => {
      await ready();
      if (state.isLocked) {
        openPwdModal();
        return { ok: false, error: "请先解锁" };
      }
      if (!ClassroomWriteBarrier.allow())
        return { ok: false, error: "请等待当前操作完成" };
      let bundle;
      if (copy) bundle = await exportCurrent();
      else {
        const raw = buildClassroomBackup();
        raw.groups = [
          normalizeGroup(
            {
              id: 1,
              groupUid: StableIdentity.createGroupUid(),
              groupNo: 1,
              name: "第 1 组",
              color: DEFAULT_COLORS[0],
              score: 0,
              members: [],
            },
            0,
          ),
        ];
        raw.history = [];
        raw.itemGlobal = {};
        raw.picker = {
          mode: "individual",
          antiRepeat: true,
          pickedStudentKeys: [],
          pickedGroupIds: [],
          preselectedGroupIds: [],
        };
        raw.round = {
          roundActive: false,
          evaluated: false,
          correctAns: "",
          hasStartedOnce: false,
          lastRoundAllIn: null,
        };
        raw.seasonId = StableIdentity.createSeasonId();
        raw.achievementLedger = AchievementLedger.empty();
        delete raw.rosterSnapshot;
        const preview = await SaveMigration.preview({
          rawText: JSON.stringify(raw),
          name,
        });
        bundle = SaveMigration.bundle(preview.documents[0], preview.assets);
      }
      const doc = bundle.documents[0];
      doc.saveId = "save-" + crypto.randomUUID();
      doc.revision = 1;
      doc.name = String(name).trim() || "新课堂";
      doc.createdAt = doc.updatedAt = new Date().toISOString();
      return importSource(
        await previewSource(JSON.stringify(bundle), doc.name),
      );
    },
    archive: (record) =>
      session.update((doc) => {
        if (record.seasonId !== doc.match.season.seasonId)
          throw Error("归档赛季已变化");
        const existing = doc.archives.find(
          (a) => a.seasonId === record.seasonId,
        );
        if (existing && !doc.match.pendingSettlement)
          throw Error("本届已有归档，请先检查档案");
        if (!existing)
          doc.archives.unshift(
            SaveSchema.clone({
              ...record,
              schemaVersion: Reliability.schemaVersion,
            }),
          );
        doc.match.pendingSettlement = {
          seasonId: record.seasonId,
          recordId: (existing || record).id,
        };
        return { document: doc };
      }),
    removeArchive: (id) =>
      session.update((doc) => {
        doc.archives = doc.archives.filter((a) => a.id !== id);
        return { document: doc };
      }),
    setTrashed: async (id, value, { context: requested, revision } = {}) => {
      const now = session?.token();
      if (
        !now ||
        !requested ||
        now.saveId !== requested.saveId ||
        now.generation !== requested.generation
      )
        return { ok: false, error: "存档已切换，请重新操作" };
      if (state.isLocked || !ClassroomWriteBarrier.allow())
        return { ok: false, error: "请先解锁并等待当前操作完成" };
      const result = await repo.setTrashed(id, value, {
        expectedGeneration: now.generation,
        expectedRevision: revision,
      });
      if (result.ok)
        root.dispatchEvent(new CustomEvent("godpower:save-library-changed"));
      return result;
    },
    whenIdle: async () => {
      await deferredLegacySave;
      const result = await session?.whenIdle();
      await preferenceQueue;
      return result || { ok: false };
    },
    switchTo: async (id) => {
      await ready();
      if (state.isLocked) {
        openPwdModal();
        return { ok: false, error: "请先解锁" };
      }
      return session?.switchTo(id) || { ok: false, error: "存档未就绪" };
    },
  });
  document.addEventListener("DOMContentLoaded", ready, { once: true });
})(globalThis);
