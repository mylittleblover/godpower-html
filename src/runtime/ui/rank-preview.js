/* ===== V2.17.21：独立当前排名预览 + 道具不改变卡片排序 ===== */

function renderBattleRankPreviewV21721() {
  const box = document.getElementById("battleRankPreviewGridV21721");
  if (!box) return;

  let ranked = [];
  try {
    ranked =
      typeof ranking === "function"
        ? ranking()
        : state.groups
            .slice()
            .sort((a, b) => Number(b.score) - Number(a.score));
  } catch (e) {
    ranked = state.groups
      .slice()
      .sort((a, b) => Number(b.score) - Number(a.score));
  }

  box.innerHTML = ranked
    .map((g, i) => {
      const rank = i + 1;
      const no =
        typeof groupNoTextV213 === "function"
          ? groupNoTextV213(g)
          : String(g.groupNo || g.id || "");
      const medal =
        rank === 1
          ? "🥇"
          : rank === 2
            ? "🥈"
            : rank === 3
              ? "🥉"
              : String(rank);
      return `<div class="battle-rank-chip ${rank === 1 ? "rank-1" : ""}" style="--rank-group-color:${g.color || "#0F766E"}" title="第 ${rank} 名 · ${escapeHtml(g.name)} · 第 ${no} 组 · ${g.score} 分">
      <div class="battle-rank-no">${medal}</div>
      <div class="battle-rank-name">${escapeHtml(g.name)}</div>
      <div class="battle-rank-score">${g.score}分</div>
    </div>`;
    })
    .join("");
}

/* 排名预览跟随所有卡片刷新实时更新。 */

/* 进入比赛页时也立刻刷新，避免第一次看到旧排名。 */
const _v21721SwitchView = typeof switchView === "function" ? switchView : null;
if (_v21721SwitchView) {
  switchView = function (name, ...args) {
    const result = _v21721SwitchView.call(this, name, ...args);
    if (name === "battle") {
      v213ForceRankSort = false;
      setTimeout(() => {
        try {
          renderBattleRankPreviewV21721();
        } catch (e) {}
      }, 0);
    }
    return result;
  };
}

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    try {
      v213ForceRankSort = false;
      renderBattleRankPreviewV21721();
    } catch (e) {}
  }, 80);
});
