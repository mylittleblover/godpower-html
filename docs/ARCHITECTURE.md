# 独立网页版架构 V3.0.60

此分支是无插件的网页版过渡发行，基础来自 V3.0.26，恢复了后续 V3.0.53 中已实现的非插件功能和可靠性修复。Electron 壳从同一 HTML 构建同步；另一套 desktop 重置项目不在本分支范围内。

- `src/domain`：身份、比赛计算、成就账本、名单、课程、资源及主页布局纯模型。
- `src/application`：课堂命令、事务、判题、撤销及旧课堂适配。
- `src/infrastructure`：版本化课堂存储、隔离名单/课程/布局仓库、IndexedDB教学资源和音频兼容。
- `src/ui`：五个页面、生命周期、头像展示、设置工作区、恢复界面、主页编辑及动画。
- `src/items`：26种道具定义与执行适配；通过原命令入口持久化和撤销。
- `src/runtime` / `src/styles`：由旧编号文件迁出的职责模块；原目录已退役，仍有效的兼容行为按owner保留。

主页由 `HomeDashboard` 直接注册11类内置卡片，没有插件依赖。布局独立保存于 `godpower_home_layout_v1`；已保存的三种官方插件卡片类型被映射为内置类型。卡片编辑不修改比赛状态。

设置中的学生与小组、课程表与教学资源、道具与图标、音效与音乐各自拥有明确入口。名单头像经本地资源仓库校验后用于小组卡、老虎机及全屏结果；未提供头像时使用既有回退。

`godpower_state_v2` 仍是课堂唯一权威快照。存档恢复工具保护损坏原文，用户确认后才恢复可用副本。道具使用、实际失分与举手奖励获得事件保留 V3.0.53 的已实现范围；完整成就和状态机仍未完成。

发行通过 `src/index.template.html` 和 `src/manifest.json` 组合源码，`npm run build` 生成完全离线的 `dist/godpower.html`。插件中心、插件平台、插件存储、官方manifest和插件主题适配均不进入发行。

验证与入口清单见 `docs/validation/WEB_TRANSITION_FEATURES.md`。可重复验证：`npm run test:web-transition`。

V3.0.56 将菜单、思考、比赛、开场、过门、结算及BGM试听统一接入独立 musicGainNode，然后进入 masterGainNode。音效保持 fxGainNodeV2176 → masterGainNode，音乐滑条不会改变音效或主音量。音乐偏好独立存于 politics_bgm_volume，缺失默认为1。

V3.0.57的Electron页面适配只负责外部点名入口；普通弹窗不再克隆、隐藏或通过IPC回放输入。它们继续由原有内部弹窗生命周期管理。


## 3.0.59 UI 所有权治理

DesktopUI仍是兼容组合入口，未新增同名覆盖链：

- settings-layout.js：九类设置元数据、现有节点的移动与分组；不保存数据、不克隆输入。
- content-bank-editor.js：知识/挑战表单、导入交互和错误显示；通过注入的实时读取与保存端口访问题库，验证/持久化仍由原saveContentBank负责。
- window-motion.js：窗口退出Map、唯一结束/取消回调、卸载清理；不执行积分或随机判定。
- disclosure-motion.js：展开动画、重复安装保护、监听器作用域与清理。
- battle-card-view.js：只读小组卡片HTML投影；battle-grid.js保留DOM、装饰、头像、FLIP与排序适配，render.js仍是唯一全局刷新owner。
- desktop.css → roster-workspace.css → teaching-workspace.css：原CSS连续分段，加载位置和规则顺序不变；没有用追加important修补布局。

每日内容由DesktopUI生成，HomeDashboard仅接管布局。dailyRevision标识内容代次；一次替换上一代，清除停用类别的旧卡片，不修改卡片实例配置。答题反馈相对于所属卡片查找，不依赖卡片移动前的容器。

普通窗口没有data-native-detached写入方；已移除失效的焦点/动画/滚动分支。data-external-picker仍保留，避免隐藏的原点名弹窗抢焦点。

尚未实施全量比赛DOM增量协调。FLIP、攻击等待与计分输入相关刷新必须在独立验证下处理，不能为了减少innerHTML直接改变时序。


## 3.0.60：旧编号源码全部退役

- `src/script/`、`src/style/`不再存在。
- `src/runtime/`按core/bootstrap、classroom、competition、items、picker、audio、archives、history、storage、ui划分兼容运行职责；这不是第二套业务内核。
- `src/styles/`按base、shell、battle、dialogs、items、settings、audio、classroom、themes、ui划分样式责任。
- 55个主脚本片段和6个学生/举手片段保持在各自原script标签内，确保函数提升、词法绑定及初始化时序不变；基础CSS的15段保持同一style单元及原层叠顺序。
- manifest的executionGroup明确同一执行单元内的有序片段；构建仍全部内联，单文件不需要开发服务器或CDN。
- 全局/举手抽取各有一个具名函数定义，位于runtime/items/draw-flow.js。旧版24处失效实现/捕获/包装/辅助代码已删除，不再依赖覆盖顺序选择抽取实现。
- CSS只删除33条被后续同选择器、同属性、同值及优先级无条件覆盖的声明；条件规则、关键帧和无法证明失效的兼容层保留。

逐源映射见SOURCE_MIGRATION_MAP.md，原审计工具改为按manifest扫描，不能再只遍历旧script/style目录。测试中的历史路径fixture仍可保留，用于验证旧版数据和仓库扫描兼容。
