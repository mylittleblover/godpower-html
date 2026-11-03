# 存档与头像优先实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** v2多存档、全局设置独立、真实名单与头像管理，并无损迁移用户提供的两份课堂档案。
**Architecture:** domain定义/预检；infrastructure事务化IndexedDB资源与文档仓库；application拥有切档、ACK和旧比赛投影；ui负责设置名单/成员选择/头像。Electron仅提供受控磁盘事务接口，保留FIFO及安全边界。
**Tech Stack:** 原生JS、IndexedDB、Node Test、Playwright Chromium1920×1080/DPR1、现有CSS/WAAPI、离线单HTML/Electron。
**Spec:** ../specs/2026-11-03-godpower-3-0-68-next-design.md；最新用户指令优先，执行台账记录追加与取舍。

## Global Constraints

不恢复插件、不改既有比赛规则直到对应规则阶段；保留28道具、60成就ID、14组几何、异步防御与音频。只改源码owner，不直接改发行HTML、不叠全局包装器/CSS补丁、不操作CircleCI。真实文件只读、不入Git、不用模拟数据覆盖原文。主存档未确认可靠提交不得清零/切档。

## Review Focus

1. 旧回调A不得在切到B后提交。
2. 资源保存失败不可留下已切换的新索引或悬空头像引用。
3. 同名学生、40份历史和旧头像数据必须保持身份、分数、余次及撤销。
4. AppPreferences不能随存档导入/切换被重置。
5. 实际合法但超大JSON不能当作截断强行“修复”，迁移需计数/哈希与回环验证。

## S01 格式/迁移

Create domain/save-document.js、application/save-migration.js；tests/unit/save-document.test.mjs、legacy-save-conversion.test.mjs。接口SaveSchema.validateV2、SaveMigration.preview/convert；区分旧schema2和kind=godpower.save的v2。稳定UID与资源ID；旧多profiles/classrooms每有效assignment转换一档，重复导入幂等，同名身份不合并，保留未知字段/原始来源。

- [ ] 红灯：格式、引用、旧数据、冲突与资源去重。
- [ ] 实现纯模型/迁移，验证无输入修改、历史/库存/成就回环。
- [ ] 独立提交并记台账。

## S02 仓库/控制器

Create infrastructure/save-repository.js、app-preferences-repository.js；application/save-manager.js。SaveRepository.list/load/commit(expectedRevision)/switchActive；staging文档、资源、回执及索引在同一事务，ACK后切换。控制器等待命令/写入并取消旧演出，保存状态明确；旧课堂引擎通过适配投影保持业务行为。

- [ ] 红灯：配额、事务回滚、修订冲突、重启、多档隔离、全局设置及过期回调。
- [ ] 接入旧保存/导入导出与Electron受控磁盘，保留原始来源和兼容入口。
- [ ] 关联业务回归后提交。

## S03 名单/头像

Create ui/save-workspace.js、ui/group-member-picker.js、styles/settings/save-workspace.css；修改desktop挂载、group-window、classroom-avatar-display及原生effect DTO。设置展示存档状态、学生表/小组表、搜索、快速新增/分组/头像上传与批量匹配预览；组菜单仅可视化选择学生。

- [ ] 红灯：打开即见当前56人/14组，同名/学号/未分组，组菜单无textarea，头像损坏/移除/跨档/重新加载。
- [ ] 验证图片签名、尺寸，独立资源引用与URL生命周期；小组及各点名/道具全屏展示有界图片，无头像降级。
- [ ] 真实浏览器截图与14组尺寸回归后提交。

## S04 真实档案与后续

- [ ] 对原档只读运行迁移工具，分别保存新档及来源回执，不擅自混并两个不同时间快照。
- [ ] 验证14组、56名成员、积分/道具/40历史/成就/头像数量及新→旧投影一致；将新文件交付用户私有Drive目录。
- [ ] 更新DATA_SCHEMA、架构、维护任务与结果，继续主实施计划M3～M7，不等待“继续”。
