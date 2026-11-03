function getPersistableGroups() {
  return state.groups.map((g) => ({
    ...g,
    score: Number.isFinite(Number(g.score)) ? Math.trunc(Number(g.score)) : 0,
    displayScore: Number.isFinite(Number(g.score))
      ? Math.trunc(Number(g.score))
      : 0,
  }));
}

function saveState(transaction) {
  if (globalThis.SaveManager?.blocked?.()) {
    showClassroomSaveWarning(
      "新版存档库读取失败，已禁止回退覆盖旧存档，请重试或导出当前显示的数据。",
    );
    return { ok: false, error: "存档库未成功读取，旧文件保持不变" };
  }
  if (globalThis.SaveManager?.isStarting()) return { ok: true, deferred: true };
  if (window.classroomRecoveryRequired) {
    showClassroomSaveWarning("需要先恢复主存档");
    return { ok: false, error: "需要先恢复主存档" };
  }
  if (
    !window.classroomReady ||
    window.itemCommandActive ||
    classroomCommands.isPending()
  ) {
    if (
      globalThis.SaveManager?.enabled() &&
      !window.itemCommandActive &&
      classroomCommands.isPending()
    )
      SaveManager.scheduleLegacySave();
    return { ok: true, deferred: true };
  }
  ensureV2State();
  if (Array.isArray(transaction?.events) && transaction.events.length) {
    state.achievementLedger = AchievementLedger.apply(
      state.achievementLedger,
      transaction.events,
      { seasonId: state.seasonId },
    ).ledger;
  }
  const payload = buildClassroomBackup();
  // Until startup hydration finishes, the file is still the source of truth;
  // writing now would overwrite a classroom the user copied in.
  if (globalThis.ClassroomSaveFile?.isHydrating?.())
    return { ok: true, deferred: true };
  if (globalThis.SaveManager?.enabled()) {
    const completion = SaveManager.persist(payload).then((result) => ({
      ...result,
      ...(transaction?.events?.length ? { eventsPersisted: !!result.ok } : {}),
    }));
    return transaction ? completion : { ok: true, pending: true, completion };
  }
  const result = Reliability.writeVerified(
    CLASSROOM_STORAGE,
    Reliability.stateKey,
    payload,
  );
  if (!result.ok) {
    showClassroomSaveWarning(result.error);
    return result;
  }
  window.classroomUnsavedChanges = false;
  const saveWarning = document.getElementById("classroomSaveWarning");
  if (saveWarning) saveWarning.hidden = true;
  // Legacy keys remain readable by V2.18.13. The single envelope is authoritative.
  const mirrors = [
    ["politics_groups_data", payload.groups],
    ["politics_picker_state", state.picker],
    ["politics_item_global", state.itemGlobal],
    ["politics_history_stack_v26", historyStack],
  ];
  const failed = mirrors
    .filter(([k, v]) => !STORAGE.setJSON(k, v))
    .map(([k]) => k);
  for (const [k, v] of Object.entries({
    politics_admin_pin: state.adminPin,
    politics_master_volume: state.masterVolume,
    politics_sfx_volume: state.sfxVolume,
    politics_resizer_height: state.resizerHeight,
    politics_column_mode: state.columnMode,
    politics_zoom_level: state.zoomLevel,
    politics_save_allin: state.saveAllIn,
    politics_resizer_enabled: state.resizerEnabled,
  })) {
    if (!STORAGE.set(k, v)) failed.push(k);
  }
  if (failed.length)
    showToast("主存档已保存，旧版兼容副本写入失败。请导出 JSON 备份。");
  // The desktop build also mirrors the same envelope to the fixed save file.
  globalThis.ClassroomSaveFile?.write(payload);
  return {
    ...result,
    legacyMirrorFailures: failed,
    ...(Array.isArray(transaction?.events) && transaction.events.length
      ? { eventsPersisted: !!result.ok && !result.deferred }
      : {}),
  };
}
