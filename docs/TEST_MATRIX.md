# 遗留治理最新测试矩阵

完整证据、条件与限制见 [REFACTORING_REPORT.md](REFACTORING_REPORT.md)。历史矩阵保留在 [audit/TEST_MATRIX.md](audit/TEST_MATRIX.md)。

## 官方玩法插件迁移（3.0.31）

### 道具设置归属迁移（3.0.32）

| 功能 × 场景 | 测试类型 | 结果 | 证据 |
|---|---|---|---|
| 主设置移除道具分类；旧导航兼容路由至插件工作区 | Chromium E2E 1920×1080 1x | PASS | `tests/e2e/item-modules.mjs`、`tests/e2e/settings-cleanup.mjs` |
| 每种道具抽取/使用配置、存储和刷新恢复 | Chromium E2E | PASS | `npm run test:item-modules`（26项规则，448种抽取情形） |
| 图鉴、图标维护和批量恢复取消确认 | Chromium E2E | PASS | `tests/e2e/miyamoto-plugin.mjs`、`tests/e2e/settings-cleanup.mjs` |
| 30组道具音效、BIN导出与隔离上下文导入 | Chromium E2E | PASS | `tests/e2e/settings-cleanup.mjs` |
| 插件页动画、设置与弹窗关闭动画 | Chromium E2E | PASS | `tests/e2e/motion-unification.mjs`（18/18） |

| 功能 × 场景 | 测试类型 | 结果 | 证据 |
|---|---|---|---|
| 内置 `official.miyamotos-power` 安装、激活及 page/settings 贡献注册 | Chromium E2E | PASS | `tests/e2e/miyamoto-plugin.mjs` |
| 主设置移除旧道具总开关，插件工作区显示兼容状态 | Chromium E2E | PASS | `artifacts/miyamoto-plugin/workspace.png` |
| 道具百科读取当前 26 项实际定义 | Chromium E2E | PASS | 同上；检查 `ice_flower` 名称 |
| 关闭道具、旧键保存、刷新后恢复关闭状态 | Chromium E2E | PASS | `artifacts/miyamoto-plugin/disabled.png` |
| 停用玩法插件不清理或改写旧设置键 | Chromium E2E | PASS | `tests/e2e/miyamoto-plugin.mjs` |
| 新竞技规则及完整道具引擎迁移 | 规则/事务/Electron | BLOCKED | 先解决 `competition-rules-difference-matrix.md` 中 Needs review 项并冻结旧规则差分 |

本阶段 UI 浏览器只测 Chromium 1920×1080、deviceScaleFactor=1；不运行 CircleCI。

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
| 声明式插件manifest/权限/生命周期/私有数据 | `tests/unit/plugin-platform.test.mjs`、`tests/unit/plugin-local-repository.test.mjs`、`tests/e2e/plugin-platform.mjs` | PASS；仅声明式JSON，不执行外部代码 |
| HTML六入口与14组布局 | `artifacts/ui-governance-m3/`、`tests/e2e/desktop-ui.mjs` | PASS；Chromium 1920×1080 1x |
| 可执行插件隔离沙箱/安装包签名/依赖迁移 | 尚未实现 | NOT TESTED |
| Electron插件broker/插件窗口 | 尚未同步此版本 | NOT TESTED |
| Electron/Windows | M2 HTML已同步至3.0.26；M3 HTML源代码待同步 | NOT TESTED |

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

### M3 插件平台基础（声明式）

| 场景 | 命令/证据 | 结果 |
|---|---|---|
| Manifest ID/SDK/平台/权限/路径/类型校验、拒绝JS入口和官方ID伪造 | `tests/unit/plugin-platform.test.mjs` | PASS |
| 默认拒绝、权限显式授予、注册批次失败无部分路由、scope切换撤销 | `tests/unit/plugin-platform.test.mjs` | PASS；7项 |
| 生命周期安装/启用/停用/恢复/隔离/卸载保留或清除私有数据 | `tests/unit/plugin-platform.test.mjs` | PASS |
| 私有数据revision冲突、10MiB/scope限额、失活token和启动恢复 | `tests/unit/plugin-platform.test.mjs` | PASS |
| localStorage读写回读、损坏数据不覆盖、写入失败可见 | `tests/unit/plugin-local-repository.test.mjs` | PASS 3项 |
| Plugin Center导入→审阅必需权限→启用→导航→停用→卸载 | `npm run test:plugins` | PASS；Chromium 1920×1080 1x；无pageerror |
| 六core routes与既有14组布局/全桌面交互 | `test:contributions`、`test:ui-governance-baseline`、`battle-layout`、`desktop-ui` | PASS；desktop-ui 23/23 |
| M3全量单元/集成 | `npm test` | PASS 268/268 |
| 可执行第三方JS、zip安装/签名、Electron隔离插件host | 未实现 | NOT TESTED；插件中心明示目前仅JSON声明 |

### M4 主题 Token 与安全文案贡献

| 场景 | 命令/证据 | 结果 |
|---|---|---|
| 固定主题颜色Token与hex值校验，拒绝CSS/URL/布局Token | `tests/unit/contribution-registry.test.mjs` | PASS |
| 有限文案Key、纯文本/长度限制及安全命名空间保护 | `tests/unit/contribution-registry.test.mjs` | PASS |
| Chromium插件安装、授权、主题/文案应用、停用后恢复 | `tests/e2e/plugin-platform.mjs` | PASS；1920×1080、1x、0 pageerror |
| 六页基线、14组布局、离线操作及旧Marx主题 | `ui-governance-baseline.mjs`、`battle-layout.mjs`、`release-smoke.mjs`、`marx-theme.mjs` | PASS；见 M4 审查记录 |
| 主题预览、完整scope层级、contrast检查、全量locale与Electron主题DTO | 尚未实现 | NOT TESTED；后续主题引擎任务 |

## 插件依赖版本约束（3.0.29）

|场景|结果|证据|
|---|---|---|
|非法/含糊依赖范围和同一依赖同时声明required/optional|PASS|`tests/unit/plugin-platform.test.mjs`|
|required依赖未启用、版本不符、跨版本激活|PASS|`tests/unit/plugin-platform.test.mjs`|
|`^` / `~` / `>= lower < upper`边界、零主版本caret、构建元数据比较|PASS|`tests/unit/plugin-platform.test.mjs`|
|被已安装插件引用的provider卸载保护|PASS|`tests/unit/plugin-platform.test.mjs`|
|插件中心受限JSON声明安装流程|PASS|`tests/e2e/plugin-platform.mjs`，Chromium 1920×1080 1x|
|Electron共享依赖范围合同|NOT TESTED|当前实现尚未提取到HTML/Electron共享协议包|


## 官方马克思主题插件迁移（3.0.30）

|场景|结果|证据|
|---|---|---|
|官方manifest受信任安装、权限授予和激活|PASS|`tests/e2e/plugin-platform.mjs`，Chromium 1920×1080 1x|
|主题贡献只通过宿主白名单token注册|PASS|`tests/e2e/plugin-platform.mjs`、`tests/e2e/marx-theme.mjs`|
|经典/马克思切换及旧主题偏好刷新恢复|PASS|`tests/e2e/marx-theme.mjs`|
|14小组比赛布局保持与主题差分验收|PASS|`tests/e2e/marx-theme.mjs`，Chromium 1920×1080 1x|
|Electron浮窗、全屏特效主题一致性|NOT TESTED|HTML主题catalog尚未同步到Electron本阶段验证|
