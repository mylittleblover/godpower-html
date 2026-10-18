/* Single refresh owner. This module never calculates scores or item outcomes. */
let pendingRenderGridV21726 = false;

function renderAll() {
  if (!attackRenderFlushingV21713 && attackRenderGateV21713) {
    attackRenderGateV21713 = false;
    clearTimeout(attackRenderTimerV21713);
    attackRenderTimerV21713 = setTimeout(() => {
      attackRenderTimerV21713 = null;
      attackRenderFlushingV21713 = true;
      try {
        refreshPages();
      } finally {
        pendingRenderArgsV21713 = null;
        attackRenderFlushingV21713 = false;
      }
    }, ATTACK_REORDER_DELAY_V21713);
    return;
  }
  refreshPages();
}

function refreshPages() {
  renderLockStatus();
  renderControls();
  renderGrid();
  updateHeaderStats();
  renderChart();
  renderDashboard();
  updateResizerUI();
  renderWelcomePage();
  updateWelcomeTrackIfNeeded();
}

function renderGrid() {
  applyHeldDisplayScoresV21732();
  if (roundStateFlipBusyV21726) {
    if (!pendingRenderGridV21726) {
      pendingRenderGridV21726 = true;
      setTimeout(() => {
        pendingRenderGridV21726 = false;
        // Match the original FLIP callback: don't restart the outer score phase.
        refreshBattleGrid();
      }, 810);
    }
  } else {
    refreshBattleGrid();
  }
  applyHeldDisplayScoresV21732();
  restoreHeldScoreElementsV21732();
}

function refreshBattleGrid() {
  if (!(state.roundActive && !state.evaluated)) {
    v213SuppressReorderAnimation = false;
  }
  const attackPending =
    !attackRenderFlushingV21713 &&
    (attackRenderGateV21713 || attackRenderTimerV21713);
  if (!attackPending) {
    renderBattleGridCards();
    decorateBattleRanks();
    decorateRoundItemLocks();
  }
  // Rankings still update while the original attack position is held.
  try {
    renderBattleRankPreviewV21721();
  } catch (error) {
    console.warn("Battle rank preview could not refresh", error);
  }
}
