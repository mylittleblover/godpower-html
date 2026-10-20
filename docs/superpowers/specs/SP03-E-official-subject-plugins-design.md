# SP03-E：官方学科插件范围与分期交付规格

状态：设计待审。11款学科插件均是目标能力，不是当前已完成功能。关联：[运行环境](SP03-A-plugin-runtime-design.md)、[UI与工作区](SP03-B-ui-contribution-design.md)。

## 1. 统一边界、数据模型与接口

每包遵守同SDK/权限/生命周期，不把所有学科塞入核心。学科包有独立主页、资源、工具、练习测评、演示、卡片与配置；只读默认，不因安装而读取全部学生。内容无可靠来源时标审核示例，不能伪造教材/法律原文或AI判分结果。AI评价仅为建议，教师复核后通过核心命令写正式成绩；离线不假装有联网AI。

ResourceService保存 {resourceId,ownerPluginId,scope,subject,type,schemaVersion,title,source,copyright,reviewStatus,hash,blobRef,createdAt}；文本/题库/实验/图表等有独立版本schema。主程序负责资源授权/导入导出，包拥有内容结构的验证和迁移。授权内容可通过Service Registry共享只读DTO/句柄，不共享私有数据库。

教学扩展端口：registerQuestionType({id,inputSchema,answerSchema,renderer,graderAdapter})、registerResourceFormat({mime,schema,importer,exporter})、registerClassroomTool、registerTeachingFlow、registerScenePreset、registerShortcut、registerDemoMode。评分适配只返回建议 {answerId,scoreSuggestion,explanation,confidence?,ruleVersion}；宿主核验并由教师确认成绩命令。无教师批准不调用比赛加分。

共同持久模型：WorkspaceDocument(documentId,pluginId,teacherId,subjectId,classId?,schemaVersion,revision,content,resourceRefs)；PracticeAttempt(attemptId,questionRef,learnerRef?,answers,suggestedResult,teacherConfirmedResult,provenance)；DemoState为会话临时状态，除非教师保存不生成正式学生荣誉。缺StudentId时只做匿名练习或小组关联，不把成员姓名当稳定身份。

## 2. 分批原则与前置依赖

SP08先建设通用题库/内容编辑/来源/资源与图表/公式/音频端口，再交付政治和语文学科的可用纵向功能。SP09交付数学、物理、化学、生物的计算/模拟。SP10交付英语、历史、地理、美术、音乐。每款仍分F1可用纵向切片、F2完整基础工具、F3较复杂模块；F1不代表整款完成。每个F阶段须有实际输入/输出、保存导出和功能测试，不能交空导航当插件。

所有F1依赖平台启停/权限/存储/UI通过；F2依赖各包F1；F3依赖F2及表中服务。不能以本设计生成便跳过实施计划批准。第三方库选型/离线打包/许可证和供应链审查属于实施计划的具体任务，不预设联网依赖。

## 3. 逐款功能、接口、风险与验收

| 插件ID / 名称 | F1 可用纵向功能 | F2 必需功能 | F3 后续完整功能 | 输入输出 / 服务 / 验收 |
|---|---|---|---|---|
| official.confucius / 孔子的力量 | 古诗文精读：导入带出处文本、逐句注释、保存导出；主页知识卡 | 文言分析、现代文阅读标注、朗读/背诵对照 | 作文工作台、文学知识图谱 | TextDocument→Annotations/Practice；text.annotate服务；长文、注释定位、重载、无可靠译文不自动编造 |
| official.gauss / 高斯的力量 | 函数绘图：受限AST表达式、坐标缩放/采样/导出 | 公式编辑、概率统计、动态几何基础约束 | 符号计算、可解释分步解题 | FunctionAST/GeoConstraint/DataTable→Plot/SolutionSteps；math.sample；禁eval、定义域/奇点/误差/复杂度测试 |
| official.shakespeare / 莎士比亚的力量 | 本地词汇管理＋抽认卡，可导入/导出学习集 | 离线词典资源、听力题/音频、语料词频分析 | 口语录音对照、写作批注/建议 | Vocabulary/Audio/Text→Practice/Annotations；audio资源服务；麦克风拒绝可继续，词典许可明确，发音评分无模型不假实现 |
| official.newton / 牛顿的力量 | 力学模拟：参数→轨迹/能量图，可暂停重置保存 | 电路实验基础、光学/波动演示 | 实验数据拟合分析、实验报告 | SimulationConfig/DataTable→Trace/Report；调用math.sample；步长稳定性/单位/守恒误差/无穷输入拒绝 |
| official.curie / 居里夫妇的力量 | 离线周期表＋化学计量计算 | 化学方程式配平、分子模型 | 虚拟实验与实验记录 | ElementData/MoleculeGraph/Reaction→BalancedEquation/Model；chemistry.molecule；质量守恒/电荷/无解配平/来源校验；模拟非真实实验安全指导 |
| official.mendel / 孟德尔的力量 | 孟德尔遗传概率模拟与样本图表 | 细胞结构、DNA/蛋白质、生态系统 | 进化树、显微图像标注分析 | AlleleModel/Image/Sequence→Distribution/Annotation；读取molecule可选；种子复现/概率归一/读码边界；无AI模型仅明确人工标注 |
| official.qin-shi-huang / 秦始皇的力量 | 多轨历史时间轴，带来源史料导入与标注 | 历史关系图、纪年换算、材料题训练 | 历史地图时间切片 | HistoricalEvent/SourceText→Timeline/GeoFeatures；history.timeline；公元前/无公元零/缺日期/互相矛盾史料标注 |
| official.marx-politics / 马克思的力量·政治 | 已审核知识/单选练习、题库编辑导入导出、下一题/下一轮 | 政治概念分析、教材知识图谱、材料题训练 | 带来源/有效日期法律条文库、时政案例、逻辑论证工具 | ConceptGraph/Question/LegalSource→Practice/ArgumentMap；politics.knowledge；答案解释对应、无自动正式积分；旧题库逐项读回；主题包非必需 |
| official.magellan / 麦哲伦的力量 | 离线GeoJSON图层/投影/地图测量 | 地形剖面、地球运动、气候图表 | 人口/城市模型与地理数据分析 | GeoJSON/Raster/DataTable→Map/Profile/Charts；geo.render；无在线底图仍可用、经纬度/跨日期线/坐标系/图层授权测试 |
| official.picasso / 毕加索的力量 | 数字画布：笔刷/撤销/图层、图片导入导出 | 色彩实验室、构图分析、作品鉴赏与批注 | 带授权的课堂作品展览 | CanvasDocument/Image→Artwork/Annotations；art.annotate；大图限额、撤销一致、色值转换、作者隐私和导出尺寸 |
| official.beethoven / 贝多芬的力量 | 钢琴键盘＋节奏练习，音量/静音/音频槽有效 | 五线谱编辑、和声分析、听音训练、虚拟乐器 | MIDI监视/文件工具、音频频谱分析 | ScoreDocument/MIDI/Audio→Playback/Analysis；music.audio；音符时值/节拍/延音释放、设备拒绝/关闭中断、不重复音频；VST3排除 |

所有表列功能均为最终范围内；F3不代表可无限推迟，批准实施计划时必须给每项任务、依赖和独立验收边界。无法在当前环境验证的设备/Windows行为明确NOT TESTED。网络不是离线基本功能的前提，内容包可离线安装和版本化更新。

## 4. 跨插件协作契约

| 调用 | 共享schema与权限 | 缺失时降级 |
|---|---|---|
| Newton→Gauss | math.sample@1；FunctionAST、范围、误差、最多样本数；只需工具权限 | 物理自有基本采样，不隐藏整个力学页 |
| Qin→Magellan | geo.render@1；带坐标系GeoJSON资源只读句柄 | 时间轴和史料保留，地图显示不可用说明 |
| Confucius↔Qin | text.annotate@1；带出处文本片段/定位 | 本包注释器继续可用 |
| Shakespeare↔Beethoven | audio.inspect@1；受权audio handle、时间段 | 听力播放仍由核心AudioService，无分析时降级 |
| Curie↔Mendel | chemistry.molecule@1；元素/键/坐标图 | 文本分子式/生物示意继续可用 |

共享API版本/输入输出schema固定，provider停用后取消未完成调用，已保存资源不被删除。注册服务不能顺带获得学生权限；资料分享由教师明确选择，私有题库不得全库泄漏。

## 5. 官方竞技包与主题包的关系

official.miyamotos-power是竞技玩法包，规格见C；official.marx-theme是视觉包，见D。二者不与11款学科插件混为一包。政治插件可建议主题但不自动启用主题，更不能借主题权限改成绩。学科测评可经教师确认联动基本计分，与道具和成就规则保持独立。

## 6. 生命周期、数据迁移与错误处理

工具关闭保存草稿/停止模拟/释放麦克风MIDI/取消动画；停用保留文档、题库、学习记录和卡片配置。恢复后按schema迁移预检→副本校验→回执→版本切换。资源不足/公式不合法/设备不可用/未审内容分别显示可操作错误，不吞异常或构造结果。

现有首页knowledge/challenges题库、next操作和编辑导入导出先由核心兼容适配器供给；政治插件副本迁移经数量/逐条摘要/来源/答案解释校验后切provider，旧键保留。用户题库不因为默认学科改变被删除，其他学科subject字段保持。

任何实质成绩记录通过核心CommandService；普通演示、练习预览、导入和AI辅助都不能自行触发正式答题/道具成就。规则和版本随已确认测评记录保存，重放不重新判题。

## 7. 通用与学科专项验收

每款每个F阶段至少包括：无资源空状态、真实有效输入、非法/大输入、操作输出正确性、资源保存与刷新恢复、导出再导入等价、teacher/subject隔离、权限拒绝、停用恢复、卡片和完整页、键盘/减少动态、离线运行。表中算法边界另有可复现fixtures和数值容差；不能只看截图。

音乐和英语听感/口语质量、显微识别、复杂GIS/符号计算的准确性需独立证据，模拟API调用成功不能替代人工/真设备评价。常规视觉仅Chromium 1920×1080 1x；真实MIDI/麦克风/Windows缺环境则NOT TESTED。所有学科新功能当前NOT TESTED，不能从旧课堂回归通过推导它们已可用。

## 8. 设计批准时需要确认的候选决定

审阅F1→F2→F3范围、插件稳定ID、离线资源和许可策略、算法与AI能力边界、跨插件服务版本及数据分享规则。此规格不替代实施计划中的第三方依赖选型、每项文件/断言/恢复步骤，也不跳过用户对计划和执行方式的第二次批准。
