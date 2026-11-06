function detectOvertakePunish(actorId, beforeOrder) {
  const actor = state.groups.find((g) => g.id === actorId);
  if (
    !actor ||
    !actor.itemEffect ||
    !["star", "mega"].includes(actor.itemEffect.type)
  )
    return;
  const after = ranking().map((g) => g.id),
    beforeIdx = beforeOrder.indexOf(actorId),
    afterIdx = after.indexOf(actorId);
  if (afterIdx < 0 || beforeIdx < 0 || afterIdx >= beforeIdx) return;
  const passed = beforeOrder
    .slice(afterIdx, beforeIdx)
    .filter((id) => id !== actorId);
  passed.forEach((id) => {
    const t = state.groups.find((g) => g.id === id);
    if (t && eligibleForItems(t) && !tryDefend(t, "normal")) {
      t.score -= roundQuarter(t.score);
      t.displayScore = t.score;
    }
  });
}
/* Deprecated compatibility entry; public item commands own validation and execution. */
function legacyUseItem(groupId, index) {
  return useItem(groupId, index);
}
function flashBomb(id) {
  setTimeout(() => {
    const c = document.querySelector(`.group-row-card[data-group-id="${id}"]`);
    if (c) {
      c.classList.add("effect-bomb");
      setTimeout(() => c.classList.remove("effect-bomb"), 900);
    }
  }, 30);
}

function startBulletTimer() {
  if (bulletTimer) clearInterval(bulletTimer);
  bulletTimer = setInterval(() => {
    let any = false;
    ensureItemState();
    state.groups.forEach((g) => {
      if (!g.itemEffect || g.itemEffect.type !== "bullet") return;
      any = true;
      const t = state.groups.find((x) => x.id === g.itemEffect.targetId);
      if (!t || rankIndex(g.id) < rankIndex(t.id)) {
        const ix = g.inventory.findIndex((x) => x.key === "bullet");
        if (ix >= 0) g.inventory.splice(ix, 1);
        g.itemEffect = null;
        showToast(`${g.name} 的炮弹刺客追击完成`);
        return;
      }
      if (eligibleForItems(g)) {
        g.score += 1;
        g.displayScore = g.score;
      }
    });
    if (!any) {
      clearInterval(bulletTimer);
      bulletTimer = null;
      return;
    }
    saveState();
    renderGrid();
    renderChart();
    renderDashboard();
  }, 350);
}
function startBlooperClock() {
  applyBlooperMask();
  if (state.itemGlobal.blooperUntil > Date.now())
    setTimeout(startBlooperClock, 500);
}
function applyBlooperMask() {
  const on = (state.itemGlobal?.blooperUntil || 0) > Date.now(),
    v = document.getElementById("squidVeil");
  if (v) v.classList.toggle("active", on);
  document
    .querySelectorAll(".row-score,.chart-score,.podium-score,.w-stat-num")
    .forEach((el) => el.classList.toggle("squid-hidden-score", on));
}
