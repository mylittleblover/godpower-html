# OpenCode 联网模型接入

首选提供商为OpenCode。设置里可选当前Console、当前Go和旧版Zen/Go地址兼容；采用Chat Completions JSON和Bearer API Key。无需在用户电脑安装OpenCode CLI，不读取其现有auth.json，不自动购买额度。

| 连接选项 | 固定请求地址 |
|---|---|
|OpenCode（当前Console）|https://opencode.ai/inference/openai/v1/chat/completions|
|OpenCode Go|https://opencode.ai/inference/go/openai/v1/chat/completions|
|OpenCode Zen（旧地址兼容）|https://opencode.ai/zen/v1/chat/completions|
|OpenCode Go（旧地址兼容）|https://opencode.ai/zen/go/v1/chat/completions|

默认模型标识glm-5.3-flash来自官方目录示例，教师必须核对账户可用模型和费用；名称可编辑。不保证任何模型免费或账户有权限。配置不触发请求；每次发送才访问已选择的端点，没有跨提供商自动回退或失败自动重试。

## 官方依据（2026-11-05读取）

官网文档直接读取返回403，改用同项目官方GitHub文档源码核对，未拿搜索摘要替代。

- 当前模型与API：https://github.com/anomalyco/opencode/blob/e3b0ca61ad02c983ff70252b18a0480a1821a29a/services/www/src/docs/content/console/models.mdx
- 当前Go：https://github.com/anomalyco/opencode/blob/e3b0ca61ad02c983ff70252b18a0480a1821a29a/services/www/src/docs/content/console/go.mdx
- 当前Console转发API：https://github.com/anomalyco/opencode/blob/e3b0ca61ad02c983ff70252b18a0480a1821a29a/services/www/src/docs/content/console/api/providers.mdx
- 旧版Zen：https://github.com/anomalyco/opencode/blob/388406238bd5ca15564a762840a2362c3a45bd9c/packages/web/src/content/docs/zen.mdx
- 旧版Go：https://github.com/anomalyco/opencode/blob/388406238bd5ca15564a762840a2362c3a45bd9c/packages/web/src/content/docs/go.mdx

当前官方文档说明：文本模型可通过不同API格式调用，由Console转换。当前实现统一使用Chat Completions，不将Responses/Anthropic格式错误套到同一解析器。旧地址作为明确可选兼容项，不声称永远可用。

## 安全与实测边界

仅Electron主窗口可调用AI的五个窄IPC方法；主进程通过固定端点请求，保持原CSP和浏览器网络拦截。密钥输入后立即清空，仅默认驻留主进程内存；教师选择记住时使用safeStorage，拒绝basic_text明文后端。密钥不写课堂存档、对话或审计，不从主进程返回。

默认不发送姓名/学号/组名/头像/历史对话；本次发送前明确授权输入文字及可选匿名小组编号和积分。正式加减分仍需再次教师确认。模型联网不等同自动网页检索，本阶段没有开放任意浏览器/搜索/文件工具。

测试只使用模拟响应或本地测试服务，验证固定地址、Bearer、JSON、取消、响应大小与重复消息、重复消息、隐私与教师确认；未配置真实账户密钥，真实OpenCode服务端成功调用为NOT TESTED，绝不把模拟服务通过当真实云端联通。
