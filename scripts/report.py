"""Generate factual inventory and reports from committed execution evidence."""
from pathlib import Path
import json,hashlib,re,subprocess,platform
read=lambda p:json.loads(Path(p).read_text())
r=read('artifacts/browser-results.json');oracles=read('artifacts/rule-oracles.json');static=read('artifacts/static-inventory.json');items=read('artifacts/items.json');perf=read('artifacts/performance-chromium.json');diff=read('artifacts/visual-diff.json')
passcount=sum(x['status']=='PASS' for x in r['results']);fails=sum(x['status']=='FAIL' for x in r['results']);opass=sum(x['status']=='PASS'for x in oracles)
sha=hashlib.sha256(Path('dist/godpower.html').read_bytes()).hexdigest();bytesize=Path('dist/godpower.html').stat().st_size
entry={}
for e in static['entries']:entry[e['name']]=f"{e['file']}:{e['line']}"
loc=lambda name:entry.get(name,name)
features=[
('欢迎页与统计','renderWelcomePage','切换welcome／时钟／状态更新','groups/round','时钟、总分、排名、领奖台','renderAll、菜单音乐','groups、round','中','五页截图、统计随计分刷新','PASS（截图与回归）；动态时钟未精测'),
('比赛开始／翻篇／强制结束','startRound','底部主操作与快捷键','当前阶段、答案','开题、结束或拒绝无效操作','音频、状态、排序','round','高','真实下一题、强制结束撤销、无效翻篇','PASS；全部异步初始化组合未测'),
('选项与批量操作','selectGroupOpt','卡片A–D／批量A–D','groupId、opt','选择／取消／改选','renderGrid、saveState','groups.selectedOpt','高','真实按钮单选取消、A–D计分；批量按钮保留','PASS部分；批量选项全流程NOT TESTED'),
('正确答案与判定','judgeRound','设置正解后判定','correctAns、selectedOpt','正确+2，错误+0；未答不变','事务、计分、动画','groups、round、stats','高','四正解、全对全错、重复判定、溢出','PASS'),
('All In','toggleAllInCard','卡片及批量开关','score、道具锁','正确×2、错误0；道具使用后锁定','音乐比例、道具','allIn、lastRoundAllIn','高','计分、成功使用取消、冻结取消','PASS部分；批量与音乐阈值全部组合未测'),
('手动分数与排名图表','applyScoreDelta','卡片／后台改分','id、delta或绝对分数','正负分、排序与动画','历史、渲染、里程碑','groups.score','高','负分、7/8位、大整数、撤销、实时排名','PASS部分；并列动画／所有里程碑未测'),
('道具获取／抽取冷却','globalItemDraw','全局礼物／举手奖励','库存、排名、冷却、随机数','加到最多三格队尾','抽取会话、音效','inventory、drawSessionThrottle','高','全部26种直接获取；1/2/4/8组边界','PASS部分；抽取概率和冷却轮次oracle未测'),
('主次队列与道具执行','useItem','卡片主格／详情／举手','id、index、库存、持续效果','通用验证、效果、消耗与事务','legacy、defense、音效事件','inventory/itemStats/itemEffect','高','每道具三场景＋26精确规则','PASS已列场景；不是所有组合验收'),
('持续与特殊状态','legacyJudgeRound','被攻击、答题／时间到期','星／巨大／强力／幽灵／冰冻／墨汁','保留原防御、递减、遮蔽','道具引擎、计分、时钟','itemEffect/booRounds/blooperUntil','高','冻结尝试、状态初始值、刷新与撤销','PASS部分；到期／叠加全组合NOT TESTED'),
('历史撤销与回溯','undoLast','撤销按钮／历史回退','historyStack','操作前快照恢复','动画取消、持久化','historyStack、groups、itemGlobal','高','所有道具撤销、手动改分、强制结束','PASS；多回合回退和异步决策组合未穷举'),
('封神榜与最终清零','confirmFinalSettlement','解锁后确认归档','标题、当前全状态','完整归档成功才清零；失败保留','storage、快照、表彰','settlement_history','高','归档失败／成功／清零存储失败三路径','PASS'),
('封神榜CSV','exportSingleSettlementCSV','档案导出','记录index','分区CSV含清零前原始JSON','Blob、csvCell','只下载','高','真实下载并验证内容；公式中和单元','PASS；所有电子表格软件人工导入未测'),
('JSON备份与导入','importClassroomData','设置数据页／文件输入','旧JSON或schema1','预检、兼容、失败回滚','FileReader、normalize、事务存储','主envelope及旧键','高','旧JSON、当前JSON、损坏字段、失败落盘','PASS；50MB、全profile资源迁移未测'),
('小组与成员管理','saveGroupDetail','详情、设置名单与添加删除','编号、组名、颜色、成员','增删编辑与名单维护','normalizeGroup、历史','groups/members','高','长名称、添加、撤销、特殊字符','PASS部分；批量名单／删除全流程未测'),
('随机点名三模式','startSlotSpin','点名窗开始／停止','individual/group/two_tier、池','抽中结果、防重复、耗尽重置','slotEngine、音效','picker、pickerHistory','高','实际三个模式开始停止、耗尽','PASS；两级预选／空池所有组合未测'),
('举手与奖励','judgeHandRaise','选组后判对错','groupId、correct、奖励','统计、加分／抽道具／用主道具','handUI、道具、历史','handRaiseHistory、stats','高','实际举手、+2奖励与撤销','PASS部分；错误／连发奖励UI全部组合未测'),
('快速按人加分','openQuickPersonV218','动态增加的🤑按钮','姓名／学号筛选、多人选择','按所属小组汇总赋分','parseStudent、筛选、计分','groups.score、history','高','源码与入口索引，后续GP-017','NOT TESTED'),
('成员搜索','openMemberSearchModal','😎按钮／输入','姓名或学号','转义后的匹配名单','parseStudent、groups','无业务修改','中','弹窗截图；输入查询全组合后续','PASS捕获；查询语义NOT TESTED'),
('设置分区','showSettingsV26','设置页功能／声音／道具／数据','各设置控件','对应面板及配置','存储、音频、图标','多配置键','中','页面截图、全部入口静态索引','PASS捕获；每一开关未全测'),
('音效与节拍音乐','getAudioContext','首次手势／比赛及菜单切换','主音量、SFX、上传曲目','Web Audio、循环、节拍过门','IndexedDB、BGM与菜单引擎','audioDB、音量键','高','真实context／静音／非法decode；人工步骤','PASS技术冒烟；听感NOT TESTED'),
('音频包／自定义音效','exportAudioBundle','音频设置上传、BIN导出导入','音频文件、BGMP包','持久化音轨与音效槽','IndexedDB、解码、Blob','sounds库','高','入口和槽位索引；本次无真实音轨素材','NOT TESTED完整包回环'),
('图标、壁纸、缩放与布局','itemVisual','上传／还原／缩放按钮','图片、比例、列数','原主题和自定义显示','IndexedDB、data URI、CSS','item_icons、ui_icons、zoom等','中','图标payload、27资源完整性、六尺寸截图','PASS部分；壁纸包／缩放全矩阵未测'),
('管理员防误触锁','openPwdModal','🔒按钮／管理操作','本地PIN','允许／拒绝本机高风险操作','state.isLocked','adminPin','中','导入／最终归档命令拒绝locked；源码边界','PASS部分；密码修改UI未全测'),
('规则、百科和提示','renderAbout','ⓘ及二三级页','info/items/guide、实际道具定义','当前规则、提示、动画与说明','itemVisual、文案、CSS','无业务修改','中','百科截图、说明作用域不破坏按钮','PASS部分；所有菜单／动画每帧未验收'),
]
s='# 完整功能清单与覆盖边界\n\n本清单结合源码、动态入口和真实运行，不以可见按钮代替功能范围。全部命名定义的准确数量见 SOURCE_CATALOG；目录包括被覆盖的旧实现，不代表每个定义单独通过。\n\n'
s+='| 功能 | 对应源码 | 触发 | 输入 | 预期输出 | 依赖 | 持久化 | 风险 | 测试方案 | 当前结果 |\n|---|---|---|---|---|---|---|---|---|---|\n'
for name,fn,trigger,inp,out,dep,persist,risk,tests,status in features:s+='| '+' | '.join([name,loc(fn),trigger,inp,out,dep,persist,risk,tests,status])+' |\n'
s+='\n## 所有实际道具\n\n以下来自运行时ITEM_KEYS／ITEM_DEFS，不由需求清单猜测。详细效果以原定义、GROUP_ITEM_DESC和26条预期断言为证据。每项触发均为主栏主动使用或对应被动防御；输入含库存、排名与目标状态；依赖共同命令、计分、防御、视觉及音效，持久化inventory/itemEffect/itemStats/itemGlobal，风险均高。\n\n| key | 名称 | 默认次数 | 源码 | 获取／使用／消耗／撤销 | 共用守门／冻结／恢复 | 积分与初始效果oracle |\n|---|---|---|---|---|---|---|\n'
for it in items:
 k=it['key'];o=next(x for x in oracles if x['key']==k)
 s+=f"| {k} | {it['name']} | {it['charges']} | src/script/00.js:ITEM_DEFS；36.js；42.js | PASS | PASS | {o['status']} |\n"
s+='\n## 隐藏入口、设置、存储、动画与资源\n\nSOURCE_CATALOG.md列出所有命名函数及覆盖定义、输入、返回、副作用字段、调用依赖、风险、事件入口、存储键和88个原动画名；artifacts/static-inventory.json保留机器可读AST结果。静态模板／动态字符串事件均扫描，含解锁后管理、设置控制的道具模式、三重续用、首次举手抽取、刺龟壳防御选择等条件分支。\n\n不能据此声称所有二／三级菜单和所有条件都经过浏览器操作。SOURCE_CATALOG 的单实现 NOT TESTED 与本表集成PASS分开记录，避免以调用存在冒充覆盖。\n'
Path('docs/audit/FEATURE_INVENTORY.md').write_text(s)
# One row per executed scenario, plus honest gaps.
s='# 功能 × 场景 × 类型 × 结果\n\n状态：PASS实际通过；FAIL实际失败；BLOCKED环境限制；NOT TESTED未执行；NOT APPLICABLE不适用。不将后两类计入通过。最新证据为 artifacts/browser-results.json、rule-oracles.json、ios-hotfix-verification.log；早期失败证据另存，不作为最终结果。\n\n'
s+=f'Node单元／存储集成共49项通过（34单元、15集成）；Chromium主回归{passcount} PASS、{fails} FAIL；道具精确oracle {opass} PASS。\n\n| 功能／场景 | 类型 | 结果 | 证据 |\n|---|---|---|---|\n'
for x in r['results']:s+=f"| {x['name']} | Chromium E2E | {x['status']} | browser-results.json，{x['ms']} ms |\n"
for x in oracles:s+=f"| {x['key']} 确定性目标／积分或状态初值 | Chromium E2E | {x['status']} | rule-oracles.json |\n"
s+='\n## 道具19维覆盖\n\nP=PASS；N=NOT TESTED；A=NOT APPLICABLE。组合场景不能由单次正常使用推出。防御成功仅绿壳专例，不能推广到所有道具。表中的防御失败仅指无防御目标正常命中，不代表已测每一种防具的失效／优先级。\n\n| key | 获取 | 使用 | 禁用条件 | 目标 | 数值/初效 | 防御成功 | 防御失败 | 库存消耗 | 耗尽 | 持续 | 叠加 | 到期 | 打断 | All In | 撤销 | 存档 | 动画 | 界面 | 音效 |\n|---|'+ '|'.join(['---']*19)+'|\n'
for it in items:
 k=it['key'];isattack=k in ['green','triple_green','red','triple_red','spiny','banana','triple_banana','horn','bomb','hammer','lightning','fire_flower','ice_flower','boomerang_flower']
 vals=['P','P','P','P' if isattack else 'A','P','P'if k=='green'else('N'if isattack else'A'),'P'if isattack else'A','P','P'if k=='triple_mushroom'else'N','P'if k in ['star','mega','power','boo','feather','blooper','ice_flower']else'A','N','N','N','P','P','P','N','N','N']
 s+='| '+k+' | '+' | '.join(vals)+' |\n'
# Explicit gaps override any temptation to count coverage from a screenshot alone.
for name,typ,status,why in [
('全部二三级菜单与全部交互视觉状态','UI','NOT TESTED','主要页面／6弹窗已捕获；非穷举'),
('人工节奏、过门、音量听感及设备不可用','人工音频','NOT TESTED','步骤见MAINTENANCE_GUIDE'),
('有效音轨／音效包导入导出大包回环','E2E','NOT TESTED','缺少真实素材场景'),
('IndexedDB被禁用全部流程','E2E','NOT TESTED','尚未注入拒绝覆盖全部页面'),
('50MB上限和大档案配额边界','集成','NOT TESTED','已测写入抛异常，未实填满50MB'),
('刺龟壳蘑菇／喇叭选择与跨回合撤销','E2E','NOT TESTED','GP-010'),
('30分钟资源／音频内存与监听器趋势','性能','NOT TESTED','100回合仅有限合成负载'),
('读屏、投影设备、真实触摸、浏览器缩放全矩阵','人工UI','NOT TESTED','GP-018/019'),
('Firefox／WebKit后续验收','浏览器','NOT APPLICABLE','用户最终要求只使用Chromium'),
('远端CI执行','CI','NOT TESTED','用户禁止CircleCI；仅本地验证，未触发其他远端CI')]:
 s+=f'\n- {name}：{status}（{typ}；{why}）。'
for c in r['compatibility']:s+=f"\n- {c['browser']} {c['protocol']}：{c['status']}；{c.get('error','')}"
Path('docs/audit/TEST_MATRIX.md').write_text(s)
# UI evidence is deliberately limited to what was observed.
s='# Chromium UI 验收\n\n用户最终指定仅Chromium。主E2E使用真实渲染，五页×六尺寸共30张，另有6主要窗口及键盘、百科、特殊状态截图。截图“捕获成功”不等于全部视觉语义已验收。\n\n| 页面 | 尺寸 | 截图捕获 | 文档横向溢出 | 文件 |\n|---|---|---|---|---|\n'
for x in r['ui']:
 s+=f"| {x['view']} | {x.get('width','—')}×{x.get('height','—')} | {x['status']} | {'无'if x.get('scrollWidth',0)<=x.get('viewport',999999) else '有'} | {x.get('screenshot','—')} |\n"
s+='''\n## 已修复并重新截图\n\n1. 390竖屏下核心操作藏在底栏水平区域；底栏改为换行，并按实际高度预留页面空间。短横屏工具栏可纵向滚动，仍需真实触摸验收。
2. 说明同步器全页面猜测文本节点，实际把5个批量按钮替换为冰之花说明。限制至库存卡，回归断言保持五个按钮。见历史special-states截图及最终chromium/special-states.png。
3. 768/1024宽度下顶部三列挤压统计文字，改为统计独立一行并断言高度不超过80px。
4. 版本标签从原来的v3统一为V2.18.15；焦点轮廓可见。键盘focus/hover已实际操作。

## 实际人工图像复核边界

已直接查看欢迎页、桌面比赛特殊状态、390竖屏比赛及组详情弹窗；六尺寸五页联图可供逐页复核。桌面8位积分在最终special-states.png完整显示，All In、星光、冰冻同屏可见。组详情有独立滚动主体和关闭控件。

其余截图保留，不能据此声称每一按钮、每一状态、所有嵌套和可访问性均通过。尚缺冻结结束、受击中途、抽取滚动、最终表彰所有时刻的稳定视觉断言，以及小屏全部窗口和读屏人工检查。

## 原版与修改版视觉对照

reference-baseline/ 与 reference-fixed/ 保存相同四组数据、相同1920×1080的五页参考图。参考捕获禁用动画并隐藏时钟，单独的真实交互截图仍保留动画。没有覆盖原图来“通过”。像素差异是记录指标，尚未作为自动门禁；下表差异需要按分类审阅。\n\n| 页面 | 变化像素比例 | 分类 |\n|---|---|---|\n'''
for d in diff:s+=f"| {d['view']} | {d['fraction']:.6%} | 预期版本标签变化；仍需人工逐像素确认，非自动PASS |\n"
s+='\n字体／环境：Linux Chromium系统字体，非课堂实际投影字体；跨设备字体差异未测试。缩放、hover所有控件、全部disabled控件、对比度计算和焦点陷阱未穷举，见GP-018。\n'
Path('docs/audit/UI_AUDIT.md').write_text(s)
# Human-readable acceptance, with no inflated completeness claim.
code_sha=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()
s=f'''# V2.18.15 综合验收报告

## 结论

已交付实际修复、可重复构建、自动化测试和截图证据的候选HTML版本；**不能标记用户原始全量验收清单全部完成**。{passcount+opass}项Chromium场景与49项Node测试通过，但异步防御所有组合、人工听感、全部UI状态及Chromium file协议尚有明确缺口。未以报告代替修复，未以静态检查代替运行。

## 基线和交付

- 起点：main `a66587215603fc1b5459630f534289257242af0b`；附件V2.18.13；原文件备份提交70d1b42。
- 修复分支：fix/html-reliability-audit；报告生成时实现提交：{code_sha}（之后仅文档／产物提交）。
- 最终应用：V2.18.15；单文件 `dist/godpower.html`，{bytesize:,}字节，SHA-256 `{sha}`。
- 27个原版内置data URI逐字保持；原版无内嵌可播放音轨。自定义音频仍在用户IndexedDB，需原有音频包备份。
- 目录／修改文件：src/core两服务、src/script原脚本拆分及修复、src/style原样式拆分与主题修复、模板／27资源文件、scripts、tests、docs、artifacts、dist、README、package锁文件，以及仅手动触发的GitHub Actions配置。完整名单以git log --stat为准。

## 修复与架构变化

归档写入校验和失败不清零；清零持久化失败恢复；主schema1 envelope与旧键镜像；字段保留及刷新恢复；道具和判定共用操作前快照／提交／回滚；统一队列、模式、负分、每题和冻结验证；All In联动修正；重复判定和无效翻篇修正；安全整数溢出阻止；组名与图标注入修正；CSV公式字符串中和；点名清理真实字段并清除旧结果；数字动画epoch；窄屏底栏和说明同步器作用域修复。原版复现和逐条已知线索见ARCHITECTURE_AUDIT，任务GP-001至009保留完成记录。

## 实际测试

| 验证 | 结果 | 证据 |
|---|---|---|
| JavaScript语法／资源完整性 | PASS，48脚本、27原资源 | ios-hotfix-verification.log、scripts/check.mjs |
| Node业务／schema单元 | PASS 34项 | ios-hotfix-verification.log |
| Node存储／验证集成 | PASS 15项 | ios-hotfix-verification.log |
| Chromium主回归 | PASS {passcount}，FAIL {fails} | browser-results.json |
| 26道具目标／积分／初始状态预期 | PASS {opass} | rule-oracles.json |
| 未捕获页面脚本错误 | {len(r['errors'])} | browser-results.json.errors |
| 外部网络请求 | {len(r['externalRequests'])} | route隔离，browser-results.json.externalRequests |
| HTTP真实运行 | PASS | Chromium E2E全部业务 |
| Chromium file直接打开 | BLOCKED，ERR_BLOCKED_BY_ADMINISTRATOR | compatibility字段；没有修改管理策略 |
| Firefox／WebKit后续测试 | NOT APPLICABLE | 用户最终只要求Chromium，已停止其他浏览器工作 |
| 全量人工音频／真实设备 | NOT TESTED | 维护说明中的人工步骤 |
| 远端CI | NOT TESTED | 本次仅本地运行；未执行CircleCI相关操作 |

测试使用新browser context、合成中文名单、受控随机种子21813。道具oracle将随机数固定0并手写26条预期积分向量／效果初始值，未由实现函数计算期望。保存异常通过Storage.setItem故障注入，能证明归档失败不会清零。V2.18.15另有scoring-persistence-results.json：保存受限时普通判题保留本页+2并支持导出，不再回滚；iOS尺寸／触摸模拟使用Chromium，不冒称Safari真机测试。读取旧JSON、非法schema／分数／历史、存储失败回滚和刷新恢复均有断言。正常26道具测试包含库存获取、实际使用、统计和撤销；全19维组合覆盖缺口在TEST_MATRIX，不能把这26项扩大成全部情景通过。

## UI和性能

Chromium {r['browser']}；Linux，Node24；视窗1920×1080、1366×768、768×1024、1024×768、390×844、844×390。五页30截图、6窗口以及百科／hover焦点／特殊状态在 `artifacts/screenshots/chromium/`；原版与修改版参考在reference-baseline/reference-fixed。UI修复和未测状态详见UI_AUDIT。

4组100连续判定的执行耗时{perf['durationMs']:.1f}ms；第20／50／100轮DOM均为{perf['samples'][0]['nodes']}；历史上限40；末次JS heap读数{perf['heap']}字节。此为单次有限合成负载，未进行强制GC对比，不证明无内存泄漏，不代表带音频、真实投影或大课堂表现。实际性能JSON保留环境结果，不编造长期指标。

## 构建、离线和兼容

npm锁定依赖；构建仅内联静态源码与原资源，无CDN／API／本地服务器运行时依赖。首次原版重建哈希与附件一致；最终两次构建一致性另见build-reproducibility.json。HTTP回归阻断外部URL并记录0次外部请求。由于系统Chromium file策略拦截，不能把“资源自包含”当成file协议运行PASS；需在用户正常Chromium补GP-020。没有使用其他浏览器的file结果替代该项。

## 剩余工作与下一阶段

没有已复现而未处理的原版P0放在“已通过”中；仍有GP-010未决防御生命周期等高风险未完成验证项，候选版本不应被视为全量发布验收。旧legacy链、布尔状态机和CSS优先级技术债仍存在；全应用资源备份、损坏主存档恢复UI、完整19维道具组合、长时性能、人工音频、全部可访问性尚待推进。详情见MAINTENANCE_BACKLOG每项证据和验收。

优先执行GP-010、016、017、015、012、011、013、020、018、019。每项均可由下一次Codex会话直接领取。维护规则及发布回滚说明见MAINTENANCE_GUIDE。
'''
Path('docs/reports/ACCEPTANCE_REPORT.md').write_text(s)
print({'mainPass':passcount,'oraclePass':opass,'nodePass':49,'sha256':sha})
