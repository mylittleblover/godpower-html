# F2 课程表与学科资源设计

状态：按用户“未确定方案按推荐推进”的指示执行。  
范围：在已完成的本地课堂名单基础上，补充离线课程表与安全的学科资源库；本文件不授权更改比赛规则或权威存储。

## 目标与非目标

目标是让教师在离线桌面/浏览器应用里维护每周课程安排，查看当日课堂建议，并按学科、课堂和标签整理本地教学文件；所有写入可校验、可导出、失败时保留旧数据。

此阶段不做云同步、自动开赛、根据时钟自动替换 `state.groups`、插件脚本执行、远程资源检索、AI 上传、学生成绩写入，也不改变现有 `godpower_state_v2`、旧音频数据库或历史档案格式。

## 推荐决策

1. 课程安排使用本地 `godpower_teaching_schedule_v1`，按稳定 `classroomId` 关联名单库。每项包括星期、时段编号、开始/结束分钟、学科和可选备注。时间使用本机课堂所在时区；不持久化 UTC 偏移。
2. 同一天、同一 profile 的时段不能重叠；跨午夜安排不允许。错误或重叠输入在保存前拒绝。
3. “今日课堂”只显示当前时间命中的建议，不自动切换，不影响比赛。教师显式点选后只切换本地教学上下文；比赛数据映射/导入仍需单独的事务功能。
4. 资源保存在独立 IndexedDB 数据库 `godpower_teaching_resources_v1`，元数据与 Blob 同记录；名单、比赛、插件和资源各自隔离。元数据包括稳定 ID、profile/classroom、subject、title、tags、原始文件名、MIME、字节数、SHA-256、导入时间及 schemaVersion。
5. 第一阶段接受 PDF、纯文本、JSON、PNG、JPEG、WebP。拒绝 HTML、SVG、JavaScript、可执行文件、宏文档、未知 MIME 和 MIME/扩展名不一致。单文件上限 20 MiB；不设虚假的总容量保证，保存前检查浏览器 `navigator.storage.estimate()`（若可用），写后读回；浏览器实际配额错误必须原样显示并保留原数据。
6. 资源搜索只查元数据。预览使用文本节点显示 TXT/JSON、Blob URL 显示 PNG/JPEG/WebP；PDF 显示元信息并允许本地下载，本阶段不把任意 PDF 内容注入页面 DOM。对象 URL 在关闭预览时撤销。
7. 每个资源支持下载、导出包、删除（确认）。资源仓库可按 profile/classroom 过滤。资源导入失败不提交部分列表；导出包括元数据和原始 Blob，重复 SHA-256 可提示重复而不覆盖。
8. 所有功能在本地运行，无 CDN/API/本地服务器依赖；Electron 复用 Chromium IndexedDB，主进程不开放文件系统或数据库给页面。

## 模块边界

- `src/domain/teaching-schedule.js`：纯数据校验、时间冲突检测、今日命中计算。
- `src/infrastructure/teaching-schedule-repository.js`：版本化本地仓库、CAS、读回与失败恢复。
- `src/domain/teaching-resource.js`：扩展名/MIME/大小/元数据校验、标签规范化。
- `src/infrastructure/teaching-resource-repository.js`：独立 IndexedDB Blob 存储、摘要去重、读取/删除/导出。
- `src/ui/teaching-workspace.js`：课程表与资源库 UI；输入通过 textContent/安全 DOM API 渲染。
- 主程序只提供当前本地 profile/课堂选择和受控文件输入；不授予任意文件路径或原生权限。

## 数据兼容与恢复

V1名单格式及旧 `groups[].members` 不迁移、不删除。课程表与资源以新版本化命名空间增量添加。不存在资源数据库不视为错误；数据库损坏或配额错误不得回退到 `localStorage.clear()`。删除资源前确认其元数据和二进制可以从导出包恢复；任何打包导入先完整校验，再一次性写入并逐条读回，不允许部分成功伪装成全部成功。

## 验收

- 课程表：空安排、多个 profile/classroom、同一日重叠、边界时刻、跨午夜、刷新恢复、显式选择与不自动改写比赛状态。
- 资源：六类允许格式、拒绝主动内容和类型伪装、精确 SHA、同内容去重、搜索/过滤、文本/图像预览、PDF信息预览、下载、删除确认、导入坏包回滚、存储不可用/配额失败。
- 在隔离浏览器存储下使用 Chromium 1920×1080 @1x；页面控制台零新增错误。Electron 再做 smoke 和桌面一致性。
- 不执行 CircleCI，不测试 Firefox；Windows 原生运行没有实际环境时写 NOT TESTED。

## 已知阶段依赖

名单工作区已建立 profile/classroom/student 模型，但“应用到比赛”仍开放问题 F1-001。F2 的课程日程仅管理教学上下文，不绕开 F1-001。头像与资源共享同一资产策略，但暂不迁移既有头像数据。
