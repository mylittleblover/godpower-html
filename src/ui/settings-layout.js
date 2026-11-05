/* Settings navigation and DOM placement only. Existing nodes and their handlers are moved, never cloned. */
const GodPowerSettingsLayout = (() => {
  const categories = [
    ["rules", "battle", "课堂与比赛规则", "沿用现有规则与即时保存方式"],
    ["appearance", "home", "外观与界面", "壁纸、显示模式与视图比例"],
    ["motion", "spark", "动画与特效", "可中断的界面动效，不影响业务结果"],
    [
      "sound",
      "sound",
      "音效与音乐",
      "日常音量在上方，音乐、音效和迁移维护按需展开",
    ],
    ["items", "gift", "道具与图标", "道具流程配置、百科与自定义图片"],
    [
      "students",
      "users",
      "学生与小组管理",
      "名单、分组与头像保存在当前存档，修改后即时保存",
    ],
    ["welcome", "book", "欢迎页内容管理", "完全离线、按自然日稳定轮换"],
    ["data", "shield", "数据与安全", "备份、恢复与防误操作管理口令"],
    ["ai", "spark", "AI 助手", "模型连接与数据发送由教师明确控制"],
    ["about", "book", "关于与帮助", "项目、版本和操作说明"],
  ];
  function organize(sections, shell, { query: $, escape: E }) {
    function group(
      parent,
      id,
      title,
      description,
      nodes,
      collapsed = false,
      danger = false,
    ) {
      const box = document.createElement(collapsed ? "details" : "div");
      box.id = id;
      box.className = collapsed
        ? "ui-settings-disclosure"
        : "ui-settings-group";
      if (danger) box.classList.add("ui-danger-zone");
      box.innerHTML = collapsed
        ? `<summary><b>${E(title)}</b><span>${E(description)}</span></summary><div class="ui-settings-detail-body"></div>`
        : `<h4>${E(title)}</h4><p class="ui-muted">${E(description)}</p><div></div>`;
      const body = box.lastElementChild;
      nodes.filter(Boolean).forEach((node) => body.append(node));
      parent.append(box);
      return box;
    }
    const marked = (name) => [
      ...shell.querySelectorAll(`[data-settings-group="${name}"]`),
    ];
    group(
      sections.rules,
      "uiSettingsRules",
      "课堂行为",
      "沿用原道具开关与 All In 保留规则，修改后即时保存。",
      [$("#settingsV26_function"), ...marked("rules")],
    );
    group(
      sections.appearance,
      "uiSettingsWallpaper",
      "界面壁纸",
      "图片与浅色遮罩保存在本机。",
      marked("wallpaper"),
    );
    // The standalone legacy heading duplicated the new group title.
    $("#uiSettingsWallpaper .setting-section-title")?.remove();
    group(
      sections.appearance,
      "uiSettingsLayout",
      "比赛显示与空间",
      "沿用原分栏、缩放与可拖拽高度垫片，不改变比赛页尺寸。",
      marked("layout"),
    );
    const icons = $("#uiIconManagerV26")?.parentElement;
    if (icons)
      group(
        sections.appearance,
        "uiSettingsButtonIcons",
        "按钮图标自定义",
        "低频维护 · 导航与课堂工具图标",
        [icons],
        true,
      );
    group(
      sections.students,
      "uiSettingsRoster",
      "旧版文本重建（兼容）",
      "危险操作 · 按文本直接重建比赛小组。名单工作区适合日常整理；仅需重建比赛结构时再展开此旧入口。",
      marked("roster"),
      true,
      true,
    );
    const rosterTitle = $(
      "#uiSettingsRoster [data-settings-group='roster']:not(.setting-item)",
    );
    rosterTitle?.remove();
    const sound = $("#settingsV26_sound");

    group(
      sound,
      "uiSettingsVolume",
      "日常音量",
      "主音量控制全部声音，音效音量在主音量基础上单独调整。",
      [...marked("volume"), $("#sfxVolumeRowV2176")],
    );
    group(
      sound,
      "uiSettingsMusic",
      "音乐套与音轨",
      "维护 8 套比赛配乐或菜单配乐 · 展开后选择音乐套",
      marked("music"),
      true,
    );
    group(
      sound,
      "uiSettingsBaseFx",
      "基础操作与欢庆音效",
      "试听、上传及还原各个基础音效",
      marked("basefx"),
      true,
    );
    const itemSounds = $("#itemFxSoundListV26")?.parentElement;
    if (itemSounds)
      group(
        sound,
        "uiSettingsItemFx",
        "道具音效",
        "4 个公共事件 + 28 种道具独立发动音效",
        [itemSounds],
        true,
      );
    // Keep transfer at the end and never promote it into the global header.
    sound.append($("#uiAudioTransfer"));
    const itemLibrary = $("#settingsV26_items");
    group(
      sections.items,
      "uiSettingsItemLibrary",
      "道具百科与自定义图片",
      "28 种实际道具 · 图标包与单项图片维护",
      [itemLibrary],
      true,
    );
    const editor = $("#uiBankEditor");
    const bankNodes = [
      editor.previousElementSibling.previousElementSibling,
      editor.previousElementSibling,
      editor,
      editor.nextElementSibling,
      $("#uiBankStatus"),
    ];
    group(
      sections.welcome,
      "uiSettingsBank",
      "本地题库维护",
      "低频维护 · 编辑、导出或恢复内置示例",
      bankNodes,
      true,
    );
    const data = $("#settingsV26_data");
    group(
      data,
      "uiSettingsBackup",
      "课堂数据备份",
      "换设备或执行危险操作前，先导出课堂 JSON 备份。",
      marked("backup"),
    );
    group(
      data,
      "uiSettingsLock",
      "管理口令",
      "仅用于本机防误操作。",
      marked("lock"),
    );
    group(
      data,
      "uiSettingsDanger",
      "危险操作",
      "积分清零与道具清空 · 操作前请备份",
      [...marked("danger"), $("#clearAllItemsV2172")],
      true,
      true,
    );
  }
  return Object.freeze({
    categories: Object.freeze(categories.map(Object.freeze)),
    organize,
  });
})();
