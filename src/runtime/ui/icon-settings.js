const UI_ICON_TARGETS = [
  ["nav_welcome", "欢迎", '[data-view="welcome"]', "🏠"],
  ["nav_battle", "比赛", '[data-view="battle"]', "⚔️"],
  ["nav_history", "历史", '[data-view="history"]', "📜"],
  ["nav_archives", "档案", '[data-view="archives"]', "🗄️"],
  ["nav_plugins", "插件", '[data-view="plugins"]', "🧩"],
  ["nav_settings", "设置", '[data-view="settings"]', "⚙️"],
  ["dock_item", "全局道具抽取", 'button[onclick="globalItemDraw()"]', "🎁"],
  ["dock_hand", "举手办案处", 'button[onclick="openHandRaise()"]', "✋"],
  ["dock_picker", "点名抽签", 'button[onclick="openPickerModal()"]', "🎰"],
  ["dock_about", "关于", 'button[onclick="openAbout()"]', "ⓘ"],
  [
    "dock_search",
    "人肉搜索（文明版）",
    'button[onclick="openMemberSearchModal()"]',
    "😎",
  ],
  ["dock_undo", "撤销", 'button[onclick="undoLast()"]', "↩️"],
  ["dock_lock", "上帝模式", 'button[onclick="toggleLock()"]', "🔒"],
  ["dock_add", "增加小组", 'button[onclick="addGroup()"]', "➕"],
  ["dock_zoomin", "放大", 'button[onclick="zoomIn()"]', "🔍⁺"],
  ["dock_zoomout", "缩小", 'button[onclick="zoomOut()"]', "🔍⁻"],
  ["dock_zoomreset", "复位缩放", 'button[onclick="zoomReset()"]', "🔍↺"],
];
let pendingUiIconV26 = null;
function uiIconsV26() {
  return STORAGE.getJSON("politics_ui_icons_v26", {}) || {};
}
function applyUiIconsV26() {
  const map = uiIconsV26();
  UI_ICON_TARGETS.forEach(([id, label, sel]) => {
    const el = document.querySelector(sel);
    if (!el) return;
    if (!el.dataset.v26Original) el.dataset.v26Original = el.innerHTML;
    const data = Reliability.safeImage(map[id]);
    if (data) {
      const template = document.createElement("template");
      template.innerHTML = el.dataset.v26Original;
      template.content.querySelector("svg,.custom-ui-icon")?.remove();
      const text = template.innerHTML.trim() || escapeHtml(label);
      el.innerHTML = `<img class="custom-ui-icon" src="${data}" alt=""> ${text}`;
    } else el.innerHTML = el.dataset.v26Original;
    el.setAttribute("aria-label", label);
  });
}

function chooseUiIconV26(id) {
  pendingUiIconV26 = id;
  const f = document.getElementById("uiIconInputV26");
  f.value = "";
  f.click();
}
function handleUiIconV26(e) {
  const f = e.target.files?.[0];
  if (!f || !pendingUiIconV26) return;
  normalizeItemIconFile(f, (data) => {
    const m = uiIconsV26();
    m[pendingUiIconV26] = data;
    STORAGE.setJSON("politics_ui_icons_v26", m);
    applyUiIconsV26();
    renderUiIconManagerV26();
  });
}
function resetUiIconV26(id) {
  const m = uiIconsV26();
  delete m[id];
  STORAGE.setJSON("politics_ui_icons_v26", m);
  applyUiIconsV26();
  renderUiIconManagerV26();
}
function renderUiIconManagerV26() {
  const box = document.getElementById("uiIconManagerV26");
  if (!box) return;
  const m = uiIconsV26();
  box.innerHTML = `<div class="icon-custom-grid">${UI_ICON_TARGETS.map(([id, label, , fallback]) => `<div class="icon-custom-card"><div class="icon-preview">${m[id] ? `<img src="${m[id]}">` : fallback}</div><div style="flex:1"><b>${label}</b><div style="font-size:11px;color:#64748b">支持 PNG / JPG / WebP</div></div><button class="btn btn-sm btn-primary" onclick="chooseUiIconV26('${id}')">上传</button>${m[id] ? `<button class="btn btn-sm" onclick="resetUiIconV26('${id}')">还原</button>` : ""}</div>`).join("")}</div>`;
}

/* 5. 重建设置页标签，真正做到互斥显示 */
