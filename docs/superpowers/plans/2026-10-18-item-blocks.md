# Item Building Blocks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 分离可配置道具抽取/运作流水线并完善首页本地内容管理。
**Architecture:** 纯配置模型 + 稳定运行时适配 + 独立设置组件。保留原规则执行与事务生命周期，新增的积木不产生同名函数覆盖。
**Tech Stack:** 原生 JavaScript、Node test、Playwright Chromium、既有离线构建。
**Spec:** docs/superpowers/specs/2026-10-18-item-blocks-design.md

## Global Constraints

- Chromium 1920×1080、1x；无 CircleCI 操作。
- 默认26道具规则、14组布局及旧存档兼容。
- 先修改HTML源码、构建并提交，再同步Electron。

## Review Focus

非法配置/存储失败不覆盖原值；配置调整不截断原库存；防御异步倍率不重复计算；所有候选关闭时返回空不回退金币；题库导入失败不改变当前数据。

### Task 1: 道具模型与运行时
- [x] 添加并运行纯模型测试，覆盖倍率、字段校验、持久化失败、库存次数。
- [x] 创建 core/item-module-model.js、core/item-modules.js；在原抽取权重、入库、useItem、积分与演出入口接入。
- [x] 跑单测、26道具与异步防御回归。

### Task 2: 设置组件
- [x] 新增 ui/item-modules.js/css，两条流程分别配置，各道具独立保存、重置、导入导出。
- [x] 在道具设置分类挂载；实际浏览器验证保存、重载、空池。

### Task 3: 首页内容
- [x] 修复百科跳转并补回归；独立知识/题目游标，正确答案解锁下一题。
- [x] 表单化知识/题目编辑与JSON文件导入导出，增强验证。
- [x] 实际浏览器验证与截图。

### Task 4: 交付
- [x] 构建、语法校验、单测及1920专项回归；更新维护文档。
- [x] 提交HTML源码，校验同步Electron并提交（桌面仓库独立记录）。
