# V3.0.55 无插件网页版功能恢复验收

基线：过渡版6bf39b0；恢复来源：V3.0.53 / 702d4c2。运行版本、顶栏及备份内部版本均更新为3.0.55。仅修改godpower-html，未同步Electron/desktop。

## 恢复与入口

| 功能 | 入口 |
|---|---|
| 11种内置卡片及布局编辑 | 首页绿色标题区下方“自定义布局”：添加、隐藏、删除、拖动、缩放、键盘移动、撤销/重做、保存/取消 |
| 每日知识、道具提示、课堂挑战、历史荣誉 | 首页内置卡片；内容维护在“欢迎页内容管理” |
| 名单、头像、联合备份及应用到比赛 | 设置 → 学生与小组管理 |
| 课程表、显式课堂上下文、离线资源库 | 设置 → 课程表与教学资源 |
| 26道具抽取/使用流程、百科与图标 | 设置 → 道具与图标；首页道具百科按钮也进入此分类 |
| 公共及独立道具音效 | 设置 → 音效与音乐 → 道具音效 |
| 原始存档保护、恢复候选与确认恢复 | 主存档损坏时的数据恢复工具 |
| 新版事务、事件和撤销修复 | 沿用既有课堂命令与存储入口，无新增插件依赖 |

未恢复插件中心、安装、启停、权限、插件私有数据仓库、官方manifest或插件主题适配。历史三种首页插件卡片ID仅作为数据兼容别名读入，转换为内置卡片，保留布局实例/位置/显隐；不会激活插件。移除的卡片不会在刷新时被自动补回。

## 实际测试

全部浏览器测试为Chromium 1920×1080、deviceScaleFactor=1，隔离存储。

| 测试 | 结果 | 证据 |
|---|---|---|
| Node单元/集成 | PASS | npm test：311/311 |
| 格式/语法/资源/版本检查 | PASS | npm run format:check；npm run check：112脚本、144源码、27原始资源 |
| 无插件运行、11内置卡片、编辑保存/刷新、业务状态隔离、旧ID兼容及删除持久化 | PASS | tests/e2e/home-dashboard.mjs |
| 名单/头像编辑、资源校验、备份和失败回滚 | PASS | tests/e2e/classroom-roster-workspace.mjs |
| 教学分类课程表、保存恢复、显式上下文 | PASS | tests/e2e/teaching-workspace.mjs |
| 教学资源导入、搜索、预览、下载、备份恢复和失败回滚 | PASS | tests/e2e/teaching-resource-library.mjs |
| 损坏主存档保护、只读扫描、确认恢复及刷新 | PASS | tests/e2e/classroom-recovery.mjs |
| 道具获得/使用/实际伤害事件、失败回滚及撤销 | PASS | tests/e2e/item-domain-events.mjs |
| 道具独立流程配置、禁用限制、实际使用、空池、刷新恢复 | PASS | tests/e2e/item-modules.mjs |
| 两主题、五页面、原八分类控件与键盘/持久化 | PASS | tests/e2e/control-consistency.mjs；新增教学分类另由上述测试覆盖 |
| 14组比赛几何 | PASS | tests/e2e/battle-layout.mjs |
| file://直接离线打开 | BLOCKED | 当前浏览器管理策略ERR_BLOCKED_BY_ADMINISTRATOR；未绕过系统策略 |
| 全量历史功能/Windows/Sites | NOT TESTED | 本轮未做全量验收；无Windows构建、Sites发布或CircleCI操作 |

发行：dist/godpower.html，8,197,065 bytes，SHA-256 ef191055874efc7f27a9d0e8b69fce950c432f5a73b0c1ac2dd50978fdaf689f。

截图：artifacts/web-transition/home-default-3.0.55.png、home-3.0.55.png、teaching-settings-3.0.55.png。

重复执行：npm run test:web-transition。主页布局预设/导入导出、完整60成就、完整比赛状态机原本尚未完成，本次不将它们列为恢复完成。
