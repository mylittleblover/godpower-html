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
    else if (/stopSlotSpin|stopPicker/.test(code)) key = "pick_stop";
    else if (
      /startSlotSpin|pull.*Lever|toggle.*Slot|pullPickerLever/i.test(code) ||
      button.id === "uiPickerLever"
    )
      key = "pick_start";
    else if (/globalItemDraw|drawItem|handDrawItem|DrawForGroup/.test(code))
      key = "draw";
    else if (/useItem|handUseNewItem/.test(code)) key = "use";
    else if (/selectGroupOpt|batchSelectOption|setCorrectAns/.test(code))
      key = "answer";
    else if (/AllIn/.test(code)) key = "allin";
    else if (/startRound/.test(code)) key = "start";
    else if (/evaluateRound/.test(code)) key = "judge";
    else if (/nextRound/.test(code)) key = "next";
    else if (/undoLast|restoreHistory/.test(code)) key = "undo";
    else if (
      /delete|clear|resetAll|resetScores/i.test(code) ||
      /清空|删除/.test(text)
    )
      key = "danger";
    else if (/triggerUpload|Import|import|chooseItemIcon/.test(code))
      key = "upload";
    else if (/export|Export/.test(code)) key = "export";
    else if (/取消/.test(text)) key = "cancel";
    else if (
      /close|dismiss|finishIntro/.test(code) ||
      button.matches(".ui-round-close,.item-close,.ui-cinematic-skip")
    )
      key = "close";
    else if (/open[A-Z]/.test(code)) key = "open";
    else if (/确认|应用|保存|完成/.test(text)) key = "confirm";
    else if (button.closest("#view-settings")) key = "settings";
    return key ? "ui_button_" + key : "ui_click";
  }
  return { slots, isClick, classify };
})();
