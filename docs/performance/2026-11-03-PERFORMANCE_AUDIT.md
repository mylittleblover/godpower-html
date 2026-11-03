# 全局卡顿初步性能审计

用户实际版本：Windows Electron 3.0.64。审计源码：HTML bab0792（Electron提交0fbfcd5的BUILD_INFO记录），另测当前a1c9b2e。仅Chromium 1920×1080、DPR1，隔离14组数据，无真实课堂数据。未改产品实现、未关闭产品动画、未跳过保存。Windows实际GPU合成/驱动、原生透明置顶窗和大容量真实存档尚未测试。

## 实测及证据

artifacts/performance-3.0.66保存CPU profile、长任务、原始帧间隔汇总及定点实验。performance-diagnosis.mjs复现刷新、保存、点名、全屏赋分、道具抽取和页面切换；PERF_SOURCE_REF=bab0792测3.0.64源码，PERF_PROFILE=0禁用采样器。including100msWait明确包含100ms让出时间，不能当作业务耗时，使用synchronousMs。各场景顺序执行，部分整轮不同浏览器进程在同一共享主机短暂重叠，不能据此比较两个版本谁更快；这是诊断采样，不是发布性能基准。

3.0.64源码、不启用CPU采样器的一轮观测：

|路径|同步耗时范围/帧间隔|解释|
|---|---|---|
|全量renderAll|52.6–108.3ms，5次|可造成主线程长任务|
|renderGrid|7.8–37.9ms，5次|网格单独已可能超16.7ms预算|
|saveState|0.4–1ms，5次|小数据保存不是本次首要瓶颈；不能外推大型档案|
|点名窗口开关|6–93.1ms，5次|冷态开窗及布局成本显著|
|设置/比赛来回切换|61.9–65.4ms，3次|同步切页阻塞|
|比赛空闲|帧间隔P95约50.1ms|仍有后台/渲染开销|
|点名滚动|P95约66.7ms|存在掉帧|
|全屏加分展示|P50约116.6ms、P95约266.6ms|此环境明确复现严重卡顿|
|全局道具抽取|P95约16.8ms、最长133.4ms|大部分平稳，但存在阶段性阻塞|

帧统计为2秒窗口的requestAnimationFrame间隔，不是Windows显示器实际FPS，也不是INP。样本用于定位，非长期泄漏、所有道具及所有特效完整验收。

## 发现与优先级

### PERF-067-01：空闲点名状态产生随机变化（P1，已复现）

core/picker-bridge.js:getSnapshot每次调用randomEffectStyle；ui/electron-host.js每120ms publish，JSON比较本应阻止不变消息，但随机style破坏去重。desktop/windows.cjs收到更新后broadcast给浮窗并发gp:shell给主窗，造成不必要通信及界面工作。

3.0.64同一状态连续读取100次：10种样式、去掉style后只有1种状态，相邻完整payload变化93次。证明是快照读取副作用，不是业务变化。建议将随机样式绑定到唯一揭晓事件/结果，保持同次结果稳定，不改抽选随机算法；回归空闲无重复广播、同次揭晓样式一致、新揭晓仍可随机。

### PERF-067-02：全屏合成与模糊（P1，症状确认，Windows根因待验证）

styles/feedback/classroom-effects.css全屏backdrop-filter:blur(7px)，Electron renderer/effect.css另有全屏blur、阴影、粒子与filter动画。定点no-backdrop实验只在隔离测试注入CSS：两轮基线P50约433/117ms，去背景模糊约100/50ms，但存在明显预热与共享环境噪声，不能宣称确定倍数提升，也不能直接删除全部模糊作为正式修复。需分离透明窗口、背景取样和粒子绘制成本，保留入场/高潮/退场设计，对Windows硬件加速和GPU状态采样。

### PERF-067-03：隐藏页面重复刷新与强制布局（P1，调用链确认、成本已采样）

ui/render.js:refreshPages每次刷新全部网格、图表、Dashboard与欢迎页；ui/navigation-and-clock.js每秒更新时钟也调用DesktopUI.renderWelcome。欢迎页即使隐藏仍走syncViewport/布局读取；welcome-dashboard.js同一render分别调用syncRepeats和syncCruise，后者再次syncRepeats，读取offset尺寸、序列化卡片outerHTML并处理副本。CPU栈出现syncViewport、syncRepeats及布局读取。

建议把业务视觉状态跟踪与欢迎页DOM更新拆开，隐藏时只标脏，进入时刷新。不得简单early-return整个renderWelcome，否则可能丢失道具视觉事件；不得略过存储或业务命令。

### PERF-067-04：全局弹窗观察器反复扫描（P1，源码及CPU栈确认，修复收益未量化）

ui/desktop.js:setupModals对body整棵子树的class/style/childList变化调用scan；scan遍历全部窗口、查找按钮，programConfirmV28还读getClientRects。点名50/70ms修改DOM、特效和网格改样式都会触发。CPU采样可见scan/getClientRects。建议按mutation归属只检查受影响窗口，避免同一批写后立即全局读布局；必须覆盖嵌套、动态替换、关闭、Escape与焦点。

### PERF-067-05：转轮同时运行DOM更新和视觉转带（P2，存在并行工作，瓶颈占比待测）

selection-engine.js每50/70ms重建名字/头像；ClassroomFeedback.startLive同时运行转带动画。需验证是否存在实际不可见但仍重建的内容，按当前模式收敛；不能修改最终随机结果或把动画当随机算法。

### PERF-067-06：Electron后台资源与大数据（P2，待测）

preferencesFor全部角色backgroundThrottling:false；主窗最小化后继续业务是必要功能，但不可见页面装饰/时钟无需同等活跃。头像、历史、音频大资源、IndexedDB与localStorage大档案、长时间运行内存增长均需单独采样，不能凭小数据保存快认定无风险。

## 下一步

先修复01（确定性快照与IPC去重），再处理03/04公共路径，然后02全屏合成，最后05/06。每项单独量化、回归并提交；不叠加猜测优化。未进行Windows真机测试，未宣称软件已修复；本轮仅完成诊断工具、证据与任务排序。Electron工作区已有未提交同步修改，未覆盖或打包这些内容。
