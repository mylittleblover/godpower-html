# GodPower V3 UI 治理与插件平台实施计划

**日期：** 2026-10-20  
**目标分支：** `feat/v3-foundation-sp01-sp02`  
**前置规格：** `docs/superpowers/specs/2026-10-20-godpower-v3-ui-governance-design.md`、`docs/superpowers/specs/2026-10-20-godpower-v3-plugin-platform-design.md`  
**执行约定：** 每个阶段先加回归断言，再实施，运行该阶段测试和 Chromium 1920×1080 1x 验收，更新报告后独立提交。只运行 Chromium；不执行 CircleCI。Electron 相关改动仅在 HTML 契约验证后进行。

## 不可变验收条件

- 普通 HTML 单文件离线发行能力、当前版本字段和旧数据兼容保留。
- 核心页面及既有命令语义不因 UI/插件重构改变；第三方插件不能读取主 DOM、全局 state、存储或宽泛 IPC。
- 比赛 14 组几何、排名预览垫片、缩放、底栏和操作 hitbox保持基准；欢迎入场动画、主题、点名悬浮窗与全屏效果保留。
- 注册入口唯一使用已批准规格中的 `ContributionRegistry`；插件贡献为经校验的声明式数据，默认页面始终可用。
- 每项完成/测试状态须附实际命令及结果；未执行的浏览器/Windows项目标记 `NOT TESTED`，环境阻塞标 `BLOCKED`。

## 阶段 0：基线与 UI 资产所有权（M0）

1. 在两仓检查 HEAD/分支/工作区/manifest；记录源 HTML、Electron bundle、14组 fixture、欢迎页与两个主题的基线 SHA/尺寸。不得修改或暂存 Electron 既有未跟踪 artifacts。
2. 扩展现有静态审计为可重复的 UI 资产报告：页面 root、脚本/CSS 注入顺序、全局/DOM owner、事件入口、定时器/observer、主要渲染入口、选择器与 property 来源；重复 selector 只报候选，不作为删除结论。
3. 增加测试断言：构建产物全部贡献脚本/样式按 manifest 唯一顺序嵌入；五个现有 view root 唯一；脚本源不引入新的重复全局入口；审计输出稳定且不访问课堂真实数据。
4. 运行 `npm run audit`、相关 `npm test`，基线 `npm run build`/`npm run check`；用 Chromium 1920×1080 1x 截取五页和14组布局，保存 DOM 几何与截图。标记主题、欢迎入场、Picker 验收覆盖。
5. 写入 `docs/ui-audit/M0-baseline.md` 与机器可读 `artifacts/ui-governance-m0.json`，记录 SHA、截图位置和真实结果。

**提交边界：** `chore(ui): record M0 ownership and browser baselines`。

## 阶段 1：Shell、导航与唯一贡献注册协议（M1）

1. 依据既有 `src/ui/render.js`/`ui/model.js` 建立宿主 UI shell facade 和 route descriptor，五个现有页面映射为默认贡献；旧 `switchView`/`renderAll` 暂留兼容入口，但委托到唯一 owner。
2. 实现单一 `ContributionRegistry` 模块：批次全量校验、kind/scope/slot/renderer/schema allowlist、全局 ID 冲突拒绝、activation token 绑定、registration receipt、按 activation dispose；不得执行 descriptor 内函数/HTML/CSS。
3. 定义 `PageContribution` 声明式 schema 与固定插件路由 `plugins/:pluginId/:pageId`；页面只允许宿主 renderer key/schema 或隔离 workspace route，核心 route 不可覆盖。SDK 在设计期提前固定，避免后续插件页二次造 registry。
4. TDD 覆盖原子批次、重复ID/未知slot/kind/renderer、伪造pluginId、无权限注册、dispose幂等/只影响本activation、默认五页回退、导航历史与焦点返回。
5. 构建离线 HTML；Chromium 1920×1080 1x验证旧五页导航、tab状态、初始化动画不重复、14组几何不变、默认页 renderer 故障回退。

**提交边界：** `feat(plugins): add validated contribution registry and shell routes`。

## 阶段 2：组件生命周期与低风险页面适配（M2）

1. 建立宿主持有的 `DisposableScope`（事件、计时器、observer、动画 token），页面 mount/unmount 通过 scope 生命周期清理；scope 不授予主 DOM给插件。
2. 将导航/历史/档案等低风险页面接入 route descriptor 与生命周期；每个组件分离纯 presenter DTO 与 DOM adapter。比赛页面只加生命周期适配，不改变结构/尺寸/卡片顺序。
3. 将全局 invalidation 做成宿主内部 scope scheduler，兼容调用转发到原单一 render owner；首批只支持现有已验证 refresh scope，不给插件暴露 renderAll。
4. TDD覆盖重复mount无重复事件、dispose清除timeout/RAF/observer、快速切页无残留动画/遮罩、保存中路由切换仍以持久化回执为准。为历史/档案空/大量数据补充至少各一个生命周期 E2E。
5. 运行页面单测、相关命令和Chromium 1920×1080 1x；重测14组及欢迎动画、窗口打开/关闭动画、Picker窗口同步。输出M2验收记录。

**提交边界：** `refactor(ui): scope low-risk page lifecycles`。

## 阶段 3：插件运行基础（SP04）

1. 在 HTML/Electron 共享协议包中建立 manifest JSON Schema、semver/依赖解析、包摘要验证、安装记录/启用记录/activation epoch 数据模型；本阶段不迁课堂权威数据、不执行任意插件代码。
2. 实现生命周期状态机 install→validated→enabled→active→paused/disabled/uninstalled，安装不隐含启用；卸载默认保留数据；进行中事务拒绝热卸载。
3. 实现默认拒绝权限broker、按宿主绑定身份的受控消息信封、requestId幂等回执、超时/错误隔离与诊断；不暴露Node/Electron/main DB/DOM/通用IPC。
4. TDD覆盖manifest拒绝、版本不兼容、依赖缺失、摘要错误、权限拒绝、跨scope、重复命令、过期epoch、停用token撤销、故障隔离、恢复及数据保留。
5. HTML和Electron共用协议契约测试；Electron主窗口安全属性/CSP/preload allowlist不得放宽。Chromium只测1920×1080 1x。

**提交边界：** `feat(plugins): implement plugin lifecycle and permission broker`。

## 阶段 4：插件中心和 UI 贡献（SP05 前半）

1. 新增一级「插件」导航与插件中心默认页：概览、已安装、功能/工作区、管理、主题与界面、权限、数据、诊断；只展示真实生命周期数据。
2. 页面/面板/导航/快捷操作均从唯一ContributionRegistry注册；用户贡献不能隐藏安全警告或替换核心路由；停用保留配置并显示可恢复空态。
3. 插件工作区先实现宿主可信内置 renderer 与隔离 workspace 空间，第三方UI不得与主renderer同realm，不通过放宽CSP实现。
4. TDD覆盖无插件空状态、搜索/深链、重复入口拒绝、停用回退、错误边界、键盘/Escape/焦点恢复、所有插件故障时核心五页可用。
5. Chromium 1920×1080 1x验收导航/入场动画/弹窗关闭动画/滚动和控制台；版本顶部与内部字段同步更新。

**提交边界：** `feat(plugins): add plugin center navigation and workspace`。

## 阶段 5：主页工作区、主题与文本扩展（M3–M4 / SP05 后半）

1. Dashboard 卡片定义/实例与12列网格 schema；将现有四个推荐卡片接入adapter，默认视觉顺序/尺寸/内容保持一致。仅编辑模式允许拖拽、缩放、复制、隐藏、配置；布局按scope整份优先级选择。
2. 布局导入限制 schema/数量/大小/坐标/尺寸；校验冲突后保存一次，失败保留原布局；插件停用只隐藏展示、保留格位与实例。
3. 在同一ContributionRegistry加入Theme/Text/View descriptor；明确优先级和恢复逻辑。映射现有classic/marx到token descriptor，安全/权限/删除警告不可覆盖；不注入任意全局CSS。
4. 设置管理主题预览、应用/恢复、文案恢复默认；保留 `godpower_appearance_v1` 等旧键读取，迁移为副本并在新写入成功后才切换。
5. TDD覆盖卡片schema/尺寸冲突、100实例、导入导出损坏回滚、停用恢复、两主题切换、文本插值转义及保护文案。
6. Chromium 1920×1080 1x验收编辑/取消/保存/刷新、经典/马克思主题、欢迎入场与推荐卡尺寸、小组横向滚动、插件故障时默认卡回退；14组比赛基线再比。

**提交边界：** Dashboard 与 theme/text 分为两个可回滚提交。

## 阶段 6：官方插件迁移

1. `official.marx-theme` 先迁移：只负责主题描述符、图标/装饰/主题文案；保留现有马克思数据和恢复行为。
2. `official.miyamotos-power` 之后迁移：先搬设置/百科/展示适配，再迁26道具与规则；每种规则与旧实现种子差分，规则快照/version、事务、撤销与定时状态到期路径一致后才切权威实现。
3. 成就60项按已批准目录迁移；事件ID/processedEvents保证幂等；永久/赛季/待归档分层随课堂事务提交；归档成功和清零恢复路径验证。
4. 自动事件仅按已批准已确定参数实现；规则差异矩阵 BLOCKED 部分继续保留旧行为，不推断缺失规则。
5. 先迁移首个学科插件骨架与通用service registry契约，然后对其余10个学科提供有实际能力的小批功能；不得用占位页面宣称完成。每个插件单独测试、阶段提交。
6. HTML/Electron、旧存档、音频/资源、14组布局和浮窗/全屏特效做差分与回归。

**提交边界：** Marx theme、Miyamoto settings/catalog、game rules/achievements、每个学科插件分别提交。

## 阶段 7：剩余 UI 治理与发布验收（M5–M8 / SP11）

1. Battle卡片按Presenter/Adapter解耦和局部刷新；事件委托逐域替代inline handler；每批保持旧renderer对照并单独验收，严格不得改变14组几何/顺序/hitbox/底栏/垫片。
2. CSS按页面/组件ownership清理，经computed style和截图证明后逐批删规则；不按重复统计机械删除。
3. Electron隔离workspace/窗口IPC/沙箱安全复核；允许的窗口能力遵守最小权限；原生能力broker单独contract测试，CSP不放宽。
4. 长时间/错误注入、主题/插件异常回退、储存失败恢复、file://及本地HTTP单文件离线检查。Windows真机不可用明确`NOT TESTED`。
5. 更新架构、数据schema、审计与长期维护文档；全量HTML/Electron build/check/test与Chromium验收；仅报告确实执行的结果。

**提交边界：** Battle、CSS、Electron security、release acceptance独立提交；发布版本字段统一更新。

## 执行纪律与阶段退出条件

- 每项功能先写失败回归断言，再写最小实现；不改弱现有断言。
- 阶段提交前执行新鲜测试命令并记录日志路径、Commit SHA、浏览器/视口。
- 阶段未达退出条件则修根因，不开启依赖阶段；但继续做独立、无风险的审计/文档任务。
- 不执行CircleCI，不执行付费操作，不覆盖未提交文件，不强推。
- 每阶段完成后更新 `docs/MAINTENANCE_BACKLOG.md`、`docs/TEST_MATRIX.md` 与实施记录，并推送开发分支。
