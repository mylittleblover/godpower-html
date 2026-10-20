# SP03-A：插件运行环境、SDK 与安全设计

状态：设计已批准；SDK候选1.0.0。基础运行管理已实施，代码沙箱/包签名/Electron broker仍未实施。关联：[总规格](2026-10-20-godpower-v3-plugin-platform-design.md)。实施证据：`docs/ui-audit/M3-plugin-platform-foundation.md`。

## 1. 目标和非目标

实现离线包安装、生命周期、权限、依赖、隔离、版本迁移、服务和受控原生能力。官方/第三方走同一 SDK。此文不批准任意 Node 扩展、二进制原生模块、远端代码加载或在线自动更新；原生扩展是宿主内置的受控 provider，不是安装插件即可获得 DLL 执行权限。

现有命令/仓库和 Electron broker 是端口基础，不是插件 API。preload/desktop.cjs 的点名角色白名单继续独立，不能扩成通用 invoke(channel)。

## 2. Manifest 契约

以下是结构完整的声明性示例，不表示旧玩法已经迁移：

```json
{
  "manifestVersion": 1,
  "id": "official.miyamotos-power",
  "name": {"zh-CN": "宫本茂的力量", "en": "Miyamoto's Power"},
  "description": {"zh-CN": "课堂竞技玩法"},
  "author": {"name": "GodPower Official"},
  "version": "1.0.0",
  "sdk": ">=1.0.0 <2.0.0",
  "types": ["gameplay", "resource"],
  "subjects": [],
  "platforms": ["html", "electron"],
  "entry": {"logic": "logic.js", "views": "views.json", "rules": "rules.json"},
  "permissions": [
    {"capability": "classroom.read", "required": true},
    {"capability": "groups.read", "required": true},
    {"capability": "competition.stats.read", "required": true},
    {"capability": "competition.commands.request", "required": true},
    {"capability": "rules.register", "required": true},
    {"capability": "plugin.storage", "required": true},
    {"capability": "audio.play", "required": false}
  ],
  "dependencies": {},
  "optionalDependencies": {},
  "contributes": {
    "pages": ["encyclopedia", "achievements"],
    "panels": ["inventory"],
    "cards": ["daily-item"],
    "settings": ["draw", "operation", "feedback"],
    "rules": ["legacy-26"],
    "services": ["items.describe"]
  },
  "data": {"schemaVersion": 1, "migrations": [], "downgrade": "restore-backup"},
  "update": {"channel": "manual", "requiresConsentOnPermissionChange": true}
}
```

ID 格式小写反向域名片段，最多120字符；贡献 ID 统一 pluginId/localId，服务使用 pluginId/serviceName。types 枚举 gameplay/subject/theme/tool/resource/native；一个包可多选。平台能力单独按 feature 检测，不能仅凭 electron 声明设备可用。多语言名称必须有 zh-CN 或 en 的默认值。

路径只接受包内相对规范路径，不允许绝对路径、..、空字节、URL、符号链接、重复规范化路径、大小写冲突或解压覆盖。entry 至少一项，必须有对应文件；纯主题允许 entry.theme 指向 JSON，纯内容允许 entry.content。依赖采用范围，安装锁文件记录确切版本和摘要，图必须无必需循环；同一全局安装 ID 同时仅一个活动版本。签名/摘要与来源信任分开；未签名包不能伪装 official 前缀，内置官方清单锁定官方ID与digest。

初始防滥用限额（待规格批准）：压缩包20MiB、解包总计80MiB、单文件16MiB、最多1000文件、嵌套归档拒绝；音频大资源另走 ResourceService 用户导入。检查压缩炸弹、总字节/文件数实际值、JSON深度32，不能只相信 ZIP 目录声明。摘要校验不等于恶意代码安全。

## 3. 生命周期和作用域

安装状态机：absent → validating → installed；失败回 absent 并保留诊断。更新先 staged/validated，完成数据副本迁移和读回后才切换 activeDigest，旧包保留回退版本。installed 不执行代码。

会话状态机：inactive → activating → active ↔ paused → deactivating → inactive；任意活动状态可到 quarantined，显式 restore 后重新校验再激活。卸载从 inactive 开始，最终 absent；激活/更新/卸载同插件串行并检查 expectedRevision。

全局安装记录、教师启用记录、学科启用覆盖、课堂 session 激活记录分离。全局安装绝不代表对所有教师启用。学科配置可明确继承教师开关或显式关闭；会话激活需要依赖、教师/学科允许、必要权限全部满足。切换教师/学科撤销旧 token、取消旧未提交请求、重新计算贡献，不跨 scope 沿用缓存。

生命周期 hooks 为 onActivate/onPause/onResume/onDeactivate/onMigrate，返回显式成功/错误。初始化贡献批次全部验证成功才发布。hook 失败撤销整批新注册，旧版本仍保留。暂停停止新副作用/订阅/音频和后台任务，保留视图快照；已提交事务不可回滚，进行中的提交等回执。

卸载默认保留数据，界面显示包、依赖、保留空间及数据导出。用户明确删除数据才删除该命名空间，不能连带课堂档案中的插件历史数据。被依赖插件的卸载需先停用依赖者；有在途竞技事务或赛季规则锁时不可热卸载/更新：等待事务，赛季锁定包到归档或经审定迁移。

## 4. 权限与宿主强制检查

| capability | 检查与最小约束 |
|---|---|
| classroom.read | 当前已授权 classroom DTO，不含完整存档/口令 |
| students.read / groups.read | 分开授予；默认只读所选班级，姓名是敏感数据 |
| competition.stats.read | 白名单统计字段；隐藏积分效果不被视图绕过 |
| competition.commands.request | 只允许获批命令类型/目标/数值范围；用户确认与业务校验仍生效 |
| rules.register | 只提交声明描述；解释器白名单、版本和复杂度校验 |
| resources.read / resources.write | 按资源句柄、类别、所有者；禁止枚举本机目录 |
| plugin.storage | 自己且当前scope的私有数据；不能指定其他pluginId |
| network.request | 明确HTTPS域名/方法/字节/频率，离线默认无权限 |
| files.open / files.save | 宿主文件选择对话框给一次性句柄，不给路径与任意fs |
| audio.play / audio.capture | 播放与采集分开；主音量/静音/自定义槽均服从宿主 |
| midi.access | 单独申请设备枚举/输入/输出，拒绝后工具降级 |
| camera.capture / microphone.capture | 用户明确操作触发，浏览器/OS拒绝优先 |
| native.device | provider白名单＋按设备子权限，不接受任意IPC/库名 |

所有请求校验：包摘要/激活epoch/teacher和session/permission约束/操作schema/目标revision/限额。更新新增权限需要重新同意；必要权限拒绝仅禁用相关插件/功能并说明原因。撤销先阻止新请求、取消尚未提交操作，再等待既有 durable commit；完成后不能宣称撤销已提交成绩。

本地教师scope隔离防止插件误用和越权，不抵御同一OS用户直接改数据库；本地管理员口令仍是操作门槛而非真实安全身份认证。

## 5. 隔离、通信、配额和错误边界

HTML：插件脚本不在主页面 eval/import。每插件一个 opaque-origin sandbox iframe（allow-scripts，不给allow-same-origin、弹窗、导航、表单/下载能力）。插件逻辑放在该隔离环境创建的 Worker；宿主可terminate，UI只允许触及自己的frame DOM。包内资源由宿主校验后作为句柄/Blob提供。iframe CSP default-src 'none'，仅批准包脚本hash、必要的blob脚本和类型资源；connect-src 'none'，网络必须走宿主代理；代理逐跳重验域名/HTTPS/方法，拒绝回环、内网、link-local与重定向越权，限制响应大小/时长，不附带课堂cookie或宿主凭证。禁止远程脚本、嵌套frame、对象与任意导航。MessageChannel由宿主建立并绑定身份；不用event.origin为null作为认证，不接收任意window.postMessage命令。

HTML隔离frame资源加载和Worker CSP必须在HTTP和file环境分别证明；不能实现安全沙箱时拒绝活动第三方包，保留声明性主题/内容和基础课堂。file平台设备/持久化限制显示明确能力缺失，不静默联网或启动服务器。

Electron：复用协议，但第三方运行器放在每插件独立、sandbox/contextIsolation/webSecurity启用的BrowserWindow，不同隔离partition；其中再使用opaque frame/Worker。主课堂CSP仍frame-src 'none'；新plugin-host页面使用独立有限CSP和专用窄preload。插件本身拿不到宿主preload；主进程绑定webContents/mainFrame/URL/channel/epoch身份，拒绝角色伪造。工具完整窗口可承载插件UI，主页面卡片优先宿主声明性渲染；不在主renderer里放任意第三方HTML。

初始限额：普通读/服务5秒，激活/停用3秒，规则计算100ms加最多10,000解释步骤；超时终止候选计算，不提交。每通道单JSON不超过64KiB，最多8在途、每秒60请求、1000订阅事件缓存上限；超限明确拒绝。私有JSON每scope默认10MiB，资源另默认100MiB，增加配额需教师批准。近1分钟连续3次崩溃/超时隔离插件，撤销其贡献/任务，提供导出日志和显式恢复入口。

浏览器无法可靠强制每frame内存上限或保证UI死循环不影响同进程；不能宣传为完整恶意代码防护。通过Worker执行逻辑、声明式卡片、消息/资源配额减少风险；HTML第三方自定义UI需告知该限制并允许仅声明模式。Electron独立进程崩溃可销毁，不扩大主窗口权限。

统一错误code：INVALID_MANIFEST、INCOMPATIBLE_SDK、DEPENDENCY_MISSING、DEPENDENCY_CYCLE、PERMISSION_DENIED、CAPABILITY_UNAVAILABLE、STALE_ACTIVATION、REVISION_CONFLICT、DUPLICATE_ID_CONFLICT、TIMEOUT、QUOTA_EXCEEDED、PLUGIN_QUARANTINED、RULESET_UNAVAILABLE、MIGRATION_FAILED。日志只记requestId/插件版本/scope摘要/code，默认不记录学生姓名、口令、音频原文。

## 6. Service Registry 与原生代理

registerService(name, semver, inputSchema, outputSchema, permissions)；call(name, range, payload)由宿主解析唯一合格provider，返回只读DTO/资源句柄。required依赖不存在阻止激活；optional缺失返回CAPABILITY_UNAVAILABLE并显示可用降级。调用者和被调用者分别检查权限，绝不把被调用者令牌借给调用者；传学生数据需调用者有授权且provider有接收该scope授权。

每个跨插件调用携带宿主traceId与visited服务栈，最多8层，遇环立即拒绝；超时/停用中断订阅。服务不能返回JS函数、DOM、数据库连接或私有存储路径。provider升级先兼容检查再重绑定；不兼容时暂停调用方相应功能。

数学/物理交换函数AST与采样数据，历史/地理交换GeoJSON资源句柄，语文/历史交换带来源文本，英语/音乐交换audio资源，化学/生物交换分子图。没有共享可写全局对象。

NativeCapabilityBroker只接受预定义provider方法。MIDI、文件、网络、音频采集由宿主执行权限提示与句柄生命周期，窗口关闭撤销设备/文件租约。HTML无provider时等价返回不可用，不引入模拟设备的假成功。

## 7. 存储、更新与恢复

私有记录键：(pluginId, teacherId, subjectId?, classId?, scopeKind, schemaVersion)，明确全局/教师/学科/课堂范围；使用CAS revision。私有笔记/题库与课堂成绩分开；参加正式竞技事务的pluginState进入同一聚合写集，不允许私有storage.write代替成绩事务。

schema升级先只读预检→导出备份→独立副本运行有界迁移→校验全部记录/摘要→写迁移回执→原子切换active版本。中断留旧包/旧数据可用；降级恢复匹配旧包与旧数据副本，不能把新版数据硬塞旧代码。清单声明连续迁移路径，无路径拒绝升级。资源以内容hash去重且所有者引用计数，卸载不误删其他插件资源。

## 8. 验收与失败恢复

覆盖manifest恶意路径/ZIP炸弹/假official、协议伪造/重放/跨scope/权限撤销、缺依赖/环/不兼容SDK、hook超时与死循环、崩溃隔离、文件设备拒绝、离线安装、卸载重装、更新迁移崩溃。每项必须验证课堂存档hash未被失败包改变。涉及写成绩需在途事务/窗口退出/重启重试测试，回执只产生一次业务结果。现阶段以上均NOT TESTED；只完成设计。
