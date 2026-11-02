# Repository instructions

修改代码前必须阅读根目录 [DEVELOPMENT.md](DEVELOPMENT.md)，然后查看相关架构与维护任务。用户当前会话的明确授权和约束优先。

- 产品CSS只在`src/styles/`；`src/ui/`只放界面JS。不得另建平行样式根、恢复旧编号文件或新增版本号类名/动画名。
- 禁止追加覆盖式CSS补丁、叠加同名全局函数包装器、直接修改发行HTML。维护已有组件owner，迁移时保留证据与回归。
- 不得删除/重置真实课堂数据，不得擅改竞技规则或14组布局。
- 每部分完成后做相关验证；默认仅Chromium 1920×1080、1x。未经用户要求，不操作CircleCI。
- 所有实际结果必须区分PASS、FAIL、BLOCKED、NOT TESTED。更新维护列表，按逻辑提交；未经指示不合并main、不强推。
