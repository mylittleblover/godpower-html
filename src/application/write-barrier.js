/* Shared application guard; cancellable defense waits remain distinct from durable commits. */
const ClassroomWriteBarrier = {
  conflict() {
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
