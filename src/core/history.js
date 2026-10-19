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
  return HistoryCommands.restore(snapshot);
}
function undoLast() {
  return HistoryCommands.undo();
}
