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

GP-010 的公开道具命令异步防御已完成，见 REFACTORING_REPORT；仍需完成 26 道具全交互矩阵 GP-011/017，完整资源备份 GP-015、全部旧 CSS 和事件生命周期治理仍需继续。本测试说明不是最终验收通过声明。


## 遗留治理专项

`npm run test:refactor` 执行 30 个异步防御场景、464 个固定时钟／随机数业务差分、三种桌面尺寸14组前后测量、20/50/100回合观测。业务差分使用旧/新真实 Chromium 解释执行，专门关闭渲染和音效以隔离业务；界面与音频验证由其他套件承担。`npm run verify` 已包含该专项。

`npm run audit:legacy` 更新完整遗留清单和指标。新引入的核心入口有 `canonical-entrypoints` 架构守卫，不得再次追加覆盖层。性能数据是单次观测，不能当作基准排名或长期无泄漏证明。没有运行 CircleCI，也不自动触发 GitHub Actions。
