# 设置页逐项控件清查

基线 `e97933d81c8de792788f9d93a0a385813bb2d2cd`，隔离 Chromium 中读取真实 DOM。原始共 210 个控件记录，最终 218 个（包括新增原生折叠摘要）；所有原有命名控件和实际事件入口逐项核对保留且只出现一次。清单涵盖隐藏分类与折叠内容，不能用默认页面可见按钮数代替功能数量。

本次没有发现可证明重复的业务配置。删除的是共用音频工具栏、旧追加工具栏包装、失效audio分类刷新、设置文案覆写及重复样式；音频、图标、题库、名单和数据命令均保留。低频功能收纳并明确说明用途。

数据证据：artifacts/settings-cleanup/before/inventory.json、after/inventory.json。动态音乐槽位另外逐一切换8套比赛配乐与菜单套验证；道具音效从实际26种定义及4公共事件读取。

|原控件／操作|原分类 → 新分类|处理结果|
|---|---|---|
|exportAudioBundle()|共用页头／导航 → 音频|保留；折叠于 uiAudioTransfer|
|triggerImportAudioBundle()|共用页头／导航 → 音频|保留；折叠于 uiAudioTransfer|
|课堂与比赛规则|共用页头／导航 → 共用页头／导航|保留；常规入口|
|外观与界面|共用页头／导航 → 共用页头／导航|保留；常规入口|
|动画与特效|共用页头／导航 → 共用页头／导航|保留；常规入口|
|音效与音乐|共用页头／导航 → 共用页头／导航|保留；常规入口|
|道具与图标|共用页头／导航 → 共用页头／导航|保留；常规入口|
|学生与小组管理|共用页头／导航 → 共用页头／导航|保留；常规入口|
|欢迎页内容管理|共用页头／导航 → 共用页头／导航|保留；常规入口|
|数据与安全|共用页头／导航 → 共用页头／导航|保留；常规入口|
|onWallpaperFile(this)|课堂规则 → 外观|保留；常规入口|
|resetWallpaper()|课堂规则 → 外观|保留；常规入口|
|cfgWallVeil|课堂规则 → 外观|保留；常规入口|
|cfgSaveAllIn|课堂规则 → 课堂规则|保留；常规入口|
|cfgResizerEnabled|课堂规则 → 外观|保留；常规入口|
|cfgColumnMode|课堂规则 → 外观|保留；常规入口|
|communismModeToggle|课堂规则 → 课堂规则|保留；常规入口|
|zoomOut()|外观 → 外观|保留；常规入口|
|zoomReset()|外观 → 外观|保留；常规入口|
|zoomIn()|外观 → 外观|保留；常规入口|
|uiPref-motion|动效 → 动效|保留；常规入口|
|uiPref-speed|动效 → 动效|保留；常规入口|
|uiPref-pageMotion|动效 → 动效|保留；常规入口|
|uiPref-itemFx|动效 → 动效|保留；常规入口|
|uiPref-systemMotion|动效 → 动效|保留；常规入口|
|cfgMasterVolume|音频 → 音频|保留；常规入口|
|cfgSfxVolumeV2176|音频 → 音频|保留；常规入口|
|cfgSetSelector|音频 → 音频|保留；折叠于 uiSettingsMusic|
|triggerUploadAudio('bgm_set_0_intro_normal')|音频 → 音频|保留；折叠于 uiSettingsMusic|
|triggerUploadAudio('bgm_set_0_intro_win')|音频 → 音频|保留；折叠于 uiSettingsMusic|
|triggerUploadAudio('bgm_set_0_intro_loss')|音频 → 音频|保留；折叠于 uiSettingsMusic|
|triggerUploadAudio('bgm_set_0_thinking')|音频 → 音频|保留；折叠于 uiSettingsMusic|
|triggerUploadAudio('bgm_set_0_battle')|音频 → 音频|保留；折叠于 uiSettingsMusic|
|triggerUploadAudio('bgm_set_0_victory')|音频 → 音频|保留；折叠于 uiSettingsMusic|
|triggerUploadAudio('bgm_set_0_trans_0')|音频 → 音频|保留；折叠于 uiSettingsMusic|
|triggerUploadAudio('bgm_set_0_trans_1')|音频 → 音频|保留；折叠于 uiSettingsMusic|
|triggerUploadAudio('bgm_set_0_trans_2')|音频 → 音频|保留；折叠于 uiSettingsMusic|
|triggerUploadAudio('bgm_set_0_trans_3')|音频 → 音频|保留；折叠于 uiSettingsMusic|
|playSound('score_add')|音频 → 音频|保留；折叠于 uiSettingsBaseFx|
|triggerUploadAudio('fx_score_add')|音频 → 音频|保留；折叠于 uiSettingsBaseFx|
|playSound('score_sub')|音频 → 音频|保留；折叠于 uiSettingsBaseFx|
|triggerUploadAudio('fx_score_sub')|音频 → 音频|保留；折叠于 uiSettingsBaseFx|
|playSound('pk_correct')|音频 → 音频|保留；折叠于 uiSettingsBaseFx|
|triggerUploadAudio('fx_pk_correct')|音频 → 音频|保留；折叠于 uiSettingsBaseFx|
|playSound('allin_win')|音频 → 音频|保留；折叠于 uiSettingsBaseFx|
|triggerUploadAudio('fx_allin_win')|音频 → 音频|保留；折叠于 uiSettingsBaseFx|
|playSound('allin_lose')|音频 → 音频|保留；折叠于 uiSettingsBaseFx|
|triggerUploadAudio('fx_allin_lose')|音频 → 音频|保留；折叠于 uiSettingsBaseFx|
|playSound('big_win')|音频 → 音频|保留；折叠于 uiSettingsBaseFx|
|triggerUploadAudio('fx_big_win')|音频 → 音频|保留；折叠于 uiSettingsBaseFx|
|playSound('rewind')|音频 → 音频|保留；折叠于 uiSettingsBaseFx|
|triggerUploadAudio('fx_rewind')|音频 → 音频|保留；折叠于 uiSettingsBaseFx|
|playSound('ui_click')|音频 → 音频|保留；折叠于 uiSettingsBaseFx|
|triggerUploadAudio('fx_ui_click')|音频 → 音频|保留；折叠于 uiSettingsBaseFx|
|playSound('roll_tick')|音频 → 音频|保留；折叠于 uiSettingsBaseFx|
|triggerUploadAudio('fx_roll_tick')|音频 → 音频|保留；折叠于 uiSettingsBaseFx|
|playSound('roll_loop')|音频 → 音频|保留；折叠于 uiSettingsBaseFx|
|triggerUploadAudio('fx_roll_loop')|音频 → 音频|保留；折叠于 uiSettingsBaseFx|
|playSound('roll_win')|音频 → 音频|保留；折叠于 uiSettingsBaseFx|
|triggerUploadAudio('fx_roll_win')|音频 → 音频|保留；折叠于 uiSettingsBaseFx|
|exportFxBundleV2175()|音频 → 音频|保留；折叠于 uiAudioTransfer|
|playSound('item_draw_start')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_draw_start')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|playSound('item_draw_tick')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_draw_tick')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|playSound('item_draw_reveal')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_draw_reveal')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|playSound('item_defend')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_defend')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|playSound('item_green')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_green')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|playSound('item_triple_green')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_triple_green')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|playSound('item_red')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_red')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|playSound('item_triple_red')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_triple_red')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|playSound('item_spiny')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_spiny')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|playSound('item_banana')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_banana')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|playSound('item_triple_banana')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_triple_banana')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|playSound('item_horn')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_horn')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|playSound('item_bomb')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_bomb')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|playSound('item_hammer')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_hammer')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|playSound('item_coin')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_coin')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|playSound('item_coin_shell')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_coin_shell')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|playSound('item_question')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_question')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|playSound('item_mushroom')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_mushroom')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|playSound('item_triple_mushroom')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_triple_mushroom')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|playSound('item_boo')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_boo')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|playSound('item_blooper')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_blooper')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|playSound('item_lightning')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_lightning')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|playSound('item_star')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_star')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|playSound('item_mega')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_mega')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|playSound('item_bullet')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_bullet')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|playSound('item_power')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_power')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|playSound('item_feather')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_feather')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|playSound('item_fire_flower')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_fire_flower')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|playSound('item_ice_flower')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_ice_flower')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|playSound('item_boomerang_flower')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|triggerUploadAudio('fx_item_boomerang_flower')|音频 → 音频|保留；折叠于 uiSettingsItemFx|
|chooseUiIconV26('nav_welcome')|道具图片 → 外观|保留；折叠于 uiSettingsButtonIcons|
|chooseUiIconV26('nav_battle')|道具图片 → 外观|保留；折叠于 uiSettingsButtonIcons|
|chooseUiIconV26('nav_history')|道具图片 → 外观|保留；折叠于 uiSettingsButtonIcons|
|chooseUiIconV26('nav_archives')|道具图片 → 外观|保留；折叠于 uiSettingsButtonIcons|
|chooseUiIconV26('nav_settings')|道具图片 → 外观|保留；折叠于 uiSettingsButtonIcons|
|chooseUiIconV26('dock_item')|道具图片 → 外观|保留；折叠于 uiSettingsButtonIcons|
|chooseUiIconV26('dock_hand')|道具图片 → 外观|保留；折叠于 uiSettingsButtonIcons|
|chooseUiIconV26('dock_picker')|道具图片 → 外观|保留；折叠于 uiSettingsButtonIcons|
|chooseUiIconV26('dock_about')|道具图片 → 外观|保留；折叠于 uiSettingsButtonIcons|
|chooseUiIconV26('dock_search')|道具图片 → 外观|保留；折叠于 uiSettingsButtonIcons|
|chooseUiIconV26('dock_undo')|道具图片 → 外观|保留；折叠于 uiSettingsButtonIcons|
|chooseUiIconV26('dock_lock')|道具图片 → 外观|保留；折叠于 uiSettingsButtonIcons|
|chooseUiIconV26('dock_add')|道具图片 → 外观|保留；折叠于 uiSettingsButtonIcons|
|chooseUiIconV26('dock_zoomin')|道具图片 → 外观|保留；折叠于 uiSettingsButtonIcons|
|chooseUiIconV26('dock_zoomout')|道具图片 → 外观|保留；折叠于 uiSettingsButtonIcons|
|chooseUiIconV26('dock_zoomreset')|道具图片 → 外观|保留；折叠于 uiSettingsButtonIcons|
|exportItemIconPack()|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|document.getElementById('itemPackInput').click()|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|resetAllItemIcons()|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|chooseItemIcon('green')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|resetItemIcon('green')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|chooseItemIcon('triple_green')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|resetItemIcon('triple_green')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|chooseItemIcon('red')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|resetItemIcon('red')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|chooseItemIcon('triple_red')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|resetItemIcon('triple_red')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|chooseItemIcon('spiny')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|resetItemIcon('spiny')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|chooseItemIcon('banana')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|resetItemIcon('banana')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|chooseItemIcon('triple_banana')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|resetItemIcon('triple_banana')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|chooseItemIcon('horn')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|resetItemIcon('horn')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|chooseItemIcon('bomb')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|resetItemIcon('bomb')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|chooseItemIcon('hammer')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|resetItemIcon('hammer')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|chooseItemIcon('coin')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|resetItemIcon('coin')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|chooseItemIcon('coin_shell')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|resetItemIcon('coin_shell')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|chooseItemIcon('question')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|resetItemIcon('question')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|chooseItemIcon('mushroom')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|resetItemIcon('mushroom')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|chooseItemIcon('triple_mushroom')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|resetItemIcon('triple_mushroom')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|chooseItemIcon('boo')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|resetItemIcon('boo')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|chooseItemIcon('blooper')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|resetItemIcon('blooper')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|chooseItemIcon('lightning')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|resetItemIcon('lightning')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|chooseItemIcon('star')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|resetItemIcon('star')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|chooseItemIcon('mega')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|resetItemIcon('mega')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|chooseItemIcon('bullet')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|resetItemIcon('bullet')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|chooseItemIcon('power')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|resetItemIcon('power')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|chooseItemIcon('feather')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|resetItemIcon('feather')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|chooseItemIcon('fire_flower')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|resetItemIcon('fire_flower')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|chooseItemIcon('ice_flower')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|resetItemIcon('ice_flower')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|chooseItemIcon('boomerang_flower')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|resetItemIcon('boomerang_flower')|道具图片 → 道具图片|保留；折叠于 uiSettingsItemLibrary|
|settingsBatchMemberText|名单 → 名单|保留；常规入口|
|applySettingsBatchMembers()|名单 → 名单|保留；常规入口|
|uiPref-knowledge|欢迎内容 → 欢迎内容|保留；常规入口|
|uiPref-itemTip|欢迎内容 → 欢迎内容|保留；常规入口|
|uiPref-honors|欢迎内容 → 欢迎内容|保留；常规入口|
|uiPref-challenge|欢迎内容 → 欢迎内容|保留；常规入口|
|uiPref-groupCruise|欢迎内容 → 欢迎内容|保留；常规入口|
|uiPref-subject|欢迎内容 → 欢迎内容|保留；常规入口|
|uiBankEditor|欢迎内容 → 欢迎内容|保留；折叠于 uiSettingsBank|
|uiSaveBank|欢迎内容 → 欢迎内容|保留；折叠于 uiSettingsBank|
|uiExportBank|欢迎内容 → 欢迎内容|保留；折叠于 uiSettingsBank|
|uiResetBank|欢迎内容 → 欢迎内容|保留；折叠于 uiSettingsBank|
|newPwdInput|数据安全 → 数据安全|保留；常规入口|
|updateAdminPin()|数据安全 → 数据安全|保留；常规入口|
|exportData()|数据安全 → 数据安全|保留；常规入口|
|triggerImport()|数据安全 → 数据安全|保留；常规入口|
|resetAllScores()|数据安全 → 数据安全|保留；折叠于 uiSettingsDanger|
|clearAllItemsV2172()|数据安全 → 数据安全|保留；折叠于 uiSettingsDanger|
