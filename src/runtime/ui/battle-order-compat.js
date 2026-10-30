/* ===== V2.13.0：编号、卡片信息层级、动态排序、百科修复 ===== */
let v213ForceRankSort = false;
let v213ItemSortBusy = false;
let v213SkipNextReorderAnimation = false;
let v213SuppressReorderAnimation = false;
const V213_CARD_REORDER_MS = 750;
const V213_CARD_REORDER_SETTLE_MS = 790;

function ensureGroupNumbersV213(save = false) {
  const used = new Set();
  let maxNo = 0,
    changed = false;
  state.groups.forEach((g) => {
    let n = Number.parseInt(g.groupNo, 10);
    if (Number.isFinite(n) && n > 0 && !used.has(n)) {
      g.groupNo = n;
      used.add(n);
      maxNo = Math.max(maxNo, n);
    } else g.groupNo = null;
  });
  state.groups.forEach((g) => {
    if (g.groupNo != null) return;
    do {
      maxNo++;
    } while (used.has(maxNo));
    g.groupNo = maxNo;
    used.add(maxNo);
    changed = true;
  });
  if (changed && save) {
    try {
      saveState();
    } catch (e) {}
  }
  return changed;
}
function groupNoTextV213(g) {
  const n = Math.max(1, Number.parseInt(g?.groupNo, 10) || 1);
  return String(n).padStart(2, "0");
}
function desiredGroupsV213() {
  ensureGroupNumbersV213(false);
  if (v213ForceRankSort || !(state.roundActive && !state.evaluated))
    return ranking();
  return state.groups
    .slice()
    .sort(
      (a, b) =>
        (a.groupNo || 999999) - (b.groupNo || 999999) ||
        state.groups.indexOf(a) - state.groups.indexOf(b),
    );
}
function currentCardSortLabelV213() {
  return v213ForceRankSort || !(state.roundActive && !state.evaluated)
    ? "排名"
    : "编号";
}

/* 百科重绘：圆底图标永远固定尺寸，右侧承载文字信息。 */
renderItemEncyclopedia = function () {
  ensureV2State();
  const box = document.getElementById("v2ItemEncyclopedia");
  if (!box) return;
  box.innerHTML = `<div style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:9px">
    <button class="btn btn-primary btn-sm" onclick="exportItemIconPack()">导出图标包</button>
    <button class="btn btn-primary btn-sm" onclick="document.getElementById('itemPackInput').click()">导入图标包</button>
    <button class="btn btn-sm" onclick="resetAllItemIcons()">恢复全部默认图标</button>
  </div><div class="item-ency-grid">${ITEM_KEYS.map((k) => {
    const d = ITEM_DEFS[k];
    return `<div class="ency-v213-card">
    <div class="ency-v213-icon-disc">${itemVisual(k, "ency-v213-img")}</div>
    <div class="ency-v213-info"><div class="ency-v213-name">${escapeHtml(d.name)}</div><div class="ency-v213-desc">${escapeHtml(d.desc)}</div></div>
    <div class="ency-v213-actions"><button class="btn btn-sm btn-primary" onclick="chooseItemIcon('${k}')">上传图片</button><button class="btn btn-sm" onclick="resetItemIcon('${k}')">恢复默认</button></div>
  </div>`;
  }).join("")}</div>`;
};

/* 全新的紧凑小组卡片。保留旧卡片尺寸，但只在正面放最常用信息。 */

/* 导入名单时尽量保留已经手动设置的小组编号。 */
if (typeof applySettingsBatchMembers === "function") {
  const _v213Batch = applySettingsBatchMembers;
  applySettingsBatchMembers = function (...a) {
    const oldNums = new Map(state.groups.map((g) => [g.id, g.groupNo]));
    const r = _v213Batch.apply(this, a);
    state.groups.forEach((g) => {
      if (oldNums.has(g.id)) g.groupNo = oldNums.get(g.id);
    });
    ensureGroupNumbersV213(false);
    saveState();
    renderAll();
    return r;
  };
}

/* V2.17.21：答题期间卡片既然已经按编号排列，
   使用道具时就保持原位，不再为了发动道具临时切到排名顺序。
   当前排名改由顶部独立预览显示。 */

/* 页面加载与旧存档迁移。 */
window.addEventListener("DOMContentLoaded", () =>
  setTimeout(() => {
    ensureGroupNumbersV213(true);
    try {
      renderAll();
    } catch (e) {}
    try {
      renderItemEncyclopedia();
    } catch (e) {}
  }, 280),
);
