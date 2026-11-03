# 存档与头像：开发验收检查点

2026-11-03，feat/save-document-avatars。本报告是阶段检查点，开发版本提升至3.0.69，尚未发布Windows新包，未宣称ZIP所有后续功能完成。

## 已接入

当前存档使用SaveSession与SaveRepository，浏览器IDB或Electron受控磁盘仓库为唯一权威；旧localStorage只是兼容缓存。设置直接展示当前档案的学生与小组，支持新增/编辑、可视化分组、个人/小组头像、按文件名唯一匹配批量头像、完整头像包导入导出、切档、复制、重命名和新建课堂。新课堂初始化一个空组，保持原内核最少一组的校验约束。

小组详情不再通过文本框批量输入成员，转向学生池选择。姓名/分组编辑记录撤销前快照，新增历史包含规范名单；旧历史只提供旧成员标签，不能据此声称能证明过去的学生永久身份。

全局偏好独立保存，不在切档时套用另一个课堂的历史音量/布局。归档先等待真实确认，清零后再次等待保存确认；失败保留/恢复原课堂。桌面IPC加入当前存档上下文，切档需隔离旧请求；其最终桌面联调仍待执行。

## 实际证据

| 项目 | 状态 | 证据 |
|---|---|---|
| 全量单元/集成388项 | PASS | artifacts/save-document-v2/all-unit.log |
| build/check/format:check | PASS | 同目录build/check/format-all日志 |
| 真实IDB事务、CAS、幂等、跨档代次、失败回滚 | PASS | repository-result.json及session-green.log |
| 设置新增学生、刷新恢复、头像上传/去重导出 | PASS | tests/e2e/save-workspace.mjs、artifacts/save-workspace |
| 非首位学生点名头像 | PASS | avatar-index-red/green，修复把绝对成员索引误当同名次数的问题 |
| 14组布局、正常判题持久化 | PASS | save-workspace专项、battle14-dom.json与截图 |
| 归档写入失败不清零、成功归档再清零 | PASS | save-workspace专项真实IDB事务中断注入 |
| 两份实际文件：14组/56人/40历史/19头像 | PASS | private-migration-summary.json、private-ui-summary.json |
| 原文哈希不变、逐字段回环、原生仓库关闭重开 | PASS | 上述摘要；原始私有文件未入Git |
| 独立仓库/IPC前一检查点Electron21场景 | PASS | Electron artifacts/save-library-native |
| 本轮默认权威切换后的Electron完整场景 | NOT TESTED | 待同步已提交HTML后执行 |
| 新版file://及Windows物理设备 | NOT TESTED | 待最终验证；不以HTTP或Linux代替 |

公开截图只使用模拟数据。实际姓名/照片及原文、映射、迁移回执和完整新包均在/workspace/attachments/save-avatar-staging及原始下载目录，不进公开仓库。

## 尚待处理

1. 默认新存档切换后的Electron验证、受控原文读取、跨存档IPC代次及退出队列回归。
2. 旧名单工作区多教师/班级的独立迁移：现有原始键仍保留，当前版本只迁移实际比赛成员；不把外部同名名单强行合并。
3. 检查异步保存期间遗留设置/管理入口，避免把pending当成功或丢弃待保存偏好。
4. 最终版本号提升、双仓同步、离线验证、打包、Drive迁移文件交付。
5. 完成原ZIP其余M3–M7及用户多次道具规则，详见执行台账，不以本阶段报告替代这些任务。

## 独立审查处置

- 启动读取失败禁止回退写旧档；实际隔离IDB索引损坏测试证明命令与保存都被拦截，修复索引后可重试读取。
- 删除档案确认捕获saveId/generation/记录ID/内容指纹及权限；确认期间切档或重新锁定均取消。VM回归PASS。
- 新格式补齐archives、roster revision、比赛元数据、成就/配置字段验证； malformed V2在发布前拒绝。
- 头像文件选择在打开选择器时绑定存档代次，处理图片时再次检查；复制存档共享学生UID也不能错填。
- 保存期间偏好修改延后合并保存，实际浏览器0.85→0.37回归先失败后通过。
- 新增退出flush握手，等待renderer预处理、命令确认、偏好与磁盘队列；服务与Windows退出协调单元PASS，最终真实Electron退出待同步验证。

不改变既有retainOnPersistenceFailure语义：普通答题保存失败仍可保留本页结果并明确persisted:false/导出警告；这不算持久化成功。归档、清零及导入必须等待可靠ACK。
