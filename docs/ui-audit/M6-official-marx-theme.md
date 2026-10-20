# 官方马克思主题插件首阶段迁移（3.0.30）

日期：2026-10-20。分支：`feat/v3-foundation-sp01-sp02`。此阶段只迁移官方主题的受控色彩贡献，不更改课堂竞技和存档行为。首页自定义卡片的布局方案由另一个设计会话负责，本阶段没有修改首页卡片结构。

## 交付

- 新增 `official.marx-theme` 内置声明式manifest，固定列出受支持的12个主题token；没有CSS、脚本或HTML注入。
- Plugin Center启动时以宿主内置信任路径安装、授予仅需的主题权限并激活，主题注册走既有ContributionRegistry。外部manifest仍不能伪装官方ID。
- 主题选择器继续兼容 `godpower_appearance_v1`，`GodpowerTheme`负责品牌名称、应用图标、旧主题CSS和转场；其适配器从官方theme contribution应用颜色token。切回经典时撤销token覆盖。
- 插件私有命名空间与课堂存档分离；本次不迁移旧业务数据，也不删除任何存储键。

## 暂留

旧主题CSS中的历史颜色别名、应用图标/导航SVG、窗口特效和Electron原生窗口仍由既有 `GodpowerTheme` 管理。当前受控token贡献与旧CSS在同一官方主题下共同生效，是迁移适配层，不代表主题引擎已完全迁移。Plugin Center允许停用该插件；旧CSS仍提供视觉回退，但受控token贡献不再生效。

## 验证

- `npm run check`：PASS；3.0.30、100 script blocks、27个内嵌资源、132 source blocks。
- `npm test`：272/272 PASS。
- `node tests/e2e/plugin-platform.mjs`：PASS；官方插件受信任安装及唯一注册表贡献，Chromium 1920×1080 1x。
- `npm run test:theme`：PASS；马克思/经典切换、旧偏好刷新恢复、主题动画、插件停用/恢复回退、14小组布局、控件一致性及3秒Tooltip检查，Chromium 1920×1080 1x。
- Electron桌面主题及浮窗/全屏特效：NOT TESTED（待同步与回归）。
