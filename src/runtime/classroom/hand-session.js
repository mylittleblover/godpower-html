/* One main-renderer hand session shared by HTML UI and native transports. */
(function installClassroomHandSession(root) {
  "use strict";
  const listeners = new Set();
  const port = globalThis.HandRaisePort.create({
    getState: () => state,
    context: () => {
      const status = globalThis.SaveManager?.status();
      const token = globalThis.SaveManager?.context();
      return token ? { ...token, revision: status.revision } : null;
    },
    busy: () =>
      !!window.itemCommandActive || !!itemDrawBusy || !!handItemDrawTimer,
    id: () => StableIdentity.createCommandId(),
    enabled: () => !state.isLocked,
    eligible: (group) => eligibleForItems(group),
    planScore: (group, delta) => ScoreAdjustments.delta(group, delta),
    captureRuntime: () => ({
      session: activeDrawSessionV21710,
      pending:
        typeof firstHandDrawPendingV218 !== "undefined"
          ? firstHandDrawPendingV218
          : null,
    }),
    restoreRuntime: (runtime) => {
      if (!runtime) return;
      activeDrawSessionV21710 = runtime.session;
      if (runtime.pending !== null) firstHandDrawPendingV218 = runtime.pending;
    },
    draw: (group, context) => drawHandRewardForPort(group, context),
    /* Using an item from the hand panel runs the same classroom command as the
       dock button, and marks the origin so the cinematic is presented. */
    use: (group, context) => {
      const index = 0;
      const item = group.inventory?.[index];
      if (!item) return null;
      globalThis.HandItemCinematic?.mark(group.id);
      const accepted = useItem(group.id, index);
      if (accepted === false) {
        globalThis.HandItemCinematic?.take(null);
        return null;
      }
      void context;
      return { key: item.key, name: ITEM_DEFS[item.key]?.name || item.key };
    },
    itemName: (key) => ITEM_DEFS[key]?.name || key,
    run: (label, operation, options) =>
      runClassroomCommand(label, operation, options),
    whenIdle: () => classroomCommands.whenIdle(),
    feedback: (action, group, plan, drawn) => {
      if (action === "handScore" && plan && Number.isFinite(group?.score)) {
        ClassroomFeedback.score(group.name, plan.after - plan.before);
        void playSound(plan.after >= plan.before ? "score_add" : "score_sub");
      }
      if (action === "handDraw" && drawn) void playSound("big_win");
    },
  });
  function publish() {
    const snapshot = port.getSnapshot();
    for (const listener of listeners)
      try {
        listener(snapshot);
      } catch (error) {
        console.error("Hand session observer failed", error);
      }
  }
  async function command(action, payload = {}) {
    const conflict = ClassroomWriteBarrier.conflict();
    if (conflict)
      return { ok: false, error: conflict.error, reason: conflict.reason };
    const pending = port.command(action, payload);
    publish();
    try {
      return await pending;
    } finally {
      publish();
    }
  }
  function invalidate() {
    port.invalidate();
    publish();
  }
  root.ClassroomHandSession = Object.freeze({
    command,
    getSnapshot: port.getSnapshot,
    invalidate,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  });
  root.ClassroomHandSync?.subscribe(async (next) => {
    if (!next) {
      invalidate();
      return;
    }
    const current = port.getSnapshot();
    if (
      current.groupId === next.groupId &&
      (!next.judged || current.correct === next.correct)
    )
      return;
    const result = await command("handAdopt", next);
    if (!result.ok)
      console.warn("Legacy hand selection could not be adopted", result.error);
  });
  root.addEventListener("godpower:active-save-changed", invalidate);
})(globalThis);
