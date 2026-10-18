# 遗留治理最新测试矩阵

完整证据、条件与限制见 [REFACTORING_REPORT.md](REFACTORING_REPORT.md)。历史矩阵保留在 [audit/TEST_MATRIX.md](audit/TEST_MATRIX.md)。

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


## 最新欢迎分支验收（674e12f 起点）

最新实际结果见 `docs/reports/WELCOME_V2_COMPLETION.md` 和 `artifacts/welcome-completion/acceptance-matrix.json`。旧版报告保留为历史证据，不能用其中的旧dist状态和旧测试数量代替本轮结果。


## 设置页清查与新UI补齐（e97933d 起点）

当前设置页清单、布局、动效、真实音频往返与验收范围见 docs/reports/SETTINGS_CLEANUP_ACCEPTANCE.md、docs/audit/SETTINGS_INVENTORY.md。最终同产物43个UI场景与阶段性157核心／31桌面场景分开记录，未将阶段测试合并为全量最终verify。


## 道具积木与首页内容增量（2026-10-18）

| 场景 | 命令/证据 | 结果 |
|---|---|---|
| 配置、原子保存、UI模型与对比度 | npm test，131项 | PASS |
| 26道具基础效果 | tests/e2e/rules.mjs | PASS 26 |
| 默认道具×防御对照 | REFACTOR_BASELINE=d2b1bc9 node tests/e2e/legacy-differential.mjs | PASS 464 |
| 默认抽取有种子对照 | tests/e2e/item-draw-compatibility.mjs | PASS 448 |
| 异步防御生命周期 | tests/e2e/defense-command.mjs | PASS 27 |
| 自定义积木与独立流程 | tests/e2e/item-modules.mjs | PASS |
| 内容编辑/文件/独立游标/百科 | tests/e2e/welcome-content-editor.mjs | PASS |
| 14组DOM与截图 | artifacts/item-modules/layout | PASS，1920×1080/1× |
| 单文件构建/语法/嵌入资源/格式 | npm run build/check/format:check | PASS |
| file://离线直接打开 | artifacts/item-modules/file-offline.json | BLOCKED：管理策略 |
| Windows真机/投影/听感 | 无设备证据 | NOT TESTED |
