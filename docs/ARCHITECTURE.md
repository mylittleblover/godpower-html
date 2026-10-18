# HTML 架构与发布

## 边界

项目继续使用浏览器与离线单文件，不引入 CDN、后端、WinUI 或运行时 npm 依赖。V2.18.13 的原始文件保存在 `baseline/`，禁止直接编辑。开发树为渐进整顿，**尚未完成全部旧包装器的替换**。

## 目录与构建

- `src/index.template.html`：页面、弹窗、初始事件入口及明确的脚本次序。
- `src/core/reliability.js`：无 DOM 的 schema、存储写入校验、归档、道具验证、整数边界、数据清洗。
- `src/core/classroom.js`：稳定的道具／判定命令入口、事务、完整课堂备份、迁移与恢复。
- `src/script/00.js`：旧版主程序；`01.js` 至 `45.js`：原有规则及视觉适配。数字是原脚本顺序，不代表独立业务模块。
- `src/style/00.css` 至 `23.css`：原有样式块；`02.css` 是当前主题和底栏响应式入口。
- `src/resources/*.txt`：原始 data URI，不进行再编码、不损失内置资源。
- `scripts/build.mjs`：按模板内联源码和资源，无时间戳注入，输出 `dist/godpower.html`。
- `scripts/check.mjs`：解析每一段 JS、逐字验证原版内置资源、禁止外部 script/link 强制依赖。
- `scripts/audit.mjs`：生成源码目录和存储键／动画／事件入口索引。
- `tests/unit`、`integration`、`e2e`、`fixtures`：Node 原生测试、真实 Playwright 浏览器与隔离数据。

运行 `npm ci && npm run verify`。测试服务器由 E2E 脚本创建和释放，不属于发行版依赖。Chromium 默认使用 `/usr/bin/chromium`，可设 `CHROMIUM_PATH`。按用户最终要求仅以 Chromium 作为验收浏览器。

## 依赖和命令

页面内联样式和纯服务 → 旧版初始化／规则适配 → 稳定命令和恢复 → DOMContentLoaded 渲染。纯服务不依赖页面，旧版 UI 依赖其 DOM ID。生产脚本采用普通内联脚本以保留 file 协议支持；不使用 fetch 加载源码。

`useItem → validateItem → runClassroomCommand → legacyUseItem → 整数检查 → saveState → renderAll`

`judgeRound → calculateRoundScores 预检查 → runClassroomCommand → legacyJudgeRound → 整数检查 → saveState → renderAll`

命令在操作前记录一次快照，执行期间拒绝重入、阻止内部重复历史及中间落盘；业务执行失败恢复状态和历史，取消已排队的数字动画；存储失败时普通判题和道具保留本页结果、标记 persisted:false 并持续提示导出，避免 iOS 无法写存储时核心操作全部失效。导入／最终归档仍执行严格保存和回滚。主 envelope 保存成功后更新旧版兼容键。道具成功以状态变化／显式结果判定，不以视觉函数作为落锁入口。冻结尝试按原说明解除冻结、保留库存、占用本题使用机会。三重道具续用例外继续保留。

公开 useItem 的异步刺龟壳防御现已纳入 CommandLifecycle，详见文末当前模块。旧执行器仍会提前播放部分视觉／音效，其他异步业务和原始全局状态写入尚未统一；后续继续拆出计算和事件，不能声称已覆盖全部异步业务。

## 比赛状态

当前仍用原字段 `hasStartedOnce / roundActive / evaluated / correctAns`，`Reliability.phase()` 提供派生状态：NOT_STARTED、ANSWERING、ANSWER_SELECTED、SETTLED、FINISHED。开始／下一题初始化清除本题道具锁；无效翻篇不改状态。判定拒绝重复执行；最终归档前拒绝抽取／切题忙状态。

等待答题与答题中在旧 UI 中没有独立持久化状态；“正在结算”也未独立枚举。完整状态机替换列为 GP-012，不能宣称已完成。

## 数据、渲染与音频

主存档为 `godpower_state_v1` 单次 JSON 写入并回读校验，字段见 DATA_SCHEMA。localStorage 不跨设备、不提供密码学身份认证；旧键继续镜像。归档保持独立键，保存失败或读回不一致时不清零；清零持久化失败恢复课堂。归档不再自动丢弃第 41 条旧记录。

UI 继续使用原 DOM 和渲染器，当前仍存在多层 renderGrid/renderAll 包装。分数动画加入 epoch，撤销／回滚后过期回调不再回写。底栏使用原主题中的响应式规则及 ResizeObserver 预留高度，不增加版本尾部 CSS 覆盖。

Web Audio／IndexedDB 音频库、菜单 BGM、思考／战斗／结算轨、节拍和过门沿用原逻辑。原文件只有 27 个内置图片资源，没有内置可播放音轨；用户上传音频在 IndexedDB 中，JSON 课堂备份不包含二进制音频，须另导出音频 BIN 包。新主存档不替换音频存储。

## V2.19.0 桌面 UI 层

参见 [设计系统](ui/DESIGN_SYSTEM.md) 与 [长期约束](ui/UI_DEVELOPMENT_CONSTRAINTS.md)。`ui/model.js` 是无业务副作用的日历轮换/题库/快照差异纯模型；`ui/desktop.js` 持有界面偏好、页面组件、设置分类、弹窗焦点栈与表现事件。它通过原命令接口调用业务，不接管计分、随机选择、库存、历史或归档。

依赖方向：模板/设计变量 → UI 模型/组件 → 既有命令接口；原渲染入口通过显式 UI 钩子通知新组件，不再增加同名全局包装链。既有脚本覆盖链仍存在，后续拆除必须先保留规则/表现基线。

设置迁移只移动 DOM 节点，保留旧 pane ID 供兼容安装器使用。旧四标签安装器若检测到 `uiSettingsShell` 则退出，防止重复包装。UI 偏好和题库使用独立版本键，不改主业务 schema。


## 2026-10-17 遗留治理后的当前模块

基线是远端最新开发提交 `079df316a999ced4f598a3c3d0495786f9f8d0e8`，本轮不是用 V2.18.15 旧源码覆盖 V2.19.0。原始脚本及资源仍由模板引用并内联，构建没有运行时模块加载器或网络依赖。

- `core/reliability.js`：schema 1 校验、验证写入、派生比赛阶段、防御令牌与失效通知，保持旧数据读取。
- `core/commands.js`：依赖注入的纯命令生命周期；不读取 DOM、localStorage 或道具定义。管理一次快照、待决计数、成功提交、拒绝／失效／异常取消与保存失败策略。
- `core/classroom.js`：命令控制器的浏览器适配器、公开 `useItem`/`judgeRound`、导入与备份；连接状态、历史、保存和 UI。新命令先取消旧的未决命令，再取得快照。
- `core/item-score.js`：`applyItemScore` 与 `tryDefend` 各只有一个定义。显式分为喇叭确认、基础防御摧毁／蘑菇确认、伤害及防御计算、视觉通知与积分队列；闪电的特殊防御仍独立，不能错误并入普通壳类防御。
- `core/history.js`：操作前快照、持久化兼容副本、恢复与撤销的唯一实现。快照域保持小组、点名、回合、垫片和全局道具；不擅自扩大到音乐配置。恢复仍启动炮弹／乌贼计时器，暂留原两次渲染顺序以避免额外行为变化。
- `script/*.js`：14 个 `legacyUseItem` 命名定义的兼容执行链、渲染排序／显示冻结、Web Audio/IndexedDB、道具元数据及特殊效果；并未宣称全部移除。

数据流为公开命令 → 校验 → 操作前快照／执行 → 如有防御则等待 → 一次验证与保存 → 原 UI。等待时 `saveState` 和历史镜像都暂缓写入；JSON 导出使用深拷贝的操作前完整备份。接受、拒绝都完成同一次命令；新命令、恢复、切题或导入使旧决定失效并取消。浏览器在等待中刷新时读取上次已保存的完整状态，不恢复半次攻击。

普通课堂命令保存失败继续保留完整内存结果并明确提示“仅保存在本页”，沿用既有 iOS 降级策略；导入和最终归档继续采用严格成功前置条件。没有更改 schema、旧键、计分、All In 或道具平衡参数。

仍存在全局变量与显式脚本初始化顺序。Inventory 对每个旧函数、变量、CSS 叶规则、动画／计时器／监听调用给出静态位置和分类；这是继续治理的索引，不能代替动态路径证明。后续优先移除 legacyUseItem 有效规则包装、渲染管线和音频资源耦合，见维护列表。

## 最新欢迎页完成层（基线 674e12f）

`ui/welcome-v2.js` 是本轮欢迎页的唯一新增编排所有者：只读 `ranking()`、`Reliability.phase()`、课堂和历史；控制入场、同一个品牌SVG的FLIP、焦点／inert和可选卡片巡航。它不写积分、库存、回合、管理员锁或存档。顶部统计与欢迎卡片共用 `GodpowerUIModel.standings(ranking())`，在UI中用BigInt累加再转为文本，未将BigInt放入业务状态或JSON；该纯模型提前加载以消除旧头部的独立计算。

`DesktopUI` 用显式 `viewChanged` 和 `applyPreferences` 钩子通知欢迎层，调用新增 `setGroupCruise` 保存同一个UI偏好对象；没有覆盖旧函数。排名和动态记录有内容签名，普通时钟更新保留DOM节点。每日卡片签名仅包含内容分类偏好，切换巡航不会清掉已显示的挑战解析。

入场由关闭／待解锁／动画进行／完成的局部状态控制。背景原inert值逐个记录并恢复，焦点在滑块和跳过按钮间循环；Escape可在动画中结束。视口变化、切页、减少动态效果和重复播放均通过同一settle清理动画和临时状态。FLIP按既有应用CSS zoom换算坐标，并在快速解锁时先稳定初始缩放再测量。滑块只负责入场，不修改 `state.isLocked`。

巡航默认关闭，需要显式开启。仅欢迎页可见、已完成入场、允许动效且有溢出时调度下一次；悬停、卡片焦点、拖动或切页时暂停。源代码SVG保持原样，构建时内联，不依赖独立网络文件。比赛页卡片和垫片CSS未改。


## 设置页统一所有权

模板通过 data-settings-category 与 data-settings-group 声明控件归属，DesktopUI 一次性移动原DOM节点并分组，保留ID、原处理器和保存行为。分类进入时刷新声音／道具资源，showSettingsV26兼容导航只委派。音频包导入完成补通知道具音效视图，音乐列表使用独立UI代次避免异步旧结果重复追加。设置文案归模板，旧copy脚本不再覆写。

低频音频迁移、音轨、图标与题库维护使用原生details；展开状态仅存在当前DOM。设置进场与分类动效复用DesktopUI.animate，单独收集Animation对象并在切页、快速分类、Esc、偏好及系统减少动态效果时清理。计算设置页高度使用syncViewport提供的--ui-viewport-height，避免CSS zoom二次放大100dvh。计分、存储schema及规则引擎没有变更。

## 全局功能界面统一层

`ui/application-surfaces.css` 统一顶栏、底栏、比赛卡片外观、窗口及历史/档案页，详见 [规范](ui/APPLICATION_SURFACES.md)。旧几何所有者通过声明中的组件变量接收外观，没有新增全局包装函数。`WelcomeV2` 在原入场动画集合中加入五个导航标签，`DesktopUI` 在现有模态焦点扫描中管理普通窗口入场，并消费档案页的单次进入标志；无新增计时器，无业务状态写入。历史/档案采用换算视口高度和单一正文滚动，比赛几何不变。

模态焦点栈现同时拥有视觉层级：打开分配递增层级，关闭/卸载恢复原值和焦点，动态programConfirmV28也接入同一生命周期。口令回车仅提交一次，防止默认点击新错误提示。details采用一个委托监听与可取消高度动画，页面计数包含待启动requestAnimationFrame；老虎机减速覆盖层是纯展示，不接管原抽取和防重复记账。

### 首页连续巡航与窗口退出（本轮 UI 反馈）

WelcomeV2 拥有按时间驱动的连续巡航与有限展示副本；DesktopUI 仍只读取业务状态渲染首页。`groupCruiseVersion=2` 仅属于界面偏好，首次采用新连续巡航默认值，以后保留用户关闭选择。卡片展示副本不写入小组数据。

既有窗口开关函数显式调用 showClassroomWindow / hideClassroomWindow，交由 DesktopUI 的关闭任务 Map 管理取消、结束、inert 与动画。业务清理仍立即执行，UI 隐藏推迟到退出结束。没有新增同名函数覆盖或修改道具/计分引擎。详见 [UI 规范](ui/WELCOME_FEEDBACK.md)。

### 统一赋分与展示层

`ui/classroom-feedback.js` / `.css` 持有六槽配置、快捷按钮标记、全屏演出及连续转轮。DesktopUI 初始化后显式调用 init，已有命令调用展示接口；模块不选择赢家、不改分、不记录业务历史。DesktopUI 的 pickerStopped 连接实时转轮与减速条，完成后通知展示真实结果。界面状态通过 generation、单一演出、受控定时器和有限转轮 Map 清理。

公共点击声音沿用已有 `ui_click` 槽和原 FX → masterGain 音频链，不建立新音频引擎。旧 playSound 入口只加事件去重和音量适配。音效清单由 scripts/audio-inventory.mjs 从源码调用与浏览器实际槽位证据生成。详见 ui/CLASSROOM_FEEDBACK.md。

音效候选池由原音频所有者统一加载和选择：sounds 表主记录及 variant 记录 → 解码候选 → selectFxBuffer → 既有 FX/主音量。公共事件、26 个独立道具和抽取循环共用选择器，循环在启动时选一次。crypto 随机源独立于比赛 Math.random；没有为候选新增 playSound 包装层。renderFxChoices 被基础音效与道具音效的实际渲染所有者复用。
