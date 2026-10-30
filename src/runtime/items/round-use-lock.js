/* ===== V2.17.7：答题阶段每组每题只能使用一次道具，且使用后禁止 All In =====
   规则：
   - 仅在 roundActive && !evaluated 的答题阶段生效；
   - 道具“真正成功使用”后才锁定，不把失败尝试算进去；
   - 若本组此前已 All In，成功使用道具时自动取消 All In；
   - 本题后续不能再次 All In，也不能再主动使用第二次道具；
   - 下一题自动重置。 */

function resetRoundItemUseLocksV2177() {
  state.groups.forEach((g) => {
    g.itemUsedThisRound = false;
  });
}

function refreshAllInMusicAfterItemUseV2177() {
  try {
    const ratioMet = checkAllInRatio();
    if (ratioMet) {
      if (bgmEngine.state === "THINKING") bgmTransitionThinkingToBattle();
    } else {
      if (bgmEngine.state === "BATTLE" || bgmEngine.state === "TRANSITION") {
        bgmTransitionBattleToThinking();
      }
    }
  } catch (e) {}
}

function markItemUsedThisRoundV2177(groupId) {
  if (!state.roundActive || state.evaluated) return;

  const g = state.groups.find((x) => x.id === groupId);
  if (!g) return;

  g.itemUsedThisRound = true;

  /* 如果先 All In 后用道具，成功使用道具时撤销 All In。 */
  if (g.allIn) {
    g.allIn = false;
    refreshAllInMusicAfterItemUseV2177();
    showToast(`${g.name} 已使用道具，本题 All In 自动取消`);
  }

  saveState();
  try {
    renderGrid();
  } catch (e) {}
  try {
    renderDashboard();
  } catch (e) {}
  try {
    renderItemWindow();
  } catch (e) {}
}

/* 正常成功发动时由视觉入口落锁；冰冻取消属于例外：虽然道具未消耗，
   但“下一次主动使用”已经被冰冻效果抵消，因此也必须计入本题一次使用机会。 */
const _v2177ShowItemUseFx = showItemUseFx;
showItemUseFx = function (key, casterId, targetText = "") {
  // The command commits rule flags before UI notification.
  return _v2177ShowItemUseFx.call(this, key, casterId, targetText);
};

/* 最外层主动使用守门。无论卡片点击、详情窗口还是举手窗口，最后都会经过这里。 */

/* 使用过道具后，本题不能再开启 All In。 */
/* All In guard is now owned by application/answer-commands.js. */

/* Per-round item locks are reset inside the transactional start command. */

/* 道具窗口里的主道具按钮直接表现为不可用。 */
const _v2177QueueUseState = queueUseStateV2120;
queueUseStateV2120 = function (g, index) {
  const st = _v2177QueueUseState.call(this, g, index);
  if (
    index === 0 &&
    state.roundActive &&
    !state.evaluated &&
    g?.itemUsedThisRound
  ) {
    return { usable: false, label: "本题已使用道具" };
  }
  return st;
};

/* 卡片上的 All In 也直接禁用，而不是非得让用户点击之后才发现。
   顺便给主要道具小格一个视觉锁定状态。 */

/* 兼容旧存档：如果不是答题阶段，不应把上一题的锁永久带到下一次比赛。 */
try {
  if (!state.roundActive || state.evaluated) {
    state.groups.forEach((g) => {
      g.itemUsedThisRound = false;
    });
  } else {
    state.groups.forEach((g) => {
      g.itemUsedThisRound = !!g.itemUsedThisRound;
    });
  }
} catch (e) {}
