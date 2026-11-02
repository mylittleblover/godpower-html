const qpStateV218 = {
  selected: new Set(),
  bands: new Set(),
  groups: new Set(),
  letters: new Set(),
};
function allStudentsV218() {
  const out = [];
  state.groups.forEach((g) =>
    (g.members || []).forEach((member, index) => {
      const p = parseStudentV218(member);
      out.push({
        key: `${g.id}__${index}__${member}`,
        group: g,
        member,
        p,
        initial: pinyinInitialV218(member),
      });
    }),
  );
  return out;
}
function numberBandV218(n) {
  if (!Number.isFinite(n)) return null;
  if (n <= 9) return "1-9";
  const start = Math.floor(n / 10) * 10;
  return `${start}-${start + 9}`;
}
function openQuickPersonScoreV218() {
  qpStateV218.selected.clear();
  qpStateV218.bands.clear();
  qpStateV218.groups.clear();
  qpStateV218.letters.clear();
  const q = document.getElementById("qpSearchV218");
  if (q) q.value = "";
  renderQuickPersonFiltersV218();
  renderQuickPersonListV218();
  showClassroomWindow(document.getElementById("quickPersonBackdropV218"));
}
function closeQuickPersonScoreV218() {
  hideClassroomWindow(document.getElementById("quickPersonBackdropV218"));
}
function toggleQPSetV218(type, val) {
  const set = qpStateV218[type];
  set.has(val) ? set.delete(val) : set.add(val);
  renderQuickPersonFiltersV218();
  renderQuickPersonListV218();
}
function renderQuickPersonFiltersV218() {
  const students = allStudentsV218();
  const bands = [
    ...new Set(students.map((s) => numberBandV218(s.p.number)).filter(Boolean)),
  ].sort((a, b) => parseInt(a) - parseInt(b));
  const bandBox = document.getElementById("qpNumberBandsV218");
  if (bandBox)
    bandBox.innerHTML =
      bands
        .map(
          (x) =>
            `<button class="quick-person-chip ${qpStateV218.bands.has(x) ? "active" : ""}" onclick="toggleQPSetV218('bands','${x}')">${x}</button>`,
        )
        .join(" ") ||
      '<span style="font-size:11px;color:#94a3b8">名单未识别到学号</span>';

  const gb = document.getElementById("qpGroupFiltersV218");
  if (gb)
    gb.innerHTML = state.groups
      .map(
        (g) =>
          `<button class="quick-person-chip ${qpStateV218.groups.has(g.id) ? "active" : ""}" style="${qpStateV218.groups.has(g.id) ? `background:${g.color};border-color:${g.color}` : ""}" onclick="toggleQPSetV218('groups',${g.id})">${escapeHtml(g.name)}</button>`,
      )
      .join(" ");

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const lb = document.getElementById("qpLetterFiltersV218");
  if (lb)
    lb.innerHTML = letters
      .map(
        (x) =>
          `<button class="quick-person-chip quick-person-letter ${qpStateV218.letters.has(x) ? "active" : ""}" onclick="toggleQPSetV218('letters','${x}')">${x}</button>`,
      )
      .join("");
}
function filteredStudentsV218() {
  const q = (document.getElementById("qpSearchV218")?.value || "")
    .trim()
    .toLowerCase();
  return allStudentsV218().filter((s) => {
    if (q) {
      const qNum = q.replace(/\D/g, "");
      const hitName =
        s.p.name.toLowerCase().includes(q) ||
        String(s.member).toLowerCase().includes(q);
      const hitNum =
        qNum && s.p.number != null && String(s.p.number).includes(qNum);
      if (!hitName && !hitNum) return false;
    }
    if (
      qpStateV218.bands.size &&
      !qpStateV218.bands.has(numberBandV218(s.p.number))
    )
      return false;
    if (qpStateV218.groups.size && !qpStateV218.groups.has(s.group.id))
      return false;
    if (qpStateV218.letters.size && !qpStateV218.letters.has(s.initial))
      return false;
    return true;
  });
}
function renderQuickPersonListV218() {
  const box = document.getElementById("quickPersonListV218");
  if (!box) return;
  const list = filteredStudentsV218();
  box.innerHTML = list.length
    ? list
        .map(
          (s) => `
    <button class="quick-person-entry ${qpStateV218.selected.has(s.key) ? "selected" : ""}" onclick="toggleQuickPersonV218('${escapeHtml(s.key).replace(/'/g, "&#39;")}')">
      ${s.p.number != null ? `<span class="student-no" style="background:${s.group.color}">${escapeHtml(s.p.numberText)}</span>` : '<span class="student-no" style="background:#94a3b8">—</span>'}
      <span class="student-name">${escapeHtml(s.p.name)}</span>
      <span class="quick-person-group" title="${escapeHtml(s.group.name)}">${escapeHtml(s.group.name)}</span>
    </button>`,
        )
        .join("")
    : '<div class="member-search-empty">当前筛选条件下没有学生</div>';
  const c = document.getElementById("qpSelectedCountV218");
  if (c) c.textContent = `已选择 ${qpStateV218.selected.size} 人`;
}
function toggleQuickPersonV218(key) {
  qpStateV218.selected.has(key)
    ? qpStateV218.selected.delete(key)
    : qpStateV218.selected.add(key);
  renderQuickPersonListV218();
}
function applyQuickPersonScoreV218(points) {
  if (state.isLocked) {
    openPwdModal();
    return false;
  }
  points = Number(points);
  if (!Number.isSafeInteger(points) || points === 0) {
    showToast("请输入非零整数分值");
    return false;
  }
  const selected = allStudentsV218().filter((s) =>
    qpStateV218.selected.has(s.key),
  );
  if (!selected.length) {
    showToast("请先选择学生");
    return false;
  }
  const counts = new Map();
  selected.forEach((s) =>
    counts.set(s.group.id, (counts.get(s.group.id) || 0) + 1),
  );
  let updates;
  try {
    updates = Reliability.planBatchScoreChanges(
      state.groups,
      [...counts],
      points,
    );
  } catch (error) {
    showToast(error.message);
    return false;
  }
  const description =
    "快速按人加分：" +
    selected.length +
    " 人 · " +
    updates
      .map((u) => {
        const name = state.groups.find((g) => g.id === u.id)?.name || "小组";
        return name + " " + (u.delta >= 0 ? "+" : "") + u.delta;
      })
      .join("，");
  cancelScoreAnimationAndSync();
  const ok = runClassroomCommand(description, () => {
    for (const u of updates)
      state.groups.find((g) => g.id === u.id).score = u.score;
    return true;
  });
  if (!ok) return false;
  animateScores(
    updates.map((u) => ({ groupId: u.id, start: u.old, target: u.score })),
  );
  playSound(points > 0 ? "score_add" : "score_sub");
  ClassroomFeedback.score(
    selected.length + " 名学生",
    updates.reduce((sum, u) => sum + u.delta, 0),
  );
  showToast("已为 " + selected.length + " 名学生完成加分");
  return true;
}
function applyQuickPersonCustomV218() {
  const v = Number(document.getElementById("qpCustomScoreV218")?.value);
  if (!Number.isFinite(v) || v === 0) {
    showToast("请输入有效的自定义分值");
    return;
  }
  applyQuickPersonScoreV218(v);
}
/* 插入底栏按钮 */
(function () {
  const right = document.querySelector(".bottom-dock .dock-right");
  if (right && !document.getElementById("quickPersonBtnV218")) {
    const b = document.createElement("button");
    b.id = "quickPersonBtnV218";
    b.className = "icon-btn";
    b.title = "快速按人加分";
    b.textContent = "🤑";
    b.onclick = openQuickPersonScoreV218;
    const hand = [...right.querySelectorAll("button")].find((x) =>
      x.getAttribute("onclick")?.includes("openHandRaise"),
    );
    right.insertBefore(b, hand || right.firstChild);
  }
})();

/* ---------- 4. 道具定义 / 平衡性 ---------- */
Object.assign(ITEM_DEFS, {
  blooper: { ...ITEM_DEFS.blooper, name: "鱿鱿" },
  power: {
    ...ITEM_DEFS.power,
    desc: "持续 3 次答题；每次答题都会消耗 1 次，答对时强制向前提升 1 名，答错则不发动效果。",
  },
  fire_flower: {
    ...ITEM_DEFS.fire_flower,
    desc: "3 发火球；每次随机命中一个其他小组并扣除当前积分的 1/5。",
  },
  ice_flower: {
    ...ITEM_DEFS.ice_flower,
    desc: "3 发冰球；每次随机命中一个其他小组并扣除当前积分的 1/5，同时冻结其主动道具。使用道具会强制解除；若一直不用，3 次答题后自动解除。",
  },
  boomerang_flower: {
    ...ITEM_DEFS.boomerang_flower,
    desc: "3 次回旋镖；每次攻击当前排名紧邻自己的上一组和下一组，各扣当前积分的 1/5。",
  },
});

/* 火 / 冰 / 回旋镖最终行为直接在最外层接管，避免旧版 1/8 / 1/10 残留。 */
