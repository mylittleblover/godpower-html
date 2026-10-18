# V2.19.0 重构治理第一批：异步防御失效保护

## 基线与提交

- 基线：`feat/desktop-ui-system` 的 `2bbec657516ff609a2cbf6df85507f8615aeb2d2`。
- 工作分支：`refactor/v219-defense-lifecycle`。
- 功能提交：`488711e7b2752c181eb24fa616f5bb34de159c4c`。
- 不改变道具平衡参数、十四小组卡片几何、存档 schema 与原有 UI 配置。

## 修改

1. `Reliability` 新增防御令牌：要求课堂状态对象、小组对象、主要道具对象和回合条件仍相符。新的课堂命令、切题、开始与强制结束、恢复历史会显式使旧令牌失效。
2. 刺龟壳蘑菇/超级喇叭确认回调在失效时不再消费道具或更改分数；`finally` 清理等待标记，`catch` 记录异常。
3. 删除 `src/script/36.js` 无实际效果的自我字符串替换 `renderItemWindow` 包装器。
4. 新增 `tests/unit/defense-lifecycle.test.mjs` 与 `tests/e2e/defense-lifecycle.mjs`，后者已纳入 `npm run verify`。

## 验证（必须区分）

- PASS：使用隔离 V8 解释器直接装载该提交的 `Reliability`，执行原有纯核心测试与新增确认令牌测试体；包括修改过的 JavaScript 的语法检查，总计 59 项结果通过、0 失败。**这不是 `node --test` 或 Chromium 端到端运行。**
- FAILED/BLOCKED：GitHub Actions 运行 https://github.com/mylittleblover/godpower-html/actions/runs/39023744978 在启动约 3 秒后失败。没有可读取的步骤信息；下载作业日志返回 `BlobNotFound`。**无法确定真实失败原因，不应归因于环境或源码。**
- NOT TESTED：实际 `npm ci && npm run verify` 的 Node/Chromium 完整流程；新 E2E 对弹窗接受、拒绝和中断的真实浏览器行为；`file://` 和本地发布包。
- NOT BUILT：此次仓库 `dist/` 仍是上一轮 V2.19.0 发布包，新源码需要运行 `npm run build` 后才会进入发行 HTML。禁止将现有 dist 当作已包含此修复。

## 未完成风险

- GP-010 仍为 OPEN：攻击者道具消耗先于异步防御结果产生；必须将异步确认纳入可撤销的完整命令事务，并补齐存储失败和跨多目标组合。
- GP-011/012/013/014：旧道具适配器、布尔状态机、音频生命周期、渲染及 CSS 仍然需要分模块治理。
- 完整清理需要将遗留函数按调用路径证明等价，再逐个移除；不得以本阶段为完成全部代码重构的证据。

## 下一步验收命令

在有 Node 24、Chromium、npm 的完整仓库中执行 `npm ci && npm run verify`。保留控制台失败信息并完成差异修复；重新构建 `dist/godpower.html` 与 `dist/index.html`；确认 14 组布局和 26 道具规则无回归后，方可从 draft PR 进入合并审查。
