# 完整功能清单与覆盖边界

本清单结合源码、动态入口和真实运行，不以可见按钮代替功能范围。全部命名定义的准确数量见 SOURCE_CATALOG；目录包括被覆盖的旧实现，不代表每个定义单独通过。

| 功能 | 对应源码 | 触发 | 输入 | 预期输出 | 依赖 | 持久化 | 风险 | 测试方案 | 当前结果 |
|---|---|---|---|---|---|---|---|---|---|
| 欢迎页与统计 | src/script/00.js:3521 | 切换welcome／时钟／状态更新 | groups/round | 时钟、总分、排名、领奖台 | renderAll、菜单音乐 | groups、round | 中 | 五页截图、统计随计分刷新 | PASS（截图与回归）；动态时钟未精测 |
| 比赛开始／翻篇／强制结束 | src/script/00.js:1720 | 底部主操作与快捷键 | 当前阶段、答案 | 开题、结束或拒绝无效操作 | 音频、状态、排序 | round | 高 | 真实下一题、强制结束撤销、无效翻篇 | PASS；全部异步初始化组合未测 |
| 选项与批量操作 | src/script/00.js:2180 | 卡片A–D／批量A–D | groupId、opt | 选择／取消／改选 | renderGrid、saveState | groups.selectedOpt | 高 | 真实按钮单选取消、A–D计分；批量按钮保留 | PASS部分；批量选项全流程NOT TESTED |
| 正确答案与判定 | src/core/classroom.js:148 | 设置正解后判定 | correctAns、selectedOpt | 正确+2，错误+0；未答不变 | 事务、计分、动画 | groups、round、stats | 高 | 四正解、全对全错、重复判定、溢出 | PASS |
| All In | src/script/12.js:83 | 卡片及批量开关 | score、道具锁 | 正确×2、错误0；道具使用后锁定 | 音乐比例、道具 | allIn、lastRoundAllIn | 高 | 计分、成功使用取消、冻结取消 | PASS部分；批量与音乐阈值全部组合未测 |
| 手动分数与排名图表 | src/script/00.js:2108 | 卡片／后台改分 | id、delta或绝对分数 | 正负分、排序与动画 | 历史、渲染、里程碑 | groups.score | 高 | 负分、7/8位、大整数、撤销、实时排名 | PASS部分；并列动画／所有里程碑未测 |
| 道具获取／抽取冷却 | src/script/16.js:42 | 全局礼物／举手奖励 | 库存、排名、冷却、随机数 | 加到最多三格队尾 | 抽取会话、音效 | inventory、drawSessionThrottle | 高 | 全部26种直接获取；1/2/4/8组边界 | PASS部分；抽取概率和冷却轮次oracle未测 |
| 主次队列与道具执行 | src/core/classroom.js:106 | 卡片主格／详情／举手 | id、index、库存、持续效果 | 通用验证、效果、消耗与事务 | legacy、defense、音效事件 | inventory/itemStats/itemEffect | 高 | 每道具三场景＋26精确规则 | PASS已列场景；不是所有组合验收 |
| 持续与特殊状态 | src/script/36.js:392 | 被攻击、答题／时间到期 | 星／巨大／强力／幽灵／冰冻／墨汁 | 保留原防御、递减、遮蔽 | 道具引擎、计分、时钟 | itemEffect/booRounds/blooperUntil | 高 | 冻结尝试、状态初始值、刷新与撤销 | PASS部分；到期／叠加全组合NOT TESTED |
| 历史撤销与回溯 | src/script/00.js:5323 | 撤销按钮／历史回退 | historyStack | 操作前快照恢复 | 动画取消、持久化 | historyStack、groups、itemGlobal | 高 | 所有道具撤销、手动改分、强制结束 | PASS；多回合回退和异步决策组合未穷举 |
| 封神榜与最终清零 | src/script/00.js:243 | 解锁后确认归档 | 标题、当前全状态 | 完整归档成功才清零；失败保留 | storage、快照、表彰 | settlement_history | 高 | 归档失败／成功／清零存储失败三路径 | PASS |
| 封神榜CSV | src/script/45.js:133 | 档案导出 | 记录index | 分区CSV含清零前原始JSON | Blob、csvCell | 只下载 | 高 | 真实下载并验证内容；公式中和单元 | PASS；所有电子表格软件人工导入未测 |
| JSON备份与导入 | src/core/classroom.js:50 | 设置数据页／文件输入 | 旧JSON或schema1 | 预检、兼容、失败回滚 | FileReader、normalize、事务存储 | 主envelope及旧键 | 高 | 旧JSON、当前JSON、损坏字段、失败落盘 | PASS；50MB、全profile资源迁移未测 |
| 小组与成员管理 | saveGroupDetail | 详情、设置名单与添加删除 | 编号、组名、颜色、成员 | 增删编辑与名单维护 | normalizeGroup、历史 | groups/members | 高 | 长名称、添加、撤销、特殊字符 | PASS部分；批量名单／删除全流程未测 |
| 随机点名三模式 | src/script/00.js:2867 | 点名窗开始／停止 | individual/group/two_tier、池 | 抽中结果、防重复、耗尽重置 | slotEngine、音效 | picker、pickerHistory | 高 | 实际三个模式开始停止、耗尽 | PASS；两级预选／空池所有组合未测 |
| 举手与奖励 | src/script/36.js:556 | 选组后判对错 | groupId、correct、奖励 | 统计、加分／抽道具／用主道具 | handUI、道具、历史 | handRaiseHistory、stats | 高 | 实际举手、+2奖励与撤销 | PASS部分；错误／连发奖励UI全部组合未测 |
| 快速按人加分 | openQuickPersonV218 | 动态增加的🤑按钮 | 姓名／学号筛选、多人选择 | 按所属小组汇总赋分 | parseStudent、筛选、计分 | groups.score、history | 高 | 源码与入口索引，后续GP-017 | NOT TESTED |
| 成员搜索 | src/script/00.js:2335 | 😎按钮／输入 | 姓名或学号 | 转义后的匹配名单 | parseStudent、groups | 无业务修改 | 中 | 弹窗截图；输入查询全组合后续 | PASS捕获；查询语义NOT TESTED |
| 设置分区 | src/script/15.js:224 | 设置页功能／声音／道具／数据 | 各设置控件 | 对应面板及配置 | 存储、音频、图标 | 多配置键 | 中 | 页面截图、全部入口静态索引 | PASS捕获；每一开关未全测 |
| 音效与节拍音乐 | src/script/00.js:789 | 首次手势／比赛及菜单切换 | 主音量、SFX、上传曲目 | Web Audio、循环、节拍过门 | IndexedDB、BGM与菜单引擎 | audioDB、音量键 | 高 | 真实context／静音／非法decode；人工步骤 | PASS技术冒烟；听感NOT TESTED |
| 音频包／自定义音效 | src/script/00.js:3332 | 音频设置上传、BIN导出导入 | 音频文件、BGMP包 | 持久化音轨与音效槽 | IndexedDB、解码、Blob | sounds库 | 高 | 入口和槽位索引；本次无真实音轨素材 | NOT TESTED完整包回环 |
| 图标、壁纸、缩放与布局 | src/script/00.js:4823 | 上传／还原／缩放按钮 | 图片、比例、列数 | 原主题和自定义显示 | IndexedDB、data URI、CSS | item_icons、ui_icons、zoom等 | 中 | 图标payload、27资源完整性、六尺寸截图 | PASS部分；壁纸包／缩放全矩阵未测 |
| 管理员防误触锁 | src/script/41.js:77 | 🔒按钮／管理操作 | 本地PIN | 允许／拒绝本机高风险操作 | state.isLocked | adminPin | 中 | 导入／最终归档命令拒绝locked；源码边界 | PASS部分；密码修改UI未全测 |
| 规则、百科和提示 | src/script/43.js:18 | ⓘ及二三级页 | info/items/guide、实际道具定义 | 当前规则、提示、动画与说明 | itemVisual、文案、CSS | 无业务修改 | 中 | 百科截图、说明作用域不破坏按钮 | PASS部分；所有菜单／动画每帧未验收 |

## 所有实际道具

以下来自运行时ITEM_KEYS／ITEM_DEFS，不由需求清单猜测。详细效果以原定义、GROUP_ITEM_DESC和26条预期断言为证据。每项触发均为主栏主动使用或对应被动防御；输入含库存、排名与目标状态；依赖共同命令、计分、防御、视觉及音效，持久化inventory/itemEffect/itemStats/itemGlobal，风险均高。

| key | 名称 | 默认次数 | 源码 | 获取／使用／消耗／撤销 | 共用守门／冻结／恢复 | 积分与初始效果oracle |
|---|---|---|---|---|---|---|
| green | 绿龟壳 | 1 | src/script/00.js:ITEM_DEFS；36.js；42.js | PASS | PASS | PASS |
| triple_green | 三重绿龟壳 | 3 | src/script/00.js:ITEM_DEFS；36.js；42.js | PASS | PASS | PASS |
| red | 红龟壳 | 1 | src/script/00.js:ITEM_DEFS；36.js；42.js | PASS | PASS | PASS |
| triple_red | 三重红龟壳 | 3 | src/script/00.js:ITEM_DEFS；36.js；42.js | PASS | PASS | PASS |
| spiny | 刺龟壳 | 1 | src/script/00.js:ITEM_DEFS；36.js；42.js | PASS | PASS | PASS |
| banana | 香蕉皮 | 1 | src/script/00.js:ITEM_DEFS；36.js；42.js | PASS | PASS | PASS |
| triple_banana | 三重香蕉皮 | 3 | src/script/00.js:ITEM_DEFS；36.js；42.js | PASS | PASS | PASS |
| horn | 超级喇叭 | 1 | src/script/00.js:ITEM_DEFS；36.js；42.js | PASS | PASS | PASS |
| bomb | 炸弹兵 | 1 | src/script/00.js:ITEM_DEFS；36.js；42.js | PASS | PASS | PASS |
| hammer | 锤子 | 1 | src/script/00.js:ITEM_DEFS；36.js；42.js | PASS | PASS | PASS |
| coin | 金币 | 1 | src/script/00.js:ITEM_DEFS；36.js；42.js | PASS | PASS | PASS |
| coin_shell | 金币龟壳 | 1 | src/script/00.js:ITEM_DEFS；36.js；42.js | PASS | PASS | PASS |
| question | ？砖块 | 1 | src/script/00.js:ITEM_DEFS；36.js；42.js | PASS | PASS | PASS |
| mushroom | 蘑菇 | 1 | src/script/00.js:ITEM_DEFS；36.js；42.js | PASS | PASS | PASS |
| triple_mushroom | 三重蘑菇 | 3 | src/script/00.js:ITEM_DEFS；36.js；42.js | PASS | PASS | PASS |
| boo | 害羞幽灵 | 1 | src/script/00.js:ITEM_DEFS；36.js；42.js | PASS | PASS | PASS |
| blooper | 鱿鱿 | 1 | src/script/00.js:ITEM_DEFS；36.js；42.js | PASS | PASS | PASS |
| lightning | 闪电 | 1 | src/script/00.js:ITEM_DEFS；36.js；42.js | PASS | PASS | PASS |
| star | 无敌星 | 1 | src/script/00.js:ITEM_DEFS；36.js；42.js | PASS | PASS | PASS |
| mega | 巨大蘑菇 | 1 | src/script/00.js:ITEM_DEFS；36.js；42.js | PASS | PASS | PASS |
| bullet | 炮弹刺客 | 1 | src/script/00.js:ITEM_DEFS；36.js；42.js | PASS | PASS | PASS |
| power | 强力蘑菇 | 1 | src/script/00.js:ITEM_DEFS；36.js；42.js | PASS | PASS | PASS |
| feather | 羽毛 | 1 | src/script/00.js:ITEM_DEFS；36.js；42.js | PASS | PASS | PASS |
| fire_flower | 火之花 | 3 | src/script/00.js:ITEM_DEFS；36.js；42.js | PASS | PASS | PASS |
| ice_flower | 冰之花 | 3 | src/script/00.js:ITEM_DEFS；36.js；42.js | PASS | PASS | PASS |
| boomerang_flower | 回旋镖花 | 3 | src/script/00.js:ITEM_DEFS；36.js；42.js | PASS | PASS | PASS |

## 隐藏入口、设置、存储、动画与资源

SOURCE_CATALOG.md列出所有命名函数及覆盖定义、输入、返回、副作用字段、调用依赖、风险、事件入口、存储键和88个原动画名；artifacts/static-inventory.json保留机器可读AST结果。静态模板／动态字符串事件均扫描，含解锁后管理、设置控制的道具模式、三重续用、首次举手抽取、刺龟壳防御选择等条件分支。

不能据此声称所有二／三级菜单和所有条件都经过浏览器操作。SOURCE_CATALOG 的单实现 NOT TESTED 与本表集成PASS分开记录，避免以调用存在冒充覆盖。


## V2.19.0 桌面 UI 增量

实现位置：`src/ui/model.js`、`src/ui/desktop.js`、`src/ui/desktop.css`。

|功能|触发与数据|持久化|风险与验证|
|---|---|---|---|
|欢迎 Dashboard、每日卡片与挑战|进入欢迎页；真实小组、道具、档案、本地审核示例|独立 UI 偏好和题库键|中；桌面 UI 与交互测试，挑战不计正式积分|
|历史时间轴与差异|选择真实操作前快照；恢复沿用原语义|原历史结构|高；快照、恢复确认及业务回归|
|档案概览、筛选与领奖台|真实已归档数据；缺失分数不参与最高分统计|原档案结构|高；实际归档、并列、CSV、离线测试|
|八类设置导航|移动原设置节点，保留 ID、处理器和存储键|原设置键；新 UI 偏好独立|中；分类、滚动、恢复测试，逐一资源上传仍待人工验证|
|全局提示、弹窗与工具栏隔离|页面切换、模态层、原比赛入口|无新增业务字段|中；原生顶层 toast、焦点与 99 弹窗场景|
|点名与道具视觉生命周期|原业务结果驱动 UI；关闭取消异步展示|原业务结构|中；三模式、异步关闭、道具状态注入|

实际结果及未测范围以 `docs/reports/DESKTOP_UI_ACCEPTANCE.md` 和 `artifacts/desktop-ui/acceptance-matrix.json` 为准。
