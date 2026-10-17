"""Generate a factual report only after the complete verification finishes."""
import json,re,hashlib,subprocess
from pathlib import Path
root=Path('.')
def read(p):return json.loads(Path(p).read_text())
status=read('artifacts/refactor/final-status.json')
sha=hashlib.sha256(Path('dist/godpower.html').read_bytes()).hexdigest()
assert status['exitCode']==0 and status['sha256']==sha,'Verification is incomplete or stale'
assert Path('dist/index.html').read_bytes()==Path('dist/godpower.html').read_bytes()
assert read('artifacts/desktop-ui/release-smoke.json')['sha256']==sha,'Release smoke does not match artifact'
log=Path('artifacts/refactor/final-verify.log').read_text()
unit=int(re.findall(r'ℹ tests (\d+)',log)[-1]);assert re.findall(r'ℹ fail (\d+)',log)[-1]=='0'
specs=[
('核心业务 Chromium','artifacts/browser-results.json',117),
('26 道具精确结果','artifacts/rule-oracles.json',26),
('真实作答／持久化','artifacts/scoring-persistence-results.json',3),
('桌面 UI','artifacts/desktop-ui/results.json',31),
('桌面交互','artifacts/desktop-ui/interactions.json',21),
('弹窗矩阵','artifacts/desktop-ui/modal-matrix.json',99),
('原 V2.18.15 的14组布局比较','artifacts/desktop-ui/battle-14-comparison.json',3),
('离线文档及归档冒烟','artifacts/desktop-ui/release-smoke.json',4),
('异步防御完整命令／真实按钮','artifacts/refactor/defense-command.json',30),
('新旧业务差分（隔离渲染和音效）','artifacts/refactor/legacy-differential.json',464),
('最新开发源码的14组布局比较','artifacts/refactor/layout/battle-14-comparison.json',3),
('新旧20/50/100回合观测','artifacts/refactor/performance-comparison.json',6),
]
rows=[]
for title,path,count in specs:
 d=read(path);items=d['results'] if isinstance(d,dict) else d
 assert len(items)==count,(path,len(items),count)
 assert all(r['status']=='PASS' for r in items),path
 if isinstance(d,dict):assert not d.get('errors') and not d.get('pageErrors'),path
 rows.append({'feature':title,'count':count,'status':'PASS','evidence':path})
assert len(re.findall(r'^PASS (?:mushroom|horn) (?:accepted|declined|stale-command|stale-state|changed-item)$',log,re.M))==10
assert 'PASS batch student scoring, atomic undo and overflow rejection' in log
rows.extend([{'feature':'原防御令牌保护','count':10,'status':'PASS','evidence':'artifacts/refactor/final-verify.log'},{'feature':'批量学生赋分／原子撤销／溢出','count':1,'status':'PASS','evidence':'artifacts/refactor/final-verify.log'}])
meta=read('artifacts/refactor/legacy-inventory.json');before=meta['before'];after=meta['after'];perf=read('artifacts/refactor/performance-comparison.json');scene=read('artifacts/refactor/layout/battle-14-comparison.json')
source=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()
metrics='|观察指标|最新开发基线|本轮结果|\n|---|---:|---:|\n'+''.join(f'|{k}|{v}|{after["metrics"][k]}|\n' for k,v in before['metrics'].items())
entry='|入口|基线定义数|当前定义数|\n|---|---:|---:|\n'
for name in ['applyItemScore','tryDefend','recordHistory','restoreStateFromSnapshot','undoLast','legacyUseItem','renderAll','renderGrid']:
 entry+=f'|{name}|{sum(x["name"]==name for x in before["functions"])}|{sum(x["name"]==name for x in after["functions"])}|\n'
checks='|测试类型／场景|实际通过数|结果|证据|\n|---|---:|---|---|\n'+f'|Node 原生单元／集成及架构守卫|{unit}|PASS|artifacts/refactor/final-verify.log|\n'
for row in rows:checks+=f'|{row["feature"]}|{row["count"]}|PASS|{row["evidence"]}|\n'
checks+='|Chromium file://直接打开|0|BLOCKED|企业策略 ERR_BLOCKED_BY_ADMINISTRATOR；未规避策略|\n|浏览器原生工具栏80%–125%缩放|0|NOT TESTED|本轮缩放矩阵仅为应用现有CSS zoom|\n|真实音轨节奏、过门和听感|0|NOT TESTED|本轮保留系统，模拟音频及初始化检查不能代替听辨|\n|全部任意用户配置／小时级浸泡|0|NOT TESTED|20/50/100回合是短时观测|\n'
layout='|视口|应用缩放|列模式／垫片|最后一排底部（旧→新）|工具栏顶部（旧→新）|文档高度（旧→新）|结果|\n|---|---|---|---|---|---|---|\n'
for r in scene:
 a,b=r['before'],r['after'];layout+=f'|{r["width"]}×{r["height"]}|{r["zoom"]}|double／120px|{max(c["bottom"] for c in a["cards"]):.2f} → {max(c["bottom"] for c in b["cards"]):.2f}|{a["dock"]["top"]:.2f} → {b["dock"]["top"]:.2f}|{a["scrollHeight"]} → {b["scrollHeight"]}|PASS|\n'
performance='|版本|连续回合|执行耗时 ms|DOM（前→后）|历史数|JS堆字节（单次）|\n|---|---:|---:|---|---:|---:|\n'
for r in perf['results']:
 s=r['sample'];performance+=f'|{r["version"]}|{s["rounds"]}|{s["durationMs"]:.2f}|{s["nodesBefore"]} → {s["nodesAfter"]}|{s["history"]}|{s["heapBytes"]}|\n'
report=f'''# 遗留代码治理与渐进重构实际报告

本轮完成 GP-010 公开道具命令的异步事务，以及攻击／防御、历史快照三批实际治理。**没有把所有遗留技术债标为已完成，也没有为减少行数而删除未证实安全的代码。**

## 起点、分支与回滚

- GitHub：`mylittleblover/godpower-html`，已 fetch 后识别最新远端 `refactor/v219-defense-lifecycle`，起点 `{meta['baseline']}`，而非旧 V2.18.15；V2.19.0 UI 和新增批量赋分均保留。
- 独立分支：`refactor/legacy-lifecycle`；原工作区干净，未覆盖无关修改。源代码冻结提交：`{source}`。完整验证状态及产物哈希见 `artifacts/refactor/final-status.json`。
- 逻辑提交：`e142e74` 异步命令；`6b5caa7` 攻击防御规范入口；`27a60d3` 历史模块；后续提交包含架构守卫、差分／布局／性能脚本、清单同步及报告。
- 回滚应切换对应提交并重新构建；不要清空 localStorage，不要把未知 schema 数据强行写回。原 baseline/V2.18.13.html 与所有历史提交保留。

## 已删除／替换代码及行为证据

|原实现|分类|替代与保留行为|验证|
|---|---|---|---|
|00/05/17/31/36 的 applyItemScore 多层捕获链|已被新实现取代／可安全删除|core/item-score.js 一个入口；显式保留喇叭先确认、基础防御摧毁、蘑菇确认、普通防御、伤害、110ms受击与批次积分队列|26精确结果＋464差分＋30异步命令|
|00/05/36 的 tryDefend 原实现和包装|重复实现／已被新实现取代|同一规范模块；幽灵持续保护、拒绝喇叭、羽毛、炮弹、星星／巨大蘑菇、幽灵一次保护、炸弹和主栏防御顺序保留；闪电特殊规则仍独立|464固定时间／随机数场景|
|recordHistory 三层、restoreStateFromSnapshot 两层、undoLast 两层|已被新实现取代／可安全删除|core/history.js 唯一实现；操作前快照、原字段、40条上限、旧键、炮弹和乌贼恢复计时器均保留|快照纯函数、批量原子撤销、连续撤销和UI恢复|
|typeof rollbackToHistory 的兼容安装块|确认无法触达／可安全删除|仓库没有该函数定义或其他调用；实际按钮用 revertToHistory，完整保留它|静态全仓库搜索和真实历史恢复|
|同步 runClassroomCommand 无待决事务|已被新实现取代|纯 CommandLifecycle＋浏览器适配器；待决时暂缓落盘／历史镜像；确认后同一命令提交；中断撤销整次攻击|控制器单元＋正常接受／拒绝／撤销／导入／切题／拒绝Promise／Quota／实际刷新|
|库存 normalize 每次重建已规范对象|已被新实现取代|合法对象保留身份，字段／次数规范化规则保留；避免正常界面渲染使防御令牌失效|真实 useItem 后 renderAll/ensureV2State 再接受确认|
|源码清单遗漏新模块|已确认并修复|src/manifest.json 与模板同步，scripts/check.mjs 校验78个源码块；同步脚本可重复执行|manifest-check.log；输出资源校验|

GP-010 基线缺陷已通过原始最新源码重新构建后在 Chromium 复现：`defense-baseline-probe.json` 两项为 REPRODUCED，而非正常通过。旧代码会先保存攻击者消耗，并在合法接受后仍保留防御道具。不是只按此前报告推断。

异步命令返回 true 表示已受理，`lastClassroomCommandResult.pending` 明确区分待决与完成。接受／拒绝完成同一次操作，撤销恢复双方库存和积分。等待中刷新读取最后完整存档，相当于取消未完成攻击。普通保存失败沿用现有“完整结果暂留内存＋持续警告”策略，不宣称落盘成功；严格导入和最终结算规则不变。

## 保留项与范围边界

{entry}

legacyUseItem 的14个定义仍保留，含有效的花类、连续使用、红龟壳无目标消耗、持续状态、All In和表现适配。renderGrid/renderAll 的排序、卡片状态、分数冻结和攻击渲染门也保留。CSS 的48份重复叶规则正文不能证明层叠等价，不删除；1691个!important并非本轮引入。音频／IndexedDB、自定义音轨、节拍和资源存储未重写。定时器／监听器完整静态索引已生成，尚未证明所有运行时退出路径均释放。

因此，**本轮不是26道具注册表、统一比赛状态机、所有音频资源作用域或全CSS治理的完成声明**。不安全删除一律保留并登记 GP-011/012/013/014、RF-001～005。

## 代码规模与覆盖链指标

{metrics}

指标口径：生产 src 的 script/core/ui/style JS和CSS，不含内置资源正文与测试；命名函数含局部作用域，重复名字不等于全局覆盖；包装器数为捕获已重定义函数的标识符别名，不能当作全部动态层数。CSS按静态叶规则索引，不做层叠等价断言。基线发行体积由起点源码重建计算，避免把起点仓库中旧dist错误当成新源码产物。

新增纯命令模块、规范接口和错误分支使行数／构建体积略增，但有效覆盖链和捕获别名减少。没有用体积下降作为删功能的理由。所有27个原始Base64资源完全保留，最终两个 HTML 内容一致，SHA256：`{sha}`。

## 实际验收矩阵

{checks}

完整命令：`npm run verify`。专项：`npm run test:refactor`。清单：`npm run audit:legacy`；通用源码索引：`npm run audit`；清单同步：`node scripts/sync-source-manifest.mjs`。

业务差分在真实Chromium运行新旧源码，但固定 Date.now 和 Math.random，并关闭渲染／音效以隔离规则；它不能代替UI和音频验收。4个原有异步缺陷组合不作为旧版正确结果接受，改用30项显式断言单独验证。没有删除失败断言或将BLOCKED计作PASS。

## 14小组验收基线

BATTLE_14_GROUPS_BASELINE：最新起点源码与当前源码分别在相同Chromium、视口、应用缩放、double模式、启用120px垫片和同一14组数据下测试。数据含长组名、12345678积分、负分、主次队列、冰冻／巨大蘑菇、已选答案、All In和不同颜色。逐卡记录位置宽高，所有必要按钮在卡片内；卡片、垫片、底栏几何容差1px且无新增文档滚动高度。

{layout}

截图：`artifacts/refactor/layout/before/` 与 `after/`；全部逐卡DOM测量：`artifacts/refactor/layout/battle-14-comparison.json`。另保留旧V2.18.15对照。**这些是合成验收配置，未取得用户实际配置，不能声称复现了其真实课堂配置。** 原页面已有的文档滚动与应用缩放行为未擅自修改。

## 性能观测

环境：Chromium `{perf['browser']}`，Node原生测试版本见 final-verify.log；本地HTTP、1920×1080、四组、真实开始／判定与写入，先旧后新、每项单次，无人工停表或虚构指标。

{performance}

分数严格断言每回合每组+2，历史上限40；没有为了性能关闭这些业务。耗时受并行测试、缓存、GC和执行次序影响，不据此宣布加速比例。堆是采样值，不是强制GC后的保留量；短时DOM稳定不能证明小时级无内存／监听泄漏。

## 离线、CI与已知限制

- 单文件可以构建；check验证53段脚本语法、27个内置资源与无远端script/link依赖。已加载HTTP文档切离线后实际作答、五页导航、归档和导出通过。file://被企业策略阻止，未宣称直接打开通过。
- 只执行Chromium；没有Firefox/WebKit测试，没有任何CircleCI操作，也未启动远端GitHub Actions。现有Actions仍为手动触发，checkout改为完整历史以支持固定提交差分，未执行远端工作流；本地verify为实际证据。
- 80/100/125%仅为现有应用CSS zoom；原生浏览器缩放仍未验证。真实音轨听感、所有上传资源组合、小时级压力和完整动态可达性仍有缺口。
- 原有单排名权重池诊断warning仍在，不修改概率来消除日志。完整矩阵结论不能扩展成“所有浏览器、所有26道具交互维度全通过”。
- 开发过程首次差分出现54个时间戳差异，修正为新旧相同的固定时钟后全量断言不变；首次待决备份引用失败已修正为深拷贝。日志与失败JSON保留，reload-timeout记录旧的普通reload超时，最终使用真实CDP ignoreCache reload并保持恢复断言。

## 交付与下一步

交付源码、锁文件、构建脚本、`dist/godpower.html`、完整遗留索引、测试、截图和维护文档；所有改动为独立可回滚提交，不覆盖真实课堂数据，不强推。按既有授权继续同步原私有Sites，权限不变；发布结果以最终工具回执为准。

下一阶段优先领取：GP-016损坏主存档恢复、GP-017补齐道具交互组合、GP-011分批迁移legacyUseItem、GP-012比赛状态机、GP-013/RF-003资源作用域、RF-001渲染入口收敛、RF-002按组件验证CSS去重、GP-015完整资源备份、RF-005在允许file协议的环境验收。每项均有具体来源、依赖和验收标准，见 MAINTENANCE_BACKLOG.md。
'''
Path('docs/REFACTORING_REPORT.md').write_text(report)
Path('docs/TEST_MATRIX.md').write_text('# 遗留治理最新测试矩阵\n\n完整证据、条件与限制见 [REFACTORING_REPORT.md](REFACTORING_REPORT.md)。历史矩阵保留在 [audit/TEST_MATRIX.md](audit/TEST_MATRIX.md)。\n\n'+checks)
Path('artifacts/refactor/acceptance-matrix.json').write_text(json.dumps({'sourceCommit':source,'sha256':sha,'nodeTests':unit,'results':rows,'blocked':['file protocol'],'notTested':['native browser zoom','manual audio listening','hours soak','all arbitrary configurations']},ensure_ascii=False,indent=2))
for path in ['docs/audit/TEST_MATRIX.md','docs/audit/ARCHITECTURE_AUDIT.md','docs/reports/ACCEPTANCE_REPORT.md']:
 p=Path(path);text=p.read_text();marker='## 2026-10-17 遗留治理最新验收'
 if marker not in text:p.write_text(text+f'\n\n{marker}\n\n原报告作为历史证据保留。本轮以 `079df31` 最新分支为起点，完成公开防御命令事务、攻击防御单入口与历史模块收拢。最新实际结果见 `docs/REFACTORING_REPORT.md`、`docs/TEST_MATRIX.md` 和 `artifacts/refactor/acceptance-matrix.json`；旧报告的 GP-010 OPEN 与旧测试数量不代表当前结果。\n')
print(json.dumps({'report':'docs/REFACTORING_REPORT.md','unit':unit,'chromiumScenarios':sum(r['count'] for r in rows),'sha256':sha}))
