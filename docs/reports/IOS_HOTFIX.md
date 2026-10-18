# V2.18.15 iOS 保存受限修复

用户报告：iOS 点击选项即显示保存失败；判题出现“操作未完成，已回滚，请导出备份”。

根因：V2.18.14 把普通命令的内存提交与 localStorage 写成功绑定。iOS 文件预览／嵌入环境存储被拒绝时，正确的 +2 也被撤回。旧版 bc42a43 在配额不足及启动拒绝存储的 Chromium 故障注入中均复现 0→0；证据 scoring-persistence-before-after.json。

V2.18.15：普通选项、计分、道具保留本页结果，保存失败标记 persisted:false，持续显示导出备份提醒，不重复刷失败提示。读取被拒绝不再当成 JSON 损坏。业务执行失败仍回滚；导入和最终归档保留严格保存保护，归档失败不能清零。

修复测试使用 Chromium 390×844、触摸和 iPhone UA 模拟，实际点击从欢迎页进入比赛、开题、四组选择 A、选正解 A、判定。正常／QuotaExceededError／启动 SecurityError 均得到四组2分、每组1次正确、1条撤销节点；受限环境导出的JSON包含真实2分。恢复存储后保存、刷新仍为2。不是 Safari 真机验收，待用户实际测试。

自动回归入口：npm run test:e2e（含 scoring-persistence.mjs）；本次没有执行 Firefox 或 CircleCI。

托管：.openai/hosting.json 中绑定私有 Sites 项目，静态目录 dist；dist/index.html 和 dist/godpower.html 内容相同。此文档提交后按同一HEAD打包发布，不使用未提交源码。

网页和旧本地HTML属于不同存储来源，不自动同步数据。迁移前先从原页面导出JSON，再在网页导入。内存模式下关闭／刷新可能失去尚未导出的进度；顶部警告在保存恢复成功后消失。
