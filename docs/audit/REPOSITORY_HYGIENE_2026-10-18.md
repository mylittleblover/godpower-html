# 2026-10-18 全仓库整洁度审查

## 事实范围

- 来源：私有仓库 `mylittleblover/godpower-html` 的 GitHub API 文件树、指定源码与历史报告。
- 最新已见 HEAD：`feat/battle-motion-action-sounds@dd987a61d8ad5a72a40f7c808bf586bfa5811ab9`，2026-10-18 06:27:53 UTC。
- `main@a665872` 仍仅含初始化 README；最新程序并不在 main，也不在只有 README 的 `godpower-desktop`。
- `dd987a6` 为验收证据提交；紧邻的实际功能提交 `e8412015` 负责比赛动效/操作音效。
- 本轮尚无法完整克隆私有源码到执行容器，因而未运行当前 HEAD 的 `npm run verify` 或 Chromium。仓库过去的验收日志是历史证据，不等于本轮通过。

## 文件树量化

|类别|已跟踪文件|字节|初步判定|
|---|---:|---:|---|
|整个最新分支|1,980|（全部类别之和）|含历史验收资产|
|`artifacts/`|1,755|261,952,316|验收证据混在仓库内；优先建立保留与归档边界|
|`dist/`|2|15,559,702|两份单文件发行包，须与源代码同版重建|
|`src/`|116|7,793,167|含 27 个原始图片 data URI，不可简单视作冗余|
|`baseline/`|1|7,546,905|历史对照输入，保留|
|`docs/`|36|1,107,669|部分为历史报告，需注明版本和保留索引|
|`tests/`|51|314,619|用例不能因目录多而删|
|`scripts/`|13|109,586|分析/构建/验收工具链|

已跟踪 PNG 共 1,252 个，体积合计 237,494,567 字节。它们大部分在验收/截图目录，包含重叠的 `captured/artifacts` 快照。删除之前必须扫描测试读取路径、报告链接和视觉基线的引用；**仅凭文件名重复不能证明相同内容，也不能证明无人使用。**

## 发现与风险

|优先级|发现|证据|治理要求|
|---|---|---|---|
|P1|产物与源代码版本控制混用，仓库维护成本偏高|1,755 个 `artifacts/` 文件，约 262 MB；`.gitignore` 仅忽略 `node_modules/` 和 `test-results/`|先按“必需基线/历史验收/可再生成临时文件”分类，证据迁至可追溯附件后再删重复副本，不要立刻忽略/删除全目录|
|P1|生产旧规则仍有层叠覆盖与全局变量|遗留报告列 `legacyUseItem` 14、`renderGrid` 11、`renderAll` 3 个同名定义；`src/script/00.js` 298,711 字节|用差分测试逐层迁入独立所有者，保留隐藏的特殊规则和脚本顺序|
|P1|新界面业务边界比格式化程度更值得继续拆分|`src/ui/desktop.js` 约 1,930 行；`welcome-v2.js` 约 666 行；`classroom-feedback.js` 约 470 行|按设置、历史/档案、弹窗生命周期、欢迎编排等职责拆分，不额外新增旧函数的覆盖包装器|
|P1|格式化命令没有进入主要验证流程|`package.json` 有 `format:ui`，但 `verify` 原先未调用；新 `action-sounds.js` 和重构 core 有独立格式日志|在 verify 中接入新代码格式校验，旧脚本仍按增量迁移，不大规模格式化以免掩盖业务差异|
|P2|旧 CSS 层叠负担仍大|直接读取 24 个 `src/style/*.css` 与 5 个 `src/ui/*.css`，共检得 1,658 个 `!important`，其中新 UI 五文件合计 1 个|按组件归属、选择器优先级和真实截图逐段清理，不以数量下降或覆盖尾部补丁为目标|
|P2|两个旧版本 JS 文件只含注释|`src/script/25.js`、`src/script/33.js`|两者为删除候选；必须同步模板、manifest、两份 dist 并走回归后才提交|
|P2|开发分支与 main 差距显著|`main` 初始化 README；最新代码在开发分支，较 main 多 60 个提交|记录“唯一发布来源分支”并明确打包 SHA，避免误下载旧版|

## 本次提交的低风险治理

1. 新建只读 `scripts/repo-hygiene.mjs`：展示已跟踪文件分类/字节、注释空脚本候选、模板/manifest/资源路径漂移；不删除文件、不修改数据。
2. `tests/unit/repository-hygiene.test.mjs`：为纯逻辑添加 3 个 Node 测试，先观察缺失模块时失败，再在隔离合成 git 仓库运行至 3/3 通过。**这只是工具自身的测试，不是应用回归。**
3. `package.json`：接入 `audit:hygiene` 与 `format:core`、`format:check`；`verify` 先校验新增 UI/core 格式，再运行原有整套测试。
4. 记录后续不应盲删的项目、原子操作与测试命令，详见 `docs/superpowers/plans/2026-10-18-repository-hygiene.md`。

## 仍未完成的清理

- 旧 `legacyUseItem`、`renderGrid/renderAll` 链必须按有效逻辑逐批分离，不能直接删除。
- 未移除 1,755 个 artifacts 文件；先确认真正用于差分、截图和历史失败追踪的集合。
- 未删除仅注释的脚本 25/33，避免在无法重建大体积发行 HTML 的连接环境中制造不一致。
- 未运行最新 HEAD 的 Node 全套、Chromium、file/HTTP、人工音频/实际教室 14 组布局测试，故没有“全量清理完成”声明。

## 完成验收命令

```sh
npm ci
npm run audit:hygiene
npm run format:check
npm run build
npm run check
npm test
npm run test:e2e
npm run test:ui
npm run test:refactor
npm run verify
npm run audit:legacy
```

任何一次实际清理提交都要有真实红/绿测试、最新完整验证输出以及可回滚基线；未执行的项不得标记通过。