/* ===== V2.18.0：手写方案完整实现 ===== */

/* ---------- 0. 通用学生学号解析 ---------- */
function parseStudentV218(raw) {
  const text = String(raw ?? "").trim();
  /* 允许：12 张三 / 12-张三 / 12_张三 / 12张三 */
  const m = text.match(/^(\d{1,4})\s*[-_—–:：.]?\s*(.*)$/);
  if (!m) return { number: null, name: text, raw: text };
  return {
    number: Number(m[1]),
    numberText: m[1],
    name: (m[2] || "").trim() || text,
    raw: text,
  };
}
function studentLabelHTMLV218(raw, g) {
  const p = parseStudentV218(raw);
  if (p.number == null)
    return `<span class="student-name-v218">${escapeHtml(p.name)}</span>`;
  return `<span class="student-no-inline-v218" style="color:${g?.color || "#0f766e"}">${escapeHtml(p.numberText)}</span><span class="student-name-v218">${escapeHtml(p.name)}</span>`;
}
function pinyinInitialV218(raw) {
  const name = parseStudentV218(raw).name.trim();
  if (!name) return "#";
  const ch = name[0];
  if (/[A-Za-z]/.test(ch)) return ch.toUpperCase();
  if (/\d/.test(ch)) return "#";
  const bounds = [
    ["A", "阿"],
    ["B", "芭"],
    ["C", "擦"],
    ["D", "搭"],
    ["E", "蛾"],
    ["F", "发"],
    ["G", "噶"],
    ["H", "哈"],
    ["J", "击"],
    ["K", "喀"],
    ["L", "垃"],
    ["M", "妈"],
    ["N", "拿"],
    ["O", "哦"],
    ["P", "啪"],
    ["Q", "期"],
    ["R", "然"],
    ["S", "撒"],
    ["T", "塌"],
    ["W", "挖"],
    ["X", "昔"],
    ["Y", "压"],
    ["Z", "匝"],
  ];
  try {
    let result = "A";
    for (const [letter, bound] of bounds) {
      if (ch.localeCompare(bound, "zh-CN-u-co-pinyin") >= 0) result = letter;
      else break;
    }
    return result;
  } catch (e) {
    return "#";
  }
}

/* ---------- 1. 鱿鱿：榜单预览也遮蔽 ---------- */
if (ITEM_DEFS.blooper) {
  ITEM_DEFS.blooper.name = "鱿鱿";
  ITEM_DEFS.blooper.desc =
    "全场比分遮蔽 2 分钟，积分、领奖台、图表与比赛页顶部排名预览均显示为 ???。";
}
const _v218RenderBattleRankPreview = renderBattleRankPreviewV21721;
renderBattleRankPreviewV21721 = function () {
  const r = _v218RenderBattleRankPreview.apply(this, arguments);
  const active = Number(state.itemGlobal?.blooperUntil || 0) > Date.now();
  if (active) {
    document
      .querySelectorAll(
        "#battleRankPreviewGridV21721 .battle-rank-score-v21721",
      )
      .forEach((el) => (el.textContent = "???"));
  }
  return r;
};

/* ---------- 2. 成员搜索优化：姓名 / 学号都可直接搜 ---------- */
searchMemberGroups = function () {
  const input = document.getElementById("memberSearchInput");
  const results = document.getElementById("memberSearchResults");
  if (!input || !results) return;
  const q = input.value.trim().toLowerCase();
  if (!q) {
    results.innerHTML =
      '<div class="member-search-empty">请输入姓名或学号开始查询</div>';
    return;
  }

  const matches = [];
  state.groups.forEach((g) =>
    (g.members || []).forEach((member) => {
      const p = parseStudentV218(member);
      const numberHit =
        p.number != null && String(p.number).includes(q.replace(/\D/g, ""));
      const nameHit =
        p.name.toLowerCase().includes(q) ||
        String(member).toLowerCase().includes(q);
      if (nameHit || (/\d/.test(q) && numberHit))
        matches.push({ member, p, group: g });
    }),
  );

  if (!matches.length) {
    results.innerHTML = `<div class="member-search-empty">没有找到“${escapeHtml(input.value.trim())}”</div>`;
    return;
  }
  results.innerHTML = matches
    .map(
      ({ member, p, group: g }) => `
    <div class="member-search-result">
      <div class="member-search-result-name">${studentLabelHTMLV218(member, g)}</div>
      <div class="member-search-result-group" style="color:${g.color}">${escapeHtml(g.name)}</div>
    </div>`,
    )
    .join("");
};
const memberSearchInputV218 = document.getElementById("memberSearchInput");
if (memberSearchInputV218) memberSearchInputV218.placeholder = "输入姓名或学号";

/* 随机点名右侧即时赋分也显示彩色学号。 */
if (typeof syncPickerScoreTarget === "function") {
  syncPickerScoreTarget = function () {
    const el = document.getElementById("pickerScoreTarget"),
      w = slotEngine.chosenResult;
    if (!el) return;
    if (typeof DesktopUI !== "undefined") DesktopUI.pickerChanged();
    if (!w) {
      el.textContent = "抽中学生或小组后，可直接给所属小组赋分。";
      return;
    }
    const g = state.picker.mode === "group" ? w : w.group;
    el.innerHTML = `<b style="color:${g.color}">${escapeHtml(g.name)}</b>${state.picker.mode === "group" ? "" : `<br>${studentLabelHTMLV218(w.memberName, g)}`}<br>当前 ${g.score} 分`;
  };
}

/* ---------- 3. 🤑 快速按人加分 ---------- */
