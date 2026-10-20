# GodPower V3 UI 治理设计规格

日期：2026-10-20。类别：Superpowers Architectural。状态：**设计待用户审阅；不是实施计划**。适用分支：feat/v3-foundation-sp01-sp02。产品版本3.0.24。

## 1. 目标、非目标与不可变要求

目标是将现有页面、样式和脚本逐步收进明确的UI模块，并让插件页面/卡片复用正式插件协议。保留当前视觉风格、导航、欢迎入场、窗口动画、比赛操作和离线单文件发行。

非目标：一次性重写或更换React/Vue；改动分数、排名、随机、道具、成就、撤销、存档或命令语义；让第三方插件接触主DOM/主state；在主窗口开放通用CSP/IPC；将测试扩展到其他常规分辨率。本规格没有实现产品代码。

硬约束：比赛14组版面、FLIP、分数颜色及过渡、道具效果/提示、首页入场、顶栏/底栏、classic/marx、旧偏好与题库、悬浮点名和全屏特效、HTML离线单文件、Electron现有CSP/IPC均不得退化。测试视口固定Chromium 1920×1080、100%（1x）；实际Windows未测时标NOT TESTED。

## 2. 最新分支与代码复核

HTML HEAD/远端：50db4a8a63cb9d5d164deb57e738de14a517a04fb。Electron HEAD/远端：c5e52175816355111f7966d6a0c18bf99c36362a。两个仓库均从开发分支核对，不以main推断。Electron有既存未跟踪artifacts/v3-force-end与artifacts/v3-next-command，本次不触碰。

压缩包给出的HEAD为更早提交。其6个行数都比当前实际值多1；原审计提及的重复CSS仅能证实为词法候选，不能认定为视觉缺陷。准确统计、方法、文件责任和非结论见[源码证据报告](../../ui-audit/01-evidence-and-findings.md)。ZIP设计/交接明确标记DESIGN REVIEW REQUIRED，要求设计批准后再writing-plans；本轮保留此阶段门。

当前代码已存在ui/model.js展示模型、ui/render.js唯一全局刷新入口、battle-motion session/reduced-motion、welcome intro可取消、themes.js classic/marx、现有独立Electron窗口桥。也存在2130行DesktopUI、665行WelcomeV2、102个静态inline事件属性，以及比赛组件直接依赖state/ITEM_DEFS。详见证据报告与[迁移映射](../../ui-audit/02-dependency-and-migration-map.md)。

## 3. 方案比较

| 路径 | 优点 | 代价/风险 | 结论 |
|---|---|---|---|
| 一次性React/Vue重写 | 组件模式统一 | 改变构建、DOM、事件、动效和离线包，回归面过大 | 不采用 |
| 渐进壳层＋兼容facade＋唯一ContributionRegistry | 每批可回滚，保持当前HTML/JS构建和Electron壳，可由默认页逐步替换 | 一段时间新旧实现并存，需明确owner和清除期限 | 推荐 |
| 继续单体脚本/CSS叠加 | 近期改动快 | 继续放大全局依赖和插件集成风险 | 不采用 |

## 4. 模块职责与唯一注册协议

- UI Shell：拥有顶栏、一级导航、页面容器、焦点/返回策略、全局错误回退和默认页面。
- 唯一 ContributionRegistry：复用已提交的SP03-A/B协议ContributionRegistry.register(batch, activationToken) / dispose(activationId)。本设计不另造PageRegistry、WidgetRegistry、ThemeRegistry或另一套plugin UI SDK。
- Page/View Contributions：仅注册页面描述符、允许槽、宿主内置renderer key/schema或隔离workspace route；不接受主realm的mount函数、不替换核心路由。
- Dashboard：按SP03-B定义注册card definition和独立CardInstance；默认将现有四张推荐卡适配到同一网格。上方欢迎区/数字统计/小组连续滚动保持原位置和行为。
- Appearance/Text：Theme/Text/View descriptor通过同一Registry注册，再分别由SP03-D的ThemeService/TextService/ViewRegistry解释。安全警告永不被覆盖。
- UI Presenter：从主程序只读快照提供展示DTO；插件或组件不能拿state/localStorage/DOM对象。
- Invalidation Scheduler：宿主内部服务，按scope合并刷新，只允许一个refresh owner。它不是插件可调用的renderAll全局入口。
- Battle View Adapter：消费DTO；先保持原DOM renderer/14组几何，后续证明后才换事件委托/局部更新。
- Plugin UI Host：可信官方宿主描述与第三方隔离UI分开；报错局部回退到核心实现。

依赖方向：Shell/页面→Application只读投影与命令端口→Domain；Contribution descriptors→Registry→有权Presenter/服务；插件代码→隔离MessageChannel/SDK，不import旧脚本，不访问DOM或权威存储。Electron主renderer和HTML渲染保持同一贡献协议，原生功能由现有窄bridge/未来专用安全provider实现。

## 5. API和生命周期

与SP03-B统一的契约：

ContributionBatch是声明描述符数组，每项含localId、kind、scope、requiredPermissions和descriptor。宿主提供：

- ContributionRegistry.register(batch, activationToken) → RegistrationReceipt { activationId, registeredIds, revision }
- ContributionRegistry.dispose(activationId) → void
- UIHost.navigate(routeId, sourceInstanceId)
- UIHost.invalidate(authorizedScope)
- UIHost.requestCommand(commandId, payload, expectedRevision) → CommandReceipt

宿主绑定pluginId、package digest、teacher/class/session scope，拒绝插件自报身份、未知kind、跨scope、重复全局ID和未知slot。batch先全量验证再生效；任一错误全批拒绝。descriptor不带JS callback：page的route固定plugins/:pluginId/:pageId；button action为白名单命令ID与schema payload；card data selector为宿主白名单；renderer只能为宿主renderer key/schema或隔离workspace。

页面订阅/计时器/动效由宿主实现Disposable，不让untrusted plugin拿DOM函数。注册→权限/依赖验证→原子呈现→使用→停用撤销token/贡献→dispose事件动画/焦点/音频租约；在途持久命令等待真实回执，不因页面关闭伪称回滚。插件故障只卸载其frame/卡片，核心Shell和其他页面继续可用。

## 6. 页面、Dashboard与样式

一级页沿用欢迎、比赛、历史、档案、设置，增加「插件」。二级插件中心负责概览、已安装、功能工作区、设置、主题界面、权限依赖、数据、更新诊断。主设置只留全局数据/课堂/应用项和插件配置深链。

主页小组卡片连续横滚、统计区和四张推荐卡。只把推荐卡内容映射为统一的两列初始Widget布局；编辑模式后可按SP03-B的12列网格和teacher/subject/class scope加删移缩。上方欢迎区/小组横滚保持原位置与行为。

比赛adapter不增加常驻徽章/sidebar/新工具栏。原14组相同fixture和视口下卡片位置、尺寸、间距、顶部排名、resizer高度、dock位置、总滚动与按钮hitbox需保持。Battle完整重构列为后续独立阶段。

CSS先生成ownership清单（selector/property/source/order/media/component）；统一token只作为新组件入口，旧样式按owner切块迁移。样式候选以浏览器CSSOM/cascade和截图验证后处理。重复selector计数不是删除目标；不开全局important补丁。插件CSS由isolated frame自己拥有；宿主卡片只接Design Token与资源句柄。

## 7. 交互、动画和可访问性

沿用当前欢迎入场、页切换、弹窗自下而上/关闭向下、顶部tab逐项入场、卡片从上到下等现存设计。Registry mount/unmount触发动画一次；数据刷新不得重播入场。动画用既有Motion控制器的session/token，切页、dispose、skip、prefers-reduced-motion时清理timer/observer/class，动画结束不调用业务命令。

同样保留统一❌关闭按钮、Escape/焦点恢复/键盘导航、hover提示3秒消失、所有skip在右下角。首页内容折叠与设置Disclosure尊重reduced-motion。加插件入口不能改变原导航标高和加载动画顺序；页面缺少权限时解释并让焦点返回触发项。

## 8. 数据兼容与失败恢复

旧键godpower_ui_preferences_v1、godpower_ui_bank_v1、godpower_appearance_v1及既有布局/音乐/档案继续读取。迁移采用只读预检→备份/副本→新schema写入→读回/摘要验证→回执→切换读取端。失败保留旧key和原选择；不可删除或静默重置。

Workspace/Layout/Widget配置按teacher/subject/class独立revision，存放应用偏好仓库；不能写入成绩账本或替换比赛14组存储。Plugin disabling只撤贡献，不删除数据。插件数据不可用时显示fallback/导出入口。

普通页面故障以核心默认view代替；设置保存失败保留当前UI值并报告未持久化；不可逆数据动作继续走现有确认和写屏障。隔离frame不允许触碰宿主业务命令或localStorage。

## 9. 验收与报告

实施验收按[回归矩阵](../../ui-audit/03-regression-matrix.md)RG-01..23执行。至少包括单元/DOM、Chromium 1920×1080 1x真实交互和截图、Electron桌面、Windows真机单独状态。核心检查14组几何、FLIP/积分、所有弹窗生命周期、五页与插件中心、Dashboard持久化、classic/marx、题库、HTML自包含离线、CSP/IPC以及异常回退。未运行标NOT TESTED，环境限制标BLOCKED，不虚报截图为全功能通过；不执行CircleCI。

本轮只完成源码统计与规格编写；上述RG均NOT TESTED。既有HTML/Electron测试由后续实施计划按修改范围选取执行。

## 10. 分期边界和阶段门

UI治理分期建议与SP03结合：M0静态证据/固定Chromium基线；M1 UI Shell与导航兼容facade；M2低风险页面/共享控件；M3 Dashboard Registry/Workspace；M4 Appearance/Text/View贡献；M5 DesktopUI拆分/Invalidation Scheduler；M6 Battle Presenter Adapter（不改几何）；M7 CSS ownership逐块治理；M8 Electron隔离插件视图专项评审。这里是顺序概览，不是可执行计划；逐文件/逐断言/提交边界由writing-plans在设计获批后生成。

设计审核先确认：渐进迁移、唯一SP03 Registry、descriptor而非主realm回调、14组/动效/CSP硬约束、Dashboard两列卡片与三种scope、旧数据迁移保护。批准本设计后才可写计划；计划再审批后才能编码。比赛引擎差异审批独立进行，不能借UI批准隐式变更。

## 11. 自审与证据

接口命名与SP03-B一致，无第二Page/Widget注册表；untrusted callbacks被descriptor/schema替代；所有插件内容经宿主scope与权限；核心页有默认回退；比赛grid保持不开放；存储键保留；所有未测项目明确状态。审计指标是静态统计，CSS重复没有被误报为确定渲染问题。请用户审阅本文件与docs/ui-audit四份报告，提出修订后再审批。
