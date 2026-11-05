# 3.0.73 官方角色头像扩充

## 交付范围

预设总数236，内嵌WebP合计831020字节，160×160；每页最多24张，不创建全部头像DOM。完整单文件HTML 12859345 字节。常规构建无需联网。

- 原有115项的ID与图片SHA-256逐项保持不变；改名不会替换已保存的头像资源。
- 宝可梦83项：第1–9世代三条初始伙伴基本进化链，81项，加皮卡丘/雷丘。不包含地区形态、超级进化等额外形态，不臆造未核实世代。官方中国图鉴核对名称；其图片服务器返回503/非图片时使用同权利人的pokemon.com国际官网基本形态图。
- 大乱斗84个既有预设条目：逐项读取任天堂简体中文斗士页名称，保留旧名搜索别名。例如黛西改为官方页面的菊花公主。不将组合斗士/经典形态宣称为全部外观变体。
- 索尼克38张：Sonic Channel现行49项（含经典形态）中36项，另有蛋头兵、超级夏特。名称依世嘉《索尼克赛车 交叉世界》《索尼克 超级巨星》及中文官方说明书。经典版在名称后单独标注，避免重名混淆。
- 分类顺序：花草、岩石、近代政治人物、现代政治人物、宝可梦、索尼克系列、任天堂与大乱斗。

## 真实资料缺口

“全系列所有角色”尚未完成。不得将本次38张误写为索尼克全角色。剩余13项：supersonic, chip, yacker, ariem, maria, gerald, orbot, cubot, mephiles, zor, zomon, zeena, master-zik。目前没有核实到足够的官方中文原文，未自行翻译后加入。跨媒体/漫画等角色不在Sonic Channel现行目录的完整性证明内。

大乱斗官方中文页有9项仍保留拉丁名称：BAYONETTA、CLOUD、INKLING、JOKER、Mr. GAME & WATCH、RICHTER、SEPHIROTH、SIMON、SNAKE。当前照录官方中文站的名称，标记official-Latin，不宣称这些都是中文译名。后续只能根据可核实的同角色官方中文资料补齐；相关任务已登记。

## 数据和构建职责

- scripts/data/avatar-preset-sources.json：审核后的名称、原文、名称URL、图片URL、覆盖范围和资料缺口。
- scripts/build-avatar-presets.py：只在维护素材时显式联网，读取清单，校验/压缩图片，生成目录与来源报告；任何下载失败在替换输出前抛出，避免静默丢失头像。
- src/resources/avatar-presets.js：发行内置资源。
- docs/AVATAR_PRESET_SOURCES.json：逐项来源、权利说明、源图片/缩略图SHA-256。官方宣传图没有被标记为自由许可。
- .cache/avatar-presets/：本地缓存，Git忽略；正常HTML构建只读取已提交目录。
- src/ui/avatar-preset-picker.js：延用既有保存接口；支持原名别名检索与经典版标记。未修改存档格式、比赛规则或14小组布局。

## 实测

- npm test：441 PASS / 0 FAIL（完整单元/集成执行）。

- 扩充前新测试实际失败（缺少宝可梦和官方名称依据），扩充后通过。
- npm run build / npm run check：PASS，253源码块、可见/内部/包/锁版本3.0.73一致。
- node tests/e2e/avatar-presets.mjs：PASS，Chromium 1920×1080 DPR1；阻断外网并采用Electron同等connect-src策略；236张内嵌图逐张解码；宝可梦4页、索尼克2页、大乱斗4页无重复/缺失；搜索、选择、真正保存、重新加载恢复、清除、Escape退出及无页面脚本错误通过。
- 原有115项身份和图片字节兼容测试：PASS。
- 再次执行素材生成器，目录SHA-256完全相同：cdf808ff03cddfc0d24c416d49d0eb43baa74927f739b2576fcfd239d36aad11。
- Windows原生新增素材运行：NOT TESTED。Electron生成HTML须由本次已提交HTML同步，不直接编辑。

截图位于 artifacts/avatar-presets/：pokemon-1至4、sonic-1至2、smash-official-1至4、chooser.png。全部是隔离测试名单。

截图与离线HTML交付目录：https://drive.google.com/drive/folders/1XnksjaQVpWgnJaK9bNySsWmb5zDEgv7X
