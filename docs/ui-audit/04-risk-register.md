# V3 UI 治理风险登记

| 风险 | 严重度 | 证据与影响 | 缓解 / 停止条件 |
|---|---|---|---|
| 14组被组件token、卡片margin或导航高度改变 | 极高 | battle14 fixture固定double列/resizer 120px等条件 | Battle Adapter初期只传DTO；任一几何差异或新增滚动即停止并回退 |
| FLIP/held score/异步攻击顺序丢失 | 极高 | render.js有810ms FLIP及攻击render gate；battle-motion有session | 保留事件次序和dispose；重复、提前展示、无法取消即阻塞 |
| CSS候选误删 | 高 | 348重复selector、157同属性候选只是词法统计 | CSSOM+截图分类；未分类规则不删 |
| manifest顺序改变加载时序 | 高 | 93脚本加载顺序由manifest控制 | 加载顺序契约；新页面不能早于依赖运行 |
| 页面重挂造成事件/定时器泄漏 | 高 | 113 add、4 remove、30 onclick文本调用点；运行数量未知 | Disposable生命周期；重复导航/失败注入后检查清零 |
| 插件UI接触主renderer或权威状态 | 极高 | SP03-A/B要求隔离执行和声明式贡献 | 只接唯一ContributionRegistry；安全评审前不开第三方UI |
| Electron为插件放宽CSP/IPC | 极高 | 当前frame-src none、sandbox和窄preload | 专用host单独评审；主窗策略不变，拒绝通用IPC |
| 设置/题库/主题旧键丢失 | 高 | godpower_ui_preferences_v1、godpower_ui_bank_v1、godpower_appearance_v1仍在用 | 先读旧写副本、读回核验后切换；至少保留一个发布周期 |
| 竞技规则混入UI重构 | 极高 | 26 item规则与视觉反馈相连；规则差异矩阵存在BLOCKED项 | UI只读DTO/提交事件；未证明等价的规则不得改 |
| 玩法插件停用而当前赛季仍依赖 | 高 | 当前玩法状态还未完成插件迁移 | 锁定规则包版本；暂停受影响命令，不丢库存或重置 |
| 源/包版本漂移 | 中高 | HTML、Electron独立仓库并携带内嵌HTML | 记录source SHA，从已提交HTML构建同步 |
| 静态统计被误写成测试通过 | 高 | CSS/API计数为词法分析 | 每行验收需执行证据；未执行标NOT TESTED，受阻标BLOCKED |

阶段门：设计获批前不生成正式实施计划、不改UI产品代码；计划获批前不编码。实施中出现规则差异、存档损失、14组遮挡或权限扩大，停止该批、回退并保留证据。
