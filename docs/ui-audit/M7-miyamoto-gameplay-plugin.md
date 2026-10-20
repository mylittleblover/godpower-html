# M7 · 宫本茂玩法插件入口迁移

状态：**设置归属迁移完成，玩法规则迁移仍阻塞（3.0.32）**。本切片搬迁道具配置、图鉴和音效入口，不改变任何竞技行为。

## 边界

- 新增受信任内置声明式插件`official.miyamotos-power`，经既有PluginPlatform与ContributionRegistry注册一个玩法页及设置贡献。
- 插件工作区总开关沿用`setCommunismMode()`和`politics_communism_mode`，是旧行为的UI搬迁，不新增插件存储副本。false、缺失（默认true）等语义由旧适配器继续解释。
- 百科通过`GodpowerItemCatalog.list()`从真实`ITEM_DEFS`构造，并调用既有`itemVisual()`显示资源；页面不再维护平行道具数据。
- 首页及旧入口`openItemEncyclopedia()`现在打开该插件工作区。
- 主设置页不再注入总开关；设置调用保留`installCommunismModeSetting()`兼容入口，它只清理遗留DOM，不创建第二份控件。
- 每道具抽取/使用模块工作台、26项图鉴与自定义图片管理、公共事件和逐道具音效管理已迁入插件工作区。原配置、图标和音频存储继续作为唯一数据来源，不建立重复存储；旧`items`设置导航路由兼容转入插件页。
- 图标批量恢复的危险确认改为文档级委托，避免控件迁移后跳过确认；取消不执行恢复。
- 玩法插件不是隔离执行器：它没有直接读写课堂状态的权限，竞技命令仍由旧业务执行器控制。插件停用不会删除库存、比赛数据或旧开关。

## Chromium验收

环境：Chromium，1920×1080，deviceScaleFactor=1，隔离浏览器上下文，HTTP本地服务。

Chromium 1920×1080 1x隔离环境中，设置主分类、道具模块编辑、图鉴、30组道具音效槽、音频上传/导出/导入、图标恢复确认取消、旧总开关跨刷新及插件停用兼容均通过。测试脚本：`tests/e2e/item-modules.mjs`、`tests/e2e/miyamoto-plugin.mjs`、`tests/e2e/settings-cleanup.mjs`、`tests/e2e/motion-unification.mjs`、`tests/e2e/control-consistency.mjs`。最终结果见`docs/TEST_MATRIX.md`。截图：

3.0.32自包含单文件构建为8,051,677字节，两次连续构建SHA-256一致：`1abbe4dcf198c4226b2cac9fa1986e9886321bf10c3fa1c817af0c30a12c9e1d`。

- `artifacts/miyamoto-plugin/workspace.png`
- `artifacts/miyamoto-plugin/disabled.png`

不包含完整26道具效果差分、个人模式、16随机事件、七状态或Electron插件工作区验收；这些不能用UI搬迁截图代替。

## 下一步

1. 逐项解决`competition-rules-difference-matrix.md`的Needs review规则，不覆盖legacy baseline。
2. 冻结26道具旧行为oracle，再迁移规则执行器、状态机和道具管理命令。
3. 将规则执行与插件注册边界接到已批准事务服务；不得建立插件对权威状态的第二写入口。
4. 完成旧备份启用/禁用兼容矩阵、撤销/导入/异步防御与持久化测试后，再评估插件私有设置副本。
