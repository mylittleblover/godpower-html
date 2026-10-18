# 全局界面验收矩阵

Node：90 PASS。Chromium：226 PASS。细分结果与截图见各JSON。

| 功能/场景 | 类型 | 数量 | 状态 | 证据 |
|---|---|---:|---|---|
| 五页分层/导航/历史/档案/窗口内容 | Chromium 实际执行 | 31 | PASS | `artifacts/visual-unification/captured/artifacts/desktop-ui/results.json` |
| 交互、焦点、道具UI与异步取消 | Chromium 实际执行 | 21 | PASS | `artifacts/visual-unification/captured/artifacts/desktop-ui/interactions.json` |
| 11窗口 × 3尺寸 × 3档应用缩放 | Chromium 实际执行 | 99 | PASS | `artifacts/visual-unification/captured/artifacts/desktop-ui/modal-matrix.json` |
| 新增表面、实际动画与页面场景 | Chromium 实际执行 | 25 | PASS | `artifacts/visual-unification/acceptance/results.json` |
| 档案搜索/筛选/留白与进入比赛 | Chromium 实际执行 | 9 | PASS | `artifacts/visual-unification/acceptance/archive-controls.json` |
| 页面/飞入/展开/拉杆/真实结果与学号 | Chromium 实际执行 | 18 | PASS | `artifacts/visual-unification/motion/results.json` |
| 真实未作答警告及取消/继续/替换 | Chromium 实际执行 | 13 | PASS | `artifacts/visual-unification/warnings/results.json` |
| 实际口令、错误层级、回车与取消 | Chromium 实际执行 | 3 | PASS | `artifacts/visual-unification/admin/results.json` |
| 离线断网、正常计分、导出与控制台 | Chromium 实际执行 | 4 | PASS | `artifacts/visual-unification/captured/artifacts/desktop-ui/release-smoke.json` |
| 14组合成布局前后精确对比 | Chromium 实际执行 | 3 | PASS | `artifacts/visual-unification/acceptance/layout/battle-14-comparison.json` |

BLOCKED：file:// 初次打开；NOT TESTED：浏览器工具栏原生缩放、教师真实14组配置、听感与长时间性能；不计入PASS。
