# 《上帝的力量》3.0.68 基线后续重构设计评审稿

> Superpowers / Brainstorming 设计规格 · 2026-11-03 · **只读核查后生成，待评审；不是已实施的修改**  
> 建议仓库路径：`docs/superpowers/specs/2026-11-03-godpower-3-0-68-next-design.md`

## 0. 基线指纹与核查口径（必须固定，不要笼统写“最新版”）

| 项目 | 当前准确事实 |
|---|---|
| HTML 开发仓库 | `mylittleblover/godpower-html`，分支 `refactor/semantic-style-governance`，HEAD `cffb111832ba70e88dfd0e6a75629dd94ce1914f`，`package.json=3.0.68` |
| Electron 开发仓库 | `mylittleblover/godpower-electron`，同名分支，HEAD `a1583fd4c1b2acd06bd66d2b382d5e886c250d21`，`package.json=3.0.68` |
| 两仓库 main | 均为 3.0.64；HTML 开发分支相对 main 前进 11 提交，Electron 前进 4 提交；**不要以 main 作为新功能基线** |
| Electron 实际绑定的 HTML | `resources/BUILD_INFO.json`：`sourceCommit=ca1f7c5cd9ad30a6cd5fe0947cb3f8c83f423f66`，SHA-256=`81a538d60630dfd782787397469ec830240e66375986844823386ffc958b5165`，11,433,367 字节 |
| HTML 最新提交与已同步提交的差别 | `ca1f7c5...cffb111` 只有 1 个 README 下载说明提交，**没有未同步的 HTML 业务代码** |
| 主体规范 | `DEVELOPMENT.md` / `AGENTS.md`、`docs/ARCHITECTURE.md`、`docs/MAINTENANCE_BACKLOG.md`；HTML `src/styles` 是 CSS 唯一根目录，Electron 保持原生窗口/IPC/本地文件 |
| 本次验证性质 | 已读取 GitHub 实际分支、包版本、锁定同步信息、提交与源码、两仓库性能报告；没有在本会话 checkout、安装依赖、运行测试、运行 Windows 程序或修改 GitHub |

直接证据：
- HTML 最新提交：https://github.com/mylittleblover/godpower-html/commit/cffb111832ba70e88dfd0e6a75629dd94ce1914f
- Electron 最新提交：https://github.com/mylittleblover/godpower-electron/commit/a1583fd4c1b2acd06bd66d2b382d5e886c250d21
- HTML 性能报告：https://github.com/mylittleblover/godpower-html/blob/refactor/semantic-style-governance/docs/performance/2026-11-03-PERFORMANCE_3.0.68.md
- Electron 性能报告：https://github.com/mylittleblover/godpower-electron/blob/refactor/semantic-style-governance/docs/performance/3.0.68.md

## 1. 3.0.67～3.0.68 已经实现的内容：从待办中移除

**已实现且在仓库报告中有测试证据，不得重复重写：**

1. `src/core/picker-bridge.js`：随机演出样式在一次 `rolling` 通知时选定，而不是每次读取快照都随机变化。100 次空闲快照由 93 次无意义变化变成 0 次。Electron 原有 120ms 轮询尚在，但不会因随机样式不停广播。
2. `src/runtime/ui/navigation-and-clock.js`：隐藏欢迎页期间每秒时钟不再无意义调用欢迎页完整渲染；时钟/业务状态仍更新。100 次隐藏 tick 的欢迎页渲染调用由 100→0。
3. `src/ui/desktop.js`：`renderWelcome()` 隐藏时仍执行 `observeVisualState()`（以免道具视觉事件丢失），但不刷新欢迎页 DOM。隐藏页 100 次名称更新产生的相关 DOM 改动 1500→0。
4. `src/ui/desktop.js`：弹窗 MutationObserver 改为按 mutation 影响的窗口局部协调，不再因 100 次无关样式变化遍历全部 16 窗口（原 1600 次查询→0）；保留插入、关闭、焦点、Escape 和原生 dialog 生命周期。
5. Electron `desktop/save-file.cjs` / `desktop/windows.cjs`：此前同步 `writeFileSync/readFileSync/renameSync` 已改为接受时固定路径和字节的 FIFO 异步磁盘 I/O、写后读回校验、原子替换、错误后队列恢复；读/换路径/退出等待已接受写入。8 次 1 MiB 磁盘写入时，主进程事件循环最长间隔基线约 32.3/43.1ms→4.9/5.1ms。**不能再把“将同步写入改异步队列”列为未做任务。**
6. 3.0.65/66 已完成 CSS 语义命名、旧覆盖声明清理、统一 `src/styles/` 和关于页单入口。新的改造不得恢复多层版本化补丁。

**测试证据（仅引用原仓库报告，不是本会话复跑）：** HTML 365 项单元/集成 PASS；Electron 59 项单元 PASS、20 项真实 Electron 场景 PASS；Windows x64 ZIP 交叉构建通过。Electron 场景运行于 Linux Xvfb+xfwm4 1920×1080、DPR1；Windows 实机、触屏、投影/GPU帧率 **NOT TESTED**。仓库宣称的 `renderAll` 同步中位数 106.3→31.1ms 为少量合成样本，不可外推到所有机器。

## 2. 当前仍未解决的问题及技术诊断

| 问题 | 当前源码/报告证据 | 设计判断（不是未经测量的修复结论） |
|---|---|---|
| 全量比赛卡片重建 | `src/ui/render.js` 刷新多视图；`src/ui/battle-grid.js` 仍 `grid.innerHTML=""` 再重建小组卡片；伴随 FLIP 和多次 rAF | 下一轮首要性能热点，建立带编辑焦点、14组几何、动画/道具叠层的增量 DOM 实验，**先测再改** |
| 点名滚动 DOM 重复刷新 | `src/runtime/picker/selection-engine.js` 50/70ms 更新名称、头像 DOM；`ClassroomFeedback.startLive` 又运行独立视觉转带 | 调查重复不可见 DOM、快照发布频率与滚动合成；不可改变最终抽中结果/防重逻辑 |
| Windows 全屏特效卡顿 | HTML 报告全屏帧间隔严重；软件环境 `ANGLE SwiftShader`，GPU compositing disabled；`will-change/contain` 对照收益未超过噪声而未入产品 | Windows 真机对照是必要门禁；未证实是动画库导致，**不更换动画引擎** |
| 大存档/历史/资源 | 小型 `saveState` 快，但历史最多 40 份包含 groups、itemGlobal、成就等深拷贝；自定义头像/音轨可能使 JSON stringify、decode 和初始化成本显著增长 | 测实际大样本保存、序列化、载入、heap/音频，形成确定性 Profile；不要凭空说“已修复存档问题” |
| 存档结构仍旧 | HTML `src/runtime/storage/classroom-save.js` 当前权威 envelope＋旧兼容镜像；`src/infrastructure/classroom-roster-repository.js` 仍存在 `profiles/classrooms/assignments` 顶层；Electron 固定 JSON 镜像 | **新多存档格式、程序设置与比赛状态分离、旧档自动迁移均未完成**。3.0.68 仅改变磁盘写入执行方式 |
| 读写确认边界 | HTML `src/infrastructure/save-file-bridge.js` 仍为 fire-and-forget 桥接；Electron FIFO 保证同进程已受理写入的次序与退出等待 | 多存档切换需要 `saveId/revision/generation` 语义、明确写入 ACK/未保存提示；不能误称现有 FIFO 已解决跨存档事务安全 |
| 举手/百科/AI/事件 | `HandRaisePort` 和原生 IPC 已有；`about-view.js` 混放百科；`AchievementCatalog` 有 60 项，旧事件仅设计规格 | 本轮需求属于新产品行为；不能因为某个类名存在就标为已实现 |

## 3. 总体产品方向

**用户已确认的产品边界：**插件系统主动移除，不以“恢复插件化”为技术目标。网页和 Electron 共享同一比赛业务规则及 UI 源；系统级悬浮窗、原生窗口、多显示器、文件对话框等留 Electron 实现。网页版不再承载课程表/资料库的产品入口；删除前保留遗留数据，防止旧用户损失。

三个工程方案取舍：
- **A（推荐）**：在 3.0.68 上渐进治理：增量刷新、现有 CSS/WAAPI + 可取消时间轴、存档 v2、统一手势状态机。变更可逐任务回滚，保留已测行为。
- **B（备选）**：以 GSAP 接管复杂表演时间轴。能提高编排清晰度，但无法修复频繁全量 DOM 重建或同步 JSON 序列化；除非 A/B 原型实测更好，否则不引入。
- **C（限定场景）**：PixiJS/WebGL 只绘制大量粒子或特殊全屏视觉。保留 DOM 的卡片、输入框、ARIA 与焦点；无 Windows GPU 实测时暂不采用。

原则：**业务事务先确认、动画只呈现既成事实**。保存失败不能显示成就永久解锁完成；关窗/撤销/切档后旧动画不能重复加分、抽奖或向新存档写回。

## 4. 16 项需求的新版规格

### R01 性能、存档问题与动画引擎评估

- 保留上文列为已完成的 3.0.67/68 修复。
- 针对 14 组 1920×1080/1x，设计连续判题、卡牌举手、道具全局抽取、点名、切页、音效运行、50 次开关窗及大历史；记录 Long Task、Frame interval p50/p95、`renderAll`/`renderGrid`、DOM count、heap/JS allocation、序列化耗时和 Electron IPC latency。
- 在 3.0.68 上选择 **一个**热点写红灯测试、最小化优化、同条件前后比较，效益不足不保留复杂代码。Windows 原生全屏单独验证 GPU/窗口透明合成、模糊、粒子与系统缩放。
- 3.0.68 的异步 FIFO 必须保留；扩展到存档 revision ACK/跨档保存/异常恢复，不回退同步主进程磁盘写入。

### R02 举手重新设计（主界面和悬浮窗共享同一业务状态）

状态：`CLOSED → SELECT_GROUP → JUDGE(正确/错误两张全屏卡) → (错误→SELECT_GROUP；正确→REWARD_CHOICE 三张卡)`。

- `SELECT_GROUP`：比赛页其他背景暗化，小组卡片**不暗化且仍可点击**；再次点举手按钮退出；当前小组数量与14组布局几何不变。
- `JUDGE`：全屏“正确/错误”卡；错误只记录一次且回选组；正确只记录一次然后出现三张奖励选择卡（我要加分 / 我要抽道具 / 我要用道具）。
- `SCORE`：六张来自现有真实分数槽位的卡牌，下方整数输入框；成功提交后回选组。
- `DRAW`：使用原有正式抽取命令取得结果，再播放全屏转轮→揭晓→退场；展示失败/跳过不重新抽奖。
- `USE`：使用同一正式道具命令，复用现有全屏道具演出；效果结算唯一，演出结束后回选组。
- 当前**建议默认**每次正确判定选取并完成一项奖励；此处是待设计评审的推荐行为，不是用户已明确确认“三项都必须领取”。禁双击、过期 selectionId、同一会话重复中奖；业务失败应留在当前层并有恢复路径。
- 由纯 reducer 控制视图，`src/application/hand-raise-port.js` 拥有权威命令。移除旧 `judgeHandRaise` 多层封装而非继续包装。Web/Electron 使用同一个 session/generation 协议。

### R03 / R04 玩法与关于

- 新独立「玩法」一级页面：28 道具百科、七状态百科、操作规则及抽取权重说明。规则文案从 `ITEM_DEFS`、`ITEM_ORDER`、状态定义等唯一事实投影，避免复制第二套生效描述。
- 「关于」作为设置中的分组，迁移现有公司/版本/帮助说明；旧按钮和深链重定向。不得让失效弹窗继续监听旧事件。

### R05 多存档 v2：精简顶层，旧版自动转换

**推荐 v2 模型**（必须先做 migration preview/contract 再实施）：

```text
SaveIndex {schemaVersion: 2, activeSaveId, entries:[{saveId,name,revision,createdAt,updatedAt}]}
SaveDocument {schemaVersion: 2, saveId, revision,
  roster:{students,groups,assignments},
  match:{season,round,groups,picker,inventory,statuses,history,randomEvents},
  achievements, archives, perSaveOptions, assetReferences}
AppPreferences {schemaVersion:1, theme,zoom,layout,audioPrefs,keyboardPrefs,motionPrefs,...}
AssetStore {resourceId,mediaType,sha256,bytes,...}
```

- 不再要求 `teacher → classroom` 作为业务顶层；各旧教师/课堂有效组合迁为独立存档，保留可追溯来源/重复命名处理；无法认定同一身份时禁止默默合并。
- 学生、小组、赛季保留稳定 UID，头像与音轨通过资源 ID 指向独立存储；“只导出 JSON”与“完整资源包”明确区分。
- 迁移程序：只读检测旧格式→导出原文与资源→预览映射数量/分数/道具/历史→staging→校验→新格式可靠提交与读回→切换→保留只读来源及迁移收据；首次启动自动发现并预览/无歧义自动转换，任何错误必须保护原始数据。重复重启/导入不产生重复存档。
- `AppPreferences` 全局配置独立于任何比赛快照；个别存档专属偏好（例如可选的比赛规则）作为 `perSaveOptions`，不得混淆音量/主题等程序设置。
- 多存档切换必须等待当前写入确认，取消旧会话和展示，避免跨档窜写；大 JSON 串行化压测与索引损坏恢复独立验收。

### R06 小组成员添加

默认方案：从当前存档学生池中可视化搜索/多选、快速新增、移出小组与批量导入，按 `studentUid` 去重并显示头像/学号。保留一个明确兼容入口导入旧文本成员。避免把姓名字符串当作不可变身份。是否允许一个学生同时属于多个小组属于需确认的业务规则；默认单组归属。

### R07 头像全屏演出

点名（按人/按组/先组后人）显示对应个人/小组头像；道具发动显示发动方小组头像，受影响组可列头像，缺失时主题色与名称首字回退。Electron 通过受控 IPC 传有界尺寸和 MIME 的图像数据或资源引用，不把全量档案与大头像每帧发送。

### R08 随机事件

沿用旧规格中的 **EV01～EV16 作为候选事件清单**，每 4～8 个有效正式答题回合全自动触发，绝不要求教师点击确认或领奖；结算同一事务记录确定性 PRNG、事件、目标、持续期、下一触发计数和撤销快照。新触发持续效果从下一有效回合开始；无合法候选记录原因并重排。旧规格“推荐定稿”的权重/数字仍需和现有 28 道具、七状态逐项核查，不可偷偷视为用户确认。旧插件归属说明全部移出执行方案。

### R09 成就与档案页

保留 `src/domain/achievements/catalog.js` 现有 **60 个 ID** 和 ledger；已确认 `learning-rules.js` 主要覆盖最初 12 项的学习类判定，其余类别需要事件事实支持才能解锁，不能凭最终分数倒推。档案页展示历史/赛季、解锁时间、进度、隐藏成就、按组筛选。赛季归档与永久记录事务一致，归档失败绝不清零，不得因导入/撤销重复刷成就。

### R10 移除课程表/资料库（网页版范围）

移除页面入口与已判明仅网页使用的模块，保留旧数据/导出与迁移依据；查 `src/ui/teaching-workspace.js`、`teaching-resource-workspace.js`、`src/domain/teaching-*`、`src/infrastructure/teaching-*` 和 `src/manifest.json`；先审计 Electron 原生规划及实际引用，不能误删除共享学生、头像、题库/知识卡等其他业务数据。禁止顺便恢复插件中心。

### R11 AI 对话与安全控制

新增独立可禁用的 AI 面板；无网络、无 API key 时旧课堂完全正常。初期只读查询，再分阶段开放白名单意图：查询组/成绩、建议加分、申请抽道具/点名等。每个写入先 dry-run 显示真实影响，再要求教师确认，通过 `saveId+revision+commandId` 和统一课堂命令实施，AI 不得直接执行任意 JS、DOM、storage、文件系统或伪造正式判题成就。上传姓名/头像/学号前提示并最小化脱敏；密钥不得硬编码进单文件。

### R12 悬浮窗点名与举手交互

Electron `renderer/picker.js/html/css` 举手列表**一行一组**，选组后展示与主窗口相同的全屏正确/错误卡牌；三奖励选择通过主窗口的 `HandRaisePort`，原生全屏道具抽取要有滚动/揭晓动画。点名抽中者与举手组是不同概念，不得将 `groupChips` 预选池当作答题判定入口。保持置顶、主窗隐藏、跨屏、Escape、PPT 场景的生命周期与授权边界。

### R13 / R14 小组卡片可读性与前三名胶囊

- 小组主题色严格保持原值。浅色积分文字改用轻量中性色深底小面板或自动对比背景，不要通过把颜色改成深色伪装解决；大字目标对比 ≥3:1，正文目标 ≥4.5:1；长分数/双主题/14组不遮挡。
- 排名胶囊固定为第一名金、第二名银、第三名铜（文字与背景可辨）；并列名次按现有 UI 排名策略清晰处理，避免改变抽取所使用的稳定排序算法。

### R15 道具平衡：加入分差连续调权

先做真实 28 道具强度评估和带种子的 4/8/14/20 组模拟，考虑分数变化期望、名次收益、影响目标数、道具次数、持续防御/免疫、全场唯一性、背包容量与负分限制。再用 **排名进度 + 与榜首的相对差距** 构造连续权重曲线，同分区内靠后的组也逐渐偏强，边界不产生骤然跳跃；有实际两倍正分差时提升强追赶道具概率，但不得必中。前三区/后30%传统硬屏蔽与连续目标存在冲突，改动每项硬屏蔽必须在规则审查中明确列出。首次举手特殊奖池、三格、持有去重和独有道具不被概率覆盖层破坏。

### R16 精确道具规则调整

- 绿龟壳/三重绿龟壳每次有效命中：从目标当时积分扣除 `Math.round(score/3)`；蘑菇/三重蘑菇每次使用：自增 `Math.round(score/3)`；三重仍各三次，不是一次三倍。保留原防御、额外加成、负分合法性和四舍五入既有约束。
- 强力蘑菇从 3 次有效答题延长到 **5**。结算前冻结排名序列和本组目标名次，之后按新的结算规则强制上升 1 名；原排序对象结算后分数变化不应任意改变其既定“提升一名”资格。目标分数以所需超越组的结算后积分 +1 计算，无法强制下降原有积分。**多人强力蘑菇同时触发、并列组和“相对原先上位组”/“最终排名恰升一位”的冲突必须在规则签收时写成严格 oracle**，不可让工程师自行猜。
- “随机范围道具”限定目标只从**当前排名前三组 ∪ 最后两组**中挑选，排除发动组与不合法目标并去重；需要先由实际 28 道具 `target` 定义生成白名单，不能把红壳、闪电等指定目标/全场道具误改。少于 5 组、前三和末二重叠时按集合处理，空候选不消耗道具，且有回归测试。

## 4.1 需求实施状态快照（基于3.0.68代码，而非旧计划）

| 需求编号 | 3.0.68已具备的基础 | 尚未完成的目标 |
|---|---|---|
| 1 卡顿/存档/动画 | 快照去重、隐藏欢迎刷新、局部弹窗观察器、异步FIFO | 网格/转轮/大存档，Windows全屏诊断，最终动画选型 |
| 2 举手界面 | 事务化HandRaisePort和旧奖励入口 | 全新选组暗化、正确错误/三奖励全屏卡牌、单状态机 |
| 3 玩法页 | 旧About具28道具/七状态文案 | 独立一级玩法页面 |
| 4 关于入设置 | 关于页有单一渲染owner | 设置分组和旧路由迁移 |
| 5 多存档 | 单课堂envelope与名单仓库，Electron原子保存 | v2多存档、设置分离、旧教师课堂迁移 |
| 6 成员添加 | 旧成员文本区和名单工作区 | 搜索/多选/身份去重的可视化添加 |
| 7 演出头像 | 点名已能用有限头像数据 | 所有点名模式和道具发动/目标的统一演出 |
| 8 随机事件 | 16候选规格文档 | 正式引擎/4～8回合调度/事务撤销 |
| 9 成就与档案 | 60项目录、部分学习类事件账本 | 余下规则、进度、赛季归档和档案展示 |
| 10 退役课表资料库 | 现存模块和数据 | 验证依赖后移除网页版入口/实现，保留旧数据 |
| 11 AI | 已有普通课堂命令与查询数据 | AI只读对话、安全白名单控制及人工确认 |
| 12 浮窗 | 现有picker及道具/举手IPC | 一行一组、全屏判定卡、浮窗抽取演出 |
| 13 浅色积分 | 颜色显示与现行对比样式 | 保持小组色的可读数字方案 |
| 14 前三名胶囊 | 现行排名胶囊 | 金/银/铜染色与并列视觉策略 |
| 15 道具权重 | 前中后三段权重、去重/唯一过滤 | 28项强度评估、分差连续调权 |
| 16 指定数值 | 旧1/4公式和3轮强力蘑菇 | 1/3、五轮、结算前排名、随机范围目标 |

## 5. 范围与已决/未决表

**已由用户确认：**不恢复插件；16 条功能方向；举手主要互动形式；玩法与关于位置；多存档取代教师/课堂顶层；1/3 数值、强力蘑菇五轮、抽取分差调权、随机目标范围；随机事件完全自动。

**本设计给出的默认方案，仍待规则评审，不冒称用户确认：**一次答对只选择一次奖励；强力蘑菇多人/并列顺序及“恰升一位”优先级；哪些随机道具属于变更白名单；学生归属是否单组；旧教师×课堂组合存档拆分及同源去重；AI 哪些写权限可以开放；16 事件逐项效果与概率。

## 6. 发布与质量门禁

- 版本基线必须核对上文真实 HEAD 和 `BUILD_INFO`；HTML 先变更与构建，Electron 从已提交 HTML 构建同步，**绝不直接编辑 `resources/index.html`**。
- 功能范围与真实测试区分：3.0.68 旧报告的 PASS 是历史证据；后续每个任务须重新跑关联测试才可标 PASS。
- 必保 28 道具/60 ID/16 候选事件/14组固定布局/撤销/异步防御/音效/头像/无插件离线单文件能力。
- Windows x64 交叉 ZIP 不等于 Windows 真机使用、性能、PPT 置顶、触屏和多显示器验收；这些都需单独执行。
- 先评审设计，再按可独立回滚的小任务 TDD 实施；本文件并未授权对任何真实数据执行不可逆转换。
