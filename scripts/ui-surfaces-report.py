"""Collect executed UI evidence without replacing previous release evidence."""
from pathlib import Path
import json, hashlib, subprocess, re, shutil, datetime
root=Path('artifacts/visual-unification')
sha=hashlib.sha256(Path('dist/godpower.html').read_bytes()).hexdigest()
def suite(path, expected, exact=False):
    value=json.loads(Path(path).read_text()); rows=value if isinstance(value,list) else value['results']
    assert len(rows)==expected,(path,len(rows),expected)
    assert all(x.get('status')=='PASS' for x in rows),(path,[x for x in rows if x.get('status')!='PASS'])
    if isinstance(value,dict):
        assert not value.get('errors') and not value.get('pageErrors'),path
        if exact: assert value['sha256']==sha,(path,value.get('sha256'),sha)
    return {'path':path,'count':expected,'status':'PASS','sha256':value.get('sha256') if isinstance(value,dict) else None}
rows=[
 ('五页分层/导航/历史/档案/窗口内容','artifacts/desktop-ui/results.json',31,False),
 ('交互、焦点、道具UI与异步取消','artifacts/desktop-ui/interactions.json',21,False),
 ('11窗口 × 3尺寸 × 3档应用缩放','artifacts/desktop-ui/modal-matrix.json',99,False),
 ('新增表面、实际动画与页面场景',str(root/'acceptance/results.json'),25,True),
 ('档案搜索/筛选/留白与进入比赛',str(root/'acceptance/archive-controls.json'),9,True),
 ('页面/飞入/展开/拉杆/真实结果与学号',str(root/'motion/results.json'),18,True),
 ('真实未作答警告及取消/继续/替换',str(root/'warnings/results.json'),13,True),
 ('实际口令、错误层级、回车与取消',str(root/'admin/results.json'),3,True),
 ('离线断网、正常计分、导出与控制台','artifacts/desktop-ui/release-smoke.json',4,True),
 ('14组合成布局前后精确对比',str(root/'acceptance/layout/battle-14-comparison.json'),3,False),
]
checks=[dict(name=name,**suite(path,n,exact)) for name,path,n,exact in rows]
unit=(root/'acceptance-unit.log').read_text();assert re.search(r'pass\s+90',unit) and re.search(r'fail\s+0',unit),unit[-800:]
assert Path('dist/godpower.html').read_bytes()==Path('dist/index.html').read_bytes()
# Retain the actual output of new runs while preserving the old release's paths.
captured=[]
paths=set(subprocess.check_output(['git','diff','--name-only','-z','--','artifacts']).decode().split('\0'))
paths.update(x['path'] for x in checks if not x['path'].startswith(str(root)+'/'))
for name in paths:
    if not name or name.startswith(str(root)+'/'):continue
    src=Path(name)
    if not src.is_file():continue
    dest=root/'captured'/src;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(src,dest)
    captured.append({'original':name,'captured':str(dest),'sha256':hashlib.sha256(src.read_bytes()).hexdigest()})
for check in checks:
    if not check['path'].startswith(str(root)+'/'):
        check['originalPath']=check['path'];check['path']=str(root/'captured'/check['path'])
(root/'captured-index.json').write_text(json.dumps(captured,ensure_ascii=False,indent=2)+'\n')
metrics={'baselineCommit':'f2b39e64742f5fa546283ce900c3c4202962bb30','productionCommit':subprocess.check_output(['git','rev-parse','HEAD']).decode().strip(),'finalBytes':Path('dist/godpower.html').stat().st_size,'sha256':sha,'baselineBytes':len(subprocess.check_output(['git','show','f2b39e6:dist/godpower.html'])),'importantBefore':0,'importantAfter':0}
for p in Path('src').rglob('*.css'):
    metrics['importantAfter']+=p.read_text().count('!important')
    old=subprocess.run(['git','show',f'f2b39e6:{p}'],capture_output=True)
    if old.returncode==0:metrics['importantBefore']+=old.stdout.decode().count('!important')
(root/'acceptance-summary.json').write_text(json.dumps({'recordedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'metrics':metrics,'unit':{'pass':90,'fail':0},'suites':checks,'chromiumScenarios':sum(x['count'] for x in checks)},ensure_ascii=False,indent=2)+'\n')
table='\n'.join(f"| {x['name']} | Chromium 实际执行 | {x['count']} | PASS | `{x['path']}` |" for x in checks)
report=f'''# 全局 UI 与动效验收报告

日期：2026-10-18。实际版本 V2.19.0；起点 `{metrics['baselineCommit']}`，生产源码 `{metrics['productionCommit']}`。分支 `feat/desktop-visual-unification`。仅使用 Chromium，未执行 CircleCI 或其他远端 CI。

## 已交付

统一顶栏、比赛底栏和小组卡片表面，保留卡片几何、垫片、列数、缩放及原业务。历史/档案使用首页风格标题与白色卡片，正文独立滚动；档案搜索与排序为新组件，空状态按钮增加24px间距。

五页分层入场；启动五个导航标签依次自上而下出现。功能窗口使用非线性向上飞入，位移根据可用空间限制，统一34px圆形叉号。原生details按真实高度动画展开/收起；快速切换、关闭或减少动态效果会清理。新组件由 `ui/application-surfaces.css`、现有 DesktopUI/WelcomeV2 命名空间拥有，没有新增全局函数覆盖链。

点名为离线SVG老虎机，原按钮变为拉杆；三模式使用原随机结果，1000ms减速后显示真实姓名。减速不调用业务随机数；主轮转、减速候选与最终结果复用原学号格式和小组颜色，缩短姓名窗口以减少空白。关闭/换模式取消表现，未重算结果或更改奖励。

真实“作答尚未完成”旧确认窗接入统一焦点、层级与取消生命周期，保留返回检查/继续选定规则，清理按键监听器并在重复打开时取消前次待决确认。口令窗的错误提示按焦点栈置顶；回车提交阻止默认点击误关闭新提示。错误、正确、叉号和Escape均实际验证。

## 最终构建和测试

最终 HTML：{metrics['finalBytes']:,}字节；基线 {metrics['baselineBytes']:,}字节；SHA256 `{sha}`。`dist/index.html` 与离线发行包一致。54个脚本解析、81个源码块匹配、27份原始内嵌资源完整性验证通过。CSS 文件中的 `!important`：{metrics['importantBefore']} → {metrics['importantAfter']}，没有增加。

Node单元/集成：90 PASS，0 FAIL。当前回归中 {sum(x['count'] for x in checks)} 个 Chromium 场景全部 PASS，0未捕获错误；不同套件可能覆盖相同业务，数量不表示独立功能数。

| 功能/场景 | 测试类型 | 场景数 | 结果 | 原始输出路径 |
|---|---|---:|---|---|
{table}

`captured-index.json` 映射旧输出路径到本轮 `captured/` 副本，保留上次发布的历史截图/报告，未用当前截图覆盖历史证据。新专项JSON带产物SHA；旧套件通过本轮固定生产源码执行。截图位于 `artifacts/visual-unification/acceptance/`、`motion/`、`warnings/`、`admin/` 和 `captured/artifacts/desktop-ui/`。

## 14组布局

与 f2b39e6 在同一视口、应用缩放、双列和120px垫片下比较三档尺寸。逐卡位置、宽高、必要按钮边界、垫片和底栏高度、滚动高度均通过原断言；没有增加滚动要求。实际教师课堂配置仍未知，合成配置不等同于已复现教师设备。完整测量和修改前后截图见 `acceptance/layout/`。

## 阶段回归

前置业务命令套件：117业务场景、26道具规则对照、3保存失败/正常计分、10异步防御、1批量赋分均通过；当前 UI 改动未改计分/道具参数/存储schema。设置专项15项通过，涵盖所有控件保留、9音乐选项、30音效编辑器、真实WAV导入导出及重新加载。阶段结果在 `business-final.log`、`settings-shipping.log`；其运行期间UI有后续调整，不冒充最终产物的完整业务重跑。

## 发现、修复与失败复测

- 新标题区说明被旧高优先级文字色覆盖：拆分标题说明类，截图复查对比度。
- 大量历史或展开快照撑高页面：按换算视口高度限制页面，正文独立滚动；0/1/40记录复测通过。
- 125%时大窗口的飞入越过屏幕：约束老虎机高度并按剩余空间限制位移，99窗口矩阵复测通过。
- 异步页面入场尚在requestAnimationFrame队列时计数为零：动画生命周期计数包含待启动帧，严格零残留断言继续保留。
- 口令窗压住错误提示：视觉层级与现有焦点栈一致，错误提示真正可点击。
- 错误口令回车立即关闭提示：阻止口令输入的回车默认激活；三尺寸真实流程通过。
- 减速滚轮丢学号样式/空白过多：复用原学生格式化并收紧机身窗口，真实抽取、颜色与9尺寸缩放组合通过。

开发日志中的FAIL保留：`focused.log`（测试选择器/键盘操作修正）、`focused-shipping.log`（真实历史高度缺陷）、`modal-shipping.log`（真实飞入越界）、`pages-shipping.log`和`validated-pages.log`（过时单动画假设及待启动帧竞态）、`admin.log`（真实回车吞提示）。未删除失败断言来掩盖功能回归；页面入场按新分层动效等待完成，最终仍严格断言0残留。最终状态以本报告及acceptance日志为准。

## 限制

- file:// 首次打开被当前企业浏览器策略 `ERR_BLOCKED_BY_ADMINISTRATOR` 阻止，标记 BLOCKED；未绕过策略。HTTP载入后断网的导航、正常加分、窗口和真实CSV导出已通过。
- 80/100/125%是程序的CSS应用缩放，浏览器工具栏原生缩放未测。仅 Chromium；Firefox/WebKit不在本次范围。
- 截图由真实Chromium生成，代表界面已查看；未逐像素人工核对每张截图，也没有声称建立全量像素差分门禁。
- 实际教师14组配置、人工听感、长时间浸泡和新性能基准仍未执行。没有将截图数量作为全部功能通过证明，没有运行 `npm run verify` 全链。
- 既有数据/音频导入校验等技术债见 MAINTENANCE_BACKLOG，未在此次视觉任务中宣称消除。

## 复现与后续

执行 `npm run build && npm run check && npm test`，以及 `npm run test:surfaces`；单独执行 desktop-ui、desktop-interactions、desktop-modal-matrix、release-smoke。14组测试设置 BATTLE_BASELINE_COMMIT=f2b39e64742f5fa546283ce900c3c4202962bb30，并单独指定 BATTLE_ARTIFACT_DIR，防止覆盖历史基线。每次发布保持离线发行、更新维护列表和相同Sites页面。
'''
Path('docs/reports/APPLICATION_SURFACES_ACCEPTANCE.md').write_text(report)
Path('docs/audit/APPLICATION_SURFACES_TEST_MATRIX.md').write_text('# 全局界面验收矩阵\n\n'+f'Node：90 PASS。Chromium：{sum(x["count"] for x in checks)} PASS。细分结果与截图见各JSON。\n\n| 功能/场景 | 类型 | 数量 | 状态 | 证据 |\n|---|---|---:|---|---|\n'+table+'\n\nBLOCKED：file:// 初次打开；NOT TESTED：浏览器工具栏原生缩放、教师真实14组配置、听感与长时间性能；不计入PASS。\n')
print(json.dumps({'unit':90,'chromium':sum(x['count'] for x in checks),'sha256':sha,'capturedFiles':len(captured)},ensure_ascii=False))
