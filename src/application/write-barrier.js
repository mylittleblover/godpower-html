/* Shared application guard; cancellable defense waits remain distinct from durable commits. */
const ClassroomWriteBarrier = {
  conflict() {
    if (window.classroomClosing)
      return {
        ok: false,
        reason: "closing",
        error: "正在完成保存并退出，请稍候。",
      };
    if (globalThis.SaveManager?.blocked?.())
      return {
        ok: false,
        reason: "library-unavailable",
        error: "存档库未成功读取，已暂停修改以保护原数据。",
      };
    if (globalThis.SaveManager?.pendingSettlement?.())
      return {
        ok: false,
        reason: "settlement-recovery",
        error: "本届已归档，请先完成新一届初始化后再操作。",
      };
    if (typeof settlementSaving !== "undefined" && settlementSaving)
      return {
        ok: false,
        reason: "settlement-pending",
        error: "正在归档课堂，请等待保存完成。",
      };
    if (
      globalThis.SaveManager?.isStarting() ||
      globalThis.SaveManager?.isSwitching()
    )
      return {
        ok: false,
        reason: "save-switching",
        error: "存档正在初始化或切换，请稍后再试。",
      };
    if (!window.classroomReady || !classroomCommands.isCommitting())
      return null;
    return {
      ok: false,
      reason: "commit-pending",
      error: "课堂正在保存，请稍后再试。",
    };
  },
  allow() {
    const conflict = this.conflict();
    if (conflict) showToast(conflict.error);
    return !conflict;
  },
};
