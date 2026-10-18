# Render Ownership Implementation Plan

> Use superpowers:executing-plans inline, test-first and incremental commits.

**Goal:** 全项目索引，消除已证明冗余的渲染覆盖链，明确职责。
**Architecture:** 显式刷新编排 + 原样卡片构建 + 既有规则及视觉服务。
**Tech Stack:** 原生JS、Node test、Acorn、Chromium Playwright。
**Spec:** docs/superpowers/specs/2026-10-18-render-ownership.md

## Global Constraints
保留26道具、存档、14组几何及离线发行；不执行CircleCI，不改比赛参数。

## Review Focus
- 攻击待决时旧卡片保留、340ms后更新。
- 切题期间810ms合并刷新，回调不重复进入外层。
- 视觉冻结分数在DOM重建后仍恢复。
- 编号/排名排序、All In锁与排名预览时序保留。
- 启动期间不能调用尚未初始化的依赖。

## Task 1: 全仓库基线与索引
- [x] fetch识别9e1be3c、建立隔离worktree；npm test预期100通过。
- [ ] 生成当前基线静态清单，保存本轮独立路径，不覆盖旧证据。

## Task 2: 唯一渲染所有者
Files: src/ui/render.js, src/ui/battle-grid.js, src/script/{00,01,02,03,12,17,24,26,27,29,31}.js, template/manifest。
Consumes: 既有state、排序/防御/视觉服务。Produces: renderAll(), renderGrid()，唯一声明。
- [ ] 增加renderAll/renderGrid单一入口守卫，运行并确认因3/11个定义失败。
- [ ] 增加虚拟时钟测试：正常/攻击合并/FLIP合并/分数保持/异常恢复。
- [ ] 原样迁移有效卡片与装饰；将各门及回调显式编排，删除捕获链及死卡片构建。
- [ ] Node全套、Chromium业务/防御/动画及14组差分通过后提交。

## Task 3: 空脚本和治理文档
- [ ] 架构测试保证无空脚本与模板漂移，先红后绿移除25/26/29/33空源块；26/29有效部分已迁入Task2。
- [ ] 清单工具支持本轮基线和独立输出；更新职责表、清理记录、测试矩阵和维护任务。
- [ ] 构建/静态/Node/Chromium回归；记录指标、限制及证据，提交并同步Sites。
