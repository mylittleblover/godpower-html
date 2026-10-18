/* One snapshot owner, retaining V2 pre-operation snapshots and legacy keys. */
const HistorySnapshots = {
  capture(s, desc, time) {
    const copy = (value) => JSON.parse(JSON.stringify(value));
    return {
      desc,
      time,
      groups: copy(s.groups),
      picker: copy(s.picker),
      resizerHeight: s.resizerHeight,
      correctAns: s.correctAns,
      evaluated: s.evaluated,
      roundActive: s.roundActive,
      hasStartedOnce: s.hasStartedOnce,
      lastRoundAllIn: s.lastRoundAllIn,
      itemGlobal: copy(s.itemGlobal),
    };
  },
};
function recordHistory(actionDesc) {
  if (window.itemCommandActive) return;
  if (window.classroomReady && !window.classroomRecordingCommand)
    Reliability.invalidateDefenseDecisions();
  const snapshot = HistorySnapshots.capture(
    state,
    actionDesc,
    new Date().toLocaleTimeString(),
  );
  historyStack.push(snapshot);
  if (historyStack.length > MAX_HISTORY) historyStack.shift();
  persistHistoryV26();
}
function persistHistoryV26() {
  if (
    window.itemCommandActive ||
    window.classroomRecordingCommand ||
    (window.classroomReady && classroomCommands.isPending())
  )
    return;
  const ok = STORAGE.setJSON(V26_HISTORY_KEY, historyStack.slice(-MAX_HISTORY));
  if (!ok) console.warn("旧版历史兼容副本保存失败，主存档结果另行报告");
  return { ok };
}
function restoreStateFromSnapshot(snapshot) {
  window.GodpowerPicker?.invalidate();
  Reliability.invalidateDefenseDecisions();
  cancelScoreAnimationAndSync();
  if (snapshot.itemGlobal) state.itemGlobal = clone(snapshot.itemGlobal);
  state.groups = normalizeAllGroups(snapshot.groups);
  state.groups.forEach((g) => {
    g.displayScore = g.score;
  });
  state.correctAns = snapshot.correctAns;
  state.evaluated = snapshot.evaluated;
  state.roundActive = snapshot.roundActive;
  state.hasStartedOnce = snapshot.hasStartedOnce;
  state.lastRoundAllIn = snapshot.lastRoundAllIn;
  if (snapshot.picker) state.picker = clone(snapshot.picker);
  if (Number.isFinite(snapshot.resizerHeight))
    state.resizerHeight = snapshot.resizerHeight;
  saveState();
  renderAll();
  // Preserve original restore adapter's item timers and final render ordering.
  ensureItemState();
  if (snapshot.itemGlobal) state.itemGlobal = clone(snapshot.itemGlobal);
  startBulletTimer();
  startBlooperClock();
  renderAll();
}
function undoLast() {
  if (state.isLocked) openPwdModal();
  else if (window.classroomReady && classroomCommands.isPending())
    Reliability.invalidateDefenseDecisions();
  else if (!historyStack.length) showToast("暂无更早的历史记录");
  else {
    const prev = historyStack.pop();
    restoreStateFromSnapshot(prev);
    playSound("rewind");
    showToast(`已恢复到历史节点：${prev.desc}`);
  }
  persistHistoryV26();
  saveState();
}
