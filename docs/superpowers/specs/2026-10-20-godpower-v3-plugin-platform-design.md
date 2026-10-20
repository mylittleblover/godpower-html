# GodPower V3 插件平台设计规格（SP03）

日期：2026-10-20。状态：**设计待用户审阅；未授权产品实现**。协议候选版本：SDK 1.0.0。应用基线：3.0.24。

## 1. 目标、非目标与审阅范围

将课堂竞技程序逐步改造为综合教学平台。主程序持有教师本地身份、学生/小组、课堂/会话/赛季、基础答题/积分/排名/结算、命令/事务、历史/存储、资源、导航和插件环境。特殊玩法由「宫本茂的力量」拥有；原马克思主题与政治教学插件彼此独立。插件可以贡献主题、文案、页面、卡片、面板和公开服务，不能直接写权威数据。

本阶段交付六份设计规格及只读审计，不编写产品代码、不安装依赖、不切换存储、不迁移设置、不修改竞技参数。本文不是实施计划或已实现能力证明。规格批准之后才使用 writing-plans 编写实施计划；计划还需独立批准并确定执行方式。

本轮约束以用户最新任务单为准：11 款学科插件是最终范围，但以可单独验收的功能包分期交付，空白页面不算交付。高级 VST3 和低延迟音频宿主排除在首轮之外。没有后台服务、云账户或在线插件市场的隐含承诺；本地教师档案不是远端安全认证。

## 2. 核实的仓库基线与证据

2026-10-20 实际执行 git fetch origin 后，两个工作区都位于 feat/v3-foundation-sp01-sp02，HEAD 与远端一致：

| 仓库 | 完整 SHA | 工作区 |
|---|---|---|
| mylittleblover/godpower-html | 6dcc2be99ea8d55864deb57e738de14a517a04fb | 审计前无未提交改动 |
| mylittleblover/godpower-electron | 10c6cfc42b553666b47eb016afa88d452ebe55a7 | 有既存 artifacts/v3-force-end 与 artifacts/v3-next-command 未跟踪证据；保留、不纳入本轮 |

Electron resources/BUILD_INFO.json 的 sourceCommit 为 807b63e78b738c4e7f189d9152bd1dbf5c1fc83c；后续 6dcc2be 只改文档，所以代码产物未落后。HTML SHA-256 为 ffa430c685d9be8b607d738ec4366293d07b9835477d49871b4554c0d9533352，7,967,474 字节。这是元数据记录，最终提交前另做实际哈希核对。

| 当前实际实现 | 已读源码证据 | 设计影响 |
|---|---|---|
| 生产仍使用旧课堂仓库；IndexedDB 事务库是 opt-in | src/infrastructure/legacy/classroom-repository.js；src/infrastructure/indexeddb/repository.js；src/application/legacy-classroom-adapter.js | 插件规则写入不得早于命令和存储切换闸门 |
| 事务服务已经有修订号、命令去重、提交后通知 | src/application/transactional-command-service.js | 复用该端口，不另造插件计分数据库 |
| 现有事件信封有 10 个类型，source 枚举无 plugin | src/domain/events.js | 保留正式来源语义，插件身份另加 provenance，不把第三方消息直接当正式事件 |
| 道具是 26 个 blueprint；draw 与 operation 已分开 | src/items/catalog.js、draw.js、operation.js；src/core/item-module-model.js、item-modules.js | 属于可迁移基础，不是现成安全插件平台 |
| 60 项目录；仅 ACH-001～012 有评估逻辑 | src/domain/achievements/catalog.js、learning-rules.js、ledger.js | 其余 48 项是未完成范围，不能称成就迁移已完成 |
| 界面仍依赖全局 state 与编号脚本/CSS | src/manifest.json；src/script/00.js；src/ui/desktop.js | 渐进提供宿主端口，不把旧全局对象交给插件 |
| 首页和主题已有动画、题库/偏好存储 | src/ui/welcome-v2.js、desktop.js、themes.js、themes.css | 先注册现有组件的适配器，保留样式与动画 |
| 主窗口是唯一课堂与点名结果所有者 | Electron desktop/broker.cjs、contracts.cjs、windows.cjs；HTML src/core/picker-bridge.js | 插件不建第二套 RNG/赋分入口 |
| preload 按角色白名单；主 origin 固定；frame-src 'none' | Electron preload/desktop.cjs、desktop/protocol.cjs、main.cjs | 新隔离宿主需要专门策略，不能全局放开 frame/网络/设备 |
| HTML 来源和派生文件已有构建校验 | scripts/build.mjs、src/manifest.json；Electron scripts/sync-html.mjs、verify-bundle.mjs | 协议与官方包从 HTML 源仓同步；禁止改 Electron resources/index.html |

没有发现现成插件安装/权限/依赖管理平台。多教师/学科持久隔离、稳定 StudentId 仍需先建设，groupUid、seasonId、itemInstanceId 已有加法迁移基础。仓库没有 AGENTS.md（本轮在 /workspace 排除依赖目录搜索）。

## 3. 方案比较与选择

| 方案 | 优点 | 主要问题 | 选择 |
|---|---|---|---|
| 同页脚本直接加载 | 迁移少、调用方便 | 可触达 DOM/全局状态，无法强制权限和故障隔离 | 拒绝 |
| 所有插件均为 Electron 原生窗口 | 进程隔离较强 | HTML 无同等能力、原生权限扩大、分叉明显 | 仅作为 Electron 的隔离增强 |
| 共享声明协议＋隔离 JS 工具上下文＋宿主解释规则 | HTML/Electron 共用、可审计规则、可离线 | 需先建消息桥/解释器和迁移闸门 | 采用 |

特殊竞技只提交声明式规则描述，由宿主内有界解释器运行；第三方任意 JS 仅用于隔离的教学工具/视图，不能作为持有宿主状态的规则回调。官方插件无隐含绕过权限的特权。

## 4. 模块边界与依赖方向

建议目标目录（尚未创建）：

- src/domain：身份、基础竞技、历史事实与通用值；不依赖插件 ID。
- src/application：课堂/竞技/资源/导航服务和唯一命令服务；以注册的规则协议为端口。
- src/platform/plugins：manifest 校验、生命周期、权限、隔离传输、贡献注册、服务注册、存储代理和诊断。
- src/platform/presentation：theme/text/view/dashboard workspace 的宿主解析器。
- src/plugins/official：同 SDK 的官方包源，构建时内嵌到独立 HTML。
- src/ui：默认页面、组件和插件中心，只消费投影和贡献描述。
- Electron desktop/plugin-* 与 preload/plugin-*：未来窄原生代理和进程隔离适配，不含课堂内核。

依赖：Presentation → Application/Platform Ports → Domain；Infrastructure 实现端口。插件 → SDK 消息协议 → 权限/作用域检查 → Application。禁止 Domain import 官方插件、平台反向读取 UI DOM、插件直接 import 旧 state/保存函数。

User/Teacher 初始为本地档案；Students/Groups 分开建身份映射；ClassId/SessionId/SeasonId 不混用。基础模式保留当前普通正确 +2、错误不扣、现有 All In 开关和排序语义，未经规则审查不变。插件可申请影响这些基础命令，但宿主拥有执行与验证。

## 5. 统一接口与数据模型

公共契约以 JSON Schema 2020-12 发布，所有版本 SemVer；未知字段默认拒绝，明确 extensible 的 metadata 命名空间除外。二进制通过受限资源句柄传输，不塞进命令 JSON。

```text
PluginHost.install(packageBytes, expectedDigest) -> InstallReceipt
PluginHost.transition(pluginId, action, scope, expectedRevision) -> LifecycleReceipt
PluginHost.permissions.request(pluginId, capability, scope) -> GrantReceipt
PluginSDK.context.read(selector) -> RedactedContextDTO
PluginSDK.commands.request(type, payload, commandId, expectedRevision) -> CommandReceipt
PluginSDK.storage.read/write/CAS(key, value, expectedRevision) -> StorageReceipt
PluginSDK.resources.read/write(handle, bytes) -> ResourceReceipt
PluginSDK.services.call(qualifiedName, versionRange, input) -> ResultDTO
ContributionRegistry.register(batch, activationToken) -> RegistrationReceipt
ContributionRegistry.dispose(activationId) -> void
```

SDK 不接受客户端自报 pluginId/teacherId/source 获得授权；宿主按通道绑定身份并填充 provenance。scope 为 {teacherId, subjectId?, classId?, sessionId?, seasonId?}，未指定的可选值代表该能力允许的上层范围，不代表通配所有教师。跨范围操作必须显式授权。

通用请求 {protocolVersion:1, requestId, activationId, epoch, seq, operation, payload}。宿主在通道建立时绑定插件、包摘要和 scope，另校验目标 revision。通用结果 {requestId, status:'ok'|'rejected'|'cancelled'|'committed', code, persisted, revision?, data?}。相同 requestId 不同内容拒绝；相同命令重试返回持久回执，不重算；客户端超时后先查询回执，不自动重新抽选/赋分。

平台记录：PluginInstallation(pluginId, version, digest, manifest, installedAt, previousDigest)；PluginEnablement(pluginId, teacherId, subjectId?, enabled, revision)；PluginActivation(activationId, epoch, sessionId, capabilityTokens, state)；PermissionGrant(pluginId, digest, capability, scope, constraints, expiresAt)；PluginData(namespace, schemaVersion, revision, content)；WorkspaceLayout 与 ThemeSelection（见分册）。

## 6. 生命周期、安全与失败语义

详见 [SP03-A](SP03-A-plugin-runtime-design.md)。安装不等于启用，启用不等于会话激活；默认权限拒绝，新增权限升级不得自动沿用批准。包校验、依赖和贡献预检完成后才可对外可见。停用撤销能力 token 与 UI 贡献，保留数据。

无插件时可开启新的基础课堂。已有特殊效果的赛季若所需规则包不可用，加载只读/安全模式并暂停受影响竞技命令，仍允许查看、备份和普通教学工具；不能悄悄丢弃库存/效果或用另一版本规则继续结算。用户可重新启用快照版本恢复。

插件故障不回滚已提交课堂事务。提交前故障拒绝整个命令；持久提交后动画故障记录日志并回退默认反馈。隔离停止不承诺回滚已产生的外部网络副作用。

## 7. 迁移与兼容闸门

详见 [SP03-C](SP03-C-gameplay-migration-design.md)。先完成所有生产写入口迁移、事务库 staging 读回验证和单权威切换，再允许插件竞技/成就数据同事务提交。切换前只允许不写课堂的插件平台能力试运行。

现有 Schema2、历史最多40条、主 origin classroom://app、音频库 PoliticsScoreSoundDB_Unified、归档 politics_settlement_history 均先保持；迁移复制不删除来源。加版本化插件私有命名空间，正式成绩/成就不落到第二个可独立失配的私有库。迁移预检/收据包括源/目标摘要、映射、备份位置和回滚步骤。

设计保留当前主题、五页与启动动画，新增一级插件页；资源中心先提供导航扩展而不强迫重排旧页面。UI 设计见 [SP03-B](SP03-B-ui-contribution-design.md) 和 [SP03-D](SP03-D-theme-text-view-design.md)。官方学科范围见 [SP03-E](SP03-E-official-subject-plugins-design.md)。

## 8. 验收矩阵（本阶段状态）

以下是未来实现的验收要求，**均未执行新插件产品测试**。源码阅读不计 PASS。后续每行须附命令、日期、运行环境、日志/截图和确切版本；BLOCKED 与 NOT TESTED 不计通过。

| 编号 | 功能 × 场景 | 测试类型与关键断言 | 当前状态 |
|---|---|---|---|
| P01 | 无插件基础运行 | E2E：新基础赛季可答题/计分/撤销，默认主题可用 | NOT TESTED |
| P02 | 安装/卸载 | 集成：恶意包拒绝，保留数据卸载可重装恢复 | NOT TESTED |
| P03 | 启停/暂停/恢复/更新 | 集成：依赖、在途事务、epoch、重启均一致 | NOT TESTED |
| P04 | 权限拒绝 | 安全：伪造身份/跨教师/撤销后请求均拒绝 | NOT TESTED |
| P05 | 崩溃隔离 | Chromium/Electron：死循环工具终止，课堂仍可用 | NOT TESTED |
| P06 | 数据迁移 | 集成故障注入：预检变化/写失败回到原版本 | NOT TESTED |
| P07 | 主题切换/恢复 | E2E：主题撤销即恢复，两个现有主题截图对比 | NOT TESTED |
| P08 | 文案/语言 | 单元＋E2E：插值转义，安全文案不能覆盖 | NOT TESTED |
| P09 | 页面展示扩展 | E2E：默认组件始终可回退，不触达主 DOM | NOT TESTED |
| P10 | 卡片注册 | 单元：重复 ID/尺寸越界/未知 selector 拒绝 | NOT TESTED |
| P11 | 拖拽/缩放/键盘移动 | E2E：网格无重叠，焦点可操作 | NOT TESTED |
| P12 | 布局持久化 | 集成：导入/导出/停用重启恢复原位置 | NOT TESTED |
| P13 | 插件中心导航 | E2E：搜索/收藏/最近使用/深链/返回 | NOT TESTED |
| P14 | 竞技设置迁移 | 差分：旧值原样生效，主设置不再重复维护 | NOT TESTED |
| P15 | 道具百科迁移 | E2E：首页入口到插件百科，描述同规则版本 | NOT TESTED |
| P16 | 26 道具 | 种子差分：旧引擎与迁移版目标/消耗/攻防/积分一致 | NOT TESTED |
| P17 | 七种状态 | 单元＋命令：冲突/过期/撤销，已审旧规则不变 | NOT TESTED |
| P18 | 16 自动事件 | 种子与假时钟：4～8有效回合，全自动，无重复结算 | NOT TESTED |
| P19 | 60 成就 | 每项边界/反例/撤销/归档幂等；12项旧判定差分 | NOT TESTED |
| P20 | 跨插件服务 | 安全＋集成：版本、权限、递归、撤销与超时 | NOT TESTED |
| P21 | 多教师/多学科 | 集成：切换并发、缓存、资源、授权均隔离 | NOT TESTED |
| P22 | HTML/Electron | 协议一致性＋HTTP/file 离线；来源SHA一致 | NOT TESTED |
| P23 | Windows 真机 | 安装/托盘/设备/跨应用覆盖 | NOT TESTED |
| P24 | 旧存档 | fixture：无插件字段/未知数据/大资源/损坏导入回滚 | NOT TESTED |
| P25 | 14组 | Chromium 1920×1080 1x：同配置几何与按钮可见 | NOT TESTED |
| P26 | 主题/插件异常 | E2E：默认回退、隔离诊断、无覆盖残留 | NOT TESTED |
| P27 | 字体/键盘/减少动态 | E2E：放大文字不截操作，Tab/Escape、取消动画清理 | NOT TESTED |
| P28 | 悬浮点名/全屏特效 | Electron：主窗唯一结果、快捷赋分去重、关闭重开 | NOT TESTED |

用户限定 UI 常规验收为 Chromium 1920×1080、1x；字体缩放仅在该视口执行组件可访问性专项，不扩展常规分辨率矩阵。不调用 CircleCI。Windows 实机缺失时明确 NOT TESTED；file:// 被环境策略阻止时明确 BLOCKED。

## 9. 分阶段批准与开放事项

SP03 是本规格阶段；批准后规划 SP04～SP11 的实施任务。SP04＝平台及协议；SP05＝UI 扩展/插件中心/Workspace；SP06＝玩法迁移和经批准规则；SP07＝马克思主题；SP08～SP10＝分批学科包；SP11＝原生代理/兼容/最终验收。编号只划分范围，不替代有文件和断言的实施计划。

本规格候选决策包括隔离方案、声明式规则语言、初始配额、布局优先级和官方包交付界限，待用户审阅批准。既有 competition-rules-difference-matrix.md 的十项差异继续保留审查闸门；本任务只明确批准了16事件全自动且4～8有效回合，不自动批准其中每项数值、取整、Freeze/Star/Mega变化、Kamek/Item Box或个人竞技身份方案。

## 10. 规格自审记录

逐项核对：六册命名/接口一致；manifest 能力不等于授权；任意 JS 不进权威规则路径；默认安全文案不被主题覆盖；旧/新存储不双写为双权威；课堂插件事务和私有内容存储分别建模；比赛布局不增加常驻占位；未实现/未测试不写 PASS。需要产品审阅的候选决定均集中在上节及各分册，不以缺失实现冒充已完成。文档提交不升级产品版本；下一次产品变更统一更新顶栏和内部版本。


## 11. 本轮实际验证记录

在上述代码基线执行：HTML `npm test`：246/246通过、0失败/跳过；Electron `npm test`：20/20通过、0失败/跳过；Electron `npm run verify:bundle`通过，顶栏/内部/Electron版本一致为3.0.24。另读取两端HTML实际字节，内容完全相同，SHA与BUILD_INFO一致。

六份规格的本地Markdown链接、JSON示例、代码围栏配对、未完成标记和28项矩阵行已检查。单元测试只证明当前基线对应断言通过，不证明新插件体系可运行。此轮未运行浏览器、Windows真机或新插件产品测试；未改构建产物，未运行CircleCI。只读审计没有删除Electron原有未跟踪测试文件。
