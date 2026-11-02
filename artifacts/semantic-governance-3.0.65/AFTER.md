# 遗留代码依赖与治理清单

基线：`bab0792`。由 `node scripts/legacy-inventory.mjs` 生成。范围：全部旧版脚本、core、UI 与 CSS；资源内容另由构建完整性检查验证。

分类词汇：仍然必要、已被新实现取代、重复实现、确认无法触达、需要进一步测试、可安全删除。**未证明安全的项目默认需要进一步测试并保留；没有调用者的静态结果不等于不可达，HTML、字符串事件及延迟回调仍可能调用它。**

JSON 包含每个命名函数的调用依赖、变量初始化、计时器及监听器的参数、全部 CSS 叶规则正文。命名函数包含局部定义，重复名字不等于全局覆盖；包装器指标为捕获函数标识符的别名数量，不能当作完整运行时覆盖层数。

## 规模观察

|指标|基线|当前|
|---|---:|---:|
|sourceBytes|1676331|1642332|
|sourceLines|55923|53713|
|functionDefinitions|1352|1346|
|duplicateNames|137|136|
|extraDefinitions|300|292|
|capturedWrapperAliases|60|53|
|timerAndListenerCalls|367|367|
|cssLeafRules|2275|2275|
|exactRepeatedCssBodies|61|62|
|important|1658|1637|
|buildBytes|11506606|11472486|

## 已证明可替换／不可达的旧入口

|原位置|实现|分类|依据|
|---|---|---|---|
|src/runtime/items/catalog-refresh.js:45|renderAbout|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/runtime/items/defense-chain-compat.js:199|renderAbout|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/runtime/items/encyclopedia-copy.js:104|renderAbout|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/runtime/items/encyclopedia-effects.js:51|renderAbout|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/runtime/items/encyclopedia-rules.js:63|renderAbout|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/runtime/ui/about-copy.js:1|cleanVisibleCopyV21811|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/runtime/ui/about-copy.js:17|renderAbout|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:15|renderAbout|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/runtime/ui/interface-copy.js:54|renderAbout|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|

## 模块保留决策

|文件|分类|保留理由|
|---|---|---|
|src/application/answer-commands.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/application/command-lifecycle.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/application/hand-raise-port.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/application/hand-selection-sync.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/application/history-commands.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/application/item-defense-adapter.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/application/legacy-classroom-adapter.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/application/manual-score-commands.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/application/migration-coordinator.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/application/round-settlement.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/application/transactional-command-service.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/application/write-barrier.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/core/action-sounds.js|仍然必要|当前规范、命令、攻击防御、快照或兼容接口的唯一实现|
|src/core/history.js|仍然必要|当前规范、命令、攻击防御、快照或兼容接口的唯一实现|
|src/core/item-module-model.js|仍然必要|当前规范、命令、攻击防御、快照或兼容接口的唯一实现|
|src/core/item-modules.js|仍然必要|当前规范、命令、攻击防御、快照或兼容接口的唯一实现|
|src/core/item-score.js|仍然必要|当前规范、命令、攻击防御、快照或兼容接口的唯一实现|
|src/core/picker-bridge.js|仍然必要|当前规范、命令、攻击防御、快照或兼容接口的唯一实现|
|src/core/reliability.js|仍然必要|当前规范、命令、攻击防御、快照或兼容接口的唯一实现|
|src/domain/achievements/catalog.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/domain/achievements/learning-rules.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/domain/achievements/ledger.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/domain/classroom-roster.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/domain/competition/effects.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/domain/competition/phase.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/domain/competition/ranking.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/domain/competition/rules.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/domain/competition/score-adjustments.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/domain/events.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/domain/home-layout.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/domain/identity.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/domain/items/defense-policy.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/domain/items/impact-facts.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/domain/items/targets.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/domain/teaching-resource.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/domain/teaching-schedule.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/domain/values.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/infrastructure/classroom-roster-repository.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/infrastructure/home-layout-repository.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/infrastructure/indexeddb/repository.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/infrastructure/legacy/audio-migration.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/infrastructure/legacy/classroom-repository.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/infrastructure/legacy/inventory.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/infrastructure/legacy/schema-migrations.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/infrastructure/save-file-bridge.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/infrastructure/teaching-resource-repository.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/infrastructure/teaching-schedule-repository.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/items/catalog.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/items/draw.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/items/expansion-copy.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/items/operation.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/items/round-effects.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/archives/full-settlement.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/archives/settlement-actions.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/audio/battle-playback.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/audio/draw-audio-lifecycle.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/audio/effects-volume.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/audio/fx-bundle-transfer.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/audio/item-sound-bindings.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/audio/item-sound-map.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/audio/item-sound-settings.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/audio/menu-patterns.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/audio/menu-settings.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/audio/menu-synthesis.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/audio/menu-transport.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/audio/picker-roll.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/audio/resource-loading.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/audio/session-cache.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/audio/settings-and-transfer.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/audio/sound-playback.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/bootstrap/classroom-startup.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/bootstrap/version.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/classroom/group-actions.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/classroom/group-palette.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/classroom/hand-reward-controls.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/classroom/quick-person-score.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/classroom/roster-settings-actions.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/classroom/roster-text-import.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/classroom/student-labels-and-search.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/competition/answer-adapter.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/competition/batch-all-in-guard.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/competition/round-actions.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/competition/season-cleanup.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/core/state-and-preferences.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/history/boot-and-settings-compat.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/history/compatibility-ui.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/attack-legacy.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/card-effects-legacy.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/catalog-adapters.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/catalog-refresh.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/defense-chain-compat.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/definitions-and-state.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/draw-flow.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/draw-session-throttle.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/draw-throttle-legacy.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/drop-midfield-weights.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/drop-uniqueness-and-reset.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/effect-palette-and-preview.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/encyclopedia-and-icons.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/encyclopedia-copy.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/encyclopedia-effects.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/encyclopedia-rules.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/feature-switch.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/feedback-and-icons.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/first-hand-pool.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/flower-charges-recovery.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/flower-copy-and-limits.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/group-encyclopedia.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/group-window.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/hand-reward-lifecycle.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/inventory-recovery.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/lightning-and-hit-legacy.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/persistent-state-repair.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/queue-adapters.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/ranking-and-drop-legacy.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/round-use-lock.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/spiny-cooldown.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/status-normalization.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/triple-defense-helpers.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/items/weighted-selection.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/picker/classroom-tools.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/picker/selection-engine.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/storage/classroom-save.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/storage/classroom-transfer.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/ui/admin-lock.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/ui/attack-reorder-scheduling.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/ui/battle-appearance-and-hand-rewards.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/ui/battle-layout-controls.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/ui/battle-order-compat.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/ui/battle-sort-contract.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/ui/card-transform-repair.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/ui/chart-and-window-polish.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/ui/competition-summary.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/ui/defense-notices.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/ui/dock-tooltips.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/ui/icon-settings.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/ui/interface-copy.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/ui/member-search.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/ui/navigation-and-clock.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/ui/notice-duration.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/ui/program-confirmation.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/ui/rank-preview.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/ui/round-flip.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/ui/score-dialog-and-animation.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/ui/score-motion.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/ui/settings-and-about.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/ui/settings-navigation-compat.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/ui/theme-dialog.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/ui/toast.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/ui/wallpaper.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/ui/welcome-score-sync.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/runtime/ui/window-visibility.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/audio/fx-transfer.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/audio/item-sounds.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/base/reset-and-header.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/battle/group-cards.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/battle/overview-and-resizer.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/battle/quick-batch.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/battle/rank-preview.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/battle/round-item-locks.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/battle/score-and-state.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/battle/score-feedback.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/classroom/group-palette.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/classroom/student-picker-hand.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/dialogs/score-and-member-search.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/dialogs/settlement-and-core.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/dialogs/theme-confirmation.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/items/attack-feedback.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/items/catalog-and-card-compat.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/items/catalog-and-management.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/items/cooldown-notes.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/items/draw-clipping.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/items/draw-flow.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/items/encyclopedia-layout.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/items/feature-visibility.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/items/group-rule-copy.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/items/inventory-and-roulette.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/items/queue-and-image-constraints.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/items/roulette-position.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/items/roulette-result-and-flowers.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/settings/clear-items.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/settings/tabs-and-confirmation.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/shell/dock-and-buttons.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/shell/navigation-and-welcome.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/themes/flat-foundation.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/ui/defense-notices.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/ui/dock-tooltips.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/ui/flat-controls-and-scrolling.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/ui/interface-copy.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/styles/ui/readability-and-effect-layers.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/application-surfaces.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/battle-card-view.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/battle-grid.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/battle-motion.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/battle-motion.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/classroom-avatar-display.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/classroom-feedback.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/classroom-feedback.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/classroom-recovery.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/classroom-roster-workspace.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/component-catalog.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/component-library.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/component-library.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/component-preview-style.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/content-bank-editor.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/contribution-registry.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/desktop.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/desktop.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/disclosure-motion.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/disposable-scope.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/electron-host.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/electron-windows.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/home-dashboard.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/home-dashboard.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/item-modules.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/item-modules.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/item-score-cinematics.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/item-score-cinematics.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/migration.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/model.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/render.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/roster-workspace.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/round-feedback.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/save-file-settings.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/settings-layout.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/teaching-resource-workspace.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/teaching-workspace.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/teaching-workspace.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/themes.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/themes.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/tooltips.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/tooltips.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/welcome-v2.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/welcome-v2.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/window-motion.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/about-view.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|

## 全部脚本／函数及调用依赖

|位置|名称|类型|分类|直接及嵌套调用（不表示均已执行）|
|---|---|---|---|---|
|src/application/answer-commands.js:3|select|declaration|需要进一步测试|state.groups.find, playSound, runClassroomCommand|
|src/application/answer-commands.js:17|toggleAllIn|declaration|需要进一步测试|state.groups.find, showToast, CompetitionEffects.blockedAllIn, playSound, runClassroomCommand, checkAllInRatio, bgmTransitionThinkingToBattle, bgmTransitionBattleToThinking|
|src/application/answer-commands.js:55|batchSelect|declaration|需要进一步测试|showToast, playSound, runClassroomCommand, state.groups.forEach, renderGrid, renderDashboard|
|src/application/answer-commands.js:77|batchToggleAllIn|declaration|需要进一步测试|showToast, playSound, state.groups.every, runClassroomCommand, state.groups.forEach, CompetitionEffects.blockedAllIn, checkAllInRatio, bgmTransitionThinkingToBattle, bgmTransitionBattleToThinking, renderGrid, renderDashboard|
|src/application/answer-commands.js:117|correct|declaration|需要进一步测试|ClassroomWriteBarrier.allow, state.groups.filter, unanswered.map((g) => g.name).join, unanswered.map, programConfirmV28, showToast, runClassroomCommand, classroomCommands.whenIdle, playSound, renderControls|
|src/application/command-lifecycle.js:3|create|declaration|需要进一步测试|Promise.resolve, Object.freeze, Error, tx.eventScope.emit, TypeError, tx.finalizers.push, callback, host.postCommitError, console.error, tx.eventScope?.close, host.restore, host.result, host.render, tx.resolveCompletion, cancel, String, host.error, tx.finalizers.forEach, finalizer, context, host.validate, tx.eventScope?.list, host.persist, fail, notify, Promise.resolve(saved)           .then(             (result) => acknowledge(tx, transaction, result),             (error) =>               acknowledge(tx, transaction, {                 ok: false,                 error: String(error?.message ／／ error),               }),           )           .catch, Promise.resolve(saved)           .then, acknowledge, host.warning, host.committed, host.active, host.commandId, host.createEventScope, host.actorId, host.invalidate, host.snapshot, host.record, host.setActive, operation, finish, Promise.resolve(promise)         .then((value) => {           if (current !== tx) return;           if (!isCurrent()) {             cancel("stale-defense");             return;           }           host.setActive(true);           try {             apply(value);             host.validate();           } finally {             host.setActive(false);           }           tx.waiting--;           finish(tx);         })         .catch, Promise.resolve(promise)         .then, isCurrent, apply|
|src/application/command-lifecycle.js:13|context|declaration|需要进一步测试|Object.freeze, Error, tx.eventScope.emit, TypeError, tx.finalizers.push|
|src/application/command-lifecycle.js:31|notify|declaration|需要进一步测试|callback, host.postCommitError, console.error|
|src/application/command-lifecycle.js:44|cancel|declaration|需要进一步测试|tx.eventScope?.close, host.restore, host.result, host.render, tx.resolveCompletion|
|src/application/command-lifecycle.js:60|fail|declaration|需要进一步测试|cancel, String, host.error|
|src/application/command-lifecycle.js:65|finish|declaration|需要进一步测试|tx.finalizers.forEach, finalizer, context, host.validate, tx.eventScope?.list, tx.eventScope?.close, host.persist, fail, notify, host.result, Promise.resolve(saved)           .then(             (result) => acknowledge(tx, transaction, result),             (error) =>               acknowledge(tx, transaction, {                 ok: false,                 error: String(error?.message ／／ error),               }),           )           .catch, Promise.resolve(saved)           .then, Promise.resolve, acknowledge, String, host.error|
|src/application/command-lifecycle.js:105|acknowledge|declaration|需要进一步测试|host.restore, notify, host.result, host.error, Error, host.warning, host.committed, host.render, tx.resolveCompletion|
|src/application/command-lifecycle.js:148|run|declaration|需要进一步测试|host.active, host.commandId, host.createEventScope, host.actorId, host.invalidate, cancel, host.snapshot, host.record, host.setActive, operation, context, host.validate, fail, host.result, finish|
|src/application/command-lifecycle.js:200|defer|declaration|需要进一步测试|Promise.resolve(promise)         .then((value) => {           if (current !== tx) return;           if (!isCurrent()) {             cancel("stale-defense");             return;           }           host.setActive(true);           try {             apply(value);             host.validate();           } finally {             host.setActive(false);           }           tx.waiting--;           finish(tx);         })         .catch, Promise.resolve(promise)         .then, Promise.resolve, isCurrent, cancel, host.setActive, apply, host.validate, finish, fail|
|src/application/hand-raise-port.js:6|create|declaration|需要进一步测试|host.getState, state.groups.find, host.busy, current, busy, host.enabled, host.eligible, host.itemName, Number.isSafeInteger, host.id, getSnapshot, host.planScore, host.use, host.whenIdle, host.feedback, host.captureRuntime, host.run, Number, state.itemGlobal.handRaiseHistory.push, Date.now, host.draw, host.restoreRuntime|
|src/application/hand-raise-port.js:9|current|declaration|需要进一步测试|host.getState, state.groups.find|
|src/application/hand-raise-port.js:25|busy|declaration|需要进一步测试|host.busy|
|src/application/hand-raise-port.js:28|getSnapshot|declaration|需要进一步测试|host.getState, current, busy, host.enabled, host.eligible, host.itemName|
|src/application/hand-raise-port.js:70|command|declaration|需要进一步测试|busy, host.getState, Number.isSafeInteger, state.groups.find, host.id, current, getSnapshot, host.enabled, host.eligible, host.planScore, host.use, host.whenIdle, host.feedback, host.captureRuntime, host.run, Number, state.itemGlobal.handRaiseHistory.push, Date.now, host.draw, host.restoreRuntime|
|src/application/hand-selection-sync.js:9|notify|declaration|需要进一步测试|Number.isSafeInteger, fn, console.warn|
|src/application/hand-selection-sync.js:22|subscribe|declaration|需要进一步测试|listeners.add, listeners.delete|
|src/application/history-commands.js:3|clear|declaration|需要进一步测试|ClassroomWriteBarrier.allow, openPwdModal, JSON.stringify, themeConfirm, showToast, runClassroomCommand, classroomCommands.whenIdle, renderHistoryList|
|src/application/history-commands.js:54|apply|declaration|需要进一步测试|cancelScoreAnimationAndSync, clone, AchievementLedger.normalize, normalizeAllGroups, state.groups.forEach, Number.isFinite, renderAll, ensureItemState, startBulletTimer, startBlooperClock|
|src/application/history-commands.js:80|commitRestore|declaration|需要进一步测试|window.GodpowerPicker?.invalidate, runClassroomCommand, historyStack.slice, apply, classroomCommands.whenIdle, playSound, renderHistoryList, showToast|
|src/application/history-commands.js:101|restore|declaration|需要进一步测试|ClassroomWriteBarrier.allow, Reliability.invalidateDefenseDecisions, commitRestore|
|src/application/history-commands.js:106|undo|declaration|需要进一步测试|ClassroomWriteBarrier.allow, openPwdModal, classroomCommands.isPending, Reliability.invalidateDefenseDecisions, showToast, commitRestore|
|src/application/history-commands.js:125|revert|declaration|需要进一步测试|ClassroomWriteBarrier.allow, themeAlert, openPwdModal, Reliability.invalidateDefenseDecisions, commitRestore|
|src/application/item-defense-adapter.js:2|tryDefend|declaration|需要进一步测试|DefensePolicy.choose, eligibleForItems, globalThis.RedirectedItemInstances?.has, SHELL_ATTACK_KEYS_V2170.has, tinyDefenseToast, Math.max, Number, Object.keys, g.inventory.splice, explodeDestroyedBombV2170, consumeInventoryItem|
|src/application/item-defense-adapter.js:69|requestSpinyDefense|declaration|需要进一步测试|spinyDefenseRequests.get, spinyDefenseRequests.set, requests.set, Reliability.captureDefenseDecision, themeConfirm, requests.get, requests.delete, spinyDefenseRequests.delete, deferClassroomDefense, clear, consumeInventoryItem, tinyDefenseToast, continueAttack, Reliability.isDefenseDecisionCurrent, Promise.resolve(prompt).then, Promise.resolve|
|src/application/item-defense-adapter.js:95|clear|binding|需要进一步测试|requests.get, requests.delete, spinyDefenseRequests.delete|
|src/application/legacy-classroom-adapter.js:3|buildClassroomBackup|declaration|需要进一步测试|classroomCommands.isPending, clone, classroomCommands.baseline, new Date().toISOString, AchievementLedger.normalize, getPersistableGroups|
|src/application/legacy-classroom-adapter.js:34|applyClassroomBackup|declaration|需要进一步测试|Reliability.validateBackup, SchemaMigrations.migrateBackup, window.GodpowerPicker?.invalidate, StableIdentity.isValidSeasonId, StableIdentity.createSeasonId, AchievementLedger.normalize, AchievementLedger.empty, normalizeAllGroups, ["individual", "group", "two_tier"].includes, Array.isArray, clone, Reliability.count, Object.fromEntries, Object.entries(state.itemGlobal.customIcons ／／ {}).filter, Object.entries, Reliability.safeImage, ["A", "B", "C", "D"].includes, state.groups.forEach, String, Number.isFinite, Number, Math.max, Math.min, ["single", "double"].includes, data.history       .filter((h) => h && Array.isArray(h.groups))       .slice, data.history       .filter, ensureV2State, ensureGroupNumbersV213|
|src/application/legacy-classroom-adapter.js:120|importClassroomData|declaration|需要进一步测试|ClassroomWriteBarrier.conflict, Reliability.invalidateDefenseDecisions, clone, Reliability.validateBackup, ClassroomRepository.writeVerified, CLASSROOM_STORAGE.getItem, new Date().toISOString, Error, cancelScoreAnimationAndSync, applyClassroomBackup, saveState, renderAll, String|
|src/application/legacy-classroom-adapter.js:161|itemCommandSnapshot|declaration|需要进一步测试|JSON.stringify|
|src/application/legacy-classroom-adapter.js:164|showClassroomSaveWarning|declaration|需要进一步测试|String, document.getElementById, showToast|
|src/application/legacy-classroom-adapter.js:240|runClassroomCommand|declaration|需要进一步测试|classroomCommands.run|
|src/application/legacy-classroom-adapter.js:243|deferClassroomDefense|declaration|需要进一步测试|classroomCommands.defer, Promise.resolve(promise)     .then((answer) => {       if (!isCurrent()) return;       apply(answer);       saveState();       renderAll();     })     .catch, Promise.resolve(promise)     .then, Promise.resolve, isCurrent, apply, saveState, renderAll, console.error, showToast|
|src/application/legacy-classroom-adapter.js:258|useItem|declaration|需要进一步测试|Reliability.invalidateDefenseDecisions, state.groups.find, globalThis.HandItemCinematic?.take, Reliability.validateItem, isCommunismMode, closeItemWindowForFx, showToast, ItemModules.canUse, runClassroomCommand, ensureV2State, itemCommandSnapshot, JSON.parse, Number, CompetitionEffects.cancelUse, Object.keys, ItemModules.execute, ItemOperationBlocks.run, markItemUsedThisRoundV2177, context.emit, context.onCommit, presentation.targets.map, beforeGroups.find, CompetitionEffects.labels(after).join, CompetitionEffects.labels, ItemImpactFacts.scoreLosses, commit.emit, classroomCommands.whenIdle().then, classroomCommands.whenIdle, playSound, itemSoundCategoryV26, HandItemCinematic.present|
|src/application/legacy-classroom-adapter.js:434|legacyJudgeRound|declaration|需要进一步测试|RoundSettlement.execute|
|src/application/legacy-classroom-adapter.js:438|judgeRound|declaration|需要进一步测试|Reliability.calculateRoundScores, themeAlert, runClassroomCommand, legacyJudgeRound, context.emit, classroomCommands.whenIdle().then, classroomCommands.whenIdle, RoundSettlement.present|
|src/application/manual-score-commands.js:3|adjust|declaration|需要进一步测试|Reliability.invalidateDefenseDecisions, cancelScoreAnimationAndSync, openPwdModal, state.groups.find, ScoreAdjustments.delta, showToast, runClassroomCommand, playSound, showMilestoneBanner, animateScores, ClassroomFeedback.score|
|src/application/manual-score-commands.js:60|set|declaration|需要进一步测试|state.groups.find, ScoreAdjustments.set, showToast, runClassroomCommand, playSound, animateScores|
|src/application/migration-coordinator.js:3|create|declaration|需要进一步测试|inventory.capture, inventory.prepare, cancelled, inventory.verify, openRepository, repository.importSnapshot, repository.recordMigrationStatus, inventory.verifyDestination, String, repository?.close|
|src/application/migration-coordinator.js:8|preview|declaration|需要进一步测试|inventory.capture, inventory.prepare|
|src/application/migration-coordinator.js:30|execute|declaration|需要进一步测试|cancelled, inventory.capture, inventory.prepare, inventory.verify, openRepository, repository.importSnapshot, repository.recordMigrationStatus, inventory.verifyDestination, String, repository?.close|
|src/application/migration-coordinator.js:33|cancelled|binding|需要进一步测试||
|src/application/round-settlement.js:3|execute|declaration|需要进一步测试|CompetitionEffects.blockedAllIn, ranking().map, ranking, state.groups.map, state.groups         .filter((group) => group?.itemEffect?.type === "power")         .map, state.groups         .filter, settleBaseRoundLegacy, RoundItemEffects.settle, ensureV2State, RoundItemEffects.expire, groups.find, groups.filter, context.groupsBefore         .filter((before) =>           state.groups.some(             (g) => g.id === before.id && g.score !== before.score,           ),         )         .map, context.groupsBefore         .filter, state.groups.some, state.groups.find, context.answersBefore.map, rankOf|
|src/application/round-settlement.js:39|rankOf|binding|需要进一步测试|groups.find, groups.filter|
|src/application/round-settlement.js:80|present|declaration|需要进一步测试|RoundFeedback.afterPowerRound, RoundSettlement.captureRoundToken, animateCardsFromSnapshotV21725, state.groups.forEach, document.querySelector, card.classList.add, setTimeout, card.classList.remove, animateScores, playSound, milestoneGroups.forEach, bgmTriggerVictory|
|src/application/round-settlement.js:122|start|declaration|需要进一步测试|captureCardRectsV21725, runClassroomCommand, resetRoundItemUseLocksV2177, state.groups.forEach, classroomCommands.whenIdle, renderAll, animateCardsFromSnapshotV21725|
|src/application/round-settlement.js:154|captureRoundToken|declaration|需要进一步测试|JSON.stringify, state.groups.map|
|src/application/round-settlement.js:168|isRoundTokenCurrent|declaration|需要进一步测试|JSON.stringify, state.groups.map|
|src/application/round-settlement.js:190|forceEnd|declaration|需要进一步测试|JSON.stringify, state.groups.map, themeConfirm, ClassroomWriteBarrier.allow, showToast, captureCardRectsV21725, runClassroomCommand, classroomCommands.whenIdle, bgmStopAll, renderAll, animateCardsFromSnapshotV21725|
|src/application/transactional-command-service.js:3|fault|declaration|需要进一步测试||
|src/application/transactional-command-service.js:9|text|declaration|需要进一步测试|value.trim, fault|
|src/application/transactional-command-service.js:14|capture|declaration|需要进一步测试|DomainValues.cloneJson, fault, String, Number.isSafeInteger, text, DomainEvents.isValidSource, freeze|
|src/application/transactional-command-service.js:41|create|declaration|需要进一步测试|fault, checkCancelled, authorize, repository.findCommand, Object.hasOwn, repository.read, DomainEvents.createScope, Object.freeze, DomainValues.cloneJson, handler, freeze, String, validateSnapshot, events.list, repository.commit, publish, reportPresentationError, console.error, events.close, capture, Promise.reject, JSON.stringify, inFlight.get, execute(request, options).finally, execute, inFlight.delete, inFlight.set, inFlight.has|
|src/application/transactional-command-service.js:56|execute|declaration|需要进一步测试|fault, checkCancelled, authorize, repository.findCommand, Object.hasOwn, repository.read, DomainEvents.createScope, Object.freeze, DomainValues.cloneJson, handler, freeze, String, validateSnapshot, events.list, repository.commit, publish, reportPresentationError, console.error, events.close|
|src/application/transactional-command-service.js:57|checkCancelled|binding|需要进一步测试|fault|
|src/application/transactional-command-service.js:148|dispatch|declaration|需要进一步测试|capture, Promise.reject, JSON.stringify, inFlight.get, fault, execute(request, options).finally, execute, inFlight.delete, inFlight.set|
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
|src/core/picker-bridge.js:14|currentResult|declaration|仍然必要|state.groups.find, group.members?.includes, parseStudentV218, window.ClassroomAvatarDisplay?.groupDataUrlCached, window.ClassroomAvatarDisplay?.studentDataUrl|
|src/core/picker-bridge.js:34|randomEffectStyle|declaration|仍然必要|Math.floor, Math.random|
|src/core/picker-bridge.js:39|getSnapshot|declaration|仍然必要|['settling', 'revealed'].includes, currentResult, ClassroomFeedback.getOptions, DesktopUI.getPreferences, matchMedia, window.GodpowerTheme?.get, document.getElementById, state.groups.map, (state.itemGlobal?.pickerHistory ／／ []).slice(-30).map, (state.itemGlobal?.pickerHistory ／／ []).slice, randomEffectStyle|
|src/core/picker-bridge.js:58|cancel|declaration|仍然必要|clearInterval, DesktopUI.cancelPickerPreparation, stopRollLoop, resetSlotDisplay, notify|
|src/core/picker-bridge.js:64|command|declaration|仍然必要|cancel, stopSlotSpin, getSnapshot, notify, openPickerModal, DesktopUI.togglePicker, ['individual', 'group', 'two_tier'].includes, setPickerMode, saveState, toggleAntiRepeat, state.groups.some, toggleGroupPreselect, resetPickerPool, currentResult, Number.isSafeInteger, classroomCommands.isPending, applyScoreDelta, syncPickerScoreTarget|
|src/core/reliability.js:6|validateBackup|declaration|仍然必要|Array.isArray, Error, [1, schemaVersion].includes, StableIdentity.isValidSeasonId, AchievementLedger.normalize, data.groups.forEach, StableIdentity.isValidGroupUid, groupUids.has, groupUids.add, Number.isSafeInteger, Number, g.members.some, g.inventory?.some, Object.values, ["individual", "group", "two_tier", ""].includes, values.some, ["string", "number"].includes, Object.values(eligible).some, Object.values(throttle.groupStrongSkip).some, validateBackup|
|src/core/reliability.js:232|phase|declaration|仍然必要|CompetitionPhase.derive|
|src/core/reliability.js:235|validateItem|declaration|仍然必要|Number, [         "triple_green",         "triple_red",         "triple_banana",         "triple_mushroom",       ].includes, ["star", "mega", "power"].includes|
|src/core/reliability.js:260|onDefenseInvalidation|declaration|仍然必要|defenseInvalidationHandlers.add, defenseInvalidationHandlers.delete|
|src/core/reliability.js:266|invalidateDefenseDecisions|declaration|仍然必要|handler|
|src/core/reliability.js:273|captureDefenseDecision|declaration|仍然必要|Array.isArray, s.groups.includes, phase|
|src/core/reliability.js:300|isDefenseDecisionCurrent|declaration|仍然必要|Array.isArray, s.groups.find, phase, Object.is|
|src/core/reliability.js:324|planBatchScoreChanges|declaration|仍然必要|Number.isSafeInteger, Error, Array.isArray, groups.map, groupCounts.map, groupMap.get, Number|
|src/core/reliability.js:346|safeImage|declaration|仍然必要|/^data:image\/(?:png／jpe?g／webp／gif);base64,[a-zA-Z0-9+/=\s]+$/.test|
|src/core/reliability.js:354|count|declaration|仍然必要|Number, Number.isSafeInteger|
|src/core/reliability.js:358|normalizeStats|declaration|仍然必要|Object.fromEntries, ["correct", "wrong", "draws", "used"].map, count|
|src/core/reliability.js:363|normalizeEffect|declaration|仍然必要|Array.isArray, ["star", "mega", "power", "bullet"].includes, Object.hasOwn, count, Object.keys|
|src/core/reliability.js:380|calculateRoundScores|declaration|仍然必要|CompetitionRules.calculateRound(s).map, CompetitionRules.calculateRound|
|src/core/reliability.js:385|csvText|declaration|仍然必要|String, /^[\s]*[=+@-]/.test|
|src/domain/achievements/learning-rules.js:35|evaluate|declaration|需要进一步测试|condition, unlocked.push|
|src/domain/achievements/ledger.js:4|clone|binding|需要进一步测试|DomainValues.cloneJson|
|src/domain/achievements/ledger.js:6|empty|declaration|需要进一步测试||
|src/domain/achievements/ledger.js:10|normalize|declaration|需要进一步测试|empty, Array.isArray, clone, Object.entries, StableIdentity.isValidGroupUid, Object.values(counters).some, Object.values, Number.isSafeInteger, emptySeasonProgress, Object.entries(progress.seasonProgress).some, progress.processedEvents.some|
|src/domain/achievements/ledger.js:80|newGroupProgress|declaration|需要进一步测试|emptySeasonProgress|
|src/domain/achievements/ledger.js:94|emptySeasonProgress|declaration|需要进一步测试||
|src/domain/achievements/ledger.js:105|apply|declaration|需要进一步测试|normalize, Array.isArray, DomainEvents.isAchievementEligible, StableIdentity.isValidGroupUid, newGroupProgress, seenInBatch.has, progress.processedEvents.includes, seenInBatch.add, StableIdentity.isValidSeasonId, emptySeasonProgress, progress.itemDiscovery.includes, progress.itemDiscovery.push, LearningAchievementRules.evaluate, progress.processedEvents.push, unlocked.push, groupUnlocks.map|
|src/domain/classroom-roster.js:3|clone|binding|需要进一步测试|JSON.parse, JSON.stringify|
|src/domain/classroom-roster.js:4|fail|binding|需要进一步测试||
|src/domain/classroom-roster.js:7|validId|binding|需要进一步测试|root.StableIdentity[check]|
|src/domain/classroom-roster.js:9|validateRosterDocument|declaration|需要进一步测试|Array.isArray, fail, validId, profileIds.has, profile.displayName.trim, profileIds.add, classrooms.has, classroom.name.trim, classroom.studentIds.some, classrooms.set, students.has, student.displayName.trim, students.set, students.get, students.values, classrooms           .get(student.classroomId)           .studentIds.includes, classrooms           .get, assignmentKeys.has, assignmentKeys.add, assignedStudents.has, assignedStudents.add, clone|
|src/domain/classroom-roster.js:131|createRosterDocument|declaration|需要进一步测试|validateRosterDocument, clone|
|src/domain/classroom-roster.js:142|previewLegacyRoster|declaration|需要进一步测试|validId, fail, Array.isArray, seenGroups.has, seenGroups.add, member.trim, idFactory, studentIds.includes, students.push, studentIds.push, groupAssignments.push, createRosterDocument|
|src/domain/classroom-roster.js:209|projectLegacyMembers|declaration|需要进一步测试|validateRosterDocument, valid.assignments.find, fail, groups.map, availableGroups.has, valid.students.find, byGroup.get, names.push, byGroup.set|
|src/domain/classroom-roster.js:240|planCompetitionMemberUpdate|declaration|需要进一步测试|Array.isArray, fail, validateRosterDocument, valid.assignments.find, validId, ids.has, ids.add, groups.map, projectLegacyMembers, projected.map, JSON.stringify, groupChanges.filter, groupChanges.reduce|
|src/domain/competition/effects.js:15|defensiveType|binding|需要进一步测试||
|src/domain/competition/effects.js:19|normalize|declaration|需要进一步测试|Object.keys, Number, Number.isSafeInteger, Math.min|
|src/domain/competition/effects.js:31|has|declaration|需要进一步测试|defensiveType, Number|
|src/domain/competition/effects.js:36|apply|declaration|需要进一步测试|Number.isSafeInteger, has, normalize, Object.keys(effects).filter, Object.keys, Math.max, Math.min|
|src/domain/competition/effects.js:57|arm|declaration|需要进一步测试|Date.now|
|src/domain/competition/effects.js:69|release|declaration|需要进一步测试|(group.inventory ／／ []).findIndex, group.inventory.splice|
|src/domain/competition/effects.js:79|tick|declaration|需要进一步测试|has|
|src/domain/competition/effects.js:86|tickDefensive|declaration|需要进一步测试|Number, Number.isSafeInteger, release|
|src/domain/competition/effects.js:94|cleanse|declaration|需要进一步测试|normalize, negative.forEach|
|src/domain/competition/effects.js:98|blockedAllIn|declaration|需要进一步测试|has|
|src/domain/competition/effects.js:105|cancelUse|declaration|需要进一步测试|has|
|src/domain/competition/effects.js:110|redirect|declaration|需要进一步测试|has, random, tick|
|src/domain/competition/effects.js:116|answer|declaration|需要进一步测试|has, Math.min, random, Math.floor, Object.keys, tick, tickDefensive|
|src/domain/competition/effects.js:136|labels|declaration|需要进一步测试|Object.entries(definitions)       .filter(([key]) => has(group, key))       .map, Object.entries(definitions)       .filter, Object.entries, has, Number, Number.isSafeInteger|
|src/domain/competition/phase.js:3|derive|declaration|需要进一步测试||
|src/domain/competition/ranking.js:3|ordered|declaration|需要进一步测试|groups       .map((group, index) => ({ group, index }))       .sort(         (a, b) =>           (Number(b.group.score) ／／ 0) - (Number(a.group.score) ／／ 0) ／／           a.index - b.index,       )       .map, groups       .map((group, index) => ({ group, index }))       .sort, groups       .map, Number|
|src/domain/competition/rules.js:3|calculateRound|declaration|需要进一步测试|Array.isArray, ["A", "B", "C", "D"].includes, groups.map, Number, Number.isSafeInteger|
|src/domain/competition/score-adjustments.js:3|set|declaration|需要进一步测试|Number.isSafeInteger, Math.floor(Math.abs(after)).toString, Math.floor, Math.abs, Math.floor(Math.abs(before)).toString|
|src/domain/competition/score-adjustments.js:17|delta|declaration|需要进一步测试|Number.isSafeInteger, set|
|src/domain/events.js:19|requiredText|declaration|需要进一步测试|value.trim|
|src/domain/events.js:27|normalizeTime|declaration|需要进一步测试|Number.isFinite, date.getTime, date.toISOString|
|src/domain/events.js:34|createScope|declaration|需要进一步测试|requiredText, SOURCES.has, TYPES.has, String, cloneJson, Array.isArray, JSON.stringify, encodeURIComponent(serialized).replace, encodeURIComponent, deepFreeze, normalizeTime, now, records.push, records.slice|
|src/domain/events.js:50|emit|declaration|需要进一步测试|TYPES.has, requiredText, String, cloneJson, Array.isArray, JSON.stringify, encodeURIComponent(serialized).replace, encodeURIComponent, deepFreeze, normalizeTime, now, records.push|
|src/domain/events.js:107|isAchievementEligible|declaration|需要进一步测试|TYPES.has|
|src/domain/home-layout.js:9|clone|binding|需要进一步测试|JSON.parse, JSON.stringify|
|src/domain/home-layout.js:10|fail|binding|需要进一步测试||
|src/domain/home-layout.js:14|validateJson|declaration|需要进一步测试|fail, Number.isFinite, Array.isArray, validateJson, Object.keys, ["__proto__", "prototype", "constructor"].includes|
|src/domain/home-layout.js:40|validSize|declaration|需要进一步测试|Number.isInteger|
|src/domain/home-layout.js:62|normalizeCatalog|declaration|需要进一步测试|Array.isArray, fail, TYPE_ID.test, map.has, validSize, map.set, clone, Number.isInteger|
|src/domain/home-layout.js:90|intersects|declaration|需要进一步测试||
|src/domain/home-layout.js:96|validateLayout|declaration|需要进一步测试|Array.isArray, INSTANCE_ID.test, input.name.trim, Number.isSafeInteger, fail, input.instances.map, ids.has, TYPE_ID.test, Number.isInteger, ids.add, validateJson, clone, intersects|
|src/domain/home-layout.js:171|emptyLayout|declaration|需要进一步测试|validateLayout|
|src/domain/home-layout.js:182|createDefaultLayout|declaration|需要进一步测试|Array.isArray, fail, validSize, makeInstanceId, instances.push, Number.isInteger, Math.max, validateLayout|
|src/domain/home-layout.js:222|createLayoutService|declaration|需要进一步测试|normalizeCatalog, fail, validateLayout, emptyLayout, clone, types.get, draft.instances.find, undoStack.push, undoStack.shift, draft.instances.some, intersects, requireInstance, instances.find, instances         .filter((item) => item.instanceId !== changedId && item.visible)         .sort, instances         .filter, a.instanceId.localeCompare, placed.some, placed.push, apply, Object.freeze, requireType, validateJson, makeInstanceId, INSTANCE_ID.test, freePosition, draft.instances.filter, Number.isInteger, Math.max, Math.min, repack, [x, y, w, h].every, redoStack.push, undoStack.pop, redoStack.pop|
|src/domain/home-layout.js:230|requireType|binding|需要进一步测试|types.get, fail|
|src/domain/home-layout.js:235|requireInstance|binding|需要进一步测试|draft.instances.find, fail|
|src/domain/home-layout.js:242|apply|declaration|需要进一步测试|validateLayout, undoStack.push, clone, undoStack.shift|
|src/domain/home-layout.js:249|freePosition|declaration|需要进一步测试|draft.instances.some, intersects, fail|
|src/domain/home-layout.js:265|repack|declaration|需要进一步测试|requireInstance, clone, instances.find, instances         .filter((item) => item.instanceId !== changedId && item.visible)         .sort, instances         .filter, a.instanceId.localeCompare, placed.some, intersects, fail, placed.push, apply|
|src/domain/identity.js:9|isValidGroupUid|declaration|需要进一步测试|GROUP_UID_PATTERN.test|
|src/domain/identity.js:13|createUuid|declaration|需要进一步测试|globalThis.crypto.randomUUID, globalThis.crypto.getRandomValues, [...bytes]           .map((value) => value.toString(16).padStart(2, "0"))           .join, [...bytes]           .map, value.toString(16).padStart, value.toString, hex.slice, (globalThis.performance?.now?.() ?? 0).toString, globalThis.performance?.now, Date.now().toString, Date.now, (++fallbackSequence).toString|
|src/domain/identity.js:34|createGroupUid|binding|需要进一步测试|createUuid|
|src/domain/identity.js:35|createItemInstanceId|binding|需要进一步测试|createUuid|
|src/domain/identity.js:36|createSeasonId|binding|需要进一步测试|createUuid|
|src/domain/identity.js:37|createCommandId|binding|需要进一步测试|createUuid|
|src/domain/identity.js:38|createUserProfileId|binding|需要进一步测试|createUuid|
|src/domain/identity.js:39|createClassroomId|binding|需要进一步测试|createUuid|
|src/domain/identity.js:40|createStudentUid|binding|需要进一步测试|createUuid|
|src/domain/identity.js:41|createScheduleId|binding|需要进一步测试|createUuid|
|src/domain/identity.js:42|createResourceId|binding|需要进一步测试|createUuid|
|src/domain/identity.js:44|assignGroupUids|declaration|需要进一步测试|Array.isArray, groups.map, isValidGroupUid, used.has, idFactory, used.add|
|src/domain/identity.js:98|assignEntityUids|declaration|需要进一步测试|Array.isArray, items.map, copy[field].startsWith, isValidGroupUid, used.has, makeId, candidate.startsWith, used.add|
|src/domain/items/defense-policy.js:3|choose|declaration|需要进一步测试|Number, ["star", "mega"].includes, [         "green",         "triple_green",         "red",         "triple_red",         "banana",         "triple_banana",         "horn",       ].includes, ["mushroom", "triple_mushroom"].includes|
|src/domain/items/impact-facts.js:3|scoreLosses|declaration|需要进一步测试|Array.isArray, beforeGroups         .filter((group) => typeof group?.groupUid === "string")         .map, beforeGroups         .filter, beforeByUid.get, Number.isSafeInteger, facts.push|
|src/domain/items/targets.js:3|select|declaration|需要进一步测试|Math.floor, random, randomOne, [c.ranking[c.position - 1]].filter, [c.ranking[c.position + 1]].filter, [c.ranking[c.position - 1], c.ranking[c.position + 1]].filter, c.ranking.slice, [c.ranking[Math.max(0, c.position - 3)]].filter, Math.max, c.ranking           .slice(0, c.position)           .filter(eligible)           .sort(() => random() - 0.5)           .slice, c.ranking           .slice(0, c.position)           .filter(eligible)           .sort, c.ranking           .slice(0, c.position)           .filter, c.ranking           .slice, c.others.filter, globalThis.CompetitionEffects?.has, c.ranking.indexOf, [c.ranking[i - 1], center, c.ranking[i + 1]].filter, Object.hasOwn, selector|
|src/domain/items/targets.js:4|randomOne|binding|需要进一步测试|Math.floor, random|
|src/domain/teaching-resource.js:14|fail|binding|需要进一步测试||
|src/domain/teaching-resource.js:18|formatFor|declaration|需要进一步测试|fileName.lastIndexOf, fileName.slice(index).toLowerCase, fileName.slice|
|src/domain/teaching-resource.js:24|validateMetadata|declaration|需要进一步测试|Array.isArray, fail, root.StableIdentity.isValidGroupUid, input.resourceId.startsWith, root.StableIdentity.isValidUserProfileId, root.StableIdentity.isValidClassroomId, input.subjectId.trim, input.title.trim, /[/\\\0]/.test, formatFor, Number.isSafeInteger, /^[a-f0-9]{64}$/i.test, Number.isNaN, Date.parse, input.tags.map, tag.trim, input.sha256.toLowerCase, new Date(input.importedAt).toISOString|
|src/domain/teaching-resource.js:103|validateFile|declaration|需要进一步测试|fail, formatFor, expected.every, starts, String.fromCharCode, bytes.slice, decoder.decode, JSON.parse, new TextDecoder("latin1").decode, Math.min, header.startsWith, /\/(?:JavaScript／JS／OpenAction／AA／Launch)\b/i.test, validateMetadata|
|src/domain/teaching-resource.js:111|starts|binding|需要进一步测试|expected.every|
|src/domain/teaching-schedule.js:3|clone|binding|需要进一步测试|JSON.parse, JSON.stringify|
|src/domain/teaching-schedule.js:4|fail|binding|需要进一步测试||
|src/domain/teaching-schedule.js:8|validateDocument|declaration|需要进一步测试|Array.isArray, fail, input.entries.map, root.StableIdentity.isValidGroupUid, entry.scheduleId.startsWith, ids.has, ids.add, root.StableIdentity.isValidUserProfileId, root.StableIdentity.isValidClassroomId, Number.isInteger, entry.subjectId.trim, clone|
|src/domain/teaching-schedule.js:82|createDocument|declaration|需要进一步测试|validateDocument|
|src/domain/teaching-schedule.js:86|findCurrentLesson|declaration|需要进一步测试|validateDocument, root.StableIdentity.isValidUserProfileId, fail, Number.isInteger, valid.entries.find|
|src/domain/values.js:3|cloneJson|declaration|需要进一步测试|Number.isFinite, seen.has, Array.isArray, Object.getPrototypeOf, seen.add, value.map, cloneJson, Object.keys(value).sort, Object.keys, ["__proto__", "prototype", "constructor"].includes, Object.getOwnPropertyDescriptor, Object.hasOwn, seen.delete|
|src/domain/values.js:47|deepFreeze|declaration|需要进一步测试|Object.isFrozen, Object.values, deepFreeze, Object.freeze|
|src/infrastructure/classroom-roster-repository.js:4|clone|binding|需要进一步测试|JSON.parse, JSON.stringify|
|src/infrastructure/classroom-roster-repository.js:6|createClassroomRosterRepository|declaration|需要进一步测试|storage.getItem, JSON.parse, Number.isSafeInteger, root.ClassroomRoster.validateRosterDocument, read, JSON.stringify, storage.setItem, clone, storage.removeItem, Object.freeze|
|src/infrastructure/classroom-roster-repository.js:14|read|declaration|需要进一步测试|storage.getItem, JSON.parse, Number.isSafeInteger, root.ClassroomRoster.validateRosterDocument|
|src/infrastructure/classroom-roster-repository.js:37|write|declaration|需要进一步测试|read, Number.isSafeInteger, root.ClassroomRoster.validateRosterDocument, storage.getItem, JSON.stringify, storage.setItem, clone, storage.removeItem|
|src/infrastructure/home-layout-repository.js:4|clone|binding|需要进一步测试|JSON.parse, JSON.stringify|
|src/infrastructure/home-layout-repository.js:6|createHomeLayoutRepository|declaration|需要进一步测试|storage.getItem, JSON.parse, Number.isSafeInteger, root.HomeLayout.validateLayout, read, JSON.stringify, storage.setItem, clone, storage.removeItem, Object.freeze|
|src/infrastructure/home-layout-repository.js:15|read|declaration|需要进一步测试|storage.getItem, JSON.parse, Number.isSafeInteger, root.HomeLayout.validateLayout|
|src/infrastructure/home-layout-repository.js:51|write|declaration|需要进一步测试|read, Number.isSafeInteger, root.HomeLayout.validateLayout, storage.getItem, JSON.stringify, storage.setItem, clone, storage.removeItem|
|src/infrastructure/indexeddb/repository.js:20|fault|declaration|需要进一步测试||
|src/infrastructure/indexeddb/repository.js:25|identifier|declaration|需要进一步测试|value.trim, fault|
|src/infrastructure/indexeddb/repository.js:33|fingerprint|declaration|需要进一步测试|fault, new TextEncoder().encode, JSON.stringify, globalThis.crypto.subtle.digest, [...new Uint8Array(digest)]       .map((byte) => byte.toString(16).padStart(2, "0"))       .join, [...new Uint8Array(digest)]       .map, byte.toString(16).padStart, byte.toString|
|src/infrastructure/indexeddb/repository.js:45|transaction|declaration|需要进一步测试|db.transaction, fault, String, tx.abort, reject, fn, abort, resolve, operation|
|src/infrastructure/indexeddb/repository.js:50|abort|binding|需要进一步测试|fault, String, tx.abort, reject|
|src/infrastructure/indexeddb/repository.js:61|guard|binding|需要进一步测试|fn, abort|
|src/infrastructure/indexeddb/repository.js:68|tx.oncomplete|assignment|需要进一步测试|resolve|
|src/infrastructure/indexeddb/repository.js:69|tx.onabort|assignment|需要进一步测试|reject, fault|
|src/infrastructure/indexeddb/repository.js:77|tx.onerror|assignment|需要进一步测试|fault|
|src/infrastructure/indexeddb/repository.js:97|readOne|declaration|需要进一步测试|db.transaction, tx.objectStore(store).get, tx.objectStore, resolve, reject, fault|
|src/infrastructure/indexeddb/repository.js:101|tx.oncomplete|assignment|需要进一步测试|resolve|
|src/infrastructure/indexeddb/repository.js:102|tx.onabort|assignment|需要进一步测试|reject, fault|
|src/infrastructure/indexeddb/repository.js:106|tx.onerror|assignment|需要进一步测试|reject, fault|
|src/infrastructure/indexeddb/repository.js:115|open|declaration|需要进一步测试|identifier, fault, indexedDB.open, STORES.forEach, database.objectStoreNames.contains, database.createObjectStore, request.transaction.objectStore, events.indexNames.contains, events.createIndex, resolve, reject, db.close, structuredClone, Number.isSafeInteger, validateSnapshot, Array.isArray, fingerprint, transaction, tx.objectStore, commands.get, guard, abort, done, aggregates.get, aggregates.put, tx.objectStore("events").add, tx.objectStore("archives").add, commands.add, String, migrations.get, aggregates.add, tx.objectStore("resources").add, new Date().toISOString, migrations.add, allowed.includes, store.get, tx.objectStore("aggregates").get, store.put, db.transaction, tx           .objectStore("events")           .index("aggregateId")           .getAll, tx           .objectStore("events")           .index, tx           .objectStore, readOne|
|src/infrastructure/indexeddb/repository.js:124|request.onupgradeneeded|assignment|需要进一步测试|STORES.forEach, database.objectStoreNames.contains, database.createObjectStore, request.transaction.objectStore, events.indexNames.contains, events.createIndex|
|src/infrastructure/indexeddb/repository.js:134|request.onsuccess|assignment|需要进一步测试|resolve|
|src/infrastructure/indexeddb/repository.js:135|request.onerror|assignment|需要进一步测试|reject, fault|
|src/infrastructure/indexeddb/repository.js:142|request.onblocked|assignment|需要进一步测试|reject, fault|
|src/infrastructure/indexeddb/repository.js:150|db.onversionchange|assignment|需要进一步测试|db.close|
|src/infrastructure/indexeddb/repository.js:152|commit|declaration|需要进一步测试|structuredClone, identifier, Number.isSafeInteger, fault, validateSnapshot, Array.isArray, fingerprint, transaction, tx.objectStore, commands.get, guard, abort, done, aggregates.get, aggregates.put, tx.objectStore("events").add, tx.objectStore("archives").add, commands.add|
|src/infrastructure/indexeddb/repository.js:256|importSnapshot|declaration|需要进一步测试|structuredClone, fault, String, identifier, validateSnapshot, Array.isArray, fingerprint, transaction, tx.objectStore, migrations.get, guard, abort, done, aggregates.get, aggregates.add, tx.objectStore("archives").add, tx.objectStore("resources").add, new Date().toISOString, migrations.add|
|src/infrastructure/indexeddb/repository.js:335|recordMigrationStatus|declaration|需要进一步测试|structuredClone, identifier, allowed.includes, fault, fingerprint, transaction, tx.objectStore, store.get, guard, abort, tx.objectStore("aggregates").get, new Date().toISOString, store.put, done|
|src/infrastructure/indexeddb/repository.js:410|listEvents|declaration|需要进一步测试|db.transaction, tx           .objectStore("events")           .index("aggregateId")           .getAll, tx           .objectStore("events")           .index, tx           .objectStore, resolve, reject, fault|
|src/infrastructure/indexeddb/repository.js:417|tx.oncomplete|assignment|需要进一步测试|resolve|
|src/infrastructure/indexeddb/repository.js:418|tx.onabort|assignment|需要进一步测试|reject, fault|
|src/infrastructure/indexeddb/repository.js:424|findCommand|declaration|需要进一步测试|identifier, fingerprint, structuredClone, readOne, fault|
|src/infrastructure/legacy/audio-migration.js:3|alias|declaration|需要进一步测试|id.startsWith, id.slice|
|src/infrastructure/legacy/audio-migration.js:15|openExisting|declaration|需要进一步测试|indexedDB.open, request.transaction.abort, resolve, reject|
|src/infrastructure/legacy/audio-migration.js:19|request.onupgradeneeded|assignment|需要进一步测试|request.transaction.abort|
|src/infrastructure/legacy/audio-migration.js:23|request.onsuccess|assignment|需要进一步测试|resolve|
|src/infrastructure/legacy/audio-migration.js:24|request.onerror|assignment|需要进一步测试|resolve, reject|
|src/infrastructure/legacy/audio-migration.js:25|request.onblocked|assignment|需要进一步测试|reject|
|src/infrastructure/legacy/audio-migration.js:29|readSource|declaration|需要进一步测试|openExisting, source.objectStoreNames.contains, source.transaction, tx.objectStore("sounds").getAll, tx.objectStore, resolve, reject, source.close|
|src/infrastructure/legacy/audio-migration.js:37|tx.oncomplete|assignment|需要进一步测试|resolve|
|src/infrastructure/legacy/audio-migration.js:38|tx.onabort|assignment|需要进一步测试|reject|
|src/infrastructure/legacy/audio-migration.js:45|run|declaration|需要进一步测试|storage.getItem, destination?.objectStoreNames.contains, readSource, alias, records.has, records.set, destination.transaction, tx.objectStore, records.values, store.get, store.add, copiedRecords.push, tx.abort, resolve, reject, copiedRecords.map, tx.objectStore("sounds").get, new Uint8Array(actual).some, storage.setItem|
|src/infrastructure/legacy/audio-migration.js:78|existing.onsuccess|assignment|需要进一步测试|store.add, copiedRecords.push, tx.abort|
|src/infrastructure/legacy/audio-migration.js:93|tx.oncomplete|assignment|需要进一步测试|resolve|
|src/infrastructure/legacy/audio-migration.js:94|tx.onabort|assignment|需要进一步测试|reject|
|src/infrastructure/legacy/audio-migration.js:104|tx.oncomplete|assignment|需要进一步测试|new Uint8Array(actual).some, reject, resolve|
|src/infrastructure/legacy/audio-migration.js:121|tx.onabort|assignment|需要进一步测试|reject|
|src/infrastructure/legacy/classroom-repository.js:3|writeVerified|declaration|需要进一步测试|JSON.stringify, storage.setItem, storage.getItem, String|
|src/infrastructure/legacy/classroom-repository.js:14|appendArchive|declaration|需要进一步测试|storage.getItem, JSON.parse, Array.isArray, archives.find, JSON.stringify, comparableSnapshot, writeVerified, String|
|src/infrastructure/legacy/classroom-repository.js:20|sameArchive|binding|需要进一步测试||
|src/infrastructure/legacy/classroom-repository.js:26|comparableSnapshot|binding|需要进一步测试|Array.isArray, JSON.stringify|
|src/infrastructure/legacy/classroom-repository.js:54|parse|declaration|需要进一步测试|JSON.parse|
|src/infrastructure/legacy/classroom-repository.js:62|loadOrMigrate|declaration|需要进一步测试|storage.getItem, parse, migrate, validate, JSON.stringify, storage.setItem, fallbackData, now().toISOString, now, writeVerified, storage.removeItem, String|
|src/infrastructure/legacy/inventory.js:9|digest|declaration|需要进一步测试|crypto.subtle.digest, [...new Uint8Array(hash)]       .map((byte) => byte.toString(16).padStart(2, "0"))       .join, [...new Uint8Array(hash)]       .map, byte.toString(16).padStart, byte.toString|
|src/infrastructure/legacy/inventory.js:17|utf8|binding|需要进一步测试|new TextEncoder().encode|
|src/infrastructure/legacy/inventory.js:18|canonical|declaration|需要进一步测试|Number.isFinite, ["string", "boolean", "number"].includes, digest, ArrayBuffer.isView, canonical, value.buffer.slice, value.arrayBuffer, value.toISOString, seen.has, Array.isArray, Object.getPrototypeOf, seen.add, Promise.all, value.map, Object.keys(value)               .sort()               .map, Object.keys(value)               .sort, Object.keys|
|src/infrastructure/legacy/inventory.js:77|hashValue|declaration|需要进一步测试|digest, utf8, JSON.stringify, canonical|
|src/infrastructure/legacy/inventory.js:80|readLocal|declaration|需要进一步测试|Array.from({ length: storage.length }, (_, index) =>       storage.key(index),     )       .filter(         (key) => typeof key === "string" && /^(godpower_／politics_)/.test(key),       )       .sort, Array.from({ length: storage.length }, (_, index) =>       storage.key(index),     )       .filter, Array.from, storage.key, /^(godpower_／politics_)/.test, keys.map, storage.getItem|
|src/infrastructure/legacy/inventory.js:90|readDatabase|declaration|需要进一步测试|indexedDB.open, request.transaction.abort, resolve, reject, db.transaction, stores.map, tx.objectStore(store).getAll, tx.objectStore, tx.objectStore(store).getAllKeys, requests.flatMap, values.result.map, db.close|
|src/infrastructure/legacy/inventory.js:93|request.onupgradeneeded|assignment|需要进一步测试|request.transaction.abort|
|src/infrastructure/legacy/inventory.js:96|request.onsuccess|assignment|需要进一步测试|resolve|
|src/infrastructure/legacy/inventory.js:97|request.onerror|assignment|需要进一步测试|reject|
|src/infrastructure/legacy/inventory.js:101|request.onblocked|assignment|需要进一步测试|reject|
|src/infrastructure/legacy/inventory.js:114|tx.oncomplete|assignment|需要进一步测试|resolve, requests.flatMap, values.result.map|
|src/infrastructure/legacy/inventory.js:124|tx.onabort|assignment|需要进一步测试|reject|
|src/infrastructure/legacy/inventory.js:131|capture|declaration|需要进一步测试|readLocal, sourceManifest.push, digest, utf8, (await indexedDB.databases()).map, indexedDB.databases, existing.has, hashValue, existing.get, readDatabase, JSON.stringify, canonical, resources.push, sourceManifest.sort, a.id.localeCompare|
|src/infrastructure/legacy/inventory.js:204|prepare|declaration|需要进一步测试|captured.localEntries.map, map.get, hashValue, newIdentity, StableIdentity.assignGroupUids, storage.getItem, SchemaMigrations.fromLegacyKeys, JSON.parse, Reliability.validateBackup, SchemaMigrations.migrateBackup, Object.hasOwn, captured.resources.slice, resources.push, Array.isArray, archives.some, (await hashValue(captured.sourceOrigin)).slice, Promise.all, archives.map|
|src/infrastructure/legacy/inventory.js:215|newIdentity|binding|需要进一步测试||
|src/infrastructure/legacy/inventory.js:279|verify|declaration|需要进一步测试|capture, JSON.stringify|
|src/infrastructure/legacy/inventory.js:293|verifyDestination|declaration|需要进一步测试|repository.read, hashValue, failures.push, repository.readArchive, repository.readResource, repository.getMigration|
|src/infrastructure/legacy/schema-migrations.js:6|copy|declaration|需要进一步测试|JSON.parse, JSON.stringify|
|src/infrastructure/legacy/schema-migrations.js:10|parseKey|declaration|需要进一步测试|storage.getItem, JSON.parse|
|src/infrastructure/legacy/schema-migrations.js:15|optionalNumber|declaration|需要进一步测试|storage.getItem, Number|
|src/infrastructure/legacy/schema-migrations.js:20|optionalBoolean|declaration|需要进一步测试|storage.getItem|
|src/infrastructure/legacy/schema-migrations.js:25|fromLegacyKeys|declaration|需要进一步测试|parseKey, Array.isArray, now().toISOString, now, storage.getItem, optionalNumber, optionalBoolean|
|src/infrastructure/legacy/schema-migrations.js:55|migrateBackup|declaration|需要进一步测试|Array.isArray, Number.isInteger, copy, identity.assignGroupUids, currentGroups.map, String, group.inventory.map, signatureFor, occurrences.get, occurrences.set, currentItemIds.get, historicItemIds.get, identity.isValidItemInstanceId, local.has, identity.createItemInstanceId, local.add, historicItemIds.has, historicItemIds.set, currentItemIds.has, currentItemIds.set, currentGroups.forEach, normalizeInventory, output.history.map, migrated.groups.map, identity.isValidGroupUid, byLegacyId.get, assigned.forEach, identity.isValidSeasonId, identity.createSeasonId, now().toISOString, now|
|src/infrastructure/legacy/schema-migrations.js:80|signatureFor|declaration|需要进一步测试|String|
|src/infrastructure/legacy/schema-migrations.js:83|normalizeInventory|declaration|需要进一步测试|Array.isArray, group.inventory.map, signatureFor, occurrences.get, occurrences.set, currentItemIds.get, historicItemIds.get, identity.isValidItemInstanceId, local.has, identity.createItemInstanceId, local.add, historicItemIds.has, historicItemIds.set, currentItemIds.has, currentItemIds.set|
|src/infrastructure/save-file-bridge.js:6|bridge|binding|需要进一步测试||
|src/infrastructure/save-file-bridge.js:15|available|declaration|需要进一步测试|bridge|
|src/infrastructure/save-file-bridge.js:24|refreshInfo|declaration|需要进一步测试|available, bridge().saveFileInfo, bridge, String|
|src/infrastructure/save-file-bridge.js:38|hydrate|declaration|需要进一步测试|available, refreshInfo, bridge().saveFileRead, bridge, String, Reliability.validateBackup|
|src/infrastructure/save-file-bridge.js:73|write|declaration|需要进一步测试|available, Promise.resolve()       .then(() => bridge().saveFileWrite(payload))       .then((result) => {         if (result?.ok) {           lastError = null;           if (result.info) info = result.info;         } else {           lastError = result?.error ／／ "存档文件写入失败";           showClassroomSaveWarning("存档文件未写入：" + lastError);         }       })       .catch, Promise.resolve()       .then(() => bridge().saveFileWrite(payload))       .then, Promise.resolve()       .then, Promise.resolve, bridge().saveFileWrite, bridge, showClassroomSaveWarning, String|
|src/infrastructure/save-file-bridge.js:95|choose|declaration|需要进一步测试|available, bridge().saveFileChoose, bridge, String|
|src/infrastructure/save-file-bridge.js:109|setPath|declaration|需要进一步测试|available, bridge().saveFileSet, bridge, String|
|src/infrastructure/save-file-bridge.js:120|reset|declaration|需要进一步测试|available, bridge().saveFileReset, bridge, String|
|src/infrastructure/save-file-bridge.js:133|loadFromFile|declaration|需要进一步测试|available, bridge().saveFileRead, bridge, String, Reliability.validateBackup|
|src/infrastructure/teaching-resource-repository.js:6|fault|binding|需要进一步测试|Object.assign|
|src/infrastructure/teaching-resource-repository.js:8|requestValue|declaration|需要进一步测试|resolve, reject, fault|
|src/infrastructure/teaching-resource-repository.js:10|request.onsuccess|assignment|需要进一步测试|resolve|
|src/infrastructure/teaching-resource-repository.js:11|request.onerror|assignment|需要进一步测试|reject, fault|
|src/infrastructure/teaching-resource-repository.js:18|transactionDone|declaration|需要进一步测试|resolve, reject, fault|
|src/infrastructure/teaching-resource-repository.js:20|transaction.oncomplete|assignment|需要进一步测试|resolve|
|src/infrastructure/teaching-resource-repository.js:21|transaction.onabort|assignment|需要进一步测试|reject, fault|
|src/infrastructure/teaching-resource-repository.js:26|transaction.onerror|assignment|需要进一步测试|reject, fault|
|src/infrastructure/teaching-resource-repository.js:34|hex|declaration|需要进一步测试|[...new Uint8Array(bytes)]       .map((value) => value.toString(16).padStart(2, "0"))       .join, [...new Uint8Array(bytes)]       .map, value.toString(16).padStart, value.toString|
|src/infrastructure/teaching-resource-repository.js:40|open|declaration|需要进一步测试|fault, indexedDB.open, request.result.createObjectStore, metadata.createIndex, resolve, reject, database.close, hex, crypto.subtle.digest, file.arrayBuffer, root.TeachingResource.validateFile, root.StableIdentity.createResourceId, file.name.replace, hash, now().toISOString, now, input.expectedSha256.toLowerCase, Array.isArray, Promise.all, files.map, ids.has, hashes.has, ids.add, hashes.add, storageManager.estimate, prepared.reduce, Number.isFinite, database.transaction, transactionDone, tx.objectStore, prepared.map, requestValue, store.index("sha256").get, store.index, existing.some, tx.abort, store.add, tx.objectStore(BLOB_STORE).add, get, actual.blob.arrayBuffer, rollback.objectStore(STORE).delete, rollback.objectStore, rollback.objectStore(BLOB_STORE).delete, tx.objectStore(STORE).get, tx.objectStore(BLOB_STORE).get, tx.objectStore(STORE).getAll, String(filter.query ／／ "")         .trim()         .toLocaleLowerCase, String(filter.query ／／ "")         .trim, String, all         .filter(           (item) =>             (!filter.profileId ／／ item.profileId === filter.profileId) &&             (!filter.classroomId ／／ item.classroomId === filter.classroomId) &&             (!filter.subjectId ／／ item.subjectId === filter.subjectId),         )         .filter(           (item) =>             !query ／／             [item.title, item.subjectId, item.fileName, ...item.tags].some(               (value) => value.toLocaleLowerCase().includes(query),             ),         )         .sort, all         .filter(           (item) =>             (!filter.profileId ／／ item.profileId === filter.profileId) &&             (!filter.classroomId ／／ item.classroomId === filter.classroomId) &&             (!filter.subjectId ／／ item.subjectId === filter.subjectId),         )         .filter, all         .filter, [item.title, item.subjectId, item.fileName, ...item.tags].some, value.toLocaleLowerCase().includes, value.toLocaleLowerCase, right.importedAt.localeCompare, tx.objectStore(STORE).delete, tx.objectStore(BLOB_STORE).delete, list, metadata.map, Object.freeze|
|src/infrastructure/teaching-resource-repository.js:51|request.onupgradeneeded|assignment|需要进一步测试|request.result.createObjectStore, metadata.createIndex|
|src/infrastructure/teaching-resource-repository.js:61|request.onsuccess|assignment|需要进一步测试|resolve|
|src/infrastructure/teaching-resource-repository.js:62|request.onerror|assignment|需要进一步测试|reject, fault|
|src/infrastructure/teaching-resource-repository.js:69|request.onblocked|assignment|需要进一步测试|reject, fault|
|src/infrastructure/teaching-resource-repository.js:77|database.onversionchange|assignment|需要进一步测试|database.close|
|src/infrastructure/teaching-resource-repository.js:79|hash|declaration|需要进一步测试|hex, crypto.subtle.digest|
|src/infrastructure/teaching-resource-repository.js:83|prepare|declaration|需要进一步测试|fault, file.arrayBuffer, root.TeachingResource.validateFile, root.StableIdentity.createResourceId, file.name.replace, hash, now().toISOString, now, input.expectedSha256.toLowerCase|
|src/infrastructure/teaching-resource-repository.js:130|addBatch|declaration|需要进一步测试|Array.isArray, fault, Promise.all, files.map, ids.has, hashes.has, ids.add, hashes.add, storageManager.estimate, prepared.reduce, Number.isFinite, database.transaction, transactionDone, tx.objectStore, prepared.map, requestValue, store.index("sha256").get, store.index, existing.some, tx.abort, store.add, tx.objectStore(BLOB_STORE).add, get, hash, actual.blob.arrayBuffer, rollback.objectStore(STORE).delete, rollback.objectStore, rollback.objectStore(BLOB_STORE).delete|
|src/infrastructure/teaching-resource-repository.js:233|get|declaration|需要进一步测试|database.transaction, transactionDone, Promise.all, requestValue, tx.objectStore(STORE).get, tx.objectStore, tx.objectStore(BLOB_STORE).get|
|src/infrastructure/teaching-resource-repository.js:246|list|declaration|需要进一步测试|database.transaction, transactionDone, requestValue, tx.objectStore(STORE).getAll, tx.objectStore, String(filter.query ／／ "")         .trim()         .toLocaleLowerCase, String(filter.query ／／ "")         .trim, String, all         .filter(           (item) =>             (!filter.profileId ／／ item.profileId === filter.profileId) &&             (!filter.classroomId ／／ item.classroomId === filter.classroomId) &&             (!filter.subjectId ／／ item.subjectId === filter.subjectId),         )         .filter(           (item) =>             !query ／／             [item.title, item.subjectId, item.fileName, ...item.tags].some(               (value) => value.toLocaleLowerCase().includes(query),             ),         )         .sort, all         .filter(           (item) =>             (!filter.profileId ／／ item.profileId === filter.profileId) &&             (!filter.classroomId ／／ item.classroomId === filter.classroomId) &&             (!filter.subjectId ／／ item.subjectId === filter.subjectId),         )         .filter, all         .filter, [item.title, item.subjectId, item.fileName, ...item.tags].some, value.toLocaleLowerCase().includes, value.toLocaleLowerCase, right.importedAt.localeCompare|
|src/infrastructure/teaching-resource-repository.js:271|remove|declaration|需要进一步测试|database.transaction, transactionDone, tx.objectStore(STORE).delete, tx.objectStore, tx.objectStore(BLOB_STORE).delete|
|src/infrastructure/teaching-resource-repository.js:279|exportAll|declaration|需要进一步测试|list, Promise.all, metadata.map, get|
|src/infrastructure/teaching-schedule-repository.js:4|clone|binding|需要进一步测试|JSON.parse, JSON.stringify|
|src/infrastructure/teaching-schedule-repository.js:6|createTeachingScheduleRepository|declaration|需要进一步测试|storage.getItem, root.TeachingSchedule.createDocument, JSON.parse, Number.isSafeInteger, root.TeachingSchedule.validateDocument, read, JSON.stringify, storage.setItem, clone, storage.removeItem, Object.freeze|
|src/infrastructure/teaching-schedule-repository.js:14|read|declaration|需要进一步测试|storage.getItem, root.TeachingSchedule.createDocument, JSON.parse, Number.isSafeInteger, root.TeachingSchedule.validateDocument|
|src/infrastructure/teaching-schedule-repository.js:52|write|declaration|需要进一步测试|read, Number.isSafeInteger, root.TeachingSchedule.validateDocument, storage.getItem, JSON.stringify, storage.setItem, clone, storage.removeItem|
|src/items/draw.js:3|pick|declaration|需要进一步测试|ItemModules.configuration, heldItemKeysV281, FIRST_HAND_POOL_V218.filter, held.has, pool.every, Math.floor, Math.random, weightedPick, Object.fromEntries, pool.map, commitSessionDrawV21710, rankIndex, sessionRestrictedWeightsV21710, weightedPickNoRepeatV281|
|src/items/expansion-copy.js:95|competitionStatusGuideMarkup|declaration|需要进一步测试|rows         .map(           (row) => <div class="item-reference-row">         <div class="item-reference-icon status-icon-${row.key}"><span>${statusGuideGlyph(row.key)}</span></div>         <div class="item-reference-copy">           <div class="item-reference-name">${escapeHtml(row.name)} <span style="font-size:11px;font-weight:800;color:#0f766e;background:#eaf7f4;border-radius:999px;padding:3px 7px;margin-left:5px">${escapeHtml(row.tag)}</span></div>           <div class="item-reference-tip"><b>实际效果：</b>${escapeHtml(row.exact)}</div>           <div class="item-reference-tip" style="background:#fff8eb;color:#6f5830"><b style="color:#b66a00">使用要点：</b>${escapeHtml(row.tip)}</div>         </div>       </div>,         )         .join, rows         .map, statusGuideGlyph, escapeHtml|
|src/items/expansion-copy.js:166|statusGuideGlyph|declaration|需要进一步测试||
|src/items/operation.js:36|hasStatus|binding|需要进一步测试|CompetitionEffects.negative.some, CompetitionEffects.has|
|src/items/operation.js:41|pickFrom|binding|需要进一步测试|list.splice, Math.floor, Math.random|
|src/items/operation.js:275|run|declaration|需要进一步测试|Error, ranking, ordered.findIndex, state.groups.filter, eligibleForItems, targets[blueprint.target](context).filter, targets[blueprint.target], showToast, ["fraction", "freeze"].includes, CompetitionEffects.redirect, Math.random, RedirectedItemInstances.add, snapshotScoresV21732, state.groups.map, JSON.stringify, effects[blueprint.effect], Object.assign, context.targets.map, context.blocked.has, Number, before.get, String, CompetitionEffects.labels(target).join, CompetitionEffects.labels, beforeEffects.get, consumeInventoryItem, detectOvertakePunish, ordered.map, showItemUseFx, RedirectedItemInstances.delete, Math.max, queueItemScoreChangesV21732|
|src/items/round-effects.js:3|settle|declaration|需要进一步测试|answersBefore.forEach, state.groups.find, eligibleForItems, ranking, sorted.findIndex, group.inventory.findIndex, group.inventory.splice, CompetitionEffects.has, CompetitionEffects.answer, Math.random, detectOvertakePunish|
|src/items/round-effects.js:53|expire|declaration|需要进一步测试|answersBefore.map, state.groups.forEach, answered.get, Number, Object.keys, showToast, Math.max|
|src/runtime/archives/full-settlement.js:3|snapshotGroupForSettlementV21813|declaration|需要进一步测试|clone, Number|
|src/runtime/archives/full-settlement.js:28|compactUndoHistoryV21813|declaration|需要进一步测试|(historyStack ／／ []).map, (h.groups ／／ []).map, clone|
|src/runtime/archives/full-settlement.js:45|buildSettlementClearedDataV21813|declaration|需要进一步测试|new Date().toLocaleString, state.groups.map, Number, clone, compactUndoHistoryV21813|
|src/runtime/archives/full-settlement.js:120|csvCellV21813|declaration|需要进一步测试|JSON.stringify, String, Reliability.csvText, text.replace|
|src/runtime/archives/full-settlement.js:132|itemNameV21813|declaration|需要进一步测试||
|src/runtime/archives/full-settlement.js:135|inventoryTextV21813|declaration|需要进一步测试|(inv ／／ [])     .map((it) => {       const n = itemNameV21813(it.key);       const c = Number(it.charges) ／／ 1;       return c > 1 ? ${n} ×${c} : n;     })     .join, (inv ／／ [])     .map, itemNameV21813, Number|
|src/runtime/archives/full-settlement.js:144|effectTextV21813|declaration|需要进一步测试|CompetitionEffects.labels, out.push, Number, out.join|
|src/runtime/archives/full-settlement.js:164|exportSingleSettlementCSV|assignment|需要进一步测试|getSettlementHistory, lines.push, [     ["档案名称", record.title ／／ "课堂结算"],     ["归档日期", record.date ／／ ""],     ["归档时间", record.time ／／ ""],     ["第一名", record.champion ／／ ""],     ["小组数量", record.totalGroups ?? groups.length],     [       "全班总分",       record.totalScore ??         groups.reduce((n, g) => n + (Number(g.score) ／／ 0), 0),     ],   ].forEach, groups.reduce, Number, csvCellV21813, [     ["课堂作答总次数", answers],     ["答题轮次", Number(ig.pkTotal) ／／ 0],     ["全局道具发放", Number(ig.totalDraws) ／／ 0],     ["手动举手次数", Number(ig.handRaiseTotal) ／／ 0],     ["随机点名记录数", (ig.pickerHistory ／／ []).length],     ["手动举手记录数", (ig.handRaiseHistory ／／ []).length],     ["撤销历史节点数", (snap.undoHistory ／／ []).length],   ].forEach, [       "排名",       "小组名称",       "最终得分",       "组员名单",       "答对次数",       "答错次数",       "道具抽取次数",       "道具使用次数",       "持有道具",       "持续状态",       "幽灵防护剩余",       "本题已使用道具",       "三重道具续用键",       "All In",       "所选答案",       "结果文字",     ]       .map(csvCellV21813)       .join, [       "排名",       "小组名称",       "最终得分",       "组员名单",       "答对次数",       "答错次数",       "道具抽取次数",       "道具使用次数",       "持有道具",       "持续状态",       "幽灵防护剩余",       "本题已使用道具",       "三重道具续用键",       "All In",       "所选答案",       "结果文字",     ]       .map, [...groups].sort, ranked.forEach, [         r + 1,         g.name,         Number(g.score) ／／ 0,         (g.members ／／ []).join(" / "),         Number(g.itemStats?.correct) ／／ 0,         Number(g.itemStats?.wrong) ／／ 0,         Number(g.itemStats?.draws) ／／ 0,         Number(g.itemStats?.used) ／／ 0,         inventoryTextV21813(g.inventory),         effectTextV21813(g),         Number(g.booRoundsLeftV218) ／／ 0,         g.itemUsedThisRound ? "是" : "否",         g.roundItemContinuationKeyV218 ／／ "",         g.allIn ? "是" : "否",         g.selectedOpt ／／ "",         g.resultText ／／ "",       ]         .map(csvCellV21813)         .join, [         r + 1,         g.name,         Number(g.score) ／／ 0,         (g.members ／／ []).join(" / "),         Number(g.itemStats?.correct) ／／ 0,         Number(g.itemStats?.wrong) ／／ 0,         Number(g.itemStats?.draws) ／／ 0,         Number(g.itemStats?.used) ／／ 0,         inventoryTextV21813(g.inventory),         effectTextV21813(g),         Number(g.booRoundsLeftV218) ／／ 0,         g.itemUsedThisRound ? "是" : "否",         g.roundItemContinuationKeyV218 ／／ "",         g.allIn ? "是" : "否",         g.selectedOpt ／／ "",         g.resultText ／／ "",       ]         .map, (g.members ／／ []).join, inventoryTextV21813, effectTextV21813, [     ["鱿鱿遮蔽截止时间", Number(ig.blooperUntil) ／／ 0],     ["抽取节流状态", ig.drawThrottleV2179 ／／ {}],     ["抽取轮次与冷却", ig.drawSessionThrottleV21710 ／／ {}],     [       "第一次手动举手特殊抽取是否待触发",       snap.transient?.firstHandDrawPending ? "是" : "否",     ],     ["当前抽取会话", snap.transient?.activeDrawSession ／／ null],     ["当前是否正在抽取", snap.transient?.itemDrawBusy ? "是" : "否"],   ].forEach, [     ["点名模式", snap.picker?.mode ／／ ""],     ["已抽学生键", snap.picker?.pickedStudentKeys ／／ []],     ["已抽小组 ID", snap.picker?.pickedGroupIds ／／ []],     ["预选小组 ID", snap.picker?.preselectedGroupIds ／／ []],     ["当前抽取结果", snap.transient?.slotEngine?.chosenResult ／／ null],   ].forEach, (ig.pickerHistory ／／ []).forEach, [i + 1, x.time ? new Date(x.time).toLocaleString() : "", x.text ／／ ""]         .map(csvCellV21813)         .join, [i + 1, x.time ? new Date(x.time).toLocaleString() : "", x.text ／／ ""]         .map, new Date(x.time).toLocaleString, (ig.handRaiseHistory ／／ []).forEach, groups.find, [         i + 1,         x.time ? new Date(x.time).toLocaleString() : "",         x.groupId ?? "",         g?.name ／／ "",         x.correct ? "正确" : "错误",       ]         .map(csvCellV21813)         .join, [         i + 1,         x.time ? new Date(x.time).toLocaleString() : "",         x.groupId ?? "",         g?.name ／／ "",         x.correct ? "正确" : "错误",       ]         .map, [     ["是否正在答题", rd.roundActive ? "是" : "否"],     ["是否已判定", rd.evaluated ? "是" : "否"],     ["正确答案", rd.correctAnswer ／／ rd.correctAns ／／ ""],     ["回合编号", Number(rd.roundNo) ／／ 0],     ["是否曾开始过比赛", rd.hasStartedOnce ? "是" : "否"],     ["上一轮 All In 状态", rd.lastRoundAllIn ／／ null],     ["当前举手小组 ID", snap.transient?.handRaiseGroupId ?? ""],     ["当前举手抽道具小组 ID", snap.transient?.handItemDrawGroupId ?? ""],     ["待定道具键", snap.transient?.handItemPendingKey ?? ""],     ["道具抽取开始时间", snap.transient?.handItemDrawStartedAt ?? 0],     ["当前道具详情小组 ID", snap.transient?.activeItemGroupId ?? ""],   ].forEach, (snap.undoHistory ／／ []).forEach, (h.groups ／／ []).map, [         i + 1,         h.time ／／ "",         h.desc ／／ "",         groupSummary,         h.picker ／／ null,         h.itemGlobal ／／ null,       ]         .map(csvCellV21813)         .join, [         i + 1,         h.time ／／ "",         h.desc ／／ "",         groupSummary,         h.picker ／／ null,         h.itemGlobal ／／ null,       ]         .map, lines.join, URL.createObjectURL, document.createElement, (record.title ／／ "封神榜档案").replace, a.click, URL.revokeObjectURL, showToast|
|src/runtime/archives/settlement-actions.js:4|getSettlementHistory|declaration|需要进一步测试|STORAGE.getJSON|
|src/runtime/archives/settlement-actions.js:8|saveSettlementRecord|declaration|需要进一步测试|buildSettlementClearedDataV21813, Reliability.appendArchive|
|src/runtime/archives/settlement-actions.js:15|triggerFinalSettlement|declaration|需要进一步测试|ClassroomWriteBarrier.allow, themeAlert, openPwdModal, now.getFullYear, String(now.getMonth() + 1).padStart, String, now.getMonth, String(now.getDate()).padStart, now.getDate, document.getElementById, DesktopUI.prepareSettlement, showClassroomWindow, setTimeout, input.focus, input.select|
|src/runtime/archives/settlement-actions.js:43|closeSettlementNameModal|declaration|需要进一步测试|DesktopUI.cancelSettlement, hideClassroomWindow, document.getElementById|
|src/runtime/archives/settlement-actions.js:48|confirmFinalSettlement|declaration|需要进一步测试|ClassroomWriteBarrier.conflict, showToast, Reliability.invalidateDefenseDecisions, openPwdModal, state.groups.some, document.getElementById, input.value.trim, closeSettlementNameModal, [...state.groups].sort, Number, Date.now, new Date().toLocaleDateString, new Date().toLocaleString, state.groups.reduce, clone, AchievementLedger.normalize, saveSettlementRecord, themeAlert, recordHistory, bgmStopAll, renderControls, playSound, setTimeout, escapeHtml, showClassroomWindow, initConfetti, resetCompetitionDataAfterSettlementV21812, saveState, renderAll|
|src/runtime/archives/settlement-actions.js:169|initConfetti|declaration|需要进一步测试|document.getElementById, canvas.getContext, confettiParticles.push, Math.random, Math.floor, ctx.clearRect, confettiParticles.forEach, ctx.save, ctx.translate, ctx.rotate, ctx.fillRect, ctx.restore, requestAnimationFrame, cancelAnimationFrame, loop|
|src/runtime/archives/settlement-actions.js:200|loop|declaration|需要进一步测试|ctx.clearRect, confettiParticles.forEach, ctx.save, ctx.translate, ctx.rotate, ctx.fillRect, ctx.restore, requestAnimationFrame|
|src/runtime/archives/settlement-actions.js:221|stopConfetti|declaration|需要进一步测试|cancelAnimationFrame|
|src/runtime/archives/settlement-actions.js:228|closeGrandSettlementModal|declaration|需要进一步测试|hideClassroomWindow, document.getElementById, stopConfetti|
|src/runtime/archives/settlement-actions.js:233|openSettlementHistoryModal|declaration|需要进一步测试|switchView|
|src/runtime/archives/settlement-actions.js:237|closeSettlementHistoryModal|declaration|需要进一步测试|switchView|
|src/runtime/archives/settlement-actions.js:241|renderArchiveClassStats|declaration|需要进一步测试|document.getElementById, state.groups.reduce, Number, metrics.map(([label, value, unit]) => <div class="archive-stat-card"><b>${value}<small>${unit}</small></b><span>${label}</span></div>).join, metrics.map|
|src/runtime/archives/settlement-actions.js:258|renderSettlementHistoryList|declaration|需要进一步测试|DesktopUI.renderArchives|
|src/runtime/archives/settlement-actions.js:262|exportSingleSettlementCSV|declaration|需要进一步测试|getSettlementHistory, record.groups.forEach, (g.members ／／ []).join, g.name.replace, members.replace, URL.createObjectURL, document.createElement, (record.title ／／ "课堂最终结算").replace, a.click, URL.revokeObjectURL, showToast|
|src/runtime/archives/settlement-actions.js:283|exportLatestSettlementCSV|declaration|需要进一步测试|getSettlementHistory, themeAlert, exportSingleSettlementCSV|
|src/runtime/archives/settlement-actions.js:292|deleteSettlementRecord|declaration|需要进一步测试|themeAlert, openPwdModal, themeConfirm, getSettlementHistory, list.splice, STORAGE.setJSON, renderSettlementHistoryList, showToast|
|src/runtime/audio/battle-playback.js:2|clearAllLoopTimeouts|declaration|需要进一步测试|activeLoopTimeouts.forEach, clearTimeout|
|src/runtime/audio/battle-playback.js:7|scheduleDualLoopChunk|declaration|需要进一步测试|getSecPerBeat, Math.max, audioCtx.createBufferSource, bSrc.connect, bSrc.start, bSrc.stop, bgmEngine.activeNodes.push, tSrc.connect, tSrc.start, tSrc.stop, setTimeout, scheduleDualLoopChunk, activeLoopTimeouts.push|
|src/runtime/audio/battle-playback.js:58|bgmStartNewRoundMusicWithProgress|declaration|需要进一步测试|onProgress, getAudioContext, bgmStopAll, pickNextPlayableSetIndex, fetchAndDecodeSetBuffers, audioCtx.createBufferSource, introSrc.connect, introSrc.start, bgmEngine.activeNodes.push, checkAllInRatio, bgmEngine.thinkingGain.gain.setValueAtTime, bgmEngine.battleGain.gain.setValueAtTime, scheduleDualLoopChunk, setTimeout, bgmPreloadNextSet|
|src/runtime/audio/battle-playback.js:135|bgmTransitionThinkingToBattle|declaration|需要进一步测试|getAudioContext, getSecPerBeat, getTrackCurrentBeat, Number, Math.ceil, clearTimeout, bgmEngine.thinkingGain.gain.cancelScheduledValues, bgmEngine.battleGain.gain.cancelScheduledValues, bgmEngine.thinkingGain.gain.setValueAtTime, bgmEngine.thinkingGain.gain.linearRampToValueAtTime, audioCtx.createBufferSource, transSrc.connect, transSrc.start, bgmEngine.activeNodes.push, Math.max, bgmEngine.battleGain.gain.setValueAtTime, bgmEngine.battleGain.gain.linearRampToValueAtTime, setTimeout, checkAllInRatio, bgmTransitionBattleToThinking|
|src/runtime/audio/battle-playback.js:239|bgmTransitionBattleToThinking|declaration|需要进一步测试|getAudioContext, clearTimeout, getSecPerBeat, getTrackCurrentBeat, Math.ceil, getSecPerBar, bgmEngine.battleGain.gain.cancelScheduledValues, bgmEngine.thinkingGain.gain.cancelScheduledValues, bgmEngine.battleGain.gain.setValueAtTime, bgmEngine.battleGain.gain.linearRampToValueAtTime, bgmEngine.thinkingGain.gain.setValueAtTime, bgmEngine.thinkingGain.gain.linearRampToValueAtTime|
|src/runtime/audio/battle-playback.js:286|bgmTriggerVictory|declaration|需要进一步测试|callback, getAudioContext, getSecPerBeat, getTrackCurrentBeat, clearTimeout, clearAllLoopTimeouts, bgmEngine.battleGain.gain.cancelScheduledValues, bgmEngine.thinkingGain.gain.cancelScheduledValues, bgmEngine.battleGain.gain.setValueAtTime, bgmEngine.battleGain.gain.linearRampToValueAtTime, bgmEngine.thinkingGain.gain.setValueAtTime, bgmEngine.thinkingGain.gain.linearRampToValueAtTime, setTimeout, bgmEngine.battleSource.stop, bgmEngine.thinkingSource.stop, bgmEngine.activeNodes.forEach, item.stop, Math.max, audioCtx.createBufferSource, victorySrc.connect, victorySrc.start, bgmStopAll|
|src/runtime/audio/battle-playback.js:365|victorySrc.onended|assignment|需要进一步测试|bgmStopAll, callback|
|src/runtime/audio/battle-playback.js:388|bgmStopAll|declaration|需要进一步测试|clearAllLoopTimeouts, clearTimeout, bgmEngine.victoryNode.stop, bgmEngine.activeNodes.forEach, item.stop, bgmEngine.battleGain.gain.cancelScheduledValues, bgmEngine.thinkingGain.gain.cancelScheduledValues, bgmEngine.battleGain.gain.setValueAtTime, bgmEngine.thinkingGain.gain.setValueAtTime|
|src/runtime/audio/draw-audio-lifecycle.js:11|stopActiveDrawAudioV2171|declaration|需要进一步测试|clearInterval, clearTimeout, activeDrawSourcesV2171.forEach, src.stop, src.disconnect, activeDrawSourcesV2171.clear|
|src/runtime/audio/draw-audio-lifecycle.js:34|playTrackedDrawSoundV2171|declaration|需要进一步测试|loadFxSounds, getAudioContext, audioCtx.createBufferSource, source.connect, getFxOutputV2176, activeDrawSourcesV2171.add, activeDrawSourcesV2171.delete, source.start, playItemFallbackSoundV2164, playSound|
|src/runtime/audio/draw-audio-lifecycle.js:56|source.onended|assignment|需要进一步测试|activeDrawSourcesV2171.delete|
|src/runtime/audio/draw-audio-lifecycle.js:70|finishDrawAudioV2171|declaration|需要进一步测试|clearInterval, activeDrawSourcesV2171.forEach, src.stop, src.disconnect, activeDrawSourcesV2171.clear, playSound|
|src/runtime/audio/draw-audio-lifecycle.js:94|startDrawSoundBedV2164|assignment|需要进一步测试|stopActiveDrawAudioV2171, playTrackedDrawSoundV2171, Math.max, setInterval, clearInterval, setTimeout, finishDrawAudioV2171|
|src/runtime/audio/draw-audio-lifecycle.js:127|cancelHandItemDraw|assignment|需要进一步测试|stopActiveDrawAudioV2171, _v2171CancelHandItemDraw.apply|
|src/runtime/audio/effects-volume.js:14|getFxOutputV2176|declaration|需要进一步测试|audioCtx.createGain, fxGainNodeV2176.gain.setValueAtTime, fxGainNodeV2176.connect|
|src/runtime/audio/effects-volume.js:25|updateSfxVolumeV2176|declaration|需要进一步测试|Math.max, Math.min, parseFloat, document.getElementById, Math.round, getFxOutputV2176, node.gain.cancelScheduledValues, node.gain.setValueAtTime, STORAGE.set|
|src/runtime/audio/effects-volume.js:46|installSfxVolumeSliderV2176|declaration|需要进一步测试|document.getElementById, master?.closest, document.createElement, Math.round, masterRow.insertAdjacentElement, pane.prepend|
|src/runtime/audio/effects-volume.js:82|syncSettingsControls|assignment|需要进一步测试|_v2176SyncSettingsControls.apply, installSfxVolumeSliderV2176, document.getElementById, Math.round|
|src/runtime/audio/effects-volume.js:97|rebuildSettingsV26|assignment|需要进一步测试|_v2176RebuildSettingsV26.apply, setTimeout|
|src/runtime/audio/effects-volume.js:106|showSettingsV26|assignment|需要进一步测试|_v2176ShowSettingsV26.call, setTimeout|
|src/runtime/audio/fx-bundle-transfer.js:5|exportFxBundleV2175|declaration|需要进一步测试|openPwdModal, initDB, themeAlert, showToast, db.transaction, tx.objectStore("sounds").getAll, tx.objectStore, resolve, allRecords       .filter(         (r) =>           r &&           typeof r.id === "string" &&           r.id.startsWith("fx_") &&           r.arrayBuffer instanceof ArrayBuffer,       )       .sort, allRecords       .filter, r.id.startsWith, a.id.localeCompare, fileIndex.push, buffers.push, new TextEncoder().encode, JSON.stringify, view.setUint8, view.setUint32, URL.createObjectURL, document.createElement, fxRecords.filter, document.body.appendChild, a.click, a.remove, setTimeout, URL.revokeObjectURL, console.error|
|src/runtime/audio/fx-bundle-transfer.js:26|req.onsuccess|assignment|需要进一步测试|resolve|
|src/runtime/audio/fx-bundle-transfer.js:27|req.onerror|assignment|需要进一步测试|resolve|
|src/runtime/audio/item-sound-bindings.js:30|itemFallbackToneV2164|declaration|需要进一步测试|audioCtx.createOscillator, audioCtx.createGain, osc.frequency.setValueAtTime, osc.frequency.exponentialRampToValueAtTime, gain.gain.setValueAtTime, Math.max, gain.gain.exponentialRampToValueAtTime, osc.connect, gain.connect, getFxOutputV2176, osc.start, osc.stop|
|src/runtime/audio/item-sound-bindings.js:56|playItemFallbackSoundV2164|declaration|需要进一步测试|itemFallbackToneV2164, [523.25, 659.25, 783.99].forEach, [523.25, 659.25, 783.99, 1046.5].forEach|
|src/runtime/audio/item-sound-bindings.js:110|playSound|assignment|需要进一步测试|ITEM_SOUND_IDS_V2164.has, _v2164PlaySoundBase.call, loadFxSounds, getAudioContext, audioCtx.createBufferSource, source.connect, getFxOutputV2176, source.start, playItemFallbackSoundV2164|
|src/runtime/audio/item-sound-bindings.js:147|startDrawSoundBedV2164|declaration|需要进一步测试|playSound, Math.max, setInterval, clearInterval, setTimeout|
|src/runtime/audio/item-sound-map.js:17|playPerItemFallbackV2174|declaration|需要进一步测试|Math.max, ITEM_DRAW_KEYS.indexOf, audioCtx.createOscillator, audioCtx.createGain, osc.frequency.setValueAtTime, osc.frequency.exponentialRampToValueAtTime, g.gain.setValueAtTime, g.gain.exponentialRampToValueAtTime, osc.connect, g.connect, getFxOutputV2176, osc.start, osc.stop, tone|
|src/runtime/audio/item-sound-map.js:29|tone|binding|需要进一步测试|audioCtx.createOscillator, audioCtx.createGain, osc.frequency.setValueAtTime, Math.max, osc.frequency.exponentialRampToValueAtTime, g.gain.setValueAtTime, g.gain.exponentialRampToValueAtTime, osc.connect, g.connect, getFxOutputV2176, osc.start, osc.stop|
|src/runtime/audio/item-sound-map.js:82|playSound|assignment|需要进一步测试|ActionSounds.isClick, ClassroomFeedback.allowClickSound, GENERIC_ITEM_USE_SOUNDS_V2174.has, PER_ITEM_SOUND_IDS_V2174.has, loadFxSounds, getAudioContext, selectFxBuffer, audioCtx.createBufferSource, source.connect, getFxOutputV2176, source.start, playPerItemFallbackV2174, slotId.slice, _v2174PlaySound.call|
|src/runtime/audio/item-sound-map.js:130|showItemUseFx|assignment|需要进一步测试|playSound, _v2174ShowItemUseFx.call|
|src/runtime/audio/item-sound-map.js:142|renderItemFxSoundListV26|assignment|需要进一步测试|document.getElementById, hasSound, escapeHtml, renderFxChoices, common.map((x) => rowHtml(x.id, x.name, x.desc)).join, common.map, rowHtml, ITEM_KEYS.map((k) => {         const d = ITEM_DEFS[k];         const visual = <span class="item-audio-icon">${itemVisual(k, "item-audio-img")}</span>;         return rowHtml(item_${k}, d.name, "默认：该道具独立合成音", visual);       }).join, ITEM_KEYS.map, itemVisual|
|src/runtime/audio/item-sound-map.js:153|rowHtml|binding|需要进一步测试|hasSound, escapeHtml, renderFxChoices|
|src/runtime/audio/item-sound-map.js:205|handleSoundFileUpload|assignment|需要进一步测试|_v2174HandleSoundFileUpload.call, setTimeout, renderItemFxSoundListV26|
|src/runtime/audio/item-sound-map.js:216|deleteFxTrack|assignment|需要进一步测试|_v2174DeleteFxTrack.call, setTimeout, renderItemFxSoundListV26|
|src/runtime/audio/item-sound-settings.js:20|renderItemFxSoundListV26|declaration|需要进一步测试|document.getElementById, ITEM_FX_SOUND_SLOTS.filter(     (s) => !GENERIC_ITEM_USE_SOUNDS_V2174.has(s.id),   )     .map((s) => {       const custom = !!customFxBuffers[s.id] ／／ hasSound("fx_" + s.id);       return <div class="sound-row"><div class="sound-desc"><div class="sound-name">${s.name}</div><div class="sound-tag">${custom ? "已载入自定义音频" : s.desc}</div></div><div class="sound-controls"><button class="btn btn-sm" onclick="playSound('${s.id}')">试听</button><button class="btn btn-sm btn-primary" onclick="triggerUploadAudio('fx_${s.id}')">上传</button>${custom ? <button class="btn btn-sm btn-danger" onclick="deleteFxTrack('fx_${s.id}','${s.id}');setTimeout(renderItemFxSoundListV26,100)">还原</button> : ""}</div></div>;     })     .join, ITEM_FX_SOUND_SLOTS.filter(     (s) => !GENERIC_ITEM_USE_SOUNDS_V2174.has(s.id),   )     .map, ITEM_FX_SOUND_SLOTS.filter, GENERIC_ITEM_USE_SOUNDS_V2174.has, hasSound|
|src/runtime/audio/item-sound-settings.js:32|itemSoundCategoryV26|declaration|需要进一步测试|[       "green",       "triple_green",       "red",       "triple_red",       "spiny",       "banana",       "triple_banana",       "horn",       "bomb",       "hammer",       "lightning",     ].includes, ["coin", "coin_shell", "question", "mushroom", "triple_mushroom"].includes|
|src/runtime/audio/item-sound-settings.js:59|showItemUseFx|assignment|需要进一步测试|playSound, setTimeout, itemSoundCategoryV26, _v26ShowItemUseFx|
|src/runtime/audio/item-sound-settings.js:65|tinyDefenseToast|assignment|需要进一步测试|playSound, _v26TinyDefense|
|src/runtime/audio/menu-patterns.js:88|saveMenuCfg|declaration|需要进一步测试|STORAGE.setJSON|
|src/runtime/audio/menu-patterns.js:93|midiToFreq|declaration|需要进一步测试|Math.pow|
|src/runtime/audio/menu-patterns.js:97|mulberry32|declaration|需要进一步测试|Math.imul|
|src/runtime/audio/menu-patterns.js:112|buildMenuPattern|declaration|需要进一步测试|Math.max, Number, mulberry32, key.split("").reduce, key.split, c.charCodeAt, new Array(totalSteps).fill, rnd, Math.floor|
|src/runtime/audio/menu-patterns.js:187|getNoiseBuffer|declaration|需要进一步测试|Math.floor, audioCtx.createBuffer, noiseBuffer.getChannelData, Math.random|
|src/runtime/audio/menu-settings.js:1|renderBgmEngineConsole|declaration|需要进一步测试|document.getElementById, MENU_TRACK_KEYS.map(     (k) =>       '<div class="trim-row">' +       '<span class="trim-name">' +       MENU_TRACK_META[k].name +       "</span>" +       '<input type="range" min="0" max="2" step="0.05" value="' +       menuCfg.gainTrims[k] +       '" oninput="menuTrimChange(\'' +       k +       "', this.value)\">" +       '<span class="trim-val" id="trim-val-' +       k +       '">' +       Number(menuCfg.gainTrims[k]).toFixed(2) +       "</span>" +       "</div>",   ).join, MENU_TRACK_KEYS.map, Number(menuCfg.gainTrims[k]).toFixed, Number|
|src/runtime/audio/menu-settings.js:95|menuEnabledChange|declaration|需要进一步测试|saveMenuCfg, menuStop, menuStartOrSwitch, getMenuTrackKeyForView|
|src/runtime/audio/menu-settings.js:102|menuBpmChange|declaration|需要进一步测试|Number, saveMenuCfg, document.getElementById, menuScheduleReload|
|src/runtime/audio/menu-settings.js:109|menuMeterChange|declaration|需要进一步测试|Number, saveMenuCfg, menuResyncGrid|
|src/runtime/audio/menu-settings.js:114|menuLoopChange|declaration|需要进一步测试|Number, saveMenuCfg, menuResyncGrid|
|src/runtime/audio/menu-settings.js:119|menuTrimChange|declaration|需要进一步测试|Number, saveMenuCfg, menuBgm.voices.forEach, menuVoiceRamp, menuTrimFor, document.getElementById, Number(v).toFixed|
|src/runtime/audio/menu-settings.js:130|battleBpmChange|declaration|需要进一步测试|Number, document.getElementById, saveMenuCfg|
|src/runtime/audio/menu-synthesis.js:1|menuSecPerBeat|declaration|需要进一步测试|Math.max, Number|
|src/runtime/audio/menu-synthesis.js:5|menuLoopSpan|declaration|需要进一步测试|Math.max, Number, menuSecPerBeat|
|src/runtime/audio/menu-synthesis.js:20|normalizeWelcomeLoopBuffer|declaration|需要进一步测试|/^welcome_[1-6]$/.test, menuLoopSpan, Math.min, menuSecPerBeat, Math.ceil, audioCtx.createBuffer, fixed.getChannelData(ch).set, fixed.getChannelData, buf.getChannelData|
|src/runtime/audio/menu-synthesis.js:44|menuEnsureGraph|declaration|需要进一步测试|audioCtx.createGain, menuBgm.outGain.gain.setValueAtTime, menuBgm.outGain.connect|
|src/runtime/audio/menu-synthesis.js:55|makeSynthMenuBuffer|declaration|需要进一步测试|Math.max, Number, Math.ceil, Math.floor, buildMenuPattern, Math.min, offline.createOscillator, offline.createGain, osc.frequency.setValueAtTime, midiToFreq, g.gain.setValueAtTime, g.gain.exponentialRampToValueAtTime, osc.connect, g.connect, osc.start, osc.stop, offline.createBuffer, buf.getChannelData, Math.random, offline.createBufferSource, offline.createBiquadFilter, src.connect, hp.connect, src.start, offline.startRendering|
|src/runtime/audio/menu-transport.js:2|menuLoadBuffer|declaration|需要进一步测试|async () => {     let buf = null;     if (db) {       try {         const ab = await new Promise((res) => {           const tx = db.transaction("sounds", "readonly");           const req = tx.objectStore("sounds").get("bgm_menu_" + key);           req.onsuccess = () =>             res((req.result && req.result.arrayBuffer) ／／ null);           req.onerror = () => res(null);         });         if (ab && ab.byteLength > 0) {           buf = await audioCtx.decodeAudioData(ab.slice(0));           buf = normalizeWelcomeLoopBuffer(key, buf);           menuBgm.uploadedKeys.add(key);         }       } catch (e) {}     }     if (!buf) {       try {         buf = await makeSynthMenuBuffer(key);       } catch (e2) {         buf = null;       }       if (buf) menuBgm.uploadedKeys.delete(key);     }     if (buf) menuBgm.buffers[key] = buf;     return buf;   }, db.transaction, tx.objectStore("sounds").get, tx.objectStore, res, audioCtx.decodeAudioData, ab.slice, normalizeWelcomeLoopBuffer, menuBgm.uploadedKeys.add, makeSynthMenuBuffer, menuBgm.uploadedKeys.delete|
|src/runtime/audio/menu-transport.js:12|req.onsuccess|assignment|需要进一步测试|res|
|src/runtime/audio/menu-transport.js:14|req.onerror|assignment|需要进一步测试|res|
|src/runtime/audio/menu-transport.js:42|menuLoopParams|declaration|需要进一步测试|menuLoopSpan, menuBgm.uploadedKeys.has, Math.min, Math.max|
|src/runtime/audio/menu-transport.js:52|menuTrimFor|declaration|需要进一步测试|Number, Math.max, Math.min, Number.isFinite|
|src/runtime/audio/menu-transport.js:58|menuPosForKey|declaration|需要进一步测试|menuLoopParams, Math.max, Math.min|
|src/runtime/audio/menu-transport.js:67|menuVoiceGainAt|declaration|需要进一步测试||
|src/runtime/audio/menu-transport.js:75|menuVoiceRamp|declaration|需要进一步测试|menuVoiceGainAt, g.cancelScheduledValues, g.setValueAtTime, g.linearRampToValueAtTime|
|src/runtime/audio/menu-transport.js:85|menuSpawnVoice|declaration|需要进一步测试|menuLoopParams, audioCtx.createBufferSource, Math.min, Math.max, audioCtx.createGain, gain.gain.setValueAtTime, src.connect, gain.connect, menuPosForKey, src.disconnect, gain.disconnect, menuBgm.voices.indexOf, menuBgm.voices.splice, src.start, menuBgm.voices.push|
|src/runtime/audio/menu-transport.js:109|src.onended|assignment|需要进一步测试|src.disconnect, gain.disconnect, menuBgm.voices.indexOf, menuBgm.voices.splice|
|src/runtime/audio/menu-transport.js:125|menuRetireVoice|declaration|需要进一步测试|menuVoiceRamp, v.src.stop|
|src/runtime/audio/menu-transport.js:139|menuSwitchNow|declaration|需要进一步测试|menuBgm.voices.find, menuBgm.voices.slice().forEach, menuBgm.voices.slice, menuRetireVoice, menuTrimFor, Math.abs, menuVoiceGainAt, menuVoiceRamp, menuSpawnVoice|
|src/runtime/audio/menu-transport.js:168|menuStartOrSwitch|declaration|需要进一步测试|ensureAudioUnlocked().then, ensureAudioUnlocked, menuEnsureGraph, menuLoadBuffer, menuSwitchNow|
|src/runtime/audio/menu-transport.js:186|menuFadeOut|declaration|需要进一步测试|menuPosForKey, Math.max, menuBgm.voices.slice().forEach, menuBgm.voices.slice, menuRetireVoice|
|src/runtime/audio/menu-transport.js:202|menuStop|declaration|需要进一步测试|menuBgm.voices.slice().forEach, menuBgm.voices.slice, v.src.stop|
|src/runtime/audio/menu-transport.js:217|menuResyncGrid|declaration|需要进一步测试|menuLoopParams, Math.min, Math.max, menuBgm.voices.find, Math.abs, menuRetireVoice, menuVoiceRamp, menuSpawnVoice, menuTrimFor|
|src/runtime/audio/menu-transport.js:241|menuScheduleReload|declaration|需要进一步测试|clearTimeout, setTimeout, menuBgm.uploadedKeys.delete, menuLoadBuffer, menuBgm.voices.slice().forEach, menuBgm.voices.slice, menuRetireVoice, menuVoiceRamp, menuSpawnVoice, menuTrimFor|
|src/runtime/audio/menu-transport.js:263|updateWelcomeTrackIfNeeded|declaration|需要进一步测试|getWelcomeTrackKey, menuStartOrSwitch|
|src/runtime/audio/picker-roll.js:4|makeRollLoopBuffer|declaration|需要进一步测试|audioCtx.createBuffer, Math.floor, buf.getChannelData, Math.random|
|src/runtime/audio/picker-roll.js:24|startRollLoop|declaration|需要进一步测试|selectFxBuffer, makeRollLoopBuffer, audioCtx.createGain, rollLoopGain.connect, getFxOutputV2176, rollLoopGain.gain.setValueAtTime, rollLoopGain.gain.linearRampToValueAtTime, audioCtx.createBufferSource, rollLoopNode.connect, rollLoopNode.start|
|src/runtime/audio/picker-roll.js:42|stopRollLoop|declaration|需要进一步测试|cb, rollLoopGain.gain.cancelScheduledValues, rollLoopGain.gain.setValueAtTime, Math.max, rollLoopGain.gain.linearRampToValueAtTime, setTimeout, rollLoopNode.stop|
|src/runtime/audio/resource-loading.js:1|initDB|declaration|需要进一步测试|indexedDB.open, database.objectStoreNames.contains, database.createObjectStore, refreshSoundIdCache, resolve, scheduleBackgroundAudioInit|
|src/runtime/audio/resource-loading.js:8|request.onupgradeneeded|assignment|需要进一步测试|database.objectStoreNames.contains, database.createObjectStore|
|src/runtime/audio/resource-loading.js:15|request.onsuccess|assignment|需要进一步测试|refreshSoundIdCache, resolve, scheduleBackgroundAudioInit|
|src/runtime/audio/resource-loading.js:22|request.onerror|assignment|需要进一步测试|resolve|
|src/runtime/audio/resource-loading.js:31|scheduleBackgroundAudioInit|declaration|需要进一步测试|scheduleIdleTask, STORAGE.get, migrateOldDatabases, console.warn, showToast, refreshSoundIdCache, loadFxSounds|
|src/runtime/audio/resource-loading.js:54|migrateOldDatabases|declaration|需要进一步测试|LegacyAudioMigration.run|
|src/runtime/audio/resource-loading.js:62|getAudioContext|declaration|需要进一步测试|audioCtx.createGain, masterGainNode.gain.setValueAtTime, masterGainNode.connect, musicGainNode.gain.setValueAtTime, musicGainNode.connect, bgmEngine.battleGain.connect, bgmEngine.thinkingGain.connect, Promise.race, audioCtx.resume, setTimeout, res|
|src/runtime/audio/resource-loading.js:92|loadFxSounds|declaration|需要进一步测试|async () => {     try {       const records = await new Promise((resolve) => {         const tx = db.transaction("sounds", "readonly");         const store = tx.objectStore("sounds");         const req = store.getAll();         req.onsuccess = () => resolve(req.result ／／ []);         req.onerror = () => resolve([]);       });        const ctx = await getAudioContext();       const fxRecords = records.filter(         (item) =>           item &&           typeof item.id === "string" &&           item.id.startsWith("fx_") &&           item.arrayBuffer &&           item.arrayBuffer.byteLength > 0,       );        const variants = Object.create(null);       await Promise.all(         fxRecords.map(async (item) => {           try {             const decoded = await ctx.decodeAudioData(               item.arrayBuffer.slice(0),             );             const key = item.id.slice(3),               split = key.indexOf("::variant::");             if (split >= 0) {               const slot = key.slice(0, split);               (variants[slot] ／／= []).push({                 id: item.id,                 name: item.name ／／ "候选音效",                 buffer: decoded,               });             } else customFxBuffers[key] = decoded;           } catch (_) {}         }),       );        Object.values(variants).forEach((list) =>         list.sort((a, b) => a.id.localeCompare(b.id)),       );       customFxVariants = variants;       fxSoundsLoaded = true;     } catch (_) {     } finally {       fxSoundsLoading = null;     }   }, db.transaction, tx.objectStore, store.getAll, resolve, getAudioContext, records.filter, item.id.startsWith, Object.create, Promise.all, fxRecords.map, ctx.decodeAudioData, item.arrayBuffer.slice, item.id.slice, key.indexOf, key.slice, (variants[slot] ／／= []).push, Object.values(variants).forEach, Object.values, list.sort, a.id.localeCompare|
|src/runtime/audio/resource-loading.js:102|req.onsuccess|assignment|需要进一步测试|resolve|
|src/runtime/audio/resource-loading.js:103|req.onerror|assignment|需要进一步测试|resolve|
|src/runtime/audio/resource-loading.js:152|selectFxBuffer|declaration|需要进一步测试|[     customFxBuffers[slotId],     ...(customFxVariants[slotId] ／／ []).map((x) => x.buffer),   ].filter, (customFxVariants[slotId] ／／ []).map, Math.min, Math.max, Math.floor, random|
|src/runtime/audio/resource-loading.js:169|renderFxChoices|declaration|需要进一步测试|choices.map((x, i) => <div class="cf-audio-choice"><span>${escapeHtml(x.name ／／ "候选 " + (i + 1))}</span><button class="btn btn-sm" data-fx-remove="${escapeHtml(x.id)}" onclick="deleteFxCandidate(this.dataset.fxRemove)">移除</button></div>).join, choices.map, escapeHtml|
|src/runtime/audio/resource-loading.js:174|deleteFxCandidate|declaration|需要进一步测试|id.includes, db.transaction, reject, tx.objectStore("sounds").delete, tx.objectStore, id.slice, id.indexOf, (customFxVariants[slot] ／／ []).filter, soundIdCache.delete, renderFxSlotList, renderItemFxSoundListV26, showToast|
|src/runtime/audio/resource-loading.js:180|tx.onerror|assignment|需要进一步测试|reject|
|src/runtime/audio/resource-loading.js:181|tx.onabort|assignment|需要进一步测试|reject|
|src/runtime/audio/resource-loading.js:197|checkSetCompleteness|declaration|需要进一步测试|Promise.resolve, hasSound, refreshSoundIdCache().then, refreshSoundIdCache, doCheck|
|src/runtime/audio/resource-loading.js:201|doCheck|binding|需要进一步测试|hasSound|
|src/runtime/audio/resource-loading.js:232|getAllCompleteSetIndices|declaration|需要进一步测试|checkSetCompleteness, completeIndices.push|
|src/runtime/audio/resource-loading.js:241|getFallbackSetIndex|declaration|需要进一步测试|checkSetCompleteness|
|src/runtime/audio/resource-loading.js:249|pickNextPlayableSetIndex|declaration|需要进一步测试|getAllCompleteSetIndices, bgmShufflePool.filter, completeSets.includes, Math.floor, Math.random, bgmShufflePool.shift, getFallbackSetIndex|
|src/runtime/audio/resource-loading.js:274|fetchAndDecodeSetBuffers|declaration|需要进一步测试|db.transaction, tx.objectStore, resolve, SET_TRACK_TYPES.forEach, store.get, getAudioContext, Object.entries, onProgress, Promise.all, entries.map, ctx.decodeAudioData, ab.slice, Math.round|
|src/runtime/audio/resource-loading.js:292|req.onsuccess|assignment|需要进一步测试|resolve|
|src/runtime/audio/resource-loading.js:298|req.onerror|assignment|需要进一步测试|resolve|
|src/runtime/audio/resource-loading.js:336|bgmPreloadNextSet|declaration|需要进一步测试|pickNextPlayableSetIndex, fetchAndDecodeSetBuffers|
|src/runtime/audio/session-cache.js:7|scheduleIdleTask|declaration|需要进一步测试|window.requestIdleCallback, window.setTimeout, Math.min|
|src/runtime/audio/session-cache.js:14|refreshSoundIdCache|declaration|需要进一步测试|resolve, db.transaction, tx.objectStore, store.getAllKeys|
|src/runtime/audio/session-cache.js:24|req.onsuccess|assignment|需要进一步测试|resolve|
|src/runtime/audio/session-cache.js:28|req.onerror|assignment|需要进一步测试|resolve|
|src/runtime/audio/session-cache.js:35|hasSound|declaration|需要进一步测试|soundIdCache.has|
|src/runtime/audio/session-cache.js:53|getSecPerBeat|declaration|需要进一步测试|Number, Math.max|
|src/runtime/audio/session-cache.js:60|getSecPerBar|declaration|需要进一步测试|getSecPerBeat, Math.max, Number|
|src/runtime/audio/session-cache.js:64|getTrackCurrentBeat|declaration|需要进一步测试|Math.max, getSecPerBeat|
|src/runtime/audio/settings-and-transfer.js:1|openSoundSettings|declaration|需要进一步测试|themeAlert, openPwdModal, syncSettingsControls, renderBgmSlotList, renderFxSlotList, renderBgmEngineConsole, switchView|
|src/runtime/audio/settings-and-transfer.js:14|closeSoundModal|declaration|需要进一步测试|switchView|
|src/runtime/audio/settings-and-transfer.js:18|syncSettingsControls|declaration|需要进一步测试|document.getElementById, Math.round, state.groups     .map((g) => ${g.name}: ${(g.members ／／ []).join(", ")})     .join, state.groups     .map, (g.members ／／ []).join|
|src/runtime/audio/settings-and-transfer.js:34|updateMasterVolume|declaration|需要进一步测试|parseFloat, document.getElementById, Math.round, masterGainNode.gain.setValueAtTime, saveState|
|src/runtime/audio/settings-and-transfer.js:47|updateBgmVolume|declaration|需要进一步测试|Number, Number.isFinite, Math.max, Math.min, document.getElementById, Math.round, musicGainNode.gain.setTargetAtTime, STORAGE.set, showToast|
|src/runtime/audio/settings-and-transfer.js:62|renderBgmSlotList|declaration|需要进一步测试|document.getElementById, parseInt, Number, refreshSoundIdCache, checkSetCompleteness, hasSound, document.createElement, container.appendChild|
|src/runtime/audio/settings-and-transfer.js:126|renderFxSlotList|declaration|需要进一步测试|document.getElementById, FX_SOUND_SLOTS.forEach, ["roll_tick", "roll_loop", "roll_win"].includes, categories.has, categories.set, categories.get(category).push, categories.get, document.createElement, section.append, escapeHtml, renderFxChoices, fxContainer.append|
|src/runtime/audio/settings-and-transfer.js:162|previewBgmTrack|declaration|需要进一步测试|db.transaction, tx.objectStore, store.get, getAudioContext, ctx.decodeAudioData, req.result.arrayBuffer.slice, ctx.createBufferSource, src.connect, src.start|
|src/runtime/audio/settings-and-transfer.js:168|req.onsuccess|assignment|需要进一步测试|getAudioContext, ctx.decodeAudioData, req.result.arrayBuffer.slice, ctx.createBufferSource, src.connect, src.start|
|src/runtime/audio/settings-and-transfer.js:185|triggerUploadAudio|declaration|需要进一步测试|slotId.startsWith, document.getElementById, input.click|
|src/runtime/audio/settings-and-transfer.js:193|handleSoundFileUpload|declaration|需要进一步测试|Array.from, slotId.startsWith, slotId.slice, Promise.all(     files.map(       (file, index) =>         new Promise((resolve) => {           const candidate = !!fxKey && (append ／／ index > 0),             key = candidate               ? slotId + "::variant::" + crypto.randomUUID()               : slotId;           const reader = new FileReader();           reader.onerror = () => {             showToast("音频文件读取失败，原音频保留");             resolve(false);           };           reader.onload = async function (e) {             let decoded;             try {               const ctx = await getAudioContext();               decoded = await ctx.decodeAudioData(e.target.result.slice(0));             } catch (error) {               themeAlert("解析失败，请确保格式为 MP3/WAV");               resolve(false);               return;             }             if (fxKey) {               if (candidate)                 (customFxVariants[fxKey] ／／= []).push({                   id: key,                   name: file.name ／／ "候选音效",                   buffer: decoded,                 });               else customFxBuffers[fxKey] = decoded;             }             let saved = false;             try {               if (!db) throw Error("浏览器音频存储不可用");               await new Promise((done, reject) => {                 const tx = db.transaction("sounds", "readwrite");                 tx.oncomplete = done;                 tx.onerror = () => reject(tx.error ／／ Error("音频保存失败"));                 tx.onabort = () => reject(tx.error ／／ Error("音频保存中止"));                 tx.objectStore("sounds").put({                   id: key,                   name: file.name ／／ "",                   arrayBuffer: e.target.result,                 });               });               soundIdCache.add(key);               saved = true;             } catch (error) {               showToast(                 fxKey                   ? "音效仅在本页生效，未保存：" + error.message                   : "音频未保存，原已保存文件保留：" + error.message,               );             }             bgmEngine.preloadedSet = null;             bgmShufflePool = [];             if (saved)               showToast(                 candidate ? "候选音效已追加，播放时随机选择" : "音频已保存",               );             renderBgmSlotList();             renderFxSlotList();             renderItemFxSoundListV26();             resolve(saved);           };           reader.readAsArrayBuffer(file);         }),     ),   ).finally, Promise.all, files.map, crypto.randomUUID, showToast, resolve, getAudioContext, ctx.decodeAudioData, e.target.result.slice, themeAlert, (customFxVariants[fxKey] ／／= []).push, Error, db.transaction, reject, tx.objectStore("sounds").put, tx.objectStore, soundIdCache.add, renderBgmSlotList, renderFxSlotList, renderItemFxSoundListV26, reader.readAsArrayBuffer|
|src/runtime/audio/settings-and-transfer.js:210|reader.onerror|assignment|需要进一步测试|showToast, resolve|
|src/runtime/audio/settings-and-transfer.js:214|reader.onload|assignment|需要进一步测试|getAudioContext, ctx.decodeAudioData, e.target.result.slice, themeAlert, resolve, (customFxVariants[fxKey] ／／= []).push, Error, db.transaction, reject, tx.objectStore("sounds").put, tx.objectStore, soundIdCache.add, showToast, renderBgmSlotList, renderFxSlotList, renderItemFxSoundListV26|
|src/runtime/audio/settings-and-transfer.js:239|tx.onerror|assignment|需要进一步测试|reject, Error|
|src/runtime/audio/settings-and-transfer.js:240|tx.onabort|assignment|需要进一步测试|reject, Error|
|src/runtime/audio/settings-and-transfer.js:278|deleteBgmTrack|declaration|需要进一步测试|db.transaction, tx.objectStore, store.delete, soundIdCache.delete, showToast, renderBgmSlotList|
|src/runtime/audio/settings-and-transfer.js:292|deleteFxTrack|declaration|需要进一步测试|db.transaction, tx.objectStore, reject, store.getAllKeys, req.result           .filter(             (key) =>               key === idbKey ／／ String(key).startsWith(idbKey + "::variant::"),           )           .forEach, req.result           .filter, String(key).startsWith, String, store.delete, key.startsWith, soundIdCache.delete, showToast, renderFxSlotList, renderItemFxSoundListV26|
|src/runtime/audio/settings-and-transfer.js:299|tx.onerror|assignment|需要进一步测试|reject|
|src/runtime/audio/settings-and-transfer.js:300|tx.onabort|assignment|需要进一步测试|reject|
|src/runtime/audio/settings-and-transfer.js:302|req.onsuccess|assignment|需要进一步测试|req.result           .filter(             (key) =>               key === idbKey ／／ String(key).startsWith(idbKey + "::variant::"),           )           .forEach, req.result           .filter, String(key).startsWith, String, store.delete|
|src/runtime/audio/settings-and-transfer.js:323|exportAudioBundle|declaration|需要进一步测试|showToast, db.transaction, tx.objectStore, store.getAll, resolve, themeAlert, fileIndex.push, audioBuffersToPack.push, new TextEncoder().encode, JSON.stringify, headerView.setUint8, headerView.setUint32, URL.createObjectURL, document.createElement, a.click, URL.revokeObjectURL|
|src/runtime/audio/settings-and-transfer.js:332|req.onsuccess|assignment|需要进一步测试|resolve|
|src/runtime/audio/settings-and-transfer.js:333|req.onerror|assignment|需要进一步测试|resolve|
|src/runtime/audio/settings-and-transfer.js:382|triggerImportAudioBundle|declaration|需要进一步测试|openPwdModal, document.getElementById("bundleFileInput").click, document.getElementById|
|src/runtime/audio/settings-and-transfer.js:390|handleBundleFilePicked|declaration|需要进一步测试|showToast, dataView.getUint8, themeAlert, dataView.getUint32, JSON.parse, new TextDecoder().decode, db.transaction, tx.objectStore, fileIndex.forEach, store.put, fullBuffer.slice, refreshSoundIdCache, loadFxSounds, renderBgmSlotList, renderFxSlotList, renderItemFxSoundListV26, reader.readAsArrayBuffer|
|src/runtime/audio/settings-and-transfer.js:396|reader.onload|assignment|需要进一步测试|dataView.getUint8, themeAlert, dataView.getUint32, JSON.parse, new TextDecoder().decode, db.transaction, tx.objectStore, fileIndex.forEach, store.put, fullBuffer.slice, refreshSoundIdCache, loadFxSounds, renderBgmSlotList, renderFxSlotList, renderItemFxSoundListV26, showToast|
|src/runtime/audio/settings-and-transfer.js:425|tx.oncomplete|assignment|需要进一步测试|refreshSoundIdCache, loadFxSounds, renderBgmSlotList, renderFxSlotList, renderItemFxSoundListV26, showToast|
|src/runtime/audio/sound-playback.js:1|playChiptuneSynth|declaration|需要进一步测试|ActionSounds.slots.find, audioCtx.createOscillator, audioCtx.createGain, osc.frequency.setValueAtTime, gain.gain.setValueAtTime, gain.gain.exponentialRampToValueAtTime, osc.connect, gain.connect, getFxOutputV2176, osc.start, osc.stop, osc.frequency.exponentialRampToValueAtTime, freqs.forEach, [523.25, 783.99].forEach, notes.forEach, gain.gain.linearRampToValueAtTime, ClassroomFeedback.getOptions, Math.random, [1046.5, 1567.98].forEach|
|src/runtime/audio/sound-playback.js:172|playSound|declaration|需要进一步测试|getAudioContext, loadFxSounds, selectFxBuffer, ActionSounds.isClick, audioCtx.createBufferSource, audioCtx.createGain, ClassroomFeedback.getOptions, source.connect, gain.connect, getFxOutputV2176, ClassroomFeedback.ownClickVoice, source.start, playChiptuneSynth|
|src/runtime/bootstrap/classroom-startup.js:13|window.hideAudioHint|assignment|需要进一步测试|document.getElementById|
|src/runtime/bootstrap/classroom-startup.js:17|window.tryAutoResumeAndPlay|assignment|需要进一步测试|getAudioContext()       .then(() => {         if (           audioCtx &&           audioCtx.state === "running" &&           menuCfg.enabled &&           bgmEngine.state === "IDLE" &&           !menuBgm.active &&           currentView !== "battle"         ) {           menuStartOrSwitch(getMenuTrackKeyForView(currentView));           hideAudioHint();         }       })       .catch, getAudioContext()       .then, getAudioContext, menuStartOrSwitch, getMenuTrackKeyForView, hideAudioHint|
|src/runtime/bootstrap/classroom-startup.js:37|window.startResumeRetry|assignment|需要进一步测试|setInterval, clearInterval, hideAudioHint, document.getElementById, tryAutoResumeAndPlay|
|src/runtime/bootstrap/classroom-startup.js:59|window.closeWelcomeModal|assignment|需要进一步测试|document.getElementById, hideClassroomWindow, hideAudioHint, startResumeRetry, tryAutoResumeAndPlay|
|src/runtime/bootstrap/classroom-startup.js:68|unlockByGesture|binding|需要进一步测试|getAudioContext()       .then(() => {         hideAudioHint();         const wm = document.getElementById("welcomeModal");         if (wm && wm.classList.contains("active")) return;         startResumeRetry();         if (           menuCfg.enabled &&           bgmEngine.state === "IDLE" &&           currentView !== "battle"         ) {           if (!menuBgm.active)             menuStartOrSwitch(getMenuTrackKeyForView(currentView));         }       })       .catch, getAudioContext()       .then, getAudioContext, hideAudioHint, document.getElementById, wm.classList.contains, startResumeRetry, menuStartOrSwitch, getMenuTrackKeyForView|
|src/runtime/classroom/group-actions.js:1|addGroup|declaration|需要进一步测试|openPwdModal, Date.now, recordHistory, state.groups.push, StableIdentity.createGroupUid, playSound, saveState, renderAll|
|src/runtime/classroom/group-actions.js:28|deleteGroup|declaration|需要进一步测试|openPwdModal, state.groups.find, themeConfirm, recordHistory, state.groups.filter, saveState, renderAll|
|src/runtime/classroom/group-actions.js:48|updateGroupName|declaration|需要进一步测试|state.groups.find, saveState, updateHeaderStats, renderChart, renderDashboard|
|src/runtime/classroom/group-actions.js:59|updateGroupColor|declaration|需要进一步测试|state.groups.find, saveState, renderAll|
|src/runtime/classroom/group-actions.js:68|resetAllScores|declaration|需要进一步测试|cancelScoreAnimationAndSync, openPwdModal, themeConfirm, recordHistory, state.groups.forEach, updates.push, animateScores, playSound, saveState|
|src/runtime/classroom/group-palette.js:1|selectGroupPresetColorV21716|declaration|需要进一步测试|openPwdModal, /^#[0-9a-f]{6}$/i.test, updateGroupColor, renderItemWindow|
|src/runtime/classroom/group-palette.js:12|previewItemDetailColorV21716|declaration|需要进一步测试|previewItemDetailColor, document.getElementById, String(value ／／ "").toUpperCase, String|
|src/runtime/classroom/hand-reward-controls.js:2|scoreSnapshotV218|declaration|需要进一步测试|state.groups.map, Number|
|src/runtime/classroom/hand-reward-controls.js:5|showHandEffectV218|declaration|需要进一步测试|document.getElementById, state.groups.forEach, before.get, Number, lines.push, escapeHtml, itemVisual, lines.join, overlay.classList.add, clearTimeout, setTimeout, overlay.classList.remove|
|src/runtime/classroom/hand-reward-controls.js:34|handUseOneV218|declaration|需要进一步测试|state.groups.find, showToast, scoreSnapshotV218, globalThis.HandItemCinematic?.mark, useItem, setTimeout, showHandEffectV218, renderHandRewardControlsV218|
|src/runtime/classroom/hand-reward-controls.js:50|handUseAllTripleV218|declaration|需要进一步测试|state.groups.find, TRIPLE_KEYS_V218.has, showToast, scoreSnapshotV218, Math.min, Number, globalThis.HandItemCinematic?.mark, showHandEffectV218, renderHandRewardControlsV218, useItem, setTimeout, fire|
|src/runtime/classroom/hand-reward-controls.js:63|fire|binding|需要进一步测试|state.groups.find, showHandEffectV218, renderHandRewardControlsV218, useItem, setTimeout|
|src/runtime/classroom/hand-reward-controls.js:77|renderHandRewardControlsV218|declaration|需要进一步测试|document.getElementById, state.groups.find, TRIPLE_KEYS_V218.has, Number, eligibleForItems, ClassroomFeedback.slotMarkup, escapeHtml|
|src/runtime/classroom/hand-reward-controls.js:98|judgeHandRaise|assignment|需要进一步测试|_v218JudgeHandRaise.call, setTimeout|
|src/runtime/classroom/hand-reward-controls.js:105|finishHandItemReward|assignment|需要进一步测试|renderHandRewardControlsV218|
|src/runtime/classroom/quick-person-score.js:7|allStudentsV218|declaration|需要进一步测试|state.groups.forEach, (g.members ／／ []).forEach, parseStudentV218, out.push, pinyinInitialV218|
|src/runtime/classroom/quick-person-score.js:23|numberBandV218|declaration|需要进一步测试|Number.isFinite, Math.floor|
|src/runtime/classroom/quick-person-score.js:29|openQuickPersonScoreV218|declaration|需要进一步测试|qpStateV218.selected.clear, qpStateV218.bands.clear, qpStateV218.groups.clear, qpStateV218.letters.clear, document.getElementById, renderQuickPersonFiltersV218, renderQuickPersonListV218, showClassroomWindow|
|src/runtime/classroom/quick-person-score.js:40|closeQuickPersonScoreV218|declaration|需要进一步测试|hideClassroomWindow, document.getElementById|
|src/runtime/classroom/quick-person-score.js:43|toggleQPSetV218|declaration|需要进一步测试|set.has, set.delete, set.add, renderQuickPersonFiltersV218, renderQuickPersonListV218|
|src/runtime/classroom/quick-person-score.js:49|renderQuickPersonFiltersV218|declaration|需要进一步测试|allStudentsV218, [     ...new Set(students.map((s) => numberBandV218(s.p.number)).filter(Boolean)),   ].sort, students.map((s) => numberBandV218(s.p.number)).filter, students.map, numberBandV218, parseInt, document.getElementById, bands         .map(           (x) =>             <button class="quick-person-chip ${qpStateV218.bands.has(x) ? "active" : ""}" onclick="toggleQPSetV218('bands','${x}')">${x}</button>,         )         .join, bands         .map, qpStateV218.bands.has, state.groups       .map(         (g) =>           <button class="quick-person-chip ${qpStateV218.groups.has(g.id) ? "active" : ""}" style="${qpStateV218.groups.has(g.id) ? background:${g.color};border-color:${g.color} : ""}" onclick="toggleQPSetV218('groups',${g.id})">${escapeHtml(g.name)}</button>,       )       .join, state.groups       .map, qpStateV218.groups.has, escapeHtml, "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split, letters       .map(         (x) =>           <button class="quick-person-chip quick-person-letter ${qpStateV218.letters.has(x) ? "active" : ""}" onclick="toggleQPSetV218('letters','${x}')">${x}</button>,       )       .join, letters       .map, qpStateV218.letters.has|
|src/runtime/classroom/quick-person-score.js:84|filteredStudentsV218|declaration|需要进一步测试|(document.getElementById("qpSearchV218")?.value ／／ "")     .trim()     .toLowerCase, (document.getElementById("qpSearchV218")?.value ／／ "")     .trim, document.getElementById, allStudentsV218().filter, allStudentsV218, q.replace, s.p.name.toLowerCase().includes, s.p.name.toLowerCase, String(s.member).toLowerCase().includes, String(s.member).toLowerCase, String, String(s.p.number).includes, qpStateV218.bands.has, numberBandV218, qpStateV218.groups.has, qpStateV218.letters.has|
|src/runtime/classroom/quick-person-score.js:110|renderQuickPersonListV218|declaration|需要进一步测试|document.getElementById, filteredStudentsV218, list         .map(           (s) =>      <button class="quick-person-entry ${qpStateV218.selected.has(s.key) ? "selected" : ""}" onclick="toggleQuickPersonV218('${escapeHtml(s.key).replace(/'/g, "&#39;")}')">       ${s.p.number != null ? <span class="student-no" style="background:${s.group.color}">${escapeHtml(s.p.numberText)}</span> : '<span class="student-no" style="background:#94a3b8">—</span>'}       <span class="student-name">${escapeHtml(s.p.name)}</span>       <span class="quick-person-group" title="${escapeHtml(s.group.name)}">${escapeHtml(s.group.name)}</span>     </button>,         )         .join, list         .map, qpStateV218.selected.has, escapeHtml(s.key).replace, escapeHtml|
|src/runtime/classroom/quick-person-score.js:129|toggleQuickPersonV218|declaration|需要进一步测试|qpStateV218.selected.has, qpStateV218.selected.delete, qpStateV218.selected.add, renderQuickPersonListV218|
|src/runtime/classroom/quick-person-score.js:135|applyQuickPersonScoreV218|declaration|需要进一步测试|openPwdModal, Number, Number.isSafeInteger, showToast, allStudentsV218().filter, allStudentsV218, qpStateV218.selected.has, selected.forEach, counts.set, counts.get, Reliability.planBatchScoreChanges, updates       .map((u) => {         const name = state.groups.find((g) => g.id === u.id)?.name ／／ "小组";         return name + " " + (u.delta >= 0 ? "+" : "") + u.delta;       })       .join, updates       .map, state.groups.find, cancelScoreAnimationAndSync, runClassroomCommand, animateScores, updates.map, playSound, ClassroomFeedback.score, updates.reduce|
|src/runtime/classroom/quick-person-score.js:195|applyQuickPersonCustomV218|declaration|需要进一步测试|Number, document.getElementById, Number.isFinite, showToast, applyQuickPersonScoreV218|
|src/runtime/classroom/roster-settings-actions.js:1|applySettingsBatchMembers|declaration|需要进一步测试|openPwdModal, document.getElementById("settingsBatchMemberText").value.trim, document.getElementById, themeAlert, text     .split("\n")     .map((l) => l.trim())     .filter, text     .split("\n")     .map, text     .split, l.trim, lines.forEach, line.includes, line.split, parts[0].trim, parts.slice(1).join(delimiter).trim, parts.slice(1).join, parts.slice, membersStr         .split(/[,，、\s]+/)         .map((m) => m.trim())         .filter, membersStr         .split(/[,，、\s]+/)         .map, membersStr         .split, m.trim, state.groups.find, g.name.trim, newGroups.push, Date.now, Array.from, normalizeAllGroups, saveState, renderAll, updatePickerPoolUI, showToast, closeSoundModal|
|src/runtime/classroom/roster-settings-actions.js:62|batchSelectOption|declaration|需要进一步测试|AnswerCommands.batchSelect|
|src/runtime/classroom/roster-settings-actions.js:65|batchToggleAllIn|declaration|需要进一步测试|AnswerCommands.batchToggleAllIn|
|src/runtime/classroom/roster-text-import.js:1|openBatchImportModal|declaration|需要进一步测试|openPwdModal, state.groups     .map((g) => ${g.name}: ${g.members.join(", ")})     .join, state.groups     .map, g.members.join, document.getElementById, showClassroomWindow|
|src/runtime/classroom/roster-text-import.js:13|closeBatchImportModal|declaration|需要进一步测试|hideClassroomWindow, document.getElementById|
|src/runtime/classroom/roster-text-import.js:17|applyBatchImport|declaration|需要进一步测试|document.getElementById("batchTextarea").value.trim, document.getElementById, closeBatchImportModal, text     .split("\n")     .map((l) => l.trim())     .filter, text     .split("\n")     .map, text     .split, l.trim, lines.forEach, line.includes, line.split, state.groups.find, g.name.trim, grpName.trim, g.name.replace, grpName.replace, membersStr           .split(/[,，、\s]+/)           .map((m) => m.trim())           .filter, membersStr           .split(/[,，、\s]+/)           .map, membersStr           .split, m.trim, Array.from, saveState, renderGrid, updatePickerPoolUI, showToast|
|src/runtime/classroom/student-labels-and-search.js:4|parseStudentV218|declaration|需要进一步测试|String(raw ?? "").trim, String, text.match, Number, (m[2] ／／ "").trim|
|src/runtime/classroom/student-labels-and-search.js:16|studentLabelHTMLV218|declaration|需要进一步测试|parseStudentV218, escapeHtml|
|src/runtime/classroom/student-labels-and-search.js:22|pinyinInitialV218|declaration|需要进一步测试|parseStudentV218(raw).name.trim, parseStudentV218, /[A-Za-z]/.test, ch.toUpperCase, /\d/.test, ch.localeCompare|
|src/runtime/classroom/student-labels-and-search.js:72|renderBattleRankPreviewV21721|assignment|需要进一步测试|_v218RenderBattleRankPreview.apply, Number, Date.now, document       .querySelectorAll(         "#battleRankPreviewGridV21721 .battle-rank-score",       )       .forEach, document       .querySelectorAll|
|src/runtime/classroom/student-labels-and-search.js:86|searchMemberGroups|assignment|需要进一步测试|document.getElementById, input.value.trim().toLowerCase, input.value.trim, state.groups.forEach, (g.members ／／ []).forEach, parseStudentV218, String(p.number).includes, String, q.replace, p.name.toLowerCase().includes, p.name.toLowerCase, String(member).toLowerCase().includes, String(member).toLowerCase, /\d/.test, matches.push, escapeHtml, matches     .map(       ({ member, p, group: g }) =>      <div class="member-search-result">       <div class="member-search-result-name">${studentLabelHTMLV218(member, g)}</div>       <div class="member-search-result-group" style="color:${g.color}">${escapeHtml(g.name)}</div>     </div>,     )     .join, matches     .map, studentLabelHTMLV218|
|src/runtime/classroom/student-labels-and-search.js:130|syncPickerScoreTarget|assignment|需要进一步测试|document.getElementById, DesktopUI.pickerChanged, escapeHtml, studentLabelHTMLV218|
|src/runtime/competition/answer-adapter.js:1|selectGroupOpt|declaration|需要进一步测试|AnswerCommands.select|
|src/runtime/competition/answer-adapter.js:4|toggleAllInCard|declaration|需要进一步测试|AnswerCommands.toggleAllIn|
|src/runtime/competition/answer-adapter.js:8|setCorrectAns|declaration|需要进一步测试|AnswerCommands.correct|
|src/runtime/competition/answer-adapter.js:12|settleBaseRoundLegacy|declaration|需要进一步测试|themeAlert, captureCardRectsV21725, CompetitionRules.calculateRound, state.groups.forEach, scoreUpdates.push, Math.floor(Math.abs(oldScore)).toString, Math.floor, Math.abs, Math.floor(Math.abs(g.score)).toString, milestoneGroups.push|
|src/runtime/competition/batch-all-in-guard.js:5|batchToggleAllIn|assignment|需要进一步测试|showToast, playSound, state.groups.filter, locked.forEach, saveState, renderGrid, renderDashboard, refreshAllInMusicAfterItemUseV2177, eligible.every, eligible.forEach, state.groups.forEach, checkAllInRatio, bgmTransitionThinkingToBattle, bgmTransitionBattleToThinking|
|src/runtime/competition/round-actions.js:1|handleMainAction|declaration|需要进一步测试|startRound, judgeRound|
|src/runtime/competition/round-actions.js:9|preloadInitialAudio|declaration|需要进一步测试|getAudioContext, bgmPreloadNextSet|
|src/runtime/competition/round-actions.js:18|startRound|declaration|需要进一步测试|Reliability.invalidateDefenseDecisions, RoundSettlement.captureRoundToken, document.getElementById, getAudioContext, Promise.race, hasAnyPlayableBgm, setTimeout, res, RoundSettlement.isRoundTokenCurrent, showToast, finishStartRound, bgmStartNewRoundMusicWithProgress, playSound|
|src/runtime/competition/round-actions.js:93|finishStartRound|declaration|需要进一步测试|RoundSettlement.start|
|src/runtime/competition/round-actions.js:97|hasAnyPlayableBgm|declaration|需要进一步测试|initDB, refreshSoundIdCache, getAllCompleteSetIndices, getFallbackSetIndex|
|src/runtime/competition/round-actions.js:114|nextRound|declaration|需要进一步测试|themeAlert, Reliability.invalidateDefenseDecisions, RoundSettlement.captureRoundToken, document.getElementById, bgmStopAll, bgmStartNewRoundMusicWithProgress, RoundSettlement.isRoundTokenCurrent, showToast, playSound, captureCardRectsV21725, runClassroomCommand, resetRoundItemUseLocksV2177, state.groups.forEach, classroomCommands.whenIdle, checkAllInRatio, bgmTransitionThinkingToBattle, bgmTransitionBattleToThinking, animateCardsFromSnapshotV21725|
|src/runtime/competition/round-actions.js:195|forceEndRound|declaration|需要进一步测试|RoundSettlement.forceEnd|
|src/runtime/competition/season-cleanup.js:4|resetCompetitionDataAfterSettlementV21812|declaration|需要进一步测试|cancelScoreAnimationAndSync, StableIdentity.createSeasonId, state.groups.forEach, STORAGE.getJSON, resetSlotDisplay, document.getElementById("squidVeil")?.classList.remove, document.getElementById, document       .querySelectorAll(".squid-hidden-score")       .forEach, document       .querySelectorAll, el.classList.remove, STORAGE.setJSON, document.getElementById("itemWindow")?.classList.remove, document.getElementById("handRaiseBackdrop")?.classList.remove, document.getElementById("itemDrawOverlay")?.classList.remove, ensureV2State|
|src/runtime/core/state-and-preferences.js:20|readableTextOnColor|declaration|需要进一步测试|String(hex ／／ "")     .trim()     .replace, String(hex ／／ "")     .trim, String, raw           .split("")           .map((x) => x + x)           .join, raw           .split("")           .map, raw           .split, /^[0-9a-f]{6}$/i.test, [0, 2, 4]     .map((i) => parseInt(value.slice(i, i + 2), 16) / 255)     .map, [0, 2, 4]     .map, parseInt, value.slice, Math.pow, [23, 48, 45]     .map((v) => v / 255)     .map, [23, 48, 45]     .map|
|src/runtime/core/state-and-preferences.js:178|clone|binding|需要进一步测试|JSON.parse, JSON.stringify|
|src/runtime/core/state-and-preferences.js:278|normalizeGroupAvatarV2200|declaration|需要进一步测试|/^data:image\/(png／jpeg／webp);base64,[A-Za-z0-9+/=]+$/.test|
|src/runtime/core/state-and-preferences.js:286|normalizeGroup|declaration|需要进一步测试|Number, Number.isFinite, Date.now, Number.isSafeInteger, /^#[0-9a-fA-F]{6}$/.test, String, Array.isArray, source.members.map((v) => String(v ?? "").trim()).filter, source.members.map, String(v ?? "").trim, StableIdentity.isValidGroupUid, StableIdentity.createGroupUid, String(source.name ?? 第 ${index + 1} 组).trim, Math.trunc, ["A", "B", "C", "D"].includes, normalizeGroupAvatarV2200, source.inventory.map, Reliability.normalizeStats, Reliability.normalizeEffect, CompetitionEffects.normalize, Math.max|
|src/runtime/core/state-and-preferences.js:349|normalizeAllGroups|declaration|需要进一步测试|StableIdentity.assignGroupUids(     Array.isArray(groups) ? groups : [],   ).map, StableIdentity.assignGroupUids, Array.isArray, normalizeGroup, seen.has, Date.now, seen.add|
|src/runtime/core/state-and-preferences.js:362|initSessionState|declaration|需要进一步测试|normalizeAllGroups, ["individual", "group", "two_tier"].includes, Array.isArray, state.groups.forEach|
|src/runtime/core/state-and-preferences.js:423|checkAllInRatio|declaration|需要进一步测试|state.groups.filter|
|src/runtime/history/boot-and-settings-compat.js:35|removeBgmEngineeringConsoleV26|declaration|需要进一步测试|document.getElementById("bgmEngineConsole")?.remove, document.getElementById, document     .querySelectorAll("#view-settings .setting-section-title")     .forEach, document     .querySelectorAll, x.textContent.includes, x.remove|
|src/runtime/history/compatibility-ui.js:1|openHistoryModal|declaration|需要进一步测试|switchView|
|src/runtime/history/compatibility-ui.js:5|closeHistoryModal|declaration|需要进一步测试|switchView|
|src/runtime/history/compatibility-ui.js:9|renderHistoryList|declaration|需要进一步测试|DesktopUI.renderHistory|
|src/runtime/history/compatibility-ui.js:13|toggleHistExpand|declaration|需要进一步测试|document.querySelectorAll, node.classList.toggle|
|src/runtime/history/compatibility-ui.js:19|clearHistoryStack|declaration|需要进一步测试|HistoryCommands.clear|
|src/runtime/history/compatibility-ui.js:23|revertToHistory|declaration|需要进一步测试|HistoryCommands.revert|
|src/runtime/items/attack-legacy.js:1|detectOvertakePunish|declaration|需要进一步测试|state.groups.find, ["star", "mega"].includes, ranking().map, ranking, beforeOrder.indexOf, after.indexOf, beforeOrder     .slice(afterIdx, beforeIdx)     .filter, beforeOrder     .slice, passed.forEach, eligibleForItems, tryDefend, roundQuarter|
|src/runtime/items/attack-legacy.js:25|legacyUseItem|declaration|需要进一步测试|useItem|
|src/runtime/items/attack-legacy.js:28|flashBomb|declaration|需要进一步测试|setTimeout, document.querySelector, c.classList.add, c.classList.remove|
|src/runtime/items/attack-legacy.js:38|startBulletTimer|declaration|需要进一步测试|clearInterval, setInterval, ensureItemState, state.groups.forEach, state.groups.find, rankIndex, g.inventory.findIndex, g.inventory.splice, showToast, eligibleForItems, saveState, renderGrid, renderChart, renderDashboard|
|src/runtime/items/attack-legacy.js:69|startBlooperClock|declaration|需要进一步测试|applyBlooperMask, Date.now, setTimeout|
|src/runtime/items/attack-legacy.js:74|applyBlooperMask|declaration|需要进一步测试|Date.now, document.getElementById, v.classList.toggle, document     .querySelectorAll(".row-score,.chart-score,.podium-score,.w-stat-num")     .forEach, document     .querySelectorAll, el.classList.toggle|
|src/runtime/items/card-effects-legacy.js:40|battleCard|declaration|需要进一步测试|document.querySelector|
|src/runtime/items/card-effects-legacy.js:47|clearCardFx|declaration|需要进一步测试|[...card.classList]     .filter(       (x) =>         x.startsWith("cfx-") ／／         [           "card-use-fx",           "card-hit-fx",           "card-defend-fx",           "card-heal-fx",         ].includes(x),     )     .forEach, [...card.classList]     .filter, x.startsWith, [           "card-use-fx",           "card-hit-fx",           "card-defend-fx",           "card-heal-fx",         ].includes, card.classList.remove, card.querySelectorAll(".card-fx-badge").forEach, card.querySelectorAll, x.remove, card.style.removeProperty|
|src/runtime/items/card-effects-legacy.js:64|playCasterCardFx|declaration|需要进一步测试|DesktopUI.getPreferences, battleCard, clearCardFx, card.classList.add, document.createElement, itemVisual, escapeHtml, card.appendChild, setTimeout, card.classList.remove, b.remove|
|src/runtime/items/card-effects-legacy.js:86|playTargetCardFx|declaration|需要进一步测试|DesktopUI.visualEvent, DesktopUI.getPreferences, battleCard, card.classList.remove, card.style.setProperty, card.classList.add, setTimeout, card.style.removeProperty|
|src/runtime/items/card-effects-legacy.js:123|cardFxTargets|declaration|需要进一步测试|ranking, r.findIndex, ids.includes, ids.push, ["red_shell", "triple_red", "boo"].includes, add, ["banana", "triple_banana"].includes, r.slice(0, Math.max(0, i)).forEach, r.slice, Math.max, r.slice(i + 1).forEach|
|src/runtime/items/card-effects-legacy.js:127|add|binding|需要进一步测试|ids.includes, ids.push|
|src/runtime/items/card-effects-legacy.js:144|showItemUseFx|assignment|需要进一步测试|playCasterCardFx, cardFxTargets, ["coin_shell", "question_block"].includes, targets.forEach, setTimeout, playTargetCardFx, console.warn, _v25ShowItemUseFx|
|src/runtime/items/catalog-adapters.js:34|itemKeysV283|declaration|需要进一步测试|ITEM_ORDER_V283.filter|
|src/runtime/items/catalog-adapters.js:38|itemAdminButtonV283|declaration|需要进一步测试|itemVisual, escapeHtml|
|src/runtime/items/catalog-adapters.js:42|godAddItemV283|declaration|需要进一步测试|state.groups.find, showToast, Number, recordHistory, addItemToGroup, saveState, renderAll, renderGroupModalV283|
|src/runtime/items/catalog-adapters.js:62|renderGodItemManagerV283|declaration|需要进一步测试|state.groups.find, document.querySelectorAll, roots.find, x.closest, document.querySelector, document.createElement, tactical.appendChild, itemKeysV283()     .map((k) => itemAdminButtonV283(k, gid))     .join, itemKeysV283()     .map, itemKeysV283, itemAdminButtonV283|
|src/runtime/items/catalog-adapters.js:88|patchVisibleGodManagerV283|declaration|需要进一步测试|document.querySelectorAll, all.find, /上帝模式.*强制道具管理/.test, document.createElement, title.insertAdjacentElement, itemKeysV283()     .map((k) => itemAdminButtonV283(k, gid))     .join, itemKeysV283()     .map, itemKeysV283, itemAdminButtonV283|
|src/runtime/items/catalog-adapters.js:108|renderEncyclopediaV283|declaration|需要进一步测试|document.querySelectorAll, headings.find, /22\s*种道具百科／26\s*种道具百科/.test, candidates.indexOf, candidates     .slice(start)     .filter, candidates     .slice, x.matches, x.querySelector, cards.forEach, x.remove, itemKeysV283().forEach, itemKeysV283, document.createElement, itemVisual, escapeHtml, parent.appendChild, itemKeysV283()       .map((k) => {         const d = ITEM_DEFS[k];         return <div class="guide-block encyclopedia-item"><b>${itemVisual(k)} ${escapeHtml(d.name)}</b><br>${escapeHtml(d.desc ／／ "")}</div>;       })       .join, itemKeysV283()       .map|
|src/runtime/items/catalog-adapters.js:151|appendMissingEncyclopediaV283|declaration|需要进一步测试|document.querySelectorAll("h1,h2,h3").forEach, document.querySelectorAll, /22\s*种道具百科/.test, document.querySelector, [...about.querySelectorAll("h1,h2,h3")].find, about.querySelectorAll, /26\s*种道具百科/.test, ["feather", "fire_flower", "ice_flower", "boomerang_flower"].forEach, (parent.innerText ／／ "").includes, document.createElement, itemVisual, escapeHtml, parent.appendChild|
|src/runtime/items/catalog-adapters.js:177|patchItemIconSettingsV283|declaration|需要进一步测试|document.querySelector, [...setting.querySelectorAll("*")].filter, setting.querySelectorAll, /道具.*图标／自定义道具/.test, ["feather", "fire_flower", "ice_flower", "boomerang_flower"].forEach, txt.includes, document.createElement, itemVisual, escapeHtml, region.appendChild|
|src/runtime/items/catalog-adapters.js:201|renderGroupModalV283|declaration|需要进一步测试|setTimeout, patchVisibleGodManagerV283|
|src/runtime/items/catalog-adapters.js:206|openGroupModal|assignment|需要进一步测试|_v283OpenGroupModal.call, renderGroupModalV283|
|src/runtime/items/catalog-adapters.js:214|renderGroupModal|assignment|需要进一步测试|_v283RenderGroupModal.apply, renderGroupModalV283|
|src/runtime/items/catalog-adapters.js:226|openAboutModal|assignment|需要进一步测试|_v283OpenAbout.apply, setTimeout, appendMissingEncyclopediaV283|
|src/runtime/items/catalog-refresh.js:1|refresh26ItemInterfacesV284|declaration|需要进一步测试|Object.keys, document.querySelectorAll(".custom-item-icon-row").forEach, document.querySelectorAll, x.remove, document.querySelectorAll(".setting-section-title,h1,h2,h3").forEach, /22\s*种道具百科/.test, (x.textContent ／／ "").replace, /22\s*种道具百科与图标管理/.test, renderItemEncyclopedia, document.getElementById("itemWindow")?.classList.contains, document.getElementById, renderItemWindow|
|src/runtime/items/catalog-refresh.js:32|appendMissingEncyclopediaV283|assignment|需要进一步测试||
|src/runtime/items/catalog-refresh.js:33|patchItemIconSettingsV283|assignment|需要进一步测试||
|src/runtime/items/catalog-refresh.js:36|patchVisibleGodManagerV283|assignment|需要进一步测试||
|src/runtime/items/catalog-refresh.js:37|renderGroupModalV283|assignment|需要进一步测试||
|src/runtime/items/defense-chain-compat.js:68|explodeDestroyedBombV2170|declaration|需要进一步测试|ranking, r.findIndex, [r[i - 1], r[i + 1]].filter, eligibleForItems, tinyDefenseToast, targets.forEach, roundQuarter, applyItemScore, setTimeout, flashBomb|
|src/runtime/items/defense-chain-compat.js:97|destroyPrimaryBasicDefenseV2170|declaration|需要进一步测试|BASIC_DEFENSE_KEYS_V2170.has, target.inventory.splice, tinyDefenseToast, explodeDestroyedBombV2170|
|src/runtime/items/defense-chain-compat.js:130|detectOvertakePunish|assignment|需要进一步测试|state.groups.find, ["star", "mega"].includes, ranking().map, ranking, beforeOrder.indexOf, after.indexOf, beforeOrder     .slice(afterIdx, beforeIdx)     .filter, beforeOrder     .slice, passed.forEach, eligibleForItems, destroyPrimaryBasicDefenseV2170, tryDefend, roundQuarter|
|src/runtime/items/defense-chain-compat.js:166|isQueuePersistentActiveV2120|assignment|需要进一步测试|["mega", "power"].includes|
|src/runtime/items/defense-chain-compat.js:176|tryDefendLightningV2116|assignment|需要进一步测试|Number, Math.max, tinyDefenseToast, setTimeout, playAttackTargetFxV2116, ["star", "mega"].includes|
|src/runtime/items/definitions-and-state.js:247|normalizeInventoryV21718|declaration|需要进一步测试|(Array.isArray(inventory) ? inventory : [])     .slice(0, 3)     .filter((it) => {       const key = it && it.key;       if (!ITEM_DEFS[key] ／／ seen.has(key)) return false;       seen.add(key);       return true;     })     .map, (Array.isArray(inventory) ? inventory : [])     .slice(0, 3)     .filter, (Array.isArray(inventory) ? inventory : [])     .slice, Array.isArray, seen.has, seen.add, Number.isInteger, Math.max, Number, Number.isFinite, Math.min, Math.trunc, Date.now, StableIdentity.isValidItemInstanceId, StableIdentity.createItemInstanceId, Object.keys|
|src/runtime/items/definitions-and-state.js:295|ensureItemState|declaration|需要进一步测试|state.groups.forEach, CompetitionEffects.normalize, Array.isArray, normalizeInventoryV21718, Number.isFinite|
|src/runtime/items/draw-flow.js:9|startDrawSoundBedV2164|assignment|需要进一步测试|stopActiveDrawAudioV2171, playTrackedDrawSoundV2171, setInterval, clearInterval, setTimeout, finishDrawAudioV2171|
|src/runtime/items/draw-flow.js:44|globalItemDraw|declaration|需要进一步测试|ensureV2State, state.groups.filter, eligibleForItems, Array.isArray, showToast, node?.remove, parent?.querySelector, parent?.classList.remove, BattleMotion.releaseDraw, cleanup, overlays.forEach, removeOverlay, stopActiveDrawAudioV2171, performance.now, eligible.forEach, document.querySelector, c.classList.add, document.createElement, c.appendChild, overlays.set, BattleMotion.trackDraw, isCurrent, Math.min, Math.pow, lastUpdate.get, lastUpdate.set, updateCardRouletteVisual, overlays.get, roulettePreviewPickV282, requestAnimationFrame, resolveReveal, node.classList.add, node.querySelector, renderGrid, setTimeout, BattleMotion.fadeDraw, renderAll, runClassroomCommand, beginDrawSessionV21710, classroomCommands.defer, eligible.some, state.groups.includes, Error, pickItemForGroupV281, addItemToGroup, batchUsed.add, command.emit, awards.push, document.getElementById("view-battle")?.classList.contains, document.getElementById, switchView, DesktopUI.visualEvent, startDrawSoundBedV2164, mountOverlays, classroomCommands.whenIdle().then, classroomCommands.whenIdle, presentCommittedAwards, console.error|
|src/runtime/items/draw-flow.js:71|removeOverlay|declaration|需要进一步测试|node?.remove, parent?.querySelector, parent?.classList.remove, BattleMotion.releaseDraw|
|src/runtime/items/draw-flow.js:79|isCurrent|declaration|需要进一步测试|cleanup|
|src/runtime/items/draw-flow.js:93|cleanup|declaration|需要进一步测试|overlays.forEach, removeOverlay, stopActiveDrawAudioV2171|
|src/runtime/items/draw-flow.js:115|mountOverlays|declaration|需要进一步测试|eligible.forEach, document.querySelector, c.classList.add, document.createElement, c.appendChild, overlays.set, BattleMotion.trackDraw|
|src/runtime/items/draw-flow.js:135|frame|declaration|需要进一步测试|isCurrent, Math.min, Math.pow, eligible.forEach, lastUpdate.get, lastUpdate.set, updateCardRouletteVisual, overlays.get, roulettePreviewPickV282, requestAnimationFrame, resolveReveal|
|src/runtime/items/draw-flow.js:159|presentCommittedAwards|declaration|需要进一步测试|overlays.get, updateCardRouletteVisual, node.classList.add, node.querySelector, renderGrid, setTimeout, isCurrent, overlays.forEach, BattleMotion.fadeDraw, removeOverlay, renderAll|
|src/runtime/items/draw-flow.js:288|handDrawItem|declaration|需要进一步测试|showToast, ensureV2State, state.groups.find, eligibleForItems, beginDrawSessionV21710, DesktopUI.visualEvent, startDrawSoundBedV2164, performance.now, document.getElementById, escapeHtml, BattleMotion.enterDrawContent, Math.min, Math.pow, roulettePreviewPickV282, itemVisual, cap.animate, requestAnimationFrame, cancelHandItemDraw, renderHandRaise, pickItemForGroupV281, runClassroomCommand, addItemToGroup, context.emit, classroomCommands.whenIdle().then, classroomCommands.whenIdle, renderAll, Math.max|
|src/runtime/items/draw-flow.js:337|frame|declaration|需要进一步测试|Math.min, Math.pow, document.getElementById, state.groups.find, roulettePreviewPickV282, itemVisual, cap.animate, requestAnimationFrame, eligibleForItems, cancelHandItemDraw, showToast, renderHandRaise, pickItemForGroupV281, runClassroomCommand, addItemToGroup, context.emit, classroomCommands.whenIdle().then, classroomCommands.whenIdle, renderAll, Math.max, escapeHtml, BattleMotion.enterDrawContent|
|src/runtime/items/draw-flow.js:455|playCasterCardFx|assignment|需要进一步测试|BattleMotion.show|
|src/runtime/items/draw-flow.js:458|playTargetCardFx|assignment|需要进一步测试|BattleMotion.show|
|src/runtime/items/draw-flow.js:461|playAttackTargetFxV2116|assignment|需要进一步测试|BattleMotion.show|
|src/runtime/items/draw-session-throttle.js:15|ensureDrawSessionThrottleV21710|declaration|需要进一步测试|ensureItemState, Math.max, Math.floor, Number, ["lightning", "blooper"].forEach|
|src/runtime/items/draw-session-throttle.js:46|beginDrawSessionV21710|declaration|需要进一步测试|ensureDrawSessionThrottleV21710, saveState|
|src/runtime/items/draw-session-throttle.js:63|sessionRestrictedWeightsV21710|declaration|需要进一步测试|ranking, Math.max, r.findIndex, itemDropWeights, ensureDrawSessionThrottleV21710, Number, activeDrawSessionV21710?.selectedGlobalUnique?.has, itemExistsOnFieldV2172, ensureDrawThrottleV2179, STRONG_GROUP_ITEMS_V2179.forEach|
|src/runtime/items/draw-session-throttle.js:101|commitSessionDrawV21710|declaration|需要进一步测试|ensureDrawSessionThrottleV21710, ensureDrawThrottleV2179, Math.max, Number, STRONG_GROUP_ITEMS_V2179.has, GLOBAL_FIVE_DRAW_ITEMS_V2179.has, activeDrawSessionV21710.selectedGlobalUnique.add|
|src/runtime/items/draw-session-throttle.js:133|pickItemForGroupV281|assignment|需要进一步测试|heldItemKeysV281, sessionRestrictedWeightsV21710, weightedPickNoRepeatV281, weightedPick, ITEM_KEYS.forEach, Number, Object.keys, commitSessionDrawV21710|
|src/runtime/items/draw-session-throttle.js:160|refreshDrawCooldownInfoV21710|declaration|需要进一步测试|document.getElementById, ensureDrawSessionThrottleV21710, Number, text|
|src/runtime/items/draw-session-throttle.js:166|text|binding|需要进一步测试|Number|
|src/runtime/items/draw-session-throttle.js:186|installDrawCooldownInfoV2179|assignment|需要进一步测试|_v21710InstallInfo.apply, refreshDrawCooldownInfoV21710|
|src/runtime/items/draw-session-throttle.js:195|showSettingsV26|assignment|需要进一步测试|_v21710ShowSettings.call, setTimeout|
|src/runtime/items/draw-throttle-legacy.js:12|ensureDrawThrottleV2179|declaration|需要进一步测试|ensureItemState, Number.isFinite, Number, Math.max, Math.floor, ["lightning", "blooper"].forEach|
|src/runtime/items/draw-throttle-legacy.js:44|restrictedItemWeightsV2179|declaration|需要进一步测试|ranking, Math.max, r.findIndex, itemDropWeights, ensureDrawThrottleV2179, Number, STRONG_GROUP_ITEMS_V2179.forEach|
|src/runtime/items/draw-throttle-legacy.js:70|commitDrawThrottleV2179|declaration|需要进一步测试|Math.max, Number, STRONG_GROUP_ITEMS_V2179.has, GLOBAL_FIVE_DRAW_ITEMS_V2179.has|
|src/runtime/items/draw-throttle-legacy.js:94|pickItemForGroupV281|assignment|需要进一步测试|heldItemKeysV281, restrictedItemWeightsV2179, weightedPickNoRepeatV281, weightedPick, ITEM_KEYS.forEach, Number, Object.keys, commitDrawThrottleV2179|
|src/runtime/items/draw-throttle-legacy.js:152|installDrawCooldownInfoV2179|declaration|需要进一步测试|document.getElementById, ensureDrawThrottleV2179, document.createElement, host.appendChild|
|src/runtime/items/draw-throttle-legacy.js:171|installClearItemsSettingV2172|assignment|需要进一步测试|_v2179InstallClearItems.apply, installDrawCooldownInfoV2179|
|src/runtime/items/drop-midfield-weights.js:3|itemDropWeights|assignment|需要进一步测试|Math.max, Number, Math.min, itemRankBandV2172, Math.ceil, ITEM_DRAW_KEYS.forEach, put, itemExistsOnFieldV2172|
|src/runtime/items/drop-midfield-weights.js:14|put|binding|需要进一步测试|Math.max, Number|
|src/runtime/items/drop-uniqueness-and-reset.js:7|itemExistsOnFieldV2172|declaration|需要进一步测试|ensureItemState, Number, Date.now, state.groups.some, Array.isArray, g.inventory.some|
|src/runtime/items/drop-uniqueness-and-reset.js:25|itemRankBandV2172|declaration|需要进一步测试|Math.max, Number, Math.min, Math.ceil|
|src/runtime/items/drop-uniqueness-and-reset.js:43|itemDropWeights|assignment|需要进一步测试|itemRankBandV2172, Math.max, Number, ITEM_KEYS.forEach, put, itemExistsOnFieldV2172|
|src/runtime/items/drop-uniqueness-and-reset.js:46|put|binding|需要进一步测试|Math.max, Number|
|src/runtime/items/drop-uniqueness-and-reset.js:156|addItemToGroup|assignment|需要进一步测试|itemExistsOnFieldV2172, showToast, _v2172AddItemToGroup.call|
|src/runtime/items/drop-uniqueness-and-reset.js:171|clearAllItemsV2172|declaration|需要进一步测试|ensureItemState, state.groups.reduce, Array.isArray, state.groups.filter, Number, Date.now, showToast, themeConfirm, recordHistory, state.groups.forEach, clearInterval, applyBlooperMask, saveState, renderAll|
|src/runtime/items/drop-uniqueness-and-reset.js:229|installClearItemsSettingV2172|declaration|需要进一步测试|document.getElementById, document.createElement, pane.appendChild|
|src/runtime/items/drop-uniqueness-and-reset.js:250|rebuildSettingsV26|assignment|需要进一步测试|_v2172RebuildSettingsV26.apply, setTimeout|
|src/runtime/items/drop-uniqueness-and-reset.js:258|showSettingsV26|assignment|需要进一步测试|_v2172ShowSettingsV26.call, setTimeout|
|src/runtime/items/effect-palette-and-preview.js:15|roulettePreviewPickV282|declaration|需要进一步测试|Object.keys, Math.floor, Math.random|
|src/runtime/items/encyclopedia-and-icons.js:1|openItemEncyclopedia|declaration|需要进一步测试|openAbout, renderAbout|
|src/runtime/items/encyclopedia-and-icons.js:5|renderItemEncyclopedia|declaration|需要进一步测试|ensureV2State, document.getElementById, ITEM_KEYS.map(     (k) => {       const d = ITEM_DEFS[k];       return <div class="ency-card"><div class="ency-icon">${itemVisual(k)}</div><div><div class="ency-name">${d.name}</div><div class="ency-desc">${d.desc}</div></div><div class="ency-actions"><button class="btn btn-sm btn-primary" onclick="chooseItemIcon('${k}')">上传图片</button><button class="btn btn-sm" onclick="resetItemIcon('${k}')">恢复默认</button></div></div>;     },   ).join, ITEM_KEYS.map, itemVisual|
|src/runtime/items/encyclopedia-and-icons.js:16|chooseItemIcon|declaration|需要进一步测试|document.getElementById, document.getElementById("itemIconInput").click|
|src/runtime/items/encyclopedia-and-icons.js:21|handleItemIconUpload|declaration|需要进一步测试|ensureV2State, STORAGE.setJSON, saveState, renderItemEncyclopedia, renderAll, showToast, rd.readAsDataURL|
|src/runtime/items/encyclopedia-and-icons.js:25|rd.onload|assignment|需要进一步测试|ensureV2State, STORAGE.setJSON, saveState, renderItemEncyclopedia, renderAll, showToast|
|src/runtime/items/encyclopedia-and-icons.js:36|resetItemIcon|declaration|需要进一步测试|ensureV2State, STORAGE.setJSON, saveState, renderItemEncyclopedia, renderAll|
|src/runtime/items/encyclopedia-and-icons.js:44|resetAllItemIcons|declaration|需要进一步测试|ensureV2State, STORAGE.setJSON, saveState, renderItemEncyclopedia, renderAll|
|src/runtime/items/encyclopedia-and-icons.js:52|exportItemIconPack|declaration|需要进一步测试|ensureV2State, JSON.stringify, document.createElement, URL.createObjectURL, a.click, setTimeout, URL.revokeObjectURL|
|src/runtime/items/encyclopedia-and-icons.js:70|importItemIconPack|declaration|需要进一步测试|JSON.parse, ensureV2State, STORAGE.setJSON, saveState, renderItemEncyclopedia, renderAll, showToast, themeAlert, rd.readAsText|
|src/runtime/items/encyclopedia-and-icons.js:74|rd.onload|assignment|需要进一步测试|JSON.parse, ensureV2State, STORAGE.setJSON, saveState, renderItemEncyclopedia, renderAll, showToast, themeAlert|
|src/runtime/items/feature-switch.js:2|isCommunismMode|declaration|需要进一步测试|STORAGE.getJSON|
|src/runtime/items/feature-switch.js:5|setCommunismMode|declaration|需要进一步测试|STORAGE.setJSON, applyCommunismMode, showToast|
|src/runtime/items/feature-switch.js:10|applyCommunismMode|declaration|需要进一步测试|isCommunismMode, document.body.classList.toggle, document     .querySelectorAll('button,[role="button"],.dock-btn,.nav-btn')     .forEach, document     .querySelectorAll, (el.textContent ／／ "").trim, el.getAttribute, /道具抽取／抽取道具／道具百科／道具与图标/.test, /globalItemDraw／openItemEncyclopedia/.test, document.getElementById("itemWindow")?.classList.remove, document.getElementById, document.getElementById("itemBackdrop")?.classList.remove|
|src/runtime/items/feature-switch.js:44|openItemWindow|assignment|需要进一步测试|isCommunismMode, showToast, _v291OpenItemWindow.apply|
|src/runtime/items/feature-switch.js:54|installCommunismModeSetting|declaration|需要进一步测试|document.getElementById("communismModeSetting")?.remove, document.getElementById|
|src/runtime/items/feedback-and-icons.js:1|showItemUseFx|declaration|需要进一步测试||
|src/runtime/items/feedback-and-icons.js:2|itemFxTargetText|declaration|需要进一步测试|ranking, r.findIndex, names.includes, names.push, ["red", "triple_red"].includes, add, ["banana", "triple_banana"].includes, r.slice(0, Math.max(0, i)).forEach, r.slice, Math.max, r.slice(i + 1).forEach, [       "coin",       "mushroom",       "triple_mushroom",       "star",       "mega",       "bullet",       "power",     ].includes, names.join|
|src/runtime/items/feedback-and-icons.js:6|add|binding|需要进一步测试|names.includes, names.push|
|src/runtime/items/feedback-and-icons.js:33|closeItemWindowForFx|declaration|需要进一步测试|closeItemWindow|
|src/runtime/items/feedback-and-icons.js:43|normalizeItemIconFile|declaration|需要进一步测试|document.createElement, canvas.getContext, ctx.clearRect, Math.min, Math.max, ctx.drawImage, done, canvas.toDataURL, reader.readAsDataURL|
|src/runtime/items/feedback-and-icons.js:45|reader.onload|assignment|需要进一步测试|document.createElement, canvas.getContext, ctx.clearRect, Math.min, Math.max, ctx.drawImage, done, canvas.toDataURL|
|src/runtime/items/feedback-and-icons.js:47|img.onload|assignment|需要进一步测试|document.createElement, canvas.getContext, ctx.clearRect, Math.min, Math.max, ctx.drawImage, done, canvas.toDataURL|
|src/runtime/items/feedback-and-icons.js:68|img.onerror|assignment|需要进一步测试|done|
|src/runtime/items/feedback-and-icons.js:73|handleItemIconUpload|assignment|需要进一步测试|normalizeItemIconFile, ensureV2State, STORAGE.setJSON, saveState, renderItemEncyclopedia, renderAll, showToast|
|src/runtime/items/feedback-and-icons.js:88|updateCardRouletteVisual|declaration|需要进一步测试|o.querySelector, icon.classList.remove, itemVisual, icon.classList.add|
|src/runtime/items/feedback-and-icons.js:107|cancelHandItemDraw|assignment|需要进一步测试|clearTimeout, showToast|
|src/runtime/items/first-hand-pool.js:16|itemDropWeights|assignment|需要进一步测试|_v218ItemDropWeights.call, Math.max, Math.ceil, Number, ItemModules.drawWeights|
|src/runtime/items/first-hand-pool.js:29|pickItemForGroupV281|assignment|需要进一步测试|ItemDrawBlocks.pick|
|src/runtime/items/flower-charges-recovery.js:2|repairFlowerChargesV21719|declaration|需要进一步测试|state.groups.forEach, Array.isArray, g.inventory.forEach, keys.has, Number, Number.isInteger, Number.isFinite, Math.max, Math.min, Math.trunc, saveState, renderAll|
|src/runtime/items/group-encyclopedia.js:73|groupItemDescV2182|declaration|需要进一步测试||
|src/runtime/items/group-encyclopedia.js:85|syncGodItemPickerV2182|declaration|需要进一步测试|[...document.querySelectorAll("*")].filter, document.querySelectorAll, /上帝模式\s*·\s*强制追加到队尾/.test, roots     .sort(       (a, b) =>         a.querySelectorAll("button").length -         b.querySelectorAll("button").length,     )     .find, roots     .sort, a.querySelectorAll, b.querySelectorAll, el.querySelectorAll, root.querySelectorAll, buttons.forEach, btn.getAttribute, oc.match, byKey.set, byKey.values, GROUP_ITEM_ORDER_V2182.forEach, byKey.get, groupItemDescV2182, parent.appendChild|
|src/runtime/items/group-encyclopedia.js:122|syncOwnedItemCardsV2182|declaration|需要进一步测试|state.groups.find, document     .querySelectorAll("#itemWindowBody .queue-item-card")     .forEach, document     .querySelectorAll, card.querySelector, groupItemDescV2182|
|src/runtime/items/group-encyclopedia.js:134|syncGroupItemInfoV2182|declaration|需要进一步测试|syncGodItemPickerV2182, syncOwnedItemCardsV2182|
|src/runtime/items/group-encyclopedia.js:141|renderItemWindow|assignment|需要进一步测试|_v2182RenderItemWindow.apply, requestAnimationFrame|
|src/runtime/items/group-encyclopedia.js:150|adminAddItem|assignment|需要进一步测试|_v2182AdminAddItem.apply, setTimeout|
|src/runtime/items/group-window.js:1|openItemWindow|declaration|需要进一步测试|globalThis.HandItemCinematic?.take, ensureItemState, showClassroomWindow, document.getElementById, renderItemWindow|
|src/runtime/items/group-window.js:9|closeItemWindow|declaration|需要进一步测试|globalThis.HandItemCinematic?.take, hideClassroomWindow, document.getElementById|
|src/runtime/items/group-window.js:14|switchItemTab|declaration|需要进一步测试|renderItemWindow|
|src/runtime/items/group-window.js:18|renderItemWindow|declaration|需要进一步测试|state.groups.find, closeItemWindow, ensureGroupNumbersV213, document.getElementById, document     .querySelectorAll("[data-item-tab]")     .forEach, document     .querySelectorAll, b.classList.toggle, Math.round, CompetitionEffects.labels, statusParts.push, String, Number, statusParts.join, escapeHtml, DEFAULT_COLORS.map((color, idx) => <button type="button" class="group-color-swatch ${String(g.color).toUpperCase() === color.toUpperCase() ? "selected" : ""}" style="--swatch:${color}" title="预设 ${idx + 1} · ${color}" ${disabled} onclick="selectGroupPresetColorV21716(${g.id},'${color}')"><span>${String(g.color).toUpperCase() === color.toUpperCase() ? "✓" : ""}</span></button>).join, DEFAULT_COLORS.map, String(g.color).toUpperCase, color.toUpperCase, g.color.toUpperCase, (g.members ／／ []).join, eligibleForItems, [       0, 1, 2,     ]       .map((i) => {         const it = g.inventory[i];         if (!it)           return '<div class="item-big empty"><div class="item-big-icon">＋</div><div class="item-big-name">空道具槽</div></div>';         const d = ITEM_DEFS[it.key];         return <div class="item-big"><div class="item-big-icon">${itemVisual(it.key)}</div><div class="item-big-name">${escapeHtml(d.name)}${it.charges > 1 ? " ×" + it.charges : ""}</div><div class="item-big-desc">${escapeHtml(d.desc)}</div><button class="btn btn-primary item-use" onclick="useItem(${g.id},${i})" ${canUse ? "" : "disabled"}>立即使用</button></div>;       })       .join, [       0, 1, 2,     ]       .map, itemVisual, ClassroomFeedback.slotMarkup|
|src/runtime/items/group-window.js:142|previewItemDetailColor|declaration|需要进一步测试|document.getElementById|
|src/runtime/items/group-window.js:146|saveItemDetailColor|declaration|需要进一步测试|renderItemWindow, /^#[0-9a-f]{6}$/i.test, updateGroupColor|
|src/runtime/items/group-window.js:157|saveItemGroupDetail|declaration|需要进一步测试|openPwdModal, state.groups.find, document.getElementById("groupDetailName")?.value.trim, document.getElementById, document.getElementById("groupDetailNumber")?.value.trim, showToast, /^\d+$/.test, Number, state.groups.some, Array.from, rawMembers         .split(/[\n,，、]+/)         .map((s) => s.trim())         .filter, rawMembers         .split(/[\n,，、]+/)         .map, rawMembers         .split, s.trim, JSON.stringify, recordHistory, saveState, renderAll, updatePickerPoolUI, renderItemWindow|
|src/runtime/items/group-window.js:205|deleteItemDetailGroup|declaration|需要进一步测试|openPwdModal, deleteGroup, state.groups.some, closeItemWindow, document.getElementById("itemWindow")?.classList.contains, document.getElementById, renderItemWindow|
|src/runtime/items/group-window.js:219|itemQuickScore|declaration|需要进一步测试|openPwdModal, applyScoreDelta, renderItemWindow|
|src/runtime/items/group-window.js:227|itemCustomScore|declaration|需要进一步测试|Number, document.getElementById, Number.isFinite, itemQuickScore, Math.round|
|src/runtime/items/group-window.js:233|enhanceItemCards|declaration|需要进一步测试|ensureItemState, state.groups.forEach, document.querySelector, c.classList.remove, g.inventory.find, c.classList.add, CompetitionEffects.has, c.querySelector, document.createElement, [0, 1, 2]         .map((i) => {           const it = g.inventory[i];           return it             ? <div class="item-slot" title="${ITEM_DEFS[it.key].name}">${itemVisual(it.key)}${it.charges > 1 ? <span class="charges">${it.charges}</span> : ""}</div>             : '<div class="item-slot empty">＋</div>';         })         .join, [0, 1, 2]         .map, itemVisual, head.parentNode.insertBefore, mb.classList.remove, ev.preventDefault, ev.stopPropagation, openItemWindow, applyBlooperMask|
|src/runtime/items/group-window.js:276|mb.onclick|assignment|需要进一步测试|ev.preventDefault, ev.stopPropagation, openItemWindow|
|src/runtime/items/group-window.js:290|groupAvatarStatusV2200|declaration|需要进一步测试|document.getElementById|
|src/runtime/items/group-window.js:296|pickGroupAvatarV2200|declaration|需要进一步测试|state.groups.find, groupAvatarStatusV2200, /^image\/(png／jpeg／webp)$/.test, String, normalizeGroupAvatarV2200, runClassroomCommand, renderAll, renderItemWindow, document.getElementById, reader.readAsDataURL|
|src/runtime/items/group-window.js:318|reader.onerror|assignment|需要进一步测试|groupAvatarStatusV2200|
|src/runtime/items/group-window.js:322|reader.onload|assignment|需要进一步测试|String, normalizeGroupAvatarV2200, groupAvatarStatusV2200, runClassroomCommand, state.groups.find, renderAll, renderItemWindow, document.getElementById|
|src/runtime/items/group-window.js:349|clearGroupAvatarV2200|declaration|需要进一步测试|state.groups.find, groupAvatarStatusV2200, runClassroomCommand, renderAll, renderItemWindow, document.getElementById|
|src/runtime/items/hand-reward-lifecycle.js:7|cancelHandItemDraw|declaration|需要进一步测试|clearInterval, clearTimeout, showToast|
|src/runtime/items/hand-reward-lifecycle.js:24|closeHandRaise|assignment|需要进一步测试|cancelHandItemDraw, _v21CloseHandRaise|
|src/runtime/items/hand-reward-lifecycle.js:30|selectHandGroup|assignment|需要进一步测试|showToast, _v21SelectHandGroup|
|src/runtime/items/hand-reward-lifecycle.js:39|judgeHandRaise|assignment|需要进一步测试|cancelHandItemDraw, _v21JudgeHandRaise, state.groups.find, [...document.querySelectorAll("#handRewardBox button")].find, document.querySelectorAll, b.textContent.includes, eligibleForItems|
|src/runtime/items/hand-reward-lifecycle.js:58|drawHandRewardForPort|declaration|需要进一步测试|eligibleForItems, Array.isArray, beginDrawSessionV21710, pickItemForGroupV281, addItemToGroup, context.emit|
|src/runtime/items/hand-reward-lifecycle.js:89|finishHandItemReward|declaration|需要进一步测试|document.getElementById|
|src/runtime/items/hand-reward-lifecycle.js:99|handUseNewItem|declaration|需要进一步测试|state.groups.find, showToast, g.inventory.map((x) => x.key).lastIndexOf, g.inventory.map, closeHandRaise, openItemWindow, globalThis.HandItemCinematic?.mark, setTimeout, document.querySelectorAll, cards[idx].scrollIntoView|
|src/runtime/items/inventory-recovery.js:6|pickItemForGroupV281|assignment|需要进一步测试|heldItemKeysV281, sessionRestrictedWeightsV21710, weightedPickNoRepeatV281, commitSessionDrawV21710|
|src/runtime/items/inventory-recovery.js:27|repairDuplicateInventoryV21718|declaration|需要进一步测试|state.groups.forEach, JSON.stringify, normalizeInventoryV21718, saveState, renderAll|
|src/runtime/items/lightning-and-hit-legacy.js:1|attackHitClassV2116|declaration|需要进一步测试|["green", "triple_green"].includes, ["red", "triple_red"].includes, ["banana", "triple_banana"].includes|
|src/runtime/items/lightning-and-hit-legacy.js:16|clearAttackHitFxV2116|declaration|需要进一步测试|[...card.classList]     .filter((x) => x.startsWith("hit-"))     .forEach, [...card.classList]     .filter, x.startsWith, card.classList.remove, card.style.removeProperty|
|src/runtime/items/lightning-and-hit-legacy.js:26|playAttackTargetFxV2116|declaration|需要进一步测试|DesktopUI.visualEvent, DesktopUI.getPreferences, battleCard, clearAttackHitFxV2116, attackHitClassV2116, card.classList.add, card.style.setProperty, document.createElement, itemVisual, card.appendChild, setTimeout, card.classList.remove, badge.remove, card.style.removeProperty|
|src/runtime/items/lightning-and-hit-legacy.js:67|tryDefendLightningV2116|declaration|需要进一步测试|Number, Math.max, tinyDefenseToast, setTimeout, playAttackTargetFxV2116, ["star", "mega"].includes|
|src/runtime/items/lightning-and-hit-legacy.js:89|applyLightningHitV2116|declaration|需要进一步测试|eligibleForItems, tryDefendLightningV2116, Number, ItemModules.scoreDelta, roundHalf, setTimeout, playAttackTargetFxV2116|
|src/runtime/items/lightning-and-hit-legacy.js:117|showItemUseFx|assignment|需要进一步测试|setTimeout, playCasterCardFx, _v2116ShowItemUseFx.call|
|src/runtime/items/persistent-state-repair.js:1|repairPersistentItemsV28|declaration|需要进一步测试|ensureItemState, state.groups.forEach, normalizeInventoryV21718, saveState|
|src/runtime/items/queue-adapters.js:1|isQueuePersistentActiveV2120|declaration|需要进一步测试|["star", "mega", "power"].includes|
|src/runtime/items/queue-adapters.js:10|queueRoleTextV2120|declaration|需要进一步测试||
|src/runtime/items/queue-adapters.js:14|queueUseStateV2120|declaration|需要进一步测试|isQueuePersistentActiveV2120, eligibleForItems, Reliability.validateItem, isCommunismMode, CompetitionEffects.has|
|src/runtime/items/queue-adapters.js:32|godAddQueueItemV2120|declaration|需要进一步测试|state.groups.find, showToast, eligibleForItems, recordHistory, addItemToGroup, saveState, renderAll, renderItemWindow|
|src/runtime/items/queue-adapters.js:52|godClearQueueItemsV2120|declaration|需要进一步测试|state.groups.find, recordHistory, saveState, renderAll, renderItemWindow|
|src/runtime/items/queue-adapters.js:67|godAddItem|assignment|需要进一步测试|godAddQueueItemV2120|
|src/runtime/items/queue-adapters.js:69|godAddItemV283|assignment|需要进一步测试|godAddQueueItemV2120|
|src/runtime/items/queue-adapters.js:71|godClearItems|assignment|需要进一步测试|godClearQueueItemsV2120|
|src/runtime/items/queue-adapters.js:75|renderItemWindow|assignment|需要进一步测试|_v2120RenderItemWindow, state.groups.find, document.getElementById, [0, 1, 2]     .map((i) => {       const it = g.inventory[i];       const role = queueRoleTextV2120(i);       if (!it) {         return <div class="item-big queue-item-card ${i === 0 ? "queue-main-card" : "queue-secondary-card"} empty">         <div class="queue-role-badge">${role}</div>         <div class="item-big-icon">＋</div>         <div class="item-big-name">空道具栏</div>         <div class="item-big-desc">${i === 0 ? "新获得的第一个道具会进入这里" : "主要道具释放后，次要道具会按顺序自动晋升"}</div>       </div>;       }       const d = ITEM_DEFS[it.key];       const st = queueUseStateV2120(g, i);       const active = isQueuePersistentActiveV2120(g, it);       return <div class="item-big queue-item-card ${i === 0 ? "queue-main-card" : "queue-secondary-card"} ${active ? "queue-persistent-active" : ""}">       <div class="queue-role-badge">${role}${active ? " · 卡手中" : ""}</div>       <div class="item-big-icon">${itemVisual(it.key)}</div>       <div class="item-big-name">${escapeHtml(d.name)}${it.charges > 1 ? " ×" + it.charges : ""}</div>       <div class="item-big-desc">${escapeHtml(d.desc)}</div>       ${         i === 0           ? <button class="btn btn-primary item-use queue-main-use" onclick="useItem(${g.id},0)" ${st.usable ? "" : "disabled"}>${st.label}</button>           : <button class="btn item-use queue-secondary-lock" disabled>${st.label}</button>       }     </div>;     })     .join, [0, 1, 2]     .map, queueRoleTextV2120, queueUseStateV2120, isQueuePersistentActiveV2120, itemVisual, escapeHtml, document.createElement, Object.keys(ITEM_DEFS)           .map(             (k) =>               <button class="btn btn-sm" onclick="godAddQueueItemV2120(${g.id},'${k}')">${itemVisual(k)} ${escapeHtml(ITEM_DEFS[k].name)}</button>,           )           .join, Object.keys(ITEM_DEFS)           .map, Object.keys, body.appendChild|
|src/runtime/items/queue-adapters.js:137|enhanceItemCards|assignment|需要进一步测试|_v2120EnhanceItemCards, state.groups.forEach, document.querySelector, card.classList.remove, card.classList.add, card.querySelectorAll, [0, 1, 2].forEach, isQueuePersistentActiveV2120, slot.classList.add, queueRoleTextV2120, itemVisual, queueMainVisualCacheV2120.get, slots[0].classList.add, setTimeout, slots[0]?.classList.remove, queueMainVisualCacheV2120.set|
|src/runtime/items/queue-adapters.js:185|handUseNewItem|assignment|需要进一步测试|state.groups.find, showToast, closeHandRaise, openItemWindow, globalThis.HandItemCinematic?.mark|
|src/runtime/items/ranking-and-drop-legacy.js:1|ranking|declaration|需要进一步测试|RankingRules.ordered|
|src/runtime/items/ranking-and-drop-legacy.js:4|rankIndex|declaration|需要进一步测试|ranking().findIndex, ranking|
|src/runtime/items/ranking-and-drop-legacy.js:7|roundQuarter|declaration|需要进一步测试|Math.round, Number|
|src/runtime/items/ranking-and-drop-legacy.js:10|roundThird|declaration|需要进一步测试|Math.round, Number|
|src/runtime/items/ranking-and-drop-legacy.js:13|roundHalf|declaration|需要进一步测试|Math.round, Number|
|src/runtime/items/ranking-and-drop-legacy.js:16|eligibleForItems|declaration|需要进一步测试|Number|
|src/runtime/items/ranking-and-drop-legacy.js:19|consumeInventoryItem|declaration|需要进一步测试|g.inventory.splice|
|src/runtime/items/ranking-and-drop-legacy.js:25|addItemToGroup|declaration|需要进一步测试|eligibleForItems, g.inventory.push, ItemModules.inventory, Date.now, Math.random|
|src/runtime/items/ranking-and-drop-legacy.js:41|tinyDefenseToast|declaration|需要进一步测试|document.createElement, document.body.appendChild, setTimeout, d.remove|
|src/runtime/items/ranking-and-drop-legacy.js:49|defenseCandidates|declaration|需要进一步测试|["star", "mega", "bullet"].includes, out.push, ITEM_DEFENSE_KEYS.has, ["green", "triple_green", "horn"].includes, out.sort|
|src/runtime/items/ranking-and-drop-legacy.js:83|damageFraction|declaration|需要进一步测试|roundHalf, roundThird, roundQuarter, applyItemScore|
|src/runtime/items/ranking-and-drop-legacy.js:92|boostFraction|declaration|需要进一步测试|eligibleForItems, roundQuarter, Math.round, ItemModules.scoreDelta|
|src/runtime/items/ranking-and-drop-legacy.js:104|itemDropWeights|declaration|需要进一步测试|put|
|src/runtime/items/ranking-and-drop-legacy.js:111|put|binding|需要进一步测试||
|src/runtime/items/ranking-and-drop-legacy.js:196|weightedPick|declaration|需要进一步测试|Object.entries(weights).filter, Object.entries, arr.reduce, Math.random|
|src/runtime/items/ranking-and-drop-legacy.js:206|drawItemForGroup|declaration|需要进一步测试|eligibleForItems, ranking, r.findIndex, itemDropWeights, Object.values(weights).some, Object.values, weightedPick|
|src/runtime/items/round-use-lock.js:9|resetRoundItemUseLocksV2177|declaration|需要进一步测试|state.groups.forEach|
|src/runtime/items/round-use-lock.js:15|refreshAllInMusicAfterItemUseV2177|declaration|需要进一步测试|checkAllInRatio, bgmTransitionThinkingToBattle, bgmTransitionBattleToThinking|
|src/runtime/items/round-use-lock.js:28|markItemUsedThisRoundV2177|declaration|需要进一步测试|state.groups.find, refreshAllInMusicAfterItemUseV2177, showToast, saveState, renderGrid, renderDashboard, renderItemWindow|
|src/runtime/items/round-use-lock.js:58|showItemUseFx|assignment|需要进一步测试|_v2177ShowItemUseFx.call|
|src/runtime/items/round-use-lock.js:72|queueUseStateV2120|assignment|需要进一步测试|_v2177QueueUseState.call|
|src/runtime/items/spiny-cooldown.js:7|ensureSpinyCooldownV21717|declaration|需要进一步测试|ensureDrawSessionThrottleV21710, Number.isFinite, Number, Math.max, Math.floor|
|src/runtime/items/spiny-cooldown.js:21|sessionRestrictedWeightsV21710|assignment|需要进一步测试|_v21717SessionRestrictedWeights.call, ensureSpinyCooldownV21717, Math.max, Number|
|src/runtime/items/spiny-cooldown.js:36|commitSessionDrawV21710|assignment|需要进一步测试|_v21717CommitSessionDraw.call, ensureSpinyCooldownV21717|
|src/runtime/items/spiny-cooldown.js:48|refreshDrawCooldownInfoV21710|assignment|需要进一步测试|_v21717RefreshCooldownInfo.call, document.getElementById, ensureSpinyCooldownV21717, Number, document.createElement, host.appendChild|
|src/runtime/items/status-normalization.js:2|normalizeItemEffectForStatusV21731|declaration|需要进一步测试|Number, Object.keys|
|src/runtime/items/status-normalization.js:25|repairAllItemEffectsV21731|declaration|需要进一步测试|state.groups.forEach, JSON.stringify, normalizeItemEffectForStatusV21731, saveState|
|src/runtime/items/status-normalization.js:41|ensureItemState|assignment|需要进一步测试|_v21731EnsureItemState.apply, repairAllItemEffectsV21731|
|src/runtime/items/triple-defense-helpers.js:7|consumeOneV218|declaration|需要进一步测试|Math.max, Number, g.inventory.splice|
|src/runtime/items/triple-defense-helpers.js:13|attackOneFifthV218|declaration|需要进一步测试|Math.round, Math.max, Number, applyItemScore|
|src/runtime/items/triple-defense-helpers.js:18|finishOwnItemUseV218|declaration|需要进一步测试|Number, recordHistory, saveState, renderAll, showItemUseFx, showToast|
|src/runtime/items/triple-defense-helpers.js:32|queueUseStateV2120|assignment|需要进一步测试|ItemModules.canUse, TRIPLE_KEYS_V218.has, _v218QueueState.call|
|src/runtime/items/weighted-selection.js:1|heldItemKeysV281|declaration|需要进一步测试|(g?.inventory ／／ []).map((it) => it?.key).filter, (g?.inventory ／／ []).map|
|src/runtime/items/weighted-selection.js:4|weightedPickNoRepeatV281|declaration|需要进一步测试|Object.entries(weights ／／ {}).forEach, Object.entries, Number, blocked.has, Object.keys, weightedPick|
|src/runtime/items/weighted-selection.js:13|pickItemForGroupV281|declaration|需要进一步测试|ranking, Math.max, r.findIndex, itemDropWeights, heldItemKeysV281, weightedPickNoRepeatV281, weightedPick|
|src/runtime/items/weighted-selection.js:74|v282RandomOther|declaration|需要进一步测试|state.groups.filter, Number, Math.floor, Math.random|
|src/runtime/items/weighted-selection.js:80|v282TakeFraction|declaration|需要进一步测试|Number, Math.round, Math.max, applyItemAttack|
|src/runtime/items/weighted-selection.js:91|v282Consume|declaration|需要进一步测试|Math.max, Number, g.inventory.splice|
|src/runtime/picker/classroom-tools.js:4|ensureV2State|declaration|需要进一步测试|ensureItemState, STORAGE.getJSON|
|src/runtime/picker/classroom-tools.js:45|itemVisual|declaration|需要进一步测试|ensureV2State, Reliability.safeImage, escapeHtml|
|src/runtime/picker/classroom-tools.js:56|itemIconDataUrl|declaration|需要进一步测试|ensureV2State, Reliability.safeImage|
|src/runtime/picker/classroom-tools.js:61|itemBoxVisualV2121|declaration|需要进一步测试||
|src/runtime/picker/classroom-tools.js:66|setPickerInfoTab|declaration|需要进一步测试|document     .getElementById("pickerStatsBtn")     ?.classList.toggle, document     .getElementById, document     .getElementById("pickerHistoryBtn")     ?.classList.toggle, renderPickerInfo|
|src/runtime/picker/classroom-tools.js:76|renderPickerInfo|declaration|需要进一步测试|ensureV2State, document.getElementById, state.groups.reduce, arr           .slice(-30)           .reverse()           .map(             (x) =>               <div class="picker-log">${escapeHtml(x.text)}<br><small>${new Date(x.time).toLocaleTimeString()}</small></div>,           )           .join, arr           .slice(-30)           .reverse()           .map, arr           .slice(-30)           .reverse, arr           .slice, escapeHtml, new Date(x.time).toLocaleTimeString|
|src/runtime/picker/classroom-tools.js:101|openPickerModal|assignment|需要进一步测试|ensureV2State, _v2OpenPicker, setPickerInfoTab, syncPickerScoreTarget|
|src/runtime/picker/classroom-tools.js:108|syncPickerScoreTarget|declaration|需要进一步测试|document.getElementById, escapeHtml|
|src/runtime/picker/classroom-tools.js:119|pickerTargetGroup|declaration|需要进一步测试||
|src/runtime/picker/classroom-tools.js:124|scorePickerTarget|declaration|需要进一步测试|pickerTargetGroup, showToast, applyScoreDelta, syncPickerScoreTarget|
|src/runtime/picker/classroom-tools.js:133|scorePickerCustom|declaration|需要进一步测试|Math.round, Number, document.getElementById, Number.isFinite, scorePickerTarget|
|src/runtime/picker/classroom-tools.js:142|openHandRaise|declaration|需要进一步测试|ensureV2State, showClassroomWindow, document.getElementById, renderHandRaise, globalThis.ClassroomHandSync?.notify|
|src/runtime/picker/classroom-tools.js:151|closeHandRaise|declaration|需要进一步测试|hideClassroomWindow, document.getElementById|
|src/runtime/picker/classroom-tools.js:154|renderHandRaise|declaration|需要进一步测试|document.getElementById, state.groups     .map(       (g) =>         <button class="hand-group ${g.id === handRaiseGroupId ? "selected" : ""}" onclick="selectHandGroup(${g.id})">${escapeHtml(g.name)}<br><small>${g.score} 分</small></button>,     )     .join, state.groups     .map, escapeHtml|
|src/runtime/picker/classroom-tools.js:165|selectHandGroup|declaration|需要进一步测试|renderHandRaise, document     .querySelectorAll(".hand-group")     .forEach, document     .querySelectorAll, b.classList.remove, document.querySelectorAll, state.groups.findIndex, arr[idx].classList.add, globalThis.ClassroomHandSync?.notify|
|src/runtime/picker/classroom-tools.js:176|judgeHandRaise|declaration|需要进一步测试|ensureV2State, state.groups.find, showToast, recordHistory, state.itemGlobal.handRaiseHistory.push, Date.now, saveState, renderAll, globalThis.ClassroomHandSync?.notify, document.getElementById, ClassroomFeedback.slotMarkup|
|src/runtime/picker/classroom-tools.js:209|handQuickScore|declaration|需要进一步测试|applyScoreDelta|
|src/runtime/picker/classroom-tools.js:213|handUseItem|declaration|需要进一步测试|state.groups.find, showToast, closeHandRaise, openItemWindow, globalThis.HandItemCinematic?.mark|
|src/runtime/picker/selection-engine.js:1|openPickerModal|declaration|需要进一步测试|window.godpowerDesktop.openPicker, document.getElementById("pickerModal").toggleAttribute, document.getElementById, window.GodpowerPicker?.setExternalPresentation, document.getElementById("pickerModal").classList.contains, DesktopUI.cancelPickerPreparation, showClassroomWindow, updatePickerView, updatePickerPoolUI, resetSlotDisplay|
|src/runtime/picker/selection-engine.js:23|closePickerModal|declaration|需要进一步测试|stopSlotSpin, DesktopUI.cancelPickerPreparation, window.GodpowerPicker?.notify, window.GodpowerPicker?.setExternalPresentation, document.getElementById, modal?.removeAttribute, hideClassroomWindow, document.getElementById("slotResultPanel").classList.remove|
|src/runtime/picker/selection-engine.js:34|setPickerMode|declaration|需要进一步测试|window.GodpowerPicker?.isSettling, DesktopUI.cancelPickerPreparation, ["btnModeInd", "btnModeGrp", "btnModeTwo"].forEach, document.getElementById(id).classList.remove, document.getElementById, document.getElementById("btnModeInd").classList.add, document.getElementById("btnModeGrp").classList.add, document.getElementById("btnModeTwo").classList.add, updatePickerView, updatePickerPoolUI, resetSlotDisplay|
|src/runtime/picker/selection-engine.js:52|updatePickerView|declaration|需要进一步测试|document.getElementById, renderTwoTierChips|
|src/runtime/picker/selection-engine.js:74|renderTwoTierChips|declaration|需要进一步测试|document.getElementById, Array.isArray, state.groups.filter, groups       .map((g) => {         const on = pre.includes(g.id);         const style = on           ? "border-color:" +             g.color +             "; color:#fff; background:" +             g.color +             ";"           : "";         return (           '<button type="button" class="two-tier-chip ' +           (on ? "active" : "") +           '" style="' +           style +           '" onclick="toggleGroupPreselect(' +           g.id +           ')">' +           escapeHtml(g.name) +           '<span style="opacity:.75; font-size:11px; margin-left:4px;">' +           g.members.length +           "人</span></button>"         );       })       .join, groups       .map, pre.includes, escapeHtml|
|src/runtime/picker/selection-engine.js:112|toggleGroupPreselect|declaration|需要进一步测试|Array.isArray, state.picker.preselectedGroupIds.slice, pre.indexOf, pre.splice, pre.push, saveState, renderTwoTierChips, updatePickerPoolUI, resetSlotDisplay|
|src/runtime/picker/selection-engine.js:127|resetSlotDisplay|declaration|需要进一步测试|window.GodpowerPicker?.notify, document.getElementById, document.getElementById("slotResultPanel").classList.remove|
|src/runtime/picker/selection-engine.js:139|toggleAntiRepeat|declaration|需要进一步测试|saveState, updatePickerPoolUI|
|src/runtime/picker/selection-engine.js:145|resetPickerPool|declaration|需要进一步测试|saveState, updatePickerPoolUI, showToast|
|src/runtime/picker/selection-engine.js:153|getAvailablePool|declaration|需要进一步测试|grps.filter, state.picker.pickedGroupIds.includes, state.groups.filter, Array.isArray, pre.includes, grps.forEach, (g.members ／／ []).forEach, students.push, students.filter, state.picker.pickedStudentKeys.includes, state.groups.forEach|
|src/runtime/picker/selection-engine.js:231|updatePickerPoolUI|declaration|需要进一步测试|getAvailablePool, document.getElementById|
|src/runtime/picker/selection-engine.js:242|toggleSlotSpin|declaration|需要进一步测试|startSlotSpin, stopSlotSpin|
|src/runtime/picker/selection-engine.js:247|startSlotSpin|declaration|需要进一步测试|DesktopUI.getPickerGeneration, getAvailablePool, themeAlert, window.ClassroomAvatarDisplay?.prepare, getAudioContext, DesktopUI.isPickerCurrent, startRollLoop, document.getElementById("slotResultPanel").classList.remove, document.getElementById, Math.floor, Math.random, state.groups.forEach, (g.members ／／ []).forEach, allStudents.push, allGroups.push, Array.isArray, state.groups.filter, allGroups.filter, pre.includes, allStudents.filter, grpWithMembers.some, setInterval, window.ClassroomAvatarDisplay?.renderRaffleReel, ClassroomFeedback.startLive, window.GodpowerPicker?.notify|
|src/runtime/picker/selection-engine.js:337|stopSlotSpin|declaration|需要进一步测试|clearInterval, document.getElementById, stopRollLoop, playSound, window.ClassroomAvatarDisplay?.renderRaffleReel, state.picker.pickedGroupIds.push, studentLabelHTMLV218, escapeHtml, state.picker.pickedStudentKeys.push, ensureV2State, state.itemGlobal.pickerHistory.push, Date.now, state.itemGlobal.pickerHistory.shift, saveState, syncPickerScoreTarget, renderPickerInfo, updatePickerPoolUI, window.GodpowerPicker?.notify, document.getElementById("slotResultPanel").classList.add, DesktopUI.pickerStopped|
|src/runtime/picker/selection-engine.js:410|rewardPickedStudent|declaration|需要进一步测试|cancelScoreAnimationAndSync, state.groups.find, recordHistory, saveState, animateScores, playSound, showToast, document.getElementById("slotResultPanel").classList.remove, document.getElementById|
|src/runtime/storage/classroom-save.js:1|getPersistableGroups|declaration|需要进一步测试|state.groups.map, Number.isFinite, Number, Math.trunc|
|src/runtime/storage/classroom-save.js:11|saveState|declaration|需要进一步测试|showClassroomSaveWarning, classroomCommands.isPending, ensureV2State, Array.isArray, AchievementLedger.apply, buildClassroomBackup, globalThis.ClassroomSaveFile?.isHydrating, Reliability.writeVerified, document.getElementById, mirrors     .filter(([k, v]) => !STORAGE.setJSON(k, v))     .map, mirrors     .filter, STORAGE.setJSON, Object.entries, STORAGE.set, failed.push, showToast, globalThis.ClassroomSaveFile?.write|
|src/runtime/storage/classroom-transfer.js:1|exportData|declaration|需要进一步测试|JSON.stringify, buildClassroomBackup, URL.createObjectURL, document.createElement, a.click, setTimeout, URL.revokeObjectURL|
|src/runtime/storage/classroom-transfer.js:13|triggerImport|declaration|需要进一步测试|openPwdModal, document.getElementById("importFileInput").click, document.getElementById|
|src/runtime/storage/classroom-transfer.js:21|handleFileImport|declaration|需要进一步测试|themeAlert, importClassroomData, JSON.parse, showToast, reader.readAsText|
|src/runtime/storage/classroom-transfer.js:30|reader.onload|assignment|需要进一步测试|importClassroomData, JSON.parse, showToast, themeAlert|
|src/runtime/storage/classroom-transfer.js:40|reader.onerror|assignment|需要进一步测试|themeAlert|
|src/runtime/ui/admin-lock.js:1|toggleLock|declaration|需要进一步测试|openPwdModal, showToast, renderAll|
|src/runtime/ui/admin-lock.js:10|openPwdModal|declaration|需要进一步测试|document.getElementById, showClassroomWindow, setTimeout, document.getElementById("pwdInput").focus|
|src/runtime/ui/admin-lock.js:16|closePwdModal|declaration|需要进一步测试|hideClassroomWindow, document.getElementById|
|src/runtime/ui/admin-lock.js:20|handlePwdKey|declaration|需要进一步测试|event.preventDefault, submitPassword, closePwdModal|
|src/runtime/ui/admin-lock.js:27|submitPassword|declaration|需要进一步测试|document.getElementById("pwdInput").value.trim, document.getElementById, closePwdModal, showToast, renderAll, themeAlert, input.focus|
|src/runtime/ui/admin-lock.js:42|updateAdminPin|declaration|需要进一步测试|document.getElementById("newPwdInput").value.trim, document.getElementById, themeAlert, saveState, showToast|
|src/runtime/ui/attack-reorder-scheduling.js:26|applyLightningHitV2116|assignment|需要进一步测试|eligibleForItems, _v21713ApplyLightningHit.call|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:2|applyModernFlatV217|declaration|需要进一步测试|document.body.classList.add|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:6|rankOfGroupV214|declaration|需要进一步测试|ranking, r.findIndex|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:18|renderHandRaise|assignment|需要进一步测试|document.getElementById, state.groups     .map(       (g) =>         <button type="button" class="hand-group two-tier-chip ${g.id === handRaiseGroupId ? "selected" : ""}" data-group-id="${g.id}" aria-pressed="${g.id === handRaiseGroupId ? "true" : "false"}" style="--hand-color:${g.color};--hand-contrast:${readableTextOnColor(g.color)}" onclick="selectHandGroup(${g.id})"><span class="hand-group-name">${escapeHtml(g.name)}</span><small>${g.score} 分</small></button>,     )     .join, state.groups     .map, readableTextOnColor, escapeHtml|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:30|updateHandScoreV214|declaration|需要进一步测试|state.groups.find, document.querySelector|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:38|handQuickScore|assignment|需要进一步测试|applyScoreDelta, updateHandScoreV214, setTimeout|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:46|renderHandRewardControlsV214|declaration|需要进一步测试|document.getElementById, state.groups.find, eligibleForItems, escapeHtml|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:59|judgeHandRaise|assignment|需要进一步测试|_v214JudgeHandRaise.call, renderHandRewardControlsV214|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:63|handUsePrimaryV214|declaration|需要进一步测试|state.groups.find, showToast, closeHandRaise, globalThis.HandItemCinematic?.mark, setTimeout, useItem|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:80|finishHandItemReward|assignment|需要进一步测试|closeHandRaise|
|src/runtime/ui/battle-layout-controls.js:1|applyZoom|declaration|需要进一步测试|Math.max, Math.min, DesktopUI.syncViewport, STORAGE.set, showToast, Math.round|
|src/runtime/ui/battle-layout-controls.js:9|zoomIn|declaration|需要进一步测试|applyZoom, Math.round|
|src/runtime/ui/battle-layout-controls.js:13|zoomOut|declaration|需要进一步测试|applyZoom, Math.round|
|src/runtime/ui/battle-layout-controls.js:17|zoomReset|declaration|需要进一步测试|applyZoom|
|src/runtime/ui/battle-layout-controls.js:21|toggleResizerEnabled|declaration|需要进一步测试|saveState, updateResizerUI|
|src/runtime/ui/battle-layout-controls.js:27|toggleSaveAllIn|declaration|需要进一步测试|saveState|
|src/runtime/ui/battle-layout-controls.js:32|updateColumnMode|declaration|需要进一步测试|saveState, renderGrid|
|src/runtime/ui/battle-layout-controls.js:38|updateResizerUI|declaration|需要进一步测试|document.getElementById|
|src/runtime/ui/battle-layout-controls.js:45|initResizerDrag|declaration|需要进一步测试|document.getElementById, handle.setPointerCapture, e.preventDefault, handle.hasPointerCapture, Math.max, Math.min, handle.releasePointerCapture, saveState, showToast|
|src/runtime/ui/battle-layout-controls.js:53|handle.onpointerdown|assignment|需要进一步测试|handle.setPointerCapture, e.preventDefault|
|src/runtime/ui/battle-layout-controls.js:60|handle.onpointermove|assignment|需要进一步测试|handle.hasPointerCapture, Math.max, Math.min|
|src/runtime/ui/battle-layout-controls.js:68|handle.onpointerup|assignment|需要进一步测试|handle.hasPointerCapture, handle.releasePointerCapture, saveState, showToast|
|src/runtime/ui/battle-order-compat.js:9|ensureGroupNumbersV213|declaration|需要进一步测试|state.groups.forEach, Number.parseInt, Number.isFinite, used.has, used.add, Math.max, saveState|
|src/runtime/ui/battle-order-compat.js:37|groupNoTextV213|declaration|需要进一步测试|Math.max, Number.parseInt, String(n).padStart, String|
|src/runtime/ui/battle-order-compat.js:41|desiredGroupsV213|declaration|需要进一步测试|ensureGroupNumbersV213, ranking, state.groups     .slice()     .sort, state.groups     .slice, state.groups.indexOf|
|src/runtime/ui/battle-order-compat.js:53|currentCardSortLabelV213|declaration|需要进一步测试||
|src/runtime/ui/battle-order-compat.js:60|renderItemEncyclopedia|assignment|需要进一步测试|ensureV2State, document.getElementById, ITEM_KEYS.map((k) => {     const d = ITEM_DEFS[k];     return <div class="item-encyclopedia-card">     <div class="item-encyclopedia-icon-disc">${itemVisual(k, "item-encyclopedia-img")}</div>     <div class="item-encyclopedia-info"><div class="item-encyclopedia-name">${escapeHtml(d.name)}</div><div class="item-encyclopedia-desc">${escapeHtml(d.desc)}</div></div>     <div class="item-encyclopedia-actions"><button class="btn btn-sm btn-primary" onclick="chooseItemIcon('${k}')">上传图片</button><button class="btn btn-sm" onclick="resetItemIcon('${k}')">恢复默认</button></div>   </div>;   }).join, ITEM_KEYS.map, itemVisual, escapeHtml|
|src/runtime/ui/battle-order-compat.js:83|applySettingsBatchMembers|assignment|需要进一步测试|state.groups.map, _v213Batch.apply, state.groups.forEach, oldNums.has, oldNums.get, ensureGroupNumbersV213, saveState, renderAll|
|src/runtime/ui/battle-sort-contract.js:8|desiredGroupsV21724|declaration|需要进一步测试|state.groups.slice, groups.sort, groupNoValueV213, Number, ranking().slice, ranking|
|src/runtime/ui/battle-sort-contract.js:56|refreshSortingV21724|declaration|需要进一步测试|renderBattleRankPreviewV21721|
|src/runtime/ui/card-transform-repair.js:2|clearBrokenCardTranslateV21720|declaration|需要进一步测试|document.querySelectorAll(".group-row-card.battle-card").forEach, document.querySelectorAll, card.style.removeProperty|
|src/runtime/ui/chart-and-window-polish.js:1|formatChartScoreV294|declaration|需要进一步测试|Number, Math.abs, String, Math.trunc, Math.round, v.toFixed(v >= 10 ? 1 : 2).replace, v.toFixed|
|src/runtime/ui/competition-summary.js:1|updateQuickBatchBar|declaration|需要进一步测试|document.getElementById, bar.classList.add, bar.classList.remove|
|src/runtime/ui/competition-summary.js:11|updateHeaderStats|declaration|需要进一步测试|document.getElementById, GodpowerUIModel.standings, ranking, Number, Date.now, escapeHtml|
|src/runtime/ui/competition-summary.js:22|renderChart|declaration|需要进一步测试|document.getElementById, [...state.groups].sort, Math.max, sorted.map, Array.from, wrapper.querySelectorAll, g.id.toString, existingRows.forEach, currentIds.has, r.getAttribute, r.remove, sorted.forEach, wrapper.querySelector, document.createElement, row.setAttribute, escapeHtml, wrapper.appendChild, row.querySelector, formatChartScoreV294|
|src/runtime/ui/competition-summary.js:95|renderDashboard|declaration|需要进一步测试|document.getElementById, [...state.groups].sort, escapeHtml, getScoreText, state.groups.filter, state.groups.reduce, (totalScore / totalGroups).toFixed|
|src/runtime/ui/competition-summary.js:108|getScoreText|binding|需要进一步测试||
|src/runtime/ui/competition-summary.js:144|renderLockStatus|declaration|需要进一步测试|document.getElementById, addBtn.classList.add, importBtn.classList.add, resetBtn.classList.add, undoBtn.classList.add, addBtn.classList.remove, importBtn.classList.remove, resetBtn.classList.remove, undoBtn.classList.remove, DesktopUI.refreshLockControl|
|src/runtime/ui/competition-summary.js:170|renderControls|declaration|需要进一步测试|document.getElementById, mainActionBtn.classList.remove, nextBtn.classList.add, forceBtn.classList.add, forceBtn.classList.remove, mainActionBtn.classList.add, nextBtn.classList.remove, document.querySelectorAll, btns.forEach, btn.classList.add, btn.classList.remove, updateQuickBatchBar|
|src/runtime/ui/defense-notices.js:3|getTopNoticeStackV21735|declaration|需要进一步测试|document.getElementById, document.createElement, document.body.appendChild|
|src/runtime/ui/defense-notices.js:14|appendTopNoticeV21735|declaration|需要进一步测试|getTopNoticeStackV21735, stack.appendChild, node.remove, stack.remove, node.addEventListener, setTimeout|
|src/runtime/ui/defense-notices.js:18|remove|binding|需要进一步测试|node.remove, stack.remove|
|src/runtime/ui/defense-notices.js:30|showItemUseFx|assignment|需要进一步测试|ItemModules.feedback, DesktopUI.visualEvent, DesktopUI.getPreferences, playSound, setTimeout, itemSoundCategoryV26, playCasterCardFx, special.includes, ["coin_shell", "question", "question_block"].includes, cardFxTargets(key, casterId).forEach, cardFxTargets, playTargetCardFx, state.groups?.find, document.createElement, itemVisual, escapeHtml, appendTopNoticeV21735|
|src/runtime/ui/defense-notices.js:99|tinyDefenseToast|assignment|需要进一步测试|playSound, document.createElement, escapeHtml, String, appendTopNoticeV21735|
|src/runtime/ui/dock-tooltips.js:77|ensureDockHumorTipV2185|declaration|需要进一步测试|document.createElement, document.body.appendChild|
|src/runtime/ui/dock-tooltips.js:85|bindDockHumorV2185|declaration|需要进一步测试|el.removeAttribute, el.addEventListener, ensureDockHumorTipV2185, escapeHtml, el.getBoundingClientRect, tip.classList.add, tip.getBoundingClientRect, Math.max, Math.min, ensureDockHumorTipV2185().classList.remove|
|src/runtime/ui/dock-tooltips.js:110|applyDockHumorV2185|declaration|需要进一步测试|document.querySelector, bindDockHumorV2185, document.getElementById, [...dock.querySelectorAll(".dock-left>div")].find, dock.querySelectorAll, x.querySelector, ansWrap.querySelector, ansWrap       .querySelectorAll(".ans-btn")       .forEach, ansWrap       .querySelectorAll, btn.removeAttribute, [...dock.querySelectorAll("button")].find, (b.getAttribute("onclick") ／／ "").includes, b.getAttribute, byOnclick|
|src/runtime/ui/dock-tooltips.js:152|byOnclick|binding|需要进一步测试|[...dock.querySelectorAll("button")].find, dock.querySelectorAll, (b.getAttribute("onclick") ／／ "").includes, b.getAttribute|
|src/runtime/ui/dock-tooltips.js:180|renderLockState|assignment|需要进一步测试|_v2185RenderLockState.apply, document.getElementById, bindDockHumorV2185|
|src/runtime/ui/icon-settings.js:26|uiIconsV26|declaration|需要进一步测试|STORAGE.getJSON|
|src/runtime/ui/icon-settings.js:29|applyUiIconsV26|declaration|需要进一步测试|uiIconsV26, UI_ICON_TARGETS.forEach, document.querySelector, Reliability.safeImage, document.createElement, template.content.querySelector("svg,.custom-ui-icon")?.remove, template.content.querySelector, template.innerHTML.trim, escapeHtml, el.setAttribute|
|src/runtime/ui/icon-settings.js:47|chooseUiIconV26|declaration|需要进一步测试|document.getElementById, f.click|
|src/runtime/ui/icon-settings.js:53|handleUiIconV26|declaration|需要进一步测试|normalizeItemIconFile, uiIconsV26, STORAGE.setJSON, applyUiIconsV26, renderUiIconManagerV26|
|src/runtime/ui/icon-settings.js:64|resetUiIconV26|declaration|需要进一步测试|uiIconsV26, STORAGE.setJSON, applyUiIconsV26, renderUiIconManagerV26|
|src/runtime/ui/icon-settings.js:71|renderUiIconManagerV26|declaration|需要进一步测试|document.getElementById, uiIconsV26, UI_ICON_TARGETS.map(([id, label, , fallback]) => <div class="icon-custom-card"><div class="icon-preview">${m[id] ? <img src="${m[id]}"> : fallback}</div><div style="flex:1"><b>${label}</b><div style="font-size:11px;color:#64748b">支持 PNG / JPG / WebP</div></div><button class="btn btn-sm btn-primary" onclick="chooseUiIconV26('${id}')">上传</button>${m[id] ? <button class="btn btn-sm" onclick="resetUiIconV26('${id}')">还原</button> : ""}</div>).join, UI_ICON_TARGETS.map|
|src/runtime/ui/interface-copy.js:4|polishVisibleCopyV2187|declaration|需要进一步测试|document.querySelector, document     .querySelectorAll(".god-item-tools b,.queue-admin-tools b")     .forEach, document     .querySelectorAll, /上帝模式/.test, document     .querySelectorAll(       ".god-item-tools .btn-danger,.queue-admin-tools .btn-danger",     )     .forEach, /清空/.test|
|src/runtime/ui/interface-copy.js:58|openPwdModal|assignment|需要进一步测试|_v2187OpenPwdModal.apply, document.querySelector|
|src/runtime/ui/interface-copy.js:82|window[name]|assignment|需要进一步测试|fn.apply, setTimeout|
|src/runtime/ui/member-search.js:1|openMemberSearchModal|declaration|需要进一步测试|document.getElementById, backdrop.classList.add, setTimeout, input.focus|
|src/runtime/ui/member-search.js:12|closeMemberSearchModal|declaration|需要进一步测试|document.getElementById, hideClassroomWindow|
|src/runtime/ui/member-search.js:17|handleMemberSearchKey|declaration|需要进一步测试|event.preventDefault, searchMemberGroups, closeMemberSearchModal|
|src/runtime/ui/member-search.js:27|searchMemberGroups|declaration|需要进一步测试|document.getElementById, input.value.trim().toLowerCase, input.value.trim, state.groups.forEach, Array.isArray, members.forEach, String(member).trim, String, name.toLowerCase().includes, name.toLowerCase, matches.push, escapeHtml, matches     .map((item) => {       const g = item.group;       const memberList = (Array.isArray(g.members) ? g.members : [])         .map(escapeHtml)         .join("、");       return        <div class="member-search-result">         <div class="member-search-result-name">${escapeHtml(item.name)}</div>         <div class="member-search-result-group">${escapeHtml(g.name)}</div>         <div class="member-search-result-members">成员：${memberList ／／ "暂无成员"}</div>       </div>;     })     .join, matches     .map, (Array.isArray(g.members) ? g.members : [])         .map(escapeHtml)         .join, (Array.isArray(g.members) ? g.members : [])         .map|
|src/runtime/ui/navigation-and-clock.js:1|escapeHtml|declaration|需要进一步测试|String(str ?? "")     .replace(/&/g, "&amp;")     .replace(/</g, "&lt;")     .replace(/>/g, "&gt;")     .replace(/"/g, "&quot;")     .replace, String(str ?? "")     .replace(/&/g, "&amp;")     .replace(/</g, "&lt;")     .replace(/>/g, "&gt;")     .replace, String(str ?? "")     .replace(/&/g, "&amp;")     .replace(/</g, "&lt;")     .replace, String(str ?? "")     .replace(/&/g, "&amp;")     .replace, String(str ?? "")     .replace, String|
|src/runtime/ui/navigation-and-clock.js:27|ensureAudioUnlocked|declaration|需要进一步测试|Promise.resolve, getAudioContext()     .then(() => {       audioUnlocked = true;     })     .catch, getAudioContext()     .then, getAudioContext|
|src/runtime/ui/navigation-and-clock.js:38|switchView|declaration|需要进一步测试|GodpowerTheme.cancel, window.GodpowerTooltips?.cancel, window.GodPowerPageShell?.resolvePage, String(name).startsWith, String, window.GodPowerPluginCenter?.showRoute, VIEW_NAMES.includes, ensureAudioUnlocked, DesktopUI.viewChanged, document     .querySelectorAll(".view")     .forEach, document     .querySelectorAll, v.classList.remove, document.getElementById, target.classList.add, document     .querySelectorAll(".nav-tab")     .forEach, t.classList.toggle, renderWelcomePage, updateWelcomeTrackIfNeeded, renderHistoryList, renderSettlementHistoryList, window.GodPowerPluginCenter?.render, syncSettingsControls, renderBgmSlotList, renderFxSlotList, renderBgmEngineConsole, menuFadeOut, renderAll, bgmStopAll, ensureAudioUnlocked().then, getMenuTrackKeyForView, menuStartOrSwitch|
|src/runtime/ui/navigation-and-clock.js:85|enterBattleFromWelcome|declaration|需要进一步测试|switchView|
|src/runtime/ui/navigation-and-clock.js:89|getMenuTrackKeyForView|declaration|需要进一步测试|getWelcomeTrackKey|
|src/runtime/ui/navigation-and-clock.js:98|getWelcomeTrackKey|declaration|需要进一步测试|state.groups.reduce, Math.max, Number, Math.min, String, Math.floor, Math.abs|
|src/runtime/ui/navigation-and-clock.js:114|startWelcomeClock|declaration|需要进一步测试|updateWelcomeClock, setInterval|
|src/runtime/ui/navigation-and-clock.js:120|updateWelcomeClock|declaration|需要进一步测试|updateHeaderStats, DesktopUI.renderWelcome, String(now.getHours()).padStart, String, now.getHours, String(now.getMinutes()).padStart, now.getMinutes, String(now.getSeconds()).padStart, now.getSeconds, document.getElementById, now.getFullYear, now.getMonth, now.getDate, now.getDay, GodpowerTheme.name|
|src/runtime/ui/navigation-and-clock.js:156|renderWelcomePage|declaration|需要进一步测试|DesktopUI.renderWelcome, document.getElementById, [...state.groups].sort, Number, escapeHtml, getScore|
|src/runtime/ui/navigation-and-clock.js:166|getScore|binding|需要进一步测试|Number|
|src/runtime/ui/program-confirmation.js:2|programConfirmV28|declaration|需要进一步测试|document.getElementById, previous?.querySelector("#pcCancelV28")?.click, previous?.querySelector, DesktopUI.finishWindowClose, document.createElement, escapeHtml, escapeHtml(message).replace, document.body.appendChild, document.removeEventListener, hideClassroomWindow, o.remove, resolve, o.querySelector, finish, o.addEventListener, document.addEventListener|
|src/runtime/ui/program-confirmation.js:25|finish|binding|需要进一步测试|document.removeEventListener, hideClassroomWindow, o.remove, resolve|
|src/runtime/ui/program-confirmation.js:33|o.querySelector("#pcCancelV28").onclick|assignment|需要进一步测试|finish|
|src/runtime/ui/program-confirmation.js:34|o.querySelector("#pcOkV28").onclick|assignment|需要进一步测试|finish|
|src/runtime/ui/program-confirmation.js:38|key|binding|需要进一步测试|document.removeEventListener, finish|
|src/runtime/ui/rank-preview.js:3|renderBattleRankPreviewV21721|declaration|需要进一步测试|document.getElementById, ranking, state.groups             .slice()             .sort, state.groups             .slice, Number, state.groups       .slice()       .sort, state.groups       .slice, ranked     .map((g, i) => {       const rank = i + 1;       const no =         typeof groupNoTextV213 === "function"           ? groupNoTextV213(g)           : String(g.groupNo ／／ g.id ／／ "");       const medal =         rank === 1           ? "🥇"           : rank === 2             ? "🥈"             : rank === 3               ? "🥉"               : String(rank);       return <div class="battle-rank-chip ${rank === 1 ? "rank-1" : ""}" style="--rank-group-color:${g.color ／／ "#0F766E"}" title="第 ${rank} 名 · ${escapeHtml(g.name)} · 第 ${no} 组 · ${g.score} 分">       <div class="battle-rank-no">${medal}</div>       <div class="battle-rank-name">${escapeHtml(g.name)}</div>       <div class="battle-rank-score">${g.score}分</div>     </div>;     })     .join, ranked     .map, groupNoTextV213, String, escapeHtml|
|src/runtime/ui/rank-preview.js:50|switchView|assignment|需要进一步测试|_v21721SwitchView.call, setTimeout, renderBattleRankPreviewV21721|
|src/runtime/ui/round-flip.js:5|captureCardRectsV21725|declaration|需要进一步测试|document     .querySelectorAll("#groupList .group-row-card[data-group-id]")     .forEach, document     .querySelectorAll, card.getBoundingClientRect, map.set, String|
|src/runtime/ui/round-flip.js:21|animateCardsFromSnapshotV21725|declaration|需要进一步测试|document     .querySelectorAll("#groupList .group-row-card[data-group-id]")     .forEach, document     .querySelectorAll, oldRects.get, String, card.getBoundingClientRect, Math.abs, card.style.setProperty, moved.push, clearTimeout, moved.forEach, requestAnimationFrame, setTimeout, card.style.removeProperty|
|src/runtime/ui/score-dialog-and-animation.js:1|openScoreModal|declaration|需要进一步测试|event.preventDefault, event.stopPropagation, state.groups.find, document.getElementById, inputEl.classList.remove, showClassroomWindow, setTimeout, document.getElementById("modalCustomInput").focus|
|src/runtime/ui/score-dialog-and-animation.js:21|closeScoreModal|declaration|需要进一步测试|hideClassroomWindow, document.getElementById|
|src/runtime/ui/score-dialog-and-animation.js:26|submitModalScore|declaration|需要进一步测试|closeScoreModal, applyScoreDelta|
|src/runtime/ui/score-dialog-and-animation.js:33|handleModalKey|declaration|需要进一步测试|event.preventDefault, submitModalCustomScore, closeScoreModal|
|src/runtime/ui/score-dialog-and-animation.js:42|submitModalCustomScore|declaration|需要进一步测试|document.getElementById, input.value     .trim()     .replace(/[－—–−]/g, "-")     .replace, input.value     .trim()     .replace, input.value     .trim, String.fromCharCode, c.charCodeAt, input.classList.add, input.focus, input.select, /^[+-]?\d+$/.test, fail, parseInt, Number.isSafeInteger, closeScoreModal, applyScoreDelta|
|src/runtime/ui/score-dialog-and-animation.js:52|fail|binding|需要进一步测试|input.classList.add, input.focus, input.select|
|src/runtime/ui/score-dialog-and-animation.js:75|showMilestoneBanner|declaration|需要进一步测试|document.querySelector, card.querySelector, card.classList.add, banner.classList.add, setTimeout, banner.classList.remove, card.classList.remove|
|src/runtime/ui/score-dialog-and-animation.js:93|cancelScoreAnimationAndSync|declaration|需要进一步测试|cancelItemScoreAnimations, cancelAnimationFrame, state.groups.forEach|
|src/runtime/ui/score-dialog-and-animation.js:104|animateScores|declaration|需要进一步测试|ScoreCardMotion.play, cancelAnimationFrame, performance.now, Math.pow, Math.min, Math.max, easeScore, scoreUpdates.forEach, Math.round, state.groups.find, document.getElementById, renderChart, renderDashboard, requestAnimationFrame, updateHeaderStats, onComplete|
|src/runtime/ui/score-dialog-and-animation.js:115|easeScore|binding|需要进一步测试|Math.pow, Math.min, Math.max|
|src/runtime/ui/score-dialog-and-animation.js:117|tick|declaration|需要进一步测试|Math.min, easeScore, scoreUpdates.forEach, Math.round, state.groups.find, document.getElementById, renderChart, renderDashboard, requestAnimationFrame, updateHeaderStats, onComplete|
|src/runtime/ui/score-dialog-and-animation.js:152|applyScoreDelta|declaration|需要进一步测试|ManualScoreCommands.adjust|
|src/runtime/ui/score-dialog-and-animation.js:156|startDirectScoreEdit|declaration|需要进一步测试|openPwdModal, renderGrid|
|src/runtime/ui/score-dialog-and-animation.js:165|handleScoreInputKey|declaration|需要进一步测试|finishDirectScoreEdit, renderGrid|
|src/runtime/ui/score-dialog-and-animation.js:173|finishDirectScoreEdit|declaration|需要进一步测试|cancelScoreAnimationAndSync, document.getElementById, state.groups.find, Number, Number.isSafeInteger, showToast, ManualScoreCommands.set, renderGrid|
|src/runtime/ui/score-motion.js:2|scheduleScoreEffect|declaration|需要进一步测试|setTimeout, fn|
|src/runtime/ui/score-motion.js:8|cancelItemScoreAnimations|declaration|需要进一步测试|globalThis.ScoreCardMotion?.cancel, activeScoreRollsV21732.clear, document.querySelectorAll(".score-roll-host").forEach, document.querySelectorAll, el.classList.remove, state.groups.find, String, el.id.slice, clearTimeout, itemScoreDisplayHoldV21732.clear, state.groups.forEach, document.getElementById|
|src/runtime/ui/score-motion.js:50|snapshotScoresV21732|declaration|需要进一步测试|state.groups.map, String, Number|
|src/runtime/ui/score-motion.js:54|getScoreElementV21732|declaration|需要进一步测试|document.getElementById|
|src/runtime/ui/score-motion.js:58|applyHeldDisplayScoresV21732|declaration|需要进一步测试|itemScoreDisplayHoldV21732.forEach, state.groups.find, String|
|src/runtime/ui/score-motion.js:65|showDeltaOnlyV21732|declaration|需要进一步测试|getScoreElementV21732, scoreEl     .querySelectorAll(".item-score-delta")     .forEach, scoreEl     .querySelectorAll, x.remove, document.createElement, scoreEl.appendChild, requestAnimationFrame, deltaEl.classList.add, scheduleScoreEffect, deltaEl.remove|
|src/runtime/ui/score-motion.js:84|mountScoreRollV21732|declaration|需要进一步测试|scoreEl.style.setProperty, scoreEl.classList.add, document.createElement, Math.max, performance.now, scoreEl.append|
|src/runtime/ui/score-motion.js:99|rollThenCommitScoreV21732|declaration|需要进一步测试|String, state.groups.find, itemScoreDisplayHoldV21732.delete, performance.now, activeScoreRollsV21732.set, getScoreElementV21732, mountScoreRollV21732, scheduleScoreEffect, activeScoreRollsV21732.get, activeScoreRollsV21732.delete, el.classList.remove, renderChart, renderDashboard, updateHeaderStats, renderBattleRankPreviewV21721|
|src/runtime/ui/score-motion.js:128|queueItemScoreChangesV21732|declaration|需要进一步测试|DesktopUI.getPreferences, matchMedia, state.groups.forEach, beforeMap.get, String, Number, changes.push, itemScoreDisplayHoldV21732.get, activeScoreRollsV21732.delete, itemScoreDisplayHoldV21732.set, getScoreElementV21732, pendingItemScoreAnimationsV21732.push, pendingItemScoreAnimationsV21732.forEach, merged.has, merged.set, merged.get, merged.values, clearTimeout, scheduleScoreEffect, pendingItemScoreAnimationsV21732.splice, batch.forEach, state.groups.find, itemScoreDisplayHoldV21732.delete, ScoreCardMotion.play, showDeltaOnlyV21732, rollThenCommitScoreV21732|
|src/runtime/ui/score-motion.js:211|restoreHeldScoreElementsV21732|declaration|需要进一步测试|itemScoreDisplayHoldV21732.forEach, getScoreElementV21732, el.classList.contains, activeScoreRollsV21732.get, String, state.groups.find, mountScoreRollV21732|
|src/runtime/ui/settings-and-about.js:1|installSettingsTabs|declaration|需要进一步测试|document.querySelector, document.getElementById, document.createElement, sc.prepend, sc.appendChild, renderItemEncyclopedia|
|src/runtime/ui/settings-and-about.js:17|showSettingsV2|declaration|需要进一步测试|installSettingsTabs, document     .querySelectorAll("#settingsV2Tabs button")     .forEach, document     .querySelectorAll, b.classList.toggle, document.querySelector, document.getElementById, [...sc.children].forEach, item.classList.toggle, renderItemEncyclopedia, sc.querySelectorAll, titles[0]?.scrollIntoView|
|src/runtime/ui/settings-and-about.js:42|openAbout|declaration|需要进一步测试|showClassroomWindow, document.getElementById, renderAbout|
|src/runtime/ui/settings-and-about.js:46|closeAbout|declaration|需要进一步测试|hideClassroomWindow, document.getElementById|
|src/runtime/ui/settings-and-about.js:49|renderAbout|declaration|需要进一步测试|renderAboutItems, renderAboutInformation, cleanAboutVisibleCopy|
|src/runtime/ui/settings-and-about.js:58|renderItemWindow|assignment|需要进一步测试|_v2RenderItemWindow, state.groups.find, document.getElementById, document.createElement, ITEM_KEYS.map((k) => <button class="btn btn-sm" onclick="godAddItem(${g.id},'${k}')">${itemVisual(k)} ${ITEM_DEFS[k].name}</button>).join, ITEM_KEYS.map, itemVisual, body.appendChild|
|src/runtime/ui/settings-and-about.js:68|godAddItem|declaration|需要进一步测试|state.groups.find, showToast, recordHistory, g.inventory.push, ItemModules.inventory, Date.now, Math.random, saveState, renderAll, renderItemWindow|
|src/runtime/ui/settings-and-about.js:89|godClearItems|declaration|需要进一步测试|state.groups.find, recordHistory, saveState, renderAll, renderItemWindow|
|src/runtime/ui/settings-and-about.js:104|enhanceItemCards|assignment|需要进一步测试|_v2Enhance, ensureV2State, state.groups.forEach, document.querySelector, c.querySelectorAll(".item-slot").forEach, c.querySelectorAll, s.querySelector, itemVisual|
|src/runtime/ui/settings-and-about.js:122|renderItemWindow|assignment|需要进一步测试|_v2RenderItemWindowIcons, state.groups.find, document     .querySelectorAll("#itemWindowBody .item-big-icon")     .forEach, document     .querySelectorAll, itemVisual|
|src/runtime/ui/settings-and-about.js:144|switchView|assignment|需要进一步测试|_v2SwitchView, setTimeout|
|src/runtime/ui/settings-navigation-compat.js:1|rebuildSettingsV26|declaration|需要进一步测试|document.querySelector, document.getElementById, removeBgmEngineeringConsoleV26, document.getElementById("settingsV2Tabs")?.remove, document.getElementById("v2ItemPane")?.remove, document.createElement, Object.entries(panes).forEach, Object.entries, original.forEach, txt.includes, panes[mode].appendChild, sc.append, panes.function.appendChild, panes.items.appendChild, panes.sound.appendChild, document.body.appendChild, installCommunismModeSetting, renderUiIconManagerV26, renderItemEncyclopedia, renderItemFxSoundListV26, showSettingsV26|
|src/runtime/ui/settings-navigation-compat.js:73|showSettingsV26|declaration|需要进一步测试|document.getElementById, DesktopUI.selectSettings, document     .querySelectorAll(".legacy-settings-pane")     .forEach, document     .querySelectorAll, p.classList.toggle, document     .querySelectorAll("#settingsV26Tabs button")     .forEach, b.classList.toggle, document.querySelector, renderBgmSlotList, renderFxSlotList, renderItemFxSoundListV26, renderItemEncyclopedia, installCommunismModeSetting, renderUiIconManagerV26|
|src/runtime/ui/settings-navigation-compat.js:100|installSettingsTabs|assignment|需要进一步测试|rebuildSettingsV26|
|src/runtime/ui/settings-navigation-compat.js:103|showSettingsV2|assignment|需要进一步测试|showSettingsV26|
|src/runtime/ui/settings-navigation-compat.js:129|syncVisualViewportV27|declaration|需要进一步测试|document.documentElement.style.setProperty|
|src/runtime/ui/theme-dialog.js:4|closeThemeDialogV21727|declaration|需要进一步测试|document.getElementById, hideClassroomWindow, root.setAttribute, resolve|
|src/runtime/ui/theme-dialog.js:14|openThemeDialogV21727|declaration|需要进一步测试|document.getElementById, Promise.resolve, prev, String, document.createElement, closeThemeDialogV21727, actions.appendChild, setTimeout, ok.focus, showClassroomWindow, root.setAttribute|
|src/runtime/ui/theme-dialog.js:49|cancel.onclick|assignment|需要进一步测试|closeThemeDialogV21727|
|src/runtime/ui/theme-dialog.js:56|ok.onclick|assignment|需要进一步测试|closeThemeDialogV21727|
|src/runtime/ui/theme-dialog.js:64|ok.onclick|assignment|需要进一步测试|closeThemeDialogV21727|
|src/runtime/ui/theme-dialog.js:74|themeAlert|declaration|需要进一步测试|openThemeDialogV21727|
|src/runtime/ui/theme-dialog.js:78|themeConfirm|declaration|需要进一步测试|openThemeDialogV21727|
|src/runtime/ui/toast.js:2|showToast|declaration|需要进一步测试|document.getElementById, clearTimeout, String, t.showPopover, console.warn, t.classList.add, setTimeout, t.classList.remove, t.matches, t.hidePopover|
|src/runtime/ui/wallpaper.js:3|uiDbOpen|declaration|需要进一步测试|indexedDB.open, d.objectStoreNames.contains, d.createObjectStore, res|
|src/runtime/ui/wallpaper.js:8|r.onupgradeneeded|assignment|需要进一步测试|d.objectStoreNames.contains, d.createObjectStore|
|src/runtime/ui/wallpaper.js:12|r.onsuccess|assignment|需要进一步测试|res|
|src/runtime/ui/wallpaper.js:13|r.onerror|assignment|需要进一步测试|res|
|src/runtime/ui/wallpaper.js:20|uiDbReq|declaration|需要进一步测试|uiDbOpen, d.transaction, fn, tx.objectStore, res|
|src/runtime/ui/wallpaper.js:27|req.onsuccess|assignment|需要进一步测试|res|
|src/runtime/ui/wallpaper.js:28|req.onerror|assignment|需要进一步测试|res|
|src/runtime/ui/wallpaper.js:36|getWallVeil|declaration|需要进一步测试|Number, STORAGE.get, Number.isFinite, Math.max, Math.min|
|src/runtime/ui/wallpaper.js:40|applyWallpaperVeil|declaration|需要进一步测试|getWallVeil, root.style.setProperty, document.getElementById, Math.round|
|src/runtime/ui/wallpaper.js:55|applyWallpaper|declaration|需要进一步测试|URL.revokeObjectURL, URL.createObjectURL, root.style.setProperty, root.style.removeProperty, document.getElementById, applyWallpaperVeil|
|src/runtime/ui/wallpaper.js:71|compressWallpaper|declaration|需要进一步测试|createImageBitmap, URL.createObjectURL, URL.revokeObjectURL, res, rej, Math.min, Math.max, document.createElement, Math.round, canvas.getContext, ctx.fillRect, ctx.drawImage, img.close, canvas.toBlob|
|src/runtime/ui/wallpaper.js:80|im.onload|assignment|需要进一步测试|URL.revokeObjectURL, res|
|src/runtime/ui/wallpaper.js:84|im.onerror|assignment|需要进一步测试|URL.revokeObjectURL, rej|
|src/runtime/ui/wallpaper.js:104|onWallpaperFile|declaration|需要进一步测试|/^image\//.test, showToast, compressWallpaper, uiDbReq, st.put, applyWallpaper, Math.round|
|src/runtime/ui/wallpaper.js:127|resetWallpaper|declaration|需要进一步测试|uiDbReq, st.delete, applyWallpaper, showToast|
|src/runtime/ui/wallpaper.js:132|changeWallpaperVeil|declaration|需要进一步测试|STORAGE.set, Number, applyWallpaperVeil|
|src/runtime/ui/wallpaper.js:136|initWallpaper|declaration|需要进一步测试|uiDbReq, st.get, applyWallpaper|
|src/runtime/ui/welcome-score-sync.js:3|renderWelcomeAllV216|declaration|需要进一步测试|renderWelcomePage, renderChart, renderDashboard|
|src/runtime/ui/welcome-score-sync.js:18|switchView|assignment|需要进一步测试|oldSwitchV216.call, requestAnimationFrame|
|src/runtime/ui/welcome-score-sync.js:28|showItemUseFx|assignment|需要进一步测试|document       .querySelectorAll(".item-use-banner")       .forEach, document       .querySelectorAll, x.remove, playSound, setTimeout, itemSoundCategoryV26, playCasterCardFx, special.includes, ["coin_shell", "question", "question_block"].includes, cardFxTargets(key, casterId).forEach, cardFxTargets, playTargetCardFx, console.warn, state.groups?.find, document.createElement, itemVisual, escapeHtml, document.body.appendChild, banner.remove, banner.addEventListener|
|src/runtime/ui/welcome-score-sync.js:76|remove|binding|需要进一步测试|banner.remove|
|src/runtime/ui/window-visibility.js:2|showClassroomWindow|declaration|需要进一步测试|DesktopUI.cancelWindowClose, root.classList.add|
|src/runtime/ui/window-visibility.js:7|hideClassroomWindow|declaration|需要进一步测试|root.classList.remove, DesktopUI.dismissWindow, commit|
|src/ui/battle-grid.js:2|renderBattleGridCards|declaration|需要进一步测试|document.getElementById, ensureGroupNumbersV213, [     ...grid.querySelectorAll(".group-row-card[data-group-id]"),   ].map, grid.querySelectorAll, String, grid.querySelectorAll(".group-row-card[data-group-id]").forEach, c.getBoundingClientRect, oldRects.set, desiredGroupsV213, ordered.map, oldOrderIds.some, ordered.forEach, document.createElement, rowCard.style.setProperty, GodpowerUIModel.badgeColors, GodPowerBattleCardView.render, currentCardSortLabelV213, grid.appendChild, enhanceItemCards, console.warn, grid.querySelector, card.querySelector, ev.preventDefault, ev.stopPropagation, useItem, showToast, openItemWindow, card.querySelectorAll(".persistent-aura").forEach, card.querySelectorAll, x.remove, CompetitionEffects.has, auras.push, auras.forEach, card.appendChild, BattleMotion.restore, globalThis.ScoreCardMotion?.restore, ClassroomAvatarDisplay.decorateGroupCards, input.focus, input.select, oldRects.get, card.getBoundingClientRect, Math.abs, card.style.setProperty, moved.push, moved.forEach, requestAnimationFrame, setTimeout, card.style.removeProperty|
|src/ui/battle-grid.js:84|main.onclick|assignment|需要进一步测试|ev.preventDefault, ev.stopPropagation, useItem, showToast|
|src/ui/battle-grid.js:93|more.onclick|assignment|需要进一步测试|ev.preventDefault, ev.stopPropagation, openItemWindow|
|src/ui/battle-grid.js:184|decorateBattleRanks|declaration|需要进一步测试|ranking().map, ranking, document     .querySelectorAll(".group-row-card.battle-card[data-group-id]")     .forEach, document     .querySelectorAll, Number, card.querySelector, wrap.querySelector, document.createElement, wrap.appendChild, ranks.get, currentCardSortLabelV213|
|src/ui/battle-grid.js:204|decorateRoundItemLocks|declaration|需要进一步测试|state.groups.forEach, document.querySelector, card.querySelector, allIn.classList.add, main.classList.add|
|src/ui/battle-motion.js:7|enabled|declaration|需要进一步测试|DesktopUI.getPreferences, matchMedia|
|src/ui/battle-motion.js:18|mount|declaration|需要进一步测试|enabled, document.createElement, node.style.setProperty, itemVisual, escapeHtml, node.append, DesktopUI.getPreferences, shard.style.setProperty, shards.append, card.append, node.animate, Math.max, performance.now|
|src/ui/battle-motion.js:64|show|declaration|需要进一步测试|enabled, String, sessions.get, clearTimeout, document.querySelectorAll(".bm-layer").forEach, document.querySelectorAll, el.getAnimations().forEach, el.getAnimations, a.cancel, el.remove, /fire/.test, /ice/.test, /lightning/.test, /green／red／spiny／shell/.test, /bomb/.test, /boomerang/.test, /banana/.test, /horn/.test, /blooper/.test, /boo/.test, /hammer/.test, /bullet/.test, /kamek/.test, /item_?box/.test, /question/.test, /star／mega／power／mushroom／feather／coin/.test, performance.now, setTimeout, sessions.delete, sessions.set, mount, document.querySelector, CSS.escape|
|src/ui/battle-motion.js:161|restore|declaration|需要进一步测试|sessions.values, String, performance.now, mount, draws.get, card.classList.add, card.classList.toggle, card.append|
|src/ui/battle-motion.js:175|event|declaration|需要进一步测试|show|
|src/ui/battle-motion.js:183|clear|declaration|需要进一步测试|sessions.values, clearTimeout, sessions.clear, document.querySelectorAll(".bm-layer").forEach, document.querySelectorAll, el.getAnimations().forEach, el.getAnimations, a.cancel, el.remove, draws.values, node.parentElement?.classList.remove, node.remove, draws.clear|
|src/ui/classroom-avatar-display.js:12|currentContext|declaration|需要进一步测试|JSON.parse, root.localStorage.getItem, root.StableIdentity.isValidUserProfileId, root.StableIdentity.isValidClassroomId|
|src/ui/classroom-avatar-display.js:30|clearUrls|declaration|需要进一步测试|urls.values, root.URL.revokeObjectURL, urls.clear, compactImages.clear, compactGroups.clear|
|src/ui/classroom-avatar-display.js:38|canvasImage|declaration|需要进一步测试|root.document.createElement, canvas.getContext, context.fillRect, Math.max, context.drawImage, canvas.toDataURL|
|src/ui/classroom-avatar-display.js:59|compactImage|declaration|需要进一步测试|compactImages.has, compactImages.get, async () => {       try {         const image = new Image();         image.src = url;         if (typeof image.decode === "function") await image.decode();         else           await new Promise((resolve, reject) => {             image.onload = resolve;             image.onerror = reject;           });         return canvasImage(image, 256, 256);       } catch (_) {         return "";       }     }, image.decode, canvasImage, compactImages.set, pending.then|
|src/ui/classroom-avatar-display.js:84|readIndex|declaration|需要进一步测试|currentContext, clearUrls, root.ClassroomRosterRepository.createClassroomRosterRepository, repository.read, roster.assignments.find, roster.students.map, students.get, byGroup.get, entries.push, byGroup.set, byGroup.values, resourceIds.add, root.TeachingResourceRepository.open, Promise.all, [...resourceIds].map, urls.has, resourceRepository.get, ["image/png", "image/jpeg", "image/webp"].includes, urls.set, root.URL.createObjectURL, [...urls.values()].map, urls.values|
|src/ui/classroom-avatar-display.js:164|studentUrl|declaration|需要进一步测试|avatarIndex.get, urls.get|
|src/ui/classroom-avatar-display.js:175|groupUrls|declaration|需要进一步测试|avatarIndex.get, urls.get, seen.has, seen.add, result.push|
|src/ui/classroom-avatar-display.js:189|groupDataUrl|declaration|需要进一步测试|compactGroups.get, groupUrls, (async () => {       const sources = await Promise.all(         images.map(async (url) => {           const image = new Image();           image.src = url;           if (typeof image.decode === "function") await image.decode();           else             await new Promise((resolve, reject) => {               image.onload = resolve;               image.onerror = reject;             });           return image;         }),       );       const canvas = root.document.createElement("canvas");       canvas.width = 256;       canvas.height = 256;       const context = canvas.getContext("2d");       if (!context) return "";       context.fillStyle = "#ffffff";       context.fillRect(0, 0, 256, 256);       const cell = sources.length === 1 ? 256 : 127;       sources.forEach((image, index) => {         const x = sources.length === 1 ? 0 : (index % 2) * 129;         const y = sources.length === 1 ? 0 : Math.floor(index / 2) * 129;         const scale = Math.max(cell / image.width, cell / image.height);         const width = image.width * scale;         const height = image.height * scale;         context.save();         context.beginPath();         context.rect(x, y, cell, cell);         context.clip();         context.drawImage(           image,           x + (cell - width) / 2,           y + (cell - height) / 2,           width,           height,         );         context.restore();       });       return canvas.toDataURL("image/webp", 0.82);     })().catch, async () => {       const sources = await Promise.all(         images.map(async (url) => {           const image = new Image();           image.src = url;           if (typeof image.decode === "function") await image.decode();           else             await new Promise((resolve, reject) => {               image.onload = resolve;               image.onerror = reject;             });           return image;         }),       );       const canvas = root.document.createElement("canvas");       canvas.width = 256;       canvas.height = 256;       const context = canvas.getContext("2d");       if (!context) return "";       context.fillStyle = "#ffffff";       context.fillRect(0, 0, 256, 256);       const cell = sources.length === 1 ? 256 : 127;       sources.forEach((image, index) => {         const x = sources.length === 1 ? 0 : (index % 2) * 129;         const y = sources.length === 1 ? 0 : Math.floor(index / 2) * 129;         const scale = Math.max(cell / image.width, cell / image.height);         const width = image.width * scale;         const height = image.height * scale;         context.save();         context.beginPath();         context.rect(x, y, cell, cell);         context.clip();         context.drawImage(           image,           x + (cell - width) / 2,           y + (cell - height) / 2,           width,           height,         );         context.restore();       });       return canvas.toDataURL("image/webp", 0.82);     }, Promise.all, images.map, image.decode, root.document.createElement, canvas.getContext, context.fillRect, sources.forEach, Math.floor, Math.max, context.save, context.beginPath, context.rect, context.clip, context.drawImage, context.restore, canvas.toDataURL, compactGroups.set, pending.then|
|src/ui/classroom-avatar-display.js:246|studentDataUrl|declaration|需要进一步测试|studentUrl, compactImages.get|
|src/ui/classroom-avatar-display.js:252|groupDataUrlCached|declaration|需要进一步测试|compactGroups.get|
|src/ui/classroom-avatar-display.js:257|decorateGroupCards|declaration|需要进一步测试|root.document.querySelector, CSS.escape, String, card?.querySelector, badge.classList.add, badge.replaceChildren, root.document.createElement, groupNoTextV213, badge.append, readIndex().then, readIndex, groupUrls, stack.setAttribute, stack.append|
|src/ui/classroom-avatar-display.js:313|renderRaffleReel|declaration|需要进一步测试|studentUrl, groupUrls, element.replaceChildren, root.document.createElement, root.parseStudentV218, label.append, wrapper.append, element.append|
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
|src/ui/classroom-feedback.js:135|show|declaration|需要进一步测试|allowed, window.GodpowerPicker?.isExternalPresentation, playSound, cancel, window.godpowerDesktop.showScore, Number, String(value).replace, String, randomEffectStyle, dialog, root.querySelector, avatarStack.replaceChildren, avatars.slice, src.startsWith, document.createElement, avatarStack.append, DesktopUI.getPreferences, dot.style.setProperty, Math.cos, Math.sin, particles.append, root.classList.toggle, getComputedStyle, root.showModal, document.getElementById, toast?.matches, toast.hidePopover, toast.showPopover, root.classList.add, setTimeout, dismiss|
|src/ui/classroom-feedback.js:220|score|declaration|需要进一步测试|Number.isSafeInteger, show, Math.abs|
|src/ui/classroom-feedback.js:229|picked|declaration|需要进一步测试|parseStudentV218, show, window.ClassroomAvatarDisplay?.groupUrls, window.ClassroomAvatarDisplay?.studentUrl|
|src/ui/classroom-feedback.js:253|syncSettings|declaration|需要进一步测试|document.querySelectorAll("[data-cf-slot]").forEach, document.querySelectorAll, document.querySelectorAll("[data-cf-option]").forEach|
|src/ui/classroom-feedback.js:263|settings|declaration|需要进一步测试|document       .querySelector('[data-category-panel="rules"]')       .insertAdjacentHTML, document       .querySelector, options.slots.map((n, i) => <label>槽位 ${i + 1}<input type="number" step="1" data-cf-slot="${i}" aria-label="快捷赋分槽位 ${i + 1}" value="${n}"></label>).join, options.slots.map, document       .querySelector('[data-category-panel="motion"]')       .insertAdjacentHTML, document       .querySelector('[data-category-panel="sound"] > .ui-settings-title')       .insertAdjacentHTML, document.querySelectorAll("[data-cf-slot]").forEach, document.querySelectorAll, e.addEventListener, [...document.querySelectorAll("[data-cf-slot]")].map, x.value.trim, Number, setOptions, document.getElementById, e.removeAttribute, e.setAttribute, document.querySelectorAll("[data-cf-option]").forEach, ["duration", "clickVolume"].includes, cancel, syncSettings|
|src/ui/classroom-feedback.js:317|allowClickSound|declaration|需要进一步测试||
|src/ui/classroom-feedback.js:327|stopClickVoice|declaration|需要进一步测试|clickVoice.source.stop, clickVoice.source.disconnect, clickVoice.gain.disconnect|
|src/ui/classroom-feedback.js:336|ownClickVoice|declaration|需要进一步测试|stopClickVoice, source.disconnect, gain.disconnect|
|src/ui/classroom-feedback.js:340|source.onended|assignment|需要进一步测试|source.disconnect, gain.disconnect|
|src/ui/classroom-feedback.js:346|bindButtonSound|declaration|需要进一步测试|document.addEventListener, e.target.closest, button.closest, stopClickVoice, button.hasAttribute, clearTimeout, setTimeout, playSound, ActionSounds.classify|
|src/ui/classroom-feedback.js:369|init|declaration|需要进一步测试|localStorage.getItem, validate, JSON.parse, console.warn, document.body.insertAdjacentHTML, bindButtonSound, Reliability.onDefenseInvalidation, cancel, BattleMotion.clear, dialog().addEventListener, dialog, e.preventDefault, dismiss, settings, refreshSlots, document.addEventListener, stopClickVoice, clearLive, matchMedia("(prefers-reduced-motion: reduce)").addEventListener, matchMedia, allowed|
|src/ui/classroom-feedback.js:410|candidates|declaration|需要进一步测试|state.groups.filter, pre.includes, groups.map, groups.flatMap, (g.members ／／ []).map|
|src/ui/classroom-feedback.js:424|rowMarkup|declaration|需要进一步测试|escapeHtml, studentLabelHTMLV218|
|src/ui/classroom-feedback.js:429|clearLive|declaration|需要进一步测试|live.animation.cancel, live.strip.remove, liveReels.clear|
|src/ui/classroom-feedback.js:437|startLive|declaration|需要进一步测试|clearLive, allowed, document       .querySelectorAll("#pickerModal .slot-reel-frame")       .forEach, document       .querySelectorAll, frame.getClientRects, candidates, frame.querySelector, document.createElement, strip.setAttribute, rowMarkup, strip.append, frame.append, strip.animate, liveReels.set|
|src/ui/classroom-feedback.js:481|takeLive|declaration|需要进一步测试|liveReels.get, Number, Math.floor|
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
|src/ui/classroom-roster-workspace.js:38|classroomNameOfV2200|declaration|需要进一步测试||
|src/ui/classroom-roster-workspace.js:41|nextLiveCopyNameV2200|declaration|需要进一步测试|(doc?.classrooms ／／ []).map, used.has, Date.now|
|src/ui/classroom-roster-workspace.js:52|mergeLiveCopyV2200|declaration|需要进一步测试|JSON.parse, JSON.stringify, cloneOf, merged.profiles.some, merged.profiles.push, merged.classrooms.some, merged.classrooms.push, merged.students.some, merged.students.push, merged.assignments.push|
|src/ui/classroom-roster-workspace.js:53|cloneOf|binding|需要进一步测试|JSON.parse, JSON.stringify|
|src/ui/classroom-roster-workspace.js:73|mount|declaration|需要进一步测试|root.ClassroomRosterRepository.createClassroomRosterRepository, document.createElement, host.append, section.querySelector, modeSelect.setAttribute, modeLabel.append, text, section       .querySelector(".roster-workspace-toolbar")       .insertBefore, section       .querySelector, section.querySelector(".roster-workspace-toolbar").after, root.TeachingResourceRepository.open, URL.revokeObjectURL, avatarObjectUrls.clear, (           await getAvatarRepository()         ).get, getAvatarRepository, avatar.mimeType.startsWith, URL.createObjectURL, avatarObjectUrls.add, avatarObjectUrls.delete, setStatus, JSON.parse, storage.getItem, root.StableIdentity.isValidUserProfileId, root.StableIdentity.isValidClassroomId, repository.write, repository.read, render, documentData.assignments.find, documentData.assignments.push, clearAvatarUrls, rows.replaceChildren, documentData?.classrooms.find, documentData.students.map, assignmentFor, assignment.groupAssignments.map, getGroups().map, getGroups, studentMap.get, name.setAttribute, nameCell.append, group.setAttribute, group.append, assigned.get, group.replaceChildren, groupCell.append, renderAvatar, student.displayName.trim().slice, student.displayName.trim, Boolean, upload.setAttribute, new Set(["image/png", "image/jpeg", "image/webp"]).has, clone, serializeRows, JSON.stringify, stored.rosterData.students.find, file.arrayBuffer, [               ...new Uint8Array(                 await root.crypto.subtle.digest("SHA-256", bytes),               ),             ]               .map((value) => value.toString(16).padStart(2, "0"))               .join, [               ...new Uint8Array(                 await root.crypto.subtle.digest("SHA-256", bytes),               ),             ]               .map, root.crypto.subtle.digest, value.toString(16).padStart, value.toString, (               await avatarRepo.list({                 profileId,                 classroomId,                 subjectId: "student-avatar",               })             ).find, avatarRepo.list, avatarRepo.addBatch, next.students.find, avatarRepo.remove, uploadLabel.append, avatarEditor.append, clearAvatar.setAttribute, writeDocument, avatarCell.append, remove.setAttribute, classroom.studentIds.filter, documentData.students.filter, assignment.groupAssignments.filter, renderRows, actionCell.append, row.append, rows.append, root.ClassroomRoster.createRosterDocument, profileSelect.replaceChildren, classroomSelect.replaceChildren, profileSelect.append, classroomSelect.append, documentData.profiles.some, documentData.classrooms.some, documentData.classrooms.find, rows.querySelectorAll, row.querySelector("input").value.trim, row.querySelector, names.set, memberships.set, names.has, names.get, [...memberships].map, [...rows.querySelectorAll("tr")].map, documentData.assignments.filter, root.ClassroomRoster.validateRosterDocument, saved.rosterData.students               .map((student) => student.avatarResourceId)               .filter, saved.rosterData.students               .map, avatarRepo.get, asset.mimeType.startsWith, saved.rosterData.students.some, asset.blob.arrayBuffer, assets.push, toBase64, new Date().toISOString, link.click, setTimeout, Array.isArray, rosterData.students           .map((student) => student.avatarResourceId)           .filter, rosterData.students           .map, rosterData.profiles.map, rosterData.classrooms.map, avatarIds.has, referenced.has, avatarIds.add, profileIds.has, classroomById.has, ["image/png", "image/jpeg", "image/webp"].includes, fromBase64, rosterData.students.some, sha256, entry.sha256?.toLowerCase, root.TeachingResource.validateFile, prepared.push, existing.map, existingById.get, mapping.set, existingByHash.get, importedByHash.get, root.StableIdentity.createResourceId, toCreate.push, importedByHash.set, mapping.get, failures.push, failures.join, importRosterBackup, rollbackImportedResources, document.getElementById, document.removeEventListener, overlay.remove, section.querySelector("#rosterPreviewApply")?.focus, openPwdModal, ClassroomWriteBarrier.allow, root.ClassroomRoster.planCompetitionMemberUpdate, Object.freeze, buildClassroomBackup, overlay.setAttribute, plan.groupChanges.filter, plan.groupChanges           .map(             (item) =>               <tr><th>${root.escapeHtml(item.groupName)}</th><td>${root.escapeHtml(item.before.join("、") ／／ "（无）")}</td><td>${root.escapeHtml(item.after.join("、") ／／ "（无）")}</td><td>${item.changed ? "将更新" : "不变"}</td></tr>,           )           .join, plan.groupChanges           .map, root.escapeHtml, item.before.join, item.after.join, document.body.append, overlay.querySelector, overlay.addEventListener, closeApplyPreview, event.preventDefault, document.addEventListener, closeButton.focus, root.themeConfirm, stillCurrent, runClassroomCommand, state.groups.find, classroomCommands.whenIdle, root.StableIdentity.assignGroupUids, repository.previewMigration, root.StableIdentity.createClassroomId, root.StableIdentity.createUserProfileId, nextLiveCopyNameV2200, mergeLiveCopyV2200, classroomNameOfV2200, section.querySelector("#rosterProfileName").focus, section.querySelector("#rosterClassroomName").focus, section.querySelector("#rosterClassroomName").value.trim, next.classrooms.push, next.assignments.push, section.querySelector("#rosterProfileName").value.trim, next.profiles.push, root.StableIdentity.createStudentUid, documentData.students.push, classroom.studentIds.push, rows.lastElementChild?.querySelector, added?.focus, added?.select, file.text, root.confirm, commitRosterImport, root.addEventListener|
|src/ui/classroom-roster-workspace.js:126|getAvatarRepository|declaration|需要进一步测试|root.TeachingResourceRepository.open|
|src/ui/classroom-roster-workspace.js:130|clearAvatarUrls|declaration|需要进一步测试|URL.revokeObjectURL, avatarObjectUrls.clear|
|src/ui/classroom-roster-workspace.js:134|renderAvatar|declaration|需要进一步测试|(           await getAvatarRepository()         ).get, getAvatarRepository, avatar.mimeType.startsWith, URL.createObjectURL, avatarObjectUrls.add, URL.revokeObjectURL, avatarObjectUrls.delete, setStatus|
|src/ui/classroom-roster-workspace.js:173|setStatus|declaration|需要进一步测试||
|src/ui/classroom-roster-workspace.js:177|writeDocument|declaration|需要进一步测试|repository.write, repository.read, setStatus, render|
|src/ui/classroom-roster-workspace.js:200|assignmentFor|declaration|需要进一步测试|documentData.assignments.find, documentData.assignments.push|
|src/ui/classroom-roster-workspace.js:216|renderRows|declaration|需要进一步测试|clearAvatarUrls, rows.replaceChildren, documentData?.classrooms.find, documentData.students.map, assignmentFor, assignment.groupAssignments.map, getGroups().map, getGroups, studentMap.get, document.createElement, name.setAttribute, nameCell.append, group.setAttribute, group.append, assigned.get, group.replaceChildren, groupCell.append, renderAvatar, text, student.displayName.trim().slice, student.displayName.trim, Boolean, upload.setAttribute, setStatus, new Set(["image/png", "image/jpeg", "image/webp"]).has, repository.read, storage.getItem, clone, serializeRows, JSON.stringify, stored.rosterData.students.find, getAvatarRepository, file.arrayBuffer, [               ...new Uint8Array(                 await root.crypto.subtle.digest("SHA-256", bytes),               ),             ]               .map((value) => value.toString(16).padStart(2, "0"))               .join, [               ...new Uint8Array(                 await root.crypto.subtle.digest("SHA-256", bytes),               ),             ]               .map, root.crypto.subtle.digest, value.toString(16).padStart, value.toString, (               await avatarRepo.list({                 profileId,                 classroomId,                 subjectId: "student-avatar",               })             ).find, avatarRepo.list, avatarRepo.addBatch, next.students.find, repository.write, render, avatarRepo.remove, uploadLabel.append, avatarEditor.append, clearAvatar.setAttribute, writeDocument, avatarCell.append, remove.setAttribute, classroom.studentIds.filter, documentData.students.filter, assignment.groupAssignments.filter, renderRows, actionCell.append, row.append, rows.append|
|src/ui/classroom-roster-workspace.js:283|upload.onchange|assignment|需要进一步测试|setStatus, new Set(["image/png", "image/jpeg", "image/webp"]).has, repository.read, storage.getItem, clone, serializeRows, JSON.stringify, stored.rosterData.students.find, getAvatarRepository, file.arrayBuffer, [               ...new Uint8Array(                 await root.crypto.subtle.digest("SHA-256", bytes),               ),             ]               .map((value) => value.toString(16).padStart(2, "0"))               .join, [               ...new Uint8Array(                 await root.crypto.subtle.digest("SHA-256", bytes),               ),             ]               .map, root.crypto.subtle.digest, value.toString(16).padStart, value.toString, (               await avatarRepo.list({                 profileId,                 classroomId,                 subjectId: "student-avatar",               })             ).find, avatarRepo.list, avatarRepo.addBatch, next.students.find, repository.write, render, avatarRepo.remove|
|src/ui/classroom-roster-workspace.js:411|clearAvatar.onclick|assignment|需要进一步测试|clone, next.students.find, writeDocument, setStatus|
|src/ui/classroom-roster-workspace.js:428|remove.onclick|assignment|需要进一步测试|classroom.studentIds.filter, documentData.students.filter, assignment.groupAssignments.filter, renderRows, setStatus|
|src/ui/classroom-roster-workspace.js:446|render|declaration|需要进一步测试|repository.read, setStatus, root.ClassroomRoster.createRosterDocument, profileSelect.replaceChildren, classroomSelect.replaceChildren, profileSelect.append, classroomSelect.append, documentData.profiles.some, documentData.classrooms.some, Boolean, section.querySelector, getGroups, renderRows|
|src/ui/classroom-roster-workspace.js:497|serializeRows|declaration|需要进一步测试|documentData.classrooms.find, assignmentFor, rows.querySelectorAll, row.querySelector("input").value.trim, row.querySelector, names.set, memberships.set, documentData.students.map, names.has, names.get, [...memberships].map, [...rows.querySelectorAll("tr")].map, documentData.assignments.filter, documentData.assignments.push, root.ClassroomRoster.validateRosterDocument|
|src/ui/classroom-roster-workspace.js:533|download|declaration|需要进一步测试|repository.read, clone, serializeRows, JSON.stringify, saved.rosterData.students               .map((student) => student.avatarResourceId)               .filter, saved.rosterData.students               .map, getAvatarRepository, avatarRepo.get, asset.mimeType.startsWith, saved.rosterData.students.some, asset.blob.arrayBuffer, assets.push, toBase64, new Date().toISOString, document.createElement, URL.createObjectURL, link.click, setTimeout, URL.revokeObjectURL, setStatus|
|src/ui/classroom-roster-workspace.js:603|importRosterBackup|declaration|需要进一步测试|Array.isArray, root.ClassroomRoster.validateRosterDocument, rosterData.students           .map((student) => student.avatarResourceId)           .filter, rosterData.students           .map, rosterData.profiles.map, rosterData.classrooms.map, avatarIds.has, referenced.has, avatarIds.add, profileIds.has, classroomById.has, ["image/png", "image/jpeg", "image/webp"].includes, fromBase64, rosterData.students.some, sha256, entry.sha256?.toLowerCase, root.TeachingResource.validateFile, prepared.push, getAvatarRepository, avatarRepo.list, existing.map, existingById.get, avatarRepo.get, mapping.set, existingByHash.get, importedByHash.get, root.StableIdentity.createResourceId, toCreate.push, importedByHash.set, avatarRepo.addBatch, mapping.get|
|src/ui/classroom-roster-workspace.js:760|rollbackImportedResources|declaration|需要进一步测试|getAvatarRepository, avatarRepo.remove, failures.push, failures.join|
|src/ui/classroom-roster-workspace.js:774|commitRosterImport|declaration|需要进一步测试|storage.getItem, repository.read, importRosterBackup, repository.write, render, rollbackImportedResources|
|src/ui/classroom-roster-workspace.js:806|closeApplyPreview|declaration|需要进一步测试|document.getElementById, document.removeEventListener, overlay.remove, section.querySelector("#rosterPreviewApply")?.focus, section.querySelector|
|src/ui/classroom-roster-workspace.js:814|openApplyPreview|declaration|需要进一步测试|openPwdModal, ClassroomWriteBarrier.allow, setStatus, repository.read, clone, serializeRows, JSON.stringify, getGroups, root.ClassroomRoster.planCompetitionMemberUpdate, storage.getItem, Object.freeze, buildClassroomBackup, document.createElement, overlay.setAttribute, plan.groupChanges.filter, plan.groupChanges           .map(             (item) =>               <tr><th>${root.escapeHtml(item.groupName)}</th><td>${root.escapeHtml(item.before.join("、") ／／ "（无）")}</td><td>${root.escapeHtml(item.after.join("、") ／／ "（无）")}</td><td>${item.changed ? "将更新" : "不变"}</td></tr>,           )           .join, plan.groupChanges           .map, root.escapeHtml, item.before.join, item.after.join, document.body.append, overlay.querySelector, overlay.addEventListener, closeApplyPreview, document.getElementById, event.preventDefault, document.removeEventListener, document.addEventListener, closeButton.focus, root.themeConfirm, stillCurrent, runClassroomCommand, documentData.classrooms.find, state.groups.find, classroomCommands.whenIdle|
|src/ui/classroom-roster-workspace.js:893|onKeydown|binding|需要进一步测试|document.getElementById, event.preventDefault, closeApplyPreview, document.removeEventListener|
|src/ui/classroom-roster-workspace.js:906|overlay.querySelector("#rosterApplyConfirm").onclick|assignment|需要进一步测试|root.themeConfirm, document.getElementById, closeApplyPreview, document.removeEventListener, repository.read, JSON.stringify, storage.getItem, stillCurrent, setStatus, ClassroomWriteBarrier.allow, openPwdModal, runClassroomCommand, documentData.classrooms.find, state.groups.find, classroomCommands.whenIdle|
|src/ui/classroom-roster-workspace.js:928|stillCurrent|binding|需要进一步测试|JSON.stringify, storage.getItem|
|src/ui/classroom-roster-workspace.js:988|profileSelect.onchange|assignment|需要进一步测试|renderRows, setStatus|
|src/ui/classroom-roster-workspace.js:993|classroomSelect.onchange|assignment|需要进一步测试|renderRows, setStatus|
|src/ui/classroom-roster-workspace.js:998|modeSelect.onchange|assignment|需要进一步测试|assignmentFor, renderRows, setStatus|
|src/ui/classroom-roster-workspace.js:1005|section.querySelector("#rosterCreateFromLive").onclick|assignment|需要进一步测试|root.StableIdentity.assignGroupUids, getGroups, repository.previewMigration, root.StableIdentity.createClassroomId, root.StableIdentity.createUserProfileId, nextLiveCopyNameV2200, writeDocument, mergeLiveCopyV2200, classroomNameOfV2200, setStatus|
|src/ui/classroom-roster-workspace.js:1038|section.querySelector("#rosterAddProfile").onclick|assignment|需要进一步测试|section.querySelector, section.querySelector("#rosterProfileName").focus|
|src/ui/classroom-roster-workspace.js:1042|addClassroom.onclick|assignment|需要进一步测试|section.querySelector("#rosterClassroomName").focus, section.querySelector|
|src/ui/classroom-roster-workspace.js:1046|section.querySelector("#rosterCancelClassroom").onclick|assignment|需要进一步测试||
|src/ui/classroom-roster-workspace.js:1049|section.querySelector("#rosterSaveClassroom").onclick|assignment|需要进一步测试|section.querySelector("#rosterClassroomName").value.trim, section.querySelector, setStatus, clone, root.StableIdentity.createClassroomId, next.classrooms.push, next.assignments.push, writeDocument, render|
|src/ui/classroom-roster-workspace.js:1068|section.querySelector("#rosterCancelProfile").onclick|assignment|需要进一步测试|section.querySelector|
|src/ui/classroom-roster-workspace.js:1071|section.querySelector("#rosterSaveProfile").onclick|assignment|需要进一步测试|section.querySelector("#rosterProfileName").value.trim, section.querySelector, setStatus, clone, root.StableIdentity.createUserProfileId, next.profiles.push, next.assignments.push, writeDocument, render|
|src/ui/classroom-roster-workspace.js:1091|section.querySelector("#rosterAddStudent").onclick|assignment|需要进一步测试|documentData.classrooms.find, root.StableIdentity.createStudentUid, documentData.students.push, classroom.studentIds.push, renderRows, rows.lastElementChild?.querySelector, added?.focus, added?.select, setStatus|
|src/ui/classroom-roster-workspace.js:1111|section.querySelector("#rosterSave").onclick|assignment|需要进一步测试|writeDocument, serializeRows, setStatus|
|src/ui/classroom-roster-workspace.js:1120|section.querySelector("#rosterImport").onchange|assignment|需要进一步测试|JSON.parse, file.text, root.confirm, commitRosterImport, setStatus|
|src/ui/component-library.js:371|$|binding|需要进一步测试|root?.querySelector|
|src/ui/component-library.js:372|create|binding|需要进一步测试|document.createElement|
|src/ui/component-library.js:378|entries|binding|需要进一步测试|GodPowerComponentCatalog.classes.map, CSS.escape, GodPowerComponentCatalog.animations.map, GodPowerComponentCatalog.tokens.map, Object.entries(ITEM_DEFS).map, Object.entries|
|src/ui/component-library.js:413|nodeIndex|declaration|需要进一步测试|[...document.querySelectorAll("[id]")]       .filter((n) => !n.closest("#componentLibraryModal"))       .map, [...document.querySelectorAll("[id]")]       .filter, document.querySelectorAll, n.closest, CSS.escape|
|src/ui/component-library.js:424|safeUrl|declaration|需要进一步测试|/^(?:data:／blob:／#)/i.test, value.trim|
|src/ui/component-library.js:427|sanitize|declaration|需要进一步测试|blocked.test, create, tree.querySelectorAll, node.remove, attr.name.toLowerCase, node.setAttribute, resourceSafeCss, /^on/i.test, [             "action",             "formaction",             "target",             "srcdoc",             "srcset",             "autofocus",           ].includes, node.removeAttribute, ["src", "href", "xlink:href", "poster"].includes, safeUrl, node.matches|
|src/ui/component-library.js:474|resourceSafeCss|declaration|需要进一步测试|text       .replace(/@import[\s\S]*?;/gi, "")       .replace, text       .replace, (quoted ?? raw ?? "").trim, safeUrl, JSON.stringify|
|src/ui/component-library.js:485|previewStyles|declaration|需要进一步测试|document.querySelectorAll, parts.push, ComponentPreviewStyle.scope, resourceSafeCss, parts.join|
|src/ui/component-library.js:498|liveSample|declaration|需要进一步测试|[...document.querySelectorAll(entry.selector)].find, document.querySelectorAll, n.closest, node.cloneNode, node.querySelectorAll, tree.querySelectorAll, originals.forEach, n.matches, copy.setAttribute, copy.toggleAttribute, /窗口／演出／老虎机／举手／全屏/.test, node.matches, tree.classList.add, getComputedStyle, parent.cloneNode, wrapper.classList.contains, wrapper.classList.add, wrapper.style.removeProperty, wrapper.append, sanitize, node.closest(".view")?.id.replace, node.closest|
|src/ui/component-library.js:556|sample|declaration|需要进一步测试|create, Reliability.safeImage, wrap.append, entry.name?.startsWith, entry.name.slice, /^(effect-／cfx-／hit-／bm-)/.test, wrap.classList.add, sanitize|
|src/ui/component-library.js:611|showPreview|declaration|需要进一步测试|create, host.setAttribute, $("#componentLibraryDetail").append, $, host.attachShadow, previewStyles, document.createElement, Object.entries, GodpowerTheme.get, body.classList.toggle, sample, liveSample, body.append, html.append, shadow.append|
|src/ui/component-library.js:647|detail|declaration|需要进一步测试|$, shadow?.replaceChildren, panel.replaceChildren, panel.append, create, (entry.sources ／／ []).join, getComputedStyle(document.body)         .getPropertyValue(entry.name)         .trim, getComputedStyle(document.body)         .getPropertyValue, getComputedStyle, CSS.supports, card.prepend, showPreview, $("#componentLibraryList").querySelectorAll, button.setAttribute, String|
|src/ui/component-library.js:686|renderList|declaration|需要进一步测试|$("#componentLibrarySearch").value.trim().toLowerCase, $("#componentLibrarySearch").value.trim, $, entries().filter, entries, [e.name, e.category, ...(e.sources ／／ [])]         .join(" ")         .toLowerCase()         .includes, [e.name, e.category, ...(e.sources ／／ [])]         .join(" ")         .toLowerCase, [e.name, e.category, ...(e.sources ／／ [])]         .join, document.createDocumentFragment, create, button.append, detail, fragment.append, $("#componentLibraryList").replaceChildren, shadow?.replaceChildren, $("#componentLibraryDetail").replaceChildren, list.find|
|src/ui/component-library.js:703|button.onclick|assignment|需要进一步测试|detail|
|src/ui/component-library.js:722|ensureRoot|declaration|需要进一步测试|create, document.body.append, root.firstElementChild.append, root.querySelector, root.addEventListener, close, $, renderList, detail, $("#componentLibraryExpand").setAttribute, String, nodeIndex|
|src/ui/component-library.js:735|$("#componentLibraryMode").onchange|assignment|需要进一步测试|renderList|
|src/ui/component-library.js:739|$("#componentLibraryTheme").onchange|assignment|需要进一步测试|detail|
|src/ui/component-library.js:743|$("#componentLibraryExpand").onclick|assignment|需要进一步测试|$("#componentLibraryExpand").setAttribute, $, String, detail|
|src/ui/component-library.js:754|$("#componentLibraryRefresh").onclick|assignment|需要进一步测试|nodeIndex, renderList|
|src/ui/component-library.js:760|open|declaration|需要进一步测试|ensureRoot, nodeIndex, showClassroomWindow, renderList, requestAnimationFrame, $("#componentLibrarySearch")?.focus, $|
|src/ui/component-library.js:770|close|declaration|需要进一步测试|hideClassroomWindow, root.classList.remove, shadow?.replaceChildren, $("#componentLibraryDetail").replaceChildren, $|
|src/ui/component-library.js:780|mount|declaration|需要进一步测试|host.querySelector, create, host.append, details.querySelector|
|src/ui/content-bank-editor.js:11|render|declaration|需要进一步测试|$, getBank, [         "knowledge",         "challenges",       ]         .map(           (kind) =>             <section><h4>${kind === "knowledge" ? "知识卡片" : "课堂挑战"}</h4>${               getBank()[kind].length                 ? getBank()                     [kind].map(                       (row, index) =>                         <div class="ui-settings-row"><div><b>${E(row.title)}</b><p class="ui-muted">${E(row.subject)} · ${E(row.id)}</p></div><div class="ui-toolbar"><button class="btn btn-sm" data-bank-edit="${kind}" data-index="${index}">编辑</button><button class="btn btn-sm btn-danger" data-bank-delete="${kind}" data-index="${index}">删除</button></div></div>,                     )                     .join("")                 : '<p class="ui-muted">暂无内容，点击上方按钮添加。</p>'             }</section>,         )         .join, [         "knowledge",         "challenges",       ]         .map, getBank()                     [kind].map(                       (row, index) =>                         <div class="ui-settings-row"><div><b>${E(row.title)}</b><p class="ui-muted">${E(row.subject)} · ${E(row.id)}</p></div><div class="ui-toolbar"><button class="btn btn-sm" data-bank-edit="${kind}" data-index="${index}">编辑</button><button class="btn btn-sm btn-danger" data-bank-delete="${kind}" data-index="${index}">删除</button></div></div>,                     )                     .join, getBank()                     [kind].map, E, host         .querySelectorAll("[data-bank-add]")         .forEach, host         .querySelectorAll, edit, host         .querySelectorAll("[data-bank-edit]")         .forEach, Number, host.querySelectorAll("[data-bank-delete]").forEach, host.querySelectorAll, themeConfirm, JSON.parse, JSON.stringify, next[kind].filter, saveContentBank, Error, file.text|
|src/ui/content-bank-editor.js:35|button.onclick|assignment|需要进一步测试|edit|
|src/ui/content-bank-editor.js:41|button.onclick|assignment|需要进一步测试|edit, Number|
|src/ui/content-bank-editor.js:46|button.onclick|assignment|需要进一步测试|Number, getBank, themeConfirm, JSON.parse, JSON.stringify, next[kind].filter, saveContentBank, $|
|src/ui/content-bank-editor.js:68|$("#uiBankFile").onchange|assignment|需要进一步测试|Error, saveContentBank, JSON.parse, file.text, $|
|src/ui/content-bank-editor.js:82|edit|declaration|需要进一步测试|getSubject, getBank, $, fields.map(([key, label]) => <label class="ui-settings-row" for="uiBankField-${key}"><span>${label}</span><textarea class="ui-bank-field" style="width:65%;min-height:44px;resize:vertical" id="uiBankField-${key}" name="${key}" maxlength="10000" ${["id", "subject", "title", "source"].includes(key) ? "required" : ""}>${E(row[key] ／／ "")}</textarea></label>).join, fields.map, ["id", "subject", "title", "source"].includes, E, row.options.map((value, i) => <label class="ui-settings-row" for="uiBankOption-${i}"><span>选项 ${"ABCD"[i]}</span><input id="uiBankOption-${i}" name="option${i}" value="${E(value)}" maxlength="10000" required></label>).join, row.options.map, [0, 1, 2, 3].map((i) => <option value="${i}" ${row.answer === i ? "selected" : ""}>${"ABCD"[i]}</option>).join, [0, 1, 2, 3].map, host.replaceChildren, event.preventDefault, fields.forEach, String(data.get(key)).trim, String, data.get, String(data.get("option" + i)).trim, Number, JSON.parse, JSON.stringify, next[kind].push, saveContentBank, $("#uiBankField-title").focus|
|src/ui/content-bank-editor.js:115|$("#uiBankCancel").onclick|assignment|需要进一步测试|host.replaceChildren|
|src/ui/content-bank-editor.js:116|$("#uiBankRowForm").onsubmit|assignment|需要进一步测试|event.preventDefault, fields.forEach, String(data.get(key)).trim, String, data.get, [0, 1, 2, 3].map, String(data.get("option" + i)).trim, Number, JSON.parse, JSON.stringify, getBank, next[kind].push, saveContentBank, $|
|src/ui/contribution-registry.js:83|clone|binding|需要进一步测试|JSON.parse, JSON.stringify|
|src/ui/contribution-registry.js:84|equal|binding|需要进一步测试|JSON.stringify|
|src/ui/contribution-registry.js:85|fail|binding|需要进一步测试||
|src/ui/contribution-registry.js:89|assertSafeJson|declaration|需要进一步测试|fail, ["string", "number", "boolean"].includes, Number.isFinite, Array.isArray, value.forEach, assertSafeJson, Object.prototype.toString.call, Object.entries, EXECUTABLE_FIELD.test, /^on[a-z]+$/i.test|
|src/ui/contribution-registry.js:121|createContributionRegistry|declaration|需要进一步测试|pages.set, Object.freeze, /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*$/.test, fail, Array.isArray, assertSafeJson, clone, activations.set, activationsById.set, IDENTIFIER.test, input.localId.includes, KINDS.has, equal, input.requiredPermissions.some, activationRecord.permissions.has, Object.keys, DESCRIPTOR_FIELDS[input.kind].has, /^[a-z][a-zA-Z0-9_.-]{0,127}$/.test, ["card", "panel", "settings", "decoration"].includes, SLOTS.has, RENDERERS.has, [           "card",           "panel",           "settings",           "navigation",           "commandShortcut",           "viewPreset",           "decoration",         ].includes, ["builtin.dashboard-card", "builtin.notice"].includes, ["builtin.plugin-workspace", "builtin.notice"].includes, ["navigation", "viewPreset"].includes, activations.get, batch.map, validateContribution, stagedIds.has, contributions.has, stagedIds.add, pages.has, stagedRoutes.has, stagedRoutes.add, contributions.set, activationRecord.ids.add, staged.map, activationsById.get, contributions.get, pages.delete, contributions.delete, record.ids.clear, [...contributions.values()]         .filter((item) => item.pluginId === pluginId)         .map, [...contributions.values()]         .filter, contributions.values, [...pages.values()].map, pages.values, pages.get, root.switchView|
|src/ui/contribution-registry.js:148|activate|declaration|需要进一步测试|/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*$/.test, fail, Array.isArray, assertSafeJson, Object.freeze, clone, activations.set, activationsById.set|
|src/ui/contribution-registry.js:182|validateContribution|declaration|需要进一步测试|Array.isArray, fail, IDENTIFIER.test, input.localId.includes, KINDS.has, equal, input.requiredPermissions.some, activationRecord.permissions.has, assertSafeJson, clone, Object.keys, DESCRIPTOR_FIELDS[input.kind].has, /^[a-z][a-zA-Z0-9_.-]{0,127}$/.test, ["card", "panel", "settings", "decoration"].includes, SLOTS.has, RENDERERS.has, [           "card",           "panel",           "settings",           "navigation",           "commandShortcut",           "viewPreset",           "decoration",         ].includes, ["builtin.dashboard-card", "builtin.notice"].includes, ["builtin.plugin-workspace", "builtin.notice"].includes, ["navigation", "viewPreset"].includes|
|src/ui/contribution-registry.js:326|register|declaration|需要进一步测试|activations.get, fail, Array.isArray, batch.map, validateContribution, stagedIds.has, contributions.has, stagedIds.add, pages.has, stagedRoutes.has, stagedRoutes.add, contributions.set, pages.set, activationRecord.ids.add, Object.freeze, staged.map|
|src/ui/contribution-registry.js:360|dispose|declaration|需要进一步测试|activationsById.get, contributions.get, pages.delete, contributions.delete, record.ids.clear|
|src/ui/contribution-registry.js:374|listByPlugin|declaration|需要进一步测试|[...contributions.values()]         .filter((item) => item.pluginId === pluginId)         .map, [...contributions.values()]         .filter, contributions.values|
|src/ui/contribution-registry.js:379|listPages|declaration|需要进一步测试|[...pages.values()].map, pages.values|
|src/ui/contribution-registry.js:382|resolvePage|declaration|需要进一步测试|pages.get, clone|
|src/ui/contribution-registry.js:386|navigate|declaration|需要进一步测试|pages.get, Object.freeze, root.switchView, clone|
|src/ui/desktop.js:5|$|binding|需要进一步测试|document.querySelector|
|src/ui/desktop.js:45|icon|declaration|需要进一步测试|GodpowerTheme.icon|
|src/ui/desktop.js:48|empty|declaration|需要进一步测试|icon, E|
|src/ui/desktop.js:51|persistPreferences|declaration|需要进一步测试|localStorage.setItem, JSON.stringify, showToast|
|src/ui/desktop.js:63|applyPreferences|declaration|需要进一步测试|GodpowerTheme.cancel, settleDisclosures, cancelSettingsMotion, ClassroomFeedback.cancel, BattleMotion.clear, window.WelcomeV2?.preferencesChanged, String, canAnimate, cancelItemScoreAnimations, cancelScoreAnimationAndSync, cancelAnimations, document.getAnimations().forEach, document.getAnimations, a.cancel|
|src/ui/desktop.js:80|canAnimate|declaration|需要进一步测试|matchMedia|
|src/ui/desktop.js:89|motionEase|declaration|需要进一步测试|getComputedStyle(document.documentElement)       .getPropertyValue("--motion-ease")       .trim, getComputedStyle(document.documentElement)       .getPropertyValue, getComputedStyle|
|src/ui/desktop.js:94|animate|declaration|需要进一步测试|canAnimate, el.animate, motionEase, animations.add, a.finished.catch(() => {}).finally, a.finished.catch, animations.delete|
|src/ui/desktop.js:106|cancelAnimations|declaration|需要进一步测试|BattleMotion.clear, observeVisualState, cancelAnimationFrame, settleDisclosures, cancelSettingsMotion, a.cancel, animations.clear, document.querySelectorAll("#groupList .group-row-card").forEach, document.querySelectorAll, clearCardFx, clearAttackHitFxV2116, document       .querySelectorAll(".card-fx-badge,.attack-hit-badge")       .forEach, document       .querySelectorAll, el.remove, document.querySelectorAll(".ui-fx-layer").forEach, x.remove|
|src/ui/desktop.js:125|visualEvent|declaration|需要进一步测试|document.dispatchEvent, BattleMotion.event|
|src/ui/desktop.js:133|syncViewport|declaration|需要进一步测试|Number, getComputedStyle, document.body.style.setProperty|
|src/ui/desktop.js:149|viewChanged|declaration|需要进一步测试|globalThis.HandItemCinematic?.dismiss, window.GodPowerPageLifecycle?.enter, ClassroomFeedback.cancel, BattleMotion.clear, cancelItemScoreAnimations, cancelScoreAnimationAndSync, window.WelcomeV2?.viewChanged, [...openStack].reverse, ["themeDialogV21727", "grandModalOverlay", "welcomeModal"].includes, m.close, $, document.querySelectorAll(".nav-tab").forEach, document.querySelectorAll, b.setAttribute, String, $(".ui-dock-menu")?.removeAttribute, $(".dock-humor-tip")?.classList.remove, cancelAnimations, [           ...host.querySelectorAll(selectors[name] ／／ ":scope"),         ].slice, host.querySelectorAll, targets.forEach, animate, Math.min, pageScope.animation, pageScope.frame, requestAnimationFrame, renderWelcome, selectSettings|
|src/ui/desktop.js:184|enterPage|binding|需要进一步测试|$, [           ...host.querySelectorAll(selectors[name] ／／ ":scope"),         ].slice, host.querySelectorAll, targets.forEach, animate, Math.min, pageScope.animation|
|src/ui/desktop.js:226|renderWelcome|declaration|需要进一步测试|$, syncViewport, observeVisualState, canAnimate, document.getAnimations().forEach, document.getAnimations, a.cancel, [...groups].sort, Number, Date.now, JSON.stringify, groups.map, groups             .map((g) => {               const item = g.inventory?.[0],                 states = Object.entries(g.itemEffect ／／ {})                   .filter(                     ([k, v]) =>                       (k === "type" && !!v) ／／                       (["iceLock", "featherDodge"].includes(k) &&                         Number(v) > 0),                   )                   .map(                     ([k, v]) =>                       ({                         bullet: "炮弹追击",                         featherDodge: "羽毛闪避",                         star: "无敌星",                         mega: "巨大蘑菇",                         boo: "幽灵保护",                         ice: "冻结",                         power: "强力蘑菇",                         feather: "羽毛",                       })[k === "type" ? v : k] ／／                       (k === "iceLock" ? "冻结" : k),                   );               if (g.booShield > 0 ／／ g.booRoundsLeftV218 > 0)                 states.push("幽灵保护");               return <button class="ui-group-card" data-group="${Number(g.id)}" style="--group-color:${/^#[a-f\d]{3,8}$/i.test(g.color) ? g.color : "#0f766e"}" aria-label="查看${E(g.name)}的小组详情"><span class="ui-chip">第 ${E(g.groupNo ／／ groups.indexOf(g) + 1)} 组</span><span class="ui-muted" style="float:right">排名 ${mask ? "—" : sorted.findIndex((x) => x.id === g.id) + 1}</span><span class="ui-group-title">${E(g.name)}</span><span class="ui-group-score">${mask ? "???" : E(g.score)}</span><span class="ui-muted"> 分</span><footer>${item ? itemVisual(item.key) : icon("gift")}<span>${E(item ? ITEM_DEFS[item.key]?.name ／／ "未知道具" : "暂无主要道具")}</span></footer>${states.length ? <div class="ui-muted">${E(states.join(" · "))}</div> : ""}</button>;             })             .join, groups             .map, Object.entries(g.itemEffect ／／ {})                   .filter(                     ([k, v]) =>                       (k === "type" && !!v) ／／                       (["iceLock", "featherDodge"].includes(k) &&                         Number(v) > 0),                   )                   .map, Object.entries(g.itemEffect ／／ {})                   .filter, Object.entries, ["iceLock", "featherDodge"].includes, states.push, /^#[a-f\d]{3,8}$/i.test, E, groups.indexOf, sorted.findIndex, itemVisual, icon, states.join, empty, track         .querySelectorAll("[data-group]")         .forEach, track         .querySelectorAll, openItemWindow, requestAnimationFrame, renderDaily, window.WelcomeV2.render|
|src/ui/desktop.js:291|el.onclick|assignment|需要进一步测试|openItemWindow, Number|
|src/ui/desktop.js:300|updateArrows|declaration|需要进一步测试|$, t.classList.toggle|
|src/ui/desktop.js:310|observeVisualState|declaration|需要进一步测试|JSON.stringify, visualSnapshot.get, visualEvent, g.inventory.at, next.set|
|src/ui/desktop.js:352|renderDaily|declaration|需要进一步测试|$, getSettlementHistory, M.dayIndex, JSON.stringify, history.map, Object.keys, M.daily, bank.knowledge.filter, bank.challenges.filter, [       M.dayIndex(),       preferences.subject,       dailyOffsets.challenges,       quiz?.id,     ].join, E, itemVisual, quiz.options.map((o, i) => <button data-quiz-answer="${i}" aria-pressed="false">${"ABCD"[i]} · ${E(o)}</button>).join, quiz.options.map, String, Number, host.querySelectorAll, host.querySelector, renderDaily, host.querySelectorAll("[data-quiz-answer]").forEach, b.parentElement             .querySelectorAll("button")             .forEach, b.parentElement             .querySelectorAll, x.setAttribute, b.closest, card.querySelector, host         .querySelector([data-quiz-answer="${quizAttempt.answer}"])         ?.onclick, host         .querySelector|
|src/ui/desktop.js:414|next.onclick|assignment|需要进一步测试|renderDaily|
|src/ui/desktop.js:421|b.onclick|assignment|需要进一步测试|b.parentElement             .querySelectorAll("button")             .forEach, b.parentElement             .querySelectorAll, x.setAttribute, String, Number, b.closest, card.querySelector|
|src/ui/desktop.js:445|historyKind|declaration|需要进一步测试|/清零／恢复／撤销／回溯／删除/.test, /道具／攻击／龟壳／蘑菇/.test, /题／回合／答题／结算/.test, /成员／小组／名单/.test|
|src/ui/desktop.js:456|inventory|declaration|需要进一步测试|items         .map((i) => ${ITEM_DEFS[i.key]?.name ／／ i.key} ×${i.charges ?? 1})         .join, items         .map|
|src/ui/desktop.js:463|renderHistory|declaration|需要进一步测试|$, empty, historyStack       .map((h, i) => {         const next = historyStack[i + 1] ／／ state,           diffs = M.differences(h, next),           [kind, glyph, label] = historyKind(h.desc),           changed = diffs.filter(             (d) =>               d.delta ／／               d.added ／／               d.removed ／／               JSON.stringify(d.inventoryBefore) !==                 JSON.stringify(d.inventoryAfter) ／／               JSON.stringify(d.effectsBefore) !==                 JSON.stringify(d.effectsAfter),           );         return <article class="ui-panel ui-history" data-kind="${kind}" style="--record-index:'${String(i + 1).padStart(2, "0")}'"><details><summary><div><span class="ui-chip">${icon(glyph)} ${label}</span><h3>${E(h.desc ／／ "未命名操作")}</h3><span class="ui-muted">${E(h.time ／／ "未记录时间")} · ${E(changed.map((g) => g.name).join("、") ／／ "未发现可比较的小组变动")}</span></div><span class="ui-chip">${i === historyStack.length - 1 ? "最近操作前快照" : "查看快照"} ${icon("arrow")}</span></summary><div class="ui-snapshot-note">以下比较：此操作前快照 → ${i === historyStack.length - 1 ? "当前状态" : "下一条操作前快照"}。${i === historyStack.length - 1 ? "当前状态可能包含尚未记录的变化。" : "两次快照之间可能含未单独记录的操作。"}历史未保存的字段无法推断。</div><div class="ui-table-wrap"><table class="ui-table"><thead><tr><th>小组</th><th>积分变化</th><th>名次</th><th>道具队列</th><th>持续状态</th></tr></thead><tbody>${diffs.map((d) => <tr><td>${E(d.name)}${d.added ? "（新增）" : d.removed ? "（移除）" : ""}</td><td>${d.before ?? "—"} → ${d.after ?? "—"} <strong class="${d.delta > 0 ? "ui-positive" : d.delta < 0 ? "ui-negative" : ""}">${d.delta === null ? "" : (${d.delta > 0 ? "+" : ""}${d.delta})}</strong></td><td>${d.rankBefore ?? "—"} → ${d.rankAfter ?? "—"}</td><td>${E(inventory(d.inventoryBefore))} → ${E(inventory(d.inventoryAfter))}</td><td>${E(JSON.stringify(d.effectsBefore))} → ${E(JSON.stringify(d.effectsAfter))}</td></tr>).join("")}</tbody></table></div><p class="ui-muted">答题状态：${h.roundActive ? "答题中" : "未答题"} → ${next.roundActive ? "答题中" : "未答题"}；已结算：${h.evaluated ? "是" : "否"} → ${next.evaluated ? "是" : "否"}。名次按快照积分顺序展示，不改变比赛排序。</p><button class="btn btn-danger" data-restore="${i}">恢复此操作前的状态</button></details></article>;       })       .reverse()       .join, historyStack       .map((h, i) => {         const next = historyStack[i + 1] ／／ state,           diffs = M.differences(h, next),           [kind, glyph, label] = historyKind(h.desc),           changed = diffs.filter(             (d) =>               d.delta ／／               d.added ／／               d.removed ／／               JSON.stringify(d.inventoryBefore) !==                 JSON.stringify(d.inventoryAfter) ／／               JSON.stringify(d.effectsBefore) !==                 JSON.stringify(d.effectsAfter),           );         return <article class="ui-panel ui-history" data-kind="${kind}" style="--record-index:'${String(i + 1).padStart(2, "0")}'"><details><summary><div><span class="ui-chip">${icon(glyph)} ${label}</span><h3>${E(h.desc ／／ "未命名操作")}</h3><span class="ui-muted">${E(h.time ／／ "未记录时间")} · ${E(changed.map((g) => g.name).join("、") ／／ "未发现可比较的小组变动")}</span></div><span class="ui-chip">${i === historyStack.length - 1 ? "最近操作前快照" : "查看快照"} ${icon("arrow")}</span></summary><div class="ui-snapshot-note">以下比较：此操作前快照 → ${i === historyStack.length - 1 ? "当前状态" : "下一条操作前快照"}。${i === historyStack.length - 1 ? "当前状态可能包含尚未记录的变化。" : "两次快照之间可能含未单独记录的操作。"}历史未保存的字段无法推断。</div><div class="ui-table-wrap"><table class="ui-table"><thead><tr><th>小组</th><th>积分变化</th><th>名次</th><th>道具队列</th><th>持续状态</th></tr></thead><tbody>${diffs.map((d) => <tr><td>${E(d.name)}${d.added ? "（新增）" : d.removed ? "（移除）" : ""}</td><td>${d.before ?? "—"} → ${d.after ?? "—"} <strong class="${d.delta > 0 ? "ui-positive" : d.delta < 0 ? "ui-negative" : ""}">${d.delta === null ? "" : (${d.delta > 0 ? "+" : ""}${d.delta})}</strong></td><td>${d.rankBefore ?? "—"} → ${d.rankAfter ?? "—"}</td><td>${E(inventory(d.inventoryBefore))} → ${E(inventory(d.inventoryAfter))}</td><td>${E(JSON.stringify(d.effectsBefore))} → ${E(JSON.stringify(d.effectsAfter))}</td></tr>).join("")}</tbody></table></div><p class="ui-muted">答题状态：${h.roundActive ? "答题中" : "未答题"} → ${next.roundActive ? "答题中" : "未答题"}；已结算：${h.evaluated ? "是" : "否"} → ${next.evaluated ? "是" : "否"}。名次按快照积分顺序展示，不改变比赛排序。</p><button class="btn btn-danger" data-restore="${i}">恢复此操作前的状态</button></details></article>;       })       .reverse, historyStack       .map, M.differences, historyKind, diffs.filter, JSON.stringify, String(i + 1).padStart, String, icon, E, changed.map((g) => g.name).join, changed.map, diffs.map((d) => <tr><td>${E(d.name)}${d.added ? "（新增）" : d.removed ? "（移除）" : ""}</td><td>${d.before ?? "—"} → ${d.after ?? "—"} <strong class="${d.delta > 0 ? "ui-positive" : d.delta < 0 ? "ui-negative" : ""}">${d.delta === null ? "" : (${d.delta > 0 ? "+" : ""}${d.delta})}</strong></td><td>${d.rankBefore ?? "—"} → ${d.rankAfter ?? "—"}</td><td>${E(inventory(d.inventoryBefore))} → ${E(inventory(d.inventoryAfter))}</td><td>${E(JSON.stringify(d.effectsBefore))} → ${E(JSON.stringify(d.effectsAfter))}</td></tr>).join, diffs.map, inventory, host.querySelectorAll(".ui-history:nth-child(-n+8)").forEach, host.querySelectorAll, animate, host.querySelectorAll("[data-restore]").forEach, Number, themeConfirm, revertToHistory|
|src/ui/desktop.js:516|b.onclick|assignment|需要进一步测试|Number, themeConfirm, revertToHistory|
|src/ui/desktop.js:532|renderArchives|declaration|需要进一步测试|getSettlementHistory, records       .flatMap((x) => (Array.isArray(x.groups) ? x.groups : []))       .filter, records       .flatMap, Array.isArray, g.score.trim, Number.isFinite, Number, Math.max, all.map, $, [       ["已归档届数", records.length],       [         "最近冠军",         records[0]?.champion ／／ records[0]?.groups?.[0]?.name ／／ "暂无",       ],       ["历史最高积分", best ?? "暂无"],       ["最近归档", records[0]?.time ／／ "暂无"],     ]       .map(         ([t, v]) =>           <div class="ui-panel"><span class="ui-muted">${t}</span><strong>${E(v)}</strong></div>,       )       .join, [       ["已归档届数", records.length],       [         "最近冠军",         records[0]?.champion ／／ records[0]?.groups?.[0]?.name ／／ "暂无",       ],       ["历史最高积分", best ?? "暂无"],       ["最近归档", records[0]?.time ／／ "暂无"],     ]       .map, E, records       .map((r, index) => ({ r, index }))       .filter, records       .map, [r.title, r.champion, ...(r.groups ／／ []).map((g) => g.name)]           .join(" ")           .toLowerCase()           .includes, [r.title, r.champion, ...(r.groups ／／ []).map((g) => g.name)]           .join(" ")           .toLowerCase, [r.title, r.champion, ...(r.groups ／／ []).map((g) => g.name)]           .join, (r.groups ／／ []).map, archiveSearch.toLowerCase, list.reverse, list.sort, list           .map(({ r, index }) => {             const groups = Array.isArray(r.groups) ? r.groups : [];             return <article class="ui-panel ui-archive-card"><details><summary class="ui-archive-summary"><span class="ui-archive-emblem" aria-hidden="true">${icon("archive")}</span><div><span class="ui-eyebrow">CLASSROOM ARCHIVE · ${E(r.time ／／ "时间未记录")}</span><h3>${E(r.title ／／ "未命名比赛")}</h3><span class="ui-muted">${groups.length} 个归档小组 · 冠军 ${E(r.champion ／／ groups[0]?.name ／／ "未记录")}</span></div><span class="ui-chip">查看完整档案 ${icon("arrow")}</span></summary><div class="ui-podium">${groups               .slice(0, 3)               .map(                 (g, i) =>                   <div><span class="ui-chip">第 ${i + 1} 名${i === 0 ? " · 冠军" : ""}</span><strong>${E(g.name ／／ "未记录名称")}</strong><span>${E(g.score ?? "未记录")} 分</span></div>,               )               .join(                 "",               )}</div><div class="ui-table-wrap"><table class="ui-table"><thead><tr><th>原档案名次</th><th>小组</th><th>最终积分</th><th>成员</th><th>道具与答题统计</th></tr></thead><tbody>${groups.map((g, i) => <tr><td>${i + 1}</td><td>${E(g.name ／／ "未记录")}</td><td>${E(g.score ?? "未记录")}</td><td>${E((g.members ／／ []).join("、") ／／ "未记录")}</td><td>${E(g.itemStats ? JSON.stringify(g.itemStats) : "此版本未提供统计")}</td></tr>).join("")}</tbody></table></div><p class="ui-muted">名次沿用归档顺序；同分保留原始次序。缺少的旧档案字段不作推测。</p><details><summary>完整原始归档数据</summary><pre style="white-space:pre-wrap;overflow-wrap:anywhere;max-height:300px;overflow:auto">${E(JSON.stringify(r, null, 2))}</pre></details><div class="ui-archive-actions"><button class="btn btn-primary" data-csv="${index}">导出完整 CSV</button><button class="btn" data-json="${index}">导出原始 JSON</button><button class="btn btn-danger" data-delete="${index}">删除档案</button></div></details></article>;           })           .join, list           .map, icon, groups               .slice(0, 3)               .map(                 (g, i) =>                   <div><span class="ui-chip">第 ${i + 1} 名${i === 0 ? " · 冠军" : ""}</span><strong>${E(g.name ／／ "未记录名称")}</strong><span>${E(g.score ?? "未记录")} 分</span></div>,               )               .join, groups               .slice(0, 3)               .map, groups               .slice, groups.map((g, i) => <tr><td>${i + 1}</td><td>${E(g.name ／／ "未记录")}</td><td>${E(g.score ?? "未记录")}</td><td>${E((g.members ／／ []).join("、") ／／ "未记录")}</td><td>${E(g.itemStats ? JSON.stringify(g.itemStats) : "此版本未提供统计")}</td></tr>).join, groups.map, (g.members ／／ []).join, JSON.stringify, empty, host           .querySelectorAll(".ui-archive-card:nth-child(-n+8),.ui-empty")           .forEach, host           .querySelectorAll, animate, host       .querySelectorAll("[data-csv]")       .forEach, host       .querySelectorAll, exportSingleSettlementCSV, host       .querySelectorAll("[data-delete]")       .forEach, deleteSettlementRecord, host       .querySelectorAll("[data-json]")       .forEach, downloadJson|
|src/ui/desktop.js:625|b.onclick|assignment|需要进一步测试|exportSingleSettlementCSV, Number|
|src/ui/desktop.js:631|b.onclick|assignment|需要进一步测试|deleteSettlementRecord, Number|
|src/ui/desktop.js:637|b.onclick|assignment|需要进一步测试|downloadJson, Number|
|src/ui/desktop.js:641|downloadJson|declaration|需要进一步测试|URL.createObjectURL, JSON.stringify, document.createElement, a.click, setTimeout, URL.revokeObjectURL|
|src/ui/desktop.js:654|setupSettings|declaration|需要进一步测试|$, document.createElement, categories.map(([id, glyph, title]) => <button data-category="${id}">${icon(glyph)}${title}</button>).join, categories.map, icon, categories.map(([id, , title, desc]) => <section class="ui-settings-category" data-category-panel="${id}" hidden><header class="ui-settings-title"><h3>${title}</h3><div class="ui-muted">${desc}</div></header></section>).join, Object.fromEntries, [...shell.querySelectorAll("[data-category-panel]")].map, shell.querySelectorAll, installCommunismModeSetting, installSfxVolumeSliderV2176, installClearItemsSettingV2172, sc.querySelectorAll, pane.id.replace, (sections[id === "function" ? "rules" : id] ／／ sections.rules).append, pane.classList.add, sections[el.dataset.settingsCategory].append, sections.appearance.append, $("#settingsV26Tabs")?.remove, sc.append, sc.classList.add, shell       .querySelectorAll("[data-category]")       .forEach, shell       .querySelectorAll, selectSettings, sections.appearance.insertAdjacentHTML, sections.motion.insertAdjacentHTML, row, check, sections.welcome.insertAdjacentHTML, [         ["knowledge", "每日知识卡片"],         ["itemTip", "每日道具小知识"],         ["honors", "历史荣誉"],         ["challenge", "每日课堂挑战"],         ["groupCruise", "小组卡片连续巡航（默认开启）"],       ]         .map(([key, label]) => row(label, "uiPref-" + key, check(key)))         .join, [         ["knowledge", "每日知识卡片"],         ["itemTip", "每日道具小知识"],         ["honors", "历史荣誉"],         ["challenge", "每日课堂挑战"],         ["groupCruise", "小组卡片连续巡航（默认开启）"],       ]         .map, sections.data       .querySelector(".ui-settings-title")       .insertAdjacentHTML, sections.data       .querySelector, [...sections.data.querySelectorAll("button")].filter, sections.data.querySelectorAll, /resetAllScores／clear/.test, b.getAttribute, b.classList.remove, b.classList.add, String, refreshSubjects, JSON.stringify, shell.querySelectorAll("[data-pref]").forEach, Number, persistPreferences, applyPreferences, renderDaily, downloadJson, saveContentBank, JSON.parse, themeConfirm, localStorage.removeItem, renderBankEditor, GodPowerSettingsLayout.organize, installSettingsSafetyGuard, ClassroomRosterWorkspace.mount, sections.students.insertBefore, TeachingWorkspace.mount, TeachingResourceWorkspace.mount, GodpowerTheme.mount, UIComponentLibrary.mount, ItemModuleSettings.mount, bankBody.prepend|
|src/ui/desktop.js:689|b.onclick|assignment|需要进一步测试|selectSettings|
|src/ui/desktop.js:694|row|declaration|需要进一步测试||
|src/ui/desktop.js:697|check|binding|需要进一步测试||
|src/ui/desktop.js:757|el.onchange|assignment|需要进一步测试|Number, persistPreferences, applyPreferences, renderDaily|
|src/ui/desktop.js:771|$("#uiExportBank").onclick|assignment|需要进一步测试|downloadJson|
|src/ui/desktop.js:773|$("#uiSaveBank").onclick|assignment|需要进一步测试|saveContentBank, JSON.parse, $|
|src/ui/desktop.js:782|$("#uiResetBank").onclick|assignment|需要进一步测试|themeConfirm, localStorage.removeItem, renderBankEditor, $, JSON.stringify, refreshSubjects, renderDaily|
|src/ui/desktop.js:830|saveContentBank|declaration|需要进一步测试|M.validateBank, localStorage.setItem, JSON.stringify, $, refreshSubjects, renderDaily, renderBankEditor|
|src/ui/desktop.js:850|installSettingsSafetyGuard|declaration|需要进一步测试|document.addEventListener, event.target.closest, button?.getAttribute, event.preventDefault, event.stopImmediatePropagation, openPwdModal, themeConfirm, confirm[2]|
|src/ui/desktop.js:890|refreshSubjects|declaration|需要进一步测试|$, bank.knowledge.map, bank.challenges.map, subjects       .map(         (s) =>           <option value="${E(s)}">${E({ politics: "政治", history: "历史", geography: "地理", english: "英语" }[s] ／／ s)}</option>,       )       .join, subjects       .map, E, subjects.includes|
|src/ui/desktop.js:910|cancelSettingsMotion|declaration|需要进一步测试|animation.cancel, animations.delete, settingsAnimations.clear|
|src/ui/desktop.js:917|revealSettings|declaration|需要进一步测试|cancelSettingsMotion, canAnimate, $, [...panel.children]       .flatMap((node) =>         node.matches(".legacy-settings-pane") ? [...node.children] : [node],       )       .filter, [...panel.children]       .flatMap, node.matches, targets.forEach, animate, Math.min, settingsAnimations.add, animation.finished.then, settingsAnimations.delete|
|src/ui/desktop.js:958|selectSettings|declaration|需要进一步测试|$, categories.some, document       .querySelectorAll("[data-category-panel]")       .forEach, document       .querySelectorAll, document       .querySelectorAll(".ui-settings-nav button")       .forEach, b.setAttribute, String, renderBgmSlotList, renderFxSlotList, renderItemFxSoundListV26, TeachingWorkspace.refresh, TeachingResourceWorkspace.refresh, revealSettings|
|src/ui/desktop.js:988|setupDock|declaration|需要进一步测试|$, document.createElement, b.getAttribute, /globalItemDraw／openHandRaise／openPickerModal／undoLast/.test, /globalItemDraw/.test, /openHandRaise/.test, /openPickerModal/.test, /undoLast/.test, UI_ICON_TARGETS.find, b.matches, b.setAttribute, icon, E, /zoom/.test, /Lock/.test, /addGroup／Search/.test, menu.append, right.append, final.setAttribute, document.addEventListener, e.target.closest, e.preventDefault, e.stopImmediatePropagation|
|src/ui/desktop.js:1056|refreshLockControl|declaration|需要进一步测试|icon, Reliability.safeImage, uiIconsV26, button.setAttribute|
|src/ui/desktop.js:1108|setupModals|declaration|需要进一步测试|top.el.getClientRects, top.el.contains, [         ...top.el.querySelectorAll(           'input:not([type=hidden]),button,select,textarea,[tabindex="0"]',         ),       ].find, top.el.querySelectorAll, el.getClientRects, target.focus, document.addEventListener, openStack.at, focusModal, known.set, openStack.find, openStack.filter, item.el.style.setProperty, item.el.style.removeProperty, item.focus.focus, item.focus.closest, cancelAnimations, Object.entries, document.getElementById, known.get, forgetModal, el.hasAttribute, el.classList.contains, el.querySelector, surface.querySelectorAll, /取消／跳过／返回课堂/.test, surface.querySelector, document.createElement, button.setAttribute, surface.append, el.style.getPropertyValue, String, el.style.setProperty, openStack.push, dialog?.setAttribute, dialog.getAttribute, dialog.setAttribute, dialog.querySelector, dialog?.classList.add, Number, getComputedStyle, Math.min, Math.max, dialog.getBoundingClientRect, animate, canAnimate, stopConfetti, el.querySelectorAll(".podium-col").forEach, el.querySelectorAll, queueMicrotask, new MutationObserver(scan).observe, e.preventDefault, e.stopImmediatePropagation, top.close, [             ...top.el.querySelectorAll(               'button,input,select,textarea,a[href],[tabindex="0"]',             ),           ].filter, x.getClientRects, nodes.at, last.focus, first.focus, scan|
|src/ui/desktop.js:1110|focusModal|declaration|需要进一步测试|top.el.getClientRects, top.el.contains, [         ...top.el.querySelectorAll(           'input:not([type=hidden]),button,select,textarea,[tabindex="0"]',         ),       ].find, top.el.querySelectorAll, el.getClientRects, target.focus|
|src/ui/desktop.js:1131|forgetModal|declaration|需要进一步测试|known.set, openStack.find, openStack.filter, item.el.style.setProperty, item.el.style.removeProperty, openStack.at, top.el.contains, item.focus.focus, focusModal, item.focus.closest, cancelAnimations|
|src/ui/desktop.js:1154|scan|declaration|需要进一步测试|Object.entries, document.getElementById, known.get, openStack.find, forgetModal, el.hasAttribute, el.classList.contains, el.getClientRects, el.querySelector, surface.querySelectorAll, /取消／跳过／返回课堂/.test, surface.querySelector, document.createElement, button.setAttribute, surface.append, known.set, el.style.getPropertyValue, String, el.style.setProperty, openStack.push, dialog?.setAttribute, dialog.getAttribute, dialog.setAttribute, dialog.querySelector, dialog?.classList.add, Number, getComputedStyle, Math.min, Math.max, dialog.getBoundingClientRect, animate, canAnimate, stopConfetti, el.querySelectorAll(".podium-col").forEach, el.querySelectorAll, queueMicrotask, openStack.at, focusModal|
|src/ui/desktop.js:1331|clearPickerReveal|declaration|需要进一步测试|$("#pickerModal")?.removeAttribute, $, pickerReelRestores.splice, restore|
|src/ui/desktop.js:1336|cancelPickerPreparation|declaration|需要进一步测试|clearPickerReveal, ClassroomFeedback.clearLive, ClassroomFeedback.cancel, BattleMotion.clear, $, button.removeAttribute, modal?.contains, a.cancel|
|src/ui/desktop.js:1353|isPickerCurrent|declaration|需要进一步测试|$("#pickerModal").classList.contains, $|
|src/ui/desktop.js:1359|togglePicker|declaration|需要进一步测试|stopSlotSpin, $, button.setAttribute, toggleSlotSpin, showToast, button.removeAttribute|
|src/ui/desktop.js:1386|pickerStopped|declaration|需要进一步测试|$, modal.classList.contains, clearPickerReveal, isPickerCurrent, button.removeAttribute, pickerChanged, window.GodpowerPicker?.notify, ClassroomFeedback.picked, canAnimate, globalThis.HandItemCinematic?.dismiss, ClassroomFeedback.clearLive, complete, button.setAttribute, modal.querySelectorAll(".slot-reel-frame").forEach, modal.querySelectorAll, frame.getClientRects, frame.querySelector, ClassroomFeedback.takeLive, state.groups.map, state.groups.flatMap, (g.members ／／ []).map, document.createElement, strip.setAttribute, Math.max, row.append, node.cloneNode, studentLabelHTMLV218, strip.append, pendingActual.push, frame.append, pickerReelRestores.push, strip.remove, animate, pending.push, a.finished.catch, pendingActual.forEach, Promise.all(pending).then, Promise.all|
|src/ui/desktop.js:1395|complete|binding|需要进一步测试|isPickerCurrent, clearPickerReveal, button.removeAttribute, pickerChanged, window.GodpowerPicker?.notify, ClassroomFeedback.picked|
|src/ui/desktop.js:1485|pickerChanged|declaration|需要进一步测试|pickerTargetGroup, state.groups.some, document       .querySelectorAll('#pickerModal button[onclick^="scorePicker"]')       .forEach, document       .querySelectorAll, animate, $|
|src/ui/desktop.js:1505|setupPicker|declaration|需要进一步测试|$, left.append, right.append, stats.removeAttribute, new MutationObserver(pickerChanged).observe, pickerChanged|
|src/ui/desktop.js:1528|prepareSettlement|declaration|需要进一步测试|$|
|src/ui/desktop.js:1533|cancelSettlement|declaration|需要进一步测试||
|src/ui/desktop.js:1536|settleFromUI|declaration|需要进一步测试|button.setAttribute, $, requestAnimationFrame, $("#settlementNameModal").classList.contains, confirmFinalSettlement, button.removeAttribute|
|src/ui/desktop.js:1571|init|declaration|需要进一步测试|JSON.parse, localStorage.getItem, Object.keys, ["full", "simple", "off"].includes, [0.75, 1, 1.5].includes, M.validateBank, console.warn, applyPreferences, syncViewport, window.addEventListener, matchMedia("(prefers-reduced-motion: reduce)").addEventListener, matchMedia, canAnimate, cancelAnimations, document.addEventListener, cancelSettingsMotion, document.querySelectorAll(".nav-tab").forEach, document.querySelectorAll, icon, b.setAttribute, setupDock, UI_ICON_TARGETS.forEach, $, applyUiIconsV26, setupSettings, setupPicker, setupModals, ClassroomFeedback.init, setupDisclosures, $("#settlementHistoryContainer").addEventListener, details.contains, a.cancel, details.querySelectorAll(".ui-podium>div").forEach, details.querySelectorAll, animate, t.addEventListener, Math.abs, Math.max, Math.min, e.preventDefault, t.scrollBy, new ResizeObserver(updateArrows).observe, renderArchives, viewChanged, renderWelcome, renderHistory, document         .querySelectorAll(           ".ui-welcome-head,.ui-group-card,.ui-daily-grid .ui-panel",         )         .forEach, document         .querySelectorAll|
|src/ui/desktop.js:1672|$("#uiGroupPrev").onclick|assignment|需要进一步测试|t.scrollBy, canAnimate|
|src/ui/desktop.js:1674|$("#uiGroupNext").onclick|assignment|需要进一步测试|t.scrollBy, canAnimate|
|src/ui/desktop.js:1677|$("#uiArchiveSearch").oninput|assignment|需要进一步测试|renderArchives|
|src/ui/desktop.js:1681|$("#uiArchiveSort").onchange|assignment|需要进一步测试|renderArchives|
|src/ui/desktop.js:1714|$("#uiSkipWelcome").onclick|assignment|需要进一步测试|cancelAnimations|
|src/ui/disclosure-motion.js:7|settleDisclosure|declaration|需要进一步测试|disclosureMotions.get, disclosureMotions.delete, entry.animation?.cancel|
|src/ui/disclosure-motion.js:15|settleDisclosures|declaration|需要进一步测试|disclosureMotions.keys, settleDisclosure|
|src/ui/disclosure-motion.js:18|setupDisclosures|declaration|需要进一步测试|GodPowerDisposableScope.createDisposableScope, scope.listen, event.target.closest, details.classList.contains, canAnimate, event.preventDefault, getPreferences, disclosureMotions.get, details.getBoundingClientRect, settleDisclosure, disclosureMotions.set, animate, entry.animation.finished.then, finish|
|src/ui/disclosure-motion.js:60|finish|binding|需要进一步测试|disclosureMotions.get, settleDisclosure|
|src/ui/disposable-scope.js:5|createDisposableScope|declaration|需要进一步测试|cleanups.indexOf, cleanups.splice, cleanup, entry, cleanups.push, removeCleanup, release, listener.call, listener?.handleEvent, target.addEventListener, add, target.removeEventListener, setTimeout, callback, clearTimeout, requestAnimationFrame, cancelAnimationFrame, observer.disconnect, observer.observe, animation.cancel, animation.finished.then, childScope.dispose, abortController.abort, errors.push, cleanups.splice(0).reverse, Object.freeze|
|src/ui/disposable-scope.js:10|removeCleanup|declaration|需要进一步测试|cleanups.indexOf, cleanups.splice|
|src/ui/disposable-scope.js:15|add|declaration|需要进一步测试|cleanup, entry, cleanups.push, removeCleanup|
|src/ui/disposable-scope.js:19|entry|binding|需要进一步测试|cleanup|
|src/ui/disposable-scope.js:35|listen|declaration|需要进一步测试|release, listener.call, listener?.handleEvent, target.addEventListener, add, target.removeEventListener|
|src/ui/disposable-scope.js:60|timeout|declaration|需要进一步测试|setTimeout, release, callback, add, clearTimeout|
|src/ui/disposable-scope.js:73|frame|declaration|需要进一步测试|requestAnimationFrame, release, callback, add, cancelAnimationFrame|
|src/ui/disposable-scope.js:86|observe|declaration|需要进一步测试|observer.disconnect, observer.observe, add|
|src/ui/disposable-scope.js:99|animation|declaration|需要进一步测试|animation.cancel, add, animation.finished.then|
|src/ui/disposable-scope.js:111|child|declaration|需要进一步测试|add, childScope.dispose|
|src/ui/disposable-scope.js:118|dispose|declaration|需要进一步测试|abortController.abort, errors.push, cleanups.splice(0).reverse, cleanups.splice, cleanup|
|src/ui/disposable-scope.js:159|createPageLifecycle|declaration|需要进一步测试|Object.freeze, previous.dispose, onDisposeError, createDisposableScope|
|src/ui/disposable-scope.js:167|enter|declaration|需要进一步测试|Object.freeze, previous.dispose, onDisposeError, createDisposableScope|
|src/ui/disposable-scope.js:184|dispose|declaration|需要进一步测试|previous.dispose, onDisposeError|
|src/ui/electron-host.js:61|publish|binding|需要进一步测试|GodpowerPicker.getSnapshot, hand?.getSnapshot, JSON.stringify, playSound, desktop.publish|
|src/ui/home-dashboard.js:43|SIZE|binding|需要进一步测试||
|src/ui/home-dashboard.js:71|moveIntoGrid|declaration|需要进一步测试|document.getElementById, welcome?.querySelector, welcome.querySelector, document.createElement, grid.setAttribute, first.before, grid.contains, grid.append|
|src/ui/home-dashboard.js:89|defaultLayout|declaration|需要进一步测试|() => {       let sequence = 0;       return () => home-card-${++sequence};     }, root.HomeLayout.createDefaultLayout|
|src/ui/home-dashboard.js:102|completeLegacyLayout|declaration|需要进一步测试|layout.instances.map, root.HomeLayout.validateLayout|
|src/ui/home-dashboard.js:118|createToolbar|declaration|需要进一步测试|document.getElementById, document.createElement, grid.before, toolbar.addEventListener, grid.addEventListener, document.addEventListener|
|src/ui/home-dashboard.js:139|setStatus|declaration|需要进一步测试|document.getElementById, clearTimeout, setTimeout|
|src/ui/home-dashboard.js:152|setToolbarMode|declaration|需要进一步测试|document.body.classList.toggle, document.getElementById, toolbar?.querySelectorAll("[data-home-action]").forEach, toolbar?.querySelectorAll, setStatus, document         .getElementById("homeDashboardAddPanel")         ?.setAttribute, document         .getElementById, renderEditorControls|
|src/ui/home-dashboard.js:174|renderEditorControls|declaration|需要进一步测试|gridElement       .querySelectorAll(".home-card-editor-controls")       .forEach, gridElement       .querySelectorAll, node.remove, gridElement.querySelectorAll, document.createElement, node.getAttribute, node.append, renderAddPanel|
|src/ui/home-dashboard.js:191|renderAddPanel|declaration|需要进一步测试|document.getElementById, panel.replaceChildren, layoutService.getDraft, draft.instances.map, TYPES.filter, current.has, document.createElement, panel.append, draft.instances.filter|
|src/ui/home-dashboard.js:224|refreshDraft|declaration|需要进一步测试|applyLayout, layoutService.getDraft, renderEditorControls|
|src/ui/home-dashboard.js:229|beginEdit|declaration|需要进一步测试|root.HomeLayout.createLayoutService, setToolbarMode|
|src/ui/home-dashboard.js:239|cancelEdit|declaration|需要进一步测试|layoutService.cancel, applyLayout, layoutService.getSaved, setToolbarMode, setStatus|
|src/ui/home-dashboard.js:247|saveEdit|declaration|需要进一步测试|layoutService?.getDraft, Math.max, repository.write, setStatus, applyLayout, setToolbarMode|
|src/ui/home-dashboard.js:269|resetDraft|declaration|需要进一步测试|defaultLayout, layoutService.replaceDraft, refreshDraft, setStatus|
|src/ui/home-dashboard.js:280|toggleAddPanel|declaration|需要进一步测试|document.getElementById, panel.querySelector("button")?.focus, panel.querySelector|
|src/ui/home-dashboard.js:287|onToolbarClick|declaration|需要进一步测试|event.target.closest, layoutService.hide, refreshDraft, document.getElementById, beginEdit, layoutService.undo, layoutService.redo, toggleAddPanel, resetDraft, cancelEdit, saveEdit|
|src/ui/home-dashboard.js:322|onAddCardClick|declaration|需要进一步测试|event.target.closest, layoutService.add, refreshDraft, document.getElementById, setStatus|
|src/ui/home-dashboard.js:331|onGridClick|declaration|需要进一步测试|event.target.closest, layoutService.hide, refreshDraft, layoutService.remove, layoutService         .getDraft()         .instances.find, layoutService         .getDraft, layoutService.resize|
|src/ui/home-dashboard.js:366|onGridKeydown|declaration|需要进一步测试|event.target.matches, event.preventDefault, event.stopPropagation, layoutService       .getDraft()       .instances.find, layoutService       .getDraft, layoutService.move, refreshDraft, gridElement       .querySelector(         [data-instance-id="${item.instanceId}"].home-card-drag-handle,       )       ?.focus, gridElement       .querySelector|
|src/ui/home-dashboard.js:395|onGridPointerDown|declaration|需要进一步测试|event.target.closest, layoutService       .getDraft()       .instances.find, layoutService       .getDraft, event.preventDefault, handle.setPointerCapture|
|src/ui/home-dashboard.js:419|onDocumentPointerMove|declaration|需要进一步测试|Math.abs|
|src/ui/home-dashboard.js:429|onDocumentPointerUp|declaration|需要进一步测试|layoutService.move, Math.round, layoutService.resize, refreshDraft|
|src/ui/home-dashboard.js:457|onEscape|declaration|需要进一步测试|document.getElementById, event.preventDefault, document.querySelector('[data-home-action="add"]')?.focus, document.querySelector|
|src/ui/home-dashboard.js:469|bindLegacyNodes|declaration|需要进一步测试|selector.startsWith, selector.slice, [...grid.querySelectorAll(".gp-kpi")].find, grid.querySelectorAll, card.querySelector, grid.querySelector, grid.querySelectorAll(".gp-kpi").forEach, node.querySelector, TYPES.find, TYPES.filter(([, selector]) => selector.startsWith(".gp-daily-")).map, TYPES.filter, dailyTypes.has, daily.contains, node.remove, node.matches, node.classList.add, grid.append|
|src/ui/home-dashboard.js:516|applyLayout|declaration|需要进一步测试|root.HomeLayout.validateLayout, validated.instances.map, grid.querySelectorAll("[data-home-card-type]").forEach, grid.querySelectorAll, node.setAttribute, byType.get, node.style.setProperty, Math.min, [...grid.querySelectorAll("[data-home-card-type]")].indexOf, node.classList.add, String|
|src/ui/home-dashboard.js:548|refreshCards|declaration|需要进一步测试|bindLegacyNodes, applyLayout, renderEditorControls|
|src/ui/home-dashboard.js:555|init|declaration|需要进一步测试|moveIntoGrid, createToolbar, bindLegacyNodes, root.HomeLayoutRepository.createHomeLayoutRepository, repository.read, applyLayout, defaultLayout, completeLegacyLayout, renderEditorControls, grid.querySelector, observer.observe|
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
|src/ui/item-score-cinematics.js:7|mark|declaration|需要进一步测试||
|src/ui/item-score-cinematics.js:10|take|declaration|需要进一步测试||
|src/ui/item-score-cinematics.js:15|dismiss|declaration|需要进一步测试|clearTimeout, dialog.close, dialog.remove, priorFocus.focus|
|src/ui/item-score-cinematics.js:27|payload|declaration|需要进一步测试|itemIconDataUrl, targets.slice(0, 16).map, targets.slice, String, Number.isSafeInteger|
|src/ui/item-score-cinematics.js:48|present|declaration|需要进一步测试|dismiss, DesktopUI.getPreferences, ItemModules.feedback, payload, window.godpowerDesktop.showItemFx, globalThis.randomEffectStyle, document.createElement, dialog.setAttribute, escapeHtml, itemVisual, dialog.querySelector, dialog.addEventListener, e.preventDefault, document.body.append, setTimeout, dialog.showModal, next|
|src/ui/item-score-cinematics.js:87|next|binding|需要进一步测试|dialog.querySelector, escapeHtml, setTimeout|
|src/ui/item-score-cinematics.js:116|enabled|declaration|需要进一步测试|DesktopUI.getPreferences, matchMedia|
|src/ui/item-score-cinematics.js:126|remove|declaration|需要进一步测试|session.nodes?.forEach, n.remove, session.hidden?.classList.remove|
|src/ui/item-score-cinematics.js:130|mount|declaration|需要进一步测试|remove, card.querySelector, card.getBoundingClientRect, score.getBoundingClientRect, document.createElement, score.classList.add, card.append, Math.max, performance.now, layer.animate, number.animate, sessions.get, String, Math.min, Math.pow, Math.round, requestAnimationFrame|
|src/ui/item-score-cinematics.js:190|update|binding|需要进一步测试|sessions.get, String, Math.min, Math.max, performance.now, Math.pow, Math.round, requestAnimationFrame|
|src/ui/item-score-cinematics.js:206|finish|declaration|需要进一步测试|sessions.get, String, sessions.delete, remove, state.groups.find, document.getElementById, itemScoreDisplayHoldV21732.delete, renderChart, renderDashboard, updateHeaderStats, session.done|
|src/ui/item-score-cinematics.js:220|play|declaration|需要进一步测试|done, state.groups.find, enabled, sessions.get, String, clearTimeout, finish, itemScoreDisplayHoldV21732.delete, document.getElementById, remove, prior.done, GodpowerUIModel.badgeColors, color.background.slice, [0, 2, 4]         .map((i) => parseInt(raw.slice(i, i + 2), 16) / 255)         .map, [0, 2, 4]         .map, parseInt, raw.slice, performance.now, sessions.set, itemScoreDisplayHoldV21732.set, mount, document.querySelector, setTimeout|
|src/ui/item-score-cinematics.js:278|restore|declaration|需要进一步测试|sessions.get, String, mount|
|src/ui/item-score-cinematics.js:282|cancel|declaration|需要进一步测试|sessions.values, clearTimeout, finish|
|src/ui/migration.js:15|element|binding|需要进一步测试|document.getElementById|
|src/ui/migration.js:16|status|declaration|需要进一步测试|element|
|src/ui/migration.js:22|refresh|declaration|需要进一步测试|element, element("v3MigrationTools").setAttribute, String|
|src/ui/migration.js:28|available|declaration|需要进一步测试|showToast, openPwdModal, classroomCommands.isPending|
|src/ui/migration.js:53|inspect|declaration|需要进一步测试|available, refresh, status, coordinator.preview, preview.conflicts.join|
|src/ui/migration.js:79|stage|declaration|需要进一步测试|available, refresh, status, coordinator.execute, result.conflicts?.join, result.integrity?.failures.join|
|src/ui/migration.js:116|download|declaration|需要进一步测试|URL.createObjectURL, JSON.stringify, document.createElement, link.click, setTimeout, URL.revokeObjectURL|
|src/ui/migration.js:127|init|declaration|需要进一步测试|element, element("v3MigrationInspect").addEventListener, element("v3MigrationStage").addEventListener, element("v3MigrationDownload").addEventListener, window.addEventListener, cancellation?.abort, refresh|
|src/ui/model.js:60|dayIndex|declaration|需要进一步测试|Math.floor, Date.UTC, d.getFullYear, d.getMonth, d.getDate|
|src/ui/model.js:65|daily|declaration|需要进一步测试|dayIndex|
|src/ui/model.js:73|differences|declaration|需要进一步测试|(before.groups ／／ []).map, (after.groups ／／ []).map, [...groups]           .sort((x, y) => Number(y.score) - Number(x.score))           .map, [...groups]           .sort, Number, rank, [...new Set([...a.keys(), ...b.keys()])].map, a.keys, b.keys, a.get, b.get, ra.get, rb.get|
|src/ui/model.js:76|rank|binding|需要进一步测试|[...groups]           .sort((x, y) => Number(y.score) - Number(x.score))           .map, [...groups]           .sort, Number|
|src/ui/model.js:112|validateBank|declaration|需要进一步测试|Array.isArray, Error, row.id.trim, row.title.trim, row.subject.trim, row.source.trim, ids.has, ids.add, Object.values(row).some, Object.values, q.options.some, x.trim, Number.isInteger|
|src/ui/model.js:163|standings|declaration|需要进一步测试|ordered.map, Number, scores.every, scores.reduce((sum, value) => sum + BigInt(value), 0n).toString, scores.reduce, BigInt, String|
|src/ui/model.js:176|badgeColors|declaration|需要进一步测试|String(color ／／ "").replace, String, raw         .split("")         .map((v) => v + v)         .join, raw         .split("")         .map, raw         .split, /^[a-f0-9]{6}$/i.test, raw       .match(/../g)       .map((v) => parseInt(v, 16) / 255)       .map, raw       .match(/../g)       .map, raw       .match, parseInt, linear.reduce|
|src/ui/render.js:4|renderAll|declaration|需要进一步测试|clearTimeout, setTimeout, refreshPages|
|src/ui/render.js:23|refreshPages|declaration|需要进一步测试|renderLockStatus, renderControls, renderGrid, updateHeaderStats, renderChart, renderDashboard, updateResizerUI, renderWelcomePage, updateWelcomeTrackIfNeeded|
|src/ui/render.js:35|renderGrid|declaration|需要进一步测试|applyHeldDisplayScoresV21732, setTimeout, refreshBattleGrid, restoreHeldScoreElementsV21732|
|src/ui/render.js:53|refreshBattleGrid|declaration|需要进一步测试|renderBattleGridCards, decorateBattleRanks, decorateRoundItemLocks, renderBattleRankPreviewV21721, console.warn|
|src/ui/round-feedback.js:3|afterPowerRound|declaration|需要进一步测试|powerBefore       .filter((answer) => answer.answered && answer.correct)       .map((answer) => state.groups.find((group) => group.id === answer.id))       .filter(Boolean)       .map, powerBefore       .filter((answer) => answer.answered && answer.correct)       .map((answer) => state.groups.find((group) => group.id === answer.id))       .filter, powerBefore       .filter((answer) => answer.answered && answer.correct)       .map, powerBefore       .filter, state.groups.find, setTimeout, RoundSettlement.isRoundTokenCurrent, cancelAnimationFrame, targets.forEach, Number, Number.isFinite, updates.push, renderDashboard, renderChart, updateHeaderStats, console.warn, animateScores, refresh|
|src/ui/round-feedback.js:29|refresh|binding|需要进一步测试|renderDashboard, renderChart, updateHeaderStats, console.warn|
|src/ui/save-file-settings.js:5|$|binding|需要进一步测试|document.getElementById|
|src/ui/save-file-settings.js:8|status|declaration|需要进一步测试|$|
|src/ui/save-file-settings.js:15|paint|declaration|需要进一步测试|$, (info.bytes / 1024).toFixed, status|
|src/ui/save-file-settings.js:34|refresh|declaration|需要进一步测试|globalThis.ClassroomSaveFile?.available, status, paint, ClassroomSaveFile.refreshInfo|
|src/ui/save-file-settings.js:47|guard|declaration|需要进一步测试|globalThis.ClassroomSaveFile?.available, status|
|src/ui/save-file-settings.js:56|globalThis.chooseSaveFileLocation|assignment|需要进一步测试|guard, status, ClassroomSaveFile.choose, paint|
|src/ui/save-file-settings.js:72|globalThis.applySaveFileLocation|assignment|需要进一步测试|guard, $("saveFilePathInput")?.value?.trim, $, status, ClassroomSaveFile.setPath, paint|
|src/ui/save-file-settings.js:92|globalThis.resetSaveFileLocation|assignment|需要进一步测试|guard, ClassroomSaveFile.reset, paint, status|
|src/ui/save-file-settings.js:106|globalThis.loadFromSaveFile|assignment|需要进一步测试|guard, programConfirmV28, status, ClassroomSaveFile.loadFromFile, applyClassroomBackup, saveState, renderAll, updatePickerPoolUI, showToast|
|src/ui/settings-layout.js:29|organize|declaration|需要进一步测试|document.createElement, box.classList.add, E, nodes.filter(Boolean).forEach, nodes.filter, body.append, parent.append, shell.querySelectorAll, group, $, marked, $("#uiSettingsWallpaper .setting-section-title")?.remove, rosterTitle?.remove, sound.append|
|src/ui/settings-layout.js:30|group|declaration|需要进一步测试|document.createElement, box.classList.add, E, nodes.filter(Boolean).forEach, nodes.filter, body.append, parent.append|
|src/ui/settings-layout.js:53|marked|binding|需要进一步测试|shell.querySelectorAll|
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
|src/ui/themes.js:49|apply|declaration|需要进一步测试|boot, name, document.querySelector, document.getElementById, document       .getElementById("gpIntro")       ?.setAttribute, document       .getElementById, document       .querySelector(".gp-home")       ?.setAttribute, document       .querySelector, emblem.slice, emblem.indexOf, emblem.lastIndexOf, svg.setAttribute, encodeURIComponent, document.querySelectorAll, svg         .querySelector("path")         ?.setAttribute, svg         .querySelector, classics.get, button.setAttribute, String, updateWelcomeClock, window.dispatchEvent|
|src/ui/themes.js:105|cancel|declaration|需要进一步测试|animation.cancel, current.element.remove, current.resolve|
|src/ui/themes.js:113|set|declaration|需要进一步测试|Object.hasOwn, Promise.resolve, cancel, localStorage.setItem, JSON.stringify, window.showToast, DesktopUI.getPreferences, matchMedia, apply, document.createElement, overlay.setAttribute, name, document.body.append, resolve, document.getElementById, overlay.animate, overlay       .querySelector(".gp-theme-transition-content")       .animate, overlay       .querySelector, overlay.querySelector(".gp-theme-ribbon").animate, overlay.querySelector, current.animations.push, motion.finished       .then(() => {         if (active === current) cancel();       })       .catch, motion.finished       .then|
|src/ui/themes.js:190|mount|declaration|需要进一步测试|document.getElementById, document.createElement, panel.querySelector(".ui-settings-title")?.after, panel.querySelector, section.querySelectorAll("[data-appearance-theme]").forEach, section.querySelectorAll, button.addEventListener, set, apply|
|src/ui/tooltips.js:11|titleOwner|declaration|需要进一步测试|target.closest|
|src/ui/tooltips.js:15|getTooltip|declaration|需要进一步测试|document.createElement, tooltip.setAttribute, host.append, document.documentElement.append|
|src/ui/tooltips.js:34|removeDescription|declaration|需要进一步测试|owner.getAttribute, owner.removeAttribute, owner.setAttribute, current       .split(/\s+/)       .filter, current       .split, tokens.join|
|src/ui/tooltips.js:50|dismiss|declaration|需要进一步测试|clearTimeout, removeDescription|
|src/ui/tooltips.js:58|position|declaration|需要进一步测试|cancel, active.owner.getBoundingClientRect, Math.max, Math.min|
|src/ui/tooltips.js:88|suppressTitle|declaration|需要进一步测试|active.observer.disconnect, active.owner.setAttribute, active.observer.observe|
|src/ui/tooltips.js:97|refreshTitle|declaration|需要进一步测试|active.owner.getAttribute, active.owner.setAttribute, suppressTitle, dismiss, position|
|src/ui/tooltips.js:115|release|declaration|需要进一步测试|dismiss, previous.observer.disconnect, previous.owner.getAttribute, previous.owner.removeAttribute, previous.owner.setAttribute|
|src/ui/tooltips.js:133|reconcile|declaration|需要进一步测试|release, owner.getAttribute, getTooltip, owner.matches, owner.hasAttribute, owner.textContent.trim, owner.querySelector, owner.setAttribute, suppressTitle, position, setTimeout|
|src/ui/tooltips.js:169|cancel|declaration|需要进一步测试|release|
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
|src/ui/window-motion.js:6|finishWindowClose|declaration|需要进一步测试|closingWindows.get, closingWindows.delete, pending.animation?.cancel, pending.backdrop?.cancel, pending.finish|
|src/ui/window-motion.js:16|cancelWindowClose|declaration|需要进一步测试|closingWindows.get, closingWindows.delete, pending.animation?.cancel, pending.backdrop?.cancel|
|src/ui/window-motion.js:25|dismissWindow|declaration|需要进一步测试|getPreferences, closingWindows.has, root.querySelector, root.getClientRects, canAnimate, finish, getComputedStyle, surface.getAnimations().forEach, surface.getAnimations, a.cancel, closingWindows.set, animate, motionEase, pending.animation.finished         .catch(() => {})         .finally, pending.animation.finished         .catch, closingWindows.get, finishWindowClose|
|src/ui/about-view.js:2|cleanAboutVisibleCopy|declaration|需要进一步测试|document.getElementById, document.createTreeWalker, walker.nextNode, nodes.push, nodes.forEach, n.nodeValue         .replace(/原来的\s*音乐设置已经退休[^。]*。?/g, "")         .replace(/原来的\s*旧版音乐参数面板已经退休[^。]*。?/g, "")         .replace(/旧版音乐参数面板/g, "音乐设置")         .replace, n.nodeValue         .replace(/原来的\s*音乐设置已经退休[^。]*。?/g, "")         .replace(/原来的\s*旧版音乐参数面板已经退休[^。]*。?/g, "")         .replace, n.nodeValue         .replace(/原来的\s*音乐设置已经退休[^。]*。?/g, "")         .replace, n.nodeValue         .replace|
|src/ui/about-view.js:18|renderAboutItems|declaration|需要进一步测试|document     .querySelectorAll("[data-about]")     .forEach, document     .querySelectorAll, b.classList.toggle, document.getElementById, ITEM_ORDER_V218.filter((k) => ITEM_DEFS[k])       .map((k) => {         const d = ITEM_DEFS[k];         const exact =           (typeof GROUP_ITEM_DESC_V2182 !== "undefined" &&             GROUP_ITEM_DESC_V2182[k]) ／／           (typeof ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715 !== "undefined" &&             ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715[k]) ／／           d.desc ／／           "";         const funny =           ITEM_FUNNY_COPY_V2184[k] ／／           "它有自己的工作，而且暂时没有向策划提交辞职申请。";         const tag = ITEM_FUNNY_TAG_V2184[k] ／／ "道具";         const tip =           ITEM_TIPS_OVERRIDE_V2199[k] ／／           (typeof ITEM_TIPS_V218 !== "undefined" && ITEM_TIPS_V218[k]) ／／           "根据排名和当前局势使用，别只因为图标好看就按。";         return <div class="item-reference-row">         <div class="item-reference-icon">${itemVisual(k, "item-reference-img")}</div>         <div class="item-reference-copy">           <div class="item-reference-name">${escapeHtml(d.name)} <span style="font-size:11px;font-weight:800;color:#0f766e;background:#eaf7f4;border-radius:999px;padding:3px 7px;margin-left:5px">${escapeHtml(tag)}</span></div>           <div class="item-reference-desc" style="margin-top:7px;color:#334e49;line-height:1.65">${escapeHtml(funny)}</div>           <div class="item-reference-tip"><b>实际效果：</b>${escapeHtml(exact)}</div>           <div class="item-reference-tip" style="background:#fff8eb;color:#6f5830"><b style="color:#b66a00">使用技巧：</b>${escapeHtml(tip)}</div>         </div>       </div>;       })       .join, ITEM_ORDER_V218.filter((k) => ITEM_DEFS[k])       .map, ITEM_ORDER_V218.filter, itemVisual, escapeHtml, competitionStatusGuideMarkup|
|src/ui/about-view.js:67|renderAboutInformation|declaration|需要进一步测试|document     .querySelectorAll("[data-about]")     .forEach, document     .querySelectorAll, b.classList.toggle, document.getElementById|

## 捕获别名与覆盖链

|位置|别名|捕获的旧入口|分类|
|---|---|---|---|
|src/runtime/audio/draw-audio-lifecycle.js:126|_v2171CancelHandItemDraw|cancelHandItemDraw|需要进一步测试|
|src/runtime/audio/effects-volume.js:81|_v2176SyncSettingsControls|syncSettingsControls|需要进一步测试|
|src/runtime/audio/effects-volume.js:96|_v2176RebuildSettingsV26|rebuildSettingsV26|需要进一步测试|
|src/runtime/audio/effects-volume.js:105|_v2176ShowSettingsV26|showSettingsV26|需要进一步测试|
|src/runtime/audio/item-sound-bindings.js:109|_v2164PlaySoundBase|playSound|需要进一步测试|
|src/runtime/audio/item-sound-map.js:81|_v2174PlaySound|playSound|需要进一步测试|
|src/runtime/audio/item-sound-map.js:129|_v2174ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/runtime/audio/item-sound-map.js:204|_v2174HandleSoundFileUpload|handleSoundFileUpload|需要进一步测试|
|src/runtime/audio/item-sound-map.js:215|_v2174DeleteFxTrack|deleteFxTrack|需要进一步测试|
|src/runtime/audio/item-sound-settings.js:58|_v26ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/runtime/audio/item-sound-settings.js:64|_v26TinyDefense|tinyDefenseToast|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:97|_v218JudgeHandRaise|judgeHandRaise|需要进一步测试|
|src/runtime/classroom/student-labels-and-search.js:71|_v218RenderBattleRankPreview|renderBattleRankPreviewV21721|需要进一步测试|
|src/runtime/items/card-effects-legacy.js:143|_v25ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/runtime/items/catalog-adapters.js:205|_v283OpenGroupModal|openGroupModal|需要进一步测试|
|src/runtime/items/catalog-adapters.js:213|_v283RenderGroupModal|renderGroupModal|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:185|_v21710InstallInfo|installDrawCooldownInfoV2179|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:194|_v21710ShowSettings|showSettingsV26|需要进一步测试|
|src/runtime/items/draw-throttle-legacy.js:170|_v2179InstallClearItems|installClearItemsSettingV2172|需要进一步测试|
|src/runtime/items/drop-uniqueness-and-reset.js:155|_v2172AddItemToGroup|addItemToGroup|需要进一步测试|
|src/runtime/items/drop-uniqueness-and-reset.js:249|_v2172RebuildSettingsV26|rebuildSettingsV26|需要进一步测试|
|src/runtime/items/drop-uniqueness-and-reset.js:257|_v2172ShowSettingsV26|showSettingsV26|需要进一步测试|
|src/runtime/items/feature-switch.js:43|_v291OpenItemWindow|openItemWindow|需要进一步测试|
|src/runtime/items/first-hand-pool.js:15|_v218ItemDropWeights|itemDropWeights|需要进一步测试|
|src/runtime/items/first-hand-pool.js:28|_v218PickItem|pickItemForGroupV281|需要进一步测试|
|src/runtime/items/group-encyclopedia.js:140|_v2182RenderItemWindow|renderItemWindow|需要进一步测试|
|src/runtime/items/group-encyclopedia.js:149|_v2182AdminAddItem|adminAddItem|需要进一步测试|
|src/runtime/items/hand-reward-lifecycle.js:23|_v21CloseHandRaise|closeHandRaise|需要进一步测试|
|src/runtime/items/hand-reward-lifecycle.js:29|_v21SelectHandGroup|selectHandGroup|需要进一步测试|
|src/runtime/items/hand-reward-lifecycle.js:38|_v21JudgeHandRaise|judgeHandRaise|需要进一步测试|
|src/runtime/items/lightning-and-hit-legacy.js:116|_v2116ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/runtime/items/queue-adapters.js:74|_v2120RenderItemWindow|renderItemWindow|需要进一步测试|
|src/runtime/items/queue-adapters.js:135|_v2120EnhanceItemCards|enhanceItemCards|需要进一步测试|
|src/runtime/items/queue-adapters.js:184|_v2120HandUseNewItem|handUseNewItem|需要进一步测试|
|src/runtime/items/round-use-lock.js:57|_v2177ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/runtime/items/round-use-lock.js:71|_v2177QueueUseState|queueUseStateV2120|需要进一步测试|
|src/runtime/items/spiny-cooldown.js:20|_v21717SessionRestrictedWeights|sessionRestrictedWeightsV21710|需要进一步测试|
|src/runtime/items/spiny-cooldown.js:35|_v21717CommitSessionDraw|commitSessionDrawV21710|需要进一步测试|
|src/runtime/items/spiny-cooldown.js:47|_v21717RefreshCooldownInfo|refreshDrawCooldownInfoV21710|需要进一步测试|
|src/runtime/items/status-normalization.js:40|_v21731EnsureItemState|ensureItemState|需要进一步测试|
|src/runtime/items/triple-defense-helpers.js:31|_v218QueueState|queueUseStateV2120|需要进一步测试|
|src/runtime/picker/classroom-tools.js:100|_v2OpenPicker|openPickerModal|需要进一步测试|
|src/runtime/ui/attack-reorder-scheduling.js:25|_v21713ApplyLightningHit|applyLightningHitV2116|需要进一步测试|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:58|_v214JudgeHandRaise|judgeHandRaise|需要进一步测试|
|src/runtime/ui/battle-order-compat.js:82|_v213Batch|applySettingsBatchMembers|需要进一步测试|
|src/runtime/ui/defense-notices.js:29|_v21735ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/runtime/ui/dock-tooltips.js:179|_v2185RenderLockState|renderLockState|需要进一步测试|
|src/runtime/ui/interface-copy.js:57|_v2187OpenPwdModal|openPwdModal|需要进一步测试|
|src/runtime/ui/settings-and-about.js:57|_v2RenderItemWindow|renderItemWindow|需要进一步测试|
|src/runtime/ui/settings-and-about.js:103|_v2Enhance|enhanceItemCards|需要进一步测试|
|src/runtime/ui/settings-and-about.js:121|_v2RenderItemWindowIcons|renderItemWindow|需要进一步测试|
|src/runtime/ui/settings-and-about.js:143|_v2SwitchView|switchView|需要进一步测试|
|src/runtime/ui/welcome-score-sync.js:17|oldSwitchV216|switchView|需要进一步测试|

## 变量（包括全局候选与局部变量，作用域需结合源码）

|位置|绑定|初始化表达式|分类|
|---|---|---|---|
|src/application/answer-commands.js:2|AnswerCommands|(() => {   function select(groupId, opt) {     if (!state.roundActive ／／ state.evaluated) return;     const group = state.groups.find((g) => g.id === groupId); |需要进一步测试|
|src/application/answer-commands.js:5|group|state.groups.find((g) => g.id === groupId)|需要进一步测试|
|src/application/answer-commands.js:18|group|state.groups.find((g) => g.id === groupId)|需要进一步测试|
|src/application/answer-commands.js:34|committed|runClassroomCommand(       ${group.name} 切换 All In,       () => {         group.allIn = !group.allIn;         return true;       },       { recordHistory: fal|需要进一步测试|
|src/application/answer-commands.js:43|ratioMet|checkAllInRatio()|需要进一步测试|
|src/application/answer-commands.js:61|committed|runClassroomCommand(       "批量选择答案",       () => {         state.groups.forEach((group) => {           group.selectedOpt = opt;         });         return true;|需要进一步测试|
|src/application/answer-commands.js:83|targetState|!state.groups.every((group) => group.allIn)|需要进一步测试|
|src/application/answer-commands.js:84|committed|runClassroomCommand(       "批量切换 All In",       () => {         state.groups.forEach((group) => {           group.allIn =             targetState &&            |需要进一步测试|
|src/application/answer-commands.js:98|ratioMet|checkAllInRatio()|需要进一步测试|
|src/application/answer-commands.js:113|generation|0|需要进一步测试|
|src/application/answer-commands.js:119|classroom|state|需要进一步测试|
|src/application/answer-commands.js:120|groups|state.groups|需要进一步测试|
|src/application/answer-commands.js:121|season|state.seasonId|需要进一步测试|
|src/application/answer-commands.js:122|previous|state.correctAns|需要进一步测试|
|src/application/answer-commands.js:123|started|state.roundActive|需要进一步测试|
|src/application/answer-commands.js:124|revision|generation|需要进一步测试|
|src/application/answer-commands.js:126|unanswered|state.groups.filter((g) => g.selectedOpt === "")|需要进一步测试|
|src/application/answer-commands.js:128|names|unanswered.map((g) => g.name).join("、")|需要进一步测试|
|src/application/answer-commands.js:129|accepted|await programConfirmV28(           仍有 ${unanswered.length} 个小组尚未完成作答：${names}\n现在选定正确答案后，未作答小组将保持“未作答”状态。,           {             title: "作答尚未完成",           |需要进一步测试|
|src/application/answer-commands.js:153|accepted|runClassroomCommand(       "选择正确答案",       () => {         state.correctAns = previous === opt ? "" : opt;         return true;       },       { recordHistory: |需要进一步测试|
|src/application/answer-commands.js:162|result|await classroomCommands.whenIdle()|需要进一步测试|
|src/application/command-lifecycle.js:2|CommandLifecycle|(() => {   function create(host) {     let current = null;     let committing = null;     let persisting = null;     let lastCompletion = Promise.resolve({     |需要进一步测试|
|src/application/command-lifecycle.js:4|current|null|需要进一步测试|
|src/application/command-lifecycle.js:5|committing|null|需要进一步测试|
|src/application/command-lifecycle.js:6|persisting|null|需要进一步测试|
|src/application/command-lifecycle.js:7|lastCompletion|Promise.resolve({       ok: true,       idle: true,       persisted: false,     })|需要进一步测试|
|src/application/command-lifecycle.js:12|generatedCommandId|0|需要进一步测试|
|src/application/command-lifecycle.js:45|tx|current|需要进一步测试|
|src/application/command-lifecycle.js:50|outcome|{ ok: false, cancelled: true, reason }|需要进一步测试|
|src/application/command-lifecycle.js:67|saved||需要进一步测试|
|src/application/command-lifecycle.js:67|transaction||需要进一步测试|
|src/application/command-lifecycle.js:108|outcome||需要进一步测试|
|src/application/command-lifecycle.js:150|commandId|options.commandId ／／         host.commandId?.() ／／         command-${++generatedCommandId}|需要进一步测试|
|src/application/command-lifecycle.js:154|eventScope|host.createEventScope?.({           commandId,           actorId: options.actorId ?? host.actorId?.() ?? null,           source: options.source ／／ "classroom", |需要进一步测试|
|src/application/command-lifecycle.js:162|before|host.snapshot()|需要进一步测试|
|src/application/command-lifecycle.js:163|resolveCompletion||需要进一步测试|
|src/application/command-lifecycle.js:164|completion|new Promise((resolve) => {         resolveCompletion = resolve;       })|需要进一步测试|
|src/application/command-lifecycle.js:168|tx|{         commandId,         completion,         resolveCompletion,         eventScope,         finalizers: [],         before,         waiting: 0,         reta|需要进一步测试|
|src/application/command-lifecycle.js:183|result|operation(context(tx))|需要进一步测试|
|src/application/command-lifecycle.js:201|tx|current|需要进一步测试|
|src/application/hand-raise-port.js:7|session|null|需要进一步测试|
|src/application/hand-raise-port.js:8|running|false|需要进一步测试|
|src/application/hand-raise-port.js:10|state||需要进一步测试|
|src/application/hand-raise-port.js:12|group|state.groups.find((g) => g.id === session?.groupId)|需要进一步测试|
|src/application/hand-raise-port.js:29|state|host.getState()|需要进一步测试|
|src/application/hand-raise-port.js:30|group|current()|需要进一步测试|
|src/application/hand-raise-port.js:31|isBusy|busy()|需要进一步测试|
|src/application/hand-raise-port.js:32|locked|!!state.isLocked|需要进一步测试|
|src/application/hand-raise-port.js:33|inventoryCount|group?.inventory?.length ／／ 0|需要进一步测试|
|src/application/hand-raise-port.js:34|answerCorrect|session?.correct === true|需要进一步测试|
|src/application/hand-raise-port.js:35|mainItem|group?.inventory?.[0] ／／ null|需要进一步测试|
|src/application/hand-raise-port.js:72|state|host.getState()|需要进一步测试|
|src/application/hand-raise-port.js:76|group|state.groups.find((g) => g.id === payload.groupId)|需要进一步测试|
|src/application/hand-raise-port.js:95|group|state.groups.find((g) => g.id === payload.groupId)|需要进一步测试|
|src/application/hand-raise-port.js:109|group|current()|需要进一步测试|
|src/application/hand-raise-port.js:110|expected|session|需要进一步测试|
|src/application/hand-raise-port.js:137|plan||需要进一步测试|
|src/application/hand-raise-port.js:137|itemName|''|需要进一步测试|
|src/application/hand-raise-port.js:137|runtime||需要进一步测试|
|src/application/hand-raise-port.js:149|used|host.use(group)|需要进一步测试|
|src/application/hand-raise-port.js:151|result|await host.whenIdle()|需要进一步测试|
|src/application/hand-raise-port.js:165|drawn|null|需要进一步测试|
|src/application/hand-raise-port.js:166|accepted|host.run(           ${group.name} 悬浮举手：${             action === 'handJudge'               ? payload.correct                 ? '回答正确'                 : '回答错误' |需要进一步测试|
|src/application/hand-raise-port.js:179|key|payload.correct ? 'correct' : 'wrong'|需要进一步测试|
|src/application/hand-raise-port.js:207|result|await host.whenIdle()|需要进一步测试|
|src/application/hand-selection-sync.js:6|listeners|new Set()|需要进一步测试|
|src/application/hand-selection-sync.js:7|current|null|需要进一步测试|
|src/application/hand-selection-sync.js:13|fn||需要进一步测试|
|src/application/history-commands.js:2|HistoryCommands|(() => {   async function clear() {     if (!ClassroomWriteBarrier.allow()) return false;     if (state.isLocked) {       openPwdModal();       return false;   |需要进一步测试|
|src/application/history-commands.js:9|classroom|state|需要进一步测试|
|src/application/history-commands.js:10|seasonId|state.seasonId|需要进一步测试|
|src/application/history-commands.js:11|fingerprint|JSON.stringify(historyStack)|需要进一步测试|
|src/application/history-commands.js:33|accepted|runClassroomCommand(       "清空历史记录",       () => {         historyStack = [];         return true;       },       {         recordHistory: false,         source|需要进一步测试|
|src/application/history-commands.js:46|result|await classroomCommands.whenIdle()|需要进一步测试|
|src/application/history-commands.js:82|accepted|runClassroomCommand(       "历史恢复",       () => {         if (index !== null) historyStack = historyStack.slice(0, index);         apply(snapshot);         retur|需要进一步测试|
|src/application/history-commands.js:92|result|await classroomCommands.whenIdle()|需要进一步测试|
|src/application/history-commands.js:121|index|historyStack.length - 1|需要进一步测试|
|src/application/history-commands.js:122|snapshot|historyStack[index]|需要进一步测试|
|src/application/history-commands.js:134|snapshot|historyStack[index]|需要进一步测试|
|src/application/item-defense-adapter.js:3|kind|DefensePolicy.choose(g, attackType, {     eligible: eligibleForItems(g),     ignorePrimary: !!globalThis.RedirectedItemInstances?.has(g?.inventory?.[0]),     sh|需要进一步测试|
|src/application/item-defense-adapter.js:10|main|g?.inventory?.[0]|需要进一步测试|
|src/application/item-defense-adapter.js:33|type|g.itemEffect.type|需要进一步测试|
|src/application/item-defense-adapter.js:68|spinyDefenseRequests|new WeakMap()|需要进一步测试|
|src/application/item-defense-adapter.js:70|horn|key === "horn"|需要进一步测试|
|src/application/item-defense-adapter.js:71|flag|horn       ? "__spinyHornDecisionPendingV218"       : "__spinyDecisionPendingV21727"|需要进一步测试|
|src/application/item-defense-adapter.js:74|declined|horn     ? "__spinyHornDeclinedV218"     : "__spinyMushroomDeclinedV21727"|需要进一步测试|
|src/application/item-defense-adapter.js:77|requests|spinyDefenseRequests.get(target)|需要进一步测试|
|src/application/item-defense-adapter.js:82|requestToken|{}|需要进一步测试|
|src/application/item-defense-adapter.js:85|decision|Reliability.captureDefenseDecision(state, target, key)|需要进一步测试|
|src/application/item-defense-adapter.js:86|name|ITEM_DEFS[key]?.name ／／ "蘑菇"|需要进一步测试|
|src/application/item-defense-adapter.js:87|prompt|themeConfirm(     ${target.name} 遭遇刺龟壳！\n是否主动消耗主要道具 ${name} 抵消本次攻击？,     {       title: "刺龟壳来袭",       confirmText: horn ? "使用超级喇叭" : "使用蘑菇闪避",       cancelTe|需要进一步测试|
|src/application/item-defense-adapter.js:95|clear|() => {     // A superseded promise may settle after another request for the same group.     // Only the current request owns that flag; clearing an older token|需要进一步测试|
|src/application/legacy-classroom-adapter.js:36|data|Reliability.validateBackup(SchemaMigrations.migrateBackup(raw))|需要进一步测试|
|src/application/legacy-classroom-adapter.js:49|p|data.picker|需要进一步测试|
|src/application/legacy-classroom-adapter.js:66|k||需要进一步测试|
|src/application/legacy-classroom-adapter.js:68|k||需要进一步测试|
|src/application/legacy-classroom-adapter.js:77|r|data.round|需要进一步测试|
|src/application/legacy-classroom-adapter.js:98|[k, min, max]||需要进一步测试|
|src/application/legacy-classroom-adapter.js:107|k||需要进一步测试|
|src/application/legacy-classroom-adapter.js:121|conflict|ClassroomWriteBarrier.conflict()|需要进一步测试|
|src/application/legacy-classroom-adapter.js:125|old|clone(state)|需要进一步测试|
|src/application/legacy-classroom-adapter.js:126|history|clone(historyStack)|需要进一步测试|
|src/application/legacy-classroom-adapter.js:127|first|firstHandDrawPendingV218|需要进一步测试|
|src/application/legacy-classroom-adapter.js:128|wasRecovering|!!window.classroomRecoveryRequired|需要进一步测试|
|src/application/legacy-classroom-adapter.js:132|preserved|ClassroomRepository.writeVerified(         CLASSROOM_STORAGE,         "godpower_recovery_before_import_v2",         {           sourceKey: Reliability.stateKey,|需要进一步测试|
|src/application/legacy-classroom-adapter.js:147|result|saveState()|需要进一步测试|
|src/application/legacy-classroom-adapter.js:165|alreadyUnsaved|!!window.classroomUnsavedChanges|需要进一步测试|
|src/application/legacy-classroom-adapter.js:168|warning|document.getElementById("classroomSaveWarning")|需要进一步测试|
|src/application/legacy-classroom-adapter.js:176|classroomCommands|CommandLifecycle.create({   active: () => !!window.itemCommandActive,   setActive: (value) => {     window.itemCommandActive = value;   },   commandId: () => St|需要进一步测试|
|src/application/legacy-classroom-adapter.js:193|liveGroups|new Map(state.groups.map((g) => [g.id, g]))|需要进一步测试|
|src/application/legacy-classroom-adapter.js:194|restored|before.state|需要进一步测试|
|src/application/legacy-classroom-adapter.js:196|live|liveGroups.get(g.id)|需要进一步测试|
|src/application/legacy-classroom-adapter.js:261|g|state.groups.find((x) => x.id === groupId)|需要进一步测试|
|src/application/legacy-classroom-adapter.js:262|fromHand|globalThis.HandItemCinematic?.take(groupId)|需要进一步测试|
|src/application/legacy-classroom-adapter.js:263|reason|Reliability.validateItem(state, g, index, isCommunismMode())|需要进一步测试|
|src/application/legacy-classroom-adapter.js:269|key|g.inventory[index].key|需要进一步测试|
|src/application/legacy-classroom-adapter.js:270|presentation|{     fromHand,   }|需要进一步测试|
|src/application/legacy-classroom-adapter.js:277|accepted|runClassroomCommand(     ${g.name} 使用道具：${ITEM_DEFS[key]?.name ／／ key},     (context) => {       ensureV2State();       const beforeValue = itemCommandSnapsho|需要进一步测试|
|src/application/legacy-classroom-adapter.js:281|beforeValue|itemCommandSnapshot()|需要进一步测试|
|src/application/legacy-classroom-adapter.js:282|beforeGroups|JSON.parse(beforeValue).groups|需要进一步测试|
|src/application/legacy-classroom-adapter.js:283|usedItem|g.inventory[index]|需要进一步测试|
|src/application/legacy-classroom-adapter.js:284|itemInstanceId|usedItem.itemInstanceId ／／ null|需要进一步测试|
|src/application/legacy-classroom-adapter.js:285|chargesBefore|Number(usedItem.charges) ／／ 1|需要进一步测试|
|src/application/legacy-classroom-adapter.js:297|result|ItemModules.execute(key, () =>         ItemOperationBlocks.run(key, g, index, context, presentation),       )|需要进一步测试|
|src/application/legacy-classroom-adapter.js:317|before|beforeGroups.find((group) => group.id === target.id)|需要进一步测试|
|src/application/legacy-classroom-adapter.js:318|after|state.groups.find((group) => group.id === target.id)|需要进一步测试|
|src/application/legacy-classroom-adapter.js:319|delta|after && before ? after.score - before.score : target.delta|需要进一步测试|
|src/application/legacy-classroom-adapter.js:331|fact||需要进一步测试|
|src/application/legacy-classroom-adapter.js:354|classroomStoredState|null|需要进一步测试|
|src/application/legacy-classroom-adapter.js:356|loaded|ClassroomRepository.loadOrMigrate(CLASSROOM_STORAGE, {     currentKey: Reliability.stateKey,     legacyKey: Reliability.legacyStateKey,     receiptKey: "godpowe|需要进一步测试|
|src/application/legacy-classroom-adapter.js:447|accepted|runClassroomCommand(     自动判定结算 (正解: ${state.correctAns}),     (context) => {       window.pendingRoundPresentation = legacyJudgeRound();       for (const fac|需要进一步测试|
|src/application/legacy-classroom-adapter.js:451|fact||需要进一步测试|
|src/application/legacy-classroom-adapter.js:473|classroomDock|document.querySelector(".bottom-dock")|需要进一步测试|
|src/application/manual-score-commands.js:2|ManualScoreCommands|(() => {   function adjust(groupId, delta) {     Reliability.invalidateDefenseDecisions();     cancelScoreAnimationAndSync();     if (state.isLocked) {       op|需要进一步测试|
|src/application/manual-score-commands.js:10|g|state.groups.find((x) => x.id === groupId)|需要进一步测试|
|src/application/manual-score-commands.js:13|plan||需要进一步测试|
|src/application/manual-score-commands.js:20|{       before: oldScore,       after: targetScore,       delta: actualDelta,       milestone: isMilestone,     }|plan|需要进一步测试|
|src/application/manual-score-commands.js:26|clipped|false|需要进一步测试|
|src/application/manual-score-commands.js:31|committed|runClassroomCommand(       ${g.name} 积分调整 (${actualDelta > 0 ? "+" : ""}${actualDelta}),       () => {         g.score = targetScore;         return true;    |需要进一步测试|
|src/application/manual-score-commands.js:61|group|state.groups.find((g) => g.id === groupId)|需要进一步测试|
|src/application/manual-score-commands.js:63|plan||需要进一步测试|
|src/application/manual-score-commands.js:70|committed|runClassroomCommand(       ${group.name} 手动设定分数为 ${targetScore},       () => {         group.score = plan.after;         state.editingScoreId = null;         |需要进一步测试|
|src/application/migration-coordinator.js:2|MigrationCoordinator|(() => {   function create({ inventory, openRepository, sourceOptions = {} }) {     if (!inventory ／／ typeof openRepository !== "function")       throw new Type|需要进一步测试|
|src/application/migration-coordinator.js:9|captured|await inventory.capture(sourceOptions)|需要进一步测试|
|src/application/migration-coordinator.js:16|plan|await inventory.prepare(captured)|需要进一步测试|
|src/application/migration-coordinator.js:31|repository|null|需要进一步测试|
|src/application/migration-coordinator.js:32|stage|"read-source"|需要进一步测试|
|src/application/migration-coordinator.js:33|cancelled|() => {         if (signal?.aborted) {           const error = new Error("迁移已取消，来源保持不变");           error.code = "CANCELLED";           throw error;         }  |需要进一步测试|
|src/application/migration-coordinator.js:35|error|new Error("迁移已取消，来源保持不变")|需要进一步测试|
|src/application/migration-coordinator.js:43|captured|await inventory.capture(sourceOptions)|需要进一步测试|
|src/application/migration-coordinator.js:51|plan|await inventory.prepare(captured)|需要进一步测试|
|src/application/migration-coordinator.js:65|sourceBefore|await inventory.verify(plan, sourceOptions)|需要进一步测试|
|src/application/migration-coordinator.js:78|receipt|await repository.importSnapshot(plan)|需要进一步测试|
|src/application/migration-coordinator.js:82|integrity|await inventory.verifyDestination(repository, plan)|需要进一步测试|
|src/application/migration-coordinator.js:97|sourceAfter|await inventory.verify(plan, sourceOptions)|需要进一步测试|
|src/application/migration-coordinator.js:113|completedStatus|signal?.aborted           ? "CANCELLED_STAGED"           : "VERIFIED"|需要进一步测试|
|src/application/migration-coordinator.js:116|journal|await repository.recordMigrationStatus(plan, {           status: completedStatus,           sourceRechecked: true,           integrity,         })|需要进一步测试|
|src/application/round-settlement.js:2|RoundSettlement|(() => {   function execute() {     if (!state.roundActive ／／ state.evaluated ／／ !state.correctAns)       return false;     for (const group of state.groups)   |需要进一步测试|
|src/application/round-settlement.js:6|group||需要进一步测试|
|src/application/round-settlement.js:8|context|{       rankingsBefore: ranking().map((group) => group.id),       groupsBefore: state.groups.map((group) => ({         id: group.id,         score: group.score,|需要进一步测试|
|src/application/round-settlement.js:32|presentation|settleBaseRoundLegacy()|需要进一步测试|
|src/application/round-settlement.js:38|rankingsAfter|ranking()|需要进一步测试|
|src/application/round-settlement.js:39|rankOf|(groups, id) => {       const group = groups.find((candidate) => candidate.id === id);       return group         ? 1 + groups.filter((candidate) => candidate.s|需要进一步测试|
|src/application/round-settlement.js:40|group|groups.find((candidate) => candidate.id === id)|需要进一步测试|
|src/application/round-settlement.js:60|group|state.groups.find(           (candidate) => candidate.id === answer.id,         )|需要进一步测试|
|src/application/round-settlement.js:82|{       flipSnapshotV21725,       scoreUpdates,       allInWins,       allInLosses,       hasNormalWin,       hasMilestone,       milestoneGroups,       powerBefore,     }|presentation|需要进一步测试|
|src/application/round-settlement.js:99|card|document.querySelector(         .group-row-card[data-group-id="${group.id}"],       )|需要进一步测试|
|src/application/round-settlement.js:121|forceEndGeneration|0|需要进一步测试|
|src/application/round-settlement.js:123|flipSnapshot|captureCardRectsV21725()|需要进一步测试|
|src/application/round-settlement.js:124|committed|runClassroomCommand(       "开始新回合",       () => {         resetRoundItemUseLocksV2177();         state.hasStartedOnce = true;         state.roundActive = true; |需要进一步测试|
|src/application/round-settlement.js:143|result|await classroomCommands.whenIdle()|需要进一步测试|
|src/application/round-settlement.js:192|classroom|state|需要进一步测试|
|src/application/round-settlement.js:193|groups|state.groups|需要进一步测试|
|src/application/round-settlement.js:194|season|state.seasonId|需要进一步测试|
|src/application/round-settlement.js:195|fingerprint|JSON.stringify({       roundActive: state.roundActive,       evaluated: state.evaluated,       correctAns: state.correctAns,       groups: state.groups.map((g) |需要进一步测试|
|src/application/round-settlement.js:201|generation|forceEndGeneration|需要进一步测试|
|src/application/round-settlement.js:202|accepted|await themeConfirm(       "确认强制结束当前题目吗？（当前作答将作废，不进行加分结算）",       { title: "强制结束题目", danger: true, confirmText: "强制结束" },     )|需要进一步测试|
|src/application/round-settlement.js:223|flipSnapshot|captureCardRectsV21725()|需要进一步测试|
|src/application/round-settlement.js:224|committed|runClassroomCommand("教师强制结束本题", () => {       state.roundActive = true;       state.evaluated = true;       return true;     })|需要进一步测试|
|src/application/round-settlement.js:230|result|await classroomCommands.whenIdle()|需要进一步测试|
|src/application/transactional-command-service.js:2|TransactionalCommandService|(() => {   function fault(code, message) {     const error = new Error(message);     error.code = code;     return error;   }   const freeze = DomainValues.deep|需要进一步测试|
|src/application/transactional-command-service.js:4|error|new Error(message)|需要进一步测试|
|src/application/transactional-command-service.js:8|freeze|DomainValues.deepFreeze|需要进一步测试|
|src/application/transactional-command-service.js:15|request||需要进一步测试|
|src/application/transactional-command-service.js:28|source|text(request.source, "source")|需要进一步测试|
|src/application/transactional-command-service.js:55|inFlight|new Map()|需要进一步测试|
|src/application/transactional-command-service.js:57|checkCancelled|() => {         if (signal?.aborted)           throw fault("CANCELLED", "Command cancelled before commit");       }|需要进一步测试|
|src/application/transactional-command-service.js:65|prior|await repository.findCommand(request.commandId, request)|需要进一步测试|
|src/application/transactional-command-service.js:68|handler|Object.hasOwn(handlers, request.type)         ? handlers[request.type]         : null|需要进一步测试|
|src/application/transactional-command-service.js:73|aggregate|await repository.read(request.aggregateId)|需要进一步测试|
|src/application/transactional-command-service.js:78|events|DomainEvents.createScope({         commandId: request.commandId,         actorId: request.actorId,         source: request.source,         now,       })|需要进一步测试|
|src/application/transactional-command-service.js:85|context|Object.freeze({           commandId: request.commandId,           actorId: request.actorId,           aggregateId: request.aggregateId,           emit: events.e|需要进一步测试|
|src/application/transactional-command-service.js:92|outcome||需要进一步测试|
|src/application/transactional-command-service.js:112|confirmedEvents|events.list()|需要进一步测试|
|src/application/transactional-command-service.js:113|receipt|await repository.commit({           commandId: request.commandId,           aggregateId: request.aggregateId,           expectedRevision: request.expectedRevisi|需要进一步测试|
|src/application/transactional-command-service.js:149|request||需要进一步测试|
|src/application/transactional-command-service.js:155|intent|JSON.stringify(request)|需要进一步测试|
|src/application/transactional-command-service.js:156|existing|inFlight.get(request.commandId)|需要进一步测试|
|src/application/transactional-command-service.js:163|promise|execute(request, options).finally(() => {         inFlight.delete(request.commandId);       })|需要进一步测试|
|src/application/write-barrier.js:2|ClassroomWriteBarrier|{   conflict() {     if (!window.classroomReady ／／ !classroomCommands.isCommitting())       return null;     return {       ok: false,       reason: "commit-pen|需要进一步测试|
|src/application/write-barrier.js:13|conflict|this.conflict()|需要进一步测试|
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
|src/core/picker-bridge.js:4|externalEffects|true|需要进一步测试|
|src/core/picker-bridge.js:5|listeners|new Set()|需要进一步测试|
|src/core/picker-bridge.js:10|snapshot|getSnapshot()|需要进一步测试|
|src/core/picker-bridge.js:11|listener||需要进一步测试|
|src/core/picker-bridge.js:15|win|slotEngine.chosenResult|需要进一步测试|
|src/core/picker-bridge.js:17|source|state.picker.mode === 'group' ? win : win.group|需要进一步测试|
|src/core/picker-bridge.js:18|group|state.groups.find(g => g.id === source?.id)|需要进一步测试|
|src/core/picker-bridge.js:20|student|state.picker.mode === 'group' ? null : parseStudentV218(win.memberName)|需要进一步测试|
|src/core/picker-bridge.js:21|avatarDataUrl|state.picker.mode === 'group'       ? window.ClassroomAvatarDisplay?.groupDataUrlCached(group) ／／ ''       : window.ClassroomAvatarDisplay?.studentDataUrl(group|需要进一步测试|
|src/core/picker-bridge.js:32|EFFECT_STYLES|['aurora', 'burst', 'ripple', 'starlight', 'spotlight',     'confetti', 'vortex', 'prism', 'bloom', 'comet']|需要进一步测试|
|src/core/picker-bridge.js:40|actual|slotEngine.isSpinning ? 'rolling' : phase|需要进一步测试|
|src/core/picker-bridge.js:41|result|['settling', 'revealed'].includes(actual) ? currentResult() : null|需要进一步测试|
|src/core/picker-bridge.js:42|options|ClassroomFeedback.getOptions()|需要进一步测试|
|src/core/picker-bridge.js:42|motion|DesktopUI.getPreferences()|需要进一步测试|
|src/core/picker-bridge.js:43|effectEnabled|options.pickEffects && motion.motion !== 'off' &&       (window.godpowerDesktop?.role !== 'main' ／／ externalEffects) &&       !(motion.systemMotion && matchMedi|需要进一步测试|
|src/core/picker-bridge.js:92|result|currentResult()|需要进一步测试|
|src/core/picker-bridge.js:92|delta|payload.delta|需要进一步测试|
|src/core/reliability.js:2|Reliability|(() => {   const schemaVersion = 2;   const stateKey = "godpower_state_v2";   const legacyStateKey = "godpower_state_v1";   function validateBackup(data, depth |需要进一步测试|
|src/core/reliability.js:3|schemaVersion|2|需要进一步测试|
|src/core/reliability.js:4|stateKey|"godpower_state_v2"|需要进一步测试|
|src/core/reliability.js:5|legacyStateKey|"godpower_state_v1"|需要进一步测试|
|src/core/reliability.js:28|groupUids|new Set()|需要进一步测试|
|src/core/reliability.js:70|effect||需要进一步测试|
|src/core/reliability.js:93|key||需要进一步测试|
|src/core/reliability.js:98|values|data.picker[key]|需要进一步测试|
|src/core/reliability.js:114|global|data.itemGlobal|需要进一步测试|
|src/core/reliability.js:117|key||需要进一步测试|
|src/core/reliability.js:129|key||需要进一步测试|
|src/core/reliability.js:130|records|global[key]|需要进一步测试|
|src/core/reliability.js:136|record||需要进一步测试|
|src/core/reliability.js:158|[key, sequenceKey, eligibleKey]||需要进一步测试|
|src/core/reliability.js:162|throttle|global[key]|需要进一步测试|
|src/core/reliability.js:172|eligible|throttle[eligibleKey]|需要进一步测试|
|src/core/reliability.js:198|session|throttle.activeDrawSession|需要进一步测试|
|src/core/reliability.js:215|h||需要进一步测试|
|src/core/reliability.js:230|writeVerified|ClassroomRepository.writeVerified|需要进一步测试|
|src/core/reliability.js:231|appendArchive|ClassroomRepository.appendArchive|需要进一步测试|
|src/core/reliability.js:240|key|g.inventory[index].key|需要进一步测试|
|src/core/reliability.js:241|continuation|[         "triple_green",         "triple_red",         "triple_banana",         "triple_mushroom",       ].includes(key) && g.roundItemContinuationKeyV218 === |需要进一步测试|
|src/core/reliability.js:258|defenseDecisionEpoch|0|需要进一步测试|
|src/core/reliability.js:259|defenseInvalidationHandlers|new Set()|需要进一步测试|
|src/core/reliability.js:270|handler||需要进一步测试|
|src/core/reliability.js:274|item|target?.inventory?.[0]|需要进一步测试|
|src/core/reliability.js:329|groupMap|new Map(groups.map((g) => [g.id, g]))|需要进一步测试|
|src/core/reliability.js:331|g|groupMap.get(id)|需要进一步测试|
|src/core/reliability.js:334|old|Number(g.score)|需要进一步测试|
|src/core/reliability.js:335|delta|points * count|需要进一步测试|
|src/core/reliability.js:336|score|old + delta|需要进一步测试|
|src/core/reliability.js:355|n|Number(value)|需要进一步测试|
|src/core/reliability.js:365|out|{}|需要进一步测试|
|src/core/reliability.js:368|k||需要进一步测试|
|src/core/reliability.js:414|CLASSROOM_STORAGE|{   getItem(key) {     return localStorage.getItem(key);   },   setItem(key, value) {     localStorage.setItem(key, value);   },   removeItem(key) {     localSt|需要进一步测试|
|src/domain/achievements/catalog.js:2|AchievementCatalog|(() => {   const entries = [     ["ACH-001", "初露锋芒", "learning", "普通", "累计首次正确作答"],     ["ACH-002", "小试牛刀", "learning", "普通", "历史累计正确作答 10 次"],     ["ACH-003", |需要进一步测试|
|src/domain/achievements/catalog.js:3|entries|[     ["ACH-001", "初露锋芒", "learning", "普通", "累计首次正确作答"],     ["ACH-002", "小试牛刀", "learning", "普通", "历史累计正确作答 10 次"],     ["ACH-003", "博闻强识", "learning", "进阶", "|需要进一步测试|
|src/domain/achievements/catalog.js:390|byId|new Map(entries.map((entry) => [entry.id, entry]))|需要进一步测试|
|src/domain/achievements/learning-rules.js:2|LearningAchievementRules|(() => {   const PERMANENT_THRESHOLDS = [     ["ACH-001", (p) => p.historicalCounters.correctAnswers >= 1],     ["ACH-002", (p) => p.historicalCounters.correctA|需要进一步测试|
|src/domain/achievements/learning-rules.js:3|PERMANENT_THRESHOLDS|[     ["ACH-001", (p) => p.historicalCounters.correctAnswers >= 1],     ["ACH-002", (p) => p.historicalCounters.correctAnswers >= 10],     ["ACH-003", (p) => p.|需要进一步测试|
|src/domain/achievements/learning-rules.js:10|SEASON_THRESHOLDS|[     ["ACH-005", (p) => p.seasonProgress.correctStreak >= 3],     ["ACH-006", (p) => p.seasonProgress.correctStreak >= 5],     ["ACH-007", (p) => p.seasonProgr|需要进一步测试|
|src/domain/achievements/learning-rules.js:36|facts|event?.payload|需要进一步测试|
|src/domain/achievements/learning-rules.js:46|learning|progress.seasonProgress|需要进一步测试|
|src/domain/achievements/learning-rules.js:47|correct|facts.answered && facts.correct|需要进一步测试|
|src/domain/achievements/learning-rules.js:78|unlocked|[]|需要进一步测试|
|src/domain/achievements/learning-rules.js:79|[id, condition]||需要进一步测试|
|src/domain/achievements/learning-rules.js:85|[id, condition]||需要进一步测试|
|src/domain/achievements/ledger.js:2|AchievementLedger|(() => {   const SCHEMA_VERSION = 1;   const clone = (value) => DomainValues.cloneJson(value);    function empty() {     return { schemaVersion: SCHEMA_VERSION,|需要进一步测试|
|src/domain/achievements/ledger.js:3|SCHEMA_VERSION|1|需要进一步测试|
|src/domain/achievements/ledger.js:4|clone|(value) => DomainValues.cloneJson(value)|需要进一步测试|
|src/domain/achievements/ledger.js:21|ledger|clone(value)|需要进一步测试|
|src/domain/achievements/ledger.js:22|[uid, progress]||需要进一步测试|
|src/domain/achievements/ledger.js:36|bucket||需要进一步测试|
|src/domain/achievements/ledger.js:49|counters||需要进一步测试|
|src/domain/achievements/ledger.js:106|ledger|normalize(value)|需要进一步测试|
|src/domain/achievements/ledger.js:107|seenInBatch|new Set()|需要进一步测试|
|src/domain/achievements/ledger.js:108|unlocked|[]|需要进一步测试|
|src/domain/achievements/ledger.js:109|applied|0|需要进一步测试|
|src/domain/achievements/ledger.js:110|duplicates|0|需要进一步测试|
|src/domain/achievements/ledger.js:111|event||需要进一步测试|
|src/domain/achievements/ledger.js:120|uid|event.aggregate.id|需要进一步测试|
|src/domain/achievements/ledger.js:121|progress|ledger.groups[uid] ／／ (ledger.groups[uid] = newGroupProgress(seasonId))|需要进一步测试|
|src/domain/achievements/ledger.js:131|eventSeason|StableIdentity.isValidSeasonId(         event.payload?.seasonId,       )         ? event.payload.seasonId         : seasonId|需要进一步测试|
|src/domain/achievements/ledger.js:152|groupUnlocks|LearningAchievementRules.evaluate(progress, event)|需要进一步测试|
|src/domain/classroom-roster.js:3|clone|(value) => JSON.parse(JSON.stringify(value))|需要进一步测试|
|src/domain/classroom-roster.js:4|fail|(message) => {     throw new TypeError(message);   }|需要进一步测试|
|src/domain/classroom-roster.js:7|validId|(value, check) => root.StableIdentity[check](value)|需要进一步测试|
|src/domain/classroom-roster.js:17|key||需要进一步测试|
|src/domain/classroom-roster.js:19|profileIds|new Set()|需要进一步测试|
|src/domain/classroom-roster.js:20|profile||需要进一步测试|
|src/domain/classroom-roster.js:36|classrooms|new Map()|需要进一步测试|
|src/domain/classroom-roster.js:37|classroom||需要进一步测试|
|src/domain/classroom-roster.js:57|students|new Map()|需要进一步测试|
|src/domain/classroom-roster.js:58|student||需要进一步测试|
|src/domain/classroom-roster.js:80|[classroomId, classroom]||需要进一步测试|
|src/domain/classroom-roster.js:81|studentUid||需要进一步测试|
|src/domain/classroom-roster.js:86|student||需要进一步测试|
|src/domain/classroom-roster.js:94|assignmentKeys|new Set()|需要进一步测试|
|src/domain/classroom-roster.js:95|assignment||需要进一步测试|
|src/domain/classroom-roster.js:106|key|${assignment.userProfileId}\u0000${assignment.classroomId}|需要进一步测试|
|src/domain/classroom-roster.js:110|assignedStudents|new Set()|需要进一步测试|
|src/domain/classroom-roster.js:111|item||需要进一步测试|
|src/domain/classroom-roster.js:159|students|[]|需要进一步测试|
|src/domain/classroom-roster.js:160|studentIds|[]|需要进一步测试|
|src/domain/classroom-roster.js:161|groupAssignments|[]|需要进一步测试|
|src/domain/classroom-roster.js:162|seenGroups|new Set()|需要进一步测试|
|src/domain/classroom-roster.js:163|group||需要进一步测试|
|src/domain/classroom-roster.js:173|member||需要进一步测试|
|src/domain/classroom-roster.js:176|studentUid|idFactory()|需要进一步测试|
|src/domain/classroom-roster.js:215|valid|validateRosterDocument(rosterData)|需要进一步测试|
|src/domain/classroom-roster.js:216|assignment|valid.assignments.find(       (entry) =>         entry.userProfileId === userProfileId &&         entry.classroomId === classroomId,     )|需要进一步测试|
|src/domain/classroom-roster.js:222|availableGroups|new Set(groups.map((group) => group.groupUid))|需要进一步测试|
|src/domain/classroom-roster.js:223|byGroup|new Map()|需要进一步测试|
|src/domain/classroom-roster.js:224|item||需要进一步测试|
|src/domain/classroom-roster.js:227|student|valid.students.find(         (entry) => entry.studentUid === item.studentUid,       )|需要进一步测试|
|src/domain/classroom-roster.js:230|names|byGroup.get(item.groupUid) ／／ []|需要进一步测试|
|src/domain/classroom-roster.js:248|valid|validateRosterDocument(rosterData)|需要进一步测试|
|src/domain/classroom-roster.js:249|assignment|valid.assignments.find(       (entry) =>         entry.userProfileId === userProfileId &&         entry.classroomId === classroomId,     )|需要进一步测试|
|src/domain/classroom-roster.js:257|ids|new Set()|需要进一步测试|
|src/domain/classroom-roster.js:258|group||需要进一步测试|
|src/domain/classroom-roster.js:267|original|groups.map(clone)|需要进一步测试|
|src/domain/classroom-roster.js:268|projected|projectLegacyMembers({       groups: original,       rosterData: valid,       userProfileId,       classroomId,     })|需要进一步测试|
|src/domain/classroom-roster.js:274|groupChanges|projected.map((group, index) => ({       groupUid: group.groupUid,       groupName: group.name ／／ 第 ${index + 1} 组,       before: [...original[index].members]|需要进一步测试|
|src/domain/competition/effects.js:3|definitions|Object.freeze({     burn: { name: "灼烧", duration: 2, negative: true },     freeze: { name: "冰冻", duration: 2, negative: true },     paralysis: { name: "麻痹", dur|需要进一步测试|
|src/domain/competition/effects.js:14|DEFENSIVE_ROUNDS|3|需要进一步测试|
|src/domain/competition/effects.js:15|defensiveType|(key) => (key === "invincible" ? "star" : key === "mega" ? "mega" : null)|需要进一步测试|
|src/domain/competition/effects.js:16|negative|Object.keys(definitions).filter(     (k) => definitions[k].negative,   )|需要进一步测试|
|src/domain/competition/effects.js:20|raw|group.competitionEffects|需要进一步测试|
|src/domain/competition/effects.js:21|effects|{}|需要进一步测试|
|src/domain/competition/effects.js:22|key||需要进一步测试|
|src/domain/competition/effects.js:24|remaining|Number(raw?.[key]?.remaining)|需要进一步测试|
|src/domain/competition/effects.js:42|effects|normalize(group)|需要进一步测试|
|src/domain/competition/effects.js:45|others|Object.keys(effects).filter((name) => name !== key)|需要进一步测试|
|src/domain/competition/effects.js:58|rounds|DEFENSIVE_ROUNDS|需要进一步测试|
|src/domain/competition/effects.js:70|type|group?.itemEffect?.type|需要进一步测试|
|src/domain/competition/effects.js:73|ix|(group.inventory ／／ []).findIndex((x) => x.key === "mega")|需要进一步测试|
|src/domain/competition/effects.js:87|type|group?.itemEffect?.type|需要进一步测试|
|src/domain/competition/effects.js:89|left|Number(group.itemEffect.roundsLeft)|需要进一步测试|
|src/domain/competition/effects.js:90|next|(Number.isSafeInteger(left) && left > 0 ? left : DEFENSIVE_ROUNDS) - 1|需要进一步测试|
|src/domain/competition/effects.js:95|effects|normalize(group)|需要进一步测试|
|src/domain/competition/effects.js:112|redirect|random() < 0.5|需要进一步测试|
|src/domain/competition/effects.js:121|answerDelta|after - before|需要进一步测试|
|src/domain/competition/effects.js:122|postDelta|0|需要进一步测试|
|src/domain/competition/effects.js:128|key||需要进一步测试|
|src/domain/competition/effects.js:141|left|Number(group.itemEffect?.roundsLeft)|需要进一步测试|
|src/domain/competition/phase.js:2|CompetitionPhase|(() => {   function derive(round) {     if (!round.hasStartedOnce) return "NOT_STARTED";     if (!round.roundActive) return "FINISHED";     if (round.evaluated)|需要进一步测试|
|src/domain/competition/ranking.js:2|RankingRules|(() => {   function ordered(groups) {     return groups       .map((group, index) => ({ group, index }))       .sort(         (a, b) =>           (Number(b.grou|需要进一步测试|
|src/domain/competition/rules.js:2|CompetitionRules|(() => {   function calculateRound({ groups, correctAns }) {     if (!Array.isArray(groups)) throw new TypeError("小组数据必须是数组");     if (!["A", "B", "C", "D"].inc|需要进一步测试|
|src/domain/competition/rules.js:8|scoreBefore|Number(group.score)|需要进一步测试|
|src/domain/competition/rules.js:11|answered|!!group.selectedOpt|需要进一步测试|
|src/domain/competition/rules.js:12|correct|answered && group.selectedOpt === correctAns|需要进一步测试|
|src/domain/competition/rules.js:13|allIn|!!group.allIn|需要进一步测试|
|src/domain/competition/rules.js:14|scoreAfter|scoreBefore|需要进一步测试|
|src/domain/competition/score-adjustments.js:2|ScoreAdjustments|(() => {   function set(group, after) {     const before = group.score;     if (!Number.isSafeInteger(before) ／／ !Number.isSafeInteger(after))       throw new E|需要进一步测试|
|src/domain/competition/score-adjustments.js:4|before|group.score|需要进一步测试|
|src/domain/events.js:2|DomainEvents|(() => {   const SCHEMA_VERSION = 1;   const SOURCES = new Set(["classroom", "manual", "import", "system", "test"]);   const TYPES = new Set([     "ROUND_SETTLE|需要进一步测试|
|src/domain/events.js:3|SCHEMA_VERSION|1|需要进一步测试|
|src/domain/events.js:4|SOURCES|new Set(["classroom", "manual", "import", "system", "test"])|需要进一步测试|
|src/domain/events.js:5|TYPES|new Set([     "ROUND_SETTLED",     "ITEM_ACQUIRED",     "ITEM_USED",     "ITEM_HIT",     "DEFENSE_RESOLVED",     "EFFECT_APPLIED",     "EFFECT_EXPIRED",     "RA|需要进一步测试|
|src/domain/events.js:17|MAX_PAYLOAD_BYTES|64 * 1024|需要进一步测试|
|src/domain/events.js:25|{ cloneJson, deepFreeze }|DomainValues|需要进一步测试|
|src/domain/events.js:28|date|value instanceof Date ? value : new Date(value)|需要进一步测试|
|src/domain/events.js:40|id|requiredText(commandId, "commandId")|需要进一步测试|
|src/domain/events.js:46|sequence|0|需要进一步测试|
|src/domain/events.js:47|closed|false|需要进一步测试|
|src/domain/events.js:48|records|[]|需要进一步测试|
|src/domain/events.js:56|aggregateType|requiredText(aggregate.type, "aggregate.type", 64)|需要进一步测试|
|src/domain/events.js:57|aggregateId|requiredText(         String(aggregate.id ?? ""),         "aggregate.id",       )|需要进一步测试|
|src/domain/events.js:61|safePayload|cloneJson(payload)|需要进一步测试|
|src/domain/events.js:68|serialized|JSON.stringify(safePayload)|需要进一步测试|
|src/domain/events.js:69|utf8Bytes|encodeURIComponent(serialized).replace(         /%[0-9A-F]{2}/gi,         "x",       ).length|需要进一步测试|
|src/domain/events.js:75|nextSequence|sequence + 1|需要进一步测试|
|src/domain/events.js:76|event|deepFreeze({         schemaVersion: SCHEMA_VERSION,         eventId: ${id}:${nextSequence},         commandId: id,         sequence: nextSequence,         typ|需要进一步测试|
|src/domain/home-layout.js:4|GRID_COLUMNS|12|需要进一步测试|
|src/domain/home-layout.js:5|MAX_INSTANCES|100|需要进一步测试|
|src/domain/home-layout.js:6|MAX_ROWS|500|需要进一步测试|
|src/domain/home-layout.js:7|TYPE_ID|/^[a-z][a-z0-9.-]{1,100}$/|需要进一步测试|
|src/domain/home-layout.js:8|INSTANCE_ID|/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/|需要进一步测试|
|src/domain/home-layout.js:9|clone|(value) => JSON.parse(JSON.stringify(value))|需要进一步测试|
|src/domain/home-layout.js:10|fail|(message) => {     throw new TypeError(message);   }|需要进一步测试|
|src/domain/home-layout.js:28|item||需要进一步测试|
|src/domain/home-layout.js:33|key||需要进一步测试|
|src/domain/home-layout.js:65|map|new Map()|需要进一步测试|
|src/domain/home-layout.js:66|definition||需要进一步测试|
|src/domain/home-layout.js:114|ids|new Set()|需要进一步测试|
|src/domain/home-layout.js:115|instances|input.instances.map((instance) => {       const p = instance?.position;       if (         !instance ／／         typeof instance.instanceId !== "string" ／／      |需要进一步测试|
|src/domain/home-layout.js:116|p|instance?.position|需要进一步测试|
|src/domain/home-layout.js:150|i|0|需要进一步测试|
|src/domain/home-layout.js:151|j|i + 1|需要进一步测试|
|src/domain/home-layout.js:185|instances|[]|需要进一步测试|
|src/domain/home-layout.js:186|x|0|需要进一步测试|
|src/domain/home-layout.js:187|y|0|需要进一步测试|
|src/domain/home-layout.js:188|rowHeight|0|需要进一步测试|
|src/domain/home-layout.js:189|card||需要进一步测试|
|src/domain/home-layout.js:190|size|card?.size|需要进一步测试|
|src/domain/home-layout.js:198|instanceId|makeInstanceId()|需要进一步测试|
|src/domain/home-layout.js:223|types|normalizeCatalog(catalog)|需要进一步测试|
|src/domain/home-layout.js:226|saved|validateLayout(initial ／／ emptyLayout())|需要进一步测试|
|src/domain/home-layout.js:227|draft|clone(saved)|需要进一步测试|
|src/domain/home-layout.js:228|undoStack|[]|需要进一步测试|
|src/domain/home-layout.js:229|redoStack|[]|需要进一步测试|
|src/domain/home-layout.js:230|requireType|(typeId) => {       const type = types.get(typeId);       if (!type) fail("card type is unavailable");       return type;     }|需要进一步测试|
|src/domain/home-layout.js:231|type|types.get(typeId)|需要进一步测试|
|src/domain/home-layout.js:235|requireInstance|(id) => {       const value = draft.instances.find(         (instance) => instance.instanceId === id,       );       if (!value) fail("card instance was not fou|需要进一步测试|
|src/domain/home-layout.js:236|value|draft.instances.find(         (instance) => instance.instanceId === id,       )|需要进一步测试|
|src/domain/home-layout.js:243|valid|validateLayout(next)|需要进一步测试|
|src/domain/home-layout.js:250|y|0|需要进一步测试|
|src/domain/home-layout.js:251|x|0|需要进一步测试|
|src/domain/home-layout.js:252|candidate|{ x, y, w, h }|需要进一步测试|
|src/domain/home-layout.js:266|target|requireInstance(changedId)|需要进一步测试|
|src/domain/home-layout.js:267|instances|clone(draft.instances)|需要进一步测试|
|src/domain/home-layout.js:268|targetCopy|instances.find(         (item) => item.instanceId === changedId,       )|需要进一步测试|
|src/domain/home-layout.js:272|placed|targetCopy.visible ? [targetCopy] : []|需要进一步测试|
|src/domain/home-layout.js:273|rest|instances         .filter((item) => item.instanceId !== changedId && item.visible)         .sort(           (a, b) =>             a.position.y - b.position.y ／／|需要进一步测试|
|src/domain/home-layout.js:281|item||需要进一步测试|
|src/domain/home-layout.js:282|preferred|{ ...item.position }|需要进一步测试|
|src/domain/home-layout.js:283|candidate|preferred|需要进一步测试|
|src/domain/home-layout.js:300|type|requireType(typeId)|需要进一步测试|
|src/domain/home-layout.js:309|instanceId|makeInstanceId()|需要进一步测试|
|src/domain/home-layout.js:312|instance|{           instanceId,           typeId,           position: freePosition(type.size.defaultW, type.size.defaultH),           visible: true,           configVer|需要进一步测试|
|src/domain/home-layout.js:331|source|requireInstance(id)|需要进一步测试|
|src/domain/home-layout.js:332|type|requireType(source.typeId)|需要进一步测试|
|src/domain/home-layout.js:337|instanceId|makeInstanceId()|需要进一步测试|
|src/domain/home-layout.js:340|instance|{           ...clone(source),           instanceId,           position: freePosition(source.position.w, source.position.h),           config: clone(source.confi|需要进一步测试|
|src/domain/home-layout.js:352|instance|requireInstance(id)|需要进一步测试|
|src/domain/home-layout.js:353|position|{           ...instance.position,           x: Math.max(0, Math.min(GRID_COLUMNS - instance.position.w, x)),           y: Math.max(0, Math.min(MAX_ROWS, y)),   |需要进一步测试|
|src/domain/home-layout.js:361|instance|requireInstance(id)|需要进一步测试|
|src/domain/home-layout.js:362|type|requireType(instance.typeId)|需要进一步测试|
|src/domain/home-layout.js:365|position|{           x: Math.max(0, Math.min(GRID_COLUMNS - type.size.minW, x)),           y: Math.max(0, Math.min(MAX_ROWS, y)),           w: Math.max(type.size.minW, M|需要进一步测试|
|src/domain/home-layout.js:376|instance|requireInstance(id)|需要进一步测试|
|src/domain/home-layout.js:377|instances|clone(draft.instances)|需要进一步测试|
|src/domain/home-layout.js:383|instance|requireInstance(id)|需要进一步测试|
|src/domain/home-layout.js:387|instances|clone(draft.instances)|需要进一步测试|
|src/domain/home-layout.js:388|item|instances.find((entry) => entry.instanceId === id)|需要进一步测试|
|src/domain/home-layout.js:415|next|validateLayout({ ...draft, revision: saved.revision + 1 })|需要进一步测试|
|src/domain/identity.js:2|StableIdentity|(() => {   const GROUP_UID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;   const fallbackEpoch = (     globalThis.performance?.timeOrigin ?? Date.now()   ).t|需要进一步测试|
|src/domain/identity.js:3|GROUP_UID_PATTERN|/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/|需要进一步测试|
|src/domain/identity.js:4|fallbackEpoch|(     globalThis.performance?.timeOrigin ?? Date.now()   ).toString(36)|需要进一步测试|
|src/domain/identity.js:7|fallbackSequence|0|需要进一步测试|
|src/domain/identity.js:18|bytes|globalThis.crypto.getRandomValues(new Uint8Array(16))|需要进一步测试|
|src/domain/identity.js:21|hex|[...bytes]           .map((value) => value.toString(16).padStart(2, "0"))           .join("")|需要进一步测试|
|src/domain/identity.js:30|clock|(globalThis.performance?.now?.() ?? 0).toString(36)|需要进一步测试|
|src/domain/identity.js:34|createGroupUid|() => createUuid("group")|需要进一步测试|
|src/domain/identity.js:35|createItemInstanceId|() => createUuid("item")|需要进一步测试|
|src/domain/identity.js:36|createSeasonId|() => createUuid("season")|需要进一步测试|
|src/domain/identity.js:37|createCommandId|() => createUuid("command")|需要进一步测试|
|src/domain/identity.js:38|createUserProfileId|() => createUuid("profile")|需要进一步测试|
|src/domain/identity.js:39|createClassroomId|() => createUuid("classroom")|需要进一步测试|
|src/domain/identity.js:40|createStudentUid|() => createUuid("student")|需要进一步测试|
|src/domain/identity.js:41|createScheduleId|() => createUuid("schedule")|需要进一步测试|
|src/domain/identity.js:42|createResourceId|() => createUuid("resource")|需要进一步测试|
|src/domain/identity.js:48|used|new Set()|需要进一步测试|
|src/domain/identity.js:50|copy|group && typeof group === "object" && !Array.isArray(group)           ? { ...group }           : {}|需要进一步测试|
|src/domain/identity.js:54|uid|isValidGroupUid(copy.groupUid) && !used.has(copy.groupUid)           ? copy.groupUid           : ""|需要进一步测试|
|src/domain/identity.js:58|attempt|0|需要进一步测试|
|src/domain/identity.js:59|candidate|idFactory()|需要进一步测试|
|src/domain/identity.js:103|used|new Set()|需要进一步测试|
|src/domain/identity.js:105|copy|item && typeof item === "object" && !Array.isArray(item)             ? { ...item }             : {}|需要进一步测试|
|src/domain/identity.js:109|uid|typeof copy[field] === "string" &&           copy[field].startsWith(prefix) &&           isValidGroupUid(copy[field]) &&           !used.has(copy[field])       |需要进一步测试|
|src/domain/identity.js:116|attempt|0|需要进一步测试|
|src/domain/identity.js:117|candidate|makeId()|需要进一步测试|
|src/domain/items/defense-policy.js:2|DefensePolicy|(() => {   function choose(     g,     attackType,     { eligible, shellAttack, ignorePrimary = false },   ) {     if (Number(g?.booRoundsLeftV218 ／／ 0) > 0 && |需要进一步测试|
|src/domain/items/defense-policy.js:10|main|ignorePrimary ? undefined : g?.inventory?.[0]|需要进一步测试|
|src/domain/items/impact-facts.js:2|ItemImpactFacts|(() => {   function scoreLosses(     beforeGroups,     afterGroups,     { actorGroupUid, itemKey, seasonId },   ) {     if (!Array.isArray(beforeGroups) ／／ !Arr|需要进一步测试|
|src/domain/items/impact-facts.js:12|beforeByUid|new Map(       beforeGroups         .filter((group) => typeof group?.groupUid === "string")         .map((group) => [group.groupUid, group]),     )|需要进一步测试|
|src/domain/items/impact-facts.js:17|facts|[]|需要进一步测试|
|src/domain/items/impact-facts.js:18|after||需要进一步测试|
|src/domain/items/impact-facts.js:25|before|beforeByUid.get(after.groupUid)|需要进一步测试|
|src/domain/items/impact-facts.js:26|scoreBefore|before?.score|需要进一步测试|
|src/domain/items/impact-facts.js:27|scoreAfter|after.score|需要进一步测试|
|src/domain/items/targets.js:2|ItemTargets|(() => {   function select(kind, context, { random, eligible }) {     const randomOne = (pool) =>       pool.length ? [pool[Math.floor(random() * pool.length)]]|需要进一步测试|
|src/domain/items/targets.js:4|randomOne|(pool) =>       pool.length ? [pool[Math.floor(random() * pool.length)]] : []|需要进一步测试|
|src/domain/items/targets.js:6|selectors|{       self: (c) => [c.group],       randomOther: (c) => randomOne(c.others),       above: (c) => [c.ranking[c.position - 1]].filter(Boolean),       below: (c)|需要进一步测试|
|src/domain/items/targets.js:34|[center]|randomOne(c.others)|需要进一步测试|
|src/domain/items/targets.js:36|i|c.ranking.indexOf(center)|需要进一步测试|
|src/domain/items/targets.js:42|selector|selectors[kind]|需要进一步测试|
|src/domain/teaching-resource.js:4|MAX_BYTES|20 * 1024 * 1024|需要进一步测试|
|src/domain/teaching-resource.js:5|FORMATS|Object.freeze({     ".pdf": { mimeType: "application/pdf", kind: "pdf" },     ".txt": { mimeType: "text/plain", kind: "text" },     ".json": { mimeType: "applic|需要进一步测试|
|src/domain/teaching-resource.js:14|fail|(message) => {     throw new TypeError(message);   }|需要进一步测试|
|src/domain/teaching-resource.js:20|index|fileName.lastIndexOf(".")|需要进一步测试|
|src/domain/teaching-resource.js:57|format|formatFor(input.fileName)|需要进一步测试|
|src/domain/teaching-resource.js:78|tags|[       ...new Set(         input.tags.map((tag) => {           if (typeof tag !== "string" ／／ !tag.trim() ／／ tag.trim().length > 40)             fail("each tag|需要进一步测试|
|src/domain/teaching-resource.js:104|bytes|rawBytes instanceof Uint8Array ? rawBytes : new Uint8Array(rawBytes)|需要进一步测试|
|src/domain/teaching-resource.js:108|format|formatFor(input?.fileName)|需要进一步测试|
|src/domain/teaching-resource.js:111|starts|(...expected) =>       expected.every((value, index) => bytes[index] === value)|需要进一步测试|
|src/domain/teaching-resource.js:128|decoder|new TextDecoder("utf-8", { fatal: true })|需要进一步测试|
|src/domain/teaching-resource.js:130|text|decoder.decode(bytes)|需要进一步测试|
|src/domain/teaching-resource.js:140|header|new TextDecoder("latin1").decode(         bytes.slice(0, Math.min(bytes.length, 1024)),       )|需要进一步测试|
|src/domain/teaching-resource.js:145|searchable|new TextDecoder("latin1").decode(bytes)|需要进一步测试|
|src/domain/teaching-schedule.js:3|clone|(value) => JSON.parse(JSON.stringify(value))|需要进一步测试|
|src/domain/teaching-schedule.js:4|fail|(message) => {     throw new TypeError(message);   }|需要进一步测试|
|src/domain/teaching-schedule.js:17|ids|new Set()|需要进一步测试|
|src/domain/teaching-schedule.js:18|entries|input.entries.map((entry) => {       if (         !entry ／／         typeof entry !== "object" ／／         !root.StableIdentity.isValidGroupUid(entry.scheduleId) |需要进一步测试|
|src/domain/teaching-schedule.js:66|i|0|需要进一步测试|
|src/domain/teaching-schedule.js:67|j|i + 1|需要进一步测试|
|src/domain/teaching-schedule.js:68|left|entries[i]|需要进一步测试|
|src/domain/teaching-schedule.js:69|right|entries[j]|需要进一步测试|
|src/domain/teaching-schedule.js:92|valid|validateDocument(scheduleDocument)|需要进一步测试|
|src/domain/values.js:2|DomainValues|(() => {   function cloneJson(value, seen = new Set(), depth = 0) {     if (depth > 24)       throw new TypeError("event payload exceeds JSON depth limit");    |需要进一步测试|
|src/domain/values.js:20|prototype|Object.getPrototypeOf(value)|需要进一步测试|
|src/domain/values.js:25|output||需要进一步测试|
|src/domain/values.js:32|key||需要进一步测试|
|src/domain/values.js:35|descriptor|Object.getOwnPropertyDescriptor(value, key)|需要进一步测试|
|src/domain/values.js:50|child||需要进一步测试|
|src/infrastructure/classroom-roster-repository.js:3|KEY|"godpower_classroom_roster_v1"|需要进一步测试|
|src/infrastructure/classroom-roster-repository.js:4|clone|(value) => JSON.parse(JSON.stringify(value))|需要进一步测试|
|src/infrastructure/classroom-roster-repository.js:15|raw|storage.getItem(key)|需要进一步测试|
|src/infrastructure/classroom-roster-repository.js:18|envelope|JSON.parse(raw)|需要进一步测试|
|src/infrastructure/classroom-roster-repository.js:38|current|read()|需要进一步测试|
|src/infrastructure/classroom-roster-repository.js:49|valid||需要进一步测试|
|src/infrastructure/classroom-roster-repository.js:55|previous|storage.getItem(key)|需要进一步测试|
|src/infrastructure/classroom-roster-repository.js:56|revision|current.revision + 1|需要进一步测试|
|src/infrastructure/classroom-roster-repository.js:57|encoded|JSON.stringify({         schemaVersion: 1,         revision,         rosterData: valid,       })|需要进一步测试|
|src/infrastructure/home-layout-repository.js:3|KEY|"godpower_home_layout_v1"|需要进一步测试|
|src/infrastructure/home-layout-repository.js:4|clone|(value) => JSON.parse(JSON.stringify(value))|需要进一步测试|
|src/infrastructure/home-layout-repository.js:16|raw||需要进一步测试|
|src/infrastructure/home-layout-repository.js:29|envelope|JSON.parse(raw)|需要进一步测试|
|src/infrastructure/home-layout-repository.js:52|current|read()|需要进一步测试|
|src/infrastructure/home-layout-repository.js:63|valid||需要进一步测试|
|src/infrastructure/home-layout-repository.js:69|previous||需要进一步测试|
|src/infrastructure/home-layout-repository.js:79|revision|current.revision + 1|需要进一步测试|
|src/infrastructure/home-layout-repository.js:80|envelope|{ schemaVersion: 1, revision, layout: valid }|需要进一步测试|
|src/infrastructure/home-layout-repository.js:81|encoded|JSON.stringify(envelope)|需要进一步测试|
|src/infrastructure/home-layout-repository.js:113|current|read()|需要进一步测试|
|src/infrastructure/home-layout-repository.js:115|layout||需要进一步测试|
|src/infrastructure/indexeddb/repository.js:3|TransactionalRepository|(() => {   const STORES = [     "aggregates",     "commands",     "events",     "archives",     "resources",     "migrations",   ];   const KEYS = [     "id",  |需要进一步测试|
|src/infrastructure/indexeddb/repository.js:4|STORES|[     "aggregates",     "commands",     "events",     "archives",     "resources",     "migrations",   ]|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:12|KEYS|[     "id",     "commandId",     "eventId",     "archiveId",     "resourceId",     "migrationId",   ]|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:21|error|new Error(message)|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:39|bytes|new TextEncoder().encode(JSON.stringify(value))|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:40|digest|await globalThis.crypto.subtle.digest("SHA-256", bytes)|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:47|tx|db.transaction(names, "readwrite")|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:48|result|null|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:49|failure|null|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:50|abort|(error) => {         failure =           typeof error?.code === "string"             ? error             : fault("TRANSACTION_ABORTED", String(error?.message ／／|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:61|guard|(fn) => (event) => {         try {           fn(event);         } catch (error) {           abort(error);         }       }|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:99|tx|db.transaction(store, "readonly")|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:100|request|tx.objectStore(store).get(key)|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:122|db|await new Promise((resolve, reject) => {       const request = indexedDB.open(name, 1);       request.onupgradeneeded = () => {         const database = request|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:123|request|indexedDB.open(name, 1)|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:125|database|request.result|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:130|events|request.transaction.objectStore("events")|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:153|{         commandId,         aggregateId,         expectedRevision,         snapshot,         events = [],         archive = null,         intent = null,       }|structuredClone(request)|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:172|event||需要进一步测试|
|src/infrastructure/indexeddb/repository.js:178|requestHash|await fingerprint({         commandId,         aggregateId,         expectedRevision,         snapshot,         events,         archive,         intent,       }|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:187|intentHash|intent === null ? null : await fingerprint(intent)|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:192|commands|tx.objectStore("commands")|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:193|existing|commands.get(commandId)|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:210|aggregates|tx.objectStore("aggregates")|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:211|current|aggregates.get(aggregateId)|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:213|revision|current.result?.revision ／／ 0|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:228|result|{                 ok: true,                 revision: revision + 1,                 duplicate: false,                 eventsPersisted: events.length > 0,       |需要进一步测试|
|src/infrastructure/indexeddb/repository.js:239|event||需要进一步测试|
|src/infrastructure/indexeddb/repository.js:259|captured||需要进一步测试|
|src/infrastructure/indexeddb/repository.js:265|{         migrationId,         sourceManifest,         aggregateId,         snapshot,         archives = [],         resources = [],       }|captured|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:282|archive||需要进一步测试|
|src/infrastructure/indexeddb/repository.js:284|resource||需要进一步测试|
|src/infrastructure/indexeddb/repository.js:286|sourceHash|await fingerprint({ aggregateId, sourceManifest })|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:291|migrations|tx.objectStore("migrations")|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:292|receipt|migrations.get(migrationId)|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:304|aggregates|tx.objectStore("aggregates")|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:305|current|aggregates.get(aggregateId)|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:315|archive||需要进一步测试|
|src/infrastructure/indexeddb/repository.js:317|resource||需要进一步测试|
|src/infrastructure/indexeddb/repository.js:319|result|{                 migrationId,                 sourceHash,                 aggregateId,                 complete: true,                 archives: archives.lengt|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:336|{ migrationId, aggregateId, sourceManifest }|structuredClone({         migrationId: plan.migrationId,         aggregateId: plan.aggregateId,         sourceManifest: plan.sourceManifest,       })|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:341|check|structuredClone(report)|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:344|allowed|[         "VERIFYING",         "VERIFIED",         "DESTINATION_INVALID",         "STAGED_SOURCE_CHANGED",         "CANCELLED_STAGED",       ]|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:353|sourceHash|await fingerprint({ aggregateId, sourceManifest })|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:358|store|tx.objectStore("migrations")|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:359|request|store.get(migrationId)|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:361|receipt|request.result|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:373|current|tx.objectStore("aggregates").get(aggregateId)|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:395|verification|{                 status: check.status,                 checkedAt: new Date().toISOString(),                 sourceHash,                 sourceRechecked: check.|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:412|tx|db.transaction("events", "readonly")|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:413|request|tx           .objectStore("events")           .index("aggregateId")           .getAll(aggregateId)|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:426|intentHash|await fingerprint(structuredClone(intent))|需要进一步测试|
|src/infrastructure/indexeddb/repository.js:427|record|await readOne(db, "commands", commandId)|需要进一步测试|
|src/infrastructure/legacy/audio-migration.js:2|LegacyAudioMigration|(() => {   function alias(id) {     const fixed = {       bgm_intro_0: "bgm_set_0_intro_normal",       bgm_thinking: "bgm_set_0_thinking",       bgm_battle: "bg|需要进一步测试|
|src/infrastructure/legacy/audio-migration.js:4|fixed|{       bgm_intro_0: "bgm_set_0_intro_normal",       bgm_thinking: "bgm_set_0_thinking",       bgm_battle: "bgm_set_0_battle",       bgm_victory: "bgm_set_0_vic|需要进一步测试|
|src/infrastructure/legacy/audio-migration.js:17|missing|false|需要进一步测试|
|src/infrastructure/legacy/audio-migration.js:18|request|indexedDB.open(name)|需要进一步测试|
|src/infrastructure/legacy/audio-migration.js:30|source|await openExisting(indexedDB, name)|需要进一步测试|
|src/infrastructure/legacy/audio-migration.js:35|tx|source.transaction("sounds", "readonly")|需要进一步测试|
|src/infrastructure/legacy/audio-migration.js:36|request|tx.objectStore("sounds").getAll()|需要进一步测试|
|src/infrastructure/legacy/audio-migration.js:56|records|new Map()|需要进一步测试|
|src/infrastructure/legacy/audio-migration.js:57|name||需要进一步测试|
|src/infrastructure/legacy/audio-migration.js:58|record||需要进一步测试|
|src/infrastructure/legacy/audio-migration.js:65|id|alias(record.id)|需要进一步测试|
|src/infrastructure/legacy/audio-migration.js:69|copiedRecords|[]|需要进一步测试|
|src/infrastructure/legacy/audio-migration.js:70|counts|await new Promise((resolve, reject) => {       const tx = destination.transaction("sounds", "readwrite");       const store = tx.objectStore("sounds");       le|需要进一步测试|
|src/infrastructure/legacy/audio-migration.js:71|tx|destination.transaction("sounds", "readwrite")|需要进一步测试|
|src/infrastructure/legacy/audio-migration.js:72|store|tx.objectStore("sounds")|需要进一步测试|
|src/infrastructure/legacy/audio-migration.js:73|copied|0|需要进一步测试|
|src/infrastructure/legacy/audio-migration.js:74|skipped|0|需要进一步测试|
|src/infrastructure/legacy/audio-migration.js:75|failure|null|需要进一步测试|
|src/infrastructure/legacy/audio-migration.js:76|record||需要进一步测试|
|src/infrastructure/legacy/audio-migration.js:77|existing|store.get(record.id)|需要进一步测试|
|src/infrastructure/legacy/audio-migration.js:99|tx|destination.transaction("sounds", "readonly")|需要进一步测试|
|src/infrastructure/legacy/audio-migration.js:100|checks|copiedRecords.map((record) => ({           record,           request: tx.objectStore("sounds").get(record.id),         }))|需要进一步测试|
|src/infrastructure/legacy/audio-migration.js:105|{ record, request }||需要进一步测试|
|src/infrastructure/legacy/audio-migration.js:106|actual|request.result?.arrayBuffer|需要进一步测试|
|src/infrastructure/legacy/audio-migration.js:107|expected|new Uint8Array(record.arrayBuffer)|需要进一步测试|
|src/infrastructure/legacy/classroom-repository.js:2|ClassroomRepository|(() => {   function writeVerified(storage, key, data) {     try {       const text = JSON.stringify(data);       storage.setItem(key, text);       if (storage.g|需要进一步测试|
|src/infrastructure/legacy/classroom-repository.js:5|text|JSON.stringify(data)|需要进一步测试|
|src/infrastructure/legacy/classroom-repository.js:16|raw|storage.getItem("politics_settlement_history")|需要进一步测试|
|src/infrastructure/legacy/classroom-repository.js:17|archives|raw == null ? [] : JSON.parse(raw)|需要进一步测试|
|src/infrastructure/legacy/classroom-repository.js:20|sameArchive|(old) =>         record.seasonId && old?.seasonId           ? old.seasonId === record.seasonId           : !record.seasonId && old?.id === record.id|需要进一步测试|
|src/infrastructure/legacy/classroom-repository.js:24|existing|archives.find(sameArchive)|需要进一步测试|
|src/infrastructure/legacy/classroom-repository.js:26|comparableSnapshot|(entry) => {           const data = entry?.clearedData;           if (!data ／／ !Array.isArray(data.groups)) return null;           return JSON.stringify({      |需要进一步测试|
|src/infrastructure/legacy/classroom-repository.js:27|data|entry?.clearedData|需要进一步测试|
|src/infrastructure/legacy/classroom-repository.js:36|previousSnapshot|comparableSnapshot(existing)|需要进一步测试|
|src/infrastructure/legacy/classroom-repository.js:37|retrySnapshot|comparableSnapshot(record)|需要进一步测试|
|src/infrastructure/legacy/classroom-repository.js:63|{       currentKey,       legacyKey,       receiptKey,       migrate,       validate,       fallbackData = null,       fallbackSource = "legacy-mirror-keys",       now = () => new Date(),     }|options|需要进一步测试|
|src/infrastructure/legacy/classroom-repository.js:73|previousTarget|null|需要进一步测试|
|src/infrastructure/legacy/classroom-repository.js:74|targetWasWritten|false|需要进一步测试|
|src/infrastructure/legacy/classroom-repository.js:75|stage|"read-current"|需要进一步测试|
|src/infrastructure/legacy/classroom-repository.js:76|candidate|null|需要进一步测试|
|src/infrastructure/legacy/classroom-repository.js:78|targetRaw|storage.getItem(currentKey)|需要进一步测试|
|src/infrastructure/legacy/classroom-repository.js:82|original|parse(targetRaw, "当前主存档")|需要进一步测试|
|src/infrastructure/legacy/classroom-repository.js:83|current|migrate(original)|需要进一步测试|
|src/infrastructure/legacy/classroom-repository.js:89|upgraded|JSON.stringify(current)|需要进一步测试|
|src/infrastructure/legacy/classroom-repository.js:103|sourceRaw|legacyKey ? storage.getItem(legacyKey) : null|需要进一步测试|
|src/infrastructure/legacy/classroom-repository.js:104|source|sourceRaw === null           ? typeof fallbackData === "function"             ? fallbackData()             : fallbackData           : parse(sourceRaw, "旧版主存档")|需要进一步测试|
|src/infrastructure/legacy/classroom-repository.js:114|migrated|migrate(source)|需要进一步测试|
|src/infrastructure/legacy/classroom-repository.js:117|serialized|JSON.stringify(migrated)|需要进一步测试|
|src/infrastructure/legacy/classroom-repository.js:125|sourceLabel|sourceRaw === null ? fallbackSource : legacyKey|需要进一步测试|
|src/infrastructure/legacy/classroom-repository.js:126|receipt|{         migrationId: "classroom-envelope-v1-to-v2",         status: "complete",         source: sourceLabel,         target: currentKey,         schemaVersion|需要进一步测试|
|src/infrastructure/legacy/classroom-repository.js:136|receiptResult|writeVerified(storage, receiptKey, receipt)|需要进一步测试|
|src/infrastructure/legacy/classroom-repository.js:145|rollbackError|null|需要进一步测试|
|src/infrastructure/legacy/inventory.js:2|LegacyStorageInventory|(() => {   const DATABASES = [     "PoliticsScoreSoundDB_Unified",     "PoliticsScoreSoundDB_v3",     "PoliticsScoreSoundDB",     "PoliticsUiDB",   ];   async f|需要进一步测试|
|src/infrastructure/legacy/inventory.js:3|DATABASES|[     "PoliticsScoreSoundDB_Unified",     "PoliticsScoreSoundDB_v3",     "PoliticsScoreSoundDB",     "PoliticsUiDB",   ]|需要进一步测试|
|src/infrastructure/legacy/inventory.js:12|hash|await crypto.subtle.digest("SHA-256", bytes)|需要进一步测试|
|src/infrastructure/legacy/inventory.js:17|utf8|(value) => new TextEncoder().encode(value)|需要进一步测试|
|src/infrastructure/legacy/inventory.js:57|result|Array.isArray(value)       ? [           "array",           await Promise.all(             value.map((entry) => canonical(entry, new Set(seen))),           ),  |需要进一步测试|
|src/infrastructure/legacy/inventory.js:81|keys|Array.from({ length: storage.length }, (_, index) =>       storage.key(index),     )       .filter(         (key) => typeof key === "string" && /^(godpower_／pol|需要进一步测试|
|src/infrastructure/legacy/inventory.js:91|db|await new Promise((resolve, reject) => {       const request = indexedDB.open(name);       request.onupgradeneeded = () => {         request.transaction.abort()|需要进一步测试|
|src/infrastructure/legacy/inventory.js:92|request|indexedDB.open(name)|需要进一步测试|
|src/infrastructure/legacy/inventory.js:105|stores|[...db.objectStoreNames]|需要进一步测试|
|src/infrastructure/legacy/inventory.js:108|tx|db.transaction(stores, "readonly")|需要进一步测试|
|src/infrastructure/legacy/inventory.js:109|requests|stores.map((store) => ({           store,           values: tx.objectStore(store).getAll(),           keys: tx.objectStore(store).getAllKeys(),         }))|需要进一步测试|
|src/infrastructure/legacy/inventory.js:138|localEntries|readLocal(storage)|需要进一步测试|
|src/infrastructure/legacy/inventory.js:139|resources|[]|需要进一步测试|
|src/infrastructure/legacy/inventory.js:140|sourceManifest|[]|需要进一步测试|
|src/infrastructure/legacy/inventory.js:141|entry||需要进一步测试|
|src/infrastructure/legacy/inventory.js:149|existing|new Map(       (await indexedDB.databases()).map((database) => [         database.name,         database.version,       ]),     )|需要进一步测试|
|src/infrastructure/legacy/inventory.js:155|database||需要进一步测试|
|src/infrastructure/legacy/inventory.js:156|present|existing.has(database)|需要进一步测试|
|src/infrastructure/legacy/inventory.js:167|record||需要进一步测试|
|src/infrastructure/legacy/inventory.js:168|identity|${database}／${record.store}／${JSON.stringify(await canonical(record.key))}|需要进一步测试|
|src/infrastructure/legacy/inventory.js:169|resourceId|"legacy-resource-" + (await hashValue(identity))|需要进一步测试|
|src/infrastructure/legacy/inventory.js:170|sha256|await hashValue(record.payload)|需要进一步测试|
|src/infrastructure/legacy/inventory.js:191|changedDuringRead|JSON.stringify(localEntries) !== JSON.stringify(readLocal(storage))|需要进一步测试|
|src/infrastructure/legacy/inventory.js:206|map|new Map(       captured.localEntries.map((entry) => [entry.key, entry.raw]),     )|需要进一步测试|
|src/infrastructure/legacy/inventory.js:209|storage|{ getItem: (key) => map.get(key) ?? null }|需要进一步测试|
|src/infrastructure/legacy/inventory.js:210|sourceHash|await hashValue({       sourceOrigin: captured.sourceOrigin,       manifest: captured.sourceManifest,     })|需要进一步测试|
|src/infrastructure/legacy/inventory.js:214|identitySequence|0|需要进一步测试|
|src/infrastructure/legacy/inventory.js:215|newIdentity|(prefix) =>       ${prefix}-migrate-${sourceHash}-${++identitySequence}|需要进一步测试|
|src/infrastructure/legacy/inventory.js:217|identity|{       ...StableIdentity,       createGroupUid: () => newIdentity("group"),       createItemInstanceId: () => newIdentity("item"),       createSeasonId: () => |需要进一步测试|
|src/infrastructure/legacy/inventory.js:225|raw|storage.getItem("godpower_state_v2") ??       storage.getItem("godpower_state_v1")|需要进一步测试|
|src/infrastructure/legacy/inventory.js:228|legacy|raw === null         ? SchemaMigrations.fromLegacyKeys(storage, { now: () => new Date(0) })         : JSON.parse(raw)|需要进一步测试|
|src/infrastructure/legacy/inventory.js:235|snapshot|SchemaMigrations.migrateBackup(legacy, {       identity,       now: () => new Date(0),     })|需要进一步测试|
|src/infrastructure/legacy/inventory.js:242|resources|captured.resources.slice()|需要进一步测试|
|src/infrastructure/legacy/inventory.js:243|entry||需要进一步测试|
|src/infrastructure/legacy/inventory.js:250|archives|JSON.parse(       storage.getItem("politics_settlement_history") ／／ "[]",     )|需要进一步测试|
|src/infrastructure/legacy/inventory.js:280|captured|await capture({       ...options,       sourceOrigin: options.sourceOrigin ／／ plan.sourceOrigin,     })|需要进一步测试|
|src/infrastructure/legacy/inventory.js:284|ok|captured.ready &&       JSON.stringify(captured.sourceManifest) ===         JSON.stringify(plan.sourceManifest)|需要进一步测试|
|src/infrastructure/legacy/inventory.js:294|failures|[]|需要进一步测试|
|src/infrastructure/legacy/inventory.js:295|current|await repository.read(plan.aggregateId)|需要进一步测试|
|src/infrastructure/legacy/inventory.js:301|archive||需要进一步测试|
|src/infrastructure/legacy/inventory.js:302|actual|await repository.readArchive(archive.archiveId)|需要进一步测试|
|src/infrastructure/legacy/inventory.js:306|resource||需要进一步测试|
|src/infrastructure/legacy/inventory.js:307|actual|await repository.readResource(resource.resourceId)|需要进一步测试|
|src/infrastructure/legacy/inventory.js:311|receipt|await repository.getMigration(plan.migrationId)|需要进一步测试|
|src/infrastructure/legacy/schema-migrations.js:2|SchemaMigrations|(() => {   const CURRENT_SCHEMA_VERSION = 2;   const LEGACY_SCHEMA_VERSION = 1;    function copy(value) {     return JSON.parse(JSON.stringify(value));   }    f|需要进一步测试|
|src/infrastructure/legacy/schema-migrations.js:3|CURRENT_SCHEMA_VERSION|2|需要进一步测试|
|src/infrastructure/legacy/schema-migrations.js:4|LEGACY_SCHEMA_VERSION|1|需要进一步测试|
|src/infrastructure/legacy/schema-migrations.js:11|raw|storage.getItem(key)|需要进一步测试|
|src/infrastructure/legacy/schema-migrations.js:16|raw|storage.getItem(key)|需要进一步测试|
|src/infrastructure/legacy/schema-migrations.js:21|raw|storage.getItem(key)|需要进一步测试|
|src/infrastructure/legacy/schema-migrations.js:26|groups|parseKey(storage, "politics_groups_data", null)|需要进一步测试|
|src/infrastructure/legacy/schema-migrations.js:28|history|parseKey(storage, "politics_history_stack_v26", null) ??       parseKey(storage, "politics_history_v26", [])|需要进一步测试|
|src/infrastructure/legacy/schema-migrations.js:61|version|raw.schemaVersion == null ? LEGACY_SCHEMA_VERSION : raw.schemaVersion|需要进一步测试|
|src/infrastructure/legacy/schema-migrations.js:69|output|copy(raw)|需要进一步测试|
|src/infrastructure/legacy/schema-migrations.js:74|currentGroups|identity.assignGroupUids(output.groups)|需要进一步测试|
|src/infrastructure/legacy/schema-migrations.js:75|byLegacyId|new Map(       currentGroups.map((group) => [String(group.id), group.groupUid]),     )|需要进一步测试|
|src/infrastructure/legacy/schema-migrations.js:78|currentItemIds|new Map()|需要进一步测试|
|src/infrastructure/legacy/schema-migrations.js:79|historicItemIds|new Map()|需要进一步测试|
|src/infrastructure/legacy/schema-migrations.js:85|local|new Set()|需要进一步测试|
|src/infrastructure/legacy/schema-migrations.js:86|occurrences|new Map()|需要进一步测试|
|src/infrastructure/legacy/schema-migrations.js:88|value|item && typeof item === "object" && !Array.isArray(item)             ? { ...item }             : {}|需要进一步测试|
|src/infrastructure/legacy/schema-migrations.js:92|signature|signatureFor(uid, value)|需要进一步测试|
|src/infrastructure/legacy/schema-migrations.js:93|index|occurrences.get(signature) ／／ 0|需要进一步测试|
|src/infrastructure/legacy/schema-migrations.js:95|currentIds|currentItemIds.get(signature) ／／ []|需要进一步测试|
|src/infrastructure/legacy/schema-migrations.js:96|historyIds|historicItemIds.get(signature) ／／ []|需要进一步测试|
|src/infrastructure/legacy/schema-migrations.js:97|id|identity.isValidItemInstanceId(value.itemInstanceId)           ? value.itemInstanceId           : historic             ? currentIds[index] ／／ historyIds[index] |需要进一步测试|
|src/infrastructure/legacy/schema-migrations.js:122|migrated|{ ...snapshot }|需要进一步测试|
|src/infrastructure/legacy/schema-migrations.js:124|assigned|identity.assignGroupUids(             migrated.groups.map((group) => ({               ...group,               groupUid: identity.isValidGroupUid(group?.groupUid|需要进一步测试|
|src/infrastructure/save-file-bridge.js:6|bridge|() => globalThis.godpowerDesktop|需要进一步测试|
|src/infrastructure/save-file-bridge.js:7|info|null|需要进一步测试|
|src/infrastructure/save-file-bridge.js:8|ready|false|需要进一步测试|
|src/infrastructure/save-file-bridge.js:9|lastError|null|需要进一步测试|
|src/infrastructure/save-file-bridge.js:12|hydrating|true|需要进一步测试|
|src/infrastructure/save-file-bridge.js:13|hydrateSettled|false|需要进一步测试|
|src/infrastructure/save-file-bridge.js:16|desktop|bridge()|需要进一步测试|
|src/infrastructure/save-file-bridge.js:45|current|await refreshInfo()|需要进一步测试|
|src/infrastructure/save-file-bridge.js:47|result||需要进一步测试|
|src/infrastructure/save-file-bridge.js:98|result|await bridge().saveFileChoose()|需要进一步测试|
|src/infrastructure/save-file-bridge.js:112|result|await bridge().saveFileSet(value)|需要进一步测试|
|src/infrastructure/save-file-bridge.js:123|result|await bridge().saveFileReset()|需要进一步测试|
|src/infrastructure/save-file-bridge.js:135|result||需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:3|DATABASE|"godpower_teaching_resources_v1"|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:4|STORE|"resources"|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:5|BLOB_STORE|"resourceBlobs"|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:6|fault|(code, message) => Object.assign(new Error(message), { code })|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:49|database|await new Promise((resolve, reject) => {       const request = indexedDB.open(DATABASE, 1);       request.onupgradeneeded = () => {         const metadata = req|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:50|request|indexedDB.open(DATABASE, 1)|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:52|metadata|request.result.createObjectStore(STORE, {           keyPath: "resourceId",         })|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:84|file|input?.file|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:89|bytes|new Uint8Array(await file.arrayBuffer())|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:90|metadata|root.TeachingResource.validateFile(         {           resourceId:             input.resourceId ／／ root.StableIdentity.createResourceId(),           profileId:|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:135|prepared|await Promise.all(files.map(prepare))|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:136|ids|new Set()|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:137|hashes|new Set()|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:138|item||需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:151|estimate|await storageManager.estimate()|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:152|requestedBytes|prepared.reduce(             (sum, item) => sum + item.byteSize,             0,           )|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:170|tx|database.transaction([STORE, BLOB_STORE], "readwrite")|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:171|done|transactionDone(tx)|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:172|store|tx.objectStore(STORE)|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:173|existingChecks|prepared.map((item) =>         requestValue(store.index("sha256").get(item.sha256)),       )|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:176|existing|await Promise.all(existingChecks)|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:189|item||需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:190|{ blob, ...metadata }|item|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:196|readBack|await Promise.all(           prepared.map((item) => get(item.resourceId)),         )|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:199|index|0|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:200|actual|readBack[index]|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:222|rollback|database.transaction([STORE, BLOB_STORE], "readwrite")|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:223|rollbackDone|transactionDone(rollback)|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:224|item||需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:234|tx|database.transaction([STORE, BLOB_STORE], "readonly")|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:235|done|transactionDone(tx)|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:236|[metadata, storedBlob]|await Promise.all([         requestValue(tx.objectStore(STORE).get(resourceId)),         requestValue(tx.objectStore(BLOB_STORE).get(resourceId)),       ])|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:247|tx|database.transaction(STORE, "readonly")|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:248|done|transactionDone(tx)|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:249|all|await requestValue(tx.objectStore(STORE).getAll())|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:251|query|String(filter.query ／／ "")         .trim()         .toLocaleLowerCase()|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:272|tx|database.transaction([STORE, BLOB_STORE], "readwrite")|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:273|done|transactionDone(tx)|需要进一步测试|
|src/infrastructure/teaching-resource-repository.js:280|metadata|await list(filter)|需要进一步测试|
|src/infrastructure/teaching-schedule-repository.js:3|KEY|"godpower_teaching_schedule_v1"|需要进一步测试|
|src/infrastructure/teaching-schedule-repository.js:4|clone|(value) => JSON.parse(JSON.stringify(value))|需要进一步测试|
|src/infrastructure/teaching-schedule-repository.js:15|raw||需要进一步测试|
|src/infrastructure/teaching-schedule-repository.js:32|envelope|JSON.parse(raw)|需要进一步测试|
|src/infrastructure/teaching-schedule-repository.js:53|current|read()|需要进一步测试|
|src/infrastructure/teaching-schedule-repository.js:64|valid||需要进一步测试|
|src/infrastructure/teaching-schedule-repository.js:70|previous||需要进一步测试|
|src/infrastructure/teaching-schedule-repository.js:80|revision|current.revision + 1|需要进一步测试|
|src/infrastructure/teaching-schedule-repository.js:81|encoded|JSON.stringify({         schemaVersion: 1,         revision,         schedule: valid,       })|需要进一步测试|
|src/items/draw.js:2|ItemDrawBlocks|(() => {   function pick(group, batchUsed = new Set()) {     const config = ItemModules.configuration().items;     const held = heldItemKeysV281(group);     if |需要进一步测试|
|src/items/draw.js:4|config|ItemModules.configuration().items|需要进一步测试|
|src/items/draw.js:5|held|heldItemKeysV281(group)|需要进一步测试|
|src/items/draw.js:7|pool|FIRST_HAND_POOL_V218.filter(         (key) =>           ITEM_DEFS[key] &&           !held.has(key) &&           config[key].draw.enabled &&           config[key|需要进一步测试|
|src/items/draw.js:16|equal|pool.every(           (key) => config[key].draw.weight === config[pool[0]].draw.weight,         )|需要进一步测试|
|src/items/draw.js:19|key|equal           ? pool[Math.floor(Math.random() * pool.length)]           : weightedPick(               Object.fromEntries(                 pool.map((key) => [k|需要进一步测试|
|src/items/draw.js:30|leader|rankIndex(group.id) === 0|需要进一步测试|
|src/items/draw.js:32|weight|config.horn.draw.enabled ? config.horn.draw.weight : 0|需要进一步测试|
|src/items/draw.js:33|chance|weight ? (0.1 * weight) / (0.9 + 0.1 * weight) : 0|需要进一步测试|
|src/items/draw.js:39|before|suppressFirstHornV218|需要进一步测试|
|src/items/draw.js:41|weights||需要进一步测试|
|src/items/draw.js:47|key|weightedPickNoRepeatV281(       weights,       new Set([...batchUsed, ...held]),     )|需要进一步测试|
|src/items/expansion-copy.js:3|order|[     "coin",     "mushroom",     "triple_mushroom",     "coin_shell",     "question",     "item_box",     "green",     "triple_green",     "red",     "triple_r|需要进一步测试|
|src/items/expansion-copy.js:33|ordered|Object.fromEntries(order.map((key) => [key, ITEM_DEFS[key]]))|需要进一步测试|
|src/items/expansion-copy.js:34|key||需要进一步测试|
|src/items/expansion-copy.js:37|list||需要进一步测试|
|src/items/expansion-copy.js:39|descriptions|{     kamek:       "随机选择 1～3 个不同的其他小组，分别施加灼烧、冰冻、麻痹、中毒、眩晕中的一种随机状态；现有防御可抵挡。",     item_box:       "为所有符合条件的小组按其排名抽取一个道具；负分或库存已满者跳过。使用者先释放道具箱槽位，再参与分发。",     fire_f|需要进一步测试|
|src/items/expansion-copy.js:53|[key, desc]||需要进一步测试|
|src/items/expansion-copy.js:56|map||需要进一步测试|
|src/items/expansion-copy.js:64|tactics|{     kamek:       "五种负面状态随机分配，只能决定谁倒霉，不能决定中哪一种。对手的防御可以挡下，属于开盲盒而不是精准打击。",     item_box:       "全班按排名各抽一件，等于把局面整体加速。分数领先时开箱，往往是在给对手发追赶的弹药。",     fire_flower:    |需要进一步测试|
|src/items/expansion-copy.js:81|[key, tip]||需要进一步测试|
|src/items/expansion-copy.js:96|rows|[     {       key: "burn",       name: "灼烧",       tag: "持续扣分",       exact: "接下来 2 次答题结算后各扣 1～3 分。",       tip: "同一时间只能有一种状态，因此它不会被中毒叠加，也无法在已有状态时施加。",     },  |需要进一步测试|
|src/items/operation.js:3|ItemOperationBlocks|(() => {   const targets = Object.fromEntries(     [       "self",       "randomOther",       "above",       "below",       "leader",       "adjacent",       "a|需要进一步测试|
|src/items/operation.js:4|targets|Object.fromEntries(     [       "self",       "randomOther",       "above",       "below",       "leader",       "adjacent",       "aheadInclusive",       "behi|需要进一步测试|
|src/items/operation.js:28|effects|{     kamek(c) {       const pool = [...c.others];       if (!pool.length) return false;       const count = 1 + Math.floor(Math.random() * Math.min(3, pool.len|需要进一步测试|
|src/items/operation.js:30|pool|[...c.others]|需要进一步测试|
|src/items/operation.js:32|count|1 + Math.floor(Math.random() * Math.min(3, pool.length))|需要进一步测试|
|src/items/operation.js:36|hasStatus|(g) =>         CompetitionEffects.negative.some((k) => CompetitionEffects.has(g, k)) ／／         CompetitionEffects.has(g, "invincible") ／／         CompetitionEf|需要进一步测试|
|src/items/operation.js:40|clean|pool.filter((g) => !hasStatus(g))|需要进一步测试|
|src/items/operation.js:41|pickFrom|(list) => list.splice(Math.floor(Math.random() * list.length), 1)[0]|需要进一步测试|
|src/items/operation.js:43|i|0|需要进一步测试|
|src/items/operation.js:44|candidates|clean.length ? clean : pool|需要进一步测试|
|src/items/operation.js:46|target|pickFrom(candidates)|需要进一步测试|
|src/items/operation.js:48|mirrored|pool.indexOf(target)|需要进一步测试|
|src/items/operation.js:50|cleanIndex|clean.indexOf(target)|需要进一步测试|
|src/items/operation.js:57|key|CompetitionEffects.negative[             Math.floor(Math.random() * CompetitionEffects.negative.length)           ]|需要进一步测试|
|src/items/operation.js:69|previous|activeDrawSessionV21710|需要进一步测试|
|src/items/operation.js:70|t|ensureDrawSessionThrottleV21710()|需要进一步测试|
|src/items/operation.js:76|batch|new Set()|需要进一步测试|
|src/items/operation.js:79|recipients|state.groups           .filter((g) => eligibleForItems(g) && g.inventory.length < 3)           .sort((a, b) =>             String(a.groupUid ／／ a.id).localeComp|需要进一步测试|
|src/items/operation.js:86|group||需要进一步测试|
|src/items/operation.js:87|key|pickItemForGroupV281(group, batch)|需要进一步测试|
|src/items/operation.js:92|acquired|group.inventory.at(-1)|需要进一步测试|
|src/items/operation.js:110|target||需要进一步测试|
|src/items/operation.js:111|result||需要进一步测试|
|src/items/operation.js:113|amount|Math.round(Math.max(0, Number(target.score) ／／ 0) / 5)|需要进一步测试|
|src/items/operation.js:152|t||需要进一步测试|
|src/items/operation.js:153|amount|Math.round(           Math.max(0, Number(t.score) ／／ 0) / c.blueprint.denominator,         )|需要进一步测试|
|src/items/operation.js:156|result|amount > 0             ? applyItemScore(t, -amount, c.group.id, c.key)             : { changed: false, blocked: tryDefend(t, c.key) }|需要进一步测试|
|src/items/operation.js:182|mine|c.blueprint.type|需要进一步测试|
|src/items/operation.js:183|current|c.group.itemEffect?.type ／／ null|需要进一步测试|
|src/items/operation.js:184|defensive|mine === "star" ／／ mine === "mega"|需要进一步测试|
|src/items/operation.js:185|currentDefensive|current === "star" ／／ current === "mega"|需要进一步测试|
|src/items/operation.js:220|cleared|Object.keys(c.group.competitionEffects).filter(           (name) => c.group.competitionEffects[name],         )|需要进一步测试|
|src/items/operation.js:241|above|c.targets[0]|需要进一步测试|
|src/items/operation.js:251|ix|above.inventory.length - 1|需要进一步测试|
|src/items/operation.js:265|stolen|above.inventory.splice(ix, 1)[0]|需要进一步测试|
|src/items/operation.js:276|blueprint|ItemBlueprints[key]|需要进一步测试|
|src/items/operation.js:278|ordered|ranking()|需要进一步测试|
|src/items/operation.js:279|position|ordered.findIndex((g) => g.id === group.id)|需要进一步测试|
|src/items/operation.js:280|context|{       key,       group,       index,       blueprint,       ranking: ordered,       position,       others: state.groups.filter(         (g) => g.id !== group|需要进一步测试|
|src/items/operation.js:300|targeted|["fraction", "freeze"].includes(blueprint.effect)|需要进一步测试|
|src/items/operation.js:307|before|snapshotScoresV21732()|需要进一步测试|
|src/items/operation.js:308|beforeEffects|new Map(       state.groups.map((g) => [         g.id,         JSON.stringify(g.competitionEffects ／／ {}),       ]),     )|需要进一步测试|
|src/items/round-effects.js:2|RoundItemEffects|(() => {   function settle({ rankingsBefore, answersBefore }) {     answersBefore.forEach((answer) => {       const group = state.groups.find(         (candidat|需要进一步测试|
|src/items/round-effects.js:5|group|state.groups.find(         (candidate) => candidate.id === answer.id,       )|需要进一步测试|
|src/items/round-effects.js:14|sorted|ranking()|需要进一步测试|
|src/items/round-effects.js:15|position|sorted.findIndex(               (candidate) => candidate.id === group.id,             )|需要进一步测试|
|src/items/round-effects.js:24|index|group.inventory.findIndex(             (item) => item.key === "power",           )|需要进一步测试|
|src/items/round-effects.js:40|result|CompetitionEffects.answer(         group,         answer.scoreBefore,         group.score,         () => Math.random(),         answer,       )|需要进一步测试|
|src/items/round-effects.js:54|answered|new Map(       answersBefore.map((answer) => [answer.id, answer.answered]),     )|需要进一步测试|
|src/items/round-effects.js:59|left|Number(group.itemEffect.iceRoundsLeftV218 ／／ 3) - 1|需要进一步测试|
|src/runtime/archives/full-settlement.js:46|ig|state.itemGlobal ／／ {}|需要进一步测试|
|src/runtime/archives/full-settlement.js:122|text||需要进一步测试|
|src/runtime/archives/full-settlement.js:138|n|itemNameV21813(it.key)|需要进一步测试|
|src/runtime/archives/full-settlement.js:139|c|Number(it.charges) ／／ 1|需要进一步测试|
|src/runtime/archives/full-settlement.js:145|out|CompetitionEffects.labels(g)|需要进一步测试|
|src/runtime/archives/full-settlement.js:147|d|ITEM_DEFS?.[g.itemEffect.type]?.name ／／ g.itemEffect.type|需要进一步测试|
|src/runtime/archives/full-settlement.js:165|list|getSettlementHistory()|需要进一步测试|
|src/runtime/archives/full-settlement.js:166|record|list[index]|需要进一步测试|
|src/runtime/archives/full-settlement.js:169|snap|record.clearedData ／／ {}|需要进一步测试|
|src/runtime/archives/full-settlement.js:170|groups|snap.groups?.length ? snap.groups : record.groups ／／ []|需要进一步测试|
|src/runtime/archives/full-settlement.js:171|ig|snap.itemGlobal ／／ {}|需要进一步测试|
|src/runtime/archives/full-settlement.js:172|lines|[]|需要进一步测试|
|src/runtime/archives/full-settlement.js:194|answers|groups.reduce(     (n, g) =>       n +       (Number(g.itemStats?.correct) ／／ 0) +       (Number(g.itemStats?.wrong) ／／ 0),     0,   )|需要进一步测试|
|src/runtime/archives/full-settlement.js:237|ranked|[...groups].sort(     (a, b) => (Number(b.score) ／／ 0) - (Number(a.score) ／／ 0),   )|需要进一步测试|
|src/runtime/archives/full-settlement.js:311|g|groups.find((q) => q.id === x.groupId)|需要进一步测试|
|src/runtime/archives/full-settlement.js:330|rd|snap.round ／／ {}|需要进一步测试|
|src/runtime/archives/full-settlement.js:350|groupSummary|(h.groups ／／ []).map((g) => ({       id: g.id,       name: g.name,       score: g.score,       inventory: g.inventory,       itemStats: g.itemStats,       itemE|需要进一步测试|
|src/runtime/archives/full-settlement.js:386|csvContent|"\uFEFF" + lines.join("\n")|需要进一步测试|
|src/runtime/archives/full-settlement.js:387|blob|new Blob([csvContent], { type: "text/csv;charset=utf-8;" })|需要进一步测试|
|src/runtime/archives/full-settlement.js:388|url|URL.createObjectURL(blob)|需要进一步测试|
|src/runtime/archives/full-settlement.js:389|a|document.createElement("a")|需要进一步测试|
|src/runtime/archives/settlement-actions.js:1|confettiAnimationId|null|需要进一步测试|
|src/runtime/archives/settlement-actions.js:2|confettiParticles|[]|需要进一步测试|
|src/runtime/archives/settlement-actions.js:25|now|new Date()|需要进一步测试|
|src/runtime/archives/settlement-actions.js:26|y|now.getFullYear()|需要进一步测试|
|src/runtime/archives/settlement-actions.js:27|m|String(now.getMonth() + 1).padStart(2, "0")|需要进一步测试|
|src/runtime/archives/settlement-actions.js:28|d|String(now.getDate()).padStart(2, "0")|需要进一步测试|
|src/runtime/archives/settlement-actions.js:29|defaultTitle|${y}年${m}月${d}日 积分结算|需要进一步测试|
|src/runtime/archives/settlement-actions.js:31|input|document.getElementById("settlementNameInput")|需要进一步测试|
|src/runtime/archives/settlement-actions.js:49|conflict|ClassroomWriteBarrier.conflict()|需要进一步测试|
|src/runtime/archives/settlement-actions.js:81|input|document.getElementById("settlementNameInput")|需要进一步测试|
|src/runtime/archives/settlement-actions.js:82|title|(input ? input.value.trim() : "") ／／ "积分结算"|需要进一步测试|
|src/runtime/archives/settlement-actions.js:85|sorted|[...state.groups].sort(     (a, b) => (Number(b.score) ／／ 0) - (Number(a.score) ／／ 0),   )|需要进一步测试|
|src/runtime/archives/settlement-actions.js:88|top1|sorted[0]|需要进一步测试|
|src/runtime/archives/settlement-actions.js:89|top2|sorted[1]|需要进一步测试|
|src/runtime/archives/settlement-actions.js:90|top3|sorted[2]|需要进一步测试|
|src/runtime/archives/settlement-actions.js:92|record|{     id: Date.now(),     seasonId: state.seasonId,     title: title,     date: new Date().toLocaleDateString(),     time: new Date().toLocaleString(),     cham|需要进一步测试|
|src/runtime/archives/settlement-actions.js:107|archiveResult|saveSettlementRecord(record)|需要进一步测试|
|src/runtime/archives/settlement-actions.js:115|beforeReset|clone(state)|需要进一步测试|
|src/runtime/archives/settlement-actions.js:116|beforeHistory|clone(historyStack)|需要进一步测试|
|src/runtime/archives/settlement-actions.js:126|grandTitle|document.getElementById("grandModalTitle")|需要进一步测试|
|src/runtime/archives/settlement-actions.js:128|grandPodium|document.getElementById("grandPodiumDeck")|需要进一步测试|
|src/runtime/archives/settlement-actions.js:152|resetResult|saveState()|需要进一步测试|
|src/runtime/archives/settlement-actions.js:170|canvas|document.getElementById("confettiCanvas")|需要进一步测试|
|src/runtime/archives/settlement-actions.js:172|ctx|canvas.getContext("2d")|需要进一步测试|
|src/runtime/archives/settlement-actions.js:176|colors|[     "#f59e0b",     "#ef4444",     "#10b981",     "#3b82f6",     "#8b5cf6",     "#ec4899",     "#fde047",   ]|需要进一步测试|
|src/runtime/archives/settlement-actions.js:186|i|0|需要进一步测试|
|src/runtime/archives/settlement-actions.js:242|host|document.getElementById("archiveClassStats")|需要进一步测试|
|src/runtime/archives/settlement-actions.js:244|itemGlobal|state.itemGlobal ／／ {}|需要进一步测试|
|src/runtime/archives/settlement-actions.js:245|answers|state.groups.reduce((total, group) => {     const stats = group.itemStats ／／ {};     return total + Number(stats.correct ／／ 0) + Number(stats.wrong ／／ 0);   }, |需要进一步测试|
|src/runtime/archives/settlement-actions.js:246|stats|group.itemStats ／／ {}|需要进一步测试|
|src/runtime/archives/settlement-actions.js:249|metrics|[     ["课堂作答", answers, "次"],     ["答题轮次", Number(itemGlobal.pkTotal ／／ 0), "轮"],     ["全局道具发放", Number(itemGlobal.totalDraws ／／ 0), "件"],     ["手动举手", Number(i|需要进一步测试|
|src/runtime/archives/settlement-actions.js:263|list|getSettlementHistory()|需要进一步测试|
|src/runtime/archives/settlement-actions.js:264|record|list[index]|需要进一步测试|
|src/runtime/archives/settlement-actions.js:267|csvContent|"\uFEFF排名,小组名称,最终得分,组员名单\n"|需要进一步测试|
|src/runtime/archives/settlement-actions.js:269|members|(g.members ／／ []).join(" / ")|需要进一步测试|
|src/runtime/archives/settlement-actions.js:273|blob|new Blob([csvContent], { type: "text/csv;charset=utf-8;" })|需要进一步测试|
|src/runtime/archives/settlement-actions.js:274|url|URL.createObjectURL(blob)|需要进一步测试|
|src/runtime/archives/settlement-actions.js:275|a|document.createElement("a")|需要进一步测试|
|src/runtime/archives/settlement-actions.js:284|list|getSettlementHistory()|需要进一步测试|
|src/runtime/archives/settlement-actions.js:308|list|getSettlementHistory()|需要进一步测试|
|src/runtime/audio/battle-playback.js:1|activeLoopTimeouts|[]|需要进一步测试|
|src/runtime/audio/battle-playback.js:15|battleBuf|activeSetBuffers["battle"]|需要进一步测试|
|src/runtime/audio/battle-playback.js:16|thinkBuf|activeSetBuffers["thinking"]|需要进一步测试|
|src/runtime/audio/battle-playback.js:19|secPerBeat|getSecPerBeat()|需要进一步测试|
|src/runtime/audio/battle-playback.js:20|loopStartSec|8 * secPerBeat|需要进一步测试|
|src/runtime/audio/battle-playback.js:21|loopEndSec|184 * secPerBeat|需要进一步测试|
|src/runtime/audio/battle-playback.js:22|chunkDuration|loopEndSec - offsetSec|需要进一步测试|
|src/runtime/audio/battle-playback.js:24|now|audioCtx.currentTime|需要进一步测试|
|src/runtime/audio/battle-playback.js:25|actualStart|Math.max(now, startTime)|需要进一步测试|
|src/runtime/audio/battle-playback.js:28|bSrc|audioCtx.createBufferSource()|需要进一步测试|
|src/runtime/audio/battle-playback.js:37|tSrc|audioCtx.createBufferSource()|需要进一步测试|
|src/runtime/audio/battle-playback.js:45|nextStartTime|actualStart + chunkDuration|需要进一步测试|
|src/runtime/audio/battle-playback.js:46|delayMs|Math.max(     0,     (nextStartTime - audioCtx.currentTime - 0.25) * 1000,   )|需要进一步测试|
|src/runtime/audio/battle-playback.js:51|timerId|setTimeout(() => {     scheduleDualLoopChunk(nextStartTime, loopStartSec);   }, delayMs)|需要进一步测试|
|src/runtime/audio/battle-playback.js:71|{ setIndex }|await pickNextPlayableSetIndex()|需要进一步测试|
|src/runtime/audio/battle-playback.js:86|now|audioCtx.currentTime + 0.05|需要进一步测试|
|src/runtime/audio/battle-playback.js:88|chosenIntroKey|"intro_normal"|需要进一步测试|
|src/runtime/audio/battle-playback.js:90|{ wins, losses }|state.lastRoundAllIn|需要进一步测试|
|src/runtime/audio/battle-playback.js:100|introBuf|activeSetBuffers[chosenIntroKey] ／／ activeSetBuffers["intro_normal"]|需要进一步测试|
|src/runtime/audio/battle-playback.js:102|thinkBuf|activeSetBuffers["thinking"]|需要进一步测试|
|src/runtime/audio/battle-playback.js:103|battleBuf|activeSetBuffers["battle"]|需要进一步测试|
|src/runtime/audio/battle-playback.js:106|introSrc|audioCtx.createBufferSource()|需要进一步测试|
|src/runtime/audio/battle-playback.js:115|ratioMet|checkAllInRatio()|需要进一步测试|
|src/runtime/audio/battle-playback.js:140|now|audioCtx.currentTime|需要进一步测试|
|src/runtime/audio/battle-playback.js:141|secPerBeat|getSecPerBeat()|需要进一步测试|
|src/runtime/audio/battle-playback.js:142|currentBeat|getTrackCurrentBeat()|需要进一步测试|
|src/runtime/audio/battle-playback.js:143|beatInBar|currentBeat % 4|需要进一步测试|
|src/runtime/audio/battle-playback.js:144|beatsToNextBar|4 - beatInBar|需要进一步测试|
|src/runtime/audio/battle-playback.js:145|effBeats|beatsToNextBar + (Number(menuCfg.battleTransitionLeadBeats) ／／ 0)|需要进一步测试|
|src/runtime/audio/battle-playback.js:148|triggerTime||需要进一步测试|
|src/runtime/audio/battle-playback.js:148|transitionBeats||需要进一步测试|
|src/runtime/audio/battle-playback.js:148|transKey||需要进一步测试|
|src/runtime/audio/battle-playback.js:159|timeToNextBeat|(Math.ceil(currentBeat) - currentBeat) * secPerBeat|需要进一步测试|
|src/runtime/audio/battle-playback.js:167|timeToNextBeat|(Math.ceil(currentBeat) - currentBeat) * secPerBeat|需要进一步测试|
|src/runtime/audio/battle-playback.js:175|timeToNextBeat|(Math.ceil(currentBeat) - currentBeat) * secPerBeat|需要进一步测试|
|src/runtime/audio/battle-playback.js:184|transBuf|activeSetBuffers[transKey]|需要进一步测试|
|src/runtime/audio/battle-playback.js:185|exactTransDuration|transitionBeats * secPerBeat|需要进一步测试|
|src/runtime/audio/battle-playback.js:195|curThink|bgmEngine.thinkingGain.gain.value|需要进一步测试|
|src/runtime/audio/battle-playback.js:203|transSrc|audioCtx.createBufferSource()|需要进一步测试|
|src/runtime/audio/battle-playback.js:212|battleResumeTime|triggerTime + exactTransDuration|需要进一步测试|
|src/runtime/audio/battle-playback.js:213|battleFadeInStart|Math.max(triggerTime, battleResumeTime - 0.05)|需要进一步测试|
|src/runtime/audio/battle-playback.js:215|curBattle|bgmEngine.battleGain.gain.value|需要进一步测试|
|src/runtime/audio/battle-playback.js:226|stillAllIn|checkAllInRatio()|需要进一步测试|
|src/runtime/audio/battle-playback.js:249|now|audioCtx.currentTime|需要进一步测试|
|src/runtime/audio/battle-playback.js:250|secPerBeat|getSecPerBeat()|需要进一步测试|
|src/runtime/audio/battle-playback.js:251|currentBeat|getTrackCurrentBeat()|需要进一步测试|
|src/runtime/audio/battle-playback.js:252|timeToNextBeat|(Math.ceil(currentBeat) - currentBeat) * secPerBeat|需要进一步测试|
|src/runtime/audio/battle-playback.js:253|triggerTime|now +       (timeToNextBeat < 0.005 ? timeToNextBeat + secPerBeat : timeToNextBeat)|需要进一步测试|
|src/runtime/audio/battle-playback.js:256|fadeDuration|getSecPerBar() * 0.5|需要进一步测试|
|src/runtime/audio/battle-playback.js:261|curBattle|bgmEngine.battleGain.gain.value|需要进一步测试|
|src/runtime/audio/battle-playback.js:262|curThink|bgmEngine.thinkingGain.gain.value|需要进一步测试|
|src/runtime/audio/battle-playback.js:294|victoryBuf|activeSetBuffers["victory"]|需要进一步测试|
|src/runtime/audio/battle-playback.js:295|now|audioCtx.currentTime|需要进一步测试|
|src/runtime/audio/battle-playback.js:296|secPerBeat|getSecPerBeat()|需要进一步测试|
|src/runtime/audio/battle-playback.js:297|currentBeat|getTrackCurrentBeat()|需要进一步测试|
|src/runtime/audio/battle-playback.js:298|beatInBar|currentBeat % 4|需要进一步测试|
|src/runtime/audio/battle-playback.js:299|beatsToNextBar|4 - beatInBar|需要进一步测试|
|src/runtime/audio/battle-playback.js:300|triggerTime|now + beatsToNextBar * secPerBeat|需要进一步测试|
|src/runtime/audio/battle-playback.js:312|currentBattleVol|bgmEngine.battleGain.gain.value|需要进一步测试|
|src/runtime/audio/battle-playback.js:313|currentThinkingVol|bgmEngine.thinkingGain.gain.value|需要进一步测试|
|src/runtime/audio/battle-playback.js:357|victorySrc|audioCtx.createBufferSource()|需要进一步测试|
|src/runtime/audio/battle-playback.js:423|now|audioCtx.currentTime|需要进一步测试|
|src/runtime/audio/draw-audio-lifecycle.js:6|activeDrawSourcesV2171|new Set()|需要进一步测试|
|src/runtime/audio/draw-audio-lifecycle.js:7|drawTickTimerV2171|null|需要进一步测试|
|src/runtime/audio/draw-audio-lifecycle.js:8|drawRevealTimerV2171|null|需要进一步测试|
|src/runtime/audio/draw-audio-lifecycle.js:9|drawAudioGenerationV2171|0|需要进一步测试|
|src/runtime/audio/draw-audio-lifecycle.js:50|custom|customFxBuffers?.[slotId]|需要进一步测试|
|src/runtime/audio/draw-audio-lifecycle.js:52|source|audioCtx.createBufferSource()|需要进一步测试|
|src/runtime/audio/draw-audio-lifecycle.js:97|generation|++drawAudioGenerationV2171|需要进一步测试|
|src/runtime/audio/draw-audio-lifecycle.js:98|duration|3000|需要进一步测试|
|src/runtime/audio/draw-audio-lifecycle.js:102|tickCount|0|需要进一步测试|
|src/runtime/audio/draw-audio-lifecycle.js:103|tickInterval|Math.max(150, duration / 15)|需要进一步测试|
|src/runtime/audio/draw-audio-lifecycle.js:126|_v2171CancelHandItemDraw|cancelHandItemDraw|需要进一步测试|
|src/runtime/audio/effects-volume.js:12|fxGainNodeV2176|null|需要进一步测试|
|src/runtime/audio/effects-volume.js:28|label|document.getElementById("sfxVolLabelV2176")|需要进一步测试|
|src/runtime/audio/effects-volume.js:32|node|getFxOutputV2176()|需要进一步测试|
|src/runtime/audio/effects-volume.js:34|now|audioCtx.currentTime|需要进一步测试|
|src/runtime/audio/effects-volume.js:47|pane|document.getElementById("settingsV26_sound")|需要进一步测试|
|src/runtime/audio/effects-volume.js:50|master|document.getElementById("cfgMasterVolume")|需要进一步测试|
|src/runtime/audio/effects-volume.js:51|masterRow|master?.closest(".setting-item")|需要进一步测试|
|src/runtime/audio/effects-volume.js:53|row|document.createElement("div")|需要进一步测试|
|src/runtime/audio/effects-volume.js:81|_v2176SyncSettingsControls|syncSettingsControls|需要进一步测试|
|src/runtime/audio/effects-volume.js:83|r|_v2176SyncSettingsControls.apply(this, args)|需要进一步测试|
|src/runtime/audio/effects-volume.js:86|slider|document.getElementById("cfgSfxVolumeV2176")|需要进一步测试|
|src/runtime/audio/effects-volume.js:87|label|document.getElementById("sfxVolLabelV2176")|需要进一步测试|
|src/runtime/audio/effects-volume.js:96|_v2176RebuildSettingsV26|rebuildSettingsV26|需要进一步测试|
|src/runtime/audio/effects-volume.js:98|r|_v2176RebuildSettingsV26.apply(this, args)|需要进一步测试|
|src/runtime/audio/effects-volume.js:105|_v2176ShowSettingsV26|showSettingsV26|需要进一步测试|
|src/runtime/audio/effects-volume.js:107|r|_v2176ShowSettingsV26.call(this, which, ...args)|需要进一步测试|
|src/runtime/audio/fx-bundle-transfer.js:22|allRecords|await new Promise((resolve) => {       try {         const tx = db.transaction("sounds", "readonly");         const req = tx.objectStore("sounds").getAll();    |需要进一步测试|
|src/runtime/audio/fx-bundle-transfer.js:24|tx|db.transaction("sounds", "readonly")|需要进一步测试|
|src/runtime/audio/fx-bundle-transfer.js:25|req|tx.objectStore("sounds").getAll()|需要进一步测试|
|src/runtime/audio/fx-bundle-transfer.js:39|fxRecords|allRecords       .filter(         (r) =>           r &&           typeof r.id === "string" &&           r.id.startsWith("fx_") &&           r.arrayBuffer instan|需要进一步测试|
|src/runtime/audio/fx-bundle-transfer.js:56|currentOffset|0|需要进一步测试|
|src/runtime/audio/fx-bundle-transfer.js:57|fileIndex|[]|需要进一步测试|
|src/runtime/audio/fx-bundle-transfer.js:58|buffers|[]|需要进一步测试|
|src/runtime/audio/fx-bundle-transfer.js:60|record||需要进一步测试|
|src/runtime/audio/fx-bundle-transfer.js:61|ab|record.arrayBuffer|需要进一步测试|
|src/runtime/audio/fx-bundle-transfer.js:72|indexBytes|new TextEncoder().encode(JSON.stringify(fileIndex))|需要进一步测试|
|src/runtime/audio/fx-bundle-transfer.js:73|headerBuffer|new ArrayBuffer(8)|需要进一步测试|
|src/runtime/audio/fx-bundle-transfer.js:74|view|new DataView(headerBuffer)|需要进一步测试|
|src/runtime/audio/fx-bundle-transfer.js:83|blob|new Blob([headerBuffer, indexBytes, ...buffers], {       type: "application/octet-stream",     })|需要进一步测试|
|src/runtime/audio/fx-bundle-transfer.js:87|url|URL.createObjectURL(blob)|需要进一步测试|
|src/runtime/audio/fx-bundle-transfer.js:88|a|document.createElement("a")|需要进一步测试|
|src/runtime/audio/fx-bundle-transfer.js:91|itemFxCount|fxRecords.filter((r) =>       r.id.startsWith("fx_item_"),     ).length|需要进一步测试|
|src/runtime/audio/item-sound-bindings.js:18|ITEM_SOUND_IDS_V2164|new Set([   "item_draw_start",   "item_draw_tick",   "item_draw_reveal",   "item_use",   "item_attack",   "item_defend",   "item_buff",   "item_status",   "item|需要进一步测试|
|src/runtime/audio/item-sound-bindings.js:39|osc|audioCtx.createOscillator()|需要进一步测试|
|src/runtime/audio/item-sound-bindings.js:40|gain|audioCtx.createGain()|需要进一步测试|
|src/runtime/audio/item-sound-bindings.js:58|now|audioCtx.currentTime + 0.005|需要进一步测试|
|src/runtime/audio/item-sound-bindings.js:109|_v2164PlaySoundBase|playSound|需要进一步测试|
|src/runtime/audio/item-sound-bindings.js:126|custom|customFxBuffers?.[slotId]|需要进一步测试|
|src/runtime/audio/item-sound-bindings.js:128|source|audioCtx.createBufferSource()|需要进一步测试|
|src/runtime/audio/item-sound-bindings.js:149|n|0|需要进一步测试|
|src/runtime/audio/item-sound-bindings.js:150|interval|Math.max(150, ms / 15)|需要进一步测试|
|src/runtime/audio/item-sound-bindings.js:151|timer|setInterval(() => {     if (n++ < 13) playSound("item_draw_tick");     else clearInterval(timer);   }, interval)|需要进一步测试|
|src/runtime/audio/item-sound-map.js:5|PER_ITEM_SOUND_IDS_V2174|new Set(ITEM_KEYS.map((k) => item_${k}))|需要进一步测试|
|src/runtime/audio/item-sound-map.js:7|GENERIC_ITEM_USE_SOUNDS_V2174|new Set([   "item_use",   "item_attack",   "item_buff",   "item_status",   "item_steal", ])|需要进一步测试|
|src/runtime/audio/item-sound-map.js:20|idx|Math.max(0, ITEM_DRAW_KEYS.indexOf(key))|需要进一步测试|
|src/runtime/audio/item-sound-map.js:21|now|audioCtx.currentTime + 0.005|需要进一步测试|
|src/runtime/audio/item-sound-map.js:22|kind|ITEM_DEFS[key]?.kind ／／ "tactic"|需要进一步测试|
|src/runtime/audio/item-sound-map.js:24|base|180 + (idx % 13) * 36|需要进一步测试|
|src/runtime/audio/item-sound-map.js:25|octave|idx % 2 ? 1.5 : 1|需要进一步测试|
|src/runtime/audio/item-sound-map.js:26|f1|base * octave|需要进一步测试|
|src/runtime/audio/item-sound-map.js:27|f2|f1 * (1.25 + (idx % 4) * 0.08)|需要进一步测试|
|src/runtime/audio/item-sound-map.js:29|tone|(     freq,     t,     dur,     type = "triangle",     gain = 0.075,     endFreq = null,   ) => {     try {       const osc = audioCtx.createOscillator();      |需要进一步测试|
|src/runtime/audio/item-sound-map.js:38|osc|audioCtx.createOscillator()|需要进一步测试|
|src/runtime/audio/item-sound-map.js:39|g|audioCtx.createGain()|需要进一步测试|
|src/runtime/audio/item-sound-map.js:81|_v2174PlaySound|playSound|需要进一步测试|
|src/runtime/audio/item-sound-map.js:104|custom|selectFxBuffer(slotId)|需要进一步测试|
|src/runtime/audio/item-sound-map.js:106|source|audioCtx.createBufferSource()|需要进一步测试|
|src/runtime/audio/item-sound-map.js:129|_v2174ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/runtime/audio/item-sound-map.js:143|box|document.getElementById("itemFxSoundListV26")|需要进一步测试|
|src/runtime/audio/item-sound-map.js:146|common|[     { id: "item_draw_start", name: "道具抽取 · 启动", desc: "所有道具共用" },     { id: "item_draw_tick", name: "道具抽取 · 滚动刻度", desc: "所有道具共用" },     { id: "item_draw_reve|需要进一步测试|
|src/runtime/audio/item-sound-map.js:153|rowHtml|(id, name, desc, visual = "") => {     const custom =       !!customFxBuffers[id] ／／       !!customFxVariants[id]?.length ／／       hasSound("fx_" + id);     con|需要进一步测试|
|src/runtime/audio/item-sound-map.js:154|custom|!!customFxBuffers[id] ／／       !!customFxVariants[id]?.length ／／       hasSound("fx_" + id)|需要进一步测试|
|src/runtime/audio/item-sound-map.js:158|itemClass|visual ? " item-sound-card" : ""|需要进一步测试|
|src/runtime/audio/item-sound-map.js:159|description|visual       ? <div class="sound-desc item-sound-desc">           ${visual}           <div class="item-sound-copy">             <div class="sound-name">${escap|需要进一步测试|
|src/runtime/audio/item-sound-map.js:195|d|ITEM_DEFS[k]|需要进一步测试|
|src/runtime/audio/item-sound-map.js:196|visual|<span class="item-audio-icon">${itemVisual(k, "item-audio-img")}</span>|需要进一步测试|
|src/runtime/audio/item-sound-map.js:204|_v2174HandleSoundFileUpload|handleSoundFileUpload|需要进一步测试|
|src/runtime/audio/item-sound-map.js:206|result|_v2174HandleSoundFileUpload.call(this, event)|需要进一步测试|
|src/runtime/audio/item-sound-map.js:215|_v2174DeleteFxTrack|deleteFxTrack|需要进一步测试|
|src/runtime/audio/item-sound-map.js:217|result|_v2174DeleteFxTrack.call(this, idbKey, fxKey)|需要进一步测试|
|src/runtime/audio/item-sound-settings.js:1|ITEM_FX_SOUND_SLOTS|[   { id: "item_draw_start", name: "道具抽取·启动", desc: "开始轮盘时" },   { id: "item_draw_tick", name: "道具抽取·滚动刻度", desc: "轮盘滚动过程中" },   { id: "item_draw_reveal", name:|需要进一步测试|
|src/runtime/audio/item-sound-settings.js:21|box|document.getElementById("itemFxSoundListV26")|需要进一步测试|
|src/runtime/audio/item-sound-settings.js:27|custom|!!customFxBuffers[s.id] ／／ hasSound("fx_" + s.id)|需要进一步测试|
|src/runtime/audio/item-sound-settings.js:58|_v26ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/runtime/audio/item-sound-settings.js:64|_v26TinyDefense|tinyDefenseToast|需要进一步测试|
|src/runtime/audio/menu-patterns.js:1|MENU_TRACK_KEYS|[   "welcome_1",   "welcome_2",   "welcome_3",   "welcome_4",   "welcome_5",   "welcome_6",   "aux_history",   "aux_archives",   "aux_settings", ]|需要进一步测试|
|src/runtime/audio/menu-patterns.js:12|MENU_SET_TRACK_TYPES|[   { key: "welcome_1", name: "欢迎·个位张力", desc: "最高分个位数时播放" },   { key: "welcome_2", name: "欢迎·十位张力", desc: "最高分十位数时播放" },   { key: "welcome_3", name: "欢迎·百位张力",|需要进一步测试|
|src/runtime/audio/menu-patterns.js:27|MENU_TRACK_META|{   welcome_1: { name: "欢迎·个位张力", tension: 1 },   welcome_2: { name: "欢迎·十位张力", tension: 2 },   welcome_3: { name: "欢迎·百位张力", tension: 3 },   welcome_4: { name:|需要进一步测试|
|src/runtime/audio/menu-patterns.js:56|MENU_AUDIO_DEFAULTS|{   enabled: true,   bpm: 130,   beatsPerBar: 4,   loopStartBeat: 1,   loopEndBeat: 33,   transitionLeadBeats: 1,   battleBaseBpm: 130,   battleSet8Bpm: 135,   |需要进一步测试|
|src/runtime/audio/menu-patterns.js:71|menuCfg|{   ...MENU_AUDIO_DEFAULTS,   gainTrims: { ...MENU_AUDIO_DEFAULTS.gainTrims }, }|需要进一步测试|
|src/runtime/audio/menu-patterns.js:76|saved|STORAGE.getJSON("politics_menu_audio_cfg", null)|需要进一步测试|
|src/runtime/audio/menu-patterns.js:98|a|seed >>> 0|需要进一步测试|
|src/runtime/audio/menu-patterns.js:102|t|Math.imul(a ^ (a >>> 15), 1 ／ a)|需要进一步测试|
|src/runtime/audio/menu-patterns.js:108|SCALE_MAJOR|[0, 2, 4, 5, 7, 9, 11]|需要进一步测试|
|src/runtime/audio/menu-patterns.js:109|CHORD_PROG|[0, 0, 9, 9, 5, 5, 7, 7]|需要进一步测试|
|src/runtime/audio/menu-patterns.js:110|MENU_PATTERN_CACHE|{}|需要进一步测试|
|src/runtime/audio/menu-patterns.js:114|cacheKey|key + ":" + bars|需要进一步测试|
|src/runtime/audio/menu-patterns.js:116|meta|MENU_TRACK_META[key] ／／ { tension: 1 }|需要进一步测试|
|src/runtime/audio/menu-patterns.js:117|rnd|mulberry32(     key.split("").reduce((s, c) => s + c.charCodeAt(0), 7),   )|需要进一步测试|
|src/runtime/audio/menu-patterns.js:120|stepsPerBar|16|需要进一步测试|
|src/runtime/audio/menu-patterns.js:121|totalSteps|bars * stepsPerBar|需要进一步测试|
|src/runtime/audio/menu-patterns.js:122|tension|meta.tension|需要进一步测试|
|src/runtime/audio/menu-patterns.js:123|density|meta.density !== undefined       ? meta.density       : tension >= 6         ? 0.66         : tension === 5           ? 0.56           : tension === 4          |需要进一步测试|
|src/runtime/audio/menu-patterns.js:139|hatLevel|meta.hat !== undefined       ? meta.hat       : tension >= 6         ? 0.85         : tension === 5           ? 0.7           : tension === 4             ? 0.55|需要进一步测试|
|src/runtime/audio/menu-patterns.js:155|leadOct|meta.leadOct !== undefined       ? meta.leadOct       : tension >= 5         ? 3         : tension >= 3           ? 2           : 1|需要进一步测试|
|src/runtime/audio/menu-patterns.js:163|bass|new Array(totalSteps).fill(0)|需要进一步测试|
|src/runtime/audio/menu-patterns.js:164|lead|new Array(totalSteps).fill(null)|需要进一步测试|
|src/runtime/audio/menu-patterns.js:165|hat|new Array(totalSteps).fill(false)|需要进一步测试|
|src/runtime/audio/menu-patterns.js:166|bar|0|需要进一步测试|
|src/runtime/audio/menu-patterns.js:167|chordRoot|CHORD_PROG[bar % CHORD_PROG.length]|需要进一步测试|
|src/runtime/audio/menu-patterns.js:168|rootMidi|48 + chordRoot|需要进一步测试|
|src/runtime/audio/menu-patterns.js:169|step|0|需要进一步测试|
|src/runtime/audio/menu-patterns.js:170|gs|bar * stepsPerBar + step|需要进一步测试|
|src/runtime/audio/menu-patterns.js:174|deg|Math.floor(rnd() * SCALE_MAJOR.length)|需要进一步测试|
|src/runtime/audio/menu-patterns.js:175|oct|Math.floor(rnd() * 2)|需要进一步测试|
|src/runtime/audio/menu-patterns.js:186|noiseBuffer|null|需要进一步测试|
|src/runtime/audio/menu-patterns.js:190|len|Math.floor(audioCtx.sampleRate * 0.05)|需要进一步测试|
|src/runtime/audio/menu-patterns.js:192|data|noiseBuffer.getChannelData(0)|需要进一步测试|
|src/runtime/audio/menu-patterns.js:193|i|0|需要进一步测试|
|src/runtime/audio/menu-patterns.js:206|MENU_FADE_SEC|0.5|需要进一步测试|
|src/runtime/audio/menu-patterns.js:207|menuBgm|{   active: false,   currentKey: null,   pendingKey: null,   buffers: {},   uploadedKeys: new Set(),   outGain: null,   voices: [],   origin: 0,   pausedPos: nu|需要进一步测试|
|src/runtime/audio/menu-settings.js:2|box|document.getElementById("bgmEngineConsole")|需要进一步测试|
|src/runtime/audio/menu-settings.js:4|trimRows|MENU_TRACK_KEYS.map(     (k) =>       '<div class="trim-row">' +       '<span class="trim-name">' +       MENU_TRACK_META[k].name +       "</span>" +       '<in|需要进一步测试|
|src/runtime/audio/menu-settings.js:105|el|document.getElementById("cfgMenuBpmVal")|需要进一步测试|
|src/runtime/audio/menu-settings.js:127|el|document.getElementById("trim-val-" + k)|需要进一步测试|
|src/runtime/audio/menu-settings.js:133|el|document.getElementById("cfgBattleBaseBpmVal")|需要进一步测试|
|src/runtime/audio/menu-settings.js:137|el|document.getElementById("cfgBattleSet8BpmVal")|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:6|startBeat|Math.max(1, Number(menuCfg.loopStartBeat) ／／ 1)|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:7|endBeat|Math.max(startBeat + 4, Number(menuCfg.loopEndBeat) ／／ 33)|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:22|targetEnd|menuLoopSpan().endSec|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:23|missing|targetEnd - buf.duration|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:24|maxRepair|Math.min(0.35, menuSecPerBeat() * 0.75)|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:28|sampleRate|buf.sampleRate ／／ audioCtx.sampleRate|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:29|targetLength|Math.ceil(targetEnd * sampleRate) + 1|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:30|fixed|audioCtx.createBuffer(       buf.numberOfChannels,       targetLength,       sampleRate,     )|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:35|ch|0|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:56|sr|audioCtx.sampleRate|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:57|bpm|Math.max(40, Number(menuCfg.bpm) ／／ 130)|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:58|beats|Math.max(     4,     (Number(menuCfg.loopEndBeat) ／／ 33) - (Number(menuCfg.loopStartBeat) ／／ 1),   )|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:62|bars|Math.max(8, Math.ceil(beats / 4))|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:63|totalSteps|bars * 16|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:64|stepSec|60 / bpm / 16|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:65|dur|totalSteps * stepSec|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:66|len|Math.max(1, Math.floor(sr * dur))|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:67|offline|new OfflineAudioContext(1, len, sr)|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:68|pat|buildMenuPattern(key, bars)|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:69|trim|Math.max(0, Math.min(3, Number(menuCfg.gainTrims[key]) ／／ 1))|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:70|step|0|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:71|time|step * stepSec|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:72|bassMidi|pat.bass[step]|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:73|leadMidi|pat.lead[step]|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:74|hatOn|pat.hat[step]|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:76|osc|offline.createOscillator()|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:77|g|offline.createGain()|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:89|osc|offline.createOscillator()|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:90|g|offline.createGain()|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:102|buf|offline.createBuffer(1, Math.floor(sr * 0.05), sr)|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:103|dd|buf.getChannelData(0)|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:104|i|0|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:105|src|offline.createBufferSource()|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:107|g|offline.createGain()|需要进一步测试|
|src/runtime/audio/menu-synthesis.js:110|hp|offline.createBiquadFilter()|需要进一步测试|
|src/runtime/audio/menu-transport.js:1|menuLoading|{}|需要进一步测试|
|src/runtime/audio/menu-transport.js:5|p|(async () => {     let buf = null;     if (db) {       try {         const ab = await new Promise((res) => {           const tx = db.transaction("sounds", "read|需要进一步测试|
|src/runtime/audio/menu-transport.js:6|buf|null|需要进一步测试|
|src/runtime/audio/menu-transport.js:9|ab|await new Promise((res) => {           const tx = db.transaction("sounds", "readonly");           const req = tx.objectStore("sounds").get("bgm_menu_" + key);  |需要进一步测试|
|src/runtime/audio/menu-transport.js:10|tx|db.transaction("sounds", "readonly")|需要进一步测试|
|src/runtime/audio/menu-transport.js:11|req|tx.objectStore("sounds").get("bgm_menu_" + key)|需要进一步测试|
|src/runtime/audio/menu-transport.js:43|span|menuLoopSpan()|需要进一步测试|
|src/runtime/audio/menu-transport.js:45|startSec|Math.min(span.startSec, Math.max(0, buf.duration - 0.05))|需要进一步测试|
|src/runtime/audio/menu-transport.js:46|endSec|Math.min(span.endSec, buf.duration)|需要进一步测试|
|src/runtime/audio/menu-transport.js:53|t|Number(menuCfg.gainTrims[key])|需要进一步测试|
|src/runtime/audio/menu-transport.js:59|lp|menuLoopParams(buf, key)|需要进一步测试|
|src/runtime/audio/menu-transport.js:60|elapsed|Math.max(0, t - menuBgm.origin)|需要进一步测试|
|src/runtime/audio/menu-transport.js:62|dur|lp.endSec - lp.startSec|需要进一步测试|
|src/runtime/audio/menu-transport.js:68|r|v.ramp|需要进一步测试|
|src/runtime/audio/menu-transport.js:76|now|audioCtx.currentTime|需要进一步测试|
|src/runtime/audio/menu-transport.js:77|cur|menuVoiceGainAt(v, now)|需要进一步测试|
|src/runtime/audio/menu-transport.js:78|g|v.gain.gain|需要进一步测试|
|src/runtime/audio/menu-transport.js:86|lp|menuLoopParams(buf, key)|需要进一步测试|
|src/runtime/audio/menu-transport.js:87|src|audioCtx.createBufferSource()|需要进一步测试|
|src/runtime/audio/menu-transport.js:92|gain|audioCtx.createGain()|需要进一步测试|
|src/runtime/audio/menu-transport.js:96|offset|Math.min(     menuPosForKey(key, buf, startAt),     Math.max(0, buf.duration - 0.02),   )|需要进一步测试|
|src/runtime/audio/menu-transport.js:100|v|{     key,     src,     gain,     ramp: { v0: 0, v1: 0, t0: 0, t1: 0 },     stopping: false,     loopStart: src.loopStart,     loopEnd: src.loopEnd,   }|需要进一步测试|
|src/runtime/audio/menu-transport.js:116|i|menuBgm.voices.indexOf(v)|需要进一步测试|
|src/runtime/audio/menu-transport.js:127|dur|fadeSec == null ? MENU_FADE_SEC : fadeSec|需要进一步测试|
|src/runtime/audio/menu-transport.js:140|now|audioCtx.currentTime|需要进一步测试|
|src/runtime/audio/menu-transport.js:141|startAt|now + 0.03|需要进一步测试|
|src/runtime/audio/menu-transport.js:151|live|menuBgm.voices.find((v) => v.key === key && !v.stopping)|需要进一步测试|
|src/runtime/audio/menu-transport.js:155|target|menuTrimFor(key)|需要进一步测试|
|src/runtime/audio/menu-transport.js:171|token|++menuBgm.opToken|需要进一步测试|
|src/runtime/audio/menu-transport.js:177|buf|await menuLoadBuffer(key)|需要进一步测试|
|src/runtime/audio/menu-transport.js:190|endT|audioCtx.currentTime + MENU_FADE_SEC|需要进一步测试|
|src/runtime/audio/menu-transport.js:191|cur|menuBgm.currentKey|需要进一步测试|
|src/runtime/audio/menu-transport.js:192|buf|cur ? menuBgm.buffers[cur] : null|需要进一步测试|
|src/runtime/audio/menu-transport.js:219|cur|menuBgm.currentKey|需要进一步测试|
|src/runtime/audio/menu-transport.js:220|buf|cur ? menuBgm.buffers[cur] : null|需要进一步测试|
|src/runtime/audio/menu-transport.js:222|lp|menuLoopParams(buf, cur)|需要进一步测试|
|src/runtime/audio/menu-transport.js:223|ls|Math.min(lp.startSec, Math.max(0, buf.duration - 0.02))|需要进一步测试|
|src/runtime/audio/menu-transport.js:224|le|Math.min(lp.endSec, buf.duration)|需要进一步测试|
|src/runtime/audio/menu-transport.js:225|live|menuBgm.voices.find((v) => v.key === cur && !v.stopping)|需要进一步测试|
|src/runtime/audio/menu-transport.js:240|menuReloadTimer|null|需要进一步测试|
|src/runtime/audio/menu-transport.js:245|key|menuBgm.currentKey|需要进一步测试|
|src/runtime/audio/menu-transport.js:249|buf|await menuLoadBuffer(key)|需要进一步测试|
|src/runtime/audio/menu-transport.js:253|startAt|audioCtx.currentTime + 0.03|需要进一步测试|
|src/runtime/audio/menu-transport.js:265|key|getWelcomeTrackKey()|需要进一步测试|
|src/runtime/audio/picker-roll.js:1|rollLoopNode|null|需要进一步测试|
|src/runtime/audio/picker-roll.js:2|rollLoopGain|null|需要进一步测试|
|src/runtime/audio/picker-roll.js:6|sr|audioCtx.sampleRate|需要进一步测试|
|src/runtime/audio/picker-roll.js:7|dur|0.5|需要进一步测试|
|src/runtime/audio/picker-roll.js:8|buf|audioCtx.createBuffer(1, Math.floor(sr * dur), sr)|需要进一步测试|
|src/runtime/audio/picker-roll.js:9|d|buf.getChannelData(0)|需要进一步测试|
|src/runtime/audio/picker-roll.js:10|steps|8|需要进一步测试|
|src/runtime/audio/picker-roll.js:11|i|0|需要进一步测试|
|src/runtime/audio/picker-roll.js:12|t|i / sr|需要进一步测试|
|src/runtime/audio/picker-roll.js:13|step|Math.floor(t / (dur / steps))|需要进一步测试|
|src/runtime/audio/picker-roll.js:14|inStep|t - step * (dur / steps)|需要进一步测试|
|src/runtime/audio/picker-roll.js:27|buffer|selectFxBuffer("roll_loop") ／／ makeRollLoopBuffer()|需要进一步测试|
|src/runtime/audio/picker-roll.js:31|now|audioCtx.currentTime|需要进一步测试|
|src/runtime/audio/picker-roll.js:48|now|audioCtx.currentTime|需要进一步测试|
|src/runtime/audio/resource-loading.js:6|request|indexedDB.open("PoliticsScoreSoundDB_Unified", 1)|需要进一步测试|
|src/runtime/audio/resource-loading.js:9|database|e.target.result|需要进一步测试|
|src/runtime/audio/resource-loading.js:36|migrationDone|STORAGE.get("politics_audio_migration_v2", "0") === "1"|需要进一步测试|
|src/runtime/audio/resource-loading.js:64|AudioContextClass|window.AudioContext ／／ window.webkitAudioContext|需要进一步测试|
|src/runtime/audio/resource-loading.js:98|records|await new Promise((resolve) => {         const tx = db.transaction("sounds", "readonly");         const store = tx.objectStore("sounds");         const req = st|需要进一步测试|
|src/runtime/audio/resource-loading.js:99|tx|db.transaction("sounds", "readonly")|需要进一步测试|
|src/runtime/audio/resource-loading.js:100|store|tx.objectStore("sounds")|需要进一步测试|
|src/runtime/audio/resource-loading.js:101|req|store.getAll()|需要进一步测试|
|src/runtime/audio/resource-loading.js:106|ctx|await getAudioContext()|需要进一步测试|
|src/runtime/audio/resource-loading.js:107|fxRecords|records.filter(         (item) =>           item &&           typeof item.id === "string" &&           item.id.startsWith("fx_") &&           item.arrayBuffer &|需要进一步测试|
|src/runtime/audio/resource-loading.js:116|variants|Object.create(null)|需要进一步测试|
|src/runtime/audio/resource-loading.js:120|decoded|await ctx.decodeAudioData(               item.arrayBuffer.slice(0),             )|需要进一步测试|
|src/runtime/audio/resource-loading.js:123|key|item.id.slice(3)|需要进一步测试|
|src/runtime/audio/resource-loading.js:124|split|key.indexOf("::variant::")|需要进一步测试|
|src/runtime/audio/resource-loading.js:126|slot|key.slice(0, split)|需要进一步测试|
|src/runtime/audio/resource-loading.js:156|candidates|[     customFxBuffers[slotId],     ...(customFxVariants[slotId] ／／ []).map((x) => x.buffer),   ].filter(Boolean)|需要进一步测试|
|src/runtime/audio/resource-loading.js:170|choices|customFxVariants[slotId] ／／ []|需要进一步测试|
|src/runtime/audio/resource-loading.js:171|count|choices.length + (customFxBuffers[slotId] ? 1 : 0)|需要进一步测试|
|src/runtime/audio/resource-loading.js:178|tx|db.transaction("sounds", "readwrite")|需要进一步测试|
|src/runtime/audio/resource-loading.js:184|slot|id.slice(3, id.indexOf("::variant::"))|需要进一步测试|
|src/runtime/audio/resource-loading.js:201|doCheck|() => {     const isMenuSet = setIdx === 8;     const trackTypes = isMenuSet ? MENU_SET_TRACK_TYPES : SET_TRACK_TYPES;     const prefix = isMenuSet ? "bgm_menu_|需要进一步测试|
|src/runtime/audio/resource-loading.js:202|isMenuSet|setIdx === 8|需要进一步测试|
|src/runtime/audio/resource-loading.js:203|trackTypes|isMenuSet ? MENU_SET_TRACK_TYPES : SET_TRACK_TYPES|需要进一步测试|
|src/runtime/audio/resource-loading.js:204|prefix|isMenuSet ? "bgm_menu_" : bgm_set_${setIdx}_|需要进一步测试|
|src/runtime/audio/resource-loading.js:206|count|0|需要进一步测试|
|src/runtime/audio/resource-loading.js:207|hasThinking|false|需要进一步测试|
|src/runtime/audio/resource-loading.js:208|hasBattle|false|需要进一步测试|
|src/runtime/audio/resource-loading.js:210|t||需要进一步测试|
|src/runtime/audio/resource-loading.js:211|id|prefix + t.key|需要进一步测试|
|src/runtime/audio/resource-loading.js:233|completeIndices|[]|需要进一步测试|
|src/runtime/audio/resource-loading.js:234|i|0|需要进一步测试|
|src/runtime/audio/resource-loading.js:235|res|await checkSetCompleteness(i)|需要进一步测试|
|src/runtime/audio/resource-loading.js:242|i|0|需要进一步测试|
|src/runtime/audio/resource-loading.js:243|res|await checkSetCompleteness(i)|需要进一步测试|
|src/runtime/audio/resource-loading.js:250|completeSets|await getAllCompleteSetIndices()|需要进一步测试|
|src/runtime/audio/resource-loading.js:255|i|bgmShufflePool.length - 1|需要进一步测试|
|src/runtime/audio/resource-loading.js:256|j|Math.floor(Math.random() * (i + 1))|需要进一步测试|
|src/runtime/audio/resource-loading.js:266|fallbackIdx|await getFallbackSetIndex()|需要进一步测试|
|src/runtime/audio/resource-loading.js:278|rawDict|await new Promise((resolve) => {       const tx = db.transaction("sounds", "readonly");       const store = tx.objectStore("sounds");       const dict = {};    |需要进一步测试|
|src/runtime/audio/resource-loading.js:279|tx|db.transaction("sounds", "readonly")|需要进一步测试|
|src/runtime/audio/resource-loading.js:280|store|tx.objectStore("sounds")|需要进一步测试|
|src/runtime/audio/resource-loading.js:281|dict|{}|需要进一步测试|
|src/runtime/audio/resource-loading.js:282|pending|SET_TRACK_TYPES.length|需要进一步测试|
|src/runtime/audio/resource-loading.js:290|id|bgm_set_${setIdx}_${t.key}|需要进一步测试|
|src/runtime/audio/resource-loading.js:291|req|store.get(id)|需要进一步测试|
|src/runtime/audio/resource-loading.js:305|ctx|await getAudioContext()|需要进一步测试|
|src/runtime/audio/resource-loading.js:306|entries|Object.entries(rawDict)|需要进一步测试|
|src/runtime/audio/resource-loading.js:307|total|entries.length|需要进一步测试|
|src/runtime/audio/resource-loading.js:314|loadedCount|0|需要进一步测试|
|src/runtime/audio/resource-loading.js:315|buffers|{}|需要进一步测试|
|src/runtime/audio/resource-loading.js:341|{ setIndex, isFallback }|await pickNextPlayableSetIndex()|需要进一步测试|
|src/runtime/audio/resource-loading.js:343|buffers|await fetchAndDecodeSetBuffers(setIndex)|需要进一步测试|
|src/runtime/audio/session-cache.js:1|soundIdCache|new Set()|需要进一步测试|
|src/runtime/audio/session-cache.js:2|fxSoundsLoaded|false|需要进一步测试|
|src/runtime/audio/session-cache.js:3|fxSoundsLoading|null|需要进一步测试|
|src/runtime/audio/session-cache.js:4|backgroundAudioInitTimer|null|需要进一步测试|
|src/runtime/audio/session-cache.js:5|dbInitPromise|null|需要进一步测试|
|src/runtime/audio/session-cache.js:21|tx|db.transaction("sounds", "readonly")|需要进一步测试|
|src/runtime/audio/session-cache.js:22|store|tx.objectStore("sounds")|需要进一步测试|
|src/runtime/audio/session-cache.js:23|req|store.getAllKeys()|需要进一步测试|
|src/runtime/audio/session-cache.js:39|bgmEngine|{   state: "IDLE",   syncStartTime: 0,   battleGain: null,   thinkingGain: null,   activeNodes: [],   victoryNode: null,   preloadedSet: null,   isPreloading: f|需要进一步测试|
|src/runtime/audio/session-cache.js:54|effectiveBpm|currentSetIndex === 7       ? Number(menuCfg.battleSet8Bpm) ／／ 135       : Number(menuCfg.battleBaseBpm) ／／ Number(state.bpm) ／／ 130|需要进一步测试|
|src/runtime/audio/session-cache.js:66|now|audioCtx.currentTime|需要进一步测试|
|src/runtime/audio/session-cache.js:67|elapsed|Math.max(0, now - bgmEngine.syncStartTime)|需要进一步测试|
|src/runtime/audio/session-cache.js:68|secPerBeat|getSecPerBeat()|需要进一步测试|
|src/runtime/audio/session-cache.js:69|loopStartSec|8 * secPerBeat|需要进一步测试|
|src/runtime/audio/session-cache.js:70|loopEndSec|184 * secPerBeat|需要进一步测试|
|src/runtime/audio/session-cache.js:71|loopDurationSec|loopEndSec - loopStartSec|需要进一步测试|
|src/runtime/audio/session-cache.js:73|currentSecInTrack||需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:28|summaryText|state.groups     .map((g) => ${g.name}: ${(g.members ／／ []).join(", ")})     .join("\n")|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:48|parsed|Number(value)|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:61|bgmSlotRenderGeneration|0|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:63|container|document.getElementById("bgmListContainer")|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:65|generation|++bgmSlotRenderGeneration|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:66|setIdx|parseInt(document.getElementById("cfgSetSelector").value, 10)|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:67|isMenuSet|setIdx === 8|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:68|trackTypes|isMenuSet ? MENU_SET_TRACK_TYPES : SET_TRACK_TYPES|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:71|bpmDesc|document.getElementById("cfgSetBpmDesc")|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:76|effBpm|setIdx === 7           ? Number(menuCfg.battleSet8Bpm) ／／ 135           : Number(menuCfg.battleBaseBpm) ／／ 130|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:85|{ isComplete, count }|await checkSetCompleteness(setIdx)|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:87|currentIdxAfter|parseInt(     document.getElementById("cfgSetSelector").value,     10,   )|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:94|compLabel|document.getElementById("cfgSetCompleteness")|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:96|total|trackTypes.length|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:102|track||需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:103|slotId|isMenuSet         ? bgm_menu_${track.key}         : bgm_set_${setIdx}_${track.key}|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:106|isLoaded|hasSound(slotId)|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:108|row|document.createElement("div")|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:127|fxContainer|document.getElementById("soundListContainer")|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:130|categories|new Map()|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:132|category|slot.category ／／       (["roll_tick", "roll_loop", "roll_win"].includes(slot.id)         ? "点名过程与结果"         : slot.id === "ui_click"           ? "通用按钮默认音效"    |需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:142|[category, slots]||需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:143|section|document.createElement("details")|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:146|summary|document.createElement("summary")|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:149|slot||需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:150|isCustom|!!customFxBuffers[slot.id] ／／ !!customFxVariants[slot.id]?.length|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:152|row|document.createElement("div")|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:165|tx|db.transaction("sounds", "readonly")|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:166|store|tx.objectStore("sounds")|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:167|req|store.get(slotId)|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:170|ctx|await getAudioContext()|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:172|decoded|await ctx.decodeAudioData(             req.result.arrayBuffer.slice(0),           )|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:175|src|ctx.createBufferSource()|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:189|input|document.getElementById("soundFileInput")|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:194|files|Array.from(event.target.files ／／ [])|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:195|slotId|currentUploadingSlot|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:196|append|currentUploadingAppend|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:197|uploadGeneration|currentUploadingGeneration|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:199|fxKey|slotId.startsWith("fx_") ? slotId.slice(3) : null|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:205|candidate|!!fxKey && (append ／／ index > 0)|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:206|key|candidate               ? slotId + "::variant::" + crypto.randomUUID()               : slotId|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:209|reader|new FileReader()|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:215|decoded||需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:217|ctx|await getAudioContext()|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:233|saved|false|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:237|tx|db.transaction("sounds", "readwrite")|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:281|tx|db.transaction("sounds", "readwrite")|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:282|store|tx.objectStore("sounds")|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:296|tx|db.transaction("sounds", "readwrite")|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:297|store|tx.objectStore("sounds")|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:301|req|store.getAllKeys()|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:310|key||需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:328|tx|db.transaction("sounds", "readonly")|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:329|store|tx.objectStore("sounds")|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:330|allRecords|await new Promise((resolve) => {       const req = store.getAll();       req.onsuccess = () => resolve(req.result ／／ []);       req.onerror = () => resolve([]);|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:331|req|store.getAll()|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:341|currentOffset|0|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:342|fileIndex|[]|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:343|audioBuffersToPack|[]|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:345|record||需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:346|ab|record.arrayBuffer|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:357|indexBytes|new TextEncoder().encode(JSON.stringify(fileIndex))|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:358|headerBuffer|new ArrayBuffer(8)|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:359|headerView|new DataView(headerBuffer)|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:366|bundleBlob|new Blob(       [headerBuffer, indexBytes, ...audioBuffersToPack],       { type: "application/octet-stream" },     )|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:370|downloadUrl|URL.createObjectURL(bundleBlob)|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:371|a|document.createElement("a")|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:391|file|event.target.files[0]|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:395|reader|new FileReader()|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:398|fullBuffer|e.target.result|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:399|dataView|new DataView(fullBuffer)|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:405|indexLength|dataView.getUint32(4, true)|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:406|fileIndex|JSON.parse(         new TextDecoder().decode(new Uint8Array(fullBuffer, 8, indexLength)),       )|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:409|binaryStart|8 + indexLength|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:411|tx|db.transaction("sounds", "readwrite")|需要进一步测试|
|src/runtime/audio/settings-and-transfer.js:412|store|tx.objectStore("sounds")|需要进一步测试|
|src/runtime/audio/sound-playback.js:2|buttonTone|ActionSounds.slots.find((x) => x.id === slotId)|需要进一步测试|
|src/runtime/audio/sound-playback.js:6|now|audioCtx.currentTime|需要进一步测试|
|src/runtime/audio/sound-playback.js:9|osc|audioCtx.createOscillator()|需要进一步测试|
|src/runtime/audio/sound-playback.js:10|gain|audioCtx.createGain()|需要进一步测试|
|src/runtime/audio/sound-playback.js:23|osc|audioCtx.createOscillator()|需要进一步测试|
|src/runtime/audio/sound-playback.js:24|gain|audioCtx.createGain()|需要进一步测试|
|src/runtime/audio/sound-playback.js:37|freqs|[523.25, 659.25, 783.99, 1046.5]|需要进一步测试|
|src/runtime/audio/sound-playback.js:39|osc|audioCtx.createOscillator()|需要进一步测试|
|src/runtime/audio/sound-playback.js:40|gain|audioCtx.createGain()|需要进一步测试|
|src/runtime/audio/sound-playback.js:56|osc|audioCtx.createOscillator()|需要进一步测试|
|src/runtime/audio/sound-playback.js:57|gain|audioCtx.createGain()|需要进一步测试|
|src/runtime/audio/sound-playback.js:72|osc|audioCtx.createOscillator()|需要进一步测试|
|src/runtime/audio/sound-playback.js:73|gain|audioCtx.createGain()|需要进一步测试|
|src/runtime/audio/sound-playback.js:89|notes|[523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5]|需要进一步测试|
|src/runtime/audio/sound-playback.js:91|osc|audioCtx.createOscillator()|需要进一步测试|
|src/runtime/audio/sound-playback.js:92|gain|audioCtx.createGain()|需要进一步测试|
|src/runtime/audio/sound-playback.js:108|osc|audioCtx.createOscillator()|需要进一步测试|
|src/runtime/audio/sound-playback.js:109|gain|audioCtx.createGain()|需要进一步测试|
|src/runtime/audio/sound-playback.js:122|osc|audioCtx.createOscillator()|需要进一步测试|
|src/runtime/audio/sound-playback.js:123|gain|audioCtx.createGain()|需要进一步测试|
|src/runtime/audio/sound-playback.js:141|osc|audioCtx.createOscillator()|需要进一步测试|
|src/runtime/audio/sound-playback.js:142|gain|audioCtx.createGain()|需要进一步测试|
|src/runtime/audio/sound-playback.js:155|osc|audioCtx.createOscillator()|需要进一步测试|
|src/runtime/audio/sound-playback.js:156|gain|audioCtx.createGain()|需要进一步测试|
|src/runtime/audio/sound-playback.js:176|selectedFx|selectFxBuffer(slotId) ／／       (ActionSounds.isClick(slotId) && slotId !== "ui_click"         ? selectFxBuffer("ui_click")         : null)|需要进一步测试|
|src/runtime/audio/sound-playback.js:182|source|audioCtx.createBufferSource()|需要进一步测试|
|src/runtime/audio/sound-playback.js:188|gain|audioCtx.createGain()|需要进一步测试|
|src/runtime/bootstrap/classroom-startup.js:14|bar|document.getElementById("audioHintBar")|需要进一步测试|
|src/runtime/bootstrap/classroom-startup.js:35|autoPlayRetries|0|需要进一步测试|
|src/runtime/bootstrap/classroom-startup.js:36|resumeRetryTimer|null|需要进一步测试|
|src/runtime/bootstrap/classroom-startup.js:48|bar|document.getElementById("audioHintBar")|需要进一步测试|
|src/runtime/bootstrap/classroom-startup.js:60|m|document.getElementById("welcomeModal")|需要进一步测试|
|src/runtime/bootstrap/classroom-startup.js:68|unlockByGesture|() => {     getAudioContext()       .then(() => {         hideAudioHint();         const wm = document.getElementById("welcomeModal");         if (wm && wm.clas|需要进一步测试|
|src/runtime/bootstrap/classroom-startup.js:72|wm|document.getElementById("welcomeModal")|需要进一步测试|
|src/runtime/classroom/group-actions.js:6|newId|Date.now()|需要进一步测试|
|src/runtime/classroom/group-actions.js:7|index|state.groups.length + 1|需要进一步测试|
|src/runtime/classroom/group-actions.js:8|color|DEFAULT_COLORS[(index - 1) % DEFAULT_COLORS.length]|需要进一步测试|
|src/runtime/classroom/group-actions.js:33|target|state.groups.find((x) => x.id === groupId)|需要进一步测试|
|src/runtime/classroom/group-actions.js:50|g|state.groups.find((x) => x.id === groupId)|需要进一步测试|
|src/runtime/classroom/group-actions.js:61|g|state.groups.find((x) => x.id === groupId)|需要进一步测试|
|src/runtime/classroom/group-actions.js:82|updates|[]|需要进一步测试|
|src/runtime/classroom/group-palette.js:14|hex|document.getElementById("groupDetailColorHexV21716")|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:1|handEffectSuppressV218|false|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:6|box|document.getElementById("handEffectCardV218")|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:7|overlay|document.getElementById("handEffectOverlayV218")|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:9|lines|[]|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:11|old|before.get(g.id)|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:13|now|Number(g.score) ／／ 0|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:14|delta|now - old|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:35|g|state.groups.find((x) => x.id === handRaiseGroupId)|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:36|it|g?.inventory?.[0]|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:41|key|it.key|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:42|before|scoreSnapshotV218()|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:46|ok|useItem(g.id, 0)|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:51|g|state.groups.find((x) => x.id === handRaiseGroupId)|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:52|it|g?.inventory?.[0]|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:57|key|it.key|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:58|before|scoreSnapshotV218()|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:59|left|Math.min(3, Number(it.charges) ／／ 0)|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:63|fire|() => {     const live = state.groups.find((x) => x.id === handRaiseGroupId);     if (!live?.inventory?.[0] ／／ live.inventory[0].key !== key ／／ left <= 0) {    |需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:64|live|state.groups.find((x) => x.id === handRaiseGroupId)|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:78|box|document.getElementById("handRewardBox")|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:79|g|state.groups.find((x) => x.id === handRaiseGroupId)|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:81|main|g.inventory?.[0]|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:82|triple|main && TRIPLE_KEYS_V218.has(main.key) && Number(main.charges) > 1|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:83|drawDisabled|!eligibleForItems(g) ／／ g.inventory.length >= 3|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:97|_v218JudgeHandRaise|judgeHandRaise|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:99|r|_v218JudgeHandRaise.call(this, correct)|需要进一步测试|
|src/runtime/classroom/quick-person-score.js:1|qpStateV218|{   selected: new Set(),   bands: new Set(),   groups: new Set(),   letters: new Set(), }|需要进一步测试|
|src/runtime/classroom/quick-person-score.js:8|out|[]|需要进一步测试|
|src/runtime/classroom/quick-person-score.js:11|p|parseStudentV218(member)|需要进一步测试|
|src/runtime/classroom/quick-person-score.js:26|start|Math.floor(n / 10) * 10|需要进一步测试|
|src/runtime/classroom/quick-person-score.js:34|q|document.getElementById("qpSearchV218")|需要进一步测试|
|src/runtime/classroom/quick-person-score.js:44|set|qpStateV218[type]|需要进一步测试|
|src/runtime/classroom/quick-person-score.js:50|students|allStudentsV218()|需要进一步测试|
|src/runtime/classroom/quick-person-score.js:51|bands|[     ...new Set(students.map((s) => numberBandV218(s.p.number)).filter(Boolean)),   ].sort((a, b) => parseInt(a) - parseInt(b))|需要进一步测试|
|src/runtime/classroom/quick-person-score.js:54|bandBox|document.getElementById("qpNumberBandsV218")|需要进一步测试|
|src/runtime/classroom/quick-person-score.js:65|gb|document.getElementById("qpGroupFiltersV218")|需要进一步测试|
|src/runtime/classroom/quick-person-score.js:74|letters|"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")|需要进一步测试|
|src/runtime/classroom/quick-person-score.js:75|lb|document.getElementById("qpLetterFiltersV218")|需要进一步测试|
|src/runtime/classroom/quick-person-score.js:85|q|(document.getElementById("qpSearchV218")?.value ／／ "")     .trim()     .toLowerCase()|需要进一步测试|
|src/runtime/classroom/quick-person-score.js:90|qNum|q.replace(/\D/g, "")|需要进一步测试|
|src/runtime/classroom/quick-person-score.js:91|hitName|s.p.name.toLowerCase().includes(q) ／／         String(s.member).toLowerCase().includes(q)|需要进一步测试|
|src/runtime/classroom/quick-person-score.js:94|hitNum|qNum && s.p.number != null && String(s.p.number).includes(qNum)|需要进一步测试|
|src/runtime/classroom/quick-person-score.js:111|box|document.getElementById("quickPersonListV218")|需要进一步测试|
|src/runtime/classroom/quick-person-score.js:113|list|filteredStudentsV218()|需要进一步测试|
|src/runtime/classroom/quick-person-score.js:126|c|document.getElementById("qpSelectedCountV218")|需要进一步测试|
|src/runtime/classroom/quick-person-score.js:145|selected|allStudentsV218().filter((s) =>     qpStateV218.selected.has(s.key),   )|需要进一步测试|
|src/runtime/classroom/quick-person-score.js:152|counts|new Map()|需要进一步测试|
|src/runtime/classroom/quick-person-score.js:156|updates||需要进一步测试|
|src/runtime/classroom/quick-person-score.js:167|description|"快速按人加分：" +     selected.length +     " 人 · " +     updates       .map((u) => {         const name = state.groups.find((g) => g.id === u.id)?.name ／／ "小组";     |需要进一步测试|
|src/runtime/classroom/quick-person-score.js:173|name|state.groups.find((g) => g.id === u.id)?.name ／／ "小组"|需要进一步测试|
|src/runtime/classroom/quick-person-score.js:178|ok|runClassroomCommand(description, () => {     for (const u of updates)       state.groups.find((g) => g.id === u.id).score = u.score;     return true;   })|需要进一步测试|
|src/runtime/classroom/quick-person-score.js:179|u||需要进一步测试|
|src/runtime/classroom/quick-person-score.js:196|v|Number(document.getElementById("qpCustomScoreV218")?.value)|需要进一步测试|
|src/runtime/classroom/quick-person-score.js:205|right|document.querySelector(".bottom-dock .dock-right")|需要进一步测试|
|src/runtime/classroom/quick-person-score.js:207|b|document.createElement("button")|需要进一步测试|
|src/runtime/classroom/quick-person-score.js:213|hand|[...right.querySelectorAll("button")].find((x) =>       x.getAttribute("onclick")?.includes("openHandRaise"),     )|需要进一步测试|
|src/runtime/classroom/roster-settings-actions.js:6|text|document.getElementById("settingsBatchMemberText").value.trim()|需要进一步测试|
|src/runtime/classroom/roster-settings-actions.js:11|lines|text     .split("\n")     .map((l) => l.trim())     .filter(Boolean)|需要进一步测试|
|src/runtime/classroom/roster-settings-actions.js:16|newGroups|[]|需要进一步测试|
|src/runtime/classroom/roster-settings-actions.js:19|delimiter|line.includes(":") ? ":" : "："|需要进一步测试|
|src/runtime/classroom/roster-settings-actions.js:20|parts|line.split(delimiter)|需要进一步测试|
|src/runtime/classroom/roster-settings-actions.js:21|grpName|parts[0].trim()|需要进一步测试|
|src/runtime/classroom/roster-settings-actions.js:22|membersStr|parts.slice(1).join(delimiter).trim()|需要进一步测试|
|src/runtime/classroom/roster-settings-actions.js:23|members|membersStr         .split(/[,，、\s]+/)         .map((m) => m.trim())         .filter(Boolean)|需要进一步测试|
|src/runtime/classroom/roster-settings-actions.js:28|existing|state.groups.find((g) => g.name.trim() === grpName)|需要进一步测试|
|src/runtime/classroom/roster-text-import.js:6|sample|state.groups     .map((g) => ${g.name}: ${g.members.join(", ")})     .join("\n")|需要进一步测试|
|src/runtime/classroom/roster-text-import.js:18|text|document.getElementById("batchTextarea").value.trim()|需要进一步测试|
|src/runtime/classroom/roster-text-import.js:23|lines|text     .split("\n")     .map((l) => l.trim())     .filter(Boolean)|需要进一步测试|
|src/runtime/classroom/roster-text-import.js:27|parsedCount|0|需要进一步测试|
|src/runtime/classroom/roster-text-import.js:31|delimiter|line.includes(":") ? ":" : "："|需要进一步测试|
|src/runtime/classroom/roster-text-import.js:32|[grpName, membersStr]|line.split(delimiter)|需要进一步测试|
|src/runtime/classroom/roster-text-import.js:33|targetGroup|state.groups.find(         (g) =>           g.name.trim() === grpName.trim() ／／           g.name.replace(/\s+/g, "") === grpName.replace(/\s+/g, ""),       )|需要进一步测试|
|src/runtime/classroom/roster-text-import.js:39|members|membersStr           .split(/[,，、\s]+/)           .map((m) => m.trim())           .filter(Boolean)|需要进一步测试|
|src/runtime/classroom/student-labels-and-search.js:5|text|String(raw ?? "").trim()|需要进一步测试|
|src/runtime/classroom/student-labels-and-search.js:7|m|text.match(/^(\d{1,4})\s*[-_—–:：.]?\s*(.*)$/)|需要进一步测试|
|src/runtime/classroom/student-labels-and-search.js:17|p|parseStudentV218(raw)|需要进一步测试|
|src/runtime/classroom/student-labels-and-search.js:23|name|parseStudentV218(raw).name.trim()|需要进一步测试|
|src/runtime/classroom/student-labels-and-search.js:25|ch|name[0]|需要进一步测试|
|src/runtime/classroom/student-labels-and-search.js:28|bounds|[     ["A", "阿"],     ["B", "芭"],     ["C", "擦"],     ["D", "搭"],     ["E", "蛾"],     ["F", "发"],     ["G", "噶"],     ["H", "哈"],     ["J", "击"],     ["K", "喀"]|需要进一步测试|
|src/runtime/classroom/student-labels-and-search.js:54|result|"A"|需要进一步测试|
|src/runtime/classroom/student-labels-and-search.js:55|[letter, bound]||需要进一步测试|
|src/runtime/classroom/student-labels-and-search.js:71|_v218RenderBattleRankPreview|renderBattleRankPreviewV21721|需要进一步测试|
|src/runtime/classroom/student-labels-and-search.js:73|r|_v218RenderBattleRankPreview.apply(this, arguments)|需要进一步测试|
|src/runtime/classroom/student-labels-and-search.js:74|active|Number(state.itemGlobal?.blooperUntil ／／ 0) > Date.now()|需要进一步测试|
|src/runtime/classroom/student-labels-and-search.js:87|input|document.getElementById("memberSearchInput")|需要进一步测试|
|src/runtime/classroom/student-labels-and-search.js:88|results|document.getElementById("memberSearchResults")|需要进一步测试|
|src/runtime/classroom/student-labels-and-search.js:90|q|input.value.trim().toLowerCase()|需要进一步测试|
|src/runtime/classroom/student-labels-and-search.js:97|matches|[]|需要进一步测试|
|src/runtime/classroom/student-labels-and-search.js:100|p|parseStudentV218(member)|需要进一步测试|
|src/runtime/classroom/student-labels-and-search.js:101|numberHit|p.number != null && String(p.number).includes(q.replace(/\D/g, ""))|需要进一步测试|
|src/runtime/classroom/student-labels-and-search.js:103|nameHit|p.name.toLowerCase().includes(q) ／／         String(member).toLowerCase().includes(q)|需要进一步测试|
|src/runtime/classroom/student-labels-and-search.js:125|memberSearchInputV218|document.getElementById("memberSearchInput")|需要进一步测试|
|src/runtime/classroom/student-labels-and-search.js:131|el|document.getElementById("pickerScoreTarget")|需要进一步测试|
|src/runtime/classroom/student-labels-and-search.js:132|w|slotEngine.chosenResult|需要进一步测试|
|src/runtime/classroom/student-labels-and-search.js:139|g|state.picker.mode === "group" ? w : w.group|需要进一步测试|
|src/runtime/competition/answer-adapter.js:19|flipSnapshotV21725|captureCardRectsV21725()|需要进一步测试|
|src/runtime/competition/answer-adapter.js:21|allInWins|0|需要进一步测试|
|src/runtime/competition/answer-adapter.js:22|allInLosses|0|需要进一步测试|
|src/runtime/competition/answer-adapter.js:23|hasNormalWin|false|需要进一步测试|
|src/runtime/competition/answer-adapter.js:24|hasMilestone|false|需要进一步测试|
|src/runtime/competition/answer-adapter.js:25|milestoneGroups|[]|需要进一步测试|
|src/runtime/competition/answer-adapter.js:26|scoreUpdates|[]|需要进一步测试|
|src/runtime/competition/answer-adapter.js:28|roundResults|CompetitionRules.calculateRound(state)|需要进一步测试|
|src/runtime/competition/answer-adapter.js:30|result|roundResults[index]|需要进一步测试|
|src/runtime/competition/answer-adapter.js:34|oldScore|result.scoreBefore|需要进一步测试|
|src/runtime/competition/answer-adapter.js:43|oldDigits|Math.floor(Math.abs(oldScore)).toString().length|需要进一步测试|
|src/runtime/competition/answer-adapter.js:44|newDigits|Math.floor(Math.abs(g.score)).toString().length|需要进一步测试|
|src/runtime/competition/batch-all-in-guard.js:13|locked|state.groups.filter((g) => g.itemUsedThisRound)|需要进一步测试|
|src/runtime/competition/batch-all-in-guard.js:14|eligible|state.groups.filter((g) => !g.itemUsedThisRound)|需要进一步测试|
|src/runtime/competition/batch-all-in-guard.js:32|allEligibleAllIn|eligible.every((g) => g.allIn)|需要进一步测试|
|src/runtime/competition/batch-all-in-guard.js:33|targetState|!allEligibleAllIn|需要进一步测试|
|src/runtime/competition/batch-all-in-guard.js:50|ratioMet|checkAllInRatio()|需要进一步测试|
|src/runtime/competition/round-actions.js:21|roundToken|RoundSettlement.captureRoundToken()|需要进一步测试|
|src/runtime/competition/round-actions.js:23|overlay|document.getElementById("initProgressOverlay")|需要进一步测试|
|src/runtime/competition/round-actions.js:24|fill|document.getElementById("initProgressFill")|需要进一步测试|
|src/runtime/competition/round-actions.js:25|txt|document.getElementById("initProgressText")|需要进一步测试|
|src/runtime/competition/round-actions.js:30|playable|await Promise.race([       hasAnyPlayableBgm(),       new Promise((res) => setTimeout(() => res(false), 2500)),     ])|需要进一步测试|
|src/runtime/competition/round-actions.js:105|complete|await getAllCompleteSetIndices()|需要进一步测试|
|src/runtime/competition/round-actions.js:107|fb|await getFallbackSetIndex()|需要进一步测试|
|src/runtime/competition/round-actions.js:123|roundToken|RoundSettlement.captureRoundToken()|需要进一步测试|
|src/runtime/competition/round-actions.js:126|overlay|document.getElementById("initProgressOverlay")|需要进一步测试|
|src/runtime/competition/round-actions.js:127|fill|document.getElementById("initProgressFill")|需要进一步测试|
|src/runtime/competition/round-actions.js:128|txt|document.getElementById("initProgressText")|需要进一步测试|
|src/runtime/competition/round-actions.js:149|flipSnapshotV21725|captureCardRectsV21725()|需要进一步测试|
|src/runtime/competition/round-actions.js:152|committed||需要进一步测试|
|src/runtime/competition/round-actions.js:175|result|await classroomCommands.whenIdle()|需要进一步测试|
|src/runtime/competition/round-actions.js:178|nextRoundAllIn|checkAllInRatio()|需要进一步测试|
|src/runtime/competition/season-cleanup.js:43|customIcons|state.itemGlobal && state.itemGlobal.customIcons       ? state.itemGlobal.customIcons       : STORAGE.getJSON("politics_item_icons", {})|需要进一步测试|
|src/runtime/core/state-and-preferences.js:1|DEFAULT_COLORS|[   "#E5484D",   "#2F7DD1",   "#3A9D5D",   "#F08C1A",   "#8E44AD",   "#18A6B8",   "#4F64D8",   "#D84A83",   "#D95D39",   "#159E91",   "#6FA52E",   "#A05BE5",   |需要进一步测试|
|src/runtime/core/state-and-preferences.js:21|raw|String(hex ／／ "")     .trim()     .replace("#", "")|需要进一步测试|
|src/runtime/core/state-and-preferences.js:24|value|raw.length === 3       ? raw           .split("")           .map((x) => x + x)           .join("")       : raw|需要进一步测试|
|src/runtime/core/state-and-preferences.js:32|rgb|[0, 2, 4]     .map((i) => parseInt(value.slice(i, i + 2), 16) / 255)     .map((v) =>       v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4),     )|需要进一步测试|
|src/runtime/core/state-and-preferences.js:37|luminance|0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]|需要进一步测试|
|src/runtime/core/state-and-preferences.js:39|ink|[23, 48, 45]     .map((v) => v / 255)     .map((v) =>       v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4),     )|需要进一步测试|
|src/runtime/core/state-and-preferences.js:44|inkLuminance|0.2126 * ink[0] + 0.7152 * ink[1] + 0.0722 * ink[2]|需要进一步测试|
|src/runtime/core/state-and-preferences.js:49|FX_SOUND_SLOTS|[   {     id: "fullscreen_pick",     name: "全屏点名揭晓",     category: "全屏演出",     desc: "全屏揭晓时播放；支持多段候选随机播放",   },   {     id: "fullscreen_score_add",     name: "全|需要进一步测试|
|src/runtime/core/state-and-preferences.js:90|SET_TRACK_TYPES|[   {     key: "intro_normal",     name: "常规 Intro 1",     desc: "开局引子或无 All in 衔接",   },   {     key: "intro_win",     name: "胜利翻盘 Intro 2",     desc: "上一题 All|需要进一步测试|
|src/runtime/core/state-and-preferences.js:144|STORAGE|{   get(key, fallback = null) {     try {       return localStorage.getItem(key) ?? fallback;     } catch (_) {       return fallback;     }   },   set(key, val|需要进一步测试|
|src/runtime/core/state-and-preferences.js:162|raw|localStorage.getItem(key)|需要进一步测试|
|src/runtime/core/state-and-preferences.js:178|clone|(value) => JSON.parse(JSON.stringify(value))|需要进一步测试|
|src/runtime/core/state-and-preferences.js:180|state|{   isLocked: true,   seasonId: StableIdentity.createSeasonId(),   achievementLedger: AchievementLedger.empty(),   hasStartedOnce: false,   roundActive: false, |需要进一步测试|
|src/runtime/core/state-and-preferences.js:212|saved|STORAGE.getJSON("politics_groups_data", null)|需要进一步测试|
|src/runtime/core/state-and-preferences.js:216|parsedPicker|STORAGE.getJSON("politics_picker_state", null)|需要进一步测试|
|src/runtime/core/state-and-preferences.js:277|GROUP_AVATAR_MAX_BYTES_V2200|512 * 1024|需要进一步测试|
|src/runtime/core/state-and-preferences.js:287|source|raw && typeof raw === "object" ? raw : {}|需要进一步测试|
|src/runtime/core/state-and-preferences.js:288|numericScore|Number(source.score)|需要进一步测试|
|src/runtime/core/state-and-preferences.js:289|id|Number.isFinite(Number(source.id))     ? Number(source.id)     : Date.now() + index|需要进一步测试|
|src/runtime/core/state-and-preferences.js:293|color|/^#[0-9a-fA-F]{6}$/.test(String(source.color ／／ ""))     ? String(source.color)     : DEFAULT_COLORS[index % DEFAULT_COLORS.length]|需要进一步测试|
|src/runtime/core/state-and-preferences.js:296|members|Array.isArray(source.members)     ? source.members.map((v) => String(v ?? "").trim()).filter(Boolean)     : []|需要进一步测试|
|src/runtime/core/state-and-preferences.js:350|seen|new Set()|需要进一步测试|
|src/runtime/core/state-and-preferences.js:354|g|normalizeGroup(raw, index)|需要进一步测试|
|src/runtime/core/state-and-preferences.js:393|MAX_HISTORY|40|需要进一步测试|
|src/runtime/core/state-and-preferences.js:394|historyStack|[]|需要进一步测试|
|src/runtime/core/state-and-preferences.js:396|audioCtx|null|需要进一步测试|
|src/runtime/core/state-and-preferences.js:397|masterGainNode|null|需要进一步测试|
|src/runtime/core/state-and-preferences.js:398|musicGainNode|null|需要进一步测试|
|src/runtime/core/state-and-preferences.js:399|bgmVolume|Number(STORAGE.get("politics_bgm_volume", "1"))|需要进一步测试|
|src/runtime/core/state-and-preferences.js:402|db|null|需要进一步测试|
|src/runtime/core/state-and-preferences.js:403|customFxBuffers|{}|需要进一步测试|
|src/runtime/core/state-and-preferences.js:404|customFxVariants|Object.create(null)|需要进一步测试|
|src/runtime/core/state-and-preferences.js:405|currentUploadingAppend|false|需要进一步测试|
|src/runtime/core/state-and-preferences.js:406|currentUploadingGeneration|0|需要进一步测试|
|src/runtime/core/state-and-preferences.js:407|activeSetBuffers|{}|需要进一步测试|
|src/runtime/core/state-and-preferences.js:408|currentUploadingSlot|null|需要进一步测试|
|src/runtime/core/state-and-preferences.js:409|activeEditingGroupId|null|需要进一步测试|
|src/runtime/core/state-and-preferences.js:411|slotEngine|{   isSpinning: false,   timerGroup: null,   timerStudent: null,   chosenResult: null, }|需要进一步测试|
|src/runtime/core/state-and-preferences.js:418|bgmShufflePool|[]|需要进一步测试|
|src/runtime/core/state-and-preferences.js:419|currentSetIndex|-1|需要进一步测试|
|src/runtime/core/state-and-preferences.js:420|isSwitchingRound|false|需要进一步测试|
|src/runtime/core/state-and-preferences.js:421|isStartingRound|false|需要进一步测试|
|src/runtime/core/state-and-preferences.js:424|total|state.groups.length|需要进一步测试|
|src/runtime/core/state-and-preferences.js:426|count|state.groups.filter((g) => g.allIn).length|需要进一步测试|
|src/runtime/history/boot-and-settings-compat.js:1|V26_HISTORY_KEY|"politics_history_stack_v26"|需要进一步测试|
|src/runtime/history/boot-and-settings-compat.js:4|hs|STORAGE.getJSON(V26_HISTORY_KEY, [])|需要进一步测试|
|src/runtime/history/compatibility-ui.js:14|nodes|document.querySelectorAll("#historyListView .hist-node")|需要进一步测试|
|src/runtime/history/compatibility-ui.js:15|node|nodes[nodes.length - 1 - index]|需要进一步测试|
|src/runtime/items/attack-legacy.js:2|actor|state.groups.find((g) => g.id === actorId)|需要进一步测试|
|src/runtime/items/attack-legacy.js:9|after|ranking().map((g) => g.id)|需要进一步测试|
|src/runtime/items/attack-legacy.js:10|beforeIdx|beforeOrder.indexOf(actorId)|需要进一步测试|
|src/runtime/items/attack-legacy.js:11|afterIdx|after.indexOf(actorId)|需要进一步测试|
|src/runtime/items/attack-legacy.js:13|passed|beforeOrder     .slice(afterIdx, beforeIdx)     .filter((id) => id !== actorId)|需要进一步测试|
|src/runtime/items/attack-legacy.js:17|t|state.groups.find((g) => g.id === id)|需要进一步测试|
|src/runtime/items/attack-legacy.js:30|c|document.querySelector(.group-row-card[data-group-id="${id}"])|需要进一步测试|
|src/runtime/items/attack-legacy.js:41|any|false|需要进一步测试|
|src/runtime/items/attack-legacy.js:46|t|state.groups.find((x) => x.id === g.itemEffect.targetId)|需要进一步测试|
|src/runtime/items/attack-legacy.js:48|ix|g.inventory.findIndex((x) => x.key === "bullet")|需要进一步测试|
|src/runtime/items/attack-legacy.js:75|on|(state.itemGlobal?.blooperUntil ／／ 0) > Date.now()|需要进一步测试|
|src/runtime/items/attack-legacy.js:76|v|document.getElementById("squidVeil")|需要进一步测试|
|src/runtime/items/card-effects-legacy.js:1|CARD_ITEM_FX_CLASS|{   green_shell: "cfx-green",   triple_green: "cfx-green",   red_shell: "cfx-red",   triple_red: "cfx-red",   spiny_shell: "cfx-spiny",   banana: "cfx-banana", |需要进一步测试|
|src/runtime/items/card-effects-legacy.js:25|CARD_HIT_COLOR|{   green_shell: "#22c55e",   triple_green: "#22c55e",   red_shell: "#ef4444",   triple_red: "#ef4444",   spiny_shell: "#3b82f6",   banana: "#eab308",   triple_|需要进一步测试|
|src/runtime/items/card-effects-legacy.js:71|card|battleCard(gid)|需要进一步测试|
|src/runtime/items/card-effects-legacy.js:72|d|ITEM_DEFS[key]|需要进一步测试|
|src/runtime/items/card-effects-legacy.js:77|b|document.createElement("div")|需要进一步测试|
|src/runtime/items/card-effects-legacy.js:98|card|battleCard(id)|需要进一步测试|
|src/runtime/items/card-effects-legacy.js:124|r|ranking()|需要进一步测试|
|src/runtime/items/card-effects-legacy.js:125|i|r.findIndex((g) => g.id === gid)|需要进一步测试|
|src/runtime/items/card-effects-legacy.js:126|ids|[]|需要进一步测试|
|src/runtime/items/card-effects-legacy.js:127|add|(g) => {       if (g && g.id !== gid && !ids.includes(g.id)) ids.push(g.id);     }|需要进一步测试|
|src/runtime/items/card-effects-legacy.js:143|_v25ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/runtime/items/card-effects-legacy.js:148|targets|cardFxTargets(key, casterId)|需要进一步测试|
|src/runtime/items/card-effects-legacy.js:149|beneficial|["coin_shell", "question_block"].includes(key)|需要进一步测试|
|src/runtime/items/catalog-adapters.js:1|ITEM_ORDER_V283|[   "green",   "triple_green",   "red",   "triple_red",   "spiny",   "banana",   "triple_banana",   "horn",   "bobomb",   "hammer",   "coin",   "coin_shell",   |需要进一步测试|
|src/runtime/items/catalog-adapters.js:39|d|ITEM_DEFS[k]|需要进一步测试|
|src/runtime/items/catalog-adapters.js:43|g|state.groups.find((x) => x.id === gid)|需要进一步测试|
|src/runtime/items/catalog-adapters.js:63|g|state.groups.find((x) => x.id === gid)|需要进一步测试|
|src/runtime/items/catalog-adapters.js:65|roots|[     ...document.querySelectorAll(       ".god-item-manager,.item-god-manager,.god-item-grid",     ),   ]|需要进一步测试|
|src/runtime/items/catalog-adapters.js:70|root|roots.find((x) => x.closest(".modal,.group-modal,.vista-window")) ／／     roots[0]|需要进一步测试|
|src/runtime/items/catalog-adapters.js:74|tactical|document.querySelector(       '.group-modal .tactical-tab-content,.group-modal [data-tab-content="items"],#groupModal .tactical-items',     )|需要进一步测试|
|src/runtime/items/catalog-adapters.js:89|all|[...document.querySelectorAll("body *")]|需要进一步测试|
|src/runtime/items/catalog-adapters.js:90|title|all.find(     (el) =>       el.children.length === 0 &&       /上帝模式.*强制道具管理/.test(el.textContent ／／ ""),   )|需要进一步测试|
|src/runtime/items/catalog-adapters.js:96|box|title.nextElementSibling|需要进一步测试|
|src/runtime/items/catalog-adapters.js:109|headings|[     ...document.querySelectorAll("h1,h2,h3,.about-title,.section-title"),   ]|需要进一步测试|
|src/runtime/items/catalog-adapters.js:112|h|headings.find((x) =>     /22\s*种道具百科／26\s*种道具百科/.test(x.textContent ／／ ""),   )|需要进一步测试|
|src/runtime/items/catalog-adapters.js:117|host|h.nextElementSibling|需要进一步测试|
|src/runtime/items/catalog-adapters.js:120|parent|h.parentElement|需要进一步测试|
|src/runtime/items/catalog-adapters.js:121|candidates|[...parent.children]|需要进一步测试|
|src/runtime/items/catalog-adapters.js:122|start|candidates.indexOf(h) + 1|需要进一步测试|
|src/runtime/items/catalog-adapters.js:123|cards|candidates     .slice(start)     .filter(       (x) =>         x.matches?.(           ".guide-block,.item-guide-card,.about-item-card,.encyclopedia-item",      |需要进一步测试|
|src/runtime/items/catalog-adapters.js:134|d|ITEM_DEFS[k]|需要进一步测试|
|src/runtime/items/catalog-adapters.js:135|card|document.createElement("div")|需要进一步测试|
|src/runtime/items/catalog-adapters.js:143|d|ITEM_DEFS[k]|需要进一步测试|
|src/runtime/items/catalog-adapters.js:156|existingText|document.body.innerText ／／ ""|需要进一步测试|
|src/runtime/items/catalog-adapters.js:157|about|document.querySelector(       "#aboutModal,.about-modal,#aboutWindow,.about-window",     ) ／／ document.body|需要进一步测试|
|src/runtime/items/catalog-adapters.js:161|title|[...about.querySelectorAll("h1,h2,h3")].find((x) =>     /26\s*种道具百科/.test(x.textContent ／／ ""),   )|需要进一步测试|
|src/runtime/items/catalog-adapters.js:165|parent|title.parentElement|需要进一步测试|
|src/runtime/items/catalog-adapters.js:167|d|ITEM_DEFS[k]|需要进一步测试|
|src/runtime/items/catalog-adapters.js:169|card|document.createElement("div")|需要进一步测试|
|src/runtime/items/catalog-adapters.js:178|setting|document.querySelector("#view-settings") ／／ document|需要进一步测试|
|src/runtime/items/catalog-adapters.js:179|labels|[...setting.querySelectorAll("*")].filter(     (x) =>       x.children.length === 0 &&       /道具.*图标／自定义道具/.test(x.textContent ／／ ""),   )|需要进一步测试|
|src/runtime/items/catalog-adapters.js:184|anchor|labels[0]|需要进一步测试|
|src/runtime/items/catalog-adapters.js:186|region|anchor.parentElement?.parentElement ／／ anchor.parentElement|需要进一步测试|
|src/runtime/items/catalog-adapters.js:188|txt|region.innerText ／／ ""|需要进一步测试|
|src/runtime/items/catalog-adapters.js:190|d|ITEM_DEFS[k]|需要进一步测试|
|src/runtime/items/catalog-adapters.js:192|row|document.createElement("div")|需要进一步测试|
|src/runtime/items/catalog-adapters.js:205|_v283OpenGroupModal|openGroupModal|需要进一步测试|
|src/runtime/items/catalog-adapters.js:207|r|_v283OpenGroupModal.call(this, gid, ...a)|需要进一步测试|
|src/runtime/items/catalog-adapters.js:213|_v283RenderGroupModal|renderGroupModal|需要进一步测试|
|src/runtime/items/catalog-adapters.js:215|r|_v283RenderGroupModal.apply(this, a)|需要进一步测试|
|src/runtime/items/catalog-adapters.js:216|gid|state.activeModalGroupId ／／ activeEditingGroupId|需要进一步测试|
|src/runtime/items/catalog-adapters.js:223|_v283OpenAbout|typeof openAboutModal === "function" ? openAboutModal : null|需要进一步测试|
|src/runtime/items/catalog-adapters.js:227|r|_v283OpenAbout.apply(this, a)|需要进一步测试|
|src/runtime/items/defense-chain-compat.js:3|BASIC_DEFENSE_KEYS_V2170|new Set([   "green",   "triple_green",   "red",   "triple_red",   "banana",   "triple_banana",   "bomb", ])|需要进一步测试|
|src/runtime/items/defense-chain-compat.js:12|SHELL_ATTACK_KEYS_V2170|new Set([   "green",   "triple_green",   "red",   "triple_red", ])|需要进一步测试|
|src/runtime/items/defense-chain-compat.js:74|r|ranking()|需要进一步测试|
|src/runtime/items/defense-chain-compat.js:75|i|r.findIndex((x) => x.id === holder.id)|需要进一步测试|
|src/runtime/items/defense-chain-compat.js:77|targets|[r[i - 1], r[i + 1]].filter(     (t) => t && t.id !== holder.id && eligibleForItems(t),   )|需要进一步测试|
|src/runtime/items/defense-chain-compat.js:87|loss|roundQuarter(t.score)|需要进一步测试|
|src/runtime/items/defense-chain-compat.js:102|main|target?.inventory?.[0]|需要进一步测试|
|src/runtime/items/defense-chain-compat.js:105|destroyedKey|main.key|需要进一步测试|
|src/runtime/items/defense-chain-compat.js:107|name|ITEM_DEFS[destroyedKey]?.name ／／ "基础防御道具"|需要进一步测试|
|src/runtime/items/defense-chain-compat.js:131|actor|state.groups.find((g) => g.id === actorId)|需要进一步测试|
|src/runtime/items/defense-chain-compat.js:139|after|ranking().map((g) => g.id)|需要进一步测试|
|src/runtime/items/defense-chain-compat.js:140|beforeIdx|beforeOrder.indexOf(actorId)|需要进一步测试|
|src/runtime/items/defense-chain-compat.js:141|afterIdx|after.indexOf(actorId)|需要进一步测试|
|src/runtime/items/defense-chain-compat.js:144|passed|beforeOrder     .slice(afterIdx, beforeIdx)     .filter((id) => id !== actorId)|需要进一步测试|
|src/runtime/items/defense-chain-compat.js:148|t|state.groups.find((g) => g.id === id)|需要进一步测试|
|src/runtime/items/defense-chain-compat.js:167|main|it ／／ g?.inventory?.[0]|需要进一步测试|
|src/runtime/items/defense-chain-compat.js:187|type|target?.itemEffect?.type|需要进一步测试|
|src/runtime/items/defense-chain-compat.js:190|name|ITEM_DEFS[type]?.name ／／ "持续状态"|需要进一步测试|
|src/runtime/items/definitions-and-state.js:1|ITEM_DEFS|{   green: {     name: "绿龟壳",     icon: "🟢",     kind: "attack",     def: "green",     charges: 1,     desc: "随机攻击其他小组 -1/4；可抵挡常规攻击与刺龟壳。",   },   triple_green:|需要进一步测试|
|src/runtime/items/definitions-and-state.js:215|ITEM_KEYS|Object.keys(ITEM_DEFS)|需要进一步测试|
|src/runtime/items/definitions-and-state.js:217|ITEM_DRAW_KEYS|Object.freeze([...ITEM_KEYS])|需要进一步测试|
|src/runtime/items/definitions-and-state.js:230|ITEM_DEFENSE_KEYS|new Set([   "green",   "triple_green",   "red",   "triple_red",   "banana",   "triple_banana",   "horn", ])|需要进一步测试|
|src/runtime/items/definitions-and-state.js:239|activeItemGroupId|null|需要进一步测试|
|src/runtime/items/definitions-and-state.js:240|activeItemTab|"detail"|需要进一步测试|
|src/runtime/items/definitions-and-state.js:241|itemDrawBusy|false|需要进一步测试|
|src/runtime/items/definitions-and-state.js:242|bulletTimer|null|需要进一步测试|
|src/runtime/items/definitions-and-state.js:248|seen|new Set()|需要进一步测试|
|src/runtime/items/definitions-and-state.js:252|key|it && it.key|需要进一步测试|
|src/runtime/items/definitions-and-state.js:258|configuredCharges|Number.isInteger(it.configuredCharges) &&         it.configuredCharges >= 1 &&         it.configuredCharges <= 99           ? it.configuredCharges           : n|需要进一步测试|
|src/runtime/items/definitions-and-state.js:264|maxCharges|configuredCharges ／／         Math.max(1, Number(ITEM_DEFS[it.key]?.charges) ／／ 1)|需要进一步测试|
|src/runtime/items/definitions-and-state.js:267|storedCharges|Number(it.charges)|需要进一步测试|
|src/runtime/items/definitions-and-state.js:268|charges|Number.isFinite(storedCharges)         ? Math.max(1, Math.min(maxCharges, Math.trunc(storedCharges)))         : maxCharges|需要进一步测试|
|src/runtime/items/definitions-and-state.js:271|acquiredAt|Number(it.acquiredAt) ／／ Date.now() + i|需要进一步测试|
|src/runtime/items/definitions-and-state.js:272|itemInstanceId|StableIdentity.isValidItemInstanceId(         it.itemInstanceId,       )         ? it.itemInstanceId         : StableIdentity.createItemInstanceId()|需要进一步测试|
|src/runtime/items/definitions-and-state.js:277|expectedKeys|3 + 1 + (configuredCharges ? 1 : 0)|需要进一步测试|
|src/runtime/items/draw-flow.js:2|ITEM_DRAW_DURATION_V21712|1500|需要进一步测试|
|src/runtime/items/draw-flow.js:3|ITEM_DRAW_RESULT_HOLD_V21712|900|需要进一步测试|
|src/runtime/items/draw-flow.js:4|ITEM_DRAW_FADE_V21712|620|需要进一步测试|
|src/runtime/items/draw-flow.js:5|ITEM_FX_DURATION_V21712|1700|需要进一步测试|
|src/runtime/items/draw-flow.js:6|activeGlobalItemDraw|null|需要进一步测试|
|src/runtime/items/draw-flow.js:14|generation|++drawAudioGenerationV2171|需要进一步测试|
|src/runtime/items/draw-flow.js:15|duration|ITEM_DRAW_DURATION_V21712|需要进一步测试|
|src/runtime/items/draw-flow.js:19|tickCount|0|需要进一步测试|
|src/runtime/items/draw-flow.js:20|tickInterval|110|需要进一步测试|
|src/runtime/items/draw-flow.js:52|eligible|state.groups.filter(     (g) =>       eligibleForItems(g) &&       Array.isArray(g.inventory) &&       g.inventory.length < 3,   )|需要进一步测试|
|src/runtime/items/draw-flow.js:63|overlays|new Map()|需要进一步测试|
|src/runtime/items/draw-flow.js:64|awards|[]|需要进一步测试|
|src/runtime/items/draw-flow.js:65|context|null|需要进一步测试|
|src/runtime/items/draw-flow.js:66|resolveReveal||需要进一步测试|
|src/runtime/items/draw-flow.js:67|revealReady|new Promise((resolve) => {     resolveReveal = resolve;   })|需要进一步测试|
|src/runtime/items/draw-flow.js:72|parent|node?.parentElement|需要进一步测试|
|src/runtime/items/draw-flow.js:112|start|performance.now()|需要进一步测试|
|src/runtime/items/draw-flow.js:113|total|ITEM_DRAW_DURATION_V21712|需要进一步测试|
|src/runtime/items/draw-flow.js:117|c|document.querySelector(         .group-row-card[data-group-id="${g.id}"],       )|需要进一步测试|
|src/runtime/items/draw-flow.js:123|o|document.createElement("div")|需要进一步测试|
|src/runtime/items/draw-flow.js:133|lastUpdate|new Map()|需要进一步测试|
|src/runtime/items/draw-flow.js:137|t|Math.min(1, (now - start) / total)|需要进一步测试|
|src/runtime/items/draw-flow.js:140|interval|55 + 90 * Math.pow(t, 2.1)|需要进一步测试|
|src/runtime/items/draw-flow.js:143|prev|lastUpdate.get(g.id) ／／ 0|需要进一步测试|
|src/runtime/items/draw-flow.js:160|{ id, key }||需要进一步测试|
|src/runtime/items/draw-flow.js:161|node|overlays.get(id)|需要进一步测试|
|src/runtime/items/draw-flow.js:165|hint|node.querySelector(".r-hint")|需要进一步测试|
|src/runtime/items/draw-flow.js:192|accepted|runClassroomCommand(     "全局道具抽取",     (command) => {       // Cancelling an older command can restore a different groups array.       eligible = state.groups.f|需要进一步测试|
|src/runtime/items/draw-flow.js:226|batchUsed|new Set()|需要进一步测试|
|src/runtime/items/draw-flow.js:227|group||需要进一步测试|
|src/runtime/items/draw-flow.js:228|key|pickItemForGroupV281(group, batchUsed)|需要进一步测试|
|src/runtime/items/draw-flow.js:232|acquired|group.inventory[group.inventory.length - 1]|需要进一步测试|
|src/runtime/items/draw-flow.js:294|g|state.groups.find((x) => x.id === handRaiseGroupId)|需要进一步测试|
|src/runtime/items/draw-flow.js:321|box|document.getElementById("handRewardBox")|需要进一步测试|
|src/runtime/items/draw-flow.js:333|last|0|需要进一步测试|
|src/runtime/items/draw-flow.js:334|total|ITEM_DRAW_DURATION_V21712|需要进一步测试|
|src/runtime/items/draw-flow.js:340|t|Math.min(1, (now - handItemDrawStartedAt) / total)|需要进一步测试|
|src/runtime/items/draw-flow.js:341|interval|55 + 90 * Math.pow(t, 2.1)|需要进一步测试|
|src/runtime/items/draw-flow.js:343|bar|document.getElementById("handItemProgressBar")|需要进一步测试|
|src/runtime/items/draw-flow.js:348|live|state.groups.find((x) => x.id === handItemDrawGroupId)|需要进一步测试|
|src/runtime/items/draw-flow.js:351|k|roulettePreviewPickV282()|需要进一步测试|
|src/runtime/items/draw-flow.js:352|cap|document.getElementById("handItemCapsule")|需要进一步测试|
|src/runtime/items/draw-flow.js:353|name|document.getElementById("handItemDrawName")|需要进一步测试|
|src/runtime/items/draw-flow.js:375|live|state.groups.find((x) => x.id === handItemDrawGroupId)|需要进一步测试|
|src/runtime/items/draw-flow.js:383|k|pickItemForGroupV281(live, new Set())|需要进一步测试|
|src/runtime/items/draw-flow.js:386|groupUid|live.groupUid|需要进一步测试|
|src/runtime/items/draw-flow.js:387|accepted|runClassroomCommand(       ${live.name} 举手奖励抽取 ${ITEM_DEFS[k].name},       (context) => {         const current = state.groups.find((x) => x.groupUid === grou|需要进一步测试|
|src/runtime/items/draw-flow.js:390|current|state.groups.find((x) => x.groupUid === groupUid)|需要进一步测试|
|src/runtime/items/draw-flow.js:398|acquired|current.inventory[current.inventory.length - 1]|需要进一步测试|
|src/runtime/items/draw-flow.js:433|current|state.groups.find((x) => x.groupUid === groupUid)|需要进一步测试|
|src/runtime/items/draw-flow.js:434|slot|Math.max(0, (current?.inventory.length ／／ 1) - 1)|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:28|t|state.itemGlobal.drawSessionThrottleV21710|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:44|activeDrawSessionV21710|null|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:47|t|ensureDrawSessionThrottleV21710()|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:64|r|ranking()|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:65|pos|Math.max(1, r.findIndex((x) => x.id === g.id) + 1)|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:66|W|{ ...itemDropWeights(pos, r.length) }|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:68|t|ensureDrawSessionThrottleV21710()|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:69|sessionNo|activeDrawSessionV21710?.no ／／ t.sessionNo|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:71|key||需要进一步测试|
|src/runtime/items/draw-session-throttle.js:72|next|Math.max(0, Number(t.nextEligibleSession[key]) ／／ 0)|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:91|old|ensureDrawThrottleV2179()|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:102|t|ensureDrawSessionThrottleV21710()|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:103|sessionNo|activeDrawSessionV21710?.no ／／ t.sessionNo|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:106|old|ensureDrawThrottleV2179()|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:107|oldSkip|Math.max(0, Number(old.groupStrongSkip[g.id]) ／／ 0)|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:110|left|oldSkip - 1|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:134|held|heldItemKeysV281(g)|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:135|weights|sessionRestrictedWeightsV21710(g)|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:137|k|weightedPickNoRepeatV281(weights, new Set([...batchUsed, ...held]))|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:143|fallback|{}|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:161|host|document.getElementById("drawCooldownInfoV2179")|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:164|t|ensureDrawSessionThrottleV21710()|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:166|text|(key, label) => {     const next = Number(t.nextEligibleSession[key] ／／ 0);     if (!next ／／ t.sessionNo >= next) return ${label}：当前可抽取;     return ${label}：|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:167|next|Number(t.nextEligibleSession[key] ／／ 0)|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:185|_v21710InstallInfo|installDrawCooldownInfoV2179|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:187|r|_v21710InstallInfo.apply(this, args)|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:194|_v21710ShowSettings|showSettingsV26|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:196|r|_v21710ShowSettings.call(this, which, ...args)|需要进一步测试|
|src/runtime/items/draw-throttle-legacy.js:9|GLOBAL_FIVE_DRAW_ITEMS_V2179|new Set(["lightning", "blooper"])|需要进一步测试|
|src/runtime/items/draw-throttle-legacy.js:10|STRONG_GROUP_ITEMS_V2179|new Set(["bullet", "power", "mega", "star"])|需要进一步测试|
|src/runtime/items/draw-throttle-legacy.js:26|t|state.itemGlobal.drawThrottleV2179|需要进一步测试|
|src/runtime/items/draw-throttle-legacy.js:45|r|ranking()|需要进一步测试|
|src/runtime/items/draw-throttle-legacy.js:46|pos|Math.max(1, r.findIndex((x) => x.id === g.id) + 1)|需要进一步测试|
|src/runtime/items/draw-throttle-legacy.js:47|W|{ ...itemDropWeights(pos, r.length) }|需要进一步测试|
|src/runtime/items/draw-throttle-legacy.js:48|t|ensureDrawThrottleV2179()|需要进一步测试|
|src/runtime/items/draw-throttle-legacy.js:51|drawNo|t.sequence + 1|需要进一步测试|
|src/runtime/items/draw-throttle-legacy.js:55|k||需要进一步测试|
|src/runtime/items/draw-throttle-legacy.js:56|next|Math.max(0, Number(t.nextEligible[k]) ／／ 0)|需要进一步测试|
|src/runtime/items/draw-throttle-legacy.js:72|oldSkip|Math.max(0, Number(t.groupStrongSkip[g.id]) ／／ 0)|需要进一步测试|
|src/runtime/items/draw-throttle-legacy.js:74|left|oldSkip - 1|需要进一步测试|
|src/runtime/items/draw-throttle-legacy.js:95|held|heldItemKeysV281(g)|需要进一步测试|
|src/runtime/items/draw-throttle-legacy.js:96|{ weights, drawNo, throttle }|restrictedItemWeightsV2179(g)|需要进一步测试|
|src/runtime/items/draw-throttle-legacy.js:99|k|weightedPickNoRepeatV281(weights, new Set([...batchUsed, ...held]))|需要进一步测试|
|src/runtime/items/draw-throttle-legacy.js:111|fallback|{}|需要进一步测试|
|src/runtime/items/draw-throttle-legacy.js:153|host|document.getElementById("clearAllItemsV2172")|需要进一步测试|
|src/runtime/items/draw-throttle-legacy.js:156|t|ensureDrawThrottleV2179()|需要进一步测试|
|src/runtime/items/draw-throttle-legacy.js:157|info|document.createElement("div")|需要进一步测试|
|src/runtime/items/draw-throttle-legacy.js:170|_v2179InstallClearItems|installClearItemsSettingV2172|需要进一步测试|
|src/runtime/items/draw-throttle-legacy.js:172|r|_v2179InstallClearItems.apply(this, args)|需要进一步测试|
|src/runtime/items/drop-midfield-weights.js:4|safeTotal|Math.max(1, Number(total) ／／ 1)|需要进一步测试|
|src/runtime/items/drop-midfield-weights.js:5|safePos|Math.max(1, Math.min(safeTotal, Number(pos) ／／ 1))|需要进一步测试|
|src/runtime/items/drop-midfield-weights.js:6|band|itemRankBandV2172(safePos, safeTotal)|需要进一步测试|
|src/runtime/items/drop-midfield-weights.js:10|topHalfEnd|Math.ceil(safeTotal * 0.5)|需要进一步测试|
|src/runtime/items/drop-midfield-weights.js:11|inTopHalf|safePos <= topHalfEnd|需要进一步测试|
|src/runtime/items/drop-midfield-weights.js:13|W|{}|需要进一步测试|
|src/runtime/items/drop-midfield-weights.js:14|put|(k, w) => {     W[k] = Math.max(0, Number(w) ／／ 0);   }|需要进一步测试|
|src/runtime/items/drop-midfield-weights.js:69|midProgress|safeTotal <= 1 ? 0 : (safePos - 1) / (safeTotal - 1)|需要进一步测试|
|src/runtime/items/drop-uniqueness-and-reset.js:26|safeTotal|Math.max(1, Number(total) ／／ 1)|需要进一步测试|
|src/runtime/items/drop-uniqueness-and-reset.js:27|safePos|Math.max(1, Math.min(safeTotal, Number(pos) ／／ 1))|需要进一步测试|
|src/runtime/items/drop-uniqueness-and-reset.js:28|lastCount|Math.max(1, Math.ceil(safeTotal * 0.3))|需要进一步测试|
|src/runtime/items/drop-uniqueness-and-reset.js:29|lastStart|safeTotal - lastCount + 1|需要进一步测试|
|src/runtime/items/drop-uniqueness-and-reset.js:44|band|itemRankBandV2172(pos, total)|需要进一步测试|
|src/runtime/items/drop-uniqueness-and-reset.js:45|W|{}|需要进一步测试|
|src/runtime/items/drop-uniqueness-and-reset.js:46|put|(k, w) => {     W[k] = Math.max(0, Number(w) ／／ 0);   }|需要进一步测试|
|src/runtime/items/drop-uniqueness-and-reset.js:92|midProgress|total <= 1 ? 0 : (pos - 1) / (total - 1)|需要进一步测试|
|src/runtime/items/drop-uniqueness-and-reset.js:155|_v2172AddItemToGroup|addItemToGroup|需要进一步测试|
|src/runtime/items/drop-uniqueness-and-reset.js:174|held|state.groups.reduce(     (n, g) => n + (Array.isArray(g.inventory) ? g.inventory.length : 0),     0,   )|需要进一步测试|
|src/runtime/items/drop-uniqueness-and-reset.js:178|active|state.groups.filter(     (g) => g.itemEffect ／／ Number(g.booShield ／／ 0) > 0,   ).length|需要进一步测试|
|src/runtime/items/drop-uniqueness-and-reset.js:181|blooperActive|Number(state.itemGlobal?.blooperUntil ／／ 0) > Date.now()|需要进一步测试|
|src/runtime/items/drop-uniqueness-and-reset.js:230|pane|document.getElementById("settingsV26_data")|需要进一步测试|
|src/runtime/items/drop-uniqueness-and-reset.js:233|section|document.createElement("div")|需要进一步测试|
|src/runtime/items/drop-uniqueness-and-reset.js:249|_v2172RebuildSettingsV26|rebuildSettingsV26|需要进一步测试|
|src/runtime/items/drop-uniqueness-and-reset.js:251|r|_v2172RebuildSettingsV26.apply(this, args)|需要进一步测试|
|src/runtime/items/drop-uniqueness-and-reset.js:257|_v2172ShowSettingsV26|showSettingsV26|需要进一步测试|
|src/runtime/items/drop-uniqueness-and-reset.js:259|r|_v2172ShowSettingsV26.call(this, which, ...args)|需要进一步测试|
|src/runtime/items/effect-palette-and-preview.js:16|keys|Object.keys(ITEM_DEFS)|需要进一步测试|
|src/runtime/items/encyclopedia-and-icons.js:7|box|document.getElementById("v2ItemEncyclopedia")|需要进一步测试|
|src/runtime/items/encyclopedia-and-icons.js:11|d|ITEM_DEFS[k]|需要进一步测试|
|src/runtime/items/encyclopedia-and-icons.js:22|f|e.target.files?.[0]|需要进一步测试|
|src/runtime/items/encyclopedia-and-icons.js:24|rd|new FileReader()|需要进一步测试|
|src/runtime/items/encyclopedia-and-icons.js:54|blob|new Blob(     [       JSON.stringify(         { version: 1, icons: state.itemGlobal.customIcons },         null,         2,       ),     ],     { type: "applica|需要进一步测试|
|src/runtime/items/encyclopedia-and-icons.js:64|a|document.createElement("a")|需要进一步测试|
|src/runtime/items/encyclopedia-and-icons.js:71|f|e.target.files?.[0]|需要进一步测试|
|src/runtime/items/encyclopedia-and-icons.js:73|rd|new FileReader()|需要进一步测试|
|src/runtime/items/encyclopedia-and-icons.js:76|x|JSON.parse(rd.result)|需要进一步测试|
|src/runtime/items/encyclopedia-copy.js:2|ITEM_FUNNY_COPY_V2184|{   mushroom:     "朴实无华的加分工具。没有复杂的阴谋，没有精密的计算，吃下去就是涨分。甚至还能拿来躲刺龟壳，蘑菇本人对此可能也很困惑。",   triple_mushroom:     "一个蘑菇不够，那就三个。适合信奉“解决问题的方法是把同一个方法重复三遍”的小组。",   green:     |需要进一步测试|
|src/runtime/items/encyclopedia-copy.js:52|ITEM_FUNNY_TAG_V2184|{   mushroom: "稳健派的快乐",   triple_mushroom: "数量解决一切",   green: "随机受害者生成器",   triple_green: "随机受害者生成器 ×3",   red: "只认前一名",   triple_red: "目标随排名漂移",   banana: "回头关|需要进一步测试|
|src/runtime/items/encyclopedia-copy.js:85|ITEM_TIPS_OVERRIDE_V2199|{   fire_flower:     "三发各自随机，等于把分数压力平摊给全班而不是集中打一个人。想要精准压制某组，火之花帮不上忙；想让所有人一起掉队，它最省事。",   ice_flower:     "冻结会同时关掉对方的 All In 和道具，最适合用在别人准备梭哈的前一题。已经冻结全场时别再按，那只是花一发|需要进一步测试|
|src/runtime/items/encyclopedia-effects.js:5|ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715|{   green:     "随机攻击其他小组，扣除其当前积分的 1/4；作为主要道具时可抵挡一次常规攻击。",   triple_green:     "拥有 3 次绿龟壳使用次数；每次可随机攻击其他小组并扣除其当前积分的 1/4，也可作为主要道具逐次防御。",   red: "攻击当前排名正上方的小组，扣除其当前|需要进一步测试|
|src/runtime/items/encyclopedia-rules.js:1|ITEM_ORDER_V218|[   "mushroom",   "triple_mushroom",   "green",   "triple_green",   "red",   "triple_red",   "banana",   "triple_banana",   "horn",   "feather",   "fire_flower"|需要进一步测试|
|src/runtime/items/encyclopedia-rules.js:31|ITEM_TIPS_V218|{   mushroom: "既能主动加分，也能在刺龟壳来袭时选择主动消耗闪避。",   triple_mushroom:     "答题期间第一次使用后不能 All In，但同一枚三重蘑菇的剩余次数仍可继续使用；手动举手可选择一次或连发。",   green: "主要栏可作为防御资源；领先时不要急着主动丢掉。",  |需要进一步测试|
|src/runtime/items/feature-switch.js:1|COMMUNISM_MODE_KEY|"politics_communism_mode"|需要进一步测试|
|src/runtime/items/feature-switch.js:11|on|isCommunismMode()|需要进一步测试|
|src/runtime/items/feature-switch.js:18|t|(el.textContent ／／ "").trim()|需要进一步测试|
|src/runtime/items/feature-switch.js:19|oc|el.getAttribute("onclick") ／／ ""|需要进一步测试|
|src/runtime/items/feature-switch.js:20|itemOnly|/道具抽取／抽取道具／道具百科／道具与图标/.test(t) ／／         /globalItemDraw／openItemEncyclopedia/.test(oc)|需要进一步测试|
|src/runtime/items/feature-switch.js:43|_v291OpenItemWindow|openItemWindow|需要进一步测试|
|src/runtime/items/feedback-and-icons.js:3|r|ranking()|需要进一步测试|
|src/runtime/items/feedback-and-icons.js:4|i|r.findIndex((g) => g.id === gid)|需要进一步测试|
|src/runtime/items/feedback-and-icons.js:5|names|[]|需要进一步测试|
|src/runtime/items/feedback-and-icons.js:6|add|(x) => {     if (x && x.id !== gid && !names.includes(x.name)) names.push(x.name);   }|需要进一步测试|
|src/runtime/items/feedback-and-icons.js:44|reader|new FileReader()|需要进一步测试|
|src/runtime/items/feedback-and-icons.js:46|img|new Image()|需要进一步测试|
|src/runtime/items/feedback-and-icons.js:48|size|384|需要进一步测试|
|src/runtime/items/feedback-and-icons.js:49|canvas|document.createElement("canvas")|需要进一步测试|
|src/runtime/items/feedback-and-icons.js:52|ctx|canvas.getContext("2d")|需要进一步测试|
|src/runtime/items/feedback-and-icons.js:54|pad|34|需要进一步测试|
|src/runtime/items/feedback-and-icons.js:55|max|size - pad * 2|需要进一步测试|
|src/runtime/items/feedback-and-icons.js:56|scale|Math.min(         max / img.naturalWidth,         max / img.naturalHeight,         1.8,       )|需要进一步测试|
|src/runtime/items/feedback-and-icons.js:61|w|Math.max(1, img.naturalWidth * scale)|需要进一步测试|
|src/runtime/items/feedback-and-icons.js:62|h|Math.max(1, img.naturalHeight * scale)|需要进一步测试|
|src/runtime/items/feedback-and-icons.js:74|f|e.target.files?.[0]|需要进一步测试|
|src/runtime/items/feedback-and-icons.js:90|icon|o.querySelector(".r-icon")|需要进一步测试|
|src/runtime/items/feedback-and-icons.js:91|name|o.querySelector(".r-name")|需要进一步测试|
|src/runtime/items/feedback-and-icons.js:112|wasPending|handItemDrawGroupId != null && handItemPendingKey == null|需要进一步测试|
|src/runtime/items/first-hand-pool.js:1|FIRST_HAND_POOL_V218|[   "triple_mushroom",   "mushroom",   "triple_green",   "green",   "triple_red",   "red",   "banana",   "triple_banana",   "horn", ]|需要进一步测试|
|src/runtime/items/first-hand-pool.js:12|firstHandDrawPendingV218|true|需要进一步测试|
|src/runtime/items/first-hand-pool.js:13|suppressFirstHornV218|false|需要进一步测试|
|src/runtime/items/first-hand-pool.js:15|_v218ItemDropWeights|itemDropWeights|需要进一步测试|
|src/runtime/items/first-hand-pool.js:17|W|_v218ItemDropWeights.call(this, pos, total)|需要进一步测试|
|src/runtime/items/first-hand-pool.js:18|cutoff|Math.max(1, Math.ceil(Math.max(1, total) * 0.6))|需要进一步测试|
|src/runtime/items/first-hand-pool.js:28|_v218PickItem|pickItemForGroupV281|需要进一步测试|
|src/runtime/items/flower-charges-recovery.js:3|keys|new Set(["fire_flower", "ice_flower", "boomerang_flower"])|需要进一步测试|
|src/runtime/items/flower-charges-recovery.js:4|changed|false|需要进一步测试|
|src/runtime/items/flower-charges-recovery.js:10|n|Number(it.charges)|需要进一步测试|
|src/runtime/items/flower-charges-recovery.js:11|limit|Number.isInteger(it.configuredCharges) &&         it.configuredCharges >= 1 &&         it.configuredCharges <= 99           ? it.configuredCharges           : 3|需要进一步测试|
|src/runtime/items/flower-charges-recovery.js:17|fixed|Number.isFinite(n)         ? Math.max(1, Math.min(limit, Math.trunc(n)))         : limit|需要进一步测试|
|src/runtime/items/group-encyclopedia.js:2|GROUP_ITEM_ORDER_V2182|[   "mushroom",   "triple_mushroom",   "green",   "triple_green",   "red",   "triple_red",   "banana",   "triple_banana",   "horn",   "feather",   "fire_flower"|需要进一步测试|
|src/runtime/items/group-encyclopedia.js:33|GROUP_ITEM_DESC_V2182|{   green: "随机攻击一个其他小组，扣除当前积分的 1/4；主要栏可用于基础防御。",   triple_green:     "3 次绿龟壳；每次随机攻击一个其他小组 -1/4，也可逐次用于基础防御。",   red: "攻击当前排名紧邻的上一组 -1/3；若没有上方排名，道具仍会消耗但不产生效果。",  |需要进一步测试|
|src/runtime/items/group-encyclopedia.js:86|roots|[...document.querySelectorAll("*")].filter(     (el) =>       el.children.length &&       /上帝模式\s*·\s*强制追加到队尾/.test(el.textContent ／／ ""),   )|需要进一步测试|
|src/runtime/items/group-encyclopedia.js:91|root|roots     .sort(       (a, b) =>         a.querySelectorAll("button").length -         b.querySelectorAll("button").length,     )     .find((el) => el.querySele|需要进一步测试|
|src/runtime/items/group-encyclopedia.js:100|buttons|[...root.querySelectorAll("button")]|需要进一步测试|
|src/runtime/items/group-encyclopedia.js:101|byKey|new Map()|需要进一步测试|
|src/runtime/items/group-encyclopedia.js:103|oc|btn.getAttribute("onclick") ／／ ""|需要进一步测试|
|src/runtime/items/group-encyclopedia.js:104|m|oc.match(/['"]([a-z_]+)['"]/)|需要进一步测试|
|src/runtime/items/group-encyclopedia.js:109|parent|[...byKey.values()][0].parentElement|需要进一步测试|
|src/runtime/items/group-encyclopedia.js:112|btn|byKey.get(k)|需要进一步测试|
|src/runtime/items/group-encyclopedia.js:123|group|state.groups.find((g) => g.id === activeItemGroupId)|需要进一步测试|
|src/runtime/items/group-encyclopedia.js:128|key|group.inventory[index]?.key|需要进一步测试|
|src/runtime/items/group-encyclopedia.js:129|target|card.querySelector(".item-big-desc")|需要进一步测试|
|src/runtime/items/group-encyclopedia.js:140|_v2182RenderItemWindow|renderItemWindow|需要进一步测试|
|src/runtime/items/group-encyclopedia.js:142|r|_v2182RenderItemWindow.apply(this, arguments)|需要进一步测试|
|src/runtime/items/group-encyclopedia.js:149|_v2182AdminAddItem|adminAddItem|需要进一步测试|
|src/runtime/items/group-encyclopedia.js:151|r|_v2182AdminAddItem.apply(this, arguments)|需要进一步测试|
|src/runtime/items/group-window.js:19|g|state.groups.find((x) => x.id === activeItemGroupId)|需要进一步测试|
|src/runtime/items/group-window.js:28|body|document.getElementById("itemWindowBody")|需要进一步测试|
|src/runtime/items/group-window.js:29|locked|!!state.isLocked|需要进一步测试|
|src/runtime/items/group-window.js:30|disabled|locked ? "disabled" : ""|需要进一步测试|
|src/runtime/items/group-window.js:32|st|g.itemStats ／／ {}|需要进一步测试|
|src/runtime/items/group-window.js:33|total|(st.correct ／／ 0) + (st.wrong ／／ 0)|需要进一步测试|
|src/runtime/items/group-window.js:34|rate|total ? Math.round(((st.correct ／／ 0) / total) * 100) : 0|需要进一步测试|
|src/runtime/items/group-window.js:37|statusParts|CompetitionEffects.labels(g)|需要进一步测试|
|src/runtime/items/group-window.js:39|type|g.itemEffect.type|需要进一步测试|
|src/runtime/items/group-window.js:60|status|statusParts.length ? statusParts.join(" · ") : "无"|需要进一步测试|
|src/runtime/items/group-window.js:124|canUse|!locked && eligibleForItems(g)|需要进一步测试|
|src/runtime/items/group-window.js:129|it|g.inventory[i]|需要进一步测试|
|src/runtime/items/group-window.js:132|d|ITEM_DEFS[it.key]|需要进一步测试|
|src/runtime/items/group-window.js:143|el|document.getElementById("groupDetailColorPreview")|需要进一步测试|
|src/runtime/items/group-window.js:162|g|state.groups.find((x) => x.id === id)|需要进一步测试|
|src/runtime/items/group-window.js:164|name|document.getElementById("groupDetailName")?.value.trim() ／／ ""|需要进一步测试|
|src/runtime/items/group-window.js:165|rawNo|document.getElementById("groupDetailNumber")?.value.trim() ／／ ""|需要进一步测试|
|src/runtime/items/group-window.js:175|groupNo|Number(rawNo)|需要进一步测试|
|src/runtime/items/group-window.js:180|rawMembers|document.getElementById("groupDetailMembers")?.value ／／ ""|需要进一步测试|
|src/runtime/items/group-window.js:181|members|Array.from(     new Set(       rawMembers         .split(/[\n,，、]+/)         .map((s) => s.trim())         .filter(Boolean),     ),   )|需要进一步测试|
|src/runtime/items/group-window.js:189|changed|g.name !== name ／／     Number(g.groupNo) !== groupNo ／／     JSON.stringify(g.members ／／ []) !== JSON.stringify(members)|需要进一步测试|
|src/runtime/items/group-window.js:228|n|Number(document.getElementById("itemCustomScore").value)|需要进一步测试|
|src/runtime/items/group-window.js:236|c|document.querySelector(       .group-row-card[data-group-id="${g.id}"],     )|需要进一步测试|
|src/runtime/items/group-window.js:252|firstDef|g.inventory.find((it) => ITEM_DEFS[it.key]?.def)|需要进一步测试|
|src/runtime/items/group-window.js:258|head|c.querySelector(".card-header-row")|需要进一步测试|
|src/runtime/items/group-window.js:260|slots|document.createElement("div")|需要进一步测试|
|src/runtime/items/group-window.js:264|it|g.inventory[i]|需要进一步测试|
|src/runtime/items/group-window.js:272|mb|c.querySelector(".more-btn")|需要进一步测试|
|src/runtime/items/group-window.js:289|GROUP_AVATAR_LIMIT_V2200|512 * 1024|需要进一步测试|
|src/runtime/items/group-window.js:291|node|document.getElementById("groupAvatarStatusV2200")|需要进一步测试|
|src/runtime/items/group-window.js:297|file|input?.files?.[0]|需要进一步测试|
|src/runtime/items/group-window.js:299|g|state.groups.find((x) => x.id === groupId)|需要进一步测试|
|src/runtime/items/group-window.js:317|reader|new FileReader()|需要进一步测试|
|src/runtime/items/group-window.js:323|dataUrl|String(reader.result ／／ "")|需要进一步测试|
|src/runtime/items/group-window.js:329|accepted|runClassroomCommand(设置 ${g.name} 的小组头像, () => {       const live = state.groups.find((x) => x.id === groupId);       if (live) live.groupAvatar = dataUrl;    |需要进一步测试|
|src/runtime/items/group-window.js:330|live|state.groups.find((x) => x.id === groupId)|需要进一步测试|
|src/runtime/items/group-window.js:341|next|document.getElementById("groupAvatarStatusV2200")|需要进一步测试|
|src/runtime/items/group-window.js:350|target|state.groups.find((x) => x.id === groupId)|需要进一步测试|
|src/runtime/items/group-window.js:356|accepted|runClassroomCommand(清除 ${target.name} 的小组头像, () => {     const live = state.groups.find((x) => x.id === groupId);     if (live) live.groupAvatar = "";     ret|需要进一步测试|
|src/runtime/items/group-window.js:357|live|state.groups.find((x) => x.id === groupId)|需要进一步测试|
|src/runtime/items/group-window.js:364|next|document.getElementById("groupAvatarStatusV2200")|需要进一步测试|
|src/runtime/items/group-window.js:371|savedItemGlobal|STORAGE.getJSON("politics_item_global", null)|需要进一步测试|
|src/runtime/items/hand-reward-lifecycle.js:1|handItemDrawTimer|null|需要进一步测试|
|src/runtime/items/hand-reward-lifecycle.js:2|handItemDrawFinishTimer|null|需要进一步测试|
|src/runtime/items/hand-reward-lifecycle.js:3|handItemDrawGroupId|null|需要进一步测试|
|src/runtime/items/hand-reward-lifecycle.js:4|handItemPendingKey|null|需要进一步测试|
|src/runtime/items/hand-reward-lifecycle.js:5|handItemDrawStartedAt|0|需要进一步测试|
|src/runtime/items/hand-reward-lifecycle.js:16|wasPending|handItemDrawGroupId != null && handItemPendingKey == null|需要进一步测试|
|src/runtime/items/hand-reward-lifecycle.js:23|_v21CloseHandRaise|closeHandRaise|需要进一步测试|
|src/runtime/items/hand-reward-lifecycle.js:29|_v21SelectHandGroup|selectHandGroup|需要进一步测试|
|src/runtime/items/hand-reward-lifecycle.js:38|_v21JudgeHandRaise|judgeHandRaise|需要进一步测试|
|src/runtime/items/hand-reward-lifecycle.js:43|g|state.groups.find((x) => x.id === handRaiseGroupId)|需要进一步测试|
|src/runtime/items/hand-reward-lifecycle.js:44|btn|[...document.querySelectorAll("#handRewardBox button")].find(       (b) => b.textContent.includes("抽取道具"),     )|需要进一步测试|
|src/runtime/items/hand-reward-lifecycle.js:64|previousGroup|handItemDrawGroupId|需要进一步测试|
|src/runtime/items/hand-reward-lifecycle.js:65|previousKey|handItemPendingKey|需要进一步测试|
|src/runtime/items/hand-reward-lifecycle.js:69|key|pickItemForGroupV281(group, new Set())|需要进一步测试|
|src/runtime/items/hand-reward-lifecycle.js:71|acquired|group.inventory[group.inventory.length - 1]|需要进一步测试|
|src/runtime/items/hand-reward-lifecycle.js:93|box|document.getElementById("handRewardBox")|需要进一步测试|
|src/runtime/items/hand-reward-lifecycle.js:100|gid|handItemDrawGroupId|需要进一步测试|
|src/runtime/items/hand-reward-lifecycle.js:101|k|handItemPendingKey|需要进一步测试|
|src/runtime/items/hand-reward-lifecycle.js:102|g|state.groups.find((x) => x.id === gid)|需要进一步测试|
|src/runtime/items/hand-reward-lifecycle.js:107|idx|g.inventory.map((x) => x.key).lastIndexOf(k)|需要进一步测试|
|src/runtime/items/hand-reward-lifecycle.js:119|cards|[...document.querySelectorAll("#itemWindowBody .item-card")]|需要进一步测试|
|src/runtime/items/inventory-recovery.js:7|held|heldItemKeysV281(g)|需要进一步测试|
|src/runtime/items/inventory-recovery.js:8|weights|sessionRestrictedWeightsV21710(g)|需要进一步测试|
|src/runtime/items/inventory-recovery.js:11|k|weightedPickNoRepeatV281(weights, new Set([...batchUsed, ...held]))|需要进一步测试|
|src/runtime/items/inventory-recovery.js:28|changed|false|需要进一步测试|
|src/runtime/items/inventory-recovery.js:30|before|JSON.stringify(g.inventory ／／ [])|需要进一步测试|
|src/runtime/items/lightning-and-hit-legacy.js:38|card|battleCard(groupId)|需要进一步测试|
|src/runtime/items/lightning-and-hit-legacy.js:43|cls|attackHitClassV2116(key)|需要进一步测试|
|src/runtime/items/lightning-and-hit-legacy.js:49|badge|document.createElement("div")|需要进一步测试|
|src/runtime/items/lightning-and-hit-legacy.js:51|d|ITEM_DEFS[key]|需要进一步测试|
|src/runtime/items/lightning-and-hit-legacy.js:79|type|target?.itemEffect?.type|需要进一步测试|
|src/runtime/items/lightning-and-hit-legacy.js:82|name|ITEM_DEFS[type]?.name ／／ "持续状态"|需要进一步测试|
|src/runtime/items/lightning-and-hit-legacy.js:94|before|Number(target.score) ／／ 0|需要进一步测试|
|src/runtime/items/lightning-and-hit-legacy.js:116|_v2116ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/runtime/items/lightning-and-hit-legacy.js:127|sample|itemDropWeights(12, 24)|需要进一步测试|
|src/runtime/items/lightning-and-hit-legacy.js:128|missing|Object.keys(ITEM_DEFS).filter((k) => !(k in sample))|需要进一步测试|
|src/runtime/items/queue-adapters.js:2|main|it ／／ g?.inventory?.[0]|需要进一步测试|
|src/runtime/items/queue-adapters.js:15|it|g?.inventory?.[index]|需要进一步测试|
|src/runtime/items/queue-adapters.js:22|reason|Reliability.validateItem(state, g, index, isCommunismMode())|需要进一步测试|
|src/runtime/items/queue-adapters.js:33|g|state.groups.find((x) => x.id === gid)|需要进一步测试|
|src/runtime/items/queue-adapters.js:48|role|g.inventory.length === 1 ? "主要道具" : "次要道具"|需要进一步测试|
|src/runtime/items/queue-adapters.js:53|g|state.groups.find((x) => x.id === gid)|需要进一步测试|
|src/runtime/items/queue-adapters.js:74|_v2120RenderItemWindow|renderItemWindow|需要进一步测试|
|src/runtime/items/queue-adapters.js:77|g|state.groups.find((x) => x.id === activeItemGroupId)|需要进一步测试|
|src/runtime/items/queue-adapters.js:78|body|document.getElementById("itemWindowBody")|需要进一步测试|
|src/runtime/items/queue-adapters.js:81|cards|[0, 1, 2]     .map((i) => {       const it = g.inventory[i];       const role = queueRoleTextV2120(i);       if (!it) {         return <div class="item-big que|需要进一步测试|
|src/runtime/items/queue-adapters.js:83|it|g.inventory[i]|需要进一步测试|
|src/runtime/items/queue-adapters.js:84|role|queueRoleTextV2120(i)|需要进一步测试|
|src/runtime/items/queue-adapters.js:93|d|ITEM_DEFS[it.key]|需要进一步测试|
|src/runtime/items/queue-adapters.js:94|st|queueUseStateV2120(g, i)|需要进一步测试|
|src/runtime/items/queue-adapters.js:95|active|isQueuePersistentActiveV2120(g, it)|需要进一步测试|
|src/runtime/items/queue-adapters.js:118|admin|document.createElement("div")|需要进一步测试|
|src/runtime/items/queue-adapters.js:135|_v2120EnhanceItemCards|enhanceItemCards|需要进一步测试|
|src/runtime/items/queue-adapters.js:136|queueMainVisualCacheV2120|new Map()|需要进一步测试|
|src/runtime/items/queue-adapters.js:140|card|document.querySelector(       .group-row-card[data-group-id="${g.id}"],     )|需要进一步测试|
|src/runtime/items/queue-adapters.js:152|main|g.inventory?.[0]|需要进一步测试|
|src/runtime/items/queue-adapters.js:156|slots|[...card.querySelectorAll(".item-slot")]|需要进一步测试|
|src/runtime/items/queue-adapters.js:158|slot|slots[i]|需要进一步测试|
|src/runtime/items/queue-adapters.js:160|it|g.inventory[i]|需要进一步测试|
|src/runtime/items/queue-adapters.js:163|active|isQueuePersistentActiveV2120(g, it)|需要进一步测试|
|src/runtime/items/queue-adapters.js:173|currentMain|main ? ${main.key}:${main.acquiredAt ／／ 0} : ""|需要进一步测试|
|src/runtime/items/queue-adapters.js:174|prev|queueMainVisualCacheV2120.get(g.id)|需要进一步测试|
|src/runtime/items/queue-adapters.js:184|_v2120HandUseNewItem|handUseNewItem|需要进一步测试|
|src/runtime/items/queue-adapters.js:186|gid|handItemDrawGroupId|需要进一步测试|
|src/runtime/items/queue-adapters.js:187|g|state.groups.find((x) => x.id === gid)|需要进一步测试|
|src/runtime/items/ranking-and-drop-legacy.js:20|it|g.inventory[index]|需要进一步测试|
|src/runtime/items/ranking-and-drop-legacy.js:42|d|document.createElement("div")|需要进一步测试|
|src/runtime/items/ranking-and-drop-legacy.js:50|out|[]|需要进一步测试|
|src/runtime/items/ranking-and-drop-legacy.js:55|it|g.inventory[0]|需要进一步测试|
|src/runtime/items/ranking-and-drop-legacy.js:56|idx|0|需要进一步测试|
|src/runtime/items/ranking-and-drop-legacy.js:84|loss|denom === 2       ? roundHalf(target.score)       : denom === 3         ? roundThird(target.score)         : roundQuarter(target.score)|需要进一步测试|
|src/runtime/items/ranking-and-drop-legacy.js:94|base|denom === 4 ? roundQuarter(target.score) : Math.round(target.score / denom)|需要进一步测试|
|src/runtime/items/ranking-and-drop-legacy.js:96|add|globalThis.ItemModules     ? ItemModules.scoreDelta(null, base)     : base|需要进一步测试|
|src/runtime/items/ranking-and-drop-legacy.js:108|p|total <= 1 ? 1 : (pos - 1) / (total - 1)|需要进一步测试|
|src/runtime/items/ranking-and-drop-legacy.js:109|virtual|1 + p * 23|需要进一步测试|
|src/runtime/items/ranking-and-drop-legacy.js:110|W|{}|需要进一步测试|
|src/runtime/items/ranking-and-drop-legacy.js:111|put|(k, w) => {     W[k] = w;   }|需要进一步测试|
|src/runtime/items/ranking-and-drop-legacy.js:197|arr|Object.entries(weights).filter(([, w]) => w > 0)|需要进一步测试|
|src/runtime/items/ranking-and-drop-legacy.js:198|sum|arr.reduce((a, [, w]) => a + w, 0)|需要进一步测试|
|src/runtime/items/ranking-and-drop-legacy.js:199|r|Math.random() * sum|需要进一步测试|
|src/runtime/items/ranking-and-drop-legacy.js:200|[k, w]||需要进一步测试|
|src/runtime/items/ranking-and-drop-legacy.js:208|r|ranking()|需要进一步测试|
|src/runtime/items/ranking-and-drop-legacy.js:209|pos|r.findIndex((x) => x.id === g.id) + 1|需要进一步测试|
|src/runtime/items/ranking-and-drop-legacy.js:210|weights|itemDropWeights(pos, r.length)|需要进一步测试|
|src/runtime/items/round-use-lock.js:17|ratioMet|checkAllInRatio()|需要进一步测试|
|src/runtime/items/round-use-lock.js:31|g|state.groups.find((x) => x.id === groupId)|需要进一步测试|
|src/runtime/items/round-use-lock.js:57|_v2177ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/runtime/items/round-use-lock.js:71|_v2177QueueUseState|queueUseStateV2120|需要进一步测试|
|src/runtime/items/round-use-lock.js:73|st|_v2177QueueUseState.call(this, g, index)|需要进一步测试|
|src/runtime/items/spiny-cooldown.js:8|t|ensureDrawSessionThrottleV21710()|需要进一步测试|
|src/runtime/items/spiny-cooldown.js:20|_v21717SessionRestrictedWeights|sessionRestrictedWeightsV21710|需要进一步测试|
|src/runtime/items/spiny-cooldown.js:22|W|_v21717SessionRestrictedWeights.call(this, g)|需要进一步测试|
|src/runtime/items/spiny-cooldown.js:23|t|ensureSpinyCooldownV21717()|需要进一步测试|
|src/runtime/items/spiny-cooldown.js:24|sessionNo|activeDrawSessionV21710?.no ／／ t.sessionNo|需要进一步测试|
|src/runtime/items/spiny-cooldown.js:25|next|Math.max(0, Number(t.nextEligibleSession.spiny) ／／ 0)|需要进一步测试|
|src/runtime/items/spiny-cooldown.js:35|_v21717CommitSessionDraw|commitSessionDrawV21710|需要进一步测试|
|src/runtime/items/spiny-cooldown.js:40|t|ensureSpinyCooldownV21717()|需要进一步测试|
|src/runtime/items/spiny-cooldown.js:41|sessionNo|activeDrawSessionV21710?.no ／／ t.sessionNo|需要进一步测试|
|src/runtime/items/spiny-cooldown.js:47|_v21717RefreshCooldownInfo|refreshDrawCooldownInfoV21710|需要进一步测试|
|src/runtime/items/spiny-cooldown.js:51|host|document.getElementById("drawCooldownInfoV2179")|需要进一步测试|
|src/runtime/items/spiny-cooldown.js:54|t|ensureSpinyCooldownV21717()|需要进一步测试|
|src/runtime/items/spiny-cooldown.js:55|next|Number(t.nextEligibleSession.spiny ／／ 0)|需要进一步测试|
|src/runtime/items/spiny-cooldown.js:56|text|!next ／／ t.sessionNo >= next       ? "刺龟壳：当前可抽取"       : 刺龟壳：第 ${next} 个抽取轮次重新开放（当前第 ${t.sessionNo} 轮）|需要进一步测试|
|src/runtime/items/spiny-cooldown.js:61|extra|document.createElement("small")|需要进一步测试|
|src/runtime/items/status-normalization.js:5|ef|g.itemEffect|需要进一步测试|
|src/runtime/items/status-normalization.js:26|changed|false|需要进一步测试|
|src/runtime/items/status-normalization.js:28|before|JSON.stringify(g.itemEffect ?? null)|需要进一步测试|
|src/runtime/items/status-normalization.js:30|after|JSON.stringify(g.itemEffect ?? null)|需要进一步测试|
|src/runtime/items/status-normalization.js:40|_v21731EnsureItemState|ensureItemState|需要进一步测试|
|src/runtime/items/status-normalization.js:42|result|_v21731EnsureItemState.apply(this, args)|需要进一步测试|
|src/runtime/items/triple-defense-helpers.js:1|TRIPLE_KEYS_V218|new Set([   "triple_green",   "triple_red",   "triple_banana",   "triple_mushroom", ])|需要进一步测试|
|src/runtime/items/triple-defense-helpers.js:8|it|g.inventory?.[index]|需要进一步测试|
|src/runtime/items/triple-defense-helpers.js:14|amount|Math.round(Math.max(0, Number(target.score) ／／ 0) / 5)|需要进一步测试|
|src/runtime/items/triple-defense-helpers.js:31|_v218QueueState|queueUseStateV2120|需要进一步测试|
|src/runtime/items/weighted-selection.js:5|filtered|{}|需要进一步测试|
|src/runtime/items/weighted-selection.js:7|n|Number(w) ／／ 0|需要进一步测试|
|src/runtime/items/weighted-selection.js:14|r|ranking()|需要进一步测试|
|src/runtime/items/weighted-selection.js:15|pos|Math.max(1, r.findIndex((x) => x.id === g.id) + 1)|需要进一步测试|
|src/runtime/items/weighted-selection.js:16|weights|itemDropWeights(pos, r.length)|需要进一步测试|
|src/runtime/items/weighted-selection.js:17|held|heldItemKeysV281(g)|需要进一步测试|
|src/runtime/items/weighted-selection.js:20|k|weightedPickNoRepeatV281(weights, new Set([...batchUsed, ...held]))|需要进一步测试|
|src/runtime/items/weighted-selection.js:75|arr|state.groups.filter(     (g) => g.id !== caster.id && Number(g.score) >= 0,   )|需要进一步测试|
|src/runtime/items/weighted-selection.js:82|amount|Math.round(Math.max(0, Number(target.score) ／／ 0) * frac)|需要进一步测试|
|src/runtime/items/weighted-selection.js:92|it|g.inventory[index]|需要进一步测试|
|src/runtime/picker/classroom-tools.js:1|pickerInfoTab|"history"|需要进一步测试|
|src/runtime/picker/classroom-tools.js:2|handRaiseGroupId|null|需要进一步测试|
|src/runtime/picker/classroom-tools.js:3|pendingItemIconKey|null|需要进一步测试|
|src/runtime/picker/classroom-tools.js:14|BUILTIN_ITEM_ICONS_V2121|{   item_box: "@@RESOURCE:item_box.txt@@",   kamek: "@@RESOURCE:kamek.txt@@",   green: "@@RESOURCE:asset-000.txt@@",   triple_green: "@@RESOURCE:asset-001.txt@@|需要进一步测试|
|src/runtime/picker/classroom-tools.js:44|BUILTIN_ITEM_BOX_V2121|"@@RESOURCE:asset-026.txt@@"|需要进一步测试|
|src/runtime/picker/classroom-tools.js:47|d|ITEM_DEFS[key]|需要进一步测试|
|src/runtime/picker/classroom-tools.js:48|custom|state.itemGlobal.customIcons[key]|需要进一步测试|
|src/runtime/picker/classroom-tools.js:49|builtin|BUILTIN_ITEM_ICONS_V2121[key]|需要进一步测试|
|src/runtime/picker/classroom-tools.js:50|src|Reliability.safeImage(custom) ／／ builtin|需要进一步测试|
|src/runtime/picker/classroom-tools.js:58|custom|state.itemGlobal.customIcons?.[key]|需要进一步测试|
|src/runtime/picker/classroom-tools.js:78|box|document.getElementById("pickerInfoBox")|需要进一步测试|
|src/runtime/picker/classroom-tools.js:81|a|state.groups.reduce(       (n, g) => n + (g.itemStats?.correct ／／ 0) + (g.itemStats?.wrong ／／ 0),       0,     )|需要进一步测试|
|src/runtime/picker/classroom-tools.js:87|arr|state.itemGlobal.pickerHistory ／／ []|需要进一步测试|
|src/runtime/picker/classroom-tools.js:100|_v2OpenPicker|openPickerModal|需要进一步测试|
|src/runtime/picker/classroom-tools.js:109|el|document.getElementById("pickerScoreTarget")|需要进一步测试|
|src/runtime/picker/classroom-tools.js:110|w|slotEngine.chosenResult|需要进一步测试|
|src/runtime/picker/classroom-tools.js:116|g|state.picker.mode === "group" ? w : w.group|需要进一步测试|
|src/runtime/picker/classroom-tools.js:120|w|slotEngine.chosenResult|需要进一步测试|
|src/runtime/picker/classroom-tools.js:125|g|pickerTargetGroup()|需要进一步测试|
|src/runtime/picker/classroom-tools.js:134|n|Math.round(     Number(document.getElementById("pickerCustomScore")?.value),   )|需要进一步测试|
|src/runtime/picker/classroom-tools.js:155|box|document.getElementById("handGroupGrid")|需要进一步测试|
|src/runtime/picker/classroom-tools.js:171|arr|[...document.querySelectorAll(".hand-group")]|需要进一步测试|
|src/runtime/picker/classroom-tools.js:172|idx|state.groups.findIndex((g) => g.id === id)|需要进一步测试|
|src/runtime/picker/classroom-tools.js:178|g|state.groups.find((x) => x.id === handRaiseGroupId)|需要进一步测试|
|src/runtime/picker/classroom-tools.js:201|box|document.getElementById("handRewardBox")|需要进一步测试|
|src/runtime/picker/classroom-tools.js:214|g|state.groups.find((x) => x.id === handRaiseGroupId)|需要进一步测试|
|src/runtime/picker/selection-engine.js:8|external|internal && window.godpowerDesktop?.role === "main"|需要进一步测试|
|src/runtime/picker/selection-engine.js:28|modal|document.getElementById("pickerModal")|需要进一步测试|
|src/runtime/picker/selection-engine.js:53|reelGrp|document.getElementById("reelFrameGroup")|需要进一步测试|
|src/runtime/picker/selection-engine.js:54|reelStu|document.getElementById("reelFrameStudent")|需要进一步测试|
|src/runtime/picker/selection-engine.js:55|selBox|document.getElementById("twoTierGroupSelect")|需要进一步测试|
|src/runtime/picker/selection-engine.js:75|wrap|document.getElementById("twoTierGroupChips")|需要进一步测试|
|src/runtime/picker/selection-engine.js:77|pre|Array.isArray(state.picker.preselectedGroupIds)     ? state.picker.preselectedGroupIds     : []|需要进一步测试|
|src/runtime/picker/selection-engine.js:80|groups|state.groups.filter(     (g) => Array.isArray(g.members) && g.members.length > 0,   )|需要进一步测试|
|src/runtime/picker/selection-engine.js:86|on|pre.includes(g.id)|需要进一步测试|
|src/runtime/picker/selection-engine.js:87|style|on           ? "border-color:" +             g.color +             "; color:#fff; background:" +             g.color +             ";"           : ""|需要进一步测试|
|src/runtime/picker/selection-engine.js:114|pre|Array.isArray(state.picker.preselectedGroupIds)     ? state.picker.preselectedGroupIds.slice()     : []|需要进一步测试|
|src/runtime/picker/selection-engine.js:117|idx|pre.indexOf(gid)|需要进一步测试|
|src/runtime/picker/selection-engine.js:134|btn|document.getElementById("btnSlotTrigger")|需要进一步测试|
|src/runtime/picker/selection-engine.js:155|grps|state.groups|需要进一步测试|
|src/runtime/picker/selection-engine.js:167|grps|state.groups.filter(       (g) => Array.isArray(g.members) && g.members.length > 0,     )|需要进一步测试|
|src/runtime/picker/selection-engine.js:170|pre|Array.isArray(state.picker.preselectedGroupIds)       ? state.picker.preselectedGroupIds       : []|需要进一步测试|
|src/runtime/picker/selection-engine.js:174|selected|grps.filter((g) => pre.includes(g.id))|需要进一步测试|
|src/runtime/picker/selection-engine.js:177|students|[]|需要进一步测试|
|src/runtime/picker/selection-engine.js:190|filtered|students.filter(         (s) =>           !state.picker.pickedStudentKeys.includes(s.key) &&           !state.picker.pickedStudentKeys.includes(s.legacyKey),   |需要进一步测试|
|src/runtime/picker/selection-engine.js:204|students|[]|需要进一步测试|
|src/runtime/picker/selection-engine.js:217|filtered|students.filter(       (s) =>         !state.picker.pickedStudentKeys.includes(s.key) &&         !state.picker.pickedStudentKeys.includes(s.legacyKey),     )|需要进一步测试|
|src/runtime/picker/selection-engine.js:232|pool|getAvailablePool()|需要进一步测试|
|src/runtime/picker/selection-engine.js:233|label|document.getElementById("poolStatusText")|需要进一步测试|
|src/runtime/picker/selection-engine.js:248|uiGeneration|typeof DesktopUI !== "undefined" ? DesktopUI.getPickerGeneration() : null|需要进一步测试|
|src/runtime/picker/selection-engine.js:250|pool|getAvailablePool()|需要进一步测试|
|src/runtime/picker/selection-engine.js:265|btn|document.getElementById("btnSlotTrigger")|需要进一步测试|
|src/runtime/picker/selection-engine.js:269|winnerIndex|Math.floor(Math.random() * pool.list.length)|需要进一步测试|
|src/runtime/picker/selection-engine.js:277|allGroups|state.groups|需要进一步测试|
|src/runtime/picker/selection-engine.js:278|allStudents|[]|需要进一步测试|
|src/runtime/picker/selection-engine.js:289|reelGrps|allGroups|需要进一步测试|
|src/runtime/picker/selection-engine.js:290|reelStus|allStudents|需要进一步测试|
|src/runtime/picker/selection-engine.js:292|pre|Array.isArray(state.picker.preselectedGroupIds)       ? state.picker.preselectedGroupIds       : []|需要进一步测试|
|src/runtime/picker/selection-engine.js:295|grpWithMembers|state.groups.filter(       (g) => Array.isArray(g.members) && g.members.length > 0,     )|需要进一步测试|
|src/runtime/picker/selection-engine.js:299|chosen|allGroups.filter((g) => pre.includes(g.id))|需要进一步测试|
|src/runtime/picker/selection-engine.js:301|chosenStus|allStudents.filter((s) => pre.includes(s.group.id))|需要进一步测试|
|src/runtime/picker/selection-engine.js:311|reelGrpText|document.getElementById("reelTextGroup")|需要进一步测试|
|src/runtime/picker/selection-engine.js:314|randomGrp|reelGrps[Math.floor(Math.random() * reelGrps.length)]|需要进一步测试|
|src/runtime/picker/selection-engine.js:319|reelStuText|document.getElementById("reelTextStudent")|需要进一步测试|
|src/runtime/picker/selection-engine.js:322|randomStu|reelStus[Math.floor(Math.random() * reelStus.length)]|需要进一步测试|
|src/runtime/picker/selection-engine.js:343|btn|document.getElementById("btnSlotTrigger")|需要进一步测试|
|src/runtime/picker/selection-engine.js:347|win|slotEngine.chosenResult|需要进一步测试|
|src/runtime/picker/selection-engine.js:350|reelGrpText|document.getElementById("reelTextGroup")|需要进一步测试|
|src/runtime/picker/selection-engine.js:351|reelStuText|document.getElementById("reelTextStudent")|需要进一步测试|
|src/runtime/picker/selection-engine.js:352|badge|document.getElementById("slotSubBadge")|需要进一步测试|
|src/runtime/picker/selection-engine.js:353|resultHeadline|document.getElementById("resultHeadline")|需要进一步测试|
|src/runtime/picker/selection-engine.js:393|target|state.picker.mode === "group" ? win : win.group|需要进一步测试|
|src/runtime/picker/selection-engine.js:394|text|state.picker.mode === "group"       ? 抽中 ${target.name}       : 抽中 ${win.memberName}（${target.name}）|需要进一步测试|
|src/runtime/picker/selection-engine.js:412|win|slotEngine.chosenResult|需要进一步测试|
|src/runtime/picker/selection-engine.js:414|targetGroup|state.picker.mode === "group" ? win : win.group|需要进一步测试|
|src/runtime/picker/selection-engine.js:415|g|state.groups.find((x) => x.id === targetGroup.id)|需要进一步测试|
|src/runtime/picker/selection-engine.js:419|oldScore|g.score|需要进一步测试|
|src/runtime/storage/classroom-save.js:30|payload|buildClassroomBackup()|需要进一步测试|
|src/runtime/storage/classroom-save.js:35|result|Reliability.writeVerified(     CLASSROOM_STORAGE,     Reliability.stateKey,     payload,   )|需要进一步测试|
|src/runtime/storage/classroom-save.js:45|saveWarning|document.getElementById("classroomSaveWarning")|需要进一步测试|
|src/runtime/storage/classroom-save.js:48|mirrors|[     ["politics_groups_data", payload.groups],     ["politics_picker_state", state.picker],     ["politics_item_global", state.itemGlobal],     ["politics_hist|需要进一步测试|
|src/runtime/storage/classroom-save.js:54|failed|mirrors     .filter(([k, v]) => !STORAGE.setJSON(k, v))     .map(([k]) => k)|需要进一步测试|
|src/runtime/storage/classroom-save.js:57|[k, v]||需要进一步测试|
|src/runtime/storage/classroom-transfer.js:2|blob|new Blob([JSON.stringify(buildClassroomBackup(), null, 2)], {     type: "application/json",   })|需要进一步测试|
|src/runtime/storage/classroom-transfer.js:5|url|URL.createObjectURL(blob)|需要进一步测试|
|src/runtime/storage/classroom-transfer.js:6|a|document.createElement("a")|需要进一步测试|
|src/runtime/storage/classroom-transfer.js:22|file|event.target.files?.[0]|需要进一步测试|
|src/runtime/storage/classroom-transfer.js:29|reader|new FileReader()|需要进一步测试|
|src/runtime/storage/classroom-transfer.js:32|result|importClassroomData(JSON.parse(reader.result))|需要进一步测试|
|src/runtime/ui/admin-lock.js:28|val|document.getElementById("pwdInput").value.trim()|需要进一步测试|
|src/runtime/ui/admin-lock.js:36|input|document.getElementById("pwdInput")|需要进一步测试|
|src/runtime/ui/admin-lock.js:43|newPin|document.getElementById("newPwdInput").value.trim()|需要进一步测试|
|src/runtime/ui/attack-reorder-scheduling.js:15|ATTACK_REORDER_DELAY_V21713|340|需要进一步测试|
|src/runtime/ui/attack-reorder-scheduling.js:17|attackRenderGateV21713|false|需要进一步测试|
|src/runtime/ui/attack-reorder-scheduling.js:18|attackRenderTimerV21713|null|需要进一步测试|
|src/runtime/ui/attack-reorder-scheduling.js:19|attackRenderFlushingV21713|false|需要进一步测试|
|src/runtime/ui/attack-reorder-scheduling.js:20|pendingRenderArgsV21713|null|需要进一步测试|
|src/runtime/ui/attack-reorder-scheduling.js:25|_v21713ApplyLightningHit|applyLightningHitV2116|需要进一步测试|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:7|r|ranking()|需要进一步测试|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:8|i|r.findIndex((g) => g.id === id)|需要进一步测试|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:19|box|document.getElementById("handGroupGrid")|需要进一步测试|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:27|reward|document.getElementById("handRewardBox")|需要进一步测试|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:31|g|state.groups.find((x) => x.id === id)|需要进一步测试|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:33|b|document.querySelector(     #handGroupGrid .hand-group[data-group-id="${id}"] small,   )|需要进一步测试|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:40|id|handRaiseGroupId|需要进一步测试|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:47|box|document.getElementById("handRewardBox")|需要进一步测试|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:48|g|state.groups.find((x) => x.id === handRaiseGroupId)|需要进一步测试|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:50|main|g.inventory?.[0]|需要进一步测试|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:51|useText|main     ? 使用：${ITEM_DEFS[main.key]?.name ／／ "当前主要道具"}     : "使用：无主要道具"|需要进一步测试|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:54|drawDisabled|!eligibleForItems(g) ／／ g.inventory.length >= 3|需要进一步测试|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:55|useDisabled|!main ／／ !eligibleForItems(g)|需要进一步测试|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:58|_v214JudgeHandRaise|judgeHandRaise|需要进一步测试|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:64|g|state.groups.find((x) => x.id === handRaiseGroupId)|需要进一步测试|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:66|main|g.inventory?.[0]|需要进一步测试|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:71|gid|g.id|需要进一步测试|
|src/runtime/ui/battle-layout-controls.js:39|dock|document.getElementById("heightResizerDock")|需要进一步测试|
|src/runtime/ui/battle-layout-controls.js:46|handle|document.getElementById("resizerHandle")|需要进一步测试|
|src/runtime/ui/battle-layout-controls.js:47|dock|document.getElementById("heightResizerDock")|需要进一步测试|
|src/runtime/ui/battle-layout-controls.js:50|startY|0|需要进一步测试|
|src/runtime/ui/battle-layout-controls.js:51|startH|0|需要进一步测试|
|src/runtime/ui/battle-layout-controls.js:62|deltaY|e.clientY - startY|需要进一步测试|
|src/runtime/ui/battle-layout-controls.js:63|newH|Math.max(28, Math.min(600, startH + deltaY))|需要进一步测试|
|src/runtime/ui/battle-order-compat.js:2|v213ForceRankSort|false|需要进一步测试|
|src/runtime/ui/battle-order-compat.js:3|v213ItemSortBusy|false|需要进一步测试|
|src/runtime/ui/battle-order-compat.js:4|v213SkipNextReorderAnimation|false|需要进一步测试|
|src/runtime/ui/battle-order-compat.js:5|v213SuppressReorderAnimation|false|需要进一步测试|
|src/runtime/ui/battle-order-compat.js:6|V213_CARD_REORDER_MS|750|需要进一步测试|
|src/runtime/ui/battle-order-compat.js:7|V213_CARD_REORDER_SETTLE_MS|790|需要进一步测试|
|src/runtime/ui/battle-order-compat.js:10|used|new Set()|需要进一步测试|
|src/runtime/ui/battle-order-compat.js:11|maxNo|0|需要进一步测试|
|src/runtime/ui/battle-order-compat.js:12|changed|false|需要进一步测试|
|src/runtime/ui/battle-order-compat.js:14|n|Number.parseInt(g.groupNo, 10)|需要进一步测试|
|src/runtime/ui/battle-order-compat.js:38|n|Math.max(1, Number.parseInt(g?.groupNo, 10) ／／ 1)|需要进一步测试|
|src/runtime/ui/battle-order-compat.js:62|box|document.getElementById("v2ItemEncyclopedia")|需要进一步测试|
|src/runtime/ui/battle-order-compat.js:69|d|ITEM_DEFS[k]|需要进一步测试|
|src/runtime/ui/battle-order-compat.js:82|_v213Batch|applySettingsBatchMembers|需要进一步测试|
|src/runtime/ui/battle-order-compat.js:84|oldNums|new Map(state.groups.map((g) => [g.id, g.groupNo]))|需要进一步测试|
|src/runtime/ui/battle-order-compat.js:85|r|_v213Batch.apply(this, a)|需要进一步测试|
|src/runtime/ui/battle-sort-contract.js:9|groups|state.groups.slice()|需要进一步测试|
|src/runtime/ui/battle-sort-contract.js:13|na|typeof groupNoValueV213 === "function"           ? groupNoValueV213(a)           : Number(a.groupNo ?? a.id ?? 0)|需要进一步测试|
|src/runtime/ui/battle-sort-contract.js:17|nb|typeof groupNoValueV213 === "function"           ? groupNoValueV213(b)           : Number(b.groupNo ?? b.id ?? 0)|需要进一步测试|
|src/runtime/ui/battle-sort-contract.js:31|d|Number(b.score ／／ 0) - Number(a.score ／／ 0)|需要进一步测试|
|src/runtime/ui/battle-sort-contract.js:33|na|typeof groupNoValueV213 === "function"         ? groupNoValueV213(a)         : Number(a.groupNo ?? a.id ?? 0)|需要进一步测试|
|src/runtime/ui/battle-sort-contract.js:37|nb|typeof groupNoValueV213 === "function"         ? groupNoValueV213(b)         : Number(b.groupNo ?? b.id ?? 0)|需要进一步测试|
|src/runtime/ui/chart-and-window-polish.js:2|n|Number(value) ／／ 0|需要进一步测试|
|src/runtime/ui/chart-and-window-polish.js:3|abs|Math.abs(n)|需要进一步测试|
|src/runtime/ui/chart-and-window-polish.js:6|sign|n < 0 ? "-" : ""|需要进一步测试|
|src/runtime/ui/chart-and-window-polish.js:7|a|Math.abs(n)|需要进一步测试|
|src/runtime/ui/chart-and-window-polish.js:9|v|a / 100000000|需要进一步测试|
|src/runtime/ui/chart-and-window-polish.js:18|v|a / 10000|需要进一步测试|
|src/runtime/ui/competition-summary.js:2|bar|document.getElementById("quickBatchBar")|需要进一步测试|
|src/runtime/ui/competition-summary.js:12|banner|document.getElementById("topHeaderStats")|需要进一步测试|
|src/runtime/ui/competition-summary.js:14|summary|GodpowerUIModel.standings(ranking())|需要进一步测试|
|src/runtime/ui/competition-summary.js:15|mask|Number(state.itemGlobal?.blooperUntil ／／ 0) > Date.now()|需要进一步测试|
|src/runtime/ui/competition-summary.js:16|html|小组总数: <b>${summary.count}</b> 组 ／ 总积分: <b>${mask ? "???" : summary.total}</b> ／ 当前领先: <b style="color:#0284c7;">${mask ? "已遮蔽" : summary.count ? escapeHtml(sum|需要进一步测试|
|src/runtime/ui/competition-summary.js:23|wrapper|document.getElementById("chartWrapper")|需要进一步测试|
|src/runtime/ui/competition-summary.js:26|sorted|[...state.groups].sort((a, b) => {     const scA = a.displayScore !== undefined ? a.displayScore : a.score;     const scB = b.displayScore !== undefined ? b.dis|需要进一步测试|
|src/runtime/ui/competition-summary.js:27|scA|a.displayScore !== undefined ? a.displayScore : a.score|需要进一步测试|
|src/runtime/ui/competition-summary.js:28|scB|b.displayScore !== undefined ? b.displayScore : b.score|需要进一步测试|
|src/runtime/ui/competition-summary.js:32|rowHeight|30|需要进一步测试|
|src/runtime/ui/competition-summary.js:35|maxScore|Math.max(     ...sorted.map((g) =>       g.displayScore !== undefined ? g.displayScore : g.score,     ),     10,   )|需要进一步测试|
|src/runtime/ui/competition-summary.js:42|existingRows|Array.from(wrapper.querySelectorAll(".chart-row"))|需要进一步测试|
|src/runtime/ui/competition-summary.js:43|currentIds|new Set(sorted.map((g) => g.id.toString()))|需要进一步测试|
|src/runtime/ui/competition-summary.js:52|row|wrapper.querySelector(.chart-row[data-id="${g.id}"])|需要进一步测试|
|src/runtime/ui/competition-summary.js:70|rankEl|row.querySelector(".chart-rank")|需要进一步测试|
|src/runtime/ui/competition-summary.js:73|nameEl|row.querySelector(".chart-name")|需要进一步测试|
|src/runtime/ui/competition-summary.js:79|curScore|g.displayScore !== undefined ? g.displayScore : g.score|需要进一步测试|
|src/runtime/ui/competition-summary.js:80|scoreEl|row.querySelector(".chart-score")|需要进一步测试|
|src/runtime/ui/competition-summary.js:86|barEl|row.querySelector(".chart-bar")|需要进一步测试|
|src/runtime/ui/competition-summary.js:88|percent|Math.max(2, (curScore / maxScore) * 100)|需要进一步测试|
|src/runtime/ui/competition-summary.js:96|podiumDeck|document.getElementById("podiumDeck")|需要进一步测试|
|src/runtime/ui/competition-summary.js:99|sorted|[...state.groups].sort((a, b) => {     const scA = a.displayScore !== undefined ? a.displayScore : a.score;     const scB = b.displayScore !== undefined ? b.dis|需要进一步测试|
|src/runtime/ui/competition-summary.js:100|scA|a.displayScore !== undefined ? a.displayScore : a.score|需要进一步测试|
|src/runtime/ui/competition-summary.js:101|scB|b.displayScore !== undefined ? b.displayScore : b.score|需要进一步测试|
|src/runtime/ui/competition-summary.js:104|top1|sorted[0]|需要进一步测试|
|src/runtime/ui/competition-summary.js:105|top2|sorted[1]|需要进一步测试|
|src/runtime/ui/competition-summary.js:106|top3|sorted[2]|需要进一步测试|
|src/runtime/ui/competition-summary.js:108|getScoreText|(g) =>     g ? (g.displayScore !== undefined ? g.displayScore : g.score) : 0|需要进一步测试|
|src/runtime/ui/competition-summary.js:129|totalGroups|state.groups.length|需要进一步测试|
|src/runtime/ui/competition-summary.js:130|answeredGroups|state.groups.filter((g) => g.selectedOpt).length|需要进一步测试|
|src/runtime/ui/competition-summary.js:131|allInGroups|state.groups.filter((g) => g.allIn).length|需要进一步测试|
|src/runtime/ui/competition-summary.js:132|totalScore|state.groups.reduce(     (acc, g) => acc + (g.displayScore !== undefined ? g.displayScore : g.score),     0,   )|需要进一步测试|
|src/runtime/ui/competition-summary.js:136|avgScore|totalGroups > 0 ? (totalScore / totalGroups).toFixed(1) : 0|需要进一步测试|
|src/runtime/ui/competition-summary.js:145|btn|document.getElementById("lockBtn")|需要进一步测试|
|src/runtime/ui/competition-summary.js:146|addBtn|document.getElementById("btnAddGroup")|需要进一步测试|
|src/runtime/ui/competition-summary.js:147|importBtn|document.getElementById("btnImport")|需要进一步测试|
|src/runtime/ui/competition-summary.js:148|resetBtn|document.getElementById("btnResetScores")|需要进一步测试|
|src/runtime/ui/competition-summary.js:149|undoBtn|document.getElementById("btnUndo")|需要进一步测试|
|src/runtime/ui/competition-summary.js:171|statusBadge|document.getElementById("roundStatusBadge")|需要进一步测试|
|src/runtime/ui/competition-summary.js:172|mainActionBtn|document.getElementById("btnMainAction")|需要进一步测试|
|src/runtime/ui/competition-summary.js:173|nextBtn|document.getElementById("btnNextRound")|需要进一步测试|
|src/runtime/ui/competition-summary.js:174|forceBtn|document.getElementById("btnForceEnd")|需要进一步测试|
|src/runtime/ui/competition-summary.js:208|btns|document.querySelectorAll(".ans-btn")|需要进一步测试|
|src/runtime/ui/defense-notices.js:4|stack|document.getElementById("topNoticeStackV21735")|需要进一步测试|
|src/runtime/ui/defense-notices.js:15|stack|getTopNoticeStackV21735()|需要进一步测试|
|src/runtime/ui/defense-notices.js:18|remove|() => {     if (node.isConnected) node.remove();     if (stack.isConnected && !stack.children.length) stack.remove();   }|需要进一步测试|
|src/runtime/ui/defense-notices.js:29|_v21735ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/runtime/ui/defense-notices.js:47|d|ITEM_DEFS?.[key]|需要进一步测试|
|src/runtime/ui/defense-notices.js:64|special|["coin_shell", "question", "question_block", "boo"]|需要进一步测试|
|src/runtime/ui/defense-notices.js:66|heal|["coin_shell", "question", "question_block"].includes(key)|需要进一步测试|
|src/runtime/ui/defense-notices.js:81|caster|state.groups?.find((g) => g.id === casterId)|需要进一步测试|
|src/runtime/ui/defense-notices.js:82|banner|document.createElement("div")|需要进一步测试|
|src/runtime/ui/defense-notices.js:104|banner|document.createElement("div")|需要进一步测试|
|src/runtime/ui/dock-tooltips.js:1|DOCK_HUMOR_V2185|{   roundStatusBadge: {     name: "战况播报",     copy: "负责告诉你现在到底是在答题、结算，还是全班集体等待某个人终于按下按钮。",   },   correctAnswer: {     name: "标准答案投票站",     copy: "A、B、C、D 四选一。请|需要进一步测试|
|src/runtime/ui/dock-tooltips.js:76|dockHumorTipV2185|null|需要进一步测试|
|src/runtime/ui/dock-tooltips.js:79|el|document.createElement("div")|需要进一步测试|
|src/runtime/ui/dock-tooltips.js:86|d|DOCK_HUMOR_V2185[key]|需要进一步测试|
|src/runtime/ui/dock-tooltips.js:91|tip|ensureDockHumorTipV2185()|需要进一步测试|
|src/runtime/ui/dock-tooltips.js:93|r|el.getBoundingClientRect()|需要进一步测试|
|src/runtime/ui/dock-tooltips.js:97|tr|tip.getBoundingClientRect()|需要进一步测试|
|src/runtime/ui/dock-tooltips.js:98|left|r.left + r.width / 2 - tr.width / 2|需要进一步测试|
|src/runtime/ui/dock-tooltips.js:100|top|r.top - tr.height - 9|需要进一步测试|
|src/runtime/ui/dock-tooltips.js:111|dock|document.querySelector(".bottom-dock")|需要进一步测试|
|src/runtime/ui/dock-tooltips.js:119|ansWrap|[...dock.querySelectorAll(".dock-left>div")].find((x) =>     x.querySelector(".ans-btn"),   )|需要进一步测试|
|src/runtime/ui/dock-tooltips.js:124|label|ansWrap.querySelector("span")|需要进一步测试|
|src/runtime/ui/dock-tooltips.js:133|next|document.getElementById("btnNextRound")|需要进一步测试|
|src/runtime/ui/dock-tooltips.js:139|force|document.getElementById("btnForceEnd")|需要进一步测试|
|src/runtime/ui/dock-tooltips.js:145|finalBtn|document.getElementById("btnFinalSettlement")|需要进一步测试|
|src/runtime/ui/dock-tooltips.js:152|byOnclick|(needle) =>     [...dock.querySelectorAll("button")].find((b) =>       (b.getAttribute("onclick") ／／ "").includes(needle),     )|需要进一步测试|
|src/runtime/ui/dock-tooltips.js:168|qp|document.getElementById("quickPersonBtnV218")|需要进一步测试|
|src/runtime/ui/dock-tooltips.js:179|_v2185RenderLockState|renderLockState|需要进一步测试|
|src/runtime/ui/dock-tooltips.js:181|r|_v2185RenderLockState.apply(this, arguments)|需要进一步测试|
|src/runtime/ui/dock-tooltips.js:182|btn|document.getElementById("lockBtn")|需要进一步测试|
|src/runtime/ui/icon-settings.js:1|UI_ICON_TARGETS|[   ["nav_welcome", "欢迎", '[data-view="welcome"]', "🏠"],   ["nav_battle", "比赛", '[data-view="battle"]', "⚔️"],   ["nav_history", "历史", '[data-view="history"]',|需要进一步测试|
|src/runtime/ui/icon-settings.js:25|pendingUiIconV26|null|需要进一步测试|
|src/runtime/ui/icon-settings.js:30|map|uiIconsV26()|需要进一步测试|
|src/runtime/ui/icon-settings.js:32|el|document.querySelector(sel)|需要进一步测试|
|src/runtime/ui/icon-settings.js:35|data|Reliability.safeImage(map[id])|需要进一步测试|
|src/runtime/ui/icon-settings.js:37|template|document.createElement("template")|需要进一步测试|
|src/runtime/ui/icon-settings.js:40|text|template.innerHTML.trim() ／／ escapeHtml(label)|需要进一步测试|
|src/runtime/ui/icon-settings.js:49|f|document.getElementById("uiIconInputV26")|需要进一步测试|
|src/runtime/ui/icon-settings.js:54|f|e.target.files?.[0]|需要进一步测试|
|src/runtime/ui/icon-settings.js:57|m|uiIconsV26()|需要进一步测试|
|src/runtime/ui/icon-settings.js:65|m|uiIconsV26()|需要进一步测试|
|src/runtime/ui/icon-settings.js:72|box|document.getElementById("uiIconManagerV26")|需要进一步测试|
|src/runtime/ui/icon-settings.js:74|m|uiIconsV26()|需要进一步测试|
|src/runtime/ui/interface-copy.js:6|qp|document.querySelector(     "#quickPersonBackdropV218 .quick-person-head b",   )|需要进一步测试|
|src/runtime/ui/interface-copy.js:12|aboutInfo|document.querySelector(     '#aboutBackdrop [data-about="info"]',   )|需要进一步测试|
|src/runtime/ui/interface-copy.js:15|aboutGuide|document.querySelector(     '#aboutBackdrop [data-about="guide"]',   )|需要进一步测试|
|src/runtime/ui/interface-copy.js:40|pickerTitle|document.querySelector("#pickerModal .picker-left h3")|需要进一步测试|
|src/runtime/ui/interface-copy.js:42|handTitle|document.querySelector(     "#handRaiseBackdrop .classroom-head b",   )|需要进一步测试|
|src/runtime/ui/interface-copy.js:46|memberTitle|document.querySelector(     "#memberSearchBackdrop .member-search-title",   )|需要进一步测试|
|src/runtime/ui/interface-copy.js:57|_v2187OpenPwdModal|openPwdModal|需要进一步测试|
|src/runtime/ui/interface-copy.js:59|r|_v2187OpenPwdModal.apply(this, arguments)|需要进一步测试|
|src/runtime/ui/interface-copy.js:60|h|document.querySelector("#pwdModal h3")|需要进一步测试|
|src/runtime/ui/interface-copy.js:61|p|document.querySelector("#pwdModal p")|需要进一步测试|
|src/runtime/ui/interface-copy.js:62|ok|document.querySelector("#pwdModal .btn-primary")|需要进一步测试|
|src/runtime/ui/interface-copy.js:80|fn|window[name]|需要进一步测试|
|src/runtime/ui/interface-copy.js:83|r|fn.apply(this, args)|需要进一步测试|
|src/runtime/ui/member-search.js:2|backdrop|document.getElementById("memberSearchBackdrop")|需要进一步测试|
|src/runtime/ui/member-search.js:3|input|document.getElementById("memberSearchInput")|需要进一步测试|
|src/runtime/ui/member-search.js:13|backdrop|document.getElementById("memberSearchBackdrop")|需要进一步测试|
|src/runtime/ui/member-search.js:28|input|document.getElementById("memberSearchInput")|需要进一步测试|
|src/runtime/ui/member-search.js:29|results|document.getElementById("memberSearchResults")|需要进一步测试|
|src/runtime/ui/member-search.js:32|keyword|input.value.trim().toLowerCase()|需要进一步测试|
|src/runtime/ui/member-search.js:39|matches|[]|需要进一步测试|
|src/runtime/ui/member-search.js:41|members|Array.isArray(g.members) ? g.members : []|需要进一步测试|
|src/runtime/ui/member-search.js:43|name|String(member).trim()|需要进一步测试|
|src/runtime/ui/member-search.js:57|g|item.group|需要进一步测试|
|src/runtime/ui/member-search.js:58|memberList|(Array.isArray(g.members) ? g.members : [])         .map(escapeHtml)         .join("、")|需要进一步测试|
|src/runtime/ui/navigation-and-clock.js:15|VIEW_NAMES|window.GodPowerPageShell?.listPages()   .filter((page) => page.core)   .map((page) => page.route) ／／ [   "welcome",   "battle",   "history",   "archives",   "se|需要进一步测试|
|src/runtime/ui/navigation-and-clock.js:24|currentView|"welcome"|需要进一步测试|
|src/runtime/ui/navigation-and-clock.js:25|audioUnlocked|false|需要进一步测试|
|src/runtime/ui/navigation-and-clock.js:41|route|window.GodPowerPageShell?.resolvePage(name)|需要进一步测试|
|src/runtime/ui/navigation-and-clock.js:53|target|document.getElementById("view-" + name)|需要进一步测试|
|src/runtime/ui/navigation-and-clock.js:79|menuKey|getMenuTrackKeyForView(name)|需要进一步测试|
|src/runtime/ui/navigation-and-clock.js:99|max|state.groups.reduce(     (m, g) => Math.max(m, Number(g.score) ／／ 0),     0,   )|需要进一步测试|
|src/runtime/ui/navigation-and-clock.js:103|digits|Math.max(     1,     Math.min(6, String(Math.floor(Math.abs(max))).length),   )|需要进一步测试|
|src/runtime/ui/navigation-and-clock.js:111|WEEKDAYS|["日", "一", "二", "三", "四", "五", "六"]|需要进一步测试|
|src/runtime/ui/navigation-and-clock.js:112|welcomeClockTimer|null|需要进一步测试|
|src/runtime/ui/navigation-and-clock.js:123|now|new Date()|需要进一步测试|
|src/runtime/ui/navigation-and-clock.js:124|hh|String(now.getHours()).padStart(2, "0")|需要进一步测试|
|src/runtime/ui/navigation-and-clock.js:125|mm|String(now.getMinutes()).padStart(2, "0")|需要进一步测试|
|src/runtime/ui/navigation-and-clock.js:126|ss|String(now.getSeconds()).padStart(2, "0")|需要进一步测试|
|src/runtime/ui/navigation-and-clock.js:127|clock|document.getElementById("welcomeClock")|需要进一步测试|
|src/runtime/ui/navigation-and-clock.js:129|date|document.getElementById("welcomeDate")|需要进一步测试|
|src/runtime/ui/navigation-and-clock.js:139|greeting|document.getElementById("welcomeGreeting")|需要进一步测试|
|src/runtime/ui/navigation-and-clock.js:141|h|now.getHours()|需要进一步测试|
|src/runtime/ui/navigation-and-clock.js:142|part|h < 6         ? "夜深了"         : h < 12           ? "早上好"           : h < 14             ? "中午好"             : h < 18               ? "下午好"               : "晚上好"|需要进一步测试|
|src/runtime/ui/navigation-and-clock.js:158|wrap|document.getElementById("welcomePodiumDeck")|需要进一步测试|
|src/runtime/ui/navigation-and-clock.js:160|sorted|[...state.groups].sort(     (a, b) => (Number(b.score) ／／ 0) - (Number(a.score) ／／ 0),   )|需要进一步测试|
|src/runtime/ui/navigation-and-clock.js:163|top1|sorted[0]|需要进一步测试|
|src/runtime/ui/navigation-and-clock.js:164|top2|sorted[1]|需要进一步测试|
|src/runtime/ui/navigation-and-clock.js:165|top3|sorted[2]|需要进一步测试|
|src/runtime/ui/navigation-and-clock.js:166|getScore|(g) => (g ? Number(g.score) ／／ 0 : 0)|需要进一步测试|
|src/runtime/ui/notice-duration.js:2|NOTICE_DURATION_V21734|3800|需要进一步测试|
|src/runtime/ui/notice-duration.js:8|style|document.createElement("style")|需要进一步测试|
|src/runtime/ui/program-confirmation.js:1|programConfirmResolveV28|null|需要进一步测试|
|src/runtime/ui/program-confirmation.js:4|previous|document.getElementById("programConfirmV28")|需要进一步测试|
|src/runtime/ui/program-confirmation.js:9|o|document.createElement("div")|需要进一步测试|
|src/runtime/ui/program-confirmation.js:24|settled|false|需要进一步测试|
|src/runtime/ui/program-confirmation.js:25|finish|(v) => {       if (settled ／／ !o.isConnected) return;       settled = true;       document.removeEventListener("keydown", key);       hideClassroomWindow(o, () |需要进一步测试|
|src/runtime/ui/program-confirmation.js:38|key|(e) => {       if (!o.isConnected) {         document.removeEventListener("keydown", key);         return;       }       if (e.key === "Escape") {         docum|需要进一步测试|
|src/runtime/ui/rank-preview.js:4|box|document.getElementById("battleRankPreviewGridV21721")|需要进一步测试|
|src/runtime/ui/rank-preview.js:7|ranked|[]|需要进一步测试|
|src/runtime/ui/rank-preview.js:23|rank|i + 1|需要进一步测试|
|src/runtime/ui/rank-preview.js:24|no|typeof groupNoTextV213 === "function"           ? groupNoTextV213(g)           : String(g.groupNo ／／ g.id ／／ "")|需要进一步测试|
|src/runtime/ui/rank-preview.js:28|medal|rank === 1           ? "🥇"           : rank === 2             ? "🥈"             : rank === 3               ? "🥉"               : String(rank)|需要进一步测试|
|src/runtime/ui/rank-preview.js:48|_v21721SwitchView|typeof switchView === "function" ? switchView : null|需要进一步测试|
|src/runtime/ui/rank-preview.js:51|result|_v21721SwitchView.call(this, name, ...args)|需要进一步测试|
|src/runtime/ui/round-flip.js:6|map|new Map()|需要进一步测试|
|src/runtime/ui/round-flip.js:10|r|card.getBoundingClientRect()|需要进一步测试|
|src/runtime/ui/round-flip.js:18|roundStateFlipBusyV21726|false|需要进一步测试|
|src/runtime/ui/round-flip.js:19|roundStateFlipTimerV21726|null|需要进一步测试|
|src/runtime/ui/round-flip.js:24|moved|[]|需要进一步测试|
|src/runtime/ui/round-flip.js:28|old|oldRects.get(String(card.dataset.groupId))|需要进一步测试|
|src/runtime/ui/round-flip.js:31|now|card.getBoundingClientRect()|需要进一步测试|
|src/runtime/ui/round-flip.js:32|dx|old.left - now.left|需要进一步测试|
|src/runtime/ui/round-flip.js:33|dy|old.top - now.top|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:7|g|state.groups.find((x) => x.id === groupId)|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:12|inputEl|document.getElementById("modalCustomInput")|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:15|errEl|document.getElementById("scoreModalError")|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:27|groupId|state.activeModalGroupId|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:43|groupId|state.activeModalGroupId|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:44|input|document.getElementById("modalCustomInput")|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:45|errEl|document.getElementById("scoreModalError")|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:48|raw|input.value     .trim()     .replace(/[－—–−]/g, "-")     .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:52|fail|(msg) => {     input.classList.add("invalid");     if (errEl) errEl.innerText = msg;     input.focus();     input.select();   }|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:62|val|parseInt(raw, 10)|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:76|card|document.querySelector(     .group-row-card[data-group-id="${groupId}"],   )|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:80|banner|card.querySelector(".milestone-banner-overlay")|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:92|activeScoreAnimId|null|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:111|startTime|performance.now()|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:112|duration|950|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:115|easeScore|(p) => 1 - Math.pow(1 - Math.min(1, Math.max(0, p)), 5)|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:118|elapsed|now - startTime|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:119|progress|Math.min(elapsed / duration, 1)|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:120|ease|easeScore(progress)|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:123|cur|Math.round(item.start + (item.target - item.start) * ease)|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:124|g|state.groups.find((x) => x.id === item.groupId)|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:127|el|document.getElementById(score-val-${g.id})|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:140|g|state.groups.find((x) => x.id === item.groupId)|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:176|input|document.getElementById(input-score-${groupId})|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:177|g|state.groups.find((x) => x.id === groupId)|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:179|newVal|Number(input.value)|需要进一步测试|
|src/runtime/ui/score-motion.js:1|scoreAnimationEpoch|0|需要进一步测试|
|src/runtime/ui/score-motion.js:3|epoch|scoreAnimationEpoch|需要进一步测试|
|src/runtime/ui/score-motion.js:14|g|state.groups.find((g) => String(g.id) === el.id.slice(10))|需要进一步测试|
|src/runtime/ui/score-motion.js:26|el|document.getElementById(score-val-${g.id})|需要进一步测试|
|src/runtime/ui/score-motion.js:40|itemScoreBatchDepthV21732|0|需要进一步测试|
|src/runtime/ui/score-motion.js:41|pendingItemScoreAnimationsV21732|[]|需要进一步测试|
|src/runtime/ui/score-motion.js:42|ITEM_SCORE_AFTER_FX_DELAY_V21732|980|需要进一步测试|
|src/runtime/ui/score-motion.js:43|ITEM_DELTA_DURATION_V21732|1050|需要进一步测试|
|src/runtime/ui/score-motion.js:44|ITEM_SCORE_ROLL_DURATION_V21732|920|需要进一步测试|
|src/runtime/ui/score-motion.js:45|activeScoreRollsV21732|new Map()|需要进一步测试|
|src/runtime/ui/score-motion.js:48|itemScoreDisplayHoldV21732|new Map()|需要进一步测试|
|src/runtime/ui/score-motion.js:60|g|state.groups.find((x) => String(x.id) === String(key))|需要进一步测试|
|src/runtime/ui/score-motion.js:66|scoreEl|getScoreElementV21732(groupId)|需要进一步测试|
|src/runtime/ui/score-motion.js:73|deltaEl|document.createElement("span")|需要进一步测试|
|src/runtime/ui/score-motion.js:88|[kind, value]||需要进一步测试|
|src/runtime/ui/score-motion.js:92|ghost|document.createElement("span")|需要进一步测试|
|src/runtime/ui/score-motion.js:100|key|String(groupId)|需要进一步测试|
|src/runtime/ui/score-motion.js:101|g|state.groups.find((x) => String(x.id) === key)|需要进一步测试|
|src/runtime/ui/score-motion.js:106|session|{ from, to, started: performance.now() }|需要进一步测试|
|src/runtime/ui/score-motion.js:108|el|getScoreElementV21732(groupId)|需要进一步测试|
|src/runtime/ui/score-motion.js:115|el|getScoreElementV21732(groupId)|需要进一步测试|
|src/runtime/ui/score-motion.js:130|p|DesktopUI.getPreferences()|需要进一步测试|
|src/runtime/ui/score-motion.js:139|changes|[]|需要进一步测试|
|src/runtime/ui/score-motion.js:141|old|beforeMap.get(String(g.id))|需要进一步测试|
|src/runtime/ui/score-motion.js:143|now|Number(g.score) ／／ 0|需要进一步测试|
|src/runtime/ui/score-motion.js:155|el|getScoreElementV21732(g.id)|需要进一步测试|
|src/runtime/ui/score-motion.js:164|merged|new Map()|需要进一步测试|
|src/runtime/ui/score-motion.js:166|key|String(c.groupId)|需要进一步测试|
|src/runtime/ui/score-motion.js:174|batch|pendingItemScoreAnimationsV21732.splice(0)|需要进一步测试|
|src/runtime/ui/score-motion.js:177|g|state.groups.find((x) => String(x.id) === String(c.groupId))|需要进一步测试|
|src/runtime/ui/score-motion.js:178|finalScore|g ? Number(g.score) ／／ 0 : c.now|需要进一步测试|
|src/runtime/ui/score-motion.js:179|delta|finalScore - c.old|需要进一步测试|
|src/runtime/ui/score-motion.js:213|el|getScoreElementV21732(key)|需要进一步测试|
|src/runtime/ui/score-motion.js:215|session|activeScoreRollsV21732.get(String(key))|需要进一步测试|
|src/runtime/ui/score-motion.js:216|g|state.groups.find((x) => String(x.id) === String(key))|需要进一步测试|
|src/runtime/ui/settings-and-about.js:2|sc|document.querySelector("#view-settings .settings-scroll")|需要进一步测试|
|src/runtime/ui/settings-and-about.js:4|tabs|document.createElement("div")|需要进一步测试|
|src/runtime/ui/settings-and-about.js:9|item|document.createElement("div")|需要进一步测试|
|src/runtime/ui/settings-and-about.js:22|sc|document.querySelector("#view-settings .settings-scroll")|需要进一步测试|
|src/runtime/ui/settings-and-about.js:23|item|document.getElementById("v2ItemPane")|需要进一步测试|
|src/runtime/ui/settings-and-about.js:31|titles|[...sc.querySelectorAll(".setting-section-title")]|需要进一步测试|
|src/runtime/ui/settings-and-about.js:50|result|tab === "items" ? renderAboutItems(tab) : renderAboutInformation(tab)|需要进一步测试|
|src/runtime/ui/settings-and-about.js:57|_v2RenderItemWindow|renderItemWindow|需要进一步测试|
|src/runtime/ui/settings-and-about.js:60|g|state.groups.find((x) => x.id === activeItemGroupId)|需要进一步测试|
|src/runtime/ui/settings-and-about.js:61|body|document.getElementById("itemWindowBody")|需要进一步测试|
|src/runtime/ui/settings-and-about.js:63|d|document.createElement("div")|需要进一步测试|
|src/runtime/ui/settings-and-about.js:69|g|state.groups.find((x) => x.id === id)|需要进一步测试|
|src/runtime/ui/settings-and-about.js:90|g|state.groups.find((x) => x.id === id)|需要进一步测试|
|src/runtime/ui/settings-and-about.js:103|_v2Enhance|enhanceItemCards|需要进一步测试|
|src/runtime/ui/settings-and-about.js:108|c|document.querySelector(       .group-row-card[data-group-id="${g.id}"],     )|需要进一步测试|
|src/runtime/ui/settings-and-about.js:113|it|g.inventory[i]|需要进一步测试|
|src/runtime/ui/settings-and-about.js:115|charge|s.querySelector(".charges")?.outerHTML ／／ ""|需要进一步测试|
|src/runtime/ui/settings-and-about.js:121|_v2RenderItemWindowIcons|renderItemWindow|需要进一步测试|
|src/runtime/ui/settings-and-about.js:124|g|state.groups.find((x) => x.id === activeItemGroupId)|需要进一步测试|
|src/runtime/ui/settings-and-about.js:129|it|g.inventory[i]|需要进一步测试|
|src/runtime/ui/settings-and-about.js:143|_v2SwitchView|switchView|需要进一步测试|
|src/runtime/ui/settings-navigation-compat.js:2|sc|document.querySelector("#view-settings .settings-scroll")|需要进一步测试|
|src/runtime/ui/settings-navigation-compat.js:13|original|[...sc.children]|需要进一步测试|
|src/runtime/ui/settings-navigation-compat.js:14|panes|{     function: document.createElement("div"),     sound: document.createElement("div"),     data: document.createElement("div"),     items: document.createElem|需要进一步测试|
|src/runtime/ui/settings-navigation-compat.js:24|mode|"function"|需要进一步测试|
|src/runtime/ui/settings-navigation-compat.js:26|txt|el.textContent ／／ ""|需要进一步测试|
|src/runtime/ui/settings-navigation-compat.js:42|tabs|document.createElement("div")|需要进一步测试|
|src/runtime/ui/settings-navigation-compat.js:48|ui|document.createElement("div")|需要进一步测试|
|src/runtime/ui/settings-navigation-compat.js:52|item|document.createElement("div")|需要进一步测试|
|src/runtime/ui/settings-navigation-compat.js:56|fx|document.createElement("div")|需要进一步测试|
|src/runtime/ui/settings-navigation-compat.js:60|hidden|document.createElement("input")|需要进一步测试|
|src/runtime/ui/settings-navigation-compat.js:86|sc|document.querySelector("#view-settings .settings-scroll")|需要进一步测试|
|src/runtime/ui/settings-navigation-compat.js:117|sub|document.querySelector("#view-settings .fullview-sub")|需要进一步测试|
|src/runtime/ui/settings-navigation-compat.js:130|h|(window.visualViewport && window.visualViewport.height) ／／     window.innerHeight|需要进一步测试|
|src/runtime/ui/theme-dialog.js:2|themeDialogResolveV21727|null|需要进一步测试|
|src/runtime/ui/theme-dialog.js:5|root|document.getElementById("themeDialogV21727")|需要进一步测试|
|src/runtime/ui/theme-dialog.js:9|resolve|themeDialogResolveV21727|需要进一步测试|
|src/runtime/ui/theme-dialog.js:15|root|document.getElementById("themeDialogV21727")|需要进一步测试|
|src/runtime/ui/theme-dialog.js:16|title|document.getElementById("themeDialogTitleV21727")|需要进一步测试|
|src/runtime/ui/theme-dialog.js:17|body|document.getElementById("themeDialogBodyV21727")|需要进一步测试|
|src/runtime/ui/theme-dialog.js:18|icon|document.getElementById("themeDialogIconV21727")|需要进一步测试|
|src/runtime/ui/theme-dialog.js:19|actions|document.getElementById("themeDialogActionsV21727")|需要进一步测试|
|src/runtime/ui/theme-dialog.js:26|prev|themeDialogResolveV21727|需要进一步测试|
|src/runtime/ui/theme-dialog.js:45|cancel|document.createElement("button")|需要进一步测试|
|src/runtime/ui/theme-dialog.js:52|ok|document.createElement("button")|需要进一步测试|
|src/runtime/ui/theme-dialog.js:60|ok|document.createElement("button")|需要进一步测试|
|src/runtime/ui/theme-dialog.js:83|root|document.getElementById("themeDialogV21727")|需要进一步测试|
|src/runtime/ui/toast.js:1|toastTimer|null|需要进一步测试|
|src/runtime/ui/toast.js:3|t|document.getElementById("toast")|需要进一步测试|
|src/runtime/ui/wallpaper.js:1|UI_DB_NAME|"PoliticsUiDB"|需要进一步测试|
|src/runtime/ui/wallpaper.js:2|uiDbPromise|null|需要进一步测试|
|src/runtime/ui/wallpaper.js:7|r|indexedDB.open(UI_DB_NAME, 1)|需要进一步测试|
|src/runtime/ui/wallpaper.js:9|d|e.target.result|需要进一步测试|
|src/runtime/ui/wallpaper.js:21|d|await uiDbOpen()|需要进一步测试|
|src/runtime/ui/wallpaper.js:25|tx|d.transaction("kv", mode)|需要进一步测试|
|src/runtime/ui/wallpaper.js:26|req|fn(tx.objectStore("kv"))|需要进一步测试|
|src/runtime/ui/wallpaper.js:35|wallpaperUrl|null|需要进一步测试|
|src/runtime/ui/wallpaper.js:37|v|Number(STORAGE.get("politics_wall_veil", 0.35))|需要进一步测试|
|src/runtime/ui/wallpaper.js:41|root|document.documentElement|需要进一步测试|
|src/runtime/ui/wallpaper.js:42|a|wallpaperUrl ? getWallVeil() : 0|需要进一步测试|
|src/runtime/ui/wallpaper.js:47|label|document.getElementById("wallVeilLabel")|需要进一步测试|
|src/runtime/ui/wallpaper.js:49|range|document.getElementById("cfgWallVeil")|需要进一步测试|
|src/runtime/ui/wallpaper.js:56|root|document.documentElement|需要进一步测试|
|src/runtime/ui/wallpaper.js:67|st|document.getElementById("wallpaperStatus")|需要进一步测试|
|src/runtime/ui/wallpaper.js:72|MAX_EDGE|2560|需要进一步测试|
|src/runtime/ui/wallpaper.js:73|img||需要进一步测试|
|src/runtime/ui/wallpaper.js:78|url|URL.createObjectURL(file)|需要进一步测试|
|src/runtime/ui/wallpaper.js:79|im|new Image()|需要进一步测试|
|src/runtime/ui/wallpaper.js:91|w0|img.width|需要进一步测试|
|src/runtime/ui/wallpaper.js:92|h0|img.height|需要进一步测试|
|src/runtime/ui/wallpaper.js:93|scale|Math.min(1, MAX_EDGE / Math.max(w0, h0))|需要进一步测试|
|src/runtime/ui/wallpaper.js:94|canvas|document.createElement("canvas")|需要进一步测试|
|src/runtime/ui/wallpaper.js:97|ctx|canvas.getContext("2d")|需要进一步测试|
|src/runtime/ui/wallpaper.js:105|file|input.files && input.files[0]|需要进一步测试|
|src/runtime/ui/wallpaper.js:114|blob|await compressWallpaper(file)|需要进一步测试|
|src/runtime/ui/wallpaper.js:116|saved|await uiDbReq("readwrite", (st) => st.put(blob, "wallpaper"))|需要进一步测试|
|src/runtime/ui/wallpaper.js:137|b|await uiDbReq("readonly", (st) => st.get("wallpaper"))|需要进一步测试|
|src/runtime/ui/welcome-score-sync.js:17|oldSwitchV216|switchView|需要进一步测试|
|src/runtime/ui/welcome-score-sync.js:19|r|oldSwitchV216.call(this, name)|需要进一步测试|
|src/runtime/ui/welcome-score-sync.js:29|d|ITEM_DEFS?.[key]|需要进一步测试|
|src/runtime/ui/welcome-score-sync.js:50|special|["coin_shell", "question", "question_block", "boo"]|需要进一步测试|
|src/runtime/ui/welcome-score-sync.js:52|heal|["coin_shell", "question", "question_block"].includes(             key,           )|需要进一步测试|
|src/runtime/ui/welcome-score-sync.js:71|caster|state.groups?.find((g) => g.id === casterId)|需要进一步测试|
|src/runtime/ui/welcome-score-sync.js:72|banner|document.createElement("div")|需要进一步测试|
|src/runtime/ui/welcome-score-sync.js:76|remove|() => banner.isConnected && banner.remove()|需要进一步测试|
|src/runtime/ui/window-visibility.js:9|commit|finish ／／ (() => root.classList.remove("active"))|需要进一步测试|
|src/ui/battle-card-view.js:2|GodPowerBattleCardView|Object.freeze({   render(g, state, { badge, escapeHtml, itemVisual, itemName, groupNumber }) {     const roundClass =       state.roundActive && !state.evaluate|需要进一步测试|
|src/ui/battle-card-view.js:4|roundClass|state.roundActive && !state.evaluated ? "" : "round-disabled"|需要进一步测试|
|src/ui/battle-card-view.js:6|optionsHtml|["A", "B", "C", "D"]       .map((opt) => {         let cls = "opt-btn";         if (g.selectedOpt === opt) cls += " active";         if (state.evaluated && g.se|需要进一步测试|
|src/ui/battle-card-view.js:8|cls|"opt-btn"|需要进一步测试|
|src/ui/battle-card-view.js:18|rawScore|g.displayScore !== undefined ? g.displayScore : g.score|需要进一步测试|
|src/ui/battle-card-view.js:19|editCls|state.isLocked ? "" : "editable"|需要进一步测试|
|src/ui/battle-card-view.js:20|scoreHtml|state.editingScoreId === g.id         ? <input type="number" class="score-input" id="input-score-${g.id}" value="${g.score}" onblur="finishDirectScoreEdit(${g.|需要进一步测试|
|src/ui/battle-card-view.js:24|allInClass|g.allIn ? "allin-toggle-btn active" : "allin-toggle-btn"|需要进一步测试|
|src/ui/battle-card-view.js:25|allInText|g.allIn ? "🔥 ALL IN" : "ALL IN"|需要进一步测试|
|src/ui/battle-card-view.js:27|slotsHtml|[0, 1, 2]       .map((i) => {         const it = g.inventory?.[i];         return it           ? <div class="item-slot ${i === 0 ? "queue-main-slot" : "queue-s|需要进一步测试|
|src/ui/battle-card-view.js:29|it|g.inventory?.[i]|需要进一步测试|
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
|src/ui/battle-grid.js:80|card|grid.querySelector(.group-row-card[data-group-id="${g.id}"])|需要进一步测试|
|src/ui/battle-grid.js:82|main|card.querySelector(".queue-main-slot")|需要进一步测试|
|src/ui/battle-grid.js:91|more|card.querySelector(".more-btn")|需要进一步测试|
|src/ui/battle-grid.js:102|auras|[]|需要进一步测试|
|src/ui/battle-grid.js:112|key||需要进一步测试|
|src/ui/battle-grid.js:115|a|document.createElement("div")|需要进一步测试|
|src/ui/battle-grid.js:127|input|document.getElementById(       input-score-${state.editingScoreId},     )|需要进一步测试|
|src/ui/battle-grid.js:140|moved|[]|需要进一步测试|
|src/ui/battle-grid.js:143|old|oldRects.get(String(card.dataset.groupId))|需要进一步测试|
|src/ui/battle-grid.js:145|now|card.getBoundingClientRect()|需要进一步测试|
|src/ui/battle-grid.js:146|dx|old.left - now.left|需要进一步测试|
|src/ui/battle-grid.js:147|dy|old.top - now.top|需要进一步测试|
|src/ui/battle-grid.js:185|ranks|new Map(ranking().map((g, i) => [g.id, i + 1]))|需要进一步测试|
|src/ui/battle-grid.js:189|id|Number(card.dataset.groupId)|需要进一步测试|
|src/ui/battle-grid.js:190|wrap|card.querySelector(".battle-group-heading")|需要进一步测试|
|src/ui/battle-grid.js:192|badge|wrap.querySelector(".rank-badge")|需要进一步测试|
|src/ui/battle-grid.js:199|sub|wrap.querySelector(".battle-group-subtitle")|需要进一步测试|
|src/ui/battle-grid.js:209|card|document.querySelector(         .group-row-card[data-group-id="${g.id}"],       )|需要进一步测试|
|src/ui/battle-grid.js:214|allIn|card.querySelector(".allin-toggle-btn")|需要进一步测试|
|src/ui/battle-grid.js:221|main|card.querySelector(".battle-main-item")|需要进一步测试|
|src/ui/battle-motion.js:2|BattleMotion|(() => {   const sessions = new Map(),     draws = new Map();   const duration = 1700,     fade = 600;   function enabled() {     const p = DesktopUI.getPrefere|需要进一步测试|
|src/ui/battle-motion.js:3|sessions|new Map()|需要进一步测试|
|src/ui/battle-motion.js:4|draws|new Map()|需要进一步测试|
|src/ui/battle-motion.js:5|duration|1700|需要进一步测试|
|src/ui/battle-motion.js:6|fade|600|需要进一步测试|
|src/ui/battle-motion.js:8|p|DesktopUI.getPreferences()|需要进一步测试|
|src/ui/battle-motion.js:20|node|document.createElement("div")|需要进一步测试|
|src/ui/battle-motion.js:26|badge|document.createElement("div")|需要进一步测试|
|src/ui/battle-motion.js:30|simple|DesktopUI.getPreferences().motion === "simple"|需要进一步测试|
|src/ui/battle-motion.js:34|wave|document.createElement("i")|需要进一步测试|
|src/ui/battle-motion.js:36|shards|document.createElement("i")|需要进一步测试|
|src/ui/battle-motion.js:38|n|0|需要进一步测试|
|src/ui/battle-motion.js:39|shard|document.createElement("u")|需要进一步测试|
|src/ui/battle-motion.js:66|id|String(gid) + ":" + kind|需要进一步测试|
|src/ui/battle-motion.js:67|prior|sessions.get(id)|需要进一步测试|
|src/ui/battle-motion.js:75|family|/fire/.test(key)       ? "fire"       : /ice/.test(key)         ? "ice"         : /lightning/.test(key)           ? "lightning"           : /green／red／spiny／she|需要进一步测试|
|src/ui/battle-motion.js:110|aliases|{       green: "green_shell",       red: "red_shell",       spiny: "spiny_shell",       horn: "super_horn",       bomb: "bob_omb",       mega: "giant_mushroom",|需要进一步测试|
|src/ui/battle-motion.js:120|color|kind === "defend"         ? "#249ad0"         : kind === "heal"           ? "#1caa73"           : CARD_HIT_COLOR[key] ／／             CARD_HIT_COLOR[aliases[key]|需要进一步测试|
|src/ui/battle-motion.js:128|session|{       id,       gid,       key,       kind,       family,       color,       label:         label ／／         (kind === "use"           ? "发动 · "           : k|需要进一步测试|
|src/ui/battle-motion.js:162|session||需要进一步测试|
|src/ui/battle-motion.js:168|draw|draws.get(String(gid))|需要进一步测试|
|src/ui/battle-motion.js:184|s||需要进一步测试|
|src/ui/battle-motion.js:190|node||需要进一步测试|
|src/ui/battle-motion.js:245|opacity|getComputedStyle(node).opacity|需要进一步测试|
|src/ui/classroom-avatar-display.js:5|urls|new Map()|需要进一步测试|
|src/ui/classroom-avatar-display.js:6|compactImages|new Map()|需要进一步测试|
|src/ui/classroom-avatar-display.js:7|compactGroups|new Map()|需要进一步测试|
|src/ui/classroom-avatar-display.js:8|contextKey|""|需要进一步测试|
|src/ui/classroom-avatar-display.js:9|avatarIndex|new Map()|需要进一步测试|
|src/ui/classroom-avatar-display.js:10|generation|0|需要进一步测试|
|src/ui/classroom-avatar-display.js:14|value|JSON.parse(         root.localStorage.getItem("godpower_active_classroom_context_v1") ／／           "null",       )|需要进一步测试|
|src/ui/classroom-avatar-display.js:31|url||需要进一步测试|
|src/ui/classroom-avatar-display.js:39|canvas|root.document.createElement("canvas")|需要进一步测试|
|src/ui/classroom-avatar-display.js:42|context|canvas.getContext("2d")|需要进一步测试|
|src/ui/classroom-avatar-display.js:46|scale|Math.max(width / source.width, height / source.height)|需要进一步测试|
|src/ui/classroom-avatar-display.js:47|drawWidth|source.width * scale|需要进一步测试|
|src/ui/classroom-avatar-display.js:48|drawHeight|source.height * scale|需要进一步测试|
|src/ui/classroom-avatar-display.js:61|imageGeneration|generation|需要进一步测试|
|src/ui/classroom-avatar-display.js:62|pending|(async () => {       try {         const image = new Image();         image.src = url;         if (typeof image.decode === "function") await image.decode();    |需要进一步测试|
|src/ui/classroom-avatar-display.js:64|image|new Image()|需要进一步测试|
|src/ui/classroom-avatar-display.js:85|context|currentContext()|需要进一步测试|
|src/ui/classroom-avatar-display.js:86|nextKey|context       ? ${context.userProfileId}\u0000${context.classroomId}       : ""|需要进一步测试|
|src/ui/classroom-avatar-display.js:95|indexGeneration|generation|需要进一步测试|
|src/ui/classroom-avatar-display.js:97|repository|root.ClassroomRosterRepository.createClassroomRosterRepository({         storage: root.localStorage,       })|需要进一步测试|
|src/ui/classroom-avatar-display.js:101|saved|repository.read()|需要进一步测试|
|src/ui/classroom-avatar-display.js:103|roster|saved.rosterData|需要进一步测试|
|src/ui/classroom-avatar-display.js:104|assignment|roster.assignments.find(       (entry) =>         entry.userProfileId === context.userProfileId &&         entry.classroomId === context.classroomId,     )|需要进一步测试|
|src/ui/classroom-avatar-display.js:111|students|new Map(       roster.students.map((student) => [student.studentUid, student]),     )|需要进一步测试|
|src/ui/classroom-avatar-display.js:114|byGroup|new Map()|需要进一步测试|
|src/ui/classroom-avatar-display.js:115|item||需要进一步测试|
|src/ui/classroom-avatar-display.js:116|student|students.get(item.studentUid)|需要进一步测试|
|src/ui/classroom-avatar-display.js:118|entries|byGroup.get(item.groupUid) ／／ []|需要进一步测试|
|src/ui/classroom-avatar-display.js:127|resourceIds|new Set()|需要进一步测试|
|src/ui/classroom-avatar-display.js:128|entries||需要进一步测试|
|src/ui/classroom-avatar-display.js:129|entry||需要进一步测试|
|src/ui/classroom-avatar-display.js:133|resourceRepository||需要进一步测试|
|src/ui/classroom-avatar-display.js:143|resource|await resourceRepository.get(resourceId)|需要进一步测试|
|src/ui/classroom-avatar-display.js:165|entries|avatarIndex.get(group?.groupUid) ／／ []|需要进一步测试|
|src/ui/classroom-avatar-display.js:166|matchIndex|0|需要进一步测试|
|src/ui/classroom-avatar-display.js:167|entry||需要进一步测试|
|src/ui/classroom-avatar-display.js:176|entries|avatarIndex.get(group?.groupUid) ／／ []|需要进一步测试|
|src/ui/classroom-avatar-display.js:177|seen|new Set()|需要进一步测试|
|src/ui/classroom-avatar-display.js:178|result|[]|需要进一步测试|
|src/ui/classroom-avatar-display.js:179|entry||需要进一步测试|
|src/ui/classroom-avatar-display.js:180|url|entry.resourceId ? urls.get(entry.resourceId) : ""|需要进一步测试|
|src/ui/classroom-avatar-display.js:190|cached|compactGroups.get(group?.groupUid)|需要进一步测试|
|src/ui/classroom-avatar-display.js:192|images|groupUrls(group)|需要进一步测试|
|src/ui/classroom-avatar-display.js:194|imageGeneration|generation|需要进一步测试|
|src/ui/classroom-avatar-display.js:195|pending|(async () => {       const sources = await Promise.all(         images.map(async (url) => {           const image = new Image();           image.src = url;     |需要进一步测试|
|src/ui/classroom-avatar-display.js:196|sources|await Promise.all(         images.map(async (url) => {           const image = new Image();           image.src = url;           if (typeof image.decode === "fu|需要进一步测试|
|src/ui/classroom-avatar-display.js:198|image|new Image()|需要进一步测试|
|src/ui/classroom-avatar-display.js:209|canvas|root.document.createElement("canvas")|需要进一步测试|
|src/ui/classroom-avatar-display.js:212|context|canvas.getContext("2d")|需要进一步测试|
|src/ui/classroom-avatar-display.js:216|cell|sources.length === 1 ? 256 : 127|需要进一步测试|
|src/ui/classroom-avatar-display.js:218|x|sources.length === 1 ? 0 : (index % 2) * 129|需要进一步测试|
|src/ui/classroom-avatar-display.js:219|y|sources.length === 1 ? 0 : Math.floor(index / 2) * 129|需要进一步测试|
|src/ui/classroom-avatar-display.js:220|scale|Math.max(cell / image.width, cell / image.height)|需要进一步测试|
|src/ui/classroom-avatar-display.js:221|width|image.width * scale|需要进一步测试|
|src/ui/classroom-avatar-display.js:222|height|image.height * scale|需要进一步测试|
|src/ui/classroom-avatar-display.js:247|url|studentUrl(group, name, occurrence)|需要进一步测试|
|src/ui/classroom-avatar-display.js:248|value|url ? compactImages.get(url) : ""|需要进一步测试|
|src/ui/classroom-avatar-display.js:253|value|compactGroups.get(group?.groupUid)|需要进一步测试|
|src/ui/classroom-avatar-display.js:258|taskGeneration|generation|需要进一步测试|
|src/ui/classroom-avatar-display.js:260|group||需要进一步测试|
|src/ui/classroom-avatar-display.js:262|card|root.document.querySelector(         .group-row-card[data-group-id="${CSS.escape(String(group.id))}"],       )|需要进一步测试|
|src/ui/classroom-avatar-display.js:265|badge|card?.querySelector(".battle-group-number")|需要进一步测试|
|src/ui/classroom-avatar-display.js:270|image|root.document.createElement("img")|需要进一步测试|
|src/ui/classroom-avatar-display.js:275|number|root.document.createElement("span")|需要进一步测试|
|src/ui/classroom-avatar-display.js:283|group||需要进一步测试|
|src/ui/classroom-avatar-display.js:285|card|root.document.querySelector(           .group-row-card[data-group-id="${CSS.escape(String(group.id))}"],         )|需要进一步测试|
|src/ui/classroom-avatar-display.js:288|badge|card?.querySelector(".battle-group-number")|需要进一步测试|
|src/ui/classroom-avatar-display.js:290|images|groupUrls(group)|需要进一步测试|
|src/ui/classroom-avatar-display.js:295|stack|root.document.createElement("span")|需要进一步测试|
|src/ui/classroom-avatar-display.js:298|url||需要进一步测试|
|src/ui/classroom-avatar-display.js:299|image|root.document.createElement("img")|需要进一步测试|
|src/ui/classroom-avatar-display.js:305|number|root.document.createElement("span")|需要进一步测试|
|src/ui/classroom-avatar-display.js:315|imageUrl|studentName       ? studentUrl(group, studentName, occurrence)       : groupUrls(group)[0] ／／ ""|需要进一步测试|
|src/ui/classroom-avatar-display.js:319|wrapper|root.document.createElement("span")|需要进一步测试|
|src/ui/classroom-avatar-display.js:321|label|root.document.createElement("span")|需要进一步测试|
|src/ui/classroom-avatar-display.js:323|parsed|root.parseStudentV218(studentName)|需要进一步测试|
|src/ui/classroom-avatar-display.js:325|number|root.document.createElement("span")|需要进一步测试|
|src/ui/classroom-avatar-display.js:331|name|root.document.createElement("span")|需要进一步测试|
|src/ui/classroom-avatar-display.js:337|image|root.document.createElement("img")|需要进一步测试|
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
|src/ui/classroom-feedback.js:147|soundSlot|type === "pick"         ? "fullscreen_pick"         : type === "positive"           ? "fullscreen_score_add"           : "fullscreen_score_sub"|需要进一步测试|
|src/ui/classroom-feedback.js:169|root|dialog()|需要进一步测试|
|src/ui/classroom-feedback.js:171|serial|generation|需要进一步测试|
|src/ui/classroom-feedback.js:183|avatarStack|root.querySelector(".cf-show-avatar-stack")|需要进一步测试|
|src/ui/classroom-feedback.js:185|src||需要进一步测试|
|src/ui/classroom-feedback.js:187|image|document.createElement("img")|需要进一步测试|
|src/ui/classroom-feedback.js:194|particles|root.querySelector(".cf-show-particles")|需要进一步测试|
|src/ui/classroom-feedback.js:195|simple|DesktopUI.getPreferences().motion === "simple"|需要进一步测试|
|src/ui/classroom-feedback.js:197|i|0|需要进一步测试|
|src/ui/classroom-feedback.js:198|dot|document.createElement("i")|需要进一步测试|
|src/ui/classroom-feedback.js:199|angle|(i / 24) * Math.PI * 2|需要进一步测试|
|src/ui/classroom-feedback.js:210|toast|document.getElementById("toast")|需要进一步测试|
|src/ui/classroom-feedback.js:231|group|mode === "group" ? win : win.group|需要进一步测试|
|src/ui/classroom-feedback.js:232|student|mode === "group" ? null : parseStudentV218(win.memberName)|需要进一步测试|
|src/ui/classroom-feedback.js:258|v|options[e.dataset.cfOption]|需要进一步测试|
|src/ui/classroom-feedback.js:284|values|[...document.querySelectorAll("[data-cf-slot]")].map(           (x) => (x.value.trim() === "" ? NaN : Number(x.value)),         )|需要进一步测试|
|src/ui/classroom-feedback.js:313|clickEvent|null|需要进一步测试|
|src/ui/classroom-feedback.js:314|clickClaimed|false|需要进一步测试|
|src/ui/classroom-feedback.js:315|clickPreview|false|需要进一步测试|
|src/ui/classroom-feedback.js:316|clickCleanup|null|需要进一步测试|
|src/ui/classroom-feedback.js:326|clickVoice|null|需要进一步测试|
|src/ui/classroom-feedback.js:338|voice|{ source, gain }|需要进一步测试|
|src/ui/classroom-feedback.js:350|button|e.target.closest?.(           "button,summary,[role=button],input[type=button],input[type=submit]",         )|需要进一步测试|
|src/ui/classroom-feedback.js:373|saved|localStorage.getItem(KEY)|需要进一步测试|
|src/ui/classroom-feedback.js:411|pre|state.picker.preselectedGroupIds ／／ []|需要进一步测试|
|src/ui/classroom-feedback.js:412|groups|state.picker.mode === "two_tier"         ? state.groups.filter(             (g) => g.members?.length && (!pre.length ／／ pre.includes(g.id)),           )        |需要进一步测试|
|src/ui/classroom-feedback.js:430|[frame, live]||需要进一步测试|
|src/ui/classroom-feedback.js:444|rows|candidates(frame)|需要进一步测试|
|src/ui/classroom-feedback.js:446|actual|frame.querySelector(".slot-reel-text")|需要进一步测试|
|src/ui/classroom-feedback.js:447|height|frame.clientHeight|需要进一步测试|
|src/ui/classroom-feedback.js:448|strip|document.createElement("div")|需要进一步测试|
|src/ui/classroom-feedback.js:451|candidate||需要进一步测试|
|src/ui/classroom-feedback.js:452|row|document.createElement("span")|需要进一步测试|
|src/ui/classroom-feedback.js:457|visibility|actual.style.visibility|需要进一步测试|
|src/ui/classroom-feedback.js:460|animation|strip.animate(           [             { transform: "translateY(0)" },             { transform: translateY(-${height * rows.length}px) },           ],        |需要进一步测试|
|src/ui/classroom-feedback.js:482|live|liveReels.get(frame)|需要进一步测试|
|src/ui/classroom-feedback.js:484|phase|((Number(live.animation.currentTime) ／／ 0) / 100) % live.rows.length|需要进一步测试|
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
|src/ui/classroom-roster-workspace.js:37|LIVE_COPY_BASE_V2200|"当前课堂副本"|需要进一步测试|
|src/ui/classroom-roster-workspace.js:42|used|new Set((doc?.classrooms ／／ []).map((c) => c.name))|需要进一步测试|
|src/ui/classroom-roster-workspace.js:44|n|2|需要进一步测试|
|src/ui/classroom-roster-workspace.js:45|name|${LIVE_COPY_BASE_V2200} ${n}|需要进一步测试|
|src/ui/classroom-roster-workspace.js:53|cloneOf|(value) => JSON.parse(JSON.stringify(value))|需要进一步测试|
|src/ui/classroom-roster-workspace.js:54|merged|cloneOf(existing)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:55|profile||需要进一步测试|
|src/ui/classroom-roster-workspace.js:60|classroom||需要进一步测试|
|src/ui/classroom-roster-workspace.js:65|student||需要进一步测试|
|src/ui/classroom-roster-workspace.js:68|assignment||需要进一步测试|
|src/ui/classroom-roster-workspace.js:78|repository|root.ClassroomRosterRepository.createClassroomRosterRepository({         storage,       })|需要进一步测试|
|src/ui/classroom-roster-workspace.js:82|section|document.createElement("section")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:88|profileSelect|section.querySelector("#rosterProfileSelect")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:89|classroomSelect|section.querySelector("#rosterClassroomSelect")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:90|modeSelect|document.createElement("select")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:95|modeLabel|document.createElement("label")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:100|addClassroom|text("button", "新增课堂", "btn")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:109|classroomForm|document.createElement("div")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:116|rows|section.querySelector("#rosterStudentRows")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:117|status|section.querySelector("#rosterStatus")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:118|documentData|null|需要进一步测试|
|src/ui/classroom-roster-workspace.js:119|revision|0|需要进一步测试|
|src/ui/classroom-roster-workspace.js:120|selectedProfile|""|需要进一步测试|
|src/ui/classroom-roster-workspace.js:121|selectedClassroom|""|需要进一步测试|
|src/ui/classroom-roster-workspace.js:122|activeClassroomContext|null|需要进一步测试|
|src/ui/classroom-roster-workspace.js:123|avatarRepositoryPromise|null|需要进一步测试|
|src/ui/classroom-roster-workspace.js:124|avatarObjectUrls|new Set()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:131|url||需要进一步测试|
|src/ui/classroom-roster-workspace.js:137|avatar|await (           await getAvatarRepository()         ).get(student.avatarResourceId)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:147|objectUrl|URL.createObjectURL(avatar.blob)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:160|savedContext|JSON.parse(         storage.getItem("godpower_active_classroom_context_v1") ／／ "null",       )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:178|result|repository.write(next, { expectedRevision: revision })|需要进一步测试|
|src/ui/classroom-roster-workspace.js:184|fresh|repository.read()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:201|assignment|documentData.assignments.find(         (item) =>           item.userProfileId === profileId && item.classroomId === classroomId,       )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:219|classroom|documentData?.classrooms.find(         (item) => item.classroomId === selectedClassroom,       )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:223|studentMap|new Map(         documentData.students.map((student) => [student.studentUid, student]),       )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:226|assignment|assignmentFor(selectedProfile, selectedClassroom)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:228|assigned|new Map(         assignment.groupAssignments.map((item) => [           item.studentUid,           item.groupUid,         ]),       )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:234|groups|getGroups().map((group, index) => ({         id: group.groupUid,         label: group.name ／／ 第 ${index + 1} 组,       }))|需要进一步测试|
|src/ui/classroom-roster-workspace.js:238|studentUid||需要进一步测试|
|src/ui/classroom-roster-workspace.js:239|student|studentMap.get(studentUid)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:241|row|document.createElement("tr")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:243|nameCell|document.createElement("td")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:244|name|document.createElement("input")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:250|groupCell|document.createElement("td")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:251|group|document.createElement("select")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:255|item||需要进一步测试|
|src/ui/classroom-roster-workspace.js:263|avatarCell|document.createElement("td")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:264|avatarEditor|document.createElement("div")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:266|avatar|document.createElement("img")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:271|placeholder|text(           "span",           student.displayName.trim().slice(0, 1) ／／ "?",           "roster-avatar-placeholder",         )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:277|upload|document.createElement("input")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:284|file|upload.files?.[0]|需要进一步测试|
|src/ui/classroom-roster-workspace.js:298|avatarRepo||需要进一步测试|
|src/ui/classroom-roster-workspace.js:299|createdResourceId|""|需要进一步测试|
|src/ui/classroom-roster-workspace.js:301|stored|repository.read()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:304|rosterBytes|storage.getItem(repository.key)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:305|existingDocument|documentData|需要进一步测试|
|src/ui/classroom-roster-workspace.js:307|draft||需要进一步测试|
|src/ui/classroom-roster-workspace.js:315|profileId|selectedProfile|需要进一步测试|
|src/ui/classroom-roster-workspace.js:316|classroomId|selectedClassroom|需要进一步测试|
|src/ui/classroom-roster-workspace.js:317|studentRecord|stored.rosterData.students.find(               (item) => item.studentUid === studentUid,             )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:323|bytes|new Uint8Array(await file.arrayBuffer())|需要进一步测试|
|src/ui/classroom-roster-workspace.js:324|digest|[               ...new Uint8Array(                 await root.crypto.subtle.digest("SHA-256", bytes),               ),             ]               .map((value) |需要进一步测试|
|src/ui/classroom-roster-workspace.js:331|existingAvatar|(               await avatarRepo.list({                 profileId,                 classroomId,                 subjectId: "student-avatar",               })   |需要进一步测试|
|src/ui/classroom-roster-workspace.js:338|resourceId||需要进一步测试|
|src/ui/classroom-roster-workspace.js:341|[created]|await avatarRepo.addBatch([                 {                   file,                   profileId,                   classroomId,                   subjectId: "|需要进一步测试|
|src/ui/classroom-roster-workspace.js:354|latestRoster|repository.read()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:363|next|clone(stored.rosterData)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:364|target|next.students.find(               (item) => item.studentUid === studentUid,             )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:369|result|repository.write(next, {               expectedRevision: stored.revision,             })|需要进一步测试|
|src/ui/classroom-roster-workspace.js:397|uploadLabel|text(           "label",           student.avatarResourceId ? "更换图片" : "选择图片",           "btn btn-sm roster-avatar-label",         )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:405|clearAvatar|text("button", "清除", "btn btn-sm")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:412|next|clone(documentData)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:413|target|next.students.find(               (item) => item.studentUid === studentUid,             )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:424|actionCell|document.createElement("td")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:425|remove|text("button", "移除", "btn btn-sm btn-danger")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:447|read|repository.read()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:457|profile||需要进一步测试|
|src/ui/classroom-roster-workspace.js:461|classroom||需要进一步测试|
|src/ui/classroom-roster-workspace.js:487|hasRoster|Boolean(selectedProfile && selectedClassroom)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:498|classroom|documentData.classrooms.find(         (item) => item.classroomId === selectedClassroom,       )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:501|assignment|assignmentFor(selectedProfile, selectedClassroom)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:503|names|new Map()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:504|memberships|new Map()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:505|row||需要进一步测试|
|src/ui/classroom-roster-workspace.js:506|studentUid|row.dataset.studentUid|需要进一步测试|
|src/ui/classroom-roster-workspace.js:507|displayName|row.querySelector("input").value.trim()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:510|groupUid|row.querySelector("select").value|需要进一步测试|
|src/ui/classroom-roster-workspace.js:535|saved|repository.read()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:538|currentDraft|clone(documentData)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:539|existingDocument|documentData|需要进一步测试|
|src/ui/classroom-roster-workspace.js:541|draft||需要进一步测试|
|src/ui/classroom-roster-workspace.js:549|ids|[           ...new Set(             saved.rosterData.students               .map((student) => student.avatarResourceId)               .filter(Boolean),         |需要进一步测试|
|src/ui/classroom-roster-workspace.js:556|assets|[]|需要进一步测试|
|src/ui/classroom-roster-workspace.js:557|totalBytes|0|需要进一步测试|
|src/ui/classroom-roster-workspace.js:559|avatarRepo|await getAvatarRepository()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:560|resourceId||需要进一步测试|
|src/ui/classroom-roster-workspace.js:561|asset|await avatarRepo.get(resourceId)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:573|bytes|new Uint8Array(await asset.blob.arrayBuffer())|需要进一步测试|
|src/ui/classroom-roster-workspace.js:579|{ blob, ...metadata }|asset|需要进一步测试|
|src/ui/classroom-roster-workspace.js:583|backup|{           format: AVATAR_BACKUP_FORMAT,           schemaVersion: 1,           exportedAt: new Date().toISOString(),           rosterData: saved.rosterData,   |需要进一步测试|
|src/ui/classroom-roster-workspace.js:590|payload|JSON.stringify(backup, null, 2)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:591|link|document.createElement("a")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:614|rosterData|root.ClassroomRoster.validateRosterDocument(         parsed.rosterData,       )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:619|referenced|new Set(         rosterData.students           .map((student) => student.avatarResourceId)           .filter(Boolean),       )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:624|avatarIds|new Set()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:625|profileIds|new Set(         rosterData.profiles.map((profile) => profile.userProfileId),       )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:628|classroomById|new Map(         rosterData.classrooms.map((classroom) => [           classroom.classroomId,           classroom,         ]),       )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:634|prepared|[]|需要进一步测试|
|src/ui/classroom-roster-workspace.js:635|totalBytes|0|需要进一步测试|
|src/ui/classroom-roster-workspace.js:636|entry||需要进一步测试|
|src/ui/classroom-roster-workspace.js:652|bytes|fromBase64(entry.bytesBase64)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:658|ownerMatch|rosterData.students.some(           (student) =>             student.avatarResourceId === entry.resourceId &&             student.classroomId === entry.classroo|需要进一步测试|
|src/ui/classroom-roster-workspace.js:666|metadata|root.TeachingResource.validateFile(           {             ...entry,             byteSize: bytes.byteLength,             schemaVersion: 1,           },        |需要进一步测试|
|src/ui/classroom-roster-workspace.js:680|avatarRepo|await getAvatarRepository()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:681|existing|await avatarRepo.list()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:682|existingById|new Map(         existing.map((item) => [item.resourceId, item]),       )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:685|existingByHash|new Map(         existing.map((item) => [item.sha256, item]),       )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:688|importedByHash|new Map()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:689|mapping|new Map()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:690|toCreate|[]|需要进一步测试|
|src/ui/classroom-roster-workspace.js:691|item||需要进一步测试|
|src/ui/classroom-roster-workspace.js:692|{ metadata, bytes }|item|需要进一步测试|
|src/ui/classroom-roster-workspace.js:693|sameId|existingById.get(metadata.resourceId)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:695|record|await avatarRepo.get(metadata.resourceId)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:707|sameHash|existingByHash.get(metadata.sha256)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:717|batchDuplicate|importedByHash.get(metadata.sha256)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:724|resourceId|sameId           ? root.StableIdentity.createResourceId()           : metadata.resourceId|需要进一步测试|
|src/ui/classroom-roster-workspace.js:727|finalMetadata|root.TeachingResource.validateFile(           { ...metadata, resourceId },           bytes,         )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:731|file|new File([bytes], finalMetadata.fileName, {           type: finalMetadata.mimeType,         })|需要进一步测试|
|src/ui/classroom-roster-workspace.js:752|createdResources|toCreate.length         ? await avatarRepo.addBatch(toCreate)         : []|需要进一步测试|
|src/ui/classroom-roster-workspace.js:755|student||需要进一步测试|
|src/ui/classroom-roster-workspace.js:762|avatarRepo|await getAvatarRepository()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:763|failures|[]|需要进一步测试|
|src/ui/classroom-roster-workspace.js:764|resource||需要进一步测试|
|src/ui/classroom-roster-workspace.js:775|initialBytes|storage.getItem(repository.key)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:776|initial|repository.read()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:779|result|await importRosterBackup(parsed)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:781|latest|repository.read()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:788|saved|repository.write(result.rosterData, {           expectedRevision: initial.revision,         })|需要进一步测试|
|src/ui/classroom-roster-workspace.js:807|overlay|document.getElementById("rosterApplyPreview")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:824|persisted|repository.read()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:829|workingRoster||需要进一步测试|
|src/ui/classroom-roster-workspace.js:831|liveDocument|documentData|需要进一步测试|
|src/ui/classroom-roster-workspace.js:844|liveGroups|getGroups()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:845|plan|root.ClassroomRoster.planCompetitionMemberUpdate({           groups: liveGroups,           rosterData: persisted.rosterData,           userProfileId: selectedPr|需要进一步测试|
|src/ui/classroom-roster-workspace.js:855|stateFingerprint|JSON.stringify(state)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:856|stateReference|state|需要进一步测试|
|src/ui/classroom-roster-workspace.js:857|selection|{           profileId: selectedProfile,           classroomId: selectedClassroom,         }|需要进一步测试|
|src/ui/classroom-roster-workspace.js:861|rosterBytes|storage.getItem(repository.key)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:862|snapshot|Object.freeze({           plan,           stateFingerprint,           stateReference,           seasonId: state.seasonId,           selection,           rosterB|需要进一步测试|
|src/ui/classroom-roster-workspace.js:872|overlay|document.createElement("div")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:878|changed|plan.groupChanges.filter((item) => item.changed)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:879|rowsHtml|plan.groupChanges           .map(             (item) =>               <tr><th>${root.escapeHtml(item.groupName)}</th><td>${root.escapeHtml(item.before.join("、"|需要进一步测试|
|src/ui/classroom-roster-workspace.js:887|closeButton|overlay.querySelector("#rosterApplyClose")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:893|onKeydown|(event) => {           if (             event.key === "Escape" &&             document.getElementById("rosterApplyPreview") === overlay           ) {           |需要进一步测试|
|src/ui/classroom-roster-workspace.js:909|confirmButton|event.currentTarget|需要进一步测试|
|src/ui/classroom-roster-workspace.js:912|confirmed|await root.themeConfirm(             即将更新 ${changed.length} 个小组的成员名单。比赛积分、道具与回合状态不变，且本次操作可从历史撤销。,             {               title: "确认应用课堂名单",              |需要进一步测试|
|src/ui/classroom-roster-workspace.js:927|latest|repository.read()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:928|stillCurrent|() =>             state === snapshot.stateReference &&             state.seasonId === snapshot.seasonId &&             JSON.stringify(state) === snapshot.stateF|需要进一步测试|
|src/ui/classroom-roster-workspace.js:945|accepted|runClassroomCommand(             应用课堂名单：${documentData.classrooms.find((item) => item.classroomId === selectedClassroom)?.name ／／ "课堂"},             () => {  |需要进一步测试|
|src/ui/classroom-roster-workspace.js:948|currentRoster|repository.read()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:956|change||需要进一步测试|
|src/ui/classroom-roster-workspace.js:957|group|state.groups.find(                   (item) => item.groupUid === change.groupUid,                 )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:971|outcome|await classroomCommands.whenIdle()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:999|assignment|assignmentFor(selectedProfile, selectedClassroom)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:1010|groups|root.StableIdentity.assignGroupUids(getGroups())|需要进一步测试|
|src/ui/classroom-roster-workspace.js:1011|existing|documentData.profiles.length ／／ documentData.classrooms.length|需要进一步测试|
|src/ui/classroom-roster-workspace.js:1013|migrated|repository.previewMigration({           classroomId: root.StableIdentity.createClassroomId(),           userProfileId: root.StableIdentity.createUserProfileId()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:1029|merged|mergeLiveCopyV2200(documentData, migrated)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:1050|name|section.querySelector("#rosterClassroomName").value.trim()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:1052|next|clone(documentData)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:1053|classroomId|root.StableIdentity.createClassroomId()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:1072|name|section.querySelector("#rosterProfileName").value.trim()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:1074|next|clone(documentData)|需要进一步测试|
|src/ui/classroom-roster-workspace.js:1075|userProfileId|root.StableIdentity.createUserProfileId()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:1092|classroom|documentData.classrooms.find(         (item) => item.classroomId === selectedClassroom,       )|需要进一步测试|
|src/ui/classroom-roster-workspace.js:1096|studentUid|root.StableIdentity.createStudentUid()|需要进一步测试|
|src/ui/classroom-roster-workspace.js:1106|added|rows.lastElementChild?.querySelector("input")|需要进一步测试|
|src/ui/classroom-roster-workspace.js:1121|file|event.target.files?.[0]|需要进一步测试|
|src/ui/classroom-roster-workspace.js:1126|parsed|JSON.parse(await file.text())|需要进一步测试|
|src/ui/classroom-roster-workspace.js:1136|importedResources|await commitRosterImport(parsed)|需要进一步测试|
|src/ui/component-catalog.js:2|GodPowerComponentCatalog|{   schemaVersion: 1,   animations: [     {       name: "attackHitBadge",       sources: ["src/styles/items/attack-feedback.css"],     },     {       name: "aur|需要进一步测试|
|src/ui/component-library.js:2|UIComponentLibrary|(() => {   const definitions = [     [       "buttons",       "基础控件",       "按钮与危险操作",       ".btn",       "ui/application-surfaces.css",       "buttons",     ]|需要进一步测试|
|src/ui/component-library.js:3|definitions|[     [       "buttons",       "基础控件",       "按钮与危险操作",       ".btn",       "ui/application-surfaces.css",       "buttons",     ],     [       "inputs",       "|需要进一步测试|
|src/ui/component-library.js:307|home|[     ["core.group-count", "参赛小组"],     ["core.total-score", "班级总积分"],     ["core.top-score", "最高小组积分"],     ["core.leading-group", "当前领跑"],     ["core.live-ran|需要进一步测试|
|src/ui/component-library.js:326|conflicts|[     {       id: "switch-skin",       category: "已统一",       name: "旧渐变轨道与新扁平开关",       description:         "保留现行扁平配色、52×28内容区和同一边框；旧v292结构只做兼容，不再维护另一套渐变皮肤。",|需要进一步测试|
|src/ui/component-library.js:356|settings|GodPowerSettingsLayout.categories.map(([id, , name]) => ({     id: "settings-" + id,     category: "设置分类",     name,     selector: [data-category-panel="${id}"|需要进一步测试|
|src/ui/component-library.js:363|expandedPreview|false|需要进一步测试|
|src/ui/component-library.js:364|root|null|需要进一步测试|
|src/ui/component-library.js:365|shadow|null|需要进一步测试|
|src/ui/component-library.js:366|selected|null|需要进一步测试|
|src/ui/component-library.js:367|mode|"components"|需要进一步测试|
|src/ui/component-library.js:368|previewTheme|"current"|需要进一步测试|
|src/ui/component-library.js:369|styleCache|null|需要进一步测试|
|src/ui/component-library.js:370|nodeEntries|[]|需要进一步测试|
|src/ui/component-library.js:371|$|(selector) => root?.querySelector(selector)|需要进一步测试|
|src/ui/component-library.js:372|create|(tag, text, className) => {     const n = document.createElement(tag);     if (text !== undefined) n.textContent = text;     if (className) n.className = classN|需要进一步测试|
|src/ui/component-library.js:373|n|document.createElement(tag)|需要进一步测试|
|src/ui/component-library.js:378|entries|() => {     if (mode === "styles")       return GodPowerComponentCatalog.classes.map((x) => ({         ...x,         id: "class-" + x.name,         name: "." + |需要进一步测试|
|src/ui/component-library.js:403|items|Object.entries(ITEM_DEFS).map(([key, item]) => ({       id: "item-" + key,       name: item.name,       category: "26种道具",       sources: ["src/runtime/items/de|需要进一步测试|
|src/ui/component-library.js:428|blocked|/^(SCRIPT／IFRAME／OBJECT／EMBED／LINK／STYLE／AUDIO／VIDEO／SOURCE／BASE／META／FOREIGNOBJECT／ANIMATE／SET／ANIMATEMOTION／ANIMATETRANSFORM)$/i|需要进一步测试|
|src/ui/component-library.js:436|node||需要进一步测试|
|src/ui/component-library.js:441|attr||需要进一步测试|
|src/ui/component-library.js:480|url|(quoted ?? raw ?? "").trim()|需要进一步测试|
|src/ui/component-library.js:487|parts|[]|需要进一步测试|
|src/ui/component-library.js:488|style||需要进一步测试|
|src/ui/component-library.js:499|node|entry.selector       ? [...document.querySelectorAll(entry.selector)].find(           (n) => !n.closest("#componentLibraryModal"),         )       : null|需要进一步测试|
|src/ui/component-library.js:506|tree|node.cloneNode(true)|需要进一步测试|
|src/ui/component-library.js:508|originals|[node, ...node.querySelectorAll("input,textarea,select")]|需要进一步测试|
|src/ui/component-library.js:509|copies|[tree, ...tree.querySelectorAll("input,textarea,select")]|需要进一步测试|
|src/ui/component-library.js:511|copy|copies[i]|需要进一步测试|
|src/ui/component-library.js:521|details||需要进一步测试|
|src/ui/component-library.js:533|parent|node.parentElement|需要进一步测试|
|src/ui/component-library.js:539|wrapper|parent.cloneNode(false)|需要进一步测试|
|src/ui/component-library.js:557|wrap|create("section")|需要进一步测试|
|src/ui/component-library.js:575|item|ITEM_DEFS[entry.key]|需要进一步测试|
|src/ui/component-library.js:576|src|Reliability.safeImage(state.itemGlobal?.customIcons?.[entry.key]) ／／         BUILTIN_ITEM_ICONS_V2121[entry.key]|需要进一步测试|
|src/ui/component-library.js:580|image|create("img")|需要进一步测试|
|src/ui/component-library.js:612|host|create("div", undefined, "component-library-preview")|需要进一步测试|
|src/ui/component-library.js:616|style|create("style")|需要进一步测试|
|src/ui/component-library.js:618|html|document.createElement("html")|需要进一步测试|
|src/ui/component-library.js:619|body|document.createElement("body")|需要进一步测试|
|src/ui/component-library.js:621|[key, value]||需要进一步测试|
|src/ui/component-library.js:623|theme|previewTheme === "current" ? GodpowerTheme.get() : previewTheme|需要进一步测试|
|src/ui/component-library.js:627|source|entry.sample && entry.sample !== "class"         ? sample(entry)         : liveSample(entry) ／／ sample(entry)|需要进一步测试|
|src/ui/component-library.js:649|panel|$("#componentLibraryDetail")|需要进一步测试|
|src/ui/component-library.js:662|value|getComputedStyle(document.body)         .getPropertyValue(entry.name)         .trim()|需要进一步测试|
|src/ui/component-library.js:666|card|create(         "p",         value ／／ "当前主题或组件上下文尚未解析。",         "component-library-note",       )|需要进一步测试|
|src/ui/component-library.js:672|swatch|create("span", undefined, "component-library-swatch")|需要进一步测试|
|src/ui/component-library.js:680|button||需要进一步测试|
|src/ui/component-library.js:687|query|$("#componentLibrarySearch").value.trim().toLowerCase()|需要进一步测试|
|src/ui/component-library.js:688|list|entries().filter((e) =>       [e.name, e.category, ...(e.sources ／／ [])]         .join(" ")         .toLowerCase()         .includes(query),     )|需要进一步测试|
|src/ui/component-library.js:694|fragment|document.createDocumentFragment()|需要进一步测试|
|src/ui/component-library.js:695|entry||需要进一步测试|
|src/ui/component-library.js:696|button|create("button")|需要进一步测试|
|src/ui/component-library.js:782|details|create("details", undefined, "ui-settings-disclosure")|需要进一步测试|
|src/ui/component-preview-style.js:2|ComponentPreviewStyle|Object.freeze({   scope(text) {     const stack = [{ mode: "rules", start: 0 }];     let output = "";     for (let i = 0; i < text.length; i++) {       const ch|需要进一步测试|
|src/ui/component-preview-style.js:4|stack|[{ mode: "rules", start: 0 }]|需要进一步测试|
|src/ui/component-preview-style.js:5|output|""|需要进一步测试|
|src/ui/component-preview-style.js:6|i|0|需要进一步测试|
|src/ui/component-preview-style.js:7|ch|text[i]|需要进一步测试|
|src/ui/component-preview-style.js:14|end|text.indexOf("*/", i + 2)|需要进一步测试|
|src/ui/component-preview-style.js:15|stop|end < 0 ? text.length : end + 2|需要进一步测试|
|src/ui/component-preview-style.js:21|end|i + 1|需要进一步测试|
|src/ui/component-preview-style.js:30|context|stack.at(-1)|需要进一步测试|
|src/ui/component-preview-style.js:32|prelude|text           .slice(context.start, i)           .replace(/\/\*[\s\S]*?\*\//g, "")           .trim()|需要进一步测试|
|src/ui/component-preview-style.js:36|group|context.mode === "rules" &&           /^@(?:media／supports／container／layer／scope／starting-style／(?:-webkit-)?keyframes)\b/i.test(             prelude,          |需要进一步测试|
|src/ui/content-bank-editor.js:2|GodPowerContentBankEditor|Object.freeze({   create({     query: $,     escape: E,     getBank,     getSubject,     saveContentBank,     themeConfirm,   }) {     function render() {      |需要进一步测试|
|src/ui/content-bank-editor.js:12|host|$("#uiStructuredBank")|需要进一步测试|
|src/ui/content-bank-editor.js:47|kind|button.dataset.bankDelete|需要进一步测试|
|src/ui/content-bank-editor.js:48|index|Number(button.dataset.index)|需要进一步测试|
|src/ui/content-bank-editor.js:49|row|getBank()[kind][index]|需要进一步测试|
|src/ui/content-bank-editor.js:58|next|JSON.parse(JSON.stringify(getBank()))|需要进一步测试|
|src/ui/content-bank-editor.js:69|file|event.target.files?.[0]|需要进一步测试|
|src/ui/content-bank-editor.js:83|row|index < 0           ? {               id: "",               subject: getSubject(),               title: "",               source: "",               options: [""|需要进一步测试|
|src/ui/content-bank-editor.js:94|fields|kind === "knowledge"           ? [               ["id", "唯一 ID"],               ["subject", "学科"],               ["title", "知识标题"],               ["module", "模块|需要进一步测试|
|src/ui/content-bank-editor.js:113|host|$("#uiBankForm")|需要进一步测试|
|src/ui/content-bank-editor.js:119|data|new FormData(event.target)|需要进一步测试|
|src/ui/content-bank-editor.js:120|edited|{ ...row }|需要进一步测试|
|src/ui/content-bank-editor.js:130|next|JSON.parse(JSON.stringify(getBank()))|需要进一步测试|
|src/ui/contribution-registry.js:5|KINDS|new Set([     "navigation",     "page",     "panel",     "card",     "settings",     "commandShortcut",     "viewPreset",     "decoration",   ])|需要进一步测试|
|src/ui/contribution-registry.js:15|SLOTS|new Set([     "home.cards",     "plugins.overview",     "plugins.workspace",     "resources.tools",     "settings.pluginLinks",     "competition.transientOverla|需要进一步测试|
|src/ui/contribution-registry.js:23|RENDERERS|new Set([     "builtin.plugin-workspace",     "builtin.dashboard-card",     "builtin.notice",     "builtin.command-shortcut",     "builtin.decoration",   ])|需要进一步测试|
|src/ui/contribution-registry.js:30|CORE_PAGES|["welcome", "battle", "history", "archives", "settings"]|需要进一步测试|
|src/ui/contribution-registry.js:31|REQUIRED|{     page: "ui.page.register",     navigation: "ui.navigation.register",     card: "ui.card.register",     panel: "ui.panel.register",     settings: "ui.settin|需要进一步测试|
|src/ui/contribution-registry.js:41|EXECUTABLE_FIELD|/^(?:html／markup／script／module／mount／handler／callback／function／css／csstext／javascript／__proto__／prototype／constructor)$/i|需要进一步测试|
|src/ui/contribution-registry.js:43|IDENTIFIER|/^[a-z0-9][a-z0-9._-]{0,63}$/|需要进一步测试|
|src/ui/contribution-registry.js:44|DESCRIPTOR_FIELDS|{     page: new Set([       "titleKey",       "iconResource",       "renderer",       "route",       "emptyState",       "errorState",     ]),     navigation: n|需要进一步测试|
|src/ui/contribution-registry.js:83|clone|(value) => JSON.parse(JSON.stringify(value))|需要进一步测试|
|src/ui/contribution-registry.js:84|equal|(left, right) => JSON.stringify(left) === JSON.stringify(right)|需要进一步测试|
|src/ui/contribution-registry.js:85|fail|(message) => {     throw new TypeError(message);   }|需要进一步测试|
|src/ui/contribution-registry.js:114|[key, entry]||需要进一步测试|
|src/ui/contribution-registry.js:122|revision|0|需要进一步测试|
|src/ui/contribution-registry.js:123|nextActivation|1|需要进一步测试|
|src/ui/contribution-registry.js:124|activations|new WeakMap()|需要进一步测试|
|src/ui/contribution-registry.js:125|activationsById|new Map()|需要进一步测试|
|src/ui/contribution-registry.js:126|contributions|new Map()|需要进一步测试|
|src/ui/contribution-registry.js:127|pages|new Map()|需要进一步测试|
|src/ui/contribution-registry.js:129|route||需要进一步测试|
|src/ui/contribution-registry.js:167|activationId|activation-${nextActivation++}|需要进一步测试|
|src/ui/contribution-registry.js:168|activation|Object.freeze({ activationId })|需要进一步测试|
|src/ui/contribution-registry.js:169|record|{         pluginId,         activationId,         scope: clone(options.scope ／／ {}),         permissions: new Set(options.permissions ／／ []),         active: tr|需要进一步测试|
|src/ui/contribution-registry.js:213|needed|new Set([         REQUIRED[input.kind],         ...(input.requiredPermissions ／／ []),       ])|需要进一步测试|
|src/ui/contribution-registry.js:217|permission||需要进一步测试|
|src/ui/contribution-registry.js:222|descriptor|clone(input.descriptor)|需要进一步测试|
|src/ui/contribution-registry.js:223|key||需要进一步测试|
|src/ui/contribution-registry.js:327|activationRecord|activations.get(activation)|需要进一步测试|
|src/ui/contribution-registry.js:332|staged|batch.map((item) =>         validateContribution(item, activationRecord),       )|需要进一步测试|
|src/ui/contribution-registry.js:335|stagedIds|new Set()|需要进一步测试|
|src/ui/contribution-registry.js:336|stagedRoutes|new Set()|需要进一步测试|
|src/ui/contribution-registry.js:337|item||需要进一步测试|
|src/ui/contribution-registry.js:347|item||需要进一步测试|
|src/ui/contribution-registry.js:361|record|activationsById.get(activationId)|需要进一步测试|
|src/ui/contribution-registry.js:364|id||需要进一步测试|
|src/ui/contribution-registry.js:365|item|contributions.get(id)|需要进一步测试|
|src/ui/contribution-registry.js:383|page|pages.get(route)|需要进一步测试|
|src/ui/contribution-registry.js:387|page|pages.get(route)|需要进一步测试|
|src/ui/contribution-registry.js:415|api|Object.freeze({ createContributionRegistry })|需要进一步测试|
|src/ui/contribution-registry.js:419|registry|createContributionRegistry()|需要进一步测试|
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
|src/ui/desktop.js:152|pageScope|window.GodPowerPageLifecycle?.enter(name).scope|需要进一步测试|
|src/ui/desktop.js:158|m||需要进一步测试|
|src/ui/desktop.js:167|dock|$(".bottom-dock")|需要进一步测试|
|src/ui/desktop.js:184|enterPage|() => {         pageMotionFrame = null;         if (currentView !== name ／／ !preferences.pageMotion) return;         const selectors = {           welcome:     |需要进一步测试|
|src/ui/desktop.js:187|selectors|{           welcome:             ".gp-hero,.gp-kpis,.gp-main-grid,.gp-group-section,.gp-daily-grid",           battle:             "#heightResizerDock,#groupLis|需要进一步测试|
|src/ui/desktop.js:196|host|$(#view-${name})|需要进一步测试|
|src/ui/desktop.js:197|targets|[           ...host.querySelectorAll(selectors[name] ／／ ":scope"),         ].slice(0, 18)|需要进一步测试|
|src/ui/desktop.js:201|animation|animate(             el,             [               {                 opacity: 0,                 translate: preferences.motion === "full" ? "0 -10px" : "0 -3p|需要进一步测试|
|src/ui/desktop.js:228|track|$("#uiGroupTrack")|需要进一步测试|
|src/ui/desktop.js:233|groups|state.groups ／／ []|需要进一步测试|
|src/ui/desktop.js:234|sorted|[...groups].sort((a, b) => Number(b.score) - Number(a.score))|需要进一步测试|
|src/ui/desktop.js:235|mask|Number(state.itemGlobal?.blooperUntil ／／ 0) > Date.now()|需要进一步测试|
|src/ui/desktop.js:236|signature|JSON.stringify(         groups.map((g) => [           g.id,           g.name,           g.score,           g.color,           g.inventory,           g.itemEffec|需要进一步测试|
|src/ui/desktop.js:251|x|track.scrollLeft|需要进一步测试|
|src/ui/desktop.js:255|item|g.inventory?.[0]|需要进一步测试|
|src/ui/desktop.js:256|states|Object.entries(g.itemEffect ／／ {})                   .filter(                     ([k, v]) =>                       (k === "type" && !!v) ／／                    |需要进一步测试|
|src/ui/desktop.js:301|t|$("#uiGroupTrack")|需要进一步测试|
|src/ui/desktop.js:303|overflow|t.scrollWidth > t.clientWidth + 2|需要进一步测试|
|src/ui/desktop.js:309|visualSnapshot|new Map()|需要进一步测试|
|src/ui/desktop.js:311|next|new Map()|需要进一步测试|
|src/ui/desktop.js:312|g||需要进一步测试|
|src/ui/desktop.js:313|current|{         main: g.inventory?.[0]?.key ／／ "",         inventory: JSON.stringify(g.inventory ／／ []),         effect: JSON.stringify(g.itemEffect ／／ null),        |需要进一步测试|
|src/ui/desktop.js:319|prior|visualSnapshot.get(g.id)|需要进一步测试|
|src/ui/desktop.js:349|dailySignature|""|需要进一步测试|
|src/ui/desktop.js:350|dailyOffsets|{ knowledge: 0, challenges: 0 }|需要进一步测试|
|src/ui/desktop.js:351|quizAttempt|{ key: "", answer: null, correct: false }|需要进一步测试|
|src/ui/desktop.js:353|host|$("#uiDailyGrid")|需要进一步测试|
|src/ui/desktop.js:355|history|getSettlementHistory()|需要进一步测试|
|src/ui/desktop.js:356|signature|M.dayIndex() +         JSON.stringify([           preferences.knowledge,           preferences.itemTip,           preferences.honors,           preferences.chal|需要进一步测试|
|src/ui/desktop.js:371|knowledge|M.daily(         bank.knowledge.filter((x) => x.subject === preferences.subject),         new Date(),         dailyOffsets.knowledge,       )|需要进一步测试|
|src/ui/desktop.js:376|quiz|M.daily(         bank.challenges.filter((x) => x.subject === preferences.subject),         new Date(),         dailyOffsets.challenges,       )|需要进一步测试|
|src/ui/desktop.js:381|keys|Object.keys(ITEM_DEFS)|需要进一步测试|
|src/ui/desktop.js:382|key|M.daily(keys)|需要进一步测试|
|src/ui/desktop.js:383|item|ITEM_DEFS[key]|需要进一步测试|
|src/ui/desktop.js:384|last|history[0]|需要进一步测试|
|src/ui/desktop.js:385|winner|last?.groups?.[0]|需要进一步测试|
|src/ui/desktop.js:386|quizKey|[       M.dayIndex(),       preferences.subject,       dailyOffsets.challenges,       quiz?.id,     ].join(":")|需要进一步测试|
|src/ui/desktop.js:394|html|""|需要进一步测试|
|src/ui/desktop.js:408|[selector, kind]||需要进一步测试|
|src/ui/desktop.js:412|next|host.querySelector(selector)|需要进一步测试|
|src/ui/desktop.js:427|card|b.closest(".gp-daily-challenge")|需要进一步测试|
|src/ui/desktop.js:465|host|$("#historyListView")|需要进一步测试|
|src/ui/desktop.js:480|next|historyStack[i + 1] ／／ state|需要进一步测试|
|src/ui/desktop.js:481|diffs|M.differences(h, next)|需要进一步测试|
|src/ui/desktop.js:482|[kind, glyph, label]|historyKind(h.desc)|需要进一步测试|
|src/ui/desktop.js:483|changed|diffs.filter(             (d) =>               d.delta ／／               d.added ／／               d.removed ／／               JSON.stringify(d.inventoryBefore) !=|需要进一步测试|
|src/ui/desktop.js:517|index|Number(b.dataset.restore)|需要进一步测试|
|src/ui/desktop.js:518|target|historyStack[index]|需要进一步测试|
|src/ui/desktop.js:520|ok|await themeConfirm(             恢复到 ${target.time ／／ "未记录时间"}「${target.desc ／／ "未命名操作"}」之前？将恢复小组、积分、道具、持续状态与快照包含的回合字段，并丢弃此节点及其后 ${historyStack.length - index -|需要进一步测试|
|src/ui/desktop.js:534|records|getSettlementHistory()|需要进一步测试|
|src/ui/desktop.js:535|all|records       .flatMap((x) => (Array.isArray(x.groups) ? x.groups : []))       .filter(         (g) =>           (typeof g.score === "number" ／／             (ty|需要进一步测试|
|src/ui/desktop.js:543|best|all.length       ? Math.max(...all.map((g) => Number(g.score)))       : null|需要进一步测试|
|src/ui/desktop.js:560|host|$("#settlementHistoryContainer")|需要进一步测试|
|src/ui/desktop.js:562|list|records       .map((r, index) => ({ r, index }))       .filter(({ r }) =>         [r.title, r.champion, ...(r.groups ／／ []).map((g) => g.name)]           .join(|需要进一步测试|
|src/ui/desktop.js:582|groups|Array.isArray(r.groups) ? r.groups : []|需要进一步测试|
|src/ui/desktop.js:642|url|URL.createObjectURL(         new Blob([JSON.stringify(value, null, 2)], {           type: "application/json",         }),       )|需要进一步测试|
|src/ui/desktop.js:647|a|document.createElement("a")|需要进一步测试|
|src/ui/desktop.js:653|categories|GodPowerSettingsLayout.categories|需要进一步测试|
|src/ui/desktop.js:655|sc|$("#view-settings .settings-scroll")|需要进一步测试|
|src/ui/desktop.js:657|shell|document.createElement("div")|需要进一步测试|
|src/ui/desktop.js:661|sections|Object.fromEntries(       [...shell.querySelectorAll("[data-category-panel]")].map((p) => [         p.dataset.categoryPanel,         p,       ]),     )|需要进一步测试|
|src/ui/desktop.js:671|classified|[...sc.querySelectorAll("[data-settings-category]")]|需要进一步测试|
|src/ui/desktop.js:672|pane||需要进一步测试|
|src/ui/desktop.js:673|id|pane.id.replace("settingsV26_", "")|需要进一步测试|
|src/ui/desktop.js:680|el||需要进一步测试|
|src/ui/desktop.js:682|buttonIcons|$("#uiIconManagerV26")?.parentElement|需要进一步测试|
|src/ui/desktop.js:697|check|(key) =>       <input id="uiPref-${key}" data-pref="${key}" type="checkbox" ${preferences[key] ? "checked" : ""}>|需要进一步测试|
|src/ui/desktop.js:744|danger|[...sections.data.querySelectorAll("button")].filter((b) =>       /resetAllScores／clear/.test(b.getAttribute("onclick") ／／ ""),     )|需要进一步测试|
|src/ui/desktop.js:747|b||需要进一步测试|
|src/ui/desktop.js:751|key||需要进一步测试|
|src/ui/desktop.js:758|key|el.dataset.pref|需要进一步测试|
|src/ui/desktop.js:823|bankBody|$("#uiSettingsBank .ui-settings-detail-body")|需要进一步测试|
|src/ui/desktop.js:824|structured|document.createElement("div")|需要进一步测试|
|src/ui/desktop.js:831|next|M.validateBank(candidate)|需要进一步测试|
|src/ui/desktop.js:841|contentBankEditor|GodPowerContentBankEditor.create({     query: $,     escape: E,     getBank: () => bank,     getSubject: () => preferences.subject,     saveContentBank,     the|需要进一步测试|
|src/ui/desktop.js:849|renderBankEditor|contentBankEditor.render|需要进一步测试|
|src/ui/desktop.js:855|button|event.target.closest("button")|需要进一步测试|
|src/ui/desktop.js:856|action|button?.getAttribute("onclick")|需要进一步测试|
|src/ui/desktop.js:857|confirm|{           "applySettingsBatchMembers()": [             "重建小组与名单",             "将按文本重建全部小组。未列出的组会移除，改名可能建立新组。请先导出课堂备份。确认应用？",             applySettingsBatchMem|需要进一步测试|
|src/ui/desktop.js:891|el|$("#uiPref-subject")|需要进一步测试|
|src/ui/desktop.js:893|subjects|[       ...new Set([         "politics",         ...bank.knowledge.map((x) => x.subject),         ...bank.challenges.map((x) => x.subject),       ]),     ]|需要进一步测试|
|src/ui/desktop.js:911|animation||需要进一步测试|
|src/ui/desktop.js:921|panel|$([data-category-panel="${activeSettings}"])|需要进一步测试|
|src/ui/desktop.js:923|content|[...panel.children]       .flatMap((node) =>         node.matches(".legacy-settings-pane") ? [...node.children] : [node],       )       .filter((node) => !node.|需要进一步测试|
|src/ui/desktop.js:928|targets|entering       ? [$(".ui-settings-header"), $(".ui-settings-nav"), ...content]       : content|需要进一步测试|
|src/ui/desktop.js:931|simple|preferences.motion === "simple"|需要进一步测试|
|src/ui/desktop.js:933|animation|animate(         node,         [           {             opacity: simple ? 0.6 : 0,             translate: simple ? "0 -4px" : "0 -12px",           },          |需要进一步测试|
|src/ui/desktop.js:960|aliases|{ function: "rules" }|需要进一步测试|
|src/ui/desktop.js:989|right|$(".dock-right")|需要进一步测试|
|src/ui/desktop.js:990|details|document.createElement("details")|需要进一步测试|
|src/ui/desktop.js:994|menu|details.lastElementChild|需要进一步测试|
|src/ui/desktop.js:995|b||需要进一步测试|
|src/ui/desktop.js:996|action|b.getAttribute("onclick") ／／ ""|需要进一步测试|
|src/ui/desktop.js:997|keep|/globalItemDraw／openHandRaise／openPickerModal／undoLast/.test(         action,       )|需要进一步测试|
|src/ui/desktop.js:1000|label|/globalItemDraw/.test(action)         ? "道具"         : /openHandRaise/.test(action)           ? "举手"           : /openPickerModal/.test(action)             ? "点|需要进一步测试|
|src/ui/desktop.js:1041|final|$("#btnFinalSettlement")|需要进一步测试|
|src/ui/desktop.js:1058|label|state.isLocked ? "解锁管理口令" : "管理已解锁"|需要进一步测试|
|src/ui/desktop.js:1059|original|icon("shield") + <span>${label}</span>|需要进一步测试|
|src/ui/desktop.js:1061|image|Reliability.safeImage(uiIconsV26().dock_lock)|需要进一步测试|
|src/ui/desktop.js:1067|disclosureMotion|GodPowerDisclosureMotion.create({     animate,     canAnimate,     getPreferences: () => preferences,   })|需要进一步测试|
|src/ui/desktop.js:1072|{ settleDisclosures, setupDisclosures }|disclosureMotion|需要进一步测试|
|src/ui/desktop.js:1073|modalClosers|{     componentLibraryModal: () => UIComponentLibrary.close(),     classroomShowcase: () => ClassroomFeedback.dismiss(),     programConfirmV28: () => document.g|需要进一步测试|
|src/ui/desktop.js:1091|windowMotion|GodPowerWindowMotion.create({     animate,     canAnimate,     motionEase,     getPreferences: () => preferences,   })|需要进一步测试|
|src/ui/desktop.js:1097|{ dismissWindow, cancelWindowClose, finishWindowClose }|windowMotion|需要进一步测试|
|src/ui/desktop.js:1106|openStack|[]|需要进一步测试|
|src/ui/desktop.js:1107|modalLayer|300000|需要进一步测试|
|src/ui/desktop.js:1109|known|new Map()|需要进一步测试|
|src/ui/desktop.js:1116|target|[         ...top.el.querySelectorAll(           'input:not([type=hidden]),button,select,textarea,[tabindex="0"]',         ),       ].find((el) => !el.disabled &|需要进一步测试|
|src/ui/desktop.js:1126|top|openStack.at(-1)|需要进一步测试|
|src/ui/desktop.js:1133|item|openStack.find((x) => x.id === id)|需要进一步测试|
|src/ui/desktop.js:1142|top|openStack.at(-1)|需要进一步测试|
|src/ui/desktop.js:1155|[id, close]||需要进一步测试|
|src/ui/desktop.js:1156|el|document.getElementById(id)|需要进一步测试|
|src/ui/desktop.js:1163|visible|!el.hasAttribute("data-external-picker") &&           (el.open ／／             el.classList.contains("active") ／／             el.classList.contains("show") ／／   |需要进一步测试|
|src/ui/desktop.js:1171|surface|el.querySelector(".ui-function-surface") ／／ el.firstElementChild|需要进一步测试|
|src/ui/desktop.js:1174|old||需要进一步测试|
|src/ui/desktop.js:1181|button|document.createElement("button")|需要进一步测试|
|src/ui/desktop.js:1194|focus|document.activeElement|需要进一步测试|
|src/ui/desktop.js:1196|previousZ|el.style.zIndex|需要进一步测试|
|src/ui/desktop.js:1197|previousLayer|el.style.getPropertyValue("--ui-modal-layer")|需要进一步测试|
|src/ui/desktop.js:1198|layer|String(++modalLayer)|需要进一步测试|
|src/ui/desktop.js:1202|dialog|el.firstElementChild?.tagName === "CANVAS"               ? el.querySelector(".grand-card")               : el.firstElementChild|需要进一步测试|
|src/ui/desktop.js:1221|zoom|Number(getComputedStyle(document.body).zoom) ／／ 1|需要进一步测试|
|src/ui/desktop.js:1222|travel|Math.min(               preferences.motion === "full" ? 42 : 8,               Math.max(                 0,                 (innerHeight - dialog.getBoundingClie|需要进一步测试|
|src/ui/desktop.js:1267|top|openStack.at(-1)|需要进一步测试|
|src/ui/desktop.js:1284|top|openStack.at(-1)|需要进一步测试|
|src/ui/desktop.js:1293|nodes|[             ...top.el.querySelectorAll(               'button,input,select,textarea,a[href],[tabindex="0"]',             ),           ].filter(             (x|需要进一步测试|
|src/ui/desktop.js:1304|first|nodes[0]|需要进一步测试|
|src/ui/desktop.js:1305|last|nodes.at(-1)|需要进一步测试|
|src/ui/desktop.js:1327|pickerGeneration|0|需要进一步测试|
|src/ui/desktop.js:1328|pickerPreparing|false|需要进一步测试|
|src/ui/desktop.js:1329|pickerRevealing|false|需要进一步测试|
|src/ui/desktop.js:1330|pickerReelRestores|[]|需要进一步测试|
|src/ui/desktop.js:1334|restore||需要进一步测试|
|src/ui/desktop.js:1343|button|$("#btnSlotTrigger")|需要进一步测试|
|src/ui/desktop.js:1349|modal|$("#pickerModal")|需要进一步测试|
|src/ui/desktop.js:1350|a||需要进一步测试|
|src/ui/desktop.js:1365|generation|++pickerGeneration|需要进一步测试|
|src/ui/desktop.js:1367|button|$("#btnSlotTrigger")|需要进一步测试|
|src/ui/desktop.js:1387|win|slotEngine.chosenResult|需要进一步测试|
|src/ui/desktop.js:1388|generation|pickerGeneration|需要进一步测试|
|src/ui/desktop.js:1389|modal|$("#pickerModal")|需要进一步测试|
|src/ui/desktop.js:1390|badge|$("#slotSubBadge")|需要进一步测试|
|src/ui/desktop.js:1391|button|$("#btnSlotTrigger")|需要进一步测试|
|src/ui/desktop.js:1394|label|badge.textContent|需要进一步测试|
|src/ui/desktop.js:1395|complete|() => {       if (         !isPickerCurrent(generation) ／／         slotEngine.chosenResult !== win ／／         slotEngine.isSpinning       )         return;     |需要进一步测试|
|src/ui/desktop.js:1424|pending|[]|需要进一步测试|
|src/ui/desktop.js:1425|pendingActual|[]|需要进一步测试|
|src/ui/desktop.js:1428|actual|frame.querySelector(".slot-reel-text")|需要进一步测试|
|src/ui/desktop.js:1429|isGroup|frame.id === "reelFrameGroup"|需要进一步测试|
|src/ui/desktop.js:1430|live|ClassroomFeedback.takeLive(frame)|需要进一步测试|
|src/ui/desktop.js:1431|candidates|isGroup         ? state.groups.map((g) => ({ raw: g.name, group: g }))         : state.groups.flatMap((g) =>             (g.members ／／ []).map((raw) => ({ raw, |需要进一步测试|
|src/ui/desktop.js:1436|height|frame.clientHeight|需要进一步测试|
|src/ui/desktop.js:1437|strip|document.createElement("div")|需要进一步测试|
|src/ui/desktop.js:1441|i|0|需要进一步测试|
|src/ui/desktop.js:1442|row|document.createElement("span")|需要进一步测试|
|src/ui/desktop.js:1443|list|live?.rows ／／ candidates|需要进一步测试|
|src/ui/desktop.js:1444|candidate|list[((live?.index ／／ 0) + i) % Math.max(1, list.length)]|需要进一步测试|
|src/ui/desktop.js:1447|node||需要进一步测试|
|src/ui/desktop.js:1458|visibility|live ? live.visibility : actual.style.visibility|需要进一步测试|
|src/ui/desktop.js:1466|a|animate(         strip,         [           { transform: translateY(-${(live?.fraction ／／ 0) * height}px) },           { transform: translateY(-${height * 6}|需要进一步测试|
|src/ui/desktop.js:1486|target|pickerTargetGroup()|需要进一步测试|
|src/ui/desktop.js:1487|valid|!!target &&       state.groups.some((g) => g.id === target.id) &&       !slotEngine.isSpinning &&       !pickerRevealing|需要进一步测试|
|src/ui/desktop.js:1506|left|$(".picker-left")|需要进一步测试|
|src/ui/desktop.js:1507|right|$(".picker-right")|需要进一步测试|
|src/ui/desktop.js:1508|options|$(".slot-options-row")|需要进一步测试|
|src/ui/desktop.js:1510|tabs|$(".picker-info-tabs")|需要进一步测试|
|src/ui/desktop.js:1511|info|$("#pickerInfoBox")|需要进一步测试|
|src/ui/desktop.js:1513|stats|$("#pickerStatsBtn")|需要进一步测试|
|src/ui/desktop.js:1518|target|$("#pickerScoreTarget")|需要进一步测试|
|src/ui/desktop.js:1526|settlementBusy|false|需要进一步测试|
|src/ui/desktop.js:1527|settlementGeneration|0|需要进一步测试|
|src/ui/desktop.js:1530|status|$("#uiSettlementStatus")|需要进一步测试|
|src/ui/desktop.js:1538|generation|settlementGeneration|需要进一步测试|
|src/ui/desktop.js:1542|text|button.textContent|需要进一步测试|
|src/ui/desktop.js:1544|status|$("#uiSettlementStatus")|需要进一步测试|
|src/ui/desktop.js:1558|result|confirmFinalSettlement()|需要进一步测试|
|src/ui/desktop.js:1573|value|JSON.parse(         localStorage.getItem("godpower_ui_preferences_v1") ／／ "{}",       )|需要进一步测试|
|src/ui/desktop.js:1576|key||需要进一步测试|
|src/ui/desktop.js:1587|saved|localStorage.getItem("godpower_ui_bank_v1")|需要进一步测试|
|src/ui/desktop.js:1610|text|["欢迎", "比赛", "历史", "档案", "设置"][i]|需要进一步测试|
|src/ui/desktop.js:1618|el|$(selector)|需要进一步测试|
|src/ui/desktop.js:1630|details|event.target|需要进一步测试|
|src/ui/desktop.js:1633|a||需要进一步测试|
|src/ui/desktop.js:1650|t|$("#uiGroupTrack")|需要进一步测试|
|src/ui/desktop.js:1661|next|Math.max(           0,           Math.min(t.scrollWidth - t.clientWidth, t.scrollLeft + e.deltaY),         )|需要进一步测试|
|src/ui/desktop.js:1745|control|$("#uiPref-groupCruise")|需要进一步测试|
|src/ui/desktop.js:1747|saved|persistPreferences()|需要进一步测试|
|src/ui/disclosure-motion.js:2|GodPowerDisclosureMotion|Object.freeze({   create({ animate, canAnimate, getPreferences }) {     let installed = false;     let scope = null;     const disclosureMotions = new Map();   |需要进一步测试|
|src/ui/disclosure-motion.js:4|installed|false|需要进一步测试|
|src/ui/disclosure-motion.js:5|scope|null|需要进一步测试|
|src/ui/disclosure-motion.js:6|disclosureMotions|new Map()|需要进一步测试|
|src/ui/disclosure-motion.js:8|entry|disclosureMotions.get(details)|需要进一步测试|
|src/ui/disclosure-motion.js:16|details||需要进一步测试|
|src/ui/disclosure-motion.js:23|summary|event.target.closest("summary")|需要进一步测试|
|src/ui/disclosure-motion.js:24|details|summary?.parentElement|需要进一步测试|
|src/ui/disclosure-motion.js:34|preferences|getPreferences()|需要进一步测试|
|src/ui/disclosure-motion.js:35|nextOpen|!(           disclosureMotions.get(details)?.open ?? details.open         )|需要进一步测试|
|src/ui/disclosure-motion.js:38|from|details.getBoundingClientRect().height|需要进一步测试|
|src/ui/disclosure-motion.js:40|overflow|details.style.overflow|需要进一步测试|
|src/ui/disclosure-motion.js:42|collapsed|details.getBoundingClientRect().height|需要进一步测试|
|src/ui/disclosure-motion.js:44|expanded|details.getBoundingClientRect().height|需要进一步测试|
|src/ui/disclosure-motion.js:46|entry|{ open: nextOpen, overflow, animation: null }|需要进一步测试|
|src/ui/disclosure-motion.js:60|finish|() => {           if (disclosureMotions.get(details) === entry)             settleDisclosure(details);         }|需要进一步测试|
|src/ui/disposable-scope.js:6|disposed|false|需要进一步测试|
|src/ui/disposable-scope.js:7|cleanups|[]|需要进一步测试|
|src/ui/disposable-scope.js:8|abortController|new AbortController()|需要进一步测试|
|src/ui/disposable-scope.js:11|index|cleanups.indexOf(entry)|需要进一步测试|
|src/ui/disposable-scope.js:18|active|true|需要进一步测试|
|src/ui/disposable-scope.js:19|entry|() => {         if (!active) return;         active = false;         cleanup();       }|需要进一步测试|
|src/ui/disposable-scope.js:43|capture|typeof options === "boolean" ? options : !!options?.capture|需要进一步测试|
|src/ui/disposable-scope.js:45|release||需要进一步测试|
|src/ui/disposable-scope.js:46|registered|options?.once         ? function (event) {             release();             if (typeof listener === "function") listener.call(this, event);             else l|需要进一步测试|
|src/ui/disposable-scope.js:64|release||需要进一步测试|
|src/ui/disposable-scope.js:65|id|setTimeout(() => {         release?.();         if (!disposed) callback();       }, delay)|需要进一步测试|
|src/ui/disposable-scope.js:77|release||需要进一步测试|
|src/ui/disposable-scope.js:78|id|requestAnimationFrame((time) => {         release?.();         if (!disposed) callback(time);       })|需要进一步测试|
|src/ui/disposable-scope.js:106|release|add(() => animation.cancel())|需要进一步测试|
|src/ui/disposable-scope.js:121|errors|[]|需要进一步测试|
|src/ui/disposable-scope.js:127|cleanup||需要进一步测试|
|src/ui/disposable-scope.js:161|error||需要进一步测试|
|src/ui/disposable-scope.js:165|active|null|需要进一步测试|
|src/ui/disposable-scope.js:176|previous|active|需要进一步测试|
|src/ui/disposable-scope.js:177|errors|previous.dispose()|需要进一步测试|
|src/ui/disposable-scope.js:186|previous|active|需要进一步测试|
|src/ui/disposable-scope.js:188|errors|previous.dispose()|需要进一步测试|
|src/ui/electron-host.js:3|desktop|window.godpowerDesktop|需要进一步测试|
|src/ui/electron-host.js:5|completed|new Map()|需要进一步测试|
|src/ui/electron-host.js:6|last|""|需要进一步测试|
|src/ui/electron-host.js:7|timer||需要进一步测试|
|src/ui/electron-host.js:8|soundedReveal|null|需要进一步测试|
|src/ui/electron-host.js:12|hand|globalThis.HandRaisePort?.create({     getState: () => state,     busy: () =>       !!window.itemCommandActive ／／ !!itemDrawBusy ／／ !!handItemDrawTimer,     id:|需要进一步测试|
|src/ui/electron-host.js:36|index|0|需要进一步测试|
|src/ui/electron-host.js:37|item|group.inventory?.[index]|需要进一步测试|
|src/ui/electron-host.js:40|accepted|useItem(group.id, index)|需要进一步测试|
|src/ui/electron-host.js:61|publish|() => {     const snapshot = GodpowerPicker.getSnapshot(),       handSnapshot = hand?.getSnapshot() ／／ null;     const payload = {       ...snapshot,       hand|需要进一步测试|
|src/ui/electron-host.js:62|snapshot|GodpowerPicker.getSnapshot()|需要进一步测试|
|src/ui/electron-host.js:63|handSnapshot|hand?.getSnapshot() ／／ null|需要进一步测试|
|src/ui/electron-host.js:64|payload|{       ...snapshot,       hand: handSnapshot         ? {             selectionId: handSnapshot.selectionId,             groupId: handSnapshot.groupId,         |需要进一步测试|
|src/ui/electron-host.js:81|json|JSON.stringify(payload)|需要进一步测试|
|src/ui/electron-host.js:95|handActions|new Set([     "handSelect",     "handJudge",     "handScore",     "handDraw",     "handUse",   ])|需要进一步测试|
|src/ui/electron-host.js:102|sounds|{     start: "pick_start",     stop: "pick_stop",     cancel: "cancel",     resetPool: "danger",     mode: "settings",     antiRepeat: "settings",     preselect|需要进一步测试|
|src/ui/electron-host.js:120|buttonSound|action === "score"           ? payload.delta > 0             ? "positive"             : "negative"           : sounds[action]|需要进一步测试|
|src/ui/electron-host.js:127|promise|handActions.has(action)         ? hand.command(action, payload).catch((error) => ({             ok: false,             error: error.message,           }))      |需要进一步测试|
|src/ui/electron-host.js:139|result|await completed.get(id)|需要进一步测试|
|src/ui/electron-host.js:155|snapshot|hand.getSnapshot?.()|需要进一步测试|
|src/ui/electron-host.js:171|button|document.createElement("button")|需要进一步测试|
|src/ui/electron-windows.js:4|style|document.createElement("style")|需要进一步测试|
|src/ui/home-dashboard.js:4|SELECTORS|[     ".gp-kpis",     ".gp-section-heading",     ".gp-main-grid",     ".gp-group-section",     ".gp-bottom-heading",     "#uiDailyGrid",   ]|需要进一步测试|
|src/ui/home-dashboard.js:12|TYPES|[     ["core.group-count", "#wGroupCount", 3, 2],     ["core.total-score", "#wTotalScore", 3, 2],     ["core.top-score", "#wMaxScore", 3, 2],     ["core.leading|需要进一步测试|
|src/ui/home-dashboard.js:25|TITLES|Object.fromEntries(     TYPES.map(([id], index) => [       id,       [         "参赛小组",         "班级总积分",         "最高小组积分",         "当前领跑",         "小组实时排名",     |需要进一步测试|
|src/ui/home-dashboard.js:43|SIZE|(w, h) => ({     minW: w === 3 ? 2 : 4,     minH: 2,     defaultW: w,     defaultH: h,     maxW: 12,     maxH: 12,   })|需要进一步测试|
|src/ui/home-dashboard.js:51|catalog|TYPES.map(([typeId, , w, h]) => ({     typeId,     source: "core",     supportsMultipleInstances: false,     configSchemaVersion: 1,     size: SIZE(w, h),   }))|需要进一步测试|
|src/ui/home-dashboard.js:58|initialized|false|需要进一步测试|
|src/ui/home-dashboard.js:59|observer|null|需要进一步测试|
|src/ui/home-dashboard.js:60|dailyRevision|null|需要进一步测试|
|src/ui/home-dashboard.js:61|currentLayout|null|需要进一步测试|
|src/ui/home-dashboard.js:62|repository|null|需要进一步测试|
|src/ui/home-dashboard.js:63|repositoryRevision|0|需要进一步测试|
|src/ui/home-dashboard.js:64|layoutService|null|需要进一步测试|
|src/ui/home-dashboard.js:65|editing|false|需要进一步测试|
|src/ui/home-dashboard.js:66|gridElement|null|需要进一步测试|
|src/ui/home-dashboard.js:67|pointerEdit|null|需要进一步测试|
|src/ui/home-dashboard.js:68|statusTimer|null|需要进一步测试|
|src/ui/home-dashboard.js:69|instanceSequence|0|需要进一步测试|
|src/ui/home-dashboard.js:72|welcome|document.getElementById("view-welcome")|需要进一步测试|
|src/ui/home-dashboard.js:73|first|welcome?.querySelector(".gp-kpis")|需要进一步测试|
|src/ui/home-dashboard.js:75|grid|welcome.querySelector("#homeDashboardGrid")|需要进一步测试|
|src/ui/home-dashboard.js:82|selector||需要进一步测试|
|src/ui/home-dashboard.js:83|node|welcome.querySelector(selector)|需要进一步测试|
|src/ui/home-dashboard.js:90|createId|(() => {       let sequence = 0;       return () => home-card-${++sequence};     })()|需要进一步测试|
|src/ui/home-dashboard.js:91|sequence|0|需要进一步测试|
|src/ui/home-dashboard.js:103|aliases|{       "plugin.official.marx.politics.daily-knowledge": "core.daily-knowledge",       "plugin.official.miyamotos.power.daily-item-tip": "core.daily-item-tip", |需要进一步测试|
|src/ui/home-dashboard.js:119|toolbar|document.getElementById("homeDashboardToolbar")|需要进一步测试|
|src/ui/home-dashboard.js:140|node|document.getElementById("homeDashboardStatus")|需要进一步测试|
|src/ui/home-dashboard.js:155|toolbar|document.getElementById("homeDashboardToolbar")|需要进一步测试|
|src/ui/home-dashboard.js:157|action|button.dataset.homeAction|需要进一步测试|
|src/ui/home-dashboard.js:180|node||需要进一步测试|
|src/ui/home-dashboard.js:181|instanceId|node.dataset.homeCardInstance|需要进一步测试|
|src/ui/home-dashboard.js:183|controls|document.createElement("div")|需要进一步测试|
|src/ui/home-dashboard.js:192|panel|document.getElementById("homeDashboardAddPanel")|需要进一步测试|
|src/ui/home-dashboard.js:195|draft|layoutService.getDraft()|需要进一步测试|
|src/ui/home-dashboard.js:196|current|new Set(draft.instances.map((item) => item.typeId))|需要进一步测试|
|src/ui/home-dashboard.js:197|availableCore|TYPES.filter(([typeId]) => !current.has(typeId))|需要进一步测试|
|src/ui/home-dashboard.js:198|heading|document.createElement("strong")|需要进一步测试|
|src/ui/home-dashboard.js:201|hidden|draft.instances.filter((item) => !item.visible)|需要进一步测试|
|src/ui/home-dashboard.js:203|note|document.createElement("span")|需要进一步测试|
|src/ui/home-dashboard.js:208|instance||需要进一步测试|
|src/ui/home-dashboard.js:209|button|document.createElement("button")|需要进一步测试|
|src/ui/home-dashboard.js:215|[typeId]||需要进一步测试|
|src/ui/home-dashboard.js:216|button|document.createElement("button")|需要进一步测试|
|src/ui/home-dashboard.js:248|draft|layoutService?.getDraft()|需要进一步测试|
|src/ui/home-dashboard.js:250|next|{ ...draft, revision: Math.max(1, draft.revision + 1) }|需要进一步测试|
|src/ui/home-dashboard.js:251|result|repository.write(next, {       expectedRevision: repositoryRevision,     })|需要进一步测试|
|src/ui/home-dashboard.js:271|baseline|defaultLayout()|需要进一步测试|
|src/ui/home-dashboard.js:281|panel|document.getElementById("homeDashboardAddPanel")|需要进一步测试|
|src/ui/home-dashboard.js:288|restore|event.target.closest("[data-restore-card-id]")|需要进一步测试|
|src/ui/home-dashboard.js:295|button|event.target.closest("[data-home-action]")|需要进一步测试|
|src/ui/home-dashboard.js:323|button|event.target.closest("[data-add-card-type]")|需要进一步测试|
|src/ui/home-dashboard.js:333|button|event.target.closest("[data-home-card-action]")|需要进一步测试|
|src/ui/home-dashboard.js:335|id|button.dataset.instanceId|需要进一步测试|
|src/ui/home-dashboard.js:352|item|layoutService         .getDraft()         .instances.find((entry) => entry.instanceId === id)|需要进一步测试|
|src/ui/home-dashboard.js:368|delta|{       ArrowLeft: [-1, 0],       ArrowRight: [1, 0],       ArrowUp: [0, -1],       ArrowDown: [0, 1],     }[event.key]|需要进一步测试|
|src/ui/home-dashboard.js:377|item|layoutService       .getDraft()       .instances.find(         (entry) => entry.instanceId === event.target.dataset.instanceId,       )|需要进一步测试|
|src/ui/home-dashboard.js:396|handle|event.target.closest(       "[data-home-card-action='drag'],[data-home-card-action='resize']",     )|需要进一步测试|
|src/ui/home-dashboard.js:400|item|layoutService       .getDraft()       .instances.find(         (entry) => entry.instanceId === handle.dataset.instanceId,       )|需要进一步测试|
|src/ui/home-dashboard.js:430|drag|pointerEdit|需要进一步测试|
|src/ui/home-dashboard.js:434|gap|14|需要进一步测试|
|src/ui/home-dashboard.js:435|cellWidth|(gridElement.clientWidth - gap * 11) / 12|需要进一步测试|
|src/ui/home-dashboard.js:436|cellHeight|48|需要进一步测试|
|src/ui/home-dashboard.js:437|dx|event.clientX - drag.startX|需要进一步测试|
|src/ui/home-dashboard.js:438|dy|event.clientY - drag.startY|需要进一步测试|
|src/ui/home-dashboard.js:470|[typeId, selector]||需要进一步测试|
|src/ui/home-dashboard.js:472|valueId|selector.slice(1)|需要进一步测试|
|src/ui/home-dashboard.js:473|node|[...grid.querySelectorAll(".gp-kpi")].find((card) =>           card.querySelector(#${valueId}),         )|需要进一步测试|
|src/ui/home-dashboard.js:479|node|grid.querySelector(selector)|需要进一步测试|
|src/ui/home-dashboard.js:483|value|node.querySelector("strong")?.id|需要进一步测试|
|src/ui/home-dashboard.js:484|match|TYPES.find(([, selector]) => selector === #${value})|需要进一步测试|
|src/ui/home-dashboard.js:487|daily|grid.querySelector("#uiDailyGrid")|需要进一步测试|
|src/ui/home-dashboard.js:490|incoming|[...daily.children]|需要进一步测试|
|src/ui/home-dashboard.js:493|dailyTypes|new Set(         TYPES.filter(([, selector]) => selector.startsWith(".gp-daily-")).map(           ([typeId]) => typeId,         ),       )|需要进一步测试|
|src/ui/home-dashboard.js:498|node||需要进一步测试|
|src/ui/home-dashboard.js:502|node||需要进一步测试|
|src/ui/home-dashboard.js:503|match|TYPES.find(           ([, selector]) => !selector.startsWith("#") && node.matches(selector),         )|需要进一步测试|
|src/ui/home-dashboard.js:517|validated|root.HomeLayout.validateLayout(layout)|需要进一步测试|
|src/ui/home-dashboard.js:518|byType|new Map(       validated.instances.map((instance) => [instance.typeId, instance]),     )|需要进一步测试|
|src/ui/home-dashboard.js:526|instance|byType.get(node.dataset.homeCardType)|需要进一步测试|
|src/ui/home-dashboard.js:532|{ x, y, w, h }|instance.position|需要进一步测试|
|src/ui/home-dashboard.js:557|grid|moveIntoGrid()|需要进一步测试|
|src/ui/home-dashboard.js:584|stored|repository.read()|需要进一步测试|
|src/ui/home-dashboard.js:598|daily|grid.querySelector("#uiDailyGrid")|需要进一步测试|
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
|src/ui/item-modules.js:240|toggle|node("span", "ui-toggle")|需要进一步测试|
|src/ui/item-modules.js:241|track|node("span", "ui-toggle-track")|需要进一步测试|
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
|src/ui/item-score-cinematics.js:3|origin|null|需要进一步测试|
|src/ui/item-score-cinematics.js:4|timer|null|需要进一步测试|
|src/ui/item-score-cinematics.js:5|dialog|null|需要进一步测试|
|src/ui/item-score-cinematics.js:6|priorFocus|null|需要进一步测试|
|src/ui/item-score-cinematics.js:11|result|origin === id|需要进一步测试|
|src/ui/item-score-cinematics.js:28|targets|result.targets?.length       ? result.targets       : [{ name: "无可用目标", delta: 0 }]|需要进一步测试|
|src/ui/item-score-cinematics.js:50|p|DesktopUI.getPreferences()|需要进一步测试|
|src/ui/item-score-cinematics.js:60|data|payload(result)|需要进一步测试|
|src/ui/item-score-cinematics.js:76|targets|result.targets.length       ? result.targets       : [{ name: "无可用目标", delta: 0 }]|需要进一步测试|
|src/ui/item-score-cinematics.js:86|index|0|需要进一步测试|
|src/ui/item-score-cinematics.js:87|next|() => {       if (!dialog) return;       const target = targets[index++];       const label = target.blocked         ? "防御成功"         : target.delta           ?|需要进一步测试|
|src/ui/item-score-cinematics.js:89|target|targets[index++]|需要进一步测试|
|src/ui/item-score-cinematics.js:90|label|target.blocked         ? "防御成功"         : target.delta           ? ${target.delta > 0 ? "+" : ""}${target.delta} 分           : target.effectChanged           |需要进一步测试|
|src/ui/item-score-cinematics.js:114|sessions|new Map()|需要进一步测试|
|src/ui/item-score-cinematics.js:115|duration|1900|需要进一步测试|
|src/ui/item-score-cinematics.js:117|p|DesktopUI.getPreferences()|需要进一步测试|
|src/ui/item-score-cinematics.js:133|score|card.querySelector(".row-score")|需要进一步测试|
|src/ui/item-score-cinematics.js:135|cardRect|card.getBoundingClientRect()|需要进一步测试|
|src/ui/item-score-cinematics.js:136|scoreRect|score.getBoundingClientRect()|需要进一步测试|
|src/ui/item-score-cinematics.js:137|x|scoreRect.left + scoreRect.width / 2 - cardRect.left - cardRect.width / 2|需要进一步测试|
|src/ui/item-score-cinematics.js:139|y|scoreRect.top + scoreRect.height / 2 - cardRect.top - cardRect.height / 2|需要进一步测试|
|src/ui/item-score-cinematics.js:141|layer|document.createElement("div")|需要进一步测试|
|src/ui/item-score-cinematics.js:143|number|document.createElement("div")|需要进一步测试|
|src/ui/item-score-cinematics.js:154|elapsed|Math.max(0, performance.now() - session.started)|需要进一步测试|
|src/ui/item-score-cinematics.js:155|wash|layer.animate(       [         { clipPath: "circle(0% at 85% 35%)" },         { clipPath: "circle(150% at 85% 35%)", offset: 0.23 },         { clipPath: "circle|需要进一步测试|
|src/ui/item-score-cinematics.js:164|move|number.animate(       [         {           transform: translate(calc(-50% + ${x}px),calc(-50% + ${y}px)) scale(.6),           opacity: 0,         },         |需要进一步测试|
|src/ui/item-score-cinematics.js:190|update|() => {       if (sessions.get(String(session.id)) !== session ／／ !number.isConnected)         return;       const raw = Math.min(         1,         Math.max(0|需要进一步测试|
|src/ui/item-score-cinematics.js:193|raw|Math.min(         1,         Math.max(0, (performance.now() - session.started - 600) / 650),       )|需要进一步测试|
|src/ui/item-score-cinematics.js:199|t|1 - Math.pow(1 - raw, 5)|需要进一步测试|
|src/ui/item-score-cinematics.js:210|g|state.groups.find((g) => g.id === session.id)|需要进一步测试|
|src/ui/item-score-cinematics.js:212|score|document.getElementById("score-val-" + session.id)|需要进一步测试|
|src/ui/item-score-cinematics.js:221|left|updates.length|需要进一步测试|
|src/ui/item-score-cinematics.js:226|update||需要进一步测试|
|src/ui/item-score-cinematics.js:227|g|state.groups.find((g) => g.id === update.groupId)|需要进一步测试|
|src/ui/item-score-cinematics.js:230|prior|sessions.get(String(g.id))|需要进一步测试|
|src/ui/item-score-cinematics.js:237|score|document.getElementById("score-val-" + g.id)|需要进一步测试|
|src/ui/item-score-cinematics.js:243|prior|sessions.get(String(g.id))|需要进一步测试|
|src/ui/item-score-cinematics.js:249|color|GodpowerUIModel.badgeColors(g.color)|需要进一步测试|
|src/ui/item-score-cinematics.js:250|raw|color.background.slice(1)|需要进一步测试|
|src/ui/item-score-cinematics.js:251|channels|[0, 2, 4]         .map((i) => parseInt(raw.slice(i, i + 2), 16) / 255)         .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))|需要进一步测试|
|src/ui/item-score-cinematics.js:254|luminance|channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722|需要进一步测试|
|src/ui/item-score-cinematics.js:257|session|{         id: g.id,         from: update.start,         to: update.target,         color: color.background,         ink: color.foreground,         started: perf|需要进一步测试|
|src/ui/item-score-cinematics.js:279|session|sessions.get(String(id))|需要进一步测试|
|src/ui/item-score-cinematics.js:283|session||需要进一步测试|
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
|src/ui/model.js:185|linear|raw       .match(/../g)       .map((v) => parseInt(v, 16) / 255)       .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))|需要进一步测试|
|src/ui/model.js:189|luminance|linear.reduce(       (sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i],       0,     )|需要进一步测试|
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
|src/ui/save-file-settings.js:5|$|(id) => document.getElementById(id)|需要进一步测试|
|src/ui/save-file-settings.js:6|busy|false|需要进一步测试|
|src/ui/save-file-settings.js:9|node|$("saveFileStatus")|需要进一步测试|
|src/ui/save-file-settings.js:16|path|$("saveFilePath")|需要进一步测试|
|src/ui/save-file-settings.js:17|input|$("saveFilePathInput")|需要进一步测试|
|src/ui/save-file-settings.js:26|size|info.bytes > 0 ? ${(info.bytes / 1024).toFixed(1)} KB : "尚未写入"|需要进一步测试|
|src/ui/save-file-settings.js:43|info|await ClassroomSaveFile.refreshInfo()|需要进一步测试|
|src/ui/save-file-settings.js:61|result|await ClassroomSaveFile.choose()|需要进一步测试|
|src/ui/save-file-settings.js:74|value|$("saveFilePathInput")?.value?.trim()|需要进一步测试|
|src/ui/save-file-settings.js:81|result|await ClassroomSaveFile.setPath(value)|需要进一步测试|
|src/ui/save-file-settings.js:96|result|await ClassroomSaveFile.reset()|需要进一步测试|
|src/ui/save-file-settings.js:108|accepted|await programConfirmV28(       "从存档文件读取会替换当前课堂（小组、积分、道具、历史）。\n建议先导出备份。确定继续？",       { title: "从文件读取课堂", okText: "读取并替换", cancelText: "取消" },     )|需要进一步测试|
|src/ui/save-file-settings.js:116|result|await ClassroomSaveFile.loadFromFile()|需要进一步测试|
|src/ui/settings-layout.js:2|GodPowerSettingsLayout|(() => {   const categories = [     ["rules", "battle", "课堂与比赛规则", "沿用现有规则与即时保存方式"],     ["appearance", "home", "外观与界面", "壁纸、显示模式与视图比例"],     ["motion", "spark"|需要进一步测试|
|src/ui/settings-layout.js:3|categories|[     ["rules", "battle", "课堂与比赛规则", "沿用现有规则与即时保存方式"],     ["appearance", "home", "外观与界面", "壁纸、显示模式与视图比例"],     ["motion", "spark", "动画与特效", "可中断的界面动效，不影响业务结果"]|需要进一步测试|
|src/ui/settings-layout.js:39|box|document.createElement(collapsed ? "details" : "div")|需要进一步测试|
|src/ui/settings-layout.js:48|body|box.lastElementChild|需要进一步测试|
|src/ui/settings-layout.js:53|marked|(name) => [       ...shell.querySelectorAll([data-settings-group="${name}"]),     ]|需要进一步测试|
|src/ui/settings-layout.js:79|icons|$("#uiIconManagerV26")?.parentElement|需要进一步测试|
|src/ui/settings-layout.js:98|rosterTitle|$(       "#uiSettingsRoster [data-settings-group='roster']:not(.setting-item)",     )|需要进一步测试|
|src/ui/settings-layout.js:102|sound|$("#settingsV26_sound")|需要进一步测试|
|src/ui/settings-layout.js:127|itemSounds|$("#itemFxSoundListV26")?.parentElement|需要进一步测试|
|src/ui/settings-layout.js:139|itemLibrary|$("#settingsV26_items")|需要进一步测试|
|src/ui/settings-layout.js:148|editor|$("#uiBankEditor")|需要进一步测试|
|src/ui/settings-layout.js:149|bankNodes|[       editor.previousElementSibling.previousElementSibling,       editor.previousElementSibling,       editor,       editor.nextElementSibling,       $("#uiBa|需要进一步测试|
|src/ui/settings-layout.js:164|data|$("#settingsV26_data")|需要进一步测试|
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
|src/ui/themes.js:107|current|active|需要进一步测试|
|src/ui/themes.js:109|animation||需要进一步测试|
|src/ui/themes.js:117|persisted|true|需要进一步测试|
|src/ui/themes.js:124|prefs|typeof DesktopUI !== "undefined" ? DesktopUI.getPreferences() : {}|需要进一步测试|
|src/ui/themes.js:126|reduce|matchMedia("(prefers-reduced-motion: reduce)").matches|需要进一步测试|
|src/ui/themes.js:137|overlay|document.createElement("div")|需要进一步测试|
|src/ui/themes.js:145|result|new Promise((resolve) => {       active = {         element: overlay,         animations: [],         resolve: () => resolve({ ok: true, persisted }),       }; |需要进一步测试|
|src/ui/themes.js:152|current|active|需要进一步测试|
|src/ui/themes.js:156|motion|overlay.animate(       [         { opacity: 0 },         { opacity: 1, offset: 0.24 },         { opacity: 1, offset: 0.6 },         { opacity: 0 },       ],    |需要进一步测试|
|src/ui/themes.js:165|content|overlay       .querySelector(".gp-theme-transition-content")       .animate(         [           { opacity: 0, transform: "translateY(24px) scale(.95)" },      |需要进一步测试|
|src/ui/themes.js:174|ribbon|overlay.querySelector(".gp-theme-ribbon").animate(       [         { transform: "translateX(-35%) rotate(-12deg)", opacity: 0 },         { transform: "translate|需要进一步测试|
|src/ui/themes.js:192|section|document.createElement("section")|需要进一步测试|
|src/ui/tooltips.js:5|id|"godpower-hover-tooltip"|需要进一步测试|
|src/ui/tooltips.js:6|pointerOwner|null|需要进一步测试|
|src/ui/tooltips.js:7|focusOwner|null|需要进一步测试|
|src/ui/tooltips.js:8|active|null|需要进一步测试|
|src/ui/tooltips.js:9|tooltip|null|需要进一步测试|
|src/ui/tooltips.js:24|host|document.createElement("div")|需要进一步测试|
|src/ui/tooltips.js:35|current|owner.getAttribute("aria-describedby")|需要进一步测试|
|src/ui/tooltips.js:43|tokens|current       .split(/\s+/)       .filter((token) => token && token !== id)|需要进一步测试|
|src/ui/tooltips.js:64|rect|active.owner.getBoundingClientRect()|需要进一步测试|
|src/ui/tooltips.js:65|margin|8|需要进一步测试|
|src/ui/tooltips.js:66|width|tooltip.offsetWidth|需要进一步测试|
|src/ui/tooltips.js:67|height|tooltip.offsetHeight|需要进一步测试|
|src/ui/tooltips.js:68|left|Math.max(       margin,       Math.min(         rect.left + (rect.width - width) / 2,         window.innerWidth - width - margin,       ),     )|需要进一步测试|
|src/ui/tooltips.js:75|below|rect.bottom + margin|需要进一步测试|
|src/ui/tooltips.js:76|preferredTop|below + height <= window.innerHeight - margin         ? below         : Math.max(margin, rect.top - height - margin)|需要进一步测试|
|src/ui/tooltips.js:80|top|Math.max(       margin,       Math.min(preferredTop, window.innerHeight - height - margin),     )|需要进一步测试|
|src/ui/tooltips.js:117|previous|active|需要进一步测试|
|src/ui/tooltips.js:134|owner|pointerOwner ／／ focusOwner|需要进一步测试|
|src/ui/tooltips.js:138|bubble|getTooltip()|需要进一步测试|
|src/ui/tooltips.js:176|owner|titleOwner(event.target)|需要进一步测试|
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
|src/ui/window-motion.js:2|GodPowerWindowMotion|Object.freeze({   create({ animate, canAnimate, motionEase, getPreferences }) {     // Exit animations have one owner and one completion. No scoring or random d|需要进一步测试|
|src/ui/window-motion.js:5|closingWindows|new Map()|需要进一步测试|
|src/ui/window-motion.js:7|pending|closingWindows.get(root)|需要进一步测试|
|src/ui/window-motion.js:17|pending|closingWindows.get(root)|需要进一步测试|
|src/ui/window-motion.js:26|preferences|getPreferences()|需要进一步测试|
|src/ui/window-motion.js:28|surface|root.querySelector(".ui-function-surface")|需要进一步测试|
|src/ui/window-motion.js:39|visual|getComputedStyle(surface)|需要进一步测试|
|src/ui/window-motion.js:40|from|{         opacity: visual.opacity,         translate: visual.translate,         scale: visual.scale,       }|需要进一步测试|
|src/ui/window-motion.js:45|backdropOpacity|getComputedStyle(root).opacity|需要进一步测试|
|src/ui/window-motion.js:47|pending|{         finish,         inert: root.inert,         animation: null,         backdrop: null,       }|需要进一步测试|
|src/ui/window-motion.js:99|root||需要进一步测试|
|src/ui/about-view.js:3|about|document.getElementById("aboutMain")|需要进一步测试|
|src/ui/about-view.js:5|walker|document.createTreeWalker(about, NodeFilter.SHOW_TEXT)|需要进一步测试|
|src/ui/about-view.js:6|nodes|[]|需要进一步测试|
|src/ui/about-view.js:22|m|document.getElementById("aboutMain")|需要进一步测试|
|src/ui/about-view.js:37|d|ITEM_DEFS[k]|需要进一步测试|
|src/ui/about-view.js:38|exact|(typeof GROUP_ITEM_DESC_V2182 !== "undefined" &&             GROUP_ITEM_DESC_V2182[k]) ／／           (typeof ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715 !== "undefined"|需要进一步测试|
|src/ui/about-view.js:45|funny|ITEM_FUNNY_COPY_V2184[k] ／／           "它有自己的工作，而且暂时没有向策划提交辞职申请。"|需要进一步测试|
|src/ui/about-view.js:48|tag|ITEM_FUNNY_TAG_V2184[k] ／／ "道具"|需要进一步测试|
|src/ui/about-view.js:49|tip|ITEM_TIPS_OVERRIDE_V2199[k] ／／           (typeof ITEM_TIPS_V218 !== "undefined" && ITEM_TIPS_V218[k]) ／／           "根据排名和当前局势使用，别只因为图标好看就按。"|需要进一步测试|
|src/ui/about-view.js:71|m|document.getElementById("aboutMain")|需要进一步测试|

## 动画、计时器、事件监听注册与清理

|位置|调用|参数摘要|分类|
|---|---|---|---|
|src/application/round-settlement.js:106|setTimeout|() => {         card.classList.remove("anim-win", "anim-loss");       }; 1100|需要进一步测试|
|src/core/picker-bridge.js:59|clearInterval|slotEngine.timerGroup|需要进一步测试|
|src/core/picker-bridge.js:59|clearInterval|slotEngine.timerStudent|需要进一步测试|
|src/runtime/archives/settlement-actions.js:35|setTimeout|() => {     if (input) {       input.focus();       input.select();     }   }; 60|需要进一步测试|
|src/runtime/archives/settlement-actions.js:124|setTimeout|() => playSound("roll_win"); 450|需要进一步测试|
|src/runtime/archives/settlement-actions.js:215|requestAnimationFrame|loop|需要进一步测试|
|src/runtime/archives/settlement-actions.js:217|cancelAnimationFrame|confettiAnimationId|需要进一步测试|
|src/runtime/archives/settlement-actions.js:223|cancelAnimationFrame|confettiAnimationId|需要进一步测试|
|src/runtime/audio/battle-playback.js:3|clearTimeout|id|需要进一步测试|
|src/runtime/audio/battle-playback.js:51|setTimeout|() => {     scheduleDualLoopChunk(nextStartTime, loopStartSec);   }; delayMs|需要进一步测试|
|src/runtime/audio/battle-playback.js:127|setTimeout|() => {       bgmPreloadNextSet();     }; 1000|需要进一步测试|
|src/runtime/audio/battle-playback.js:188|clearTimeout|bgmEngine.transitionTimer|需要进一步测试|
|src/runtime/audio/battle-playback.js:222|setTimeout|() => {         bgmEngine.transitionTimer = null;         if (bgmEngine.state === "TRANSITION") {           const stillAllIn = checkAllInRatio();           if (stillAllIn) {       ; Math.max(0, (battleResumeTime - audioCtx.currentTime) * 1000)|需要进一步测试|
|src/runtime/audio/battle-playback.js:245|clearTimeout|bgmEngine.transitionTimer|需要进一步测试|
|src/runtime/audio/battle-playback.js:303|clearTimeout|bgmEngine.transitionTimer|需要进一步测试|
|src/runtime/audio/battle-playback.js:330|setTimeout|() => {         bgmEngine.victoryFadeTimer = null;         if (bgmEngine.battleSource) {           try {             bgmEngine.battleSource.stop();           } catch (e) {}        ; Math.max(0, (triggerTime + 0.055 - now) * 1000)|需要进一步测试|
|src/runtime/audio/battle-playback.js:372|setTimeout|() => {           bgmEngine.victoryTimer = null;           if (bgmEngine.state === "VICTORY") {             bgmStopAll();             if (callback) callback();           }         ; Math.max(0, (triggerTime - now + 3.0) * 1000)|需要进一步测试|
|src/runtime/audio/battle-playback.js:392|clearTimeout|bgmEngine.victoryTimer|需要进一步测试|
|src/runtime/audio/battle-playback.js:396|clearTimeout|bgmEngine.victoryFadeTimer|需要进一步测试|
|src/runtime/audio/battle-playback.js:400|clearTimeout|bgmEngine.transitionTimer|需要进一步测试|
|src/runtime/audio/draw-audio-lifecycle.js:13|clearInterval|drawTickTimerV2171|需要进一步测试|
|src/runtime/audio/draw-audio-lifecycle.js:17|clearTimeout|drawRevealTimerV2171|需要进一步测试|
|src/runtime/audio/draw-audio-lifecycle.js:75|clearInterval|drawTickTimerV2171|需要进一步测试|
|src/runtime/audio/draw-audio-lifecycle.js:104|setInterval|() => {     if (generation !== drawAudioGenerationV2171) {       clearInterval(drawTickTimerV2171);       drawTickTimerV2171 = null;       return;     }     if (tickCount++ < 13) {; tickInterval|需要进一步测试|
|src/runtime/audio/draw-audio-lifecycle.js:106|clearInterval|drawTickTimerV2171|需要进一步测试|
|src/runtime/audio/draw-audio-lifecycle.js:113|clearInterval|drawTickTimerV2171|需要进一步测试|
|src/runtime/audio/draw-audio-lifecycle.js:118|setTimeout|() => {     drawRevealTimerV2171 = null;     finishDrawAudioV2171(generation);   }; duration|需要进一步测试|
|src/runtime/audio/effects-volume.js:99|setTimeout|installSfxVolumeSliderV2176; 0|需要进一步测试|
|src/runtime/audio/effects-volume.js:108|setTimeout|installSfxVolumeSliderV2176; 0|需要进一步测试|
|src/runtime/audio/effects-volume.js:115|document.addEventListener|"DOMContentLoaded"; () => setTimeout(installSfxVolumeSliderV2176, 450); { once: true }|需要进一步测试|
|src/runtime/audio/effects-volume.js:117|setTimeout|installSfxVolumeSliderV2176; 450|需要进一步测试|
|src/runtime/audio/effects-volume.js:121|setTimeout|installSfxVolumeSliderV2176; 0|需要进一步测试|
|src/runtime/audio/fx-bundle-transfer.js:100|setTimeout|() => URL.revokeObjectURL(url); 1000|需要进一步测试|
|src/runtime/audio/item-sound-bindings.js:151|setInterval|() => {     if (n++ < 13) playSound("item_draw_tick");     else clearInterval(timer);   }; interval|需要进一步测试|
|src/runtime/audio/item-sound-bindings.js:153|clearInterval|timer|需要进一步测试|
|src/runtime/audio/item-sound-bindings.js:155|setTimeout|() => {     clearInterval(timer);     playSound("item_draw_reveal");   }; ms|需要进一步测试|
|src/runtime/audio/item-sound-bindings.js:156|clearInterval|timer|需要进一步测试|
|src/runtime/audio/item-sound-map.js:207|setTimeout|() => {     try {       renderItemFxSoundListV26();     } catch (e) {}   }; 180|需要进一步测试|
|src/runtime/audio/item-sound-map.js:218|setTimeout|() => {     try {       renderItemFxSoundListV26();     } catch (e) {}   }; 120|需要进一步测试|
|src/runtime/audio/item-sound-settings.js:61|setTimeout|() => playSound(itemSoundCategoryV26(k)); 55|需要进一步测试|
|src/runtime/audio/menu-transport.js:242|clearTimeout|menuReloadTimer|需要进一步测试|
|src/runtime/audio/menu-transport.js:243|setTimeout|async () => {     menuReloadTimer = null;     const key = menuBgm.currentKey;     if (!key ／／ !menuBgm.active) return;     delete menuBgm.buffers[key];     menuBgm.uploadedKeys.del; 250|需要进一步测试|
|src/runtime/audio/picker-roll.js:56|setTimeout|() => {     try {       rollLoopNode.stop();     } catch (e) {}     rollLoopNode = null;     rollLoopGain = null;     if (cb) cb();   }; 160|需要进一步测试|
|src/runtime/audio/resource-loading.js:85|setTimeout|() => res(); 1500|需要进一步测试|
|src/runtime/audio/session-cache.js:11|window.setTimeout|fn; Math.min(timeout, 800)|需要进一步测试|
|src/runtime/bootstrap/classroom-startup.js:1|window.addEventListener|"DOMContentLoaded"; () => {   if (state.zoomLevel !== 1.0) {     document.body.style.zoom = state.zoomLevel;   }   initResizerDrag();   renderAll();   renderWelcomePage();   startWelcomeClock();    //|需要进一步测试|
|src/runtime/bootstrap/classroom-startup.js:39|setInterval|() => {       if (audioCtx && audioCtx.state === "running") {         clearInterval(resumeRetryTimer);         resumeRetryTimer = null;         hideAudioHint();         return;    ; 1000|需要进一步测试|
|src/runtime/bootstrap/classroom-startup.js:41|clearInterval|resumeRetryTimer|需要进一步测试|
|src/runtime/bootstrap/classroom-startup.js:52|clearInterval|resumeRetryTimer|需要进一步测试|
|src/runtime/bootstrap/classroom-startup.js:87|window.addEventListener|ev; unlockByGesture; { once: true, passive: true }|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:28|clearTimeout|showHandEffectV218._timer|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:29|setTimeout|() => overlay.classList.remove("active"); 2200|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:47|setTimeout|() => showHandEffectV218(key, before); 60|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:73|setTimeout|fire; 520|需要进一步测试|
|src/runtime/classroom/hand-reward-controls.js:100|setTimeout|renderHandRewardControlsV218; 0|需要进一步测试|
|src/runtime/competition/round-actions.js:32|setTimeout|() => res(false); 2500|需要进一步测试|
|src/runtime/history/boot-and-settings-compat.js:8|window.addEventListener|"pagehide"; () => {   try {     saveState();     persistHistoryV26();   } catch (e) {} }|需要进一步测试|
|src/runtime/history/boot-and-settings-compat.js:14|document.addEventListener|"visibilitychange"; () => {   if (document.visibilityState === "hidden") {     try {       saveState();       persistHistoryV26();     } catch (e) {}   } }|需要进一步测试|
|src/runtime/items/attack-legacy.js:29|setTimeout|() => {     const c = document.querySelector(.group-row-card[data-group-id="${id}"]);     if (c) {       c.classList.add("effect-bomb");       setTimeout(() => c.classList.remove; 30|需要进一步测试|
|src/runtime/items/attack-legacy.js:33|setTimeout|() => c.classList.remove("effect-bomb"); 900|需要进一步测试|
|src/runtime/items/attack-legacy.js:39|clearInterval|bulletTimer|需要进一步测试|
|src/runtime/items/attack-legacy.js:40|setInterval|() => {     let any = false;     ensureItemState();     state.groups.forEach((g) => {       if (!g.itemEffect ／／ g.itemEffect.type !== "bullet") return;       any = true;       con; 350|需要进一步测试|
|src/runtime/items/attack-legacy.js:60|clearInterval|bulletTimer|需要进一步测试|
|src/runtime/items/attack-legacy.js:72|setTimeout|startBlooperClock; 500|需要进一步测试|
|src/runtime/items/card-effects-legacy.js:81|setTimeout|() => {     card.classList.remove("card-use-fx", CARD_ITEM_FX_CLASS[key] ／／ "cfx-rise");     b.remove();   }; 1850|需要进一步测试|
|src/runtime/items/card-effects-legacy.js:118|setTimeout|() => {     card.classList.remove("card-hit-fx", "card-defend-fx", "card-heal-fx");     card.style.removeProperty("--hitc");   }; 1600|需要进一步测试|
|src/runtime/items/card-effects-legacy.js:151|setTimeout|() => playTargetCardFx(id, key, beneficial ? "heal" : "hit"); 120 + n * 70|需要进一步测试|
|src/runtime/items/catalog-adapters.js:202|setTimeout|() => patchVisibleGodManagerV283(gid); 0|需要进一步测试|
|src/runtime/items/catalog-adapters.js:228|setTimeout|() => {       appendMissingEncyclopediaV283();     }; 0|需要进一步测试|
|src/runtime/items/catalog-adapters.js:233|window.addEventListener|"DOMContentLoaded"; () =>   setTimeout(() => {     appendMissingEncyclopediaV283();     patchItemIconSettingsV283();   }, 80)|需要进一步测试|
|src/runtime/items/catalog-adapters.js:234|setTimeout|() => {     appendMissingEncyclopediaV283();     patchItemIconSettingsV283();   }; 80|需要进一步测试|
|src/runtime/items/catalog-refresh.js:39|window.addEventListener|"DOMContentLoaded"; () =>   setTimeout(refresh26ItemInterfacesV284, 120)|需要进一步测试|
|src/runtime/items/catalog-refresh.js:40|setTimeout|refresh26ItemInterfacesV284; 120|需要进一步测试|
|src/runtime/items/defense-chain-compat.js:90|setTimeout|() => flashBomb(t.id); 40 + n * 80|需要进一步测试|
|src/runtime/items/defense-chain-compat.js:180|setTimeout|() => playAttackTargetFxV2116(target.id, "lightning", true); 120|需要进一步测试|
|src/runtime/items/defense-chain-compat.js:193|setTimeout|() => playAttackTargetFxV2116(target.id, "lightning", true); 120|需要进一步测试|
|src/runtime/items/draw-flow.js:21|setInterval|() => {     if (generation !== drawAudioGenerationV2171) {       clearInterval(drawTickTimerV2171);       drawTickTimerV2171 = null;       return;     }     if (tickCount++ < 11) {; tickInterval|需要进一步测试|
|src/runtime/items/draw-flow.js:23|clearInterval|drawTickTimerV2171|需要进一步测试|
|src/runtime/items/draw-flow.js:30|clearInterval|drawTickTimerV2171|需要进一步测试|
|src/runtime/items/draw-flow.js:35|setTimeout|() => {     drawRevealTimerV2171 = null;     finishDrawAudioV2171(generation);   }; duration|需要进一步测试|
|src/runtime/items/draw-flow.js:151|requestAnimationFrame|frame|需要进一步测试|
|src/runtime/items/draw-flow.js:171|setTimeout|() => {       if (!isCurrent()) return;       overlays.forEach((node, id) => {         BattleMotion.fadeDraw(node);         setTimeout(() => {           if (!isCurrent()) return;  ; ITEM_DRAW_RESULT_HOLD_V21712|需要进一步测试|
|src/runtime/items/draw-flow.js:175|setTimeout|() => {           if (!isCurrent()) return;           removeOverlay(id, node);         }; ITEM_DRAW_FADE_V21712 + 20|需要进一步测试|
|src/runtime/items/draw-flow.js:181|setTimeout|() => {         if (!isCurrent()) return;         activeGlobalItemDraw = null;         itemDrawBusy = false;         v213SkipNextReorderAnimation = true;         renderAll();      ; ITEM_DRAW_FADE_V21712 + 35|需要进一步测试|
|src/runtime/items/draw-flow.js:261|requestAnimationFrame|frame|需要进一步测试|
|src/runtime/items/draw-flow.js:369|requestAnimationFrame|frame|需要进一步测试|
|src/runtime/items/draw-flow.js:451|requestAnimationFrame|frame|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:198|setTimeout|refreshDrawCooldownInfoV21710; 0|需要进一步测试|
|src/runtime/items/draw-session-throttle.js:216|setTimeout|() => {   try {     refreshDrawCooldownInfoV21710();   } catch (e) {} }; 300|需要进一步测试|
|src/runtime/items/draw-throttle-legacy.js:178|setTimeout|() => {   try {     installDrawCooldownInfoV2179();   } catch (e) {} }; 300|需要进一步测试|
|src/runtime/items/drop-uniqueness-and-reset.js:215|clearInterval|bulletTimer|需要进一步测试|
|src/runtime/items/drop-uniqueness-and-reset.js:252|setTimeout|installClearItemsSettingV2172; 0|需要进一步测试|
|src/runtime/items/drop-uniqueness-and-reset.js:260|setTimeout|installClearItemsSettingV2172; 0|需要进一步测试|
|src/runtime/items/drop-uniqueness-and-reset.js:266|document.addEventListener|"DOMContentLoaded"; () => setTimeout(installClearItemsSettingV2172, 420); { once: true }|需要进一步测试|
|src/runtime/items/drop-uniqueness-and-reset.js:268|setTimeout|installClearItemsSettingV2172; 420|需要进一步测试|
|src/runtime/items/drop-uniqueness-and-reset.js:272|setTimeout|installClearItemsSettingV2172; 0|需要进一步测试|
|src/runtime/items/encyclopedia-and-icons.js:68|setTimeout|() => URL.revokeObjectURL(a.href); 1000|需要进一步测试|
|src/runtime/items/feature-switch.js:58|window.addEventListener|"DOMContentLoaded"; () =>   setTimeout(() => {     installCommunismModeSetting();     applyCommunismMode();   }, 160)|需要进一步测试|
|src/runtime/items/feature-switch.js:59|setTimeout|() => {     installCommunismModeSetting();     applyCommunismMode();   }; 160|需要进一步测试|
|src/runtime/items/feedback-and-icons.js:109|clearTimeout|handItemDrawFinishTimer|需要进一步测试|
|src/runtime/items/flower-charges-recovery.js:39|window.addEventListener|"DOMContentLoaded"; () => {   setTimeout(repairFlowerChargesV21719, 40); }|需要进一步测试|
|src/runtime/items/flower-charges-recovery.js:40|setTimeout|repairFlowerChargesV21719; 40|需要进一步测试|
|src/runtime/items/group-encyclopedia.js:143|requestAnimationFrame|syncGroupItemInfoV2182|需要进一步测试|
|src/runtime/items/group-encyclopedia.js:152|setTimeout|syncGroupItemInfoV2182; 0|需要进一步测试|
|src/runtime/items/group-encyclopedia.js:158|setTimeout|syncGroupItemInfoV2182; 0|需要进一步测试|
|src/runtime/items/group-window.js:375|window.addEventListener|"DOMContentLoaded"; () => {   ensureItemState();   renderAll();   startBulletTimer();   startBlooperClock(); }|需要进一步测试|
|src/runtime/items/hand-reward-lifecycle.js:9|clearInterval|handItemDrawTimer|需要进一步测试|
|src/runtime/items/hand-reward-lifecycle.js:13|clearTimeout|handItemDrawFinishTimer|需要进一步测试|
|src/runtime/items/hand-reward-lifecycle.js:118|setTimeout|() => {     const cards = [...document.querySelectorAll("#itemWindowBody .item-card")];     if (cards[idx]) {       cards[idx].style.outline = "3px solid #38bdf8";       cards[idx]; 80|需要进一步测试|
|src/runtime/items/inventory-recovery.js:44|window.addEventListener|"DOMContentLoaded"; () => {   setTimeout(repairDuplicateInventoryV21718, 20); }|需要进一步测试|
|src/runtime/items/inventory-recovery.js:45|setTimeout|repairDuplicateInventoryV21718; 20|需要进一步测试|
|src/runtime/items/lightning-and-hit-legacy.js:55|setTimeout|() => {     card.classList.remove(cls, "card-defend-fx");     badge.remove();     card.style.removeProperty("--hitc");   }; 1750|需要进一步测试|
|src/runtime/items/lightning-and-hit-legacy.js:72|setTimeout|() => playAttackTargetFxV2116(target.id, "lightning", true); 120|需要进一步测试|
|src/runtime/items/lightning-and-hit-legacy.js:85|setTimeout|() => playAttackTargetFxV2116(target.id, "lightning", true); 120|需要进一步测试|
|src/runtime/items/lightning-and-hit-legacy.js:110|setTimeout|() => playAttackTargetFxV2116(target.id, "lightning", false); 120|需要进一步测试|
|src/runtime/items/lightning-and-hit-legacy.js:119|setTimeout|() => playCasterCardFx(key, casterId); 30|需要进一步测试|
|src/runtime/items/queue-adapters.js:177|setTimeout|() => slots[0]?.classList.remove("queue-promoted"); 1150|需要进一步测试|
|src/runtime/items/queue-adapters.js:203|window.addEventListener|"DOMContentLoaded"; () =>   setTimeout(() => {     try {       renderAll();     } catch (e) {}   }, 220)|需要进一步测试|
|src/runtime/items/queue-adapters.js:204|setTimeout|() => {     try {       renderAll();     } catch (e) {}   }; 220|需要进一步测试|
|src/runtime/items/ranking-and-drop-legacy.js:46|setTimeout|() => d.remove(); 1900|需要进一步测试|
|src/runtime/items/spiny-cooldown.js:68|setTimeout|() => {   try {     refreshDrawCooldownInfoV21710();   } catch (e) {} }; 350|需要进一步测试|
|src/runtime/items/status-normalization.js:49|window.addEventListener|"DOMContentLoaded"; () => {   setTimeout(() => {     try {       repairAllItemEffectsV21731();       renderAll();     } catch (e) {}   }, 100); }|需要进一步测试|
|src/runtime/items/status-normalization.js:50|setTimeout|() => {     try {       repairAllItemEffectsV21731();       renderAll();     } catch (e) {}   }; 100|需要进一步测试|
|src/runtime/picker/selection-engine.js:313|setInterval|() => {       const randomGrp = reelGrps[Math.floor(Math.random() * reelGrps.length)];       window.ClassroomAvatarDisplay?.renderRaffleReel(reelGrpText, randomGrp);     }; 70|需要进一步测试|
|src/runtime/picker/selection-engine.js:321|setInterval|() => {       const randomStu = reelStus[Math.floor(Math.random() * reelStus.length)];       window.ClassroomAvatarDisplay?.renderRaffleReel(         reelStuText,         randomStu; 50|需要进一步测试|
|src/runtime/picker/selection-engine.js:340|clearInterval|slotEngine.timerGroup|需要进一步测试|
|src/runtime/picker/selection-engine.js:341|clearInterval|slotEngine.timerStudent|需要进一步测试|
|src/runtime/storage/classroom-transfer.js:10|setTimeout|() => URL.revokeObjectURL(url); 1000|需要进一步测试|
|src/runtime/ui/admin-lock.js:13|setTimeout|() => document.getElementById("pwdInput").focus(); 80|需要进一步测试|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:43|setTimeout|() => updateHandScoreV214(id); 120|需要进一步测试|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:76|setTimeout|() => useItem(gid, 0); 0|需要进一步测试|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:88|window.addEventListener|"DOMContentLoaded"; () =>   setTimeout(() => {     applyModernFlatV217();     try {       renderGrid();     } catch (e) {}   }, 320)|需要进一步测试|
|src/runtime/ui/battle-appearance-and-hand-rewards.js:89|setTimeout|() => {     applyModernFlatV217();     try {       renderGrid();     } catch (e) {}   }; 320|需要进一步测试|
|src/runtime/ui/battle-order-compat.js:101|window.addEventListener|"DOMContentLoaded"; () =>   setTimeout(() => {     ensureGroupNumbersV213(true);     try {       renderAll();     } catch (e) {}     try {       renderItemEncyclopedia();     } catch (e) {}   }, 280)|需要进一步测试|
|src/runtime/ui/battle-order-compat.js:102|setTimeout|() => {     ensureGroupNumbersV213(true);     try {       renderAll();     } catch (e) {}     try {       renderItemEncyclopedia();     } catch (e) {}   }; 280|需要进一步测试|
|src/runtime/ui/card-transform-repair.js:7|window.addEventListener|"DOMContentLoaded"; () => {   setTimeout(clearBrokenCardTranslateV21720, 50); }|需要进一步测试|
|src/runtime/ui/card-transform-repair.js:8|setTimeout|clearBrokenCardTranslateV21720; 50|需要进一步测试|
|src/runtime/ui/defense-notices.js:23|node.addEventListener|"animationend"; remove; { once: true }|需要进一步测试|
|src/runtime/ui/defense-notices.js:24|setTimeout|remove; duration|需要进一步测试|
|src/runtime/ui/defense-notices.js:43|setTimeout|() => playSound(itemSoundCategoryV26(key)); 55|需要进一步测试|
|src/runtime/ui/defense-notices.js:54|setTimeout|() => playSound(itemSoundCategoryV26(key)); 55|需要进一步测试|
|src/runtime/ui/defense-notices.js:68|setTimeout|() => {               try {                 playTargetCardFx(id, key, heal ? "heal" : "hit");               } catch (e) {}             }; 100 + n * 60|需要进一步测试|
|src/runtime/ui/dock-tooltips.js:90|el.addEventListener|"mouseenter"; () => {     const tip = ensureDockHumorTipV2185();     tip.innerHTML = <b>${escapeHtml(d.name)}</b><span>${escapeHtml(d.copy)}</span>;     const r = el.getBoundingClientRect();  |需要进一步测试|
|src/runtime/ui/dock-tooltips.js:105|el.addEventListener|"mouseleave"; () =>     ensureDockHumorTipV2185().classList.remove("show")|需要进一步测试|
|src/runtime/ui/dock-tooltips.js:173|setTimeout|applyDockHumorV2185; 0|需要进一步测试|
|src/runtime/ui/dock-tooltips.js:174|setTimeout|applyDockHumorV2185; 250|需要进一步测试|
|src/runtime/ui/interface-copy.js:84|setTimeout|polishVisibleCopyV2187; 0|需要进一步测试|
|src/runtime/ui/interface-copy.js:89|window.addEventListener|"DOMContentLoaded"; () => {   polishVisibleCopyV2187();   setTimeout(polishVisibleCopyV2187, 120); }|需要进一步测试|
|src/runtime/ui/interface-copy.js:91|setTimeout|polishVisibleCopyV2187; 120|需要进一步测试|
|src/runtime/ui/member-search.js:9|setTimeout|() => input.focus(); 50|需要进一步测试|
|src/runtime/ui/navigation-and-clock.js:117|setInterval|updateWelcomeClock; 1000|需要进一步测试|
|src/runtime/ui/program-confirmation.js:28|document.removeEventListener|"keydown"; key|需要进一步测试|
|src/runtime/ui/program-confirmation.js:35|o.addEventListener|"click"; (e) => {       if (e.target === o) finish(false);     }|需要进一步测试|
|src/runtime/ui/program-confirmation.js:40|document.removeEventListener|"keydown"; key|需要进一步测试|
|src/runtime/ui/program-confirmation.js:44|document.removeEventListener|"keydown"; key|需要进一步测试|
|src/runtime/ui/program-confirmation.js:47|document.removeEventListener|"keydown"; key|需要进一步测试|
|src/runtime/ui/program-confirmation.js:51|document.addEventListener|"keydown"; key|需要进一步测试|
|src/runtime/ui/program-confirmation.js:56|window.addEventListener|"beforeunload"; () => {   try {     saveState();     persistHistoryV26();   } catch (e) {} }|需要进一步测试|
|src/runtime/ui/program-confirmation.js:62|window.addEventListener|"DOMContentLoaded"; () =>   setTimeout(repairPersistentItemsV28, 0)|需要进一步测试|
|src/runtime/ui/program-confirmation.js:63|setTimeout|repairPersistentItemsV28; 0|需要进一步测试|
|src/runtime/ui/rank-preview.js:54|setTimeout|() => {         try {           renderBattleRankPreviewV21721();         } catch (e) {}       }; 0|需要进一步测试|
|src/runtime/ui/rank-preview.js:64|window.addEventListener|"DOMContentLoaded"; () => {   setTimeout(() => {     try {       v213ForceRankSort = false;       renderBattleRankPreviewV21721();     } catch (e) {}   }, 80); }|需要进一步测试|
|src/runtime/ui/rank-preview.js:65|setTimeout|() => {     try {       v213ForceRankSort = false;       renderBattleRankPreviewV21721();     } catch (e) {}   }; 80|需要进一步测试|
|src/runtime/ui/round-flip.js:44|clearTimeout|roundStateFlipTimerV21726|需要进一步测试|
|src/runtime/ui/round-flip.js:48|requestAnimationFrame|() =>     requestAnimationFrame(() => {       moved.forEach((card) => {         card.style.setProperty(           "transition",           transform 750ms cubic-bezier(.2,.8,.2,1),|需要进一步测试|
|src/runtime/ui/round-flip.js:49|requestAnimationFrame|() => {       moved.forEach((card) => {         card.style.setProperty(           "transition",           transform 750ms cubic-bezier(.2,.8,.2,1),box-shadow .3s ease,border-color|需要进一步测试|
|src/runtime/ui/round-flip.js:59|setTimeout|() => {         moved.forEach((card) => {           card.style.setProperty("transition", "none", "important");           card.style.removeProperty("transform");           void card; 790|需要进一步测试|
|src/runtime/ui/round-flip.js:64|requestAnimationFrame|() => card.style.removeProperty("transition")|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:18|setTimeout|() => document.getElementById("modalCustomInput").focus(); 50|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:86|setTimeout|() => {     banner.classList.remove("show");     card.classList.remove("milestone-glow");   }; 2200|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:96|cancelAnimationFrame|activeScoreAnimId|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:108|cancelAnimationFrame|activeScoreAnimId|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:136|requestAnimationFrame|tick|需要进一步测试|
|src/runtime/ui/score-dialog-and-animation.js:149|requestAnimationFrame|tick|需要进一步测试|
|src/runtime/ui/score-motion.js:4|setTimeout|() => {     if (epoch === scoreAnimationEpoch) fn();   }; delay|需要进一步测试|
|src/runtime/ui/score-motion.js:17|clearTimeout|attackRenderTimerV21713|需要进一步测试|
|src/runtime/ui/score-motion.js:21|clearTimeout|queueItemScoreChangesV21732._timer|需要进一步测试|
|src/runtime/ui/score-motion.js:77|requestAnimationFrame|() => deltaEl.classList.add("play")|需要进一步测试|
|src/runtime/ui/score-motion.js:172|clearTimeout|queueItemScoreChangesV21732._timer|需要进一步测试|
|src/runtime/ui/settings-and-about.js:137|document.getElementById("aboutBackdrop")?.addEventListener|"click"; (e) => {   if (e.target.id === "aboutBackdrop") closeAbout(); }|需要进一步测试|
|src/runtime/ui/settings-and-about.js:140|document.getElementById("handRaiseBackdrop")?.addEventListener|"click"; (e) => {   if (e.target.id === "handRaiseBackdrop") closeHandRaise(); }|需要进一步测试|
|src/runtime/ui/settings-and-about.js:146|setTimeout|installSettingsTabs; 0|需要进一步测试|
|src/runtime/ui/settings-and-about.js:148|window.addEventListener|"DOMContentLoaded"; () => {   ensureV2State();   installSettingsTabs();   renderPickerInfo(); }|需要进一步测试|
|src/runtime/ui/settings-navigation-compat.js:116|window.addEventListener|"DOMContentLoaded"; () => {   const sub = document.querySelector("#view-settings .fullview-sub");   if (sub) sub.textContent = "功能、音效与音乐、道具图标、学生名单及数据管理。";   rebuildSettingsV26();   applyUiIconsV26(); |需要进一步测试|
|src/runtime/ui/settings-navigation-compat.js:121|setTimeout|() => {     renderItemFxSoundListV26();     persistHistoryV26();     saveState();   }; 400|需要进一步测试|
|src/runtime/ui/settings-navigation-compat.js:136|window.addEventListener|"resize"; syncVisualViewportV27; { passive: true }|需要进一步测试|
|src/runtime/ui/settings-navigation-compat.js:137|window.addEventListener|"orientationchange"; () => setTimeout(syncVisualViewportV27, 80); { passive: true }|需要进一步测试|
|src/runtime/ui/settings-navigation-compat.js:139|setTimeout|syncVisualViewportV27; 80|需要进一步测试|
|src/runtime/ui/settings-navigation-compat.js:143|window.visualViewport.addEventListener|"resize"; syncVisualViewportV27; {     passive: true,   }|需要进一步测试|
|src/runtime/ui/settings-navigation-compat.js:146|window.visualViewport.addEventListener|"scroll"; syncVisualViewportV27; {     passive: true,   }|需要进一步测试|
|src/runtime/ui/theme-dialog.js:58|setTimeout|() => ok.focus(); 30|需要进一步测试|
|src/runtime/ui/theme-dialog.js:66|setTimeout|() => ok.focus(); 30|需要进一步测试|
|src/runtime/ui/theme-dialog.js:82|document.addEventListener|"keydown"; (e) => {   const root = document.getElementById("themeDialogV21727");   if (!root?.classList.contains("active")) return;   if (e.key === "Escape") {     e.preventDefault();     clo|需要进一步测试|
|src/runtime/ui/toast.js:6|clearTimeout|toastTimer|需要进一步测试|
|src/runtime/ui/toast.js:18|setTimeout|() => {     t.classList.remove("show");     if (t.matches(":popover-open")) t.hidePopover();     toastTimer = null;   }; 3800|需要进一步测试|
|src/runtime/ui/wallpaper.js:140|window.addEventListener|"DOMContentLoaded"; initWallpaper|需要进一步测试|
|src/runtime/ui/welcome-score-sync.js:20|requestAnimationFrame|renderWelcomeAllV216|需要进一步测试|
|src/runtime/ui/welcome-score-sync.js:40|setTimeout|() => playSound(itemSoundCategoryV26(key)); 55|需要进一步测试|
|src/runtime/ui/welcome-score-sync.js:56|setTimeout|() => {                 try {                   playTargetCardFx(id, key, heal ? "heal" : "hit");                 } catch (e) {}               }; 100 + n * 60|需要进一步测试|
|src/runtime/ui/welcome-score-sync.js:77|banner.addEventListener|"animationend"; remove; { once: true }|需要进一步测试|
|src/runtime/ui/welcome-score-sync.js:78|setTimeout|remove; 3800|需要进一步测试|
|src/runtime/ui/welcome-score-sync.js:82|document.addEventListener|"DOMContentLoaded"; () => setTimeout(renderWelcomeAllV216, 120); { once: true }|需要进一步测试|
|src/runtime/ui/welcome-score-sync.js:84|setTimeout|renderWelcomeAllV216; 120|需要进一步测试|
|src/runtime/ui/welcome-score-sync.js:87|setTimeout|renderWelcomeAllV216; 120|需要进一步测试|
|src/ui/battle-grid.js:159|requestAnimationFrame|() =>       requestAnimationFrame(() =>         moved.forEach((card) => {           card.style.setProperty(             "transition",             transform ${V213_CARD_REORDER_MS}|需要进一步测试|
|src/ui/battle-grid.js:160|requestAnimationFrame|() =>         moved.forEach((card) => {           card.style.setProperty(             "transition",             transform ${V213_CARD_REORDER_MS}ms cubic-bezier(.2,.8,.2,1),box-sh|需要进一步测试|
|src/ui/battle-grid.js:169|setTimeout|() => {             /* 在“0 位移”状态下无动画清理内联 transform，避免清理动作被识别成第二段动画。 */             card.style.setProperty("transition", "none", "important");             card.style.removeProperty(; V213_CARD_REORDER_SETTLE_MS|需要进一步测试|
|src/ui/battle-grid.js:174|requestAnimationFrame|() =>               card.style.removeProperty("transition")|需要进一步测试|
|src/ui/battle-motion.js:68|clearTimeout|prior.timer|需要进一步测试|
|src/ui/battle-motion.js:146|setTimeout|() => {       if (sessions.get(id) !== session) return;       sessions.delete(id);       document.querySelectorAll(".bm-layer").forEach((el) => {         if (el.dataset.bmKey === i; duration + 40|需要进一步测试|
|src/ui/battle-motion.js:184|clearTimeout|s.timer|需要进一步测试|
|src/ui/battle-motion.js:199|document.addEventListener|"visibilitychange"; () => {     if (document.hidden) clear();   }|需要进一步测试|
|src/ui/classroom-avatar-display.js:347|root.addEventListener|"godpower:active-classroom-changed"; () => {     contextKey = "!refresh!";     readIndex();   }|需要进一步测试|
|src/ui/classroom-avatar-display.js:351|root.addEventListener|"pagehide"; clearUrls; { once: true }|需要进一步测试|
|src/ui/classroom-feedback.js:112|clearTimeout|timer|需要进一步测试|
|src/ui/classroom-feedback.js:124|clearTimeout|timer|需要进一步测试|
|src/ui/classroom-feedback.js:216|setTimeout|() => {       if (serial === generation) dismiss();     }; options.duration|需要进一步测试|
|src/ui/classroom-feedback.js:283|e.addEventListener|"change"; () => {         const values = [...document.querySelectorAll("[data-cf-slot]")].map(           (x) => (x.value.trim() === "" ? NaN : Number(x.value)),         );         try {     |需要进一步测试|
|src/ui/classroom-feedback.js:299|e.addEventListener|"change"; () => {         setOptions({           [e.dataset.cfOption]:             e.type === "checkbox"               ? e.checked               : ["duration", "clickVolume"].includes(e.data|需要进一步测试|
|src/ui/classroom-feedback.js:347|document.addEventListener|"click"; (e) => {         const button = e.target.closest?.(           "button,summary,[role=button],input[type=button],input[type=submit]",         );         if (!button ／／ button.disable; true|需要进一步测试|
|src/ui/classroom-feedback.js:358|clearTimeout|clickCleanup|需要进一步测试|
|src/ui/classroom-feedback.js:359|setTimeout|() => {           clickEvent = null;           clickPreview = false;           clickCleanup = null;         }; 0|需要进一步测试|
|src/ui/classroom-feedback.js:387|dialog().addEventListener|"cancel"; (e) => {       e.preventDefault();       dismiss();     }|需要进一步测试|
|src/ui/classroom-feedback.js:393|document.addEventListener|"visibilitychange"; () => {       if (document.hidden) {         cancel();         stopClickVoice();         clearLive();       }     }|需要进一步测试|
|src/ui/classroom-feedback.js:400|matchMedia("(prefers-reduced-motion: reduce)").addEventListener|"change"; () => {         if (!allowed()) {           cancel();           clearLive();         }       }|需要进一步测试|
|src/ui/classroom-recovery.js:86|button.addEventListener|"click"; () => preview(index)|需要进一步测试|
|src/ui/classroom-recovery.js:161|setTimeout|() => URL.revokeObjectURL(url); 1000|需要进一步测试|
|src/ui/classroom-recovery.js:171|byId("classroomRecoveryScan").addEventListener|"click"; scan|需要进一步测试|
|src/ui/classroom-recovery.js:172|byId("classroomRecoveryExportRaw").addEventListener|"click"; exportRaw|需要进一步测试|
|src/ui/classroom-recovery.js:173|byId("classroomRecoveryRestore").addEventListener|"click"; restore|需要进一步测试|
|src/ui/classroom-recovery.js:174|byId("classroomRecoveryCancel").addEventListener|"click"; () => {       selected = null;       byId("classroomRecoveryPreview").hidden = true;     }|需要进一步测试|
|src/ui/classroom-recovery.js:180|document.addEventListener|"DOMContentLoaded"; init; { once: true }|需要进一步测试|
|src/ui/classroom-roster-workspace.js:597|setTimeout|() => URL.revokeObjectURL(link.href); 1000|需要进一步测试|
|src/ui/classroom-roster-workspace.js:810|document.removeEventListener|"keydown"; overlay._onKeydown|需要进一步测试|
|src/ui/classroom-roster-workspace.js:890|overlay.addEventListener|"click"; (event) => {           if (event.target === overlay) closeApplyPreview();         }|需要进一步测试|
|src/ui/classroom-roster-workspace.js:900|document.removeEventListener|"keydown"; onKeydown|需要进一步测试|
|src/ui/classroom-roster-workspace.js:904|document.addEventListener|"keydown"; onKeydown|需要进一步测试|
|src/ui/classroom-roster-workspace.js:926|document.removeEventListener|"keydown"; onKeydown|需要进一步测试|
|src/ui/classroom-roster-workspace.js:1146|root.addEventListener|"godpower:active-classroom-changed"; (event) => {       activeClassroomContext = event.detail;       selectedProfile = event.detail.userProfileId;       selectedClassroom = event.detail.classroomId;       render();   |需要进一步测试|
|src/ui/component-library.js:731|root.addEventListener|"click"; (event) => {       if (event.target === root) close();     }|需要进一步测试|
|src/ui/component-library.js:766|requestAnimationFrame|() =>       $("#componentLibrarySearch")?.focus({ preventScroll: true })|需要进一步测试|
|src/ui/desktop.js:109|cancelAnimationFrame|pageMotionFrame|需要进一步测试|
|src/ui/desktop.js:221|requestAnimationFrame|enterPage|需要进一步测试|
|src/ui/desktop.js:295|requestAnimationFrame|updateArrows|需要进一步测试|
|src/ui/desktop.js:651|setTimeout|() => URL.revokeObjectURL(url); 1000|需要进一步测试|
|src/ui/desktop.js:852|document.addEventListener|"click"; async (event) => {         const button = event.target.closest("button");         const action = button?.getAttribute("onclick");         const confirm = {           "applySettings; true|需要进一步测试|
|src/ui/desktop.js:1043|document.addEventListener|"click"; (e) => {         if (e.target.closest(".bottom-dock") && currentView !== "battle") {           e.preventDefault();           e.stopImmediatePropagation();           return;        ; true|需要进一步测试|
|src/ui/desktop.js:1098|window.addEventListener|"beforeunload"; () => {       disclosureMotion.dispose();       windowMotion.dispose();     }; { once: true }|需要进一步测试|
|src/ui/desktop.js:1123|document.addEventListener|"focusin"; (event) => {         const top = openStack.at(-1);         if (top && !top.el.contains(event.target)) focusModal(top);       }; true|需要进一步测试|
|src/ui/desktop.js:1281|document.addEventListener|"keydown"; (e) => {         const top = openStack.at(-1);         if (!top) return;         if (e.key === "Escape") {           e.preventDefault();           e.stopImmediatePropagation();    ; true|需要进一步测试|
|src/ui/desktop.js:1548|requestAnimationFrame|() => requestAnimationFrame(resolve)|需要进一步测试|
|src/ui/desktop.js:1548|requestAnimationFrame|resolve|需要进一步测试|
|src/ui/desktop.js:1594|window.addEventListener|"resize"; syncViewport|需要进一步测试|
|src/ui/desktop.js:1595|matchMedia("(prefers-reduced-motion: reduce)").addEventListener|"change"; () => {         if (!canAnimate()) cancelAnimations();       }|需要进一步测试|
|src/ui/desktop.js:1601|document.addEventListener|"visibilitychange"; () => {       if (document.hidden) cancelAnimations();     }|需要进一步测试|
|src/ui/desktop.js:1604|document.addEventListener|"keydown"; (event) => {       if (event.key === "Escape" && currentView === "settings")         cancelSettingsMotion();     }|需要进一步测试|
|src/ui/desktop.js:1627|$("#settlementHistoryContainer").addEventListener|"toggle"; (event) => {         const details = event.target;         if (details.tagName !== "DETAILS") return;         if (!details.open) {           for (const a of animations)            ; true|需要进一步测试|
|src/ui/desktop.js:1651|t.addEventListener|"scroll"; updateArrows; { passive: true }|需要进一步测试|
|src/ui/desktop.js:1652|t.addEventListener|"wheel"; (e) => {         if (           t.scrollWidth <= t.clientWidth + 2 ／／           Math.abs(e.deltaX) > Math.abs(e.deltaY) ／／           e.ctrlKey         )           return;         c; { passive: false }|需要进一步测试|
|src/ui/desktop.js:1758|window.addEventListener|"DOMContentLoaded"; DesktopUI.init; { once: true }|需要进一步测试|
|src/ui/disposable-scope.js:53|target.addEventListener|type; registered; options|需要进一步测试|
|src/ui/disposable-scope.js:55|target.removeEventListener|type; registered; capture|需要进一步测试|
|src/ui/disposable-scope.js:65|setTimeout|() => {         release?.();         if (!disposed) callback();       }; delay|需要进一步测试|
|src/ui/disposable-scope.js:69|clearTimeout|id|需要进一步测试|
|src/ui/disposable-scope.js:78|requestAnimationFrame|(time) => {         release?.();         if (!disposed) callback(time);       }|需要进一步测试|
|src/ui/disposable-scope.js:82|cancelAnimationFrame|id|需要进一步测试|
|src/ui/electron-host.js:168|window.addEventListener|"DOMContentLoaded"; () => {       const button = document.createElement("button");       button.type = "button";       button.className = "btn btn-primary";       button.textContent = "独立点名悬浮窗";      ; { once: true }|需要进一步测试|
|src/ui/electron-host.js:175|button.addEventListener|"click"; () => desktop.openPicker()|需要进一步测试|
|src/ui/electron-host.js:178|setInterval|publish; 120|需要进一步测试|
|src/ui/electron-host.js:184|window.addEventListener|"beforeunload"; () => clearInterval(timer); {     once: true,   }|需要进一步测试|
|src/ui/electron-host.js:184|clearInterval|timer|需要进一步测试|
|src/ui/home-dashboard.js:127|toolbar.addEventListener|"click"; onToolbarClick|需要进一步测试|
|src/ui/home-dashboard.js:128|toolbar.addEventListener|"click"; onAddCardClick|需要进一步测试|
|src/ui/home-dashboard.js:129|grid.addEventListener|"click"; onGridClick|需要进一步测试|
|src/ui/home-dashboard.js:130|grid.addEventListener|"keydown"; onGridKeydown|需要进一步测试|
|src/ui/home-dashboard.js:131|grid.addEventListener|"pointerdown"; onGridPointerDown|需要进一步测试|
|src/ui/home-dashboard.js:132|document.addEventListener|"pointermove"; onDocumentPointerMove|需要进一步测试|
|src/ui/home-dashboard.js:133|document.addEventListener|"pointerup"; onDocumentPointerUp|需要进一步测试|
|src/ui/home-dashboard.js:134|document.addEventListener|"pointercancel"; onDocumentPointerUp|需要进一步测试|
|src/ui/home-dashboard.js:135|document.addEventListener|"keydown"; onEscape; true|需要进一步测试|
|src/ui/home-dashboard.js:145|clearTimeout|statusTimer|需要进一步测试|
|src/ui/home-dashboard.js:147|setTimeout|() => {         node.hidden = true;       }; 3500|需要进一步测试|
|src/ui/home-dashboard.js:622|document.addEventListener|"DOMContentLoaded"; init; { once: true }|需要进一步测试|
|src/ui/item-modules.js:28|el.addEventListener|"click"; action|需要进一步测试|
|src/ui/item-modules.js:63|search.addEventListener|"input"; () => {       query = search.value.trim().toLowerCase();       renderList();     }|需要进一步测试|
|src/ui/item-modules.js:70|file.addEventListener|"change"; async () => {       const picked = file.files?.[0];       if (!picked ／／ busy) return;       busy = true;       try {         if (picked.size > 1024 * 1024) throw Error("配置文件不能超过 1|需要进一步测试|
|src/ui/item-modules.js:101|setTimeout|() => URL.revokeObjectURL(url); 1000|需要进一步测试|
|src/ui/item-modules.js:220|input.addEventListener|"change"; () => {           if (input.value.trim() === "" ／／ !input.checkValidity()) {             input.setAttribute("aria-invalid", "true");             announce(               ${label}须为|需要进一步测试|
|src/ui/item-modules.js:234|input.addEventListener|"change"; () =>           saveField(field, input.checked, input)|需要进一步测试|
|src/ui/item-modules.js:310|tab.addEventListener|"keydown"; (event) => {           if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))             return;           event.preventDefault();           pipeline =             e|需要进一步测试|
|src/ui/item-score-cinematics.js:16|clearTimeout|timer|需要进一步测试|
|src/ui/item-score-cinematics.js:81|dialog.addEventListener|"cancel"; (e) => {       e.preventDefault();       dismiss();     }|需要进一步测试|
|src/ui/item-score-cinematics.js:101|setTimeout|index < targets.length ? next : dismiss; 1500|需要进一步测试|
|src/ui/item-score-cinematics.js:106|document.addEventListener|"visibilitychange"; () => {     if (document.hidden) dismiss();   }|需要进一步测试|
|src/ui/item-score-cinematics.js:202|requestAnimationFrame|update|需要进一步测试|
|src/ui/item-score-cinematics.js:204|requestAnimationFrame|update|需要进一步测试|
|src/ui/item-score-cinematics.js:232|clearTimeout|prior.timer|需要进一步测试|
|src/ui/item-score-cinematics.js:245|clearTimeout|prior.timer|需要进一步测试|
|src/ui/item-score-cinematics.js:275|setTimeout|() => finish(session); duration + 40|需要进一步测试|
|src/ui/item-score-cinematics.js:284|clearTimeout|session.timer|需要进一步测试|
|src/ui/item-score-cinematics.js:288|document.addEventListener|"visibilitychange"; () => {     if (document.hidden) cancel();   }|需要进一步测试|
|src/ui/migration.js:125|setTimeout|() => URL.revokeObjectURL(url); 1000|需要进一步测试|
|src/ui/migration.js:129|element("v3MigrationInspect").addEventListener|"click"; inspect|需要进一步测试|
|src/ui/migration.js:130|element("v3MigrationStage").addEventListener|"click"; stage|需要进一步测试|
|src/ui/migration.js:131|element("v3MigrationDownload").addEventListener|"click"; download|需要进一步测试|
|src/ui/migration.js:132|window.addEventListener|"beforeunload"; () => cancellation?.abort(); {       once: true,     }|需要进一步测试|
|src/ui/migration.js:139|window.addEventListener|"DOMContentLoaded"; MigrationPanel.init; {   once: true, }|需要进一步测试|
|src/ui/render.js:7|clearTimeout|attackRenderTimerV21713|需要进一步测试|
|src/ui/render.js:8|setTimeout|() => {       attackRenderTimerV21713 = null;       attackRenderFlushingV21713 = true;       try {         refreshPages();       } finally {         pendingRenderArgsV21713 = null;; ATTACK_REORDER_DELAY_V21713|需要进一步测试|
|src/ui/render.js:40|setTimeout|() => {         pendingRenderGridV21726 = false;         // Match the original FLIP callback: don't restart the outer score phase.         refreshBattleGrid();       }; 810|需要进一步测试|
|src/ui/round-feedback.js:10|setTimeout|() => {       if (roundToken && !RoundSettlement.isRoundTokenCurrent(roundToken))         return;       try {         if (activeScoreAnimId) {           cancelAnimationFrame(active; 720|需要进一步测试|
|src/ui/round-feedback.js:15|cancelAnimationFrame|activeScoreAnimId|需要进一步测试|
|src/ui/save-file-settings.js:138|window.addEventListener|"DOMContentLoaded"; () => {       refresh();       // The settings page may mount after this script runs.       setTimeout(refresh, 600);     }; { once: true }|需要进一步测试|
|src/ui/save-file-settings.js:143|setTimeout|refresh; 600|需要进一步测试|
|src/ui/teaching-resource-workspace.js:143|setTimeout|() => URL.revokeObjectURL(url); 1000|需要进一步测试|
|src/ui/teaching-resource-workspace.js:156|setTimeout|() => {         if (dialog.open) dialog.close();         releasePreview(dialog);       }; 220|需要进一步测试|
|src/ui/teaching-resource-workspace.js:217|dialog.addEventListener|"cancel"; (event) => {         event.preventDefault();         closePreview(dialog);       }|需要进一步测试|
|src/ui/teaching-resource-workspace.js:221|dialog.addEventListener|"close"; () => releasePreview(dialog); {         once: true,       }|需要进一步测试|
|src/ui/teaching-resource-workspace.js:224|dialog.addEventListener|"click"; (event) => {         if (event.target === dialog) closePreview(dialog);       }|需要进一步测试|
|src/ui/teaching-resource-workspace.js:490|root.addEventListener|REFRESH_EVENT; () => refresh()|需要进一步测试|
|src/ui/themes.js:198|button.addEventListener|"click"; () => {         void set(button.dataset.appearanceTheme);       }|需要进一步测试|
|src/ui/themes.js:205|window.addEventListener|"DOMContentLoaded"; apply; { once: true }|需要进一步测试|
|src/ui/themes.js:206|window.addEventListener|"pagehide"; cancel|需要进一步测试|
|src/ui/themes.js:207|window.addEventListener|"keydown"; (event) => {     if (event.key === "Escape") cancel();   }|需要进一步测试|
|src/ui/tooltips.js:52|clearTimeout|active.timer|需要进一步测试|
|src/ui/tooltips.js:166|setTimeout|dismiss; 3000|需要进一步测试|
|src/ui/tooltips.js:175|document.addEventListener|"pointerover"; (event) => {     const owner = titleOwner(event.target);     if (owner === pointerOwner) return;     pointerOwner = owner;     reconcile();   }|需要进一步测试|
|src/ui/tooltips.js:181|document.addEventListener|"pointerout"; (event) => {     if (       !pointerOwner ／／       (event.relatedTarget instanceof Node &&         pointerOwner.contains(event.relatedTarget))     )       return;     pointerOwner |需要进一步测试|
|src/ui/tooltips.js:191|document.addEventListener|"focusin"; (event) => {     focusOwner = titleOwner(event.target);     reconcile();   }|需要进一步测试|
|src/ui/tooltips.js:195|document.addEventListener|"focusout"; (event) => {     focusOwner = titleOwner(event.relatedTarget);     reconcile();   }|需要进一步测试|
|src/ui/tooltips.js:199|document.addEventListener|"click"; dismiss; true|需要进一步测试|
|src/ui/tooltips.js:200|document.addEventListener|"keydown"; (event) => {     if (event.key === "Escape") dismiss();   }|需要进一步测试|
|src/ui/tooltips.js:203|window.addEventListener|"blur"; cancel|需要进一步测试|
|src/ui/tooltips.js:204|window.addEventListener|"resize"; position|需要进一步测试|
|src/ui/tooltips.js:205|document.addEventListener|"scroll"; position; true|需要进一步测试|
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
|src/styles/audio/fx-transfer.css:1|.fx-bundle-toolbar|需要进一步测试|
|src/styles/audio/fx-transfer.css:11|.fx-bundle-copy|需要进一步测试|
|src/styles/audio/fx-transfer.css:17|.fx-bundle-copy b|需要进一步测试|
|src/styles/audio/fx-transfer.css:21|.fx-bundle-copy span|需要进一步测试|
|src/styles/audio/fx-transfer.css:26|.fx-bundle-toolbar .btn|需要进一步测试|
|src/styles/audio/fx-transfer.css:31|.fx-bundle-toolbar|需要进一步测试|
|src/styles/audio/fx-transfer.css:35|.fx-bundle-toolbar .btn|需要进一步测试|
|src/styles/audio/item-sounds.css:1|.audio-head|需要进一步测试|
|src/styles/audio/item-sounds.css:11|.audio-head b|需要进一步测试|
|src/styles/audio/item-sounds.css:14|.audio-head span|需要进一步测试|
|src/styles/audio/item-sounds.css:19|.item-head|需要进一步测试|
|src/styles/audio/item-sounds.css:22|.item-sound-grid|需要进一步测试|
|src/styles/audio/item-sounds.css:27|.item-sound-grid .item-sound-card|需要进一步测试|
|src/styles/audio/item-sounds.css:37|.item-sound-desc|需要进一步测试|
|src/styles/audio/item-sounds.css:44|.item-sound-copy|需要进一步测试|
|src/styles/audio/item-sounds.css:47|.item-sound-copy .sound-name|需要进一步测试|
|src/styles/audio/item-sounds.css:51|.item-sound-copy .sound-tag|需要进一步测试|
|src/styles/audio/item-sounds.css:55|.item-sound-card .sound-controls|需要进一步测试|
|src/styles/audio/item-sounds.css:63|.item-sound-card .sound-controls .btn|需要进一步测试|
|src/styles/audio/item-sounds.css:66|.item-audio-sound-name|需要进一步测试|
|src/styles/audio/item-sounds.css:71|.item-audio-icon|需要进一步测试|
|src/styles/audio/item-sounds.css:83|.item-audio-icon img, .item-audio-img|需要进一步测试|
|src/styles/audio/item-sounds.css:92|.item-sound-grid|需要进一步测试|
|src/styles/audio/item-sounds.css:97|.audio-head|需要进一步测试|
|src/styles/audio/item-sounds.css:102|.audio-head span|需要进一步测试|
|src/styles/audio/item-sounds.css:105|.item-sound-grid|需要进一步测试|
|src/styles/audio/item-sounds.css:108|.item-sound-grid .item-sound-card|需要进一步测试|
|src/styles/audio/item-sounds.css:111|.item-sound-card .sound-controls|需要进一步测试|
|src/styles/base/reset-and-header.css:1|*|需要进一步测试|
|src/styles/base/reset-and-header.css:5|body|需要进一步测试|
|src/styles/base/reset-and-header.css:18|.header-banner|需要进一步测试|
|src/styles/base/reset-and-header.css:31|.header-title|需要进一步测试|
|src/styles/base/reset-and-header.css:36|.header-stats|需要进一步测试|
|src/styles/base/reset-and-header.css:42|.main-viewport|需要进一步测试|
|src/styles/battle/group-cards.css:1|.group-list|需要进一步测试|
|src/styles/battle/group-cards.css:5|.group-row-card|需要进一步测试|
|src/styles/battle/group-cards.css:23|.group-row-card.menu-active|需要进一步测试|
|src/styles/battle/group-cards.css:26|.group-row-card.anim-win|需要进一步测试|
|src/styles/battle/group-cards.css:30|.group-row-card.anim-loss|需要进一步测试|
|src/styles/battle/group-cards.css:35|0%|需要进一步测试|
|src/styles/battle/group-cards.css:39|30%|需要进一步测试|
|src/styles/battle/group-cards.css:43|100%|需要进一步测试|
|src/styles/battle/group-cards.css:50|0%,   100%|需要进一步测试|
|src/styles/battle/group-cards.css:54|20%,   60%|需要进一步测试|
|src/styles/battle/group-cards.css:58|40%,   80%|需要进一步测试|
|src/styles/battle/group-cards.css:63|/* 金色整块覆盖遮罩层：支持平滑进入与平滑淡出 */ .milestone-banner-overlay|需要进一步测试|
|src/styles/battle/group-cards.css:95|.milestone-banner-overlay.show|需要进一步测试|
|src/styles/battle/group-cards.css:100|.group-row-card.milestone-glow|需要进一步测试|
|src/styles/battle/group-cards.css:103|.card-header-row|需要进一步测试|
|src/styles/battle/group-cards.css:113|.header-name-col|需要进一步测试|
|src/styles/battle/group-cards.css:120|.name-input|需要进一步测试|
|src/styles/battle/group-cards.css:133|.name-input:not([readonly]):hover, .name-input:not([readonly]):focus|需要进一步测试|
|src/styles/battle/group-cards.css:138|.header-meta-col|需要进一步测试|
|src/styles/battle/group-cards.css:145|.member-count-tag|需要进一步测试|
|src/styles/battle/group-cards.css:156|.member-count-tag:hover|需要进一步测试|
|src/styles/battle/group-cards.css:159|.color-picker|需要进一步测试|
|src/styles/battle/group-cards.css:169|.del-btn|需要进一步测试|
|src/styles/battle/group-cards.css:180|.del-btn:hover|需要进一步测试|
|src/styles/battle/group-cards.css:183|/* 操作行强制单行展示，杜绝任何换行挤压 */ .card-action-row|需要进一步测试|
|src/styles/battle/group-cards.css:194|.action-score-col|需要进一步测试|
|src/styles/battle/group-cards.css:202|.row-score|需要进一步测试|
|src/styles/battle/group-cards.css:214|.row-score.editable:hover|需要进一步测试|
|src/styles/battle/group-cards.css:217|.score-input|需要进一步测试|
|src/styles/battle/group-cards.css:229|/* 功能按钮组右浮动对齐，锁定不被折行 */ .action-controls-col|需要进一步测试|
|src/styles/battle/group-cards.css:241|.opt-group|需要进一步测试|
|src/styles/battle/group-cards.css:248|.opt-btn|需要进一步测试|
|src/styles/battle/group-cards.css:266|.opt-btn.active|需要进一步测试|
|src/styles/battle/group-cards.css:271|.opt-btn.correct|需要进一步测试|
|src/styles/battle/group-cards.css:276|.opt-btn.wrong|需要进一步测试|
|src/styles/battle/group-cards.css:281|.allin-toggle-btn|需要进一步测试|
|src/styles/battle/group-cards.css:300|.allin-toggle-btn.active|需要进一步测试|
|src/styles/battle/group-cards.css:306|.result-msg-box|需要进一步测试|
|src/styles/battle/group-cards.css:318|.result-msg-box:empty|需要进一步测试|
|src/styles/battle/group-cards.css:321|.more-btn|需要进一步测试|
|src/styles/battle/group-cards.css:338|.more-btn:hover|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:1|.top-dashboard-grid|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:5|.chart-container|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:15|.dashboard-card-title|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:24|/* 条形图容器：支持绝对定位与平滑上下位移重排 */ .chart-wrapper|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:33|.chart-row|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:41|.chart-rank|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:48|.chart-name|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:57|.chart-track|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:65|/* 条形图增长动画 */ .chart-bar|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:72|.chart-score|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:79|.dashboard-summary-container|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:90|.podium-deck|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:97|.podium-col|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:107|.podium-col.rank-1|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:111|.podium-col.rank-2|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:115|.podium-col.rank-3|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:119|.podium-badge|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:123|.podium-name|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:130|.podium-score|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:135|.battle-metrics-row|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:143|.metric-box|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:149|.metric-label|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:153|.metric-value|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:158|.height-resizer-dock|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:171|.height-resizer-dock:hover|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:174|.resizer-handle|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:191|.resizer-handle::before|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:196|.quick-batch-bar|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:207|.quick-batch-bar.active|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:210|.batch-bar-title|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:216|.batch-buttons-group|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:223|.batch-opt-btn|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:234|.batch-opt-btn:hover|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:239|.batch-allin-btn|需要进一步测试|
|src/styles/battle/overview-and-resizer.css:250|.batch-allin-btn:hover|需要进一步测试|
|src/styles/battle/quick-batch.css:1|/* ===== V2.17.14：快速操作栏放到小组卡片下方 ===== */ body.modern-flat .quick-batch-bar-bottom|需要进一步测试|
|src/styles/battle/quick-batch.css:10|body.modern-flat .quick-batch-bar-bottom.active|需要进一步测试|
|src/styles/battle/quick-batch.css:19|body.modern-flat .quick-batch-bar-bottom.active|需要进一步测试|
|src/styles/battle/quick-batch.css:25|body.modern-flat .quick-batch-bar-bottom .batch-buttons-group|需要进一步测试|
|src/styles/battle/rank-preview.css:1|/* ===== V2.17.21：比赛页顶部当前排名预览 ===== */ body.modern-flat .battle-rank-dock|需要进一步测试|
|src/styles/battle/rank-preview.css:6|body.modern-flat .battle-rank-preview|需要进一步测试|
|src/styles/battle/rank-preview.css:16|body.modern-flat .battle-rank-preview-head|需要进一步测试|
|src/styles/battle/rank-preview.css:24|body.modern-flat .battle-rank-preview-title|需要进一步测试|
|src/styles/battle/rank-preview.css:29|body.modern-flat .battle-rank-preview-note|需要进一步测试|
|src/styles/battle/rank-preview.css:34|body.modern-flat .battle-rank-preview-grid|需要进一步测试|
|src/styles/battle/rank-preview.css:45|body.modern-flat .battle-rank-chip|需要进一步测试|
|src/styles/battle/rank-preview.css:60|body.modern-flat .battle-rank-chip.rank-1|需要进一步测试|
|src/styles/battle/rank-preview.css:65|body.modern-flat .battle-rank-no|需要进一步测试|
|src/styles/battle/rank-preview.css:72|body.modern-flat .battle-rank-name|需要进一步测试|
|src/styles/battle/rank-preview.css:81|body.modern-flat .battle-rank-score|需要进一步测试|
|src/styles/battle/rank-preview.css:88|body.modern-flat .battle-rank-dock .resizer-handle|需要进一步测试|
|src/styles/battle/rank-preview.css:94|body.modern-flat .battle-rank-preview-grid|需要进一步测试|
|src/styles/battle/rank-preview.css:99|body.modern-flat .battle-rank-preview-note|需要进一步测试|
|src/styles/battle/rank-preview.css:102|body.modern-flat .battle-rank-preview-grid|需要进一步测试|
|src/styles/battle/round-item-locks.css:1|.group-row-card .allin-toggle-btn.round-action-locked|需要进一步测试|
|src/styles/battle/round-item-locks.css:5|.group-row-card .battle-main-item.round-item-locked|需要进一步测试|
|src/styles/battle/round-item-locks.css:9|.group-row-card .battle-main-item.round-item-locked::after|需要进一步测试|
|src/styles/battle/score-and-state.css:1|.group-list[data-column-mode="single"] .group-row-card|需要进一步测试|
|src/styles/battle/score-and-state.css:3|.group-list[data-column-mode="single"] .group-row-card .action-score-col|需要进一步测试|
|src/styles/battle/score-and-state.css:10|.group-list[data-column-mode="single"] .group-row-card .row-score|需要进一步测试|
|src/styles/battle/score-and-state.css:17|.group-list[data-column-mode="single"] .group-row-card .score-input|需要进一步测试|
|src/styles/battle/score-and-state.css:20|.group-list[data-column-mode="single"] .group-row-card .card-action-row|需要进一步测试|
|src/styles/battle/score-and-state.css:23|/* 右侧给分数预留空间，底部操作按钮仍按原卡片尺寸排列 */ .group-list[data-column-mode="single"] .group-row-card .action-controls-col|需要进一步测试|
|src/styles/battle/score-and-state.css:29|.group-list[data-column-mode="single"] .group-row-card .action-score-col|需要进一步测试|
|src/styles/battle/score-and-state.css:35|.group-list[data-column-mode="single"] .group-row-card .row-score|需要进一步测试|
|src/styles/battle/score-and-state.css:39|/* 多列模式继续使用 V2.9.2 的行内布局，不受本次修复影响 */  /* ===== V2.9.4 大数显示优化 ===== */  /* 条形图：数字单独占固定列，绝不再把分数挤成竖排。 */ .chart-row|需要进一步测试|
|src/styles/battle/score-and-state.css:53|.chart-row .chart-rank, .chart-row .chart-name, .chart-row .chart-score|需要进一步测试|
|src/styles/battle/score-and-state.css:58|.chart-row .chart-score|需要进一步测试|
|src/styles/battle/score-and-state.css:72|.chart-row .chart-track|需要进一步测试|
|src/styles/battle/score-and-state.css:76|/* 如果旧布局不是 grid，仍强制最后的数字保持水平。 */ .chart-score|需要进一步测试|
|src/styles/battle/score-and-state.css:85|/* 小组卡：保证 7 位整数完整显示。    7 位以内不给 ellipsis；8 位以上才允许逐级缩小/省略。 */ .group-row-card .row-score|需要进一步测试|
|src/styles/battle/score-and-state.css:92|.group-row-card .action-score-col|需要进一步测试|
|src/styles/battle/score-and-state.css:95|/* 多列卡片为右侧按钮保留空间，同时确保 7 位数字区域。 */ .group-list:not([data-column-mode="single"]) .group-row-card .action-score-col|需要进一步测试|
|src/styles/battle/score-and-state.css:103|.group-list:not([data-column-mode="single"]) .group-row-card .row-score|需要进一步测试|
|src/styles/battle/score-and-state.css:108|/* 单栏模式空间充足，至少给 7 位数约 10ch 的显示区。 */ .group-list[data-column-mode="single"] .group-row-card .action-score-col|需要进一步测试|
|src/styles/battle/score-and-state.css:112|.group-list[data-column-mode="single"] .group-row-card .row-score|需要进一步测试|
|src/styles/battle/score-and-state.css:117|.group-list:not([data-column-mode="single"]) .group-row-card .row-score|需要进一步测试|
|src/styles/battle/score-and-state.css:124|.group-row-card .action-score-col|需要进一步测试|
|src/styles/battle/score-and-state.css:127|.group-row-card .row-score|需要进一步测试|
|src/styles/battle/score-and-state.css:132|/* 2) 单栏模式：取消手机媒体查询把操作行纵向堆叠造成的巨大空白。    单栏卡片重新压到紧凑高度，名称/分数放大，但不改变多列模式。 */ .group-list[data-column-mode="single"]|需要进一步测试|
|src/styles/battle/score-and-state.css:138|.group-list[data-column-mode="single"] .group-row-card|需要进一步测试|
|src/styles/battle/score-and-state.css:147|.group-list[data-column-mode="single"] .group-row-card .card-header-row|需要进一步测试|
|src/styles/battle/score-and-state.css:152|.group-list[data-column-mode="single"] .group-row-card .header-name-col|需要进一步测试|
|src/styles/battle/score-and-state.css:155|.group-list[data-column-mode="single"] .group-row-card .name-input|需要进一步测试|
|src/styles/battle/score-and-state.css:162|.group-list[data-column-mode="single"] .group-row-card .header-meta-col|需要进一步测试|
|src/styles/battle/score-and-state.css:165|/* 道具槽紧凑排列，不再把卡片中间撑出一大片空白 */ .group-list[data-column-mode="single"] .group-row-card .item-row, .group-list[data-column-mode="single"] .group-row-card .item-slots-row, .group-list[data-column-mode="single"] .group-row-card .inventory-row|需要进一步测试|
|src/styles/battle/score-and-state.css:174|.group-list[data-column-mode="single"] .group-row-card .item-slot|需要进一步测试|
|src/styles/battle/score-and-state.css:180|/* 分数回到底部操作行左侧，不再漂在卡片中部。    这样单栏会更紧凑，而且能给分数更大的字号。 */ .group-list[data-column-mode="single"] .group-row-card .card-action-row|需要进一步测试|
|src/styles/battle/score-and-state.css:192|.group-list[data-column-mode="single"] .group-row-card .action-score-col|需要进一步测试|
|src/styles/battle/score-and-state.css:202|.group-list[data-column-mode="single"] .group-row-card .row-score|需要进一步测试|
|src/styles/battle/score-and-state.css:214|.group-list[data-column-mode="single"] .group-row-card .score-input|需要进一步测试|
|src/styles/battle/score-and-state.css:220|/* 右侧答案/All In/更多保持一行，永远不被分数挤掉 */ .group-list[data-column-mode="single"] .group-row-card .action-controls-col|需要进一步测试|
|src/styles/battle/score-and-state.css:233|.group-list[data-column-mode="single"] .group-row-card .opt-btn, .group-list[data-column-mode="single"] .group-row-card .allin-toggle-btn, .group-list[data-column-mode="single"] .group-row-card .more-btn|需要进一步测试|
|src/styles/battle/score-and-state.css:241|.group-list[data-column-mode="single"] .group-row-card|需要进一步测试|
|src/styles/battle/score-and-state.css:245|.group-list[data-column-mode="single"] .group-row-card .card-action-row|需要进一步测试|
|src/styles/battle/score-and-state.css:250|.group-list[data-column-mode="single"] .group-row-card .action-controls-col|需要进一步测试|
|src/styles/battle/score-and-state.css:255|.group-list[data-column-mode="single"] .group-row-card .name-input|需要进一步测试|
|src/styles/battle/score-and-state.css:258|.group-list[data-column-mode="single"] .group-row-card .row-score|需要进一步测试|
|src/styles/battle/score-and-state.css:265|.group-list[data-column-mode="single"] .group-row-card|需要进一步测试|
|src/styles/battle/score-and-state.css:269|.group-list[data-column-mode="single"] .group-row-card .name-input|需要进一步测试|
|src/styles/battle/score-and-state.css:273|.group-list[data-column-mode="single"] .group-row-card .row-score|需要进一步测试|
|src/styles/battle/score-and-state.css:276|.group-list[data-column-mode="single"] .group-row-card .card-action-row|需要进一步测试|
|src/styles/battle/score-and-state.css:280|#groupList.group-list[data-column-mode="single"]|需要进一步测试|
|src/styles/battle/score-and-state.css:288|#groupList.group-list[data-column-mode="single"] > .group-row-card|需要进一步测试|
|src/styles/battle/score-and-state.css:299|#groupList.group-list[data-column-mode="single"]   > .group-row-card   .card-header-row|需要进一步测试|
|src/styles/battle/score-and-state.css:307|#groupList.group-list[data-column-mode="single"] > .group-row-card .name-input|需要进一步测试|
|src/styles/battle/score-and-state.css:314|#groupList.group-list[data-column-mode="single"] > .group-row-card .item-slots|需要进一步测试|
|src/styles/battle/score-and-state.css:321|#groupList.group-list[data-column-mode="single"] > .group-row-card .item-slot|需要进一步测试|
|src/styles/battle/score-and-state.css:327|#groupList.group-list[data-column-mode="single"]   > .group-row-card   .card-action-row|需要进一步测试|
|src/styles/battle/score-and-state.css:339|#groupList.group-list[data-column-mode="single"]   > .group-row-card   .action-score-col|需要进一步测试|
|src/styles/battle/score-and-state.css:350|#groupList.group-list[data-column-mode="single"] > .group-row-card .row-score|需要进一步测试|
|src/styles/battle/score-and-state.css:361|#groupList.group-list[data-column-mode="single"]   > .group-row-card   .action-controls-col|需要进一步测试|
|src/styles/battle/score-and-state.css:376|#groupList.group-list[data-column-mode="single"] > .group-row-card|需要进一步测试|
|src/styles/battle/score-and-state.css:380|#groupList.group-list[data-column-mode="single"]     > .group-row-card     .name-input|需要进一步测试|
|src/styles/battle/score-and-state.css:386|#groupList.group-list[data-column-mode="single"]     > .group-row-card     .row-score|需要进一步测试|
|src/styles/battle/score-and-state.css:391|#groupList.group-list[data-column-mode="single"]     > .group-row-card     .card-action-row|需要进一步测试|
|src/styles/battle/score-and-state.css:398|#groupList.group-list[data-column-mode="single"]     > .group-row-card     .action-controls-col|需要进一步测试|
|src/styles/battle/score-and-state.css:406|/* ===== V2.11.3：巨大蘑菇持续状态 · 橙色发光 ===== */ .group-row-card.effect-mega|需要进一步测试|
|src/styles/battle/score-and-state.css:413|from|需要进一步测试|
|src/styles/battle/score-and-state.css:420|to|需要进一步测试|
|src/styles/battle/score-and-state.css:428|/* ===== V2.11.4：作答选中 / All In 可读性 + 冰冻蓝色发光 ===== */ /* 普通扁平模式：选中后必须真的改变按钮底色，而不是只把字变白。 */ .group-row-card .opt-btn.active:not(.correct):not(.wrong)|需要进一步测试|
|src/styles/battle/score-and-state.css:448|.group-row-card .allin-toggle-btn.active|需要进一步测试|
|src/styles/battle/score-and-state.css:466|/* 冰之花冻结：冻结期间整张小组卡片持续蓝色脉冲发光。 */ .group-row-card.effect-ice|需要进一步测试|
|src/styles/battle/score-and-state.css:472|from|需要进一步测试|
|src/styles/battle/score-and-state.css:479|to|需要进一步测试|
|src/styles/battle/score-feedback.css:1|/* ===== V2.17.30：道具分数动画不重复、不挤布局 ===== */ .action-score-col|需要进一步测试|
|src/styles/battle/score-feedback.css:5|.row-score|需要进一步测试|
|src/styles/battle/score-feedback.css:9|/* +N / -N 为绝对定位，不再占据 flex 布局空间，也不会把右侧按钮顶开 */ .item-score-delta|需要进一步测试|
|src/styles/battle/score-feedback.css:25|.item-score-delta.gain|需要进一步测试|
|src/styles/battle/score-feedback.css:28|.item-score-delta.loss|需要进一步测试|
|src/styles/battle/score-feedback.css:31|.item-score-delta.play|需要进一步测试|
|src/styles/battle/score-feedback.css:35|0%|需要进一步测试|
|src/styles/battle/score-feedback.css:39|18%|需要进一步测试|
|src/styles/battle/score-feedback.css:43|72%|需要进一步测试|
|src/styles/battle/score-feedback.css:47|100%|需要进一步测试|
|src/styles/battle/score-feedback.css:52|/* 真实分数保持最终值，不再“回退到旧值再播一遍”。    动画只叠加旧值 / 新值两层幽灵数字。 */ .score-roll-ghost|需要进一步测试|
|src/styles/battle/score-feedback.css:65|.score-roll-old|需要进一步测试|
|src/styles/battle/score-feedback.css:68|.score-roll-new|需要进一步测试|
|src/styles/battle/score-feedback.css:74|0%|需要进一步测试|
|src/styles/battle/score-feedback.css:78|100%|需要进一步测试|
|src/styles/battle/score-feedback.css:84|0%|需要进一步测试|
|src/styles/battle/score-feedback.css:88|18%|需要进一步测试|
|src/styles/battle/score-feedback.css:91|100%|需要进一步测试|
|src/styles/battle/score-feedback.css:96|.row-score.score-roll-host|需要进一步测试|
|src/styles/battle/score-feedback.css:101|.row-score.score-roll-host .score-roll-ghost|需要进一步测试|
|src/styles/classroom/group-palette.css:1|.group-color-field|需要进一步测试|
|src/styles/classroom/group-palette.css:5|.group-color-preset-grid|需要进一步测试|
|src/styles/classroom/group-palette.css:13|.group-color-swatch|需要进一步测试|
|src/styles/classroom/group-palette.css:30|.group-color-swatch:hover:not(:disabled)|需要进一步测试|
|src/styles/classroom/group-palette.css:34|.group-color-swatch.selected|需要进一步测试|
|src/styles/classroom/group-palette.css:40|.group-color-swatch span|需要进一步测试|
|src/styles/classroom/group-palette.css:51|.group-color-swatch:disabled|需要进一步测试|
|src/styles/classroom/group-palette.css:55|.group-color-free|需要进一步测试|
|src/styles/classroom/group-palette.css:66|.group-color-free-copy|需要进一步测试|
|src/styles/classroom/group-palette.css:72|.group-color-free-copy b|需要进一步测试|
|src/styles/classroom/group-palette.css:76|.group-color-free-copy span|需要进一步测试|
|src/styles/classroom/group-palette.css:80|.group-color-editor|需要进一步测试|
|src/styles/classroom/group-palette.css:83|.group-color-editor input[type="color"]|需要进一步测试|
|src/styles/classroom/group-palette.css:91|#groupDetailColorHexV21716|需要进一步测试|
|src/styles/classroom/group-palette.css:98|.group-color-preset-grid|需要进一步测试|
|src/styles/classroom/group-palette.css:101|.group-color-free|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:1|/* ===== V2.18.0：手写方案整合 ===== */  /* 统一模态焦点栈决定最近打开窗口的层级；旧值仅作为兼容回退。 */ #pwdModal|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:6|.theme-dialog|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:9|/* 底栏快速按人加分 */ .quick-person-backdrop|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:22|.quick-person-backdrop.active|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:25|.quick-person-card|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:36|.quick-person-head|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:44|.quick-person-head b|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:48|.quick-person-filters|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:55|.quick-person-row|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:61|.quick-person-row > div|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:68|.quick-person-row > span:first-child|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:71|.quick-person-row:first-child|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:75|.quick-person-search-hint|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:80|.quick-person-row > span:first-child|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:86|.quick-person-input|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:94|.quick-person-chip|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:104|.quick-person-chip.active|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:109|.quick-person-letter|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:117|.quick-person-list|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:125|.quick-person-entry|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:137|.quick-person-entry.selected|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:141|.student-no|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:155|.student-name|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:163|.student-no-inline|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:167|.quick-person-group|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:177|.quick-person-actions|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:187|.quick-person-score-actions|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:193|.quick-person-selected-count|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:198|/* 手动举手使用道具后的中央结算卡 */ .hand-effect-overlay|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:211|.hand-effect-overlay.active|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:214|.hand-effect-card|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:225|from|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:229|to|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:234|.hand-effect-icon|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:238|.hand-effect-name|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:244|.hand-effect-lines|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:249|.hand-effect-line|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:257|.hand-effect-line.pos|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:260|.hand-effect-line.neg|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:263|.hand-effect-line.neutral|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:266|/* 抽奖结束后不再显示“查看道具” */ #handRewardBox button[onclick="handUseNewItem()"]|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:271|/* 百科技巧块 */ .item-reference-tip|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:282|.item-reference-tip b|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:285|.item-reference-general|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:297|.quick-person-card|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:300|.quick-person-list|需要进一步测试|
|src/styles/classroom/student-picker-hand.css:303|.quick-person-actions|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:1|.score-modal-backdrop|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:12|.score-modal-backdrop.active|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:15|.score-modal-card|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:28|.score-modal-card *|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:31|.score-modal-title|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:37|.score-modal-hint|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:43|.custom-score-field|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:58|.custom-score-field:focus|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:62|.custom-score-field.invalid|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:65|.score-modal-error|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:72|.score-modal-actions|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:80|.score-modal-cancel|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:84|.member-search-fab|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:106|.member-search-fab:hover|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:109|.member-search-fab:active|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:112|.member-search-backdrop|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:124|.member-search-backdrop.active|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:127|.member-search-card|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:137|.member-search-title|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:143|.member-search-subtitle|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:149|.member-search-input-row|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:154|.member-search-input|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:167|.member-search-input:focus|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:171|.member-search-results|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:179|.member-search-result|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:186|.member-search-result:last-child|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:189|.member-search-result-name|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:193|.member-search-result-group|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:198|.member-search-result-members|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:204|.member-search-empty|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:211|.member-search-fab|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:218|.member-search-input-row|需要进一步测试|
|src/styles/dialogs/score-and-member-search.css:221|.member-search-input-row .btn|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:1|.grand-modal-overlay|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:13|.grand-modal-overlay.active|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:16|#confettiCanvas|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:25|.grand-card|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:42|0%|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:46|100%|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:51|.grand-title|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:57|.grand-trophy|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:63|0%|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:66|100%|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:70|.ans-btn|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:83|.ans-btn.selected|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:90|.locked-disabled, .round-disabled|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:97|.modal-overlay|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:110|.modal-overlay.active|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:113|.modal-box|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:125|.modal-box.large|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:130|.modal-box.slot-modal|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:134|.modal-input|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:145|.modal-input:focus|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:148|.modal-actions|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:153|.setting-item|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:162|.sound-row|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:170|.history-list|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:177|.history-item|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:187|.slot-machine-case|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:198|.slot-reel-frame|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:207|.slot-reel-text|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:216|.btn-slot-action|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:224|.btn-slot-action.start|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:228|.btn-slot-action.stop|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:232|.two-tier-group-select|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:238|.two-tier-chips|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:243|.two-tier-chip|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:254|.two-tier-chip:hover|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:257|.two-tier-chip.active|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:262|.audio-hint-bar|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:278|.welcome-modal|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:287|.welcome-modal.active|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:290|.welcome-modal-card|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:298|.welcome-modal-head|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:301|.welcome-modal-title|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:307|.welcome-modal-sub|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:312|.welcome-modal-pages|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:318|.wmp-item|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:330|.wmp-tag|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:338|.welcome-modal-btn|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:344|.welcome-modal-hint|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:349|.toast|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:370|.toast.show|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:375|/* v2: 可维护的公共变量与无障碍交互状态 */ :root|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:388|button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:396|*,   *::before,   *::after|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:407|.card-action-row|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:412|.action-controls-col|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:416|.top-dashboard-grid|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:419|.group-list|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:423|/* ================= SPA core view architecture v3 ================= */ .view|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:429|.view.active|需要进一步测试|
|src/styles/dialogs/settlement-and-core.css:433|.app-topnav|需要进一步测试|
|src/styles/dialogs/theme-confirmation.css:1|/* ===== V2.17.27：统一程序主题弹窗 ===== */ .theme-dialog|需要进一步测试|
|src/styles/dialogs/theme-confirmation.css:12|.theme-dialog.active|需要进一步测试|
|src/styles/dialogs/theme-confirmation.css:15|.theme-dialog-card|需要进一步测试|
|src/styles/dialogs/theme-confirmation.css:27|from|需要进一步测试|
|src/styles/dialogs/theme-confirmation.css:31|to|需要进一步测试|
|src/styles/dialogs/theme-confirmation.css:36|.theme-dialog-head|需要进一步测试|
|src/styles/dialogs/theme-confirmation.css:42|.theme-dialog-icon|需要进一步测试|
|src/styles/dialogs/theme-confirmation.css:54|.theme-dialog-title|需要进一步测试|
|src/styles/dialogs/theme-confirmation.css:59|.theme-dialog-body|需要进一步测试|
|src/styles/dialogs/theme-confirmation.css:67|.theme-dialog-actions|需要进一步测试|
|src/styles/dialogs/theme-confirmation.css:74|.theme-dialog-btn|需要进一步测试|
|src/styles/dialogs/theme-confirmation.css:84|.theme-dialog-btn.secondary|需要进一步测试|
|src/styles/dialogs/theme-confirmation.css:88|.theme-dialog-btn.primary|需要进一步测试|
|src/styles/dialogs/theme-confirmation.css:92|.theme-dialog-btn.danger|需要进一步测试|
|src/styles/dialogs/theme-confirmation.css:96|.theme-dialog-btn:focus-visible|需要进一步测试|
|src/styles/dialogs/theme-confirmation.css:101|.theme-dialog-card|需要进一步测试|
|src/styles/dialogs/theme-confirmation.css:105|.theme-dialog-actions|需要进一步测试|
|src/styles/dialogs/theme-confirmation.css:108|.theme-dialog-btn|需要进一步测试|
|src/styles/items/attack-feedback.css:1|.group-row-card[class*="hit-"]|需要进一步测试|
|src/styles/items/attack-feedback.css:5|.group-row-card[class*="hit-"]::after|需要进一步测试|
|src/styles/items/attack-feedback.css:13|.attack-hit-badge|需要进一步测试|
|src/styles/items/attack-feedback.css:33|.attack-hit-badge span|需要进一步测试|
|src/styles/items/attack-feedback.css:38|0%|需要进一步测试|
|src/styles/items/attack-feedback.css:42|16%|需要进一步测试|
|src/styles/items/attack-feedback.css:46|72%|需要进一步测试|
|src/styles/items/attack-feedback.css:49|100%|需要进一步测试|
|src/styles/items/attack-feedback.css:54|/* 绿龟壳：绿色横向冲撞 */ .group-row-card.hit-green-shell|需要进一步测试|
|src/styles/items/attack-feedback.css:59|.group-row-card.hit-green-shell::after|需要进一步测试|
|src/styles/items/attack-feedback.css:65|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/attack-feedback.css:69|12%|需要进一步测试|
|src/styles/items/attack-feedback.css:72|24%|需要进一步测试|
|src/styles/items/attack-feedback.css:75|36%|需要进一步测试|
|src/styles/items/attack-feedback.css:78|48%|需要进一步测试|
|src/styles/items/attack-feedback.css:83|0%,   100%|需要进一步测试|
|src/styles/items/attack-feedback.css:87|12%,   42%|需要进一步测试|
|src/styles/items/attack-feedback.css:91|70%|需要进一步测试|
|src/styles/items/attack-feedback.css:95|/* 红龟壳：红色锁定脉冲 */ .group-row-card.hit-red-shell|需要进一步测试|
|src/styles/items/attack-feedback.css:100|.group-row-card.hit-red-shell::after|需要进一步测试|
|src/styles/items/attack-feedback.css:108|0%,   100%|需要进一步测试|
|src/styles/items/attack-feedback.css:112|18%|需要进一步测试|
|src/styles/items/attack-feedback.css:115|32%|需要进一步测试|
|src/styles/items/attack-feedback.css:120|0%|需要进一步测试|
|src/styles/items/attack-feedback.css:123|12%|需要进一步测试|
|src/styles/items/attack-feedback.css:126|30%|需要进一步测试|
|src/styles/items/attack-feedback.css:129|46%|需要进一步测试|
|src/styles/items/attack-feedback.css:132|100%|需要进一步测试|
|src/styles/items/attack-feedback.css:136|/* 刺龟壳：蓝色重击爆闪 */ .group-row-card.hit-spiny|需要进一步测试|
|src/styles/items/attack-feedback.css:141|.group-row-card.hit-spiny::after|需要进一步测试|
|src/styles/items/attack-feedback.css:149|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/attack-feedback.css:153|14%|需要进一步测试|
|src/styles/items/attack-feedback.css:156|25%|需要进一步测试|
|src/styles/items/attack-feedback.css:159|38%|需要进一步测试|
|src/styles/items/attack-feedback.css:164|0%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/attack-feedback.css:167|10%|需要进一步测试|
|src/styles/items/attack-feedback.css:170|25%|需要进一步测试|
|src/styles/items/attack-feedback.css:173|38%|需要进一步测试|
|src/styles/items/attack-feedback.css:176|100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/attack-feedback.css:180|/* 香蕉：黄色打滑倾斜 */ .group-row-card.hit-banana|需要进一步测试|
|src/styles/items/attack-feedback.css:185|.group-row-card.hit-banana::after|需要进一步测试|
|src/styles/items/attack-feedback.css:195|0%,   100%|需要进一步测试|
|src/styles/items/attack-feedback.css:199|20%|需要进一步测试|
|src/styles/items/attack-feedback.css:202|34%|需要进一步测试|
|src/styles/items/attack-feedback.css:205|50%|需要进一步测试|
|src/styles/items/attack-feedback.css:210|0%|需要进一步测试|
|src/styles/items/attack-feedback.css:214|25%|需要进一步测试|
|src/styles/items/attack-feedback.css:217|100%|需要进一步测试|
|src/styles/items/attack-feedback.css:222|/* 超级喇叭：橙色向外冲击波 */ .group-row-card.hit-horn|需要进一步测试|
|src/styles/items/attack-feedback.css:227|.group-row-card.hit-horn::after|需要进一步测试|
|src/styles/items/attack-feedback.css:232|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/attack-feedback.css:236|20%|需要进一步测试|
|src/styles/items/attack-feedback.css:239|36%|需要进一步测试|
|src/styles/items/attack-feedback.css:244|0%|需要进一步测试|
|src/styles/items/attack-feedback.css:248|18%|需要进一步测试|
|src/styles/items/attack-feedback.css:252|70%|需要进一步测试|
|src/styles/items/attack-feedback.css:256|100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/attack-feedback.css:260|/* 炸弹兵：橙黑爆炸 */ .group-row-card.hit-bomb|需要进一步测试|
|src/styles/items/attack-feedback.css:265|.group-row-card.hit-bomb::after|需要进一步测试|
|src/styles/items/attack-feedback.css:276|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/attack-feedback.css:280|13%|需要进一步测试|
|src/styles/items/attack-feedback.css:283|25%|需要进一步测试|
|src/styles/items/attack-feedback.css:286|37%|需要进一步测试|
|src/styles/items/attack-feedback.css:291|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/attack-feedback.css:295|12%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/attack-feedback.css:298|30%|需要进一步测试|
|src/styles/items/attack-feedback.css:302|/* 锤子：灰色垂直砸击 */ .group-row-card.hit-hammer|需要进一步测试|
|src/styles/items/attack-feedback.css:307|.group-row-card.hit-hammer::after|需要进一步测试|
|src/styles/items/attack-feedback.css:313|0%,   100%|需要进一步测试|
|src/styles/items/attack-feedback.css:317|16%|需要进一步测试|
|src/styles/items/attack-feedback.css:320|30%|需要进一步测试|
|src/styles/items/attack-feedback.css:325|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/attack-feedback.css:329|14%|需要进一步测试|
|src/styles/items/attack-feedback.css:332|45%|需要进一步测试|
|src/styles/items/attack-feedback.css:336|/* 火之花：橙红灼烧 */ .group-row-card.hit-fire|需要进一步测试|
|src/styles/items/attack-feedback.css:341|.group-row-card.hit-fire::after|需要进一步测试|
|src/styles/items/attack-feedback.css:352|0%,   100%|需要进一步测试|
|src/styles/items/attack-feedback.css:356|20%|需要进一步测试|
|src/styles/items/attack-feedback.css:359|42%|需要进一步测试|
|src/styles/items/attack-feedback.css:364|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/attack-feedback.css:368|15%,   45%|需要进一步测试|
|src/styles/items/attack-feedback.css:373|/* 冰之花：青蓝结霜 */ .group-row-card.hit-ice|需要进一步测试|
|src/styles/items/attack-feedback.css:378|.group-row-card.hit-ice::after|需要进一步测试|
|src/styles/items/attack-feedback.css:390|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/attack-feedback.css:394|18%|需要进一步测试|
|src/styles/items/attack-feedback.css:397|55%|需要进一步测试|
|src/styles/items/attack-feedback.css:402|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/attack-feedback.css:406|16%|需要进一步测试|
|src/styles/items/attack-feedback.css:409|60%|需要进一步测试|
|src/styles/items/attack-feedback.css:413|/* 回旋镖：蓝色左右扫过 */ .group-row-card.hit-boomerang|需要进一步测试|
|src/styles/items/attack-feedback.css:418|.group-row-card.hit-boomerang::after|需要进一步测试|
|src/styles/items/attack-feedback.css:428|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/attack-feedback.css:432|16%|需要进一步测试|
|src/styles/items/attack-feedback.css:435|30%|需要进一步测试|
|src/styles/items/attack-feedback.css:438|44%|需要进一步测试|
|src/styles/items/attack-feedback.css:443|0%|需要进一步测试|
|src/styles/items/attack-feedback.css:447|20%|需要进一步测试|
|src/styles/items/attack-feedback.css:450|55%|需要进一步测试|
|src/styles/items/attack-feedback.css:453|100%|需要进一步测试|
|src/styles/items/attack-feedback.css:458|/* 闪电：强烈黄白劈击，明显区别于所有普通碰撞 */ .group-row-card.hit-lightning|需要进一步测试|
|src/styles/items/attack-feedback.css:463|.group-row-card.hit-lightning::after|需要进一步测试|
|src/styles/items/attack-feedback.css:478|0%,   12%,   24%,   100%|需要进一步测试|
|src/styles/items/attack-feedback.css:484|6%,   18%|需要进一步测试|
|src/styles/items/attack-feedback.css:490|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/attack-feedback.css:494|5%|需要进一步测试|
|src/styles/items/attack-feedback.css:497|13%|需要进一步测试|
|src/styles/items/attack-feedback.css:500|20%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/attack-feedback.css:503|45%|需要进一步测试|
|src/styles/items/attack-feedback.css:507|/* 未单独设计的攻击仍有统一红色冲击兜底。 */ .group-row-card.hit-generic|需要进一步测试|
|src/styles/items/attack-feedback.css:512|.group-row-card.hit-generic::after|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:1|/* ===== V2.13.0：百科横向布局 + 小组卡片重构 + 持续状态光效 ===== */ /* 百科：固定圆底 + 固定大小图标，彻底禁止原 PNG 撑爆布局 */ .item-ency-grid|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:7|.ency-card|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:10|.item-encyclopedia-card|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:28|.item-encyclopedia-icon-disc|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:48|.item-encyclopedia-icon-disc img, .item-encyclopedia-img|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:57|.item-encyclopedia-info|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:60|.item-encyclopedia-name|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:66|.item-encyclopedia-desc|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:72|.item-encyclopedia-actions|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:80|.item-encyclopedia-card|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:85|.item-encyclopedia-icon-disc|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:89|.item-encyclopedia-icon-disc img,   .item-encyclopedia-img|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:94|.item-encyclopedia-actions|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:101|/* 卡片整体尺寸不扩大，只重新分配信息优先级 */ .group-row-card.battle-card|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:109|.battle-card .card-header-row|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:118|.battle-group-number|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:135|.battle-group-heading|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:138|.battle-group-name|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:147|.battle-group-subtitle|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:153|.battle-card .item-slots|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:161|.battle-card .item-slot|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:170|.battle-card .queue-main-slot|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:178|.battle-card .queue-main-slot img|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:185|.battle-card .queue-secondary-slot|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:192|.battle-card .queue-secondary-slot img|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:199|.battle-card .queue-slot-role|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:208|.battle-card .queue-secondary-slot .queue-slot-role|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:211|.battle-card .charges|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:220|.battle-score-container|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:224|.battle-card .row-score|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:230|.battle-card .more-btn|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:238|.battle-card .card-action-row|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:244|.battle-result|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:254|.battle-card .action-controls-col|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:258|.battle-card .opt-group|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:261|.battle-card .opt-btn|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:268|.battle-card .allin-toggle-btn|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:277|.battle-card .result-msg-box|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:280|/* 排序 FLIP 动画由 JS 写入 transform；默认时长与开始答题、道具重排保持一致。 */ .group-row-card.battle-card|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:288|/* 持续状态改成独立光环层，不再与一次性道具动画争夺 animation 属性 */ .group-row-card.effect-star, .group-row-card.effect-mega|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:294|.persistent-aura|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:303|.persistent-aura.aura-star|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:310|.persistent-aura.aura-mega|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:317|.persistent-aura.aura-power|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:324|.persistent-aura.aura-ice|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:331|/* 七种状态的持续光环，沿用 star/mega 的呼吸节奏，仅换颜色与色相。 */ .persistent-aura.aura-burn|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:339|.persistent-aura.aura-freeze|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:346|.persistent-aura.aura-paralysis|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:353|.persistent-aura.aura-poison|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:360|.persistent-aura.aura-dizziness|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:367|.persistent-aura.aura-invincible|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:374|/* A second status shares the card: stagger a thinner ring just inside the first. */ .persistent-aura.aura-stacked|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:380|0%|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:386|50%|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:392|100%|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:400|from|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:406|to|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:414|from|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:417|to|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:425|from|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:428|to|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:435|body.items-disabled .battle-card .item-slots|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:439|body.items-disabled .battle-card .card-header-row|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:444|.group-row-card.battle-card|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:448|.battle-card .card-header-row|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:452|.battle-group-number|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:458|.battle-group-name|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:461|.battle-group-subtitle|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:464|.battle-card .queue-main-slot|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:468|.battle-card .queue-main-slot img|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:472|.battle-card .queue-secondary-slot|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:476|.battle-card .queue-secondary-slot img|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:480|.battle-score-container|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:483|.battle-card .row-score|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:487|.battle-card .opt-btn|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:491|.battle-card .allin-toggle-btn|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:500|0%,   100%|需要进一步测试|
|src/styles/items/catalog-and-card-compat.css:504|50%|需要进一步测试|
|src/styles/items/catalog-and-management.css:1|.encyclopedia-item img|需要进一步测试|
|src/styles/items/catalog-and-management.css:6|/* ===== V2.8.4 统一 26 道具设置 UI ===== */ .custom-item-icon-row|需要进一步测试|
|src/styles/items/catalog-and-management.css:11|/* 移除 V2.8.3 那四个孤零零追加到功能页的临时行 */  /* 设置页道具卡统一网格，不再把新增四项塞在顶部 */ #v2ItemEncyclopedia .item-ency-grid|需要进一步测试|
|src/styles/items/catalog-and-management.css:18|#v2ItemEncyclopedia .ency-card|需要进一步测试|
|src/styles/items/catalog-and-management.css:32|#v2ItemEncyclopedia .ency-icon img|需要进一步测试|
|src/styles/items/catalog-and-management.css:37|/* 上帝模式管理区必须自己滚动，不能把整个窗口撑成截图里那条细缝 */ .god-item-tools|需要进一步测试|
|src/styles/items/catalog-and-management.css:44|.god-item-grid|需要进一步测试|
|src/styles/items/catalog-and-management.css:53|.god-item-grid .btn|需要进一步测试|
|src/styles/items/catalog-and-management.css:61|#itemWindow,   .item-window,   .group-control-window,   .group-modal-window|需要进一步测试|
|src/styles/items/catalog-and-management.css:69|#itemWindowBody,   .item-window-body|需要进一步测试|
|src/styles/items/catalog-and-management.css:74|.item-window-tabs,   .group-control-tabs|需要进一步测试|
|src/styles/items/catalog-and-management.css:84|.item-window-tabs button,   .group-control-tabs button|需要进一步测试|
|src/styles/items/catalog-and-management.css:94|.vista-window:has(#itemWindowBody)|需要进一步测试|
|src/styles/items/catalog-and-management.css:97|.vista-window:has(#itemWindowBody) #itemWindowBody|需要进一步测试|
|src/styles/items/catalog-and-management.css:105|#view-settings .settings-scroll|需要进一步测试|
|src/styles/items/catalog-and-management.css:108|#view-settings .legacy-settings-tabs,   #view-settings .legacy-settings-tabbar,   #view-settings #settingsV2Tabs|需要进一步测试|
|src/styles/items/catalog-and-management.css:115|#v2ItemEncyclopedia .item-ency-grid|需要进一步测试|
|src/styles/items/catalog-and-management.css:119|/* ===== V2.9.1 共产主义模式（道具系统总开关） ===== */ body.items-disabled .item-slot, body.items-disabled .item-bar, body.items-disabled .item-inventory, body.items-disabled .item-draw-spinning, body.items-disabled .card-item-roulette, body.items-disabled .god-item-tools, body.items-disabled .item-defense-toast, body.items-disabled #v2ItemPane, body.items-disabled [data-sp="items"], body.items-disabled [data-about="items"], body.items-disabled #itemWindowTabItems, body.items-disabled [data-item-feature], body.items-disabled .item-feature-only|需要进一步测试|
|src/styles/items/cooldown-notes.css:1|.cooldown-note|需要进一步测试|
|src/styles/items/cooldown-notes.css:13|.cooldown-note b|需要进一步测试|
|src/styles/items/cooldown-notes.css:17|.cooldown-note small|需要进一步测试|
|src/styles/items/draw-clipping.css:1|/* ===== V2.16.2：道具抽取尺寸 + 小组区域裁剪修复 ===== */  /*   找到真正的“遮罩”来源：   现代主题曾给 #groupList 设置 overflow-x:hidden + contain:paint。   contain:paint 会把任何超出小组列表绘制边界的内容直接裁掉，   看起来就像卡片下方盖着一层不可穿透的遮罩，也会连带裁掉道具特效。 */ body.modern-flat #groupList|需要进一步测试|
|src/styles/items/draw-clipping.css:17|/* 比赛主体自身也不要裁剪卡片演出。 */ body.modern-flat #view-battle, body.modern-flat .battle-main|需要进一步测试|
|src/styles/items/draw-clipping.css:24|/*   卡片内道具轮盘不再铺满整张卡片。   改成居中的紧凑横条，保持原卡片轮廓和周围信息可辨识。 */ body.modern-flat .group-row-card.item-draw-spinning|需要进一步测试|
|src/styles/items/draw-clipping.css:33|body.modern-flat .group-row-card.item-draw-spinning .card-item-roulette|需要进一步测试|
|src/styles/items/draw-clipping.css:57|/* 去掉旧水晶轮盘留下的大圆、扫光和其他伪元素。 */ body.modern-flat   .group-row-card.item-draw-spinning   .card-item-roulette::before, body.modern-flat   .group-row-card.item-draw-spinning   .card-item-roulette::after|需要进一步测试|
|src/styles/items/draw-clipping.css:68|/* 图标严格锁定，不再拿原始 PNG 尺寸撑卡片。 */ body.modern-flat   .group-row-card.item-draw-spinning   .card-item-roulette   .r-icon|需要进一步测试|
|src/styles/items/draw-clipping.css:93|body.modern-flat   .group-row-card.item-draw-spinning   .card-item-roulette   .r-icon   img|需要进一步测试|
|src/styles/items/draw-clipping.css:105|/* 名称缩小并限定在一行，不再出现截图里那种巨大两三行标题。 */ body.modern-flat   .group-row-card.item-draw-spinning   .card-item-roulette   .r-name|需要进一步测试|
|src/styles/items/draw-clipping.css:130|/* 轮盘提示只保留极小辅助字，不占主要空间。 */ body.modern-flat   .group-row-card.item-draw-spinning   .card-item-roulette   .r-hint|需要进一步测试|
|src/styles/items/draw-clipping.css:138|/* 抽取期间只轻微降低原卡片信息，不再模糊成一整块“遮罩”。 */ body.modern-flat   .group-row-card.item-draw-spinning:not(.bm-draw-fading)   .card-header-row, body.modern-flat   .group-row-card.item-draw-spinning:not(.bm-draw-fading)   .answer-zone, body.modern-flat   .group-row-card.item-draw-spinning:not(.bm-draw-fading)   .score-zone, body.modern-flat   .group-row-card.item-draw-spinning:not(.bm-draw-fading)   .group-actions, body.modern-flat   .group-row-card.item-draw-spinning:not(.bm-draw-fading)   .card-action-row|需要进一步测试|
|src/styles/items/draw-clipping.css:158|/* reveal 时只做轻微缩放，绝不再次撑满卡片。 */ body.modern-flat   .group-row-card.item-draw-spinning   .card-item-roulette.reveal|需要进一步测试|
|src/styles/items/draw-clipping.css:169|0%|需要进一步测试|
|src/styles/items/draw-clipping.css:173|60%|需要进一步测试|
|src/styles/items/draw-clipping.css:177|100%|需要进一步测试|
|src/styles/items/draw-clipping.css:182|/* 防止道具特效再次被列表裁掉。 */ body.modern-flat #groupList .group-row-card.card-use-fx, body.modern-flat #groupList .group-row-card.card-hit-fx, body.modern-flat #groupList .group-row-card.card-defend-fx, body.modern-flat #groupList .group-row-card.card-heal-fx|需要进一步测试|
|src/styles/items/draw-clipping.css:194|body.modern-flat .group-row-card.item-draw-spinning .card-item-roulette|需要进一步测试|
|src/styles/items/draw-clipping.css:203|body.modern-flat     .group-row-card.item-draw-spinning     .card-item-roulette     .r-icon|需要进一步测试|
|src/styles/items/draw-clipping.css:214|body.modern-flat     .group-row-card.item-draw-spinning     .card-item-roulette     .r-icon     img|需要进一步测试|
|src/styles/items/draw-clipping.css:224|body.modern-flat     .group-row-card.item-draw-spinning     .card-item-roulette     .r-name|需要进一步测试|
|src/styles/items/draw-flow.css:1|/* ===== V2.17.12：课堂快速道具流程 =====    目标：保留“看得懂发生了什么”，砍掉纯等待时间。 */  /* 排名 / 编号重排保留完整移动过程，与开始答题、道具排序逻辑一致。 */ .group-row-card.battle-card|需要进一步测试|
|src/styles/items/draw-flow.css:10|/* 抽取轮盘切换更干脆。 */ .card-item-roulette|需要进一步测试|
|src/styles/items/draw-flow.css:15|.card-item-roulette .r-icon|需要进一步测试|
|src/styles/items/draw-flow.css:21|.card-item-roulette .r-icon.roulette-swap|需要进一步测试|
|src/styles/items/draw-flow.css:24|.card-item-roulette.reveal|需要进一步测试|
|src/styles/items/draw-flow.css:29|from|需要进一步测试|
|src/styles/items/draw-flow.css:33|to|需要进一步测试|
|src/styles/items/draw-flow.css:38|.card-item-roulette.reveal:before|需要进一步测试|
|src/styles/items/draw-flow.css:41|.hand-item-progress > div|需要进一步测试|
|src/styles/items/draw-flow.css:44|/* 使用者演出由 1.8s 左右压缩到 0.72s。 */ .group-row-card.card-use-fx, .group-row-card.cfx-green, .group-row-card.cfx-red, .group-row-card.cfx-spiny, .group-row-card.cfx-banana, .group-row-card.cfx-horn, .group-row-card.cfx-bomb, .group-row-card.cfx-hammer, .group-row-card.cfx-lightning, .group-row-card.cfx-coin, .group-row-card.cfx-rise, .group-row-card.cfx-mushroom, .group-row-card.cfx-boo, .group-row-card.cfx-blooper, .group-row-card.cfx-star, .group-row-card.cfx-giant, .group-row-card.cfx-bullet, .group-row-card.cfx-power, .group-row-card.cfx-feather, .group-row-card.cfx-fireflower, .group-row-card.cfx-iceflower, .group-row-card.cfx-boomerang|需要进一步测试|
|src/styles/items/draw-flow.css:70|.group-row-card.card-use-fx .card-fx-badge, .group-row-card.card-use-fx:before, .group-row-card.card-use-fx:after|需要进一步测试|
|src/styles/items/draw-flow.css:76|/* 命中 / 防御 / 治疗反馈压缩到约 0.65s。 */ .group-row-card.card-hit-fx, .group-row-card.card-defend-fx, .group-row-card.card-heal-fx, .group-row-card[class*="hit-"]|需要进一步测试|
|src/styles/items/draw-flow.css:84|.group-row-card[class*="hit-"]::after, .group-row-card.card-hit-fx:before|需要进一步测试|
|src/styles/items/draw-flow.css:88|.attack-hit-badge|需要进一步测试|
|src/styles/items/draw-flow.css:91|/* 顶部“某组使用某道具”横幅。 */ .item-use-banner|需要进一步测试|
|src/styles/items/draw-flow.css:96|/* 炸弹等遗留小特效也不要拖。 */ .effect-bomb|需要进一步测试|
|src/styles/items/encyclopedia-layout.css:1|/* ===== V2.17.0：道具百科固定左图右文 ===== */ #aboutMain .item-reference-head|需要进一步测试|
|src/styles/items/encyclopedia-layout.css:8|#aboutMain .item-reference-head h2|需要进一步测试|
|src/styles/items/encyclopedia-layout.css:12|#aboutMain .item-reference-sub|需要进一步测试|
|src/styles/items/encyclopedia-layout.css:17|#aboutMain .item-reference-list|需要进一步测试|
|src/styles/items/encyclopedia-layout.css:23|#aboutMain .item-reference-row|需要进一步测试|
|src/styles/items/encyclopedia-layout.css:37|#aboutMain .item-reference-icon|需要进一步测试|
|src/styles/items/encyclopedia-layout.css:54|#aboutMain .item-reference-icon .item-reference-img, #aboutMain .item-reference-icon img|需要进一步测试|
|src/styles/items/encyclopedia-layout.css:68|#aboutMain .item-reference-copy|需要进一步测试|
|src/styles/items/encyclopedia-layout.css:75|#aboutMain .item-reference-name|需要进一步测试|
|src/styles/items/encyclopedia-layout.css:81|#aboutMain .item-reference-desc|需要进一步测试|
|src/styles/items/encyclopedia-layout.css:88|/* 百科所在右栏允许正常滚动，不让单个 PNG 改变窗口尺寸。 */ #aboutMain|需要进一步测试|
|src/styles/items/encyclopedia-layout.css:93|#aboutMain img|需要进一步测试|
|src/styles/items/encyclopedia-layout.css:98|#aboutMain .item-reference-row|需要进一步测试|
|src/styles/items/encyclopedia-layout.css:104|#aboutMain .item-reference-icon|需要进一步测试|
|src/styles/items/encyclopedia-layout.css:112|#aboutMain .item-reference-icon .item-reference-img,   #aboutMain .item-reference-icon img|需要进一步测试|
|src/styles/items/encyclopedia-layout.css:119|#aboutMain .item-reference-name|需要进一步测试|
|src/styles/items/encyclopedia-layout.css:122|#aboutMain .item-reference-desc|需要进一步测试|
|src/styles/items/feature-visibility.css:1|body.items-disabled .group-row-card|需要进一步测试|
|src/styles/items/feature-visibility.css:3|.ui-toggle|需要进一步测试|
|src/styles/items/feature-visibility.css:10|.ui-toggle input|需要进一步测试|
|src/styles/items/feature-visibility.css:21|.ui-toggle-track|需要进一步测试|
|src/styles/items/feature-visibility.css:35|.ui-toggle-knob|需要进一步测试|
|src/styles/items/feature-visibility.css:48|.ui-toggle input:checked + .ui-toggle-track|需要进一步测试|
|src/styles/items/feature-visibility.css:52|.ui-toggle input:checked + .ui-toggle-track .ui-toggle-knob|需要进一步测试|
|src/styles/items/feature-visibility.css:55|.ui-toggle input:disabled + .ui-toggle-track|需要进一步测试|
|src/styles/items/feature-visibility.css:59|.ui-toggle:has(input:disabled), .ui-toggle input:disabled|需要进一步测试|
|src/styles/items/feature-visibility.css:64|.ui-toggle-track,   .ui-toggle-knob|需要进一步测试|
|src/styles/items/group-rule-copy.css:1|/* V2.18.2 小组信息道具区同步新版规则 */ .item-rule|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1|.item-defense-toast|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:15|.item-window|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:18|.item-side|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:26|.item-side-title|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:29|.item-tab|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:33|.item-inventory-grid|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:36|.item-stat-grid|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:40|/* ===== 完整课堂版 V2：其余工作台 ===== */ .picker-layout|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:46|.picker-left, .picker-right|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:54|.picker-left|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:57|.picker-right|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:60|.picker-center|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:62|.picker-vtab|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:73|.picker-vtab.active|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:78|.picker-info-tabs|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:83|.picker-info-tabs button|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:92|.picker-info-tabs button.active|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:96|#pickerInfoBox|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:100|.picker-log|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:104|.picker-target|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:112|.picker-score-grid|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:117|.classroom-backdrop, .about-backdrop|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:128|.classroom-backdrop.active, .about-backdrop.active|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:132|.classroom-window, .about-window|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:142|.classroom-head, .about-head|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:151|.classroom-body|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:156|.hand-grid|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:161|.hand-group|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:169|.hand-group.selected|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:173|.hand-actions, .hand-rewards|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:180|.hand-rewards|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:186|.item-settings-tabs|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:196|.item-settings-tabs button|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:204|.item-settings-tabs button.active|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:208|.item-settings-pane|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:211|.item-settings-pane.active|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:214|.item-ency-grid|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:218|.ency-card|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:226|.ency-icon|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:237|.ency-icon img, .item-slot img, .item-big-icon img|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:244|.ency-name|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:247|.ency-desc|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:253|.ency-actions|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:258|.about-window|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:262|.about-side|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:267|.about-side button|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:279|.about-side button.active|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:283|.about-main|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:288|.guide-block|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:296|.god-item-tools|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:303|.god-item-grid|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:307|.god-item-grid button|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:310|.group-row-card.item-draw-spinning .card-header-row, .group-row-card.item-draw-spinning .item-slots, .group-row-card.item-draw-spinning .answer-zone, .group-row-card.item-draw-spinning .score-zone, .group-row-card.item-draw-spinning .group-actions|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:317|.group-row-card.item-draw-spinning|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:321|.card-item-roulette|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:326|.card-item-roulette .r-icon|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:328|.card-item-roulette .r-name|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:330|.card-item-roulette.reveal|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:335|.picker-layout|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:338|.picker-left,   .picker-right|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:343|.about-window|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:346|.about-side|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:351|.about-side button|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:355|/* ===== V2.1 举手菜单内道具抽取 ===== */ .hand-item-draw-stage|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:374|.hand-item-capsule|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:392|.hand-item-capsule.spinning|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:395|.hand-item-capsule.reveal|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:398|.hand-item-draw-name|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:404|.hand-item-draw-sub|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:409|.hand-item-progress|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:416|.hand-item-progress > div|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:422|.hand-item-result-actions|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:430|from|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:434|to|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:439|/* ===== V2.4 自定义道具图片：永远 contain，不再把一张图铺成整张卡 ===== */ .item-slot|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:444|.item-slot > img, .item-big-icon > img, .ency-icon > img, .hand-item-capsule > img, .card-item-roulette .r-icon > img|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:458|.card-item-roulette .r-icon|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/inventory-and-roulette.css:460|.card-item-roulette .r-icon > img|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:462|.hand-item-capsule > img|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:466|.item-big-icon|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:469|.item-big-icon > img|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:473|.item-slot > img|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:477|/* ===== 卡片抽取：水晶轮盘，不再直接拿图片撑满卡片 ===== */ .group-row-card.item-draw-spinning|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:483|.group-row-card.item-draw-spinning .card-header-row, .group-row-card.item-draw-spinning .item-slots, .group-row-card.item-draw-spinning .answer-zone, .group-row-card.item-draw-spinning .score-zone, .group-row-card.item-draw-spinning .group-actions|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:494|.card-item-roulette|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:518|.card-item-roulette:before|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:530|.card-item-roulette:after|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:545|.card-item-roulette .r-icon|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:563|.card-item-roulette .r-icon.roulette-swap|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:566|.card-item-roulette .r-name|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:576|.card-item-roulette .r-hint|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:583|.card-item-roulette.reveal|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:593|.card-item-roulette.reveal:before|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:600|.card-item-roulette.reveal .r-icon|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:607|.card-item-roulette.reveal .r-name|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:612|from|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:617|to|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:624|to|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:629|to|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/inventory-and-roulette.css:634|0%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:639|55%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:644|100%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:649|0%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:652|45%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:655|100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/inventory-and-roulette.css:660|from|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:664|55%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:667|to|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:672|/* 举手菜单抽取同步升级 */ .hand-item-draw-stage|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:683|.hand-item-capsule|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:701|.hand-item-capsule.spinning|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:704|.hand-item-capsule.spinning > *|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:707|.hand-item-capsule.reveal|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:710|.hand-item-progress|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:715|.hand-item-progress > div|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:721|from|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:724|to|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:729|from|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:733|to|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/inventory-and-roulette.css:739|0%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:743|50%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:747|100%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:752|/* ===== V2.5 比赛页小组卡片道具动画 ===== */ .group-row-card|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:759|.group-row-card.card-use-fx|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:764|.group-row-card.card-use-fx:before, .group-row-card.card-use-fx:after|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:771|.group-row-card.card-use-fx .card-fx-badge|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:792|.group-row-card.card-use-fx .card-fx-badge .cfi|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:800|.group-row-card.card-use-fx .card-fx-badge img|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:805|.group-row-card.card-use-fx:before|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:814|.group-row-card.card-use-fx:after|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:828|/* 攻击类 */ .group-row-card.cfx-green|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:835|.group-row-card.cfx-red|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:840|.group-row-card.cfx-spiny|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:845|.group-row-card.cfx-banana|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:850|.group-row-card.cfx-horn|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:855|.group-row-card.cfx-bomb|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:860|.group-row-card.cfx-hammer|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:865|.group-row-card.cfx-lightning|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:870|/* 增益/特殊类 */ .group-row-card.cfx-coin|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:877|.group-row-card.cfx-rise|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:882|.group-row-card.cfx-mushroom|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:887|.group-row-card.cfx-boo|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:892|.group-row-card.cfx-blooper|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:897|.group-row-card.cfx-star|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:902|.group-row-card.cfx-giant|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:907|.group-row-card.cfx-bullet|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:912|.group-row-card.cfx-power|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:917|/* 被命中的卡片 */ .group-row-card.card-hit-fx|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:925|.group-row-card.card-hit-fx:before|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:937|.group-row-card.card-defend-fx|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:941|.group-row-card.card-heal-fx|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:947|0%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:951|18%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:955|68%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:959|100%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:965|0%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:969|18%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:973|72%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:976|100%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:982|0%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:986|25%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:989|100%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:995|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/inventory-and-roulette.css:999|18%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1002|30%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/inventory-and-roulette.css:1005|42%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1010|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/inventory-and-roulette.css:1014|20%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1017|42%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1022|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/inventory-and-roulette.css:1026|22%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1029|32%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1034|0%,   100%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1038|22%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1041|34%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1046|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/inventory-and-roulette.css:1050|20%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1053|38%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1058|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/inventory-and-roulette.css:1062|18%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1065|35%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1070|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/inventory-and-roulette.css:1074|20%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1077|45%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1082|0%,   12%,   24%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/inventory-and-roulette.css:1088|6%,   18%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1094|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/inventory-and-roulette.css:1098|22%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1103|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/inventory-and-roulette.css:1107|24%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1110|55%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/inventory-and-roulette.css:1115|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/inventory-and-roulette.css:1119|18%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1122|38%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1127|0%,   100%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1131|25%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1135|58%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1140|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/inventory-and-roulette.css:1144|22%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1147|55%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1152|0%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1155|35%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1158|70%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1161|100%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1166|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/inventory-and-roulette.css:1170|26%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1173|55%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1178|0%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1182|24%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1186|100%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1191|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/inventory-and-roulette.css:1195|22%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1198|55%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/inventory-and-roulette.css:1203|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/inventory-and-roulette.css:1207|12%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1210|20%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1213|29%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1216|38%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1221|0%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/inventory-and-roulette.css:1224|12%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1228|38%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1232|100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/inventory-and-roulette.css:1237|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/inventory-and-roulette.css:1241|20%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1245|38%|需要进一步测试|
|src/styles/items/inventory-and-roulette.css:1250|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/inventory-and-roulette.css:1254|20%|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:1|.queue-help|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:16|.queue-help b|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:20|.queue-help span|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:23|.queue-inventory-grid|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:27|.queue-item-card|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:35|.queue-role-badge|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:45|.queue-main-card|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:51|.queue-main-card .queue-role-badge|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:56|.queue-secondary-card|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:61|.queue-secondary-card .queue-role-badge|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:66|.queue-secondary-lock|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:73|.queue-persistent-active|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:78|.queue-negative-note|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:83|/* 比赛卡片中的紧凑队列槽 */ .item-slot.queue-main-slot, .item-slot.queue-secondary-slot|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:90|.item-slot .queue-slot-role|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:107|.item-slot.queue-main-slot|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:114|.item-slot.queue-main-slot .queue-slot-role|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:118|.item-slot.queue-secondary-slot|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:123|.item-slot.queue-secondary-slot .queue-slot-role|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:128|.item-slot.queue-persistent-active|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:132|.queue-empty-plus|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:135|.item-slot.queue-promoted|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:140|0%|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:145|38%|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:152|100%|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:157|/* V2.12.1 内置道具 PNG */ .item-slot img, .item-big-icon img, .r-icon img, .hand-item-capsule img, .god-item-grid img, .item-admin-add img, .card-fx-badge img, .roulette img|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:172|.item-slot img|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:174|.item-big-icon img|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:176|.r-icon img, .hand-item-capsule img|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:181|.god-item-grid img, .item-admin-add img|需要进一步测试|
|src/styles/items/queue-and-image-constraints.css:186|.roulette img|需要进一步测试|
|src/styles/items/roulette-position.css:1|/* ===== V2.16.3：修复卡片内道具轮盘定位 =====    V2.16.2 中先写了 top:50%，随后又用了 inset:auto 10px auto 10px，    inset 简写把 top 重新覆盖成 auto，导致绝对定位元素跑回“静态位置”。    现在直接用明确的 top/left/right/bottom，避免人类最喜欢的 CSS 自相残杀。 */ body.modern-flat .group-row-card.item-draw-spinning|需要进一步测试|
|src/styles/items/roulette-position.css:7|body.modern-flat .group-row-card.item-draw-spinning .card-item-roulette|需要进一步测试|
|src/styles/items/roulette-position.css:22|/* reveal 状态同样锁定在卡片正中央。 */ body.modern-flat   .group-row-card.item-draw-spinning   .card-item-roulette.reveal|需要进一步测试|
|src/styles/items/roulette-position.css:35|body.modern-flat .group-row-card.item-draw-spinning .card-item-roulette|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:1|.card-item-roulette|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:5|.card-item-roulette .r-icon|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:11|.card-item-roulette .r-icon > img|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:15|.card-item-roulette .r-name|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:27|.card-item-roulette .r-hint|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:37|.card-item-roulette:before|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:42|.card-item-roulette.reveal:before|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:46|from|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:50|55%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/roulette-result-and-flowers.css:53|to|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:59|.card-item-roulette|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:63|.card-item-roulette .r-icon|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:68|.card-item-roulette .r-name|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:74|/* 举手抽取也采用横向结果语言 */ .hand-item-draw-stage.hand-draw-horizontal|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:83|.hand-item-draw-stage.hand-draw-horizontal .hand-draw-head|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:86|.hand-item-draw-stage.hand-draw-horizontal .hand-item-capsule|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:90|.hand-item-draw-stage.hand-draw-horizontal .hand-draw-copy|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:94|.hand-item-draw-stage.hand-draw-horizontal .hand-item-draw-name|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:98|.hand-item-draw-stage.hand-draw-horizontal .hand-item-progress|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:101|.hand-item-draw-stage.hand-draw-horizontal .hand-item-result-actions|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:104|/* ===== V2.8.2：修正轮盘光环定位 ===== */ .card-item-roulette|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:109|.card-item-roulette:before|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:116|.card-item-roulette .r-icon|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:120|.card-item-roulette .r-name|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:125|.card-item-roulette:before|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:131|/* 新增四种道具的卡片发动色彩 */ .group-row-card.cfx-feather|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:138|.group-row-card.cfx-fireflower|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:143|.group-row-card.cfx-iceflower|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:148|.group-row-card.cfx-boomerang|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:154|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/roulette-result-and-flowers.css:158|22%|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:161|55%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/roulette-result-and-flowers.css:166|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/roulette-result-and-flowers.css:170|18%|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:173|42%|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:178|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/roulette-result-and-flowers.css:182|18%|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:185|50%|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:190|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/items/roulette-result-and-flowers.css:194|20%|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:197|42%|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:201|/* V2.8.3 新增道具在上帝模式中的按钮布局 */ .item-admin-add|需要进一步测试|
|src/styles/items/roulette-result-and-flowers.css:209|.item-admin-add img|需要进一步测试|
|src/styles/settings/clear-items.css:1|.clear-items-row|需要进一步测试|
|src/styles/settings/clear-items.css:10|.clear-items-copy|需要进一步测试|
|src/styles/settings/clear-items.css:16|.clear-items-copy b|需要进一步测试|
|src/styles/settings/clear-items.css:20|.clear-items-copy span|需要进一步测试|
|src/styles/settings/clear-items.css:25|.clear-items-row .btn-danger|需要进一步测试|
|src/styles/settings/clear-items.css:30|.clear-items-row|需要进一步测试|
|src/styles/settings/clear-items.css:34|.clear-items-row .btn-danger|需要进一步测试|
|src/styles/settings/tabs-and-confirmation.css:1|.legacy-settings-tabs|需要进一步测试|
|src/styles/settings/tabs-and-confirmation.css:11|.legacy-settings-tabs button|需要进一步测试|
|src/styles/settings/tabs-and-confirmation.css:20|.legacy-settings-tabs button.active|需要进一步测试|
|src/styles/settings/tabs-and-confirmation.css:25|.legacy-settings-pane|需要进一步测试|
|src/styles/settings/tabs-and-confirmation.css:29|.legacy-settings-pane.active|需要进一步测试|
|src/styles/settings/tabs-and-confirmation.css:32|.icon-custom-grid|需要进一步测试|
|src/styles/settings/tabs-and-confirmation.css:37|.icon-custom-card|需要进一步测试|
|src/styles/settings/tabs-and-confirmation.css:46|.icon-preview|需要进一步测试|
|src/styles/settings/tabs-and-confirmation.css:57|.icon-preview img, .custom-ui-icon|需要进一步测试|
|src/styles/settings/tabs-and-confirmation.css:63|.custom-ui-icon|需要进一步测试|
|src/styles/settings/tabs-and-confirmation.css:68|/* ===== V2.8 程序样式确认弹窗 ===== */ .program-confirm-overlay|需要进一步测试|
|src/styles/settings/tabs-and-confirmation.css:82|.program-confirm-window|需要进一步测试|
|src/styles/settings/tabs-and-confirmation.css:99|.program-confirm-titlebar|需要进一步测试|
|src/styles/settings/tabs-and-confirmation.css:113|.program-confirm-body|需要进一步测试|
|src/styles/settings/tabs-and-confirmation.css:120|.program-confirm-icon|需要进一步测试|
|src/styles/settings/tabs-and-confirmation.css:135|.program-confirm-text|需要进一步测试|
|src/styles/settings/tabs-and-confirmation.css:141|.program-confirm-actions|需要进一步测试|
|src/styles/settings/tabs-and-confirmation.css:149|.program-confirm-actions button|需要进一步测试|
|src/styles/settings/tabs-and-confirmation.css:153|from|需要进一步测试|
|src/styles/settings/tabs-and-confirmation.css:156|to|需要进一步测试|
|src/styles/settings/tabs-and-confirmation.css:161|from|重复实现（仅语法；层叠需进一步测试）|
|src/styles/settings/tabs-and-confirmation.css:165|to|需要进一步测试|
|src/styles/shell/dock-and-buttons.css:1|.bottom-dock|需要进一步测试|
|src/styles/shell/dock-and-buttons.css:18|.dock-left|需要进一步测试|
|src/styles/shell/dock-and-buttons.css:25|.dock-right|需要进一步测试|
|src/styles/shell/dock-and-buttons.css:32|.status-badge|需要进一步测试|
|src/styles/shell/dock-and-buttons.css:51|.status-badge.active|需要进一步测试|
|src/styles/shell/dock-and-buttons.css:56|.status-badge.done|需要进一步测试|
|src/styles/shell/dock-and-buttons.css:61|.icon-btn|需要进一步测试|
|src/styles/shell/dock-and-buttons.css:77|.icon-btn:hover|需要进一步测试|
|src/styles/shell/dock-and-buttons.css:80|.icon-btn.locked|需要进一步测试|
|src/styles/shell/dock-and-buttons.css:85|.icon-btn.unlocked|需要进一步测试|
|src/styles/shell/dock-and-buttons.css:90|.icon-btn.zoom-in|需要进一步测试|
|src/styles/shell/dock-and-buttons.css:97|.icon-btn.zoom-in:hover|需要进一步测试|
|src/styles/shell/dock-and-buttons.css:101|.icon-btn.zoom-out|需要进一步测试|
|src/styles/shell/dock-and-buttons.css:108|.icon-btn.zoom-out:hover|需要进一步测试|
|src/styles/shell/dock-and-buttons.css:112|.icon-btn.zoom-reset|需要进一步测试|
|src/styles/shell/dock-and-buttons.css:119|.icon-btn.zoom-reset:hover|需要进一步测试|
|src/styles/shell/dock-and-buttons.css:123|.btn|需要进一步测试|
|src/styles/shell/dock-and-buttons.css:134|.btn-primary|需要进一步测试|
|src/styles/shell/dock-and-buttons.css:138|.btn-primary:hover|需要进一步测试|
|src/styles/shell/dock-and-buttons.css:141|.btn-success|需要进一步测试|
|src/styles/shell/dock-and-buttons.css:145|.btn-success:hover|需要进一步测试|
|src/styles/shell/dock-and-buttons.css:148|.btn-warning|需要进一步测试|
|src/styles/shell/dock-and-buttons.css:152|.btn-warning:hover|需要进一步测试|
|src/styles/shell/dock-and-buttons.css:155|.btn-danger|需要进一步测试|
|src/styles/shell/dock-and-buttons.css:159|.btn-danger:hover|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:1|.app-topnav .header-title|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:3|.app-topnav .header-title small|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:7|.app-topnav .header-stats|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:10|.nav-tabs|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:15|.nav-tab|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:27|.nav-tab:hover|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:31|.nav-tab.active|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:37|/* 欢迎页大屏 */ #view-welcome|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:42|.welcome-hero|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:66|.welcome-clock|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:75|.welcome-date|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:81|.welcome-greeting|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:87|.welcome-sub|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:91|.welcome-cards|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:99|.welcome-card|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:106|.welcome-card-title|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:113|.welcome-stat-grid|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:118|.w-stat-num|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:126|.w-stat-label|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:131|.welcome-enter-wrap|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:134|.welcome-enter-btn|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:147|.welcome-enter-btn:hover|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:151|.welcome-enter-btn:active|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:154|/* 全屏视图通用 */ .fullview-header|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:167|.fullview-header h2|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:173|.fullview-sub|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:178|.fullview-body|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:184|#view-history, #view-archives, #view-settings|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:193|/* 历史时间轴 */ .history-timeline|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:199|.history-timeline::before|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:209|.hist-node|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:213|.hist-node::before|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:224|.hist-node.current::before|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:228|.hist-card|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:236|.hist-card:hover|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:240|.hist-card-top|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:247|.hist-desc|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:252|.hist-time|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:257|.hist-compare|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:263|.hist-node.expanded .hist-compare|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:266|.hist-compare-table|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:272|.hist-compare-table th, .hist-compare-table td|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:278|.hist-compare-table th|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:282|.hist-delta-pos|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:286|.hist-delta-neg|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:290|.hist-delta-zero|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:293|.hist-actions|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:299|/* 设置页 */ .settings-scroll|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:308|.setting-section-title|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:316|.setting-section-title:first-child|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:319|.engine-row|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:329|.engine-row > label|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:333|.engine-row input[type="range"]|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:336|.engine-row .engine-val|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:343|.trim-grid|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:349|.trim-row|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:358|.trim-row .trim-name|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:364|.trim-row .trim-val|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:371|.archives-list|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:374|.settings-toolbar|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:381|.welcome-cards|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:384|.welcome-clock|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:387|.app-topnav|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:391|.nav-tabs|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:394|.welcome-greeting|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:399|/* 壁纸设置的结构规则由唯一扁平主题接管。 */ .wall-actions|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:407|.wall-file-btn|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:411|.wall-file-btn input|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:417|/* ================= 道具系统 V1 ================= */ .item-slots|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:426|.item-slot|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:446|.item-slot.empty|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:449|.item-slot .charges|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:465|.group-row-card.item-def-green|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:470|.group-row-card.item-def-red|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:475|.group-row-card.item-def-yellow|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:480|.group-row-card.item-def-orange|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:485|.group-row-card.effect-star|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:488|.group-row-card.effect-mega|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:491|.group-row-card.effect-power|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:496|.group-row-card.effect-bullet|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:501|.group-row-card.effect-boo|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:505|.group-row-card.effect-bomb|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:509|0%|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:514|25%|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:519|50%|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:524|75%|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:529|100%|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:536|from|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:541|to|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:548|0%,   100%|重复实现（仅语法；层叠需进一步测试）|
|src/styles/shell/navigation-and-welcome.css:552|40%|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:559|.item-global-btn|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:574|.item-modal-backdrop|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:584|.item-modal-backdrop.active|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:587|.item-window|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:602|from|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:606|to|重复实现（仅语法；层叠需进一步测试）|
|src/styles/shell/navigation-and-welcome.css:611|.item-side|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:620|.item-side-title|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:625|.item-tab|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:637|.item-tab.active|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:642|.item-main|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:647|.item-main-head|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:654|.item-main-head h3|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:658|.item-close|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:667|.item-inventory-grid|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:672|.item-big|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:685|.item-big.empty|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:688|.item-big-icon|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:691|.item-big-name|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:694|.item-big-desc|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:698|.item-use|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:701|.item-stat-grid|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:706|.item-stat|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:713|.item-stat b|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:717|.item-stat span|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:721|.item-members|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:728|.item-score-panel|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:734|.item-score-panel input|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:740|.item-draw-overlay|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:750|.item-draw-overlay.active|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:753|.item-draw-board|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:762|.item-draw-title|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:768|.item-draw-grid|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:773|.item-draw-card|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:780|.item-draw-card .roulette|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:784|.item-draw-card .draw-name|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:788|.item-draw-card.full|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:791|.item-draw-card.reveal|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:795|50%|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:800|.squid-veil|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:824|.squid-veil.active|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:827|.squid-hidden-score|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:833|.squid-score-mask::after|需要进一步测试|
|src/styles/shell/navigation-and-welcome.css:844|.squid-score-mask|需要进一步测试|
|src/styles/themes/flat-foundation.css:1|/* ===== V2.17：唯一启用的青绿珊瑚扁平主题 ===== */ :root|需要进一步测试|
|src/styles/themes/flat-foundation.css:5|html|需要进一步测试|
|src/styles/themes/flat-foundation.css:17|body.modern-flat|需要进一步测试|
|src/styles/themes/flat-foundation.css:42|body.modern-flat *, body.modern-flat *::before, body.modern-flat *::after|需要进一步测试|
|src/styles/themes/flat-foundation.css:46|body.modern-flat .view, body.modern-flat .main-viewport, body.modern-flat #view-battle, body.modern-flat #view-history, body.modern-flat #view-archives, body.modern-flat #view-settings|需要进一步测试|
|src/styles/themes/flat-foundation.css:58|body.modern-flat #groupList|需要进一步测试|
|src/styles/themes/flat-foundation.css:63|/* 顶栏、底栏与稳定布局 */ body.modern-flat .app-topnav|需要进一步测试|
|src/styles/themes/flat-foundation.css:83|body.modern-flat .app-topnav .header-title|需要进一步测试|
|src/styles/themes/flat-foundation.css:87|body.modern-flat .app-topnav .header-title small, body.modern-flat .app-topnav .header-stats|需要进一步测试|
|src/styles/themes/flat-foundation.css:91|body.modern-flat .app-topnav .nav-tabs|需要进一步测试|
|src/styles/themes/flat-foundation.css:97|body.modern-flat .app-topnav .header-stats|需要进一步测试|
|src/styles/themes/flat-foundation.css:107|body.modern-flat .bottom-dock|需要进一步测试|
|src/styles/themes/flat-foundation.css:119|body.modern-flat .bottom-dock|需要进一步测试|
|src/styles/themes/flat-foundation.css:127|body.modern-flat .dock-left|需要进一步测试|
|src/styles/themes/flat-foundation.css:132|body.modern-flat .dock-right|需要进一步测试|
|src/styles/themes/flat-foundation.css:136|body.modern-flat .bottom-dock .btn|需要进一步测试|
|src/styles/themes/flat-foundation.css:141|/* 统一窗口尺寸：窗口自适应内容，只有主体区域滚动。 */ body.modern-flat .score-modal-backdrop, body.modern-flat .modal-overlay, body.modern-flat .member-search-backdrop, body.modern-flat .item-modal-backdrop, body.modern-flat .classroom-backdrop, body.modern-flat .about-backdrop|需要进一步测试|
|src/styles/themes/flat-foundation.css:153|body.modern-flat .score-modal-card, body.modern-flat .program-confirm-window, body.modern-flat #pwdModal .modal-box, body.modern-flat #settlementNameModal .modal-box|需要进一步测试|
|src/styles/themes/flat-foundation.css:162|body.modern-flat .member-search-card, body.modern-flat #batchImportModal .modal-box, body.modern-flat .modal-box.large|需要进一步测试|
|src/styles/themes/flat-foundation.css:170|body.modern-flat .item-window, body.modern-flat .about-window, body.modern-flat .classroom-window, body.modern-flat .item-draw-board|需要进一步测试|
|src/styles/themes/flat-foundation.css:179|body.modern-flat .item-window|需要进一步测试|
|src/styles/themes/flat-foundation.css:182|body.modern-flat #pickerModal .modal-box|需要进一步测试|
|src/styles/themes/flat-foundation.css:188|body.modern-flat .item-draw-board|需要进一步测试|
|src/styles/themes/flat-foundation.css:192|body.modern-flat .about-main, body.modern-flat .classroom-body, body.modern-flat #itemWindowBody|需要进一步测试|
|src/styles/themes/flat-foundation.css:199|body.modern-flat:has(.modal-overlay.active), body.modern-flat:has(.score-modal-backdrop.active), body.modern-flat:has(.item-modal-backdrop.active), body.modern-flat:has(.classroom-backdrop.active), body.modern-flat:has(.about-backdrop.active), body.modern-flat:has(.member-search-backdrop.active)|需要进一步测试|
|src/styles/themes/flat-foundation.css:207|/* 卡片、面板和弹窗 */ body.modern-flat .chart-container, body.modern-flat .dashboard-summary-container, body.modern-flat .quick-batch-bar, body.modern-flat .fullview-header, body.modern-flat .fullview-body, body.modern-flat .settings-scroll:not(.ui-settings-host), body.modern-flat .welcome-card, body.modern-flat .history-card, body.modern-flat .archive-card, body.modern-flat .setting-card, body.modern-flat .setting-item, body.modern-flat .setting-row, body.modern-flat .guide-block, body.modern-flat .ency-card, body.modern-flat .item-encyclopedia-card, body.modern-flat .sound-setting-card, body.modern-flat .icon-setting-card, body.modern-flat .trim-row, body.modern-flat .history-item, body.modern-flat .hist-card, body.modern-flat .setting-section, body.modern-flat .settings-card, body.modern-flat .stat-card, body.modern-flat .sound-row, body.modern-flat .item-card|需要进一步测试|
|src/styles/themes/flat-foundation.css:241|body.modern-flat   .group-row-card:not(.card-use-fx):not(.card-hit-fx):not(.card-defend-fx):not(     .card-heal-fx   )|需要进一步测试|
|src/styles/themes/flat-foundation.css:254|body.modern-flat   .group-row-card:not(.card-use-fx):not(.card-hit-fx):hover|需要进一步测试|
|src/styles/themes/flat-foundation.css:259|body.modern-flat .modal-box, body.modern-flat .score-modal-card, body.modern-flat .member-search-card, body.modern-flat .vista-window, body.modern-flat .item-window, body.modern-flat .picker-window, body.modern-flat .picker-modal, body.modern-flat .about-window, body.modern-flat .classroom-window, body.modern-flat .hand-window, body.modern-flat .item-draw-board, body.modern-flat .welcome-modal-card|需要进一步测试|
|src/styles/themes/flat-foundation.css:281|body.modern-flat .modal-overlay, body.modern-flat .score-modal-backdrop, body.modern-flat .member-search-backdrop, body.modern-flat .welcome-modal, body.modern-flat .item-modal-backdrop, body.modern-flat .item-draw-overlay, body.modern-flat .classroom-backdrop, body.modern-flat .about-backdrop|需要进一步测试|
|src/styles/themes/flat-foundation.css:291|body.modern-flat .item-side, body.modern-flat .about-side, body.modern-flat .picker-left, body.modern-flat .picker-center, body.modern-flat .picker-right, body.modern-flat .classroom-head, body.modern-flat .about-head, body.modern-flat .item-settings-tabs, body.modern-flat .legacy-settings-tabs, body.modern-flat .item-sidebar, body.modern-flat .item-tabs, body.modern-flat .about-tabs, body.modern-flat .window-titlebar|需要进一步测试|
|src/styles/themes/flat-foundation.css:309|/* 按钮和交互状态 */ body.modern-flat .btn, body.modern-flat .nav-tab, body.modern-flat .icon-btn, body.modern-flat .more-btn, body.modern-flat .opt-btn, body.modern-flat .ans-btn, body.modern-flat .allin-toggle-btn, body.modern-flat .item-tab, body.modern-flat .picker-vtab, body.modern-flat .picker-info-tabs button, body.modern-flat .item-settings-tabs button, body.modern-flat .legacy-settings-tabs button, body.modern-flat .item-global-btn, body.modern-flat .hand-group|需要进一步测试|
|src/styles/themes/flat-foundation.css:334|body.modern-flat   .btn:not(.btn-primary):not(.btn-success):not(.btn-warning):not(     .btn-danger   ):not(:disabled):hover, body.modern-flat .nav-tab:not(.active):not(:disabled):hover, body.modern-flat .icon-btn:not(:disabled):hover, body.modern-flat .more-btn:not(:disabled):hover, body.modern-flat .ans-btn:not(.selected):not(:disabled):hover|需要进一步测试|
|src/styles/themes/flat-foundation.css:348|body.modern-flat .nav-tab.active, body.modern-flat .btn-primary, body.modern-flat .item-tab.active, body.modern-flat .picker-vtab.active, body.modern-flat .picker-info-tabs button.active, body.modern-flat .item-settings-tabs button.active, body.modern-flat .legacy-settings-tabs button.active, body.modern-flat .ans-btn.selected|需要进一步测试|
|src/styles/themes/flat-foundation.css:362|body.modern-flat .ans-btn|需要进一步测试|
|src/styles/themes/flat-foundation.css:367|body.modern-flat .btn-success|需要进一步测试|
|src/styles/themes/flat-foundation.css:372|body.modern-flat .btn-warning|需要进一步测试|
|src/styles/themes/flat-foundation.css:377|body.modern-flat .btn-danger|需要进一步测试|
|src/styles/themes/flat-foundation.css:382|body.modern-flat .allin-toggle-btn.active|需要进一步测试|
|src/styles/themes/flat-foundation.css:388|body.modern-flat .opt-btn.active:not(.correct):not(.wrong)|需要进一步测试|
|src/styles/themes/flat-foundation.css:393|body.modern-flat .opt-btn.correct|需要进一步测试|
|src/styles/themes/flat-foundation.css:398|body.modern-flat .opt-btn.wrong|需要进一步测试|
|src/styles/themes/flat-foundation.css:403|body.modern-flat .btn:disabled, body.modern-flat button:disabled, body.modern-flat .locked-disabled, body.modern-flat .round-disabled|需要进一步测试|
|src/styles/themes/flat-foundation.css:414|/* 主操作：青绿；结算与重要提醒：珊瑚 */ body.modern-flat #btnMainAction, body.modern-flat .welcome-enter-btn|需要进一步测试|
|src/styles/themes/flat-foundation.css:426|body.modern-flat #btnMainAction:hover, body.modern-flat .welcome-enter-btn:hover|需要进一步测试|
|src/styles/themes/flat-foundation.css:431|body.modern-flat #btnNextRound:not(.locked-disabled)|需要进一步测试|
|src/styles/themes/flat-foundation.css:437|body.modern-flat #btnForceEnd:not(.locked-disabled)|需要进一步测试|
|src/styles/themes/flat-foundation.css:444|/* Theme-independent archive action: gold always means the final honor archive. */ body.modern-flat #btnFinalSettlement|需要进一步测试|
|src/styles/themes/flat-foundation.css:464|/* 表单、道具格与菜单 */ body.modern-flat input:not([type="checkbox"]), body.modern-flat textarea, body.modern-flat select|需要进一步测试|
|src/styles/themes/flat-foundation.css:474|body.modern-flat input:focus, body.modern-flat textarea:focus, body.modern-flat select:focus|需要进一步测试|
|src/styles/themes/flat-foundation.css:480|body.modern-flat .item-slot, body.modern-flat .item-big, body.modern-flat .item-stat, body.modern-flat .item-members, body.modern-flat .picker-target, body.modern-flat .hand-rewards, body.modern-flat .item-draw-card, body.modern-flat .icon-custom-card, body.modern-flat .wmp-item|需要进一步测试|
|src/styles/themes/flat-foundation.css:494|body.modern-flat .queue-main-slot, body.modern-flat .queue-secondary-slot|需要进一步测试|
|src/styles/themes/flat-foundation.css:500|body.modern-flat #v2ItemEncyclopedia .ency-card|需要进一步测试|
|src/styles/themes/flat-foundation.css:507|body.modern-flat .item-encyclopedia-icon-disc|需要进一步测试|
|src/styles/themes/flat-foundation.css:513|body.modern-flat .hand-item-draw-stage|需要进一步测试|
|src/styles/themes/flat-foundation.css:519|body.modern-flat .hand-item-capsule|需要进一步测试|
|src/styles/themes/flat-foundation.css:525|body.modern-flat .battle-group-number|需要进一步测试|
|src/styles/themes/flat-foundation.css:535|body.modern-flat .battle-group-name, body.modern-flat .dashboard-card-title, body.modern-flat .welcome-card-title, body.modern-flat .setting-section-title|需要进一步测试|
|src/styles/themes/flat-foundation.css:542|body.modern-flat .battle-group-subtitle, body.modern-flat .fullview-sub, body.modern-flat .metric-label|需要进一步测试|
|src/styles/themes/flat-foundation.css:547|/* 排名和图表 */ body.modern-flat .podium-col|需要进一步测试|
|src/styles/themes/flat-foundation.css:555|body.modern-flat .podium-col::before, body.modern-flat .quick-batch-bar::before|需要进一步测试|
|src/styles/themes/flat-foundation.css:559|body.modern-flat .podium-col.rank-1|需要进一步测试|
|src/styles/themes/flat-foundation.css:563|body.modern-flat .podium-col.rank-2|需要进一步测试|
|src/styles/themes/flat-foundation.css:567|body.modern-flat .podium-col.rank-3|需要进一步测试|
|src/styles/themes/flat-foundation.css:571|body.modern-flat .chart-track|需要进一步测试|
|src/styles/themes/flat-foundation.css:577|body.modern-flat .chart-bar|需要进一步测试|
|src/styles/themes/flat-foundation.css:582|body.modern-flat .welcome-clock|需要进一步测试|
|src/styles/themes/flat-foundation.css:586|/* 程序确认弹窗：替换最后一处 Vista 标题栏与警告球 */ body.modern-flat .program-confirm-overlay|需要进一步测试|
|src/styles/themes/flat-foundation.css:592|body.modern-flat .program-confirm-window|需要进一步测试|
|src/styles/themes/flat-foundation.css:603|body.modern-flat .program-confirm-titlebar|需要进一步测试|
|src/styles/themes/flat-foundation.css:610|body.modern-flat .program-confirm-icon|需要进一步测试|
|src/styles/themes/flat-foundation.css:618|body.modern-flat .program-confirm-text|需要进一步测试|
|src/styles/themes/flat-foundation.css:621|body.modern-flat .program-confirm-actions|需要进一步测试|
|src/styles/themes/flat-foundation.css:626|body.modern-flat .program-confirm-actions button|需要进一步测试|
|src/styles/themes/flat-foundation.css:631|/* V2.16 欢迎页布局迁移，不再依赖 legacy 主题类 */ body.modern-flat .battle-main|需要进一步测试|
|src/styles/themes/flat-foundation.css:636|body.modern-flat .battle-main > .top-dashboard-grid|需要进一步测试|
|src/styles/themes/flat-foundation.css:639|body.modern-flat .welcome-card-title-row|需要进一步测试|
|src/styles/themes/flat-foundation.css:645|body.modern-flat .welcome-summary-grid > div, body.modern-flat .welcome-extra-metrics .metric-box|需要进一步测试|
|src/styles/themes/flat-foundation.css:650|body.modern-flat .welcome-extra-metrics|需要进一步测试|
|src/styles/themes/flat-foundation.css:658|body.modern-flat .welcome-chart-wrapper|需要进一步测试|
|src/styles/themes/flat-foundation.css:664|/* 常驻 UI 禁止材质效果；功能性道具动画类不在此清单中 */ body.modern-flat .status-badge, body.modern-flat .metric-box, body.modern-flat .wmp-tag, body.modern-flat .row-score, body.modern-flat .welcome-modal-btn|需要进一步测试|
|src/styles/themes/flat-foundation.css:675|body.modern-flat .item-use-banner|需要进一步测试|
|src/styles/themes/flat-foundation.css:680|body.modern-flat .audio-hint-bar|需要进一步测试|
|src/styles/themes/flat-foundation.css:688|/* 道具图片尺寸由使用组件决定，原始 PNG 永远不能撑开页面。 */ .item-slot img|需要进一步测试|
|src/styles/themes/flat-foundation.css:698|.item-big-icon img|需要进一步测试|
|src/styles/themes/flat-foundation.css:706|.attack-hit-badge span|需要进一步测试|
|src/styles/themes/flat-foundation.css:715|.attack-hit-badge span img|需要进一步测试|
|src/styles/themes/flat-foundation.css:723|.card-fx-badge .cfi|需要进一步测试|
|src/styles/themes/flat-foundation.css:732|.card-fx-badge .cfi img|需要进一步测试|
|src/styles/themes/flat-foundation.css:740|.item-use-banner|需要进一步测试|
|src/styles/themes/flat-foundation.css:756|.item-use-banner .iub-icon|需要进一步测试|
|src/styles/themes/flat-foundation.css:765|.item-use-banner .iub-icon img|需要进一步测试|
|src/styles/themes/flat-foundation.css:773|.item-use-banner .iub-main|需要进一步测试|
|src/styles/themes/flat-foundation.css:780|.item-use-banner .iub-sub|需要进一步测试|
|src/styles/themes/flat-foundation.css:789|0%|需要进一步测试|
|src/styles/themes/flat-foundation.css:793|12%|需要进一步测试|
|src/styles/themes/flat-foundation.css:797|76%|需要进一步测试|
|src/styles/themes/flat-foundation.css:801|100%|需要进一步测试|
|src/styles/themes/flat-foundation.css:806|/* 小组详情内嵌编辑。 */ .group-detail-form|需要进一步测试|
|src/styles/themes/flat-foundation.css:813|.group-detail-section|需要进一步测试|
|src/styles/themes/flat-foundation.css:819|.group-detail-section h4|需要进一步测试|
|src/styles/themes/flat-foundation.css:824|.group-detail-fields|需要进一步测试|
|src/styles/themes/flat-foundation.css:829|.group-detail-field|需要进一步测试|
|src/styles/themes/flat-foundation.css:834|.group-detail-field label|需要进一步测试|
|src/styles/themes/flat-foundation.css:839|.group-detail-field input, .group-detail-field textarea|需要进一步测试|
|src/styles/themes/flat-foundation.css:846|.group-detail-field textarea|需要进一步测试|
|src/styles/themes/flat-foundation.css:851|.group-color-control|需要进一步测试|
|src/styles/themes/flat-foundation.css:856|.group-color-control input[type="color"]|需要进一步测试|
|src/styles/themes/flat-foundation.css:862|.group-color-preview|需要进一步测试|
|src/styles/themes/flat-foundation.css:868|.group-detail-actions|需要进一步测试|
|src/styles/themes/flat-foundation.css:874|.group-detail-lock|需要进一步测试|
|src/styles/themes/flat-foundation.css:883|.group-detail-danger|需要进一步测试|
|src/styles/themes/flat-foundation.css:887|.group-detail-danger p|需要进一步测试|
|src/styles/themes/flat-foundation.css:892|@media (max-width: 1050px)|需要进一步测试|
|src/styles/themes/flat-foundation.css:895|/* Dock layout has one responsive owner. Narrow windows keep all actions reachable. */ body.modern-flat|需要进一步测试|
|src/styles/themes/flat-foundation.css:899|body.modern-flat button:focus-visible, body.modern-flat input:focus-visible, body.modern-flat textarea:focus-visible|需要进一步测试|
|src/styles/themes/flat-foundation.css:907|body.modern-flat *,   body.modern-flat *::before,   body.modern-flat *::after|需要进一步测试|
|src/styles/themes/flat-foundation.css:916|.classroom-save-warning|需要进一步测试|
|src/styles/themes/flat-foundation.css:930|.classroom-save-warning[hidden]|需要进一步测试|
|src/styles/themes/flat-foundation.css:933|.classroom-recovery-tools|需要进一步测试|
|src/styles/themes/flat-foundation.css:942|.classroom-recovery-actions|需要进一步测试|
|src/styles/themes/flat-foundation.css:947|#classroomRecoveryCandidates|需要进一步测试|
|src/styles/themes/flat-foundation.css:951|#classroomRecoveryCandidates article|需要进一步测试|
|src/styles/themes/flat-foundation.css:961|#classroomRecoveryCandidates p, #classroomRecoveryPreview p|需要进一步测试|
|src/styles/themes/flat-foundation.css:965|#classroomRecoveryPreview|需要进一步测试|
|src/styles/themes/flat-foundation.css:972|#classroomRecoveryPreview[hidden]|需要进一步测试|
|src/styles/ui/defense-notices.css:1|/* ===== V2.17.35：顶部提示统一样式 + 自动错层 ===== */ .top-notice-stack|需要进一步测试|
|src/styles/ui/defense-notices.css:14|/* 放进堆栈后，顶部道具提示不再自己 fixed，否则会互相盖住 */ .top-notice-stack .item-use-banner|需要进一步测试|
|src/styles/ui/defense-notices.css:25|/* 防御提示直接复用顶部道具提示的结构和视觉 */ .item-defense-banner|需要进一步测试|
|src/styles/ui/defense-notices.css:32|.item-defense-banner .iub-icon|需要进一步测试|
|src/styles/ui/defense-notices.css:35|.item-defense-banner .iub-main|需要进一步测试|
|src/styles/ui/defense-notices.css:41|.top-notice-stack|需要进一步测试|
|src/styles/ui/dock-tooltips.css:1|.dock-humor-tip|需要进一步测试|
|src/styles/ui/dock-tooltips.css:17|.dock-humor-tip.show|需要进一步测试|
|src/styles/ui/dock-tooltips.css:21|.dock-humor-tip b|需要进一步测试|
|src/styles/ui/dock-tooltips.css:27|.dock-humor-tip span|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:1|/* ===== V2.17.19：扁平 UI 一致性、可读性与滚动区修复 ===== */ body.modern-flat|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:6|/* 文本始终保持横排和可读，允许在真实单词边界或必要位置换行。 */ body.modern-flat .about-main, body.modern-flat .settings-scroll, body.modern-flat .legacy-settings-pane, body.modern-flat .item-main, body.modern-flat #itemWindowBody|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:18|body.modern-flat ::placeholder|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:22|/* 中性按钮与语义按钮分别处理，避免通用 hover 把白字按钮洗成白底。 */ body.modern-flat   .btn:not(.btn-primary):not(.btn-success):not(.btn-warning):not(     .btn-danger   ):not(:disabled):hover, body.modern-flat .nav-tab:not(.active):not(:disabled):hover, body.modern-flat .icon-btn:not(:disabled):hover, body.modern-flat .more-btn:not(:disabled):hover, body.modern-flat .ans-btn:not(.selected):not(:disabled):hover, body.modern-flat .item-tab:not(.active):not(:disabled):hover, body.modern-flat .picker-vtab:not(.active):not(:disabled):hover, body.modern-flat   .legacy-settings-tabs   button:not(.active):not(:disabled):hover|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:44|body.modern-flat .btn-primary:not(:disabled):hover, body.modern-flat .nav-tab.active:not(:disabled):hover, body.modern-flat .item-tab.active:not(:disabled):hover, body.modern-flat .picker-vtab.active:not(:disabled):hover, body.modern-flat .legacy-settings-tabs button.active:not(:disabled):hover, body.modern-flat .ans-btn.selected:not(:disabled):hover, body.modern-flat #welcomeModal .welcome-modal-btn:not(:disabled):hover|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:56|body.modern-flat .btn-success:not(:disabled):hover|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:62|body.modern-flat .btn-warning:not(:disabled):hover|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:68|body.modern-flat .btn-danger:not(:disabled):hover|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:74|body.modern-flat #btnForceEnd:not(.locked-disabled):hover|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:80|body.modern-flat button:focus-visible, body.modern-flat input:focus-visible, body.modern-flat textarea:focus-visible, body.modern-flat select:focus-visible|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:87|body.modern-flat button:disabled, body.modern-flat .btn:disabled, body.modern-flat .locked-disabled, body.modern-flat .round-disabled|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:97|/* 欢迎弹窗与普通工作窗口共用扁平表面。 */ body.modern-flat .welcome-modal-card|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:105|body.modern-flat .welcome-modal-title|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:109|body.modern-flat .welcome-modal-sub, body.modern-flat .welcome-modal-hint|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:113|body.modern-flat .wmp-item|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:117|body.modern-flat .welcome-modal-btn|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:121|/* 关于窗口：程序信息、指南与百科使用完全相同的标题和内容骨架。 */ body.modern-flat .about-window|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:129|body.modern-flat .about-side|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:133|body.modern-flat .about-side button|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:139|body.modern-flat .about-side button:hover|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:143|body.modern-flat .about-side button.active|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:148|body.modern-flat .about-main|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:156|body.modern-flat .about-heading, body.modern-flat .item-reference-head|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:164|body.modern-flat .about-heading h2, body.modern-flat .item-reference-head h2|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:170|body.modern-flat .about-main .guide-block|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:179|/* 小组控制台只有正文滚动；标题与左侧标签始终稳定。 */ body.modern-flat .item-window|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:192|body.modern-flat .item-side|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:196|body.modern-flat .item-main|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:208|body.modern-flat .item-main-head|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:217|body.modern-flat #itemWindowBody|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:231|body.modern-flat .group-detail-form|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:234|/* 设置页：标签固定，当前面板独立滚动。 */ body.modern-flat:has(#view-settings.active)|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:242|body.modern-flat #view-settings.active|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:249|body.modern-flat #view-settings .settings-scroll|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:257|/* 设置组件的文字、分组和表单样式统一归 ui/desktop.css。 */  /* 道具管理固定为宽卡；禁止图标和按钮把中文说明压成单字列。 */ body.modern-flat #settingsV26_items .item-ency-grid|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:267|body.modern-flat #settingsV26_items .item-encyclopedia-card|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:281|body.modern-flat #settingsV26_items .item-encyclopedia-info|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:285|body.modern-flat #settingsV26_items .item-encyclopedia-name, body.modern-flat #settingsV26_items .item-encyclopedia-desc|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:292|body.modern-flat #settingsV26_items .item-encyclopedia-name|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:295|body.modern-flat #settingsV26_items .item-encyclopedia-desc|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:298|body.modern-flat #settingsV26_items .item-encyclopedia-actions|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:307|/* 自定义按钮图标：宽屏多列，中屏双列，窄屏单列。 */ body.modern-flat #view-settings .icon-custom-grid|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:315|body.modern-flat #view-settings .icon-custom-card|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:323|body.modern-flat #view-settings .icon-custom-card > div:nth-child(2)|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:326|/* 手动举手的小组选择器复用“预选小组”的紧凑胶囊语言。 */ body.modern-flat #handGroupGrid.hand-grid|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:334|body.modern-flat #handGroupGrid .hand-group|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:352|body.modern-flat #handGroupGrid .hand-group small|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:357|body.modern-flat #handGroupGrid .hand-group:not(.selected):hover|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:362|body.modern-flat #handGroupGrid .hand-group.selected|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:367|body.modern-flat #handGroupGrid .hand-group.selected small|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:371|/* 档案页承接原点名窗口中的课堂累计统计。 */ body.modern-flat .archive-class-stats|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:376|body.modern-flat .archive-stats-head|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:383|body.modern-flat .archive-stats-head h3|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:389|body.modern-flat .archive-stats-head span|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:394|body.modern-flat .archive-stats-grid|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:399|body.modern-flat .archive-stat-card|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:406|body.modern-flat .archive-stat-card b|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:414|body.modern-flat .archive-stat-card b small|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:420|body.modern-flat .archive-stat-card span|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:429|body.modern-flat #view-settings .icon-custom-grid|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:434|body.modern-flat .welcome-modal-card|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:439|body.modern-flat .about-window,   body.modern-flat .item-window|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:445|body.modern-flat .about-side,   body.modern-flat .item-side|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:455|body.modern-flat .about-side button,   body.modern-flat .item-side button|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:462|body.modern-flat .item-side-title|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:465|body.modern-flat .item-main|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:468|body.modern-flat #itemWindowBody|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:472|body.modern-flat .about-main|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:476|body.modern-flat #view-settings .icon-custom-grid|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:479|body.modern-flat #settingsV26_items .item-encyclopedia-card|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:484|body.modern-flat #settingsV26_items .item-encyclopedia-actions|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:489|body.modern-flat #settingsV26_data .setting-item|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:493|body.modern-flat #settingsV26_data .setting-item > div|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:496|body.modern-flat .archive-stats-grid|需要进一步测试|
|src/styles/ui/flat-controls-and-scrolling.css:500|body.modern-flat #btnFinalSettlement:not(:disabled):hover|需要进一步测试|
|src/styles/ui/interface-copy.css:1|.copy-kicker|需要进一步测试|
|src/styles/ui/readability-and-effect-layers.css:1|/* ===== V2.16.1：可读性、详情滚动与道具特效层级修复 ===== */  /* 1. 欢迎页“班级总态势”原先继承深色欢迎页的白字，在浅色卡片上几乎不可见。 */ body.modern-flat .welcome-summary-grid .w-stat-num|需要进一步测试|
|src/styles/ui/readability-and-effect-layers.css:8|body.modern-flat .welcome-summary-grid .w-stat-label|需要进一步测试|
|src/styles/ui/readability-and-effect-layers.css:12|/* 2. 小组卡片排名：统一字体、取消奇怪的字距和空格，做成紧凑的辅助信息标签。 */ body.modern-flat .rank-badge|需要进一步测试|
|src/styles/ui/readability-and-effect-layers.css:37|/* 3. 小组详情窗口的危险操作此前能滚到“半截”，但底部内容没有足够的滚动余量。 */ body.modern-flat .item-modal-backdrop|需要进一步测试|
|src/styles/ui/readability-and-effect-layers.css:42|body.modern-flat .item-window|需要进一步测试|
|src/styles/ui/readability-and-effect-layers.css:46|body.modern-flat #itemWindowBody|需要进一步测试|
|src/styles/ui/readability-and-effect-layers.css:50|body.modern-flat .group-detail-form|需要进一步测试|
|src/styles/ui/readability-and-effect-layers.css:52|body.modern-flat .group-detail-danger|需要进一步测试|
|src/styles/ui/readability-and-effect-layers.css:57|body.modern-flat .group-detail-danger .btn-danger|需要进一步测试|
|src/styles/ui/readability-and-effect-layers.css:60|/* 4. 道具演出必须浮在普通卡片之上。之前 FX 卡片被 overflow:hidden + 普通 stacking context 一起裁掉。 */ body.modern-flat .group-list|需要进一步测试|
|src/styles/ui/readability-and-effect-layers.css:66|body.modern-flat .group-row-card|需要进一步测试|
|src/styles/ui/readability-and-effect-layers.css:69|body.modern-flat .group-row-card.card-use-fx, body.modern-flat .group-row-card.card-hit-fx, body.modern-flat .group-row-card.card-defend-fx, body.modern-flat .group-row-card.card-heal-fx|需要进一步测试|
|src/styles/ui/readability-and-effect-layers.css:77|body.modern-flat .group-row-card.card-use-fx .card-fx-badge|需要进一步测试|
|src/styles/ui/readability-and-effect-layers.css:81|body.modern-flat .group-row-card.card-use-fx::before, body.modern-flat .group-row-card.card-use-fx::after, body.modern-flat .group-row-card.card-hit-fx::before, body.modern-flat .group-row-card.card-hit-fx::after, body.modern-flat .group-row-card.card-defend-fx::before, body.modern-flat .group-row-card.card-defend-fx::after, body.modern-flat .group-row-card.card-heal-fx::before, body.modern-flat .group-row-card.card-heal-fx::after|需要进一步测试|
|src/styles/ui/readability-and-effect-layers.css:92|body.modern-flat .attack-hit-badge|需要进一步测试|
|src/styles/ui/readability-and-effect-layers.css:96|/* 顶部使用提示也始终高于比赛界面，但低于真正的弹窗。 */ body.modern-flat .item-use-banner|需要进一步测试|
|src/styles/ui/readability-and-effect-layers.css:101|/* 持续状态光环不得被卡片自身裁掉。 */ body.modern-flat .persistent-aura|需要进一步测试|
|src/styles/ui/readability-and-effect-layers.css:110|body.modern-flat .item-window|需要进一步测试|
|src/styles/ui/readability-and-effect-layers.css:113|body.modern-flat #itemWindowBody|需要进一步测试|
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
|src/ui/application-surfaces.css:113|#groupList .row-score.row-score-light|需要进一步测试|
|src/ui/application-surfaces.css:124|#groupList .member-count-tag|需要进一步测试|
|src/ui/application-surfaces.css:129|#groupList .item-slot|需要进一步测试|
|src/ui/application-surfaces.css:132|#groupList .more-btn|需要进一步测试|
|src/ui/application-surfaces.css:135|#groupList .opt-btn.active:not(.correct):not(.wrong)|需要进一步测试|
|src/ui/application-surfaces.css:139|#groupList .allin-toggle-btn.active|需要进一步测试|
|src/ui/application-surfaces.css:143|/* Optional roster avatars occupy the original number badge footprint. */ body.modern-flat .battle-card .battle-group-number.battle-number-avatar|需要进一步测试|
|src/ui/application-surfaces.css:160|.battle-group-avatar-stack|需要进一步测试|
|src/ui/application-surfaces.css:173|.battle-group-avatar-stack img|需要进一步测试|
|src/ui/application-surfaces.css:180|.battle-group-avatar-stack.count-1 img|需要进一步测试|
|src/ui/application-surfaces.css:184|/* A teacher-chosen group avatar fills the same badge footprint as the stack.    The badge itself already switches to the flexible column layout through    .battle-number-avatar, so the image must match the stack box exactly. */ .battle-group-avatar-single, body.modern-flat .battle-card .battle-group-number .battle-group-avatar-single|需要进一步测试|
|src/ui/application-surfaces.css:201|/* ===== 小组头像设置（详情页最顶端） ===== */ .group-avatar-section .group-avatar-row|需要进一步测试|
|src/ui/application-surfaces.css:207|.group-avatar-preview|需要进一步测试|
|src/ui/application-surfaces.css:222|.group-avatar-preview img|需要进一步测试|
|src/ui/application-surfaces.css:227|.group-avatar-preview.empty|需要进一步测试|
|src/ui/application-surfaces.css:230|.group-avatar-copy|需要进一步测试|
|src/ui/application-surfaces.css:237|.group-avatar-copy b|需要进一步测试|
|src/ui/application-surfaces.css:241|.group-avatar-copy > span|需要进一步测试|
|src/ui/application-surfaces.css:246|.group-avatar-actions|需要进一步测试|
|src/ui/application-surfaces.css:252|.group-avatar-upload|需要进一步测试|
|src/ui/application-surfaces.css:255|.group-avatar-copy p|需要进一步测试|
|src/ui/application-surfaces.css:259|.group-avatar-copy p[data-status="ERROR"]|需要进一步测试|
|src/ui/application-surfaces.css:262|.group-avatar-copy p[data-status="OK"]|需要进一步测试|
|src/ui/application-surfaces.css:265|.battle-group-number-below-avatar|需要进一步测试|
|src/ui/application-surfaces.css:273|.picker-avatar-reel-content|需要进一步测试|
|src/ui/application-surfaces.css:280|.picker-avatar-reel-content img|需要进一步测试|
|src/ui/application-surfaces.css:289|.picker-avatar-reel-content > span|需要进一步测试|
|src/ui/application-surfaces.css:296|.battle-group-avatar-stack img|需要进一步测试|
|src/ui/application-surfaces.css:300|from|需要进一步测试|
|src/ui/application-surfaces.css:304|to|需要进一步测试|
|src/ui/application-surfaces.css:310|/* The same palette, with content-specific structures retained for each window. */ .ui-function-surface, .item-draw-board, .program-confirm-window|需要进一步测试|
|src/ui/application-surfaces.css:322|.ui-function-surface   :is(     input:not([type="checkbox"]):not([type="range"]):not([type="color"]),     textarea,     select   )|需要进一步测试|
|src/ui/application-surfaces.css:332|.ui-function-surface input::placeholder, .ui-function-surface textarea::placeholder|需要进一步测试|
|src/ui/application-surfaces.css:337|.ui-function-surface .modal-actions|需要进一步测试|
|src/ui/application-surfaces.css:341|.ui-function-surface   :is(h2, h3, .score-modal-title, .member-search-title, .theme-dialog-title)|需要进一步测试|
|src/ui/application-surfaces.css:345|.ui-function-surface > :is(h3, .score-modal-title, .member-search-title)|需要进一步测试|
|src/ui/application-surfaces.css:349|.ui-function-surface :is(.item-main-head, .classroom-head, .quick-person-head)|需要进一步测试|
|src/ui/application-surfaces.css:353|.ui-function-surface :is(.classroom-head, .quick-person-head) .btn|需要进一步测试|
|src/ui/application-surfaces.css:357|.ui-function-surface :is(.item-side-title, .about-side-title)|需要进一步测试|
|src/ui/application-surfaces.css:361|.ui-function-surface :is(.item-tab, .about-side button)|需要进一步测试|
|src/ui/application-surfaces.css:366|.ui-function-surface .picker-left|需要进一步测试|
|src/ui/application-surfaces.css:369|.ui-function-surface .picker-right|需要进一步测试|
|src/ui/application-surfaces.css:372|.ui-function-surface .picker-center|需要进一步测试|
|src/ui/application-surfaces.css:375|.ui-function-surface .slot-reel-frame|需要进一步测试|
|src/ui/application-surfaces.css:380|.ui-function-surface .queue-item-card|需要进一步测试|
|src/ui/application-surfaces.css:383|.ui-function-surface .queue-role-badge|需要进一步测试|
|src/ui/application-surfaces.css:386|.ui-function-surface .theme-dialog-icon|需要进一步测试|
|src/ui/application-surfaces.css:390|.theme-dialog-card, .quick-person-card, .grand-card|需要进一步测试|
|src/ui/application-surfaces.css:397|.theme-dialog, .quick-person-backdrop|需要进一步测试|
|src/ui/application-surfaces.css:401|/* Collection pages share the welcome hero, not a generic white fullview box. */ body[data-current-view="history"], body[data-current-view="archives"]|需要进一步测试|
|src/ui/application-surfaces.css:408|#view-history, #view-archives|需要进一步测试|
|src/ui/application-surfaces.css:416|.ui-collection-header|需要进一步测试|
|src/ui/application-surfaces.css:432|.ui-collection-header h2|需要进一步测试|
|src/ui/application-surfaces.css:437|.ui-collection-header h2 small|需要进一步测试|
|src/ui/application-surfaces.css:443|.ui-collection-header .ui-collection-sub, .ui-collection-header .ui-record-count|需要进一步测试|
|src/ui/application-surfaces.css:450|.ui-collection-body|需要进一步测试|
|src/ui/application-surfaces.css:458|#view-history .ui-timeline|需要进一步测试|
|src/ui/application-surfaces.css:464|.ui-history|需要进一步测试|
|src/ui/application-surfaces.css:468|.ui-history::before|需要进一步测试|
|src/ui/application-surfaces.css:471|.ui-history summary > div|需要进一步测试|
|src/ui/application-surfaces.css:474|.ui-history summary > .ui-chip|需要进一步测试|
|src/ui/application-surfaces.css:477|.ui-history::after|需要进一步测试|
|src/ui/application-surfaces.css:486|.ui-history details[open]|需要进一步测试|
|src/ui/application-surfaces.css:489|.ui-archive-card|需要进一步测试|
|src/ui/application-surfaces.css:493|.ui-archive-summary > div|需要进一步测试|
|src/ui/application-surfaces.css:497|.ui-archive-emblem|需要进一步测试|
|src/ui/application-surfaces.css:507|.ui-archive-emblem .ui-icon|需要进一步测试|
|src/ui/application-surfaces.css:511|#view-archives .ui-overview .ui-panel|需要进一步测试|
|src/ui/application-surfaces.css:516|#view-archives .ui-overview strong|需要进一步测试|
|src/ui/application-surfaces.css:520|.ui-podium > div:first-child|需要进一步测试|
|src/ui/application-surfaces.css:525|.ui-podium > div:nth-child(2)|需要进一步测试|
|src/ui/application-surfaces.css:529|.ui-podium > div:nth-child(3)|需要进一步测试|
|src/ui/application-surfaces.css:533|.ui-collection-body .ui-empty|需要进一步测试|
|src/ui/application-surfaces.css:537|body.modern-flat|需要进一步测试|
|src/ui/application-surfaces.css:541|.ui-function-surface .classroom-head|需要进一步测试|
|src/ui/application-surfaces.css:544|.ui-function-surface .quick-person-head b, .ui-function-surface .item-main-head h3|需要进一步测试|
|src/ui/application-surfaces.css:548|.ui-function-surface :is(.about-heading, .item-reference-head)|需要进一步测试|
|src/ui/application-surfaces.css:555|/* Archive discovery and empty-state actions use the same content rhythm as home. */ .ui-archive-filter|需要进一步测试|
|src/ui/application-surfaces.css:569|.ui-archive-search|需要进一步测试|
|src/ui/application-surfaces.css:580|.ui-archive-search:focus-within|需要进一步测试|
|src/ui/application-surfaces.css:584|.ui-archive-search input|需要进一步测试|
|src/ui/application-surfaces.css:596|.ui-archive-search input::placeholder|需要进一步测试|
|src/ui/application-surfaces.css:599|.ui-archive-sort|需要进一步测试|
|src/ui/application-surfaces.css:604|.ui-archive-sort label|需要进一步测试|
|src/ui/application-surfaces.css:610|.ui-archive-sort select|需要进一步测试|
|src/ui/application-surfaces.css:622|.ui-archive-filter .ui-record-count|需要进一步测试|
|src/ui/application-surfaces.css:629|#view-archives .ui-empty|需要进一步测试|
|src/ui/application-surfaces.css:632|#view-archives .ui-empty h3|需要进一步测试|
|src/ui/application-surfaces.css:635|#view-archives .ui-empty p|需要进一步测试|
|src/ui/application-surfaces.css:640|#view-archives .ui-empty .btn|需要进一步测试|
|src/ui/application-surfaces.css:645|/* One motion owner per window; shared WAAPI lifecycle replaces old root entrances. */ .ui-function-surface|需要进一步测试|
|src/ui/application-surfaces.css:650|.ui-function-surface button[hidden]|需要进一步测试|
|src/ui/application-surfaces.css:653|.ui-function-surface .ui-window-close|需要进一步测试|
|src/ui/application-surfaces.css:673|.ui-function-surface .ui-window-close:hover|需要进一步测试|
|src/ui/application-surfaces.css:677|.ui-function-surface > :is(h3, .score-modal-title, .member-search-title), .ui-function-surface .theme-dialog-head, .ui-function-surface .quick-person-head, .ui-function-surface .classroom-head, .ui-function-surface .about-heading, .ui-function-surface .item-reference-head|需要进一步测试|
|src/ui/application-surfaces.css:685|.ui-function-surface .picker-right > b|需要进一步测试|
|src/ui/application-surfaces.css:689|.ui-slot-stage|需要进一步测试|
|src/ui/application-surfaces.css:696|.ui-slot-cabinet|需要进一步测试|
|src/ui/application-surfaces.css:701|.ui-slot-stage .slot-machine-case|需要进一步测试|
|src/ui/application-surfaces.css:713|.ui-slot-stage .slot-reel-frame|需要进一步测试|
|src/ui/application-surfaces.css:720|.ui-slot-stage .slot-reel-text|需要进一步测试|
|src/ui/application-surfaces.css:732|.ui-slot-stage #btnSlotTrigger|需要进一步测试|
|src/ui/application-surfaces.css:752|.ui-slot-stage #btnSlotTrigger::before|需要进一步测试|
|src/ui/application-surfaces.css:764|.ui-slot-stage #btnSlotTrigger::after|需要进一步测试|
|src/ui/application-surfaces.css:777|.ui-slot-stage #btnSlotTrigger.stop::before, .ui-slot-stage #btnSlotTrigger:active::before|需要进一步测试|
|src/ui/application-surfaces.css:781|.ui-slot-stage #btnSlotTrigger.stop::after, .ui-slot-stage #btnSlotTrigger:active::after|需要进一步测试|
|src/ui/application-surfaces.css:785|.ui-slot-stage #btnSlotTrigger:disabled|需要进一步测试|
|src/ui/application-surfaces.css:789|.ui-slot-hint|需要进一步测试|
|src/ui/application-surfaces.css:796|.ui-slot-deceleration|需要进一步测试|
|src/ui/application-surfaces.css:802|.ui-slot-deceleration > span|需要进一步测试|
|src/ui/application-surfaces.css:814|#pickerModal[data-picker-reveal="pending"] .slot-result-panel, #pickerModal[data-picker-reveal="pending"] .picker-target, #pickerModal[data-picker-reveal="pending"] #pickerInfoBox|需要进一步测试|
|src/ui/application-surfaces.css:819|/* Bound the cabinet and all three scroll panes to the scaled desktop viewport. */ #pickerModal .picker-layout|需要进一步测试|
|src/ui/application-surfaces.css:826|#pickerModal :is(.picker-left, .picker-center, .picker-right)|需要进一步测试|
|src/ui/application-surfaces.css:832|#pickerModal .picker-center|需要进一步测试|
|src/ui/application-surfaces.css:835|#pickerModal .ui-slot-stage|需要进一步测试|
|src/ui/application-surfaces.css:838|/* Incomplete-answer warning is an active legacy dialog, now on the same lifecycle. */ .program-confirm-window|需要进一步测试|
|src/ui/application-surfaces.css:849|.program-confirm-window .program-confirm-titlebar|需要进一步测试|
|src/ui/application-surfaces.css:855|.program-confirm-titlebar::before|需要进一步测试|
|src/ui/application-surfaces.css:864|.program-confirm-window .program-confirm-body|需要进一步测试|
|src/ui/application-surfaces.css:869|.program-confirm-window .program-confirm-icon|需要进一步测试|
|src/ui/application-surfaces.css:874|.program-confirm-window .program-confirm-text|需要进一步测试|
|src/ui/application-surfaces.css:881|.program-confirm-window .program-confirm-actions|需要进一步测试|
|src/ui/application-surfaces.css:886|.theme-dialog-card .theme-dialog-head|需要进一步测试|
|src/ui/application-surfaces.css:890|.theme-dialog-card .theme-dialog-title|需要进一步测试|
|src/ui/application-surfaces.css:894|.theme-dialog-card .theme-dialog-body|需要进一步测试|
|src/ui/application-surfaces.css:898|.theme-dialog-card .theme-dialog-actions|需要进一步测试|
|src/ui/application-surfaces.css:904|#themeDialogV21727[data-ui-notice="danger"] .theme-dialog-icon|需要进一步测试|
|src/ui/application-surfaces.css:908|.ui-dock-menu[open] .ui-dock-menu-body|需要进一步测试|
|src/ui/application-surfaces.css:914|from|需要进一步测试|
|src/ui/application-surfaces.css:918|to|需要进一步测试|
|src/ui/application-surfaces.css:923|body[data-motion="off"]|需要进一步测试|
|src/ui/application-surfaces.css:928|body[data-system-motion="true"]|需要进一步测试|
|src/ui/battle-motion.css:1|/* Effects live inside the existing card footprint; no card transform or reflow. */ .bm-layer|需要进一步测试|
|src/ui/battle-motion.css:14|/* A shockwave ring that escapes the card, and shards thrown outward. */ .bm-wave|需要进一步测试|
|src/ui/battle-motion.css:29|0%|需要进一步测试|
|src/ui/battle-motion.css:33|25%|重复实现（仅语法；层叠需进一步测试）|
|src/ui/battle-motion.css:36|100%|需要进一步测试|
|src/ui/battle-motion.css:41|.bm-shards|需要进一步测试|
|src/ui/battle-motion.css:46|.bm-shards u|需要进一步测试|
|src/ui/battle-motion.css:60|0%|需要进一步测试|
|src/ui/battle-motion.css:64|30%|需要进一步测试|
|src/ui/battle-motion.css:67|100%|需要进一步测试|
|src/ui/battle-motion.css:72|.bm-layer::before|需要进一步测试|
|src/ui/battle-motion.css:87|.bm-layer[data-family="ice"]::before|需要进一步测试|
|src/ui/battle-motion.css:98|0%|需要进一步测试|
|src/ui/battle-motion.css:103|40%|需要进一步测试|
|src/ui/battle-motion.css:107|100%|需要进一步测试|
|src/ui/battle-motion.css:112|.bm-layer[data-family="lightning"]::before|需要进一步测试|
|src/ui/battle-motion.css:119|0%,   30%,   62%|需要进一步测试|
|src/ui/battle-motion.css:124|15%,   45%,   80%|需要进一步测试|
|src/ui/battle-motion.css:129|100%|重复实现（仅语法；层叠需进一步测试）|
|src/ui/battle-motion.css:133|.bm-badge|需要进一步测试|
|src/ui/battle-motion.css:147|.bm-badge span|需要进一步测试|
|src/ui/battle-motion.css:153|.bm-badge img|需要进一步测试|
|src/ui/battle-motion.css:158|.bm-badge b|需要进一步测试|
|src/ui/battle-motion.css:164|from|需要进一步测试|
|src/ui/battle-motion.css:167|to|需要进一步测试|
|src/ui/battle-motion.css:171|.cf-sound-category|需要进一步测试|
|src/ui/battle-motion.css:178|.cf-sound-category > summary|需要进一步测试|
|src/ui/battle-motion.css:184|body[data-motion="off"] .persistent-aura, body[data-motion="simple"] .persistent-aura|需要进一步测试|
|src/ui/battle-motion.css:189|body[data-system-motion="true"] .persistent-aura|需要进一步测试|
|src/ui/battle-motion.css:193|#groupList .card-header-row, #groupList .card-action-row|需要进一步测试|
|src/ui/battle-motion.css:198|/* Distinct silhouettes retain each item's identity without moving the card. */ .bm-layer[data-family="shell"]::before|需要进一步测试|
|src/ui/battle-motion.css:207|.bm-layer[data-family="fire"]::before|需要进一步测试|
|src/ui/battle-motion.css:216|.bm-layer[data-family="bomb"]::before|需要进一步测试|
|src/ui/battle-motion.css:225|.bm-layer[data-family="horn"]::before|需要进一步测试|
|src/ui/battle-motion.css:234|.bm-layer[data-family="ink"]::before|需要进一步测试|
|src/ui/battle-motion.css:238|.bm-layer[data-family="ghost"]::before|需要进一步测试|
|src/ui/battle-motion.css:242|.bm-layer[data-family="boomerang"]::before|需要进一步测试|
|src/ui/battle-motion.css:251|.bm-layer[data-family="banana"]::before|需要进一步测试|
|src/ui/battle-motion.css:259|.bm-layer[data-family="hammer"]::before|需要进一步测试|
|src/ui/battle-motion.css:267|.bm-layer[data-family="bullet"]::before|需要进一步测试|
|src/ui/battle-motion.css:270|.bm-layer[data-family="buff"]::before|需要进一步测试|
|src/ui/battle-motion.css:279|/* 卡美克：法术闪光，两道交叉的紫色光线横扫卡片。 */ .bm-layer[data-family="kamek"]::before|需要进一步测试|
|src/ui/battle-motion.css:300|/* 道具箱：方形礼物抖动后弹出星星。 */ .bm-layer[data-family="box"]::before|需要进一步测试|
|src/ui/battle-motion.css:314|/* 问号方块：问号放大再炸开成光点。 */ .bm-layer[data-family="mystery"]::before|需要进一步测试|
|src/ui/battle-motion.css:325|0%|需要进一步测试|
|src/ui/battle-motion.css:329|35%|需要进一步测试|
|src/ui/battle-motion.css:333|100%|需要进一步测试|
|src/ui/battle-motion.css:339|0%|需要进一步测试|
|src/ui/battle-motion.css:343|30%|需要进一步测试|
|src/ui/battle-motion.css:347|55%|需要进一步测试|
|src/ui/battle-motion.css:350|100%|需要进一步测试|
|src/ui/battle-motion.css:356|0%|需要进一步测试|
|src/ui/battle-motion.css:360|45%|需要进一步测试|
|src/ui/battle-motion.css:364|70%|需要进一步测试|
|src/ui/battle-motion.css:368|100%|需要进一步测试|
|src/ui/battle-motion.css:374|from|需要进一步测试|
|src/ui/battle-motion.css:378|40%|需要进一步测试|
|src/ui/battle-motion.css:381|to|需要进一步测试|
|src/ui/battle-motion.css:387|from|需要进一步测试|
|src/ui/battle-motion.css:391|35%|需要进一步测试|
|src/ui/battle-motion.css:394|to|需要进一步测试|
|src/ui/battle-motion.css:400|from|需要进一步测试|
|src/ui/battle-motion.css:404|45%|需要进一步测试|
|src/ui/battle-motion.css:407|to|需要进一步测试|
|src/ui/battle-motion.css:413|from|需要进一步测试|
|src/ui/battle-motion.css:416|to|需要进一步测试|
|src/ui/battle-motion.css:421|from|需要进一步测试|
|src/ui/battle-motion.css:425|45%|重复实现（仅语法；层叠需进一步测试）|
|src/ui/battle-motion.css:428|to|需要进一步测试|
|src/ui/battle-motion.css:433|body[data-motion="simple"] .bm-layer::before|需要进一步测试|
|src/ui/classroom-feedback.css:1|/* Shared score controls retain the footprint of each existing window. */ .cf-score-slots|需要进一步测试|
|src/ui/classroom-feedback.css:13|.cf-score-slots .btn|需要进一步测试|
|src/ui/classroom-feedback.css:20|.cf-slot-editor|需要进一步测试|
|src/ui/classroom-feedback.css:25|.cf-slot-editor label|需要进一步测试|
|src/ui/classroom-feedback.css:32|.cf-slot-editor input|需要进一步测试|
|src/ui/classroom-feedback.css:39|.cf-slot-editor input[aria-invalid="true"]|需要进一步测试|
|src/ui/classroom-feedback.css:43|.cf-settings|需要进一步测试|
|src/ui/classroom-feedback.css:47|.item-score-panel > .cf-score-slots|需要进一步测试|
|src/ui/classroom-feedback.css:50|.hand-rewards > .cf-score-slots|需要进一步测试|
|src/ui/classroom-feedback.css:53|.quick-person-score-actions > .cf-score-slots|需要进一步测试|
|src/ui/classroom-feedback.css:56|#classroomShowcase|需要进一步测试|
|src/ui/classroom-feedback.css:70|#classroomShowcase::backdrop|需要进一步测试|
|src/ui/classroom-feedback.css:74|#classroomShowcase .cf-show-surface|需要进一步测试|
|src/ui/classroom-feedback.css:86|#classroomShowcase[data-kind="negative"] .cf-show-surface|需要进一步测试|
|src/ui/classroom-feedback.css:90|#classroomShowcase[data-kind="pick"] .cf-show-surface|需要进一步测试|
|src/ui/classroom-feedback.css:94|.cf-show-copy|需要进一步测试|
|src/ui/classroom-feedback.css:105|.cf-show-avatar-stack|需要进一步测试|
|src/ui/classroom-feedback.css:121|.cf-show-avatar-stack[hidden]|需要进一步测试|
|src/ui/classroom-feedback.css:124|.cf-show-avatar-stack img|需要进一步测试|
|src/ui/classroom-feedback.css:132|.cf-show-avatar-stack:has(img:only-child) img|需要进一步测试|
|src/ui/classroom-feedback.css:138|from|需要进一步测试|
|src/ui/classroom-feedback.css:142|to|需要进一步测试|
|src/ui/classroom-feedback.css:147|#classroomShowcase .cf-show-title|需要进一步测试|
|src/ui/classroom-feedback.css:157|.cf-show-eyebrow|需要进一步测试|
|src/ui/classroom-feedback.css:164|.cf-show-subtitle|需要进一步测试|
|src/ui/classroom-feedback.css:169|.cf-show-value|需要进一步测试|
|src/ui/classroom-feedback.css:177|#classroomShowcase > .ui-cinematic-skip|需要进一步测试|
|src/ui/classroom-feedback.css:183|.cf-show-orbit|需要进一步测试|
|src/ui/classroom-feedback.css:195|.cf-show-orbit::before, .cf-show-orbit::after|需要进一步测试|
|src/ui/classroom-feedback.css:203|.cf-show-orbit::after|需要进一步测试|
|src/ui/classroom-feedback.css:208|.cf-show-particles|需要进一步测试|
|src/ui/classroom-feedback.css:213|.cf-show-particles i|需要进一步测试|
|src/ui/classroom-feedback.css:222|#classroomShowcase[data-effect-style="burst"] .cf-show-particles i|需要进一步测试|
|src/ui/classroom-feedback.css:227|#classroomShowcase[data-effect-style="burst"] .cf-show-orbit|需要进一步测试|
|src/ui/classroom-feedback.css:231|.cf-show-copy|需要进一步测试|
|src/ui/classroom-feedback.css:234|#classroomShowcase.cf-simple .cf-show-orbit|需要进一步测试|
|src/ui/classroom-feedback.css:237|#classroomShowcase.cf-simple .cf-show-copy|需要进一步测试|
|src/ui/classroom-feedback.css:241|from|需要进一步测试|
|src/ui/classroom-feedback.css:245|to|需要进一步测试|
|src/ui/classroom-feedback.css:251|0%|需要进一步测试|
|src/ui/classroom-feedback.css:255|12%|重复实现（仅语法；层叠需进一步测试）|
|src/ui/classroom-feedback.css:258|100%|需要进一步测试|
|src/ui/classroom-feedback.css:264|from|需要进一步测试|
|src/ui/classroom-feedback.css:268|to|重复实现（仅语法；层叠需进一步测试）|
|src/ui/classroom-feedback.css:274|body[data-system-motion="true"] #classroomShowcase *|需要进一步测试|
|src/ui/classroom-feedback.css:278|/* Candidate audio controls stay secondary to the operation's main settings. */ .cf-audio-choices|需要进一步测试|
|src/ui/classroom-feedback.css:288|.cf-audio-choices details|需要进一步测试|
|src/ui/classroom-feedback.css:291|.cf-audio-choice|需要进一步测试|
|src/ui/classroom-feedback.css:298|.cf-audio-choice > span|需要进一步测试|
|src/ui/classroom-feedback.css:302|.sound-row:has(> .cf-audio-choices)|需要进一步测试|
|src/ui/component-library.css:1|/* Maintenance-only component reference. Reuses the application tokens. */ .component-library-overlay|需要进一步测试|
|src/ui/component-library.css:10|.component-library-overlay.active|需要进一步测试|
|src/ui/component-library.css:13|.component-library-surface|需要进一步测试|
|src/ui/component-library.css:26|.component-library-header|需要进一步测试|
|src/ui/component-library.css:30|.component-library-header h2|需要进一步测试|
|src/ui/component-library.css:34|.component-library-header p|需要进一步测试|
|src/ui/component-library.css:39|.component-library-toolbar|需要进一步测试|
|src/ui/component-library.css:46|.component-library-toolbar input|需要进一步测试|
|src/ui/component-library.css:50|.component-library-toolbar :is(input, select)|需要进一步测试|
|src/ui/component-library.css:57|.component-library-toolbar label|需要进一步测试|
|src/ui/component-library.css:64|.component-library-content|需要进一步测试|
|src/ui/component-library.css:70|.component-library-list|需要进一步测试|
|src/ui/component-library.css:76|.component-library-list button|需要进一步测试|
|src/ui/component-library.css:87|.component-library-list button[aria-current="true"]|需要进一步测试|
|src/ui/component-library.css:92|.component-library-list button:hover|需要进一步测试|
|src/ui/component-library.css:95|.component-library-list small|需要进一步测试|
|src/ui/component-library.css:102|.component-library-detail|需要进一步测试|
|src/ui/component-library.css:107|.component-library-detail h3|需要进一步测试|
|src/ui/component-library.css:111|.component-library-source|需要进一步测试|
|src/ui/component-library.css:117|.component-library-preview|需要进一步测试|
|src/ui/component-library.css:127|.component-library-note|需要进一步测试|
|src/ui/component-library.css:136|.component-library-tokens|需要进一步测试|
|src/ui/component-library.css:141|.component-library-token|需要进一步测试|
|src/ui/component-library.css:147|.component-library-token code|需要进一步测试|
|src/ui/component-library.css:152|.component-library-swatch|需要进一步测试|
|src/ui/component-library.css:161|.component-library-detail :is(button, input, select):focus-visible, .component-library-toolbar :is(input, select):focus-visible, .component-library-list button:focus-visible|需要进一步测试|
|src/ui/component-library.css:167|.component-library-count|需要进一步测试|
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
|src/ui/desktop.css:537|/* Boolean controls share v292's track/knob geometry; selection checkboxes outside    settings remain checkboxes. Native inputs preserve labels, keyboard and handlers. */ :is(#view-settings, .ui-settings-row)   input[type="checkbox"]:not(.ui-toggle input), #chkAntiRepeat|需要进一步测试|
|src/ui/desktop.css:560|:is(#view-settings, .ui-settings-row)   input[type="checkbox"]:not(.ui-toggle input)::after, #chkAntiRepeat::after|需要进一步测试|
|src/ui/desktop.css:575|:is(#view-settings, .ui-settings-row)   input[type="checkbox"]:not(.ui-toggle input):checked, #chkAntiRepeat:checked|需要进一步测试|
|src/ui/desktop.css:581|:is(#view-settings, .ui-settings-row)   input[type="checkbox"]:not(.ui-toggle input):checked::after, #chkAntiRepeat:checked::after|需要进一步测试|
|src/ui/desktop.css:586|:is(#view-settings, .ui-settings-row)   input[type="checkbox"]:not(.ui-toggle input):disabled, #chkAntiRepeat:disabled|需要进一步测试|
|src/ui/desktop.css:593|:is(#view-settings, .ui-settings-row) input[type="checkbox"],   :is(#view-settings, .ui-settings-row) input[type="checkbox"]::after,   #chkAntiRepeat,   #chkAntiRepeat::after|需要进一步测试|
|src/ui/desktop.css:600|.ui-settings-row select|需要进一步测试|
|src/ui/desktop.css:603|.ui-settings-category .setting-item, .ui-settings-category .setting-row|需要进一步测试|
|src/ui/desktop.css:608|#view-settings|需要进一步测试|
|src/ui/desktop.css:611|.ui-settings-header|需要进一步测试|
|src/ui/desktop.css:628|.ui-settings-eyebrow|需要进一步测试|
|src/ui/desktop.css:636|.ui-settings-header h2|需要进一步测试|
|src/ui/desktop.css:642|.ui-settings-header h2 small|需要进一步测试|
|src/ui/desktop.css:648|.ui-settings-header p|需要进一步测试|
|src/ui/desktop.css:653|.ui-settings-status|需要进一步测试|
|src/ui/desktop.css:664|.ui-settings-status span:first-child|需要进一步测试|
|src/ui/desktop.css:668|.ui-settings-group, .ui-settings-disclosure|需要进一步测试|
|src/ui/desktop.css:676|.ui-settings-group|需要进一步测试|
|src/ui/desktop.css:679|.ui-settings-group h4|需要进一步测试|
|src/ui/desktop.css:684|.ui-settings-group > .ui-muted|需要进一步测试|
|src/ui/desktop.css:689|.ui-settings-disclosure > summary|需要进一步测试|
|src/ui/desktop.css:698|.ui-settings-disclosure > summary::-webkit-details-marker|需要进一步测试|
|src/ui/desktop.css:701|.ui-settings-disclosure > summary b|需要进一步测试|
|src/ui/desktop.css:706|.ui-settings-disclosure > summary span|需要进一步测试|
|src/ui/desktop.css:712|.ui-settings-disclosure > summary::after|需要进一步测试|
|src/ui/desktop.css:723|.ui-settings-disclosure[open] > summary::after|需要进一步测试|
|src/ui/desktop.css:726|.ui-settings-disclosure > summary:hover|需要进一步测试|
|src/ui/desktop.css:729|.ui-settings-disclosure > summary:focus-visible|需要进一步测试|
|src/ui/desktop.css:733|.ui-settings-detail-body|需要进一步测试|
|src/ui/desktop.css:736|.ui-settings-detail-body > .ui-muted|需要进一步测试|
|src/ui/desktop.css:740|.ui-settings-category .setting-item, .ui-settings-category .sound-row|需要进一步测试|
|src/ui/desktop.css:747|.ui-settings-category .setting-label, .ui-settings-category .sound-name|需要进一步测试|
|src/ui/desktop.css:752|.ui-settings-category .sound-tag|需要进一步测试|
|src/ui/desktop.css:756|.ui-settings-category input[type="range"]|需要进一步测试|
|src/ui/desktop.css:759|.ui-settings-category .ui-danger-zone|需要进一步测试|
|src/ui/desktop.css:763|.ui-settings-category .ui-danger-zone > summary b|需要进一步测试|
|src/ui/desktop.css:766|.ui-settings-category .ui-snapshot-note|需要进一步测试|
|src/ui/desktop.css:771|#uiSettingsLock .setting-item > div, #uiSettingsBackup .setting-item > div|需要进一步测试|
|src/ui/desktop.css:778|#uiSettingsLock #newPwdInput|需要进一步测试|
|src/ui/desktop.css:784|#uiSettingsRules > div|需要进一步测试|
|src/ui/desktop.css:790|/* Classroom behaviour uses one card and one switch component. */ #uiSettingsRules #settingsV26_function|需要进一步测试|
|src/ui/desktop.css:794|#uiSettingsRules > div|需要进一步测试|
|src/ui/desktop.css:797|#uiSettingsRules .ui-rule-card|需要进一步测试|
|src/ui/desktop.css:807|.ui-rule-copy|需要进一步测试|
|src/ui/desktop.css:811|.ui-rule-title|需要进一步测试|
|src/ui/desktop.css:818|.ui-rule-copy .setting-note|需要进一步测试|
|src/ui/desktop.css:823|.ui-rule-card .ui-toggle|需要进一步测试|
|src/ui/desktop.css:826|.ui-toggle input:focus-visible + .ui-toggle-track|需要进一步测试|
|src/ui/desktop.css:830|/* Siblings of animated surfaces stay anchored to the viewport. */ .ui-cinematic-skip|需要进一步测试|
|src/ui/desktop.css:845|#settingsV26_sound,   #uiSettingsVolume > div,   #uiSettingsWallpaper > div,   #uiSettingsLayout > div|需要进一步测试|
|src/ui/desktop.css:854|#settingsV26_sound > .ui-settings-group,   #settingsV26_sound > details[open]|需要进一步测试|
|src/ui/desktop.css:858|#settingsV26_sound > .ui-settings-group,   #settingsV26_sound > .ui-settings-disclosure|需要进一步测试|
|src/ui/desktop.css:862|#uiSettingsLayout .ui-settings-row|需要进一步测试|
|src/ui/desktop.css:866|.ui-bank-editor|需要进一步测试|
|src/ui/desktop.css:875|.ui-danger-zone|需要进一步测试|
|src/ui/desktop.css:880|.ui-danger-zone .ui-muted|需要进一步测试|
|src/ui/desktop.css:883|.ui-dock-menu|需要进一步测试|
|src/ui/desktop.css:887|.ui-dock-menu summary|需要进一步测试|
|src/ui/desktop.css:897|.ui-dock-menu-body|需要进一步测试|
|src/ui/desktop.css:912|.ui-dock-menu:not([open]) .ui-dock-menu-body|需要进一步测试|
|src/ui/desktop.css:915|.ui-dock-menu-body .icon-btn|需要进一步测试|
|src/ui/desktop.css:923|.ui-toast|需要进一步测试|
|src/ui/desktop.css:933|.ui-toast::backdrop|需要进一步测试|
|src/ui/desktop.css:937|.ui-modal-close|需要进一步测试|
|src/ui/desktop.css:949|body[data-motion="off"] *, body[data-motion="off"] *::before, body[data-motion="off"] *::after|需要进一步测试|
|src/ui/desktop.css:957|body[data-motion="simple"] .persistent-aura, body[data-item-fx="off"] .persistent-aura|需要进一步测试|
|src/ui/desktop.css:961|body[data-item-fx="off"] .card-fx-layer, body[data-item-fx="off"] .item-use-banner|需要进一步测试|
|src/ui/desktop.css:966|body[data-system-motion="true"] *,   body[data-system-motion="true"] *::before,   body[data-system-motion="true"] *::after|需要进一步测试|
|src/ui/desktop.css:976|.ui-page|需要进一步测试|
|src/ui/desktop.css:979|.ui-daily-grid|需要进一步测试|
|src/ui/desktop.css:982|.ui-settings-shell|需要进一步测试|
|src/ui/desktop.css:985|.ui-welcome-head h1|需要进一步测试|
|src/ui/desktop.css:989|body.modern-flat[data-current-view]:not([data-current-view="battle"])|需要进一步测试|
|src/ui/desktop.css:993|.nav-tab|需要进一步测试|
|src/ui/desktop.css:1001|.ui-settings-host|需要进一步测试|
|src/ui/desktop.css:1007|.ui-settings-category .legacy-settings-pane|需要进一步测试|
|src/ui/desktop.css:1013|.ui-settings-category .legacy-settings-pane[hidden]|需要进一步测试|
|src/ui/desktop.css:1016|#view-history, #view-archives, #view-settings|需要进一步测试|
|src/ui/desktop.css:1021|.picker-layout|需要进一步测试|
|src/ui/desktop.css:1026|.picker-left, .picker-right|需要进一步测试|
|src/ui/desktop.css:1033|.picker-center|需要进一步测试|
|src/ui/desktop.css:1040|.picker-left .slot-options-row|需要进一步测试|
|src/ui/desktop.css:1046|.picker-vtab|需要进一步测试|
|src/ui/desktop.css:1052|.picker-vtab.active|需要进一步测试|
|src/ui/desktop.css:1056|#pickerInfoBox|需要进一步测试|
|src/ui/desktop.css:1061|.slot-reel-text|需要进一步测试|
|src/ui/desktop.css:1064|.slot-reel-frame|需要进一步测试|
|src/ui/desktop.css:1067|#slotResultPanel.show #resultHeadline|需要进一步测试|
|src/ui/desktop.css:1071|.picker-right .picker-info-tabs|需要进一步测试|
|src/ui/desktop.css:1074|.ui-settings-category #bgmListContainer|需要进一步测试|
|src/ui/desktop.css:1078|.ui-settings-category .setting-section-title|需要进一步测试|
|src/ui/desktop.css:1081|.ui-settings-category #uiIconManagerV26 img, .item-big-icon img, .item-encyclopedia-icon img, .ency-icon img|需要进一步测试|
|src/ui/desktop.css:1091|.item-big-icon|需要进一步测试|
|src/ui/desktop.css:1099|.item-big-desc|需要进一步测试|
|src/ui/desktop.css:1102|.queue-main-card|需要进一步测试|
|src/ui/desktop.css:1105|.queue-secondary-card|需要进一步测试|
|src/ui/desktop.css:1108|.queue-item-card|需要进一步测试|
|src/ui/desktop.css:1111|.queue-role-badge|需要进一步测试|
|src/ui/desktop.css:1114|.queue-main-card .queue-role-badge|需要进一步测试|
|src/ui/desktop.css:1117|.ui-settings-row input:not(.ui-toggle input):disabled, .ui-settings-row select:disabled|需要进一步测试|
|src/ui/desktop.css:1122|.ui-page button:disabled|需要进一步测试|
|src/ui/desktop.css:1126|.ui-page button:focus-visible, .ui-settings-shell button:focus-visible, select:focus-visible, summary:focus-visible|需要进一步测试|
|src/ui/desktop.css:1134|.app-topnav .header-stats|需要进一步测试|
|src/ui/desktop.css:1137|.picker-layout|需要进一步测试|
|src/ui/desktop.css:1140|.picker-left,   .picker-right,   .picker-center|需要进一步测试|
|src/ui/desktop.css:1146|.ui-settings-body .ui-settings-category .setting-item|需要进一步测试|
|src/ui/desktop.css:1151|.ui-podium:has(> div:nth-child(3)) > div:first-child|需要进一步测试|
|src/ui/desktop.css:1156|.ui-podium:has(> div:nth-child(3)) > div:nth-child(2)|需要进一步测试|
|src/ui/desktop.css:1160|.ui-podium:has(> div:nth-child(3)) > div:nth-child(3)|需要进一步测试|
|src/ui/desktop.css:1164|.ui-podium:not(:has(> div:nth-child(2)))|需要进一步测试|
|src/ui/home-dashboard.css:1|#view-welcome #homeDashboardGrid|需要进一步测试|
|src/ui/home-dashboard.css:9|#view-welcome .home-dashboard-toolbar|需要进一步测试|
|src/ui/home-dashboard.css:19|#view-welcome .home-dashboard-toolbar-copy|需要进一步测试|
|src/ui/home-dashboard.css:25|#view-welcome .home-dashboard-toolbar-copy strong|需要进一步测试|
|src/ui/home-dashboard.css:29|#view-welcome .home-dashboard-toolbar-copy span, #view-welcome .home-dashboard-status|需要进一步测试|
|src/ui/home-dashboard.css:34|#view-welcome .home-dashboard-toolbar-actions|需要进一步测试|
|src/ui/home-dashboard.css:41|#view-welcome .home-dashboard-status|需要进一步测试|
|src/ui/home-dashboard.css:45|#view-welcome .home-dashboard-status[data-kind="error"]|需要进一步测试|
|src/ui/home-dashboard.css:48|#view-welcome .home-dashboard-add-panel|需要进一步测试|
|src/ui/home-dashboard.css:59|#view-welcome .home-dashboard-add-panel[hidden]|需要进一步测试|
|src/ui/home-dashboard.css:62|#view-welcome .home-dashboard-add-panel strong, #view-welcome .home-dashboard-add-panel span|需要进一步测试|
|src/ui/home-dashboard.css:67|#view-welcome .home-dashboard-add-panel button|需要进一步测试|
|src/ui/home-dashboard.css:76|#view-welcome .home-dashboard-add-panel button:focus-visible, #view-welcome .home-dashboard-toolbar button:focus-visible, #view-welcome .home-card-editor-controls button:focus-visible|需要进一步测试|
|src/ui/home-dashboard.css:82|#view-welcome #homeDashboardGrid [data-home-card-type]|需要进一步测试|
|src/ui/home-dashboard.css:85|.home-card-editor-controls|需要进一步测试|
|src/ui/home-dashboard.css:92|.home-card-editor-controls button|需要进一步测试|
|src/ui/home-dashboard.css:107|.home-card-editor-controls .home-card-drag-handle|需要进一步测试|
|src/ui/home-dashboard.css:113|.home-card-editor-controls [data-home-card-action="hide"]|需要进一步测试|
|src/ui/home-dashboard.css:117|.home-card-editor-controls [data-home-card-action="remove"]|需要进一步测试|
|src/ui/home-dashboard.css:121|.home-card-editor-controls .home-card-resize-handle|需要进一步测试|
|src/ui/home-dashboard.css:127|.home-layout-editing #view-welcome #homeDashboardGrid [data-home-card-type]|需要进一步测试|
|src/ui/home-dashboard.css:131|.home-layout-editing   #view-welcome   #homeDashboardGrid   [data-home-card-type]   > *:not(.home-card-editor-controls)|需要进一步测试|
|src/ui/home-dashboard.css:138|.home-layout-editing   #view-welcome   #homeDashboardGrid   .home-card-editor-controls|需要进一步测试|
|src/ui/home-dashboard.css:144|#view-welcome #homeDashboardGrid > .gp-kpis, #view-welcome #homeDashboardGrid > .gp-main-grid, #view-welcome #homeDashboardGrid > .gp-daily-grid|需要进一步测试|
|src/ui/home-dashboard.css:149|#view-welcome #homeDashboardGrid > .gp-section-heading, #view-welcome #homeDashboardGrid > .gp-bottom-heading|需要进一步测试|
|src/ui/home-dashboard.css:153|#view-welcome #homeDashboardGrid > .gp-group-section|需要进一步测试|
|src/ui/home-dashboard.css:158|#view-welcome #homeDashboardGrid > .gp-kpis > .gp-kpi, #view-welcome #homeDashboardGrid .gp-panel, #view-welcome #homeDashboardGrid > .gp-daily-grid > article|需要进一步测试|
|src/ui/home-dashboard.css:165|#view-welcome #homeDashboardGrid > .gp-daily-grid > [data-home-card-type]|需要进一步测试|
|src/ui/home-dashboard.css:171|#view-welcome #homeDashboardGrid > .gp-kpis > .gp-kpi|需要进一步测试|
|src/ui/home-dashboard.css:174|#view-welcome #homeDashboardGrid .gp-panel|需要进一步测试|
|src/ui/home-dashboard.css:178|#view-welcome #homeDashboardGrid .gp-rank-list, #view-welcome #homeDashboardGrid .gp-feed-list|需要进一步测试|
|src/ui/home-dashboard.css:183|#view-welcome #homeDashboardGrid > [data-home-card-type]|需要进一步测试|
|src/ui/home-dashboard.css:186|body.gp-intro-reveal #view-welcome #homeDashboardGrid [data-home-card-type], body.gp-intro-reveal #view-welcome #homeDashboardGrid [data-home-card-type]|需要进一步测试|
|src/ui/home-dashboard.css:192|#view-welcome #homeDashboardGrid|需要进一步测试|
|src/ui/home-dashboard.css:195|#view-welcome #homeDashboardGrid > [data-home-card-type]|需要进一步测试|
|src/ui/home-dashboard.css:198|#view-welcome #homeDashboardGrid > .gp-daily-grid > [data-home-card-type]|需要进一步测试|
|src/ui/home-dashboard.css:201|#view-welcome #homeDashboardGrid > .gp-group-section|需要进一步测试|
|src/ui/home-dashboard.css:206|#view-welcome #homeDashboardGrid|需要进一步测试|
|src/ui/home-dashboard.css:210|#view-welcome #homeDashboardGrid > [data-home-card-type],   #view-welcome #homeDashboardGrid > .gp-daily-grid > [data-home-card-type],   #view-welcome #homeDashboardGrid > .gp-kpis > .gp-kpi|需要进一步测试|
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
|src/ui/item-modules.css:197|.im-block .ui-toggle|需要进一步测试|
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
|src/ui/item-score-cinematics.css:1|.hand-item-cinematic|需要进一步测试|
|src/ui/item-score-cinematics.css:14|.hand-item-cinematic::backdrop|需要进一步测试|
|src/ui/item-score-cinematics.css:17|.hic-surface|需要进一步测试|
|src/ui/item-score-cinematics.css:27|.hic-surface h2|需要进一步测试|
|src/ui/item-score-cinematics.css:32|.hic-surface small|需要进一步测试|
|src/ui/item-score-cinematics.css:36|.hic-icon img|需要进一步测试|
|src/ui/item-score-cinematics.css:42|.hic-targets strong|需要进一步测试|
|src/ui/item-score-cinematics.css:47|.hic-arrow|需要进一步测试|
|src/ui/item-score-cinematics.css:51|.hic-targets|需要进一步测试|
|src/ui/item-score-cinematics.css:55|from|需要进一步测试|
|src/ui/item-score-cinematics.css:59|to|需要进一步测试|
|src/ui/item-score-cinematics.css:64|.score-motion-hidden|需要进一步测试|
|src/ui/item-score-cinematics.css:67|.score-card-wash|需要进一步测试|
|src/ui/item-score-cinematics.css:74|.score-card-number|需要进一步测试|
|src/ui/item-score-cinematics.css:86|.score-card-number small|需要进一步测试|
|src/ui/item-score-cinematics.css:91|.competition-status|需要进一步测试|
|src/ui/item-score-cinematics.css:100|.competition-status-guide|需要进一步测试|
|src/ui/item-score-cinematics.css:106|.competition-status-guide dt|需要进一步测试|
|src/ui/item-score-cinematics.css:110|.competition-status-guide dd|需要进一步测试|
|src/ui/item-score-cinematics.css:115|.hic-targets|需要进一步测试|
|src/ui/roster-workspace.css:1|.roster-workspace|需要进一步测试|
|src/ui/roster-workspace.css:3|.roster-profile-form[hidden]|需要进一步测试|
|src/ui/roster-workspace.css:6|.roster-workspace-toolbar, .roster-profile-form, .roster-workspace-footer|需要进一步测试|
|src/ui/roster-workspace.css:15|.roster-workspace-toolbar label:not(.roster-import-label), .roster-profile-form label|需要进一步测试|
|src/ui/roster-workspace.css:23|.roster-workspace-toolbar select, .roster-profile-form input, .roster-table input, .roster-table select|需要进一步测试|
|src/ui/roster-workspace.css:36|.roster-workspace-toolbar select|需要进一步测试|
|src/ui/roster-workspace.css:39|.roster-import-label|需要进一步测试|
|src/ui/roster-workspace.css:43|.roster-table-wrap|需要进一步测试|
|src/ui/roster-workspace.css:50|.roster-table|需要进一步测试|
|src/ui/roster-workspace.css:55|.roster-table th, .roster-table td|需要进一步测试|
|src/ui/roster-workspace.css:61|.roster-table th|需要进一步测试|
|src/ui/roster-workspace.css:69|.roster-table th:first-child|需要进一步测试|
|src/ui/roster-workspace.css:72|.roster-table th:nth-child(2)|需要进一步测试|
|src/ui/roster-workspace.css:75|.roster-table th:nth-child(3)|需要进一步测试|
|src/ui/roster-workspace.css:78|.roster-table th:last-child|需要进一步测试|
|src/ui/roster-workspace.css:81|.roster-table td input, .roster-table td select|需要进一步测试|
|src/ui/roster-workspace.css:85|.roster-avatar-editor|需要进一步测试|
|src/ui/roster-workspace.css:91|.roster-student-avatar, .roster-avatar-placeholder|需要进一步测试|
|src/ui/roster-workspace.css:101|.roster-avatar-placeholder|需要进一步测试|
|src/ui/roster-workspace.css:107|.roster-avatar-label|需要进一步测试|
|src/ui/roster-workspace.css:113|.roster-avatar-upload[hidden]|需要进一步测试|
|src/ui/roster-workspace.css:116|.roster-workspace-footer|需要进一步测试|
|src/ui/roster-workspace.css:119|.roster-apply-backdrop|需要进一步测试|
|src/ui/roster-workspace.css:130|.roster-apply-card|需要进一步测试|
|src/ui/roster-workspace.css:144|.roster-apply-card h3|需要进一步测试|
|src/ui/roster-workspace.css:148|.roster-apply-card > p:not(.ui-eyebrow)|需要进一步测试|
|src/ui/roster-workspace.css:153|.roster-apply-card .ui-window-close|需要进一步测试|
|src/ui/roster-workspace.css:158|.roster-apply-summary|需要进一步测试|
|src/ui/roster-workspace.css:166|.roster-apply-table-wrap|需要进一步测试|
|src/ui/roster-workspace.css:172|.roster-apply-table|需要进一步测试|
|src/ui/roster-workspace.css:177|.roster-apply-table th, .roster-apply-table td|需要进一步测试|
|src/ui/roster-workspace.css:184|.roster-apply-table thead th|需要进一步测试|
|src/ui/roster-workspace.css:192|.roster-apply-table thead th:first-child|需要进一步测试|
|src/ui/roster-workspace.css:195|.roster-apply-table thead th:nth-child(2), .roster-apply-table thead th:nth-child(3)|需要进一步测试|
|src/ui/roster-workspace.css:199|.roster-apply-table thead th:last-child|需要进一步测试|
|src/ui/roster-workspace.css:202|.roster-apply-warning|需要进一步测试|
|src/ui/roster-workspace.css:210|.roster-apply-actions|需要进一步测试|
|src/ui/roster-workspace.css:217|from|重复实现（仅语法；层叠需进一步测试）|
|src/ui/roster-workspace.css:220|to|重复实现（仅语法；层叠需进一步测试）|
|src/ui/roster-workspace.css:225|from|需要进一步测试|
|src/ui/roster-workspace.css:229|to|重复实现（仅语法；层叠需进一步测试）|
|src/ui/roster-workspace.css:234|#rosterStatus[data-state="error"]|需要进一步测试|
|src/ui/teaching-workspace.css:1|.teaching-schedule-workspace|需要进一步测试|
|src/ui/teaching-workspace.css:3|.teaching-current, .teaching-schedule-form, .teaching-schedule-toolbar, .teaching-schedule-actions|需要进一步测试|
|src/ui/teaching-workspace.css:13|.teaching-current|需要进一步测试|
|src/ui/teaching-workspace.css:21|.teaching-current > span|需要进一步测试|
|src/ui/teaching-workspace.css:25|.teaching-schedule-form label, .teaching-schedule-toolbar label|需要进一步测试|
|src/ui/teaching-workspace.css:33|.teaching-schedule-form input, .teaching-schedule-form select, .teaching-schedule-toolbar select|需要进一步测试|
|src/ui/teaching-workspace.css:45|.teaching-schedule-form input[type="text"]|需要进一步测试|
|src/ui/teaching-workspace.css:48|.teaching-schedule-list|需要进一步测试|
|src/ui/teaching-workspace.css:54|.teaching-schedule-table|需要进一步测试|
|src/ui/teaching-workspace.css:58|.teaching-schedule-table th, .teaching-schedule-table td|需要进一步测试|
|src/ui/teaching-workspace.css:64|.teaching-schedule-table th|需要进一步测试|
|src/ui/teaching-workspace.css:70|.teaching-schedule-actions|需要进一步测试|
|src/ui/teaching-workspace.css:74|#teachingScheduleStatus[data-state="error"]|需要进一步测试|
|src/ui/teaching-workspace.css:77|.teaching-resource-workspace > p|需要进一步测试|
|src/ui/teaching-workspace.css:80|.teaching-resource-scope, .teaching-resource-import, .teaching-resource-filters|需要进一步测试|
|src/ui/teaching-workspace.css:89|.teaching-resource-scope label, .teaching-resource-import label, .teaching-resource-filters label|需要进一步测试|
|src/ui/teaching-workspace.css:99|.teaching-resource-import label:first-child, .teaching-resource-import label:nth-child(2)|需要进一步测试|
|src/ui/teaching-workspace.css:103|.teaching-resource-filters label:first-child|需要进一步测试|
|src/ui/teaching-workspace.css:106|.teaching-resource-scope input, .teaching-resource-scope select, .teaching-resource-import input:not([type="file"]), .teaching-resource-import select, .teaching-resource-filters input|需要进一步测试|
|src/ui/teaching-workspace.css:120|.teaching-resource-file-label input[type="file"]|需要进一步测试|
|src/ui/teaching-workspace.css:131|.teaching-resource-list|需要进一步测试|
|src/ui/teaching-workspace.css:138|.teaching-resource-card|需要进一步测试|
|src/ui/teaching-workspace.css:149|.teaching-resource-card-info|需要进一步测试|
|src/ui/teaching-workspace.css:154|.teaching-resource-card-info strong, .teaching-resource-card-info span|需要进一步测试|
|src/ui/teaching-workspace.css:158|.teaching-resource-card-info strong|需要进一步测试|
|src/ui/teaching-workspace.css:162|.teaching-resource-card-info span|需要进一步测试|
|src/ui/teaching-workspace.css:166|.teaching-resource-card-info .teaching-resource-tags|需要进一步测试|
|src/ui/teaching-workspace.css:169|.teaching-resource-card-actions|需要进一步测试|
|src/ui/teaching-workspace.css:174|.teaching-resource-preview|需要进一步测试|
|src/ui/teaching-workspace.css:186|.teaching-resource-preview::backdrop|需要进一步测试|
|src/ui/teaching-workspace.css:190|.teaching-resource-preview > header, .teaching-resource-preview > footer|需要进一步测试|
|src/ui/teaching-workspace.css:200|.teaching-resource-preview > header h3|需要进一步测试|
|src/ui/teaching-workspace.css:204|.teaching-resource-preview > footer|需要进一步测试|
|src/ui/teaching-workspace.css:208|.teaching-resource-preview-body|需要进一步测试|
|src/ui/teaching-workspace.css:213|.teaching-resource-preview-body pre|需要进一步测试|
|src/ui/teaching-workspace.css:223|.teaching-resource-preview-body img|需要进一步测试|
|src/ui/teaching-workspace.css:230|#teachingResourceStatus[data-state="error"]|需要进一步测试|
|src/ui/teaching-workspace.css:234|.teaching-resource-card|需要进一步测试|
|src/ui/teaching-workspace.css:238|.teaching-resource-preview[open]|需要进一步测试|
|src/ui/teaching-workspace.css:242|.teaching-resource-preview.is-closing|需要进一步测试|
|src/ui/teaching-workspace.css:248|from|需要进一步测试|
|src/ui/teaching-workspace.css:252|to|需要进一步测试|
|src/ui/teaching-workspace.css:258|from|需要进一步测试|
|src/ui/teaching-workspace.css:262|to|重复实现（仅语法；层叠需进一步测试）|
|src/ui/teaching-workspace.css:268|from|需要进一步测试|
|src/ui/teaching-workspace.css:272|to|需要进一步测试|
|src/ui/themes.css:1|/* Presentation-only theme. No layout dimensions or business-state selectors are changed. */ body.modern-flat.theme-marx|需要进一步测试|
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
