/* Basic answer scoring only. Item effects and presentation are separate stages. */
const CompetitionRules = (() => {
  function calculateRound({ groups, correctAns, randomEvents }) {
    if (!Array.isArray(groups)) throw new TypeError("小组数据必须是数组");
    if (!["A", "B", "C", "D"].includes(correctAns))
      throw new Error("请先设定正确选项 (A/B/C/D)");
    return groups.map((group) => {
      const scoreBefore = Number(group.score);
      if (!Number.isSafeInteger(scoreBefore))
        throw new Error("分数超出安全整数范围");
      const answered = !!group.selectedOpt;
      const correct = answered && group.selectedOpt === correctAns;
      const allIn = !!group.allIn;
      const evAdj =
        typeof RandomEvents !== "undefined" &&
        RandomEvents.roundAnswerAdjustment
          ? RandomEvents.roundAnswerAdjustment(randomEvents, group, {
              correct,
              allIn,
            })
          : { baseMultiplier: 1, flatBonus: 0, consumedStar: false };
      let scoreAfter = scoreBefore;
      if (answered)
        scoreAfter = allIn
          ? correct
            ? scoreBefore * 2 + evAdj.flatBonus
            : 0
          : correct
            ? scoreBefore +
              Math.round(2 * evAdj.baseMultiplier) +
              evAdj.flatBonus
            : scoreBefore;
      if (!Number.isSafeInteger(scoreAfter))
        throw new Error("本次计分将超出安全整数范围，请先导出备份并调整积分");
      const eventTag =
        correct && (evAdj.baseMultiplier > 1 || evAdj.flatBonus > 0)
          ? "·事件加成"
          : "";
      return {
        groupId: group.id,
        answered,
        correct,
        allIn,
        scoreBefore,
        scoreAfter,
        delta: scoreAfter - scoreBefore,
        eventBaseMultiplier: evAdj.baseMultiplier,
        eventFlatBonus: evAdj.flatBonus,
        consumedStar: evAdj.consumedStar,
        resultText: !answered
          ? "未作答"
          : allIn
            ? correct
              ? `答对(×2)${eventTag}`
              : "清零"
            : correct
              ? `正确(+${scoreAfter - scoreBefore})${eventTag}`
              : "错误(+0)",
      };
    });
  }
  return { calculateRound };
})();
