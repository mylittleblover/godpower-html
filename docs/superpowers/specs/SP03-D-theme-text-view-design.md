# SP03-D：主题、文案与页面展示设计

状态：设计待审。关联：[UI贡献](SP03-B-ui-contribution-design.md)、[运行环境](SP03-A-plugin-runtime-design.md)。

## 1. 目标与非目标

开放安全、可逆、版本化的主题token、语言文案和视觉组件注册。核心永远提供默认主题/默认文本/默认页面。保留现有classic与marx风格、启动/切页/弹窗/道具动画和积分语义色。禁止全局任意CSS/HTML注入，禁止主题改业务参数或歪曲安全信息。

当前GodpowerTheme在src/ui/themes.js读取godpower_appearance_v1，名称classic=上帝的力量、marx=马克思的力量；图标/全局class、themes.css以及Electron desktop/theme.cjs为迁移依据。不能只搬红色而丢应用名/托盘/点名/全屏外观。

## 2. ThemeDescriptor与Design Token

```text
ThemeDescriptor {
 id, version, sdkRange, displayName, modes:['light'|'dark'],
 tokens:{ semanticColors, surfaces, typography, spacing, radii, shadows, motion },
 pages:{[hostPageId]:{tokens,viewPresetId?}},
 icons:{[allowedIconKey]:resourceHandle},
 backgrounds:{[allowedArea]:resourceHandle}, textBundleIds:[]
}
ThemeSelection {schemaVersion:1,teacherId,globalThemeId,pageThemeIds,
 personalTokenOverrides,personalTextOverrides,revision}
```

首批token包括color.primary/accent/success/warning/danger、surface.page/card/hover、text.primary/secondary/onPrimary、border.default、font.family/body/title/number/weight、space.1～8、radius.sm/md/lg、shadow.card/dialog、nav.height、dock.height、modal.sm/md/lg、motion.duration.enter/exit/stagger、motion.easing.enter/exit。height/dock/battle密度等布局保护token可读但不允许主题覆盖，不能破坏14组容量。主布局尺寸不因字体family的缺失变化。

值经过类型与范围校验：颜色仅规范颜色值，阴影结构化参数，字号/间距有限数值；URL不是CSS字符串，使用资源句柄；不接受url()、@import、选择器、任意animation-name和脚本SVG。SVG资源移除script、foreignObject、事件/外链，复杂图标可预栅格化。字体只用内嵌/本地用户资源并校验类型，不引入在线字体。

动画描述由宿主可中断预设选择＋受限时长/曲线组成，不接受任意keyframes JS。减少动态/关闭非必要动画优先于主题。积分正绿负红、危险警告、金色发光封神榜等固定语义不被主题反转；允许换背景但必须满足对比度。

公开端口：ThemeService.preview(descriptor,scope)返回可释放previewLease；apply(selection,expectedRevision)返回持久回执；reset(scope,layer)、import/export、history/list均由宿主处理。TextService.format(key,locale,variables)、setPersonalOverrides(scope,map,expectedRevision)、reset(scope)共享保护区校验；ViewRegistry.registerPreset(descriptor,activationToken)仅绑定已开放组件。所有修改检查当前教师scope与CAS revision。

## 3. 优先级与主题管理

解析顺序：核心默认 → 当前全局主题 → 当前页面主题 → 教师个人自定义。每层每范围只有一个主要themeId，后层覆盖允许token而非叠加多个全局样式源。局部插件样式限定在容器/隔离frame，拿不到主DOM选择器。

设置中的主题入口与插件中心主题页共用服务。预览在临时scope展示，不保存；应用校验资源/对比度后保存一次，成功才更新选中。支持页面级混搭、个人文案、导入/导出、默认恢复和版本记录。主题停用先撤销对应层，解析剩余层；保留选择配置便于重新启用，同时明显显示当前有效来源，不把失效theme假显示为应用中。

对比度门槛：普通正文4.5:1、大字3:1、关键控件边界/焦点3:1；状态不可仅靠颜色。主题包未满足则拒绝一键应用并列出token对，预览仍可看问题说明。教师自定义也通过同一校验。字体缩放专项检查不能剪掉对话框确认/取消。

## 4. 文案Key、多语言与保护区

TextRegistry开放稳定key，如app.name、nav.welcome、nav.plugins、home.greeting、card.dailyItem.title、plugin.page.description。元数据包含default(locale)、placeholders及allowedOverride。主题只注册字符串映射，不注册替换函数。

format(key,locale,variables)由宿主完成；locale链为明确语言→同语种→zh-CN→核心fallback。占位符只允许key定义的变量，不支持eval/原型路径/任意HTML。输出textContent或安全文本节点；不同语言长度不能裁掉必要操作。缺key/多变量/错误类型回退核心字符串并记诊断。保留原key不重命名实际命令ID。

安全/权限/删除/存储失败/恢复说明由核心保护命名空间safety.*、permissions.*、dataLoss.*、transaction.*管理，插件完全不能覆盖；普通业务按钮即使可换趣味名称，也显示宿主正式操作副标题（如清零/归档），不能只留下误导性的「领取奖励」。权限提示、数据删除确认和恢复后果不参与主题文案。

个人覆盖与主题覆盖同样受保护区、插值和长度检查。恢复默认移除选定覆盖层记录，不能删除其他教师的文案。语言包随插件停用撤销，原始key与用户覆盖备份保留。

## 5. View Extension Engine

ViewPreset {id,pageId,slots,componentBindings,layoutConstraints,requiredCapabilities}仅引用宿主开放组件/槽。替换组件契约 {inputSchema,actions,emptyState,errorState,accessibilityContract,geometryContract}，比如排行榜视觉可替换，但数据来自核心排序投影；动作仍走原命令。默认实现随时可回退。

开放首页卡片布局、插件工作区、档案摘要等局部视觉；初期比赛groupList结构/卡片外边界/垫片/底栏不开放替换。后续开放前必须有14组同配置几何断言。装饰层不可焦点/不可捕获点击，不读取学生名单。错误或依赖缺失移除该绑定并展示默认组件，不让整页白屏。

插件纯视图只能拿白名单DTO；比分遮蔽等业务投影在主服务过滤，不能因为自定义排行榜漏出真实积分。动画只消费提交事件，不能通过animationend进行计分/抽选/归档。

## 6. 马克思主题迁移

独立包official.marx-theme，types=['theme']，入口theme JSON＋本地资源＋文案，不申请competition.commands.request。保留红/暖白/金、苏联风格图标、应用名马克思的力量、切换特效、页面装饰、点名/加分演出外观；正负分语义色仍绿/红。政治教学为official.marx-politics，互不必需依赖；组合使用是可选推荐。

首次启动从旧appearance键读取classic/marx：classic映射核心默认，marx映射已内嵌安装的主题。旧键保留、先预检后原子写新selection；迁移失败继续旧主题适配而不丢偏好。旧主题适配直到主窗/悬浮/特效/独立窗口全链路对比通过才删除。

Electron现有contracts仅允许classic/marx，不直接放宽任意字符串并映射任意路径。新增ThemeProjectionDTO由主程序输出验证后的token/文案/本地资源ID，主进程只准宿主资源catalog条目更新原生图标；appId、userData、origin不变。HTML和Electron同theme descriptor和资源digest，不能两端手改不同配色。

## 7. 错误、迁移与验收

导入主题schema/资源/尺寸/保护key失败不改变当前有效主题；更新旧版本主题先验证副本再切换。缺资源用默认icon，缺语言用核心文本，主题故障不改变任何比赛state。个人自定义按teacher隔离，切教师清缓存。

未来测试包括恶意CSS/SVG/url、主题停用恢复、四层优先级、受保护文本、占位符/XSS、多个locale、低对比度拒绝、缺字体、减少动态、经典/马克思五页＋插件页＋所有重要窗口截图、切换中断/快速启停、14组尺寸、Electron托盘/悬浮/特效投影。均为NOT TESTED；现阶段只审源码和文档，不宣称完成主题迁移。
