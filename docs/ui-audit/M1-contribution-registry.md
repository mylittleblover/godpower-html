# M1 Shell 路由与 ContributionRegistry 验收

日期：2026-10-20。产品版本：3.0.25。实现与测试限HTML端；Electron HTML同步在源分支提交后执行。

## 变化

- 新增 `src/ui/contribution-registry.js`，按manifest第一项加载；五个既有core route以声明式metadata登记。
- `switchView`仍为既有导航兼容入口，但有效view清单从注册表派生；未知路由回退欢迎页，core路由不可被插件描述符覆盖。
- 唯一ContributionRegistry按activation绑定插件ID、scope、permissions；批次先整体校验，后提交；返回注册receipt和递增revision；dispose只撤销对应activation且幂等。
- 插件页route由宿主生成 `plugins/<pluginId>/<localId>`，插件route现在仅返回 `workspace-required`，未运行代码。描述符JSON-only，拒绝HTML/脚本/事件处理字段，只接受有限kind、slot、renderer和字段schema。
- 没有新增可见导航或页面，没有改变五个默认页面布局、业务状态、数据schema、道具/计分、点名或Electron权限。

## 证据与验收

- `npm run build`：PASS，`dist/godpower.html` 7,981,868 bytes，SHA-256 `abc4f60b9b308c38fb95f78903ce8c71538947c8954823a36d791187a85fcd27`。
- `npm run check`：PASS，95 script blocks、126 manifest blocks、27内嵌资源完整、显示/内部/package版本均3.0.25。
- `npm test`：PASS 253/253。
- `npm run test:contributions`：PASS，Chromium 1920×1080 1x；core route切页成功、插件page/card批次注册/拒绝/撤销、操作前后业务状态相同、0 pageerror。
- `npm run test:ui-governance-baseline`（M1输出到 `artifacts/ui-governance-m1/`）：PASS，五页/Picker可见、0 pageerror、14卡片在底栏上方。
- `node tests/e2e/battle-layout.mjs`：PASS，原14组自动fixture比较通过；不能证明未提供的用户私有配置。
- CircleCI未运行。Windows和Electron包未在该提交前重新测试，随后通过Electron bundle合同测试验证同步包。

## 边界

这一阶段只有宿主内部registry和路由描述层。安装器、持久化生命周期、权限授予UI、隔离renderer、插件中心与实际plugin页面均为后续阶段。`GodPowerPageShell`只可被可信宿主代码调用；不得把它注入第三方主realm。Electron plugin workspace必须走隔离上下文与窄消息桥。
