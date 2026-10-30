# V3.0.57 Electron内部弹窗适配

移除普通功能弹窗的DOM克隆、定时发布、远程事件回放与隐藏原控件逻辑。Electron主窗口直接使用与网页版相同的原始弹窗和输入控件；只有点名入口保留外部窗口适配。

点名入口通过显式按钮事件与局部可见性观察打开悬浮窗，重复点击不依赖隐藏旧弹窗再次出现，避免悬浮图标收起后主界面无法重新展开。

本仓库已执行 npm test 312/312；npm run check通过；tests/e2e/internal-electron-dialogs.mjs在Chromium 1920×1080 1x的模拟窄preload环境验证原始密码输入框逐字输入保持节点/焦点、无弹窗克隆发布、设置导航及外部点名入口。真实Electron运行和Windows屏幕键盘由Electron仓库另记，不将此浏览器模拟视为Windows系统键盘验证。

新版SHA与来源提交由Electron同步脚本记录。此变更不修改业务数据、计分或抽选算法。
