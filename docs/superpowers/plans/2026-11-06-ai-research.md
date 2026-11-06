# AI Research Implementation Plan

> **For agentic workers:** 使用superpowers:executing-plans。用户明确授权自主推进，无需新的审批。

**Goal:** 可追溯联网检索与离线九科学习资料。
**Architecture:** 资料模型/目录/存储/UI分开；网络搜索和模型凭据留在主进程。
**Tech Stack:** 原生JS、IndexedDB、Node tests、Chromium1920×1080 1x。
**Spec:** ../specs/2026-11-06-ai-research-design.md

## Global Constraints
不打包未授权教材，不冒充完整课本；仅deepseek-v4.1-flash真实调用；不改课堂规则/数据/14组布局；不操作CircleCI。

## Review Focus
来源指令注入不能转成课堂操作；旧请求不能写新会话；损坏/重复导入不污染资料；密钥不传搜索站点；不能将搜索失败说成查询成功。

### Task 1: 模型与内置资料
Files: domain/ai-knowledge.js、resources/subject-library.js、tests/unit/ai-knowledge.test.mjs。
- [ ] 先写失败测试：九科、明确类型、匹配、上限、非法字段。
- [ ] 实现validate/search，27篇原创参考及9科官方教材入口。
- [ ] 运行专项测试。

### Task 2: 资料管理
Files: infrastructure/ai-knowledge-repository.js、ui/ai-knowledge.js、styles/classroom/ai-chat.css、template/manifest。
- [ ] 失败浏览器场景：原子导入、去重、浏览、删除、刷新。
- [ ] 内部窗口与文本/JSON导入导出，默认不发资料。
- [ ] 同尺寸实际截图。

### Task 3: 联网与模型
Files: Electron desktop/ai-web-search.cjs、ai-gateway.cjs、tests/ai-web-search.test.cjs、ai-gateway.test.cjs；HTML ui/ai-chat.js。
- [ ] 先写RSS安全/密钥隔离/授权/资料验证测试。
- [ ] 固定端点和有限检索，AMR入口，来源回执、无自动动作。
- [ ] 实际公开搜索及DeepSeek Flash联调；完整相关单元及浏览器。

### Task 4: 发行
- [ ] 更新文档、版本；HTML提交、Electron SHA同步。
- [ ] 原生专项、Windows ZIP/CRC/包内资源校验、分卷上传、截图及代码推送。
