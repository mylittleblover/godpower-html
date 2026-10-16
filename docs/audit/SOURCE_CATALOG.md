# 自动源码目录

由 `npm run audit` 生成。此目录包含旧实现和覆盖层，不能把定义存在视为功能通过。测试覆盖见 TEST_MATRIX.md。

共 681 个命名定义、516 个函数名；23 个字面量存储键、88 个动画名、1689 个 !important。

| 功能／实现 | 位置 | 输入 | 源码返回表达式（截断） | 依赖调用 | 涉及状态字段 | 风险 | 测试结果 |
|---|---|---|---|---|---|---|---|
| readableTextOnColor | src/script/00.js:5 | hex | '#FFFFFF'; luminance>.46?'#17302D':'#FFFFFF' | String, parseInt |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| normalizeGroup | src/script/00.js:109 | raw, index = 0 | {     id,     name: String(source.name ?? 第 ${index + 1} 组).trim() ／／ 第 ${index + 1} 组,     colo | Number, String |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| normalizeAllGroups | src/script/00.js:142 | groups | (Array.isArray(groups) ? groups : []).map((raw, index) => {     const g = normalizeGroup(raw, index); g | normalizeGroup | id, displayScore, score | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| initSessionState | src/script/00.js:153 | 无参数 | DOM／状态副作用；需按调用场景确认 | normalizeAllGroups | roundActive, hasStartedOnce, evaluated, correctAns, editingScoreId, activeModalGroupId, groups, picker, displayScore, score, selectedOpt, allIn, resultText, animState | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| checkAllInRatio | src/script/00.js:199 | 无参数 | false; (count / total) >= (1 / 3) |  | groups, allIn | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getSettlementHistory | src/script/00.js:210 | 无参数 | STORAGE.getJSON('politics_settlement_history', []) |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| saveSettlementRecord | src/script/00.js:214 | record | Reliability.appendArchive(CLASSROOM_STORAGE,record) | buildSettlementClearedDataV21813 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| triggerFinalSettlement | src/script/00.js:220 | 无参数 | void | themeAlert, openPwdModal, String, setTimeout | isLocked | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| closeSettlementNameModal | src/script/00.js:240 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| confirmFinalSettlement | src/script/00.js:245 | 无参数 | {ok:false,reason:'locked'}; {ok:false,reason:'busy'}; {ok:false,reason:'empty'}; archiveResult; resetResult; {ok:true} | openPwdModal, showToast, closeSettlementNameModal, Number, clone, saveSettlementRecord, themeAlert, recordHistory, bgmStopAll, renderControls, playSound, setTimeout, escapeHtml, initConfetti, resetCompetitionDataAfterSettlementV21812, saveState, renderAll | isLocked, groups, score, inventory, itemStats, hasStartedOnce, roundActive, evaluated | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| initConfetti | src/script/00.js:324 | 无参数 | void | requestAnimationFrame, cancelAnimationFrame, loop |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| loop | src/script/00.js:347 | 无参数 | DOM／状态副作用；需按调用场景确认 | requestAnimationFrame |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| stopConfetti | src/script/00.js:368 | 无参数 | DOM／状态副作用；需按调用场景确认 | cancelAnimationFrame |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| closeGrandSettlementModal | src/script/00.js:375 | 无参数 | DOM／状态副作用；需按调用场景确认 | stopConfetti |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| openSettlementHistoryModal | src/script/00.js:380 | 无参数 | DOM／状态副作用；需按调用场景确认 | switchView |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| closeSettlementHistoryModal | src/script/00.js:384 | 无参数 | DOM／状态副作用；需按调用场景确认 | switchView |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderArchiveClassStats | src/script/00.js:388 | 无参数 | void; total + Number(stats.correct ／／ 0) + Number(stats.wrong ／／ 0) | Number | itemGlobal, groups | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderSettlementHistoryList | src/script/00.js:405 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| exportSingleSettlementCSV | src/script/00.js:409 | index | void | getSettlementHistory, showToast | members, name, score | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| exportLatestSettlementCSV | src/script/00.js:430 | 无参数 | void | getSettlementHistory, themeAlert, exportSingleSettlementCSV |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| deleteSettlementRecord | src/script/00.js:439 | index | void; void | themeAlert, openPwdModal, themeConfirm, getSettlementHistory, renderSettlementHistoryList, showToast | isLocked | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| scheduleIdleTask | src/script/00.js:460 | fn, timeout = 1500 | window.requestIdleCallback(fn, { timeout }); window.setTimeout(fn, Math.min(timeout, 800)) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| refreshSoundIdCache | src/script/00.js:467 | 无参数 | new Promise(resolve => {     if (!db) { resolve(soundIdCache); return; }     try {       const tx = ; void | resolve |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| hasSound | src/script/00.js:485 | slotId | soundIdCache.has(slotId) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getSecPerBeat | src/script/00.js:503 | 无参数 | 60 / Math.max(1, effectiveBpm) | Number | bpm | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getSecPerBar | src/script/00.js:509 | 无参数 | getSecPerBeat() * Math.max(1, Number(state.beatsPerBar) ／／ 4) | getSecPerBeat, Number | beatsPerBar | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getTrackCurrentBeat | src/script/00.js:511 | 无参数 | 0; currentSecInTrack / secPerBeat | getSecPerBeat |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| recordHistory | src/script/00.js:529 | actionDesc | void | clone | groups, picker, resizerHeight, correctAns, evaluated, roundActive, hasStartedOnce, lastRoundAllIn | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| restoreStateFromSnapshot | src/script/00.js:549 | snapshot | DOM／状态副作用；需按调用场景确认 | cancelScoreAnimationAndSync, clone, normalizeAllGroups, saveState, renderAll | itemGlobal, groups, displayScore, score, correctAns, evaluated, roundActive, hasStartedOnce, lastRoundAllIn, picker, resizerHeight | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| undoLast | src/script/00.js:565 | 无参数 | void; void | openPwdModal, showToast, restoreStateFromSnapshot, playSound | isLocked | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| openHistoryModal | src/script/00.js:580 | 无参数 | DOM／状态副作用；需按调用场景确认 | switchView |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| closeHistoryModal | src/script/00.js:584 | 无参数 | DOM／状态副作用；需按调用场景确认 | switchView |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderHistoryList | src/script/00.js:588 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| toggleHistExpand | src/script/00.js:592 | index | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| clearHistoryStack | src/script/00.js:598 | 无参数 | void; void | openPwdModal, themeConfirm, renderHistoryList, showToast | isLocked | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| revertToHistory | src/script/00.js:606 | index | void; void | themeAlert, openPwdModal, restoreStateFromSnapshot, playSound, renderHistoryList, showToast | isLocked | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| initDB | src/script/00.js:621 | 无参数 | dbInitPromise; dbInitPromise | refreshSoundIdCache, resolve, scheduleBackgroundAudioInit |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| scheduleBackgroundAudioInit | src/script/00.js:651 | 无参数 | void | scheduleIdleTask, migrateOldDatabases, refreshSoundIdCache, loadFxSounds |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| migrateOldDatabases | src/script/00.js:671 | 无参数 | void | res |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getAudioContext | src/script/00.js:709 | 无参数 | audioCtx | setTimeout, res | masterVolume | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| loadFxSounds | src/script/00.js:733 | 无参数 | void; fxSoundsLoading; fxSoundsLoading | resolve, getAudioContext |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| checkSetCompleteness | src/script/00.js:771 | setIdx | Promise.resolve({ isComplete: false, count: 0, hasCore: false }); {       isComplete: count === trackTypes.length,       count,       hasCore: hasThinking && hasBattl; refreshSoundIdCache().then(doCheck); Promise.resolve(doCheck()) | hasSound, refreshSoundIdCache, doCheck |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getAllCompleteSetIndices | src/script/00.js:805 | 无参数 | completeIndices | checkSetCompleteness |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getFallbackSetIndex | src/script/00.js:814 | 无参数 | i; -1 | checkSetCompleteness |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| pickNextPlayableSetIndex | src/script/00.js:822 | 无参数 | { setIndex: bgmShufflePool.shift(), isFallback: false }; { setIndex: fallbackIdx, isFallback: true }; { setIndex: -1, isFallback: false } | getAllCompleteSetIndices, getFallbackSetIndex |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| fetchAndDecodeSetBuffers | src/script/00.js:844 | setIdx, onProgress | {}; void; {}; buffers; {} | resolve, getAudioContext, onProgress |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| bgmPreloadNextSet | src/script/00.js:902 | 无参数 | void | pickNextPlayableSetIndex, fetchAndDecodeSetBuffers |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| playChiptuneSynth | src/script/00.js:918 | slotId | void | getFxOutputV2176 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| playSound | src/script/00.js:1052 | slotId | DOM／状态副作用；需按调用场景确认 | loadFxSounds, getAudioContext, getFxOutputV2176, playChiptuneSynth |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| clearAllLoopTimeouts | src/script/00.js:1073 | 无参数 | DOM／状态副作用；需按调用场景确认 | clearTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| scheduleDualLoopChunk | src/script/00.js:1078 | startTime, offsetSec | void; void | getSecPerBeat, setTimeout, scheduleDualLoopChunk |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| bgmStartNewRoundMusicWithProgress | src/script/00.js:1121 | onProgress | void | onProgress, getAudioContext, bgmStopAll, pickNextPlayableSetIndex, fetchAndDecodeSetBuffers, checkAllInRatio, scheduleDualLoopChunk, setTimeout, bgmPreloadNextSet | lastRoundAllIn | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| bgmTransitionThinkingToBattle | src/script/00.js:1192 | 无参数 | void | getAudioContext, getSecPerBeat, getTrackCurrentBeat, Number, clearTimeout, setTimeout, checkAllInRatio, bgmTransitionBattleToThinking |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| bgmTransitionBattleToThinking | src/script/00.js:1283 | 无参数 | void | getAudioContext, clearTimeout, getSecPerBeat, getTrackCurrentBeat, getSecPerBar |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| bgmTriggerVictory | src/script/00.js:1322 | callback | void | callback, getAudioContext, getSecPerBeat, getTrackCurrentBeat, clearTimeout, clearAllLoopTimeouts, setTimeout, bgmStopAll |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| bgmStopAll | src/script/00.js:1403 | 无参数 | DOM／状态副作用；需按调用场景确认 | clearAllLoopTimeouts, clearTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| showToast | src/script/00.js:1446 | msg | void | clearTimeout, String, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getPersistableGroups | src/script/00.js:1463 | 无参数 | state.groups.map(g => ({     ...g,     score: Number.isFinite(Number(g.score)) ? Math.trunc(Number(g | Number | groups, score | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| saveState | src/script/00.js:1471 | 无参数 | {ok:false,error:"需要先恢复主存档"}; {ok:true,deferred:true}; result; {...result,legacyMirrorFailures:failed} | showClassroomSaveWarning, ensureV2State, buildClassroomBackup, showToast | picker, itemGlobal, adminPin, masterVolume, sfxVolume, resizerHeight, columnMode, zoomLevel, saveAllIn, resizerEnabled | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| applyZoom | src/script/00.js:1499 | level | DOM／状态副作用；需按调用场景确认 | showToast | zoomLevel | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| zoomIn | src/script/00.js:1507 | 无参数 | DOM／状态副作用；需按调用场景确认 | applyZoom | zoomLevel | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| zoomOut | src/script/00.js:1511 | 无参数 | DOM／状态副作用；需按调用场景确认 | applyZoom | zoomLevel | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| zoomReset | src/script/00.js:1515 | 无参数 | DOM／状态副作用；需按调用场景确认 | applyZoom |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| toggleResizerEnabled | src/script/00.js:1519 | enabled | DOM／状态副作用；需按调用场景确认 | saveState, updateResizerUI | resizerEnabled | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| toggleSaveAllIn | src/script/00.js:1525 | enabled | DOM／状态副作用；需按调用场景确认 | saveState | saveAllIn | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| updateColumnMode | src/script/00.js:1530 | mode | DOM／状态副作用；需按调用场景确认 | saveState, renderGrid | columnMode | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updateResizerUI | src/script/00.js:1536 | 无参数 | void |  | resizerEnabled, resizerHeight | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| initResizerDrag | src/script/00.js:1543 | 无参数 | void; void | saveState, showToast | resizerHeight | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| toggleLock | src/script/00.js:1575 | 无参数 | DOM／状态副作用；需按调用场景确认 | openPwdModal, showToast, renderAll | isLocked | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| openPwdModal | src/script/00.js:1584 | 无参数 | DOM／状态副作用；需按调用场景确认 | setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| closePwdModal | src/script/00.js:1590 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| handlePwdKey | src/script/00.js:1594 | event | DOM／状态副作用；需按调用场景确认 | submitPassword, closePwdModal |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| submitPassword | src/script/00.js:1599 | 无参数 | DOM／状态副作用；需按调用场景确认 | closePwdModal, showToast, renderAll, themeAlert | adminPin, isLocked | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updateAdminPin | src/script/00.js:1614 | 无参数 | void | themeAlert, saveState, showToast | adminPin | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| handleMainAction | src/script/00.js:1626 | 无参数 | DOM／状态副作用；需按调用场景确认 | startRound, judgeRound | roundActive, evaluated | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| preloadInitialAudio | src/script/00.js:1634 | 无参数 | DOM／状态副作用；需按调用场景确认 | getAudioContext, bgmPreloadNextSet |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| startRound | src/script/00.js:1643 | 无参数 | void; void; void | getAudioContext, hasAnyPlayableBgm, setTimeout, res, finishStartRound, showToast, bgmStartNewRoundMusicWithProgress, playSound |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| finishStartRound | src/script/00.js:1694 | 无参数 | DOM／状态副作用；需按调用场景确认 | captureCardRectsV21725, renderAll, animateCardsFromSnapshotV21725, saveState | hasStartedOnce, roundActive, evaluated, correctAns, groups, selectedOpt, allIn, resultText, animState | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| hasAnyPlayableBgm | src/script/00.js:1716 | 无参数 | false; true; fb !== -1; false | initDB, refreshSoundIdCache, getAllCompleteSetIndices, getFallbackSetIndex |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| nextRound | src/script/00.js:1731 | 无参数 | void; void | themeAlert, bgmStopAll, bgmStartNewRoundMusicWithProgress, playSound, captureCardRectsV21725, resetRoundItemUseLocksV2177, checkAllInRatio, bgmTransitionThinkingToBattle, bgmTransitionBattleToThinking, saveState, renderAll, animateCardsFromSnapshotV21725, showToast | evaluated, correctAns, roundActive, groups, selectedOpt, saveAllIn, allIn, resultText, animState | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| forceEndRound | src/script/00.js:1792 | 无参数 | void | themeConfirm, captureCardRectsV21725, bgmStopAll, recordHistory, saveState, renderAll, animateCardsFromSnapshotV21725, showToast | roundActive, evaluated | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applySettingsBatchMembers | src/script/00.js:1812 | 无参数 | void; void | openPwdModal, themeAlert, saveState, renderAll, updatePickerPoolUI, showToast, closeSoundModal | isLocked, groups, name | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| batchSelectOption | src/script/00.js:1855 | opt | void | showToast, playSound, saveState, renderGrid, renderDashboard | roundActive, evaluated, groups, selectedOpt | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| batchToggleAllIn | src/script/00.js:1870 | 无参数 | void | showToast, playSound, saveState, renderGrid, renderDashboard, checkAllInRatio, bgmTransitionThinkingToBattle, bgmTransitionBattleToThinking | roundActive, evaluated, groups, allIn | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| openScoreModal | src/script/00.js:1900 | groupId, event | DOM／状态副作用；需按调用场景确认 | setTimeout | activeModalGroupId, groups, name | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| closeScoreModal | src/script/00.js:1919 | 无参数 | DOM／状态副作用；需按调用场景确认 |  | activeModalGroupId | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| submitModalScore | src/script/00.js:1924 | delta | void | closeScoreModal, applyScoreDelta | activeModalGroupId | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handleModalKey | src/script/00.js:1931 | event | DOM／状态副作用；需按调用场景确认 | submitModalCustomScore, closeScoreModal |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| submitModalCustomScore | src/script/00.js:1940 | 无参数 | void; void; void; void | fail, parseInt, closeScoreModal, applyScoreDelta | activeModalGroupId | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| showMilestoneBanner | src/script/00.js:1963 | groupId | void; void | setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| cancelScoreAnimationAndSync | src/script/00.js:1979 | 无参数 | DOM／状态副作用；需按调用场景确认 | cancelItemScoreAnimations, cancelAnimationFrame | groups, displayScore, score | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| animateScores | src/script/00.js:1988 | scoreUpdates, onComplete | DOM／状态副作用；需按调用场景确认 | cancelAnimationFrame, renderChart, renderDashboard, requestAnimationFrame, updateHeaderStats, onComplete | groups, displayScore, id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| tick | src/script/00.js:1996 | now | DOM／状态副作用；需按调用场景确认 | renderChart, renderDashboard, requestAnimationFrame, updateHeaderStats, onComplete | groups, displayScore, id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyScoreDelta | src/script/00.js:2031 | groupId, delta | void; void; false; void | cancelScoreAnimationAndSync, openPwdModal, showToast, recordHistory, playSound, showMilestoneBanner, saveState, animateScores | isLocked, groups, score, name | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| startDirectScoreEdit | src/script/00.js:2067 | groupId | void | openPwdModal, renderGrid | isLocked, editingScoreId | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handleScoreInputKey | src/script/00.js:2073 | event, groupId | DOM／状态副作用；需按调用场景确认 | finishDirectScoreEdit, renderGrid | editingScoreId | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| finishDirectScoreEdit | src/script/00.js:2081 | groupId | void; false | cancelScoreAnimationAndSync, Number, showToast, recordHistory, playSound, saveState, renderGrid, animateScores | editingScoreId, groups, score, name | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| selectGroupOpt | src/script/00.js:2103 | groupId, opt | void; void | playSound, saveState, renderGrid, renderDashboard | roundActive, evaluated, groups, selectedOpt | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| toggleAllInCard | src/script/00.js:2114 | groupId | void; void | playSound, saveState, renderGrid, renderDashboard, checkAllInRatio, bgmTransitionThinkingToBattle, bgmTransitionBattleToThinking | roundActive, evaluated, groups, allIn | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| setCorrectAns | src/script/00.js:2136 | opt | void; void; void | playSound, renderControls, themeConfirm, saveState | evaluated, correctAns, groups, selectedOpt | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| legacyJudgeRound | src/script/00.js:2160 | 无参数 | void; void; void | themeAlert, captureCardRectsV21725, recordHistory, saveState, renderControls, renderGrid, animateCardsFromSnapshotV21725, setTimeout, animateScores, playSound, showMilestoneBanner, bgmTriggerVictory | roundActive, evaluated, correctAns, groups, animState, selectedOpt, resultText, score, allIn, id, lastRoundAllIn | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| openMemberSearchModal | src/script/00.js:2258 | 无参数 | void | setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| closeMemberSearchModal | src/script/00.js:2269 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| handleMemberSearchKey | src/script/00.js:2274 | event | DOM／状态副作用；需按调用场景确认 | searchMemberGroups, closeMemberSearchModal |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| searchMemberGroups | src/script/00.js:2284 | 无参数 | void; void; void;        <div class="member-search-result">         <div class="member-search-result-name">${escapeHt | String, escapeHtml | groups, members, name | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderAll | src/script/00.js:2325 | 无参数 | DOM／状态副作用；需按调用场景确认 | renderLockStatus, renderControls, renderGrid, updateHeaderStats, renderChart, renderDashboard, updateResizerUI, renderWelcomePage, updateWelcomeTrackIfNeeded |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updateQuickBatchBar | src/script/00.js:2337 | 无参数 | void |  | roundActive, evaluated | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updateHeaderStats | src/script/00.js:2347 | 无参数 | void | escapeHtml | groups, score | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderChart | src/script/00.js:2357 | 无参数 | void; scB - scA | escapeHtml, formatChartScoreV294 | groups, displayScore, score, id, name, color | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderDashboard | src/script/00.js:2425 | 无参数 | void; scB - scA | escapeHtml, getScoreText | groups, displayScore, score, selectedOpt, allIn | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderLockStatus | src/script/00.js:2469 | 无参数 | void |  | isLocked | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderControls | src/script/00.js:2495 | 无参数 | DOM／状态副作用；需按调用场景确认 | updateQuickBatchBar | roundActive, evaluated, correctAns | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderGrid | src/script/00.js:2541 | 无参数 | void; <button class="${cls} ${roundClass}" onclick="selectGroupOpt(${g.id}, '${opt}')" ${state.evaluated  | String, escapeHtml | columnMode, groups, animState, id, color, roundActive, evaluated, selectedOpt, correctAns, displayScore, score, editingScoreId, isLocked, allIn, name, members, resultText | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| openPickerModal | src/script/00.js:2631 | 无参数 | void | updatePickerView, updatePickerPoolUI, resetSlotDisplay |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| closePickerModal | src/script/00.js:2640 | 无参数 | DOM／状态副作用；需按调用场景确认 | stopSlotSpin |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| setPickerMode | src/script/00.js:2647 | mode | void | updatePickerView, updatePickerPoolUI, resetSlotDisplay | picker | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updatePickerView | src/script/00.js:2660 | 无参数 | DOM／状态副作用；需按调用场景确认 | renderTwoTierChips | picker | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderTwoTierChips | src/script/00.js:2677 | 无参数 | void; '<button type="button" class="two-tier-chip ' + (on ? 'active' : '') + '" style="' + style + '" oncl | escapeHtml | picker, groups, members, id, color, name | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| toggleGroupPreselect | src/script/00.js:2689 | gid | void | saveState, renderTwoTierChips, updatePickerPoolUI, resetSlotDisplay | picker | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| resetSlotDisplay | src/script/00.js:2702 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| toggleAntiRepeat | src/script/00.js:2713 | checked | DOM／状态副作用；需按调用场景确认 | saveState, updatePickerPoolUI | picker | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| resetPickerPool | src/script/00.js:2719 | 无参数 | DOM／状态副作用；需按调用场景确认 | saveState, updatePickerPoolUI, showToast | picker | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getAvailablePool | src/script/00.js:2727 | 无参数 | { type: 'groups', list: grps }; { type: 'students', list: students, total: students.length }; { type: 'students', list: filtered, total: students.length }; { type: 'students', list: students, total: students.length }; { type: 'students', list: filtered, total: students.length }; { type: 'students', list: students, total: students.length } |  | picker, groups, id, members | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updatePickerPoolUI | src/script/00.js:2779 | 无参数 | void | getAvailablePool |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| toggleSlotSpin | src/script/00.js:2790 | 无参数 | startSlotSpin(); stopSlotSpin() | startSlotSpin, stopSlotSpin |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| startSlotSpin | src/script/00.js:2795 | 无参数 | void; false | getAvailablePool, themeAlert, getAudioContext, startRollLoop, setInterval | picker, groups, members, id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| stopSlotSpin | src/script/00.js:2861 | 无参数 | void | clearInterval, stopRollLoop, playSound, studentLabelHTMLV218, escapeHtml, saveState, updatePickerPoolUI | picker | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| rewardPickedStudent | src/script/00.js:2904 | points | void; void | cancelScoreAnimationAndSync, recordHistory, saveState, animateScores, playSound, showToast | picker, groups, name, score, id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| openBatchImportModal | src/script/00.js:2923 | 无参数 | void | openPwdModal | isLocked, groups, name, members | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| closeBatchImportModal | src/script/00.js:2930 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| applyBatchImport | src/script/00.js:2934 | 无参数 | void | closeBatchImportModal, saveState, renderGrid, updatePickerPoolUI, showToast | groups, name | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| exportData | src/script/00.js:2961 | 无参数 | DOM／状态副作用；需按调用场景确认 | buildClassroomBackup, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| triggerImport | src/script/00.js:2967 | 无参数 | void | openPwdModal | isLocked | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handleFileImport | src/script/00.js:2972 | event | void; void | themeAlert, importClassroomData, showToast |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| addGroup | src/script/00.js:2987 | 无参数 | void | openPwdModal, recordHistory, playSound, saveState, renderAll | isLocked, groups | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| deleteGroup | src/script/00.js:3010 | groupId | void | openPwdModal, themeConfirm, recordHistory, saveState, renderAll | isLocked, groups | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updateGroupName | src/script/00.js:3021 | groupId, newName | void; void | saveState, updateHeaderStats, renderChart, renderDashboard | isLocked, groups, name | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updateGroupColor | src/script/00.js:3032 | groupId, newColor | void; void | saveState, renderAll | isLocked, groups, color | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| resetAllScores | src/script/00.js:3041 | 无参数 | void | cancelScoreAnimationAndSync, openPwdModal, themeConfirm, recordHistory, animateScores, playSound, saveState | isLocked, groups, id, score, displayScore, resultText, animState | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| openSoundSettings | src/script/00.js:3060 | 无参数 | void | themeAlert, openPwdModal, syncSettingsControls, renderBgmSlotList, renderFxSlotList, renderBgmEngineConsole, switchView | isLocked | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| closeSoundModal | src/script/00.js:3073 | 无参数 | DOM／状态副作用；需按调用场景确认 | switchView |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| syncSettingsControls | src/script/00.js:3077 | 无参数 | DOM／状态副作用；需按调用场景确认 |  | resizerEnabled, saveAllIn, columnMode, masterVolume, groups, name, members | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updateMasterVolume | src/script/00.js:3087 | vol | DOM／状态副作用；需按调用场景确认 | parseFloat, saveState | masterVolume | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderBgmSlotList | src/script/00.js:3096 | 无参数 | void; void | parseInt, Number, refreshSoundIdCache, checkSetCompleteness, hasSound |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderFxSlotList | src/script/00.js:3150 | 无参数 | void |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| previewBgmTrack | src/script/00.js:3173 | slotId | void | getAudioContext |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| triggerUploadAudio | src/script/00.js:3194 | slotId | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| handleSoundFileUpload | src/script/00.js:3199 | event | void | getAudioContext, showToast, renderBgmSlotList, renderFxSlotList, themeAlert |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| deleteBgmTrack | src/script/00.js:3236 | slotId | void | showToast, renderBgmSlotList |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| deleteFxTrack | src/script/00.js:3250 | idbKey, fxKey | void | showToast, renderFxSlotList |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| exportAudioBundle | src/script/00.js:3263 | 无参数 | void; void | showToast, resolve, themeAlert |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| triggerImportAudioBundle | src/script/00.js:3312 | 无参数 | void | openPwdModal | isLocked | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handleBundleFilePicked | src/script/00.js:3317 | event | void; void | showToast, themeAlert, refreshSoundIdCache, loadFxSounds, renderBgmSlotList, renderFxSlotList |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| escapeHtml | src/script/00.js:3361 | str | String(str ?? '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, " | String |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| ensureAudioUnlocked | src/script/00.js:3375 | 无参数 | Promise.resolve(); getAudioContext().then(() => { audioUnlocked = true; }).catch(() => { audioUnlocked = false; }) | getAudioContext |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| switchView | src/script/00.js:3380 | name | DOM／状态副作用；需按调用场景确认 | ensureAudioUnlocked, renderWelcomePage, updateWelcomeTrackIfNeeded, renderHistoryList, renderSettlementHistoryList, syncSettingsControls, renderBgmSlotList, renderFxSlotList, renderBgmEngineConsole, menuFadeOut, renderAll, bgmStopAll, getMenuTrackKeyForView, menuStartOrSwitch |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| enterBattleFromWelcome | src/script/00.js:3408 | 无参数 | DOM／状态副作用；需按调用场景确认 | switchView |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getMenuTrackKeyForView | src/script/00.js:3412 | name | getWelcomeTrackKey(); 'aux_history'; 'aux_archives'; 'aux_settings'; null | getWelcomeTrackKey |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getWelcomeTrackKey | src/script/00.js:3420 | 无参数 | 'welcome_' + digits | Number, String | groups, score | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| startWelcomeClock | src/script/00.js:3430 | 无参数 | void | updateWelcomeClock, setInterval |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updateWelcomeClock | src/script/00.js:3436 | 无参数 | DOM／状态副作用；需按调用场景确认 | String |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderWelcomePage | src/script/00.js:3454 | 无参数 | void | Number, escapeHtml, getScore, String, setText | groups, score | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| saveMenuCfg | src/script/00.js:3531 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| midiToFreq | src/script/00.js:3534 | m | 440 * Math.pow(2, (m - 69) / 12) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| mulberry32 | src/script/00.js:3536 | seed | function() {     a ／= 0; a = a + 0x6D2B79F5 ／ 0;     let t = Math.imul(a ^ a >>> 15, 1 ／ a);     t =; ((t ^ t >>> 14) >>> 0) / 4294967296 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| buildMenuPattern | src/script/00.js:3550 | key, bars | MENU_PATTERN_CACHE[cacheKey]; MENU_PATTERN_CACHE[cacheKey] | Number, mulberry32, rnd |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getNoiseBuffer | src/script/00.js:3588 | 无参数 | null; noiseBuffer; noiseBuffer |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuSecPerBeat | src/script/00.js:3622 | 无参数 | 60 / Math.max(40, Number(menuCfg.bpm) ／／ 130) | Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuLoopSpan | src/script/00.js:3624 | 无参数 | {     startBeat,     endBeat,     startSec: (startBeat - 1) * menuSecPerBeat(),     endSec: (endBeat | Number, menuSecPerBeat |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| normalizeWelcomeLoopBuffer | src/script/00.js:3639 | key, buf | buf; buf; fixed; buf | menuLoopSpan, menuSecPerBeat |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuEnsureGraph | src/script/00.js:3659 | 无参数 | false; true |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| makeSynthMenuBuffer | src/script/00.js:3670 | key | offline.startRendering() | Number, buildMenuPattern, midiToFreq | gain, connect | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuLoadBuffer | src/script/00.js:3730 | key | menuBgm.buffers[key]; menuLoading[key]; buf; await p | res, normalizeWelcomeLoopBuffer, makeSynthMenuBuffer |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuLoopParams | src/script/00.js:3761 | buf, key | { startSec, endSec }; { startSec: 0, endSec: buf.duration } | menuLoopSpan |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuTrimFor | src/script/00.js:3771 | key | Math.max(0, Math.min(3, Number.isFinite(t) ? t : 1)) | Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuPosForKey | src/script/00.js:3777 | key, buf, t | elapsed; Math.min(elapsed, Math.max(0, buf.duration - 0.02)); lp.startSec + ((elapsed - lp.startSec) % dur) | menuLoopParams |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuVoiceGainAt | src/script/00.js:3786 | v, t | r.v0; r.v1; r.v0 + (r.v1 - r.v0) * ((t - r.t0) / (r.t1 - r.t0)) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuVoiceRamp | src/script/00.js:3794 | v, target, dur | DOM／状态副作用；需按调用场景确认 | menuVoiceGainAt | cancelScheduledValues, setValueAtTime, linearRampToValueAtTime | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuSpawnVoice | src/script/00.js:3804 | key, buf, startAt | v | menuLoopParams, menuPosForKey |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuRetireVoice | src/script/00.js:3829 | v, fadeSec | void | menuVoiceRamp |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuSwitchNow | src/script/00.js:3841 | key, buf | DOM／状态副作用；需按调用场景确认 | menuRetireVoice, menuTrimFor, menuVoiceGainAt, menuVoiceRamp, menuSpawnVoice |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuStartOrSwitch | src/script/00.js:3864 | key | void; void; void; void; void; void | ensureAudioUnlocked, menuEnsureGraph, menuLoadBuffer, menuSwitchNow |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuFadeOut | src/script/00.js:3882 | 无参数 | void | menuPosForKey, menuRetireVoice |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuStop | src/script/00.js:3896 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuResyncGrid | src/script/00.js:3909 | 无参数 | void; void; void | menuLoopParams, menuRetireVoice, menuVoiceRamp, menuSpawnVoice, menuTrimFor |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuScheduleReload | src/script/00.js:3924 | 无参数 | void; void | clearTimeout, setTimeout, menuLoadBuffer, menuRetireVoice, menuVoiceRamp, menuSpawnVoice, menuTrimFor |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updateWelcomeTrackIfNeeded | src/script/00.js:3942 | 无参数 | void | getWelcomeTrackKey, menuStartOrSwitch |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderBgmEngineConsole | src/script/00.js:3949 | 无参数 | void | Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuEnabledChange | src/script/00.js:4003 | v | DOM／状态副作用；需按调用场景确认 | saveMenuCfg, menuStop, menuStartOrSwitch, getMenuTrackKeyForView |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuBpmChange | src/script/00.js:4008 | v | DOM／状态副作用；需按调用场景确认 | Number, saveMenuCfg, menuScheduleReload |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuMeterChange | src/script/00.js:4013 | v | DOM／状态副作用；需按调用场景确认 | Number, saveMenuCfg, menuResyncGrid |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuLoopChange | src/script/00.js:4017 | field, v | DOM／状态副作用；需按调用场景确认 | Number, saveMenuCfg, menuResyncGrid |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuTrimChange | src/script/00.js:4021 | k, v | DOM／状态副作用；需按调用场景确认 | Number, saveMenuCfg, menuVoiceRamp, menuTrimFor |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| battleBpmChange | src/script/00.js:4028 | which, v | DOM／状态副作用；需按调用场景确认 | Number, saveMenuCfg |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| makeRollLoopBuffer | src/script/00.js:4038 | 无参数 | null; buf |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| startRollLoop | src/script/00.js:4058 | 无参数 | void; void | makeRollLoopBuffer, getFxOutputV2176 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| stopRollLoop | src/script/00.js:4076 | cb | void | cb, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| uiDbOpen | src/script/00.js:4096 | 无参数 | uiDbPromise; uiDbPromise | res |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| uiDbReq | src/script/00.js:4111 | mode, fn | null; new Promise(res => {     try {       const tx = d.transaction('kv', mode);       const req = fn(tx.o | uiDbOpen, fn, res |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getWallVeil | src/script/00.js:4125 | 无参数 | Number.isFinite(v) ? Math.max(0, Math.min(0.8, v)) : 0.35 | Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyWallpaperVeil | src/script/00.js:4129 | 无参数 | DOM／状态副作用；需按调用场景确认 | getWallVeil |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyWallpaper | src/script/00.js:4138 | blob | DOM／状态副作用；需按调用场景确认 | applyWallpaperVeil |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| compressWallpaper | src/script/00.js:4151 | file | new Promise(res => canvas.toBlob(b => res(b), 'image/jpeg', 0.85)) | createImageBitmap, res, rej |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| onWallpaperFile | src/script/00.js:4177 | input | void; void | showToast, compressWallpaper, uiDbReq, applyWallpaper |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| resetWallpaper | src/script/00.js:4193 | 无参数 | DOM／状态副作用；需按调用场景确认 | uiDbReq, applyWallpaper, showToast |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| changeWallpaperVeil | src/script/00.js:4198 | v | DOM／状态副作用；需按调用场景确认 | Number, applyWallpaperVeil |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| initWallpaper | src/script/00.js:4202 | 无参数 | DOM／状态副作用；需按调用场景确认 | uiDbReq, applyWallpaper |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| normalizeInventoryV21718 | src/script/00.js:4328 | inventory | (Array.isArray(inventory)?inventory:[])     .slice(0,3)     .filter(it=>{       const key=it&&it.key; false; true; {         key:it.key,         /* V2.17.19：重进页面后严格保留 1/2/3 的剩余次数，            不会重置成 3，也不会因为定义加载顺序被判为异常 | Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| ensureItemState | src/script/00.js:4353 | 无参数 | DOM／状态副作用；需按调用场景确认 | normalizeInventoryV21718 | groups, inventory, itemStats, itemEffect, booShield, itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| ranking | src/script/00.js:4365 | 无参数 | state.groups.slice().sort((a,b)=>(Number(b.score)／／0)-(Number(a.score)／／0)／／state.groups.indexOf(a)- | Number | groups | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| rankIndex | src/script/00.js:4366 | id | ranking().findIndex(g=>g.id===id) | ranking | id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| roundQuarter | src/script/00.js:4367 | v | Math.round((Number(v)／／0)/4) | Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| roundThird | src/script/00.js:4368 | v | Math.round((Number(v)／／0)/3) | Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| roundHalf | src/script/00.js:4369 | v | Math.round((Number(v)／／0)/2) | Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| eligibleForItems | src/script/00.js:4370 | g | g && Number(g.score)>=0 | Number | score | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| consumeInventoryItem | src/script/00.js:4371 | g, index, amount=1 | void |  | inventory | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| addItemToGroup | src/script/00.js:4372 | g, key | false; true | eligibleForItems | inventory, itemStats, itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| tinyDefenseToast | src/script/00.js:4373 | msg | DOM／状态副作用；需按调用场景确认 | setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| defenseCandidates | src/script/00.js:4375 | g, attackType | -1; 1; -1; 1; (a.at／／0)-(b.at／／0); out |  | itemEffect, booShield, inventory | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| tryDefend | src/script/00.js:4390 | g, attackType | true; true; true; true; true; false | eligibleForItems, Number, tinyDefenseToast, defenseCandidates, consumeInventoryItem | itemEffect, name, inventory, booShield, __spinyMushroomDeclinedV21727 | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyItemScore | src/script/00.js:4418 | target, delta, sourceId, attackType='normal' | {changed:false,blocked:'negative'}; {changed:false,blocked:'defense'}; {changed:before!==target.score,before,after:target.score} | eligibleForItems, tryDefend, Number |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| damageFraction | src/script/00.js:4423 | target, denom, sourceId, type='normal' | applyItemScore(target,-loss,sourceId,type) | roundHalf, roundThird, roundQuarter, applyItemScore |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| boostFraction | src/script/00.js:4424 | target, denom=4 | false; true | eligibleForItems, roundQuarter |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| itemDropWeights | src/script/00.js:4426 | pos, total | W | put |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| weightedPick | src/script/00.js:4516 | weights | k; arr[0]?.[0]／／'coin' |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| drawItemForGroup | src/script/00.js:4517 | g | null; weightedPick(itemDropWeights(pos,r.length)) | eligibleForItems, ranking, weightedPick, itemDropWeights | inventory, id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| detectOvertakePunish | src/script/00.js:4519 | actorId, beforeOrder | void; void | ranking, eligibleForItems, tryDefend, roundQuarter | groups, id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| legacyUseItem | src/script/00.js:4525 | groupId, index | void; void; void; void; void; void; void | ensureItemState, closeItemWindowForFx, eligibleForItems, showToast, ranking, recordHistory, other, damageFraction, flashBomb, boostFraction, consumeInventoryItem, saveState, renderAll, startBlooperClock, applyLightningHitV2116, detectOvertakePunish, Number | groups, inventory, id, itemEffect, name, score, displayScore, booShield, itemStats, itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| flashBomb | src/script/00.js:4601 | id | DOM／状态副作用；需按调用场景确认 | setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| startBulletTimer | src/script/00.js:4603 | 无参数 | void; void | clearInterval, setInterval, ensureItemState, rankIndex, showToast, eligibleForItems, saveState, renderGrid, renderChart, renderDashboard | groups, itemEffect, id, inventory, name, score, displayScore | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| startBlooperClock | src/script/00.js:4604 | 无参数 | DOM／状态副作用；需按调用场景确认 | applyBlooperMask, setTimeout | itemGlobal | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyBlooperMask | src/script/00.js:4605 | 无参数 | DOM／状态副作用；需按调用场景确认 |  | itemGlobal | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| globalItemDraw | src/script/00.js:4607 | 无参数 | void; void | ensureItemState, eligibleForItems, showToast, recordHistory, escapeHtml, setInterval, itemVisual, setTimeout, clearInterval, drawItemForGroup, addItemToGroup, saveState, renderAll | groups, inventory, id, name | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| openItemWindow | src/script/00.js:4613 | groupId, tab='detail' | DOM／状态副作用；需按调用场景确认 | ensureItemState, renderItemWindow |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| closeItemWindow | src/script/00.js:4614 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| switchItemTab | src/script/00.js:4615 | tab | DOM／状态副作用；需按调用场景确认 | renderItemWindow |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderItemWindow | src/script/00.js:4616 | 无参数 | closeItemWindow(); '<div class="item-big empty"><div class="item-big-icon">＋</div><div class="item-big-name">空道具槽</div>; <div class="item-big"><div class="item-big-icon">${itemVisual(it.key)}</div><div class="item-big-na | closeItemWindow, ensureGroupNumbersV213, String, Number, escapeHtml, eligibleForItems, itemVisual | groups, name, isLocked, itemStats, itemEffect, booShield, score, groupNo, color, id, members, inventory | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| previewItemDetailColor | src/script/00.js:4695 | value | DOM／状态副作用；需按调用场景确认 |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| saveItemDetailColor | src/script/00.js:4696 | id, value | void; void | renderItemWindow, updateGroupColor | isLocked | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| saveItemGroupDetail | src/script/00.js:4702 | id | void; void; void; void; void | openPwdModal, showToast, Number, recordHistory, saveState, renderAll, updatePickerPoolUI, renderItemWindow | isLocked, groups, name, groupNo, members | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| deleteItemDetailGroup | src/script/00.js:4719 | id | void | openPwdModal, deleteGroup, closeItemWindow, renderItemWindow | isLocked, groups, id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| itemQuickScore | src/script/00.js:4728 | id, d | void | openPwdModal, applyScoreDelta, renderItemWindow | isLocked | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| itemCustomScore | src/script/00.js:4729 | id | void | Number, itemQuickScore |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| enhanceItemCards | src/script/00.js:4731 | 无参数 | void; it?<div class="item-slot" title="${ITEM_DEFS[it.key].name}">${itemVisual(it.key)}${it.charges>1?<s | ensureItemState, itemVisual, openItemWindow, applyBlooperMask | groups, id, inventory, itemEffect, booShield | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderGrid | src/script/00.js:4732 | 无参数 | DOM／状态副作用；需按调用场景确认 | _itemBaseRenderGrid, enhanceItemCards |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| legacyJudgeRound | src/script/00.js:4734 | 无参数 | false; void | ranking, _itemBaseJudgeRound, eligibleForItems, detectOvertakePunish, saveState, renderAll | roundActive, evaluated, correctAns, id, groups, selectedOpt, itemStats, itemEffect, score, displayScore, inventory | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| restoreStateFromSnapshot | src/script/00.js:4739 | snapshot | DOM／状态副作用；需按调用场景确认 | _itemBaseRestore, ensureItemState, clone, startBulletTimer, startBlooperClock, renderAll | itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| recordHistory | src/script/00.js:4740 | desc | void | _itemBaseRecord, clone | itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| ensureV2State | src/script/00.js:4747 | 无参数 | DOM／状态副作用；需按调用场景确认 | ensureItemState | itemGlobal | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| itemVisual | src/script/00.js:4757 | key, cls='' | src?<img class="${cls}" src="${escapeHtml(src)}" alt="${escapeHtml(d.name)}">:d.icon | ensureV2State, escapeHtml | itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| itemBoxVisualV2121 | src/script/00.js:4763 | cls='' | BUILTIN_ITEM_BOX_V2121?<img class="${cls}" src="${BUILTIN_ITEM_BOX_V2121}" alt="道具箱">:'❔' |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| setPickerInfoTab | src/script/00.js:4766 | tab | DOM／状态副作用；需按调用场景确认 | renderPickerInfo |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderPickerInfo | src/script/00.js:4767 | 无参数 | void | ensureV2State, escapeHtml | groups, itemStats, itemGlobal | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| openPickerModal | src/script/00.js:4776 | 无参数 | DOM／状态副作用；需按调用场景确认 | ensureV2State, _v2OpenPicker, setPickerInfoTab, syncPickerScoreTarget |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| syncPickerScoreTarget | src/script/00.js:4777 | 无参数 | void; void | escapeHtml | picker, name, score | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| pickerTargetGroup | src/script/00.js:4778 | 无参数 | null; state.picker.mode==='group'?w:w.group |  | picker | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| scorePickerTarget | src/script/00.js:4779 | n | void | pickerTargetGroup, showToast, applyScoreDelta, syncPickerScoreTarget | id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| scorePickerCustom | src/script/00.js:4780 | 无参数 | void | Number, scorePickerTarget |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| stopSlotSpin | src/script/00.js:4781 | 无参数 | DOM／状态副作用；需按调用场景确认 | _v2StopSlot, ensureV2State, saveState, syncPickerScoreTarget, renderPickerInfo | picker, name, itemGlobal | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| openHandRaise | src/script/00.js:4784 | 无参数 | DOM／状态副作用；需按调用场景确认 | ensureV2State, renderHandRaise |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| closeHandRaise | src/script/00.js:4785 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderHandRaise | src/script/00.js:4786 | 无参数 | void | escapeHtml | groups, id, name, score | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| selectHandGroup | src/script/00.js:4787 | id | DOM／状态副作用；需按调用场景确认 | renderHandRaise | groups, id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| judgeHandRaise | src/script/00.js:4788 | correct | void; void | ensureV2State, showToast, recordHistory, saveState, renderAll | groups, name, itemStats, itemGlobal, id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handQuickScore | src/script/00.js:4795 | n | DOM／状态副作用；需按调用场景确认 | applyScoreDelta |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handDrawItem | src/script/00.js:4796 | 无参数 | void; void | eligibleForItems, showToast, recordHistory, drawItemForGroup, addItemToGroup, saveState, renderAll | groups, inventory, name | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handUseItem | src/script/00.js:4797 | 无参数 | void | showToast, closeHandRaise, openItemWindow | groups, inventory, id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| globalItemDraw | src/script/00.js:4800 | 无参数 | void; void; void; void | ensureV2State, eligibleForItems, showToast, switchView, recordHistory, renderGrid, setInterval, ranking, weightedPick, itemDropWeights, itemVisual, setTimeout, clearInterval, drawItemForGroup, addItemToGroup, saveState, renderAll | groups, inventory, id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| openItemEncyclopedia | src/script/00.js:4814 | 无参数 | DOM／状态副作用；需按调用场景确认 | switchView, setTimeout, installSettingsTabs, showSettingsV2 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderItemEncyclopedia | src/script/00.js:4815 | 无参数 | void; <div class="ency-card"><div class="ency-icon">${itemVisual(k)}</div><div><div class="ency-name">${d | ensureV2State, itemVisual |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| chooseItemIcon | src/script/00.js:4819 | k | DOM／状态副作用；需按调用场景确认 |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handleItemIconUpload | src/script/00.js:4820 | e | void | ensureV2State, saveState, renderItemEncyclopedia, renderAll, showToast | itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| resetItemIcon | src/script/00.js:4821 | k | DOM／状态副作用；需按调用场景确认 | ensureV2State, saveState, renderItemEncyclopedia, renderAll | itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| resetAllItemIcons | src/script/00.js:4822 | 无参数 | DOM／状态副作用；需按调用场景确认 | ensureV2State, saveState, renderItemEncyclopedia, renderAll | itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| exportItemIconPack | src/script/00.js:4823 | 无参数 | DOM／状态副作用；需按调用场景确认 | ensureV2State, setTimeout | itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| importItemIconPack | src/script/00.js:4824 | e | void | ensureV2State, saveState, renderItemEncyclopedia, renderAll, showToast, themeAlert | itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| installSettingsTabs | src/script/00.js:4827 | 无参数 | void | renderItemEncyclopedia |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| showSettingsV2 | src/script/00.js:4833 | which | DOM／状态副作用；需按调用场景确认 | installSettingsTabs, renderItemEncyclopedia |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| openAbout | src/script/00.js:4842 | 无参数 | DOM／状态副作用；需按调用场景确认 | renderAbout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| closeAbout | src/script/00.js:4843 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderAbout | src/script/00.js:4844 | tab | DOM／状态副作用；需按调用场景确认 | itemVisual |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderItemWindow | src/script/00.js:4852 | 无参数 | void | _v2RenderItemWindow, itemVisual | groups, isLocked, id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| godAddItem | src/script/00.js:4853 | id, k | void; void | showToast, recordHistory, saveState, renderAll, renderItemWindow | groups, inventory, name | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| godClearItems | src/script/00.js:4854 | id | void | recordHistory, saveState, renderAll, renderItemWindow | groups, name, inventory, itemEffect, booShield | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| enhanceItemCards | src/script/00.js:4857 | 无参数 | void | _v2Enhance, ensureV2State, itemVisual | groups, id, inventory, itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderItemWindow | src/script/00.js:4858 | 无参数 | void | _v2RenderItemWindowIcons, itemVisual | groups, inventory | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| legacyJudgeRound | src/script/00.js:4861 | 无参数 | DOM／状态副作用；需按调用场景确认 | _v2Judge, ensureV2State, saveState | roundActive, evaluated, itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| switchView | src/script/00.js:4866 | name | DOM／状态副作用；需按调用场景确认 | _v2SwitchView, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| cancelHandItemDraw | src/script/00.js:4873 | silent=false | DOM／状态副作用；需按调用场景确认 | clearInterval, clearTimeout, showToast |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| closeHandRaise | src/script/00.js:4882 | 无参数 | DOM／状态副作用；需按调用场景确认 | cancelHandItemDraw, _v21CloseHandRaise |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| selectHandGroup | src/script/00.js:4885 | id | void | showToast, _v21SelectHandGroup |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| judgeHandRaise | src/script/00.js:4891 | correct | DOM／状态副作用；需按调用场景确认 | cancelHandItemDraw, _v21JudgeHandRaise, eligibleForItems | groups, inventory, score | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handDrawItem | src/script/00.js:4904 | 无参数 | void; void; void; void; void; void; void | ensureV2State, eligibleForItems, showToast, escapeHtml, ranking, weightedPick, itemDropWeights, itemVisual, tick, setInterval, setTimeout, clearInterval, cancelHandItemDraw, renderHandRaise, recordHistory, addItemToGroup, saveState, renderAll | groups, inventory, id, name, itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| finishHandItemReward | src/script/00.js:4959 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handUseNewItem | src/script/00.js:4965 | 无参数 | void; void | showToast, closeHandRaise, openItemWindow, setTimeout | groups, inventory, id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| showItemUseFx | src/script/00.js:4982 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| itemFxTargetText | src/script/00.js:4983 | key, gid | ['coin','mushroom','triple_mushroom','star','mega','bullet','power'].includes(key)?'作用于本组':''; '目标：'+names.join('、') | ranking, add | id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| closeItemWindowForFx | src/script/00.js:4996 | 无参数 | DOM／状态副作用；需按调用场景确认 | closeItemWindow |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| legacyUseItem | src/script/00.js:5001 | groupId, index, ...rest | result | closeItemWindowForFx, setTimeout, showItemUseFx, itemFxTargetText | groups, inventory, itemEffect, score | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| normalizeItemIconFile | src/script/00.js:5019 | file, done | DOM／状态副作用；需按调用场景确认 | done |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handleItemIconUpload | src/script/00.js:5038 | e | void | normalizeItemIconFile, ensureV2State, saveState, renderItemEncyclopedia, renderAll, showToast | itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| updateCardRouletteVisual | src/script/00.js:5048 | o, key | void | itemVisual |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| globalItemDraw | src/script/00.js:5060 | 无参数 | void; void; void; void | ensureV2State, eligibleForItems, showToast, switchView, recordHistory, renderGrid, ranking, weightedPick, itemDropWeights, updateCardRouletteVisual, requestAnimationFrame, addItemToGroup, saveState, setTimeout, renderAll | groups, inventory, id, itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| frame | src/script/00.js:5077 | now | void | ranking, weightedPick, itemDropWeights, updateCardRouletteVisual, requestAnimationFrame, addItemToGroup, saveState, setTimeout, renderAll | id, itemGlobal | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| handDrawItem | src/script/00.js:5114 | 无参数 | void; void; void; void; void; void; void; void; void | ensureV2State, eligibleForItems, showToast, escapeHtml, ranking, weightedPick, itemDropWeights, itemVisual, requestAnimationFrame, cancelHandItemDraw, renderHandRaise, recordHistory, addItemToGroup, saveState, renderAll | groups, inventory, id, name, itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| frame | src/script/00.js:5132 | now | void; void; void; void; void | ranking, weightedPick, itemDropWeights, itemVisual, requestAnimationFrame, eligibleForItems, cancelHandItemDraw, showToast, renderHandRaise, recordHistory, addItemToGroup, saveState, renderAll, escapeHtml | groups, itemGlobal | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| cancelHandItemDraw | src/script/00.js:5164 | silent=false | DOM／状态副作用；需按调用场景确认 | clearTimeout, showToast |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| battleCard | src/script/00.js:5190 | id | document.querySelector(#view-battle .group-row-card[data-group-id="${id}"])／／document.querySelecto |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| clearCardFx | src/script/00.js:5191 | card | void |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| playCasterCardFx | src/script/00.js:5197 | key, gid | void; void | battleCard, clearCardFx, itemVisual, escapeHtml, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| playTargetCardFx | src/script/00.js:5207 | id, key, type='hit' | void; void | battleCard, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| cardFxTargets | src/script/00.js:5216 | key, gid | ids | ranking, add | id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| showItemUseFx | src/script/00.js:5230 | key, casterId=null, targetText='' | _v25ShowItemUseFx(key,casterId,targetText) | playCasterCardFx, cardFxTargets, setTimeout, playTargetCardFx, _v25ShowItemUseFx |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| persistHistoryV26 | src/script/00.js:5247 | 无参数 | void |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| recordHistory | src/script/00.js:5256 | desc | void | _v26RecordHistory, persistHistoryV26 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| undoLast | src/script/00.js:5259 | 无参数 | r | _v26Undo, persistHistoryV26, saveState |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| rollbackToHistory | src/script/00.js:5260 | i | r | _v26Rollback, persistHistoryV26, saveState |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| removeBgmEngineeringConsoleV26 | src/script/00.js:5268 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderItemFxSoundListV26 | src/script/00.js:5287 | 无参数 | void; <div class="sound-row"><div class="sound-desc"><div class="sound-name">${s.name}</div><div class="s | hasSound |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| itemSoundCategoryV26 | src/script/00.js:5294 | k | 'item_attack'; 'item_buff'; 'item_steal'; 'item_status' |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| showItemUseFx | src/script/00.js:5301 | k, g, t | _v26ShowItemUseFx(k,g,t) | playSound, setTimeout, itemSoundCategoryV26, _v26ShowItemUseFx |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| tinyDefenseToast | src/script/00.js:5303 | m | _v26TinyDefense(m) | playSound, _v26TinyDefense |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| startDrawSoundBedV26 | src/script/00.js:5304 | ms=3600 | DOM／状态副作用；需按调用场景确认 | playSound, setInterval, clearInterval, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| globalItemDraw | src/script/00.js:5309 | 无参数 | _v26GlobalDraw() | startDrawSoundBedV26, _v26GlobalDraw |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handDrawItem | src/script/00.js:5310 | 无参数 | _v26HandDraw() | startDrawSoundBedV26, _v26HandDraw |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| uiIconsV26 | src/script/00.js:5323 | 无参数 | STORAGE.getJSON('politics_ui_icons_v26',{})／／{} |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyUiIconsV26 | src/script/00.js:5324 | 无参数 | void | uiIconsV26, escapeHtml |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| chooseUiIconV26 | src/script/00.js:5340 | id | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| handleUiIconV26 | src/script/00.js:5341 | e | void | normalizeItemIconFile, uiIconsV26, applyUiIconsV26, renderUiIconManagerV26 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| resetUiIconV26 | src/script/00.js:5345 | id | DOM／状态副作用；需按调用场景确认 | uiIconsV26, applyUiIconsV26, renderUiIconManagerV26 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderUiIconManagerV26 | src/script/00.js:5346 | 无参数 | void | uiIconsV26 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| rebuildSettingsV26 | src/script/00.js:5352 | 无参数 | void | removeBgmEngineeringConsoleV26, installCommunismModeSetting, renderUiIconManagerV26, renderItemEncyclopedia, renderItemFxSoundListV26, showSettingsV26 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| showSettingsV26 | src/script/00.js:5378 | which | void | renderBgmSlotList, renderFxSlotList, renderItemFxSoundListV26, renderItemEncyclopedia, installCommunismModeSetting, renderUiIconManagerV26 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| installSettingsTabs | src/script/00.js:5388 | 无参数 | DOM／状态副作用；需按调用场景确认 | rebuildSettingsV26 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| showSettingsV2 | src/script/00.js:5389 | which | DOM／状态副作用；需按调用场景确认 | showSettingsV26 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| syncVisualViewportV27 | src/script/00.js:5400 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| repairPersistentItemsV28 | src/script/00.js:5417 | 无参数 | DOM／状态副作用；需按调用场景确认 | ensureItemState, normalizeInventoryV21718, saveState | groups, inventory | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| programConfirmV28 | src/script/00.js:5427 | message, opts={} | new Promise(resolve=>{     document.getElementById('programConfirmV28')?.remove();     programConfir; void; void | escapeHtml, resolve, finish |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| setCorrectAns | src/script/00.js:5454 | opt | void; void; void | playSound, renderControls, programConfirmV28 | evaluated, correctAns, groups, selectedOpt, name | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| heldItemKeysV281 | src/script/00.js:5484 | g | new Set((g?.inventory／／[]).map(it=>it?.key).filter(Boolean)) |  | inventory | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| weightedPickNoRepeatV281 | src/script/00.js:5487 | weights, blocked=new Set() | weightedPick(filtered); null | Number, weightedPick |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| pickItemForGroupV281 | src/script/00.js:5496 | g, batchUsed=new Set() | k | ranking, itemDropWeights, heldItemKeysV281, weightedPickNoRepeatV281, weightedPick | id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| globalItemDraw | src/script/00.js:5511 | 无参数 | void; void; void; void | ensureV2State, eligibleForItems, showToast, switchView, recordHistory, renderGrid, pickItemForGroupV281, updateCardRouletteVisual, requestAnimationFrame, addItemToGroup, saveState, setTimeout, renderAll | groups, inventory, id, itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| frame | src/script/00.js:5528 | now | void | pickItemForGroupV281, updateCardRouletteVisual, requestAnimationFrame, addItemToGroup, saveState, setTimeout, renderAll | id, itemGlobal | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| handDrawItem | src/script/00.js:5570 | 无参数 | void; void; void; void; void; void; void; void; void | ensureV2State, eligibleForItems, showToast, escapeHtml, pickItemForGroupV281, itemVisual, requestAnimationFrame, cancelHandItemDraw, renderHandRaise, recordHistory, addItemToGroup, saveState, renderAll | groups, inventory, id, name, itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| frame | src/script/00.js:5586 | now | void; void; void; void; void | pickItemForGroupV281, itemVisual, requestAnimationFrame, eligibleForItems, cancelHandItemDraw, showToast, renderHandRaise, recordHistory, addItemToGroup, saveState, renderAll, escapeHtml | groups, itemGlobal | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| v282RandomOther | src/script/00.js:5637 | caster | arr.length?arr[Math.floor(Math.random()*arr.length)]:null | Number | groups, id, score | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| v282TakeFraction | src/script/00.js:5641 | target, frac, key, caster | false; true; applyItemAttack(caster,target,amount,key); true | Number, applyItemAttack |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| v282Consume | src/script/00.js:5651 | g, index | void | Number | inventory | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| legacyUseItem | src/script/00.js:5659 | groupId, index, ...rest | _v282UseItem.call(this,groupId,index,...rest); false; true; false; true; false; true; false; true | Number, showToast, recordHistory, saveState, renderAll, showItemUseFx, v282RandomOther, v282TakeFraction, v282Consume, ranking | groups, inventory, score, name, itemEffect, id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| roulettePreviewPickV282 | src/script/00.js:5701 | 无参数 | keys[Math.floor(Math.random()*keys.length)] |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updateAllRoulettePreviewLogicV282 | src/script/00.js:5705 | 无参数 | roulettePreviewPickV282() | roulettePreviewPickV282 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| globalItemDraw | src/script/00.js:5711 | 无参数 | void; void; void; void | ensureV2State, eligibleForItems, showToast, switchView, recordHistory, renderGrid, updateCardRouletteVisual, roulettePreviewPickV282, requestAnimationFrame, pickItemForGroupV281, addItemToGroup, saveState, setTimeout, renderAll | groups, inventory, id, itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| frame | src/script/00.js:5727 | now | void | updateCardRouletteVisual, roulettePreviewPickV282, requestAnimationFrame, pickItemForGroupV281, addItemToGroup, saveState, setTimeout, renderAll | id, itemGlobal | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| handDrawItem | src/script/00.js:5760 | 无参数 | void; void; void; void; void; void; void; void | ensureV2State, eligibleForItems, showToast, escapeHtml, roulettePreviewPickV282, itemVisual, requestAnimationFrame, cancelHandItemDraw, renderHandRaise, pickItemForGroupV281, recordHistory, addItemToGroup, saveState, renderAll | groups, inventory, id, name, itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| frame | src/script/00.js:5774 | now | void; void; void; void | roulettePreviewPickV282, itemVisual, requestAnimationFrame, eligibleForItems, cancelHandItemDraw, showToast, renderHandRaise, pickItemForGroupV281, recordHistory, addItemToGroup, saveState, renderAll, escapeHtml | groups, itemGlobal | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| legacyUseItem | src/script/00.js:5805 | groupId, index, ...rest | false; _v282UseItemWithIce.call(this,groupId,index,...rest) | closeItemWindowForFx, saveState, renderAll, showToast | groups, itemEffect, name | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| itemKeysV283 | src/script/00.js:5830 | 无参数 | ITEM_ORDER_V283.filter(k=>ITEM_DEFS[k]) |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| itemAdminButtonV283 | src/script/00.js:5832 | k, gid | <button class="btn item-admin-add-v283" onclick="godAddItemV283(${gid},'${k}')">${itemVisual(k)} <s | itemVisual, escapeHtml |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| godAddItemV283 | src/script/00.js:5836 | gid, key | void; void; void | showToast, Number, recordHistory, addItemToGroup, saveState, renderAll, renderGroupModalV283 | groups, inventory, score, name | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderGodItemManagerV283 | src/script/00.js:5845 | gid | void; void | itemKeysV283, itemAdminButtonV283 | groups | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| patchVisibleGodManagerV283 | src/script/00.js:5858 | gid | void | itemKeysV283, itemAdminButtonV283 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderEncyclopediaV283 | src/script/00.js:5870 | 无参数 | void; void; <div class="guide-block encyclopedia-item"><b>${itemVisual(k)} ${escapeHtml(d.name)}</b><br>${escap | itemKeysV283, itemVisual, escapeHtml |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| appendMissingEncyclopediaV283 | src/script/00.js:5899 | 无参数 | void; void | itemVisual, escapeHtml |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| patchItemIconSettingsV283 | src/script/00.js:5916 | 无参数 | void; void; void | itemVisual, escapeHtml |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderGroupModalV283 | src/script/00.js:5934 | gid | DOM／状态副作用；需按调用场景确认 | setTimeout, patchVisibleGodManagerV283 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| openGroupModal | src/script/00.js:5939 | gid, ...a | r | renderGroupModalV283 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderGroupModal | src/script/00.js:5943 | ...a | r | renderGroupModalV283 | activeModalGroupId | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| openAboutModal | src/script/00.js:5948 | ...a | r | setTimeout, appendMissingEncyclopediaV283 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| refresh26ItemInterfacesV284 | src/script/00.js:5956 | 无参数 | DOM／状态副作用；需按调用场景确认 | renderItemEncyclopedia, renderItemWindow |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| appendMissingEncyclopediaV283 | src/script/00.js:5974 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| patchItemIconSettingsV283 | src/script/00.js:5975 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| patchVisibleGodManagerV283 | src/script/00.js:5978 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderGroupModalV283 | src/script/00.js:5979 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderAbout | src/script/00.js:5985 | tab | void; r | _v284RenderAbout, itemVisual, escapeHtml |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| isCommunismMode | src/script/00.js:6010 | 无参数 | STORAGE.getJSON(COMMUNISM_MODE_KEY,true)!==false |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| setCommunismMode | src/script/00.js:6013 | enabled | DOM／状态副作用；需按调用场景确认 | applyCommunismMode, showToast |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyCommunismMode | src/script/00.js:6018 | 无参数 | DOM／状态副作用；需按调用场景确认 | isCommunismMode |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| globalItemDraw | src/script/00.js:6043 | ...a | void; _v291GlobalItemDraw.apply(this,a) | isCommunismMode, showToast |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| legacyUseItem | src/script/00.js:6048 | ...a | false; _v291UseItem.apply(this,a) | isCommunismMode, showToast |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| openItemWindow | src/script/00.js:6054 | ...a | void; _v291OpenItemWindow.apply(this,a) | isCommunismMode, showToast |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| installCommunismModeSetting | src/script/00.js:6061 | 无参数 | void | isCommunismMode |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| formatChartScoreV294 | src/script/00.js:6090 | value | String(Math.trunc(n)); sign+(v>=100 ? Math.round(v) : v.toFixed(v>=10?1:2).replace(/\.?0+$/,''))+'亿'; sign+(v>=100 ? Math.round(v) : v.toFixed(v>=10?1:2).replace(/\.?0+$/,''))+'万' | Number, String |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| activePersistentEffect | src/script/00.js:6117 | g | null; { key:type, def }; null |  | itemEffect | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| legacyUseItem | src/script/00.js:6127 | groupId, index, ...rest | previousUseItemV299.call(this, groupId, index, ...rest); false; previousUseItemV299.call(this, groupId, index, ...rest) | ensureItemState, activePersistentEffect, closeItemWindowForFx, showToast | groups, inventory | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| cleanEmptyEffectV2113 | src/script/00.js:6168 | g | void |  | itemEffect | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| consumeChargeV2113 | src/script/00.js:6176 | g, index | void | Number | inventory | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| randomTargetV2113 | src/script/00.js:6183 | g | pool.length ? pool[Math.floor(Math.random()*pool.length)] : null | eligibleForItems | groups, id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| attackFractionV2113 | src/script/00.js:6188 | caster, target, denom, key | {changed:false,blocked:'invalid'}; {changed:false,blocked:null}; applyItemScore(target,-amount,caster.id,key) | eligibleForItems, Number, applyItemScore |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| legacyUseItem | src/script/00.js:6195 | groupId, index, ...rest | previousUseItemV2113.call(this,groupId,index,...rest); false; false; false; false; false; false; false; true | closeItemWindowForFx, isCommunismMode, showToast, eligibleForItems, cleanEmptyEffectV2113, saveState, renderAll, randomTargetV2113, attackFractionV2113, consumeChargeV2113, ranking, recordHistory, Number, showItemUseFx | groups, inventory, itemEffect, name, id, itemStats | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| attackHitClassV2116 | src/script/00.js:6316 | key | 'hit-green-shell'; 'hit-red-shell'; 'hit-spiny'; 'hit-banana'; 'hit-horn'; 'hit-bomb-v2116'; 'hit-hammer'; 'hit-lightning'; 'hit-fire'; 'hit-ice'; 'hit-boomerang'; 'hit-generic-v2116' |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| clearAttackHitFxV2116 | src/script/00.js:6331 | card | void |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| playAttackTargetFxV2116 | src/script/00.js:6339 | groupId, key, defended=false | void; void | battleCard, clearAttackHitFxV2116, attackHitClassV2116, itemVisual, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyItemScore | src/script/00.js:6368 | target, delta, sourceId, attackType='normal' | result | setTimeout, playAttackTargetFxV2116 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| tryDefendLightningV2116 | src/script/00.js:6381 | target | true; false; true | Number, tinyDefenseToast, setTimeout, playAttackTargetFxV2116 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyLightningHitV2116 | src/script/00.js:6409 | caster, target | false; false; true | eligibleForItems, tryDefendLightningV2116, Number, roundHalf, setTimeout, playAttackTargetFxV2116 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| showItemUseFx | src/script/00.js:6433 | key, casterId=null, targetText='' | _v2116ShowItemUseFx.call(this,key,casterId,targetText) | setTimeout, playCasterCardFx |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| isQueuePersistentActiveV2120 | src/script/00.js:6461 | g, it=null | false; ['star','mega','power'].includes(g.itemEffect.type) && main.key===g.itemEffect.type |  | inventory, itemEffect | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| queueRoleTextV2120 | src/script/00.js:6467 | index | index===0?'主要道具':次要道具 ${index} |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| queueUseStateV2120 | src/script/00.js:6471 | g, index | {usable:false,label:'空道具槽'}; {usable:false,label:'🔒 等待主要道具'}; {usable:false,label:'⏳ 生效中 · 等待结束'}; {usable:false,label:'负分保护'}; {usable:false,label:'请先解锁管理口令'}; {usable:false,label:reason}; {usable:true,label:'解除冻结（本次不发动）'}; {usable:true,label:'使用主要道具'} | isQueuePersistentActiveV2120, eligibleForItems, isCommunismMode | inventory, isLocked, itemEffect | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| legacyUseItem | src/script/00.js:6486 | groupId, index, ...rest | false; false; false; false; _v2120UseItem.call(this,groupId,0,...rest) | closeItemWindowForFx, showToast, isQueuePersistentActiveV2120 | groups, inventory | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| godAddQueueItemV2120 | src/script/00.js:6516 | gid, key | void; void; void | showToast, eligibleForItems, recordHistory, addItemToGroup, saveState, renderAll, renderItemWindow | groups, inventory, name | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| godClearQueueItemsV2120 | src/script/00.js:6528 | gid | void | recordHistory, saveState, renderAll, renderItemWindow | groups, name, inventory, itemEffect, booShield | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| godAddItem | src/script/00.js:6536 | id, k | DOM／状态副作用；需按调用场景确认 | godAddQueueItemV2120 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| godAddItemV283 | src/script/00.js:6537 | id, k | DOM／状态副作用；需按调用场景确认 | godAddQueueItemV2120 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| godClearItems | src/script/00.js:6538 | id | DOM／状态副作用；需按调用场景确认 | godClearQueueItemsV2120 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderItemWindow | src/script/00.js:6542 | 无参数 | void; <div class="item-big queue-item-card ${i===0?'queue-main-card':'queue-secondary-card'} empty">     ; <div class="item-big queue-item-card ${i===0?'queue-main-card':'queue-secondary-card'} ${active?'qu | _v2120RenderItemWindow, queueRoleTextV2120, queueUseStateV2120, isQueuePersistentActiveV2120, itemVisual, escapeHtml | groups, inventory, id, score, isLocked | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| enhanceItemCards | src/script/00.js:6595 | 无参数 | void; void | _v2120EnhanceItemCards, isQueuePersistentActiveV2120, queueRoleTextV2120, itemVisual, setTimeout | groups, id, inventory | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handUseNewItem | src/script/00.js:6634 | 无参数 | void | showToast, closeHandRaise, openItemWindow | groups, id, inventory | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| ensureGroupNumbersV213 | src/script/01.js:11 | save=false | void; changed | saveState | groups, groupNo | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| groupNoTextV213 | src/script/01.js:28 | g | String(n).padStart(2,'0') | String | groupNo | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| desiredGroupsV213 | src/script/01.js:29 | 无参数 | ranking(); state.groups.slice().sort((a,b)=>(a.groupNo／／999999)-(b.groupNo／／999999)／／state.groups.indexOf(a)-st | ensureGroupNumbersV213, ranking | roundActive, evaluated, groups | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| currentCardSortLabelV213 | src/script/01.js:34 | 无参数 | (v213ForceRankSort ／／ !(state.roundActive&&!state.evaluated))?'排名':'编号' |  | roundActive, evaluated | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderItemEncyclopedia | src/script/01.js:37 | 无参数 | void; <div class="ency-v213-card">     <div class="ency-v213-icon-disc">${itemVisual(k,'ency-v213-img')}< | ensureV2State, itemVisual, escapeHtml |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderGrid | src/script/01.js:51 | 无参数 | void; <button class="${cls} ${roundClass}" onclick="selectGroupOpt(${g.id},'${opt}')" ${state.evaluated?'; it?<div class="item-slot ${i===0?'queue-main-slot':'queue-secondary-slot'}" title="${escapeHtml(ITE; void; void; void | ensureGroupNumbersV213, String, desiredGroupsV213, readableTextOnColor, escapeHtml, itemVisual, groupNoTextV213, currentCardSortLabelV213, enhanceItemCards, useItem, showToast, openItemWindow, requestAnimationFrame, setTimeout | columnMode, id, animState, color, roundActive, evaluated, selectedOpt, correctAns, displayScore, score, isLocked, editingScoreId, allIn, inventory, name, resultText, itemEffect | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applySettingsBatchMembers | src/script/01.js:178 | ...a | r | ensureGroupNumbersV213, saveState, renderAll | groups, id, groupNo | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| legacyUseItem | src/script/01.js:189 | groupId, index, ...rest | result | setTimeout | roundActive, evaluated | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| applyModernFlatV217 | src/script/02.js:3 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| rankOfGroupV214 | src/script/02.js:5 | id | i>=0?i+1:null | ranking | id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderGrid | src/script/02.js:13 | 无参数 | void; result | ranking, Number, currentCardSortLabelV213 | id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderAbout | src/script/02.js:29 | tab | void; void; <div class="v214-about-item"><div class="v214-about-item-disc">${itemVisual(k,'v214-about-item-img'; void | itemVisual, escapeHtml |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderHandRaise | src/script/02.js:44 | 无参数 | void | readableTextOnColor, escapeHtml | groups, id, color, name, score | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updateHandScoreV214 | src/script/02.js:49 | id | void |  | groups, score | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handQuickScore | src/script/02.js:54 | n | void | applyScoreDelta, updateHandScoreV214, setTimeout |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderHandRewardControlsV214 | src/script/02.js:62 | 无参数 | void | eligibleForItems, escapeHtml | groups, inventory | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| judgeHandRaise | src/script/02.js:72 | correct | DOM／状态副作用；需按调用场景确认 | renderHandRewardControlsV214 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handUsePrimaryV214 | src/script/02.js:76 | 无参数 | void; void | showToast, closeHandRaise, setTimeout, useItem | groups, inventory, id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| finishHandItemReward | src/script/02.js:86 | 无参数 | DOM／状态副作用；需按调用场景确认 | closeHandRaise |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderWelcomeAllV216 | src/script/03.js:4 | 无参数 | DOM／状态副作用；需按调用场景确认 | renderWelcomePage, renderChart, renderDashboard |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| switchView | src/script/03.js:13 | name | r | requestAnimationFrame |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderAll | src/script/03.js:21 | ...args | r | renderWelcomeAllV216 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| showItemUseFx | src/script/03.js:32 | key, casterId=null, targetText='' | void | playSound, setTimeout, itemSoundCategoryV26, playCasterCardFx, cardFxTargets, playTargetCardFx, itemVisual, escapeHtml | groups, id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| legacyJudgeRound | src/script/04.js:12 | ...args | false; g ? { id: g.id, target: Number(g.score) ／／ 0 } : null; void; result | Number, setTimeout, cancelAnimationFrame, animateScores, saveState, renderAll | roundActive, evaluated, correctAns, groups, itemEffect, id, selectedOpt, score, displayScore | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| itemFallbackToneV2164 | src/script/04.js:84 | freq, t, dur, type='sine', gainValue=.12, endFreq=null | void | getFxOutputV2176 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| playItemFallbackSoundV2164 | src/script/04.js:101 | slotId | void | itemFallbackToneV2164 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| playSound | src/script/04.js:155 | slotId | _v2164PlaySoundBase.call(this, slotId); void | loadFxSounds, getAudioContext, getFxOutputV2176, playItemFallbackSoundV2164 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| startDrawSoundBedV2164 | src/script/04.js:188 | ms=3600 | DOM／状态副作用；需按调用场景确认 | playSound, setInterval, clearInterval, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| globalItemDraw | src/script/04.js:204 | ...args | _v2164GlobalItemDraw.apply(this, args) | eligibleForItems, isCommunismMode, startDrawSoundBedV2164 | groups, inventory | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handDrawItem | src/script/04.js:215 | ...args | _v2164HandDrawItem.apply(this, args) | eligibleForItems, startDrawSoundBedV2164 | groups, inventory | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| explodeDestroyedBombV2170 | src/script/05.js:30 | holder, sourceId=null, reason='炸弹兵被摧毁' | []; []; []; targets | ranking, eligibleForItems, tinyDefenseToast, roundQuarter, applyItemScore, setTimeout, flashBomb |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| destroyPrimaryBasicDefenseV2170 | src/script/05.js:51 | target, sourceId=null, reason='特殊攻击' | null; destroyedKey | tinyDefenseToast, explodeDestroyedBombV2170 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| tryDefend | src/script/05.js:72 | g, attackType | true; true; true; true; true; true; true; true; false | eligibleForItems, Number, tinyDefenseToast, explodeDestroyedBombV2170, consumeInventoryItem | itemEffect, name, inventory, booShield, __spinyMushroomDeclinedV21727 | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyItemScore | src/script/05.js:147 | target, delta, sourceId, attackType='normal' | void; {changed:false,blocked:'pending-defense'}; _v2170ApplyItemScore.call(this,target,delta,sourceId,attackType) | destroyPrimaryBasicDefenseV2170, themeConfirm, consumeInventoryItem, tinyDefenseToast, saveState, renderAll |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| detectOvertakePunish | src/script/05.js:194 | actorId, beforeOrder | void; void; void | ranking, eligibleForItems, destroyPrimaryBasicDefenseV2170, tryDefend, roundQuarter | groups, id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| isQueuePersistentActiveV2120 | src/script/05.js:222 | g, it=null | false; ['mega','power'].includes(g.itemEffect.type) && main.key===g.itemEffect.type |  | inventory, itemEffect | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| tryDefendLightningV2116 | src/script/05.js:229 | target | true; false; true | Number, tinyDefenseToast, setTimeout, playAttackTargetFxV2116 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderAbout | src/script/05.js:256 | tab | void; _v2170RenderAboutFallback.call(this,tab); <div class="v2170-ency-row">           <div class="v2170-ency-icon">${itemVisual(k,'v2170-ency-img' | itemVisual, escapeHtml |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| stopActiveDrawAudioV2171 | src/script/06.js:12 | 无参数 | DOM／状态副作用；需按调用场景确认 | clearInterval, clearTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| playTrackedDrawSoundV2171 | src/script/06.js:31 | slotId, generation | void; void; void; void | loadFxSounds, getAudioContext, getFxOutputV2176, playItemFallbackSoundV2164, playSound |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| finishDrawAudioV2171 | src/script/06.js:63 | generation | void | clearInterval, playSound |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| startDrawSoundBedV2164 | src/script/06.js:83 | 无参数 | void | stopActiveDrawAudioV2171, playTrackedDrawSoundV2171, setInterval, clearInterval, setTimeout, finishDrawAudioV2171 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| cancelHandItemDraw | src/script/06.js:116 | ...args | _v2171CancelHandItemDraw.apply(this,args) | stopActiveDrawAudioV2171 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| itemExistsOnFieldV2172 | src/script/07.js:8 | key | true; state.groups.some(g =>     Array.isArray(g.inventory) && g.inventory.some(it=>it?.key===key)   ) | ensureItemState, Number | itemGlobal, groups, inventory | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| itemRankBandV2172 | src/script/07.js:21 | pos, total | 'front'; 'rear'; 'mid' | Number |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| itemDropWeights | src/script/07.js:39 | pos, total | W | itemRankBandV2172, Number, put, itemExistsOnFieldV2172 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| addItemToGroup | src/script/07.js:152 | g, key | false; _v2172AddItemToGroup.call(this,g,key) | itemExistsOnFieldV2172, showToast |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| clearAllItemsV2172 | src/script/07.js:164 | 无参数 | void; void | ensureItemState, Number, showToast, themeConfirm, recordHistory, clearInterval, applyBlooperMask, saveState, renderAll | groups, inventory, itemEffect, booShield, itemGlobal, iceLock | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| installClearItemsSettingV2172 | src/script/07.js:204 | 无参数 | void |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| rebuildSettingsV26 | src/script/07.js:225 | ...args | r | setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| showSettingsV26 | src/script/07.js:233 | which, ...args | r | setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| itemDropWeights | src/script/08.js:4 | pos, total | W | Number, itemRankBandV2172, put, itemExistsOnFieldV2172 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| playPerItemFallbackV2174 | src/script/09.js:16 | key | void | getFxOutputV2176, tone | gain, connect | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| playSound | src/script/09.js:67 | slotId | void; void; void; void; _v2174PlaySound.call(this,slotId) | loadFxSounds, getAudioContext, getFxOutputV2176, playPerItemFallbackV2174 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| showItemUseFx | src/script/09.js:105 | key, casterId=null, targetText='' | _v2174ShowItemUseFx.call(this,key,casterId,targetText) | playSound |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderItemFxSoundListV26 | src/script/09.js:115 | 无参数 | void; <div class="sound-row v2174-sound-row${itemClass}">       ${description}       <div class="sound-co; rowHtml(item_${k},d.name,'默认：该道具独立合成音',visual) | hasSound, escapeHtml, rowHtml, itemVisual |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handleSoundFileUpload | src/script/09.js:174 | event | result | setTimeout, renderItemFxSoundListV26 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| deleteFxTrack | src/script/09.js:181 | idbKey, fxKey | result | setTimeout, renderItemFxSoundListV26 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| exportFxBundleV2175 | src/script/10.js:6 | 无参数 | void; void; void | openPwdModal, initDB, themeAlert, showToast, resolve, setTimeout | isLocked | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderItemFxSoundListV26 | src/script/10.js:102 | 无参数 | void | _v2175RenderItemFxSoundListV26 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| showSettingsV26 | src/script/10.js:127 | which, ...args | r | setTimeout, renderItemFxSoundListV26 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getFxOutputV2176 | src/script/11.js:15 | 无参数 | masterGainNode; fxGainNodeV2176 |  | sfxVolume | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updateSfxVolumeV2176 | src/script/11.js:26 | vol | DOM／状态副作用；需按调用场景确认 | parseFloat, getFxOutputV2176 | sfxVolume | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| installSfxVolumeSliderV2176 | src/script/11.js:47 | 无参数 | void |  | sfxVolume | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| syncSettingsControls | src/script/11.js:83 | ...args | r | installSfxVolumeSliderV2176 | sfxVolume | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| rebuildSettingsV26 | src/script/11.js:98 | ...args | r | setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| showSettingsV26 | src/script/11.js:107 | which, ...args | r | setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| resetRoundItemUseLocksV2177 | src/script/12.js:10 | 无参数 | DOM／状态副作用；需按调用场景确认 |  | groups, itemUsedThisRound | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| refreshAllInMusicAfterItemUseV2177 | src/script/12.js:14 | 无参数 | DOM／状态副作用；需按调用场景确认 | checkAllInRatio, bgmTransitionThinkingToBattle, bgmTransitionBattleToThinking |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| markItemUsedThisRoundV2177 | src/script/12.js:27 | groupId | void; void | refreshAllInMusicAfterItemUseV2177, showToast, saveState, renderGrid, renderDashboard, renderItemWindow | roundActive, evaluated, groups, itemUsedThisRound, allIn, name | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| showItemUseFx | src/script/12.js:51 | key, casterId, targetText='' | _v2177ShowItemUseFx.call(this,key,casterId,targetText) |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| legacyUseItem | src/script/12.js:58 | groupId, index, ...rest | false; _v2177UseItem.call(this,groupId,index,...rest); _v2177UseItem.call(this,groupId,index,...rest) | closeItemWindowForFx, showToast | groups, roundActive, evaluated, itemUsedThisRound, name, itemEffect, inventory | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| toggleAllInCard | src/script/12.js:83 | groupId, ...rest | false; _v2177ToggleAllInCard.call(this,groupId,...rest) | showToast | groups, roundActive, evaluated, itemUsedThisRound, name | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| finishStartRound | src/script/12.js:96 | ...args | _v2177FinishStartRound.apply(this,args) | resetRoundItemUseLocksV2177 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| queueUseStateV2120 | src/script/12.js:103 | g, index | {usable:false,label:'本题已使用道具'}; st |  | roundActive, evaluated, itemUsedThisRound | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderGrid | src/script/12.js:114 | ...args | void; void; result |  | roundActive, evaluated, groups, itemUsedThisRound, id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| batchToggleAllIn | src/script/13.js:6 | 无参数 | void; void | showToast, playSound, saveState, renderGrid, renderDashboard, refreshAllInMusicAfterItemUseV2177, checkAllInRatio, bgmTransitionThinkingToBattle, bgmTransitionBattleToThinking | roundActive, evaluated, groups, itemUsedThisRound, allIn | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| ensureDrawThrottleV2179 | src/script/14.js:13 | 无参数 | t | ensureItemState, Number | itemGlobal | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| restrictedItemWeightsV2179 | src/script/14.js:40 | g | {weights:W,drawNo,throttle:t} | ranking, itemDropWeights, ensureDrawThrottleV2179, Number | id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| commitDrawThrottleV2179 | src/script/14.js:64 | g, key, drawNo, t | DOM／状态副作用；需按调用场景确认 | Number | id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| pickItemForGroupV281 | src/script/14.js:88 | g, batchUsed=new Set() | k | heldItemKeysV281, restrictedItemWeightsV2179, weightedPickNoRepeatV281, weightedPick, Number, commitDrawThrottleV2179 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| installDrawCooldownInfoV2179 | src/script/14.js:146 | 无参数 | void | ensureDrawThrottleV2179 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| installClearItemsSettingV2172 | src/script/14.js:165 | ...args | r | installDrawCooldownInfoV2179 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| ensureDrawSessionThrottleV21710 | src/script/15.js:16 | 无参数 | t | ensureItemState, Number | itemGlobal | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| beginDrawSessionV21710 | src/script/15.js:45 | kind | activeDrawSessionV21710 | ensureDrawSessionThrottleV21710, saveState |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| sessionRestrictedWeightsV21710 | src/script/15.js:60 | g | W | ranking, itemDropWeights, ensureDrawSessionThrottleV21710, Number, itemExistsOnFieldV2172, ensureDrawThrottleV2179 | id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| commitSessionDrawV21710 | src/script/15.js:96 | g, key | DOM／状态副作用；需按调用场景确认 | ensureDrawSessionThrottleV21710, ensureDrawThrottleV2179, Number | id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| pickItemForGroupV281 | src/script/15.js:128 | g, batchUsed=new Set() | k | heldItemKeysV281, sessionRestrictedWeightsV21710, weightedPickNoRepeatV281, weightedPick, Number, commitSessionDrawV21710 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| globalItemDraw | src/script/15.js:155 | ...args | _v21710GlobalItemDraw.apply(this,args) | ensureV2State, eligibleForItems, isCommunismMode, beginDrawSessionV21710 | groups, inventory | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handDrawItem | src/script/15.js:171 | ...args | _v21710HandDrawItem.apply(this,args) | ensureV2State, eligibleForItems, beginDrawSessionV21710 | groups, inventory | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| refreshDrawCooldownInfoV21710 | src/script/15.js:189 | 无参数 | void; ${label}：当前可抽取; ${label}：第 ${next} 个抽取轮次重新开放（当前第 ${t.sessionNo} 轮） | ensureDrawSessionThrottleV21710, Number, text |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| installDrawCooldownInfoV2179 | src/script/15.js:215 | ...args | r | refreshDrawCooldownInfoV21710 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| showSettingsV26 | src/script/15.js:224 | which, ...args | r | setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| startDrawSoundBedV2164 | src/script/16.js:9 | 无参数 | void | stopActiveDrawAudioV2171, playTrackedDrawSoundV2171, setInterval, clearInterval, setTimeout, finishDrawAudioV2171 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| globalItemDraw | src/script/16.js:42 | 无参数 | void; void; void; void; void | ensureV2State, eligibleForItems, showToast, switchView, beginDrawSessionV21710, startDrawSoundBedV2164, recordHistory, renderGrid, updateCardRouletteVisual, roulettePreviewPickV282, requestAnimationFrame, pickItemForGroupV281, addItemToGroup, saveState, setTimeout, renderAll | groups, inventory, id, itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| frame | src/script/16.js:89 | now | void; void | updateCardRouletteVisual, roulettePreviewPickV282, requestAnimationFrame, pickItemForGroupV281, addItemToGroup, saveState, setTimeout, renderAll | id, itemGlobal | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| handDrawItem | src/script/16.js:158 | 无参数 | void; void; void; void; void; void; void; void; void | ensureV2State, eligibleForItems, showToast, beginDrawSessionV21710, startDrawSoundBedV2164, escapeHtml, roulettePreviewPickV282, itemVisual, requestAnimationFrame, cancelHandItemDraw, renderHandRaise, pickItemForGroupV281, recordHistory, addItemToGroup, saveState, renderAll | groups, inventory, id, name, itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| frame | src/script/16.js:189 | now | void; void; void; void; void | roulettePreviewPickV282, itemVisual, requestAnimationFrame, eligibleForItems, cancelHandItemDraw, showToast, renderHandRaise, pickItemForGroupV281, recordHistory, addItemToGroup, saveState, renderAll, escapeHtml | groups, itemGlobal | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| playCasterCardFx | src/script/16.js:270 | key, gid | void; void; void | battleCard, clearCardFx, itemVisual, escapeHtml, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| playTargetCardFx | src/script/16.js:293 | id, key, type='hit' | void; void; void | battleCard, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| playAttackTargetFxV2116 | src/script/16.js:322 | groupId, key, defended=false | void; void; void | battleCard, clearAttackHitFxV2116, attackHitClassV2116, itemVisual, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyItemScore | src/script/17.js:25 | target, delta, sourceId, attackType='normal' | _v21713ApplyItemScore.call(this,target,delta,sourceId,attackType) | eligibleForItems |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| applyLightningHitV2116 | src/script/17.js:34 | caster, target | _v21713ApplyLightningHit.call(this,caster,target) | eligibleForItems |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderAll | src/script/17.js:45 | ...args | _v21713RenderAll.apply(this,args); void; _v21713RenderAll.apply(this,args) | clearTimeout, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderGrid | src/script/17.js:78 | ...args | void; _v21713RenderGrid.apply(this,args) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderAbout | src/script/18.js:37 | tab | void; _v21715RenderAbout.call(this,tab); <div class="v2170-ency-row">           <div class="v2170-ency-icon">${itemVisual(k,'v2170-ency-img' | itemVisual, escapeHtml |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| selectGroupPresetColorV21716 | src/script/19.js:2 | id, color | void; void | openPwdModal, updateGroupColor, renderItemWindow | isLocked | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| previewItemDetailColorV21716 | src/script/19.js:10 | value | DOM／状态副作用；需按调用场景确认 | previewItemDetailColor, String |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| ensureSpinyCooldownV21717 | src/script/20.js:8 | 无参数 | t | ensureDrawSessionThrottleV21710, Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| sessionRestrictedWeightsV21710 | src/script/20.js:22 | g | W | ensureSpinyCooldownV21717, Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| commitSessionDrawV21710 | src/script/20.js:37 | g, key | DOM／状态副作用；需按调用场景确认 | ensureSpinyCooldownV21717 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| refreshDrawCooldownInfoV21710 | src/script/20.js:49 | 无参数 | void | ensureSpinyCooldownV21717, Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| pickItemForGroupV281 | src/script/21.js:7 | g, batchUsed=new Set() | null; k | heldItemKeysV281, sessionRestrictedWeightsV21710, weightedPickNoRepeatV281, commitSessionDrawV21710 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| repairDuplicateInventoryV21718 | src/script/21.js:31 | 无参数 | DOM／状态副作用；需按调用场景确认 | normalizeInventoryV21718, saveState, renderAll | groups, inventory | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| repairFlowerChargesV21719 | src/script/22.js:3 | 无参数 | void; void | Number, saveState, renderAll | groups, inventory | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| clearBrokenCardTranslateV21720 | src/script/23.js:3 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderBattleRankPreviewV21721 | src/script/24.js:4 | 无参数 | void; <div class="battle-rank-chip-v21721 ${rank===1?'rank-1':''}" style="--rank-group-color:${g.color／／' | ranking, Number, groupNoTextV213, String, escapeHtml | groups, groupNo, id, color, name, score | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderGrid | src/script/24.js:29 | ...args | result | renderBattleRankPreviewV21721 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| switchView | src/script/24.js:38 | name, ...args | result | setTimeout, renderBattleRankPreviewV21721 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderGrid | src/script/26.js:7 | ...args | _v21723RenderGrid.apply(this,args) |  | roundActive, evaluated | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| desiredGroupsV21724 | src/script/27.js:9 | 无参数 | groups.sort((a,b)=>{       const na=(typeof groupNoValueV213==='function') ? groupNoValueV213(a) : N; na-nb; ranking().slice(); groups.sort((a,b)=>{     const d=Number(b.score／／0)-Number(a.score／／0);     if(d!==0)return d;     c; d; na-nb | groupNoValueV213, Number, ranking | groups, roundActive, evaluated | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderGrid | src/script/27.js:41 | ...args | _v21724RenderGrid.apply(this,args) |  | roundActive, evaluated | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| refreshSortingV21724 | src/script/27.js:56 | 无参数 | DOM／状态副作用；需按调用场景确认 | renderBattleRankPreviewV21721 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| captureCardRectsV21725 | src/script/28.js:6 | 无参数 | map | String |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| animateCardsFromSnapshotV21725 | src/script/28.js:20 | oldRects | void; void; void; void | String, clearTimeout, requestAnimationFrame, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderGrid | src/script/29.js:6 | ...args | void; _v21726RenderGrid.apply(this,args) | setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| closeThemeDialogV21727 | src/script/30.js:5 | result=false | void | resolve |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| openThemeDialogV21727 | src/script/30.js:15 | message, opts={} | Promise.resolve(false); new Promise(resolve=>{     themeDialogResolveV21727=resolve;      if(opts.confirm){       const canc | prev, String, closeThemeDialogV21727, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| themeAlert | src/script/30.js:70 | message, opts={} | openThemeDialogV21727(message,{...opts,confirm:false}) | openThemeDialogV21727 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| themeConfirm | src/script/30.js:74 | message, opts={} | openThemeDialogV21727(message,{...opts,confirm:true}) | openThemeDialogV21727 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| scheduleScoreEffect | src/script/31.js:2 | fn, delay | setTimeout(()=>{if(epoch===scoreAnimationEpoch)fn()},delay) | setTimeout, fn |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| cancelItemScoreAnimations | src/script/31.js:6 | 无参数 | DOM／状态副作用；需按调用场景确认 | clearTimeout |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| snapshotScoresV21732 | src/script/31.js:28 | 无参数 | new Map(state.groups.map(g=>[String(g.id),Number(g.score)／／0])) | String, Number | groups, id, score | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| getScoreElementV21732 | src/script/31.js:32 | groupId | document.getElementById(score-val-${groupId}) |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| applyHeldDisplayScoresV21732 | src/script/31.js:36 | 无参数 | DOM／状态副作用；需按调用场景确认 | String | groups, displayScore | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| showDeltaOnlyV21732 | src/script/31.js:43 | groupId, delta | void | getScoreElementV21732, requestAnimationFrame, scheduleScoreEffect |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| rollThenCommitScoreV21732 | src/script/31.js:60 | groupId, from, to | void | getScoreElementV21732, String, scheduleScoreEffect, renderChart, renderDashboard, updateHeaderStats, renderBattleRankPreviewV21721 | groups, displayScore | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| queueItemScoreChangesV21732 | src/script/31.js:116 | beforeMap | void; void; void; void | String, Number, getScoreElementV21732, clearTimeout, scheduleScoreEffect, showDeltaOnlyV21732, rollThenCommitScoreV21732 | groups, id, score, displayScore | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| legacyUseItem | src/script/31.js:174 | groupId, index, ...rest | result | snapshotScoresV21732, queueItemScoreChangesV21732 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| applyItemScore | src/script/31.js:189 | target, delta, sourceId, attackType='normal' | result | Number, queueItemScoreChangesV21732, String |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderGrid | src/script/31.js:210 | ...args | result | applyHeldDisplayScoresV21732, getScoreElementV21732 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| normalizeItemEffectForStatusV21731 | src/script/32.js:3 | g | void | Number | itemEffect | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| repairAllItemEffectsV21731 | src/script/32.js:26 | 无参数 | DOM／状态副作用；需按调用场景确认 | normalizeItemEffectForStatusV21731, saveState | groups, itemEffect | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| ensureItemState | src/script/32.js:40 | ...args | result | repairAllItemEffectsV21731 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| getTopNoticeStackV21735 | src/script/35.js:4 | 无参数 | stack; stack |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| appendTopNoticeV21735 | src/script/35.js:15 | node, duration=3800 | node | getTopNoticeStackV21735, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| showItemUseFx | src/script/35.js:31 | key, casterId=null, targetText='' | void; void | playSound, setTimeout, itemSoundCategoryV26, playCasterCardFx, cardFxTargets, playTargetCardFx, itemVisual, escapeHtml, appendTopNoticeV21735 | groups, id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| tinyDefenseToast | src/script/35.js:80 | msg | DOM／状态副作用；需按调用场景确认 | playSound, escapeHtml, String, appendTopNoticeV21735 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| parseStudentV218 | src/script/36.js:5 | raw | {number:null,name:text,raw:text}; {number:Number(m[1]),numberText:m[1],name:(m[2]／／'').trim()／／text,raw:text} | String, Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| studentLabelHTMLV218 | src/script/36.js:12 | raw, g | <span class="student-name-v218">${escapeHtml(p.name)}</span>; <span class="student-no-inline-v218" style="color:${g?.color／／'#0f766e'}">${escapeHtml(p.numberText | parseStudentV218, escapeHtml | color | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| pinyinInitialV218 | src/script/36.js:17 | raw | '#'; ch.toUpperCase(); '#'; result; '#' | parseStudentV218 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderBattleRankPreviewV21721 | src/script/36.js:45 | 无参数 | r | Number | itemGlobal | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| searchMemberGroups | src/script/36.js:56 | 无参数 | void; void; void | parseStudentV218, String, escapeHtml, studentLabelHTMLV218 | groups, members, color, name | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| syncPickerScoreTarget | src/script/36.js:86 | 无参数 | void; void | escapeHtml, studentLabelHTMLV218 | picker, color, name, score | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| allStudentsV218 | src/script/36.js:98 | 无参数 | out | parseStudentV218, pinyinInitialV218 | groups, members, id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| numberBandV218 | src/script/36.js:106 | n | null; '1-9'; ${start}-${start+9} |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| openQuickPersonScoreV218 | src/script/36.js:112 | 无参数 | DOM／状态副作用；需按调用场景确认 | renderQuickPersonFiltersV218, renderQuickPersonListV218 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| closeQuickPersonScoreV218 | src/script/36.js:118 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| toggleQPSetV218 | src/script/36.js:119 | type, val | DOM／状态副作用；需按调用场景确认 | renderQuickPersonFiltersV218, renderQuickPersonListV218 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderQuickPersonFiltersV218 | src/script/36.js:124 | 无参数 | DOM／状态副作用；需按调用场景确认 | allStudentsV218, numberBandV218, parseInt, escapeHtml | groups, id, color, name | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| filteredStudentsV218 | src/script/36.js:138 | 无参数 | allStudentsV218().filter(s=>{     if(q){       const qNum=q.replace(/\D/g,'');       const hitName=s; false; false; false; false; true | allStudentsV218, String, numberBandV218 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderQuickPersonListV218 | src/script/36.js:153 | 无参数 | void | filteredStudentsV218, escapeHtml |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| toggleQuickPersonV218 | src/script/36.js:165 | key | DOM／状态副作用；需按调用场景确认 | renderQuickPersonListV218 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyQuickPersonScoreV218 | src/script/36.js:169 | points | void; void; void | Number, showToast, allStudentsV218, applyScoreDelta, recordHistory, saveState, renderAll | groups, name | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| applyQuickPersonCustomV218 | src/script/36.js:188 | 无参数 | void | Number, showToast, applyQuickPersonScoreV218 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| consumeOneV218 | src/script/36.js:217 | g, index | void | Number | inventory | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| attackOneFifthV218 | src/script/36.js:222 | caster, target, key | {changed:false}; applyItemScore(target,-amount,caster.id,key) | Number, applyItemScore |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| finishOwnItemUseV218 | src/script/36.js:227 | g, key, index, targetText | true | Number, recordHistory, saveState, renderAll, showItemUseFx, showToast | itemStats, name, id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| legacyUseItem | src/script/36.js:234 | groupId, index, ...rest | _v218UseItemBalance.call(this,groupId,index,...rest); true; false; finishOwnItemUseV218(g,key,index,目标：${pool.map(x=>x.name).join('、')}); finishOwnItemUseV218(g,key,index,!above?'没有上方排名 · 自动获得蘑菇':'上方无道具 · 自动获得蘑菇'); false; finishOwnItemUseV218(g,key,index,       result?.blocked?目标：${t.name} · 攻击被防御:目标：${t.name} · -1/5$; false; finishOwnItemUseV218(g,key,index,目标：${targets.map(x=>x.name).join('、')} · 各 -1/5); result | ranking, consumeOneV218, finishOwnItemUseV218, showToast, damageFraction, eligibleForItems, attackOneFifthV218, Number, saveState | groups, inventory, roundActive, evaluated, itemUsedThisRound, roundItemContinuationKeyV218, id, booShield, booRoundsLeftV218, itemEffect | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| queueUseStateV2120 | src/script/36.js:334 | g, index | {usable:true,label:继续使用（剩余 ${g.inventory[0].charges}）}; _v218QueueState.call(this,g,index) |  | roundActive, evaluated, itemUsedThisRound, inventory, roundItemContinuationKeyV218 | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| tryDefend | src/script/36.js:346 | g, attackType | true; false; _v218TryDefend.call(this,g,attackType) | Number, tinyDefenseToast | booRoundsLeftV218, booShield, __spinyHornDeclinedV218, inventory | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyItemScore | src/script/36.js:360 | target, delta, sourceId, attackType='normal' | void; {changed:false,blocked:'pending-horn-defense'}; _v218ApplyItemScore.call(this,target,delta,sourceId,attackType) | themeConfirm, consumeInventoryItem, tinyDefenseToast, saveState, renderAll |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| legacyJudgeRound | src/script/36.js:393 | ...args | false; result; result | Number, showToast, saveState, renderAll | roundActive, evaluated, correctAns, groups, id, selectedOpt, itemEffect, name, booRoundsLeftV218, booShield, roundItemContinuationKeyV218 | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| legacyUseItem | src/script/36.js:426 | groupId, index, ...rest | r |  | groups, itemEffect | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| itemDropWeights | src/script/36.js:446 | pos, total | W | Number |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| pickItemForGroupV281 | src/script/36.js:459 | g, batchUsed=new Set() | k; 'horn'; _v218PickItem.call(this,g,batchUsed); _v218PickItem.call(this,g,batchUsed) | commitSessionDrawV21710, rankIndex | id, inventory, groups | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| scoreSnapshotV218 | src/script/36.js:491 | 无参数 | new Map(state.groups.map(g=>[g.id,Number(g.score)／／0])) | Number | groups, id, score | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| showHandEffectV218 | src/script/36.js:492 | key, before, note='' | void; void | Number, escapeHtml, itemVisual, clearTimeout, setTimeout | groups, id, score, name | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| handUseOneV218 | src/script/36.js:509 | 无参数 | void | showToast, scoreSnapshotV218, useItem, setTimeout, showHandEffectV218, renderHandRewardControlsV218 | groups, inventory, id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| handUseAllTripleV218 | src/script/36.js:517 | 无参数 | void; void | showToast, scoreSnapshotV218, Number, showHandEffectV218, renderHandRewardControlsV218, useItem, setTimeout, fire | groups, inventory | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderHandRewardControlsV218 | src/script/36.js:537 | 无参数 | void | Number, eligibleForItems, escapeHtml | groups, inventory | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| judgeHandRaise | src/script/36.js:557 | correct | r | setTimeout |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| finishHandItemReward | src/script/36.js:564 | 无参数 | DOM／状态副作用；需按调用场景确认 | renderHandRewardControlsV218 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderAbout | src/script/36.js:607 | tab | _v218RenderAbout.call(this,tab); void; <div class="v2170-ency-row">         <div class="v2170-ency-icon">${itemVisual(k,'v2170-ency-img')} | itemVisual, escapeHtml |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderItemWindow | src/script/36.js:647 | 无参数 | r; r |  | groups | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| groupItemDescV2182 | src/script/37.js:43 | key | GROUP_ITEM_DESC_V2182[key] ／／ ITEM_DEFS[key]?.desc ／／ '' |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| syncGodItemPickerV2182 | src/script/37.js:55 | 无参数 | void; void; void | groupItemDescV2182 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| syncOwnedItemCardsV2182 | src/script/37.js:86 | 无参数 | void | groupItemDescV2182 | groups, id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| syncGroupItemInfoV2182 | src/script/37.js:96 | 无参数 | DOM／状态副作用；需按调用场景确认 | syncGodItemPickerV2182, syncOwnedItemCardsV2182 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderItemWindow | src/script/37.js:103 | 无参数 | r | requestAnimationFrame |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| adminAddItem | src/script/37.js:112 | 无参数 | r | setTimeout |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderAbout | src/script/38.js:64 | tab | _v2184RenderAbout.call(this,tab); void; <div class="v2170-ency-row">         <div class="v2170-ency-icon">${itemVisual(k,'v2170-ency-img')} | itemVisual, escapeHtml |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| ensureDockHumorTipV2185 | src/script/39.js:24 | 无参数 | dockHumorTipV2185; el |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| bindDockHumorV2185 | src/script/39.js:32 | el, key | void | ensureDockHumorTipV2185, escapeHtml |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyDockHumorV2185 | src/script/39.js:52 | 无参数 | void | bindDockHumorV2185, byOnclick |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderLockState | src/script/39.js:101 | 无参数 | r | bindDockHumorV2185 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| polishVisibleCopyV2187 | src/script/41.js:5 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderAbout | src/script/41.js:41 | tab | _v2187RenderAbout.call(this,tab); void; void |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| openPwdModal | src/script/41.js:77 | 无参数 | r |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| legacyUseItem | src/script/42.js:30 | groupId, index, ...rest | _v2189UseItem.call(this,groupId,index,...rest); false; _v2189UseItem.call(this,groupId,index,...rest); true; true; false; true | showToast, eligibleForItems, consumeOneV218, Number, recordHistory, saveState, renderAll, showItemUseFx, attackOneFifthV218, applyItemScore | groups, inventory, roundActive, evaluated, itemUsedThisRound, name, itemEffect, id, itemStats | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| cleanVisibleCopyV21811 | src/script/43.js:2 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderAbout | src/script/43.js:18 | tab | r | cleanVisibleCopyV21811 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| resetCompetitionDataAfterSettlementV21812 | src/script/44.js:5 | 无参数 | DOM／状态副作用；需按调用场景确认 | cancelScoreAnimationAndSync, resetSlotDisplay, ensureV2State | groups, score, displayScore, allIn, selectedOpt, resultText, animState, inventory, itemStats, itemEffect, booShield, itemUsedThisRound, booRoundsLeftV218, roundItemContinuationKeyV218, __spinyHornDecisionPendingV218, __spinyHornDeclinedV218, _pendingItemScoreV21727, _displayScoreHoldV21732, roundActive, evaluated, correctAns, correctAnswer, hasStartedOnce, lastRoundAllIn, roundNo, itemGlobal, picker | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| snapshotGroupForSettlementV21813 | src/script/45.js:4 | g | {     id:g.id,     name:g.name,     color:g.color,     members:clone(g.members／／[]),     score:Numbe | clone, Number | id, name, color, members, score, displayScore, allIn, selectedOpt, resultText, animState, inventory, itemStats, itemEffect, booShield, booRoundsLeftV218, itemUsedThisRound, roundItemContinuationKeyV218, __spinyHornDecisionPendingV218, __spinyHornDeclinedV218 | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| compactUndoHistoryV21813 | src/script/45.js:28 | 无参数 | (historyStack／／[]).map(h=>({     desc:h.desc／／'',     time:h.time／／'',     groups:(h.groups／／[]).map | clone |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| buildSettlementClearedDataV21813 | src/script/45.js:45 | 无参数 | {     archivedAt:new Date().toLocaleString(),      groups:state.groups.map(snapshotGroupForSettlemen | Number, clone, compactUndoHistoryV21813 | itemGlobal, groups, roundActive, evaluated, correctAnswer, correctAns, roundNo, hasStartedOnce, lastRoundAllIn, picker | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| csvCellV21813 | src/script/45.js:102 | v | '""'; "${text.replace(/"/g,'""')}" | String |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| itemNameV21813 | src/script/45.js:110 | key | ITEM_DEFS?.[key]?.name／／key／／'' |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| inventoryTextV21813 | src/script/45.js:113 | inv | (inv／／[]).map(it=>{     const n=itemNameV21813(it.key);     const c=Number(it.charges)／／1;     retur; c>1?${n} ×${c}:n | itemNameV21813, Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| effectTextV21813 | src/script/45.js:120 | g | out.join(' / ')／／'无' | Number | itemEffect, booShield, booRoundsLeftV218 | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| exportSingleSettlementCSV | src/script/45.js:133 | index | void | getSettlementHistory, Number, csvCellV21813, inventoryTextV21813, effectTextV21813, showToast | score, itemStats, name, members, inventory, booRoundsLeftV218, itemUsedThisRound, roundItemContinuationKeyV218, allIn, selectedOpt, resultText, id, itemEffect, booShield | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| buildClassroomBackup | src/core/classroom.js:3 | 无参数 | {     schemaVersion:Reliability.schemaVersion,appVersion:'V2.19.0',timestamp:new Date().toISOString( | getPersistableGroups, clone | picker, itemGlobal, roundActive, evaluated, correctAns, hasStartedOnce, lastRoundAllIn, adminPin, masterVolume, sfxVolume, zoomLevel, resizerEnabled, resizerHeight, columnMode, saveAllIn | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyClassroomBackup | src/core/classroom.js:15 | raw | DOM／状态副作用；需按调用场景确认 | normalizeAllGroups, clone, String, Number, ensureV2State, ensureGroupNumbersV213 | groups, picker, itemGlobal, roundActive, evaluated, hasStartedOnce, correctAns, lastRoundAllIn, selectedOpt, allIn, itemUsedThisRound, adminPin, k, columnMode | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| importClassroomData | src/core/classroom.js:50 | data | {ok:false,error:'请先解锁'}; {ok:true}; {ok:false,error:String(error.message／／error)} | clone, cancelScoreAnimationAndSync, applyClassroomBackup, saveState, Error, renderAll, String | isLocked, zoomLevel | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| itemCommandSnapshot | src/core/classroom.js:66 | 无参数 | JSON.stringify({groups:state.groups,itemGlobal:state.itemGlobal}) |  | groups, itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| showClassroomSaveWarning | src/core/classroom.js:67 | error | DOM／状态副作用；需按调用场景确认 | String, showToast |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| runClassroomCommand | src/core/classroom.js:75 | description, operation, options={retainOnPersistenceFailure:true} | false; false; true; true; false | clone, recordHistory, operation, cancelItemScoreAnimations, Error, saveState, renderAll, showClassroomSaveWarning, cancelScoreAnimationAndSync, showToast | groups, score | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| useItem | src/core/classroom.js:106 | groupId, index | false; false; runClassroomCommand(${g.name} 使用道具：${ITEM_DEFS[key]?.name／／key},()=>{     ensureV2State();     con; true; false; true | isCommunismMode, closeItemWindowForFx, showToast, runClassroomCommand, ensureV2State, itemCommandSnapshot, markItemUsedThisRoundV2177, legacyUseItem | groups, inventory, name, itemEffect | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| judgeRound | src/core/classroom.js:148 | 无参数 | false; false; runClassroomCommand(自动判定结算 (正解: ${state.correctAns}),()=>{legacyJudgeRound();return true},{retainO; true | themeAlert, runClassroomCommand, legacyJudgeRound | roundActive, evaluated, correctAns | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| validateBackup | src/core/reliability.js:5 | data | data | Error, Number, validateBackup | score, members, inventory, itemEffect | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| writeVerified | src/core/reliability.js:27 | storage, key, data | {ok:true}; {ok:false,error:String(error.message／／error)} | Error, String |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| appendArchive | src/core/reliability.js:35 | storage, record | writeVerified(storage,'politics_settlement_history',[record,...list.filter(x=>x.id!==record.id)]); {ok:false,error:String(error.message／／error)} | Error, writeVerified, String |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| phase | src/core/reliability.js:44 | s | 'NOT_STARTED'; 'FINISHED'; 'SETTLED'; s.correctAns?'ANSWER_SELECTED':'ANSWERING' |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| validateItem | src/core/reliability.js:50 | s, g, index, enabled | '共产主义模式已关闭'; '没有可用道具'; '次要道具需要等待主要道具'; '负分保护：该组不能使用道具'; '本题已经使用过道具'; '主要道具持续状态尚未结束'; null | Number | inventory, score, roundItemContinuationKeyV218, itemUsedThisRound, itemEffect | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| safeImage | src/core/reliability.js:61 | value | typeof value==='string' && /^data:image\/(?:png／jpe?g／webp／gif);base64,[a-zA-Z0-9+/=\s]+$/.test(valu |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| count | src/core/reliability.js:64 | value | Number.isSafeInteger(n)&&n>=0?n:0 | Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| normalizeStats | src/core/reliability.js:65 | raw | Object.fromEntries(['correct','wrong','draws','used'].map(k=>[k,count(raw?.[k])])) | count |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| normalizeEffect | src/core/reliability.js:66 | raw | null; Object.keys(out).length?out:null | count |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| calculateRoundScores | src/core/reliability.js:74 | s | s.groups.map(g=>{       let score=Number(g.score);       if(!Number.isSafeInteger(score))throw Error; score | Number, Error | score, selectedOpt, allIn | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| csvText | src/core/reliability.js:86 | text | /^[\s]*[=+@-]/.test(text)?"'"+text:text | String |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| icon | src/ui/desktop.js:42 | name | <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name] ／／ paths.spark}" |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| empty | src/ui/desktop.js:45 | title, text | <div class="ui-empty">${icon("archive")}<h3>${E(title)}</h3><p>${E(text)}</p><button class="btn btn | icon, E |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| persistPreferences | src/ui/desktop.js:48 | 无参数 | true; false | showToast |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyPreferences | src/ui/desktop.js:60 | 无参数 | DOM／状态副作用；需按调用场景确认 | String, cancelAnimations |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| canAnimate | src/ui/desktop.js:69 | 无参数 | preferences.motion !== "off" &&       !(         preferences.systemMotion &&         matchMedia("(pr | matchMedia |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| animate | src/ui/desktop.js:78 | el, frames, options = {} | void; a | canAnimate |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| cancelAnimations | src/ui/desktop.js:89 | 无参数 | DOM／状态副作用；需按调用场景确认 | clearCardFx, clearAttackHitFxV2116 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| visualEvent | src/ui/desktop.js:102 | type, detail = {} | void | canAnimate, $, String, animate |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| syncViewport | src/ui/desktop.js:130 | 无参数 | void | Number, getComputedStyle |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| viewChanged | src/ui/desktop.js:146 | name | void | $, String, cancelAnimations, animate, renderWelcome, selectSettings |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderWelcome | src/ui/desktop.js:194 | 无参数 | void; void; <button class="ui-group-card" data-group="${Number(g.id)}" style="--group-color:${/^#[a-f\d]{3,8}$/ | $, syncViewport, observeVisualState, canAnimate, Number, E, itemVisual, icon, empty, openItemWindow, requestAnimationFrame, renderDaily | groups, itemGlobal, id, name, score, color, inventory, itemEffect, booShield, booRoundsLeftV218, groupNo | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updateArrows | src/ui/desktop.js:266 | 无参数 | void | $ |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| observeVisualState | src/ui/desktop.js:276 | 无参数 | DOM／状态副作用；需按调用场景确认 | visualEvent | groups, inventory, itemEffect, id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderDaily | src/ui/desktop.js:316 | 无参数 | void; void | $, getSettlementHistory, E, itemVisual, String, Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| historyKind | src/ui/desktop.js:362 | desc = "" | /清零／恢复／撤销／回溯／删除/.test(desc)       ? ["danger", "shield", "数据与恢复"]       : /道具／攻击／龟壳／蘑菇/.test(desc)   |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| inventory | src/ui/desktop.js:373 | items | items         .map((i) => ${ITEM_DEFS[i.key]?.name ／／ i.key} ×${i.charges ?? 1})         .join("、" |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderHistory | src/ui/desktop.js:380 | 无参数 | void; void; void; <article class="ui-panel ui-history" data-kind="${kind}"><details><summary><div><span class="ui-chi; void | $, empty, historyKind, icon, E, inventory, animate, Number, themeConfirm, revertToHistory | name | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderArchives | src/ui/desktop.js:445 | 无参数 | void; <article class="ui-panel"><details><summary class="ui-archive-summary"><div><span class="ui-eyebrow | getSettlementHistory, Number, $, E, icon, empty, exportSingleSettlementCSV, deleteSettlementRecord, downloadJson | score, name, members, itemStats | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| downloadJson | src/ui/desktop.js:528 | value, name | DOM／状态副作用；需按调用场景确认 | setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| setupSettings | src/ui/desktop.js:550 | 无参数 | void; <div class="ui-settings-row"><label for="${id}">${title}</label>${content}</div>; void | $, icon, selectSettings, row, check, String, refreshSubjects, Number, persistPreferences, applyPreferences, renderDaily, downloadJson, themeConfirm |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| row | src/ui/desktop.js:599 | title, id, content | <div class="ui-settings-row"><label for="${id}">${title}</label>${content}</div> |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| refreshSubjects | src/ui/desktop.js:711 | 无参数 | void | $, E |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| selectSettings | src/ui/desktop.js:731 | id | void | $, String |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| setupDock | src/ui/desktop.js:750 | 无参数 | void | $, icon, E |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| refreshLockControl | src/ui/desktop.js:820 | button | void | icon, uiIconsV26 | isLocked | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| setupModals | src/ui/desktop.js:847 | 无参数 | void; void; void; void | focusModal, canAnimate, stopConfetti, animate, queueMicrotask, cancelAnimations, scan |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| focusModal | src/ui/desktop.js:849 | top | void |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| scan | src/ui/desktop.js:870 | 无参数 | DOM／状态副作用；需按调用场景确认 | canAnimate, stopConfetti, animate, queueMicrotask, focusModal, cancelAnimations |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| cancelPickerPreparation | src/ui/desktop.js:992 | 无参数 | DOM／状态副作用；需按调用场景确认 | $ |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| isPickerCurrent | src/ui/desktop.js:1005 | generation | generation === pickerGeneration &&       $("#pickerModal").classList.contains("active") | $ |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| togglePicker | src/ui/desktop.js:1011 | 无参数 | false; true; slotEngine.isSpinning; false | stopSlotSpin, $, toggleSlotSpin, showToast |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| pickerStopped | src/ui/desktop.js:1038 | 无参数 | void | $, animate, isPickerCurrent, complete |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| pickerChanged | src/ui/desktop.js:1071 | 无参数 | DOM／状态副作用；需按调用场景确认 | pickerTargetGroup, animate, $ | groups, id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| setupPicker | src/ui/desktop.js:1090 | 无参数 | DOM／状态副作用；需按调用场景确认 | $, pickerChanged |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| prepareSettlement | src/ui/desktop.js:1113 | 无参数 | DOM／状态副作用；需按调用场景确认 | $ |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| cancelSettlement | src/ui/desktop.js:1118 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| settleFromUI | src/ui/desktop.js:1121 | button | { ok: false, reason: "busy" }; { ok: false, reason: "cancelled" }; result | $, requestAnimationFrame, confirmFinalSettlement |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| init | src/ui/desktop.js:1156 | 无参数 | void; void; void | applyPreferences, syncViewport, icon, setupDock, $, applyUiIconsV26, setupSettings, setupPicker, setupModals, animate, canAnimate, renderArchives, viewChanged, renderWelcome, renderHistory, cancelAnimations |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| dayIndex | src/ui/model.js:60 | d = new Date() | Math.floor(       Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000,     ) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| daily | src/ui/model.js:65 | list, date = new Date() | list.length       ? list[((dayIndex(date) % list.length) + list.length) % list.length]       : null | dayIndex |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| differences | src/ui/model.js:70 | before, after | [...new Set([...a.keys(), ...b.keys()])].map((id) => {       const x = a.get(id),         y = b.get(; {         id,         name: y?.name ／／ x?.name,         before: x?.score ?? null,         after: y?. | Number, rank | id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| validateBank | src/ui/model.js:109 | value | value | Error |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |

## 存储键

- `godpower_state_v1`
- `godpower_ui_bank_v1`
- `godpower_ui_preferences_v1`
- `politics_admin_pin`
- `politics_audio_migration_v1`
- `politics_column_mode`
- `politics_communism_mode`
- `politics_groups_data`
- `politics_history_stack_v26`
- `politics_history_v26`
- `politics_item_global`
- `politics_item_icons`
- `politics_master_volume`
- `politics_menu_audio_cfg`
- `politics_picker_state`
- `politics_resizer_enabled`
- `politics_resizer_height`
- `politics_save_allin`
- `politics_settlement_history`
- `politics_sfx_volume`
- `politics_ui_icons_v26`
- `politics_wall_veil`
- `politics_zoom_level`

## 动画

- `attackHitBadgeV2116`
- `bounceTrophy`
- `cardFxBadge`
- `cardFxFrame`
- `cardFxSweep`
- `cardHeal`
- `cardHitFlash`
- `cardHitShake`
- `cardShield`
- `cfxBomb`
- `cfxBoo`
- `cfxBoomerangV282`
- `cfxBoost`
- `cfxBulletCard`
- `cfxCoin`
- `cfxFeatherV282`
- `cfxFireFlowerV282`
- `cfxGiantCard`
- `cfxHammer`
- `cfxHorn`
- `cfxIceFlowerV282`
- `cfxImpact`
- `cfxInkCard`
- `cfxKick`
- `cfxLightning`
- `cfxLockPulse`
- `cfxPowerCard`
- `cfxRise`
- `cfxSkid`
- `cfxStarCard`
- `goldShimmer`
- `grandScaleUp`
- `handCapsulePulse`
- `handCrystalFloat`
- `handEffectInV218`
- `handIconFloat`
- `handRevealV24`
- `hitBananaSweepV2116`
- `hitBananaV2116`
- `hitBombFlashV2116`
- `hitBombV2116`
- `hitBoomerangSweepV2116`
- `hitBoomerangV2116`
- `hitFireFlashV2116`
- `hitFireV2116`
- `hitGreenRingV2116`
- `hitGreenShellV2116`
- `hitHammerFlashV2116`
- `hitHammerV2116`
- `hitHornV2116`
- `hitHornWaveV2116`
- `hitIceFlashV2116`
- `hitIceV2116`
- `hitLightningFlashV2116`
- `hitLightningV2116`
- `hitRedLockV2116`
- `hitRedShellV2116`
- `hitSpinyFlashV2116`
- `hitSpinyV2116`
- `iceLockBlueGlowV2114`
- `itemBombHit`
- `itemDeltaFloatV21730`
- `itemMega`
- `itemPop`
- `itemRainbow`
- `itemReveal`
- `itemRouletteRevealFlat`
- `itemUseBannerV216`
- `megaOrangeGlowV2113`
- `pcFadeIn`
- `pcPopIn`
- `queuePromoteV2120`
- `rouletteEnter`
- `rouletteReveal`
- `rouletteRevealRing`
- `rouletteRevealRingLeftV281`
- `rouletteRing`
- `rouletteSwap`
- `rouletteSweep`
- `scoreRollNewV21730`
- `scoreRollOldV21730`
- `shakeTremor`
- `themeDialogInV21727`
- `v213IceAura`
- `v213MegaAura`
- `v213PowerAura`
- `v213StarAura`
- `v2162RouletteReveal`

## 静态及模板事件入口

- `DesktopUI.settleFromUI(this)`
- `DesktopUI.togglePicker()`
- `addGroup()`
- `applyBatchImport()`
- `applyQuickPersonCustomV218()`
- `applyQuickPersonScoreV218(1)`
- `applyQuickPersonScoreV218(2)`
- `applyQuickPersonScoreV218(5)`
- `applySettingsBatchMembers()`
- `batchSelectOption('A')`
- `batchSelectOption('B')`
- `batchSelectOption('C')`
- `batchSelectOption('D')`
- `batchToggleAllIn()`
- `battleBpmChange(\`
- `changeWallpaperVeil(this.value)`
- `chooseItemIcon(`
- `chooseUiIconV26(`
- `clearAllItemsV2172()`
- `clearHistoryStack()`
- `closeAbout()`
- `closeBatchImportModal()`
- `closeGrandSettlementModal()`
- `closeHandRaise()`
- `closeItemWindow()`
- `closeMemberSearchModal()`
- `closePickerModal()`
- `closePwdModal()`
- `closeQuickPersonScoreV218()`
- `closeScoreModal()`
- `closeSettlementNameModal()`
- `closeWelcomeModal()`
- `deleteBgmTrack(`
- `deleteFxTrack(`
- `deleteGroup(${g.id})`
- `deleteItemDetailGroup(${g.id})`
- `document.getElementById(`
- `enterBattleFromWelcome()`
- `event.stopPropagation()`
- `event.stopPropagation();openItemWindow(${g.id},`
- `exportAudioBundle()`
- `exportData()`
- `exportFxBundleV2175()`
- `exportItemIconPack()`
- `exportLatestSettlementCSV()`
- `finishHandItemReward()`
- `forceEndRound()`
- `globalItemDraw()`
- `godAddItem(${g.id},`
- `godAddItemV283(${gid},`
- `godAddQueueItemV2120(${g.id},`
- `godClearItems(${g.id})`
- `godClearQueueItemsV2120(${g.id})`
- `handDrawItem()`
- `handQuickScore(1)`
- `handQuickScore(2)`
- `handQuickScore(5)`
- `handUseAllTripleV218()`
- `handUseItem()`
- `handUseNewItem()`
- `handUseOneV218()`
- `handUsePrimaryV214()`
- `handleBundleFilePicked(event)`
- `handleFileImport(event)`
- `handleItemIconUpload(`
- `handleItemIconUpload(event)`
- `handleMainAction()`
- `handleMemberSearchKey(event)`
- `handleModalKey(event)`
- `handlePwdKey(event)`
- `handleScoreInputKey(event, ${g.id})`
- `handleScoreInputKey(event,${g.id})`
- `handleSoundFileUpload(event)`
- `if(event.target===this)closeQuickPersonScoreV218()`
- `importItemIconPack(event)`
- `itemCustomScore(${g.id})`
- `itemQuickScore(${g.id},-1)`
- `itemQuickScore(${g.id},-2)`
- `itemQuickScore(${g.id},1)`
- `itemQuickScore(${g.id},2)`
- `itemQuickScore(${g.id},5)`
- `judgeHandRaise(false)`
- `judgeHandRaise(true)`
- `menuBpmChange(this.value)`
- `menuEnabledChange(this.checked)`
- `menuLoopChange(\`
- `menuMeterChange(this.value)`
- `menuTrimChange(\`
- `nextRound()`
- `onWallpaperFile(this)`
- `openAbout()`
- `openHandRaise()`
- `openItemEncyclopedia()`
- `openItemWindow(${g.id},`
- `openMemberSearchModal()`
- `openPickerModal()`
- `playSound(`
- `previewBgmTrack(`
- `previewItemDetailColorV21716(this.value)`
- `renderAbout('guide')`
- `renderAbout('info')`
- `renderAbout('items')`
- `renderBgmSlotList()`
- `renderItemWindow()`
- `renderQuickPersonListV218()`
- `resetAllItemIcons()`
- `resetAllScores()`
- `resetItemIcon(`
- `resetPickerPool()`
- `resetUiIconV26(`
- `resetWallpaper()`
- `saveItemDetailColor(${g.id},this.value)`
- `saveItemGroupDetail(${g.id})`
- `scorePickerCustom()`
- `scorePickerTarget(-5)`
- `scorePickerTarget(1)`
- `scorePickerTarget(2)`
- `scorePickerTarget(5)`
- `searchMemberGroups()`
- `selectGroupOpt(${g.id},`
- `selectGroupOpt(${g.id}, `
- `selectGroupPresetColorV21716(${g.id},`
- `selectHandGroup(${g.id})`
- `setCommunismMode(this.checked)`
- `setCorrectAns('A')`
- `setCorrectAns('B')`
- `setCorrectAns('C')`
- `setCorrectAns('D')`
- `setPickerInfoTab('history')`
- `setPickerInfoTab('stats')`
- `setPickerMode('group')`
- `setPickerMode('individual')`
- `setPickerMode('two_tier')`
- `showSettingsV2(`
- `showSettingsV26(`
- `startDirectScoreEdit(${g.id})`
- `submitModalCustomScore()`
- `submitPassword()`
- `switchItemTab('detail')`
- `switchItemTab('items')`
- `switchItemTab('score')`
- `switchView(`
- `switchView('archives')`
- `switchView('archives'); closeGrandSettlementModal();`
- `switchView('battle')`
- `switchView('history')`
- `switchView('settings')`
- `switchView('welcome')`
- `toggleAllInCard(${g.id})`
- `toggleAntiRepeat(this.checked)`
- `toggleGroupPreselect(`
- `toggleLock()`
- `toggleQPSetV218(`
- `toggleQuickPersonV218(`
- `toggleResizerEnabled(this.checked)`
- `toggleSaveAllIn(this.checked)`
- `triggerFinalSettlement()`
- `triggerImport()`
- `triggerImportAudioBundle()`
- `triggerUploadAudio(`
- `undoLast()`
- `updateAdminPin()`
- `updateColumnMode(this.value)`
- `updateGroupColor(${g.id}, this.value)`
- `updateGroupName(${g.id}, this.value)`
- `updateMasterVolume(this.value)`
- `updateSfxVolumeV2176(this.value)`
- `useItem(${g.id},${i})`
- `useItem(${g.id},0)`
- `zoomIn()`
- `zoomOut()`
- `zoomReset()`