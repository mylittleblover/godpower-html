# V3.0.58 UI 治理第一批

基于 V3.0.57，无插件过渡分支。当前仅 G1 首批完成，G2–G5 未完成。没有恢复插件、独立普通弹窗或改动业务规则；CSS未修改。

## 修改与证据

DisposableScope.listen 原来始终保留清理闭包，once监听器触发后仍占用scope；同时remove复用可变options，capture变化会移除失败。新增两项回归先运行，均 FAIL；修复为once调用前释放、保存原capture，后运行6项scope测试全部PASS。保留函数监听器的this和对象handleEvent语义，手动release/dispose仍幂等。

- npm test：314 PASS / 0 FAIL。
- npm run build / npm run check：PASS，27份原始内嵌资源保留，版本字段一致。
- node tests/e2e/page-lifecycle.mjs：PASS，Chromium 1920×1080 1x，旧scope退出后事件/timeout取消，业务状态未变化，无pageerror。
- node tests/e2e/internal-electron-dialogs.mjs：PASS，逐字输入保留DOM/焦点、无克隆发布、设置导航和外部点名入口。

上述浏览器测试执行于本批生命周期代码；之后仅更新发行版本字段。Windows真机及实体触屏本批 NOT TESTED。Electron未同步或重新打包，本批是HTML治理提交，不替换已经交付的3.0.57 Windows包。

当前测试日志：/tmp/governance-unit.log、governance-check.log、governance-pages.log、governance-dialogs.log。后续任务使用新的治理方案，旧插件计划仅保留历史用途。

- npm run format:check：PASS。
- node tests/e2e/battle-layout.mjs：1920 PASS。测试会改写旧截图基线，运行后已恢复这些生成文件，未把新截图当成旧基线提交。
