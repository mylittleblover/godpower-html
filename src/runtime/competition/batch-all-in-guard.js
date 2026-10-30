/* ===== V2.17.8：快速全 ALL 遵守“本题已使用道具”限制 =====
   V2.17.7 只拦截了单组 toggleAllInCard()，但 batchToggleAllIn()
   直接写 g.allIn，自然绕过了判定。现在统一按 itemUsedThisRound 过滤。 */

batchToggleAllIn = function () {
  if (!state.roundActive || state.evaluated) {
    showToast("请先开始答题");
    return;
  }

  playSound("ui_click");

  const locked = state.groups.filter((g) => g.itemUsedThisRound);
  const eligible = state.groups.filter((g) => !g.itemUsedThisRound);

  /* 防止旧状态里“已经用过道具但仍保持 All In”的异常残留。 */
  locked.forEach((g) => {
    g.allIn = false;
  });

  if (!eligible.length) {
    saveState();
    renderGrid();
    renderDashboard();
    refreshAllInMusicAfterItemUseV2177();
    showToast("所有小组本题都已使用过道具，无法快速全 All");
    return;
  }

  /* 只看仍有资格的组来判断当前是不是“全 All”。
     否则只要存在一个锁定组，按钮就永远只能执行“开启”，相当喜剧。 */
  const allEligibleAllIn = eligible.every((g) => g.allIn);
  const targetState = !allEligibleAllIn;

  if (targetState) {
    eligible.forEach((g) => {
      g.allIn = true;
    });
  } else {
    /* 取消时直接取消所有组，语义最明确。 */
    state.groups.forEach((g) => {
      g.allIn = false;
    });
  }

  saveState();
  renderGrid();
  renderDashboard();

  const ratioMet = checkAllInRatio();
  if (ratioMet) {
    if (bgmEngine.state === "THINKING") {
      bgmTransitionThinkingToBattle();
    }
  } else {
    if (bgmEngine.state === "BATTLE" || bgmEngine.state === "TRANSITION") {
      bgmTransitionBattleToThinking();
    }
  }

  if (targetState) {
    if (locked.length) {
      showToast(
        `已快速 All；${locked.length} 个本题已使用道具的小组被自动排除`,
      );
    } else {
      showToast("已全All");
    }
  } else {
    showToast("已取消");
  }
};
