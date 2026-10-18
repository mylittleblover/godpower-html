# 遗留治理：明确渲染所有者

目标：全面索引当前代码的旧定义、捕获链、CSS、定时器、监听器与模块职责，并将已证明等价的渲染链整理为单一入口。

基线：origin/refactor/20261018-repository-hygiene@9e1be3c。隔离工作区 /workspace/godpower-structure，分支 refactor/render-ownership。

采用显式编排，避免把旧包装器改名后继续套娃。ui/battle-grid.js 只构建卡片及装饰；ui/render.js 只负责页面刷新、攻击340ms门、切题810ms门和分数显示保持。规则继续由 core 与尚未迁移的 legacyUseItem 实现，视觉继续由 BattleMotion、DesktopUI、ClassroomFeedback 实现。

保留26道具、排名计分、All In、历史、保存、音乐、14组布局、原有CSS及资源。删除确认只含注释的脚本，删除被01.js无条件取代的旧卡片实现和相同排序条件的重复包装。延迟路径必须与当前链的有效调用顺序相同，特别是810ms回调不再次进入外层分数包装。

测试：新增单一入口架构守卫与虚拟时钟编排测试，真实Chromium覆盖原有业务、异步防御、26道具、动画及三档14组几何比较。file协议和人工听感如无法执行明确记录。禁止CircleCI。历史验收证据不覆盖。

执行方式：遵循用户此前明确授权自主连续推进，计划和设计记录供审查，不增加逐步审批。
