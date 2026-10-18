> 最新桌面 UI 交付：见 `docs/reports/DESKTOP_UI_ACCEPTANCE.md`、`docs/ui/DESIGN_SYSTEM.md` 和 `artifacts/desktop-ui/acceptance-matrix.json`。以下原始审查结论保留为历史记录。

# Chromium UI 验收

用户最终指定仅Chromium。主E2E使用真实渲染，五页×六尺寸共30张，另有6主要窗口及键盘、百科、特殊状态截图。截图“捕获成功”不等于全部视觉语义已验收。

| 页面 | 尺寸 | 截图捕获 | 文档横向溢出 | 文件 |
|---|---|---|---|---|
| welcome | 1920×1080 | PASS | 无 | artifacts/screenshots/chromium/welcome-1920x1080.png |
| battle | 1920×1080 | PASS | 无 | artifacts/screenshots/chromium/battle-1920x1080.png |
| history | 1920×1080 | PASS | 无 | artifacts/screenshots/chromium/history-1920x1080.png |
| archives | 1920×1080 | PASS | 无 | artifacts/screenshots/chromium/archives-1920x1080.png |
| settings | 1920×1080 | PASS | 无 | artifacts/screenshots/chromium/settings-1920x1080.png |
| welcome | 1366×768 | PASS | 无 | artifacts/screenshots/chromium/welcome-1366x768.png |
| battle | 1366×768 | PASS | 无 | artifacts/screenshots/chromium/battle-1366x768.png |
| history | 1366×768 | PASS | 无 | artifacts/screenshots/chromium/history-1366x768.png |
| archives | 1366×768 | PASS | 无 | artifacts/screenshots/chromium/archives-1366x768.png |
| settings | 1366×768 | PASS | 无 | artifacts/screenshots/chromium/settings-1366x768.png |
| welcome | 768×1024 | PASS | 无 | artifacts/screenshots/chromium/welcome-768x1024.png |
| battle | 768×1024 | PASS | 无 | artifacts/screenshots/chromium/battle-768x1024.png |
| history | 768×1024 | PASS | 无 | artifacts/screenshots/chromium/history-768x1024.png |
| archives | 768×1024 | PASS | 无 | artifacts/screenshots/chromium/archives-768x1024.png |
| settings | 768×1024 | PASS | 无 | artifacts/screenshots/chromium/settings-768x1024.png |
| welcome | 1024×768 | PASS | 无 | artifacts/screenshots/chromium/welcome-1024x768.png |
| battle | 1024×768 | PASS | 无 | artifacts/screenshots/chromium/battle-1024x768.png |
| history | 1024×768 | PASS | 无 | artifacts/screenshots/chromium/history-1024x768.png |
| archives | 1024×768 | PASS | 无 | artifacts/screenshots/chromium/archives-1024x768.png |
| settings | 1024×768 | PASS | 无 | artifacts/screenshots/chromium/settings-1024x768.png |
| welcome | 390×844 | PASS | 无 | artifacts/screenshots/chromium/welcome-390x844.png |
| battle | 390×844 | PASS | 无 | artifacts/screenshots/chromium/battle-390x844.png |
| history | 390×844 | PASS | 无 | artifacts/screenshots/chromium/history-390x844.png |
| archives | 390×844 | PASS | 无 | artifacts/screenshots/chromium/archives-390x844.png |
| settings | 390×844 | PASS | 无 | artifacts/screenshots/chromium/settings-390x844.png |
| welcome | 844×390 | PASS | 无 | artifacts/screenshots/chromium/welcome-844x390.png |
| battle | 844×390 | PASS | 无 | artifacts/screenshots/chromium/battle-844x390.png |
| history | 844×390 | PASS | 无 | artifacts/screenshots/chromium/history-844x390.png |
| archives | 844×390 | PASS | 无 | artifacts/screenshots/chromium/archives-844x390.png |
| settings | 844×390 | PASS | 无 | artifacts/screenshots/chromium/settings-844x390.png |
| picker | 1920×1080 | PASS | 无 | artifacts/screenshots/chromium/modal-picker.png |
| hand | 1920×1080 | PASS | 无 | artifacts/screenshots/chromium/modal-hand.png |
| about | 1920×1080 | PASS | 无 | artifacts/screenshots/chromium/modal-about.png |
| member-search | 1920×1080 | PASS | 无 | artifacts/screenshots/chromium/modal-member-search.png |
| item-window | 1920×1080 | PASS | 无 | artifacts/screenshots/chromium/modal-item-window.png |
| settlement-name | 1920×1080 | PASS | 无 | artifacts/screenshots/chromium/modal-settlement-name.png |

## 已修复并重新截图

1. 390竖屏下核心操作藏在底栏水平区域；底栏改为换行，并按实际高度预留页面空间。短横屏工具栏可纵向滚动，仍需真实触摸验收。
2. 说明同步器全页面猜测文本节点，实际把5个批量按钮替换为冰之花说明。限制至库存卡，回归断言保持五个按钮。见历史special-states截图及最终chromium/special-states.png。
3. 768/1024宽度下顶部三列挤压统计文字，改为统计独立一行并断言高度不超过80px。
4. 版本标签从原来的v3统一为V2.18.15；焦点轮廓可见。键盘focus/hover已实际操作。

## 实际人工图像复核边界

已直接查看欢迎页、桌面比赛特殊状态、390竖屏比赛及组详情弹窗；六尺寸五页联图可供逐页复核。桌面8位积分在最终special-states.png完整显示，All In、星光、冰冻同屏可见。组详情有独立滚动主体和关闭控件。

其余截图保留，不能据此声称每一按钮、每一状态、所有嵌套和可访问性均通过。尚缺冻结结束、受击中途、抽取滚动、最终表彰所有时刻的稳定视觉断言，以及小屏全部窗口和读屏人工检查。

## 原版与修改版视觉对照

reference-baseline/ 与 reference-fixed/ 保存相同四组数据、相同1920×1080的五页参考图。参考捕获禁用动画并隐藏时钟，单独的真实交互截图仍保留动画。没有覆盖原图来“通过”。像素差异是记录指标，尚未作为自动门禁；下表差异需要按分类审阅。

| 页面 | 变化像素比例 | 分类 |
|---|---|---|
| welcome | 0.012539% | 预期版本标签变化；仍需人工逐像素确认，非自动PASS |
| battle | 0.013358% | 预期版本标签变化；仍需人工逐像素确认，非自动PASS |
| history | 0.013358% | 预期版本标签变化；仍需人工逐像素确认，非自动PASS |
| archives | 0.013358% | 预期版本标签变化；仍需人工逐像素确认，非自动PASS |
| settings | 0.013358% | 预期版本标签变化；仍需人工逐像素确认，非自动PASS |

字体／环境：Linux Chromium系统字体，非课堂实际投影字体；跨设备字体差异未测试。缩放、hover所有控件、全部disabled控件、对比度计算和焦点陷阱未穷举，见GP-018。


## 最新欢迎分支验收（674e12f 起点）

最新实际结果见 `docs/reports/WELCOME_V2_COMPLETION.md` 和 `artifacts/welcome-completion/acceptance-matrix.json`。旧版报告保留为历史证据，不能用其中的旧dist状态和旧测试数量代替本轮结果。


## 设置页清查与新UI补齐（e97933d 起点）

当前设置页清单、布局、动效、真实音频往返与验收范围见 docs/reports/SETTINGS_CLEANUP_ACCEPTANCE.md、docs/audit/SETTINGS_INVENTORY.md。最终同产物43个UI场景与阶段性157核心／31桌面场景分开记录，未将阶段测试合并为全量最终verify。

## 2026-10-18 全局功能界面与动效

顶底栏、比赛卡片表面、历史/档案、SVG老虎机、展开动画、真实未作答警告及管理口令流程见 [本轮正式报告](../reports/APPLICATION_SURFACES_ACCEPTANCE.md) 与 [验收矩阵](APPLICATION_SURFACES_TEST_MATRIX.md)。本轮证据独立保存在 artifacts/visual-unification，历史发布证据保留。包含动画进行中窗口越界、待启动帧竞态和口令错误提示的实际修复，不能仅用截图张数判断通过。
