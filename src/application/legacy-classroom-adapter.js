/* Stable public APIs. ItemOperationBlocks is the sole item executor;
   new features must not add another override layer. */
function buildClassroomBackup() {
  if (window.classroomReady && classroomCommands.isPending())
    return clone(classroomCommands.baseline().backup);
  return projectClassroomBackup(state, historyStack, false);
}
// The owned path consumes the command's private snapshot, never live classroom data.
function projectClassroomBackup(source, history, owned) {
  return {
    schemaVersion: Reliability.schemaVersion,
    appVersion: "V@@VERSION@@",
    timestamp: new Date().toISOString(),
    seasonId: source.seasonId,
    achievementLedger: AchievementLedger.normalize(source.achievementLedger),
    groups: getPersistableGroups(source.groups),
    picker: owned ? source.picker : clone(source.picker),
    itemGlobal: owned
      ? source.itemGlobal || {}
      : clone(source.itemGlobal || {}),
    round: {
      roundActive: source.roundActive,
      evaluated: source.evaluated,
      correctAns: source.correctAns,
      hasStartedOnce: source.hasStartedOnce,
      lastRoundAllIn: source.lastRoundAllIn,
    },
    history: owned ? history : clone(history),
    ...(source.rosterSnapshot
      ? {
          rosterSnapshot: owned
            ? source.rosterSnapshot
            : clone(source.rosterSnapshot),
        }
      : {}),
    firstHandDrawPending: firstHandDrawPendingV218,
    adminPin: source.adminPin,
    masterVolume: source.masterVolume,
    sfxVolume: source.sfxVolume,
    zoomLevel: source.zoomLevel,
    resizerEnabled: source.resizerEnabled,
    resizerHeight: source.resizerHeight,
    columnMode: source.columnMode,
    saveAllIn: source.saveAllIn,
  };
}
function captureClassroomCommandSnapshot() {
  const captured = clone(state),
    history = clone(historyStack);
  return {
    state: captured,
    history,
    identity: state,
    backup: projectClassroomBackup(captured, history, true),
  };
}

function applyClassroomBackup(raw) {
  Reliability.validateBackup(raw);
  const data = Reliability.validateBackup(SchemaMigrations.migrateBackup(raw));
  window.GodpowerPicker?.invalidate();
  state.seasonId = StableIdentity.isValidSeasonId(data.seasonId)
    ? data.seasonId
    : StableIdentity.createSeasonId();
  if (data.achievementLedger != null)
    state.achievementLedger = AchievementLedger.normalize(
      data.achievementLedger,
    );
  else if (!state.achievementLedger)
    state.achievementLedger = AchievementLedger.empty();
  state.groups = normalizeAllGroups(data.groups);
  if (data.rosterSnapshot) state.rosterSnapshot = clone(data.rosterSnapshot);
  if (data.picker) {
    const p = data.picker;
    state.picker = {
      mode: ["individual", "group", "two_tier"].includes(p.mode)
        ? p.mode
        : "individual",
      antiRepeat: p.antiRepeat !== false,
      pickedStudentKeys: Array.isArray(p.pickedStudentKeys)
        ? p.pickedStudentKeys
        : [],
      pickedGroupIds: Array.isArray(p.pickedGroupIds) ? p.pickedGroupIds : [],
      preselectedGroupIds: Array.isArray(p.preselectedGroupIds)
        ? p.preselectedGroupIds
        : [],
    };
  }
  if (data.itemGlobal) {
    state.itemGlobal = clone(data.itemGlobal);
    for (const k of ["blooperUntil", "totalDraws", "handRaiseTotal", "pkTotal"])
      state.itemGlobal[k] = Reliability.count(state.itemGlobal[k]);
    for (const k of ["pickerHistory", "handRaiseHistory"])
      if (!Array.isArray(state.itemGlobal[k])) state.itemGlobal[k] = [];
    state.itemGlobal.customIcons = Object.fromEntries(
      Object.entries(state.itemGlobal.customIcons || {}).filter(
        ([k, v]) => ITEM_DEFS[k] && Reliability.safeImage(v),
      ),
    );
  }
  if (data.round) {
    const r = data.round;
    state.roundActive = !!r.roundActive;
    state.evaluated = !!r.evaluated;
    state.hasStartedOnce = !!r.hasStartedOnce;
    state.correctAns = ["A", "B", "C", "D"].includes(r.correctAns)
      ? r.correctAns
      : "";
    state.lastRoundAllIn = r.lastRoundAllIn || null;
  } else {
    // Unversioned V2 backups have no round metadata. Resume as an idle classroom.
    state.roundActive = false;
    state.evaluated = false;
    state.hasStartedOnce = false;
    state.correctAns = "";
    state.groups.forEach((g) => {
      g.selectedOpt = "";
      g.allIn = false;
      g.itemUsedThisRound = false;
    });
  }
  if (data.adminPin != null) state.adminPin = String(data.adminPin);
  for (const [k, min, max] of [
    ["masterVolume", 0, 1],
    ["sfxVolume", 0, 1],
    ["zoomLevel", 0.4, 2],
    ["resizerHeight", 0, 2000],
  ]) {
    if (Number.isFinite(Number(data[k])))
      state[k] = Math.max(min, Math.min(max, Number(data[k])));
  }
  for (const k of ["saveAllIn", "resizerEnabled"])
    if (typeof data[k] === "boolean") state[k] = data[k];
  if (["single", "double"].includes(data.columnMode))
    state.columnMode = data.columnMode;
  if (typeof data.firstHandDrawPending === "boolean")
    firstHandDrawPendingV218 = data.firstHandDrawPending;
  if (Array.isArray(data.history))
    historyStack = data.history
      .filter((h) => h && Array.isArray(h.groups))
      .slice(-MAX_HISTORY);
  ensureV2State();
  ensureGroupNumbersV213(false);
}
function importClassroomData(data) {
  if (globalThis.SaveManager?.enabled())
    return SaveManager.previewSource(JSON.stringify(data), "导入课堂").then(
      (preview) => SaveManager.importSource(preview),
    );
  const conflict = ClassroomWriteBarrier.conflict();
  if (conflict) return conflict;
  if (state.isLocked) return { ok: false, error: "请先解锁" };
  Reliability.invalidateDefenseDecisions();
  const old = clone(state),
    history = clone(historyStack),
    first = firstHandDrawPendingV218;
  const wasRecovering = !!window.classroomRecoveryRequired;
  try {
    Reliability.validateBackup(data);
    if (wasRecovering) {
      const preserved = ClassroomRepository.writeVerified(
        CLASSROOM_STORAGE,
        "godpower_recovery_before_import_v2",
        {
          sourceKey: Reliability.stateKey,
          raw: CLASSROOM_STORAGE.getItem(Reliability.stateKey),
          preservedAt: new Date().toISOString(),
        },
      );
      if (!preserved.ok)
        throw Error("无法保留待恢复的原存档：" + preserved.error);
    }
    cancelScoreAnimationAndSync();
    applyClassroomBackup(data);
    window.classroomRecoveryRequired = false;
    const result = saveState();
    if (!result.ok) throw Error(result.error);
    document.body.style.zoom = state.zoomLevel;
    renderAll();
    return { ok: true };
  } catch (error) {
    state = old;
    historyStack = history;
    firstHandDrawPendingV218 = first;
    window.classroomRecoveryRequired = wasRecovering;
    renderAll();
    return { ok: false, error: String(error.message || error) };
  }
}
function itemCommandSnapshot() {
  return JSON.stringify({ groups: state.groups, itemGlobal: state.itemGlobal });
}
function refreshClassroomSaveWarning() {
  const warning = document.getElementById("classroomSaveWarning");
  if (!warning) return;
  const pending = !!globalThis.SaveManager?.pendingSettlement?.(),
    blocked = !!globalThis.SaveManager?.blocked?.();
  warning.hidden = !pending && !blocked && !window.classroomUnsavedChanges;
  const text = document.getElementById("classroomSaveWarningText");
  if (text)
    text.textContent = pending
      ? "本届档案已安全保存，新一届初始化尚未完成。已暂停课堂修改，请完成初始化；也可先导出备份。"
      : blocked
        ? "存档库未成功读取，已暂停修改保护原数据。请重试或导出当前显示的数据。"
        : "本页有尚未保存的课堂数据。关闭或刷新前，请先导出备份。";
  const resume = document.getElementById("classroomSettlementResume");
  if (resume) resume.hidden = !pending;
}
function showClassroomSaveWarning(error) {
  const alreadyUnsaved = !!window.classroomUnsavedChanges;
  window.classroomUnsavedChanges = true;
  window.classroomPersistenceError = String(error || "保存不可用");
  const warning = document.getElementById("classroomSaveWarning");
  if (warning) {
    warning.hidden = false;
    warning.dataset.reason = String(error || "保存不可用");
  }
  refreshClassroomSaveWarning();
  if (!alreadyUnsaved) showToast("更改仅保存在本页。关闭或刷新前请导出备份。");
}
// Only this adapter touches global classroom state; the controller is pure/testable.
const classroomCommands = CommandLifecycle.create({
  active: () => !!window.itemCommandActive,
  setActive: (value) => {
    window.itemCommandActive = value;
  },
  commandId: () => StableIdentity.createCommandId(),
  createEventScope: (options) => DomainEvents.createScope(options),
  invalidate: () => Reliability.invalidateDefenseDecisions(),
  snapshot: captureClassroomCommandSnapshot,
  restore: (before) => {
    // Imported/replaced state belongs to a newer classroom and must be preserved.
    if (state === before.identity) {
      const liveGroups = new Map(state.groups.map((g) => [g.id, g]));
      const restored = before.state;
      restored.groups = restored.groups.map((g) => {
        const live = liveGroups.get(g.id);
        if (!live) return g;
        Object.keys(live).forEach((k) => delete live[k]);
        Object.assign(live, g);
        return live;
      });
      Object.keys(state).forEach((k) => delete state[k]);
      Object.assign(state, restored);
      historyStack = before.history;
    }
    cancelScoreAnimationAndSync();
  },
  record: (description) => {
    window.classroomRecordingCommand = true;
    try {
      recordHistory(description);
    } finally {
      window.classroomRecordingCommand = false;
    }
  },
  validate: () => {
    if (state.groups.some((g) => !Number.isSafeInteger(g.score)))
      throw Error("操作结果超出安全整数范围");
  },
  persist: (transaction) => saveState(transaction),
  render: () => renderAll(),
  committed: (transaction) =>
    window.dispatchEvent(
      new CustomEvent("godpower:domain-commit", { detail: transaction }),
    ),
  postCommitError: (error, transaction) => {
    console.error("课堂命令完成后界面反馈失败", transaction.commandId, error);
    showToast("操作已完成，但界面反馈失败。请先导出备份。");
  },
  result: (value) => {
    window.lastClassroomCommandResult = value;
  },
  warning: (error) => showClassroomSaveWarning(error),
  error: (error) =>
    showToast("操作未完成，已回滚，请导出备份：" + error.message),
});
Reliability.onDefenseInvalidation(() =>
  classroomCommands.cancel("lifecycle-changed"),
);
function runClassroomCommand(description, operation, options) {
  if (!ClassroomWriteBarrier.allow()) return false;
  return classroomCommands.run(description, operation, options);
}
function deferClassroomDefense(promise, apply, isCurrent) {
  if (classroomCommands.defer(promise, apply, isCurrent)) return;
  // Compatibility for direct effect callers outside the public item command.
  Promise.resolve(promise)
    .then((answer) => {
      if (!isCurrent()) return;
      apply(answer);
      saveState();
      renderAll();
    })
    .catch((error) => {
      console.error("防御确认失败", error);
      showToast("防御确认未完成，请重试");
    });
}
function useItem(groupId, index) {
  if (window.itemCommandActive) return false;
  Reliability.invalidateDefenseDecisions();
  const g = state.groups.find((x) => x.id === groupId);
  const fromHand = globalThis.HandItemCinematic?.take(groupId);
  const reason = Reliability.validateItem(state, g, index, isCommunismMode());
  closeItemWindowForFx();
  if (reason) {
    showToast(reason);
    return false;
  }
  const key = g.inventory[index].key;
  const presentation = {
    fromHand,
  };
  if (!ItemModules.canUse(key)) {
    showToast("该道具的主动使用积木已关闭");
    return false;
  }
  const accepted = runClassroomCommand(
    `${g.name} 使用道具：${ITEM_DEFS[key]?.name || key}`,
    (context) => {
      ensureV2State();
      const beforeValue = itemCommandSnapshot();
      const beforeGroups = JSON.parse(beforeValue).groups;
      const usedItem = g.inventory[index];
      const itemInstanceId = usedItem.itemInstanceId || null;
      const chargesBefore = Number(usedItem.charges) || 1;
      if (CompetitionEffects.cancelUse(g)) {
        showToast(g.name + " 冰冻已解除，本次道具使用取消");
        return true;
      }
      if (g.itemEffect?.iceLock) {
        delete g.itemEffect.iceLock;
        delete g.itemEffect.iceRoundsLeftV218;
        if (!Object.keys(g.itemEffect).length) g.itemEffect = null;
        showToast(`${g.name} 冰冻已解除，本次道具使用取消`);
        return true;
      }
      const result = ItemModules.execute(key, () =>
        ItemOperationBlocks.run(key, g, index, context, presentation),
      );
      if (result === false || itemCommandSnapshot() === beforeValue)
        return false;
      markItemUsedThisRoundV2177(groupId, usedItem);
      context.emit(
        "ITEM_USED",
        { type: "group", id: g.groupUid },
        {
          seasonId: state.seasonId,
          itemKey: key,
          itemInstanceId,
          chargesBefore,
          chargesAfter: Number(g.inventory[index]?.charges) || 0,
        },
      );
      context.onCommit((commit) => {
        if (presentation.targets) {
          presentation.targets = presentation.targets.map((target) => {
            const before = beforeGroups.find((group) => group.id === target.id);
            const after = state.groups.find((group) => group.id === target.id);
            const delta =
              after && before ? after.score - before.score : target.delta;
            return {
              ...target,
              delta,
              blocked: delta < 0 ? false : target.blocked,
              status: after
                ? CompetitionEffects.labels(after).join("；")
                : target.status,
            };
          });
        }
        for (const fact of ItemImpactFacts.scoreLosses(
          beforeGroups,
          state.groups,
          { actorGroupUid: g.groupUid, itemKey: key, seasonId: state.seasonId },
        ))
          commit.emit("ITEM_HIT", fact.aggregate, fact.payload);
      });
      return true;
    },
    { retainOnPersistenceFailure: false },
  );
  if (accepted && presentation.fromHand && presentation.caster) {
    classroomCommands.whenIdle().then((result) => {
      if (!result.ok) return;
      playSound("item_use");
      playSound(itemSoundCategoryV26(key));
      HandItemCinematic.present(presentation);
    });
  }
  return accepted;
}
// Read access denial is a browser capability limitation, not a corrupt save.
// Leave stored data untouched and keep ordinary classroom actions usable in RAM.
let classroomStoredState = null;
try {
  const loaded = ClassroomRepository.loadOrMigrate(CLASSROOM_STORAGE, {
    currentKey: Reliability.stateKey,
    legacyKey: Reliability.legacyStateKey,
    receiptKey: "godpower_migration_v2_receipt",
    fallbackData: () => SchemaMigrations.fromLegacyKeys(CLASSROOM_STORAGE),
    migrate: (raw) => {
      Reliability.validateBackup(raw);
      return SchemaMigrations.migrateBackup(raw);
    },
    validate: (data) => Reliability.validateBackup(data),
  });
  window.classroomMigrationResult = {
    status: loaded.status,
    stage: loaded.stage || null,
    sourceKey: loaded.sourceKey,
    error: loaded.error || null,
  };
  classroomStoredState = loaded.data;
  if (loaded.status === "failed") {
    if (loaded.sourceValidated) {
      showClassroomSaveWarning("迁移暂未保存，旧存档已保留：" + loaded.error);
    } else if (
      ["validate-current", "prepare-migration", "read-legacy"].includes(
        loaded.stage,
      )
    ) {
      window.classroomRecoveryRequired = true;
      showClassroomSaveWarning("原存档无法读取，已保护原数据：" + loaded.error);
    } else {
      window.classroomStorageUnavailable = true;
      showClassroomSaveWarning(loaded.error);
    }
  }
  if (loaded.receiptError)
    console.warn("迁移数据已保存，迁移回执写入失败", loaded.receiptError);
} catch (error) {
  window.classroomStorageUnavailable = true;
  showClassroomSaveWarning(error.message);
}
if (classroomStoredState !== null) {
  try {
    applyClassroomBackup(classroomStoredState);
  } catch (error) {
    console.error("主存档读取失败，未覆盖原存档", error);
    window.classroomRecoveryRequired = true;
    showClassroomSaveWarning("原存档无法解析，已保护原数据：" + error.message);
  }
}
window.classroomReady = true;

/* Desktop hydration. The fixed save file is the classroom's durable home, so it
   wins over the browser cache whenever it holds a valid envelope: editing or
   copying that file is how a teacher moves a classroom between machines. Saves
   are held off until this settles (ClassroomSaveFile.isHydrating). */
if (globalThis.ClassroomSaveFile?.available?.()) {
  window.classroomHydrationPromise = ClassroomSaveFile.hydrate().then(
    (result) => {
      window.classroomSaveFileStatus = result.status;
      if (result.status !== "loaded") return;
      try {
        applyClassroomBackup(result.data);
        // Hydration is settled now, so this write mirrors the restored classroom
        // back to both localStorage and the file.
        saveState();
        renderAll();
        updatePickerPoolUI();
        window.classroomSaveFileStatus = "restored";
        showToast("已从存档文件恢复课堂：" + (result.info?.path || ""));
      } catch (error) {
        window.classroomSaveFileStatus = "restore-failed";
        console.error("存档文件恢复失败", error);
        showToast("存档文件无法恢复，已保留本机数据：" + error.message);
      }
    },
  );
} else {
  // The browser build has no file bridge, so nothing waits.
  ClassroomSaveFile?.markHydrated?.();
}

function legacyJudgeRound() {
  return RoundSettlement.execute();
}

function judgeRound() {
  if (!state.roundActive || state.evaluated || !state.correctAns) return false;
  try {
    Reliability.calculateRoundScores(state);
  } catch (error) {
    themeAlert(error.message);
    return false;
  }
  v213SuppressReorderAnimation = true;
  const accepted = runClassroomCommand(
    `自动判定结算 (正解: ${state.correctAns})`,
    (context) => {
      window.pendingRoundPresentation = legacyJudgeRound();
      for (const fact of window.pendingRoundPresentation.roundFacts)
        context.emit(
          "ROUND_SETTLED",
          { type: "group", id: fact.groupUid },
          fact,
        );
      return true;
    },
    { retainOnPersistenceFailure: true },
  );
  if (!accepted) v213SuppressReorderAnimation = false;
  else
    classroomCommands.whenIdle().then((result) => {
      v213SuppressReorderAnimation = false;
      if (result?.ok) {
        RoundSettlement.present(window.pendingRoundPresentation);
        window.pendingRoundPresentation = null;
      }
    });
  return accepted;
}

const classroomDock = document.querySelector(".bottom-dock");
if (classroomDock && typeof ResizeObserver === "function") {
  new ResizeObserver(() =>
    document.body.style.setProperty(
      "--dock-height",
      classroomDock.getBoundingClientRect().height + "px",
    ),
  ).observe(classroomDock);
}
