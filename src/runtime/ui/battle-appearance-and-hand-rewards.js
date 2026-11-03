/* 唯一主题入口。 */
function applyModernFlatV217() {
  document.body.classList.add("modern-flat");
}

function rankOfGroupV214(id) {
  const r = ranking();
  const i = r.findIndex((g) => g.id === id);
  return i >= 0 ? i + 1 : null;
}

/* 在 V2.13 卡片的固定布局上补充实时排名，不增加卡片总体高度。 */

/* About 里的“道具百科”与设置里的图标管理彻底分离：只保留左图右文的百科结构。 */


/* Compatibility entry points delegate to the shared card flow. */
function updateHandScoreV214() { globalThis.HandFlowView?.render(); }
function renderHandRewardControlsV214() { globalThis.HandFlowView?.render(); }
function handUsePrimaryV214() { return globalThis.HandFlowView?.reward("use"); }

/* 页面加载完成后启用唯一扁平主题。 */
window.addEventListener("DOMContentLoaded", () =>
  setTimeout(() => {
    applyModernFlatV217();
    try {
      renderGrid();
    } catch (e) {}
  }, 320),
);
