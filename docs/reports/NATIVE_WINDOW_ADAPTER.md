# 独立窗口与全屏音效增补（2026-10-18）

Electron 主窗口仍拥有唯一课堂状态和业务规则。`ui/electron-windows.js` 将实际功能窗口的惰性 HTML/CSS 展示快照交给原生窗口；独立窗没有课堂脚本、Node 或课堂存储权限，只能发回节点令牌对应的有限操作。文本输入有序确认，提交等待确认；口令不进入快照。主页面隐藏展示节点不再占用主页面焦点栈。

`GodpowerPicker` 内部打开保留原业务 DOM 和动画时序；普通入口直接显示原生悬浮图标。原离线 HTML 没有 Preload 时继续使用原弹窗。

音效与音乐设置新增“全屏演出”：全屏点名揭晓、全屏加分展示、全屏扣分展示。支持上传、追加候选、随机播放、试听及恢复默认；仍使用原 IndexedDB 音频格式。未上传时分别回退到既有定格、加分、扣分合成音。抽选滚动停止原有音效与揭晓阶段音效分开，不由展示窗口重放。

真实执行：`npm test` 114 PASS；`npm run test:fullscreen-audio` 三槽位实际 WAV 上传、随机单次播放和刷新恢复 PASS；`node tests/e2e/electron-picker.mjs` 三模式与原规则、取消、过期结果回归 PASS。截图和音频证据位于 `artifacts/fullscreen-audio/`。原生窗口和 14 组验收详见 Electron 仓库 `artifacts/detached-windows/`。

限制：合成/上传音频的数据与播放路由已自动验证，不冒充人工听感验收；真实 Windows 托盘、多屏、鼠标拖动和 PowerPoint 叠加仍需真机验收。完整发行物继续为 `dist/godpower.html`，27 项原始内置资源保留。
