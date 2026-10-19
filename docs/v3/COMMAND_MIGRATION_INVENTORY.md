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

## Lexical leads (80)

|File|Function|Line|Save calls|Command calls|Static classification|
|---|---|---:|---:|---:|---|
|src/application/answer-commands.js|`select`|3|0|1|COMMAND_ENTRY_CANDIDATE|
|src/application/answer-commands.js|`toggleAllIn`|17|0|1|COMMAND_ENTRY_CANDIDATE|
|src/application/history-commands.js|`clear`|3|0|1|COMMAND_ENTRY_CANDIDATE|
|src/application/legacy-classroom-adapter.js|`importClassroomData`|113|1|0|CALLER_AUDIT_REQUIRED|
|src/application/legacy-classroom-adapter.js|`<initialization>:callback@213`|213|1|0|CALLER_AUDIT_REQUIRED|
|src/application/legacy-classroom-adapter.js|`runClassroomCommand`|233|0|1|COMMAND_ENTRY_CANDIDATE|
|src/application/legacy-classroom-adapter.js|`deferClassroomDefense:callback@240`|240|1|0|CALLER_AUDIT_REQUIRED|
|src/application/legacy-classroom-adapter.js|`useItem`|251|0|1|COMMAND_ENTRY_CANDIDATE|
|src/application/legacy-classroom-adapter.js|`judgeRound`|347|0|1|COMMAND_ENTRY_CANDIDATE|
|src/application/manual-score-commands.js|`adjust`|3|0|1|COMMAND_ENTRY_CANDIDATE|
|src/application/manual-score-commands.js|`set`|60|0|1|COMMAND_ENTRY_CANDIDATE|
|src/application/round-settlement.js|`execute`|3|1|0|CALLER_AUDIT_REQUIRED|
|src/core/history.js|`restoreStateFromSnapshot`|44|1|0|CALLER_AUDIT_REQUIRED|
|src/core/history.js|`undoLast`|71|1|0|CALLER_AUDIT_REQUIRED|
|src/core/picker-bridge.js|`command`|50|1|0|CALLER_AUDIT_REQUIRED|
|src/items/round-effects.js|`settle`|3|1|0|CALLER_AUDIT_REQUIRED|
|src/items/round-effects.js|`expire`|36|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`confirmFinalSettlement`|271|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`toggleResizerEnabled`|1494|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`toggleSaveAllIn`|1500|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`updateColumnMode`|1505|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`initResizerDrag:callback@1541`|1541|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`updateAdminPin`|1589|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`finishStartRound`|1670|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`nextRound`|1708|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`forceEndRound`|1770|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`applySettingsBatchMembers`|1791|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`batchSelectOption`|1834|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`batchToggleAllIn`|1849|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`setCorrectAns`|2050|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`settleBaseRoundLegacy`|2074|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`toggleGroupPreselect`|2492|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`toggleAntiRepeat`|2517|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`resetPickerPool`|2523|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`stopSlotSpin`|2667|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`rewardPickedStudent`|2717|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`applyBatchImport`|2747|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`addGroup`|2800|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`deleteGroup`|2824|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`updateGroupName`|2835|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`updateGroupColor`|2846|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`resetAllScores`|2855|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`updateMasterVolume`|2901|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`startBulletTimer:callback@4299`|4299|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`globalItemDraw:callback@4306`|4306|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`saveItemGroupDetail`|4398|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`judgeHandRaise`|4482|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`handDrawItem`|4490|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`<initialization>:callback@4494:callback@4502`|4502|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`handleItemIconUpload:callback@4514`|4514|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`resetItemIcon`|4515|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`resetAllItemIcons`|4516|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`importItemIconPack:callback@4518`|4518|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`godAddItem`|4547|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`godClearItems`|4548|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`<initialization>:callback@4597:callback@4626`|4626|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`<initialization>:callback@4717:callback@4719`|4719|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`frame`|4756|6|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`<initialization>:callback@4933`|4933|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`<initialization>:callback@4934`|4934|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`<initialization>:callback@5068:callback@5071`|5071|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`repairPersistentItemsV28`|5093|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`<initialization>:callback@5151`|5151|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`godAddItemV283`|5474|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`godAddQueueItemV2120`|5958|1|0|CALLER_AUDIT_REQUIRED|
|src/script/00.js|`godClearQueueItemsV2120`|5970|1|0|CALLER_AUDIT_REQUIRED|
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
