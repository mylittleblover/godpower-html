# 《上帝的力量》3.0.68 基线后续实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 HTML/Electron 3.0.68 已修复部分性能问题的基础上，完成剩余性能和数据治理，以及用户提出的 16 项新交互、规则、百科、随机事件、成就与安全 AI 能力。

**Architecture:** HTML 是比赛业务/统一状态/共享 UI 的唯一实现；Electron 负责原生窗口、受控 IPC 和单写入磁盘存储。可取消异步任务、存档 ID+版本、表现与业务分离；独立小任务迭代，不把已实现的 3.0.67/68 性能修复重写一遍。

**Tech Stack:** 原生 JavaScript/ESM、Node Test、Playwright Chromium、CSS + Web Animations API、离线单文件 HTML、Electron 44.9、electron-builder；任何新动画依赖必须先 A/B 证实收益。

**Spec:** `docs/superpowers/specs/2026-11-03-godpower-3-0-68-next-design.md`（上述文件在当前会话提供为 `godpower_3_0_68_updated_design.md`；请先拷入仓库、通过评审后执行）。

## Global Constraints

- HTML `refactor/semantic-style-governance` 当前 HEAD=`cffb111832ba70e88dfd0e6a75629dd94ce1914f`，Electron 同名分支 HEAD=`a1583fd4c1b2acd06bd66d2b382d5e886c250d21`。实际运行前重新 `git fetch`，确定未变，检查 dirty worktree；不从两个 `main` (3.0.64) 动工。
- Electron 构建已包含 HTML `ca1f7c5cd9ad30a6cd5fe0947cb3f8c83f423f66`；当前 HTML HEAD 后续仅 README 说明。遵守 `BUILD_INFO` 哈希，禁止直接改同步产物。
- **已完成不可重复造轮子：**快照稳定随机样式、隐藏欢迎页时钟/DOM 无效刷新、局部弹窗观察器、Electron FIFO 异步写+读回核验+退出等待。对这些只写守卫/做回归，不再次新增一套。
- 不恢复插件架构；保留 28 道具、60 成就 ID、16 个旧事件候选、旧备份/音乐/头像、14组真实布局和主课堂正常窗口。Windows 原生验收单列。
- 不清空用户 localStorage、IndexedDB、外部 JSON；旧数据迁移必须 staging、校验、回滚与来源保全；正式归档未确认落盘不得清零。
- 完整 TDD 流程：先红灯、定位原因、最小修改、绿灯、专项测试、独立提交。`NOT TESTED` 不得写为 `PASS`。任何新规则未签收不得作为默认硬编码。

## Review Focus（验收必须覆盖的五种边界）

1. Electron 主进程已有 FIFO，**但跨存档切换的 renderer 旧回调**仍可能滞后：不能将 A 存档结果落到 B，且不能重复奖励。
2. 14组同时有 FLIP、分数滚动、道具动画、输入焦点：增量 DOM 必须保住卡片位置/现行编辑行为，不因减少重建而丢失监听器。
3. 旧有教师+多课堂、当前实时组、损坏 envelope、大头像和历史40快照：迁移无重复、无资源失联、失败保留原字节。
4. 排名并列、少于5组、积分为0/负分、背包已满、全场唯一道具已持有：概率不除零、目标不重复、连续权重不越过禁止条件。
5. 随机事件与强力蘑菇同轮、成就归档/撤销、AI 写入：所有事实只有一次可审核事务，动画/网络失败不影响已经确认的数据。

---

## 阶段 0：冻结最新基线、读现有测试证据（M0 / P0）

### Task 0.1 3.0.68 双仓库可靠基线
**Files:** HTML `DEVELOPMENT.md`、`docs/performance/2026-11-03-PERFORMANCE_3.0.68.md`、`docs/MAINTENANCE_BACKLOG.md`；Electron `DEVELOPMENT.md`、`resources/BUILD_INFO.json`、`docs/performance/3.0.68.md`。
**Produces:** `docs/validation/BASELINE_3_0_68.md`，不改产品功能。
- [ ] `git fetch` 两仓库，核实 branch/HEAD、`package.json`、`BUILD_INFO`、未提交修改（原样保留），阅读 `AGENTS.md` 和架构文档。
- [ ] 记录 HTML 365 项、Electron 59+20 项为**历史报告**；当前 checkout 独立执行 `npm run build && npm run check && npm test` 和有关 E2E，Electron `npm test && npm run verify:bundle`，实际结果单独记录。
- [ ] 记录 3.0.68 已修复路径的回归防线，不把旧的“同步磁盘I/O→异步FIFO”等任务重新加入待办。
- [ ] 各仓库单独提交其测试证明与基线文档；不合并 main。

## 阶段 1：剩余真实卡顿分析与定点修复（M1 / P0）

### Task 1.1 重新采集 3.0.68 的热点画像
**Modify / reuse:** `tests/e2e/performance-diagnosis.mjs`、`tests/e2e/performance-experiment.mjs`、`tests/e2e/performance-snapshot-churn.mjs`、`tests/e2e/fullscreen-compositing-experiment.mjs`、`tests/e2e/hidden-welcome-performance.mjs`。
**Create:** `docs/performance/NEXT_BASELINE_3_0_68.md`（诊断与单机指标）。
- [ ] 录制 Chromium 1920×1080/DPR1 的14组判题、100次局部改分、道具抽取、点名滚动、切页和全屏演出；记录 `renderAll`, `renderGrid`, longtask、帧间隔、heap、节点数。
- [ ] 真实 Windows 机器单独测透明全屏/投影/PPT、系统 GPU/驱动、模糊和粒子。没有 Windows 数据则写 `NOT TESTED`，**不要因 SwiftShader 结果修改生产样式**。
- [ ] 大历史40快照+大头像/音轨/10k成员对照测 JSON stringify、存档写入 ACK、读文件、解码、资源回收与长期运行内存；与 3.0.68 小型测试数据分开。
- [ ] 每个问题建立 `cause/hypothesis/reproduction/owner` 记录，明确要动的最小函数和回滚阈值。

### Task 1.2 比赛 DOM 增量更新（以前述真实采样确认后实施）
**Modify:** `src/ui/battle-grid.js`、`src/ui/battle-card-view.js`、`src/ui/render.js`、`src/runtime/ui/score-dialog-and-animation.js`、`src/ui/disposable-scope.js`。
**Test:** 已有 `tests/e2e/battle-layout.mjs`、`tests/e2e/refactor-performance.mjs`、`tests/e2e/round-feedback-lifecycle.mjs`；新增 `tests/e2e/incremental-battle-grid.mjs`。
**Proposed interface:** `BattleGridView.reconcile(groups, uiState, changedIds, token): void`，保持旧 `renderGrid()` 对外入口。
- [ ] 先加红灯：相同状态刷新不应整批移除 group-card；比分改动不使直接编辑的数字输入框失焦；真实重排仍执行既有 FLIP；撤销清理未完成的动画。
- [ ] 将 `grid.innerHTML=''` 变为按 `groupUid/id` 调和 DOM（必要的卡片替换才替换），只对变化组刷新状态；不改变 `group-number`、原卡高度、双列垫片或排序规则。
- [ ] 异步卡片滚分与仪表/首页统计按帧合并，不能把图表改成不更新；保留渲染 owner 和外部命令可观测接口。
- [ ] 与 3.0.68 对照 trace/14组几何/音效/特效；没有超过噪声的收益就回滚具体优化，不能只改进理论指标。

### Task 1.3 点名转轮与资源负载专项
**Modify only on measured evidence:** `src/runtime/picker/selection-engine.js`、`src/ui/classroom-feedback.js`、`src/core/picker-bridge.js`（只维护 3.0.67 稳定快照合同）、Electron `renderer/picker.js`。
**Test:** `tests/e2e/performance-snapshot-churn.mjs`、`tests/e2e/picker-snapshot-stability.mjs`、`tests/e2e/electron-picker.mjs`；新增 `tests/e2e/picker-rolling-performance.mjs`。
- [ ] 给相同种子/输入的抽中结果、历史和动画播放次数先写红灯断言。
- [ ] 只有证明确实被双重绘制或无意义隐藏重绘的节点才做局部更新；不得改原抽签算法或偷删转轮演出。
- [ ] 扫描音频对象 URL、DecodeAudio、额外 timer/listener；逐项生命周期测试、资源计数曲线；不一口气更换动画库。

### Task 1.4 大存档 JSON 序列化与 Electron 持久化确认
**Modify:** HTML `src/infrastructure/save-file-bridge.js`、`src/runtime/storage/classroom-save.js`、`src/application/command-lifecycle.js`；Electron `desktop/save-file.cjs`、`desktop/windows.cjs`（只在必要时拓展）。
**Test:** Electron `tests/save-file.test.cjs`、`tests/save-quit.test.cjs`、`scripts/save-file-performance.cjs`；HTML `tests/e2e/scoring-persistence.mjs`、`tests/e2e/save-file-settings.mjs`。
- [ ] 先写旧 save-bridge fire-and-forget 的“UI已保存提示 vs 实际磁盘未落盘”复现；保留 3.0.68 FIFO 测试。
- [ ] 增加 revision 与异步 ACK/未保存提示合同、超大 payload 的序列化/读取压测；不恢复同步磁盘 I/O、不删除校验来提速。
- [ ] 实测大数据主线程阻塞后，局部拆分/去冗余历史资源或 worker 原型必须有数据兼容和性能收益证明；若无收益不并入。
- [ ] `read/setPath/reset/quit` 继续等待已接受队列；崩溃强杀后的未完成保存只保证上一个确认版本，不能假装已写入。

## 阶段 2：多存档 v2 与旧档自动迁移（M2 / P0）

### Task 2.1 v2 验证器与旧档映射预检
**Create:** `src/domain/save-document.js`、`src/application/save-migration.js`、`tests/unit/save-document.test.mjs`、`tests/unit/legacy-save-conversion.test.mjs`。
**Modify:** `src/domain/classroom-roster.js`、`src/infrastructure/classroom-roster-repository.js`、`src/core/reliability.js`、`src/manifest.json`。
**Interfaces:** `SaveSchema.validateV2(input)`；`SaveMigration.preview(source): {documents,report,warnings,sourceDigest}`；`SaveMigration.convert(preview): StagedSaveSet`。
- [ ] 红灯：旧多 profile/classroom assignment、仅实时比赛、冲突学生名、损坏旧数据、未知头像资源、重复迁移不丢分/道具/UID/成就。
- [ ] 实现只读预览+明确来源信息，分教师×课堂为候选独立档；保留原源副本和不可认定的字段，不自动合并同名不同人。
- [ ] 出具迁移映射收据（legacy key/source digest→saveId/resourceId），预检必须拒绝未能安全转换的数据并保留旧内容。

### Task 2.2 多存档储存与设置分离
**Create:** `src/infrastructure/save-repository.js`、`src/infrastructure/app-preferences-repository.js`、`src/ui/save-manager.js`、`tests/e2e/multi-save.mjs`；Electron `desktop/multi-save.cjs` 和对应测试（真实需要确认后创建）。
**Modify:** `src/runtime/storage/classroom-save.js`、`src/infrastructure/save-file-bridge.js`、`src/ui/classroom-roster-workspace.js`、`src/manifest.json`、Electron `desktop/contracts.cjs`、`desktop/windows.cjs`。
**Interfaces:** `SaveRepository.list()`、`load(saveId)`、`commit(saveId, expectedRevision, payload)`、`switchActive(saveId, generation)`；`AppPreferencesRepository.load/save`。应显式 Promise/ACK，实际语言类型以项目 JS 风格定义。
- [ ] 红灯：不同存档学生/赛季/成就/资源隔离，全局设置不会跟着切档变，修订冲突必拒绝，磁盘满/损坏只恢复上一成功版本。
- [ ] 先 staging 写新索引和所有档案（可验证）→确认→设置 activeSaveId；原始 classroom/roster/镜像不删，重复迁移幂等。
- [ ] 界面提供创建/复制/更名/切换/删除确认、导入/导出、备份/修复。切档必须先等待写入/取消旧 draw、hand、score、effect 和 picker 会话。
- [ ] Electron 按 saveId 保存文件时沿用既有 FIFO 原子写、锁定路径与退出等待，不新增直连 Node 给 renderer；隔离测试 `userData` + Documents/GodPower。
- [ ] 通过旧档到新档到重启/切档/导出回环测试；旧备份在新程序导入应有显式兼容入口。

## 阶段 3：举手与悬浮窗完整重做（M3 / P1）

### Task 3.1 权威手势状态机（先定交互，不再叠加旧覆盖）
**Create:** `src/application/hand-flow.js`、`tests/unit/hand-flow.test.mjs`。
**Modify:** `src/application/hand-raise-port.js`、`src/application/hand-selection-sync.js`、`src/ui/electron-host.js`、`src/manifest.json`。
**Interfaces:** `HandFlow.reduce(snapshot, action): {next,commandIntent,presentationIntent}`；状态 `CLOSED/SELECT_GROUP/JUDGE/REWARD_CHOICE/SCORE/DRAW/USE`；动作 `ENTER/SELECT/JUDGE_OK/JUDGE_WRONG/SELECT_SCORE/SELECT_DRAW/SELECT_USE/COMPLETE/CANCEL/EXIT`。
- [ ] 红灯：正确/错误一次、正确的三操作选择、重复点击不加第二次分、切档旧 token 被拒、撤销/关闭演出不重执命令。
- [ ] 建立一份 session+generation+saveId+revision 契约；使用旧 `HandRaisePort` 的合法判定/计分/抽取/用道具命令，表现不写业务字段。
- [ ] 当前默认一次正确判定只完成一项奖励，作为规格待签收项；奖励不合法时显示原因且不消费会话。

### Task 3.2 主比赛界面卡牌流程
**Create:** `src/ui/hand-flow-view.js`、`src/styles/classroom/hand-flow.css`、`tests/e2e/hand-flow-cards.mjs`。
**Modify:** `src/runtime/classroom/hand-reward-controls.js`、`src/runtime/ui/battle-appearance-and-hand-rewards.js`、`src/runtime/picker/classroom-tools.js`、`src/index.template.html`、`src/manifest.json`。
- [ ] 红灯：举手模式只有背景压暗，小组卡正常亮度且可点击；14组和缩放下仍可选择；再点举手退出。
- [ ] JUDGE 两张大卡，正确跳三奖励卡，错误回选组；分数六预设用 `ClassroomFeedback` 的已有配置和自定义安全整数输入。
- [ ] 抽取和用道具分别统一“事务决定结果→全屏演出→完成回选组”，保留声音/头像展示和可取消、不重复随机/计分。
- [ ] 移除旧多层 `judgeHandRaise` 包装链（先做差分/回归），验证全28道具、异步防御、撤销、焦点/Escape/后台阻断。

### Task 3.3 Electron 悬浮窗与原生抽取演出
**Modify:** Electron `renderer/picker.js/html/css`、`renderer/effect.js/html/css`、`desktop/contracts.cjs`、`desktop/windows.cjs`、HTML `src/ui/electron-host.js`。
**Test:** HTML `tests/e2e/desktop-hand-controls.mjs`、`tests/e2e/dock-hand-item-fx.mjs`；Electron `npm run test:desktop` 与新增专用原生 e2e。
- [ ] 举手名单一行一组，点组进入正确/错误卡，不用点名预选池冒充举手；正确后走同一奖励流。
- [ ] 悬浮窗道具抽取增加真实全屏滚动/揭晓动画；来自主进程唯一的已提交结果，跳过不会重新抽取。
- [ ] 全屏卡牌与个人/小组头像遵守 IPC payload 白名单、体积限制；主窗隐藏/快速关闭/跨屏/置顶/焦点/重复手势回归。

## 阶段 4：页面、成员、视觉、功能退役（M4 / P2）

### Task 4.1 玩法页、关于归设置
**Create:** `src/ui/gameplay-page.js`、`src/styles/classroom/gameplay-page.css`、`tests/e2e/gameplay-page.mjs`。
**Modify:** `src/ui/about-view.js`、`src/runtime/ui/settings-and-about.js`、`src/ui/settings-layout.js`、`src/ui/desktop.js`、`src/index.template.html`、`src/manifest.json`。
- [ ] 红灯：28道具/七状态完整由真实 definitions 渲染，切主题、DeepLink、键盘、关闭、旧导航入口不丢。
- [ ] 增加一级玩法页，把关于信息移到设置；禁重复文案数据和第二套隐藏旧组件。
- [ ] 与 3.0.66 CSS 守卫、组件目录、五页旧基线改成新六页准确验收；不能为了过测试直接删除旧断言。

### Task 4.2 移除网页课程表/资料库
**Modify after dependency audit:** `src/ui/teaching-workspace.js`、`src/ui/teaching-resource-workspace.js`、`src/domain/teaching-schedule.js`、`src/domain/teaching-resource.js`、`src/infrastructure/teaching-*.js`、`src/manifest.json`。
- [ ] 列出入口、存储键、资源引用和 Electron 未来保留/接管约束，写 source-retirements 与迁移证明。
- [ ] 只退役已无共享依赖的 Web UI/实现，不删除旧数据与导出能力，不误删欢迎页每日知识卡或课堂学生名单。
- [ ] HTML 离线构建、首页/设置/数据/14组和 Electron 同步测试全部通过。

### Task 4.3 小组成员可视化与主题色数字/奖牌
**Create:** `src/ui/group-member-picker.js`、`tests/e2e/group-member-picker.mjs`。
**Modify:** `src/runtime/items/group-window.js`、`src/ui/classroom-roster-workspace.js`、`src/ui/battle-card-view.js`、`src/ui/battle-grid.js`、`src/styles/battle/group-cards.css`、`src/styles/battle/score-and-state.css`。
- [ ] 红灯：按 `studentUid` 新增/移出、学号重名、头像保留与旧文本导入；浅色数字必须保留原 `g.color` 且可读。
- [ ] 实现从当前存档学生池搜索/多选/新增，保护单组身份/不可共享约束；积分采用中性深底亮字而不是改颜色。
- [ ] 排名1金/2银/3铜，其他中性；同分排名策略不影响权威排序；测试两主题、14组、长名、六七位积分、编辑焦点。

### Task 4.4 点名与道具全屏头像
**Modify:** HTML `src/runtime/picker/selection-engine.js`、`src/ui/classroom-avatar-display.js`、`src/ui/item-score-cinematics.js`、`src/ui/electron-host.js`；Electron `desktop/contracts.cjs`、`renderer/effect.js/html/css`。
- [ ] 三种点名模式/发动方/受影响组的头像 DTO 白名单和旧存档无头像回退红灯测试。
- [ ] 转换有界WebP/资源引用，展示缺失/损坏头像回退；不得把学生头像数据跨档使用或冒充个人成绩。
- [ ] 原生全屏、主窗隐藏、PPT、多屏、skip 和老版本备份回归。

## 阶段 5：规则精确变更与平衡验证（M5 / P2～P3）

### Task 5.1 先给28道具做可复现强度审计
**Create:** `scripts/item-balance-simulation.mjs`、`docs/validation/ITEM_BALANCE_3_0_68_BASELINE.md`、`tests/unit/draw-policy.test.mjs`。
**Read:** `src/items/catalog.js`、`src/items/operation.js`、`src/items/round-effects.js`、`src/runtime/items/drop-midfield-weights.js`、`src/runtime/items/first-hand-pool.js`、`src/runtime/items/weighted-selection.js`、`src/domain/items/targets.js`。
- [ ] 为 28 道具分别列效果、次数、实际目标、免疫、防御/持续状态、背包及唯一性限制和成功率/实际积分变化 oracle。
- [ ] 固定随机种子，4/8/14/20组、近似均分/两倍差/负分/并列/满包及防御存在的场景各作充分可复现抽样，导出概率、积分期望和排名改善分布。
- [ ] 单独标记与旧分区“前三专属/后30专属”冲突的连续权重变更清单，评审后才可修改生产权重。

### Task 5.2 明确的绿龟壳/蘑菇/强力蘑菇/目标池改动
**Modify:** `src/items/catalog.js`、`src/items/round-effects.js`、`src/domain/items/targets.js`、`src/runtime/items/definitions-and-state.js`、`src/application/round-settlement.js`、`src/ui/round-feedback.js`、百科文案与测试。
**Test:** `tests/e2e/rules.mjs`、`tests/e2e/items-status.mjs`、`tests/e2e/item-draw-compatibility.mjs`；新增 `tests/unit/item-rules-changes.test.mjs`。
- [ ] 红灯断言：绿/三绿每次目标 `-round(score/3)`；蘑菇/三蘑每次自身 `+round(score/3)`；原次数、撤销、免疫、负分和其它 24 道具不变。
- [ ] 强力蘑菇 5 次有效答题，结算前名次快照及结算后指定超车+1；多人/并列/已有自然超车/目标分变化情形先写 oracle 再实现，消耗次数与视觉一致。
- [ ] 从实际 target selector 提取审定的随机范围道具白名单，池=前3∪后2（排除自身和不合法目标，重叠去重）；空池不得消耗道具。
- [ ] 同步道具百科、所有配置/效果层和旧版测试；不在另一份 legacy wrapper 再加覆盖层。

### Task 5.3 连续道具概率替换旧硬分区
**Create:** `src/domain/items/draw-policy.js`、`tests/unit/draw-policy-continuity.test.mjs`。
**Modify:** `src/runtime/items/drop-midfield-weights.js`、`src/runtime/items/first-hand-pool.js`、`src/runtime/items/weighted-selection.js`、可能的 `src/items/draw.js`（实存路径先核查）。
**Interface:** `DrawPolicy.weights({ranking,groupId,scores,inventory,field,firstHand,config}): Record<ItemKey,number>`。
- [ ] 红灯：同区后位强力倾向增强、跨边界不出现完全断档、有正向两倍分差则高影响道具概率增强、唯一性仍生效、总权重安全且可归一化。
- [ ] 将现有所有 `itemDropWeights` 包装路径统一到**一个权威规则 owner**；首次举手特殊池、全场唯一、库存去重和条件禁用在最后过滤。
- [ ] 旧/新版本同种子分布对照，经评审签收才替换默认；所有比例/禁止例外进入版本化可查规则。

## 阶段 6：自动事件与60成就（M6 / P3）

### Task 6.1 EV01～EV16 事件表与确定性事务
**Create:** `src/domain/competition/random-events.js`、`src/application/random-event-engine.js`、`tests/unit/random-events.test.mjs`、`tests/e2e/random-events-lifecycle.mjs`。
**Modify:** `src/application/round-settlement.js`、`src/domain/events.js`、`src/runtime/storage/classroom-save.js`、`src/runtime/archives/settlement-actions.js`。
- [ ] 按旧 Superpowers 候选事件逐项锁定效果/目标/持续期/权重与当前7状态合法性；未确认项不得上线。
- [ ] 以可存档 PRNG (seed,state,cursor) 隔离 4～8 回合间隔、事件和目标抽取；同一正式答题结算原子提交，撤销恢复原样。
- [ ] 事件自动选择/执行/展示，不需要任何人工确认；新事件的持续效果下一回合才生效；无合法候选记录并重抽间隔。
- [ ] 每个事件有确定性 oracle、冲突/冷却/导入/撤销/播放跳过/权限/多存档回归。

### Task 6.2 60成就规则与档案页
**Modify:** `src/domain/achievements/catalog.js`（ID保持）、`ledger.js`、`learning-rules.js`、`src/domain/events.js`、归档和档案页当前实现。
**Create:** `src/domain/achievements/competition-rules.js`、`collection-rules.js`、`honor-rules.js`、`src/ui/achievement-archive.js`、`tests/e2e/achievement-archive.mjs`。
- [ ] 为 60 项逐个出事件事实、触发条件、永久/赛季、撤销、迁移、规则版本 matrix；真实可证明的先实现，旧数据不臆造。
- [ ] 扩充 `AchievementLedger` 的正式赛事/库存/防御/赛季事实入口，防止重复事件、人工改分冒充正式成就，三重道具按实例算。
- [ ] 档案显示进度、解锁时间、隐藏成就和跨赛季统计；归档失败所有数据留原样，撤销不会产生幽灵永久荣誉。

## 阶段 7：安全 AI 与双平台完整验收（M7 / P4）

### Task 7.1 AI 对话及人工授权写入
**Create:** `src/application/ai-tool-gateway.js`、`src/ui/ai-chat.js`、`tests/unit/ai-tool-gateway.test.mjs`、`tests/e2e/ai-confirmation.mjs`；Electron 可选安全代理独立实现。
- [ ] 先定只读查询 schema 与不联网/没有 key 的离线降级，学生隐私字段默认不外发。
- [ ] 添加写入白名单 `{saveId,expectedRevision,commandId,intent,params}` → 预览变化 → 教师明确确认 → 同一权威课堂命令；模型响应不能生成可执行 JS/任意文件路径/越权 IPC。
- [ ] 测提示注入、重复确认、过期存档/版本、撤销、联网错误与竞态；AI 失败不能妨碍课堂继续。

### Task 7.2 双仓库验证与可复现交付
**Files:** 两仓库版本/锁文件、发行文档、`resources/BUILD_INFO.json` 与 `scripts/sync-html.mjs`。
- [ ] 每次 HTML 提交后执行 `npm run build`, `npm run check`, `npm test`, `npm run format:check`, 相关 E2E、源/组件目录守卫、14组截图；新视图需要新增对应真实断言。
- [ ] Electron 仅从**干净、已提交的 HTML 构建**进行 `npm run sync:html`；检查实际 `sourceCommit`、文件哈希、tooltip共享路径与发行版本，再运行 `npm test`, `npm run verify:bundle`, `npm run test:desktop`, `npm run build:win:cross`。
- [ ] Windows 本机 `npm run test:windows` + 教师实际课堂场景：投影/PPT、置顶浮窗、多屏DPI、触屏/软键盘、30分钟音效与100回合、旧格式自动迁移。未执行就明确 `NOT TESTED`。
- [ ] 正式发行提供版本差分、已测范围、SHA256、旧档备份/回滚、已知限制、完整包核验。只有审核通过才合并或发布。

## 每个 Task 的固定 TDD / 提交合同（执行者不得跳过）

1. 先记录 `git status --short` 和当前 HEAD，在各自仓库创建隔离 worktree / 专题分支，保护既有未提交修改。
2. 给任务指定的 test 路径新增**一条精确红灯断言**，先单独运行并保留失败日志，例如：`node --test tests/unit/<该任务新建测试>.test.mjs`，或 `node tests/e2e/<该任务新建场景>.mjs`。实际命令以存在的脚本为准；不得把环境问题伪称预期红灯。
3. 只修改本 Task 指定责任 owner，运行同一用例到 PASS，并补异常/撤销/重复点击边界测试。对异步命令必须检查 `saveId/revision/session`（在迁移完成前使用现有命令所有权）。
4. HTML 任务至少复跑单元、构建、check 和有关真实 Chromium E2E，涉及 CSS 还要格式、组件目录、两主题/14组几何；Electron 任务至少复跑 `npm test`、`npm run verify:bundle`、实际 `test:desktop` 场景。
5. 更新相应性能/数据/维护文档，把 `PASS / FAIL / BLOCKED / NOT TESTED` 严格区分；仅暂存本任务文件、单独提交，提交信息包含任务 ID；未经明确批准不合并 main、不发布、不强推。

## 依赖与不同于旧3.0.67计划的调整

| 里程碑 | 独立验收结果 | 依赖 |
|---|---|---|
| M0 | 两仓库 3.0.68 锁基线；保留历史 365/59/20 报告但本地真实复测 | 无 |
| M1 | 解决确认过的剩余渲染/滚动/大数据问题，**不再做已完成FIFO改造** | M0 |
| M2 | v2 多存档与设置分离；自动旧档迁移、跨档 ACK | M0，M1存档采样可并行 |
| M3 | Web+Electron 同源举手状态、卡牌、原生演出 | M2 的 saveId/generation 语义 |
| M4 | 玩法/关于/成员/头像/视觉/退役教学模块 | M2；可部分独立并行 |
| M5 | 规则 1/3、五轮、候选范围、评估后连续权重 | M0；模拟先于生产规则 |
| M6 | 16自动事件、60成就与档案可靠归档 | M2 + M5 规则/事务基础 |
| M7 | AI 写入边界、Windows 真机验收与发行 | M2～M6 |

**旧计划中已取消的错误待办：**“修复尚未实现的随机特效快照”“隐藏欢迎页刷新”“按窗口 MutationObserver 过滤”“把 Electron 同步磁盘写改为 FIFO 异步”。这些已由 3.0.67/3.0.68 完成，只保留回归测试。**新的主要风险** 是大存档主线程序列化、多存档事务、比赛 DOM 全量更新和 Windows GPU 全屏合成，不能因为修复了一部分就宣称“卡顿已彻底修复”。

**执行交接：**本文件是依用户要求重生成的**设计待审实施计划**，不是代码改动、提交、构建或自动发布记录。设计中未由用户定稿的核心规则应在对应阶段签收，不能由 Codex 自行变更游戏玩法。
