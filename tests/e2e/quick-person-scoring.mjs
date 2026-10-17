import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {launch,setup} from '../fixtures/browser.mjs';
const server=createServer(async(req,res)=>{try{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(await readFile('dist/godpower.html'))}catch{res.writeHead(500).end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await launch();const page=await browser.newPage();
try{await page.goto('http://127.0.0.1:'+server.address().port,{waitUntil:'domcontentloaded'});await setup(page);
const x=await page.evaluate(()=>{
 const all=allStudentsV218();const a=all[0],b=all[1],c=all[2];qpStateV218.selected=new Set([a.key,b.key,c.key]);
 const before=JSON.stringify(state.groups),oldHistory=historyStack.length;
 const result=applyQuickPersonScoreV218(2);const scores=state.groups.map(g=>g.score),length=historyStack.length;
 undoLast();return {result,scores,length,oldHistory,restored:before===JSON.stringify(state.groups)};
});assert.equal(x.result,true);assert.deepEqual(x.scores.slice(0,2),[104,142]);assert.equal(x.length,x.oldHistory+1);assert.equal(x.restored,true);
await setup(page);const err=await page.evaluate(()=>{const a=allStudentsV218()[0];qpStateV218.selected=new Set([a.key]);state.groups[0].score=Number.MAX_SAFE_INTEGER;const before=JSON.stringify(state.groups),history=historyStack.length;const ok=applyQuickPersonScoreV218(1);return {ok,same:before===JSON.stringify(state.groups),historySame:history===historyStack.length}});
assert.deepEqual(err,{ok:false,same:true,historySame:true});console.log('PASS batch student scoring, atomic undo and overflow rejection');
}finally{await browser.close();await new Promise(r=>server.close(r))}
