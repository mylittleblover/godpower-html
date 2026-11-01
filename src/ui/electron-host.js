/* Transport only. Standalone HTML has no desktop bridge and keeps all existing behavior. */
(() => {
  const desktop = window.godpowerDesktop;
  if (!desktop || desktop.role !== "main") return;
  const completed = new Map();
  let last = "",
    timer,
    soundedReveal = null;

  /* Authoritative hand port: the main renderer owns the classroom transaction,
     the floating window only sends a gesture with its selection token. */
  const hand = globalThis.HandRaisePort?.create({
    getState: () => state,
    busy: () => !!window.itemCommandActive || !!itemDrawBusy || !!handItemDrawTimer,
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

  const publish = () => {
    const snapshot = GodpowerPicker.getSnapshot(),
      handSnapshot = hand?.getSnapshot() || null;    const payload = {
      ...snapshot,
      hand: handSnapshot
        ? {
            selectionId: handSnapshot.selectionId,
            groupId: handSnapshot.groupId,
            correct: handSnapshot.correct,
            itemRewarded: handSnapshot.itemRewarded,
            busy: handSnapshot.busy,
            inventoryCount: handSnapshot.inventoryCount,
            canDraw: handSnapshot.canDraw,
            itemName: handSnapshot.itemName,
          }
        : null,
    };
    const json = JSON.stringify(payload);
    if (
      snapshot.phase === "revealed" &&
      snapshot.result?.id !== soundedReveal
    ) {
      soundedReveal = snapshot.result?.id;
      if (snapshot.effects.enabled) void playSound("fullscreen_pick");
    }
    if (json !== last) {
      last = json;
      desktop.publish(payload);
    }
  };

  const sounds = {
    start: "pick_start",
    stop: "pick_stop",
    cancel: "cancel",
    resetPool: "danger",
    mode: "settings",
    antiRepeat: "settings",
    preselect: "settings",
    handSelect: "ui_click",
    handJudge: "ui_click",
    handScore: "settings",
    handDraw: "settings",
  };

  desktop.onExecute(async ({ id, action, payload }) => {
    if (!completed.has(id)) {
      // Remote controls use the same configurable sound slots as the classroom buttons.
      const buttonSound =
        action === "score"
          ? payload.delta > 0
            ? "positive"
            : "negative"
          : sounds[action];
      if (buttonSound) void playSound("ui_button_" + buttonSound);
      const promise =
        action === "handSelect" ||
        action === "handJudge" ||
        action === "handScore" ||
        action === "handDraw"
          ? hand.command(action, payload).catch((error) => ({
              ok: false,
              error: error.message,
            }))
          : GodpowerPicker.command(action, payload).catch((error) => ({
              ok: false,
              error: error.message,
            }));
      completed.set(id, promise);
      if (completed.size > 256) completed.delete(completed.keys().next().value);
    }
    const result = await completed.get(id);
    publish();
    desktop.reply({ id, result });
  });
  desktop.onShellState((shell) => {
    // The shell switch gates native reveals; it is not the presentation marker
    // of the hidden in-page drawing engine.
    GodpowerPicker.setExternalEffectsEnabled(shell.effectsEnabled);
  });
  desktop.onUnlockRequest(() => {
    if (state.isLocked) openPwdModal();
  });
  window.addEventListener(
    "DOMContentLoaded",
    () => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn btn-primary";
      button.textContent = "独立点名悬浮窗";
      button.addEventListener("click", () => desktop.openPicker());
      document.querySelector("#pickerModal .picker-left-v2")?.append(button);
      GodpowerPicker.subscribe(publish);
      timer = setInterval(publish, 120);
      publish();
      desktop.ready();
    },
    { once: true },
  );
  window.addEventListener("beforeunload", () => clearInterval(timer), {
    once: true,
  });
})();
