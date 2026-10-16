> 最新桌面 UI 交付：见 `docs/reports/DESKTOP_UI_ACCEPTANCE.md`、`docs/ui/DESIGN_SYSTEM.md` 和 `artifacts/desktop-ui/acceptance-matrix.json`。以下原始审查结论保留为历史记录。

# V2.18.15 综合验收报告

## 结论

已交付实际修复、可重复构建、自动化测试和截图证据的候选HTML版本；**不能标记用户原始全量验收清单全部完成**。143项Chromium场景与49项Node测试通过，但异步防御所有组合、人工听感、全部UI状态及Chromium file协议尚有明确缺口。未以报告代替修复，未以静态检查代替运行。

## 基线和交付

- 起点：main `a66587215603fc1b5459630f534289257242af0b`；附件V2.18.13；原文件备份提交70d1b42。
- 修复分支：fix/html-reliability-audit；报告生成时实现提交：7a1a508dfabb6887b7f1dacca711fe107adf8508（之后仅文档／产物提交）。
- 最终应用：V2.18.15；单文件 `dist/godpower.html`，7,562,292字节，SHA-256 `461d87048bcf9ab0ad3d7174d5c25d6f544c73d2d0255878cd658d26ae937ffe`。
- 27个原版内置data URI逐字保持；原版无内嵌可播放音轨。自定义音频仍在用户IndexedDB，需原有音频包备份。
- 目录／修改文件：src/core两服务、src/script原脚本拆分及修复、src/style原样式拆分与主题修复、模板／27资源文件、scripts、tests、docs、artifacts、dist、README、package锁文件，以及仅手动触发的GitHub Actions配置。完整名单以git log --stat为准。

## 修复与架构变化

归档写入校验和失败不清零；清零持久化失败恢复；主schema1 envelope与旧键镜像；字段保留及刷新恢复；道具和判定共用操作前快照／提交／回滚；统一队列、模式、负分、每题和冻结验证；All In联动修正；重复判定和无效翻篇修正；安全整数溢出阻止；组名与图标注入修正；CSV公式字符串中和；点名清理真实字段并清除旧结果；数字动画epoch；窄屏底栏和说明同步器作用域修复。原版复现和逐条已知线索见ARCHITECTURE_AUDIT，任务GP-001至009保留完成记录。

## 实际测试

| 验证 | 结果 | 证据 |
|---|---|---|
| JavaScript语法／资源完整性 | PASS，48脚本、27原资源 | ios-hotfix-verification.log、scripts/check.mjs |
| Node业务／schema单元 | PASS 34项 | ios-hotfix-verification.log |
| Node存储／验证集成 | PASS 15项 | ios-hotfix-verification.log |
| Chromium主回归 | PASS 117，FAIL 0 | browser-results.json |
| 26道具目标／积分／初始状态预期 | PASS 26 | rule-oracles.json |
| 未捕获页面脚本错误 | 0 | browser-results.json.errors |
| 外部网络请求 | 0 | route隔离，browser-results.json.externalRequests |
| HTTP真实运行 | PASS | Chromium E2E全部业务 |
| Chromium file直接打开 | BLOCKED，ERR_BLOCKED_BY_ADMINISTRATOR | compatibility字段；没有修改管理策略 |
| Firefox／WebKit后续测试 | NOT APPLICABLE | 用户最终只要求Chromium，已停止其他浏览器工作 |
| 全量人工音频／真实设备 | NOT TESTED | 维护说明中的人工步骤 |
| 远端CI | NOT TESTED | 本次仅本地运行；未执行CircleCI相关操作 |

测试使用新browser context、合成中文名单、受控随机种子21813。道具oracle将随机数固定0并手写26条预期积分向量／效果初始值，未由实现函数计算期望。保存异常通过Storage.setItem故障注入，能证明归档失败不会清零。V2.18.15另有scoring-persistence-results.json：保存受限时普通判题保留本页+2并支持导出，不再回滚；iOS尺寸／触摸模拟使用Chromium，不冒称Safari真机测试。读取旧JSON、非法schema／分数／历史、存储失败回滚和刷新恢复均有断言。正常26道具测试包含库存获取、实际使用、统计和撤销；全19维组合覆盖缺口在TEST_MATRIX，不能把这26项扩大成全部情景通过。

## UI和性能

Chromium 154.0.8037.57；Linux，Node24；视窗1920×1080、1366×768、768×1024、1024×768、390×844、844×390。五页30截图、6窗口以及百科／hover焦点／特殊状态在 `artifacts/screenshots/chromium/`；原版与修改版参考在reference-baseline/reference-fixed。UI修复和未测状态详见UI_AUDIT。

4组100连续判定的执行耗时794.4ms；第20／50／100轮DOM均为1491；历史上限40；末次JS heap读数21969439字节。此为单次有限合成负载，未进行强制GC对比，不证明无内存泄漏，不代表带音频、真实投影或大课堂表现。实际性能JSON保留环境结果，不编造长期指标。

## 构建、离线和兼容

npm锁定依赖；构建仅内联静态源码与原资源，无CDN／API／本地服务器运行时依赖。首次原版重建哈希与附件一致；最终两次构建一致性另见build-reproducibility.json。HTTP回归阻断外部URL并记录0次外部请求。由于系统Chromium file策略拦截，不能把“资源自包含”当成file协议运行PASS；需在用户正常Chromium补GP-020。没有使用其他浏览器的file结果替代该项。

## 剩余工作与下一阶段

没有已复现而未处理的原版P0放在“已通过”中；仍有GP-010未决防御生命周期等高风险未完成验证项，候选版本不应被视为全量发布验收。旧legacy链、布尔状态机和CSS优先级技术债仍存在；全应用资源备份、损坏主存档恢复UI、完整19维道具组合、长时性能、人工音频、全部可访问性尚待推进。详情见MAINTENANCE_BACKLOG每项证据和验收。

优先执行GP-010、016、017、015、012、011、013、020、018、019。每项均可由下一次Codex会话直接领取。维护规则及发布回滚说明见MAINTENANCE_GUIDE。
