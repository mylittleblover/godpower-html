# V2.19 首页智能仪表盘与入场动效

## 实现范围

- 将欢迎页重排为品牌 Hero、统计卡、默认展开的全组实时排名、最近历史操作、紧凑小组自动巡航和底部四个每日内容区。
- 五个顶部标签仍然调用 `switchView('welcome'|'battle'|'history'|'archives'|'settings')`，是五个相互独立的功能视图，不是欢迎页面内的锚点。
- 从上传的 `src/ui/brand.svg` 原样渲染品牌标志；启动时自动弹出滑动解锁入口，不再打开旧的欢迎弹窗。
- 解锁时使用同一个 SVG 元素做等比 FLIP 位移，动画结束后将该 SVG 移入顶栏，SVG 自己的 clipPath 保持圆角几何稳定。滑块支持鼠标/触屏、键盘、未达阈值平滑回弹。
- 原有业务状态、成绩与道具遮蔽规则继续由 legacy 脚本负责；新视图层只读其状态。手动查看组详情、每日题库、历史档案等原功能入口保留。
- 比赛页 `groupList`、垫片、14 组布局、回答工具栏均不修改。

## 本地构建与验收

```bash
npm ci
npm run build
npm run check
npm run test:welcome
npm run test:ui
```

检查完成后使用 `dist/index.html`（托管）或 `dist/godpower.html`（离线）启动。两份文件应由同一条构建命令生成。

## 原分支交付限制（674e12f历史记录）

以下描述为原分支当时状态。当前补齐工作与真实验收结果以 [WELCOME_V2_COMPLETION.md](WELCOME_V2_COMPLETION.md) 为准。

GitHub 连接对约 7.6 MB 的单文件内容写入发生 HTTP/2 请求体错误，因此本分支暂只提交了可重建的 `src/**` 源码、资源文件、manifest 与 UI 浏览器验收脚本。**仓库里的旧 `dist/index.html` 和 `dist/godpower.html` 还没有重新生成**，直接下载这两份旧文件不会看到此次改版。必须在本地执行 `npm run build` 后再用新产物验收与分发。

尚未执行完整 Chromium 端到端验收或原有 14 组比赛布局差异截图回归，不能把代码静态核查视为这些验证已通过。请在合并前运行上面的命令及现有比赛页面验收。
