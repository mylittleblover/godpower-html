# V3迁移与架构阶段验收（开发中）

日期：2026-10-19；HTML基线2ba6bed；当前开发版本3.0.2。该报告只验收已完成的基础阶段，不代表整个V3或60项成就已完成。

## 本阶段行为

- 领域、应用、基础设施、界面职责分目录；脚本加载顺序仍由单文件模板明确表达。
- Schema1/旧镜像安全复制到Schema2，原键保留；损坏主存档不静默覆盖，明确导入恢复先保存损坏原文。
- 旧音频迁移只补目标缺失项、事务完成并逐字节读回后写v2标记；失败无半份声音/完成标记，可重试。
- 命令提交与表现错误分离，界面失败不再回滚已经保存的数据；身份降级生成不消费课堂随机数。
- 实现事务仓库与完整来源SHA-256预检，真实浏览器证明状态、档案、媒体和回执可原子导入。尚未切换生产权威，异步命令入口及来源冻结仍待实施。

## 实际测试

| 检查 | 结果 | 证据/范围 |
|---|---|---|
| Node单元与集成 | PASS，160/160 | artifacts/v3-migration/unit-integration.log |
| Chromium核心业务 | PASS，117/117；page errors=[] | core-browser-results.json；只用1920×1080、1× |
| 配置道具与抽取 | PASS，448个种子场景 | item-modules.log |
| 26道具规则oracle | PASS，26/26 | rule-oracles.json；不等于新成就26项已实现 |
| 迁移专项 | PASS | 旧档14组、刷新、配额失败、损坏恢复、默认设置、事务去重/冲突/回滚、媒体字节、来源hash与变更 |
| 异步防御命令 | PASS | defense-command.log；取消/替换/导入/拒绝/配额/刷新等情形 |
| 构建/语法/层边界/版本 | PASS | 27个原内嵌资源原文保留；无外部script/link依赖；75段脚本解析 |
| 格式检查 | PASS | domain/application/infrastructure及既有指定界面/核心文件 |
| file://直接打开 | BLOCKED | 受管Chromium ERR_BLOCKED_BY_ADMINISTRATOR；不计PASS |
| Windows真机 | NOT TESTED | Linux浏览器及Electron不能代替 |
| CircleCI | NOT RUN | 按用户要求未操作 |

早期稳定身份刷新测试在并行浏览器负载下出现一次30秒超时；未削弱断言，单独重跑通过。实际新UI截图见 artifacts/v3-migration/screenshots；本阶段不改变CSS或比赛卡片几何。Electron同步后的14组验收另记。

## 规模观测

| 指标 | 基线 | 当前 |
|---|---:|---:|
| JS文件 | 66 | 74 |
| JS源码字节（不含CSS/资源） | 748825 | 808472 |
| JS行数 | 18177 | 20106 |
| 单文件HTML字节 | 7877864 | 7937655 |
| legacyUseItem定义/赋值 | 14 | 14 |
| legacyJudgeRound定义/赋值 | 5 | 5 |
| useItem/renderAll/renderGrid/saveState | 各1 | 各1 |

新增迁移、校验和测试接口使代码增加；未用删行作为成功指标。旧道具/判题包装链仍是明确的下一阶段债务。性能与大资源容量尚未测量，不捏造指标。

## 后续顺序

先完成来源冻结、迁移协调和异步事务命令；再提取计分/排名及道具规则，之后推进教师/教室/名册隔离与成就运行时。详见 MAINTENANCE_BACKLOG 的V3-M01～M06，以及v3/IMPLEMENTATION_LOG.md。
