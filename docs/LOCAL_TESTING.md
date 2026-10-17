# 在本地验证 HTML V2.19 重构分支

GitHub Actions 额度耗尽期间，工作流保留 `workflow_dispatch` 但不自动触发。不要以远端红色运行状态替代本地测试结果。

## Windows / macOS / Linux

需要 Node.js 24、npm、Playwright 自带的 Chromium。进入仓库根目录后依次运行：

```sh
npm ci
npx playwright install chromium
npm run verify
```

Windows PowerShell、macOS Terminal、Linux Shell 均可执行上面的命令。Linux 若已有 `/usr/bin/chromium`，脚本优先使用该路径；需要选择其他 Chromium 时设置 `CHROMIUM_PATH`。Windows 未设置此环境变量时自动使用 Playwright 安装的浏览器。

运行完检查 `artifacts/browser-results.json`、`artifacts/desktop-ui/` 和 `artifacts/screenshots/`，从 `dist/godpower.html` 获取重构后的单文件版本。

## 手机测试

手机只用于实际体验和本地文件兼容性验证；不能替代完整的 26 道具自动回归。首次请使用模拟数据；保存真实档案之前导出原始课堂备份。

## 尚未完成

道具完整异步事务化 GP-010，26 道具全交互矩阵 GP-011/017，完整资源备份 GP-015、全部旧 CSS 和事件生命周期治理仍需继续。本测试说明不是最终验收通过声明。
