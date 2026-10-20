# M7 · 宫本茂玩法插件入口迁移

状态：**部分完成（3.0.31）**。本切片只搬迁设置入口和百科展示，不改变任何竞技行为。

## 边界

- 新增受信任内置声明式插件`official.miyamotos-power`，经既有PluginPlatform与ContributionRegistry注册一个玩法页及设置贡献。
- 插件工作区总开关沿用`setCommunismMode()`和`politics_communism_mode`，是旧行为的UI搬迁，不新增插件存储副本。false、缺失（默认true）等语义由旧适配器继续解释。
- 百科通过`GodpowerItemCatalog.list()`从真实`ITEM_DEFS`构造，并调用既有`itemVisual()`显示资源；页面不再维护平行道具数据。
- 首页及旧入口`openItemEncyclopedia()`现在打开该插件工作区。
- 主设置页不再注入总开关；设置调用保留`installCommunismModeSetting()`兼容入口，它只清理遗留DOM，不创建第二份控件。
- 玩法插件不是隔离执行器：它没有直接读写课堂状态的权限，竞技命令仍由旧业务执行器控制。插件停用不会删除库存、比赛数据或旧开关。

## Chromium验收

环境：Chromium，1920×1080，deviceScaleFactor=1，隔离浏览器上下文，HTTP本地服务。

实际执行`npm run test:plugins`：声明式插件中心回归 PASS；宫本茂切片 PASS。断言覆盖插件激活/贡献注册、主设置中旧控件消失、百科恰为26项、关开关写入旧键、关闭后刷新保持状态、插件停用不改写该键、页面错误数为0。截图：

- `artifacts/miyamoto-plugin/workspace.png`
- `artifacts/miyamoto-plugin/disabled.png`

不包含完整26道具效果差分、个人模式、16随机事件、七状态或Electron插件工作区验收；这些不能用UI搬迁截图代替。

## 下一步

1. 逐项解决`competition-rules-difference-matrix.md`的Needs review规则，不覆盖legacy baseline。
2. 冻结26道具旧行为oracle，继续迁移道具抽取/操作设置、道具管理及音效入口。
3. 将规则执行与插件注册边界接到已批准事务服务；不得建立插件对权威状态的第二写入口。
4. 完成旧备份启用/禁用兼容矩阵、撤销/导入/异步防御与持久化测试后，再评估插件私有设置副本。
