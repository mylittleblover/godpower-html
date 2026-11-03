let confettiAnimationId = null;
let confettiParticles = [];

function getSettlementHistory() {
  if(globalThis.SaveManager?.enabled())return SaveManager.snapshot().archives;
  return STORAGE.getJSON("politics_settlement_history", []);
}

function saveSettlementRecord(record) {
  if (!record.clearedData)
    record.clearedData = buildSettlementClearedDataV21813();
  record.schemaVersion = Reliability.schemaVersion;
  return Reliability.appendArchive(CLASSROOM_STORAGE, record);
}

function triggerFinalSettlement() {
  if (!ClassroomWriteBarrier.allow()) return false;
  if (state.isLocked) {
    themeAlert(
      "封神榜不是随手一按的烟花按钮。先去底栏解锁上帝模式，再回来决定全班分数的命运。",
    );
    openPwdModal();
    return;
  }

  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const defaultTitle = `${y}年${m}月${d}日 积分结算`;

  const input = document.getElementById("settlementNameInput");
  if (input) input.value = defaultTitle;
  if (typeof DesktopUI !== "undefined") DesktopUI.prepareSettlement();
  showClassroomWindow(document.getElementById("settlementNameModal"));
  setTimeout(() => {
    if (input) {
      input.focus();
      input.select();
    }
  }, 60);
}

function closeSettlementNameModal() {
  if (typeof DesktopUI !== "undefined") DesktopUI.cancelSettlement();
  hideClassroomWindow(document.getElementById("settlementNameModal"));
}

let settlementSaving = false;
async function confirmFinalSettlement(){
  if(settlementSaving)return {ok:false,reason:"busy"};
  try{return await performFinalSettlement();}finally{settlementSaving=false;}
}
async function performFinalSettlement() {
  const conflict = ClassroomWriteBarrier.conflict();
  if (conflict) {
    showToast(conflict.error);
    return conflict;
  }
  settlementSaving=true;
  Reliability.invalidateDefenseDecisions();
  if (state.isLocked) {
    openPwdModal();
    return { ok: false, reason: "locked" };
  }
  if (
    itemDrawBusy ||
    slotEngine.isSpinning ||
    isStartingRound ||
    isSwitchingRound
  ) {
    showToast("请等待当前抽取或回合切换完成后结算");
    return { ok: false, reason: "busy" };
  }
  if (
    !state.groups.some(
      (g) =>
        g.score !== 0 ||
        g.inventory.length ||
        g.itemStats.correct ||
        g.itemStats.wrong,
    ) &&
    !state.hasStartedOnce
  ) {
    showToast("暂无需要结算的比赛数据");
    return { ok: false, reason: "empty" };
  }
  const input = document.getElementById("settlementNameInput");
  const title = (input ? input.value.trim() : "") || "积分结算";
  closeSettlementNameModal();

  const sorted = [...state.groups].sort(
    (a, b) => (Number(b.score) || 0) - (Number(a.score) || 0),
  );
  const top1 = sorted[0];
  const top2 = sorted[1];
  const top3 = sorted[2];

  const record = {
    id: Date.now(),
    seasonId: state.seasonId,
    title: title,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleString(),
    champion: top1 ? top1.name : "无",
    totalGroups: state.groups.length,
    totalScore: state.groups.reduce(
      (sum, g) => sum + (Number(g.score) || 0),
      0,
    ),
    groups: clone(sorted),
    achievementLedger: AchievementLedger.normalize(state.achievementLedger),
  };
  if(globalThis.SaveManager?.enabled())record.clearedData=buildSettlementClearedDataV21813();
  const archiveResult = globalThis.SaveManager?.enabled() ? await SaveManager.archive(record) : saveSettlementRecord(record);
  if (!archiveResult.ok) {
    themeAlert(
      "归档失败，课堂数据保持原样。请导出 JSON 备份并释放存储空间。" +
        archiveResult.error,
    );
    return archiveResult;
  }
  const beforeReset = clone(state),
    beforeHistory = clone(historyStack);
  recordHistory(`执行最终结算: ${title} (第 1 名: ${record.champion})`);

  bgmStopAll();
  state.roundActive = false;
  state.evaluated = true;
  renderControls();
  playSound("big_win");
  setTimeout(() => playSound("roll_win"), 450);

  const grandTitle = document.getElementById("grandModalTitle");
  if (grandTitle) grandTitle.innerText = title;
  const grandPodium = document.getElementById("grandPodiumDeck");
  if (grandPodium) {
    grandPodium.innerHTML = `
      <div class="podium-col rank-2">
        <span class="podium-badge" style="color: #64748b;">第 2 名</span>
        <span class="podium-name">${top2 ? escapeHtml(top2.name) : "-"}</span>
        <span class="podium-score" style="color: ${top2 ? top2.color : "#94a3b8"};">${top2 ? top2.score : 0}分</span>
      </div>
      <div class="podium-col rank-1">
        <span class="podium-badge" style="color: #ca8a04;">第 1 名</span>
        <span class="podium-name">${top1 ? escapeHtml(top1.name) : "-"}</span>
        <span class="podium-score" style="color: ${top1 ? top1.color : "#ca8a04"}; font-size:20px;">${top1 ? top1.score : 0}分</span>
      </div>
      <div class="podium-col rank-3">
        <span class="podium-badge" style="color: #ea580c;">第 3 名</span>
        <span class="podium-name">${top3 ? escapeHtml(top3.name) : "-"}</span>
        <span class="podium-score" style="color: ${top3 ? top3.color : "#94a3b8"};">${top3 ? top3.score : 0}分</span>
      </div>
    `;
  }
  showClassroomWindow(document.getElementById("grandModalOverlay"));
  initConfetti();

  resetCompetitionDataAfterSettlementV21812();
  const pendingReset = saveState();
  const resetResult = pendingReset?.completion ? await pendingReset.completion : await pendingReset;
  if (!resetResult.ok) {
    state = beforeReset;
    historyStack = beforeHistory;
    renderAll();
    themeAlert(
      "档案已保存，但新课堂数据保存失败；已恢复清零前课堂。请导出备份。",
    );
    return resetResult;
  }
  renderAll();
  showToast(
    `封神榜已归档，本轮课堂数据已全部归零 · 第 1 名：${record.champion}`,
  );
  return { ok: true };
}

function initConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = [
    "#f59e0b",
    "#ef4444",
    "#10b981",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#fde047",
  ];
  confettiParticles = [];
  for (let i = 0; i < 160; i++) {
    confettiParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      w: Math.random() * 10 + 6,
      h: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 4 + 3,
      speedX: Math.random() * 4 - 2,
      angle: Math.random() * 360,
      spin: Math.random() * 6 - 3,
    });
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiParticles.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.angle += p.spin;
      if (p.y > canvas.height) p.y = -10;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.angle * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    confettiAnimationId = requestAnimationFrame(loop);
  }
  if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
  loop();
}

function stopConfetti() {
  if (confettiAnimationId) {
    cancelAnimationFrame(confettiAnimationId);
    confettiAnimationId = null;
  }
}

function closeGrandSettlementModal() {
  hideClassroomWindow(document.getElementById("grandModalOverlay"));
  stopConfetti();
}

function openSettlementHistoryModal() {
  switchView("archives");
}

function closeSettlementHistoryModal() {
  switchView("battle");
}

function renderArchiveClassStats() {
  const host = document.getElementById("archiveClassStats");
  if (!host) return;
  const itemGlobal = state.itemGlobal || {};
  const answers = state.groups.reduce((total, group) => {
    const stats = group.itemStats || {};
    return total + Number(stats.correct || 0) + Number(stats.wrong || 0);
  }, 0);
  const metrics = [
    ["课堂作答", answers, "次"],
    ["答题轮次", Number(itemGlobal.pkTotal || 0), "轮"],
    ["全局道具发放", Number(itemGlobal.totalDraws || 0), "件"],
    ["手动举手", Number(itemGlobal.handRaiseTotal || 0), "次"],
  ];
  host.innerHTML = `<div class="archive-stats-head"><h3>课堂累计统计</h3><span>随当前课堂数据实时更新</span></div><div class="archive-stats-grid">${metrics.map(([label, value, unit]) => `<div class="archive-stat-card"><b>${value}<small>${unit}</small></b><span>${label}</span></div>`).join("")}</div>`;
}

function renderSettlementHistoryList() {
  if (typeof DesktopUI !== "undefined") DesktopUI.renderArchives();
}

function exportSingleSettlementCSV(index) {
  const list = getSettlementHistory();
  const record = list[index];
  if (!record) return;

  let csvContent = "\uFEFF排名,小组名称,最终得分,组员名单\n";
  record.groups.forEach((g, r) => {
    const members = (g.members || []).join(" / ");
    csvContent += `${r + 1},"${g.name.replace(/"/g, '""')}",${g.score},"${members.replace(/"/g, '""')}"\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(record.title || "课堂最终结算").replace(/[\/\s:]/g, "_")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("表格导出成功");
}

function exportLatestSettlementCSV() {
  const list = getSettlementHistory();
  if (list.length === 0) {
    themeAlert("暂无结算归档可导出");
    return;
  }
  exportSingleSettlementCSV(0);
}

async function deleteSettlementRecord(index) {
  if(!ClassroomWriteBarrier.allow())return false;
  if(state.isLocked){openPwdModal();return false;}
  const initial=getSettlementHistory(),target=initial[index];if(!target)return false;
  const context=globalThis.SaveManager?.context?.()||null;
  const owner=state,season=state.seasonId,id=target.id,fingerprint=JSON.stringify(target);
  if(!(await themeConfirm("确定要删除这条最终结算档案记录吗？此操作不可逆！",{title:"删除结算档案",danger:true,confirmText:"删除"})))return false;
  const currentContext=globalThis.SaveManager?.context?.()||null;
  if(state.isLocked||state!==owner||state.seasonId!==season||context?.saveId!==currentContext?.saveId||context?.generation!==currentContext?.generation||!ClassroomWriteBarrier.allow()){
    showToast("课堂或权限已变化，请重新确认删除。");return false;
  }
  const list=getSettlementHistory(),current=list.findIndex(record=>record.id===id&&JSON.stringify(record)===fingerprint);
  if(current<0){showToast("档案记录已变化，请重新确认删除。");return false;}
  if(globalThis.SaveManager?.enabled()){
    const result=await SaveManager.removeArchive(id);
    if(!result.ok){themeAlert('删除未保存，原档案保留：'+(result.error||result.message||result.code));return false;}
  }else{
    list.splice(current,1);if(!STORAGE.setJSON("politics_settlement_history",list)){themeAlert("删除未保存，原档案保留。");return false;}
  }
  renderSettlementHistoryList();showToast("该结算档案已删除");return true;
}

// ===== 启动性能优化：音频元数据缓存 + 延迟音频初始化 =====
