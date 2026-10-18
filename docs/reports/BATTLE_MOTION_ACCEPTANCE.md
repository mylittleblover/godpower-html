# 比赛连贯动画与分功能声音验收

日期 2026-10-18。基线 `bf627e4f79ee9fdfe3e1d8ca231be751b1839dc3`，独立分支 `feat/battle-motion-action-sounds`。实现提交 `e841201`；源码和本报告使用可回滚提交，最终提交见 Git 历史。

单文件 `dist/godpower.html` 与 `dist/index.html`：7,779,851 bytes，SHA-256 `49bb44578759b6e5f73dd7c148d7e6d7236c96a9d241a3c043bb5087c2a259ab`；基线 7,763,783 bytes，增加 16,068 bytes。57 脚本块、86 源码块、原 27 内嵌资源完整。无远程运行依赖。

环境：Chromium 154.0.8037.57 built on Debian GNU/Linux 13 (trixie)，Playwright 1.56.1，Node v24.19.0，Linux 无头 Chromium。仅 Chromium；不执行 Firefox/WebKit 或 CircleCI。

## 实施与根因

1. 道具分数幽灵层写死深绿色，并把缩放后的 rect 像素用于 CSS 最小尺寸。改为小组颜色和右锚点，取消尺寸锁，会话重绘按已过时间继续；结束与撤销清理旧提交。普通插值 950ms；分差 1050ms；交接 920ms。
2. 全局抽取增加 380ms 入场、内容交错、900ms 结果停留、620ms 淡出。清除 reveal 填充动画后才退出，否则 opacity 退出会被覆盖。结果落入库存后，先在遮层下刷新槽位；背景亮度随退出恢复，避免最后闪出图标。重绘挂回同一节点及抽取/淡出类。
3. 举手单组抽取及结果面板加入 380ms 渐入，实际奖励仍只提交一次。
4. 实际发动、受击、防御与治疗所有者调用 BattleMotion 独立层；1700ms 时长，末段约 600ms 淡出。保留道具图像、名称，按攻击/增益族区分形状及颜色，不在卡片根节点做 transform。持续光环使用 2.8s 透明度呼吸。
5. 跳过确认当前已提交的视觉快照，后续重绘不回放旧队列变更；新的实际变更仍播放。离页、隐藏、设置及撤销清理表现，不改变业务结果。
6. 22 个独立按钮意图槽，基础音效七分类，总计 63 活动自定义槽。复用多音效候选、随机选一、BIN；无独立文件时继承旧 ui_click。试听单独标记，防止被捕获阶段的点击声及去重门禁吞掉，关闭日常按钮声音仍可试听。

修改源码：core/action-sounds.js，ui/battle-motion.js/css，ui/desktop.js，ui/classroom-feedback.js，script/00/01/09/16/31.js，style/00/01/04/18.css，模板与 manifest。业务规则模块未重写。新增动作分类单元测试、比赛动效 E2E；旧交互取消断言增加新视觉层，未删除断言。

## 实际测试

| 范围 | 结果 | 证据 |
|---|---|---|
| Node 单元/集成 | 97 PASS，0 FAIL | logs/gp-battle-delivery-unit.log |
| 当前单文件业务回归 | 117 PASS，0 FAIL | captured/artifacts/browser-results.json；delivery-core.log |
| 当前单文件 26 道具数值、库存、All In 预言机 | 26 PASS | captured/artifacts/rule-oracles.json；delivery-rules.log |
| 当前单文件动效专项 | 8 PASS | results.json |
| 窗口、26 道具表现及取消补充交互 | 21 PASS | captured/artifacts/desktop-ui/interactions.json；最后举手入场补充前执行 |
| 三模式抽取、六槽赋分及 63 槽路径 | 15 PASS | captured/artifacts/classroom-feedback/results.json；最后抽取底层衔接补充前执行 |
| WAV 上传、失败回滚、鼠标/键盘及静音 | 6 PASS | captured/artifacts/classroom-feedback/audio-results.json；最后抽取衔接补充前执行 |
| 多候选实际上传、随机播放、BIN、刷新、删除失败 | 6 PASS | captured/artifacts/classroom-feedback/multiple-audio-results.json；最后抽取衔接补充前执行 |
| 当前单文件 14 小组布局 | 3 PASS | layout/battle-14-comparison.json |
| 当前单文件 HTTP 断网、正确答题加分、归档 CSV、主要窗口 | 4 PASS | captured/artifacts/desktop-ui/release-smoke.json |
| 重建、脚本/清单/资源完整性 | PASS | delivery-build/check.log |

专项对真实 WAAPI/CSS 动画取中间帧与透明度，断言 26 道具反馈层重绘后存在、1700ms 末段仍在淡出；三应用缩放下分数颜色、幽灵右锚点、结束右边界误差小于 1px；实际全局/举手抽取只入库一次；实际撤销及连续改分无旧数字提交；真实鼠标点击和试听正确使用目标缓冲。

操作音效清单有 63 槽，全部有上传入口并能使用注入资源。测试不等于每个道具的所有攻击、防御组合都逐次耳听。不同实体但同一操作类别的按钮共用对应意图槽，未知按钮保留通用回退。

阶段音频/交互产物哈希与最终单文件分开记录于 release-metadata.json；不能把它们当作最后字节产物的整套重新执行。

## 14 小组及截图

合成测试场景：双列、垫片 120、相同种子数据、长组名、大积分、负积分、主次道具、持续状态、选项和 All In。教师实际配置不可读取，未声称完全复现其设备。

| 视口 | 页面缩放 | 卡片 x/y/宽/高最大差值 | 结果 |
|---|---|---|---|
| 1366×768 | 0.8 | 0px | PASS |
| 1920×1080 | 1 | 0px | PASS |
| 2560×1440 | 1 | 0px | PASS |

截图位于 artifacts/battle-motion：draw-enter/reveal/fade.png、hand-draw-reveal.png、item-defense.png、audio-categories.png、layout/before 与 after；captured/artifacts/desktop-ui 下保留 10 个代表道具截图及原交互截图；captured/artifacts/screenshots/chromium 下有三尺寸五页及主要窗口。已实际查看抽取淡出、道具反馈及音效分类截图，截图生成不等于全部功能通过。

## 失败记录及处置

保留初次结果、skip-red-results.json、preview-red-results.json、frame-sampling-first-run.json 与所有日志。

- 测试最初调用不存在的 setPreferences，改为操作真实设置控件；布局取样等待已有入场结束。
- 已写断言证明取消后一次已提交库存变化会重新触发层：1 !== 0。修复为取消时确认快照，再验证下一次新事件仍会出现。
- 已写真实试听断言证明关闭日常声音后目标缓冲不播放，修复试听事件路径后重跑通过。
- 原测试跨多个 RPC 寻找不足一秒的幽灵/淡出节点，在并行截图负载下节点已结束。改为在同一浏览器任务采样数字，并在真实 fadeDraw 回调采样实际动画后验证库存/清理；没有降低透明度、颜色或业务断言。
- 实测重绘能挂回遮层但没有抽取类，已补齐类恢复，并在结果揭晓时断言槽位已更新。

## 性能和限制

核心回归中的 20/50/100 回合真实样本：`[{"round": 20, "scores": [140, 180, 220, 260], "history": 20, "nodes": 2180}, {"round": 50, "scores": [200, 240, 280, 320], "history": 40, "nodes": 2180}, {"round": 100, "scores": [300, 340, 380, 420], "history": 40, "nodes": 2180}]`。完整原始文件保存在 captured；此为本环境观测，不是严格性能基准或长时间内存结论。

file:// 仍被当前浏览器 ERR_BLOCKED_BY_ADMINISTRATOR 阻止，记 BLOCKED；HTTP 断网运行实际通过。页面 .8/1/1.25 缩放不是原生浏览器工具栏缩放，后者 NOT TESTED。真实音箱听感、低配机器长期表现及教师实际 14 组配置仍需 BM-005/CF-004 人工验收。上传或删除后声音分类的展开状态尚未保持，记录 BM-006（P2），文件保存及播放不受影响。动画不负责决定分数、道具获取或归档成功。

本轮没有运行 CircleCI、没有改分享范围、没有删除真实数据。发布到原 owner-private Sites 的确切提交由最终 Git 与 Sites 记录关联；本报告生成时不预先声称部署成功。

## 后续

BM-001～004 已完成；优先 BM-005 实际课堂设备验收，以及保留旧 CSS/包装器的逐项调用证据审查。后续新增反馈复用 BattleMotion，按钮复用 ActionSounds；不得再叠加全局函数覆盖链或以动画决定业务结果。
