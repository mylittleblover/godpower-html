# 上帝的力量 HTML

课堂竞技系统，基于原始 V2.18.13 的 V2.18.15 可靠性整顿候选版。直接打开 `dist/godpower.html`，支持离线资源；课堂数据按浏览器和文件／站点来源保存，迁移前请导出备份。

```sh
npm ci
npm run verify
npm run audit
```

源码与图片自动内联为单文件。27 个原版内置资源逐字保留。Chromium 是当前用户指定的验收浏览器；Playwright 默认 `/usr/bin/chromium`，可用 `CHROMIUM_PATH` 指定其他已安装 Chromium。

- [验收报告](docs/reports/ACCEPTANCE_REPORT.md)
- [架构审查](docs/audit/ARCHITECTURE_AUDIT.md)
- [功能清单](docs/audit/FEATURE_INVENTORY.md)
- [维护任务](docs/MAINTENANCE_BACKLOG.md)
- [维护说明](docs/MAINTENANCE_GUIDE.md)
- [存档规则](docs/DATA_SCHEMA.md)

不使用运行时 CDN 或服务器依赖；仓库提供手动触发的 GitHub Actions 配置，本次未运行远端 CI。不进行 CircleCI 操作。

当前仍有旧规则适配链、异步防御和人工音频／UI 验收缺口，详见报告，不表示全部功能组合已经验收。

## iOS 测试与保存受限环境

V2.18.15 修复 iOS 文件预览／嵌入浏览器拒绝 localStorage 时普通判题也回滚的问题。选项、判题、道具可在本页继续运行；顶部持续提示尚未保存，并可导出当前课堂 JSON。关闭／刷新前必须先导出，否则内存中的进度可能丢失。导入和最终归档仍要求保存成功，归档失败绝不清零。

Sites 使用 `.openai/hosting.json` 对应的私有站点。`npm run build` 同时生成内容相同的 `dist/index.html`（托管入口）与 `dist/godpower.html`（单文件发行包）。线上站点、旧文件和不同浏览器的存储互不自动同步。
