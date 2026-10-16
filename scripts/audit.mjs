import {parse} from 'acorn';import {readFile,readdir,writeFile} from 'node:fs/promises';
const entries=[],keys=new Set(),frames=new Set(),counts={},handlers=new Set(),fields=new Set();
const textSource=[];
for(const dir of ['src/script','src/core'])for(const f of await readdir(dir)){
 if(!f.endsWith('.js'))continue;const path=`${dir}/${f}`,s=await readFile(path,'utf8');textSource.push(s);
 for(const m of s.matchAll(/['"]((?:politics|godpower)_[a-zA-Z0-9_]+)['"]/g))keys.add(m[1]);
 for(const m of s.matchAll(/(?:state|g)\.([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g))fields.add(m[1]);
 for(const m of s.matchAll(/on(?:click|change|input|keydown)=["']([^"']+)/g))handlers.add(m[1]);
 const ast=parse(s,{ecmaVersion:'latest',locations:true});
 function collect(n){let calls=new Set(),stateFields=new Set(),returns=[];function walk(x){if(!x||typeof x!=='object')return;if(x.type==='CallExpression'&&x.callee.type==='Identifier')calls.add(x.callee.name);if(x.type==='MemberExpression'&&['state','g'].includes(x.object?.name)&&x.property?.name)stateFields.add(x.property.name);if(x.type==='ReturnStatement')returns.push(x.argument?s.slice(x.argument.start,x.argument.end).slice(0,100):'void');for(const v of Object.values(x))if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object'&&v.type)walk(v)}walk(n.body);return {calls:[...calls],stateFields:[...stateFields],returns}}
 function walk(n){if(!n||typeof n!=='object')return;let fn,name;
 if(n.type==='FunctionDeclaration'&&n.id){fn=n;name=n.id.name}
 if(n.type==='AssignmentExpression'&&n.left.type==='Identifier'&&['FunctionExpression','ArrowFunctionExpression'].includes(n.right.type)){fn=n.right;name=n.left.name}
 if(fn){counts[name]=(counts[name]||0)+1;entries.push({name,file:path,line:n.loc.start.line,params:fn.params.map(x=>s.slice(x.start,x.end)),...collect(fn)})}
 for(const v of Object.values(n))if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object'&&v.type)walk(v)}walk(ast);
}
for(const f of await readdir('src/style'))for(const m of (await readFile('src/style/'+f,'utf8')).matchAll(/@keyframes\s+([\w-]+)/g))frames.add(m[1]);
const template=await readFile('src/index.template.html','utf8');for(const m of template.matchAll(/on(?:click|change|input|keydown)="([^"]+)"/g))handlers.add(m[1]);
const ids=[...template.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);
const summary={definitions:entries.length,uniqueFunctions:Object.keys(counts).length,redefinitions:Object.fromEntries(Object.entries(counts).filter(([,v])=>v>1)),storageKeys:[...keys].sort(),fields:[...fields].sort(),keyframes:[...frames].sort(),handlers:[...handlers].sort(),duplicateStaticIds:ids.filter((x,i)=>ids.indexOf(x)!==i),importantCount:textSource.length&& (await Promise.all((await readdir('src/style')).map(f=>readFile('src/style/'+f,'utf8')))).join('').match(/!important/g).length};
await writeFile('artifacts/static-inventory.json',JSON.stringify({summary,entries},null,2));
const clean=x=>String(x).replaceAll('|','／').replaceAll('\n',' ').replaceAll('`','');
let md='# 自动源码目录\n\n由 `npm run audit` 生成。此目录包含旧实现和覆盖层，不能把定义存在视为功能通过。测试覆盖见 TEST_MATRIX.md。\n\n';
md+=`共 ${entries.length} 个命名定义、${summary.uniqueFunctions} 个函数名；${keys.size} 个字面量存储键、${frames.size} 个动画名、${summary.importantCount} 个 !important。\n\n`;
md+='| 功能／实现 | 位置 | 输入 | 源码返回表达式（截断） | 依赖调用 | 涉及状态字段 | 风险 | 测试结果 |\n|---|---|---|---|---|---|---|---|\n';
for(const e of entries)md+=`| ${clean(e.name)} | ${e.file}:${e.line} | ${clean(e.params.join(', '))||'无参数'} | ${clean(e.returns.join('; '))||'DOM／状态副作用；需按调用场景确认'} | ${clean(e.calls.join(', '))} | ${clean(e.stateFields.join(', '))} | ${/save|restore|import|settle|score|judge|item|history/i.test(e.name)?'高':'中'} | NOT TESTED（单个实现；集成覆盖另列） |\n`;
md+='\n## 存储键\n\n'+[...keys].sort().map(k=>'- `'+k+'`').join('\n');
md+='\n\n## 动画\n\n'+[...frames].sort().map(k=>'- `'+k+'`').join('\n');
md+='\n\n## 静态及模板事件入口\n\n'+[...handlers].sort().map(k=>'- `'+clean(k)+'`').join('\n');
await writeFile('docs/audit/SOURCE_CATALOG.md',md);console.log(JSON.stringify(summary));
