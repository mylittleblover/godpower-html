# 名单管理收尾实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans; 用户已授权连续实施，不重复等待批准。

**Goal:** 设置内直接新增/编辑小组，学生新增时直接分组，搜索及成员编辑更顺手。
**Architecture:** SaveRoster纯操作 → SaveManager.edit事务 → SaveWorkspace展示；不改变比赛/历史/存档协议。
**Tech Stack:** 原生JS、CSS tokens、Node Test、Chromium1920×1080/DPR1。
**Spec:** docs/superpowers/specs/2026-11-04-roster-workflow-design.md

## Global Constraints

不改14组卡片布局、底色、玩法规则、UID和旧存档；不覆盖3.0.71发行；CSS仅现有owner；提交前真实验证。

## Review Focus

- 新增分组不能清空该组原成员。
- 新小组ID与groupUid不能碰撞，不改变旧分数/库存。
- 保存失败保留输入；未通过ACK不显示保存成功。
- 切档不能提交旧成员表单。
- 搜索/编辑取消不能触发保存或丢焦点。

### Task 1：规范名单操作

Files: src/domain/save-roster.js、tests/unit/save-roster.test.mjs。
Interfaces: addStudent(input,{displayName,number,groupUid?})、addGroup(input,{name,color})、editGroup(input,groupUid,{name,color}) → 新文档；统一原验证/finish。
- [x] 新增学生直接分组、错误组拒绝、小组新增与改名保持比分/库存/历史/UID测试，先运行确认RED。
- [x] 实现上述纯函数，不修改原输入；运行专项确认GREEN。
- [x] 同Task2完成后统一套件及可回滚提交。

### Task 2：设置工作区

Files: src/ui/save-workspace.js、src/styles/settings/save-workspace.css、src/ui/component-catalog.js、tests/e2e/roster-workflow.mjs、package版本/dist。
Consumes: Task1三个接口；SaveManager.edit与现有AvatarPresetPicker不变。
- [x] 浏览器用例先验证新增入口缺失RED。
- [x] 两个同级分区、就地搜索、学生分组选择/取消、小组表单和组内成员编辑；仅原owner改样式。
- [x] 浏览器验证新增/分组/改名/取消/搜索焦点/刷新/14组几何，截图无溢出。
- [x] npm run build/check、npm test、组件索引；更新台账/维护表，提交推送开发分支。
