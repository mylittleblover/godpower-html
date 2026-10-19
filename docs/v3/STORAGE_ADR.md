# V3存储与迁移ADR

日期：2026-10-19。状态：事务适配器已实现并隔离验证，生产切换待完成。

## 决定

共享领域/应用服务通过repository port访问数据。当前课堂继续由Schema2 legacy adapter持有唯一权威；新事务实现采用IndexedDB，供HTML与Electron主渲染器共用。Electron辅窗只通过现有IPC发送应用命令，不直接写数据库。

采用IndexedDB的当前证据是：真实Chromium中，聚合、事件、命令去重、档案可同事务提交；中途唯一键/结构化克隆失败不会留下半个课堂；Blob与ArrayBuffer可无损导入；不需要native addon或网络。未执行SQLite性能/ABI对照，不声称已证明SQLite不适合。将来需要主进程数据库时只替换port adapter。

## 迁移协议

1. 保留旧localStorage/IndexedDB来源，读取项目namespace与已知媒体库，不按名称合并教师或小组。
2. 计算来源SHA-256清单；记录原始JSON、原记录、Blob/ArrayBuffer；预检不写来源。
3. 对课堂执行显式Schema1→2转换，保留旧字段与稳定身份映射；损坏权威数据不跳过。
4. 提交前重新核对来源；变化即重新预检。通过同一目标事务写课堂、档案、资源、回执，migrationId幂等。
5. 读回对象数量、业务字段与资源字节/hash，重启后复核。所有验证通过后才能切换权威。
6. 来源冻结、异步命令入口、revision及恢复协调完成前，不默认启用新库，不把两处存储作为可独立修改的权威。
7. 迁移失败保留来源和故障信息；不得自动删除旧库。清理必须成为另一个明确的用户操作。

## 已知代价

保留源与目标会暂时增加存储占用；配额不足必须停止迁移并提供导出。大音频预检目前整批加载，尚需容量/内存测试。IndexedDB的可用性受浏览器/配置目录策略影响；受限环境继续旧课堂RAM+导出路径，不能把未持久化状态称为已保存。

旧v1主存档是迁移时基线；退回旧应用前需从新版本导出并转换，而不能直接读取旧基线当作最新课堂。


### 3.0.7验证日志与恢复

import receipt.complete仅表示原子复制完成。迁移检查使用独立verification.status记录VERIFYING/VERIFIED/DESTINATION_INVALID/STAGED_SOURCE_CHANGED/CANCELLED_STAGED及sourceHash/checkedAt/counts。重启遇VERIFYING须重新完整校验，不能推断成功；重试先使旧VERIFIED失效。只有来源仍一致、资源/档案读回齐全、目标revision仍1，才可记录VERIFIED。此标记仍不授权生产切换；切换时需重新冻结来源及验证。取消晚于日志提交时以已提交结果为准。源数据不删除。
