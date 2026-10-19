/* Answer controls share transaction safety without changing the legacy undo list. */
const AnswerCommands = (() => {
  function select(groupId, opt) {
    if (!state.roundActive || state.evaluated) return;
    const group = state.groups.find((g) => g.id === groupId);
    if (!group) return;
    playSound("ui_click");
    return runClassroomCommand(
      `${group.name} 选择答案`,
      () => {
        group.selectedOpt = group.selectedOpt === opt ? "" : opt;
        return true;
      },
      { recordHistory: false },
    );
  }
  function toggleAllIn(groupId) {
    const group = state.groups.find((g) => g.id === groupId);
    if (
      group &&
      state.roundActive &&
      !state.evaluated &&
      group.itemUsedThisRound
    ) {
      showToast(`${group.name} 本题已经使用过道具，不能再 All In`);
      return false;
    }
    if (!state.roundActive || state.evaluated || !group) return;
    playSound("ui_click");
    const committed = runClassroomCommand(
      `${group.name} 切换 All In`,
      () => {
        group.allIn = !group.allIn;
        return true;
      },
      { recordHistory: false },
    );
    if (!committed) return false;
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
  }

  let generation = 0;
  Reliability.onDefenseInvalidation(() => {
    generation++;
  });
  async function correct(opt) {
    if (!ClassroomWriteBarrier.allow() || state.evaluated) return false;
    const classroom = state,
      groups = state.groups,
      season = state.seasonId;
    const previous = state.correctAns,
      started = state.roundActive,
      revision = generation;
    if (previous !== opt) {
      const unanswered = state.groups.filter((g) => g.selectedOpt === "");
      if (unanswered.length) {
        const names = unanswered.map((g) => g.name).join("、");
        const accepted = await programConfirmV28(
          `仍有 ${unanswered.length} 个小组尚未完成作答：${names}\n现在选定正确答案后，未作答小组将保持“未作答”状态。`,
          {
            title: "作答尚未完成",
            cancelText: "返回检查",
            okText: `继续选择 ${opt}`,
          },
        );
        if (!accepted) return false;
      }
    }
    if (!ClassroomWriteBarrier.allow()) return false;
    if (
      state !== classroom ||
      state.groups !== groups ||
      state.seasonId !== season ||
      state.evaluated ||
      state.correctAns !== previous ||
      state.roundActive !== started ||
      generation !== revision
    ) {
      showToast("课堂状态已变化，请重新选择正确答案。");
      return false;
    }
    const accepted = runClassroomCommand(
      "选择正确答案",
      () => {
        state.correctAns = previous === opt ? "" : opt;
        return true;
      },
      { recordHistory: false },
    );
    if (!accepted) return false;
    const result = await classroomCommands.whenIdle();
    if (!result.ok) return false;
    playSound("ui_click");
    renderControls();
    return true;
  }
  return { select, toggleAllIn, correct };
})();
