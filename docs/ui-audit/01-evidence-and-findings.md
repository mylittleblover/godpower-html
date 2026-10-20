# V3 UI 治理审计：源码证据与结论

日期：2026-10-20。范围：只读审计 UI 结构及与插件平台的边界。HTML 远端 feat/v3-foundation-sp01-sp02 HEAD 50db4a8a63cb9d5d164deb57e738de14a517a04fb；Electron HEAD c5e52175816355111f7966d6a0c18bf99c36362a；产品版本3.0.24。ZIP 内8项审计素材均符合包内 SHA256.json。

## 方法和限制

核对 HTML 的 src/manifest.json、src/index.template.html、src/ui/domain/application/items 源码、package.json、docs/ARCHITECTURE.md；核对 Electron main.cjs、desktop/windows/protocol/contracts/broker、preload/desktop.cjs、renderer、构建同步脚本和架构文档。静态HTML/JS统计使用正则与 Acorn parser；CSS统计按精确 selector 字符串词法扫描，不会计算浏览器 specificity、媒体条件或实际胜出的 cascade。事件调用点数量不是运行时监听器总数。没有对每个页面做截图视觉评审。

本轮没有运行 UI 或插件测试，不把此前记录当成本轮证据。93个 manifest JS 文件均由 Acorn 成功解析，是源码语法检查结果，不是功能测试。没有安装依赖、构建新产物、修改业务/样式/存档或操作课堂数据。

## 全仓依赖统计

| 范围 | 实测 | 解释限制 |
|---|---:|---|
| src/manifest.json 构建块 | 125：32 style、93 script | 是加载清单块数；模板还有内联启动脚本 |
| JS解析 | 93/93成功；顶层声明名699；跨文件同名顶层声明0 | 不包括运行时动态附加到window的属性 |
| src/index.template.html 静态ID | 227个，重复ID 0 | 不含运行时创建/复制的节点 |
| 页面根节点 | 5：welcome、battle、archives、history、settings | 插件一级页面尚不存在 |
| 模板内联事件属性 | click 84、change 11、input 4、keydown 3，共102 | 静态事件入口，不等于功能数 |
| src/**/*.js 事件API文本调用点 | addEventListener 113、removeEventListener 4、.onclick= 30 | 含条件初始化/清理代码，不代表泄漏或运行时数量 |
| 已加载CSS | 32文件，约2028条词法规则 | 简化扫描 |
| 精确重复selector | 348个候选；同selector/property重现157个候选 | 媒体、状态和响应式样式可能合理；不得直接删除 |
| 测试文件 | unit 54、integration 2、e2e目录71 | 文件数不等于覆盖数量；须看package脚本执行链 |

主要脚本顺序：ui/themes.js最先；ui/model.js；domain/rules与基础设施；成就目录；item模型、命令/历史/防御；script/00.js至script/45.js现存兼容序列；ui/battle-grid.js、ui/render.js；道具模块、round settlement；command services/legacy adapter；UI反馈/动效/桌面；最后ui/electron-host.js与ui/electron-windows.js。完整加载顺序以manifest为准。

所有权由源码确认：ui/render.js:4-33拥有renderAll/refreshPages与全页刷新序列；:35-65持有grid refresh、攻击与FLIP门控。ui/battle-grid.js构造比赛卡片，直接读state、ITEM_DEFS并输出部分inline handlers；ui/battle-motion.js读ITEM_DEFS展示。ui/desktop.js实际2130行，负责设置/导航/欢迎统计和每日题库；ui/welcome-v2.js实际665行，读取state、排名、历史且管理自动横滚、入场焦点、定时器和清理。ui/themes.js 220行、themes.css 314行处理classic/marx。HTML模板定义五个page roots和主导航，含102个内联事件属性。

| 页面/窗口 | 静态owner | 当前渲染/生命周期owner |
|---|---|---|
| 欢迎 | index.template.html 的 view-welcome | DesktopUI.renderWelcome + WelcomeV2.render/intro/横向track |
| 比赛 | index.template.html 的 view-battle 与 groupList | renderAll/refreshBattleGrid → renderBattleGridCards；battle-motion及round-feedback；业务仍在原命令入口 |
| 历史 | index.template.html 的 view-history | DesktopUI.renderHistory，从真实historyStack投影 |
| 档案 | index.template.html 的 view-archives | DesktopUI.renderArchives，从真实settlement history投影 |
| 设置 | index.template.html 的 view-settings | DesktopUI.setupSettings/organizeSettings/selectSettings；旧题库编辑、偏好/动效亦在DesktopUI |
| 插件中心 | 当前不存在 | 待设计注册 |
| 主要弹窗/覆盖 | memberSearchBackdrop、itemModalBackdrop、grandModalOverlay、settlementNameModal、scoreModalBackdrop、pwdModal、pickerModal、batchImportModal、handRaiseBackdrop、aboutBackdrop、quickPersonBackdrop等静态节点 | DesktopUI.setupModals/setupPicker/prepareSettlement；Electron electron-windows以同一权威节点的受控DOM/CSS拆出12类功能窗口 |
| 运行时反馈层 | 多个script创建或控制的overlay/modal | classroom-feedback、battle-motion、theme transition、round-feedback分别持有自己的表现生命周期 |

该表是根据静态源码与现有架构文档确认的职责映射，不表示每个弹窗都在本轮真实浏览器逐一打开验收。

## 确认事实、风险和不可下的结论

| ID | 级别 | 证据/发现 | 当前结论 |
|---|---|---|---|
| UI-01 | 高 | desktop.js承载设置、导航、欢迎内容等多个职责，共2130行 | 职责集中已确认；实际性能瓶颈未测 |
| UI-02 | 高 | 模板静态声明五页、导航和大量inline handlers | 壳层与页面紧耦合已确认；可渐进引入注册表 |
| UI-03 | 中高 | 32 CSS、约2028词法规则、348重复selector候选 | 级联复杂度风险；157同属性候选需用浏览器确认，不称为157个缺陷 |
| UI-04 | 高 | battle-grid.js构造HTML并使用inline业务入口；renderAll刷新多个区域 | DOM/业务/UI耦合已确认；局部刷新需保留FLIP、held score和防御时序 |
| UI-05 | 中高 | refreshPages固定顺序刷新controls/grid/chart/dashboard/resizer/welcome | 全页刷新是当前事实；是否有卡顿未测 |
| UI-06 | 中高 | welcome-v2.js混有投影、横滚、启动动画、焦点、事件和计时器生命周期 | 职责耦合已确认；已有取消/reduced-motion机制，重构须继承 |
| UI-07 | 中 | themes.js和主题样式已实现classic/marx，键godpower_appearance_v1 | 可复用主题基础；还不是注册/权限/文案插件系统 |
| UI-08 | 高 | battle grid与battle motion读取旧全局state/ITEM_DEFS | UI与玩法模型耦合已确认；应由宿主Presenter DTO隔离 |
| UI-09 | 极高 | Electron protocol.cjs设frame-src 'none'；窗口验证、CSP、sandbox、窄preload在用 | 插件HTML不能复用现有独立窗口；不能扩大安全策略 |
| UI-10 | 正向 | ui/model.js是展示模型，render.js声明single refresh owner；battle motion有session/reduced-motion，welcome动画可取消 | 应保留的边界，不代表全部解耦 |

交付包旧行数均差1：desktop.js实际2130非2131；welcome-v2.js 665非666；themes.js 220非221；themes.css 314非315；desktop.css 1169非1170；application-surfaces.css 758非759。旧包将CSS冲突当已确认，现修订为词法候选；只有浏览器cascade与截图能证明视觉缺陷。

5.5/10是原包的主观估分，不是静态工具结果，本轮不作为客观质量结论。

## 主要路径与待审事项

index.template.html → manifest scripts → DesktopUI/welcome/render → battle-grid → 全局state/ITEM_DEFS/commands。主题路径为GodpowerTheme→tokens/body class/storage→Electron theme DTO。插件UI只接已提交SP03-B的ContributionRegistry；本审计不创建第二套Registry或SDK。

推荐渐进式strangler与兼容facade，不迁移React/Vue。先抽公共契约和低风险页面，再主页工作区，再比赛DTO/invalidation，最后逐批CSS治理。UI设计待审批；审批前不生成实施计划、不修改UI产品代码。
