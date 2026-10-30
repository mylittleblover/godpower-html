# 独立网页版架构 V3.0.56

此分支是无插件的网页版过渡发行，基础来自 V3.0.26，恢复了后续 V3.0.53 中已实现的非插件功能和可靠性修复。desktop/Electron 由独立项目继续演进。

- `src/domain`：身份、比赛计算、成就账本、名单、课程、资源及主页布局纯模型。
- `src/application`：课堂命令、事务、判题、撤销及旧课堂适配。
- `src/infrastructure`：版本化课堂存储、隔离名单/课程/布局仓库、IndexedDB教学资源和音频兼容。
- `src/ui`：五个页面、生命周期、头像展示、设置工作区、恢复界面、主页编辑及动画。
- `src/items`：26种道具定义与执行适配；通过原命令入口持久化和撤销。
- `src/script` / `src/style`：仍需逐步治理的兼容业务及视觉实现。

主页由 `HomeDashboard` 直接注册11类内置卡片，没有插件依赖。布局独立保存于 `godpower_home_layout_v1`；已保存的三种官方插件卡片类型被映射为内置类型。卡片编辑不修改比赛状态。

设置中的学生与小组、课程表与教学资源、道具与图标、音效与音乐各自拥有明确入口。名单头像经本地资源仓库校验后用于小组卡、老虎机及全屏结果；未提供头像时使用既有回退。

`godpower_state_v2` 仍是课堂唯一权威快照。存档恢复工具保护损坏原文，用户确认后才恢复可用副本。道具使用、实际失分与举手奖励获得事件保留 V3.0.53 的已实现范围；完整成就和状态机仍未完成。

发行通过 `src/index.template.html` 和 `src/manifest.json` 组合源码，`npm run build` 生成完全离线的 `dist/godpower.html`。插件中心、插件平台、插件存储、官方manifest和插件主题适配均不进入发行。

验证与入口清单见 `docs/validation/WEB_TRANSITION_FEATURES.md`。可重复验证：`npm run test:web-transition`。

V3.0.56 将菜单、思考、比赛、开场、过门、结算及BGM试听统一接入独立 musicGainNode，然后进入 masterGainNode。音效保持 fxGainNodeV2176 → masterGainNode，音乐滑条不会改变音效或主音量。音乐偏好独立存于 politics_bgm_volume，缺失默认为1。
