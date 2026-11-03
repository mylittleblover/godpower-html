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
  switchView("settings");
  DesktopUI.selectSettings("about");
  renderAbout("info");
}
function closeAbout() {
  switchView("battle");
}
function renderAbout(tab) {
  const result =
    tab === "items" ? renderAboutItems(tab) : renderAboutInformation(tab);
  cleanAboutVisibleCopy();
  return result;
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
