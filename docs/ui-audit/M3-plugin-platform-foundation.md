# M3 插件平台基础与 Plugin Center

日期：2026-10-20。版本：3.0.27。分支：`feat/v3-foundation-sp01-sp02`。

## 本阶段交付

- `src/application/plugin-platform.js`：声明式 manifest 校验；本地安装状态；显式权限；按本地课堂 scope 授权；安装、启用、暂停、恢复、停用、隔离、卸载；activation token；贡献注册；依赖激活检查；CAS 私有存储；10 MiB 每 scope 配额；启动时将遗留 active/paused 状态恢复为 installed。
- `src/infrastructure/plugin-local-repository.js`：独立 `godpower_plugins_v1` localStorage envelope，读写回读验证；损坏 JSON/schema、配额和安全异常显式失败，不改写来源。
- `src/ui/plugin-center.js` 与 `plugin-center.css`：新增一级插件入口，导入JSON声明、查看权限、启用/停用、卸载（默认保留数据）、打开插件页工作区。
- `src/ui/contribution-registry.js`：注册表加入不可覆盖的插件中心 core route；原5页面持续可用。`switchView`将已注册的插件页路由交给宿主工作区。
- 无可执行插件代码进入主页面。Manifest `entry` 只允许JSON内容/主题/视图/规则路径且拒绝 `..`、绝对路径、URL、脚本文件；第三方不能冒用 `official.*`。安全提示明确展示当前未开放JS沙箱。
- HTML发行版仍由manifest构建为单文件，27个原嵌入资源保持完整；业务规则、课堂状态和旧存档格式没有变化。

## 边界与待续

这是声明式插件管理基础，不是完整的第三方插件执行环境。当前还没有ZIP文件/entry存在性校验、签名/摘要信任、依赖求解、升级迁移、网络/文件/音频服务调用、独立Worker sandbox、插件故障自动隔离UI、私有数据导出或Electron broker。localStorage的真实配额可能低于逻辑10MiB限制；写失败会返回错误，不会清空课堂数据或插件旧值。不要导入或宣传可执行JS插件已经可用。

## 实际测试

| 检查 | 结果 |
|---|---|
| 构建/检查 | PASS；3.0.27，131 source blocks、99 script blocks、27 resources；单文件8,027,533 bytes；SHA-256 `540ec074804090ff8a2950ae4ba121367bc612bf9f6ace2fc22fdeeb465cffd7` |
| 单元/集成 | PASS 268/268，含插件manifest/生命周期/私有存储及localStorage仓库故障测试 |
| 注册协议与页面生命周期 | PASS；Chromium 1920×1080 1x，0 pageerror |
| Plugin Center | PASS；导入、默认未启用、权限审阅、启用、插件route、停用撤销、卸载留存；`tests/e2e/plugin-platform.mjs` |
| 六个core routes截图基线 | PASS；Chromium 1920×1080 1x；见 `artifacts/ui-governance-m3/` |
| 14组布局 | PASS；Chromium 1920×1080 1x；所有卡片位于底栏上方 |
| 完整桌面UI | PASS 23/23，Chromium 1920×1080 1x，0 uncaught pageerror |
| 离线主流程/主页/主题控件 | PASS；release-smoke 4/4、主页14组、双主题六页与开关回归；Chromium 1920×1080 1x |
| CircleCI | NOT RUN（按用户要求） |
| Electron 3.0.27 | NOT TESTED，等待HTML阶段提交后同步 |
| Windows原生 | NOT TESTED |
