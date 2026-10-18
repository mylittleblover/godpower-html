# 后续 Codex 维护说明

> 当前用户约束（2026-10-18）：UI仅测试Chromium、1920×1080、1×（应用100%、DPR1）。日常运行 `npm run test:design`，按改动补充业务专项；不自动运行旧全量多尺寸/多缩放矩阵。禁止CircleCI操作，禁止Firefox/WebKit。旧文档的三尺寸要求以此条为准。

1. 先读 ARCHITECTURE、DATA_SCHEMA、MAINTENANCE_BACKLOG 和最新 ACCEPTANCE_REPORT；检查 git status、分支、提交，不覆盖未提交工作。基线 HTML 只读。
2. 领取维护任务编号，补最小可复现测试；用隔离 Playwright context 和合成名单，禁止接入真实课堂 profile。测试种子固定为21813。
3. 新规则进入 `src/core` 的校验／计算／命令接口；禁止覆盖 public useItem、judgeRound、saveState 或在文件末尾追加版本补丁。旧适配层只做逐块替换，保留行为对照证据。
4. 涉及分数、道具、归档、导入、撤销时，必须测成功、失败、重复操作、刷新恢复及存储异常。新字段同时更新 normalizeGroup、快照、schema 文档、迁移样例和测试。
5. 构建 `npm run build`；`npm run check` 验证语法和27资源完整性；`npm test` 执行业务与存储集成；`npm run test:e2e` 执行真实 Chromium；按用户最终要求不再追加 Firefox／WebKit。检查返回码，不能只读控制台最后一行。
6. `npm run audit` 重新生成源码目录；更新 TEST_MATRIX、UI_AUDIT、ACCEPTANCE_REPORT 和维护任务状态。不能把 NOT TESTED / BLOCKED 计为 PASS。失败日志、状态、截图先保存，再定位根因；不要为了绿灯降低断言。
7. 截图目录按浏览器隔离；旧版截图和历史失败日志不随最终基线更新而删除。视觉差异必须逐项分类。人工听感、真实投影、触摸与辅助技术检查不能用自动截图代替。
8. 发布前无未处置 P0；确认构建两次哈希一致、资源不丢失、HTTP与file结果明确、离线不访问远端；带上 JSON迁移说明、测试报告和已知限制。未达完整验收时使用候选发布描述。
9. 每次发现缺陷新增 GP 编号并记录证据、复现、风险和验收；修复后保留完成记录与 commit；每次重构记录移除的包装器和测试覆盖；每次 CI 失败记录处置。维护列表是 PR 检查项。
10. 按逻辑模块提交，禁止 force push。回滚用 git revert；数据回滚使用先前导出的备份，不执行清空存储。远端 CI 需要凭现有授权运行，禁止购买额度或升级付费服务。

## 人工音频验收

在隔离浏览器中导入一套有效音轨和每道具音效，保留音频 BIN。首次点击前观察自动播放限制，点击后确认恢复。以130 BPM／4拍和第8套135 BPM核对思考、战斗、过门、下一小节结算、循环边界；开关 All In 到达／退出三分之一阈值，确认无重复叠音。逐一调节主音量、音效音量并试听自定义槽，快速切页和连续开题／结题，关闭举手／点名窗口，验证循环停止。暂停设备或更换输出后恢复。记录操作、轨道、浏览器、听感、延迟及异常，不能只填写“正常”。

## 维护任务领取模板

“执行 GP-xxx。基于最新分支，不修改 baseline；先补复现测试，修改稳定业务入口，保留原规则与资源；运行相关测试与完整回归；更新四份审查／验收文档及 backlog，按模块提交。”

## 桌面 UI 维护流程（V2.19.0）

先阅读 `docs/ui/UI_DEVELOPMENT_CONSTRAINTS.md` 与 `docs/ui/DESIGN_SYSTEM.md`。新 UI 使用现有 token 和组件接口；不得新增同名全局覆盖或版本尾部 CSS 修补块。UI 事件不可决定业务结果。

1. 检查工作区，在独立分支记录基线提交。
2. 任何比赛布局改动先运行 `node tests/e2e/battle-layout.mjs`，保留原截图和每张卡片尺寸；用户配置未知须标注。
3. 集中实现相关组件，再执行 `npm run verify`。日历、题库或快照差异变化须补模型测试。
4. 查看截图，不能仅依赖图片生成成功。检查空/大量/边界数据及缩放、隐藏底栏、键盘与危险确认。
5. 更新维护任务、设置清单、证据 JSON 与验收报告。失败先保留日志，再修复；不删除失败断言。
6. 构建时校验 27 个原始内置资源和离线发行。file:// 被环境策略阻止时记 BLOCKED，不算通过。
7. 不执行 CircleCI。现有 GitHub Actions 仅手动运行；本地验证结果与远端 CI 分开报告。
8. 精确提交推送到既有 Sites 源码分支，按同一提交打包后更新原 Sites；保持现有私有访问范围。凭据只进临时进程内存，不进入参数、仓库或报告。

HTTP 浏览器测试服务统一返回 `Cache-Control: no-store`，可使用 Playwright routing 隔离缓存。该环境曾在未修改基线和修改版本中出现大单文件重载超时，保留了诊断日志；不得静默放宽业务断言。

## 遗留治理工作规则（2026-10-17）

开始时 fetch 并核对全部开发分支；记录实际基线，不以文件名中的旧版本号决定起点。使用独立分支和模块级提交。运行 `npm run audit:legacy` 更新所有旧入口、捕获别名、样式及定时器索引；静态“没有调用”不等于动态不可达。

`useItem / applyItemScore / tryDefend / saveState / recordHistory / restoreStateFromSnapshot / undoLast` 已有单一定义架构守卫，禁止重新加入同名覆盖层。替换 legacyUseItem 或渲染层前，逐一记录其输入、前置条件、目标选择、库存消耗、计分、状态、All In、历史和视觉通知；证明替代覆盖全部有效行为再删除。没有证据的代码保留并建立具体任务。

每批先跑相关单元及 Chromium 专项，再提交。最终 `npm run verify` 包括业务、UI及重构矩阵；`npm run check` 还要求 manifest 与模板相符，源码块改变后运行 `node scripts/sync-source-manifest.mjs`。保留失败日志，不能以更换预期或更新所有截图掩盖回归。差分测试固定时钟和随机数，人工听感与file协议阻塞明确单列。

命令待决期间不得直接保存其局部库存结果或导出局部状态。新异步步骤必须登记在 CommandLifecycle；接受与拒绝是同一操作的结果，取消恢复操作前状态。直接内部效果调用仅是兼容路径，不得把它当作新的业务命令入口。

维护列表每次发现、修复和发布均更新；下一批删除前保留相同数据和配置的14组浏览器基线。实际用户配置未知必须注明，禁止把合成配置写成真实课堂复现。保留单文件构建及27个原始资源；不得删除用户课堂数据。仅测试Chromium，不运行CircleCI，GitHub Actions按既有手动触发策略保持不变。

## 欢迎页分支交付检查

新增启动入口后，依赖后续业务的浏览器fixture使用 `dismissStartup(page)` 通过实际跳过按钮进入；专门的启动测试不能绕过它。刷新后也必须完成真实入口交互，不能强制点击遮罩下控件或删除原业务断言。

`npm run test:welcome` 包含原启动测试、新入口／动效／数据／离线专项，以及基于674e12f源码的14组对照。改变欢迎布局和动画后必须检查同SVG节点、FLIP终点、焦点／inert清理、motion偏好、乌贼遮蔽和同分顺序；仅生成截图不代表通过。`npm run verify` 保留全部既有核心、UI和重构回归。最后生成两份一致的dist并按现有授权同步原Sites，访问权限不变。


## 设置页新增与验收约束

- 新控件必须在模板声明data-settings-category/group，不能按文案正则或沿用上一个元素的分类。不要更换原ID、事件入口及存储键来移动位置。
- 音频包迁移、题库、批量图片等低频操作放到所属分类折叠区域，不进全局页头。危险操作须独立样式、影响说明与真实确认。
- 分类资源刷新由DesktopUI.selectSettings统一调用；兼容导航只委派，不叠加旧刷新包装。异步UI提交使用代次校验。
- 动效复用统一WAAPI服务；切换、Esc、离页、关闭动效和系统偏好要清理。检查getSettingsMotionCount归零，不用固定延时冒充清理完成。
- 运行npm run test:settings：原控件与事件入口逐项检查、八分类三个视口、九个应用CSS缩放、正常和展开状态、真实文件上传／下载／导入、取消危险操作与真实保存恢复。原生浏览器缩放另行验收。
- 新增或删除实际功能时，先更新docs/audit/SETTINGS_INVENTORY.md及对应测试。不得直接覆盖210项原参考清单来掩盖入口丢失。
- 下载／文件选择事件与点击在Promise.all中共同等待，避免失败时遗留未处理的事件Promise；原生装饰开关应点击其真实label，不强制穿透。

## 全局功能界面修改

修改 `ui/application-surfaces.css` 后，运行 `npm run test:surfaces`，涉及模态结构时追加窗口尺寸矩阵，涉及比赛表面时与基线 `f2b39e6` 做14组尺寸对比。新窗口必须接入现有模态关闭/焦点与动画取消机制；导航启动动画仍由 WelcomeV2 统一所有。历史/档案页不可恢复成随记录数无限撑高页面的外层滚动。验收证据必须标注产物SHA和应用缩放方式。

本轮新增 warning-dialogs 与 admin-dialog 测试。遇到输入框回车后弹出新窗口，必须验证事件默认动作不会立即激活新窗口按钮；验证视觉层级与焦点栈一致。动态移除或同ID替换窗口必须取消旧待决操作并恢复焦点。动画等待必须包含排队中的requestAnimationFrame，最终断言仍为严格零残留。

### 课堂反馈组件回归

修改六槽赋分、抽取转轮、全屏演出、按钮声音或课堂行为设置时，执行 `npm run build && npm run check && npm test && npm run test:classroom-feedback`。音效调用改动后再执行 `node scripts/audio-inventory.mjs`，不能仅凭扫描结果声称每个道具场景已真实操作。新增跳过演出的按钮复用 ui-cinematic-skip，作为动画表面的兄弟节点，固定在页面右下角；不要将其放入中心标题或会 transform 的内容容器。

课堂行为的两个开关使用 ui-rule-card 和 v292-switch。保留动态 pane 所有者、旧 ID、原 onchange 和持久化字段，测试等高、标题与开关对齐、键盘操作及重载。不要通过改比赛卡片或底栏尺寸补偿设置页问题。

### 比赛动画维护

遵循 `docs/ui/BATTLE_MOTION.md`。新增反馈接入 BattleMotion，不能在卡片根节点叠加 transform 或由动画计算业务结果。取消效果时确认已提交的视觉快照；用回归证明后续新事件仍能播放。新按钮先复用 ActionSounds 稳定意图槽，必要时扩展元数据及分类测试，避免根据按钮文案随机命名存储键。

## 单一所有者与本轮回归入口

- `renderAll/renderGrid` 只能在 `src/ui/render.js` 声明；卡片DOM在 `ui/battle-grid.js`，业务判定留在core/旧规则适配器。`canonical-entrypoints` 会拒绝再次覆盖这些入口。
- 生命周期订阅使用 `Reliability.onDefenseInvalidation(handler)`；返回解除订阅函数。UI不能替换命令取消。当前通知同步、按注册顺序执行，异常会向上传播；未来引入可能抛错的订阅前先设计异常隔离和回归。
- 删除脚本前检查AST及捕获调用链，迁移有效行为，再移除模板块并运行 `node scripts/sync-source-manifest.mjs`。`empty-source-blocks` 防止重新加入无执行内容的脚本。
- 全仓库清单可指定本轮基线与证据目录，避免覆盖历史报告：
  `LEGACY_BASELINE=9e1be3c LEGACY_ARTIFACT_DIR=artifacts/structure LEGACY_DOCUMENT=docs/LEGACY_CODE_INVENTORY.md npm run audit:legacy`。
- 本轮验收入口见 `docs/reports/STRUCTURE_REFACTOR_ACCEPTANCE.md`。性能/业务差分脚本支持 `REFACTOR_BASELINE`；14组比较使用 `BATTLE_BASELINE_COMMIT`、`BATTLE_ARTIFACT_DIR`。
- 旧测试脚本默认会写原artifacts路径。新任务要将实际新产物保存至独立目录，再仅恢复该任务覆盖的历史证据，保留SHA和索引；不要把历史PASS当成本轮结果。


## 每次发布的版本与主题约束（强制）

- 用户要求：每次更新必须同步左上角、内部版本及发行包版本。修改两个仓库package.json及锁文件版本；HTML的顶栏、标题、__GOD_POWER_VERSION__和备份appVersion统一由构建VERSION token生成，禁止手改dist。
- HTML运行npm run build/check；Electron同步已提交的HTML，再执行verify:bundle和verify-release。任何一处版本不一致禁止发布。
- 新主题只能通过GodpowerTheme增加外观，不能复用业务模式开关。颜色由原始样式所有者读主题变量，禁止同名全局函数包装。保持用户组色、正负分语义与14组几何。
- 所有主题底栏封神榜保持金色与柔光；到此为止使用深色底和白字。新增布尔设置复用共享滑块；选择列表保持复选框。
- 主题切换须测试刷新、存储失败、快速连续切换、跳过/Escape、减少动态效果、页面切换清理和独立窗口同步。仅Chromium1920×1080、1×；不运行CircleCI。

- 悬停提示统一由GodpowerTooltips管理：显示后3秒自动消失，持续悬停不重播；新增提示继续声明title/ARIA即可。禁止另加不自动消失的CSS hover气泡。独立窗口的提示源必须由sync:html同步，不能复制后各自修改。
