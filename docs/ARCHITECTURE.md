# GodPower V3 当前架构

更新日期：2026-10-19。应用版本：3.0.2。当前处于渐进迁移中，领域事件与成就目录不代表成就运行时已完成。

## 分层与职责

| 层 | 目录/所有者 | 职责与禁止事项 |
|---|---|---|
| 领域 | `src/domain/identity.js`、`events.js`、`achievements/catalog.js` | 稳定身份、不可变事件信封、60项成就元数据；不读取DOM、存储或Electron接口 |
| 应用 | `src/application/command-lifecycle.js` | 注入host的命令生命周期，管理快照、异步防御、取消、提交钩子和持久化结果 |
| 旧程序适配 | `src/application/legacy-classroom-adapter.js` | 唯一公开useItem/judgeRound与备份/导入接口；目前仍连接全局state和旧执行器，逐命令迁出 |
| 旧存储基础设施 | `src/infrastructure/legacy/` | v1→v2纯转换、源数据保留、读回校验、迁移回执、旧音频安全复制 |
| 事务存储基础设施 | `src/infrastructure/indexeddb/repository.js` | 同一事务保存聚合、事件、命令去重、档案；资源和迁移回执可原子导入。已做隔离浏览器验证，尚未成为生产权威 |
| 存储预检 | `src/infrastructure/legacy/inventory.js` | 只读枚举项目localStorage与四个已知IndexedDB，计算SHA-256并生成完整迁移计划；不自动删除来源 |
| 兼容核心 | `src/core/` | 尚未迁出的规则、防御令牌、历史、道具配置与音效分类；Reliability中的存储接口委托仓库，保留旧调用兼容 |
| 表现 | `src/ui/` | 页面投影、渲染、弹窗、动画、音乐/音效反馈与Electron界面桥；表现不得决定随机或积分结果 |
| 遗留实现 | `src/script/`、`src/style/` | 仍包含有效计分/道具/音频规则及CSS。编号不代表无效；每族通过差分测试后再删除 |

领域层依赖标准JavaScript与可注入的时间/身份来源。应用层通过仓库和表现适配器执行副作用；基础设施不得调用渲染函数。普通内联脚本的构建顺序由模板和manifest显式记录，最终不需要模块服务器。

## 当前运行路径

`UI → 公开命令 → 验证 → 操作前历史快照 → 旧规则执行 → 等待全部异步防御 → 提交钩子 → 整数检查 → 主存档验证写入 → 渲染`

命令成功、持久化成功与视觉播放是独立结果。普通课堂在浏览器存储不可写时保留本页结果并持续提示导出；导入和最终归档采用严格保存/恢复。异步防御取消后不得修改新回合、替换过的道具或导入后的课堂。

事件scope含commandId、eventId、source、aggregate、causationId、时间与序号。只有仓库明确确认事件已持久化，控制器才发布确认事件。生产旧存储目前未接事件持久化，因此不会提前发布成就事件。

## 当前数据权威及迁移

1. 当前课堂主键为`godpower_state_v2`，envelope schemaVersion=2。旧`godpower_state_v1`保留迁移时的原始字节。
2. 启动优先读取并验证v2；只有v2不存在才读取v1，或旧镜像键。纯转换补齐groupUid、itemInstanceId、seasonId后，复制到v2并读回校验。
3. 当前主存档损坏时阻止自动覆盖，不能静默回退成更旧的课堂。明确导入恢复前把损坏原文保存到`godpower_recovery_before_import_v2`。
4. 迁移复制失败时保留来源；已验证的旧课堂可在内存使用并导出。完成回执最后写入，回执写入失败可重试。
5. 兼容镜像仍在主快照成功后更新。归档目前仍位于`politics_settlement_history`，与课堂清零尚非跨键事务；保存失败恢复原课堂，seasonId用于防重复。
6. 新IndexedDB事务仓库已验证原子提交、修订冲突、命令去重、崩溃后重开与资源导入。切换生产权威前，必须完成异步应用命令入口、来源冻结和完整迁移读回验证，不能长期维持两个权威源。

v1来源是迁移前基线，不代表迁移后每次操作的最新副本。回退旧程序前必须导出新课堂并做兼容转换；不能直接把旧源当作最新进度。

## 音频与媒体

原音频库继续使用`PoliticsScoreSoundDB_Unified/sounds`，壁纸继续留在`PoliticsUiDB/kv`。课堂JSON不包含这些二进制资源，也不含全部历史归档和界面偏好。

旧音频复制由独立适配器负责：只读来源；保留原曲目别名映射与完整元数据；只补目标缺失的槽位；一个目标事务全部提交后才写`politics_audio_migration_v2`。旧v1标记不作为新版成功依据。失败不写完成标记、不删除来源，下次重试。

完整迁移预检为每个项目键、数据库元数据、音频记录和Blob计算SHA-256，保存原文与原记录。提交前重新校验来源；来源变化必须重新预检。预检模块尚未暴露为默认界面操作。

## 比赛、道具、历史与界面

原排名、计分、All In和26种道具参数保持不变。三重道具实例独立标识，扣次和转移保留实例身份。历史继续使用最多40条操作前快照；现阶段没有用事件重放替换撤销语义。

`renderAll/renderGrid`由`ui/render.js`唯一拥有，卡片由`ui/battle-grid.js`构建；现有攻击延迟、FLIP和显示分数保持逻辑继续使用。14组几何、垫片、列模式和缩放必须按同一配置比较。新成就不向比赛卡片增加常驻占位。

Electron主窗口继续拥有唯一课堂状态和抽选结果。悬浮点名、独立功能窗口与全屏特效通过安全preload/白名单IPC交互，不重新抽选或重复赋分。迁移期间不改变该所有权。

## 构建和验证

`src/index.template.html`引用分层源码；`src/manifest.json`记录内联顺序；`scripts/build.mjs`输出自包含`dist/godpower.html`与`dist/index.html`，版本来自package.json。所有27项原内嵌资源按原文保留，不引入CDN。

常用命令：`npm run build`、`npm run check`、`npm run format:check`、`npm test`、`npm run test:migration`。UI验收只运行Chromium 1920×1080、1×；不执行CircleCI。当前受管浏览器禁止file://导航时记录BLOCKED，不能计为离线运行通过。

Electron同步必须从已提交的HTML源码构建并记录commit、SHA-256和字节数。Windows真机安装、托盘、多显示器与跨应用覆盖仍需真机证据，Linux测试不能替代。

旧架构记录保存在[历史文档](history/ARCHITECTURE_PRE_V3.md)。实施证据见[V3日志](v3/IMPLEMENTATION_LOG.md)。
