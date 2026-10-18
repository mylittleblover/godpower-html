# 2026-10-18 Repository Hygiene Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task by task. Steps use checkbox syntax to track status.

**Goal:** 减少无效源码和重复工具链，让新增代码维持统一风格，同时保证课堂规则、数据与离线单文件行为无变化。

**Architecture:** 先建立只读审查及格式门禁，不碰音频、计分与 DOM 所有权。随后以等价回归为凭据逐组件收敛旧覆盖链。测试记录必须区分本轮执行与历史证明。

**Tech Stack:** 原生 HTML、CSS、JavaScript、Node.js 24、Acorn、Prettier 3.6.2、Playwright Chromium。

**Spec:** docs/audit/REPOSITORY_HYGIENE_2026-10-18.md。

## Global Constraints

- 基线 `dd987a61d8ad5a72a40f7c808bf586bfa5811ab9`；治理分支 `refactor/20261018-repository-hygiene`。不直接写入 main。
- 不改变 26 道具计分、库存、防御与持续状态，也不改变比赛 14 小组卡片尺寸、垫片、排序及动画结果。
- 不改变存储 schema、历史、归档、数据导入导出、音频候选、离线单文件与 27 个原始图片资源。
- `baseline/`、已有截图和失败证据不可因“看起来重复”而直接删除；要先确定引用者并迁移归档。
- 不运行 CircleCI，不购买 Actions 配额。无法执行的浏览器验证必须标记 BLOCKED，不能当作 PASS。

## Review Focus

1. 14 小组及特殊积分时卡片几何不可变化；归属任务 3/4 的 Chromium 对照。
2. 26 道具、异步防御与撤销的跨回合回归；归属任务 4 的差分及命令测试。
3. 离线 file/HTTP 构建结果与 27 资源逐字一致；归属任务 3 的 build/check。
4. 页面入场、弹窗焦点、动画跳过与取消均保持；归属任务 4 的 UI 验收。
5. 旧数据导入、存储配额异常与音频候选恢复不回归；归属任务 4 的数据与音频测试。

### Task 1: Read-only hygiene inventory

**Files:** `scripts/repo-hygiene.mjs`、`tests/unit/repository-hygiene.test.mjs`、`package.json`。

**Interfaces:** `classifyTrackedFiles(entries)`、`findCommentOnlyScripts(entries)`、`manifestIssues(template, manifest, presentPaths)`。

- [x] 先写分类、注释空脚本、资源/清单漂移的 3 个 Node 测试，确认模块缺失时失败。
- [x] 实现只读检查器；在隔离的合成 git 仓库运行测试、语法与 CLI 成功。
- [ ] 在真实仓库执行 `npm run audit:hygiene` 并保留输出。当前环境只能经 GitHub 连接读取私有仓库，不能在本机克隆完整工作树。
- [ ] 在完整仓库运行 `npm test` 并检查无其他失败。

### Task 2: Enforce new-code formatting

**Files:** `package.json`。

- [x] 将已有 `format:ui` 与新增 `format:core` 合为 `format:check`，纳入 `verify`。
- [ ] 在完整仓库运行 `npm run format:check`；任何已有格式差异先修复后再将此任务置为完成。
- [ ] 执行 `npm run verify`；不得用此前分支的 PASS 替代本轮记录。

### Task 3: Remove provably inert legacy blocks

**Files:** `src/script/25.js`、`src/script/33.js`、`src/index.template.html`、`src/manifest.json`、`dist/index.html`、`dist/godpower.html`。

- [ ] 测试先断言两个旧脚本没有可执行 AST 语句，且 HTML 脚本顺序和所有核心入口仍有效。
- [ ] 删除两个纯注释块，更新模板并重新同步 manifest，保留历史说明于文档。
- [ ] 运行 build/check/test，比较构建前后可执行 JS 与 27 资源，更新两份 dist，并执行 Chromium UI/规则回归。
- [ ] 验证通过后独立提交，严禁在未重建 dist 时只删源文件。

### Task 4: Stage high-risk cleanup by ownership

**Files:** `src/script/00.js`、`src/script/05.js`、`src/script/36.js`、`src/ui/desktop.js`、`src/style/*.css`，按子系统分别计划。

- [ ] 先迁移 14 层 `legacyUseItem` 有效规则到注册/命令模块，逐个道具以固定时间随机数和差分证明。
- [ ] 将 `renderGrid/renderAll` 迁入明确的渲染所有者，不改变 14 小组几何。
- [ ] 分离 `desktop.js` 的设置、历史/档案、窗口生命周期；整理 CSS 时按组件用截图证明每条删除。
- [ ] 建立 `artifacts/` 引用/保留/迁移清单，重复抓取产物转到专用验收附件之后才能从 git 树删除。
- [ ] 执行完整 `npm run verify`、`npm run audit:legacy`、人工声音与投影验收并复核本报告。

## Status

本次分支只实施任务 1 的工具与任务 2 的配置门禁；任务 3、4 仍需要完整私有工作树、可运行的 Chromium 环境与验证证据。不得将本分支描述为“全量清理已完成”。