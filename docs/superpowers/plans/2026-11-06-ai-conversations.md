# AI 多对话 Implementation Plan

> **For agentic workers:** 使用 superpowers:executing-plans 按任务实施。用户已授权连续开发，无需再次审阅批准。

**Goal:** 独立会话、可恢复记录及逐次授权的有限多轮上下文。

**Architecture:** 纯会话模型负责校验/上下文筛选；独立 IndexedDB 库负责原子 CAS 保存；AIChat 管理交互及异步所有权。Electron 主进程校验历史消息，只接受 user/assistant，系统提示始终由宿主提供。

**Tech Stack:** 原生 JS、IndexedDB、Node tests、Chromium 1920×1080 1x。

**Spec:** 用户已确认的多对话需求及 docs/ai/OPENCODE_API.md。

## Global Constraints

不修改课堂存档结构、14组布局、业务命令及权限。聊天不保存密钥/可执行提案；恢复不重发请求。无真实账户不消耗云端额度。不操作 CircleCI。

## Review Focus

损坏聊天库不可覆盖；多窗口保存冲突须拒绝；切换会话丢弃迟到结果；离线积分/操作回执不能自动成为模型上下文；停止及失败请求不进入后续上下文。

### Task 1: 会话模型与存储

Files: src/domain/ai-conversations.js、src/infrastructure/ai-conversation-repository.js、tests/unit/ai-conversations.test.mjs。
Interfaces: create/validate/add/rename/remove/append/update/context；repository load/save(expectedRevision)。50会话，每会话100消息，8MiB，超限拒绝不静默删除；最近12条成功模型消息、总16000字符。存储 CAS，读取错误禁止覆盖。

- [x] 写失败测试：会话隔离、校验、上下文筛选和上限。
- [x] 实现模型、IDB 原子 CAS。
- [x] 执行单元测试。

### Task 2: 对话工作区

Files: src/ui/ai-chat.js、src/styles/classroom/ai-chat.css、src/index.template.html。
新增会话列表/搜索/新建/重命名/删除、自动保存、重启恢复。请求开始即绑定会话ID；切换取消请求及旧提案。保存的提案仅保留文字，恢复不能执行。复用设计tokens及现有动效；输入时不重建textarea。

- [x] 浏览器失败场景：两会话切换、重载、无恢复执行按钮、无自动请求。
- [x] 实现 UI 和持久化错误反馈。
- [x] 同分辨率截图及运行回归。

### Task 3: 多轮上下文

Files: desktop/ai-gateway.cjs、tests/ai-gateway.test.cjs、HTML AIChat。
请求 history 可选，最多12条每条4000字符/总16000；仅 user/assistant。前端明确授权本会话历史，只包含成功模型文字，不包含离线结果、回执或待执行命令。后端独立校验，不能注入system角色。

- [x] 后端失败测试：system拒绝、超限拒绝、正确消息顺序。
- [x] 实现并运行完整相关测试。
- [x] 同步可重复构建 HTML，版本/源码SHA一致；提交截图、报告及维护状态。

最终原生集成、同步发行和截图上传按验收报告收尾，不将模拟云端当真实账户测试。
