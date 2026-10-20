# V3 UI 依赖与迁移映射

状态：设计材料，非已实现API。插件贡献统一用现有SP03-B的ContributionRegistry.register(batch, activationToken) / dispose(activationId)，本设计不创造第二注册表。

## 当前边界

index.template.html + manifest.json
→ nav/view roots与inline handlers
→ DesktopUI（设置、导航、题库、偏好、弹窗）、WelcomeV2（首页投影/横滚/启动动画）、renderAll → refreshPages → renderGrid → BattleGrid
→ state / rankings / ITEM_DEFS / commands
→ FLIP / score hold / delayed attack gates。

GodpowerTheme拥有classic/marx展示；Electron host经受限preload/IPC管理点名、效果和独立窗口。

## 迁移映射

| 现有责任/文件 | 目标职责 | 迁移与保留条件 |
|---|---|---|
| index.template.html、manifest | UI Shell + 静态fallback | 保留默认页和单文件构建；先挂metadata再逐页mount/unmount；不把主DOM交给插件 |
| ui/render.js | UI Invalidation facade | 唯一刷新owner；增加scope订阅/批处理；renderAll兼容直到逐页等价 |
| ui/model.js | Core Presenter | 只产安全DTO，不写比赛状态 |
| ui/desktop.js | Shell navigation/settings/dashboard adapters | 按职责拆；DesktopUI门面先兼容；保存时机、题库schema不变 |
| ui/welcome-v2.js | Dashboard projector/widgets/motion lifecycle | 拆数据、横滚、intro焦点与动画；显式dispose timers/listeners；保留跳过/重进/reduced motion |
| ui/battle-grid.js | Battle View Adapter | 只读DTO→事件委托→局部patch；初期不改结构、14组几何和控件；保留原renderer回退 |
| ui/battle-motion.js/feedback | Motion Presenter | 只消费提交事件；保留session/取消/减少动态；动画不决定业务结果 |
| ui/themes.js/css | ThemeService adapter | classic/marx映射统一ThemeDescriptor；保留godpower_appearance_v1兼容读、主品牌及Electron图标白名单 |
| style/00..23.css、ui/*.css | tokens/components/pages | 先生成selector ownership及页面截图；逐批迁移，不按编号或规则数删除 |
| ui/electron-host.js / electron-windows.js | 现有宿主桥适配 | 仍为唯一桥；不增加通用IPC |
| Electron protocol/windows/contracts/preload | 未来隔离UI host | 独立安全评审；主窗frame-src和IPC权限不放宽 |

## 唯一ContributionRegistry的UI契约

UI贡献以数据描述符注册，不允许插件提交mount(host,ctx)函数在主realm执行。沿用SP03-A/B的宿主绑定pluginId、localId、kind、scope、requiredPermissions、descriptor；kind为navigation/page/panel/card/settings/commandShortcut/viewPreset/decoration。Renderer是宿主内置key＋schema，或隔离workspace route。

卡片数据来自宿主白名单selector/授权service；动作是白名单command ID和schema参数。Theme/Text/View描述符通过同一ContributionRegistry注册，再由ThemeService/TextService/ViewRegistry解释。UI invalidation属于宿主内部服务，不公开全局renderAll或DOM；订阅只给授权DTO。冲突使整个批次拒绝；dispose清理监听、动画、焦点、音频租约。

## CSS、DOM和事件依赖治理

selector ownership报告记录selector、properties、源文件、manifest顺序、页面/组件归属、media条件与匹配节点；相同文本selector不代表同一cascade条件。以CSSOM computed style与截图验证，不因157个候选直接删除。

227个静态ID均唯一。页面root声明owner，动态DOM也需运行时检查唯一性。组件事件由root委托并配对dispose；现有102个inline入口逐域迁出，在对应命令保留兼容前不得删。

## 回退

每小批保留legacy → facade → new renderer路由。记录source/target commit、数据摘要、截图和14组几何。失败只回退本批；不清空存档。布局/主题/题库迁移使用版本化副本与revision校验。
