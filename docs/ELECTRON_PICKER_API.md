# 单一课堂点名接口

`src/core/picker-bridge.js` 提供 `window.GodpowerPicker`。抽选 RNG、奖池、防重复、计分、历史和音频仍由 `script/00.js` 的原引擎负责。辅助窗口不得自行调用随机函数或复制课堂存储。

- `command(action,payload)`：start / stop / cancel / mode / antiRepeat / preselect / resetPool / score。
- score 必须传当前 `resultId` 和非零安全整数 `delta`，并且处于 revealed、主课堂已解锁、目标仍存在。失败无自动重试。
- `getSnapshot()` / `subscribe(fn)`：只读可序列化 DTO；滚动中不会泄露预先确定的结果。settling 阶段允许显示最终落点，但不允许赋分；revealed 后才能赋分。
- `notify(phase)`：原函数中的显式生命周期事件，不通过覆盖旧全局函数接入。
- `setExternalPresentation(bool)`：仅决定原全屏视觉是否交由 Electron，音效仍在主课堂播放。

停止时移除旧 `_v2StopSlot` 包装链，原历史内容及容量保持不变；重复停止不再多记历史。cancel 清理动画与音频滚动，不写点名历史，不占用防重复奖池。主页面关闭点名窗口沿用原 stop 语义，但取消待播放演出。独立悬浮窗关闭不会调用此关闭函数。

`src/ui/electron-host.js` 只负责预加载传输，网页离线使用时不激活。导入/撤销/删除组后重新解析目标；不会向辅助窗发送口令、音频 Base64、完整历史快照或存档。

验证：`node tests/e2e/electron-picker.mjs`（HTTP Chromium，1920×1080 1x）。命令行浏览器的 file URL 被当前环境管理员策略阻止，单文件 Electron 自定义协议另行测试。
