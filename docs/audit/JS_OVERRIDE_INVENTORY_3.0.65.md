# JS 覆盖链现状 · 3.0.65

基线bab0792。由全量静态清单导出；捕获别名数不是全局覆盖层数，函数同名包括不同局部作用域。不能将137个同名候选全当成全局重定义。

## 已收敛的关键入口

|入口|定义数量|源码|
|---|---:|---|
|renderAll|1|src/ui/render.js:4|
|renderGrid|1|src/ui/render.js:35|
|saveState|1|src/runtime/storage/classroom-save.js:11|
|useItem|1|src/application/legacy-classroom-adapter.js:258|
|renderAbout|1|src/runtime/ui/settings-and-about.js:49|
|switchView|4|src/runtime/ui/navigation-and-clock.js:38、src/runtime/ui/rank-preview.js:50、src/runtime/ui/settings-and-about.js:144、src/runtime/ui/welcome-score-sync.js:18|
|showItemUseFx|8|src/runtime/audio/item-sound-map.js:130、src/runtime/audio/item-sound-settings.js:59、src/runtime/items/card-effects-legacy.js:144、src/runtime/items/feedback-and-icons.js:1、src/runtime/items/lightning-and-hit-legacy.js:117、src/runtime/items/round-use-lock.js:58、src/runtime/ui/defense-notices.js:30、src/runtime/ui/welcome-score-sync.js:28|
|playSound|3|src/runtime/audio/item-sound-bindings.js:110、src/runtime/audio/item-sound-map.js:82、src/runtime/audio/sound-playback.js:172|
|renderItemWindow|5|src/runtime/items/group-encyclopedia.js:141、src/runtime/items/group-window.js:18、src/runtime/items/queue-adapters.js:75、src/runtime/ui/settings-and-about.js:58、src/runtime/ui/settings-and-about.js:122|

## 仍保留的捕获兼容链

以下全部为需要进一步测试的有效/可能有效调用链，不以版本号判定死亡。每轮选一条由命令、UI或音频owner接管，先证明正常、异常、撤销和生命周期行为，再删兼容层。

|位置|捕获别名|原入口|
|---|---|---|
|src/runtime/audio/draw-audio-lifecycle.js:126|_v2171CancelHandItemDraw|cancelHandItemDraw|
|src/runtime/audio/effects-volume.js:81|_v2176SyncSettingsControls|syncSettingsControls|
|src/runtime/audio/effects-volume.js:96|_v2176RebuildSettingsV26|rebuildSettingsV26|
|src/runtime/audio/effects-volume.js:105|_v2176ShowSettingsV26|showSettingsV26|
|src/runtime/audio/item-sound-bindings.js:109|_v2164PlaySoundBase|playSound|
|src/runtime/audio/item-sound-map.js:81|_v2174PlaySound|playSound|
|src/runtime/audio/item-sound-map.js:129|_v2174ShowItemUseFx|showItemUseFx|
|src/runtime/audio/item-sound-map.js:204|_v2174HandleSoundFileUpload|handleSoundFileUpload|
|src/runtime/audio/item-sound-map.js:215|_v2174DeleteFxTrack|deleteFxTrack|
|src/runtime/audio/item-sound-settings.js:58|_v26ShowItemUseFx|showItemUseFx|
|src/runtime/audio/item-sound-settings.js:64|_v26TinyDefense|tinyDefenseToast|
|src/runtime/classroom/hand-reward-controls.js:97|_v218JudgeHandRaise|judgeHandRaise|
|src/runtime/classroom/student-labels-and-search.js:71|_v218RenderBattleRankPreview|renderBattleRankPreviewV21721|
|src/runtime/items/card-effects-legacy.js:143|_v25ShowItemUseFx|showItemUseFx|
|src/runtime/items/catalog-adapters.js:205|_v283OpenGroupModal|openGroupModal|
|src/runtime/items/catalog-adapters.js:213|_v283RenderGroupModal|renderGroupModal|
|src/runtime/items/draw-session-throttle.js:185|_v21710InstallInfo|installDrawCooldownInfoV2179|
|src/runtime/items/draw-session-throttle.js:194|_v21710ShowSettings|showSettingsV26|
|src/runtime/items/draw-throttle-legacy.js:170|_v2179InstallClearItems|installClearItemsSettingV2172|
|src/runtime/items/drop-uniqueness-and-reset.js:155|_v2172AddItemToGroup|addItemToGroup|
|src/runtime/items/drop-uniqueness-and-reset.js:249|_v2172RebuildSettingsV26|rebuildSettingsV26|
|src/runtime/items/drop-uniqueness-and-reset.js:257|_v2172ShowSettingsV26|showSettingsV26|
|src/runtime/items/feature-switch.js:43|_v291OpenItemWindow|openItemWindow|
|src/runtime/items/first-hand-pool.js:15|_v218ItemDropWeights|itemDropWeights|
|src/runtime/items/first-hand-pool.js:28|_v218PickItem|pickItemForGroupV281|
|src/runtime/items/group-encyclopedia.js:140|_v2182RenderItemWindow|renderItemWindow|
|src/runtime/items/group-encyclopedia.js:149|_v2182AdminAddItem|adminAddItem|
|src/runtime/items/hand-reward-lifecycle.js:23|_v21CloseHandRaise|closeHandRaise|
|src/runtime/items/hand-reward-lifecycle.js:29|_v21SelectHandGroup|selectHandGroup|
|src/runtime/items/hand-reward-lifecycle.js:38|_v21JudgeHandRaise|judgeHandRaise|
|src/runtime/items/lightning-and-hit-legacy.js:116|_v2116ShowItemUseFx|showItemUseFx|
|src/runtime/items/queue-adapters.js:74|_v2120RenderItemWindow|renderItemWindow|
|src/runtime/items/queue-adapters.js:135|_v2120EnhanceItemCards|enhanceItemCards|
|src/runtime/items/queue-adapters.js:184|_v2120HandUseNewItem|handUseNewItem|
|src/runtime/items/round-use-lock.js:57|_v2177ShowItemUseFx|showItemUseFx|
|src/runtime/items/round-use-lock.js:71|_v2177QueueUseState|queueUseStateV2120|
|src/runtime/items/spiny-cooldown.js:20|_v21717SessionRestrictedWeights|sessionRestrictedWeightsV21710|
|src/runtime/items/spiny-cooldown.js:35|_v21717CommitSessionDraw|commitSessionDrawV21710|
|src/runtime/items/spiny-cooldown.js:47|_v21717RefreshCooldownInfo|refreshDrawCooldownInfoV21710|
|src/runtime/items/status-normalization.js:40|_v21731EnsureItemState|ensureItemState|
|src/runtime/items/triple-defense-helpers.js:31|_v218QueueState|queueUseStateV2120|
|src/runtime/picker/classroom-tools.js:100|_v2OpenPicker|openPickerModal|
|src/runtime/ui/attack-reorder-scheduling.js:25|_v21713ApplyLightningHit|applyLightningHitV2116|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:58|_v214JudgeHandRaise|judgeHandRaise|
|src/runtime/ui/battle-order-compat.js:82|_v213Batch|applySettingsBatchMembers|
|src/runtime/ui/defense-notices.js:29|_v21735ShowItemUseFx|showItemUseFx|
|src/runtime/ui/dock-tooltips.js:179|_v2185RenderLockState|renderLockState|
|src/runtime/ui/interface-copy.js:57|_v2187OpenPwdModal|openPwdModal|
|src/runtime/ui/settings-and-about.js:57|_v2RenderItemWindow|renderItemWindow|
|src/runtime/ui/settings-and-about.js:103|_v2Enhance|enhanceItemCards|
|src/runtime/ui/settings-and-about.js:121|_v2RenderItemWindowIcons|renderItemWindow|
|src/runtime/ui/settings-and-about.js:143|_v2SwitchView|switchView|
|src/runtime/ui/welcome-score-sync.js:17|oldSwitchV216|switchView|

优先顺序：showItemUseFx（反馈/音效/一题限制混合）→renderItemWindow（队列/管理/图片/规则混合）→playSound（资源池/路由/生命周期）→switchView（排名/设置/主页混合）。每条都不得直接删除底层有效行为。持久化的iceRoundsLeftV218等字段维持旧档案兼容，本轮只迁移表现层命名。
