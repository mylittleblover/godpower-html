let handEffectSuppressV218 = false;
function scoreSnapshotV218() {
  return new Map(state.groups.map((g) => [g.id, Number(g.score) || 0]));
}
function showHandEffectV218(key, before, note = "") {
  const box = document.getElementById("handEffectCardV218"),
    overlay = document.getElementById("handEffectOverlayV218");
  if (!box || !overlay) return;
  const lines = [];
  state.groups.forEach((g) => {
    const old = before.get(g.id);
    if (old == null) return;
    const now = Number(g.score) || 0,
      delta = now - old;
    if (delta)
      lines.push(
        `<div class="hand-effect-line ${delta > 0 ? "pos" : "neg"}">${escapeHtml(g.name)}：${delta > 0 ? "+" : ""}${delta} 分</div>`,
      );
  });
  if (!lines.length)
    lines.push(
      `<div class="hand-effect-line neutral">${escapeHtml(note || "本次道具未造成直接分数变化")}</div>`,
    );
  box.innerHTML = `<div class="hand-effect-icon">${itemVisual(key)}</div>
    <div class="hand-effect-name">${escapeHtml(ITEM_DEFS[key]?.name || "道具")}</div>
    <div class="hand-effect-lines">${lines.join("")}</div>`;
  overlay.classList.add("active");
  clearTimeout(showHandEffectV218._timer);
  showHandEffectV218._timer = setTimeout(
    () => overlay.classList.remove("active"),
    2200,
  );
}
function handUseOneV218() {
  const g = state.groups.find((x) => x.id === handRaiseGroupId),
    it = g?.inventory?.[0];
  if (!g || !it) {
    showToast("该组当前没有主要道具");
    return;
  }
  const key = it.key,
    before = scoreSnapshotV218();
  // Using from the dock hand panel also plays the full-screen cinematic, the
  // same as the floating window's hand menu.
  globalThis.HandItemCinematic?.mark(g.id);
  const ok = useItem(g.id, 0);
  if (ok !== false) setTimeout(() => showHandEffectV218(key, before), 60);
  renderHandRewardControlsV218();
}
function handUseAllTripleV218() {
  const g = state.groups.find((x) => x.id === handRaiseGroupId),
    it = g?.inventory?.[0];
  if (!g || !it || !TRIPLE_KEYS_V218.has(it.key)) {
    showToast("当前主要道具不是三重道具");
    return;
  }
  const key = it.key,
    before = scoreSnapshotV218();
  let left = Math.min(3, Number(it.charges) || 0);
  handEffectSuppressV218 = true;
  // The first shot of a triple volley drives the cinematic; the rest just fire.
  globalThis.HandItemCinematic?.mark(g.id);
  const fire = () => {
    const live = state.groups.find((x) => x.id === handRaiseGroupId);
    if (!live?.inventory?.[0] || live.inventory[0].key !== key || left <= 0) {
      handEffectSuppressV218 = false;
      showHandEffectV218(key, before, "连发结束");
      renderHandRewardControlsV218();
      return;
    }
    useItem(live.id, 0);
    left--;
    setTimeout(fire, 520);
  };
  fire();
}
function renderHandRewardControlsV218() {
  const box = document.getElementById("handRewardBox");
  const g = state.groups.find((x) => x.id === handRaiseGroupId);
  if (!box || !g) return;
  const main = g.inventory?.[0],
    triple = main && TRIPLE_KEYS_V218.has(main.key) && Number(main.charges) > 1;
  const drawDisabled = !eligibleForItems(g) || g.inventory.length >= 3;
  box.innerHTML = `<div class="hand-rewards">
    <b style="width:100%">回答正确 · 选择奖励</b>
    ${ClassroomFeedback.slotMarkup("hand")}
    <div class="cf-hand-custom"><input id="handCustomScore" type="number" step="1" placeholder="自由增减" aria-label="举手自由分值"><button class="btn btn-primary" onclick="ClassroomFeedback.customHand()">应用</button></div>
    <button class="btn btn-primary" onclick="handDrawItem()" ${drawDisabled ? "disabled" : ""}>🎁 抽取道具</button>
    <button class="btn btn-warning" onclick="handUseOneV218()" ${!main ? "disabled" : ""}>${main ? `使用 1 次：${escapeHtml(ITEM_DEFS[main.key]?.name || "道具")}` : "无主要道具"}</button>
    ${triple ? `<button class="btn btn-danger" onclick="handUseAllTripleV218()">连发剩余 ${main.charges} 次</button>` : ""}
  </div>`;
}
renderHandRewardControlsV214 = renderHandRewardControlsV218;
handUsePrimaryV214 = handUseOneV218;

/* 正确判定后使用新版奖励栏 */
const _v218JudgeHandRaise = judgeHandRaise;
judgeHandRaise = function (correct) {
  const r = _v218JudgeHandRaise.call(this, correct);
  if (correct) setTimeout(renderHandRewardControlsV218, 0);
  return r;
};

/* 抽完道具仍留在手动举手菜单；只保留“完成”，完成也不强制关窗。 */
finishHandItemReward = function () {
  handItemDrawGroupId = null;
  handItemPendingKey = null;
  handItemDrawStartedAt = 0;
  renderHandRewardControlsV218();
};

/* ---------- 8. 道具百科重新排序 + 使用技巧 ---------- */
