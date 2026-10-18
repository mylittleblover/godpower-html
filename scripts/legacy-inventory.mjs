import { parse } from "acorn";
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { sourceAt } from "../tests/fixtures/source-at.mjs";
const baseline = process.env.LEGACY_BASELINE || "079df316a999ced4f598a3c3d0495786f9f8d0e8";
const artifactRoot = process.env.LEGACY_ARTIFACT_DIR || "artifacts/refactor";
const documentPath = process.env.LEGACY_DOCUMENT || "docs/LEGACY_CODE_INVENTORY.md";
const files = execFileSync(
  "git",
  ["ls-tree", "-r", "--name-only", baseline, "src"],
  { encoding: "utf8" },
)
  .trim()
  .split("\n")
  .filter((f) => /src\/(script|core|ui|style)\/.*\.(js|css)$/.test(f));
const baselineFiles=new Set(files);
for(const dir of ['src/core','src/script','src/style','src/ui']){
  for(const file of await readdir(dir))if(/\.(?:js|css)$/.test(file)&&!files.includes(dir+'/'+file))files.push(dir+'/'+file);
}
function walk(n, visit) {
  if (!n || typeof n !== "object") return;
  visit(n);
  for (const v of Object.values(n))
    if (Array.isArray(v)) {
      for (const x of v) walk(x, visit);
    } else if (v && typeof v === "object" && v.type) walk(v, visit);
}
function scan(s, file) {
  const functions = [],
    variables = [],
    effects = [],
    rules = [];
  if (file.endsWith(".css")) {
    for (const m of s.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const selector = m[1].trim();
      rules.push({
        file,
        line: s.slice(0, m.index).split("\n").length,
        selector,
        body: m[2].trim(),
        kind: selector.includes("@keyframes") ? "animation" : "css",
      });
    }
    return { functions, variables, effects, rules };
  }
  const ast = parse(s, { ecmaVersion: "latest", locations: true });
  walk(ast, (n) => {
    let fn, name, kind;
    if (n.type === "FunctionDeclaration") {
      fn = n;
      name = n.id?.name;
      kind = "declaration";
    }
    if (
      n.type === "AssignmentExpression" &&
      ["FunctionExpression", "ArrowFunctionExpression"].includes(n.right.type)
    ) {
      fn = n.right;
      name = s.slice(n.left.start, n.left.end);
      kind = "assignment";
    }
    if (
      n.type === "VariableDeclarator" &&
      ["FunctionExpression", "ArrowFunctionExpression"].includes(n.init?.type)
    ) {
      fn = n.init;
      name = s.slice(n.id.start, n.id.end);
      kind = "binding";
    }
    if (fn) {
      const calls = new Set();
      walk(fn.body, (x) => {
        if (x.type === "CallExpression")
          calls.add(s.slice(x.callee.start, x.callee.end));
      });
      functions.push({
        file,
        line: n.loc.start.line,
        name,
        kind,
        calls: [...calls],
        classification: file.startsWith("src/core/")
          ? "仍然必要"
          : "需要进一步测试",
      });
    }
    if (n.type === "VariableDeclarator") {
      variables.push({
        file,
        line: n.loc.start.line,
        name: s.slice(n.id.start, n.id.end),
        initializer: n.init
          ? s.slice(n.init.start, n.init.end).slice(0, 160)
          : "",
        classification: "需要进一步测试",
      });
    }
    if (n.type === "CallExpression") {
      const call = s.slice(n.callee.start, n.callee.end);
      if (
        /(^|\.)(setTimeout|setInterval|requestAnimationFrame|addEventListener|removeEventListener|clearTimeout|clearInterval|cancelAnimationFrame)$/.test(
          call,
        )
      )
        effects.push({
          file,
          line: n.loc.start.line,
          call,
          arguments: n.arguments.map((a) =>
            s.slice(a.start, a.end).slice(0, 180),
          ),
          classification: "需要进一步测试",
        });
    }
  });
  return { functions, variables, effects, rules };
}
async function collect(old) {
  const out = { functions: [], variables: [], effects: [], rules: [] };
  let bytes = 0,
    lines = 0,
    important = 0;
  for (const file of files) {
    if(old&&!baselineFiles.has(file))continue;
    if(!old&&!existsSync(file))continue;
    const s=old?execFileSync('git',['show',`${baseline}:${file}`],{encoding:'utf8',maxBuffer:16e6}):await readFile(file,'utf8');
    bytes += Buffer.byteLength(s);
    lines += s.split("\n").length;
    important += (s.match(/!important/g) || []).length;
    const rows = scan(s, file);
    for (const k of Object.keys(out)) out[k].push(...rows[k]);
  }
  const counts = {};
  for (const f of out.functions) counts[f.name] = (counts[f.name] || 0) + 1;
  const captures = out.variables.filter(
    (v) =>
      /^[\w$]+$/.test(v.initializer) &&
      out.functions.some(
        (f) => f.kind === "assignment" && f.name === v.initializer,
      ),
  );
  const cssCounts = {};
  for (const r of out.rules) {
    const key = r.selector + "{" + r.body + "}";
    cssCounts[key] = (cssCounts[key] || 0) + 1;
  }
  return {
    ...out,
    metrics: {
      sourceBytes: bytes,
      sourceLines: lines,
      functionDefinitions: out.functions.length,
      duplicateNames: Object.values(counts).filter((n) => n > 1).length,
      extraDefinitions: Object.values(counts).reduce((n, v) => n + v - 1, 0),
      capturedWrapperAliases: captures.length,
      timerAndListenerCalls: out.effects.length,
      cssLeafRules: out.rules.length,
      exactRepeatedCssBodies: Object.values(cssCounts).reduce(
        (n, v) => n + v - 1,
        0,
      ),
      important,
      buildBytes:old?Buffer.byteLength(sourceAt(baseline)):(await readFile('dist/godpower.html')).length,

    },
    redefinitions: Object.fromEntries(
      Object.entries(counts).filter(([, n]) => n > 1),
    ),
    wrapperAliases: captures,
  };
}
const before = await collect(true),
  after = await collect(false);
// Equal selector/body pairs are duplicates only syntactically, never a deletion proof.
const cssSeen=new Set();
for(const rule of after.rules){const signature=rule.selector+'{'+rule.body+'}';rule.classification=cssSeen.has(signature)?'重复实现（仅语法；层叠需进一步测试）':'需要进一步测试';cssSeen.add(signature);}
const removed = before.functions.filter(
  (x) => !after.functions.some((y) => y.name === x.name && y.file === x.file),
);
await mkdir(artifactRoot, { recursive: true });
await writeFile(
  `${artifactRoot}/legacy-inventory.json`,
  JSON.stringify({ baseline, before, after, removed }, null, 2),
);
const esc = (s) =>
  String(s).replaceAll("|", "／").replaceAll("\n", " ").replaceAll("`", "");
let md = `# 遗留代码依赖与治理清单\n\n基线：\`${baseline}\`。由 \`node scripts/legacy-inventory.mjs\` 生成。范围：全部旧版脚本、core、UI 与 CSS；资源内容另由构建完整性检查验证。\n\n分类词汇：仍然必要、已被新实现取代、重复实现、确认无法触达、需要进一步测试、可安全删除。**未证明安全的项目默认需要进一步测试并保留；没有调用者的静态结果不等于不可达，HTML、字符串事件及延迟回调仍可能调用它。**\n\nJSON 包含每个命名函数的调用依赖、变量初始化、计时器及监听器的参数、全部 CSS 叶规则正文。命名函数包含局部定义，重复名字不等于全局覆盖；包装器指标为捕获函数标识符的别名数量，不能当作完整运行时覆盖层数。\n\n## 规模观察\n\n|指标|基线|当前|\n|---|---:|---:|\n`;
for (const k of Object.keys(before.metrics))
  md += `|${k}|${before.metrics[k]}|${after.metrics[k]}|\n`;
md+='\n## 已证明可替换／不可达的旧入口\n\n|原位置|实现|分类|依据|\n|---|---|---|---|\n';
for(const row of removed)md+=`|${row.file}:${row.line}|${esc(row.name)}|${row.name==='rollbackToHistory'?'确认无法触达／可安全删除':'已移除（需结合本轮治理报告）'}|${row.name==='rollbackToHistory'?'全仓库无定义或调用，typeof 分支恒不执行':'仅表示静态清单中已不存在；安全依据及本轮实际测试见REFACTORING_REPORT.md，不能以历史测试代替本轮证据'}|\n`;
md+='\n## 模块保留决策\n\n|文件|分类|保留理由|\n|---|---|---|\n';
for(const file of files.filter(f=>existsSync(f)))md+=`|${file}|${file.startsWith('src/core/')?'仍然必要':'需要进一步测试'}|${file.startsWith('src/core/')?'当前规范、命令、攻击防御、快照或兼容接口的唯一实现':'仍含有效调用路径或层叠行为；不因旧版号／重复正文删除，逐组件证明后再迁移'}|\n`;
md +=
  "\n## 全部脚本／函数及调用依赖\n\n|位置|名称|类型|分类|直接及嵌套调用（不表示均已执行）|\n|---|---|---|---|---|\n";
for (const x of after.functions)
  md += `|${x.file}:${x.line}|${esc(x.name)}|${x.kind}|${x.classification}|${esc(x.calls.join(", "))}|\n`;
md +=
  "\n## 捕获别名与覆盖链\n\n|位置|别名|捕获的旧入口|分类|\n|---|---|---|---|\n";
for (const x of after.wrapperAliases)
  md += `|${x.file}:${x.line}|${esc(x.name)}|${esc(x.initializer)}|需要进一步测试|\n`;
md +=
  "\n## 变量（包括全局候选与局部变量，作用域需结合源码）\n\n|位置|绑定|初始化表达式|分类|\n|---|---|---|---|\n";
for (const x of after.variables)
  md += `|${x.file}:${x.line}|${esc(x.name)}|${esc(x.initializer)}|${x.classification}|\n`;
md +=
  "\n## 动画、计时器、事件监听注册与清理\n\n|位置|调用|参数摘要|分类|\n|---|---|---|---|\n";
for (const x of after.effects)
  md += `|${x.file}:${x.line}|${esc(x.call)}|${esc(x.arguments.join("; "))}|${x.classification}|\n`;
md +=
  "\n## 全部 CSS 叶规则\n\n重复正文不直接删除，必须检查层叠上下文、媒体条件、动画定义顺序和状态触发。\n\n|位置|选择器／动画步骤|分类|\n|---|---|---|\n";
for (const x of after.rules)
  md += `|${x.file}:${x.line}|${esc(x.selector)}|${x.classification}|\n`;
md +=
  "\n## 人工验证与实际治理决策\n\n详见 [REFACTORING_REPORT.md](REFACTORING_REPORT.md) 的替代行为表及对应测试。未出现在安全删除记录中的 CSS、音频、渲染和 legacyUseItem 包装层均保留，不以旧版本号作为删除依据。全部独立 keyframes 名称、模板及字符串内联事件入口也见 SOURCE_CATALOG.md；当前索引不是完整作用域解析或动态可达性证明。\n";
await writeFile(documentPath, md);
console.log(JSON.stringify({ before: before.metrics, after: after.metrics }));
