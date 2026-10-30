function openScoreModal(groupId, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  state.activeModalGroupId = groupId;
  const g = state.groups.find((x) => x.id === groupId);
  if (g) {
    document.getElementById("scoreModalTitle").innerText =
      `${g.name} - 调整积分`;
  }
  const inputEl = document.getElementById("modalCustomInput");
  inputEl.value = "";
  inputEl.classList.remove("invalid");
  const errEl = document.getElementById("scoreModalError");
  if (errEl) errEl.innerText = "";
  showClassroomWindow(document.getElementById("scoreModalBackdrop"));
  setTimeout(() => document.getElementById("modalCustomInput").focus(), 50);
}

function closeScoreModal() {
  hideClassroomWindow(document.getElementById("scoreModalBackdrop"));
  state.activeModalGroupId = null;
}

function submitModalScore(delta) {
  const groupId = state.activeModalGroupId;
  closeScoreModal();
  if (groupId === null) return;
  applyScoreDelta(groupId, delta);
}

function handleModalKey(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    submitModalCustomScore();
  } else if (event.key === "Escape") {
    closeScoreModal();
  }
}

function submitModalCustomScore() {
  const groupId = state.activeModalGroupId;
  const input = document.getElementById("modalCustomInput");
  const errEl = document.getElementById("scoreModalError");
  if (!input || groupId === null) return;
  // 兼容全角负号与全角数字；只接受带符号整数，拒绝小数、科学计数法与单独的负号
  const raw = input.value
    .trim()
    .replace(/[－—–−]/g, "-")
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));
  const fail = (msg) => {
    input.classList.add("invalid");
    if (errEl) errEl.innerText = msg;
    input.focus();
    input.select();
  };
  if (!/^[+-]?\d+$/.test(raw)) {
    fail("请输入整数，例如 5 或 -10");
    return;
  }
  const val = parseInt(raw, 10);
  if (!Number.isSafeInteger(val)) {
    fail("数值过大");
    return;
  }
  if (val === 0) {
    fail("分值为 0，无需调整");
    return;
  }
  closeScoreModal();
  applyScoreDelta(groupId, val);
}

function showMilestoneBanner(groupId) {
  const card = document.querySelector(
    `.group-row-card[data-group-id="${groupId}"]`,
  );
  if (!card) return;
  const banner = card.querySelector(".milestone-banner-overlay");
  if (!banner) return;

  card.classList.add("milestone-glow");
  banner.classList.add("show");

  setTimeout(() => {
    banner.classList.remove("show");
    card.classList.remove("milestone-glow");
  }, 2200);
}

let activeScoreAnimId = null;
function cancelScoreAnimationAndSync() {
  if (window.classroomReady) cancelItemScoreAnimations();
  if (activeScoreAnimId) {
    cancelAnimationFrame(activeScoreAnimId);
    activeScoreAnimId = null;
  }
  state.groups.forEach((g) => {
    g.displayScore = g.score;
  });
}

function animateScores(scoreUpdates, onComplete) {
  if (activeScoreAnimId) {
    cancelAnimationFrame(activeScoreAnimId);
    activeScoreAnimId = null;
  }
  const startTime = performance.now();
  const duration = 950;

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);

    scoreUpdates.forEach((item) => {
      const cur = Math.round(item.start + (item.target - item.start) * ease);
      const g = state.groups.find((x) => x.id === item.groupId);
      if (g) {
        g.displayScore = cur;
        const el = document.getElementById(`score-val-${g.id}`);
        if (el) el.textContent = `${cur}分`;
      }
    });

    renderChart();
    renderDashboard();

    if (progress < 1) {
      activeScoreAnimId = requestAnimationFrame(tick);
    } else {
      activeScoreAnimId = null;
      scoreUpdates.forEach((item) => {
        const g = state.groups.find((x) => x.id === item.groupId);
        if (g) g.displayScore = item.target;
      });
      renderChart();
      renderDashboard();
      updateHeaderStats();
      if (onComplete) onComplete();
    }
  }
  activeScoreAnimId = requestAnimationFrame(tick);
}

function applyScoreDelta(groupId, delta) {
  return ManualScoreCommands.adjust(groupId, delta);
}

function startDirectScoreEdit(groupId) {
  if (state.isLocked) {
    openPwdModal();
    return;
  }
  state.editingScoreId = groupId;
  renderGrid();
}

function handleScoreInputKey(event, groupId) {
  if (event.key === "Enter") finishDirectScoreEdit(groupId);
  else if (event.key === "Escape") {
    state.editingScoreId = null;
    renderGrid();
  }
}

function finishDirectScoreEdit(groupId) {
  cancelScoreAnimationAndSync();
  if (state.editingScoreId !== groupId) return;
  const input = document.getElementById(`input-score-${groupId}`);
  const g = state.groups.find((x) => x.id === groupId);
  if (input && g) {
    const newVal = Number(input.value);
    if (!Number.isSafeInteger(newVal)) {
      showToast("请输入安全整数");
      return false;
    }
    return ManualScoreCommands.set(groupId, newVal);
  } else {
    state.editingScoreId = null;
    renderGrid();
  }
}
