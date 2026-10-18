# 马克思主题设计与实施

基线 HTML 8821c8e、Electron c06e113。独立分支 feat/marx-theme。

采用现有原生 HTML、CSS 变量、无框架与无在线依赖。主题只拥有外观，和共产主义比赛规则开关完全独立。保留所有布局、用户配色、计分状态和数据格式。

主次层级：品牌红与主要操作为主；暖白面板、灰棕说明为辅；金色红星与麦穗点缀。功能 SVG 保留首页、比赛、历史、档案和设置的可辨识语义，禁止把全部图标换成同一个符号。经典主题使用原始颜色作为 fallback。

切换是低频仪式反馈：960ms 红旗/星徽过渡，transform 与 opacity，沿用 motion-ease；可跳过、Escape、快速连续切换和页面切换中止并清理。系统减少动态效果、简洁和关闭动效直接切换。刷新恢复不重播。

实施顺序：浏览器先失败测试与原版14组截图→集中主题服务/原位色彩变量→设置→Electron DTO安全同步与原生图标→Chromium1920×1080@1截图和布局精确比较→构建离线包与报告。

参考技能：Superpowers brainstorming/TDD/parallel agents；Refactoring UI（沿用设计变量与对比度）；Emil animate/design-engineering（可中断、GPU属性、减少动态效果）。用户已授权自行设计及实施。
