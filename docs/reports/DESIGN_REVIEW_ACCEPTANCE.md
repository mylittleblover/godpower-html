# 设计与动画整改验收（2026-10-18）

基线：68dc7052fb694d1dd715f697ac843fd6dd9211aa；分支fix/ui-design-motion-audit；源码修复提交ac96871、f482983、d672672。项目实际版本V2.19.0。保留青绿珊瑚风格、单文件、26道具、业务与存储语义。未运行CircleCI、Firefox或WebKit。

## 最终交付与范围

用户最终要求：后续仅桌面Chromium、1920×1080、1×（应用100%、DPR1）。最终设计脚本显式设置该范围，设置/弹窗/14组专项默认也已收敛。不把此前三尺寸结果重复运行。旧test:ui/test:welcome等仍含历史矩阵，日常使用test:design，后续统一入口登记DS-005。

发行文件：dist/godpower.html及内容相同的dist/index.html；7,778,553字节；SHA256 `e98bf50049b075e821465013a736d96fcd1931dd8335cb351794473b23be55ba`。55脚本块语法通过，84源码块与manifest一致，27个原始内嵌资源完整。无新增联网依赖。

## 已修复

- 首页排名限高336px、键盘可滚动，表头五列与内容对齐；全部小组仍保留。
- 辅助文字、时钟日期、警告/All In/珊瑚按钮对比度改善，九对语义配色全部≥4.5:1。
- 学生筛选标签列、输入与说明对齐，长组名省略并保留完整title，学号保留小组颜色；前景色按真实对比度选择，216色样测试。
- 六快捷赋分槽改为浅底深色，确认按钮保留主操作层级，不改六值或赋分语义。
- 窗口关闭从当前opacity/translate/scale退出，避免中断入场跳变；面板与遮罩同周期淡出，原生dialog淡出::backdrop，清理句柄及inert。
- 设置分类标题前置、音效卡片统一间距、原生开关命中完整轨道；保存时机和配置键不变。

变更所有者：src/style/00.css、02.css、20.css；src/script/00.js、36.js；src/ui/welcome-v2.css/js、application-surfaces.css、classroom-feedback.css/js、desktop.css/js；src/template.html及对应测试。没有新增全局业务包装链。设计依据：本地refactoring-ui、emil-design-eng、animate技能；沿用现有变量与WAAPI。

## 最终文件实际验证

|项目|状态|证据|
|---|---|---|
|Node单元/集成|PASS，114项|delivery-unit.log，新增3项文字对比度用例|
|设计功能回归|PASS，9项|regressions.json；包含键盘滚动、对齐、中断关闭、原生遮罩及设置标题|
|五页、八类设置、重要窗口/子状态、空状态、启动|PASS，47次渲染检查|delivery-1920/inventory.json及47张截图；仅断言溢出、窗口边界、脚本错误，不代表所有功能已测试|
|14小组几何对照|PASS，1920×1080、1×|delivery-layout/battle-14-comparison.json、before/after截图|
|HTTP加载后断网运行与实际答对计分|PASS|delivery-offline.json，第1项|
|断网弹窗生命周期、实际档案领奖台/并列/CSV、无外部运行请求|PASS，共4项冒烟|delivery-offline.json及delivery-offline.log|
|语法、manifest、资源完整性|PASS|delivery-check.log|
|格式检查|PASS|delivery-format.log|
|file://直开|BLOCKED|captured/artifacts/browser-results.json：ERR_BLOCKED_BY_ADMINISTRATOR，属于环境限制|
|真实投影、人工听感、原生浏览器UI缩放|NOT TESTED|需要真实设备，不以自动截图替代|

14组对照配置：columnMode=double、顶部垫片120px、zoom=1。逐卡位置、宽高、按钮边界、dock、页面高度均在JSON中比较。确认合成配置能显示14组；`userActualConfigurationVerified=false`，未声称读取用户真实浏览器配置。

## 早期阶段专项（区别于最终文件）

以下JSON与截图已归档在captured/，原有历史产物已恢复，索引captured-index.json记录哈希。它们是本轮早期构建实测，不冒充最终字节对应的完整功能验收：

|专项|实际结果|对应构建|
|---|---|---|
|核心课堂业务|117 PASS|JSON未记录哈希，阶段性结果|
|26道具精确结果|26 PASS|JSON未记录哈希，阶段性结果|
|弹窗几何/焦点/Escape|99 PASS|旧多尺寸矩阵，JSON未记录哈希|
|页面与窗口动作|18 PASS|975ccae4ff1b…|
|首页/退出反馈|25 PASS|975ccae4ff1b…|
|设置功能，包括真实WAV上传、音频包导入导出、题库/口令/名单取消保护|15 PASS|6be28ceff1ca…|
|比赛动画与声音|8 PASS|6be28ceff1ca…|
|早期断网发布冒烟|4 PASS|6be28ceff1ca…|

当前最终文件另有上表4项断网冒烟与9项设计功能测试，不把早期全部规则测试标记为最终构建复跑。用户缩减范围后未再运行旧多尺寸矩阵。

## 失败处理与证据限制

初轮截图发现表头选择器分组和学生搜索说明错列，已增加位置断言并修复。原生伪元素动画改用getAnimations(subtree:true)枚举，保留真实透明度与关闭断言；键盘End改等实际scrollTop变化，避免固定时间误报。设置测试旧类名和30总按钮预期在基线已过时：改稳定ID，并加强为30主音效+30追加入口及逐槽成对验证，没有删功能断言。

整理产物时误删了部分中间截图/日志，包括最初34张设计基线；源码、课堂数据及已另存的专项JSON未受影响。原中间截图不再宣称可下载，最终47张截图、9项回归、114项Node、14组原始/最终截图与4项断网冒烟已重新实际执行生成。当前可追溯视觉基线为delivery-layout/before的基线提交比赛页；不声称其他页面保有完整初始截图基线。

没有进行新的持续内存/主线程性能测量，不捏造指标。只记录实际构建体积及DOM几何；未因设计修改改变26道具参数、计分、历史或存储结构。

## 复验与后续

`npm run build && npm run check && npm test && npm run test:design`。
14组对照：`BATTLE_BASELINE_COMMIT=68dc7052fb694d1dd715f697ac843fd6dd9211aa BATTLE_ARTIFACT_DIR=artifacts/design-review/recheck-layout node tests/e2e/battle-layout.mjs`。
断网冒烟：`node tests/e2e/release-smoke.mjs`。均使用隔离浏览器数据，不接入真实课堂profile。

已完成DS-001～003；后续DS-004人工投影/媒体验收、DS-005统一历史测试范围。其余业务技术债沿用MAINTENANCE_BACKLOG，不因本次UI整改标记完成。Sites保持原owner-private受众，使用精确Git提交打包发布；发布结果在交付消息记录。
