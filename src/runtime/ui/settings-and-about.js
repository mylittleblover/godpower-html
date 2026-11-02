function installSettingsTabs() {
  const sc = document.querySelector("#view-settings .settings-scroll");
  if (!sc || document.getElementById("settingsV2Tabs")) return;
  const tabs = document.createElement("div");
  tabs.id = "settingsV2Tabs";
  tabs.className = "item-settings-tabs";
  tabs.innerHTML = `<button class="active" data-sp="function" onclick="showSettingsV2('function')">功能设置</button><button data-sp="sound" onclick="showSettingsV2('sound')">声音设置</button><button data-sp="data" onclick="showSettingsV2('data')">数据备份 / 导出</button><button data-sp="items" onclick="showSettingsV2('items')">道具百科</button>`;
  sc.prepend(tabs);
  const item = document.createElement("div");
  item.id = "v2ItemPane";
  item.className = "item-settings-pane";
  item.innerHTML =
    '<div class="setting-section-title">🎁 28 种道具百科与图标管理</div><div id="v2ItemEncyclopedia"></div>';
  sc.appendChild(item);
  renderItemEncyclopedia();
}
function showSettingsV2(which) {
  installSettingsTabs();
  document
    .querySelectorAll("#settingsV2Tabs button")
    .forEach((b) => b.classList.toggle("active", b.dataset.sp === which));
  const sc = document.querySelector("#view-settings .settings-scroll"),
    item = document.getElementById("v2ItemPane");
  [...sc.children].forEach((el) => {
    if (el.id !== "settingsV2Tabs" && el.id !== "v2ItemPane")
      el.style.display = which === "items" ? "none" : "";
  });
  item.classList.toggle("active", which === "items");
  if (which === "items") renderItemEncyclopedia();
  if (which !== "items") {
    const titles = [...sc.querySelectorAll(".setting-section-title")];
    if (which === "sound" && titles.length) {
      titles[0]?.scrollIntoView({ block: "start" });
    }
    if (which === "data") {
      sc.scrollTop = sc.scrollHeight;
    }
  }
}

/* About */
function openAbout() {
  showClassroomWindow(document.getElementById("aboutBackdrop"));
  renderAbout("info");
}
function closeAbout() {
  hideClassroomWindow(document.getElementById("aboutBackdrop"));
}
function renderAbout(tab) {
  document
    .querySelectorAll("[data-about]")
    .forEach((b) => b.classList.toggle("active", b.dataset.about === tab));
  const m = document.getElementById("aboutMain");
  if (tab === "info")
    m.innerHTML = `<h2>上帝（马克思）的力量</h2><div class="guide-block"><b>课堂积分与道具系统 V2</b><br>包含课堂积分、随机点名、手动举手、28 种排名权重道具、历史回滚、档案与音效与音乐管理。</div><div class="guide-block">普通教学模式限制高风险编辑；解锁后可进行管理操作。道具的负分保护、三重耐久和持续状态仍遵循比赛规则。</div><button class="btn" onclick="closeAbout()">关闭</button>`;
  else if (tab === "items")
    m.innerHTML = `<h2>28 种道具百科</h2>${ITEM_KEYS.map((k) => `<div class="guide-block"><b>${itemVisual(k)} ${ITEM_DEFS[k].name}</b><br>${ITEM_DEFS[k].desc}</div>`).join("")}`;
  else
    m.innerHTML = `<h2>核心功能指南</h2><div class="guide-block"><b>PK：</b>各组作答后统一判定，每次 PK 都计入课堂统计。</div><div class="guide-block"><b>全局道具抽取：</b>点击底部 🎁 后，各个符合条件的小组卡片直接原地滚动 3 秒，再显示结果 3 秒。满背包与负分组不参与。</div><div class="guide-block"><b>手动举手：</b>底部 ✋ 选择小组并判定正误，正确后可赋分、抽道具或直接使用道具。</div><div class="guide-block"><b>随机点名：</b>🎰 提供个人、小组、双层联动三种模式，右侧可即时赋分。</div><div class="guide-block"><b>管理：</b>解锁后可自由赋分，并在小组道具页强制增删道具。</div>`;
}

/* God mode 道具管理 */
const _v2RenderItemWindow = renderItemWindow;
renderItemWindow = function () {
  _v2RenderItemWindow();
  const g = state.groups.find((x) => x.id === activeItemGroupId),
    body = document.getElementById("itemWindowBody");
  if (!g || !body || state.isLocked || activeItemTab !== "items") return;
  const d = document.createElement("div");
  d.className = "god-item-tools";
  d.innerHTML = `<b>🔓 上帝模式 · 现实编辑器</b><div class="god-item-grid" style="margin-top:8px">${ITEM_KEYS.map((k) => `<button class="btn btn-sm" onclick="godAddItem(${g.id},'${k}')">${itemVisual(k)} ${ITEM_DEFS[k].name}</button>`).join("")}</div><button class="btn btn-sm btn-danger" style="margin-top:8px" onclick="godClearItems(${g.id})">🧹 把道具桌面掀干净</button>`;
  body.appendChild(d);
};
function godAddItem(id, k) {
  const g = state.groups.find((x) => x.id === id);
  if (!g) return;
  if (g.inventory.length >= 3) {
    showToast("三个槽位都坐满了，先请走一个再塞新的。");
    return;
  }
  recordHistory(`${g.name} 上帝模式追加 ${ITEM_DEFS[k].name}`);
  g.inventory.push(
    globalThis.ItemModules
      ? ItemModules.inventory(k)
      : {
          key: k,
          charges: ITEM_DEFS[k].charges,
          acquiredAt: Date.now() + Math.random(),
        },
  );
  saveState();
  renderAll();
  renderItemWindow();
}
function godClearItems(id) {
  const g = state.groups.find((x) => x.id === id);
  if (!g) return;
  recordHistory(`${g.name} 上帝模式清空道具`);
  g.inventory = [];
  g.itemEffect = null;
  g.competitionEffects = {};
  g.booShield = 0;
  saveState();
  renderAll();
  renderItemWindow();
}

/* 自定义图标也进入卡片和战术窗口 */
const _v2Enhance = enhanceItemCards;
enhanceItemCards = function () {
  _v2Enhance();
  ensureV2State();
  state.groups.forEach((g) => {
    const c = document.querySelector(
      `.group-row-card[data-group-id="${g.id}"]`,
    );
    if (!c) return;
    c.querySelectorAll(".item-slot").forEach((s, i) => {
      const it = g.inventory[i];
      if (it && state.itemGlobal.customIcons[it.key]) {
        const charge = s.querySelector(".charges")?.outerHTML || "";
        s.innerHTML = itemVisual(it.key) + charge;
      }
    });
  });
};
const _v2RenderItemWindowIcons = renderItemWindow;
renderItemWindow = function () {
  _v2RenderItemWindowIcons();
  const g = state.groups.find((x) => x.id === activeItemGroupId);
  if (!g || activeItemTab !== "items") return;
  document
    .querySelectorAll("#itemWindowBody .item-big-icon")
    .forEach((el, i) => {
      const it = g.inventory[i];
      if (it) el.innerHTML = itemVisual(it.key);
    });
};

/* 答题轮次统计 */

/* 设置/关于关闭与初始化 */
document.getElementById("aboutBackdrop")?.addEventListener("click", (e) => {
  if (e.target.id === "aboutBackdrop") closeAbout();
});
document.getElementById("handRaiseBackdrop")?.addEventListener("click", (e) => {
  if (e.target.id === "handRaiseBackdrop") closeHandRaise();
});
const _v2SwitchView = switchView;
switchView = function (name) {
  _v2SwitchView(name);
  if (name === "settings") setTimeout(installSettingsTabs, 0);
};
window.addEventListener("DOMContentLoaded", () => {
  ensureV2State();
  installSettingsTabs();
  renderPickerInfo();
});

/* ===== V2.1：举手奖励的道具抽取在举手窗口内完成 ===== */
