let pickerInfoTab = "history",
  handRaiseGroupId = null,
  pendingItemIconKey = null;
function ensureV2State() {
  ensureItemState();
  if (!state.itemGlobal.pickerHistory) state.itemGlobal.pickerHistory = [];
  if (!state.itemGlobal.handRaiseHistory)
    state.itemGlobal.handRaiseHistory = [];
  if (!state.itemGlobal.handRaiseTotal) state.itemGlobal.handRaiseTotal = 0;
  if (!state.itemGlobal.pkTotal) state.itemGlobal.pkTotal = 0;
  if (!state.itemGlobal.customIcons)
    state.itemGlobal.customIcons = STORAGE.getJSON("politics_item_icons", {});
}
ensureV2State();
const BUILTIN_ITEM_ICONS_V2121 = {
  item_box: "@@RESOURCE:item_box.txt@@",
  kamek: "@@RESOURCE:kamek.txt@@",
  green: "@@RESOURCE:asset-000.txt@@",
  triple_green: "@@RESOURCE:asset-001.txt@@",
  red: "@@RESOURCE:asset-002.txt@@",
  triple_red: "@@RESOURCE:asset-003.txt@@",
  spiny: "@@RESOURCE:asset-004.txt@@",
  banana: "@@RESOURCE:asset-005.txt@@",
  triple_banana: "@@RESOURCE:asset-006.txt@@",
  horn: "@@RESOURCE:asset-007.txt@@",
  bomb: "@@RESOURCE:asset-008.txt@@",
  hammer: "@@RESOURCE:asset-009.txt@@",
  coin: "@@RESOURCE:asset-010.txt@@",
  coin_shell: "@@RESOURCE:asset-011.txt@@",
  question: "@@RESOURCE:asset-012.txt@@",
  mushroom: "@@RESOURCE:asset-013.txt@@",
  triple_mushroom: "@@RESOURCE:asset-014.txt@@",
  boo: "@@RESOURCE:asset-015.txt@@",
  blooper: "@@RESOURCE:asset-016.txt@@",
  lightning: "@@RESOURCE:asset-017.txt@@",
  star: "@@RESOURCE:asset-018.txt@@",
  mega: "@@RESOURCE:asset-019.txt@@",
  bullet: "@@RESOURCE:asset-020.txt@@",
  power: "@@RESOURCE:asset-021.txt@@",
  feather: "@@RESOURCE:asset-022.txt@@",
  fire_flower: "@@RESOURCE:asset-023.txt@@",
  ice_flower: "@@RESOURCE:asset-024.txt@@",
  boomerang_flower: "@@RESOURCE:asset-025.txt@@",
};
const BUILTIN_ITEM_BOX_V2121 = "@@RESOURCE:asset-026.txt@@";
const itemIconPresentationCache = new Map();
function itemIconPresentation(key) {
  const d = ITEM_DEFS[key],
    custom = state.itemGlobal?.customIcons?.[key],
    builtin = BUILTIN_ITEM_ICONS_V2121[key];
  let entry = itemIconPresentationCache.get(key);
  if (
    !entry ||
    entry.custom !== custom ||
    entry.builtin !== builtin ||
    entry.name !== d.name
  ) {
    entry = {
      custom,
      builtin,
      name: d.name,
      src: Reliability.safeImage(custom) || builtin,
    };
    if (itemIconPresentationCache.size >= 128)
      itemIconPresentationCache.clear();
    itemIconPresentationCache.set(key, entry);
  }
  return entry;
}
function itemVisual(key, cls = "") {
  const entry = itemIconPresentation(key);
  if (!entry.src) return ITEM_DEFS[key].icon;
  if (entry.escapedSrc === undefined) entry.escapedSrc = escapeHtml(entry.src);
  if (entry.escapedName === undefined)
    entry.escapedName = escapeHtml(entry.name);
  return `<img class="${escapeHtml(cls)}" src="${entry.escapedSrc}" alt="${entry.escapedName}">`;
}
/* Raw icon for surfaces outside this document (the native reveal window). */
function itemIconDataUrl(key) {
  return itemIconPresentation(key).src || "";
}
function itemBoxVisualV2121(cls = "") {
  return BUILTIN_ITEM_BOX_V2121
    ? `<img class="${cls}" src="${BUILTIN_ITEM_BOX_V2121}" alt="道具箱">`
    : "❔";
}
function setPickerInfoTab(tab) {
  pickerInfoTab = tab;
  document
    .getElementById("pickerStatsBtn")
    ?.classList.toggle("active", tab === "stats");
  document
    .getElementById("pickerHistoryBtn")
    ?.classList.toggle("active", tab === "history");
  renderPickerInfo();
}
function renderPickerInfo() {
  ensureV2State();
  const box = document.getElementById("pickerInfoBox");
  if (!box) return;
  if (pickerInfoTab === "stats") {
    const a = state.groups.reduce(
      (n, g) => n + (g.itemStats?.correct || 0) + (g.itemStats?.wrong || 0),
      0,
    );
    box.innerHTML = `<div class="guide-block"><b>课堂作答</b><br>${a} 次</div><div class="guide-block"><b>答题轮次</b><br>${state.itemGlobal.pkTotal || 0} 轮</div><div class="guide-block"><b>全局道具发放</b><br>${state.itemGlobal.totalDraws || 0} 件</div><div class="guide-block"><b>手动举手</b><br>${state.itemGlobal.handRaiseTotal || 0} 次</div>`;
  } else {
    const arr = state.itemGlobal.pickerHistory || [];
    box.innerHTML = arr.length
      ? arr
          .slice(-30)
          .reverse()
          .map(
            (x) =>
              `<div class="picker-log">${escapeHtml(x.text)}<br><small>${new Date(x.time).toLocaleTimeString()}</small></div>`,
          )
          .join("")
      : "暂无抽签记录";
  }
}
const _v2OpenPicker = openPickerModal;
openPickerModal = function (...args) {
  ensureV2State();
  pickerInfoTab = "history";
  _v2OpenPicker(...args);
  setPickerInfoTab("history");
  syncPickerScoreTarget();
};
function syncPickerScoreTarget() {
  const el = document.getElementById("pickerScoreTarget"),
    w = slotEngine.chosenResult;
  if (!el) return;
  if (!w) {
    el.textContent = "抽中学生或小组后，可直接给所属小组赋分。";
    return;
  }
  const g = state.picker.mode === "group" ? w : w.group;
  el.innerHTML = `<b>${escapeHtml(g.name)}</b>${state.picker.mode === "group" ? "" : `<br>${escapeHtml(w.memberName)}`}<br>当前 ${g.score} 分`;
}
function pickerTargetGroup() {
  const w = slotEngine.chosenResult;
  if (!w) return null;
  return state.picker.mode === "group" ? w : w.group;
}
function scorePickerTarget(n) {
  const g = pickerTargetGroup();
  if (!g) {
    showToast("请先完成一次抽签");
    return;
  }
  applyScoreDelta(g.id, n);
  syncPickerScoreTarget();
}
function scorePickerCustom() {
  const n = Math.round(
    Number(document.getElementById("pickerCustomScore")?.value),
  );
  if (!Number.isFinite(n) || n === 0) return;
  scorePickerTarget(n);
}

/* 手动举手 */
function openHandRaise() {
  return globalThis.HandFlowView?.toggle();
}
function closeHandRaise() {
  cancelHandItemDraw(true);
  return globalThis.HandFlowView?.close();
}
function renderHandRaise() {
  return globalThis.HandFlowView?.render();
}
function selectHandGroup(id) {
  return globalThis.HandFlowView?.select(id);
}
function judgeHandRaise(correct) {
  return globalThis.HandFlowView?.judge(correct);
}
function handQuickScore(n) {
  return globalThis.HandFlowView?.score(n);
}
function handUseItem() {
  const g = state.groups.find((x) => x.id === handRaiseGroupId);
  if (!g || !g.inventory.length) {
    showToast("该组没有可用道具");
    return;
  }
  closeHandRaise();
  openItemWindow(g.id, "items");
  globalThis.HandItemCinematic?.mark(g.id);
}

/* 全局抽取：直接在比赛卡片内部滚动，不再弹窗 */

/* 道具图鉴与自定义图标 */
