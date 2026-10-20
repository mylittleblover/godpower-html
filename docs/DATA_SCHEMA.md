# 数据结构与兼容策略

Schema Version 为 2，应用版本 3.0.42。`godpower_state_v2` 为当前主课堂快照；版本1及无 schemaVersion 的 V2 JSON 经过显式迁移后导入，未来未知版本拒绝。旧 `godpower_state_v1` 保留迁移前原文。主快照损坏时不会自动覆盖；GP-016 恢复面板可原样导出损坏文本，只读扫描旧副本并预览小组数和积分差异，明确确认后才走课堂导入事务。

| 字段                                                    | 类型／默认值                                                   | 持久化与规则                                                                                                                                     |
| ------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| schemaVersion / appVersion / timestamp                  | 2 / 字符串 / ISO 时间                                          | 每次主存档保存；构建不依赖时间戳                                                                                                                 |
| groups                                                  | 数组，默认原四组                                               | 导入须 1–1000 组；日常添加仍沿用原管理规则                                                                                                       |
| group.id                                                | 安全整数                                                       | 缺失生成、重复去重；关联点名预选 ID 需留意迁移                                                                                                   |
| group.groupNo                                           | 正整数／索引+1                                                 | 不再因刷新丢失；编号去重沿用原规则                                                                                                               |
| name / color / members                                  | 字符串／合法六位十六进制／字符串数组                           | 名称保留特殊字符，渲染转义；成员去空、同组去重                                                                                                   |
| score / displayScore                                    | 安全整数／0                                                    | 导入拒绝非有限数、小数、超安全范围；displayScore 从 score 派生；极端手动积分、All In 和道具结果拒绝溢出                                          |
| selectedOpt / allIn                                     | A–D 或空／false                                                | 新格式随回合恢复；旧备份缺少回合元数据时恢复为闲置课堂                                                                                           |
| resultText / animState                                  | 字符串／空                                                     | 结果可保留；动画进度不恢复                                                                                                                       |
| inventory                                               | 最多三个 `{key,charges,acquiredAt,itemInstanceId}`             | 实际 key 来自 ITEM_DEFS；主栏 index0、次栏1/2；旧清洗去未知 key 和重复；次数钳制到实际定义上限                                                   |
| itemStats                                               | correct/wrong/draws/used，均为非负安全整数／0                  | 对缺失、非法及注入字符串归零                                                                                                                     |
| itemEffect                                              | null 或对象                                                    | type: star/mega/power/bullet；hitsLeft/roundsLeft/startedAt/targetId/featherDodge/iceLock/iceRoundsLeftV218 为非负安全整数；不接纳任意 HTML 字段 |
| booShield / booRoundsLeftV218                           | 数值／0                                                        | 后者已加入规范化，保留幽灵三次答题时效                                                                                                           |
| itemUsedThisRound                                       | 布尔／false                                                    | 新格式恢复；新题重置                                                                                                                             |
| roundItemContinuationKeyV218                            | 字符串／空                                                     | 保留三重道具同题续用身份                                                                                                                         |
| picker                                                  | mode/antiRepeat 和三类 ID/key 数组                             | mode 只允许 individual/group/two_tier；数组最多10000项且只接受有限长度字符串或安全整数                                                                 |
| itemGlobal                                              | 对象                                                           | 计数、冷却序号为非负安全整数；点名/举手历史限制数组大小并验证时间、文本、小组ID和布尔结果；两版抽取冷却对象的嵌套序号均验证                           |
| itemGlobal.customIcons                                  | key → raster data URI                                          | 只允许 PNG/JPEG/WebP/GIF base64；SVG、网络 URL、属性注入拒绝；原图片保留                                                                         |
| round                                                   | roundActive/evaluated/correctAns/hasStartedOnce/lastRoundAllIn | 启动在所有旧适配器就绪后恢复，避免先重置再覆盖                                                                                                   |
| history                                                 | 至多40节点                                                     | groups、picker、回合字段、itemGlobal 操作前快照；校验每节点嵌套状态且拒绝多层递归；不存整套配置、音频                                                        |
| firstHandDrawPending                                    | 布尔／true                                                     | 主存档保存首次举手特殊抽取状态                                                                                                                   |
| adminPin                                                | 字符串／原有1234                                               | 本地防误触配置，可读可改，绝不是远程身份认证                                                                                                     |
| masterVolume / sfxVolume / zoomLevel                    | 数值／原默认值                                                 | 迁移钳制0–1／0–1／0.4–2                                                                                                                          |
| resizerEnabled / resizerHeight / columnMode / saveAllIn | 布尔／数值／single或double／布尔                               | 保留原设置，导入限制数值边界                                                                                                                     |

## 归档

独立键 `politics_settlement_history`：数组，记录含 id/title/date/time/champion/totalGroups/totalScore/groups/schemaVersion 和 `clearedData`。后者含完整小组、回合、道具全局、点名池、临时字段摘要与撤销历史。归档以原 API 构建快照，主流程检查明确的 `{ok,error}` 结果；不截断旧档案。CSV 按分区导出并包含原始 JSON 快照；用户字符串的表格公式前缀被加单引号，数值负分保留数值语义。CSV 目前是查看格式，不能直接作为课堂 JSON 导入。

## 写入和失败

主快照单 key 原子写入、字符串回读一致性校验。成功后镜像旧 groups/picker/itemGlobal/history 与设置键；兼容副本失败显示提示，并在返回值给出 key 列表。其他历史功能尚有直接写旧键路径，未实现所有状态操作的统一事务。关闭页面不保证浏览器一定触发 pagehide，关键命令即时保存。

存储配额、安全限制、损坏 JSON 都应保留原存储。读取主快照失败禁止自动覆盖并显示恢复提示；不调用 localStorage.clear。导入先校验，再修改隔离副本，主存档写失败恢复内存。不要通过删键“修复”兼容性。

## 成就进度（应用 3.0.24，增量字段）

`godpower_state_v2.achievementLedger` 是可选对象，当前内部 `schemaVersion=1`。课堂外层 schema 仍为 2，不要求旧存档升级或改写；缺字段的旧备份按空账本处理。对象包含 `groups`，以稳定 `groupUid` 为键；每组进度保存 `permanentUnlocks`、`historicalCounters`、`seasonCounters`、`seasonUnlocks`、`itemDiscovery`、`itemMastery`、`processedEvents` 与 `seasonId`。计数必须是非负安全整数；未知/无效结构在存档校验阶段拒绝。

当前只有正常判题命令产生 `ROUND_SETTLED` 事实（每组一条，包含是否作答/正确及判题前后积分、排名等事实）；手动改分和导入事件不进入账本。12 项学习表现规则已由纯函数评估：历史次数类可解锁，赛季连续/正确率类先记为待归档。事件回执、计数和解锁状态与主课堂快照同一次验证写入，撤销快照包含账本，正式赛季归档保留账本副本。无成就页面或学生提示；竞技表现 10 项、道具 22 项、封神荣誉 8 项及隐藏成就对应的事件生产者/规则尚未实现；回执压缩也待处理。该实现不补猜旧道具行为，也不改变计分。

## 备份和恢复

正式使用前，分别导出课堂 JSON、需要保留的封神榜 CSV、音频 BIN、图标包。JSON 备份包含当前课堂、撤销节点和设置，**不包含全部历史封神榜、IndexedDB 音频、壁纸和按钮图标库**。文件改名、浏览器／配置目录／协议／HTTP端口变化可能改变存储来源；请先导出再迁移。不要把“主存档”误称为全应用备份。

回滚旧版前先导出新版 JSON；旧键镜像尽力兼容 V2.18.13，但旧版无法理解新回合 envelope，不能承诺同一浏览器来回切换不丢会话状态。损坏主存档通过明确导入恢复：写入前先保存原始字节到 `godpower_recovery_before_import_v2`；保留失败则取消导入，不直接删除。

## V2.18.15 保存不可用策略

读取存储被拒绝与 JSON 损坏分开处理，不把 iOS 存储限制误报成损坏存档。普通选项、加分、判题和道具在 RAM 中继续；保存失败不会伪报已持久化，页面持续显示警告，导出包含当前真实积分和历史。恢复保存能力后可再次保存并自动移除警告。业务计算失败仍回滚；导入及最终归档保留严格保存失败回滚，不能在归档失败时清零。内存模式无法保证刷新或关闭后的恢复。

## V2.19.0 界面扩展（不修改课堂 schema）

| 存储键                     | 类型/默认值                                      | 校验与恢复                                                                   |
| -------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------- |
| godpower_ui_preferences_v1 | 对象，见下表                                     | 按默认值类型筛选；异常使用默认，不清空课堂存储；写入失败当次界面仍生效并提示 |
| godpower_ui_bank_v1        | `{knowledge:[],challenges:[]}`，默认内置教学示例 | 解析/校验/保存均成功后替换题库；失败保留现有对象和旧存储；可单独导出与恢复   |

偏好默认：motion=`full`（full/simple/off），speed=1（0.75/1/1.5），pageMotion/itemFx/systemMotion/knowledge/itemTip/honors/challenge=true，subject=`politics`。全部为持久化 UI 状态，不参与计分、结算或历史恢复。程序启动读取；改动立即保存。主课堂备份未扩展为包含题库/界面偏好，题库应单独导出；完整偏好打包列入维护任务。

知识字段：id/title/subject/source 必填字符串；module/summary/mistake/detail 为展示用文本。挑战另需四项文本 options、整数 answer（0–3）、文本 explanation。合计最多 500 条，每项顶层字符串最多 10000 字符。所有展示文本转义，不当作 HTML 执行。示例不是教材原文，增加内容须标明审核来源。

日序号不是持久化字段，由本地年月日生成；当天索引对分类筛选后的数组取模。题库或分类变更可以改变当日展示；同一题库与配置下刷新稳定。

历史 UI 差异只读取 groups 中的 score/inventory/itemEffect/booShield/booRoundsLeftV218 与回合字段。未知字段在完整原始档案 JSON 中保留；UI 不进行猜测补全、改写旧排名或数据迁移。

## 未决防御命令（2026-10-17）

没有新增持久化 schema 或迁移存档字段。待决操作只驻留内存，主存档和旧历史镜像暂缓写入；导出返回操作前完整快照。确认完成才保存整体结果，等待中刷新读回最后完整课堂，相当于取消未完成攻击。合法且已规范化的库存对象保留身份，以兼容防御令牌；非法字段、charges和acquiredAt仍按既有规则规范化。旧存档仍通过原 validateBackup/normalizeAllGroups 读取。

## 欢迎页UI偏好增量

`godpower_ui_preferences_v1.groupCruise`：boolean，默认 false，立即保存。旧偏好缺失此字段时使用false；非法类型被忽略。不增加业务schema版本，不改任何课堂存储键。动画速度、完整／简洁／关闭、跟随系统减少动态效果沿用同一既有UI偏好。欢迎统计的BigInt只存在于计算局部并输出十进制字符串，分数持久化仍为原安全整数Number。

## 设置页整理兼容声明

本轮设置UI清理没有新增或迁移存储键，原All In、分栏、垫片、壁纸、音量、口令及UI偏好仍由既有处理器即时保存。题库仍需验证并保存。原生details展开状态不持久化，刷新默认收起。BGMP音频包、课堂JSON与图片包格式保持原兼容；数据备份不包含自定义音频，界面引导到独立音频迁移区。

## 快捷赋分与全屏反馈界面偏好

独立 localStorage 键 `godpower_score_feedback_v1`，不改变原课堂/历史 Schema 与旧存档迁移。

| 字段          | 类型/默认                    | 校验                     |
| ------------- | ---------------------------- | ------------------------ |
| schemaVersion | number / 1                   | 当前界面格式             |
| slots         | number[6] / [1,2,5,-1,-2,-5] | 恰好六个非零安全整数     |
| pickEffects   | boolean / true               | 抽中演出开关             |
| scoreEffects  | boolean / true               | 自由赋分演出开关         |
| style         | string / aurora              | aurora 或 burst          |
| duration      | number / 1800                | 1200、1800、2600、3600ms |
| clickEnabled  | boolean / true               | 公共按钮点击音           |
| clickVolume   | number / .45                 | 有限数且限制在 0–1       |

缺失偏好使用默认，损坏 JSON 不修改课堂数据。界面偏好与已有 DesktopUI 偏好一样独立于课堂备份；自定义音频仍通过原音频包/BIN 迁移。音频槽、IndexedDB sounds 记录键 `fx_<slot>` 和打包格式不变。

### 操作音效候选

原 sounds 表主记录 `fx_<slot>` 保持不变。候选记录 ID：`fx_<slot>::variant::<UUID>`；字段 `{id:string,arrayBuffer:ArrayBuffer,name?:string}`。加载时按操作汇总解码，旧记录缺少 name 合法。默认没有候选；从主音效及可解码候选等概率选一个。不迁移、不改库版本；BIN 的原索引记录增加可选 name，旧导入继续可读。还原一个操作以单事务删除主键及精确候选前缀，失败保留已保存记录。

### 分功能按钮声音

22 个新操作键 `fx_ui_button_<action>` 使用原 sounds 表主记录与 `::variant::<UUID>` 候选格式，不升级数据库或改变 BIN。缺少新键时回退原 `fx_ui_click` 自定义声音，再回退合成音；不复制旧资源。动画会话、绘制遮层及分数幽灵节点不持久化，不进入课堂存档。

## 道具积木配置 schemaVersion 1

独立存储键 `godpower_item_modules_v1`，结构 `{schemaVersion:1,items:{[道具key]:{draw:{enabled:boolean,weight:number,charges:integer},operation:{enabled:boolean,scoreMultiplier:number,feedback:boolean}}}}`。26道具都需提供；未知键/字段与未知版本拒绝。weight范围0–100，charges范围1–99（mega/power/boo固定原值），scoreMultiplier范围0–10（不适用道具固定1）。导入先校验再写入，写入成功后才替换内存配置。

新获得且自定义次数的库存可附带 `configuredCharges:1..99`，作为该件库存的次数上限，防止后来调整配置或旧花类修复逻辑截断存量。原无该字段库存继续使用原次数上限。此字段随库存快照、课堂备份和撤销保存，不更改旧存档读取方式。

欢迎页题库仍使用 `godpower_ui_bank_v1` 的 `knowledge`/`challenges` 数组，合计至多500条，单文本字段/选项至多10000字符。ID不可空且全库唯一，学科、标题、来源不可空；选项四项不可空，答案0–3。浏览器文件导入与高级JSON编辑使用同一验证和保存入口。首页手动游标属于会话UI状态，不进入课堂积分存档；刷新后回到自然日默认内容。

## 3.0.1 外观偏好

`godpower_appearance_v1`：`{schemaVersion:1, theme:"classic"|"marx"}`，默认 classic。旧用户无此键时不需要迁移；损坏或未知主题回退 classic。独立于课堂主存档，切换不写小组、积分、回合、历史或道具配置。存储失败仅使本次外观生效并提示，禁止清空用户存储。主题偏好当前不随课堂 JSON 备份导入导出；须在新设备重新选择。

Picker协议1新增可选theme展示字段，旧消息缺省classic；Electron拒绝任意字符串作为原生路径，图标和标题仅由内部映射选取。外观偏好自身Schema Version仍为1；课堂envelope另行升级为2，两者用途不同。

## V3 稳定身份（schemaVersion 2）

以下字段是向旧 envelope 添加的可选值；旧数据继续按原格式读取。`groupUid`、`seasonId`、`itemInstanceId` 缺失时在运行时生成；成功的导入保存或后续主存档会持久化这些值。读存储失败时不强行改写原数据。旧结算档案不回填身份，也不从积分猜测道具历史。

| 字段                               | 类型                   | 生成与兼容                                                                                   | 用途                             |
| ---------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------- | -------------------------------- |
| `seasonId`                         | `season-<UUID>` 字符串 | 新课堂生成；V2备份缺失时创建；正式结算写入 archive 与 `clearedData`；清零保存成功后启用新 ID | 赛季归档重试幂等键               |
| `group.groupUid`                   | `group-<UUID>` 字符串  | 老小组首次规范化时创建；已存在且唯一的 UID 原样保留；重复/非法值修复；小组数字 `id` 不变     | 跨重命名、排序和赛季的小组身份   |
| `group.inventory[].itemInstanceId` | `item-<UUID>` 字符串   | 新道具创建时生成；旧 `{key,charges,acquiredAt}` 规范化补齐；道具扣次数或转移时保留           | 三重道具及持续效果与单件库存绑定 |

所有归档重试优先按 `seasonId` 去重，旧档案（无 `seasonId`）仍按原 `id` 去重。schemaVersion 1导入时可缺失这些值；schemaVersion 2要求有效赛季与唯一小组身份。IndexedDB/Electron事务后端切换尚未完成。

## Schema 1 → 2 迁移

纯转换位于 `src/infrastructure/legacy/schema-migrations.js`。补齐稳定身份，保留积分、成员、回合、道具次数和历史，历史中相同组的身份映射到当前组。缺失偏好不转换成0或false。当前版本必须具有有效seasonId及唯一groupUid。

启动仓库先验证当前v2；当前不存在才复制v1或旧镜像。来源保留，目标读回校验后写 `godpower_migration_v2_receipt`（migrationId/source/target/schemaVersion/groups/completedAt/status）。写入失败不标记完成，来源原文不变。

`politics_audio_migration_v2`只在新版安全音频复制事务完成后写入。旧v1标记保留；新迁移会重新检查缺失目标槽位，当前自定义音频优先。

## 新事务仓库（隔离验证阶段）

候选库 `godpower-domain-v1` 含 aggregates、commands、events、archives、resources、migrations 六个store。聚合包含id/revision/snapshot；命令包含commandId/requestHash/result；事件按eventId唯一；资源保存原Blob/ArrayBuffer及来源；迁移回执按migrationId唯一。

仓库尚未切换为生产权威。旧数据完整预检与隔离导入已覆盖localStorage原文、档案、音频和壁纸字节，不会删除来源。下一步须先统一异步命令和来源冻结，再启用正式切换。

## 3.0.3命令意图与确定性导入

commands记录新增可选intentHash：对规范化命令意图计算SHA-256，包含actorId、aggregateId、expectedRevision、source、type与payload。相同ID的不同意图拒绝；相同意图返回原receipt，不重新执行计算。直接仓库调用无intent时仍按完整requestHash严格去重。

完整迁移计划对缺失的旧身份使用来源hash和有序序号生成稳定ID，保留已有身份；重复预检不生成不同赛季/组/道具ID。实际完成时间记录在目标迁移回执，不伪造历史发生时间。来源不支持的对象类型/循环或非有限数值会阻止预检，不按空对象计算hash。

目标校验逐条比较snapshot、archive、resource的完整hash，并检查receipt计数；音频ArrayBuffer与壁纸Blob参与字节校验。校验失败只报告暂存副本无效，原存储和当前课堂不切换。

## 3.0.35 本地教学上下文

以下数据独立于 `godpower_state_v2`，不参与计分、回合、道具或封神榜快照。

| 存储键                                 | Schema                                                              | 主要字段                                                                                                                                   | 默认与恢复                                                                                                        |
| -------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `godpower_teaching_schedule_v1`        | envelope `schemaVersion:1`，`revision >= 1`；文档 `schemaVersion:1` | `entries[]`: `scheduleId`, `userProfileId`, `classroomId`, `weekday`(0–6), `startMinute`(0–1439), `endMinute`(1–1440), `subjectId`, `note` | 键缺失时是空课程表 revision 0；profile同一星期课程时间段不得重叠；跨午夜范围拒绝；写入CAS、读回验证和原字节回滚。 |
| `godpower_active_classroom_context_v1` | `schemaVersion:1`                                                   | `userProfileId`, `classroomId`, `sourceScheduleId`                                                                                         | 必须教师显式选择当前课表建议后写入；只驱动名单工作区本机选择；无效值不应用到比赛。                                |

`TeachingSchedule.findCurrentLesson`使用浏览器本机星期/分钟，区间为`startMinute <= now < endMinute`。时钟只用于显示建议；没有自动切换比赛状态的定时器。

## 3.0.37 名单应用与成员顺序

名单来源仍存放于 `godpower_classroom_roster_v1`，正式比赛仍只持久化在既有 `godpower_state_v2`。确认应用时，事务目标字段仅为每个稳定 `groupUid` 对应的 `groups[].members: string[]`；字段顺序即 roster assignment 的学生顺序，成员名称相同也保留为多个数组项。`normalizeGroup` 保留姓名数组顺序与重复值。个人参与模式、缺失/未知小组身份、陈旧预览、无活动小组及未保存的名单均拒绝应用。应用操作记录现有历史快照并通过统一课堂命令保存；主存档没有持久化确认时回滚内存和历史。名单仓库不随应用写入，因此没有双键部分提交。点名 `pickedStudentKeys` 新条目用 `groupId__memberIndex__name` 区分同名成员；读取筛选时仍检查旧 `groupId__name` 键，以兼容此前防重复记录。

## 3.0.38 学生头像引用

学生 `avatarResourceId` 指向 `godpower_teaching_resources_v1` 中资源记录的 `resourceId`；资源元数据的 `subjectId` 固定为 `student-avatar`，媒体限定 PNG/JPEG/WebP、每个文件最多 2 MiB，并校验相应二进制签名。图片 Blob 继续由 IndexedDB `resourceBlobs` 保存；学生名单只保存资源 ID，不把二进制塞入 localStorage。头像替换前检查 profile/classroom、名单 revision 与原始字节；先添加并验证资源，再 CAS 保存名单引用，失败时删除本次新建孤立资源。头像清除/替换不会删除旧文件，待后续引用计数/清理工作。

## 3.0.39 名单/头像联合备份格式

设置页“导出名单”生成 JSON 容器：`format="godpower-classroom-roster-backup"`、`schemaVersion=1`、`exportedAt`、`rosterData` 与 `avatars[]`。头像记录保留教学资源元数据字段，并增加 `bytesBase64`；每图≤2 MiB，解码后总量≤50 MiB，导入容器≤70 MiB。导入支持该容器与旧版原始 roster 文档。联合包必须完整覆盖 roster 中被引用的头像 ID，不能包含重复/未引用记录；头像 `profileId`/`classroomId` 必须匹配名单身份，且扩展名、MIME、二进制签名、SHA-256 与声明大小都必须匹配。ID 同内容资源可复用；ID 冲突内容不同则创建新 `resourceId` 并重映射 roster，跨课堂或其他资源类型的同摘要冲突拒绝。IndexedDB 新增头像通过资源批次预检、事务与读回验证；名单再通过 revision CAS 写入。如果第二阶段失败，只回滚本次创建的头像，不删除已存在资源或修改原名单。

## 3.0.36 本地教学资源（F2）

数据库：`godpower_teaching_resources_v1`，schema version 1。`resources` object store 保存元数据，`resourceBlobs` 保存 `{resourceId, blob}`；两者以稳定 resourceId 关联，写入/删除同一 IndexedDB 事务执行。SHA-256 唯一索引用于重复内容拒绝。列表读取只加载元数据，预览、下载或备份时才读取 Blob。

元数据字段：`resourceId`（resource- 稳定 ID）、`profileId`、`classroomId`、`subjectId`、`title`、`tags[]`、`fileName`（仅基本文件名）、`mimeType`、`byteSize`、`sha256`、`importedAt`、`schemaVersion:1`。允许 PDF、TXT、JSON、PNG、JPEG、WebP，单文件上限 20 MiB。类型扩展名和 MIME 必须匹配；JSON 必须可解析；文本按 UTF-8 解码；图像和 PDF 检查基本签名，PDF 中可见的 JavaScript/Launch/OpenAction 等活动操作会被拒绝，并且 PDF 只提供元信息与下载、不嵌入 DOM。JSON 备份格式为 `godpower-teaching-resources`/版本1，包含每条记录元数据与 Base64 原始字节；恢复逐条校验身份、大小、签名和 SHA-256，批次失败不写入任何新记录。IndexedDB 不可用、配额不足或读回失败会显示错误，不触碰名单/比赛存储。

3.0.4只整理判题职责和共享基础计算，没有改变Schema2字段、旧存档转换或道具平衡参数。

### 迁移回执verification（3.0.7）

迁移库migrations记录保留complete/aggregateId/sourceHash/archives/resources/completedAt。新增verification对象：status枚举VERIFYING、VERIFIED、DESTINATION_INVALID、STAGED_SOURCE_CHANGED、CANCELLED_STAGED；checkedAt为ISO字符串；sourceHash字符串；sourceRechecked布尔；authorityChanged固定false；integrity为实际读回结果或null。旧无verification回执只证明复制，重新检查后补齐，不作成功推断。
