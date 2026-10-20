# 遗留代码依赖与治理清单

基线：`079df316a999ced4f598a3c3d0495786f9f8d0e8`。由 `node scripts/legacy-inventory.mjs` 生成。范围：全部旧版脚本、core、UI 与 CSS；资源内容另由构建完整性检查验证。

分类词汇：仍然必要、已被新实现取代、重复实现、确认无法触达、需要进一步测试、可安全删除。**未证明安全的项目默认需要进一步测试并保留；没有调用者的静态结果不等于不可达，HTML、字符串事件及延迟回调仍可能调用它。**

JSON 包含每个命名函数的调用依赖、变量初始化、计时器及监听器的参数、全部 CSS 叶规则正文。命名函数包含局部定义，重复名字不等于全局覆盖；包装器指标为捕获函数标识符的别名数量，不能当作完整运行时覆盖层数。

## 规模观察

|指标|基线|当前|
|---|---:|---:|
|sourceBytes|808989|1137768|
|sourceLines|19204|29771|
|functionDefinitions|783|1032|
|duplicateNames|85|108|
|extraDefinitions|194|215|
|capturedWrapperAliases|111|67|
|timerAndListenerCalls|265|382|
|cssLeafRules|1529|2185|
|exactRepeatedCssBodies|48|54|
|important|1691|1674|
|buildBytes|7635132|8197532|

## 已证明可替换／不可达的旧入口

|原位置|实现|分类|依据|
|---|---|---|---|
|src/core/classroom.js:3|buildClassroomBackup|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/core/classroom.js:15|applyClassroomBackup|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/core/classroom.js:50|importClassroomData|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/core/classroom.js:66|itemCommandSnapshot|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/core/classroom.js:67|showClassroomSaveWarning|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/core/classroom.js:75|runClassroomCommand|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/core/classroom.js:107|useItem|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/core/classroom.js:149|judgeRound|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/core/reliability.js:27|writeVerified|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/core/reliability.js:35|appendArchive|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/00.js:529|recordHistory|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/00.js:549|restoreStateFromSnapshot|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/00.js:566|undoLast|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/00.js:684|getAllReq.onsuccess|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/00.js:702|getAllReq.onerror|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/00.js:2164|legacyJudgeRound|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/00.js:2329|renderAll|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/00.js:2545|renderGrid|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/00.js:3484|setText|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/00.js:4394|tryDefend|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/00.js:4422|applyItemScore|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/00.js:4535|other|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/00.js:4736|renderGrid|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/00.js:4738|legacyJudgeRound|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/00.js:4743|restoreStateFromSnapshot|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/00.js:4744|recordHistory|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/00.js:4865|legacyJudgeRound|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/00.js:5251|persistHistoryV26|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/00.js:5260|recordHistory|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/00.js:5263|undoLast|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/00.js:5264|rollbackToHistory|确认无法触达／可安全删除|全仓库无定义或调用，typeof 分支恒不执行|
|src/script/00.js:6121|activePersistentEffect|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/00.js:6172|cleanEmptyEffectV2113|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/00.js:6180|consumeChargeV2113|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/00.js:6187|randomTargetV2113|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/00.js:6192|attackFractionV2113|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/00.js:6372|applyItemScore|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/01.js:51|renderGrid|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/01.js:127|main.onclick|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/01.js:128|more.onclick|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/01.js:189|legacyUseItem|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/02.js:13|renderGrid|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/03.js:21|renderAll|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/04.js:12|legacyJudgeRound|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/05.js:72|tryDefend|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/05.js:147|applyItemScore|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/10.js:102|renderItemFxSoundListV26|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/10.js:127|showSettingsV26|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/12.js:58|legacyUseItem|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/12.js:83|toggleAllInCard|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/12.js:96|finishStartRound|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/12.js:114|renderGrid|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/17.js:25|applyItemScore|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/17.js:45|renderAll|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/17.js:78|renderGrid|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/24.js:29|renderGrid|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/26.js:7|renderGrid|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/27.js:41|renderGrid|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/29.js:6|renderGrid|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/31.js:174|legacyUseItem|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/31.js:189|applyItemScore|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/31.js:210|renderGrid|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/36.js:241|legacyUseItem|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/36.js:353|tryDefend|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/36.js:367|applyItemScore|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/36.js:403|legacyJudgeRound|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/36.js:436|legacyUseItem|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/42.js:30|legacyUseItem|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|

## 模块保留决策

|文件|分类|保留理由|
|---|---|---|
|src/core/reliability.js|仍然必要|当前规范、命令、攻击防御、快照或兼容接口的唯一实现|
|src/script/00.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/01.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/02.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/03.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/04.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/05.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/06.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/07.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/08.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/09.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/10.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/11.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/12.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/13.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/14.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/15.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/16.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/17.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/18.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/19.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/20.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/21.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/22.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/23.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/24.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/27.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/28.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/30.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/31.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/32.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/34.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/35.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/36.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/37.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/38.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/39.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/40.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/41.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/42.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/43.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/44.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/script/45.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/style/00.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/style/01.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/style/02.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/style/03.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/style/04.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/style/05.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/style/06.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/style/07.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/style/08.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/style/09.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/style/10.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/style/11.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/style/12.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/style/13.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/style/14.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/style/15.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/style/16.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/style/17.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/style/18.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/style/19.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/style/20.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/style/21.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/style/22.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/style/23.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/desktop.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/desktop.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/model.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/core/action-sounds.js|仍然必要|当前规范、命令、攻击防御、快照或兼容接口的唯一实现|
|src/core/history.js|仍然必要|当前规范、命令、攻击防御、快照或兼容接口的唯一实现|
|src/core/item-module-model.js|仍然必要|当前规范、命令、攻击防御、快照或兼容接口的唯一实现|
|src/core/item-modules.js|仍然必要|当前规范、命令、攻击防御、快照或兼容接口的唯一实现|
|src/core/item-score.js|仍然必要|当前规范、命令、攻击防御、快照或兼容接口的唯一实现|
|src/core/picker-bridge.js|仍然必要|当前规范、命令、攻击防御、快照或兼容接口的唯一实现|
|src/ui/application-surfaces.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/battle-grid.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/battle-motion.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/battle-motion.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/classroom-feedback.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/classroom-feedback.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/classroom-recovery.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/classroom-roster-workspace.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/contribution-registry.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/disposable-scope.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/electron-host.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/electron-windows.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/item-modules.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/item-modules.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/migration.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/miyamoto-plugin.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/official-marx-theme.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/official-miyamoto-plugin.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/plugin-appearance.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/plugin-center.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/plugin-center.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/render.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/round-feedback.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/teaching-resource-workspace.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/teaching-workspace.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/themes.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/themes.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/tooltips.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/tooltips.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/welcome-v2.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/welcome-v2.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|

## 全部脚本／函数及调用依赖

|位置|名称|类型|分类|直接及嵌套调用（不表示均已执行）|
|---|---|---|---|---|
|src/core/reliability.js:6|validateBackup|declaration|仍然必要|Array.isArray, Error, [1, schemaVersion].includes, StableIdentity.isValidSeasonId, AchievementLedger.normalize, data.groups.forEach, StableIdentity.isValidGroupUid, groupUids.has, groupUids.add, Number.isSafeInteger, Number, g.members.some, g.inventory?.some, ["individual", "group", "two_tier", ""].includes, values.some, ["string", "number"].includes, Object.values(eligible).some, Object.values, Object.values(throttle.groupStrongSkip).some, validateBackup|
|src/core/reliability.js:217|phase|declaration|仍然必要||
|src/core/reliability.js:223|validateItem|declaration|仍然必要|Number, [         "triple_green",         "triple_red",         "triple_banana",         "triple_mushroom",       ].includes, ["star", "mega", "power"].includes|
|src/core/reliability.js:248|onDefenseInvalidation|declaration|仍然必要|defenseInvalidationHandlers.add, defenseInvalidationHandlers.delete|
|src/core/reliability.js:254|invalidateDefenseDecisions|declaration|仍然必要|handler|
|src/core/reliability.js:261|captureDefenseDecision|declaration|仍然必要|Array.isArray, s.groups.includes, phase|
|src/core/reliability.js:288|isDefenseDecisionCurrent|declaration|仍然必要|Array.isArray, s.groups.find, phase, Object.is|
|src/core/reliability.js:312|planBatchScoreChanges|declaration|仍然必要|Number.isSafeInteger, Error, Array.isArray, groups.map, groupCounts.map, groupMap.get, Number|
|src/core/reliability.js:334|safeImage|declaration|仍然必要|/^data:image\/(?:png／jpe?g／webp／gif);base64,[a-zA-Z0-9+/=\s]+$/.test|
|src/core/reliability.js:342|count|declaration|仍然必要|Number, Number.isSafeInteger|
|src/core/reliability.js:346|normalizeStats|declaration|仍然必要|Object.fromEntries, ["correct", "wrong", "draws", "used"].map, count|
|src/core/reliability.js:351|normalizeEffect|declaration|仍然必要|Array.isArray, ["star", "mega", "power", "bullet"].includes, Object.hasOwn, count, Object.keys|
|src/core/reliability.js:368|calculateRoundScores|declaration|仍然必要|CompetitionRules.calculateRound(s).map, CompetitionRules.calculateRound|
|src/core/reliability.js:373|csvText|declaration|仍然必要|String, /^[\s]*[=+@-]/.test|
|src/script/00.js:2|showClassroomWindow|declaration|需要进一步测试|DesktopUI.cancelWindowClose, root.classList.add|
|src/script/00.js:7|hideClassroomWindow|declaration|需要进一步测试|root.classList.remove, DesktopUI.dismissWindow, commit|
|src/script/00.js:17|readableTextOnColor|declaration|需要进一步测试|String(hex／／'').trim().replace, String(hex／／'').trim, String, raw.split('').map(x=>x+x).join, raw.split('').map, raw.split, /^[0-9a-f]{6}$/i.test, [0,2,4].map(i=>parseInt(value.slice(i,i+2),16)/255).map, [0,2,4].map, parseInt, value.slice, Math.pow, [23,48,45].map(v=>v/255).map, [23,48,45].map|
|src/script/00.js:80|clone|binding|需要进一步测试|JSON.parse, JSON.stringify|
|src/script/00.js:131|normalizeGroup|declaration|需要进一步测试|Number, Number.isFinite, Date.now, Number.isSafeInteger, /^#[0-9a-fA-F]{6}$/.test, String, Array.isArray, source.members.map(v => String(v ?? '').trim()).filter, source.members.map, String(v ?? '').trim, StableIdentity.isValidGroupUid, StableIdentity.createGroupUid, String(source.name ?? 第 ${index + 1} 组).trim, Math.trunc, ['A','B','C','D'].includes, source.inventory.map, Reliability.normalizeStats, Reliability.normalizeEffect, Math.max|
|src/script/00.js:165|normalizeAllGroups|declaration|需要进一步测试|StableIdentity.assignGroupUids(Array.isArray(groups) ? groups : []).map, StableIdentity.assignGroupUids, Array.isArray, normalizeGroup, seen.has, Date.now, seen.add|
|src/script/00.js:176|initSessionState|declaration|需要进一步测试|normalizeAllGroups, ['individual','group','two_tier'].includes, Array.isArray, state.groups.forEach|
|src/script/00.js:225|checkAllInRatio|declaration|需要进一步测试|state.groups.filter|
|src/script/00.js:236|getSettlementHistory|declaration|需要进一步测试|STORAGE.getJSON|
|src/script/00.js:240|saveSettlementRecord|declaration|需要进一步测试|buildSettlementClearedDataV21813, Reliability.appendArchive|
|src/script/00.js:246|triggerFinalSettlement|declaration|需要进一步测试|ClassroomWriteBarrier.allow, themeAlert, openPwdModal, now.getFullYear, String(now.getMonth() + 1).padStart, String, now.getMonth, String(now.getDate()).padStart, now.getDate, document.getElementById, DesktopUI.prepareSettlement, showClassroomWindow, setTimeout, input.focus, input.select|
|src/script/00.js:267|closeSettlementNameModal|declaration|需要进一步测试|DesktopUI.cancelSettlement, hideClassroomWindow, document.getElementById|
|src/script/00.js:272|confirmFinalSettlement|declaration|需要进一步测试|ClassroomWriteBarrier.conflict, showToast, Reliability.invalidateDefenseDecisions, openPwdModal, state.groups.some, document.getElementById, input.value.trim, closeSettlementNameModal, [...state.groups].sort, Number, Date.now, new Date().toLocaleDateString, new Date().toLocaleString, state.groups.reduce, clone, AchievementLedger.normalize, saveSettlementRecord, themeAlert, recordHistory, bgmStopAll, renderControls, playSound, setTimeout, escapeHtml, showClassroomWindow, initConfetti, resetCompetitionDataAfterSettlementV21812, saveState, renderAll|
|src/script/00.js:356|initConfetti|declaration|需要进一步测试|document.getElementById, canvas.getContext, confettiParticles.push, Math.random, Math.floor, ctx.clearRect, confettiParticles.forEach, ctx.save, ctx.translate, ctx.rotate, ctx.fillRect, ctx.restore, requestAnimationFrame, cancelAnimationFrame, loop|
|src/script/00.js:379|loop|declaration|需要进一步测试|ctx.clearRect, confettiParticles.forEach, ctx.save, ctx.translate, ctx.rotate, ctx.fillRect, ctx.restore, requestAnimationFrame|
|src/script/00.js:400|stopConfetti|declaration|需要进一步测试|cancelAnimationFrame|
|src/script/00.js:407|closeGrandSettlementModal|declaration|需要进一步测试|hideClassroomWindow, document.getElementById, stopConfetti|
|src/script/00.js:412|openSettlementHistoryModal|declaration|需要进一步测试|switchView|
|src/script/00.js:416|closeSettlementHistoryModal|declaration|需要进一步测试|switchView|
|src/script/00.js:420|renderArchiveClassStats|declaration|需要进一步测试|document.getElementById, state.groups.reduce, Number, metrics.map(([label,value,unit]) => <div class="archive-stat-card"><b>${value}<small>${unit}</small></b><span>${label}</span></div>).join, metrics.map|
|src/script/00.js:437|renderSettlementHistoryList|declaration|需要进一步测试|DesktopUI.renderArchives|
|src/script/00.js:441|exportSingleSettlementCSV|declaration|需要进一步测试|getSettlementHistory, record.groups.forEach, (g.members ／／ []).join, g.name.replace, members.replace, URL.createObjectURL, document.createElement, (record.title ／／ '课堂最终结算').replace, a.click, URL.revokeObjectURL, showToast|
|src/script/00.js:462|exportLatestSettlementCSV|declaration|需要进一步测试|getSettlementHistory, themeAlert, exportSingleSettlementCSV|
|src/script/00.js:471|deleteSettlementRecord|declaration|需要进一步测试|themeAlert, openPwdModal, themeConfirm, getSettlementHistory, list.splice, STORAGE.setJSON, renderSettlementHistoryList, showToast|
|src/script/00.js:492|scheduleIdleTask|declaration|需要进一步测试|window.requestIdleCallback, window.setTimeout, Math.min|
|src/script/00.js:499|refreshSoundIdCache|declaration|需要进一步测试|resolve, db.transaction, tx.objectStore, store.getAllKeys|
|src/script/00.js:506|req.onsuccess|assignment|需要进一步测试|resolve|
|src/script/00.js:510|req.onerror|assignment|需要进一步测试|resolve|
|src/script/00.js:517|hasSound|declaration|需要进一步测试|soundIdCache.has|
|src/script/00.js:535|getSecPerBeat|declaration|需要进一步测试|Number, Math.max|
|src/script/00.js:541|getSecPerBar|declaration|需要进一步测试|getSecPerBeat, Math.max, Number|
|src/script/00.js:543|getTrackCurrentBeat|declaration|需要进一步测试|Math.max, getSecPerBeat|
|src/script/00.js:567|openHistoryModal|declaration|需要进一步测试|switchView|
|src/script/00.js:571|closeHistoryModal|declaration|需要进一步测试|switchView|
|src/script/00.js:575|renderHistoryList|declaration|需要进一步测试|DesktopUI.renderHistory|
|src/script/00.js:579|toggleHistExpand|declaration|需要进一步测试|document.querySelectorAll, node.classList.toggle|
|src/script/00.js:585|clearHistoryStack|declaration|需要进一步测试|HistoryCommands.clear|
|src/script/00.js:589|revertToHistory|declaration|需要进一步测试|HistoryCommands.revert|
|src/script/00.js:593|initDB|declaration|需要进一步测试|indexedDB.open, database.objectStoreNames.contains, database.createObjectStore, refreshSoundIdCache, resolve, scheduleBackgroundAudioInit|
|src/script/00.js:600|request.onupgradeneeded|assignment|需要进一步测试|database.objectStoreNames.contains, database.createObjectStore|
|src/script/00.js:607|request.onsuccess|assignment|需要进一步测试|refreshSoundIdCache, resolve, scheduleBackgroundAudioInit|
|src/script/00.js:614|request.onerror|assignment|需要进一步测试|resolve|
|src/script/00.js:623|scheduleBackgroundAudioInit|declaration|需要进一步测试|scheduleIdleTask, STORAGE.get, migrateOldDatabases, console.warn, showToast, refreshSoundIdCache, loadFxSounds|
|src/script/00.js:645|migrateOldDatabases|declaration|需要进一步测试|LegacyAudioMigration.run|
|src/script/00.js:649|getAudioContext|declaration|需要进一步测试|audioCtx.createGain, masterGainNode.gain.setValueAtTime, masterGainNode.connect, bgmEngine.battleGain.connect, bgmEngine.thinkingGain.connect, Promise.race, audioCtx.resume, setTimeout, res|
|src/script/00.js:673|loadFxSounds|declaration|需要进一步测试|async () => {     try {       const records = await new Promise(resolve => {         const tx = db.transaction('sounds', 'readonly');         const store = tx.objectStore('sounds');         const req = store.getAll();         req.onsuccess = () => resolve(req.result ／／ []);         req.onerror = () => resolve([]);       });        const ctx = await getAudioContext();       const fxRecords = records.filter(item =>         item && typeof item.id === 'string' &&         item.id.startsWith('fx_') &&         item.arrayBuffer && item.arrayBuffer.byteLength > 0       );        const variants = Object.create(null);       await Promise.all(fxRecords.map(async item => {         try {           const decoded = await ctx.decodeAudioData(item.arrayBuffer.slice(0));           const key=item.id.slice(3),split=key.indexOf('::variant::');           if(split>=0){const slot=key.slice(0,split);(variants[slot]／／=[]).push({id:item.id,name:item.name／／'候选音效',buffer:decoded});}           else customFxBuffers[key] = decoded;         } catch (_) {}       }));        Object.values(variants).forEach(list=>list.sort((a,b)=>a.id.localeCompare(b.id)));       customFxVariants=variants;       fxSoundsLoaded = true;     } catch (_) {     } finally {       fxSoundsLoading = null;     }   }, db.transaction, tx.objectStore, store.getAll, resolve, getAudioContext, records.filter, item.id.startsWith, Object.create, Promise.all, fxRecords.map, ctx.decodeAudioData, item.arrayBuffer.slice, item.id.slice, key.indexOf, key.slice, (variants[slot]／／=[]).push, Object.values(variants).forEach, Object.values, list.sort, a.id.localeCompare|
|src/script/00.js:683|req.onsuccess|assignment|需要进一步测试|resolve|
|src/script/00.js:684|req.onerror|assignment|需要进一步测试|resolve|
|src/script/00.js:717|selectFxBuffer|declaration|需要进一步测试|[customFxBuffers[slotId],...(customFxVariants[slotId]／／[]).map(x=>x.buffer)].filter, (customFxVariants[slotId]／／[]).map, Math.min, Math.max, Math.floor, random|
|src/script/00.js:723|renderFxChoices|declaration|需要进一步测试|choices.map((x,i)=><div class="cf-audio-choice"><span>${escapeHtml(x.name／／'候选 '+(i+1))}</span><button class="btn btn-sm" data-fx-remove="${escapeHtml(x.id)}" onclick="deleteFxCandidate(this.dataset.fxRemove)">移除</button></div>).join, choices.map, escapeHtml|
|src/script/00.js:727|deleteFxCandidate|declaration|需要进一步测试|id.includes, db.transaction, reject, tx.objectStore('sounds').delete, tx.objectStore, id.slice, id.indexOf, (customFxVariants[slot]／／[]).filter, soundIdCache.delete, renderFxSlotList, renderItemFxSoundListV26, showToast|
|src/script/00.js:730|tx.onerror|assignment|需要进一步测试|reject|
|src/script/00.js:730|tx.onabort|assignment|需要进一步测试|reject|
|src/script/00.js:736|checkSetCompleteness|declaration|需要进一步测试|Promise.resolve, hasSound, refreshSoundIdCache().then, refreshSoundIdCache, doCheck|
|src/script/00.js:739|doCheck|binding|需要进一步测试|hasSound|
|src/script/00.js:770|getAllCompleteSetIndices|declaration|需要进一步测试|checkSetCompleteness, completeIndices.push|
|src/script/00.js:779|getFallbackSetIndex|declaration|需要进一步测试|checkSetCompleteness|
|src/script/00.js:787|pickNextPlayableSetIndex|declaration|需要进一步测试|getAllCompleteSetIndices, bgmShufflePool.filter, completeSets.includes, Math.floor, Math.random, bgmShufflePool.shift, getFallbackSetIndex|
|src/script/00.js:809|fetchAndDecodeSetBuffers|declaration|需要进一步测试|db.transaction, tx.objectStore, resolve, SET_TRACK_TYPES.forEach, store.get, getAudioContext, Object.entries, onProgress, Promise.all, entries.map, ctx.decodeAudioData, ab.slice, Math.round|
|src/script/00.js:827|req.onsuccess|assignment|需要进一步测试|resolve|
|src/script/00.js:832|req.onerror|assignment|需要进一步测试|resolve|
|src/script/00.js:867|bgmPreloadNextSet|declaration|需要进一步测试|pickNextPlayableSetIndex, fetchAndDecodeSetBuffers|
|src/script/00.js:883|playChiptuneSynth|declaration|需要进一步测试|ActionSounds.slots.find, audioCtx.createOscillator, audioCtx.createGain, osc.frequency.setValueAtTime, gain.gain.setValueAtTime, gain.gain.exponentialRampToValueAtTime, osc.connect, gain.connect, getFxOutputV2176, osc.start, osc.stop, osc.frequency.exponentialRampToValueAtTime, freqs.forEach, [523.25, 783.99].forEach, notes.forEach, gain.gain.linearRampToValueAtTime, ClassroomFeedback.getOptions, Math.random, [1046.50, 1567.98].forEach|
|src/script/00.js:1019|playSound|declaration|需要进一步测试|getAudioContext, loadFxSounds, selectFxBuffer, ActionSounds.isClick, audioCtx.createBufferSource, audioCtx.createGain, ClassroomFeedback.getOptions, source.connect, gain.connect, getFxOutputV2176, ClassroomFeedback.ownClickVoice, source.start, playChiptuneSynth|
|src/script/00.js:1038|clearAllLoopTimeouts|declaration|需要进一步测试|activeLoopTimeouts.forEach, clearTimeout|
|src/script/00.js:1043|scheduleDualLoopChunk|declaration|需要进一步测试|getSecPerBeat, Math.max, audioCtx.createBufferSource, bSrc.connect, bSrc.start, bSrc.stop, bgmEngine.activeNodes.push, tSrc.connect, tSrc.start, tSrc.stop, setTimeout, scheduleDualLoopChunk, activeLoopTimeouts.push|
|src/script/00.js:1086|bgmStartNewRoundMusicWithProgress|declaration|需要进一步测试|onProgress, getAudioContext, bgmStopAll, pickNextPlayableSetIndex, fetchAndDecodeSetBuffers, audioCtx.createBufferSource, introSrc.connect, introSrc.start, bgmEngine.activeNodes.push, checkAllInRatio, bgmEngine.thinkingGain.gain.setValueAtTime, bgmEngine.battleGain.gain.setValueAtTime, scheduleDualLoopChunk, setTimeout, bgmPreloadNextSet|
|src/script/00.js:1157|bgmTransitionThinkingToBattle|declaration|需要进一步测试|getAudioContext, getSecPerBeat, getTrackCurrentBeat, Number, Math.ceil, clearTimeout, bgmEngine.thinkingGain.gain.cancelScheduledValues, bgmEngine.battleGain.gain.cancelScheduledValues, bgmEngine.thinkingGain.gain.setValueAtTime, bgmEngine.thinkingGain.gain.linearRampToValueAtTime, audioCtx.createBufferSource, transSrc.connect, transSrc.start, bgmEngine.activeNodes.push, Math.max, bgmEngine.battleGain.gain.setValueAtTime, bgmEngine.battleGain.gain.linearRampToValueAtTime, setTimeout, checkAllInRatio, bgmTransitionBattleToThinking|
|src/script/00.js:1248|bgmTransitionBattleToThinking|declaration|需要进一步测试|getAudioContext, clearTimeout, getSecPerBeat, getTrackCurrentBeat, Math.ceil, getSecPerBar, bgmEngine.battleGain.gain.cancelScheduledValues, bgmEngine.thinkingGain.gain.cancelScheduledValues, bgmEngine.battleGain.gain.setValueAtTime, bgmEngine.battleGain.gain.linearRampToValueAtTime, bgmEngine.thinkingGain.gain.setValueAtTime, bgmEngine.thinkingGain.gain.linearRampToValueAtTime|
|src/script/00.js:1287|bgmTriggerVictory|declaration|需要进一步测试|callback, getAudioContext, getSecPerBeat, getTrackCurrentBeat, clearTimeout, clearAllLoopTimeouts, bgmEngine.battleGain.gain.cancelScheduledValues, bgmEngine.thinkingGain.gain.cancelScheduledValues, bgmEngine.battleGain.gain.setValueAtTime, bgmEngine.battleGain.gain.linearRampToValueAtTime, bgmEngine.thinkingGain.gain.setValueAtTime, bgmEngine.thinkingGain.gain.linearRampToValueAtTime, setTimeout, bgmEngine.battleSource.stop, bgmEngine.thinkingSource.stop, bgmEngine.activeNodes.forEach, item.stop, Math.max, audioCtx.createBufferSource, victorySrc.connect, victorySrc.start, bgmStopAll|
|src/script/00.js:1348|victorySrc.onended|assignment|需要进一步测试|bgmStopAll, callback|
|src/script/00.js:1368|bgmStopAll|declaration|需要进一步测试|clearAllLoopTimeouts, clearTimeout, bgmEngine.victoryNode.stop, bgmEngine.activeNodes.forEach, item.stop, bgmEngine.battleGain.gain.cancelScheduledValues, bgmEngine.thinkingGain.gain.cancelScheduledValues, bgmEngine.battleGain.gain.setValueAtTime, bgmEngine.thinkingGain.gain.setValueAtTime|
|src/script/00.js:1411|showToast|declaration|需要进一步测试|document.getElementById, clearTimeout, String, t.showPopover, console.warn, t.classList.add, setTimeout, t.classList.remove, t.matches, t.hidePopover|
|src/script/00.js:1428|getPersistableGroups|declaration|需要进一步测试|state.groups.map, Number.isFinite, Number, Math.trunc|
|src/script/00.js:1436|saveState|declaration|需要进一步测试|showClassroomSaveWarning, classroomCommands.isPending, ensureV2State, Array.isArray, AchievementLedger.apply, buildClassroomBackup, Reliability.writeVerified, document.getElementById, mirrors.filter(([k,v])=>!STORAGE.setJSON(k,v)).map, mirrors.filter, STORAGE.setJSON, Object.entries, STORAGE.set, failed.push, showToast|
|src/script/00.js:1477|applyZoom|declaration|需要进一步测试|Math.max, Math.min, DesktopUI.syncViewport, STORAGE.set, showToast, Math.round|
|src/script/00.js:1485|zoomIn|declaration|需要进一步测试|applyZoom, Math.round|
|src/script/00.js:1489|zoomOut|declaration|需要进一步测试|applyZoom, Math.round|
|src/script/00.js:1493|zoomReset|declaration|需要进一步测试|applyZoom|
|src/script/00.js:1497|toggleResizerEnabled|declaration|需要进一步测试|saveState, updateResizerUI|
|src/script/00.js:1503|toggleSaveAllIn|declaration|需要进一步测试|saveState|
|src/script/00.js:1508|updateColumnMode|declaration|需要进一步测试|saveState, renderGrid|
|src/script/00.js:1514|updateResizerUI|declaration|需要进一步测试|document.getElementById|
|src/script/00.js:1521|initResizerDrag|declaration|需要进一步测试|document.getElementById, handle.setPointerCapture, e.preventDefault, handle.hasPointerCapture, Math.max, Math.min, handle.releasePointerCapture, saveState, showToast|
|src/script/00.js:1529|handle.onpointerdown|assignment|需要进一步测试|handle.setPointerCapture, e.preventDefault|
|src/script/00.js:1536|handle.onpointermove|assignment|需要进一步测试|handle.hasPointerCapture, Math.max, Math.min|
|src/script/00.js:1544|handle.onpointerup|assignment|需要进一步测试|handle.hasPointerCapture, handle.releasePointerCapture, saveState, showToast|
|src/script/00.js:1553|toggleLock|declaration|需要进一步测试|openPwdModal, showToast, renderAll|
|src/script/00.js:1562|openPwdModal|declaration|需要进一步测试|document.getElementById, showClassroomWindow, setTimeout, document.getElementById('pwdInput').focus|
|src/script/00.js:1568|closePwdModal|declaration|需要进一步测试|hideClassroomWindow, document.getElementById|
|src/script/00.js:1572|handlePwdKey|declaration|需要进一步测试|event.preventDefault, submitPassword, closePwdModal|
|src/script/00.js:1577|submitPassword|declaration|需要进一步测试|document.getElementById('pwdInput').value.trim, document.getElementById, closePwdModal, showToast, renderAll, themeAlert, input.focus|
|src/script/00.js:1592|updateAdminPin|declaration|需要进一步测试|document.getElementById('newPwdInput').value.trim, document.getElementById, themeAlert, saveState, showToast|
|src/script/00.js:1604|handleMainAction|declaration|需要进一步测试|startRound, judgeRound|
|src/script/00.js:1612|preloadInitialAudio|declaration|需要进一步测试|getAudioContext, bgmPreloadNextSet|
|src/script/00.js:1621|startRound|declaration|需要进一步测试|Reliability.invalidateDefenseDecisions, RoundSettlement.captureRoundToken, document.getElementById, getAudioContext, Promise.race, hasAnyPlayableBgm, setTimeout, res, RoundSettlement.isRoundTokenCurrent, showToast, finishStartRound, bgmStartNewRoundMusicWithProgress, playSound|
|src/script/00.js:1696|finishStartRound|declaration|需要进一步测试|RoundSettlement.start|
|src/script/00.js:1700|hasAnyPlayableBgm|declaration|需要进一步测试|initDB, refreshSoundIdCache, getAllCompleteSetIndices, getFallbackSetIndex|
|src/script/00.js:1715|nextRound|declaration|需要进一步测试|themeAlert, Reliability.invalidateDefenseDecisions, RoundSettlement.captureRoundToken, document.getElementById, bgmStopAll, bgmStartNewRoundMusicWithProgress, RoundSettlement.isRoundTokenCurrent, showToast, playSound, captureCardRectsV21725, runClassroomCommand, resetRoundItemUseLocksV2177, state.groups.forEach, classroomCommands.whenIdle, checkAllInRatio, bgmTransitionThinkingToBattle, bgmTransitionBattleToThinking, animateCardsFromSnapshotV21725|
|src/script/00.js:1787|forceEndRound|declaration|需要进一步测试|RoundSettlement.forceEnd|
|src/script/00.js:1791|applySettingsBatchMembers|declaration|需要进一步测试|openPwdModal, document.getElementById('settingsBatchMemberText').value.trim, document.getElementById, themeAlert, text.split('\n').map(l => l.trim()).filter, text.split('\n').map, text.split, l.trim, lines.forEach, line.includes, line.split, parts[0].trim, parts.slice(1).join(delimiter).trim, parts.slice(1).join, parts.slice, membersStr.split(/[,，、\s]+/).map(m => m.trim()).filter, membersStr.split(/[,，、\s]+/).map, membersStr.split, m.trim, state.groups.find, g.name.trim, newGroups.push, Date.now, Array.from, saveState, renderAll, updatePickerPoolUI, showToast, closeSoundModal|
|src/script/00.js:1834|batchSelectOption|declaration|需要进一步测试|AnswerCommands.batchSelect|
|src/script/00.js:1837|batchToggleAllIn|declaration|需要进一步测试|AnswerCommands.batchToggleAllIn|
|src/script/00.js:1841|openScoreModal|declaration|需要进一步测试|event.preventDefault, event.stopPropagation, state.groups.find, document.getElementById, inputEl.classList.remove, showClassroomWindow, setTimeout, document.getElementById('modalCustomInput').focus|
|src/script/00.js:1860|closeScoreModal|declaration|需要进一步测试|hideClassroomWindow, document.getElementById|
|src/script/00.js:1865|submitModalScore|declaration|需要进一步测试|closeScoreModal, applyScoreDelta|
|src/script/00.js:1872|handleModalKey|declaration|需要进一步测试|event.preventDefault, submitModalCustomScore, closeScoreModal|
|src/script/00.js:1881|submitModalCustomScore|declaration|需要进一步测试|document.getElementById, input.value.trim()     .replace(/[－—–−]/g, '-')     .replace, input.value.trim()     .replace, input.value.trim, String.fromCharCode, c.charCodeAt, input.classList.add, input.focus, input.select, /^[+-]?\d+$/.test, fail, parseInt, Number.isSafeInteger, closeScoreModal, applyScoreDelta|
|src/script/00.js:1890|fail|binding|需要进一步测试|input.classList.add, input.focus, input.select|
|src/script/00.js:1904|showMilestoneBanner|declaration|需要进一步测试|document.querySelector, card.querySelector, card.classList.add, banner.classList.add, setTimeout, banner.classList.remove, card.classList.remove|
|src/script/00.js:1920|cancelScoreAnimationAndSync|declaration|需要进一步测试|cancelItemScoreAnimations, cancelAnimationFrame, state.groups.forEach|
|src/script/00.js:1929|animateScores|declaration|需要进一步测试|cancelAnimationFrame, performance.now, Math.min, Math.pow, scoreUpdates.forEach, Math.round, state.groups.find, document.getElementById, renderChart, renderDashboard, requestAnimationFrame, updateHeaderStats, onComplete|
|src/script/00.js:1937|tick|declaration|需要进一步测试|Math.min, Math.pow, scoreUpdates.forEach, Math.round, state.groups.find, document.getElementById, renderChart, renderDashboard, requestAnimationFrame, updateHeaderStats, onComplete|
|src/script/00.js:1972|applyScoreDelta|declaration|需要进一步测试|ManualScoreCommands.adjust|
|src/script/00.js:1976|startDirectScoreEdit|declaration|需要进一步测试|openPwdModal, renderGrid|
|src/script/00.js:1982|handleScoreInputKey|declaration|需要进一步测试|finishDirectScoreEdit, renderGrid|
|src/script/00.js:1990|finishDirectScoreEdit|declaration|需要进一步测试|cancelScoreAnimationAndSync, document.getElementById, state.groups.find, Number, Number.isSafeInteger, showToast, ManualScoreCommands.set, renderGrid|
|src/script/00.js:2005|selectGroupOpt|declaration|需要进一步测试|AnswerCommands.select|
|src/script/00.js:2008|toggleAllInCard|declaration|需要进一步测试|AnswerCommands.toggleAllIn|
|src/script/00.js:2012|setCorrectAns|declaration|需要进一步测试|AnswerCommands.correct|
|src/script/00.js:2016|settleBaseRoundLegacy|declaration|需要进一步测试|themeAlert, captureCardRectsV21725, CompetitionRules.calculateRound, state.groups.forEach, scoreUpdates.push, Math.floor(Math.abs(oldScore)).toString, Math.floor, Math.abs, Math.floor(Math.abs(g.score)).toString, milestoneGroups.push|
|src/script/00.js:2068|openMemberSearchModal|declaration|需要进一步测试|document.getElementById, backdrop.classList.add, setTimeout, input.focus|
|src/script/00.js:2079|closeMemberSearchModal|declaration|需要进一步测试|document.getElementById, hideClassroomWindow|
|src/script/00.js:2084|handleMemberSearchKey|declaration|需要进一步测试|event.preventDefault, searchMemberGroups, closeMemberSearchModal|
|src/script/00.js:2094|searchMemberGroups|declaration|需要进一步测试|document.getElementById, input.value.trim().toLowerCase, input.value.trim, state.groups.forEach, Array.isArray, members.forEach, String(member).trim, String, name.toLowerCase().includes, name.toLowerCase, matches.push, escapeHtml, matches.map(item => {     const g = item.group;     const memberList = (Array.isArray(g.members) ? g.members : [])       .map(escapeHtml).join('、');     return        <div class="member-search-result">         <div class="member-search-result-name">${escapeHtml(item.name)}</div>         <div class="member-search-result-group">${escapeHtml(g.name)}</div>         <div class="member-search-result-members">成员：${memberList ／／ '暂无成员'}</div>       </div>;   }).join, matches.map, (Array.isArray(g.members) ? g.members : [])       .map(escapeHtml).join, (Array.isArray(g.members) ? g.members : [])       .map|
|src/script/00.js:2137|updateQuickBatchBar|declaration|需要进一步测试|document.getElementById, bar.classList.add, bar.classList.remove|
|src/script/00.js:2147|updateHeaderStats|declaration|需要进一步测试|document.getElementById, GodpowerUIModel.standings, ranking, Number, Date.now, escapeHtml|
|src/script/00.js:2159|renderChart|declaration|需要进一步测试|document.getElementById, [...state.groups].sort, Math.max, sorted.map, Array.from, wrapper.querySelectorAll, g.id.toString, existingRows.forEach, currentIds.has, r.getAttribute, r.remove, sorted.forEach, wrapper.querySelector, document.createElement, row.setAttribute, escapeHtml, wrapper.appendChild, row.querySelector, formatChartScoreV294|
|src/script/00.js:2227|renderDashboard|declaration|需要进一步测试|document.getElementById, [...state.groups].sort, escapeHtml, getScoreText, state.groups.filter, state.groups.reduce, (totalScore / totalGroups).toFixed|
|src/script/00.js:2240|getScoreText|binding|需要进一步测试||
|src/script/00.js:2271|renderLockStatus|declaration|需要进一步测试|document.getElementById, addBtn.classList.add, importBtn.classList.add, resetBtn.classList.add, undoBtn.classList.add, addBtn.classList.remove, importBtn.classList.remove, resetBtn.classList.remove, undoBtn.classList.remove, DesktopUI.refreshLockControl|
|src/script/00.js:2297|renderControls|declaration|需要进一步测试|document.getElementById, mainActionBtn.classList.remove, nextBtn.classList.add, forceBtn.classList.add, forceBtn.classList.remove, mainActionBtn.classList.add, nextBtn.classList.remove, document.querySelectorAll, btns.forEach, btn.classList.add, btn.classList.remove, updateQuickBatchBar|
|src/script/00.js:2345|openPickerModal|declaration|需要进一步测试|window.godpowerDesktop.openPicker, document.getElementById('pickerModal').classList.contains, document.getElementById, DesktopUI.cancelPickerPreparation, showClassroomWindow, updatePickerView, updatePickerPoolUI, resetSlotDisplay|
|src/script/00.js:2355|closePickerModal|declaration|需要进一步测试|stopSlotSpin, DesktopUI.cancelPickerPreparation, window.GodpowerPicker?.notify, hideClassroomWindow, document.getElementById, document.getElementById('slotResultPanel').classList.remove|
|src/script/00.js:2363|setPickerMode|declaration|需要进一步测试|window.GodpowerPicker?.isSettling, DesktopUI.cancelPickerPreparation, ['btnModeInd', 'btnModeGrp', 'btnModeTwo'].forEach, document.getElementById(id).classList.remove, document.getElementById, document.getElementById('btnModeInd').classList.add, document.getElementById('btnModeGrp').classList.add, document.getElementById('btnModeTwo').classList.add, updatePickerView, updatePickerPoolUI, resetSlotDisplay|
|src/script/00.js:2376|updatePickerView|declaration|需要进一步测试|document.getElementById, renderTwoTierChips|
|src/script/00.js:2393|renderTwoTierChips|declaration|需要进一步测试|document.getElementById, Array.isArray, state.groups.filter, groups.map(g => {     const on = pre.includes(g.id);     const style = on ? ('border-color:' + g.color + '; color:#fff; background:' + g.color + ';') : '';     return '<button type="button" class="two-tier-chip ' + (on ? 'active' : '') + '" style="' + style + '" onclick="toggleGroupPreselect(' + g.id + ')">' + escapeHtml(g.name) + '<span style="opacity:.75; font-size:11px; margin-left:4px;">' + g.members.length + '人</span></button>';   }).join, groups.map, pre.includes, escapeHtml|
|src/script/00.js:2405|toggleGroupPreselect|declaration|需要进一步测试|Array.isArray, state.picker.preselectedGroupIds.slice, pre.indexOf, pre.splice, pre.push, saveState, renderTwoTierChips, updatePickerPoolUI, resetSlotDisplay|
|src/script/00.js:2418|resetSlotDisplay|declaration|需要进一步测试|window.GodpowerPicker?.notify, document.getElementById, document.getElementById('slotResultPanel').classList.remove|
|src/script/00.js:2430|toggleAntiRepeat|declaration|需要进一步测试|saveState, updatePickerPoolUI|
|src/script/00.js:2436|resetPickerPool|declaration|需要进一步测试|saveState, updatePickerPoolUI, showToast|
|src/script/00.js:2444|getAvailablePool|declaration|需要进一步测试|grps.filter, state.picker.pickedGroupIds.includes, state.groups.filter, Array.isArray, pre.includes, grps.forEach, (g.members ／／ []).forEach, students.push, students.filter, state.picker.pickedStudentKeys.includes, state.groups.forEach|
|src/script/00.js:2496|updatePickerPoolUI|declaration|需要进一步测试|getAvailablePool, document.getElementById|
|src/script/00.js:2507|toggleSlotSpin|declaration|需要进一步测试|startSlotSpin, stopSlotSpin|
|src/script/00.js:2512|startSlotSpin|declaration|需要进一步测试|DesktopUI.getPickerGeneration, getAvailablePool, themeAlert, getAudioContext, DesktopUI.isPickerCurrent, startRollLoop, document.getElementById('slotResultPanel').classList.remove, document.getElementById, Math.floor, Math.random, state.groups.forEach, (g.members ／／ []).forEach, allStudents.push, allGroups.push, Array.isArray, state.groups.filter, allGroups.filter, pre.includes, allStudents.filter, grpWithMembers.some, setInterval, studentLabelHTMLV218, ClassroomFeedback.startLive, window.GodpowerPicker?.notify|
|src/script/00.js:2580|stopSlotSpin|declaration|需要进一步测试|clearInterval, document.getElementById, stopRollLoop, playSound, state.picker.pickedGroupIds.push, studentLabelHTMLV218, escapeHtml, state.picker.pickedStudentKeys.push, ensureV2State, state.itemGlobal.pickerHistory.push, Date.now, state.itemGlobal.pickerHistory.shift, saveState, syncPickerScoreTarget, renderPickerInfo, updatePickerPoolUI, window.GodpowerPicker?.notify, document.getElementById('slotResultPanel').classList.add, DesktopUI.pickerStopped|
|src/script/00.js:2630|rewardPickedStudent|declaration|需要进一步测试|cancelScoreAnimationAndSync, state.groups.find, recordHistory, saveState, animateScores, playSound, showToast, document.getElementById('slotResultPanel').classList.remove, document.getElementById|
|src/script/00.js:2649|openBatchImportModal|declaration|需要进一步测试|openPwdModal, state.groups.map(g => ${g.name}: ${g.members.join(', ')}).join, state.groups.map, g.members.join, document.getElementById, showClassroomWindow|
|src/script/00.js:2656|closeBatchImportModal|declaration|需要进一步测试|hideClassroomWindow, document.getElementById|
|src/script/00.js:2660|applyBatchImport|declaration|需要进一步测试|document.getElementById('batchTextarea').value.trim, document.getElementById, closeBatchImportModal, text.split('\n').map(l => l.trim()).filter, text.split('\n').map, text.split, l.trim, lines.forEach, line.includes, line.split, state.groups.find, g.name.trim, grpName.trim, g.name.replace, grpName.replace, membersStr.split(/[,，、\s]+/).map(m => m.trim()).filter, membersStr.split(/[,，、\s]+/).map, membersStr.split, m.trim, Array.from, saveState, renderGrid, updatePickerPoolUI, showToast|
|src/script/00.js:2687|exportData|declaration|需要进一步测试|JSON.stringify, buildClassroomBackup, URL.createObjectURL, document.createElement, a.click, setTimeout, URL.revokeObjectURL|
|src/script/00.js:2693|triggerImport|declaration|需要进一步测试|openPwdModal, document.getElementById('importFileInput').click, document.getElementById|
|src/script/00.js:2698|handleFileImport|declaration|需要进一步测试|themeAlert, importClassroomData, JSON.parse, showToast, reader.readAsText|
|src/script/00.js:2702|reader.onload|assignment|需要进一步测试|importClassroomData, JSON.parse, showToast, themeAlert|
|src/script/00.js:2709|reader.onerror|assignment|需要进一步测试|themeAlert|
|src/script/00.js:2713|addGroup|declaration|需要进一步测试|openPwdModal, Date.now, recordHistory, state.groups.push, StableIdentity.createGroupUid, playSound, saveState, renderAll|
|src/script/00.js:2737|deleteGroup|declaration|需要进一步测试|openPwdModal, state.groups.find, themeConfirm, recordHistory, state.groups.filter, saveState, renderAll|
|src/script/00.js:2748|updateGroupName|declaration|需要进一步测试|state.groups.find, saveState, updateHeaderStats, renderChart, renderDashboard|
|src/script/00.js:2759|updateGroupColor|declaration|需要进一步测试|state.groups.find, saveState, renderAll|
|src/script/00.js:2768|resetAllScores|declaration|需要进一步测试|cancelScoreAnimationAndSync, openPwdModal, themeConfirm, recordHistory, state.groups.forEach, updates.push, animateScores, playSound, saveState|
|src/script/00.js:2787|openSoundSettings|declaration|需要进一步测试|themeAlert, openPwdModal, syncSettingsControls, renderBgmSlotList, renderFxSlotList, renderBgmEngineConsole, switchView|
|src/script/00.js:2800|closeSoundModal|declaration|需要进一步测试|switchView|
|src/script/00.js:2804|syncSettingsControls|declaration|需要进一步测试|document.getElementById, Math.round, state.groups.map(g => ${g.name}: ${(g.members ／／ []).join(', ')}).join, state.groups.map, (g.members ／／ []).join|
|src/script/00.js:2814|updateMasterVolume|declaration|需要进一步测试|parseFloat, document.getElementById, Math.round, masterGainNode.gain.setValueAtTime, saveState|
|src/script/00.js:2824|renderBgmSlotList|declaration|需要进一步测试|document.getElementById, parseInt, Number, refreshSoundIdCache, checkSetCompleteness, hasSound, document.createElement, container.appendChild|
|src/script/00.js:2879|renderFxSlotList|declaration|需要进一步测试|document.getElementById, FX_SOUND_SLOTS.forEach, ['roll_tick','roll_loop','roll_win'].includes, categories.has, categories.set, categories.get(category).push, categories.get, document.createElement, section.append, escapeHtml, renderFxChoices, fxContainer.append|
|src/script/00.js:2897|previewBgmTrack|declaration|需要进一步测试|db.transaction, tx.objectStore, store.get, getAudioContext, ctx.decodeAudioData, req.result.arrayBuffer.slice, ctx.createBufferSource, src.connect, src.start|
|src/script/00.js:2903|req.onsuccess|assignment|需要进一步测试|getAudioContext, ctx.decodeAudioData, req.result.arrayBuffer.slice, ctx.createBufferSource, src.connect, src.start|
|src/script/00.js:2918|triggerUploadAudio|declaration|需要进一步测试|slotId.startsWith, document.getElementById, input.click|
|src/script/00.js:2922|handleSoundFileUpload|declaration|需要进一步测试|Array.from, slotId.startsWith, slotId.slice, Promise.all(files.map((file,index)=>new Promise(resolve=>{     const candidate=!!fxKey&&(append／／index>0),key=candidate?slotId+'::variant::'+crypto.randomUUID():slotId;     const reader=new FileReader();     reader.onerror=()=>{showToast('音频文件读取失败，原音频保留');resolve(false)};     reader.onload=async function(e){       let decoded;       try{const ctx=await getAudioContext();decoded=await ctx.decodeAudioData(e.target.result.slice(0));}       catch(error){themeAlert('解析失败，请确保格式为 MP3/WAV');resolve(false);return;}       if(fxKey){         if(candidate)(customFxVariants[fxKey]／／=[]).push({id:key,name:file.name／／'候选音效',buffer:decoded});         else customFxBuffers[fxKey]=decoded;       }       let saved=false;       try{         if(!db)throw Error('浏览器音频存储不可用');         await new Promise((done,reject)=>{           const tx=db.transaction('sounds','readwrite');tx.oncomplete=done;tx.onerror=()=>reject(tx.error／／Error('音频保存失败'));tx.onabort=()=>reject(tx.error／／Error('音频保存中止'));           tx.objectStore('sounds').put({id:key,name:file.name／／'',arrayBuffer:e.target.result});         });soundIdCache.add(key);saved=true;       }catch(error){showToast(fxKey?'音效仅在本页生效，未保存：'+error.message:'音频未保存，原已保存文件保留：'+error.message);}       bgmEngine.preloadedSet=null;bgmShufflePool=[];       if(saved)showToast(candidate?'候选音效已追加，播放时随机选择':'音频已保存');       renderBgmSlotList();renderFxSlotList();renderItemFxSoundListV26();resolve(saved);     };reader.readAsArrayBuffer(file);   }))).finally, Promise.all, files.map, crypto.randomUUID, showToast, resolve, getAudioContext, ctx.decodeAudioData, e.target.result.slice, themeAlert, (customFxVariants[fxKey]／／=[]).push, Error, db.transaction, reject, tx.objectStore('sounds').put, tx.objectStore, soundIdCache.add, renderBgmSlotList, renderFxSlotList, renderItemFxSoundListV26, reader.readAsArrayBuffer|
|src/script/00.js:2930|reader.onerror|assignment|需要进一步测试|showToast, resolve|
|src/script/00.js:2931|reader.onload|assignment|需要进一步测试|getAudioContext, ctx.decodeAudioData, e.target.result.slice, themeAlert, resolve, (customFxVariants[fxKey]／／=[]).push, Error, db.transaction, reject, tx.objectStore('sounds').put, tx.objectStore, soundIdCache.add, showToast, renderBgmSlotList, renderFxSlotList, renderItemFxSoundListV26|
|src/script/00.js:2943|tx.onerror|assignment|需要进一步测试|reject, Error|
|src/script/00.js:2943|tx.onabort|assignment|需要进一步测试|reject, Error|
|src/script/00.js:2954|deleteBgmTrack|declaration|需要进一步测试|db.transaction, tx.objectStore, store.delete, soundIdCache.delete, showToast, renderBgmSlotList|
|src/script/00.js:2968|deleteFxTrack|declaration|需要进一步测试|db.transaction, tx.objectStore, reject, store.getAllKeys, req.result.filter(key=>key===idbKey／／String(key).startsWith(idbKey+'::variant::')).forEach, req.result.filter, String(key).startsWith, String, store.delete, key.startsWith, soundIdCache.delete, showToast, renderFxSlotList, renderItemFxSoundListV26|
|src/script/00.js:2973|tx.onerror|assignment|需要进一步测试|reject|
|src/script/00.js:2973|tx.onabort|assignment|需要进一步测试|reject|
|src/script/00.js:2974|req.onsuccess|assignment|需要进一步测试|req.result.filter(key=>key===idbKey／／String(key).startsWith(idbKey+'::variant::')).forEach, req.result.filter, String(key).startsWith, String, store.delete|
|src/script/00.js:2982|exportAudioBundle|declaration|需要进一步测试|showToast, db.transaction, tx.objectStore, store.getAll, resolve, themeAlert, fileIndex.push, audioBuffersToPack.push, new TextEncoder().encode, JSON.stringify, headerView.setUint8, headerView.setUint32, URL.createObjectURL, document.createElement, a.click, URL.revokeObjectURL|
|src/script/00.js:2991|req.onsuccess|assignment|需要进一步测试|resolve|
|src/script/00.js:2992|req.onerror|assignment|需要进一步测试|resolve|
|src/script/00.js:3031|triggerImportAudioBundle|declaration|需要进一步测试|openPwdModal, document.getElementById('bundleFileInput').click, document.getElementById|
|src/script/00.js:3036|handleBundleFilePicked|declaration|需要进一步测试|showToast, dataView.getUint8, themeAlert, dataView.getUint32, JSON.parse, new TextDecoder().decode, db.transaction, tx.objectStore, fileIndex.forEach, store.put, fullBuffer.slice, refreshSoundIdCache, loadFxSounds, renderBgmSlotList, renderFxSlotList, renderItemFxSoundListV26, reader.readAsArrayBuffer|
|src/script/00.js:3042|reader.onload|assignment|需要进一步测试|dataView.getUint8, themeAlert, dataView.getUint32, JSON.parse, new TextDecoder().decode, db.transaction, tx.objectStore, fileIndex.forEach, store.put, fullBuffer.slice, refreshSoundIdCache, loadFxSounds, renderBgmSlotList, renderFxSlotList, renderItemFxSoundListV26, showToast|
|src/script/00.js:3062|tx.oncomplete|assignment|需要进一步测试|refreshSoundIdCache, loadFxSounds, renderBgmSlotList, renderFxSlotList, renderItemFxSoundListV26, showToast|
|src/script/00.js:3081|escapeHtml|declaration|需要进一步测试|String(str ?? '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace, String(str ?? '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace, String(str ?? '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace, String(str ?? '').replace(/&/g, "&amp;").replace, String(str ?? '').replace, String|
|src/script/00.js:3097|ensureAudioUnlocked|declaration|需要进一步测试|Promise.resolve, getAudioContext().then(() => { audioUnlocked = true; }).catch, getAudioContext().then, getAudioContext|
|src/script/00.js:3102|switchView|declaration|需要进一步测试|GodpowerTheme.cancel, window.GodpowerTooltips?.cancel, window.GodPowerPageShell?.resolvePage, String(name).startsWith, String, window.GodPowerPluginCenter?.showRoute, VIEW_NAMES.includes, ensureAudioUnlocked, DesktopUI.viewChanged, document.querySelectorAll('.view').forEach, document.querySelectorAll, v.classList.remove, document.getElementById, target.classList.add, document.querySelectorAll('.nav-tab').forEach, t.classList.toggle, renderWelcomePage, updateWelcomeTrackIfNeeded, renderHistoryList, renderSettlementHistoryList, window.GodPowerPluginCenter?.render, syncSettingsControls, renderBgmSlotList, renderFxSlotList, renderBgmEngineConsole, menuFadeOut, renderAll, bgmStopAll, ensureAudioUnlocked().then, getMenuTrackKeyForView, menuStartOrSwitch|
|src/script/00.js:3137|enterBattleFromWelcome|declaration|需要进一步测试|switchView|
|src/script/00.js:3141|getMenuTrackKeyForView|declaration|需要进一步测试|getWelcomeTrackKey|
|src/script/00.js:3150|getWelcomeTrackKey|declaration|需要进一步测试|state.groups.reduce, Math.max, Number, Math.min, String, Math.floor, Math.abs|
|src/script/00.js:3160|startWelcomeClock|declaration|需要进一步测试|updateWelcomeClock, setInterval|
|src/script/00.js:3166|updateWelcomeClock|declaration|需要进一步测试|updateHeaderStats, DesktopUI.renderWelcome, String(now.getHours()).padStart, String, now.getHours, String(now.getMinutes()).padStart, now.getMinutes, String(now.getSeconds()).padStart, now.getSeconds, document.getElementById, now.getFullYear, now.getMonth, now.getDate, now.getDay, GodpowerTheme.name|
|src/script/00.js:3185|renderWelcomePage|declaration|需要进一步测试|DesktopUI.renderWelcome, document.getElementById, [...state.groups].sort, Number, escapeHtml, getScore|
|src/script/00.js:3191|getScore|binding|需要进一步测试|Number|
|src/script/00.js:3256|saveMenuCfg|declaration|需要进一步测试|STORAGE.setJSON|
|src/script/00.js:3259|midiToFreq|declaration|需要进一步测试|Math.pow|
|src/script/00.js:3261|mulberry32|declaration|需要进一步测试|Math.imul|
|src/script/00.js:3275|buildMenuPattern|declaration|需要进一步测试|Math.max, Number, mulberry32, key.split('').reduce, key.split, c.charCodeAt, new Array(totalSteps).fill, rnd, Math.floor|
|src/script/00.js:3313|getNoiseBuffer|declaration|需要进一步测试|Math.floor, audioCtx.createBuffer, noiseBuffer.getChannelData, Math.random|
|src/script/00.js:3347|menuSecPerBeat|declaration|需要进一步测试|Math.max, Number|
|src/script/00.js:3349|menuLoopSpan|declaration|需要进一步测试|Math.max, Number, menuSecPerBeat|
|src/script/00.js:3364|normalizeWelcomeLoopBuffer|declaration|需要进一步测试|/^welcome_[1-6]$/.test, menuLoopSpan, Math.min, menuSecPerBeat, Math.ceil, audioCtx.createBuffer, fixed.getChannelData(ch).set, fixed.getChannelData, buf.getChannelData|
|src/script/00.js:3384|menuEnsureGraph|declaration|需要进一步测试|audioCtx.createGain, menuBgm.outGain.gain.setValueAtTime, menuBgm.outGain.connect|
|src/script/00.js:3395|makeSynthMenuBuffer|declaration|需要进一步测试|Math.max, Number, Math.ceil, Math.floor, buildMenuPattern, Math.min, offline.createOscillator, offline.createGain, osc.frequency.setValueAtTime, midiToFreq, g.gain.setValueAtTime, g.gain.exponentialRampToValueAtTime, osc.connect, g.connect, osc.start, osc.stop, offline.createBuffer, buf.getChannelData, Math.random, offline.createBufferSource, offline.createBiquadFilter, src.connect, hp.connect, src.start, offline.startRendering|
|src/script/00.js:3455|menuLoadBuffer|declaration|需要进一步测试|async () => {     let buf = null;     if (db) {       try {         const ab = await new Promise(res => {           const tx = db.transaction('sounds', 'readonly');           const req = tx.objectStore('sounds').get('bgm_menu_' + key);           req.onsuccess = () => res((req.result && req.result.arrayBuffer) ／／ null);           req.onerror = () => res(null);         });         if (ab && ab.byteLength > 0) {           buf = await audioCtx.decodeAudioData(ab.slice(0));           buf = normalizeWelcomeLoopBuffer(key, buf);           menuBgm.uploadedKeys.add(key);         }       } catch(e) {}     }     if (!buf) {       try { buf = await makeSynthMenuBuffer(key); } catch(e2) { buf = null; }       if (buf) menuBgm.uploadedKeys.delete(key);     }     if (buf) menuBgm.buffers[key] = buf;     return buf;   }, db.transaction, tx.objectStore('sounds').get, tx.objectStore, res, audioCtx.decodeAudioData, ab.slice, normalizeWelcomeLoopBuffer, menuBgm.uploadedKeys.add, makeSynthMenuBuffer, menuBgm.uploadedKeys.delete|
|src/script/00.js:3465|req.onsuccess|assignment|需要进一步测试|res|
|src/script/00.js:3466|req.onerror|assignment|需要进一步测试|res|
|src/script/00.js:3486|menuLoopParams|declaration|需要进一步测试|menuLoopSpan, menuBgm.uploadedKeys.has, Math.min, Math.max|
|src/script/00.js:3496|menuTrimFor|declaration|需要进一步测试|Number, Math.max, Math.min, Number.isFinite|
|src/script/00.js:3502|menuPosForKey|declaration|需要进一步测试|menuLoopParams, Math.max, Math.min|
|src/script/00.js:3511|menuVoiceGainAt|declaration|需要进一步测试||
|src/script/00.js:3519|menuVoiceRamp|declaration|需要进一步测试|menuVoiceGainAt, g.cancelScheduledValues, g.setValueAtTime, g.linearRampToValueAtTime|
|src/script/00.js:3529|menuSpawnVoice|declaration|需要进一步测试|menuLoopParams, audioCtx.createBufferSource, Math.min, Math.max, audioCtx.createGain, gain.gain.setValueAtTime, src.connect, gain.connect, menuPosForKey, src.disconnect, gain.disconnect, menuBgm.voices.indexOf, menuBgm.voices.splice, src.start, menuBgm.voices.push|
|src/script/00.js:3542|src.onended|assignment|需要进一步测试|src.disconnect, gain.disconnect, menuBgm.voices.indexOf, menuBgm.voices.splice|
|src/script/00.js:3554|menuRetireVoice|declaration|需要进一步测试|menuVoiceRamp, v.src.stop|
|src/script/00.js:3566|menuSwitchNow|declaration|需要进一步测试|menuBgm.voices.find, menuBgm.voices.slice().forEach, menuBgm.voices.slice, menuRetireVoice, menuTrimFor, Math.abs, menuVoiceGainAt, menuVoiceRamp, menuSpawnVoice|
|src/script/00.js:3589|menuStartOrSwitch|declaration|需要进一步测试|ensureAudioUnlocked().then, ensureAudioUnlocked, menuEnsureGraph, menuLoadBuffer, menuSwitchNow|
|src/script/00.js:3607|menuFadeOut|declaration|需要进一步测试|menuPosForKey, Math.max, menuBgm.voices.slice().forEach, menuBgm.voices.slice, menuRetireVoice|
|src/script/00.js:3621|menuStop|declaration|需要进一步测试|menuBgm.voices.slice().forEach, menuBgm.voices.slice, v.src.stop|
|src/script/00.js:3634|menuResyncGrid|declaration|需要进一步测试|menuLoopParams, Math.min, Math.max, menuBgm.voices.find, Math.abs, menuRetireVoice, menuVoiceRamp, menuSpawnVoice, menuTrimFor|
|src/script/00.js:3649|menuScheduleReload|declaration|需要进一步测试|clearTimeout, setTimeout, menuBgm.uploadedKeys.delete, menuLoadBuffer, menuBgm.voices.slice().forEach, menuBgm.voices.slice, menuRetireVoice, menuVoiceRamp, menuSpawnVoice, menuTrimFor|
|src/script/00.js:3667|updateWelcomeTrackIfNeeded|declaration|需要进一步测试|getWelcomeTrackKey, menuStartOrSwitch|
|src/script/00.js:3674|renderBgmEngineConsole|declaration|需要进一步测试|document.getElementById, MENU_TRACK_KEYS.map(k =>     '<div class="trim-row">' +       '<span class="trim-name">' + MENU_TRACK_META[k].name + '</span>' +       '<input type="range" min="0" max="2" step="0.05" value="' + menuCfg.gainTrims[k] + '" oninput="menuTrimChange(\'' + k + '\', this.value)">' +       '<span class="trim-val" id="trim-val-' + k + '">' + Number(menuCfg.gainTrims[k]).toFixed(2) + '</span>' +     '</div>').join, MENU_TRACK_KEYS.map, Number(menuCfg.gainTrims[k]).toFixed, Number|
|src/script/00.js:3728|menuEnabledChange|declaration|需要进一步测试|saveMenuCfg, menuStop, menuStartOrSwitch, getMenuTrackKeyForView|
|src/script/00.js:3733|menuBpmChange|declaration|需要进一步测试|Number, saveMenuCfg, document.getElementById, menuScheduleReload|
|src/script/00.js:3738|menuMeterChange|declaration|需要进一步测试|Number, saveMenuCfg, menuResyncGrid|
|src/script/00.js:3742|menuLoopChange|declaration|需要进一步测试|Number, saveMenuCfg, menuResyncGrid|
|src/script/00.js:3746|menuTrimChange|declaration|需要进一步测试|Number, saveMenuCfg, menuBgm.voices.forEach, menuVoiceRamp, menuTrimFor, document.getElementById, Number(v).toFixed|
|src/script/00.js:3753|battleBpmChange|declaration|需要进一步测试|Number, document.getElementById, saveMenuCfg|
|src/script/00.js:3763|makeRollLoopBuffer|declaration|需要进一步测试|audioCtx.createBuffer, Math.floor, buf.getChannelData, Math.random|
|src/script/00.js:3783|startRollLoop|declaration|需要进一步测试|selectFxBuffer, makeRollLoopBuffer, audioCtx.createGain, rollLoopGain.connect, getFxOutputV2176, rollLoopGain.gain.setValueAtTime, rollLoopGain.gain.linearRampToValueAtTime, audioCtx.createBufferSource, rollLoopNode.connect, rollLoopNode.start|
|src/script/00.js:3801|stopRollLoop|declaration|需要进一步测试|cb, rollLoopGain.gain.cancelScheduledValues, rollLoopGain.gain.setValueAtTime, Math.max, rollLoopGain.gain.linearRampToValueAtTime, setTimeout, rollLoopNode.stop|
|src/script/00.js:3821|uiDbOpen|declaration|需要进一步测试|indexedDB.open, d.objectStoreNames.contains, d.createObjectStore, res|
|src/script/00.js:3826|r.onupgradeneeded|assignment|需要进一步测试|d.objectStoreNames.contains, d.createObjectStore|
|src/script/00.js:3830|r.onsuccess|assignment|需要进一步测试|res|
|src/script/00.js:3831|r.onerror|assignment|需要进一步测试|res|
|src/script/00.js:3836|uiDbReq|declaration|需要进一步测试|uiDbOpen, d.transaction, fn, tx.objectStore, res|
|src/script/00.js:3843|req.onsuccess|assignment|需要进一步测试|res|
|src/script/00.js:3844|req.onerror|assignment|需要进一步测试|res|
|src/script/00.js:3850|getWallVeil|declaration|需要进一步测试|Number, STORAGE.get, Number.isFinite, Math.max, Math.min|
|src/script/00.js:3854|applyWallpaperVeil|declaration|需要进一步测试|getWallVeil, root.style.setProperty, document.getElementById, Math.round|
|src/script/00.js:3863|applyWallpaper|declaration|需要进一步测试|URL.revokeObjectURL, URL.createObjectURL, root.style.setProperty, root.style.removeProperty, document.getElementById, applyWallpaperVeil|
|src/script/00.js:3876|compressWallpaper|declaration|需要进一步测试|createImageBitmap, URL.createObjectURL, URL.revokeObjectURL, res, rej, Math.min, Math.max, document.createElement, Math.round, canvas.getContext, ctx.fillRect, ctx.drawImage, img.close, canvas.toBlob|
|src/script/00.js:3885|im.onload|assignment|需要进一步测试|URL.revokeObjectURL, res|
|src/script/00.js:3886|im.onerror|assignment|需要进一步测试|URL.revokeObjectURL, rej|
|src/script/00.js:3902|onWallpaperFile|declaration|需要进一步测试|/^image\//.test, showToast, compressWallpaper, uiDbReq, st.put, applyWallpaper, Math.round|
|src/script/00.js:3918|resetWallpaper|declaration|需要进一步测试|uiDbReq, st.delete, applyWallpaper, showToast|
|src/script/00.js:3923|changeWallpaperVeil|declaration|需要进一步测试|STORAGE.set, Number, applyWallpaperVeil|
|src/script/00.js:3927|initWallpaper|declaration|需要进一步测试|uiDbReq, st.get, applyWallpaper|
|src/script/00.js:3945|window.hideAudioHint|assignment|需要进一步测试|document.getElementById|
|src/script/00.js:3949|window.tryAutoResumeAndPlay|assignment|需要进一步测试|getAudioContext().then(() => {       if (audioCtx && audioCtx.state === 'running' && menuCfg.enabled && bgmEngine.state === 'IDLE' && !menuBgm.active && currentView !== 'battle') {         menuStartOrSwitch(getMenuTrackKeyForView(currentView));         hideAudioHint();       }     }).catch, getAudioContext().then, getAudioContext, menuStartOrSwitch, getMenuTrackKeyForView, hideAudioHint|
|src/script/00.js:3960|window.startResumeRetry|assignment|需要进一步测试|setInterval, clearInterval, hideAudioHint, document.getElementById, tryAutoResumeAndPlay|
|src/script/00.js:3977|window.closeWelcomeModal|assignment|需要进一步测试|document.getElementById, hideClassroomWindow, hideAudioHint, startResumeRetry, tryAutoResumeAndPlay|
|src/script/00.js:3986|unlockByGesture|binding|需要进一步测试|getAudioContext().then(() => {       hideAudioHint();       const wm = document.getElementById('welcomeModal');       if (wm && wm.classList.contains('active')) return;       startResumeRetry();       if (menuCfg.enabled && bgmEngine.state === 'IDLE' && currentView !== 'battle') {         if (!menuBgm.active) menuStartOrSwitch(getMenuTrackKeyForView(currentView));       }     }).catch, getAudioContext().then, getAudioContext, hideAudioHint, document.getElementById, wm.classList.contains, startResumeRetry, menuStartOrSwitch, getMenuTrackKeyForView|
|src/script/00.js:4054|normalizeInventoryV21718|declaration|需要进一步测试|(Array.isArray(inventory)?inventory:[])     .slice(0,3)     .filter(it=>{       const key=it&&it.key;       if(!ITEM_DEFS[key] ／／ seen.has(key)) return false;       seen.add(key);       return true;     })     .map, (Array.isArray(inventory)?inventory:[])     .slice(0,3)     .filter, (Array.isArray(inventory)?inventory:[])     .slice, Array.isArray, seen.has, seen.add, Number.isInteger, Math.max, Number, Number.isFinite, Math.min, Math.trunc, Date.now, StableIdentity.isValidItemInstanceId, StableIdentity.createItemInstanceId, Object.keys|
|src/script/00.js:4078|ensureItemState|declaration|需要进一步测试|state.groups.forEach, Array.isArray, normalizeInventoryV21718, Number.isFinite|
|src/script/00.js:4090|ranking|declaration|需要进一步测试|RankingRules.ordered|
|src/script/00.js:4091|rankIndex|declaration|需要进一步测试|ranking().findIndex, ranking|
|src/script/00.js:4092|roundQuarter|declaration|需要进一步测试|Math.round, Number|
|src/script/00.js:4093|roundThird|declaration|需要进一步测试|Math.round, Number|
|src/script/00.js:4094|roundHalf|declaration|需要进一步测试|Math.round, Number|
|src/script/00.js:4095|eligibleForItems|declaration|需要进一步测试|Number|
|src/script/00.js:4096|consumeInventoryItem|declaration|需要进一步测试|g.inventory.splice|
|src/script/00.js:4097|addItemToGroup|declaration|需要进一步测试|eligibleForItems, g.inventory.push, ItemModules.inventory, Date.now, Math.random|
|src/script/00.js:4098|tinyDefenseToast|declaration|需要进一步测试|document.createElement, document.body.appendChild, setTimeout, d.remove|
|src/script/00.js:4100|defenseCandidates|declaration|需要进一步测试|['star','mega','bullet'].includes, out.push, ITEM_DEFENSE_KEYS.has, ['green','triple_green','horn'].includes, out.sort|
|src/script/00.js:4117|damageFraction|declaration|需要进一步测试|roundHalf, roundThird, roundQuarter, applyItemScore|
|src/script/00.js:4118|boostFraction|declaration|需要进一步测试|eligibleForItems, roundQuarter, Math.round, ItemModules.scoreDelta|
|src/script/00.js:4120|itemDropWeights|declaration|需要进一步测试|put|
|src/script/00.js:4125|put|binding|需要进一步测试||
|src/script/00.js:4210|weightedPick|declaration|需要进一步测试|Object.entries(weights).filter, Object.entries, arr.reduce, Math.random|
|src/script/00.js:4211|drawItemForGroup|declaration|需要进一步测试|eligibleForItems, ranking, r.findIndex, itemDropWeights, Object.values(weights).some, Object.values, weightedPick|
|src/script/00.js:4213|detectOvertakePunish|declaration|需要进一步测试|state.groups.find, ['star','mega'].includes, ranking().map, ranking, beforeOrder.indexOf, after.indexOf, beforeOrder.slice(afterIdx,beforeIdx).filter, beforeOrder.slice, passed.forEach, eligibleForItems, tryDefend, roundQuarter|
|src/script/00.js:4220|legacyUseItem|declaration|需要进一步测试|useItem|
|src/script/00.js:4221|flashBomb|declaration|需要进一步测试|setTimeout, document.querySelector, c.classList.add, c.classList.remove|
|src/script/00.js:4223|startBulletTimer|declaration|需要进一步测试|clearInterval, setInterval, ensureItemState, state.groups.forEach, state.groups.find, rankIndex, g.inventory.findIndex, g.inventory.splice, showToast, eligibleForItems, saveState, renderGrid, renderChart, renderDashboard|
|src/script/00.js:4224|startBlooperClock|declaration|需要进一步测试|applyBlooperMask, Date.now, setTimeout|
|src/script/00.js:4225|applyBlooperMask|declaration|需要进一步测试|Date.now, document.getElementById, v.classList.toggle, document.querySelectorAll('.row-score,.chart-score,.podium-score,.w-stat-num').forEach, document.querySelectorAll, el.classList.toggle|
|src/script/00.js:4227|globalItemDraw|declaration|需要进一步测试|ensureItemState, state.groups.filter, eligibleForItems, showToast, recordHistory, document.getElementById, ov.classList.add, state.groups.map(g=><div class="item-draw-card ${eligible.includes(g)?'':'full'}" data-draw-id="${g.id}"><div class="roulette">${eligible.includes(g)?'❔':'🔒'}</div><div class="draw-name">${escapeHtml(g.name)}</div><div class="draw-result">${eligible.includes(g)?'抽取中…':'跳过'}</div></div>).join, state.groups.map, eligible.includes, escapeHtml, setInterval, eligible.forEach, Math.floor, Math.random, grid.querySelector, itemVisual, setTimeout, clearInterval, drawItemForGroup, addItemToGroup, card.classList.add, card.querySelector, saveState, renderAll, ov.classList.remove|
|src/script/00.js:4233|openItemWindow|declaration|需要进一步测试|ensureItemState, showClassroomWindow, document.getElementById, renderItemWindow|
|src/script/00.js:4234|closeItemWindow|declaration|需要进一步测试|hideClassroomWindow, document.getElementById|
|src/script/00.js:4235|switchItemTab|declaration|需要进一步测试|renderItemWindow|
|src/script/00.js:4236|renderItemWindow|declaration|需要进一步测试|state.groups.find, closeItemWindow, ensureGroupNumbersV213, document.getElementById, document.querySelectorAll('[data-item-tab]').forEach, document.querySelectorAll, b.classList.toggle, Math.round, statusParts.push, String, Number, statusParts.join, escapeHtml, DEFAULT_COLORS.map((color,idx)=><button type="button" class="group-color-swatch-v21716 ${String(g.color).toUpperCase()===color.toUpperCase()?'selected':''}" style="--swatch:${color}" title="预设 ${idx+1} · ${color}" ${disabled} onclick="selectGroupPresetColorV21716(${g.id},'${color}')"><span>${String(g.color).toUpperCase()===color.toUpperCase()?'✓':''}</span></button>).join, DEFAULT_COLORS.map, String(g.color).toUpperCase, color.toUpperCase, g.color.toUpperCase, (g.members／／[]).join, eligibleForItems, [0,1,2].map(i=>{const it=g.inventory[i];if(!it)return '<div class="item-big empty"><div class="item-big-icon">＋</div><div class="item-big-name">空道具槽</div></div>';const d=ITEM_DEFS[it.key];return <div class="item-big"><div class="item-big-icon">${itemVisual(it.key)}</div><div class="item-big-name">${escapeHtml(d.name)}${it.charges>1?' ×'+it.charges:''}</div><div class="item-big-desc">${escapeHtml(d.desc)}</div><button class="btn btn-primary item-use" onclick="useItem(${g.id},${i})" ${canUse?'':'disabled'}>立即使用</button></div>}).join, [0,1,2].map, itemVisual, ClassroomFeedback.slotMarkup|
|src/script/00.js:4315|previewItemDetailColor|declaration|需要进一步测试|document.getElementById|
|src/script/00.js:4316|saveItemDetailColor|declaration|需要进一步测试|renderItemWindow, /^#[0-9a-f]{6}$/i.test, updateGroupColor|
|src/script/00.js:4322|saveItemGroupDetail|declaration|需要进一步测试|openPwdModal, state.groups.find, document.getElementById('groupDetailName')?.value.trim, document.getElementById, document.getElementById('groupDetailNumber')?.value.trim, showToast, /^\d+$/.test, Number, state.groups.some, Array.from, rawMembers.split(/[\n,，、]+/).map(s=>s.trim()).filter, rawMembers.split(/[\n,，、]+/).map, rawMembers.split, s.trim, JSON.stringify, recordHistory, saveState, renderAll, updatePickerPoolUI, renderItemWindow|
|src/script/00.js:4339|deleteItemDetailGroup|declaration|需要进一步测试|openPwdModal, deleteGroup, state.groups.some, closeItemWindow, document.getElementById('itemWindow')?.classList.contains, document.getElementById, renderItemWindow|
|src/script/00.js:4348|itemQuickScore|declaration|需要进一步测试|openPwdModal, applyScoreDelta, renderItemWindow|
|src/script/00.js:4349|itemCustomScore|declaration|需要进一步测试|Number, document.getElementById, Number.isFinite, itemQuickScore, Math.round|
|src/script/00.js:4351|enhanceItemCards|declaration|需要进一步测试|ensureItemState, state.groups.forEach, document.querySelector, c.classList.remove, g.inventory.find, c.classList.add, c.querySelector, document.createElement, [0,1,2].map(i=>{const it=g.inventory[i];return it?<div class="item-slot" title="${ITEM_DEFS[it.key].name}">${itemVisual(it.key)}${it.charges>1?<span class="charges">${it.charges}</span>:''}</div>:'<div class="item-slot empty">＋</div>'}).join, [0,1,2].map, itemVisual, head.parentNode.insertBefore, mb.classList.remove, ev.preventDefault, ev.stopPropagation, openItemWindow, applyBlooperMask|
|src/script/00.js:4351|mb.onclick|assignment|需要进一步测试|ev.preventDefault, ev.stopPropagation, openItemWindow|
|src/script/00.js:4366|ensureV2State|declaration|需要进一步测试|ensureItemState, STORAGE.getJSON|
|src/script/00.js:4376|itemVisual|declaration|需要进一步测试|ensureV2State, Reliability.safeImage, escapeHtml|
|src/script/00.js:4382|itemBoxVisualV2121|declaration|需要进一步测试||
|src/script/00.js:4385|setPickerInfoTab|declaration|需要进一步测试|document.getElementById('pickerStatsBtn')?.classList.toggle, document.getElementById, document.getElementById('pickerHistoryBtn')?.classList.toggle, renderPickerInfo|
|src/script/00.js:4386|renderPickerInfo|declaration|需要进一步测试|ensureV2State, document.getElementById, state.groups.reduce, arr.slice(-30).reverse().map(x=><div class="picker-log">${escapeHtml(x.text)}<br><small>${new Date(x.time).toLocaleTimeString()}</small></div>).join, arr.slice(-30).reverse().map, arr.slice(-30).reverse, arr.slice, escapeHtml, new Date(x.time).toLocaleTimeString|
|src/script/00.js:4395|openPickerModal|assignment|需要进一步测试|ensureV2State, _v2OpenPicker, setPickerInfoTab, syncPickerScoreTarget|
|src/script/00.js:4396|syncPickerScoreTarget|declaration|需要进一步测试|document.getElementById, escapeHtml|
|src/script/00.js:4397|pickerTargetGroup|declaration|需要进一步测试||
|src/script/00.js:4398|scorePickerTarget|declaration|需要进一步测试|pickerTargetGroup, showToast, applyScoreDelta, syncPickerScoreTarget|
|src/script/00.js:4399|scorePickerCustom|declaration|需要进一步测试|Math.round, Number, document.getElementById, Number.isFinite, scorePickerTarget|
|src/script/00.js:4402|openHandRaise|declaration|需要进一步测试|ensureV2State, showClassroomWindow, document.getElementById, renderHandRaise|
|src/script/00.js:4403|closeHandRaise|declaration|需要进一步测试|hideClassroomWindow, document.getElementById|
|src/script/00.js:4404|renderHandRaise|declaration|需要进一步测试|document.getElementById, state.groups.map(g=><button class="hand-group ${g.id===handRaiseGroupId?'selected':''}" onclick="selectHandGroup(${g.id})">${escapeHtml(g.name)}<br><small>${g.score} 分</small></button>).join, state.groups.map, escapeHtml|
|src/script/00.js:4405|selectHandGroup|declaration|需要进一步测试|renderHandRaise, document.querySelectorAll('.hand-group').forEach, document.querySelectorAll, b.classList.remove, state.groups.findIndex, arr[idx].classList.add|
|src/script/00.js:4406|judgeHandRaise|declaration|需要进一步测试|ensureV2State, state.groups.find, showToast, recordHistory, state.itemGlobal.handRaiseHistory.push, Date.now, saveState, renderAll, document.getElementById, ClassroomFeedback.slotMarkup|
|src/script/00.js:4413|handQuickScore|declaration|需要进一步测试|applyScoreDelta|
|src/script/00.js:4414|handDrawItem|declaration|需要进一步测试|state.groups.find, eligibleForItems, showToast, recordHistory, drawItemForGroup, addItemToGroup, saveState, renderAll|
|src/script/00.js:4415|handUseItem|declaration|需要进一步测试|state.groups.find, showToast, closeHandRaise, openItemWindow|
|src/script/00.js:4418|globalItemDraw|assignment|需要进一步测试|ensureV2State, state.groups.filter, eligibleForItems, showToast, document.getElementById('view-battle')?.classList.contains, document.getElementById, switchView, recordHistory, renderGrid, eligible.forEach, document.querySelector, c.classList.add, document.createElement, c.appendChild, overlays.set, setInterval, overlays.get, ranking, r.findIndex, weightedPick, itemDropWeights, o.querySelector, itemVisual, setTimeout, clearInterval, drawItemForGroup, addItemToGroup, o.classList.add, saveState, c.classList.remove, c.querySelector('.card-item-roulette')?.remove, c.querySelector, renderAll|
|src/script/00.js:4432|openItemEncyclopedia|declaration|需要进一步测试|openAbout, renderAbout|
|src/script/00.js:4433|renderItemEncyclopedia|declaration|需要进一步测试|ensureV2State, document.getElementById, ITEM_KEYS.map(k=>{const d=ITEM_DEFS[k];return <div class="ency-card"><div class="ency-icon">${itemVisual(k)}</div><div><div class="ency-name">${d.name}</div><div class="ency-desc">${d.desc}</div></div><div class="ency-actions"><button class="btn btn-sm btn-primary" onclick="chooseItemIcon('${k}')">上传图片</button><button class="btn btn-sm" onclick="resetItemIcon('${k}')">恢复默认</button></div></div>}).join, ITEM_KEYS.map, itemVisual|
|src/script/00.js:4437|chooseItemIcon|declaration|需要进一步测试|document.getElementById, document.getElementById('itemIconInput').click|
|src/script/00.js:4438|handleItemIconUpload|declaration|需要进一步测试|ensureV2State, STORAGE.setJSON, saveState, renderItemEncyclopedia, renderAll, showToast, rd.readAsDataURL|
|src/script/00.js:4438|rd.onload|assignment|需要进一步测试|ensureV2State, STORAGE.setJSON, saveState, renderItemEncyclopedia, renderAll, showToast|
|src/script/00.js:4439|resetItemIcon|declaration|需要进一步测试|ensureV2State, STORAGE.setJSON, saveState, renderItemEncyclopedia, renderAll|
|src/script/00.js:4440|resetAllItemIcons|declaration|需要进一步测试|ensureV2State, STORAGE.setJSON, saveState, renderItemEncyclopedia, renderAll|
|src/script/00.js:4441|exportItemIconPack|declaration|需要进一步测试|ensureV2State, JSON.stringify, document.createElement, URL.createObjectURL, a.click, setTimeout, URL.revokeObjectURL|
|src/script/00.js:4442|importItemIconPack|declaration|需要进一步测试|JSON.parse, ensureV2State, STORAGE.setJSON, saveState, renderItemEncyclopedia, renderAll, showToast, themeAlert, rd.readAsText|
|src/script/00.js:4442|rd.onload|assignment|需要进一步测试|JSON.parse, ensureV2State, STORAGE.setJSON, saveState, renderItemEncyclopedia, renderAll, showToast, themeAlert|
|src/script/00.js:4445|installSettingsTabs|declaration|需要进一步测试|document.querySelector, document.getElementById, document.createElement, sc.prepend, sc.appendChild, renderItemEncyclopedia|
|src/script/00.js:4451|showSettingsV2|declaration|需要进一步测试|installSettingsTabs, document.querySelectorAll('#settingsV2Tabs button').forEach, document.querySelectorAll, b.classList.toggle, document.querySelector, document.getElementById, [...sc.children].forEach, item.classList.toggle, renderItemEncyclopedia, sc.querySelectorAll, titles[0]?.scrollIntoView|
|src/script/00.js:4460|openAbout|declaration|需要进一步测试|showClassroomWindow, document.getElementById, renderAbout|
|src/script/00.js:4461|closeAbout|declaration|需要进一步测试|hideClassroomWindow, document.getElementById|
|src/script/00.js:4462|renderAbout|declaration|需要进一步测试|document.querySelectorAll('[data-about]').forEach, document.querySelectorAll, b.classList.toggle, document.getElementById, ITEM_KEYS.map(k=><div class="guide-block"><b>${itemVisual(k)} ${ITEM_DEFS[k].name}</b><br>${ITEM_DEFS[k].desc}</div>).join, ITEM_KEYS.map, itemVisual|
|src/script/00.js:4470|renderItemWindow|assignment|需要进一步测试|_v2RenderItemWindow, state.groups.find, document.getElementById, document.createElement, ITEM_KEYS.map(k=><button class="btn btn-sm" onclick="godAddItem(${g.id},'${k}')">${itemVisual(k)} ${ITEM_DEFS[k].name}</button>).join, ITEM_KEYS.map, itemVisual, body.appendChild|
|src/script/00.js:4471|godAddItem|declaration|需要进一步测试|state.groups.find, showToast, recordHistory, g.inventory.push, ItemModules.inventory, Date.now, Math.random, saveState, renderAll, renderItemWindow|
|src/script/00.js:4472|godClearItems|declaration|需要进一步测试|state.groups.find, recordHistory, saveState, renderAll, renderItemWindow|
|src/script/00.js:4475|enhanceItemCards|assignment|需要进一步测试|_v2Enhance, ensureV2State, state.groups.forEach, document.querySelector, c.querySelectorAll('.item-slot').forEach, c.querySelectorAll, s.querySelector, itemVisual|
|src/script/00.js:4476|renderItemWindow|assignment|需要进一步测试|_v2RenderItemWindowIcons, state.groups.find, document.querySelectorAll('#itemWindowBody .item-big-icon').forEach, document.querySelectorAll, itemVisual|
|src/script/00.js:4483|switchView|assignment|需要进一步测试|_v2SwitchView, setTimeout|
|src/script/00.js:4490|cancelHandItemDraw|declaration|需要进一步测试|clearInterval, clearTimeout, showToast|
|src/script/00.js:4499|closeHandRaise|assignment|需要进一步测试|cancelHandItemDraw, _v21CloseHandRaise|
|src/script/00.js:4502|selectHandGroup|assignment|需要进一步测试|showToast, _v21SelectHandGroup|
|src/script/00.js:4508|judgeHandRaise|assignment|需要进一步测试|cancelHandItemDraw, _v21JudgeHandRaise, state.groups.find, [...document.querySelectorAll('#handRewardBox button')].find, document.querySelectorAll, b.textContent.includes, eligibleForItems|
|src/script/00.js:4521|handDrawItem|assignment|需要进一步测试|ensureV2State, state.groups.find, eligibleForItems, showToast, Date.now, document.getElementById, escapeHtml, ranking, r.findIndex, weightedPick, itemDropWeights, itemVisual, Math.min, tick, setInterval, setTimeout, clearInterval, cancelHandItemDraw, renderHandRaise, recordHistory, addItemToGroup, saveState, renderAll, live.inventory.findIndex, Math.max, live.inventory.filter(y=>y.key===k).map, live.inventory.filter|
|src/script/00.js:4539|tick|binding|需要进一步测试|state.groups.find, ranking, r.findIndex, weightedPick, itemDropWeights, document.getElementById, itemVisual, Math.min, Date.now|
|src/script/00.js:4576|finishHandItemReward|declaration|需要进一步测试|document.getElementById|
|src/script/00.js:4582|handUseNewItem|declaration|需要进一步测试|state.groups.find, showToast, g.inventory.map(x=>x.key).lastIndexOf, g.inventory.map, closeHandRaise, openItemWindow, setTimeout, document.querySelectorAll, cards[idx].scrollIntoView|
|src/script/00.js:4599|showItemUseFx|declaration|需要进一步测试||
|src/script/00.js:4600|itemFxTargetText|declaration|需要进一步测试|ranking, r.findIndex, names.includes, names.push, ['red','triple_red'].includes, add, ['banana','triple_banana'].includes, r.slice(0,Math.max(0,i)).forEach, r.slice, Math.max, r.slice(i+1).forEach, ['coin','mushroom','triple_mushroom','star','mega','bullet','power'].includes, names.join|
|src/script/00.js:4602|add|binding|需要进一步测试|names.includes, names.push|
|src/script/00.js:4613|closeItemWindowForFx|declaration|需要进一步测试|closeItemWindow|
|src/script/00.js:4622|normalizeItemIconFile|declaration|需要进一步测试|document.createElement, canvas.getContext, ctx.clearRect, Math.min, Math.max, ctx.drawImage, done, canvas.toDataURL, reader.readAsDataURL|
|src/script/00.js:4624|reader.onload|assignment|需要进一步测试|document.createElement, canvas.getContext, ctx.clearRect, Math.min, Math.max, ctx.drawImage, done, canvas.toDataURL|
|src/script/00.js:4626|img.onload|assignment|需要进一步测试|document.createElement, canvas.getContext, ctx.clearRect, Math.min, Math.max, ctx.drawImage, done, canvas.toDataURL|
|src/script/00.js:4636|img.onerror|assignment|需要进一步测试|done|
|src/script/00.js:4641|handleItemIconUpload|assignment|需要进一步测试|normalizeItemIconFile, ensureV2State, STORAGE.setJSON, saveState, renderItemEncyclopedia, renderAll, showToast|
|src/script/00.js:4651|updateCardRouletteVisual|declaration|需要进一步测试|o.querySelector, icon.classList.remove, itemVisual, icon.classList.add|
|src/script/00.js:4663|globalItemDraw|assignment|需要进一步测试|ensureV2State, state.groups.filter, eligibleForItems, showToast, document.getElementById('view-battle')?.classList.contains, document.getElementById, switchView, recordHistory, renderGrid, performance.now, eligible.forEach, document.querySelector, c.classList.add, document.createElement, c.appendChild, overlays.set, Math.min, Math.pow, lastUpdate.get, lastUpdate.set, ranking, r.findIndex, weightedPick, itemDropWeights, currentKey.set, updateCardRouletteVisual, overlays.get, requestAnimationFrame, addItemToGroup, o.classList.add, o.querySelector, saveState, setTimeout, c.querySelector, c.classList.remove, c.querySelector('.card-item-roulette')?.remove, renderAll|
|src/script/00.js:4680|frame|declaration|需要进一步测试|Math.min, Math.pow, eligible.forEach, lastUpdate.get, lastUpdate.set, ranking, r.findIndex, weightedPick, itemDropWeights, currentKey.set, updateCardRouletteVisual, overlays.get, requestAnimationFrame, addItemToGroup, o.classList.add, o.querySelector, saveState, setTimeout, document.querySelector, c.querySelector, c.classList.remove, c.querySelector('.card-item-roulette')?.remove, renderAll|
|src/script/00.js:4717|handDrawItem|assignment|需要进一步测试|ensureV2State, state.groups.find, eligibleForItems, showToast, performance.now, document.getElementById, escapeHtml, Math.min, Math.pow, ranking, r.findIndex, weightedPick, itemDropWeights, itemVisual, cap.animate, requestAnimationFrame, cancelHandItemDraw, renderHandRaise, recordHistory, addItemToGroup, saveState, renderAll, live.inventory.findIndex, Math.max|
|src/script/00.js:4735|frame|declaration|需要进一步测试|Math.min, Math.pow, document.getElementById, state.groups.find, ranking, r.findIndex, weightedPick, itemDropWeights, itemVisual, cap.animate, requestAnimationFrame, eligibleForItems, cancelHandItemDraw, showToast, renderHandRaise, recordHistory, addItemToGroup, saveState, renderAll, live.inventory.findIndex, escapeHtml, Math.max|
|src/script/00.js:4767|cancelHandItemDraw|assignment|需要进一步测试|clearTimeout, showToast|
|src/script/00.js:4793|battleCard|declaration|需要进一步测试|document.querySelector|
|src/script/00.js:4794|clearCardFx|declaration|需要进一步测试|[...card.classList].filter(x=>x.startsWith('cfx-')／／['card-use-fx','card-hit-fx','card-defend-fx','card-heal-fx'].includes(x)).forEach, [...card.classList].filter, x.startsWith, ['card-use-fx','card-hit-fx','card-defend-fx','card-heal-fx'].includes, card.classList.remove, card.querySelectorAll('.card-fx-badge').forEach, card.querySelectorAll, x.remove, card.style.removeProperty|
|src/script/00.js:4800|playCasterCardFx|declaration|需要进一步测试|DesktopUI.getPreferences, battleCard, clearCardFx, card.classList.add, document.createElement, itemVisual, escapeHtml, card.appendChild, setTimeout, card.classList.remove, b.remove|
|src/script/00.js:4810|playTargetCardFx|declaration|需要进一步测试|DesktopUI.visualEvent, DesktopUI.getPreferences, battleCard, card.classList.remove, card.style.setProperty, card.classList.add, setTimeout, card.style.removeProperty|
|src/script/00.js:4819|cardFxTargets|declaration|需要进一步测试|ranking, r.findIndex, ids.includes, ids.push, ['red_shell','triple_red','boo'].includes, add, ['banana','triple_banana'].includes, r.slice(0,Math.max(0,i)).forEach, r.slice, Math.max, r.slice(i+1).forEach|
|src/script/00.js:4820|add|binding|需要进一步测试|ids.includes, ids.push|
|src/script/00.js:4833|showItemUseFx|assignment|需要进一步测试|playCasterCardFx, cardFxTargets, ['coin_shell','question_block'].includes, targets.forEach, setTimeout, playTargetCardFx, console.warn, _v25ShowItemUseFx|
|src/script/00.js:4868|removeBgmEngineeringConsoleV26|declaration|需要进一步测试|document.getElementById('bgmEngineConsole')?.remove, document.getElementById, document.querySelectorAll('#view-settings .setting-section-title').forEach, document.querySelectorAll, x.textContent.includes, x.remove|
|src/script/00.js:4887|renderItemFxSoundListV26|declaration|需要进一步测试|document.getElementById, ITEM_FX_SOUND_SLOTS.filter(s=>!GENERIC_ITEM_USE_SOUNDS_V2174.has(s.id)).map(s=>{    const custom=!!customFxBuffers[s.id]／／hasSound('fx_'+s.id);    return <div class="sound-row"><div class="sound-desc"><div class="sound-name">${s.name}</div><div class="sound-tag">${custom?'已载入自定义音频':s.desc}</div></div><div class="sound-controls"><button class="btn btn-sm" onclick="playSound('${s.id}')">试听</button><button class="btn btn-sm btn-primary" onclick="triggerUploadAudio('fx_${s.id}')">上传</button>${custom?<button class="btn btn-sm btn-danger" onclick="deleteFxTrack('fx_${s.id}','${s.id}');setTimeout(renderItemFxSoundListV26,100)">还原</button>:''}</div></div>  }).join, ITEM_FX_SOUND_SLOTS.filter(s=>!GENERIC_ITEM_USE_SOUNDS_V2174.has(s.id)).map, ITEM_FX_SOUND_SLOTS.filter, GENERIC_ITEM_USE_SOUNDS_V2174.has, hasSound|
|src/script/00.js:4894|itemSoundCategoryV26|declaration|需要进一步测试|['green','triple_green','red','triple_red','spiny','banana','triple_banana','horn','bomb','hammer','lightning'].includes, ['coin','coin_shell','question','mushroom','triple_mushroom'].includes|
|src/script/00.js:4901|showItemUseFx|assignment|需要进一步测试|playSound, setTimeout, itemSoundCategoryV26, _v26ShowItemUseFx|
|src/script/00.js:4903|tinyDefenseToast|assignment|需要进一步测试|playSound, _v26TinyDefense|
|src/script/00.js:4904|startDrawSoundBedV26|declaration|需要进一步测试|playSound, setInterval, clearInterval, Math.max, setTimeout|
|src/script/00.js:4909|globalItemDraw|assignment|需要进一步测试|startDrawSoundBedV26, _v26GlobalDraw|
|src/script/00.js:4910|handDrawItem|assignment|需要进一步测试|startDrawSoundBedV26, _v26HandDraw|
|src/script/00.js:4923|uiIconsV26|declaration|需要进一步测试|STORAGE.getJSON|
|src/script/00.js:4924|applyUiIconsV26|declaration|需要进一步测试|uiIconsV26, UI_ICON_TARGETS.forEach, document.querySelector, Reliability.safeImage, document.createElement, template.content.querySelector('svg,.custom-ui-icon')?.remove, template.content.querySelector, template.innerHTML.trim, escapeHtml, el.setAttribute|
|src/script/00.js:4940|chooseUiIconV26|declaration|需要进一步测试|document.getElementById, f.click|
|src/script/00.js:4941|handleUiIconV26|declaration|需要进一步测试|normalizeItemIconFile, uiIconsV26, STORAGE.setJSON, applyUiIconsV26, renderUiIconManagerV26|
|src/script/00.js:4945|resetUiIconV26|declaration|需要进一步测试|uiIconsV26, STORAGE.setJSON, applyUiIconsV26, renderUiIconManagerV26|
|src/script/00.js:4946|renderUiIconManagerV26|declaration|需要进一步测试|document.getElementById, uiIconsV26, UI_ICON_TARGETS.map(([id,label,,fallback])=><div class="icon-custom-card"><div class="icon-preview">${m[id]?<img src="${m[id]}">:fallback}</div><div style="flex:1"><b>${label}</b><div style="font-size:11px;color:#64748b">支持 PNG / JPG / WebP</div></div><button class="btn btn-sm btn-primary" onclick="chooseUiIconV26('${id}')">上传</button>${m[id]?<button class="btn btn-sm" onclick="resetUiIconV26('${id}')">还原</button>:''}</div>).join, UI_ICON_TARGETS.map|
|src/script/00.js:4952|rebuildSettingsV26|declaration|需要进一步测试|document.querySelector, document.getElementById, removeBgmEngineeringConsoleV26, document.getElementById('settingsV2Tabs')?.remove, document.getElementById('v2ItemPane')?.remove, document.createElement, Object.entries(panes).forEach, Object.entries, original.forEach, txt.includes, panes[mode].appendChild, sc.append, panes.function.appendChild, panes.items.appendChild, panes.sound.appendChild, document.body.appendChild, installCommunismModeSetting, renderUiIconManagerV26, renderItemEncyclopedia, renderItemFxSoundListV26, showSettingsV26|
|src/script/00.js:4978|showSettingsV26|declaration|需要进一步测试|document.getElementById, DesktopUI.selectSettings, document.querySelectorAll('.settings-v26-pane').forEach, document.querySelectorAll, p.classList.toggle, document.querySelectorAll('#settingsV26Tabs button').forEach, b.classList.toggle, document.querySelector, renderBgmSlotList, renderFxSlotList, renderItemFxSoundListV26, renderItemEncyclopedia, installCommunismModeSetting, renderUiIconManagerV26|
|src/script/00.js:4988|installSettingsTabs|assignment|需要进一步测试|rebuildSettingsV26|
|src/script/00.js:4989|showSettingsV2|assignment|需要进一步测试|showSettingsV26|
|src/script/00.js:5000|syncVisualViewportV27|declaration|需要进一步测试|document.documentElement.style.setProperty|
|src/script/00.js:5017|repairPersistentItemsV28|declaration|需要进一步测试|ensureItemState, state.groups.forEach, normalizeInventoryV21718, saveState|
|src/script/00.js:5027|programConfirmV28|declaration|需要进一步测试|document.getElementById, previous?.querySelector('#pcCancelV28')?.click, previous?.querySelector, DesktopUI.finishWindowClose, document.createElement, escapeHtml, escapeHtml(message).replace, document.body.appendChild, document.removeEventListener, hideClassroomWindow, o.remove, resolve, o.querySelector, finish, o.addEventListener, document.addEventListener|
|src/script/00.js:5047|finish|binding|需要进一步测试|document.removeEventListener, hideClassroomWindow, o.remove, resolve|
|src/script/00.js:5048|o.querySelector('#pcCancelV28').onclick|assignment|需要进一步测试|finish|
|src/script/00.js:5049|o.querySelector('#pcOkV28').onclick|assignment|需要进一步测试|finish|
|src/script/00.js:5051|key|binding|需要进一步测试|document.removeEventListener, finish|
|src/script/00.js:5069|heldItemKeysV281|declaration|需要进一步测试|(g?.inventory／／[]).map(it=>it?.key).filter, (g?.inventory／／[]).map|
|src/script/00.js:5072|weightedPickNoRepeatV281|declaration|需要进一步测试|Object.entries(weights／／{}).forEach, Object.entries, Number, blocked.has, Object.keys, weightedPick|
|src/script/00.js:5081|pickItemForGroupV281|declaration|需要进一步测试|ranking, Math.max, r.findIndex, itemDropWeights, heldItemKeysV281, weightedPickNoRepeatV281, weightedPick|
|src/script/00.js:5096|globalItemDraw|assignment|需要进一步测试|ensureV2State, state.groups.filter, eligibleForItems, showToast, document.getElementById('view-battle')?.classList.contains, document.getElementById, switchView, recordHistory, renderGrid, performance.now, eligible.forEach, document.querySelector, c.classList.add, document.createElement, c.appendChild, overlays.set, Math.min, Math.pow, lastUpdate.get, lastUpdate.set, pickItemForGroupV281, updateCardRouletteVisual, overlays.get, requestAnimationFrame, addItemToGroup, batchUsed.add, o.classList.add, o.querySelector, saveState, setTimeout, c.querySelector, c.classList.remove, c.querySelector('.card-item-roulette')?.remove, renderAll|
|src/script/00.js:5113|frame|declaration|需要进一步测试|Math.min, Math.pow, eligible.forEach, lastUpdate.get, lastUpdate.set, pickItemForGroupV281, updateCardRouletteVisual, overlays.get, requestAnimationFrame, addItemToGroup, batchUsed.add, o.classList.add, o.querySelector, saveState, setTimeout, document.querySelector, c.querySelector, c.classList.remove, c.querySelector('.card-item-roulette')?.remove, renderAll|
|src/script/00.js:5155|handDrawItem|assignment|需要进一步测试|ensureV2State, state.groups.find, eligibleForItems, showToast, performance.now, document.getElementById, escapeHtml, Math.min, Math.pow, pickItemForGroupV281, itemVisual, cap.animate, requestAnimationFrame, cancelHandItemDraw, renderHandRaise, recordHistory, addItemToGroup, saveState, renderAll|
|src/script/00.js:5171|frame|declaration|需要进一步测试|Math.min, Math.pow, document.getElementById, state.groups.find, pickItemForGroupV281, itemVisual, cap.animate, requestAnimationFrame, eligibleForItems, cancelHandItemDraw, showToast, renderHandRaise, recordHistory, addItemToGroup, saveState, renderAll, escapeHtml|
|src/script/00.js:5222|v282RandomOther|declaration|需要进一步测试|state.groups.filter, Number, Math.floor, Math.random|
|src/script/00.js:5226|v282TakeFraction|declaration|需要进一步测试|Number, Math.round, Math.max, applyItemAttack|
|src/script/00.js:5236|v282Consume|declaration|需要进一步测试|Math.max, Number, g.inventory.splice|
|src/script/00.js:5256|roulettePreviewPickV282|declaration|需要进一步测试|Object.keys, Math.floor, Math.random|
|src/script/00.js:5260|updateAllRoulettePreviewLogicV282|declaration|需要进一步测试|roulettePreviewPickV282|
|src/script/00.js:5266|globalItemDraw|assignment|需要进一步测试|ensureV2State, state.groups.filter, eligibleForItems, showToast, document.getElementById('view-battle')?.classList.contains, document.getElementById, switchView, recordHistory, renderGrid, performance.now, eligible.forEach, document.querySelector, c.classList.add, document.createElement, c.appendChild, overlays.set, Math.min, Math.pow, lastUpdate.get, lastUpdate.set, updateCardRouletteVisual, overlays.get, roulettePreviewPickV282, requestAnimationFrame, pickItemForGroupV281, addItemToGroup, batchUsed.add, o.classList.add, o.querySelector, saveState, setTimeout, c.querySelector, c.classList.remove, c.querySelector('.card-item-roulette')?.remove, renderAll|
|src/script/00.js:5282|frame|declaration|需要进一步测试|Math.min, Math.pow, eligible.forEach, lastUpdate.get, lastUpdate.set, updateCardRouletteVisual, overlays.get, roulettePreviewPickV282, requestAnimationFrame, pickItemForGroupV281, addItemToGroup, batchUsed.add, o.classList.add, o.querySelector, saveState, setTimeout, document.querySelector, c.querySelector, c.classList.remove, c.querySelector('.card-item-roulette')?.remove, renderAll|
|src/script/00.js:5315|handDrawItem|assignment|需要进一步测试|ensureV2State, state.groups.find, eligibleForItems, showToast, performance.now, document.getElementById, escapeHtml, Math.min, Math.pow, roulettePreviewPickV282, itemVisual, cap.animate, requestAnimationFrame, cancelHandItemDraw, renderHandRaise, pickItemForGroupV281, recordHistory, addItemToGroup, saveState, renderAll|
|src/script/00.js:5329|frame|declaration|需要进一步测试|Math.min, Math.pow, document.getElementById, roulettePreviewPickV282, itemVisual, cap.animate, requestAnimationFrame, state.groups.find, eligibleForItems, cancelHandItemDraw, showToast, renderHandRaise, pickItemForGroupV281, recordHistory, addItemToGroup, saveState, renderAll, escapeHtml|
|src/script/00.js:5374|itemKeysV283|declaration|需要进一步测试|ITEM_ORDER_V283.filter|
|src/script/00.js:5376|itemAdminButtonV283|declaration|需要进一步测试|itemVisual, escapeHtml|
|src/script/00.js:5380|godAddItemV283|declaration|需要进一步测试|state.groups.find, showToast, Number, recordHistory, addItemToGroup, saveState, renderAll, renderGroupModalV283|
|src/script/00.js:5389|renderGodItemManagerV283|declaration|需要进一步测试|state.groups.find, document.querySelectorAll, roots.find, x.closest, document.querySelector, document.createElement, tactical.appendChild, itemKeysV283().map(k=>itemAdminButtonV283(k,gid)).join, itemKeysV283().map, itemKeysV283, itemAdminButtonV283|
|src/script/00.js:5402|patchVisibleGodManagerV283|declaration|需要进一步测试|document.querySelectorAll, all.find, /上帝模式.*强制道具管理/.test, document.createElement, title.insertAdjacentElement, itemKeysV283().map(k=>itemAdminButtonV283(k,gid)).join, itemKeysV283().map, itemKeysV283, itemAdminButtonV283|
|src/script/00.js:5414|renderEncyclopediaV283|declaration|需要进一步测试|document.querySelectorAll, headings.find, /22\s*种道具百科／26\s*种道具百科/.test, candidates.indexOf, candidates.slice(start).filter, candidates.slice, x.matches, x.querySelector, cards.forEach, x.remove, itemKeysV283().forEach, itemKeysV283, document.createElement, itemVisual, escapeHtml, parent.appendChild, itemKeysV283().map(k=>{      const d=ITEM_DEFS[k];      return <div class="guide-block encyclopedia-item"><b>${itemVisual(k)} ${escapeHtml(d.name)}</b><br>${escapeHtml(d.desc／／'')}</div>;    }).join, itemKeysV283().map|
|src/script/00.js:5443|appendMissingEncyclopediaV283|declaration|需要进一步测试|document.querySelectorAll('h1,h2,h3').forEach, document.querySelectorAll, /22\s*种道具百科/.test, document.querySelector, [...about.querySelectorAll('h1,h2,h3')].find, about.querySelectorAll, /26\s*种道具百科/.test, ['feather','fire_flower','ice_flower','boomerang_flower'].forEach, (parent.innerText／／'').includes, document.createElement, itemVisual, escapeHtml, parent.appendChild|
|src/script/00.js:5460|patchItemIconSettingsV283|declaration|需要进一步测试|document.querySelector, [...setting.querySelectorAll('*')].filter, setting.querySelectorAll, /道具.*图标／自定义道具/.test, ['feather','fire_flower','ice_flower','boomerang_flower'].forEach, txt.includes, document.createElement, itemVisual, escapeHtml, region.appendChild|
|src/script/00.js:5478|renderGroupModalV283|declaration|需要进一步测试|setTimeout, patchVisibleGodManagerV283|
|src/script/00.js:5483|openGroupModal|assignment|需要进一步测试|_v283OpenGroupModal.call, renderGroupModalV283|
|src/script/00.js:5487|renderGroupModal|assignment|需要进一步测试|_v283RenderGroupModal.apply, renderGroupModalV283|
|src/script/00.js:5492|openAboutModal|assignment|需要进一步测试|_v283OpenAbout.apply, setTimeout, appendMissingEncyclopediaV283|
|src/script/00.js:5500|refresh26ItemInterfacesV284|declaration|需要进一步测试|Object.keys, document.querySelectorAll('.v283-added').forEach, document.querySelectorAll, x.remove, document.querySelectorAll('.setting-section-title,h1,h2,h3').forEach, /22\s*种道具百科/.test, (x.textContent／／'').replace, /22\s*种道具百科与图标管理/.test, renderItemEncyclopedia, document.getElementById('itemWindow')?.classList.contains, document.getElementById, renderItemWindow|
|src/script/00.js:5518|appendMissingEncyclopediaV283|assignment|需要进一步测试||
|src/script/00.js:5519|patchItemIconSettingsV283|assignment|需要进一步测试||
|src/script/00.js:5522|patchVisibleGodManagerV283|assignment|需要进一步测试||
|src/script/00.js:5523|renderGroupModalV283|assignment|需要进一步测试||
|src/script/00.js:5529|renderAbout|assignment|需要进一步测试|_v284RenderAbout, document.getElementById, m.querySelectorAll('h1,h2,h3').forEach, m.querySelectorAll, h.textContent.replace, ['feather','fire_flower','ice_flower','boomerang_flower'].forEach, txt.includes, document.createElement, itemVisual, escapeHtml, m.appendChild|
|src/script/00.js:5554|isCommunismMode|declaration|需要进一步测试|STORAGE.getJSON|
|src/script/00.js:5557|setCommunismMode|declaration|需要进一步测试|STORAGE.setJSON, applyCommunismMode, showToast|
|src/script/00.js:5562|applyCommunismMode|declaration|需要进一步测试|isCommunismMode, document.body.classList.toggle, document.querySelectorAll('button,[role="button"],.dock-btn,.nav-btn').forEach, document.querySelectorAll, (el.textContent／／'').trim, el.getAttribute, /道具抽取／抽取道具／道具百科／道具与图标/.test, /globalItemDraw／openItemEncyclopedia/.test, document.getElementById('itemWindow')?.classList.remove, document.getElementById, document.getElementById('itemBackdrop')?.classList.remove|
|src/script/00.js:5587|globalItemDraw|assignment|需要进一步测试|isCommunismMode, showToast, _v291GlobalItemDraw.apply|
|src/script/00.js:5595|openItemWindow|assignment|需要进一步测试|isCommunismMode, showToast, _v291OpenItemWindow.apply|
|src/script/00.js:5602|installCommunismModeSetting|declaration|需要进一步测试|document.getElementById('communismModeSetting')?.remove, document.getElementById|
|src/script/00.js:5613|formatChartScoreV294|declaration|需要进一步测试|Number, Math.abs, String, Math.trunc, Math.round, v.toFixed(v>=10?1:2).replace, v.toFixed|
|src/script/00.js:5682|attackHitClassV2116|declaration|需要进一步测试|['green','triple_green'].includes, ['red','triple_red'].includes, ['banana','triple_banana'].includes|
|src/script/00.js:5697|clearAttackHitFxV2116|declaration|需要进一步测试|[...card.classList].filter(x=>x.startsWith('hit-')).forEach, [...card.classList].filter, x.startsWith, card.classList.remove, card.style.removeProperty|
|src/script/00.js:5705|playAttackTargetFxV2116|declaration|需要进一步测试|DesktopUI.visualEvent, DesktopUI.getPreferences, battleCard, clearAttackHitFxV2116, attackHitClassV2116, card.classList.add, card.style.setProperty, document.createElement, itemVisual, card.appendChild, setTimeout, card.classList.remove, badge.remove, card.style.removeProperty|
|src/script/00.js:5738|tryDefendLightningV2116|declaration|需要进一步测试|Number, Math.max, tinyDefenseToast, setTimeout, playAttackTargetFxV2116, ['star','mega'].includes, ['mega','star'].includes, target.inventory.findIndex, target.inventory.splice|
|src/script/00.js:5766|applyLightningHitV2116|declaration|需要进一步测试|eligibleForItems, tryDefendLightningV2116, Number, ItemModules.scoreDelta, roundHalf, setTimeout, playAttackTargetFxV2116|
|src/script/00.js:5790|showItemUseFx|assignment|需要进一步测试|setTimeout, playCasterCardFx, _v2116ShowItemUseFx.call|
|src/script/00.js:5818|isQueuePersistentActiveV2120|declaration|需要进一步测试|['star','mega','power'].includes|
|src/script/00.js:5824|queueRoleTextV2120|declaration|需要进一步测试||
|src/script/00.js:5828|queueUseStateV2120|declaration|需要进一步测试|isQueuePersistentActiveV2120, eligibleForItems, Reliability.validateItem, isCommunismMode|
|src/script/00.js:5846|godAddQueueItemV2120|declaration|需要进一步测试|state.groups.find, showToast, eligibleForItems, recordHistory, addItemToGroup, saveState, renderAll, renderItemWindow|
|src/script/00.js:5858|godClearQueueItemsV2120|declaration|需要进一步测试|state.groups.find, recordHistory, saveState, renderAll, renderItemWindow|
|src/script/00.js:5866|godAddItem|assignment|需要进一步测试|godAddQueueItemV2120|
|src/script/00.js:5867|godAddItemV283|assignment|需要进一步测试|godAddQueueItemV2120|
|src/script/00.js:5868|godClearItems|assignment|需要进一步测试|godClearQueueItemsV2120|
|src/script/00.js:5872|renderItemWindow|assignment|需要进一步测试|_v2120RenderItemWindow, state.groups.find, document.getElementById, [0,1,2].map(i=>{     const it=g.inventory[i];     const role=queueRoleTextV2120(i);     if(!it){       return <div class="item-big queue-item-card ${i===0?'queue-main-card':'queue-secondary-card'} empty">         <div class="queue-role-badge">${role}</div>         <div class="item-big-icon">＋</div>         <div class="item-big-name">空道具栏</div>         <div class="item-big-desc">${i===0?'新获得的第一个道具会进入这里':'主要道具释放后，次要道具会按顺序自动晋升'}</div>       </div>;     }     const d=ITEM_DEFS[it.key];     const st=queueUseStateV2120(g,i);     const active=isQueuePersistentActiveV2120(g,it);     return <div class="item-big queue-item-card ${i===0?'queue-main-card':'queue-secondary-card'} ${active?'queue-persistent-active':''}">       <div class="queue-role-badge">${role}${active?' · 卡手中':''}</div>       <div class="item-big-icon">${itemVisual(it.key)}</div>       <div class="item-big-name">${escapeHtml(d.name)}${it.charges>1?' ×'+it.charges:''}</div>       <div class="item-big-desc">${escapeHtml(d.desc)}</div>       ${i===0         ? <button class="btn btn-primary item-use queue-main-use" onclick="useItem(${g.id},0)" ${st.usable?'':'disabled'}>${st.label}</button>         : <button class="btn item-use queue-secondary-lock" disabled>${st.label}</button>}     </div>;   }).join, [0,1,2].map, queueRoleTextV2120, queueUseStateV2120, isQueuePersistentActiveV2120, itemVisual, escapeHtml, document.createElement, Object.keys(ITEM_DEFS).map(k=><button class="btn btn-sm" onclick="godAddQueueItemV2120(${g.id},'${k}')">${itemVisual(k)} ${escapeHtml(ITEM_DEFS[k].name)}</button>).join, Object.keys(ITEM_DEFS).map, Object.keys, body.appendChild|
|src/script/00.js:5925|enhanceItemCards|assignment|需要进一步测试|_v2120EnhanceItemCards, state.groups.forEach, document.querySelector, card.classList.remove, card.classList.add, card.querySelectorAll, [0,1,2].forEach, isQueuePersistentActiveV2120, slot.classList.add, queueRoleTextV2120, itemVisual, queueMainVisualCacheV2120.get, slots[0].classList.add, setTimeout, slots[0]?.classList.remove, queueMainVisualCacheV2120.set|
|src/script/00.js:5964|handUseNewItem|assignment|需要进一步测试|state.groups.find, showToast, closeHandRaise, openItemWindow|
|src/script/01.js:11|ensureGroupNumbersV213|declaration|需要进一步测试|state.groups.forEach, Number.parseInt, Number.isFinite, used.has, used.add, Math.max, saveState|
|src/script/01.js:28|groupNoTextV213|declaration|需要进一步测试|Math.max, Number.parseInt, String(n).padStart, String|
|src/script/01.js:29|desiredGroupsV213|declaration|需要进一步测试|ensureGroupNumbersV213, ranking, state.groups.slice().sort, state.groups.slice, state.groups.indexOf|
|src/script/01.js:34|currentCardSortLabelV213|declaration|需要进一步测试||
|src/script/01.js:37|renderItemEncyclopedia|assignment|需要进一步测试|ensureV2State, document.getElementById, ITEM_KEYS.map(k=>{const d=ITEM_DEFS[k];return <div class="ency-v213-card">     <div class="ency-v213-icon-disc">${itemVisual(k,'ency-v213-img')}</div>     <div class="ency-v213-info"><div class="ency-v213-name">${escapeHtml(d.name)}</div><div class="ency-v213-desc">${escapeHtml(d.desc)}</div></div>     <div class="ency-v213-actions"><button class="btn btn-sm btn-primary" onclick="chooseItemIcon('${k}')">上传图片</button><button class="btn btn-sm" onclick="resetItemIcon('${k}')">恢复默认</button></div>   </div>}).join, ITEM_KEYS.map, itemVisual, escapeHtml|
|src/script/01.js:56|applySettingsBatchMembers|assignment|需要进一步测试|state.groups.map, _v213Batch.apply, state.groups.forEach, oldNums.has, oldNums.get, ensureGroupNumbersV213, saveState, renderAll|
|src/script/02.js:3|applyModernFlatV217|declaration|需要进一步测试|document.body.classList.add|
|src/script/02.js:5|rankOfGroupV214|declaration|需要进一步测试|ranking, r.findIndex|
|src/script/02.js:16|renderAbout|assignment|需要进一步测试|document.querySelectorAll('[data-about]').forEach, document.querySelectorAll, b.classList.toggle, document.getElementById, ITEM_KEYS.map(k=>{const d=ITEM_DEFS[k];return <div class="v214-about-item"><div class="v214-about-item-disc">${itemVisual(k,'v214-about-item-img')}</div><div class="v214-about-item-info"><div class="v214-about-item-name">${escapeHtml(d.name)}</div><div class="v214-about-item-desc">${escapeHtml(d.desc／／'')}</div></div></div>}).join, ITEM_KEYS.map, itemVisual, escapeHtml|
|src/script/02.js:31|renderHandRaise|assignment|需要进一步测试|document.getElementById, state.groups.map(g=><button type="button" class="hand-group two-tier-chip ${g.id===handRaiseGroupId?'selected':''}" data-group-id="${g.id}" aria-pressed="${g.id===handRaiseGroupId?'true':'false'}" style="--hand-color:${g.color};--hand-contrast:${readableTextOnColor(g.color)}" onclick="selectHandGroup(${g.id})"><span class="hand-group-name">${escapeHtml(g.name)}</span><small>${g.score} 分</small></button>).join, state.groups.map, readableTextOnColor, escapeHtml|
|src/script/02.js:36|updateHandScoreV214|declaration|需要进一步测试|state.groups.find, document.querySelector|
|src/script/02.js:41|handQuickScore|assignment|需要进一步测试|applyScoreDelta, updateHandScoreV214, setTimeout|
|src/script/02.js:49|renderHandRewardControlsV214|declaration|需要进一步测试|document.getElementById, state.groups.find, eligibleForItems, escapeHtml|
|src/script/02.js:59|judgeHandRaise|assignment|需要进一步测试|_v214JudgeHandRaise.call, renderHandRewardControlsV214|
|src/script/02.js:63|handUsePrimaryV214|declaration|需要进一步测试|state.groups.find, showToast, closeHandRaise, setTimeout, useItem|
|src/script/02.js:73|finishHandItemReward|assignment|需要进一步测试|closeHandRaise|
|src/script/03.js:4|renderWelcomeAllV216|declaration|需要进一步测试|renderWelcomePage, renderChart, renderDashboard|
|src/script/03.js:13|switchView|assignment|需要进一步测试|oldSwitchV216.call, requestAnimationFrame|
|src/script/03.js:23|showItemUseFx|assignment|需要进一步测试|document.querySelectorAll('.item-use-banner-v216').forEach, document.querySelectorAll, x.remove, playSound, setTimeout, itemSoundCategoryV26, playCasterCardFx, special.includes, ['coin_shell','question','question_block'].includes, cardFxTargets(key,casterId).forEach, cardFxTargets, playTargetCardFx, console.warn, state.groups?.find, document.createElement, itemVisual, escapeHtml, document.body.appendChild, banner.remove, banner.addEventListener|
|src/script/03.js:56|remove|binding|需要进一步测试|banner.remove|
|src/script/04.js:24|itemFallbackToneV2164|declaration|需要进一步测试|audioCtx.createOscillator, audioCtx.createGain, osc.frequency.setValueAtTime, osc.frequency.exponentialRampToValueAtTime, gain.gain.setValueAtTime, Math.max, gain.gain.exponentialRampToValueAtTime, osc.connect, gain.connect, getFxOutputV2176, osc.start, osc.stop|
|src/script/04.js:41|playItemFallbackSoundV2164|declaration|需要进一步测试|itemFallbackToneV2164, [523.25,659.25,783.99].forEach, [523.25,659.25,783.99,1046.5].forEach|
|src/script/04.js:95|playSound|assignment|需要进一步测试|ITEM_SOUND_IDS_V2164.has, _v2164PlaySoundBase.call, loadFxSounds, getAudioContext, audioCtx.createBufferSource, source.connect, getFxOutputV2176, source.start, playItemFallbackSoundV2164|
|src/script/04.js:128|startDrawSoundBedV2164|declaration|需要进一步测试|playSound, Math.max, setInterval, clearInterval, setTimeout|
|src/script/04.js:144|globalItemDraw|assignment|需要进一步测试|state.groups.some, eligibleForItems, Array.isArray, isCommunismMode, startDrawSoundBedV2164, _v2164GlobalItemDraw.apply|
|src/script/04.js:155|handDrawItem|assignment|需要进一步测试|state.groups.find, eligibleForItems, Array.isArray, startDrawSoundBedV2164, _v2164HandDrawItem.apply|
|src/script/05.js:30|explodeDestroyedBombV2170|declaration|需要进一步测试|ranking, r.findIndex, [r[i-1],r[i+1]].filter, eligibleForItems, tinyDefenseToast, targets.forEach, roundQuarter, applyItemScore, setTimeout, flashBomb|
|src/script/05.js:51|destroyPrimaryBasicDefenseV2170|declaration|需要进一步测试|BASIC_DEFENSE_KEYS_V2170.has, target.inventory.splice, tinyDefenseToast, explodeDestroyedBombV2170|
|src/script/05.js:82|detectOvertakePunish|assignment|需要进一步测试|state.groups.find, ['star','mega'].includes, ranking().map, ranking, beforeOrder.indexOf, after.indexOf, beforeOrder.slice(afterIdx,beforeIdx).filter, beforeOrder.slice, passed.forEach, eligibleForItems, destroyPrimaryBasicDefenseV2170, tryDefend, roundQuarter|
|src/script/05.js:110|isQueuePersistentActiveV2120|assignment|需要进一步测试|['mega','power'].includes|
|src/script/05.js:117|tryDefendLightningV2116|assignment|需要进一步测试|Number, Math.max, tinyDefenseToast, setTimeout, playAttackTargetFxV2116, ['star','mega'].includes, target.inventory.findIndex, target.inventory.splice|
|src/script/05.js:144|renderAbout|assignment|需要进一步测试|document.querySelectorAll('[data-about]').forEach, document.querySelectorAll, b.classList.toggle, document.getElementById, _v2170RenderAboutFallback.call, ITEM_KEYS.map(k=>{         const d=ITEM_DEFS[k];         return <div class="v2170-ency-row">           <div class="v2170-ency-icon">${itemVisual(k,'v2170-ency-img')}</div>           <div class="v2170-ency-copy">             <div class="v2170-ency-name">${escapeHtml(d.name)}</div>             <div class="v2170-ency-desc">${escapeHtml(d.desc／／'')}</div>           </div>         </div>;       }).join, ITEM_KEYS.map, itemVisual, escapeHtml|
|src/script/06.js:12|stopActiveDrawAudioV2171|declaration|需要进一步测试|clearInterval, clearTimeout, activeDrawSourcesV2171.forEach, src.stop, src.disconnect, activeDrawSourcesV2171.clear|
|src/script/06.js:31|playTrackedDrawSoundV2171|declaration|需要进一步测试|loadFxSounds, getAudioContext, audioCtx.createBufferSource, source.connect, getFxOutputV2176, activeDrawSourcesV2171.add, activeDrawSourcesV2171.delete, source.start, playItemFallbackSoundV2164, playSound|
|src/script/06.js:49|source.onended|assignment|需要进一步测试|activeDrawSourcesV2171.delete|
|src/script/06.js:63|finishDrawAudioV2171|declaration|需要进一步测试|clearInterval, activeDrawSourcesV2171.forEach, src.stop, src.disconnect, activeDrawSourcesV2171.clear, playSound|
|src/script/06.js:83|startDrawSoundBedV2164|assignment|需要进一步测试|stopActiveDrawAudioV2171, playTrackedDrawSoundV2171, Math.max, setInterval, clearInterval, setTimeout, finishDrawAudioV2171|
|src/script/06.js:116|cancelHandItemDraw|assignment|需要进一步测试|stopActiveDrawAudioV2171, _v2171CancelHandItemDraw.apply|
|src/script/07.js:8|itemExistsOnFieldV2172|declaration|需要进一步测试|ensureItemState, Number, Date.now, state.groups.some, Array.isArray, g.inventory.some|
|src/script/07.js:21|itemRankBandV2172|declaration|需要进一步测试|Math.max, Number, Math.min, Math.ceil|
|src/script/07.js:39|itemDropWeights|assignment|需要进一步测试|itemRankBandV2172, Math.max, Number, ITEM_KEYS.forEach, put, itemExistsOnFieldV2172|
|src/script/07.js:42|put|binding|需要进一步测试|Math.max, Number|
|src/script/07.js:152|addItemToGroup|assignment|需要进一步测试|itemExistsOnFieldV2172, showToast, _v2172AddItemToGroup.call|
|src/script/07.js:164|clearAllItemsV2172|declaration|需要进一步测试|ensureItemState, state.groups.reduce, Array.isArray, state.groups.filter, Number, Date.now, showToast, themeConfirm, recordHistory, state.groups.forEach, clearInterval, applyBlooperMask, saveState, renderAll|
|src/script/07.js:204|installClearItemsSettingV2172|declaration|需要进一步测试|document.getElementById, document.createElement, pane.appendChild|
|src/script/07.js:225|rebuildSettingsV26|assignment|需要进一步测试|_v2172RebuildSettingsV26.apply, setTimeout|
|src/script/07.js:233|showSettingsV26|assignment|需要进一步测试|_v2172ShowSettingsV26.call, setTimeout|
|src/script/08.js:4|itemDropWeights|assignment|需要进一步测试|Math.max, Number, Math.min, itemRankBandV2172, Math.ceil, ITEM_KEYS.forEach, put, itemExistsOnFieldV2172|
|src/script/08.js:15|put|binding|需要进一步测试|Math.max, Number|
|src/script/09.js:16|playPerItemFallbackV2174|declaration|需要进一步测试|Math.max, ITEM_KEYS.indexOf, audioCtx.createOscillator, audioCtx.createGain, osc.frequency.setValueAtTime, osc.frequency.exponentialRampToValueAtTime, g.gain.setValueAtTime, g.gain.exponentialRampToValueAtTime, osc.connect, g.connect, getFxOutputV2176, osc.start, osc.stop, tone|
|src/script/09.js:28|tone|binding|需要进一步测试|audioCtx.createOscillator, audioCtx.createGain, osc.frequency.setValueAtTime, Math.max, osc.frequency.exponentialRampToValueAtTime, g.gain.setValueAtTime, g.gain.exponentialRampToValueAtTime, osc.connect, g.connect, getFxOutputV2176, osc.start, osc.stop|
|src/script/09.js:67|playSound|assignment|需要进一步测试|ActionSounds.isClick, ClassroomFeedback.allowClickSound, GENERIC_ITEM_USE_SOUNDS_V2174.has, PER_ITEM_SOUND_IDS_V2174.has, loadFxSounds, getAudioContext, selectFxBuffer, audioCtx.createBufferSource, source.connect, getFxOutputV2176, source.start, playPerItemFallbackV2174, slotId.slice, _v2174PlaySound.call|
|src/script/09.js:106|showItemUseFx|assignment|需要进一步测试|playSound, _v2174ShowItemUseFx.call|
|src/script/09.js:116|renderItemFxSoundListV26|assignment|需要进一步测试|document.getElementById, hasSound, escapeHtml, renderFxChoices, common.map(x=>rowHtml(x.id,x.name,x.desc)).join, common.map, rowHtml, ITEM_KEYS.map(k=>{         const d=ITEM_DEFS[k];         const visual=<span class="v2174-item-audio-icon">${itemVisual(k,'v2174-item-audio-img')}</span>;         return rowHtml(item_${k},d.name,'默认：该道具独立合成音',visual);       }).join, ITEM_KEYS.map, itemVisual|
|src/script/09.js:127|rowHtml|binding|需要进一步测试|hasSound, escapeHtml, renderFxChoices|
|src/script/09.js:176|handleSoundFileUpload|assignment|需要进一步测试|_v2174HandleSoundFileUpload.call, setTimeout, renderItemFxSoundListV26|
|src/script/09.js:183|deleteFxTrack|assignment|需要进一步测试|_v2174DeleteFxTrack.call, setTimeout, renderItemFxSoundListV26|
|src/script/10.js:6|exportFxBundleV2175|declaration|需要进一步测试|openPwdModal, initDB, themeAlert, showToast, db.transaction, tx.objectStore('sounds').getAll, tx.objectStore, resolve, allRecords       .filter(r=>r && typeof r.id==='string' && r.id.startsWith('fx_') && r.arrayBuffer instanceof ArrayBuffer)       .sort, allRecords       .filter, r.id.startsWith, a.id.localeCompare, fileIndex.push, buffers.push, new TextEncoder().encode, JSON.stringify, view.setUint8, view.setUint32, URL.createObjectURL, document.createElement, fxRecords.filter, document.body.appendChild, a.click, a.remove, setTimeout, URL.revokeObjectURL, console.error|
|src/script/10.js:27|req.onsuccess|assignment|需要进一步测试|resolve|
|src/script/10.js:28|req.onerror|assignment|需要进一步测试|resolve|
|src/script/11.js:15|getFxOutputV2176|declaration|需要进一步测试|audioCtx.createGain, fxGainNodeV2176.gain.setValueAtTime, fxGainNodeV2176.connect|
|src/script/11.js:26|updateSfxVolumeV2176|declaration|需要进一步测试|Math.max, Math.min, parseFloat, document.getElementById, Math.round, getFxOutputV2176, node.gain.cancelScheduledValues, node.gain.setValueAtTime, STORAGE.set|
|src/script/11.js:47|installSfxVolumeSliderV2176|declaration|需要进一步测试|document.getElementById, master?.closest, document.createElement, Math.round, masterRow.insertAdjacentElement, pane.prepend|
|src/script/11.js:83|syncSettingsControls|assignment|需要进一步测试|_v2176SyncSettingsControls.apply, installSfxVolumeSliderV2176, document.getElementById, Math.round|
|src/script/11.js:98|rebuildSettingsV26|assignment|需要进一步测试|_v2176RebuildSettingsV26.apply, setTimeout|
|src/script/11.js:107|showSettingsV26|assignment|需要进一步测试|_v2176ShowSettingsV26.call, setTimeout|
|src/script/12.js:10|resetRoundItemUseLocksV2177|declaration|需要进一步测试|state.groups.forEach|
|src/script/12.js:14|refreshAllInMusicAfterItemUseV2177|declaration|需要进一步测试|checkAllInRatio, bgmTransitionThinkingToBattle, bgmTransitionBattleToThinking|
|src/script/12.js:27|markItemUsedThisRoundV2177|declaration|需要进一步测试|state.groups.find, refreshAllInMusicAfterItemUseV2177, showToast, saveState, renderGrid, renderDashboard, renderItemWindow|
|src/script/12.js:51|showItemUseFx|assignment|需要进一步测试|_v2177ShowItemUseFx.call|
|src/script/12.js:67|queueUseStateV2120|assignment|需要进一步测试|_v2177QueueUseState.call|
|src/script/13.js:6|batchToggleAllIn|assignment|需要进一步测试|showToast, playSound, state.groups.filter, locked.forEach, saveState, renderGrid, renderDashboard, refreshAllInMusicAfterItemUseV2177, eligible.every, eligible.forEach, state.groups.forEach, checkAllInRatio, bgmTransitionThinkingToBattle, bgmTransitionBattleToThinking|
|src/script/14.js:13|ensureDrawThrottleV2179|declaration|需要进一步测试|ensureItemState, Number.isFinite, Number, Math.max, Math.floor, ['lightning','blooper'].forEach|
|src/script/14.js:40|restrictedItemWeightsV2179|declaration|需要进一步测试|ranking, Math.max, r.findIndex, itemDropWeights, ensureDrawThrottleV2179, Number, STRONG_GROUP_ITEMS_V2179.forEach|
|src/script/14.js:64|commitDrawThrottleV2179|declaration|需要进一步测试|Math.max, Number, STRONG_GROUP_ITEMS_V2179.has, GLOBAL_FIVE_DRAW_ITEMS_V2179.has|
|src/script/14.js:88|pickItemForGroupV281|assignment|需要进一步测试|heldItemKeysV281, restrictedItemWeightsV2179, weightedPickNoRepeatV281, weightedPick, ITEM_KEYS.forEach, Number, Object.keys, commitDrawThrottleV2179|
|src/script/14.js:146|installDrawCooldownInfoV2179|declaration|需要进一步测试|document.getElementById, ensureDrawThrottleV2179, document.createElement, host.appendChild|
|src/script/14.js:165|installClearItemsSettingV2172|assignment|需要进一步测试|_v2179InstallClearItems.apply, installDrawCooldownInfoV2179|
|src/script/15.js:16|ensureDrawSessionThrottleV21710|declaration|需要进一步测试|ensureItemState, Math.max, Math.floor, Number, ['lightning','blooper'].forEach|
|src/script/15.js:45|beginDrawSessionV21710|declaration|需要进一步测试|ensureDrawSessionThrottleV21710, saveState|
|src/script/15.js:60|sessionRestrictedWeightsV21710|declaration|需要进一步测试|ranking, Math.max, r.findIndex, itemDropWeights, ensureDrawSessionThrottleV21710, Number, activeDrawSessionV21710?.selectedGlobalUnique?.has, itemExistsOnFieldV2172, ensureDrawThrottleV2179, STRONG_GROUP_ITEMS_V2179.forEach|
|src/script/15.js:96|commitSessionDrawV21710|declaration|需要进一步测试|ensureDrawSessionThrottleV21710, ensureDrawThrottleV2179, Math.max, Number, STRONG_GROUP_ITEMS_V2179.has, GLOBAL_FIVE_DRAW_ITEMS_V2179.has, activeDrawSessionV21710.selectedGlobalUnique.add|
|src/script/15.js:128|pickItemForGroupV281|assignment|需要进一步测试|heldItemKeysV281, sessionRestrictedWeightsV21710, weightedPickNoRepeatV281, weightedPick, ITEM_KEYS.forEach, Number, Object.keys, commitSessionDrawV21710|
|src/script/15.js:155|globalItemDraw|assignment|需要进一步测试|ensureV2State, state.groups.filter, eligibleForItems, Array.isArray, isCommunismMode, beginDrawSessionV21710, _v21710GlobalItemDraw.apply|
|src/script/15.js:171|handDrawItem|assignment|需要进一步测试|ensureV2State, state.groups.find, eligibleForItems, Array.isArray, beginDrawSessionV21710, _v21710HandDrawItem.apply|
|src/script/15.js:189|refreshDrawCooldownInfoV21710|declaration|需要进一步测试|document.getElementById, ensureDrawSessionThrottleV21710, Number, text|
|src/script/15.js:195|text|binding|需要进一步测试|Number|
|src/script/15.js:215|installDrawCooldownInfoV2179|assignment|需要进一步测试|_v21710InstallInfo.apply, refreshDrawCooldownInfoV21710|
|src/script/15.js:224|showSettingsV26|assignment|需要进一步测试|_v21710ShowSettings.call, setTimeout|
|src/script/16.js:9|startDrawSoundBedV2164|assignment|需要进一步测试|stopActiveDrawAudioV2171, playTrackedDrawSoundV2171, setInterval, clearInterval, setTimeout, finishDrawAudioV2171|
|src/script/16.js:42|globalItemDraw|assignment|需要进一步测试|ensureV2State, state.groups.filter, eligibleForItems, Array.isArray, showToast, document.getElementById('view-battle')?.classList.contains, document.getElementById, switchView, beginDrawSessionV21710, DesktopUI.visualEvent, startDrawSoundBedV2164, recordHistory, renderGrid, performance.now, eligible.forEach, document.querySelector, c.classList.add, document.createElement, c.appendChild, overlays.set, BattleMotion.trackDraw, Math.min, Math.pow, lastUpdate.get, lastUpdate.set, updateCardRouletteVisual, overlays.get, roulettePreviewPickV282, requestAnimationFrame, pickItemForGroupV281, addItemToGroup, batchUsed.add, o.classList.add, o.querySelector, saveState, setTimeout, c.querySelector, BattleMotion.fadeDraw, o?.parentElement?.classList.remove, o?.remove, BattleMotion.releaseDraw, renderAll|
|src/script/16.js:90|frame|declaration|需要进一步测试|Math.min, Math.pow, eligible.forEach, lastUpdate.get, lastUpdate.set, updateCardRouletteVisual, overlays.get, roulettePreviewPickV282, requestAnimationFrame, pickItemForGroupV281, addItemToGroup, batchUsed.add, o.classList.add, o.querySelector, saveState, renderGrid, setTimeout, document.querySelector, c.querySelector, BattleMotion.fadeDraw, o?.parentElement?.classList.remove, o?.remove, BattleMotion.releaseDraw, renderAll|
|src/script/16.js:160|handDrawItem|assignment|需要进一步测试|ensureV2State, state.groups.find, eligibleForItems, showToast, beginDrawSessionV21710, DesktopUI.visualEvent, startDrawSoundBedV2164, performance.now, document.getElementById, escapeHtml, BattleMotion.enterDrawContent, Math.min, Math.pow, roulettePreviewPickV282, itemVisual, cap.animate, requestAnimationFrame, cancelHandItemDraw, renderHandRaise, pickItemForGroupV281, recordHistory, addItemToGroup, saveState, renderAll|
|src/script/16.js:192|frame|declaration|需要进一步测试|Math.min, Math.pow, document.getElementById, state.groups.find, roulettePreviewPickV282, itemVisual, cap.animate, requestAnimationFrame, eligibleForItems, cancelHandItemDraw, showToast, renderHandRaise, pickItemForGroupV281, recordHistory, addItemToGroup, saveState, renderAll, escapeHtml, BattleMotion.enterDrawContent|
|src/script/16.js:274|playCasterCardFx|assignment|需要进一步测试|BattleMotion.show|
|src/script/16.js:275|playTargetCardFx|assignment|需要进一步测试|BattleMotion.show|
|src/script/16.js:276|playAttackTargetFxV2116|assignment|需要进一步测试|BattleMotion.show|
|src/script/17.js:29|applyLightningHitV2116|assignment|需要进一步测试|eligibleForItems, _v21713ApplyLightningHit.call|
|src/script/18.js:37|renderAbout|assignment|需要进一步测试|document.querySelectorAll('[data-about]').forEach, document.querySelectorAll, b.classList.toggle, document.getElementById, _v21715RenderAbout.call, ITEM_KEYS.map(k=>{         const d=ITEM_DEFS[k];         const desc=ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715[k] ／／ d.desc ／／ '';         return <div class="v2170-ency-row">           <div class="v2170-ency-icon">${itemVisual(k,'v2170-ency-img')}</div>           <div class="v2170-ency-copy">             <div class="v2170-ency-name">${escapeHtml(d.name)}</div>             <div class="v2170-ency-desc">${escapeHtml(desc)}</div>           </div>         </div>;       }).join, ITEM_KEYS.map, itemVisual, escapeHtml|
|src/script/19.js:2|selectGroupPresetColorV21716|declaration|需要进一步测试|openPwdModal, /^#[0-9a-f]{6}$/i.test, updateGroupColor, renderItemWindow|
|src/script/19.js:10|previewItemDetailColorV21716|declaration|需要进一步测试|previewItemDetailColor, document.getElementById, String(value／／'').toUpperCase, String|
|src/script/20.js:8|ensureSpinyCooldownV21717|declaration|需要进一步测试|ensureDrawSessionThrottleV21710, Number.isFinite, Number, Math.max, Math.floor|
|src/script/20.js:22|sessionRestrictedWeightsV21710|assignment|需要进一步测试|_v21717SessionRestrictedWeights.call, ensureSpinyCooldownV21717, Math.max, Number|
|src/script/20.js:37|commitSessionDrawV21710|assignment|需要进一步测试|_v21717CommitSessionDraw.call, ensureSpinyCooldownV21717|
|src/script/20.js:49|refreshDrawCooldownInfoV21710|assignment|需要进一步测试|_v21717RefreshCooldownInfo.call, document.getElementById, ensureSpinyCooldownV21717, Number, document.createElement, host.appendChild|
|src/script/21.js:7|pickItemForGroupV281|assignment|需要进一步测试|heldItemKeysV281, sessionRestrictedWeightsV21710, weightedPickNoRepeatV281, commitSessionDrawV21710|
|src/script/21.js:31|repairDuplicateInventoryV21718|declaration|需要进一步测试|state.groups.forEach, JSON.stringify, normalizeInventoryV21718, saveState, renderAll|
|src/script/22.js:3|repairFlowerChargesV21719|declaration|需要进一步测试|state.groups.forEach, Array.isArray, g.inventory.forEach, keys.has, Number, Number.isInteger, Number.isFinite, Math.max, Math.min, Math.trunc, saveState, renderAll|
|src/script/23.js:3|clearBrokenCardTranslateV21720|declaration|需要进一步测试|document.querySelectorAll('.group-row-card.v213-card').forEach, document.querySelectorAll, card.style.removeProperty|
|src/script/24.js:4|renderBattleRankPreviewV21721|declaration|需要进一步测试|document.getElementById, ranking, state.groups.slice().sort, state.groups.slice, Number, ranked.map((g,i)=>{     const rank=i+1;     const no=(typeof groupNoTextV213==='function') ? groupNoTextV213(g) : String(g.groupNo／／g.id／／'');     const medal=rank===1?'🥇':rank===2?'🥈':rank===3?'🥉':String(rank);     return <div class="battle-rank-chip-v21721 ${rank===1?'rank-1':''}" style="--rank-group-color:${g.color／／'#0F766E'}" title="第 ${rank} 名 · ${escapeHtml(g.name)} · 第 ${no} 组 · ${g.score} 分">       <div class="battle-rank-no-v21721">${medal}</div>       <div class="battle-rank-name-v21721">${escapeHtml(g.name)}</div>       <div class="battle-rank-score-v21721">${g.score}分</div>     </div>;   }).join, ranked.map, groupNoTextV213, String, escapeHtml|
|src/script/24.js:34|switchView|assignment|需要进一步测试|_v21721SwitchView.call, setTimeout, renderBattleRankPreviewV21721|
|src/script/27.js:9|desiredGroupsV21724|declaration|需要进一步测试|state.groups.slice, groups.sort, groupNoValueV213, Number, ranking().slice, ranking|
|src/script/27.js:47|refreshSortingV21724|declaration|需要进一步测试|renderBattleRankPreviewV21721|
|src/script/28.js:6|captureCardRectsV21725|declaration|需要进一步测试|document.querySelectorAll('#groupList .group-row-card[data-group-id]').forEach, document.querySelectorAll, card.getBoundingClientRect, map.set, String|
|src/script/28.js:20|animateCardsFromSnapshotV21725|declaration|需要进一步测试|document.querySelectorAll('#groupList .group-row-card[data-group-id]').forEach, document.querySelectorAll, oldRects.get, String, card.getBoundingClientRect, Math.abs, card.style.setProperty, moved.push, clearTimeout, moved.forEach, requestAnimationFrame, setTimeout, card.style.removeProperty|
|src/script/30.js:5|closeThemeDialogV21727|declaration|需要进一步测试|document.getElementById, hideClassroomWindow, root.setAttribute, resolve|
|src/script/30.js:15|openThemeDialogV21727|declaration|需要进一步测试|document.getElementById, Promise.resolve, prev, String, document.createElement, closeThemeDialogV21727, actions.appendChild, setTimeout, ok.focus, showClassroomWindow, root.setAttribute|
|src/script/30.js:46|cancel.onclick|assignment|需要进一步测试|closeThemeDialogV21727|
|src/script/30.js:53|ok.onclick|assignment|需要进一步测试|closeThemeDialogV21727|
|src/script/30.js:61|ok.onclick|assignment|需要进一步测试|closeThemeDialogV21727|
|src/script/30.js:71|themeAlert|declaration|需要进一步测试|openThemeDialogV21727|
|src/script/30.js:75|themeConfirm|declaration|需要进一步测试|openThemeDialogV21727|
|src/script/31.js:2|scheduleScoreEffect|declaration|需要进一步测试|setTimeout, fn|
|src/script/31.js:6|cancelItemScoreAnimations|declaration|需要进一步测试|activeScoreRollsV21732.clear, document.querySelectorAll('.score-roll-host-v21730').forEach, document.querySelectorAll, el.classList.remove, state.groups.find, String, el.id.slice, clearTimeout, itemScoreDisplayHoldV21732.clear, state.groups.forEach, document.getElementById|
|src/script/31.js:34|snapshotScoresV21732|declaration|需要进一步测试|state.groups.map, String, Number|
|src/script/31.js:38|getScoreElementV21732|declaration|需要进一步测试|document.getElementById|
|src/script/31.js:42|applyHeldDisplayScoresV21732|declaration|需要进一步测试|itemScoreDisplayHoldV21732.forEach, state.groups.find, String|
|src/script/31.js:49|showDeltaOnlyV21732|declaration|需要进一步测试|getScoreElementV21732, scoreEl.querySelectorAll('.item-score-delta-v21730').forEach, scoreEl.querySelectorAll, x.remove, document.createElement, scoreEl.appendChild, requestAnimationFrame, deltaEl.classList.add, scheduleScoreEffect, deltaEl.remove|
|src/script/31.js:66|mountScoreRollV21732|declaration|需要进一步测试|scoreEl.style.setProperty, scoreEl.classList.add, document.createElement, Math.max, performance.now, scoreEl.append|
|src/script/31.js:75|rollThenCommitScoreV21732|declaration|需要进一步测试|String, state.groups.find, itemScoreDisplayHoldV21732.delete, performance.now, activeScoreRollsV21732.set, getScoreElementV21732, mountScoreRollV21732, scheduleScoreEffect, activeScoreRollsV21732.get, activeScoreRollsV21732.delete, el.classList.remove, renderChart, renderDashboard, updateHeaderStats, renderBattleRankPreviewV21721|
|src/script/31.js:89|queueItemScoreChangesV21732|declaration|需要进一步测试|DesktopUI.getPreferences, matchMedia, state.groups.forEach, beforeMap.get, String, Number, changes.push, itemScoreDisplayHoldV21732.get, activeScoreRollsV21732.delete, itemScoreDisplayHoldV21732.set, getScoreElementV21732, pendingItemScoreAnimationsV21732.push, pendingItemScoreAnimationsV21732.forEach, merged.has, merged.set, merged.get, merged.values, clearTimeout, scheduleScoreEffect, pendingItemScoreAnimationsV21732.splice, batch.forEach, state.groups.find, itemScoreDisplayHoldV21732.delete, showDeltaOnlyV21732, rollThenCommitScoreV21732|
|src/script/31.js:162|restoreHeldScoreElementsV21732|declaration|需要进一步测试|itemScoreDisplayHoldV21732.forEach, getScoreElementV21732, el.classList.contains, activeScoreRollsV21732.get, String, state.groups.find, mountScoreRollV21732|
|src/script/32.js:3|normalizeItemEffectForStatusV21731|declaration|需要进一步测试|Number, Object.keys|
|src/script/32.js:26|repairAllItemEffectsV21731|declaration|需要进一步测试|state.groups.forEach, JSON.stringify, normalizeItemEffectForStatusV21731, saveState|
|src/script/32.js:40|ensureItemState|assignment|需要进一步测试|_v21731EnsureItemState.apply, repairAllItemEffectsV21731|
|src/script/35.js:4|getTopNoticeStackV21735|declaration|需要进一步测试|document.getElementById, document.createElement, document.body.appendChild|
|src/script/35.js:15|appendTopNoticeV21735|declaration|需要进一步测试|getTopNoticeStackV21735, stack.appendChild, node.remove, stack.remove, node.addEventListener, setTimeout|
|src/script/35.js:19|remove|binding|需要进一步测试|node.remove, stack.remove|
|src/script/35.js:31|showItemUseFx|assignment|需要进一步测试|ItemModules.feedback, DesktopUI.visualEvent, DesktopUI.getPreferences, playSound, setTimeout, itemSoundCategoryV26, playCasterCardFx, special.includes, ['coin_shell','question','question_block'].includes, cardFxTargets(key,casterId).forEach, cardFxTargets, playTargetCardFx, state.groups?.find, document.createElement, itemVisual, escapeHtml, appendTopNoticeV21735|
|src/script/35.js:80|tinyDefenseToast|assignment|需要进一步测试|playSound, document.createElement, escapeHtml, String, appendTopNoticeV21735|
|src/script/36.js:5|parseStudentV218|declaration|需要进一步测试|String(raw??'').trim, String, text.match, Number, (m[2]／／'').trim|
|src/script/36.js:12|studentLabelHTMLV218|declaration|需要进一步测试|parseStudentV218, escapeHtml|
|src/script/36.js:17|pinyinInitialV218|declaration|需要进一步测试|parseStudentV218(raw).name.trim, parseStudentV218, /[A-Za-z]/.test, ch.toUpperCase, /\d/.test, ch.localeCompare|
|src/script/36.js:45|renderBattleRankPreviewV21721|assignment|需要进一步测试|_v218RenderBattleRankPreview.apply, Number, Date.now, document.querySelectorAll('#battleRankPreviewGridV21721 .battle-rank-score-v21721')       .forEach, document.querySelectorAll|
|src/script/36.js:56|searchMemberGroups|assignment|需要进一步测试|document.getElementById, input.value.trim().toLowerCase, input.value.trim, state.groups.forEach, (g.members／／[]).forEach, parseStudentV218, String(p.number).includes, String, q.replace, p.name.toLowerCase().includes, p.name.toLowerCase, String(member).toLowerCase().includes, String(member).toLowerCase, /\d/.test, matches.push, escapeHtml, matches.map(({member,p,group:g})=>     <div class="member-search-result">       <div class="member-search-result-name">${studentLabelHTMLV218(member,g)}</div>       <div class="member-search-result-group" style="color:${g.color}">${escapeHtml(g.name)}</div>     </div>).join, matches.map, studentLabelHTMLV218|
|src/script/36.js:86|syncPickerScoreTarget|assignment|需要进一步测试|document.getElementById, DesktopUI.pickerChanged, escapeHtml, studentLabelHTMLV218|
|src/script/36.js:98|allStudentsV218|declaration|需要进一步测试|state.groups.forEach, (g.members／／[]).forEach, parseStudentV218, out.push, pinyinInitialV218|
|src/script/36.js:106|numberBandV218|declaration|需要进一步测试|Number.isFinite, Math.floor|
|src/script/36.js:112|openQuickPersonScoreV218|declaration|需要进一步测试|qpStateV218.selected.clear, qpStateV218.bands.clear, qpStateV218.groups.clear, qpStateV218.letters.clear, document.getElementById, renderQuickPersonFiltersV218, renderQuickPersonListV218, showClassroomWindow|
|src/script/36.js:118|closeQuickPersonScoreV218|declaration|需要进一步测试|hideClassroomWindow, document.getElementById|
|src/script/36.js:119|toggleQPSetV218|declaration|需要进一步测试|set.has, set.delete, set.add, renderQuickPersonFiltersV218, renderQuickPersonListV218|
|src/script/36.js:124|renderQuickPersonFiltersV218|declaration|需要进一步测试|allStudentsV218, [...new Set(students.map(s=>numberBandV218(s.p.number)).filter(Boolean))]     .sort, students.map(s=>numberBandV218(s.p.number)).filter, students.map, numberBandV218, parseInt, document.getElementById, bands.map(x=><button class="qp-chip-v218 ${qpStateV218.bands.has(x)?'active':''}" onclick="toggleQPSetV218('bands','${x}')">${x}</button>).join, bands.map, qpStateV218.bands.has, state.groups.map(g=><button class="qp-chip-v218 ${qpStateV218.groups.has(g.id)?'active':''}" style="${qpStateV218.groups.has(g.id)?background:${g.color};border-color:${g.color}:''}" onclick="toggleQPSetV218('groups',${g.id})">${escapeHtml(g.name)}</button>).join, state.groups.map, qpStateV218.groups.has, escapeHtml, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split, letters.map(x=><button class="qp-chip-v218 qp-letter-v218 ${qpStateV218.letters.has(x)?'active':''}" onclick="toggleQPSetV218('letters','${x}')">${x}</button>).join, letters.map, qpStateV218.letters.has|
|src/script/36.js:138|filteredStudentsV218|declaration|需要进一步测试|(document.getElementById('qpSearchV218')?.value／／'').trim().toLowerCase, (document.getElementById('qpSearchV218')?.value／／'').trim, document.getElementById, allStudentsV218().filter, allStudentsV218, q.replace, s.p.name.toLowerCase().includes, s.p.name.toLowerCase, String(s.member).toLowerCase().includes, String(s.member).toLowerCase, String, String(s.p.number).includes, qpStateV218.bands.has, numberBandV218, qpStateV218.groups.has, qpStateV218.letters.has|
|src/script/36.js:153|renderQuickPersonListV218|declaration|需要进一步测试|document.getElementById, filteredStudentsV218, list.map(s=>     <button class="quick-person-entry-v218 ${qpStateV218.selected.has(s.key)?'selected':''}" onclick="toggleQuickPersonV218('${escapeHtml(s.key).replace(/'/g,"&#39;")}')">       ${s.p.number!=null?<span class="student-no-v218" style="background:${s.group.color}">${escapeHtml(s.p.numberText)}</span>:'<span class="student-no-v218" style="background:#94a3b8">—</span>'}       <span class="student-name-v218">${escapeHtml(s.p.name)}</span>       <span class="qp-group-v218" title="${escapeHtml(s.group.name)}">${escapeHtml(s.group.name)}</span>     </button>).join, list.map, qpStateV218.selected.has, escapeHtml(s.key).replace, escapeHtml|
|src/script/36.js:165|toggleQuickPersonV218|declaration|需要进一步测试|qpStateV218.selected.has, qpStateV218.selected.delete, qpStateV218.selected.add, renderQuickPersonListV218|
|src/script/36.js:169|applyQuickPersonScoreV218|declaration|需要进一步测试|openPwdModal, Number, Number.isSafeInteger, showToast, allStudentsV218().filter, allStudentsV218, qpStateV218.selected.has, selected.forEach, counts.set, counts.get, Reliability.planBatchScoreChanges, updates.map(u=>{     const name=state.groups.find(g=>g.id===u.id)?.name／／'小组';     return name+' '+(u.delta>=0?'+':'')+u.delta;   }).join, updates.map, state.groups.find, cancelScoreAnimationAndSync, runClassroomCommand, animateScores, playSound, ClassroomFeedback.score, updates.reduce|
|src/script/36.js:196|applyQuickPersonCustomV218|declaration|需要进一步测试|Number, document.getElementById, Number.isFinite, showToast, applyQuickPersonScoreV218|
|src/script/36.js:225|consumeOneV218|declaration|需要进一步测试|Math.max, Number, g.inventory.splice|
|src/script/36.js:230|attackOneFifthV218|declaration|需要进一步测试|Math.round, Math.max, Number, applyItemScore|
|src/script/36.js:235|finishOwnItemUseV218|declaration|需要进一步测试|Number, recordHistory, saveState, renderAll, showItemUseFx, showToast|
|src/script/36.js:247|queueUseStateV2120|assignment|需要进一步测试|ItemModules.canUse, TRIPLE_KEYS_V218.has, _v218QueueState.call|
|src/script/36.js:282|itemDropWeights|assignment|需要进一步测试|_v218ItemDropWeights.call, Math.max, Math.ceil, Number, ItemModules.drawWeights|
|src/script/36.js:295|pickItemForGroupV281|assignment|需要进一步测试|ItemDrawBlocks.pick|
|src/script/36.js:301|scoreSnapshotV218|declaration|需要进一步测试|state.groups.map, Number|
|src/script/36.js:302|showHandEffectV218|declaration|需要进一步测试|document.getElementById, state.groups.forEach, before.get, Number, lines.push, escapeHtml, itemVisual, lines.join, overlay.classList.add, clearTimeout, setTimeout, overlay.classList.remove|
|src/script/36.js:319|handUseOneV218|declaration|需要进一步测试|state.groups.find, showToast, scoreSnapshotV218, useItem, setTimeout, showHandEffectV218, renderHandRewardControlsV218|
|src/script/36.js:327|handUseAllTripleV218|declaration|需要进一步测试|state.groups.find, TRIPLE_KEYS_V218.has, showToast, scoreSnapshotV218, Math.min, Number, showHandEffectV218, renderHandRewardControlsV218, useItem, setTimeout, fire|
|src/script/36.js:333|fire|binding|需要进一步测试|state.groups.find, showHandEffectV218, renderHandRewardControlsV218, useItem, setTimeout|
|src/script/36.js:347|renderHandRewardControlsV218|declaration|需要进一步测试|document.getElementById, state.groups.find, TRIPLE_KEYS_V218.has, Number, eligibleForItems, ClassroomFeedback.slotMarkup, escapeHtml|
|src/script/36.js:366|judgeHandRaise|assignment|需要进一步测试|_v218JudgeHandRaise.call, setTimeout|
|src/script/36.js:373|finishHandItemReward|assignment|需要进一步测试|renderHandRewardControlsV218|
|src/script/36.js:416|renderAbout|assignment|需要进一步测试|_v218RenderAbout.call, document.querySelectorAll('[data-about]').forEach, document.querySelectorAll, b.classList.toggle, document.getElementById, ITEM_ORDER_V218.filter(k=>ITEM_DEFS[k]).map(k=>{       const d=ITEM_DEFS[k],desc=(typeof ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715!=='undefined'&&ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715[k])／／d.desc／／'';       return <div class="v2170-ency-row">         <div class="v2170-ency-icon">${itemVisual(k,'v2170-ency-img')}</div>         <div class="v2170-ency-copy">           <div class="v2170-ency-name">${escapeHtml(d.name)}</div>           <div class="v2170-ency-desc">${escapeHtml(desc)}</div>           <div class="v218-ency-tip"><b>使用技巧：</b>${escapeHtml(ITEM_TIPS_V218[k]／／'根据当前排名、道具栏与答题阶段灵活使用。')}</div>         </div>       </div>;     }).join, ITEM_ORDER_V218.filter(k=>ITEM_DEFS[k]).map, ITEM_ORDER_V218.filter, itemVisual, escapeHtml|
|src/script/37.js:43|groupItemDescV2182|declaration|需要进一步测试||
|src/script/37.js:55|syncGodItemPickerV2182|declaration|需要进一步测试|[...document.querySelectorAll('*')].filter, document.querySelectorAll, /上帝模式\s*·\s*强制追加到队尾/.test, roots.sort((a,b)=>a.querySelectorAll('button').length-b.querySelectorAll('button').length)                 .find, roots.sort, a.querySelectorAll, b.querySelectorAll, el.querySelectorAll, root.querySelectorAll, buttons.forEach, btn.getAttribute, oc.match, byKey.set, byKey.values, GROUP_ITEM_ORDER_V2182.forEach, byKey.get, groupItemDescV2182, parent.appendChild|
|src/script/37.js:86|syncOwnedItemCardsV2182|declaration|需要进一步测试|state.groups.find, document.querySelectorAll('#itemWindowBody .queue-item-card').forEach, document.querySelectorAll, card.querySelector, groupItemDescV2182|
|src/script/37.js:96|syncGroupItemInfoV2182|declaration|需要进一步测试|syncGodItemPickerV2182, syncOwnedItemCardsV2182|
|src/script/37.js:103|renderItemWindow|assignment|需要进一步测试|_v2182RenderItemWindow.apply, requestAnimationFrame|
|src/script/37.js:112|adminAddItem|assignment|需要进一步测试|_v2182AdminAddItem.apply, setTimeout|
|src/script/38.js:64|renderAbout|assignment|需要进一步测试|_v2184RenderAbout.call, document.querySelectorAll('[data-about]').forEach, document.querySelectorAll, b.classList.toggle, document.getElementById, ITEM_ORDER_V218.filter(k=>ITEM_DEFS[k]).map(k=>{       const d=ITEM_DEFS[k];       const exact=(typeof GROUP_ITEM_DESC_V2182!=='undefined'&&GROUP_ITEM_DESC_V2182[k])         ／／(typeof ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715!=='undefined'&&ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715[k])         ／／d.desc／／'';       const funny=ITEM_FUNNY_COPY_V2184[k]／／'它有自己的工作，而且暂时没有向策划提交辞职申请。';       const tag=ITEM_FUNNY_TAG_V2184[k]／／'道具';       const tip=(typeof ITEM_TIPS_V218!=='undefined'&&ITEM_TIPS_V218[k])／／'根据排名和当前局势使用，别只因为图标好看就按。';       return <div class="v2170-ency-row">         <div class="v2170-ency-icon">${itemVisual(k,'v2170-ency-img')}</div>         <div class="v2170-ency-copy">           <div class="v2170-ency-name">${escapeHtml(d.name)} <span style="font-size:11px;font-weight:800;color:#0f766e;background:#eaf7f4;border-radius:999px;padding:3px 7px;margin-left:5px">${escapeHtml(tag)}</span></div>           <div class="v2170-ency-desc" style="margin-top:7px;color:#334e49;line-height:1.65">${escapeHtml(funny)}</div>           <div class="v218-ency-tip"><b>实际效果：</b>${escapeHtml(exact)}</div>           <div class="v218-ency-tip" style="background:#fff8eb;color:#6f5830"><b style="color:#b66a00">使用技巧：</b>${escapeHtml(tip)}</div>         </div>       </div>;     }).join, ITEM_ORDER_V218.filter(k=>ITEM_DEFS[k]).map, ITEM_ORDER_V218.filter, itemVisual, escapeHtml|
|src/script/39.js:24|ensureDockHumorTipV2185|declaration|需要进一步测试|document.createElement, document.body.appendChild|
|src/script/39.js:32|bindDockHumorV2185|declaration|需要进一步测试|el.removeAttribute, el.addEventListener, ensureDockHumorTipV2185, escapeHtml, el.getBoundingClientRect, tip.classList.add, tip.getBoundingClientRect, Math.max, Math.min, ensureDockHumorTipV2185().classList.remove|
|src/script/39.js:52|applyDockHumorV2185|declaration|需要进一步测试|document.querySelector, bindDockHumorV2185, document.getElementById, [...dock.querySelectorAll('.dock-left>div')].find, dock.querySelectorAll, x.querySelector, ansWrap.querySelector, ansWrap.querySelectorAll('.ans-btn').forEach, ansWrap.querySelectorAll, btn.removeAttribute, [...dock.querySelectorAll('button')].find, (b.getAttribute('onclick')／／'').includes, b.getAttribute, byOnclick|
|src/script/39.js:76|byOnclick|binding|需要进一步测试|[...dock.querySelectorAll('button')].find, dock.querySelectorAll, (b.getAttribute('onclick')／／'').includes, b.getAttribute|
|src/script/39.js:101|renderLockState|assignment|需要进一步测试|_v2185RenderLockState.apply, document.getElementById, bindDockHumorV2185|
|src/script/41.js:5|polishVisibleCopyV2187|declaration|需要进一步测试|document.querySelector, document.querySelectorAll('.god-item-tools b,.queue-god-tools-v2120 b').forEach, document.querySelectorAll, /上帝模式/.test, document.querySelectorAll('.god-item-tools .btn-danger,.queue-god-tools-v2120 .btn-danger').forEach, /清空/.test|
|src/script/41.js:37|renderAbout|assignment|需要进一步测试|_v2187RenderAbout.call, document.querySelectorAll('[data-about]').forEach, document.querySelectorAll, b.classList.toggle, document.getElementById|
|src/script/41.js:73|openPwdModal|assignment|需要进一步测试|_v2187OpenPwdModal.apply, document.querySelector|
|src/script/41.js:90|window[name]|assignment|需要进一步测试|fn.apply, setTimeout|
|src/script/43.js:2|cleanVisibleCopyV21811|declaration|需要进一步测试|document.getElementById, document.createTreeWalker, walker.nextNode, nodes.push, nodes.forEach, n.nodeValue         .replace(/原来的\s*音乐设置已经退休[^。]*。?/g,'')         .replace(/原来的\s*旧版音乐参数面板已经退休[^。]*。?/g,'')         .replace(/旧版音乐参数面板/g,'音乐设置')         .replace, n.nodeValue         .replace(/原来的\s*音乐设置已经退休[^。]*。?/g,'')         .replace(/原来的\s*旧版音乐参数面板已经退休[^。]*。?/g,'')         .replace, n.nodeValue         .replace(/原来的\s*音乐设置已经退休[^。]*。?/g,'')         .replace, n.nodeValue         .replace|
|src/script/43.js:18|renderAbout|assignment|需要进一步测试|_v21811RenderAbout.apply, cleanVisibleCopyV21811|
|src/script/44.js:5|resetCompetitionDataAfterSettlementV21812|declaration|需要进一步测试|cancelScoreAnimationAndSync, StableIdentity.createSeasonId, state.groups.forEach, STORAGE.getJSON, resetSlotDisplay, document.getElementById('squidVeil')?.classList.remove, document.getElementById, document.querySelectorAll('.squid-hidden-score').forEach, document.querySelectorAll, el.classList.remove, STORAGE.setJSON, document.getElementById('itemWindow')?.classList.remove, document.getElementById('handRaiseBackdrop')?.classList.remove, document.getElementById('itemDrawOverlay')?.classList.remove, ensureV2State|
|src/script/45.js:4|snapshotGroupForSettlementV21813|declaration|需要进一步测试|clone, Number|
|src/script/45.js:29|compactUndoHistoryV21813|declaration|需要进一步测试|(historyStack／／[]).map, (h.groups／／[]).map, clone|
|src/script/45.js:46|buildSettlementClearedDataV21813|declaration|需要进一步测试|new Date().toLocaleString, state.groups.map, Number, clone, compactUndoHistoryV21813|
|src/script/45.js:104|csvCellV21813|declaration|需要进一步测试|JSON.stringify, String, Reliability.csvText, text.replace|
|src/script/45.js:112|itemNameV21813|declaration|需要进一步测试||
|src/script/45.js:115|inventoryTextV21813|declaration|需要进一步测试|(inv／／[]).map(it=>{     const n=itemNameV21813(it.key);     const c=Number(it.charges)／／1;     return c>1?${n} ×${c}:n;   }).join, (inv／／[]).map, itemNameV21813, Number|
|src/script/45.js:122|effectTextV21813|declaration|需要进一步测试|out.push, Number, out.join|
|src/script/45.js:135|exportSingleSettlementCSV|assignment|需要进一步测试|getSettlementHistory, lines.push, [     ['档案名称',record.title／／'课堂结算'],     ['归档日期',record.date／／''],     ['归档时间',record.time／／''],     ['第一名',record.champion／／''],     ['小组数量',record.totalGroups??groups.length],     ['全班总分',record.totalScore??groups.reduce((n,g)=>n+(Number(g.score)／／0),0)]   ].forEach, groups.reduce, Number, csvCellV21813, [     ['课堂作答总次数',answers],     ['答题轮次',Number(ig.pkTotal)／／0],     ['全局道具发放',Number(ig.totalDraws)／／0],     ['手动举手次数',Number(ig.handRaiseTotal)／／0],     ['随机点名记录数',(ig.pickerHistory／／[]).length],     ['手动举手记录数',(ig.handRaiseHistory／／[]).length],     ['撤销历史节点数',(snap.undoHistory／／[]).length]   ].forEach, [     '排名','小组名称','最终得分','组员名单',     '答对次数','答错次数','道具抽取次数','道具使用次数',     '持有道具','持续状态','幽灵防护剩余','本题已使用道具','三重道具续用键',     'All In','所选答案','结果文字'   ].map(csvCellV21813).join, [     '排名','小组名称','最终得分','组员名单',     '答对次数','答错次数','道具抽取次数','道具使用次数',     '持有道具','持续状态','幽灵防护剩余','本题已使用道具','三重道具续用键',     'All In','所选答案','结果文字'   ].map, [...groups].sort, ranked.forEach, [       r+1,g.name,Number(g.score)／／0,(g.members／／[]).join(' / '),       Number(g.itemStats?.correct)／／0,Number(g.itemStats?.wrong)／／0,       Number(g.itemStats?.draws)／／0,Number(g.itemStats?.used)／／0,       inventoryTextV21813(g.inventory),effectTextV21813(g),       Number(g.booRoundsLeftV218)／／0,g.itemUsedThisRound?'是':'否',       g.roundItemContinuationKeyV218／／'',       g.allIn?'是':'否',g.selectedOpt／／'',g.resultText／／''     ].map(csvCellV21813).join, [       r+1,g.name,Number(g.score)／／0,(g.members／／[]).join(' / '),       Number(g.itemStats?.correct)／／0,Number(g.itemStats?.wrong)／／0,       Number(g.itemStats?.draws)／／0,Number(g.itemStats?.used)／／0,       inventoryTextV21813(g.inventory),effectTextV21813(g),       Number(g.booRoundsLeftV218)／／0,g.itemUsedThisRound?'是':'否',       g.roundItemContinuationKeyV218／／'',       g.allIn?'是':'否',g.selectedOpt／／'',g.resultText／／''     ].map, (g.members／／[]).join, inventoryTextV21813, effectTextV21813, [     ['鱿鱿遮蔽截止时间',Number(ig.blooperUntil)／／0],     ['抽取节流状态',ig.drawThrottleV2179／／{}],     ['抽取轮次与冷却',ig.drawSessionThrottleV21710／／{}],     ['第一次手动举手特殊抽取是否待触发',snap.transient?.firstHandDrawPending?'是':'否'],     ['当前抽取会话',snap.transient?.activeDrawSession／／null],     ['当前是否正在抽取',snap.transient?.itemDrawBusy?'是':'否']   ].forEach, [     ['点名模式',snap.picker?.mode／／''],     ['已抽学生键',snap.picker?.pickedStudentKeys／／[]],     ['已抽小组 ID',snap.picker?.pickedGroupIds／／[]],     ['预选小组 ID',snap.picker?.preselectedGroupIds／／[]],     ['当前抽取结果',snap.transient?.slotEngine?.chosenResult／／null]   ].forEach, (ig.pickerHistory／／[]).forEach, [i+1,x.time?new Date(x.time).toLocaleString():'',x.text／／''].map(csvCellV21813).join, [i+1,x.time?new Date(x.time).toLocaleString():'',x.text／／''].map, new Date(x.time).toLocaleString, (ig.handRaiseHistory／／[]).forEach, groups.find, [       i+1,x.time?new Date(x.time).toLocaleString():'',x.groupId??'',       g?.name／／'',x.correct?'正确':'错误'     ].map(csvCellV21813).join, [       i+1,x.time?new Date(x.time).toLocaleString():'',x.groupId??'',       g?.name／／'',x.correct?'正确':'错误'     ].map, [     ['是否正在答题',rd.roundActive?'是':'否'],     ['是否已判定',rd.evaluated?'是':'否'],     ['正确答案',rd.correctAnswer／／rd.correctAns／／''],     ['回合编号',Number(rd.roundNo)／／0],     ['是否曾开始过比赛',rd.hasStartedOnce?'是':'否'],     ['上一轮 All In 状态',rd.lastRoundAllIn／／null],     ['当前举手小组 ID',snap.transient?.handRaiseGroupId??''],     ['当前举手抽道具小组 ID',snap.transient?.handItemDrawGroupId??''],     ['待定道具键',snap.transient?.handItemPendingKey??''],     ['道具抽取开始时间',snap.transient?.handItemDrawStartedAt??0],     ['当前道具详情小组 ID',snap.transient?.activeItemGroupId??'']   ].forEach, (snap.undoHistory／／[]).forEach, (h.groups／／[]).map, [       i+1,h.time／／'',h.desc／／'',groupSummary,h.picker／／null,h.itemGlobal／／null     ].map(csvCellV21813).join, [       i+1,h.time／／'',h.desc／／'',groupSummary,h.picker／／null,h.itemGlobal／／null     ].map, lines.join, URL.createObjectURL, document.createElement, (record.title／／'封神榜档案').replace, a.click, URL.revokeObjectURL, showToast|
|src/ui/desktop.js:5|$|binding|需要进一步测试|document.querySelector|
|src/ui/desktop.js:45|icon|declaration|需要进一步测试|GodpowerTheme.icon|
|src/ui/desktop.js:48|empty|declaration|需要进一步测试|icon, E|
|src/ui/desktop.js:51|persistPreferences|declaration|需要进一步测试|localStorage.setItem, JSON.stringify, showToast|
|src/ui/desktop.js:63|applyPreferences|declaration|需要进一步测试|GodpowerTheme.cancel, settleDisclosures, cancelSettingsMotion, ClassroomFeedback.cancel, BattleMotion.clear, window.WelcomeV2?.preferencesChanged, String, canAnimate, cancelItemScoreAnimations, cancelScoreAnimationAndSync, cancelAnimations, document.getAnimations().forEach, document.getAnimations, a.cancel|
|src/ui/desktop.js:80|canAnimate|declaration|需要进一步测试|matchMedia|
|src/ui/desktop.js:89|motionEase|declaration|需要进一步测试|getComputedStyle(document.documentElement)       .getPropertyValue("--motion-ease")       .trim, getComputedStyle(document.documentElement)       .getPropertyValue, getComputedStyle|
|src/ui/desktop.js:94|animate|declaration|需要进一步测试|canAnimate, el.animate, motionEase, animations.add, a.finished.catch(() => {}).finally, a.finished.catch, animations.delete|
|src/ui/desktop.js:106|cancelAnimations|declaration|需要进一步测试|BattleMotion.clear, observeVisualState, cancelAnimationFrame, settleDisclosures, cancelSettingsMotion, a.cancel, animations.clear, document.querySelectorAll("#groupList .group-row-card").forEach, document.querySelectorAll, clearCardFx, clearAttackHitFxV2116, document       .querySelectorAll(".card-fx-badge,.attack-hit-badge-v2116")       .forEach, document       .querySelectorAll, el.remove, document.querySelectorAll(".ui-fx-layer").forEach, x.remove|
|src/ui/desktop.js:125|visualEvent|declaration|需要进一步测试|document.dispatchEvent, BattleMotion.event|
|src/ui/desktop.js:133|syncViewport|declaration|需要进一步测试|Number, getComputedStyle, document.body.style.setProperty|
|src/ui/desktop.js:149|viewChanged|declaration|需要进一步测试|window.GodPowerPageLifecycle?.enter, ClassroomFeedback.cancel, BattleMotion.clear, cancelItemScoreAnimations, cancelScoreAnimationAndSync, window.WelcomeV2?.viewChanged, [...openStack].reverse, ["themeDialogV21727", "grandModalOverlay", "welcomeModal"].includes, m.close, $, document.querySelectorAll(".nav-tab").forEach, document.querySelectorAll, b.setAttribute, String, $(".ui-dock-menu")?.removeAttribute, $(".dock-humor-tip-v2185")?.classList.remove, cancelAnimations, [           ...host.querySelectorAll(selectors[name] ／／ ":scope"),         ].slice, host.querySelectorAll, targets.forEach, animate, Math.min, pageScope.animation, pageScope.frame, requestAnimationFrame, renderWelcome, selectSettings|
|src/ui/desktop.js:183|enterPage|binding|需要进一步测试|$, [           ...host.querySelectorAll(selectors[name] ／／ ":scope"),         ].slice, host.querySelectorAll, targets.forEach, animate, Math.min, pageScope.animation|
|src/ui/desktop.js:227|renderWelcome|declaration|需要进一步测试|$, syncViewport, observeVisualState, canAnimate, document.getAnimations().forEach, document.getAnimations, a.cancel, [...groups].sort, Number, Date.now, JSON.stringify, groups.map, groups             .map((g) => {               const item = g.inventory?.[0],                 states = Object.entries(g.itemEffect ／／ {})                   .filter(                     ([k, v]) =>                       (k === "type" && !!v) ／／                       (["iceLock", "featherDodge"].includes(k) &&                         Number(v) > 0),                   )                   .map(                     ([k, v]) =>                       ({                         bullet: "炮弹追击",                         featherDodge: "羽毛闪避",                         star: "无敌星",                         mega: "巨大蘑菇",                         boo: "幽灵保护",                         ice: "冻结",                         power: "强力蘑菇",                         feather: "羽毛",                       })[k === "type" ? v : k] ／／                       (k === "iceLock" ? "冻结" : k),                   );               if (g.booShield > 0 ／／ g.booRoundsLeftV218 > 0)                 states.push("幽灵保护");               return <button class="ui-group-card" data-group="${Number(g.id)}" style="--group-color:${/^#[a-f\d]{3,8}$/i.test(g.color) ? g.color : "#0f766e"}" aria-label="查看${E(g.name)}的小组详情"><span class="ui-chip">第 ${E(g.groupNo ／／ groups.indexOf(g) + 1)} 组</span><span class="ui-muted" style="float:right">排名 ${mask ? "—" : sorted.findIndex((x) => x.id === g.id) + 1}</span><span class="ui-group-title">${E(g.name)}</span><span class="ui-group-score">${mask ? "???" : E(g.score)}</span><span class="ui-muted"> 分</span><footer>${item ? itemVisual(item.key) : icon("gift")}<span>${E(item ? ITEM_DEFS[item.key]?.name ／／ "未知道具" : "暂无主要道具")}</span></footer>${states.length ? <div class="ui-muted">${E(states.join(" · "))}</div> : ""}</button>;             })             .join, groups             .map, Object.entries(g.itemEffect ／／ {})                   .filter(                     ([k, v]) =>                       (k === "type" && !!v) ／／                       (["iceLock", "featherDodge"].includes(k) &&                         Number(v) > 0),                   )                   .map, Object.entries(g.itemEffect ／／ {})                   .filter, Object.entries, ["iceLock", "featherDodge"].includes, states.push, /^#[a-f\d]{3,8}$/i.test, E, groups.indexOf, sorted.findIndex, itemVisual, icon, states.join, empty, track         .querySelectorAll("[data-group]")         .forEach, track         .querySelectorAll, openItemWindow, requestAnimationFrame, renderDaily, window.WelcomeV2.render|
|src/ui/desktop.js:292|el.onclick|assignment|需要进一步测试|openItemWindow, Number|
|src/ui/desktop.js:301|updateArrows|declaration|需要进一步测试|$, t.classList.toggle|
|src/ui/desktop.js:311|observeVisualState|declaration|需要进一步测试|JSON.stringify, visualSnapshot.get, visualEvent, g.inventory.at, next.set|
|src/ui/desktop.js:353|renderDaily|declaration|需要进一步测试|$, getSettlementHistory, M.dayIndex, JSON.stringify, history.map, Object.keys, M.daily, bank.knowledge.filter, bank.challenges.filter, [       M.dayIndex(),       preferences.subject,       dailyOffsets.challenges,       quiz?.id,     ].join, E, itemVisual, quiz.options.map((o, i) => <button data-quiz-answer="${i}" aria-pressed="false">${"ABCD"[i]} · ${E(o)}</button>).join, quiz.options.map, host.querySelectorAll, host.querySelector, renderDaily, host.querySelectorAll("[data-quiz-answer]").forEach, b.parentElement             .querySelectorAll("button")             .forEach, b.parentElement             .querySelectorAll, x.setAttribute, String, Number, host         .querySelector([data-quiz-answer="${quizAttempt.answer}"])         ?.onclick, host         .querySelector|
|src/ui/desktop.js:412|next.onclick|assignment|需要进一步测试|renderDaily|
|src/ui/desktop.js:419|b.onclick|assignment|需要进一步测试|b.parentElement             .querySelectorAll("button")             .forEach, b.parentElement             .querySelectorAll, x.setAttribute, String, Number, host.querySelector|
|src/ui/desktop.js:442|historyKind|declaration|需要进一步测试|/清零／恢复／撤销／回溯／删除/.test, /道具／攻击／龟壳／蘑菇/.test, /题／回合／答题／结算/.test, /成员／小组／名单/.test|
|src/ui/desktop.js:453|inventory|declaration|需要进一步测试|items         .map((i) => ${ITEM_DEFS[i.key]?.name ／／ i.key} ×${i.charges ?? 1})         .join, items         .map|
|src/ui/desktop.js:460|renderHistory|declaration|需要进一步测试|$, empty, historyStack       .map((h, i) => {         const next = historyStack[i + 1] ／／ state,           diffs = M.differences(h, next),           [kind, glyph, label] = historyKind(h.desc),           changed = diffs.filter(             (d) =>               d.delta ／／               d.added ／／               d.removed ／／               JSON.stringify(d.inventoryBefore) !==                 JSON.stringify(d.inventoryAfter) ／／               JSON.stringify(d.effectsBefore) !==                 JSON.stringify(d.effectsAfter),           );         return <article class="ui-panel ui-history" data-kind="${kind}" style="--record-index:'${String(i + 1).padStart(2, "0")}'"><details><summary><div><span class="ui-chip">${icon(glyph)} ${label}</span><h3>${E(h.desc ／／ "未命名操作")}</h3><span class="ui-muted">${E(h.time ／／ "未记录时间")} · ${E(changed.map((g) => g.name).join("、") ／／ "未发现可比较的小组变动")}</span></div><span class="ui-chip">${i === historyStack.length - 1 ? "最近操作前快照" : "查看快照"} ${icon("arrow")}</span></summary><div class="ui-snapshot-note">以下比较：此操作前快照 → ${i === historyStack.length - 1 ? "当前状态" : "下一条操作前快照"}。${i === historyStack.length - 1 ? "当前状态可能包含尚未记录的变化。" : "两次快照之间可能含未单独记录的操作。"}历史未保存的字段无法推断。</div><div class="ui-table-wrap"><table class="ui-table"><thead><tr><th>小组</th><th>积分变化</th><th>名次</th><th>道具队列</th><th>持续状态</th></tr></thead><tbody>${diffs.map((d) => <tr><td>${E(d.name)}${d.added ? "（新增）" : d.removed ? "（移除）" : ""}</td><td>${d.before ?? "—"} → ${d.after ?? "—"} <strong class="${d.delta > 0 ? "ui-positive" : d.delta < 0 ? "ui-negative" : ""}">${d.delta === null ? "" : (${d.delta > 0 ? "+" : ""}${d.delta})}</strong></td><td>${d.rankBefore ?? "—"} → ${d.rankAfter ?? "—"}</td><td>${E(inventory(d.inventoryBefore))} → ${E(inventory(d.inventoryAfter))}</td><td>${E(JSON.stringify(d.effectsBefore))} → ${E(JSON.stringify(d.effectsAfter))}</td></tr>).join("")}</tbody></table></div><p class="ui-muted">答题状态：${h.roundActive ? "答题中" : "未答题"} → ${next.roundActive ? "答题中" : "未答题"}；已结算：${h.evaluated ? "是" : "否"} → ${next.evaluated ? "是" : "否"}。名次按快照积分顺序展示，不改变比赛排序。</p><button class="btn btn-danger" data-restore="${i}">恢复此操作前的状态</button></details></article>;       })       .reverse()       .join, historyStack       .map((h, i) => {         const next = historyStack[i + 1] ／／ state,           diffs = M.differences(h, next),           [kind, glyph, label] = historyKind(h.desc),           changed = diffs.filter(             (d) =>               d.delta ／／               d.added ／／               d.removed ／／               JSON.stringify(d.inventoryBefore) !==                 JSON.stringify(d.inventoryAfter) ／／               JSON.stringify(d.effectsBefore) !==                 JSON.stringify(d.effectsAfter),           );         return <article class="ui-panel ui-history" data-kind="${kind}" style="--record-index:'${String(i + 1).padStart(2, "0")}'"><details><summary><div><span class="ui-chip">${icon(glyph)} ${label}</span><h3>${E(h.desc ／／ "未命名操作")}</h3><span class="ui-muted">${E(h.time ／／ "未记录时间")} · ${E(changed.map((g) => g.name).join("、") ／／ "未发现可比较的小组变动")}</span></div><span class="ui-chip">${i === historyStack.length - 1 ? "最近操作前快照" : "查看快照"} ${icon("arrow")}</span></summary><div class="ui-snapshot-note">以下比较：此操作前快照 → ${i === historyStack.length - 1 ? "当前状态" : "下一条操作前快照"}。${i === historyStack.length - 1 ? "当前状态可能包含尚未记录的变化。" : "两次快照之间可能含未单独记录的操作。"}历史未保存的字段无法推断。</div><div class="ui-table-wrap"><table class="ui-table"><thead><tr><th>小组</th><th>积分变化</th><th>名次</th><th>道具队列</th><th>持续状态</th></tr></thead><tbody>${diffs.map((d) => <tr><td>${E(d.name)}${d.added ? "（新增）" : d.removed ? "（移除）" : ""}</td><td>${d.before ?? "—"} → ${d.after ?? "—"} <strong class="${d.delta > 0 ? "ui-positive" : d.delta < 0 ? "ui-negative" : ""}">${d.delta === null ? "" : (${d.delta > 0 ? "+" : ""}${d.delta})}</strong></td><td>${d.rankBefore ?? "—"} → ${d.rankAfter ?? "—"}</td><td>${E(inventory(d.inventoryBefore))} → ${E(inventory(d.inventoryAfter))}</td><td>${E(JSON.stringify(d.effectsBefore))} → ${E(JSON.stringify(d.effectsAfter))}</td></tr>).join("")}</tbody></table></div><p class="ui-muted">答题状态：${h.roundActive ? "答题中" : "未答题"} → ${next.roundActive ? "答题中" : "未答题"}；已结算：${h.evaluated ? "是" : "否"} → ${next.evaluated ? "是" : "否"}。名次按快照积分顺序展示，不改变比赛排序。</p><button class="btn btn-danger" data-restore="${i}">恢复此操作前的状态</button></details></article>;       })       .reverse, historyStack       .map, M.differences, historyKind, diffs.filter, JSON.stringify, String(i + 1).padStart, String, icon, E, changed.map((g) => g.name).join, changed.map, diffs.map((d) => <tr><td>${E(d.name)}${d.added ? "（新增）" : d.removed ? "（移除）" : ""}</td><td>${d.before ?? "—"} → ${d.after ?? "—"} <strong class="${d.delta > 0 ? "ui-positive" : d.delta < 0 ? "ui-negative" : ""}">${d.delta === null ? "" : (${d.delta > 0 ? "+" : ""}${d.delta})}</strong></td><td>${d.rankBefore ?? "—"} → ${d.rankAfter ?? "—"}</td><td>${E(inventory(d.inventoryBefore))} → ${E(inventory(d.inventoryAfter))}</td><td>${E(JSON.stringify(d.effectsBefore))} → ${E(JSON.stringify(d.effectsAfter))}</td></tr>).join, diffs.map, inventory, host.querySelectorAll(".ui-history:nth-child(-n+8)").forEach, host.querySelectorAll, animate, host.querySelectorAll("[data-restore]").forEach, Number, themeConfirm, revertToHistory|
|src/ui/desktop.js:513|b.onclick|assignment|需要进一步测试|Number, themeConfirm, revertToHistory|
|src/ui/desktop.js:529|renderArchives|declaration|需要进一步测试|getSettlementHistory, records       .flatMap((x) => (Array.isArray(x.groups) ? x.groups : []))       .filter, records       .flatMap, Array.isArray, g.score.trim, Number.isFinite, Number, Math.max, all.map, $, [       ["已归档届数", records.length],       [         "最近冠军",         records[0]?.champion ／／ records[0]?.groups?.[0]?.name ／／ "暂无",       ],       ["历史最高积分", best ?? "暂无"],       ["最近归档", records[0]?.time ／／ "暂无"],     ]       .map(         ([t, v]) =>           <div class="ui-panel"><span class="ui-muted">${t}</span><strong>${E(v)}</strong></div>,       )       .join, [       ["已归档届数", records.length],       [         "最近冠军",         records[0]?.champion ／／ records[0]?.groups?.[0]?.name ／／ "暂无",       ],       ["历史最高积分", best ?? "暂无"],       ["最近归档", records[0]?.time ／／ "暂无"],     ]       .map, E, records       .map((r, index) => ({ r, index }))       .filter, records       .map, [r.title, r.champion, ...(r.groups ／／ []).map((g) => g.name)]           .join(" ")           .toLowerCase()           .includes, [r.title, r.champion, ...(r.groups ／／ []).map((g) => g.name)]           .join(" ")           .toLowerCase, [r.title, r.champion, ...(r.groups ／／ []).map((g) => g.name)]           .join, (r.groups ／／ []).map, archiveSearch.toLowerCase, list.reverse, list.sort, list           .map(({ r, index }) => {             const groups = Array.isArray(r.groups) ? r.groups : [];             return <article class="ui-panel ui-archive-card"><details><summary class="ui-archive-summary"><span class="ui-archive-emblem" aria-hidden="true">${icon("archive")}</span><div><span class="ui-eyebrow">CLASSROOM ARCHIVE · ${E(r.time ／／ "时间未记录")}</span><h3>${E(r.title ／／ "未命名比赛")}</h3><span class="ui-muted">${groups.length} 个归档小组 · 冠军 ${E(r.champion ／／ groups[0]?.name ／／ "未记录")}</span></div><span class="ui-chip">查看完整档案 ${icon("arrow")}</span></summary><div class="ui-podium">${groups               .slice(0, 3)               .map(                 (g, i) =>                   <div><span class="ui-chip">第 ${i + 1} 名${i === 0 ? " · 冠军" : ""}</span><strong>${E(g.name ／／ "未记录名称")}</strong><span>${E(g.score ?? "未记录")} 分</span></div>,               )               .join(                 "",               )}</div><div class="ui-table-wrap"><table class="ui-table"><thead><tr><th>原档案名次</th><th>小组</th><th>最终积分</th><th>成员</th><th>道具与答题统计</th></tr></thead><tbody>${groups.map((g, i) => <tr><td>${i + 1}</td><td>${E(g.name ／／ "未记录")}</td><td>${E(g.score ?? "未记录")}</td><td>${E((g.members ／／ []).join("、") ／／ "未记录")}</td><td>${E(g.itemStats ? JSON.stringify(g.itemStats) : "此版本未提供统计")}</td></tr>).join("")}</tbody></table></div><p class="ui-muted">名次沿用归档顺序；同分保留原始次序。缺少的旧档案字段不作推测。</p><details><summary>完整原始归档数据</summary><pre style="white-space:pre-wrap;overflow-wrap:anywhere;max-height:300px;overflow:auto">${E(JSON.stringify(r, null, 2))}</pre></details><div class="ui-archive-actions"><button class="btn btn-primary" data-csv="${index}">导出完整 CSV</button><button class="btn" data-json="${index}">导出原始 JSON</button><button class="btn btn-danger" data-delete="${index}">删除档案</button></div></details></article>;           })           .join, list           .map, icon, groups               .slice(0, 3)               .map(                 (g, i) =>                   <div><span class="ui-chip">第 ${i + 1} 名${i === 0 ? " · 冠军" : ""}</span><strong>${E(g.name ／／ "未记录名称")}</strong><span>${E(g.score ?? "未记录")} 分</span></div>,               )               .join, groups               .slice(0, 3)               .map, groups               .slice, groups.map((g, i) => <tr><td>${i + 1}</td><td>${E(g.name ／／ "未记录")}</td><td>${E(g.score ?? "未记录")}</td><td>${E((g.members ／／ []).join("、") ／／ "未记录")}</td><td>${E(g.itemStats ? JSON.stringify(g.itemStats) : "此版本未提供统计")}</td></tr>).join, groups.map, (g.members ／／ []).join, JSON.stringify, empty, host           .querySelectorAll(".ui-archive-card:nth-child(-n+8),.ui-empty")           .forEach, host           .querySelectorAll, animate, host       .querySelectorAll("[data-csv]")       .forEach, host       .querySelectorAll, exportSingleSettlementCSV, host       .querySelectorAll("[data-delete]")       .forEach, deleteSettlementRecord, host       .querySelectorAll("[data-json]")       .forEach, downloadJson|
|src/ui/desktop.js:622|b.onclick|assignment|需要进一步测试|exportSingleSettlementCSV, Number|
|src/ui/desktop.js:628|b.onclick|assignment|需要进一步测试|deleteSettlementRecord, Number|
|src/ui/desktop.js:634|b.onclick|assignment|需要进一步测试|downloadJson, Number|
|src/ui/desktop.js:638|downloadJson|declaration|需要进一步测试|URL.createObjectURL, JSON.stringify, document.createElement, a.click, setTimeout, URL.revokeObjectURL|
|src/ui/desktop.js:669|setupSettings|declaration|需要进一步测试|$, document.createElement, categories.map(([id, glyph, title]) => <button data-category="${id}">${icon(glyph)}${title}</button>).join, categories.map, icon, categories.map(([id, , title, desc]) => <section class="ui-settings-category" data-category-panel="${id}" hidden><header class="ui-settings-title"><h3>${title}</h3><div class="ui-muted">${desc}</div></header></section>).join, Object.fromEntries, [...shell.querySelectorAll("[data-category-panel]")].map, shell.querySelectorAll, installCommunismModeSetting, installSfxVolumeSliderV2176, installClearItemsSettingV2172, sc.querySelectorAll, pane.id.replace, (sections[id === "function" ? "rules" : id] ／／ sections.rules).append, pane.classList.add, sections[el.dataset.settingsCategory].append, sections.appearance.append, $("#settingsV26Tabs")?.remove, sc.append, sc.classList.add, shell       .querySelectorAll("[data-category]")       .forEach, shell       .querySelectorAll, selectSettings, sections.appearance.insertAdjacentHTML, sections.motion.insertAdjacentHTML, row, check, sections.welcome.insertAdjacentHTML, [         ["knowledge", "每日知识卡片"],         ["itemTip", "每日道具小知识"],         ["honors", "历史荣誉"],         ["challenge", "每日课堂挑战"],         ["groupCruise", "小组卡片连续巡航（默认开启）"],       ]         .map(([key, label]) => row(label, "uiPref-" + key, check(key)))         .join, [         ["knowledge", "每日知识卡片"],         ["itemTip", "每日道具小知识"],         ["honors", "历史荣誉"],         ["challenge", "每日课堂挑战"],         ["groupCruise", "小组卡片连续巡航（默认开启）"],       ]         .map, sections.data       .querySelector(".ui-settings-title")       .insertAdjacentHTML, sections.data       .querySelector, [...sections.data.querySelectorAll("button")].filter, sections.data.querySelectorAll, /resetAllScores／clear/.test, b.getAttribute, b.classList.remove, b.classList.add, String, refreshSubjects, JSON.stringify, shell.querySelectorAll("[data-pref]").forEach, Number, persistPreferences, applyPreferences, renderDaily, downloadJson, saveContentBank, JSON.parse, themeConfirm, localStorage.removeItem, renderBankEditor, organizeSettings, ClassroomRosterWorkspace.mount, sections.students.insertBefore, TeachingWorkspace.mount, TeachingResourceWorkspace.mount, GodpowerTheme.mount, bankBody.prepend|
|src/ui/desktop.js:704|b.onclick|assignment|需要进一步测试|selectSettings|
|src/ui/desktop.js:709|row|declaration|需要进一步测试||
|src/ui/desktop.js:712|check|binding|需要进一步测试||
|src/ui/desktop.js:772|el.onchange|assignment|需要进一步测试|Number, persistPreferences, applyPreferences, renderDaily|
|src/ui/desktop.js:786|$("#uiExportBank").onclick|assignment|需要进一步测试|downloadJson|
|src/ui/desktop.js:788|$("#uiSaveBank").onclick|assignment|需要进一步测试|saveContentBank, JSON.parse, $|
|src/ui/desktop.js:797|$("#uiResetBank").onclick|assignment|需要进一步测试|themeConfirm, localStorage.removeItem, renderBankEditor, $, JSON.stringify, refreshSubjects, renderDaily|
|src/ui/desktop.js:848|saveContentBank|declaration|需要进一步测试|M.validateBank, localStorage.setItem, JSON.stringify, $, refreshSubjects, renderDaily, renderBankEditor|
|src/ui/desktop.js:859|renderBankEditor|declaration|需要进一步测试|$, ["knowledge", "challenges"].map((kind) => <section><h4>${kind === "knowledge" ? "知识卡片" : "课堂挑战"}</h4>${bank[kind].length ? bank[kind].map((row, index) => <div class="ui-settings-row"><div><b>${E(row.title)}</b><p class="ui-muted">${E(row.subject)} · ${E(row.id)}</p></div><div class="ui-toolbar"><button class="btn btn-sm" data-bank-edit="${kind}" data-index="${index}">编辑</button><button class="btn btn-sm btn-danger" data-bank-delete="${kind}" data-index="${index}">删除</button></div></div>).join("") : '<p class="ui-muted">暂无内容，点击上方按钮添加。</p>'}</section>).join, ["knowledge", "challenges"].map, bank[kind].map((row, index) => <div class="ui-settings-row"><div><b>${E(row.title)}</b><p class="ui-muted">${E(row.subject)} · ${E(row.id)}</p></div><div class="ui-toolbar"><button class="btn btn-sm" data-bank-edit="${kind}" data-index="${index}">编辑</button><button class="btn btn-sm btn-danger" data-bank-delete="${kind}" data-index="${index}">删除</button></div></div>).join, bank[kind].map, E, host       .querySelectorAll("[data-bank-add]")       .forEach, host       .querySelectorAll, editBankRow, host       .querySelectorAll("[data-bank-edit]")       .forEach, Number, host.querySelectorAll("[data-bank-delete]").forEach, host.querySelectorAll, themeConfirm, JSON.parse, JSON.stringify, next[kind].filter, saveContentBank, Error, file.text|
|src/ui/desktop.js:867|button.onclick|assignment|需要进一步测试|editBankRow|
|src/ui/desktop.js:873|button.onclick|assignment|需要进一步测试|editBankRow, Number|
|src/ui/desktop.js:878|button.onclick|assignment|需要进一步测试|Number, themeConfirm, JSON.parse, JSON.stringify, next[kind].filter, saveContentBank, $|
|src/ui/desktop.js:900|$("#uiBankFile").onchange|assignment|需要进一步测试|Error, saveContentBank, JSON.parse, file.text, $|
|src/ui/desktop.js:914|editBankRow|declaration|需要进一步测试|$, fields.map(([key, label]) => <label class="ui-settings-row" for="uiBankField-${key}"><span>${label}</span><textarea class="ui-bank-field" style="width:65%;min-height:44px;resize:vertical" id="uiBankField-${key}" name="${key}" maxlength="10000" ${["id", "subject", "title", "source"].includes(key) ? "required" : ""}>${E(row[key] ／／ "")}</textarea></label>).join, fields.map, ["id", "subject", "title", "source"].includes, E, row.options.map((value, i) => <label class="ui-settings-row" for="uiBankOption-${i}"><span>选项 ${"ABCD"[i]}</span><input id="uiBankOption-${i}" name="option${i}" value="${E(value)}" maxlength="10000" required></label>).join, row.options.map, [0, 1, 2, 3].map((i) => <option value="${i}" ${row.answer === i ? "selected" : ""}>${"ABCD"[i]}</option>).join, [0, 1, 2, 3].map, host.replaceChildren, event.preventDefault, fields.forEach, String(data.get(key)).trim, String, data.get, String(data.get("option" + i)).trim, Number, JSON.parse, JSON.stringify, next[kind].push, saveContentBank, $("#uiBankField-title").focus|
|src/ui/desktop.js:947|$("#uiBankCancel").onclick|assignment|需要进一步测试|host.replaceChildren|
|src/ui/desktop.js:948|$("#uiBankRowForm").onsubmit|assignment|需要进一步测试|event.preventDefault, fields.forEach, String(data.get(key)).trim, String, data.get, [0, 1, 2, 3].map, String(data.get("option" + i)).trim, Number, JSON.parse, JSON.stringify, next[kind].push, saveContentBank, $|
|src/ui/desktop.js:971|organizeSettings|declaration|需要进一步测试|document.createElement, box.classList.add, E, nodes.filter(Boolean).forEach, nodes.filter, body.append, parent.append, shell.querySelectorAll, group, $, marked, $("#uiSettingsWallpaper .setting-section-title")?.remove, rosterTitle?.remove, sound.append, document.addEventListener, event.target.closest, button?.getAttribute, event.preventDefault, event.stopImmediatePropagation, openPwdModal, themeConfirm, confirm[2]|
|src/ui/desktop.js:972|group|declaration|需要进一步测试|document.createElement, box.classList.add, E, nodes.filter(Boolean).forEach, nodes.filter, body.append, parent.append|
|src/ui/desktop.js:995|marked|binding|需要进一步测试|shell.querySelectorAll|
|src/ui/desktop.js:1152|refreshSubjects|declaration|需要进一步测试|$, bank.knowledge.map, bank.challenges.map, subjects       .map(         (s) =>           <option value="${E(s)}">${E({ politics: "政治", history: "历史", geography: "地理", english: "英语" }[s] ／／ s)}</option>,       )       .join, subjects       .map, E, subjects.includes|
|src/ui/desktop.js:1172|cancelSettingsMotion|declaration|需要进一步测试|animation.cancel, animations.delete, settingsAnimations.clear|
|src/ui/desktop.js:1179|revealSettings|declaration|需要进一步测试|cancelSettingsMotion, canAnimate, $, [...panel.children]       .flatMap((node) =>         node.matches(".settings-v26-pane") ? [...node.children] : [node],       )       .filter, [...panel.children]       .flatMap, node.matches, targets.forEach, animate, Math.min, settingsAnimations.add, animation.finished.then, settingsAnimations.delete|
|src/ui/desktop.js:1220|selectSettings|declaration|需要进一步测试|$, switchView, categories.some, document       .querySelectorAll("[data-category-panel]")       .forEach, document       .querySelectorAll, document       .querySelectorAll(".ui-settings-nav button")       .forEach, b.setAttribute, String, renderBgmSlotList, renderFxSlotList, renderItemFxSoundListV26, TeachingWorkspace.refresh, TeachingResourceWorkspace.refresh, revealSettings|
|src/ui/desktop.js:1254|setupDock|declaration|需要进一步测试|$, document.createElement, b.getAttribute, /globalItemDraw／openHandRaise／openPickerModal／undoLast/.test, /globalItemDraw/.test, /openHandRaise/.test, /openPickerModal/.test, /undoLast/.test, UI_ICON_TARGETS.find, b.matches, b.setAttribute, icon, E, /zoom/.test, /Lock/.test, /addGroup／Search/.test, menu.append, right.append, final.setAttribute, document.addEventListener, e.target.closest, e.preventDefault, e.stopImmediatePropagation|
|src/ui/desktop.js:1322|refreshLockControl|declaration|需要进一步测试|icon, Reliability.safeImage, uiIconsV26, button.setAttribute|
|src/ui/desktop.js:1334|settleDisclosure|declaration|需要进一步测试|disclosureMotions.get, disclosureMotions.delete, entry.animation?.cancel|
|src/ui/desktop.js:1342|settleDisclosures|declaration|需要进一步测试|disclosureMotions.keys, settleDisclosure|
|src/ui/desktop.js:1345|setupDisclosures|declaration|需要进一步测试|document.addEventListener, event.target.closest, details.classList.contains, canAnimate, event.preventDefault, disclosureMotions.get, details.getBoundingClientRect, settleDisclosure, disclosureMotions.set, animate, entry.animation.finished.then, finish|
|src/ui/desktop.js:1381|finish|binding|需要进一步测试|disclosureMotions.get, settleDisclosure|
|src/ui/desktop.js:1407|finishWindowClose|declaration|需要进一步测试|closingWindows.get, closingWindows.delete, pending.animation?.cancel, pending.backdrop?.cancel, pending.finish|
|src/ui/desktop.js:1417|cancelWindowClose|declaration|需要进一步测试|closingWindows.get, closingWindows.delete, pending.animation?.cancel, pending.backdrop?.cancel|
|src/ui/desktop.js:1426|dismissWindow|declaration|需要进一步测试|closingWindows.has, root.querySelector, root.getClientRects, canAnimate, finish, getComputedStyle, surface.getAnimations().forEach, surface.getAnimations, a.cancel, closingWindows.set, animate, motionEase, pending.animation.finished       .catch(() => {})       .finally, pending.animation.finished       .catch, closingWindows.get, finishWindowClose|
|src/ui/desktop.js:1495|setupModals|declaration|需要进一步测试|top.el.getClientRects, top.el.contains, [         ...top.el.querySelectorAll(           'input:not([type=hidden]),button,select,textarea,[tabindex="0"]',         ),       ].find, top.el.querySelectorAll, el.getClientRects, target.focus, document.addEventListener, openStack.at, focusModal, known.set, openStack.find, openStack.filter, item.el.style.setProperty, item.el.style.removeProperty, item.focus.focus, item.focus.closest, item?.el?.hasAttribute, cancelAnimations, Object.entries, document.getElementById, known.get, forgetModal, el.hasAttribute, el.classList.contains, el.querySelector, surface.querySelectorAll, /取消／跳过／返回课堂/.test, surface.querySelector, document.createElement, button.setAttribute, surface.append, el.style.getPropertyValue, String, el.style.setProperty, openStack.push, dialog?.setAttribute, dialog.getAttribute, dialog.setAttribute, dialog.querySelector, dialog?.classList.add, Number, getComputedStyle, Math.min, Math.max, dialog.getBoundingClientRect, animate, canAnimate, stopConfetti, el.querySelectorAll(".podium-col").forEach, el.querySelectorAll, queueMicrotask, new MutationObserver(scan).observe, e.preventDefault, e.stopImmediatePropagation, top.close, [             ...top.el.querySelectorAll(               'button,input,select,textarea,a[href],[tabindex="0"]',             ),           ].filter, x.getClientRects, nodes.at, last.focus, first.focus, scan|
|src/ui/desktop.js:1497|focusModal|declaration|需要进一步测试|top.el.getClientRects, top.el.contains, [         ...top.el.querySelectorAll(           'input:not([type=hidden]),button,select,textarea,[tabindex="0"]',         ),       ].find, top.el.querySelectorAll, el.getClientRects, target.focus|
|src/ui/desktop.js:1518|forgetModal|declaration|需要进一步测试|known.set, openStack.find, openStack.filter, item.el.style.setProperty, item.el.style.removeProperty, openStack.at, top.el.contains, item.focus.focus, focusModal, item.focus.closest, item?.el?.hasAttribute, cancelAnimations|
|src/ui/desktop.js:1541|scan|declaration|需要进一步测试|Object.entries, document.getElementById, known.get, openStack.find, forgetModal, el.hasAttribute, el.classList.contains, el.getClientRects, el.querySelector, surface.querySelectorAll, /取消／跳过／返回课堂/.test, surface.querySelector, document.createElement, button.setAttribute, surface.append, known.set, el.style.getPropertyValue, String, el.style.setProperty, openStack.push, dialog?.setAttribute, dialog.getAttribute, dialog.setAttribute, dialog.querySelector, dialog?.classList.add, Number, getComputedStyle, Math.min, Math.max, dialog.getBoundingClientRect, animate, canAnimate, stopConfetti, el.querySelectorAll(".podium-col").forEach, el.querySelectorAll, queueMicrotask, openStack.at, focusModal|
|src/ui/desktop.js:1718|clearPickerReveal|declaration|需要进一步测试|$("#pickerModal")?.removeAttribute, $, pickerReelRestores.splice, restore|
|src/ui/desktop.js:1723|cancelPickerPreparation|declaration|需要进一步测试|clearPickerReveal, ClassroomFeedback.clearLive, ClassroomFeedback.cancel, BattleMotion.clear, $, button.removeAttribute, modal?.contains, a.cancel|
|src/ui/desktop.js:1740|isPickerCurrent|declaration|需要进一步测试|$("#pickerModal").classList.contains, $|
|src/ui/desktop.js:1746|togglePicker|declaration|需要进一步测试|stopSlotSpin, $, button.setAttribute, toggleSlotSpin, showToast, button.removeAttribute|
|src/ui/desktop.js:1773|pickerStopped|declaration|需要进一步测试|$, modal.classList.contains, clearPickerReveal, isPickerCurrent, button.removeAttribute, pickerChanged, window.GodpowerPicker?.notify, ClassroomFeedback.picked, canAnimate, ClassroomFeedback.clearLive, complete, button.setAttribute, modal.querySelectorAll(".slot-reel-frame").forEach, modal.querySelectorAll, frame.getClientRects, frame.querySelector, ClassroomFeedback.takeLive, state.groups.map, state.groups.flatMap, (g.members ／／ []).map, document.createElement, strip.setAttribute, Math.max, row.append, node.cloneNode, studentLabelHTMLV218, strip.append, pendingActual.push, frame.append, pickerReelRestores.push, strip.remove, animate, pending.push, a.finished.catch, pendingActual.forEach, Promise.all(pending).then, Promise.all|
|src/ui/desktop.js:1782|complete|binding|需要进一步测试|isPickerCurrent, clearPickerReveal, button.removeAttribute, pickerChanged, window.GodpowerPicker?.notify, ClassroomFeedback.picked|
|src/ui/desktop.js:1871|pickerChanged|declaration|需要进一步测试|pickerTargetGroup, state.groups.some, document       .querySelectorAll('#pickerModal button[onclick^="scorePicker"]')       .forEach, document       .querySelectorAll, animate, $|
|src/ui/desktop.js:1891|setupPicker|declaration|需要进一步测试|$, left.append, right.append, stats.removeAttribute, new MutationObserver(pickerChanged).observe, pickerChanged|
|src/ui/desktop.js:1914|prepareSettlement|declaration|需要进一步测试|$|
|src/ui/desktop.js:1919|cancelSettlement|declaration|需要进一步测试||
|src/ui/desktop.js:1922|settleFromUI|declaration|需要进一步测试|button.setAttribute, $, requestAnimationFrame, $("#settlementNameModal").classList.contains, confirmFinalSettlement, button.removeAttribute|
|src/ui/desktop.js:1957|init|declaration|需要进一步测试|JSON.parse, localStorage.getItem, Object.keys, ["full", "simple", "off"].includes, [0.75, 1, 1.5].includes, M.validateBank, console.warn, applyPreferences, syncViewport, window.addEventListener, matchMedia("(prefers-reduced-motion: reduce)").addEventListener, matchMedia, canAnimate, cancelAnimations, document.addEventListener, cancelSettingsMotion, document.querySelectorAll(".nav-tab").forEach, document.querySelectorAll, icon, b.setAttribute, setupDock, UI_ICON_TARGETS.forEach, $, applyUiIconsV26, setupSettings, setupPicker, setupModals, ClassroomFeedback.init, setupDisclosures, $("#settlementHistoryContainer").addEventListener, details.contains, a.cancel, details.querySelectorAll(".ui-podium>div").forEach, details.querySelectorAll, animate, t.addEventListener, Math.abs, Math.max, Math.min, e.preventDefault, t.scrollBy, new ResizeObserver(updateArrows).observe, renderArchives, viewChanged, renderWelcome, renderHistory, document         .querySelectorAll(           ".ui-welcome-head,.ui-group-card,.ui-daily-grid .ui-panel",         )         .forEach, document         .querySelectorAll|
|src/ui/desktop.js:2059|$("#uiGroupPrev").onclick|assignment|需要进一步测试|t.scrollBy, canAnimate|
|src/ui/desktop.js:2061|$("#uiGroupNext").onclick|assignment|需要进一步测试|t.scrollBy, canAnimate|
|src/ui/desktop.js:2064|$("#uiArchiveSearch").oninput|assignment|需要进一步测试|renderArchives|
|src/ui/desktop.js:2068|$("#uiArchiveSort").onchange|assignment|需要进一步测试|renderArchives|
|src/ui/desktop.js:2101|$("#uiSkipWelcome").onclick|assignment|需要进一步测试|cancelAnimations|
|src/ui/model.js:60|dayIndex|declaration|需要进一步测试|Math.floor, Date.UTC, d.getFullYear, d.getMonth, d.getDate|
|src/ui/model.js:65|daily|declaration|需要进一步测试|dayIndex|
|src/ui/model.js:73|differences|declaration|需要进一步测试|(before.groups ／／ []).map, (after.groups ／／ []).map, [...groups]           .sort((x, y) => Number(y.score) - Number(x.score))           .map, [...groups]           .sort, Number, rank, [...new Set([...a.keys(), ...b.keys()])].map, a.keys, b.keys, a.get, b.get, ra.get, rb.get|
|src/ui/model.js:76|rank|binding|需要进一步测试|[...groups]           .sort((x, y) => Number(y.score) - Number(x.score))           .map, [...groups]           .sort, Number|
|src/ui/model.js:112|validateBank|declaration|需要进一步测试|Array.isArray, Error, row.id.trim, row.title.trim, row.subject.trim, row.source.trim, ids.has, ids.add, Object.values(row).some, Object.values, q.options.some, x.trim, Number.isInteger|
|src/ui/model.js:163|standings|declaration|需要进一步测试|ordered.map, Number, scores.every, scores.reduce((sum, value) => sum + BigInt(value), 0n).toString, scores.reduce, BigInt, String|
|src/ui/model.js:176|badgeColors|declaration|需要进一步测试|String(color ／／ "").replace, String, raw         .split("")         .map((v) => v + v)         .join, raw         .split("")         .map, raw         .split, /^[a-f0-9]{6}$/i.test, raw.match(/../g).map, raw.match, parseInt, values         .map((v) => v / 255)         .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))         .reduce, values         .map((v) => v / 255)         .map, values         .map, Math.max, Math.min, luminance, shade.map, Math.floor, shade.map((v) => v.toString(16).padStart(2, "0")).join, v.toString(16).padStart, v.toString|
|src/ui/model.js:186|luminance|binding|需要进一步测试|values         .map((v) => v / 255)         .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))         .reduce, values         .map((v) => v / 255)         .map, values         .map|
|src/core/action-sounds.js:34|isClick|binding|仍然必要|slots.some|
|src/core/action-sounds.js:35|classify|declaration|仍然必要|isClick, button.getAttribute, button.onclick?.toString, button.textContent.trim, button.matches, /判定／结算/.test, /停止/.test, /^[-−]/.test, /stopSlotSpin／stopPicker/.test, /startSlotSpin／pull.*Lever／toggle.*Slot／pullPickerLever/i.test, /globalItemDraw／drawItem／handDrawItem／DrawForGroup/.test, /useItem／handUseNewItem/.test, /selectGroupOpt／batchSelectOption／setCorrectAns/.test, /AllIn/.test, /startRound/.test, /evaluateRound/.test, /nextRound/.test, /undoLast／restoreHistory/.test, /delete／clear／resetAll／resetScores/i.test, /清空／删除/.test, /triggerUpload／Import／import／chooseItemIcon/.test, /export／Export/.test, /取消/.test, /close／dismiss／finishIntro/.test, /open[A-Z]/.test, /确认／应用／保存／完成/.test, button.closest|
|src/core/history.js:4|copy|binding|仍然必要|JSON.parse, JSON.stringify|
|src/core/history.js:23|recordHistory|declaration|仍然必要|Reliability.invalidateDefenseDecisions, HistorySnapshots.capture, new Date().toLocaleTimeString, historyStack.push, historyStack.shift, persistHistoryV26|
|src/core/history.js:36|persistHistoryV26|declaration|仍然必要|classroomCommands.isPending, STORAGE.setJSON, historyStack.slice, console.warn|
|src/core/history.js:47|restoreStateFromSnapshot|declaration|仍然必要|HistoryCommands.restore|
|src/core/history.js:50|undoLast|declaration|仍然必要|HistoryCommands.undo|
|src/core/item-module-model.js:26|copy|binding|仍然必要|JSON.parse, JSON.stringify|
|src/core/item-module-model.js:27|create|declaration|仍然必要|Object.keys, Object.fromEntries, keys.map, Array.isArray, Error, Object.keys(raw).some, ["schemaVersion", "items"].includes, Object.keys(raw.items).some, keys.includes, defaults, Object.keys(item).some, ["draw", "operation"].includes, Object.keys(d).some, ["enabled", "weight", "charges"].includes, Object.keys(o).some, ["enabled", "scoreMultiplier", "feedback"].includes, Number.isFinite, Number.isInteger, ["mega", "power", "boo"].includes, SCORE_KEYS.has, storage.getItem, validate, JSON.parse, String, storage.setItem, JSON.stringify, notify, copy, forKey, Math.sign, Math.round, Math.abs, Number.isSafeInteger, Object.entries(weights).map, Object.entries, Math.max, Number, Date.now, Math.random, root.StableIdentity?.createItemInstanceId, Date.now().toString, Math.random().toString(36).slice, Math.random().toString, operation|
|src/core/item-module-model.js:29|defaults|binding|仍然必要|Object.fromEntries, keys.map|
|src/core/item-module-model.js:45|validate|declaration|仍然必要|Array.isArray, Error, Object.keys(raw).some, Object.keys, ["schemaVersion", "items"].includes, Object.keys(raw.items).some, keys.includes, defaults, Object.keys(item).some, ["draw", "operation"].includes, Object.keys(d).some, ["enabled", "weight", "charges"].includes, Object.keys(o).some, ["enabled", "scoreMultiplier", "feedback"].includes, Number.isFinite, Number.isInteger, ["mega", "power", "boo"].includes, SCORE_KEYS.has|
|src/core/item-module-model.js:123|forKey|binding|仍然必要||
|src/core/item-module-model.js:124|update|declaration|仍然必要|validate, storage.setItem, JSON.stringify, notify, copy|
|src/core/item-module-model.js:131|scoreDelta|declaration|仍然必要|forKey, Number.isFinite, Error, Math.sign, Math.round, Math.abs, Number.isSafeInteger|
|src/core/item-score.js:2|commitItemScore|declaration|仍然必要|eligibleForItems, tryDefend, Math.round, Number, scheduleScoreEffect, state.groups.includes, playAttackTargetFxV2116|
|src/core/item-score.js:34|applyItemScoreAfterHorn|declaration|仍然必要|Number, eligibleForItems, destroyPrimaryBasicDefenseV2170, ["mushroom", "triple_mushroom"].includes, requestSpinyDefense, commitItemScore, queueItemScoreChangesV21732, String|
|src/core/item-score.js:75|applyItemScore|declaration|仍然必要|ItemModules.scoreDelta, requestSpinyDefense, applyItemScoreAfterHorn|
|src/core/picker-bridge.js:6|notify|declaration|仍然必要|Date.now, getSnapshot, listener, console.error|
|src/core/picker-bridge.js:14|currentResult|declaration|仍然必要|state.groups.find, group.members?.includes, parseStudentV218|
|src/core/picker-bridge.js:26|getSnapshot|declaration|仍然必要|['settling', 'revealed'].includes, currentResult, ClassroomFeedback.getOptions, DesktopUI.getPreferences, matchMedia, window.GodpowerTheme?.get, document.getElementById, state.groups.map, (state.itemGlobal?.pickerHistory ／／ []).slice(-30).map, (state.itemGlobal?.pickerHistory ／／ []).slice|
|src/core/picker-bridge.js:44|cancel|declaration|仍然必要|clearInterval, DesktopUI.cancelPickerPreparation, stopRollLoop, resetSlotDisplay, notify|
|src/core/picker-bridge.js:50|command|declaration|仍然必要|cancel, stopSlotSpin, getSnapshot, notify, document.getElementById('pickerModal').classList.contains, document.getElementById, openPickerModal, DesktopUI.togglePicker, ['individual', 'group', 'two_tier'].includes, setPickerMode, saveState, toggleAntiRepeat, state.groups.some, toggleGroupPreselect, resetPickerPool, currentResult, Number.isSafeInteger, classroomCommands.isPending, applyScoreDelta, syncPickerScoreTarget|
|src/ui/battle-grid.js:2|renderBattleGridCards|declaration|需要进一步测试|document.getElementById, ensureGroupNumbersV213, [     ...grid.querySelectorAll(".group-row-card[data-group-id]"),   ].map, grid.querySelectorAll, String, grid.querySelectorAll(".group-row-card[data-group-id]").forEach, c.getBoundingClientRect, oldRects.set, desiredGroupsV213, ordered.map, oldOrderIds.some, ordered.forEach, document.createElement, rowCard.style.setProperty, GodpowerUIModel.badgeColors, ["A", "B", "C", "D"]       .map((opt) => {         let cls = "opt-btn";         if (g.selectedOpt === opt) cls += " active";         if (state.evaluated && g.selectedOpt === opt) {           cls +=             " flip-reveal " + (opt === state.correctAns ? "correct" : "wrong");         }         return <button class="${cls} ${roundClass}" onclick="selectGroupOpt(${g.id},'${opt}')" ${state.evaluated ? "disabled" : ""}>${opt}</button>;       })       .join, ["A", "B", "C", "D"]       .map, [0, 1, 2]       .map((i) => {         const it = g.inventory?.[i];         return it           ? <div class="item-slot ${i === 0 ? "queue-main-slot" : "queue-secondary-slot"}" title="${escapeHtml(ITEM_DEFS[it.key]?.name ／／ "道具")}">${itemVisual(it.key)}${it.charges > 1 ? <span class="charges">${it.charges}</span> : ""}</div>           : <div class="item-slot ${i === 0 ? "queue-main-slot" : "queue-secondary-slot"} empty">＋</div>;       })       .join, [0, 1, 2]       .map, escapeHtml, itemVisual, groupNoTextV213, currentCardSortLabelV213, grid.appendChild, enhanceItemCards, console.warn, grid.querySelector, card.querySelector, ev.preventDefault, ev.stopPropagation, useItem, showToast, openItemWindow, card.querySelectorAll(".persistent-aura-v213").forEach, card.querySelectorAll, x.remove, card.appendChild, BattleMotion.restore, input.focus, input.select, oldRects.get, card.getBoundingClientRect, Math.abs, card.style.setProperty, moved.push, moved.forEach, requestAnimationFrame, setTimeout, card.style.removeProperty|
|src/ui/battle-grid.js:109|main.onclick|assignment|需要进一步测试|ev.preventDefault, ev.stopPropagation, useItem, showToast|
|src/ui/battle-grid.js:118|more.onclick|assignment|需要进一步测试|ev.preventDefault, ev.stopPropagation, openItemWindow|
|src/ui/battle-grid.js:196|decorateBattleRanks|declaration|需要进一步测试|ranking().map, ranking, document     .querySelectorAll(".group-row-card.v213-card[data-group-id]")     .forEach, document     .querySelectorAll, Number, card.querySelector, wrap.querySelector, document.createElement, wrap.appendChild, ranks.get, currentCardSortLabelV213|
|src/ui/battle-grid.js:216|decorateRoundItemLocks|declaration|需要进一步测试|state.groups.forEach, document.querySelector, card.querySelector, allIn.classList.add, main.classList.add|
|src/ui/battle-motion.js:7|enabled|declaration|需要进一步测试|DesktopUI.getPreferences, matchMedia|
|src/ui/battle-motion.js:18|mount|declaration|需要进一步测试|enabled, document.createElement, node.style.setProperty, itemVisual, escapeHtml, node.append, card.append, DesktopUI.getPreferences, node.animate, Math.max, performance.now|
|src/ui/battle-motion.js:49|show|declaration|需要进一步测试|enabled, String, sessions.get, clearTimeout, document.querySelectorAll(".bm-layer").forEach, document.querySelectorAll, el.getAnimations().forEach, el.getAnimations, a.cancel, el.remove, /fire/.test, /ice/.test, /lightning/.test, /green／red／spiny／shell/.test, /bomb/.test, /boomerang/.test, /banana/.test, /horn/.test, /blooper/.test, /boo/.test, /hammer/.test, /bullet/.test, /star／mega／power／mushroom／feather／coin/.test, performance.now, setTimeout, sessions.delete, sessions.set, mount, document.querySelector, CSS.escape|
|src/ui/battle-motion.js:138|restore|declaration|需要进一步测试|sessions.values, String, performance.now, mount, draws.get, card.classList.add, card.classList.toggle, card.append|
|src/ui/battle-motion.js:152|event|declaration|需要进一步测试|show|
|src/ui/battle-motion.js:160|clear|declaration|需要进一步测试|sessions.values, clearTimeout, sessions.clear, document.querySelectorAll(".bm-layer").forEach, document.querySelectorAll, el.getAnimations().forEach, el.getAnimations, a.cancel, el.remove, draws.values, node.parentElement?.classList.remove, node.remove, draws.clear|
|src/ui/classroom-feedback.js:20|validate|declaration|需要进一步测试|Error, Array.isArray, slots.some, Number.isSafeInteger, ["aurora", "burst"].includes, [1200, 1800, 2600, 3600].includes, Number.isFinite, Math.max, Math.min|
|src/ui/classroom-feedback.js:47|setOptions|declaration|需要进一步测试|validate, localStorage.setItem, JSON.stringify, showToast, refreshSlots, syncSettings, stopClickVoice, cancel, getOptions|
|src/ui/classroom-feedback.js:62|getOptions|declaration|需要进一步测试||
|src/ui/classroom-feedback.js:65|allowed|declaration|需要进一步测试|DesktopUI.getPreferences, matchMedia|
|src/ui/classroom-feedback.js:74|slotMarkup|declaration|需要进一步测试|Number, Error, options.slots.map((n, i) => <button type="button" class="btn ${n > 0 ? "btn-success" : "btn-danger"}" data-score-slot="${i}" onclick="${commands[kind](n)}" ${disabled ? "disabled" : ""}>${n > 0 ? "+" : "−"}${Math.abs(n)}</button>).join, options.slots.map, commands[kind], Math.abs|
|src/ui/classroom-feedback.js:85|refreshSlots|declaration|需要进一步测试|document.querySelectorAll, host.classList.add, document.createElement, slotMarkup, host.replaceChildren, DesktopUI.pickerChanged|
|src/ui/classroom-feedback.js:97|customHand|declaration|需要进一步测试|document.getElementById, Number, input?.value.trim, Number.isSafeInteger, showToast, handQuickScore|
|src/ui/classroom-feedback.js:107|dialog|declaration|需要进一步测试|document.getElementById|
|src/ui/classroom-feedback.js:110|cancel|declaration|需要进一步测试|clearTimeout, dialog, DesktopUI.cancelWindowClose, root.getAnimations({ subtree: true }).forEach, root.getAnimations, a.cancel, root.close, root.classList.remove, root.querySelector(".cf-show-particles")?.replaceChildren, root.querySelector|
|src/ui/classroom-feedback.js:123|dismiss|declaration|需要进一步测试|clearTimeout, dialog, hideClassroomWindow, root.close, root.classList.remove, root.querySelector(".cf-show-particles")?.replaceChildren, root.querySelector|
|src/ui/classroom-feedback.js:135|show|declaration|需要进一步测试|allowed, window.GodpowerPicker?.isExternalPresentation, playSound, cancel, window.godpowerDesktop.showScore, Number, String(value).replace, String, dialog, root.querySelector, DesktopUI.getPreferences, document.createElement, dot.style.setProperty, Math.cos, Math.sin, particles.append, root.classList.toggle, getComputedStyle, root.showModal, document.getElementById, toast?.matches, toast.hidePopover, toast.showPopover, root.classList.add, setTimeout, dismiss|
|src/ui/classroom-feedback.js:207|score|declaration|需要进一步测试|Number.isSafeInteger, show, Math.abs|
|src/ui/classroom-feedback.js:216|picked|declaration|需要进一步测试|window.GodpowerPicker?.isExternalPresentation, parseStudentV218, show|
|src/ui/classroom-feedback.js:230|syncSettings|declaration|需要进一步测试|document.querySelectorAll("[data-cf-slot]").forEach, document.querySelectorAll, document.querySelectorAll("[data-cf-option]").forEach|
|src/ui/classroom-feedback.js:240|settings|declaration|需要进一步测试|document       .querySelector('[data-category-panel="rules"]')       .insertAdjacentHTML, document       .querySelector, options.slots.map((n, i) => <label>槽位 ${i + 1}<input type="number" step="1" data-cf-slot="${i}" aria-label="快捷赋分槽位 ${i + 1}" value="${n}"></label>).join, options.slots.map, document       .querySelector('[data-category-panel="motion"]')       .insertAdjacentHTML, document       .querySelector('[data-category-panel="sound"] > .ui-settings-title')       .insertAdjacentHTML, document.querySelectorAll("[data-cf-slot]").forEach, document.querySelectorAll, e.addEventListener, [...document.querySelectorAll("[data-cf-slot]")].map, x.value.trim, Number, setOptions, document.getElementById, e.removeAttribute, e.setAttribute, document.querySelectorAll("[data-cf-option]").forEach, ["duration", "clickVolume"].includes, cancel, syncSettings|
|src/ui/classroom-feedback.js:294|allowClickSound|declaration|需要进一步测试||
|src/ui/classroom-feedback.js:304|stopClickVoice|declaration|需要进一步测试|clickVoice.source.stop, clickVoice.source.disconnect, clickVoice.gain.disconnect|
|src/ui/classroom-feedback.js:313|ownClickVoice|declaration|需要进一步测试|stopClickVoice, source.disconnect, gain.disconnect|
|src/ui/classroom-feedback.js:317|source.onended|assignment|需要进一步测试|source.disconnect, gain.disconnect|
|src/ui/classroom-feedback.js:323|bindButtonSound|declaration|需要进一步测试|document.addEventListener, e.target.closest, button.closest, stopClickVoice, button.hasAttribute, clearTimeout, setTimeout, playSound, ActionSounds.classify|
|src/ui/classroom-feedback.js:346|init|declaration|需要进一步测试|localStorage.getItem, validate, JSON.parse, console.warn, document.body.insertAdjacentHTML, bindButtonSound, Reliability.onDefenseInvalidation, cancel, BattleMotion.clear, dialog().addEventListener, dialog, e.preventDefault, dismiss, settings, refreshSlots, document.addEventListener, stopClickVoice, clearLive, matchMedia("(prefers-reduced-motion: reduce)").addEventListener, matchMedia, allowed|
|src/ui/classroom-feedback.js:387|candidates|declaration|需要进一步测试|state.groups.filter, pre.includes, groups.map, groups.flatMap, (g.members ／／ []).map|
|src/ui/classroom-feedback.js:401|rowMarkup|declaration|需要进一步测试|escapeHtml, studentLabelHTMLV218|
|src/ui/classroom-feedback.js:406|clearLive|declaration|需要进一步测试|live.animation.cancel, live.strip.remove, liveReels.clear|
|src/ui/classroom-feedback.js:414|startLive|declaration|需要进一步测试|clearLive, allowed, document       .querySelectorAll("#pickerModal .slot-reel-frame")       .forEach, document       .querySelectorAll, frame.getClientRects, candidates, frame.querySelector, document.createElement, strip.setAttribute, rowMarkup, strip.append, frame.append, strip.animate, liveReels.set|
|src/ui/classroom-feedback.js:458|takeLive|declaration|需要进一步测试|liveReels.get, Number, Math.floor|
|src/ui/classroom-recovery.js:5|byId|binding|需要进一步测试|document.getElementById|
|src/ui/classroom-recovery.js:6|setStatus|binding|需要进一步测试|byId|
|src/ui/classroom-recovery.js:10|validCandidate|declaration|需要进一步测试|Reliability.validateBackup, data.groups.reduce, Number|
|src/ui/classroom-recovery.js:27|collect|declaration|需要进一步测试|localStorage.getItem, validCandidate, JSON.parse, found.push, SchemaMigrations.fromLegacyKeys, found.filter, JSON.stringify, seen.has, seen.add|
|src/ui/classroom-recovery.js:73|renderCandidates|declaration|需要进一步测试|byId, host.replaceChildren, candidates.entries, document.createElement, String, button.addEventListener, preview, card.append, host.append|
|src/ui/classroom-recovery.js:92|scan|declaration|需要进一步测试|byId, collect, renderCandidates, setStatus|
|src/ui/classroom-recovery.js:105|preview|declaration|需要进一步测试|Array.isArray, currentGroups.reduce, Number, byId|
|src/ui/classroom-recovery.js:118|restore|declaration|需要进一步测试|themeConfirm, byId, importClassroomData, setStatus, showToast|
|src/ui/classroom-recovery.js:139|exportRaw|declaration|需要进一步测试|localStorage.getItem, setStatus, URL.createObjectURL, document.createElement, document.body.append, link.click, link.remove, setTimeout, URL.revokeObjectURL|
|src/ui/classroom-recovery.js:167|init|declaration|需要进一步测试|byId, byId("classroomRecoveryScan").addEventListener, byId("classroomRecoveryExportRaw").addEventListener, byId("classroomRecoveryRestore").addEventListener, byId("classroomRecoveryCancel").addEventListener|
|src/ui/classroom-roster-workspace.js:3|clone|binding|需要进一步测试|JSON.parse, JSON.stringify|
|src/ui/classroom-roster-workspace.js:4|toBase64|binding|需要进一步测试|String.fromCharCode, bytes.subarray, btoa|
|src/ui/classroom-roster-workspace.js:10|fromBase64|binding|需要进一步测试|/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==／[A-Za-z0-9+/]{3}=)?$/.test, atob, Uint8Array.from, character.charCodeAt|
|src/ui/classroom-roster-workspace.js:23|sha256|declaration|需要进一步测试|[...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))]       .map((value) => value.toString(16).padStart(2, "0"))       .join, [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))]       .map, crypto.subtle.digest, value.toString(16).padStart, value.toString|
|src/ui/classroom-roster-workspace.js:28|text|binding|需要进一步测试|document.createElement|
|src/ui/classroom-roster-workspace.js:35|mount|declaration|需要进一步测试|root.ClassroomRosterRepository.createClassroomRosterRepository, document.createElement, host.append, section.querySelector, modeSelect.setAttribute, modeLabel.append, text, section       .querySelector(".roster-workspace-toolbar")       .insertBefore, section       .querySelector, section.querySelector(".roster-workspace-toolbar").after, root.TeachingResourceRepository.open, URL.revokeObjectURL, avatarObjectUrls.clear, (           await getAvatarRepository()         ).get, getAvatarRepository, avatar.mimeType.startsWith, URL.createObjectURL, avatarObjectUrls.add, avatarObjectUrls.delete, setStatus, JSON.parse, storage.getItem, root.StableIdentity.isValidUserProfileId, root.StableIdentity.isValidClassroomId, repository.write, render, documentData.assignments.find, documentData.assignments.push, clearAvatarUrls, rows.replaceChildren, documentData?.classrooms.find, documentData.students.map, assignmentFor, assignment.groupAssignments.map, getGroups().map, getGroups, studentMap.get, name.setAttribute, nameCell.append, group.setAttribute, group.append, assigned.get, group.replaceChildren, groupCell.append, renderAvatar, student.displayName.trim().slice, student.displayName.trim, Boolean, upload.setAttribute, new Set(["image/png", "image/jpeg", "image/webp"]).has, repository.read, clone, serializeRows, JSON.stringify, stored.rosterData.students.find, file.arrayBuffer, [               ...new Uint8Array(                 await root.crypto.subtle.digest("SHA-256", bytes),               ),             ]               .map((value) => value.toString(16).padStart(2, "0"))               .join, [               ...new Uint8Array(                 await root.crypto.subtle.digest("SHA-256", bytes),               ),             ]               .map, root.crypto.subtle.digest, value.toString(16).padStart, value.toString, (               await avatarRepo.list({                 profileId,                 classroomId,                 subjectId: "student-avatar",               })             ).find, avatarRepo.list, avatarRepo.addBatch, next.students.find, avatarRepo.remove, uploadLabel.append, avatarEditor.append, clearAvatar.setAttribute, writeDocument, avatarCell.append, remove.setAttribute, classroom.studentIds.filter, documentData.students.filter, assignment.groupAssignments.filter, renderRows, actionCell.append, row.append, rows.append, root.ClassroomRoster.createRosterDocument, profileSelect.replaceChildren, classroomSelect.replaceChildren, profileSelect.append, classroomSelect.append, documentData.profiles.some, documentData.classrooms.some, documentData.classrooms.find, rows.querySelectorAll, row.querySelector("input").value.trim, row.querySelector, names.set, memberships.set, names.has, names.get, [...memberships].map, [...rows.querySelectorAll("tr")].map, documentData.assignments.filter, root.ClassroomRoster.validateRosterDocument, saved.rosterData.students               .map((student) => student.avatarResourceId)               .filter, saved.rosterData.students               .map, avatarRepo.get, asset.mimeType.startsWith, saved.rosterData.students.some, asset.blob.arrayBuffer, assets.push, toBase64, new Date().toISOString, link.click, setTimeout, Array.isArray, rosterData.students           .map((student) => student.avatarResourceId)           .filter, rosterData.students           .map, rosterData.profiles.map, rosterData.classrooms.map, avatarIds.has, referenced.has, avatarIds.add, profileIds.has, classroomById.has, ["image/png", "image/jpeg", "image/webp"].includes, fromBase64, rosterData.students.some, sha256, entry.sha256?.toLowerCase, root.TeachingResource.validateFile, prepared.push, existing.map, existingById.get, mapping.set, existingByHash.get, importedByHash.get, root.StableIdentity.createResourceId, toCreate.push, importedByHash.set, mapping.get, failures.push, failures.join, importRosterBackup, rollbackImportedResources, document.getElementById, document.removeEventListener, overlay.remove, section.querySelector("#rosterPreviewApply")?.focus, openPwdModal, ClassroomWriteBarrier.allow, root.ClassroomRoster.planCompetitionMemberUpdate, Object.freeze, buildClassroomBackup, overlay.setAttribute, plan.groupChanges.filter, plan.groupChanges           .map(             (item) =>               <tr><th>${root.escapeHtml(item.groupName)}</th><td>${root.escapeHtml(item.before.join("、") ／／ "（无）")}</td><td>${root.escapeHtml(item.after.join("、") ／／ "（无）")}</td><td>${item.changed ? "将更新" : "不变"}</td></tr>,           )           .join, plan.groupChanges           .map, root.escapeHtml, item.before.join, item.after.join, document.body.append, overlay.querySelector, overlay.addEventListener, closeApplyPreview, event.preventDefault, document.addEventListener, closeButton.focus, root.themeConfirm, stillCurrent, runClassroomCommand, state.groups.find, classroomCommands.whenIdle, root.StableIdentity.assignGroupUids, repository.previewMigration, root.StableIdentity.createClassroomId, root.StableIdentity.createUserProfileId, section.querySelector("#rosterProfileName").focus, section.querySelector("#rosterClassroomName").focus, section.querySelector("#rosterClassroomName").value.trim, next.classrooms.push, next.assignments.push, section.querySelector("#rosterProfileName").value.trim, next.profiles.push, root.StableIdentity.createStudentUid, documentData.students.push, classroom.studentIds.push, rows.lastElementChild?.querySelector, added?.focus, added?.select, file.text, root.confirm, commitRosterImport, root.addEventListener|
|src/ui/classroom-roster-workspace.js:88|getAvatarRepository|declaration|需要进一步测试|root.TeachingResourceRepository.open|
|src/ui/classroom-roster-workspace.js:92|clearAvatarUrls|declaration|需要进一步测试|URL.revokeObjectURL, avatarObjectUrls.clear|
|src/ui/classroom-roster-workspace.js:96|renderAvatar|declaration|需要进一步测试|(           await getAvatarRepository()         ).get, getAvatarRepository, avatar.mimeType.startsWith, URL.createObjectURL, avatarObjectUrls.add, URL.revokeObjectURL, avatarObjectUrls.delete, setStatus|
|src/ui/classroom-roster-workspace.js:135|setStatus|declaration|需要进一步测试||
|src/ui/classroom-roster-workspace.js:139|writeDocument|declaration|需要进一步测试|repository.write, setStatus, render|
|src/ui/classroom-roster-workspace.js:151|assignmentFor|declaration|需要进一步测试|documentData.assignments.find, documentData.assignments.push|
|src/ui/classroom-roster-workspace.js:167|renderRows|declaration|需要进一步测试|clearAvatarUrls, rows.replaceChildren, documentData?.classrooms.find, documentData.students.map, assignmentFor, assignment.groupAssignments.map, getGroups().map, getGroups, studentMap.get, document.createElement, name.setAttribute, nameCell.append, group.setAttribute, group.append, assigned.get, group.replaceChildren, groupCell.append, renderAvatar, text, student.displayName.trim().slice, student.displayName.trim, Boolean, upload.setAttribute, setStatus, new Set(["image/png", "image/jpeg", "image/webp"]).has, repository.read, storage.getItem, clone, serializeRows, JSON.stringify, stored.rosterData.students.find, getAvatarRepository, file.arrayBuffer, [               ...new Uint8Array(                 await root.crypto.subtle.digest("SHA-256", bytes),               ),             ]               .map((value) => value.toString(16).padStart(2, "0"))               .join, [               ...new Uint8Array(                 await root.crypto.subtle.digest("SHA-256", bytes),               ),             ]               .map, root.crypto.subtle.digest, value.toString(16).padStart, value.toString, (               await avatarRepo.list({                 profileId,                 classroomId,                 subjectId: "student-avatar",               })             ).find, avatarRepo.list, avatarRepo.addBatch, next.students.find, repository.write, render, avatarRepo.remove, uploadLabel.append, avatarEditor.append, clearAvatar.setAttribute, writeDocument, avatarCell.append, remove.setAttribute, classroom.studentIds.filter, documentData.students.filter, assignment.groupAssignments.filter, renderRows, actionCell.append, row.append, rows.append|
|src/ui/classroom-roster-workspace.js:234|upload.onchange|assignment|需要进一步测试|setStatus, new Set(["image/png", "image/jpeg", "image/webp"]).has, repository.read, storage.getItem, clone, serializeRows, JSON.stringify, stored.rosterData.students.find, getAvatarRepository, file.arrayBuffer, [               ...new Uint8Array(                 await root.crypto.subtle.digest("SHA-256", bytes),               ),             ]               .map((value) => value.toString(16).padStart(2, "0"))               .join, [               ...new Uint8Array(                 await root.crypto.subtle.digest("SHA-256", bytes),               ),             ]               .map, root.crypto.subtle.digest, value.toString(16).padStart, value.toString, (               await avatarRepo.list({                 profileId,                 classroomId,                 subjectId: "student-avatar",               })             ).find, avatarRepo.list, avatarRepo.addBatch, next.students.find, repository.write, render, avatarRepo.remove|
|src/ui/classroom-roster-workspace.js:362|clearAvatar.onclick|assignment|需要进一步测试|clone, next.students.find, writeDocument, setStatus|
|src/ui/classroom-roster-workspace.js:379|remove.onclick|assignment|需要进一步测试|classroom.studentIds.filter, documentData.students.filter, assignment.groupAssignments.filter, renderRows, setStatus|
|src/ui/classroom-roster-workspace.js:397|render|declaration|需要进一步测试|repository.read, setStatus, root.ClassroomRoster.createRosterDocument, profileSelect.replaceChildren, classroomSelect.replaceChildren, profileSelect.append, classroomSelect.append, documentData.profiles.some, documentData.classrooms.some, Boolean, section.querySelector, getGroups, renderRows|
|src/ui/classroom-roster-workspace.js:448|serializeRows|declaration|需要进一步测试|documentData.classrooms.find, assignmentFor, rows.querySelectorAll, row.querySelector("input").value.trim, row.querySelector, names.set, memberships.set, documentData.students.map, names.has, names.get, [...memberships].map, [...rows.querySelectorAll("tr")].map, documentData.assignments.filter, documentData.assignments.push, root.ClassroomRoster.validateRosterDocument|
|src/ui/classroom-roster-workspace.js:484|download|declaration|需要进一步测试|repository.read, clone, serializeRows, JSON.stringify, saved.rosterData.students               .map((student) => student.avatarResourceId)               .filter, saved.rosterData.students               .map, getAvatarRepository, avatarRepo.get, asset.mimeType.startsWith, saved.rosterData.students.some, asset.blob.arrayBuffer, assets.push, toBase64, new Date().toISOString, document.createElement, URL.createObjectURL, link.click, setTimeout, URL.revokeObjectURL, setStatus|
|src/ui/classroom-roster-workspace.js:554|importRosterBackup|declaration|需要进一步测试|Array.isArray, root.ClassroomRoster.validateRosterDocument, rosterData.students           .map((student) => student.avatarResourceId)           .filter, rosterData.students           .map, rosterData.profiles.map, rosterData.classrooms.map, avatarIds.has, referenced.has, avatarIds.add, profileIds.has, classroomById.has, ["image/png", "image/jpeg", "image/webp"].includes, fromBase64, rosterData.students.some, sha256, entry.sha256?.toLowerCase, root.TeachingResource.validateFile, prepared.push, getAvatarRepository, avatarRepo.list, existing.map, existingById.get, avatarRepo.get, mapping.set, existingByHash.get, importedByHash.get, root.StableIdentity.createResourceId, toCreate.push, importedByHash.set, avatarRepo.addBatch, mapping.get|
|src/ui/classroom-roster-workspace.js:711|rollbackImportedResources|declaration|需要进一步测试|getAvatarRepository, avatarRepo.remove, failures.push, failures.join|
|src/ui/classroom-roster-workspace.js:725|commitRosterImport|declaration|需要进一步测试|storage.getItem, repository.read, importRosterBackup, repository.write, render, rollbackImportedResources|
|src/ui/classroom-roster-workspace.js:757|closeApplyPreview|declaration|需要进一步测试|document.getElementById, document.removeEventListener, overlay.remove, section.querySelector("#rosterPreviewApply")?.focus, section.querySelector|
|src/ui/classroom-roster-workspace.js:765|openApplyPreview|declaration|需要进一步测试|openPwdModal, ClassroomWriteBarrier.allow, setStatus, repository.read, clone, serializeRows, JSON.stringify, getGroups, root.ClassroomRoster.planCompetitionMemberUpdate, storage.getItem, Object.freeze, buildClassroomBackup, document.createElement, overlay.setAttribute, plan.groupChanges.filter, plan.groupChanges           .map(             (item) =>               <tr><th>${root.escapeHtml(item.groupName)}</th><td>${root.escapeHtml(item.before.join("、") ／／ "（无）")}</td><td>${root.escapeHtml(item.after.join("、") ／／ "（无）")}</td><td>${item.changed ? "将更新" : "不变"}</td></tr>,           )           .join, plan.groupChanges           .map, root.escapeHtml, item.before.join, item.after.join, document.body.append, overlay.querySelector, overlay.addEventListener, closeApplyPreview, document.getElementById, event.preventDefault, document.removeEventListener, document.addEventListener, closeButton.focus, root.themeConfirm, stillCurrent, runClassroomCommand, documentData.classrooms.find, state.groups.find, classroomCommands.whenIdle|
|src/ui/classroom-roster-workspace.js:844|onKeydown|binding|需要进一步测试|document.getElementById, event.preventDefault, closeApplyPreview, document.removeEventListener|
|src/ui/classroom-roster-workspace.js:857|overlay.querySelector("#rosterApplyConfirm").onclick|assignment|需要进一步测试|root.themeConfirm, document.getElementById, closeApplyPreview, document.removeEventListener, repository.read, JSON.stringify, storage.getItem, stillCurrent, setStatus, ClassroomWriteBarrier.allow, openPwdModal, runClassroomCommand, documentData.classrooms.find, state.groups.find, classroomCommands.whenIdle|
|src/ui/classroom-roster-workspace.js:879|stillCurrent|binding|需要进一步测试|JSON.stringify, storage.getItem|
|src/ui/classroom-roster-workspace.js:939|profileSelect.onchange|assignment|需要进一步测试|renderRows, setStatus|
|src/ui/classroom-roster-workspace.js:944|classroomSelect.onchange|assignment|需要进一步测试|renderRows, setStatus|
|src/ui/classroom-roster-workspace.js:949|modeSelect.onchange|assignment|需要进一步测试|assignmentFor, renderRows, setStatus|
|src/ui/classroom-roster-workspace.js:956|section.querySelector("#rosterCreateFromLive").onclick|assignment|需要进一步测试|setStatus, root.StableIdentity.assignGroupUids, getGroups, repository.previewMigration, root.StableIdentity.createClassroomId, root.StableIdentity.createUserProfileId, writeDocument|
|src/ui/classroom-roster-workspace.js:981|section.querySelector("#rosterAddProfile").onclick|assignment|需要进一步测试|section.querySelector, section.querySelector("#rosterProfileName").focus|
|src/ui/classroom-roster-workspace.js:985|addClassroom.onclick|assignment|需要进一步测试|section.querySelector("#rosterClassroomName").focus, section.querySelector|
|src/ui/classroom-roster-workspace.js:989|section.querySelector("#rosterCancelClassroom").onclick|assignment|需要进一步测试||
|src/ui/classroom-roster-workspace.js:992|section.querySelector("#rosterSaveClassroom").onclick|assignment|需要进一步测试|section.querySelector("#rosterClassroomName").value.trim, section.querySelector, setStatus, clone, root.StableIdentity.createClassroomId, next.classrooms.push, next.assignments.push, writeDocument, render|
|src/ui/classroom-roster-workspace.js:1011|section.querySelector("#rosterCancelProfile").onclick|assignment|需要进一步测试|section.querySelector|
|src/ui/classroom-roster-workspace.js:1014|section.querySelector("#rosterSaveProfile").onclick|assignment|需要进一步测试|section.querySelector("#rosterProfileName").value.trim, section.querySelector, setStatus, clone, root.StableIdentity.createUserProfileId, next.profiles.push, next.assignments.push, writeDocument, render|
|src/ui/classroom-roster-workspace.js:1034|section.querySelector("#rosterAddStudent").onclick|assignment|需要进一步测试|documentData.classrooms.find, root.StableIdentity.createStudentUid, documentData.students.push, classroom.studentIds.push, renderRows, rows.lastElementChild?.querySelector, added?.focus, added?.select, setStatus|
|src/ui/classroom-roster-workspace.js:1054|section.querySelector("#rosterSave").onclick|assignment|需要进一步测试|writeDocument, serializeRows, setStatus|
|src/ui/classroom-roster-workspace.js:1063|section.querySelector("#rosterImport").onchange|assignment|需要进一步测试|JSON.parse, file.text, root.confirm, commitRosterImport, setStatus|
|src/ui/contribution-registry.js:96|clone|binding|需要进一步测试|JSON.parse, JSON.stringify|
|src/ui/contribution-registry.js:97|equal|binding|需要进一步测试|JSON.stringify|
|src/ui/contribution-registry.js:98|fail|binding|需要进一步测试||
|src/ui/contribution-registry.js:102|assertSafeJson|declaration|需要进一步测试|fail, ["string", "number", "boolean"].includes, Number.isFinite, Array.isArray, value.forEach, assertSafeJson, Object.prototype.toString.call, Object.entries, EXECUTABLE_FIELD.test, /^on[a-z]+$/i.test|
|src/ui/contribution-registry.js:134|createContributionRegistry|declaration|需要进一步测试|pages.set, Object.freeze, /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*$/.test, fail, Array.isArray, assertSafeJson, clone, activations.set, activationsById.set, IDENTIFIER.test, input.localId.includes, KINDS.has, equal, input.requiredPermissions.some, activationRecord.permissions.has, Object.keys, DESCRIPTOR_FIELDS[input.kind].has, /^[a-z][a-zA-Z0-9_.-]{0,127}$/.test, ["card", "panel", "settings", "decoration"].includes, SLOTS.has, RENDERERS.has, [           "card",           "panel",           "settings",           "navigation",           "commandShortcut",           "viewPreset",           "decoration",         ].includes, ["builtin.dashboard-card", "builtin.notice"].includes, ["builtin.plugin-workspace", "builtin.notice"].includes, ["navigation", "viewPreset"].includes, Object.entries, allowedTokens.has, /^#[0-9a-f]{6}$/i.test, /^[a-z]{2,3}(?:-[A-Z]{2})?$/.test, allowedKeys.has, /^(safety／permissions／dataLoss／transaction)\./.test, value.trim, /[<>]/.test, activations.get, batch.map, validateContribution, stagedIds.has, contributions.has, stagedIds.add, pages.has, stagedRoutes.has, stagedRoutes.add, contributions.set, activationRecord.ids.add, staged.map, activationsById.get, contributions.get, pages.delete, contributions.delete, record.ids.clear, [...contributions.values()]         .filter((item) => item.pluginId === pluginId)         .map, [...contributions.values()]         .filter, contributions.values, [...pages.values()].map, pages.values, pages.get, root.switchView|
|src/ui/contribution-registry.js:161|activate|declaration|需要进一步测试|/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*$/.test, fail, Array.isArray, assertSafeJson, Object.freeze, clone, activations.set, activationsById.set|
|src/ui/contribution-registry.js:195|validateContribution|declaration|需要进一步测试|Array.isArray, fail, IDENTIFIER.test, input.localId.includes, KINDS.has, equal, input.requiredPermissions.some, activationRecord.permissions.has, assertSafeJson, clone, Object.keys, DESCRIPTOR_FIELDS[input.kind].has, /^[a-z][a-zA-Z0-9_.-]{0,127}$/.test, ["card", "panel", "settings", "decoration"].includes, SLOTS.has, RENDERERS.has, [           "card",           "panel",           "settings",           "navigation",           "commandShortcut",           "viewPreset",           "decoration",         ].includes, ["builtin.dashboard-card", "builtin.notice"].includes, ["builtin.plugin-workspace", "builtin.notice"].includes, ["navigation", "viewPreset"].includes, Object.entries, allowedTokens.has, /^#[0-9a-f]{6}$/i.test, /^[a-z]{2,3}(?:-[A-Z]{2})?$/.test, allowedKeys.has, /^(safety／permissions／dataLoss／transaction)\./.test, value.trim, /[<>]/.test|
|src/ui/contribution-registry.js:410|register|declaration|需要进一步测试|activations.get, fail, Array.isArray, batch.map, validateContribution, stagedIds.has, contributions.has, stagedIds.add, pages.has, stagedRoutes.has, stagedRoutes.add, contributions.set, pages.set, activationRecord.ids.add, Object.freeze, staged.map|
|src/ui/contribution-registry.js:444|dispose|declaration|需要进一步测试|activationsById.get, contributions.get, pages.delete, contributions.delete, record.ids.clear|
|src/ui/contribution-registry.js:458|listByPlugin|declaration|需要进一步测试|[...contributions.values()]         .filter((item) => item.pluginId === pluginId)         .map, [...contributions.values()]         .filter, contributions.values|
|src/ui/contribution-registry.js:463|listPages|declaration|需要进一步测试|[...pages.values()].map, pages.values|
|src/ui/contribution-registry.js:466|resolvePage|declaration|需要进一步测试|pages.get, clone|
|src/ui/contribution-registry.js:470|navigate|declaration|需要进一步测试|pages.get, Object.freeze, root.switchView, clone|
|src/ui/disposable-scope.js:5|createDisposableScope|declaration|需要进一步测试|cleanups.indexOf, cleanups.splice, cleanup, entry, cleanups.push, removeCleanup, target.addEventListener, add, target.removeEventListener, setTimeout, release, callback, clearTimeout, requestAnimationFrame, cancelAnimationFrame, observer.disconnect, observer.observe, animation.cancel, animation.finished.then, childScope.dispose, abortController.abort, errors.push, cleanups.splice(0).reverse, Object.freeze|
|src/ui/disposable-scope.js:10|removeCleanup|declaration|需要进一步测试|cleanups.indexOf, cleanups.splice|
|src/ui/disposable-scope.js:15|add|declaration|需要进一步测试|cleanup, entry, cleanups.push, removeCleanup|
|src/ui/disposable-scope.js:19|entry|binding|需要进一步测试|cleanup|
|src/ui/disposable-scope.js:35|listen|declaration|需要进一步测试|target.addEventListener, add, target.removeEventListener|
|src/ui/disposable-scope.js:46|timeout|declaration|需要进一步测试|setTimeout, release, callback, add, clearTimeout|
|src/ui/disposable-scope.js:59|frame|declaration|需要进一步测试|requestAnimationFrame, release, callback, add, cancelAnimationFrame|
|src/ui/disposable-scope.js:72|observe|declaration|需要进一步测试|observer.disconnect, observer.observe, add|
|src/ui/disposable-scope.js:85|animation|declaration|需要进一步测试|animation.cancel, add, animation.finished.then|
|src/ui/disposable-scope.js:97|child|declaration|需要进一步测试|add, childScope.dispose|
|src/ui/disposable-scope.js:104|dispose|declaration|需要进一步测试|abortController.abort, errors.push, cleanups.splice(0).reverse, cleanups.splice, cleanup|
|src/ui/disposable-scope.js:145|createPageLifecycle|declaration|需要进一步测试|Object.freeze, previous.dispose, onDisposeError, createDisposableScope|
|src/ui/disposable-scope.js:153|enter|declaration|需要进一步测试|Object.freeze, previous.dispose, onDisposeError, createDisposableScope|
|src/ui/disposable-scope.js:170|dispose|declaration|需要进一步测试|previous.dispose, onDisposeError|
|src/ui/electron-host.js:9|publish|binding|需要进一步测试|GodpowerPicker.getSnapshot, JSON.stringify, GodpowerPicker.isExternalPresentation, playSound, desktop.publish|
|src/ui/electron-windows.js:27|token|declaration|需要进一步测试|tokens.has, tokens.set, nodes.set, tokens.get|
|src/ui/electron-windows.js:34|visible|binding|需要进一步测试|el.classList.contains, el.getClientRects|
|src/ui/electron-windows.js:40|close|declaration|需要进一步测试|root.querySelector, button.click, closeWelcomeModal, closeScoreModal, closePwdModal, closeMemberSearchModal, closeSettlementNameModal, closeGrandSettlementModal, closeItemWindow, closeHandRaise, closeAbout, closeBatchImportModal, closeThemeDialogV21727, closeQuickPersonScoreV218, document.getElementById("pcCancelV28")?.click, document.getElementById, closers[root.id]|
|src/ui/electron-windows.js:63|scan|declaration|需要进一步测试|[...document.querySelectorAll("style:not([data-native-hide])")]       .map((el) => el.textContent)       .join, [...document.querySelectorAll("style:not([data-native-hide])")]       .map, document.querySelectorAll, document.getElementById, visible, root.removeAttribute, root.cloneNode, root.querySelectorAll, copy.querySelectorAll, original.forEach, target.setAttribute, token, target.removeAttribute, el.matches, [...target.options].forEach, o.toggleAttribute, target.toggleAttribute, String, root.setAttribute, root           .querySelector('[class*="title"],h1,h2,h3')           ?.textContent?.trim()           .slice, root           .querySelector('[class*="title"],h1,h2,h3')           ?.textContent?.trim, root           .querySelector, versions.get, versions.set, list.push, Object.fromEntries, picker.toggleAttribute, JSON.stringify, desktop.publishDialogs, nodes.delete, acks.delete|
|src/ui/item-modules.js:12|node|declaration|需要进一步测试|document.createElement|
|src/ui/item-modules.js:18|itemIcon|declaration|需要进一步测试|node, itemVisual|
|src/ui/item-modules.js:25|button|declaration|需要进一步测试|node, el.addEventListener|
|src/ui/item-modules.js:31|mount|declaration|需要进一步测试|mounts.get, existing.refresh, ItemModules.catalog, node, status.setAttribute, title.append, search.setAttribute, search.addEventListener, search.value.trim().toLowerCase, search.value.trim, renderList, file.addEventListener, Error, JSON.parse, picked.text, ItemModules.update, refresh, announce, actions.append, button, JSON.stringify, ItemModules.configuration, URL.createObjectURL, document.body.append, link.click, link.remove, setTimeout, URL.revokeObjectURL, file.click, confirmReset, ItemModules.defaults, sidebar.append, layout.append, shell.append, host.querySelector, categoryTitle.insertAdjacentElement, host.append, status.classList.toggle, catalog         .map(metadata)         .filter, catalog         .map, [item.name, item.key, kinds[item.kind] ／／ item.kind]             .join(" ")             .toLowerCase()             .includes, [item.name, item.key, kinds[item.kind] ／／ item.kind]             .join(" ")             .toLowerCase, [item.name, item.key, kinds[item.kind] ／／ item.kind]             .join, list.replaceChildren, row.classList.toggle, row.setAttribute, String, row.append, itemIcon, list.append, input.removeAttribute, metadata, catalog.find, input.setAttribute, text.append, input.addEventListener, input.value.trim, input.checkValidity, saveField, Number, block.append, track.setAttribute, track.append, toggle.append, editor.replaceChildren, details.append, header.append, tabs.setAttribute, renderEditor, editor.querySelector('[aria-selected="true"]').focus, editor.querySelector, tab.setAttribute, tab.addEventListener, ["ArrowLeft", "ArrowRight", "Home", "End"].includes, event.preventDefault, tabs.append, panel.setAttribute, panel.append, fieldBlock, item.blocks?.draw?.includes, item.blocks?.operation?.includes, reference.append, DesktopUI.getPreferences, matchMedia, panel.animate, mounts.set|
|src/ui/item-modules.js:136|announce|declaration|需要进一步测试|status.classList.toggle|
|src/ui/item-modules.js:140|metadata|declaration|需要进一步测试||
|src/ui/item-modules.js:144|renderList|declaration|需要进一步测试|ItemModules.configuration, catalog         .map(metadata)         .filter, catalog         .map, [item.name, item.key, kinds[item.kind] ／／ item.kind]             .join(" ")             .toLowerCase()             .includes, [item.name, item.key, kinds[item.kind] ／／ item.kind]             .join(" ")             .toLowerCase, [item.name, item.key, kinds[item.kind] ／／ item.kind]             .join, list.replaceChildren, button, refresh, row.classList.toggle, row.setAttribute, String, row.append, itemIcon, node, list.append|
|src/ui/item-modules.js:185|saveField|declaration|需要进一步测试|ItemModules.configuration, ItemModules.update, input.removeAttribute, renderList, announce, metadata, catalog.find, input.setAttribute|
|src/ui/item-modules.js:203|fieldBlock|declaration|需要进一步测试|node, text.append, input.setAttribute, String, input.addEventListener, input.value.trim, input.checkValidity, announce, saveField, Number, block.append, track.setAttribute, track.append, toggle.append|
|src/ui/item-modules.js:249|renderEditor|declaration|需要进一步测试|metadata, catalog.find, editor.replaceChildren, node, ItemModules.configuration, details.append, header.append, itemIcon, button, confirmReset, ItemModules.defaults, ItemModules.update, refresh, announce, tabs.setAttribute, renderEditor, editor.querySelector('[aria-selected="true"]').focus, editor.querySelector, tab.setAttribute, String, tab.addEventListener, ["ArrowLeft", "ArrowRight", "Home", "End"].includes, event.preventDefault, tabs.append, panel.setAttribute, panel.append, fieldBlock, item.blocks?.draw?.includes, item.blocks?.operation?.includes, reference.append, DesktopUI.getPreferences, matchMedia, panel.animate|
|src/ui/item-modules.js:434|refresh|declaration|需要进一步测试|renderList, renderEditor|
|src/ui/item-modules.js:447|confirmReset|declaration|需要进一步测试|themeConfirm, window.confirm|
|src/ui/migration.js:15|element|binding|需要进一步测试|document.getElementById|
|src/ui/migration.js:16|status|declaration|需要进一步测试|element|
|src/ui/migration.js:22|refresh|declaration|需要进一步测试|element, element("v3MigrationTools").setAttribute, String|
|src/ui/migration.js:28|available|declaration|需要进一步测试|showToast, openPwdModal, classroomCommands.isPending|
|src/ui/migration.js:53|inspect|declaration|需要进一步测试|available, refresh, status, coordinator.preview, preview.conflicts.join|
|src/ui/migration.js:79|stage|declaration|需要进一步测试|available, refresh, status, coordinator.execute, result.conflicts?.join, result.integrity?.failures.join|
|src/ui/migration.js:116|download|declaration|需要进一步测试|URL.createObjectURL, JSON.stringify, document.createElement, link.click, setTimeout, URL.revokeObjectURL|
|src/ui/migration.js:127|init|declaration|需要进一步测试|element, element("v3MigrationInspect").addEventListener, element("v3MigrationStage").addEventListener, element("v3MigrationDownload").addEventListener, window.addEventListener, cancellation?.abort, refresh|
|src/ui/plugin-appearance.js:23|selection|declaration|需要进一步测试|JSON.parse, localStorage.getItem|
|src/ui/plugin-appearance.js:30|restoreTexts|declaration|需要进一步测试|document.querySelector, defaults.has, defaults.get|
|src/ui/plugin-appearance.js:36|restore|declaration|需要进一步测试|document.documentElement.style.removeProperty, document.body?.style.removeProperty, document.documentElement.removeAttribute, restoreTexts|
|src/ui/plugin-appearance.js:45|apply|declaration|需要进一步测试|contributions.find, restore, Object.entries, TOKEN_KEYS.has, /^#[0-9a-f]{6}$/i.test, document.documentElement.style.setProperty, document.body?.style.setProperty, localStorage.setItem, JSON.stringify, window.showToast|
|src/ui/plugin-appearance.js:74|applyText|declaration|需要进一步测试|contributions.filter, Object.entries, TEXT_TARGETS.get, /[<>]/.test, document.querySelector, defaults.has, defaults.set|
|src/ui/plugin-appearance.js:94|sync|declaration|需要进一步测试|restore, restoreTexts, selection, root.GodPowerPageShell?.listByPlugin, contributions.some, apply, localStorage.removeItem, root.GodpowerTheme?.get, selectBuiltinTheme, root.GodPowerPluginCenter?.platform?.list, applyText|
|src/ui/plugin-appearance.js:126|selectBuiltinTheme|declaration|需要进一步测试|localStorage.removeItem, window.showToast, restore, (       root.GodPowerPageShell?.listByPlugin("official.marx-theme") ／／ []     ).find, root.GodPowerPageShell?.listByPlugin, apply|
|src/ui/plugin-center.js:3|$|binding|需要进一步测试|document.querySelector|
|src/ui/plugin-center.js:39|status|declaration|需要进一步测试|$|
|src/ui/plugin-center.js:46|safeStore|declaration|需要进一步测试|root.GodPowerPluginLocalRepository.createPluginLocalRepository, [       root.GodpowerMarxThemePlugin?.manifest,       root.GodpowerMiyamotoPlugin?.manifest,     ].filter, root.GodPowerPluginPlatform.createPluginPlatform, builtins.some, platform.get, platform.install, builtin.permissions           .filter((permission) => permission.required)           .map, builtin.permissions           .filter, platform.grantPermissions, platform.activate|
|src/ui/plugin-center.js:80|addButton|declaration|需要进一步测试|document.createElement, parent.append|
|src/ui/plugin-center.js:90|contributionTitle|declaration|需要进一步测试||
|src/ui/plugin-center.js:98|renderWorkspace|declaration|需要进一步测试|$, host.replaceChildren, root.GodPowerPageShell.resolvePage, renderMiyamotoWorkspace, document.createElement, contributionTitle, host.append|
|src/ui/plugin-center.js:127|renderMiyamotoWorkspace|declaration|需要进一步测试|document.createElement, settingCopy.append, toggleLabel.setAttribute, root.isCommunismMode, toggle.addEventListener, root.setCommunismMode, toggleLabel.append, settings.append, workspaceSection, moduleSettings.append, root.ItemModuleSettings?.mount, document.querySelector, legacyLibraryContent.append, library.append, library.querySelector(":scope > .setting-section-title")?.remove, library.querySelector, root.renderItemEncyclopedia, legacyItemAudio         .querySelector(":scope > .setting-section-title")         ?.remove, legacyItemAudio         .querySelector, itemAudio.append, root.renderItemFxSoundListV26, section.append, host.append|
|src/ui/plugin-center.js:215|workspaceSection|declaration|需要进一步测试|document.createElement, card.append|
|src/ui/plugin-center.js:226|render|declaration|需要进一步测试|$, host.replaceChildren, document.createElement, host.append, platform.list, empty.append, platform.inspect, identity.append, head.append, card.append, record.manifest.permissions.map((p) => ${labels[p.capability] ／／ p.capability}${p.required ? "（必需）" : "（可选）"}).join, record.manifest.permissions.map, addButton, root.GodPowerPageShell.listByPlugin, contributions.filter, contributions.some, root.GodPowerPageShell.listPages().filter, root.GodPowerPageShell.listPages, contributionTitle, renderWorkspace, root.GodPowerPluginAppearance?.sync|
|src/ui/plugin-center.js:328|importManifest|declaration|需要进一步测试|file.text, JSON.parse, platform.install, status, render|
|src/ui/plugin-center.js:336|onClick|declaration|需要进一步测试|event.target.closest, $("#pluginManifestFile")?.click, $, id.split, root.GodPowerPluginAppearance.apply, rest.join, status, render, root.GodPowerPluginAppearance.applyText, platform.deactivate, platform.inspect, entry.manifest.permissions           .filter((p) => p.required)           .map, entry.manifest.permissions           .filter, window.confirm, required.map((p) => labels[p] ／／ p).join, required.map, platform.grantPermissions, platform.activate, platform.uninstall, root.switchView, String|
|src/ui/plugin-center.js:391|init|declaration|需要进一步测试|safeStore, String, $("#view-plugins")?.addEventListener, $, root.switchView, $("#pluginManifestFile")?.addEventListener, importManifest, status, render|
|src/ui/plugin-center.js:398|root.openItemEncyclopedia|assignment|需要进一步测试|root.switchView|
|src/ui/render.js:4|renderAll|declaration|需要进一步测试|clearTimeout, setTimeout, refreshPages|
|src/ui/render.js:23|refreshPages|declaration|需要进一步测试|renderLockStatus, renderControls, renderGrid, updateHeaderStats, renderChart, renderDashboard, updateResizerUI, renderWelcomePage, updateWelcomeTrackIfNeeded|
|src/ui/render.js:35|renderGrid|declaration|需要进一步测试|applyHeldDisplayScoresV21732, setTimeout, refreshBattleGrid, restoreHeldScoreElementsV21732|
|src/ui/render.js:53|refreshBattleGrid|declaration|需要进一步测试|renderBattleGridCards, decorateBattleRanks, decorateRoundItemLocks, renderBattleRankPreviewV21721, console.warn|
|src/ui/round-feedback.js:3|afterPowerRound|declaration|需要进一步测试|powerBefore       .filter((answer) => answer.answered && answer.correct)       .map((answer) => state.groups.find((group) => group.id === answer.id))       .filter(Boolean)       .map, powerBefore       .filter((answer) => answer.answered && answer.correct)       .map((answer) => state.groups.find((group) => group.id === answer.id))       .filter, powerBefore       .filter((answer) => answer.answered && answer.correct)       .map, powerBefore       .filter, state.groups.find, setTimeout, RoundSettlement.isRoundTokenCurrent, cancelAnimationFrame, targets.forEach, Number, Number.isFinite, updates.push, renderDashboard, renderChart, updateHeaderStats, console.warn, animateScores, refresh|
|src/ui/round-feedback.js:29|refresh|binding|需要进一步测试|renderDashboard, renderChart, updateHeaderStats, console.warn|
|src/ui/teaching-resource-workspace.js:7|byId|binding|需要进一步测试|host.querySelector|
|src/ui/teaching-resource-workspace.js:8|make|binding|需要进一步测试|document.createElement|
|src/ui/teaching-resource-workspace.js:15|safeFileName|declaration|需要进一步测试|value.replace(/[\\/\0]/g, "_").slice, value.replace|
|src/ui/teaching-resource-workspace.js:19|toBase64|declaration|需要进一步测试|String.fromCharCode, bytes.subarray, btoa|
|src/ui/teaching-resource-workspace.js:29|fromBase64|declaration|需要进一步测试|/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==／[A-Za-z0-9+/]{3}=)?$/.test, atob, Uint8Array.from, character.charCodeAt|
|src/ui/teaching-resource-workspace.js:41|mount|declaration|需要进一步测试|root.ClassroomRosterRepository.createClassroomRosterRepository, document.createElement, host.append, byId, rosterRepository.read, currentRoster.rosterData.students.some, profile.replaceChildren, classroom.replaceChildren, profile.append, classroom.append, JSON.parse, storage.getItem, profiles.some, classrooms.some, resource.subjectId.toLocaleLowerCase().includes, resource.subjectId.toLocaleLowerCase, [           resource.title,           resource.subjectId,           resource.fileName,           ...resource.tags,         ].some, value.toLocaleLowerCase().includes, value.toLocaleLowerCase, URL.createObjectURL, safeFileName, document.body.append, link.click, link.remove, setTimeout, URL.revokeObjectURL, dialog.remove, dialog.classList.add, dialog.close, releasePreview, dialog.setAttribute, make, close.setAttribute, closePreview, header.append, resource.blob.text, JSON.stringify, body.append, resource.mimeType.startsWith, footer.append, (resource.byteSize / 1024).toFixed, download, dialog.append, dialog.addEventListener, event.preventDefault, dialog.showModal, list.replaceChildren, byId(section, "teachingResourceSearch")         .value.trim()         .toLocaleLowerCase, byId(section, "teachingResourceSearch")         .value.trim, byId(section, "teachingResourceSubjectFilter")         .value.trim()         .toLocaleLowerCase, byId(section, "teachingResourceSubjectFilter")         .value.trim, resources.filter, matchingResource, list.append, info.append, (item.byteSize / 1024).toFixed, item.tags.map((tag) => #${tag}).join, item.tags.map, repository             .get(item.resourceId)             .then((fullResource) => preview(fullResource))             .catch, repository             .get(item.resourceId)             .then, repository             .get, preview, setStatus, repository.get, ensureResourceUnreferenced, root.confirm, repository.remove, refresh, actions.append, card.append, root.TeachingResourceRepository.open, fillScope, repository.list, renderList, byId(section, "teachingResourceList").replaceChildren, files.reduce, byId(section, "teachingResourceSubject").value.trim, byId(section, "teachingResourceTitle").value.trim, byId(section, "teachingResourceTags")         .value.split(/[，,]/)         .map((value) => value.trim())         .filter, byId(section, "teachingResourceTags")         .value.split(/[，,]/)         .map, byId(section, "teachingResourceTags")         .value.split, value.trim, repository.addBatch, files.map, repository.exportAll, packed.push, toBase64, blob.arrayBuffer, file.text, Array.isArray, pack.resources.reduce, Number, pack.resources.map, fromBase64, refresh().catch, importFiles, restorePack, exportPack, root.addEventListener, refreshers.add, Object.freeze|
|src/ui/teaching-resource-workspace.js:59|setStatus|declaration|需要进一步测试|byId|
|src/ui/teaching-resource-workspace.js:65|ensureResourceUnreferenced|declaration|需要进一步测试|rosterRepository.read, currentRoster.rosterData.students.some|
|src/ui/teaching-resource-workspace.js:77|fillScope|declaration|需要进一步测试|byId, profile.replaceChildren, classroom.replaceChildren, profile.append, classroom.append, JSON.parse, storage.getItem, profiles.some, classrooms.some|
|src/ui/teaching-resource-workspace.js:121|matchingResource|declaration|需要进一步测试|resource.subjectId.toLocaleLowerCase().includes, resource.subjectId.toLocaleLowerCase, [           resource.title,           resource.subjectId,           resource.fileName,           ...resource.tags,         ].some, value.toLocaleLowerCase().includes, value.toLocaleLowerCase|
|src/ui/teaching-resource-workspace.js:135|download|declaration|需要进一步测试|URL.createObjectURL, document.createElement, safeFileName, document.body.append, link.click, link.remove, setTimeout, URL.revokeObjectURL|
|src/ui/teaching-resource-workspace.js:146|releasePreview|declaration|需要进一步测试|dialog.remove, URL.revokeObjectURL|
|src/ui/teaching-resource-workspace.js:152|closePreview|declaration|需要进一步测试|dialog.classList.add, setTimeout, dialog.close, releasePreview|
|src/ui/teaching-resource-workspace.js:162|preview|declaration|需要进一步测试|document.createElement, dialog.setAttribute, make, close.setAttribute, closePreview, header.append, resource.blob.text, JSON.stringify, JSON.parse, body.append, resource.mimeType.startsWith, URL.createObjectURL, footer.append, (resource.byteSize / 1024).toFixed, download, dialog.append, dialog.addEventListener, event.preventDefault, releasePreview, document.body.append, dialog.showModal|
|src/ui/teaching-resource-workspace.js:172|close.onclick|assignment|需要进一步测试|closePreview|
|src/ui/teaching-resource-workspace.js:214|save.onclick|assignment|需要进一步测试|download|
|src/ui/teaching-resource-workspace.js:231|renderList|declaration|需要进一步测试|byId, list.replaceChildren, byId(section, "teachingResourceSearch")         .value.trim()         .toLocaleLowerCase, byId(section, "teachingResourceSearch")         .value.trim, byId(section, "teachingResourceSubjectFilter")         .value.trim()         .toLocaleLowerCase, byId(section, "teachingResourceSubjectFilter")         .value.trim, resources.filter, matchingResource, list.append, make, document.createElement, info.append, (item.byteSize / 1024).toFixed, item.tags.map((tag) => #${tag}).join, item.tags.map, repository             .get(item.resourceId)             .then((fullResource) => preview(fullResource))             .catch, repository             .get(item.resourceId)             .then, repository             .get, preview, setStatus, download, repository.get, ensureResourceUnreferenced, root.confirm, repository.remove, refresh, actions.append, card.append|
|src/ui/teaching-resource-workspace.js:279|previewButton.onclick|assignment|需要进一步测试|repository             .get(item.resourceId)             .then((fullResource) => preview(fullResource))             .catch, repository             .get(item.resourceId)             .then, repository             .get, preview, setStatus|
|src/ui/teaching-resource-workspace.js:286|downloadButton.onclick|assignment|需要进一步测试|download, repository.get, setStatus|
|src/ui/teaching-resource-workspace.js:295|removeButton.onclick|assignment|需要进一步测试|ensureResourceUnreferenced, setStatus, root.confirm, repository.remove, refresh|
|src/ui/teaching-resource-workspace.js:323|refresh|declaration|需要进一步测试|rosterRepository.read, setStatus, root.TeachingResourceRepository.open, fillScope, repository.list, byId, renderList, byId(section, "teachingResourceList").replaceChildren, make|
|src/ui/teaching-resource-workspace.js:350|importFiles|declaration|需要进一步测试|byId, setStatus, files.reduce, byId(section, "teachingResourceSubject").value.trim, byId(section, "teachingResourceTitle").value.trim, byId(section, "teachingResourceTags")         .value.split(/[，,]/)         .map((value) => value.trim())         .filter, byId(section, "teachingResourceTags")         .value.split(/[，,]/)         .map, byId(section, "teachingResourceTags")         .value.split, value.trim, repository.addBatch, files.map, refresh|
|src/ui/teaching-resource-workspace.js:389|exportPack|declaration|需要进一步测试|repository.exportAll, byId, packed.push, toBase64, blob.arrayBuffer, JSON.stringify, download, setStatus|
|src/ui/teaching-resource-workspace.js:427|restorePack|declaration|需要进一步测试|byId, setStatus, JSON.parse, file.text, Array.isArray, pack.resources.reduce, Number, pack.resources.map, fromBase64, repository.addBatch, refresh|
|src/ui/teaching-resource-workspace.js:481|byId(section, "teachingResourceProfile").onchange|assignment|需要进一步测试|refresh().catch, refresh, setStatus|
|src/ui/teaching-resource-workspace.js:483|byId(section, "teachingResourceClassroom").onchange|assignment|需要进一步测试|refresh().catch, refresh, setStatus|
|src/ui/teaching-resource-workspace.js:487|byId(section, "teachingResourceImport").onclick|assignment|需要进一步测试|importFiles|
|src/ui/teaching-resource-workspace.js:488|byId(section, "teachingResourceRestore").onclick|assignment|需要进一步测试|restorePack|
|src/ui/teaching-resource-workspace.js:489|byId(section, "teachingResourceExport").onclick|assignment|需要进一步测试|exportPack|
|src/ui/teaching-workspace.js:13|id|binding|需要进一步测试|host.querySelector|
|src/ui/teaching-workspace.js:14|text|binding|需要进一步测试|document.createElement|
|src/ui/teaching-workspace.js:20|toMinute|binding|需要进一步测试|value.split(":").map, value.split|
|src/ui/teaching-workspace.js:24|toTime|binding|需要进一步测试|String(Math.floor(value / 60)).padStart, String, Math.floor, String(value % 60).padStart|
|src/ui/teaching-workspace.js:28|mount|declaration|需要进一步测试|root.ClassroomRosterRepository.createClassroomRosterRepository, root.TeachingScheduleRepository.createTeachingScheduleRepository, document.createElement, DAY_NAMES.map((name, day) => <option value="${day}">${name}</option>).join, DAY_NAMES.map, host.append, id, schedule.entries.filter, getNow, root.TeachingSchedule.findCurrentLesson, now.getDay, now.getHours, now.getMinutes, rosterResult?.rosterData?.classrooms.find, toTime, JSON.stringify, storage.setItem, storage.getItem, root.dispatchEvent, JSON.parse, setStatus, hostList.replaceChildren, currentEntries, hostList.append, text, refreshCurrent, header.append, thead.append, rosterResult.rosterData.classrooms.find, row.append, edit.setAttribute, String, id(section, "teachingStart").focus, remove.setAttribute, cancelEdit, renderList, action.append, tbody.append, table.append, profile.replaceChildren, classroom.replaceChildren, profile.append, classroom.append, (rosterResult.rosterData?.profiles ／／ []).some, rosterRepository.read, scheduleRepository.read, fillProfilesAndClasses, root.StableIdentity.createScheduleId, Number, toMinute, id(section, "teachingSubject").value.trim, id(section, "teachingNote").value.trim, schedule.entries.map, root.TeachingSchedule.validateDocument, scheduleRepository.write, refresh, refreshers.add, Object.freeze|
|src/ui/teaching-workspace.js:53|setStatus|declaration|需要进一步测试|id|
|src/ui/teaching-workspace.js:58|currentEntries|declaration|需要进一步测试|schedule.entries.filter|
|src/ui/teaching-workspace.js:63|cancelEdit|declaration|需要进一步测试|id|
|src/ui/teaching-workspace.js:67|refreshCurrent|declaration|需要进一步测试|getNow, root.TeachingSchedule.findCurrentLesson, now.getDay, now.getHours, now.getMinutes, rosterResult?.rosterData?.classrooms.find, id, toTime, JSON.stringify, storage.setItem, storage.getItem, root.dispatchEvent, JSON.parse, setStatus|
|src/ui/teaching-workspace.js:84|id(section, "teachingUseCurrent").onclick|assignment|需要进一步测试|JSON.stringify, storage.setItem, storage.getItem, root.dispatchEvent, JSON.parse, setStatus|
|src/ui/teaching-workspace.js:107|renderList|declaration|需要进一步测试|id, hostList.replaceChildren, currentEntries, hostList.append, text, refreshCurrent, document.createElement, header.append, thead.append, rosterResult.rosterData.classrooms.find, row.append, toTime, edit.setAttribute, String, id(section, "teachingStart").focus, remove.setAttribute, schedule.entries.filter, cancelEdit, renderList, setStatus, action.append, tbody.append, table.append|
|src/ui/teaching-workspace.js:143|edit.onclick|assignment|需要进一步测试|id, String, toTime, id(section, "teachingStart").focus|
|src/ui/teaching-workspace.js:160|remove.onclick|assignment|需要进一步测试|schedule.entries.filter, cancelEdit, renderList, setStatus|
|src/ui/teaching-workspace.js:176|fillProfilesAndClasses|declaration|需要进一步测试|id, profile.replaceChildren, classroom.replaceChildren, profile.append, classroom.append, (rosterResult.rosterData?.profiles ／／ []).some|
|src/ui/teaching-workspace.js:200|refresh|declaration|需要进一步测试|rosterRepository.read, scheduleRepository.read, setStatus, fillProfilesAndClasses, renderList|
|src/ui/teaching-workspace.js:213|id(section, "teachingProfile").onchange|assignment|需要进一步测试|id, renderList|
|src/ui/teaching-workspace.js:218|id(section, "teachingAddSlot").onclick|assignment|需要进一步测试|id, root.StableIdentity.createScheduleId, Number, toMinute, id(section, "teachingSubject").value.trim, id(section, "teachingNote").value.trim, schedule.entries.map, root.TeachingSchedule.validateDocument, cancelEdit, renderList, refreshCurrent, setStatus|
|src/ui/teaching-workspace.js:253|id(section, "teachingSaveSchedule").onclick|assignment|需要进一步测试|scheduleRepository.write, setStatus, renderList|
|src/ui/themes.js:36|icon|declaration|需要进一步测试|classics.has, classics.set|
|src/ui/themes.js:41|name|declaration|需要进一步测试||
|src/ui/themes.js:44|boot|declaration|需要进一步测试|document.body?.classList.toggle|
|src/ui/themes.js:49|apply|declaration|需要进一步测试|boot, name, document.querySelector, document.getElementById, document       .getElementById("gpIntro")       ?.setAttribute, document       .getElementById, document       .querySelector(".gp-home")       ?.setAttribute, document       .querySelector, emblem.slice, emblem.indexOf, emblem.lastIndexOf, svg.setAttribute, encodeURIComponent, document.querySelectorAll, svg         .querySelector("path")         ?.setAttribute, svg         .querySelector, classics.get, button.setAttribute, String, updateWelcomeClock, window.GodPowerPluginAppearance?.selectBuiltinTheme, window.dispatchEvent|
|src/ui/themes.js:106|cancel|declaration|需要进一步测试|animation.cancel, current.element.remove, current.resolve|
|src/ui/themes.js:114|set|declaration|需要进一步测试|Object.hasOwn, Promise.resolve, cancel, localStorage.setItem, JSON.stringify, window.showToast, DesktopUI.getPreferences, matchMedia, apply, document.createElement, overlay.setAttribute, name, document.body.append, resolve, document.getElementById, overlay.animate, overlay       .querySelector(".gp-theme-transition-content")       .animate, overlay       .querySelector, overlay.querySelector(".gp-theme-ribbon").animate, overlay.querySelector, current.animations.push, motion.finished       .then(() => {         if (active === current) cancel();       })       .catch, motion.finished       .then|
|src/ui/themes.js:191|mount|declaration|需要进一步测试|document.getElementById, document.createElement, panel.querySelector(".ui-settings-title")?.after, panel.querySelector, section.querySelectorAll("[data-appearance-theme]").forEach, section.querySelectorAll, button.addEventListener, set, apply|
|src/ui/tooltips.js:11|titleOwner|declaration|需要进一步测试|target.closest|
|src/ui/tooltips.js:15|getTooltip|declaration|需要进一步测试|document.createElement, tooltip.setAttribute, document.body.append|
|src/ui/tooltips.js:27|removeDescription|declaration|需要进一步测试|owner.getAttribute, owner.removeAttribute, owner.setAttribute, current       .split(/\s+/)       .filter, current       .split, tokens.join|
|src/ui/tooltips.js:43|dismiss|declaration|需要进一步测试|clearTimeout, removeDescription|
|src/ui/tooltips.js:51|position|declaration|需要进一步测试|cancel, active.owner.getBoundingClientRect, Math.max, Math.min|
|src/ui/tooltips.js:81|suppressTitle|declaration|需要进一步测试|active.observer.disconnect, active.owner.setAttribute, active.observer.observe|
|src/ui/tooltips.js:90|refreshTitle|declaration|需要进一步测试|active.owner.getAttribute, active.owner.setAttribute, suppressTitle, dismiss, position|
|src/ui/tooltips.js:108|release|declaration|需要进一步测试|dismiss, previous.observer.disconnect, previous.owner.getAttribute, previous.owner.removeAttribute, previous.owner.setAttribute|
|src/ui/tooltips.js:126|reconcile|declaration|需要进一步测试|release, owner.getAttribute, getTooltip, owner.matches, owner.hasAttribute, owner.textContent.trim, owner.querySelector, owner.setAttribute, suppressTitle, position, setTimeout|
|src/ui/tooltips.js:162|cancel|declaration|需要进一步测试|release|
|src/ui/welcome-v2.js:4|$|binding|需要进一步测试|document.getElementById|
|src/ui/welcome-v2.js:26|esc|binding|需要进一步测试|String(value ?? "").replace, String|
|src/ui/welcome-v2.js:38|preferences|binding|需要进一步测试|DesktopUI.getPreferences|
|src/ui/welcome-v2.js:46|canAnimate|binding|需要进一步测试|preferences|
|src/ui/welcome-v2.js:49|realGroups|binding|需要进一步测试|Array.isArray|
|src/ui/welcome-v2.js:50|score|binding|需要进一步测试|Number|
|src/ui/welcome-v2.js:51|setText|declaration|需要进一步测试|$, String|
|src/ui/welcome-v2.js:56|render|declaration|需要进一步测试|$, realGroups, Number, Date.now, ranking, GodpowerUIModel.standings, setText, JSON.stringify, ranked.map, Math.max, ranked             .map((g, i) => {               const medal = mask                 ? ""                 : i === 0                   ? " gp-medal"                   : i === 1                     ? " gp-medal gp-second"                     : i === 2                       ? " gp-medal gp-third"                       : "";               const pct = mask                 ? 0                 : Math.max(0, Math.min(100, (score(g) / max) * 100));               return <div class="gp-rank-row" role="listitem"><span class="gp-rank-index${medal}">${mask ? "—" : i + 1}</span><span class="gp-rank-name" title="${esc(g.name)}">${esc(g.name)}</span><span class="gp-rank-bar" aria-hidden="true"><i style="width:${pct.toFixed(2)}%"></i></span><span class="gp-rank-points">${mask ? "???" : esc(g.score)}</span><span class="gp-rank-state">${mask ? "已遮蔽" : i === 0 ? "领跑" : "参赛中"}</span></div>;             })             .join, ranked             .map, Math.min, score, esc, pct.toFixed, Reliability.phase, historyStack.slice(-4).reverse, historyStack.slice, recent.map, recent             .map(               (h) =>                 <div class="gp-feed-row"><span class="gp-feed-icon">↗</span><div class="gp-feed-copy"><strong>${esc(h.desc ／／ "课堂操作")}</strong><p>操作记录已保留，可在历史页面查看快照</p></div><span class="gp-feed-time">${esc(h.time ／／ "")}</span></div>,             )             .join, recent             .map, syncRepeats, syncCruise|
|src/ui/welcome-v2.js:132|stopCruise|declaration|需要进一步测试|cancelAnimationFrame|
|src/ui/welcome-v2.js:138|cruiseAllowed|declaration|需要进一步测试|$, preferences, canAnimate|
|src/ui/welcome-v2.js:154|syncCruise|declaration|需要进一步测试|syncRepeats, preferences, setText, $("gpCruiseToggle").setAttribute, $, String, cruiseAllowed, stopCruise, track.querySelector, Date.now, Math.abs, Math.min, requestAnimationFrame|
|src/ui/welcome-v2.js:170|tick|declaration|需要进一步测试|cruiseAllowed, stopCruise, track.querySelector, Date.now, Math.abs, Math.min, requestAnimationFrame|
|src/ui/welcome-v2.js:195|syncRepeats|declaration|需要进一步测试|$, track.querySelectorAll, originals.at, preferences, canAnimate, copies.some, copies.forEach, copy.remove, originals.forEach, original.cloneNode, copy.classList.replace, copy.removeAttribute, copy.setAttribute, e.preventDefault, track.append, track.classList.toggle|
|src/ui/welcome-v2.js:225|copy.onpointerdown|assignment|需要进一步测试|e.preventDefault|
|src/ui/welcome-v2.js:236|setupCruise|declaration|需要进一步测试|$, track.addEventListener, syncCruise, Date.now, track.contains, window.addEventListener, $(id).addEventListener, stopCruise, $("gpCruiseToggle").addEventListener, DesktopUI.setGroupCruise, preferences, new ResizeObserver(syncCruise).observe|
|src/ui/welcome-v2.js:280|isolateBackground|declaration|需要进一步测试|["SCRIPT", "STYLE", "LINK"].includes, background.set|
|src/ui/welcome-v2.js:292|releaseBackground|declaration|需要进一步测试|background.clear|
|src/ui/welcome-v2.js:296|activeIntro|declaration|需要进一步测试|$|
|src/ui/welcome-v2.js:299|focusIntro|declaration|需要进一步测试|activeIntro, $(introBusy ? "gpIntroSkip" : "gpSlideTrack").focus, $|
|src/ui/welcome-v2.js:305|showIntro|declaration|需要进一步测试|[       ...document.querySelectorAll('[role="dialog"][aria-modal="true"]'),     ].find, document.querySelectorAll, el.getClientRects, getComputedStyle, showToast, $, $("gpBrandMount").querySelector, logo.appendChild, isolateBackground, logo.removeAttribute, $("gpIntroTitle").removeAttribute, overlay.setAttribute, overlay.classList.remove, overlay.classList.add, resetPointer, drawSlide, document.body.classList.add, document.body.classList.remove, stopCruise, cancelAnimationFrame, requestAnimationFrame, canAnimate, finish, focusIntro|
|src/ui/welcome-v2.js:348|drawSlide|declaration|需要进一步测试|$, Math.max, Math.min, track.style.setProperty, track.setAttribute, Math.round|
|src/ui/welcome-v2.js:356|resetPointer|declaration|需要进一步测试|$, track.classList.remove, track.hasPointerCapture, track.releasePointerCapture|
|src/ui/welcome-v2.js:364|finish|declaration|需要进一步测试|settleEntrance, resetPointer, cancelAnimationFrame, $, logo.querySelector, document.querySelector, document.body.classList.remove, canAnimate, preferences, document.body.classList.add, overlay.classList.add, overlay.setAttribute, $("gpSlideTrack").setAttribute, window.startResumeRetry, window.tryAutoResumeAndPlay, animation.cancel, animations.clear, mount.appendChild, logo.removeAttribute, title.removeAttribute, overlay.classList.remove, overlay.removeAttribute, $("gpSlideTrack").removeAttribute, releaseBackground, prior.getClientRects, prior.closest, target?.focus, syncCruise, settle, logo.getBoundingClientRect, mount.getBoundingClientRect, title.getBoundingClientRect, label.getBoundingClientRect, Number, getComputedStyle, document           .querySelectorAll(".app-topnav .nav-tab")           .forEach, document           .querySelectorAll, animations.add, tab.animate, logo.animate, movement, title.animate, Math.min, Promise.all(         [...animations].map((animation) =>           animation.finished.then(             () => true,             () => false,           ),         ),       ).then, Promise.all, [...animations].map, animation.finished.then, console.warn|
|src/ui/welcome-v2.js:391|settle|binding|需要进一步测试|animation.cancel, animations.clear, mount.appendChild, logo.removeAttribute, title.removeAttribute, overlay.classList.remove, overlay.setAttribute, overlay.removeAttribute, $("gpSlideTrack").removeAttribute, $, releaseBackground, prior.getClientRects, prior.closest, document.querySelector, target?.focus, syncCruise|
|src/ui/welcome-v2.js:446|movement|binding|需要进一步测试||
|src/ui/welcome-v2.js:515|setupSlider|declaration|需要进一步测试|$, track.getBoundingClientRect, drawSlide, track.addEventListener, track.classList.add, track.setPointerCapture, fromEvent, resetPointer, Number, track.getAttribute, finish, ["ArrowRight", "ArrowLeft", "End", "Home", "Enter", " "].includes, event.preventDefault, document.addEventListener, activeIntro, controls.indexOf, controls[             (at + (event.shiftKey ? -1 : 1) + controls.length) % controls.length           ].focus, $("gpIntro").contains, focusIntro|
|src/ui/welcome-v2.js:517|fromEvent|binding|需要进一步测试|track.getBoundingClientRect, drawSlide|
|src/ui/welcome-v2.js:539|cancel|binding|需要进一步测试|resetPointer, drawSlide|
|src/ui/welcome-v2.js:594|preferencesChanged|declaration|需要进一步测试|canAnimate, preferences, activeIntro, finish, syncCruise|
|src/ui/welcome-v2.js:602|viewChanged|declaration|需要进一步测试|activeIntro, finish, stopCruise, syncCruise|
|src/ui/welcome-v2.js:608|init|declaration|需要进一步测试|$("gpIntroLogo").querySelector, $, document.querySelector, encodeURIComponent, setupSlider, setupCruise, preferencesChanged, $("gpIntroSkip").addEventListener, finish, $("gpReplayIntro").addEventListener, showIntro, reduceMotion.addEventListener, document.addEventListener, settleEntrance, syncCruise, window.addEventListener, resetPointer, drawSlide, activeIntro, stopCruise, render|

## 捕获别名与覆盖链

|位置|别名|捕获的旧入口|分类|
|---|---|---|---|
|src/script/00.js:4395|_v2OpenPicker|openPickerModal|需要进一步测试|
|src/script/00.js:4470|_v2RenderItemWindow|renderItemWindow|需要进一步测试|
|src/script/00.js:4475|_v2Enhance|enhanceItemCards|需要进一步测试|
|src/script/00.js:4476|_v2RenderItemWindowIcons|renderItemWindow|需要进一步测试|
|src/script/00.js:4483|_v2SwitchView|switchView|需要进一步测试|
|src/script/00.js:4498|_v21CloseHandRaise|closeHandRaise|需要进一步测试|
|src/script/00.js:4501|_v21SelectHandGroup|selectHandGroup|需要进一步测试|
|src/script/00.js:4507|_v21JudgeHandRaise|judgeHandRaise|需要进一步测试|
|src/script/00.js:4832|_v25ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/script/00.js:4900|_v26ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/script/00.js:4902|_v26TinyDefense|tinyDefenseToast|需要进一步测试|
|src/script/00.js:4909|_v26GlobalDraw|globalItemDraw|需要进一步测试|
|src/script/00.js:4910|_v26HandDraw|handDrawItem|需要进一步测试|
|src/script/00.js:5482|_v283OpenGroupModal|openGroupModal|需要进一步测试|
|src/script/00.js:5486|_v283RenderGroupModal|renderGroupModal|需要进一步测试|
|src/script/00.js:5528|_v284RenderAbout|renderAbout|需要进一步测试|
|src/script/00.js:5586|_v291GlobalItemDraw|globalItemDraw|需要进一步测试|
|src/script/00.js:5594|_v291OpenItemWindow|openItemWindow|需要进一步测试|
|src/script/00.js:5789|_v2116ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/script/00.js:5871|_v2120RenderItemWindow|renderItemWindow|需要进一步测试|
|src/script/00.js:5923|_v2120EnhanceItemCards|enhanceItemCards|需要进一步测试|
|src/script/00.js:5963|_v2120HandUseNewItem|handUseNewItem|需要进一步测试|
|src/script/01.js:55|_v213Batch|applySettingsBatchMembers|需要进一步测试|
|src/script/02.js:58|_v214JudgeHandRaise|judgeHandRaise|需要进一步测试|
|src/script/03.js:12|oldSwitchV216|switchView|需要进一步测试|
|src/script/04.js:94|_v2164PlaySoundBase|playSound|需要进一步测试|
|src/script/04.js:143|_v2164GlobalItemDraw|globalItemDraw|需要进一步测试|
|src/script/04.js:154|_v2164HandDrawItem|handDrawItem|需要进一步测试|
|src/script/05.js:143|_v2170RenderAboutFallback|renderAbout|需要进一步测试|
|src/script/06.js:115|_v2171CancelHandItemDraw|cancelHandItemDraw|需要进一步测试|
|src/script/07.js:151|_v2172AddItemToGroup|addItemToGroup|需要进一步测试|
|src/script/07.js:224|_v2172RebuildSettingsV26|rebuildSettingsV26|需要进一步测试|
|src/script/07.js:232|_v2172ShowSettingsV26|showSettingsV26|需要进一步测试|
|src/script/09.js:66|_v2174PlaySound|playSound|需要进一步测试|
|src/script/09.js:105|_v2174ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/script/09.js:175|_v2174HandleSoundFileUpload|handleSoundFileUpload|需要进一步测试|
|src/script/09.js:182|_v2174DeleteFxTrack|deleteFxTrack|需要进一步测试|
|src/script/11.js:82|_v2176SyncSettingsControls|syncSettingsControls|需要进一步测试|
|src/script/11.js:97|_v2176RebuildSettingsV26|rebuildSettingsV26|需要进一步测试|
|src/script/11.js:106|_v2176ShowSettingsV26|showSettingsV26|需要进一步测试|
|src/script/12.js:50|_v2177ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/script/12.js:66|_v2177QueueUseState|queueUseStateV2120|需要进一步测试|
|src/script/14.js:164|_v2179InstallClearItems|installClearItemsSettingV2172|需要进一步测试|
|src/script/15.js:154|_v21710GlobalItemDraw|globalItemDraw|需要进一步测试|
|src/script/15.js:170|_v21710HandDrawItem|handDrawItem|需要进一步测试|
|src/script/15.js:214|_v21710InstallInfo|installDrawCooldownInfoV2179|需要进一步测试|
|src/script/15.js:223|_v21710ShowSettings|showSettingsV26|需要进一步测试|
|src/script/17.js:28|_v21713ApplyLightningHit|applyLightningHitV2116|需要进一步测试|
|src/script/18.js:36|_v21715RenderAbout|renderAbout|需要进一步测试|
|src/script/20.js:21|_v21717SessionRestrictedWeights|sessionRestrictedWeightsV21710|需要进一步测试|
|src/script/20.js:36|_v21717CommitSessionDraw|commitSessionDrawV21710|需要进一步测试|
|src/script/20.js:48|_v21717RefreshCooldownInfo|refreshDrawCooldownInfoV21710|需要进一步测试|
|src/script/32.js:39|_v21731EnsureItemState|ensureItemState|需要进一步测试|
|src/script/35.js:30|_v21735ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/script/36.js:44|_v218RenderBattleRankPreview|renderBattleRankPreviewV21721|需要进一步测试|
|src/script/36.js:246|_v218QueueState|queueUseStateV2120|需要进一步测试|
|src/script/36.js:281|_v218ItemDropWeights|itemDropWeights|需要进一步测试|
|src/script/36.js:294|_v218PickItem|pickItemForGroupV281|需要进一步测试|
|src/script/36.js:365|_v218JudgeHandRaise|judgeHandRaise|需要进一步测试|
|src/script/36.js:415|_v218RenderAbout|renderAbout|需要进一步测试|
|src/script/37.js:102|_v2182RenderItemWindow|renderItemWindow|需要进一步测试|
|src/script/37.js:111|_v2182AdminAddItem|adminAddItem|需要进一步测试|
|src/script/38.js:63|_v2184RenderAbout|renderAbout|需要进一步测试|
|src/script/39.js:100|_v2185RenderLockState|renderLockState|需要进一步测试|
|src/script/41.js:36|_v2187RenderAbout|renderAbout|需要进一步测试|
|src/script/41.js:72|_v2187OpenPwdModal|openPwdModal|需要进一步测试|
|src/script/43.js:17|_v21811RenderAbout|renderAbout|需要进一步测试|

## 变量（包括全局候选与局部变量，作用域需结合源码）

|位置|绑定|初始化表达式|分类|
|---|---|---|---|
|src/core/reliability.js:2|Reliability|(() => {   const schemaVersion = 2;   const stateKey = "godpower_state_v2";   const legacyStateKey = "godpower_state_v1";   function validateBackup(data, depth |需要进一步测试|
|src/core/reliability.js:3|schemaVersion|2|需要进一步测试|
|src/core/reliability.js:4|stateKey|"godpower_state_v2"|需要进一步测试|
|src/core/reliability.js:5|legacyStateKey|"godpower_state_v1"|需要进一步测试|
|src/core/reliability.js:28|groupUids|new Set()|需要进一步测试|
|src/core/reliability.js:78|key||需要进一步测试|
|src/core/reliability.js:83|values|data.picker[key]|需要进一步测试|
|src/core/reliability.js:99|global|data.itemGlobal|需要进一步测试|
|src/core/reliability.js:102|key||需要进一步测试|
|src/core/reliability.js:114|key||需要进一步测试|
|src/core/reliability.js:115|records|global[key]|需要进一步测试|
|src/core/reliability.js:121|record||需要进一步测试|
|src/core/reliability.js:143|[key, sequenceKey, eligibleKey]||需要进一步测试|
|src/core/reliability.js:147|throttle|global[key]|需要进一步测试|
|src/core/reliability.js:157|eligible|throttle[eligibleKey]|需要进一步测试|
|src/core/reliability.js:183|session|throttle.activeDrawSession|需要进一步测试|
|src/core/reliability.js:200|h||需要进一步测试|
|src/core/reliability.js:215|writeVerified|ClassroomRepository.writeVerified|需要进一步测试|
|src/core/reliability.js:216|appendArchive|ClassroomRepository.appendArchive|需要进一步测试|
|src/core/reliability.js:228|key|g.inventory[index].key|需要进一步测试|
|src/core/reliability.js:229|continuation|[         "triple_green",         "triple_red",         "triple_banana",         "triple_mushroom",       ].includes(key) && g.roundItemContinuationKeyV218 === |需要进一步测试|
|src/core/reliability.js:246|defenseDecisionEpoch|0|需要进一步测试|
|src/core/reliability.js:247|defenseInvalidationHandlers|new Set()|需要进一步测试|
|src/core/reliability.js:258|handler||需要进一步测试|
|src/core/reliability.js:262|item|target?.inventory?.[0]|需要进一步测试|
|src/core/reliability.js:317|groupMap|new Map(groups.map((g) => [g.id, g]))|需要进一步测试|
|src/core/reliability.js:319|g|groupMap.get(id)|需要进一步测试|
|src/core/reliability.js:322|old|Number(g.score)|需要进一步测试|
|src/core/reliability.js:323|delta|points * count|需要进一步测试|
|src/core/reliability.js:324|score|old + delta|需要进一步测试|
|src/core/reliability.js:343|n|Number(value)|需要进一步测试|
|src/core/reliability.js:353|out|{}|需要进一步测试|
|src/core/reliability.js:356|k||需要进一步测试|
|src/core/reliability.js:402|CLASSROOM_STORAGE|{   getItem(key) {     return localStorage.getItem(key);   },   setItem(key, value) {     localStorage.setItem(key, value);   },   removeItem(key) {     localSt|需要进一步测试|
|src/script/00.js:9|commit|finish ／／ (() => root.classList.remove('active'))|需要进一步测试|
|src/script/00.js:15|DEFAULT_COLORS|['#E5484D', '#2F7DD1', '#3A9D5D', '#F08C1A', '#8E44AD', '#18A6B8', '#4F64D8', '#D84A83', '#D95D39', '#159E91', '#6FA52E', '#A05BE5', '#C58B14', '#D94F70', '#258|需要进一步测试|
|src/script/00.js:18|raw|String(hex／／'').trim().replace('#','')|需要进一步测试|
|src/script/00.js:19|value|raw.length===3?raw.split('').map(x=>x+x).join(''):raw|需要进一步测试|
|src/script/00.js:21|rgb|[0,2,4].map(i=>parseInt(value.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4))|需要进一步测试|
|src/script/00.js:22|luminance|.2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]|需要进一步测试|
|src/script/00.js:24|ink|[23,48,45].map(v=>v/255).map(v=>v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4))|需要进一步测试|
|src/script/00.js:25|inkLuminance|.2126*ink[0]+.7152*ink[1]+.0722*ink[2]|需要进一步测试|
|src/script/00.js:30|FX_SOUND_SLOTS|[   {id:'fullscreen_pick',name:'全屏点名揭晓',category:'全屏演出',desc:'全屏揭晓时播放；支持多段候选随机播放'},   {id:'fullscreen_score_add',name:'全屏加分展示',category:'全屏演出',desc:'绿色全屏加分展示音效'|需要进一步测试|
|src/script/00.js:48|SET_TRACK_TYPES|[   { key: 'intro_normal', name: '常规 Intro 1', desc: '开局引子或无 All in 衔接' },   { key: 'intro_win', name: '胜利翻盘 Intro 2', desc: '上一题 All in 成功多于失败' },   { key: 'in|需要进一步测试|
|src/script/00.js:62|STORAGE|{   get(key, fallback = null) {     try { return localStorage.getItem(key) ?? fallback; } catch (_) { return fallback; }   },   set(key, value) {     try { loca|需要进一步测试|
|src/script/00.js:71|raw|localStorage.getItem(key)|需要进一步测试|
|src/script/00.js:80|clone|value => JSON.parse(JSON.stringify(value))|需要进一步测试|
|src/script/00.js:82|state|{   isLocked: true,   seasonId: StableIdentity.createSeasonId(),   achievementLedger: AchievementLedger.empty(),   hasStartedOnce: false,   roundActive: false, |需要进一步测试|
|src/script/00.js:114|saved|STORAGE.getJSON('politics_groups_data', null)|需要进一步测试|
|src/script/00.js:116|parsedPicker|STORAGE.getJSON('politics_picker_state', null)|需要进一步测试|
|src/script/00.js:132|source|raw && typeof raw === 'object' ? raw : {}|需要进一步测试|
|src/script/00.js:133|numericScore|Number(source.score)|需要进一步测试|
|src/script/00.js:134|id|Number.isFinite(Number(source.id)) ? Number(source.id) : Date.now() + index|需要进一步测试|
|src/script/00.js:136|color|/^#[0-9a-fA-F]{6}$/.test(String(source.color ／／ ''))     ? String(source.color) : DEFAULT_COLORS[index % DEFAULT_COLORS.length]|需要进一步测试|
|src/script/00.js:138|members|Array.isArray(source.members)     ? source.members.map(v => String(v ?? '').trim()).filter(Boolean)     : []|需要进一步测试|
|src/script/00.js:166|seen|new Set()|需要进一步测试|
|src/script/00.js:168|g|normalizeGroup(raw, index)|需要进一步测试|
|src/script/00.js:199|MAX_HISTORY|40|需要进一步测试|
|src/script/00.js:200|historyStack|[]|需要进一步测试|
|src/script/00.js:202|audioCtx|null|需要进一步测试|
|src/script/00.js:203|masterGainNode|null|需要进一步测试|
|src/script/00.js:204|db|null|需要进一步测试|
|src/script/00.js:205|customFxBuffers|{}|需要进一步测试|
|src/script/00.js:206|customFxVariants|Object.create(null)|需要进一步测试|
|src/script/00.js:207|currentUploadingAppend|false|需要进一步测试|
|src/script/00.js:208|currentUploadingGeneration|0|需要进一步测试|
|src/script/00.js:209|activeSetBuffers|{}|需要进一步测试|
|src/script/00.js:210|currentUploadingSlot|null|需要进一步测试|
|src/script/00.js:211|activeEditingGroupId|null|需要进一步测试|
|src/script/00.js:213|slotEngine|{   isSpinning: false,   timerGroup: null,   timerStudent: null,   chosenResult: null }|需要进一步测试|
|src/script/00.js:220|bgmShufflePool|[]|需要进一步测试|
|src/script/00.js:221|currentSetIndex|-1|需要进一步测试|
|src/script/00.js:222|isSwitchingRound|false|需要进一步测试|
|src/script/00.js:223|isStartingRound|false|需要进一步测试|
|src/script/00.js:226|total|state.groups.length|需要进一步测试|
|src/script/00.js:228|count|state.groups.filter(g => g.allIn).length|需要进一步测试|
|src/script/00.js:233|confettiAnimationId|null|需要进一步测试|
|src/script/00.js:234|confettiParticles|[]|需要进一步测试|
|src/script/00.js:254|now|new Date()|需要进一步测试|
|src/script/00.js:255|y|now.getFullYear()|需要进一步测试|
|src/script/00.js:256|m|String(now.getMonth() + 1).padStart(2, '0')|需要进一步测试|
|src/script/00.js:257|d|String(now.getDate()).padStart(2, '0')|需要进一步测试|
|src/script/00.js:258|defaultTitle|${y}年${m}月${d}日 积分结算|需要进一步测试|
|src/script/00.js:260|input|document.getElementById('settlementNameInput')|需要进一步测试|
|src/script/00.js:273|conflict|ClassroomWriteBarrier.conflict()|需要进一步测试|
|src/script/00.js:283|input|document.getElementById('settlementNameInput')|需要进一步测试|
|src/script/00.js:284|title|(input ? input.value.trim() : '') ／／ '积分结算'|需要进一步测试|
|src/script/00.js:287|sorted|[...state.groups].sort((a, b) => (Number(b.score) ／／ 0) - (Number(a.score) ／／ 0))|需要进一步测试|
|src/script/00.js:288|top1|sorted[0]|需要进一步测试|
|src/script/00.js:289|top2|sorted[1]|需要进一步测试|
|src/script/00.js:290|top3|sorted[2]|需要进一步测试|
|src/script/00.js:292|record|{     id: Date.now(),     seasonId: state.seasonId,     title: title,     date: new Date().toLocaleDateString(),     time: new Date().toLocaleString(),     cham|需要进一步测试|
|src/script/00.js:304|archiveResult|saveSettlementRecord(record)|需要进一步测试|
|src/script/00.js:309|beforeReset|clone(state)|需要进一步测试|
|src/script/00.js:309|beforeHistory|clone(historyStack)|需要进一步测试|
|src/script/00.js:319|grandTitle|document.getElementById('grandModalTitle')|需要进一步测试|
|src/script/00.js:321|grandPodium|document.getElementById('grandPodiumDeck')|需要进一步测试|
|src/script/00.js:345|resetResult|saveState()|需要进一步测试|
|src/script/00.js:357|canvas|document.getElementById('confettiCanvas')|需要进一步测试|
|src/script/00.js:359|ctx|canvas.getContext('2d')|需要进一步测试|
|src/script/00.js:363|colors|['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#fde047']|需要进一步测试|
|src/script/00.js:365|i|0|需要进一步测试|
|src/script/00.js:421|host|document.getElementById('archiveClassStats')|需要进一步测试|
|src/script/00.js:423|itemGlobal|state.itemGlobal ／／ {}|需要进一步测试|
|src/script/00.js:424|answers|state.groups.reduce((total, group) => {     const stats = group.itemStats ／／ {};     return total + Number(stats.correct ／／ 0) + Number(stats.wrong ／／ 0);   }, |需要进一步测试|
|src/script/00.js:425|stats|group.itemStats ／／ {}|需要进一步测试|
|src/script/00.js:428|metrics|[     ['课堂作答', answers, '次'],     ['答题轮次', Number(itemGlobal.pkTotal ／／ 0), '轮'],     ['全局道具发放', Number(itemGlobal.totalDraws ／／ 0), '件'],     ['手动举手', Number(i|需要进一步测试|
|src/script/00.js:442|list|getSettlementHistory()|需要进一步测试|
|src/script/00.js:443|record|list[index]|需要进一步测试|
|src/script/00.js:446|csvContent|"\uFEFF排名,小组名称,最终得分,组员名单\n"|需要进一步测试|
|src/script/00.js:448|members|(g.members ／／ []).join(' / ')|需要进一步测试|
|src/script/00.js:452|blob|new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })|需要进一步测试|
|src/script/00.js:453|url|URL.createObjectURL(blob)|需要进一步测试|
|src/script/00.js:454|a|document.createElement('a')|需要进一步测试|
|src/script/00.js:463|list|getSettlementHistory()|需要进一步测试|
|src/script/00.js:478|list|getSettlementHistory()|需要进一步测试|
|src/script/00.js:486|soundIdCache|new Set()|需要进一步测试|
|src/script/00.js:487|fxSoundsLoaded|false|需要进一步测试|
|src/script/00.js:488|fxSoundsLoading|null|需要进一步测试|
|src/script/00.js:489|backgroundAudioInitTimer|null|需要进一步测试|
|src/script/00.js:490|dbInitPromise|null|需要进一步测试|
|src/script/00.js:503|tx|db.transaction('sounds', 'readonly')|需要进一步测试|
|src/script/00.js:504|store|tx.objectStore('sounds')|需要进一步测试|
|src/script/00.js:505|req|store.getAllKeys()|需要进一步测试|
|src/script/00.js:521|bgmEngine|{   state: 'IDLE',   syncStartTime: 0,   battleGain: null,   thinkingGain: null,   activeNodes: [],   victoryNode: null,   preloadedSet: null,   isPreloading: f|需要进一步测试|
|src/script/00.js:536|effectiveBpm|(currentSetIndex === 7)     ? (Number(menuCfg.battleSet8Bpm) ／／ 135)     : (Number(menuCfg.battleBaseBpm) ／／ Number(state.bpm) ／／ 130)|需要进一步测试|
|src/script/00.js:545|now|audioCtx.currentTime|需要进一步测试|
|src/script/00.js:546|elapsed|Math.max(0, now - bgmEngine.syncStartTime)|需要进一步测试|
|src/script/00.js:547|secPerBeat|getSecPerBeat()|需要进一步测试|
|src/script/00.js:548|loopStartSec|8 * secPerBeat|需要进一步测试|
|src/script/00.js:549|loopEndSec|184 * secPerBeat|需要进一步测试|
|src/script/00.js:550|loopDurationSec|loopEndSec - loopStartSec|需要进一步测试|
|src/script/00.js:552|currentSecInTrack||需要进一步测试|
|src/script/00.js:580|nodes|document.querySelectorAll('#historyListView .hist-node')|需要进一步测试|
|src/script/00.js:581|node|nodes[nodes.length - 1 - index]|需要进一步测试|
|src/script/00.js:598|request|indexedDB.open('PoliticsScoreSoundDB_Unified', 1)|需要进一步测试|
|src/script/00.js:601|database|e.target.result|需要进一步测试|
|src/script/00.js:628|migrationDone|STORAGE.get('politics_audio_migration_v2', '0') === '1'|需要进一步测试|
|src/script/00.js:651|AudioContextClass|window.AudioContext ／／ window.webkitAudioContext|需要进一步测试|
|src/script/00.js:679|records|await new Promise(resolve => {         const tx = db.transaction('sounds', 'readonly');         const store = tx.objectStore('sounds');         const req = stor|需要进一步测试|
|src/script/00.js:680|tx|db.transaction('sounds', 'readonly')|需要进一步测试|
|src/script/00.js:681|store|tx.objectStore('sounds')|需要进一步测试|
|src/script/00.js:682|req|store.getAll()|需要进一步测试|
|src/script/00.js:687|ctx|await getAudioContext()|需要进一步测试|
|src/script/00.js:688|fxRecords|records.filter(item =>         item && typeof item.id === 'string' &&         item.id.startsWith('fx_') &&         item.arrayBuffer && item.arrayBuffer.byteLeng|需要进一步测试|
|src/script/00.js:694|variants|Object.create(null)|需要进一步测试|
|src/script/00.js:697|decoded|await ctx.decodeAudioData(item.arrayBuffer.slice(0))|需要进一步测试|
|src/script/00.js:698|key|item.id.slice(3)|需要进一步测试|
|src/script/00.js:698|split|key.indexOf('::variant::')|需要进一步测试|
|src/script/00.js:699|slot|key.slice(0,split)|需要进一步测试|
|src/script/00.js:718|candidates|[customFxBuffers[slotId],...(customFxVariants[slotId]／／[]).map(x=>x.buffer)].filter(Boolean)|需要进一步测试|
|src/script/00.js:724|choices|customFxVariants[slotId]／／[]|需要进一步测试|
|src/script/00.js:724|count|choices.length+(customFxBuffers[slotId]?1:0)|需要进一步测试|
|src/script/00.js:730|tx|db.transaction('sounds','readwrite')|需要进一步测试|
|src/script/00.js:731|slot|id.slice(3,id.indexOf('::variant::'))|需要进一步测试|
|src/script/00.js:739|doCheck|() => {     const isMenuSet = setIdx === 8;     const trackTypes = isMenuSet ? MENU_SET_TRACK_TYPES : SET_TRACK_TYPES;     const prefix = isMenuSet ? 'bgm_menu_|需要进一步测试|
|src/script/00.js:740|isMenuSet|setIdx === 8|需要进一步测试|
|src/script/00.js:741|trackTypes|isMenuSet ? MENU_SET_TRACK_TYPES : SET_TRACK_TYPES|需要进一步测试|
|src/script/00.js:742|prefix|isMenuSet ? 'bgm_menu_' : bgm_set_${setIdx}_|需要进一步测试|
|src/script/00.js:744|count|0|需要进一步测试|
|src/script/00.js:745|hasThinking|false|需要进一步测试|
|src/script/00.js:746|hasBattle|false|需要进一步测试|
|src/script/00.js:748|t||需要进一步测试|
|src/script/00.js:749|id|prefix + t.key|需要进一步测试|
|src/script/00.js:771|completeIndices|[]|需要进一步测试|
|src/script/00.js:772|i|0|需要进一步测试|
|src/script/00.js:773|res|await checkSetCompleteness(i)|需要进一步测试|
|src/script/00.js:780|i|0|需要进一步测试|
|src/script/00.js:781|res|await checkSetCompleteness(i)|需要进一步测试|
|src/script/00.js:788|completeSets|await getAllCompleteSetIndices()|需要进一步测试|
|src/script/00.js:793|i|bgmShufflePool.length - 1|需要进一步测试|
|src/script/00.js:794|j|Math.floor(Math.random() * (i + 1))|需要进一步测试|
|src/script/00.js:801|fallbackIdx|await getFallbackSetIndex()|需要进一步测试|
|src/script/00.js:813|rawDict|await new Promise(resolve => {       const tx = db.transaction('sounds', 'readonly');       const store = tx.objectStore('sounds');       const dict = {};      |需要进一步测试|
|src/script/00.js:814|tx|db.transaction('sounds', 'readonly')|需要进一步测试|
|src/script/00.js:815|store|tx.objectStore('sounds')|需要进一步测试|
|src/script/00.js:816|dict|{}|需要进一步测试|
|src/script/00.js:817|pending|SET_TRACK_TYPES.length|需要进一步测试|
|src/script/00.js:825|id|bgm_set_${setIdx}_${t.key}|需要进一步测试|
|src/script/00.js:826|req|store.get(id)|需要进一步测试|
|src/script/00.js:839|ctx|await getAudioContext()|需要进一步测试|
|src/script/00.js:840|entries|Object.entries(rawDict)|需要进一步测试|
|src/script/00.js:841|total|entries.length|需要进一步测试|
|src/script/00.js:848|loadedCount|0|需要进一步测试|
|src/script/00.js:849|buffers|{}|需要进一步测试|
|src/script/00.js:872|{ setIndex, isFallback }|await pickNextPlayableSetIndex()|需要进一步测试|
|src/script/00.js:874|buffers|await fetchAndDecodeSetBuffers(setIndex)|需要进一步测试|
|src/script/00.js:884|buttonTone|ActionSounds.slots.find(x=>x.id===slotId)|需要进一步测试|
|src/script/00.js:888|now|audioCtx.currentTime|需要进一步测试|
|src/script/00.js:891|osc|audioCtx.createOscillator()|需要进一步测试|
|src/script/00.js:892|gain|audioCtx.createGain()|需要进一步测试|
|src/script/00.js:903|osc|audioCtx.createOscillator()|需要进一步测试|
|src/script/00.js:904|gain|audioCtx.createGain()|需要进一步测试|
|src/script/00.js:915|freqs|[523.25, 659.25, 783.99, 1046.50]|需要进一步测试|
|src/script/00.js:917|osc|audioCtx.createOscillator()|需要进一步测试|
|src/script/00.js:918|gain|audioCtx.createGain()|需要进一步测试|
|src/script/00.js:929|osc|audioCtx.createOscillator()|需要进一步测试|
|src/script/00.js:930|gain|audioCtx.createGain()|需要进一步测试|
|src/script/00.js:943|osc|audioCtx.createOscillator()|需要进一步测试|
|src/script/00.js:944|gain|audioCtx.createGain()|需要进一步测试|
|src/script/00.js:955|notes|[523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50]|需要进一步测试|
|src/script/00.js:957|osc|audioCtx.createOscillator()|需要进一步测试|
|src/script/00.js:958|gain|audioCtx.createGain()|需要进一步测试|
|src/script/00.js:969|osc|audioCtx.createOscillator()|需要进一步测试|
|src/script/00.js:970|gain|audioCtx.createGain()|需要进一步测试|
|src/script/00.js:981|osc|audioCtx.createOscillator()|需要进一步测试|
|src/script/00.js:982|gain|audioCtx.createGain()|需要进一步测试|
|src/script/00.js:992|osc|audioCtx.createOscillator()|需要进一步测试|
|src/script/00.js:993|gain|audioCtx.createGain()|需要进一步测试|
|src/script/00.js:1004|osc|audioCtx.createOscillator()|需要进一步测试|
|src/script/00.js:1005|gain|audioCtx.createGain()|需要进一步测试|
|src/script/00.js:1023|selectedFx|selectFxBuffer(slotId)／／(ActionSounds.isClick(slotId)&&slotId!=='ui_click'?selectFxBuffer('ui_click'):null)|需要进一步测试|
|src/script/00.js:1025|source|audioCtx.createBufferSource()|需要进一步测试|
|src/script/00.js:1028|gain|audioCtx.createGain()|需要进一步测试|
|src/script/00.js:1037|activeLoopTimeouts|[]|需要进一步测试|
|src/script/00.js:1046|battleBuf|activeSetBuffers['battle']|需要进一步测试|
|src/script/00.js:1047|thinkBuf|activeSetBuffers['thinking']|需要进一步测试|
|src/script/00.js:1050|secPerBeat|getSecPerBeat()|需要进一步测试|
|src/script/00.js:1051|loopStartSec|8 * secPerBeat|需要进一步测试|
|src/script/00.js:1052|loopEndSec|184 * secPerBeat|需要进一步测试|
|src/script/00.js:1053|chunkDuration|loopEndSec - offsetSec|需要进一步测试|
|src/script/00.js:1055|now|audioCtx.currentTime|需要进一步测试|
|src/script/00.js:1056|actualStart|Math.max(now, startTime)|需要进一步测试|
|src/script/00.js:1059|bSrc|audioCtx.createBufferSource()|需要进一步测试|
|src/script/00.js:1068|tSrc|audioCtx.createBufferSource()|需要进一步测试|
|src/script/00.js:1076|nextStartTime|actualStart + chunkDuration|需要进一步测试|
|src/script/00.js:1077|delayMs|Math.max(0, (nextStartTime - audioCtx.currentTime - 0.25) * 1000)|需要进一步测试|
|src/script/00.js:1079|timerId|setTimeout(() => {     scheduleDualLoopChunk(nextStartTime, loopStartSec);   }, delayMs)|需要进一步测试|
|src/script/00.js:1099|{ setIndex }|await pickNextPlayableSetIndex()|需要进一步测试|
|src/script/00.js:1111|now|audioCtx.currentTime + 0.05|需要进一步测试|
|src/script/00.js:1113|chosenIntroKey|'intro_normal'|需要进一步测试|
|src/script/00.js:1115|{ wins, losses }|state.lastRoundAllIn|需要进一步测试|
|src/script/00.js:1125|introBuf|activeSetBuffers[chosenIntroKey] ／／ activeSetBuffers['intro_normal']|需要进一步测试|
|src/script/00.js:1126|thinkBuf|activeSetBuffers['thinking']|需要进一步测试|
|src/script/00.js:1127|battleBuf|activeSetBuffers['battle']|需要进一步测试|
|src/script/00.js:1130|introSrc|audioCtx.createBufferSource()|需要进一步测试|
|src/script/00.js:1139|ratioMet|checkAllInRatio()|需要进一步测试|
|src/script/00.js:1162|now|audioCtx.currentTime|需要进一步测试|
|src/script/00.js:1163|secPerBeat|getSecPerBeat()|需要进一步测试|
|src/script/00.js:1164|currentBeat|getTrackCurrentBeat()|需要进一步测试|
|src/script/00.js:1165|beatInBar|currentBeat % 4|需要进一步测试|
|src/script/00.js:1166|beatsToNextBar|4 - beatInBar|需要进一步测试|
|src/script/00.js:1167|effBeats|beatsToNextBar + (Number(menuCfg.battleTransitionLeadBeats) ／／ 0)|需要进一步测试|
|src/script/00.js:1169|triggerTime||需要进一步测试|
|src/script/00.js:1169|transitionBeats||需要进一步测试|
|src/script/00.js:1169|transKey||需要进一步测试|
|src/script/00.js:1180|timeToNextBeat|(Math.ceil(currentBeat) - currentBeat) * secPerBeat|需要进一步测试|
|src/script/00.js:1185|timeToNextBeat|(Math.ceil(currentBeat) - currentBeat) * secPerBeat|需要进一步测试|
|src/script/00.js:1190|timeToNextBeat|(Math.ceil(currentBeat) - currentBeat) * secPerBeat|需要进一步测试|
|src/script/00.js:1196|transBuf|activeSetBuffers[transKey]|需要进一步测试|
|src/script/00.js:1197|exactTransDuration|transitionBeats * secPerBeat|需要进一步测试|
|src/script/00.js:1207|curThink|bgmEngine.thinkingGain.gain.value|需要进一步测试|
|src/script/00.js:1215|transSrc|audioCtx.createBufferSource()|需要进一步测试|
|src/script/00.js:1224|battleResumeTime|triggerTime + exactTransDuration|需要进一步测试|
|src/script/00.js:1225|battleFadeInStart|Math.max(triggerTime, battleResumeTime - 0.050)|需要进一步测试|
|src/script/00.js:1227|curBattle|bgmEngine.battleGain.gain.value|需要进一步测试|
|src/script/00.js:1237|stillAllIn|checkAllInRatio()|需要进一步测试|
|src/script/00.js:1258|now|audioCtx.currentTime|需要进一步测试|
|src/script/00.js:1259|secPerBeat|getSecPerBeat()|需要进一步测试|
|src/script/00.js:1260|currentBeat|getTrackCurrentBeat()|需要进一步测试|
|src/script/00.js:1261|timeToNextBeat|(Math.ceil(currentBeat) - currentBeat) * secPerBeat|需要进一步测试|
|src/script/00.js:1262|triggerTime|now + (timeToNextBeat < 0.005 ? timeToNextBeat + secPerBeat : timeToNextBeat)|需要进一步测试|
|src/script/00.js:1263|fadeDuration|getSecPerBar() * 0.5|需要进一步测试|
|src/script/00.js:1268|curBattle|bgmEngine.battleGain.gain.value|需要进一步测试|
|src/script/00.js:1269|curThink|bgmEngine.thinkingGain.gain.value|需要进一步测试|
|src/script/00.js:1295|victoryBuf|activeSetBuffers['victory']|需要进一步测试|
|src/script/00.js:1296|now|audioCtx.currentTime|需要进一步测试|
|src/script/00.js:1297|secPerBeat|getSecPerBeat()|需要进一步测试|
|src/script/00.js:1298|currentBeat|getTrackCurrentBeat()|需要进一步测试|
|src/script/00.js:1299|beatInBar|currentBeat % 4|需要进一步测试|
|src/script/00.js:1300|beatsToNextBar|4 - beatInBar|需要进一步测试|
|src/script/00.js:1301|triggerTime|now + (beatsToNextBar * secPerBeat)|需要进一步测试|
|src/script/00.js:1313|currentBattleVol|bgmEngine.battleGain.gain.value|需要进一步测试|
|src/script/00.js:1314|currentThinkingVol|bgmEngine.thinkingGain.gain.value|需要进一步测试|
|src/script/00.js:1340|victorySrc|audioCtx.createBufferSource()|需要进一步测试|
|src/script/00.js:1399|now|audioCtx.currentTime|需要进一步测试|
|src/script/00.js:1410|toastTimer|null|需要进一步测试|
|src/script/00.js:1412|t|document.getElementById('toast')|需要进一步测试|
|src/script/00.js:1447|payload|buildClassroomBackup()|需要进一步测试|
|src/script/00.js:1448|result|Reliability.writeVerified(CLASSROOM_STORAGE,Reliability.stateKey,payload)|需要进一步测试|
|src/script/00.js:1454|saveWarning|document.getElementById('classroomSaveWarning')|需要进一步测试|
|src/script/00.js:1457|mirrors|[     ['politics_groups_data',payload.groups],['politics_picker_state',state.picker],     ['politics_item_global',state.itemGlobal],['politics_history_stack_v26|需要进一步测试|
|src/script/00.js:1461|failed|mirrors.filter(([k,v])=>!STORAGE.setJSON(k,v)).map(([k])=>k)|需要进一步测试|
|src/script/00.js:1462|[k,v]||需要进一步测试|
|src/script/00.js:1515|dock|document.getElementById('heightResizerDock')|需要进一步测试|
|src/script/00.js:1522|handle|document.getElementById('resizerHandle')|需要进一步测试|
|src/script/00.js:1523|dock|document.getElementById('heightResizerDock')|需要进一步测试|
|src/script/00.js:1526|startY|0|需要进一步测试|
|src/script/00.js:1527|startH|0|需要进一步测试|
|src/script/00.js:1538|deltaY|e.clientY - startY|需要进一步测试|
|src/script/00.js:1539|newH|Math.max(28, Math.min(600, startH + deltaY))|需要进一步测试|
|src/script/00.js:1578|val|document.getElementById('pwdInput').value.trim()|需要进一步测试|
|src/script/00.js:1586|input|document.getElementById('pwdInput')|需要进一步测试|
|src/script/00.js:1593|newPin|document.getElementById('newPwdInput').value.trim()|需要进一步测试|
|src/script/00.js:1624|roundToken|RoundSettlement.captureRoundToken()|需要进一步测试|
|src/script/00.js:1626|overlay|document.getElementById('initProgressOverlay')|需要进一步测试|
|src/script/00.js:1627|fill|document.getElementById('initProgressFill')|需要进一步测试|
|src/script/00.js:1628|txt|document.getElementById('initProgressText')|需要进一步测试|
|src/script/00.js:1633|playable|await Promise.race([       hasAnyPlayableBgm(),       new Promise(res => setTimeout(() => res(false), 2500))     ])|需要进一步测试|
|src/script/00.js:1708|complete|await getAllCompleteSetIndices()|需要进一步测试|
|src/script/00.js:1710|fb|await getFallbackSetIndex()|需要进一步测试|
|src/script/00.js:1722|roundToken|RoundSettlement.captureRoundToken()|需要进一步测试|
|src/script/00.js:1725|overlay|document.getElementById('initProgressOverlay')|需要进一步测试|
|src/script/00.js:1726|fill|document.getElementById('initProgressFill')|需要进一步测试|
|src/script/00.js:1727|txt|document.getElementById('initProgressText')|需要进一步测试|
|src/script/00.js:1748|flipSnapshotV21725|captureCardRectsV21725()|需要进一步测试|
|src/script/00.js:1751|committed||需要进一步测试|
|src/script/00.js:1770|result|await classroomCommands.whenIdle()|需要进一步测试|
|src/script/00.js:1773|nextRoundAllIn|checkAllInRatio()|需要进一步测试|
|src/script/00.js:1793|text|document.getElementById('settingsBatchMemberText').value.trim()|需要进一步测试|
|src/script/00.js:1795|lines|text.split('\n').map(l => l.trim()).filter(Boolean)|需要进一步测试|
|src/script/00.js:1797|newGroups|[]|需要进一步测试|
|src/script/00.js:1800|delimiter|line.includes(':') ? ':' : '：'|需要进一步测试|
|src/script/00.js:1801|parts|line.split(delimiter)|需要进一步测试|
|src/script/00.js:1802|grpName|parts[0].trim()|需要进一步测试|
|src/script/00.js:1803|membersStr|parts.slice(1).join(delimiter).trim()|需要进一步测试|
|src/script/00.js:1804|members|membersStr.split(/[,，、\s]+/).map(m => m.trim()).filter(Boolean)|需要进一步测试|
|src/script/00.js:1806|existing|state.groups.find(g => g.name.trim() === grpName)|需要进一步测试|
|src/script/00.js:1847|g|state.groups.find(x => x.id === groupId)|需要进一步测试|
|src/script/00.js:1851|inputEl|document.getElementById('modalCustomInput')|需要进一步测试|
|src/script/00.js:1854|errEl|document.getElementById('scoreModalError')|需要进一步测试|
|src/script/00.js:1866|groupId|state.activeModalGroupId|需要进一步测试|
|src/script/00.js:1882|groupId|state.activeModalGroupId|需要进一步测试|
|src/script/00.js:1883|input|document.getElementById('modalCustomInput')|需要进一步测试|
|src/script/00.js:1884|errEl|document.getElementById('scoreModalError')|需要进一步测试|
|src/script/00.js:1887|raw|input.value.trim()     .replace(/[－—–−]/g, '-')     .replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))|需要进一步测试|
|src/script/00.js:1890|fail|(msg) => {     input.classList.add('invalid');     if (errEl) errEl.innerText = msg;     input.focus();     input.select();   }|需要进一步测试|
|src/script/00.js:1897|val|parseInt(raw, 10)|需要进一步测试|
|src/script/00.js:1905|card|document.querySelector(.group-row-card[data-group-id="${groupId}"])|需要进一步测试|
|src/script/00.js:1907|banner|card.querySelector('.milestone-banner-overlay')|需要进一步测试|
|src/script/00.js:1919|activeScoreAnimId|null|需要进一步测试|
|src/script/00.js:1934|startTime|performance.now()|需要进一步测试|
|src/script/00.js:1935|duration|950|需要进一步测试|
|src/script/00.js:1938|elapsed|now - startTime|需要进一步测试|
|src/script/00.js:1939|progress|Math.min(elapsed / duration, 1)|需要进一步测试|
|src/script/00.js:1940|ease|1 - Math.pow(1 - progress, 3)|需要进一步测试|
|src/script/00.js:1943|cur|Math.round(item.start + (item.target - item.start) * ease)|需要进一步测试|
|src/script/00.js:1944|g|state.groups.find(x => x.id === item.groupId)|需要进一步测试|
|src/script/00.js:1947|el|document.getElementById(score-val-${g.id})|需要进一步测试|
|src/script/00.js:1960|g|state.groups.find(x => x.id === item.groupId)|需要进一步测试|
|src/script/00.js:1993|input|document.getElementById(input-score-${groupId})|需要进一步测试|
|src/script/00.js:1994|g|state.groups.find(x => x.id === groupId)|需要进一步测试|
|src/script/00.js:1996|newVal|Number(input.value)|需要进一步测试|
|src/script/00.js:2023|flipSnapshotV21725|captureCardRectsV21725()|需要进一步测试|
|src/script/00.js:2025|allInWins|0|需要进一步测试|
|src/script/00.js:2026|allInLosses|0|需要进一步测试|
|src/script/00.js:2027|hasNormalWin|false|需要进一步测试|
|src/script/00.js:2028|hasMilestone|false|需要进一步测试|
|src/script/00.js:2029|milestoneGroups|[]|需要进一步测试|
|src/script/00.js:2030|scoreUpdates|[]|需要进一步测试|
|src/script/00.js:2032|roundResults|CompetitionRules.calculateRound(state)|需要进一步测试|
|src/script/00.js:2034|result|roundResults[index]|需要进一步测试|
|src/script/00.js:2038|oldScore|result.scoreBefore|需要进一步测试|
|src/script/00.js:2046|oldDigits|Math.floor(Math.abs(oldScore)).toString().length|需要进一步测试|
|src/script/00.js:2047|newDigits|Math.floor(Math.abs(g.score)).toString().length|需要进一步测试|
|src/script/00.js:2069|backdrop|document.getElementById('memberSearchBackdrop')|需要进一步测试|
|src/script/00.js:2070|input|document.getElementById('memberSearchInput')|需要进一步测试|
|src/script/00.js:2080|backdrop|document.getElementById('memberSearchBackdrop')|需要进一步测试|
|src/script/00.js:2095|input|document.getElementById('memberSearchInput')|需要进一步测试|
|src/script/00.js:2096|results|document.getElementById('memberSearchResults')|需要进一步测试|
|src/script/00.js:2099|keyword|input.value.trim().toLowerCase()|需要进一步测试|
|src/script/00.js:2105|matches|[]|需要进一步测试|
|src/script/00.js:2107|members|Array.isArray(g.members) ? g.members : []|需要进一步测试|
|src/script/00.js:2109|name|String(member).trim()|需要进一步测试|
|src/script/00.js:2123|g|item.group|需要进一步测试|
|src/script/00.js:2124|memberList|(Array.isArray(g.members) ? g.members : [])       .map(escapeHtml).join('、')|需要进一步测试|
|src/script/00.js:2138|bar|document.getElementById('quickBatchBar')|需要进一步测试|
|src/script/00.js:2148|banner|document.getElementById('topHeaderStats')|需要进一步测试|
|src/script/00.js:2150|summary|GodpowerUIModel.standings(ranking())|需要进一步测试|
|src/script/00.js:2151|mask|Number(state.itemGlobal?.blooperUntil ／／ 0) > Date.now()|需要进一步测试|
|src/script/00.js:2152|html|小组总数: <b>${summary.count}</b> 组 ／ 总积分: <b>${mask?'???':summary.total}</b> ／ 当前领先: <b style="color:#0284c7;">${mask?'已遮蔽':summary.count?escapeHtml(summary.leade|需要进一步测试|
|src/script/00.js:2160|wrapper|document.getElementById('chartWrapper')|需要进一步测试|
|src/script/00.js:2163|sorted|[...state.groups].sort((a, b) => {     const scA = a.displayScore !== undefined ? a.displayScore : a.score;     const scB = b.displayScore !== undefined ? b.dis|需要进一步测试|
|src/script/00.js:2164|scA|a.displayScore !== undefined ? a.displayScore : a.score|需要进一步测试|
|src/script/00.js:2165|scB|b.displayScore !== undefined ? b.displayScore : b.score|需要进一步测试|
|src/script/00.js:2169|rowHeight|30|需要进一步测试|
|src/script/00.js:2172|maxScore|Math.max(...sorted.map(g => (g.displayScore !== undefined ? g.displayScore : g.score)), 10)|需要进一步测试|
|src/script/00.js:2174|existingRows|Array.from(wrapper.querySelectorAll('.chart-row'))|需要进一步测试|
|src/script/00.js:2175|currentIds|new Set(sorted.map(g => g.id.toString()))|需要进一步测试|
|src/script/00.js:2184|row|wrapper.querySelector(.chart-row[data-id="${g.id}"])|需要进一步测试|
|src/script/00.js:2202|rankEl|row.querySelector('.chart-rank')|需要进一步测试|
|src/script/00.js:2205|nameEl|row.querySelector('.chart-name')|需要进一步测试|
|src/script/00.js:2211|curScore|g.displayScore !== undefined ? g.displayScore : g.score|需要进一步测试|
|src/script/00.js:2212|scoreEl|row.querySelector('.chart-score')|需要进一步测试|
|src/script/00.js:2218|barEl|row.querySelector('.chart-bar')|需要进一步测试|
|src/script/00.js:2220|percent|Math.max(2, (curScore / maxScore) * 100)|需要进一步测试|
|src/script/00.js:2228|podiumDeck|document.getElementById('podiumDeck')|需要进一步测试|
|src/script/00.js:2231|sorted|[...state.groups].sort((a, b) => {     const scA = a.displayScore !== undefined ? a.displayScore : a.score;     const scB = b.displayScore !== undefined ? b.dis|需要进一步测试|
|src/script/00.js:2232|scA|a.displayScore !== undefined ? a.displayScore : a.score|需要进一步测试|
|src/script/00.js:2233|scB|b.displayScore !== undefined ? b.displayScore : b.score|需要进一步测试|
|src/script/00.js:2236|top1|sorted[0]|需要进一步测试|
|src/script/00.js:2237|top2|sorted[1]|需要进一步测试|
|src/script/00.js:2238|top3|sorted[2]|需要进一步测试|
|src/script/00.js:2240|getScoreText|(g) => g ? (g.displayScore !== undefined ? g.displayScore : g.score) : 0|需要进一步测试|
|src/script/00.js:2260|totalGroups|state.groups.length|需要进一步测试|
|src/script/00.js:2261|answeredGroups|state.groups.filter(g => g.selectedOpt).length|需要进一步测试|
|src/script/00.js:2262|allInGroups|state.groups.filter(g => g.allIn).length|需要进一步测试|
|src/script/00.js:2263|totalScore|state.groups.reduce((acc, g) => acc + (g.displayScore !== undefined ? g.displayScore : g.score), 0)|需要进一步测试|
|src/script/00.js:2264|avgScore|totalGroups > 0 ? (totalScore / totalGroups).toFixed(1) : 0|需要进一步测试|
|src/script/00.js:2272|btn|document.getElementById('lockBtn')|需要进一步测试|
|src/script/00.js:2273|addBtn|document.getElementById('btnAddGroup')|需要进一步测试|
|src/script/00.js:2274|importBtn|document.getElementById('btnImport')|需要进一步测试|
|src/script/00.js:2275|resetBtn|document.getElementById('btnResetScores')|需要进一步测试|
|src/script/00.js:2276|undoBtn|document.getElementById('btnUndo')|需要进一步测试|
|src/script/00.js:2298|statusBadge|document.getElementById('roundStatusBadge')|需要进一步测试|
|src/script/00.js:2299|mainActionBtn|document.getElementById('btnMainAction')|需要进一步测试|
|src/script/00.js:2300|nextBtn|document.getElementById('btnNextRound')|需要进一步测试|
|src/script/00.js:2301|forceBtn|document.getElementById('btnForceEnd')|需要进一步测试|
|src/script/00.js:2335|btns|document.querySelectorAll('.ans-btn')|需要进一步测试|
|src/script/00.js:2377|reelGrp|document.getElementById('reelFrameGroup')|需要进一步测试|
|src/script/00.js:2378|reelStu|document.getElementById('reelFrameStudent')|需要进一步测试|
|src/script/00.js:2379|selBox|document.getElementById('twoTierGroupSelect')|需要进一步测试|
|src/script/00.js:2394|wrap|document.getElementById('twoTierGroupChips')|需要进一步测试|
|src/script/00.js:2396|pre|Array.isArray(state.picker.preselectedGroupIds) ? state.picker.preselectedGroupIds : []|需要进一步测试|
|src/script/00.js:2397|groups|state.groups.filter(g => Array.isArray(g.members) && g.members.length > 0)|需要进一步测试|
|src/script/00.js:2399|on|pre.includes(g.id)|需要进一步测试|
|src/script/00.js:2400|style|on ? ('border-color:' + g.color + '; color:#fff; background:' + g.color + ';') : ''|需要进一步测试|
|src/script/00.js:2407|pre|Array.isArray(state.picker.preselectedGroupIds) ? state.picker.preselectedGroupIds.slice() : []|需要进一步测试|
|src/script/00.js:2408|idx|pre.indexOf(gid)|需要进一步测试|
|src/script/00.js:2425|btn|document.getElementById('btnSlotTrigger')|需要进一步测试|
|src/script/00.js:2446|grps|state.groups|需要进一步测试|
|src/script/00.js:2458|grps|state.groups.filter(g => Array.isArray(g.members) && g.members.length > 0)|需要进一步测试|
|src/script/00.js:2459|pre|Array.isArray(state.picker.preselectedGroupIds) ? state.picker.preselectedGroupIds : []|需要进一步测试|
|src/script/00.js:2461|selected|grps.filter(g => pre.includes(g.id))|需要进一步测试|
|src/script/00.js:2464|students|[]|需要进一步测试|
|src/script/00.js:2469|filtered|students.filter(s => !state.picker.pickedStudentKeys.includes(s.key) && !state.picker.pickedStudentKeys.includes(s.legacyKey))|需要进一步测试|
|src/script/00.js:2479|students|[]|需要进一步测试|
|src/script/00.js:2486|filtered|students.filter(s => !state.picker.pickedStudentKeys.includes(s.key) && !state.picker.pickedStudentKeys.includes(s.legacyKey))|需要进一步测试|
|src/script/00.js:2497|pool|getAvailablePool()|需要进一步测试|
|src/script/00.js:2498|label|document.getElementById('poolStatusText')|需要进一步测试|
|src/script/00.js:2513|uiGeneration|typeof DesktopUI!=='undefined'?DesktopUI.getPickerGeneration():null|需要进一步测试|
|src/script/00.js:2514|pool|getAvailablePool()|需要进一步测试|
|src/script/00.js:2524|btn|document.getElementById('btnSlotTrigger')|需要进一步测试|
|src/script/00.js:2528|winnerIndex|Math.floor(Math.random() * pool.list.length)|需要进一步测试|
|src/script/00.js:2536|allGroups|state.groups|需要进一步测试|
|src/script/00.js:2537|allStudents|[]|需要进一步测试|
|src/script/00.js:2545|reelGrps|allGroups|需要进一步测试|
|src/script/00.js:2546|reelStus|allStudents|需要进一步测试|
|src/script/00.js:2548|pre|Array.isArray(state.picker.preselectedGroupIds) ? state.picker.preselectedGroupIds : []|需要进一步测试|
|src/script/00.js:2549|grpWithMembers|state.groups.filter(g => Array.isArray(g.members) && g.members.length > 0)|需要进一步测试|
|src/script/00.js:2551|chosen|allGroups.filter(g => pre.includes(g.id))|需要进一步测试|
|src/script/00.js:2553|chosenStus|allStudents.filter(s => pre.includes(s.group.id))|需要进一步测试|
|src/script/00.js:2561|reelGrpText|document.getElementById('reelTextGroup')|需要进一步测试|
|src/script/00.js:2564|randomGrp|reelGrps[Math.floor(Math.random() * reelGrps.length)]|需要进一步测试|
|src/script/00.js:2569|reelStuText|document.getElementById('reelTextStudent')|需要进一步测试|
|src/script/00.js:2572|randomStu|reelStus[Math.floor(Math.random() * reelStus.length)]|需要进一步测试|
|src/script/00.js:2586|btn|document.getElementById('btnSlotTrigger')|需要进一步测试|
|src/script/00.js:2590|win|slotEngine.chosenResult|需要进一步测试|
|src/script/00.js:2593|reelGrpText|document.getElementById('reelTextGroup')|需要进一步测试|
|src/script/00.js:2594|reelStuText|document.getElementById('reelTextStudent')|需要进一步测试|
|src/script/00.js:2595|badge|document.getElementById('slotSubBadge')|需要进一步测试|
|src/script/00.js:2596|resultHeadline|document.getElementById('resultHeadline')|需要进一步测试|
|src/script/00.js:2618|target|state.picker.mode === 'group' ? win : win.group|需要进一步测试|
|src/script/00.js:2619|text|state.picker.mode === 'group' ? 抽中 ${target.name} : 抽中 ${win.memberName}（${target.name}）|需要进一步测试|
|src/script/00.js:2632|win|slotEngine.chosenResult|需要进一步测试|
|src/script/00.js:2634|targetGroup|state.picker.mode === 'group' ? win : win.group|需要进一步测试|
|src/script/00.js:2635|g|state.groups.find(x => x.id === targetGroup.id)|需要进一步测试|
|src/script/00.js:2639|oldScore|g.score|需要进一步测试|
|src/script/00.js:2651|sample|state.groups.map(g => ${g.name}: ${g.members.join(', ')}).join('\n')|需要进一步测试|
|src/script/00.js:2661|text|document.getElementById('batchTextarea').value.trim()|需要进一步测试|
|src/script/00.js:2663|lines|text.split('\n').map(l => l.trim()).filter(Boolean)|需要进一步测试|
|src/script/00.js:2664|parsedCount|0|需要进一步测试|
|src/script/00.js:2668|delimiter|line.includes(':') ? ':' : '：'|需要进一步测试|
|src/script/00.js:2669|[grpName, membersStr]|line.split(delimiter)|需要进一步测试|
|src/script/00.js:2670|targetGroup|state.groups.find(g => g.name.trim() === grpName.trim() ／／ g.name.replace(/\s+/g, '') === grpName.replace(/\s+/g, ''))|需要进一步测试|
|src/script/00.js:2672|members|membersStr.split(/[,，、\s]+/).map(m => m.trim()).filter(Boolean)|需要进一步测试|
|src/script/00.js:2688|blob|new Blob([JSON.stringify(buildClassroomBackup(),null,2)],{type:'application/json'})|需要进一步测试|
|src/script/00.js:2689|url|URL.createObjectURL(blob)|需要进一步测试|
|src/script/00.js:2689|a|document.createElement('a')|需要进一步测试|
|src/script/00.js:2699|file|event.target.files?.[0]|需要进一步测试|
|src/script/00.js:2701|reader|new FileReader()|需要进一步测试|
|src/script/00.js:2704|result|importClassroomData(JSON.parse(reader.result))|需要进一步测试|
|src/script/00.js:2715|newId|Date.now()|需要进一步测试|
|src/script/00.js:2716|index|state.groups.length + 1|需要进一步测试|
|src/script/00.js:2717|color|DEFAULT_COLORS[(index - 1) % DEFAULT_COLORS.length]|需要进一步测试|
|src/script/00.js:2739|target|state.groups.find(x => x.id === groupId)|需要进一步测试|
|src/script/00.js:2750|g|state.groups.find(x => x.id === groupId)|需要进一步测试|
|src/script/00.js:2761|g|state.groups.find(x => x.id === groupId)|需要进一步测试|
|src/script/00.js:2773|updates|[]|需要进一步测试|
|src/script/00.js:2810|summaryText|state.groups.map(g => ${g.name}: ${(g.members ／／ []).join(', ')}).join('\n')|需要进一步测试|
|src/script/00.js:2823|bgmSlotRenderGeneration|0|需要进一步测试|
|src/script/00.js:2825|container|document.getElementById('bgmListContainer')|需要进一步测试|
|src/script/00.js:2827|generation|++bgmSlotRenderGeneration|需要进一步测试|
|src/script/00.js:2828|setIdx|parseInt(document.getElementById('cfgSetSelector').value, 10)|需要进一步测试|
|src/script/00.js:2829|isMenuSet|setIdx === 8|需要进一步测试|
|src/script/00.js:2830|trackTypes|isMenuSet ? MENU_SET_TRACK_TYPES : SET_TRACK_TYPES|需要进一步测试|
|src/script/00.js:2833|bpmDesc|document.getElementById('cfgSetBpmDesc')|需要进一步测试|
|src/script/00.js:2838|effBpm|setIdx === 7 ? (Number(menuCfg.battleSet8Bpm) ／／ 135) : (Number(menuCfg.battleBaseBpm) ／／ 130)|需要进一步测试|
|src/script/00.js:2844|{ isComplete, count }|await checkSetCompleteness(setIdx)|需要进一步测试|
|src/script/00.js:2846|currentIdxAfter|parseInt(document.getElementById('cfgSetSelector').value, 10)|需要进一步测试|
|src/script/00.js:2849|compLabel|document.getElementById('cfgSetCompleteness')|需要进一步测试|
|src/script/00.js:2851|total|trackTypes.length|需要进一步测试|
|src/script/00.js:2857|track||需要进一步测试|
|src/script/00.js:2858|slotId|isMenuSet ? bgm_menu_${track.key} : bgm_set_${setIdx}_${track.key}|需要进一步测试|
|src/script/00.js:2859|isLoaded|hasSound(slotId)|需要进一步测试|
|src/script/00.js:2861|row|document.createElement('div')|需要进一步测试|
|src/script/00.js:2880|fxContainer|document.getElementById('soundListContainer')|需要进一步测试|
|src/script/00.js:2883|categories|new Map()|需要进一步测试|
|src/script/00.js:2884|category|slot.category／／(['roll_tick','roll_loop','roll_win'].includes(slot.id)?'点名过程与结果':slot.id==='ui_click'?'通用按钮默认音效':'计分与比赛结果')|需要进一步测试|
|src/script/00.js:2885|[category,slots]||需要进一步测试|
|src/script/00.js:2886|section|document.createElement('details')|需要进一步测试|
|src/script/00.js:2887|summary|document.createElement('summary')|需要进一步测试|
|src/script/00.js:2888|slot||需要进一步测试|
|src/script/00.js:2889|isCustom|!!customFxBuffers[slot.id]／／!!customFxVariants[slot.id]?.length|需要进一步测试|
|src/script/00.js:2890|row|document.createElement('div')|需要进一步测试|
|src/script/00.js:2900|tx|db.transaction('sounds', 'readonly')|需要进一步测试|
|src/script/00.js:2901|store|tx.objectStore('sounds')|需要进一步测试|
|src/script/00.js:2902|req|store.get(slotId)|需要进一步测试|
|src/script/00.js:2905|ctx|await getAudioContext()|需要进一步测试|
|src/script/00.js:2907|decoded|await ctx.decodeAudioData(req.result.arrayBuffer.slice(0))|需要进一步测试|
|src/script/00.js:2908|src|ctx.createBufferSource()|需要进一步测试|
|src/script/00.js:2920|input|document.getElementById('soundFileInput')|需要进一步测试|
|src/script/00.js:2923|files|Array.from(event.target.files／／[])|需要进一步测试|
|src/script/00.js:2923|slotId|currentUploadingSlot|需要进一步测试|
|src/script/00.js:2923|append|currentUploadingAppend|需要进一步测试|
|src/script/00.js:2923|uploadGeneration|currentUploadingGeneration|需要进一步测试|
|src/script/00.js:2925|fxKey|slotId.startsWith('fx_')?slotId.slice(3):null|需要进一步测试|
|src/script/00.js:2928|candidate|!!fxKey&&(append／／index>0)|需要进一步测试|
|src/script/00.js:2928|key|candidate?slotId+'::variant::'+crypto.randomUUID():slotId|需要进一步测试|
|src/script/00.js:2929|reader|new FileReader()|需要进一步测试|
|src/script/00.js:2932|decoded||需要进一步测试|
|src/script/00.js:2933|ctx|await getAudioContext()|需要进一步测试|
|src/script/00.js:2939|saved|false|需要进一步测试|
|src/script/00.js:2943|tx|db.transaction('sounds','readwrite')|需要进一步测试|
|src/script/00.js:2957|tx|db.transaction('sounds', 'readwrite')|需要进一步测试|
|src/script/00.js:2958|store|tx.objectStore('sounds')|需要进一步测试|
|src/script/00.js:2972|tx|db.transaction('sounds','readwrite')|需要进一步测试|
|src/script/00.js:2972|store|tx.objectStore('sounds')|需要进一步测试|
|src/script/00.js:2974|req|store.getAllKeys()|需要进一步测试|
|src/script/00.js:2976|key||需要进一步测试|
|src/script/00.js:2987|tx|db.transaction('sounds', 'readonly')|需要进一步测试|
|src/script/00.js:2988|store|tx.objectStore('sounds')|需要进一步测试|
|src/script/00.js:2989|allRecords|await new Promise(resolve => {       const req = store.getAll();       req.onsuccess = () => resolve(req.result ／／ []);       req.onerror = () => resolve([]);  |需要进一步测试|
|src/script/00.js:2990|req|store.getAll()|需要进一步测试|
|src/script/00.js:3000|currentOffset|0|需要进一步测试|
|src/script/00.js:3001|fileIndex|[]|需要进一步测试|
|src/script/00.js:3002|audioBuffersToPack|[]|需要进一步测试|
|src/script/00.js:3004|record||需要进一步测试|
|src/script/00.js:3005|ab|record.arrayBuffer|需要进一步测试|
|src/script/00.js:3011|indexBytes|new TextEncoder().encode(JSON.stringify(fileIndex))|需要进一步测试|
|src/script/00.js:3012|headerBuffer|new ArrayBuffer(8)|需要进一步测试|
|src/script/00.js:3013|headerView|new DataView(headerBuffer)|需要进一步测试|
|src/script/00.js:3018|bundleBlob|new Blob([headerBuffer, indexBytes, ...audioBuffersToPack], { type: 'application/octet-stream' })|需要进一步测试|
|src/script/00.js:3019|downloadUrl|URL.createObjectURL(bundleBlob)|需要进一步测试|
|src/script/00.js:3020|a|document.createElement('a')|需要进一步测试|
|src/script/00.js:3037|file|event.target.files[0]|需要进一步测试|
|src/script/00.js:3041|reader|new FileReader()|需要进一步测试|
|src/script/00.js:3044|fullBuffer|e.target.result|需要进一步测试|
|src/script/00.js:3045|dataView|new DataView(fullBuffer)|需要进一步测试|
|src/script/00.js:3051|indexLength|dataView.getUint32(4, true)|需要进一步测试|
|src/script/00.js:3052|fileIndex|JSON.parse(new TextDecoder().decode(new Uint8Array(fullBuffer, 8, indexLength)))|需要进一步测试|
|src/script/00.js:3053|binaryStart|8 + indexLength|需要进一步测试|
|src/script/00.js:3055|tx|db.transaction('sounds', 'readwrite')|需要进一步测试|
|src/script/00.js:3056|store|tx.objectStore('sounds')|需要进一步测试|
|src/script/00.js:3091|VIEW_NAMES|window.GodPowerPageShell?.listPages()   .filter(page => page.core)   .map(page => page.route) ／／ ['welcome', 'battle', 'history', 'archives', 'settings']|需要进一步测试|
|src/script/00.js:3094|currentView|'welcome'|需要进一步测试|
|src/script/00.js:3095|audioUnlocked|false|需要进一步测试|
|src/script/00.js:3105|route|window.GodPowerPageShell?.resolvePage(name)|需要进一步测试|
|src/script/00.js:3115|target|document.getElementById('view-' + name)|需要进一步测试|
|src/script/00.js:3131|menuKey|getMenuTrackKeyForView(name)|需要进一步测试|
|src/script/00.js:3151|max|state.groups.reduce((m, g) => Math.max(m, Number(g.score) ／／ 0), 0)|需要进一步测试|
|src/script/00.js:3152|digits|Math.max(1, Math.min(6, String(Math.floor(Math.abs(max))).length))|需要进一步测试|
|src/script/00.js:3157|WEEKDAYS|['日', '一', '二', '三', '四', '五', '六']|需要进一步测试|
|src/script/00.js:3158|welcomeClockTimer|null|需要进一步测试|
|src/script/00.js:3169|now|new Date()|需要进一步测试|
|src/script/00.js:3170|hh|String(now.getHours()).padStart(2, '0')|需要进一步测试|
|src/script/00.js:3171|mm|String(now.getMinutes()).padStart(2, '0')|需要进一步测试|
|src/script/00.js:3172|ss|String(now.getSeconds()).padStart(2, '0')|需要进一步测试|
|src/script/00.js:3173|clock|document.getElementById('welcomeClock')|需要进一步测试|
|src/script/00.js:3175|date|document.getElementById('welcomeDate')|需要进一步测试|
|src/script/00.js:3177|greeting|document.getElementById('welcomeGreeting')|需要进一步测试|
|src/script/00.js:3179|h|now.getHours()|需要进一步测试|
|src/script/00.js:3180|part|h < 6 ? '夜深了' : h < 12 ? '早上好' : h < 14 ? '中午好' : h < 18 ? '下午好' : '晚上好'|需要进一步测试|
|src/script/00.js:3187|wrap|document.getElementById('welcomePodiumDeck')|需要进一步测试|
|src/script/00.js:3189|sorted|[...state.groups].sort((a, b) => (Number(b.score) ／／ 0) - (Number(a.score) ／／ 0))|需要进一步测试|
|src/script/00.js:3190|top1|sorted[0]|需要进一步测试|
|src/script/00.js:3190|top2|sorted[1]|需要进一步测试|
|src/script/00.js:3190|top3|sorted[2]|需要进一步测试|
|src/script/00.js:3191|getScore|(g) => g ? (Number(g.score) ／／ 0) : 0|需要进一步测试|
|src/script/00.js:3213|MENU_TRACK_KEYS|['welcome_1', 'welcome_2', 'welcome_3', 'welcome_4', 'welcome_5', 'welcome_6', 'aux_history', 'aux_archives', 'aux_settings']|需要进一步测试|
|src/script/00.js:3214|MENU_SET_TRACK_TYPES|[   { key: 'welcome_1', name: '欢迎·个位张力', desc: '最高分个位数时播放' },   { key: 'welcome_2', name: '欢迎·十位张力', desc: '最高分十位数时播放' },   { key: 'welcome_3', name: '欢迎·百位张力',|需要进一步测试|
|src/script/00.js:3225|MENU_TRACK_META|{   welcome_1: { name: '欢迎·个位张力', tension: 1 },   welcome_2: { name: '欢迎·十位张力', tension: 2 },   welcome_3: { name: '欢迎·百位张力', tension: 3 },   welcome_4: { name:|需要进一步测试|
|src/script/00.js:3236|MENU_AUDIO_DEFAULTS|{   enabled: true,   bpm: 130,   beatsPerBar: 4,   loopStartBeat: 1,   loopEndBeat: 33,   transitionLeadBeats: 1,   battleBaseBpm: 130,   battleSet8Bpm: 135,   |需要进一步测试|
|src/script/00.js:3249|menuCfg|{ ...MENU_AUDIO_DEFAULTS, gainTrims: { ...MENU_AUDIO_DEFAULTS.gainTrims } }|需要进一步测试|
|src/script/00.js:3251|saved|STORAGE.getJSON('politics_menu_audio_cfg', null)|需要进一步测试|
|src/script/00.js:3262|a|seed >>> 0|需要进一步测试|
|src/script/00.js:3265|t|Math.imul(a ^ a >>> 15, 1 ／ a)|需要进一步测试|
|src/script/00.js:3271|SCALE_MAJOR|[0, 2, 4, 5, 7, 9, 11]|需要进一步测试|
|src/script/00.js:3272|CHORD_PROG|[0, 0, 9, 9, 5, 5, 7, 7]|需要进一步测试|
|src/script/00.js:3273|MENU_PATTERN_CACHE|{}|需要进一步测试|
|src/script/00.js:3277|cacheKey|key + ':' + bars|需要进一步测试|
|src/script/00.js:3279|meta|MENU_TRACK_META[key] ／／ { tension: 1 }|需要进一步测试|
|src/script/00.js:3280|rnd|mulberry32(key.split('').reduce((s, c) => s + c.charCodeAt(0), 7))|需要进一步测试|
|src/script/00.js:3281|stepsPerBar|16|需要进一步测试|
|src/script/00.js:3282|totalSteps|bars * stepsPerBar|需要进一步测试|
|src/script/00.js:3283|tension|meta.tension|需要进一步测试|
|src/script/00.js:3284|density|meta.density !== undefined ? meta.density     : (tension >= 6 ? 0.66 : tension === 5 ? 0.56 : tension === 4 ? 0.46 : tension === 3 ? 0.36 : tension === 2 ? 0.26|需要进一步测试|
|src/script/00.js:3286|hatLevel|meta.hat !== undefined ? meta.hat     : (tension >= 6 ? 0.85 : tension === 5 ? 0.7 : tension === 4 ? 0.55 : tension === 3 ? 0.4 : tension === 2 ? 0.25 : tension|需要进一步测试|
|src/script/00.js:3288|leadOct|meta.leadOct !== undefined ? meta.leadOct     : (tension >= 5 ? 3 : tension >= 3 ? 2 : 1)|需要进一步测试|
|src/script/00.js:3290|bass|new Array(totalSteps).fill(0)|需要进一步测试|
|src/script/00.js:3291|lead|new Array(totalSteps).fill(null)|需要进一步测试|
|src/script/00.js:3292|hat|new Array(totalSteps).fill(false)|需要进一步测试|
|src/script/00.js:3293|bar|0|需要进一步测试|
|src/script/00.js:3294|chordRoot|CHORD_PROG[bar % CHORD_PROG.length]|需要进一步测试|
|src/script/00.js:3295|rootMidi|48 + chordRoot|需要进一步测试|
|src/script/00.js:3296|step|0|需要进一步测试|
|src/script/00.js:3297|gs|bar * stepsPerBar + step|需要进一步测试|
|src/script/00.js:3301|deg|Math.floor(rnd() * SCALE_MAJOR.length)|需要进一步测试|
|src/script/00.js:3302|oct|Math.floor(rnd() * 2)|需要进一步测试|
|src/script/00.js:3312|noiseBuffer|null|需要进一步测试|
|src/script/00.js:3316|len|Math.floor(audioCtx.sampleRate * 0.05)|需要进一步测试|
|src/script/00.js:3318|data|noiseBuffer.getChannelData(0)|需要进一步测试|
|src/script/00.js:3319|i|0|需要进一步测试|
|src/script/00.js:3332|MENU_FADE_SEC|0.5|需要进一步测试|
|src/script/00.js:3333|menuBgm|{   active: false,   currentKey: null,   pendingKey: null,   buffers: {},   uploadedKeys: new Set(),   outGain: null,   voices: [],   origin: 0,   pausedPos: nu|需要进一步测试|
|src/script/00.js:3350|startBeat|Math.max(1, Number(menuCfg.loopStartBeat) ／／ 1)|需要进一步测试|
|src/script/00.js:3351|endBeat|Math.max(startBeat + 4, Number(menuCfg.loopEndBeat) ／／ 33)|需要进一步测试|
|src/script/00.js:3366|targetEnd|menuLoopSpan().endSec|需要进一步测试|
|src/script/00.js:3367|missing|targetEnd - buf.duration|需要进一步测试|
|src/script/00.js:3368|maxRepair|Math.min(0.35, menuSecPerBeat() * 0.75)|需要进一步测试|
|src/script/00.js:3372|sampleRate|buf.sampleRate ／／ audioCtx.sampleRate|需要进一步测试|
|src/script/00.js:3373|targetLength|Math.ceil(targetEnd * sampleRate) + 1|需要进一步测试|
|src/script/00.js:3374|fixed|audioCtx.createBuffer(buf.numberOfChannels, targetLength, sampleRate)|需要进一步测试|
|src/script/00.js:3375|ch|0|需要进一步测试|
|src/script/00.js:3396|sr|audioCtx.sampleRate|需要进一步测试|
|src/script/00.js:3397|bpm|Math.max(40, Number(menuCfg.bpm) ／／ 130)|需要进一步测试|
|src/script/00.js:3398|beats|Math.max(4, (Number(menuCfg.loopEndBeat) ／／ 33) - (Number(menuCfg.loopStartBeat) ／／ 1))|需要进一步测试|
|src/script/00.js:3399|bars|Math.max(8, Math.ceil(beats / 4))|需要进一步测试|
|src/script/00.js:3400|totalSteps|bars * 16|需要进一步测试|
|src/script/00.js:3401|stepSec|60 / bpm / 16|需要进一步测试|
|src/script/00.js:3402|dur|totalSteps * stepSec|需要进一步测试|
|src/script/00.js:3403|len|Math.max(1, Math.floor(sr * dur))|需要进一步测试|
|src/script/00.js:3404|offline|new OfflineAudioContext(1, len, sr)|需要进一步测试|
|src/script/00.js:3405|pat|buildMenuPattern(key, bars)|需要进一步测试|
|src/script/00.js:3406|trim|Math.max(0, Math.min(3, Number(menuCfg.gainTrims[key]) ／／ 1))|需要进一步测试|
|src/script/00.js:3407|step|0|需要进一步测试|
|src/script/00.js:3408|time|step * stepSec|需要进一步测试|
|src/script/00.js:3409|bassMidi|pat.bass[step]|需要进一步测试|
|src/script/00.js:3410|leadMidi|pat.lead[step]|需要进一步测试|
|src/script/00.js:3411|hatOn|pat.hat[step]|需要进一步测试|
|src/script/00.js:3413|osc|offline.createOscillator()|需要进一步测试|
|src/script/00.js:3414|g|offline.createGain()|需要进一步测试|
|src/script/00.js:3424|osc|offline.createOscillator()|需要进一步测试|
|src/script/00.js:3425|g|offline.createGain()|需要进一步测试|
|src/script/00.js:3435|buf|offline.createBuffer(1, Math.floor(sr * 0.05), sr)|需要进一步测试|
|src/script/00.js:3436|dd|buf.getChannelData(0)|需要进一步测试|
|src/script/00.js:3437|i|0|需要进一步测试|
|src/script/00.js:3438|src|offline.createBufferSource()|需要进一步测试|
|src/script/00.js:3440|g|offline.createGain()|需要进一步测试|
|src/script/00.js:3443|hp|offline.createBiquadFilter()|需要进一步测试|
|src/script/00.js:3454|menuLoading|{}|需要进一步测试|
|src/script/00.js:3458|p|(async () => {     let buf = null;     if (db) {       try {         const ab = await new Promise(res => {           const tx = db.transaction('sounds', 'readon|需要进一步测试|
|src/script/00.js:3459|buf|null|需要进一步测试|
|src/script/00.js:3462|ab|await new Promise(res => {           const tx = db.transaction('sounds', 'readonly');           const req = tx.objectStore('sounds').get('bgm_menu_' + key);    |需要进一步测试|
|src/script/00.js:3463|tx|db.transaction('sounds', 'readonly')|需要进一步测试|
|src/script/00.js:3464|req|tx.objectStore('sounds').get('bgm_menu_' + key)|需要进一步测试|
|src/script/00.js:3487|span|menuLoopSpan()|需要进一步测试|
|src/script/00.js:3489|startSec|Math.min(span.startSec, Math.max(0, buf.duration - 0.05))|需要进一步测试|
|src/script/00.js:3490|endSec|Math.min(span.endSec, buf.duration)|需要进一步测试|
|src/script/00.js:3497|t|Number(menuCfg.gainTrims[key])|需要进一步测试|
|src/script/00.js:3503|lp|menuLoopParams(buf, key)|需要进一步测试|
|src/script/00.js:3504|elapsed|Math.max(0, t - menuBgm.origin)|需要进一步测试|
|src/script/00.js:3506|dur|lp.endSec - lp.startSec|需要进一步测试|
|src/script/00.js:3512|r|v.ramp|需要进一步测试|
|src/script/00.js:3520|now|audioCtx.currentTime|需要进一步测试|
|src/script/00.js:3521|cur|menuVoiceGainAt(v, now)|需要进一步测试|
|src/script/00.js:3522|g|v.gain.gain|需要进一步测试|
|src/script/00.js:3530|lp|menuLoopParams(buf, key)|需要进一步测试|
|src/script/00.js:3531|src|audioCtx.createBufferSource()|需要进一步测试|
|src/script/00.js:3536|gain|audioCtx.createGain()|需要进一步测试|
|src/script/00.js:3540|offset|Math.min(menuPosForKey(key, buf, startAt), Math.max(0, buf.duration - 0.02))|需要进一步测试|
|src/script/00.js:3541|v|{ key, src, gain, ramp: { v0: 0, v1: 0, t0: 0, t1: 0 }, stopping: false, loopStart: src.loopStart, loopEnd: src.loopEnd }|需要进一步测试|
|src/script/00.js:3545|i|menuBgm.voices.indexOf(v)|需要进一步测试|
|src/script/00.js:3556|dur|fadeSec == null ? MENU_FADE_SEC : fadeSec|需要进一步测试|
|src/script/00.js:3567|now|audioCtx.currentTime|需要进一步测试|
|src/script/00.js:3568|startAt|now + 0.03|需要进一步测试|
|src/script/00.js:3578|live|menuBgm.voices.find(v => v.key === key && !v.stopping)|需要进一步测试|
|src/script/00.js:3580|target|menuTrimFor(key)|需要进一步测试|
|src/script/00.js:3592|token|++menuBgm.opToken|需要进一步测试|
|src/script/00.js:3598|buf|await menuLoadBuffer(key)|需要进一步测试|
|src/script/00.js:3611|endT|audioCtx.currentTime + MENU_FADE_SEC|需要进一步测试|
|src/script/00.js:3612|cur|menuBgm.currentKey|需要进一步测试|
|src/script/00.js:3613|buf|cur ? menuBgm.buffers[cur] : null|需要进一步测试|
|src/script/00.js:3636|cur|menuBgm.currentKey|需要进一步测试|
|src/script/00.js:3637|buf|cur ? menuBgm.buffers[cur] : null|需要进一步测试|
|src/script/00.js:3639|lp|menuLoopParams(buf, cur)|需要进一步测试|
|src/script/00.js:3640|ls|Math.min(lp.startSec, Math.max(0, buf.duration - 0.02))|需要进一步测试|
|src/script/00.js:3641|le|Math.min(lp.endSec, buf.duration)|需要进一步测试|
|src/script/00.js:3642|live|menuBgm.voices.find(v => v.key === cur && !v.stopping)|需要进一步测试|
|src/script/00.js:3648|menuReloadTimer|null|需要进一步测试|
|src/script/00.js:3653|key|menuBgm.currentKey|需要进一步测试|
|src/script/00.js:3657|buf|await menuLoadBuffer(key)|需要进一步测试|
|src/script/00.js:3661|startAt|audioCtx.currentTime + 0.03|需要进一步测试|
|src/script/00.js:3669|key|getWelcomeTrackKey()|需要进一步测试|
|src/script/00.js:3675|box|document.getElementById('bgmEngineConsole')|需要进一步测试|
|src/script/00.js:3677|trimRows|MENU_TRACK_KEYS.map(k =>     '<div class="trim-row">' +       '<span class="trim-name">' + MENU_TRACK_META[k].name + '</span>' +       '<input type="range" min=|需要进一步测试|
|src/script/00.js:3735|el|document.getElementById('cfgMenuBpmVal')|需要进一步测试|
|src/script/00.js:3751|el|document.getElementById('trim-val-' + k)|需要进一步测试|
|src/script/00.js:3754|el|document.getElementById('cfgBattleBaseBpmVal')|需要进一步测试|
|src/script/00.js:3755|el|document.getElementById('cfgBattleSet8BpmVal')|需要进一步测试|
|src/script/00.js:3760|rollLoopNode|null|需要进一步测试|
|src/script/00.js:3761|rollLoopGain|null|需要进一步测试|
|src/script/00.js:3765|sr|audioCtx.sampleRate|需要进一步测试|
|src/script/00.js:3766|dur|0.5|需要进一步测试|
|src/script/00.js:3767|buf|audioCtx.createBuffer(1, Math.floor(sr * dur), sr)|需要进一步测试|
|src/script/00.js:3768|d|buf.getChannelData(0)|需要进一步测试|
|src/script/00.js:3769|steps|8|需要进一步测试|
|src/script/00.js:3770|i|0|需要进一步测试|
|src/script/00.js:3771|t|i / sr|需要进一步测试|
|src/script/00.js:3772|step|Math.floor(t / (dur / steps))|需要进一步测试|
|src/script/00.js:3773|inStep|t - step * (dur / steps)|需要进一步测试|
|src/script/00.js:3786|buffer|selectFxBuffer('roll_loop') ／／ makeRollLoopBuffer()|需要进一步测试|
|src/script/00.js:3790|now|audioCtx.currentTime|需要进一步测试|
|src/script/00.js:3804|now|audioCtx.currentTime|需要进一步测试|
|src/script/00.js:3819|UI_DB_NAME|'PoliticsUiDB'|需要进一步测试|
|src/script/00.js:3820|uiDbPromise|null|需要进一步测试|
|src/script/00.js:3825|r|indexedDB.open(UI_DB_NAME, 1)|需要进一步测试|
|src/script/00.js:3827|d|e.target.result|需要进一步测试|
|src/script/00.js:3837|d|await uiDbOpen()|需要进一步测试|
|src/script/00.js:3841|tx|d.transaction('kv', mode)|需要进一步测试|
|src/script/00.js:3842|req|fn(tx.objectStore('kv'))|需要进一步测试|
|src/script/00.js:3849|wallpaperUrl|null|需要进一步测试|
|src/script/00.js:3851|v|Number(STORAGE.get('politics_wall_veil', 0.35))|需要进一步测试|
|src/script/00.js:3855|root|document.documentElement|需要进一步测试|
|src/script/00.js:3856|a|wallpaperUrl ? getWallVeil() : 0|需要进一步测试|
|src/script/00.js:3858|label|document.getElementById('wallVeilLabel')|需要进一步测试|
|src/script/00.js:3860|range|document.getElementById('cfgWallVeil')|需要进一步测试|
|src/script/00.js:3864|root|document.documentElement|需要进一步测试|
|src/script/00.js:3872|st|document.getElementById('wallpaperStatus')|需要进一步测试|
|src/script/00.js:3877|MAX_EDGE|2560|需要进一步测试|
|src/script/00.js:3878|img||需要进一步测试|
|src/script/00.js:3883|url|URL.createObjectURL(file)|需要进一步测试|
|src/script/00.js:3884|im|new Image()|需要进一步测试|
|src/script/00.js:3890|w0|img.width|需要进一步测试|
|src/script/00.js:3890|h0|img.height|需要进一步测试|
|src/script/00.js:3891|scale|Math.min(1, MAX_EDGE / Math.max(w0, h0))|需要进一步测试|
|src/script/00.js:3892|canvas|document.createElement('canvas')|需要进一步测试|
|src/script/00.js:3895|ctx|canvas.getContext('2d')|需要进一步测试|
|src/script/00.js:3903|file|input.files && input.files[0]|需要进一步测试|
|src/script/00.js:3909|blob|await compressWallpaper(file)|需要进一步测试|
|src/script/00.js:3911|saved|await uiDbReq('readwrite', st => st.put(blob, 'wallpaper'))|需要进一步测试|
|src/script/00.js:3928|b|await uiDbReq('readonly', st => st.get('wallpaper'))|需要进一步测试|
|src/script/00.js:3946|bar|document.getElementById('audioHintBar')|需要进一步测试|
|src/script/00.js:3958|autoPlayRetries|0|需要进一步测试|
|src/script/00.js:3959|resumeRetryTimer|null|需要进一步测试|
|src/script/00.js:3970|bar|document.getElementById('audioHintBar')|需要进一步测试|
|src/script/00.js:3978|m|document.getElementById('welcomeModal')|需要进一步测试|
|src/script/00.js:3986|unlockByGesture|() => {     getAudioContext().then(() => {       hideAudioHint();       const wm = document.getElementById('welcomeModal');       if (wm && wm.classList.contain|需要进一步测试|
|src/script/00.js:3989|wm|document.getElementById('welcomeModal')|需要进一步测试|
|src/script/00.js:4013|ITEM_DEFS|{   green:{name:'绿龟壳',icon:'🟢',kind:'attack',def:'green',charges:1,desc:'随机攻击其他小组 -1/4；可抵挡常规攻击与刺龟壳。'},   triple_green:{name:'三重绿龟壳',icon:'🟢³',kind:'attack',de|需要进一步测试|
|src/script/00.js:4044|ITEM_KEYS|Object.keys(ITEM_DEFS)|需要进一步测试|
|src/script/00.js:4048|ITEM_DEFENSE_KEYS|new Set(['green','triple_green','red','triple_red','banana','triple_banana','horn'])|需要进一步测试|
|src/script/00.js:4049|activeItemGroupId|null|需要进一步测试|
|src/script/00.js:4049|activeItemTab|'detail'|需要进一步测试|
|src/script/00.js:4049|itemDrawBusy|false|需要进一步测试|
|src/script/00.js:4049|bulletTimer|null|需要进一步测试|
|src/script/00.js:4055|seen|new Set()|需要进一步测试|
|src/script/00.js:4059|key|it&&it.key|需要进一步测试|
|src/script/00.js:4065|configuredCharges|Number.isInteger(it.configuredCharges)&&it.configuredCharges>=1&&it.configuredCharges<=99?it.configuredCharges:null|需要进一步测试|
|src/script/00.js:4066|maxCharges|configuredCharges／／Math.max(1,Number(ITEM_DEFS[it.key]?.charges)／／1)|需要进一步测试|
|src/script/00.js:4067|storedCharges|Number(it.charges)|需要进一步测试|
|src/script/00.js:4068|charges|Number.isFinite(storedCharges)         ? Math.max(1,Math.min(maxCharges,Math.trunc(storedCharges))) : maxCharges|需要进一步测试|
|src/script/00.js:4070|acquiredAt|Number(it.acquiredAt)／／Date.now()+i|需要进一步测试|
|src/script/00.js:4071|itemInstanceId|StableIdentity.isValidItemInstanceId(it.itemInstanceId)?it.itemInstanceId:StableIdentity.createItemInstanceId()|需要进一步测试|
|src/script/00.js:4072|expectedKeys|3+1+(configuredCharges?1:0)|需要进一步测试|
|src/script/00.js:4096|it|g.inventory[index]|需要进一步测试|
|src/script/00.js:4098|d|document.createElement('div')|需要进一步测试|
|src/script/00.js:4101|out|[]|需要进一步测试|
|src/script/00.js:4105|it|g.inventory[0]|需要进一步测试|
|src/script/00.js:4105|idx|0|需要进一步测试|
|src/script/00.js:4117|loss|denom===2?roundHalf(target.score):denom===3?roundThird(target.score):roundQuarter(target.score)|需要进一步测试|
|src/script/00.js:4118|base|denom===4?roundQuarter(target.score):Math.round(target.score/denom)|需要进一步测试|
|src/script/00.js:4118|add|globalThis.ItemModules?ItemModules.scoreDelta(null,base):base|需要进一步测试|
|src/script/00.js:4124|p|total<=1?1:(pos-1)/(total-1)|需要进一步测试|
|src/script/00.js:4124|virtual|1+p*23|需要进一步测试|
|src/script/00.js:4125|W|{}|需要进一步测试|
|src/script/00.js:4125|put|(k,w)=>{W[k]=w}|需要进一步测试|
|src/script/00.js:4210|arr|Object.entries(weights).filter(([,w])=>w>0)|需要进一步测试|
|src/script/00.js:4210|sum|arr.reduce((a,[,w])=>a+w,0)|需要进一步测试|
|src/script/00.js:4210|r|Math.random()*sum|需要进一步测试|
|src/script/00.js:4210|[k,w]||需要进一步测试|
|src/script/00.js:4211|r|ranking()|需要进一步测试|
|src/script/00.js:4211|pos|r.findIndex(x=>x.id===g.id)+1|需要进一步测试|
|src/script/00.js:4211|weights|itemDropWeights(pos,r.length)|需要进一步测试|
|src/script/00.js:4214|actor|state.groups.find(g=>g.id===actorId)|需要进一步测试|
|src/script/00.js:4215|after|ranking().map(g=>g.id)|需要进一步测试|
|src/script/00.js:4215|beforeIdx|beforeOrder.indexOf(actorId)|需要进一步测试|
|src/script/00.js:4215|afterIdx|after.indexOf(actorId)|需要进一步测试|
|src/script/00.js:4216|passed|beforeOrder.slice(afterIdx,beforeIdx).filter(id=>id!==actorId)|需要进一步测试|
|src/script/00.js:4217|t|state.groups.find(g=>g.id===id)|需要进一步测试|
|src/script/00.js:4221|c|document.querySelector(.group-row-card[data-group-id="${id}"])|需要进一步测试|
|src/script/00.js:4223|any|false|需要进一步测试|
|src/script/00.js:4223|t|state.groups.find(x=>x.id===g.itemEffect.targetId)|需要进一步测试|
|src/script/00.js:4223|ix|g.inventory.findIndex(x=>x.key==='bullet')|需要进一步测试|
|src/script/00.js:4225|on|(state.itemGlobal?.blooperUntil／／0)>Date.now()|需要进一步测试|
|src/script/00.js:4225|v|document.getElementById('squidVeil')|需要进一步测试|
|src/script/00.js:4228|eligible|state.groups.filter(g=>eligibleForItems(g)&&g.inventory.length<3)|需要进一步测试|
|src/script/00.js:4228|ov|document.getElementById('itemDrawOverlay')|需要进一步测试|
|src/script/00.js:4228|grid|document.getElementById('itemDrawGrid')|需要进一步测试|
|src/script/00.js:4229|timer|setInterval(()=>{eligible.forEach(g=>{const k=ITEM_KEYS[Math.floor(Math.random()*ITEM_KEYS.length)],c=grid.querySelector([data-draw-id="${g.id}"] .roulette);i|需要进一步测试|
|src/script/00.js:4229|k|ITEM_KEYS[Math.floor(Math.random()*ITEM_KEYS.length)]|需要进一步测试|
|src/script/00.js:4229|c|grid.querySelector([data-draw-id="${g.id}"] .roulette)|需要进一步测试|
|src/script/00.js:4230|key|drawItemForGroup(g)|需要进一步测试|
|src/script/00.js:4230|card|grid.querySelector([data-draw-id="${g.id}"])|需要进一步测试|
|src/script/00.js:4237|g|state.groups.find(x=>x.id===activeItemGroupId)|需要进一步测试|
|src/script/00.js:4241|body|document.getElementById('itemWindowBody')|需要进一步测试|
|src/script/00.js:4241|locked|!!state.isLocked|需要进一步测试|
|src/script/00.js:4241|disabled|locked?'disabled':''|需要进一步测试|
|src/script/00.js:4243|st|g.itemStats／／{}|需要进一步测试|
|src/script/00.js:4243|total|(st.correct／／0)+(st.wrong／／0)|需要进一步测试|
|src/script/00.js:4243|rate|total?Math.round((st.correct／／0)/total*100):0|需要进一步测试|
|src/script/00.js:4244|statusParts|[]|需要进一步测试|
|src/script/00.js:4246|type|g.itemEffect.type|需要进一步测试|
|src/script/00.js:4248|def|ITEM_DEFS[type]|需要进一步测试|
|src/script/00.js:4269|status|statusParts.length?statusParts.join(' · '):'无'|需要进一步测试|
|src/script/00.js:4309|canUse|!locked&&eligibleForItems(g)|需要进一步测试|
|src/script/00.js:4310|it|g.inventory[i]|需要进一步测试|
|src/script/00.js:4310|d|ITEM_DEFS[it.key]|需要进一步测试|
|src/script/00.js:4315|el|document.getElementById('groupDetailColorPreview')|需要进一步测试|
|src/script/00.js:4324|g|state.groups.find(x=>x.id===id)|需要进一步测试|
|src/script/00.js:4325|name|document.getElementById('groupDetailName')?.value.trim()／／''|需要进一步测试|
|src/script/00.js:4326|rawNo|document.getElementById('groupDetailNumber')?.value.trim()／／''|需要进一步测试|
|src/script/00.js:4329|groupNo|Number(rawNo)|需要进一步测试|
|src/script/00.js:4331|rawMembers|document.getElementById('groupDetailMembers')?.value／／''|需要进一步测试|
|src/script/00.js:4332|members|Array.from(new Set(rawMembers.split(/[\n,，、]+/).map(s=>s.trim()).filter(Boolean)))|需要进一步测试|
|src/script/00.js:4333|changed|g.name!==name／／Number(g.groupNo)!==groupNo／／JSON.stringify(g.members／／[])!==JSON.stringify(members)|需要进一步测试|
|src/script/00.js:4349|n|Number(document.getElementById('itemCustomScore').value)|需要进一步测试|
|src/script/00.js:4351|c|document.querySelector(.group-row-card[data-group-id="${g.id}"])|需要进一步测试|
|src/script/00.js:4351|firstDef|g.inventory.find(it=>ITEM_DEFS[it.key]?.def)|需要进一步测试|
|src/script/00.js:4351|head|c.querySelector('.card-header-row')|需要进一步测试|
|src/script/00.js:4351|slots|document.createElement('div')|需要进一步测试|
|src/script/00.js:4351|it|g.inventory[i]|需要进一步测试|
|src/script/00.js:4351|mb|c.querySelector('.more-btn')|需要进一步测试|
|src/script/00.js:4356|savedItemGlobal|STORAGE.getJSON('politics_item_global',null)|需要进一步测试|
|src/script/00.js:4365|pickerInfoTab|'history'|需要进一步测试|
|src/script/00.js:4365|handRaiseGroupId|null|需要进一步测试|
|src/script/00.js:4365|pendingItemIconKey|null|需要进一步测试|
|src/script/00.js:4374|BUILTIN_ITEM_ICONS_V2121|{"green":"@@RESOURCE:asset-000.txt@@","triple_green":"@@RESOURCE:asset-001.txt@@","red":"@@RESOURCE:asset-002.txt@@","triple_red":"@@RESOURCE:asset-003.txt@@","|需要进一步测试|
|src/script/00.js:4375|BUILTIN_ITEM_BOX_V2121|"@@RESOURCE:asset-026.txt@@"|需要进一步测试|
|src/script/00.js:4378|d|ITEM_DEFS[key]|需要进一步测试|
|src/script/00.js:4378|custom|state.itemGlobal.customIcons[key]|需要进一步测试|
|src/script/00.js:4378|builtin|BUILTIN_ITEM_ICONS_V2121[key]|需要进一步测试|
|src/script/00.js:4379|src|Reliability.safeImage(custom)／／builtin|需要进一步测试|
|src/script/00.js:4387|box|document.getElementById('pickerInfoBox')|需要进一步测试|
|src/script/00.js:4389|a|state.groups.reduce((n,g)=>n+(g.itemStats?.correct／／0)+(g.itemStats?.wrong／／0),0)|需要进一步测试|
|src/script/00.js:4392|arr|state.itemGlobal.pickerHistory／／[]|需要进一步测试|
|src/script/00.js:4395|_v2OpenPicker|openPickerModal|需要进一步测试|
|src/script/00.js:4396|el|document.getElementById('pickerScoreTarget')|需要进一步测试|
|src/script/00.js:4396|w|slotEngine.chosenResult|需要进一步测试|
|src/script/00.js:4396|g|state.picker.mode==='group'?w:w.group|需要进一步测试|
|src/script/00.js:4397|w|slotEngine.chosenResult|需要进一步测试|
|src/script/00.js:4398|g|pickerTargetGroup()|需要进一步测试|
|src/script/00.js:4399|n|Math.round(Number(document.getElementById('pickerCustomScore')?.value))|需要进一步测试|
|src/script/00.js:4404|box|document.getElementById('handGroupGrid')|需要进一步测试|
|src/script/00.js:4405|arr|[...document.querySelectorAll('.hand-group')]|需要进一步测试|
|src/script/00.js:4405|idx|state.groups.findIndex(g=>g.id===id)|需要进一步测试|
|src/script/00.js:4407|g|state.groups.find(x=>x.id===handRaiseGroupId)|需要进一步测试|
|src/script/00.js:4410|box|document.getElementById('handRewardBox')|需要进一步测试|
|src/script/00.js:4414|g|state.groups.find(x=>x.id===handRaiseGroupId)|需要进一步测试|
|src/script/00.js:4414|k|drawItemForGroup(g)|需要进一步测试|
|src/script/00.js:4415|g|state.groups.find(x=>x.id===handRaiseGroupId)|需要进一步测试|
|src/script/00.js:4419|eligible|state.groups.filter(g=>eligibleForItems(g)&&g.inventory.length<3)|需要进一步测试|
|src/script/00.js:4423|overlays|new Map()|需要进一步测试|
|src/script/00.js:4424|c|document.querySelector(.group-row-card[data-group-id="${g.id}"])|需要进一步测试|
|src/script/00.js:4424|o|document.createElement('div')|需要进一步测试|
|src/script/00.js:4425|timer|setInterval(()=>eligible.forEach(g=>{const o=overlays.get(g.id);if(!o)return;const r=ranking(),pos=r.findIndex(x=>x.id===g.id)+1;const k=weightedPick(itemDropWe|需要进一步测试|
|src/script/00.js:4425|o|overlays.get(g.id)|需要进一步测试|
|src/script/00.js:4425|r|ranking()|需要进一步测试|
|src/script/00.js:4425|pos|r.findIndex(x=>x.id===g.id)+1|需要进一步测试|
|src/script/00.js:4425|k|weightedPick(itemDropWeights(pos,r.length))|需要进一步测试|
|src/script/00.js:4426|k|drawItemForGroup(g)|需要进一步测试|
|src/script/00.js:4426|o|overlays.get(g.id)|需要进一步测试|
|src/script/00.js:4427|c|document.querySelector(.group-row-card[data-group-id="${g.id}"])|需要进一步测试|
|src/script/00.js:4434|box|document.getElementById('v2ItemEncyclopedia')|需要进一步测试|
|src/script/00.js:4435|d|ITEM_DEFS[k]|需要进一步测试|
|src/script/00.js:4438|f|e.target.files?.[0]|需要进一步测试|
|src/script/00.js:4438|rd|new FileReader()|需要进一步测试|
|src/script/00.js:4441|blob|new Blob([JSON.stringify({version:1,icons:state.itemGlobal.customIcons},null,2)],{type:'application/json'})|需要进一步测试|
|src/script/00.js:4441|a|document.createElement('a')|需要进一步测试|
|src/script/00.js:4442|f|e.target.files?.[0]|需要进一步测试|
|src/script/00.js:4442|rd|new FileReader()|需要进一步测试|
|src/script/00.js:4442|x|JSON.parse(rd.result)|需要进一步测试|
|src/script/00.js:4446|sc|document.querySelector('#view-settings .settings-scroll')|需要进一步测试|
|src/script/00.js:4447|tabs|document.createElement('div')|需要进一步测试|
|src/script/00.js:4448|item|document.createElement('div')|需要进一步测试|
|src/script/00.js:4453|sc|document.querySelector('#view-settings .settings-scroll')|需要进一步测试|
|src/script/00.js:4453|item|document.getElementById('v2ItemPane')|需要进一步测试|
|src/script/00.js:4456|titles|[...sc.querySelectorAll('.setting-section-title')]|需要进一步测试|
|src/script/00.js:4463|m|document.getElementById('aboutMain')|需要进一步测试|
|src/script/00.js:4470|_v2RenderItemWindow|renderItemWindow|需要进一步测试|
|src/script/00.js:4470|g|state.groups.find(x=>x.id===activeItemGroupId)|需要进一步测试|
|src/script/00.js:4470|body|document.getElementById('itemWindowBody')|需要进一步测试|
|src/script/00.js:4470|d|document.createElement('div')|需要进一步测试|
|src/script/00.js:4471|g|state.groups.find(x=>x.id===id)|需要进一步测试|
|src/script/00.js:4472|g|state.groups.find(x=>x.id===id)|需要进一步测试|
|src/script/00.js:4475|_v2Enhance|enhanceItemCards|需要进一步测试|
|src/script/00.js:4475|c|document.querySelector(.group-row-card[data-group-id="${g.id}"])|需要进一步测试|
|src/script/00.js:4475|it|g.inventory[i]|需要进一步测试|
|src/script/00.js:4475|charge|s.querySelector('.charges')?.outerHTML／／''|需要进一步测试|
|src/script/00.js:4476|_v2RenderItemWindowIcons|renderItemWindow|需要进一步测试|
|src/script/00.js:4476|g|state.groups.find(x=>x.id===activeItemGroupId)|需要进一步测试|
|src/script/00.js:4476|it|g.inventory[i]|需要进一步测试|
|src/script/00.js:4483|_v2SwitchView|switchView|需要进一步测试|
|src/script/00.js:4488|handItemDrawTimer|null|需要进一步测试|
|src/script/00.js:4488|handItemDrawFinishTimer|null|需要进一步测试|
|src/script/00.js:4488|handItemDrawGroupId|null|需要进一步测试|
|src/script/00.js:4488|handItemPendingKey|null|需要进一步测试|
|src/script/00.js:4488|handItemDrawStartedAt|0|需要进一步测试|
|src/script/00.js:4493|wasPending|handItemDrawGroupId!=null && handItemPendingKey==null|需要进一步测试|
|src/script/00.js:4498|_v21CloseHandRaise|closeHandRaise|需要进一步测试|
|src/script/00.js:4501|_v21SelectHandGroup|selectHandGroup|需要进一步测试|
|src/script/00.js:4507|_v21JudgeHandRaise|judgeHandRaise|需要进一步测试|
|src/script/00.js:4512|g|state.groups.find(x=>x.id===handRaiseGroupId)|需要进一步测试|
|src/script/00.js:4513|btn|[...document.querySelectorAll('#handRewardBox button')].find(b=>b.textContent.includes('抽取道具'))|需要进一步测试|
|src/script/00.js:4523|g|state.groups.find(x=>x.id===handRaiseGroupId)|需要进一步测试|
|src/script/00.js:4530|box|document.getElementById('handRewardBox')|需要进一步测试|
|src/script/00.js:4539|tick|()=>{     const live=state.groups.find(x=>x.id===handItemDrawGroupId); if(!live)return;     const r=ranking(),pos=r.findIndex(x=>x.id===live.id)+1;     const k=|需要进一步测试|
|src/script/00.js:4540|live|state.groups.find(x=>x.id===handItemDrawGroupId)|需要进一步测试|
|src/script/00.js:4541|r|ranking()|需要进一步测试|
|src/script/00.js:4541|pos|r.findIndex(x=>x.id===live.id)+1|需要进一步测试|
|src/script/00.js:4542|k|weightedPick(itemDropWeights(pos,r.length))|需要进一步测试|
|src/script/00.js:4543|cap|document.getElementById('handItemCapsule')|需要进一步测试|
|src/script/00.js:4543|name|document.getElementById('handItemDrawName')|需要进一步测试|
|src/script/00.js:4543|bar|document.getElementById('handItemProgressBar')|需要进一步测试|
|src/script/00.js:4552|live|state.groups.find(x=>x.id===handItemDrawGroupId)|需要进一步测试|
|src/script/00.js:4554|r|ranking()|需要进一步测试|
|src/script/00.js:4554|pos|r.findIndex(x=>x.id===live.id)+1|需要进一步测试|
|src/script/00.js:4555|k|weightedPick(itemDropWeights(pos,r.length))|需要进一步测试|
|src/script/00.js:4562|slot|live.inventory.findIndex(x=>x.key===k && x.acquiredAt===Math.max(...live.inventory.filter(y=>y.key===k).map(y=>y.acquiredAt)))|需要进一步测试|
|src/script/00.js:4563|box|document.getElementById('handRewardBox')|需要进一步测试|
|src/script/00.js:4578|box|document.getElementById('handRewardBox')|需要进一步测试|
|src/script/00.js:4583|gid|handItemDrawGroupId|需要进一步测试|
|src/script/00.js:4583|k|handItemPendingKey|需要进一步测试|
|src/script/00.js:4584|g|state.groups.find(x=>x.id===gid)|需要进一步测试|
|src/script/00.js:4586|idx|g.inventory.map(x=>x.key).lastIndexOf(k)|需要进一步测试|
|src/script/00.js:4592|cards|[...document.querySelectorAll('#itemWindowBody .item-card')]|需要进一步测试|
|src/script/00.js:4601|r|ranking()|需要进一步测试|
|src/script/00.js:4601|i|r.findIndex(g=>g.id===gid)|需要进一步测试|
|src/script/00.js:4601|names|[]|需要进一步测试|
|src/script/00.js:4602|add|x=>{if(x&&x.id!==gid&&!names.includes(x.name))names.push(x.name)}|需要进一步测试|
|src/script/00.js:4623|reader|new FileReader()|需要进一步测试|
|src/script/00.js:4625|img|new Image()|需要进一步测试|
|src/script/00.js:4627|size|384|需要进一步测试|
|src/script/00.js:4627|canvas|document.createElement('canvas')|需要进一步测试|
|src/script/00.js:4628|ctx|canvas.getContext('2d')|需要进一步测试|
|src/script/00.js:4629|pad|34|需要进一步测试|
|src/script/00.js:4629|max|size-pad*2|需要进一步测试|
|src/script/00.js:4630|scale|Math.min(max/img.naturalWidth,max/img.naturalHeight,1.8)|需要进一步测试|
|src/script/00.js:4631|w|Math.max(1,img.naturalWidth*scale)|需要进一步测试|
|src/script/00.js:4631|h|Math.max(1,img.naturalHeight*scale)|需要进一步测试|
|src/script/00.js:4642|f|e.target.files?.[0]|需要进一步测试|
|src/script/00.js:4653|icon|o.querySelector('.r-icon')|需要进一步测试|
|src/script/00.js:4653|name|o.querySelector('.r-name')|需要进一步测试|
|src/script/00.js:4665|eligible|state.groups.filter(g=>eligibleForItems(g)&&g.inventory.length<3)|需要进一步测试|
|src/script/00.js:4670|overlays|new Map()|需要进一步测试|
|src/script/00.js:4670|start|performance.now()|需要进一步测试|
|src/script/00.js:4670|total|3600|需要进一步测试|
|src/script/00.js:4672|c|document.querySelector(.group-row-card[data-group-id="${g.id}"])|需要进一步测试|
|src/script/00.js:4674|o|document.createElement('div')|需要进一步测试|
|src/script/00.js:4679|lastUpdate|new Map()|需要进一步测试|
|src/script/00.js:4679|currentKey|new Map()|需要进一步测试|
|src/script/00.js:4681|t|Math.min(1,(now-start)/total)|需要进一步测试|
|src/script/00.js:4683|interval|80 + 280*Math.pow(t,2.25)|需要进一步测试|
|src/script/00.js:4685|prev|lastUpdate.get(g.id)／／0|需要进一步测试|
|src/script/00.js:4688|r|ranking()|需要进一步测试|
|src/script/00.js:4688|pos|r.findIndex(x=>x.id===g.id)+1|需要进一步测试|
|src/script/00.js:4689|k|weightedPick(itemDropWeights(pos,r.length))|需要进一步测试|
|src/script/00.js:4696|r|ranking()|需要进一步测试|
|src/script/00.js:4696|pos|r.findIndex(x=>x.id===g.id)+1|需要进一步测试|
|src/script/00.js:4697|k|weightedPick(itemDropWeights(pos,r.length))|需要进一步测试|
|src/script/00.js:4698|o|overlays.get(g.id)|需要进一步测试|
|src/script/00.js:4701|hint|o.querySelector('.r-hint')|需要进一步测试|
|src/script/00.js:4707|c|document.querySelector(.group-row-card[data-group-id="${g.id}"])|需要进一步测试|
|src/script/00.js:4708|o|c.querySelector('.card-item-roulette')|需要进一步测试|
|src/script/00.js:4718|g|state.groups.find(x=>x.id===handRaiseGroupId)|需要进一步测试|
|src/script/00.js:4724|box|document.getElementById('handRewardBox')|需要进一步测试|
|src/script/00.js:4733|last|0|需要进一步测试|
|src/script/00.js:4733|raf|0|需要进一步测试|
|src/script/00.js:4733|total|3600|需要进一步测试|
|src/script/00.js:4737|t|Math.min(1,(now-handItemDrawStartedAt)/total)|需要进一步测试|
|src/script/00.js:4737|interval|80+280*Math.pow(t,2.25)|需要进一步测试|
|src/script/00.js:4738|bar|document.getElementById('handItemProgressBar')|需要进一步测试|
|src/script/00.js:4740|live|state.groups.find(x=>x.id===handItemDrawGroupId)|需要进一步测试|
|src/script/00.js:4741|r|ranking()|需要进一步测试|
|src/script/00.js:4741|pos|r.findIndex(x=>x.id===live.id)+1|需要进一步测试|
|src/script/00.js:4741|k|weightedPick(itemDropWeights(pos,r.length))|需要进一步测试|
|src/script/00.js:4742|cap|document.getElementById('handItemCapsule')|需要进一步测试|
|src/script/00.js:4742|name|document.getElementById('handItemDrawName')|需要进一步测试|
|src/script/00.js:4748|live|state.groups.find(x=>x.id===handItemDrawGroupId)|需要进一步测试|
|src/script/00.js:4750|r|ranking()|需要进一步测试|
|src/script/00.js:4750|pos|r.findIndex(x=>x.id===live.id)+1|需要进一步测试|
|src/script/00.js:4750|k|weightedPick(itemDropWeights(pos,r.length))|需要进一步测试|
|src/script/00.js:4754|slot|live.inventory.findIndex(x=>x===live.inventory[live.inventory.length-1])|需要进一步测试|
|src/script/00.js:4769|wasPending|handItemDrawGroupId!=null&&handItemPendingKey==null|需要进一步测试|
|src/script/00.js:4776|CARD_ITEM_FX_CLASS|{  green_shell:'cfx-green',triple_green:'cfx-green',  red_shell:'cfx-red',triple_red:'cfx-red',  spiny_shell:'cfx-spiny',  banana:'cfx-banana',triple_banana:'cf|需要进一步测试|
|src/script/00.js:4788|CARD_HIT_COLOR|{  green_shell:'#22c55e',triple_green:'#22c55e',red_shell:'#ef4444',triple_red:'#ef4444',  spiny_shell:'#3b82f6',banana:'#eab308',triple_banana:'#eab308',super_|需要进一步测试|
|src/script/00.js:4802|card|battleCard(gid)|需要进一步测试|
|src/script/00.js:4802|d|ITEM_DEFS[key]|需要进一步测试|
|src/script/00.js:4805|b|document.createElement('div')|需要进一步测试|
|src/script/00.js:4812|card|battleCard(id)|需要进一步测试|
|src/script/00.js:4820|r|ranking()|需要进一步测试|
|src/script/00.js:4820|i|r.findIndex(g=>g.id===gid)|需要进一步测试|
|src/script/00.js:4820|ids|[]|需要进一步测试|
|src/script/00.js:4820|add|g=>{if(g&&g.id!==gid&&!ids.includes(g.id))ids.push(g.id)}|需要进一步测试|
|src/script/00.js:4832|_v25ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/script/00.js:4837|targets|cardFxTargets(key,casterId)|需要进一步测试|
|src/script/00.js:4838|beneficial|['coin_shell','question_block'].includes(key)|需要进一步测试|
|src/script/00.js:4849|V26_HISTORY_KEY|'politics_history_stack_v26'|需要进一步测试|
|src/script/00.js:4852|hs|STORAGE.getJSON(V26_HISTORY_KEY,[])|需要进一步测试|
|src/script/00.js:4876|ITEM_FX_SOUND_SLOTS|[  {id:'item_draw_start',name:'道具抽取·启动',desc:'开始轮盘时'},  {id:'item_draw_tick',name:'道具抽取·滚动刻度',desc:'轮盘滚动过程中'},  {id:'item_draw_reveal',name:'道具抽取·定格',desc:'最终道具|需要进一步测试|
|src/script/00.js:4888|box|document.getElementById('itemFxSoundListV26')|需要进一步测试|
|src/script/00.js:4890|custom|!!customFxBuffers[s.id]／／hasSound('fx_'+s.id)|需要进一步测试|
|src/script/00.js:4900|_v26ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/script/00.js:4902|_v26TinyDefense|tinyDefenseToast|需要进一步测试|
|src/script/00.js:4905|n|0|需要进一步测试|
|src/script/00.js:4906|timer|setInterval(()=>{if(n++<13)playSound('item_draw_tick');else clearInterval(timer)},Math.max(150,ms/15))|需要进一步测试|
|src/script/00.js:4909|_v26GlobalDraw|globalItemDraw|需要进一步测试|
|src/script/00.js:4910|_v26HandDraw|handDrawItem|需要进一步测试|
|src/script/00.js:4913|UI_ICON_TARGETS|[  ['nav_welcome','欢迎','[data-view="welcome"]','🏠'],['nav_battle','比赛','[data-view="battle"]','⚔️'],  ['nav_history','历史','[data-view="history"]','📜'],['nav_a|需要进一步测试|
|src/script/00.js:4922|pendingUiIconV26|null|需要进一步测试|
|src/script/00.js:4925|map|uiIconsV26()|需要进一步测试|
|src/script/00.js:4927|el|document.querySelector(sel)|需要进一步测试|
|src/script/00.js:4929|data|Reliability.safeImage(map[id])|需要进一步测试|
|src/script/00.js:4931|template|document.createElement('template')|需要进一步测试|
|src/script/00.js:4933|text|template.innerHTML.trim()／／escapeHtml(label)|需要进一步测试|
|src/script/00.js:4940|f|document.getElementById('uiIconInputV26')|需要进一步测试|
|src/script/00.js:4942|f|e.target.files?.[0]|需要进一步测试|
|src/script/00.js:4943|m|uiIconsV26()|需要进一步测试|
|src/script/00.js:4945|m|uiIconsV26()|需要进一步测试|
|src/script/00.js:4947|box|document.getElementById('uiIconManagerV26')|需要进一步测试|
|src/script/00.js:4947|m|uiIconsV26()|需要进一步测试|
|src/script/00.js:4953|sc|document.querySelector('#view-settings .settings-scroll')|需要进一步测试|
|src/script/00.js:4958|original|[...sc.children]|需要进一步测试|
|src/script/00.js:4959|panes|{function:document.createElement('div'),sound:document.createElement('div'),data:document.createElement('div'),items:document.createElement('div')}|需要进一步测试|
|src/script/00.js:4961|mode|'function'|需要进一步测试|
|src/script/00.js:4963|txt|el.textContent／／''|需要进一步测试|
|src/script/00.js:4968|tabs|document.createElement('div')|需要进一步测试|
|src/script/00.js:4972|ui|document.createElement('div')|需要进一步测试|
|src/script/00.js:4973|item|document.createElement('div')|需要进一步测试|
|src/script/00.js:4974|fx|document.createElement('div')|需要进一步测试|
|src/script/00.js:4975|hidden|document.createElement('input')|需要进一步测试|
|src/script/00.js:4982|sc|document.querySelector('#view-settings .settings-scroll')|需要进一步测试|
|src/script/00.js:4993|sub|document.querySelector('#view-settings .fullview-sub')|需要进一步测试|
|src/script/00.js:5001|h|(window.visualViewport&&window.visualViewport.height)／／window.innerHeight|需要进一步测试|
|src/script/00.js:5026|programConfirmResolveV28|null|需要进一步测试|
|src/script/00.js:5029|previous|document.getElementById('programConfirmV28')|需要进一步测试|
|src/script/00.js:5033|o|document.createElement('div')|需要进一步测试|
|src/script/00.js:5046|settled|false|需要进一步测试|
|src/script/00.js:5047|finish|v=>{if(settled／／!o.isConnected)return;settled=true;document.removeEventListener('keydown',key);hideClassroomWindow(o,()=>o.remove());programConfirmResolveV28=nu|需要进一步测试|
|src/script/00.js:5051|key|e=>{if(!o.isConnected){document.removeEventListener('keydown',key);return}if(e.key==='Escape'){document.removeEventListener('keydown',key);finish(false)}else if|需要进一步测试|
|src/script/00.js:5073|filtered|{}|需要进一步测试|
|src/script/00.js:5075|n|Number(w)／／0|需要进一步测试|
|src/script/00.js:5082|r|ranking()|需要进一步测试|
|src/script/00.js:5082|pos|Math.max(1,r.findIndex(x=>x.id===g.id)+1)|需要进一步测试|
|src/script/00.js:5083|weights|itemDropWeights(pos,r.length)|需要进一步测试|
|src/script/00.js:5084|held|heldItemKeysV281(g)|需要进一步测试|
|src/script/00.js:5087|k|weightedPickNoRepeatV281(weights,new Set([...batchUsed,...held]))|需要进一步测试|
|src/script/00.js:5098|eligible|state.groups.filter(g=>eligibleForItems(g)&&g.inventory.length<3)|需要进一步测试|
|src/script/00.js:5103|overlays|new Map()|需要进一步测试|
|src/script/00.js:5103|start|performance.now()|需要进一步测试|
|src/script/00.js:5103|total|3600|需要进一步测试|
|src/script/00.js:5105|c|document.querySelector(.group-row-card[data-group-id="${g.id}"])|需要进一步测试|
|src/script/00.js:5107|o|document.createElement('div')|需要进一步测试|
|src/script/00.js:5112|lastUpdate|new Map()|需要进一步测试|
|src/script/00.js:5114|t|Math.min(1,(now-start)/total)|需要进一步测试|
|src/script/00.js:5114|interval|80+280*Math.pow(t,2.25)|需要进一步测试|
|src/script/00.js:5116|prev|lastUpdate.get(g.id)／／0|需要进一步测试|
|src/script/00.js:5119|k|pickItemForGroupV281(g,new Set())|需要进一步测试|
|src/script/00.js:5125|batchUsed|new Set()|需要进一步测试|
|src/script/00.js:5127|k|pickItemForGroupV281(g,batchUsed)|需要进一步测试|
|src/script/00.js:5131|o|overlays.get(g.id)|需要进一步测试|
|src/script/00.js:5134|hint|o.querySelector('.r-hint')|需要进一步测试|
|src/script/00.js:5141|c|document.querySelector(.group-row-card[data-group-id="${g.id}"])|需要进一步测试|
|src/script/00.js:5143|o|c.querySelector('.card-item-roulette')|需要进一步测试|
|src/script/00.js:5156|g|state.groups.find(x=>x.id===handRaiseGroupId)|需要进一步测试|
|src/script/00.js:5162|box|document.getElementById('handRewardBox')|需要进一步测试|
|src/script/00.js:5170|last|0|需要进一步测试|
|src/script/00.js:5170|total|3600|需要进一步测试|
|src/script/00.js:5173|t|Math.min(1,(now-handItemDrawStartedAt)/total)|需要进一步测试|
|src/script/00.js:5173|interval|80+280*Math.pow(t,2.25)|需要进一步测试|
|src/script/00.js:5174|bar|document.getElementById('handItemProgressBar')|需要进一步测试|
|src/script/00.js:5176|live|state.groups.find(x=>x.id===handItemDrawGroupId)|需要进一步测试|
|src/script/00.js:5177|k|pickItemForGroupV281(live,new Set())|需要进一步测试|
|src/script/00.js:5178|cap|document.getElementById('handItemCapsule')|需要进一步测试|
|src/script/00.js:5178|name|document.getElementById('handItemDrawName')|需要进一步测试|
|src/script/00.js:5185|live|state.groups.find(x=>x.id===handItemDrawGroupId)|需要进一步测试|
|src/script/00.js:5187|k|pickItemForGroupV281(live,new Set())|需要进一步测试|
|src/script/00.js:5191|slot|live.inventory.length-1|需要进一步测试|
|src/script/00.js:5223|arr|state.groups.filter(g=>g.id!==caster.id && Number(g.score)>=0)|需要进一步测试|
|src/script/00.js:5228|amount|Math.round(Math.max(0,Number(target.score)／／0)*frac)|需要进一步测试|
|src/script/00.js:5237|it|g.inventory[index]|需要进一步测试|
|src/script/00.js:5257|keys|Object.keys(ITEM_DEFS)|需要进一步测试|
|src/script/00.js:5268|eligible|state.groups.filter(g=>eligibleForItems(g)&&g.inventory.length<3)|需要进一步测试|
|src/script/00.js:5273|overlays|new Map()|需要进一步测试|
|src/script/00.js:5273|start|performance.now()|需要进一步测试|
|src/script/00.js:5273|total|3600|需要进一步测试|
|src/script/00.js:5275|c|document.querySelector(.group-row-card[data-group-id="${g.id}"])|需要进一步测试|
|src/script/00.js:5277|o|document.createElement('div')|需要进一步测试|
|src/script/00.js:5281|lastUpdate|new Map()|需要进一步测试|
|src/script/00.js:5283|t|Math.min(1,(now-start)/total)|需要进一步测试|
|src/script/00.js:5283|interval|72+300*Math.pow(t,2.35)|需要进一步测试|
|src/script/00.js:5285|prev|lastUpdate.get(g.id)／／0|需要进一步测试|
|src/script/00.js:5293|batchUsed|new Set()|需要进一步测试|
|src/script/00.js:5295|k|pickItemForGroupV281(g,batchUsed)|需要进一步测试|
|src/script/00.js:5298|o|overlays.get(g.id)|需要进一步测试|
|src/script/00.js:5299|h|o.querySelector('.r-hint')|需要进一步测试|
|src/script/00.js:5305|c|document.querySelector(.group-row-card[data-group-id="${g.id}"])|需要进一步测试|
|src/script/00.js:5306|o|c.querySelector('.card-item-roulette')|需要进一步测试|
|src/script/00.js:5316|g|state.groups.find(x=>x.id===handRaiseGroupId)|需要进一步测试|
|src/script/00.js:5321|box|document.getElementById('handRewardBox')|需要进一步测试|
|src/script/00.js:5328|last|0|需要进一步测试|
|src/script/00.js:5328|total|3600|需要进一步测试|
|src/script/00.js:5331|t|Math.min(1,(now-handItemDrawStartedAt)/total)|需要进一步测试|
|src/script/00.js:5331|interval|72+300*Math.pow(t,2.35)|需要进一步测试|
|src/script/00.js:5332|bar|document.getElementById('handItemProgressBar')|需要进一步测试|
|src/script/00.js:5334|k|roulettePreviewPickV282()|需要进一步测试|
|src/script/00.js:5335|cap|document.getElementById('handItemCapsule')|需要进一步测试|
|src/script/00.js:5335|name|document.getElementById('handItemDrawName')|需要进一步测试|
|src/script/00.js:5341|live|state.groups.find(x=>x.id===handItemDrawGroupId)|需要进一步测试|
|src/script/00.js:5343|k|pickItemForGroupV281(live,new Set())|需要进一步测试|
|src/script/00.js:5347|slot|live.inventory.length-1|需要进一步测试|
|src/script/00.js:5364|ITEM_ORDER_V283|[  'green','triple_green','red','triple_red','spiny',  'banana','triple_banana','horn','bobomb','hammer',  'coin','coin_shell','question','mushroom','triple_mus|需要进一步测试|
|src/script/00.js:5377|d|ITEM_DEFS[k]|需要进一步测试|
|src/script/00.js:5381|g|state.groups.find(x=>x.id===gid)|需要进一步测试|
|src/script/00.js:5390|g|state.groups.find(x=>x.id===gid)|需要进一步测试|
|src/script/00.js:5391|roots|[...document.querySelectorAll('.god-item-manager,.item-god-manager,.god-item-grid')]|需要进一步测试|
|src/script/00.js:5392|root|roots.find(x=>x.closest('.modal,.group-modal,.vista-window'))／／roots[0]|需要进一步测试|
|src/script/00.js:5394|tactical|document.querySelector('.group-modal .tactical-tab-content,.group-modal [data-tab-content="items"],#groupModal .tactical-items')|需要进一步测试|
|src/script/00.js:5403|all|[...document.querySelectorAll('body *')]|需要进一步测试|
|src/script/00.js:5404|title|all.find(el=>el.children.length===0 && /上帝模式.*强制道具管理/.test(el.textContent／／''))|需要进一步测试|
|src/script/00.js:5406|box|title.nextElementSibling|需要进一步测试|
|src/script/00.js:5415|headings|[...document.querySelectorAll('h1,h2,h3,.about-title,.section-title')]|需要进一步测试|
|src/script/00.js:5416|h|headings.find(x=>/22\s*种道具百科／26\s*种道具百科/.test(x.textContent／／''))|需要进一步测试|
|src/script/00.js:5419|host|h.nextElementSibling|需要进一步测试|
|src/script/00.js:5422|parent|h.parentElement|需要进一步测试|
|src/script/00.js:5423|candidates|[...parent.children]|需要进一步测试|
|src/script/00.js:5424|start|candidates.indexOf(h)+1|需要进一步测试|
|src/script/00.js:5425|cards|candidates.slice(start).filter(x=>x.matches?.('.guide-block,.item-guide-card,.about-item-card,.encyclopedia-item') ／／ x.querySelector?.('b,strong'))|需要进一步测试|
|src/script/00.js:5429|d|ITEM_DEFS[k]|需要进一步测试|
|src/script/00.js:5429|card|document.createElement('div')|需要进一步测试|
|src/script/00.js:5436|d|ITEM_DEFS[k]|需要进一步测试|
|src/script/00.js:5445|existingText|document.body.innerText／／''|需要进一步测试|
|src/script/00.js:5446|about|document.querySelector('#aboutModal,.about-modal,#aboutWindow,.about-window')／／document.body|需要进一步测试|
|src/script/00.js:5447|title|[...about.querySelectorAll('h1,h2,h3')].find(x=>/26\s*种道具百科/.test(x.textContent／／''))|需要进一步测试|
|src/script/00.js:5449|parent|title.parentElement|需要进一步测试|
|src/script/00.js:5451|d|ITEM_DEFS[k]|需要进一步测试|
|src/script/00.js:5453|card|document.createElement('div')|需要进一步测试|
|src/script/00.js:5461|setting|document.querySelector('#view-settings')／／document|需要进一步测试|
|src/script/00.js:5462|labels|[...setting.querySelectorAll('*')].filter(x=>x.children.length===0 && /道具.*图标／自定义道具/.test(x.textContent／／''))|需要进一步测试|
|src/script/00.js:5463|anchor|labels[0]|需要进一步测试|
|src/script/00.js:5465|region|anchor.parentElement?.parentElement／／anchor.parentElement|需要进一步测试|
|src/script/00.js:5467|txt|region.innerText／／''|需要进一步测试|
|src/script/00.js:5469|d|ITEM_DEFS[k]|需要进一步测试|
|src/script/00.js:5470|row|document.createElement('div')|需要进一步测试|
|src/script/00.js:5482|_v283OpenGroupModal|openGroupModal|需要进一步测试|
|src/script/00.js:5483|r|_v283OpenGroupModal.call(this,gid,...a)|需要进一步测试|
|src/script/00.js:5486|_v283RenderGroupModal|renderGroupModal|需要进一步测试|
|src/script/00.js:5487|r|_v283RenderGroupModal.apply(this,a)|需要进一步测试|
|src/script/00.js:5487|gid|state.activeModalGroupId／／activeEditingGroupId|需要进一步测试|
|src/script/00.js:5491|_v283OpenAbout|typeof openAboutModal==='function'?openAboutModal:null|需要进一步测试|
|src/script/00.js:5492|r|_v283OpenAbout.apply(this,a)|需要进一步测试|
|src/script/00.js:5528|_v284RenderAbout|renderAbout|需要进一步测试|
|src/script/00.js:5530|r|_v284RenderAbout(tab)|需要进一步测试|
|src/script/00.js:5532|m|document.getElementById('aboutMain')|需要进一步测试|
|src/script/00.js:5535|txt|m.innerText／／''|需要进一步测试|
|src/script/00.js:5537|d|ITEM_DEFS[k]|需要进一步测试|
|src/script/00.js:5539|el|document.createElement('div')|需要进一步测试|
|src/script/00.js:5553|COMMUNISM_MODE_KEY|'politics_communism_mode'|需要进一步测试|
|src/script/00.js:5563|on|isCommunismMode()|需要进一步测试|
|src/script/00.js:5568|t|(el.textContent／／'').trim()|需要进一步测试|
|src/script/00.js:5569|oc|el.getAttribute('onclick')／／''|需要进一步测试|
|src/script/00.js:5570|itemOnly|/道具抽取／抽取道具／道具百科／道具与图标/.test(t) ／／       /globalItemDraw／openItemEncyclopedia/.test(oc)|需要进一步测试|
|src/script/00.js:5586|_v291GlobalItemDraw|globalItemDraw|需要进一步测试|
|src/script/00.js:5594|_v291OpenItemWindow|openItemWindow|需要进一步测试|
|src/script/00.js:5614|n|Number(value)／／0|需要进一步测试|
|src/script/00.js:5615|abs|Math.abs(n)|需要进一步测试|
|src/script/00.js:5618|sign|n<0?'-':''|需要进一步测试|
|src/script/00.js:5619|a|Math.abs(n)|需要进一步测试|
|src/script/00.js:5621|v|a/100000000|需要进一步测试|
|src/script/00.js:5624|v|a/10000|需要进一步测试|
|src/script/00.js:5707|card|battleCard(groupId)|需要进一步测试|
|src/script/00.js:5712|cls|attackHitClassV2116(key)|需要进一步测试|
|src/script/00.js:5718|badge|document.createElement('div')|需要进一步测试|
|src/script/00.js:5720|d|ITEM_DEFS[key]|需要进一步测试|
|src/script/00.js:5747|type|target?.itemEffect?.type|需要进一步测试|
|src/script/00.js:5750|name|ITEM_DEFS[type]?.name／／'持续状态'|需要进一步测试|
|src/script/00.js:5755|ix|target.inventory.findIndex(x=>x.key===type)|需要进一步测试|
|src/script/00.js:5771|before|Number(target.score)／／0|需要进一步测试|
|src/script/00.js:5789|_v2116ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/script/00.js:5801|sample|itemDropWeights(12,24)|需要进一步测试|
|src/script/00.js:5802|missing|Object.keys(ITEM_DEFS).filter(k=>!(k in sample))|需要进一步测试|
|src/script/00.js:5819|main|it／／g?.inventory?.[0]|需要进一步测试|
|src/script/00.js:5829|it|g?.inventory?.[index]|需要进一步测试|
|src/script/00.js:5835|reason|Reliability.validateItem(state,g,index,isCommunismMode())|需要进一步测试|
|src/script/00.js:5847|g|state.groups.find(x=>x.id===gid)|需要进一步测试|
|src/script/00.js:5854|role|g.inventory.length===1?'主要道具':'次要道具'|需要进一步测试|
|src/script/00.js:5859|g|state.groups.find(x=>x.id===gid)|需要进一步测试|
|src/script/00.js:5871|_v2120RenderItemWindow|renderItemWindow|需要进一步测试|
|src/script/00.js:5874|g|state.groups.find(x=>x.id===activeItemGroupId)|需要进一步测试|
|src/script/00.js:5875|body|document.getElementById('itemWindowBody')|需要进一步测试|
|src/script/00.js:5878|cards|[0,1,2].map(i=>{     const it=g.inventory[i];     const role=queueRoleTextV2120(i);     if(!it){       return <div class="item-big queue-item-card ${i===0?'que|需要进一步测试|
|src/script/00.js:5879|it|g.inventory[i]|需要进一步测试|
|src/script/00.js:5880|role|queueRoleTextV2120(i)|需要进一步测试|
|src/script/00.js:5889|d|ITEM_DEFS[it.key]|需要进一步测试|
|src/script/00.js:5890|st|queueUseStateV2120(g,i)|需要进一步测试|
|src/script/00.js:5891|active|isQueuePersistentActiveV2120(g,it)|需要进一步测试|
|src/script/00.js:5911|admin|document.createElement('div')|需要进一步测试|
|src/script/00.js:5923|_v2120EnhanceItemCards|enhanceItemCards|需要进一步测试|
|src/script/00.js:5924|queueMainVisualCacheV2120|new Map()|需要进一步测试|
|src/script/00.js:5928|card|document.querySelector(.group-row-card[data-group-id="${g.id}"])|需要进一步测试|
|src/script/00.js:5933|main|g.inventory?.[0]|需要进一步测试|
|src/script/00.js:5936|slots|[...card.querySelectorAll('.item-slot')]|需要进一步测试|
|src/script/00.js:5938|slot|slots[i]|需要进一步测试|
|src/script/00.js:5939|it|g.inventory[i]|需要进一步测试|
|src/script/00.js:5942|active|isQueuePersistentActiveV2120(g,it)|需要进一步测试|
|src/script/00.js:5952|currentMain|main?${main.key}:${main.acquiredAt／／0}:''|需要进一步测试|
|src/script/00.js:5953|prev|queueMainVisualCacheV2120.get(g.id)|需要进一步测试|
|src/script/00.js:5963|_v2120HandUseNewItem|handUseNewItem|需要进一步测试|
|src/script/00.js:5965|gid|handItemDrawGroupId|需要进一步测试|
|src/script/00.js:5966|g|state.groups.find(x=>x.id===gid)|需要进一步测试|
|src/script/01.js:4|v213ForceRankSort|false|需要进一步测试|
|src/script/01.js:5|v213ItemSortBusy|false|需要进一步测试|
|src/script/01.js:6|v213SkipNextReorderAnimation|false|需要进一步测试|
|src/script/01.js:7|v213SuppressReorderAnimation|false|需要进一步测试|
|src/script/01.js:8|V213_CARD_REORDER_MS|750|需要进一步测试|
|src/script/01.js:9|V213_CARD_REORDER_SETTLE_MS|790|需要进一步测试|
|src/script/01.js:12|used|new Set()|需要进一步测试|
|src/script/01.js:13|maxNo|0|需要进一步测试|
|src/script/01.js:13|changed|false|需要进一步测试|
|src/script/01.js:15|n|Number.parseInt(g.groupNo,10)|需要进一步测试|
|src/script/01.js:28|n|Math.max(1,Number.parseInt(g?.groupNo,10)／／1)|需要进一步测试|
|src/script/01.js:38|box|document.getElementById('v2ItemEncyclopedia')|需要进一步测试|
|src/script/01.js:43|d|ITEM_DEFS[k]|需要进一步测试|
|src/script/01.js:55|_v213Batch|applySettingsBatchMembers|需要进一步测试|
|src/script/01.js:57|oldNums|new Map(state.groups.map(g=>[g.id,g.groupNo]))|需要进一步测试|
|src/script/01.js:58|r|_v213Batch.apply(this,a)|需要进一步测试|
|src/script/02.js:6|r|ranking()|需要进一步测试|
|src/script/02.js:7|i|r.findIndex(g=>g.id===id)|需要进一步测试|
|src/script/02.js:18|m|document.getElementById('aboutMain')|需要进一步测试|
|src/script/02.js:24|d|ITEM_DEFS[k]|需要进一步测试|
|src/script/02.js:32|box|document.getElementById('handGroupGrid')|需要进一步测试|
|src/script/02.js:34|reward|document.getElementById('handRewardBox')|需要进一步测试|
|src/script/02.js:37|g|state.groups.find(x=>x.id===id)|需要进一步测试|
|src/script/02.js:38|b|document.querySelector(#handGroupGrid .hand-group[data-group-id="${id}"] small)|需要进一步测试|
|src/script/02.js:43|id|handRaiseGroupId|需要进一步测试|
|src/script/02.js:50|box|document.getElementById('handRewardBox')|需要进一步测试|
|src/script/02.js:51|g|state.groups.find(x=>x.id===handRaiseGroupId)|需要进一步测试|
|src/script/02.js:52|main|g.inventory?.[0]|需要进一步测试|
|src/script/02.js:53|useText|main?使用：${ITEM_DEFS[main.key]?.name／／'当前主要道具'}:'使用：无主要道具'|需要进一步测试|
|src/script/02.js:54|drawDisabled|!eligibleForItems(g)／／g.inventory.length>=3|需要进一步测试|
|src/script/02.js:55|useDisabled|!main／／!eligibleForItems(g)|需要进一步测试|
|src/script/02.js:58|_v214JudgeHandRaise|judgeHandRaise|需要进一步测试|
|src/script/02.js:64|g|state.groups.find(x=>x.id===handRaiseGroupId)|需要进一步测试|
|src/script/02.js:65|main|g.inventory?.[0]|需要进一步测试|
|src/script/02.js:67|gid|g.id|需要进一步测试|
|src/script/03.js:12|oldSwitchV216|switchView|需要进一步测试|
|src/script/03.js:14|r|oldSwitchV216.call(this,name)|需要进一步测试|
|src/script/03.js:24|d|ITEM_DEFS?.[key]|需要进一步测试|
|src/script/03.js:41|special|['coin_shell','question','question_block','boo']|需要进一步测试|
|src/script/03.js:43|heal|['coin_shell','question','question_block'].includes(key)|需要进一步测试|
|src/script/03.js:51|caster|state.groups?.find(g=>g.id===casterId)|需要进一步测试|
|src/script/03.js:52|banner|document.createElement('div')|需要进一步测试|
|src/script/03.js:56|remove|()=>banner.isConnected&&banner.remove()|需要进一步测试|
|src/script/04.js:19|ITEM_SOUND_IDS_V2164|new Set([   'item_draw_start','item_draw_tick','item_draw_reveal',   'item_use','item_attack','item_defend','item_buff','item_status','item_steal' ])|需要进一步测试|
|src/script/04.js:26|osc|audioCtx.createOscillator()|需要进一步测试|
|src/script/04.js:27|gain|audioCtx.createGain()|需要进一步测试|
|src/script/04.js:43|now|audioCtx.currentTime + .005|需要进一步测试|
|src/script/04.js:94|_v2164PlaySoundBase|playSound|需要进一步测试|
|src/script/04.js:107|custom|customFxBuffers?.[slotId]|需要进一步测试|
|src/script/04.js:109|source|audioCtx.createBufferSource()|需要进一步测试|
|src/script/04.js:130|n|0|需要进一步测试|
|src/script/04.js:131|interval|Math.max(150, ms / 15)|需要进一步测试|
|src/script/04.js:132|timer|setInterval(() => {     if (n++ < 13) playSound('item_draw_tick');     else clearInterval(timer);   }, interval)|需要进一步测试|
|src/script/04.js:143|_v2164GlobalItemDraw|globalItemDraw|需要进一步测试|
|src/script/04.js:145|canStart|!itemDrawBusy &&       state.groups.some(g => eligibleForItems(g) && Array.isArray(g.inventory) && g.inventory.length < 3) &&       (typeof isCommunismMode !== |需要进一步测试|
|src/script/04.js:154|_v2164HandDrawItem|handDrawItem|需要进一步测试|
|src/script/04.js:156|g|state.groups.find(x => x.id === handRaiseGroupId)|需要进一步测试|
|src/script/04.js:157|canStart|!!g && !handItemDrawTimer &&       eligibleForItems(g) && Array.isArray(g.inventory) && g.inventory.length < 3|需要进一步测试|
|src/script/05.js:4|BASIC_DEFENSE_KEYS_V2170|new Set([   'green','triple_green',   'red','triple_red',   'banana','triple_banana',   'bomb' ])|需要进一步测试|
|src/script/05.js:10|SHELL_ATTACK_KEYS_V2170|new Set([   'green','triple_green','red','triple_red' ])|需要进一步测试|
|src/script/05.js:32|r|ranking()|需要进一步测试|
|src/script/05.js:33|i|r.findIndex(x=>x.id===holder.id)|需要进一步测试|
|src/script/05.js:35|targets|[r[i-1],r[i+1]].filter(t=>t && t.id!==holder.id && eligibleForItems(t))|需要进一步测试|
|src/script/05.js:43|loss|roundQuarter(t.score)|需要进一步测试|
|src/script/05.js:52|main|target?.inventory?.[0]|需要进一步测试|
|src/script/05.js:55|destroyedKey|main.key|需要进一步测试|
|src/script/05.js:57|name|ITEM_DEFS[destroyedKey]?.name／／'基础防御道具'|需要进一步测试|
|src/script/05.js:83|actor|state.groups.find(g=>g.id===actorId)|需要进一步测试|
|src/script/05.js:86|after|ranking().map(g=>g.id)|需要进一步测试|
|src/script/05.js:87|beforeIdx|beforeOrder.indexOf(actorId)|需要进一步测试|
|src/script/05.js:87|afterIdx|after.indexOf(actorId)|需要进一步测试|
|src/script/05.js:90|passed|beforeOrder.slice(afterIdx,beforeIdx).filter(id=>id!==actorId)|需要进一步测试|
|src/script/05.js:92|t|state.groups.find(g=>g.id===id)|需要进一步测试|
|src/script/05.js:111|main|it／／g?.inventory?.[0]|需要进一步测试|
|src/script/05.js:125|type|target?.itemEffect?.type|需要进一步测试|
|src/script/05.js:128|name|ITEM_DEFS[type]?.name／／'持续状态'|需要进一步测试|
|src/script/05.js:132|ix|target.inventory.findIndex(x=>x.key==='mega')|需要进一步测试|
|src/script/05.js:143|_v2170RenderAboutFallback|renderAbout|需要进一步测试|
|src/script/05.js:146|m|document.getElementById('aboutMain')|需要进一步测试|
|src/script/05.js:162|d|ITEM_DEFS[k]|需要进一步测试|
|src/script/06.js:7|activeDrawSourcesV2171|new Set()|需要进一步测试|
|src/script/06.js:8|drawTickTimerV2171|null|需要进一步测试|
|src/script/06.js:9|drawRevealTimerV2171|null|需要进一步测试|
|src/script/06.js:10|drawAudioGenerationV2171|0|需要进一步测试|
|src/script/06.js:43|custom|customFxBuffers?.[slotId]|需要进一步测试|
|src/script/06.js:45|source|audioCtx.createBufferSource()|需要进一步测试|
|src/script/06.js:86|generation|++drawAudioGenerationV2171|需要进一步测试|
|src/script/06.js:87|duration|3000|需要进一步测试|
|src/script/06.js:91|tickCount|0|需要进一步测试|
|src/script/06.js:92|tickInterval|Math.max(150,duration/15)|需要进一步测试|
|src/script/06.js:115|_v2171CancelHandItemDraw|cancelHandItemDraw|需要进一步测试|
|src/script/07.js:22|safeTotal|Math.max(1,Number(total)／／1)|需要进一步测试|
|src/script/07.js:23|safePos|Math.max(1,Math.min(safeTotal,Number(pos)／／1))|需要进一步测试|
|src/script/07.js:24|lastCount|Math.max(1,Math.ceil(safeTotal*0.30))|需要进一步测试|
|src/script/07.js:25|lastStart|safeTotal-lastCount+1|需要进一步测试|
|src/script/07.js:40|band|itemRankBandV2172(pos,total)|需要进一步测试|
|src/script/07.js:41|W|{}|需要进一步测试|
|src/script/07.js:42|put|(k,w)=>{W[k]=Math.max(0,Number(w)／／0)}|需要进一步测试|
|src/script/07.js:87|midProgress|total<=1?0:(pos-1)/(total-1)|需要进一步测试|
|src/script/07.js:151|_v2172AddItemToGroup|addItemToGroup|需要进一步测试|
|src/script/07.js:167|held|state.groups.reduce((n,g)=>n+(Array.isArray(g.inventory)?g.inventory.length:0),0)|需要进一步测试|
|src/script/07.js:168|active|state.groups.filter(g=>g.itemEffect ／／ Number(g.booShield／／0)>0).length|需要进一步测试|
|src/script/07.js:169|blooperActive|Number(state.itemGlobal?.blooperUntil／／0)>Date.now()|需要进一步测试|
|src/script/07.js:205|pane|document.getElementById('settingsV26_data')|需要进一步测试|
|src/script/07.js:208|section|document.createElement('div')|需要进一步测试|
|src/script/07.js:224|_v2172RebuildSettingsV26|rebuildSettingsV26|需要进一步测试|
|src/script/07.js:226|r|_v2172RebuildSettingsV26.apply(this,args)|需要进一步测试|
|src/script/07.js:232|_v2172ShowSettingsV26|showSettingsV26|需要进一步测试|
|src/script/07.js:234|r|_v2172ShowSettingsV26.call(this,which,...args)|需要进一步测试|
|src/script/08.js:5|safeTotal|Math.max(1,Number(total)／／1)|需要进一步测试|
|src/script/08.js:6|safePos|Math.max(1,Math.min(safeTotal,Number(pos)／／1))|需要进一步测试|
|src/script/08.js:7|band|itemRankBandV2172(safePos,safeTotal)|需要进一步测试|
|src/script/08.js:11|topHalfEnd|Math.ceil(safeTotal*0.50)|需要进一步测试|
|src/script/08.js:12|inTopHalf|safePos<=topHalfEnd|需要进一步测试|
|src/script/08.js:14|W|{}|需要进一步测试|
|src/script/08.js:15|put|(k,w)=>{W[k]=Math.max(0,Number(w)／／0)}|需要进一步测试|
|src/script/08.js:66|midProgress|safeTotal<=1?0:(safePos-1)/(safeTotal-1)|需要进一步测试|
|src/script/09.js:6|PER_ITEM_SOUND_IDS_V2174|new Set(   ITEM_KEYS.map(k=>item_${k}) )|需要进一步测试|
|src/script/09.js:10|GENERIC_ITEM_USE_SOUNDS_V2174|new Set([   'item_use','item_attack','item_buff','item_status','item_steal' ])|需要进一步测试|
|src/script/09.js:19|idx|Math.max(0,ITEM_KEYS.indexOf(key))|需要进一步测试|
|src/script/09.js:20|now|audioCtx.currentTime+.005|需要进一步测试|
|src/script/09.js:21|kind|ITEM_DEFS[key]?.kind／／'tactic'|需要进一步测试|
|src/script/09.js:23|base|180 + (idx%13)*36|需要进一步测试|
|src/script/09.js:24|octave|(idx%2)?1.5:1|需要进一步测试|
|src/script/09.js:25|f1|base*octave|需要进一步测试|
|src/script/09.js:26|f2|f1*(1.25 + (idx%4)*.08)|需要进一步测试|
|src/script/09.js:28|tone|(freq,t,dur,type='triangle',gain=.075,endFreq=null)=>{     try{       const osc=audioCtx.createOscillator();       const g=audioCtx.createGain();       osc.type|需要进一步测试|
|src/script/09.js:30|osc|audioCtx.createOscillator()|需要进一步测试|
|src/script/09.js:31|g|audioCtx.createGain()|需要进一步测试|
|src/script/09.js:66|_v2174PlaySound|playSound|需要进一步测试|
|src/script/09.js:80|custom|selectFxBuffer(slotId)|需要进一步测试|
|src/script/09.js:82|source|audioCtx.createBufferSource()|需要进一步测试|
|src/script/09.js:105|_v2174ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/script/09.js:117|box|document.getElementById('itemFxSoundListV26')|需要进一步测试|
|src/script/09.js:120|common|[     {id:'item_draw_start',name:'道具抽取 · 启动',desc:'所有道具共用'},     {id:'item_draw_tick',name:'道具抽取 · 滚动刻度',desc:'所有道具共用'},     {id:'item_draw_reveal',name:'道具抽取 ·|需要进一步测试|
|src/script/09.js:127|rowHtml|(id,name,desc,visual='')=>{     const custom=!!customFxBuffers[id] ／／ !!customFxVariants[id]?.length ／／ hasSound('fx_'+id);     const itemClass=visual?' v2174-i|需要进一步测试|
|src/script/09.js:128|custom|!!customFxBuffers[id] ／／ !!customFxVariants[id]?.length ／／ hasSound('fx_'+id)|需要进一步测试|
|src/script/09.js:129|itemClass|visual?' v2174-item-sound-card':''|需要进一步测试|
|src/script/09.js:130|description|visual       ? <div class="sound-desc v2174-item-sound-desc">           ${visual}           <div class="v2174-item-sound-copy">             <div class="sound-n|需要进一步测试|
|src/script/09.js:166|d|ITEM_DEFS[k]|需要进一步测试|
|src/script/09.js:167|visual|<span class="v2174-item-audio-icon">${itemVisual(k,'v2174-item-audio-img')}</span>|需要进一步测试|
|src/script/09.js:175|_v2174HandleSoundFileUpload|handleSoundFileUpload|需要进一步测试|
|src/script/09.js:177|result|_v2174HandleSoundFileUpload.call(this,event)|需要进一步测试|
|src/script/09.js:182|_v2174DeleteFxTrack|deleteFxTrack|需要进一步测试|
|src/script/09.js:184|result|_v2174DeleteFxTrack.call(this,idbKey,fxKey)|需要进一步测试|
|src/script/10.js:23|allRecords|await new Promise(resolve=>{       try{         const tx=db.transaction('sounds','readonly');         const req=tx.objectStore('sounds').getAll();         req.o|需要进一步测试|
|src/script/10.js:25|tx|db.transaction('sounds','readonly')|需要进一步测试|
|src/script/10.js:26|req|tx.objectStore('sounds').getAll()|需要进一步测试|
|src/script/10.js:40|fxRecords|allRecords       .filter(r=>r && typeof r.id==='string' && r.id.startsWith('fx_') && r.arrayBuffer instanceof ArrayBuffer)       .sort((a,b)=>a.id.localeCompare|需要进一步测试|
|src/script/10.js:49|currentOffset|0|需要进一步测试|
|src/script/10.js:50|fileIndex|[]|需要进一步测试|
|src/script/10.js:51|buffers|[]|需要进一步测试|
|src/script/10.js:53|record||需要进一步测试|
|src/script/10.js:54|ab|record.arrayBuffer|需要进一步测试|
|src/script/10.js:65|indexBytes|new TextEncoder().encode(JSON.stringify(fileIndex))|需要进一步测试|
|src/script/10.js:66|headerBuffer|new ArrayBuffer(8)|需要进一步测试|
|src/script/10.js:67|view|new DataView(headerBuffer)|需要进一步测试|
|src/script/10.js:76|blob|new Blob(       [headerBuffer,indexBytes,...buffers],       {type:'application/octet-stream'}     )|需要进一步测试|
|src/script/10.js:81|url|URL.createObjectURL(blob)|需要进一步测试|
|src/script/10.js:82|a|document.createElement('a')|需要进一步测试|
|src/script/10.js:85|itemFxCount|fxRecords.filter(r=>r.id.startsWith('fx_item_')).length|需要进一步测试|
|src/script/11.js:13|fxGainNodeV2176|null|需要进一步测试|
|src/script/11.js:29|label|document.getElementById('sfxVolLabelV2176')|需要进一步测试|
|src/script/11.js:33|node|getFxOutputV2176()|需要进一步测试|
|src/script/11.js:35|now|audioCtx.currentTime|需要进一步测试|
|src/script/11.js:48|pane|document.getElementById('settingsV26_sound')|需要进一步测试|
|src/script/11.js:51|master|document.getElementById('cfgMasterVolume')|需要进一步测试|
|src/script/11.js:52|masterRow|master?.closest('.setting-item')|需要进一步测试|
|src/script/11.js:54|row|document.createElement('div')|需要进一步测试|
|src/script/11.js:82|_v2176SyncSettingsControls|syncSettingsControls|需要进一步测试|
|src/script/11.js:84|r|_v2176SyncSettingsControls.apply(this,args)|需要进一步测试|
|src/script/11.js:87|slider|document.getElementById('cfgSfxVolumeV2176')|需要进一步测试|
|src/script/11.js:88|label|document.getElementById('sfxVolLabelV2176')|需要进一步测试|
|src/script/11.js:97|_v2176RebuildSettingsV26|rebuildSettingsV26|需要进一步测试|
|src/script/11.js:99|r|_v2176RebuildSettingsV26.apply(this,args)|需要进一步测试|
|src/script/11.js:106|_v2176ShowSettingsV26|showSettingsV26|需要进一步测试|
|src/script/11.js:108|r|_v2176ShowSettingsV26.call(this,which,...args)|需要进一步测试|
|src/script/12.js:16|ratioMet|checkAllInRatio()|需要进一步测试|
|src/script/12.js:30|g|state.groups.find(x=>x.id===groupId)|需要进一步测试|
|src/script/12.js:50|_v2177ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/script/12.js:66|_v2177QueueUseState|queueUseStateV2120|需要进一步测试|
|src/script/12.js:68|st|_v2177QueueUseState.call(this,g,index)|需要进一步测试|
|src/script/13.js:14|locked|state.groups.filter(g=>g.itemUsedThisRound)|需要进一步测试|
|src/script/13.js:15|eligible|state.groups.filter(g=>!g.itemUsedThisRound)|需要进一步测试|
|src/script/13.js:31|allEligibleAllIn|eligible.every(g=>g.allIn)|需要进一步测试|
|src/script/13.js:32|targetState|!allEligibleAllIn|需要进一步测试|
|src/script/13.js:45|ratioMet|checkAllInRatio()|需要进一步测试|
|src/script/14.js:10|GLOBAL_FIVE_DRAW_ITEMS_V2179|new Set(['lightning','blooper'])|需要进一步测试|
|src/script/14.js:11|STRONG_GROUP_ITEMS_V2179|new Set(['bullet','power','mega','star'])|需要进一步测试|
|src/script/14.js:24|t|state.itemGlobal.drawThrottleV2179|需要进一步测试|
|src/script/14.js:41|r|ranking()|需要进一步测试|
|src/script/14.js:42|pos|Math.max(1,r.findIndex(x=>x.id===g.id)+1)|需要进一步测试|
|src/script/14.js:43|W|{...itemDropWeights(pos,r.length)}|需要进一步测试|
|src/script/14.js:44|t|ensureDrawThrottleV2179()|需要进一步测试|
|src/script/14.js:47|drawNo|t.sequence+1|需要进一步测试|
|src/script/14.js:51|k||需要进一步测试|
|src/script/14.js:52|next|Math.max(0,Number(t.nextEligible[k])／／0)|需要进一步测试|
|src/script/14.js:66|oldSkip|Math.max(0,Number(t.groupStrongSkip[g.id])／／0)|需要进一步测试|
|src/script/14.js:68|left|oldSkip-1|需要进一步测试|
|src/script/14.js:89|held|heldItemKeysV281(g)|需要进一步测试|
|src/script/14.js:90|{weights,drawNo,throttle}|restrictedItemWeightsV2179(g)|需要进一步测试|
|src/script/14.js:93|k|weightedPickNoRepeatV281(weights,new Set([...batchUsed,...held]))|需要进一步测试|
|src/script/14.js:105|fallback|{}|需要进一步测试|
|src/script/14.js:147|host|document.getElementById('clearAllItemsV2172')|需要进一步测试|
|src/script/14.js:150|t|ensureDrawThrottleV2179()|需要进一步测试|
|src/script/14.js:151|info|document.createElement('div')|需要进一步测试|
|src/script/14.js:164|_v2179InstallClearItems|installClearItemsSettingV2172|需要进一步测试|
|src/script/14.js:166|r|_v2179InstallClearItems.apply(this,args)|需要进一步测试|
|src/script/15.js:27|t|state.itemGlobal.drawSessionThrottleV21710|需要进一步测试|
|src/script/15.js:43|activeDrawSessionV21710|null|需要进一步测试|
|src/script/15.js:46|t|ensureDrawSessionThrottleV21710()|需要进一步测试|
|src/script/15.js:61|r|ranking()|需要进一步测试|
|src/script/15.js:62|pos|Math.max(1,r.findIndex(x=>x.id===g.id)+1)|需要进一步测试|
|src/script/15.js:63|W|{...itemDropWeights(pos,r.length)}|需要进一步测试|
|src/script/15.js:65|t|ensureDrawSessionThrottleV21710()|需要进一步测试|
|src/script/15.js:66|sessionNo|activeDrawSessionV21710?.no ／／ t.sessionNo|需要进一步测试|
|src/script/15.js:68|key||需要进一步测试|
|src/script/15.js:69|next|Math.max(0,Number(t.nextEligibleSession[key])／／0)|需要进一步测试|
|src/script/15.js:88|old|ensureDrawThrottleV2179()|需要进一步测试|
|src/script/15.js:97|t|ensureDrawSessionThrottleV21710()|需要进一步测试|
|src/script/15.js:98|sessionNo|activeDrawSessionV21710?.no ／／ t.sessionNo|需要进一步测试|
|src/script/15.js:101|old|ensureDrawThrottleV2179()|需要进一步测试|
|src/script/15.js:102|oldSkip|Math.max(0,Number(old.groupStrongSkip[g.id])／／0)|需要进一步测试|
|src/script/15.js:105|left|oldSkip-1|需要进一步测试|
|src/script/15.js:129|held|heldItemKeysV281(g)|需要进一步测试|
|src/script/15.js:130|weights|sessionRestrictedWeightsV21710(g)|需要进一步测试|
|src/script/15.js:132|k|weightedPickNoRepeatV281(     weights,     new Set([...batchUsed,...held])   )|需要进一步测试|
|src/script/15.js:141|fallback|{}|需要进一步测试|
|src/script/15.js:154|_v21710GlobalItemDraw|globalItemDraw|需要进一步测试|
|src/script/15.js:158|eligible|state.groups.filter(     g=>eligibleForItems(g) && Array.isArray(g.inventory) && g.inventory.length<3   )|需要进一步测试|
|src/script/15.js:170|_v21710HandDrawItem|handDrawItem|需要进一步测试|
|src/script/15.js:174|g|state.groups.find(x=>x.id===handRaiseGroupId)|需要进一步测试|
|src/script/15.js:175|valid|!!g &&     !handItemDrawTimer &&     eligibleForItems(g) &&     Array.isArray(g.inventory) &&     g.inventory.length<3|需要进一步测试|
|src/script/15.js:190|host|document.getElementById('drawCooldownInfoV2179')|需要进一步测试|
|src/script/15.js:193|t|ensureDrawSessionThrottleV21710()|需要进一步测试|
|src/script/15.js:195|text|(key,label)=>{     const next=Number(t.nextEligibleSession[key]／／0);     if(!next ／／ t.sessionNo>=next) return ${label}：当前可抽取;     return ${label}：第 ${next} |需要进一步测试|
|src/script/15.js:196|next|Number(t.nextEligibleSession[key]／／0)|需要进一步测试|
|src/script/15.js:214|_v21710InstallInfo|installDrawCooldownInfoV2179|需要进一步测试|
|src/script/15.js:216|r|_v21710InstallInfo.apply(this,args)|需要进一步测试|
|src/script/15.js:223|_v21710ShowSettings|showSettingsV26|需要进一步测试|
|src/script/15.js:225|r|_v21710ShowSettings.call(this,which,...args)|需要进一步测试|
|src/script/16.js:3|ITEM_DRAW_DURATION_V21712|1500|需要进一步测试|
|src/script/16.js:4|ITEM_DRAW_RESULT_HOLD_V21712|900|需要进一步测试|
|src/script/16.js:5|ITEM_DRAW_FADE_V21712|620|需要进一步测试|
|src/script/16.js:6|ITEM_FX_DURATION_V21712|1700|需要进一步测试|
|src/script/16.js:12|generation|++drawAudioGenerationV2171|需要进一步测试|
|src/script/16.js:13|duration|ITEM_DRAW_DURATION_V21712|需要进一步测试|
|src/script/16.js:17|tickCount|0|需要进一步测试|
|src/script/16.js:18|tickInterval|110|需要进一步测试|
|src/script/16.js:46|eligible|state.groups.filter(     g=>eligibleForItems(g) && Array.isArray(g.inventory) && g.inventory.length<3   )|需要进一步测试|
|src/script/16.js:71|overlays|new Map()|需要进一步测试|
|src/script/16.js:72|start|performance.now()|需要进一步测试|
|src/script/16.js:73|total|ITEM_DRAW_DURATION_V21712|需要进一步测试|
|src/script/16.js:76|c|document.querySelector(.group-row-card[data-group-id="${g.id}"])|需要进一步测试|
|src/script/16.js:80|o|document.createElement('div')|需要进一步测试|
|src/script/16.js:88|lastUpdate|new Map()|需要进一步测试|
|src/script/16.js:91|t|Math.min(1,(now-start)/total)|需要进一步测试|
|src/script/16.js:94|interval|55 + 90*Math.pow(t,2.1)|需要进一步测试|
|src/script/16.js:97|prev|lastUpdate.get(g.id)／／0|需要进一步测试|
|src/script/16.js:109|batchUsed|new Set()|需要进一步测试|
|src/script/16.js:111|k|pickItemForGroupV281(g,batchUsed)|需要进一步测试|
|src/script/16.js:116|o|overlays.get(g.id)|需要进一步测试|
|src/script/16.js:120|hint|o.querySelector('.r-hint')|需要进一步测试|
|src/script/16.js:132|c|document.querySelector(.group-row-card[data-group-id="${g.id}"])|需要进一步测试|
|src/script/16.js:135|o|c.querySelector('.card-item-roulette')|需要进一步测试|
|src/script/16.js:162|g|state.groups.find(x=>x.id===handRaiseGroupId)|需要进一步测试|
|src/script/16.js:176|box|document.getElementById('handRewardBox')|需要进一步测试|
|src/script/16.js:188|last|0|需要进一步测试|
|src/script/16.js:189|total|ITEM_DRAW_DURATION_V21712|需要进一步测试|
|src/script/16.js:195|t|Math.min(1,(now-handItemDrawStartedAt)/total)|需要进一步测试|
|src/script/16.js:196|interval|55+90*Math.pow(t,2.1)|需要进一步测试|
|src/script/16.js:198|bar|document.getElementById('handItemProgressBar')|需要进一步测试|
|src/script/16.js:203|live|state.groups.find(x=>x.id===handItemDrawGroupId)|需要进一步测试|
|src/script/16.js:206|k|roulettePreviewPickV282()|需要进一步测试|
|src/script/16.js:207|cap|document.getElementById('handItemCapsule')|需要进一步测试|
|src/script/16.js:208|name|document.getElementById('handItemDrawName')|需要进一步测试|
|src/script/16.js:227|live|state.groups.find(x=>x.id===handItemDrawGroupId)|需要进一步测试|
|src/script/16.js:235|k|pickItemForGroupV281(live,new Set())|需要进一步测试|
|src/script/16.js:254|slot|live.inventory.length-1|需要进一步测试|
|src/script/17.js:16|ATTACK_REORDER_DELAY_V21713|340|需要进一步测试|
|src/script/17.js:18|attackRenderGateV21713|false|需要进一步测试|
|src/script/17.js:19|attackRenderTimerV21713|null|需要进一步测试|
|src/script/17.js:20|attackRenderFlushingV21713|false|需要进一步测试|
|src/script/17.js:21|pendingRenderArgsV21713|null|需要进一步测试|
|src/script/17.js:28|_v21713ApplyLightningHit|applyLightningHitV2116|需要进一步测试|
|src/script/18.js:6|ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715|{   green:'随机攻击其他小组，扣除其当前积分的 1/4；作为主要道具时可抵挡一次常规攻击。',   triple_green:'拥有 3 次绿龟壳使用次数；每次可随机攻击其他小组并扣除其当前积分的 1/4，也可作为主要道具逐次防御。',   red:'攻击当前排名正上方的小组，扣除其当前积分的 1/3；作为主|需要进一步测试|
|src/script/18.js:36|_v21715RenderAbout|renderAbout|需要进一步测试|
|src/script/18.js:42|m|document.getElementById('aboutMain')|需要进一步测试|
|src/script/18.js:58|d|ITEM_DEFS[k]|需要进一步测试|
|src/script/18.js:59|desc|ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715[k] ／／ d.desc ／／ ''|需要进一步测试|
|src/script/19.js:12|hex|document.getElementById('groupDetailColorHexV21716')|需要进一步测试|
|src/script/20.js:9|t|ensureDrawSessionThrottleV21710()|需要进一步测试|
|src/script/20.js:21|_v21717SessionRestrictedWeights|sessionRestrictedWeightsV21710|需要进一步测试|
|src/script/20.js:23|W|_v21717SessionRestrictedWeights.call(this,g)|需要进一步测试|
|src/script/20.js:24|t|ensureSpinyCooldownV21717()|需要进一步测试|
|src/script/20.js:25|sessionNo|activeDrawSessionV21710?.no ／／ t.sessionNo|需要进一步测试|
|src/script/20.js:26|next|Math.max(0,Number(t.nextEligibleSession.spiny)／／0)|需要进一步测试|
|src/script/20.js:36|_v21717CommitSessionDraw|commitSessionDrawV21710|需要进一步测试|
|src/script/20.js:41|t|ensureSpinyCooldownV21717()|需要进一步测试|
|src/script/20.js:42|sessionNo|activeDrawSessionV21710?.no ／／ t.sessionNo|需要进一步测试|
|src/script/20.js:48|_v21717RefreshCooldownInfo|refreshDrawCooldownInfoV21710|需要进一步测试|
|src/script/20.js:52|host|document.getElementById('drawCooldownInfoV2179')|需要进一步测试|
|src/script/20.js:55|t|ensureSpinyCooldownV21717()|需要进一步测试|
|src/script/20.js:56|next|Number(t.nextEligibleSession.spiny／／0)|需要进一步测试|
|src/script/20.js:57|text|(!next ／／ t.sessionNo>=next)     ? '刺龟壳：当前可抽取'     : 刺龟壳：第 ${next} 个抽取轮次重新开放（当前第 ${t.sessionNo} 轮）|需要进一步测试|
|src/script/20.js:61|extra|document.createElement('small')|需要进一步测试|
|src/script/21.js:8|held|heldItemKeysV281(g)|需要进一步测试|
|src/script/21.js:9|weights|sessionRestrictedWeightsV21710(g)|需要进一步测试|
|src/script/21.js:12|k|weightedPickNoRepeatV281(     weights,     new Set([...batchUsed,...held])   )|需要进一步测试|
|src/script/21.js:32|changed|false|需要进一步测试|
|src/script/21.js:34|before|JSON.stringify(g.inventory／／[])|需要进一步测试|
|src/script/22.js:4|keys|new Set(['fire_flower','ice_flower','boomerang_flower'])|需要进一步测试|
|src/script/22.js:5|changed|false|需要进一步测试|
|src/script/22.js:11|n|Number(it.charges)|需要进一步测试|
|src/script/22.js:12|limit|Number.isInteger(it.configuredCharges)&&it.configuredCharges>=1&&it.configuredCharges<=99?it.configuredCharges:3|需要进一步测试|
|src/script/22.js:13|fixed|Number.isFinite(n)         ? Math.max(1,Math.min(limit,Math.trunc(n)))         : limit|需要进一步测试|
|src/script/24.js:5|box|document.getElementById('battleRankPreviewGridV21721')|需要进一步测试|
|src/script/24.js:8|ranked|[]|需要进一步测试|
|src/script/24.js:16|rank|i+1|需要进一步测试|
|src/script/24.js:17|no|(typeof groupNoTextV213==='function') ? groupNoTextV213(g) : String(g.groupNo／／g.id／／'')|需要进一步测试|
|src/script/24.js:18|medal|rank===1?'🥇':rank===2?'🥈':rank===3?'🥉':String(rank)|需要进一步测试|
|src/script/24.js:32|_v21721SwitchView|typeof switchView==='function' ? switchView : null|需要进一步测试|
|src/script/24.js:35|result|_v21721SwitchView.call(this,name,...args)|需要进一步测试|
|src/script/27.js:10|groups|state.groups.slice()|需要进一步测试|
|src/script/27.js:14|na|(typeof groupNoValueV213==='function') ? groupNoValueV213(a) : Number(a.groupNo ?? a.id ?? 0)|需要进一步测试|
|src/script/27.js:15|nb|(typeof groupNoValueV213==='function') ? groupNoValueV213(b) : Number(b.groupNo ?? b.id ?? 0)|需要进一步测试|
|src/script/27.js:26|d|Number(b.score／／0)-Number(a.score／／0)|需要进一步测试|
|src/script/27.js:28|na|(typeof groupNoValueV213==='function') ? groupNoValueV213(a) : Number(a.groupNo ?? a.id ?? 0)|需要进一步测试|
|src/script/27.js:29|nb|(typeof groupNoValueV213==='function') ? groupNoValueV213(b) : Number(b.groupNo ?? b.id ?? 0)|需要进一步测试|
|src/script/28.js:7|map|new Map()|需要进一步测试|
|src/script/28.js:9|r|card.getBoundingClientRect()|需要进一步测试|
|src/script/28.js:17|roundStateFlipBusyV21726|false|需要进一步测试|
|src/script/28.js:18|roundStateFlipTimerV21726|null|需要进一步测试|
|src/script/28.js:23|moved|[]|需要进一步测试|
|src/script/28.js:25|old|oldRects.get(String(card.dataset.groupId))|需要进一步测试|
|src/script/28.js:28|now|card.getBoundingClientRect()|需要进一步测试|
|src/script/28.js:29|dx|old.left-now.left|需要进一步测试|
|src/script/28.js:30|dy|old.top-now.top|需要进一步测试|
|src/script/30.js:3|themeDialogResolveV21727|null|需要进一步测试|
|src/script/30.js:6|root|document.getElementById('themeDialogV21727')|需要进一步测试|
|src/script/30.js:10|resolve|themeDialogResolveV21727|需要进一步测试|
|src/script/30.js:16|root|document.getElementById('themeDialogV21727')|需要进一步测试|
|src/script/30.js:17|title|document.getElementById('themeDialogTitleV21727')|需要进一步测试|
|src/script/30.js:18|body|document.getElementById('themeDialogBodyV21727')|需要进一步测试|
|src/script/30.js:19|icon|document.getElementById('themeDialogIconV21727')|需要进一步测试|
|src/script/30.js:20|actions|document.getElementById('themeDialogActionsV21727')|需要进一步测试|
|src/script/30.js:27|prev|themeDialogResolveV21727|需要进一步测试|
|src/script/30.js:42|cancel|document.createElement('button')|需要进一步测试|
|src/script/30.js:49|ok|document.createElement('button')|需要进一步测试|
|src/script/30.js:57|ok|document.createElement('button')|需要进一步测试|
|src/script/30.js:80|root|document.getElementById('themeDialogV21727')|需要进一步测试|
|src/script/31.js:1|scoreAnimationEpoch|0|需要进一步测试|
|src/script/31.js:3|epoch|scoreAnimationEpoch|需要进一步测试|
|src/script/31.js:9|g|state.groups.find(g=>String(g.id)===el.id.slice(10))|需要进一步测试|
|src/script/31.js:15|el|document.getElementById(score-val-${g.id})|需要进一步测试|
|src/script/31.js:24|itemScoreBatchDepthV21732|0|需要进一步测试|
|src/script/31.js:25|pendingItemScoreAnimationsV21732|[]|需要进一步测试|
|src/script/31.js:26|ITEM_SCORE_AFTER_FX_DELAY_V21732|980|需要进一步测试|
|src/script/31.js:27|ITEM_DELTA_DURATION_V21732|1050|需要进一步测试|
|src/script/31.js:28|ITEM_SCORE_ROLL_DURATION_V21732|920|需要进一步测试|
|src/script/31.js:29|activeScoreRollsV21732|new Map()|需要进一步测试|
|src/script/31.js:32|itemScoreDisplayHoldV21732|new Map()|需要进一步测试|
|src/script/31.js:44|g|state.groups.find(x=>String(x.id)===String(key))|需要进一步测试|
|src/script/31.js:50|scoreEl|getScoreElementV21732(groupId)|需要进一步测试|
|src/script/31.js:55|deltaEl|document.createElement('span')|需要进一步测试|
|src/script/31.js:70|[kind,value]||需要进一步测试|
|src/script/31.js:71|ghost|document.createElement('span')|需要进一步测试|
|src/script/31.js:76|key|String(groupId)|需要进一步测试|
|src/script/31.js:76|g|state.groups.find(x=>String(x.id)===key)|需要进一步测试|
|src/script/31.js:78|session|{from,to,started:performance.now()}|需要进一步测试|
|src/script/31.js:79|el|getScoreElementV21732(groupId)|需要进一步测试|
|src/script/31.js:83|el|getScoreElementV21732(groupId)|需要进一步测试|
|src/script/31.js:91|p|DesktopUI.getPreferences()|需要进一步测试|
|src/script/31.js:94|changes|[]|需要进一步测试|
|src/script/31.js:96|old|beforeMap.get(String(g.id))|需要进一步测试|
|src/script/31.js:98|now|Number(g.score)／／0|需要进一步测试|
|src/script/31.js:106|el|getScoreElementV21732(g.id)|需要进一步测试|
|src/script/31.js:115|merged|new Map()|需要进一步测试|
|src/script/31.js:117|key|String(c.groupId)|需要进一步测试|
|src/script/31.js:125|batch|pendingItemScoreAnimationsV21732.splice(0)|需要进一步测试|
|src/script/31.js:128|g|state.groups.find(x=>String(x.id)===String(c.groupId))|需要进一步测试|
|src/script/31.js:129|finalScore|g?Number(g.score)／／0:c.now|需要进一步测试|
|src/script/31.js:130|delta|finalScore-c.old|需要进一步测试|
|src/script/31.js:164|el|getScoreElementV21732(key)|需要进一步测试|
|src/script/31.js:166|session|activeScoreRollsV21732.get(String(key))|需要进一步测试|
|src/script/31.js:167|g|state.groups.find(x=>String(x.id)===String(key))|需要进一步测试|
|src/script/32.js:6|ef|g.itemEffect|需要进一步测试|
|src/script/32.js:27|changed|false|需要进一步测试|
|src/script/32.js:29|before|JSON.stringify(g.itemEffect??null)|需要进一步测试|
|src/script/32.js:31|after|JSON.stringify(g.itemEffect??null)|需要进一步测试|
|src/script/32.js:39|_v21731EnsureItemState|ensureItemState|需要进一步测试|
|src/script/32.js:41|result|_v21731EnsureItemState.apply(this,args)|需要进一步测试|
|src/script/34.js:3|NOTICE_DURATION_V21734|3800|需要进一步测试|
|src/script/34.js:9|style|document.createElement('style')|需要进一步测试|
|src/script/35.js:5|stack|document.getElementById('topNoticeStackV21735')|需要进一步测试|
|src/script/35.js:16|stack|getTopNoticeStackV21735()|需要进一步测试|
|src/script/35.js:19|remove|()=>{     if(node.isConnected)node.remove();     if(stack.isConnected && !stack.children.length)stack.remove();   }|需要进一步测试|
|src/script/35.js:30|_v21735ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/script/35.js:35|d|ITEM_DEFS?.[key]|需要进一步测试|
|src/script/35.js:52|special|['coin_shell','question','question_block','boo']|需要进一步测试|
|src/script/35.js:54|heal|['coin_shell','question','question_block'].includes(key)|需要进一步测试|
|src/script/35.js:62|caster|state.groups?.find(g=>g.id===casterId)|需要进一步测试|
|src/script/35.js:63|banner|document.createElement('div')|需要进一步测试|
|src/script/35.js:85|banner|document.createElement('div')|需要进一步测试|
|src/script/36.js:6|text|String(raw??'').trim()|需要进一步测试|
|src/script/36.js:8|m|text.match(/^(\d{1,4})\s*[-_—–:：.]?\s*(.*)$/)|需要进一步测试|
|src/script/36.js:13|p|parseStudentV218(raw)|需要进一步测试|
|src/script/36.js:18|name|parseStudentV218(raw).name.trim()|需要进一步测试|
|src/script/36.js:20|ch|name[0]|需要进一步测试|
|src/script/36.js:23|bounds|[     ['A','阿'],['B','芭'],['C','擦'],['D','搭'],['E','蛾'],['F','发'],     ['G','噶'],['H','哈'],['J','击'],['K','喀'],['L','垃'],['M','妈'],     ['N','拿'],['O','哦'],['P'|需要进一步测试|
|src/script/36.js:30|result|'A'|需要进一步测试|
|src/script/36.js:31|[letter,bound]||需要进一步测试|
|src/script/36.js:44|_v218RenderBattleRankPreview|renderBattleRankPreviewV21721|需要进一步测试|
|src/script/36.js:46|r|_v218RenderBattleRankPreview.apply(this,arguments)|需要进一步测试|
|src/script/36.js:47|active|Number(state.itemGlobal?.blooperUntil／／0)>Date.now()|需要进一步测试|
|src/script/36.js:57|input|document.getElementById('memberSearchInput')|需要进一步测试|
|src/script/36.js:58|results|document.getElementById('memberSearchResults')|需要进一步测试|
|src/script/36.js:60|q|input.value.trim().toLowerCase()|需要进一步测试|
|src/script/36.js:63|matches|[]|需要进一步测试|
|src/script/36.js:65|p|parseStudentV218(member)|需要进一步测试|
|src/script/36.js:66|numberHit|p.number!=null && String(p.number).includes(q.replace(/\D/g,''))|需要进一步测试|
|src/script/36.js:67|nameHit|p.name.toLowerCase().includes(q) ／／ String(member).toLowerCase().includes(q)|需要进一步测试|
|src/script/36.js:81|memberSearchInputV218|document.getElementById('memberSearchInput')|需要进一步测试|
|src/script/36.js:87|el|document.getElementById('pickerScoreTarget')|需要进一步测试|
|src/script/36.js:87|w|slotEngine.chosenResult|需要进一步测试|
|src/script/36.js:91|g|state.picker.mode==='group'?w:w.group|需要进一步测试|
|src/script/36.js:97|qpStateV218|{selected:new Set(),bands:new Set(),groups:new Set(),letters:new Set()}|需要进一步测试|
|src/script/36.js:99|out|[]|需要进一步测试|
|src/script/36.js:101|p|parseStudentV218(member)|需要进一步测试|
|src/script/36.js:109|start|Math.floor(n/10)*10|需要进一步测试|
|src/script/36.js:114|q|document.getElementById('qpSearchV218')|需要进一步测试|
|src/script/36.js:120|set|qpStateV218[type]|需要进一步测试|
|src/script/36.js:125|students|allStudentsV218()|需要进一步测试|
|src/script/36.js:126|bands|[...new Set(students.map(s=>numberBandV218(s.p.number)).filter(Boolean))]     .sort((a,b)=>parseInt(a)-parseInt(b))|需要进一步测试|
|src/script/36.js:128|bandBox|document.getElementById('qpNumberBandsV218')|需要进一步测试|
|src/script/36.js:131|gb|document.getElementById('qpGroupFiltersV218')|需要进一步测试|
|src/script/36.js:134|letters|'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')|需要进一步测试|
|src/script/36.js:135|lb|document.getElementById('qpLetterFiltersV218')|需要进一步测试|
|src/script/36.js:139|q|(document.getElementById('qpSearchV218')?.value／／'').trim().toLowerCase()|需要进一步测试|
|src/script/36.js:142|qNum|q.replace(/\D/g,'')|需要进一步测试|
|src/script/36.js:143|hitName|s.p.name.toLowerCase().includes(q)／／String(s.member).toLowerCase().includes(q)|需要进一步测试|
|src/script/36.js:144|hitNum|qNum && s.p.number!=null && String(s.p.number).includes(qNum)|需要进一步测试|
|src/script/36.js:154|box|document.getElementById('quickPersonListV218')|需要进一步测试|
|src/script/36.js:155|list|filteredStudentsV218()|需要进一步测试|
|src/script/36.js:162|c|document.getElementById('qpSelectedCountV218')|需要进一步测试|
|src/script/36.js:173|selected|allStudentsV218().filter(s=>qpStateV218.selected.has(s.key))|需要进一步测试|
|src/script/36.js:175|counts|new Map()|需要进一步测试|
|src/script/36.js:177|updates||需要进一步测试|
|src/script/36.js:180|description|'快速按人加分：'+selected.length+' 人 · '+updates.map(u=>{     const name=state.groups.find(g=>g.id===u.id)?.name／／'小组';     return name+' '+(u.delta>=0?'+':'')+u.delta|需要进一步测试|
|src/script/36.js:181|name|state.groups.find(g=>g.id===u.id)?.name／／'小组'|需要进一步测试|
|src/script/36.js:185|ok|runClassroomCommand(description,()=>{     for(const u of updates)state.groups.find(g=>g.id===u.id).score=u.score;     return true;   })|需要进一步测试|
|src/script/36.js:186|u||需要进一步测试|
|src/script/36.js:197|v|Number(document.getElementById('qpCustomScoreV218')?.value)|需要进一步测试|
|src/script/36.js:203|right|document.querySelector('.bottom-dock .dock-right')|需要进一步测试|
|src/script/36.js:205|b|document.createElement('button')|需要进一步测试|
|src/script/36.js:208|hand|[...right.querySelectorAll('button')].find(x=>x.getAttribute('onclick')?.includes('openHandRaise'))|需要进一步测试|
|src/script/36.js:224|TRIPLE_KEYS_V218|new Set(['triple_green','triple_red','triple_banana','triple_mushroom'])|需要进一步测试|
|src/script/36.js:226|it|g.inventory?.[index]|需要进一步测试|
|src/script/36.js:231|amount|Math.round(Math.max(0,Number(target.score)／／0)/5)|需要进一步测试|
|src/script/36.js:246|_v218QueueState|queueUseStateV2120|需要进一步测试|
|src/script/36.js:274|FIRST_HAND_POOL_V218|[   'triple_mushroom','mushroom','triple_green','green',   'triple_red','red','banana','triple_banana','horn' ]|需要进一步测试|
|src/script/36.js:278|firstHandDrawPendingV218|true|需要进一步测试|
|src/script/36.js:279|suppressFirstHornV218|false|需要进一步测试|
|src/script/36.js:281|_v218ItemDropWeights|itemDropWeights|需要进一步测试|
|src/script/36.js:283|W|_v218ItemDropWeights.call(this,pos,total)|需要进一步测试|
|src/script/36.js:284|cutoff|Math.max(1,Math.ceil(Math.max(1,total)*0.60))|需要进一步测试|
|src/script/36.js:294|_v218PickItem|pickItemForGroupV281|需要进一步测试|
|src/script/36.js:300|handEffectSuppressV218|false|需要进一步测试|
|src/script/36.js:303|box|document.getElementById('handEffectCardV218')|需要进一步测试|
|src/script/36.js:303|overlay|document.getElementById('handEffectOverlayV218')|需要进一步测试|
|src/script/36.js:305|lines|[]|需要进一步测试|
|src/script/36.js:307|old|before.get(g.id)|需要进一步测试|
|src/script/36.js:308|now|Number(g.score)／／0|需要进一步测试|
|src/script/36.js:308|delta|now-old|需要进一步测试|
|src/script/36.js:320|g|state.groups.find(x=>x.id===handRaiseGroupId)|需要进一步测试|
|src/script/36.js:320|it|g?.inventory?.[0]|需要进一步测试|
|src/script/36.js:322|key|it.key|需要进一步测试|
|src/script/36.js:322|before|scoreSnapshotV218()|需要进一步测试|
|src/script/36.js:323|ok|useItem(g.id,0)|需要进一步测试|
|src/script/36.js:328|g|state.groups.find(x=>x.id===handRaiseGroupId)|需要进一步测试|
|src/script/36.js:328|it|g?.inventory?.[0]|需要进一步测试|
|src/script/36.js:330|key|it.key|需要进一步测试|
|src/script/36.js:330|before|scoreSnapshotV218()|需要进一步测试|
|src/script/36.js:331|left|Math.min(3,Number(it.charges)／／0)|需要进一步测试|
|src/script/36.js:333|fire|()=>{     const live=state.groups.find(x=>x.id===handRaiseGroupId);     if(!live?.inventory?.[0]／／live.inventory[0].key!==key／／left<=0){       handEffectSuppres|需要进一步测试|
|src/script/36.js:334|live|state.groups.find(x=>x.id===handRaiseGroupId)|需要进一步测试|
|src/script/36.js:348|box|document.getElementById('handRewardBox')|需要进一步测试|
|src/script/36.js:349|g|state.groups.find(x=>x.id===handRaiseGroupId)|需要进一步测试|
|src/script/36.js:350|main|g.inventory?.[0]|需要进一步测试|
|src/script/36.js:350|triple|main&&TRIPLE_KEYS_V218.has(main.key)&&Number(main.charges)>1|需要进一步测试|
|src/script/36.js:351|drawDisabled|!eligibleForItems(g)／／g.inventory.length>=3|需要进一步测试|
|src/script/36.js:365|_v218JudgeHandRaise|judgeHandRaise|需要进一步测试|
|src/script/36.js:367|r|_v218JudgeHandRaise.call(this,correct)|需要进一步测试|
|src/script/36.js:379|ITEM_ORDER_V218|[   'mushroom','triple_mushroom','green','triple_green','red','triple_red',   'banana','triple_banana','horn','feather',   'fire_flower','ice_flower','boomerang|需要进一步测试|
|src/script/36.js:387|ITEM_TIPS_V218|{   mushroom:'既能主动加分，也能在刺龟壳来袭时选择主动消耗闪避。',   triple_mushroom:'答题期间第一次使用后不能 All In，但同一枚三重蘑菇的剩余次数仍可继续使用；手动举手可选择一次或连发。',   green:'主要栏可作为防御资源；领先时不要急着主动丢掉。',   triple|需要进一步测试|
|src/script/36.js:415|_v218RenderAbout|renderAbout|需要进一步测试|
|src/script/36.js:419|m|document.getElementById('aboutMain')|需要进一步测试|
|src/script/36.js:432|d|ITEM_DEFS[k]|需要进一步测试|
|src/script/36.js:432|desc|(typeof ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715!=='undefined'&&ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715[k])／／d.desc／／''|需要进一步测试|
|src/script/37.js:3|GROUP_ITEM_ORDER_V2182|[   'mushroom','triple_mushroom',   'green','triple_green','red','triple_red',   'banana','triple_banana','horn','feather',   'fire_flower','ice_flower','boomer|需要进一步测试|
|src/script/37.js:14|GROUP_ITEM_DESC_V2182|{   green:'随机攻击一个其他小组，扣除当前积分的 1/4；主要栏可用于基础防御。',   triple_green:'3 次绿龟壳；每次随机攻击一个其他小组 -1/4，也可逐次用于基础防御。',   red:'攻击当前排名紧邻的上一组 -1/3；若没有上方排名，道具仍会消耗但不产生效果。',   triple|需要进一步测试|
|src/script/37.js:56|roots|[...document.querySelectorAll('*')].filter(el=>     el.children.length &&     /上帝模式\s*·\s*强制追加到队尾/.test(el.textContent／／'')   )|需要进一步测试|
|src/script/37.js:60|root|roots.sort((a,b)=>a.querySelectorAll('button').length-b.querySelectorAll('button').length)                 .find(el=>el.querySelectorAll('button').length>=20)|需要进一步测试|
|src/script/37.js:64|buttons|[...root.querySelectorAll('button')]|需要进一步测试|
|src/script/37.js:65|byKey|new Map()|需要进一步测试|
|src/script/37.js:67|oc|btn.getAttribute('onclick')／／''|需要进一步测试|
|src/script/37.js:68|m|oc.match(/['"]([a-z_]+)['"]/)|需要进一步测试|
|src/script/37.js:73|parent|[...byKey.values()][0].parentElement|需要进一步测试|
|src/script/37.js:76|btn|byKey.get(k)|需要进一步测试|
|src/script/37.js:87|group|state.groups.find(g=>g.id===activeItemGroupId)|需要进一步测试|
|src/script/37.js:90|key|group.inventory[index]?.key|需要进一步测试|
|src/script/37.js:91|target|card.querySelector('.item-big-desc')|需要进一步测试|
|src/script/37.js:102|_v2182RenderItemWindow|renderItemWindow|需要进一步测试|
|src/script/37.js:104|r|_v2182RenderItemWindow.apply(this,arguments)|需要进一步测试|
|src/script/37.js:111|_v2182AdminAddItem|adminAddItem|需要进一步测试|
|src/script/37.js:113|r|_v2182AdminAddItem.apply(this,arguments)|需要进一步测试|
|src/script/38.js:3|ITEM_FUNNY_COPY_V2184|{   mushroom:'朴实无华的加分工具。没有复杂的阴谋，没有精密的计算，吃下去就是涨分。甚至还能拿来躲刺龟壳，蘑菇本人对此可能也很困惑。',   triple_mushroom:'一个蘑菇不够，那就三个。适合信奉“解决问题的方法是把同一个方法重复三遍”的小组。',   green:'它不认识排名，也不认识恩怨，|需要进一步测试|
|src/script/38.js:33|ITEM_FUNNY_TAG_V2184|{   mushroom:'稳健派的快乐',   triple_mushroom:'数量解决一切',   green:'随机受害者生成器',   triple_green:'随机受害者生成器 ×3',   red:'只认前一名',   triple_red:'目标随排名漂移',   banana:'回头关怀后排',  |需要进一步测试|
|src/script/38.js:63|_v2184RenderAbout|renderAbout|需要进一步测试|
|src/script/38.js:67|m|document.getElementById('aboutMain')|需要进一步测试|
|src/script/38.js:80|d|ITEM_DEFS[k]|需要进一步测试|
|src/script/38.js:81|exact|(typeof GROUP_ITEM_DESC_V2182!=='undefined'&&GROUP_ITEM_DESC_V2182[k])         ／／(typeof ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715!=='undefined'&&ITEM_ENCYCLOPEDIA_E|需要进一步测试|
|src/script/38.js:84|funny|ITEM_FUNNY_COPY_V2184[k]／／'它有自己的工作，而且暂时没有向策划提交辞职申请。'|需要进一步测试|
|src/script/38.js:85|tag|ITEM_FUNNY_TAG_V2184[k]／／'道具'|需要进一步测试|
|src/script/38.js:86|tip|(typeof ITEM_TIPS_V218!=='undefined'&&ITEM_TIPS_V218[k])／／'根据排名和当前局势使用，别只因为图标好看就按。'|需要进一步测试|
|src/script/39.js:2|DOCK_HUMOR_V2185|{   roundStatusBadge:{name:'战况播报',copy:'负责告诉你现在到底是在答题、结算，还是全班集体等待某个人终于按下按钮。'},   correctAnswer:{name:'标准答案投票站',copy:'A、B、C、D 四选一。请谨慎决定，毕竟按错以后最先怀疑人生的通常不是学生，是老师。'|需要进一步测试|
|src/script/39.js:23|dockHumorTipV2185|null|需要进一步测试|
|src/script/39.js:26|el|document.createElement('div')|需要进一步测试|
|src/script/39.js:33|d|DOCK_HUMOR_V2185[key]|需要进一步测试|
|src/script/39.js:38|tip|ensureDockHumorTipV2185()|需要进一步测试|
|src/script/39.js:40|r|el.getBoundingClientRect()|需要进一步测试|
|src/script/39.js:42|tr|tip.getBoundingClientRect()|需要进一步测试|
|src/script/39.js:43|left|r.left+r.width/2-tr.width/2|需要进一步测试|
|src/script/39.js:45|top|r.top-tr.height-9|需要进一步测试|
|src/script/39.js:53|dock|document.querySelector('.bottom-dock')|需要进一步测试|
|src/script/39.js:57|ansWrap|[...dock.querySelectorAll('.dock-left>div')].find(x=>x.querySelector('.ans-btn'))|需要进一步测试|
|src/script/39.js:60|label|ansWrap.querySelector('span')|需要进一步测试|
|src/script/39.js:67|next|document.getElementById('btnNextRound')|需要进一步测试|
|src/script/39.js:70|force|document.getElementById('btnForceEnd')|需要进一步测试|
|src/script/39.js:73|finalBtn|document.getElementById('btnFinalSettlement')|需要进一步测试|
|src/script/39.js:76|byOnclick|(needle)=>[...dock.querySelectorAll('button')].find(b=>(b.getAttribute('onclick')／／'').includes(needle))|需要进一步测试|
|src/script/39.js:89|qp|document.getElementById('quickPersonBtnV218')|需要进一步测试|
|src/script/39.js:100|_v2185RenderLockState|renderLockState|需要进一步测试|
|src/script/39.js:102|r|_v2185RenderLockState.apply(this,arguments)|需要进一步测试|
|src/script/39.js:103|btn|document.getElementById('lockBtn')|需要进一步测试|
|src/script/41.js:7|qp|document.querySelector('#quickPersonBackdropV218 .quick-person-head-v218 b')|需要进一步测试|
|src/script/41.js:11|aboutInfo|document.querySelector('#aboutBackdrop [data-about="info"]')|需要进一步测试|
|src/script/41.js:12|aboutGuide|document.querySelector('#aboutBackdrop [data-about="guide"]')|需要进一步测试|
|src/script/41.js:27|pickerTitle|document.querySelector('#pickerModal .picker-left-v2 h3')|需要进一步测试|
|src/script/41.js:29|handTitle|document.querySelector('#handRaiseBackdrop .classroom-head b')|需要进一步测试|
|src/script/41.js:31|memberTitle|document.querySelector('#memberSearchBackdrop .member-search-title')|需要进一步测试|
|src/script/41.js:36|_v2187RenderAbout|renderAbout|需要进一步测试|
|src/script/41.js:40|m|document.getElementById('aboutMain')|需要进一步测试|
|src/script/41.js:72|_v2187OpenPwdModal|openPwdModal|需要进一步测试|
|src/script/41.js:74|r|_v2187OpenPwdModal.apply(this,arguments)|需要进一步测试|
|src/script/41.js:75|h|document.querySelector('#pwdModal h3')|需要进一步测试|
|src/script/41.js:76|p|document.querySelector('#pwdModal p')|需要进一步测试|
|src/script/41.js:77|ok|document.querySelector('#pwdModal .btn-primary')|需要进一步测试|
|src/script/41.js:88|fn|window[name]|需要进一步测试|
|src/script/41.js:91|r|fn.apply(this,args)|需要进一步测试|
|src/script/43.js:3|about|document.getElementById('aboutMain')|需要进一步测试|
|src/script/43.js:5|walker|document.createTreeWalker(about,NodeFilter.SHOW_TEXT)|需要进一步测试|
|src/script/43.js:6|nodes|[]|需要进一步测试|
|src/script/43.js:17|_v21811RenderAbout|renderAbout|需要进一步测试|
|src/script/43.js:19|r|_v21811RenderAbout.apply(this,arguments)|需要进一步测试|
|src/script/44.js:43|customIcons|(state.itemGlobal&&state.itemGlobal.customIcons)     ? state.itemGlobal.customIcons     : STORAGE.getJSON('politics_item_icons',{})|需要进一步测试|
|src/script/45.js:47|ig|state.itemGlobal／／{}|需要进一步测试|
|src/script/45.js:106|text||需要进一步测试|
|src/script/45.js:117|n|itemNameV21813(it.key)|需要进一步测试|
|src/script/45.js:118|c|Number(it.charges)／／1|需要进一步测试|
|src/script/45.js:123|out|[]|需要进一步测试|
|src/script/45.js:125|d|ITEM_DEFS?.[g.itemEffect.type]?.name／／g.itemEffect.type|需要进一步测试|
|src/script/45.js:136|list|getSettlementHistory()|需要进一步测试|
|src/script/45.js:137|record|list[index]|需要进一步测试|
|src/script/45.js:140|snap|record.clearedData／／{}|需要进一步测试|
|src/script/45.js:141|groups|snap.groups?.length?snap.groups:record.groups／／[]|需要进一步测试|
|src/script/45.js:142|ig|snap.itemGlobal／／{}|需要进一步测试|
|src/script/45.js:143|lines|[]|需要进一步测试|
|src/script/45.js:161|answers|groups.reduce((n,g)=>n+(Number(g.itemStats?.correct)／／0)+(Number(g.itemStats?.wrong)／／0),0)|需要进一步测试|
|src/script/45.js:182|ranked|[...groups].sort((a,b)=>(Number(b.score)／／0)-(Number(a.score)／／0))|需要进一步测试|
|src/script/45.js:234|g|groups.find(q=>q.id===x.groupId)|需要进一步测试|
|src/script/45.js:246|rd|snap.round／／{}|需要进一步测试|
|src/script/45.js:266|groupSummary|(h.groups／／[]).map(g=>({       id:g.id,name:g.name,score:g.score,       inventory:g.inventory,itemStats:g.itemStats,itemEffect:g.itemEffect,       booShield:g.b|需要进一步测试|
|src/script/45.js:284|csvContent|"\uFEFF"+lines.join("\n")|需要进一步测试|
|src/script/45.js:285|blob|new Blob([csvContent],{type:'text/csv;charset=utf-8;'})|需要进一步测试|
|src/script/45.js:286|url|URL.createObjectURL(blob)|需要进一步测试|
|src/script/45.js:287|a|document.createElement('a')|需要进一步测试|
|src/ui/desktop.js:2|DesktopUI|(() => {   const M = GodpowerUIModel,     E = escapeHtml,     $ = (s) => document.querySelector(s),     defaults = {       motion: "full",       speed: 1,      |需要进一步测试|
|src/ui/desktop.js:3|M|GodpowerUIModel|需要进一步测试|
|src/ui/desktop.js:4|E|escapeHtml|需要进一步测试|
|src/ui/desktop.js:5|$|(s) => document.querySelector(s)|需要进一步测试|
|src/ui/desktop.js:6|defaults|{       motion: "full",       speed: 1,       pageMotion: true,       itemFx: true,       systemMotion: true,       knowledge: true,       itemTip: true,       |需要进一步测试|
|src/ui/desktop.js:20|preferences|{ ...defaults }|需要进一步测试|
|src/ui/desktop.js:21|bank|M.examples|需要进一步测试|
|src/ui/desktop.js:22|ready|false|需要进一步测试|
|src/ui/desktop.js:23|activeSettings|"rules"|需要进一步测试|
|src/ui/desktop.js:24|archiveSearch|""|需要进一步测试|
|src/ui/desktop.js:25|archiveSort|"new"|需要进一步测试|
|src/ui/desktop.js:26|lastWelcome|""|需要进一步测试|
|src/ui/desktop.js:27|animations|new Set()|需要进一步测试|
|src/ui/desktop.js:28|settingsAnimations|new Set()|需要进一步测试|
|src/ui/desktop.js:29|paths|{     home: "M3 10 12 3l9 7v11h-6v-7H9v7H3Z",     battle: "m5 3 16 16m0-16L5 19M3 15l6 6m6-18 6 6",     history: "M3 12a9 9 0 1 0 3-7M3 3v6h6m3-2v5l3 2",     ar|需要进一步测试|
|src/ui/desktop.js:96|a|el.animate(frames, {       duration: 240 / preferences.speed,       easing: motionEase(),       ...options,     })|需要进一步测试|
|src/ui/desktop.js:105|pageMotionFrame|null|需要进一步测试|
|src/ui/desktop.js:113|a||需要进一步测试|
|src/ui/desktop.js:132|viewportSignature|""|需要进一步测试|
|src/ui/desktop.js:134|zoom|Number(getComputedStyle(document.body).zoom) ／／ 1|需要进一步测试|
|src/ui/desktop.js:135|value|${innerWidth}/${innerHeight}/${zoom}|需要进一步测试|
|src/ui/desktop.js:147|historyEntryPending|false|需要进一步测试|
|src/ui/desktop.js:148|archiveEntryPending|false|需要进一步测试|
|src/ui/desktop.js:151|pageScope|window.GodPowerPageLifecycle?.enter(name).scope|需要进一步测试|
|src/ui/desktop.js:157|m||需要进一步测试|
|src/ui/desktop.js:166|dock|$(".bottom-dock")|需要进一步测试|
|src/ui/desktop.js:183|enterPage|() => {         pageMotionFrame = null;         if (currentView !== name ／／ !preferences.pageMotion) return;         const selectors = {           welcome:     |需要进一步测试|
|src/ui/desktop.js:186|selectors|{           welcome:             ".gp-hero,.gp-kpis,.gp-main-grid,.gp-group-section,.gp-daily-grid",           battle:             "#heightResizerDock,#groupLis|需要进一步测试|
|src/ui/desktop.js:197|host|$(#view-${name})|需要进一步测试|
|src/ui/desktop.js:198|targets|[           ...host.querySelectorAll(selectors[name] ／／ ":scope"),         ].slice(0, 18)|需要进一步测试|
|src/ui/desktop.js:202|animation|animate(             el,             [               {                 opacity: 0,                 translate: preferences.motion === "full" ? "0 -10px" : "0 -3p|需要进一步测试|
|src/ui/desktop.js:229|track|$("#uiGroupTrack")|需要进一步测试|
|src/ui/desktop.js:234|groups|state.groups ／／ []|需要进一步测试|
|src/ui/desktop.js:235|sorted|[...groups].sort((a, b) => Number(b.score) - Number(a.score))|需要进一步测试|
|src/ui/desktop.js:236|mask|Number(state.itemGlobal?.blooperUntil ／／ 0) > Date.now()|需要进一步测试|
|src/ui/desktop.js:237|signature|JSON.stringify(         groups.map((g) => [           g.id,           g.name,           g.score,           g.color,           g.inventory,           g.itemEffec|需要进一步测试|
|src/ui/desktop.js:252|x|track.scrollLeft|需要进一步测试|
|src/ui/desktop.js:256|item|g.inventory?.[0]|需要进一步测试|
|src/ui/desktop.js:257|states|Object.entries(g.itemEffect ／／ {})                   .filter(                     ([k, v]) =>                       (k === "type" && !!v) ／／                    |需要进一步测试|
|src/ui/desktop.js:302|t|$("#uiGroupTrack")|需要进一步测试|
|src/ui/desktop.js:304|overflow|t.scrollWidth > t.clientWidth + 2|需要进一步测试|
|src/ui/desktop.js:310|visualSnapshot|new Map()|需要进一步测试|
|src/ui/desktop.js:312|next|new Map()|需要进一步测试|
|src/ui/desktop.js:313|g||需要进一步测试|
|src/ui/desktop.js:314|current|{         main: g.inventory?.[0]?.key ／／ "",         inventory: JSON.stringify(g.inventory ／／ []),         effect: JSON.stringify(g.itemEffect ／／ null),        |需要进一步测试|
|src/ui/desktop.js:320|prior|visualSnapshot.get(g.id)|需要进一步测试|
|src/ui/desktop.js:350|dailySignature|""|需要进一步测试|
|src/ui/desktop.js:351|dailyOffsets|{ knowledge: 0, challenges: 0 }|需要进一步测试|
|src/ui/desktop.js:352|quizAttempt|{ key: "", answer: null, correct: false }|需要进一步测试|
|src/ui/desktop.js:354|host|$("#uiDailyGrid")|需要进一步测试|
|src/ui/desktop.js:356|history|getSettlementHistory()|需要进一步测试|
|src/ui/desktop.js:357|signature|M.dayIndex() +         JSON.stringify([           preferences.knowledge,           preferences.itemTip,           preferences.honors,           preferences.chal|需要进一步测试|
|src/ui/desktop.js:372|knowledge|M.daily(         bank.knowledge.filter((x) => x.subject === preferences.subject),         new Date(),         dailyOffsets.knowledge,       )|需要进一步测试|
|src/ui/desktop.js:377|quiz|M.daily(         bank.challenges.filter((x) => x.subject === preferences.subject),         new Date(),         dailyOffsets.challenges,       )|需要进一步测试|
|src/ui/desktop.js:382|keys|Object.keys(ITEM_DEFS)|需要进一步测试|
|src/ui/desktop.js:383|key|M.daily(keys)|需要进一步测试|
|src/ui/desktop.js:384|item|ITEM_DEFS[key]|需要进一步测试|
|src/ui/desktop.js:385|last|history[0]|需要进一步测试|
|src/ui/desktop.js:386|winner|last?.groups?.[0]|需要进一步测试|
|src/ui/desktop.js:387|quizKey|[       M.dayIndex(),       preferences.subject,       dailyOffsets.challenges,       quiz?.id,     ].join(":")|需要进一步测试|
|src/ui/desktop.js:395|html|""|需要进一步测试|
|src/ui/desktop.js:406|[selector, kind]||需要进一步测试|
|src/ui/desktop.js:410|next|host.querySelector(selector)|需要进一步测试|
|src/ui/desktop.js:462|host|$("#historyListView")|需要进一步测试|
|src/ui/desktop.js:477|next|historyStack[i + 1] ／／ state|需要进一步测试|
|src/ui/desktop.js:478|diffs|M.differences(h, next)|需要进一步测试|
|src/ui/desktop.js:479|[kind, glyph, label]|historyKind(h.desc)|需要进一步测试|
|src/ui/desktop.js:480|changed|diffs.filter(             (d) =>               d.delta ／／               d.added ／／               d.removed ／／               JSON.stringify(d.inventoryBefore) !=|需要进一步测试|
|src/ui/desktop.js:514|index|Number(b.dataset.restore)|需要进一步测试|
|src/ui/desktop.js:515|target|historyStack[index]|需要进一步测试|
|src/ui/desktop.js:517|ok|await themeConfirm(             恢复到 ${target.time ／／ "未记录时间"}「${target.desc ／／ "未命名操作"}」之前？将恢复小组、积分、道具、持续状态与快照包含的回合字段，并丢弃此节点及其后 ${historyStack.length - index -|需要进一步测试|
|src/ui/desktop.js:531|records|getSettlementHistory()|需要进一步测试|
|src/ui/desktop.js:532|all|records       .flatMap((x) => (Array.isArray(x.groups) ? x.groups : []))       .filter(         (g) =>           (typeof g.score === "number" ／／             (ty|需要进一步测试|
|src/ui/desktop.js:540|best|all.length       ? Math.max(...all.map((g) => Number(g.score)))       : null|需要进一步测试|
|src/ui/desktop.js:557|host|$("#settlementHistoryContainer")|需要进一步测试|
|src/ui/desktop.js:559|list|records       .map((r, index) => ({ r, index }))       .filter(({ r }) =>         [r.title, r.champion, ...(r.groups ／／ []).map((g) => g.name)]           .join(|需要进一步测试|
|src/ui/desktop.js:579|groups|Array.isArray(r.groups) ? r.groups : []|需要进一步测试|
|src/ui/desktop.js:639|url|URL.createObjectURL(         new Blob([JSON.stringify(value, null, 2)], {           type: "application/json",         }),       )|需要进一步测试|
|src/ui/desktop.js:644|a|document.createElement("a")|需要进一步测试|
|src/ui/desktop.js:650|categories|[     ["rules", "battle", "课堂与比赛规则", "沿用现有规则与即时保存方式"],     ["appearance", "home", "外观与界面", "壁纸、显示模式与视图比例"],     ["motion", "spark", "动画与特效", "可中断的界面动效，不影响业务结果"]|需要进一步测试|
|src/ui/desktop.js:670|sc|$("#view-settings .settings-scroll")|需要进一步测试|
|src/ui/desktop.js:672|shell|document.createElement("div")|需要进一步测试|
|src/ui/desktop.js:676|sections|Object.fromEntries(       [...shell.querySelectorAll("[data-category-panel]")].map((p) => [         p.dataset.categoryPanel,         p,       ]),     )|需要进一步测试|
|src/ui/desktop.js:686|classified|[...sc.querySelectorAll("[data-settings-category]")]|需要进一步测试|
|src/ui/desktop.js:687|pane||需要进一步测试|
|src/ui/desktop.js:688|id|pane.id.replace("settingsV26_", "")|需要进一步测试|
|src/ui/desktop.js:695|el||需要进一步测试|
|src/ui/desktop.js:697|buttonIcons|$("#uiIconManagerV26")?.parentElement|需要进一步测试|
|src/ui/desktop.js:712|check|(key) =>       <input id="uiPref-${key}" data-pref="${key}" type="checkbox" ${preferences[key] ? "checked" : ""}>|需要进一步测试|
|src/ui/desktop.js:759|danger|[...sections.data.querySelectorAll("button")].filter((b) =>       /resetAllScores／clear/.test(b.getAttribute("onclick") ／／ ""),     )|需要进一步测试|
|src/ui/desktop.js:762|b||需要进一步测试|
|src/ui/desktop.js:766|key||需要进一步测试|
|src/ui/desktop.js:773|key|el.dataset.pref|需要进一步测试|
|src/ui/desktop.js:841|bankBody|$("#uiSettingsBank .ui-settings-detail-body")|需要进一步测试|
|src/ui/desktop.js:842|structured|document.createElement("div")|需要进一步测试|
|src/ui/desktop.js:849|next|M.validateBank(candidate)|需要进一步测试|
|src/ui/desktop.js:860|host|$("#uiStructuredBank")|需要进一步测试|
|src/ui/desktop.js:879|kind|button.dataset.bankDelete|需要进一步测试|
|src/ui/desktop.js:880|index|Number(button.dataset.index)|需要进一步测试|
|src/ui/desktop.js:881|row|bank[kind][index]|需要进一步测试|
|src/ui/desktop.js:890|next|JSON.parse(JSON.stringify(bank))|需要进一步测试|
|src/ui/desktop.js:901|file|event.target.files?.[0]|需要进一步测试|
|src/ui/desktop.js:915|row|index < 0         ? {             id: "",             subject: preferences.subject,             title: "",             source: "",             options: ["", "",|需要进一步测试|
|src/ui/desktop.js:926|fields|kind === "knowledge"         ? [             ["id", "唯一 ID"],             ["subject", "学科"],             ["title", "知识标题"],             ["module", "模块"],       |需要进一步测试|
|src/ui/desktop.js:945|host|$("#uiBankForm")|需要进一步测试|
|src/ui/desktop.js:951|data|new FormData(event.target)|需要进一步测试|
|src/ui/desktop.js:952|edited|{ ...row }|需要进一步测试|
|src/ui/desktop.js:960|next|JSON.parse(JSON.stringify(bank))|需要进一步测试|
|src/ui/desktop.js:981|box|document.createElement(collapsed ? "details" : "div")|需要进一步测试|
|src/ui/desktop.js:990|body|box.lastElementChild|需要进一步测试|
|src/ui/desktop.js:995|marked|(name) => [       ...shell.querySelectorAll([data-settings-group="${name}"]),     ]|需要进一步测试|
|src/ui/desktop.js:1021|icons|$("#uiIconManagerV26")?.parentElement|需要进一步测试|
|src/ui/desktop.js:1040|rosterTitle|$(       "#uiSettingsRoster [data-settings-group='roster']:not(.setting-item)",     )|需要进一步测试|
|src/ui/desktop.js:1044|sound|$("#settingsV26_sound")|需要进一步测试|
|src/ui/desktop.js:1045|itemSounds|$("#itemFxSoundListV26")?.parentElement|需要进一步测试|
|src/ui/desktop.js:1073|editor|$("#uiBankEditor")|需要进一步测试|
|src/ui/desktop.js:1074|bankNodes|[       editor.previousElementSibling.previousElementSibling,       editor.previousElementSibling,       editor,       editor.nextElementSibling,       $("#uiBa|需要进一步测试|
|src/ui/desktop.js:1089|data|$("#settingsV26_data")|需要进一步测试|
|src/ui/desktop.js:1117|button|event.target.closest("button")|需要进一步测试|
|src/ui/desktop.js:1118|action|button?.getAttribute("onclick")|需要进一步测试|
|src/ui/desktop.js:1119|confirm|{           "applySettingsBatchMembers()": [             "重建小组与名单",             "将按文本重建全部小组。未列出的组会移除，改名可能建立新组。请先导出课堂备份。确认应用？",             applySettingsBatchMem|需要进一步测试|
|src/ui/desktop.js:1153|el|$("#uiPref-subject")|需要进一步测试|
|src/ui/desktop.js:1155|subjects|[       ...new Set([         "politics",         ...bank.knowledge.map((x) => x.subject),         ...bank.challenges.map((x) => x.subject),       ]),     ]|需要进一步测试|
|src/ui/desktop.js:1173|animation||需要进一步测试|
|src/ui/desktop.js:1183|panel|$([data-category-panel="${activeSettings}"])|需要进一步测试|
|src/ui/desktop.js:1185|content|[...panel.children]       .flatMap((node) =>         node.matches(".settings-v26-pane") ? [...node.children] : [node],       )       .filter((node) => !node.hid|需要进一步测试|
|src/ui/desktop.js:1190|targets|entering       ? [$(".ui-settings-header"), $(".ui-settings-nav"), ...content]       : content|需要进一步测试|
|src/ui/desktop.js:1193|simple|preferences.motion === "simple"|需要进一步测试|
|src/ui/desktop.js:1195|animation|animate(         node,         [           {             opacity: simple ? 0.6 : 0,             translate: simple ? "0 -4px" : "0 -12px",           },          |需要进一步测试|
|src/ui/desktop.js:1226|aliases|{ function: "rules" }|需要进一步测试|
|src/ui/desktop.js:1255|right|$(".dock-right")|需要进一步测试|
|src/ui/desktop.js:1256|details|document.createElement("details")|需要进一步测试|
|src/ui/desktop.js:1260|menu|details.lastElementChild|需要进一步测试|
|src/ui/desktop.js:1261|b||需要进一步测试|
|src/ui/desktop.js:1262|action|b.getAttribute("onclick") ／／ ""|需要进一步测试|
|src/ui/desktop.js:1263|keep|/globalItemDraw／openHandRaise／openPickerModal／undoLast/.test(         action,       )|需要进一步测试|
|src/ui/desktop.js:1266|label|/globalItemDraw/.test(action)         ? "道具"         : /openHandRaise/.test(action)           ? "举手"           : /openPickerModal/.test(action)             ? "点|需要进一步测试|
|src/ui/desktop.js:1307|final|$("#btnFinalSettlement")|需要进一步测试|
|src/ui/desktop.js:1324|label|state.isLocked ? "解锁管理口令" : "管理已解锁"|需要进一步测试|
|src/ui/desktop.js:1325|original|icon("shield") + <span>${label}</span>|需要进一步测试|
|src/ui/desktop.js:1327|image|Reliability.safeImage(uiIconsV26().dock_lock)|需要进一步测试|
|src/ui/desktop.js:1333|disclosureMotions|new Map()|需要进一步测试|
|src/ui/desktop.js:1335|entry|disclosureMotions.get(details)|需要进一步测试|
|src/ui/desktop.js:1343|details||需要进一步测试|
|src/ui/desktop.js:1347|summary|event.target.closest("summary")|需要进一步测试|
|src/ui/desktop.js:1348|details|summary?.parentElement|需要进一步测试|
|src/ui/desktop.js:1358|nextOpen|!(disclosureMotions.get(details)?.open ?? details.open)|需要进一步测试|
|src/ui/desktop.js:1359|from|details.getBoundingClientRect().height|需要进一步测试|
|src/ui/desktop.js:1361|overflow|details.style.overflow|需要进一步测试|
|src/ui/desktop.js:1363|collapsed|details.getBoundingClientRect().height|需要进一步测试|
|src/ui/desktop.js:1365|expanded|details.getBoundingClientRect().height|需要进一步测试|
|src/ui/desktop.js:1367|entry|{ open: nextOpen, overflow, animation: null }|需要进一步测试|
|src/ui/desktop.js:1381|finish|() => {         if (disclosureMotions.get(details) === entry) settleDisclosure(details);       }|需要进一步测试|
|src/ui/desktop.js:1388|modalClosers|{     classroomShowcase: () => ClassroomFeedback.dismiss(),     programConfirmV28: () => document.getElementById("pcCancelV28")?.click(),     welcomeModal: () =|需要进一步测试|
|src/ui/desktop.js:1406|closingWindows|new Map()|需要进一步测试|
|src/ui/desktop.js:1408|pending|closingWindows.get(root)|需要进一步测试|
|src/ui/desktop.js:1418|pending|closingWindows.get(root)|需要进一步测试|
|src/ui/desktop.js:1428|surface|root.querySelector(".ui-function-surface")|需要进一步测试|
|src/ui/desktop.js:1439|visual|getComputedStyle(surface)|需要进一步测试|
|src/ui/desktop.js:1440|from|{       opacity: visual.opacity,       translate: visual.translate,       scale: visual.scale,     }|需要进一步测试|
|src/ui/desktop.js:1445|backdropOpacity|getComputedStyle(root).opacity|需要进一步测试|
|src/ui/desktop.js:1447|pending|{       finish,       inert: root.inert,       animation: null,       backdrop: null,     }|需要进一步测试|
|src/ui/desktop.js:1493|openStack|[]|需要进一步测试|
|src/ui/desktop.js:1494|modalLayer|300000|需要进一步测试|
|src/ui/desktop.js:1496|known|new Map()|需要进一步测试|
|src/ui/desktop.js:1503|target|[         ...top.el.querySelectorAll(           'input:not([type=hidden]),button,select,textarea,[tabindex="0"]',         ),       ].find((el) => !el.disabled &|需要进一步测试|
|src/ui/desktop.js:1513|top|openStack.at(-1)|需要进一步测试|
|src/ui/desktop.js:1520|item|openStack.find((x) => x.id === id)|需要进一步测试|
|src/ui/desktop.js:1529|top|openStack.at(-1)|需要进一步测试|
|src/ui/desktop.js:1542|[id, close]||需要进一步测试|
|src/ui/desktop.js:1543|el|document.getElementById(id)|需要进一步测试|
|src/ui/desktop.js:1550|visible|!el.hasAttribute("data-native-detached") &&           (el.open ／／             el.classList.contains("active") ／／             el.classList.contains("show") ／／   |需要进一步测试|
|src/ui/desktop.js:1558|surface|el.querySelector(".ui-function-surface") ／／ el.firstElementChild|需要进一步测试|
|src/ui/desktop.js:1561|old||需要进一步测试|
|src/ui/desktop.js:1568|button|document.createElement("button")|需要进一步测试|
|src/ui/desktop.js:1581|focus|document.activeElement|需要进一步测试|
|src/ui/desktop.js:1583|previousZ|el.style.zIndex|需要进一步测试|
|src/ui/desktop.js:1584|previousLayer|el.style.getPropertyValue("--ui-modal-layer")|需要进一步测试|
|src/ui/desktop.js:1585|layer|String(++modalLayer)|需要进一步测试|
|src/ui/desktop.js:1589|dialog|el.firstElementChild?.tagName === "CANVAS"               ? el.querySelector(".grand-card")               : el.firstElementChild|需要进一步测试|
|src/ui/desktop.js:1608|zoom|Number(getComputedStyle(document.body).zoom) ／／ 1|需要进一步测试|
|src/ui/desktop.js:1609|travel|Math.min(               preferences.motion === "full" ? 42 : 8,               Math.max(                 0,                 (innerHeight - dialog.getBoundingClie|需要进一步测试|
|src/ui/desktop.js:1654|top|openStack.at(-1)|需要进一步测试|
|src/ui/desktop.js:1671|top|openStack.at(-1)|需要进一步测试|
|src/ui/desktop.js:1680|nodes|[             ...top.el.querySelectorAll(               'button,input,select,textarea,a[href],[tabindex="0"]',             ),           ].filter(             (x|需要进一步测试|
|src/ui/desktop.js:1691|first|nodes[0]|需要进一步测试|
|src/ui/desktop.js:1692|last|nodes.at(-1)|需要进一步测试|
|src/ui/desktop.js:1714|pickerGeneration|0|需要进一步测试|
|src/ui/desktop.js:1715|pickerPreparing|false|需要进一步测试|
|src/ui/desktop.js:1716|pickerRevealing|false|需要进一步测试|
|src/ui/desktop.js:1717|pickerReelRestores|[]|需要进一步测试|
|src/ui/desktop.js:1721|restore||需要进一步测试|
|src/ui/desktop.js:1730|button|$("#btnSlotTrigger")|需要进一步测试|
|src/ui/desktop.js:1736|modal|$("#pickerModal")|需要进一步测试|
|src/ui/desktop.js:1737|a||需要进一步测试|
|src/ui/desktop.js:1752|generation|++pickerGeneration|需要进一步测试|
|src/ui/desktop.js:1754|button|$("#btnSlotTrigger")|需要进一步测试|
|src/ui/desktop.js:1774|win|slotEngine.chosenResult|需要进一步测试|
|src/ui/desktop.js:1775|generation|pickerGeneration|需要进一步测试|
|src/ui/desktop.js:1776|modal|$("#pickerModal")|需要进一步测试|
|src/ui/desktop.js:1777|badge|$("#slotSubBadge")|需要进一步测试|
|src/ui/desktop.js:1778|button|$("#btnSlotTrigger")|需要进一步测试|
|src/ui/desktop.js:1781|label|badge.textContent|需要进一步测试|
|src/ui/desktop.js:1782|complete|() => {       if (         !isPickerCurrent(generation) ／／         slotEngine.chosenResult !== win ／／         slotEngine.isSpinning       )         return;     |需要进一步测试|
|src/ui/desktop.js:1810|pending|[]|需要进一步测试|
|src/ui/desktop.js:1811|pendingActual|[]|需要进一步测试|
|src/ui/desktop.js:1814|actual|frame.querySelector(".slot-reel-text")|需要进一步测试|
|src/ui/desktop.js:1815|isGroup|frame.id === "reelFrameGroup"|需要进一步测试|
|src/ui/desktop.js:1816|live|ClassroomFeedback.takeLive(frame)|需要进一步测试|
|src/ui/desktop.js:1817|candidates|isGroup         ? state.groups.map((g) => ({ raw: g.name, group: g }))         : state.groups.flatMap((g) =>             (g.members ／／ []).map((raw) => ({ raw, |需要进一步测试|
|src/ui/desktop.js:1822|height|frame.clientHeight|需要进一步测试|
|src/ui/desktop.js:1823|strip|document.createElement("div")|需要进一步测试|
|src/ui/desktop.js:1827|i|0|需要进一步测试|
|src/ui/desktop.js:1828|row|document.createElement("span")|需要进一步测试|
|src/ui/desktop.js:1829|list|live?.rows ／／ candidates|需要进一步测试|
|src/ui/desktop.js:1830|candidate|list[((live?.index ／／ 0) + i) % Math.max(1, list.length)]|需要进一步测试|
|src/ui/desktop.js:1833|node||需要进一步测试|
|src/ui/desktop.js:1844|visibility|live ? live.visibility : actual.style.visibility|需要进一步测试|
|src/ui/desktop.js:1852|a|animate(         strip,         [           { transform: translateY(-${(live?.fraction ／／ 0) * height}px) },           { transform: translateY(-${height * 6}|需要进一步测试|
|src/ui/desktop.js:1872|target|pickerTargetGroup()|需要进一步测试|
|src/ui/desktop.js:1873|valid|!!target &&       state.groups.some((g) => g.id === target.id) &&       !slotEngine.isSpinning &&       !pickerRevealing|需要进一步测试|
|src/ui/desktop.js:1892|left|$(".picker-left-v2")|需要进一步测试|
|src/ui/desktop.js:1893|right|$(".picker-right-v2")|需要进一步测试|
|src/ui/desktop.js:1894|options|$(".slot-options-row")|需要进一步测试|
|src/ui/desktop.js:1896|tabs|$(".picker-info-tabs")|需要进一步测试|
|src/ui/desktop.js:1897|info|$("#pickerInfoBox")|需要进一步测试|
|src/ui/desktop.js:1899|stats|$("#pickerStatsBtn")|需要进一步测试|
|src/ui/desktop.js:1904|target|$("#pickerScoreTarget")|需要进一步测试|
|src/ui/desktop.js:1912|settlementBusy|false|需要进一步测试|
|src/ui/desktop.js:1913|settlementGeneration|0|需要进一步测试|
|src/ui/desktop.js:1916|status|$("#uiSettlementStatus")|需要进一步测试|
|src/ui/desktop.js:1924|generation|settlementGeneration|需要进一步测试|
|src/ui/desktop.js:1928|text|button.textContent|需要进一步测试|
|src/ui/desktop.js:1930|status|$("#uiSettlementStatus")|需要进一步测试|
|src/ui/desktop.js:1944|result|confirmFinalSettlement()|需要进一步测试|
|src/ui/desktop.js:1959|value|JSON.parse(         localStorage.getItem("godpower_ui_preferences_v1") ／／ "{}",       )|需要进一步测试|
|src/ui/desktop.js:1962|key||需要进一步测试|
|src/ui/desktop.js:1973|saved|localStorage.getItem("godpower_ui_bank_v1")|需要进一步测试|
|src/ui/desktop.js:1996|text|["欢迎", "比赛", "历史", "档案", "插件", "设置"][i]|需要进一步测试|
|src/ui/desktop.js:2005|el|$(selector)|需要进一步测试|
|src/ui/desktop.js:2017|details|event.target|需要进一步测试|
|src/ui/desktop.js:2020|a||需要进一步测试|
|src/ui/desktop.js:2037|t|$("#uiGroupTrack")|需要进一步测试|
|src/ui/desktop.js:2048|next|Math.max(           0,           Math.min(t.scrollWidth - t.clientWidth, t.scrollLeft + e.deltaY),         )|需要进一步测试|
|src/ui/desktop.js:2132|control|$("#uiPref-groupCruise")|需要进一步测试|
|src/ui/desktop.js:2134|saved|persistPreferences()|需要进一步测试|
|src/ui/model.js:3|examples|{     knowledge: [       {         id: "politics-rule-law",         subject: "politics",         title: "权利与义务",         module: "政治 · 法治观念",         summary: "|需要进一步测试|
|src/ui/model.js:74|a|new Map((before.groups ／／ []).map((g) => [g.id, g]))|需要进一步测试|
|src/ui/model.js:75|b|new Map((after.groups ／／ []).map((g) => [g.id, g]))|需要进一步测试|
|src/ui/model.js:76|rank|(groups) =>       new Map(         [...groups]           .sort((x, y) => Number(y.score) - Number(x.score))           .map((g, i) => [g.id, i + 1]),       )|需要进一步测试|
|src/ui/model.js:82|ra|rank(before.groups ／／ [])|需要进一步测试|
|src/ui/model.js:83|rb|rank(after.groups ／／ [])|需要进一步测试|
|src/ui/model.js:85|x|a.get(id)|需要进一步测试|
|src/ui/model.js:86|y|b.get(id)|需要进一步测试|
|src/ui/model.js:120|ids|new Set()|需要进一步测试|
|src/ui/model.js:121|row||需要进一步测试|
|src/ui/model.js:136|field||需要进一步测试|
|src/ui/model.js:146|q||需要进一步测试|
|src/ui/model.js:164|scores|ordered.map((g) => Number(g.score) ／／ 0)|需要进一步测试|
|src/ui/model.js:165|total|scores.every(Number.isSafeInteger)       ? scores.reduce((sum, value) => sum + BigInt(value), 0n).toString()       : String(scores.reduce((sum, value) => sum + |需要进一步测试|
|src/ui/model.js:177|raw|String(color ／／ "").replace(/^#/, "")|需要进一步测试|
|src/ui/model.js:185|rgb|raw.match(/../g).map((v) => parseInt(v, 16))|需要进一步测试|
|src/ui/model.js:186|luminance|(values) =>       values         .map((v) => v / 255)         .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))         .reduce((sum, v, i)|需要进一步测试|
|src/ui/model.js:191|saturated|Math.max(...rgb) - Math.min(...rgb) >= 40|需要进一步测试|
|src/ui/model.js:192|shade|[...rgb]|需要进一步测试|
|src/core/action-sounds.js:2|ActionSounds|(() => {   const definitions = [     ["nav", "页面导航", "导航与窗口", 1040],     ["open", "打开功能窗口", "导航与窗口", 960],     ["close", "关闭与返回", "导航与窗口", 760],     ["expand", |需要进一步测试|
|src/core/action-sounds.js:3|definitions|[     ["nav", "页面导航", "导航与窗口", 1040],     ["open", "打开功能窗口", "导航与窗口", 960],     ["close", "关闭与返回", "导航与窗口", 760],     ["expand", "展开与收起", "导航与窗口", 880],     ["a|需要进一步测试|
|src/core/action-sounds.js:27|slots|definitions.map(([key, name, category, pitch]) => ({     id: "ui_button_" + key,     name,     category,     pitch,     desc: "独立按钮音效；未上传时继承通用按钮音效",   }))|需要进一步测试|
|src/core/action-sounds.js:34|isClick|(id) => id === "ui_click" ／／ slots.some((x) => x.id === id)|需要进一步测试|
|src/core/action-sounds.js:36|explicit|button.dataset.soundSlot|需要进一步测试|
|src/core/action-sounds.js:38|code|button.getAttribute("onclick") ／／ button.onclick?.toString() ／／ ""|需要进一步测试|
|src/core/action-sounds.js:40|text|button.textContent.trim()|需要进一步测试|
|src/core/action-sounds.js:41|key||需要进一步测试|
|src/core/history.js:2|HistorySnapshots|{   capture(s, desc, time) {     const copy = (value) => JSON.parse(JSON.stringify(value));     return {       desc,       time,       groups: copy(s.groups),  |需要进一步测试|
|src/core/history.js:4|copy|(value) => JSON.parse(JSON.stringify(value))|需要进一步测试|
|src/core/history.js:27|snapshot|HistorySnapshots.capture(     state,     actionDesc,     new Date().toLocaleTimeString(),   )|需要进一步测试|
|src/core/history.js:43|ok|STORAGE.setJSON(V26_HISTORY_KEY, historyStack.slice(-MAX_HISTORY))|需要进一步测试|
|src/core/item-module-model.js:4|KEY|"godpower_item_modules_v1"|需要进一步测试|
|src/core/item-module-model.js:5|SCORE_KEYS|new Set([     "green",     "triple_green",     "red",     "triple_red",     "spiny",     "banana",     "triple_banana",     "horn",     "bomb",     "hammer",   |需要进一步测试|
|src/core/item-module-model.js:26|copy|(value) => JSON.parse(JSON.stringify(value))|需要进一步测试|
|src/core/item-module-model.js:28|keys|Object.keys(definitions)|需要进一步测试|
|src/core/item-module-model.js:29|defaults|() => ({       schemaVersion: 1,       items: Object.fromEntries(         keys.map((key) => [           key,           {             draw: {               enabl|需要进一步测试|
|src/core/item-module-model.js:59|result|defaults()|需要进一步测试|
|src/core/item-module-model.js:60|key||需要进一步测试|
|src/core/item-module-model.js:61|item|raw.items[key]|需要进一步测试|
|src/core/item-module-model.js:67|d|item.draw|需要进一步测试|
|src/core/item-module-model.js:68|o|item.operation|需要进一步测试|
|src/core/item-module-model.js:113|config|defaults()|需要进一步测试|
|src/core/item-module-model.js:114|activeKey|null|需要进一步测试|
|src/core/item-module-model.js:115|loadError|null|需要进一步测试|
|src/core/item-module-model.js:118|text|storage.getItem(KEY)|需要进一步测试|
|src/core/item-module-model.js:123|forKey|(key) => config.items[key]|需要进一步测试|
|src/core/item-module-model.js:125|next|validate(raw)|需要进一步测试|
|src/core/item-module-model.js:132|factor|forKey(key ／／ activeKey)?.operation.scoreMultiplier ?? 1|需要进一步测试|
|src/core/item-module-model.js:134|next|factor === 1           ? delta           : Math.sign(delta) * Math.round(Math.abs(delta) * factor)|需要进一步测试|
|src/core/item-module-model.js:180|charges|forKey(key).draw.charges|需要进一步测试|
|src/core/item-module-model.js:194|prev|activeKey|需要进一步测试|
|src/core/item-score.js:9|result||需要进一步测试|
|src/core/item-score.js:15|before|target.score|需要进一步测试|
|src/core/item-score.js:21|liveState|state|需要进一步测试|
|src/core/item-score.js:41|before|target ? Number(target.score) ／／ 0 : null|需要进一步测试|
|src/core/item-score.js:44|result||需要进一步测试|
|src/core/item-score.js:47|main|target.inventory?.[0]|需要进一步测试|
|src/core/item-score.js:76|isAttack|delta < 0|需要进一步测试|
|src/core/picker-bridge.js:4|phase|'idle'|需要进一步测试|
|src/core/picker-bridge.js:4|serial|0|需要进一步测试|
|src/core/picker-bridge.js:4|resultId|null|需要进一步测试|
|src/core/picker-bridge.js:4|preparing|false|需要进一步测试|
|src/core/picker-bridge.js:4|external|false|需要进一步测试|
|src/core/picker-bridge.js:5|listeners|new Set()|需要进一步测试|
|src/core/picker-bridge.js:10|snapshot|getSnapshot()|需要进一步测试|
|src/core/picker-bridge.js:11|listener||需要进一步测试|
|src/core/picker-bridge.js:15|win|slotEngine.chosenResult|需要进一步测试|
|src/core/picker-bridge.js:17|source|state.picker.mode === 'group' ? win : win.group|需要进一步测试|
|src/core/picker-bridge.js:18|group|state.groups.find(g => g.id === source?.id)|需要进一步测试|
|src/core/picker-bridge.js:20|student|state.picker.mode === 'group' ? null : parseStudentV218(win.memberName)|需要进一步测试|
|src/core/picker-bridge.js:27|actual|slotEngine.isSpinning ? 'rolling' : phase|需要进一步测试|
|src/core/picker-bridge.js:28|result|['settling', 'revealed'].includes(actual) ? currentResult() : null|需要进一步测试|
|src/core/picker-bridge.js:29|options|ClassroomFeedback.getOptions()|需要进一步测试|
|src/core/picker-bridge.js:29|motion|DesktopUI.getPreferences()|需要进一步测试|
|src/core/picker-bridge.js:30|effectEnabled|options.pickEffects && motion.motion !== 'off' &&       !(motion.systemMotion && matchMedia('(prefers-reduced-motion: reduce)').matches)|需要进一步测试|
|src/core/picker-bridge.js:78|result|currentResult()|需要进一步测试|
|src/core/picker-bridge.js:78|delta|payload.delta|需要进一步测试|
|src/ui/battle-grid.js:3|grid|document.getElementById("groupList")|需要进一步测试|
|src/ui/battle-grid.js:6|animateReorder|!v213SkipNextReorderAnimation && !v213SuppressReorderAnimation|需要进一步测试|
|src/ui/battle-grid.js:13|oldOrderIds|[     ...grid.querySelectorAll(".group-row-card[data-group-id]"),   ].map((c) => String(c.dataset.groupId))|需要进一步测试|
|src/ui/battle-grid.js:17|oldRects|new Map()|需要进一步测试|
|src/ui/battle-grid.js:20|rect|c.getBoundingClientRect()|需要进一步测试|
|src/ui/battle-grid.js:32|ordered|desiredGroupsV213()|需要进一步测试|
|src/ui/battle-grid.js:33|newOrderIds|ordered.map((g) => String(g.id))|需要进一步测试|
|src/ui/battle-grid.js:34|orderActuallyChanged|animateReorder &&     oldOrderIds.length === newOrderIds.length &&     oldOrderIds.some((id, i) => id !== newOrderIds[i])|需要进一步测试|
|src/ui/battle-grid.js:41|rankReorderAnimationV21723|orderActuallyChanged|需要进一步测试|
|src/ui/battle-grid.js:44|rowCard|document.createElement("div")|需要进一步测试|
|src/ui/battle-grid.js:49|badge|GodpowerUIModel.badgeColors(g.color)|需要进一步测试|
|src/ui/battle-grid.js:52|roundClass|state.roundActive && !state.evaluated ? "" : "round-disabled"|需要进一步测试|
|src/ui/battle-grid.js:54|optionsHtml|["A", "B", "C", "D"]       .map((opt) => {         let cls = "opt-btn";         if (g.selectedOpt === opt) cls += " active";         if (state.evaluated && g.se|需要进一步测试|
|src/ui/battle-grid.js:56|cls|"opt-btn"|需要进一步测试|
|src/ui/battle-grid.js:66|rawScore|g.displayScore !== undefined ? g.displayScore : g.score|需要进一步测试|
|src/ui/battle-grid.js:67|editCls|state.isLocked ? "" : "editable"|需要进一步测试|
|src/ui/battle-grid.js:68|scoreHtml|state.editingScoreId === g.id         ? <input type="number" class="score-input" id="input-score-${g.id}" value="${g.score}" onblur="finishDirectScoreEdit(${g.|需要进一步测试|
|src/ui/battle-grid.js:72|allInClass|g.allIn ? "allin-toggle-btn active" : "allin-toggle-btn"|需要进一步测试|
|src/ui/battle-grid.js:73|allInText|g.allIn ? "🔥 ALL IN" : "ALL IN"|需要进一步测试|
|src/ui/battle-grid.js:74|lockAttr|state.isLocked ? "locked-disabled" : ""|需要进一步测试|
|src/ui/battle-grid.js:76|slotsHtml|[0, 1, 2]       .map((i) => {         const it = g.inventory?.[i];         return it           ? <div class="item-slot ${i === 0 ? "queue-main-slot" : "queue-s|需要进一步测试|
|src/ui/battle-grid.js:78|it|g.inventory?.[i]|需要进一步测试|
|src/ui/battle-grid.js:105|card|grid.querySelector(.group-row-card[data-group-id="${g.id}"])|需要进一步测试|
|src/ui/battle-grid.js:107|main|card.querySelector(".queue-main-slot")|需要进一步测试|
|src/ui/battle-grid.js:116|more|card.querySelector(".more-btn")|需要进一步测试|
|src/ui/battle-grid.js:125|aura|""|需要进一步测试|
|src/ui/battle-grid.js:131|a|document.createElement("div")|需要进一步测试|
|src/ui/battle-grid.js:139|input|document.getElementById(       input-score-${state.editingScoreId},     )|需要进一步测试|
|src/ui/battle-grid.js:152|moved|[]|需要进一步测试|
|src/ui/battle-grid.js:155|old|oldRects.get(String(card.dataset.groupId))|需要进一步测试|
|src/ui/battle-grid.js:157|now|card.getBoundingClientRect()|需要进一步测试|
|src/ui/battle-grid.js:158|dx|old.left - now.left|需要进一步测试|
|src/ui/battle-grid.js:159|dy|old.top - now.top|需要进一步测试|
|src/ui/battle-grid.js:197|ranks|new Map(ranking().map((g, i) => [g.id, i + 1]))|需要进一步测试|
|src/ui/battle-grid.js:201|id|Number(card.dataset.groupId)|需要进一步测试|
|src/ui/battle-grid.js:202|wrap|card.querySelector(".v213-name-wrap")|需要进一步测试|
|src/ui/battle-grid.js:204|badge|wrap.querySelector(".v214-rank-badge")|需要进一步测试|
|src/ui/battle-grid.js:211|sub|wrap.querySelector(".v213-name-sub")|需要进一步测试|
|src/ui/battle-grid.js:221|card|document.querySelector(         .group-row-card[data-group-id="${g.id}"],       )|需要进一步测试|
|src/ui/battle-grid.js:226|allIn|card.querySelector(".allin-toggle-btn")|需要进一步测试|
|src/ui/battle-grid.js:233|main|card.querySelector(".v213-main-item")|需要进一步测试|
|src/ui/battle-motion.js:2|BattleMotion|(() => {   const sessions = new Map(),     draws = new Map();   const duration = 1700,     fade = 600;   function enabled() {     const p = DesktopUI.getPrefere|需要进一步测试|
|src/ui/battle-motion.js:3|sessions|new Map()|需要进一步测试|
|src/ui/battle-motion.js:4|draws|new Map()|需要进一步测试|
|src/ui/battle-motion.js:5|duration|1700|需要进一步测试|
|src/ui/battle-motion.js:6|fade|600|需要进一步测试|
|src/ui/battle-motion.js:8|p|DesktopUI.getPreferences()|需要进一步测试|
|src/ui/battle-motion.js:20|node|document.createElement("div")|需要进一步测试|
|src/ui/battle-motion.js:26|badge|document.createElement("div")|需要进一步测试|
|src/ui/battle-motion.js:31|simple|DesktopUI.getPreferences().motion === "simple"|需要进一步测试|
|src/ui/battle-motion.js:51|id|String(gid) + ":" + kind|需要进一步测试|
|src/ui/battle-motion.js:52|prior|sessions.get(id)|需要进一步测试|
|src/ui/battle-motion.js:60|family|/fire/.test(key)       ? "fire"       : /ice/.test(key)         ? "ice"         : /lightning/.test(key)           ? "lightning"           : /green／red／spiny／she|需要进一步测试|
|src/ui/battle-motion.js:87|aliases|{       green: "green_shell",       red: "red_shell",       spiny: "spiny_shell",       horn: "super_horn",       bomb: "bob_omb",       mega: "giant_mushroom",|需要进一步测试|
|src/ui/battle-motion.js:97|color|kind === "defend"         ? "#249ad0"         : kind === "heal"           ? "#1caa73"           : CARD_HIT_COLOR[key] ／／             CARD_HIT_COLOR[aliases[key]|需要进一步测试|
|src/ui/battle-motion.js:105|session|{       id,       gid,       key,       kind,       family,       color,       label:         label ／／         (kind === "use"           ? "发动 · "           : k|需要进一步测试|
|src/ui/battle-motion.js:139|session||需要进一步测试|
|src/ui/battle-motion.js:145|draw|draws.get(String(gid))|需要进一步测试|
|src/ui/battle-motion.js:161|s||需要进一步测试|
|src/ui/battle-motion.js:167|node||需要进一步测试|
|src/ui/battle-motion.js:222|opacity|getComputedStyle(node).opacity|需要进一步测试|
|src/ui/classroom-feedback.js:2|ClassroomFeedback|(() => {   "use strict";   const KEY = "godpower_score_feedback_v1",     defaults = {       schemaVersion: 1,       slots: [1, 2, 5, -1, -2, -5],       pickEffe|需要进一步测试|
|src/ui/classroom-feedback.js:4|KEY|"godpower_score_feedback_v1"|需要进一步测试|
|src/ui/classroom-feedback.js:5|defaults|{       schemaVersion: 1,       slots: [1, 2, 5, -1, -2, -5],       pickEffects: true,       scoreEffects: true,       style: "aurora",       duration: 1800,   |需要进一步测试|
|src/ui/classroom-feedback.js:15|options|{ ...defaults, slots: [...defaults.slots] }|需要进一步测试|
|src/ui/classroom-feedback.js:16|timer|null|需要进一步测试|
|src/ui/classroom-feedback.js:17|generation|0|需要进一步测试|
|src/ui/classroom-feedback.js:18|initialized|false|需要进一步测试|
|src/ui/classroom-feedback.js:19|liveReels|new Map()|需要进一步测试|
|src/ui/classroom-feedback.js:22|slots|raw.slots ?? defaults.slots|需要进一步测试|
|src/ui/classroom-feedback.js:48|value|validate({ ...options, ...next })|需要进一步测试|
|src/ui/classroom-feedback.js:66|p|DesktopUI.getPreferences()|需要进一步测试|
|src/ui/classroom-feedback.js:75|commands|{       picker: (n) => scorePickerTarget(${n}),       hand: (n) => handQuickScore(${n}),       group: (n) => itemQuickScore(${Number(id)},${n}),       mod|需要进一步测试|
|src/ui/classroom-feedback.js:86|host||需要进一步测试|
|src/ui/classroom-feedback.js:88|kind|host.dataset.scoreSlots|需要进一步测试|
|src/ui/classroom-feedback.js:89|id|host.dataset.scoreGroup|需要进一步测试|
|src/ui/classroom-feedback.js:90|disabled|kind === "group" && state.isLocked|需要进一步测试|
|src/ui/classroom-feedback.js:91|temp|document.createElement("div")|需要进一步测试|
|src/ui/classroom-feedback.js:98|input|document.getElementById("handCustomScore")|需要进一步测试|
|src/ui/classroom-feedback.js:99|n|Number(input?.value)|需要进一步测试|
|src/ui/classroom-feedback.js:114|root|dialog()|需要进一步测试|
|src/ui/classroom-feedback.js:127|root|dialog()|需要进一步测试|
|src/ui/classroom-feedback.js:146|soundSlot|type === "pick"         ? "fullscreen_pick"         : type === "positive"           ? "fullscreen_score_add"           : "fullscreen_score_sub"|需要进一步测试|
|src/ui/classroom-feedback.js:167|root|dialog()|需要进一步测试|
|src/ui/classroom-feedback.js:169|serial|generation|需要进一步测试|
|src/ui/classroom-feedback.js:181|particles|root.querySelector(".cf-show-particles")|需要进一步测试|
|src/ui/classroom-feedback.js:182|simple|DesktopUI.getPreferences().motion === "simple"|需要进一步测试|
|src/ui/classroom-feedback.js:184|i|0|需要进一步测试|
|src/ui/classroom-feedback.js:185|dot|document.createElement("i")|需要进一步测试|
|src/ui/classroom-feedback.js:186|angle|(i / 24) * Math.PI * 2|需要进一步测试|
|src/ui/classroom-feedback.js:197|toast|document.getElementById("toast")|需要进一步测试|
|src/ui/classroom-feedback.js:218|group|mode === "group" ? win : win.group|需要进一步测试|
|src/ui/classroom-feedback.js:219|student|mode === "group" ? null : parseStudentV218(win.memberName)|需要进一步测试|
|src/ui/classroom-feedback.js:235|v|options[e.dataset.cfOption]|需要进一步测试|
|src/ui/classroom-feedback.js:261|values|[...document.querySelectorAll("[data-cf-slot]")].map(           (x) => (x.value.trim() === "" ? NaN : Number(x.value)),         )|需要进一步测试|
|src/ui/classroom-feedback.js:290|clickEvent|null|需要进一步测试|
|src/ui/classroom-feedback.js:291|clickClaimed|false|需要进一步测试|
|src/ui/classroom-feedback.js:292|clickPreview|false|需要进一步测试|
|src/ui/classroom-feedback.js:293|clickCleanup|null|需要进一步测试|
|src/ui/classroom-feedback.js:303|clickVoice|null|需要进一步测试|
|src/ui/classroom-feedback.js:315|voice|{ source, gain }|需要进一步测试|
|src/ui/classroom-feedback.js:327|button|e.target.closest?.(           "button,summary,[role=button],input[type=button],input[type=submit]",         )|需要进一步测试|
|src/ui/classroom-feedback.js:350|saved|localStorage.getItem(KEY)|需要进一步测试|
|src/ui/classroom-feedback.js:388|pre|state.picker.preselectedGroupIds ／／ []|需要进一步测试|
|src/ui/classroom-feedback.js:389|groups|state.picker.mode === "two_tier"         ? state.groups.filter(             (g) => g.members?.length && (!pre.length ／／ pre.includes(g.id)),           )        |需要进一步测试|
|src/ui/classroom-feedback.js:407|[frame, live]||需要进一步测试|
|src/ui/classroom-feedback.js:421|rows|candidates(frame)|需要进一步测试|
|src/ui/classroom-feedback.js:423|actual|frame.querySelector(".slot-reel-text")|需要进一步测试|
|src/ui/classroom-feedback.js:424|height|frame.clientHeight|需要进一步测试|
|src/ui/classroom-feedback.js:425|strip|document.createElement("div")|需要进一步测试|
|src/ui/classroom-feedback.js:428|candidate||需要进一步测试|
|src/ui/classroom-feedback.js:429|row|document.createElement("span")|需要进一步测试|
|src/ui/classroom-feedback.js:434|visibility|actual.style.visibility|需要进一步测试|
|src/ui/classroom-feedback.js:437|animation|strip.animate(           [             { transform: "translateY(0)" },             { transform: translateY(-${height * rows.length}px) },           ],        |需要进一步测试|
|src/ui/classroom-feedback.js:459|live|liveReels.get(frame)|需要进一步测试|
|src/ui/classroom-feedback.js:461|phase|((Number(live.animation.currentTime) ／／ 0) / 100) % live.rows.length|需要进一步测试|
|src/ui/classroom-recovery.js:2|ClassroomRecovery|(() => {   let candidates = [];   let selected = null;   const byId = (id) => document.getElementById(id);   const setStatus = (text) => {     byId("classroomRe|需要进一步测试|
|src/ui/classroom-recovery.js:3|candidates|[]|需要进一步测试|
|src/ui/classroom-recovery.js:4|selected|null|需要进一步测试|
|src/ui/classroom-recovery.js:5|byId|(id) => document.getElementById(id)|需要进一步测试|
|src/ui/classroom-recovery.js:6|setStatus|(text) => {     byId("classroomRecoveryStatus").textContent = text;   }|需要进一步测试|
|src/ui/classroom-recovery.js:12|data|Reliability.validateBackup(raw)|需要进一步测试|
|src/ui/classroom-recovery.js:28|found|[]|需要进一步测试|
|src/ui/classroom-recovery.js:29|key||需要进一步测试|
|src/ui/classroom-recovery.js:31|raw|localStorage.getItem(key)|需要进一步测试|
|src/ui/classroom-recovery.js:33|item|validCandidate(key, JSON.parse(raw))|需要进一步测试|
|src/ui/classroom-recovery.js:41|legacy|SchemaMigrations.fromLegacyKeys(localStorage)|需要进一步测试|
|src/ui/classroom-recovery.js:43|item|validCandidate("旧版分散存储镜像", legacy)|需要进一步测试|
|src/ui/classroom-recovery.js:50|preserved|JSON.parse(         localStorage.getItem("godpower_recovery_before_import_v2") ／／ "null",       )|需要进一步测试|
|src/ui/classroom-recovery.js:54|item|validCandidate(           "上次恢复前保留副本",           JSON.parse(preserved.raw),         )|需要进一步测试|
|src/ui/classroom-recovery.js:63|seen|new Set()|需要进一步测试|
|src/ui/classroom-recovery.js:65|signature|JSON.stringify(item.data)|需要进一步测试|
|src/ui/classroom-recovery.js:74|host|byId("classroomRecoveryCandidates")|需要进一步测试|
|src/ui/classroom-recovery.js:76|[index, item]||需要进一步测试|
|src/ui/classroom-recovery.js:77|card|document.createElement("article")|需要进一步测试|
|src/ui/classroom-recovery.js:79|summary|document.createElement("p")|需要进一步测试|
|src/ui/classroom-recovery.js:81|button|document.createElement("button")|需要进一步测试|
|src/ui/classroom-recovery.js:108|currentGroups|Array.isArray(state.groups) ? state.groups : []|需要进一步测试|
|src/ui/classroom-recovery.js:109|currentScore|currentGroups.reduce(       (sum, group) => sum + Number(group.score ／／ 0),       0,     )|需要进一步测试|
|src/ui/classroom-recovery.js:120|accepted|await themeConfirm(       "此操作会用选中的副本恢复当前课堂。损坏原文会另行保留，是否继续？",       { title: "恢复课堂存档", danger: true },     )|需要进一步测试|
|src/ui/classroom-recovery.js:127|result|importClassroomData(selected.data)|需要进一步测试|
|src/ui/classroom-recovery.js:140|raw||需要进一步测试|
|src/ui/classroom-recovery.js:151|url|URL.createObjectURL(       new Blob([raw], { type: "text/plain;charset=utf-8" }),     )|需要进一步测试|
|src/ui/classroom-recovery.js:154|link|document.createElement("a")|需要进一步测试|
|src/ui/classroom-recovery.js:168|tools|byId("classroomRecoveryTools")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:3|clone|(value) => JSON.parse(JSON.stringify(value))|需要进一步测试|
|src/ui/classroom-roster-workspace.js:4|toBase64|(bytes) => {     let binary = "";     for (let offset = 0; offset < bytes.length; offset += 0x8000)       binary += String.fromCharCode(...bytes.subarray(offset|需要进一步测试|
|src/ui/classroom-roster-workspace.js:5|binary|""|需要进一步测试|
|src/ui/classroom-roster-workspace.js:6|offset|0|需要进一步测试|
|src/ui/classroom-roster-workspace.js:10|fromBase64|(value) => {     if (       typeof value !== "string" ／／       !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==／[A-Za-z0-9+/]{3}=)?$/.test(         value,       ) |需要进一步测试|
|src/ui/classroom-roster-workspace.js:18|binary|atob(value)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:21|AVATAR_BACKUP_FORMAT|"godpower-classroom-roster-backup"|需要进一步测试|
|src/ui/classroom-roster-workspace.js:22|MAX_AVATAR_BACKUP_BYTES|50 * 1024 * 1024|需要进一步测试|
|src/ui/classroom-roster-workspace.js:28|text|(tag, value, className = "") => {     const element = document.createElement(tag);     element.textContent = value;     if (className) element.className = class|需要进一步测试|
|src/ui/classroom-roster-workspace.js:29|element|document.createElement(tag)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:40|repository|root.ClassroomRosterRepository.createClassroomRosterRepository({         storage,       })|需要进一步测试|
|src/ui/classroom-roster-workspace.js:44|section|document.createElement("section")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:50|profileSelect|section.querySelector("#rosterProfileSelect")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:51|classroomSelect|section.querySelector("#rosterClassroomSelect")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:52|modeSelect|document.createElement("select")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:57|modeLabel|document.createElement("label")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:62|addClassroom|text("button", "新增课堂", "btn")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:71|classroomForm|document.createElement("div")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:78|rows|section.querySelector("#rosterStudentRows")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:79|status|section.querySelector("#rosterStatus")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:80|documentData|null|需要进一步测试|
|src/ui/classroom-roster-workspace.js:81|revision|0|需要进一步测试|
|src/ui/classroom-roster-workspace.js:82|selectedProfile|""|需要进一步测试|
|src/ui/classroom-roster-workspace.js:83|selectedClassroom|""|需要进一步测试|
|src/ui/classroom-roster-workspace.js:84|activeClassroomContext|null|需要进一步测试|
|src/ui/classroom-roster-workspace.js:85|avatarRepositoryPromise|null|需要进一步测试|
|src/ui/classroom-roster-workspace.js:86|avatarObjectUrls|new Set()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:93|url||需要进一步测试|
|src/ui/classroom-roster-workspace.js:99|avatar|await (           await getAvatarRepository()         ).get(student.avatarResourceId)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:109|objectUrl|URL.createObjectURL(avatar.blob)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:122|savedContext|JSON.parse(         storage.getItem("godpower_active_classroom_context_v1") ／／ "null",       )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:140|result|repository.write(next, { expectedRevision: revision })|需要进一步测试|
|src/ui/classroom-roster-workspace.js:152|assignment|documentData.assignments.find(         (item) =>           item.userProfileId === profileId && item.classroomId === classroomId,       )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:170|classroom|documentData?.classrooms.find(         (item) => item.classroomId === selectedClassroom,       )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:174|studentMap|new Map(         documentData.students.map((student) => [student.studentUid, student]),       )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:177|assignment|assignmentFor(selectedProfile, selectedClassroom)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:179|assigned|new Map(         assignment.groupAssignments.map((item) => [           item.studentUid,           item.groupUid,         ]),       )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:185|groups|getGroups().map((group, index) => ({         id: group.groupUid,         label: group.name ／／ 第 ${index + 1} 组,       }))|需要进一步测试|
|src/ui/classroom-roster-workspace.js:189|studentUid||需要进一步测试|
|src/ui/classroom-roster-workspace.js:190|student|studentMap.get(studentUid)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:192|row|document.createElement("tr")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:194|nameCell|document.createElement("td")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:195|name|document.createElement("input")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:201|groupCell|document.createElement("td")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:202|group|document.createElement("select")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:206|item||需要进一步测试|
|src/ui/classroom-roster-workspace.js:214|avatarCell|document.createElement("td")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:215|avatarEditor|document.createElement("div")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:217|avatar|document.createElement("img")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:222|placeholder|text(           "span",           student.displayName.trim().slice(0, 1) ／／ "?",           "roster-avatar-placeholder",         )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:228|upload|document.createElement("input")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:235|file|upload.files?.[0]|需要进一步测试|
|src/ui/classroom-roster-workspace.js:249|avatarRepo||需要进一步测试|
|src/ui/classroom-roster-workspace.js:250|createdResourceId|""|需要进一步测试|
|src/ui/classroom-roster-workspace.js:252|stored|repository.read()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:255|rosterBytes|storage.getItem(repository.key)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:256|existingDocument|documentData|需要进一步测试|
|src/ui/classroom-roster-workspace.js:258|draft||需要进一步测试|
|src/ui/classroom-roster-workspace.js:266|profileId|selectedProfile|需要进一步测试|
|src/ui/classroom-roster-workspace.js:267|classroomId|selectedClassroom|需要进一步测试|
|src/ui/classroom-roster-workspace.js:268|studentRecord|stored.rosterData.students.find(               (item) => item.studentUid === studentUid,             )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:274|bytes|new Uint8Array(await file.arrayBuffer())|需要进一步测试|
|src/ui/classroom-roster-workspace.js:275|digest|[               ...new Uint8Array(                 await root.crypto.subtle.digest("SHA-256", bytes),               ),             ]               .map((value) |需要进一步测试|
|src/ui/classroom-roster-workspace.js:282|existingAvatar|(               await avatarRepo.list({                 profileId,                 classroomId,                 subjectId: "student-avatar",               })   |需要进一步测试|
|src/ui/classroom-roster-workspace.js:289|resourceId||需要进一步测试|
|src/ui/classroom-roster-workspace.js:292|[created]|await avatarRepo.addBatch([                 {                   file,                   profileId,                   classroomId,                   subjectId: "|需要进一步测试|
|src/ui/classroom-roster-workspace.js:305|latestRoster|repository.read()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:314|next|clone(stored.rosterData)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:315|target|next.students.find(               (item) => item.studentUid === studentUid,             )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:320|result|repository.write(next, {               expectedRevision: stored.revision,             })|需要进一步测试|
|src/ui/classroom-roster-workspace.js:348|uploadLabel|text(           "label",           student.avatarResourceId ? "更换图片" : "选择图片",           "btn btn-sm roster-avatar-label",         )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:356|clearAvatar|text("button", "清除", "btn btn-sm")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:363|next|clone(documentData)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:364|target|next.students.find(               (item) => item.studentUid === studentUid,             )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:375|actionCell|document.createElement("td")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:376|remove|text("button", "移除", "btn btn-sm btn-danger")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:398|read|repository.read()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:408|profile||需要进一步测试|
|src/ui/classroom-roster-workspace.js:412|classroom||需要进一步测试|
|src/ui/classroom-roster-workspace.js:438|hasRoster|Boolean(selectedProfile && selectedClassroom)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:449|classroom|documentData.classrooms.find(         (item) => item.classroomId === selectedClassroom,       )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:452|assignment|assignmentFor(selectedProfile, selectedClassroom)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:454|names|new Map()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:455|memberships|new Map()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:456|row||需要进一步测试|
|src/ui/classroom-roster-workspace.js:457|studentUid|row.dataset.studentUid|需要进一步测试|
|src/ui/classroom-roster-workspace.js:458|displayName|row.querySelector("input").value.trim()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:461|groupUid|row.querySelector("select").value|需要进一步测试|
|src/ui/classroom-roster-workspace.js:486|saved|repository.read()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:489|currentDraft|clone(documentData)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:490|existingDocument|documentData|需要进一步测试|
|src/ui/classroom-roster-workspace.js:492|draft||需要进一步测试|
|src/ui/classroom-roster-workspace.js:500|ids|[           ...new Set(             saved.rosterData.students               .map((student) => student.avatarResourceId)               .filter(Boolean),         |需要进一步测试|
|src/ui/classroom-roster-workspace.js:507|assets|[]|需要进一步测试|
|src/ui/classroom-roster-workspace.js:508|totalBytes|0|需要进一步测试|
|src/ui/classroom-roster-workspace.js:510|avatarRepo|await getAvatarRepository()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:511|resourceId||需要进一步测试|
|src/ui/classroom-roster-workspace.js:512|asset|await avatarRepo.get(resourceId)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:524|bytes|new Uint8Array(await asset.blob.arrayBuffer())|需要进一步测试|
|src/ui/classroom-roster-workspace.js:530|{ blob, ...metadata }|asset|需要进一步测试|
|src/ui/classroom-roster-workspace.js:534|backup|{           format: AVATAR_BACKUP_FORMAT,           schemaVersion: 1,           exportedAt: new Date().toISOString(),           rosterData: saved.rosterData,   |需要进一步测试|
|src/ui/classroom-roster-workspace.js:541|payload|JSON.stringify(backup, null, 2)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:542|link|document.createElement("a")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:565|rosterData|root.ClassroomRoster.validateRosterDocument(         parsed.rosterData,       )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:570|referenced|new Set(         rosterData.students           .map((student) => student.avatarResourceId)           .filter(Boolean),       )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:575|avatarIds|new Set()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:576|profileIds|new Set(         rosterData.profiles.map((profile) => profile.userProfileId),       )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:579|classroomById|new Map(         rosterData.classrooms.map((classroom) => [           classroom.classroomId,           classroom,         ]),       )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:585|prepared|[]|需要进一步测试|
|src/ui/classroom-roster-workspace.js:586|totalBytes|0|需要进一步测试|
|src/ui/classroom-roster-workspace.js:587|entry||需要进一步测试|
|src/ui/classroom-roster-workspace.js:603|bytes|fromBase64(entry.bytesBase64)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:609|ownerMatch|rosterData.students.some(           (student) =>             student.avatarResourceId === entry.resourceId &&             student.classroomId === entry.classroo|需要进一步测试|
|src/ui/classroom-roster-workspace.js:617|metadata|root.TeachingResource.validateFile(           {             ...entry,             byteSize: bytes.byteLength,             schemaVersion: 1,           },        |需要进一步测试|
|src/ui/classroom-roster-workspace.js:631|avatarRepo|await getAvatarRepository()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:632|existing|await avatarRepo.list()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:633|existingById|new Map(         existing.map((item) => [item.resourceId, item]),       )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:636|existingByHash|new Map(         existing.map((item) => [item.sha256, item]),       )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:639|importedByHash|new Map()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:640|mapping|new Map()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:641|toCreate|[]|需要进一步测试|
|src/ui/classroom-roster-workspace.js:642|item||需要进一步测试|
|src/ui/classroom-roster-workspace.js:643|{ metadata, bytes }|item|需要进一步测试|
|src/ui/classroom-roster-workspace.js:644|sameId|existingById.get(metadata.resourceId)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:646|record|await avatarRepo.get(metadata.resourceId)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:658|sameHash|existingByHash.get(metadata.sha256)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:668|batchDuplicate|importedByHash.get(metadata.sha256)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:675|resourceId|sameId           ? root.StableIdentity.createResourceId()           : metadata.resourceId|需要进一步测试|
|src/ui/classroom-roster-workspace.js:678|finalMetadata|root.TeachingResource.validateFile(           { ...metadata, resourceId },           bytes,         )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:682|file|new File([bytes], finalMetadata.fileName, {           type: finalMetadata.mimeType,         })|需要进一步测试|
|src/ui/classroom-roster-workspace.js:703|createdResources|toCreate.length         ? await avatarRepo.addBatch(toCreate)         : []|需要进一步测试|
|src/ui/classroom-roster-workspace.js:706|student||需要进一步测试|
|src/ui/classroom-roster-workspace.js:713|avatarRepo|await getAvatarRepository()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:714|failures|[]|需要进一步测试|
|src/ui/classroom-roster-workspace.js:715|resource||需要进一步测试|
|src/ui/classroom-roster-workspace.js:726|initialBytes|storage.getItem(repository.key)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:727|initial|repository.read()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:730|result|await importRosterBackup(parsed)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:732|latest|repository.read()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:739|saved|repository.write(result.rosterData, {           expectedRevision: initial.revision,         })|需要进一步测试|
|src/ui/classroom-roster-workspace.js:758|overlay|document.getElementById("rosterApplyPreview")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:775|persisted|repository.read()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:780|workingRoster||需要进一步测试|
|src/ui/classroom-roster-workspace.js:782|liveDocument|documentData|需要进一步测试|
|src/ui/classroom-roster-workspace.js:795|liveGroups|getGroups()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:796|plan|root.ClassroomRoster.planCompetitionMemberUpdate({           groups: liveGroups,           rosterData: persisted.rosterData,           userProfileId: selectedPr|需要进一步测试|
|src/ui/classroom-roster-workspace.js:806|stateFingerprint|JSON.stringify(state)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:807|stateReference|state|需要进一步测试|
|src/ui/classroom-roster-workspace.js:808|selection|{           profileId: selectedProfile,           classroomId: selectedClassroom,         }|需要进一步测试|
|src/ui/classroom-roster-workspace.js:812|rosterBytes|storage.getItem(repository.key)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:813|snapshot|Object.freeze({           plan,           stateFingerprint,           stateReference,           seasonId: state.seasonId,           selection,           rosterB|需要进一步测试|
|src/ui/classroom-roster-workspace.js:823|overlay|document.createElement("div")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:829|changed|plan.groupChanges.filter((item) => item.changed)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:830|rowsHtml|plan.groupChanges           .map(             (item) =>               <tr><th>${root.escapeHtml(item.groupName)}</th><td>${root.escapeHtml(item.before.join("、"|需要进一步测试|
|src/ui/classroom-roster-workspace.js:838|closeButton|overlay.querySelector("#rosterApplyClose")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:844|onKeydown|(event) => {           if (             event.key === "Escape" &&             document.getElementById("rosterApplyPreview") === overlay           ) {           |需要进一步测试|
|src/ui/classroom-roster-workspace.js:860|confirmButton|event.currentTarget|需要进一步测试|
|src/ui/classroom-roster-workspace.js:863|confirmed|await root.themeConfirm(             即将更新 ${changed.length} 个小组的成员名单。比赛积分、道具与回合状态不变，且本次操作可从历史撤销。,             {               title: "确认应用课堂名单",              |需要进一步测试|
|src/ui/classroom-roster-workspace.js:878|latest|repository.read()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:879|stillCurrent|() =>             state === snapshot.stateReference &&             state.seasonId === snapshot.seasonId &&             JSON.stringify(state) === snapshot.stateF|需要进一步测试|
|src/ui/classroom-roster-workspace.js:896|accepted|runClassroomCommand(             应用课堂名单：${documentData.classrooms.find((item) => item.classroomId === selectedClassroom)?.name ／／ "课堂"},             () => {  |需要进一步测试|
|src/ui/classroom-roster-workspace.js:899|currentRoster|repository.read()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:907|change||需要进一步测试|
|src/ui/classroom-roster-workspace.js:908|group|state.groups.find(                   (item) => item.groupUid === change.groupUid,                 )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:922|outcome|await classroomCommands.whenIdle()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:950|assignment|assignmentFor(selectedProfile, selectedClassroom)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:965|groups|root.StableIdentity.assignGroupUids(getGroups())|需要进一步测试|
|src/ui/classroom-roster-workspace.js:966|migrated|repository.previewMigration({           classroomId: root.StableIdentity.createClassroomId(),           userProfileId: root.StableIdentity.createUserProfileId()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:993|name|section.querySelector("#rosterClassroomName").value.trim()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:995|next|clone(documentData)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:996|classroomId|root.StableIdentity.createClassroomId()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:1015|name|section.querySelector("#rosterProfileName").value.trim()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:1017|next|clone(documentData)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:1018|userProfileId|root.StableIdentity.createUserProfileId()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:1035|classroom|documentData.classrooms.find(         (item) => item.classroomId === selectedClassroom,       )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:1039|studentUid|root.StableIdentity.createStudentUid()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:1049|added|rows.lastElementChild?.querySelector("input")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:1064|file|event.target.files?.[0]|需要进一步测试|
|src/ui/classroom-roster-workspace.js:1069|parsed|JSON.parse(await file.text())|需要进一步测试|
|src/ui/classroom-roster-workspace.js:1079|importedResources|await commitRosterImport(parsed)|需要进一步测试|
|src/ui/contribution-registry.js:5|KINDS|new Set([     "navigation",     "page",     "panel",     "card",     "settings",     "commandShortcut",     "viewPreset",     "decoration",     "theme",     "te|需要进一步测试|
|src/ui/contribution-registry.js:17|SLOTS|new Set([     "home.cards",     "plugins.overview",     "plugins.workspace",     "resources.tools",     "settings.pluginLinks",     "competition.transientOverla|需要进一步测试|
|src/ui/contribution-registry.js:25|RENDERERS|new Set([     "builtin.plugin-workspace",     "builtin.dashboard-card",     "builtin.notice",     "builtin.command-shortcut",     "builtin.decoration",   ])|需要进一步测试|
|src/ui/contribution-registry.js:32|CORE_PAGES|[     "welcome",     "battle",     "history",     "archives",     "plugins",     "settings",   ]|需要进一步测试|
|src/ui/contribution-registry.js:40|REQUIRED|{     page: "ui.page.register",     navigation: "ui.navigation.register",     card: "ui.card.register",     panel: "ui.panel.register",     settings: "ui.settin|需要进一步测试|
|src/ui/contribution-registry.js:52|EXECUTABLE_FIELD|/^(?:html／markup／script／module／mount／handler／callback／function／css／csstext／javascript／__proto__／prototype／constructor)$/i|需要进一步测试|
|src/ui/contribution-registry.js:54|IDENTIFIER|/^[a-z0-9][a-z0-9._-]{0,63}$/|需要进一步测试|
|src/ui/contribution-registry.js:55|DESCRIPTOR_FIELDS|{     page: new Set([       "titleKey",       "iconResource",       "renderer",       "route",       "emptyState",       "errorState",     ]),     navigation: n|需要进一步测试|
|src/ui/contribution-registry.js:96|clone|(value) => JSON.parse(JSON.stringify(value))|需要进一步测试|
|src/ui/contribution-registry.js:97|equal|(left, right) => JSON.stringify(left) === JSON.stringify(right)|需要进一步测试|
|src/ui/contribution-registry.js:98|fail|(message) => {     throw new TypeError(message);   }|需要进一步测试|
|src/ui/contribution-registry.js:127|[key, entry]||需要进一步测试|
|src/ui/contribution-registry.js:135|revision|0|需要进一步测试|
|src/ui/contribution-registry.js:136|nextActivation|1|需要进一步测试|
|src/ui/contribution-registry.js:137|activations|new WeakMap()|需要进一步测试|
|src/ui/contribution-registry.js:138|activationsById|new Map()|需要进一步测试|
|src/ui/contribution-registry.js:139|contributions|new Map()|需要进一步测试|
|src/ui/contribution-registry.js:140|pages|new Map()|需要进一步测试|
|src/ui/contribution-registry.js:142|route||需要进一步测试|
|src/ui/contribution-registry.js:180|activationId|activation-${nextActivation++}|需要进一步测试|
|src/ui/contribution-registry.js:181|activation|Object.freeze({ activationId })|需要进一步测试|
|src/ui/contribution-registry.js:182|record|{         pluginId,         activationId,         scope: clone(options.scope ／／ {}),         permissions: new Set(options.permissions ／／ []),         active: tr|需要进一步测试|
|src/ui/contribution-registry.js:226|needed|new Set([         REQUIRED[input.kind],         ...(input.requiredPermissions ／／ []),       ])|需要进一步测试|
|src/ui/contribution-registry.js:230|permission||需要进一步测试|
|src/ui/contribution-registry.js:235|descriptor|clone(input.descriptor)|需要进一步测试|
|src/ui/contribution-registry.js:236|key||需要进一步测试|
|src/ui/contribution-registry.js:327|allowedTokens|new Set([           "--ui-primary",           "--ui-primary-hover",           "--ui-accent",           "--ui-accent-hover",           "--ui-bg",           "--ui|需要进一步测试|
|src/ui/contribution-registry.js:347|[token, value]||需要进一步测试|
|src/ui/contribution-registry.js:359|allowedKeys|new Set([           "app.name",           "nav.welcome",           "nav.battle",           "nav.history",           "nav.archives",           "nav.plugins",    |需要进一步测试|
|src/ui/contribution-registry.js:375|keys|Object.keys(descriptor.messages)|需要进一步测试|
|src/ui/contribution-registry.js:378|[key, value]||需要进一步测试|
|src/ui/contribution-registry.js:411|activationRecord|activations.get(activation)|需要进一步测试|
|src/ui/contribution-registry.js:416|staged|batch.map((item) =>         validateContribution(item, activationRecord),       )|需要进一步测试|
|src/ui/contribution-registry.js:419|stagedIds|new Set()|需要进一步测试|
|src/ui/contribution-registry.js:420|stagedRoutes|new Set()|需要进一步测试|
|src/ui/contribution-registry.js:421|item||需要进一步测试|
|src/ui/contribution-registry.js:431|item||需要进一步测试|
|src/ui/contribution-registry.js:445|record|activationsById.get(activationId)|需要进一步测试|
|src/ui/contribution-registry.js:448|id||需要进一步测试|
|src/ui/contribution-registry.js:449|item|contributions.get(id)|需要进一步测试|
|src/ui/contribution-registry.js:467|page|pages.get(route)|需要进一步测试|
|src/ui/contribution-registry.js:471|page|pages.get(route)|需要进一步测试|
|src/ui/contribution-registry.js:499|api|Object.freeze({ createContributionRegistry })|需要进一步测试|
|src/ui/contribution-registry.js:503|registry|createContributionRegistry()|需要进一步测试|
|src/ui/disposable-scope.js:6|disposed|false|需要进一步测试|
|src/ui/disposable-scope.js:7|cleanups|[]|需要进一步测试|
|src/ui/disposable-scope.js:8|abortController|new AbortController()|需要进一步测试|
|src/ui/disposable-scope.js:11|index|cleanups.indexOf(entry)|需要进一步测试|
|src/ui/disposable-scope.js:18|active|true|需要进一步测试|
|src/ui/disposable-scope.js:19|entry|() => {         if (!active) return;         active = false;         cleanup();       }|需要进一步测试|
|src/ui/disposable-scope.js:50|release||需要进一步测试|
|src/ui/disposable-scope.js:51|id|setTimeout(() => {         release?.();         if (!disposed) callback();       }, delay)|需要进一步测试|
|src/ui/disposable-scope.js:63|release||需要进一步测试|
|src/ui/disposable-scope.js:64|id|requestAnimationFrame((time) => {         release?.();         if (!disposed) callback(time);       })|需要进一步测试|
|src/ui/disposable-scope.js:92|release|add(() => animation.cancel())|需要进一步测试|
|src/ui/disposable-scope.js:107|errors|[]|需要进一步测试|
|src/ui/disposable-scope.js:113|cleanup||需要进一步测试|
|src/ui/disposable-scope.js:147|error||需要进一步测试|
|src/ui/disposable-scope.js:151|active|null|需要进一步测试|
|src/ui/disposable-scope.js:162|previous|active|需要进一步测试|
|src/ui/disposable-scope.js:163|errors|previous.dispose()|需要进一步测试|
|src/ui/disposable-scope.js:172|previous|active|需要进一步测试|
|src/ui/disposable-scope.js:174|errors|previous.dispose()|需要进一步测试|
|src/ui/electron-host.js:3|desktop|window.godpowerDesktop|需要进一步测试|
|src/ui/electron-host.js:5|completed|new Map()|需要进一步测试|
|src/ui/electron-host.js:6|last|""|需要进一步测试|
|src/ui/electron-host.js:7|timer||需要进一步测试|
|src/ui/electron-host.js:8|soundedReveal|null|需要进一步测试|
|src/ui/electron-host.js:9|publish|() => {     const snapshot = GodpowerPicker.getSnapshot(),       json = JSON.stringify(snapshot);     if (       snapshot.phase === "revealed" &&       snapshot|需要进一步测试|
|src/ui/electron-host.js:10|snapshot|GodpowerPicker.getSnapshot()|需要进一步测试|
|src/ui/electron-host.js:11|json|JSON.stringify(snapshot)|需要进一步测试|
|src/ui/electron-host.js:28|buttonSound|action === "score"           ? payload.delta > 0             ? "positive"             : "negative"           : {               start: "pick_start",             |需要进一步测试|
|src/ui/electron-host.js:43|promise|GodpowerPicker.command(action, payload).catch(         (error) => ({ ok: false, error: error.message }),       )|需要进一步测试|
|src/ui/electron-host.js:49|result|await completed.get(id)|需要进一步测试|
|src/ui/electron-host.js:62|button|document.createElement("button")|需要进一步测试|
|src/ui/electron-windows.js:3|desktop|window.godpowerDesktop|需要进一步测试|
|src/ui/electron-windows.js:5|ids|[     "welcomeModal",     "scoreModalBackdrop",     "pwdModal",     "memberSearchBackdrop",     "settlementNameModal",     "grandModalOverlay",     "itemModalBa|需要进一步测试|
|src/ui/electron-windows.js:20|nodes|new Map()|需要进一步测试|
|src/ui/electron-windows.js:21|tokens|new WeakMap()|需要进一步测试|
|src/ui/electron-windows.js:22|acks|new Map()|需要进一步测试|
|src/ui/electron-windows.js:23|versions|new Map()|需要进一步测试|
|src/ui/electron-windows.js:24|nextToken|0|需要进一步测试|
|src/ui/electron-windows.js:25|last|""|需要进一步测试|
|src/ui/electron-windows.js:26|timer||需要进一步测试|
|src/ui/electron-windows.js:34|visible|(el) =>     el.open ／／     el.classList.contains("active") ／／     el.classList.contains("show") ／／     el.style.display === "flex" ／／     (el.id === "programCon|需要进一步测试|
|src/ui/electron-windows.js:41|button|root.querySelector("[data-ui-window-close]")|需要进一步测试|
|src/ui/electron-windows.js:46|closers|{       welcomeModal: () => closeWelcomeModal(),       scoreModalBackdrop: () => closeScoreModal(),       pwdModal: () => closePwdModal(),       memberSearchBac|需要进一步测试|
|src/ui/electron-windows.js:64|css|[...document.querySelectorAll("style:not([data-native-hide])")]       .map((el) => el.textContent)       .join("\n")|需要进一步测试|
|src/ui/electron-windows.js:67|list|[]|需要进一步测试|
|src/ui/electron-windows.js:68|id||需要进一步测试|
|src/ui/electron-windows.js:69|root|document.getElementById(id)|需要进一步测试|
|src/ui/electron-windows.js:75|copy|root.cloneNode(true)|需要进一步测试|
|src/ui/electron-windows.js:76|original|[root, ...root.querySelectorAll("*")]|需要进一步测试|
|src/ui/electron-windows.js:77|cloned|[copy, ...copy.querySelectorAll("*")]|需要进一步测试|
|src/ui/electron-windows.js:79|target|cloned[i]|需要进一步测试|
|src/ui/electron-windows.js:101|title|root           .querySelector('[class*="title"],h1,h2,h3')           ?.textContent?.trim()           .slice(0, 100) ／／ "课堂工具"|需要进一步测试|
|src/ui/electron-windows.js:106|html|copy.outerHTML|需要进一步测试|
|src/ui/electron-windows.js:107|previous|versions.get(id)|需要进一步测试|
|src/ui/electron-windows.js:108|version|previous && previous.html === html           ? previous.version           : (previous?.version ／／ 0) + 1|需要进一步测试|
|src/ui/electron-windows.js:125|picker|document.getElementById("pickerModal")|需要进一步测试|
|src/ui/electron-windows.js:128|json|JSON.stringify(list)|需要进一步测试|
|src/ui/electron-windows.js:133|[key, node]||需要进一步测试|
|src/ui/electron-windows.js:140|root|document.getElementById(message.id)|需要进一步测试|
|src/ui/electron-windows.js:152|el|nodes.get(message.token)|需要进一步测试|
|src/ui/electron-windows.js:182|transfer|new DataTransfer()|需要进一步测试|
|src/ui/electron-windows.js:183|file||需要进一步测试|
|src/ui/electron-windows.js:195|style|document.createElement("style")|需要进一步测试|
|src/ui/item-modules.js:2|ItemModuleSettings|(() => {   "use strict";   const mounts = new WeakMap();   const kinds = {     attack: "攻击",     boost: "增益",     tactic: "战术",     status: "持续状态",     instant:|需要进一步测试|
|src/ui/item-modules.js:4|mounts|new WeakMap()|需要进一步测试|
|src/ui/item-modules.js:5|kinds|{     attack: "攻击",     boost: "增益",     tactic: "战术",     status: "持续状态",     instant: "即时",   }|需要进一步测试|
|src/ui/item-modules.js:13|el|document.createElement(tag)|需要进一步测试|
|src/ui/item-modules.js:19|wrapper|node("span", className)|需要进一步测试|
|src/ui/item-modules.js:26|el|node("button", className, text)|需要进一步测试|
|src/ui/item-modules.js:33|existing|mounts.get(host)|需要进一步测试|
|src/ui/item-modules.js:38|catalog|ItemModules.catalog()|需要进一步测试|
|src/ui/item-modules.js:39|selected|catalog[0]?.key|需要进一步测试|
|src/ui/item-modules.js:40|pipeline|"draw"|需要进一步测试|
|src/ui/item-modules.js:41|query|""|需要进一步测试|
|src/ui/item-modules.js:42|busy|false|需要进一步测试|
|src/ui/item-modules.js:43|shell|node("section", "im-settings")|需要进一步测试|
|src/ui/item-modules.js:44|title|node("div", "im-heading")|需要进一步测试|
|src/ui/item-modules.js:45|actions|node("div", "im-actions")|需要进一步测试|
|src/ui/item-modules.js:46|status|node("p", "im-status", "每个道具独立保存，修改后立即生效。")|需要进一步测试|
|src/ui/item-modules.js:47|layout|node("div", "im-layout")|需要进一步测试|
|src/ui/item-modules.js:48|sidebar|node("div", "im-sidebar")|需要进一步测试|
|src/ui/item-modules.js:49|search|node("input", "im-search")|需要进一步测试|
|src/ui/item-modules.js:50|count|node("p", "im-count")|需要进一步测试|
|src/ui/item-modules.js:51|list|node("div", "im-list")|需要进一步测试|
|src/ui/item-modules.js:52|editor|node("div", "im-editor")|需要进一步测试|
|src/ui/item-modules.js:53|file|node("input")|需要进一步测试|
|src/ui/item-modules.js:71|picked|file.files?.[0]|需要进一步测试|
|src/ui/item-modules.js:76|imported|JSON.parse(await picked.text())|需要进一步测试|
|src/ui/item-modules.js:90|blob|new Blob(             [JSON.stringify(ItemModules.configuration(), null, 2)],             { type: "application/json" },           )|需要进一步测试|
|src/ui/item-modules.js:94|url|URL.createObjectURL(blob)|需要进一步测试|
|src/ui/item-modules.js:95|link|node("a")|需要进一步测试|
|src/ui/item-modules.js:133|categoryTitle|host.querySelector(".ui-settings-title")|需要进一步测试|
|src/ui/item-modules.js:141|defs|typeof ITEM_DEFS !== "undefined" ? ITEM_DEFS : {}|需要进一步测试|
|src/ui/item-modules.js:145|config|ItemModules.configuration()|需要进一步测试|
|src/ui/item-modules.js:146|filtered|catalog         .map(metadata)         .filter((item) =>           [item.name, item.key, kinds[item.kind] ／／ item.kind]             .join(" ")             .toLo|需要进一步测试|
|src/ui/item-modules.js:156|item||需要进一步测试|
|src/ui/item-modules.js:157|row|button(           "",           () => {             selected = item.key;             refresh();           },           "im-item",         )|需要进一步测试|
|src/ui/item-modules.js:168|enabled|config.items[item.key]|需要进一步测试|
|src/ui/item-modules.js:187|next|ItemModules.configuration()|需要进一步测试|
|src/ui/item-modules.js:204|block|node("label", "im-block")|需要进一步测试|
|src/ui/item-modules.js:205|text|node("span", "im-block-copy")|需要进一步测试|
|src/ui/item-modules.js:206|input|node("input")|需要进一步测试|
|src/ui/item-modules.js:240|toggle|node("span", "v292-switch")|需要进一步测试|
|src/ui/item-modules.js:241|track|node("span", "v292-switch-track")|需要进一步测试|
|src/ui/item-modules.js:250|item|metadata(catalog.find((entry) => entry.key === selected))|需要进一步测试|
|src/ui/item-modules.js:255|settings|ItemModules.configuration().items[selected][pipeline]|需要进一步测试|
|src/ui/item-modules.js:256|header|node("div", "im-editor-header")|需要进一步测试|
|src/ui/item-modules.js:257|details|node("div")|需要进一步测试|
|src/ui/item-modules.js:258|tabs|node("div", "im-tabs")|需要进一步测试|
|src/ui/item-modules.js:259|panel|node("div", "im-blocks")|需要进一步测试|
|src/ui/item-modules.js:269|key|selected|需要进一步测试|
|src/ui/item-modules.js:278|next|ItemModules.configuration()|需要进一步测试|
|src/ui/item-modules.js:292|[key, label]||需要进一步测试|
|src/ui/item-modules.js:296|tab|button(           label,           () => {             pipeline = key;             renderEditor();             editor.querySelector('[aria-selected="true"]').fo|需要进一步测试|
|src/ui/item-modules.js:390|reference|node("details", "im-reference")|需要进一步测试|
|src/ui/item-modules.js:414|prefs|typeof DesktopUI !== "undefined" ? DesktopUI.getPreferences() : {}|需要进一步测试|
|src/ui/migration.js:2|MigrationPanel|(() => {   let selected = null,     report = null,     busy = false,     cancellation = null;   const coordinator = MigrationCoordinator.create({     inventory:|需要进一步测试|
|src/ui/migration.js:3|selected|null|需要进一步测试|
|src/ui/migration.js:4|report|null|需要进一步测试|
|src/ui/migration.js:5|busy|false|需要进一步测试|
|src/ui/migration.js:6|cancellation|null|需要进一步测试|
|src/ui/migration.js:7|coordinator|MigrationCoordinator.create({     inventory: LegacyStorageInventory,     openRepository: (plan) =>       TransactionalRepository.open({         name: "godpower-|需要进一步测试|
|src/ui/migration.js:15|element|(id) => document.getElementById(id)|需要进一步测试|
|src/ui/migration.js:17|output|element("v3MigrationStatus")|需要进一步测试|
|src/ui/migration.js:61|preview|await coordinator.preview()|需要进一步测试|
|src/ui/migration.js:86|result|await coordinator.execute(selected, {         signal: cancellation.signal,       })|需要进一步测试|
|src/ui/migration.js:101|reason|result.error ／／           result.conflicts?.join("；") ／／           result.integrity?.failures.join("；") ／／           "验证未完成"|需要进一步测试|
|src/ui/migration.js:118|url|URL.createObjectURL(       new Blob([JSON.stringify(report, null, 2)], { type: "application/json" }),     )|需要进一步测试|
|src/ui/migration.js:121|link|document.createElement("a")|需要进一步测试|
|src/ui/official-marx-theme.js:4|manifest|{     manifestVersion: 1,     id: "official.marx-theme",     name: { "zh-CN": "马克思主题", en: "Marx Theme" },     description: {       "zh-CN": "提供马克思的力量受控主题令牌。", |需要进一步测试|
|src/ui/official-miyamoto-plugin.js:4|manifest|{     manifestVersion: 1,     id: "official.miyamotos-power",     name: { "zh-CN": "宫本茂的力量", en: "Miyamoto's Power" },     description: {       "zh-CN":        |需要进一步测试|
|src/ui/plugin-appearance.js:4|KEY|"godpower_plugin_appearance_v1"|需要进一步测试|
|src/ui/plugin-appearance.js:5|TOKEN_KEYS|new Set([     "--ui-primary",     "--ui-primary-hover",     "--ui-accent",     "--ui-accent-hover",     "--ui-bg",     "--ui-panel",     "--ui-soft",     "--ui-|需要进一步测试|
|src/ui/plugin-appearance.js:19|TEXT_TARGETS|new Map([["home.description", ".gp-hero-description"]])|需要进一步测试|
|src/ui/plugin-appearance.js:20|defaults|new Map()|需要进一步测试|
|src/ui/plugin-appearance.js:21|applied|null|需要进一步测试|
|src/ui/plugin-appearance.js:31|[key, selector]||需要进一步测试|
|src/ui/plugin-appearance.js:32|node|document.querySelector(selector)|需要进一步测试|
|src/ui/plugin-appearance.js:37|key||需要进一步测试|
|src/ui/plugin-appearance.js:50|record|contributions.find(       (item) => item.id === ${pluginId}/${localId} && item.kind === "theme",     )|需要进一步测试|
|src/ui/plugin-appearance.js:55|tokens|record.descriptor.tokens ／／ {}|需要进一步测试|
|src/ui/plugin-appearance.js:56|[key, value]||需要进一步测试|
|src/ui/plugin-appearance.js:78|bundles|contributions.filter((item) => item.kind === "textBundle")|需要进一步测试|
|src/ui/plugin-appearance.js:79|bundle||需要进一步测试|
|src/ui/plugin-appearance.js:80|[key, value]||需要进一步测试|
|src/ui/plugin-appearance.js:83|selector|TEXT_TARGETS.get(key)|需要进一步测试|
|src/ui/plugin-appearance.js:86|node|document.querySelector(selector)|需要进一步测试|
|src/ui/plugin-appearance.js:97|saved|selection()|需要进一步测试|
|src/ui/plugin-appearance.js:98|restoredPluginTheme|false|需要进一步测试|
|src/ui/plugin-appearance.js:100|contributions|root.GodPowerPageShell?.listByPlugin(saved.pluginId) ／／ []|需要进一步测试|
|src/ui/plugin-appearance.js:123|plugin||需要进一步测试|
|src/ui/plugin-appearance.js:136|item|(       root.GodPowerPageShell?.listByPlugin("official.marx-theme") ／／ []     ).find((entry) => entry.kind === "theme" && entry.localId === "marx")|需要进一步测试|
|src/ui/plugin-center.js:3|$|(selector) => document.querySelector(selector)|需要进一步测试|
|src/ui/plugin-center.js:4|labels|{     "classroom.read": "课堂只读",     "students.read": "学生信息",     "groups.read": "小组信息",     "competition.stats.read": "竞技统计",     "competition.commands.request"|需要进一步测试|
|src/ui/plugin-center.js:34|platform||需要进一步测试|
|src/ui/plugin-center.js:35|route|null|需要进一步测试|
|src/ui/plugin-center.js:36|readyError|null|需要进一步测试|
|src/ui/plugin-center.js:37|legacyLibraryContent|null|需要进一步测试|
|src/ui/plugin-center.js:38|legacyItemAudio|null|需要进一步测试|
|src/ui/plugin-center.js:40|node|$("#pluginCenterStatus")|需要进一步测试|
|src/ui/plugin-center.js:47|repository|root.GodPowerPluginLocalRepository.createPluginLocalRepository(         root.localStorage,       )|需要进一步测试|
|src/ui/plugin-center.js:51|builtins|[       root.GodpowerMarxThemePlugin?.manifest,       root.GodpowerMiyamotoPlugin?.manifest,     ].filter(Boolean)|需要进一步测试|
|src/ui/plugin-center.js:55|platform|root.GodPowerPluginPlatform.createPluginPlatform({       contributions: root.GodPowerPageShell,       repository,       platform: "html",       currentScope: ()|需要进一步测试|
|src/ui/plugin-center.js:66|builtin||需要进一步测试|
|src/ui/plugin-center.js:67|installed|platform.get(builtin.id)|需要进一步测试|
|src/ui/plugin-center.js:71|required|builtin.permissions           .filter((permission) => permission.required)           .map((permission) => permission.capability)|需要进一步测试|
|src/ui/plugin-center.js:81|button|document.createElement("button")|需要进一步测试|
|src/ui/plugin-center.js:99|host|$("#pluginWorkspace")|需要进一步测试|
|src/ui/plugin-center.js:106|page|root.GodPowerPageShell.resolvePage(route)|需要进一步测试|
|src/ui/plugin-center.js:119|title|document.createElement("h3")|需要进一步测试|
|src/ui/plugin-center.js:121|body|document.createElement("p")|需要进一步测试|
|src/ui/plugin-center.js:123|code|document.createElement("code")|需要进一步测试|
|src/ui/plugin-center.js:128|section|document.createElement("div")|需要进一步测试|
|src/ui/plugin-center.js:130|eyebrow|document.createElement("span")|需要进一步测试|
|src/ui/plugin-center.js:133|heading|document.createElement("h3")|需要进一步测试|
|src/ui/plugin-center.js:135|intro|document.createElement("p")|需要进一步测试|
|src/ui/plugin-center.js:138|settings|document.createElement("section")|需要进一步测试|
|src/ui/plugin-center.js:140|settingCopy|document.createElement("div")|需要进一步测试|
|src/ui/plugin-center.js:141|settingTitle|document.createElement("h4")|需要进一步测试|
|src/ui/plugin-center.js:143|settingDescription|document.createElement("p")|需要进一步测试|
|src/ui/plugin-center.js:147|toggleLabel|document.createElement("label")|需要进一步测试|
|src/ui/plugin-center.js:150|toggle|document.createElement("input")|需要进一步测试|
|src/ui/plugin-center.js:157|track|document.createElement("span")|需要进一步测试|
|src/ui/plugin-center.js:162|moduleSettings|workspaceSection(       "道具模块工作台",       "分别配置每种道具的抽取流程与使用流程；配置即时生效并继续保存在现有本地存储中。",     )|需要进一步测试|
|src/ui/plugin-center.js:166|moduleHost|document.createElement("div")|需要进一步测试|
|src/ui/plugin-center.js:171|library|workspaceSection(       "道具百科与自定义图标",       "图鉴、图标包导入导出和单项图片继续使用原有兼容存储。",     )|需要进一步测试|
|src/ui/plugin-center.js:176|legacyLibrary|document.querySelector("#settingsV26_items")|需要进一步测试|
|src/ui/plugin-center.js:187|itemAudio|workspaceSection(       "道具音效",       "管理公共道具事件与每种道具的独立音效；音乐和基础操作音效仍留在音效与音乐设置。",     )|需要进一步测试|
|src/ui/plugin-center.js:216|card|document.createElement("section")|需要进一步测试|
|src/ui/plugin-center.js:218|title|document.createElement("h4")|需要进一步测试|
|src/ui/plugin-center.js:221|description|document.createElement("p")|需要进一步测试|
|src/ui/plugin-center.js:227|host|$("#pluginCenterContent")|需要进一步测试|
|src/ui/plugin-center.js:231|p|document.createElement("p")|需要进一步测试|
|src/ui/plugin-center.js:237|plugins|platform.list()|需要进一步测试|
|src/ui/plugin-center.js:240|empty|document.createElement("div")|需要进一步测试|
|src/ui/plugin-center.js:242|title|document.createElement("h3")|需要进一步测试|
|src/ui/plugin-center.js:244|copy|document.createElement("p")|需要进一步测试|
|src/ui/plugin-center.js:250|plugin||需要进一步测试|
|src/ui/plugin-center.js:251|record|platform.inspect(plugin.id)|需要进一步测试|
|src/ui/plugin-center.js:252|card|document.createElement("article")|需要进一步测试|
|src/ui/plugin-center.js:255|head|document.createElement("div")|需要进一步测试|
|src/ui/plugin-center.js:257|identity|document.createElement("div")|需要进一步测试|
|src/ui/plugin-center.js:258|title|document.createElement("h3")|需要进一步测试|
|src/ui/plugin-center.js:260|id|document.createElement("div")|需要进一步测试|
|src/ui/plugin-center.js:264|badge|document.createElement("span")|需要进一步测试|
|src/ui/plugin-center.js:276|description|document.createElement("p")|需要进一步测试|
|src/ui/plugin-center.js:282|permissions|document.createElement("div")|需要进一步测试|
|src/ui/plugin-center.js:286|actions|document.createElement("div")|需要进一步测试|
|src/ui/plugin-center.js:299|contributions|root.GodPowerPageShell.listByPlugin(plugin.id)|需要进一步测试|
|src/ui/plugin-center.js:301|item||需要进一步测试|
|src/ui/plugin-center.js:313|page||需要进一步测试|
|src/ui/plugin-center.js:329|text|await file.text()|需要进一步测试|
|src/ui/plugin-center.js:331|manifest|JSON.parse(text)|需要进一步测试|
|src/ui/plugin-center.js:337|button|event.target.closest("[data-plugin-action]")|需要进一步测试|
|src/ui/plugin-center.js:339|action|button.dataset.pluginAction|需要进一步测试|
|src/ui/plugin-center.js:340|id|button.dataset.pluginId|需要进一步测试|
|src/ui/plugin-center.js:347|[pluginId, ...rest]|id.split("/")|需要进一步测试|
|src/ui/plugin-center.js:353|result|root.GodPowerPluginAppearance.applyText(id)|需要进一步测试|
|src/ui/plugin-center.js:362|entry|platform.inspect(id)|需要进一步测试|
|src/ui/plugin-center.js:363|required|entry.manifest.permissions           .filter((p) => p.required)           .map((p) => p.capability)|需要进一步测试|
|src/ui/plugin-center.js:366|approved|window.confirm(           启用 ${entry.manifest.name["zh-CN"] ／／ id}？\n\n必需权限：${required.map((p) => labels[p] ／／ p).join("、") ／／ "无"}\n\n仅受限 JSON 贡献会启用，不会执行外部 Ja|需要进一步测试|
|src/ui/plugin-center.js:401|file|event.target.files?.[0]|需要进一步测试|
|src/ui/render.js:2|pendingRenderGridV21726|false|需要进一步测试|
|src/ui/render.js:57|attackPending|!attackRenderFlushingV21713 &&     (attackRenderGateV21713 ／／ attackRenderTimerV21713)|需要进一步测试|
|src/ui/round-feedback.js:2|RoundFeedback|(() => {   function afterPowerRound(powerBefore, roundToken) {     const targets = powerBefore       .filter((answer) => answer.answered && answer.correct)     |需要进一步测试|
|src/ui/round-feedback.js:4|targets|powerBefore       .filter((answer) => answer.answered && answer.correct)       .map((answer) => state.groups.find((group) => group.id === answer.id))       .fil|需要进一步测试|
|src/ui/round-feedback.js:18|updates|[]|需要进一步测试|
|src/ui/round-feedback.js:20|group|state.groups.find((candidate) => candidate.id === id)|需要进一步测试|
|src/ui/round-feedback.js:22|target|Number(group.score) ／／ 0|需要进一步测试|
|src/ui/round-feedback.js:23|start|Number(group.displayScore)|需要进一步测试|
|src/ui/round-feedback.js:24|visible|Number.isFinite(start) ? start : target|需要进一步测试|
|src/ui/round-feedback.js:29|refresh|() => {           try {             renderDashboard();             renderChart();             updateHeaderStats();           } catch (error) {             conso|需要进一步测试|
|src/ui/teaching-resource-workspace.js:4|ACTIVE_KEY|"godpower_active_classroom_context_v1"|需要进一步测试|
|src/ui/teaching-resource-workspace.js:5|REFRESH_EVENT|"godpower:active-classroom-changed"|需要进一步测试|
|src/ui/teaching-resource-workspace.js:6|refreshers|new Set()|需要进一步测试|
|src/ui/teaching-resource-workspace.js:7|byId|(host, id) => host.querySelector(#${id})|需要进一步测试|
|src/ui/teaching-resource-workspace.js:8|make|(tag, value, className = "") => {     const node = document.createElement(tag);     node.textContent = value;     if (className) node.className = className;    |需要进一步测试|
|src/ui/teaching-resource-workspace.js:9|node|document.createElement(tag)|需要进一步测试|
|src/ui/teaching-resource-workspace.js:20|binary|""|需要进一步测试|
|src/ui/teaching-resource-workspace.js:21|chunkSize|0x8000|需要进一步测试|
|src/ui/teaching-resource-workspace.js:22|offset|0|需要进一步测试|
|src/ui/teaching-resource-workspace.js:37|binary|atob(value)|需要进一步测试|
|src/ui/teaching-resource-workspace.js:44|rosterRepository|root.ClassroomRosterRepository.createClassroomRosterRepository({         storage,       })|需要进一步测试|
|src/ui/teaching-resource-workspace.js:48|section|document.createElement("section")|需要进一步测试|
|src/ui/teaching-resource-workspace.js:54|rosterResult|null|需要进一步测试|
|src/ui/teaching-resource-workspace.js:55|repository|null|需要进一步测试|
|src/ui/teaching-resource-workspace.js:56|resources|[]|需要进一步测试|
|src/ui/teaching-resource-workspace.js:57|activeObjectUrl|""|需要进一步测试|
|src/ui/teaching-resource-workspace.js:60|status|byId(section, "teachingResourceStatus")|需要进一步测试|
|src/ui/teaching-resource-workspace.js:66|currentRoster|rosterRepository.read()|需要进一步测试|
|src/ui/teaching-resource-workspace.js:78|profile|byId(section, "teachingResourceProfile")|需要进一步测试|
|src/ui/teaching-resource-workspace.js:79|classroom|byId(section, "teachingResourceClassroom")|需要进一步测试|
|src/ui/teaching-resource-workspace.js:80|previousProfile|profile.value|需要进一步测试|
|src/ui/teaching-resource-workspace.js:81|previousClassroom|classroom.value|需要进一步测试|
|src/ui/teaching-resource-workspace.js:84|profiles|rosterResult?.rosterData?.profiles ／／ []|需要进一步测试|
|src/ui/teaching-resource-workspace.js:85|classrooms|rosterResult?.rosterData?.classrooms ／／ []|需要进一步测试|
|src/ui/teaching-resource-workspace.js:86|item||需要进一步测试|
|src/ui/teaching-resource-workspace.js:88|item||需要进一步测试|
|src/ui/teaching-resource-workspace.js:90|context|null|需要进一步测试|
|src/ui/teaching-resource-workspace.js:112|id||需要进一步测试|
|src/ui/teaching-resource-workspace.js:122|subjectMatches|!subject ／／ resource.subjectId.toLocaleLowerCase().includes(subject)|需要进一步测试|
|src/ui/teaching-resource-workspace.js:124|queryMatches|!search ／／         [           resource.title,           resource.subjectId,           resource.fileName,           ...resource.tags,         ].some((value) => |需要进一步测试|
|src/ui/teaching-resource-workspace.js:136|url|URL.createObjectURL(resource.blob)|需要进一步测试|
|src/ui/teaching-resource-workspace.js:137|link|document.createElement("a")|需要进一步测试|
|src/ui/teaching-resource-workspace.js:163|dialog|document.createElement("dialog")|需要进一步测试|
|src/ui/teaching-resource-workspace.js:166|header|document.createElement("header")|需要进一步测试|
|src/ui/teaching-resource-workspace.js:167|title|make("h3", resource.title)|需要进一步测试|
|src/ui/teaching-resource-workspace.js:169|close|make("button", "❌", "ui-window-close")|需要进一步测试|
|src/ui/teaching-resource-workspace.js:174|body|document.createElement("div")|需要进一步测试|
|src/ui/teaching-resource-workspace.js:180|pre|document.createElement("pre")|需要进一步测试|
|src/ui/teaching-resource-workspace.js:181|text|await resource.blob.text()|需要进一步测试|
|src/ui/teaching-resource-workspace.js:191|image|document.createElement("img")|需要进一步测试|
|src/ui/teaching-resource-workspace.js:205|footer|document.createElement("footer")|需要进一步测试|
|src/ui/teaching-resource-workspace.js:212|save|make("button", "下载文件", "btn btn-primary")|需要进一步测试|
|src/ui/teaching-resource-workspace.js:232|list|byId(section, "teachingResourceList")|需要进一步测试|
|src/ui/teaching-resource-workspace.js:234|search|byId(section, "teachingResourceSearch")         .value.trim()         .toLocaleLowerCase()|需要进一步测试|
|src/ui/teaching-resource-workspace.js:237|subject|byId(section, "teachingResourceSubjectFilter")         .value.trim()         .toLocaleLowerCase()|需要进一步测试|
|src/ui/teaching-resource-workspace.js:240|visible|resources.filter((item) =>         matchingResource(item, search, subject),       )|需要进一步测试|
|src/ui/teaching-resource-workspace.js:255|item||需要进一步测试|
|src/ui/teaching-resource-workspace.js:256|card|document.createElement("article")|需要进一步测试|
|src/ui/teaching-resource-workspace.js:258|info|document.createElement("div")|需要进一步测试|
|src/ui/teaching-resource-workspace.js:275|actions|document.createElement("div")|需要进一步测试|
|src/ui/teaching-resource-workspace.js:277|previewButton|make("button", "预览", "btn btn-sm")|需要进一步测试|
|src/ui/teaching-resource-workspace.js:284|downloadButton|make("button", "下载", "btn btn-sm")|需要进一步测试|
|src/ui/teaching-resource-workspace.js:293|removeButton|make("button", "删除", "btn btn-sm btn-danger")|需要进一步测试|
|src/ui/teaching-resource-workspace.js:351|input|byId(section, "teachingResourceFiles")|需要进一步测试|
|src/ui/teaching-resource-workspace.js:352|files|[...input.files]|需要进一步测试|
|src/ui/teaching-resource-workspace.js:359|profileId|byId(section, "teachingResourceProfile").value|需要进一步测试|
|src/ui/teaching-resource-workspace.js:360|classroomId|byId(section, "teachingResourceClassroom").value|需要进一步测试|
|src/ui/teaching-resource-workspace.js:361|subjectId|byId(section, "teachingResourceSubject").value.trim()|需要进一步测试|
|src/ui/teaching-resource-workspace.js:363|title|byId(section, "teachingResourceTitle").value.trim()|需要进一步测试|
|src/ui/teaching-resource-workspace.js:364|tags|byId(section, "teachingResourceTags")         .value.split(/[，,]/)         .map((value) => value.trim())         .filter(Boolean)|需要进一步测试|
|src/ui/teaching-resource-workspace.js:391|entries|await repository.exportAll({           profileId: byId(section, "teachingResourceProfile").value,           classroomId: byId(section, "teachingResourceClassroo|需要进一步测试|
|src/ui/teaching-resource-workspace.js:395|packed|[]|需要进一步测试|
|src/ui/teaching-resource-workspace.js:396|entry||需要进一步测试|
|src/ui/teaching-resource-workspace.js:397|{ blob, ...metadata }|entry|需要进一步测试|
|src/ui/teaching-resource-workspace.js:403|blob|new Blob(           [             JSON.stringify(               {                 format: "godpower-teaching-resources",                 schemaVersion: 1,      |需要进一步测试|
|src/ui/teaching-resource-workspace.js:428|input|byId(section, "teachingResourceRestoreFile")|需要进一步测试|
|src/ui/teaching-resource-workspace.js:429|file|input.files[0]|需要进一步测试|
|src/ui/teaching-resource-workspace.js:434|pack|JSON.parse(await file.text())|需要进一步测试|
|src/ui/teaching-resource-workspace.js:452|records|pack.resources.map((entry) => {           const bytes = fromBase64(entry.dataBase64);           const content = new Blob([bytes], { type: entry.mimeType });    |需要进一步测试|
|src/ui/teaching-resource-workspace.js:453|bytes|fromBase64(entry.dataBase64)|需要进一步测试|
|src/ui/teaching-resource-workspace.js:454|content|new Blob([bytes], { type: entry.mimeType })|需要进一步测试|
|src/ui/teaching-resource-workspace.js:455|restoredFile|new File([content], entry.fileName, {             type: entry.mimeType,           })|需要进一步测试|
|src/ui/teaching-workspace.js:3|ACTIVE_CLASSROOM_KEY|"godpower_active_classroom_context_v1"|需要进一步测试|
|src/ui/teaching-workspace.js:4|DAY_NAMES|[     "星期日",     "星期一",     "星期二",     "星期三",     "星期四",     "星期五",     "星期六",   ]|需要进一步测试|
|src/ui/teaching-workspace.js:13|id|(host, value) => host.querySelector(#${value})|需要进一步测试|
|src/ui/teaching-workspace.js:14|text|(tag, value, className = "") => {     const element = document.createElement(tag);     element.textContent = value;     if (className) element.className = class|需要进一步测试|
|src/ui/teaching-workspace.js:15|element|document.createElement(tag)|需要进一步测试|
|src/ui/teaching-workspace.js:20|toMinute|(value) => {     const [hour, minute] = value.split(":").map(Number);     return hour * 60 + minute;   }|需要进一步测试|
|src/ui/teaching-workspace.js:21|[hour, minute]|value.split(":").map(Number)|需要进一步测试|
|src/ui/teaching-workspace.js:24|toTime|(value) =>     ${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}|需要进一步测试|
|src/ui/teaching-workspace.js:26|refreshers|new Set()|需要进一步测试|
|src/ui/teaching-workspace.js:33|rosterRepository|root.ClassroomRosterRepository.createClassroomRosterRepository({         storage,       })|需要进一步测试|
|src/ui/teaching-workspace.js:37|scheduleRepository|root.TeachingScheduleRepository.createTeachingScheduleRepository({         storage,       })|需要进一步测试|
|src/ui/teaching-workspace.js:41|section|document.createElement("section")|需要进一步测试|
|src/ui/teaching-workspace.js:47|rosterResult|null|需要进一步测试|
|src/ui/teaching-workspace.js:48|schedule|null|需要进一步测试|
|src/ui/teaching-workspace.js:49|revision|0|需要进一步测试|
|src/ui/teaching-workspace.js:50|profileId|""|需要进一步测试|
|src/ui/teaching-workspace.js:51|editingScheduleId|""|需要进一步测试|
|src/ui/teaching-workspace.js:54|element|id(section, "teachingScheduleStatus")|需要进一步测试|
|src/ui/teaching-workspace.js:68|now|getNow()|需要进一步测试|
|src/ui/teaching-workspace.js:69|match|null|需要进一步测试|
|src/ui/teaching-workspace.js:77|classroom|rosterResult?.rosterData?.classrooms.find(         (entry) => entry.classroomId === match?.classroomId,       )|需要进一步测试|
|src/ui/teaching-workspace.js:86|value|JSON.stringify({           schemaVersion: 1,           userProfileId: profileId,           classroomId: classroom.classroomId,           sourceScheduleId: match|需要进一步测试|
|src/ui/teaching-workspace.js:108|hostList|id(section, "teachingScheduleList")|需要进一步测试|
|src/ui/teaching-workspace.js:110|entries|currentEntries()|需要进一步测试|
|src/ui/teaching-workspace.js:116|table|document.createElement("table")|需要进一步测试|
|src/ui/teaching-workspace.js:118|header|document.createElement("tr")|需要进一步测试|
|src/ui/teaching-workspace.js:119|label||需要进一步测试|
|src/ui/teaching-workspace.js:121|thead|document.createElement("thead")|需要进一步测试|
|src/ui/teaching-workspace.js:123|tbody|document.createElement("tbody")|需要进一步测试|
|src/ui/teaching-workspace.js:124|entry||需要进一步测试|
|src/ui/teaching-workspace.js:125|row|document.createElement("tr")|需要进一步测试|
|src/ui/teaching-workspace.js:126|classroom|rosterResult.rosterData.classrooms.find(           (item) => item.classroomId === entry.classroomId,         )|需要进一步测试|
|src/ui/teaching-workspace.js:136|action|document.createElement("td")|需要进一步测试|
|src/ui/teaching-workspace.js:137|edit|text("button", "编辑", "btn btn-sm")|需要进一步测试|
|src/ui/teaching-workspace.js:154|remove|text("button", "删除", "btn btn-sm btn-danger")|需要进一步测试|
|src/ui/teaching-workspace.js:177|profile|id(section, "teachingProfile")|需要进一步测试|
|src/ui/teaching-workspace.js:178|classroom|id(section, "teachingClassroom")|需要进一步测试|
|src/ui/teaching-workspace.js:179|previousProfile|profile.value ／／ profileId|需要进一步测试|
|src/ui/teaching-workspace.js:182|item||需要进一步测试|
|src/ui/teaching-workspace.js:184|item||需要进一步测试|
|src/ui/teaching-workspace.js:202|scheduleResult|scheduleRepository.read()|需要进一步测试|
|src/ui/teaching-workspace.js:219|classroomId|id(section, "teachingClassroom").value|需要进一步测试|
|src/ui/teaching-workspace.js:222|entry|{           scheduleId: root.StableIdentity.createScheduleId(),           userProfileId: profileId,           classroomId,           weekday: Number(id(section,|需要进一步测试|
|src/ui/teaching-workspace.js:232|entries|editingScheduleId           ? schedule.entries.map((item) =>               item.scheduleId === editingScheduleId                 ? { ...entry, scheduleId: editi|需要进一步测试|
|src/ui/teaching-workspace.js:254|result|scheduleRepository.write(schedule, {         expectedRevision: revision,       })|需要进一步测试|
|src/ui/themes.js:4|KEY|"godpower_appearance_v1"|需要进一步测试|
|src/ui/themes.js:5|names|{ classic: "上帝的力量", marx: "马克思的力量" }|需要进一步测试|
|src/ui/themes.js:6|star|"m12 2 2.8 6.2 6.7.8-5 4.7 1.4 6.7-5.9-3.3-5.9 3.3 1.4-6.7-5-4.7 6.7-.8Z"|需要进一步测试|
|src/ui/themes.js:8|paths|{     home: "M3 11 12 4l9 7M5 10v11h14V10M9 21v-7h6v7M12 1v3",     battle: "M4 20 16 8m-4-4 8 8m-8-8 4-3 7 7-3 4M2 16l6 6M3 3l6 3-3 3Z",     history: "M4 12a8 8|需要进一步测试|
|src/ui/themes.js:25|emblem|<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="红星麦穗徽记"><rect width="64" height="64" rx="15" fill="#a91e2c"/><g fill="none" |需要进一步测试|
|src/ui/themes.js:26|theme|"classic"|需要进一步测试|
|src/ui/themes.js:27|active|null|需要进一步测试|
|src/ui/themes.js:28|classicBrand|null|需要进一步测试|
|src/ui/themes.js:29|classicIcon|null|需要进一步测试|
|src/ui/themes.js:35|classics|new Map()|需要进一步测试|
|src/ui/themes.js:38|path|theme === "marx" ? paths[name] ／／ star : fallback|需要进一步测试|
|src/ui/themes.js:52|label|document.querySelector(".gp-brand-label")|需要进一步测试|
|src/ui/themes.js:55|title|document.getElementById("gpIntroTitle")|需要进一步测试|
|src/ui/themes.js:63|foot|document.querySelector(".gp-footnote")|需要进一步测试|
|src/ui/themes.js:65|svg|document.querySelector("#gpBrandMount svg,#gpIntroLogo svg")|需要进一步测试|
|src/ui/themes.js:77|favicon|document.querySelector('link[rel="icon"]')|需要进一步测试|
|src/ui/themes.js:85|svg||需要进一步测试|
|src/ui/themes.js:86|key|svg.dataset.themeIcon|需要进一步测试|
|src/ui/themes.js:94|button||需要进一步测试|
|src/ui/themes.js:108|current|active|需要进一步测试|
|src/ui/themes.js:110|animation||需要进一步测试|
|src/ui/themes.js:118|persisted|true|需要进一步测试|
|src/ui/themes.js:125|prefs|typeof DesktopUI !== "undefined" ? DesktopUI.getPreferences() : {}|需要进一步测试|
|src/ui/themes.js:127|reduce|matchMedia("(prefers-reduced-motion: reduce)").matches|需要进一步测试|
|src/ui/themes.js:138|overlay|document.createElement("div")|需要进一步测试|
|src/ui/themes.js:146|result|new Promise((resolve) => {       active = {         element: overlay,         animations: [],         resolve: () => resolve({ ok: true, persisted }),       }; |需要进一步测试|
|src/ui/themes.js:153|current|active|需要进一步测试|
|src/ui/themes.js:157|motion|overlay.animate(       [         { opacity: 0 },         { opacity: 1, offset: 0.24 },         { opacity: 1, offset: 0.6 },         { opacity: 0 },       ],    |需要进一步测试|
|src/ui/themes.js:166|content|overlay       .querySelector(".gp-theme-transition-content")       .animate(         [           { opacity: 0, transform: "translateY(24px) scale(.95)" },      |需要进一步测试|
|src/ui/themes.js:175|ribbon|overlay.querySelector(".gp-theme-ribbon").animate(       [         { transform: "translateX(-35%) rotate(-12deg)", opacity: 0 },         { transform: "translate|需要进一步测试|
|src/ui/themes.js:193|section|document.createElement("section")|需要进一步测试|
|src/ui/tooltips.js:5|id|"godpower-hover-tooltip"|需要进一步测试|
|src/ui/tooltips.js:6|pointerOwner|null|需要进一步测试|
|src/ui/tooltips.js:7|focusOwner|null|需要进一步测试|
|src/ui/tooltips.js:8|active|null|需要进一步测试|
|src/ui/tooltips.js:9|tooltip|null|需要进一步测试|
|src/ui/tooltips.js:28|current|owner.getAttribute("aria-describedby")|需要进一步测试|
|src/ui/tooltips.js:36|tokens|current       .split(/\s+/)       .filter((token) => token && token !== id)|需要进一步测试|
|src/ui/tooltips.js:57|rect|active.owner.getBoundingClientRect()|需要进一步测试|
|src/ui/tooltips.js:58|margin|8|需要进一步测试|
|src/ui/tooltips.js:59|width|tooltip.offsetWidth|需要进一步测试|
|src/ui/tooltips.js:60|height|tooltip.offsetHeight|需要进一步测试|
|src/ui/tooltips.js:61|left|Math.max(       margin,       Math.min(         rect.left + (rect.width - width) / 2,         window.innerWidth - width - margin,       ),     )|需要进一步测试|
|src/ui/tooltips.js:68|below|rect.bottom + margin|需要进一步测试|
|src/ui/tooltips.js:69|preferredTop|below + height <= window.innerHeight - margin         ? below         : Math.max(margin, rect.top - height - margin)|需要进一步测试|
|src/ui/tooltips.js:73|top|Math.max(       margin,       Math.min(preferredTop, window.innerHeight - height - margin),     )|需要进一步测试|
|src/ui/tooltips.js:110|previous|active|需要进一步测试|
|src/ui/tooltips.js:127|owner|pointerOwner ／／ focusOwner|需要进一步测试|
|src/ui/tooltips.js:131|bubble|getTooltip()|需要进一步测试|
|src/ui/tooltips.js:169|owner|titleOwner(event.target)|需要进一步测试|
|src/ui/welcome-v2.js:4|$|(id) => document.getElementById(id)|需要进一步测试|
|src/ui/welcome-v2.js:5|reduceMotion|matchMedia("(prefers-reduced-motion: reduce)")|需要进一步测试|
|src/ui/welcome-v2.js:6|started|false|需要进一步测试|
|src/ui/welcome-v2.js:7|introOpened|false|需要进一步测试|
|src/ui/welcome-v2.js:8|introBusy|false|需要进一步测试|
|src/ui/welcome-v2.js:9|introFinished|false|需要进一步测试|
|src/ui/welcome-v2.js:10|slidePx|0|需要进一步测试|
|src/ui/welcome-v2.js:11|activePointer|null|需要进一步测试|
|src/ui/welcome-v2.js:12|settleEntrance|null|需要进一步测试|
|src/ui/welcome-v2.js:13|focusBeforeIntro|null|需要进一步测试|
|src/ui/welcome-v2.js:14|frame|null|需要进一步测试|
|src/ui/welcome-v2.js:15|cruiseTimer|null|需要进一步测试|
|src/ui/welcome-v2.js:16|cruiseTime|null|需要进一步测试|
|src/ui/welcome-v2.js:17|cruisePosition|null|需要进一步测试|
|src/ui/welcome-v2.js:18|pauseUntil|0|需要进一步测试|
|src/ui/welcome-v2.js:19|trackHovered|false|需要进一步测试|
|src/ui/welcome-v2.js:20|trackFocused|false|需要进一步测试|
|src/ui/welcome-v2.js:21|draggingTrack|false|需要进一步测试|
|src/ui/welcome-v2.js:22|rankSignature|""|需要进一步测试|
|src/ui/welcome-v2.js:23|feedSignature|""|需要进一步测试|
|src/ui/welcome-v2.js:24|background|new Map()|需要进一步测试|
|src/ui/welcome-v2.js:25|animations|new Set()|需要进一步测试|
|src/ui/welcome-v2.js:26|esc|(value) =>     String(value ?? "").replace(       /[&<>"']/g,       (ch) =>         ({           "&": "&amp;",           "<": "&lt;",           ">": "&gt;",    |需要进一步测试|
|src/ui/welcome-v2.js:38|preferences|() =>     (typeof DesktopUI !== "undefined" ? DesktopUI.getPreferences() : null) ／／ {       motion: "full",       speed: 1,       systemMotion: true,       page|需要进一步测试|
|src/ui/welcome-v2.js:46|canAnimate|() =>     preferences().motion !== "off" &&     !(preferences().systemMotion && reduceMotion.matches)|需要进一步测试|
|src/ui/welcome-v2.js:49|realGroups|() => (Array.isArray(state.groups) ? state.groups : [])|需要进一步测试|
|src/ui/welcome-v2.js:50|score|(g) => Number(g.score) ／／ 0|需要进一步测试|
|src/ui/welcome-v2.js:52|el|$(id)|需要进一步测试|
|src/ui/welcome-v2.js:53|text|String(value)|需要进一步测试|
|src/ui/welcome-v2.js:58|groups|realGroups()|需要进一步测试|
|src/ui/welcome-v2.js:59|mask|Number(state.itemGlobal?.blooperUntil ／／ 0) > Date.now()|需要进一步测试|
|src/ui/welcome-v2.js:61|ordered|ranking()|需要进一步测试|
|src/ui/welcome-v2.js:62|ranked|mask ? groups : ordered|需要进一步测试|
|src/ui/welcome-v2.js:63|summary|GodpowerUIModel.standings(ordered)|需要进一步测试|
|src/ui/welcome-v2.js:68|id||需要进一步测试|
|src/ui/welcome-v2.js:70|signature|JSON.stringify([       mask,       ranked.map((g) => [g.id, g.name, g.score]),     ])|需要进一步测试|
|src/ui/welcome-v2.js:85|max|Math.max(1, ...ranked.map(score))|需要进一步测试|
|src/ui/welcome-v2.js:89|medal|mask                 ? ""                 : i === 0                   ? " gp-medal"                   : i === 1                     ? " gp-medal gp-second"     |需要进一步测试|
|src/ui/welcome-v2.js:98|pct|mask                 ? 0                 : Math.max(0, Math.min(100, (score(g) / max) * 100))|需要进一步测试|
|src/ui/welcome-v2.js:106|phases|{       NOT_STARTED: ["赛场准备就绪", "随时可以前往比赛页面开始新回合"],       FINISHED: ["本场比赛已结束", "可查看档案或准备下一届比赛"],       SETTLED: ["本题已结算", "积分已更新，可前往赛场进入下一题"],       ANSWER_SEL|需要进一步测试|
|src/ui/welcome-v2.js:113|phase|phases[Reliability.phase(state)]|需要进一步测试|
|src/ui/welcome-v2.js:116|recent|historyStack.slice(-4).reverse()|需要进一步测试|
|src/ui/welcome-v2.js:117|nextFeed|JSON.stringify(recent.map((h) => [h.desc, h.time]))|需要进一步测试|
|src/ui/welcome-v2.js:139|track|$("uiGroupTrack")|需要进一步测试|
|src/ui/welcome-v2.js:157|enabled|!!preferences().groupCruise|需要进一步测试|
|src/ui/welcome-v2.js:169|track|$("uiGroupTrack")|需要进一步测试|
|src/ui/welcome-v2.js:176|first|track.querySelector(".ui-group-card")|需要进一步测试|
|src/ui/welcome-v2.js:177|repeat|track.querySelector(".ui-group-repeat")|需要进一步测试|
|src/ui/welcome-v2.js:178|period|repeat && first ? repeat.offsetLeft - first.offsetLeft : 0|需要进一步测试|
|src/ui/welcome-v2.js:185|elapsed|cruiseTime === null ? 0 : Math.min(50, now - cruiseTime)|需要进一步测试|
|src/ui/welcome-v2.js:196|track|$("uiGroupTrack")|需要进一步测试|
|src/ui/welcome-v2.js:197|originals|[...track.querySelectorAll(".ui-group-card")]|需要进一步测试|
|src/ui/welcome-v2.js:198|first|originals[0]|需要进一步测试|
|src/ui/welcome-v2.js:199|last|originals.at(-1)|需要进一步测试|
|src/ui/welcome-v2.js:200|baseWidth|first && last         ? last.offsetLeft + last.offsetWidth - first.offsetLeft + 40         : 0|需要进一步测试|
|src/ui/welcome-v2.js:204|needed|preferences().groupCruise &&       canAnimate() &&       baseWidth > track.clientWidth + 6|需要进一步测试|
|src/ui/welcome-v2.js:208|copies|[...track.querySelectorAll(".ui-group-repeat")]|需要进一步测试|
|src/ui/welcome-v2.js:219|copy|original.cloneNode(true)|需要进一步测试|
|src/ui/welcome-v2.js:237|track|$("uiGroupTrack")|需要进一步测试|
|src/ui/welcome-v2.js:269|id||需要进一步测试|
|src/ui/welcome-v2.js:281|el||需要进一步测试|
|src/ui/welcome-v2.js:293|[el, inert]||需要进一步测试|
|src/ui/welcome-v2.js:307|modal|[       ...document.querySelectorAll('[role="dialog"][aria-modal="true"]'),     ].find(       (el) =>         el.id !== "gpIntro" &&         el.getClientRects()|需要进一步测试|
|src/ui/welcome-v2.js:319|overlay|$("gpIntro")|需要进一步测试|
|src/ui/welcome-v2.js:320|logo|$("gpIntroLogo")|需要进一步测试|
|src/ui/welcome-v2.js:321|svg|$("gpBrandMount").querySelector("svg")|需要进一步测试|
|src/ui/welcome-v2.js:349|track|$("gpSlideTrack")|需要进一步测试|
|src/ui/welcome-v2.js:350|max|Math.max(1, track.clientWidth - 56)|需要进一步测试|
|src/ui/welcome-v2.js:357|track|$("gpSlideTrack")|需要进一步测试|
|src/ui/welcome-v2.js:358|pointer|activePointer|需要进一步测试|
|src/ui/welcome-v2.js:374|overlay|$("gpIntro")|需要进一步测试|
|src/ui/welcome-v2.js:375|logo|$("gpIntroLogo")|需要进一步测试|
|src/ui/welcome-v2.js:376|title|$("gpIntroTitle")|需要进一步测试|
|src/ui/welcome-v2.js:377|mount|$("gpBrandMount")|需要进一步测试|
|src/ui/welcome-v2.js:378|svg|logo.querySelector("svg")|需要进一步测试|
|src/ui/welcome-v2.js:379|label|document.querySelector(".gp-brand-label")|需要进一步测试|
|src/ui/welcome-v2.js:381|animate|!skip && canAnimate() && logo.animate|需要进一步测试|
|src/ui/welcome-v2.js:390|settled|false|需要进一步测试|
|src/ui/welcome-v2.js:391|settle|() => {       if (settled) return;       settled = true;       settleEntrance = null;       for (const animation of animations) animation.cancel();       animat|需要进一步测试|
|src/ui/welcome-v2.js:395|animation||需要进一步测试|
|src/ui/welcome-v2.js:408|prior|focusBeforeIntro|需要进一步测试|
|src/ui/welcome-v2.js:409|target|prior &&         prior !== document.body &&         prior.isConnected &&         prior.getClientRects().length &&         !prior.closest("[inert]") &&         (|需要进一步测试|
|src/ui/welcome-v2.js:430|el||需要进一步测试|
|src/ui/welcome-v2.js:435|a|logo.getBoundingClientRect()|需要进一步测试|
|src/ui/welcome-v2.js:436|b|mount.getBoundingClientRect()|需要进一步测试|
|src/ui/welcome-v2.js:437|t|title.getBoundingClientRect()|需要进一步测试|
|src/ui/welcome-v2.js:438|v|label.getBoundingClientRect()|需要进一步测试|
|src/ui/welcome-v2.js:439|zoom|Number(getComputedStyle(document.body).zoom) ／／ 1|需要进一步测试|
|src/ui/welcome-v2.js:440|options|{       duration:         (preferences().motion === "simple" ? 260 : 840) / preferences().speed,       easing: "cubic-bezier(.22,.8,.22,1)",       fill: "forwar|需要进一步测试|
|src/ui/welcome-v2.js:446|movement|(from, to) =>       translate(${(to.left + to.width / 2 - from.left - from.width / 2) / zoom}px,${(to.top + to.height / 2 - from.top - from.height / 2) / zoom}|需要进一步测试|
|src/ui/welcome-v2.js:516|track|$("gpSlideTrack")|需要进一步测试|
|src/ui/welcome-v2.js:517|fromEvent|(event) => {       const box = track.getBoundingClientRect();       drawSlide(         (event.clientX - box.left) / (box.width / track.offsetWidth) - 28,       |需要进一步测试|
|src/ui/welcome-v2.js:518|box|track.getBoundingClientRect()|需要进一步测试|
|src/ui/welcome-v2.js:539|cancel|(event) => {       if (event.pointerId === activePointer) {         resetPointer();         drawSlide(0);       }     }|需要进一步测试|
|src/ui/welcome-v2.js:575|controls|introBusy             ? [$("gpIntroSkip")]             : [track, $("gpIntroSkip")]|需要进一步测试|
|src/ui/welcome-v2.js:578|at|controls.indexOf(document.activeElement)|需要进一步测试|
|src/ui/welcome-v2.js:611|logo|$("gpIntroLogo").querySelector("svg")|需要进一步测试|
|src/ui/welcome-v2.js:612|favicon|document.querySelector('link[rel="icon"]')|需要进一步测试|

## 动画、计时器、事件监听注册与清理

|位置|调用|参数摘要|分类|
|---|---|---|---|
|src/script/00.js:264|setTimeout|() => { if (input) { input.focus(); input.select(); } }; 60|需要进一步测试|
|src/script/00.js:317|setTimeout|() => playSound('roll_win'); 450|需要进一步测试|
|src/script/00.js:394|requestAnimationFrame|loop|需要进一步测试|
|src/script/00.js:396|cancelAnimationFrame|confettiAnimationId|需要进一步测试|
|src/script/00.js:402|cancelAnimationFrame|confettiAnimationId|需要进一步测试|
|src/script/00.js:496|window.setTimeout|fn; Math.min(timeout, 800)|需要进一步测试|
|src/script/00.js:666|setTimeout|() => res(); 1500|需要进一步测试|
|src/script/00.js:1039|clearTimeout|id|需要进一步测试|
|src/script/00.js:1079|setTimeout|() => {     scheduleDualLoopChunk(nextStartTime, loopStartSec);   }; delayMs|需要进一步测试|
|src/script/00.js:1149|setTimeout|() => {       bgmPreloadNextSet();     }; 1000|需要进一步测试|
|src/script/00.js:1200|clearTimeout|bgmEngine.transitionTimer|需要进一步测试|
|src/script/00.js:1234|setTimeout|() => {       bgmEngine.transitionTimer = null;       if (bgmEngine.state === 'TRANSITION') {         const stillAllIn = checkAllInRatio();         if (stillAllIn) {           bgmE; Math.max(0, (battleResumeTime - audioCtx.currentTime) * 1000)|需要进一步测试|
|src/script/00.js:1254|clearTimeout|bgmEngine.transitionTimer|需要进一步测试|
|src/script/00.js:1304|clearTimeout|bgmEngine.transitionTimer|需要进一步测试|
|src/script/00.js:1328|setTimeout|() => {       bgmEngine.victoryFadeTimer = null;       if (bgmEngine.battleSource) { try { bgmEngine.battleSource.stop(); } catch(e) {} bgmEngine.battleSource = null; }       if (b; Math.max(0, (triggerTime + 0.055 - now) * 1000)|需要进一步测试|
|src/script/00.js:1355|setTimeout|() => {         bgmEngine.victoryTimer = null;         if (bgmEngine.state === 'VICTORY') {           bgmStopAll();           if (callback) callback();         }       }; Math.max(0, (triggerTime - now + 3.0) * 1000)|需要进一步测试|
|src/script/00.js:1372|clearTimeout|bgmEngine.victoryTimer|需要进一步测试|
|src/script/00.js:1376|clearTimeout|bgmEngine.victoryFadeTimer|需要进一步测试|
|src/script/00.js:1380|clearTimeout|bgmEngine.transitionTimer|需要进一步测试|
|src/script/00.js:1415|clearTimeout|toastTimer|需要进一步测试|
|src/script/00.js:1421|setTimeout|() => {     t.classList.remove('show');     if(t.matches(':popover-open'))t.hidePopover();     toastTimer = null;   }; 3800|需要进一步测试|
|src/script/00.js:1565|setTimeout|() => document.getElementById('pwdInput').focus(); 80|需要进一步测试|
|src/script/00.js:1635|setTimeout|() => res(false); 2500|需要进一步测试|
|src/script/00.js:1857|setTimeout|() => document.getElementById('modalCustomInput').focus(); 50|需要进一步测试|
|src/script/00.js:1913|setTimeout|() => {     banner.classList.remove('show');     card.classList.remove('milestone-glow');   }; 2200|需要进一步测试|
|src/script/00.js:1923|cancelAnimationFrame|activeScoreAnimId|需要进一步测试|
|src/script/00.js:1931|cancelAnimationFrame|activeScoreAnimId|需要进一步测试|
|src/script/00.js:1956|requestAnimationFrame|tick|需要进一步测试|
|src/script/00.js:1969|requestAnimationFrame|tick|需要进一步测试|
|src/script/00.js:2076|setTimeout|() => input.focus(); 50|需要进一步测试|
|src/script/00.js:2563|setInterval|() => {       const randomGrp = reelGrps[Math.floor(Math.random() * reelGrps.length)];       reelGrpText.innerText = randomGrp.name;     }; 70|需要进一步测试|
|src/script/00.js:2571|setInterval|() => {       const randomStu = reelStus[Math.floor(Math.random() * reelStus.length)];       reelStuText.innerHTML = studentLabelHTMLV218(randomStu.name, randomStu.group);     }; 50|需要进一步测试|
|src/script/00.js:2583|clearInterval|slotEngine.timerGroup|需要进一步测试|
|src/script/00.js:2584|clearInterval|slotEngine.timerStudent|需要进一步测试|
|src/script/00.js:2690|setTimeout|()=>URL.revokeObjectURL(url); 1000|需要进一步测试|
|src/script/00.js:3163|setInterval|updateWelcomeClock; 1000|需要进一步测试|
|src/script/00.js:3650|clearTimeout|menuReloadTimer|需要进一步测试|
|src/script/00.js:3651|setTimeout|async () => {     menuReloadTimer = null;     const key = menuBgm.currentKey;     if (!key ／／ !menuBgm.active) return;     delete menuBgm.buffers[key];     menuBgm.uploadedKeys.del; 250|需要进一步测试|
|src/script/00.js:3809|setTimeout|() => {     try { rollLoopNode.stop(); } catch(e) {}     rollLoopNode = null;     rollLoopGain = null;     if (cb) cb();   }; 160|需要进一步测试|
|src/script/00.js:3931|window.addEventListener|'DOMContentLoaded'; initWallpaper|需要进一步测试|
|src/script/00.js:3933|window.addEventListener|'DOMContentLoaded'; () => {   if (state.zoomLevel !== 1.0) {     document.body.style.zoom = state.zoomLevel;   }   initResizerDrag();   renderAll();   renderWelcomePage();   startWelcomeClock();    //|需要进一步测试|
|src/script/00.js:3962|setInterval|() => {       if (audioCtx && audioCtx.state === 'running') {         clearInterval(resumeRetryTimer); resumeRetryTimer = null;         hideAudioHint();         return;       }    ; 1000|需要进一步测试|
|src/script/00.js:3964|clearInterval|resumeRetryTimer|需要进一步测试|
|src/script/00.js:3973|clearInterval|resumeRetryTimer|需要进一步测试|
|src/script/00.js:3998|window.addEventListener|ev; unlockByGesture; { once: true, passive: true }|需要进一步测试|
|src/script/00.js:4098|setTimeout|()=>d.remove(); 1900|需要进一步测试|
|src/script/00.js:4221|setTimeout|()=>{const c=document.querySelector(.group-row-card[data-group-id="${id}"]);if(c){c.classList.add('effect-bomb');setTimeout(()=>c.classList.remove('effect-bomb'),900)}}; 30|需要进一步测试|
|src/script/00.js:4221|setTimeout|()=>c.classList.remove('effect-bomb'); 900|需要进一步测试|
|src/script/00.js:4223|clearInterval|bulletTimer|需要进一步测试|
|src/script/00.js:4223|setInterval|()=>{let any=false;ensureItemState();state.groups.forEach(g=>{if(!g.itemEffect／／g.itemEffect.type!=='bullet')return;any=true;const t=state.groups.find(x=>x.id===g.itemEffect.target; 350|需要进一步测试|
|src/script/00.js:4223|clearInterval|bulletTimer|需要进一步测试|
|src/script/00.js:4224|setTimeout|startBlooperClock; 500|需要进一步测试|
|src/script/00.js:4229|setInterval|()=>{eligible.forEach(g=>{const k=ITEM_KEYS[Math.floor(Math.random()*ITEM_KEYS.length)],c=grid.querySelector([data-draw-id="${g.id}"] .roulette);if(c)c.innerHTML=itemVisual(k)})}; 90|需要进一步测试|
|src/script/00.js:4230|setTimeout|()=>{clearInterval(timer);eligible.forEach(g=>{const key=drawItemForGroup(g);if(key)addItemToGroup(g,key);const card=grid.querySelector([data-draw-id="${g.id}"]);if(card&&key){ca; 3000|需要进一步测试|
|src/script/00.js:4230|clearInterval|timer|需要进一步测试|
|src/script/00.js:4230|setTimeout|()=>{ov.classList.remove('active');itemDrawBusy=false}; 3000|需要进一步测试|
|src/script/00.js:4361|window.addEventListener|'DOMContentLoaded'; ()=>{ensureItemState();renderAll();startBulletTimer();startBlooperClock()}|需要进一步测试|
|src/script/00.js:4425|setInterval|()=>eligible.forEach(g=>{const o=overlays.get(g.id);if(!o)return;const r=ranking(),pos=r.findIndex(x=>x.id===g.id)+1;const k=weightedPick(itemDropWeights(pos,r.length));o.querySele; 85|需要进一步测试|
|src/script/00.js:4426|setTimeout|()=>{clearInterval(timer);eligible.forEach(g=>{const k=drawItemForGroup(g),o=overlays.get(g.id);if(k)addItemToGroup(g,k);if(o&&k){o.classList.add('reveal');o.querySelector('.r-icon; 3000|需要进一步测试|
|src/script/00.js:4426|clearInterval|timer|需要进一步测试|
|src/script/00.js:4427|setTimeout|()=>{eligible.forEach(g=>{const c=document.querySelector(.group-row-card[data-group-id="${g.id}"]);if(c){c.classList.remove('item-draw-spinning');c.querySelector('.card-item-roul; 3000|需要进一步测试|
|src/script/00.js:4441|setTimeout|()=>URL.revokeObjectURL(a.href); 1000|需要进一步测试|
|src/script/00.js:4481|document.getElementById('aboutBackdrop')?.addEventListener|'click'; e=>{if(e.target.id==='aboutBackdrop')closeAbout()}|需要进一步测试|
|src/script/00.js:4482|document.getElementById('handRaiseBackdrop')?.addEventListener|'click'; e=>{if(e.target.id==='handRaiseBackdrop')closeHandRaise()}|需要进一步测试|
|src/script/00.js:4483|setTimeout|installSettingsTabs; 0|需要进一步测试|
|src/script/00.js:4484|window.addEventListener|'DOMContentLoaded'; ()=>{ensureV2State();installSettingsTabs();renderPickerInfo()}|需要进一步测试|
|src/script/00.js:4491|clearInterval|handItemDrawTimer|需要进一步测试|
|src/script/00.js:4492|clearTimeout|handItemDrawFinishTimer|需要进一步测试|
|src/script/00.js:4548|setInterval|tick; 82|需要进一步测试|
|src/script/00.js:4550|setTimeout|()=>{     clearInterval(handItemDrawTimer);handItemDrawTimer=null;handItemDrawFinishTimer=null;     const live=state.groups.find(x=>x.id===handItemDrawGroupId);     if(!live／／!elig; 3000|需要进一步测试|
|src/script/00.js:4551|clearInterval|handItemDrawTimer|需要进一步测试|
|src/script/00.js:4591|setTimeout|()=>{     const cards=[...document.querySelectorAll('#itemWindowBody .item-card')];     if(cards[idx]){cards[idx].style.outline='3px solid #38bdf8';cards[idx].scrollIntoView({block; 80|需要进一步测试|
|src/script/00.js:4693|requestAnimationFrame|frame|需要进一步测试|
|src/script/00.js:4705|setTimeout|()=>{       eligible.forEach(g=>{         const c=document.querySelector(.group-row-card[data-group-id="${g.id}"]);         if(c){const o=c.querySelector('.card-item-roulette');i; 3000|需要进一步测试|
|src/script/00.js:4708|setTimeout|()=>{c.classList.remove('item-draw-spinning');c.querySelector('.card-item-roulette')?.remove()}; 430|需要进一步测试|
|src/script/00.js:4710|setTimeout|()=>{itemDrawBusy=false;renderAll()}; 470|需要进一步测试|
|src/script/00.js:4713|requestAnimationFrame|frame|需要进一步测试|
|src/script/00.js:4746|requestAnimationFrame|frame|需要进一步测试|
|src/script/00.js:4763|requestAnimationFrame|frame|需要进一步测试|
|src/script/00.js:4768|clearTimeout|handItemDrawFinishTimer|需要进一步测试|
|src/script/00.js:4808|setTimeout|()=>{card.classList.remove('card-use-fx',CARD_ITEM_FX_CLASS[key]／／'cfx-rise');b.remove()}; 1850|需要进一步测试|
|src/script/00.js:4817|setTimeout|()=>{card.classList.remove('card-hit-fx','card-defend-fx','card-heal-fx');card.style.removeProperty('--hitc')}; 1600|需要进一步测试|
|src/script/00.js:4839|setTimeout|()=>playTargetCardFx(id,key,beneficial?'heal':'hit'); 120+n*70|需要进一步测试|
|src/script/00.js:4857|window.addEventListener|'pagehide'; ()=>{try{saveState();persistHistoryV26()}catch(e){}}|需要进一步测试|
|src/script/00.js:4858|document.addEventListener|'visibilitychange'; ()=>{if(document.visibilityState==='hidden'){try{saveState();persistHistoryV26()}catch(e){}}}|需要进一步测试|
|src/script/00.js:4901|setTimeout|()=>playSound(itemSoundCategoryV26(k)); 55|需要进一步测试|
|src/script/00.js:4906|setInterval|()=>{if(n++<13)playSound('item_draw_tick');else clearInterval(timer)}; Math.max(150,ms/15)|需要进一步测试|
|src/script/00.js:4906|clearInterval|timer|需要进一步测试|
|src/script/00.js:4907|setTimeout|()=>{clearInterval(timer);playSound('item_draw_reveal')}; ms|需要进一步测试|
|src/script/00.js:4907|clearInterval|timer|需要进一步测试|
|src/script/00.js:4992|window.addEventListener|'DOMContentLoaded'; ()=>{  const sub=document.querySelector('#view-settings .fullview-sub');if(sub)sub.textContent='功能、音效与音乐、道具图标、学生名单及数据管理。';  rebuildSettingsV26();applyUiIconsV26();  setTimeout(()=>|需要进一步测试|
|src/script/00.js:4995|setTimeout|()=>{renderItemFxSoundListV26();persistHistoryV26();saveState()}; 400|需要进一步测试|
|src/script/00.js:5005|window.addEventListener|'resize'; syncVisualViewportV27; {passive:true}|需要进一步测试|
|src/script/00.js:5006|window.addEventListener|'orientationchange'; ()=>setTimeout(syncVisualViewportV27,80); {passive:true}|需要进一步测试|
|src/script/00.js:5006|setTimeout|syncVisualViewportV27; 80|需要进一步测试|
|src/script/00.js:5008|window.visualViewport.addEventListener|'resize'; syncVisualViewportV27; {passive:true}|需要进一步测试|
|src/script/00.js:5009|window.visualViewport.addEventListener|'scroll'; syncVisualViewportV27; {passive:true}|需要进一步测试|
|src/script/00.js:5047|document.removeEventListener|'keydown'; key|需要进一步测试|
|src/script/00.js:5050|o.addEventListener|'click'; e=>{if(e.target===o)finish(false)}|需要进一步测试|
|src/script/00.js:5051|document.removeEventListener|'keydown'; key|需要进一步测试|
|src/script/00.js:5051|document.removeEventListener|'keydown'; key|需要进一步测试|
|src/script/00.js:5051|document.removeEventListener|'keydown'; key|需要进一步测试|
|src/script/00.js:5052|document.addEventListener|'keydown'; key|需要进一步测试|
|src/script/00.js:5057|window.addEventListener|'beforeunload'; ()=>{try{saveState();persistHistoryV26()}catch(e){}}|需要进一步测试|
|src/script/00.js:5058|window.addEventListener|'DOMContentLoaded'; ()=>setTimeout(repairPersistentItemsV28,0)|需要进一步测试|
|src/script/00.js:5058|setTimeout|repairPersistentItemsV28; 0|需要进一步测试|
|src/script/00.js:5123|requestAnimationFrame|frame|需要进一步测试|
|src/script/00.js:5139|setTimeout|()=>{       eligible.forEach(g=>{         const c=document.querySelector(.group-row-card[data-group-id="${g.id}"]);         if(c){           const o=c.querySelector('.card-item-r; 3000|需要进一步测试|
|src/script/00.js:5145|setTimeout|()=>{c.classList.remove('item-draw-spinning');c.querySelector('.card-item-roulette')?.remove()}; 430|需要进一步测试|
|src/script/00.js:5148|setTimeout|()=>{itemDrawBusy=false;renderAll()}; 470|需要进一步测试|
|src/script/00.js:5151|requestAnimationFrame|frame|需要进一步测试|
|src/script/00.js:5182|requestAnimationFrame|frame|需要进一步测试|
|src/script/00.js:5199|requestAnimationFrame|frame|需要进一步测试|
|src/script/00.js:5291|requestAnimationFrame|frame|需要进一步测试|
|src/script/00.js:5303|setTimeout|()=>{      eligible.forEach(g=>{        const c=document.querySelector(.group-row-card[data-group-id="${g.id}"]);        if(c){const o=c.querySelector('.card-item-roulette');if(o; 3000|需要进一步测试|
|src/script/00.js:5306|setTimeout|()=>{c.classList.remove('item-draw-spinning');c.querySelector('.card-item-roulette')?.remove()}; 430|需要进一步测试|
|src/script/00.js:5308|setTimeout|()=>{itemDrawBusy=false;renderAll()}; 470|需要进一步测试|
|src/script/00.js:5311|requestAnimationFrame|frame|需要进一步测试|
|src/script/00.js:5339|requestAnimationFrame|frame|需要进一步测试|
|src/script/00.js:5355|requestAnimationFrame|frame|需要进一步测试|
|src/script/00.js:5479|setTimeout|()=>patchVisibleGodManagerV283(gid); 0|需要进一步测试|
|src/script/00.js:5492|setTimeout|()=>{appendMissingEncyclopediaV283()}; 0|需要进一步测试|
|src/script/00.js:5493|window.addEventListener|'DOMContentLoaded'; ()=>setTimeout(()=>{  appendMissingEncyclopediaV283();  patchItemIconSettingsV283(); },80)|需要进一步测试|
|src/script/00.js:5493|setTimeout|()=>{  appendMissingEncyclopediaV283();  patchItemIconSettingsV283(); }; 80|需要进一步测试|
|src/script/00.js:5525|window.addEventListener|'DOMContentLoaded'; ()=>setTimeout(refresh26ItemInterfacesV284,120)|需要进一步测试|
|src/script/00.js:5525|setTimeout|refresh26ItemInterfacesV284; 120|需要进一步测试|
|src/script/00.js:5606|window.addEventListener|'DOMContentLoaded'; ()=>setTimeout(()=>{   installCommunismModeSetting();   applyCommunismMode(); },160)|需要进一步测试|
|src/script/00.js:5606|setTimeout|()=>{   installCommunismModeSetting();   applyCommunismMode(); }; 160|需要进一步测试|
|src/script/00.js:5724|setTimeout|()=>{     card.classList.remove(cls,'card-defend-fx');     badge.remove();     card.style.removeProperty('--hitc');   }; 1750|需要进一步测试|
|src/script/00.js:5743|setTimeout|()=>playAttackTargetFxV2116(target.id,'lightning',true); 120|需要进一步测试|
|src/script/00.js:5762|setTimeout|()=>playAttackTargetFxV2116(target.id,'lightning',true); 120|需要进一步测试|
|src/script/00.js:5783|setTimeout|()=>playAttackTargetFxV2116(target.id,'lightning',false); 120|需要进一步测试|
|src/script/00.js:5792|setTimeout|()=>playCasterCardFx(key,casterId); 30|需要进一步测试|
|src/script/00.js:5956|setTimeout|()=>slots[0]?.classList.remove('queue-promoted'); 1150|需要进一步测试|
|src/script/00.js:5975|window.addEventListener|'DOMContentLoaded'; ()=>setTimeout(()=>{   try{renderAll()}catch(e){} },220)|需要进一步测试|
|src/script/00.js:5975|setTimeout|()=>{   try{renderAll()}catch(e){} }; 220|需要进一步测试|
|src/script/01.js:70|window.addEventListener|'DOMContentLoaded'; ()=>setTimeout(()=>{ensureGroupNumbersV213(true);try{renderAll()}catch(e){};try{renderItemEncyclopedia()}catch(e){}},280)|需要进一步测试|
|src/script/01.js:70|setTimeout|()=>{ensureGroupNumbersV213(true);try{renderAll()}catch(e){};try{renderItemEncyclopedia()}catch(e){}}; 280|需要进一步测试|
|src/script/02.js:46|setTimeout|()=>updateHandScoreV214(id); 120|需要进一步测试|
|src/script/02.js:69|setTimeout|()=>useItem(gid,0); 0|需要进一步测试|
|src/script/02.js:79|window.addEventListener|'DOMContentLoaded'; ()=>setTimeout(()=>{   applyModernFlatV217();   try{renderGrid()}catch(e){} },320)|需要进一步测试|
|src/script/02.js:79|setTimeout|()=>{   applyModernFlatV217();   try{renderGrid()}catch(e){} }; 320|需要进一步测试|
|src/script/03.js:15|requestAnimationFrame|renderWelcomeAllV216|需要进一步测试|
|src/script/03.js:32|setTimeout|()=>playSound(itemSoundCategoryV26(key)); 55|需要进一步测试|
|src/script/03.js:44|setTimeout|()=>{             try{playTargetCardFx(id,key,heal?'heal':'hit')}catch(e){}           }; 100+n*60|需要进一步测试|
|src/script/03.js:57|banner.addEventListener|'animationend'; remove; {once:true}|需要进一步测试|
|src/script/03.js:58|setTimeout|remove; 3800|需要进一步测试|
|src/script/03.js:61|document.addEventListener|'DOMContentLoaded'; ()=>setTimeout(renderWelcomeAllV216,120); {once:true}|需要进一步测试|
|src/script/03.js:61|setTimeout|renderWelcomeAllV216; 120|需要进一步测试|
|src/script/03.js:62|setTimeout|renderWelcomeAllV216; 120|需要进一步测试|
|src/script/04.js:132|setInterval|() => {     if (n++ < 13) playSound('item_draw_tick');     else clearInterval(timer);   }; interval|需要进一步测试|
|src/script/04.js:134|clearInterval|timer|需要进一步测试|
|src/script/04.js:136|setTimeout|() => {     clearInterval(timer);     playSound('item_draw_reveal');   }; ms|需要进一步测试|
|src/script/04.js:137|clearInterval|timer|需要进一步测试|
|src/script/05.js:45|setTimeout|()=>flashBomb(t.id); 40+n*80|需要进一步测试|
|src/script/05.js:121|setTimeout|()=>playAttackTargetFxV2116(target.id,'lightning',true); 120|需要进一步测试|
|src/script/05.js:138|setTimeout|()=>playAttackTargetFxV2116(target.id,'lightning',true); 120|需要进一步测试|
|src/script/06.js:14|clearInterval|drawTickTimerV2171|需要进一步测试|
|src/script/06.js:18|clearTimeout|drawRevealTimerV2171|需要进一步测试|
|src/script/06.js:68|clearInterval|drawTickTimerV2171|需要进一步测试|
|src/script/06.js:93|setInterval|()=>{     if(generation!==drawAudioGenerationV2171){       clearInterval(drawTickTimerV2171);       drawTickTimerV2171=null;       return;     }     if(tickCount++<13){       playT; tickInterval|需要进一步测试|
|src/script/06.js:95|clearInterval|drawTickTimerV2171|需要进一步测试|
|src/script/06.js:102|clearInterval|drawTickTimerV2171|需要进一步测试|
|src/script/06.js:107|setTimeout|()=>{     drawRevealTimerV2171=null;     finishDrawAudioV2171(generation);   }; duration|需要进一步测试|
|src/script/07.js:192|clearInterval|bulletTimer|需要进一步测试|
|src/script/07.js:227|setTimeout|installClearItemsSettingV2172; 0|需要进一步测试|
|src/script/07.js:235|setTimeout|installClearItemsSettingV2172; 0|需要进一步测试|
|src/script/07.js:241|document.addEventListener|'DOMContentLoaded'; ()=>setTimeout(installClearItemsSettingV2172,420); {once:true}|需要进一步测试|
|src/script/07.js:241|setTimeout|installClearItemsSettingV2172; 420|需要进一步测试|
|src/script/07.js:243|setTimeout|installClearItemsSettingV2172; 0|需要进一步测试|
|src/script/09.js:178|setTimeout|()=>{try{renderItemFxSoundListV26()}catch(e){}}; 180|需要进一步测试|
|src/script/09.js:185|setTimeout|()=>{try{renderItemFxSoundListV26()}catch(e){}}; 120|需要进一步测试|
|src/script/10.js:92|setTimeout|()=>URL.revokeObjectURL(url); 1000|需要进一步测试|
|src/script/11.js:100|setTimeout|installSfxVolumeSliderV2176; 0|需要进一步测试|
|src/script/11.js:109|setTimeout|installSfxVolumeSliderV2176; 0|需要进一步测试|
|src/script/11.js:116|document.addEventListener|'DOMContentLoaded'; ()=>setTimeout(installSfxVolumeSliderV2176,450); {once:true}|需要进一步测试|
|src/script/11.js:116|setTimeout|installSfxVolumeSliderV2176; 450|需要进一步测试|
|src/script/11.js:118|setTimeout|installSfxVolumeSliderV2176; 0|需要进一步测试|
|src/script/14.js:172|setTimeout|()=>{try{installDrawCooldownInfoV2179()}catch(e){}}; 300|需要进一步测试|
|src/script/15.js:227|setTimeout|refreshDrawCooldownInfoV21710; 0|需要进一步测试|
|src/script/15.js:245|setTimeout|()=>{   try{refreshDrawCooldownInfoV21710()}catch(e){} }; 300|需要进一步测试|
|src/script/16.js:19|setInterval|()=>{     if(generation!==drawAudioGenerationV2171){       clearInterval(drawTickTimerV2171);       drawTickTimerV2171=null;       return;     }     if(tickCount++<11){       playT; tickInterval|需要进一步测试|
|src/script/16.js:21|clearInterval|drawTickTimerV2171|需要进一步测试|
|src/script/16.js:28|clearInterval|drawTickTimerV2171|需要进一步测试|
|src/script/16.js:33|setTimeout|()=>{     drawRevealTimerV2171=null;     finishDrawAudioV2171(generation);   }; duration|需要进一步测试|
|src/script/16.js:105|requestAnimationFrame|frame|需要进一步测试|
|src/script/16.js:130|setTimeout|()=>{       eligible.forEach(g=>{         const c=document.querySelector(.group-row-card[data-group-id="${g.id}"]);         if(!c)return;          const o=c.querySelector('.card-; ITEM_DRAW_RESULT_HOLD_V21712|需要进一步测试|
|src/script/16.js:140|setTimeout|()=>{           o?.parentElement?.classList.remove('item-draw-spinning','bm-draw-fading');           o?.remove();           BattleMotion.releaseDraw(g.id,o);         }; ITEM_DRAW_FADE_V21712+20|需要进一步测试|
|src/script/16.js:147|setTimeout|()=>{         itemDrawBusy=false;         v213SkipNextReorderAnimation=true;         renderAll();         v213SuppressReorderAnimation=false;       }; ITEM_DRAW_FADE_V21712+35|需要进一步测试|
|src/script/16.js:156|requestAnimationFrame|frame|需要进一步测试|
|src/script/16.js:221|requestAnimationFrame|frame|需要进一步测试|
|src/script/16.js:270|requestAnimationFrame|frame|需要进一步测试|
|src/script/20.js:68|setTimeout|()=>{   try{refreshDrawCooldownInfoV21710()}catch(e){} }; 350|需要进一步测试|
|src/script/21.js:44|window.addEventListener|'DOMContentLoaded'; ()=>{   setTimeout(repairDuplicateInventoryV21718,20); }|需要进一步测试|
|src/script/21.js:45|setTimeout|repairDuplicateInventoryV21718; 20|需要进一步测试|
|src/script/22.js:31|window.addEventListener|'DOMContentLoaded'; ()=>{   setTimeout(repairFlowerChargesV21719,40); }|需要进一步测试|
|src/script/22.js:32|setTimeout|repairFlowerChargesV21719; 40|需要进一步测试|
|src/script/23.js:8|window.addEventListener|'DOMContentLoaded'; ()=>{   setTimeout(clearBrokenCardTranslateV21720,50); }|需要进一步测试|
|src/script/23.js:9|setTimeout|clearBrokenCardTranslateV21720; 50|需要进一步测试|
|src/script/24.js:38|setTimeout|()=>{try{renderBattleRankPreviewV21721()}catch(e){}}; 0|需要进一步测试|
|src/script/24.js:44|window.addEventListener|'DOMContentLoaded'; ()=>{   setTimeout(()=>{     try{       v213ForceRankSort=false;       renderBattleRankPreviewV21721();     }catch(e){}   },80); }|需要进一步测试|
|src/script/24.js:45|setTimeout|()=>{     try{       v213ForceRankSort=false;       renderBattleRankPreviewV21721();     }catch(e){}   }; 80|需要进一步测试|
|src/script/28.js:41|clearTimeout|roundStateFlipTimerV21726|需要进一步测试|
|src/script/28.js:45|requestAnimationFrame|()=>requestAnimationFrame(()=>{     moved.forEach(card=>{       card.style.setProperty(         'transition',         transform 750ms cubic-bezier(.2,.8,.2,1),box-shadow .3s ease,|需要进一步测试|
|src/script/28.js:45|requestAnimationFrame|()=>{     moved.forEach(card=>{       card.style.setProperty(         'transition',         transform 750ms cubic-bezier(.2,.8,.2,1),box-shadow .3s ease,border-color .35s ease,  |需要进一步测试|
|src/script/28.js:55|setTimeout|()=>{       moved.forEach(card=>{         card.style.setProperty('transition','none','important');         card.style.removeProperty('transform');         void card.offsetWidth;   ; 790|需要进一步测试|
|src/script/28.js:60|requestAnimationFrame|()=>card.style.removeProperty('transition')|需要进一步测试|
|src/script/30.js:55|setTimeout|()=>ok.focus(); 30|需要进一步测试|
|src/script/30.js:63|setTimeout|()=>ok.focus(); 30|需要进一步测试|
|src/script/30.js:79|document.addEventListener|'keydown'; e=>{   const root=document.getElementById('themeDialogV21727');   if(!root?.classList.contains('active'))return;   if(e.key==='Escape'){     e.preventDefault();     closeThemeDialo|需要进一步测试|
|src/script/31.js:4|setTimeout|()=>{if(epoch===scoreAnimationEpoch)fn()}; delay|需要进一步测试|
|src/script/31.js:10|clearTimeout|attackRenderTimerV21713|需要进一步测试|
|src/script/31.js:12|clearTimeout|queueItemScoreChangesV21732._timer|需要进一步测试|
|src/script/31.js:59|requestAnimationFrame|()=>deltaEl.classList.add('play')|需要进一步测试|
|src/script/31.js:123|clearTimeout|queueItemScoreChangesV21732._timer|需要进一步测试|
|src/script/32.js:46|window.addEventListener|'DOMContentLoaded'; ()=>{   setTimeout(()=>{     try{       repairAllItemEffectsV21731();       renderAll();     }catch(e){}   },100); }|需要进一步测试|
|src/script/32.js:47|setTimeout|()=>{     try{       repairAllItemEffectsV21731();       renderAll();     }catch(e){}   }; 100|需要进一步测试|
|src/script/35.js:24|node.addEventListener|'animationend'; remove; {once:true}|需要进一步测试|
|src/script/35.js:25|setTimeout|remove; duration|需要进一步测试|
|src/script/35.js:34|setTimeout|()=>playSound(itemSoundCategoryV26(key)); 55|需要进一步测试|
|src/script/35.js:42|setTimeout|()=>playSound(itemSoundCategoryV26(key)); 55|需要进一步测试|
|src/script/35.js:55|setTimeout|()=>{           try{playTargetCardFx(id,key,heal?'heal':'hit')}catch(e){}         }; 100+n*60|需要进一步测试|
|src/script/36.js:316|clearTimeout|showHandEffectV218._timer|需要进一步测试|
|src/script/36.js:317|setTimeout|()=>overlay.classList.remove('active'); 2200|需要进一步测试|
|src/script/36.js:324|setTimeout|()=>showHandEffectV218(key,before); 60|需要进一步测试|
|src/script/36.js:343|setTimeout|fire; 520|需要进一步测试|
|src/script/36.js:368|setTimeout|renderHandRewardControlsV218; 0|需要进一步测试|
|src/script/37.js:105|requestAnimationFrame|syncGroupItemInfoV2182|需要进一步测试|
|src/script/37.js:114|setTimeout|syncGroupItemInfoV2182; 0|需要进一步测试|
|src/script/37.js:120|setTimeout|syncGroupItemInfoV2182; 0|需要进一步测试|
|src/script/39.js:37|el.addEventListener|'mouseenter'; ()=>{     const tip=ensureDockHumorTipV2185();     tip.innerHTML=<b>${escapeHtml(d.name)}</b><span>${escapeHtml(d.copy)}</span>;     const r=el.getBoundingClientRect();     tip.s|需要进一步测试|
|src/script/39.js:49|el.addEventListener|'mouseleave'; ()=>ensureDockHumorTipV2185().classList.remove('show')|需要进一步测试|
|src/script/39.js:94|setTimeout|applyDockHumorV2185; 0|需要进一步测试|
|src/script/39.js:95|setTimeout|applyDockHumorV2185; 250|需要进一步测试|
|src/script/41.js:92|setTimeout|polishVisibleCopyV2187; 0|需要进一步测试|
|src/script/41.js:97|window.addEventListener|'DOMContentLoaded'; ()=>{   polishVisibleCopyV2187();   setTimeout(polishVisibleCopyV2187,120); }|需要进一步测试|
|src/script/41.js:99|setTimeout|polishVisibleCopyV2187; 120|需要进一步测试|
|src/ui/desktop.js:109|cancelAnimationFrame|pageMotionFrame|需要进一步测试|
|src/ui/desktop.js:222|requestAnimationFrame|enterPage|需要进一步测试|
|src/ui/desktop.js:296|requestAnimationFrame|updateArrows|需要进一步测试|
|src/ui/desktop.js:648|setTimeout|() => URL.revokeObjectURL(url); 1000|需要进一步测试|
|src/ui/desktop.js:1114|document.addEventListener|"click"; async (event) => {         const button = event.target.closest("button");         const action = button?.getAttribute("onclick");         const confirm = {           "applySettings; true|需要进一步测试|
|src/ui/desktop.js:1309|document.addEventListener|"click"; (e) => {         if (e.target.closest(".bottom-dock") && currentView !== "battle") {           e.preventDefault();           e.stopImmediatePropagation();           return;        ; true|需要进一步测试|
|src/ui/desktop.js:1346|document.addEventListener|"click"; (event) => {       const summary = event.target.closest("summary");       const details = summary?.parentElement;       if (         !details ／／         details.tagName !== "DETAIL|需要进一步测试|
|src/ui/desktop.js:1510|document.addEventListener|"focusin"; (event) => {         const top = openStack.at(-1);         if (top && !top.el.contains(event.target)) focusModal(top);       }; true|需要进一步测试|
|src/ui/desktop.js:1668|document.addEventListener|"keydown"; (e) => {         const top = openStack.at(-1);         if (!top) return;         if (e.key === "Escape") {           e.preventDefault();           e.stopImmediatePropagation();    ; true|需要进一步测试|
|src/ui/desktop.js:1934|requestAnimationFrame|() => requestAnimationFrame(resolve)|需要进一步测试|
|src/ui/desktop.js:1934|requestAnimationFrame|resolve|需要进一步测试|
|src/ui/desktop.js:1980|window.addEventListener|"resize"; syncViewport|需要进一步测试|
|src/ui/desktop.js:1981|matchMedia("(prefers-reduced-motion: reduce)").addEventListener|"change"; () => {         if (!canAnimate()) cancelAnimations();       }|需要进一步测试|
|src/ui/desktop.js:1987|document.addEventListener|"visibilitychange"; () => {       if (document.hidden) cancelAnimations();     }|需要进一步测试|
|src/ui/desktop.js:1990|document.addEventListener|"keydown"; (event) => {       if (event.key === "Escape" && currentView === "settings")         cancelSettingsMotion();     }|需要进一步测试|
|src/ui/desktop.js:2014|$("#settlementHistoryContainer").addEventListener|"toggle"; (event) => {         const details = event.target;         if (details.tagName !== "DETAILS") return;         if (!details.open) {           for (const a of animations)            ; true|需要进一步测试|
|src/ui/desktop.js:2038|t.addEventListener|"scroll"; updateArrows; { passive: true }|需要进一步测试|
|src/ui/desktop.js:2039|t.addEventListener|"wheel"; (e) => {         if (           t.scrollWidth <= t.clientWidth + 2 ／／           Math.abs(e.deltaX) > Math.abs(e.deltaY) ／／           e.ctrlKey         )           return;         c; { passive: false }|需要进一步测试|
|src/ui/desktop.js:2145|window.addEventListener|"DOMContentLoaded"; DesktopUI.init; { once: true }|需要进一步测试|
|src/core/picker-bridge.js:45|clearInterval|slotEngine.timerGroup|需要进一步测试|
|src/core/picker-bridge.js:45|clearInterval|slotEngine.timerStudent|需要进一步测试|
|src/ui/battle-grid.js:171|requestAnimationFrame|() =>       requestAnimationFrame(() =>         moved.forEach((card) => {           card.style.setProperty(             "transition",             transform ${V213_CARD_REORDER_MS}|需要进一步测试|
|src/ui/battle-grid.js:172|requestAnimationFrame|() =>         moved.forEach((card) => {           card.style.setProperty(             "transition",             transform ${V213_CARD_REORDER_MS}ms cubic-bezier(.2,.8,.2,1),box-sh|需要进一步测试|
|src/ui/battle-grid.js:181|setTimeout|() => {             /* 在“0 位移”状态下无动画清理内联 transform，避免清理动作被识别成第二段动画。 */             card.style.setProperty("transition", "none", "important");             card.style.removeProperty(; V213_CARD_REORDER_SETTLE_MS|需要进一步测试|
|src/ui/battle-grid.js:186|requestAnimationFrame|() =>               card.style.removeProperty("transition")|需要进一步测试|
|src/ui/battle-motion.js:53|clearTimeout|prior.timer|需要进一步测试|
|src/ui/battle-motion.js:123|setTimeout|() => {       if (sessions.get(id) !== session) return;       sessions.delete(id);       document.querySelectorAll(".bm-layer").forEach((el) => {         if (el.dataset.bmKey === i; duration + 40|需要进一步测试|
|src/ui/battle-motion.js:161|clearTimeout|s.timer|需要进一步测试|
|src/ui/battle-motion.js:176|document.addEventListener|"visibilitychange"; () => {     if (document.hidden) clear();   }|需要进一步测试|
|src/ui/classroom-feedback.js:112|clearTimeout|timer|需要进一步测试|
|src/ui/classroom-feedback.js:124|clearTimeout|timer|需要进一步测试|
|src/ui/classroom-feedback.js:203|setTimeout|() => {       if (serial === generation) dismiss();     }; options.duration|需要进一步测试|
|src/ui/classroom-feedback.js:260|e.addEventListener|"change"; () => {         const values = [...document.querySelectorAll("[data-cf-slot]")].map(           (x) => (x.value.trim() === "" ? NaN : Number(x.value)),         );         try {     |需要进一步测试|
|src/ui/classroom-feedback.js:276|e.addEventListener|"change"; () => {         setOptions({           [e.dataset.cfOption]:             e.type === "checkbox"               ? e.checked               : ["duration", "clickVolume"].includes(e.data|需要进一步测试|
|src/ui/classroom-feedback.js:324|document.addEventListener|"click"; (e) => {         const button = e.target.closest?.(           "button,summary,[role=button],input[type=button],input[type=submit]",         );         if (!button ／／ button.disable; true|需要进一步测试|
|src/ui/classroom-feedback.js:335|clearTimeout|clickCleanup|需要进一步测试|
|src/ui/classroom-feedback.js:336|setTimeout|() => {           clickEvent = null;           clickPreview = false;           clickCleanup = null;         }; 0|需要进一步测试|
|src/ui/classroom-feedback.js:364|dialog().addEventListener|"cancel"; (e) => {       e.preventDefault();       dismiss();     }|需要进一步测试|
|src/ui/classroom-feedback.js:370|document.addEventListener|"visibilitychange"; () => {       if (document.hidden) {         cancel();         stopClickVoice();         clearLive();       }     }|需要进一步测试|
|src/ui/classroom-feedback.js:377|matchMedia("(prefers-reduced-motion: reduce)").addEventListener|"change"; () => {         if (!allowed()) {           cancel();           clearLive();         }       }|需要进一步测试|
|src/ui/classroom-recovery.js:86|button.addEventListener|"click"; () => preview(index)|需要进一步测试|
|src/ui/classroom-recovery.js:161|setTimeout|() => URL.revokeObjectURL(url); 1000|需要进一步测试|
|src/ui/classroom-recovery.js:171|byId("classroomRecoveryScan").addEventListener|"click"; scan|需要进一步测试|
|src/ui/classroom-recovery.js:172|byId("classroomRecoveryExportRaw").addEventListener|"click"; exportRaw|需要进一步测试|
|src/ui/classroom-recovery.js:173|byId("classroomRecoveryRestore").addEventListener|"click"; restore|需要进一步测试|
|src/ui/classroom-recovery.js:174|byId("classroomRecoveryCancel").addEventListener|"click"; () => {       selected = null;       byId("classroomRecoveryPreview").hidden = true;     }|需要进一步测试|
|src/ui/classroom-recovery.js:180|document.addEventListener|"DOMContentLoaded"; init; { once: true }|需要进一步测试|
|src/ui/classroom-roster-workspace.js:548|setTimeout|() => URL.revokeObjectURL(link.href); 1000|需要进一步测试|
|src/ui/classroom-roster-workspace.js:761|document.removeEventListener|"keydown"; overlay._onKeydown|需要进一步测试|
|src/ui/classroom-roster-workspace.js:841|overlay.addEventListener|"click"; (event) => {           if (event.target === overlay) closeApplyPreview();         }|需要进一步测试|
|src/ui/classroom-roster-workspace.js:851|document.removeEventListener|"keydown"; onKeydown|需要进一步测试|
|src/ui/classroom-roster-workspace.js:855|document.addEventListener|"keydown"; onKeydown|需要进一步测试|
|src/ui/classroom-roster-workspace.js:877|document.removeEventListener|"keydown"; onKeydown|需要进一步测试|
|src/ui/classroom-roster-workspace.js:1089|root.addEventListener|"godpower:active-classroom-changed"; (event) => {       activeClassroomContext = event.detail;       selectedProfile = event.detail.userProfileId;       selectedClassroom = event.detail.classroomId;       render();   |需要进一步测试|
|src/ui/disposable-scope.js:42|target.addEventListener|type; listener; options|需要进一步测试|
|src/ui/disposable-scope.js:43|target.removeEventListener|type; listener; options|需要进一步测试|
|src/ui/disposable-scope.js:51|setTimeout|() => {         release?.();         if (!disposed) callback();       }; delay|需要进一步测试|
|src/ui/disposable-scope.js:55|clearTimeout|id|需要进一步测试|
|src/ui/disposable-scope.js:64|requestAnimationFrame|(time) => {         release?.();         if (!disposed) callback(time);       }|需要进一步测试|
|src/ui/disposable-scope.js:68|cancelAnimationFrame|id|需要进一步测试|
|src/ui/electron-host.js:59|window.addEventListener|"DOMContentLoaded"; () => {       const button = document.createElement("button");       button.type = "button";       button.className = "btn btn-primary";       button.textContent = "独立点名悬浮窗";      ; { once: true }|需要进一步测试|
|src/ui/electron-host.js:66|button.addEventListener|"click"; () => desktop.openPicker()|需要进一步测试|
|src/ui/electron-host.js:69|setInterval|publish; 120|需要进一步测试|
|src/ui/electron-host.js:75|window.addEventListener|"beforeunload"; () => clearInterval(timer); {     once: true,   }|需要进一步测试|
|src/ui/electron-host.js:75|clearInterval|timer|需要进一步测试|
|src/ui/electron-windows.js:192|window.addEventListener|"DOMContentLoaded"; () => {       const style = document.createElement("style");       style.dataset.nativeHide = "";       style.textContent =         "[data-native-detached]{visibility:hidden!import; { once: true }|需要进一步测试|
|src/ui/electron-windows.js:200|setInterval|scan; 120|需要进一步测试|
|src/ui/electron-windows.js:205|window.addEventListener|"beforeunload"; () => clearInterval(timer); {     once: true,   }|需要进一步测试|
|src/ui/electron-windows.js:205|clearInterval|timer|需要进一步测试|
|src/ui/item-modules.js:28|el.addEventListener|"click"; action|需要进一步测试|
|src/ui/item-modules.js:63|search.addEventListener|"input"; () => {       query = search.value.trim().toLowerCase();       renderList();     }|需要进一步测试|
|src/ui/item-modules.js:70|file.addEventListener|"change"; async () => {       const picked = file.files?.[0];       if (!picked ／／ busy) return;       busy = true;       try {         if (picked.size > 1024 * 1024) throw Error("配置文件不能超过 1|需要进一步测试|
|src/ui/item-modules.js:101|setTimeout|() => URL.revokeObjectURL(url); 1000|需要进一步测试|
|src/ui/item-modules.js:220|input.addEventListener|"change"; () => {           if (input.value.trim() === "" ／／ !input.checkValidity()) {             input.setAttribute("aria-invalid", "true");             announce(               ${label}须为|需要进一步测试|
|src/ui/item-modules.js:234|input.addEventListener|"change"; () =>           saveField(field, input.checked, input)|需要进一步测试|
|src/ui/item-modules.js:310|tab.addEventListener|"keydown"; (event) => {           if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))             return;           event.preventDefault();           pipeline =             e|需要进一步测试|
|src/ui/migration.js:125|setTimeout|() => URL.revokeObjectURL(url); 1000|需要进一步测试|
|src/ui/migration.js:129|element("v3MigrationInspect").addEventListener|"click"; inspect|需要进一步测试|
|src/ui/migration.js:130|element("v3MigrationStage").addEventListener|"click"; stage|需要进一步测试|
|src/ui/migration.js:131|element("v3MigrationDownload").addEventListener|"click"; download|需要进一步测试|
|src/ui/migration.js:132|window.addEventListener|"beforeunload"; () => cancellation?.abort(); {       once: true,     }|需要进一步测试|
|src/ui/migration.js:139|window.addEventListener|"DOMContentLoaded"; MigrationPanel.init; {   once: true, }|需要进一步测试|
|src/ui/plugin-appearance.js:152|window.addEventListener|"DOMContentLoaded"; sync; { once: true }|需要进一步测试|
|src/ui/plugin-center.js:153|toggle.addEventListener|"change"; () => {       root.setCommunismMode(toggle.checked);       toggle.checked = root.isCommunismMode();     }|需要进一步测试|
|src/ui/plugin-center.js:397|$("#view-plugins")?.addEventListener|"click"; onClick|需要进一步测试|
|src/ui/plugin-center.js:400|$("#pluginManifestFile")?.addEventListener|"change"; async (event) => {       const file = event.target.files?.[0];       if (!file) return;       try {         await importManifest(file);       } catch (error) {         status(error|需要进一步测试|
|src/ui/plugin-center.js:423|window.addEventListener|"DOMContentLoaded"; init; { once: true }|需要进一步测试|
|src/ui/render.js:7|clearTimeout|attackRenderTimerV21713|需要进一步测试|
|src/ui/render.js:8|setTimeout|() => {       attackRenderTimerV21713 = null;       attackRenderFlushingV21713 = true;       try {         refreshPages();       } finally {         pendingRenderArgsV21713 = null;; ATTACK_REORDER_DELAY_V21713|需要进一步测试|
|src/ui/render.js:40|setTimeout|() => {         pendingRenderGridV21726 = false;         // Match the original FLIP callback: don't restart the outer score phase.         refreshBattleGrid();       }; 810|需要进一步测试|
|src/ui/round-feedback.js:10|setTimeout|() => {       if (roundToken && !RoundSettlement.isRoundTokenCurrent(roundToken))         return;       try {         if (activeScoreAnimId) {           cancelAnimationFrame(active; 720|需要进一步测试|
|src/ui/round-feedback.js:15|cancelAnimationFrame|activeScoreAnimId|需要进一步测试|
|src/ui/teaching-resource-workspace.js:143|setTimeout|() => URL.revokeObjectURL(url); 1000|需要进一步测试|
|src/ui/teaching-resource-workspace.js:156|setTimeout|() => {         if (dialog.open) dialog.close();         releasePreview(dialog);       }; 220|需要进一步测试|
|src/ui/teaching-resource-workspace.js:217|dialog.addEventListener|"cancel"; (event) => {         event.preventDefault();         closePreview(dialog);       }|需要进一步测试|
|src/ui/teaching-resource-workspace.js:221|dialog.addEventListener|"close"; () => releasePreview(dialog); {         once: true,       }|需要进一步测试|
|src/ui/teaching-resource-workspace.js:224|dialog.addEventListener|"click"; (event) => {         if (event.target === dialog) closePreview(dialog);       }|需要进一步测试|
|src/ui/teaching-resource-workspace.js:490|root.addEventListener|REFRESH_EVENT; () => refresh()|需要进一步测试|
|src/ui/themes.js:199|button.addEventListener|"click"; () => {         void set(button.dataset.appearanceTheme);       }|需要进一步测试|
|src/ui/themes.js:206|window.addEventListener|"DOMContentLoaded"; apply; { once: true }|需要进一步测试|
|src/ui/themes.js:207|window.addEventListener|"pagehide"; cancel|需要进一步测试|
|src/ui/themes.js:208|window.addEventListener|"keydown"; (event) => {     if (event.key === "Escape") cancel();   }|需要进一步测试|
|src/ui/tooltips.js:45|clearTimeout|active.timer|需要进一步测试|
|src/ui/tooltips.js:159|setTimeout|dismiss; 3000|需要进一步测试|
|src/ui/tooltips.js:168|document.addEventListener|"pointerover"; (event) => {     const owner = titleOwner(event.target);     if (owner === pointerOwner) return;     pointerOwner = owner;     reconcile();   }|需要进一步测试|
|src/ui/tooltips.js:174|document.addEventListener|"pointerout"; (event) => {     if (       !pointerOwner ／／       (event.relatedTarget instanceof Node &&         pointerOwner.contains(event.relatedTarget))     )       return;     pointerOwner |需要进一步测试|
|src/ui/tooltips.js:184|document.addEventListener|"focusin"; (event) => {     focusOwner = titleOwner(event.target);     reconcile();   }|需要进一步测试|
|src/ui/tooltips.js:188|document.addEventListener|"focusout"; (event) => {     focusOwner = titleOwner(event.relatedTarget);     reconcile();   }|需要进一步测试|
|src/ui/tooltips.js:192|document.addEventListener|"click"; dismiss; true|需要进一步测试|
|src/ui/tooltips.js:193|document.addEventListener|"keydown"; (event) => {     if (event.key === "Escape") dismiss();   }|需要进一步测试|
|src/ui/tooltips.js:196|window.addEventListener|"blur"; cancel|需要进一步测试|
|src/ui/tooltips.js:197|window.addEventListener|"resize"; position|需要进一步测试|
|src/ui/tooltips.js:198|document.addEventListener|"scroll"; position; true|需要进一步测试|
|src/ui/welcome-v2.js:133|cancelAnimationFrame|cruiseTimer|需要进一步测试|
|src/ui/welcome-v2.js:191|requestAnimationFrame|tick|需要进一步测试|
|src/ui/welcome-v2.js:193|requestAnimationFrame|tick|需要进一步测试|
|src/ui/welcome-v2.js:238|track.addEventListener|"pointerenter"; () => {       trackHovered = true;       syncCruise();     }|需要进一步测试|
|src/ui/welcome-v2.js:242|track.addEventListener|"pointerleave"; () => {       trackHovered = false;       pauseUntil = Date.now() + 2300;       syncCruise();     }|需要进一步测试|
|src/ui/welcome-v2.js:247|track.addEventListener|"focusin"; () => {       trackFocused = true;       syncCruise();     }|需要进一步测试|
|src/ui/welcome-v2.js:251|track.addEventListener|"focusout"; (e) => {       trackFocused = track.contains(e.relatedTarget);       pauseUntil = Date.now() + 2300;       syncCruise();     }|需要进一步测试|
|src/ui/welcome-v2.js:256|track.addEventListener|"pointerdown"; () => {       draggingTrack = true;       syncCruise();     }|需要进一步测试|
|src/ui/welcome-v2.js:260|window.addEventListener|"pointerup"; () => {       draggingTrack = false;       pauseUntil = Date.now() + 2300;       syncCruise();     }|需要进一步测试|
|src/ui/welcome-v2.js:265|window.addEventListener|"pointercancel"; () => {       draggingTrack = false;       syncCruise();     }|需要进一步测试|
|src/ui/welcome-v2.js:270|$(id).addEventListener|"click"; () => {         pauseUntil = Date.now() + 5000;         stopCruise();         syncCruise();       }|需要进一步测试|
|src/ui/welcome-v2.js:275|$("gpCruiseToggle").addEventListener|"click"; () =>       DesktopUI.setGroupCruise(!preferences().groupCruise)|需要进一步测试|
|src/ui/welcome-v2.js:340|cancelAnimationFrame|frame|需要进一步测试|
|src/ui/welcome-v2.js:341|requestAnimationFrame|() => {       frame = null;       overlay.classList.add("ready");     }|需要进一步测试|
|src/ui/welcome-v2.js:372|cancelAnimationFrame|frame|需要进一步测试|
|src/ui/welcome-v2.js:523|track.addEventListener|"pointerdown"; (event) => {       if (introBusy ／／ !event.isPrimary ／／ event.button !== 0) return;       activePointer = event.pointerId;       track.classList.add("dragging");       track.setPoi|需要进一步测试|
|src/ui/welcome-v2.js:530|track.addEventListener|"pointermove"; (event) => {       if (event.pointerId === activePointer) fromEvent(event);     }|需要进一步测试|
|src/ui/welcome-v2.js:533|track.addEventListener|"pointerup"; (event) => {       if (event.pointerId !== activePointer) return;       resetPointer();       if (Number(track.getAttribute("aria-valuenow")) >= 83) finish(false);       else drawS|需要进一步测试|
|src/ui/welcome-v2.js:545|track.addEventListener|"pointercancel"; cancel|需要进一步测试|
|src/ui/welcome-v2.js:546|track.addEventListener|"lostpointercapture"; cancel|需要进一步测试|
|src/ui/welcome-v2.js:547|track.addEventListener|"keydown"; (event) => {       if (introBusy) return;       if (         ["ArrowRight", "ArrowLeft", "End", "Home", "Enter", " "].includes(           event.key,         )       )         event|需要进一步测试|
|src/ui/welcome-v2.js:565|document.addEventListener|"keydown"; (event) => {         if (!activeIntro()) return;         if (event.key === "Escape") {           event.preventDefault();           finish(true);         }         if (event.key ===; true|需要进一步测试|
|src/ui/welcome-v2.js:586|document.addEventListener|"focusin"; (event) => {         if (activeIntro() && !$("gpIntro").contains(event.target)) focusIntro();       }; true|需要进一步测试|
|src/ui/welcome-v2.js:618|$("gpIntroSkip").addEventListener|"click"; () => finish(true)|需要进一步测试|
|src/ui/welcome-v2.js:619|$("gpReplayIntro").addEventListener|"click"; () => showIntro(true)|需要进一步测试|
|src/ui/welcome-v2.js:620|reduceMotion.addEventListener|"change"; preferencesChanged|需要进一步测试|
|src/ui/welcome-v2.js:621|document.addEventListener|"visibilitychange"; () => {       if (document.hidden && introBusy) settleEntrance?.();       syncCruise();     }|需要进一步测试|
|src/ui/welcome-v2.js:625|window.addEventListener|"blur"; () => {       if (activePointer !== null) {         resetPointer();         drawSlide(0);       }       draggingTrack = false;       syncCruise();     }|需要进一步测试|
|src/ui/welcome-v2.js:633|window.addEventListener|"resize"; () => {       if (introBusy) settleEntrance?.();       else if (activeIntro()) {         resetPointer();         drawSlide(0);       }       syncCruise();     }|需要进一步测试|
|src/ui/welcome-v2.js:641|window.addEventListener|"pagehide"; () => {       stopCruise();       settleEntrance?.();     }|需要进一步测试|
|src/ui/welcome-v2.js:645|window.addEventListener|"pageshow"; syncCruise|需要进一步测试|
|src/ui/welcome-v2.js:663|window.addEventListener|"DOMContentLoaded"; init; { once: true }|需要进一步测试|

## 全部 CSS 叶规则

重复正文不直接删除，必须检查层叠上下文、媒体条件、动画定义顺序和状态触发。

|位置|选择器／动画步骤|分类|
|---|---|---|
|src/style/00.css:1|*|需要进一步测试|
|src/style/00.css:3|body|需要进一步测试|
|src/style/00.css:14|.header-banner|需要进一步测试|
|src/style/00.css:27|.header-title|需要进一步测试|
|src/style/00.css:32|.header-stats|需要进一步测试|
|src/style/00.css:38|.main-viewport|需要进一步测试|
|src/style/00.css:47|.top-dashboard-grid|需要进一步测试|
|src/style/00.css:53|.chart-container|需要进一步测试|
|src/style/00.css:63|.dashboard-card-title|需要进一步测试|
|src/style/00.css:72|/* 条形图容器：支持绝对定位与平滑上下位移重排 */   .chart-wrapper|需要进一步测试|
|src/style/00.css:81|.chart-row|需要进一步测试|
|src/style/00.css:91|.chart-rank|需要进一步测试|
|src/style/00.css:92|.chart-name|需要进一步测试|
|src/style/00.css:93|.chart-track|需要进一步测试|
|src/style/00.css:94|/* 条形图增长动画 */   .chart-bar|需要进一步测试|
|src/style/00.css:96|.chart-score|需要进一步测试|
|src/style/00.css:97|.dashboard-summary-container|需要进一步测试|
|src/style/00.css:108|.podium-deck|需要进一步测试|
|src/style/00.css:115|.podium-col|需要进一步测试|
|src/style/00.css:125|.podium-col.rank-1|需要进一步测试|
|src/style/00.css:126|.podium-col.rank-2|需要进一步测试|
|src/style/00.css:127|.podium-col.rank-3|需要进一步测试|
|src/style/00.css:128|.podium-badge|需要进一步测试|
|src/style/00.css:129|.podium-name|需要进一步测试|
|src/style/00.css:130|.podium-score|需要进一步测试|
|src/style/00.css:131|.battle-metrics-row|需要进一步测试|
|src/style/00.css:139|.metric-box|需要进一步测试|
|src/style/00.css:145|.metric-label|需要进一步测试|
|src/style/00.css:146|.metric-value|需要进一步测试|
|src/style/00.css:147|.height-resizer-dock|需要进一步测试|
|src/style/00.css:160|.height-resizer-dock:hover|需要进一步测试|
|src/style/00.css:163|.resizer-handle|需要进一步测试|
|src/style/00.css:180|.resizer-handle::before|需要进一步测试|
|src/style/00.css:185|.quick-batch-bar|需要进一步测试|
|src/style/00.css:196|.quick-batch-bar.active|需要进一步测试|
|src/style/00.css:199|.batch-bar-title|需要进一步测试|
|src/style/00.css:205|.batch-buttons-group|需要进一步测试|
|src/style/00.css:212|.batch-opt-btn|需要进一步测试|
|src/style/00.css:223|.batch-opt-btn:hover|需要进一步测试|
|src/style/00.css:228|.batch-allin-btn|需要进一步测试|
|src/style/00.css:239|.batch-allin-btn:hover|需要进一步测试|
|src/style/00.css:243|/* 严格等宽网格排布 */   .group-list|需要进一步测试|
|src/style/00.css:250|.group-row-card|需要进一步测试|
|src/style/00.css:265|.group-row-card.menu-active|需要进一步测试|
|src/style/00.css:268|.group-row-card.anim-win|需要进一步测试|
|src/style/00.css:270|.group-row-card.anim-loss|需要进一步测试|
|src/style/00.css:273|0%|需要进一步测试|
|src/style/00.css:274|30%|需要进一步测试|
|src/style/00.css:275|100%|需要进一步测试|
|src/style/00.css:279|0%, 100%|需要进一步测试|
|src/style/00.css:280|20%, 60%|需要进一步测试|
|src/style/00.css:281|40%, 80%|需要进一步测试|
|src/style/00.css:283|/* 金色整块覆盖遮罩层：支持平滑进入与平滑淡出 */   .milestone-banner-overlay|需要进一步测试|
|src/style/00.css:305|.milestone-banner-overlay.show|需要进一步测试|
|src/style/00.css:310|.group-row-card.milestone-glow|需要进一步测试|
|src/style/00.css:313|.card-header-row|需要进一步测试|
|src/style/00.css:323|.header-name-col|需要进一步测试|
|src/style/00.css:330|.name-input|需要进一步测试|
|src/style/00.css:343|.name-input:not([readonly]):hover, .name-input:not([readonly]):focus|需要进一步测试|
|src/style/00.css:347|.header-meta-col|需要进一步测试|
|src/style/00.css:354|.member-count-tag|需要进一步测试|
|src/style/00.css:365|.member-count-tag:hover|需要进一步测试|
|src/style/00.css:366|.color-picker|需要进一步测试|
|src/style/00.css:376|.del-btn|需要进一步测试|
|src/style/00.css:387|.del-btn:hover|需要进一步测试|
|src/style/00.css:388|/* 操作行强制单行展示，杜绝任何换行挤压 */   .card-action-row|需要进一步测试|
|src/style/00.css:399|.action-score-col|需要进一步测试|
|src/style/00.css:408|.row-score|需要进一步测试|
|src/style/00.css:421|.row-score.editable:hover|需要进一步测试|
|src/style/00.css:422|.score-input|需要进一步测试|
|src/style/00.css:434|/* 功能按钮组右浮动对齐，锁定不被折行 */   .action-controls-col|需要进一步测试|
|src/style/00.css:446|.opt-group|需要进一步测试|
|src/style/00.css:453|.opt-btn|需要进一步测试|
|src/style/00.css:471|.opt-btn.active|需要进一步测试|
|src/style/00.css:472|.opt-btn.correct|需要进一步测试|
|src/style/00.css:473|.opt-btn.wrong|需要进一步测试|
|src/style/00.css:474|.allin-toggle-btn|需要进一步测试|
|src/style/00.css:493|.allin-toggle-btn.active|需要进一步测试|
|src/style/00.css:499|.result-msg-box|需要进一步测试|
|src/style/00.css:511|.result-msg-box:empty|需要进一步测试|
|src/style/00.css:514|.more-btn|需要进一步测试|
|src/style/00.css:531|.more-btn:hover|需要进一步测试|
|src/style/00.css:532|.score-modal-backdrop|需要进一步测试|
|src/style/00.css:542|.score-modal-backdrop.active|需要进一步测试|
|src/style/00.css:543|.score-modal-card|需要进一步测试|
|src/style/00.css:556|.score-modal-card *|需要进一步测试|
|src/style/00.css:557|.score-modal-title|需要进一步测试|
|src/style/00.css:563|.score-modal-hint|需要进一步测试|
|src/style/00.css:564|.custom-score-field|需要进一步测试|
|src/style/00.css:579|.custom-score-field:focus|需要进一步测试|
|src/style/00.css:580|.custom-score-field.invalid|需要进一步测试|
|src/style/00.css:581|.score-modal-error|需要进一步测试|
|src/style/00.css:582|.score-modal-actions|需要进一步测试|
|src/style/00.css:590|.score-modal-cancel|需要进一步测试|
|src/style/00.css:591|.member-search-fab|需要进一步测试|
|src/style/00.css:611|.member-search-fab:hover|需要进一步测试|
|src/style/00.css:612|.member-search-fab:active|需要进一步测试|
|src/style/00.css:613|.member-search-backdrop|需要进一步测试|
|src/style/00.css:625|.member-search-backdrop.active|需要进一步测试|
|src/style/00.css:626|.member-search-card|需要进一步测试|
|src/style/00.css:636|.member-search-title|需要进一步测试|
|src/style/00.css:642|.member-search-subtitle|需要进一步测试|
|src/style/00.css:648|.member-search-input-row|需要进一步测试|
|src/style/00.css:653|.member-search-input|需要进一步测试|
|src/style/00.css:666|.member-search-input:focus|需要进一步测试|
|src/style/00.css:670|.member-search-results|需要进一步测试|
|src/style/00.css:678|.member-search-result|需要进一步测试|
|src/style/00.css:685|.member-search-result:last-child|需要进一步测试|
|src/style/00.css:686|.member-search-result-name|需要进一步测试|
|src/style/00.css:687|.member-search-result-group|需要进一步测试|
|src/style/00.css:692|.member-search-result-members|需要进一步测试|
|src/style/00.css:698|.member-search-empty|需要进一步测试|
|src/style/00.css:705|.member-search-fab|需要进一步测试|
|src/style/00.css:712|.member-search-input-row|需要进一步测试|
|src/style/00.css:713|.member-search-input-row .btn|需要进一步测试|
|src/style/00.css:715|.bottom-dock|需要进一步测试|
|src/style/00.css:734|.dock-left|需要进一步测试|
|src/style/00.css:735|.dock-right|需要进一步测试|
|src/style/00.css:736|.status-badge|需要进一步测试|
|src/style/00.css:755|.status-badge.active|需要进一步测试|
|src/style/00.css:756|.status-badge.done|需要进一步测试|
|src/style/00.css:757|.icon-btn|需要进一步测试|
|src/style/00.css:773|.icon-btn:hover|需要进一步测试|
|src/style/00.css:774|.icon-btn.locked|需要进一步测试|
|src/style/00.css:775|.icon-btn.unlocked|需要进一步测试|
|src/style/00.css:776|.icon-btn.zoom-in|需要进一步测试|
|src/style/00.css:783|.icon-btn.zoom-in:hover|需要进一步测试|
|src/style/00.css:787|.icon-btn.zoom-out|需要进一步测试|
|src/style/00.css:794|.icon-btn.zoom-out:hover|需要进一步测试|
|src/style/00.css:798|.icon-btn.zoom-reset|需要进一步测试|
|src/style/00.css:805|.icon-btn.zoom-reset:hover|需要进一步测试|
|src/style/00.css:809|.btn|需要进一步测试|
|src/style/00.css:820|.btn-primary|需要进一步测试|
|src/style/00.css:821|.btn-primary:hover|需要进一步测试|
|src/style/00.css:822|.btn-success|需要进一步测试|
|src/style/00.css:823|.btn-success:hover|需要进一步测试|
|src/style/00.css:824|.btn-warning|需要进一步测试|
|src/style/00.css:825|.btn-warning:hover|需要进一步测试|
|src/style/00.css:826|.btn-danger|需要进一步测试|
|src/style/00.css:827|.btn-danger:hover|需要进一步测试|
|src/style/00.css:828|/* 盛大最终结算全屏层与烟花画布样式 */   .grand-modal-overlay|需要进一步测试|
|src/style/00.css:840|.grand-modal-overlay.active|需要进一步测试|
|src/style/00.css:841|#confettiCanvas|需要进一步测试|
|src/style/00.css:848|.grand-card|需要进一步测试|
|src/style/00.css:864|0%|需要进一步测试|
|src/style/00.css:865|100%|需要进一步测试|
|src/style/00.css:867|.grand-title|需要进一步测试|
|src/style/00.css:873|.grand-trophy|需要进一步测试|
|src/style/00.css:879|0%|需要进一步测试|
|src/style/00.css:880|100%|需要进一步测试|
|src/style/00.css:882|.ans-btn|需要进一步测试|
|src/style/00.css:895|.ans-btn.selected|需要进一步测试|
|src/style/00.css:902|.locked-disabled, .round-disabled|需要进一步测试|
|src/style/00.css:908|.modal-overlay|需要进一步测试|
|src/style/00.css:918|.modal-overlay.active|需要进一步测试|
|src/style/00.css:919|.modal-box|需要进一步测试|
|src/style/00.css:931|.modal-box.large|需要进一步测试|
|src/style/00.css:932|.modal-box.slot-modal|需要进一步测试|
|src/style/00.css:933|.modal-input|需要进一步测试|
|src/style/00.css:944|.modal-input:focus|需要进一步测试|
|src/style/00.css:945|.modal-actions|需要进一步测试|
|src/style/00.css:946|.setting-item|需要进一步测试|
|src/style/00.css:955|.sound-row|需要进一步测试|
|src/style/00.css:963|.history-list|需要进一步测试|
|src/style/00.css:970|.history-item|需要进一步测试|
|src/style/00.css:980|.slot-machine-case|需要进一步测试|
|src/style/00.css:991|.slot-reel-frame|需要进一步测试|
|src/style/00.css:1000|.slot-reel-text|需要进一步测试|
|src/style/00.css:1009|.btn-slot-action|需要进一步测试|
|src/style/00.css:1017|.btn-slot-action.start|需要进一步测试|
|src/style/00.css:1018|.btn-slot-action.stop|需要进一步测试|
|src/style/00.css:1019|.two-tier-group-select|需要进一步测试|
|src/style/00.css:1025|.two-tier-chips|需要进一步测试|
|src/style/00.css:1026|.two-tier-chip|需要进一步测试|
|src/style/00.css:1030|.two-tier-chip:hover|需要进一步测试|
|src/style/00.css:1031|.two-tier-chip.active|需要进一步测试|
|src/style/00.css:1032|.audio-hint-bar|需要进一步测试|
|src/style/00.css:1038|.welcome-modal|需要进一步测试|
|src/style/00.css:1043|.welcome-modal.active|需要进一步测试|
|src/style/00.css:1044|.welcome-modal-card|需要进一步测试|
|src/style/00.css:1051|.welcome-modal-head|需要进一步测试|
|src/style/00.css:1052|.welcome-modal-title|需要进一步测试|
|src/style/00.css:1053|.welcome-modal-sub|需要进一步测试|
|src/style/00.css:1054|.welcome-modal-pages|需要进一步测试|
|src/style/00.css:1055|.wmp-item|需要进一步测试|
|src/style/00.css:1056|.wmp-tag|需要进一步测试|
|src/style/00.css:1057|.welcome-modal-btn|需要进一步测试|
|src/style/00.css:1058|.welcome-modal-hint|需要进一步测试|
|src/style/00.css:1059|.toast|需要进一步测试|
|src/style/00.css:1078|.toast.show|需要进一步测试|
|src/style/00.css:1083|/* v2: 可维护的公共变量与无障碍交互状态 */   :root|需要进一步测试|
|src/style/00.css:1096|button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible|需要进一步测试|
|src/style/00.css:1101|*, *::before, *::after|需要进一步测试|
|src/style/00.css:1110|.card-action-row|需要进一步测试|
|src/style/00.css:1115|.action-controls-col|需要进一步测试|
|src/style/00.css:1119|.top-dashboard-grid|需要进一步测试|
|src/style/00.css:1122|.group-list|需要进一步测试|
|src/style/00.css:1126|/* ================= SPA core view architecture v3 ================= */   .view|需要进一步测试|
|src/style/00.css:1129|.view.active|需要进一步测试|
|src/style/00.css:1130|.app-topnav|需要进一步测试|
|src/style/00.css:1139|.app-topnav .header-title|需要进一步测试|
|src/style/00.css:1140|.app-topnav .header-title small|需要进一步测试|
|src/style/00.css:1141|.app-topnav .header-stats|需要进一步测试|
|src/style/00.css:1142|.nav-tabs|需要进一步测试|
|src/style/00.css:1143|.nav-tab|需要进一步测试|
|src/style/00.css:1148|.nav-tab:hover|需要进一步测试|
|src/style/00.css:1149|.nav-tab.active|需要进一步测试|
|src/style/00.css:1153|/* 欢迎页大屏 */   #view-welcome|需要进一步测试|
|src/style/00.css:1156|.welcome-hero|需要进一步测试|
|src/style/00.css:1167|.welcome-clock|需要进一步测试|
|src/style/00.css:1172|.welcome-date|需要进一步测试|
|src/style/00.css:1173|.welcome-greeting|需要进一步测试|
|src/style/00.css:1174|.welcome-sub|需要进一步测试|
|src/style/00.css:1175|.welcome-cards|需要进一步测试|
|src/style/00.css:1179|.welcome-card|需要进一步测试|
|src/style/00.css:1183|.welcome-card-title|需要进一步测试|
|src/style/00.css:1184|.welcome-stat-grid|需要进一步测试|
|src/style/00.css:1185|.w-stat-num|需要进一步测试|
|src/style/00.css:1186|.w-stat-label|需要进一步测试|
|src/style/00.css:1187|.welcome-enter-wrap|需要进一步测试|
|src/style/00.css:1188|.welcome-enter-btn|需要进一步测试|
|src/style/00.css:1194|.welcome-enter-btn:hover|需要进一步测试|
|src/style/00.css:1195|.welcome-enter-btn:active|需要进一步测试|
|src/style/00.css:1196|/* 全屏视图通用 */   .fullview-header|需要进一步测试|
|src/style/00.css:1202|.fullview-header h2|需要进一步测试|
|src/style/00.css:1203|.fullview-sub|需要进一步测试|
|src/style/00.css:1204|.fullview-body|需要进一步测试|
|src/style/00.css:1205|#view-history, #view-archives, #view-settings|需要进一步测试|
|src/style/00.css:1206|/* 历史时间轴 */   .history-timeline|需要进一步测试|
|src/style/00.css:1209|.history-timeline::before|需要进一步测试|
|src/style/00.css:1213|.hist-node|需要进一步测试|
|src/style/00.css:1214|.hist-node::before|需要进一步测试|
|src/style/00.css:1218|.hist-node.current::before|需要进一步测试|
|src/style/00.css:1219|.hist-card|需要进一步测试|
|src/style/00.css:1223|.hist-card:hover|需要进一步测试|
|src/style/00.css:1224|.hist-card-top|需要进一步测试|
|src/style/00.css:1225|.hist-desc|需要进一步测试|
|src/style/00.css:1226|.hist-time|需要进一步测试|
|src/style/00.css:1227|.hist-compare|需要进一步测试|
|src/style/00.css:1228|.hist-node.expanded .hist-compare|需要进一步测试|
|src/style/00.css:1229|.hist-compare-table|需要进一步测试|
|src/style/00.css:1230|.hist-compare-table th, .hist-compare-table td|需要进一步测试|
|src/style/00.css:1231|.hist-compare-table th|需要进一步测试|
|src/style/00.css:1232|.hist-delta-pos|需要进一步测试|
|src/style/00.css:1233|.hist-delta-neg|需要进一步测试|
|src/style/00.css:1234|.hist-delta-zero|需要进一步测试|
|src/style/00.css:1235|.hist-actions|需要进一步测试|
|src/style/00.css:1236|/* 设置页 */   .settings-scroll|需要进一步测试|
|src/style/00.css:1239|.setting-section-title|需要进一步测试|
|src/style/00.css:1240|.setting-section-title:first-child|需要进一步测试|
|src/style/00.css:1241|.engine-row|需要进一步测试|
|src/style/00.css:1242|.engine-row > label|需要进一步测试|
|src/style/00.css:1243|.engine-row input[type=range]|需要进一步测试|
|src/style/00.css:1244|.engine-row .engine-val|需要进一步测试|
|src/style/00.css:1245|.trim-grid|需要进一步测试|
|src/style/00.css:1246|.trim-row|需要进一步测试|
|src/style/00.css:1247|.trim-row .trim-name|需要进一步测试|
|src/style/00.css:1248|.trim-row .trim-val|需要进一步测试|
|src/style/00.css:1249|.archives-list|需要进一步测试|
|src/style/00.css:1250|.settings-toolbar|需要进一步测试|
|src/style/00.css:1253|.welcome-cards|需要进一步测试|
|src/style/00.css:1254|.welcome-clock|需要进一步测试|
|src/style/00.css:1255|.app-topnav|需要进一步测试|
|src/style/00.css:1256|.nav-tabs|需要进一步测试|
|src/style/00.css:1257|.welcome-greeting|需要进一步测试|
|src/style/00.css:1259|/* 壁纸设置的结构规则由唯一扁平主题接管。 */   .wall-actions|需要进一步测试|
|src/style/00.css:1263|.wall-file-btn|需要进一步测试|
|src/style/00.css:1264|.wall-file-btn input|需要进一步测试|
|src/style/00.css:1265|/* ================= 道具系统 V1 ================= */ .item-slots|需要进一步测试|
|src/style/00.css:1268|.item-slot|需要进一步测试|
|src/style/00.css:1269|.item-slot.empty|需要进一步测试|
|src/style/00.css:1270|.item-slot .charges|需要进一步测试|
|src/style/00.css:1270|.group-row-card.item-def-green|需要进一步测试|
|src/style/00.css:1271|.group-row-card.item-def-red|需要进一步测试|
|src/style/00.css:1271|.group-row-card.item-def-yellow|需要进一步测试|
|src/style/00.css:1271|.group-row-card.item-def-orange|需要进一步测试|
|src/style/00.css:1271|.group-row-card.effect-star|需要进一步测试|
|src/style/00.css:1272|.group-row-card.effect-mega|需要进一步测试|
|src/style/00.css:1272|.group-row-card.effect-power|需要进一步测试|
|src/style/00.css:1272|.group-row-card.effect-bullet|需要进一步测试|
|src/style/00.css:1272|.group-row-card.effect-boo|需要进一步测试|
|src/style/00.css:1272|.group-row-card.effect-bomb|需要进一步测试|
|src/style/00.css:1273|0%|需要进一步测试|
|src/style/00.css:1273|25%|需要进一步测试|
|src/style/00.css:1273|50%|需要进一步测试|
|src/style/00.css:1273|75%|需要进一步测试|
|src/style/00.css:1273|100%|需要进一步测试|
|src/style/00.css:1274|from|需要进一步测试|
|src/style/00.css:1274|to|需要进一步测试|
|src/style/00.css:1275|0%,100%|需要进一步测试|
|src/style/00.css:1275|40%|需要进一步测试|
|src/style/00.css:1275|.item-global-btn|需要进一步测试|
|src/style/00.css:1276|.item-modal-backdrop|需要进一步测试|
|src/style/00.css:1277|.item-modal-backdrop.active|需要进一步测试|
|src/style/00.css:1277|.item-window|需要进一步测试|
|src/style/00.css:1277|from|需要进一步测试|
|src/style/00.css:1277|to|需要进一步测试|
|src/style/00.css:1277|.item-side|需要进一步测试|
|src/style/00.css:1278|.item-side-title|需要进一步测试|
|src/style/00.css:1278|.item-tab|需要进一步测试|
|src/style/00.css:1278|.item-tab.active|需要进一步测试|
|src/style/00.css:1278|.item-main|需要进一步测试|
|src/style/00.css:1278|.item-main-head|需要进一步测试|
|src/style/00.css:1278|.item-main-head h3|需要进一步测试|
|src/style/00.css:1278|.item-close|需要进一步测试|
|src/style/00.css:1278|.item-inventory-grid|需要进一步测试|
|src/style/00.css:1278|.item-big|需要进一步测试|
|src/style/00.css:1278|.item-big.empty|需要进一步测试|
|src/style/00.css:1278|.item-big-icon|需要进一步测试|
|src/style/00.css:1278|.item-big-name|需要进一步测试|
|src/style/00.css:1278|.item-big-desc|需要进一步测试|
|src/style/00.css:1278|.item-use|需要进一步测试|
|src/style/00.css:1278|.item-stat-grid|需要进一步测试|
|src/style/00.css:1278|.item-stat|需要进一步测试|
|src/style/00.css:1278|.item-stat b|需要进一步测试|
|src/style/00.css:1278|.item-stat span|需要进一步测试|
|src/style/00.css:1278|.item-members|需要进一步测试|
|src/style/00.css:1278|.item-score-panel|需要进一步测试|
|src/style/00.css:1278|.item-score-panel input|需要进一步测试|
|src/style/00.css:1278|.item-draw-overlay|需要进一步测试|
|src/style/00.css:1278|.item-draw-overlay.active|需要进一步测试|
|src/style/00.css:1278|.item-draw-board|需要进一步测试|
|src/style/00.css:1278|.item-draw-title|需要进一步测试|
|src/style/00.css:1278|.item-draw-grid|需要进一步测试|
|src/style/00.css:1278|.item-draw-card|需要进一步测试|
|src/style/00.css:1278|.item-draw-card .roulette|需要进一步测试|
|src/style/00.css:1278|.item-draw-card .draw-name|需要进一步测试|
|src/style/00.css:1278|.item-draw-card.full|需要进一步测试|
|src/style/00.css:1278|.item-draw-card.reveal|需要进一步测试|
|src/style/00.css:1278|50%|需要进一步测试|
|src/style/00.css:1278|.squid-veil|需要进一步测试|
|src/style/00.css:1279|.squid-veil.active|需要进一步测试|
|src/style/00.css:1279|.squid-hidden-score|需要进一步测试|
|src/style/00.css:1279|.squid-score-mask::after|需要进一步测试|
|src/style/00.css:1279|.squid-score-mask|需要进一步测试|
|src/style/00.css:1279|.item-defense-toast|需要进一步测试|
|src/style/00.css:1281|.item-window|需要进一步测试|
|src/style/00.css:1281|.item-side|需要进一步测试|
|src/style/00.css:1281|.item-side-title|需要进一步测试|
|src/style/00.css:1281|.item-tab|需要进一步测试|
|src/style/00.css:1281|.item-inventory-grid|需要进一步测试|
|src/style/00.css:1281|.item-stat-grid|需要进一步测试|
|src/style/00.css:1281|/* ===== 完整课堂版 V2：其余工作台 ===== */ .picker-layout-v2|需要进一步测试|
|src/style/00.css:1285|.picker-left-v2,.picker-right-v2|需要进一步测试|
|src/style/00.css:1286|.picker-left-v2|需要进一步测试|
|src/style/00.css:1287|.picker-right-v2|需要进一步测试|
|src/style/00.css:1287|.picker-center-v2|需要进一步测试|
|src/style/00.css:1287|.picker-vtab|需要进一步测试|
|src/style/00.css:1288|.picker-vtab.active|需要进一步测试|
|src/style/00.css:1289|.picker-info-tabs|需要进一步测试|
|src/style/00.css:1290|.picker-info-tabs button|需要进一步测试|
|src/style/00.css:1290|.picker-info-tabs button.active|需要进一步测试|
|src/style/00.css:1290|#pickerInfoBox|需要进一步测试|
|src/style/00.css:1291|.picker-log|需要进一步测试|
|src/style/00.css:1291|.picker-target|需要进一步测试|
|src/style/00.css:1292|.picker-score-grid|需要进一步测试|
|src/style/00.css:1292|.classroom-backdrop,.about-backdrop|需要进一步测试|
|src/style/00.css:1293|.classroom-backdrop.active,.about-backdrop.active|需要进一步测试|
|src/style/00.css:1293|.classroom-window,.about-window|需要进一步测试|
|src/style/00.css:1294|.classroom-head,.about-head|需要进一步测试|
|src/style/00.css:1295|.classroom-body|需要进一步测试|
|src/style/00.css:1295|.hand-grid|需要进一步测试|
|src/style/00.css:1296|.hand-group|需要进一步测试|
|src/style/00.css:1296|.hand-group.selected|需要进一步测试|
|src/style/00.css:1296|.hand-actions,.hand-rewards|需要进一步测试|
|src/style/00.css:1297|.hand-rewards|需要进一步测试|
|src/style/00.css:1297|.settings-v2-tabs|需要进一步测试|
|src/style/00.css:1298|.settings-v2-tabs button|需要进一步测试|
|src/style/00.css:1298|.settings-v2-tabs button.active|需要进一步测试|
|src/style/00.css:1298|.v2-settings-pane|需要进一步测试|
|src/style/00.css:1299|.v2-settings-pane.active|需要进一步测试|
|src/style/00.css:1299|.item-ency-grid|需要进一步测试|
|src/style/00.css:1299|.ency-card|需要进一步测试|
|src/style/00.css:1299|.ency-icon|需要进一步测试|
|src/style/00.css:1299|.ency-icon img,.item-slot img,.item-big-icon img|需要进一步测试|
|src/style/00.css:1299|.ency-name|需要进一步测试|
|src/style/00.css:1299|.ency-desc|需要进一步测试|
|src/style/00.css:1299|.ency-actions|需要进一步测试|
|src/style/00.css:1299|.about-window|需要进一步测试|
|src/style/00.css:1300|.about-side|需要进一步测试|
|src/style/00.css:1300|.about-side button|需要进一步测试|
|src/style/00.css:1300|.about-side button.active|需要进一步测试|
|src/style/00.css:1300|.about-main|需要进一步测试|
|src/style/00.css:1300|.guide-block|需要进一步测试|
|src/style/00.css:1300|.god-item-tools|需要进一步测试|
|src/style/00.css:1301|.god-item-grid|需要进一步测试|
|src/style/00.css:1301|.god-item-grid button|需要进一步测试|
|src/style/00.css:1301|.group-row-card.item-draw-spinning .card-header-row,.group-row-card.item-draw-spinning .item-slots,.group-row-card.item-draw-spinning .answer-zone,.group-row-card.item-draw-spinning .score-zone,.group-row-card.item-draw-spinning .group-actions|需要进一步测试|
|src/style/00.css:1302|.group-row-card.item-draw-spinning|需要进一步测试|
|src/style/00.css:1303|.card-item-roulette|需要进一步测试|
|src/style/00.css:1303|.card-item-roulette .r-icon|需要进一步测试|
|src/style/00.css:1303|.card-item-roulette .r-name|需要进一步测试|
|src/style/00.css:1303|.card-item-roulette.reveal|需要进一步测试|
|src/style/00.css:1304|.picker-layout-v2|需要进一步测试|
|src/style/00.css:1304|.picker-left-v2,.picker-right-v2|需要进一步测试|
|src/style/00.css:1304|.about-window|需要进一步测试|
|src/style/00.css:1304|.about-side|需要进一步测试|
|src/style/00.css:1304|.about-side button|需要进一步测试|
|src/style/00.css:1304|/* ===== V2.1 举手菜单内道具抽取 ===== */ .hand-item-draw-stage|需要进一步测试|
|src/style/00.css:1308|.hand-item-capsule|需要进一步测试|
|src/style/00.css:1309|.hand-item-capsule.spinning|需要进一步测试|
|src/style/00.css:1310|.hand-item-capsule.reveal|需要进一步测试|
|src/style/00.css:1311|.hand-item-draw-name|需要进一步测试|
|src/style/00.css:1312|.hand-item-draw-sub|需要进一步测试|
|src/style/00.css:1312|.hand-item-progress|需要进一步测试|
|src/style/00.css:1313|.hand-item-progress>div|需要进一步测试|
|src/style/00.css:1313|.hand-item-result-actions|需要进一步测试|
|src/style/00.css:1315|from|需要进一步测试|
|src/style/00.css:1315|to|需要进一步测试|
|src/style/00.css:1315|/* ===== V2.4 自定义道具图片：永远 contain，不再把一张图铺成整张卡 ===== */ .item-slot|需要进一步测试|
|src/style/00.css:1319|.item-slot>img,.item-big-icon>img,.ency-icon>img,.hand-item-capsule>img, .card-item-roulette .r-icon>img|需要进一步测试|
|src/style/00.css:1327|.card-item-roulette .r-icon|需要进一步测试|
|src/style/00.css:1330|.card-item-roulette .r-icon>img|需要进一步测试|
|src/style/00.css:1331|.hand-item-capsule>img|需要进一步测试|
|src/style/00.css:1332|.item-big-icon|需要进一步测试|
|src/style/00.css:1333|.item-big-icon>img|需要进一步测试|
|src/style/00.css:1334|.item-slot>img|需要进一步测试|
|src/style/00.css:1335|/* ===== 卡片抽取：水晶轮盘，不再直接拿图片撑满卡片 ===== */ .group-row-card.item-draw-spinning|需要进一步测试|
|src/style/00.css:1340|.group-row-card.item-draw-spinning .card-header-row, .group-row-card.item-draw-spinning .item-slots, .group-row-card.item-draw-spinning .answer-zone, .group-row-card.item-draw-spinning .score-zone, .group-row-card.item-draw-spinning .group-actions|需要进一步测试|
|src/style/00.css:1348|.card-item-roulette|需要进一步测试|
|src/style/00.css:1360|.card-item-roulette:before|需要进一步测试|
|src/style/00.css:1365|.card-item-roulette:after|需要进一步测试|
|src/style/00.css:1369|.card-item-roulette .r-icon|需要进一步测试|
|src/style/00.css:1376|.card-item-roulette .r-icon.roulette-swap|需要进一步测试|
|src/style/00.css:1377|.card-item-roulette .r-name|需要进一步测试|
|src/style/00.css:1383|.card-item-roulette .r-hint|需要进一步测试|
|src/style/00.css:1386|.card-item-roulette.reveal|需要进一步测试|
|src/style/00.css:1390|.card-item-roulette.reveal:before|需要进一步测试|
|src/style/00.css:1391|.card-item-roulette.reveal .r-icon|需要进一步测试|
|src/style/00.css:1392|.card-item-roulette.reveal .r-name|需要进一步测试|
|src/style/00.css:1394|from|需要进一步测试|
|src/style/00.css:1394|to|需要进一步测试|
|src/style/00.css:1395|to|需要进一步测试|
|src/style/00.css:1396|to|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:1397|0%|需要进一步测试|
|src/style/00.css:1397|55%|需要进一步测试|
|src/style/00.css:1397|100%|需要进一步测试|
|src/style/00.css:1398|0%|需要进一步测试|
|src/style/00.css:1398|45%|需要进一步测试|
|src/style/00.css:1398|100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:1399|from|需要进一步测试|
|src/style/00.css:1399|55%|需要进一步测试|
|src/style/00.css:1399|to|需要进一步测试|
|src/style/00.css:1399|/* 举手菜单抽取同步升级 */ .hand-item-draw-stage|需要进一步测试|
|src/style/00.css:1404|.hand-item-capsule|需要进一步测试|
|src/style/00.css:1409|.hand-item-capsule.spinning|需要进一步测试|
|src/style/00.css:1410|.hand-item-capsule.spinning>*|需要进一步测试|
|src/style/00.css:1411|.hand-item-capsule.reveal|需要进一步测试|
|src/style/00.css:1412|.hand-item-progress|需要进一步测试|
|src/style/00.css:1413|.hand-item-progress>div|需要进一步测试|
|src/style/00.css:1415|from|需要进一步测试|
|src/style/00.css:1415|to|需要进一步测试|
|src/style/00.css:1416|from|需要进一步测试|
|src/style/00.css:1416|to|需要进一步测试|
|src/style/00.css:1417|0%|需要进一步测试|
|src/style/00.css:1417|50%|需要进一步测试|
|src/style/00.css:1417|100%|需要进一步测试|
|src/style/00.css:1417|/* ===== V2.5 比赛页小组卡片道具动画 ===== */ .group-row-card|需要进一步测试|
|src/style/00.css:1421|.group-row-card.card-use-fx|需要进一步测试|
|src/style/00.css:1422|.group-row-card.card-use-fx:before,.group-row-card.card-use-fx:after|需要进一步测试|
|src/style/00.css:1423|.group-row-card.card-use-fx .card-fx-badge|需要进一步测试|
|src/style/00.css:1424|.group-row-card.card-use-fx .card-fx-badge .cfi|需要进一步测试|
|src/style/00.css:1425|.group-row-card.card-use-fx .card-fx-badge img|需要进一步测试|
|src/style/00.css:1425|.group-row-card.card-use-fx:before|需要进一步测试|
|src/style/00.css:1426|.group-row-card.card-use-fx:after|需要进一步测试|
|src/style/00.css:1427|/* 攻击类 */ .group-row-card.cfx-green|需要进一步测试|
|src/style/00.css:1430|.group-row-card.cfx-red|需要进一步测试|
|src/style/00.css:1431|.group-row-card.cfx-spiny|需要进一步测试|
|src/style/00.css:1432|.group-row-card.cfx-banana|需要进一步测试|
|src/style/00.css:1433|.group-row-card.cfx-horn|需要进一步测试|
|src/style/00.css:1434|.group-row-card.cfx-bomb|需要进一步测试|
|src/style/00.css:1435|.group-row-card.cfx-hammer|需要进一步测试|
|src/style/00.css:1436|.group-row-card.cfx-lightning|需要进一步测试|
|src/style/00.css:1437|/* 增益/特殊类 */ .group-row-card.cfx-coin|需要进一步测试|
|src/style/00.css:1440|.group-row-card.cfx-rise|需要进一步测试|
|src/style/00.css:1441|.group-row-card.cfx-mushroom|需要进一步测试|
|src/style/00.css:1442|.group-row-card.cfx-boo|需要进一步测试|
|src/style/00.css:1443|.group-row-card.cfx-blooper|需要进一步测试|
|src/style/00.css:1444|.group-row-card.cfx-star|需要进一步测试|
|src/style/00.css:1445|.group-row-card.cfx-giant|需要进一步测试|
|src/style/00.css:1446|.group-row-card.cfx-bullet|需要进一步测试|
|src/style/00.css:1447|.group-row-card.cfx-power|需要进一步测试|
|src/style/00.css:1448|/* 被命中的卡片 */ .group-row-card.card-hit-fx|需要进一步测试|
|src/style/00.css:1451|.group-row-card.card-hit-fx:before|需要进一步测试|
|src/style/00.css:1452|.group-row-card.card-defend-fx|需要进一步测试|
|src/style/00.css:1453|.group-row-card.card-heal-fx|需要进一步测试|
|src/style/00.css:1456|0%|需要进一步测试|
|src/style/00.css:1456|18%|需要进一步测试|
|src/style/00.css:1456|68%|需要进一步测试|
|src/style/00.css:1456|100%|需要进一步测试|
|src/style/00.css:1457|0%|需要进一步测试|
|src/style/00.css:1457|18%|需要进一步测试|
|src/style/00.css:1457|72%|需要进一步测试|
|src/style/00.css:1457|100%|需要进一步测试|
|src/style/00.css:1458|0%|需要进一步测试|
|src/style/00.css:1458|25%|需要进一步测试|
|src/style/00.css:1458|100%|需要进一步测试|
|src/style/00.css:1459|0%,100%|需要进一步测试|
|src/style/00.css:1459|18%|需要进一步测试|
|src/style/00.css:1459|30%|需要进一步测试|
|src/style/00.css:1459|42%|需要进一步测试|
|src/style/00.css:1460|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:1460|20%|需要进一步测试|
|src/style/00.css:1460|42%|需要进一步测试|
|src/style/00.css:1461|0%,100%|需要进一步测试|
|src/style/00.css:1461|22%|需要进一步测试|
|src/style/00.css:1461|32%|需要进一步测试|
|src/style/00.css:1462|0%,100%|需要进一步测试|
|src/style/00.css:1462|22%|需要进一步测试|
|src/style/00.css:1462|34%|需要进一步测试|
|src/style/00.css:1463|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:1463|20%|需要进一步测试|
|src/style/00.css:1463|38%|需要进一步测试|
|src/style/00.css:1464|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:1464|18%|需要进一步测试|
|src/style/00.css:1464|35%|需要进一步测试|
|src/style/00.css:1465|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:1465|20%|需要进一步测试|
|src/style/00.css:1465|45%|需要进一步测试|
|src/style/00.css:1466|0%,12%,24%,100%|需要进一步测试|
|src/style/00.css:1466|6%,18%|需要进一步测试|
|src/style/00.css:1467|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:1467|22%|需要进一步测试|
|src/style/00.css:1468|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:1468|24%|需要进一步测试|
|src/style/00.css:1468|55%|需要进一步测试|
|src/style/00.css:1469|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:1469|18%|需要进一步测试|
|src/style/00.css:1469|38%|需要进一步测试|
|src/style/00.css:1470|0%,100%|需要进一步测试|
|src/style/00.css:1470|25%|需要进一步测试|
|src/style/00.css:1470|58%|需要进一步测试|
|src/style/00.css:1471|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:1471|22%|需要进一步测试|
|src/style/00.css:1471|55%|需要进一步测试|
|src/style/00.css:1472|0%|需要进一步测试|
|src/style/00.css:1472|35%|需要进一步测试|
|src/style/00.css:1472|70%|需要进一步测试|
|src/style/00.css:1472|100%|需要进一步测试|
|src/style/00.css:1473|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:1473|26%|需要进一步测试|
|src/style/00.css:1473|55%|需要进一步测试|
|src/style/00.css:1474|0%|需要进一步测试|
|src/style/00.css:1474|24%|需要进一步测试|
|src/style/00.css:1474|100%|需要进一步测试|
|src/style/00.css:1475|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:1475|22%|需要进一步测试|
|src/style/00.css:1475|55%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:1476|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:1476|12%|需要进一步测试|
|src/style/00.css:1476|20%|需要进一步测试|
|src/style/00.css:1476|29%|需要进一步测试|
|src/style/00.css:1476|38%|需要进一步测试|
|src/style/00.css:1477|0%|需要进一步测试|
|src/style/00.css:1477|12%|需要进一步测试|
|src/style/00.css:1477|38%|需要进一步测试|
|src/style/00.css:1477|100%|需要进一步测试|
|src/style/00.css:1478|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:1478|20%|需要进一步测试|
|src/style/00.css:1478|38%|需要进一步测试|
|src/style/00.css:1479|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:1479|20%|需要进一步测试|
|src/style/00.css:1479|/* 真正分离的设置标签页 */ .settings-v26-tabs|需要进一步测试|
|src/style/00.css:1483|.settings-v26-tabs button|需要进一步测试|
|src/style/00.css:1484|.settings-v26-tabs button.active|需要进一步测试|
|src/style/00.css:1485|.settings-v26-pane|需要进一步测试|
|src/style/00.css:1486|.settings-v26-pane.active|需要进一步测试|
|src/style/00.css:1486|.icon-custom-grid|需要进一步测试|
|src/style/00.css:1487|.icon-custom-card|需要进一步测试|
|src/style/00.css:1488|.icon-preview|需要进一步测试|
|src/style/00.css:1489|.icon-preview img,.custom-ui-icon|需要进一步测试|
|src/style/00.css:1490|.custom-ui-icon|需要进一步测试|
|src/style/00.css:1491|/* ===== V2.8 程序样式确认弹窗 ===== */ .program-confirm-overlay|需要进一步测试|
|src/style/00.css:1500|.program-confirm-window|需要进一步测试|
|src/style/00.css:1508|.program-confirm-titlebar|需要进一步测试|
|src/style/00.css:1513|.program-confirm-body|需要进一步测试|
|src/style/00.css:1514|.program-confirm-icon|需要进一步测试|
|src/style/00.css:1519|.program-confirm-text|需要进一步测试|
|src/style/00.css:1520|.program-confirm-actions|需要进一步测试|
|src/style/00.css:1524|.program-confirm-actions button|需要进一步测试|
|src/style/00.css:1526|from|需要进一步测试|
|src/style/00.css:1526|to|需要进一步测试|
|src/style/00.css:1527|from|需要进一步测试|
|src/style/00.css:1527|to|需要进一步测试|
|src/style/00.css:1527|/* ===== V2.8.1 道具抽取结果：左图标 + 右名称 ===== */ .card-item-roulette|需要进一步测试|
|src/style/00.css:1535|.card-item-roulette .r-icon|需要进一步测试|
|src/style/00.css:1541|.card-item-roulette .r-icon>img|需要进一步测试|
|src/style/00.css:1544|.card-item-roulette .r-name|需要进一步测试|
|src/style/00.css:1556|.card-item-roulette .r-hint|需要进一步测试|
|src/style/00.css:1565|.card-item-roulette:before|需要进一步测试|
|src/style/00.css:1572|.card-item-roulette.reveal:before|需要进一步测试|
|src/style/00.css:1576|from|需要进一步测试|
|src/style/00.css:1577|55%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:1578|to|需要进一步测试|
|src/style/00.css:1581|.card-item-roulette|需要进一步测试|
|src/style/00.css:1582|.card-item-roulette .r-icon|需要进一步测试|
|src/style/00.css:1583|.card-item-roulette .r-name|需要进一步测试|
|src/style/00.css:1585|/* 举手抽取也采用横向结果语言 */ .hand-item-draw-stage.v281-horizontal|需要进一步测试|
|src/style/00.css:1593|.hand-item-draw-stage.v281-horizontal .hand-draw-head|需要进一步测试|
|src/style/00.css:1594|.hand-item-draw-stage.v281-horizontal .hand-item-capsule|需要进一步测试|
|src/style/00.css:1595|.hand-item-draw-stage.v281-horizontal .hand-draw-copy|需要进一步测试|
|src/style/00.css:1596|.hand-item-draw-stage.v281-horizontal .hand-item-draw-name|需要进一步测试|
|src/style/00.css:1597|.hand-item-draw-stage.v281-horizontal .hand-item-progress|需要进一步测试|
|src/style/00.css:1598|.hand-item-draw-stage.v281-horizontal .hand-item-result-actions|需要进一步测试|
|src/style/00.css:1599|/* ===== V2.8.2：修正轮盘光环定位 ===== */ .card-item-roulette|需要进一步测试|
|src/style/00.css:1603|.card-item-roulette:before|需要进一步测试|
|src/style/00.css:1610|.card-item-roulette .r-icon|需要进一步测试|
|src/style/00.css:1611|.card-item-roulette .r-name|需要进一步测试|
|src/style/00.css:1613|.card-item-roulette:before|需要进一步测试|
|src/style/00.css:1618|/* 新增四种道具的卡片发动色彩 */ .group-row-card.cfx-feather|需要进一步测试|
|src/style/00.css:1621|.group-row-card.cfx-fireflower|需要进一步测试|
|src/style/00.css:1622|.group-row-card.cfx-iceflower|需要进一步测试|
|src/style/00.css:1623|.group-row-card.cfx-boomerang|需要进一步测试|
|src/style/00.css:1625|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:1625|22%|需要进一步测试|
|src/style/00.css:1625|55%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:1626|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:1626|18%|需要进一步测试|
|src/style/00.css:1626|42%|需要进一步测试|
|src/style/00.css:1627|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:1627|18%|需要进一步测试|
|src/style/00.css:1627|50%|需要进一步测试|
|src/style/00.css:1628|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:1628|20%|需要进一步测试|
|src/style/00.css:1628|42%|需要进一步测试|
|src/style/00.css:1628|/* V2.8.3 新增道具在上帝模式中的按钮布局 */ .item-admin-add-v283|需要进一步测试|
|src/style/00.css:1632|.item-admin-add-v283 img|需要进一步测试|
|src/style/00.css:1633|.encyclopedia-item img|需要进一步测试|
|src/style/00.css:1634|/* ===== V2.8.4 统一 26 道具设置 UI ===== */ .v283-added|需要进一步测试|
|src/style/00.css:1638|/* 移除 V2.8.3 那四个孤零零追加到功能页的临时行 */  /* 设置页道具卡统一网格，不再把新增四项塞在顶部 */ #v2ItemEncyclopedia .item-ency-grid|需要进一步测试|
|src/style/00.css:1645|#v2ItemEncyclopedia .ency-card|需要进一步测试|
|src/style/00.css:1652|#v2ItemEncyclopedia .ency-icon img|需要进一步测试|
|src/style/00.css:1653|/* 上帝模式管理区必须自己滚动，不能把整个窗口撑成截图里那条细缝 */ .god-item-tools|需要进一步测试|
|src/style/00.css:1656|.god-item-grid|需要进一步测试|
|src/style/00.css:1665|.god-item-grid .btn|需要进一步测试|
|src/style/00.css:1669|#itemWindow,.item-window,.group-control-window,.group-modal-window|需要进一步测试|
|src/style/00.css:1674|#itemWindowBody,.item-window-body|需要进一步测试|
|src/style/00.css:1677|.item-window-tabs,.group-control-tabs|需要进一步测试|
|src/style/00.css:1686|.item-window-tabs button,.group-control-tabs button|需要进一步测试|
|src/style/00.css:1693|.vista-window:has(#itemWindowBody)|需要进一步测试|
|src/style/00.css:1696|.vista-window:has(#itemWindowBody) #itemWindowBody|需要进一步测试|
|src/style/00.css:1704|#view-settings .settings-scroll|需要进一步测试|
|src/style/00.css:1707|#view-settings .settings-v26-tabs,#view-settings .settings-tabs-v26,#view-settings #settingsV2Tabs|需要进一步测试|
|src/style/00.css:1711|#v2ItemEncyclopedia .item-ency-grid|需要进一步测试|
|src/style/00.css:1713|/* ===== V2.9.1 共产主义模式（道具系统总开关） ===== */ body.items-disabled .item-slot, body.items-disabled .item-bar, body.items-disabled .item-inventory, body.items-disabled .item-draw-spinning, body.items-disabled .card-item-roulette, body.items-disabled .god-item-tools, body.items-disabled .item-defense-toast, body.items-disabled #v2ItemPane, body.items-disabled [data-sp="items"], body.items-disabled [data-about="items"], body.items-disabled #itemWindowTabItems, body.items-disabled [data-item-feature], body.items-disabled .item-feature-only|需要进一步测试|
|src/style/00.css:1732|body.items-disabled .group-row-card|需要进一步测试|
|src/style/00.css:1733|/* ===== V2.9.2 设置：共产主义模式真正归入“功能设置” ===== */ .communism-mode-card|需要进一步测试|
|src/style/00.css:1743|.communism-mode-copy|需要进一步测试|
|src/style/00.css:1744|.communism-mode-title|需要进一步测试|
|src/style/00.css:1745|.v292-switch|需要进一步测试|
|src/style/00.css:1746|.v292-switch input|需要进一步测试|
|src/style/00.css:1747|.v292-switch-track|需要进一步测试|
|src/style/00.css:1753|.v292-switch-knob|需要进一步测试|
|src/style/00.css:1758|.v292-switch input:checked+.v292-switch-track|需要进一步测试|
|src/style/00.css:1762|.v292-switch input:checked+.v292-switch-track .v292-switch-knob|需要进一步测试|
|src/style/00.css:1763|/* ===== V2.9.3 单栏模式分数显示修复 =====    单栏卡片仍保持原高度。分数在单栏时脱离底部按钮行，    固定放到卡片右侧中部，避免被 A/B/C/D、All In 和更多按钮挤到 0 宽。 */ .group-list[data-column-mode="single"] .group-row-card|需要进一步测试|
|src/style/00.css:1771|.group-list[data-column-mode="single"] .group-row-card .action-score-col|需要进一步测试|
|src/style/00.css:1785|.group-list[data-column-mode="single"] .group-row-card .row-score|需要进一步测试|
|src/style/00.css:1799|.group-list[data-column-mode="single"] .group-row-card .score-input|需要进一步测试|
|src/style/00.css:1804|.group-list[data-column-mode="single"] .group-row-card .card-action-row|需要进一步测试|
|src/style/00.css:1808|/* 右侧给分数预留空间，底部操作按钮仍按原卡片尺寸排列 */ .group-list[data-column-mode="single"] .group-row-card .action-controls-col|需要进一步测试|
|src/style/00.css:1816|.group-list[data-column-mode="single"] .group-row-card .action-score-col|需要进一步测试|
|src/style/00.css:1822|.group-list[data-column-mode="single"] .group-row-card .row-score|需要进一步测试|
|src/style/00.css:1826|/* 多列模式继续使用 V2.9.2 的行内布局，不受本次修复影响 */   /* ===== V2.9.4 大数显示优化 ===== */  /* 条形图：数字单独占固定列，绝不再把分数挤成竖排。 */ .chart-row|需要进一步测试|
|src/style/00.css:1838|.chart-row .chart-rank, .chart-row .chart-name, .chart-row .chart-score|需要进一步测试|
|src/style/00.css:1843|.chart-row .chart-score|需要进一步测试|
|src/style/00.css:1857|.chart-row .chart-track|需要进一步测试|
|src/style/00.css:1861|/* 如果旧布局不是 grid，仍强制最后的数字保持水平。 */ .chart-score|需要进一步测试|
|src/style/00.css:1870|/* 小组卡：保证 7 位整数完整显示。    7 位以内不给 ellipsis；8 位以上才允许逐级缩小/省略。 */ .group-row-card .row-score|需要进一步测试|
|src/style/00.css:1877|.group-row-card .action-score-col|需要进一步测试|
|src/style/00.css:1880|/* 多列卡片为右侧按钮保留空间，同时确保 7 位数字区域。 */ .group-list:not([data-column-mode="single"]) .group-row-card .action-score-col|需要进一步测试|
|src/style/00.css:1888|.group-list:not([data-column-mode="single"]) .group-row-card .row-score|需要进一步测试|
|src/style/00.css:1893|/* 单栏模式空间充足，至少给 7 位数约 10ch 的显示区。 */ .group-list[data-column-mode="single"] .group-row-card .action-score-col|需要进一步测试|
|src/style/00.css:1900|.group-list[data-column-mode="single"] .group-row-card .row-score|需要进一步测试|
|src/style/00.css:1907|.group-list:not([data-column-mode="single"]) .group-row-card .row-score|需要进一步测试|
|src/style/00.css:1914|.group-row-card .action-score-col|需要进一步测试|
|src/style/00.css:1917|.group-row-card .row-score|需要进一步测试|
|src/style/00.css:1922|/* 2) 单栏模式：取消手机媒体查询把操作行纵向堆叠造成的巨大空白。    单栏卡片重新压到紧凑高度，名称/分数放大，但不改变多列模式。 */ .group-list[data-column-mode="single"]|需要进一步测试|
|src/style/00.css:1929|.group-list[data-column-mode="single"] .group-row-card|需要进一步测试|
|src/style/00.css:1938|.group-list[data-column-mode="single"] .group-row-card .card-header-row|需要进一步测试|
|src/style/00.css:1943|.group-list[data-column-mode="single"] .group-row-card .header-name-col|需要进一步测试|
|src/style/00.css:1946|.group-list[data-column-mode="single"] .group-row-card .name-input|需要进一步测试|
|src/style/00.css:1953|.group-list[data-column-mode="single"] .group-row-card .header-meta-col|需要进一步测试|
|src/style/00.css:1956|/* 道具槽紧凑排列，不再把卡片中间撑出一大片空白 */ .group-list[data-column-mode="single"] .group-row-card .item-row, .group-list[data-column-mode="single"] .group-row-card .item-slots-row, .group-list[data-column-mode="single"] .group-row-card .inventory-row|需要进一步测试|
|src/style/00.css:1965|.group-list[data-column-mode="single"] .group-row-card .item-slot|需要进一步测试|
|src/style/00.css:1971|/* 分数回到底部操作行左侧，不再漂在卡片中部。    这样单栏会更紧凑，而且能给分数更大的字号。 */ .group-list[data-column-mode="single"] .group-row-card .card-action-row|需要进一步测试|
|src/style/00.css:1983|.group-list[data-column-mode="single"] .group-row-card .action-score-col|需要进一步测试|
|src/style/00.css:1993|.group-list[data-column-mode="single"] .group-row-card .row-score|需要进一步测试|
|src/style/00.css:2005|.group-list[data-column-mode="single"] .group-row-card .score-input|需要进一步测试|
|src/style/00.css:2011|/* 右侧答案/All In/更多保持一行，永远不被分数挤掉 */ .group-list[data-column-mode="single"] .group-row-card .action-controls-col|需要进一步测试|
|src/style/00.css:2024|.group-list[data-column-mode="single"] .group-row-card .opt-btn, .group-list[data-column-mode="single"] .group-row-card .allin-toggle-btn, .group-list[data-column-mode="single"] .group-row-card .more-btn|需要进一步测试|
|src/style/00.css:2032|.group-list[data-column-mode="single"] .group-row-card|需要进一步测试|
|src/style/00.css:2036|.group-list[data-column-mode="single"] .group-row-card .card-action-row|需要进一步测试|
|src/style/00.css:2041|.group-list[data-column-mode="single"] .group-row-card .action-controls-col|需要进一步测试|
|src/style/00.css:2046|.group-list[data-column-mode="single"] .group-row-card .name-input|需要进一步测试|
|src/style/00.css:2049|.group-list[data-column-mode="single"] .group-row-card .row-score|需要进一步测试|
|src/style/00.css:2056|.group-list[data-column-mode="single"] .group-row-card|需要进一步测试|
|src/style/00.css:2060|.group-list[data-column-mode="single"] .group-row-card .name-input|需要进一步测试|
|src/style/00.css:2063|.group-list[data-column-mode="single"] .group-row-card .row-score|需要进一步测试|
|src/style/00.css:2066|.group-list[data-column-mode="single"] .group-row-card .card-action-row|需要进一步测试|
|src/style/00.css:2070|#groupList.group-list[data-column-mode="single"]|需要进一步测试|
|src/style/00.css:2073|#groupList.group-list[data-column-mode="single"] > .group-row-card|需要进一步测试|
|src/style/00.css:2074|#groupList.group-list[data-column-mode="single"] > .group-row-card .card-header-row|需要进一步测试|
|src/style/00.css:2075|#groupList.group-list[data-column-mode="single"] > .group-row-card .name-input|需要进一步测试|
|src/style/00.css:2076|#groupList.group-list[data-column-mode="single"] > .group-row-card .item-slots|需要进一步测试|
|src/style/00.css:2077|#groupList.group-list[data-column-mode="single"] > .group-row-card .item-slot|需要进一步测试|
|src/style/00.css:2078|#groupList.group-list[data-column-mode="single"] > .group-row-card .card-action-row|需要进一步测试|
|src/style/00.css:2079|#groupList.group-list[data-column-mode="single"] > .group-row-card .action-score-col|需要进一步测试|
|src/style/00.css:2080|#groupList.group-list[data-column-mode="single"] > .group-row-card .row-score|需要进一步测试|
|src/style/00.css:2081|#groupList.group-list[data-column-mode="single"] > .group-row-card .action-controls-col|需要进一步测试|
|src/style/00.css:2083|#groupList.group-list[data-column-mode="single"] > .group-row-card|需要进一步测试|
|src/style/00.css:2084|#groupList.group-list[data-column-mode="single"] > .group-row-card .name-input|需要进一步测试|
|src/style/00.css:2085|#groupList.group-list[data-column-mode="single"] > .group-row-card .row-score|需要进一步测试|
|src/style/00.css:2086|#groupList.group-list[data-column-mode="single"] > .group-row-card .card-action-row|需要进一步测试|
|src/style/00.css:2087|#groupList.group-list[data-column-mode="single"] > .group-row-card .action-controls-col|需要进一步测试|
|src/style/00.css:2089|/* ===== V2.11.3：巨大蘑菇持续状态 · 橙色发光 ===== */ .group-row-card.effect-mega|需要进一步测试|
|src/style/00.css:2097|from|需要进一步测试|
|src/style/00.css:2104|to|需要进一步测试|
|src/style/00.css:2112|/* ===== V2.11.4：作答选中 / All In 可读性 + 冰冻蓝色发光 ===== */ /* 普通扁平模式：选中后必须真的改变按钮底色，而不是只把字变白。 */ .group-row-card .opt-btn.active:not(.correct):not(.wrong)|需要进一步测试|
|src/style/00.css:2124|.group-row-card .allin-toggle-btn.active|需要进一步测试|
|src/style/00.css:2134|/* 冰之花冻结：冻结期间整张小组卡片持续蓝色脉冲发光。 */ .group-row-card.effect-ice|需要进一步测试|
|src/style/00.css:2140|from|需要进一步测试|
|src/style/00.css:2147|to|需要进一步测试|
|src/style/00.css:2155|/* ===== V2.11.6：不同攻击拥有不同受击动画 ===== */ .group-row-card[class*="hit-"]|需要进一步测试|
|src/style/00.css:2163|.group-row-card[class*="hit-"]::after|需要进一步测试|
|src/style/00.css:2171|.attack-hit-badge-v2116|需要进一步测试|
|src/style/00.css:2191|.attack-hit-badge-v2116 span|需要进一步测试|
|src/style/00.css:2193|0%|需要进一步测试|
|src/style/00.css:2194|16%|需要进一步测试|
|src/style/00.css:2195|72%|需要进一步测试|
|src/style/00.css:2196|100%|需要进一步测试|
|src/style/00.css:2198|/* 绿龟壳：绿色横向冲撞 */ .group-row-card.hit-green-shell|需要进一步测试|
|src/style/00.css:2201|.group-row-card.hit-green-shell::after|需要进一步测试|
|src/style/00.css:2203|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:2203|12%|需要进一步测试|
|src/style/00.css:2203|24%|需要进一步测试|
|src/style/00.css:2203|36%|需要进一步测试|
|src/style/00.css:2203|48%|需要进一步测试|
|src/style/00.css:2204|0%,100%|需要进一步测试|
|src/style/00.css:2204|12%,42%|需要进一步测试|
|src/style/00.css:2204|70%|需要进一步测试|
|src/style/00.css:2204|/* 红龟壳：红色锁定脉冲 */ .group-row-card.hit-red-shell|需要进一步测试|
|src/style/00.css:2207|.group-row-card.hit-red-shell::after|需要进一步测试|
|src/style/00.css:2209|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:2209|18%|需要进一步测试|
|src/style/00.css:2209|32%|需要进一步测试|
|src/style/00.css:2210|0%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:2210|12%|需要进一步测试|
|src/style/00.css:2210|30%|需要进一步测试|
|src/style/00.css:2210|46%|需要进一步测试|
|src/style/00.css:2210|100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:2210|/* 刺龟壳：蓝色重击爆闪 */ .group-row-card.hit-spiny|需要进一步测试|
|src/style/00.css:2213|.group-row-card.hit-spiny::after|需要进一步测试|
|src/style/00.css:2215|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:2215|14%|需要进一步测试|
|src/style/00.css:2215|25%|需要进一步测试|
|src/style/00.css:2215|38%|需要进一步测试|
|src/style/00.css:2216|0%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:2216|10%|需要进一步测试|
|src/style/00.css:2216|25%|需要进一步测试|
|src/style/00.css:2216|38%|需要进一步测试|
|src/style/00.css:2216|100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:2216|/* 香蕉：黄色打滑倾斜 */ .group-row-card.hit-banana|需要进一步测试|
|src/style/00.css:2219|.group-row-card.hit-banana::after|需要进一步测试|
|src/style/00.css:2221|0%,100%|需要进一步测试|
|src/style/00.css:2221|20%|需要进一步测试|
|src/style/00.css:2221|34%|需要进一步测试|
|src/style/00.css:2221|50%|需要进一步测试|
|src/style/00.css:2222|0%|需要进一步测试|
|src/style/00.css:2222|25%|需要进一步测试|
|src/style/00.css:2222|100%|需要进一步测试|
|src/style/00.css:2222|/* 超级喇叭：橙色向外冲击波 */ .group-row-card.hit-horn|需要进一步测试|
|src/style/00.css:2225|.group-row-card.hit-horn::after|需要进一步测试|
|src/style/00.css:2227|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:2227|20%|需要进一步测试|
|src/style/00.css:2227|36%|需要进一步测试|
|src/style/00.css:2228|0%|需要进一步测试|
|src/style/00.css:2228|18%|需要进一步测试|
|src/style/00.css:2228|70%|需要进一步测试|
|src/style/00.css:2228|100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:2228|/* 炸弹兵：橙黑爆炸 */ .group-row-card.hit-bomb-v2116|需要进一步测试|
|src/style/00.css:2231|.group-row-card.hit-bomb-v2116::after|需要进一步测试|
|src/style/00.css:2233|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:2233|13%|需要进一步测试|
|src/style/00.css:2233|25%|需要进一步测试|
|src/style/00.css:2233|37%|需要进一步测试|
|src/style/00.css:2234|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:2234|12%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:2234|30%|需要进一步测试|
|src/style/00.css:2234|/* 锤子：灰色垂直砸击 */ .group-row-card.hit-hammer|需要进一步测试|
|src/style/00.css:2237|.group-row-card.hit-hammer::after|需要进一步测试|
|src/style/00.css:2239|0%,100%|需要进一步测试|
|src/style/00.css:2239|16%|需要进一步测试|
|src/style/00.css:2239|30%|需要进一步测试|
|src/style/00.css:2240|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:2240|14%|需要进一步测试|
|src/style/00.css:2240|45%|需要进一步测试|
|src/style/00.css:2240|/* 火之花：橙红灼烧 */ .group-row-card.hit-fire|需要进一步测试|
|src/style/00.css:2243|.group-row-card.hit-fire::after|需要进一步测试|
|src/style/00.css:2245|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:2245|20%|需要进一步测试|
|src/style/00.css:2245|42%|需要进一步测试|
|src/style/00.css:2246|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:2246|15%,45%|需要进一步测试|
|src/style/00.css:2246|/* 冰之花：青蓝结霜 */ .group-row-card.hit-ice|需要进一步测试|
|src/style/00.css:2249|.group-row-card.hit-ice::after|需要进一步测试|
|src/style/00.css:2251|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:2251|18%|需要进一步测试|
|src/style/00.css:2251|55%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:2252|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:2252|16%|需要进一步测试|
|src/style/00.css:2252|60%|需要进一步测试|
|src/style/00.css:2252|/* 回旋镖：蓝色左右扫过 */ .group-row-card.hit-boomerang|需要进一步测试|
|src/style/00.css:2255|.group-row-card.hit-boomerang::after|需要进一步测试|
|src/style/00.css:2257|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:2257|16%|需要进一步测试|
|src/style/00.css:2257|30%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:2257|44%|需要进一步测试|
|src/style/00.css:2258|0%|需要进一步测试|
|src/style/00.css:2258|20%|需要进一步测试|
|src/style/00.css:2258|55%|需要进一步测试|
|src/style/00.css:2258|100%|需要进一步测试|
|src/style/00.css:2258|/* 闪电：强烈黄白劈击，明显区别于所有普通碰撞 */ .group-row-card.hit-lightning|需要进一步测试|
|src/style/00.css:2261|.group-row-card.hit-lightning::after|需要进一步测试|
|src/style/00.css:2263|0%,12%,24%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:2263|6%,18%|需要进一步测试|
|src/style/00.css:2264|0%,100%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:2264|5%|需要进一步测试|
|src/style/00.css:2264|13%|需要进一步测试|
|src/style/00.css:2264|20%|重复实现（仅语法；层叠需进一步测试）|
|src/style/00.css:2264|45%|需要进一步测试|
|src/style/00.css:2264|/* 未单独设计的攻击仍有统一红色冲击兜底。 */ .group-row-card.hit-generic-v2116|需要进一步测试|
|src/style/00.css:2267|.group-row-card.hit-generic-v2116::after|需要进一步测试|
|src/style/00.css:2268|/* ===== V2.12.0：主要 / 次要道具队列 UI ===== */ .queue-help-v2120|需要进一步测试|
|src/style/00.css:2283|.queue-help-v2120 b|需要进一步测试|
|src/style/00.css:2284|.queue-help-v2120 span|需要进一步测试|
|src/style/00.css:2285|.queue-inventory-grid-v2120|需要进一步测试|
|src/style/00.css:2289|.queue-item-card|需要进一步测试|
|src/style/00.css:2294|.queue-role-badge|需要进一步测试|
|src/style/00.css:2305|.queue-main-card|需要进一步测试|
|src/style/00.css:2309|.queue-main-card .queue-role-badge|需要进一步测试|
|src/style/00.css:2314|.queue-secondary-card|需要进一步测试|
|src/style/00.css:2320|.queue-secondary-card .queue-role-badge|需要进一步测试|
|src/style/00.css:2325|.queue-secondary-lock|需要进一步测试|
|src/style/00.css:2332|.queue-persistent-active|需要进一步测试|
|src/style/00.css:2335|.queue-negative-note-v2120|需要进一步测试|
|src/style/00.css:2340|/* 比赛卡片中的紧凑队列槽 */ .item-slot.queue-main-slot, .item-slot.queue-secondary-slot|需要进一步测试|
|src/style/00.css:2347|.item-slot .queue-slot-role|需要进一步测试|
|src/style/00.css:2364|.item-slot.queue-main-slot|需要进一步测试|
|src/style/00.css:2369|.item-slot.queue-main-slot .queue-slot-role|需要进一步测试|
|src/style/00.css:2373|.item-slot.queue-secondary-slot|需要进一步测试|
|src/style/00.css:2378|.item-slot.queue-secondary-slot .queue-slot-role|需要进一步测试|
|src/style/00.css:2383|.item-slot.queue-persistent-active|需要进一步测试|
|src/style/00.css:2387|.queue-empty-plus|需要进一步测试|
|src/style/00.css:2388|.item-slot.queue-promoted|需要进一步测试|
|src/style/00.css:2393|0%|需要进一步测试|
|src/style/00.css:2394|38%|需要进一步测试|
|src/style/00.css:2395|100%|需要进一步测试|
|src/style/00.css:2397|/* V2.12.1 内置道具 PNG */ .item-slot img,.item-big-icon img,.r-icon img,.hand-item-capsule img, .god-item-grid img,.item-admin-add-v283 img,.card-fx-badge img,.roulette img|需要进一步测试|
|src/style/00.css:2403|.item-slot img|需要进一步测试|
|src/style/00.css:2404|.item-big-icon img|需要进一步测试|
|src/style/00.css:2405|.r-icon img,.hand-item-capsule img|需要进一步测试|
|src/style/00.css:2406|.god-item-grid img,.item-admin-add-v283 img|需要进一步测试|
|src/style/00.css:2407|.roulette img|需要进一步测试|
|src/style/01.css:1|/* ===== V2.13.0：百科横向布局 + 小组卡片重构 + 持续状态光效 ===== */ /* 百科：固定圆底 + 固定大小图标，彻底禁止原 PNG 撑爆布局 */ .item-ency-grid|需要进一步测试|
|src/style/01.css:5|.ency-card|需要进一步测试|
|src/style/01.css:6|.ency-v213-card|需要进一步测试|
|src/style/01.css:12|.ency-v213-icon-disc|需要进一步测试|
|src/style/01.css:18|.ency-v213-icon-disc img,.ency-v213-img|需要进一步测试|
|src/style/01.css:19|.ency-v213-info|需要进一步测试|
|src/style/01.css:20|.ency-v213-name|需要进一步测试|
|src/style/01.css:20|.ency-v213-desc|需要进一步测试|
|src/style/01.css:21|.ency-v213-actions|需要进一步测试|
|src/style/01.css:23|.ency-v213-card|需要进一步测试|
|src/style/01.css:24|.ency-v213-icon-disc|需要进一步测试|
|src/style/01.css:25|.ency-v213-icon-disc img,.ency-v213-img|需要进一步测试|
|src/style/01.css:25|.ency-v213-actions|需要进一步测试|
|src/style/01.css:27|/* 卡片整体尺寸不扩大，只重新分配信息优先级 */ .group-row-card.v213-card|需要进一步测试|
|src/style/01.css:30|.v213-card .card-header-row|需要进一步测试|
|src/style/01.css:31|.v213-number|需要进一步测试|
|src/style/01.css:36|.v213-name-wrap|需要进一步测试|
|src/style/01.css:37|.v213-name|需要进一步测试|
|src/style/01.css:37|.v213-name-sub|需要进一步测试|
|src/style/01.css:38|.v213-card .item-slots|需要进一步测试|
|src/style/01.css:39|.v213-card .item-slot|需要进一步测试|
|src/style/01.css:40|.v213-card .queue-main-slot|需要进一步测试|
|src/style/01.css:41|.v213-card .queue-main-slot img|需要进一步测试|
|src/style/01.css:42|.v213-card .queue-secondary-slot|需要进一步测试|
|src/style/01.css:43|.v213-card .queue-secondary-slot img|需要进一步测试|
|src/style/01.css:44|.v213-card .queue-slot-role|需要进一步测试|
|src/style/01.css:45|.v213-card .queue-secondary-slot .queue-slot-role|需要进一步测试|
|src/style/01.css:46|.v213-card .charges|需要进一步测试|
|src/style/01.css:47|.v213-score-wrap|需要进一步测试|
|src/style/01.css:48|.v213-card .row-score|需要进一步测试|
|src/style/01.css:48|.v213-card .more-btn|需要进一步测试|
|src/style/01.css:49|.v213-card .card-action-row|需要进一步测试|
|src/style/01.css:50|.v213-result|需要进一步测试|
|src/style/01.css:51|.v213-card .action-controls-col|需要进一步测试|
|src/style/01.css:52|.v213-card .opt-group|需要进一步测试|
|src/style/01.css:52|.v213-card .opt-btn|需要进一步测试|
|src/style/01.css:53|.v213-card .allin-toggle-btn|需要进一步测试|
|src/style/01.css:54|.v213-card .result-msg-box|需要进一步测试|
|src/style/01.css:55|/* 排序 FLIP 动画由 JS 写入 transform；默认时长与开始答题、道具重排保持一致。 */ .group-row-card.v213-card|需要进一步测试|
|src/style/01.css:57|/* 持续状态改成独立光环层，不再与一次性道具动画争夺 animation 属性 */ .group-row-card.effect-star,.group-row-card.effect-mega|需要进一步测试|
|src/style/01.css:60|.persistent-aura-v213|需要进一步测试|
|src/style/01.css:61|.persistent-aura-v213.aura-star|需要进一步测试|
|src/style/01.css:62|.persistent-aura-v213.aura-mega|需要进一步测试|
|src/style/01.css:63|.persistent-aura-v213.aura-power|需要进一步测试|
|src/style/01.css:64|.persistent-aura-v213.aura-ice|需要进一步测试|
|src/style/01.css:66|0%|需要进一步测试|
|src/style/01.css:66|50%|需要进一步测试|
|src/style/01.css:66|100%|需要进一步测试|
|src/style/01.css:67|from|需要进一步测试|
|src/style/01.css:67|to|需要进一步测试|
|src/style/01.css:68|from|需要进一步测试|
|src/style/01.css:68|to|需要进一步测试|
|src/style/01.css:69|from|需要进一步测试|
|src/style/01.css:69|to|需要进一步测试|
|src/style/01.css:69|body.items-disabled .v213-card .item-slots|需要进一步测试|
|src/style/01.css:71|body.items-disabled .v213-card .card-header-row|需要进一步测试|
|src/style/01.css:74|.group-row-card.v213-card|需要进一步测试|
|src/style/01.css:75|.v213-card .card-header-row|需要进一步测试|
|src/style/01.css:76|.v213-number|需要进一步测试|
|src/style/01.css:77|.v213-name|需要进一步测试|
|src/style/01.css:77|.v213-name-sub|需要进一步测试|
|src/style/01.css:77|.v213-card .queue-main-slot|需要进一步测试|
|src/style/01.css:78|.v213-card .queue-main-slot img|需要进一步测试|
|src/style/01.css:78|.v213-card .queue-secondary-slot|需要进一步测试|
|src/style/01.css:79|.v213-card .queue-secondary-slot img|需要进一步测试|
|src/style/01.css:79|.v213-score-wrap|需要进一步测试|
|src/style/01.css:80|.v213-card .row-score|需要进一步测试|
|src/style/01.css:80|.v213-card .opt-btn|需要进一步测试|
|src/style/01.css:81|.v213-card .allin-toggle-btn|需要进一步测试|
|src/style/01.css:84|0%,100%|需要进一步测试|
|src/style/01.css:84|50%|需要进一步测试|
|src/style/02.css:1|/* ===== V2.17：唯一启用的青绿珊瑚扁平主题 ===== */ :root|需要进一步测试|
|src/style/02.css:6|html|需要进一步测试|
|src/style/02.css:11|body.modern-flat-v217|需要进一步测试|
|src/style/02.css:19|body.modern-flat-v217 *,body.modern-flat-v217 *::before,body.modern-flat-v217 *::after|需要进一步测试|
|src/style/02.css:22|body.modern-flat-v217 .view,body.modern-flat-v217 .main-viewport, body.modern-flat-v217 #view-battle,body.modern-flat-v217 #view-history, body.modern-flat-v217 #view-archives,body.modern-flat-v217 #view-settings|需要进一步测试|
|src/style/02.css:27|body.modern-flat-v217 #groupList|需要进一步测试|
|src/style/02.css:28|/* 顶栏、底栏与稳定布局 */ body.modern-flat-v217 .app-topnav|需要进一步测试|
|src/style/02.css:36|body.modern-flat-v217 .app-topnav .header-title|需要进一步测试|
|src/style/02.css:37|body.modern-flat-v217 .app-topnav .header-title small,body.modern-flat-v217 .app-topnav .header-stats|需要进一步测试|
|src/style/02.css:38|body.modern-flat-v217 .app-topnav .nav-tabs|需要进一步测试|
|src/style/02.css:39|body.modern-flat-v217 .app-topnav .header-stats|需要进一步测试|
|src/style/02.css:40|body.modern-flat-v217 .bottom-dock|需要进一步测试|
|src/style/02.css:42|body.modern-flat-v217 .bottom-dock|需要进一步测试|
|src/style/02.css:43|body.modern-flat-v217 .dock-left|需要进一步测试|
|src/style/02.css:44|body.modern-flat-v217 .dock-right|需要进一步测试|
|src/style/02.css:45|body.modern-flat-v217 .bottom-dock .btn|需要进一步测试|
|src/style/02.css:47|/* 统一窗口尺寸：窗口自适应内容，只有主体区域滚动。 */ body.modern-flat-v217 .score-modal-backdrop,body.modern-flat-v217 .modal-overlay, body.modern-flat-v217 .member-search-backdrop,body.modern-flat-v217 .item-modal-backdrop, body.modern-flat-v217 .classroom-backdrop,body.modern-flat-v217 .about-backdrop|需要进一步测试|
|src/style/02.css:54|body.modern-flat-v217 .score-modal-card,body.modern-flat-v217 .program-confirm-window, body.modern-flat-v217 #pwdModal .modal-box,body.modern-flat-v217 #settlementNameModal .modal-box|需要进一步测试|
|src/style/02.css:58|body.modern-flat-v217 .member-search-card,body.modern-flat-v217 #batchImportModal .modal-box, body.modern-flat-v217 .modal-box.large|需要进一步测试|
|src/style/02.css:62|body.modern-flat-v217 .item-window,body.modern-flat-v217 .about-window,body.modern-flat-v217 .classroom-window, body.modern-flat-v217 .item-draw-board|需要进一步测试|
|src/style/02.css:66|body.modern-flat-v217 .item-window|需要进一步测试|
|src/style/02.css:67|body.modern-flat-v217 #pickerModal .modal-box|需要进一步测试|
|src/style/02.css:68|body.modern-flat-v217 .item-draw-board|需要进一步测试|
|src/style/02.css:69|body.modern-flat-v217 .about-main, body.modern-flat-v217 .classroom-body,body.modern-flat-v217 #itemWindowBody|需要进一步测试|
|src/style/02.css:73|body.modern-flat-v217:has(.modal-overlay.active:not([data-native-detached])),body.modern-flat-v217:has(.score-modal-backdrop.active:not([data-native-detached])), body.modern-flat-v217:has(.item-modal-backdrop.active:not([data-native-detached])),body.modern-flat-v217:has(.classroom-backdrop.active:not([data-native-detached])), body.modern-flat-v217:has(.about-backdrop.active:not([data-native-detached])),body.modern-flat-v217:has(.member-search-backdrop.active:not([data-native-detached]))|需要进一步测试|
|src/style/02.css:76|/* 卡片、面板和弹窗 */ body.modern-flat-v217 .chart-container,body.modern-flat-v217 .dashboard-summary-container, body.modern-flat-v217 .quick-batch-bar,body.modern-flat-v217 .fullview-header, body.modern-flat-v217 .fullview-body,body.modern-flat-v217 .settings-scroll:not(.ui-settings-host), body.modern-flat-v217 .welcome-card,body.modern-flat-v217 .history-card, body.modern-flat-v217 .archive-card,body.modern-flat-v217 .setting-card, body.modern-flat-v217 .setting-item,body.modern-flat-v217 .setting-row, body.modern-flat-v217 .guide-block,body.modern-flat-v217 .ency-card, body.modern-flat-v217 .ency-v213-card,body.modern-flat-v217 .sound-setting-card, body.modern-flat-v217 .icon-setting-card,body.modern-flat-v217 .trim-row, body.modern-flat-v217 .history-item,body.modern-flat-v217 .hist-card, body.modern-flat-v217 .setting-section,body.modern-flat-v217 .settings-card, body.modern-flat-v217 .stat-card,body.modern-flat-v217 .sound-row, body.modern-flat-v217 .communism-mode-card,body.modern-flat-v217 .item-card|需要进一步测试|
|src/style/02.css:94|body.modern-flat-v217 .group-row-card:not(.card-use-fx):not(.card-hit-fx):not(.card-defend-fx):not(.card-heal-fx)|需要进一步测试|
|src/style/02.css:99|body.modern-flat-v217 .group-row-card:not(.card-use-fx):not(.card-hit-fx):hover|需要进一步测试|
|src/style/02.css:100|body.modern-flat-v217 .modal-box,body.modern-flat-v217 .score-modal-card, body.modern-flat-v217 .member-search-card,body.modern-flat-v217 .vista-window, body.modern-flat-v217 .item-window,body.modern-flat-v217 .picker-window, body.modern-flat-v217 .picker-modal,body.modern-flat-v217 .about-window, body.modern-flat-v217 .classroom-window,body.modern-flat-v217 .hand-window, body.modern-flat-v217 .item-draw-board,body.modern-flat-v217 .welcome-modal-card|需要进一步测试|
|src/style/02.css:109|body.modern-flat-v217 .modal-overlay,body.modern-flat-v217 .score-modal-backdrop, body.modern-flat-v217 .member-search-backdrop,body.modern-flat-v217 .welcome-modal, body.modern-flat-v217 .item-modal-backdrop,body.modern-flat-v217 .item-draw-overlay, body.modern-flat-v217 .classroom-backdrop,body.modern-flat-v217 .about-backdrop|需要进一步测试|
|src/style/02.css:115|body.modern-flat-v217 .item-side,body.modern-flat-v217 .about-side, body.modern-flat-v217 .picker-left-v2,body.modern-flat-v217 .picker-center-v2, body.modern-flat-v217 .picker-right-v2,body.modern-flat-v217 .classroom-head, body.modern-flat-v217 .about-head,body.modern-flat-v217 .settings-v2-tabs, body.modern-flat-v217 .settings-v26-tabs,body.modern-flat-v217 .item-sidebar, body.modern-flat-v217 .item-tabs,body.modern-flat-v217 .about-tabs, body.modern-flat-v217 .window-titlebar|需要进一步测试|
|src/style/02.css:124|/* 按钮和交互状态 */ body.modern-flat-v217 .btn,body.modern-flat-v217 .nav-tab,body.modern-flat-v217 .icon-btn, body.modern-flat-v217 .more-btn,body.modern-flat-v217 .opt-btn,body.modern-flat-v217 .ans-btn, body.modern-flat-v217 .allin-toggle-btn,body.modern-flat-v217 .item-tab, body.modern-flat-v217 .picker-vtab,body.modern-flat-v217 .picker-info-tabs button, body.modern-flat-v217 .settings-v2-tabs button,body.modern-flat-v217 .settings-v26-tabs button, body.modern-flat-v217 .item-global-btn,body.modern-flat-v217 .hand-group|需要进一步测试|
|src/style/02.css:136|body.modern-flat-v217 .btn:not(.btn-primary):not(.btn-success):not(.btn-warning):not(.btn-danger):not(:disabled):hover, body.modern-flat-v217 .nav-tab:not(.active):not(:disabled):hover, body.modern-flat-v217 .icon-btn:not(:disabled):hover, body.modern-flat-v217 .more-btn:not(:disabled):hover, body.modern-flat-v217 .ans-btn:not(.selected):not(:disabled):hover|需要进一步测试|
|src/style/02.css:141|body.modern-flat-v217 .nav-tab.active,body.modern-flat-v217 .btn-primary, body.modern-flat-v217 .item-tab.active,body.modern-flat-v217 .picker-vtab.active, body.modern-flat-v217 .picker-info-tabs button.active,body.modern-flat-v217 .settings-v2-tabs button.active, body.modern-flat-v217 .settings-v26-tabs button.active,body.modern-flat-v217 .ans-btn.selected|需要进一步测试|
|src/style/02.css:147|body.modern-flat-v217 .ans-btn|需要进一步测试|
|src/style/02.css:148|body.modern-flat-v217 .btn-success|需要进一步测试|
|src/style/02.css:149|body.modern-flat-v217 .btn-warning|需要进一步测试|
|src/style/02.css:150|body.modern-flat-v217 .btn-danger|需要进一步测试|
|src/style/02.css:151|body.modern-flat-v217 .allin-toggle-btn.active|需要进一步测试|
|src/style/02.css:152|body.modern-flat-v217 .opt-btn.active:not(.correct):not(.wrong)|需要进一步测试|
|src/style/02.css:153|body.modern-flat-v217 .opt-btn.correct|需要进一步测试|
|src/style/02.css:154|body.modern-flat-v217 .opt-btn.wrong|需要进一步测试|
|src/style/02.css:155|body.modern-flat-v217 .btn:disabled,body.modern-flat-v217 button:disabled, body.modern-flat-v217 .locked-disabled,body.modern-flat-v217 .round-disabled|需要进一步测试|
|src/style/02.css:159|/* 主操作：青绿；结算与重要提醒：珊瑚 */ body.modern-flat-v217 #btnMainAction,body.modern-flat-v217 .welcome-enter-btn|需要进一步测试|
|src/style/02.css:164|body.modern-flat-v217 #btnMainAction:hover,body.modern-flat-v217 .welcome-enter-btn:hover|需要进一步测试|
|src/style/02.css:165|body.modern-flat-v217 #btnNextRound:not(.locked-disabled)|需要进一步测试|
|src/style/02.css:166|body.modern-flat-v217 #btnForceEnd:not(.locked-disabled)|需要进一步测试|
|src/style/02.css:169|/* Theme-independent archive action: gold always means the final honor archive. */ body.modern-flat-v217 #btnFinalSettlement|需要进一步测试|
|src/style/02.css:178|/* 表单、道具格与菜单 */ body.modern-flat-v217 input:not([type="checkbox"]),body.modern-flat-v217 textarea,body.modern-flat-v217 select|需要进一步测试|
|src/style/02.css:182|body.modern-flat-v217 input:focus,body.modern-flat-v217 textarea:focus,body.modern-flat-v217 select:focus|需要进一步测试|
|src/style/02.css:185|body.modern-flat-v217 .item-slot,body.modern-flat-v217 .item-big, body.modern-flat-v217 .item-stat,body.modern-flat-v217 .item-members, body.modern-flat-v217 .picker-target,body.modern-flat-v217 .hand-rewards, body.modern-flat-v217 .item-draw-card, body.modern-flat-v217 .icon-custom-card,body.modern-flat-v217 .wmp-item|需要进一步测试|
|src/style/02.css:192|body.modern-flat-v217 .queue-main-slot,body.modern-flat-v217 .queue-secondary-slot|需要进一步测试|
|src/style/02.css:193|body.modern-flat-v217 #v2ItemEncyclopedia .ency-card|需要进一步测试|
|src/style/02.css:194|body.modern-flat-v217 .ency-v213-icon-disc|需要进一步测试|
|src/style/02.css:195|body.modern-flat-v217 .hand-item-draw-stage|需要进一步测试|
|src/style/02.css:196|body.modern-flat-v217 .hand-item-capsule|需要进一步测试|
|src/style/02.css:197|body.modern-flat-v217 .v213-number|需要进一步测试|
|src/style/02.css:198|body.modern-flat-v217 .v213-name,body.modern-flat-v217 .dashboard-card-title, body.modern-flat-v217 .welcome-card-title,body.modern-flat-v217 .setting-section-title|需要进一步测试|
|src/style/02.css:200|body.modern-flat-v217 .v213-name-sub,body.modern-flat-v217 .fullview-sub, body.modern-flat-v217 .metric-label|需要进一步测试|
|src/style/02.css:202|/* 排名和图表 */ body.modern-flat-v217 .podium-col|需要进一步测试|
|src/style/02.css:205|body.modern-flat-v217 .podium-col::before,body.modern-flat-v217 .quick-batch-bar::before|需要进一步测试|
|src/style/02.css:206|body.modern-flat-v217 .podium-col.rank-1|需要进一步测试|
|src/style/02.css:207|body.modern-flat-v217 .podium-col.rank-2|需要进一步测试|
|src/style/02.css:208|body.modern-flat-v217 .podium-col.rank-3|需要进一步测试|
|src/style/02.css:209|body.modern-flat-v217 .chart-track|需要进一步测试|
|src/style/02.css:210|body.modern-flat-v217 .chart-bar|需要进一步测试|
|src/style/02.css:211|body.modern-flat-v217 .welcome-clock|需要进一步测试|
|src/style/02.css:212|/* 程序确认弹窗：替换最后一处 Vista 标题栏与警告球 */ body.modern-flat-v217 .program-confirm-overlay|需要进一步测试|
|src/style/02.css:215|body.modern-flat-v217 .program-confirm-window|需要进一步测试|
|src/style/02.css:216|body.modern-flat-v217 .program-confirm-titlebar|需要进一步测试|
|src/style/02.css:217|body.modern-flat-v217 .program-confirm-icon|需要进一步测试|
|src/style/02.css:218|body.modern-flat-v217 .program-confirm-text|需要进一步测试|
|src/style/02.css:219|body.modern-flat-v217 .program-confirm-actions|需要进一步测试|
|src/style/02.css:220|body.modern-flat-v217 .program-confirm-actions button|需要进一步测试|
|src/style/02.css:221|/* 设置开关：纯色轨道和滑块 */ body.modern-flat-v217 .v292-switch-track|需要进一步测试|
|src/style/02.css:224|body.modern-flat-v217 .v292-switch-knob|需要进一步测试|
|src/style/02.css:225|body.modern-flat-v217 .v292-switch input:checked+.v292-switch-track|需要进一步测试|
|src/style/02.css:226|/* V2.16 欢迎页布局迁移，不再依赖 legacy 主题类 */ body.modern-flat-v217 .battle-main-v216|需要进一步测试|
|src/style/02.css:229|body.modern-flat-v217 .battle-main-v216>.top-dashboard-grid|需要进一步测试|
|src/style/02.css:230|body.modern-flat-v217 .welcome-card-title-row-v216|需要进一步测试|
|src/style/02.css:231|body.modern-flat-v217 .welcome-stat-grid-v216>div,body.modern-flat-v217 .welcome-extra-metrics-v216 .metric-box|需要进一步测试|
|src/style/02.css:232|body.modern-flat-v217 .welcome-extra-metrics-v216|需要进一步测试|
|src/style/02.css:233|body.modern-flat-v217 .welcome-chart-wrapper-v216|需要进一步测试|
|src/style/02.css:234|/* 常驻 UI 禁止材质效果；功能性道具动画类不在此清单中 */ body.modern-flat-v217 .status-badge,body.modern-flat-v217 .metric-box, body.modern-flat-v217 .wmp-tag,body.modern-flat-v217 .row-score, body.modern-flat-v217 .welcome-modal-btn|需要进一步测试|
|src/style/02.css:239|body.modern-flat-v217 .item-use-banner-v216|需要进一步测试|
|src/style/02.css:240|body.modern-flat-v217 .audio-hint-bar|需要进一步测试|
|src/style/02.css:241|/* 道具图片尺寸由使用组件决定，原始 PNG 永远不能撑开页面。 */ .item-slot img|需要进一步测试|
|src/style/02.css:244|.item-big-icon img|需要进一步测试|
|src/style/02.css:245|.attack-hit-badge-v2116 span|需要进一步测试|
|src/style/02.css:246|.attack-hit-badge-v2116 span img|需要进一步测试|
|src/style/02.css:247|.card-fx-badge .cfi|需要进一步测试|
|src/style/02.css:248|.card-fx-badge .cfi img|需要进一步测试|
|src/style/02.css:249|.item-use-banner-v216|需要进一步测试|
|src/style/02.css:250|.item-use-banner-v216 .iub-icon|需要进一步测试|
|src/style/02.css:251|.item-use-banner-v216 .iub-icon img|需要进一步测试|
|src/style/02.css:252|.item-use-banner-v216 .iub-main|需要进一步测试|
|src/style/02.css:253|.item-use-banner-v216 .iub-sub|需要进一步测试|
|src/style/02.css:255|0%|需要进一步测试|
|src/style/02.css:255|12%|需要进一步测试|
|src/style/02.css:255|76%|需要进一步测试|
|src/style/02.css:255|100%|需要进一步测试|
|src/style/02.css:255|/* 小组详情内嵌编辑。 */ .group-detail-form|需要进一步测试|
|src/style/02.css:258|.group-detail-section|需要进一步测试|
|src/style/02.css:259|.group-detail-section h4|需要进一步测试|
|src/style/02.css:260|.group-detail-fields|需要进一步测试|
|src/style/02.css:261|.group-detail-field|需要进一步测试|
|src/style/02.css:262|.group-detail-field label|需要进一步测试|
|src/style/02.css:262|.group-detail-field input,.group-detail-field textarea|需要进一步测试|
|src/style/02.css:263|.group-detail-field textarea|需要进一步测试|
|src/style/02.css:264|.group-color-control|需要进一步测试|
|src/style/02.css:265|.group-color-control input[type="color"]|需要进一步测试|
|src/style/02.css:265|.group-color-preview|需要进一步测试|
|src/style/02.css:266|.group-detail-actions|需要进一步测试|
|src/style/02.css:267|.group-detail-lock|需要进一步测试|
|src/style/02.css:268|.group-detail-danger|需要进一步测试|
|src/style/02.css:269|.group-detail-danger p|需要进一步测试|
|src/style/02.css:269|@media(max-width:1050px)|需要进一步测试|
|src/style/02.css:271|/* Dock layout has one responsive owner. Narrow windows keep all actions reachable. */ body.modern-flat-v217|需要进一步测试|
|src/style/02.css:273|body.modern-flat-v217 button:focus-visible, body.modern-flat-v217 input:focus-visible, body.modern-flat-v217 textarea:focus-visible|需要进一步测试|
|src/style/02.css:279|body.modern-flat-v217 *,body.modern-flat-v217 *::before,body.modern-flat-v217 *::after|需要进一步测试|
|src/style/02.css:279|.classroom-save-warning|需要进一步测试|
|src/style/02.css:281|.classroom-save-warning[hidden]|需要进一步测试|
|src/style/02.css:282|.classroom-recovery-tools|需要进一步测试|
|src/style/02.css:283|.classroom-recovery-actions|需要进一步测试|
|src/style/02.css:284|#classroomRecoveryCandidates|需要进一步测试|
|src/style/02.css:285|#classroomRecoveryCandidates article|需要进一步测试|
|src/style/02.css:286|#classroomRecoveryCandidates p,#classroomRecoveryPreview p|需要进一步测试|
|src/style/02.css:287|#classroomRecoveryPreview|需要进一步测试|
|src/style/02.css:288|#classroomRecoveryPreview[hidden]|需要进一步测试|
|src/style/03.css:1|/* ===== V2.16.1：可读性、详情滚动与道具特效层级修复 ===== */  /* 1. 欢迎页“班级总态势”原先继承深色欢迎页的白字，在浅色卡片上几乎不可见。 */ body.modern-flat-v217 .welcome-stat-grid-v216 .w-stat-num|需要进一步测试|
|src/style/03.css:9|body.modern-flat-v217 .welcome-stat-grid-v216 .w-stat-label|需要进一步测试|
|src/style/03.css:13|/* 2. 小组卡片排名：统一字体、取消奇怪的字距和空格，做成紧凑的辅助信息标签。 */ body.modern-flat-v217 .v214-rank-badge|需要进一步测试|
|src/style/03.css:36|/* 3. 小组详情窗口的危险操作此前能滚到“半截”，但底部内容没有足够的滚动余量。 */ body.modern-flat-v217 .item-modal-backdrop|需要进一步测试|
|src/style/03.css:41|body.modern-flat-v217 .item-window|需要进一步测试|
|src/style/03.css:45|body.modern-flat-v217 #itemWindowBody|需要进一步测试|
|src/style/03.css:53|body.modern-flat-v217 .group-detail-form|需要进一步测试|
|src/style/03.css:56|body.modern-flat-v217 .group-detail-danger|需要进一步测试|
|src/style/03.css:61|body.modern-flat-v217 .group-detail-danger .btn-danger|需要进一步测试|
|src/style/03.css:64|/* 4. 道具演出必须浮在普通卡片之上。之前 FX 卡片被 overflow:hidden + 普通 stacking context 一起裁掉。 */ body.modern-flat-v217 .group-list|需要进一步测试|
|src/style/03.css:70|body.modern-flat-v217 .group-row-card|需要进一步测试|
|src/style/03.css:73|body.modern-flat-v217 .group-row-card.card-use-fx, body.modern-flat-v217 .group-row-card.card-hit-fx, body.modern-flat-v217 .group-row-card.card-defend-fx, body.modern-flat-v217 .group-row-card.card-heal-fx|需要进一步测试|
|src/style/03.css:81|body.modern-flat-v217 .group-row-card.card-use-fx .card-fx-badge|需要进一步测试|
|src/style/03.css:85|body.modern-flat-v217 .group-row-card.card-use-fx::before, body.modern-flat-v217 .group-row-card.card-use-fx::after, body.modern-flat-v217 .group-row-card.card-hit-fx::before, body.modern-flat-v217 .group-row-card.card-hit-fx::after, body.modern-flat-v217 .group-row-card.card-defend-fx::before, body.modern-flat-v217 .group-row-card.card-defend-fx::after, body.modern-flat-v217 .group-row-card.card-heal-fx::before, body.modern-flat-v217 .group-row-card.card-heal-fx::after|需要进一步测试|
|src/style/03.css:96|body.modern-flat-v217 .attack-hit-badge-v2116|需要进一步测试|
|src/style/03.css:100|/* 顶部使用提示也始终高于比赛界面，但低于真正的弹窗。 */ body.modern-flat-v217 .item-use-banner-v216|需要进一步测试|
|src/style/03.css:105|/* 持续状态光环不得被卡片自身裁掉。 */ body.modern-flat-v217 .persistent-aura-v213|需要进一步测试|
|src/style/03.css:114|body.modern-flat-v217 .item-window|需要进一步测试|
|src/style/03.css:117|body.modern-flat-v217 #itemWindowBody|需要进一步测试|
|src/style/04.css:1|/* ===== V2.16.2：道具抽取尺寸 + 小组区域裁剪修复 ===== */  /*   找到真正的“遮罩”来源：   现代主题曾给 #groupList 设置 overflow-x:hidden + contain:paint。   contain:paint 会把任何超出小组列表绘制边界的内容直接裁掉，   看起来就像卡片下方盖着一层不可穿透的遮罩，也会连带裁掉道具特效。 */ body.modern-flat-v217 #groupList|需要进一步测试|
|src/style/04.css:18|/* 比赛主体自身也不要裁剪卡片演出。 */ body.modern-flat-v217 #view-battle, body.modern-flat-v217 .battle-main-v216|需要进一步测试|
|src/style/04.css:25|/*   卡片内道具轮盘不再铺满整张卡片。   改成居中的紧凑横条，保持原卡片轮廓和周围信息可辨识。 */ body.modern-flat-v217 .group-row-card.item-draw-spinning|需要进一步测试|
|src/style/04.css:34|body.modern-flat-v217 .group-row-card.item-draw-spinning .card-item-roulette|需要进一步测试|
|src/style/04.css:64|/* 去掉旧水晶轮盘留下的大圆、扫光和其他伪元素。 */ body.modern-flat-v217 .group-row-card.item-draw-spinning .card-item-roulette::before, body.modern-flat-v217 .group-row-card.item-draw-spinning .card-item-roulette::after|需要进一步测试|
|src/style/04.css:71|/* 图标严格锁定，不再拿原始 PNG 尺寸撑卡片。 */ body.modern-flat-v217 .group-row-card.item-draw-spinning .card-item-roulette .r-icon|需要进一步测试|
|src/style/04.css:93|body.modern-flat-v217 .group-row-card.item-draw-spinning .card-item-roulette .r-icon img|需要进一步测试|
|src/style/04.css:101|/* 名称缩小并限定在一行，不再出现截图里那种巨大两三行标题。 */ body.modern-flat-v217 .group-row-card.item-draw-spinning .card-item-roulette .r-name|需要进一步测试|
|src/style/04.css:121|/* 轮盘提示只保留极小辅助字，不占主要空间。 */ body.modern-flat-v217 .group-row-card.item-draw-spinning .card-item-roulette .r-hint|需要进一步测试|
|src/style/04.css:126|/* 抽取期间只轻微降低原卡片信息，不再模糊成一整块“遮罩”。 */ body.modern-flat-v217 .group-row-card.item-draw-spinning:not(.bm-draw-fading) .card-header-row, body.modern-flat-v217 .group-row-card.item-draw-spinning:not(.bm-draw-fading) .answer-zone, body.modern-flat-v217 .group-row-card.item-draw-spinning:not(.bm-draw-fading) .score-zone, body.modern-flat-v217 .group-row-card.item-draw-spinning:not(.bm-draw-fading) .group-actions, body.modern-flat-v217 .group-row-card.item-draw-spinning:not(.bm-draw-fading) .card-action-row|需要进一步测试|
|src/style/04.css:136|/* reveal 时只做轻微缩放，绝不再次撑满卡片。 */ body.modern-flat-v217 .group-row-card.item-draw-spinning .card-item-roulette.reveal|需要进一步测试|
|src/style/04.css:145|0%|需要进一步测试|
|src/style/04.css:146|60%|需要进一步测试|
|src/style/04.css:147|100%|需要进一步测试|
|src/style/04.css:149|/* 防止道具特效再次被列表裁掉。 */ body.modern-flat-v217 #groupList .group-row-card.card-use-fx, body.modern-flat-v217 #groupList .group-row-card.card-hit-fx, body.modern-flat-v217 #groupList .group-row-card.card-defend-fx, body.modern-flat-v217 #groupList .group-row-card.card-heal-fx|需要进一步测试|
|src/style/04.css:161|body.modern-flat-v217 .group-row-card.item-draw-spinning .card-item-roulette|需要进一步测试|
|src/style/04.css:172|body.modern-flat-v217 .group-row-card.item-draw-spinning .card-item-roulette .r-icon|需要进一步测试|
|src/style/04.css:176|body.modern-flat-v217 .group-row-card.item-draw-spinning .card-item-roulette .r-icon img|需要进一步测试|
|src/style/04.css:179|body.modern-flat-v217 .group-row-card.item-draw-spinning .card-item-roulette .r-name|需要进一步测试|
|src/style/05.css:1|/* ===== V2.16.3：修复卡片内道具轮盘定位 =====    V2.16.2 中先写了 top:50%，随后又用了 inset:auto 10px auto 10px，    inset 简写把 top 重新覆盖成 auto，导致绝对定位元素跑回“静态位置”。    现在直接用明确的 top/left/right/bottom，避免人类最喜欢的 CSS 自相残杀。 */ body.modern-flat-v217 .group-row-card.item-draw-spinning|需要进一步测试|
|src/style/05.css:8|body.modern-flat-v217 .group-row-card.item-draw-spinning .card-item-roulette|需要进一步测试|
|src/style/05.css:23|/* reveal 状态同样锁定在卡片正中央。 */ body.modern-flat-v217 .group-row-card.item-draw-spinning .card-item-roulette.reveal|需要进一步测试|
|src/style/05.css:34|body.modern-flat-v217 .group-row-card.item-draw-spinning .card-item-roulette|需要进一步测试|
|src/style/06.css:1|/* ===== V2.17.0：道具百科固定左图右文 ===== */ #aboutMain .v2170-ency-head|需要进一步测试|
|src/style/06.css:9|#aboutMain .v2170-ency-head h2|需要进一步测试|
|src/style/06.css:13|#aboutMain .v2170-ency-sub|需要进一步测试|
|src/style/06.css:18|#aboutMain .v2170-ency-list|需要进一步测试|
|src/style/06.css:24|#aboutMain .v2170-ency-row|需要进一步测试|
|src/style/06.css:38|#aboutMain .v2170-ency-icon|需要进一步测试|
|src/style/06.css:55|#aboutMain .v2170-ency-icon .v2170-ency-img, #aboutMain .v2170-ency-icon img|需要进一步测试|
|src/style/06.css:69|#aboutMain .v2170-ency-copy|需要进一步测试|
|src/style/06.css:76|#aboutMain .v2170-ency-name|需要进一步测试|
|src/style/06.css:82|#aboutMain .v2170-ency-desc|需要进一步测试|
|src/style/06.css:89|/* 百科所在右栏允许正常滚动，不让单个 PNG 改变窗口尺寸。 */ #aboutMain|需要进一步测试|
|src/style/06.css:94|#aboutMain img|需要进一步测试|
|src/style/06.css:99|#aboutMain .v2170-ency-row|需要进一步测试|
|src/style/06.css:105|#aboutMain .v2170-ency-icon|需要进一步测试|
|src/style/06.css:110|#aboutMain .v2170-ency-icon .v2170-ency-img,   #aboutMain .v2170-ency-icon img|需要进一步测试|
|src/style/06.css:115|#aboutMain .v2170-ency-name|需要进一步测试|
|src/style/06.css:116|#aboutMain .v2170-ency-desc|需要进一步测试|
|src/style/07.css:1|.v2172-clear-items-row|需要进一步测试|
|src/style/07.css:11|.v2172-clear-items-copy|需要进一步测试|
|src/style/07.css:17|.v2172-clear-items-copy b|需要进一步测试|
|src/style/07.css:21|.v2172-clear-items-copy span|需要进一步测试|
|src/style/07.css:26|.v2172-clear-items-row .btn-danger|需要进一步测试|
|src/style/07.css:31|.v2172-clear-items-row|需要进一步测试|
|src/style/07.css:35|.v2172-clear-items-row .btn-danger|需要进一步测试|
|src/style/08.css:1|.v2174-audio-head|需要进一步测试|
|src/style/08.css:12|.v2174-audio-head b|需要进一步测试|
|src/style/08.css:13|.v2174-audio-head span|需要进一步测试|
|src/style/08.css:18|.v2174-item-head|需要进一步测试|
|src/style/08.css:19|.v2174-item-sound-grid|需要进一步测试|
|src/style/08.css:24|.v2174-item-sound-grid .v2174-item-sound-card|需要进一步测试|
|src/style/08.css:34|.v2174-item-sound-desc|需要进一步测试|
|src/style/08.css:41|.v2174-item-sound-copy|需要进一步测试|
|src/style/08.css:42|.v2174-item-sound-copy .sound-name|需要进一步测试|
|src/style/08.css:46|.v2174-item-sound-copy .sound-tag|需要进一步测试|
|src/style/08.css:50|.v2174-item-sound-card .sound-controls|需要进一步测试|
|src/style/08.css:58|.v2174-item-sound-card .sound-controls .btn|需要进一步测试|
|src/style/08.css:61|.v2174-sound-name|需要进一步测试|
|src/style/08.css:66|.v2174-item-audio-icon|需要进一步测试|
|src/style/08.css:78|.v2174-item-audio-icon img, .v2174-item-audio-img|需要进一步测试|
|src/style/08.css:87|.v2174-item-sound-grid|需要进一步测试|
|src/style/08.css:90|.v2174-audio-head|需要进一步测试|
|src/style/08.css:95|.v2174-audio-head span|需要进一步测试|
|src/style/08.css:96|.v2174-item-sound-grid|需要进一步测试|
|src/style/08.css:97|.v2174-item-sound-grid .v2174-item-sound-card|需要进一步测试|
|src/style/08.css:100|.v2174-item-sound-card .sound-controls|需要进一步测试|
|src/style/09.css:1|.v2175-fx-bundle-toolbar|需要进一步测试|
|src/style/09.css:12|.v2175-fx-bundle-copy|需要进一步测试|
|src/style/09.css:18|.v2175-fx-bundle-copy b|需要进一步测试|
|src/style/09.css:22|.v2175-fx-bundle-copy span|需要进一步测试|
|src/style/09.css:27|.v2175-fx-bundle-toolbar .btn|需要进一步测试|
|src/style/09.css:32|.v2175-fx-bundle-toolbar|需要进一步测试|
|src/style/09.css:36|.v2175-fx-bundle-toolbar .btn|需要进一步测试|
|src/style/10.css:1|.group-row-card .allin-toggle-btn.v2177-round-locked|需要进一步测试|
|src/style/10.css:6|.group-row-card .v213-main-item.v2177-round-item-locked|需要进一步测试|
|src/style/10.css:10|.group-row-card .v213-main-item.v2177-round-item-locked::after|需要进一步测试|
|src/style/11.css:1|.v2179-cooldown-note|需要进一步测试|
|src/style/11.css:14|.v2179-cooldown-note b|需要进一步测试|
|src/style/11.css:18|.v2179-cooldown-note small|需要进一步测试|
|src/style/12.css:1|/* ===== V2.17.12：课堂快速道具流程 =====    目标：保留“看得懂发生了什么”，砍掉纯等待时间。 */  /* 排名 / 编号重排保留完整移动过程，与开始答题、道具排序逻辑一致。 */ .group-row-card.v213-card|需要进一步测试|
|src/style/12.css:11|/* 抽取轮盘切换更干脆。 */ .card-item-roulette|需要进一步测试|
|src/style/12.css:16|.card-item-roulette .r-icon|需要进一步测试|
|src/style/12.css:22|.card-item-roulette .r-icon.roulette-swap|需要进一步测试|
|src/style/12.css:25|.card-item-roulette.reveal|需要进一步测试|
|src/style/12.css:30|from|需要进一步测试|
|src/style/12.css:31|to|重复实现（仅语法；层叠需进一步测试）|
|src/style/12.css:33|.card-item-roulette.reveal:before|需要进一步测试|
|src/style/12.css:36|.hand-item-progress>div|需要进一步测试|
|src/style/12.css:39|/* 使用者演出由 1.8s 左右压缩到 0.72s。 */ .group-row-card.card-use-fx, .group-row-card.cfx-green, .group-row-card.cfx-red, .group-row-card.cfx-spiny, .group-row-card.cfx-banana, .group-row-card.cfx-horn, .group-row-card.cfx-bomb, .group-row-card.cfx-hammer, .group-row-card.cfx-lightning, .group-row-card.cfx-coin, .group-row-card.cfx-rise, .group-row-card.cfx-mushroom, .group-row-card.cfx-boo, .group-row-card.cfx-blooper, .group-row-card.cfx-star, .group-row-card.cfx-giant, .group-row-card.cfx-bullet, .group-row-card.cfx-power, .group-row-card.cfx-feather, .group-row-card.cfx-fireflower, .group-row-card.cfx-iceflower, .group-row-card.cfx-boomerang|需要进一步测试|
|src/style/12.css:65|.group-row-card.card-use-fx .card-fx-badge, .group-row-card.card-use-fx:before, .group-row-card.card-use-fx:after|需要进一步测试|
|src/style/12.css:71|/* 命中 / 防御 / 治疗反馈压缩到约 0.65s。 */ .group-row-card.card-hit-fx, .group-row-card.card-defend-fx, .group-row-card.card-heal-fx, .group-row-card[class*="hit-"]|需要进一步测试|
|src/style/12.css:79|.group-row-card[class*="hit-"]::after, .group-row-card.card-hit-fx:before|需要进一步测试|
|src/style/12.css:83|.attack-hit-badge-v2116|需要进一步测试|
|src/style/12.css:86|/* 顶部“某组使用某道具”横幅。 */ .item-use-banner-v216|需要进一步测试|
|src/style/12.css:91|/* 炸弹等遗留小特效也不要拖。 */ .effect-bomb|需要进一步测试|
|src/style/13.css:1|/* ===== V2.17.14：快速操作栏放到小组卡片下方 ===== */ body.modern-flat-v217 .quick-batch-bar-bottom-v21714|需要进一步测试|
|src/style/13.css:11|body.modern-flat-v217 .quick-batch-bar-bottom-v21714.active|需要进一步测试|
|src/style/13.css:20|body.modern-flat-v217 .quick-batch-bar-bottom-v21714.active|需要进一步测试|
|src/style/13.css:26|body.modern-flat-v217 .quick-batch-bar-bottom-v21714 .batch-buttons-group|需要进一步测试|
|src/style/14.css:1|.group-color-field-v21716|需要进一步测试|
|src/style/14.css:2|.group-color-preset-grid-v21716|需要进一步测试|
|src/style/14.css:10|.group-color-swatch-v21716|需要进一步测试|
|src/style/14.css:22|.group-color-swatch-v21716:hover:not(:disabled)|需要进一步测试|
|src/style/14.css:26|.group-color-swatch-v21716.selected|需要进一步测试|
|src/style/14.css:30|.group-color-swatch-v21716 span|需要进一步测试|
|src/style/14.css:41|.group-color-swatch-v21716:disabled|需要进一步测试|
|src/style/14.css:42|.group-color-free-v21716|需要进一步测试|
|src/style/14.css:53|.group-color-free-copy-v21716|需要进一步测试|
|src/style/14.css:54|.group-color-free-copy-v21716 b|需要进一步测试|
|src/style/14.css:55|.group-color-free-copy-v21716 span|需要进一步测试|
|src/style/14.css:56|.group-color-control-v21716|需要进一步测试|
|src/style/14.css:57|.group-color-control-v21716 input[type="color"]|需要进一步测试|
|src/style/14.css:60|#groupDetailColorHexV21716|需要进一步测试|
|src/style/14.css:62|.group-color-preset-grid-v21716|需要进一步测试|
|src/style/14.css:63|.group-color-free-v21716|需要进一步测试|
|src/style/15.css:1|/* ===== V2.17.19：扁平 UI 一致性、可读性与滚动区修复 ===== */ body.modern-flat-v217|需要进一步测试|
|src/style/15.css:7|/* 文本始终保持横排和可读，允许在真实单词边界或必要位置换行。 */ body.modern-flat-v217 .about-main, body.modern-flat-v217 .settings-scroll, body.modern-flat-v217 .settings-v26-pane, body.modern-flat-v217 .item-main, body.modern-flat-v217 #itemWindowBody|需要进一步测试|
|src/style/15.css:19|body.modern-flat-v217 ::placeholder|需要进一步测试|
|src/style/15.css:20|/* 中性按钮与语义按钮分别处理，避免通用 hover 把白字按钮洗成白底。 */ body.modern-flat-v217 .btn:not(.btn-primary):not(.btn-success):not(.btn-warning):not(.btn-danger):not(:disabled):hover, body.modern-flat-v217 .nav-tab:not(.active):not(:disabled):hover, body.modern-flat-v217 .icon-btn:not(:disabled):hover, body.modern-flat-v217 .more-btn:not(:disabled):hover, body.modern-flat-v217 .ans-btn:not(.selected):not(:disabled):hover, body.modern-flat-v217 .item-tab:not(.active):not(:disabled):hover, body.modern-flat-v217 .picker-vtab:not(.active):not(:disabled):hover, body.modern-flat-v217 .settings-v26-tabs button:not(.active):not(:disabled):hover|需要进一步测试|
|src/style/15.css:37|body.modern-flat-v217 .btn-primary:not(:disabled):hover, body.modern-flat-v217 .nav-tab.active:not(:disabled):hover, body.modern-flat-v217 .item-tab.active:not(:disabled):hover, body.modern-flat-v217 .picker-vtab.active:not(:disabled):hover, body.modern-flat-v217 .settings-v26-tabs button.active:not(:disabled):hover, body.modern-flat-v217 .ans-btn.selected:not(:disabled):hover, body.modern-flat-v217 #welcomeModal .welcome-modal-btn:not(:disabled):hover|需要进一步测试|
|src/style/15.css:49|body.modern-flat-v217 .btn-success:not(:disabled):hover|需要进一步测试|
|src/style/15.css:50|body.modern-flat-v217 .btn-warning:not(:disabled):hover|需要进一步测试|
|src/style/15.css:51|body.modern-flat-v217 .btn-danger:not(:disabled):hover|需要进一步测试|
|src/style/15.css:52|body.modern-flat-v217 #btnForceEnd:not(.locked-disabled):hover|需要进一步测试|
|src/style/15.css:53|body.modern-flat-v217 button:focus-visible, body.modern-flat-v217 input:focus-visible, body.modern-flat-v217 textarea:focus-visible, body.modern-flat-v217 select:focus-visible|需要进一步测试|
|src/style/15.css:60|body.modern-flat-v217 button:disabled, body.modern-flat-v217 .btn:disabled, body.modern-flat-v217 .locked-disabled, body.modern-flat-v217 .round-disabled|需要进一步测试|
|src/style/15.css:70|/* 欢迎弹窗与普通工作窗口共用扁平表面。 */ body.modern-flat-v217 .welcome-modal-card|需要进一步测试|
|src/style/15.css:78|body.modern-flat-v217 .welcome-modal-title|需要进一步测试|
|src/style/15.css:79|body.modern-flat-v217 .welcome-modal-sub, body.modern-flat-v217 .welcome-modal-hint|需要进一步测试|
|src/style/15.css:81|body.modern-flat-v217 .wmp-item|需要进一步测试|
|src/style/15.css:82|body.modern-flat-v217 .welcome-modal-btn|需要进一步测试|
|src/style/15.css:83|/* 关于窗口：程序信息、指南与百科使用完全相同的标题和内容骨架。 */ body.modern-flat-v217 .about-window|需要进一步测试|
|src/style/15.css:91|body.modern-flat-v217 .about-side|需要进一步测试|
|src/style/15.css:92|body.modern-flat-v217 .about-side button|需要进一步测试|
|src/style/15.css:98|body.modern-flat-v217 .about-side button:hover|需要进一步测试|
|src/style/15.css:99|body.modern-flat-v217 .about-side button.active|需要进一步测试|
|src/style/15.css:100|body.modern-flat-v217 .about-main|需要进一步测试|
|src/style/15.css:108|body.modern-flat-v217 .v214-about-head, body.modern-flat-v217 .v2170-ency-head|需要进一步测试|
|src/style/15.css:116|body.modern-flat-v217 .v214-about-head h2, body.modern-flat-v217 .v2170-ency-head h2|需要进一步测试|
|src/style/15.css:118|body.modern-flat-v217 .about-main .guide-block|需要进一步测试|
|src/style/15.css:127|/* 小组控制台只有正文滚动；标题与左侧标签始终稳定。 */ body.modern-flat-v217 .item-window|需要进一步测试|
|src/style/15.css:137|body.modern-flat-v217 .item-side|需要进一步测试|
|src/style/15.css:138|body.modern-flat-v217 .item-main|需要进一步测试|
|src/style/15.css:147|body.modern-flat-v217 .item-main-head|需要进一步测试|
|src/style/15.css:156|body.modern-flat-v217 #itemWindowBody|需要进一步测试|
|src/style/15.css:168|body.modern-flat-v217 .group-detail-form|需要进一步测试|
|src/style/15.css:169|/* 设置页：标签固定，当前面板独立滚动。 */ body.modern-flat-v217:has(#view-settings.active)|需要进一步测试|
|src/style/15.css:177|body.modern-flat-v217 #view-settings.active|需要进一步测试|
|src/style/15.css:184|body.modern-flat-v217 #view-settings .settings-scroll|需要进一步测试|
|src/style/15.css:192|/* 设置组件的文字、分组和表单样式统一归 ui/desktop.css。 */  /* 道具管理固定为宽卡；禁止图标和按钮把中文说明压成单字列。 */ body.modern-flat-v217 #settingsV26_items .item-ency-grid|需要进一步测试|
|src/style/15.css:202|body.modern-flat-v217 #settingsV26_items .ency-v213-card|需要进一步测试|
|src/style/15.css:216|body.modern-flat-v217 #settingsV26_items .ency-v213-info|需要进一步测试|
|src/style/15.css:217|body.modern-flat-v217 #settingsV26_items .ency-v213-name, body.modern-flat-v217 #settingsV26_items .ency-v213-desc|需要进一步测试|
|src/style/15.css:224|body.modern-flat-v217 #settingsV26_items .ency-v213-name|需要进一步测试|
|src/style/15.css:225|body.modern-flat-v217 #settingsV26_items .ency-v213-desc|需要进一步测试|
|src/style/15.css:226|body.modern-flat-v217 #settingsV26_items .ency-v213-actions|需要进一步测试|
|src/style/15.css:235|/* 自定义按钮图标：宽屏多列，中屏双列，窄屏单列。 */ body.modern-flat-v217 #view-settings .icon-custom-grid|需要进一步测试|
|src/style/15.css:243|body.modern-flat-v217 #view-settings .icon-custom-card|需要进一步测试|
|src/style/15.css:251|body.modern-flat-v217 #view-settings .icon-custom-card>div:nth-child(2)|需要进一步测试|
|src/style/15.css:252|/* 手动举手的小组选择器复用“预选小组”的紧凑胶囊语言。 */ body.modern-flat-v217 #handGroupGrid.hand-grid|需要进一步测试|
|src/style/15.css:260|body.modern-flat-v217 #handGroupGrid .hand-group|需要进一步测试|
|src/style/15.css:278|body.modern-flat-v217 #handGroupGrid .hand-group small|需要进一步测试|
|src/style/15.css:279|body.modern-flat-v217 #handGroupGrid .hand-group:not(.selected):hover|需要进一步测试|
|src/style/15.css:280|body.modern-flat-v217 #handGroupGrid .hand-group.selected|需要进一步测试|
|src/style/15.css:285|body.modern-flat-v217 #handGroupGrid .hand-group.selected small|需要进一步测试|
|src/style/15.css:286|/* 档案页承接原点名窗口中的课堂累计统计。 */ body.modern-flat-v217 .archive-class-stats|需要进一步测试|
|src/style/15.css:289|body.modern-flat-v217 .archive-stats-head|需要进一步测试|
|src/style/15.css:290|body.modern-flat-v217 .archive-stats-head h3|需要进一步测试|
|src/style/15.css:291|body.modern-flat-v217 .archive-stats-head span|需要进一步测试|
|src/style/15.css:292|body.modern-flat-v217 .archive-stats-grid|需要进一步测试|
|src/style/15.css:293|body.modern-flat-v217 .archive-stat-card|需要进一步测试|
|src/style/15.css:294|body.modern-flat-v217 .archive-stat-card b|需要进一步测试|
|src/style/15.css:295|body.modern-flat-v217 .archive-stat-card b small|需要进一步测试|
|src/style/15.css:296|body.modern-flat-v217 .archive-stat-card span|需要进一步测试|
|src/style/15.css:299|body.modern-flat-v217 #view-settings .icon-custom-grid|需要进一步测试|
|src/style/15.css:302|body.modern-flat-v217 .welcome-modal-card|需要进一步测试|
|src/style/15.css:303|body.modern-flat-v217 .about-window,   body.modern-flat-v217 .item-window|需要进一步测试|
|src/style/15.css:305|body.modern-flat-v217 .about-side,   body.modern-flat-v217 .item-side|需要进一步测试|
|src/style/15.css:307|body.modern-flat-v217 .about-side button,   body.modern-flat-v217 .item-side button|需要进一步测试|
|src/style/15.css:309|body.modern-flat-v217 .item-side-title|需要进一步测试|
|src/style/15.css:310|body.modern-flat-v217 .item-main|需要进一步测试|
|src/style/15.css:311|body.modern-flat-v217 #itemWindowBody|需要进一步测试|
|src/style/15.css:312|body.modern-flat-v217 .about-main|需要进一步测试|
|src/style/15.css:313|body.modern-flat-v217 #view-settings .icon-custom-grid|需要进一步测试|
|src/style/15.css:314|body.modern-flat-v217 #settingsV26_items .ency-v213-card|需要进一步测试|
|src/style/15.css:315|body.modern-flat-v217 #settingsV26_items .ency-v213-actions|需要进一步测试|
|src/style/15.css:316|body.modern-flat-v217 #settingsV26_data .setting-item|需要进一步测试|
|src/style/15.css:317|body.modern-flat-v217 #settingsV26_data .setting-item>div|需要进一步测试|
|src/style/15.css:318|body.modern-flat-v217 .archive-stats-grid|需要进一步测试|
|src/style/15.css:320|body.modern-flat-v217 #btnFinalSettlement:not(:disabled):hover|需要进一步测试|
|src/style/16.css:1|/* ===== V2.17.21：比赛页顶部当前排名预览 ===== */ body.modern-flat-v217 .battle-rank-dock-v21721|需要进一步测试|
|src/style/16.css:7|body.modern-flat-v217 .battle-rank-preview-v21721|需要进一步测试|
|src/style/16.css:17|body.modern-flat-v217 .battle-rank-preview-head-v21721|需要进一步测试|
|src/style/16.css:25|body.modern-flat-v217 .battle-rank-preview-title-v21721|需要进一步测试|
|src/style/16.css:30|body.modern-flat-v217 .battle-rank-preview-note-v21721|需要进一步测试|
|src/style/16.css:35|body.modern-flat-v217 .battle-rank-preview-grid-v21721|需要进一步测试|
|src/style/16.css:46|body.modern-flat-v217 .battle-rank-chip-v21721|需要进一步测试|
|src/style/16.css:61|body.modern-flat-v217 .battle-rank-chip-v21721.rank-1|需要进一步测试|
|src/style/16.css:66|body.modern-flat-v217 .battle-rank-no-v21721|需要进一步测试|
|src/style/16.css:73|body.modern-flat-v217 .battle-rank-name-v21721|需要进一步测试|
|src/style/16.css:82|body.modern-flat-v217 .battle-rank-score-v21721|需要进一步测试|
|src/style/16.css:89|body.modern-flat-v217 .battle-rank-dock-v21721 .resizer-handle|需要进一步测试|
|src/style/16.css:95|body.modern-flat-v217 .battle-rank-preview-grid-v21721|需要进一步测试|
|src/style/16.css:100|body.modern-flat-v217 .battle-rank-preview-note-v21721|需要进一步测试|
|src/style/16.css:101|body.modern-flat-v217 .battle-rank-preview-grid-v21721|需要进一步测试|
|src/style/17.css:1|/* ===== V2.17.27：统一程序主题弹窗 ===== */ .theme-dialog-v21727|需要进一步测试|
|src/style/17.css:7|.theme-dialog-v21727.active|需要进一步测试|
|src/style/17.css:8|.theme-dialog-card-v21727|需要进一步测试|
|src/style/17.css:17|from|需要进一步测试|
|src/style/17.css:18|to|需要进一步测试|
|src/style/17.css:20|.theme-dialog-head-v21727|需要进一步测试|
|src/style/17.css:21|.theme-dialog-icon-v21727|需要进一步测试|
|src/style/17.css:25|.theme-dialog-title-v21727|需要进一步测试|
|src/style/17.css:26|.theme-dialog-body-v21727|需要进一步测试|
|src/style/17.css:30|.theme-dialog-actions-v21727|需要进一步测试|
|src/style/17.css:33|.theme-dialog-btn-v21727|需要进一步测试|
|src/style/17.css:37|.theme-dialog-btn-v21727.secondary|需要进一步测试|
|src/style/17.css:38|.theme-dialog-btn-v21727.primary|需要进一步测试|
|src/style/17.css:39|.theme-dialog-btn-v21727.danger|需要进一步测试|
|src/style/17.css:40|.theme-dialog-btn-v21727:focus-visible|需要进一步测试|
|src/style/17.css:42|.theme-dialog-card-v21727|需要进一步测试|
|src/style/17.css:43|.theme-dialog-actions-v21727|需要进一步测试|
|src/style/17.css:44|.theme-dialog-btn-v21727|需要进一步测试|
|src/style/18.css:1|/* ===== V2.17.30：道具分数动画不重复、不挤布局 ===== */ .action-score-col|需要进一步测试|
|src/style/18.css:6|.row-score|需要进一步测试|
|src/style/18.css:10|/* +N / -N 为绝对定位，不再占据 flex 布局空间，也不会把右侧按钮顶开 */ .item-score-delta-v21730|需要进一步测试|
|src/style/18.css:26|.item-score-delta-v21730.gain|需要进一步测试|
|src/style/18.css:27|.item-score-delta-v21730.loss|需要进一步测试|
|src/style/18.css:28|.item-score-delta-v21730.play|需要进一步测试|
|src/style/18.css:32|0%|需要进一步测试|
|src/style/18.css:33|18%|需要进一步测试|
|src/style/18.css:34|72%|需要进一步测试|
|src/style/18.css:35|100%|需要进一步测试|
|src/style/18.css:37|/* 真实分数保持最终值，不再“回退到旧值再播一遍”。    动画只叠加旧值 / 新值两层幽灵数字。 */ .score-roll-ghost-v21730|需要进一步测试|
|src/style/18.css:50|.score-roll-old-v21730|需要进一步测试|
|src/style/18.css:53|.score-roll-new-v21730|需要进一步测试|
|src/style/18.css:59|0%|需要进一步测试|
|src/style/18.css:60|100%|需要进一步测试|
|src/style/18.css:63|0%|需要进一步测试|
|src/style/18.css:64|18%|需要进一步测试|
|src/style/18.css:65|100%|需要进一步测试|
|src/style/18.css:67|.row-score.score-roll-host-v21730|需要进一步测试|
|src/style/18.css:72|.row-score.score-roll-host-v21730 .score-roll-ghost-v21730|需要进一步测试|
|src/style/19.css:1|/* ===== V2.17.35：顶部提示统一样式 + 自动错层 ===== */ .top-notice-stack-v21735|需要进一步测试|
|src/style/19.css:15|/* 放进堆栈后，顶部道具提示不再自己 fixed，否则会互相盖住 */ .top-notice-stack-v21735 .item-use-banner-v216|需要进一步测试|
|src/style/19.css:26|/* 防御提示直接复用顶部道具提示的结构和视觉 */ .item-defense-banner-v21735|需要进一步测试|
|src/style/19.css:33|.item-defense-banner-v21735 .iub-icon|需要进一步测试|
|src/style/19.css:36|.item-defense-banner-v21735 .iub-main|需要进一步测试|
|src/style/19.css:42|.top-notice-stack-v21735|需要进一步测试|
|src/style/20.css:1|/* ===== V2.18.0：手写方案整合 ===== */  /* 统一模态焦点栈决定最近打开窗口的层级；旧值仅作为兼容回退。 */ #pwdModal|需要进一步测试|
|src/style/20.css:5|.theme-dialog-v21727|需要进一步测试|
|src/style/20.css:6|/* 底栏快速按人加分 */ .quick-person-backdrop-v218|需要进一步测试|
|src/style/20.css:13|.quick-person-backdrop-v218.active|需要进一步测试|
|src/style/20.css:14|.quick-person-card-v218|需要进一步测试|
|src/style/20.css:20|.quick-person-head-v218|需要进一步测试|
|src/style/20.css:24|.quick-person-head-v218 b|需要进一步测试|
|src/style/20.css:25|.quick-person-filters-v218|需要进一步测试|
|src/style/20.css:26|.qp-row-v218|需要进一步测试|
|src/style/20.css:27|.qp-row-v218>div|需要进一步测试|
|src/style/20.css:28|.qp-row-v218>span:first-child|需要进一步测试|
|src/style/20.css:29|.qp-row-v218:first-child|需要进一步测试|
|src/style/20.css:30|.qp-search-hint-v218|需要进一步测试|
|src/style/20.css:31|.qp-row-v218>span:first-child|需要进一步测试|
|src/style/20.css:32|.qp-input-v218|需要进一步测试|
|src/style/20.css:33|.qp-chip-v218|需要进一步测试|
|src/style/20.css:37|.qp-chip-v218.active|需要进一步测试|
|src/style/20.css:38|.qp-letter-v218|需要进一步测试|
|src/style/20.css:39|.quick-person-list-v218|需要进一步测试|
|src/style/20.css:43|.quick-person-entry-v218|需要进一步测试|
|src/style/20.css:47|.quick-person-entry-v218.selected|需要进一步测试|
|src/style/20.css:48|.student-no-v218|需要进一步测试|
|src/style/20.css:53|.student-name-v218|需要进一步测试|
|src/style/20.css:54|.student-no-inline-v218|需要进一步测试|
|src/style/20.css:55|.qp-group-v218|需要进一步测试|
|src/style/20.css:56|.quick-person-actions-v218|需要进一步测试|
|src/style/20.css:60|.qp-score-actions-v218|需要进一步测试|
|src/style/20.css:61|.qp-selected-count-v218|需要进一步测试|
|src/style/20.css:62|/* 手动举手使用道具后的中央结算卡 */ .hand-effect-overlay-v218|需要进一步测试|
|src/style/20.css:68|.hand-effect-overlay-v218.active|需要进一步测试|
|src/style/20.css:69|.hand-effect-card-v218|需要进一步测试|
|src/style/20.css:75|from|重复实现（仅语法；层叠需进一步测试）|
|src/style/20.css:75|to|重复实现（仅语法；层叠需进一步测试）|
|src/style/20.css:75|.hand-effect-icon-v218|需要进一步测试|
|src/style/20.css:76|.hand-effect-name-v218|需要进一步测试|
|src/style/20.css:77|.hand-effect-lines-v218|需要进一步测试|
|src/style/20.css:78|.hand-effect-line-v218|需要进一步测试|
|src/style/20.css:79|.hand-effect-line-v218.pos|需要进一步测试|
|src/style/20.css:80|.hand-effect-line-v218.neg|需要进一步测试|
|src/style/20.css:80|.hand-effect-line-v218.neutral|需要进一步测试|
|src/style/20.css:80|/* 抽奖结束后不再显示“查看道具” */ #handRewardBox button[onclick="handUseNewItem()"]|需要进一步测试|
|src/style/20.css:83|/* 百科技巧块 */ .v218-ency-tip|需要进一步测试|
|src/style/20.css:86|.v218-ency-tip b|需要进一步测试|
|src/style/20.css:87|.v218-ency-general|需要进一步测试|
|src/style/20.css:91|.quick-person-card-v218|需要进一步测试|
|src/style/20.css:92|.quick-person-list-v218|需要进一步测试|
|src/style/20.css:93|.quick-person-actions-v218|需要进一步测试|
|src/style/21.css:1|/* V2.18.2 小组信息道具区同步新版规则 */ .v2182-item-rule|需要进一步测试|
|src/style/22.css:1|.dock-humor-tip-v2185|需要进一步测试|
|src/style/22.css:7|.dock-humor-tip-v2185.show|需要进一步测试|
|src/style/22.css:8|.dock-humor-tip-v2185 b|需要进一步测试|
|src/style/22.css:9|.dock-humor-tip-v2185 span|需要进一步测试|
|src/style/23.css:1|.copy-kicker-v2187|需要进一步测试|
|src/ui/desktop.css:1|/* Owned desktop components; battle grid/card geometry remains owned by legacy layout. */ :root, body|需要进一步测试|
|src/ui/desktop.css:39|.ui-icon|需要进一步测试|
|src/ui/desktop.css:48|.ui-page|需要进一步测试|
|src/ui/desktop.css:54|.ui-page-head|需要进一步测试|
|src/ui/desktop.css:61|.ui-eyebrow|需要进一步测试|
|src/ui/desktop.css:69|.ui-page h1|需要进一步测试|
|src/ui/desktop.css:74|.ui-page h2|需要进一步测试|
|src/ui/desktop.css:78|.ui-page h3|需要进一步测试|
|src/ui/desktop.css:82|.ui-muted|需要进一步测试|
|src/ui/desktop.css:87|.ui-page p|需要进一步测试|
|src/ui/desktop.css:90|.ui-panel|需要进一步测试|
|src/ui/desktop.css:98|.ui-clock|需要进一步测试|
|src/ui/desktop.css:104|.ui-welcome-head|需要进一步测试|
|src/ui/desktop.css:111|.ui-welcome-head h1|需要进一步测试|
|src/ui/desktop.css:114|.ui-welcome-time|需要进一步测试|
|src/ui/desktop.css:117|.ui-welcome-time .welcome-enter-btn|需要进一步测试|
|src/ui/desktop.css:122|.ui-section-title|需要进一步测试|
|src/ui/desktop.css:129|.ui-scroll-buttons|需要进一步测试|
|src/ui/desktop.css:133|.ui-scroll-buttons button|需要进一步测试|
|src/ui/desktop.css:142|.ui-scroll-buttons button:disabled|需要进一步测试|
|src/ui/desktop.css:146|.ui-group-track|需要进一步测试|
|src/ui/desktop.css:157|.ui-group-track.ui-few|需要进一步测试|
|src/ui/desktop.css:160|:is(.ui-group-card, .ui-group-repeat)|需要进一步测试|
|src/ui/desktop.css:176|:is(.ui-group-card, .ui-group-repeat):hover|需要进一步测试|
|src/ui/desktop.css:180|:is(.ui-group-card, .ui-group-repeat) .ui-group-title|需要进一步测试|
|src/ui/desktop.css:188|.ui-group-score|需要进一步测试|
|src/ui/desktop.css:195|:is(.ui-group-card, .ui-group-repeat) footer|需要进一步测试|
|src/ui/desktop.css:204|:is(.ui-group-card, .ui-group-repeat) footer img|需要进一步测试|
|src/ui/desktop.css:209|.ui-chip|需要进一步测试|
|src/ui/desktop.css:220|.ui-daily-grid|需要进一步测试|
|src/ui/desktop.css:226|.ui-daily-grid .ui-panel|需要进一步测试|
|src/ui/desktop.css:231|.ui-daily-grid h3|需要进一步测试|
|src/ui/desktop.css:235|.ui-daily-grid details|需要进一步测试|
|src/ui/desktop.css:240|.ui-daily-grid summary|需要进一步测试|
|src/ui/desktop.css:245|.ui-source|需要进一步测试|
|src/ui/desktop.css:251|.ui-item-tip-icon|需要进一步测试|
|src/ui/desktop.css:257|.ui-item-tip-icon img|需要进一步测试|
|src/ui/desktop.css:262|.ui-quiz-options|需要进一步测试|
|src/ui/desktop.css:266|.ui-quiz-options button|需要进一步测试|
|src/ui/desktop.css:275|.ui-quiz-options button[aria-pressed="true"]|需要进一步测试|
|src/ui/desktop.css:279|.ui-quiz-result|需要进一步测试|
|src/ui/desktop.css:285|.ui-overview|需要进一步测试|
|src/ui/desktop.css:291|.ui-overview strong|需要进一步测试|
|src/ui/desktop.css:297|.ui-toolbar|需要进一步测试|
|src/ui/desktop.css:304|.ui-toolbar input|需要进一步测试|
|src/ui/desktop.css:308|.ui-toolbar input, .ui-toolbar select, .ui-settings-body select, .ui-settings-body input[type="number"]|需要进一步测试|
|src/ui/desktop.css:318|.ui-timeline|需要进一步测试|
|src/ui/desktop.css:326|.ui-history|需要进一步测试|
|src/ui/desktop.css:329|.ui-history::before|需要进一步测试|
|src/ui/desktop.css:340|.ui-history[data-kind="danger"]::before|需要进一步测试|
|src/ui/desktop.css:343|.ui-history[data-kind="item"]::before|需要进一步测试|
|src/ui/desktop.css:346|.ui-history summary|需要进一步测试|
|src/ui/desktop.css:354|.ui-history summary h3|需要进一步测试|
|src/ui/desktop.css:358|.ui-history details[open] summary|需要进一步测试|
|src/ui/desktop.css:361|.ui-table-wrap|需要进一步测试|
|src/ui/desktop.css:365|.ui-table|需要进一步测试|
|src/ui/desktop.css:371|.ui-table th, .ui-table td|需要进一步测试|
|src/ui/desktop.css:378|.ui-table th|需要进一步测试|
|src/ui/desktop.css:383|.ui-positive|需要进一步测试|
|src/ui/desktop.css:386|.ui-negative|需要进一步测试|
|src/ui/desktop.css:389|.ui-snapshot-note|需要进一步测试|
|src/ui/desktop.css:397|.ui-empty|需要进一步测试|
|src/ui/desktop.css:404|.ui-empty > .ui-icon|需要进一步测试|
|src/ui/desktop.css:409|.ui-empty p|需要进一步测试|
|src/ui/desktop.css:412|.ui-archive-list|需要进一步测试|
|src/ui/desktop.css:416|.ui-archive-summary|需要进一步测试|
|src/ui/desktop.css:424|.ui-archive-summary h3|需要进一步测试|
|src/ui/desktop.css:428|.ui-podium|需要进一步测试|
|src/ui/desktop.css:435|.ui-podium > div|需要进一步测试|
|src/ui/desktop.css:442|.ui-podium > div:first-child|需要进一步测试|
|src/ui/desktop.css:446|.ui-podium strong|需要进一步测试|
|src/ui/desktop.css:451|.ui-archive-actions|需要进一步测试|
|src/ui/desktop.css:457|.ui-record-count|需要进一步测试|
|src/ui/desktop.css:461|.ui-settings-shell|需要进一步测试|
|src/ui/desktop.css:473|.ui-settings-nav|需要进一步测试|
|src/ui/desktop.css:483|.ui-settings-nav button|需要进一步测试|
|src/ui/desktop.css:496|.ui-settings-nav button[aria-current="true"]|需要进一步测试|
|src/ui/desktop.css:501|.ui-settings-body|需要进一步测试|
|src/ui/desktop.css:507|.ui-settings-category|需要进一步测试|
|src/ui/desktop.css:512|.ui-settings-category[hidden]|需要进一步测试|
|src/ui/desktop.css:515|.ui-settings-title|需要进一步测试|
|src/ui/desktop.css:520|.ui-settings-title h3|需要进一步测试|
|src/ui/desktop.css:525|.ui-settings-row|需要进一步测试|
|src/ui/desktop.css:533|.ui-settings-row label|需要进一步测试|
|src/ui/desktop.css:537|/* Boolean controls share v292's track/knob geometry; selection checkboxes outside    settings remain checkboxes. Native inputs preserve labels, keyboard and handlers. */ :is(#view-settings, .ui-settings-row)   input[type="checkbox"]:not(.v292-switch input), #chkAntiRepeat|需要进一步测试|
|src/ui/desktop.css:560|:is(#view-settings, .ui-settings-row)   input[type="checkbox"]:not(.v292-switch input)::after, #chkAntiRepeat::after|需要进一步测试|
|src/ui/desktop.css:575|:is(#view-settings, .ui-settings-row)   input[type="checkbox"]:not(.v292-switch input):checked, #chkAntiRepeat:checked|需要进一步测试|
|src/ui/desktop.css:581|:is(#view-settings, .ui-settings-row)   input[type="checkbox"]:not(.v292-switch input):checked::after, #chkAntiRepeat:checked::after|需要进一步测试|
|src/ui/desktop.css:586|:is(#view-settings, .ui-settings-row) input[type="checkbox"]:disabled, #chkAntiRepeat:disabled|需要进一步测试|
|src/ui/desktop.css:591|.v292-switch:has(input:focus-visible)|需要进一步测试|
|src/ui/desktop.css:597|:is(#view-settings, .ui-settings-row) input[type="checkbox"],   :is(#view-settings, .ui-settings-row) input[type="checkbox"]::after,   #chkAntiRepeat,   #chkAntiRepeat::after|需要进一步测试|
|src/ui/desktop.css:604|.ui-settings-row select|需要进一步测试|
|src/ui/desktop.css:607|.ui-settings-category .setting-item, .ui-settings-category .setting-row|需要进一步测试|
|src/ui/desktop.css:612|#view-settings|需要进一步测试|
|src/ui/desktop.css:615|.ui-settings-header|需要进一步测试|
|src/ui/desktop.css:632|.ui-settings-eyebrow|需要进一步测试|
|src/ui/desktop.css:640|.ui-settings-header h2|需要进一步测试|
|src/ui/desktop.css:646|.ui-settings-header h2 small|需要进一步测试|
|src/ui/desktop.css:652|.ui-settings-header p|需要进一步测试|
|src/ui/desktop.css:657|.ui-settings-status|需要进一步测试|
|src/ui/desktop.css:668|.ui-settings-status span:first-child|需要进一步测试|
|src/ui/desktop.css:672|.ui-settings-group, .ui-settings-disclosure|需要进一步测试|
|src/ui/desktop.css:680|.ui-settings-group|需要进一步测试|
|src/ui/desktop.css:683|.ui-settings-group h4|需要进一步测试|
|src/ui/desktop.css:688|.ui-settings-group > .ui-muted|需要进一步测试|
|src/ui/desktop.css:693|.ui-settings-disclosure > summary|需要进一步测试|
|src/ui/desktop.css:702|.ui-settings-disclosure > summary::-webkit-details-marker|需要进一步测试|
|src/ui/desktop.css:705|.ui-settings-disclosure > summary b|需要进一步测试|
|src/ui/desktop.css:710|.ui-settings-disclosure > summary span|需要进一步测试|
|src/ui/desktop.css:716|.ui-settings-disclosure > summary::after|需要进一步测试|
|src/ui/desktop.css:727|.ui-settings-disclosure[open] > summary::after|需要进一步测试|
|src/ui/desktop.css:730|.ui-settings-disclosure > summary:hover|需要进一步测试|
|src/ui/desktop.css:733|.ui-settings-disclosure > summary:focus-visible|需要进一步测试|
|src/ui/desktop.css:737|.ui-settings-detail-body|需要进一步测试|
|src/ui/desktop.css:740|.ui-settings-detail-body > .ui-muted|需要进一步测试|
|src/ui/desktop.css:744|.ui-settings-category .setting-item, .ui-settings-category .sound-row|需要进一步测试|
|src/ui/desktop.css:751|.ui-settings-category .setting-label, .ui-settings-category .sound-name|需要进一步测试|
|src/ui/desktop.css:756|.ui-settings-category .sound-tag|需要进一步测试|
|src/ui/desktop.css:760|.ui-settings-category input[type="range"]|需要进一步测试|
|src/ui/desktop.css:763|.ui-settings-category .ui-danger-zone|需要进一步测试|
|src/ui/desktop.css:767|.ui-settings-category .ui-danger-zone > summary b|需要进一步测试|
|src/ui/desktop.css:770|.ui-settings-category .ui-snapshot-note|需要进一步测试|
|src/ui/desktop.css:775|#uiSettingsLock .setting-item > div, #uiSettingsBackup .setting-item > div|需要进一步测试|
|src/ui/desktop.css:782|#uiSettingsLock #newPwdInput|需要进一步测试|
|src/ui/desktop.css:788|#uiSettingsRules > div|需要进一步测试|
|src/ui/desktop.css:794|/* Classroom behaviour uses one card and one switch component. */ #uiSettingsRules #settingsV26_function|需要进一步测试|
|src/ui/desktop.css:798|#uiSettingsRules > div|需要进一步测试|
|src/ui/desktop.css:801|#uiSettingsRules .ui-rule-card|需要进一步测试|
|src/ui/desktop.css:811|.ui-rule-copy|需要进一步测试|
|src/ui/desktop.css:815|.ui-rule-title|需要进一步测试|
|src/ui/desktop.css:822|.ui-rule-copy .setting-note|需要进一步测试|
|src/ui/desktop.css:827|.ui-rule-card .v292-switch|需要进一步测试|
|src/ui/desktop.css:830|.v292-switch input:focus-visible + .v292-switch-track|需要进一步测试|
|src/ui/desktop.css:834|/* Siblings of animated surfaces stay anchored to the viewport. */ .ui-cinematic-skip|需要进一步测试|
|src/ui/desktop.css:849|#settingsV26_sound,   #uiSettingsVolume > div,   #uiSettingsWallpaper > div,   #uiSettingsLayout > div|需要进一步测试|
|src/ui/desktop.css:858|#settingsV26_sound > .ui-settings-group,   #settingsV26_sound > details[open]|需要进一步测试|
|src/ui/desktop.css:862|#settingsV26_sound > .ui-settings-group,   #settingsV26_sound > .ui-settings-disclosure|需要进一步测试|
|src/ui/desktop.css:866|#uiSettingsLayout .ui-settings-row|需要进一步测试|
|src/ui/desktop.css:870|.ui-bank-editor|需要进一步测试|
|src/ui/desktop.css:879|.ui-danger-zone|需要进一步测试|
|src/ui/desktop.css:884|.ui-danger-zone .ui-muted|需要进一步测试|
|src/ui/desktop.css:887|.ui-dock-menu|需要进一步测试|
|src/ui/desktop.css:891|.ui-dock-menu summary|需要进一步测试|
|src/ui/desktop.css:901|.ui-dock-menu-body|需要进一步测试|
|src/ui/desktop.css:917|.ui-dock-menu:not([open]) .ui-dock-menu-body|需要进一步测试|
|src/ui/desktop.css:920|.ui-dock-menu-body .icon-btn|需要进一步测试|
|src/ui/desktop.css:928|.ui-toast|需要进一步测试|
|src/ui/desktop.css:938|.ui-toast::backdrop|需要进一步测试|
|src/ui/desktop.css:942|.ui-modal-close|需要进一步测试|
|src/ui/desktop.css:954|body[data-motion="off"] *, body[data-motion="off"] *::before, body[data-motion="off"] *::after|需要进一步测试|
|src/ui/desktop.css:962|body[data-motion="simple"] .persistent-aura-v213, body[data-item-fx="off"] .persistent-aura-v213|需要进一步测试|
|src/ui/desktop.css:966|body[data-item-fx="off"] .card-fx-layer, body[data-item-fx="off"] .item-use-banner-v216|需要进一步测试|
|src/ui/desktop.css:971|body[data-system-motion="true"] *,   body[data-system-motion="true"] *::before,   body[data-system-motion="true"] *::after|需要进一步测试|
|src/ui/desktop.css:981|.ui-page|需要进一步测试|
|src/ui/desktop.css:984|.ui-daily-grid|需要进一步测试|
|src/ui/desktop.css:987|.ui-settings-shell|需要进一步测试|
|src/ui/desktop.css:990|.ui-welcome-head h1|需要进一步测试|
|src/ui/desktop.css:994|body.modern-flat-v217[data-current-view]:not([data-current-view="battle"])|需要进一步测试|
|src/ui/desktop.css:998|.nav-tab|需要进一步测试|
|src/ui/desktop.css:1006|.ui-settings-host|需要进一步测试|
|src/ui/desktop.css:1012|.ui-settings-category .settings-v26-pane|需要进一步测试|
|src/ui/desktop.css:1018|.ui-settings-category .settings-v26-pane[hidden]|需要进一步测试|
|src/ui/desktop.css:1021|#view-history, #view-archives, #view-settings|需要进一步测试|
|src/ui/desktop.css:1026|.picker-layout-v2|需要进一步测试|
|src/ui/desktop.css:1031|.picker-left-v2, .picker-right-v2|需要进一步测试|
|src/ui/desktop.css:1038|.picker-center-v2|需要进一步测试|
|src/ui/desktop.css:1045|.picker-left-v2 .slot-options-row|需要进一步测试|
|src/ui/desktop.css:1051|.picker-vtab|需要进一步测试|
|src/ui/desktop.css:1057|.picker-vtab.active|需要进一步测试|
|src/ui/desktop.css:1061|#pickerInfoBox|需要进一步测试|
|src/ui/desktop.css:1066|.slot-reel-text|需要进一步测试|
|src/ui/desktop.css:1069|.slot-reel-frame|需要进一步测试|
|src/ui/desktop.css:1072|#slotResultPanel.show #resultHeadline|需要进一步测试|
|src/ui/desktop.css:1076|.picker-right-v2 .picker-info-tabs|需要进一步测试|
|src/ui/desktop.css:1079|.ui-settings-category #bgmListContainer|需要进一步测试|
|src/ui/desktop.css:1083|.ui-settings-category .setting-section-title|需要进一步测试|
|src/ui/desktop.css:1086|.ui-settings-category #uiIconManagerV26 img, .item-big-icon img, .ency-v213-icon img, .ency-icon img|需要进一步测试|
|src/ui/desktop.css:1096|.item-big-icon|需要进一步测试|
|src/ui/desktop.css:1104|.item-big-desc|需要进一步测试|
|src/ui/desktop.css:1107|.queue-main-card|需要进一步测试|
|src/ui/desktop.css:1110|.queue-secondary-card|需要进一步测试|
|src/ui/desktop.css:1113|.queue-item-card|需要进一步测试|
|src/ui/desktop.css:1116|.queue-role-badge|需要进一步测试|
|src/ui/desktop.css:1119|.queue-main-card .queue-role-badge|需要进一步测试|
|src/ui/desktop.css:1122|.ui-settings-row input:disabled, .ui-settings-row select:disabled|需要进一步测试|
|src/ui/desktop.css:1127|.ui-page button:disabled|需要进一步测试|
|src/ui/desktop.css:1131|.ui-page button:focus-visible, .ui-settings-shell button:focus-visible, select:focus-visible, summary:focus-visible|需要进一步测试|
|src/ui/desktop.css:1139|.app-topnav .header-stats|需要进一步测试|
|src/ui/desktop.css:1142|.picker-layout-v2|需要进一步测试|
|src/ui/desktop.css:1145|.picker-left-v2,   .picker-right-v2,   .picker-center-v2|需要进一步测试|
|src/ui/desktop.css:1151|.ui-settings-body .ui-settings-category .setting-item|需要进一步测试|
|src/ui/desktop.css:1156|.ui-podium:has(> div:nth-child(3)) > div:first-child|需要进一步测试|
|src/ui/desktop.css:1161|.ui-podium:has(> div:nth-child(3)) > div:nth-child(2)|需要进一步测试|
|src/ui/desktop.css:1165|.ui-podium:has(> div:nth-child(3)) > div:nth-child(3)|需要进一步测试|
|src/ui/desktop.css:1169|.ui-podium:not(:has(> div:nth-child(2)))|需要进一步测试|
|src/ui/desktop.css:1172|.roster-workspace|需要进一步测试|
|src/ui/desktop.css:1175|.roster-profile-form[hidden]|需要进一步测试|
|src/ui/desktop.css:1178|.roster-workspace-toolbar, .roster-profile-form, .roster-workspace-footer|需要进一步测试|
|src/ui/desktop.css:1187|.roster-workspace-toolbar label:not(.roster-import-label), .roster-profile-form label|需要进一步测试|
|src/ui/desktop.css:1195|.roster-workspace-toolbar select, .roster-profile-form input, .roster-table input, .roster-table select|需要进一步测试|
|src/ui/desktop.css:1208|.roster-workspace-toolbar select|需要进一步测试|
|src/ui/desktop.css:1211|.roster-import-label|需要进一步测试|
|src/ui/desktop.css:1215|.roster-table-wrap|需要进一步测试|
|src/ui/desktop.css:1222|.roster-table|需要进一步测试|
|src/ui/desktop.css:1227|.roster-table th, .roster-table td|需要进一步测试|
|src/ui/desktop.css:1233|.roster-table th|需要进一步测试|
|src/ui/desktop.css:1241|.roster-table th:first-child|需要进一步测试|
|src/ui/desktop.css:1244|.roster-table th:nth-child(2)|需要进一步测试|
|src/ui/desktop.css:1247|.roster-table th:nth-child(3)|需要进一步测试|
|src/ui/desktop.css:1250|.roster-table th:last-child|需要进一步测试|
|src/ui/desktop.css:1253|.roster-table td input, .roster-table td select|需要进一步测试|
|src/ui/desktop.css:1257|.roster-avatar-editor|需要进一步测试|
|src/ui/desktop.css:1263|.roster-student-avatar, .roster-avatar-placeholder|需要进一步测试|
|src/ui/desktop.css:1273|.roster-avatar-placeholder|需要进一步测试|
|src/ui/desktop.css:1279|.roster-avatar-label|需要进一步测试|
|src/ui/desktop.css:1285|.roster-avatar-upload[hidden]|需要进一步测试|
|src/ui/desktop.css:1288|.roster-workspace-footer|需要进一步测试|
|src/ui/desktop.css:1291|.roster-apply-backdrop|需要进一步测试|
|src/ui/desktop.css:1302|.roster-apply-card|需要进一步测试|
|src/ui/desktop.css:1316|.roster-apply-card h3|需要进一步测试|
|src/ui/desktop.css:1320|.roster-apply-card > p:not(.ui-eyebrow)|需要进一步测试|
|src/ui/desktop.css:1325|.roster-apply-card .ui-window-close|需要进一步测试|
|src/ui/desktop.css:1330|.roster-apply-summary|需要进一步测试|
|src/ui/desktop.css:1338|.roster-apply-table-wrap|需要进一步测试|
|src/ui/desktop.css:1344|.roster-apply-table|需要进一步测试|
|src/ui/desktop.css:1349|.roster-apply-table th, .roster-apply-table td|需要进一步测试|
|src/ui/desktop.css:1356|.roster-apply-table thead th|需要进一步测试|
|src/ui/desktop.css:1364|.roster-apply-table thead th:first-child|需要进一步测试|
|src/ui/desktop.css:1367|.roster-apply-table thead th:nth-child(2), .roster-apply-table thead th:nth-child(3)|需要进一步测试|
|src/ui/desktop.css:1371|.roster-apply-table thead th:last-child|需要进一步测试|
|src/ui/desktop.css:1374|.roster-apply-warning|需要进一步测试|
|src/ui/desktop.css:1382|.roster-apply-actions|需要进一步测试|
|src/ui/desktop.css:1389|from|需要进一步测试|
|src/ui/desktop.css:1392|to|需要进一步测试|
|src/ui/desktop.css:1397|from|需要进一步测试|
|src/ui/desktop.css:1401|to|需要进一步测试|
|src/ui/desktop.css:1406|#rosterStatus[data-state="error"]|需要进一步测试|
|src/ui/desktop.css:1409|.teaching-schedule-workspace|需要进一步测试|
|src/ui/desktop.css:1412|.teaching-current, .teaching-schedule-form, .teaching-schedule-toolbar, .teaching-schedule-actions|需要进一步测试|
|src/ui/desktop.css:1422|.teaching-current|需要进一步测试|
|src/ui/desktop.css:1430|.teaching-current > span|需要进一步测试|
|src/ui/desktop.css:1434|.teaching-schedule-form label, .teaching-schedule-toolbar label|需要进一步测试|
|src/ui/desktop.css:1442|.teaching-schedule-form input, .teaching-schedule-form select, .teaching-schedule-toolbar select|需要进一步测试|
|src/ui/desktop.css:1454|.teaching-schedule-form input[type="text"]|需要进一步测试|
|src/ui/desktop.css:1457|.teaching-schedule-list|需要进一步测试|
|src/ui/desktop.css:1463|.teaching-schedule-table|需要进一步测试|
|src/ui/desktop.css:1467|.teaching-schedule-table th, .teaching-schedule-table td|需要进一步测试|
|src/ui/desktop.css:1473|.teaching-schedule-table th|需要进一步测试|
|src/ui/desktop.css:1479|.teaching-schedule-actions|需要进一步测试|
|src/ui/desktop.css:1483|#teachingScheduleStatus[data-state="error"]|需要进一步测试|
|src/ui/desktop.css:1486|.teaching-resource-workspace > p|需要进一步测试|
|src/ui/desktop.css:1489|.teaching-resource-scope, .teaching-resource-import, .teaching-resource-filters|需要进一步测试|
|src/ui/desktop.css:1498|.teaching-resource-scope label, .teaching-resource-import label, .teaching-resource-filters label|需要进一步测试|
|src/ui/desktop.css:1508|.teaching-resource-import label:first-child, .teaching-resource-import label:nth-child(2)|需要进一步测试|
|src/ui/desktop.css:1512|.teaching-resource-filters label:first-child|需要进一步测试|
|src/ui/desktop.css:1515|.teaching-resource-scope input, .teaching-resource-scope select, .teaching-resource-import input:not([type="file"]), .teaching-resource-import select, .teaching-resource-filters input|需要进一步测试|
|src/ui/desktop.css:1529|.teaching-resource-file-label input[type="file"]|需要进一步测试|
|src/ui/desktop.css:1540|.teaching-resource-list|需要进一步测试|
|src/ui/desktop.css:1547|.teaching-resource-card|需要进一步测试|
|src/ui/desktop.css:1558|.teaching-resource-card-info|需要进一步测试|
|src/ui/desktop.css:1563|.teaching-resource-card-info strong, .teaching-resource-card-info span|需要进一步测试|
|src/ui/desktop.css:1567|.teaching-resource-card-info strong|需要进一步测试|
|src/ui/desktop.css:1571|.teaching-resource-card-info span|需要进一步测试|
|src/ui/desktop.css:1575|.teaching-resource-card-info .teaching-resource-tags|需要进一步测试|
|src/ui/desktop.css:1578|.teaching-resource-card-actions|需要进一步测试|
|src/ui/desktop.css:1583|.teaching-resource-preview|需要进一步测试|
|src/ui/desktop.css:1595|.teaching-resource-preview::backdrop|需要进一步测试|
|src/ui/desktop.css:1599|.teaching-resource-preview > header, .teaching-resource-preview > footer|需要进一步测试|
|src/ui/desktop.css:1609|.teaching-resource-preview > header h3|需要进一步测试|
|src/ui/desktop.css:1613|.teaching-resource-preview > footer|需要进一步测试|
|src/ui/desktop.css:1617|.teaching-resource-preview-body|需要进一步测试|
|src/ui/desktop.css:1622|.teaching-resource-preview-body pre|需要进一步测试|
|src/ui/desktop.css:1632|.teaching-resource-preview-body img|需要进一步测试|
|src/ui/desktop.css:1639|#teachingResourceStatus[data-state="error"]|需要进一步测试|
|src/ui/desktop.css:1643|.teaching-resource-card|需要进一步测试|
|src/ui/desktop.css:1647|.teaching-resource-preview[open]|需要进一步测试|
|src/ui/desktop.css:1651|.teaching-resource-preview.is-closing|需要进一步测试|
|src/ui/desktop.css:1657|from|需要进一步测试|
|src/ui/desktop.css:1661|to|需要进一步测试|
|src/ui/desktop.css:1667|from|需要进一步测试|
|src/ui/desktop.css:1671|to|重复实现（仅语法；层叠需进一步测试）|
|src/ui/desktop.css:1677|from|需要进一步测试|
|src/ui/desktop.css:1681|to|需要进一步测试|
|src/ui/application-surfaces.css:1|/* Shared application chrome and function surfaces. Geometry remains in legacy layout. */ :root, body|需要进一步测试|
|src/ui/application-surfaces.css:20|.header-banner.app-topnav|需要进一步测试|
|src/ui/application-surfaces.css:24|.app-topnav .header-title|需要进一步测试|
|src/ui/application-surfaces.css:32|.app-topnav .nav-tab|需要进一步测试|
|src/ui/application-surfaces.css:45|.app-topnav .nav-tab.active::after|需要进一步测试|
|src/ui/application-surfaces.css:54|.app-topnav .header-stats|需要进一步测试|
|src/ui/application-surfaces.css:58|.bottom-dock|需要进一步测试|
|src/ui/application-surfaces.css:65|.ui-dock-answers|需要进一步测试|
|src/ui/application-surfaces.css:75|.bottom-dock .status-badge|需要进一步测试|
|src/ui/application-surfaces.css:79|.bottom-dock .dock-right|需要进一步测试|
|src/ui/application-surfaces.css:83|.bottom-dock .ui-dock-menu summary|需要进一步测试|
|src/ui/application-surfaces.css:89|.ui-dock-menu-body|需要进一步测试|
|src/ui/application-surfaces.css:94|/* Card paint only: no dimensions, padding, line-height, transforms, or font-size. */ #groupList|需要进一步测试|
|src/ui/application-surfaces.css:103|#groupList .name-input|需要进一步测试|
|src/ui/application-surfaces.css:108|#groupList .row-score|需要进一步测试|
|src/ui/application-surfaces.css:113|#groupList .member-count-tag|需要进一步测试|
|src/ui/application-surfaces.css:118|#groupList .item-slot|需要进一步测试|
|src/ui/application-surfaces.css:121|#groupList .more-btn|需要进一步测试|
|src/ui/application-surfaces.css:124|#groupList .opt-btn.active:not(.correct):not(.wrong)|需要进一步测试|
|src/ui/application-surfaces.css:128|#groupList .allin-toggle-btn.active|需要进一步测试|
|src/ui/application-surfaces.css:132|/* The same palette, with content-specific structures retained for each window. */ .ui-function-surface, .item-draw-board, .program-confirm-window|需要进一步测试|
|src/ui/application-surfaces.css:144|.ui-function-surface   :is(     input:not([type="checkbox"]):not([type="range"]):not([type="color"]),     textarea,     select   )|需要进一步测试|
|src/ui/application-surfaces.css:154|.ui-function-surface input::placeholder, .ui-function-surface textarea::placeholder|需要进一步测试|
|src/ui/application-surfaces.css:159|.ui-function-surface .modal-actions|需要进一步测试|
|src/ui/application-surfaces.css:163|.ui-function-surface   :is(     h2,     h3,     .score-modal-title,     .member-search-title,     .theme-dialog-title-v21727   )|需要进一步测试|
|src/ui/application-surfaces.css:173|.ui-function-surface > :is(h3, .score-modal-title, .member-search-title)|需要进一步测试|
|src/ui/application-surfaces.css:177|.ui-function-surface   :is(.item-main-head, .classroom-head, .quick-person-head-v218)|需要进一步测试|
|src/ui/application-surfaces.css:182|.ui-function-surface :is(.classroom-head, .quick-person-head-v218) .btn|需要进一步测试|
|src/ui/application-surfaces.css:186|.ui-function-surface :is(.item-side-title, .about-side-title)|需要进一步测试|
|src/ui/application-surfaces.css:190|.ui-function-surface :is(.item-tab, .about-side button)|需要进一步测试|
|src/ui/application-surfaces.css:195|.ui-function-surface .picker-left-v2|需要进一步测试|
|src/ui/application-surfaces.css:198|.ui-function-surface .picker-right-v2|需要进一步测试|
|src/ui/application-surfaces.css:201|.ui-function-surface .picker-center-v2|需要进一步测试|
|src/ui/application-surfaces.css:204|.ui-function-surface .slot-reel-frame|需要进一步测试|
|src/ui/application-surfaces.css:209|.ui-function-surface .queue-item-card|需要进一步测试|
|src/ui/application-surfaces.css:212|.ui-function-surface .queue-role-badge|需要进一步测试|
|src/ui/application-surfaces.css:215|.ui-function-surface .theme-dialog-icon-v21727|需要进一步测试|
|src/ui/application-surfaces.css:219|.theme-dialog-card-v21727, .quick-person-card-v218, .grand-card|需要进一步测试|
|src/ui/application-surfaces.css:226|.theme-dialog-v21727, .quick-person-backdrop-v218|需要进一步测试|
|src/ui/application-surfaces.css:230|/* Collection pages share the welcome hero, not a generic white fullview box. */ body[data-current-view="history"], body[data-current-view="archives"]|需要进一步测试|
|src/ui/application-surfaces.css:237|#view-history, #view-archives|需要进一步测试|
|src/ui/application-surfaces.css:245|.ui-collection-header|需要进一步测试|
|src/ui/application-surfaces.css:261|.ui-collection-header h2|需要进一步测试|
|src/ui/application-surfaces.css:266|.ui-collection-header h2 small|需要进一步测试|
|src/ui/application-surfaces.css:272|.ui-collection-header .ui-collection-sub, .ui-collection-header .ui-record-count|需要进一步测试|
|src/ui/application-surfaces.css:279|.ui-collection-body|需要进一步测试|
|src/ui/application-surfaces.css:287|#view-history .ui-timeline|需要进一步测试|
|src/ui/application-surfaces.css:293|.ui-history|需要进一步测试|
|src/ui/application-surfaces.css:297|.ui-history::before|需要进一步测试|
|src/ui/application-surfaces.css:300|.ui-history summary > div|需要进一步测试|
|src/ui/application-surfaces.css:303|.ui-history summary > .ui-chip|需要进一步测试|
|src/ui/application-surfaces.css:306|.ui-history::after|需要进一步测试|
|src/ui/application-surfaces.css:315|.ui-history details[open]|需要进一步测试|
|src/ui/application-surfaces.css:318|.ui-archive-card|需要进一步测试|
|src/ui/application-surfaces.css:322|.ui-archive-summary > div|需要进一步测试|
|src/ui/application-surfaces.css:326|.ui-archive-emblem|需要进一步测试|
|src/ui/application-surfaces.css:336|.ui-archive-emblem .ui-icon|需要进一步测试|
|src/ui/application-surfaces.css:340|#view-archives .ui-overview .ui-panel|需要进一步测试|
|src/ui/application-surfaces.css:345|#view-archives .ui-overview strong|需要进一步测试|
|src/ui/application-surfaces.css:349|.ui-podium > div:first-child|需要进一步测试|
|src/ui/application-surfaces.css:354|.ui-podium > div:nth-child(2)|需要进一步测试|
|src/ui/application-surfaces.css:358|.ui-podium > div:nth-child(3)|需要进一步测试|
|src/ui/application-surfaces.css:362|.ui-collection-body .ui-empty|需要进一步测试|
|src/ui/application-surfaces.css:366|body.modern-flat-v217|需要进一步测试|
|src/ui/application-surfaces.css:370|.ui-function-surface .classroom-head|需要进一步测试|
|src/ui/application-surfaces.css:373|.ui-function-surface .quick-person-head-v218 b, .ui-function-surface .item-main-head h3|需要进一步测试|
|src/ui/application-surfaces.css:377|.ui-function-surface :is(.v214-about-head, .v2170-ency-head)|需要进一步测试|
|src/ui/application-surfaces.css:384|/* Archive discovery and empty-state actions use the same content rhythm as home. */ .ui-archive-filter|需要进一步测试|
|src/ui/application-surfaces.css:398|.ui-archive-search|需要进一步测试|
|src/ui/application-surfaces.css:409|.ui-archive-search:focus-within|需要进一步测试|
|src/ui/application-surfaces.css:413|.ui-archive-search input|需要进一步测试|
|src/ui/application-surfaces.css:425|.ui-archive-search input::placeholder|需要进一步测试|
|src/ui/application-surfaces.css:428|.ui-archive-sort|需要进一步测试|
|src/ui/application-surfaces.css:433|.ui-archive-sort label|需要进一步测试|
|src/ui/application-surfaces.css:439|.ui-archive-sort select|需要进一步测试|
|src/ui/application-surfaces.css:451|.ui-archive-filter .ui-record-count|需要进一步测试|
|src/ui/application-surfaces.css:458|#view-archives .ui-empty|需要进一步测试|
|src/ui/application-surfaces.css:461|#view-archives .ui-empty h3|需要进一步测试|
|src/ui/application-surfaces.css:464|#view-archives .ui-empty p|需要进一步测试|
|src/ui/application-surfaces.css:469|#view-archives .ui-empty .btn|需要进一步测试|
|src/ui/application-surfaces.css:474|/* One motion owner per window; shared WAAPI lifecycle replaces old root entrances. */ .ui-function-surface|需要进一步测试|
|src/ui/application-surfaces.css:479|.ui-function-surface button[hidden]|需要进一步测试|
|src/ui/application-surfaces.css:482|.ui-function-surface .ui-window-close|需要进一步测试|
|src/ui/application-surfaces.css:502|.ui-function-surface .ui-window-close:hover|需要进一步测试|
|src/ui/application-surfaces.css:506|.ui-function-surface > :is(h3, .score-modal-title, .member-search-title), .ui-function-surface .theme-dialog-head-v21727, .ui-function-surface .quick-person-head-v218, .ui-function-surface .classroom-head, .ui-function-surface .v214-about-head, .ui-function-surface .v2170-ency-head|需要进一步测试|
|src/ui/application-surfaces.css:514|.ui-function-surface .picker-right-v2 > b|需要进一步测试|
|src/ui/application-surfaces.css:518|.ui-slot-stage|需要进一步测试|
|src/ui/application-surfaces.css:525|.ui-slot-cabinet|需要进一步测试|
|src/ui/application-surfaces.css:530|.ui-slot-stage .slot-machine-case|需要进一步测试|
|src/ui/application-surfaces.css:542|.ui-slot-stage .slot-reel-frame|需要进一步测试|
|src/ui/application-surfaces.css:549|.ui-slot-stage .slot-reel-text|需要进一步测试|
|src/ui/application-surfaces.css:558|.ui-slot-stage #btnSlotTrigger|需要进一步测试|
|src/ui/application-surfaces.css:578|.ui-slot-stage #btnSlotTrigger::before|需要进一步测试|
|src/ui/application-surfaces.css:590|.ui-slot-stage #btnSlotTrigger::after|需要进一步测试|
|src/ui/application-surfaces.css:603|.ui-slot-stage #btnSlotTrigger.stop::before, .ui-slot-stage #btnSlotTrigger:active::before|需要进一步测试|
|src/ui/application-surfaces.css:607|.ui-slot-stage #btnSlotTrigger.stop::after, .ui-slot-stage #btnSlotTrigger:active::after|需要进一步测试|
|src/ui/application-surfaces.css:611|.ui-slot-stage #btnSlotTrigger:disabled|需要进一步测试|
|src/ui/application-surfaces.css:615|.ui-slot-hint|需要进一步测试|
|src/ui/application-surfaces.css:622|.ui-slot-deceleration|需要进一步测试|
|src/ui/application-surfaces.css:628|.ui-slot-deceleration > span|需要进一步测试|
|src/ui/application-surfaces.css:640|#pickerModal[data-picker-reveal="pending"] .slot-result-panel, #pickerModal[data-picker-reveal="pending"] .picker-target, #pickerModal[data-picker-reveal="pending"] #pickerInfoBox|需要进一步测试|
|src/ui/application-surfaces.css:645|/* Bound the cabinet and all three scroll panes to the scaled desktop viewport. */ #pickerModal .picker-layout-v2|需要进一步测试|
|src/ui/application-surfaces.css:652|#pickerModal :is(.picker-left-v2, .picker-center-v2, .picker-right-v2)|需要进一步测试|
|src/ui/application-surfaces.css:658|#pickerModal .picker-center-v2|需要进一步测试|
|src/ui/application-surfaces.css:661|#pickerModal .ui-slot-stage|需要进一步测试|
|src/ui/application-surfaces.css:664|/* Incomplete-answer warning is an active legacy dialog, now on the same lifecycle. */ .program-confirm-window|需要进一步测试|
|src/ui/application-surfaces.css:675|.program-confirm-window .program-confirm-titlebar|需要进一步测试|
|src/ui/application-surfaces.css:681|.program-confirm-titlebar::before|需要进一步测试|
|src/ui/application-surfaces.css:690|.program-confirm-window .program-confirm-body|需要进一步测试|
|src/ui/application-surfaces.css:695|.program-confirm-window .program-confirm-icon|需要进一步测试|
|src/ui/application-surfaces.css:700|.program-confirm-window .program-confirm-text|需要进一步测试|
|src/ui/application-surfaces.css:707|.program-confirm-window .program-confirm-actions|需要进一步测试|
|src/ui/application-surfaces.css:712|.theme-dialog-card-v21727 .theme-dialog-head-v21727|需要进一步测试|
|src/ui/application-surfaces.css:716|.theme-dialog-card-v21727 .theme-dialog-title-v21727|需要进一步测试|
|src/ui/application-surfaces.css:720|.theme-dialog-card-v21727 .theme-dialog-body-v21727|需要进一步测试|
|src/ui/application-surfaces.css:724|.theme-dialog-card-v21727 .theme-dialog-actions-v21727|需要进一步测试|
|src/ui/application-surfaces.css:730|#themeDialogV21727[data-ui-notice="danger"] .theme-dialog-icon-v21727|需要进一步测试|
|src/ui/application-surfaces.css:734|.ui-dock-menu[open] .ui-dock-menu-body|需要进一步测试|
|src/ui/application-surfaces.css:740|from|需要进一步测试|
|src/ui/application-surfaces.css:744|to|需要进一步测试|
|src/ui/application-surfaces.css:749|body[data-motion="off"]|需要进一步测试|
|src/ui/application-surfaces.css:754|body[data-system-motion="true"]|需要进一步测试|
|src/ui/battle-motion.css:1|/* Effects live inside the existing card footprint; no card transform or reflow. */ .bm-layer|需要进一步测试|
|src/ui/battle-motion.css:12|.bm-layer::before|需要进一步测试|
|src/ui/battle-motion.css:25|.bm-layer[data-family="ice"]::before|需要进一步测试|
|src/ui/battle-motion.css:33|.bm-layer[data-family="lightning"]::before|需要进一步测试|
|src/ui/battle-motion.css:37|.bm-badge|需要进一步测试|
|src/ui/battle-motion.css:51|.bm-badge span|需要进一步测试|
|src/ui/battle-motion.css:57|.bm-badge img|需要进一步测试|
|src/ui/battle-motion.css:62|.bm-badge b|需要进一步测试|
|src/ui/battle-motion.css:68|from|需要进一步测试|
|src/ui/battle-motion.css:71|to|需要进一步测试|
|src/ui/battle-motion.css:75|.cf-sound-category|需要进一步测试|
|src/ui/battle-motion.css:82|.cf-sound-category > summary|需要进一步测试|
|src/ui/battle-motion.css:88|body[data-motion="off"] .persistent-aura-v213, body[data-motion="simple"] .persistent-aura-v213|需要进一步测试|
|src/ui/battle-motion.css:93|body[data-system-motion="true"] .persistent-aura-v213|需要进一步测试|
|src/ui/battle-motion.css:97|#groupList .card-header-row, #groupList .card-action-row|需要进一步测试|
|src/ui/battle-motion.css:102|/* Distinct silhouettes retain each item's identity without moving the card. */ .bm-layer[data-family="shell"]::before|需要进一步测试|
|src/ui/battle-motion.css:111|.bm-layer[data-family="fire"]::before|需要进一步测试|
|src/ui/battle-motion.css:120|.bm-layer[data-family="bomb"]::before|需要进一步测试|
|src/ui/battle-motion.css:129|.bm-layer[data-family="horn"]::before|需要进一步测试|
|src/ui/battle-motion.css:138|.bm-layer[data-family="ink"]::before|需要进一步测试|
|src/ui/battle-motion.css:142|.bm-layer[data-family="ghost"]::before|需要进一步测试|
|src/ui/battle-motion.css:146|.bm-layer[data-family="boomerang"]::before|需要进一步测试|
|src/ui/battle-motion.css:155|.bm-layer[data-family="banana"]::before|需要进一步测试|
|src/ui/battle-motion.css:163|.bm-layer[data-family="hammer"]::before|需要进一步测试|
|src/ui/battle-motion.css:171|.bm-layer[data-family="bullet"]::before|需要进一步测试|
|src/ui/battle-motion.css:174|.bm-layer[data-family="buff"]::before|需要进一步测试|
|src/ui/battle-motion.css:184|from|需要进一步测试|
|src/ui/battle-motion.css:188|40%|需要进一步测试|
|src/ui/battle-motion.css:191|to|需要进一步测试|
|src/ui/battle-motion.css:197|from|需要进一步测试|
|src/ui/battle-motion.css:201|35%|需要进一步测试|
|src/ui/battle-motion.css:204|to|需要进一步测试|
|src/ui/battle-motion.css:210|from|需要进一步测试|
|src/ui/battle-motion.css:214|45%|需要进一步测试|
|src/ui/battle-motion.css:217|to|需要进一步测试|
|src/ui/battle-motion.css:223|from|需要进一步测试|
|src/ui/battle-motion.css:226|to|需要进一步测试|
|src/ui/battle-motion.css:231|from|需要进一步测试|
|src/ui/battle-motion.css:235|45%|需要进一步测试|
|src/ui/battle-motion.css:238|to|需要进一步测试|
|src/ui/battle-motion.css:243|body[data-motion="simple"] .bm-layer::before|需要进一步测试|
|src/ui/classroom-feedback.css:1|/* Shared score controls retain the footprint of each existing window. */ .cf-score-slots|需要进一步测试|
|src/ui/classroom-feedback.css:13|.cf-score-slots .btn|需要进一步测试|
|src/ui/classroom-feedback.css:20|.cf-slot-editor|需要进一步测试|
|src/ui/classroom-feedback.css:25|.cf-slot-editor label|需要进一步测试|
|src/ui/classroom-feedback.css:32|.cf-slot-editor input|需要进一步测试|
|src/ui/classroom-feedback.css:39|.cf-slot-editor input[aria-invalid="true"]|需要进一步测试|
|src/ui/classroom-feedback.css:43|.cf-settings|需要进一步测试|
|src/ui/classroom-feedback.css:47|.item-score-panel > .cf-score-slots|需要进一步测试|
|src/ui/classroom-feedback.css:50|.hand-rewards > .cf-score-slots|需要进一步测试|
|src/ui/classroom-feedback.css:53|.qp-score-actions-v218 > .cf-score-slots|需要进一步测试|
|src/ui/classroom-feedback.css:56|#classroomShowcase|需要进一步测试|
|src/ui/classroom-feedback.css:70|#classroomShowcase::backdrop|需要进一步测试|
|src/ui/classroom-feedback.css:74|#classroomShowcase .cf-show-surface|需要进一步测试|
|src/ui/classroom-feedback.css:86|#classroomShowcase[data-kind="negative"] .cf-show-surface|需要进一步测试|
|src/ui/classroom-feedback.css:90|#classroomShowcase[data-kind="pick"] .cf-show-surface|需要进一步测试|
|src/ui/classroom-feedback.css:94|.cf-show-copy|需要进一步测试|
|src/ui/classroom-feedback.css:105|#classroomShowcase .cf-show-title|需要进一步测试|
|src/ui/classroom-feedback.css:115|.cf-show-eyebrow|需要进一步测试|
|src/ui/classroom-feedback.css:122|.cf-show-subtitle|需要进一步测试|
|src/ui/classroom-feedback.css:127|.cf-show-value|需要进一步测试|
|src/ui/classroom-feedback.css:135|#classroomShowcase > .ui-cinematic-skip|需要进一步测试|
|src/ui/classroom-feedback.css:141|.cf-show-orbit|需要进一步测试|
|src/ui/classroom-feedback.css:153|.cf-show-orbit::before, .cf-show-orbit::after|需要进一步测试|
|src/ui/classroom-feedback.css:161|.cf-show-orbit::after|需要进一步测试|
|src/ui/classroom-feedback.css:166|.cf-show-particles|需要进一步测试|
|src/ui/classroom-feedback.css:171|.cf-show-particles i|需要进一步测试|
|src/ui/classroom-feedback.css:180|#classroomShowcase[data-effect-style="burst"] .cf-show-particles i|需要进一步测试|
|src/ui/classroom-feedback.css:185|#classroomShowcase[data-effect-style="burst"] .cf-show-orbit|需要进一步测试|
|src/ui/classroom-feedback.css:189|.cf-show-copy|需要进一步测试|
|src/ui/classroom-feedback.css:192|#classroomShowcase.cf-simple .cf-show-orbit|需要进一步测试|
|src/ui/classroom-feedback.css:195|#classroomShowcase.cf-simple .cf-show-copy|需要进一步测试|
|src/ui/classroom-feedback.css:199|from|需要进一步测试|
|src/ui/classroom-feedback.css:203|to|需要进一步测试|
|src/ui/classroom-feedback.css:209|0%|需要进一步测试|
|src/ui/classroom-feedback.css:213|12%|需要进一步测试|
|src/ui/classroom-feedback.css:216|100%|需要进一步测试|
|src/ui/classroom-feedback.css:222|from|需要进一步测试|
|src/ui/classroom-feedback.css:226|to|重复实现（仅语法；层叠需进一步测试）|
|src/ui/classroom-feedback.css:232|body[data-system-motion="true"] #classroomShowcase *|需要进一步测试|
|src/ui/classroom-feedback.css:236|/* Candidate audio controls stay secondary to the operation's main settings. */ .cf-audio-choices|需要进一步测试|
|src/ui/classroom-feedback.css:246|.cf-audio-choices details|需要进一步测试|
|src/ui/classroom-feedback.css:249|.cf-audio-choice|需要进一步测试|
|src/ui/classroom-feedback.css:256|.cf-audio-choice > span|需要进一步测试|
|src/ui/classroom-feedback.css:260|.sound-row:has(> .cf-audio-choices)|需要进一步测试|
|src/ui/item-modules.css:1|/* Scoped to the modular item editor in settings. */ .im-settings|需要进一步测试|
|src/ui/item-modules.css:5|.im-heading h3|需要进一步测试|
|src/ui/item-modules.css:9|.im-heading p|需要进一步测试|
|src/ui/item-modules.css:12|.im-muted, .im-count|需要进一步测试|
|src/ui/item-modules.css:18|.im-actions|需要进一步测试|
|src/ui/item-modules.css:24|.im-status|需要进一步测试|
|src/ui/item-modules.css:31|.im-status.im-error|需要进一步测试|
|src/ui/item-modules.css:34|.im-layout|需要进一步测试|
|src/ui/item-modules.css:40|.im-sidebar|需要进一步测试|
|src/ui/item-modules.css:43|.im-search|需要进一步测试|
|src/ui/item-modules.css:52|.im-count|需要进一步测试|
|src/ui/item-modules.css:55|.im-list|需要进一步测试|
|src/ui/item-modules.css:64|.im-item|需要进一步测试|
|src/ui/item-modules.css:76|.im-item.is-selected|需要进一步测试|
|src/ui/item-modules.css:80|.im-item:hover|需要进一步测试|
|src/ui/item-modules.css:83|.im-item-icon|需要进一步测试|
|src/ui/item-modules.css:88|.im-item-name|需要进一步测试|
|src/ui/item-modules.css:92|.im-item-state|需要进一步测试|
|src/ui/item-modules.css:96|.im-editor|需要进一步测试|
|src/ui/item-modules.css:103|.im-editor-header|需要进一步测试|
|src/ui/item-modules.css:109|.im-editor-icon|需要进一步测试|
|src/ui/item-modules.css:112|.im-editor-header h3|需要进一步测试|
|src/ui/item-modules.css:116|.im-editor-header .btn|需要进一步测试|
|src/ui/item-modules.css:120|.im-kind|需要进一步测试|
|src/ui/item-modules.css:124|.im-tabs|需要进一步测试|
|src/ui/item-modules.css:131|.im-tab|需要进一步测试|
|src/ui/item-modules.css:142|.im-tab[aria-selected="true"]|需要进一步测试|
|src/ui/item-modules.css:148|.im-pipeline-note|需要进一步测试|
|src/ui/item-modules.css:154|.im-blocks|需要进一步测试|
|src/ui/item-modules.css:159|.im-block|需要进一步测试|
|src/ui/item-modules.css:168|.im-block-copy|需要进一步测试|
|src/ui/item-modules.css:174|.im-block-number|需要进一步测试|
|src/ui/item-modules.css:179|.im-block strong|需要进一步测试|
|src/ui/item-modules.css:182|.im-block small|需要进一步测试|
|src/ui/item-modules.css:185|.im-block input[type="number"]|需要进一步测试|
|src/ui/item-modules.css:197|.im-block .v292-switch|需要进一步测试|
|src/ui/item-modules.css:200|.im-settings input[aria-invalid="true"]|需要进一步测试|
|src/ui/item-modules.css:204|.im-settings :is(button, input, summary):focus-visible|需要进一步测试|
|src/ui/item-modules.css:208|.im-reference|需要进一步测试|
|src/ui/item-modules.css:214|.im-reference summary|需要进一步测试|
|src/ui/item-modules.css:218|.im-reference p|需要进一步测试|
|src/ui/item-modules.css:221|.im-empty|需要进一步测试|
|src/ui/item-modules.css:225|.im-layout|需要进一步测试|
|src/ui/item-modules.css:229|.im-editor|需要进一步测试|
|src/ui/item-modules.css:232|.im-block|需要进一步测试|
|src/ui/item-modules.css:236|.im-item-icon, .im-editor-icon|需要进一步测试|
|src/ui/item-modules.css:243|.im-settings .im-item-image|需要进一步测试|
|src/ui/item-modules.css:249|.im-editor-icon .im-item-image|需要进一步测试|
|src/ui/miyamoto-plugin.css:1|.miyamoto-plugin-workspace|需要进一步测试|
|src/ui/miyamoto-plugin.css:5|.miyamoto-plugin-workspace > h3|需要进一步测试|
|src/ui/miyamoto-plugin.css:10|.miyamoto-plugin-workspace > p, .miyamoto-plugin-settings p, .miyamoto-encyclopedia header p|需要进一步测试|
|src/ui/miyamoto-plugin.css:17|.miyamoto-plugin-settings, .miyamoto-encyclopedia|需要进一步测试|
|src/ui/miyamoto-plugin.css:25|.miyamoto-encyclopedia > h4, .miyamoto-section-title|需要进一步测试|
|src/ui/miyamoto-plugin.css:31|.miyamoto-encyclopedia > p|需要进一步测试|
|src/ui/miyamoto-plugin.css:34|.miyamoto-encyclopedia #v2ItemEncyclopedia, .miyamoto-encyclopedia #itemFxSoundListV26|需要进一步测试|
|src/ui/miyamoto-plugin.css:38|.miyamoto-plugin-settings|需要进一步测试|
|src/ui/miyamoto-plugin.css:44|.miyamoto-plugin-settings h4, .miyamoto-encyclopedia h4|需要进一步测试|
|src/ui/miyamoto-plugin.css:50|.miyamoto-toggle|需要进一步测试|
|src/ui/miyamoto-plugin.css:58|.miyamoto-toggle input|需要进一步测试|
|src/ui/miyamoto-plugin.css:64|.miyamoto-toggle-track|需要进一步测试|
|src/ui/miyamoto-plugin.css:71|.miyamoto-toggle-track::after|需要进一步测试|
|src/ui/miyamoto-plugin.css:83|.miyamoto-toggle input:checked + .miyamoto-toggle-track|需要进一步测试|
|src/ui/miyamoto-plugin.css:86|.miyamoto-toggle input:checked + .miyamoto-toggle-track::after|需要进一步测试|
|src/ui/miyamoto-plugin.css:89|.miyamoto-toggle input:focus-visible + .miyamoto-toggle-track|需要进一步测试|
|src/ui/miyamoto-plugin.css:93|.miyamoto-item-grid|需要进一步测试|
|src/ui/miyamoto-plugin.css:99|.miyamoto-item-card|需要进一步测试|
|src/ui/miyamoto-plugin.css:110|.miyamoto-item-card:hover|需要进一步测试|
|src/ui/miyamoto-plugin.css:115|.miyamoto-item-icon|需要进一步测试|
|src/ui/miyamoto-plugin.css:122|.miyamoto-item-icon img|需要进一步测试|
|src/ui/miyamoto-plugin.css:127|.miyamoto-item-card h5|需要进一步测试|
|src/ui/miyamoto-plugin.css:132|.miyamoto-item-card p|需要进一步测试|
|src/ui/miyamoto-plugin.css:139|.miyamoto-item-grid|需要进一步测试|
|src/ui/miyamoto-plugin.css:144|.miyamoto-item-grid|需要进一步测试|
|src/ui/miyamoto-plugin.css:149|.miyamoto-plugin-workspace|需要进一步测试|
|src/ui/miyamoto-plugin.css:152|.miyamoto-toggle-track,   .miyamoto-toggle-track::after,   .miyamoto-item-card|需要进一步测试|
|src/ui/plugin-center.css:1|.plugin-center-page|需要进一步测试|
|src/ui/plugin-center.css:6|.plugin-center-header|需要进一步测试|
|src/ui/plugin-center.css:13|.plugin-center-header h2|需要进一步测试|
|src/ui/plugin-center.css:18|.plugin-center-header p|需要进一步测试|
|src/ui/plugin-center.css:22|.plugin-center-actions|需要进一步测试|
|src/ui/plugin-center.css:27|.plugin-safety-note|需要进一步测试|
|src/ui/plugin-center.css:39|.plugin-center-status|需要进一步测试|
|src/ui/plugin-center.css:45|.plugin-center-status[data-kind="error"]|需要进一步测试|
|src/ui/plugin-center.css:48|.plugin-center-grid|需要进一步测试|
|src/ui/plugin-center.css:53|.plugin-card|需要进一步测试|
|src/ui/plugin-center.css:64|.plugin-card-head|需要进一步测试|
|src/ui/plugin-center.css:70|.plugin-card h3|需要进一步测试|
|src/ui/plugin-center.css:74|.plugin-card p|需要进一步测试|
|src/ui/plugin-center.css:80|.plugin-id|需要进一步测试|
|src/ui/plugin-center.css:86|.plugin-state|需要进一步测试|
|src/ui/plugin-center.css:94|.plugin-state[data-state="active"]|需要进一步测试|
|src/ui/plugin-center.css:98|.plugin-state[data-state="quarantined"]|需要进一步测试|
|src/ui/plugin-center.css:102|.plugin-card-permissions|需要进一步测试|
|src/ui/plugin-center.css:108|.plugin-card-actions|需要进一步测试|
|src/ui/plugin-center.css:114|.plugin-card-actions button|需要进一步测试|
|src/ui/plugin-center.css:123|.plugin-card-actions button:hover|需要进一步测试|
|src/ui/plugin-center.css:126|.plugin-card-actions .danger|需要进一步测试|
|src/ui/plugin-center.css:131|.plugin-center-empty|需要进一步测试|
|src/ui/plugin-center.css:140|.plugin-center-empty h3|需要进一步测试|
|src/ui/plugin-center.css:144|.plugin-workspace|需要进一步测试|
|src/ui/plugin-center.css:153|.plugin-workspace h3|需要进一步测试|
|src/ui/plugin-center.css:156|.plugin-workspace code|需要进一步测试|
|src/ui/plugin-center.css:162|from|需要进一步测试|
|src/ui/plugin-center.css:166|to|重复实现（仅语法；层叠需进一步测试）|
|src/ui/plugin-center.css:172|.plugin-center-grid|需要进一步测试|
|src/ui/plugin-center.css:175|.plugin-center-header|需要进一步测试|
|src/ui/plugin-center.css:181|.plugin-card,   .plugin-workspace|需要进一步测试|
|src/ui/themes.css:1|/* Presentation-only theme. No layout dimensions or business-state selectors are changed. */ body.modern-flat-v217.theme-marx|需要进一步测试|
|src/ui/themes.css:177|html[data-theme="marx"]|需要进一步测试|
|src/ui/themes.css:180|/* Selection cards reuse the settings spacing and typography scale. */ .gp-theme-options|需要进一步测试|
|src/ui/themes.css:186|.gp-theme-card|需要进一步测试|
|src/ui/themes.css:202|.gp-theme-card[aria-pressed="true"]|需要进一步测试|
|src/ui/themes.css:206|.gp-theme-card:focus-visible|需要进一步测试|
|src/ui/themes.css:210|.gp-theme-card:active|需要进一步测试|
|src/ui/themes.css:213|.gp-theme-card strong, .gp-theme-card small|需要进一步测试|
|src/ui/themes.css:217|.gp-theme-card small|需要进一步测试|
|src/ui/themes.css:221|.gp-theme-swatch|需要进一步测试|
|src/ui/themes.css:231|.gp-theme-swatch.marx|需要进一步测试|
|src/ui/themes.css:235|.gp-theme-swatch svg|需要进一步测试|
|src/ui/themes.css:239|.gp-theme-transition|需要进一步测试|
|src/ui/themes.css:250|.gp-theme-transition::before|需要进一步测试|
|src/ui/themes.css:262|.gp-theme-transition[data-target="classic"]|需要进一步测试|
|src/ui/themes.css:266|.gp-theme-transition-content|需要进一步测试|
|src/ui/themes.css:270|.gp-theme-transition-content svg|需要进一步测试|
|src/ui/themes.css:274|.gp-theme-transition-content h2|需要进一步测试|
|src/ui/themes.css:280|.gp-theme-transition-content p|需要进一步测试|
|src/ui/themes.css:285|.gp-theme-transition .ui-cinematic-skip|需要进一步测试|
|src/ui/themes.css:297|.gp-theme-card|需要进一步测试|
|src/ui/themes.css:301|.gp-theme-ribbon|需要进一步测试|
|src/ui/tooltips.css:1|.gp-hover-tooltip|需要进一步测试|
|src/ui/tooltips.css:22|.gp-hover-tooltip[hidden]|需要进一步测试|
|src/ui/tooltips.css:26|.gp-hover-tooltip|需要进一步测试|
|src/ui/tooltips.css:31|.gp-hover-tooltip|需要进一步测试|
|src/ui/welcome-v2.css:1|/* V2.19 welcome redesign: intentionally scoped. Do not touch battle geometry. */ .gp-brand-mount|需要进一步测试|
|src/ui/welcome-v2.css:9|.gp-brand-mount svg|需要进一步测试|
|src/ui/welcome-v2.css:16|#view-welcome|需要进一步测试|
|src/ui/welcome-v2.css:20|#view-welcome .gp-home|需要进一步测试|
|src/ui/welcome-v2.css:27|#view-welcome .gp-hero|需要进一步测试|
|src/ui/welcome-v2.css:47|#view-welcome .gp-hero::before, #view-welcome .gp-hero::after|需要进一步测试|
|src/ui/welcome-v2.css:55|#view-welcome .gp-hero::before|需要进一步测试|
|src/ui/welcome-v2.css:62|#view-welcome .gp-hero::after|需要进一步测试|
|src/ui/welcome-v2.css:73|#view-welcome .gp-hero-copy|需要进一步测试|
|src/ui/welcome-v2.css:77|#view-welcome .gp-eyebrow|需要进一步测试|
|src/ui/welcome-v2.css:83|#view-welcome .gp-hero h1|需要进一步测试|
|src/ui/welcome-v2.css:91|#view-welcome .gp-hero h1 em|需要进一步测试|
|src/ui/welcome-v2.css:95|#view-welcome .gp-greeting|需要进一步测试|
|src/ui/welcome-v2.css:102|#view-welcome .gp-hero-description|需要进一步测试|
|src/ui/welcome-v2.css:108|#view-welcome .gp-actions|需要进一步测试|
|src/ui/welcome-v2.css:115|#view-welcome .gp-button-primary, #view-welcome .gp-button-outline|需要进一步测试|
|src/ui/welcome-v2.css:124|#view-welcome .gp-button-primary|需要进一步测试|
|src/ui/welcome-v2.css:130|#view-welcome .gp-button-primary:hover|需要进一步测试|
|src/ui/welcome-v2.css:134|#view-welcome .gp-button-outline|需要进一步测试|
|src/ui/welcome-v2.css:139|#view-welcome .gp-button-outline:hover|需要进一步测试|
|src/ui/welcome-v2.css:142|#view-welcome .gp-hero-status|需要进一步测试|
|src/ui/welcome-v2.css:152|#view-welcome .gp-status-top|需要进一步测试|
|src/ui/welcome-v2.css:159|#view-welcome .gp-live-pill|需要进一步测试|
|src/ui/welcome-v2.css:166|#view-welcome .gp-hero-clock|需要进一步测试|
|src/ui/welcome-v2.css:173|#view-welcome .gp-hero-date|需要进一步测试|
|src/ui/welcome-v2.css:178|#view-welcome .gp-status-separator|需要进一步测试|
|src/ui/welcome-v2.css:183|#view-welcome .gp-status-foot|需要进一步测试|
|src/ui/welcome-v2.css:189|#view-welcome .gp-status-foot strong|需要进一步测试|
|src/ui/welcome-v2.css:192|#view-welcome .gp-kpis|需要进一步测试|
|src/ui/welcome-v2.css:198|#view-welcome .gp-kpi|需要进一步测试|
|src/ui/welcome-v2.css:209|#view-welcome .gp-kpi > div|需要进一步测试|
|src/ui/welcome-v2.css:214|#view-welcome .gp-kpi span:first-child|需要进一步测试|
|src/ui/welcome-v2.css:219|#view-welcome .gp-kpi strong|需要进一步测试|
|src/ui/welcome-v2.css:230|#view-welcome .gp-kpi small|需要进一步测试|
|src/ui/welcome-v2.css:234|#view-welcome .gp-kpi-icon|需要进一步测试|
|src/ui/welcome-v2.css:246|#view-welcome .gp-kpi-icon.gp-gold|需要进一步测试|
|src/ui/welcome-v2.css:250|#view-welcome .gp-kpi-icon.gp-blue|需要进一步测试|
|src/ui/welcome-v2.css:254|#view-welcome .gp-kpi-icon.gp-purple|需要进一步测试|
|src/ui/welcome-v2.css:258|#view-welcome .gp-section-heading|需要进一步测试|
|src/ui/welcome-v2.css:265|#view-welcome .gp-section-heading > div|需要进一步测试|
|src/ui/welcome-v2.css:270|#view-welcome .gp-section-heading h2|需要进一步测试|
|src/ui/welcome-v2.css:277|#view-welcome .gp-section-heading small|需要进一步测试|
|src/ui/welcome-v2.css:283|#view-welcome .gp-section-heading > span|需要进一步测试|
|src/ui/welcome-v2.css:287|#view-welcome .gp-heading-bar|需要进一步测试|
|src/ui/welcome-v2.css:293|#view-welcome .gp-main-grid|需要进一步测试|
|src/ui/welcome-v2.css:299|#view-welcome .gp-panel|需要进一步测试|
|src/ui/welcome-v2.css:307|#view-welcome .gp-panel-title|需要进一步测试|
|src/ui/welcome-v2.css:314|#view-welcome .gp-panel-title > div|需要进一步测试|
|src/ui/welcome-v2.css:319|#view-welcome .gp-panel-title strong|需要进一步测试|
|src/ui/welcome-v2.css:324|#view-welcome .gp-panel-title small|需要进一步测试|
|src/ui/welcome-v2.css:328|#view-welcome .gp-panel-tag|需要进一步测试|
|src/ui/welcome-v2.css:337|#view-welcome .gp-panel-tag.gp-soft-tag|需要进一步测试|
|src/ui/welcome-v2.css:340|/* All groups remain available without making the dashboard grow with class size. */ #view-welcome .gp-rank-list|需要进一步测试|
|src/ui/welcome-v2.css:347|#view-welcome .gp-rank-list:focus-visible|需要进一步测试|
|src/ui/welcome-v2.css:351|#view-welcome .gp-rank-head, #view-welcome .gp-rank-row|需要进一步测试|
|src/ui/welcome-v2.css:361|#view-welcome .gp-rank-head|需要进一步测试|
|src/ui/welcome-v2.css:370|#view-welcome .gp-rank-row|需要进一步测试|
|src/ui/welcome-v2.css:375|#view-welcome .gp-rank-row:hover|需要进一步测试|
|src/ui/welcome-v2.css:378|#view-welcome .gp-rank-index|需要进一步测试|
|src/ui/welcome-v2.css:383|#view-welcome .gp-rank-index.gp-medal|需要进一步测试|
|src/ui/welcome-v2.css:392|#view-welcome .gp-rank-index.gp-second|需要进一步测试|
|src/ui/welcome-v2.css:396|#view-welcome .gp-rank-index.gp-third|需要进一步测试|
|src/ui/welcome-v2.css:400|#view-welcome .gp-rank-name|需要进一步测试|
|src/ui/welcome-v2.css:407|#view-welcome .gp-rank-bar|需要进一步测试|
|src/ui/welcome-v2.css:413|#view-welcome .gp-rank-bar > i|需要进一步测试|
|src/ui/welcome-v2.css:423|#view-welcome .gp-rank-points|需要进一步测试|
|src/ui/welcome-v2.css:429|#view-welcome .gp-rank-state|需要进一步测试|
|src/ui/welcome-v2.css:438|#view-welcome .gp-rank-empty|需要进一步测试|
|src/ui/welcome-v2.css:443|#view-welcome .gp-panel-footer|需要进一步测试|
|src/ui/welcome-v2.css:452|#view-welcome .gp-panel-footer button|需要进一步测试|
|src/ui/welcome-v2.css:460|#view-welcome .gp-match-status|需要进一步测试|
|src/ui/welcome-v2.css:469|#view-welcome .gp-status-orb|需要进一步测试|
|src/ui/welcome-v2.css:477|#view-welcome .gp-match-status > div|需要进一步测试|
|src/ui/welcome-v2.css:484|#view-welcome .gp-match-status strong|需要进一步测试|
|src/ui/welcome-v2.css:488|#view-welcome .gp-match-status small|需要进一步测试|
|src/ui/welcome-v2.css:492|#view-welcome .gp-match-status button|需要进一步测试|
|src/ui/welcome-v2.css:502|#view-welcome .gp-feed-list|需要进一步测试|
|src/ui/welcome-v2.css:506|#view-welcome .gp-feed-row|需要进一步测试|
|src/ui/welcome-v2.css:513|#view-welcome .gp-feed-icon|需要进一步测试|
|src/ui/welcome-v2.css:524|#view-welcome .gp-feed-copy|需要进一步测试|
|src/ui/welcome-v2.css:528|#view-welcome .gp-feed-copy strong|需要进一步测试|
|src/ui/welcome-v2.css:535|#view-welcome .gp-feed-copy p|需要进一步测试|
|src/ui/welcome-v2.css:541|#view-welcome .gp-feed-time|需要进一步测试|
|src/ui/welcome-v2.css:546|#view-welcome .gp-group-section|需要进一步测试|
|src/ui/welcome-v2.css:555|#view-welcome .gp-group-head|需要进一步测试|
|src/ui/welcome-v2.css:562|#view-welcome .gp-group-head h2|需要进一步测试|
|src/ui/welcome-v2.css:568|#view-welcome .gp-group-live|需要进一步测试|
|src/ui/welcome-v2.css:578|#view-welcome .gp-group-head p|需要进一步测试|
|src/ui/welcome-v2.css:583|#view-welcome .gp-compact-track|需要进一步测试|
|src/ui/welcome-v2.css:589|#view-welcome .gp-compact-track :is(.ui-group-card, .ui-group-repeat)|需要进一步测试|
|src/ui/welcome-v2.css:599|#view-welcome .gp-compact-track :is(.ui-group-card, .ui-group-repeat):hover|需要进一步测试|
|src/ui/welcome-v2.css:603|#view-welcome .gp-compact-track .ui-group-title|需要进一步测试|
|src/ui/welcome-v2.css:609|#view-welcome .gp-compact-track .ui-group-score|需要进一步测试|
|src/ui/welcome-v2.css:612|#view-welcome .gp-compact-track .ui-muted|需要进一步测试|
|src/ui/welcome-v2.css:616|#view-welcome .gp-compact-track .ui-chip|需要进一步测试|
|src/ui/welcome-v2.css:620|#view-welcome .gp-compact-track footer|需要进一步测试|
|src/ui/welcome-v2.css:626|#view-welcome .gp-compact-track footer img|需要进一步测试|
|src/ui/welcome-v2.css:630|#view-welcome .gp-bottom-heading|需要进一步测试|
|src/ui/welcome-v2.css:633|#view-welcome .gp-daily-grid|需要进一步测试|
|src/ui/welcome-v2.css:640|#view-welcome .gp-daily-grid[data-card-count="1"]|需要进一步测试|
|src/ui/welcome-v2.css:643|#view-welcome .gp-daily-item|需要进一步测试|
|src/ui/welcome-v2.css:646|#view-welcome .gp-daily-item .ui-item-tip-icon|需要进一步测试|
|src/ui/welcome-v2.css:654|#view-welcome .gp-daily-item h3|需要进一步测试|
|src/ui/welcome-v2.css:657|#view-welcome .gp-daily-grid details|需要进一步测试|
|src/ui/welcome-v2.css:661|#view-welcome .gp-daily-grid .btn|需要进一步测试|
|src/ui/welcome-v2.css:665|#view-welcome .gp-daily-grid .ui-quiz-options|需要进一步测试|
|src/ui/welcome-v2.css:670|#view-welcome .gp-daily-grid .ui-quiz-options button|需要进一步测试|
|src/ui/welcome-v2.css:675|#view-welcome .gp-daily-honors h3|需要进一步测试|
|src/ui/welcome-v2.css:678|#view-welcome .gp-daily-challenge .ui-source|需要进一步测试|
|src/ui/welcome-v2.css:682|#view-welcome .gp-daily-grid .ui-panel|需要进一步测试|
|src/ui/welcome-v2.css:689|#view-welcome .gp-daily-grid .ui-eyebrow|需要进一步测试|
|src/ui/welcome-v2.css:695|#view-welcome .gp-daily-grid h3|需要进一步测试|
|src/ui/welcome-v2.css:699|#view-welcome .gp-daily-grid p|需要进一步测试|
|src/ui/welcome-v2.css:703|#view-welcome .gp-footnote|需要进一步测试|
|src/ui/welcome-v2.css:709|#view-welcome .gp-existing-metrics[hidden]|需要进一步测试|
|src/ui/welcome-v2.css:712|/* Startup overlay is an independent gate, not a page tab or modal card. */ .gp-intro|需要进一步测试|
|src/ui/welcome-v2.css:724|.gp-intro[hidden]|需要进一步测试|
|src/ui/welcome-v2.css:727|.gp-intro.active|需要进一步测试|
|src/ui/welcome-v2.css:731|.gp-intro-backdrop|需要进一步测试|
|src/ui/welcome-v2.css:743|.gp-intro-stage|需要进一步测试|
|src/ui/welcome-v2.css:752|.gp-intro-logo|需要进一步测试|
|src/ui/welcome-v2.css:763|.gp-intro-logo svg|需要进一步测试|
|src/ui/welcome-v2.css:770|.gp-intro-title|需要进一步测试|
|src/ui/welcome-v2.css:784|.gp-intro-caption|需要进一步测试|
|src/ui/welcome-v2.css:792|.gp-intro.ready .gp-intro-logo, .gp-intro.ready .gp-intro-title|需要进一步测试|
|src/ui/welcome-v2.css:797|.gp-intro.ready .gp-intro-caption|需要进一步测试|
|src/ui/welcome-v2.css:800|.gp-slider|需要进一步测试|
|src/ui/welcome-v2.css:822|.gp-intro.ready .gp-slider|需要进一步测试|
|src/ui/welcome-v2.css:826|.gp-slider:active|需要进一步测试|
|src/ui/welcome-v2.css:829|.gp-slider-fill|需要进一步测试|
|src/ui/welcome-v2.css:842|.gp-slider-hint|需要进一步测试|
|src/ui/welcome-v2.css:849|.gp-slider-knob|需要进一步测试|
|src/ui/welcome-v2.css:869|.gp-slider-fill|需要进一步测试|
|src/ui/welcome-v2.css:872|.gp-slider.dragging .gp-slider-knob, .gp-slider.dragging .gp-slider-fill|需要进一步测试|
|src/ui/welcome-v2.css:876|.gp-intro-skip|需要进一步测试|
|src/ui/welcome-v2.css:885|.gp-intro.ready .gp-intro-skip|需要进一步测试|
|src/ui/welcome-v2.css:888|.gp-intro.departing .gp-intro-backdrop|需要进一步测试|
|src/ui/welcome-v2.css:891|.gp-intro.departing .gp-slider, .gp-intro.departing .gp-intro-caption, .gp-intro.departing .gp-intro-skip|需要进一步测试|
|src/ui/welcome-v2.css:897|.gp-intro:focus-within .gp-slider:focus-visible|需要进一步测试|
|src/ui/welcome-v2.css:901|body.gp-intro-active|需要进一步测试|
|src/ui/welcome-v2.css:904|body.gp-intro-active .app-topnav|需要进一步测试|
|src/ui/welcome-v2.css:907|body.gp-intro-reveal .app-topnav|需要进一步测试|
|src/ui/welcome-v2.css:910|body.gp-intro-reveal #view-welcome .gp-reveal|需要进一步测试|
|src/ui/welcome-v2.css:913|body.gp-intro-reveal #view-welcome .gp-kpis|需要进一步测试|
|src/ui/welcome-v2.css:916|body.gp-intro-reveal #view-welcome .gp-section-heading|需要进一步测试|
|src/ui/welcome-v2.css:919|body.gp-intro-reveal #view-welcome .gp-main-grid|需要进一步测试|
|src/ui/welcome-v2.css:922|body.gp-intro-reveal #view-welcome .gp-group-section|需要进一步测试|
|src/ui/welcome-v2.css:925|body.gp-intro-reveal #view-welcome .gp-daily-grid|需要进一步测试|
|src/ui/welcome-v2.css:929|from|重复实现（仅语法；层叠需进一步测试）|
|src/ui/welcome-v2.css:932|to|重复实现（仅语法；层叠需进一步测试）|
|src/ui/welcome-v2.css:937|from|需要进一步测试|
|src/ui/welcome-v2.css:941|to|重复实现（仅语法；层叠需进一步测试）|
|src/ui/welcome-v2.css:947|#view-welcome .gp-kpis|需要进一步测试|
|src/ui/welcome-v2.css:950|#view-welcome .gp-main-grid|需要进一步测试|
|src/ui/welcome-v2.css:953|#view-welcome .gp-hero|需要进一步测试|
|src/ui/welcome-v2.css:958|#view-welcome .gp-home|需要进一步测试|
|src/ui/welcome-v2.css:961|#view-welcome .gp-hero|需要进一步测试|
|src/ui/welcome-v2.css:966|#view-welcome .gp-hero-status|需要进一步测试|
|src/ui/welcome-v2.css:970|#view-welcome .gp-section-heading > span,   #view-welcome .gp-section-heading small|需要进一步测试|
|src/ui/welcome-v2.css:974|#view-welcome .gp-kpi|需要进一步测试|
|src/ui/welcome-v2.css:977|#view-welcome .gp-kpi strong|需要进一步测试|
|src/ui/welcome-v2.css:980|#view-welcome .gp-daily-grid|需要进一步测试|
|src/ui/welcome-v2.css:983|#view-welcome .gp-rank-head,   #view-welcome .gp-rank-row|需要进一步测试|
|src/ui/welcome-v2.css:989|#view-welcome .gp-rank-head span:nth-child(3),   #view-welcome .gp-rank-bar|需要进一步测试|
|src/ui/welcome-v2.css:993|#view-welcome .gp-rank-row|需要进一步测试|
|src/ui/welcome-v2.css:996|#view-welcome .gp-rank-name|需要进一步测试|
|src/ui/welcome-v2.css:999|#view-welcome .gp-group-head p|需要进一步测试|
|src/ui/welcome-v2.css:1002|#view-welcome .gp-panel-title|需要进一步测试|
|src/ui/welcome-v2.css:1005|#view-welcome .gp-group-head|需要进一步测试|
|src/ui/welcome-v2.css:1008|#view-welcome .gp-feed-list|需要进一步测试|
|src/ui/welcome-v2.css:1011|#view-welcome .gp-match-status|需要进一步测试|
|src/ui/welcome-v2.css:1015|body[data-welcome-motion="off"] .gp-intro *, body[data-welcome-motion="off"].gp-intro-reveal .app-topnav, body[data-welcome-motion="off"].gp-intro-reveal #view-welcome .gp-reveal|需要进一步测试|
|src/ui/welcome-v2.css:1021|#gpCruiseToggle|需要进一步测试|
|src/ui/welcome-v2.css:1027|#view-welcome .gp-rank-points|需要进一步测试|
|src/ui/welcome-v2.css:1031|#view-welcome .gp-kpi .gp-kpi-number|需要进一步测试|

## 人工验证与实际治理决策

详见 [REFACTORING_REPORT.md](REFACTORING_REPORT.md) 的替代行为表及对应测试。未出现在安全删除记录中的 CSS、音频、渲染和 legacyUseItem 包装层均保留，不以旧版本号作为删除依据。全部独立 keyframes 名称、模板及字符串内联事件入口也见 SOURCE_CATALOG.md；当前索引不是完整作用域解析或动态可达性证明。
