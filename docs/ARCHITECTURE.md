# HTML 架构与发布

## 边界

项目继续使用浏览器与离线单文件，不引入 CDN、后端、WinUI 或运行时 npm 依赖。V2.18.13 的原始文件保存在 `baseline/`，禁止直接编辑。开发树为渐进整顿，**尚未完成全部旧包装器的替换**。

## 目录与构建

- `src/index.template.html`：页面、弹窗、初始事件入口及明确的脚本次序。
- `src/core/reliability.js`：无 DOM 的 schema、存储写入校验、归档、道具验证、整数边界、数据清洗。
- `src/core/classroom.js`：稳定的道具／判定命令入口、事务、完整课堂备份、迁移与恢复。
- `src/script/00.js`：旧版主程序；`01.js` 至 `45.js`：原有规则及视觉适配。数字是原脚本顺序，不代表独立业务模块。
- `src/style/00.css` 至 `23.css`：原有样式块；`02.css` 是当前主题和底栏响应式入口。
- `src/resources/*.txt`：原始 data URI，不进行再编码、不损失内置资源。
- `scripts/build.mjs`：按模板内联源码和资源，无时间戳注入，输出 `dist/godpower.html`。
- `scripts/check.mjs`：解析每一段 JS、逐字验证原版内置资源、禁止外部 script/link 强制依赖。
- `scripts/audit.mjs`：生成源码目录和存储键／动画／事件入口索引。
- `tests/unit`、`integration`、`e2e`、`fixtures`：Node 原生测试、真实 Playwright 浏览器与隔离数据。

运行 `npm ci && npm run verify`。测试服务器由 E2E 脚本创建和释放，不属于发行版依赖。Chromium 默认使用 `/usr/bin/chromium`，可设 `CHROMIUM_PATH`。按用户最终要求仅以 Chromium 作为验收浏览器。

## 依赖和命令

页面内联样式和纯服务 → 旧版初始化／规则适配 → 稳定命令和恢复 → DOMContentLoaded 渲染。纯服务不依赖页面，旧版 UI 依赖其 DOM ID。生产脚本采用普通内联脚本以保留 file 协议支持；不使用 fetch 加载源码。

`useItem → validateItem → runClassroomCommand → legacyUseItem → 整数检查 → saveState → renderAll`

`judgeRound → calculateRoundScores 预检查 → runClassroomCommand → legacyJudgeRound → 整数检查 → saveState → renderAll`

命令在操作前记录一次快照，执行期间拒绝重入、阻止内部重复历史及中间落盘；失败恢复状态和历史，取消已排队的数字动画；成功时写入主 envelope，再更新旧版兼容键。道具成功以状态变化／显式结果判定，不以视觉函数作为落锁入口。冻结尝试按原说明解除冻结、保留库存、占用本题使用机会。三重道具续用例外继续保留。

旧执行器内部仍会提前播放视觉／音效，异步刺龟壳防御等未完全纳入事务。后续优先拆出计算和事件；不能把当前事务称为覆盖全部异步业务。

## 比赛状态

当前仍用原字段 `hasStartedOnce / roundActive / evaluated / correctAns`，`Reliability.phase()` 提供派生状态：NOT_STARTED、ANSWERING、ANSWER_SELECTED、SETTLED、FINISHED。开始／下一题初始化清除本题道具锁；无效翻篇不改状态。判定拒绝重复执行；最终归档前拒绝抽取／切题忙状态。

等待答题与答题中在旧 UI 中没有独立持久化状态；“正在结算”也未独立枚举。完整状态机替换列为 GP-012，不能宣称已完成。

## 数据、渲染与音频

主存档为 `godpower_state_v1` 单次 JSON 写入并回读校验，字段见 DATA_SCHEMA。localStorage 不跨设备、不提供密码学身份认证；旧键继续镜像。归档保持独立键，保存失败或读回不一致时不清零；清零持久化失败恢复课堂。归档不再自动丢弃第 41 条旧记录。

UI 继续使用原 DOM 和渲染器，当前仍存在多层 renderGrid/renderAll 包装。分数动画加入 epoch，撤销／回滚后过期回调不再回写。底栏使用原主题中的响应式规则及 ResizeObserver 预留高度，不增加版本尾部 CSS 覆盖。

Web Audio／IndexedDB 音频库、菜单 BGM、思考／战斗／结算轨、节拍和过门沿用原逻辑。原文件只有 27 个内置图片资源，没有内置可播放音轨；用户上传音频在 IndexedDB 中，JSON 课堂备份不包含二进制音频，须另导出音频 BIN 包。新主存档不替换音频存储。
