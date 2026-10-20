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

## V3 UI 治理与插件基础阶段（2026-10-20 起）

| 场景 | 命令/证据 | 结果 |
|---|---|---|
| M0静态UI资产所有权与五页入口 | `npm run audit:ui` + `tests/unit/ui-ownership.test.mjs` | PASS；manifest 125块、五页、227静态ID无重复、102 inline入口（候选统计，非缺陷判断） |
| 单文件基线构建 | `npm run build && npm run check` | PASS；7,967,474 bytes，SHA-256 `ffa430c685d9be8b607d738ec4366293d07b9835477d49871b4554c0d9533352` |
| M0单元/集成 | `npm test` | PASS 246/246 |
| M0 14组浏览器几何 | `node tests/e2e/battle-layout.mjs` | PASS；Chromium 1920×1080 1x；自动fixture，非用户私有设置 |
| 五页/Picker基线截图 | `npm run test:ui-governance-baseline` | PASS；Chromium 1920×1080 1x，零pageerror；见 `artifacts/ui-governance-m0/` |
| 旧 desktop-ui 全流程 | 曾启动但未完成 | INCOMPLETE；一个抽签断言未在隔离复测复现；Escape断言未等待关闭动效，M2需用动画结束信号重测 |
| M1 页面注册协议 | 见下方 M1 已执行矩阵 | PASS |
| M2 页面dispose与动画清理 | `docs/ui-audit/M2-page-lifecycle.md` | PASS；详见下方 M2 已执行矩阵 |
| 插件安装runtime与权限/数据 | 未实施 | NOT TESTED |
| Electron/Windows | M2 HTML源代码同步待执行 | NOT TESTED |

### M1 已执行

| 场景 | 命令/证据 | 结果 |
|---|---|---|
| 注册表原子批次、scope、权限、字段/renderer allowlist、撤销 | `tests/unit/contribution-registry.test.mjs` | PASS 5项 |
| 五个core routes与plugin route声明/拒绝/撤销 | `npm run test:contributions` | PASS；Chromium 1920×1080 1x，0 pageerror，业务state不变 |
| 旧页面与14组几何回归 | `UI_GOVERNANCE_ARTIFACT_DIR=artifacts/ui-governance-m1 npm run test:ui-governance-baseline && node tests/e2e/battle-layout.mjs` | PASS；用户实际私有14组配置仍未验证 |
| M1全量单元/集成 | `npm test` | PASS 253/253 |
| M1构建/manifest/版本/资源 | `npm run build && npm run check` | PASS；版本3.0.25，产物SHA见`docs/ui-audit/M1-contribution-registry.md` |
| 页面lifecycle dispose、动画清理、插件中心 | 后续M2/SP05实现后执行 | NOT TESTED |

### M2 页面生命周期已执行

| 场景 | 命令/证据 | 结果 |
|---|---|---|
| DisposableScope清理顺序、错误收集、listener/timer/frame/observer/WAAPI取消、route替换 | `tests/unit/disposable-scope.test.mjs` | PASS 4项 |
| 跨页清理与业务状态隔离、窗口Escape退出动效 | `npm run test:page-lifecycle` | PASS；Chromium 1920×1080 1x |
| 全桌面UI及所有主页面抽验 | `node tests/e2e/desktop-ui.mjs` | PASS 23/23；Chromium 1920×1080 1x；0 uncaught error；`artifacts/ui-governance-m2/desktop-ui-results.json` |
| 14组布局 | `node tests/e2e/battle-layout.mjs` | PASS；原fixture布局比较 |
| M2全量单元/集成 | `npm test` | PASS 257/257 |
| M2 HTML构建/检查 | `npm run build && npm run check` | PASS；版本3.0.26 |
| Electron同版同步/插件中心/隔离sandbox | 下阶段同步或实现 | NOT TESTED |
