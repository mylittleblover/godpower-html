"""Compile settings acceptance only from successful, matching final evidence."""
from pathlib import Path
import hashlib,json,re,subprocess
root=Path('artifacts/settings-cleanup')
def read(p):return json.loads(Path(p).read_text())
html=Path('dist/godpower.html').read_bytes();sha=hashlib.sha256(html).hexdigest()
assert html==Path('dist/index.html').read_bytes()
focused=read(root/'results.json');assert focused['sha256']==sha and len(focused['results'])==15 and not focused['errors']
assert all(r['status']=='PASS' for r in focused['results'])
smoke=read('artifacts/desktop-ui/release-smoke.json');assert smoke['sha256']==sha
paths=[('设置专项（含八分类×三分辨率、九种应用缩放、动画及音频往返）',root/'results.json',15),('补充交互','artifacts/desktop-ui/interactions.json',21),('发行断网冒烟','artifacts/desktop-ui/release-smoke.json',4),('e97933d 比赛14组对照',root/'layout/battle-14-comparison.json',3)]
rows=[]
for name,path,n in paths:
 d=read(path);rs=d['results'] if isinstance(d,dict) else d
 assert len(rs)==n and all(r['status']=='PASS' for r in rs),path
 if isinstance(d,dict):assert not d.get('errors') and not d.get('pageErrors'),path
 rows.append({'name':name,'pass':n,'evidence':str(path)})
stage=read('artifacts/desktop-ui/results.json');assert len(stage['results'])==31 and all(r['status']=='PASS' for r in stage['results'])
unit=(root/'unit-final.log').read_text();assert 'ℹ tests 90' in unit and 'ℹ fail 0' in unit
before=read(root/'before/inventory.json');after=read(root/'after/inventory.json');assert not before['errors'] and not after['errors']
base='e97933d81c8de792788f9d93a0a385813bb2d2cd'
metrics=read(root/'metrics.json');mb,ma=metrics['before'],metrics['after']
source=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()
nameMap={'global':'共用页头／导航','rules':'课堂规则','appearance':'外观','motion':'动效','sound':'音频','items':'道具图片','students':'名单','welcome':'欢迎内容','data':'数据安全'}
def cell(s):return str(s or '').replace('|','／').replace('\n',' ').strip()
lines=['|原控件／操作|原分类 → 新分类|处理结果|','|---|---|---|']
for b in before['controls']:
 target=next((x for x in after['controls'] if (b['id'] and x['id']==b['id']) or (b['action'] and x['action']==b['action']) or (not b['id'] and not b['action'] and b['text']==x['text'])),None)
 assert target is not None,(b['id'],b['action'],b['text'])
 identity=b['id'] or b['action'] or b['text']
 lines.append(f'|{cell(identity)}|{nameMap.get(b["category"],b["category"])} → {nameMap.get(target["category"],target["category"])}|保留；'+('折叠于 '+target['details'] if target['details'] else '常规入口')+'|')
settingsRows='\n'.join(lines)
Path('docs/audit/SETTINGS_INVENTORY.md').write_text(f'''# 设置页逐项控件清查

基线 `{base}`，隔离 Chromium 中读取真实 DOM。原始共 {len(before['controls'])} 个控件记录，最终 {len(after['controls'])} 个（包括新增原生折叠摘要）；所有原有命名控件和实际事件入口逐项核对保留且只出现一次。清单涵盖隐藏分类与折叠内容，不能用默认页面可见按钮数代替功能数量。

本次没有发现可证明重复的业务配置。删除的是共用音频工具栏、旧追加工具栏包装、失效audio分类刷新、设置文案覆写及重复样式；音频、图标、题库、名单和数据命令均保留。低频功能收纳并明确说明用途。

数据证据：artifacts/settings-cleanup/before/inventory.json、after/inventory.json。动态音乐槽位另外逐一切换8套比赛配乐与菜单套验证；道具音效从实际26种定义及4公共事件读取。

{settingsRows}
''')
table='|最终产物实际测试|PASS|证据|\n|---|---:|---|\n|Node单元／集成／架构守卫|90|artifacts/settings-cleanup/unit-final.log|\n'+''.join(f'|{r["name"]}|{r["pass"]}|{r["evidence"]}|\n' for r in rows)
layout=read(root/'layout/battle-14-comparison.json')
layoutTable='|视口|应用缩放|末排底部 旧→新|工具栏顶部 旧→新|文档高度 旧→新|\n|---|---:|---|---|---|\n'
for r in layout:
 a,b=r['before'],r['after'];layoutTable+=f'|{r["width"]}×{r["height"]}|{r["zoom"]}|{max(c["bottom"] for c in a["cards"]):.2f} → {max(c["bottom"] for c in b["cards"]):.2f}|{a["dock"]["top"]:.2f} → {b["dock"]["top"]:.2f}|{a["scrollHeight"]} → {b["scrollHeight"]}|\n'
report=f'''# 设置页功能清查、布局与动效验收

基线 `{base}`；分支 `fix/settings-information-architecture`。源码与测试冻结提交 `{source}`。对应发行包 SHA256 `{sha}`。本轮只使用Chromium，未执行CircleCI或远端CI，不触碰真实课堂数据。

## 实际完成

- 与新首页一致的青绿标题区、轻盈白色卡片、扁平控件。统一标题／导航／内容的左右边界；移除旧1700／1200px宽度上限与嵌套18px留白；普通桌面外边距24px，宽屏不再留下成片未用空间。日常音量、布局及低频维护使用两列。
- 分类采用模板 `data-settings-category/group` 的明确归属，替换文本匹配和上一个分类残留规则。壁纸、遮罩、分栏、垫片、缩放及按钮图标集中到外观；All In与道具总开关仍为课堂规则；小组名单的标题回到名单内容旁。
- 页头音频导入／导出移到音频分类末尾的“音频包迁移与备份”，默认收起，使用中性按钮；全量包、仅音效包、共用导入各保留一处。音乐9种选择、基础音效、30个道具音效编辑、按钮图标、道具图片库和题库维护按需展开。
- 数据备份与管理口令保持可见，积分清零与道具清空进入危险折叠区，保留原确认流程；名单重建和恢复全部道具图片增加UI确认，取消不执行命令。原指令的积分、历史及存储语义不改。
- 进入设置页时标题、导航、右侧标题和分组从上到下依次淡入；左侧切换仅动画右侧。完整模式位移12px、260ms且50ms逐层延迟（上限280ms）；简洁模式4px／140ms／15ms，均读取速度偏好。复用现有WAAPI服务，快速切换／离页／Esc／偏好改变／系统减少动态效果取消并清理，无定时重播和布局重排。
- 音乐列表异步渲染增加代次令牌，连续切换只提交最后一次UI结果；分类刷新由DesktopUI统一持有，兼容导航只委派一次。音频包导入成功后补刷新道具音效卡片，实际上传／还原状态同步。
- 删除script/10.js两处追加包装和失效的audio分类分支；删除script/41.js对设置标题的再次覆写；旧设置文字、字段样式归入拥有者CSS，删除重复pane显示规则。未新增!important；未凭版本号批量删逻辑。

静态观察：捕获包装别名 {mb["capturedWrapperAliases"]} → {ma["capturedWrapperAliases"]}，源码!important {mb["important"]} → {ma["important"]}，构建体积 {mb["buildBytes"]} → {ma["buildBytes"]} 字节。新增单一所有者的设置结构与动效使体积略增，不用删功能换取行数指标。详见metrics.json；未测量或宣称加载加速。

完整原控件映射见 [SETTINGS_INVENTORY.md](../audit/SETTINGS_INVENTORY.md)，包括全部{len(before['controls'])}条记录，实际功能均可找到。最终控件数变化包含折叠摘要，不把按钮数减少作为成功标准。

## 真实测试

{table}

最终同产物UI验收共{sum(r['pass'] for r in rows)}个场景；设置专项的聚合场景内实际遍历八分类、普通与展开状态、三个视口、九个应用缩放组合、8套比赛音乐和菜单音乐、全部30个道具音效编辑器。不是每一个上传组合都单独验收。设置专项会比较原控件ID和事件入口，每项必须存在且仅一次；不会为了删冗余而放宽断言。

本轮另有157项核心业务阶段回归通过（117业务＋26道具精确规则＋3保存／计分＋10防御＋1批量赋分），见core-final.log；还有31项五页桌面回归通过，见desktop-ui-complete.log。这两组在补齐动效／高度修正期间执行，未混入最终同SHA的UI数量。高度修正后重新运行设置全专项、21项补充交互、4项离线发行和3项14组对照。本轮未重新执行完整npm run verify或小时级浸泡。

音频用实际生成的WAV执行上传、BGMP全量／仅音效下载，再在另一个隔离存储上下文导入；断言真实解码缓存、已导入声音键和“还原”按钮。不代表人工听辨验收。题库有合法编辑、实际JSON下载、非法JSON不覆盖、取消恢复；口令实际修改并刷新恢复；壁纸真实PNG上传、遮罩、分栏、垫片、缩放和规则开关保存／恢复；危险清空取消保留数据。

动效专项收集实际Animation关键帧／延迟，20次快速分类切换后Esc跳过、离页取消、关闭页面动效、关闭非必要动效和系统减少动态效果均确认计数归零，并验证音轨列表不重复。截图motion-entry.png保留动画中间帧；其余截图等待所属动画结束后生成。

## 布局证据

1366×768、1920×1080、2560×1440的八分类默认与展开截图，九个80／100／125%**应用CSS zoom**组合以音频分类检查公共壳层，其余分类未在每个缩放组合逐项遍历。相关边界数据和截图在artifacts/settings-cleanup/screenshots与results.json。断言标题与内容容器左右偏差≤1px，默认外边距≤26px，面板可滚动且无横向溢出。原生浏览器工具栏缩放未执行。

{layoutTable}

14组使用与e97933d相同的合成double布局、120px垫片及测试数据；卡片几何、垫片、工具栏及文档高度均受比较断言保护，最后一排仍在工具栏之上。用户真实课堂配置仍未取得，不能声称已复现真实配置。

## 失败与修正记录

首次专项定位到音频导入后道具卡片未刷新，已修复并重跑真实音频往返。九组合首次复现125%设置面板底部907.5px超出768px，旧100dvh未按应用缩放换算，已改用统一视口变量，原边界断言保持不变。初始清单在尚未进入音频分类时抓取异步列表，现改为走实际音频分类并等待列表就绪；类别入口统一刷新。旧测试直接点被装饰层遮挡的checkbox，改为点真实label；移除设置页工具栏的断言原先误匹配历史／档案共用类，现限定设置页。大文件刷新使用项目已有90秒导航超时。下载和点击使用Promise.all，避免失败时遗留未处理的下载等待。原300ms固定等待在并发环境中未等到finished，改为有5秒上限等待真实清理后仍断言0。音效卡片实际状态文案是“已载入独立音频”，最后断言使用该真实精确文本；备份下载限定到设置页，避免误匹配全局未保存提醒中的保险导出按钮。中断开发运行的浏览器关闭日志保留为superseded-selector-run及focused-release等证据，不计为最终产物失败或通过。最终完整设置命令日志为focused-shipping.log。保留focused-first、focused-final、pre-motion-desktop-results、desktop-ui-final等中间日志，不将失败或仅bank-debug单项计入最终通过数。

## 发行与剩余范围

单文件共{len(html)}字节，dist两份相同；27个原Base64资源及原品牌SVG保留，无强制联网依赖。两次构建哈希一致及静态资源检查见build-reproducibility.json和check.log。HTTP加载后断网代表操作通过；file://仍因企业策略ERR_BLOCKED_BY_ADMINISTRATOR而BLOCKED。手工音轨听感、所有资源格式／全部26音效逐个真实文件往返、超大音频包、原生浏览器缩放和长时性能均未新增覆盖。

SET-004记录后续音频包索引完整校验与事务失败反馈；既有UI-101/102/103/105等缺口保持开放。本轮没有变更存储键、数据schema、计分、道具平衡、排名或历史语义。维护指南增加设置控件归属和低频操作约束。按既有授权更新同一owner-private Sites，最终部署状态见发布工具回执。
'''
Path('docs/reports/SETTINGS_CLEANUP_ACCEPTANCE.md').write_text(report)
(root/'acceptance-matrix.json').write_text(json.dumps({'sourceCommit':source,'sha256':sha,'node':90,'finalChromiumUiScenarios':sum(r['pass'] for r in rows),'results':rows,'coreStageScenarios':157,'desktopStageScenarios':31,'coreStageLog':str(root/'core-final.log'),'fullVerifyRerun':False,'limitations':['file protocol enterprise policy','native browser zoom','manual audio listening','all uploader file combinations','long soak']},ensure_ascii=False,indent=2))
p=Path('docs/MAINTENANCE_BACKLOG.md');s=p.read_text()
for key in ['SET-001','SET-002','SET-003']:
 a=s.index('## '+key);b=s.find('\n## ',a+1);b=len(s) if b<0 else b
 s=s[:a]+s[a:b].replace('- 当前状态：VERIFYING','- 当前状态：DONE')+s[b:]
p.write_text(s)
for path in ['docs/audit/TEST_MATRIX.md','docs/TEST_MATRIX.md','docs/audit/UI_AUDIT.md','docs/reports/ACCEPTANCE_REPORT.md','docs/REFACTORING_REPORT.md']:
 p=Path(path);s=p.read_text();marker='## 设置页清查与新UI补齐（e97933d 起点）'
 if marker not in s:p.write_text(s+'\n\n'+marker+'\n\n当前设置页清单、布局、动效、真实音频往返与验收范围见 docs/reports/SETTINGS_CLEANUP_ACCEPTANCE.md、docs/audit/SETTINGS_INVENTORY.md。最终同产物43个UI场景与阶段性157核心／31桌面场景分开记录，未将阶段测试合并为全量最终verify。\n')
print(json.dumps({'sha256':sha,'node':90,'finalChromiumUI':sum(r['pass'] for r in rows)}))
