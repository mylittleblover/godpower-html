function selectGroupOpt(groupId, opt) {
  return AnswerCommands.select(groupId, opt);
}
function toggleAllInCard(groupId) {
  return AnswerCommands.toggleAllIn(groupId);
}

function setCorrectAns(opt) {
  return AnswerCommands.correct(opt);
}

function settleBaseRoundLegacy() {
  if (!state.roundActive || state.evaluated) return;
  if (!state.correctAns) {
    themeAlert("请先设定正确选项 (A/B/C/D)");
    return;
  }

  const flipSnapshotV21725 = captureCardRectsV21725();

  let allInWins = 0;
  let allInLosses = 0;
  let hasNormalWin = false;
  let hasMilestone = false;
  const milestoneGroups = [];
  const scoreUpdates = [];

  const roundResults = CompetitionRules.calculateRound(state);
  const eventEffectsById = {};
  state.groups.forEach((g, index) => {
    const result = roundResults[index];
    if (result) {
      eventEffectsById[g.id] = {
        baseMultiplier: result.eventBaseMultiplier || 1,
        flatBonus: result.eventFlatBonus || 0,
        consumedStar: !!result.consumedStar,
      };
    }
    g.animState = "";
    g.resultText = result.resultText;
    if (!result.answered) return;
    const oldScore = result.scoreBefore;
    g.score = result.scoreAfter;
    if (result.allIn) {
      if (result.correct) allInWins++;
      else allInLosses++;
    } else if (result.correct) hasNormalWin = true;

    if (oldScore !== g.score) {
      scoreUpdates.push({ groupId: g.id, start: oldScore, target: g.score });
      const oldDigits = Math.floor(Math.abs(oldScore)).toString().length;
      const newDigits = Math.floor(Math.abs(g.score)).toString().length;
      if (newDigits > oldDigits && g.score > oldScore) {
        hasMilestone = true;
        milestoneGroups.push(g.id);
      }
    }
  });

  state.lastRoundAllIn = { wins: allInWins, losses: allInLosses };
  state.evaluated = true;
  return {
    flipSnapshotV21725,
    scoreUpdates,
    allInWins,
    allInLosses,
    hasNormalWin,
    hasMilestone,
    milestoneGroups,
    eventEffectsById,
  };
}
