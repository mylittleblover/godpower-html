# Classroom command migration map

Generated with node scripts/command-migration-map.mjs. This is a static lead list, not proof of defects or completeness. CALLER_AUDIT_REQUIRED helpers can already run inside an outer command; do not wrap them again without tracing callers. Dynamic aliases and timer/DOM callbacks require manual verification. Existing tests do not authorize default backend cutover by themselves.

## Required order before authority cutover

1. Final archive/new-season reset, import, undo/restore: await durable commit, preserve season idempotency and recovery.
2. Round start/next/correct-answer confirmations: preserve cancellation and current undo boundaries.
3. Draw completion, inventory promotion, bullet/timed effects: serialize generation and callbacks, preserve RNG/tick semantics.
4. Group/member management and batch controls: validate the whole plan, keep one snapshot and command.
5. Settings writes and resource imports: separate domain ownership and await resource transaction completion.
6. Introduce a source mutation/quiescence barrier; verify current source and target again; then switch one domain at a time.

Default legacy authority remains active. The async compatibility controller is verified against an isolated real IndexedDB repository; it has not automatically converted the rows below.

## Lexical leads (79)

|File|Function|Line|Save calls|Command calls|Static classification|
|---|---|---:|---:|---:|---|
|src/application/answer-commands.js|`select`|3|0|1|COMMAND_ENTRY_CANDIDATE|
|src/application/answer-commands.js|`toggleAllIn`|17|0|1|COMMAND_ENTRY_CANDIDATE|
|src/application/answer-commands.js|`correct`|55|0|1|COMMAND_ENTRY_CANDIDATE|
|src/application/history-commands.js|`clear`|3|0|1|COMMAND_ENTRY_CANDIDATE|
|src/application/history-commands.js|`commitRestore`|76|0|1|COMMAND_ENTRY_CANDIDATE|
|src/application/legacy-classroom-adapter.js|`importClassroomData`|113|1|0|CALLER_AUDIT_REQUIRED|
|src/application/legacy-classroom-adapter.js|`<initialization>:callback@213`|213|1|0|CALLER_AUDIT_REQUIRED|
|src/application/legacy-classroom-adapter.js|`runClassroomCommand`|233|0|1|COMMAND_ENTRY_CANDIDATE|
|src/application/legacy-classroom-adapter.js|`deferClassroomDefense:callback@240`|240|1|0|CALLER_AUDIT_REQUIRED|
|src/application/legacy-classroom-adapter.js|`useItem`|251|0|1|COMMAND_ENTRY_CANDIDATE|
|src/application/legacy-classroom-adapter.js|`judgeRound`|347|0|1|COMMAND_ENTRY_CANDIDATE|
|src/application/manual-score-commands.js|`adjust`|3|0|1|COMMAND_ENTRY_CANDIDATE|
|src/application/manual-score-commands.js|`set`|60|0|1|COMMAND_ENTRY_CANDIDATE|
|src/application/round-settlement.js|`execute`|3|1|0|CALLER_AUDIT_REQUIRED|
|src/application/round-settlement.js|`forceEnd`|68|0|1|COMMAND_ENTRY_CANDIDATE|
|src/core/picker-bridge.js|`command`|50|1|0|CALLER_AUDIT_REQUIRED|
|src/items/round-effects.js|`settle`|3|1|0|CALLER_AUDIT_REQUIRED|
|src/items/round-effects.js|`expire`|36|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`confirmFinalSettlement`|271|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`toggleResizerEnabled`|1482|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`toggleSaveAllIn`|1488|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`updateColumnMode`|1493|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`initResizerDrag:callback@1529`|1529|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`updateAdminPin`|1577|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`finishStartRound`|1658|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`nextRound`|1696|0|1|COMMAND_ENTRY_CANDIDATE|
|src/script/00.js|`applySettingsBatchMembers`|1772|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`batchSelectOption`|1815|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`batchToggleAllIn`|1830|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`settleBaseRoundLegacy`|2035|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`toggleGroupPreselect`|2453|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`toggleAntiRepeat`|2478|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`resetPickerPool`|2484|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`stopSlotSpin`|2628|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`rewardPickedStudent`|2678|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`applyBatchImport`|2708|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`addGroup`|2761|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`deleteGroup`|2785|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`updateGroupName`|2796|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`updateGroupColor`|2807|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`resetAllScores`|2816|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`updateMasterVolume`|2862|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`startBulletTimer:callback@4260`|4260|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`globalItemDraw:callback@4267`|4267|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`saveItemGroupDetail`|4359|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`judgeHandRaise`|4443|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`handDrawItem`|4451|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`<initialization>:callback@4455:callback@4463`|4463|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`handleItemIconUpload:callback@4475`|4475|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`resetItemIcon`|4476|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`resetAllItemIcons`|4477|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`importItemIconPack:callback@4479`|4479|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`godAddItem`|4508|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`godClearItems`|4509|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`<initialization>:callback@4558:callback@4587`|4587|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`<initialization>:callback@4678:callback@4680`|4680|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`frame`|4717|6|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`<initialization>:callback@4894`|4894|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`<initialization>:callback@4895`|4895|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`<initialization>:callback@5029:callback@5032`|5032|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`repairPersistentItemsV28`|5054|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`<initialization>:callback@5094`|5094|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`godAddItemV283`|5417|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`godAddQueueItemV2120`|5901|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`godClearQueueItemsV2120`|5913|1|0|CALLER_AUDIT_REQUIRED|
|src/script/01.js|`ensureGroupNumbersV213`|11|1|0|CALLER_AUDIT_REQUIRED|
|src/script/01.js|`<initialization>:callback@56`|56|1|0|CALLER_AUDIT_REQUIRED|
|src/script/07.js|`clearAllItemsV2172`|164|1|0|CALLER_AUDIT_REQUIRED|
|src/script/12.js|`markItemUsedThisRoundV2177`|27|1|0|CALLER_AUDIT_REQUIRED|
|src/script/13.js|`<initialization>:callback@6`|6|2|0|CALLER_AUDIT_REQUIRED|
|src/script/15.js|`beginDrawSessionV21710`|45|1|0|CALLER_AUDIT_REQUIRED|
|src/script/16.js|`frame`|90|2|0|CALLER_AUDIT_REQUIRED|
|src/script/21.js|`repairDuplicateInventoryV21718`|31|1|0|CALLER_AUDIT_REQUIRED|
|src/script/22.js|`repairFlowerChargesV21719`|3|1|0|CALLER_AUDIT_REQUIRED|
|src/script/32.js|`repairAllItemEffectsV21731`|26|1|0|CALLER_AUDIT_REQUIRED|
|src/script/36.js|`<initialization>`|1|1|0|CALLER_AUDIT_REQUIRED|
|src/script/36.js|`applyQuickPersonScoreV218`|169|0|1|COMMAND_ENTRY_CANDIDATE|
|src/script/36.js|`finishOwnItemUseV218`|235|1|0|CALLER_AUDIT_REQUIRED|
|src/ui/round-feedback.js|`afterPowerRound:callback@10:callback@27`|27|1|0|CALLER_AUDIT_REQUIRED|
