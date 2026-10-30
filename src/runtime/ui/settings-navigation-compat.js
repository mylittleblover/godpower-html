function rebuildSettingsV26() {
  const sc = document.querySelector("#view-settings .settings-scroll");
  if (
    !sc ||
    document.getElementById("settingsV26Tabs") ||
    document.getElementById("uiSettingsShell")
  )
    return;
  removeBgmEngineeringConsoleV26();
  document.getElementById("settingsV2Tabs")?.remove();
  document.getElementById("v2ItemPane")?.remove();

  const original = [...sc.children];
  const panes = {
    function: document.createElement("div"),
    sound: document.createElement("div"),
    data: document.createElement("div"),
    items: document.createElement("div"),
  };
  Object.entries(panes).forEach(([k, p]) => {
    p.id = "settingsV26_" + k;
    p.className = "settings-v26-pane";
  });
  let mode = "function";
  original.forEach((el) => {
    const txt = el.textContent || "";
    if (
      el.id === "bgmListContainer" ||
      el.id === "soundListContainer" ||
      el.id === "cfgSetSelector" ||
      txt.includes("主音量") ||
      txt.includes("曲目工程规范") ||
      txt.includes("选择要维护的音乐套数") ||
      txt.includes("当前套数音频槽位") ||
      txt.includes("基础操作与欢庆音效")
    )
      mode = "sound";
    if (txt.includes("安全与管理") || txt.includes("数据备份与恢复"))
      mode = "data";
    panes[mode].appendChild(el);
  });
  const tabs = document.createElement("div");
  tabs.id = "settingsV26Tabs";
  tabs.className = "settings-v26-tabs";
  tabs.innerHTML = `<button data-v26="function" onclick="showSettingsV26('function')">⚙️ 功能设置</button><button data-v26="sound" onclick="showSettingsV26('sound')">🔊 音效与音乐</button><button data-v26="items" onclick="showSettingsV26('items')">🎁 道具与图标</button><button data-v26="data" onclick="showSettingsV26('data')">💾 数据与管理</button>`;
  sc.append(tabs, panes.function, panes.sound, panes.items, panes.data);

  const ui = document.createElement("div");
  ui.innerHTML =
    '<div class="setting-section-title">🖼️ 按钮图标自定义</div><div id="uiIconManagerV26"></div>';
  panes.function.appendChild(ui);
  const item = document.createElement("div");
  item.innerHTML =
    '<div class="setting-section-title">🎁 26 种道具百科与图标管理</div><div id="v2ItemEncyclopedia"></div>';
  panes.items.appendChild(item);
  const fx = document.createElement("div");
  fx.innerHTML =
    '<div class="setting-section-title">🎮 道具系统音效</div><div id="itemFxSoundListV26"></div>';
  panes.sound.appendChild(fx);
  const hidden = document.createElement("input");
  hidden.type = "file";
  hidden.accept = "image/*";
  hidden.id = "uiIconInputV26";
  hidden.style.display = "none";
  hidden.onchange = handleUiIconV26;
  document.body.appendChild(hidden);
  installCommunismModeSetting();
  renderUiIconManagerV26();
  renderItemEncyclopedia();
  renderItemFxSoundListV26();
  showSettingsV26("function");
}
function showSettingsV26(which) {
  if (document.getElementById("uiSettingsShell")) {
    DesktopUI.selectSettings(which);
    return;
  }
  document
    .querySelectorAll(".settings-v26-pane")
    .forEach((p) =>
      p.classList.toggle("active", p.id === "settingsV26_" + which),
    );
  document
    .querySelectorAll("#settingsV26Tabs button")
    .forEach((b) => b.classList.toggle("active", b.dataset.v26 === which));
  const sc = document.querySelector("#view-settings .settings-scroll");
  if (sc) sc.scrollTop = 0;
  if (which === "sound") {
    renderBgmSlotList();
    renderFxSlotList();
    renderItemFxSoundListV26();
  }
  if (which === "items") renderItemEncyclopedia();
  if (which === "function") {
    installCommunismModeSetting();
    renderUiIconManagerV26();
  }
}
/* 禁止旧版 installSettingsTabs 再把内容全部放出来 */
installSettingsTabs = function () {
  rebuildSettingsV26();
};
showSettingsV2 = function (which) {
  showSettingsV26(
    which === "sound"
      ? "sound"
      : which === "data"
        ? "data"
        : which === "items"
          ? "items"
          : "function",
  );
};

/* 设置页标题也同步去掉“工程台” */
window.addEventListener("DOMContentLoaded", () => {
  const sub = document.querySelector("#view-settings .fullview-sub");
  if (sub) sub.textContent = "功能、音效与音乐、道具图标、学生名单及数据管理。";
  rebuildSettingsV26();
  applyUiIconsV26();
  setTimeout(() => {
    renderItemFxSoundListV26();
    persistHistoryV26();
    saveState();
  }, 400);
});

/* ===== V2.7 iOS / 手机浏览器 visualViewport 自适应 ===== */
function syncVisualViewportV27() {
  const h =
    (window.visualViewport && window.visualViewport.height) ||
    window.innerHeight;
  document.documentElement.style.setProperty("--vvh", h + "px");
}
syncVisualViewportV27();
window.addEventListener("resize", syncVisualViewportV27, { passive: true });
window.addEventListener(
  "orientationchange",
  () => setTimeout(syncVisualViewportV27, 80),
  { passive: true },
);
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", syncVisualViewportV27, {
    passive: true,
  });
  window.visualViewport.addEventListener("scroll", syncVisualViewportV27, {
    passive: true,
  });
}

/* ===== V2.8 持久化修复与非浏览器原生警告窗 ===== */

/* normalizeGroup 在旧版启动时会把 inventory/itemEffect/itemStats/booShield 丢掉。
   V2.8 已在 normalizeGroup 本体中保留它们；这里再做一次启动后的规范化并立即回写。 */
