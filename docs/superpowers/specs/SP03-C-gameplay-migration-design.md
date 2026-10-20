# SP03-C：竞技玩法迁移、规则与数据兼容

状态：设计待审；不批准尚未审定的新规则。关联：[总规格](2026-10-20-godpower-v3-plugin-platform-design.md)、[旧规则差异矩阵](competition-rules-difference-matrix.md)。

## 1. 职责边界

主程序拥有稳定身份、教师/学生/小组、班级/会话/赛季、普通答题/积分/排名/All In基础控制、课堂结算、命令事务、历史、持久化与默认UI。宫本茂的力量 official.miyamotos-power拥有道具获取/库存/执行/百科、特殊状态、随机事件、60成就及玩法专属配置/音画。

所有权指实现/配置归属，不是允许插件直接保存成绩。主程序通用存储持有完整事实和插件竞技子状态；插件通过注册规则描述参与唯一命令计算。基础模式不import宫本茂插件，可开始无道具/成就的新赛季。个人正式成绩/荣誉只有稳定StudentId后另验收，小组荣誉不分发给成员。

## 2. 迁移前必须解除的技术前提

当前 CommandLifecycle + legacy-classroom-adapter 仍操作旧 state；TransactionalCommandService/TransactionalRepository尚未成为生产权威。schemaVersion=2课堂、achievementLedger、归档和音频持久化尚有多库/跨键兼容路径，不能直接把玩法拆去私有插件库并同时写两个地方。

先枚举全部写入口（包括小组/成员管理、导入/删除/抽取/设置联动），统一异步命令和读回ACK；完整来源冻结/迁移预检、staging摘要校验、故障恢复通过后才一次切单权威。新插件平台的只读页面/主题可先跑；会写正式竞技的插件规则必须等待此闸门。不是以新SDK绕过遗留写入口。

## 3. 单一命令与规则扩展接口

```text
RuleRegistry.register({id, version, inputSchema, phases, program, limits})
CompetitionService.request(type, validatedIntent, hostContext)
  -> authorize + validate actor/scope/revision + capture before snapshot
  -> bind pinned ruleset + seeded RNG + deterministic host clock
  -> calculate core answer facts + ordered plugin rule plans
  -> validate proposed effects/targets/integers/priority/conflicts
  -> resolve required legacy async defense using epoch-bound decision
  -> recalculate/validate on the same immutable revision
  -> commit aggregate + pluginCompetitiveState + events + RNG + receipt
  -> after ACK publish presentation intents
```

program是版本化、JSON可序列化的声明AST，不是JS回调。首批opcode为selectTargets/readFact/checkCondition/scoreDelta/consumeItem/applyEffect/removeEffect/emitFact；嵌套/循环和操作数有界，不允许eval、DOM、时间读取、Math.random、网络或私有storage写。复杂旧规则先由可信兼容适配器执行，不为迁移强行重写；适配器是宿主暂存技术债，仍检查同一插件权限与规则版本锁，官方插件也不能自行提交任意宿主函数。删除条件是26道具差分和异步防御/撤销/重载证据完整。

HostCommandIntent沿用commandId、aggregateId、actorId、expectedRevision和source。插件身份记provenance {pluginId, packageDigest, ruleId, ruleVersion}，source仍由宿主决定classroom/manual/import/system/test。普通插件请求加分标manual，不能伪装正式答题或触发成就。

RulePlan只提议有上限的 effects[] 与 presentationIntents[]；宿主重验目标存在、作用域、库存、All In/冻结/一题一次、safe integer和规则可用。插件自报ITEM_HIT或DEFENSE_RESOLVED不是事实；宿主根据真实前后变化/防御决定生成正式事件。

## 4. 规则阶段、确定性与历史

固定阶段：validate → target → defense → calculate → postRoundEffects → achievementReduce → persist → presentation。具体旧执行顺序以现有round-settlement和防御测试为准，迁移不得借阶段名改变原有效先后。冲突排序使用阶段/已审优先级/规则ID，避免安装顺序影响业务；相同排他hook多provider时预检拒绝激活。

基础分值仍采用src/domain/competition/rules.js，排序复用ranking.js，攻击/防御优先级复用defense-policy.js与application/item-defense-adapter.js。useItem唯一入口及异步取消/防御token不能退回包装链。

PRNG由宿主持有 {algorithmVersion,seed,state,cursor}；每命令记录采样目的/游标/结果，时间从命令上下文注入。旧Math.random行为通过可注入随机序列做差分，不能声称新种子算法与旧无种子序列完全一致。重放使用当时规则版本和已保存结果，不重新抽取。现有撤销仍操作前快照最多40条，新增子状态/RNG/事件回执均纳入；不是擅自替换成事件重放。

课堂瞬时pending UI不进存档。异步喇叭/刺龟壳确认返回时校验epoch、revision、seasonId、itemInstanceId和库存指纹；过期不消费、不扣分、不颁成就。关闭/导入/撤销使旧请求失效。表示持久化的ACK只有真正确认保存后发出；RAM-only状态不得确认永久解锁。

## 5. 原26道具逐项清单

| key | 现有职责证据 | 迁移验收 |
|---|---|---|
| green | 随机他组、1/4扣分 | 目标/免疫/取整/库存差分 |
| triple_green | 三次绿壳 | 同一itemInstanceId三次及续用限制 |
| red | 紧邻上位、1/3扣分 | 同分顺序、无目标 |
| triple_red | 三次红壳 | 次数/目标变化/队列 |
| spiny | 榜首、1/2扣分 | 冷却、异步喇叭防御 |
| banana | 紧邻下位、1/4扣分 | 防御、末位无目标 |
| triple_banana | 三次香蕉 | 同题续用/次数与ID |
| horn | 相邻目标、1/4及防御 | 主动使用和刺壳防御分别验收 |
| bomb | blast范围、1/4 | 主动/被动路径与多目标 |
| hammer | randomAhead、1/4 | 领先候选和既有不惩罚超车 |
| coin | 自身+2 | 配置倍率和实际增量 |
| coin_shell | aheadInclusive增益 | 正负/并列/参与者 |
| question | behindInclusive增益 | 落后候选及自身 |
| mushroom | 自身比例增益 | 取整和零分边界 |
| triple_mushroom | 三次增益 | 同一实例/次数/撤销 |
| boo | 偷取、无目标替代 | 冻结/库存转移/持续身份 |
| blooper | 遮分120000ms | 计时/重载/撤销/隐私投影 |
| lightning | 所有领先目标 | 防御、真实实际扣分 |
| star | 三次防御状态 | 消耗、既有超车联动 |
| mega | 三次防御且保留 | 库存保留/防御优先级 |
| bullet | threeAhead超车 | 候选不足/排名变化 |
| power | 三回合强力状态 | 两段计分、到期和库存 |
| feather | 自动闪避 | 被动消耗、不能当主动命中 |
| fire_flower | 随机目标1/4 | 每次实例身份及现有攻击限制 |
| ice_flower | randomUnfrozen、冻结 | 三回合旧状态、解除取消使用 |
| boomerang_flower | 相邻上下位1/5 | 双向/免疫/无目标 |

表只作定位摘要，不代替完整规则，具体参数以src/items/catalog.js、operation.js、draw.js、core/item-*及legacy-item-baseline.md为准。迁移每种测试获取、限制、目标、积分、消耗、队列晋升、防御、持续/到期、All In、撤销、重载及视觉事件；不能仅比较blueprint key。

## 6. 设置、百科、动画与主题迁移

godpower_item_modules_v1中的draw(enabled/weight/charges)与operation(enabled/scoreMultiplier/feedback)保留语义和默认值，迁移到插件配置副本后旧键仍保留备份。抽取和执行始终两个独立配置域，不互相借enabled。禁用抽取不应删除库存，禁用执行不应偷改道具平衡。

道具百科、玩法音效/视觉、道具概率/次数等移至插件中心；主设置留下兼容深链并标插件归属。首页每日道具卡直接路由到插件百科，不误进旧设置页。说明读取同版规则投影，不维护相互矛盾手写副本。

音频存储仍由核心ResourceService代理原音频库；现有自定义/多样本随机播放/分类槽、主音量不变。插件只发ITEM_DRAW_START/REVEAL、USE、HIT、DEFENDED、EFFECT_APPLIED/EXPIRED、QUEUE_PROMOTED等表现意图；原UI动画渲染层先复用，避免抽取生硬退出、分数位移/丢色等回归。演出不控制业务结果。点名是基础课堂工具，不归宫本茂插件，不新增RNG。

## 7. 七状态与16自动事件的审查界限

状态注册 {effectId,version,stackPolicy,conflicts,tickBasis,expiryRule,ruleProgram,visualId}；七类为burn/freeze/paralysis/poison/dizziness/invincible/mega。旧star/mega/ice字段需明确映射而不覆盖旧参数；未存在的状态是新能力，未审数值不得开放有效开关。

16种事件以 supplied competition-rules-design为来源，在规则审阅通过后确定稳定ID/效果/权重/触发条件。用户本次明确事件每4～8个有效正式结算回合触发且完全自动；宿主PRNG保存nextTriggerRound，undo同事务恢复。重复判题不累加；导入/手改/历史播放不算有效回合。事件自动选取、判断、执行、记录、展示和到期，不要求领奖点击。

追踪既有候选事件ID：EV01双倍狂欢、EV02黄金时刻、EV03幸运头奖、EV04命运轮盘、EV05道具雨、EV06神秘补给、EV07稀有补给、EV08道具重组、EV09魔法风暴、EV10和平协定、EV11净化之光、EV12混乱磁场、EV13后来居上、EV14王者挑战、EV15追赶之星、EV16幸运交换。名称与来源对应，数值/权重仍为待审候选，不在本规格偷偷确认。

具体事件效果、取整、触发回合影响时机、状态时长及冲突仍受差异矩阵审查；不能把本设计批准解释为批准旧标注的recommended defaults。规划时为这16个各建输入/目标/优先级/expiry/反例和断言表，未审项阻塞规则上线但不阻塞平台本身。

## 8. 60项成就与归档

目录60ID保持不变，ACH-001～012已有判定先差分保留；013～060逐项新增正例、边界与反例，学习/竞技/收藏/战术/荣誉/隐藏六类独立。隐藏未解锁名称/条件只在教师授权模式可看；不能由卡片泄漏。

现有achievementLedger迁移为competitive pluginState内同事务子状态；permanentUnlocks、historicalCounters、seasonCounters、seasonUnlocks、processedEvents、itemDiscovery、itemMastery及groupUid/seasonId保留。数据账本当前字段按实际normalize规则映射，不凭名字造旧数据；只有可靠旧事实补发，不从最终分数猜道具战绩。

事实事件包含唯一eventId、commandId、actor/source、targetUid、itemInstanceId、before/after、实际delta、防御decisionId与effectInstanceId。只有persisted正式事实计数，人工改分重建排名基线，未作答断连对，三重道具不能跨实例拼接。规则失败不能吞异常然后继续颁奖。

课堂可显示待归档荣誉，撤销随快照回退；有效赛季至少4组/5次正式判题后归档成功才确认封神类。seasonId+groupUid+ruleVersion实现幂等，archive和清零/永久计数在同一事务；在迁移前继续旧严格保存屏障，不增加第二次独立“冠军计数写入”。并列荣誉使用竞赛排名，不改变旧UI稳定排序/道具相邻目标算法。正式归档保留规则版本/包摘要/结果，不要求插件仍安装才能查看。

## 9. 停用、更新与恢复

赛季快照保存rulesetLock {pluginId,version,digest,configDigest,interpreterVersion}。进行中的赛季不可热换规则。停用保留库存、持续状态、成就和旧档案；受影响正式结算暂停，默认基础模式只用于新赛季。核心导航、备份、档案查看、资源与日常教学仍可用，不因插件故障白屏。

迁移回执记录源摘要、schema映射、目标摘要、读取端切换、恢复备份和软件版本。中断不删除旧源；生产切换后恢复旧程序需导出兼容转换，不直接拿过期v1源覆盖最新课堂。无法证明等价的旧执行器暂留并登记替代测试条件，禁止仅凭编号删除。

## 10. 验收

沿用tests/e2e/legacy-differential、rules、defense-generation、settlement-command、achievement-command、round-feedback-lifecycle及迁移测试作为旧行为证据来源；未来新增插件差分套件，不以此文档宣称已执行。26道具×关键条件、60成就、7状态、16事件分别有覆盖表，未审规则为BLOCKED/NOT TESTED。故障注入存储满/事务abort/异步拒绝/重复归档；命令原子性、归档失败不清零、永久收藏不双计数必须自动证明。14组使用现有battle14 fixture的1920×1080、zoom=1、double、垫片120px同配置前后测量；该配置是仓库可复现实验基线，不宣称读取了用户真实机器配置。Windows/音频真机听感另列未测。
