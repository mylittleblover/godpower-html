function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ================================================================
 * v3：六个core view（含玩法参考）+ 欢迎界面 + 菜单同拍音频池（9 套）+ 工程台
 * ================================================================ */

/* ---------- 视图导航 ---------- */
const VIEW_NAMES = window.GodPowerPageShell?.listPages()
  .filter((page) => page.core)
  .map((page) => page.route) || [
  "welcome",
  "battle",
  "gameplay",
  "history",
  "archives",
  "settings",
];
let currentView = "welcome";
let audioUnlocked = false;

function ensureAudioUnlocked() {
  if (audioUnlocked) return Promise.resolve();
  return getAudioContext()
    .then(() => {
      audioUnlocked = true;
    })
    .catch(() => {
      audioUnlocked = false;
    });
}

function switchView(name) {
  GodpowerTheme.cancel();
  window.GodpowerTooltips?.cancel();
  const route = window.GodPowerPageShell?.resolvePage(name);
  if (route && !route.core && String(name).startsWith("plugins/")) {
    window.GodPowerPluginCenter?.showRoute(name);
    name = "plugins";
  } else if (!VIEW_NAMES.includes(name) || !route?.core) name = "welcome";
  ensureAudioUnlocked();
  currentView = name;
  if (typeof DesktopUI !== "undefined") DesktopUI.viewChanged(name);

  document
    .querySelectorAll(".view")
    .forEach((v) => v.classList.remove("active"));
  const target = document.getElementById("view-" + name);
  if (target) target.classList.add("active");
  document
    .querySelectorAll(".nav-tab")
    .forEach((t) => t.classList.toggle("active", t.dataset.view === name));

  if (name === "welcome") {
    renderWelcomePage();
    updateWelcomeTrackIfNeeded();
  }
  if (name === "history") renderHistoryList();
  if (name === "archives") renderSettlementHistoryList();
  if (name === "plugins") window.GodPowerPluginCenter?.render();
  if (name === "settings") {
    syncSettingsControls();
    renderBgmSlotList();
    renderFxSlotList();
    renderBgmEngineConsole();
  }
  if (name === "battle") {
    menuFadeOut();
    renderAll();
  } else {
    // 切出比赛页：停止战斗 BGM，菜单配乐从进入比赛前的断点续播（0.5s 淡入）
    if (bgmEngine.state !== "IDLE") bgmStopAll();
    ensureAudioUnlocked().then(() => {
      const menuKey = getMenuTrackKeyForView(name);
      if (menuKey) menuStartOrSwitch(menuKey);
    });
  }
}

function enterBattleFromWelcome() {
  switchView("battle");
}

function getMenuTrackKeyForView(name) {
  if (name === "welcome") return getWelcomeTrackKey();
  if (name === "history") return "aux_history";
  if (name === "archives") return "aux_archives";
  if (name === "plugins") return "aux_settings";
  if (name === "settings") return "aux_settings";
  return null;
}

function getWelcomeTrackKey() {
  const max = state.groups.reduce(
    (m, g) => Math.max(m, Number(g.score) || 0),
    0,
  );
  const digits = Math.max(
    1,
    Math.min(6, String(Math.floor(Math.abs(max))).length),
  );
  return "welcome_" + digits;
}

/* ---------- 欢迎界面 ---------- */
const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
let welcomeClockTimer = null;

function startWelcomeClock() {
  if (welcomeClockTimer) return;
  updateWelcomeClock();
  welcomeClockTimer = setInterval(updateWelcomeClock, 1000);
}

function updateWelcomeClock() {
  updateHeaderStats();
  if (currentView === "welcome" && typeof DesktopUI !== "undefined")
    DesktopUI.renderWelcome();
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  const clock = document.getElementById("welcomeClock");
  if (clock) clock.innerText = hh + ":" + mm + ":" + ss;
  const date = document.getElementById("welcomeDate");
  if (date)
    date.innerText =
      now.getFullYear() +
      "年" +
      (now.getMonth() + 1) +
      "月" +
      now.getDate() +
      "日 星期" +
      WEEKDAYS[now.getDay()];
  const greeting = document.getElementById("welcomeGreeting");
  if (greeting) {
    const h = now.getHours();
    const part =
      h < 6
        ? "夜深了"
        : h < 12
          ? "早上好"
          : h < 14
            ? "中午好"
            : h < 18
              ? "下午好"
              : "晚上好";
    greeting.innerText = part + "，欢迎使用" + GodpowerTheme.name();
  }
}

function renderWelcomePage() {
  if (typeof DesktopUI !== "undefined") DesktopUI.renderWelcome();
  const wrap = document.getElementById("welcomePodiumDeck");
  if (!wrap) return;
  const sorted = [...state.groups].sort(
    (a, b) => (Number(b.score) || 0) - (Number(a.score) || 0),
  );
  const top1 = sorted[0],
    top2 = sorted[1],
    top3 = sorted[2];
  const getScore = (g) => (g ? Number(g.score) || 0 : 0);
  wrap.innerHTML = `
    <div class="podium-col rank-2" style="background:rgba(246,250,253,.85); border-color:rgba(190,215,235,.9);">
      <span class="podium-badge" style="color:#4a5b73;">第 2 名</span>
      <span class="podium-name" style="color:#172033;">${top2 ? escapeHtml(top2.name) : "-"}</span>
      <span class="podium-score" style="color:${top2 ? top2.color : "#94a3b8"};">${getScore(top2)}分</span>
    </div>
    <div class="podium-col rank-1" style="background:rgba(254,243,199,.85); border-color:#fbbf24;">
      <span class="podium-badge" style="color:#b45309;">第 1 名</span>
      <span class="podium-name" style="color:#172033;">${top1 ? escapeHtml(top1.name) : "-"}</span>
      <span class="podium-score" style="color:#b45309; font-size:20px;">${getScore(top1)}分</span>
    </div>
    <div class="podium-col rank-3" style="background:rgba(246,250,253,.85); border-color:rgba(190,215,235,.9);">
      <span class="podium-badge" style="color:#4a5b73;">第 3 名</span>
      <span class="podium-name" style="color:#172033;">${top3 ? escapeHtml(top3.name) : "-"}</span>
      <span class="podium-score" style="color:${top3 ? top3.color : "#94a3b8"};">${getScore(top3)}分</span>
    </div>`;
  // Visible welcome statistics are owned by WelcomeV2.render().
}

/* ---------- 菜单同拍音频池配置 ---------- */
