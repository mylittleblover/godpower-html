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

## Lexical leads (74)

|File|Function|Line|Save calls|Command calls|Static classification|
|---|---|---:|---:|---:|---|
|src/application/answer-commands.js|`select`|3|0|1|COMMAND_ENTRY_CANDIDATE|
|src/application/answer-commands.js|`toggleAllIn`|17|0|1|COMMAND_ENTRY_CANDIDATE|
|src/application/answer-commands.js|`batchSelect`|51|0|1|COMMAND_ENTRY_CANDIDATE|
|src/application/answer-commands.js|`batchToggleAllIn`|73|0|1|COMMAND_ENTRY_CANDIDATE|
|src/application/answer-commands.js|`correct`|110|0|1|COMMAND_ENTRY_CANDIDATE|
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
|src/application/round-settlement.js|`start`|75|0|1|COMMAND_ENTRY_CANDIDATE|
|src/application/round-settlement.js|`forceEnd`|143|0|1|COMMAND_ENTRY_CANDIDATE|
|src/core/picker-bridge.js|`command`|50|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`confirmFinalSettlement`|271|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`toggleResizerEnabled`|1482|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`toggleSaveAllIn`|1488|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`updateColumnMode`|1493|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`initResizerDrag:callback@1529`|1529|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`updateAdminPin`|1577|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`nextRound`|1700|0|1|COMMAND_ENTRY_CANDIDATE|
|src/script/00.js|`applySettingsBatchMembers`|1776|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`toggleGroupPreselect`|2390|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`toggleAntiRepeat`|2415|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`resetPickerPool`|2421|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`stopSlotSpin`|2565|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`rewardPickedStudent`|2615|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`applyBatchImport`|2645|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`addGroup`|2698|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`deleteGroup`|2722|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`updateGroupName`|2733|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`updateGroupColor`|2744|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`resetAllScores`|2753|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`updateMasterVolume`|2799|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`startBulletTimer:callback@4197`|4197|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`globalItemDraw:callback@4204`|4204|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`saveItemGroupDetail`|4296|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`judgeHandRaise`|4380|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`handDrawItem`|4388|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`<initialization>:callback@4392:callback@4400`|4400|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`handleItemIconUpload:callback@4412`|4412|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`resetItemIcon`|4413|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`resetAllItemIcons`|4414|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`importItemIconPack:callback@4416`|4416|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`godAddItem`|4445|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`godClearItems`|4446|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`<initialization>:callback@4495:callback@4524`|4524|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`<initialization>:callback@4615:callback@4617`|4617|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`frame`|4654|6|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`<initialization>:callback@4831`|4831|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`<initialization>:callback@4832`|4832|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`<initialization>:callback@4966:callback@4969`|4969|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`repairPersistentItemsV28`|4991|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`<initialization>:callback@5031`|5031|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`godAddItemV283`|5354|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`godAddQueueItemV2120`|5838|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`godClearQueueItemsV2120`|5850|1|0|CALLER_AUDIT_REQUIRED|
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
