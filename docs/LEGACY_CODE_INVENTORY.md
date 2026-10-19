# 3.0.10 防御所有权

core/item-score.js的tryDefend与requestSpinyDefense并未删除功能：规则判断转移domain/items/defense-policy，副作用/弹窗移至application/item-defense-adapter。分类：仍必要→按职责迁移。共享消费/炸弹自爆/视觉函数仍保留。旧无归属clear回调已被token保护替代；RED/229/464/26/10/30/2证据见artifacts/v3-defense。

---

# 3.0.9 All In control chain

script12 _v2177ToggleAllInCard captured wrapper:已被新实现取代→删除；其每题道具使用后禁止All In守门保留在application/answer-commands.js。原00.js直接选择/AllIn函数改为单一转发。动态控制/7手工/117核心/80判题/14组布局全部通过，证据artifacts/v3-controls。其他script12队列、状态锁及回合工具仍保留。

---

# 3.0.5 道具旧分发链治理

基准 e714dbe（3.0.4）。生产公开入口 useItem → ItemModules.execute → ItemOperationBlocks.run 已独立执行全部26种道具。删除前将 legacyUseItem 替换为抛错函数，26/26规则oracle仍通过；源码全局搜索没有旧链以外的生产调用。删除后相同26/26、464攻防差分、30异步防御场景及80回合差分通过。

| 旧实现 | 分类/处理 | 有效行为的现有归属 |
|---|---|---|
| 00.js legacyUseItem 原始分支树 | 已被新实现取代→删除正文；保留一个兼容转发 | application/legacy-classroom-adapter.js + items/operation.js |
| 00.js useItemBeforeVisualDispatch、_v282UseItem、_v282UseItemWithIce、_v291UseItem、_v2120UseItem | 旧链内部重复分发→删除捕获及赋值 | ItemOperationBlocks、现有showItemUseFx与score scheduler |
| 00.js installPersistentItemUseGuardV299 | 只安装旧链包装，无其他副作用→删除整个局部IIFE | Reliability.validateItem 与 ItemOperationBlocks |
| 00.js installV2113ExtendedItemHandler | 局部EXT/目标/消耗工具仅服务旧链→删除整个IIFE | ItemOperationBlocks的feather/fire/ice/boomerang积木 |
| 01.js _v213UseItem | 已被替代→删除 | 当前公开命令及持久化路径 |
| 12.js _v2177UseItem | 已被替代→删除；共享markItemUsedThisRoundV2177仍保留 | 当前useItem直接调用共享标记 |
| 31.js _v21732UseItem | 已被替代→删除；快照、队列、批处理深度/滚动调度仍保留 | 当前道具执行器/攻防调度 |
| 36.js _v218UseItemBalance、_v218UseItemIceCleanup | 已被替代→删除；共享consume/attack/队列/描述保留 | ItemOperationBlocks及公开冻结取消分支 |
| 42.js _v2189UseItem | 已被替代→删除；实际道具说明及tips保留 | ItemOperationBlocks最终花类规则 |
| legacyUseItem兼容别名 | 仍然必要的过渡兼容 | 单次转发公开useItem；AST只允许一个函数定义；下游/控制台使用清单归零后可另删 |
| 其他共享旧函数、CSS、音频、计时器 | 仍必要或需要进一步测试→保留 | 本次不以旧版号作为删除依据 |

实测证据 artifacts/v3-items。历史库存如下，旧行号/统计不能作为本轮完成范围。

---

# 3.0.4判题包装链治理

基准da00d1b（V3.0.3）。实际替代及动态差分覆盖如下；不得把此表推广为全部旧代码已删除。

| 旧实现 | 分类 | 替代实现 | 证据 |
|---|---|---|---|
| 00.js基础判题数学与Reliability预检重复 | 重复实现→已统一 | domain/competition/rules.calculateRound | 零/负数/All In/空答/安全整数单元测试 |
| 00.js _itemBaseJudgeRound包装 | 已由新实现取代→已删除 | items/round-effects.settle | 80种子差分 |
| 00.js _v2Judge包装 | 已由新实现取代→已删除 | application/round-settlement显式pkTotal阶段 | 80种子差分，正式回合数/撤销快照 |
| 04.js _v2164JudgeRound包装 | 已由新实现取代→已删除 | ui/round-feedback.afterPowerRound | 相同720ms调度、分数与音效/视觉事件差分 |
| 36.js _v218JudgeRound包装 | 已由新实现取代→已删除 | items/round-effects.expire | 作答/未作答、冰冻/幽灵期限与续用锁差分 |
| legacyJudgeRound入口 | 仍然必要的过渡兼容 | 单一函数转交RoundSettlement，后续调用清单清空后移除 | AST守卫仅允许一个定义，无覆盖 |
| legacyUseItem14处写入 | 需要进一步静态/动态可达性审查 | 当前公开useItem已转ItemOperationBlocks；旧链可能已被替代 | 下一阶段逐块确认，尚未删除 |

以下为历史库存，行号对应当时版本。

---

# 遗留代码依赖与治理清单

基线：`9e1be3c`。由 `node scripts/legacy-inventory.mjs` 生成。范围：全部旧版脚本、core、UI 与 CSS；资源内容另由构建完整性检查验证。

分类词汇：仍然必要、已被新实现取代、重复实现、确认无法触达、需要进一步测试、可安全删除。**未证明安全的项目默认需要进一步测试并保留；没有调用者的静态结果不等于不可达，HTML、字符串事件及延迟回调仍可能调用它。**

JSON 包含每个命名函数的调用依赖、变量初始化、计时器及监听器的参数、全部 CSS 叶规则正文。命名函数包含局部定义，重复名字不等于全局覆盖；包装器指标为捕获函数标识符的别名数量，不能当作完整运行时覆盖层数。

## 规模观察

|指标|基线|当前|
|---|---:|---:|
|sourceBytes|939511|934791|
|sourceLines|23827|23785|
|functionDefinitions|875|869|
|duplicateNames|94|92|
|extraDefinitions|203|191|
|capturedWrapperAliases|98|87|
|timerAndListenerCalls|316|316|
|cssLeafRules|1940|1940|
|exactRepeatedCssBodies|48|48|
|important|1660|1660|
|buildBytes|7779851|7774957|

## 已证明可替换／不可达的旧入口

|原位置|实现|分类|依据|
|---|---|---|---|
|src/script/00.js:2327|renderAll|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/00.js:2545|renderGrid|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/00.js:4688|renderGrid|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/01.js:51|renderGrid|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/01.js:127|main.onclick|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/01.js:128|more.onclick|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/02.js:13|renderGrid|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/03.js:21|renderAll|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/12.js:114|renderGrid|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/17.js:40|renderAll|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/17.js:73|renderGrid|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/24.js:29|renderGrid|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/26.js:7|renderGrid|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/27.js:41|renderGrid|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/29.js:6|renderGrid|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|
|src/script/31.js:170|renderGrid|已移除（需结合本轮治理报告）|仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据|

## 模块保留决策

|文件|分类|保留理由|
|---|---|---|
|src/core/action-sounds.js|仍然必要|当前规范、命令、攻击防御、快照或兼容接口的唯一实现|
|src/core/classroom.js|仍然必要|当前规范、命令、攻击防御、快照或兼容接口的唯一实现|
|src/core/commands.js|仍然必要|当前规范、命令、攻击防御、快照或兼容接口的唯一实现|
|src/core/history.js|仍然必要|当前规范、命令、攻击防御、快照或兼容接口的唯一实现|
|src/core/item-score.js|仍然必要|当前规范、命令、攻击防御、快照或兼容接口的唯一实现|
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
|src/ui/application-surfaces.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/battle-motion.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/battle-motion.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/classroom-feedback.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/classroom-feedback.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/desktop.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/desktop.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/model.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/welcome-v2.css|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/welcome-v2.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/battle-grid.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|
|src/ui/render.js|需要进一步测试|仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移|

## 全部脚本／函数及调用依赖

|位置|名称|类型|分类|直接及嵌套调用（不表示均已执行）|
|---|---|---|---|---|
|src/core/action-sounds.js:34|isClick|binding|仍然必要|slots.some|
|src/core/action-sounds.js:35|classify|declaration|仍然必要|isClick, button.getAttribute, button.onclick?.toString, button.textContent.trim, button.matches, /判定／结算/.test, /停止/.test, /^[-−]/.test, /stopSlotSpin／stopPicker/.test, /startSlotSpin／pull.*Lever／toggle.*Slot／pullPickerLever/i.test, /globalItemDraw／drawItem／handDrawItem／DrawForGroup/.test, /useItem／handUseNewItem/.test, /selectGroupOpt／batchSelectOption／setCorrectAns/.test, /AllIn/.test, /startRound/.test, /evaluateRound/.test, /nextRound/.test, /undoLast／restoreHistory/.test, /delete／clear／resetAll／resetScores/i.test, /清空／删除/.test, /triggerUpload／Import／import／chooseItemIcon/.test, /export／Export/.test, /取消/.test, /close／dismiss／finishIntro/.test, /open[A-Z]/.test, /确认／应用／保存／完成/.test, button.closest|
|src/core/classroom.js:3|buildClassroomBackup|declaration|仍然必要|classroomCommands.isPending, clone, classroomCommands.baseline, new Date().toISOString, getPersistableGroups|
|src/core/classroom.js:16|applyClassroomBackup|declaration|仍然必要|Reliability.validateBackup, normalizeAllGroups, ['individual','group','two_tier'].includes, Array.isArray, clone, Reliability.count, Object.fromEntries, Object.entries(state.itemGlobal.customIcons／／{}).filter, Object.entries, Reliability.safeImage, ['A','B','C','D'].includes, state.groups.forEach, String, Number.isFinite, Number, Math.max, Math.min, ['single','double'].includes, data.history.filter(h=>h&&Array.isArray(h.groups)).slice, data.history.filter, ensureV2State, ensureGroupNumbersV213|
|src/core/classroom.js:51|importClassroomData|declaration|仍然必要|Reliability.invalidateDefenseDecisions, clone, Reliability.validateBackup, cancelScoreAnimationAndSync, applyClassroomBackup, saveState, Error, renderAll, String|
|src/core/classroom.js:68|itemCommandSnapshot|declaration|仍然必要|JSON.stringify|
|src/core/classroom.js:69|showClassroomSaveWarning|declaration|仍然必要|String, document.getElementById, showToast|
|src/core/classroom.js:108|runClassroomCommand|declaration|仍然必要|classroomCommands.run|
|src/core/classroom.js:109|deferClassroomDefense|declaration|仍然必要|classroomCommands.defer, Promise.resolve(promise).then(answer=>{     if(!isCurrent())return;     apply(answer);saveState();renderAll();   }).catch, Promise.resolve(promise).then, Promise.resolve, isCurrent, apply, saveState, renderAll, console.error, showToast|
|src/core/classroom.js:117|useItem|declaration|仍然必要|Reliability.invalidateDefenseDecisions, state.groups.find, Reliability.validateItem, isCommunismMode, closeItemWindowForFx, showToast, runClassroomCommand, ensureV2State, itemCommandSnapshot, Object.keys, markItemUsedThisRoundV2177, legacyUseItem|
|src/core/classroom.js:160|judgeRound|declaration|仍然必要|Reliability.calculateRoundScores, themeAlert, runClassroomCommand, legacyJudgeRound|
|src/core/commands.js:3|create|declaration|仍然必要|host.restore, host.result, host.render, cancel, String, host.error, host.validate, host.persist, Error, host.warning, fail, host.active, host.invalidate, host.snapshot, host.record, host.setActive, operation, finish, Promise.resolve(promise)         .then((value) => {           if (current !== tx) return;           if (!isCurrent()) {             cancel("stale-defense");             return;           }           host.setActive(true);           try {             apply(value);             host.validate();           } finally {             host.setActive(false);           }           tx.waiting--;           finish(tx);         })         .catch, Promise.resolve(promise)         .then, Promise.resolve, isCurrent, apply|
|src/core/commands.js:5|cancel|declaration|仍然必要|host.restore, host.result, host.render|
|src/core/commands.js:15|fail|declaration|仍然必要|cancel, String, host.error|
|src/core/commands.js:20|finish|declaration|仍然必要|host.validate, host.persist, host.restore, host.result, host.error, Error, host.warning, host.render, fail|
|src/core/commands.js:46|run|declaration|仍然必要|host.active, host.invalidate, cancel, host.snapshot, host.record, host.setActive, operation, host.validate, fail, host.result, finish|
|src/core/commands.js:77|defer|declaration|仍然必要|Promise.resolve(promise)         .then((value) => {           if (current !== tx) return;           if (!isCurrent()) {             cancel("stale-defense");             return;           }           host.setActive(true);           try {             apply(value);             host.validate();           } finally {             host.setActive(false);           }           tx.waiting--;           finish(tx);         })         .catch, Promise.resolve(promise)         .then, Promise.resolve, isCurrent, cancel, host.setActive, apply, host.validate, finish, fail|
|src/core/history.js:4|copy|binding|仍然必要|JSON.parse, JSON.stringify|
|src/core/history.js:20|recordHistory|declaration|仍然必要|Reliability.invalidateDefenseDecisions, HistorySnapshots.capture, new Date().toLocaleTimeString, historyStack.push, historyStack.shift, persistHistoryV26|
|src/core/history.js:33|persistHistoryV26|declaration|仍然必要|classroomCommands.isPending, STORAGE.setJSON, historyStack.slice, console.warn|
|src/core/history.js:44|restoreStateFromSnapshot|declaration|仍然必要|Reliability.invalidateDefenseDecisions, cancelScoreAnimationAndSync, clone, normalizeAllGroups, state.groups.forEach, Number.isFinite, saveState, renderAll, ensureItemState, startBulletTimer, startBlooperClock|
|src/core/history.js:69|undoLast|declaration|仍然必要|openPwdModal, classroomCommands.isPending, Reliability.invalidateDefenseDecisions, showToast, historyStack.pop, restoreStateFromSnapshot, playSound, persistHistoryV26, saveState|
|src/core/item-score.js:3|tryDefend|declaration|仍然必要|Number, tinyDefenseToast, eligibleForItems, Math.max, Object.keys, ["star", "mega"].includes, g.inventory.findIndex, g.inventory.splice, SHELL_ATTACK_KEYS_V2170.has, explodeDestroyedBombV2170, [       "green",       "triple_green",       "red",       "triple_red",       "banana",       "triple_banana",       "horn",     ].includes, consumeInventoryItem, ["mushroom", "triple_mushroom"].includes|
|src/core/item-score.js:109|requestSpinyDefense|declaration|仍然必要|Reliability.captureDefenseDecision, themeConfirm, deferClassroomDefense, clear, consumeInventoryItem, tinyDefenseToast, continueAttack, Reliability.isDefenseDecisionCurrent, Promise.resolve(prompt).then, Promise.resolve|
|src/core/item-score.js:128|clear|binding|仍然必要||
|src/core/item-score.js:160|commitItemScore|declaration|仍然必要|eligibleForItems, tryDefend, Math.round, Number, scheduleScoreEffect, state.groups.includes, playAttackTargetFxV2116|
|src/core/item-score.js:186|applyItemScoreAfterHorn|declaration|仍然必要|Number, eligibleForItems, destroyPrimaryBasicDefenseV2170, ["mushroom", "triple_mushroom"].includes, requestSpinyDefense, commitItemScore, queueItemScoreChangesV21732, String|
|src/core/item-score.js:220|applyItemScore|declaration|仍然必要|requestSpinyDefense, applyItemScoreAfterHorn|
|src/core/reliability.js:5|validateBackup|declaration|仍然必要|Array.isArray, Error, data.groups.forEach, Number.isSafeInteger, Number, g.members.some, validateBackup|
|src/core/reliability.js:27|writeVerified|declaration|仍然必要|JSON.stringify, storage.setItem, storage.getItem, Error, String|
|src/core/reliability.js:35|appendArchive|declaration|仍然必要|storage.getItem, JSON.parse, Array.isArray, Error, writeVerified, list.filter, String|
|src/core/reliability.js:44|phase|declaration|仍然必要||
|src/core/reliability.js:50|validateItem|declaration|仍然必要|Number, ['triple_green','triple_red','triple_banana','triple_mushroom'].includes, ['star','mega','power'].includes|
|src/core/reliability.js:64|onDefenseInvalidation|declaration|仍然必要|defenseInvalidationHandlers.add, defenseInvalidationHandlers.delete|
|src/core/reliability.js:69|invalidateDefenseDecisions|declaration|仍然必要|handler|
|src/core/reliability.js:76|captureDefenseDecision|declaration|仍然必要|Array.isArray, s.groups.includes, phase|
|src/core/reliability.js:83|isDefenseDecisionCurrent|declaration|仍然必要|Array.isArray, s.groups.find, phase, Object.is|
|src/core/reliability.js:92|planBatchScoreChanges|declaration|仍然必要|Number.isSafeInteger, Error, Array.isArray, groups.map, groupCounts.map, groupMap.get, Number|
|src/core/reliability.js:104|safeImage|declaration|仍然必要|/^data:image\/(?:png／jpe?g／webp／gif);base64,[a-zA-Z0-9+/=\s]+$/.test|
|src/core/reliability.js:107|count|declaration|仍然必要|Number, Number.isSafeInteger|
|src/core/reliability.js:108|normalizeStats|declaration|仍然必要|Object.fromEntries, ['correct','wrong','draws','used'].map, count|
|src/core/reliability.js:109|normalizeEffect|declaration|仍然必要|Array.isArray, ['star','mega','power','bullet'].includes, Object.hasOwn, count, Object.keys|
|src/core/reliability.js:117|calculateRoundScores|declaration|仍然必要|s.groups.map, Number, Number.isSafeInteger, Error|
|src/core/reliability.js:129|csvText|declaration|仍然必要|String, /^[\s]*[=+@-]/.test|
|src/script/00.js:2|showClassroomWindow|declaration|需要进一步测试|DesktopUI.cancelWindowClose, root.classList.add|
|src/script/00.js:7|hideClassroomWindow|declaration|需要进一步测试|root.classList.remove, DesktopUI.dismissWindow, commit|
|src/script/00.js:17|readableTextOnColor|declaration|需要进一步测试|String(hex／／'').trim().replace, String(hex／／'').trim, String, raw.split('').map(x=>x+x).join, raw.split('').map, raw.split, /^[0-9a-f]{6}$/i.test, [0,2,4].map(i=>parseInt(value.slice(i,i+2),16)/255).map, [0,2,4].map, parseInt, value.slice, Math.pow|
|src/script/00.js:73|clone|binding|需要进一步测试|JSON.parse, JSON.stringify|
|src/script/00.js:122|normalizeGroup|declaration|需要进一步测试|Number, Number.isFinite, Date.now, Number.isSafeInteger, /^#[0-9a-fA-F]{6}$/.test, String, Array.isArray, Array.from, source.members.map(v => String(v ?? '').trim()).filter, source.members.map, String(v ?? '').trim, String(source.name ?? 第 ${index + 1} 组).trim, Math.trunc, ['A','B','C','D'].includes, source.inventory.map, Reliability.normalizeStats, Reliability.normalizeEffect, Math.max|
|src/script/00.js:155|normalizeAllGroups|declaration|需要进一步测试|(Array.isArray(groups) ? groups : []).map, Array.isArray, normalizeGroup, seen.has, Date.now, seen.add|
|src/script/00.js:166|initSessionState|declaration|需要进一步测试|normalizeAllGroups, ['individual','group','two_tier'].includes, Array.isArray, state.groups.forEach|
|src/script/00.js:214|checkAllInRatio|declaration|需要进一步测试|state.groups.filter|
|src/script/00.js:225|getSettlementHistory|declaration|需要进一步测试|STORAGE.getJSON|
|src/script/00.js:229|saveSettlementRecord|declaration|需要进一步测试|buildSettlementClearedDataV21813, Reliability.appendArchive|
|src/script/00.js:235|triggerFinalSettlement|declaration|需要进一步测试|themeAlert, openPwdModal, now.getFullYear, String(now.getMonth() + 1).padStart, String, now.getMonth, String(now.getDate()).padStart, now.getDate, document.getElementById, DesktopUI.prepareSettlement, showClassroomWindow, setTimeout, input.focus, input.select|
|src/script/00.js:255|closeSettlementNameModal|declaration|需要进一步测试|DesktopUI.cancelSettlement, hideClassroomWindow, document.getElementById|
|src/script/00.js:260|confirmFinalSettlement|declaration|需要进一步测试|Reliability.invalidateDefenseDecisions, openPwdModal, showToast, state.groups.some, document.getElementById, input.value.trim, closeSettlementNameModal, [...state.groups].sort, Number, Date.now, new Date().toLocaleDateString, new Date().toLocaleString, state.groups.reduce, clone, saveSettlementRecord, themeAlert, recordHistory, bgmStopAll, renderControls, playSound, setTimeout, escapeHtml, showClassroomWindow, initConfetti, resetCompetitionDataAfterSettlementV21812, saveState, renderAll|
|src/script/00.js:340|initConfetti|declaration|需要进一步测试|document.getElementById, canvas.getContext, confettiParticles.push, Math.random, Math.floor, ctx.clearRect, confettiParticles.forEach, ctx.save, ctx.translate, ctx.rotate, ctx.fillRect, ctx.restore, requestAnimationFrame, cancelAnimationFrame, loop|
|src/script/00.js:363|loop|declaration|需要进一步测试|ctx.clearRect, confettiParticles.forEach, ctx.save, ctx.translate, ctx.rotate, ctx.fillRect, ctx.restore, requestAnimationFrame|
|src/script/00.js:384|stopConfetti|declaration|需要进一步测试|cancelAnimationFrame|
|src/script/00.js:391|closeGrandSettlementModal|declaration|需要进一步测试|hideClassroomWindow, document.getElementById, stopConfetti|
|src/script/00.js:396|openSettlementHistoryModal|declaration|需要进一步测试|switchView|
|src/script/00.js:400|closeSettlementHistoryModal|declaration|需要进一步测试|switchView|
|src/script/00.js:404|renderArchiveClassStats|declaration|需要进一步测试|document.getElementById, state.groups.reduce, Number, metrics.map(([label,value,unit]) => <div class="archive-stat-card"><b>${value}<small>${unit}</small></b><span>${label}</span></div>).join, metrics.map|
|src/script/00.js:421|renderSettlementHistoryList|declaration|需要进一步测试|DesktopUI.renderArchives|
|src/script/00.js:425|exportSingleSettlementCSV|declaration|需要进一步测试|getSettlementHistory, record.groups.forEach, (g.members ／／ []).join, g.name.replace, members.replace, URL.createObjectURL, document.createElement, (record.title ／／ '课堂最终结算').replace, a.click, URL.revokeObjectURL, showToast|
|src/script/00.js:446|exportLatestSettlementCSV|declaration|需要进一步测试|getSettlementHistory, themeAlert, exportSingleSettlementCSV|
|src/script/00.js:455|deleteSettlementRecord|declaration|需要进一步测试|themeAlert, openPwdModal, themeConfirm, getSettlementHistory, list.splice, STORAGE.setJSON, renderSettlementHistoryList, showToast|
|src/script/00.js:476|scheduleIdleTask|declaration|需要进一步测试|window.requestIdleCallback, window.setTimeout, Math.min|
|src/script/00.js:483|refreshSoundIdCache|declaration|需要进一步测试|resolve, db.transaction, tx.objectStore, store.getAllKeys|
|src/script/00.js:490|req.onsuccess|assignment|需要进一步测试|resolve|
|src/script/00.js:494|req.onerror|assignment|需要进一步测试|resolve|
|src/script/00.js:501|hasSound|declaration|需要进一步测试|soundIdCache.has|
|src/script/00.js:519|getSecPerBeat|declaration|需要进一步测试|Number, Math.max|
|src/script/00.js:525|getSecPerBar|declaration|需要进一步测试|getSecPerBeat, Math.max, Number|
|src/script/00.js:527|getTrackCurrentBeat|declaration|需要进一步测试|Math.max, getSecPerBeat|
|src/script/00.js:551|openHistoryModal|declaration|需要进一步测试|switchView|
|src/script/00.js:555|closeHistoryModal|declaration|需要进一步测试|switchView|
|src/script/00.js:559|renderHistoryList|declaration|需要进一步测试|DesktopUI.renderHistory|
|src/script/00.js:563|toggleHistExpand|declaration|需要进一步测试|document.querySelectorAll, node.classList.toggle|
|src/script/00.js:569|clearHistoryStack|declaration|需要进一步测试|openPwdModal, themeConfirm, renderHistoryList, showToast|
|src/script/00.js:577|revertToHistory|declaration|需要进一步测试|themeAlert, openPwdModal, historyStack.slice, restoreStateFromSnapshot, playSound, renderHistoryList, showToast|
|src/script/00.js:592|initDB|declaration|需要进一步测试|indexedDB.open, database.objectStoreNames.contains, database.createObjectStore, refreshSoundIdCache, resolve, scheduleBackgroundAudioInit|
|src/script/00.js:599|request.onupgradeneeded|assignment|需要进一步测试|database.objectStoreNames.contains, database.createObjectStore|
|src/script/00.js:606|request.onsuccess|assignment|需要进一步测试|refreshSoundIdCache, resolve, scheduleBackgroundAudioInit|
|src/script/00.js:613|request.onerror|assignment|需要进一步测试|resolve|
|src/script/00.js:622|scheduleBackgroundAudioInit|declaration|需要进一步测试|scheduleIdleTask, STORAGE.get, migrateOldDatabases, STORAGE.set, refreshSoundIdCache, loadFxSounds|
|src/script/00.js:642|migrateOldDatabases|declaration|需要进一步测试|indexedDB.open, oldDb.objectStoreNames.contains, oldDb.close, res, oldDb.transaction, txOld.objectStore, storeOld.getAll, db.transaction, txNew.objectStore, records.forEach, newId.startsWith, newId.replace, storeNew.put|
|src/script/00.js:648|req.onsuccess|assignment|需要进一步测试|oldDb.objectStoreNames.contains, oldDb.close, res, oldDb.transaction, txOld.objectStore, storeOld.getAll, db.transaction, txNew.objectStore, records.forEach, newId.startsWith, newId.replace, storeNew.put|
|src/script/00.js:654|getAllReq.onsuccess|assignment|需要进一步测试|db.transaction, txNew.objectStore, records.forEach, newId.startsWith, newId.replace, storeNew.put, oldDb.close, res|
|src/script/00.js:672|getAllReq.onerror|assignment|需要进一步测试|oldDb.close, res|
|src/script/00.js:674|req.onerror|assignment|需要进一步测试|res|
|src/script/00.js:680|getAudioContext|declaration|需要进一步测试|audioCtx.createGain, masterGainNode.gain.setValueAtTime, masterGainNode.connect, bgmEngine.battleGain.connect, bgmEngine.thinkingGain.connect, Promise.race, audioCtx.resume, setTimeout, res|
|src/script/00.js:704|loadFxSounds|declaration|需要进一步测试|async () => {     try {       const records = await new Promise(resolve => {         const tx = db.transaction('sounds', 'readonly');         const store = tx.objectStore('sounds');         const req = store.getAll();         req.onsuccess = () => resolve(req.result ／／ []);         req.onerror = () => resolve([]);       });        const ctx = await getAudioContext();       const fxRecords = records.filter(item =>         item && typeof item.id === 'string' &&         item.id.startsWith('fx_') &&         item.arrayBuffer && item.arrayBuffer.byteLength > 0       );        const variants = Object.create(null);       await Promise.all(fxRecords.map(async item => {         try {           const decoded = await ctx.decodeAudioData(item.arrayBuffer.slice(0));           const key=item.id.slice(3),split=key.indexOf('::variant::');           if(split>=0){const slot=key.slice(0,split);(variants[slot]／／=[]).push({id:item.id,name:item.name／／'候选音效',buffer:decoded});}           else customFxBuffers[key] = decoded;         } catch (_) {}       }));        Object.values(variants).forEach(list=>list.sort((a,b)=>a.id.localeCompare(b.id)));       customFxVariants=variants;       fxSoundsLoaded = true;     } catch (_) {     } finally {       fxSoundsLoading = null;     }   }, db.transaction, tx.objectStore, store.getAll, resolve, getAudioContext, records.filter, item.id.startsWith, Object.create, Promise.all, fxRecords.map, ctx.decodeAudioData, item.arrayBuffer.slice, item.id.slice, key.indexOf, key.slice, (variants[slot]／／=[]).push, Object.values(variants).forEach, Object.values, list.sort, a.id.localeCompare|
|src/script/00.js:714|req.onsuccess|assignment|需要进一步测试|resolve|
|src/script/00.js:715|req.onerror|assignment|需要进一步测试|resolve|
|src/script/00.js:748|selectFxBuffer|declaration|需要进一步测试|[customFxBuffers[slotId],...(customFxVariants[slotId]／／[]).map(x=>x.buffer)].filter, (customFxVariants[slotId]／／[]).map, Math.min, Math.max, Math.floor, random|
|src/script/00.js:754|renderFxChoices|declaration|需要进一步测试|choices.map((x,i)=><div class="cf-audio-choice"><span>${escapeHtml(x.name／／'候选 '+(i+1))}</span><button class="btn btn-sm" data-fx-remove="${escapeHtml(x.id)}" onclick="deleteFxCandidate(this.dataset.fxRemove)">移除</button></div>).join, choices.map, escapeHtml|
|src/script/00.js:758|deleteFxCandidate|declaration|需要进一步测试|id.includes, db.transaction, reject, tx.objectStore('sounds').delete, tx.objectStore, id.slice, id.indexOf, (customFxVariants[slot]／／[]).filter, soundIdCache.delete, renderFxSlotList, renderItemFxSoundListV26, showToast|
|src/script/00.js:761|tx.onerror|assignment|需要进一步测试|reject|
|src/script/00.js:761|tx.onabort|assignment|需要进一步测试|reject|
|src/script/00.js:767|checkSetCompleteness|declaration|需要进一步测试|Promise.resolve, hasSound, refreshSoundIdCache().then, refreshSoundIdCache, doCheck|
|src/script/00.js:770|doCheck|binding|需要进一步测试|hasSound|
|src/script/00.js:801|getAllCompleteSetIndices|declaration|需要进一步测试|checkSetCompleteness, completeIndices.push|
|src/script/00.js:810|getFallbackSetIndex|declaration|需要进一步测试|checkSetCompleteness|
|src/script/00.js:818|pickNextPlayableSetIndex|declaration|需要进一步测试|getAllCompleteSetIndices, bgmShufflePool.filter, completeSets.includes, Math.floor, Math.random, bgmShufflePool.shift, getFallbackSetIndex|
|src/script/00.js:840|fetchAndDecodeSetBuffers|declaration|需要进一步测试|db.transaction, tx.objectStore, resolve, SET_TRACK_TYPES.forEach, store.get, getAudioContext, Object.entries, onProgress, Promise.all, entries.map, ctx.decodeAudioData, ab.slice, Math.round|
|src/script/00.js:858|req.onsuccess|assignment|需要进一步测试|resolve|
|src/script/00.js:863|req.onerror|assignment|需要进一步测试|resolve|
|src/script/00.js:898|bgmPreloadNextSet|declaration|需要进一步测试|pickNextPlayableSetIndex, fetchAndDecodeSetBuffers|
|src/script/00.js:914|playChiptuneSynth|declaration|需要进一步测试|ActionSounds.slots.find, audioCtx.createOscillator, audioCtx.createGain, osc.frequency.setValueAtTime, gain.gain.setValueAtTime, gain.gain.exponentialRampToValueAtTime, osc.connect, gain.connect, getFxOutputV2176, osc.start, osc.stop, osc.frequency.exponentialRampToValueAtTime, freqs.forEach, [523.25, 783.99].forEach, notes.forEach, gain.gain.linearRampToValueAtTime, ClassroomFeedback.getOptions, Math.random, [1046.50, 1567.98].forEach|
|src/script/00.js:1050|playSound|declaration|需要进一步测试|getAudioContext, loadFxSounds, selectFxBuffer, ActionSounds.isClick, audioCtx.createBufferSource, audioCtx.createGain, ClassroomFeedback.getOptions, source.connect, gain.connect, getFxOutputV2176, ClassroomFeedback.ownClickVoice, source.start, playChiptuneSynth|
|src/script/00.js:1069|clearAllLoopTimeouts|declaration|需要进一步测试|activeLoopTimeouts.forEach, clearTimeout|
|src/script/00.js:1074|scheduleDualLoopChunk|declaration|需要进一步测试|getSecPerBeat, Math.max, audioCtx.createBufferSource, bSrc.connect, bSrc.start, bSrc.stop, bgmEngine.activeNodes.push, tSrc.connect, tSrc.start, tSrc.stop, setTimeout, scheduleDualLoopChunk, activeLoopTimeouts.push|
|src/script/00.js:1117|bgmStartNewRoundMusicWithProgress|declaration|需要进一步测试|onProgress, getAudioContext, bgmStopAll, pickNextPlayableSetIndex, fetchAndDecodeSetBuffers, audioCtx.createBufferSource, introSrc.connect, introSrc.start, bgmEngine.activeNodes.push, checkAllInRatio, bgmEngine.thinkingGain.gain.setValueAtTime, bgmEngine.battleGain.gain.setValueAtTime, scheduleDualLoopChunk, setTimeout, bgmPreloadNextSet|
|src/script/00.js:1188|bgmTransitionThinkingToBattle|declaration|需要进一步测试|getAudioContext, getSecPerBeat, getTrackCurrentBeat, Number, Math.ceil, clearTimeout, bgmEngine.thinkingGain.gain.cancelScheduledValues, bgmEngine.battleGain.gain.cancelScheduledValues, bgmEngine.thinkingGain.gain.setValueAtTime, bgmEngine.thinkingGain.gain.linearRampToValueAtTime, audioCtx.createBufferSource, transSrc.connect, transSrc.start, bgmEngine.activeNodes.push, Math.max, bgmEngine.battleGain.gain.setValueAtTime, bgmEngine.battleGain.gain.linearRampToValueAtTime, setTimeout, checkAllInRatio, bgmTransitionBattleToThinking|
|src/script/00.js:1279|bgmTransitionBattleToThinking|declaration|需要进一步测试|getAudioContext, clearTimeout, getSecPerBeat, getTrackCurrentBeat, Math.ceil, getSecPerBar, bgmEngine.battleGain.gain.cancelScheduledValues, bgmEngine.thinkingGain.gain.cancelScheduledValues, bgmEngine.battleGain.gain.setValueAtTime, bgmEngine.battleGain.gain.linearRampToValueAtTime, bgmEngine.thinkingGain.gain.setValueAtTime, bgmEngine.thinkingGain.gain.linearRampToValueAtTime|
|src/script/00.js:1318|bgmTriggerVictory|declaration|需要进一步测试|callback, getAudioContext, getSecPerBeat, getTrackCurrentBeat, clearTimeout, clearAllLoopTimeouts, bgmEngine.battleGain.gain.cancelScheduledValues, bgmEngine.thinkingGain.gain.cancelScheduledValues, bgmEngine.battleGain.gain.setValueAtTime, bgmEngine.battleGain.gain.linearRampToValueAtTime, bgmEngine.thinkingGain.gain.setValueAtTime, bgmEngine.thinkingGain.gain.linearRampToValueAtTime, setTimeout, bgmEngine.battleSource.stop, bgmEngine.thinkingSource.stop, bgmEngine.activeNodes.forEach, item.stop, Math.max, audioCtx.createBufferSource, victorySrc.connect, victorySrc.start, bgmStopAll|
|src/script/00.js:1379|victorySrc.onended|assignment|需要进一步测试|bgmStopAll, callback|
|src/script/00.js:1399|bgmStopAll|declaration|需要进一步测试|clearAllLoopTimeouts, clearTimeout, bgmEngine.victoryNode.stop, bgmEngine.activeNodes.forEach, item.stop, bgmEngine.battleGain.gain.cancelScheduledValues, bgmEngine.thinkingGain.gain.cancelScheduledValues, bgmEngine.battleGain.gain.setValueAtTime, bgmEngine.thinkingGain.gain.setValueAtTime|
|src/script/00.js:1442|showToast|declaration|需要进一步测试|document.getElementById, clearTimeout, String, t.showPopover, console.warn, t.classList.add, setTimeout, t.classList.remove, t.matches, t.hidePopover|
|src/script/00.js:1459|getPersistableGroups|declaration|需要进一步测试|state.groups.map, Number.isFinite, Number, Math.trunc|
|src/script/00.js:1467|saveState|declaration|需要进一步测试|showClassroomSaveWarning, classroomCommands.isPending, ensureV2State, buildClassroomBackup, Reliability.writeVerified, document.getElementById, mirrors.filter(([k,v])=>!STORAGE.setJSON(k,v)).map, mirrors.filter, STORAGE.setJSON, Object.entries, STORAGE.set, failed.push, showToast|
|src/script/00.js:1495|applyZoom|declaration|需要进一步测试|Math.max, Math.min, DesktopUI.syncViewport, STORAGE.set, showToast, Math.round|
|src/script/00.js:1503|zoomIn|declaration|需要进一步测试|applyZoom, Math.round|
|src/script/00.js:1507|zoomOut|declaration|需要进一步测试|applyZoom, Math.round|
|src/script/00.js:1511|zoomReset|declaration|需要进一步测试|applyZoom|
|src/script/00.js:1515|toggleResizerEnabled|declaration|需要进一步测试|saveState, updateResizerUI|
|src/script/00.js:1521|toggleSaveAllIn|declaration|需要进一步测试|saveState|
|src/script/00.js:1526|updateColumnMode|declaration|需要进一步测试|saveState, renderGrid|
|src/script/00.js:1532|updateResizerUI|declaration|需要进一步测试|document.getElementById|
|src/script/00.js:1539|initResizerDrag|declaration|需要进一步测试|document.getElementById, handle.setPointerCapture, e.preventDefault, handle.hasPointerCapture, Math.max, Math.min, handle.releasePointerCapture, saveState, showToast|
|src/script/00.js:1547|handle.onpointerdown|assignment|需要进一步测试|handle.setPointerCapture, e.preventDefault|
|src/script/00.js:1554|handle.onpointermove|assignment|需要进一步测试|handle.hasPointerCapture, Math.max, Math.min|
|src/script/00.js:1562|handle.onpointerup|assignment|需要进一步测试|handle.hasPointerCapture, handle.releasePointerCapture, saveState, showToast|
|src/script/00.js:1571|toggleLock|declaration|需要进一步测试|openPwdModal, showToast, renderAll|
|src/script/00.js:1580|openPwdModal|declaration|需要进一步测试|document.getElementById, showClassroomWindow, setTimeout, document.getElementById('pwdInput').focus|
|src/script/00.js:1586|closePwdModal|declaration|需要进一步测试|hideClassroomWindow, document.getElementById|
|src/script/00.js:1590|handlePwdKey|declaration|需要进一步测试|event.preventDefault, submitPassword, closePwdModal|
|src/script/00.js:1595|submitPassword|declaration|需要进一步测试|document.getElementById('pwdInput').value.trim, document.getElementById, closePwdModal, showToast, renderAll, themeAlert, input.focus|
|src/script/00.js:1610|updateAdminPin|declaration|需要进一步测试|document.getElementById('newPwdInput').value.trim, document.getElementById, themeAlert, saveState, showToast|
|src/script/00.js:1622|handleMainAction|declaration|需要进一步测试|startRound, judgeRound|
|src/script/00.js:1630|preloadInitialAudio|declaration|需要进一步测试|getAudioContext, bgmPreloadNextSet|
|src/script/00.js:1639|startRound|declaration|需要进一步测试|Reliability.invalidateDefenseDecisions, document.getElementById, getAudioContext, Promise.race, hasAnyPlayableBgm, setTimeout, res, finishStartRound, showToast, bgmStartNewRoundMusicWithProgress((percent) => {     if (fill) fill.style.width = ${percent}%;   }).then(() => {     if (overlay) overlay.style.display = 'none';     finishStartRound();     playSound('score_add');     showToast('初始化完毕');     isStartingRound = false;   }).catch, bgmStartNewRoundMusicWithProgress((percent) => {     if (fill) fill.style.width = ${percent}%;   }).then, bgmStartNewRoundMusicWithProgress, playSound|
|src/script/00.js:1691|finishStartRound|declaration|需要进一步测试|Reliability.invalidateDefenseDecisions, captureCardRectsV21725, state.groups.forEach, renderAll, animateCardsFromSnapshotV21725, saveState|
|src/script/00.js:1714|hasAnyPlayableBgm|declaration|需要进一步测试|initDB, refreshSoundIdCache, getAllCompleteSetIndices, getFallbackSetIndex|
|src/script/00.js:1729|nextRound|declaration|需要进一步测试|themeAlert, Reliability.invalidateDefenseDecisions, document.getElementById, bgmStopAll, bgmStartNewRoundMusicWithProgress, playSound, captureCardRectsV21725, resetRoundItemUseLocksV2177, state.groups.forEach, checkAllInRatio, bgmTransitionThinkingToBattle, bgmTransitionBattleToThinking, saveState, renderAll, animateCardsFromSnapshotV21725, showToast|
|src/script/00.js:1791|forceEndRound|declaration|需要进一步测试|themeConfirm, Reliability.invalidateDefenseDecisions, captureCardRectsV21725, bgmStopAll, recordHistory, saveState, renderAll, animateCardsFromSnapshotV21725, showToast|
|src/script/00.js:1812|applySettingsBatchMembers|declaration|需要进一步测试|openPwdModal, document.getElementById('settingsBatchMemberText').value.trim, document.getElementById, themeAlert, text.split('\n').map(l => l.trim()).filter, text.split('\n').map, text.split, l.trim, lines.forEach, line.includes, line.split, parts[0].trim, parts.slice(1).join(delimiter).trim, parts.slice(1).join, parts.slice, membersStr.split(/[,，、\s]+/).map(m => m.trim()).filter, membersStr.split(/[,，、\s]+/).map, membersStr.split, m.trim, state.groups.find, g.name.trim, newGroups.push, Date.now, Array.from, saveState, renderAll, updatePickerPoolUI, showToast, closeSoundModal|
|src/script/00.js:1855|batchSelectOption|declaration|需要进一步测试|showToast, playSound, state.groups.forEach, saveState, renderGrid, renderDashboard|
|src/script/00.js:1870|batchToggleAllIn|declaration|需要进一步测试|showToast, playSound, state.groups.every, state.groups.forEach, saveState, renderGrid, renderDashboard, checkAllInRatio, bgmTransitionThinkingToBattle, bgmTransitionBattleToThinking|
|src/script/00.js:1900|openScoreModal|declaration|需要进一步测试|event.preventDefault, event.stopPropagation, state.groups.find, document.getElementById, inputEl.classList.remove, showClassroomWindow, setTimeout, document.getElementById('modalCustomInput').focus|
|src/script/00.js:1919|closeScoreModal|declaration|需要进一步测试|hideClassroomWindow, document.getElementById|
|src/script/00.js:1924|submitModalScore|declaration|需要进一步测试|closeScoreModal, applyScoreDelta|
|src/script/00.js:1931|handleModalKey|declaration|需要进一步测试|event.preventDefault, submitModalCustomScore, closeScoreModal|
|src/script/00.js:1940|submitModalCustomScore|declaration|需要进一步测试|document.getElementById, input.value.trim()     .replace(/[－—–−]/g, '-')     .replace, input.value.trim()     .replace, input.value.trim, String.fromCharCode, c.charCodeAt, input.classList.add, input.focus, input.select, /^[+-]?\d+$/.test, fail, parseInt, Number.isSafeInteger, closeScoreModal, applyScoreDelta|
|src/script/00.js:1949|fail|binding|需要进一步测试|input.classList.add, input.focus, input.select|
|src/script/00.js:1963|showMilestoneBanner|declaration|需要进一步测试|document.querySelector, card.querySelector, card.classList.add, banner.classList.add, setTimeout, banner.classList.remove, card.classList.remove|
|src/script/00.js:1979|cancelScoreAnimationAndSync|declaration|需要进一步测试|cancelItemScoreAnimations, cancelAnimationFrame, state.groups.forEach|
|src/script/00.js:1988|animateScores|declaration|需要进一步测试|cancelAnimationFrame, performance.now, Math.min, Math.pow, scoreUpdates.forEach, Math.round, state.groups.find, document.getElementById, renderChart, renderDashboard, requestAnimationFrame, updateHeaderStats, onComplete|
|src/script/00.js:1996|tick|declaration|需要进一步测试|Math.min, Math.pow, scoreUpdates.forEach, Math.round, state.groups.find, document.getElementById, renderChart, renderDashboard, requestAnimationFrame, updateHeaderStats, onComplete|
|src/script/00.js:2031|applyScoreDelta|declaration|需要进一步测试|Reliability.invalidateDefenseDecisions, cancelScoreAnimationAndSync, openPwdModal, state.groups.find, Number.isSafeInteger, showToast, recordHistory, Math.floor(Math.abs(oldScore)).toString, Math.floor, Math.abs, Math.floor(Math.abs(targetScore)).toString, playSound, showMilestoneBanner, saveState, animateScores, ClassroomFeedback.score|
|src/script/00.js:2069|startDirectScoreEdit|declaration|需要进一步测试|openPwdModal, renderGrid|
|src/script/00.js:2075|handleScoreInputKey|declaration|需要进一步测试|finishDirectScoreEdit, renderGrid|
|src/script/00.js:2083|finishDirectScoreEdit|declaration|需要进一步测试|cancelScoreAnimationAndSync, document.getElementById, state.groups.find, Number, Number.isSafeInteger, showToast, recordHistory, playSound, saveState, renderGrid, animateScores|
|src/script/00.js:2105|selectGroupOpt|declaration|需要进一步测试|state.groups.find, playSound, saveState, renderGrid, renderDashboard|
|src/script/00.js:2116|toggleAllInCard|declaration|需要进一步测试|state.groups.find, playSound, saveState, renderGrid, renderDashboard, checkAllInRatio, bgmTransitionThinkingToBattle, bgmTransitionBattleToThinking|
|src/script/00.js:2138|setCorrectAns|declaration|需要进一步测试|playSound, renderControls, state.groups.every, themeConfirm, saveState|
|src/script/00.js:2162|legacyJudgeRound|declaration|需要进一步测试|themeAlert, captureCardRectsV21725, recordHistory, state.groups.forEach, scoreUpdates.push, Math.floor(Math.abs(oldScore)).toString, Math.floor, Math.abs, Math.floor(Math.abs(g.score)).toString, milestoneGroups.push, saveState, renderControls, renderGrid, animateCardsFromSnapshotV21725, document.querySelector, card.classList.add, setTimeout, card.classList.remove, animateScores, playSound, milestoneGroups.forEach, showMilestoneBanner, bgmTriggerVictory|
|src/script/00.js:2260|openMemberSearchModal|declaration|需要进一步测试|document.getElementById, backdrop.classList.add, setTimeout, input.focus|
|src/script/00.js:2271|closeMemberSearchModal|declaration|需要进一步测试|document.getElementById, hideClassroomWindow|
|src/script/00.js:2276|handleMemberSearchKey|declaration|需要进一步测试|event.preventDefault, searchMemberGroups, closeMemberSearchModal|
|src/script/00.js:2286|searchMemberGroups|declaration|需要进一步测试|document.getElementById, input.value.trim().toLowerCase, input.value.trim, state.groups.forEach, Array.isArray, members.forEach, String(member).trim, String, name.toLowerCase().includes, name.toLowerCase, matches.push, escapeHtml, matches.map(item => {     const g = item.group;     const memberList = (Array.isArray(g.members) ? g.members : [])       .map(escapeHtml).join('、');     return        <div class="member-search-result">         <div class="member-search-result-name">${escapeHtml(item.name)}</div>         <div class="member-search-result-group">${escapeHtml(g.name)}</div>         <div class="member-search-result-members">成员：${memberList ／／ '暂无成员'}</div>       </div>;   }).join, matches.map, (Array.isArray(g.members) ? g.members : [])       .map(escapeHtml).join, (Array.isArray(g.members) ? g.members : [])       .map|
|src/script/00.js:2329|updateQuickBatchBar|declaration|需要进一步测试|document.getElementById, bar.classList.add, bar.classList.remove|
|src/script/00.js:2339|updateHeaderStats|declaration|需要进一步测试|document.getElementById, GodpowerUIModel.standings, ranking, Number, Date.now, escapeHtml|
|src/script/00.js:2351|renderChart|declaration|需要进一步测试|document.getElementById, [...state.groups].sort, Math.max, sorted.map, Array.from, wrapper.querySelectorAll, g.id.toString, existingRows.forEach, currentIds.has, r.getAttribute, r.remove, sorted.forEach, wrapper.querySelector, document.createElement, row.setAttribute, escapeHtml, wrapper.appendChild, row.querySelector, formatChartScoreV294|
|src/script/00.js:2419|renderDashboard|declaration|需要进一步测试|document.getElementById, [...state.groups].sort, escapeHtml, getScoreText, state.groups.filter, state.groups.reduce, (totalScore / totalGroups).toFixed|
|src/script/00.js:2432|getScoreText|binding|需要进一步测试||
|src/script/00.js:2463|renderLockStatus|declaration|需要进一步测试|document.getElementById, addBtn.classList.add, importBtn.classList.add, resetBtn.classList.add, undoBtn.classList.add, addBtn.classList.remove, importBtn.classList.remove, resetBtn.classList.remove, undoBtn.classList.remove, DesktopUI.refreshLockControl|
|src/script/00.js:2489|renderControls|declaration|需要进一步测试|document.getElementById, mainActionBtn.classList.remove, nextBtn.classList.add, forceBtn.classList.add, forceBtn.classList.remove, mainActionBtn.classList.add, nextBtn.classList.remove, document.querySelectorAll, btns.forEach, btn.classList.add, btn.classList.remove, updateQuickBatchBar|
|src/script/00.js:2537|openPickerModal|declaration|需要进一步测试|document.getElementById('pickerModal').classList.contains, document.getElementById, DesktopUI.cancelPickerPreparation, showClassroomWindow, updatePickerView, updatePickerPoolUI, resetSlotDisplay|
|src/script/00.js:2546|closePickerModal|declaration|需要进一步测试|stopSlotSpin, DesktopUI.cancelPickerPreparation, hideClassroomWindow, document.getElementById, document.getElementById('slotResultPanel').classList.remove|
|src/script/00.js:2553|setPickerMode|declaration|需要进一步测试|DesktopUI.cancelPickerPreparation, ['btnModeInd', 'btnModeGrp', 'btnModeTwo'].forEach, document.getElementById(id).classList.remove, document.getElementById, document.getElementById('btnModeInd').classList.add, document.getElementById('btnModeGrp').classList.add, document.getElementById('btnModeTwo').classList.add, updatePickerView, updatePickerPoolUI, resetSlotDisplay|
|src/script/00.js:2566|updatePickerView|declaration|需要进一步测试|document.getElementById, renderTwoTierChips|
|src/script/00.js:2583|renderTwoTierChips|declaration|需要进一步测试|document.getElementById, Array.isArray, state.groups.filter, groups.map(g => {     const on = pre.includes(g.id);     const style = on ? ('border-color:' + g.color + '; color:#fff; background:' + g.color + ';') : '';     return '<button type="button" class="two-tier-chip ' + (on ? 'active' : '') + '" style="' + style + '" onclick="toggleGroupPreselect(' + g.id + ')">' + escapeHtml(g.name) + '<span style="opacity:.75; font-size:11px; margin-left:4px;">' + g.members.length + '人</span></button>';   }).join, groups.map, pre.includes, escapeHtml|
|src/script/00.js:2595|toggleGroupPreselect|declaration|需要进一步测试|Array.isArray, state.picker.preselectedGroupIds.slice, pre.indexOf, pre.splice, pre.push, saveState, renderTwoTierChips, updatePickerPoolUI, resetSlotDisplay|
|src/script/00.js:2608|resetSlotDisplay|declaration|需要进一步测试|document.getElementById, document.getElementById('slotResultPanel').classList.remove|
|src/script/00.js:2619|toggleAntiRepeat|declaration|需要进一步测试|saveState, updatePickerPoolUI|
|src/script/00.js:2625|resetPickerPool|declaration|需要进一步测试|saveState, updatePickerPoolUI, showToast|
|src/script/00.js:2633|getAvailablePool|declaration|需要进一步测试|grps.filter, state.picker.pickedGroupIds.includes, state.groups.filter, Array.isArray, pre.includes, grps.forEach, (g.members ／／ []).forEach, students.push, students.filter, state.picker.pickedStudentKeys.includes, state.groups.forEach|
|src/script/00.js:2685|updatePickerPoolUI|declaration|需要进一步测试|getAvailablePool, document.getElementById|
|src/script/00.js:2696|toggleSlotSpin|declaration|需要进一步测试|startSlotSpin, stopSlotSpin|
|src/script/00.js:2701|startSlotSpin|declaration|需要进一步测试|DesktopUI.getPickerGeneration, getAvailablePool, themeAlert, getAudioContext, DesktopUI.isPickerCurrent, startRollLoop, document.getElementById('slotResultPanel').classList.remove, document.getElementById, Math.floor, Math.random, state.groups.forEach, (g.members ／／ []).forEach, allStudents.push, allGroups.push, Array.isArray, state.groups.filter, allGroups.filter, pre.includes, allStudents.filter, grpWithMembers.some, setInterval, studentLabelHTMLV218, ClassroomFeedback.startLive|
|src/script/00.js:2768|stopSlotSpin|declaration|需要进一步测试|clearInterval, document.getElementById, stopRollLoop, playSound, state.picker.pickedGroupIds.push, studentLabelHTMLV218, escapeHtml, state.picker.pickedStudentKeys.push, saveState, updatePickerPoolUI, document.getElementById('slotResultPanel').classList.add, DesktopUI.pickerStopped|
|src/script/00.js:2811|rewardPickedStudent|declaration|需要进一步测试|cancelScoreAnimationAndSync, state.groups.find, recordHistory, saveState, animateScores, playSound, showToast, document.getElementById('slotResultPanel').classList.remove, document.getElementById|
|src/script/00.js:2830|openBatchImportModal|declaration|需要进一步测试|openPwdModal, state.groups.map(g => ${g.name}: ${g.members.join(', ')}).join, state.groups.map, g.members.join, document.getElementById, showClassroomWindow|
|src/script/00.js:2837|closeBatchImportModal|declaration|需要进一步测试|hideClassroomWindow, document.getElementById|
|src/script/00.js:2841|applyBatchImport|declaration|需要进一步测试|document.getElementById('batchTextarea').value.trim, document.getElementById, closeBatchImportModal, text.split('\n').map(l => l.trim()).filter, text.split('\n').map, text.split, l.trim, lines.forEach, line.includes, line.split, state.groups.find, g.name.trim, grpName.trim, g.name.replace, grpName.replace, membersStr.split(/[,，、\s]+/).map(m => m.trim()).filter, membersStr.split(/[,，、\s]+/).map, membersStr.split, m.trim, Array.from, saveState, renderGrid, updatePickerPoolUI, showToast|
|src/script/00.js:2868|exportData|declaration|需要进一步测试|JSON.stringify, buildClassroomBackup, URL.createObjectURL, document.createElement, a.click, setTimeout, URL.revokeObjectURL|
|src/script/00.js:2874|triggerImport|declaration|需要进一步测试|openPwdModal, document.getElementById('importFileInput').click, document.getElementById|
|src/script/00.js:2879|handleFileImport|declaration|需要进一步测试|themeAlert, importClassroomData, JSON.parse, showToast, reader.readAsText|
|src/script/00.js:2883|reader.onload|assignment|需要进一步测试|importClassroomData, JSON.parse, showToast, themeAlert|
|src/script/00.js:2890|reader.onerror|assignment|需要进一步测试|themeAlert|
|src/script/00.js:2894|addGroup|declaration|需要进一步测试|openPwdModal, Date.now, recordHistory, state.groups.push, playSound, saveState, renderAll|
|src/script/00.js:2917|deleteGroup|declaration|需要进一步测试|openPwdModal, state.groups.find, themeConfirm, recordHistory, state.groups.filter, saveState, renderAll|
|src/script/00.js:2928|updateGroupName|declaration|需要进一步测试|state.groups.find, saveState, updateHeaderStats, renderChart, renderDashboard|
|src/script/00.js:2939|updateGroupColor|declaration|需要进一步测试|state.groups.find, saveState, renderAll|
|src/script/00.js:2948|resetAllScores|declaration|需要进一步测试|cancelScoreAnimationAndSync, openPwdModal, themeConfirm, recordHistory, state.groups.forEach, updates.push, animateScores, playSound, saveState|
|src/script/00.js:2967|openSoundSettings|declaration|需要进一步测试|themeAlert, openPwdModal, syncSettingsControls, renderBgmSlotList, renderFxSlotList, renderBgmEngineConsole, switchView|
|src/script/00.js:2980|closeSoundModal|declaration|需要进一步测试|switchView|
|src/script/00.js:2984|syncSettingsControls|declaration|需要进一步测试|document.getElementById, Math.round, state.groups.map(g => ${g.name}: ${(g.members ／／ []).join(', ')}).join, state.groups.map, (g.members ／／ []).join|
|src/script/00.js:2994|updateMasterVolume|declaration|需要进一步测试|parseFloat, document.getElementById, Math.round, masterGainNode.gain.setValueAtTime, saveState|
|src/script/00.js:3004|renderBgmSlotList|declaration|需要进一步测试|document.getElementById, parseInt, Number, refreshSoundIdCache, checkSetCompleteness, hasSound, document.createElement, container.appendChild|
|src/script/00.js:3059|renderFxSlotList|declaration|需要进一步测试|document.getElementById, FX_SOUND_SLOTS.forEach, ['roll_tick','roll_loop','roll_win'].includes, categories.has, categories.set, categories.get(category).push, categories.get, document.createElement, section.append, escapeHtml, renderFxChoices, fxContainer.append|
|src/script/00.js:3077|previewBgmTrack|declaration|需要进一步测试|db.transaction, tx.objectStore, store.get, getAudioContext, ctx.decodeAudioData, req.result.arrayBuffer.slice, ctx.createBufferSource, src.connect, src.start|
|src/script/00.js:3083|req.onsuccess|assignment|需要进一步测试|getAudioContext, ctx.decodeAudioData, req.result.arrayBuffer.slice, ctx.createBufferSource, src.connect, src.start|
|src/script/00.js:3098|triggerUploadAudio|declaration|需要进一步测试|slotId.startsWith, document.getElementById, input.click|
|src/script/00.js:3102|handleSoundFileUpload|declaration|需要进一步测试|Array.from, slotId.startsWith, slotId.slice, Promise.all(files.map((file,index)=>new Promise(resolve=>{     const candidate=!!fxKey&&(append／／index>0),key=candidate?slotId+'::variant::'+crypto.randomUUID():slotId;     const reader=new FileReader();     reader.onerror=()=>{showToast('音频文件读取失败，原音频保留');resolve(false)};     reader.onload=async function(e){       let decoded;       try{const ctx=await getAudioContext();decoded=await ctx.decodeAudioData(e.target.result.slice(0));}       catch(error){themeAlert('解析失败，请确保格式为 MP3/WAV');resolve(false);return;}       if(fxKey){         if(candidate)(customFxVariants[fxKey]／／=[]).push({id:key,name:file.name／／'候选音效',buffer:decoded});         else customFxBuffers[fxKey]=decoded;       }       let saved=false;       try{         if(!db)throw Error('浏览器音频存储不可用');         await new Promise((done,reject)=>{           const tx=db.transaction('sounds','readwrite');tx.oncomplete=done;tx.onerror=()=>reject(tx.error／／Error('音频保存失败'));tx.onabort=()=>reject(tx.error／／Error('音频保存中止'));           tx.objectStore('sounds').put({id:key,name:file.name／／'',arrayBuffer:e.target.result});         });soundIdCache.add(key);saved=true;       }catch(error){showToast(fxKey?'音效仅在本页生效，未保存：'+error.message:'音频未保存，原已保存文件保留：'+error.message);}       bgmEngine.preloadedSet=null;bgmShufflePool=[];       if(saved)showToast(candidate?'候选音效已追加，播放时随机选择':'音频已保存');       renderBgmSlotList();renderFxSlotList();renderItemFxSoundListV26();resolve(saved);     };reader.readAsArrayBuffer(file);   }))).finally, Promise.all, files.map, crypto.randomUUID, showToast, resolve, getAudioContext, ctx.decodeAudioData, e.target.result.slice, themeAlert, (customFxVariants[fxKey]／／=[]).push, Error, db.transaction, reject, tx.objectStore('sounds').put, tx.objectStore, soundIdCache.add, renderBgmSlotList, renderFxSlotList, renderItemFxSoundListV26, reader.readAsArrayBuffer|
|src/script/00.js:3110|reader.onerror|assignment|需要进一步测试|showToast, resolve|
|src/script/00.js:3111|reader.onload|assignment|需要进一步测试|getAudioContext, ctx.decodeAudioData, e.target.result.slice, themeAlert, resolve, (customFxVariants[fxKey]／／=[]).push, Error, db.transaction, reject, tx.objectStore('sounds').put, tx.objectStore, soundIdCache.add, showToast, renderBgmSlotList, renderFxSlotList, renderItemFxSoundListV26|
|src/script/00.js:3123|tx.onerror|assignment|需要进一步测试|reject, Error|
|src/script/00.js:3123|tx.onabort|assignment|需要进一步测试|reject, Error|
|src/script/00.js:3134|deleteBgmTrack|declaration|需要进一步测试|db.transaction, tx.objectStore, store.delete, soundIdCache.delete, showToast, renderBgmSlotList|
|src/script/00.js:3148|deleteFxTrack|declaration|需要进一步测试|db.transaction, tx.objectStore, reject, store.getAllKeys, req.result.filter(key=>key===idbKey／／String(key).startsWith(idbKey+'::variant::')).forEach, req.result.filter, String(key).startsWith, String, store.delete, key.startsWith, soundIdCache.delete, showToast, renderFxSlotList, renderItemFxSoundListV26|
|src/script/00.js:3153|tx.onerror|assignment|需要进一步测试|reject|
|src/script/00.js:3153|tx.onabort|assignment|需要进一步测试|reject|
|src/script/00.js:3154|req.onsuccess|assignment|需要进一步测试|req.result.filter(key=>key===idbKey／／String(key).startsWith(idbKey+'::variant::')).forEach, req.result.filter, String(key).startsWith, String, store.delete|
|src/script/00.js:3162|exportAudioBundle|declaration|需要进一步测试|showToast, db.transaction, tx.objectStore, store.getAll, resolve, themeAlert, fileIndex.push, audioBuffersToPack.push, new TextEncoder().encode, JSON.stringify, headerView.setUint8, headerView.setUint32, URL.createObjectURL, document.createElement, a.click, URL.revokeObjectURL|
|src/script/00.js:3171|req.onsuccess|assignment|需要进一步测试|resolve|
|src/script/00.js:3172|req.onerror|assignment|需要进一步测试|resolve|
|src/script/00.js:3211|triggerImportAudioBundle|declaration|需要进一步测试|openPwdModal, document.getElementById('bundleFileInput').click, document.getElementById|
|src/script/00.js:3216|handleBundleFilePicked|declaration|需要进一步测试|showToast, dataView.getUint8, themeAlert, dataView.getUint32, JSON.parse, new TextDecoder().decode, db.transaction, tx.objectStore, fileIndex.forEach, store.put, fullBuffer.slice, refreshSoundIdCache, loadFxSounds, renderBgmSlotList, renderFxSlotList, renderItemFxSoundListV26, reader.readAsArrayBuffer|
|src/script/00.js:3222|reader.onload|assignment|需要进一步测试|dataView.getUint8, themeAlert, dataView.getUint32, JSON.parse, new TextDecoder().decode, db.transaction, tx.objectStore, fileIndex.forEach, store.put, fullBuffer.slice, refreshSoundIdCache, loadFxSounds, renderBgmSlotList, renderFxSlotList, renderItemFxSoundListV26, showToast|
|src/script/00.js:3242|tx.oncomplete|assignment|需要进一步测试|refreshSoundIdCache, loadFxSounds, renderBgmSlotList, renderFxSlotList, renderItemFxSoundListV26, showToast|
|src/script/00.js:3261|escapeHtml|declaration|需要进一步测试|String(str ?? '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace, String(str ?? '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace, String(str ?? '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace, String(str ?? '').replace(/&/g, "&amp;").replace, String(str ?? '').replace, String|
|src/script/00.js:3275|ensureAudioUnlocked|declaration|需要进一步测试|Promise.resolve, getAudioContext().then(() => { audioUnlocked = true; }).catch, getAudioContext().then, getAudioContext|
|src/script/00.js:3280|switchView|declaration|需要进一步测试|VIEW_NAMES.includes, ensureAudioUnlocked, DesktopUI.viewChanged, document.querySelectorAll('.view').forEach, document.querySelectorAll, v.classList.remove, document.getElementById, target.classList.add, document.querySelectorAll('.nav-tab').forEach, t.classList.toggle, renderWelcomePage, updateWelcomeTrackIfNeeded, renderHistoryList, renderSettlementHistoryList, syncSettingsControls, renderBgmSlotList, renderFxSlotList, renderBgmEngineConsole, menuFadeOut, renderAll, bgmStopAll, ensureAudioUnlocked().then, getMenuTrackKeyForView, menuStartOrSwitch|
|src/script/00.js:3308|enterBattleFromWelcome|declaration|需要进一步测试|switchView|
|src/script/00.js:3312|getMenuTrackKeyForView|declaration|需要进一步测试|getWelcomeTrackKey|
|src/script/00.js:3320|getWelcomeTrackKey|declaration|需要进一步测试|state.groups.reduce, Math.max, Number, Math.min, String, Math.floor, Math.abs|
|src/script/00.js:3330|startWelcomeClock|declaration|需要进一步测试|updateWelcomeClock, setInterval|
|src/script/00.js:3336|updateWelcomeClock|declaration|需要进一步测试|updateHeaderStats, DesktopUI.renderWelcome, String(now.getHours()).padStart, String, now.getHours, String(now.getMinutes()).padStart, now.getMinutes, String(now.getSeconds()).padStart, now.getSeconds, document.getElementById, now.getFullYear, now.getMonth, now.getDate, now.getDay|
|src/script/00.js:3355|renderWelcomePage|declaration|需要进一步测试|DesktopUI.renderWelcome, document.getElementById, [...state.groups].sort, Number, escapeHtml, getScore|
|src/script/00.js:3361|getScore|binding|需要进一步测试|Number|
|src/script/00.js:3426|saveMenuCfg|declaration|需要进一步测试|STORAGE.setJSON|
|src/script/00.js:3429|midiToFreq|declaration|需要进一步测试|Math.pow|
|src/script/00.js:3431|mulberry32|declaration|需要进一步测试|Math.imul|
|src/script/00.js:3445|buildMenuPattern|declaration|需要进一步测试|Math.max, Number, mulberry32, key.split('').reduce, key.split, c.charCodeAt, new Array(totalSteps).fill, rnd, Math.floor|
|src/script/00.js:3483|getNoiseBuffer|declaration|需要进一步测试|Math.floor, audioCtx.createBuffer, noiseBuffer.getChannelData, Math.random|
|src/script/00.js:3517|menuSecPerBeat|declaration|需要进一步测试|Math.max, Number|
|src/script/00.js:3519|menuLoopSpan|declaration|需要进一步测试|Math.max, Number, menuSecPerBeat|
|src/script/00.js:3534|normalizeWelcomeLoopBuffer|declaration|需要进一步测试|/^welcome_[1-6]$/.test, menuLoopSpan, Math.min, menuSecPerBeat, Math.ceil, audioCtx.createBuffer, fixed.getChannelData(ch).set, fixed.getChannelData, buf.getChannelData|
|src/script/00.js:3554|menuEnsureGraph|declaration|需要进一步测试|audioCtx.createGain, menuBgm.outGain.gain.setValueAtTime, menuBgm.outGain.connect|
|src/script/00.js:3565|makeSynthMenuBuffer|declaration|需要进一步测试|Math.max, Number, Math.ceil, Math.floor, buildMenuPattern, Math.min, offline.createOscillator, offline.createGain, osc.frequency.setValueAtTime, midiToFreq, g.gain.setValueAtTime, g.gain.exponentialRampToValueAtTime, osc.connect, g.connect, osc.start, osc.stop, offline.createBuffer, buf.getChannelData, Math.random, offline.createBufferSource, offline.createBiquadFilter, src.connect, hp.connect, src.start, offline.startRendering|
|src/script/00.js:3625|menuLoadBuffer|declaration|需要进一步测试|async () => {     let buf = null;     if (db) {       try {         const ab = await new Promise(res => {           const tx = db.transaction('sounds', 'readonly');           const req = tx.objectStore('sounds').get('bgm_menu_' + key);           req.onsuccess = () => res((req.result && req.result.arrayBuffer) ／／ null);           req.onerror = () => res(null);         });         if (ab && ab.byteLength > 0) {           buf = await audioCtx.decodeAudioData(ab.slice(0));           buf = normalizeWelcomeLoopBuffer(key, buf);           menuBgm.uploadedKeys.add(key);         }       } catch(e) {}     }     if (!buf) {       try { buf = await makeSynthMenuBuffer(key); } catch(e2) { buf = null; }       if (buf) menuBgm.uploadedKeys.delete(key);     }     if (buf) menuBgm.buffers[key] = buf;     return buf;   }, db.transaction, tx.objectStore('sounds').get, tx.objectStore, res, audioCtx.decodeAudioData, ab.slice, normalizeWelcomeLoopBuffer, menuBgm.uploadedKeys.add, makeSynthMenuBuffer, menuBgm.uploadedKeys.delete|
|src/script/00.js:3635|req.onsuccess|assignment|需要进一步测试|res|
|src/script/00.js:3636|req.onerror|assignment|需要进一步测试|res|
|src/script/00.js:3656|menuLoopParams|declaration|需要进一步测试|menuLoopSpan, menuBgm.uploadedKeys.has, Math.min, Math.max|
|src/script/00.js:3666|menuTrimFor|declaration|需要进一步测试|Number, Math.max, Math.min, Number.isFinite|
|src/script/00.js:3672|menuPosForKey|declaration|需要进一步测试|menuLoopParams, Math.max, Math.min|
|src/script/00.js:3681|menuVoiceGainAt|declaration|需要进一步测试||
|src/script/00.js:3689|menuVoiceRamp|declaration|需要进一步测试|menuVoiceGainAt, g.cancelScheduledValues, g.setValueAtTime, g.linearRampToValueAtTime|
|src/script/00.js:3699|menuSpawnVoice|declaration|需要进一步测试|menuLoopParams, audioCtx.createBufferSource, Math.min, Math.max, audioCtx.createGain, gain.gain.setValueAtTime, src.connect, gain.connect, menuPosForKey, src.disconnect, gain.disconnect, menuBgm.voices.indexOf, menuBgm.voices.splice, src.start, menuBgm.voices.push|
|src/script/00.js:3712|src.onended|assignment|需要进一步测试|src.disconnect, gain.disconnect, menuBgm.voices.indexOf, menuBgm.voices.splice|
|src/script/00.js:3724|menuRetireVoice|declaration|需要进一步测试|menuVoiceRamp, v.src.stop|
|src/script/00.js:3736|menuSwitchNow|declaration|需要进一步测试|menuBgm.voices.find, menuBgm.voices.slice().forEach, menuBgm.voices.slice, menuRetireVoice, menuTrimFor, Math.abs, menuVoiceGainAt, menuVoiceRamp, menuSpawnVoice|
|src/script/00.js:3759|menuStartOrSwitch|declaration|需要进一步测试|ensureAudioUnlocked().then, ensureAudioUnlocked, menuEnsureGraph, menuLoadBuffer, menuSwitchNow|
|src/script/00.js:3777|menuFadeOut|declaration|需要进一步测试|menuPosForKey, Math.max, menuBgm.voices.slice().forEach, menuBgm.voices.slice, menuRetireVoice|
|src/script/00.js:3791|menuStop|declaration|需要进一步测试|menuBgm.voices.slice().forEach, menuBgm.voices.slice, v.src.stop|
|src/script/00.js:3804|menuResyncGrid|declaration|需要进一步测试|menuLoopParams, Math.min, Math.max, menuBgm.voices.find, Math.abs, menuRetireVoice, menuVoiceRamp, menuSpawnVoice, menuTrimFor|
|src/script/00.js:3819|menuScheduleReload|declaration|需要进一步测试|clearTimeout, setTimeout, menuBgm.uploadedKeys.delete, menuLoadBuffer, menuBgm.voices.slice().forEach, menuBgm.voices.slice, menuRetireVoice, menuVoiceRamp, menuSpawnVoice, menuTrimFor|
|src/script/00.js:3837|updateWelcomeTrackIfNeeded|declaration|需要进一步测试|getWelcomeTrackKey, menuStartOrSwitch|
|src/script/00.js:3844|renderBgmEngineConsole|declaration|需要进一步测试|document.getElementById, MENU_TRACK_KEYS.map(k =>     '<div class="trim-row">' +       '<span class="trim-name">' + MENU_TRACK_META[k].name + '</span>' +       '<input type="range" min="0" max="2" step="0.05" value="' + menuCfg.gainTrims[k] + '" oninput="menuTrimChange(\'' + k + '\', this.value)">' +       '<span class="trim-val" id="trim-val-' + k + '">' + Number(menuCfg.gainTrims[k]).toFixed(2) + '</span>' +     '</div>').join, MENU_TRACK_KEYS.map, Number(menuCfg.gainTrims[k]).toFixed, Number|
|src/script/00.js:3898|menuEnabledChange|declaration|需要进一步测试|saveMenuCfg, menuStop, menuStartOrSwitch, getMenuTrackKeyForView|
|src/script/00.js:3903|menuBpmChange|declaration|需要进一步测试|Number, saveMenuCfg, document.getElementById, menuScheduleReload|
|src/script/00.js:3908|menuMeterChange|declaration|需要进一步测试|Number, saveMenuCfg, menuResyncGrid|
|src/script/00.js:3912|menuLoopChange|declaration|需要进一步测试|Number, saveMenuCfg, menuResyncGrid|
|src/script/00.js:3916|menuTrimChange|declaration|需要进一步测试|Number, saveMenuCfg, menuBgm.voices.forEach, menuVoiceRamp, menuTrimFor, document.getElementById, Number(v).toFixed|
|src/script/00.js:3923|battleBpmChange|declaration|需要进一步测试|Number, document.getElementById, saveMenuCfg|
|src/script/00.js:3933|makeRollLoopBuffer|declaration|需要进一步测试|audioCtx.createBuffer, Math.floor, buf.getChannelData, Math.random|
|src/script/00.js:3953|startRollLoop|declaration|需要进一步测试|selectFxBuffer, makeRollLoopBuffer, audioCtx.createGain, rollLoopGain.connect, getFxOutputV2176, rollLoopGain.gain.setValueAtTime, rollLoopGain.gain.linearRampToValueAtTime, audioCtx.createBufferSource, rollLoopNode.connect, rollLoopNode.start|
|src/script/00.js:3971|stopRollLoop|declaration|需要进一步测试|cb, rollLoopGain.gain.cancelScheduledValues, rollLoopGain.gain.setValueAtTime, Math.max, rollLoopGain.gain.linearRampToValueAtTime, setTimeout, rollLoopNode.stop|
|src/script/00.js:3991|uiDbOpen|declaration|需要进一步测试|indexedDB.open, d.objectStoreNames.contains, d.createObjectStore, res|
|src/script/00.js:3996|r.onupgradeneeded|assignment|需要进一步测试|d.objectStoreNames.contains, d.createObjectStore|
|src/script/00.js:4000|r.onsuccess|assignment|需要进一步测试|res|
|src/script/00.js:4001|r.onerror|assignment|需要进一步测试|res|
|src/script/00.js:4006|uiDbReq|declaration|需要进一步测试|uiDbOpen, d.transaction, fn, tx.objectStore, res|
|src/script/00.js:4013|req.onsuccess|assignment|需要进一步测试|res|
|src/script/00.js:4014|req.onerror|assignment|需要进一步测试|res|
|src/script/00.js:4020|getWallVeil|declaration|需要进一步测试|Number, STORAGE.get, Number.isFinite, Math.max, Math.min|
|src/script/00.js:4024|applyWallpaperVeil|declaration|需要进一步测试|getWallVeil, root.style.setProperty, document.getElementById, Math.round|
|src/script/00.js:4033|applyWallpaper|declaration|需要进一步测试|URL.revokeObjectURL, URL.createObjectURL, root.style.setProperty, root.style.removeProperty, document.getElementById, applyWallpaperVeil|
|src/script/00.js:4046|compressWallpaper|declaration|需要进一步测试|createImageBitmap, URL.createObjectURL, URL.revokeObjectURL, res, rej, Math.min, Math.max, document.createElement, Math.round, canvas.getContext, ctx.fillRect, ctx.drawImage, img.close, canvas.toBlob|
|src/script/00.js:4055|im.onload|assignment|需要进一步测试|URL.revokeObjectURL, res|
|src/script/00.js:4056|im.onerror|assignment|需要进一步测试|URL.revokeObjectURL, rej|
|src/script/00.js:4072|onWallpaperFile|declaration|需要进一步测试|/^image\//.test, showToast, compressWallpaper, uiDbReq, st.put, applyWallpaper, Math.round|
|src/script/00.js:4088|resetWallpaper|declaration|需要进一步测试|uiDbReq, st.delete, applyWallpaper, showToast|
|src/script/00.js:4093|changeWallpaperVeil|declaration|需要进一步测试|STORAGE.set, Number, applyWallpaperVeil|
|src/script/00.js:4097|initWallpaper|declaration|需要进一步测试|uiDbReq, st.get, applyWallpaper|
|src/script/00.js:4115|window.hideAudioHint|assignment|需要进一步测试|document.getElementById|
|src/script/00.js:4119|window.tryAutoResumeAndPlay|assignment|需要进一步测试|getAudioContext().then(() => {       if (audioCtx && audioCtx.state === 'running' && menuCfg.enabled && bgmEngine.state === 'IDLE' && !menuBgm.active && currentView !== 'battle') {         menuStartOrSwitch(getMenuTrackKeyForView(currentView));         hideAudioHint();       }     }).catch, getAudioContext().then, getAudioContext, menuStartOrSwitch, getMenuTrackKeyForView, hideAudioHint|
|src/script/00.js:4130|window.startResumeRetry|assignment|需要进一步测试|setInterval, clearInterval, hideAudioHint, document.getElementById, tryAutoResumeAndPlay|
|src/script/00.js:4147|window.closeWelcomeModal|assignment|需要进一步测试|document.getElementById, hideClassroomWindow, hideAudioHint, startResumeRetry, tryAutoResumeAndPlay|
|src/script/00.js:4156|unlockByGesture|binding|需要进一步测试|getAudioContext().then(() => {       hideAudioHint();       const wm = document.getElementById('welcomeModal');       if (wm && wm.classList.contains('active')) return;       startResumeRetry();       if (menuCfg.enabled && bgmEngine.state === 'IDLE' && currentView !== 'battle') {         if (!menuBgm.active) menuStartOrSwitch(getMenuTrackKeyForView(currentView));       }     }).catch, getAudioContext().then, getAudioContext, hideAudioHint, document.getElementById, wm.classList.contains, startResumeRetry, menuStartOrSwitch, getMenuTrackKeyForView|
|src/script/00.js:4221|normalizeInventoryV21718|declaration|需要进一步测试|(Array.isArray(inventory)?inventory:[])     .slice(0,3)     .filter(it=>{       const key=it&&it.key;       if(!ITEM_DEFS[key] ／／ seen.has(key)) return false;       seen.add(key);       return true;     })     .map, (Array.isArray(inventory)?inventory:[])     .slice(0,3)     .filter, (Array.isArray(inventory)?inventory:[])     .slice, Array.isArray, seen.has, seen.add, Math.max, Number, Number.isFinite, Math.min, Math.trunc, Date.now, Object.keys|
|src/script/00.js:4242|ensureItemState|declaration|需要进一步测试|state.groups.forEach, Array.isArray, normalizeInventoryV21718, Number.isFinite|
|src/script/00.js:4254|ranking|declaration|需要进一步测试|state.groups.slice().sort, state.groups.slice, Number, state.groups.indexOf|
|src/script/00.js:4255|rankIndex|declaration|需要进一步测试|ranking().findIndex, ranking|
|src/script/00.js:4256|roundQuarter|declaration|需要进一步测试|Math.round, Number|
|src/script/00.js:4257|roundThird|declaration|需要进一步测试|Math.round, Number|
|src/script/00.js:4258|roundHalf|declaration|需要进一步测试|Math.round, Number|
|src/script/00.js:4259|eligibleForItems|declaration|需要进一步测试|Number|
|src/script/00.js:4260|consumeInventoryItem|declaration|需要进一步测试|g.inventory.splice|
|src/script/00.js:4261|addItemToGroup|declaration|需要进一步测试|eligibleForItems, g.inventory.push, Date.now, Math.random|
|src/script/00.js:4262|tinyDefenseToast|declaration|需要进一步测试|document.createElement, document.body.appendChild, setTimeout, d.remove|
|src/script/00.js:4264|defenseCandidates|declaration|需要进一步测试|['star','mega','bullet'].includes, out.push, ITEM_DEFENSE_KEYS.has, ['green','triple_green','horn'].includes, out.sort|
|src/script/00.js:4281|damageFraction|declaration|需要进一步测试|roundHalf, roundThird, roundQuarter, applyItemScore|
|src/script/00.js:4282|boostFraction|declaration|需要进一步测试|eligibleForItems, roundQuarter, Math.round|
|src/script/00.js:4284|itemDropWeights|declaration|需要进一步测试|put|
|src/script/00.js:4289|put|binding|需要进一步测试||
|src/script/00.js:4374|weightedPick|declaration|需要进一步测试|Object.entries(weights).filter, Object.entries, arr.reduce, Math.random|
|src/script/00.js:4375|drawItemForGroup|declaration|需要进一步测试|eligibleForItems, ranking, r.findIndex, weightedPick, itemDropWeights|
|src/script/00.js:4377|detectOvertakePunish|declaration|需要进一步测试|state.groups.find, ['star','mega'].includes, ranking().map, ranking, beforeOrder.indexOf, after.indexOf, beforeOrder.slice(afterIdx,beforeIdx).filter, beforeOrder.slice, passed.forEach, eligibleForItems, tryDefend, roundQuarter|
|src/script/00.js:4383|legacyUseItem|declaration|需要进一步测试|ensureItemState, state.groups.find, closeItemWindowForFx, eligibleForItems, showToast, ranking, r.findIndex, r.map, recordHistory, state.groups.filter, other, damageFraction, Math.floor, Math.random, [r[ri-1],r[ri+1]].filter(Boolean).forEach, [r[ri-1],r[ri+1]].filter, [r[ci-1],r[ci],r[ci+1]].filter(Boolean).forEach, [r[ci-1],r[ci],r[ci+1]].filter, flashBomb, other().sort(()=>Math.random()-.5).slice, other().sort, pool.forEach, r.slice(0,ri+1).forEach, r.slice, boostFraction, r.slice(ri).forEach, ['star','mega','power'].includes, t.inventory.splice, consumeInventoryItem, g.inventory.push, saveState, renderAll, Date.now, startBlooperClock, r.slice(0,ri).forEach, applyLightningHitV2116, detectOvertakePunish, Math.max, Number, ['mega','power'].includes|
|src/script/00.js:4389|other|binding|需要进一步测试|state.groups.filter, eligibleForItems|
|src/script/00.js:4459|flashBomb|declaration|需要进一步测试|setTimeout, document.querySelector, c.classList.add, c.classList.remove|
|src/script/00.js:4461|startBulletTimer|declaration|需要进一步测试|clearInterval, setInterval, ensureItemState, state.groups.forEach, state.groups.find, rankIndex, g.inventory.findIndex, g.inventory.splice, showToast, eligibleForItems, saveState, renderGrid, renderChart, renderDashboard|
|src/script/00.js:4462|startBlooperClock|declaration|需要进一步测试|applyBlooperMask, Date.now, setTimeout|
|src/script/00.js:4463|applyBlooperMask|declaration|需要进一步测试|Date.now, document.getElementById, v.classList.toggle, document.querySelectorAll('.row-score,.chart-score,.podium-score,.w-stat-num').forEach, document.querySelectorAll, el.classList.toggle|
|src/script/00.js:4465|globalItemDraw|declaration|需要进一步测试|ensureItemState, state.groups.filter, eligibleForItems, showToast, recordHistory, document.getElementById, ov.classList.add, state.groups.map(g=><div class="item-draw-card ${eligible.includes(g)?'':'full'}" data-draw-id="${g.id}"><div class="roulette">${eligible.includes(g)?'❔':'🔒'}</div><div class="draw-name">${escapeHtml(g.name)}</div><div class="draw-result">${eligible.includes(g)?'抽取中…':'跳过'}</div></div>).join, state.groups.map, eligible.includes, escapeHtml, setInterval, eligible.forEach, Math.floor, Math.random, grid.querySelector, itemVisual, setTimeout, clearInterval, drawItemForGroup, addItemToGroup, card.classList.add, card.querySelector, saveState, renderAll, ov.classList.remove|
|src/script/00.js:4471|openItemWindow|declaration|需要进一步测试|ensureItemState, showClassroomWindow, document.getElementById, renderItemWindow|
|src/script/00.js:4472|closeItemWindow|declaration|需要进一步测试|hideClassroomWindow, document.getElementById|
|src/script/00.js:4473|switchItemTab|declaration|需要进一步测试|renderItemWindow|
|src/script/00.js:4474|renderItemWindow|declaration|需要进一步测试|state.groups.find, closeItemWindow, ensureGroupNumbersV213, document.getElementById, document.querySelectorAll('[data-item-tab]').forEach, document.querySelectorAll, b.classList.toggle, Math.round, statusParts.push, String, Number, statusParts.join, escapeHtml, DEFAULT_COLORS.map((color,idx)=><button type="button" class="group-color-swatch-v21716 ${String(g.color).toUpperCase()===color.toUpperCase()?'selected':''}" style="--swatch:${color}" title="预设 ${idx+1} · ${color}" ${disabled} onclick="selectGroupPresetColorV21716(${g.id},'${color}')"><span>${String(g.color).toUpperCase()===color.toUpperCase()?'✓':''}</span></button>).join, DEFAULT_COLORS.map, String(g.color).toUpperCase, color.toUpperCase, g.color.toUpperCase, (g.members／／[]).join, eligibleForItems, [0,1,2].map(i=>{const it=g.inventory[i];if(!it)return '<div class="item-big empty"><div class="item-big-icon">＋</div><div class="item-big-name">空道具槽</div></div>';const d=ITEM_DEFS[it.key];return <div class="item-big"><div class="item-big-icon">${itemVisual(it.key)}</div><div class="item-big-name">${escapeHtml(d.name)}${it.charges>1?' ×'+it.charges:''}</div><div class="item-big-desc">${escapeHtml(d.desc)}</div><button class="btn btn-primary item-use" onclick="useItem(${g.id},${i})" ${canUse?'':'disabled'}>立即使用</button></div>}).join, [0,1,2].map, itemVisual, ClassroomFeedback.slotMarkup|
|src/script/00.js:4553|previewItemDetailColor|declaration|需要进一步测试|document.getElementById|
|src/script/00.js:4554|saveItemDetailColor|declaration|需要进一步测试|renderItemWindow, /^#[0-9a-f]{6}$/i.test, updateGroupColor|
|src/script/00.js:4560|saveItemGroupDetail|declaration|需要进一步测试|openPwdModal, state.groups.find, document.getElementById('groupDetailName')?.value.trim, document.getElementById, document.getElementById('groupDetailNumber')?.value.trim, showToast, /^\d+$/.test, Number, state.groups.some, Array.from, rawMembers.split(/[\n,，、]+/).map(s=>s.trim()).filter, rawMembers.split(/[\n,，、]+/).map, rawMembers.split, s.trim, JSON.stringify, recordHistory, saveState, renderAll, updatePickerPoolUI, renderItemWindow|
|src/script/00.js:4577|deleteItemDetailGroup|declaration|需要进一步测试|openPwdModal, deleteGroup, state.groups.some, closeItemWindow, document.getElementById('itemWindow')?.classList.contains, document.getElementById, renderItemWindow|
|src/script/00.js:4586|itemQuickScore|declaration|需要进一步测试|openPwdModal, applyScoreDelta, renderItemWindow|
|src/script/00.js:4587|itemCustomScore|declaration|需要进一步测试|Number, document.getElementById, Number.isFinite, itemQuickScore, Math.round|
|src/script/00.js:4589|enhanceItemCards|declaration|需要进一步测试|ensureItemState, state.groups.forEach, document.querySelector, c.classList.remove, g.inventory.find, c.classList.add, c.querySelector, document.createElement, [0,1,2].map(i=>{const it=g.inventory[i];return it?<div class="item-slot" title="${ITEM_DEFS[it.key].name}">${itemVisual(it.key)}${it.charges>1?<span class="charges">${it.charges}</span>:''}</div>:'<div class="item-slot empty">＋</div>'}).join, [0,1,2].map, itemVisual, head.parentNode.insertBefore, mb.classList.remove, ev.preventDefault, ev.stopPropagation, openItemWindow, applyBlooperMask|
|src/script/00.js:4589|mb.onclick|assignment|需要进一步测试|ev.preventDefault, ev.stopPropagation, openItemWindow|
|src/script/00.js:4592|legacyJudgeRound|assignment|需要进一步测试|ranking().map, ranking, state.groups.map, _itemBaseJudgeRound, answered.forEach, state.groups.find, eligibleForItems, r.findIndex, g.inventory.findIndex, g.inventory.splice, detectOvertakePunish, saveState, renderAll|
|src/script/00.js:4605|ensureV2State|declaration|需要进一步测试|ensureItemState, STORAGE.getJSON|
|src/script/00.js:4615|itemVisual|declaration|需要进一步测试|ensureV2State, Reliability.safeImage, escapeHtml|
|src/script/00.js:4621|itemBoxVisualV2121|declaration|需要进一步测试||
|src/script/00.js:4624|setPickerInfoTab|declaration|需要进一步测试|document.getElementById('pickerStatsBtn')?.classList.toggle, document.getElementById, document.getElementById('pickerHistoryBtn')?.classList.toggle, renderPickerInfo|
|src/script/00.js:4625|renderPickerInfo|declaration|需要进一步测试|ensureV2State, document.getElementById, state.groups.reduce, arr.slice(-30).reverse().map(x=><div class="picker-log">${escapeHtml(x.text)}<br><small>${new Date(x.time).toLocaleTimeString()}</small></div>).join, arr.slice(-30).reverse().map, arr.slice(-30).reverse, arr.slice, escapeHtml, new Date(x.time).toLocaleTimeString|
|src/script/00.js:4634|openPickerModal|assignment|需要进一步测试|ensureV2State, _v2OpenPicker, setPickerInfoTab, syncPickerScoreTarget|
|src/script/00.js:4635|syncPickerScoreTarget|declaration|需要进一步测试|document.getElementById, escapeHtml|
|src/script/00.js:4636|pickerTargetGroup|declaration|需要进一步测试||
|src/script/00.js:4637|scorePickerTarget|declaration|需要进一步测试|pickerTargetGroup, showToast, applyScoreDelta, syncPickerScoreTarget|
|src/script/00.js:4638|scorePickerCustom|declaration|需要进一步测试|Math.round, Number, document.getElementById, Number.isFinite, scorePickerTarget|
|src/script/00.js:4639|stopSlotSpin|assignment|需要进一步测试|_v2StopSlot, ensureV2State, state.itemGlobal.pickerHistory.push, Date.now, state.itemGlobal.pickerHistory.shift, saveState, syncPickerScoreTarget, renderPickerInfo|
|src/script/00.js:4642|openHandRaise|declaration|需要进一步测试|ensureV2State, showClassroomWindow, document.getElementById, renderHandRaise|
|src/script/00.js:4643|closeHandRaise|declaration|需要进一步测试|hideClassroomWindow, document.getElementById|
|src/script/00.js:4644|renderHandRaise|declaration|需要进一步测试|document.getElementById, state.groups.map(g=><button class="hand-group ${g.id===handRaiseGroupId?'selected':''}" onclick="selectHandGroup(${g.id})">${escapeHtml(g.name)}<br><small>${g.score} 分</small></button>).join, state.groups.map, escapeHtml|
|src/script/00.js:4645|selectHandGroup|declaration|需要进一步测试|renderHandRaise, document.querySelectorAll('.hand-group').forEach, document.querySelectorAll, b.classList.remove, state.groups.findIndex, arr[idx].classList.add|
|src/script/00.js:4646|judgeHandRaise|declaration|需要进一步测试|ensureV2State, state.groups.find, showToast, recordHistory, state.itemGlobal.handRaiseHistory.push, Date.now, saveState, renderAll, document.getElementById, ClassroomFeedback.slotMarkup|
|src/script/00.js:4653|handQuickScore|declaration|需要进一步测试|applyScoreDelta|
|src/script/00.js:4654|handDrawItem|declaration|需要进一步测试|state.groups.find, eligibleForItems, showToast, recordHistory, drawItemForGroup, addItemToGroup, saveState, renderAll|
|src/script/00.js:4655|handUseItem|declaration|需要进一步测试|state.groups.find, showToast, closeHandRaise, openItemWindow|
|src/script/00.js:4658|globalItemDraw|assignment|需要进一步测试|ensureV2State, state.groups.filter, eligibleForItems, showToast, document.getElementById('view-battle')?.classList.contains, document.getElementById, switchView, recordHistory, renderGrid, eligible.forEach, document.querySelector, c.classList.add, document.createElement, c.appendChild, overlays.set, setInterval, overlays.get, ranking, r.findIndex, weightedPick, itemDropWeights, o.querySelector, itemVisual, setTimeout, clearInterval, drawItemForGroup, addItemToGroup, o.classList.add, saveState, c.classList.remove, c.querySelector('.card-item-roulette')?.remove, c.querySelector, renderAll|
|src/script/00.js:4672|openItemEncyclopedia|declaration|需要进一步测试|switchView, setTimeout, installSettingsTabs, showSettingsV2|
|src/script/00.js:4673|renderItemEncyclopedia|declaration|需要进一步测试|ensureV2State, document.getElementById, ITEM_KEYS.map(k=>{const d=ITEM_DEFS[k];return <div class="ency-card"><div class="ency-icon">${itemVisual(k)}</div><div><div class="ency-name">${d.name}</div><div class="ency-desc">${d.desc}</div></div><div class="ency-actions"><button class="btn btn-sm btn-primary" onclick="chooseItemIcon('${k}')">上传图片</button><button class="btn btn-sm" onclick="resetItemIcon('${k}')">恢复默认</button></div></div>}).join, ITEM_KEYS.map, itemVisual|
|src/script/00.js:4677|chooseItemIcon|declaration|需要进一步测试|document.getElementById, document.getElementById('itemIconInput').click|
|src/script/00.js:4678|handleItemIconUpload|declaration|需要进一步测试|ensureV2State, STORAGE.setJSON, saveState, renderItemEncyclopedia, renderAll, showToast, rd.readAsDataURL|
|src/script/00.js:4678|rd.onload|assignment|需要进一步测试|ensureV2State, STORAGE.setJSON, saveState, renderItemEncyclopedia, renderAll, showToast|
|src/script/00.js:4679|resetItemIcon|declaration|需要进一步测试|ensureV2State, STORAGE.setJSON, saveState, renderItemEncyclopedia, renderAll|
|src/script/00.js:4680|resetAllItemIcons|declaration|需要进一步测试|ensureV2State, STORAGE.setJSON, saveState, renderItemEncyclopedia, renderAll|
|src/script/00.js:4681|exportItemIconPack|declaration|需要进一步测试|ensureV2State, JSON.stringify, document.createElement, URL.createObjectURL, a.click, setTimeout, URL.revokeObjectURL|
|src/script/00.js:4682|importItemIconPack|declaration|需要进一步测试|JSON.parse, ensureV2State, STORAGE.setJSON, saveState, renderItemEncyclopedia, renderAll, showToast, themeAlert, rd.readAsText|
|src/script/00.js:4682|rd.onload|assignment|需要进一步测试|JSON.parse, ensureV2State, STORAGE.setJSON, saveState, renderItemEncyclopedia, renderAll, showToast, themeAlert|
|src/script/00.js:4685|installSettingsTabs|declaration|需要进一步测试|document.querySelector, document.getElementById, document.createElement, sc.prepend, sc.appendChild, renderItemEncyclopedia|
|src/script/00.js:4691|showSettingsV2|declaration|需要进一步测试|installSettingsTabs, document.querySelectorAll('#settingsV2Tabs button').forEach, document.querySelectorAll, b.classList.toggle, document.querySelector, document.getElementById, [...sc.children].forEach, item.classList.toggle, renderItemEncyclopedia, sc.querySelectorAll, titles[0]?.scrollIntoView|
|src/script/00.js:4700|openAbout|declaration|需要进一步测试|showClassroomWindow, document.getElementById, renderAbout|
|src/script/00.js:4701|closeAbout|declaration|需要进一步测试|hideClassroomWindow, document.getElementById|
|src/script/00.js:4702|renderAbout|declaration|需要进一步测试|document.querySelectorAll('[data-about]').forEach, document.querySelectorAll, b.classList.toggle, document.getElementById, ITEM_KEYS.map(k=><div class="guide-block"><b>${itemVisual(k)} ${ITEM_DEFS[k].name}</b><br>${ITEM_DEFS[k].desc}</div>).join, ITEM_KEYS.map, itemVisual|
|src/script/00.js:4710|renderItemWindow|assignment|需要进一步测试|_v2RenderItemWindow, state.groups.find, document.getElementById, document.createElement, ITEM_KEYS.map(k=><button class="btn btn-sm" onclick="godAddItem(${g.id},'${k}')">${itemVisual(k)} ${ITEM_DEFS[k].name}</button>).join, ITEM_KEYS.map, itemVisual, body.appendChild|
|src/script/00.js:4711|godAddItem|declaration|需要进一步测试|state.groups.find, showToast, recordHistory, g.inventory.push, Date.now, Math.random, saveState, renderAll, renderItemWindow|
|src/script/00.js:4712|godClearItems|declaration|需要进一步测试|state.groups.find, recordHistory, saveState, renderAll, renderItemWindow|
|src/script/00.js:4715|enhanceItemCards|assignment|需要进一步测试|_v2Enhance, ensureV2State, state.groups.forEach, document.querySelector, c.querySelectorAll('.item-slot').forEach, c.querySelectorAll, s.querySelector, itemVisual|
|src/script/00.js:4716|renderItemWindow|assignment|需要进一步测试|_v2RenderItemWindowIcons, state.groups.find, document.querySelectorAll('#itemWindowBody .item-big-icon').forEach, document.querySelectorAll, itemVisual|
|src/script/00.js:4719|legacyJudgeRound|assignment|需要进一步测试|_v2Judge, ensureV2State, saveState|
|src/script/00.js:4724|switchView|assignment|需要进一步测试|_v2SwitchView, setTimeout|
|src/script/00.js:4731|cancelHandItemDraw|declaration|需要进一步测试|clearInterval, clearTimeout, showToast|
|src/script/00.js:4740|closeHandRaise|assignment|需要进一步测试|cancelHandItemDraw, _v21CloseHandRaise|
|src/script/00.js:4743|selectHandGroup|assignment|需要进一步测试|showToast, _v21SelectHandGroup|
|src/script/00.js:4749|judgeHandRaise|assignment|需要进一步测试|cancelHandItemDraw, _v21JudgeHandRaise, state.groups.find, [...document.querySelectorAll('#handRewardBox button')].find, document.querySelectorAll, b.textContent.includes, eligibleForItems|
|src/script/00.js:4762|handDrawItem|assignment|需要进一步测试|ensureV2State, state.groups.find, eligibleForItems, showToast, Date.now, document.getElementById, escapeHtml, ranking, r.findIndex, weightedPick, itemDropWeights, itemVisual, Math.min, tick, setInterval, setTimeout, clearInterval, cancelHandItemDraw, renderHandRaise, recordHistory, addItemToGroup, saveState, renderAll, live.inventory.findIndex, Math.max, live.inventory.filter(y=>y.key===k).map, live.inventory.filter|
|src/script/00.js:4780|tick|binding|需要进一步测试|state.groups.find, ranking, r.findIndex, weightedPick, itemDropWeights, document.getElementById, itemVisual, Math.min, Date.now|
|src/script/00.js:4817|finishHandItemReward|declaration|需要进一步测试|document.getElementById|
|src/script/00.js:4823|handUseNewItem|declaration|需要进一步测试|state.groups.find, showToast, g.inventory.map(x=>x.key).lastIndexOf, g.inventory.map, closeHandRaise, openItemWindow, setTimeout, document.querySelectorAll, cards[idx].scrollIntoView|
|src/script/00.js:4840|showItemUseFx|declaration|需要进一步测试||
|src/script/00.js:4841|itemFxTargetText|declaration|需要进一步测试|ranking, r.findIndex, names.includes, names.push, ['red','triple_red'].includes, add, ['banana','triple_banana'].includes, r.slice(0,Math.max(0,i)).forEach, r.slice, Math.max, r.slice(i+1).forEach, ['coin','mushroom','triple_mushroom','star','mega','bullet','power'].includes, names.join|
|src/script/00.js:4843|add|binding|需要进一步测试|names.includes, names.push|
|src/script/00.js:4854|closeItemWindowForFx|declaration|需要进一步测试|closeItemWindow|
|src/script/00.js:4859|legacyUseItem|assignment|需要进一步测试|state.groups.find, JSON.stringify, useItemBeforeVisualDispatch.call, closeItemWindowForFx, setTimeout, showItemUseFx, itemFxTargetText|
|src/script/00.js:4877|normalizeItemIconFile|declaration|需要进一步测试|document.createElement, canvas.getContext, ctx.clearRect, Math.min, Math.max, ctx.drawImage, done, canvas.toDataURL, reader.readAsDataURL|
|src/script/00.js:4879|reader.onload|assignment|需要进一步测试|document.createElement, canvas.getContext, ctx.clearRect, Math.min, Math.max, ctx.drawImage, done, canvas.toDataURL|
|src/script/00.js:4881|img.onload|assignment|需要进一步测试|document.createElement, canvas.getContext, ctx.clearRect, Math.min, Math.max, ctx.drawImage, done, canvas.toDataURL|
|src/script/00.js:4891|img.onerror|assignment|需要进一步测试|done|
|src/script/00.js:4896|handleItemIconUpload|assignment|需要进一步测试|normalizeItemIconFile, ensureV2State, STORAGE.setJSON, saveState, renderItemEncyclopedia, renderAll, showToast|
|src/script/00.js:4906|updateCardRouletteVisual|declaration|需要进一步测试|o.querySelector, icon.classList.remove, itemVisual, icon.classList.add|
|src/script/00.js:4918|globalItemDraw|assignment|需要进一步测试|ensureV2State, state.groups.filter, eligibleForItems, showToast, document.getElementById('view-battle')?.classList.contains, document.getElementById, switchView, recordHistory, renderGrid, performance.now, eligible.forEach, document.querySelector, c.classList.add, document.createElement, c.appendChild, overlays.set, Math.min, Math.pow, lastUpdate.get, lastUpdate.set, ranking, r.findIndex, weightedPick, itemDropWeights, currentKey.set, updateCardRouletteVisual, overlays.get, requestAnimationFrame, addItemToGroup, o.classList.add, o.querySelector, saveState, setTimeout, c.querySelector, c.classList.remove, c.querySelector('.card-item-roulette')?.remove, renderAll|
|src/script/00.js:4935|frame|declaration|需要进一步测试|Math.min, Math.pow, eligible.forEach, lastUpdate.get, lastUpdate.set, ranking, r.findIndex, weightedPick, itemDropWeights, currentKey.set, updateCardRouletteVisual, overlays.get, requestAnimationFrame, addItemToGroup, o.classList.add, o.querySelector, saveState, setTimeout, document.querySelector, c.querySelector, c.classList.remove, c.querySelector('.card-item-roulette')?.remove, renderAll|
|src/script/00.js:4972|handDrawItem|assignment|需要进一步测试|ensureV2State, state.groups.find, eligibleForItems, showToast, performance.now, document.getElementById, escapeHtml, Math.min, Math.pow, ranking, r.findIndex, weightedPick, itemDropWeights, itemVisual, cap.animate, requestAnimationFrame, cancelHandItemDraw, renderHandRaise, recordHistory, addItemToGroup, saveState, renderAll, live.inventory.findIndex, Math.max|
|src/script/00.js:4990|frame|declaration|需要进一步测试|Math.min, Math.pow, document.getElementById, state.groups.find, ranking, r.findIndex, weightedPick, itemDropWeights, itemVisual, cap.animate, requestAnimationFrame, eligibleForItems, cancelHandItemDraw, showToast, renderHandRaise, recordHistory, addItemToGroup, saveState, renderAll, live.inventory.findIndex, escapeHtml, Math.max|
|src/script/00.js:5022|cancelHandItemDraw|assignment|需要进一步测试|clearTimeout, showToast|
|src/script/00.js:5048|battleCard|declaration|需要进一步测试|document.querySelector|
|src/script/00.js:5049|clearCardFx|declaration|需要进一步测试|[...card.classList].filter(x=>x.startsWith('cfx-')／／['card-use-fx','card-hit-fx','card-defend-fx','card-heal-fx'].includes(x)).forEach, [...card.classList].filter, x.startsWith, ['card-use-fx','card-hit-fx','card-defend-fx','card-heal-fx'].includes, card.classList.remove, card.querySelectorAll('.card-fx-badge').forEach, card.querySelectorAll, x.remove, card.style.removeProperty|
|src/script/00.js:5055|playCasterCardFx|declaration|需要进一步测试|DesktopUI.getPreferences, battleCard, clearCardFx, card.classList.add, document.createElement, itemVisual, escapeHtml, card.appendChild, setTimeout, card.classList.remove, b.remove|
|src/script/00.js:5065|playTargetCardFx|declaration|需要进一步测试|DesktopUI.visualEvent, DesktopUI.getPreferences, battleCard, card.classList.remove, card.style.setProperty, card.classList.add, setTimeout, card.style.removeProperty|
|src/script/00.js:5074|cardFxTargets|declaration|需要进一步测试|ranking, r.findIndex, ids.includes, ids.push, ['red_shell','triple_red','boo'].includes, add, ['banana','triple_banana'].includes, r.slice(0,Math.max(0,i)).forEach, r.slice, Math.max, r.slice(i+1).forEach|
|src/script/00.js:5075|add|binding|需要进一步测试|ids.includes, ids.push|
|src/script/00.js:5088|showItemUseFx|assignment|需要进一步测试|playCasterCardFx, cardFxTargets, ['coin_shell','question_block'].includes, targets.forEach, setTimeout, playTargetCardFx, console.warn, _v25ShowItemUseFx|
|src/script/00.js:5123|removeBgmEngineeringConsoleV26|declaration|需要进一步测试|document.getElementById('bgmEngineConsole')?.remove, document.getElementById, document.querySelectorAll('#view-settings .setting-section-title').forEach, document.querySelectorAll, x.textContent.includes, x.remove|
|src/script/00.js:5142|renderItemFxSoundListV26|declaration|需要进一步测试|document.getElementById, ITEM_FX_SOUND_SLOTS.filter(s=>!GENERIC_ITEM_USE_SOUNDS_V2174.has(s.id)).map(s=>{    const custom=!!customFxBuffers[s.id]／／hasSound('fx_'+s.id);    return <div class="sound-row"><div class="sound-desc"><div class="sound-name">${s.name}</div><div class="sound-tag">${custom?'已载入自定义音频':s.desc}</div></div><div class="sound-controls"><button class="btn btn-sm" onclick="playSound('${s.id}')">试听</button><button class="btn btn-sm btn-primary" onclick="triggerUploadAudio('fx_${s.id}')">上传</button>${custom?<button class="btn btn-sm btn-danger" onclick="deleteFxTrack('fx_${s.id}','${s.id}');setTimeout(renderItemFxSoundListV26,100)">还原</button>:''}</div></div>  }).join, ITEM_FX_SOUND_SLOTS.filter(s=>!GENERIC_ITEM_USE_SOUNDS_V2174.has(s.id)).map, ITEM_FX_SOUND_SLOTS.filter, GENERIC_ITEM_USE_SOUNDS_V2174.has, hasSound|
|src/script/00.js:5149|itemSoundCategoryV26|declaration|需要进一步测试|['green','triple_green','red','triple_red','spiny','banana','triple_banana','horn','bomb','hammer','lightning'].includes, ['coin','coin_shell','question','mushroom','triple_mushroom'].includes|
|src/script/00.js:5156|showItemUseFx|assignment|需要进一步测试|playSound, setTimeout, itemSoundCategoryV26, _v26ShowItemUseFx|
|src/script/00.js:5158|tinyDefenseToast|assignment|需要进一步测试|playSound, _v26TinyDefense|
|src/script/00.js:5159|startDrawSoundBedV26|declaration|需要进一步测试|playSound, setInterval, clearInterval, Math.max, setTimeout|
|src/script/00.js:5164|globalItemDraw|assignment|需要进一步测试|startDrawSoundBedV26, _v26GlobalDraw|
|src/script/00.js:5165|handDrawItem|assignment|需要进一步测试|startDrawSoundBedV26, _v26HandDraw|
|src/script/00.js:5178|uiIconsV26|declaration|需要进一步测试|STORAGE.getJSON|
|src/script/00.js:5179|applyUiIconsV26|declaration|需要进一步测试|uiIconsV26, UI_ICON_TARGETS.forEach, document.querySelector, Reliability.safeImage, document.createElement, template.content.querySelector('svg,.custom-ui-icon')?.remove, template.content.querySelector, template.innerHTML.trim, escapeHtml, el.setAttribute|
|src/script/00.js:5195|chooseUiIconV26|declaration|需要进一步测试|document.getElementById, f.click|
|src/script/00.js:5196|handleUiIconV26|declaration|需要进一步测试|normalizeItemIconFile, uiIconsV26, STORAGE.setJSON, applyUiIconsV26, renderUiIconManagerV26|
|src/script/00.js:5200|resetUiIconV26|declaration|需要进一步测试|uiIconsV26, STORAGE.setJSON, applyUiIconsV26, renderUiIconManagerV26|
|src/script/00.js:5201|renderUiIconManagerV26|declaration|需要进一步测试|document.getElementById, uiIconsV26, UI_ICON_TARGETS.map(([id,label,,fallback])=><div class="icon-custom-card"><div class="icon-preview">${m[id]?<img src="${m[id]}">:fallback}</div><div style="flex:1"><b>${label}</b><div style="font-size:11px;color:#64748b">支持 PNG / JPG / WebP</div></div><button class="btn btn-sm btn-primary" onclick="chooseUiIconV26('${id}')">上传</button>${m[id]?<button class="btn btn-sm" onclick="resetUiIconV26('${id}')">还原</button>:''}</div>).join, UI_ICON_TARGETS.map|
|src/script/00.js:5207|rebuildSettingsV26|declaration|需要进一步测试|document.querySelector, document.getElementById, removeBgmEngineeringConsoleV26, document.getElementById('settingsV2Tabs')?.remove, document.getElementById('v2ItemPane')?.remove, document.createElement, Object.entries(panes).forEach, Object.entries, original.forEach, txt.includes, panes[mode].appendChild, sc.append, panes.function.appendChild, panes.items.appendChild, panes.sound.appendChild, document.body.appendChild, installCommunismModeSetting, renderUiIconManagerV26, renderItemEncyclopedia, renderItemFxSoundListV26, showSettingsV26|
|src/script/00.js:5233|showSettingsV26|declaration|需要进一步测试|document.getElementById, DesktopUI.selectSettings, document.querySelectorAll('.settings-v26-pane').forEach, document.querySelectorAll, p.classList.toggle, document.querySelectorAll('#settingsV26Tabs button').forEach, b.classList.toggle, document.querySelector, renderBgmSlotList, renderFxSlotList, renderItemFxSoundListV26, renderItemEncyclopedia, installCommunismModeSetting, renderUiIconManagerV26|
|src/script/00.js:5243|installSettingsTabs|assignment|需要进一步测试|rebuildSettingsV26|
|src/script/00.js:5244|showSettingsV2|assignment|需要进一步测试|showSettingsV26|
|src/script/00.js:5255|syncVisualViewportV27|declaration|需要进一步测试|document.documentElement.style.setProperty|
|src/script/00.js:5272|repairPersistentItemsV28|declaration|需要进一步测试|ensureItemState, state.groups.forEach, normalizeInventoryV21718, saveState|
|src/script/00.js:5282|programConfirmV28|declaration|需要进一步测试|document.getElementById, previous?.querySelector('#pcCancelV28')?.click, previous?.querySelector, DesktopUI.finishWindowClose, document.createElement, escapeHtml, escapeHtml(message).replace, document.body.appendChild, document.removeEventListener, hideClassroomWindow, o.remove, resolve, o.querySelector, finish, o.addEventListener, document.addEventListener|
|src/script/00.js:5302|finish|binding|需要进一步测试|document.removeEventListener, hideClassroomWindow, o.remove, resolve|
|src/script/00.js:5303|o.querySelector('#pcCancelV28').onclick|assignment|需要进一步测试|finish|
|src/script/00.js:5304|o.querySelector('#pcOkV28').onclick|assignment|需要进一步测试|finish|
|src/script/00.js:5306|key|binding|需要进一步测试|document.removeEventListener, finish|
|src/script/00.js:5312|setCorrectAns|assignment|需要进一步测试|playSound, renderControls, state.groups.filter, unanswered.map(g=>g.name).join, unanswered.map, programConfirmV28|
|src/script/00.js:5342|heldItemKeysV281|declaration|需要进一步测试|(g?.inventory／／[]).map(it=>it?.key).filter, (g?.inventory／／[]).map|
|src/script/00.js:5345|weightedPickNoRepeatV281|declaration|需要进一步测试|Object.entries(weights／／{}).forEach, Object.entries, Number, blocked.has, Object.keys, weightedPick|
|src/script/00.js:5354|pickItemForGroupV281|declaration|需要进一步测试|ranking, Math.max, r.findIndex, itemDropWeights, heldItemKeysV281, weightedPickNoRepeatV281, weightedPick|
|src/script/00.js:5369|globalItemDraw|assignment|需要进一步测试|ensureV2State, state.groups.filter, eligibleForItems, showToast, document.getElementById('view-battle')?.classList.contains, document.getElementById, switchView, recordHistory, renderGrid, performance.now, eligible.forEach, document.querySelector, c.classList.add, document.createElement, c.appendChild, overlays.set, Math.min, Math.pow, lastUpdate.get, lastUpdate.set, pickItemForGroupV281, updateCardRouletteVisual, overlays.get, requestAnimationFrame, addItemToGroup, batchUsed.add, o.classList.add, o.querySelector, saveState, setTimeout, c.querySelector, c.classList.remove, c.querySelector('.card-item-roulette')?.remove, renderAll|
|src/script/00.js:5386|frame|declaration|需要进一步测试|Math.min, Math.pow, eligible.forEach, lastUpdate.get, lastUpdate.set, pickItemForGroupV281, updateCardRouletteVisual, overlays.get, requestAnimationFrame, addItemToGroup, batchUsed.add, o.classList.add, o.querySelector, saveState, setTimeout, document.querySelector, c.querySelector, c.classList.remove, c.querySelector('.card-item-roulette')?.remove, renderAll|
|src/script/00.js:5428|handDrawItem|assignment|需要进一步测试|ensureV2State, state.groups.find, eligibleForItems, showToast, performance.now, document.getElementById, escapeHtml, Math.min, Math.pow, pickItemForGroupV281, itemVisual, cap.animate, requestAnimationFrame, cancelHandItemDraw, renderHandRaise, recordHistory, addItemToGroup, saveState, renderAll|
|src/script/00.js:5444|frame|declaration|需要进一步测试|Math.min, Math.pow, document.getElementById, state.groups.find, pickItemForGroupV281, itemVisual, cap.animate, requestAnimationFrame, eligibleForItems, cancelHandItemDraw, showToast, renderHandRaise, recordHistory, addItemToGroup, saveState, renderAll, escapeHtml|
|src/script/00.js:5495|v282RandomOther|declaration|需要进一步测试|state.groups.filter, Number, Math.floor, Math.random|
|src/script/00.js:5499|v282TakeFraction|declaration|需要进一步测试|Number, Math.round, Math.max, applyItemAttack|
|src/script/00.js:5509|v282Consume|declaration|需要进一步测试|Math.max, Number, g.inventory.splice|
|src/script/00.js:5517|legacyUseItem|assignment|需要进一步测试|state.groups.find, ['feather','fire_flower','ice_flower','boomerang_flower'].includes, _v282UseItem.call, Number, showToast, recordHistory, g.inventory.splice, saveState, renderAll, showItemUseFx, v282RandomOther, v282TakeFraction, v282Consume, ranking, r.findIndex, [r[p-1],r[p+1]].filter, targets.forEach, targets.map(x=>x.name).join, targets.map|
|src/script/00.js:5559|roulettePreviewPickV282|declaration|需要进一步测试|Object.keys, Math.floor, Math.random|
|src/script/00.js:5563|updateAllRoulettePreviewLogicV282|declaration|需要进一步测试|roulettePreviewPickV282|
|src/script/00.js:5569|globalItemDraw|assignment|需要进一步测试|ensureV2State, state.groups.filter, eligibleForItems, showToast, document.getElementById('view-battle')?.classList.contains, document.getElementById, switchView, recordHistory, renderGrid, performance.now, eligible.forEach, document.querySelector, c.classList.add, document.createElement, c.appendChild, overlays.set, Math.min, Math.pow, lastUpdate.get, lastUpdate.set, updateCardRouletteVisual, overlays.get, roulettePreviewPickV282, requestAnimationFrame, pickItemForGroupV281, addItemToGroup, batchUsed.add, o.classList.add, o.querySelector, saveState, setTimeout, c.querySelector, c.classList.remove, c.querySelector('.card-item-roulette')?.remove, renderAll|
|src/script/00.js:5585|frame|declaration|需要进一步测试|Math.min, Math.pow, eligible.forEach, lastUpdate.get, lastUpdate.set, updateCardRouletteVisual, overlays.get, roulettePreviewPickV282, requestAnimationFrame, pickItemForGroupV281, addItemToGroup, batchUsed.add, o.classList.add, o.querySelector, saveState, setTimeout, document.querySelector, c.querySelector, c.classList.remove, c.querySelector('.card-item-roulette')?.remove, renderAll|
|src/script/00.js:5618|handDrawItem|assignment|需要进一步测试|ensureV2State, state.groups.find, eligibleForItems, showToast, performance.now, document.getElementById, escapeHtml, Math.min, Math.pow, roulettePreviewPickV282, itemVisual, cap.animate, requestAnimationFrame, cancelHandItemDraw, renderHandRaise, pickItemForGroupV281, recordHistory, addItemToGroup, saveState, renderAll|
|src/script/00.js:5632|frame|declaration|需要进一步测试|Math.min, Math.pow, document.getElementById, roulettePreviewPickV282, itemVisual, cap.animate, requestAnimationFrame, state.groups.find, eligibleForItems, cancelHandItemDraw, showToast, renderHandRaise, pickItemForGroupV281, recordHistory, addItemToGroup, saveState, renderAll, escapeHtml|
|src/script/00.js:5663|legacyUseItem|assignment|需要进一步测试|state.groups.find, closeItemWindowForFx, Object.values(g.itemEffect).some, Object.values, saveState, renderAll, showToast, _v282UseItemWithIce.call|
|src/script/00.js:5688|itemKeysV283|declaration|需要进一步测试|ITEM_ORDER_V283.filter|
|src/script/00.js:5690|itemAdminButtonV283|declaration|需要进一步测试|itemVisual, escapeHtml|
|src/script/00.js:5694|godAddItemV283|declaration|需要进一步测试|state.groups.find, showToast, Number, recordHistory, addItemToGroup, saveState, renderAll, renderGroupModalV283|
|src/script/00.js:5703|renderGodItemManagerV283|declaration|需要进一步测试|state.groups.find, document.querySelectorAll, roots.find, x.closest, document.querySelector, document.createElement, tactical.appendChild, itemKeysV283().map(k=>itemAdminButtonV283(k,gid)).join, itemKeysV283().map, itemKeysV283, itemAdminButtonV283|
|src/script/00.js:5716|patchVisibleGodManagerV283|declaration|需要进一步测试|document.querySelectorAll, all.find, /上帝模式.*强制道具管理/.test, document.createElement, title.insertAdjacentElement, itemKeysV283().map(k=>itemAdminButtonV283(k,gid)).join, itemKeysV283().map, itemKeysV283, itemAdminButtonV283|
|src/script/00.js:5728|renderEncyclopediaV283|declaration|需要进一步测试|document.querySelectorAll, headings.find, /22\s*种道具百科／26\s*种道具百科/.test, candidates.indexOf, candidates.slice(start).filter, candidates.slice, x.matches, x.querySelector, cards.forEach, x.remove, itemKeysV283().forEach, itemKeysV283, document.createElement, itemVisual, escapeHtml, parent.appendChild, itemKeysV283().map(k=>{      const d=ITEM_DEFS[k];      return <div class="guide-block encyclopedia-item"><b>${itemVisual(k)} ${escapeHtml(d.name)}</b><br>${escapeHtml(d.desc／／'')}</div>;    }).join, itemKeysV283().map|
|src/script/00.js:5757|appendMissingEncyclopediaV283|declaration|需要进一步测试|document.querySelectorAll('h1,h2,h3').forEach, document.querySelectorAll, /22\s*种道具百科/.test, document.querySelector, [...about.querySelectorAll('h1,h2,h3')].find, about.querySelectorAll, /26\s*种道具百科/.test, ['feather','fire_flower','ice_flower','boomerang_flower'].forEach, (parent.innerText／／'').includes, document.createElement, itemVisual, escapeHtml, parent.appendChild|
|src/script/00.js:5774|patchItemIconSettingsV283|declaration|需要进一步测试|document.querySelector, [...setting.querySelectorAll('*')].filter, setting.querySelectorAll, /道具.*图标／自定义道具/.test, ['feather','fire_flower','ice_flower','boomerang_flower'].forEach, txt.includes, document.createElement, itemVisual, escapeHtml, region.appendChild|
|src/script/00.js:5792|renderGroupModalV283|declaration|需要进一步测试|setTimeout, patchVisibleGodManagerV283|
|src/script/00.js:5797|openGroupModal|assignment|需要进一步测试|_v283OpenGroupModal.call, renderGroupModalV283|
|src/script/00.js:5801|renderGroupModal|assignment|需要进一步测试|_v283RenderGroupModal.apply, renderGroupModalV283|
|src/script/00.js:5806|openAboutModal|assignment|需要进一步测试|_v283OpenAbout.apply, setTimeout, appendMissingEncyclopediaV283|
|src/script/00.js:5814|refresh26ItemInterfacesV284|declaration|需要进一步测试|Object.keys, document.querySelectorAll('.v283-added').forEach, document.querySelectorAll, x.remove, document.querySelectorAll('.setting-section-title,h1,h2,h3').forEach, /22\s*种道具百科/.test, (x.textContent／／'').replace, /22\s*种道具百科与图标管理/.test, renderItemEncyclopedia, document.getElementById('itemWindow')?.classList.contains, document.getElementById, renderItemWindow|
|src/script/00.js:5832|appendMissingEncyclopediaV283|assignment|需要进一步测试||
|src/script/00.js:5833|patchItemIconSettingsV283|assignment|需要进一步测试||
|src/script/00.js:5836|patchVisibleGodManagerV283|assignment|需要进一步测试||
|src/script/00.js:5837|renderGroupModalV283|assignment|需要进一步测试||
|src/script/00.js:5843|renderAbout|assignment|需要进一步测试|_v284RenderAbout, document.getElementById, m.querySelectorAll('h1,h2,h3').forEach, m.querySelectorAll, h.textContent.replace, ['feather','fire_flower','ice_flower','boomerang_flower'].forEach, txt.includes, document.createElement, itemVisual, escapeHtml, m.appendChild|
|src/script/00.js:5868|isCommunismMode|declaration|需要进一步测试|STORAGE.getJSON|
|src/script/00.js:5871|setCommunismMode|declaration|需要进一步测试|STORAGE.setJSON, applyCommunismMode, showToast|
|src/script/00.js:5876|applyCommunismMode|declaration|需要进一步测试|isCommunismMode, document.body.classList.toggle, document.querySelectorAll('button,[role="button"],.dock-btn,.nav-btn').forEach, document.querySelectorAll, (el.textContent／／'').trim, el.getAttribute, /道具抽取／抽取道具／道具百科／道具与图标/.test, /globalItemDraw／openItemEncyclopedia/.test, document.getElementById('itemWindow')?.classList.remove, document.getElementById, document.getElementById('itemBackdrop')?.classList.remove|
|src/script/00.js:5901|globalItemDraw|assignment|需要进一步测试|isCommunismMode, showToast, _v291GlobalItemDraw.apply|
|src/script/00.js:5906|legacyUseItem|assignment|需要进一步测试|isCommunismMode, showToast, _v291UseItem.apply|
|src/script/00.js:5912|openItemWindow|assignment|需要进一步测试|isCommunismMode, showToast, _v291OpenItemWindow.apply|
|src/script/00.js:5919|installCommunismModeSetting|declaration|需要进一步测试|document.getElementById, document.createElement, pane.prepend, card.querySelector, isCommunismMode|
|src/script/00.js:5948|formatChartScoreV294|declaration|需要进一步测试|Number, Math.abs, String, Math.trunc, Math.round, v.toFixed(v>=10?1:2).replace, v.toFixed|
|src/script/00.js:5975|activePersistentEffect|declaration|需要进一步测试||
|src/script/00.js:5985|legacyUseItem|assignment|需要进一步测试|ensureItemState, state.groups.find, previousUseItemV299.call, activePersistentEffect, closeItemWindowForFx, showToast|
|src/script/00.js:6026|cleanEmptyEffectV2113|declaration|需要进一步测试|Object.keys|
|src/script/00.js:6034|consumeChargeV2113|declaration|需要进一步测试|Math.max, Number, g.inventory.splice|
|src/script/00.js:6041|randomTargetV2113|declaration|需要进一步测试|state.groups.filter, eligibleForItems, Math.floor, Math.random|
|src/script/00.js:6046|attackFractionV2113|declaration|需要进一步测试|eligibleForItems, Math.round, Math.max, Number, applyItemScore|
|src/script/00.js:6053|legacyUseItem|assignment|需要进一步测试|state.groups.find, EXT.has, previousUseItemV2113.call, closeItemWindowForFx, isCommunismMode, showToast, eligibleForItems, cleanEmptyEffectV2113, saveState, renderAll, g.inventory.splice, randomTargetV2113, attackFractionV2113, consumeChargeV2113, ranking, r.findIndex, [r[p-1],r[p+1]].filter, targets.forEach, targets.map(x=>x.name).join, targets.map, recordHistory, Number, showItemUseFx|
|src/script/00.js:6174|attackHitClassV2116|declaration|需要进一步测试|['green','triple_green'].includes, ['red','triple_red'].includes, ['banana','triple_banana'].includes|
|src/script/00.js:6189|clearAttackHitFxV2116|declaration|需要进一步测试|[...card.classList].filter(x=>x.startsWith('hit-')).forEach, [...card.classList].filter, x.startsWith, card.classList.remove, card.style.removeProperty|
|src/script/00.js:6197|playAttackTargetFxV2116|declaration|需要进一步测试|DesktopUI.visualEvent, DesktopUI.getPreferences, battleCard, clearAttackHitFxV2116, attackHitClassV2116, card.classList.add, card.style.setProperty, document.createElement, itemVisual, card.appendChild, setTimeout, card.classList.remove, badge.remove, card.style.removeProperty|
|src/script/00.js:6230|tryDefendLightningV2116|declaration|需要进一步测试|Number, Math.max, tinyDefenseToast, setTimeout, playAttackTargetFxV2116, ['star','mega'].includes, ['mega','star'].includes, target.inventory.findIndex, target.inventory.splice|
|src/script/00.js:6258|applyLightningHitV2116|declaration|需要进一步测试|eligibleForItems, tryDefendLightningV2116, Number, roundHalf, setTimeout, playAttackTargetFxV2116|
|src/script/00.js:6282|showItemUseFx|assignment|需要进一步测试|setTimeout, playCasterCardFx, _v2116ShowItemUseFx.call|
|src/script/00.js:6310|isQueuePersistentActiveV2120|declaration|需要进一步测试|['star','mega','power'].includes|
|src/script/00.js:6316|queueRoleTextV2120|declaration|需要进一步测试||
|src/script/00.js:6320|queueUseStateV2120|declaration|需要进一步测试|isQueuePersistentActiveV2120, eligibleForItems, Reliability.validateItem, isCommunismMode|
|src/script/00.js:6335|legacyUseItem|assignment|需要进一步测试|state.groups.find, closeItemWindowForFx, showToast, isQueuePersistentActiveV2120, _v2120UseItem.call|
|src/script/00.js:6365|godAddQueueItemV2120|declaration|需要进一步测试|state.groups.find, showToast, eligibleForItems, recordHistory, addItemToGroup, saveState, renderAll, renderItemWindow|
|src/script/00.js:6377|godClearQueueItemsV2120|declaration|需要进一步测试|state.groups.find, recordHistory, saveState, renderAll, renderItemWindow|
|src/script/00.js:6385|godAddItem|assignment|需要进一步测试|godAddQueueItemV2120|
|src/script/00.js:6386|godAddItemV283|assignment|需要进一步测试|godAddQueueItemV2120|
|src/script/00.js:6387|godClearItems|assignment|需要进一步测试|godClearQueueItemsV2120|
|src/script/00.js:6391|renderItemWindow|assignment|需要进一步测试|_v2120RenderItemWindow, state.groups.find, document.getElementById, [0,1,2].map(i=>{     const it=g.inventory[i];     const role=queueRoleTextV2120(i);     if(!it){       return <div class="item-big queue-item-card ${i===0?'queue-main-card':'queue-secondary-card'} empty">         <div class="queue-role-badge">${role}</div>         <div class="item-big-icon">＋</div>         <div class="item-big-name">空道具栏</div>         <div class="item-big-desc">${i===0?'新获得的第一个道具会进入这里':'主要道具释放后，次要道具会按顺序自动晋升'}</div>       </div>;     }     const d=ITEM_DEFS[it.key];     const st=queueUseStateV2120(g,i);     const active=isQueuePersistentActiveV2120(g,it);     return <div class="item-big queue-item-card ${i===0?'queue-main-card':'queue-secondary-card'} ${active?'queue-persistent-active':''}">       <div class="queue-role-badge">${role}${active?' · 卡手中':''}</div>       <div class="item-big-icon">${itemVisual(it.key)}</div>       <div class="item-big-name">${escapeHtml(d.name)}${it.charges>1?' ×'+it.charges:''}</div>       <div class="item-big-desc">${escapeHtml(d.desc)}</div>       ${i===0         ? <button class="btn btn-primary item-use queue-main-use" onclick="useItem(${g.id},0)" ${st.usable?'':'disabled'}>${st.label}</button>         : <button class="btn item-use queue-secondary-lock" disabled>${st.label}</button>}     </div>;   }).join, [0,1,2].map, queueRoleTextV2120, queueUseStateV2120, isQueuePersistentActiveV2120, itemVisual, escapeHtml, document.createElement, Object.keys(ITEM_DEFS).map(k=><button class="btn btn-sm" onclick="godAddQueueItemV2120(${g.id},'${k}')">${itemVisual(k)} ${escapeHtml(ITEM_DEFS[k].name)}</button>).join, Object.keys(ITEM_DEFS).map, Object.keys, body.appendChild|
|src/script/00.js:6444|enhanceItemCards|assignment|需要进一步测试|_v2120EnhanceItemCards, state.groups.forEach, document.querySelector, card.classList.remove, card.classList.add, card.querySelectorAll, [0,1,2].forEach, isQueuePersistentActiveV2120, slot.classList.add, queueRoleTextV2120, itemVisual, queueMainVisualCacheV2120.get, slots[0].classList.add, setTimeout, slots[0]?.classList.remove, queueMainVisualCacheV2120.set|
|src/script/00.js:6483|handUseNewItem|assignment|需要进一步测试|state.groups.find, showToast, closeHandRaise, openItemWindow|
|src/script/01.js:11|ensureGroupNumbersV213|declaration|需要进一步测试|state.groups.forEach, Number.parseInt, Number.isFinite, used.has, used.add, Math.max, saveState|
|src/script/01.js:28|groupNoTextV213|declaration|需要进一步测试|Math.max, Number.parseInt, String(n).padStart, String|
|src/script/01.js:29|desiredGroupsV213|declaration|需要进一步测试|ensureGroupNumbersV213, ranking, state.groups.slice().sort, state.groups.slice, state.groups.indexOf|
|src/script/01.js:34|currentCardSortLabelV213|declaration|需要进一步测试||
|src/script/01.js:37|renderItemEncyclopedia|assignment|需要进一步测试|ensureV2State, document.getElementById, ITEM_KEYS.map(k=>{const d=ITEM_DEFS[k];return <div class="ency-v213-card">     <div class="ency-v213-icon-disc">${itemVisual(k,'ency-v213-img')}</div>     <div class="ency-v213-info"><div class="ency-v213-name">${escapeHtml(d.name)}</div><div class="ency-v213-desc">${escapeHtml(d.desc)}</div></div>     <div class="ency-v213-actions"><button class="btn btn-sm btn-primary" onclick="chooseItemIcon('${k}')">上传图片</button><button class="btn btn-sm" onclick="resetItemIcon('${k}')">恢复默认</button></div>   </div>}).join, ITEM_KEYS.map, itemVisual, escapeHtml|
|src/script/01.js:56|applySettingsBatchMembers|assignment|需要进一步测试|state.groups.map, _v213Batch.apply, state.groups.forEach, oldNums.has, oldNums.get, ensureGroupNumbersV213, saveState, renderAll|
|src/script/01.js:67|legacyUseItem|assignment|需要进一步测试|_v213UseItem.call, setTimeout|
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
|src/script/04.js:12|legacyJudgeRound|assignment|需要进一步测试|state.groups       .filter(g => g?.itemEffect?.type === 'power')       .map, state.groups       .filter, _v2164JudgeRound.apply, powerBefore       .filter(x => x.answered && x.correct)       .map(x => {         const g = state.groups.find(q => q.id === x.id);         return g ? { id: g.id, target: Number(g.score) ／／ 0 } : null;       })       .filter, powerBefore       .filter(x => x.answered && x.correct)       .map, powerBefore       .filter, state.groups.find, Number, setTimeout, cancelAnimationFrame, powerTargets.forEach, Number.isFinite, updates.push, animateScores, saveState, renderAll, console.warn|
|src/script/04.js:84|itemFallbackToneV2164|declaration|需要进一步测试|audioCtx.createOscillator, audioCtx.createGain, osc.frequency.setValueAtTime, osc.frequency.exponentialRampToValueAtTime, gain.gain.setValueAtTime, Math.max, gain.gain.exponentialRampToValueAtTime, osc.connect, gain.connect, getFxOutputV2176, osc.start, osc.stop|
|src/script/04.js:101|playItemFallbackSoundV2164|declaration|需要进一步测试|itemFallbackToneV2164, [523.25,659.25,783.99].forEach, [523.25,659.25,783.99,1046.5].forEach|
|src/script/04.js:155|playSound|assignment|需要进一步测试|ITEM_SOUND_IDS_V2164.has, _v2164PlaySoundBase.call, loadFxSounds, getAudioContext, audioCtx.createBufferSource, source.connect, getFxOutputV2176, source.start, playItemFallbackSoundV2164|
|src/script/04.js:188|startDrawSoundBedV2164|declaration|需要进一步测试|playSound, Math.max, setInterval, clearInterval, setTimeout|
|src/script/04.js:204|globalItemDraw|assignment|需要进一步测试|state.groups.some, eligibleForItems, Array.isArray, isCommunismMode, startDrawSoundBedV2164, _v2164GlobalItemDraw.apply|
|src/script/04.js:215|handDrawItem|assignment|需要进一步测试|state.groups.find, eligibleForItems, Array.isArray, startDrawSoundBedV2164, _v2164HandDrawItem.apply|
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
|src/script/12.js:58|legacyUseItem|assignment|需要进一步测试|state.groups.find, closeItemWindowForFx, showToast, _v2177UseItem.call|
|src/script/12.js:83|toggleAllInCard|assignment|需要进一步测试|state.groups.find, showToast, _v2177ToggleAllInCard.call|
|src/script/12.js:96|finishStartRound|assignment|需要进一步测试|resetRoundItemUseLocksV2177, _v2177FinishStartRound.apply|
|src/script/12.js:103|queueUseStateV2120|assignment|需要进一步测试|_v2177QueueUseState.call|
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
|src/script/22.js:3|repairFlowerChargesV21719|declaration|需要进一步测试|state.groups.forEach, Array.isArray, g.inventory.forEach, keys.has, Number, Number.isFinite, Math.max, Math.min, Math.trunc, saveState, renderAll|
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
|src/script/31.js:150|legacyUseItem|assignment|需要进一步测试|snapshotScoresV21732, _v21732UseItem.call, Math.max, queueItemScoreChangesV21732|
|src/script/31.js:173|restoreHeldScoreElementsV21732|declaration|需要进一步测试|itemScoreDisplayHoldV21732.forEach, getScoreElementV21732, el.classList.contains, activeScoreRollsV21732.get, String, state.groups.find, mountScoreRollV21732|
|src/script/32.js:3|normalizeItemEffectForStatusV21731|declaration|需要进一步测试|Number, Object.keys|
|src/script/32.js:26|repairAllItemEffectsV21731|declaration|需要进一步测试|state.groups.forEach, JSON.stringify, normalizeItemEffectForStatusV21731, saveState|
|src/script/32.js:40|ensureItemState|assignment|需要进一步测试|_v21731EnsureItemState.apply, repairAllItemEffectsV21731|
|src/script/35.js:4|getTopNoticeStackV21735|declaration|需要进一步测试|document.getElementById, document.createElement, document.body.appendChild|
|src/script/35.js:15|appendTopNoticeV21735|declaration|需要进一步测试|getTopNoticeStackV21735, stack.appendChild, node.remove, stack.remove, node.addEventListener, setTimeout|
|src/script/35.js:19|remove|binding|需要进一步测试|node.remove, stack.remove|
|src/script/35.js:31|showItemUseFx|assignment|需要进一步测试|DesktopUI.visualEvent, DesktopUI.getPreferences, playSound, setTimeout, itemSoundCategoryV26, playCasterCardFx, special.includes, ['coin_shell','question','question_block'].includes, cardFxTargets(key,casterId).forEach, cardFxTargets, playTargetCardFx, state.groups?.find, document.createElement, itemVisual, escapeHtml, appendTopNoticeV21735|
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
|src/script/36.js:153|renderQuickPersonListV218|declaration|需要进一步测试|document.getElementById, filteredStudentsV218, list.map(s=>     <button class="quick-person-entry-v218 ${qpStateV218.selected.has(s.key)?'selected':''}" onclick="toggleQuickPersonV218('${escapeHtml(s.key).replace(/'/g,"&#39;")}')">       ${s.p.number!=null?<span class="student-no-v218" style="background:${s.group.color}">${escapeHtml(s.p.numberText)}</span>:'<span class="student-no-v218" style="background:#94a3b8">—</span>'}       <span class="student-name-v218">${escapeHtml(s.p.name)}</span>       <span class="qp-group-v218">${escapeHtml(s.group.name)}</span>     </button>).join, list.map, qpStateV218.selected.has, escapeHtml(s.key).replace, escapeHtml|
|src/script/36.js:165|toggleQuickPersonV218|declaration|需要进一步测试|qpStateV218.selected.has, qpStateV218.selected.delete, qpStateV218.selected.add, renderQuickPersonListV218|
|src/script/36.js:169|applyQuickPersonScoreV218|declaration|需要进一步测试|openPwdModal, Number, Number.isSafeInteger, showToast, allStudentsV218().filter, allStudentsV218, qpStateV218.selected.has, selected.forEach, counts.set, counts.get, Reliability.planBatchScoreChanges, updates.map(u=>{     const name=state.groups.find(g=>g.id===u.id)?.name／／'小组';     return name+' '+(u.delta>=0?'+':'')+u.delta;   }).join, updates.map, state.groups.find, cancelScoreAnimationAndSync, runClassroomCommand, animateScores, playSound, ClassroomFeedback.score, updates.reduce|
|src/script/36.js:196|applyQuickPersonCustomV218|declaration|需要进一步测试|Number, document.getElementById, Number.isFinite, showToast, applyQuickPersonScoreV218|
|src/script/36.js:225|consumeOneV218|declaration|需要进一步测试|Math.max, Number, g.inventory.splice|
|src/script/36.js:230|attackOneFifthV218|declaration|需要进一步测试|Math.round, Math.max, Number, applyItemScore|
|src/script/36.js:235|finishOwnItemUseV218|declaration|需要进一步测试|Number, recordHistory, saveState, renderAll, showItemUseFx, showToast|
|src/script/36.js:242|legacyUseItem|assignment|需要进一步测试|state.groups.find, _v218UseItemBalance.call, TRIPLE_KEYS_V218.has, ranking, r.findIndex, consumeOneV218, finishOwnItemUseV218, r.slice(0,ri).filter(eligibleForItems).sort(()=>Math.random()-.5).slice, r.slice(0,ri).filter(eligibleForItems).sort, r.slice(0,ri).filter, r.slice, Math.random, showToast, pool.forEach, damageFraction, pool.map(x=>x.name).join, pool.map, g.inventory.some, g.inventory.push, Date.now, state.groups.filter, eligibleForItems, Math.floor, attackOneFifthV218, [r[ri-1],r[ri+1]].filter, targets.forEach, targets.map(x=>x.name).join, targets.map, Number, saveState|
|src/script/36.js:342|queueUseStateV2120|assignment|需要进一步测试|TRIPLE_KEYS_V218.has, _v218QueueState.call|
|src/script/36.js:362|legacyJudgeRound|assignment|需要进一步测试|state.groups.map, _v218JudgeRound.apply, state.groups.forEach, answeredBefore.get, Number, Object.keys, showToast, Math.max, saveState, renderAll|
|src/script/36.js:395|legacyUseItem|assignment|需要进一步测试|state.groups.find, _v218UseItemIceCleanup.call, Object.keys|
|src/script/36.js:415|itemDropWeights|assignment|需要进一步测试|_v218ItemDropWeights.call, Math.max, Math.ceil, Number|
|src/script/36.js:428|pickItemForGroupV281|assignment|需要进一步测试|(g.inventory／／[]).map, FIRST_HAND_POOL_V218.filter, held.has, Math.floor, Math.random, commitSessionDrawV21710, rankIndex, _v218PickItem.call|
|src/script/36.js:460|scoreSnapshotV218|declaration|需要进一步测试|state.groups.map, Number|
|src/script/36.js:461|showHandEffectV218|declaration|需要进一步测试|document.getElementById, state.groups.forEach, before.get, Number, lines.push, escapeHtml, itemVisual, lines.join, overlay.classList.add, clearTimeout, setTimeout, overlay.classList.remove|
|src/script/36.js:478|handUseOneV218|declaration|需要进一步测试|state.groups.find, showToast, scoreSnapshotV218, useItem, setTimeout, showHandEffectV218, renderHandRewardControlsV218|
|src/script/36.js:486|handUseAllTripleV218|declaration|需要进一步测试|state.groups.find, TRIPLE_KEYS_V218.has, showToast, scoreSnapshotV218, Math.min, Number, showHandEffectV218, renderHandRewardControlsV218, useItem, setTimeout, fire|
|src/script/36.js:492|fire|binding|需要进一步测试|state.groups.find, showHandEffectV218, renderHandRewardControlsV218, useItem, setTimeout|
|src/script/36.js:506|renderHandRewardControlsV218|declaration|需要进一步测试|document.getElementById, state.groups.find, TRIPLE_KEYS_V218.has, Number, eligibleForItems, ClassroomFeedback.slotMarkup, escapeHtml|
|src/script/36.js:525|judgeHandRaise|assignment|需要进一步测试|_v218JudgeHandRaise.call, setTimeout|
|src/script/36.js:532|finishHandItemReward|assignment|需要进一步测试|renderHandRewardControlsV218|
|src/script/36.js:575|renderAbout|assignment|需要进一步测试|_v218RenderAbout.call, document.querySelectorAll('[data-about]').forEach, document.querySelectorAll, b.classList.toggle, document.getElementById, ITEM_ORDER_V218.filter(k=>ITEM_DEFS[k]).map(k=>{       const d=ITEM_DEFS[k],desc=(typeof ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715!=='undefined'&&ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715[k])／／d.desc／／'';       return <div class="v2170-ency-row">         <div class="v2170-ency-icon">${itemVisual(k,'v2170-ency-img')}</div>         <div class="v2170-ency-copy">           <div class="v2170-ency-name">${escapeHtml(d.name)}</div>           <div class="v2170-ency-desc">${escapeHtml(desc)}</div>           <div class="v218-ency-tip"><b>使用技巧：</b>${escapeHtml(ITEM_TIPS_V218[k]／／'根据当前排名、道具栏与答题阶段灵活使用。')}</div>         </div>       </div>;     }).join, ITEM_ORDER_V218.filter(k=>ITEM_DEFS[k]).map, ITEM_ORDER_V218.filter, itemVisual, escapeHtml|
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
|src/script/42.js:30|legacyUseItem|assignment|需要进一步测试|state.groups.find, _v2189UseItem.call, showToast, state.groups.filter, eligibleForItems, allTargets.filter, consumeOneV218, Number, recordHistory, saveState, renderAll, showItemUseFx, Math.floor, Math.random, attackOneFifthV218, Math.round, Math.max, applyItemScore|
|src/script/43.js:2|cleanVisibleCopyV21811|declaration|需要进一步测试|document.getElementById, document.createTreeWalker, walker.nextNode, nodes.push, nodes.forEach, n.nodeValue         .replace(/原来的\s*音乐设置已经退休[^。]*。?/g,'')         .replace(/原来的\s*旧版音乐参数面板已经退休[^。]*。?/g,'')         .replace(/旧版音乐参数面板/g,'音乐设置')         .replace, n.nodeValue         .replace(/原来的\s*音乐设置已经退休[^。]*。?/g,'')         .replace(/原来的\s*旧版音乐参数面板已经退休[^。]*。?/g,'')         .replace, n.nodeValue         .replace(/原来的\s*音乐设置已经退休[^。]*。?/g,'')         .replace, n.nodeValue         .replace|
|src/script/43.js:18|renderAbout|assignment|需要进一步测试|_v21811RenderAbout.apply, cleanVisibleCopyV21811|
|src/script/44.js:5|resetCompetitionDataAfterSettlementV21812|declaration|需要进一步测试|cancelScoreAnimationAndSync, state.groups.forEach, STORAGE.getJSON, resetSlotDisplay, document.getElementById('squidVeil')?.classList.remove, document.getElementById, document.querySelectorAll('.squid-hidden-score').forEach, document.querySelectorAll, el.classList.remove, STORAGE.setJSON, document.getElementById('itemWindow')?.classList.remove, document.getElementById('handRaiseBackdrop')?.classList.remove, document.getElementById('itemDrawOverlay')?.classList.remove, ensureV2State|
|src/script/45.js:4|snapshotGroupForSettlementV21813|declaration|需要进一步测试|clone, Number|
|src/script/45.js:28|compactUndoHistoryV21813|declaration|需要进一步测试|(historyStack／／[]).map, (h.groups／／[]).map, clone|
|src/script/45.js:45|buildSettlementClearedDataV21813|declaration|需要进一步测试|new Date().toLocaleString, state.groups.map, Number, clone, compactUndoHistoryV21813|
|src/script/45.js:102|csvCellV21813|declaration|需要进一步测试|JSON.stringify, String, Reliability.csvText, text.replace|
|src/script/45.js:110|itemNameV21813|declaration|需要进一步测试||
|src/script/45.js:113|inventoryTextV21813|declaration|需要进一步测试|(inv／／[]).map(it=>{     const n=itemNameV21813(it.key);     const c=Number(it.charges)／／1;     return c>1?${n} ×${c}:n;   }).join, (inv／／[]).map, itemNameV21813, Number|
|src/script/45.js:120|effectTextV21813|declaration|需要进一步测试|out.push, Number, out.join|
|src/script/45.js:133|exportSingleSettlementCSV|assignment|需要进一步测试|getSettlementHistory, lines.push, [     ['档案名称',record.title／／'课堂结算'],     ['归档日期',record.date／／''],     ['归档时间',record.time／／''],     ['第一名',record.champion／／''],     ['小组数量',record.totalGroups??groups.length],     ['全班总分',record.totalScore??groups.reduce((n,g)=>n+(Number(g.score)／／0),0)]   ].forEach, groups.reduce, Number, csvCellV21813, [     ['课堂作答总次数',answers],     ['答题轮次',Number(ig.pkTotal)／／0],     ['全局道具发放',Number(ig.totalDraws)／／0],     ['手动举手次数',Number(ig.handRaiseTotal)／／0],     ['随机点名记录数',(ig.pickerHistory／／[]).length],     ['手动举手记录数',(ig.handRaiseHistory／／[]).length],     ['撤销历史节点数',(snap.undoHistory／／[]).length]   ].forEach, [     '排名','小组名称','最终得分','组员名单',     '答对次数','答错次数','道具抽取次数','道具使用次数',     '持有道具','持续状态','幽灵防护剩余','本题已使用道具','三重道具续用键',     'All In','所选答案','结果文字'   ].map(csvCellV21813).join, [     '排名','小组名称','最终得分','组员名单',     '答对次数','答错次数','道具抽取次数','道具使用次数',     '持有道具','持续状态','幽灵防护剩余','本题已使用道具','三重道具续用键',     'All In','所选答案','结果文字'   ].map, [...groups].sort, ranked.forEach, [       r+1,g.name,Number(g.score)／／0,(g.members／／[]).join(' / '),       Number(g.itemStats?.correct)／／0,Number(g.itemStats?.wrong)／／0,       Number(g.itemStats?.draws)／／0,Number(g.itemStats?.used)／／0,       inventoryTextV21813(g.inventory),effectTextV21813(g),       Number(g.booRoundsLeftV218)／／0,g.itemUsedThisRound?'是':'否',       g.roundItemContinuationKeyV218／／'',       g.allIn?'是':'否',g.selectedOpt／／'',g.resultText／／''     ].map(csvCellV21813).join, [       r+1,g.name,Number(g.score)／／0,(g.members／／[]).join(' / '),       Number(g.itemStats?.correct)／／0,Number(g.itemStats?.wrong)／／0,       Number(g.itemStats?.draws)／／0,Number(g.itemStats?.used)／／0,       inventoryTextV21813(g.inventory),effectTextV21813(g),       Number(g.booRoundsLeftV218)／／0,g.itemUsedThisRound?'是':'否',       g.roundItemContinuationKeyV218／／'',       g.allIn?'是':'否',g.selectedOpt／／'',g.resultText／／''     ].map, (g.members／／[]).join, inventoryTextV21813, effectTextV21813, [     ['鱿鱿遮蔽截止时间',Number(ig.blooperUntil)／／0],     ['抽取节流状态',ig.drawThrottleV2179／／{}],     ['抽取轮次与冷却',ig.drawSessionThrottleV21710／／{}],     ['第一次手动举手特殊抽取是否待触发',snap.transient?.firstHandDrawPending?'是':'否'],     ['当前抽取会话',snap.transient?.activeDrawSession／／null],     ['当前是否正在抽取',snap.transient?.itemDrawBusy?'是':'否']   ].forEach, [     ['点名模式',snap.picker?.mode／／''],     ['已抽学生键',snap.picker?.pickedStudentKeys／／[]],     ['已抽小组 ID',snap.picker?.pickedGroupIds／／[]],     ['预选小组 ID',snap.picker?.preselectedGroupIds／／[]],     ['当前抽取结果',snap.transient?.slotEngine?.chosenResult／／null]   ].forEach, (ig.pickerHistory／／[]).forEach, [i+1,x.time?new Date(x.time).toLocaleString():'',x.text／／''].map(csvCellV21813).join, [i+1,x.time?new Date(x.time).toLocaleString():'',x.text／／''].map, new Date(x.time).toLocaleString, (ig.handRaiseHistory／／[]).forEach, groups.find, [       i+1,x.time?new Date(x.time).toLocaleString():'',x.groupId??'',       g?.name／／'',x.correct?'正确':'错误'     ].map(csvCellV21813).join, [       i+1,x.time?new Date(x.time).toLocaleString():'',x.groupId??'',       g?.name／／'',x.correct?'正确':'错误'     ].map, [     ['是否正在答题',rd.roundActive?'是':'否'],     ['是否已判定',rd.evaluated?'是':'否'],     ['正确答案',rd.correctAnswer／／rd.correctAns／／''],     ['回合编号',Number(rd.roundNo)／／0],     ['是否曾开始过比赛',rd.hasStartedOnce?'是':'否'],     ['上一轮 All In 状态',rd.lastRoundAllIn／／null],     ['当前举手小组 ID',snap.transient?.handRaiseGroupId??''],     ['当前举手抽道具小组 ID',snap.transient?.handItemDrawGroupId??''],     ['待定道具键',snap.transient?.handItemPendingKey??''],     ['道具抽取开始时间',snap.transient?.handItemDrawStartedAt??0],     ['当前道具详情小组 ID',snap.transient?.activeItemGroupId??'']   ].forEach, (snap.undoHistory／／[]).forEach, (h.groups／／[]).map, [       i+1,h.time／／'',h.desc／／'',groupSummary,h.picker／／null,h.itemGlobal／／null     ].map(csvCellV21813).join, [       i+1,h.time／／'',h.desc／／'',groupSummary,h.picker／／null,h.itemGlobal／／null     ].map, lines.join, URL.createObjectURL, document.createElement, (record.title／／'封神榜档案').replace, a.click, URL.revokeObjectURL, showToast|
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
|src/ui/classroom-feedback.js:135|show|declaration|需要进一步测试|allowed, cancel, dialog, root.querySelector, DesktopUI.getPreferences, document.createElement, dot.style.setProperty, Math.cos, Math.sin, particles.append, root.classList.toggle, String, Number, getComputedStyle, root.showModal, document.getElementById, toast?.matches, toast.hidePopover, toast.showPopover, root.classList.add, setTimeout, dismiss|
|src/ui/classroom-feedback.js:182|score|declaration|需要进一步测试|Number.isSafeInteger, show, Math.abs|
|src/ui/classroom-feedback.js:191|picked|declaration|需要进一步测试|parseStudentV218, show|
|src/ui/classroom-feedback.js:205|syncSettings|declaration|需要进一步测试|document.querySelectorAll("[data-cf-slot]").forEach, document.querySelectorAll, document.querySelectorAll("[data-cf-option]").forEach|
|src/ui/classroom-feedback.js:215|settings|declaration|需要进一步测试|document       .querySelector('[data-category-panel="rules"]')       .insertAdjacentHTML, document       .querySelector, options.slots.map((n, i) => <label>槽位 ${i + 1}<input type="number" step="1" data-cf-slot="${i}" aria-label="快捷赋分槽位 ${i + 1}" value="${n}"></label>).join, options.slots.map, document       .querySelector('[data-category-panel="motion"]')       .insertAdjacentHTML, document       .querySelector('[data-category-panel="sound"]')       .insertAdjacentHTML, document.querySelectorAll("[data-cf-slot]").forEach, document.querySelectorAll, e.addEventListener, [...document.querySelectorAll("[data-cf-slot]")].map, x.value.trim, Number, setOptions, document.getElementById, e.removeAttribute, e.setAttribute, document.querySelectorAll("[data-cf-option]").forEach, ["duration", "clickVolume"].includes, cancel, syncSettings|
|src/ui/classroom-feedback.js:269|allowClickSound|declaration|需要进一步测试||
|src/ui/classroom-feedback.js:279|stopClickVoice|declaration|需要进一步测试|clickVoice.source.stop, clickVoice.source.disconnect, clickVoice.gain.disconnect|
|src/ui/classroom-feedback.js:288|ownClickVoice|declaration|需要进一步测试|stopClickVoice, source.disconnect, gain.disconnect|
|src/ui/classroom-feedback.js:292|source.onended|assignment|需要进一步测试|source.disconnect, gain.disconnect|
|src/ui/classroom-feedback.js:298|bindButtonSound|declaration|需要进一步测试|document.addEventListener, e.target.closest, button.closest, stopClickVoice, button.hasAttribute, clearTimeout, setTimeout, playSound, ActionSounds.classify|
|src/ui/classroom-feedback.js:321|init|declaration|需要进一步测试|localStorage.getItem, validate, JSON.parse, console.warn, document.body.insertAdjacentHTML, bindButtonSound, Reliability.onDefenseInvalidation, cancel, BattleMotion.clear, dialog().addEventListener, dialog, e.preventDefault, dismiss, settings, refreshSlots, document.addEventListener, stopClickVoice, clearLive, matchMedia("(prefers-reduced-motion: reduce)").addEventListener, matchMedia, allowed|
|src/ui/classroom-feedback.js:362|candidates|declaration|需要进一步测试|state.groups.filter, pre.includes, groups.map, groups.flatMap, (g.members ／／ []).map|
|src/ui/classroom-feedback.js:376|rowMarkup|declaration|需要进一步测试|escapeHtml, studentLabelHTMLV218|
|src/ui/classroom-feedback.js:381|clearLive|declaration|需要进一步测试|live.animation.cancel, live.strip.remove, liveReels.clear|
|src/ui/classroom-feedback.js:389|startLive|declaration|需要进一步测试|clearLive, allowed, document       .querySelectorAll("#pickerModal .slot-reel-frame")       .forEach, document       .querySelectorAll, frame.getClientRects, candidates, frame.querySelector, document.createElement, strip.setAttribute, rowMarkup, strip.append, frame.append, strip.animate, liveReels.set|
|src/ui/classroom-feedback.js:433|takeLive|declaration|需要进一步测试|liveReels.get, Number, Math.floor|
|src/ui/desktop.js:5|$|binding|需要进一步测试|document.querySelector|
|src/ui/desktop.js:45|icon|declaration|需要进一步测试||
|src/ui/desktop.js:48|empty|declaration|需要进一步测试|icon, E|
|src/ui/desktop.js:51|persistPreferences|declaration|需要进一步测试|localStorage.setItem, JSON.stringify, showToast|
|src/ui/desktop.js:63|applyPreferences|declaration|需要进一步测试|settleDisclosures, cancelSettingsMotion, ClassroomFeedback.cancel, BattleMotion.clear, window.WelcomeV2?.preferencesChanged, String, canAnimate, cancelItemScoreAnimations, cancelScoreAnimationAndSync, cancelAnimations, document.getAnimations().forEach, document.getAnimations, a.cancel|
|src/ui/desktop.js:79|canAnimate|declaration|需要进一步测试|matchMedia|
|src/ui/desktop.js:88|animate|declaration|需要进一步测试|canAnimate, el.animate, animations.add, a.finished.catch(() => {}).finally, a.finished.catch, animations.delete|
|src/ui/desktop.js:100|cancelAnimations|declaration|需要进一步测试|BattleMotion.clear, observeVisualState, cancelAnimationFrame, settleDisclosures, cancelSettingsMotion, a.cancel, animations.clear, document.querySelectorAll("#groupList .group-row-card").forEach, document.querySelectorAll, clearCardFx, clearAttackHitFxV2116, document       .querySelectorAll(".card-fx-badge,.attack-hit-badge-v2116")       .forEach, document       .querySelectorAll, el.remove, document.querySelectorAll(".ui-fx-layer").forEach, x.remove|
|src/ui/desktop.js:119|visualEvent|declaration|需要进一步测试|document.dispatchEvent, BattleMotion.event|
|src/ui/desktop.js:127|syncViewport|declaration|需要进一步测试|Number, getComputedStyle, document.body.style.setProperty|
|src/ui/desktop.js:143|viewChanged|declaration|需要进一步测试|ClassroomFeedback.cancel, BattleMotion.clear, cancelItemScoreAnimations, cancelScoreAnimationAndSync, window.WelcomeV2?.viewChanged, [...openStack].reverse, ["themeDialogV21727", "grandModalOverlay", "welcomeModal"].includes, m.close, $, document.querySelectorAll(".nav-tab").forEach, document.querySelectorAll, b.setAttribute, String, $(".ui-dock-menu")?.removeAttribute, $(".dock-humor-tip-v2185")?.classList.remove, cancelAnimations, requestAnimationFrame, [           ...host.querySelectorAll(selectors[name] ／／ ":scope"),         ].slice, host.querySelectorAll, targets.forEach, animate, Math.min, renderWelcome, selectSettings|
|src/ui/desktop.js:214|renderWelcome|declaration|需要进一步测试|$, syncViewport, observeVisualState, canAnimate, document.getAnimations().forEach, document.getAnimations, a.cancel, [...groups].sort, Number, Date.now, JSON.stringify, groups.map, groups             .map((g) => {               const item = g.inventory?.[0],                 states = Object.entries(g.itemEffect ／／ {})                   .filter(                     ([k, v]) =>                       (k === "type" && !!v) ／／                       (["iceLock", "featherDodge"].includes(k) &&                         Number(v) > 0),                   )                   .map(                     ([k, v]) =>                       ({                         bullet: "炮弹追击",                         featherDodge: "羽毛闪避",                         star: "无敌星",                         mega: "巨大蘑菇",                         boo: "幽灵保护",                         ice: "冻结",                         power: "强力蘑菇",                         feather: "羽毛",                       })[k === "type" ? v : k] ／／                       (k === "iceLock" ? "冻结" : k),                   );               if (g.booShield > 0 ／／ g.booRoundsLeftV218 > 0)                 states.push("幽灵保护");               return <button class="ui-group-card" data-group="${Number(g.id)}" style="--group-color:${/^#[a-f\d]{3,8}$/i.test(g.color) ? g.color : "#0f766e"}" aria-label="查看${E(g.name)}的小组详情"><span class="ui-chip">第 ${E(g.groupNo ／／ groups.indexOf(g) + 1)} 组</span><span class="ui-muted" style="float:right">排名 ${mask ? "—" : sorted.findIndex((x) => x.id === g.id) + 1}</span><span class="ui-group-title">${E(g.name)}</span><span class="ui-group-score">${mask ? "???" : E(g.score)}</span><span class="ui-muted"> 分</span><footer>${item ? itemVisual(item.key) : icon("gift")}<span>${E(item ? ITEM_DEFS[item.key]?.name ／／ "未知道具" : "暂无主要道具")}</span></footer>${states.length ? <div class="ui-muted">${E(states.join(" · "))}</div> : ""}</button>;             })             .join, groups             .map, Object.entries(g.itemEffect ／／ {})                   .filter(                     ([k, v]) =>                       (k === "type" && !!v) ／／                       (["iceLock", "featherDodge"].includes(k) &&                         Number(v) > 0),                   )                   .map, Object.entries(g.itemEffect ／／ {})                   .filter, Object.entries, ["iceLock", "featherDodge"].includes, states.push, /^#[a-f\d]{3,8}$/i.test, E, groups.indexOf, sorted.findIndex, itemVisual, icon, states.join, empty, track         .querySelectorAll("[data-group]")         .forEach, track         .querySelectorAll, openItemWindow, requestAnimationFrame, renderDaily, window.WelcomeV2.render|
|src/ui/desktop.js:279|el.onclick|assignment|需要进一步测试|openItemWindow, Number|
|src/ui/desktop.js:288|updateArrows|declaration|需要进一步测试|$, t.classList.toggle|
|src/ui/desktop.js:298|observeVisualState|declaration|需要进一步测试|JSON.stringify, visualSnapshot.get, visualEvent, g.inventory.at, next.set|
|src/ui/desktop.js:338|renderDaily|declaration|需要进一步测试|$, getSettlementHistory, M.dayIndex, JSON.stringify, history.map, Object.keys, M.daily, bank.knowledge.filter, bank.challenges.filter, E, itemVisual, quiz.options.map((o, i) => <button data-quiz-answer="${i}" aria-pressed="false">${"ABCD"[i]} · ${E(o)}</button>).join, quiz.options.map, host.querySelectorAll, host.querySelectorAll("[data-quiz-answer]").forEach, b.parentElement             .querySelectorAll("button")             .forEach, b.parentElement             .querySelectorAll, x.setAttribute, String, host.querySelector, Number|
|src/ui/desktop.js:379|b.onclick|assignment|需要进一步测试|b.parentElement             .querySelectorAll("button")             .forEach, b.parentElement             .querySelectorAll, x.setAttribute, String, host.querySelector, Number|
|src/ui/desktop.js:391|historyKind|declaration|需要进一步测试|/清零／恢复／撤销／回溯／删除/.test, /道具／攻击／龟壳／蘑菇/.test, /题／回合／答题／结算/.test, /成员／小组／名单/.test|
|src/ui/desktop.js:402|inventory|declaration|需要进一步测试|items         .map((i) => ${ITEM_DEFS[i.key]?.name ／／ i.key} ×${i.charges ?? 1})         .join, items         .map|
|src/ui/desktop.js:409|renderHistory|declaration|需要进一步测试|$, empty, historyStack       .map((h, i) => {         const next = historyStack[i + 1] ／／ state,           diffs = M.differences(h, next),           [kind, glyph, label] = historyKind(h.desc),           changed = diffs.filter(             (d) =>               d.delta ／／               d.added ／／               d.removed ／／               JSON.stringify(d.inventoryBefore) !==                 JSON.stringify(d.inventoryAfter) ／／               JSON.stringify(d.effectsBefore) !==                 JSON.stringify(d.effectsAfter),           );         return <article class="ui-panel ui-history" data-kind="${kind}" style="--record-index:'${String(i + 1).padStart(2, "0")}'"><details><summary><div><span class="ui-chip">${icon(glyph)} ${label}</span><h3>${E(h.desc ／／ "未命名操作")}</h3><span class="ui-muted">${E(h.time ／／ "未记录时间")} · ${E(changed.map((g) => g.name).join("、") ／／ "未发现可比较的小组变动")}</span></div><span class="ui-chip">${i === historyStack.length - 1 ? "最近操作前快照" : "查看快照"} ${icon("arrow")}</span></summary><div class="ui-snapshot-note">以下比较：此操作前快照 → ${i === historyStack.length - 1 ? "当前状态" : "下一条操作前快照"}。${i === historyStack.length - 1 ? "当前状态可能包含尚未记录的变化。" : "两次快照之间可能含未单独记录的操作。"}历史未保存的字段无法推断。</div><div class="ui-table-wrap"><table class="ui-table"><thead><tr><th>小组</th><th>积分变化</th><th>名次</th><th>道具队列</th><th>持续状态</th></tr></thead><tbody>${diffs.map((d) => <tr><td>${E(d.name)}${d.added ? "（新增）" : d.removed ? "（移除）" : ""}</td><td>${d.before ?? "—"} → ${d.after ?? "—"} <strong class="${d.delta > 0 ? "ui-positive" : d.delta < 0 ? "ui-negative" : ""}">${d.delta === null ? "" : (${d.delta > 0 ? "+" : ""}${d.delta})}</strong></td><td>${d.rankBefore ?? "—"} → ${d.rankAfter ?? "—"}</td><td>${E(inventory(d.inventoryBefore))} → ${E(inventory(d.inventoryAfter))}</td><td>${E(JSON.stringify(d.effectsBefore))} → ${E(JSON.stringify(d.effectsAfter))}</td></tr>).join("")}</tbody></table></div><p class="ui-muted">答题状态：${h.roundActive ? "答题中" : "未答题"} → ${next.roundActive ? "答题中" : "未答题"}；已结算：${h.evaluated ? "是" : "否"} → ${next.evaluated ? "是" : "否"}。名次按快照积分顺序展示，不改变比赛排序。</p><button class="btn btn-danger" data-restore="${i}">恢复此操作前的状态</button></details></article>;       })       .reverse()       .join, historyStack       .map((h, i) => {         const next = historyStack[i + 1] ／／ state,           diffs = M.differences(h, next),           [kind, glyph, label] = historyKind(h.desc),           changed = diffs.filter(             (d) =>               d.delta ／／               d.added ／／               d.removed ／／               JSON.stringify(d.inventoryBefore) !==                 JSON.stringify(d.inventoryAfter) ／／               JSON.stringify(d.effectsBefore) !==                 JSON.stringify(d.effectsAfter),           );         return <article class="ui-panel ui-history" data-kind="${kind}" style="--record-index:'${String(i + 1).padStart(2, "0")}'"><details><summary><div><span class="ui-chip">${icon(glyph)} ${label}</span><h3>${E(h.desc ／／ "未命名操作")}</h3><span class="ui-muted">${E(h.time ／／ "未记录时间")} · ${E(changed.map((g) => g.name).join("、") ／／ "未发现可比较的小组变动")}</span></div><span class="ui-chip">${i === historyStack.length - 1 ? "最近操作前快照" : "查看快照"} ${icon("arrow")}</span></summary><div class="ui-snapshot-note">以下比较：此操作前快照 → ${i === historyStack.length - 1 ? "当前状态" : "下一条操作前快照"}。${i === historyStack.length - 1 ? "当前状态可能包含尚未记录的变化。" : "两次快照之间可能含未单独记录的操作。"}历史未保存的字段无法推断。</div><div class="ui-table-wrap"><table class="ui-table"><thead><tr><th>小组</th><th>积分变化</th><th>名次</th><th>道具队列</th><th>持续状态</th></tr></thead><tbody>${diffs.map((d) => <tr><td>${E(d.name)}${d.added ? "（新增）" : d.removed ? "（移除）" : ""}</td><td>${d.before ?? "—"} → ${d.after ?? "—"} <strong class="${d.delta > 0 ? "ui-positive" : d.delta < 0 ? "ui-negative" : ""}">${d.delta === null ? "" : (${d.delta > 0 ? "+" : ""}${d.delta})}</strong></td><td>${d.rankBefore ?? "—"} → ${d.rankAfter ?? "—"}</td><td>${E(inventory(d.inventoryBefore))} → ${E(inventory(d.inventoryAfter))}</td><td>${E(JSON.stringify(d.effectsBefore))} → ${E(JSON.stringify(d.effectsAfter))}</td></tr>).join("")}</tbody></table></div><p class="ui-muted">答题状态：${h.roundActive ? "答题中" : "未答题"} → ${next.roundActive ? "答题中" : "未答题"}；已结算：${h.evaluated ? "是" : "否"} → ${next.evaluated ? "是" : "否"}。名次按快照积分顺序展示，不改变比赛排序。</p><button class="btn btn-danger" data-restore="${i}">恢复此操作前的状态</button></details></article>;       })       .reverse, historyStack       .map, M.differences, historyKind, diffs.filter, JSON.stringify, String(i + 1).padStart, String, icon, E, changed.map((g) => g.name).join, changed.map, diffs.map((d) => <tr><td>${E(d.name)}${d.added ? "（新增）" : d.removed ? "（移除）" : ""}</td><td>${d.before ?? "—"} → ${d.after ?? "—"} <strong class="${d.delta > 0 ? "ui-positive" : d.delta < 0 ? "ui-negative" : ""}">${d.delta === null ? "" : (${d.delta > 0 ? "+" : ""}${d.delta})}</strong></td><td>${d.rankBefore ?? "—"} → ${d.rankAfter ?? "—"}</td><td>${E(inventory(d.inventoryBefore))} → ${E(inventory(d.inventoryAfter))}</td><td>${E(JSON.stringify(d.effectsBefore))} → ${E(JSON.stringify(d.effectsAfter))}</td></tr>).join, diffs.map, inventory, host.querySelectorAll(".ui-history:nth-child(-n+8)").forEach, host.querySelectorAll, animate, host.querySelectorAll("[data-restore]").forEach, Number, themeConfirm, revertToHistory|
|src/ui/desktop.js:462|b.onclick|assignment|需要进一步测试|Number, themeConfirm, revertToHistory|
|src/ui/desktop.js:478|renderArchives|declaration|需要进一步测试|getSettlementHistory, records       .flatMap((x) => (Array.isArray(x.groups) ? x.groups : []))       .filter, records       .flatMap, Array.isArray, g.score.trim, Number.isFinite, Number, Math.max, all.map, $, [       ["已归档届数", records.length],       [         "最近冠军",         records[0]?.champion ／／ records[0]?.groups?.[0]?.name ／／ "暂无",       ],       ["历史最高积分", best ?? "暂无"],       ["最近归档", records[0]?.time ／／ "暂无"],     ]       .map(         ([t, v]) =>           <div class="ui-panel"><span class="ui-muted">${t}</span><strong>${E(v)}</strong></div>,       )       .join, [       ["已归档届数", records.length],       [         "最近冠军",         records[0]?.champion ／／ records[0]?.groups?.[0]?.name ／／ "暂无",       ],       ["历史最高积分", best ?? "暂无"],       ["最近归档", records[0]?.time ／／ "暂无"],     ]       .map, E, records       .map((r, index) => ({ r, index }))       .filter, records       .map, [r.title, r.champion, ...(r.groups ／／ []).map((g) => g.name)]           .join(" ")           .toLowerCase()           .includes, [r.title, r.champion, ...(r.groups ／／ []).map((g) => g.name)]           .join(" ")           .toLowerCase, [r.title, r.champion, ...(r.groups ／／ []).map((g) => g.name)]           .join, (r.groups ／／ []).map, archiveSearch.toLowerCase, list.reverse, list.sort, list           .map(({ r, index }) => {             const groups = Array.isArray(r.groups) ? r.groups : [];             return <article class="ui-panel ui-archive-card"><details><summary class="ui-archive-summary"><span class="ui-archive-emblem" aria-hidden="true">${icon("archive")}</span><div><span class="ui-eyebrow">CLASSROOM ARCHIVE · ${E(r.time ／／ "时间未记录")}</span><h3>${E(r.title ／／ "未命名比赛")}</h3><span class="ui-muted">${groups.length} 个归档小组 · 冠军 ${E(r.champion ／／ groups[0]?.name ／／ "未记录")}</span></div><span class="ui-chip">查看完整档案 ${icon("arrow")}</span></summary><div class="ui-podium">${groups               .slice(0, 3)               .map(                 (g, i) =>                   <div><span class="ui-chip">第 ${i + 1} 名${i === 0 ? " · 冠军" : ""}</span><strong>${E(g.name ／／ "未记录名称")}</strong><span>${E(g.score ?? "未记录")} 分</span></div>,               )               .join(                 "",               )}</div><div class="ui-table-wrap"><table class="ui-table"><thead><tr><th>原档案名次</th><th>小组</th><th>最终积分</th><th>成员</th><th>道具与答题统计</th></tr></thead><tbody>${groups.map((g, i) => <tr><td>${i + 1}</td><td>${E(g.name ／／ "未记录")}</td><td>${E(g.score ?? "未记录")}</td><td>${E((g.members ／／ []).join("、") ／／ "未记录")}</td><td>${E(g.itemStats ? JSON.stringify(g.itemStats) : "此版本未提供统计")}</td></tr>).join("")}</tbody></table></div><p class="ui-muted">名次沿用归档顺序；同分保留原始次序。缺少的旧档案字段不作推测。</p><details><summary>完整原始归档数据</summary><pre style="white-space:pre-wrap;overflow-wrap:anywhere;max-height:300px;overflow:auto">${E(JSON.stringify(r, null, 2))}</pre></details><div class="ui-archive-actions"><button class="btn btn-primary" data-csv="${index}">导出完整 CSV</button><button class="btn" data-json="${index}">导出原始 JSON</button><button class="btn btn-danger" data-delete="${index}">删除档案</button></div></details></article>;           })           .join, list           .map, icon, groups               .slice(0, 3)               .map(                 (g, i) =>                   <div><span class="ui-chip">第 ${i + 1} 名${i === 0 ? " · 冠军" : ""}</span><strong>${E(g.name ／／ "未记录名称")}</strong><span>${E(g.score ?? "未记录")} 分</span></div>,               )               .join, groups               .slice(0, 3)               .map, groups               .slice, groups.map((g, i) => <tr><td>${i + 1}</td><td>${E(g.name ／／ "未记录")}</td><td>${E(g.score ?? "未记录")}</td><td>${E((g.members ／／ []).join("、") ／／ "未记录")}</td><td>${E(g.itemStats ? JSON.stringify(g.itemStats) : "此版本未提供统计")}</td></tr>).join, groups.map, (g.members ／／ []).join, JSON.stringify, empty, host           .querySelectorAll(".ui-archive-card:nth-child(-n+8),.ui-empty")           .forEach, host           .querySelectorAll, animate, host       .querySelectorAll("[data-csv]")       .forEach, host       .querySelectorAll, exportSingleSettlementCSV, host       .querySelectorAll("[data-delete]")       .forEach, deleteSettlementRecord, host       .querySelectorAll("[data-json]")       .forEach, downloadJson|
|src/ui/desktop.js:571|b.onclick|assignment|需要进一步测试|exportSingleSettlementCSV, Number|
|src/ui/desktop.js:577|b.onclick|assignment|需要进一步测试|deleteSettlementRecord, Number|
|src/ui/desktop.js:583|b.onclick|assignment|需要进一步测试|downloadJson, Number|
|src/ui/desktop.js:587|downloadJson|declaration|需要进一步测试|URL.createObjectURL, JSON.stringify, document.createElement, a.click, setTimeout, URL.revokeObjectURL|
|src/ui/desktop.js:624|setupSettings|declaration|需要进一步测试|$, document.createElement, categories.map(([id, glyph, title]) => <button data-category="${id}">${icon(glyph)}${title}</button>).join, categories.map, icon, categories.map(([id, , title, desc]) => <section class="ui-settings-category" data-category-panel="${id}" hidden><header class="ui-settings-title"><h3>${title}</h3><div class="ui-muted">${desc}</div></header></section>).join, Object.fromEntries, [...shell.querySelectorAll("[data-category-panel]")].map, shell.querySelectorAll, installCommunismModeSetting, installSfxVolumeSliderV2176, installClearItemsSettingV2172, sc.querySelectorAll, pane.id.replace, (sections[id === "function" ? "rules" : id] ／／ sections.rules).append, pane.classList.add, sections[el.dataset.settingsCategory].append, sections.appearance.append, $("#settingsV26Tabs")?.remove, sc.append, sc.classList.add, shell       .querySelectorAll("[data-category]")       .forEach, shell       .querySelectorAll, selectSettings, sections.appearance.insertAdjacentHTML, sections.motion.insertAdjacentHTML, row, check, sections.welcome.insertAdjacentHTML, [         ["knowledge", "每日知识卡片"],         ["itemTip", "每日道具小知识"],         ["honors", "历史荣誉"],         ["challenge", "每日课堂挑战"],         ["groupCruise", "小组卡片连续巡航（默认开启）"],       ]         .map(([key, label]) => row(label, "uiPref-" + key, check(key)))         .join, [         ["knowledge", "每日知识卡片"],         ["itemTip", "每日道具小知识"],         ["honors", "历史荣誉"],         ["challenge", "每日课堂挑战"],         ["groupCruise", "小组卡片连续巡航（默认开启）"],       ]         .map, sections.data.insertAdjacentHTML, [...sections.data.querySelectorAll("button")].filter, sections.data.querySelectorAll, /resetAllScores／clear/.test, b.getAttribute, b.classList.remove, b.classList.add, String, refreshSubjects, JSON.stringify, shell.querySelectorAll("[data-pref]").forEach, Number, persistPreferences, applyPreferences, renderDaily, downloadJson, M.validateBank, JSON.parse, localStorage.setItem, themeConfirm, localStorage.removeItem, organizeSettings|
|src/ui/desktop.js:658|b.onclick|assignment|需要进一步测试|selectSettings|
|src/ui/desktop.js:663|row|declaration|需要进一步测试||
|src/ui/desktop.js:666|check|binding|需要进一步测试||
|src/ui/desktop.js:724|el.onchange|assignment|需要进一步测试|Number, persistPreferences, applyPreferences, renderDaily|
|src/ui/desktop.js:738|$("#uiExportBank").onclick|assignment|需要进一步测试|downloadJson|
|src/ui/desktop.js:740|$("#uiSaveBank").onclick|assignment|需要进一步测试|M.validateBank, JSON.parse, $, localStorage.setItem, JSON.stringify, refreshSubjects, renderDaily|
|src/ui/desktop.js:754|$("#uiResetBank").onclick|assignment|需要进一步测试|themeConfirm, localStorage.removeItem, $, JSON.stringify, refreshSubjects, renderDaily|
|src/ui/desktop.js:777|organizeSettings|declaration|需要进一步测试|document.createElement, box.classList.add, E, nodes.filter(Boolean).forEach, nodes.filter, body.append, parent.append, shell.querySelectorAll, group, $, marked, $("#uiSettingsWallpaper .setting-section-title")?.remove, rosterTitle?.remove, sound.append, shell.addEventListener, event.target.closest, button?.getAttribute, event.preventDefault, event.stopImmediatePropagation, openPwdModal, themeConfirm, confirm[2]|
|src/ui/desktop.js:778|group|declaration|需要进一步测试|document.createElement, box.classList.add, E, nodes.filter(Boolean).forEach, nodes.filter, body.append, parent.append|
|src/ui/desktop.js:801|marked|binding|需要进一步测试|shell.querySelectorAll|
|src/ui/desktop.js:972|refreshSubjects|declaration|需要进一步测试|$, bank.knowledge.map, bank.challenges.map, subjects       .map(         (s) =>           <option value="${E(s)}">${E({ politics: "政治", history: "历史", geography: "地理", english: "英语" }[s] ／／ s)}</option>,       )       .join, subjects       .map, E, subjects.includes|
|src/ui/desktop.js:992|cancelSettingsMotion|declaration|需要进一步测试|animation.cancel, animations.delete, settingsAnimations.clear|
|src/ui/desktop.js:999|revealSettings|declaration|需要进一步测试|cancelSettingsMotion, canAnimate, $, [...panel.children]       .flatMap((node) =>         node.matches(".settings-v26-pane") ? [...node.children] : [node],       )       .filter, [...panel.children]       .flatMap, node.matches, targets.forEach, animate, Math.min, settingsAnimations.add, animation.finished.then, settingsAnimations.delete|
|src/ui/desktop.js:1040|selectSettings|declaration|需要进一步测试|$, categories.some, document       .querySelectorAll("[data-category-panel]")       .forEach, document       .querySelectorAll, document       .querySelectorAll(".ui-settings-nav button")       .forEach, b.setAttribute, String, renderBgmSlotList, renderFxSlotList, renderItemFxSoundListV26, renderItemEncyclopedia, revealSettings|
|src/ui/desktop.js:1067|setupDock|declaration|需要进一步测试|$, document.createElement, b.getAttribute, /globalItemDraw／openHandRaise／openPickerModal／undoLast/.test, /globalItemDraw/.test, /openHandRaise/.test, /openPickerModal/.test, /undoLast/.test, UI_ICON_TARGETS.find, b.matches, b.setAttribute, icon, E, /zoom/.test, /Lock/.test, /addGroup／Search/.test, menu.append, right.append, final.setAttribute, document.addEventListener, e.target.closest, e.preventDefault, e.stopImmediatePropagation|
|src/ui/desktop.js:1137|refreshLockControl|declaration|需要进一步测试|icon, Reliability.safeImage, uiIconsV26, button.setAttribute|
|src/ui/desktop.js:1149|settleDisclosure|declaration|需要进一步测试|disclosureMotions.get, disclosureMotions.delete, entry.animation?.cancel|
|src/ui/desktop.js:1157|settleDisclosures|declaration|需要进一步测试|disclosureMotions.keys, settleDisclosure|
|src/ui/desktop.js:1160|setupDisclosures|declaration|需要进一步测试|document.addEventListener, event.target.closest, details.classList.contains, canAnimate, event.preventDefault, disclosureMotions.get, details.getBoundingClientRect, settleDisclosure, disclosureMotions.set, animate, entry.animation.finished.then, finish|
|src/ui/desktop.js:1196|finish|binding|需要进一步测试|disclosureMotions.get, settleDisclosure|
|src/ui/desktop.js:1222|finishWindowClose|declaration|需要进一步测试|closingWindows.get, closingWindows.delete, pending.animation?.cancel, pending.finish|
|src/ui/desktop.js:1231|cancelWindowClose|declaration|需要进一步测试|closingWindows.get, closingWindows.delete, pending.animation?.cancel|
|src/ui/desktop.js:1239|dismissWindow|declaration|需要进一步测试|closingWindows.has, root.querySelector, root.getClientRects, canAnimate, finish, surface.getAnimations().forEach, surface.getAnimations, a.cancel, closingWindows.set, animate, pending.animation.finished       .catch(() => {})       .finally, pending.animation.finished       .catch, closingWindows.get, finishWindowClose|
|src/ui/desktop.js:1282|setupModals|declaration|需要进一步测试|top.el.getClientRects, top.el.contains, [         ...top.el.querySelectorAll(           'input:not([type=hidden]),button,select,textarea,[tabindex="0"]',         ),       ].find, top.el.querySelectorAll, el.getClientRects, target.focus, document.addEventListener, openStack.at, focusModal, known.set, openStack.find, openStack.filter, item.el.style.setProperty, item.el.style.removeProperty, item.focus.focus, item.focus.closest, cancelAnimations, Object.entries, document.getElementById, known.get, forgetModal, el.classList.contains, el.querySelector, surface.querySelectorAll, /取消／跳过／返回课堂/.test, surface.querySelector, document.createElement, button.setAttribute, surface.append, el.style.getPropertyValue, String, el.style.setProperty, openStack.push, dialog?.setAttribute, dialog.getAttribute, dialog.setAttribute, dialog.querySelector, dialog?.classList.add, Number, getComputedStyle, Math.min, Math.max, dialog.getBoundingClientRect, animate, canAnimate, stopConfetti, el.querySelectorAll(".podium-col").forEach, el.querySelectorAll, queueMicrotask, new MutationObserver(scan).observe, e.preventDefault, e.stopImmediatePropagation, top.close, [             ...top.el.querySelectorAll(               'button,input,select,textarea,a[href],[tabindex="0"]',             ),           ].filter, x.getClientRects, nodes.at, last.focus, first.focus, scan|
|src/ui/desktop.js:1284|focusModal|declaration|需要进一步测试|top.el.getClientRects, top.el.contains, [         ...top.el.querySelectorAll(           'input:not([type=hidden]),button,select,textarea,[tabindex="0"]',         ),       ].find, top.el.querySelectorAll, el.getClientRects, target.focus|
|src/ui/desktop.js:1305|forgetModal|declaration|需要进一步测试|known.set, openStack.find, openStack.filter, item.el.style.setProperty, item.el.style.removeProperty, openStack.at, top.el.contains, item.focus.focus, focusModal, item.focus.closest, cancelAnimations|
|src/ui/desktop.js:1328|scan|declaration|需要进一步测试|Object.entries, document.getElementById, known.get, openStack.find, forgetModal, el.classList.contains, el.getClientRects, el.querySelector, surface.querySelectorAll, /取消／跳过／返回课堂/.test, surface.querySelector, document.createElement, button.setAttribute, surface.append, known.set, el.style.getPropertyValue, String, el.style.setProperty, openStack.push, dialog?.setAttribute, dialog.getAttribute, dialog.setAttribute, dialog.querySelector, dialog?.classList.add, Number, getComputedStyle, Math.min, Math.max, dialog.getBoundingClientRect, animate, canAnimate, stopConfetti, el.querySelectorAll(".podium-col").forEach, el.querySelectorAll, queueMicrotask, openStack.at, focusModal|
|src/ui/desktop.js:1504|clearPickerReveal|declaration|需要进一步测试|$("#pickerModal")?.removeAttribute, $, pickerReelRestores.splice, restore|
|src/ui/desktop.js:1509|cancelPickerPreparation|declaration|需要进一步测试|clearPickerReveal, ClassroomFeedback.clearLive, ClassroomFeedback.cancel, BattleMotion.clear, $, button.removeAttribute, modal?.contains, a.cancel|
|src/ui/desktop.js:1526|isPickerCurrent|declaration|需要进一步测试|$("#pickerModal").classList.contains, $|
|src/ui/desktop.js:1532|togglePicker|declaration|需要进一步测试|stopSlotSpin, $, button.setAttribute, toggleSlotSpin, showToast, button.removeAttribute|
|src/ui/desktop.js:1559|pickerStopped|declaration|需要进一步测试|$, modal.classList.contains, clearPickerReveal, isPickerCurrent, button.removeAttribute, pickerChanged, ClassroomFeedback.picked, canAnimate, ClassroomFeedback.clearLive, complete, button.setAttribute, modal.querySelectorAll(".slot-reel-frame").forEach, modal.querySelectorAll, frame.getClientRects, frame.querySelector, ClassroomFeedback.takeLive, state.groups.map, state.groups.flatMap, (g.members ／／ []).map, document.createElement, strip.setAttribute, Math.max, row.append, node.cloneNode, studentLabelHTMLV218, strip.append, pendingActual.push, frame.append, pickerReelRestores.push, strip.remove, animate, pending.push, a.finished.catch, pendingActual.forEach, Promise.all(pending).then, Promise.all|
|src/ui/desktop.js:1568|complete|binding|需要进一步测试|isPickerCurrent, clearPickerReveal, button.removeAttribute, pickerChanged, ClassroomFeedback.picked|
|src/ui/desktop.js:1656|pickerChanged|declaration|需要进一步测试|pickerTargetGroup, state.groups.some, document       .querySelectorAll('#pickerModal button[onclick^="scorePicker"]')       .forEach, document       .querySelectorAll, animate, $|
|src/ui/desktop.js:1676|setupPicker|declaration|需要进一步测试|$, left.append, right.append, stats.removeAttribute, new MutationObserver(pickerChanged).observe, pickerChanged|
|src/ui/desktop.js:1699|prepareSettlement|declaration|需要进一步测试|$|
|src/ui/desktop.js:1704|cancelSettlement|declaration|需要进一步测试||
|src/ui/desktop.js:1707|settleFromUI|declaration|需要进一步测试|button.setAttribute, $, requestAnimationFrame, $("#settlementNameModal").classList.contains, confirmFinalSettlement, button.removeAttribute|
|src/ui/desktop.js:1742|init|declaration|需要进一步测试|JSON.parse, localStorage.getItem, Object.keys, ["full", "simple", "off"].includes, [0.75, 1, 1.5].includes, M.validateBank, console.warn, applyPreferences, syncViewport, window.addEventListener, matchMedia("(prefers-reduced-motion: reduce)").addEventListener, matchMedia, canAnimate, cancelAnimations, document.addEventListener, cancelSettingsMotion, document.querySelectorAll(".nav-tab").forEach, document.querySelectorAll, icon, b.setAttribute, setupDock, UI_ICON_TARGETS.forEach, $, applyUiIconsV26, setupSettings, setupPicker, setupModals, ClassroomFeedback.init, setupDisclosures, $("#settlementHistoryContainer").addEventListener, details.contains, a.cancel, details.querySelectorAll(".ui-podium>div").forEach, details.querySelectorAll, animate, t.addEventListener, Math.abs, Math.max, Math.min, e.preventDefault, t.scrollBy, new ResizeObserver(updateArrows).observe, renderArchives, viewChanged, renderWelcome, renderHistory, document         .querySelectorAll(           ".ui-welcome-head,.ui-group-card,.ui-daily-grid .ui-panel",         )         .forEach, document         .querySelectorAll|
|src/ui/desktop.js:1843|$("#uiGroupPrev").onclick|assignment|需要进一步测试|t.scrollBy, canAnimate|
|src/ui/desktop.js:1845|$("#uiGroupNext").onclick|assignment|需要进一步测试|t.scrollBy, canAnimate|
|src/ui/desktop.js:1848|$("#uiArchiveSearch").oninput|assignment|需要进一步测试|renderArchives|
|src/ui/desktop.js:1852|$("#uiArchiveSort").onchange|assignment|需要进一步测试|renderArchives|
|src/ui/desktop.js:1885|$("#uiSkipWelcome").onclick|assignment|需要进一步测试|cancelAnimations|
|src/ui/model.js:60|dayIndex|declaration|需要进一步测试|Math.floor, Date.UTC, d.getFullYear, d.getMonth, d.getDate|
|src/ui/model.js:65|daily|declaration|需要进一步测试|dayIndex|
|src/ui/model.js:70|differences|declaration|需要进一步测试|(before.groups ／／ []).map, (after.groups ／／ []).map, [...groups]           .sort((x, y) => Number(y.score) - Number(x.score))           .map, [...groups]           .sort, Number, rank, [...new Set([...a.keys(), ...b.keys()])].map, a.keys, b.keys, a.get, b.get, ra.get, rb.get|
|src/ui/model.js:73|rank|binding|需要进一步测试|[...groups]           .sort((x, y) => Number(y.score) - Number(x.score))           .map, [...groups]           .sort, Number|
|src/ui/model.js:109|validateBank|declaration|需要进一步测试|Array.isArray, Error, row.title.trim, row.source.trim, Object.values(row).some, Object.values, q.options.some, Number.isInteger|
|src/ui/model.js:150|standings|declaration|需要进一步测试|ordered.map, Number, scores.every, scores.reduce((sum, value) => sum + BigInt(value), 0n).toString, scores.reduce, BigInt, String|
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
|src/ui/battle-grid.js:2|renderBattleGridCards|declaration|需要进一步测试|document.getElementById, ensureGroupNumbersV213, [     ...grid.querySelectorAll(".group-row-card[data-group-id]"),   ].map, grid.querySelectorAll, String, grid.querySelectorAll(".group-row-card[data-group-id]").forEach, c.getBoundingClientRect, oldRects.set, desiredGroupsV213, ordered.map, oldOrderIds.some, ordered.forEach, document.createElement, rowCard.style.setProperty, readableTextOnColor, ["A", "B", "C", "D"]       .map((opt) => {         let cls = "opt-btn";         if (g.selectedOpt === opt) cls += " active";         if (state.evaluated && g.selectedOpt === opt) {           cls +=             " flip-reveal " + (opt === state.correctAns ? "correct" : "wrong");         }         return <button class="${cls} ${roundClass}" onclick="selectGroupOpt(${g.id},'${opt}')" ${state.evaluated ? "disabled" : ""}>${opt}</button>;       })       .join, ["A", "B", "C", "D"]       .map, [0, 1, 2]       .map((i) => {         const it = g.inventory?.[i];         return it           ? <div class="item-slot ${i === 0 ? "queue-main-slot" : "queue-secondary-slot"}" title="${escapeHtml(ITEM_DEFS[it.key]?.name ／／ "道具")}">${itemVisual(it.key)}${it.charges > 1 ? <span class="charges">${it.charges}</span> : ""}</div>           : <div class="item-slot ${i === 0 ? "queue-main-slot" : "queue-secondary-slot"} empty">＋</div>;       })       .join, [0, 1, 2]       .map, escapeHtml, itemVisual, groupNoTextV213, currentCardSortLabelV213, grid.appendChild, enhanceItemCards, console.warn, grid.querySelector, card.querySelector, ev.preventDefault, ev.stopPropagation, useItem, showToast, openItemWindow, card.querySelectorAll(".persistent-aura-v213").forEach, card.querySelectorAll, x.remove, card.appendChild, BattleMotion.restore, input.focus, input.select, oldRects.get, card.getBoundingClientRect, Math.abs, card.style.setProperty, moved.push, moved.forEach, requestAnimationFrame, setTimeout, card.style.removeProperty|
|src/ui/battle-grid.js:107|main.onclick|assignment|需要进一步测试|ev.preventDefault, ev.stopPropagation, useItem, showToast|
|src/ui/battle-grid.js:116|more.onclick|assignment|需要进一步测试|ev.preventDefault, ev.stopPropagation, openItemWindow|
|src/ui/battle-grid.js:194|decorateBattleRanks|declaration|需要进一步测试|ranking().map, ranking, document     .querySelectorAll(".group-row-card.v213-card[data-group-id]")     .forEach, document     .querySelectorAll, Number, card.querySelector, wrap.querySelector, document.createElement, wrap.appendChild, ranks.get, currentCardSortLabelV213|
|src/ui/battle-grid.js:214|decorateRoundItemLocks|declaration|需要进一步测试|state.groups.forEach, document.querySelector, card.querySelector, allIn.classList.add, main.classList.add|
|src/ui/render.js:4|renderAll|declaration|需要进一步测试|clearTimeout, setTimeout, refreshPages|
|src/ui/render.js:23|refreshPages|declaration|需要进一步测试|renderLockStatus, renderControls, renderGrid, updateHeaderStats, renderChart, renderDashboard, updateResizerUI, renderWelcomePage, updateWelcomeTrackIfNeeded|
|src/ui/render.js:35|renderGrid|declaration|需要进一步测试|applyHeldDisplayScoresV21732, setTimeout, refreshBattleGrid, restoreHeldScoreElementsV21732|
|src/ui/render.js:53|refreshBattleGrid|declaration|需要进一步测试|renderBattleGridCards, decorateBattleRanks, decorateRoundItemLocks, renderBattleRankPreviewV21721, console.warn|

## 捕获别名与覆盖链

|位置|别名|捕获的旧入口|分类|
|---|---|---|---|
|src/script/00.js:4592|_itemBaseJudgeRound|legacyJudgeRound|需要进一步测试|
|src/script/00.js:4634|_v2OpenPicker|openPickerModal|需要进一步测试|
|src/script/00.js:4639|_v2StopSlot|stopSlotSpin|需要进一步测试|
|src/script/00.js:4710|_v2RenderItemWindow|renderItemWindow|需要进一步测试|
|src/script/00.js:4715|_v2Enhance|enhanceItemCards|需要进一步测试|
|src/script/00.js:4716|_v2RenderItemWindowIcons|renderItemWindow|需要进一步测试|
|src/script/00.js:4719|_v2Judge|legacyJudgeRound|需要进一步测试|
|src/script/00.js:4724|_v2SwitchView|switchView|需要进一步测试|
|src/script/00.js:4739|_v21CloseHandRaise|closeHandRaise|需要进一步测试|
|src/script/00.js:4742|_v21SelectHandGroup|selectHandGroup|需要进一步测试|
|src/script/00.js:4748|_v21JudgeHandRaise|judgeHandRaise|需要进一步测试|
|src/script/00.js:4858|useItemBeforeVisualDispatch|legacyUseItem|需要进一步测试|
|src/script/00.js:5087|_v25ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/script/00.js:5155|_v26ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/script/00.js:5157|_v26TinyDefense|tinyDefenseToast|需要进一步测试|
|src/script/00.js:5164|_v26GlobalDraw|globalItemDraw|需要进一步测试|
|src/script/00.js:5165|_v26HandDraw|handDrawItem|需要进一步测试|
|src/script/00.js:5516|_v282UseItem|legacyUseItem|需要进一步测试|
|src/script/00.js:5662|_v282UseItemWithIce|legacyUseItem|需要进一步测试|
|src/script/00.js:5796|_v283OpenGroupModal|openGroupModal|需要进一步测试|
|src/script/00.js:5800|_v283RenderGroupModal|renderGroupModal|需要进一步测试|
|src/script/00.js:5842|_v284RenderAbout|renderAbout|需要进一步测试|
|src/script/00.js:5900|_v291GlobalItemDraw|globalItemDraw|需要进一步测试|
|src/script/00.js:5905|_v291UseItem|legacyUseItem|需要进一步测试|
|src/script/00.js:5911|_v291OpenItemWindow|openItemWindow|需要进一步测试|
|src/script/00.js:5973|previousUseItemV299|legacyUseItem|需要进一步测试|
|src/script/00.js:6023|previousUseItemV2113|legacyUseItem|需要进一步测试|
|src/script/00.js:6281|_v2116ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/script/00.js:6334|_v2120UseItem|legacyUseItem|需要进一步测试|
|src/script/00.js:6390|_v2120RenderItemWindow|renderItemWindow|需要进一步测试|
|src/script/00.js:6442|_v2120EnhanceItemCards|enhanceItemCards|需要进一步测试|
|src/script/00.js:6482|_v2120HandUseNewItem|handUseNewItem|需要进一步测试|
|src/script/01.js:55|_v213Batch|applySettingsBatchMembers|需要进一步测试|
|src/script/01.js:66|_v213UseItem|legacyUseItem|需要进一步测试|
|src/script/02.js:58|_v214JudgeHandRaise|judgeHandRaise|需要进一步测试|
|src/script/03.js:12|oldSwitchV216|switchView|需要进一步测试|
|src/script/04.js:11|_v2164JudgeRound|legacyJudgeRound|需要进一步测试|
|src/script/04.js:154|_v2164PlaySoundBase|playSound|需要进一步测试|
|src/script/04.js:203|_v2164GlobalItemDraw|globalItemDraw|需要进一步测试|
|src/script/04.js:214|_v2164HandDrawItem|handDrawItem|需要进一步测试|
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
|src/script/12.js:57|_v2177UseItem|legacyUseItem|需要进一步测试|
|src/script/12.js:82|_v2177ToggleAllInCard|toggleAllInCard|需要进一步测试|
|src/script/12.js:95|_v2177FinishStartRound|finishStartRound|需要进一步测试|
|src/script/12.js:102|_v2177QueueUseState|queueUseStateV2120|需要进一步测试|
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
|src/script/31.js:149|_v21732UseItem|legacyUseItem|需要进一步测试|
|src/script/32.js:39|_v21731EnsureItemState|ensureItemState|需要进一步测试|
|src/script/35.js:30|_v21735ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/script/36.js:44|_v218RenderBattleRankPreview|renderBattleRankPreviewV21721|需要进一步测试|
|src/script/36.js:223|_v218UseItemBalance|legacyUseItem|需要进一步测试|
|src/script/36.js:341|_v218QueueState|queueUseStateV2120|需要进一步测试|
|src/script/36.js:361|_v218JudgeRound|legacyJudgeRound|需要进一步测试|
|src/script/36.js:394|_v218UseItemIceCleanup|legacyUseItem|需要进一步测试|
|src/script/36.js:414|_v218ItemDropWeights|itemDropWeights|需要进一步测试|
|src/script/36.js:427|_v218PickItem|pickItemForGroupV281|需要进一步测试|
|src/script/36.js:524|_v218JudgeHandRaise|judgeHandRaise|需要进一步测试|
|src/script/36.js:574|_v218RenderAbout|renderAbout|需要进一步测试|
|src/script/37.js:102|_v2182RenderItemWindow|renderItemWindow|需要进一步测试|
|src/script/37.js:111|_v2182AdminAddItem|adminAddItem|需要进一步测试|
|src/script/38.js:63|_v2184RenderAbout|renderAbout|需要进一步测试|
|src/script/39.js:100|_v2185RenderLockState|renderLockState|需要进一步测试|
|src/script/41.js:36|_v2187RenderAbout|renderAbout|需要进一步测试|
|src/script/41.js:72|_v2187OpenPwdModal|openPwdModal|需要进一步测试|
|src/script/42.js:29|_v2189UseItem|legacyUseItem|需要进一步测试|
|src/script/43.js:17|_v21811RenderAbout|renderAbout|需要进一步测试|

## 变量（包括全局候选与局部变量，作用域需结合源码）

|位置|绑定|初始化表达式|分类|
|---|---|---|---|
|src/core/action-sounds.js:2|ActionSounds|(() => {   const definitions = [     ["nav", "页面导航", "导航与窗口", 1040],     ["open", "打开功能窗口", "导航与窗口", 960],     ["close", "关闭与返回", "导航与窗口", 760],     ["expand", |需要进一步测试|
|src/core/action-sounds.js:3|definitions|[     ["nav", "页面导航", "导航与窗口", 1040],     ["open", "打开功能窗口", "导航与窗口", 960],     ["close", "关闭与返回", "导航与窗口", 760],     ["expand", "展开与收起", "导航与窗口", 880],     ["a|需要进一步测试|
|src/core/action-sounds.js:27|slots|definitions.map(([key, name, category, pitch]) => ({     id: "ui_button_" + key,     name,     category,     pitch,     desc: "独立按钮音效；未上传时继承通用按钮音效",   }))|需要进一步测试|
|src/core/action-sounds.js:34|isClick|(id) => id === "ui_click" ／／ slots.some((x) => x.id === id)|需要进一步测试|
|src/core/action-sounds.js:36|explicit|button.dataset.soundSlot|需要进一步测试|
|src/core/action-sounds.js:38|code|button.getAttribute("onclick") ／／ button.onclick?.toString() ／／ ""|需要进一步测试|
|src/core/action-sounds.js:40|text|button.textContent.trim()|需要进一步测试|
|src/core/action-sounds.js:41|key||需要进一步测试|
|src/core/classroom.js:17|data|Reliability.validateBackup(raw)|需要进一步测试|
|src/core/classroom.js:20|p|data.picker|需要进一步测试|
|src/core/classroom.js:27|k||需要进一步测试|
|src/core/classroom.js:28|k||需要进一步测试|
|src/core/classroom.js:32|r|data.round|需要进一步测试|
|src/core/classroom.js:42|[k,min,max]||需要进一步测试|
|src/core/classroom.js:45|k||需要进一步测试|
|src/core/classroom.js:54|old|clone(state)|需要进一步测试|
|src/core/classroom.js:54|history|clone(historyStack)|需要进一步测试|
|src/core/classroom.js:54|first|firstHandDrawPendingV218|需要进一步测试|
|src/core/classroom.js:59|result|saveState()|需要进一步测试|
|src/core/classroom.js:70|alreadyUnsaved|!!window.classroomUnsavedChanges|需要进一步测试|
|src/core/classroom.js:73|warning|document.getElementById('classroomSaveWarning')|需要进一步测试|
|src/core/classroom.js:78|classroomCommands|CommandLifecycle.create({   active:()=>!!window.itemCommandActive,   setActive:value=>{window.itemCommandActive=value},   invalidate:()=>Reliability.invalidateD|需要进一步测试|
|src/core/classroom.js:86|liveGroups|new Map(state.groups.map(g=>[g.id,g]))|需要进一步测试|
|src/core/classroom.js:87|restored|before.state|需要进一步测试|
|src/core/classroom.js:89|live|liveGroups.get(g.id)|需要进一步测试|
|src/core/classroom.js:120|g|state.groups.find(x=>x.id===groupId)|需要进一步测试|
|src/core/classroom.js:121|reason|Reliability.validateItem(state,g,index,isCommunismMode())|需要进一步测试|
|src/core/classroom.js:124|key|g.inventory[index].key|需要进一步测试|
|src/core/classroom.js:127|beforeValue|itemCommandSnapshot()|需要进一步测试|
|src/core/classroom.js:135|result|legacyUseItem(groupId,index)|需要进一步测试|
|src/core/classroom.js:143|classroomStoredState|null|需要进一步测试|
|src/core/classroom.js:166|classroomDock|document.querySelector('.bottom-dock')|需要进一步测试|
|src/core/commands.js:2|CommandLifecycle|(() => {   function create(host) {     let current = null;     function cancel(reason = "cancelled") {       const tx = current;       if (!tx) return false;   |需要进一步测试|
|src/core/commands.js:4|current|null|需要进一步测试|
|src/core/commands.js:6|tx|current|需要进一步测试|
|src/core/commands.js:25|saved|host.persist()|需要进一步测试|
|src/core/commands.js:50|tx|{         before: host.snapshot(),         waiting: 0,         retainOnPersistenceFailure:           options.retainOnPersistenceFailure !== false,       }|需要进一步测试|
|src/core/commands.js:60|result|operation()|需要进一步测试|
|src/core/commands.js:78|tx|current|需要进一步测试|
|src/core/history.js:2|HistorySnapshots|{   capture(s, desc, time) {     const copy = (value) => JSON.parse(JSON.stringify(value));     return {       desc,       time,       groups: copy(s.groups),  |需要进一步测试|
|src/core/history.js:4|copy|(value) => JSON.parse(JSON.stringify(value))|需要进一步测试|
|src/core/history.js:24|snapshot|HistorySnapshots.capture(     state,     actionDesc,     new Date().toLocaleTimeString(),   )|需要进一步测试|
|src/core/history.js:40|ok|STORAGE.setJSON(V26_HISTORY_KEY, historyStack.slice(-MAX_HISTORY))|需要进一步测试|
|src/core/history.js:75|prev|historyStack.pop()|需要进一步测试|
|src/core/item-score.js:39|type|g.itemEffect.type|需要进一步测试|
|src/core/item-score.js:45|ix|g.inventory.findIndex((x) => x.key === "mega")|需要进一步测试|
|src/core/item-score.js:59|main|g.inventory?.[0]|需要进一步测试|
|src/core/item-score.js:84|canBlock|attackType === "spiny" ? main.key === "horn" : true|需要进一步测试|
|src/core/item-score.js:96|mi|g.inventory?.[0] &&       ["mushroom", "triple_mushroom"].includes(g.inventory[0].key)         ? 0         : -1|需要进一步测试|
|src/core/item-score.js:110|horn|key === "horn"|需要进一步测试|
|src/core/item-score.js:111|flag|horn       ? "__spinyHornDecisionPendingV218"       : "__spinyDecisionPendingV21727"|需要进一步测试|
|src/core/item-score.js:114|declined|horn     ? "__spinyHornDeclinedV218"     : "__spinyMushroomDeclinedV21727"|需要进一步测试|
|src/core/item-score.js:118|decision|Reliability.captureDefenseDecision(state, target, key)|需要进一步测试|
|src/core/item-score.js:119|name|ITEM_DEFS[key]?.name ／／ "蘑菇"|需要进一步测试|
|src/core/item-score.js:120|prompt|themeConfirm(     ${target.name} 遭遇刺龟壳！\n是否主动消耗主要道具 ${name} 抵消本次攻击？,     {       title: "刺龟壳来袭",       confirmText: horn ? "使用超级喇叭" : "使用蘑菇闪避",       cancelTe|需要进一步测试|
|src/core/item-score.js:128|clear|() => {     target[flag] = false;   }|需要进一步测试|
|src/core/item-score.js:161|result||需要进一步测试|
|src/core/item-score.js:167|before|target.score|需要进一步测试|
|src/core/item-score.js:173|liveState|state|需要进一步测试|
|src/core/item-score.js:187|before|target ? Number(target.score) ／／ 0 : null|需要进一步测试|
|src/core/item-score.js:190|result||需要进一步测试|
|src/core/item-score.js:193|main|target.inventory?.[0]|需要进一步测试|
|src/core/reliability.js:2|Reliability|(() => {   const schemaVersion = 1;   const stateKey = 'godpower_state_v1';   function validateBackup(data) {     if (!data ／／ typeof data !== 'object' ／／ Array|需要进一步测试|
|src/core/reliability.js:3|schemaVersion|1|需要进一步测试|
|src/core/reliability.js:4|stateKey|'godpower_state_v1'|需要进一步测试|
|src/core/reliability.js:20|h||需要进一步测试|
|src/core/reliability.js:29|text|JSON.stringify(data)|需要进一步测试|
|src/core/reliability.js:37|raw|storage.getItem('politics_settlement_history')|需要进一步测试|
|src/core/reliability.js:38|list|raw==null?[]:JSON.parse(raw)|需要进一步测试|
|src/core/reliability.js:55|key|g.inventory[index].key|需要进一步测试|
|src/core/reliability.js:56|continuation|['triple_green','triple_red','triple_banana','triple_mushroom'].includes(key)&&g.roundItemContinuationKeyV218===key|需要进一步测试|
|src/core/reliability.js:62|defenseDecisionEpoch|0|需要进一步测试|
|src/core/reliability.js:63|defenseInvalidationHandlers|new Set()|需要进一步测试|
|src/core/reliability.js:73|handler||需要进一步测试|
|src/core/reliability.js:77|item|target?.inventory?.[0]|需要进一步测试|
|src/core/reliability.js:95|groupMap|new Map(groups.map(g=>[g.id,g]))|需要进一步测试|
|src/core/reliability.js:97|g|groupMap.get(id)|需要进一步测试|
|src/core/reliability.js:99|old|Number(g.score)|需要进一步测试|
|src/core/reliability.js:99|delta|points*count|需要进一步测试|
|src/core/reliability.js:99|score|old+delta|需要进一步测试|
|src/core/reliability.js:107|n|Number(value)|需要进一步测试|
|src/core/reliability.js:111|out|{}|需要进一步测试|
|src/core/reliability.js:113|k||需要进一步测试|
|src/core/reliability.js:119|score|Number(g.score)|需要进一步测试|
|src/core/reliability.js:122|correct|g.selectedOpt===s.correctAns|需要进一步测试|
|src/core/reliability.js:135|CLASSROOM_STORAGE|{   getItem(key){return localStorage.getItem(key)},   setItem(key,value){localStorage.setItem(key,value)} }|需要进一步测试|
|src/script/00.js:9|commit|finish ／／ (() => root.classList.remove('active'))|需要进一步测试|
|src/script/00.js:15|DEFAULT_COLORS|['#E5484D', '#2F7DD1', '#3A9D5D', '#F08C1A', '#8E44AD', '#18A6B8', '#4F64D8', '#D84A83', '#D95D39', '#159E91', '#6FA52E', '#A05BE5', '#C58B14', '#D94F70', '#258|需要进一步测试|
|src/script/00.js:18|raw|String(hex／／'').trim().replace('#','')|需要进一步测试|
|src/script/00.js:19|value|raw.length===3?raw.split('').map(x=>x+x).join(''):raw|需要进一步测试|
|src/script/00.js:21|rgb|[0,2,4].map(i=>parseInt(value.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4))|需要进一步测试|
|src/script/00.js:22|luminance|.2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]|需要进一步测试|
|src/script/00.js:26|FX_SOUND_SLOTS|[   ...ActionSounds.slots,   { id: 'score_add', name: '基础加分 (+1 / +2)', desc: '复古方波金币音' },   { id: 'score_sub', name: '基础扣分 (-1 / -2)', desc: '低沉方波震动音' },   { i|需要进一步测试|
|src/script/00.js:41|SET_TRACK_TYPES|[   { key: 'intro_normal', name: '常规 Intro 1', desc: '开局引子或无 All in 衔接' },   { key: 'intro_win', name: '胜利翻盘 Intro 2', desc: '上一题 All in 成功多于失败' },   { key: 'in|需要进一步测试|
|src/script/00.js:55|STORAGE|{   get(key, fallback = null) {     try { return localStorage.getItem(key) ?? fallback; } catch (_) { return fallback; }   },   set(key, value) {     try { loca|需要进一步测试|
|src/script/00.js:64|raw|localStorage.getItem(key)|需要进一步测试|
|src/script/00.js:73|clone|value => JSON.parse(JSON.stringify(value))|需要进一步测试|
|src/script/00.js:75|state|{   isLocked: true,   hasStartedOnce: false,   roundActive: false,   lastRoundAllIn: null,   adminPin: STORAGE.get('politics_admin_pin', '1234'),   soundEnabled|需要进一步测试|
|src/script/00.js:105|saved|STORAGE.getJSON('politics_groups_data', null)|需要进一步测试|
|src/script/00.js:107|parsedPicker|STORAGE.getJSON('politics_picker_state', null)|需要进一步测试|
|src/script/00.js:123|source|raw && typeof raw === 'object' ? raw : {}|需要进一步测试|
|src/script/00.js:124|numericScore|Number(source.score)|需要进一步测试|
|src/script/00.js:125|id|Number.isFinite(Number(source.id)) ? Number(source.id) : Date.now() + index|需要进一步测试|
|src/script/00.js:127|color|/^#[0-9a-fA-F]{6}$/.test(String(source.color ／／ ''))     ? String(source.color) : DEFAULT_COLORS[index % DEFAULT_COLORS.length]|需要进一步测试|
|src/script/00.js:129|members|Array.isArray(source.members)     ? Array.from(new Set(source.members.map(v => String(v ?? '').trim()).filter(Boolean)))     : []|需要进一步测试|
|src/script/00.js:156|seen|new Set()|需要进一步测试|
|src/script/00.js:158|g|normalizeGroup(raw, index)|需要进一步测试|
|src/script/00.js:189|MAX_HISTORY|40|需要进一步测试|
|src/script/00.js:190|historyStack|[]|需要进一步测试|
|src/script/00.js:192|audioCtx|null|需要进一步测试|
|src/script/00.js:193|masterGainNode|null|需要进一步测试|
|src/script/00.js:194|db|null|需要进一步测试|
|src/script/00.js:195|customFxBuffers|{}|需要进一步测试|
|src/script/00.js:196|customFxVariants|Object.create(null)|需要进一步测试|
|src/script/00.js:197|currentUploadingAppend|false|需要进一步测试|
|src/script/00.js:198|activeSetBuffers|{}|需要进一步测试|
|src/script/00.js:199|currentUploadingSlot|null|需要进一步测试|
|src/script/00.js:200|activeEditingGroupId|null|需要进一步测试|
|src/script/00.js:202|slotEngine|{   isSpinning: false,   timerGroup: null,   timerStudent: null,   chosenResult: null }|需要进一步测试|
|src/script/00.js:209|bgmShufflePool|[]|需要进一步测试|
|src/script/00.js:210|currentSetIndex|-1|需要进一步测试|
|src/script/00.js:211|isSwitchingRound|false|需要进一步测试|
|src/script/00.js:212|isStartingRound|false|需要进一步测试|
|src/script/00.js:215|total|state.groups.length|需要进一步测试|
|src/script/00.js:217|count|state.groups.filter(g => g.allIn).length|需要进一步测试|
|src/script/00.js:222|confettiAnimationId|null|需要进一步测试|
|src/script/00.js:223|confettiParticles|[]|需要进一步测试|
|src/script/00.js:242|now|new Date()|需要进一步测试|
|src/script/00.js:243|y|now.getFullYear()|需要进一步测试|
|src/script/00.js:244|m|String(now.getMonth() + 1).padStart(2, '0')|需要进一步测试|
|src/script/00.js:245|d|String(now.getDate()).padStart(2, '0')|需要进一步测试|
|src/script/00.js:246|defaultTitle|${y}年${m}月${d}日 积分结算|需要进一步测试|
|src/script/00.js:248|input|document.getElementById('settlementNameInput')|需要进一步测试|
|src/script/00.js:269|input|document.getElementById('settlementNameInput')|需要进一步测试|
|src/script/00.js:270|title|(input ? input.value.trim() : '') ／／ '积分结算'|需要进一步测试|
|src/script/00.js:273|sorted|[...state.groups].sort((a, b) => (Number(b.score) ／／ 0) - (Number(a.score) ／／ 0))|需要进一步测试|
|src/script/00.js:274|top1|sorted[0]|需要进一步测试|
|src/script/00.js:275|top2|sorted[1]|需要进一步测试|
|src/script/00.js:276|top3|sorted[2]|需要进一步测试|
|src/script/00.js:278|record|{     id: Date.now(),     title: title,     date: new Date().toLocaleDateString(),     time: new Date().toLocaleString(),     champion: top1 ? top1.name : '无', |需要进一步测试|
|src/script/00.js:288|archiveResult|saveSettlementRecord(record)|需要进一步测试|
|src/script/00.js:293|beforeReset|clone(state)|需要进一步测试|
|src/script/00.js:293|beforeHistory|clone(historyStack)|需要进一步测试|
|src/script/00.js:303|grandTitle|document.getElementById('grandModalTitle')|需要进一步测试|
|src/script/00.js:305|grandPodium|document.getElementById('grandPodiumDeck')|需要进一步测试|
|src/script/00.js:329|resetResult|saveState()|需要进一步测试|
|src/script/00.js:341|canvas|document.getElementById('confettiCanvas')|需要进一步测试|
|src/script/00.js:343|ctx|canvas.getContext('2d')|需要进一步测试|
|src/script/00.js:347|colors|['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#fde047']|需要进一步测试|
|src/script/00.js:349|i|0|需要进一步测试|
|src/script/00.js:405|host|document.getElementById('archiveClassStats')|需要进一步测试|
|src/script/00.js:407|itemGlobal|state.itemGlobal ／／ {}|需要进一步测试|
|src/script/00.js:408|answers|state.groups.reduce((total, group) => {     const stats = group.itemStats ／／ {};     return total + Number(stats.correct ／／ 0) + Number(stats.wrong ／／ 0);   }, |需要进一步测试|
|src/script/00.js:409|stats|group.itemStats ／／ {}|需要进一步测试|
|src/script/00.js:412|metrics|[     ['课堂作答', answers, '次'],     ['答题轮次', Number(itemGlobal.pkTotal ／／ 0), '轮'],     ['全局道具发放', Number(itemGlobal.totalDraws ／／ 0), '件'],     ['手动举手', Number(i|需要进一步测试|
|src/script/00.js:426|list|getSettlementHistory()|需要进一步测试|
|src/script/00.js:427|record|list[index]|需要进一步测试|
|src/script/00.js:430|csvContent|"\uFEFF排名,小组名称,最终得分,组员名单\n"|需要进一步测试|
|src/script/00.js:432|members|(g.members ／／ []).join(' / ')|需要进一步测试|
|src/script/00.js:436|blob|new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })|需要进一步测试|
|src/script/00.js:437|url|URL.createObjectURL(blob)|需要进一步测试|
|src/script/00.js:438|a|document.createElement('a')|需要进一步测试|
|src/script/00.js:447|list|getSettlementHistory()|需要进一步测试|
|src/script/00.js:462|list|getSettlementHistory()|需要进一步测试|
|src/script/00.js:470|soundIdCache|new Set()|需要进一步测试|
|src/script/00.js:471|fxSoundsLoaded|false|需要进一步测试|
|src/script/00.js:472|fxSoundsLoading|null|需要进一步测试|
|src/script/00.js:473|backgroundAudioInitTimer|null|需要进一步测试|
|src/script/00.js:474|dbInitPromise|null|需要进一步测试|
|src/script/00.js:487|tx|db.transaction('sounds', 'readonly')|需要进一步测试|
|src/script/00.js:488|store|tx.objectStore('sounds')|需要进一步测试|
|src/script/00.js:489|req|store.getAllKeys()|需要进一步测试|
|src/script/00.js:505|bgmEngine|{   state: 'IDLE',   syncStartTime: 0,   battleGain: null,   thinkingGain: null,   activeNodes: [],   victoryNode: null,   preloadedSet: null,   isPreloading: f|需要进一步测试|
|src/script/00.js:520|effectiveBpm|(currentSetIndex === 7)     ? (Number(menuCfg.battleSet8Bpm) ／／ 135)     : (Number(menuCfg.battleBaseBpm) ／／ Number(state.bpm) ／／ 130)|需要进一步测试|
|src/script/00.js:529|now|audioCtx.currentTime|需要进一步测试|
|src/script/00.js:530|elapsed|Math.max(0, now - bgmEngine.syncStartTime)|需要进一步测试|
|src/script/00.js:531|secPerBeat|getSecPerBeat()|需要进一步测试|
|src/script/00.js:532|loopStartSec|8 * secPerBeat|需要进一步测试|
|src/script/00.js:533|loopEndSec|184 * secPerBeat|需要进一步测试|
|src/script/00.js:534|loopDurationSec|loopEndSec - loopStartSec|需要进一步测试|
|src/script/00.js:536|currentSecInTrack||需要进一步测试|
|src/script/00.js:564|nodes|document.querySelectorAll('#historyListView .hist-node')|需要进一步测试|
|src/script/00.js:565|node|nodes[nodes.length - 1 - index]|需要进一步测试|
|src/script/00.js:583|target|historyStack[index]|需要进一步测试|
|src/script/00.js:597|request|indexedDB.open('PoliticsScoreSoundDB_Unified', 1)|需要进一步测试|
|src/script/00.js:600|database|e.target.result|需要进一步测试|
|src/script/00.js:627|migrationDone|STORAGE.get('politics_audio_migration_v1', '0') === '1'|需要进一步测试|
|src/script/00.js:643|legacyNames|['PoliticsScoreSoundDB_v3', 'PoliticsScoreSoundDB']|需要进一步测试|
|src/script/00.js:644|oldName||需要进一步测试|
|src/script/00.js:647|req|indexedDB.open(oldName)|需要进一步测试|
|src/script/00.js:649|oldDb|ev.target.result|需要进一步测试|
|src/script/00.js:651|txOld|oldDb.transaction('sounds', 'readonly')|需要进一步测试|
|src/script/00.js:652|storeOld|txOld.objectStore('sounds')|需要进一步测试|
|src/script/00.js:653|getAllReq|storeOld.getAll()|需要进一步测试|
|src/script/00.js:655|records|getAllReq.result ／／ []|需要进一步测试|
|src/script/00.js:657|txNew|db.transaction('sounds', 'readwrite')|需要进一步测试|
|src/script/00.js:658|storeNew|txNew.objectStore('sounds')|需要进一步测试|
|src/script/00.js:660|newId|rec.id|需要进一步测试|
|src/script/00.js:682|AudioContextClass|window.AudioContext ／／ window.webkitAudioContext|需要进一步测试|
|src/script/00.js:710|records|await new Promise(resolve => {         const tx = db.transaction('sounds', 'readonly');         const store = tx.objectStore('sounds');         const req = stor|需要进一步测试|
|src/script/00.js:711|tx|db.transaction('sounds', 'readonly')|需要进一步测试|
|src/script/00.js:712|store|tx.objectStore('sounds')|需要进一步测试|
|src/script/00.js:713|req|store.getAll()|需要进一步测试|
|src/script/00.js:718|ctx|await getAudioContext()|需要进一步测试|
|src/script/00.js:719|fxRecords|records.filter(item =>         item && typeof item.id === 'string' &&         item.id.startsWith('fx_') &&         item.arrayBuffer && item.arrayBuffer.byteLeng|需要进一步测试|
|src/script/00.js:725|variants|Object.create(null)|需要进一步测试|
|src/script/00.js:728|decoded|await ctx.decodeAudioData(item.arrayBuffer.slice(0))|需要进一步测试|
|src/script/00.js:729|key|item.id.slice(3)|需要进一步测试|
|src/script/00.js:729|split|key.indexOf('::variant::')|需要进一步测试|
|src/script/00.js:730|slot|key.slice(0,split)|需要进一步测试|
|src/script/00.js:749|candidates|[customFxBuffers[slotId],...(customFxVariants[slotId]／／[]).map(x=>x.buffer)].filter(Boolean)|需要进一步测试|
|src/script/00.js:755|choices|customFxVariants[slotId]／／[]|需要进一步测试|
|src/script/00.js:755|count|choices.length+(customFxBuffers[slotId]?1:0)|需要进一步测试|
|src/script/00.js:761|tx|db.transaction('sounds','readwrite')|需要进一步测试|
|src/script/00.js:762|slot|id.slice(3,id.indexOf('::variant::'))|需要进一步测试|
|src/script/00.js:770|doCheck|() => {     const isMenuSet = setIdx === 8;     const trackTypes = isMenuSet ? MENU_SET_TRACK_TYPES : SET_TRACK_TYPES;     const prefix = isMenuSet ? 'bgm_menu_|需要进一步测试|
|src/script/00.js:771|isMenuSet|setIdx === 8|需要进一步测试|
|src/script/00.js:772|trackTypes|isMenuSet ? MENU_SET_TRACK_TYPES : SET_TRACK_TYPES|需要进一步测试|
|src/script/00.js:773|prefix|isMenuSet ? 'bgm_menu_' : bgm_set_${setIdx}_|需要进一步测试|
|src/script/00.js:775|count|0|需要进一步测试|
|src/script/00.js:776|hasThinking|false|需要进一步测试|
|src/script/00.js:777|hasBattle|false|需要进一步测试|
|src/script/00.js:779|t||需要进一步测试|
|src/script/00.js:780|id|prefix + t.key|需要进一步测试|
|src/script/00.js:802|completeIndices|[]|需要进一步测试|
|src/script/00.js:803|i|0|需要进一步测试|
|src/script/00.js:804|res|await checkSetCompleteness(i)|需要进一步测试|
|src/script/00.js:811|i|0|需要进一步测试|
|src/script/00.js:812|res|await checkSetCompleteness(i)|需要进一步测试|
|src/script/00.js:819|completeSets|await getAllCompleteSetIndices()|需要进一步测试|
|src/script/00.js:824|i|bgmShufflePool.length - 1|需要进一步测试|
|src/script/00.js:825|j|Math.floor(Math.random() * (i + 1))|需要进一步测试|
|src/script/00.js:832|fallbackIdx|await getFallbackSetIndex()|需要进一步测试|
|src/script/00.js:844|rawDict|await new Promise(resolve => {       const tx = db.transaction('sounds', 'readonly');       const store = tx.objectStore('sounds');       const dict = {};      |需要进一步测试|
|src/script/00.js:845|tx|db.transaction('sounds', 'readonly')|需要进一步测试|
|src/script/00.js:846|store|tx.objectStore('sounds')|需要进一步测试|
|src/script/00.js:847|dict|{}|需要进一步测试|
|src/script/00.js:848|pending|SET_TRACK_TYPES.length|需要进一步测试|
|src/script/00.js:856|id|bgm_set_${setIdx}_${t.key}|需要进一步测试|
|src/script/00.js:857|req|store.get(id)|需要进一步测试|
|src/script/00.js:870|ctx|await getAudioContext()|需要进一步测试|
|src/script/00.js:871|entries|Object.entries(rawDict)|需要进一步测试|
|src/script/00.js:872|total|entries.length|需要进一步测试|
|src/script/00.js:879|loadedCount|0|需要进一步测试|
|src/script/00.js:880|buffers|{}|需要进一步测试|
|src/script/00.js:903|{ setIndex, isFallback }|await pickNextPlayableSetIndex()|需要进一步测试|
|src/script/00.js:905|buffers|await fetchAndDecodeSetBuffers(setIndex)|需要进一步测试|
|src/script/00.js:915|buttonTone|ActionSounds.slots.find(x=>x.id===slotId)|需要进一步测试|
|src/script/00.js:919|now|audioCtx.currentTime|需要进一步测试|
|src/script/00.js:922|osc|audioCtx.createOscillator()|需要进一步测试|
|src/script/00.js:923|gain|audioCtx.createGain()|需要进一步测试|
|src/script/00.js:934|osc|audioCtx.createOscillator()|需要进一步测试|
|src/script/00.js:935|gain|audioCtx.createGain()|需要进一步测试|
|src/script/00.js:946|freqs|[523.25, 659.25, 783.99, 1046.50]|需要进一步测试|
|src/script/00.js:948|osc|audioCtx.createOscillator()|需要进一步测试|
|src/script/00.js:949|gain|audioCtx.createGain()|需要进一步测试|
|src/script/00.js:960|osc|audioCtx.createOscillator()|需要进一步测试|
|src/script/00.js:961|gain|audioCtx.createGain()|需要进一步测试|
|src/script/00.js:974|osc|audioCtx.createOscillator()|需要进一步测试|
|src/script/00.js:975|gain|audioCtx.createGain()|需要进一步测试|
|src/script/00.js:986|notes|[523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50]|需要进一步测试|
|src/script/00.js:988|osc|audioCtx.createOscillator()|需要进一步测试|
|src/script/00.js:989|gain|audioCtx.createGain()|需要进一步测试|
|src/script/00.js:1000|osc|audioCtx.createOscillator()|需要进一步测试|
|src/script/00.js:1001|gain|audioCtx.createGain()|需要进一步测试|
|src/script/00.js:1012|osc|audioCtx.createOscillator()|需要进一步测试|
|src/script/00.js:1013|gain|audioCtx.createGain()|需要进一步测试|
|src/script/00.js:1023|osc|audioCtx.createOscillator()|需要进一步测试|
|src/script/00.js:1024|gain|audioCtx.createGain()|需要进一步测试|
|src/script/00.js:1035|osc|audioCtx.createOscillator()|需要进一步测试|
|src/script/00.js:1036|gain|audioCtx.createGain()|需要进一步测试|
|src/script/00.js:1054|selectedFx|selectFxBuffer(slotId)／／(ActionSounds.isClick(slotId)&&slotId!=='ui_click'?selectFxBuffer('ui_click'):null)|需要进一步测试|
|src/script/00.js:1056|source|audioCtx.createBufferSource()|需要进一步测试|
|src/script/00.js:1059|gain|audioCtx.createGain()|需要进一步测试|
|src/script/00.js:1068|activeLoopTimeouts|[]|需要进一步测试|
|src/script/00.js:1077|battleBuf|activeSetBuffers['battle']|需要进一步测试|
|src/script/00.js:1078|thinkBuf|activeSetBuffers['thinking']|需要进一步测试|
|src/script/00.js:1081|secPerBeat|getSecPerBeat()|需要进一步测试|
|src/script/00.js:1082|loopStartSec|8 * secPerBeat|需要进一步测试|
|src/script/00.js:1083|loopEndSec|184 * secPerBeat|需要进一步测试|
|src/script/00.js:1084|chunkDuration|loopEndSec - offsetSec|需要进一步测试|
|src/script/00.js:1086|now|audioCtx.currentTime|需要进一步测试|
|src/script/00.js:1087|actualStart|Math.max(now, startTime)|需要进一步测试|
|src/script/00.js:1090|bSrc|audioCtx.createBufferSource()|需要进一步测试|
|src/script/00.js:1099|tSrc|audioCtx.createBufferSource()|需要进一步测试|
|src/script/00.js:1107|nextStartTime|actualStart + chunkDuration|需要进一步测试|
|src/script/00.js:1108|delayMs|Math.max(0, (nextStartTime - audioCtx.currentTime - 0.25) * 1000)|需要进一步测试|
|src/script/00.js:1110|timerId|setTimeout(() => {     scheduleDualLoopChunk(nextStartTime, loopStartSec);   }, delayMs)|需要进一步测试|
|src/script/00.js:1130|{ setIndex }|await pickNextPlayableSetIndex()|需要进一步测试|
|src/script/00.js:1142|now|audioCtx.currentTime + 0.05|需要进一步测试|
|src/script/00.js:1144|chosenIntroKey|'intro_normal'|需要进一步测试|
|src/script/00.js:1146|{ wins, losses }|state.lastRoundAllIn|需要进一步测试|
|src/script/00.js:1156|introBuf|activeSetBuffers[chosenIntroKey] ／／ activeSetBuffers['intro_normal']|需要进一步测试|
|src/script/00.js:1157|thinkBuf|activeSetBuffers['thinking']|需要进一步测试|
|src/script/00.js:1158|battleBuf|activeSetBuffers['battle']|需要进一步测试|
|src/script/00.js:1161|introSrc|audioCtx.createBufferSource()|需要进一步测试|
|src/script/00.js:1170|ratioMet|checkAllInRatio()|需要进一步测试|
|src/script/00.js:1193|now|audioCtx.currentTime|需要进一步测试|
|src/script/00.js:1194|secPerBeat|getSecPerBeat()|需要进一步测试|
|src/script/00.js:1195|currentBeat|getTrackCurrentBeat()|需要进一步测试|
|src/script/00.js:1196|beatInBar|currentBeat % 4|需要进一步测试|
|src/script/00.js:1197|beatsToNextBar|4 - beatInBar|需要进一步测试|
|src/script/00.js:1198|effBeats|beatsToNextBar + (Number(menuCfg.battleTransitionLeadBeats) ／／ 0)|需要进一步测试|
|src/script/00.js:1200|triggerTime||需要进一步测试|
|src/script/00.js:1200|transitionBeats||需要进一步测试|
|src/script/00.js:1200|transKey||需要进一步测试|
|src/script/00.js:1211|timeToNextBeat|(Math.ceil(currentBeat) - currentBeat) * secPerBeat|需要进一步测试|
|src/script/00.js:1216|timeToNextBeat|(Math.ceil(currentBeat) - currentBeat) * secPerBeat|需要进一步测试|
|src/script/00.js:1221|timeToNextBeat|(Math.ceil(currentBeat) - currentBeat) * secPerBeat|需要进一步测试|
|src/script/00.js:1227|transBuf|activeSetBuffers[transKey]|需要进一步测试|
|src/script/00.js:1228|exactTransDuration|transitionBeats * secPerBeat|需要进一步测试|
|src/script/00.js:1238|curThink|bgmEngine.thinkingGain.gain.value|需要进一步测试|
|src/script/00.js:1246|transSrc|audioCtx.createBufferSource()|需要进一步测试|
|src/script/00.js:1255|battleResumeTime|triggerTime + exactTransDuration|需要进一步测试|
|src/script/00.js:1256|battleFadeInStart|Math.max(triggerTime, battleResumeTime - 0.050)|需要进一步测试|
|src/script/00.js:1258|curBattle|bgmEngine.battleGain.gain.value|需要进一步测试|
|src/script/00.js:1268|stillAllIn|checkAllInRatio()|需要进一步测试|
|src/script/00.js:1289|now|audioCtx.currentTime|需要进一步测试|
|src/script/00.js:1290|secPerBeat|getSecPerBeat()|需要进一步测试|
|src/script/00.js:1291|currentBeat|getTrackCurrentBeat()|需要进一步测试|
|src/script/00.js:1292|timeToNextBeat|(Math.ceil(currentBeat) - currentBeat) * secPerBeat|需要进一步测试|
|src/script/00.js:1293|triggerTime|now + (timeToNextBeat < 0.005 ? timeToNextBeat + secPerBeat : timeToNextBeat)|需要进一步测试|
|src/script/00.js:1294|fadeDuration|getSecPerBar() * 0.5|需要进一步测试|
|src/script/00.js:1299|curBattle|bgmEngine.battleGain.gain.value|需要进一步测试|
|src/script/00.js:1300|curThink|bgmEngine.thinkingGain.gain.value|需要进一步测试|
|src/script/00.js:1326|victoryBuf|activeSetBuffers['victory']|需要进一步测试|
|src/script/00.js:1327|now|audioCtx.currentTime|需要进一步测试|
|src/script/00.js:1328|secPerBeat|getSecPerBeat()|需要进一步测试|
|src/script/00.js:1329|currentBeat|getTrackCurrentBeat()|需要进一步测试|
|src/script/00.js:1330|beatInBar|currentBeat % 4|需要进一步测试|
|src/script/00.js:1331|beatsToNextBar|4 - beatInBar|需要进一步测试|
|src/script/00.js:1332|triggerTime|now + (beatsToNextBar * secPerBeat)|需要进一步测试|
|src/script/00.js:1344|currentBattleVol|bgmEngine.battleGain.gain.value|需要进一步测试|
|src/script/00.js:1345|currentThinkingVol|bgmEngine.thinkingGain.gain.value|需要进一步测试|
|src/script/00.js:1371|victorySrc|audioCtx.createBufferSource()|需要进一步测试|
|src/script/00.js:1430|now|audioCtx.currentTime|需要进一步测试|
|src/script/00.js:1441|toastTimer|null|需要进一步测试|
|src/script/00.js:1443|t|document.getElementById('toast')|需要进一步测试|
|src/script/00.js:1471|payload|buildClassroomBackup()|需要进一步测试|
|src/script/00.js:1472|result|Reliability.writeVerified(CLASSROOM_STORAGE,Reliability.stateKey,payload)|需要进一步测试|
|src/script/00.js:1478|saveWarning|document.getElementById('classroomSaveWarning')|需要进一步测试|
|src/script/00.js:1481|mirrors|[     ['politics_groups_data',payload.groups],['politics_picker_state',state.picker],     ['politics_item_global',state.itemGlobal],['politics_history_stack_v26|需要进一步测试|
|src/script/00.js:1485|failed|mirrors.filter(([k,v])=>!STORAGE.setJSON(k,v)).map(([k])=>k)|需要进一步测试|
|src/script/00.js:1486|[k,v]||需要进一步测试|
|src/script/00.js:1533|dock|document.getElementById('heightResizerDock')|需要进一步测试|
|src/script/00.js:1540|handle|document.getElementById('resizerHandle')|需要进一步测试|
|src/script/00.js:1541|dock|document.getElementById('heightResizerDock')|需要进一步测试|
|src/script/00.js:1544|startY|0|需要进一步测试|
|src/script/00.js:1545|startH|0|需要进一步测试|
|src/script/00.js:1556|deltaY|e.clientY - startY|需要进一步测试|
|src/script/00.js:1557|newH|Math.max(28, Math.min(600, startH + deltaY))|需要进一步测试|
|src/script/00.js:1596|val|document.getElementById('pwdInput').value.trim()|需要进一步测试|
|src/script/00.js:1604|input|document.getElementById('pwdInput')|需要进一步测试|
|src/script/00.js:1611|newPin|document.getElementById('newPwdInput').value.trim()|需要进一步测试|
|src/script/00.js:1643|overlay|document.getElementById('initProgressOverlay')|需要进一步测试|
|src/script/00.js:1644|fill|document.getElementById('initProgressFill')|需要进一步测试|
|src/script/00.js:1645|txt|document.getElementById('initProgressText')|需要进一步测试|
|src/script/00.js:1650|playable|await Promise.race([       hasAnyPlayableBgm(),       new Promise(res => setTimeout(() => res(false), 2500))     ])|需要进一步测试|
|src/script/00.js:1693|flipSnapshotV21725|captureCardRectsV21725()|需要进一步测试|
|src/script/00.js:1722|complete|await getAllCompleteSetIndices()|需要进一步测试|
|src/script/00.js:1724|fb|await getFallbackSetIndex()|需要进一步测试|
|src/script/00.js:1738|overlay|document.getElementById('initProgressOverlay')|需要进一步测试|
|src/script/00.js:1739|fill|document.getElementById('initProgressFill')|需要进一步测试|
|src/script/00.js:1740|txt|document.getElementById('initProgressText')|需要进一步测试|
|src/script/00.js:1757|flipSnapshotV21725|captureCardRectsV21725()|需要进一步测试|
|src/script/00.js:1772|nextRoundAllIn|checkAllInRatio()|需要进一步测试|
|src/script/00.js:1795|flipSnapshotV21725|captureCardRectsV21725()|需要进一步测试|
|src/script/00.js:1814|text|document.getElementById('settingsBatchMemberText').value.trim()|需要进一步测试|
|src/script/00.js:1816|lines|text.split('\n').map(l => l.trim()).filter(Boolean)|需要进一步测试|
|src/script/00.js:1818|newGroups|[]|需要进一步测试|
|src/script/00.js:1821|delimiter|line.includes(':') ? ':' : '：'|需要进一步测试|
|src/script/00.js:1822|parts|line.split(delimiter)|需要进一步测试|
|src/script/00.js:1823|grpName|parts[0].trim()|需要进一步测试|
|src/script/00.js:1824|membersStr|parts.slice(1).join(delimiter).trim()|需要进一步测试|
|src/script/00.js:1825|members|membersStr.split(/[,，、\s]+/).map(m => m.trim()).filter(Boolean)|需要进一步测试|
|src/script/00.js:1827|existing|state.groups.find(g => g.name.trim() === grpName)|需要进一步测试|
|src/script/00.js:1876|allCurrentlyAllIn|state.groups.every(g => g.allIn)|需要进一步测试|
|src/script/00.js:1877|targetState|!allCurrentlyAllIn|需要进一步测试|
|src/script/00.js:1886|ratioMet|checkAllInRatio()|需要进一步测试|
|src/script/00.js:1906|g|state.groups.find(x => x.id === groupId)|需要进一步测试|
|src/script/00.js:1910|inputEl|document.getElementById('modalCustomInput')|需要进一步测试|
|src/script/00.js:1913|errEl|document.getElementById('scoreModalError')|需要进一步测试|
|src/script/00.js:1925|groupId|state.activeModalGroupId|需要进一步测试|
|src/script/00.js:1941|groupId|state.activeModalGroupId|需要进一步测试|
|src/script/00.js:1942|input|document.getElementById('modalCustomInput')|需要进一步测试|
|src/script/00.js:1943|errEl|document.getElementById('scoreModalError')|需要进一步测试|
|src/script/00.js:1946|raw|input.value.trim()     .replace(/[－—–−]/g, '-')     .replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))|需要进一步测试|
|src/script/00.js:1949|fail|(msg) => {     input.classList.add('invalid');     if (errEl) errEl.innerText = msg;     input.focus();     input.select();   }|需要进一步测试|
|src/script/00.js:1956|val|parseInt(raw, 10)|需要进一步测试|
|src/script/00.js:1964|card|document.querySelector(.group-row-card[data-group-id="${groupId}"])|需要进一步测试|
|src/script/00.js:1966|banner|card.querySelector('.milestone-banner-overlay')|需要进一步测试|
|src/script/00.js:1978|activeScoreAnimId|null|需要进一步测试|
|src/script/00.js:1993|startTime|performance.now()|需要进一步测试|
|src/script/00.js:1994|duration|950|需要进一步测试|
|src/script/00.js:1997|elapsed|now - startTime|需要进一步测试|
|src/script/00.js:1998|progress|Math.min(elapsed / duration, 1)|需要进一步测试|
|src/script/00.js:1999|ease|1 - Math.pow(1 - progress, 3)|需要进一步测试|
|src/script/00.js:2002|cur|Math.round(item.start + (item.target - item.start) * ease)|需要进一步测试|
|src/script/00.js:2003|g|state.groups.find(x => x.id === item.groupId)|需要进一步测试|
|src/script/00.js:2006|el|document.getElementById(score-val-${g.id})|需要进一步测试|
|src/script/00.js:2019|g|state.groups.find(x => x.id === item.groupId)|需要进一步测试|
|src/script/00.js:2035|g|state.groups.find(x => x.id === groupId)|需要进一步测试|
|src/script/00.js:2038|oldScore|g.score|需要进一步测试|
|src/script/00.js:2039|targetScore|oldScore + delta|需要进一步测试|
|src/script/00.js:2041|actualDelta|targetScore - oldScore|需要进一步测试|
|src/script/00.js:2042|clipped|actualDelta !== delta|需要进一步测试|
|src/script/00.js:2048|oldDigits|Math.floor(Math.abs(oldScore)).toString().length|需要进一步测试|
|src/script/00.js:2049|newDigits|Math.floor(Math.abs(targetScore)).toString().length|需要进一步测试|
|src/script/00.js:2050|isMilestone|newDigits > oldDigits && targetScore > oldScore|需要进一步测试|
|src/script/00.js:2086|input|document.getElementById(input-score-${groupId})|需要进一步测试|
|src/script/00.js:2087|g|state.groups.find(x => x.id === groupId)|需要进一步测试|
|src/script/00.js:2089|newVal|Number(input.value)|需要进一步测试|
|src/script/00.js:2091|oldVal|g.score|需要进一步测试|
|src/script/00.js:2107|g|state.groups.find(x => x.id === groupId)|需要进一步测试|
|src/script/00.js:2118|g|state.groups.find(x => x.id === groupId)|需要进一步测试|
|src/script/00.js:2126|ratioMet|checkAllInRatio()|需要进一步测试|
|src/script/00.js:2148|allAnswered|state.groups.every(g => g.selectedOpt !== '')|需要进一步测试|
|src/script/00.js:2150|confirmEarly|await themeConfirm('当前仍有小组尚未完成作答！\n是否确认提前选定正确答案？', {title:'提前公布正解', confirmText:'继续选定'})|需要进一步测试|
|src/script/00.js:2169|flipSnapshotV21725|captureCardRectsV21725()|需要进一步测试|
|src/script/00.js:2173|allInWins|0|需要进一步测试|
|src/script/00.js:2174|allInLosses|0|需要进一步测试|
|src/script/00.js:2175|hasNormalWin|false|需要进一步测试|
|src/script/00.js:2176|hasMilestone|false|需要进一步测试|
|src/script/00.js:2177|milestoneGroups|[]|需要进一步测试|
|src/script/00.js:2178|scoreUpdates|[]|需要进一步测试|
|src/script/00.js:2186|isCorrect|g.selectedOpt === state.correctAns|需要进一步测试|
|src/script/00.js:2187|oldScore|g.score|需要进一步测试|
|src/script/00.js:2211|oldDigits|Math.floor(Math.abs(oldScore)).toString().length|需要进一步测试|
|src/script/00.js:2212|newDigits|Math.floor(Math.abs(g.score)).toString().length|需要进一步测试|
|src/script/00.js:2234|card|document.querySelector(.group-row-card[data-group-id="${g.id}"])|需要进一步测试|
|src/script/00.js:2236|isCorrect|g.selectedOpt === state.correctAns|需要进一步测试|
|src/script/00.js:2237|animCls|isCorrect ? 'anim-win' : 'anim-loss'|需要进一步测试|
|src/script/00.js:2261|backdrop|document.getElementById('memberSearchBackdrop')|需要进一步测试|
|src/script/00.js:2262|input|document.getElementById('memberSearchInput')|需要进一步测试|
|src/script/00.js:2272|backdrop|document.getElementById('memberSearchBackdrop')|需要进一步测试|
|src/script/00.js:2287|input|document.getElementById('memberSearchInput')|需要进一步测试|
|src/script/00.js:2288|results|document.getElementById('memberSearchResults')|需要进一步测试|
|src/script/00.js:2291|keyword|input.value.trim().toLowerCase()|需要进一步测试|
|src/script/00.js:2297|matches|[]|需要进一步测试|
|src/script/00.js:2299|members|Array.isArray(g.members) ? g.members : []|需要进一步测试|
|src/script/00.js:2301|name|String(member).trim()|需要进一步测试|
|src/script/00.js:2315|g|item.group|需要进一步测试|
|src/script/00.js:2316|memberList|(Array.isArray(g.members) ? g.members : [])       .map(escapeHtml).join('、')|需要进一步测试|
|src/script/00.js:2330|bar|document.getElementById('quickBatchBar')|需要进一步测试|
|src/script/00.js:2340|banner|document.getElementById('topHeaderStats')|需要进一步测试|
|src/script/00.js:2342|summary|GodpowerUIModel.standings(ranking())|需要进一步测试|
|src/script/00.js:2343|mask|Number(state.itemGlobal?.blooperUntil ／／ 0) > Date.now()|需要进一步测试|
|src/script/00.js:2344|html|小组总数: <b>${summary.count}</b> 组 ／ 总积分: <b>${mask?'???':summary.total}</b> ／ 当前领先: <b style="color:#0284c7;">${mask?'已遮蔽':summary.count?escapeHtml(summary.leade|需要进一步测试|
|src/script/00.js:2352|wrapper|document.getElementById('chartWrapper')|需要进一步测试|
|src/script/00.js:2355|sorted|[...state.groups].sort((a, b) => {     const scA = a.displayScore !== undefined ? a.displayScore : a.score;     const scB = b.displayScore !== undefined ? b.dis|需要进一步测试|
|src/script/00.js:2356|scA|a.displayScore !== undefined ? a.displayScore : a.score|需要进一步测试|
|src/script/00.js:2357|scB|b.displayScore !== undefined ? b.displayScore : b.score|需要进一步测试|
|src/script/00.js:2361|rowHeight|30|需要进一步测试|
|src/script/00.js:2364|maxScore|Math.max(...sorted.map(g => (g.displayScore !== undefined ? g.displayScore : g.score)), 10)|需要进一步测试|
|src/script/00.js:2366|existingRows|Array.from(wrapper.querySelectorAll('.chart-row'))|需要进一步测试|
|src/script/00.js:2367|currentIds|new Set(sorted.map(g => g.id.toString()))|需要进一步测试|
|src/script/00.js:2376|row|wrapper.querySelector(.chart-row[data-id="${g.id}"])|需要进一步测试|
|src/script/00.js:2394|rankEl|row.querySelector('.chart-rank')|需要进一步测试|
|src/script/00.js:2397|nameEl|row.querySelector('.chart-name')|需要进一步测试|
|src/script/00.js:2403|curScore|g.displayScore !== undefined ? g.displayScore : g.score|需要进一步测试|
|src/script/00.js:2404|scoreEl|row.querySelector('.chart-score')|需要进一步测试|
|src/script/00.js:2410|barEl|row.querySelector('.chart-bar')|需要进一步测试|
|src/script/00.js:2412|percent|Math.max(2, (curScore / maxScore) * 100)|需要进一步测试|
|src/script/00.js:2420|podiumDeck|document.getElementById('podiumDeck')|需要进一步测试|
|src/script/00.js:2423|sorted|[...state.groups].sort((a, b) => {     const scA = a.displayScore !== undefined ? a.displayScore : a.score;     const scB = b.displayScore !== undefined ? b.dis|需要进一步测试|
|src/script/00.js:2424|scA|a.displayScore !== undefined ? a.displayScore : a.score|需要进一步测试|
|src/script/00.js:2425|scB|b.displayScore !== undefined ? b.displayScore : b.score|需要进一步测试|
|src/script/00.js:2428|top1|sorted[0]|需要进一步测试|
|src/script/00.js:2429|top2|sorted[1]|需要进一步测试|
|src/script/00.js:2430|top3|sorted[2]|需要进一步测试|
|src/script/00.js:2432|getScoreText|(g) => g ? (g.displayScore !== undefined ? g.displayScore : g.score) : 0|需要进一步测试|
|src/script/00.js:2452|totalGroups|state.groups.length|需要进一步测试|
|src/script/00.js:2453|answeredGroups|state.groups.filter(g => g.selectedOpt).length|需要进一步测试|
|src/script/00.js:2454|allInGroups|state.groups.filter(g => g.allIn).length|需要进一步测试|
|src/script/00.js:2455|totalScore|state.groups.reduce((acc, g) => acc + (g.displayScore !== undefined ? g.displayScore : g.score), 0)|需要进一步测试|
|src/script/00.js:2456|avgScore|totalGroups > 0 ? (totalScore / totalGroups).toFixed(1) : 0|需要进一步测试|
|src/script/00.js:2464|btn|document.getElementById('lockBtn')|需要进一步测试|
|src/script/00.js:2465|addBtn|document.getElementById('btnAddGroup')|需要进一步测试|
|src/script/00.js:2466|importBtn|document.getElementById('btnImport')|需要进一步测试|
|src/script/00.js:2467|resetBtn|document.getElementById('btnResetScores')|需要进一步测试|
|src/script/00.js:2468|undoBtn|document.getElementById('btnUndo')|需要进一步测试|
|src/script/00.js:2490|statusBadge|document.getElementById('roundStatusBadge')|需要进一步测试|
|src/script/00.js:2491|mainActionBtn|document.getElementById('btnMainAction')|需要进一步测试|
|src/script/00.js:2492|nextBtn|document.getElementById('btnNextRound')|需要进一步测试|
|src/script/00.js:2493|forceBtn|document.getElementById('btnForceEnd')|需要进一步测试|
|src/script/00.js:2527|btns|document.querySelectorAll('.ans-btn')|需要进一步测试|
|src/script/00.js:2567|reelGrp|document.getElementById('reelFrameGroup')|需要进一步测试|
|src/script/00.js:2568|reelStu|document.getElementById('reelFrameStudent')|需要进一步测试|
|src/script/00.js:2569|selBox|document.getElementById('twoTierGroupSelect')|需要进一步测试|
|src/script/00.js:2584|wrap|document.getElementById('twoTierGroupChips')|需要进一步测试|
|src/script/00.js:2586|pre|Array.isArray(state.picker.preselectedGroupIds) ? state.picker.preselectedGroupIds : []|需要进一步测试|
|src/script/00.js:2587|groups|state.groups.filter(g => Array.isArray(g.members) && g.members.length > 0)|需要进一步测试|
|src/script/00.js:2589|on|pre.includes(g.id)|需要进一步测试|
|src/script/00.js:2590|style|on ? ('border-color:' + g.color + '; color:#fff; background:' + g.color + ';') : ''|需要进一步测试|
|src/script/00.js:2597|pre|Array.isArray(state.picker.preselectedGroupIds) ? state.picker.preselectedGroupIds.slice() : []|需要进一步测试|
|src/script/00.js:2598|idx|pre.indexOf(gid)|需要进一步测试|
|src/script/00.js:2614|btn|document.getElementById('btnSlotTrigger')|需要进一步测试|
|src/script/00.js:2635|grps|state.groups|需要进一步测试|
|src/script/00.js:2647|grps|state.groups.filter(g => Array.isArray(g.members) && g.members.length > 0)|需要进一步测试|
|src/script/00.js:2648|pre|Array.isArray(state.picker.preselectedGroupIds) ? state.picker.preselectedGroupIds : []|需要进一步测试|
|src/script/00.js:2650|selected|grps.filter(g => pre.includes(g.id))|需要进一步测试|
|src/script/00.js:2653|students|[]|需要进一步测试|
|src/script/00.js:2658|filtered|students.filter(s => !state.picker.pickedStudentKeys.includes(s.key))|需要进一步测试|
|src/script/00.js:2668|students|[]|需要进一步测试|
|src/script/00.js:2675|filtered|students.filter(s => !state.picker.pickedStudentKeys.includes(s.key))|需要进一步测试|
|src/script/00.js:2686|pool|getAvailablePool()|需要进一步测试|
|src/script/00.js:2687|label|document.getElementById('poolStatusText')|需要进一步测试|
|src/script/00.js:2702|uiGeneration|typeof DesktopUI!=='undefined'?DesktopUI.getPickerGeneration():null|需要进一步测试|
|src/script/00.js:2703|pool|getAvailablePool()|需要进一步测试|
|src/script/00.js:2713|btn|document.getElementById('btnSlotTrigger')|需要进一步测试|
|src/script/00.js:2717|winnerIndex|Math.floor(Math.random() * pool.list.length)|需要进一步测试|
|src/script/00.js:2725|allGroups|state.groups|需要进一步测试|
|src/script/00.js:2726|allStudents|[]|需要进一步测试|
|src/script/00.js:2734|reelGrps|allGroups|需要进一步测试|
|src/script/00.js:2735|reelStus|allStudents|需要进一步测试|
|src/script/00.js:2737|pre|Array.isArray(state.picker.preselectedGroupIds) ? state.picker.preselectedGroupIds : []|需要进一步测试|
|src/script/00.js:2738|grpWithMembers|state.groups.filter(g => Array.isArray(g.members) && g.members.length > 0)|需要进一步测试|
|src/script/00.js:2740|chosen|allGroups.filter(g => pre.includes(g.id))|需要进一步测试|
|src/script/00.js:2742|chosenStus|allStudents.filter(s => pre.includes(s.group.id))|需要进一步测试|
|src/script/00.js:2750|reelGrpText|document.getElementById('reelTextGroup')|需要进一步测试|
|src/script/00.js:2753|randomGrp|reelGrps[Math.floor(Math.random() * reelGrps.length)]|需要进一步测试|
|src/script/00.js:2758|reelStuText|document.getElementById('reelTextStudent')|需要进一步测试|
|src/script/00.js:2761|randomStu|reelStus[Math.floor(Math.random() * reelStus.length)]|需要进一步测试|
|src/script/00.js:2774|btn|document.getElementById('btnSlotTrigger')|需要进一步测试|
|src/script/00.js:2778|win|slotEngine.chosenResult|需要进一步测试|
|src/script/00.js:2781|reelGrpText|document.getElementById('reelTextGroup')|需要进一步测试|
|src/script/00.js:2782|reelStuText|document.getElementById('reelTextStudent')|需要进一步测试|
|src/script/00.js:2783|badge|document.getElementById('slotSubBadge')|需要进一步测试|
|src/script/00.js:2784|resultHeadline|document.getElementById('resultHeadline')|需要进一步测试|
|src/script/00.js:2813|win|slotEngine.chosenResult|需要进一步测试|
|src/script/00.js:2815|targetGroup|state.picker.mode === 'group' ? win : win.group|需要进一步测试|
|src/script/00.js:2816|g|state.groups.find(x => x.id === targetGroup.id)|需要进一步测试|
|src/script/00.js:2820|oldScore|g.score|需要进一步测试|
|src/script/00.js:2832|sample|state.groups.map(g => ${g.name}: ${g.members.join(', ')}).join('\n')|需要进一步测试|
|src/script/00.js:2842|text|document.getElementById('batchTextarea').value.trim()|需要进一步测试|
|src/script/00.js:2844|lines|text.split('\n').map(l => l.trim()).filter(Boolean)|需要进一步测试|
|src/script/00.js:2845|parsedCount|0|需要进一步测试|
|src/script/00.js:2849|delimiter|line.includes(':') ? ':' : '：'|需要进一步测试|
|src/script/00.js:2850|[grpName, membersStr]|line.split(delimiter)|需要进一步测试|
|src/script/00.js:2851|targetGroup|state.groups.find(g => g.name.trim() === grpName.trim() ／／ g.name.replace(/\s+/g, '') === grpName.replace(/\s+/g, ''))|需要进一步测试|
|src/script/00.js:2853|members|membersStr.split(/[,，、\s]+/).map(m => m.trim()).filter(Boolean)|需要进一步测试|
|src/script/00.js:2869|blob|new Blob([JSON.stringify(buildClassroomBackup(),null,2)],{type:'application/json'})|需要进一步测试|
|src/script/00.js:2870|url|URL.createObjectURL(blob)|需要进一步测试|
|src/script/00.js:2870|a|document.createElement('a')|需要进一步测试|
|src/script/00.js:2880|file|event.target.files?.[0]|需要进一步测试|
|src/script/00.js:2882|reader|new FileReader()|需要进一步测试|
|src/script/00.js:2885|result|importClassroomData(JSON.parse(reader.result))|需要进一步测试|
|src/script/00.js:2896|newId|Date.now()|需要进一步测试|
|src/script/00.js:2897|index|state.groups.length + 1|需要进一步测试|
|src/script/00.js:2898|color|DEFAULT_COLORS[(index - 1) % DEFAULT_COLORS.length]|需要进一步测试|
|src/script/00.js:2919|target|state.groups.find(x => x.id === groupId)|需要进一步测试|
|src/script/00.js:2930|g|state.groups.find(x => x.id === groupId)|需要进一步测试|
|src/script/00.js:2941|g|state.groups.find(x => x.id === groupId)|需要进一步测试|
|src/script/00.js:2953|updates|[]|需要进一步测试|
|src/script/00.js:2990|summaryText|state.groups.map(g => ${g.name}: ${(g.members ／／ []).join(', ')}).join('\n')|需要进一步测试|
|src/script/00.js:3003|bgmSlotRenderGeneration|0|需要进一步测试|
|src/script/00.js:3005|container|document.getElementById('bgmListContainer')|需要进一步测试|
|src/script/00.js:3007|generation|++bgmSlotRenderGeneration|需要进一步测试|
|src/script/00.js:3008|setIdx|parseInt(document.getElementById('cfgSetSelector').value, 10)|需要进一步测试|
|src/script/00.js:3009|isMenuSet|setIdx === 8|需要进一步测试|
|src/script/00.js:3010|trackTypes|isMenuSet ? MENU_SET_TRACK_TYPES : SET_TRACK_TYPES|需要进一步测试|
|src/script/00.js:3013|bpmDesc|document.getElementById('cfgSetBpmDesc')|需要进一步测试|
|src/script/00.js:3018|effBpm|setIdx === 7 ? (Number(menuCfg.battleSet8Bpm) ／／ 135) : (Number(menuCfg.battleBaseBpm) ／／ 130)|需要进一步测试|
|src/script/00.js:3024|{ isComplete, count }|await checkSetCompleteness(setIdx)|需要进一步测试|
|src/script/00.js:3026|currentIdxAfter|parseInt(document.getElementById('cfgSetSelector').value, 10)|需要进一步测试|
|src/script/00.js:3029|compLabel|document.getElementById('cfgSetCompleteness')|需要进一步测试|
|src/script/00.js:3031|total|trackTypes.length|需要进一步测试|
|src/script/00.js:3037|track||需要进一步测试|
|src/script/00.js:3038|slotId|isMenuSet ? bgm_menu_${track.key} : bgm_set_${setIdx}_${track.key}|需要进一步测试|
|src/script/00.js:3039|isLoaded|hasSound(slotId)|需要进一步测试|
|src/script/00.js:3041|row|document.createElement('div')|需要进一步测试|
|src/script/00.js:3060|fxContainer|document.getElementById('soundListContainer')|需要进一步测试|
|src/script/00.js:3063|categories|new Map()|需要进一步测试|
|src/script/00.js:3064|category|slot.category／／(['roll_tick','roll_loop','roll_win'].includes(slot.id)?'点名过程与结果':slot.id==='ui_click'?'通用按钮默认音效':'计分与比赛结果')|需要进一步测试|
|src/script/00.js:3065|[category,slots]||需要进一步测试|
|src/script/00.js:3066|section|document.createElement('details')|需要进一步测试|
|src/script/00.js:3067|summary|document.createElement('summary')|需要进一步测试|
|src/script/00.js:3068|slot||需要进一步测试|
|src/script/00.js:3069|isCustom|!!customFxBuffers[slot.id]／／!!customFxVariants[slot.id]?.length|需要进一步测试|
|src/script/00.js:3070|row|document.createElement('div')|需要进一步测试|
|src/script/00.js:3080|tx|db.transaction('sounds', 'readonly')|需要进一步测试|
|src/script/00.js:3081|store|tx.objectStore('sounds')|需要进一步测试|
|src/script/00.js:3082|req|store.get(slotId)|需要进一步测试|
|src/script/00.js:3085|ctx|await getAudioContext()|需要进一步测试|
|src/script/00.js:3087|decoded|await ctx.decodeAudioData(req.result.arrayBuffer.slice(0))|需要进一步测试|
|src/script/00.js:3088|src|ctx.createBufferSource()|需要进一步测试|
|src/script/00.js:3100|input|document.getElementById('soundFileInput')|需要进一步测试|
|src/script/00.js:3103|files|Array.from(event.target.files／／[])|需要进一步测试|
|src/script/00.js:3103|slotId|currentUploadingSlot|需要进一步测试|
|src/script/00.js:3103|append|currentUploadingAppend|需要进一步测试|
|src/script/00.js:3105|fxKey|slotId.startsWith('fx_')?slotId.slice(3):null|需要进一步测试|
|src/script/00.js:3108|candidate|!!fxKey&&(append／／index>0)|需要进一步测试|
|src/script/00.js:3108|key|candidate?slotId+'::variant::'+crypto.randomUUID():slotId|需要进一步测试|
|src/script/00.js:3109|reader|new FileReader()|需要进一步测试|
|src/script/00.js:3112|decoded||需要进一步测试|
|src/script/00.js:3113|ctx|await getAudioContext()|需要进一步测试|
|src/script/00.js:3119|saved|false|需要进一步测试|
|src/script/00.js:3123|tx|db.transaction('sounds','readwrite')|需要进一步测试|
|src/script/00.js:3137|tx|db.transaction('sounds', 'readwrite')|需要进一步测试|
|src/script/00.js:3138|store|tx.objectStore('sounds')|需要进一步测试|
|src/script/00.js:3152|tx|db.transaction('sounds','readwrite')|需要进一步测试|
|src/script/00.js:3152|store|tx.objectStore('sounds')|需要进一步测试|
|src/script/00.js:3154|req|store.getAllKeys()|需要进一步测试|
|src/script/00.js:3156|key||需要进一步测试|
|src/script/00.js:3167|tx|db.transaction('sounds', 'readonly')|需要进一步测试|
|src/script/00.js:3168|store|tx.objectStore('sounds')|需要进一步测试|
|src/script/00.js:3169|allRecords|await new Promise(resolve => {       const req = store.getAll();       req.onsuccess = () => resolve(req.result ／／ []);       req.onerror = () => resolve([]);  |需要进一步测试|
|src/script/00.js:3170|req|store.getAll()|需要进一步测试|
|src/script/00.js:3180|currentOffset|0|需要进一步测试|
|src/script/00.js:3181|fileIndex|[]|需要进一步测试|
|src/script/00.js:3182|audioBuffersToPack|[]|需要进一步测试|
|src/script/00.js:3184|record||需要进一步测试|
|src/script/00.js:3185|ab|record.arrayBuffer|需要进一步测试|
|src/script/00.js:3191|indexBytes|new TextEncoder().encode(JSON.stringify(fileIndex))|需要进一步测试|
|src/script/00.js:3192|headerBuffer|new ArrayBuffer(8)|需要进一步测试|
|src/script/00.js:3193|headerView|new DataView(headerBuffer)|需要进一步测试|
|src/script/00.js:3198|bundleBlob|new Blob([headerBuffer, indexBytes, ...audioBuffersToPack], { type: 'application/octet-stream' })|需要进一步测试|
|src/script/00.js:3199|downloadUrl|URL.createObjectURL(bundleBlob)|需要进一步测试|
|src/script/00.js:3200|a|document.createElement('a')|需要进一步测试|
|src/script/00.js:3217|file|event.target.files[0]|需要进一步测试|
|src/script/00.js:3221|reader|new FileReader()|需要进一步测试|
|src/script/00.js:3224|fullBuffer|e.target.result|需要进一步测试|
|src/script/00.js:3225|dataView|new DataView(fullBuffer)|需要进一步测试|
|src/script/00.js:3231|indexLength|dataView.getUint32(4, true)|需要进一步测试|
|src/script/00.js:3232|fileIndex|JSON.parse(new TextDecoder().decode(new Uint8Array(fullBuffer, 8, indexLength)))|需要进一步测试|
|src/script/00.js:3233|binaryStart|8 + indexLength|需要进一步测试|
|src/script/00.js:3235|tx|db.transaction('sounds', 'readwrite')|需要进一步测试|
|src/script/00.js:3236|store|tx.objectStore('sounds')|需要进一步测试|
|src/script/00.js:3271|VIEW_NAMES|['welcome', 'battle', 'history', 'archives', 'settings']|需要进一步测试|
|src/script/00.js:3272|currentView|'welcome'|需要进一步测试|
|src/script/00.js:3273|audioUnlocked|false|需要进一步测试|
|src/script/00.js:3287|target|document.getElementById('view-' + name)|需要进一步测试|
|src/script/00.js:3302|menuKey|getMenuTrackKeyForView(name)|需要进一步测试|
|src/script/00.js:3321|max|state.groups.reduce((m, g) => Math.max(m, Number(g.score) ／／ 0), 0)|需要进一步测试|
|src/script/00.js:3322|digits|Math.max(1, Math.min(6, String(Math.floor(Math.abs(max))).length))|需要进一步测试|
|src/script/00.js:3327|WEEKDAYS|['日', '一', '二', '三', '四', '五', '六']|需要进一步测试|
|src/script/00.js:3328|welcomeClockTimer|null|需要进一步测试|
|src/script/00.js:3339|now|new Date()|需要进一步测试|
|src/script/00.js:3340|hh|String(now.getHours()).padStart(2, '0')|需要进一步测试|
|src/script/00.js:3341|mm|String(now.getMinutes()).padStart(2, '0')|需要进一步测试|
|src/script/00.js:3342|ss|String(now.getSeconds()).padStart(2, '0')|需要进一步测试|
|src/script/00.js:3343|clock|document.getElementById('welcomeClock')|需要进一步测试|
|src/script/00.js:3345|date|document.getElementById('welcomeDate')|需要进一步测试|
|src/script/00.js:3347|greeting|document.getElementById('welcomeGreeting')|需要进一步测试|
|src/script/00.js:3349|h|now.getHours()|需要进一步测试|
|src/script/00.js:3350|part|h < 6 ? '夜深了' : h < 12 ? '早上好' : h < 14 ? '中午好' : h < 18 ? '下午好' : '晚上好'|需要进一步测试|
|src/script/00.js:3357|wrap|document.getElementById('welcomePodiumDeck')|需要进一步测试|
|src/script/00.js:3359|sorted|[...state.groups].sort((a, b) => (Number(b.score) ／／ 0) - (Number(a.score) ／／ 0))|需要进一步测试|
|src/script/00.js:3360|top1|sorted[0]|需要进一步测试|
|src/script/00.js:3360|top2|sorted[1]|需要进一步测试|
|src/script/00.js:3360|top3|sorted[2]|需要进一步测试|
|src/script/00.js:3361|getScore|(g) => g ? (Number(g.score) ／／ 0) : 0|需要进一步测试|
|src/script/00.js:3383|MENU_TRACK_KEYS|['welcome_1', 'welcome_2', 'welcome_3', 'welcome_4', 'welcome_5', 'welcome_6', 'aux_history', 'aux_archives', 'aux_settings']|需要进一步测试|
|src/script/00.js:3384|MENU_SET_TRACK_TYPES|[   { key: 'welcome_1', name: '欢迎·个位张力', desc: '最高分个位数时播放' },   { key: 'welcome_2', name: '欢迎·十位张力', desc: '最高分十位数时播放' },   { key: 'welcome_3', name: '欢迎·百位张力',|需要进一步测试|
|src/script/00.js:3395|MENU_TRACK_META|{   welcome_1: { name: '欢迎·个位张力', tension: 1 },   welcome_2: { name: '欢迎·十位张力', tension: 2 },   welcome_3: { name: '欢迎·百位张力', tension: 3 },   welcome_4: { name:|需要进一步测试|
|src/script/00.js:3406|MENU_AUDIO_DEFAULTS|{   enabled: true,   bpm: 130,   beatsPerBar: 4,   loopStartBeat: 1,   loopEndBeat: 33,   transitionLeadBeats: 1,   battleBaseBpm: 130,   battleSet8Bpm: 135,   |需要进一步测试|
|src/script/00.js:3419|menuCfg|{ ...MENU_AUDIO_DEFAULTS, gainTrims: { ...MENU_AUDIO_DEFAULTS.gainTrims } }|需要进一步测试|
|src/script/00.js:3421|saved|STORAGE.getJSON('politics_menu_audio_cfg', null)|需要进一步测试|
|src/script/00.js:3432|a|seed >>> 0|需要进一步测试|
|src/script/00.js:3435|t|Math.imul(a ^ a >>> 15, 1 ／ a)|需要进一步测试|
|src/script/00.js:3441|SCALE_MAJOR|[0, 2, 4, 5, 7, 9, 11]|需要进一步测试|
|src/script/00.js:3442|CHORD_PROG|[0, 0, 9, 9, 5, 5, 7, 7]|需要进一步测试|
|src/script/00.js:3443|MENU_PATTERN_CACHE|{}|需要进一步测试|
|src/script/00.js:3447|cacheKey|key + ':' + bars|需要进一步测试|
|src/script/00.js:3449|meta|MENU_TRACK_META[key] ／／ { tension: 1 }|需要进一步测试|
|src/script/00.js:3450|rnd|mulberry32(key.split('').reduce((s, c) => s + c.charCodeAt(0), 7))|需要进一步测试|
|src/script/00.js:3451|stepsPerBar|16|需要进一步测试|
|src/script/00.js:3452|totalSteps|bars * stepsPerBar|需要进一步测试|
|src/script/00.js:3453|tension|meta.tension|需要进一步测试|
|src/script/00.js:3454|density|meta.density !== undefined ? meta.density     : (tension >= 6 ? 0.66 : tension === 5 ? 0.56 : tension === 4 ? 0.46 : tension === 3 ? 0.36 : tension === 2 ? 0.26|需要进一步测试|
|src/script/00.js:3456|hatLevel|meta.hat !== undefined ? meta.hat     : (tension >= 6 ? 0.85 : tension === 5 ? 0.7 : tension === 4 ? 0.55 : tension === 3 ? 0.4 : tension === 2 ? 0.25 : tension|需要进一步测试|
|src/script/00.js:3458|leadOct|meta.leadOct !== undefined ? meta.leadOct     : (tension >= 5 ? 3 : tension >= 3 ? 2 : 1)|需要进一步测试|
|src/script/00.js:3460|bass|new Array(totalSteps).fill(0)|需要进一步测试|
|src/script/00.js:3461|lead|new Array(totalSteps).fill(null)|需要进一步测试|
|src/script/00.js:3462|hat|new Array(totalSteps).fill(false)|需要进一步测试|
|src/script/00.js:3463|bar|0|需要进一步测试|
|src/script/00.js:3464|chordRoot|CHORD_PROG[bar % CHORD_PROG.length]|需要进一步测试|
|src/script/00.js:3465|rootMidi|48 + chordRoot|需要进一步测试|
|src/script/00.js:3466|step|0|需要进一步测试|
|src/script/00.js:3467|gs|bar * stepsPerBar + step|需要进一步测试|
|src/script/00.js:3471|deg|Math.floor(rnd() * SCALE_MAJOR.length)|需要进一步测试|
|src/script/00.js:3472|oct|Math.floor(rnd() * 2)|需要进一步测试|
|src/script/00.js:3482|noiseBuffer|null|需要进一步测试|
|src/script/00.js:3486|len|Math.floor(audioCtx.sampleRate * 0.05)|需要进一步测试|
|src/script/00.js:3488|data|noiseBuffer.getChannelData(0)|需要进一步测试|
|src/script/00.js:3489|i|0|需要进一步测试|
|src/script/00.js:3502|MENU_FADE_SEC|0.5|需要进一步测试|
|src/script/00.js:3503|menuBgm|{   active: false,   currentKey: null,   pendingKey: null,   buffers: {},   uploadedKeys: new Set(),   outGain: null,   voices: [],   origin: 0,   pausedPos: nu|需要进一步测试|
|src/script/00.js:3520|startBeat|Math.max(1, Number(menuCfg.loopStartBeat) ／／ 1)|需要进一步测试|
|src/script/00.js:3521|endBeat|Math.max(startBeat + 4, Number(menuCfg.loopEndBeat) ／／ 33)|需要进一步测试|
|src/script/00.js:3536|targetEnd|menuLoopSpan().endSec|需要进一步测试|
|src/script/00.js:3537|missing|targetEnd - buf.duration|需要进一步测试|
|src/script/00.js:3538|maxRepair|Math.min(0.35, menuSecPerBeat() * 0.75)|需要进一步测试|
|src/script/00.js:3542|sampleRate|buf.sampleRate ／／ audioCtx.sampleRate|需要进一步测试|
|src/script/00.js:3543|targetLength|Math.ceil(targetEnd * sampleRate) + 1|需要进一步测试|
|src/script/00.js:3544|fixed|audioCtx.createBuffer(buf.numberOfChannels, targetLength, sampleRate)|需要进一步测试|
|src/script/00.js:3545|ch|0|需要进一步测试|
|src/script/00.js:3566|sr|audioCtx.sampleRate|需要进一步测试|
|src/script/00.js:3567|bpm|Math.max(40, Number(menuCfg.bpm) ／／ 130)|需要进一步测试|
|src/script/00.js:3568|beats|Math.max(4, (Number(menuCfg.loopEndBeat) ／／ 33) - (Number(menuCfg.loopStartBeat) ／／ 1))|需要进一步测试|
|src/script/00.js:3569|bars|Math.max(8, Math.ceil(beats / 4))|需要进一步测试|
|src/script/00.js:3570|totalSteps|bars * 16|需要进一步测试|
|src/script/00.js:3571|stepSec|60 / bpm / 16|需要进一步测试|
|src/script/00.js:3572|dur|totalSteps * stepSec|需要进一步测试|
|src/script/00.js:3573|len|Math.max(1, Math.floor(sr * dur))|需要进一步测试|
|src/script/00.js:3574|offline|new OfflineAudioContext(1, len, sr)|需要进一步测试|
|src/script/00.js:3575|pat|buildMenuPattern(key, bars)|需要进一步测试|
|src/script/00.js:3576|trim|Math.max(0, Math.min(3, Number(menuCfg.gainTrims[key]) ／／ 1))|需要进一步测试|
|src/script/00.js:3577|step|0|需要进一步测试|
|src/script/00.js:3578|time|step * stepSec|需要进一步测试|
|src/script/00.js:3579|bassMidi|pat.bass[step]|需要进一步测试|
|src/script/00.js:3580|leadMidi|pat.lead[step]|需要进一步测试|
|src/script/00.js:3581|hatOn|pat.hat[step]|需要进一步测试|
|src/script/00.js:3583|osc|offline.createOscillator()|需要进一步测试|
|src/script/00.js:3584|g|offline.createGain()|需要进一步测试|
|src/script/00.js:3594|osc|offline.createOscillator()|需要进一步测试|
|src/script/00.js:3595|g|offline.createGain()|需要进一步测试|
|src/script/00.js:3605|buf|offline.createBuffer(1, Math.floor(sr * 0.05), sr)|需要进一步测试|
|src/script/00.js:3606|dd|buf.getChannelData(0)|需要进一步测试|
|src/script/00.js:3607|i|0|需要进一步测试|
|src/script/00.js:3608|src|offline.createBufferSource()|需要进一步测试|
|src/script/00.js:3610|g|offline.createGain()|需要进一步测试|
|src/script/00.js:3613|hp|offline.createBiquadFilter()|需要进一步测试|
|src/script/00.js:3624|menuLoading|{}|需要进一步测试|
|src/script/00.js:3628|p|(async () => {     let buf = null;     if (db) {       try {         const ab = await new Promise(res => {           const tx = db.transaction('sounds', 'readon|需要进一步测试|
|src/script/00.js:3629|buf|null|需要进一步测试|
|src/script/00.js:3632|ab|await new Promise(res => {           const tx = db.transaction('sounds', 'readonly');           const req = tx.objectStore('sounds').get('bgm_menu_' + key);    |需要进一步测试|
|src/script/00.js:3633|tx|db.transaction('sounds', 'readonly')|需要进一步测试|
|src/script/00.js:3634|req|tx.objectStore('sounds').get('bgm_menu_' + key)|需要进一步测试|
|src/script/00.js:3657|span|menuLoopSpan()|需要进一步测试|
|src/script/00.js:3659|startSec|Math.min(span.startSec, Math.max(0, buf.duration - 0.05))|需要进一步测试|
|src/script/00.js:3660|endSec|Math.min(span.endSec, buf.duration)|需要进一步测试|
|src/script/00.js:3667|t|Number(menuCfg.gainTrims[key])|需要进一步测试|
|src/script/00.js:3673|lp|menuLoopParams(buf, key)|需要进一步测试|
|src/script/00.js:3674|elapsed|Math.max(0, t - menuBgm.origin)|需要进一步测试|
|src/script/00.js:3676|dur|lp.endSec - lp.startSec|需要进一步测试|
|src/script/00.js:3682|r|v.ramp|需要进一步测试|
|src/script/00.js:3690|now|audioCtx.currentTime|需要进一步测试|
|src/script/00.js:3691|cur|menuVoiceGainAt(v, now)|需要进一步测试|
|src/script/00.js:3692|g|v.gain.gain|需要进一步测试|
|src/script/00.js:3700|lp|menuLoopParams(buf, key)|需要进一步测试|
|src/script/00.js:3701|src|audioCtx.createBufferSource()|需要进一步测试|
|src/script/00.js:3706|gain|audioCtx.createGain()|需要进一步测试|
|src/script/00.js:3710|offset|Math.min(menuPosForKey(key, buf, startAt), Math.max(0, buf.duration - 0.02))|需要进一步测试|
|src/script/00.js:3711|v|{ key, src, gain, ramp: { v0: 0, v1: 0, t0: 0, t1: 0 }, stopping: false, loopStart: src.loopStart, loopEnd: src.loopEnd }|需要进一步测试|
|src/script/00.js:3715|i|menuBgm.voices.indexOf(v)|需要进一步测试|
|src/script/00.js:3726|dur|fadeSec == null ? MENU_FADE_SEC : fadeSec|需要进一步测试|
|src/script/00.js:3737|now|audioCtx.currentTime|需要进一步测试|
|src/script/00.js:3738|startAt|now + 0.03|需要进一步测试|
|src/script/00.js:3748|live|menuBgm.voices.find(v => v.key === key && !v.stopping)|需要进一步测试|
|src/script/00.js:3750|target|menuTrimFor(key)|需要进一步测试|
|src/script/00.js:3762|token|++menuBgm.opToken|需要进一步测试|
|src/script/00.js:3768|buf|await menuLoadBuffer(key)|需要进一步测试|
|src/script/00.js:3781|endT|audioCtx.currentTime + MENU_FADE_SEC|需要进一步测试|
|src/script/00.js:3782|cur|menuBgm.currentKey|需要进一步测试|
|src/script/00.js:3783|buf|cur ? menuBgm.buffers[cur] : null|需要进一步测试|
|src/script/00.js:3806|cur|menuBgm.currentKey|需要进一步测试|
|src/script/00.js:3807|buf|cur ? menuBgm.buffers[cur] : null|需要进一步测试|
|src/script/00.js:3809|lp|menuLoopParams(buf, cur)|需要进一步测试|
|src/script/00.js:3810|ls|Math.min(lp.startSec, Math.max(0, buf.duration - 0.02))|需要进一步测试|
|src/script/00.js:3811|le|Math.min(lp.endSec, buf.duration)|需要进一步测试|
|src/script/00.js:3812|live|menuBgm.voices.find(v => v.key === cur && !v.stopping)|需要进一步测试|
|src/script/00.js:3818|menuReloadTimer|null|需要进一步测试|
|src/script/00.js:3823|key|menuBgm.currentKey|需要进一步测试|
|src/script/00.js:3827|buf|await menuLoadBuffer(key)|需要进一步测试|
|src/script/00.js:3831|startAt|audioCtx.currentTime + 0.03|需要进一步测试|
|src/script/00.js:3839|key|getWelcomeTrackKey()|需要进一步测试|
|src/script/00.js:3845|box|document.getElementById('bgmEngineConsole')|需要进一步测试|
|src/script/00.js:3847|trimRows|MENU_TRACK_KEYS.map(k =>     '<div class="trim-row">' +       '<span class="trim-name">' + MENU_TRACK_META[k].name + '</span>' +       '<input type="range" min=|需要进一步测试|
|src/script/00.js:3905|el|document.getElementById('cfgMenuBpmVal')|需要进一步测试|
|src/script/00.js:3921|el|document.getElementById('trim-val-' + k)|需要进一步测试|
|src/script/00.js:3924|el|document.getElementById('cfgBattleBaseBpmVal')|需要进一步测试|
|src/script/00.js:3925|el|document.getElementById('cfgBattleSet8BpmVal')|需要进一步测试|
|src/script/00.js:3930|rollLoopNode|null|需要进一步测试|
|src/script/00.js:3931|rollLoopGain|null|需要进一步测试|
|src/script/00.js:3935|sr|audioCtx.sampleRate|需要进一步测试|
|src/script/00.js:3936|dur|0.5|需要进一步测试|
|src/script/00.js:3937|buf|audioCtx.createBuffer(1, Math.floor(sr * dur), sr)|需要进一步测试|
|src/script/00.js:3938|d|buf.getChannelData(0)|需要进一步测试|
|src/script/00.js:3939|steps|8|需要进一步测试|
|src/script/00.js:3940|i|0|需要进一步测试|
|src/script/00.js:3941|t|i / sr|需要进一步测试|
|src/script/00.js:3942|step|Math.floor(t / (dur / steps))|需要进一步测试|
|src/script/00.js:3943|inStep|t - step * (dur / steps)|需要进一步测试|
|src/script/00.js:3956|buffer|selectFxBuffer('roll_loop') ／／ makeRollLoopBuffer()|需要进一步测试|
|src/script/00.js:3960|now|audioCtx.currentTime|需要进一步测试|
|src/script/00.js:3974|now|audioCtx.currentTime|需要进一步测试|
|src/script/00.js:3989|UI_DB_NAME|'PoliticsUiDB'|需要进一步测试|
|src/script/00.js:3990|uiDbPromise|null|需要进一步测试|
|src/script/00.js:3995|r|indexedDB.open(UI_DB_NAME, 1)|需要进一步测试|
|src/script/00.js:3997|d|e.target.result|需要进一步测试|
|src/script/00.js:4007|d|await uiDbOpen()|需要进一步测试|
|src/script/00.js:4011|tx|d.transaction('kv', mode)|需要进一步测试|
|src/script/00.js:4012|req|fn(tx.objectStore('kv'))|需要进一步测试|
|src/script/00.js:4019|wallpaperUrl|null|需要进一步测试|
|src/script/00.js:4021|v|Number(STORAGE.get('politics_wall_veil', 0.35))|需要进一步测试|
|src/script/00.js:4025|root|document.documentElement|需要进一步测试|
|src/script/00.js:4026|a|wallpaperUrl ? getWallVeil() : 0|需要进一步测试|
|src/script/00.js:4028|label|document.getElementById('wallVeilLabel')|需要进一步测试|
|src/script/00.js:4030|range|document.getElementById('cfgWallVeil')|需要进一步测试|
|src/script/00.js:4034|root|document.documentElement|需要进一步测试|
|src/script/00.js:4042|st|document.getElementById('wallpaperStatus')|需要进一步测试|
|src/script/00.js:4047|MAX_EDGE|2560|需要进一步测试|
|src/script/00.js:4048|img||需要进一步测试|
|src/script/00.js:4053|url|URL.createObjectURL(file)|需要进一步测试|
|src/script/00.js:4054|im|new Image()|需要进一步测试|
|src/script/00.js:4060|w0|img.width|需要进一步测试|
|src/script/00.js:4060|h0|img.height|需要进一步测试|
|src/script/00.js:4061|scale|Math.min(1, MAX_EDGE / Math.max(w0, h0))|需要进一步测试|
|src/script/00.js:4062|canvas|document.createElement('canvas')|需要进一步测试|
|src/script/00.js:4065|ctx|canvas.getContext('2d')|需要进一步测试|
|src/script/00.js:4073|file|input.files && input.files[0]|需要进一步测试|
|src/script/00.js:4079|blob|await compressWallpaper(file)|需要进一步测试|
|src/script/00.js:4081|saved|await uiDbReq('readwrite', st => st.put(blob, 'wallpaper'))|需要进一步测试|
|src/script/00.js:4098|b|await uiDbReq('readonly', st => st.get('wallpaper'))|需要进一步测试|
|src/script/00.js:4116|bar|document.getElementById('audioHintBar')|需要进一步测试|
|src/script/00.js:4128|autoPlayRetries|0|需要进一步测试|
|src/script/00.js:4129|resumeRetryTimer|null|需要进一步测试|
|src/script/00.js:4140|bar|document.getElementById('audioHintBar')|需要进一步测试|
|src/script/00.js:4148|m|document.getElementById('welcomeModal')|需要进一步测试|
|src/script/00.js:4156|unlockByGesture|() => {     getAudioContext().then(() => {       hideAudioHint();       const wm = document.getElementById('welcomeModal');       if (wm && wm.classList.contain|需要进一步测试|
|src/script/00.js:4159|wm|document.getElementById('welcomeModal')|需要进一步测试|
|src/script/00.js:4183|ITEM_DEFS|{   green:{name:'绿龟壳',icon:'🟢',kind:'attack',def:'green',charges:1,desc:'随机攻击其他小组 -1/4；可抵挡常规攻击与刺龟壳。'},   triple_green:{name:'三重绿龟壳',icon:'🟢³',kind:'attack',de|需要进一步测试|
|src/script/00.js:4214|ITEM_KEYS|Object.keys(ITEM_DEFS)|需要进一步测试|
|src/script/00.js:4215|ITEM_DEFENSE_KEYS|new Set(['green','triple_green','red','triple_red','banana','triple_banana','horn'])|需要进一步测试|
|src/script/00.js:4216|activeItemGroupId|null|需要进一步测试|
|src/script/00.js:4216|activeItemTab|'detail'|需要进一步测试|
|src/script/00.js:4216|itemDrawBusy|false|需要进一步测试|
|src/script/00.js:4216|bulletTimer|null|需要进一步测试|
|src/script/00.js:4222|seen|new Set()|需要进一步测试|
|src/script/00.js:4226|key|it&&it.key|需要进一步测试|
|src/script/00.js:4232|maxCharges|Math.max(1,Number(ITEM_DEFS[it.key]?.charges)／／1)|需要进一步测试|
|src/script/00.js:4233|storedCharges|Number(it.charges)|需要进一步测试|
|src/script/00.js:4234|charges|Number.isFinite(storedCharges)         ? Math.max(1,Math.min(maxCharges,Math.trunc(storedCharges))) : maxCharges|需要进一步测试|
|src/script/00.js:4236|acquiredAt|Number(it.acquiredAt)／／Date.now()+i|需要进一步测试|
|src/script/00.js:4260|it|g.inventory[index]|需要进一步测试|
|src/script/00.js:4262|d|document.createElement('div')|需要进一步测试|
|src/script/00.js:4265|out|[]|需要进一步测试|
|src/script/00.js:4269|it|g.inventory[0]|需要进一步测试|
|src/script/00.js:4269|idx|0|需要进一步测试|
|src/script/00.js:4281|loss|denom===2?roundHalf(target.score):denom===3?roundThird(target.score):roundQuarter(target.score)|需要进一步测试|
|src/script/00.js:4282|add|denom===4?roundQuarter(target.score):Math.round(target.score/denom)|需要进一步测试|
|src/script/00.js:4288|p|total<=1?1:(pos-1)/(total-1)|需要进一步测试|
|src/script/00.js:4288|virtual|1+p*23|需要进一步测试|
|src/script/00.js:4289|W|{}|需要进一步测试|
|src/script/00.js:4289|put|(k,w)=>{W[k]=w}|需要进一步测试|
|src/script/00.js:4374|arr|Object.entries(weights).filter(([,w])=>w>0)|需要进一步测试|
|src/script/00.js:4374|sum|arr.reduce((a,[,w])=>a+w,0)|需要进一步测试|
|src/script/00.js:4374|r|Math.random()*sum|需要进一步测试|
|src/script/00.js:4374|[k,w]||需要进一步测试|
|src/script/00.js:4375|r|ranking()|需要进一步测试|
|src/script/00.js:4375|pos|r.findIndex(x=>x.id===g.id)+1|需要进一步测试|
|src/script/00.js:4378|actor|state.groups.find(g=>g.id===actorId)|需要进一步测试|
|src/script/00.js:4379|after|ranking().map(g=>g.id)|需要进一步测试|
|src/script/00.js:4379|beforeIdx|beforeOrder.indexOf(actorId)|需要进一步测试|
|src/script/00.js:4379|afterIdx|after.indexOf(actorId)|需要进一步测试|
|src/script/00.js:4380|passed|beforeOrder.slice(afterIdx,beforeIdx).filter(id=>id!==actorId)|需要进一步测试|
|src/script/00.js:4381|t|state.groups.find(g=>g.id===id)|需要进一步测试|
|src/script/00.js:4384|g|state.groups.find(x=>x.id===groupId)|需要进一步测试|
|src/script/00.js:4386|it|g.inventory[index]|需要进一步测试|
|src/script/00.js:4386|key|it.key|需要进一步测试|
|src/script/00.js:4386|d|ITEM_DEFS[key]|需要进一步测试|
|src/script/00.js:4386|r|ranking()|需要进一步测试|
|src/script/00.js:4386|ri|r.findIndex(x=>x.id===g.id)|需要进一步测试|
|src/script/00.js:4386|before|r.map(x=>x.id)|需要进一步测试|
|src/script/00.js:4388|used|true|需要进一步测试|
|src/script/00.js:4389|other|()=>state.groups.filter(x=>x.id!==g.id&&eligibleForItems(x))|需要进一步测试|
|src/script/00.js:4390|pool|other()|需要进一步测试|
|src/script/00.js:4391|t|r[ri-1]|需要进一步测试|
|src/script/00.js:4392|t|r[0]|需要进一步测试|
|src/script/00.js:4393|t|r[ri+1]|需要进一步测试|
|src/script/00.js:4395|pool|other()|需要进一步测试|
|src/script/00.js:4395|center|pool[Math.floor(Math.random()*pool.length)]|需要进一步测试|
|src/script/00.js:4395|ci|r.findIndex(x=>x.id===center.id)|需要进一步测试|
|src/script/00.js:4396|pool|other().sort(()=>Math.random()-.5).slice(0,3)|需要进一步测试|
|src/script/00.js:4402|t|r[ri-1]|需要进一步测试|
|src/script/00.js:4407|stealIndex|t.inventory.length-1|需要进一步测试|
|src/script/00.js:4414|stolen|t.inventory.splice(stealIndex,1)[0]|需要进一步测试|
|src/script/00.js:4445|target|r[Math.max(0,ri-3)]|需要进一步测试|
|src/script/00.js:4459|c|document.querySelector(.group-row-card[data-group-id="${id}"])|需要进一步测试|
|src/script/00.js:4461|any|false|需要进一步测试|
|src/script/00.js:4461|t|state.groups.find(x=>x.id===g.itemEffect.targetId)|需要进一步测试|
|src/script/00.js:4461|ix|g.inventory.findIndex(x=>x.key==='bullet')|需要进一步测试|
|src/script/00.js:4463|on|(state.itemGlobal?.blooperUntil／／0)>Date.now()|需要进一步测试|
|src/script/00.js:4463|v|document.getElementById('squidVeil')|需要进一步测试|
|src/script/00.js:4466|eligible|state.groups.filter(g=>eligibleForItems(g)&&g.inventory.length<3)|需要进一步测试|
|src/script/00.js:4466|ov|document.getElementById('itemDrawOverlay')|需要进一步测试|
|src/script/00.js:4466|grid|document.getElementById('itemDrawGrid')|需要进一步测试|
|src/script/00.js:4467|timer|setInterval(()=>{eligible.forEach(g=>{const k=ITEM_KEYS[Math.floor(Math.random()*ITEM_KEYS.length)],c=grid.querySelector([data-draw-id="${g.id}"] .roulette);i|需要进一步测试|
|src/script/00.js:4467|k|ITEM_KEYS[Math.floor(Math.random()*ITEM_KEYS.length)]|需要进一步测试|
|src/script/00.js:4467|c|grid.querySelector([data-draw-id="${g.id}"] .roulette)|需要进一步测试|
|src/script/00.js:4468|key|drawItemForGroup(g)|需要进一步测试|
|src/script/00.js:4468|card|grid.querySelector([data-draw-id="${g.id}"])|需要进一步测试|
|src/script/00.js:4475|g|state.groups.find(x=>x.id===activeItemGroupId)|需要进一步测试|
|src/script/00.js:4479|body|document.getElementById('itemWindowBody')|需要进一步测试|
|src/script/00.js:4479|locked|!!state.isLocked|需要进一步测试|
|src/script/00.js:4479|disabled|locked?'disabled':''|需要进一步测试|
|src/script/00.js:4481|st|g.itemStats／／{}|需要进一步测试|
|src/script/00.js:4481|total|(st.correct／／0)+(st.wrong／／0)|需要进一步测试|
|src/script/00.js:4481|rate|total?Math.round((st.correct／／0)/total*100):0|需要进一步测试|
|src/script/00.js:4482|statusParts|[]|需要进一步测试|
|src/script/00.js:4484|type|g.itemEffect.type|需要进一步测试|
|src/script/00.js:4486|def|ITEM_DEFS[type]|需要进一步测试|
|src/script/00.js:4507|status|statusParts.length?statusParts.join(' · '):'无'|需要进一步测试|
|src/script/00.js:4547|canUse|!locked&&eligibleForItems(g)|需要进一步测试|
|src/script/00.js:4548|it|g.inventory[i]|需要进一步测试|
|src/script/00.js:4548|d|ITEM_DEFS[it.key]|需要进一步测试|
|src/script/00.js:4553|el|document.getElementById('groupDetailColorPreview')|需要进一步测试|
|src/script/00.js:4562|g|state.groups.find(x=>x.id===id)|需要进一步测试|
|src/script/00.js:4563|name|document.getElementById('groupDetailName')?.value.trim()／／''|需要进一步测试|
|src/script/00.js:4564|rawNo|document.getElementById('groupDetailNumber')?.value.trim()／／''|需要进一步测试|
|src/script/00.js:4567|groupNo|Number(rawNo)|需要进一步测试|
|src/script/00.js:4569|rawMembers|document.getElementById('groupDetailMembers')?.value／／''|需要进一步测试|
|src/script/00.js:4570|members|Array.from(new Set(rawMembers.split(/[\n,，、]+/).map(s=>s.trim()).filter(Boolean)))|需要进一步测试|
|src/script/00.js:4571|changed|g.name!==name／／Number(g.groupNo)!==groupNo／／JSON.stringify(g.members／／[])!==JSON.stringify(members)|需要进一步测试|
|src/script/00.js:4587|n|Number(document.getElementById('itemCustomScore').value)|需要进一步测试|
|src/script/00.js:4589|c|document.querySelector(.group-row-card[data-group-id="${g.id}"])|需要进一步测试|
|src/script/00.js:4589|firstDef|g.inventory.find(it=>ITEM_DEFS[it.key]?.def)|需要进一步测试|
|src/script/00.js:4589|head|c.querySelector('.card-header-row')|需要进一步测试|
|src/script/00.js:4589|slots|document.createElement('div')|需要进一步测试|
|src/script/00.js:4589|it|g.inventory[i]|需要进一步测试|
|src/script/00.js:4589|mb|c.querySelector('.more-btn')|需要进一步测试|
|src/script/00.js:4592|_itemBaseJudgeRound|legacyJudgeRound|需要进一步测试|
|src/script/00.js:4592|before|ranking().map(g=>g.id)|需要进一步测试|
|src/script/00.js:4592|answered|state.groups.map(g=>({id:g.id,answered:!!g.selectedOpt,correct:g.selectedOpt===state.correctAns}))|需要进一步测试|
|src/script/00.js:4592|g|state.groups.find(q=>q.id===x.id)|需要进一步测试|
|src/script/00.js:4592|r|ranking()|需要进一步测试|
|src/script/00.js:4592|i|r.findIndex(q=>q.id===g.id)|需要进一步测试|
|src/script/00.js:4592|ix|g.inventory.findIndex(it=>it.key==='power')|需要进一步测试|
|src/script/00.js:4595|savedItemGlobal|STORAGE.getJSON('politics_item_global',null)|需要进一步测试|
|src/script/00.js:4604|pickerInfoTab|'history'|需要进一步测试|
|src/script/00.js:4604|handRaiseGroupId|null|需要进一步测试|
|src/script/00.js:4604|pendingItemIconKey|null|需要进一步测试|
|src/script/00.js:4613|BUILTIN_ITEM_ICONS_V2121|{"green":"@@RESOURCE:asset-000.txt@@","triple_green":"@@RESOURCE:asset-001.txt@@","red":"@@RESOURCE:asset-002.txt@@","triple_red":"@@RESOURCE:asset-003.txt@@","|需要进一步测试|
|src/script/00.js:4614|BUILTIN_ITEM_BOX_V2121|"@@RESOURCE:asset-026.txt@@"|需要进一步测试|
|src/script/00.js:4617|d|ITEM_DEFS[key]|需要进一步测试|
|src/script/00.js:4617|custom|state.itemGlobal.customIcons[key]|需要进一步测试|
|src/script/00.js:4617|builtin|BUILTIN_ITEM_ICONS_V2121[key]|需要进一步测试|
|src/script/00.js:4618|src|Reliability.safeImage(custom)／／builtin|需要进一步测试|
|src/script/00.js:4626|box|document.getElementById('pickerInfoBox')|需要进一步测试|
|src/script/00.js:4628|a|state.groups.reduce((n,g)=>n+(g.itemStats?.correct／／0)+(g.itemStats?.wrong／／0),0)|需要进一步测试|
|src/script/00.js:4631|arr|state.itemGlobal.pickerHistory／／[]|需要进一步测试|
|src/script/00.js:4634|_v2OpenPicker|openPickerModal|需要进一步测试|
|src/script/00.js:4635|el|document.getElementById('pickerScoreTarget')|需要进一步测试|
|src/script/00.js:4635|w|slotEngine.chosenResult|需要进一步测试|
|src/script/00.js:4635|g|state.picker.mode==='group'?w:w.group|需要进一步测试|
|src/script/00.js:4636|w|slotEngine.chosenResult|需要进一步测试|
|src/script/00.js:4637|g|pickerTargetGroup()|需要进一步测试|
|src/script/00.js:4638|n|Math.round(Number(document.getElementById('pickerCustomScore')?.value))|需要进一步测试|
|src/script/00.js:4639|_v2StopSlot|stopSlotSpin|需要进一步测试|
|src/script/00.js:4639|w|slotEngine.chosenResult|需要进一步测试|
|src/script/00.js:4639|g|state.picker.mode==='group'?w:w.group|需要进一步测试|
|src/script/00.js:4639|text|state.picker.mode==='group'?抽中 ${g.name}:抽中 ${w.memberName}（${g.name}）|需要进一步测试|
|src/script/00.js:4644|box|document.getElementById('handGroupGrid')|需要进一步测试|
|src/script/00.js:4645|arr|[...document.querySelectorAll('.hand-group')]|需要进一步测试|
|src/script/00.js:4645|idx|state.groups.findIndex(g=>g.id===id)|需要进一步测试|
|src/script/00.js:4647|g|state.groups.find(x=>x.id===handRaiseGroupId)|需要进一步测试|
|src/script/00.js:4650|box|document.getElementById('handRewardBox')|需要进一步测试|
|src/script/00.js:4654|g|state.groups.find(x=>x.id===handRaiseGroupId)|需要进一步测试|
|src/script/00.js:4654|k|drawItemForGroup(g)|需要进一步测试|
|src/script/00.js:4655|g|state.groups.find(x=>x.id===handRaiseGroupId)|需要进一步测试|
|src/script/00.js:4659|eligible|state.groups.filter(g=>eligibleForItems(g)&&g.inventory.length<3)|需要进一步测试|
|src/script/00.js:4663|overlays|new Map()|需要进一步测试|
|src/script/00.js:4664|c|document.querySelector(.group-row-card[data-group-id="${g.id}"])|需要进一步测试|
|src/script/00.js:4664|o|document.createElement('div')|需要进一步测试|
|src/script/00.js:4665|timer|setInterval(()=>eligible.forEach(g=>{const o=overlays.get(g.id);if(!o)return;const r=ranking(),pos=r.findIndex(x=>x.id===g.id)+1;const k=weightedPick(itemDropWe|需要进一步测试|
|src/script/00.js:4665|o|overlays.get(g.id)|需要进一步测试|
|src/script/00.js:4665|r|ranking()|需要进一步测试|
|src/script/00.js:4665|pos|r.findIndex(x=>x.id===g.id)+1|需要进一步测试|
|src/script/00.js:4665|k|weightedPick(itemDropWeights(pos,r.length))|需要进一步测试|
|src/script/00.js:4666|k|drawItemForGroup(g)|需要进一步测试|
|src/script/00.js:4666|o|overlays.get(g.id)|需要进一步测试|
|src/script/00.js:4667|c|document.querySelector(.group-row-card[data-group-id="${g.id}"])|需要进一步测试|
|src/script/00.js:4674|box|document.getElementById('v2ItemEncyclopedia')|需要进一步测试|
|src/script/00.js:4675|d|ITEM_DEFS[k]|需要进一步测试|
|src/script/00.js:4678|f|e.target.files?.[0]|需要进一步测试|
|src/script/00.js:4678|rd|new FileReader()|需要进一步测试|
|src/script/00.js:4681|blob|new Blob([JSON.stringify({version:1,icons:state.itemGlobal.customIcons},null,2)],{type:'application/json'})|需要进一步测试|
|src/script/00.js:4681|a|document.createElement('a')|需要进一步测试|
|src/script/00.js:4682|f|e.target.files?.[0]|需要进一步测试|
|src/script/00.js:4682|rd|new FileReader()|需要进一步测试|
|src/script/00.js:4682|x|JSON.parse(rd.result)|需要进一步测试|
|src/script/00.js:4686|sc|document.querySelector('#view-settings .settings-scroll')|需要进一步测试|
|src/script/00.js:4687|tabs|document.createElement('div')|需要进一步测试|
|src/script/00.js:4688|item|document.createElement('div')|需要进一步测试|
|src/script/00.js:4693|sc|document.querySelector('#view-settings .settings-scroll')|需要进一步测试|
|src/script/00.js:4693|item|document.getElementById('v2ItemPane')|需要进一步测试|
|src/script/00.js:4696|titles|[...sc.querySelectorAll('.setting-section-title')]|需要进一步测试|
|src/script/00.js:4703|m|document.getElementById('aboutMain')|需要进一步测试|
|src/script/00.js:4710|_v2RenderItemWindow|renderItemWindow|需要进一步测试|
|src/script/00.js:4710|g|state.groups.find(x=>x.id===activeItemGroupId)|需要进一步测试|
|src/script/00.js:4710|body|document.getElementById('itemWindowBody')|需要进一步测试|
|src/script/00.js:4710|d|document.createElement('div')|需要进一步测试|
|src/script/00.js:4711|g|state.groups.find(x=>x.id===id)|需要进一步测试|
|src/script/00.js:4712|g|state.groups.find(x=>x.id===id)|需要进一步测试|
|src/script/00.js:4715|_v2Enhance|enhanceItemCards|需要进一步测试|
|src/script/00.js:4715|c|document.querySelector(.group-row-card[data-group-id="${g.id}"])|需要进一步测试|
|src/script/00.js:4715|it|g.inventory[i]|需要进一步测试|
|src/script/00.js:4715|charge|s.querySelector('.charges')?.outerHTML／／''|需要进一步测试|
|src/script/00.js:4716|_v2RenderItemWindowIcons|renderItemWindow|需要进一步测试|
|src/script/00.js:4716|g|state.groups.find(x=>x.id===activeItemGroupId)|需要进一步测试|
|src/script/00.js:4716|it|g.inventory[i]|需要进一步测试|
|src/script/00.js:4719|_v2Judge|legacyJudgeRound|需要进一步测试|
|src/script/00.js:4719|was|state.roundActive&&!state.evaluated|需要进一步测试|
|src/script/00.js:4724|_v2SwitchView|switchView|需要进一步测试|
|src/script/00.js:4729|handItemDrawTimer|null|需要进一步测试|
|src/script/00.js:4729|handItemDrawFinishTimer|null|需要进一步测试|
|src/script/00.js:4729|handItemDrawGroupId|null|需要进一步测试|
|src/script/00.js:4729|handItemPendingKey|null|需要进一步测试|
|src/script/00.js:4729|handItemDrawStartedAt|0|需要进一步测试|
|src/script/00.js:4734|wasPending|handItemDrawGroupId!=null && handItemPendingKey==null|需要进一步测试|
|src/script/00.js:4739|_v21CloseHandRaise|closeHandRaise|需要进一步测试|
|src/script/00.js:4742|_v21SelectHandGroup|selectHandGroup|需要进一步测试|
|src/script/00.js:4748|_v21JudgeHandRaise|judgeHandRaise|需要进一步测试|
|src/script/00.js:4753|g|state.groups.find(x=>x.id===handRaiseGroupId)|需要进一步测试|
|src/script/00.js:4754|btn|[...document.querySelectorAll('#handRewardBox button')].find(b=>b.textContent.includes('抽取道具'))|需要进一步测试|
|src/script/00.js:4764|g|state.groups.find(x=>x.id===handRaiseGroupId)|需要进一步测试|
|src/script/00.js:4771|box|document.getElementById('handRewardBox')|需要进一步测试|
|src/script/00.js:4780|tick|()=>{     const live=state.groups.find(x=>x.id===handItemDrawGroupId); if(!live)return;     const r=ranking(),pos=r.findIndex(x=>x.id===live.id)+1;     const k=|需要进一步测试|
|src/script/00.js:4781|live|state.groups.find(x=>x.id===handItemDrawGroupId)|需要进一步测试|
|src/script/00.js:4782|r|ranking()|需要进一步测试|
|src/script/00.js:4782|pos|r.findIndex(x=>x.id===live.id)+1|需要进一步测试|
|src/script/00.js:4783|k|weightedPick(itemDropWeights(pos,r.length))|需要进一步测试|
|src/script/00.js:4784|cap|document.getElementById('handItemCapsule')|需要进一步测试|
|src/script/00.js:4784|name|document.getElementById('handItemDrawName')|需要进一步测试|
|src/script/00.js:4784|bar|document.getElementById('handItemProgressBar')|需要进一步测试|
|src/script/00.js:4793|live|state.groups.find(x=>x.id===handItemDrawGroupId)|需要进一步测试|
|src/script/00.js:4795|r|ranking()|需要进一步测试|
|src/script/00.js:4795|pos|r.findIndex(x=>x.id===live.id)+1|需要进一步测试|
|src/script/00.js:4796|k|weightedPick(itemDropWeights(pos,r.length))|需要进一步测试|
|src/script/00.js:4803|slot|live.inventory.findIndex(x=>x.key===k && x.acquiredAt===Math.max(...live.inventory.filter(y=>y.key===k).map(y=>y.acquiredAt)))|需要进一步测试|
|src/script/00.js:4804|box|document.getElementById('handRewardBox')|需要进一步测试|
|src/script/00.js:4819|box|document.getElementById('handRewardBox')|需要进一步测试|
|src/script/00.js:4824|gid|handItemDrawGroupId|需要进一步测试|
|src/script/00.js:4824|k|handItemPendingKey|需要进一步测试|
|src/script/00.js:4825|g|state.groups.find(x=>x.id===gid)|需要进一步测试|
|src/script/00.js:4827|idx|g.inventory.map(x=>x.key).lastIndexOf(k)|需要进一步测试|
|src/script/00.js:4833|cards|[...document.querySelectorAll('#itemWindowBody .item-card')]|需要进一步测试|
|src/script/00.js:4842|r|ranking()|需要进一步测试|
|src/script/00.js:4842|i|r.findIndex(g=>g.id===gid)|需要进一步测试|
|src/script/00.js:4842|names|[]|需要进一步测试|
|src/script/00.js:4843|add|x=>{if(x&&x.id!==gid&&!names.includes(x.name))names.push(x.name)}|需要进一步测试|
|src/script/00.js:4858|useItemBeforeVisualDispatch|legacyUseItem|需要进一步测试|
|src/script/00.js:4860|g|state.groups.find(x=>x.id===groupId)|需要进一步测试|
|src/script/00.js:4860|before|g?.inventory?.[index]|需要进一步测试|
|src/script/00.js:4860|key|before?.key|需要进一步测试|
|src/script/00.js:4861|beforeSnapshot|JSON.stringify({inventory:g?.inventory／／[],effect:g?.itemEffect／／null,score:g?.score})|需要进一步测试|
|src/script/00.js:4862|result|useItemBeforeVisualDispatch.call(this,groupId,index,...rest)|需要进一步测试|
|src/script/00.js:4863|g2|state.groups.find(x=>x.id===groupId)|需要进一步测试|
|src/script/00.js:4864|afterSnapshot|JSON.stringify({inventory:g2?.inventory／／[],effect:g2?.itemEffect／／null,score:g2?.score})|需要进一步测试|
|src/script/00.js:4878|reader|new FileReader()|需要进一步测试|
|src/script/00.js:4880|img|new Image()|需要进一步测试|
|src/script/00.js:4882|size|384|需要进一步测试|
|src/script/00.js:4882|canvas|document.createElement('canvas')|需要进一步测试|
|src/script/00.js:4883|ctx|canvas.getContext('2d')|需要进一步测试|
|src/script/00.js:4884|pad|34|需要进一步测试|
|src/script/00.js:4884|max|size-pad*2|需要进一步测试|
|src/script/00.js:4885|scale|Math.min(max/img.naturalWidth,max/img.naturalHeight,1.8)|需要进一步测试|
|src/script/00.js:4886|w|Math.max(1,img.naturalWidth*scale)|需要进一步测试|
|src/script/00.js:4886|h|Math.max(1,img.naturalHeight*scale)|需要进一步测试|
|src/script/00.js:4897|f|e.target.files?.[0]|需要进一步测试|
|src/script/00.js:4908|icon|o.querySelector('.r-icon')|需要进一步测试|
|src/script/00.js:4908|name|o.querySelector('.r-name')|需要进一步测试|
|src/script/00.js:4920|eligible|state.groups.filter(g=>eligibleForItems(g)&&g.inventory.length<3)|需要进一步测试|
|src/script/00.js:4925|overlays|new Map()|需要进一步测试|
|src/script/00.js:4925|start|performance.now()|需要进一步测试|
|src/script/00.js:4925|total|3600|需要进一步测试|
|src/script/00.js:4927|c|document.querySelector(.group-row-card[data-group-id="${g.id}"])|需要进一步测试|
|src/script/00.js:4929|o|document.createElement('div')|需要进一步测试|
|src/script/00.js:4934|lastUpdate|new Map()|需要进一步测试|
|src/script/00.js:4934|currentKey|new Map()|需要进一步测试|
|src/script/00.js:4936|t|Math.min(1,(now-start)/total)|需要进一步测试|
|src/script/00.js:4938|interval|80 + 280*Math.pow(t,2.25)|需要进一步测试|
|src/script/00.js:4940|prev|lastUpdate.get(g.id)／／0|需要进一步测试|
|src/script/00.js:4943|r|ranking()|需要进一步测试|
|src/script/00.js:4943|pos|r.findIndex(x=>x.id===g.id)+1|需要进一步测试|
|src/script/00.js:4944|k|weightedPick(itemDropWeights(pos,r.length))|需要进一步测试|
|src/script/00.js:4951|r|ranking()|需要进一步测试|
|src/script/00.js:4951|pos|r.findIndex(x=>x.id===g.id)+1|需要进一步测试|
|src/script/00.js:4952|k|weightedPick(itemDropWeights(pos,r.length))|需要进一步测试|
|src/script/00.js:4953|o|overlays.get(g.id)|需要进一步测试|
|src/script/00.js:4956|hint|o.querySelector('.r-hint')|需要进一步测试|
|src/script/00.js:4962|c|document.querySelector(.group-row-card[data-group-id="${g.id}"])|需要进一步测试|
|src/script/00.js:4963|o|c.querySelector('.card-item-roulette')|需要进一步测试|
|src/script/00.js:4973|g|state.groups.find(x=>x.id===handRaiseGroupId)|需要进一步测试|
|src/script/00.js:4979|box|document.getElementById('handRewardBox')|需要进一步测试|
|src/script/00.js:4988|last|0|需要进一步测试|
|src/script/00.js:4988|raf|0|需要进一步测试|
|src/script/00.js:4988|total|3600|需要进一步测试|
|src/script/00.js:4992|t|Math.min(1,(now-handItemDrawStartedAt)/total)|需要进一步测试|
|src/script/00.js:4992|interval|80+280*Math.pow(t,2.25)|需要进一步测试|
|src/script/00.js:4993|bar|document.getElementById('handItemProgressBar')|需要进一步测试|
|src/script/00.js:4995|live|state.groups.find(x=>x.id===handItemDrawGroupId)|需要进一步测试|
|src/script/00.js:4996|r|ranking()|需要进一步测试|
|src/script/00.js:4996|pos|r.findIndex(x=>x.id===live.id)+1|需要进一步测试|
|src/script/00.js:4996|k|weightedPick(itemDropWeights(pos,r.length))|需要进一步测试|
|src/script/00.js:4997|cap|document.getElementById('handItemCapsule')|需要进一步测试|
|src/script/00.js:4997|name|document.getElementById('handItemDrawName')|需要进一步测试|
|src/script/00.js:5003|live|state.groups.find(x=>x.id===handItemDrawGroupId)|需要进一步测试|
|src/script/00.js:5005|r|ranking()|需要进一步测试|
|src/script/00.js:5005|pos|r.findIndex(x=>x.id===live.id)+1|需要进一步测试|
|src/script/00.js:5005|k|weightedPick(itemDropWeights(pos,r.length))|需要进一步测试|
|src/script/00.js:5009|slot|live.inventory.findIndex(x=>x===live.inventory[live.inventory.length-1])|需要进一步测试|
|src/script/00.js:5024|wasPending|handItemDrawGroupId!=null&&handItemPendingKey==null|需要进一步测试|
|src/script/00.js:5031|CARD_ITEM_FX_CLASS|{  green_shell:'cfx-green',triple_green:'cfx-green',  red_shell:'cfx-red',triple_red:'cfx-red',  spiny_shell:'cfx-spiny',  banana:'cfx-banana',triple_banana:'cf|需要进一步测试|
|src/script/00.js:5043|CARD_HIT_COLOR|{  green_shell:'#22c55e',triple_green:'#22c55e',red_shell:'#ef4444',triple_red:'#ef4444',  spiny_shell:'#3b82f6',banana:'#eab308',triple_banana:'#eab308',super_|需要进一步测试|
|src/script/00.js:5057|card|battleCard(gid)|需要进一步测试|
|src/script/00.js:5057|d|ITEM_DEFS[key]|需要进一步测试|
|src/script/00.js:5060|b|document.createElement('div')|需要进一步测试|
|src/script/00.js:5067|card|battleCard(id)|需要进一步测试|
|src/script/00.js:5075|r|ranking()|需要进一步测试|
|src/script/00.js:5075|i|r.findIndex(g=>g.id===gid)|需要进一步测试|
|src/script/00.js:5075|ids|[]|需要进一步测试|
|src/script/00.js:5075|add|g=>{if(g&&g.id!==gid&&!ids.includes(g.id))ids.push(g.id)}|需要进一步测试|
|src/script/00.js:5087|_v25ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/script/00.js:5092|targets|cardFxTargets(key,casterId)|需要进一步测试|
|src/script/00.js:5093|beneficial|['coin_shell','question_block'].includes(key)|需要进一步测试|
|src/script/00.js:5104|V26_HISTORY_KEY|'politics_history_stack_v26'|需要进一步测试|
|src/script/00.js:5107|hs|STORAGE.getJSON(V26_HISTORY_KEY,[])|需要进一步测试|
|src/script/00.js:5131|ITEM_FX_SOUND_SLOTS|[  {id:'item_draw_start',name:'道具抽取·启动',desc:'开始轮盘时'},  {id:'item_draw_tick',name:'道具抽取·滚动刻度',desc:'轮盘滚动过程中'},  {id:'item_draw_reveal',name:'道具抽取·定格',desc:'最终道具|需要进一步测试|
|src/script/00.js:5143|box|document.getElementById('itemFxSoundListV26')|需要进一步测试|
|src/script/00.js:5145|custom|!!customFxBuffers[s.id]／／hasSound('fx_'+s.id)|需要进一步测试|
|src/script/00.js:5155|_v26ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/script/00.js:5157|_v26TinyDefense|tinyDefenseToast|需要进一步测试|
|src/script/00.js:5160|n|0|需要进一步测试|
|src/script/00.js:5161|timer|setInterval(()=>{if(n++<13)playSound('item_draw_tick');else clearInterval(timer)},Math.max(150,ms/15))|需要进一步测试|
|src/script/00.js:5164|_v26GlobalDraw|globalItemDraw|需要进一步测试|
|src/script/00.js:5165|_v26HandDraw|handDrawItem|需要进一步测试|
|src/script/00.js:5168|UI_ICON_TARGETS|[  ['nav_welcome','欢迎','[data-view="welcome"]','🏠'],['nav_battle','比赛','[data-view="battle"]','⚔️'],  ['nav_history','历史','[data-view="history"]','📜'],['nav_a|需要进一步测试|
|src/script/00.js:5177|pendingUiIconV26|null|需要进一步测试|
|src/script/00.js:5180|map|uiIconsV26()|需要进一步测试|
|src/script/00.js:5182|el|document.querySelector(sel)|需要进一步测试|
|src/script/00.js:5184|data|Reliability.safeImage(map[id])|需要进一步测试|
|src/script/00.js:5186|template|document.createElement('template')|需要进一步测试|
|src/script/00.js:5188|text|template.innerHTML.trim()／／escapeHtml(label)|需要进一步测试|
|src/script/00.js:5195|f|document.getElementById('uiIconInputV26')|需要进一步测试|
|src/script/00.js:5197|f|e.target.files?.[0]|需要进一步测试|
|src/script/00.js:5198|m|uiIconsV26()|需要进一步测试|
|src/script/00.js:5200|m|uiIconsV26()|需要进一步测试|
|src/script/00.js:5202|box|document.getElementById('uiIconManagerV26')|需要进一步测试|
|src/script/00.js:5202|m|uiIconsV26()|需要进一步测试|
|src/script/00.js:5208|sc|document.querySelector('#view-settings .settings-scroll')|需要进一步测试|
|src/script/00.js:5213|original|[...sc.children]|需要进一步测试|
|src/script/00.js:5214|panes|{function:document.createElement('div'),sound:document.createElement('div'),data:document.createElement('div'),items:document.createElement('div')}|需要进一步测试|
|src/script/00.js:5216|mode|'function'|需要进一步测试|
|src/script/00.js:5218|txt|el.textContent／／''|需要进一步测试|
|src/script/00.js:5223|tabs|document.createElement('div')|需要进一步测试|
|src/script/00.js:5227|ui|document.createElement('div')|需要进一步测试|
|src/script/00.js:5228|item|document.createElement('div')|需要进一步测试|
|src/script/00.js:5229|fx|document.createElement('div')|需要进一步测试|
|src/script/00.js:5230|hidden|document.createElement('input')|需要进一步测试|
|src/script/00.js:5237|sc|document.querySelector('#view-settings .settings-scroll')|需要进一步测试|
|src/script/00.js:5248|sub|document.querySelector('#view-settings .fullview-sub')|需要进一步测试|
|src/script/00.js:5256|h|(window.visualViewport&&window.visualViewport.height)／／window.innerHeight|需要进一步测试|
|src/script/00.js:5281|programConfirmResolveV28|null|需要进一步测试|
|src/script/00.js:5284|previous|document.getElementById('programConfirmV28')|需要进一步测试|
|src/script/00.js:5288|o|document.createElement('div')|需要进一步测试|
|src/script/00.js:5301|settled|false|需要进一步测试|
|src/script/00.js:5302|finish|v=>{if(settled／／!o.isConnected)return;settled=true;document.removeEventListener('keydown',key);hideClassroomWindow(o,()=>o.remove());programConfirmResolveV28=nu|需要进一步测试|
|src/script/00.js:5306|key|e=>{if(!o.isConnected){document.removeEventListener('keydown',key);return}if(e.key==='Escape'){document.removeEventListener('keydown',key);finish(false)}else if|需要进一步测试|
|src/script/00.js:5317|unanswered|state.groups.filter(g=>g.selectedOpt==='')|需要进一步测试|
|src/script/00.js:5319|names|unanswered.map(g=>g.name).join('、')|需要进一步测试|
|src/script/00.js:5320|ok|await programConfirmV28(       仍有 ${unanswered.length} 个小组尚未完成作答：${names}\n现在选定正确答案后，未作答小组将保持“未作答”状态。,       {title:'作答尚未完成',cancelText:'返回检查',okText:继续选择 ${|需要进一步测试|
|src/script/00.js:5346|filtered|{}|需要进一步测试|
|src/script/00.js:5348|n|Number(w)／／0|需要进一步测试|
|src/script/00.js:5355|r|ranking()|需要进一步测试|
|src/script/00.js:5355|pos|Math.max(1,r.findIndex(x=>x.id===g.id)+1)|需要进一步测试|
|src/script/00.js:5356|weights|itemDropWeights(pos,r.length)|需要进一步测试|
|src/script/00.js:5357|held|heldItemKeysV281(g)|需要进一步测试|
|src/script/00.js:5360|k|weightedPickNoRepeatV281(weights,new Set([...batchUsed,...held]))|需要进一步测试|
|src/script/00.js:5371|eligible|state.groups.filter(g=>eligibleForItems(g)&&g.inventory.length<3)|需要进一步测试|
|src/script/00.js:5376|overlays|new Map()|需要进一步测试|
|src/script/00.js:5376|start|performance.now()|需要进一步测试|
|src/script/00.js:5376|total|3600|需要进一步测试|
|src/script/00.js:5378|c|document.querySelector(.group-row-card[data-group-id="${g.id}"])|需要进一步测试|
|src/script/00.js:5380|o|document.createElement('div')|需要进一步测试|
|src/script/00.js:5385|lastUpdate|new Map()|需要进一步测试|
|src/script/00.js:5387|t|Math.min(1,(now-start)/total)|需要进一步测试|
|src/script/00.js:5387|interval|80+280*Math.pow(t,2.25)|需要进一步测试|
|src/script/00.js:5389|prev|lastUpdate.get(g.id)／／0|需要进一步测试|
|src/script/00.js:5392|k|pickItemForGroupV281(g,new Set())|需要进一步测试|
|src/script/00.js:5398|batchUsed|new Set()|需要进一步测试|
|src/script/00.js:5400|k|pickItemForGroupV281(g,batchUsed)|需要进一步测试|
|src/script/00.js:5404|o|overlays.get(g.id)|需要进一步测试|
|src/script/00.js:5407|hint|o.querySelector('.r-hint')|需要进一步测试|
|src/script/00.js:5414|c|document.querySelector(.group-row-card[data-group-id="${g.id}"])|需要进一步测试|
|src/script/00.js:5416|o|c.querySelector('.card-item-roulette')|需要进一步测试|
|src/script/00.js:5429|g|state.groups.find(x=>x.id===handRaiseGroupId)|需要进一步测试|
|src/script/00.js:5435|box|document.getElementById('handRewardBox')|需要进一步测试|
|src/script/00.js:5443|last|0|需要进一步测试|
|src/script/00.js:5443|total|3600|需要进一步测试|
|src/script/00.js:5446|t|Math.min(1,(now-handItemDrawStartedAt)/total)|需要进一步测试|
|src/script/00.js:5446|interval|80+280*Math.pow(t,2.25)|需要进一步测试|
|src/script/00.js:5447|bar|document.getElementById('handItemProgressBar')|需要进一步测试|
|src/script/00.js:5449|live|state.groups.find(x=>x.id===handItemDrawGroupId)|需要进一步测试|
|src/script/00.js:5450|k|pickItemForGroupV281(live,new Set())|需要进一步测试|
|src/script/00.js:5451|cap|document.getElementById('handItemCapsule')|需要进一步测试|
|src/script/00.js:5451|name|document.getElementById('handItemDrawName')|需要进一步测试|
|src/script/00.js:5458|live|state.groups.find(x=>x.id===handItemDrawGroupId)|需要进一步测试|
|src/script/00.js:5460|k|pickItemForGroupV281(live,new Set())|需要进一步测试|
|src/script/00.js:5464|slot|live.inventory.length-1|需要进一步测试|
|src/script/00.js:5496|arr|state.groups.filter(g=>g.id!==caster.id && Number(g.score)>=0)|需要进一步测试|
|src/script/00.js:5501|amount|Math.round(Math.max(0,Number(target.score)／／0)*frac)|需要进一步测试|
|src/script/00.js:5510|it|g.inventory[index]|需要进一步测试|
|src/script/00.js:5516|_v282UseItem|legacyUseItem|需要进一步测试|
|src/script/00.js:5518|g|state.groups.find(x=>x.id===groupId)|需要进一步测试|
|src/script/00.js:5518|it|g?.inventory?.[index]|需要进一步测试|
|src/script/00.js:5518|key|it?.key|需要进一步测试|
|src/script/00.js:5530|t|v282RandomOther(g)|需要进一步测试|
|src/script/00.js:5535|t|v282RandomOther(g)|需要进一步测试|
|src/script/00.js:5542|r|ranking()|需要进一步测试|
|src/script/00.js:5542|p|r.findIndex(x=>x.id===g.id)|需要进一步测试|
|src/script/00.js:5542|targets|[r[p-1],r[p+1]].filter(x=>x&&Number(x.score)>=0)|需要进一步测试|
|src/script/00.js:5560|keys|Object.keys(ITEM_DEFS)|需要进一步测试|
|src/script/00.js:5571|eligible|state.groups.filter(g=>eligibleForItems(g)&&g.inventory.length<3)|需要进一步测试|
|src/script/00.js:5576|overlays|new Map()|需要进一步测试|
|src/script/00.js:5576|start|performance.now()|需要进一步测试|
|src/script/00.js:5576|total|3600|需要进一步测试|
|src/script/00.js:5578|c|document.querySelector(.group-row-card[data-group-id="${g.id}"])|需要进一步测试|
|src/script/00.js:5580|o|document.createElement('div')|需要进一步测试|
|src/script/00.js:5584|lastUpdate|new Map()|需要进一步测试|
|src/script/00.js:5586|t|Math.min(1,(now-start)/total)|需要进一步测试|
|src/script/00.js:5586|interval|72+300*Math.pow(t,2.35)|需要进一步测试|
|src/script/00.js:5588|prev|lastUpdate.get(g.id)／／0|需要进一步测试|
|src/script/00.js:5596|batchUsed|new Set()|需要进一步测试|
|src/script/00.js:5598|k|pickItemForGroupV281(g,batchUsed)|需要进一步测试|
|src/script/00.js:5601|o|overlays.get(g.id)|需要进一步测试|
|src/script/00.js:5602|h|o.querySelector('.r-hint')|需要进一步测试|
|src/script/00.js:5608|c|document.querySelector(.group-row-card[data-group-id="${g.id}"])|需要进一步测试|
|src/script/00.js:5609|o|c.querySelector('.card-item-roulette')|需要进一步测试|
|src/script/00.js:5619|g|state.groups.find(x=>x.id===handRaiseGroupId)|需要进一步测试|
|src/script/00.js:5624|box|document.getElementById('handRewardBox')|需要进一步测试|
|src/script/00.js:5631|last|0|需要进一步测试|
|src/script/00.js:5631|total|3600|需要进一步测试|
|src/script/00.js:5634|t|Math.min(1,(now-handItemDrawStartedAt)/total)|需要进一步测试|
|src/script/00.js:5634|interval|72+300*Math.pow(t,2.35)|需要进一步测试|
|src/script/00.js:5635|bar|document.getElementById('handItemProgressBar')|需要进一步测试|
|src/script/00.js:5637|k|roulettePreviewPickV282()|需要进一步测试|
|src/script/00.js:5638|cap|document.getElementById('handItemCapsule')|需要进一步测试|
|src/script/00.js:5638|name|document.getElementById('handItemDrawName')|需要进一步测试|
|src/script/00.js:5644|live|state.groups.find(x=>x.id===handItemDrawGroupId)|需要进一步测试|
|src/script/00.js:5646|k|pickItemForGroupV281(live,new Set())|需要进一步测试|
|src/script/00.js:5650|slot|live.inventory.length-1|需要进一步测试|
|src/script/00.js:5662|_v282UseItemWithIce|legacyUseItem|需要进一步测试|
|src/script/00.js:5664|g|state.groups.find(x=>x.id===groupId)|需要进一步测试|
|src/script/00.js:5678|ITEM_ORDER_V283|[  'green','triple_green','red','triple_red','spiny',  'banana','triple_banana','horn','bobomb','hammer',  'coin','coin_shell','question','mushroom','triple_mus|需要进一步测试|
|src/script/00.js:5691|d|ITEM_DEFS[k]|需要进一步测试|
|src/script/00.js:5695|g|state.groups.find(x=>x.id===gid)|需要进一步测试|
|src/script/00.js:5704|g|state.groups.find(x=>x.id===gid)|需要进一步测试|
|src/script/00.js:5705|roots|[...document.querySelectorAll('.god-item-manager,.item-god-manager,.god-item-grid')]|需要进一步测试|
|src/script/00.js:5706|root|roots.find(x=>x.closest('.modal,.group-modal,.vista-window'))／／roots[0]|需要进一步测试|
|src/script/00.js:5708|tactical|document.querySelector('.group-modal .tactical-tab-content,.group-modal [data-tab-content="items"],#groupModal .tactical-items')|需要进一步测试|
|src/script/00.js:5717|all|[...document.querySelectorAll('body *')]|需要进一步测试|
|src/script/00.js:5718|title|all.find(el=>el.children.length===0 && /上帝模式.*强制道具管理/.test(el.textContent／／''))|需要进一步测试|
|src/script/00.js:5720|box|title.nextElementSibling|需要进一步测试|
|src/script/00.js:5729|headings|[...document.querySelectorAll('h1,h2,h3,.about-title,.section-title')]|需要进一步测试|
|src/script/00.js:5730|h|headings.find(x=>/22\s*种道具百科／26\s*种道具百科/.test(x.textContent／／''))|需要进一步测试|
|src/script/00.js:5733|host|h.nextElementSibling|需要进一步测试|
|src/script/00.js:5736|parent|h.parentElement|需要进一步测试|
|src/script/00.js:5737|candidates|[...parent.children]|需要进一步测试|
|src/script/00.js:5738|start|candidates.indexOf(h)+1|需要进一步测试|
|src/script/00.js:5739|cards|candidates.slice(start).filter(x=>x.matches?.('.guide-block,.item-guide-card,.about-item-card,.encyclopedia-item') ／／ x.querySelector?.('b,strong'))|需要进一步测试|
|src/script/00.js:5743|d|ITEM_DEFS[k]|需要进一步测试|
|src/script/00.js:5743|card|document.createElement('div')|需要进一步测试|
|src/script/00.js:5750|d|ITEM_DEFS[k]|需要进一步测试|
|src/script/00.js:5759|existingText|document.body.innerText／／''|需要进一步测试|
|src/script/00.js:5760|about|document.querySelector('#aboutModal,.about-modal,#aboutWindow,.about-window')／／document.body|需要进一步测试|
|src/script/00.js:5761|title|[...about.querySelectorAll('h1,h2,h3')].find(x=>/26\s*种道具百科/.test(x.textContent／／''))|需要进一步测试|
|src/script/00.js:5763|parent|title.parentElement|需要进一步测试|
|src/script/00.js:5765|d|ITEM_DEFS[k]|需要进一步测试|
|src/script/00.js:5767|card|document.createElement('div')|需要进一步测试|
|src/script/00.js:5775|setting|document.querySelector('#view-settings')／／document|需要进一步测试|
|src/script/00.js:5776|labels|[...setting.querySelectorAll('*')].filter(x=>x.children.length===0 && /道具.*图标／自定义道具/.test(x.textContent／／''))|需要进一步测试|
|src/script/00.js:5777|anchor|labels[0]|需要进一步测试|
|src/script/00.js:5779|region|anchor.parentElement?.parentElement／／anchor.parentElement|需要进一步测试|
|src/script/00.js:5781|txt|region.innerText／／''|需要进一步测试|
|src/script/00.js:5783|d|ITEM_DEFS[k]|需要进一步测试|
|src/script/00.js:5784|row|document.createElement('div')|需要进一步测试|
|src/script/00.js:5796|_v283OpenGroupModal|openGroupModal|需要进一步测试|
|src/script/00.js:5797|r|_v283OpenGroupModal.call(this,gid,...a)|需要进一步测试|
|src/script/00.js:5800|_v283RenderGroupModal|renderGroupModal|需要进一步测试|
|src/script/00.js:5801|r|_v283RenderGroupModal.apply(this,a)|需要进一步测试|
|src/script/00.js:5801|gid|state.activeModalGroupId／／activeEditingGroupId|需要进一步测试|
|src/script/00.js:5805|_v283OpenAbout|typeof openAboutModal==='function'?openAboutModal:null|需要进一步测试|
|src/script/00.js:5806|r|_v283OpenAbout.apply(this,a)|需要进一步测试|
|src/script/00.js:5842|_v284RenderAbout|renderAbout|需要进一步测试|
|src/script/00.js:5844|r|_v284RenderAbout(tab)|需要进一步测试|
|src/script/00.js:5846|m|document.getElementById('aboutMain')|需要进一步测试|
|src/script/00.js:5849|txt|m.innerText／／''|需要进一步测试|
|src/script/00.js:5851|d|ITEM_DEFS[k]|需要进一步测试|
|src/script/00.js:5853|el|document.createElement('div')|需要进一步测试|
|src/script/00.js:5867|COMMUNISM_MODE_KEY|'politics_communism_mode'|需要进一步测试|
|src/script/00.js:5877|on|isCommunismMode()|需要进一步测试|
|src/script/00.js:5882|t|(el.textContent／／'').trim()|需要进一步测试|
|src/script/00.js:5883|oc|el.getAttribute('onclick')／／''|需要进一步测试|
|src/script/00.js:5884|itemOnly|/道具抽取／抽取道具／道具百科／道具与图标/.test(t) ／／       /globalItemDraw／openItemEncyclopedia/.test(oc)|需要进一步测试|
|src/script/00.js:5900|_v291GlobalItemDraw|globalItemDraw|需要进一步测试|
|src/script/00.js:5905|_v291UseItem|legacyUseItem|需要进一步测试|
|src/script/00.js:5911|_v291OpenItemWindow|openItemWindow|需要进一步测试|
|src/script/00.js:5920|card|document.getElementById('communismModeSetting')|需要进一步测试|
|src/script/00.js:5921|pane|document.getElementById('settingsV26_function')|需要进一步测试|
|src/script/00.js:5938|cb|card.querySelector('#communismModeToggle')|需要进一步测试|
|src/script/00.js:5949|n|Number(value)／／0|需要进一步测试|
|src/script/00.js:5950|abs|Math.abs(n)|需要进一步测试|
|src/script/00.js:5953|sign|n<0?'-':''|需要进一步测试|
|src/script/00.js:5954|a|Math.abs(n)|需要进一步测试|
|src/script/00.js:5956|v|a/100000000|需要进一步测试|
|src/script/00.js:5959|v|a/10000|需要进一步测试|
|src/script/00.js:5973|previousUseItemV299|legacyUseItem|需要进一步测试|
|src/script/00.js:5976|type|g?.itemEffect?.type|需要进一步测试|
|src/script/00.js:5978|def|ITEM_DEFS[type]|需要进一步测试|
|src/script/00.js:5988|g|state.groups.find(x => x.id === groupId)|需要进一步测试|
|src/script/00.js:5989|it|g?.inventory?.[index]|需要进一步测试|
|src/script/00.js:5990|nextKey|it?.key|需要进一步测试|
|src/script/00.js:5991|nextDef|nextKey ? ITEM_DEFS[nextKey] : null|需要进一步测试|
|src/script/00.js:5998|active|activePersistentEffect(g)|需要进一步测试|
|src/script/00.js:6023|previousUseItemV2113|legacyUseItem|需要进一步测试|
|src/script/00.js:6024|EXT|new Set(['feather','fire_flower','ice_flower','boomerang_flower'])|需要进一步测试|
|src/script/00.js:6028|k||需要进一步测试|
|src/script/00.js:6035|it|g?.inventory?.[index]|需要进一步测试|
|src/script/00.js:6042|pool|state.groups.filter(x=>x.id!==g.id && eligibleForItems(x))|需要进一步测试|
|src/script/00.js:6048|amount|Math.round(Math.max(0,Number(target.score)／／0)/denom)|需要进一步测试|
|src/script/00.js:6054|g|state.groups.find(x=>x.id===groupId)|需要进一步测试|
|src/script/00.js:6055|it|g?.inventory?.[index]|需要进一步测试|
|src/script/00.js:6056|key|it?.key|需要进一步测试|
|src/script/00.js:6081|used|false|需要进一步测试|
|src/script/00.js:6081|targetText|''|需要进一步测试|
|src/script/00.js:6091|t|randomTargetV2113(g)|需要进一步测试|
|src/script/00.js:6100|t|randomTargetV2113(g)|需要进一步测试|
|src/script/00.js:6102|result|attackFractionV2113(g,t,10,key)|需要进一步测试|
|src/script/00.js:6113|r|ranking()|需要进一步测试|
|src/script/00.js:6113|p|r.findIndex(x=>x.id===g.id)|需要进一步测试|
|src/script/00.js:6114|targets|[r[p-1],r[p+1]].filter(x=>x && eligibleForItems(x))|需要进一步测试|
|src/script/00.js:6199|card|battleCard(groupId)|需要进一步测试|
|src/script/00.js:6204|cls|attackHitClassV2116(key)|需要进一步测试|
|src/script/00.js:6210|badge|document.createElement('div')|需要进一步测试|
|src/script/00.js:6212|d|ITEM_DEFS[key]|需要进一步测试|
|src/script/00.js:6239|type|target?.itemEffect?.type|需要进一步测试|
|src/script/00.js:6242|name|ITEM_DEFS[type]?.name／／'持续状态'|需要进一步测试|
|src/script/00.js:6247|ix|target.inventory.findIndex(x=>x.key===type)|需要进一步测试|
|src/script/00.js:6263|before|Number(target.score)／／0|需要进一步测试|
|src/script/00.js:6281|_v2116ShowItemUseFx|showItemUseFx|需要进一步测试|
|src/script/00.js:6293|sample|itemDropWeights(12,24)|需要进一步测试|
|src/script/00.js:6294|missing|Object.keys(ITEM_DEFS).filter(k=>!(k in sample))|需要进一步测试|
|src/script/00.js:6311|main|it／／g?.inventory?.[0]|需要进一步测试|
|src/script/00.js:6321|it|g?.inventory?.[index]|需要进一步测试|
|src/script/00.js:6327|reason|Reliability.validateItem(state,g,index,isCommunismMode())|需要进一步测试|
|src/script/00.js:6334|_v2120UseItem|legacyUseItem|需要进一步测试|
|src/script/00.js:6336|g|state.groups.find(x=>x.id===groupId)|需要进一步测试|
|src/script/00.js:6341|main|g.inventory?.[0]|需要进一步测试|
|src/script/00.js:6348|main|g.inventory?.[0]|需要进一步测试|
|src/script/00.js:6366|g|state.groups.find(x=>x.id===gid)|需要进一步测试|
|src/script/00.js:6373|role|g.inventory.length===1?'主要道具':'次要道具'|需要进一步测试|
|src/script/00.js:6378|g|state.groups.find(x=>x.id===gid)|需要进一步测试|
|src/script/00.js:6390|_v2120RenderItemWindow|renderItemWindow|需要进一步测试|
|src/script/00.js:6393|g|state.groups.find(x=>x.id===activeItemGroupId)|需要进一步测试|
|src/script/00.js:6394|body|document.getElementById('itemWindowBody')|需要进一步测试|
|src/script/00.js:6397|cards|[0,1,2].map(i=>{     const it=g.inventory[i];     const role=queueRoleTextV2120(i);     if(!it){       return <div class="item-big queue-item-card ${i===0?'que|需要进一步测试|
|src/script/00.js:6398|it|g.inventory[i]|需要进一步测试|
|src/script/00.js:6399|role|queueRoleTextV2120(i)|需要进一步测试|
|src/script/00.js:6408|d|ITEM_DEFS[it.key]|需要进一步测试|
|src/script/00.js:6409|st|queueUseStateV2120(g,i)|需要进一步测试|
|src/script/00.js:6410|active|isQueuePersistentActiveV2120(g,it)|需要进一步测试|
|src/script/00.js:6430|admin|document.createElement('div')|需要进一步测试|
|src/script/00.js:6442|_v2120EnhanceItemCards|enhanceItemCards|需要进一步测试|
|src/script/00.js:6443|queueMainVisualCacheV2120|new Map()|需要进一步测试|
|src/script/00.js:6447|card|document.querySelector(.group-row-card[data-group-id="${g.id}"])|需要进一步测试|
|src/script/00.js:6452|main|g.inventory?.[0]|需要进一步测试|
|src/script/00.js:6455|slots|[...card.querySelectorAll('.item-slot')]|需要进一步测试|
|src/script/00.js:6457|slot|slots[i]|需要进一步测试|
|src/script/00.js:6458|it|g.inventory[i]|需要进一步测试|
|src/script/00.js:6461|active|isQueuePersistentActiveV2120(g,it)|需要进一步测试|
|src/script/00.js:6471|currentMain|main?${main.key}:${main.acquiredAt／／0}:''|需要进一步测试|
|src/script/00.js:6472|prev|queueMainVisualCacheV2120.get(g.id)|需要进一步测试|
|src/script/00.js:6482|_v2120HandUseNewItem|handUseNewItem|需要进一步测试|
|src/script/00.js:6484|gid|handItemDrawGroupId|需要进一步测试|
|src/script/00.js:6485|g|state.groups.find(x=>x.id===gid)|需要进一步测试|
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
|src/script/01.js:66|_v213UseItem|legacyUseItem|需要进一步测试|
|src/script/01.js:74|fixedNumberOrder|!!(state.roundActive&&!state.evaluated)|需要进一步测试|
|src/script/01.js:77|result||需要进一步测试|
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
|src/script/04.js:11|_v2164JudgeRound|legacyJudgeRound|需要进一步测试|
|src/script/04.js:14|powerBefore|state.groups       .filter(g => g?.itemEffect?.type === 'power')       .map(g => ({         id: g.id,         answered: !!g.selectedOpt,         correct: !!g.se|需要进一步测试|
|src/script/04.js:22|result|_v2164JudgeRound.apply(this, args)|需要进一步测试|
|src/script/04.js:24|powerTargets|powerBefore       .filter(x => x.answered && x.correct)       .map(x => {         const g = state.groups.find(q => q.id === x.id);         return g ? { id: g.id|需要进一步测试|
|src/script/04.js:27|g|state.groups.find(q => q.id === x.id)|需要进一步测试|
|src/script/04.js:41|updates|[]|需要进一步测试|
|src/script/04.js:43|g|state.groups.find(q => q.id === x.id)|需要进一步测试|
|src/script/04.js:45|target|Number(g.score) ／／ 0|需要进一步测试|
|src/script/04.js:46|start|Number(g.displayScore)|需要进一步测试|
|src/script/04.js:47|visibleStart|Number.isFinite(start) ? start : target|需要进一步测试|
|src/script/04.js:79|ITEM_SOUND_IDS_V2164|new Set([   'item_draw_start','item_draw_tick','item_draw_reveal',   'item_use','item_attack','item_defend','item_buff','item_status','item_steal' ])|需要进一步测试|
|src/script/04.js:86|osc|audioCtx.createOscillator()|需要进一步测试|
|src/script/04.js:87|gain|audioCtx.createGain()|需要进一步测试|
|src/script/04.js:103|now|audioCtx.currentTime + .005|需要进一步测试|
|src/script/04.js:154|_v2164PlaySoundBase|playSound|需要进一步测试|
|src/script/04.js:167|custom|customFxBuffers?.[slotId]|需要进一步测试|
|src/script/04.js:169|source|audioCtx.createBufferSource()|需要进一步测试|
|src/script/04.js:190|n|0|需要进一步测试|
|src/script/04.js:191|interval|Math.max(150, ms / 15)|需要进一步测试|
|src/script/04.js:192|timer|setInterval(() => {     if (n++ < 13) playSound('item_draw_tick');     else clearInterval(timer);   }, interval)|需要进一步测试|
|src/script/04.js:203|_v2164GlobalItemDraw|globalItemDraw|需要进一步测试|
|src/script/04.js:205|canStart|!itemDrawBusy &&       state.groups.some(g => eligibleForItems(g) && Array.isArray(g.inventory) && g.inventory.length < 3) &&       (typeof isCommunismMode !== |需要进一步测试|
|src/script/04.js:214|_v2164HandDrawItem|handDrawItem|需要进一步测试|
|src/script/04.js:216|g|state.groups.find(x => x.id === handRaiseGroupId)|需要进一步测试|
|src/script/04.js:217|canStart|!!g && !handItemDrawTimer &&       eligibleForItems(g) && Array.isArray(g.inventory) && g.inventory.length < 3|需要进一步测试|
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
|src/script/12.js:57|_v2177UseItem|legacyUseItem|需要进一步测试|
|src/script/12.js:59|g|state.groups.find(x=>x.id===groupId)|需要进一步测试|
|src/script/12.js:60|activeRound|!!(g && state.roundActive && !state.evaluated)|需要进一步测试|
|src/script/12.js:82|_v2177ToggleAllInCard|toggleAllInCard|需要进一步测试|
|src/script/12.js:84|g|state.groups.find(x=>x.id===groupId)|需要进一步测试|
|src/script/12.js:95|_v2177FinishStartRound|finishStartRound|需要进一步测试|
|src/script/12.js:102|_v2177QueueUseState|queueUseStateV2120|需要进一步测试|
|src/script/12.js:104|st|_v2177QueueUseState.call(this,g,index)|需要进一步测试|
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
|src/script/22.js:12|fixed|Number.isFinite(n)         ? Math.max(1,Math.min(3,Math.trunc(n)))         : 3|需要进一步测试|
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
|src/script/31.js:149|_v21732UseItem|legacyUseItem|需要进一步测试|
|src/script/31.js:151|before|snapshotScoresV21732()|需要进一步测试|
|src/script/31.js:153|result||需要进一步测试|
|src/script/31.js:175|el|getScoreElementV21732(key)|需要进一步测试|
|src/script/31.js:177|session|activeScoreRollsV21732.get(String(key))|需要进一步测试|
|src/script/31.js:178|g|state.groups.find(x=>String(x.id)===String(key))|需要进一步测试|
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
|src/script/36.js:223|_v218UseItemBalance|legacyUseItem|需要进一步测试|
|src/script/36.js:224|TRIPLE_KEYS_V218|new Set(['triple_green','triple_red','triple_banana','triple_mushroom'])|需要进一步测试|
|src/script/36.js:226|it|g.inventory?.[index]|需要进一步测试|
|src/script/36.js:231|amount|Math.round(Math.max(0,Number(target.score)／／0)/5)|需要进一步测试|
|src/script/36.js:243|g|state.groups.find(x=>x.id===groupId)|需要进一步测试|
|src/script/36.js:244|it|g?.inventory?.[index]|需要进一步测试|
|src/script/36.js:244|key|it?.key|需要进一步测试|
|src/script/36.js:248|continuing|!!(     state.roundActive&&!state.evaluated &&     g.itemUsedThisRound &&     g.roundItemContinuationKeyV218===key &&     TRIPLE_KEYS_V218.has(key)   )|需要进一步测试|
|src/script/36.js:258|r|ranking()|需要进一步测试|
|src/script/36.js:258|ri|r.findIndex(x=>x.id===g.id)|需要进一步测试|
|src/script/36.js:258|above|r[ri-1]|需要进一步测试|
|src/script/36.js:270|r|ranking()|需要进一步测试|
|src/script/36.js:270|ri|r.findIndex(x=>x.id===g.id)|需要进一步测试|
|src/script/36.js:271|pool|r.slice(0,ri).filter(eligibleForItems).sort(()=>Math.random()-.5).slice(0,3)|需要进一步测试|
|src/script/36.js:280|r|ranking()|需要进一步测试|
|src/script/36.js:280|ri|r.findIndex(x=>x.id===g.id)|需要进一步测试|
|src/script/36.js:280|above|r[ri-1]|需要进一步测试|
|src/script/36.js:293|pool|state.groups.filter(x=>x.id!==g.id&&eligibleForItems(x))|需要进一步测试|
|src/script/36.js:295|t|pool[Math.floor(Math.random()*pool.length)]|需要进一步测试|
|src/script/36.js:296|result|attackOneFifthV218(g,t,key)|需要进一步测试|
|src/script/36.js:305|r|ranking()|需要进一步测试|
|src/script/36.js:305|ri|r.findIndex(x=>x.id===g.id)|需要进一步测试|
|src/script/36.js:306|targets|[r[ri-1],r[ri+1]].filter(x=>x&&eligibleForItems(x))|需要进一步测试|
|src/script/36.js:313|beforeKey|key|需要进一步测试|
|src/script/36.js:314|result|_v218UseItemBalance.call(this,groupId,index,...rest)|需要进一步测试|
|src/script/36.js:327|still|g.inventory?.[0]?.key===beforeKey && Number(g.inventory[0].charges)>0|需要进一步测试|
|src/script/36.js:341|_v218QueueState|queueUseStateV2120|需要进一步测试|
|src/script/36.js:361|_v218JudgeRound|legacyJudgeRound|需要进一步测试|
|src/script/36.js:364|wasActive|state.roundActive&&!state.evaluated|需要进一步测试|
|src/script/36.js:365|answeredBefore|new Map(state.groups.map(g=>[g.id,!!g.selectedOpt]))|需要进一步测试|
|src/script/36.js:366|result|_v218JudgeRound.apply(this,args)|需要进一步测试|
|src/script/36.js:372|left|Number(g.itemEffect.iceRoundsLeftV218／／3)-1|需要进一步测试|
|src/script/36.js:394|_v218UseItemIceCleanup|legacyUseItem|需要进一步测试|
|src/script/36.js:396|g|state.groups.find(x=>x.id===groupId)|需要进一步测试|
|src/script/36.js:397|frozen|!!g?.itemEffect?.iceLock|需要进一步测试|
|src/script/36.js:398|r|_v218UseItemIceCleanup.call(this,groupId,index,...rest)|需要进一步测试|
|src/script/36.js:407|FIRST_HAND_POOL_V218|[   'triple_mushroom','mushroom','triple_green','green',   'triple_red','red','banana','triple_banana','horn' ]|需要进一步测试|
|src/script/36.js:411|firstHandDrawPendingV218|true|需要进一步测试|
|src/script/36.js:412|suppressFirstHornV218|false|需要进一步测试|
|src/script/36.js:414|_v218ItemDropWeights|itemDropWeights|需要进一步测试|
|src/script/36.js:416|W|_v218ItemDropWeights.call(this,pos,total)|需要进一步测试|
|src/script/36.js:417|cutoff|Math.max(1,Math.ceil(Math.max(1,total)*0.60))|需要进一步测试|
|src/script/36.js:427|_v218PickItem|pickItemForGroupV281|需要进一步测试|
|src/script/36.js:429|inHand|handItemDrawGroupId===g?.id|需要进一步测试|
|src/script/36.js:433|held|new Set((g.inventory／／[]).map(x=>x.key))|需要进一步测试|
|src/script/36.js:434|pool|FIRST_HAND_POOL_V218.filter(k=>ITEM_DEFS[k]&&!held.has(k))|需要进一步测试|
|src/script/36.js:437|k|pool[Math.floor(Math.random()*pool.length)]|需要进一步测试|
|src/script/36.js:443|pos|rankIndex(g.id)+1|需要进一步测试|
|src/script/36.js:443|total|state.groups.length|需要进一步测试|
|src/script/36.js:446|held|new Set((g.inventory／／[]).map(x=>x.key))|需要进一步测试|
|src/script/36.js:459|handEffectSuppressV218|false|需要进一步测试|
|src/script/36.js:462|box|document.getElementById('handEffectCardV218')|需要进一步测试|
|src/script/36.js:462|overlay|document.getElementById('handEffectOverlayV218')|需要进一步测试|
|src/script/36.js:464|lines|[]|需要进一步测试|
|src/script/36.js:466|old|before.get(g.id)|需要进一步测试|
|src/script/36.js:467|now|Number(g.score)／／0|需要进一步测试|
|src/script/36.js:467|delta|now-old|需要进一步测试|
|src/script/36.js:479|g|state.groups.find(x=>x.id===handRaiseGroupId)|需要进一步测试|
|src/script/36.js:479|it|g?.inventory?.[0]|需要进一步测试|
|src/script/36.js:481|key|it.key|需要进一步测试|
|src/script/36.js:481|before|scoreSnapshotV218()|需要进一步测试|
|src/script/36.js:482|ok|useItem(g.id,0)|需要进一步测试|
|src/script/36.js:487|g|state.groups.find(x=>x.id===handRaiseGroupId)|需要进一步测试|
|src/script/36.js:487|it|g?.inventory?.[0]|需要进一步测试|
|src/script/36.js:489|key|it.key|需要进一步测试|
|src/script/36.js:489|before|scoreSnapshotV218()|需要进一步测试|
|src/script/36.js:490|left|Math.min(3,Number(it.charges)／／0)|需要进一步测试|
|src/script/36.js:492|fire|()=>{     const live=state.groups.find(x=>x.id===handRaiseGroupId);     if(!live?.inventory?.[0]／／live.inventory[0].key!==key／／left<=0){       handEffectSuppres|需要进一步测试|
|src/script/36.js:493|live|state.groups.find(x=>x.id===handRaiseGroupId)|需要进一步测试|
|src/script/36.js:507|box|document.getElementById('handRewardBox')|需要进一步测试|
|src/script/36.js:508|g|state.groups.find(x=>x.id===handRaiseGroupId)|需要进一步测试|
|src/script/36.js:509|main|g.inventory?.[0]|需要进一步测试|
|src/script/36.js:509|triple|main&&TRIPLE_KEYS_V218.has(main.key)&&Number(main.charges)>1|需要进一步测试|
|src/script/36.js:510|drawDisabled|!eligibleForItems(g)／／g.inventory.length>=3|需要进一步测试|
|src/script/36.js:524|_v218JudgeHandRaise|judgeHandRaise|需要进一步测试|
|src/script/36.js:526|r|_v218JudgeHandRaise.call(this,correct)|需要进一步测试|
|src/script/36.js:538|ITEM_ORDER_V218|[   'mushroom','triple_mushroom','green','triple_green','red','triple_red',   'banana','triple_banana','horn','feather',   'fire_flower','ice_flower','boomerang|需要进一步测试|
|src/script/36.js:546|ITEM_TIPS_V218|{   mushroom:'既能主动加分，也能在刺龟壳来袭时选择主动消耗闪避。',   triple_mushroom:'答题期间第一次使用后不能 All In，但同一枚三重蘑菇的剩余次数仍可继续使用；手动举手可选择一次或连发。',   green:'主要栏可作为防御资源；领先时不要急着主动丢掉。',   triple|需要进一步测试|
|src/script/36.js:574|_v218RenderAbout|renderAbout|需要进一步测试|
|src/script/36.js:578|m|document.getElementById('aboutMain')|需要进一步测试|
|src/script/36.js:591|d|ITEM_DEFS[k]|需要进一步测试|
|src/script/36.js:591|desc|(typeof ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715!=='undefined'&&ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715[k])／／d.desc／／''|需要进一步测试|
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
|src/script/42.js:29|_v2189UseItem|legacyUseItem|需要进一步测试|
|src/script/42.js:31|g|state.groups.find(x=>x.id===groupId)|需要进一步测试|
|src/script/42.js:32|it|g?.inventory?.[index]|需要进一步测试|
|src/script/42.js:33|key|it?.key|需要进一步测试|
|src/script/42.js:49|allTargets|state.groups.filter(x=>x.id!==g.id && eligibleForItems(x))|需要进一步测试|
|src/script/42.js:52|pool|allTargets.filter(t=>!t.itemEffect?.iceLock)|需要进一步测试|
|src/script/42.js:66|t|pool[Math.floor(Math.random()*pool.length)]|需要进一步测试|
|src/script/42.js:67|result|attackOneFifthV218(g,t,'ice_flower')|需要进一步测试|
|src/script/42.js:86|t|allTargets[Math.floor(Math.random()*allTargets.length)]|需要进一步测试|
|src/script/42.js:87|amount|Math.round(Math.max(0,Number(t.score)／／0)/4)|需要进一步测试|
|src/script/42.js:88|result|amount>0 ? applyItemScore(t,-amount,g.id,'fire_flower') : {changed:false}|需要进一步测试|
|src/script/43.js:3|about|document.getElementById('aboutMain')|需要进一步测试|
|src/script/43.js:5|walker|document.createTreeWalker(about,NodeFilter.SHOW_TEXT)|需要进一步测试|
|src/script/43.js:6|nodes|[]|需要进一步测试|
|src/script/43.js:17|_v21811RenderAbout|renderAbout|需要进一步测试|
|src/script/43.js:19|r|_v21811RenderAbout.apply(this,arguments)|需要进一步测试|
|src/script/44.js:42|customIcons|(state.itemGlobal&&state.itemGlobal.customIcons)     ? state.itemGlobal.customIcons     : STORAGE.getJSON('politics_item_icons',{})|需要进一步测试|
|src/script/45.js:46|ig|state.itemGlobal／／{}|需要进一步测试|
|src/script/45.js:104|text||需要进一步测试|
|src/script/45.js:115|n|itemNameV21813(it.key)|需要进一步测试|
|src/script/45.js:116|c|Number(it.charges)／／1|需要进一步测试|
|src/script/45.js:121|out|[]|需要进一步测试|
|src/script/45.js:123|d|ITEM_DEFS?.[g.itemEffect.type]?.name／／g.itemEffect.type|需要进一步测试|
|src/script/45.js:134|list|getSettlementHistory()|需要进一步测试|
|src/script/45.js:135|record|list[index]|需要进一步测试|
|src/script/45.js:138|snap|record.clearedData／／{}|需要进一步测试|
|src/script/45.js:139|groups|snap.groups?.length?snap.groups:record.groups／／[]|需要进一步测试|
|src/script/45.js:140|ig|snap.itemGlobal／／{}|需要进一步测试|
|src/script/45.js:141|lines|[]|需要进一步测试|
|src/script/45.js:159|answers|groups.reduce((n,g)=>n+(Number(g.itemStats?.correct)／／0)+(Number(g.itemStats?.wrong)／／0),0)|需要进一步测试|
|src/script/45.js:180|ranked|[...groups].sort((a,b)=>(Number(b.score)／／0)-(Number(a.score)／／0))|需要进一步测试|
|src/script/45.js:232|g|groups.find(q=>q.id===x.groupId)|需要进一步测试|
|src/script/45.js:244|rd|snap.round／／{}|需要进一步测试|
|src/script/45.js:264|groupSummary|(h.groups／／[]).map(g=>({       id:g.id,name:g.name,score:g.score,       inventory:g.inventory,itemStats:g.itemStats,itemEffect:g.itemEffect,       booShield:g.b|需要进一步测试|
|src/script/45.js:282|csvContent|"\uFEFF"+lines.join("\n")|需要进一步测试|
|src/script/45.js:283|blob|new Blob([csvContent],{type:'text/csv;charset=utf-8;'})|需要进一步测试|
|src/script/45.js:284|url|URL.createObjectURL(blob)|需要进一步测试|
|src/script/45.js:285|a|document.createElement('a')|需要进一步测试|
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
|src/ui/classroom-feedback.js:142|root|dialog()|需要进一步测试|
|src/ui/classroom-feedback.js:144|serial|generation|需要进一步测试|
|src/ui/classroom-feedback.js:156|particles|root.querySelector(".cf-show-particles")|需要进一步测试|
|src/ui/classroom-feedback.js:157|simple|DesktopUI.getPreferences().motion === "simple"|需要进一步测试|
|src/ui/classroom-feedback.js:159|i|0|需要进一步测试|
|src/ui/classroom-feedback.js:160|dot|document.createElement("i")|需要进一步测试|
|src/ui/classroom-feedback.js:161|angle|(i / 24) * Math.PI * 2|需要进一步测试|
|src/ui/classroom-feedback.js:172|toast|document.getElementById("toast")|需要进一步测试|
|src/ui/classroom-feedback.js:193|group|mode === "group" ? win : win.group|需要进一步测试|
|src/ui/classroom-feedback.js:194|student|mode === "group" ? null : parseStudentV218(win.memberName)|需要进一步测试|
|src/ui/classroom-feedback.js:210|v|options[e.dataset.cfOption]|需要进一步测试|
|src/ui/classroom-feedback.js:236|values|[...document.querySelectorAll("[data-cf-slot]")].map(           (x) => (x.value.trim() === "" ? NaN : Number(x.value)),         )|需要进一步测试|
|src/ui/classroom-feedback.js:265|clickEvent|null|需要进一步测试|
|src/ui/classroom-feedback.js:266|clickClaimed|false|需要进一步测试|
|src/ui/classroom-feedback.js:267|clickPreview|false|需要进一步测试|
|src/ui/classroom-feedback.js:268|clickCleanup|null|需要进一步测试|
|src/ui/classroom-feedback.js:278|clickVoice|null|需要进一步测试|
|src/ui/classroom-feedback.js:290|voice|{ source, gain }|需要进一步测试|
|src/ui/classroom-feedback.js:302|button|e.target.closest?.(           "button,summary,[role=button],input[type=button],input[type=submit]",         )|需要进一步测试|
|src/ui/classroom-feedback.js:325|saved|localStorage.getItem(KEY)|需要进一步测试|
|src/ui/classroom-feedback.js:363|pre|state.picker.preselectedGroupIds ／／ []|需要进一步测试|
|src/ui/classroom-feedback.js:364|groups|state.picker.mode === "two_tier"         ? state.groups.filter(             (g) => g.members?.length && (!pre.length ／／ pre.includes(g.id)),           )        |需要进一步测试|
|src/ui/classroom-feedback.js:382|[frame, live]||需要进一步测试|
|src/ui/classroom-feedback.js:396|rows|candidates(frame)|需要进一步测试|
|src/ui/classroom-feedback.js:398|actual|frame.querySelector(".slot-reel-text")|需要进一步测试|
|src/ui/classroom-feedback.js:399|height|frame.clientHeight|需要进一步测试|
|src/ui/classroom-feedback.js:400|strip|document.createElement("div")|需要进一步测试|
|src/ui/classroom-feedback.js:403|candidate||需要进一步测试|
|src/ui/classroom-feedback.js:404|row|document.createElement("span")|需要进一步测试|
|src/ui/classroom-feedback.js:409|visibility|actual.style.visibility|需要进一步测试|
|src/ui/classroom-feedback.js:412|animation|strip.animate(           [             { transform: "translateY(0)" },             { transform: translateY(-${height * rows.length}px) },           ],        |需要进一步测试|
|src/ui/classroom-feedback.js:434|live|liveReels.get(frame)|需要进一步测试|
|src/ui/classroom-feedback.js:436|phase|((Number(live.animation.currentTime) ／／ 0) / 100) % live.rows.length|需要进一步测试|
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
|src/ui/desktop.js:90|a|el.animate(frames, {       duration: 240 / preferences.speed,       easing: "cubic-bezier(.2,.8,.2,1)",       ...options,     })|需要进一步测试|
|src/ui/desktop.js:99|pageMotionFrame|null|需要进一步测试|
|src/ui/desktop.js:107|a||需要进一步测试|
|src/ui/desktop.js:126|viewportSignature|""|需要进一步测试|
|src/ui/desktop.js:128|zoom|Number(getComputedStyle(document.body).zoom) ／／ 1|需要进一步测试|
|src/ui/desktop.js:129|value|${innerWidth}/${innerHeight}/${zoom}|需要进一步测试|
|src/ui/desktop.js:141|historyEntryPending|false|需要进一步测试|
|src/ui/desktop.js:142|archiveEntryPending|false|需要进一步测试|
|src/ui/desktop.js:150|m||需要进一步测试|
|src/ui/desktop.js:159|dock|$(".bottom-dock")|需要进一步测试|
|src/ui/desktop.js:179|selectors|{           welcome:             ".gp-hero,.gp-kpis,.gp-main-grid,.gp-group-section,.gp-daily-grid",           battle:             "#heightResizerDock,#groupLis|需要进一步测试|
|src/ui/desktop.js:188|host|$(#view-${name})|需要进一步测试|
|src/ui/desktop.js:189|targets|[           ...host.querySelectorAll(selectors[name] ／／ ":scope"),         ].slice(0, 18)|需要进一步测试|
|src/ui/desktop.js:216|track|$("#uiGroupTrack")|需要进一步测试|
|src/ui/desktop.js:221|groups|state.groups ／／ []|需要进一步测试|
|src/ui/desktop.js:222|sorted|[...groups].sort((a, b) => Number(b.score) - Number(a.score))|需要进一步测试|
|src/ui/desktop.js:223|mask|Number(state.itemGlobal?.blooperUntil ／／ 0) > Date.now()|需要进一步测试|
|src/ui/desktop.js:224|signature|JSON.stringify(         groups.map((g) => [           g.id,           g.name,           g.score,           g.color,           g.inventory,           g.itemEffec|需要进一步测试|
|src/ui/desktop.js:239|x|track.scrollLeft|需要进一步测试|
|src/ui/desktop.js:243|item|g.inventory?.[0]|需要进一步测试|
|src/ui/desktop.js:244|states|Object.entries(g.itemEffect ／／ {})                   .filter(                     ([k, v]) =>                       (k === "type" && !!v) ／／                    |需要进一步测试|
|src/ui/desktop.js:289|t|$("#uiGroupTrack")|需要进一步测试|
|src/ui/desktop.js:291|overflow|t.scrollWidth > t.clientWidth + 2|需要进一步测试|
|src/ui/desktop.js:297|visualSnapshot|new Map()|需要进一步测试|
|src/ui/desktop.js:299|next|new Map()|需要进一步测试|
|src/ui/desktop.js:300|g||需要进一步测试|
|src/ui/desktop.js:301|current|{         main: g.inventory?.[0]?.key ／／ "",         inventory: JSON.stringify(g.inventory ／／ []),         effect: JSON.stringify(g.itemEffect ／／ null),        |需要进一步测试|
|src/ui/desktop.js:307|prior|visualSnapshot.get(g.id)|需要进一步测试|
|src/ui/desktop.js:337|dailySignature|""|需要进一步测试|
|src/ui/desktop.js:339|host|$("#uiDailyGrid")|需要进一步测试|
|src/ui/desktop.js:341|history|getSettlementHistory()|需要进一步测试|
|src/ui/desktop.js:342|signature|M.dayIndex() +         JSON.stringify([           preferences.knowledge,           preferences.itemTip,           preferences.honors,           preferences.chal|需要进一步测试|
|src/ui/desktop.js:355|knowledge|M.daily(         bank.knowledge.filter((x) => x.subject === preferences.subject),       )|需要进一步测试|
|src/ui/desktop.js:358|quiz|M.daily(         bank.challenges.filter((x) => x.subject === preferences.subject),       )|需要进一步测试|
|src/ui/desktop.js:361|keys|Object.keys(ITEM_DEFS)|需要进一步测试|
|src/ui/desktop.js:362|key|M.daily(keys)|需要进一步测试|
|src/ui/desktop.js:363|item|ITEM_DEFS[key]|需要进一步测试|
|src/ui/desktop.js:364|last|history[0]|需要进一步测试|
|src/ui/desktop.js:365|winner|last?.groups?.[0]|需要进一步测试|
|src/ui/desktop.js:366|html|""|需要进一步测试|
|src/ui/desktop.js:411|host|$("#historyListView")|需要进一步测试|
|src/ui/desktop.js:426|next|historyStack[i + 1] ／／ state|需要进一步测试|
|src/ui/desktop.js:427|diffs|M.differences(h, next)|需要进一步测试|
|src/ui/desktop.js:428|[kind, glyph, label]|historyKind(h.desc)|需要进一步测试|
|src/ui/desktop.js:429|changed|diffs.filter(             (d) =>               d.delta ／／               d.added ／／               d.removed ／／               JSON.stringify(d.inventoryBefore) !=|需要进一步测试|
|src/ui/desktop.js:463|index|Number(b.dataset.restore)|需要进一步测试|
|src/ui/desktop.js:464|target|historyStack[index]|需要进一步测试|
|src/ui/desktop.js:466|ok|await themeConfirm(             恢复到 ${target.time ／／ "未记录时间"}「${target.desc ／／ "未命名操作"}」之前？将恢复小组、积分、道具、持续状态与快照包含的回合字段，并丢弃此节点及其后 ${historyStack.length - index -|需要进一步测试|
|src/ui/desktop.js:480|records|getSettlementHistory()|需要进一步测试|
|src/ui/desktop.js:481|all|records       .flatMap((x) => (Array.isArray(x.groups) ? x.groups : []))       .filter(         (g) =>           (typeof g.score === "number" ／／             (ty|需要进一步测试|
|src/ui/desktop.js:489|best|all.length       ? Math.max(...all.map((g) => Number(g.score)))       : null|需要进一步测试|
|src/ui/desktop.js:506|host|$("#settlementHistoryContainer")|需要进一步测试|
|src/ui/desktop.js:508|list|records       .map((r, index) => ({ r, index }))       .filter(({ r }) =>         [r.title, r.champion, ...(r.groups ／／ []).map((g) => g.name)]           .join(|需要进一步测试|
|src/ui/desktop.js:528|groups|Array.isArray(r.groups) ? r.groups : []|需要进一步测试|
|src/ui/desktop.js:588|url|URL.createObjectURL(         new Blob([JSON.stringify(value, null, 2)], {           type: "application/json",         }),       )|需要进一步测试|
|src/ui/desktop.js:593|a|document.createElement("a")|需要进一步测试|
|src/ui/desktop.js:599|categories|[     ["rules", "battle", "课堂与比赛规则", "沿用现有规则与即时保存方式"],     ["appearance", "home", "外观与界面", "壁纸、显示模式与视图比例"],     ["motion", "spark", "动画与特效", "可中断的界面动效，不影响业务结果"]|需要进一步测试|
|src/ui/desktop.js:625|sc|$("#view-settings .settings-scroll")|需要进一步测试|
|src/ui/desktop.js:627|shell|document.createElement("div")|需要进一步测试|
|src/ui/desktop.js:631|sections|Object.fromEntries(       [...shell.querySelectorAll("[data-category-panel]")].map((p) => [         p.dataset.categoryPanel,         p,       ]),     )|需要进一步测试|
|src/ui/desktop.js:641|classified|[...sc.querySelectorAll("[data-settings-category]")]|需要进一步测试|
|src/ui/desktop.js:642|pane||需要进一步测试|
|src/ui/desktop.js:643|id|pane.id.replace("settingsV26_", "")|需要进一步测试|
|src/ui/desktop.js:649|el||需要进一步测试|
|src/ui/desktop.js:651|buttonIcons|$("#uiIconManagerV26")?.parentElement|需要进一步测试|
|src/ui/desktop.js:666|check|(key) =>       <input id="uiPref-${key}" data-pref="${key}" type="checkbox" ${preferences[key] ? "checked" : ""}>|需要进一步测试|
|src/ui/desktop.js:711|danger|[...sections.data.querySelectorAll("button")].filter((b) =>       /resetAllScores／clear/.test(b.getAttribute("onclick") ／／ ""),     )|需要进一步测试|
|src/ui/desktop.js:714|b||需要进一步测试|
|src/ui/desktop.js:718|key||需要进一步测试|
|src/ui/desktop.js:725|key|el.dataset.pref|需要进一步测试|
|src/ui/desktop.js:742|next|M.validateBank(JSON.parse($("#uiBankEditor").value))|需要进一步测试|
|src/ui/desktop.js:787|box|document.createElement(collapsed ? "details" : "div")|需要进一步测试|
|src/ui/desktop.js:796|body|box.lastElementChild|需要进一步测试|
|src/ui/desktop.js:801|marked|(name) => [       ...shell.querySelectorAll([data-settings-group="${name}"]),     ]|需要进一步测试|
|src/ui/desktop.js:827|icons|$("#uiIconManagerV26")?.parentElement|需要进一步测试|
|src/ui/desktop.js:844|rosterTitle|$(       "#uiSettingsRoster [data-settings-group='roster']:not(.setting-item)",     )|需要进一步测试|
|src/ui/desktop.js:848|sound|$("#settingsV26_sound")|需要进一步测试|
|src/ui/desktop.js:872|itemSounds|$("#itemFxSoundListV26")?.parentElement|需要进一步测试|
|src/ui/desktop.js:884|itemLibrary|$("#settingsV26_items")|需要进一步测试|
|src/ui/desktop.js:893|editor|$("#uiBankEditor")|需要进一步测试|
|src/ui/desktop.js:894|bankNodes|[       editor.previousElementSibling.previousElementSibling,       editor.previousElementSibling,       editor,       editor.nextElementSibling,       $("#uiBa|需要进一步测试|
|src/ui/desktop.js:909|data|$("#settingsV26_data")|需要进一步测试|
|src/ui/desktop.js:937|button|event.target.closest("button")|需要进一步测试|
|src/ui/desktop.js:938|action|button?.getAttribute("onclick")|需要进一步测试|
|src/ui/desktop.js:939|confirm|{           "applySettingsBatchMembers()": [             "重建小组与名单",             "将按文本重建全部小组。未列出的组会移除，改名可能建立新组。请先导出课堂备份。确认应用？",             applySettingsBatchMem|需要进一步测试|
|src/ui/desktop.js:973|el|$("#uiPref-subject")|需要进一步测试|
|src/ui/desktop.js:975|subjects|[       ...new Set([         "politics",         ...bank.knowledge.map((x) => x.subject),         ...bank.challenges.map((x) => x.subject),       ]),     ]|需要进一步测试|
|src/ui/desktop.js:993|animation||需要进一步测试|
|src/ui/desktop.js:1003|panel|$([data-category-panel="${activeSettings}"])|需要进一步测试|
|src/ui/desktop.js:1005|content|[...panel.children]       .flatMap((node) =>         node.matches(".settings-v26-pane") ? [...node.children] : [node],       )       .filter((node) => !node.hid|需要进一步测试|
|src/ui/desktop.js:1010|targets|entering       ? [$(".ui-settings-header"), $(".ui-settings-nav"), ...content]       : content|需要进一步测试|
|src/ui/desktop.js:1013|simple|preferences.motion === "simple"|需要进一步测试|
|src/ui/desktop.js:1015|animation|animate(         node,         [           {             opacity: simple ? 0.6 : 0,             translate: simple ? "0 -4px" : "0 -12px",           },          |需要进一步测试|
|src/ui/desktop.js:1042|aliases|{ function: "rules" }|需要进一步测试|
|src/ui/desktop.js:1068|right|$(".dock-right")|需要进一步测试|
|src/ui/desktop.js:1069|details|document.createElement("details")|需要进一步测试|
|src/ui/desktop.js:1073|menu|details.lastElementChild|需要进一步测试|
|src/ui/desktop.js:1074|b||需要进一步测试|
|src/ui/desktop.js:1075|action|b.getAttribute("onclick") ／／ ""|需要进一步测试|
|src/ui/desktop.js:1076|keep|/globalItemDraw／openHandRaise／openPickerModal／undoLast/.test(         action,       )|需要进一步测试|
|src/ui/desktop.js:1079|label|/globalItemDraw/.test(action)         ? "道具"         : /openHandRaise/.test(action)           ? "举手"           : /openPickerModal/.test(action)             ? "点|需要进一步测试|
|src/ui/desktop.js:1120|final|$("#btnFinalSettlement")|需要进一步测试|
|src/ui/desktop.js:1139|label|state.isLocked ? "解锁管理口令" : "管理已解锁"|需要进一步测试|
|src/ui/desktop.js:1140|original|icon("shield") + <span>${label}</span>|需要进一步测试|
|src/ui/desktop.js:1142|image|Reliability.safeImage(uiIconsV26().dock_lock)|需要进一步测试|
|src/ui/desktop.js:1148|disclosureMotions|new Map()|需要进一步测试|
|src/ui/desktop.js:1150|entry|disclosureMotions.get(details)|需要进一步测试|
|src/ui/desktop.js:1158|details||需要进一步测试|
|src/ui/desktop.js:1162|summary|event.target.closest("summary")|需要进一步测试|
|src/ui/desktop.js:1163|details|summary?.parentElement|需要进一步测试|
|src/ui/desktop.js:1173|nextOpen|!(disclosureMotions.get(details)?.open ?? details.open)|需要进一步测试|
|src/ui/desktop.js:1174|from|details.getBoundingClientRect().height|需要进一步测试|
|src/ui/desktop.js:1176|overflow|details.style.overflow|需要进一步测试|
|src/ui/desktop.js:1178|collapsed|details.getBoundingClientRect().height|需要进一步测试|
|src/ui/desktop.js:1180|expanded|details.getBoundingClientRect().height|需要进一步测试|
|src/ui/desktop.js:1182|entry|{ open: nextOpen, overflow, animation: null }|需要进一步测试|
|src/ui/desktop.js:1196|finish|() => {         if (disclosureMotions.get(details) === entry) settleDisclosure(details);       }|需要进一步测试|
|src/ui/desktop.js:1203|modalClosers|{     classroomShowcase: () => ClassroomFeedback.dismiss(),     programConfirmV28: () => document.getElementById("pcCancelV28")?.click(),     welcomeModal: () =|需要进一步测试|
|src/ui/desktop.js:1221|closingWindows|new Map()|需要进一步测试|
|src/ui/desktop.js:1223|pending|closingWindows.get(root)|需要进一步测试|
|src/ui/desktop.js:1232|pending|closingWindows.get(root)|需要进一步测试|
|src/ui/desktop.js:1241|surface|root.querySelector(".ui-function-surface")|需要进一步测试|
|src/ui/desktop.js:1253|pending|{ finish, inert: root.inert, animation: null }|需要进一步测试|
|src/ui/desktop.js:1280|openStack|[]|需要进一步测试|
|src/ui/desktop.js:1281|modalLayer|300000|需要进一步测试|
|src/ui/desktop.js:1283|known|new Map()|需要进一步测试|
|src/ui/desktop.js:1290|target|[         ...top.el.querySelectorAll(           'input:not([type=hidden]),button,select,textarea,[tabindex="0"]',         ),       ].find((el) => !el.disabled &|需要进一步测试|
|src/ui/desktop.js:1300|top|openStack.at(-1)|需要进一步测试|
|src/ui/desktop.js:1307|item|openStack.find((x) => x.id === id)|需要进一步测试|
|src/ui/desktop.js:1316|top|openStack.at(-1)|需要进一步测试|
|src/ui/desktop.js:1329|[id, close]||需要进一步测试|
|src/ui/desktop.js:1330|el|document.getElementById(id)|需要进一步测试|
|src/ui/desktop.js:1337|visible|el.open ／／           el.classList.contains("active") ／／           el.classList.contains("show") ／／           el.style.display === "flex" ／／           (id === "p|需要进一步测试|
|src/ui/desktop.js:1344|surface|el.querySelector(".ui-function-surface") ／／ el.firstElementChild|需要进一步测试|
|src/ui/desktop.js:1347|old||需要进一步测试|
|src/ui/desktop.js:1354|button|document.createElement("button")|需要进一步测试|
|src/ui/desktop.js:1367|focus|document.activeElement|需要进一步测试|
|src/ui/desktop.js:1369|previousZ|el.style.zIndex|需要进一步测试|
|src/ui/desktop.js:1370|previousLayer|el.style.getPropertyValue("--ui-modal-layer")|需要进一步测试|
|src/ui/desktop.js:1371|layer|String(++modalLayer)|需要进一步测试|
|src/ui/desktop.js:1375|dialog|el.firstElementChild?.tagName === "CANVAS"               ? el.querySelector(".grand-card")               : el.firstElementChild|需要进一步测试|
|src/ui/desktop.js:1394|zoom|Number(getComputedStyle(document.body).zoom) ／／ 1|需要进一步测试|
|src/ui/desktop.js:1395|travel|Math.min(               preferences.motion === "full" ? 42 : 8,               Math.max(                 0,                 (innerHeight - dialog.getBoundingClie|需要进一步测试|
|src/ui/desktop.js:1440|top|openStack.at(-1)|需要进一步测试|
|src/ui/desktop.js:1457|top|openStack.at(-1)|需要进一步测试|
|src/ui/desktop.js:1466|nodes|[             ...top.el.querySelectorAll(               'button,input,select,textarea,a[href],[tabindex="0"]',             ),           ].filter(             (x|需要进一步测试|
|src/ui/desktop.js:1477|first|nodes[0]|需要进一步测试|
|src/ui/desktop.js:1478|last|nodes.at(-1)|需要进一步测试|
|src/ui/desktop.js:1500|pickerGeneration|0|需要进一步测试|
|src/ui/desktop.js:1501|pickerPreparing|false|需要进一步测试|
|src/ui/desktop.js:1502|pickerRevealing|false|需要进一步测试|
|src/ui/desktop.js:1503|pickerReelRestores|[]|需要进一步测试|
|src/ui/desktop.js:1507|restore||需要进一步测试|
|src/ui/desktop.js:1516|button|$("#btnSlotTrigger")|需要进一步测试|
|src/ui/desktop.js:1522|modal|$("#pickerModal")|需要进一步测试|
|src/ui/desktop.js:1523|a||需要进一步测试|
|src/ui/desktop.js:1538|generation|++pickerGeneration|需要进一步测试|
|src/ui/desktop.js:1540|button|$("#btnSlotTrigger")|需要进一步测试|
|src/ui/desktop.js:1560|win|slotEngine.chosenResult|需要进一步测试|
|src/ui/desktop.js:1561|generation|pickerGeneration|需要进一步测试|
|src/ui/desktop.js:1562|modal|$("#pickerModal")|需要进一步测试|
|src/ui/desktop.js:1563|badge|$("#slotSubBadge")|需要进一步测试|
|src/ui/desktop.js:1564|button|$("#btnSlotTrigger")|需要进一步测试|
|src/ui/desktop.js:1567|label|badge.textContent|需要进一步测试|
|src/ui/desktop.js:1568|complete|() => {       if (         !isPickerCurrent(generation) ／／         slotEngine.chosenResult !== win ／／         slotEngine.isSpinning       )         return;     |需要进一步测试|
|src/ui/desktop.js:1595|pending|[]|需要进一步测试|
|src/ui/desktop.js:1596|pendingActual|[]|需要进一步测试|
|src/ui/desktop.js:1599|actual|frame.querySelector(".slot-reel-text")|需要进一步测试|
|src/ui/desktop.js:1600|isGroup|frame.id === "reelFrameGroup"|需要进一步测试|
|src/ui/desktop.js:1601|live|ClassroomFeedback.takeLive(frame)|需要进一步测试|
|src/ui/desktop.js:1602|candidates|isGroup         ? state.groups.map((g) => ({ raw: g.name, group: g }))         : state.groups.flatMap((g) =>             (g.members ／／ []).map((raw) => ({ raw, |需要进一步测试|
|src/ui/desktop.js:1607|height|frame.clientHeight|需要进一步测试|
|src/ui/desktop.js:1608|strip|document.createElement("div")|需要进一步测试|
|src/ui/desktop.js:1612|i|0|需要进一步测试|
|src/ui/desktop.js:1613|row|document.createElement("span")|需要进一步测试|
|src/ui/desktop.js:1614|list|live?.rows ／／ candidates|需要进一步测试|
|src/ui/desktop.js:1615|candidate|list[((live?.index ／／ 0) + i) % Math.max(1, list.length)]|需要进一步测试|
|src/ui/desktop.js:1618|node||需要进一步测试|
|src/ui/desktop.js:1629|visibility|live ? live.visibility : actual.style.visibility|需要进一步测试|
|src/ui/desktop.js:1637|a|animate(         strip,         [           { transform: translateY(-${(live?.fraction ／／ 0) * height}px) },           { transform: translateY(-${height * 6}|需要进一步测试|
|src/ui/desktop.js:1657|target|pickerTargetGroup()|需要进一步测试|
|src/ui/desktop.js:1658|valid|!!target &&       state.groups.some((g) => g.id === target.id) &&       !slotEngine.isSpinning &&       !pickerRevealing|需要进一步测试|
|src/ui/desktop.js:1677|left|$(".picker-left-v2")|需要进一步测试|
|src/ui/desktop.js:1678|right|$(".picker-right-v2")|需要进一步测试|
|src/ui/desktop.js:1679|options|$(".slot-options-row")|需要进一步测试|
|src/ui/desktop.js:1681|tabs|$(".picker-info-tabs")|需要进一步测试|
|src/ui/desktop.js:1682|info|$("#pickerInfoBox")|需要进一步测试|
|src/ui/desktop.js:1684|stats|$("#pickerStatsBtn")|需要进一步测试|
|src/ui/desktop.js:1689|target|$("#pickerScoreTarget")|需要进一步测试|
|src/ui/desktop.js:1697|settlementBusy|false|需要进一步测试|
|src/ui/desktop.js:1698|settlementGeneration|0|需要进一步测试|
|src/ui/desktop.js:1701|status|$("#uiSettlementStatus")|需要进一步测试|
|src/ui/desktop.js:1709|generation|settlementGeneration|需要进一步测试|
|src/ui/desktop.js:1713|text|button.textContent|需要进一步测试|
|src/ui/desktop.js:1715|status|$("#uiSettlementStatus")|需要进一步测试|
|src/ui/desktop.js:1729|result|confirmFinalSettlement()|需要进一步测试|
|src/ui/desktop.js:1744|value|JSON.parse(         localStorage.getItem("godpower_ui_preferences_v1") ／／ "{}",       )|需要进一步测试|
|src/ui/desktop.js:1747|key||需要进一步测试|
|src/ui/desktop.js:1758|saved|localStorage.getItem("godpower_ui_bank_v1")|需要进一步测试|
|src/ui/desktop.js:1781|text|["欢迎", "比赛", "历史", "档案", "设置"][i]|需要进一步测试|
|src/ui/desktop.js:1789|el|$(selector)|需要进一步测试|
|src/ui/desktop.js:1801|details|event.target|需要进一步测试|
|src/ui/desktop.js:1804|a||需要进一步测试|
|src/ui/desktop.js:1821|t|$("#uiGroupTrack")|需要进一步测试|
|src/ui/desktop.js:1832|next|Math.max(           0,           Math.min(t.scrollWidth - t.clientWidth, t.scrollLeft + e.deltaY),         )|需要进一步测试|
|src/ui/desktop.js:1916|control|$("#uiPref-groupCruise")|需要进一步测试|
|src/ui/desktop.js:1918|saved|persistPreferences()|需要进一步测试|
|src/ui/model.js:3|examples|{     knowledge: [       {         id: "politics-rule-law",         subject: "politics",         title: "权利与义务",         module: "政治 · 法治观念",         summary: "|需要进一步测试|
|src/ui/model.js:71|a|new Map((before.groups ／／ []).map((g) => [g.id, g]))|需要进一步测试|
|src/ui/model.js:72|b|new Map((after.groups ／／ []).map((g) => [g.id, g]))|需要进一步测试|
|src/ui/model.js:73|rank|(groups) =>       new Map(         [...groups]           .sort((x, y) => Number(y.score) - Number(x.score))           .map((g, i) => [g.id, i + 1]),       )|需要进一步测试|
|src/ui/model.js:79|ra|rank(before.groups ／／ [])|需要进一步测试|
|src/ui/model.js:80|rb|rank(after.groups ／／ [])|需要进一步测试|
|src/ui/model.js:82|x|a.get(id)|需要进一步测试|
|src/ui/model.js:83|y|b.get(id)|需要进一步测试|
|src/ui/model.js:117|row||需要进一步测试|
|src/ui/model.js:135|q||需要进一步测试|
|src/ui/model.js:151|scores|ordered.map((g) => Number(g.score) ／／ 0)|需要进一步测试|
|src/ui/model.js:152|total|scores.every(Number.isSafeInteger)       ? scores.reduce((sum, value) => sum + BigInt(value), 0n).toString()       : String(scores.reduce((sum, value) => sum + |需要进一步测试|
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
|src/ui/battle-grid.js:50|roundClass|state.roundActive && !state.evaluated ? "" : "round-disabled"|需要进一步测试|
|src/ui/battle-grid.js:52|optionsHtml|["A", "B", "C", "D"]       .map((opt) => {         let cls = "opt-btn";         if (g.selectedOpt === opt) cls += " active";         if (state.evaluated && g.se|需要进一步测试|
|src/ui/battle-grid.js:54|cls|"opt-btn"|需要进一步测试|
|src/ui/battle-grid.js:64|rawScore|g.displayScore !== undefined ? g.displayScore : g.score|需要进一步测试|
|src/ui/battle-grid.js:65|editCls|state.isLocked ? "" : "editable"|需要进一步测试|
|src/ui/battle-grid.js:66|scoreHtml|state.editingScoreId === g.id         ? <input type="number" class="score-input" id="input-score-${g.id}" value="${g.score}" onblur="finishDirectScoreEdit(${g.|需要进一步测试|
|src/ui/battle-grid.js:70|allInClass|g.allIn ? "allin-toggle-btn active" : "allin-toggle-btn"|需要进一步测试|
|src/ui/battle-grid.js:71|allInText|g.allIn ? "🔥 ALL IN" : "ALL IN"|需要进一步测试|
|src/ui/battle-grid.js:72|lockAttr|state.isLocked ? "locked-disabled" : ""|需要进一步测试|
|src/ui/battle-grid.js:74|slotsHtml|[0, 1, 2]       .map((i) => {         const it = g.inventory?.[i];         return it           ? <div class="item-slot ${i === 0 ? "queue-main-slot" : "queue-s|需要进一步测试|
|src/ui/battle-grid.js:76|it|g.inventory?.[i]|需要进一步测试|
|src/ui/battle-grid.js:103|card|grid.querySelector(.group-row-card[data-group-id="${g.id}"])|需要进一步测试|
|src/ui/battle-grid.js:105|main|card.querySelector(".queue-main-slot")|需要进一步测试|
|src/ui/battle-grid.js:114|more|card.querySelector(".more-btn")|需要进一步测试|
|src/ui/battle-grid.js:123|aura|""|需要进一步测试|
|src/ui/battle-grid.js:129|a|document.createElement("div")|需要进一步测试|
|src/ui/battle-grid.js:137|input|document.getElementById(       input-score-${state.editingScoreId},     )|需要进一步测试|
|src/ui/battle-grid.js:150|moved|[]|需要进一步测试|
|src/ui/battle-grid.js:153|old|oldRects.get(String(card.dataset.groupId))|需要进一步测试|
|src/ui/battle-grid.js:155|now|card.getBoundingClientRect()|需要进一步测试|
|src/ui/battle-grid.js:156|dx|old.left - now.left|需要进一步测试|
|src/ui/battle-grid.js:157|dy|old.top - now.top|需要进一步测试|
|src/ui/battle-grid.js:195|ranks|new Map(ranking().map((g, i) => [g.id, i + 1]))|需要进一步测试|
|src/ui/battle-grid.js:199|id|Number(card.dataset.groupId)|需要进一步测试|
|src/ui/battle-grid.js:200|wrap|card.querySelector(".v213-name-wrap")|需要进一步测试|
|src/ui/battle-grid.js:202|badge|wrap.querySelector(".v214-rank-badge")|需要进一步测试|
|src/ui/battle-grid.js:209|sub|wrap.querySelector(".v213-name-sub")|需要进一步测试|
|src/ui/battle-grid.js:219|card|document.querySelector(         .group-row-card[data-group-id="${g.id}"],       )|需要进一步测试|
|src/ui/battle-grid.js:224|allIn|card.querySelector(".allin-toggle-btn")|需要进一步测试|
|src/ui/battle-grid.js:231|main|card.querySelector(".v213-main-item")|需要进一步测试|
|src/ui/render.js:2|pendingRenderGridV21726|false|需要进一步测试|
|src/ui/render.js:57|attackPending|!attackRenderFlushingV21713 &&     (attackRenderGateV21713 ／／ attackRenderTimerV21713)|需要进一步测试|

## 动画、计时器、事件监听注册与清理

|位置|调用|参数摘要|分类|
|---|---|---|---|
|src/script/00.js:252|setTimeout|() => { if (input) { input.focus(); input.select(); } }; 60|需要进一步测试|
|src/script/00.js:301|setTimeout|() => playSound('roll_win'); 450|需要进一步测试|
|src/script/00.js:378|requestAnimationFrame|loop|需要进一步测试|
|src/script/00.js:380|cancelAnimationFrame|confettiAnimationId|需要进一步测试|
|src/script/00.js:386|cancelAnimationFrame|confettiAnimationId|需要进一步测试|
|src/script/00.js:480|window.setTimeout|fn; Math.min(timeout, 800)|需要进一步测试|
|src/script/00.js:697|setTimeout|() => res(); 1500|需要进一步测试|
|src/script/00.js:1070|clearTimeout|id|需要进一步测试|
|src/script/00.js:1110|setTimeout|() => {     scheduleDualLoopChunk(nextStartTime, loopStartSec);   }; delayMs|需要进一步测试|
|src/script/00.js:1180|setTimeout|() => {       bgmPreloadNextSet();     }; 1000|需要进一步测试|
|src/script/00.js:1231|clearTimeout|bgmEngine.transitionTimer|需要进一步测试|
|src/script/00.js:1265|setTimeout|() => {       bgmEngine.transitionTimer = null;       if (bgmEngine.state === 'TRANSITION') {         const stillAllIn = checkAllInRatio();         if (stillAllIn) {           bgmE; Math.max(0, (battleResumeTime - audioCtx.currentTime) * 1000)|需要进一步测试|
|src/script/00.js:1285|clearTimeout|bgmEngine.transitionTimer|需要进一步测试|
|src/script/00.js:1335|clearTimeout|bgmEngine.transitionTimer|需要进一步测试|
|src/script/00.js:1359|setTimeout|() => {       bgmEngine.victoryFadeTimer = null;       if (bgmEngine.battleSource) { try { bgmEngine.battleSource.stop(); } catch(e) {} bgmEngine.battleSource = null; }       if (b; Math.max(0, (triggerTime + 0.055 - now) * 1000)|需要进一步测试|
|src/script/00.js:1386|setTimeout|() => {         bgmEngine.victoryTimer = null;         if (bgmEngine.state === 'VICTORY') {           bgmStopAll();           if (callback) callback();         }       }; Math.max(0, (triggerTime - now + 3.0) * 1000)|需要进一步测试|
|src/script/00.js:1403|clearTimeout|bgmEngine.victoryTimer|需要进一步测试|
|src/script/00.js:1407|clearTimeout|bgmEngine.victoryFadeTimer|需要进一步测试|
|src/script/00.js:1411|clearTimeout|bgmEngine.transitionTimer|需要进一步测试|
|src/script/00.js:1446|clearTimeout|toastTimer|需要进一步测试|
|src/script/00.js:1452|setTimeout|() => {     t.classList.remove('show');     if(t.matches(':popover-open'))t.hidePopover();     toastTimer = null;   }; 3800|需要进一步测试|
|src/script/00.js:1583|setTimeout|() => document.getElementById('pwdInput').focus(); 80|需要进一步测试|
|src/script/00.js:1652|setTimeout|() => res(false); 2500|需要进一步测试|
|src/script/00.js:1916|setTimeout|() => document.getElementById('modalCustomInput').focus(); 50|需要进一步测试|
|src/script/00.js:1972|setTimeout|() => {     banner.classList.remove('show');     card.classList.remove('milestone-glow');   }; 2200|需要进一步测试|
|src/script/00.js:1982|cancelAnimationFrame|activeScoreAnimId|需要进一步测试|
|src/script/00.js:1990|cancelAnimationFrame|activeScoreAnimId|需要进一步测试|
|src/script/00.js:2015|requestAnimationFrame|tick|需要进一步测试|
|src/script/00.js:2028|requestAnimationFrame|tick|需要进一步测试|
|src/script/00.js:2239|setTimeout|() => card.classList.remove(animCls); 1100|需要进一步测试|
|src/script/00.js:2268|setTimeout|() => input.focus(); 50|需要进一步测试|
|src/script/00.js:2752|setInterval|() => {       const randomGrp = reelGrps[Math.floor(Math.random() * reelGrps.length)];       reelGrpText.innerText = randomGrp.name;     }; 70|需要进一步测试|
|src/script/00.js:2760|setInterval|() => {       const randomStu = reelStus[Math.floor(Math.random() * reelStus.length)];       reelStuText.innerHTML = studentLabelHTMLV218(randomStu.name, randomStu.group);     }; 50|需要进一步测试|
|src/script/00.js:2771|clearInterval|slotEngine.timerGroup|需要进一步测试|
|src/script/00.js:2772|clearInterval|slotEngine.timerStudent|需要进一步测试|
|src/script/00.js:2871|setTimeout|()=>URL.revokeObjectURL(url); 1000|需要进一步测试|
|src/script/00.js:3333|setInterval|updateWelcomeClock; 1000|需要进一步测试|
|src/script/00.js:3820|clearTimeout|menuReloadTimer|需要进一步测试|
|src/script/00.js:3821|setTimeout|async () => {     menuReloadTimer = null;     const key = menuBgm.currentKey;     if (!key ／／ !menuBgm.active) return;     delete menuBgm.buffers[key];     menuBgm.uploadedKeys.del; 250|需要进一步测试|
|src/script/00.js:3979|setTimeout|() => {     try { rollLoopNode.stop(); } catch(e) {}     rollLoopNode = null;     rollLoopGain = null;     if (cb) cb();   }; 160|需要进一步测试|
|src/script/00.js:4101|window.addEventListener|'DOMContentLoaded'; initWallpaper|需要进一步测试|
|src/script/00.js:4103|window.addEventListener|'DOMContentLoaded'; () => {   if (state.zoomLevel !== 1.0) {     document.body.style.zoom = state.zoomLevel;   }   initResizerDrag();   renderAll();   renderWelcomePage();   startWelcomeClock();    //|需要进一步测试|
|src/script/00.js:4132|setInterval|() => {       if (audioCtx && audioCtx.state === 'running') {         clearInterval(resumeRetryTimer); resumeRetryTimer = null;         hideAudioHint();         return;       }    ; 1000|需要进一步测试|
|src/script/00.js:4134|clearInterval|resumeRetryTimer|需要进一步测试|
|src/script/00.js:4143|clearInterval|resumeRetryTimer|需要进一步测试|
|src/script/00.js:4168|window.addEventListener|ev; unlockByGesture; { once: true, passive: true }|需要进一步测试|
|src/script/00.js:4262|setTimeout|()=>d.remove(); 1900|需要进一步测试|
|src/script/00.js:4459|setTimeout|()=>{const c=document.querySelector(.group-row-card[data-group-id="${id}"]);if(c){c.classList.add('effect-bomb');setTimeout(()=>c.classList.remove('effect-bomb'),900)}}; 30|需要进一步测试|
|src/script/00.js:4459|setTimeout|()=>c.classList.remove('effect-bomb'); 900|需要进一步测试|
|src/script/00.js:4461|clearInterval|bulletTimer|需要进一步测试|
|src/script/00.js:4461|setInterval|()=>{let any=false;ensureItemState();state.groups.forEach(g=>{if(!g.itemEffect／／g.itemEffect.type!=='bullet')return;any=true;const t=state.groups.find(x=>x.id===g.itemEffect.target; 350|需要进一步测试|
|src/script/00.js:4461|clearInterval|bulletTimer|需要进一步测试|
|src/script/00.js:4462|setTimeout|startBlooperClock; 500|需要进一步测试|
|src/script/00.js:4467|setInterval|()=>{eligible.forEach(g=>{const k=ITEM_KEYS[Math.floor(Math.random()*ITEM_KEYS.length)],c=grid.querySelector([data-draw-id="${g.id}"] .roulette);if(c)c.innerHTML=itemVisual(k)})}; 90|需要进一步测试|
|src/script/00.js:4468|setTimeout|()=>{clearInterval(timer);eligible.forEach(g=>{const key=drawItemForGroup(g);if(key)addItemToGroup(g,key);const card=grid.querySelector([data-draw-id="${g.id}"]);if(card&&key){ca; 3000|需要进一步测试|
|src/script/00.js:4468|clearInterval|timer|需要进一步测试|
|src/script/00.js:4468|setTimeout|()=>{ov.classList.remove('active');itemDrawBusy=false}; 3000|需要进一步测试|
|src/script/00.js:4600|window.addEventListener|'DOMContentLoaded'; ()=>{ensureItemState();renderAll();startBulletTimer();startBlooperClock()}|需要进一步测试|
|src/script/00.js:4665|setInterval|()=>eligible.forEach(g=>{const o=overlays.get(g.id);if(!o)return;const r=ranking(),pos=r.findIndex(x=>x.id===g.id)+1;const k=weightedPick(itemDropWeights(pos,r.length));o.querySele; 85|需要进一步测试|
|src/script/00.js:4666|setTimeout|()=>{clearInterval(timer);eligible.forEach(g=>{const k=drawItemForGroup(g),o=overlays.get(g.id);if(k)addItemToGroup(g,k);if(o&&k){o.classList.add('reveal');o.querySelector('.r-icon; 3000|需要进一步测试|
|src/script/00.js:4666|clearInterval|timer|需要进一步测试|
|src/script/00.js:4667|setTimeout|()=>{eligible.forEach(g=>{const c=document.querySelector(.group-row-card[data-group-id="${g.id}"]);if(c){c.classList.remove('item-draw-spinning');c.querySelector('.card-item-roul; 3000|需要进一步测试|
|src/script/00.js:4672|setTimeout|()=>{installSettingsTabs();showSettingsV2('items')}; 0|需要进一步测试|
|src/script/00.js:4681|setTimeout|()=>URL.revokeObjectURL(a.href); 1000|需要进一步测试|
|src/script/00.js:4722|document.getElementById('aboutBackdrop')?.addEventListener|'click'; e=>{if(e.target.id==='aboutBackdrop')closeAbout()}|需要进一步测试|
|src/script/00.js:4723|document.getElementById('handRaiseBackdrop')?.addEventListener|'click'; e=>{if(e.target.id==='handRaiseBackdrop')closeHandRaise()}|需要进一步测试|
|src/script/00.js:4724|setTimeout|installSettingsTabs; 0|需要进一步测试|
|src/script/00.js:4725|window.addEventListener|'DOMContentLoaded'; ()=>{ensureV2State();installSettingsTabs();renderPickerInfo()}|需要进一步测试|
|src/script/00.js:4732|clearInterval|handItemDrawTimer|需要进一步测试|
|src/script/00.js:4733|clearTimeout|handItemDrawFinishTimer|需要进一步测试|
|src/script/00.js:4789|setInterval|tick; 82|需要进一步测试|
|src/script/00.js:4791|setTimeout|()=>{     clearInterval(handItemDrawTimer);handItemDrawTimer=null;handItemDrawFinishTimer=null;     const live=state.groups.find(x=>x.id===handItemDrawGroupId);     if(!live／／!elig; 3000|需要进一步测试|
|src/script/00.js:4792|clearInterval|handItemDrawTimer|需要进一步测试|
|src/script/00.js:4832|setTimeout|()=>{     const cards=[...document.querySelectorAll('#itemWindowBody .item-card')];     if(cards[idx]){cards[idx].style.outline='3px solid #38bdf8';cards[idx].scrollIntoView({block; 80|需要进一步测试|
|src/script/00.js:4867|setTimeout|()=>showItemUseFx(key,groupId,itemFxTargetText(key,groupId)); 40|需要进一步测试|
|src/script/00.js:4948|requestAnimationFrame|frame|需要进一步测试|
|src/script/00.js:4960|setTimeout|()=>{       eligible.forEach(g=>{         const c=document.querySelector(.group-row-card[data-group-id="${g.id}"]);         if(c){const o=c.querySelector('.card-item-roulette');i; 3000|需要进一步测试|
|src/script/00.js:4963|setTimeout|()=>{c.classList.remove('item-draw-spinning');c.querySelector('.card-item-roulette')?.remove()}; 430|需要进一步测试|
|src/script/00.js:4965|setTimeout|()=>{itemDrawBusy=false;renderAll()}; 470|需要进一步测试|
|src/script/00.js:4968|requestAnimationFrame|frame|需要进一步测试|
|src/script/00.js:5001|requestAnimationFrame|frame|需要进一步测试|
|src/script/00.js:5018|requestAnimationFrame|frame|需要进一步测试|
|src/script/00.js:5023|clearTimeout|handItemDrawFinishTimer|需要进一步测试|
|src/script/00.js:5063|setTimeout|()=>{card.classList.remove('card-use-fx',CARD_ITEM_FX_CLASS[key]／／'cfx-rise');b.remove()}; 1850|需要进一步测试|
|src/script/00.js:5072|setTimeout|()=>{card.classList.remove('card-hit-fx','card-defend-fx','card-heal-fx');card.style.removeProperty('--hitc')}; 1600|需要进一步测试|
|src/script/00.js:5094|setTimeout|()=>playTargetCardFx(id,key,beneficial?'heal':'hit'); 120+n*70|需要进一步测试|
|src/script/00.js:5112|window.addEventListener|'pagehide'; ()=>{try{saveState();persistHistoryV26()}catch(e){}}|需要进一步测试|
|src/script/00.js:5113|document.addEventListener|'visibilitychange'; ()=>{if(document.visibilityState==='hidden'){try{saveState();persistHistoryV26()}catch(e){}}}|需要进一步测试|
|src/script/00.js:5156|setTimeout|()=>playSound(itemSoundCategoryV26(k)); 55|需要进一步测试|
|src/script/00.js:5161|setInterval|()=>{if(n++<13)playSound('item_draw_tick');else clearInterval(timer)}; Math.max(150,ms/15)|需要进一步测试|
|src/script/00.js:5161|clearInterval|timer|需要进一步测试|
|src/script/00.js:5162|setTimeout|()=>{clearInterval(timer);playSound('item_draw_reveal')}; ms|需要进一步测试|
|src/script/00.js:5162|clearInterval|timer|需要进一步测试|
|src/script/00.js:5247|window.addEventListener|'DOMContentLoaded'; ()=>{  const sub=document.querySelector('#view-settings .fullview-sub');if(sub)sub.textContent='功能、音效与音乐、道具图标、学生名单及数据管理。';  rebuildSettingsV26();applyUiIconsV26();  setTimeout(()=>|需要进一步测试|
|src/script/00.js:5250|setTimeout|()=>{renderItemFxSoundListV26();persistHistoryV26();saveState()}; 400|需要进一步测试|
|src/script/00.js:5260|window.addEventListener|'resize'; syncVisualViewportV27; {passive:true}|需要进一步测试|
|src/script/00.js:5261|window.addEventListener|'orientationchange'; ()=>setTimeout(syncVisualViewportV27,80); {passive:true}|需要进一步测试|
|src/script/00.js:5261|setTimeout|syncVisualViewportV27; 80|需要进一步测试|
|src/script/00.js:5263|window.visualViewport.addEventListener|'resize'; syncVisualViewportV27; {passive:true}|需要进一步测试|
|src/script/00.js:5264|window.visualViewport.addEventListener|'scroll'; syncVisualViewportV27; {passive:true}|需要进一步测试|
|src/script/00.js:5302|document.removeEventListener|'keydown'; key|需要进一步测试|
|src/script/00.js:5305|o.addEventListener|'click'; e=>{if(e.target===o)finish(false)}|需要进一步测试|
|src/script/00.js:5306|document.removeEventListener|'keydown'; key|需要进一步测试|
|src/script/00.js:5306|document.removeEventListener|'keydown'; key|需要进一步测试|
|src/script/00.js:5306|document.removeEventListener|'keydown'; key|需要进一步测试|
|src/script/00.js:5307|document.addEventListener|'keydown'; key|需要进一步测试|
|src/script/00.js:5330|window.addEventListener|'beforeunload'; ()=>{try{saveState();persistHistoryV26()}catch(e){}}|需要进一步测试|
|src/script/00.js:5331|window.addEventListener|'DOMContentLoaded'; ()=>setTimeout(repairPersistentItemsV28,0)|需要进一步测试|
|src/script/00.js:5331|setTimeout|repairPersistentItemsV28; 0|需要进一步测试|
|src/script/00.js:5396|requestAnimationFrame|frame|需要进一步测试|
|src/script/00.js:5412|setTimeout|()=>{       eligible.forEach(g=>{         const c=document.querySelector(.group-row-card[data-group-id="${g.id}"]);         if(c){           const o=c.querySelector('.card-item-r; 3000|需要进一步测试|
|src/script/00.js:5418|setTimeout|()=>{c.classList.remove('item-draw-spinning');c.querySelector('.card-item-roulette')?.remove()}; 430|需要进一步测试|
|src/script/00.js:5421|setTimeout|()=>{itemDrawBusy=false;renderAll()}; 470|需要进一步测试|
|src/script/00.js:5424|requestAnimationFrame|frame|需要进一步测试|
|src/script/00.js:5455|requestAnimationFrame|frame|需要进一步测试|
|src/script/00.js:5472|requestAnimationFrame|frame|需要进一步测试|
|src/script/00.js:5594|requestAnimationFrame|frame|需要进一步测试|
|src/script/00.js:5606|setTimeout|()=>{      eligible.forEach(g=>{        const c=document.querySelector(.group-row-card[data-group-id="${g.id}"]);        if(c){const o=c.querySelector('.card-item-roulette');if(o; 3000|需要进一步测试|
|src/script/00.js:5609|setTimeout|()=>{c.classList.remove('item-draw-spinning');c.querySelector('.card-item-roulette')?.remove()}; 430|需要进一步测试|
|src/script/00.js:5611|setTimeout|()=>{itemDrawBusy=false;renderAll()}; 470|需要进一步测试|
|src/script/00.js:5614|requestAnimationFrame|frame|需要进一步测试|
|src/script/00.js:5642|requestAnimationFrame|frame|需要进一步测试|
|src/script/00.js:5658|requestAnimationFrame|frame|需要进一步测试|
|src/script/00.js:5793|setTimeout|()=>patchVisibleGodManagerV283(gid); 0|需要进一步测试|
|src/script/00.js:5806|setTimeout|()=>{appendMissingEncyclopediaV283()}; 0|需要进一步测试|
|src/script/00.js:5807|window.addEventListener|'DOMContentLoaded'; ()=>setTimeout(()=>{  appendMissingEncyclopediaV283();  patchItemIconSettingsV283(); },80)|需要进一步测试|
|src/script/00.js:5807|setTimeout|()=>{  appendMissingEncyclopediaV283();  patchItemIconSettingsV283(); }; 80|需要进一步测试|
|src/script/00.js:5839|window.addEventListener|'DOMContentLoaded'; ()=>setTimeout(refresh26ItemInterfacesV284,120)|需要进一步测试|
|src/script/00.js:5839|setTimeout|refresh26ItemInterfacesV284; 120|需要进一步测试|
|src/script/00.js:5941|window.addEventListener|'DOMContentLoaded'; ()=>setTimeout(()=>{   installCommunismModeSetting();   applyCommunismMode(); },160)|需要进一步测试|
|src/script/00.js:5941|setTimeout|()=>{   installCommunismModeSetting();   applyCommunismMode(); }; 160|需要进一步测试|
|src/script/00.js:6216|setTimeout|()=>{     card.classList.remove(cls,'card-defend-fx');     badge.remove();     card.style.removeProperty('--hitc');   }; 1750|需要进一步测试|
|src/script/00.js:6235|setTimeout|()=>playAttackTargetFxV2116(target.id,'lightning',true); 120|需要进一步测试|
|src/script/00.js:6254|setTimeout|()=>playAttackTargetFxV2116(target.id,'lightning',true); 120|需要进一步测试|
|src/script/00.js:6275|setTimeout|()=>playAttackTargetFxV2116(target.id,'lightning',false); 120|需要进一步测试|
|src/script/00.js:6284|setTimeout|()=>playCasterCardFx(key,casterId); 30|需要进一步测试|
|src/script/00.js:6475|setTimeout|()=>slots[0]?.classList.remove('queue-promoted'); 1150|需要进一步测试|
|src/script/00.js:6494|window.addEventListener|'DOMContentLoaded'; ()=>setTimeout(()=>{   try{renderAll()}catch(e){} },220)|需要进一步测试|
|src/script/00.js:6494|setTimeout|()=>{   try{renderAll()}catch(e){} }; 220|需要进一步测试|
|src/script/01.js:82|setTimeout|()=>{v213SuppressReorderAnimation=false}; 1100|需要进一步测试|
|src/script/01.js:89|window.addEventListener|'DOMContentLoaded'; ()=>setTimeout(()=>{ensureGroupNumbersV213(true);try{renderAll()}catch(e){};try{renderItemEncyclopedia()}catch(e){}},280)|需要进一步测试|
|src/script/01.js:89|setTimeout|()=>{ensureGroupNumbersV213(true);try{renderAll()}catch(e){};try{renderItemEncyclopedia()}catch(e){}}; 280|需要进一步测试|
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
|src/script/04.js:33|setTimeout|() => {         try {           /* 基础 +2 / All In 动画到这里应当已经完成；若还有尾帧，直接收束。 */           if (activeScoreAnimId) {             cancelAnimationFrame(activeScoreAnimId);             act; 720|需要进一步测试|
|src/script/04.js:37|cancelAnimationFrame|activeScoreAnimId|需要进一步测试|
|src/script/04.js:192|setInterval|() => {     if (n++ < 13) playSound('item_draw_tick');     else clearInterval(timer);   }; interval|需要进一步测试|
|src/script/04.js:194|clearInterval|timer|需要进一步测试|
|src/script/04.js:196|setTimeout|() => {     clearInterval(timer);     playSound('item_draw_reveal');   }; ms|需要进一步测试|
|src/script/04.js:197|clearInterval|timer|需要进一步测试|
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
|src/script/22.js:30|window.addEventListener|'DOMContentLoaded'; ()=>{   setTimeout(repairFlowerChargesV21719,40); }|需要进一步测试|
|src/script/22.js:31|setTimeout|repairFlowerChargesV21719; 40|需要进一步测试|
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
|src/script/36.js:475|clearTimeout|showHandEffectV218._timer|需要进一步测试|
|src/script/36.js:476|setTimeout|()=>overlay.classList.remove('active'); 2200|需要进一步测试|
|src/script/36.js:483|setTimeout|()=>showHandEffectV218(key,before); 60|需要进一步测试|
|src/script/36.js:502|setTimeout|fire; 520|需要进一步测试|
|src/script/36.js:527|setTimeout|renderHandRewardControlsV218; 0|需要进一步测试|
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
|src/ui/battle-motion.js:53|clearTimeout|prior.timer|需要进一步测试|
|src/ui/battle-motion.js:123|setTimeout|() => {       if (sessions.get(id) !== session) return;       sessions.delete(id);       document.querySelectorAll(".bm-layer").forEach((el) => {         if (el.dataset.bmKey === i; duration + 40|需要进一步测试|
|src/ui/battle-motion.js:161|clearTimeout|s.timer|需要进一步测试|
|src/ui/battle-motion.js:176|document.addEventListener|"visibilitychange"; () => {     if (document.hidden) clear();   }|需要进一步测试|
|src/ui/classroom-feedback.js:112|clearTimeout|timer|需要进一步测试|
|src/ui/classroom-feedback.js:124|clearTimeout|timer|需要进一步测试|
|src/ui/classroom-feedback.js:178|setTimeout|() => {       if (serial === generation) dismiss();     }; options.duration|需要进一步测试|
|src/ui/classroom-feedback.js:235|e.addEventListener|"change"; () => {         const values = [...document.querySelectorAll("[data-cf-slot]")].map(           (x) => (x.value.trim() === "" ? NaN : Number(x.value)),         );         try {     |需要进一步测试|
|src/ui/classroom-feedback.js:251|e.addEventListener|"change"; () => {         setOptions({           [e.dataset.cfOption]:             e.type === "checkbox"               ? e.checked               : ["duration", "clickVolume"].includes(e.data|需要进一步测试|
|src/ui/classroom-feedback.js:299|document.addEventListener|"click"; (e) => {         const button = e.target.closest?.(           "button,summary,[role=button],input[type=button],input[type=submit]",         );         if (!button ／／ button.disable; true|需要进一步测试|
|src/ui/classroom-feedback.js:310|clearTimeout|clickCleanup|需要进一步测试|
|src/ui/classroom-feedback.js:311|setTimeout|() => {           clickEvent = null;           clickPreview = false;           clickCleanup = null;         }; 0|需要进一步测试|
|src/ui/classroom-feedback.js:339|dialog().addEventListener|"cancel"; (e) => {       e.preventDefault();       dismiss();     }|需要进一步测试|
|src/ui/classroom-feedback.js:345|document.addEventListener|"visibilitychange"; () => {       if (document.hidden) {         cancel();         stopClickVoice();         clearLive();       }     }|需要进一步测试|
|src/ui/classroom-feedback.js:352|matchMedia("(prefers-reduced-motion: reduce)").addEventListener|"change"; () => {         if (!allowed()) {           cancel();           clearLive();         }       }|需要进一步测试|
|src/ui/desktop.js:103|cancelAnimationFrame|pageMotionFrame|需要进一步测试|
|src/ui/desktop.js:176|requestAnimationFrame|() => {         pageMotionFrame = null;         if (currentView !== name ／／ !preferences.pageMotion) return;         const selectors = {           welcome:             ".gp-hero,.g|需要进一步测试|
|src/ui/desktop.js:283|requestAnimationFrame|updateArrows|需要进一步测试|
|src/ui/desktop.js:597|setTimeout|() => URL.revokeObjectURL(url); 1000|需要进一步测试|
|src/ui/desktop.js:934|shell.addEventListener|"click"; async (event) => {         const button = event.target.closest("button");         const action = button?.getAttribute("onclick");         const confirm = {           "applySettings; true|需要进一步测试|
|src/ui/desktop.js:1124|document.addEventListener|"click"; (e) => {         if (e.target.closest(".bottom-dock") && currentView !== "battle") {           e.preventDefault();           e.stopImmediatePropagation();           return;        ; true|需要进一步测试|
|src/ui/desktop.js:1161|document.addEventListener|"click"; (event) => {       const summary = event.target.closest("summary");       const details = summary?.parentElement;       if (         !details ／／         details.tagName !== "DETAIL|需要进一步测试|
|src/ui/desktop.js:1297|document.addEventListener|"focusin"; (event) => {         const top = openStack.at(-1);         if (top && !top.el.contains(event.target)) focusModal(top);       }; true|需要进一步测试|
|src/ui/desktop.js:1454|document.addEventListener|"keydown"; (e) => {         const top = openStack.at(-1);         if (!top) return;         if (e.key === "Escape") {           e.preventDefault();           e.stopImmediatePropagation();    ; true|需要进一步测试|
|src/ui/desktop.js:1719|requestAnimationFrame|() => requestAnimationFrame(resolve)|需要进一步测试|
|src/ui/desktop.js:1719|requestAnimationFrame|resolve|需要进一步测试|
|src/ui/desktop.js:1765|window.addEventListener|"resize"; syncViewport|需要进一步测试|
|src/ui/desktop.js:1766|matchMedia("(prefers-reduced-motion: reduce)").addEventListener|"change"; () => {         if (!canAnimate()) cancelAnimations();       }|需要进一步测试|
|src/ui/desktop.js:1772|document.addEventListener|"visibilitychange"; () => {       if (document.hidden) cancelAnimations();     }|需要进一步测试|
|src/ui/desktop.js:1775|document.addEventListener|"keydown"; (event) => {       if (event.key === "Escape" && currentView === "settings")         cancelSettingsMotion();     }|需要进一步测试|
|src/ui/desktop.js:1798|$("#settlementHistoryContainer").addEventListener|"toggle"; (event) => {         const details = event.target;         if (details.tagName !== "DETAILS") return;         if (!details.open) {           for (const a of animations)            ; true|需要进一步测试|
|src/ui/desktop.js:1822|t.addEventListener|"scroll"; updateArrows; { passive: true }|需要进一步测试|
|src/ui/desktop.js:1823|t.addEventListener|"wheel"; (e) => {         if (           t.scrollWidth <= t.clientWidth + 2 ／／           Math.abs(e.deltaX) > Math.abs(e.deltaY) ／／           e.ctrlKey         )           return;         c; { passive: false }|需要进一步测试|
|src/ui/desktop.js:1929|window.addEventListener|"DOMContentLoaded"; DesktopUI.init; { once: true }|需要进一步测试|
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
|src/ui/battle-grid.js:169|requestAnimationFrame|() =>       requestAnimationFrame(() =>         moved.forEach((card) => {           card.style.setProperty(             "transition",             transform ${V213_CARD_REORDER_MS}|需要进一步测试|
|src/ui/battle-grid.js:170|requestAnimationFrame|() =>         moved.forEach((card) => {           card.style.setProperty(             "transition",             transform ${V213_CARD_REORDER_MS}ms cubic-bezier(.2,.8,.2,1),box-sh|需要进一步测试|
|src/ui/battle-grid.js:179|setTimeout|() => {             /* 在“0 位移”状态下无动画清理内联 transform，避免清理动作被识别成第二段动画。 */             card.style.setProperty("transition", "none", "important");             card.style.removeProperty(; V213_CARD_REORDER_SETTLE_MS|需要进一步测试|
|src/ui/battle-grid.js:184|requestAnimationFrame|() =>               card.style.removeProperty("transition")|需要进一步测试|
|src/ui/render.js:7|clearTimeout|attackRenderTimerV21713|需要进一步测试|
|src/ui/render.js:8|setTimeout|() => {       attackRenderTimerV21713 = null;       attackRenderFlushingV21713 = true;       try {         refreshPages();       } finally {         pendingRenderArgsV21713 = null;; ATTACK_REORDER_DELAY_V21713|需要进一步测试|
|src/ui/render.js:40|setTimeout|() => {         pendingRenderGridV21726 = false;         // Match the original FLIP callback: don't restart the outer score phase.         refreshBattleGrid();       }; 810|需要进一步测试|

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
|src/style/00.css:1126|/* ================= SPA 五页面视图架构 v3 ================= */   .view|需要进一步测试|
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
|src/style/02.css:73|body.modern-flat-v217:has(.modal-overlay.active),body.modern-flat-v217:has(.score-modal-backdrop.active), body.modern-flat-v217:has(.item-modal-backdrop.active),body.modern-flat-v217:has(.classroom-backdrop.active), body.modern-flat-v217:has(.about-backdrop.active),body.modern-flat-v217:has(.member-search-backdrop.active)|需要进一步测试|
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
|src/style/02.css:166|body.modern-flat-v217 #btnForceEnd:not(.locked-disabled),body.modern-flat-v217 #btnFinalSettlement|需要进一步测试|
|src/style/02.css:169|/* 表单、道具格与菜单 */ body.modern-flat-v217 input,body.modern-flat-v217 textarea,body.modern-flat-v217 select|需要进一步测试|
|src/style/02.css:174|body.modern-flat-v217 input:focus,body.modern-flat-v217 textarea:focus,body.modern-flat-v217 select:focus|需要进一步测试|
|src/style/02.css:177|body.modern-flat-v217 .item-slot,body.modern-flat-v217 .item-big, body.modern-flat-v217 .item-stat,body.modern-flat-v217 .item-members, body.modern-flat-v217 .picker-target,body.modern-flat-v217 .hand-rewards, body.modern-flat-v217 .item-draw-card, body.modern-flat-v217 .icon-custom-card,body.modern-flat-v217 .wmp-item|需要进一步测试|
|src/style/02.css:184|body.modern-flat-v217 .queue-main-slot,body.modern-flat-v217 .queue-secondary-slot|需要进一步测试|
|src/style/02.css:185|body.modern-flat-v217 #v2ItemEncyclopedia .ency-card|需要进一步测试|
|src/style/02.css:186|body.modern-flat-v217 .ency-v213-icon-disc|需要进一步测试|
|src/style/02.css:187|body.modern-flat-v217 .hand-item-draw-stage|需要进一步测试|
|src/style/02.css:188|body.modern-flat-v217 .hand-item-capsule|需要进一步测试|
|src/style/02.css:189|body.modern-flat-v217 .v213-number|需要进一步测试|
|src/style/02.css:190|body.modern-flat-v217 .v213-name,body.modern-flat-v217 .dashboard-card-title, body.modern-flat-v217 .welcome-card-title,body.modern-flat-v217 .setting-section-title|需要进一步测试|
|src/style/02.css:192|body.modern-flat-v217 .v213-name-sub,body.modern-flat-v217 .fullview-sub, body.modern-flat-v217 .metric-label|需要进一步测试|
|src/style/02.css:194|/* 排名和图表 */ body.modern-flat-v217 .podium-col|需要进一步测试|
|src/style/02.css:197|body.modern-flat-v217 .podium-col::before,body.modern-flat-v217 .quick-batch-bar::before|需要进一步测试|
|src/style/02.css:198|body.modern-flat-v217 .podium-col.rank-1|需要进一步测试|
|src/style/02.css:199|body.modern-flat-v217 .podium-col.rank-2|需要进一步测试|
|src/style/02.css:200|body.modern-flat-v217 .podium-col.rank-3|需要进一步测试|
|src/style/02.css:201|body.modern-flat-v217 .chart-track|需要进一步测试|
|src/style/02.css:202|body.modern-flat-v217 .chart-bar|需要进一步测试|
|src/style/02.css:203|body.modern-flat-v217 .welcome-clock|需要进一步测试|
|src/style/02.css:204|/* 程序确认弹窗：替换最后一处 Vista 标题栏与警告球 */ body.modern-flat-v217 .program-confirm-overlay|需要进一步测试|
|src/style/02.css:207|body.modern-flat-v217 .program-confirm-window|需要进一步测试|
|src/style/02.css:208|body.modern-flat-v217 .program-confirm-titlebar|需要进一步测试|
|src/style/02.css:209|body.modern-flat-v217 .program-confirm-icon|需要进一步测试|
|src/style/02.css:210|body.modern-flat-v217 .program-confirm-text|需要进一步测试|
|src/style/02.css:211|body.modern-flat-v217 .program-confirm-actions|需要进一步测试|
|src/style/02.css:212|body.modern-flat-v217 .program-confirm-actions button|需要进一步测试|
|src/style/02.css:213|/* 设置开关：纯色轨道和滑块 */ body.modern-flat-v217 .v292-switch-track|需要进一步测试|
|src/style/02.css:216|body.modern-flat-v217 .v292-switch-knob|需要进一步测试|
|src/style/02.css:217|body.modern-flat-v217 .v292-switch input:checked+.v292-switch-track|需要进一步测试|
|src/style/02.css:218|/* V2.16 欢迎页布局迁移，不再依赖 legacy 主题类 */ body.modern-flat-v217 .battle-main-v216|需要进一步测试|
|src/style/02.css:221|body.modern-flat-v217 .battle-main-v216>.top-dashboard-grid|需要进一步测试|
|src/style/02.css:222|body.modern-flat-v217 .welcome-card-title-row-v216|需要进一步测试|
|src/style/02.css:223|body.modern-flat-v217 .welcome-stat-grid-v216>div,body.modern-flat-v217 .welcome-extra-metrics-v216 .metric-box|需要进一步测试|
|src/style/02.css:224|body.modern-flat-v217 .welcome-extra-metrics-v216|需要进一步测试|
|src/style/02.css:225|body.modern-flat-v217 .welcome-chart-wrapper-v216|需要进一步测试|
|src/style/02.css:226|/* 常驻 UI 禁止材质效果；功能性道具动画类不在此清单中 */ body.modern-flat-v217 .status-badge,body.modern-flat-v217 .metric-box, body.modern-flat-v217 .wmp-tag,body.modern-flat-v217 .row-score, body.modern-flat-v217 .welcome-modal-btn|需要进一步测试|
|src/style/02.css:231|body.modern-flat-v217 .item-use-banner-v216|需要进一步测试|
|src/style/02.css:232|body.modern-flat-v217 .audio-hint-bar|需要进一步测试|
|src/style/02.css:233|/* 道具图片尺寸由使用组件决定，原始 PNG 永远不能撑开页面。 */ .item-slot img|需要进一步测试|
|src/style/02.css:236|.item-big-icon img|需要进一步测试|
|src/style/02.css:237|.attack-hit-badge-v2116 span|需要进一步测试|
|src/style/02.css:238|.attack-hit-badge-v2116 span img|需要进一步测试|
|src/style/02.css:239|.card-fx-badge .cfi|需要进一步测试|
|src/style/02.css:240|.card-fx-badge .cfi img|需要进一步测试|
|src/style/02.css:241|.item-use-banner-v216|需要进一步测试|
|src/style/02.css:242|.item-use-banner-v216 .iub-icon|需要进一步测试|
|src/style/02.css:243|.item-use-banner-v216 .iub-icon img|需要进一步测试|
|src/style/02.css:244|.item-use-banner-v216 .iub-main|需要进一步测试|
|src/style/02.css:245|.item-use-banner-v216 .iub-sub|需要进一步测试|
|src/style/02.css:247|0%|需要进一步测试|
|src/style/02.css:247|12%|需要进一步测试|
|src/style/02.css:247|76%|需要进一步测试|
|src/style/02.css:247|100%|需要进一步测试|
|src/style/02.css:247|/* 小组详情内嵌编辑。 */ .group-detail-form|需要进一步测试|
|src/style/02.css:250|.group-detail-section|需要进一步测试|
|src/style/02.css:251|.group-detail-section h4|需要进一步测试|
|src/style/02.css:252|.group-detail-fields|需要进一步测试|
|src/style/02.css:253|.group-detail-field|需要进一步测试|
|src/style/02.css:254|.group-detail-field label|需要进一步测试|
|src/style/02.css:254|.group-detail-field input,.group-detail-field textarea|需要进一步测试|
|src/style/02.css:255|.group-detail-field textarea|需要进一步测试|
|src/style/02.css:256|.group-color-control|需要进一步测试|
|src/style/02.css:257|.group-color-control input[type="color"]|需要进一步测试|
|src/style/02.css:257|.group-color-preview|需要进一步测试|
|src/style/02.css:258|.group-detail-actions|需要进一步测试|
|src/style/02.css:259|.group-detail-lock|需要进一步测试|
|src/style/02.css:260|.group-detail-danger|需要进一步测试|
|src/style/02.css:261|.group-detail-danger p|需要进一步测试|
|src/style/02.css:261|@media(max-width:1050px)|需要进一步测试|
|src/style/02.css:263|/* Dock layout has one responsive owner. Narrow windows keep all actions reachable. */ body.modern-flat-v217|需要进一步测试|
|src/style/02.css:265|body.modern-flat-v217 button:focus-visible, body.modern-flat-v217 input:focus-visible, body.modern-flat-v217 textarea:focus-visible|需要进一步测试|
|src/style/02.css:271|body.modern-flat-v217 *,body.modern-flat-v217 *::before,body.modern-flat-v217 *::after|需要进一步测试|
|src/style/02.css:271|.classroom-save-warning|需要进一步测试|
|src/style/02.css:273|.classroom-save-warning[hidden]|需要进一步测试|
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
|src/style/15.css:52|body.modern-flat-v217 #btnForceEnd:not(.locked-disabled):hover, body.modern-flat-v217 #btnFinalSettlement:not(:disabled):hover|需要进一步测试|
|src/style/15.css:54|body.modern-flat-v217 button:focus-visible, body.modern-flat-v217 input:focus-visible, body.modern-flat-v217 textarea:focus-visible, body.modern-flat-v217 select:focus-visible|需要进一步测试|
|src/style/15.css:61|body.modern-flat-v217 button:disabled, body.modern-flat-v217 .btn:disabled, body.modern-flat-v217 .locked-disabled, body.modern-flat-v217 .round-disabled|需要进一步测试|
|src/style/15.css:71|/* 欢迎弹窗与普通工作窗口共用扁平表面。 */ body.modern-flat-v217 .welcome-modal-card|需要进一步测试|
|src/style/15.css:79|body.modern-flat-v217 .welcome-modal-title|需要进一步测试|
|src/style/15.css:80|body.modern-flat-v217 .welcome-modal-sub, body.modern-flat-v217 .welcome-modal-hint|需要进一步测试|
|src/style/15.css:82|body.modern-flat-v217 .wmp-item|需要进一步测试|
|src/style/15.css:83|body.modern-flat-v217 .welcome-modal-btn|需要进一步测试|
|src/style/15.css:84|/* 关于窗口：程序信息、指南与百科使用完全相同的标题和内容骨架。 */ body.modern-flat-v217 .about-window|需要进一步测试|
|src/style/15.css:92|body.modern-flat-v217 .about-side|需要进一步测试|
|src/style/15.css:93|body.modern-flat-v217 .about-side button|需要进一步测试|
|src/style/15.css:99|body.modern-flat-v217 .about-side button:hover|需要进一步测试|
|src/style/15.css:100|body.modern-flat-v217 .about-side button.active|需要进一步测试|
|src/style/15.css:101|body.modern-flat-v217 .about-main|需要进一步测试|
|src/style/15.css:109|body.modern-flat-v217 .v214-about-head, body.modern-flat-v217 .v2170-ency-head|需要进一步测试|
|src/style/15.css:117|body.modern-flat-v217 .v214-about-head h2, body.modern-flat-v217 .v2170-ency-head h2|需要进一步测试|
|src/style/15.css:119|body.modern-flat-v217 .about-main .guide-block|需要进一步测试|
|src/style/15.css:128|/* 小组控制台只有正文滚动；标题与左侧标签始终稳定。 */ body.modern-flat-v217 .item-window|需要进一步测试|
|src/style/15.css:138|body.modern-flat-v217 .item-side|需要进一步测试|
|src/style/15.css:139|body.modern-flat-v217 .item-main|需要进一步测试|
|src/style/15.css:148|body.modern-flat-v217 .item-main-head|需要进一步测试|
|src/style/15.css:157|body.modern-flat-v217 #itemWindowBody|需要进一步测试|
|src/style/15.css:169|body.modern-flat-v217 .group-detail-form|需要进一步测试|
|src/style/15.css:170|/* 设置页：标签固定，当前面板独立滚动。 */ body.modern-flat-v217:has(#view-settings.active)|需要进一步测试|
|src/style/15.css:178|body.modern-flat-v217 #view-settings.active|需要进一步测试|
|src/style/15.css:185|body.modern-flat-v217 #view-settings .settings-scroll|需要进一步测试|
|src/style/15.css:193|/* 设置组件的文字、分组和表单样式统一归 ui/desktop.css。 */  /* 道具管理固定为宽卡；禁止图标和按钮把中文说明压成单字列。 */ body.modern-flat-v217 #settingsV26_items .item-ency-grid|需要进一步测试|
|src/style/15.css:203|body.modern-flat-v217 #settingsV26_items .ency-v213-card|需要进一步测试|
|src/style/15.css:217|body.modern-flat-v217 #settingsV26_items .ency-v213-info|需要进一步测试|
|src/style/15.css:218|body.modern-flat-v217 #settingsV26_items .ency-v213-name, body.modern-flat-v217 #settingsV26_items .ency-v213-desc|需要进一步测试|
|src/style/15.css:225|body.modern-flat-v217 #settingsV26_items .ency-v213-name|需要进一步测试|
|src/style/15.css:226|body.modern-flat-v217 #settingsV26_items .ency-v213-desc|需要进一步测试|
|src/style/15.css:227|body.modern-flat-v217 #settingsV26_items .ency-v213-actions|需要进一步测试|
|src/style/15.css:236|/* 自定义按钮图标：宽屏多列，中屏双列，窄屏单列。 */ body.modern-flat-v217 #view-settings .icon-custom-grid|需要进一步测试|
|src/style/15.css:244|body.modern-flat-v217 #view-settings .icon-custom-card|需要进一步测试|
|src/style/15.css:252|body.modern-flat-v217 #view-settings .icon-custom-card>div:nth-child(2)|需要进一步测试|
|src/style/15.css:253|/* 手动举手的小组选择器复用“预选小组”的紧凑胶囊语言。 */ body.modern-flat-v217 #handGroupGrid.hand-grid|需要进一步测试|
|src/style/15.css:261|body.modern-flat-v217 #handGroupGrid .hand-group|需要进一步测试|
|src/style/15.css:279|body.modern-flat-v217 #handGroupGrid .hand-group small|需要进一步测试|
|src/style/15.css:280|body.modern-flat-v217 #handGroupGrid .hand-group:not(.selected):hover|需要进一步测试|
|src/style/15.css:281|body.modern-flat-v217 #handGroupGrid .hand-group.selected|需要进一步测试|
|src/style/15.css:286|body.modern-flat-v217 #handGroupGrid .hand-group.selected small|需要进一步测试|
|src/style/15.css:287|/* 档案页承接原点名窗口中的课堂累计统计。 */ body.modern-flat-v217 .archive-class-stats|需要进一步测试|
|src/style/15.css:290|body.modern-flat-v217 .archive-stats-head|需要进一步测试|
|src/style/15.css:291|body.modern-flat-v217 .archive-stats-head h3|需要进一步测试|
|src/style/15.css:292|body.modern-flat-v217 .archive-stats-head span|需要进一步测试|
|src/style/15.css:293|body.modern-flat-v217 .archive-stats-grid|需要进一步测试|
|src/style/15.css:294|body.modern-flat-v217 .archive-stat-card|需要进一步测试|
|src/style/15.css:295|body.modern-flat-v217 .archive-stat-card b|需要进一步测试|
|src/style/15.css:296|body.modern-flat-v217 .archive-stat-card b small|需要进一步测试|
|src/style/15.css:297|body.modern-flat-v217 .archive-stat-card span|需要进一步测试|
|src/style/15.css:300|body.modern-flat-v217 #view-settings .icon-custom-grid|需要进一步测试|
|src/style/15.css:303|body.modern-flat-v217 .welcome-modal-card|需要进一步测试|
|src/style/15.css:304|body.modern-flat-v217 .about-window,   body.modern-flat-v217 .item-window|需要进一步测试|
|src/style/15.css:306|body.modern-flat-v217 .about-side,   body.modern-flat-v217 .item-side|需要进一步测试|
|src/style/15.css:308|body.modern-flat-v217 .about-side button,   body.modern-flat-v217 .item-side button|需要进一步测试|
|src/style/15.css:310|body.modern-flat-v217 .item-side-title|需要进一步测试|
|src/style/15.css:311|body.modern-flat-v217 .item-main|需要进一步测试|
|src/style/15.css:312|body.modern-flat-v217 #itemWindowBody|需要进一步测试|
|src/style/15.css:313|body.modern-flat-v217 .about-main|需要进一步测试|
|src/style/15.css:314|body.modern-flat-v217 #view-settings .icon-custom-grid|需要进一步测试|
|src/style/15.css:315|body.modern-flat-v217 #settingsV26_items .ency-v213-card|需要进一步测试|
|src/style/15.css:316|body.modern-flat-v217 #settingsV26_items .ency-v213-actions|需要进一步测试|
|src/style/15.css:317|body.modern-flat-v217 #settingsV26_data .setting-item|需要进一步测试|
|src/style/15.css:318|body.modern-flat-v217 #settingsV26_data .setting-item>div|需要进一步测试|
|src/style/15.css:319|body.modern-flat-v217 .archive-stats-grid|需要进一步测试|
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
|src/style/20.css:27|.qp-row-v218>span:first-child|需要进一步测试|
|src/style/20.css:28|.qp-input-v218|需要进一步测试|
|src/style/20.css:29|.qp-chip-v218|需要进一步测试|
|src/style/20.css:33|.qp-chip-v218.active|需要进一步测试|
|src/style/20.css:34|.qp-letter-v218|需要进一步测试|
|src/style/20.css:35|.quick-person-list-v218|需要进一步测试|
|src/style/20.css:39|.quick-person-entry-v218|需要进一步测试|
|src/style/20.css:43|.quick-person-entry-v218.selected|需要进一步测试|
|src/style/20.css:44|.student-no-v218|需要进一步测试|
|src/style/20.css:49|.student-name-v218|需要进一步测试|
|src/style/20.css:50|.student-no-inline-v218|需要进一步测试|
|src/style/20.css:51|.qp-group-v218|需要进一步测试|
|src/style/20.css:52|.quick-person-actions-v218|需要进一步测试|
|src/style/20.css:56|.qp-score-actions-v218|需要进一步测试|
|src/style/20.css:57|.qp-selected-count-v218|需要进一步测试|
|src/style/20.css:58|/* 手动举手使用道具后的中央结算卡 */ .hand-effect-overlay-v218|需要进一步测试|
|src/style/20.css:64|.hand-effect-overlay-v218.active|需要进一步测试|
|src/style/20.css:65|.hand-effect-card-v218|需要进一步测试|
|src/style/20.css:71|from|重复实现（仅语法；层叠需进一步测试）|
|src/style/20.css:71|to|重复实现（仅语法；层叠需进一步测试）|
|src/style/20.css:71|.hand-effect-icon-v218|需要进一步测试|
|src/style/20.css:72|.hand-effect-name-v218|需要进一步测试|
|src/style/20.css:73|.hand-effect-lines-v218|需要进一步测试|
|src/style/20.css:74|.hand-effect-line-v218|需要进一步测试|
|src/style/20.css:75|.hand-effect-line-v218.pos|需要进一步测试|
|src/style/20.css:76|.hand-effect-line-v218.neg|需要进一步测试|
|src/style/20.css:76|.hand-effect-line-v218.neutral|需要进一步测试|
|src/style/20.css:76|/* 抽奖结束后不再显示“查看道具” */ #handRewardBox button[onclick="handUseNewItem()"]|需要进一步测试|
|src/style/20.css:79|/* 百科技巧块 */ .v218-ency-tip|需要进一步测试|
|src/style/20.css:82|.v218-ency-tip b|需要进一步测试|
|src/style/20.css:83|.v218-ency-general|需要进一步测试|
|src/style/20.css:87|.quick-person-card-v218|需要进一步测试|
|src/style/20.css:88|.quick-person-list-v218|需要进一步测试|
|src/style/20.css:89|.quick-person-actions-v218|需要进一步测试|
|src/style/21.css:1|/* V2.18.2 小组信息道具区同步新版规则 */ .v2182-item-rule|需要进一步测试|
|src/style/22.css:1|.dock-humor-tip-v2185|需要进一步测试|
|src/style/22.css:7|.dock-humor-tip-v2185.show|需要进一步测试|
|src/style/22.css:8|.dock-humor-tip-v2185 b|需要进一步测试|
|src/style/22.css:9|.dock-humor-tip-v2185 span|需要进一步测试|
|src/style/23.css:1|.copy-kicker-v2187|需要进一步测试|
|src/ui/application-surfaces.css:1|/* Shared application chrome and function surfaces. Geometry remains in legacy layout. */ :root|需要进一步测试|
|src/ui/application-surfaces.css:12|.header-banner.app-topnav|需要进一步测试|
|src/ui/application-surfaces.css:16|.app-topnav .header-title|需要进一步测试|
|src/ui/application-surfaces.css:24|.app-topnav .nav-tab|需要进一步测试|
|src/ui/application-surfaces.css:37|.app-topnav .nav-tab.active::after|需要进一步测试|
|src/ui/application-surfaces.css:46|.app-topnav .header-stats|需要进一步测试|
|src/ui/application-surfaces.css:50|.bottom-dock|需要进一步测试|
|src/ui/application-surfaces.css:57|.ui-dock-answers|需要进一步测试|
|src/ui/application-surfaces.css:67|.bottom-dock .status-badge|需要进一步测试|
|src/ui/application-surfaces.css:71|.bottom-dock .dock-right|需要进一步测试|
|src/ui/application-surfaces.css:75|.bottom-dock .ui-dock-menu summary|需要进一步测试|
|src/ui/application-surfaces.css:81|.ui-dock-menu-body|需要进一步测试|
|src/ui/application-surfaces.css:86|/* Card paint only: no dimensions, padding, line-height, transforms, or font-size. */ #groupList|需要进一步测试|
|src/ui/application-surfaces.css:95|#groupList .name-input|需要进一步测试|
|src/ui/application-surfaces.css:100|#groupList .row-score|需要进一步测试|
|src/ui/application-surfaces.css:105|#groupList .member-count-tag|需要进一步测试|
|src/ui/application-surfaces.css:110|#groupList .item-slot|需要进一步测试|
|src/ui/application-surfaces.css:113|#groupList .more-btn|需要进一步测试|
|src/ui/application-surfaces.css:116|#groupList .opt-btn.active:not(.correct):not(.wrong)|需要进一步测试|
|src/ui/application-surfaces.css:120|#groupList .allin-toggle-btn.active|需要进一步测试|
|src/ui/application-surfaces.css:124|/* The same palette, with content-specific structures retained for each window. */ .ui-function-surface, .item-draw-board, .program-confirm-window|需要进一步测试|
|src/ui/application-surfaces.css:136|.ui-function-surface   :is(     input:not([type="checkbox"]):not([type="range"]):not([type="color"]),     textarea,     select   )|需要进一步测试|
|src/ui/application-surfaces.css:146|.ui-function-surface   :is(     h2,     h3,     .score-modal-title,     .member-search-title,     .theme-dialog-title-v21727   )|需要进一步测试|
|src/ui/application-surfaces.css:156|.ui-function-surface > :is(h3, .score-modal-title, .member-search-title)|需要进一步测试|
|src/ui/application-surfaces.css:160|.ui-function-surface   :is(.item-main-head, .classroom-head, .quick-person-head-v218)|需要进一步测试|
|src/ui/application-surfaces.css:165|.ui-function-surface :is(.classroom-head, .quick-person-head-v218) .btn|需要进一步测试|
|src/ui/application-surfaces.css:169|.ui-function-surface :is(.item-side-title, .about-side-title)|需要进一步测试|
|src/ui/application-surfaces.css:173|.ui-function-surface :is(.item-tab, .about-side button)|需要进一步测试|
|src/ui/application-surfaces.css:178|.ui-function-surface .picker-left-v2|需要进一步测试|
|src/ui/application-surfaces.css:181|.ui-function-surface .picker-right-v2|需要进一步测试|
|src/ui/application-surfaces.css:184|.ui-function-surface .picker-center-v2|需要进一步测试|
|src/ui/application-surfaces.css:187|.ui-function-surface .slot-reel-frame|需要进一步测试|
|src/ui/application-surfaces.css:192|.ui-function-surface .queue-item-card|需要进一步测试|
|src/ui/application-surfaces.css:195|.ui-function-surface .queue-role-badge|需要进一步测试|
|src/ui/application-surfaces.css:198|.ui-function-surface .theme-dialog-icon-v21727|需要进一步测试|
|src/ui/application-surfaces.css:202|.theme-dialog-card-v21727, .quick-person-card-v218, .grand-card|需要进一步测试|
|src/ui/application-surfaces.css:209|.theme-dialog-v21727, .quick-person-backdrop-v218|需要进一步测试|
|src/ui/application-surfaces.css:213|/* Collection pages share the welcome hero, not a generic white fullview box. */ body[data-current-view="history"], body[data-current-view="archives"]|需要进一步测试|
|src/ui/application-surfaces.css:220|#view-history, #view-archives|需要进一步测试|
|src/ui/application-surfaces.css:228|.ui-collection-header|需要进一步测试|
|src/ui/application-surfaces.css:244|.ui-collection-header h2|需要进一步测试|
|src/ui/application-surfaces.css:249|.ui-collection-header h2 small|需要进一步测试|
|src/ui/application-surfaces.css:255|.ui-collection-header .ui-collection-sub, .ui-collection-header .ui-record-count|需要进一步测试|
|src/ui/application-surfaces.css:262|.ui-collection-body|需要进一步测试|
|src/ui/application-surfaces.css:270|#view-history .ui-timeline|需要进一步测试|
|src/ui/application-surfaces.css:276|.ui-history|需要进一步测试|
|src/ui/application-surfaces.css:280|.ui-history::before|需要进一步测试|
|src/ui/application-surfaces.css:283|.ui-history summary > div|需要进一步测试|
|src/ui/application-surfaces.css:286|.ui-history summary > .ui-chip|需要进一步测试|
|src/ui/application-surfaces.css:289|.ui-history::after|需要进一步测试|
|src/ui/application-surfaces.css:298|.ui-history details[open]|需要进一步测试|
|src/ui/application-surfaces.css:301|.ui-archive-card|需要进一步测试|
|src/ui/application-surfaces.css:305|.ui-archive-summary > div|需要进一步测试|
|src/ui/application-surfaces.css:309|.ui-archive-emblem|需要进一步测试|
|src/ui/application-surfaces.css:319|.ui-archive-emblem .ui-icon|需要进一步测试|
|src/ui/application-surfaces.css:323|#view-archives .ui-overview .ui-panel|需要进一步测试|
|src/ui/application-surfaces.css:328|#view-archives .ui-overview strong|需要进一步测试|
|src/ui/application-surfaces.css:332|.ui-podium > div:first-child|需要进一步测试|
|src/ui/application-surfaces.css:337|.ui-podium > div:nth-child(2)|需要进一步测试|
|src/ui/application-surfaces.css:341|.ui-podium > div:nth-child(3)|需要进一步测试|
|src/ui/application-surfaces.css:345|.ui-collection-body .ui-empty|需要进一步测试|
|src/ui/application-surfaces.css:349|body.modern-flat-v217|需要进一步测试|
|src/ui/application-surfaces.css:353|.ui-function-surface .classroom-head|需要进一步测试|
|src/ui/application-surfaces.css:356|.ui-function-surface .quick-person-head-v218 b, .ui-function-surface .item-main-head h3|需要进一步测试|
|src/ui/application-surfaces.css:360|.ui-function-surface :is(.v214-about-head, .v2170-ency-head)|需要进一步测试|
|src/ui/application-surfaces.css:367|/* Archive discovery and empty-state actions use the same content rhythm as home. */ .ui-archive-filter|需要进一步测试|
|src/ui/application-surfaces.css:381|.ui-archive-search|需要进一步测试|
|src/ui/application-surfaces.css:392|.ui-archive-search:focus-within|需要进一步测试|
|src/ui/application-surfaces.css:396|.ui-archive-search input|需要进一步测试|
|src/ui/application-surfaces.css:408|.ui-archive-search input::placeholder|需要进一步测试|
|src/ui/application-surfaces.css:411|.ui-archive-sort|需要进一步测试|
|src/ui/application-surfaces.css:416|.ui-archive-sort label|需要进一步测试|
|src/ui/application-surfaces.css:422|.ui-archive-sort select|需要进一步测试|
|src/ui/application-surfaces.css:434|.ui-archive-filter .ui-record-count|需要进一步测试|
|src/ui/application-surfaces.css:441|#view-archives .ui-empty|需要进一步测试|
|src/ui/application-surfaces.css:444|#view-archives .ui-empty h3|需要进一步测试|
|src/ui/application-surfaces.css:447|#view-archives .ui-empty p|需要进一步测试|
|src/ui/application-surfaces.css:452|#view-archives .ui-empty .btn|需要进一步测试|
|src/ui/application-surfaces.css:457|/* One motion owner per window; shared WAAPI lifecycle replaces old root entrances. */ .ui-function-surface|需要进一步测试|
|src/ui/application-surfaces.css:462|.ui-function-surface button[hidden]|需要进一步测试|
|src/ui/application-surfaces.css:465|.ui-function-surface .ui-window-close|需要进一步测试|
|src/ui/application-surfaces.css:485|.ui-function-surface .ui-window-close:hover|需要进一步测试|
|src/ui/application-surfaces.css:489|.ui-function-surface > :is(h3, .score-modal-title, .member-search-title), .ui-function-surface .theme-dialog-head-v21727, .ui-function-surface .quick-person-head-v218, .ui-function-surface .classroom-head, .ui-function-surface .v214-about-head, .ui-function-surface .v2170-ency-head|需要进一步测试|
|src/ui/application-surfaces.css:497|.ui-function-surface .picker-right-v2 > b|需要进一步测试|
|src/ui/application-surfaces.css:501|.ui-slot-stage|需要进一步测试|
|src/ui/application-surfaces.css:508|.ui-slot-cabinet|需要进一步测试|
|src/ui/application-surfaces.css:513|.ui-slot-stage .slot-machine-case|需要进一步测试|
|src/ui/application-surfaces.css:525|.ui-slot-stage .slot-reel-frame|需要进一步测试|
|src/ui/application-surfaces.css:532|.ui-slot-stage .slot-reel-text|需要进一步测试|
|src/ui/application-surfaces.css:541|.ui-slot-stage #btnSlotTrigger|需要进一步测试|
|src/ui/application-surfaces.css:561|.ui-slot-stage #btnSlotTrigger::before|需要进一步测试|
|src/ui/application-surfaces.css:573|.ui-slot-stage #btnSlotTrigger::after|需要进一步测试|
|src/ui/application-surfaces.css:586|.ui-slot-stage #btnSlotTrigger.stop::before, .ui-slot-stage #btnSlotTrigger:active::before|需要进一步测试|
|src/ui/application-surfaces.css:590|.ui-slot-stage #btnSlotTrigger.stop::after, .ui-slot-stage #btnSlotTrigger:active::after|需要进一步测试|
|src/ui/application-surfaces.css:594|.ui-slot-stage #btnSlotTrigger:disabled|需要进一步测试|
|src/ui/application-surfaces.css:598|.ui-slot-hint|需要进一步测试|
|src/ui/application-surfaces.css:605|.ui-slot-deceleration|需要进一步测试|
|src/ui/application-surfaces.css:611|.ui-slot-deceleration > span|需要进一步测试|
|src/ui/application-surfaces.css:623|#pickerModal[data-picker-reveal="pending"] .slot-result-panel, #pickerModal[data-picker-reveal="pending"] .picker-target, #pickerModal[data-picker-reveal="pending"] #pickerInfoBox|需要进一步测试|
|src/ui/application-surfaces.css:628|/* Bound the cabinet and all three scroll panes to the scaled desktop viewport. */ #pickerModal .picker-layout-v2|需要进一步测试|
|src/ui/application-surfaces.css:635|#pickerModal :is(.picker-left-v2, .picker-center-v2, .picker-right-v2)|需要进一步测试|
|src/ui/application-surfaces.css:641|#pickerModal .picker-center-v2|需要进一步测试|
|src/ui/application-surfaces.css:644|#pickerModal .ui-slot-stage|需要进一步测试|
|src/ui/application-surfaces.css:647|/* Incomplete-answer warning is an active legacy dialog, now on the same lifecycle. */ .program-confirm-window|需要进一步测试|
|src/ui/application-surfaces.css:658|.program-confirm-window .program-confirm-titlebar|需要进一步测试|
|src/ui/application-surfaces.css:664|.program-confirm-titlebar::before|需要进一步测试|
|src/ui/application-surfaces.css:673|.program-confirm-window .program-confirm-body|需要进一步测试|
|src/ui/application-surfaces.css:678|.program-confirm-window .program-confirm-icon|需要进一步测试|
|src/ui/application-surfaces.css:683|.program-confirm-window .program-confirm-text|需要进一步测试|
|src/ui/application-surfaces.css:690|.program-confirm-window .program-confirm-actions|需要进一步测试|
|src/ui/application-surfaces.css:695|.theme-dialog-card-v21727 .theme-dialog-head-v21727|需要进一步测试|
|src/ui/application-surfaces.css:699|.theme-dialog-card-v21727 .theme-dialog-title-v21727|需要进一步测试|
|src/ui/application-surfaces.css:703|.theme-dialog-card-v21727 .theme-dialog-body-v21727|需要进一步测试|
|src/ui/application-surfaces.css:707|.theme-dialog-card-v21727 .theme-dialog-actions-v21727|需要进一步测试|
|src/ui/application-surfaces.css:713|#themeDialogV21727[data-ui-notice="danger"] .theme-dialog-icon-v21727|需要进一步测试|
|src/ui/application-surfaces.css:717|.ui-dock-menu[open] .ui-dock-menu-body|需要进一步测试|
|src/ui/application-surfaces.css:723|from|需要进一步测试|
|src/ui/application-surfaces.css:727|to|需要进一步测试|
|src/ui/application-surfaces.css:732|body[data-motion="off"]|需要进一步测试|
|src/ui/application-surfaces.css:737|body[data-system-motion="true"]|需要进一步测试|
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
|src/ui/classroom-feedback.css:7|.cf-score-slots .btn|需要进一步测试|
|src/ui/classroom-feedback.css:14|.cf-slot-editor|需要进一步测试|
|src/ui/classroom-feedback.css:19|.cf-slot-editor label|需要进一步测试|
|src/ui/classroom-feedback.css:26|.cf-slot-editor input|需要进一步测试|
|src/ui/classroom-feedback.css:33|.cf-slot-editor input[aria-invalid="true"]|需要进一步测试|
|src/ui/classroom-feedback.css:37|.cf-settings|需要进一步测试|
|src/ui/classroom-feedback.css:40|.item-score-panel > .cf-score-slots|需要进一步测试|
|src/ui/classroom-feedback.css:43|.hand-rewards > .cf-score-slots|需要进一步测试|
|src/ui/classroom-feedback.css:46|.qp-score-actions-v218 > .cf-score-slots|需要进一步测试|
|src/ui/classroom-feedback.css:49|#classroomShowcase|需要进一步测试|
|src/ui/classroom-feedback.css:63|#classroomShowcase::backdrop|需要进一步测试|
|src/ui/classroom-feedback.css:67|#classroomShowcase .cf-show-surface|需要进一步测试|
|src/ui/classroom-feedback.css:79|#classroomShowcase[data-kind="negative"] .cf-show-surface|需要进一步测试|
|src/ui/classroom-feedback.css:83|#classroomShowcase[data-kind="pick"] .cf-show-surface|需要进一步测试|
|src/ui/classroom-feedback.css:87|.cf-show-copy|需要进一步测试|
|src/ui/classroom-feedback.css:98|#classroomShowcase .cf-show-title|需要进一步测试|
|src/ui/classroom-feedback.css:108|.cf-show-eyebrow|需要进一步测试|
|src/ui/classroom-feedback.css:115|.cf-show-subtitle|需要进一步测试|
|src/ui/classroom-feedback.css:120|.cf-show-value|需要进一步测试|
|src/ui/classroom-feedback.css:128|#classroomShowcase > .ui-cinematic-skip|需要进一步测试|
|src/ui/classroom-feedback.css:134|.cf-show-orbit|需要进一步测试|
|src/ui/classroom-feedback.css:146|.cf-show-orbit::before, .cf-show-orbit::after|需要进一步测试|
|src/ui/classroom-feedback.css:154|.cf-show-orbit::after|需要进一步测试|
|src/ui/classroom-feedback.css:159|.cf-show-particles|需要进一步测试|
|src/ui/classroom-feedback.css:164|.cf-show-particles i|需要进一步测试|
|src/ui/classroom-feedback.css:173|#classroomShowcase[data-effect-style="burst"] .cf-show-particles i|需要进一步测试|
|src/ui/classroom-feedback.css:178|#classroomShowcase[data-effect-style="burst"] .cf-show-orbit|需要进一步测试|
|src/ui/classroom-feedback.css:182|.cf-show-copy|需要进一步测试|
|src/ui/classroom-feedback.css:185|#classroomShowcase.cf-simple .cf-show-orbit|需要进一步测试|
|src/ui/classroom-feedback.css:188|#classroomShowcase.cf-simple .cf-show-copy|需要进一步测试|
|src/ui/classroom-feedback.css:192|from|需要进一步测试|
|src/ui/classroom-feedback.css:196|to|需要进一步测试|
|src/ui/classroom-feedback.css:202|0%|需要进一步测试|
|src/ui/classroom-feedback.css:206|12%|需要进一步测试|
|src/ui/classroom-feedback.css:209|100%|需要进一步测试|
|src/ui/classroom-feedback.css:215|from|需要进一步测试|
|src/ui/classroom-feedback.css:219|to|需要进一步测试|
|src/ui/classroom-feedback.css:225|body[data-system-motion="true"] #classroomShowcase *|需要进一步测试|
|src/ui/classroom-feedback.css:229|/* Candidate audio controls stay secondary to the operation's main settings. */ .cf-audio-choices|需要进一步测试|
|src/ui/classroom-feedback.css:239|.cf-audio-choices details|需要进一步测试|
|src/ui/classroom-feedback.css:242|.cf-audio-choice|需要进一步测试|
|src/ui/classroom-feedback.css:249|.cf-audio-choice > span|需要进一步测试|
|src/ui/classroom-feedback.css:253|.sound-row:has(> .cf-audio-choices)|需要进一步测试|
|src/ui/desktop.css:1|/* Owned desktop components; battle grid/card geometry remains owned by legacy layout. */ :root|需要进一步测试|
|src/ui/desktop.css:30|.ui-icon|需要进一步测试|
|src/ui/desktop.css:39|.ui-page|需要进一步测试|
|src/ui/desktop.css:45|.ui-page-head|需要进一步测试|
|src/ui/desktop.css:52|.ui-eyebrow|需要进一步测试|
|src/ui/desktop.css:60|.ui-page h1|需要进一步测试|
|src/ui/desktop.css:65|.ui-page h2|需要进一步测试|
|src/ui/desktop.css:69|.ui-page h3|需要进一步测试|
|src/ui/desktop.css:73|.ui-muted|需要进一步测试|
|src/ui/desktop.css:78|.ui-page p|需要进一步测试|
|src/ui/desktop.css:81|.ui-panel|需要进一步测试|
|src/ui/desktop.css:89|.ui-clock|需要进一步测试|
|src/ui/desktop.css:95|.ui-welcome-head|需要进一步测试|
|src/ui/desktop.css:102|.ui-welcome-head h1|需要进一步测试|
|src/ui/desktop.css:105|.ui-welcome-time|需要进一步测试|
|src/ui/desktop.css:108|.ui-welcome-time .welcome-enter-btn|需要进一步测试|
|src/ui/desktop.css:113|.ui-section-title|需要进一步测试|
|src/ui/desktop.css:120|.ui-scroll-buttons|需要进一步测试|
|src/ui/desktop.css:124|.ui-scroll-buttons button|需要进一步测试|
|src/ui/desktop.css:133|.ui-scroll-buttons button:disabled|需要进一步测试|
|src/ui/desktop.css:137|.ui-group-track|需要进一步测试|
|src/ui/desktop.css:148|.ui-group-track.ui-few|需要进一步测试|
|src/ui/desktop.css:151|:is(.ui-group-card, .ui-group-repeat)|需要进一步测试|
|src/ui/desktop.css:167|:is(.ui-group-card, .ui-group-repeat):hover|需要进一步测试|
|src/ui/desktop.css:171|:is(.ui-group-card, .ui-group-repeat) .ui-group-title|需要进一步测试|
|src/ui/desktop.css:179|.ui-group-score|需要进一步测试|
|src/ui/desktop.css:186|:is(.ui-group-card, .ui-group-repeat) footer|需要进一步测试|
|src/ui/desktop.css:195|:is(.ui-group-card, .ui-group-repeat) footer img|需要进一步测试|
|src/ui/desktop.css:200|.ui-chip|需要进一步测试|
|src/ui/desktop.css:211|.ui-daily-grid|需要进一步测试|
|src/ui/desktop.css:217|.ui-daily-grid .ui-panel|需要进一步测试|
|src/ui/desktop.css:222|.ui-daily-grid h3|需要进一步测试|
|src/ui/desktop.css:226|.ui-daily-grid details|需要进一步测试|
|src/ui/desktop.css:231|.ui-daily-grid summary|需要进一步测试|
|src/ui/desktop.css:236|.ui-source|需要进一步测试|
|src/ui/desktop.css:242|.ui-item-tip-icon|需要进一步测试|
|src/ui/desktop.css:248|.ui-item-tip-icon img|需要进一步测试|
|src/ui/desktop.css:253|.ui-quiz-options|需要进一步测试|
|src/ui/desktop.css:257|.ui-quiz-options button|需要进一步测试|
|src/ui/desktop.css:266|.ui-quiz-options button[aria-pressed="true"]|需要进一步测试|
|src/ui/desktop.css:270|.ui-quiz-result|需要进一步测试|
|src/ui/desktop.css:276|.ui-overview|需要进一步测试|
|src/ui/desktop.css:282|.ui-overview strong|需要进一步测试|
|src/ui/desktop.css:288|.ui-toolbar|需要进一步测试|
|src/ui/desktop.css:295|.ui-toolbar input|需要进一步测试|
|src/ui/desktop.css:299|.ui-toolbar input, .ui-toolbar select, .ui-settings-body select, .ui-settings-body input[type="number"]|需要进一步测试|
|src/ui/desktop.css:309|.ui-timeline|需要进一步测试|
|src/ui/desktop.css:317|.ui-history|需要进一步测试|
|src/ui/desktop.css:320|.ui-history::before|需要进一步测试|
|src/ui/desktop.css:331|.ui-history[data-kind="danger"]::before|需要进一步测试|
|src/ui/desktop.css:334|.ui-history[data-kind="item"]::before|需要进一步测试|
|src/ui/desktop.css:337|.ui-history summary|需要进一步测试|
|src/ui/desktop.css:345|.ui-history summary h3|需要进一步测试|
|src/ui/desktop.css:349|.ui-history details[open] summary|需要进一步测试|
|src/ui/desktop.css:352|.ui-table-wrap|需要进一步测试|
|src/ui/desktop.css:356|.ui-table|需要进一步测试|
|src/ui/desktop.css:362|.ui-table th, .ui-table td|需要进一步测试|
|src/ui/desktop.css:369|.ui-table th|需要进一步测试|
|src/ui/desktop.css:374|.ui-positive|需要进一步测试|
|src/ui/desktop.css:377|.ui-negative|需要进一步测试|
|src/ui/desktop.css:380|.ui-snapshot-note|需要进一步测试|
|src/ui/desktop.css:388|.ui-empty|需要进一步测试|
|src/ui/desktop.css:395|.ui-empty > .ui-icon|需要进一步测试|
|src/ui/desktop.css:400|.ui-empty p|需要进一步测试|
|src/ui/desktop.css:403|.ui-archive-list|需要进一步测试|
|src/ui/desktop.css:407|.ui-archive-summary|需要进一步测试|
|src/ui/desktop.css:415|.ui-archive-summary h3|需要进一步测试|
|src/ui/desktop.css:419|.ui-podium|需要进一步测试|
|src/ui/desktop.css:426|.ui-podium > div|需要进一步测试|
|src/ui/desktop.css:433|.ui-podium > div:first-child|需要进一步测试|
|src/ui/desktop.css:437|.ui-podium strong|需要进一步测试|
|src/ui/desktop.css:442|.ui-archive-actions|需要进一步测试|
|src/ui/desktop.css:448|.ui-record-count|需要进一步测试|
|src/ui/desktop.css:452|.ui-settings-shell|需要进一步测试|
|src/ui/desktop.css:464|.ui-settings-nav|需要进一步测试|
|src/ui/desktop.css:474|.ui-settings-nav button|需要进一步测试|
|src/ui/desktop.css:487|.ui-settings-nav button[aria-current="true"]|需要进一步测试|
|src/ui/desktop.css:492|.ui-settings-body|需要进一步测试|
|src/ui/desktop.css:498|.ui-settings-category|需要进一步测试|
|src/ui/desktop.css:503|.ui-settings-category[hidden]|需要进一步测试|
|src/ui/desktop.css:506|.ui-settings-title|需要进一步测试|
|src/ui/desktop.css:511|.ui-settings-title h3|需要进一步测试|
|src/ui/desktop.css:516|.ui-settings-row|需要进一步测试|
|src/ui/desktop.css:524|.ui-settings-row label|需要进一步测试|
|src/ui/desktop.css:528|.ui-settings-row input[type="checkbox"]|需要进一步测试|
|src/ui/desktop.css:533|.ui-settings-row select|需要进一步测试|
|src/ui/desktop.css:536|.ui-settings-category .setting-item, .ui-settings-category .setting-row|需要进一步测试|
|src/ui/desktop.css:541|#view-settings|需要进一步测试|
|src/ui/desktop.css:544|.ui-settings-header|需要进一步测试|
|src/ui/desktop.css:557|.ui-settings-eyebrow|需要进一步测试|
|src/ui/desktop.css:565|.ui-settings-header h2|需要进一步测试|
|src/ui/desktop.css:571|.ui-settings-header h2 small|需要进一步测试|
|src/ui/desktop.css:577|.ui-settings-header p|需要进一步测试|
|src/ui/desktop.css:582|.ui-settings-status|需要进一步测试|
|src/ui/desktop.css:593|.ui-settings-status span:first-child|需要进一步测试|
|src/ui/desktop.css:597|.ui-settings-group, .ui-settings-disclosure|需要进一步测试|
|src/ui/desktop.css:605|.ui-settings-group|需要进一步测试|
|src/ui/desktop.css:608|.ui-settings-group h4|需要进一步测试|
|src/ui/desktop.css:613|.ui-settings-group > .ui-muted|需要进一步测试|
|src/ui/desktop.css:618|.ui-settings-disclosure > summary|需要进一步测试|
|src/ui/desktop.css:627|.ui-settings-disclosure > summary::-webkit-details-marker|需要进一步测试|
|src/ui/desktop.css:630|.ui-settings-disclosure > summary b|需要进一步测试|
|src/ui/desktop.css:635|.ui-settings-disclosure > summary span|需要进一步测试|
|src/ui/desktop.css:641|.ui-settings-disclosure > summary::after|需要进一步测试|
|src/ui/desktop.css:652|.ui-settings-disclosure[open] > summary::after|需要进一步测试|
|src/ui/desktop.css:655|.ui-settings-disclosure > summary:hover|需要进一步测试|
|src/ui/desktop.css:658|.ui-settings-disclosure > summary:focus-visible|需要进一步测试|
|src/ui/desktop.css:662|.ui-settings-detail-body|需要进一步测试|
|src/ui/desktop.css:665|.ui-settings-detail-body > .ui-muted|需要进一步测试|
|src/ui/desktop.css:669|.ui-settings-category .setting-item, .ui-settings-category .sound-row|需要进一步测试|
|src/ui/desktop.css:676|.ui-settings-category .setting-label, .ui-settings-category .sound-name|需要进一步测试|
|src/ui/desktop.css:681|.ui-settings-category .sound-tag|需要进一步测试|
|src/ui/desktop.css:685|.ui-settings-category input[type="range"]|需要进一步测试|
|src/ui/desktop.css:688|.ui-settings-category .ui-danger-zone|需要进一步测试|
|src/ui/desktop.css:692|.ui-settings-category .ui-danger-zone > summary b|需要进一步测试|
|src/ui/desktop.css:695|.ui-settings-category .ui-snapshot-note|需要进一步测试|
|src/ui/desktop.css:700|#uiSettingsLock .setting-item > div, #uiSettingsBackup .setting-item > div|需要进一步测试|
|src/ui/desktop.css:707|#uiSettingsLock #newPwdInput|需要进一步测试|
|src/ui/desktop.css:713|#uiSettingsRules > div|需要进一步测试|
|src/ui/desktop.css:719|/* Classroom behaviour uses one card and one switch component. */ #uiSettingsRules #settingsV26_function|需要进一步测试|
|src/ui/desktop.css:723|#uiSettingsRules > div|需要进一步测试|
|src/ui/desktop.css:726|#uiSettingsRules .ui-rule-card|需要进一步测试|
|src/ui/desktop.css:736|.ui-rule-copy|需要进一步测试|
|src/ui/desktop.css:740|.ui-rule-title|需要进一步测试|
|src/ui/desktop.css:747|.ui-rule-copy .setting-note|需要进一步测试|
|src/ui/desktop.css:752|.ui-rule-card .v292-switch|需要进一步测试|
|src/ui/desktop.css:755|.v292-switch input:focus-visible + .v292-switch-track|需要进一步测试|
|src/ui/desktop.css:759|/* Siblings of animated surfaces stay anchored to the viewport. */ .ui-cinematic-skip|需要进一步测试|
|src/ui/desktop.css:774|#settingsV26_sound,   #uiSettingsVolume > div,   #uiSettingsWallpaper > div,   #uiSettingsLayout > div|需要进一步测试|
|src/ui/desktop.css:783|#settingsV26_sound > .ui-settings-group,   #settingsV26_sound > details[open]|需要进一步测试|
|src/ui/desktop.css:787|#settingsV26_sound > .ui-settings-group,   #settingsV26_sound > .ui-settings-disclosure|需要进一步测试|
|src/ui/desktop.css:791|#uiSettingsLayout .ui-settings-row|需要进一步测试|
|src/ui/desktop.css:795|.ui-bank-editor|需要进一步测试|
|src/ui/desktop.css:804|.ui-danger-zone|需要进一步测试|
|src/ui/desktop.css:809|.ui-danger-zone .ui-muted|需要进一步测试|
|src/ui/desktop.css:812|.ui-dock-menu|需要进一步测试|
|src/ui/desktop.css:816|.ui-dock-menu summary|需要进一步测试|
|src/ui/desktop.css:826|.ui-dock-menu-body|需要进一步测试|
|src/ui/desktop.css:842|.ui-dock-menu:not([open]) .ui-dock-menu-body|需要进一步测试|
|src/ui/desktop.css:845|.ui-dock-menu-body .icon-btn|需要进一步测试|
|src/ui/desktop.css:853|.ui-toast|需要进一步测试|
|src/ui/desktop.css:863|.ui-toast::backdrop|需要进一步测试|
|src/ui/desktop.css:867|.ui-modal-close|需要进一步测试|
|src/ui/desktop.css:879|body[data-motion="off"] *, body[data-motion="off"] *::before, body[data-motion="off"] *::after|需要进一步测试|
|src/ui/desktop.css:887|body[data-motion="simple"] .persistent-aura-v213, body[data-item-fx="off"] .persistent-aura-v213|需要进一步测试|
|src/ui/desktop.css:891|body[data-item-fx="off"] .card-fx-layer, body[data-item-fx="off"] .item-use-banner-v216|需要进一步测试|
|src/ui/desktop.css:896|body[data-system-motion="true"] *,   body[data-system-motion="true"] *::before,   body[data-system-motion="true"] *::after|需要进一步测试|
|src/ui/desktop.css:906|.ui-page|需要进一步测试|
|src/ui/desktop.css:909|.ui-daily-grid|需要进一步测试|
|src/ui/desktop.css:912|.ui-settings-shell|需要进一步测试|
|src/ui/desktop.css:915|.ui-welcome-head h1|需要进一步测试|
|src/ui/desktop.css:919|body.modern-flat-v217[data-current-view]:not([data-current-view="battle"])|需要进一步测试|
|src/ui/desktop.css:923|.nav-tab|需要进一步测试|
|src/ui/desktop.css:931|.ui-settings-host|需要进一步测试|
|src/ui/desktop.css:937|.ui-settings-category .settings-v26-pane|需要进一步测试|
|src/ui/desktop.css:943|#view-history, #view-archives, #view-settings|需要进一步测试|
|src/ui/desktop.css:948|.picker-layout-v2|需要进一步测试|
|src/ui/desktop.css:953|.picker-left-v2, .picker-right-v2|需要进一步测试|
|src/ui/desktop.css:960|.picker-center-v2|需要进一步测试|
|src/ui/desktop.css:967|.picker-left-v2 .slot-options-row|需要进一步测试|
|src/ui/desktop.css:973|.picker-vtab|需要进一步测试|
|src/ui/desktop.css:979|.picker-vtab.active|需要进一步测试|
|src/ui/desktop.css:983|#pickerInfoBox|需要进一步测试|
|src/ui/desktop.css:988|.slot-reel-text|需要进一步测试|
|src/ui/desktop.css:991|.slot-reel-frame|需要进一步测试|
|src/ui/desktop.css:994|#slotResultPanel.show #resultHeadline|需要进一步测试|
|src/ui/desktop.css:998|.picker-right-v2 .picker-info-tabs|需要进一步测试|
|src/ui/desktop.css:1001|.ui-settings-category #bgmListContainer|需要进一步测试|
|src/ui/desktop.css:1005|.ui-settings-category .setting-section-title|需要进一步测试|
|src/ui/desktop.css:1008|.ui-settings-category #uiIconManagerV26 img, .item-big-icon img, .ency-v213-icon img, .ency-icon img|需要进一步测试|
|src/ui/desktop.css:1018|.item-big-icon|需要进一步测试|
|src/ui/desktop.css:1026|.item-big-desc|需要进一步测试|
|src/ui/desktop.css:1029|.queue-main-card|需要进一步测试|
|src/ui/desktop.css:1032|.queue-secondary-card|需要进一步测试|
|src/ui/desktop.css:1035|.queue-item-card|需要进一步测试|
|src/ui/desktop.css:1038|.queue-role-badge|需要进一步测试|
|src/ui/desktop.css:1041|.queue-main-card .queue-role-badge|需要进一步测试|
|src/ui/desktop.css:1044|.ui-settings-row input:disabled, .ui-settings-row select:disabled|需要进一步测试|
|src/ui/desktop.css:1049|.ui-page button:disabled|需要进一步测试|
|src/ui/desktop.css:1053|.ui-page button:focus-visible, .ui-settings-shell button:focus-visible, select:focus-visible, summary:focus-visible|需要进一步测试|
|src/ui/desktop.css:1061|.app-topnav .header-stats|需要进一步测试|
|src/ui/desktop.css:1064|.picker-layout-v2|需要进一步测试|
|src/ui/desktop.css:1067|.picker-left-v2,   .picker-right-v2,   .picker-center-v2|需要进一步测试|
|src/ui/desktop.css:1073|.ui-settings-body .ui-settings-category .setting-item|需要进一步测试|
|src/ui/desktop.css:1078|.ui-podium:has(> div:nth-child(3)) > div:first-child|需要进一步测试|
|src/ui/desktop.css:1083|.ui-podium:has(> div:nth-child(3)) > div:nth-child(2)|需要进一步测试|
|src/ui/desktop.css:1087|.ui-podium:has(> div:nth-child(3)) > div:nth-child(3)|需要进一步测试|
|src/ui/desktop.css:1091|.ui-podium:not(:has(> div:nth-child(2)))|需要进一步测试|
|src/ui/welcome-v2.css:1|/* V2.19 welcome redesign: intentionally scoped. Do not touch battle geometry. */ .gp-brand-mount|需要进一步测试|
|src/ui/welcome-v2.css:9|.gp-brand-mount svg|需要进一步测试|
|src/ui/welcome-v2.css:16|#view-welcome|需要进一步测试|
|src/ui/welcome-v2.css:20|#view-welcome .gp-home|需要进一步测试|
|src/ui/welcome-v2.css:27|#view-welcome .gp-hero|需要进一步测试|
|src/ui/welcome-v2.css:42|#view-welcome .gp-hero::before, #view-welcome .gp-hero::after|需要进一步测试|
|src/ui/welcome-v2.css:50|#view-welcome .gp-hero::before|需要进一步测试|
|src/ui/welcome-v2.css:57|#view-welcome .gp-hero::after|需要进一步测试|
|src/ui/welcome-v2.css:64|#view-welcome .gp-hero-copy|需要进一步测试|
|src/ui/welcome-v2.css:68|#view-welcome .gp-eyebrow|需要进一步测试|
|src/ui/welcome-v2.css:74|#view-welcome .gp-hero h1|需要进一步测试|
|src/ui/welcome-v2.css:82|#view-welcome .gp-hero h1 em|需要进一步测试|
|src/ui/welcome-v2.css:86|#view-welcome .gp-greeting|需要进一步测试|
|src/ui/welcome-v2.css:93|#view-welcome .gp-hero-description|需要进一步测试|
|src/ui/welcome-v2.css:99|#view-welcome .gp-actions|需要进一步测试|
|src/ui/welcome-v2.css:106|#view-welcome .gp-button-primary, #view-welcome .gp-button-outline|需要进一步测试|
|src/ui/welcome-v2.css:115|#view-welcome .gp-button-primary|需要进一步测试|
|src/ui/welcome-v2.css:121|#view-welcome .gp-button-primary:hover|需要进一步测试|
|src/ui/welcome-v2.css:125|#view-welcome .gp-button-outline|需要进一步测试|
|src/ui/welcome-v2.css:130|#view-welcome .gp-button-outline:hover|需要进一步测试|
|src/ui/welcome-v2.css:133|#view-welcome .gp-hero-status|需要进一步测试|
|src/ui/welcome-v2.css:143|#view-welcome .gp-status-top|需要进一步测试|
|src/ui/welcome-v2.css:150|#view-welcome .gp-live-pill|需要进一步测试|
|src/ui/welcome-v2.css:157|#view-welcome .gp-hero-clock|需要进一步测试|
|src/ui/welcome-v2.css:164|#view-welcome .gp-hero-date|需要进一步测试|
|src/ui/welcome-v2.css:169|#view-welcome .gp-status-separator|需要进一步测试|
|src/ui/welcome-v2.css:174|#view-welcome .gp-status-foot|需要进一步测试|
|src/ui/welcome-v2.css:180|#view-welcome .gp-status-foot strong|需要进一步测试|
|src/ui/welcome-v2.css:183|#view-welcome .gp-kpis|需要进一步测试|
|src/ui/welcome-v2.css:189|#view-welcome .gp-kpi|需要进一步测试|
|src/ui/welcome-v2.css:200|#view-welcome .gp-kpi > div|需要进一步测试|
|src/ui/welcome-v2.css:205|#view-welcome .gp-kpi span:first-child|需要进一步测试|
|src/ui/welcome-v2.css:210|#view-welcome .gp-kpi strong|需要进一步测试|
|src/ui/welcome-v2.css:221|#view-welcome .gp-kpi small|需要进一步测试|
|src/ui/welcome-v2.css:225|#view-welcome .gp-kpi-icon|需要进一步测试|
|src/ui/welcome-v2.css:237|#view-welcome .gp-kpi-icon.gp-gold|需要进一步测试|
|src/ui/welcome-v2.css:241|#view-welcome .gp-kpi-icon.gp-blue|需要进一步测试|
|src/ui/welcome-v2.css:245|#view-welcome .gp-kpi-icon.gp-purple|需要进一步测试|
|src/ui/welcome-v2.css:249|#view-welcome .gp-section-heading|需要进一步测试|
|src/ui/welcome-v2.css:256|#view-welcome .gp-section-heading > div|需要进一步测试|
|src/ui/welcome-v2.css:261|#view-welcome .gp-section-heading h2|需要进一步测试|
|src/ui/welcome-v2.css:268|#view-welcome .gp-section-heading small|需要进一步测试|
|src/ui/welcome-v2.css:274|#view-welcome .gp-section-heading > span|需要进一步测试|
|src/ui/welcome-v2.css:278|#view-welcome .gp-heading-bar|需要进一步测试|
|src/ui/welcome-v2.css:284|#view-welcome .gp-main-grid|需要进一步测试|
|src/ui/welcome-v2.css:290|#view-welcome .gp-panel|需要进一步测试|
|src/ui/welcome-v2.css:298|#view-welcome .gp-panel-title|需要进一步测试|
|src/ui/welcome-v2.css:305|#view-welcome .gp-panel-title > div|需要进一步测试|
|src/ui/welcome-v2.css:310|#view-welcome .gp-panel-title strong|需要进一步测试|
|src/ui/welcome-v2.css:315|#view-welcome .gp-panel-title small|需要进一步测试|
|src/ui/welcome-v2.css:319|#view-welcome .gp-panel-tag|需要进一步测试|
|src/ui/welcome-v2.css:328|#view-welcome .gp-panel-tag.gp-soft-tag|需要进一步测试|
|src/ui/welcome-v2.css:331|#view-welcome .gp-rank-head, #view-welcome .gp-rank-row|需要进一步测试|
|src/ui/welcome-v2.css:341|#view-welcome .gp-rank-head|需要进一步测试|
|src/ui/welcome-v2.css:348|#view-welcome .gp-rank-row|需要进一步测试|
|src/ui/welcome-v2.css:353|#view-welcome .gp-rank-row:hover|需要进一步测试|
|src/ui/welcome-v2.css:356|#view-welcome .gp-rank-index|需要进一步测试|
|src/ui/welcome-v2.css:361|#view-welcome .gp-rank-index.gp-medal|需要进一步测试|
|src/ui/welcome-v2.css:370|#view-welcome .gp-rank-index.gp-second|需要进一步测试|
|src/ui/welcome-v2.css:374|#view-welcome .gp-rank-index.gp-third|需要进一步测试|
|src/ui/welcome-v2.css:378|#view-welcome .gp-rank-name|需要进一步测试|
|src/ui/welcome-v2.css:385|#view-welcome .gp-rank-bar|需要进一步测试|
|src/ui/welcome-v2.css:391|#view-welcome .gp-rank-bar > i|需要进一步测试|
|src/ui/welcome-v2.css:397|#view-welcome .gp-rank-points|需要进一步测试|
|src/ui/welcome-v2.css:403|#view-welcome .gp-rank-state|需要进一步测试|
|src/ui/welcome-v2.css:412|#view-welcome .gp-rank-empty|需要进一步测试|
|src/ui/welcome-v2.css:417|#view-welcome .gp-panel-footer|需要进一步测试|
|src/ui/welcome-v2.css:426|#view-welcome .gp-panel-footer button|需要进一步测试|
|src/ui/welcome-v2.css:434|#view-welcome .gp-match-status|需要进一步测试|
|src/ui/welcome-v2.css:443|#view-welcome .gp-status-orb|需要进一步测试|
|src/ui/welcome-v2.css:451|#view-welcome .gp-match-status > div|需要进一步测试|
|src/ui/welcome-v2.css:458|#view-welcome .gp-match-status strong|需要进一步测试|
|src/ui/welcome-v2.css:462|#view-welcome .gp-match-status small|需要进一步测试|
|src/ui/welcome-v2.css:466|#view-welcome .gp-match-status button|需要进一步测试|
|src/ui/welcome-v2.css:476|#view-welcome .gp-feed-list|需要进一步测试|
|src/ui/welcome-v2.css:480|#view-welcome .gp-feed-row|需要进一步测试|
|src/ui/welcome-v2.css:487|#view-welcome .gp-feed-icon|需要进一步测试|
|src/ui/welcome-v2.css:498|#view-welcome .gp-feed-copy|需要进一步测试|
|src/ui/welcome-v2.css:502|#view-welcome .gp-feed-copy strong|需要进一步测试|
|src/ui/welcome-v2.css:509|#view-welcome .gp-feed-copy p|需要进一步测试|
|src/ui/welcome-v2.css:515|#view-welcome .gp-feed-time|需要进一步测试|
|src/ui/welcome-v2.css:520|#view-welcome .gp-group-section|需要进一步测试|
|src/ui/welcome-v2.css:529|#view-welcome .gp-group-head|需要进一步测试|
|src/ui/welcome-v2.css:536|#view-welcome .gp-group-head h2|需要进一步测试|
|src/ui/welcome-v2.css:542|#view-welcome .gp-group-live|需要进一步测试|
|src/ui/welcome-v2.css:552|#view-welcome .gp-group-head p|需要进一步测试|
|src/ui/welcome-v2.css:557|#view-welcome .gp-compact-track|需要进一步测试|
|src/ui/welcome-v2.css:563|#view-welcome .gp-compact-track :is(.ui-group-card, .ui-group-repeat)|需要进一步测试|
|src/ui/welcome-v2.css:573|#view-welcome .gp-compact-track :is(.ui-group-card, .ui-group-repeat):hover|需要进一步测试|
|src/ui/welcome-v2.css:577|#view-welcome .gp-compact-track .ui-group-title|需要进一步测试|
|src/ui/welcome-v2.css:583|#view-welcome .gp-compact-track .ui-group-score|需要进一步测试|
|src/ui/welcome-v2.css:586|#view-welcome .gp-compact-track .ui-muted|需要进一步测试|
|src/ui/welcome-v2.css:590|#view-welcome .gp-compact-track .ui-chip|需要进一步测试|
|src/ui/welcome-v2.css:594|#view-welcome .gp-compact-track footer|需要进一步测试|
|src/ui/welcome-v2.css:600|#view-welcome .gp-compact-track footer img|需要进一步测试|
|src/ui/welcome-v2.css:604|#view-welcome .gp-bottom-heading|需要进一步测试|
|src/ui/welcome-v2.css:607|#view-welcome .gp-daily-grid|需要进一步测试|
|src/ui/welcome-v2.css:614|#view-welcome .gp-daily-grid[data-card-count="1"]|需要进一步测试|
|src/ui/welcome-v2.css:617|#view-welcome .gp-daily-item|需要进一步测试|
|src/ui/welcome-v2.css:620|#view-welcome .gp-daily-item .ui-item-tip-icon|需要进一步测试|
|src/ui/welcome-v2.css:628|#view-welcome .gp-daily-item h3|需要进一步测试|
|src/ui/welcome-v2.css:631|#view-welcome .gp-daily-grid details|需要进一步测试|
|src/ui/welcome-v2.css:635|#view-welcome .gp-daily-grid .btn|需要进一步测试|
|src/ui/welcome-v2.css:639|#view-welcome .gp-daily-grid .ui-quiz-options|需要进一步测试|
|src/ui/welcome-v2.css:644|#view-welcome .gp-daily-grid .ui-quiz-options button|需要进一步测试|
|src/ui/welcome-v2.css:649|#view-welcome .gp-daily-honors h3|需要进一步测试|
|src/ui/welcome-v2.css:652|#view-welcome .gp-daily-challenge .ui-source|需要进一步测试|
|src/ui/welcome-v2.css:656|#view-welcome .gp-daily-grid .ui-panel|需要进一步测试|
|src/ui/welcome-v2.css:663|#view-welcome .gp-daily-grid .ui-eyebrow|需要进一步测试|
|src/ui/welcome-v2.css:669|#view-welcome .gp-daily-grid h3|需要进一步测试|
|src/ui/welcome-v2.css:673|#view-welcome .gp-daily-grid p|需要进一步测试|
|src/ui/welcome-v2.css:677|#view-welcome .gp-footnote|需要进一步测试|
|src/ui/welcome-v2.css:683|#view-welcome .gp-existing-metrics[hidden]|需要进一步测试|
|src/ui/welcome-v2.css:686|/* Startup overlay is an independent gate, not a page tab or modal card. */ .gp-intro|需要进一步测试|
|src/ui/welcome-v2.css:698|.gp-intro[hidden]|需要进一步测试|
|src/ui/welcome-v2.css:701|.gp-intro.active|需要进一步测试|
|src/ui/welcome-v2.css:705|.gp-intro-backdrop|需要进一步测试|
|src/ui/welcome-v2.css:717|.gp-intro-stage|需要进一步测试|
|src/ui/welcome-v2.css:726|.gp-intro-logo|需要进一步测试|
|src/ui/welcome-v2.css:737|.gp-intro-logo svg|需要进一步测试|
|src/ui/welcome-v2.css:744|.gp-intro-title|需要进一步测试|
|src/ui/welcome-v2.css:758|.gp-intro-caption|需要进一步测试|
|src/ui/welcome-v2.css:766|.gp-intro.ready .gp-intro-logo, .gp-intro.ready .gp-intro-title|需要进一步测试|
|src/ui/welcome-v2.css:771|.gp-intro.ready .gp-intro-caption|需要进一步测试|
|src/ui/welcome-v2.css:774|.gp-slider|需要进一步测试|
|src/ui/welcome-v2.css:796|.gp-intro.ready .gp-slider|需要进一步测试|
|src/ui/welcome-v2.css:800|.gp-slider:active|需要进一步测试|
|src/ui/welcome-v2.css:803|.gp-slider-fill|需要进一步测试|
|src/ui/welcome-v2.css:812|.gp-slider-hint|需要进一步测试|
|src/ui/welcome-v2.css:819|.gp-slider-knob|需要进一步测试|
|src/ui/welcome-v2.css:839|.gp-slider-fill|需要进一步测试|
|src/ui/welcome-v2.css:842|.gp-slider.dragging .gp-slider-knob, .gp-slider.dragging .gp-slider-fill|需要进一步测试|
|src/ui/welcome-v2.css:846|.gp-intro-skip|需要进一步测试|
|src/ui/welcome-v2.css:855|.gp-intro.ready .gp-intro-skip|需要进一步测试|
|src/ui/welcome-v2.css:858|.gp-intro.departing .gp-intro-backdrop|需要进一步测试|
|src/ui/welcome-v2.css:861|.gp-intro.departing .gp-slider, .gp-intro.departing .gp-intro-caption, .gp-intro.departing .gp-intro-skip|需要进一步测试|
|src/ui/welcome-v2.css:867|.gp-intro:focus-within .gp-slider:focus-visible|需要进一步测试|
|src/ui/welcome-v2.css:871|body.gp-intro-active|需要进一步测试|
|src/ui/welcome-v2.css:874|body.gp-intro-active .app-topnav|需要进一步测试|
|src/ui/welcome-v2.css:877|body.gp-intro-reveal .app-topnav|需要进一步测试|
|src/ui/welcome-v2.css:880|body.gp-intro-reveal #view-welcome .gp-reveal|需要进一步测试|
|src/ui/welcome-v2.css:883|body.gp-intro-reveal #view-welcome .gp-kpis|需要进一步测试|
|src/ui/welcome-v2.css:886|body.gp-intro-reveal #view-welcome .gp-section-heading|需要进一步测试|
|src/ui/welcome-v2.css:889|body.gp-intro-reveal #view-welcome .gp-main-grid|需要进一步测试|
|src/ui/welcome-v2.css:892|body.gp-intro-reveal #view-welcome .gp-group-section|需要进一步测试|
|src/ui/welcome-v2.css:895|body.gp-intro-reveal #view-welcome .gp-daily-grid|需要进一步测试|
|src/ui/welcome-v2.css:899|from|需要进一步测试|
|src/ui/welcome-v2.css:902|to|需要进一步测试|
|src/ui/welcome-v2.css:907|from|需要进一步测试|
|src/ui/welcome-v2.css:911|to|需要进一步测试|
|src/ui/welcome-v2.css:917|#view-welcome .gp-kpis|需要进一步测试|
|src/ui/welcome-v2.css:920|#view-welcome .gp-main-grid|需要进一步测试|
|src/ui/welcome-v2.css:923|#view-welcome .gp-hero|需要进一步测试|
|src/ui/welcome-v2.css:928|#view-welcome .gp-home|需要进一步测试|
|src/ui/welcome-v2.css:931|#view-welcome .gp-hero|需要进一步测试|
|src/ui/welcome-v2.css:936|#view-welcome .gp-hero-status|需要进一步测试|
|src/ui/welcome-v2.css:940|#view-welcome .gp-section-heading > span,   #view-welcome .gp-section-heading small|需要进一步测试|
|src/ui/welcome-v2.css:944|#view-welcome .gp-kpi|需要进一步测试|
|src/ui/welcome-v2.css:947|#view-welcome .gp-kpi strong|需要进一步测试|
|src/ui/welcome-v2.css:950|#view-welcome .gp-daily-grid|需要进一步测试|
|src/ui/welcome-v2.css:953|#view-welcome .gp-rank-head,   #view-welcome .gp-rank-row|需要进一步测试|
|src/ui/welcome-v2.css:959|#view-welcome .gp-rank-head span:nth-child(3),   #view-welcome .gp-rank-bar|需要进一步测试|
|src/ui/welcome-v2.css:963|#view-welcome .gp-rank-row|需要进一步测试|
|src/ui/welcome-v2.css:966|#view-welcome .gp-rank-name|需要进一步测试|
|src/ui/welcome-v2.css:969|#view-welcome .gp-group-head p|需要进一步测试|
|src/ui/welcome-v2.css:972|#view-welcome .gp-panel-title|需要进一步测试|
|src/ui/welcome-v2.css:975|#view-welcome .gp-group-head|需要进一步测试|
|src/ui/welcome-v2.css:978|#view-welcome .gp-feed-list|需要进一步测试|
|src/ui/welcome-v2.css:981|#view-welcome .gp-match-status|需要进一步测试|
|src/ui/welcome-v2.css:985|body[data-welcome-motion="off"] .gp-intro *, body[data-welcome-motion="off"].gp-intro-reveal .app-topnav, body[data-welcome-motion="off"].gp-intro-reveal #view-welcome .gp-reveal|需要进一步测试|
|src/ui/welcome-v2.css:991|#gpCruiseToggle|需要进一步测试|
|src/ui/welcome-v2.css:997|#view-welcome .gp-rank-points|需要进一步测试|
|src/ui/welcome-v2.css:1001|#view-welcome .gp-kpi .gp-kpi-number|需要进一步测试|

## 人工验证与实际治理决策

详见 [REFACTORING_REPORT.md](REFACTORING_REPORT.md) 的替代行为表及对应测试。未出现在安全删除记录中的 CSS、音频、渲染和 legacyUseItem 包装层均保留，不以旧版本号作为删除依据。全部独立 keyframes 名称、模板及字符串内联事件入口也见 SOURCE_CATALOG.md；当前索引不是完整作用域解析或动态可达性证明。

3.0.13：restoreStateFromSnapshot/undoLast/revertToHistory旧函数体已被HistoryCommands覆盖并替换为转发入口；保留公开名称兼容既有调用。快照capture、normalizeAllGroups和item timer仍必要。替换证据见artifacts/v3-history（18差分、5专项）。

3.0.14：两处setCorrectAns旧实现（早期themeConfirm版、后期programConfirmV28覆盖版）替换为AnswerCommands.correct单实现。保留实际后期警告窗语义与文案；后期缺少保存、确认失效问题由5浏览器专项验证修复。旧programConfirmV28组件仍必要，未删除。

3.0.15：forceEndRound直接修改/recordHistory/saveState已由RoundSettlement.forceEnd单命令替换。危险确认组件及音效、FLIP动画保留；旧确认现需身份/阶段/作答代次匹配。2项时序专项和80项结算差分是替换证据。

3.0.17：nextRound中分散直接赋字段+saveState已替换为事务命令；音频预加载仍为异步前置步骤，防止旧完成覆盖新课堂。结果复位、AllIn持久选项和道具锁行为由2项专项和原117核心回归验证。
