# 数据结构与兼容策略

Schema Version 为 1，应用版本 V2.18.15。`godpower_state_v1` 为主课堂快照；无 schemaVersion 的 V2 JSON 视为旧格式导入。未知 schemaVersion 拒绝，不能猜测迁移。原始文件 SHA-256：`5beddb36a1abd2746e7c63f29916a3bda355ede09bc8987800c80a4e1c20ed90`。

| 字段 | 类型／默认值 | 持久化与规则 |
|---|---|---|
| schemaVersion / appVersion / timestamp | 1 / 字符串 / ISO 时间 | 每次主存档保存；构建不依赖时间戳 |
| groups | 数组，默认原四组 | 导入须 1–1000 组；日常添加仍沿用原管理规则 |
| group.id | 安全整数 | 缺失生成、重复去重；关联点名预选 ID 需留意迁移 |
| group.groupNo | 正整数／索引+1 | 不再因刷新丢失；编号去重沿用原规则 |
| name / color / members | 字符串／合法六位十六进制／字符串数组 | 名称保留特殊字符，渲染转义；成员去空、同组去重 |
| score / displayScore | 安全整数／0 | 导入拒绝非有限数、小数、超安全范围；displayScore 从 score 派生；极端手动积分、All In 和道具结果拒绝溢出 |
| selectedOpt / allIn | A–D 或空／false | 新格式随回合恢复；旧备份缺少回合元数据时恢复为闲置课堂 |
| resultText / animState | 字符串／空 | 结果可保留；动画进度不恢复 |
| inventory | 最多三个 `{key,charges,acquiredAt}` | 实际 key 来自 ITEM_DEFS；主栏 index0、次栏1/2；旧清洗去未知 key 和重复；次数钳制到实际定义上限 |
| itemStats | correct/wrong/draws/used，均为非负安全整数／0 | 对缺失、非法及注入字符串归零 |
| itemEffect | null 或对象 | type: star/mega/power/bullet；hitsLeft/roundsLeft/startedAt/targetId/featherDodge/iceLock/iceRoundsLeftV218 为非负安全整数；不接纳任意 HTML 字段 |
| booShield / booRoundsLeftV218 | 数值／0 | 后者已加入规范化，保留幽灵三次答题时效 |
| itemUsedThisRound | 布尔／false | 新格式恢复；新题重置 |
| roundItemContinuationKeyV218 | 字符串／空 | 保留三重道具同题续用身份 |
| picker | mode/antiRepeat 和三类 ID/key 数组 | mode 只允许 individual/group/two_tier；已抽池耗尽按原规则重置 |
| itemGlobal | 对象 | blooperUntil/totalDraws/handRaiseTotal/pkTotal 非负安全整数；pickerHistory/handRaiseHistory 数组；两版抽取冷却对象保留 |
| itemGlobal.customIcons | key → raster data URI | 只允许 PNG/JPEG/WebP/GIF base64；SVG、网络 URL、属性注入拒绝；原图片保留 |
| round | roundActive/evaluated/correctAns/hasStartedOnce/lastRoundAllIn | 启动在所有旧适配器就绪后恢复，避免先重置再覆盖 |
| history | 至多40节点 | groups、picker、回合字段、itemGlobal 操作前快照；导入验证每节点 group；不存整套配置、音频 |
| firstHandDrawPending | 布尔／true | 主存档保存首次举手特殊抽取状态 |
| adminPin | 字符串／原有1234 | 本地防误触配置，可读可改，绝不是远程身份认证 |
| masterVolume / sfxVolume / zoomLevel | 数值／原默认值 | 迁移钳制0–1／0–1／0.4–2 |
| resizerEnabled / resizerHeight / columnMode / saveAllIn | 布尔／数值／single或double／布尔 | 保留原设置，导入限制数值边界 |

## 归档

独立键 `politics_settlement_history`：数组，记录含 id/title/date/time/champion/totalGroups/totalScore/groups/schemaVersion 和 `clearedData`。后者含完整小组、回合、道具全局、点名池、临时字段摘要与撤销历史。归档以原 API 构建快照，主流程检查明确的 `{ok,error}` 结果；不截断旧档案。CSV 按分区导出并包含原始 JSON 快照；用户字符串的表格公式前缀被加单引号，数值负分保留数值语义。CSV 目前是查看格式，不能直接作为课堂 JSON 导入。

## 写入和失败

主快照单 key 原子写入、字符串回读一致性校验。成功后镜像旧 groups/picker/itemGlobal/history 与设置键；兼容副本失败显示提示，并在返回值给出 key 列表。其他历史功能尚有直接写旧键路径，未实现所有状态操作的统一事务。关闭页面不保证浏览器一定触发 pagehide，关键命令即时保存。

存储配额、安全限制、损坏 JSON 都应保留原存储。读取主快照失败禁止自动覆盖并显示恢复提示；不调用 localStorage.clear。导入先校验，再修改隔离副本，主存档写失败恢复内存。不要通过删键“修复”兼容性。

## 备份和恢复

正式使用前，分别导出课堂 JSON、需要保留的封神榜 CSV、音频 BIN、图标包。JSON 备份包含当前课堂、撤销节点和设置，**不包含全部历史封神榜、IndexedDB 音频、壁纸和按钮图标库**。文件改名、浏览器／配置目录／协议／HTTP端口变化可能改变存储来源；请先导出再迁移。不要把“主存档”误称为全应用备份。

回滚旧版前先导出新版 JSON；旧键镜像尽力兼容 V2.18.13，但旧版无法理解新回合 envelope，不能承诺同一浏览器来回切换不丢会话状态。恢复损坏主存档的完整交互工具仍待 GP-016；原始 JSON 应先在浏览器开发工具导出，不直接删除。

## V2.18.15 保存不可用策略

读取存储被拒绝与 JSON 损坏分开处理，不把 iOS 存储限制误报成损坏存档。普通选项、加分、判题和道具在 RAM 中继续；保存失败不会伪报已持久化，页面持续显示警告，导出包含当前真实积分和历史。恢复保存能力后可再次保存并自动移除警告。业务计算失败仍回滚；导入及最终归档保留严格保存失败回滚，不能在归档失败时清零。内存模式无法保证刷新或关闭后的恢复。
