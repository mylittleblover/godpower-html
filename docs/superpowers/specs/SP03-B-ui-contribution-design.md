# SP03-B：UI 贡献、插件中心与主页工作区

状态：设计待审。关联：[总规格](2026-10-20-godpower-v3-plugin-platform-design.md)、[运行环境](SP03-A-plugin-runtime-design.md)。

## 1. 目标、非目标和当前映射

新增一级「插件」标签；统一页面、面板、卡片、导航、设置贡献。保留已有欢迎/比赛/历史/档案/设置的风格和入场动画，不改battle网格、垫片、底栏高度。主设置保留全局账户/课堂/数据与安全；插件配置进入插件中心，主设置可有深链但不复制配置表。

当前 src/ui/welcome-v2.js 读取state、ranking与历史并控制连续横滚；src/ui/desktop.js拥有每日知识/题目、题库编辑、设置和偏好；src/ui/render.js及battle-grid.js拥有比赛投影。先为这些组件增加宿主投影端口，不把脚本或DOM整体搬进第三方frame。基础资源中心先以ResourceService和插件入口接入，后续独立页面另验收。

## 2. Contribution Registry 契约

注册是激活时的原子批次：{pluginId(宿主注入), localId, kind, version, scope, requiredPermissions, descriptor}。kind为navigation/page/panel/card/settings/commandShortcut/viewPreset/decoration。完整ID为pluginId/localId，重复或未知slot拒绝整批，不覆盖主程序默认组件。dispose(activationId)必须清理导航、事件、定时器、焦点和音频租约。

页面描述 {id,titleKey,iconResource,route,renderer,requiredPermissions,emptyState,errorState}；route固定为 plugins/:pluginId/:pageId，禁止覆盖battle/history等核心路由。renderer可以是宿主声明性schema，也可打开隔离插件工作空间；不接收任意HTML写主DOM。

面板描述 {slot,placement,priority,renderer,sizeConstraints}。开放槽首批：home.cards、plugins.overview、plugins.workspace、resources.tools、settings.pluginLinks、competition.transientOverlay。competition.transientOverlay只接收提交后短暂反馈，不改变卡片/网格尺寸、不拦截普通按钮。战斗卡片常驻槽默认不开放。

命令快捷入口只包含commandId与schema参数，不包含可执行onclick；宿主显示真实命令语义和必要确认。安全/权限/删除提示不允许贡献替换。

## 3. 插件中心结构与交互

顶层：概览、已安装、功能与工作空间、主题与界面、管理。选中插件后子导航：功能页、设置、权限、依赖、数据、版本、诊断。总览可搜索名称/学科/类型，支持收藏和最近使用；最近使用只记录已打开的有效入口，不因背景刷新刷时间。

卡片显示真实安装/启用/激活状态、版本、来源和缺失能力。安装按钮打开本地包选择及权限/依赖预览；启用与删除分开，卸载默认保留数据。完整页面占独立工作区，不塞进设置滚动长列表。依赖失败显示可执行恢复步骤，不只显示空白页面。

导航服务 owns route、focusReturn、history。深链只接受注册且授权路由；未启用提示启用，缺包提供安装/返回。切教师/课堂先取消未提交视图动作；保存中按回执处理，不能再次提交。

## 4. 卡片注册与实例数据

CardDefinition：{id,nameKey,iconResource,dataSelector,configSchema,minSize,maxSize,recommendedSize,refreshPolicy,action,requiredPermissions,emptyState,errorState}。dataSelector是宿主白名单查询或已授权service，不是任意JS表达式。refreshPolicy为onCommit/manual/interval（最短30秒）；不可见时暂停轮询。action为navigate/openPanel/requestCommand白名单。

CardInstance：{instanceId,definitionId,pluginId,config,grid:{x,y,w,h},hidden,version}。同类型可以复制为多个instanceId，配置相互独立。宿主检查尺寸、坐标、权限、config schema；插件不提供绝对像素定位。

当前四张推荐卡片以两列统一网格默认迁入（知识、道具、荣誉、挑战），原上方欢迎区/统计区/小组横滚不强制变成可拖拽。道具卡归宫本茂插件；知识/挑战保留现有题库适配，政治插件迁入后由该provider供数；荣誉是核心课堂档案投影。停用后保留instance和位置，显示给教师的缺失插件说明可在编辑模式看到。

## 5. 网格布局与作用域

WorkspaceLayout：{schemaVersion:1,layoutId,ownerScope,name,revision,grid:{columns:12,rowUnit:24,gap:16},instances:[],basePresetId}。响应式容器以12列映射；最小/推荐尺寸以网格单元表示，卡片高度可调且内部滚动受约束，文本不能靠裁切重要按钮适配。

有效布局解析：课堂场景显式layoutId > 教师学科layoutId > 教师默认layoutId > 应用默认。选择整份布局，不逐层合并坐标，避免重叠。预设包含课堂竞技/日常教学/学科演示；另存为不会改系统预设。

用户进入明确编辑模式后才能拖拽/缩放；日常课堂点击仍执行卡片动作。支持添加、删除、隐藏、复制、方向键移动、Shift+方向键缩放、配置、另存/恢复默认、导入导出。拖动只改内存预览，松手校验碰撞并保存一次；Escape取消。稳定打包顺序为y/x/instanceId，发生冲突顺序向下避让，不能改其他scope布局。

隐藏或停用插件的格位保留在完整布局中；展示时保留空位而不挤占其他卡片的持久坐标。编辑模式用占位标示，普通模式不展示故障堆栈。重新启用恢复原位；缺定义时导入仍保留opaque配置并标unavailable，不删除。

导入限制最多100实例、JSON 1MiB、已知grid版本、合法坐标/尺寸/ID、不含脚本或HTML；未知插件只登记待恢复，不能自动安装。导出含schema/配置/布局，不含授权令牌或学生名单；插件config中资源引用只导出引用并标资源缺失，不私自把资源全打包。

## 6. 视觉、动画与可访问性

复用现有设计token、青绿珊瑚/主题token、统一❌关闭按钮、焦点环与底栏分组。新插件标签加入顶栏逐个自上而下入场序列，当前五页的时长/顺序不被重播打断。

卡片首次进入保留从上到下交错动画；拖拽移动使用transform/opacity，真实位置在提交后归位；不持续重播。面板打开下向上非线性入场，关闭向下非线性退出；展开区域高度过渡后清理inline临时尺寸。尊重减少动态与关闭动效，切页/停用/异常时清理所有动画和点击遮罩。关闭恢复触发入口焦点，Escape处理最上层，Tab限定当前模态。

插件frame可有私有样式，必须容器范围内布局；宿主声明卡片用统一token。装饰pointer-events:none、不盖按钮，单次播放最长3秒或可跳过；长展示/全屏演出可跳过，跳过位于右下角。hover tooltip保留3秒自动消失规则。

## 7. 数据、失败和兼容

布局、收藏、最近使用按teacher/subject/session关联存储，与课堂成绩分离。配置立即保存的原行为不改成必须手动保存；布局编辑保存时机明确显示，CAS冲突保留本地草稿并提示重新载入，失败不宣称保存成功。

插件停用：撤销入口和渲染租约，保留布局/数据；打开的页转宿主不可用状态，不能留下失效iframe拦鼠标。渲染失败仅替换该卡片/页为错误边界；其余卡片继续工作。主程序默认页即便所有插件故障仍能导航。

旧偏好 godpower_ui_preferences_v1、godpower_ui_bank_v1 不删除；旧值只读映射到新配置副本，确认新设置持久成功后再切读取端。比赛布局配置不参与Dashboard迁移，columnMode/zoomLevel/resizerHeight完全保持。

## 8. 验收标准

在Chromium 1920×1080 1x验证：六个一级导航、不同行为插件页、全部管理子页、权限拒绝、空/错误/大量卡片、100实例、长文案、键盘编辑、拖动/缩放/取消/刷新、四种layout scope优先级、停用重启再启用恢复、导出导入及非法布局拒绝。对比既有首页动画和两主题截图；同配置14组卡片x/y/w/h、垫片/底栏/总滚动高度不得变化。现阶段全部产品验收为NOT TESTED。
