# V3.0.56 小组配色与独立背景音乐验收

仅修改无插件网页版分支fix/web-transition-pre-plugin，未修改Electron。

## 修改

1. 编号底色不再通过白字对比度算法压暗，保留实际小组色。线性相对亮度大于0.45时用黑字，其他颜色用白字。
2. 同一浅色判定下，右侧积分采用矩形小组色底、白字及深色描边/阴影；未改变卡片尺寸、积分或排名规则。
3. 设置→音效与音乐→日常音量增加背景音乐滑条。菜单、思考、比赛、开场、过门、结算及音乐试听都经过musicGainNode；音效仍单独经过FX总线。主音量在两者上级继续有效。
4. 音乐滑条即时平滑生效，支持0%静音，独立偏好刷新恢复。

## 验证

- 修复前单测复现：#ffff00被错误改为#777700；修复后原色断言通过。
- 两条旧单测要求自动暗化饱和颜色及浅色深绿字，与新产品要求冲突，改为精确原色与黑字断言；没有将旧暗化行为保留为兼容。
- npm test：312/312 PASS；格式、语法、资源及版本检查PASS。
- tests/e2e/group-colors-bgm.mjs：Chromium 1920×1080 1x，两主题下黄/浅黄/浅绿/白/深绿/橙的真实DOM色值PASS；14卡片位置及尺寸修改前后相同。真实Web Audio连接图、25%音量、0%静音、刷新恢复和FX/主音量不变PASS，pageErrors=[]。
- tests/e2e/battle-layout.mjs：1920×1080 14组布局PASS。
- 人工音乐听感、Windows、file://及其他分辨率本轮NOT TESTED；未运行CircleCI。

截图：artifacts/web-transition/group-colors-classic-3.0.56.png 与 group-colors-marx-3.0.56.png。发行单文件dist/godpower.html：8,198,539 bytes，SHA-256 2d5bd084a3f76acc9b1380da82480fb00f228289aff251d2b7c395769b27bceb。

复测：npm run test:group-colors-bgm；npm test；node tests/e2e/battle-layout.mjs。
