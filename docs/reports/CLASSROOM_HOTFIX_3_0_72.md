# 3.0.72 课堂修复与道具说明窗口

## 已实现

- 道具卡片说明入口改为独立窗口：实际规则、使用技巧、原有趣味说明，以及可重播的小组卡片特效示例。
- 预览复用 BattleMotion 和 BattleCardView；演示小组独立构造、移除事件处理器，不调用道具或计分命令。关闭与页面离开清理预览，遵循减少动态效果设置。
- 玩法页统一图鉴、状态、规则与搜索；修正三处与实际规则不一致的提示。
- 预设头像直接解码内置数据，不再经过被 Electron CSP 拒绝的 fetch(data:)；没有降低 CSP。
- 举手遮罩修复应用缩放坐标，增加明确退出入口与小组头像。
- 移除小组级强力道具后续抽取封锁，保留其他抽取约束；旧字段忽略而不删除用户数据。

## 实际执行证据

- npm run build、npm run check：PASS，自包含 HTML 12158828 字节，253 源码块，版本 3.0.72。
- npm test：438 PASS / 0 FAIL。
- node tests/e2e/gameplay-item-dialog.mjs：Chromium 1920×1080 DPR1，28 种道具预览均产生对应现有动效；真实积分、库存、历史、成就账本前后完全一致；关闭与页面切换清理、无页面脚本错误。
- node tests/e2e/gameplay-page.mjs：PASS，页面导航、图鉴、搜索、状态与规则检查。
- 历史 CSS 治理断言保留：对本次经授权的样式变化增加精确编辑回执，对已退役 item-reference-sub 增加替代组件证据；没有批量重建断言基线。

截图：artifacts/gameplay-item-dialog/green-preview.png、artifacts/gameplay-page/encyclopedia.png。
Google Drive：https://drive.google.com/drive/folders/1cKoo6LaxSO9l9lsg438ll8mV-fqDj84B

## 边界

动画预览展示实际卡片表现层，不执行真实攻击、防御或改分；不能据此声称完成全部道具规则验收。Windows 原生安装包与本批 Electron 生命周期修复仍待单独联调和发行，本报告不将其标记为通过。官方中文头像命名及宝可梦扩充仍排在课堂修复之后。
