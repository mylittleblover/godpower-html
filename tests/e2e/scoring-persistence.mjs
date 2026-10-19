import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {launch,dismissStartup} from '../fixtures/browser.mjs';
const compare=process.argv.includes('--compare-before');
const current=await readFile('dist/godpower.html','utf8');
const old=compare?execFileSync('git',['show','bc42a43:dist/godpower.html'],{maxBuffer:16*1024*1024}).toString():null;
const server=createServer((req,res)=>{res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(req.url.startsWith('/before')?old:current)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await launch();const results=[];
async function run(version,failure){
 const context=await browser.newContext({viewport:{width:1920,height:1080}}),p=await context.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));await context.route('**/*',r=>r.continue());
 if(failure==='startup-denied')await context.addInitScript(()=>{Object.defineProperty(window,'localStorage',{configurable:true,get(){throw new DOMException('storage denied','SecurityError')}})});
 await p.goto(`http://127.0.0.1:${server.address().port}/${version}`,{waitUntil:'domcontentloaded'});
 if(failure==='startup-denied'){await p.waitForTimeout(1200);await p.evaluate(()=>closeThemeDialogV21727())}
 await dismissStartup(p);
 await p.locator('button[onclick="enterBattleFromWelcome()"]').click();
 await p.locator('#btnMainAction').click();await p.waitForFunction(()=>state.roundActive);
 if(failure==='quota')await p.evaluate(()=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k===Reliability.stateKey)throw new DOMException('test full','QuotaExceededError');return original.call(this,k,v)};window.restoreTestStorage=()=>Storage.prototype.setItem=original});
 for(const id of [1,2,3,4])await p.locator(`.group-row-card[data-group-id="${id}"] .opt-btn`).first().click();
 await p.locator('.ans-btn').first().click();
 await p.locator('#btnMainAction').click();await p.waitForTimeout(900);
 const actual=await p.evaluate(()=>({scores:state.groups.map(g=>g.score),display:state.groups.map(g=>g.displayScore),correct:state.groups.map(g=>g.itemStats.correct),evaluated:state.evaluated,history:historyStack.length,warning:!!document.querySelector('#classroomSaveWarning:not([hidden])'),toast:document.querySelector('#toast').textContent,result:window.lastClassroomCommandResult}));
 const row={version,failure,actual,errors};
 if(version==='before'){
  assert.deepEqual(actual.scores,[0,0,0,0]);assert.equal(actual.evaluated,false);assert.ok(actual.toast.includes('已回滚'));row.status='REPRODUCED';
 }else{
  assert.deepEqual(actual.scores,[2,2,2,2]);assert.deepEqual(actual.display,[2,2,2,2]);assert.deepEqual(actual.correct,[1,1,1,1]);assert.equal(actual.evaluated,true);assert.equal(actual.history,1);assert.deepEqual(errors,[]);
  if(failure!=='none'){
   assert.equal(actual.warning,true);assert.equal(actual.result.persisted,false);
   const download=p.waitForEvent('download');await p.locator('#classroomSaveWarning button').click();const file=await download;const path=`artifacts/scoring-${failure}-export.json`;await file.saveAs(path);const data=JSON.parse(await readFile(path,'utf8'));assert.deepEqual(data.groups.map(g=>g.score),[2,2,2,2]);
   assert.equal(await p.evaluate(()=>judgeRound()),false);assert.deepEqual(await p.evaluate(()=>state.groups.map(g=>g.score)),[2,2,2,2]);
  }
  if(failure==='quota'){
   await p.screenshot({path:'artifacts/screenshots/chromium/scoring-unsaved-warning.png'});
   assert.equal(await p.evaluate(()=>{restoreTestStorage();return saveState().ok}),true);assert.equal(await p.locator('#classroomSaveWarning').isVisible(),false);
   const navigation=p.waitForNavigation({waitUntil:'domcontentloaded',timeout:90000});const session=await context.newCDPSession(p);await session.send('Page.reload',{ignoreCache:true});await navigation;await session.detach();assert.deepEqual(await p.evaluate(()=>state.groups.map(g=>g.score)),[2,2,2,2]);
  }
  row.status='PASS';
 }
 results.push(row);console.log(row.status,version,failure,actual.scores);await context.close();
}
try{
 if(compare){await run('before','quota');await run('before','startup-denied')}
 for(const failure of ['none','quota','startup-denied'])await run('after',failure);
}finally{await writeFile('artifacts/scoring-persistence-results.json',JSON.stringify({browser:browser.version(),results},null,2));await browser.close();server.close()}
