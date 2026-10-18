# 3.0.1 马克思主题与全局控件验收

起点HTML8821c8e、Electron c06e113；分支feat/marx-theme。仅Chromium1920×1080、DPR1、应用100%。未执行CircleCI。

## 实施

- 外观设置新增经典/马克思主题。后者应用名“马克思的力量”，朱红、暖白、金色红星麦穗徽记与13类功能SVG；五页面、共用功能窗口、Electron点名/特效/工具窗口同步。
- 独立外观schema1，旧用户默认经典，不改课堂业务存档、规则或组色；存储失败本次有效并提示。
- 960ms切换演出：旗帜光带、星徽入场与淡出；可跳过、Escape、快速重入或切页清理，简洁/关闭/系统减少动态效果直接切换。
- 所有主题底栏封神榜统一金色渐变柔光；移除原style02/15及JS内联冲突。
- 到此为止深珊瑚/深红底白字：5.48:1、7.65:1。主题白字/主红7.22:1、说明文字/面板6.62:1、金色按钮文字6.42:1。以上为指定色对计算，不代表全项目无障碍认证。
- 八类设置裸复选框与既有v292开关统一52×28轨道，点名防重复同步；保留事件、ID、键盘和即时保存。其他选择型checkbox不改动。
- 所有title悬停提示共享3000ms生命周期，移开/点击/Escape提前关闭；动态文字、子节点移动不重置倒计时，保留ARIA。
- 版本单一源package.json：顶栏、document.title、运行时、课堂备份、Electron包统一3.0.1。

## 实际验证

|项目|状态|证据|
|---|---|---|
|单元/集成|PASS131|artifacts/marx-theme/logs/unit.log|
|五页面主题、恢复、存储失败、跳过、减少动效、重入、无业务状态变化|PASS|results.json、logs/theme.log|
|14组同视口同数据经典/红色精确DOM几何|PASS|results.json baseline/marx|
|与8821c8e源码14组布局对照|PASS|layout/battle-14-comparison.json|
|两主题五页面、八类设置、金色默认/悬停、开关键盘/保存恢复|PASS|control-inventory.json|
|提示3000ms/动态/键盘/安全文本/边界|PASS|tooltip-results.json；浏览器虚拟时钟|
|26种道具基础行为|PASS26|rule-oracles.json、logs/items.log|
|抽取兼容|PASS448种子场景|logs/items.log|
|原始资源与语法/版本|PASS27资源、67脚本、98源块|npm run check|
|Windows真机/跨应用/多屏/UAC|NOT TESTED|当前Linux环境|
|file直接浏览器运行|BLOCKED|既有环境ERR_BLOCKED_BY_ADMINISTRATOR策略，不修改策略|

截图在artifacts/marx-theme：五页面、百科、点名、设置开关、切换演出、14组前后及提示。逐图检查了设置、首页、比赛和百科的真实渲染；其余截图只证明捕获对应状态，并配合DOM溢出检查，不宣称全部旧功能均已人工验收。

## 复核修正

|Before|After|Why|
|---|---|---|
|绿色语义色随品牌色映射为红|成功与正分保持原绿色|避免答对/错误含义混淆|
|root别名无法读取body主题变量|别名同时在body计算|窗口侧栏、文字与阴影同步换肤|
|跳过按钮随全屏位移|按钮固定，徽记和光带独立运动|动画中可以实际点击|
|title唯一命名图标被临时置空|临时保留ARIA名称并恢复|避免键盘/读屏名称丢失|

## 复现命令

`npm run build && npm run check && npm test && npm run test:theme`。

用户实际14组视口/缩放配置未读取；本报告只声明合成1920×1080、double、zoom1、垫片120px的成功基线。主题不改变exe文件固有图标；运行窗口/托盘可切换图标。外观偏好尚未随课堂备份导出，迁移设备需重新选择。Electron原生验收、最终Windows包和Drive结果见Electron仓库本轮报告。
