"""Build an evidence-backed UI report; never turn missing/failed evidence into PASS."""
from pathlib import Path
import json, hashlib, subprocess, datetime, re
root=Path('.')
def read(p):return json.loads(Path(p).read_text())
def group(p):
 d=read(p);return d['results'] if isinstance(d,dict) else d
sets=[('业务 Chromium','artifacts/browser-results.json',117),('道具精确结果','artifacts/rule-oracles.json',26),('存储失败与答对计分','artifacts/scoring-persistence-results.json',3),('桌面页面与交互','artifacts/desktop-ui/results.json',31),('界面专项','artifacts/desktop-ui/interactions.json',21),('窗口尺寸与键盘','artifacts/desktop-ui/modal-matrix.json',99),('14 组几何保护','artifacts/desktop-ui/battle-14-comparison.json',3),('离线与控制台','artifacts/desktop-ui/release-smoke.json',4)]
rows=[];matrix=[]
for name,path,count in sets:
 data=group(path)
 if len(data)!=count:raise SystemExit(f'{path}: expected {count} actual {len(data)}; refusing stale/incomplete report')
 passed=sum(x['status']=='PASS' for x in data);failed=sum(x['status']=='FAIL' for x in data)
 rows.append((name,len(data),passed,failed,path))
 for i,x in enumerate(data):matrix.append({'suite':name,'name':x.get('name') or x.get('key') or x.get('id') or str(i+1),'width':x.get('width'),'height':x.get('height'),'zoom':x.get('zoom'),'status':x['status'],'evidence':path})
 if failed:raise SystemExit(f'{path}: failures remain; report not signed off')
html=Path('dist/godpower.html').read_bytes();sha=hashlib.sha256(html).hexdigest()
if read('artifacts/desktop-ui/release-smoke.json')['sha256']!=sha:raise SystemExit('Release smoke SHA differs from artifact; rerun smoke')
if html!=Path('dist/index.html').read_bytes():raise SystemExit('Release HTML files differ')
log=Path('artifacts/final-acceptance.log').read_text();unit_count=re.search(r'ℹ tests (\d+)',log);unit_pass=re.search(r'ℹ pass (\d+)',log);unit_fail=re.search(r'ℹ fail (\d+)',log)
if not(unit_count and unit_pass and unit_fail) or int(unit_fail[1]):raise SystemExit('No successful unit test summary')
code_commit=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()
base='378f2d23d180802171a8e7d237fe1fb631ee3318';date=datetime.datetime.now(datetime.timezone.utc).isoformat()
shots=list(Path('artifacts/desktop-ui').rglob('*.png'))
perf=read('artifacts/performance-chromium.json');browser=read('artifacts/browser-results.json')['browser'];layouts=read('artifacts/desktop-ui/battle-14-comparison.json')
report=f'''# V2.19.0 桌面 UI 整改验收记录

生成时间：{date}。实际起点 V2.18.15 / `{base}`；最终 HTML 版本 V2.19.0。实现分支 `feat/desktop-ui-system`，报告生成时实现提交 `{code_commit}`；后续证据/文档提交不改变 HTML。

## 交付

- 单文件：`dist/godpower.html`；Sites 入口 `dist/index.html`，二者字节相同。
- SHA-256：`{sha}`；大小 {len(html):,} 字节。
- 设计规范：`docs/ui/DESIGN_SYSTEM.md`；用户要求的 15 条长期约束完整写入 `docs/ui/UI_DEVELOPMENT_CONSTRAINTS.md`。
- 新模型/组件：`src/ui/model.js`、`src/ui/desktop.js`、`src/ui/desktop.css`。既有源码中的显式 UI 钩子、导航/底栏/窗口规则原位置修订；不改积分、道具概率、历史快照、存储 schema 或归档清零规则。
- 截图：`artifacts/ui-baseline/` 原始参考；`artifacts/desktop-ui/` 当前桌面及窗口证据（{len(shots)} 张 PNG）。
- Git 修改按实现、已确认的回归修复、证据/文档分批提交。基线保留可回滚。

## 已实施与修复

| 任务 | 实施结果 | 实际证据与边界 |
| --- | --- | --- |
| 00 全局 UI | 统一变量/五页 SVG 导航；比赛栏只在比赛页显示，隐藏入口不能触发命令；低频管理收进菜单；Toast 顶层 | 五页及陈旧按钮点击测试；Toast 位于功能/确认弹窗之上 |
| 01 欢迎 | 日期与问候、实时横向小组卡、离线日期轮换、知识/道具/荣誉/挑战及设置；保留原统计/图表 | 0/1/2/4/8/16 组、长名/大分、滚动/点击、挑战不计分、自然日模型；不虚构班级名 |
| 02 比赛 | 保留布局、垫片/排名占用、分栏/缩放/批量栏；工具栏分组及状态反馈 | 同一三组合成配置前后 14 组逐卡几何与必要按钮边界；用户实际课堂配置未验证 |
| 03 历史 | 真实操作前快照时间轴、积分/名次/库存/持续/回合差异、查看与恢复分离确认 | 0/1/40 条及连续恢复语义；不把最近操作前快照冒充当前状态 |
| 04 档案 | 实际归档概览、搜索/排序、详情/前三名/原始 JSON、保留 CSV/删除流程 | 0/1/24 届、旧字段缺失、长名、同分顺序、冠军居中及真实下载；不重新定义排名 |
| 05 设置 | 左侧八分类/右侧滚动，搬移原节点保留 ID/事件/存储键，新增真实 UI 偏好和本地题库 | 原控件 ID 清单对比、八分类截图/滚动/重载偏好；资源控件尚未逐条完成全部文件组合 |
| 07 点名 | 三列模式/结果/统计奖励；原三模式、抽取池与奖励；结果缓动锁定 | 真正 start/stop/reward、耗尽、关闭/重开、音频准备中重复点击及换模式取消；动画不使用 RNG 决定结果 |
| 09 道具 UI | 主次队列、真实限制原因/说明、比例图片、事件接口及可中断特效 | 26 种定义逐一 UI 状态与真实表现函数；另有 26 种精确规则结果；没有人工听感冒充自动化 |
| 10 窗口与结算 | 分类型窗口、焦点栈/捕获/Tab/Escape/多层关闭；真实保存中/失败/成功/可跳过庆祝 | 11 种重要窗口×三桌面×三应用缩放共 99 组合；存储失败不清零；取消排队结算不执行旧请求 |

本轮额外复现并修复：旧设置安装器再次包装造成空白；125% 应用缩放详情窗越界；自定义导航/底栏图标被覆盖或还原丢失标签；欢迎页遮蔽到期更新及幽灵/羽毛状态；隐藏卡片继续启动特效；旧回调抢走弹窗焦点；浏览器默认 favicon 请求造成离线控制台错误。

## 实际测试

运行环境：Chromium {browser}、Linux、Node 24；只使用 Chromium。未执行 Firefox/WebKit 或任何 CircleCI 操作。测试存储与用户课堂隔离。

Node：{unit_count[1]} 项，PASS {unit_pass[1]}、FAIL {unit_fail[1]}。新增纯模型覆盖日期稳定性、跨日边界、空数据、题库拒绝、真实快照差异。

| 套件 | 执行条目 | PASS | FAIL | 证据 |
| --- | ---: | ---: | ---: | --- |
'''
for name,count,passed,failed,path in rows:report+=f'| {name} | {count} | {passed} | {failed} | `{path}` |\n'
report+='''
条目是场景或组合检查，不等于独立功能数。截图/语法成功不计作业务规则通过；被阻塞或未测项目不加入 PASS。完整可机读矩阵见 `artifacts/desktop-ui/acceptance-matrix.json`。命令 `npm ci && npm run verify`；`npm run test:ui` 运行 UI 全套。

## 14 组布局与桌面尺寸

基线标识 `BATTLE_14_GROUPS_BASELINE`。用户实际配置 `userActualConfigurationVerified=false`；下面均为明确的合成配置，不冒称用户课堂现场。

| 视口 | 应用缩放 | 列模式 | 垫片 | 原版/新版全部 14 组 | 最大卡片几何差异 | 页面滚动高度原/新 |
| --- | --- | --- | --- | --- | --- | --- |
'''
for x in layouts:
 a,b=x['before'],x['after'];delta=max(abs(c[k]-d[k]) for c,d in zip(a['cards'],b['cards']) for k in ['x','y','width','height']);report+=f"| {x['width']}×{x['height']} | {x['zoom']*100:g}% | double | 120px | PASS / PASS | {delta:.3f}px | {a['scrollHeight']} / {b['scrollHeight']} |\n"
report+='''
原版已有的页尾留白或滚动高度没有被宣称为零滚动。本轮要求没有增加滚动需求，最后一排和每组必要按钮仍可见。详细坐标、列数/间距、排名区/底栏和逐卡数据见 `docs/ui/BATTLE_14_GROUPS_BASELINE.md` 及原始 JSON。

三分辨率分别执行五页、导航、空/数据/边界及重要窗口检查，应用缩放 80%/100%/125% 均有截图与边界证据。原生浏览器工具栏缩放没有被替代计为通过。

## 离线、存储与兼容

- PASS：两份单文件字节一致；50 脚本块语法通过；27 个原始 Base64 资源完整保留，新增导航/站点图标均内嵌 SVG；没有新的运行时 CDN/API。
- PASS：HTTP 完整载入后断网，五页导航、真实答对计分、主要窗口、归档/CSV 下载可执行；代表性全页与窗口无未捕获错误、无 console.error、无外部运行时请求。
- PASS：配额不足/启动读取被拒时正常计分保留并可导出；恢复存储后硬重载保持分数；归档失败仍不清零。旧备份/新版往返与导入错误不修改原状态沿用业务回归。
- BLOCKED：file:// 初次直接打开被当前环境 Chromium 管理策略以 ERR_BLOCKED_BY_ADMINISTRATOR 阻止；没有修改策略或声称通过。可在正常桌面环境运行 `npm run test:file`。
- BLOCKED：无头环境不能取得原生浏览器缩放设置 WebUI/扩展控制。已测试程序缩放，原生 Ctrl+/Ctrl− 与 80/125% 的组合仍须有头 Chromium 人工复核。
- NOT TESTED：真实 iOS、其他浏览器、人工听辨、每一个资源控件的全部上传/损坏/大文件组合与数小时音频运行。本轮按用户要求聚焦桌面 Chromium。

在未修改的起点和修改版中都复现过测试 HTTP 大文件重载缓存超时，保留 `artifacts/debug-baseline-reload.log` 等日志。测试服务禁用缓存，持久化恢复用真正的 Chromium 硬重载验证，未删除分数断言。

控制台保留一条既有“道具权重池缺失”诊断警告，来自旧单排名样本检查；它不能单独证明全局掉落缺失。未修改掉落规则，需结合现有 GP 道具测试待办跨排名/冷却状态核验。密码输入未包 form 的 Chromium 提示记录为 verbose，不冒充脚本异常。

## 性能与视觉差异

'''
report+=f"100 回合场景用时 {perf['durationMs']:.2f}ms；20/50/100 回合 DOM 节点分别为 "+' / '.join(str(x['nodes']) for x in perf['samples'])+f"；历史分别为 "+' / '.join(str(x['history']) for x in perf['samples'])+f"。浏览器暴露的堆样本 {perf['heap']} 字节，仅为单次样本，不能据此声称无长期泄漏。完整测量见 `artifacts/performance-chromium.json`。\n\n"
report+='''欢迎/历史/档案/设置结构变化属于预期设计；导航与底栏分组/图标也属预期。比赛卡片外边界、垫片和底栏高度以 DOM 对比保护；不通过更新全部截图掩盖回归。字体和抗锯齿跨机器差异仍需人工签核稳定视觉基线。截图目录内早期失败证据保留，最终结果以本报告列出的最终 JSON 为准。

## 尚未完成与下一阶段

无已知未解决的本轮 P0 数据清零缺陷；这不表示所有历史规则组合、文件资源和长期场景均验证完毕。原有全局函数覆盖链和高优先级旧 CSS 仍保留，迁移计划见维护列表，不宣称完成整体业务架构重写。

优先顺序：UI-101 真实课堂 14 组配置 → UI-102 原生浏览器缩放 → UI-103 逐资源控件往返 → UI-106 无障碍名称/对比度 → UI-104 旧表现覆盖链 → UI-105 长时性能 → UI-107 UI 配置可移植备份 → UI-108 人工签核视觉基线。既有 GP 数据/规则待办继续保留。

远端 CI 未触发；本地 `npm run verify` 是本轮证据来源。未执行 CircleCI 相关操作，也未购买任何服务。

既有 Sites： https://godpower-classroom-test.youziming233.chatgpt.site 。发布复用原 project_id 与私有受众；精确源提交/发布结果由最终交付消息记录，发布不冒充浏览器或业务测试。
'''
Path('docs/reports/DESKTOP_UI_ACCEPTANCE.md').write_text(report)
Path('artifacts/desktop-ui/acceptance-matrix.json').write_text(json.dumps({'generatedAt':date,'sha256':sha,'rows':matrix,'blocked':['file URL initial load','native browser toolbar zoom'],'notTested':['human audio acceptance','all resource-control file combinations','hours-long profiling']},ensure_ascii=False,indent=2))
# Detailed measured geometry, all fourteen cards at every baseline.
md='# BATTLE_14_GROUPS_BASELINE\n\n用户实际课堂配置未验证；下面全部是同提交/同数据对照的合成配置。源提交 '+base+'。\n'
for x in layouts:
 a,b=x['before'],x['after'];md+=f"\n## {x['width']}×{x['height']}，应用缩放 {x['zoom']*100:g}%\n\n多列，垫片启用且为 120 CSS px，原/新状态 {x['status']}。\n\n网格列：`{a['columns']}` → `{b['columns']}`；间距 `{a['gap']}` → `{b['gap']}`。排名/垫片物理高度 {a['spacer']['height']} → {b['spacer']['height']}；底栏顶部 {a['dock']['top']} → {b['dock']['top']}。\n\n| 组 | 原 x/y/w/h | 新 x/y/w/h | 必要按钮数量 |\n| --- | --- | --- | --- |\n"
 for i,(c,d) in enumerate(zip(a['cards'],b['cards'])):md+=f"| {i+1} | "+' / '.join(f'{c[k]:.3f}' for k in ['x','y','width','height'])+' | '+' / '.join(f'{d[k]:.3f}' for k in ['x','y','width','height'])+f" | {len(d.get('buttons',[]))} |\n"
 md+=f"\n原始截图：`artifacts/ui-baseline/battle-14-{x['width']}.png`；修改后：`artifacts/desktop-ui/battle-14-{x['width']}.png`。\n"
Path('docs/ui/BATTLE_14_GROUPS_BASELINE.md').write_text(md)
# Latest report pointers preserve the historical audit and acceptance text.
for fn in ['docs/reports/ACCEPTANCE_REPORT.md','docs/audit/UI_AUDIT.md','docs/audit/TEST_MATRIX.md','docs/audit/ARCHITECTURE_AUDIT.md']:
 p=Path(fn);text=p.read_text();pointer='> 最新桌面 UI 交付：见 `docs/reports/DESKTOP_UI_ACCEPTANCE.md`、`docs/ui/DESIGN_SYSTEM.md` 和 `artifacts/desktop-ui/acceptance-matrix.json`。以下原始审查结论保留为历史记录。\n\n';
 if pointer not in text:p.write_text(pointer+text)
print(json.dumps({'report':'docs/reports/DESKTOP_UI_ACCEPTANCE.md','sha256':sha,'node':int(unit_count[1]),'chromiumScenarios':sum(x[1] for x in rows),'screenshots':len(shots)},ensure_ascii=False))
