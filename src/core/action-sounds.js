/* Stable sound identities describe intent, never business outcomes. */
const ActionSounds = (() => {
  const definitions = [
    ["nav", "页面导航", "导航与窗口", 1040],
    ["open", "打开功能窗口", "导航与窗口", 960],
    ["close", "关闭与返回", "导航与窗口", 760],
    ["expand", "展开与收起", "导航与窗口", 880],
    ["answer", "选择答案", "答题与回合", 1250],
    ["allin", "All In 开关", "答题与回合", 1380],
    ["start", "开始答题", "答题与回合", 1460],
    ["judge", "判定结算", "答题与回合", 1100],
    ["next", "下一题", "答题与回合", 1320],
    ["undo", "撤销与恢复入口", "答题与回合", 680],
    ["draw", "抽取道具", "道具与课堂工具", 1180],
    ["use", "使用道具", "道具与课堂工具", 1420],
    ["pick_start", "开始点名 / 拉杆", "道具与课堂工具", 900],
    ["pick_stop", "停止点名", "道具与课堂工具", 700],
    ["positive", "快捷加分按钮", "道具与课堂工具", 1560],
    ["negative", "快捷扣分按钮", "道具与课堂工具", 600],
    ["confirm", "确认与应用", "设置与数据", 1160],
    ["cancel", "取消操作", "设置与数据", 740],
    ["upload", "上传与导入", "设置与数据", 980],
    ["export", "导出与备份", "设置与数据", 1080],
    ["danger", "删除 / 清空入口", "设置与数据", 520],
    ["settings", "设置分类与配置", "设置与数据", 1020],
  ];
  const slots = definitions.map(([key, name, category, pitch]) => ({
    id: "ui_button_" + key,
    name,
    category,
    pitch,
    desc: "独立按钮音效；未上传时继承通用按钮音效",
  }));
  const isClick = (id) => id === "ui_click" || slots.some((x) => x.id === id);
  const BUTTON_SLOT_RULES = [
    ["pick_stop", /stopSlotSpin|stopPicker/],
    [
      "pick_start",
      /startSlotSpin|pull.*Lever|toggle.*Slot|pullPickerLever/i,
      null,
      (b) => b.id === "uiPickerLever",
    ],
    ["draw", /globalItemDraw|drawItem|handDrawItem|DrawForGroup/],
    ["use", /useItem|handUseNewItem/],
    ["answer", /selectGroupOpt|batchSelectOption|setCorrectAns/],
    ["allin", /AllIn/],
    ["start", /startRound/],
    ["judge", /evaluateRound/],
    ["next", /nextRound/],
    ["undo", /undoLast|restoreHistory/],
    ["danger", /delete|clear|resetAll|resetScores/i, /清空|删除/],
    ["upload", /triggerUpload|Import|import|chooseItemIcon/],
    ["export", /export|Export/],
    ["cancel", null, /取消/],
    [
      "close",
      /close|dismiss|finishIntro/,
      null,
      (b) => b.matches(".ui-round-close,.item-close,.ui-cinematic-skip"),
    ],
    ["open", /open[A-Z]/],
    ["confirm", null, /确认|应用|保存|完成/],
    ["settings", null, null, (b) => Boolean(b.closest("#view-settings"))],
  ];
  function classify(button) {
    const explicit = button.dataset.soundSlot;
    if (explicit && isClick(explicit)) return explicit;
    const code =
        button.getAttribute("onclick") || button.onclick?.toString() || "",
      text = button.textContent.trim();
    let key;
    if (button.matches(".nav-tab")) key = "nav";
    else if (button.id === "btnMainAction")
      key = /判定|结算/.test(text) ? "judge" : "start";
    else if (button.id === "btnSlotTrigger")
      key = /停止/.test(text) ? "pick_stop" : "pick_start";
    else if (button.tagName === "SUMMARY") key = "expand";
    else if (button.dataset.scoreSlot != null)
      key = /^[-−]/.test(text) ? "negative" : "positive";
    else {
      const matched = BUTTON_SLOT_RULES.find(
        ([, codeRe, textRe, pred]) =>
          (codeRe && codeRe.test(code)) ||
          (textRe && textRe.test(text)) ||
          (pred && pred(button)),
      );
      key = matched?.[0];
    }
    return key ? "ui_button_" + key : "ui_click";
  }
  return { slots, isClick, classify };
})();
