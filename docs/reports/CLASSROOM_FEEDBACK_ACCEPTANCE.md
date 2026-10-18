# 课堂反馈、随机音效与设置一致性验收

2026-10-18；起点 `9d449780731f6ae78ef9f49dc6475a16fe3adc04`，分支 `feat/shared-score-slots-cinematic-feedback`。第一阶段实现提交 `42acc4a`，候选音效实现提交 `4d68f56`；最终提交以 Git 记录为准。

最终单文件 `dist/godpower.html`：7,763,783 bytes，SHA-256 `fb805cd1c5c07de0ccce88488c34b44eee711f3cb9223d62eefbaa440e74b500`。`dist/index.html` 内容相同；原 27 个内嵌资源保留。基线 7,734,493 bytes，本轮增加 29,290 bytes。模块清单 83 块、脚本 55 块。Node v24.19.0，Playwright 1.56.1，Chromium 154.0.8037.57 built on Debian GNU/Linux 13 (trixie)，Linux 无头模式。仅 Chromium，无 CircleCI 操作。

## 实际交付

- 五个自由赋分窗口共用六槽，设置可修改并同步，保留自定义输入及原锁定、赋分与撤销。
- 真正纵向转轮与 1000ms 非线性减速接续，实际随机赢家仍由原业务决定；学号和小组色保留。
- 姓名全屏揭晓、绿色加分及红色扣分，独立开关、双风格、时长、简洁及减少动态效果；关闭和状态恢复清理生命周期。
- 全按钮自定义点击声、事件去重、独立音量及单声部；41 活动槽自定义路径审查。修复上传串槽和落盘前误报成功。
- 41 槽支持批量追加候选、逐项移除和随机播放。26 道具、普通操作及抽取循环共用选择器。crypto 与业务随机数隔离；BIN 可往返旧主音效及候选。
- 课堂行为两卡共用组件、等高及一致开关；“就是你”去除感叹号；三类演出跳过按钮固定右下角。

主要修改：src/ui/classroom-feedback.js、css；src/ui/desktop.js、css；src/ui/welcome-v2.css；src/script/00.js、09.js、36.js；src/index.template.html、manifest；package.json；新增测试、审查及维护文档。详情见 CLASSROOM_FEEDBACK.md、AUDIO_AUDIT.md、DATA_SCHEMA.md。

## 最终产物实际测试

| 范围 | 结果 | 证据（artifacts/classroom-feedback 下） |
|---|---|---|
| 六槽、赋分、转轮及全屏 | 15 PASS | results.json |
| 文件上传与按钮音效 | 6 PASS | audio-results.json |
| 多音效随机候选 | 6 PASS | multiple-audio-results.json |
| 真实刷新与损坏配置 | 2 PASS | restore-results.json |
| 三尺寸 × 三页面缩放全屏边界 | 9 PASS | fullscreen-zoom.json |
| 三尺寸 × 三页面缩放设置对齐、跳过位置 | 9 PASS，另检查键盘开关及三演出入口 | settings-behavior-results.json |
| 修改前后 14 小组布局 | 3 PASS | layout/battle-14-comparison.json |
| HTTP 断网后运行、答对加分、归档 CSV、主要窗口 | 4 PASS | captured/artifacts/desktop-ui/release-smoke.json |
| Node 单元/集成 | 94 PASS / 0 FAIL | logs/gp-multi-release-unit.log |
| 构建、语法、资源完整性 | PASS | logs/gp-multi-release-build.log、check.log |

多音效专项包括真实 WAV 文件选择器、多文件追加、随机选择边界及实际 BufferSource 播放、26 道具逐槽及循环路径、真实刷新、BIN 导出/导入、单项删除和还原事务中止。41 槽注入播放验证不能代替全部业务组合及真实耳听。

第一阶段另执行核心业务 117、26 道具数值预言机 26、加分存储 3、异步防御 10、按人赋分 1，共 157 PASS；动效旧测试 18 PASS。这些在最终候选音效和设置调整前执行，**不计作最终字节产物重新执行**。证据位于 captured 与 logs/gp-cinematic-business.log、gp-cinematic-motion-final.log。本轮未重新执行整个 test:ui 或远端 CI。

## 14 小组与 UI

用户真实课堂配置不可读取；基线为隔离合成配置，双列模式、垫片 120，与同一基线提交和测试数据比较，不能宣称完全复现用户设备。没有改变比赛卡片排列、外部尺寸或工具栏高度。

| 视口 | 页面缩放 | 卡片 x/y/宽/高最大差值 | 结果 |
|---|---|---|---|
| 1366×768 | 0.8 | 0px | PASS |
| 1920×1080 | 1 | 0px | PASS |
| 2560×1440 | 1 | 0px | PASS |

截图：settings-behavior-1366/1920/2560.png、settings-full-*、settings-slots-*、picked-individual/group/two_tier.png、score-group/modal/hand.png、multiple-audio-settings.png、skip-gpIntro.png、skip-grandModalOverlay.png，以及 layout/before、after。实际查看设置对齐、候选管理和揭晓截图；截图生成不替代断言。

## 失败及复核

保留首次失败日志和 first-run JSON：旧举手渲染器并非实际所有者，修复最新 36.js；旧转轮测试定位隐藏文字，改为断言真实可见条且保留学号断言；固定毫秒取样受负载影响，改为等待真实 transform 改变；音频静音等待 AudioParam 生效。多音效脚本的导航等待与未展开设置截图引起测试失败，改为正确处理文件选择器、等待 DOMContentLoaded、展开实际设置分组，保留播放与持久化断言。最终上述相关测试重跑通过，未删除业务断言。

## 数据、离线及限制

- 存量课堂数据、计分、道具和历史格式不改。界面偏好独立版本化键；音频保持原 sounds 表与主键，候选为独立记录，BIN 索引仅增加可选 name。
- 所有测试使用隔离浏览器，未清除真实数据。存储失败保留课堂会话及原已保存音频，明确提示未保存；损坏音频不替换旧解码资源。
- HTTP 页面断网后实际导航、正确加分及 CSV 导出通过，无外部运行请求。file:// 在此环境被浏览器 ERR_BLOCKED_BY_ADMINISTRATOR 阻止，状态 BLOCKED；不记离线直开通过。
- .8/1/1.25 是应用页面缩放；原生浏览器工具栏缩放 NOT TESTED。
- 真实音箱听感、音乐节拍/过门、设备切换、长期内存和数百个长候选文件压力 NOT TESTED。不得依据路径测试声称听感正常。
- Firefox/WebKit 不执行；CircleCI 不执行。全项目穷尽 UI、全部道具业务组合并非本轮完成范围。

## 后续维护

CF-001/002/003/005/006 已完成；优先 CF-004 真实设备耳听。随后补长音频候选容量及长时间内存数据、实际课堂配置的 14 组基线、允许 file:// 的桌面环境验证。按 MAINTENANCE_GUIDE.md 维护现有遗留治理任务，不能以此次 UI 工作关闭尚未验证的架构债务。

Sites 使用原站点与原 owner-private 权限；发布的确切提交由最终 Git 与 Sites 版本记录关联，不在未经部署时预先声称发布成功。
