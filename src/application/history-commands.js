/* Destructive history edits require a fresh confirmation and a durable save. */
const HistoryCommands = (() => {
  async function clear() {
    if (!ClassroomWriteBarrier.allow()) return false;
    if (state.isLocked) {
      openPwdModal();
      return false;
    }
    const classroom = state,
      seasonId = state.seasonId,
      fingerprint = JSON.stringify(historyStack);
    if (
      !(await themeConfirm("确定清空全部历史操作记录吗？此操作不可逆。", {
        title: "清空历史记录",
        danger: true,
        confirmText: "清空",
      }))
    )
      return false;
    if (!ClassroomWriteBarrier.allow()) return false;
    if (state.isLocked) {
      openPwdModal();
      return false;
    }
    if (
      state !== classroom ||
      state.seasonId !== seasonId ||
      JSON.stringify(historyStack) !== fingerprint
    ) {
      showToast("历史记录已变化，请重新确认后再清空。");
      return false;
    }
    const accepted = runClassroomCommand(
      "清空历史记录",
      () => {
        historyStack = [];
        return true;
      },
      {
        recordHistory: false,
        source: "manual",
        retainOnPersistenceFailure: false,
      },
    );
    if (!accepted) return false;
    const result = await classroomCommands.whenIdle();
    if (!result.ok || !result.persisted) return false;
    renderHistoryList();
    showToast("历史记录已清空");
    return true;
  }
  // This adapter applies legacy snapshot fields without invalidating its own
  // command or issuing a nested save. The command owns history and persistence.
  function apply(snapshot) {
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
    renderAll();
    ensureItemState();
    if (snapshot.itemGlobal) state.itemGlobal = clone(snapshot.itemGlobal);
    startBulletTimer();
    startBlooperClock();
    renderAll();
  }
  async function commitRestore(snapshot, index, message) {
    window.GodpowerPicker?.invalidate();
    const accepted = runClassroomCommand(
      "历史恢复",
      () => {
        if (index !== null) historyStack = historyStack.slice(0, index);
        apply(snapshot);
        return true;
      },
      { recordHistory: false, source: "manual" },
    );
    if (!accepted) return false;
    const result = await classroomCommands.whenIdle();
    if (!result.ok) return false;
    if (message) {
      playSound("rewind");
      renderHistoryList();
      showToast(message);
    }
    return true;
  }
  function restore(snapshot) {
    if (!ClassroomWriteBarrier.allow()) return false;
    Reliability.invalidateDefenseDecisions();
    return commitRestore(snapshot, null, null);
  }
  function undo() {
    if (!ClassroomWriteBarrier.allow()) return false;
    if (state.isLocked) {
      openPwdModal();
      return false;
    }
    // Undo during an unresolved attack cancels that attack only.
    if (window.classroomReady && classroomCommands.isPending()) {
      Reliability.invalidateDefenseDecisions();
      return true;
    }
    if (!historyStack.length) {
      showToast("暂无更早的历史记录");
      return false;
    }
    const index = historyStack.length - 1,
      snapshot = historyStack[index];
    return commitRestore(snapshot, index, `已恢复到历史节点：${snapshot.desc}`);
  }
  function revert(index) {
    if (!ClassroomWriteBarrier.allow()) return false;
    if (state.isLocked) {
      themeAlert("时间旅行需要许可证。先解锁上帝模式，再回来改写历史。");
      openPwdModal();
      return false;
    }
    // Cancellation restores the pre-attack history. Select and trim only after it.
    Reliability.invalidateDefenseDecisions();
    const snapshot = historyStack[index];
    if (!snapshot) return false;
    return commitRestore(
      snapshot,
      index,
      `已回溯至：[${snapshot.time}] ${snapshot.desc}`,
    );
  }
  return { clear, restore, undo, revert };
})();
