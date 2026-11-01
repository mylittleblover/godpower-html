/* ===== 封神榜结算后的完整课堂清场 =====
   保留：小组名称、组员、颜色、程序设置、音频/图标自定义、封神榜档案。
   清空：本轮比赛产生的一切状态与统计。 */
function resetCompetitionDataAfterSettlementV21812() {
  cancelScoreAnimationAndSync();
  state.seasonId = StableIdentity.createSeasonId();

  /* 1. 小组本轮数据 */
  state.groups.forEach((g) => {
    g.score = 0;
    g.displayScore = 0;
    g.allIn = false;
    g.selectedOpt = "";
    g.resultText = "";
    g.animState = "";

    g.inventory = [];
    g.itemStats = { correct: 0, wrong: 0, draws: 0, used: 0 };
    g.itemEffect = null;
    g.competitionEffects = {};
    g.booShield = 0;
    g.itemUsedThisRound = false;

    delete g.booRoundsLeftV218;
    delete g.roundItemContinuationKeyV218;
    delete g.__spinyHornDecisionPendingV218;
    delete g.__spinyHornDeclinedV218;
    delete g._pendingItemScoreV21727;
    delete g._displayScoreHoldV21732;
  });

  /* 2. 回合状态 */
  state.roundActive = false;
  state.evaluated = true;
  state.correctAns = "";
  delete state.correctAnswer;
  state.hasStartedOnce = false;
  state.lastRoundAllIn = null;
  if ("roundNo" in state) state.roundNo = 0;

  /* 3. 道具全局状态。
     customIcons 属于用户配置，不属于课堂战绩，所以保留。 */
  const customIcons =
    state.itemGlobal && state.itemGlobal.customIcons
      ? state.itemGlobal.customIcons
      : STORAGE.getJSON("politics_item_icons", {});

  state.itemGlobal = {
    blooperUntil: 0,
    totalDraws: 0,
    pickerHistory: [],
    handRaiseHistory: [],
    handRaiseTotal: 0,
    pkTotal: 0,
    customIcons: customIcons,
    drawThrottleV2179: {
      sequence: 0,
      nextEligible: { lightning: 0, blooper: 0 },
      groupStrongSkip: {},
    },
    drawSessionThrottleV21710: {
      sessionNo: 0,
      nextEligibleSession: { lightning: 0, blooper: 0, spiny: 0 },
      groupStrongSkip: {},
    },
  };

  /* 4. 随机点名 / 抽签去重池 */
  state.picker = state.picker || {};
  state.picker.pickedStudentKeys = [];
  state.picker.pickedGroupIds = [];
  state.picker.preselectedGroupIds = [];

  /* 5. 手动举手与道具抽取中的临时状态 */
  handRaiseGroupId = null;
  if (typeof handItemDrawGroupId !== "undefined") handItemDrawGroupId = null;
  if (typeof handItemPendingKey !== "undefined") handItemPendingKey = null;
  if (typeof handItemDrawStartedAt !== "undefined") handItemDrawStartedAt = 0;
  if (typeof activeDrawSessionV21710 !== "undefined")
    activeDrawSessionV21710 = null;
  if (typeof itemDrawBusy !== "undefined") itemDrawBusy = false;
  if (typeof firstHandDrawPendingV218 !== "undefined")
    firstHandDrawPendingV218 = true;

  /* 6. 随机点名当前结果与槽位 */
  try {
    if (typeof slotEngine !== "undefined") {
      slotEngine.chosenResult = null;
      slotEngine.isSpinning = false;
    }
    if (typeof resetSlotDisplay === "function") resetSlotDisplay();
  } catch (e) {}

  /* 7. 持续效果 / 视觉遮罩 / 定时器 */
  try {
    document.getElementById("squidVeil")?.classList.remove("active");
    document
      .querySelectorAll(".squid-hidden-score")
      .forEach((el) => el.classList.remove("squid-hidden-score"));
  } catch (e) {}

  /* 8. 本轮操作历史也清空，避免结算后还能“撤销回上一届”。 */
  try {
    historyStack = [];
    STORAGE.setJSON(
      typeof V26_HISTORY_KEY !== "undefined"
        ? V26_HISTORY_KEY
        : "politics_history_v26",
      [],
    );
  } catch (e) {}

  /* 9. 确保持久化后的课堂统计也从 0 开始 */
  try {
    STORAGE.setJSON("politics_item_global", state.itemGlobal);
  } catch (e) {}

  /* 10. 界面上的临时窗口状态 */
  if (typeof activeItemGroupId !== "undefined") activeItemGroupId = null;
  if (typeof pickerInfoTab !== "undefined") pickerInfoTab = "history";

  try {
    document.getElementById("itemWindow")?.classList.remove("active");
    document.getElementById("handRaiseBackdrop")?.classList.remove("active");
    document.getElementById("itemDrawOverlay")?.classList.remove("active");
  } catch (e) {}

  /* 再走一次规范化，保证所有必要字段都存在。 */
  ensureV2State();
}
