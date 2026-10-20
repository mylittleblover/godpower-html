# V3 UI 治理回归矩阵

状态：本轮没有执行UI验收。设计审批后用于实施计划。常规测试统一Chromium 1920×1080、浏览器100%（1x）；不扩展分辨率。结果必须附commit、命令、浏览器版本、截图路径、断言、控制台日志；未执行标NOT TESTED。

| ID | 用例与验收条件 | 类型 | 当前 |
|---|---|---|---|
| RG-01 | 14组正常/长名/大积分/负分/道具/状态/选项/All In；新旧卡片几何、间距、垫片、底栏、滚动相同且按钮可见 | Chromium截图＋DOM | NOT TESTED |
| RG-02 | 排名FLIP、battle motion session、进攻延迟期间分数显示和动画次序 | Chromium事件序列 | NOT TESTED |
| RG-03 | 答题/All In/自由赋分、编辑积分键盘焦点、撤销 | Chromium交互 | NOT TESTED |
| RG-04 | 欢迎intro播放/跳过/重播/快速切页；横滚暂停恢复/减少动态 | Chromium交互 | NOT TESTED |
| RG-05 | 五核心页default/empty/populated/error；mount/unmount/re-enter清理subscription/timer/focus | DOM＋生命周期 | NOT TESTED |
| RG-06 | 插件导航与子路由；权限拒绝、缺包/依赖、未知深链可返回核心页 | Chromium交互 | NOT TESTED |
| RG-07 | Dashboard卡片添加/移除/隐藏/复制/排序/缩放/移动/取消/持久化/导入导出 | Chromium＋storage | NOT TESTED |
| RG-08 | teacher/subject/class布局优先级；切换scope隔离，100卡片和位置冲突 | 单元＋Chromium | NOT TESTED |
| RG-09 | 插件停用/崩溃时保留布局与配置，其他卡片可用，重启恢复 | 集成＋Chromium | NOT TESTED |
| RG-10 | classic/marx主题预览/应用/页面级/恢复与旧key迁移 | Chromium截图＋存储 | NOT TESTED |
| RG-11 | 恶意主题资源、对比度拒绝、语义色、安全警告不可覆盖 | 单元＋Chromium | NOT TESTED |
| RG-12 | 文案多locale、占位符、缺key、特殊HTML字符、个人覆盖/reset | 单元＋Chromium | NOT TESTED |
| RG-13 | 窗口开关动画、❌、Escape、焦点恢复、嵌套、重复点击 | Chromium交互 | NOT TESTED |
| RG-14 | CSS顺序、主题token、重复候选的computed style与截图diff | CSSOM＋截图 | NOT TESTED |
| RG-15 | 102个inline handler迁移后，双击不重复命令，listener attach/dispose配对 | DOM/命令spy | NOT TESTED |
| RG-16 | 插件视图不可读main DOM/state/localStorage；拒绝权限 | 安全集成 | NOT TESTED |
| RG-17 | 插件组件异常显示局部fallback并dispose动画/事件 | Chromium错误注入 | NOT TESTED |
| RG-18 | 旧题库/偏好/布局/import/export/保存失败与恢复 | 集成故障注入 | NOT TESTED |
| RG-19 | Electron picker/effect/dialog IPC role/CSP/single-owner点名 | Electron测试 | NOT TESTED |
| RG-20 | HTML自包含离线构建，HTTP/file分开，HTML source SHA/Electron一致 | build＋browser | NOT TESTED |
| RG-21 | 14组、主题切换、插件故障场景的console、long task、DOM/timer清理 | Chromium诊断 | NOT TESTED |
| RG-22 | 插件安装/更新/回滚不改变课堂Schema、26道具、60成就、历史/归档 | fixture＋差分 | NOT TESTED |
| RG-23 | Windows安装、托盘、悬浮窗跨应用/显示器、全屏效果 | Windows真机 | NOT TESTED |

原交付包的130/160/200%字体尺寸测试移出常规矩阵，按用户已确认只测1920×1080、1x。键盘和reduced-motion在该尺寸专项测。

当前package.json命令：HTML npm test/test:e2e/test:ui/test:refactor/test:theme/test:content/test:migration；Electron npm test/test:desktop/verify:bundle。计划按阶段执行相关组；不以一次verify替代上表。CircleCI不执行。
