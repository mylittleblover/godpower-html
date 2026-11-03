function addGroup() {
  if (!ClassroomWriteBarrier.allow()) return false;
  if (state.isLocked) {
    openPwdModal();
    return;
  }
  const newId = Date.now();
  const index = state.groups.length + 1;
  const color = DEFAULT_COLORS[(index - 1) % DEFAULT_COLORS.length];
  recordHistory(`添加新小组 (第 ${index} 组)`);
  state.groups.push({
    id: newId,
    groupUid: StableIdentity.createGroupUid(),
    name: `第 ${index} 组`,
    color: color,
    score: 0,
    displayScore: 0,
    selectedOpt: "",
    allIn: false,
    resultText: "",
    animState: "",
    members: [],
  });
  playSound("score_add");
  saveState();
  renderAll();
}

async function deleteGroup(groupId) {
  if (!ClassroomWriteBarrier.allow()) return false;
  if (state.isLocked) {
    openPwdModal();
    return;
  }
  const target = state.groups.find((x) => x.id === groupId);
  if (
    await themeConfirm(`确认删除 ${target ? target.name : "该小组"} 吗？`, {
      title: "删除小组",
      danger: true,
      confirmText: "删除",
    })
  ) {
    if (!ClassroomWriteBarrier.allow()) return false;
    recordHistory(`删除小组 (${target ? target.name : ""})`);
    state.groups = state.groups.filter((x) => x.id !== groupId);
    saveState();
    renderAll();
  }
}

function updateGroupName(groupId, newName) {
  if (!ClassroomWriteBarrier.allow()) return false;
  if (state.isLocked) return;
  const g = state.groups.find((x) => x.id === groupId);
  if (!g) return;
  g.name = newName;
  saveState();
  updateHeaderStats();
  renderChart();
  renderDashboard();
}

function updateGroupColor(groupId, newColor) {
  if (!ClassroomWriteBarrier.allow()) return false;
  if (state.isLocked) return;
  const g = state.groups.find((x) => x.id === groupId);
  if (!g) return;
  g.color = newColor;
  saveState();
  renderAll();
}

async function resetAllScores() {
  if (!ClassroomWriteBarrier.allow()) return false;
  cancelScoreAnimationAndSync();
  if (state.isLocked) {
    openPwdModal();
    return;
  }
  if (
    await themeConfirm("确认重置所有小组积分为 0 吗？", {
      title: "积分清零",
      danger: true,
      confirmText: "全部清零",
    })
  ) {
    if (!ClassroomWriteBarrier.allow()) return false;
    recordHistory("全局重置所有小组积分");
    const updates = [];
    state.groups.forEach((g) => {
      updates.push({ groupId: g.id, start: g.score, target: 0 });
      g.score = 0;
      g.displayScore = 0;
      g.resultText = "";
      g.animState = "";
    });
    animateScores(updates);
    playSound("allin_lose");
    saveState();
  }
}
