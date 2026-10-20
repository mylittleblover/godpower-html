# M0 UI 基线与所有权快照

日期：2026-10-20  
仓库：`mylittleblover/godpower-html`  
分支：`feat/v3-foundation-sp01-sp02`  
代码基线：M0开始前源代码与设计基线 `32893708c24d8cd32e9c82d18b35be164a2cf345`；本轮计划文档提交为 `1b95aae3a5077bcbfda095a8b71e3ac835e056f6`，不改产品代码。  
产品版本：3.0.24。

## 源码资产所有权

报告由 `npm run audit:ui` 生成，JSON在 `artifacts/ui-governance-m0/ownership.json`。扫描器严格按 `src/manifest.json` 的嵌入顺序读取源文件，并记录字节、脚本全局绑定候选、事件/计时器/观察器的词法计数、CSS selector/property词法候选及模板静态入口。

- 125个源码块：32 CSS、93 JS；manifest顺序唯一记录。
- 5个默认页面root：welcome、battle、archives、history、settings（模板顺序）；227个静态ID，未发现重复ID。
- 模板有102个inline事件属性，尚未作为本阶段删除目标。
- 1,667个 `!important`（旧式CSS词法统计，含重复/状态覆盖，不代表1,667个问题）。CSS重复selector/property只能列候选，不能在不看媒体查询、状态和浏览器级联的前提下判为冗余。
- JS监听器/定时器词法统计不能证明泄漏或不可达；后续生命周期测试需由浏览器验证。

## 单文件构建基线

| 项目 | 实测值 |
|---|---|
| `npm run build` | PASS |
| 生成文件 | `dist/godpower.html` |
| 文件体积 | 7,967,474 bytes |
| SHA-256 | `ffa430c685d9be8b607d738ec4366293d07b9835477d49871b4554c0d9533352` |
| `npm run check` | PASS：94脚本块语法、27内嵌资源、125源码块/manifest一致、三处版本一致、边界检查通过 |

## 浏览器布局基线

实际环境为系统Chromium，通过本地HTTP在1920×1080、deviceScaleFactor=1运行。五个view均可打开，没有 uncaught pageerror。页面截图、视口/根容器测量及浏览器信息保存在 `artifacts/ui-governance-m0/`。

14组布局使用项目的 `battle14` 自动化fixture，`zoomLevel=1`、`columnMode=double`、resizer=120px，14张卡片全部位于底栏上方；几何明细在 `browser-baseline.json`。此fixture不包含用户实际课堂的组名/设置，故不能声称复现用户个人14组配置。当前测试程序报告 `userActualConfigurationVerified=false`。

截图：`artifacts/ui-governance-m0/screenshots/{welcome,battle,history,archives,settings,picker,battle-14}.png`。此次M0记录为后续页面生命周期和扩展注册的视觉/几何参考，不更新已有历史截图基线。

## 实际执行结果

| 检查 | 结果 | 证据 |
|---|---|---|
| HTML静态目录 | PASS | `npm run audit` |
| 构建、语法/包完整性 | PASS | `npm run build && npm run check` |
| 单元与集成 | PASS，246/246 | `npm test` |
| 新增UI所有权断言 | PASS，2/2 | `node --test tests/unit/ui-ownership.test.mjs` |
| 14组布局 | PASS | `node tests/e2e/battle-layout.mjs`，1920×1080 1x |
| 五个页面/界面基线 | PASS | `npm run test:ui-governance-baseline`，1920×1080 1x；零pageerror |
| 完整旧版桌面UI脚本 | INCOMPLETE | 本轮曾启动 `desktop-ui.mjs`；其中抽签断言曾FAIL但隔离复测通过；Escape关闭断言在新退出动画完成前立即检查，复测确认窗口按动效时长仍可见。该旧脚本随后被停止，未将其记为PASS。M2将修正测试等待方式并重新执行1920×1080范围的相关断言。 |
| Electron/Windows | NOT TESTED | M0只建立HTML基线 |
| `file://` | NOT TESTED | M0只用本地HTTP |
| CircleCI | NOT RUN | 按用户约束 |

## 已确认的实现前约束

1. M1沿用唯一 `ContributionRegistry` 规范和默认五页，不新增平行注册表。
2. M2新增页面dispose生命周期时，动画退出期间的焦点、ESC与遮罩状态测试必须等待退出动画完成；不能以同步DOM断言错误移除动画。
3. 比赛页实际用户布局尚未获配置快照；自动化只可报告明确标注的fixture结果。
4. 此阶段没有改产品展示或业务代码，也没有迁移/清除任何用户数据。
