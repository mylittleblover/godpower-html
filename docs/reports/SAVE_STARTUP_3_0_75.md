# 3.0.75 存档启动修复

新版存档库存在时，启动跳过旧 localStorage 迁移、旧名单扫描和桌面固定文件恢复。读取失败保留原数据并停止初始化；仅空库仍保留首次旧数据接入。手动导入及运行态投影不变。

移除设置导航初始化的无条件保存，以及新存档模式下 pagehide、visibilitychange、beforeunload 的重复旧保存。业务命令持久化和桌面显式退出刷新保留。

验证：451 项单元/集成测试通过；Chromium 1920×1080 1x 两次重新加载，注入损坏旧镜像后仍正常读取新版存档，旧转换入口调用 0 次，文档、修订、索引、迁移回执保持一致，无 pageerror。证据：artifacts/save-startup-direct/result.json、reopened.png。初始回归测试曾因旧迁移及无条件写入失败，修复后通过。

Electron 待同步验收；Windows 真机 NOT TESTED；file:// 受环境管理策略阻塞。AI 多对话尚未实现。

Electron 扩展回归发现炮弹刺客定时器在无活动效果时仍保存及重绘。新增两项定时器回归（空闲不保存/活动仍加分），先复现失败再修复。启动验证须同时覆盖此独立来源。

截图交付：https://drive.google.com/drive/folders/1lxQ7pxYLg-7L3LBdWEiJKsQcDeJng6_p
