function updateQuickBatchBar() {
  const bar = document.getElementById("quickBatchBar");
  if (!bar) return;
  if (state.roundActive && !state.evaluated) {
    bar.classList.add("active");
  } else {
    bar.classList.remove("active");
  }
}

function updateHeaderStats() {
  const banner = document.getElementById("topHeaderStats");
  if (!banner) return;
  const summary = GodpowerUIModel.standings(ranking());
  const mask = Number(state.itemGlobal?.blooperUntil || 0) > Date.now();
  const html = `小组总数: <b>${summary.count}</b> 组 | 总积分: <b>${mask ? "???" : summary.total}</b> | 当前领先: <b style="color:#0284c7;">${mask ? "已遮蔽" : summary.count ? escapeHtml(summary.leader) : "暂无"}</b>`;
  if (banner.innerHTML !== html) banner.innerHTML = html;
  banner.title = banner.textContent;
}

/* 核心改进：条形图保持 DOM 元素稳定，支持宽度平滑递增与排位平滑滑动互换 */
function renderChart() {
  const wrapper = document.getElementById("chartWrapper");
  if (!wrapper || wrapper.closest?.("[hidden]")) return;

  const sorted = [...state.groups].sort((a, b) => {
    const scA = a.displayScore !== undefined ? a.displayScore : a.score;
    const scB = b.displayScore !== undefined ? b.displayScore : b.score;
    return scB - scA;
  });

  const rowHeight = 30;
  wrapper.style.height = sorted.length * rowHeight + "px";

  const maxScore = Math.max(
    ...sorted.map((g) =>
      g.displayScore !== undefined ? g.displayScore : g.score,
    ),
    10,
  );

  const existingRows = Array.from(wrapper.querySelectorAll(".chart-row"));
  const currentIds = new Set(sorted.map((g) => g.id.toString()));

  existingRows.forEach((r) => {
    if (!currentIds.has(r.getAttribute("data-id"))) {
      r.remove();
    }
  });

  sorted.forEach((g, rankIndex) => {
    let row = wrapper.querySelector(`.chart-row[data-id="${g.id}"]`);
    if (!row) {
      row = document.createElement("div");
      row.className = "chart-row";
      row.setAttribute("data-id", g.id);
      row.innerHTML = `
        <div class="chart-rank">${rankIndex + 1}</div>
        <div class="chart-name">${escapeHtml(g.name)}</div>
        <div class="chart-track">
          <div class="chart-bar" style="background-color: ${g.color};"></div>
        </div>
        <div class="chart-score">0分</div>
      `;
      wrapper.appendChild(row);
    }

    row.style.transform = `translateY(${rankIndex * rowHeight}px)`;

    const rankEl = row.querySelector(".chart-rank");
    if (rankEl) rankEl.textContent = rankIndex + 1;

    const nameEl = row.querySelector(".chart-name");
    if (nameEl) {
      nameEl.textContent = g.name;
      nameEl.title = g.name;
    }

    const curScore = g.displayScore !== undefined ? g.displayScore : g.score;
    const scoreEl = row.querySelector(".chart-score");
    if (scoreEl) {
      scoreEl.textContent = `${formatChartScoreV294(curScore)}分`;
      scoreEl.title = `${curScore}分`;
    }

    const barEl = row.querySelector(".chart-bar");
    if (barEl) {
      const percent = Math.max(2, (curScore / maxScore) * 100);
      barEl.style.width = `${percent}%`;
      barEl.style.backgroundColor = g.color;
    }
  });
}

function renderDashboard() {
  const podiumDeck = document.getElementById("podiumDeck");
  if (!podiumDeck || podiumDeck.closest?.("[hidden]")) return;

  const sorted = [...state.groups].sort((a, b) => {
    const scA = a.displayScore !== undefined ? a.displayScore : a.score;
    const scB = b.displayScore !== undefined ? b.displayScore : b.score;
    return scB - scA;
  });
  const top1 = sorted[0];
  const top2 = sorted[1];
  const top3 = sorted[2];

  const getScoreText = (g) =>
    g ? (g.displayScore !== undefined ? g.displayScore : g.score) : 0;

  podiumDeck.innerHTML = `
    <div class="podium-col rank-2">
      <span class="podium-badge" style="color: #64748b;">第 2 名</span>
      <span class="podium-name">${top2 ? escapeHtml(top2.name) : "-"}</span>
      <span class="podium-score" style="color: ${top2 ? top2.color : "#94a3b8"};">${getScoreText(top2)}分</span>
    </div>
    <div class="podium-col rank-1">
      <span class="podium-badge" style="color: #ca8a04;">第 1 名</span>
      <span class="podium-name">${top1 ? escapeHtml(top1.name) : "-"}</span>
      <span class="podium-score" style="color: ${top1 ? top1.color : "#ca8a04"};">${getScoreText(top1)}分</span>
    </div>
    <div class="podium-col rank-3">
      <span class="podium-badge" style="color: #ea580c;">第 3 名</span>
      <span class="podium-name">${top3 ? escapeHtml(top3.name) : "-"}</span>
      <span class="podium-score" style="color: ${top3 ? top3.color : "#94a3b8"};">${getScoreText(top3)}分</span>
    </div>
  `;

  const totalGroups = state.groups.length;
  const answeredGroups = state.groups.filter((g) => g.selectedOpt).length;
  const allInGroups = state.groups.filter((g) => g.allIn).length;
  const totalScore = state.groups.reduce(
    (acc, g) => acc + (g.displayScore !== undefined ? g.displayScore : g.score),
    0,
  );
  const avgScore = totalGroups > 0 ? (totalScore / totalGroups).toFixed(1) : 0;

  document.getElementById("metricAnswered").innerText =
    `${answeredGroups} / ${totalGroups} 组`;
  document.getElementById("metricAllIn").innerText = `${allInGroups} 组`;
  document.getElementById("metricAvg").innerText = `${avgScore} 分`;
}

function renderLockStatus() {
  const btn = document.getElementById("lockBtn");
  const addBtn = document.getElementById("btnAddGroup");
  const importBtn = document.getElementById("btnImport");
  const resetBtn = document.getElementById("btnResetScores");
  const undoBtn = document.getElementById("btnUndo");
  if (!btn) return;

  if (state.isLocked) {
    btn.className = "icon-btn locked";
    btn.innerText = "🔒";
    if (addBtn) addBtn.classList.add("locked-disabled");
    if (importBtn) importBtn.classList.add("locked-disabled");
    if (resetBtn) resetBtn.classList.add("locked-disabled");
    if (undoBtn) undoBtn.classList.add("locked-disabled");
  } else {
    btn.className = "icon-btn unlocked";
    btn.innerText = "🔓";
    if (addBtn) addBtn.classList.remove("locked-disabled");
    if (importBtn) importBtn.classList.remove("locked-disabled");
    if (resetBtn) resetBtn.classList.remove("locked-disabled");
    if (undoBtn) undoBtn.classList.remove("locked-disabled");
  }
  if (typeof DesktopUI !== "undefined") DesktopUI.refreshLockControl(btn);
}

function renderControls() {
  const statusBadge = document.getElementById("roundStatusBadge");
  const mainActionBtn = document.getElementById("btnMainAction");
  const nextBtn = document.getElementById("btnNextRound");
  const forceBtn = document.getElementById("btnForceEnd");

  if (!state.roundActive && !state.evaluated) {
    statusBadge.innerText = "答题未开始";
    statusBadge.className = "status-badge";

    mainActionBtn.innerText = "开始答题";
    mainActionBtn.className = "btn btn-primary";
    mainActionBtn.classList.remove("locked-disabled");

    nextBtn.classList.add("locked-disabled");
    forceBtn.classList.add("locked-disabled");
  } else if (state.roundActive && !state.evaluated) {
    statusBadge.innerText = "答题进行中...";
    statusBadge.className = "status-badge active";

    mainActionBtn.innerText = "判定结算";
    mainActionBtn.className = "btn btn-primary";
    mainActionBtn.classList.remove("locked-disabled");

    nextBtn.classList.add("locked-disabled");
    forceBtn.classList.remove("locked-disabled");
  } else {
    statusBadge.innerText = "答题已结束";
    statusBadge.className = "status-badge done";

    mainActionBtn.innerText = "判定结算";
    mainActionBtn.className = "btn btn-primary";
    mainActionBtn.classList.add("locked-disabled");

    nextBtn.classList.remove("locked-disabled");
    forceBtn.classList.add("locked-disabled");
  }

  const btns = document.querySelectorAll(".ans-btn");
  btns.forEach((btn) => {
    if (btn.innerText === state.correctAns) btn.classList.add("selected");
    else btn.classList.remove("selected");
  });
  updateQuickBatchBar();
}
