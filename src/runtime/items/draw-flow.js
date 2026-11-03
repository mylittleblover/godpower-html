/* ===== V2.17.12：课堂快速道具流程 ===== */
const ITEM_DRAW_DURATION_V21712 = 1500;
const ITEM_DRAW_RESULT_HOLD_V21712 = 900;
const ITEM_DRAW_FADE_V21712 = 620;
const ITEM_FX_DURATION_V21712 = 1700;
let activeGlobalItemDraw = null;

/* 抽取音效与新的 1.5s 抽取动画同步。 */
startDrawSoundBedV2164 = function () {
  try {
    stopActiveDrawAudioV2171();
  } catch (e) {}

  const generation = ++drawAudioGenerationV2171;
  const duration = ITEM_DRAW_DURATION_V21712;

  playTrackedDrawSoundV2171("item_draw_start", generation);

  let tickCount = 0;
  const tickInterval = 110;
  drawTickTimerV2171 = setInterval(() => {
    if (generation !== drawAudioGenerationV2171) {
      clearInterval(drawTickTimerV2171);
      drawTickTimerV2171 = null;
      return;
    }
    if (tickCount++ < 11) {
      playTrackedDrawSoundV2171("item_draw_tick", generation);
    } else {
      clearInterval(drawTickTimerV2171);
      drawTickTimerV2171 = null;
    }
  }, tickInterval);

  drawRevealTimerV2171 = setTimeout(() => {
    drawRevealTimerV2171 = null;
    finishDrawAudioV2171(generation);
  }, duration);
};

/* 全局抽取：
   原流程约 3.6s 滚动 + 3s 定格等待 + 淡出。
   现行流程约 1.5s 滚动 + 0.9s 看结果 + 0.62s 淡出。 */
function globalItemDraw() {
  ensureV2State();
  if (
    itemDrawBusy ||
    (typeof handItemDrawTimer !== "undefined" && handItemDrawTimer)
  )
    return false;

  let eligible = state.groups.filter(
    (g) =>
      eligibleForItems(g) &&
      Array.isArray(g.inventory) &&
      g.inventory.length < 3,
  );
  if (!eligible.length) {
    showToast("没有可参与抽取的小组（满背包或负分组会自动跳过）");
    return;
  }

  const overlays = new Map();
  const awards = [];
  let context = null;
  let resolveReveal;
  const revealReady = new Promise((resolve) => {
    resolveReveal = resolve;
  });

  function removeOverlay(id, node) {
    const parent = node?.parentElement;
    node?.remove();
    if (!parent?.querySelector(".card-item-roulette"))
      parent?.classList.remove("item-draw-spinning", "bm-draw-fading");
    BattleMotion.releaseDraw(id, node);
  }

  function isCurrent() {
    if (
      context &&
      activeGlobalItemDraw === context &&
      state === context.state &&
      state.groups === context.groups &&
      state.seasonId === context.seasonId
    )
      return true;

    cleanup(false);
    return false;
  }

  function cleanup(restoreSession) {
    overlays.forEach((node, id) => removeOverlay(id, node));
    if (context && activeGlobalItemDraw === context) {
      if (
        restoreSession &&
        state === context.state &&
        activeDrawSessionV21710 === context.session
      ) {
        activeDrawSessionV21710 = context.previousSession;
      }
      activeGlobalItemDraw = null;
      itemDrawBusy = false;
      v213SuppressReorderAnimation = false;
      stopActiveDrawAudioV2171();
      return true;
    }
    return false;
  }

  const start = performance.now();
  const total = ITEM_DRAW_DURATION_V21712;

  function mountOverlays() {
    eligible.forEach((g) => {
      const c = document.querySelector(
        `.group-row-card[data-group-id="${g.id}"]`,
      );
      if (!c) return;
      c.classList.add("item-draw-spinning");

      const o = document.createElement("div");
      o.className = "card-item-roulette";
      o.innerHTML =
        '<div class="r-icon">❔</div><div class="r-name">道具抽取中</div><div class="r-hint">ITEM ROULETTE</div>';
      c.appendChild(o);
      overlays.set(g.id, o);
      BattleMotion.trackDraw(g.id, o);
    });
  }

  const lastUpdate = new Map();

  function frame(now) {
    if (!isCurrent()) return;
    const t = Math.min(1, (now - start) / total);

    /* 约 55ms -> 145ms，仍保留“先快后慢”，但不磨课堂时间。 */
    const interval = 55 + 90 * Math.pow(t, 2.1);

    eligible.forEach((g) => {
      const prev = lastUpdate.get(g.id) || 0;
      if (now - prev >= interval) {
        lastUpdate.set(g.id, now);
        updateCardRouletteVisual(overlays.get(g.id), roulettePreviewPickV282());
      }
    });

    if (t < 1) {
      requestAnimationFrame(frame);
      return;
    }

    // Resolving a promise is idempotent, even if a stale frame is replayed.
    resolveReveal();
  }

  function presentCommittedAwards() {
    for (const { id, key } of awards) {
      const node = overlays.get(id);
      if (!node) continue;
      updateCardRouletteVisual(node, key);
      node.classList.add("reveal");
      const hint = node.querySelector(".r-hint");
      if (hint) hint.textContent = "获得道具";
    }
    // Refresh awarded slots underneath the still-visible reveal overlay.
    renderGrid();

    setTimeout(() => {
      if (!isCurrent()) return;
      overlays.forEach((node, id) => {
        BattleMotion.fadeDraw(node);
        setTimeout(() => {
          if (!isCurrent()) return;
          removeOverlay(id, node);
        }, ITEM_DRAW_FADE_V21712 + 20);
      });

      setTimeout(() => {
        if (!isCurrent()) return;
        activeGlobalItemDraw = null;
        itemDrawBusy = false;
        v213SkipNextReorderAnimation = true;
        renderAll();
        v213SuppressReorderAnimation = false;
      }, ITEM_DRAW_FADE_V21712 + 35);
    }, ITEM_DRAW_RESULT_HOLD_V21712);
  }

  const accepted = runClassroomCommand(
    "全局道具抽取",
    (command) => {
      // Cancelling an older command can restore a different groups array.
      eligible = state.groups.filter(
        (group) =>
          eligibleForItems(group) &&
          Array.isArray(group.inventory) &&
          group.inventory.length < 3,
      );
      if (!eligible.length) return false;
      context = {
        state,
        groups: state.groups,
        seasonId: state.seasonId,
        previousSession: activeDrawSessionV21710,
      };
      activeGlobalItemDraw = context;
      if (typeof beginDrawSessionV21710 === "function")
        beginDrawSessionV21710("global");
      context.session = activeDrawSessionV21710;
      classroomCommands.defer(
        revealReady,
        () => {
          if (
            eligible.some(
              (group) =>
                !state.groups.includes(group) ||
                !eligibleForItems(group) ||
                group.inventory.length >= 3,
            )
          ) {
            throw Error("抽取对象已变化");
          }
          const batchUsed = new Set();
          for (const group of eligible) {
            const key = pickItemForGroupV281(group, batchUsed);
            if (!key) continue;
            if (!addItemToGroup(group, key)) throw Error("道具加入失败");
            batchUsed.add(key);
            const acquired = group.inventory[group.inventory.length - 1];
            command.emit(
              "ITEM_ACQUIRED",
              { type: "group", id: group.groupUid },
              {
                seasonId: state.seasonId,
                itemKey: key,
                itemInstanceId: acquired?.itemInstanceId || null,
                source: "global-draw",
              },
            );
            awards.push({ id: group.id, key });
          }
        },
        isCurrent,
      );

      // Suppress FLIP before switching to the battle page, preserving geometry.
      v213SuppressReorderAnimation = true;
      if (!document.getElementById("view-battle")?.classList.contains("active"))
        switchView("battle");
      if (typeof DesktopUI !== "undefined")
        DesktopUI.visualEvent("ITEM_DRAW_START", { scope: "global" });
      try {
        startDrawSoundBedV2164();
      } catch (_) {}
      itemDrawBusy = true;
      renderGrid();
      mountOverlays();
      requestAnimationFrame(frame);
      return true;
    },
    { retainOnPersistenceFailure: false },
  );
  if (!accepted) {
    cleanup(true);
    return false;
  }
  classroomCommands.whenIdle().then((result) => {
    if (!result?.ok || !result.persisted) {
      if (cleanup(true)) showToast("道具抽取未能提交，已恢复原状态");
      return;
    }
    try {
      if (isCurrent()) presentCommittedAwards();
    } catch (error) {
      // Presentation cannot undo a durable award or leave its owner busy forever.
      cleanup(false);
      console.error("道具抽取已提交，界面反馈失败", error);
      showToast("道具已保存，但界面反馈失败。请导出备份后重试。");
    }
  });
  return true;
}

/* 举手奖励抽取同样压缩到 1.5s。 */
function handDrawItem() {
  return globalThis.HandFlowView?.reward("draw");
}

/* Presentation delegates to one cancellable layer; rules remain in the item engine. */
playCasterCardFx = function (key, gid) {
  BattleMotion.show("use", gid, key);
};
playTargetCardFx = function (id, key, type = "hit") {
  BattleMotion.show(type, id, key);
};
playAttackTargetFxV2116 = function (groupId, key, defended = false) {
  BattleMotion.show(defended ? "defend" : "hit", groupId, key);
};
