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
  return { clear };
})();
