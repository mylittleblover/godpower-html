/* Stable public APIs. ItemOperationBlocks is the sole item executor;
   new features must not add another override layer. */
function buildClassroomBackup() {
  if (window.classroomReady && classroomCommands.isPending())
    return clone(classroomCommands.baseline().backup);
  return projectClassroomBackup(state, historyStack, false);
}
function buildClassroomBackupForSave() {
  if (window.classroomReady && classroomCommands.isPending())
    return clone(classroomCommands.baseline().backup);
  return projectClassroomBackup(state, historyStack, false, {
    cloneHistory: false,
  });
}
// The owned path consumes the command's private snapshot, never live classroom data.
function projectClassroomBackup(
  source,
  history,
  owned,
  { cloneHistory = true } = {},
) {
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
    ...(source.randomEvents
      ? {
          randomEvents: owned
            ? source.randomEvents
            : clone(source.randomEvents),
        }
      : {}),
    ...(source.randomEventConfig
      ? {
          randomEventConfig: owned
            ? source.randomEventConfig
            : clone(source.randomEventConfig),
        }
      : {}),
    round: {
      roundActive: source.roundActive,
      evaluated: source.evaluated,
      correctAns: source.correctAns,
      hasStartedOnce: source.hasStartedOnce,
      lastRoundAllIn: source.lastRoundAllIn,
    },
    history: owned ? history : cloneHistory ? clone(history) : history.slice(),
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
    history = historyStack.slice();
  let backup;
  const snapshot = {
    state: captured,
    history,
    identity: state,
  };
  Object.defineProperty(snapshot, "backup", {
    enumerable: true,
    get() {
      if (!backup) backup = projectClassroomBackup(captured, history, true);
      return backup;
    },
  });
  return snapshot;
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
  if (data.randomEventConfig && typeof RandomEvents !== "undefined")
    state.randomEventConfig = RandomEvents.normalizeConfig(
      data.randomEventConfig,
    );
  if (data.randomEvents && typeof RandomEvents !== "undefined")
    state.randomEvents = RandomEvents.normalizeState(
      data.randomEvents,
      state.randomEventConfig,
    );
  else if (typeof resetRandomEventSeason === "function")
    resetRandomEventSeason();
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
      const orderedBefore = ranking();
      const posBefore = orderedBefore.findIndex((x) => x.id === groupId);
      const casterRankBefore =
        posBefore >= 0
          ? 1 + orderedBefore.filter((x) => x.score > g.score).length
          : null;
      const adjacentAboveUid = orderedBefore[posBefore - 1]?.groupUid || null;
      const adjacentBelowUid = orderedBefore[posBefore + 1]?.groupUid || null;
      const leaderUid =
        orderedBefore[0] && orderedBefore[0].id !== groupId
          ? orderedBefore[0].groupUid
          : null;
      const aheadSet = new Set(
        orderedBefore.slice(0, Math.max(0, posBefore)).map((x) => x.groupUid),
      );
      const behindSet = new Set(
        posBefore >= 0
          ? orderedBefore.slice(posBefore + 1).map((x) => x.groupUid)
          : [],
      );
      const groupCount = state.groups.length;
      const roundNumber = Number(state.itemGlobal?.pkTotal) || 0;
      const usedItem = g.inventory[index];
      const itemInstanceId = usedItem.itemInstanceId || null;
      const chargesBefore = Number(usedItem.charges) || 1;
      const freezeCasterUid =
        g.competitionEffects?.freeze?.casterGroupUid || null;
      if (CompetitionEffects.cancelUse(g)) {
        if (
          freezeCasterUid &&
          StableIdentity.isValidGroupUid(freezeCasterUid)
        ) {
          context.emit(
            "EFFECT_EXPIRED",
            { type: "group", id: freezeCasterUid },
            {
              seasonId: state.seasonId,
              effectKey: "freeze",
              reason: "use-cancelled",
              targetGroupUid: g.groupUid,
            },
          );
        }
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
      const defenseEvents = [];
      let result;
      if (typeof pushDefenseCollector === "function")
        pushDefenseCollector(defenseEvents);
      try {
        result = ItemModules.execute(key, () =>
          ItemOperationBlocks.run(key, g, index, context, presentation),
        );
      } finally {
        if (typeof popDefenseCollector === "function") popDefenseCollector();
      }
      if (result === false || itemCommandSnapshot() === beforeValue)
        return false;
      markItemUsedThisRoundV2177(groupId, usedItem);
      const chargesAfter = Number(g.inventory[index]?.charges) || 0;
      context.onCommit((commit) => {
        const casterBefore = beforeGroups.find((group) => group.id === groupId);
        const casterAfter = state.groups.find((group) => group.id === groupId);
        const casterDelta =
          casterBefore && casterAfter
            ? casterAfter.score - casterBefore.score
            : 0;
        const orderedAfter = ranking();
        const casterRankAfter = casterAfter
          ? 1 + orderedAfter.filter((x) => x.score > casterAfter.score).length
          : casterRankBefore;
        const boostedOthers = [];
        const hitTargetUids = [];
        for (const before of beforeGroups) {
          if (before.groupUid === g.groupUid) continue;
          const after = state.groups.find(
            (group) => group.groupUid === before.groupUid,
          );
          if (!after) continue;
          if (after.score > before.score)
            boostedOthers.push({
              groupUid: before.groupUid,
              delta: after.score - before.score,
            });
          else if (after.score < before.score)
            hitTargetUids.push(before.groupUid);
        }
        commit.emit(
          "ITEM_USED",
          { type: "group", id: g.groupUid },
          {
            seasonId: state.seasonId,
            itemKey: key,
            itemInstanceId,
            chargesBefore,
            chargesAfter,
            roundNumber,
            groupCount,
            casterDelta,
            casterRankBefore,
            casterRankAfter,
            boostedAheadCount: boostedOthers.filter((x) =>
              aheadSet.has(x.groupUid),
            ).length,
            boostedBehindCount: boostedOthers.filter((x) =>
              behindSet.has(x.groupUid),
            ).length,
            hitTargetUids,
            hitAheadCount: hitTargetUids.filter((u) => aheadSet.has(u)).length,
            hitAdjacentAbove:
              !!adjacentAboveUid && hitTargetUids.includes(adjacentAboveUid),
            hitAdjacentBelow:
              !!adjacentBelowUid && hitTargetUids.includes(adjacentBelowUid),
            hitLeader: !!leaderUid && hitTargetUids.includes(leaderUid),
            booAlternateMushroom: !!presentation.booAlternateMushroom,
          },
        );
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
        for (const def of defenseEvents) {
          if (StableIdentity.isValidGroupUid(def.defenderGroupUid)) {
            commit.emit(
              "DEFENSE_RESOLVED",
              { type: "group", id: def.defenderGroupUid },
              {
                seasonId: state.seasonId,
                attackerGroupUid: g.groupUid,
                ...def,
              },
            );
          }
        }
        if (key === "coin_shell" || key === "question") {
          for (const entry of boostedOthers) {
            commit.emit(
              "SCORE_CHANGED",
              { type: "group", id: entry.groupUid },
              {
                seasonId: state.seasonId,
                origin: "item-boost",
                itemKey: key,
                delta: entry.delta,
              },
            );
          }
        }
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
function initializeLegacyClassroomCache() {
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
        showClassroomSaveWarning(
          "原存档无法读取，已保护原数据：" + loaded.error,
        );
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
      showClassroomSaveWarning(
        "原存档无法解析，已保护原数据：" + error.message,
      );
    }
  }
  window.classroomReady = true;
}

/* The canonical library is authoritative. Never replay an old mirror/file over
   an existing new-format classroom, or write anything merely because it opened. */
window.classroomReady = false;
window.classroomHydrationPromise = (async () => {
  let probe;
  try {
    probe = await SaveRepository.open();
    const existing = await probe.list();
    if (!existing?.ok)
      throw Error(existing?.message || existing?.code || "存档库读取失败");
    if (existing.index.entries.length) {
      window.classroomCanonicalAtStartup = true;
      window.classroomMigrationResult = {
        status: "canonical",
        sourceKey: null,
      };
      window.classroomSaveFileStatus = "canonical";
      ClassroomSaveFile.markHydrated();
      return;
    }
  } catch (error) {
    window.classroomStartupError = String(error.message || error);
    ClassroomSaveFile.markHydrated();
    return;
  } finally {
    probe?.close();
  }
  // Only a genuinely empty library may use the original first-run bootstrap.
  // Explicit old-file import/recovery remains available and preserves its source.
  initializeLegacyClassroomCache();
  if (globalThis.ClassroomSaveFile?.available?.()) {
    const result = await ClassroomSaveFile.hydrate();

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
  } else ClassroomSaveFile.markHydrated();
})().finally(() => {
  window.classroomReady = true;
});

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
      const evOut = window.pendingRoundPresentation?.randomEventOutcome;
      if (evOut?.triggered) {
        for (const grant of evOut.grantedItems || []) {
          if (grant.groupUid && grant.itemKey)
            context.emit(
              "ITEM_ACQUIRED",
              { type: "group", id: grant.groupUid },
              {
                seasonId: state.seasonId,
                itemKey: grant.itemKey,
                itemInstanceId: grant.itemInstanceId || null,
                source: grant.swappedOutKey
                  ? "random-event-swap"
                  : "random-event",
              },
            );
        }
        context.emit(
          "RANDOM_EVENT_TRIGGERED",
          { type: "season", id: state.seasonId },
          {
            seasonId: state.seasonId,
            eventId: evOut.id,
            eventName: evOut.name,
            category: evOut.category,
            roundNumber: evOut.roundNumber,
          },
        );
      }
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
