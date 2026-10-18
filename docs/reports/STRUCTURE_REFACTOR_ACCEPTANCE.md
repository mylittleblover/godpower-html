# 遗留治理与职责分离：本轮实际验收

## 来源与范围

基线：`9e1be3c25ab01388906f5115bd8b1f89fd2d360c`（最新远端refactor/20261018-repository-hygiene），源码冻结：`843c0ddf6f3592c03c5c2a32b25e206b37ab7ee1`。独立分支refactor/render-ownership，工作区/workspace/godpower-structure。原工作区未改动；没有删除或清空真实课堂数据。采用Superpowers排查、设计/计划、测试先行、逐批提交和独立最终审查。依用户持续授权自主执行，不增加阶段审批。

本轮完成全src JS/CSS静态索引及已证实冗余的渲染链治理；**不是所有遗留模块已重写的声明**。legacyUseItem 14个定义及旧音频/比赛状态/CSS仍有有效行为，保留并登记后续任务。

## 实际替代清单

|旧位置/实现|结论|现所有者/证据|
|---|---|---|
|00.js旧卡片构建+_itemBaseRenderGrid|在01.js无条件替换后不可达，安全删除|最终卡片函数迁入ui/battle-grid.js；独立AST对比一致|
|01/02/12/17/24/26/27/29/31 renderGrid捕获链|有效行为迁移，重复排序条件合并|ui/render.js唯一入口；ui/battle-grid.js装饰；31.js恢复冻结分数|
|00/03/17 renderAll链|迁入统一入口；03重复欢迎/图表/领奖台刷新去重|ui/render.js；原刷新顺序保留，虚拟时钟断言|
|25/33|AST无执行语句，删除|empty-source-blocks守卫；模板/manifest同步|
|26/29|先迁移有效排序/810ms合并，再删除空块|render-ownership时钟测试及14组比较|
|Reliability单一失效回调|已确认缺陷，修复为独立订阅|业务取消不再被动画清理覆盖；返回取消订阅函数|

缺陷复现：旧基线与第一阶段重构均在待决刺龟壳防御期间导入999分后回滚到100。import-probe.json保留对照，red-listeners.log证明旧接口仅调用visual。修复后原有导入999断言通过，未修改预期。通知仍同步按注册顺序，异常传播；未新建吞错处理。

## 职责与约束

规则/事务/历史/校验归core；页面编排归render；卡片DOM归battle-grid；动画归BattleMotion/ClassroomFeedback/DesktopUI；声音分类归ActionSounds，实际音频设备/存储保留旧所有者。详见ARCHITECTURE。未改CSS、计分、26道具参数、All In、历史/存储schema及内置资源；保持单文件离线构建。

## 实际测试

环境：Linux 6.18.55 x86_64，Node24.19.0，npm11.9.0，Chromium154.0.8037.57，Playwright1.56.1。只运行Chromium；未执行CircleCI，也未提交触发收费操作。原始100项Node基线通过；新增守卫、时序与订阅回归先红后绿。

|测试|通过数|状态|本轮证据|
|---|---:|---|---|
|Node单元/集成/架构守卫|111|PASS|artifacts/structure/green-unit.log|
|核心业务Chromium|117|PASS|artifacts/structure/captured/artifacts/browser-results.json|
|26道具精确结果|26|PASS|artifacts/structure/captured/artifacts/rule-oracles.json|
|异步防御完整命令|30|PASS|artifacts/structure/captured/artifacts/refactor/defense-command.json|
|新旧业务差分|464|PASS|artifacts/structure/captured/artifacts/refactor/legacy-differential.json|
|比赛动画/独立按钮声音|8|PASS|artifacts/structure/captured/artifacts/battle-motion/results.json|
|断网HTTP/归档/弹窗|4|PASS|artifacts/structure/captured/artifacts/desktop-ui/release-smoke.json|
|真实作答和存储失败|3|PASS|artifacts/structure/captured/artifacts/scoring-persistence-results.json|
|桌面交互/结算拒绝清零|21|PASS|artifacts/structure/captured/artifacts/desktop-ui/interactions.json|
|赋分/抽选/音效配置|15|PASS|artifacts/structure/captured/artifacts/classroom-feedback/results.json|
|20/50/100连续回合|6|PASS|artifacts/structure/captured/artifacts/refactor/performance-comparison.json|
|最新基线14组布局|3|PASS|artifacts/structure/layout-final/battle-14-comparison.json|

构建、逐脚本语法、manifest、Prettier检查及只读hygiene检查实际通过。两个HTML字节一致，55脚本块、84源码块、27原始内置资源逐字保留。最终大小7774957字节，SHA256 `09944d8a15dda2b949e499e362d4c4de742fbf715d8ce001ce619667467460db`。断网HTTP测试覆盖五页、真实作答加分、档案CSV和主要窗口；没有强制外部运行时请求。

`file://`被环境企业策略ERR_BLOCKED_BY_ADMINISTRATOR拦截，记BLOCKED，不计PASS。原生浏览器工具栏80%–125%、真实音轨听感和长时间内存趋势未测；布局测试使用应用现有CSS zoom。未运行完整npm run verify（本轮采用下列实际专项组合），未将其标为通过。

## 14组布局

与9e1be3c重建源码在同一Chromium比较：1366×768应用zoom0.8、1920×1080 zoom1、2560×1440 zoom1；double模式、120px垫片，同一含长名/大分/负分/主次道具/持续状态/已作答/All In的14组数据。三档逐卡位置/宽高、垫片、底栏、文档高度断言通过。截图：artifacts/structure/layout-final/{before,after}/battle-14-*.png。BATTLE_14_GROUPS_BASELINE记录在comparison JSON；**用户真实教室配置尚未取得，不能称已验证其设备**。原有页面滚动高度保持；未为填满空白放大卡片。

## 指标与性能

|指标|基线|本轮|
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

函数定义指标含局部函数，重复名称不等于全局覆盖。旧包装器指标为捕获别名近似；CSS1940叶规则、48相同正文、1660个!important原样保留，未证明层叠等价则不删。legacyUseItem仍14个定义。

|版本|连续回合|同步耗时ms|DOM前→后|JS堆样本bytes|
|---|---:|---:|---|---:|
|before|20|5976.4|2098→2117|37540412|
|before|50|7778.6|2098→2117|46966788|
|before|100|7519.0|2098→2117|30338860|
|after|20|3899.5|2096→2115|39181218|
|after|50|6919.4|2096→2115|47837194|
|after|100|4677.9|2096→2115|35342148|

每格为一次按顺序执行的样本，不是统计基准；没有据此宣称确定的性能提升或无内存泄漏。20/50/100回合积分、40条历史上限和有界DOM均通过。

## 独立审查与保留项

独立审查未发现确认的新代码缺陷，并单独在Chromium复核horn待决导入后999分不回滚、无pageerror。23项定向Node测试通过；卡片构建AST与基线完全一致。审查提出历史证据隔离要求，本轮产物已复制到structure/captured并恢复原路径，索引含SHA。

保留：遗留道具分支、全局布尔状态、音频设备/IndexedDB/BIN、DesktopUI多职责、CSS层叠、未统一取消的810ms回调。STR-003/004及GP-011/013/014/015给出依赖和验收；不把静态无法找调用者当作死代码证据。订阅者异常隔离未新增策略，应在引入可能抛错的订阅前补充组合测试。

## 可重复命令

```sh
npm run build
npm run check
npm run format:check
npm test
node tests/e2e/run.mjs
node tests/e2e/defense-command.mjs
node tests/e2e/rules.mjs
npm run test:battle-motion
node tests/e2e/release-smoke.mjs
node tests/e2e/scoring-persistence.mjs
node tests/e2e/desktop-interactions.mjs
node tests/e2e/classroom-feedback.mjs
REFACTOR_BASELINE=9e1be3c node tests/e2e/legacy-differential.mjs
REFACTOR_BASELINE=9e1be3c node tests/e2e/refactor-performance.mjs
BATTLE_BASELINE_COMMIT=9e1be3c BATTLE_ARTIFACT_DIR=artifacts/structure/layout-final node tests/e2e/battle-layout.mjs
```

后续先做GP-011/STR-003，再推进完整备份、音频生命周期、DesktopUI组件化和CSS；具体任务见MAINTENANCE_BACKLOG。提交保留[skip ci]，不强推、不执行CircleCI。
