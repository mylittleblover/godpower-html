# GodPower V3 当前架构

当前版本：3.0.45（M0–M4 插件/UI 基础；F0 证据审计；F1 本地名单工作区、安全应用及名单/头像联合备份；F2 离线课程表与教学资源库；GP-016 损坏主快照恢复；GP-017 全道具撤销矩阵；GP-011 道具使用持久事件切片；H1 首页布局模型、H2布局隔离存储与只读迁移预览）。正式比赛仍以 `godpower_state_v2` 为唯一课堂快照；名单、课程表、教学资源与首页布局均为隔离的本地偏好/教学工作区数据。

## V3 UI Shell、页面生命周期与插件中心（3.0.29，M1–M4）

UI源文件仍按 `src/manifest.json` 声明顺序嵌入单文件HTML。`ui/contribution-registry.js` 在早期建立宿主拥有的路由表，欢迎、比赛、历史、档案、插件、设置六个页面是不可覆盖的core routes；`switchView` 仍是旧导航调用方的兼容入口，但有效页面名取自注册表。插件贡献route会由宿主切换到插件中心工作区，不创建任意DOM，也不接收插件回调。

唯一 `ContributionRegistry` 接收JSON描述符批次，使用宿主创建的activation capability绑定pluginId、权限和作用域。整个批次先验证后提交；未知kind/slot/renderer、权限缺失、重复ID/route、可执行字段和插件自报身份均拒绝。`dispose(activationId)` 只撤销对应activation的贡献，并可重复调用。页面route由宿主生成 `plugins/<pluginId>/<localId>`；插件页仅允许宿主workspace renderer。卡片只可注册到 `home.cards`，面板/设置等使用规格白名单slots和renderer keys。

`application/plugin-platform.js`提供宿主管理的manifest校验、安装/启停/暂停/隔离/卸载状态、scope绑定权限、权限更新、语义版本依赖范围检查（exact、`^`、`~`、`>= lower < upper`）、依赖启用检查和CAS私有存储。依赖必须在同一scope处于active且版本满足范围；必需依赖缺失/版本不符会阻止激活，存在已安装依赖者时阻止卸载提供方。`infrastructure/plugin-local-repository.js`把插件记录与课堂存档分键持久化，并执行写后读回；损坏或配额错误会显式失败，不覆盖源。当前插件包仅允许JSON声明和宿主白名单renderer，不能带可执行入口，也没有启用第三方脚本sandbox；插件中心UI会明示此边界。卸载默认保留命名空间，授权按本地课堂scope分开保存。

M4 增加 `theme` 与 `textBundle` 两类声明式贡献。3.0.30新增受信任内置插件 `official.marx-theme`，将马克思主题的12个开放Design Token注册进唯一ContributionRegistry；`GodpowerTheme`继续负责兼容旧`godpower_appearance_v1`、品牌名称、图标及主题转场，并通过适配器选择内置主题贡献。首次启动会将内置主题插件独立安装/激活到插件命名空间，课堂存档不变。主题只能覆盖宿主固定的12个十六进制颜色Token；布局尺寸、字体、动画、正负分、警告/危险语义色均不开放。文案包只能覆盖有限的稳定Key，值必须是有长度上限的纯文本；权限、删除、数据丢失和事务安全说明不属于开放Key。`ui/plugin-appearance.js`通过宿主DOM目标与CSS变量应用主题/文案，插件停用时恢复初始显示，外观偏好独立存储，不改课堂数据。该实现是受控扩展基础，不等于SP03-D完整主题引擎：尚未有多层scope选择、对比度分析、主题预览/版本/导入导出、页面级主题及完整locale占位符服务。

“共产主义模式”当前仍是兼容中的道具功能总开关，不应在主题迁移时误当作外观选项。它将在《宫本茂的力量》道具设置及旧设置值迁移、读回和26道具行为验证完成后，从主程序设置入口移除；迁移前不得删除其旧值或改变默认行为（PLUG-M7）。

不得把 `GodPowerPageShell` 暴露给第三方同realm脚本。后续plugin runtime应通过隔离消息通道调用它，并在Electron使用窄preload/provider；不能放宽CSP或让插件取得主DOM、主状态、数据库或通用IPC。实现证据及边界测试见 `src/application/plugin-platform.js`、`src/ui/contribution-registry.js`、`src/ui/plugin-center.js` 和对应unit/E2E。

`ui/disposable-scope.js`提供一次性DisposableScope和页面路由生命周期。`DesktopUI.viewChanged`将页面进入动画的RAF/WAAPI绑定到当前scope；跨页后先释放旧scope，再建立新scope。页面DOM仍保持静态并由已有renderer更新；这个scope不拥有课堂命令或数据，也不在视图切换时销毁业务组件。应用级监听器仍在DesktopUI/WelcomeV2初始化时登记；新增页面和插件renderer须使用scope注册其私有副作用。

M0基线（CSS/页面截图、14组DOM测量、静态资产清单）见 `docs/ui-audit/M0-baseline.md` 和 `artifacts/ui-governance-m0/`。M0/M1均未改变比赛业务规则、battle布局或数据schema。

更新日期：2026-10-20。应用版本：3.0.26。当前处于渐进迁移中；成就引擎只评估学习表现类 ACH-001～012，其他48项仍未评估。

## 分层与职责

| 层               | 目录/所有者                                                                                                                  | 职责与禁止事项                                                                                         |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 领域             | `src/domain/identity.js`、`events.js`、`achievements/catalog.js`、`achievements/learning-rules.js`、`achievements/ledger.js` | 稳定身份、不可变事件信封、60项目录元数据、正式判题学习成就事实与计数；不读取DOM、存储或Electron接口    |
| 旧命令生命周期   | `src/application/command-lifecycle.js`                                                                                       | 注入host的命令生命周期，管理快照、异步防御、取消、提交钩子和持久化结果                                 |
| 旧程序适配       | `src/application/legacy-classroom-adapter.js`                                                                                | 唯一公开useItem/judgeRound与备份/导入接口；目前仍连接全局state和旧执行器，逐命令迁出                   |
| 旧存储基础设施   | `src/infrastructure/legacy/`                                                                                                 | v1→v2纯转换、源数据保留、读回校验、迁移回执、旧音频安全复制                                            |
| 插件平台         | `src/application/plugin-platform.js`、`src/infrastructure/plugin-local-repository.js`                                        | 声明式manifest、宿主权限/生命周期、scope私有数据；当前拒绝可执行入口，尚无脚本sandbox                  |
| 事务存储基础设施 | `src/infrastructure/indexeddb/repository.js`                                                                                 | 同一事务保存聚合、事件、命令去重、档案；资源和迁移回执可原子导入。已做隔离浏览器验证，尚未成为生产权威 |
| 存储预检         | `src/infrastructure/legacy/inventory.js`                                                                                     | 只读枚举项目localStorage与四个已知IndexedDB，计算SHA-256并生成完整迁移计划；不自动删除来源             |
| 兼容核心         | `src/core/`                                                                                                                  | 尚未迁出的规则、防御令牌、历史、道具配置与音效分类；Reliability中的存储接口委托仓库，保留旧调用兼容    |
| 表现             | `src/ui/`                                                                                                                    | 页面投影、渲染、弹窗、动画、音乐/音效反馈与Electron界面桥；表现不得决定随机或积分结果                  |
| 遗留实现         | `src/script/`、`src/style/`                                                                                                  | 仍包含有效计分/道具/音频规则及CSS。编号不代表无效；每族通过差分测试后再删除                            |

领域层依赖标准JavaScript与可注入的时间/身份来源。应用层通过仓库和表现适配器执行副作用；基础设施不得调用渲染函数。普通内联脚本的构建顺序由模板和manifest显式记录，最终不需要模块服务器。

## F1 身份与名单基础（3.0.33）

`src/domain/identity.js`现提供`userProfileId`、`classroomId`、`studentUid`稳定标识生成器。`src/domain/classroom-roster.js`定义版本1的本地名单文档，并验证用户档案、课堂、学生与分组关系；可为旧`groups[].members`生成保留重复姓名的迁移预览，并按用户档案投影分组成员。投影返回副本，名称不是身份键。

`src/infrastructure/classroom-roster-repository.js`使用独立键`godpower_classroom_roster_v1`保存名单文档，提供CAS revision、写后读回和失败回滚。`src/ui/classroom-roster-workspace.js`在设置的“学生与小组管理”页提供本地教师档案/课堂切换、分组与个人参与模式、学生增删改、导入导出，并能从当前比赛生成一个独立名单副本。名单应用先以稳定 `groupUid` 生成差异预览，显式确认后通过 `runClassroomCommand` 只更新权威比赛组的 `members` 列表；比赛快照、历史、保存和失败恢复都归课堂命令生命周期管理，名单仓库是只读来源。预览到事务执行时复核比赛状态指纹、season、profile/classroom、名单 revision 和原始字节，过期确认拒绝。比赛组成员顺序和同名成员在规范化中保留；抽签的防重复标识使用组内位置，并继续兼容旧名称键。教师档案是本机工作区标识，不是登录认证/云同步。F1剩余头像资源、旧名单迁移回执和profile级设置隔离。

## F2 离线课程表（3.0.35）

`src/domain/teaching-schedule.js`验证稳定课程/教师/课堂身份、星期、半开本地分钟区间及同一教师的冲突；`src/infrastructure/teaching-schedule-repository.js`通过独立 localStorage 键`godpower_teaching_schedule_v1`提供CAS、读回与失败恢复。`src/ui/teaching-workspace.js`可新增、编辑、删除每周课表，显示当前时段建议。教师必须明确点击后才写入独立的`godpower_active_classroom_context_v1`教学上下文指针，并刷新名单工作区的教师/课堂选择；此动作不会加载或修改权威比赛状态。跨午夜时段拒绝，`24:00`是当天有效结束边界。

教学资源由`src/domain/teaching-resource.js`执行 MIME、扩展名、签名、大小和元数据检查；`src/infrastructure/teaching-resource-repository.js`在独立 IndexedDB 数据库中用双 object store 保存元数据和 Blob。批量写入与删除保持事务性，写后读回 SHA-256 验证；元数据列表不加载二进制内容。`src/ui/teaching-resource-workspace.js`提供离线导入、搜索、筛选、文本/JSON节点预览、图片 Blob URL 预览、PDF信息、下载、备份与完整性恢复。PDF不内嵌运行。教学资源不访问比赛命令、存储或 Electron 主进程。

## 当前运行路径

`UI → 公开命令 → 验证 → 操作前历史快照 → 旧规则执行 → 等待全部异步防御 → 提交钩子 → 整数检查 → 主存档验证写入 → 渲染`

命令成功、持久化成功与视觉播放是独立结果。普通课堂在浏览器存储不可写时保留本页结果并持续提示导出；导入和最终归档采用严格保存/恢复。异步防御取消后不得修改新回合、替换过的道具或导入后的课堂。

事件scope含commandId、eventId、source、aggregate、causationId、时间与序号。正式判题会为每组产生ROUND_SETTLED事实；主状态和achievementLedger在同一godpower_state_v2写入中提交。ACH-001～004、009按历史正确/有效作答次数解锁；ACH-005～008、010～012按当前赛季连续/比例/反弹状态标为待归档。只有主存档确认成功，控制器才发布godpower:domain-commit。导入和手动来源不会成为成就事实。道具、攻防、效果、封神事件及其余48项评估仍待实现。

## 当前数据权威及迁移

1. 当前课堂主键为`godpower_state_v2`，envelope schemaVersion=2。新增字段achievementLedger.schemaVersion=1为加法字段，旧`godpower_state_v1`保留迁移时的原始字节。
2. 启动优先读取并验证v2；只有v2不存在才读取v1，或旧镜像键。纯转换补齐groupUid、itemInstanceId、seasonId后，复制到v2并读回校验。
3. 当前主存档损坏时阻止自动覆盖，不能静默回退成更旧的课堂。欢迎页警告提供只读扫描 V1、旧版分散镜像及恢复前副本；原始`godpower_state_v2`可按未解析文本下载。预览小组数/积分差异并经教师确认后，仍由`importClassroomData`在恢复前保存损坏原文、校验并写入主快照。
4. 迁移复制失败时保留来源；已验证的旧课堂可在内存使用并导出。完成回执最后写入，回执写入失败可重试。
5. 兼容镜像仍在主快照成功后更新。归档目前仍位于`politics_settlement_history`，与课堂清零尚非跨键事务；保存失败恢复原课堂，seasonId用于防重复。
6. 新IndexedDB事务仓库已验证原子提交、修订冲突、命令去重、崩溃后重开与资源导入。切换生产权威前，必须完成异步应用命令入口、来源冻结和完整迁移读回验证，不能长期维持两个权威源。
7. 成就事件回执与历史/赛季计数随课堂快照保存并纳入撤销快照；最终档案包含当前账本副本。旧备份缺少该字段时初始化为空账本，不改变旧数据字段。

v1来源是迁移前基线，不代表迁移后每次操作的最新副本。回退旧程序前必须导出新课堂并做兼容转换；不能直接把旧源当作最新进度。

## 音频与媒体

原音频库继续使用`PoliticsScoreSoundDB_Unified/sounds`，壁纸继续留在`PoliticsUiDB/kv`。课堂JSON不包含这些二进制资源，也不含全部历史归档和界面偏好。

旧音频复制由独立适配器负责：只读来源；保留原曲目别名映射与完整元数据；只补目标缺失的槽位；一个目标事务全部提交后才写`politics_audio_migration_v2`。旧v1标记不作为新版成功依据。失败不写完成标记、不删除来源，下次重试。

完整迁移预检为每个项目键、数据库元数据、音频记录和Blob计算SHA-256，保存原文与原记录。提交前重新校验来源；来源变化必须重新预检。预检模块尚未暴露为默认界面操作。

## 比赛、道具、历史与界面

原排名、计分、All In和26种道具参数保持不变。三重道具实例独立标识，扣次和转移保留实例身份。历史继续使用最多40条操作前快照；现阶段没有用事件重放替换撤销语义。

`renderAll/renderGrid`由`ui/render.js`唯一拥有，卡片由`ui/battle-grid.js`构建；现有攻击延迟、FLIP和显示分数保持逻辑继续使用。14组几何、垫片、列模式和缩放必须按同一配置比较。新成就不向比赛卡片增加常驻占位。

Electron主窗口继续拥有唯一课堂状态和抽选结果。悬浮点名、独立功能窗口与全屏特效通过安全preload/白名单IPC交互，不重新抽选或重复赋分。迁移期间不改变该所有权。

### 官方玩法插件迁移状态（3.0.32）

`official.miyamotos-power`已作为受信任内置的声明式Gameplay插件进入插件生命周期，注册玩法百科页面和设置贡献。百科由宿主通过`GodpowerItemCatalog`读取26项实时道具定义；插件不执行任意脚本，也不拥有或直接写入课堂状态。道具命令、库存、随机目标、撤销、计分、异步防御仍归现有主程序执行器所有。

道具功能开关、每道具抽取/使用模块配置、图鉴与自定义图标、道具专属音效管理均归入该插件工作区；主设置保留一般音频设置。配置继续使用已有模块配置、图标存储和音频资源，不创建重复存储或更改数据格式。`politics_communism_mode`仍是总开关唯一兼容权威键，插件停用不删除旧值和道具库存。道具功能选项已不再作为主设置分类展示，旧导航调用`DesktopUI.selectSettings("items")`兼容转入插件页面。新计分/状态/事件规则的迁移被竞技差异矩阵中尚待裁定的规则阻塞，详见`docs/superpowers/specs/competition-rules-difference-matrix.md`与`docs/ui-audit/M7-miyamoto-gameplay-plugin.md`。

## 构建和验证

`src/index.template.html`引用分层源码；`src/manifest.json`记录内联顺序；`scripts/build.mjs`输出自包含`dist/godpower.html`与`dist/index.html`，版本来自package.json。所有27项原内嵌资源按原文保留，不引入CDN。

常用命令：`npm run build`、`npm run check`、`npm run format:check`、`npm test`、`npm run test:migration`。UI验收只运行Chromium 1920×1080、1×；不执行CircleCI。当前受管浏览器禁止file://导航时记录BLOCKED，不能计为离线运行通过。

Electron同步必须从已提交的HTML源码构建并记录commit、SHA-256和字节数。Windows真机安装、托盘、多显示器与跨应用覆盖仍需真机证据，Linux测试不能替代。

旧架构记录保存在[历史文档](history/ARCHITECTURE_PRE_V3.md)。实施证据见[V3日志](v3/IMPLEMENTATION_LOG.md)。

## 3.0.3异步事务与迁移协调

`domain/values.js`统一JSON边界与深冻结，事件和命令复用同一实现。`application/transactional-command-service.js`从仓库读取不可变快照，先检查actor/scope/revision，执行可信handler，随后把结果与事件一次提交；提交确认后再通知界面。同一在途commandId共用一次计算，重启后用已保存intentHash识别重试。非法JSON、非有限计算结果、取消的异步决定不写入；表现异常不回滚已提交状态。该入口尚未替代所有旧命令，不代表教师登录/插件权限已完成。

`application/migration-coordinator.js`重新读取来源并重建确定性计划，不信任可修改的界面预览payload；提交到独立staging库后逐条核对课堂、档案、资源hash和回执，最后再次检查来源。相同来源生成相同迁移身份，可重启重试。失败/取消/源变化均不切换权威。

设置→数据与安全→“迁移预检与副本验证”已提供可操作入口，采用现有折叠卡片与动效。只读预检、创建本机独立副本、导出校验报告；报告不包含音频原文，不能代替完整备份。副本库名为godpower-staging-<migrationId>，当前课堂仍用Schema2原存储。来源冻结和默认权威切换仍待后续命令迁移完成。

## 3.0.4默认判题流程

基础答题分值只有`domain/competition/rules.js`一份实现：预检与实际赋分复用calculateRound。`application/round-settlement.js`明确执行顺序：捕获旧排名/作答/强力状态→基础判题→道具联动/统计→正式回合数→强力蘑菇第二段视觉→冰冻/幽灵到期与续用标志清理。

`items/round-effects.js`暂以兼容适配器方式拥有道具回合联动；`ui/round-feedback.js`只保留原720ms第二段分数衔接。旧00/04/36脚本四层判题包装已删除，legacyJudgeRound保留单一兼容入口，实际由稳定judgeRound命令调用。没有改变计分/排名/道具参数或把动画变成业务判定。

这不是所有比赛规则都已纯化：道具回合适配仍使用现有state和攻击/防御服务，存储默认切换仍等待后续真实命令迁移。

### 3.0.5道具单一执行入口

公开useItem负责通用验证与命令生命周期，ItemModules执行配置，ItemOperationBlocks计算实际效果；当前仅保留legacyUseItem→useItem兼容转发。成功使用并经事务持久化后产生ITEM_USED领域事件，由AchievementLedger累计；撤销按操作前快照回退事件统计。共享attack/defense/视觉调度仍由既有模块提供，不能因旧版号删除。攻击命中、防御结算和持续效果事件仍需逐类补齐。

首页统一卡片工作在 `src/domain/home-layout.js` 中提供12列逻辑网格、版本化实例模型、重叠/非法配置校验、确定性挤推、添加/复制/移除/隐藏/移动/缩放、草稿撤销重做和保存/取消。`src/infrastructure/home-layout-repository.js` 用独立 `godpower_home_layout_v1` 偏好键进行版本读写、revision冲突检测、读回校验和回滚；旧固定首页只生成不落盘的迁移预览。它不访问课堂快照。目前欢迎页 DOM 仍由既有实现驱动，布局保存尚无用户操作入口；后续H3-H5逐步完成。

### 3.0.6领域排序与目标选择

RankingRules.ordered保留同分原始顺序且不改输入；旧ranking入口只读取state.groups并转交纯函数。ItemTargets.select只返回引用，random/eligible由执行器显式注入；抽取与效果计算不在该模块。randomAhead旧排序比较器、取数顺序均保留。迁移或新竞技规则阶段可复用这些边界，不必通过全局覆盖修改。

### 手工积分命令（3.0.8）

UI→applyScoreDelta→ManualScoreCommands.adjust→ScoreAdjustments.delta→CommandLifecycle→旧repository一次保存→表现。直接编辑使用set入口、保留原撤销语义；手工来源manual不应触发答题/竞技/道具成就。配额不足显式保留RAM未保存状态；新后端未激活。

### 答题控制命令（3.0.9）

selectGroupOpt/toggleAllInCard→AnswerCommands→CommandLifecycle。recordHistory=false仅用于原来不产生撤销节点的答题选择与AllIn；仍有回滚快照、保存验证和结果。旧道具使用限制和音乐阈值未变。命令替换待定防御时，旧事务先回滚，选择在可靠基线上提交。保存默认仍旧repository，不是异步后端已激活。

### 防御职责（3.0.10）

Domain DefensePolicy只选既有优先级，不改数据、不读DOM、不调用音效。application/item-defense-adapter执行扣次/状态消耗/提示和requestSpinyDefense；core/item-score执行分数应用与反馈调度。异步确认的epoch保护业务结果，WeakMap请求token保护pending标志归属；两层不能相互替代。token不进入存档，旧布尔标志格式不变。

### 异步保存屏障（3.0.11）

CommandLifecycle分离current计算/防御、committing排他提交、persisting异步确认。同步legacy save调用时isPending保持false以免自我延迟，异步返回后isPending为true。ACK前不发布事件；ACK后直到结果、事件、渲染通知结束仍禁止重入。拒绝/无效ACK按明确RAM或严格回滚策略处理。真实IndexedDB适配验证已通过，但默认host仍同步；直接全局写入口及危险操作未全部迁完，不可启用默认新后端。

### 危险操作写屏障与历史清空（3.0.12）

ClassroomWriteBarrier只拒绝durable commit期，不阻止取消旧防御等待。导入、撤销、恢复、回溯及最终归档在任何修改前检测。HistoryCommands.clear重新检查确认时的课堂/赛季/历史和本地锁；不新增撤销节点，保存失败严格恢复记录，await whenIdle确认持久化后提示。原clearHistoryStack仅转发，不再出现内存清空但主存档未更新的分叉。whenIdle的completion不进入存档。其余直接写入口仍须迁移。

### 历史恢复命令（3.0.13）

HistoryCommands统一clear/restore/undo/revert。恢复字段适配器不保存、不触发防御失效；外层命令先取消旧防御，再选择可靠历史并在同一命令中截断、恢复和保存一次。undo在防御等待时仅取消该次攻击。普通恢复保留RAM-only保存故障策略，清空仍严格失败回滚。public旧入口仅转发；快照字段、显示/计时器恢复顺序及已有设置不变。

### 正解选择（3.0.14）

setCorrectAns唯一入口转发AnswerCommands.correct，复用现有programConfirmV28。异步确认捕获课堂、小组数组、赛季、阶段、当前正解及业务失效代次，返回后重验；单命令提交正解或取消，未保存不宣称persisted。旧00末尾覆盖实现已删除，不新增历史节点。

### 强制结束回合（3.0.15）

确认前记录课堂、组数组、赛季、当前题状态与答案选择，并监听已提交业务动作的失效代次。确认返回后重验；只有仍是同一题时才通过CommandLifecycle记录一条可撤销历史并提交一次保存。结束音乐与动画在命令持久化ACK后启动。音频播放效果不由状态回归测试推断。

3.0.16：nextRound音乐异步等待开始前捕获RoundSettlement令牌，恢复后校验课堂、组数组、赛季、业务命令代次与题目/选项指纹；令牌失效则不清空下一题状态。成功音乐与切题行为保留；下一题状态本身尚待下一步合并为单一持久命令。

3.0.17：nextRound在音频加载与状态令牌校验之后，通过一个无新历史节点的课堂命令完成回合字段复位并保存一次；随后再切换思考/战斗音乐轨和启动FLIP动画。永久AllIn选项与道具回合锁重置仍沿用现有规则。

3.0.18：startRound在音频初始化开始前捕获轮次令牌，所有无音频、初始化异常、成功/失败播放分支在复位前复核。RoundSettlement.start负责新回合全部字段及道具锁的一次命令提交；删除script12重复包装。命令持久化后再执行UI渲染与FLIP。

3.0.19：同一seasonId归档已存在时，比较稳定赛季快照（小组、回合、全局道具与点名池）。相同快照作为无写入的幂等重试；不同或旧版缺少可比较快照则拒绝覆盖。此规则保护“归档写入成功、课堂清零保存失败”后的既有正式结果。
