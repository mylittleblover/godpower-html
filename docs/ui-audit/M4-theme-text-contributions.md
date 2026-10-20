# M4：受控主题 Token 与文案贡献

日期：2026-10-20。目标版本：3.0.28。基线：HTML 3.0.27 / `8ceef67`。

本阶段将插件主题与文案能力接入现有宿主贡献注册表。插件代码仍不执行。主题不是自由 CSS：只接收固定的颜色 Token 和 `#RRGGBB`，不开放布局、字号、动画或正负分/危险状态等语义变量。文案只允许宿主明确选择的文本Key并使用 `textContent`，拒绝HTML、危险命名空间及未知Key。主题和文案仅从已启用插件贡献中应用，停用后恢复；偏好写入独立外观键，不触碰课堂状态。

涉及：`src/ui/contribution-registry.js`、`src/application/plugin-platform.js`、`src/ui/plugin-appearance.js`、`src/ui/plugin-center.js`、`src/index.template.html`。比赛业务规则与14组布局未改。

## 验证

| 场景                                       | 结果                              |
| ------------------------------------------ | --------------------------------- |
| 主题/文案贡献安全边界单测                  | PASS；全量单元/集成 269/269       |
| Chromium 注册表协议                        | PASS（1920×1080、1x；六个core route；0 pageerror） |
| Chromium 插件安装、应用主题/文案、停用恢复 | PASS（1920×1080、1x；0 pageerror） |
| Chromium六页基线/14组布局/离线结算冒烟     | PASS；14组完整位于底栏上方；离线冒烟4/4 |
| 现有Marx主题回归                           | PASS；品牌/存储/五页/图标/14组几何/动画/减少动态/快速中断/无课堂数据变化 |
| 构建与源码检查                             | PASS；3.0.28，132 source blocks、100 script blocks、27资源；8,035,721 bytes；SHA-256 `806680e2824aa6fb45b1d405c6103d358e5b1d038c74169685c828fc1613b0e5` |
| Electron主题同步与Windows原生              | NOT TESTED；待本阶段HTML提交后同步 |
| CircleCI                                    | NOT RUN（遵循用户要求） |

## 未完成边界

目前只覆盖有限的全局颜色Token与显式文本Key，不是完整SP03-D。尚未实现作用域层叠、主题预览/对比度验算、图标资源句柄、主题包导入导出/版本、占位符格式化、多语言回退、页面级主题和品牌/原生Electron联动。马克思主题仍由现有 `GodpowerTheme` 负责，本阶段不迁移或删除它。
