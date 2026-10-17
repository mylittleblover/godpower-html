# 最新欢迎页分支补齐与验收

本轮基于最新远端 `feat/welcome-intelligent-ui-20261017` 的 `674e12f6b7c29d60b3494bedda874842a68bf8ef`，独立分支 `fix/welcome-v2-completion`。未覆盖旧分支或真实课堂数据。源码/测试冻结提交：`97e4b4c69e701ad22309efaeaae6d9b7764b3231`，最终文档提交另见Git历史。只使用Chromium，未执行CircleCI，未触发远端GitHub Actions。

## 补齐了什么

1. 原分支dist仍是旧版、没有完整运行验收。现在生成包含原品牌SVG的独立HTML，并运行完整verify及桌面截图/14组验收，不把静态检查当通过。
2. 排名直接读取原ranking，同分保持原顺序；全负最高分和领跑正确；回合说明读取Reliability.phase，不再把已结算显示为进行中。顶部条和首页共用只读standings模型，安全整数合计在UI用BigInt转字符串精确呈现；没有改比赛分数类型或持久化。
3. 乌贼生效时，新排名采用原组序、名次显示—、分数/条形/领跑隐藏；恢复统计class并使顶部统计也遵守同一遮蔽时间。状态到期由原时间字段判断，不改道具规则。基线实际观察见baseline-findings.json。
4. 入场真实鼠标部分滑动回弹、完整解锁、End/Enter、Tab循环、Escape、同SVG飞入顶栏。背景inert原值和焦点统一保存恢复；快速解锁、切页、resize、系统减少动态效果、重复重播都收敛到同一清理函数，防止遮罩残留。按既有CSS zoom换算FLIP坐标并实际测量终点。
5. 卡片默认手动浏览，显式按钮/设置可开启巡航；保持原先“不自动滚动妨碍阅读”的约束。偏好立即保存，悬停、焦点、拖动、离页、不可见或减少动效时暂停。排名/动态仅数据变化才重建，不被普通时钟tick打断；巡航开关不清掉题目解析。
6. 原测试仍点旧欢迎弹窗或刷新后直接点底层页面。fixture改为实际点击新“跳过”按钮；没有强制穿透遮罩、删除业务断言或降低积分/库存预期。

核心比赛、道具、All In、历史、存储、原品牌SVG及比赛页尺寸未重写。新增字段仅为既有UI偏好键下groupCruise:boolean，默认false；旧配置无此字段时兼容使用false。滑块只管入场，不改变管理员锁。

## 真实验收

|实际执行的测试|通过数量|证据|
|---|---:|---|
|Node 单元/集成/架构守卫|90|artifacts/welcome-completion/final-verify.log|
|核心业务|117|artifacts/browser-results.json|
|26道具精确结果|26|artifacts/rule-oracles.json|
|真实判题和保存失败|3|artifacts/scoring-persistence-results.json|
|桌面五页UI|31|artifacts/desktop-ui/results.json|
|补充交互和保存恢复|21|artifacts/desktop-ui/interactions.json|
|弹窗矩阵|99|artifacts/desktop-ui/modal-matrix.json|
|V2.18.15布局比较|3|artifacts/desktop-ui/battle-14-comparison.json|
|离线发行冒烟|4|artifacts/desktop-ui/release-smoke.json|
|首页及入场专项|20|artifacts/welcome-completion/results.json|
|最新674e12f布局比较|3|artifacts/welcome-completion/layout/battle-14-comparison.json|
|异步防御命令|30|artifacts/refactor/defense-command.json|
|固定时钟/随机数业务差分（渲染/音效隔离）|464|artifacts/refactor/legacy-differential.json|
|079df31布局比较|3|artifacts/refactor/layout/battle-14-comparison.json|
|20/50/100回合前后观测|6|artifacts/refactor/performance-comparison.json|
|防御令牌兼容保护|10|artifacts/welcome-completion/final-verify.log|
|批量赋分和原子撤销|1|artifacts/welcome-completion/final-verify.log|
|原首页启动/导航回归|1|artifacts/welcome-completion/final-verify.log|


Chromium场景总数 842，包含464个业务状态差分，不能当作全部为独立鼠标端到端测试。Node共90项。完整命令 `npm run verify`；专项 `npm run test:welcome`。各场景结果、控制台错误列表、截图清单与HTML SHA见 `artifacts/welcome-completion/results.json`。基线旧版普通UI测试曾30 PASS/1 FAIL（启动遮罩拦截），详见baseline-ui.log；经真实入口适配后原断言通过。

开发中的失败也保留：首次把词法DesktopUI当作window属性，偏好联动失效，已修正；首次用不存在的合成pointerId调用原生capture，fixture改为真实鼠标取得指针；初始化脚本每次刷新覆盖保存偏好，已改为仅首次播种，保存恢复断言未削弱。first-focused-failures、preference-fixture-failure及focused日志保留。pre-shared-summary-verify.log是公共汇总改动前的中间运行，最终验收只取final-verify与匹配SHA证据。

## 动效实测

|视口|应用CSS zoom|终点X偏差px|Y偏差px|宽度偏差px|
|---|---:|---:|---:|---:|
|1366×768|0.8|0.0000|0.0000|0.0000|
|1366×768|1|0.0000|0.0000|0.0000|
|1366×768|1.25|0.0000|0.0000|0.0000|
|1920×1080|0.8|0.0000|0.0000|0.0000|
|1920×1080|1|0.0000|0.0000|0.0000|
|1920×1080|1.25|0.0000|0.0000|0.0000|
|2560×1440|0.8|0.0000|0.0000|0.0000|
|2560×1440|1|0.0000|0.0000|0.0000|
|2560×1440|1.25|0.0000|0.0000|0.0000|


以上九组合都用真实鼠标拖拽和实际WAAPI渲染，暂停在终点测量后用Escape退出，确认同一个SVG已回到顶栏、动画集合和背景锁均为0。真实完成播放另有键盘流程。关闭动效、简洁动效、系统减少动效及不跟随系统均实际测试。CSS短过渡保留既定时长，FLIP按既有速度偏好调整；这不代表全项目所有旧特效的速度已统一。

截图目录中intro/flip-endpoint为有意保留的入场中间状态，dashboard-14可能捕获页面依次浮现过程；五页常规完成状态同时见artifacts/desktop-ui。已实际查看欢迎页、FLIP终点及1366比赛14组图像，DOM断言用于补充遮挡和尺寸判断。没有将截图生成等同于功能通过。

## 比赛14组保护

BATTLE_14_GROUPS_BASELINE使用原branch源码重建，与修改版在相同Chromium、相同数据、double列模式、120px垫片下对比。含长名称、大积分、负分、主次队列、持续状态、已选答案和All In。

|视口|应用缩放|最后一排底部 旧→新|工具栏顶部 旧→新|文档高度 旧→新|结果|
|---|---:|---|---|---|---|
|1366×768|0.8|535.22 → 535.22|714.41 → 714.41|823 → 823|PASS|
|1920×1080|1|670.38 → 670.38|1013.00 → 1013.00|1126 → 1126|PASS|
|2560×1440|1|551.53 → 551.53|1373.00 → 1373.00|1486 → 1486|PASS|


逐卡位置/宽高、按钮边界、垫片与工具栏完整测量见 `artifacts/welcome-completion/layout/battle-14-comparison.json`，截图在layout/before与after。所有卡片仍在工具栏之上，无新增文档滚动高度；并未声称原页面完全没有任何滚动。**这仍是合成配置，用户实际配置尚未取得，不能标记其真实课堂配置已复现。**

## 发行与离线

- `dist/godpower.html` 与 `dist/index.html` 完全一致，共7688029字节，SHA256 `0b5896a01f47845fc47186dfb36ab2eeb5e0ac693e31e0192e7d6e073a1aa93a`。
- 两次构建一致，见build-reproducibility.json；54段脚本语法有效，全部27个原始Base64资源保留，品牌SVG原始内容内联。资源没有变成CDN或本地服务器依赖。
- 已加载HTTP文档断网后，重播SVG、五页导航、题目解析、正式判题、归档/CSV等代表场景通过；file://被当前Chromium企业策略ERR_BLOCKED_BY_ADMINISTRATOR阻止，仍为BLOCKED，未规避策略。
- 三种桌面尺寸与80/100/125%均为**应用CSS zoom**；原生浏览器工具栏缩放仍NOT TESTED。人工音轨听感、全部上传资源组合和小时级浸泡也未新增验证。短时20/50/100回合值见artifacts/refactor/performance-comparison.json，不能据单次采样宣称无泄漏或性能加速。

## 文档及遗留项

ARCHITECTURE、DATA_SCHEMA、设计规范、维护说明、功能与测试矩阵已更新，WEL-001～004留下完成记录。GP-011/012/013/014等此前遗留架构任务继续保留，不因本轮首页验收通过而关闭。必要的真实用户配置、原生缩放和file环境缺口也保持开放。

按既有授权同步同一私有Sites，URL与访问范围不变；实际发布结果以最终工具回执为准。没有修改无关分支或强制推送。
