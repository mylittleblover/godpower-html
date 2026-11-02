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
renderAbout = function (tab) {
  document
    .querySelectorAll("[data-about]")
    .forEach((b) => b.classList.toggle("active", b.dataset.about === tab));
  const m = document.getElementById("aboutMain");
  if (!m) return;
  if (tab === "info") {
    m.innerHTML = `<div class="about-heading"><h2>上帝（马克思）的力量</h2><button class="btn btn-sm" onclick="closeAbout()">关闭</button></div><div class="guide-block"><b>课堂积分与道具系统</b><br>包含课堂积分、随机点名、手动举手、${ITEM_KEYS.length} 种排名权重道具、历史回滚、档案与音效与音乐管理。</div><div class="guide-block">当前界面采用现代扁平风格，保留必要的状态动画与道具演出。</div>`;
    return;
  }
  if (tab === "items") {
    m.innerHTML = `<div class="about-heading"><h2>${ITEM_KEYS.length} 种道具百科</h2><button class="btn btn-sm" onclick="closeAbout()">关闭</button></div><div class="about-item-list">${ITEM_KEYS.map(
      (k) => {
        const d = ITEM_DEFS[k];
        return `<div class="about-item"><div class="about-item-disc">${itemVisual(k, "about-item-img")}</div><div class="about-item-info"><div class="about-item-name">${escapeHtml(d.name)}</div><div class="about-item-desc">${escapeHtml(d.desc || "")}</div></div></div>`;
      },
    ).join("")}</div>`;
    return;
  }
  m.innerHTML = `<div class="about-heading"><h2>核心功能指南</h2><button class="btn btn-sm" onclick="closeAbout()">关闭</button></div><div class="guide-block"><b>PK：</b>各组作答后统一判定，每次 PK 都计入课堂统计。</div><div class="guide-block"><b>全局道具抽取：</b>符合条件的小组卡片原地滚动并获得道具；满背包与负分组不参与。</div><div class="guide-block"><b>手动举手：</b>选择小组并判定正误，正确后可直接加分、抽取道具，或立即使用当前主要道具。</div><div class="guide-block"><b>随机点名：</b>提供个人、小组、双层联动三种模式，并支持即时赋分。</div>`;
};

/* 举手窗口的组按钮加 data 属性，便于分数变化时原位刷新。 */
renderHandRaise = function () {
  const box = document.getElementById("handGroupGrid");
  if (!box) return;
  box.innerHTML = state.groups
    .map(
      (g) =>
        `<button type="button" class="hand-group two-tier-chip ${g.id === handRaiseGroupId ? "selected" : ""}" data-group-id="${g.id}" aria-pressed="${g.id === handRaiseGroupId ? "true" : "false"}" style="--hand-color:${g.color};--hand-contrast:${readableTextOnColor(g.color)}" onclick="selectHandGroup(${g.id})"><span class="hand-group-name">${escapeHtml(g.name)}</span><small>${g.score} 分</small></button>`,
    )
    .join("");
  const reward = document.getElementById("handRewardBox");
  if (reward) reward.innerHTML = "";
};
function updateHandScoreV214(id) {
  const g = state.groups.find((x) => x.id === id);
  if (!g) return;
  const b = document.querySelector(
    `#handGroupGrid .hand-group[data-group-id="${id}"] small`,
  );
  if (b) b.textContent = `${g.score} 分`;
}
handQuickScore = function (n) {
  if (handRaiseGroupId == null) return;
  const id = handRaiseGroupId;
  applyScoreDelta(id, n);
  updateHandScoreV214(id);
  setTimeout(() => updateHandScoreV214(id), 120);
};

function renderHandRewardControlsV214() {
  const box = document.getElementById("handRewardBox");
  const g = state.groups.find((x) => x.id === handRaiseGroupId);
  if (!box || !g) return;
  const main = g.inventory?.[0];
  const useText = main
    ? `使用：${ITEM_DEFS[main.key]?.name || "当前主要道具"}`
    : "使用：无主要道具";
  const drawDisabled = !eligibleForItems(g) || g.inventory.length >= 3;
  const useDisabled = !main || !eligibleForItems(g);
  box.innerHTML = `<div class="hand-rewards"><b style="width:100%">回答正确 · 选择奖励</b><button class="btn btn-success" onclick="handQuickScore(1)">+1</button><button class="btn btn-success" onclick="handQuickScore(2)">+2</button><button class="btn btn-success" onclick="handQuickScore(5)">+5</button><button class="btn btn-primary" onclick="handDrawItem()" ${drawDisabled ? "disabled" : ""}>🎁 抽取道具</button><button class="btn btn-warning" onclick="handUsePrimaryV214()" ${useDisabled ? "disabled" : ""}>${escapeHtml(useText)}</button></div>`;
}
const _v214JudgeHandRaise = judgeHandRaise;
judgeHandRaise = function (correct) {
  _v214JudgeHandRaise.call(this, correct);
  if (correct) renderHandRewardControlsV214();
};
function handUsePrimaryV214() {
  const g = state.groups.find((x) => x.id === handRaiseGroupId);
  if (!g) return;
  const main = g.inventory?.[0];
  if (!main) {
    showToast("该组当前没有主要道具");
    return;
  }
  const gid = g.id;
  closeHandRaise();
  // Use from the hand panel also presents the full-screen cinematic, exactly
  // like the floating window's hand menu.
  globalThis.HandItemCinematic?.mark(gid);
  setTimeout(() => useItem(gid, 0), 0);
}

/* 抽完奖励后只允许关闭举手窗口。 */
finishHandItemReward = function () {
  handItemDrawGroupId = null;
  handItemPendingKey = null;
  handItemDrawStartedAt = 0;
  closeHandRaise();
};

/* 页面加载完成后启用唯一扁平主题。 */
window.addEventListener("DOMContentLoaded", () =>
  setTimeout(() => {
    applyModernFlatV217();
    try {
      renderGrid();
    } catch (e) {}
  }, 320),
);
