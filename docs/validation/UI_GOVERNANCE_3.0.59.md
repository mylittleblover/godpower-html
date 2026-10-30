# V3.0.59 无插件 UI / JS / CSS 治理验收

## 范围与保留行为

基线 b9c6276（3.0.58），承接9905582（3.0.57）的已有功能。没有恢复插件平台、外部普通弹窗，未改变26道具、计分/排名/All In、历史/持久化与音频规则。保留主页自定义、两主题、颜色修复、BGM音量、头像及点名功能。用户要求每个模块完成后集中测试，不逐文件反复全量测试；后续浏览器用例固定Chromium 1920×1080 1x，无CircleCI操作。

## 实际治理

1. 设置目录/DOM分组迁入settings-layout；移动原节点，保留输入、事件及保存方式。
2. 题库表单迁入content-bank-editor，注入实时读取/保存/确认端口，不持有权威存储。
3. 退出动画迁入window-motion，保留非线性下飞、一次结束、取消与焦点兼容；卸载可清理待退出状态而不执行业务关闭回调。
4. 展开动画迁入disclosure-motion，重复安装幂等、scope拥有监听器、退出可清理；保留减少动态效果的原生展开。
5. 比赛卡片HTML迁入battle-card-view只读presenter；DOM/头像/队列装饰和FLIP仍归battle-grid，刷新/攻击等待仍归render。移除未使用lockAttr局部变量。
6. 名单/教学CSS从desktop.css连续分段拆出，原文本归一化hash和层叠顺序不变；不增加覆盖补丁。
7. 删除无写入方的data-native-detached判断与对应CSS排除项；保留真实使用的data-external-picker。

## 发现并修复的实际缺陷

每日卡片被移动到自定义网格后，旧内容留在网格，下一次renderDaily又生成同类卡片；答题反馈通过已经清空的旧host查询，可能无法解锁下一题。旧测试先出现重复标题strict locator错误，动画用例还在旧容器寻找details并超时。

修复：内容使用dailyRevision唯一代次；HomeDashboard替换旧代次（含偏好关闭的类别），不改布局实例。答题回调相对于所属卡片查询。知识/挑战完整回归及三次知识轮换后同类卡片唯一断言通过。动画测试定位新网格中的真实知识卡片，保留原展开/关闭/键盘/打断断言；缩减为1920×1080 1x。

## 实际验证

- 最终npm test：319 PASS / 0 FAIL。
- build/check/format：PASS，151源块、117脚本块解析，27份原始内嵌资源保留，版本字段3.0.59一致。
- standalone-governance：五页、两主题、九类设置、草稿DOM节点保持；比较抽样几何/颜色/样式均一致。欢迎页比较固定hero，整页截图中的重复卡片消除是预期缺陷修复，不要求保留错误页面高度。
- battle-layout：以b9c6276为基线，14组位置/尺寸/底栏/垫片/滚动及按钮界限PASS。未读取用户真实设备配置。
- welcome-content-editor：独立知识轮换、答题门槛、不加比赛分、26道具百科、结构化CRUD、非法导入不变/有效导入/导出PASS。
- standalone-content-bank：知识与题目CRUD、验证导入和导出PASS。
- motion-unification：首次17 PASS / 1 FAIL（旧知识容器定位）；修复根因并更新定位后只重跑失败的展开模块，1 PASS / 0 FAIL / pageerrors=[]，未重复跑全部动画。
- internal-electron-dialogs：逐字输入保持DOM/焦点、设置导航、无克隆发布及重复打开点名入口PASS。
- 独立只读代码审查：无重要缺陷；没有修改代码或额外运行浏览器。

证据集中于 artifacts/ui-governance-3.0.59：before/after五页截图、14组截图和DOM对比、daily刷新截图、content-editor截图、ownership、metrics及原失败/最终测试日志。旧截图基线未整体更新。

## 限制与后续

不声称完成所有历史技术债。比赛整批DOM更新、音轨资源revision局部刷新、跨文件重复CSS删除仍在维护列表，必须证明安全后继续；未删除无法证明不再需要的旧业务层。代码行数变化只说明职责移动，不等于整体代码量或运行性能下降。性能长测、Windows系统键盘/实体触屏与多显示器本轮NOT TESTED。

Electron同步、构建与平台执行证据由Electron同版本报告记录，不把浏览器mock测试当作Windows真机测试。
