# M2 页面生命周期与低风险页面适配

日期：2026-10-20。产品版本：3.0.26。基线分支：`feat/v3-foundation-sp01-sp02`。

## 实施范围

- 新增 `src/ui/disposable-scope.js`：支持LIFO清理、事件监听、timeout、requestAnimationFrame、observer、Web Animation、子scope与AbortSignal。`dispose()`幂等执行全部清理并返回清理错误，页面导航会将错误写到console并继续后续回退。
- 全局 `GodPowerPageLifecycle` 为当前活动页面持有唯一scope；同页切换返回原scope，跨页进入先释放上一scope。
- `DesktopUI.viewChanged()` 用路由名更新scope，页面入场RAF和WAAPI动画归该页所有。welcome/history/archives/settings低风险路由经过实际切换；比赛页只接入生命周期，不调整DOM/CSS/排列/14组几何。
- 调整桌面UI回归中两个弹窗退场检查，先等待既有非线性关闭动画完成，再检查最终关闭。没有缩短或删除动效。
- 将 `desktop-ui.mjs` 的桌面视口矩阵按用户约束收敛为Chromium 1920×1080、1x、应用缩放1；单份结果保留在 `artifacts/ui-governance-m2/desktop-ui-results.json`。

## 实测验收

| 项目 | 结果 |
|---|---|
| `npm run build && npm run check` | PASS；127源码块、96个script block、27内嵌资源完整，版本3.0.26 |
| `npm test` | PASS 257/257，含4项DisposableScope单测 |
| `npm run test:page-lifecycle` | PASS；Chromium 1920×1080 1x；旧scope立刻dispose、旧event/timer不触发、课堂state不变、Escape弹窗完成退出 |
| `npm run test:contributions` | PASS；五个core route仍有效，0 pageerror |
| `npm run test:ui-governance-baseline` | PASS；Chromium 1920×1080 1x，五页截图、14组在底栏上方、0 pageerror；截图在 `artifacts/ui-governance-m2/screenshots/` |
| `node tests/e2e/battle-layout.mjs` | PASS；原14组fixture比较 |
| `node tests/e2e/desktop-ui.mjs` | PASS 23/23；1920×1080、1x、应用缩放1，涵盖五页、welcome 0/1/2/4/8/16组、历史/存档、八类设置、三种点名、全部道具百科及弹窗键盘生命周期，0 uncaught browser errors |
| CircleCI | NOT RUN（用户明确要求） |
| Electron/Windows | 此M2 HTML提交尚未同步；Windows真机NOT TESTED |

## 已知边界

页面使用静态DOM，因此本阶段只对按页面生命周期存在的副作用提供所有权scope，并把导航入场动画迁入scope；初始化时注册的应用级监听器仍是应用级资源，不在切页时移除。欢迎页点名/拖动等跨视图手势由其既有显式取消机制管理。M3以后新页面、插件renderer应默认使用scope API。
