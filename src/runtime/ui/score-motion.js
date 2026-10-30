let scoreAnimationEpoch = 0;
function scheduleScoreEffect(fn, delay) {
  const epoch = scoreAnimationEpoch;
  return setTimeout(() => {
    if (epoch === scoreAnimationEpoch) fn();
  }, delay);
}
function cancelItemScoreAnimations() {
  scoreAnimationEpoch++;
  activeScoreRollsV21732.clear();
  document.querySelectorAll(".score-roll-host-v21730").forEach((el) => {
    el.classList.remove("score-roll-host-v21730");
    const g = state.groups.find((g) => String(g.id) === el.id.slice(10));
    if (g) el.textContent = `${g.score}分`;
  });
  clearTimeout(attackRenderTimerV21713);
  attackRenderTimerV21713 = null;
  attackRenderGateV21713 = false;
  pendingRenderArgsV21713 = null;
  clearTimeout(queueItemScoreChangesV21732._timer);
  pendingItemScoreAnimationsV21732.length = 0;
  itemScoreDisplayHoldV21732.clear();
  state.groups.forEach((g) => {
    g.displayScore = g.score;
    const el = document.getElementById(`score-val-${g.id}`);
    if (el) {
      el.classList.remove("score-roll-host-v21730");
      el.textContent = `${g.score}分`;
    }
  });
}

/* ===== V2.17.32：先播放分数变化提示，再更新实际显示分数 =====
   时序：
   道具动画 -> +N/-N 提示 -> 旧分数向上滚走 / 新分数滚入 -> 正式显示新分数。
   真实 score 仍立即结算，只延迟卡片上的 displayScore，避免规则判断被动画影响。
*/

let itemScoreBatchDepthV21732 = 0;
let pendingItemScoreAnimationsV21732 = [];
const ITEM_SCORE_AFTER_FX_DELAY_V21732 = 980;
const ITEM_DELTA_DURATION_V21732 = 1050;
const ITEM_SCORE_ROLL_DURATION_V21732 = 920;
const activeScoreRollsV21732 = new Map();

/* 正在“视觉冻结”的小组：renderGrid 无论被谁调用，都先显示旧分数。 */
const itemScoreDisplayHoldV21732 = new Map();

function snapshotScoresV21732() {
  return new Map(state.groups.map((g) => [String(g.id), Number(g.score) || 0]));
}

function getScoreElementV21732(groupId) {
  return document.getElementById(`score-val-${groupId}`);
}

function applyHeldDisplayScoresV21732() {
  itemScoreDisplayHoldV21732.forEach((old, key) => {
    const g = state.groups.find((x) => String(x.id) === String(key));
    if (g) g.displayScore = old;
  });
}

function showDeltaOnlyV21732(groupId, delta) {
  const scoreEl = getScoreElementV21732(groupId);
  if (!scoreEl || !delta) return;

  scoreEl
    .querySelectorAll(".item-score-delta-v21730")
    .forEach((x) => x.remove());

  const deltaEl = document.createElement("span");
  deltaEl.className = `item-score-delta-v21730 ${delta > 0 ? "gain" : "loss"}`;
  deltaEl.textContent = delta > 0 ? `+${delta}` : `${delta}`;
  scoreEl.appendChild(deltaEl);
  requestAnimationFrame(() => deltaEl.classList.add("play"));

  scheduleScoreEffect(() => {
    if (deltaEl.isConnected) deltaEl.remove();
  }, ITEM_DELTA_DURATION_V21732 + 80);
}

function mountScoreRollV21732(scoreEl, g, session) {
  scoreEl.textContent = `${session.from}分`;
  scoreEl.style.setProperty("--score-text-color", g.color || "#17302D");
  scoreEl.classList.add("score-roll-host-v21730");
  for (const [kind, value] of [
    ["old", session.from],
    ["new", session.to],
  ]) {
    const ghost = document.createElement("span");
    ghost.className = `score-roll-ghost-v21730 score-roll-${kind}-v21730`;
    ghost.textContent = `${value}分`;
    ghost.style.animationDelay = `-${Math.max(0, performance.now() - session.started)}ms`;
    scoreEl.append(ghost);
  }
}
function rollThenCommitScoreV21732(groupId, from, to) {
  const key = String(groupId),
    g = state.groups.find((x) => String(x.id) === key);
  if (!g) {
    itemScoreDisplayHoldV21732.delete(key);
    return;
  }
  const session = { from, to, started: performance.now() };
  activeScoreRollsV21732.set(key, session);
  const el = getScoreElementV21732(groupId);
  if (el) mountScoreRollV21732(el, g, session);
  scheduleScoreEffect(() => {
    if (activeScoreRollsV21732.get(key) !== session) return;
    activeScoreRollsV21732.delete(key);
    itemScoreDisplayHoldV21732.delete(key);
    g.displayScore = g.score;
    const el = getScoreElementV21732(groupId);
    if (el) {
      el.classList.remove("score-roll-host-v21730");
      el.textContent = `${g.score}分`;
    }
    renderChart();
    renderDashboard();
    updateHeaderStats();
    if (typeof renderBattleRankPreviewV21721 === "function")
      renderBattleRankPreviewV21721();
  }, ITEM_SCORE_ROLL_DURATION_V21732 + 40);
}

function queueItemScoreChangesV21732(beforeMap) {
  if (!(beforeMap instanceof Map)) return;
  const p = DesktopUI.getPreferences();
  if (
    p.motion === "off" ||
    (p.systemMotion && matchMedia("(prefers-reduced-motion: reduce)").matches)
  ) {
    state.groups.forEach((g) => (g.displayScore = g.score));
    return;
  }

  const changes = [];
  state.groups.forEach((g) => {
    const old = beforeMap.get(String(g.id));
    if (old === undefined) return;
    const now = Number(g.score) || 0;
    if (now !== old) {
      changes.push({
        groupId: g.id,
        old: itemScoreDisplayHoldV21732.get(String(g.id)) ?? old,
        now,
      });
      activeScoreRollsV21732.delete(String(g.id));
      /* 立即冻结“显示分数”，真实 score 已经是最终值。 */
      itemScoreDisplayHoldV21732.set(String(g.id), old);
      g.displayScore = old;

      const el = getScoreElementV21732(g.id);
      if (el) el.textContent = `${old}分`;
    }
  });
  if (!changes.length) return;

  pendingItemScoreAnimationsV21732.push(...changes);

  /* 同一轮多次命中同一组：保留最早旧值 + 最终新值。 */
  const merged = new Map();
  pendingItemScoreAnimationsV21732.forEach((c) => {
    const key = String(c.groupId);
    if (!merged.has(key)) merged.set(key, { ...c });
    else merged.get(key).now = c.now;
  });
  pendingItemScoreAnimationsV21732 = [...merged.values()];

  clearTimeout(queueItemScoreChangesV21732._timer);
  queueItemScoreChangesV21732._timer = scheduleScoreEffect(() => {
    const batch = pendingItemScoreAnimationsV21732.splice(0);

    batch.forEach((c) => {
      const g = state.groups.find((x) => String(x.id) === String(c.groupId));
      const finalScore = g ? Number(g.score) || 0 : c.now;
      const delta = finalScore - c.old;
      if (!delta) {
        itemScoreDisplayHoldV21732.delete(String(c.groupId));
        if (g) g.displayScore = finalScore;
        return;
      }

      /* 先只显示 +N / -N，卡片分数仍停留在旧值。 */
      showDeltaOnlyV21732(c.groupId, delta);

      /* 提示动画播放结束后，才让数字滚到新值。 */
      scheduleScoreEffect(() => {
        rollThenCommitScoreV21732(c.groupId, c.old, finalScore);
      }, ITEM_DELTA_DURATION_V21732);
    });
  }, ITEM_SCORE_AFTER_FX_DELAY_V21732);
}

/* 道具主入口 */

/* 异步攻击兜底，例如刺龟壳确认后才真正扣分。 */

/* 关键：旧逻辑在道具动画期间可能多次 renderGrid，并把 displayScore 又写成真实 score。
   每次刷新前重新套用视觉冻结值，确保新分数不会提前露出来。 */

/* Restore visual score holds after a grid refresh, including an active roll. */
function restoreHeldScoreElementsV21732() {
  itemScoreDisplayHoldV21732.forEach((old, key) => {
    const el = getScoreElementV21732(key);
    if (el && !el.classList.contains("score-roll-host-v21730")) {
      const session = activeScoreRollsV21732.get(String(key));
      const g = state.groups.find((x) => String(x.id) === String(key));
      if (session && g) mountScoreRollV21732(el, g, session);
      else el.textContent = `${old}分`;
    }
  });
}
