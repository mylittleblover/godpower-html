# Global Draw Command Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 完成 GOV-061-03，将全局抽取纳入既有命令的快照、一次持久化、事件和失败回滚边界。

**Architecture:** 复用 CommandLifecycle.run/defer/whenIdle；动画只是待决操作的表现，揭晓时在同一命令中写库存、计数、冷却及 ITEM_ACQUIRED。保存成功后显示获得结果，失败或撤销释放本轮表现资源并恢复运行时抽取会话。

**Tech Stack:** 普通内联 JavaScript、Node test/VM、Chromium Playwright，无新依赖。

**Spec:** docs/audit/POST_CLEANUP_CODE_REVIEW_3.0.61.md / GOV-061-03。

## Global Constraints

- 基线 d97b44dfff2a3c647d3e9f4b34ebbffc31122deb / V3.0.61；不移植旧 main 治理。
- 1500ms 滚动、900ms 揭晓停留、620ms 淡出及奖池/排名/冷却规则保持现状；不处理 GOV-061-07 随机源拆分。
- 不切换存储后端或 schema，不扩充成就规则，只发出真实获得事件。
- 与举手奖励一致：获得奖励要求保存确认，失败整个操作恢复，普通判题的受限存储策略不变。
- 专用工作区，不自动合并、推送、发布或修改真实课堂数据。

## Review Focus

- 动画期间导出/保存不能看到半个命令；只保存一次完整业务结果。
- 存储拒绝、第二组授予失败和过期回调不得留下库存、冷却、历史或成就回执。
- 撤销/导入/新命令不能让旧 owner 释放新 owner 的音效、busy 或节点。
- 同一命令重复点击/重复帧/重复回执不能重复获得或累计。
- 保存异步等待时不提前显示成功，不开放新的课堂写入。

## Task 1: Regression and implementation

- [x] 使用真实 CommandLifecycle/DomainEvents/Ledger 和可控时钟的 VM 测试，复现原流程中提前保存、缺少事件及保存失败未回滚。
- [x] runtime/items/draw-flow.js 中复用正式命令，分离业务授予与提交后表现；举手入口仅增加共享会话互斥。
- [x] 新增并通过存储失败、异常、取消、重复回调、事件幂等和异步确认用例。

## Task 2: Browser acceptance and evidence

- [x] 独立新证据目录执行原4项生命周期及新的故障/事件浏览器场景。
- [x] build/check、Node全套、相关抽取448场景及14组几何；仅重跑本轮需要的相关检查。
- [x] 同版重建dist；更新GOV-061-03状态、限制、下一步，保存专用分支供审查。
