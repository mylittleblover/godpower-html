# 当前治理结果索引

最新一轮：基于 `9e1be3c` 的 [渲染所有者与生命周期治理验收](reports/STRUCTURE_REFACTOR_ACCEPTANCE.md)。本轮实际完成renderAll 3→1、renderGrid 11→1、移除4个失效/空脚本、修复失效回调覆盖引起的导入回滚；下面保留上一轮历史报告，数字和测试证据不能代替当前结果。

---

# 遗留代码治理与渐进重构实际报告

本轮完成 GP-010 公开道具命令的异步事务，以及攻击／防御、历史快照三批实际治理。**没有把所有遗留技术债标为已完成，也没有为减少行数而删除未证实安全的代码。**

## 起点、分支与回滚

- GitHub：`mylittleblover/godpower-html`，已 fetch 后识别最新远端 `refactor/v219-defense-lifecycle`，起点 `079df316a999ced4f598a3c3d0495786f9f8d0e8`，而非旧 V2.18.15；V2.19.0 UI 和新增批量赋分均保留。
- 独立分支：`refactor/legacy-lifecycle`；原工作区干净，未覆盖无关修改。源代码冻结提交：`5dd70ca8aeecd1e3a0582f48d5529f2a4809d57c`。完整验证状态及产物哈希见 `artifacts/refactor/final-status.json`。
- 逻辑提交：`e142e74` 异步命令；`6b5caa7` 攻击防御规范入口；`27a60d3` 历史模块；后续提交包含架构守卫、差分／布局／性能脚本、清单同步及报告。
- 回滚应切换对应提交并重新构建；不要清空 localStorage，不要把未知 schema 数据强行写回。原 baseline/V2.18.13.html 与所有历史提交保留。

## 已删除／替换代码及行为证据

|原实现|分类|替代与保留行为|验证|
|---|---|---|---|
|00/05/17/31/36 的 applyItemScore 多层捕获链|已被新实现取代／可安全删除|core/item-score.js 一个入口；显式保留喇叭先确认、基础防御摧毁、蘑菇确认、普通防御、伤害、110ms受击与批次积分队列|26精确结果＋464差分＋30异步命令|
|00/05/36 的 tryDefend 原实现和包装|重复实现／已被新实现取代|同一规范模块；幽灵持续保护、拒绝喇叭、羽毛、炮弹、星星／巨大蘑菇、幽灵一次保护、炸弹和主栏防御顺序保留；闪电特殊规则仍独立|464固定时间／随机数场景|
|recordHistory 三层、restoreStateFromSnapshot 两层、undoLast 两层|已被新实现取代／可安全删除|core/history.js 唯一实现；操作前快照、原字段、40条上限、旧键、炮弹和乌贼恢复计时器均保留|快照纯函数、批量原子撤销、连续撤销和UI恢复|
|typeof rollbackToHistory 的兼容安装块|确认无法触达／可安全删除|仓库没有该函数定义或其他调用；实际按钮用 revertToHistory，完整保留它|静态全仓库搜索和真实历史恢复|
|同步 runClassroomCommand 无待决事务|已被新实现取代|纯 CommandLifecycle＋浏览器适配器；待决时暂缓落盘／历史镜像；确认后同一命令提交；中断撤销整次攻击|控制器单元＋正常接受／拒绝／撤销／导入／切题／拒绝Promise／Quota／实际刷新|
|库存 normalize 每次重建已规范对象|已被新实现取代|合法对象保留身份，字段／次数规范化规则保留；避免正常界面渲染使防御令牌失效|真实 useItem 后 renderAll/ensureV2State 再接受确认|
|源码清单遗漏新模块|已确认并修复|src/manifest.json 与模板同步，scripts/check.mjs 校验78个源码块；同步脚本可重复执行|manifest-check.log；输出资源校验|

GP-010 基线缺陷已通过原始最新源码重新构建后在 Chromium 复现：`defense-baseline-probe.json` 两项为 REPRODUCED，而非正常通过。旧代码会先保存攻击者消耗，并在合法接受后仍保留防御道具。不是只按此前报告推断。

异步命令返回 true 表示已受理，`lastClassroomCommandResult.pending` 明确区分待决与完成。接受／拒绝完成同一次操作，撤销恢复双方库存和积分。等待中刷新读取最后完整存档，相当于取消未完成攻击。普通保存失败沿用现有“完整结果暂留内存＋持续警告”策略，不宣称落盘成功；严格导入和最终结算规则不变。

## 保留项与范围边界

|入口|基线定义数|当前定义数|
|---|---:|---:|
|applyItemScore|6|1|
|tryDefend|3|1|
|recordHistory|3|1|
|restoreStateFromSnapshot|2|1|
|undoLast|2|1|
|legacyUseItem|14|14|
|renderAll|3|3|
|renderGrid|11|11|


legacyUseItem 的14个定义仍保留，含有效的花类、连续使用、红龟壳无目标消耗、持续状态、All In和表现适配。renderGrid/renderAll 的排序、卡片状态、分数冻结和攻击渲染门也保留。CSS 的48份重复叶规则正文不能证明层叠等价，不删除；1691个!important并非本轮引入。音频／IndexedDB、自定义音轨、节拍和资源存储未重写。定时器／监听器完整静态索引已生成，尚未证明所有运行时退出路径均释放。

因此，**本轮不是26道具注册表、统一比赛状态机、所有音频资源作用域或全CSS治理的完成声明**。不安全删除一律保留并登记 GP-011/012/013/014、RF-001～005。

## 代码规模与覆盖链指标

|观察指标|最新开发基线|本轮结果|
|---|---:|---:|
|sourceBytes|808989|811037|
|sourceLines|19204|19378|
|functionDefinitions|783|784|
|duplicateNames|85|82|
|extraDefinitions|194|185|
|capturedWrapperAliases|111|100|
|timerAndListenerCalls|265|265|
|cssLeafRules|1529|1529|
|exactRepeatedCssBodies|48|48|
|important|1691|1691|
|buildBytes|7635132|7637234|


指标口径：生产 src 的 script/core/ui/style JS和CSS，不含内置资源正文与测试；命名函数含局部作用域，重复名字不等于全局覆盖；包装器数为捕获已重定义函数的标识符别名，不能当作全部动态层数。CSS按静态叶规则索引，不做层叠等价断言。基线发行体积由起点源码重建计算，避免把起点仓库中旧dist错误当成新源码产物。

新增纯命令模块、规范接口和错误分支使行数／构建体积略增，但有效覆盖链和捕获别名减少。没有用体积下降作为删功能的理由。所有27个原始Base64资源完全保留，最终两个 HTML 内容一致，SHA256：`021710b54f475eafae5d4a39d5f58324a0dde4c34cab081fce149916f40b194b`。

## 实际验收矩阵

|测试类型／场景|实际通过数|结果|证据|
|---|---:|---|---|
|Node 原生单元／集成及架构守卫|87|PASS|artifacts/refactor/final-verify.log|
|核心业务 Chromium|117|PASS|artifacts/browser-results.json|
|26 道具精确结果|26|PASS|artifacts/rule-oracles.json|
|真实作答／持久化|3|PASS|artifacts/scoring-persistence-results.json|
|桌面 UI|31|PASS|artifacts/desktop-ui/results.json|
|桌面交互|21|PASS|artifacts/desktop-ui/interactions.json|
|弹窗矩阵|99|PASS|artifacts/desktop-ui/modal-matrix.json|
|原 V2.18.15 的14组布局比较|3|PASS|artifacts/desktop-ui/battle-14-comparison.json|
|离线文档及归档冒烟|4|PASS|artifacts/desktop-ui/release-smoke.json|
|异步防御完整命令／真实按钮|30|PASS|artifacts/refactor/defense-command.json|
|新旧业务差分（隔离渲染和音效）|464|PASS|artifacts/refactor/legacy-differential.json|
|最新开发源码的14组布局比较|3|PASS|artifacts/refactor/layout/battle-14-comparison.json|
|新旧20/50/100回合观测|6|PASS|artifacts/refactor/performance-comparison.json|
|原防御令牌保护|10|PASS|artifacts/refactor/final-verify.log|
|批量学生赋分／原子撤销／溢出|1|PASS|artifacts/refactor/final-verify.log|
|Chromium file://直接打开|0|BLOCKED|企业策略 ERR_BLOCKED_BY_ADMINISTRATOR；未规避策略|
|浏览器原生工具栏80%–125%缩放|0|NOT TESTED|本轮缩放矩阵仅为应用现有CSS zoom|
|真实音轨节奏、过门和听感|0|NOT TESTED|本轮保留系统，模拟音频及初始化检查不能代替听辨|
|全部任意用户配置／小时级浸泡|0|NOT TESTED|20/50/100回合是短时观测|


完整命令：`npm run verify`。专项：`npm run test:refactor`。清单：`npm run audit:legacy`；通用源码索引：`npm run audit`；清单同步：`node scripts/sync-source-manifest.mjs`。

业务差分在真实Chromium运行新旧源码，但固定 Date.now 和 Math.random，并关闭渲染／音效以隔离规则；它不能代替UI和音频验收。4个原有异步缺陷组合不作为旧版正确结果接受，改用30项显式断言单独验证。没有删除失败断言或将BLOCKED计作PASS。

## 14小组验收基线

BATTLE_14_GROUPS_BASELINE：最新起点源码与当前源码分别在相同Chromium、视口、应用缩放、double模式、启用120px垫片和同一14组数据下测试。数据含长组名、12345678积分、负分、主次队列、冰冻／巨大蘑菇、已选答案、All In和不同颜色。逐卡记录位置宽高，所有必要按钮在卡片内；卡片、垫片、底栏几何容差1px且无新增文档滚动高度。

|视口|应用缩放|列模式／垫片|最后一排底部（旧→新）|工具栏顶部（旧→新）|文档高度（旧→新）|结果|
|---|---|---|---|---|---|---|
|1366×768|0.8|double／120px|535.22 → 535.22|714.41 → 714.41|823 → 823|PASS|
|1920×1080|1|double／120px|670.38 → 670.38|1013.00 → 1013.00|1126 → 1126|PASS|
|2560×1440|1|double／120px|551.53 → 551.53|1373.00 → 1373.00|1486 → 1486|PASS|


截图：`artifacts/refactor/layout/before/` 与 `after/`；全部逐卡DOM测量：`artifacts/refactor/layout/battle-14-comparison.json`。另保留旧V2.18.15对照。**这些是合成验收配置，未取得用户实际配置，不能声称复现了其真实课堂配置。** 原页面已有的文档滚动与应用缩放行为未擅自修改。

## 性能观测

环境：Chromium `154.0.8037.57`，Node原生测试版本见 final-verify.log；本地HTTP、1920×1080、四组、真实开始／判定与写入，先旧后新、每项单次，无人工停表或虚构指标。

|版本|连续回合|执行耗时 ms|DOM（前→后）|历史数|JS堆字节（单次）|
|---|---:|---:|---|---:|---:|
|before|20|504.70|1625 → 1625|20|17285299|
|before|50|1158.90|1625 → 1625|40|20284098|
|before|100|2251.50|1625 → 1625|40|26636432|
|after|20|425.00|1628 → 1628|20|32971238|
|after|50|1140.50|1628 → 1628|40|20363606|
|after|100|2477.70|1628 → 1628|40|25919043|


分数严格断言每回合每组+2，历史上限40；没有为了性能关闭这些业务。耗时受并行测试、缓存、GC和执行次序影响，不据此宣布加速比例。堆是采样值，不是强制GC后的保留量；短时DOM稳定不能证明小时级无内存／监听泄漏。

## 离线、CI与已知限制

- 单文件可以构建；check验证53段脚本语法、27个内置资源与无远端script/link依赖。已加载HTTP文档切离线后实际作答、五页导航、归档和导出通过。file://被企业策略阻止，未宣称直接打开通过。
- 只执行Chromium；没有Firefox/WebKit测试，没有任何CircleCI操作，也未启动远端GitHub Actions。现有Actions仍为手动触发，checkout改为完整历史以支持固定提交差分，未执行远端工作流；本地verify为实际证据。
- 80/100/125%仅为现有应用CSS zoom；原生浏览器缩放仍未验证。真实音轨听感、所有上传资源组合、小时级压力和完整动态可达性仍有缺口。
- 原有单排名权重池诊断warning仍在，不修改概率来消除日志。完整矩阵结论不能扩展成“所有浏览器、所有26道具交互维度全通过”。
- 开发过程首次差分出现54个时间戳差异，修正为新旧相同的固定时钟后全量断言不变；首次待决备份引用失败已修正为深拷贝。日志与失败JSON保留，reload-timeout记录旧的普通reload超时，最终使用真实CDP ignoreCache reload并保持恢复断言。

## 交付与下一步

交付源码、锁文件、构建脚本、`dist/godpower.html`、完整遗留索引、测试、截图和维护文档；所有改动为独立可回滚提交，不覆盖真实课堂数据，不强推。按既有授权继续同步原私有Sites，权限不变；发布结果以最终工具回执为准。

下一阶段优先领取：GP-016损坏主存档恢复、GP-017补齐道具交互组合、GP-011分批迁移legacyUseItem、GP-012比赛状态机、GP-013/RF-003资源作用域、RF-001渲染入口收敛、RF-002按组件验证CSS去重、GP-015完整资源备份、RF-005在允许file协议的环境验收。每项均有具体来源、依赖和验收标准，见 MAINTENANCE_BACKLOG.md。


## 最新欢迎分支补齐（674e12f 起点）

本轮未删除未证明安全的遗留业务代码。WelcomeV2 使用单一生命周期所有者替换该分支的新首页实现；顶部统计与首页共用纯 standings 模型，模型提前加载且无业务状态写入。原品牌SVG、比赛规则和14组几何保持不变。完整结果见 docs/reports/WELCOME_V2_COMPLETION.md。

最新静态规模已重新生成于 artifacts/refactor/legacy-inventory.json 和 docs/LEGACY_CODE_INVENTORY.md；其 before 为原治理基线079df31，不应误读为本轮674e12f的前后差异。指标只作观察，未以删代码数量衡量成功。


## 设置页清查与新UI补齐（e97933d 起点）

当前设置页清单、布局、动效、真实音频往返与验收范围见 docs/reports/SETTINGS_CLEANUP_ACCEPTANCE.md、docs/audit/SETTINGS_INVENTORY.md。最终同产物43个UI场景与阶段性157核心／31桌面场景分开记录，未将阶段测试合并为全量最终verify。

## 3.0.4判题治理

legacyJudgeRound从5处定义/覆盖变成1个明确兼容入口。移除四个旧包装器及其捕获别名，保留其有效行为在RoundSettlement/ItemEffects/Feedback各职责模块。基础+2/All In计算与预检复用同一纯函数。旧/新80种子（含4/14组、强力、冰冻、幽灵、空答、All In和溢出）结果完全一致，包含统计、库存、回合状态、720ms调度、音效/分数视觉事件。173项Node测试通过。更广回归结果随本阶段验收报告记录；不宣称14层旧道具链已处理完毕。


## 3.0.5道具链

旧入口14→1，已删除13层覆盖及仅服务旧链的局部辅助，保留兼容转发和全部共享函数。26oracle、464攻防差分、30异步防御、80回合与14组布局通过；详见reports/V3_ITEM_CHAIN_ACCEPTANCE.md和LEGACY_CODE_INVENTORY.md。


## 3.0.6 pure ranking and target policies (verified)

Extracted domain/competition/ranking.js and domain/items/targets.js; production ranking() and ItemOperationBlocks use these ports. Ranking is stable and nonmutating; target policy receives RNG and eligibility explicitly and returns original group references. Existing randomAhead comparator and RNG consumption are retained, not rebalanced. New 200 seeded ordering cases and17target contract/boundary tests were RED before implementation. Node195/195 PASS;464item-defense differential,448seeded draws,26oracle and configured-item tests PASS; Chromium core117/117 errors=[] at1920×1080 1x. file:// BLOCKED by managed policy. Evidence artifacts/v3-domain. No default storage cutover or achievement activation. Next: persistent migration verification journal and recovery distinction.
