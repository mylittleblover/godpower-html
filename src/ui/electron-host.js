/* Transport only. Standalone HTML has no desktop bridge and keeps all existing behavior. */
(() => {
  const desktop = window.godpowerDesktop;
  if (!desktop || desktop.role !== "main") return;
  let flushOwner = null;
  const restoreFlush = (owner) => {
    if (flushOwner !== owner) return;
    window.classroomClosing = false;
    if (owner.inert !== null) document.body.inert = owner.inert;
    flushOwner = null;
  };
  desktop.onSaveFlush?.(async ({ id }) => {
    if (flushOwner) {
      desktop.saveFlushReply({ id, ok: false, error: "FLUSH_BUSY" });
      return;
    }
    const owner = { id, inert: null };
    flushOwner = owner;
    try {
      const ready = await globalThis.SaveManager?.ready();
      if (flushOwner !== owner) return;
      if (ready?.ok === false || globalThis.SaveManager?.blocked?.()) {
        desktop.saveFlushReply({ id, ok: true });
        return;
      }
      owner.inert = document.body.inert;
      document.body.inert = true;
      window.classroomClosing = true;
      if (classroomCommands.isPending() && !classroomCommands.isCommitting())
        Reliability.invalidateDefenseDecisions();
      window.GodpowerPicker?.invalidate();
      await classroomCommands.whenIdle();
      await globalThis.SaveManager?.whenIdle();
      if (window.classroomUnsavedChanges) {
        const result = saveState();
        const saved = result.completion
          ? await result.completion
          : await result;
        if (!saved.ok)
          throw Error(saved.error || saved.message || "退出前保存失败");
      }
      await globalThis.SaveManager?.whenIdle();
      if (window.classroomUnsavedChanges)
        throw Error("还有未保存的数据或设置，请先导出备份");
      if (flushOwner === owner) desktop.saveFlushReply({ id, ok: true });
    } catch (error) {
      if (flushOwner === owner) {
        showClassroomSaveWarning("退出前保存未完成：" + error.message);
        desktop.saveFlushReply({ id, ok: false, error: error.message });
        restoreFlush(owner);
      }
    }
  });
  desktop.onSaveFlushCancel?.((message) => {
    const owner = flushOwner;
    if (owner?.id === message.id) {
      restoreFlush(owner);
      showClassroomSaveWarning(
        "退出已取消：" + (message.error || "保存尚未确认"),
      );
    }
  });
  const completed = new Map();
  let last = "",
    timer,
    soundedReveal = null;

  /* Authoritative hand port: the main renderer owns the classroom transaction,
     the floating window only sends a gesture with its selection token. */
  const hand = globalThis.ClassroomHandSession;

  const publish = () => {
    const snapshot = GodpowerPicker.getSnapshot(),
      handSnapshot = hand?.getSnapshot() || null;
    const drawnItemKey = handSnapshot?.itemName
      ? ITEM_KEYS.find((key) => ITEM_DEFS[key].name === handSnapshot.itemName)
      : null;
    const payload = {
      ...snapshot,
      saveContext: globalThis.SaveManager?.context?.() || null,
      hand: handSnapshot
        ? {
            avatarDataUrl:
              globalThis.ClassroomAvatarDisplay?.ownGroupDataUrlCached(
                state.groups.find((g) => g.id === handSnapshot.groupId),
              ) ||
              globalThis.ClassroomAvatarDisplay?.groupDataUrlCached(
                state.groups.find((g) => g.id === handSnapshot.groupId),
              ) ||
              "",
            phase: handSnapshot.phase,
            motionEnabled:
              DesktopUI.getPreferences().motion !== "off" &&
              !(
                DesktopUI.getPreferences().systemMotion &&
                matchMedia("(prefers-reduced-motion: reduce)").matches
              ),
            rewardComplete: handSnapshot.rewardComplete,
            canScore: handSnapshot.canScore,
            selectionId: handSnapshot.selectionId,
            groupId: handSnapshot.groupId,
            correct: handSnapshot.correct,
            itemRewarded: handSnapshot.itemRewarded,
            busy: handSnapshot.busy,
            inventoryCount: handSnapshot.inventoryCount,
            canDraw: handSnapshot.canDraw,
            canUse: handSnapshot.canUse,
            mainItemName: handSnapshot.mainItemName,
            itemName: handSnapshot.itemName,
            itemIcon: drawnItemKey ? itemIconDataUrl(drawnItemKey) : "",
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

  const handActions = new Set([
    "handSelect",
    "handJudge",
    "handScore",
    "handDraw",
    "handUse",
    "handCancel",
  ]);
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
    handUse: "settings",
  };

  desktop.onExecute(async ({ id, action, payload, saveContext = null }) => {
    const active = globalThis.SaveManager?.context?.() || null;
    if (
      window.classroomClosing ||
      globalThis.SaveManager?.blocked?.() ||
      globalThis.SaveManager?.isStarting() ||
      globalThis.SaveManager?.isSwitching() ||
      active?.saveId !== saveContext?.saveId ||
      active?.generation !== saveContext?.generation
    ) {
      desktop.reply({ id, result: { ok: false, error: "STALE_SAVE" } });
      return;
    }
    if (!completed.has(id)) {
      // Remote controls use the same configurable sound slots as the classroom buttons.
      const buttonSound =
        action === "score"
          ? payload.delta > 0
            ? "positive"
            : "negative"
          : sounds[action];
      if (buttonSound) void playSound("ui_button_" + buttonSound);
      const promise = handActions.has(action)
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
  hand.subscribe(publish);
  window.addEventListener("godpower:active-save-changed", () => {
    hand.invalidate();
    completed.clear();
    publish();
  });
  window.addEventListener("godpower:save-status", publish);
  window.addEventListener(
    "DOMContentLoaded",
    () => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn btn-primary";
      button.textContent = "独立点名悬浮窗";
      button.addEventListener("click", () => desktop.openPicker());
      document.querySelector("#pickerModal .picker-left")?.append(button);
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
