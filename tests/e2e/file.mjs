// An isolated Playwright-managed Chromium profile tests the actual file URL.
// System-managed Chromium policy is left untouched and separately reported.
import {chromium} from 'playwright';import {writeFile} from 'node:fs/promises';import assert from 'node:assert/strict';import {setup} from '../fixtures/browser.mjs';
let browser;const results=[];let status='BLOCKED',error=null;
try{
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||chromium.executablePath(),headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1920,height:1080},offline:true});
 const p=await context.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('file://'+process.cwd()+'/dist/godpower.html',{waitUntil:'domcontentloaded'});await p.waitForTimeout(500);assert.equal(await p.evaluate(()=>window.__GOD_POWER_VERSION__),'V2.18.15');results.push({name:'file URL opens while network offline',status:'PASS'});
 await setup(p);
 const score=await p.evaluate(()=>{state.correctAns='A';state.groups.forEach(g=>g.selectedOpt='A');judgeRound();return state.groups.map(g=>g.score)});assert.deepEqual(score,[102,142,182,222]);results.push({name:'file scoring',status:'PASS'});
 await setup(p);
 const item=await p.evaluate(()=>{const g=state.groups[0];g.inventory=[{key:'fire_flower',charges:3,acquiredAt:1}];g.allIn=true;const ok=useItem(g.id,0);const allIn=g.allIn;undoLast();return {ok,allIn,charges:state.groups[0].inventory[0].charges}});assert.deepEqual(item,{ok:true,allIn:false,charges:3});results.push({name:'file item, All In and undo',status:'PASS'});
 await p.evaluate(()=>{state.correctAns='C';state.groups[0].inventory=[{key:'ice_flower',charges:2,acquiredAt:1}];saveState()});await p.reload({waitUntil:'domcontentloaded'});await p.waitForTimeout(300);assert.deepEqual(await p.evaluate(()=>[state.correctAns,state.groups[0].inventory[0].charges]),['C',2]);results.push({name:'file localStorage reload',status:'PASS'});
 await setup(p);
 const quota=await p.evaluate(()=>{const before=JSON.stringify(state.groups),orig=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='politics_settlement_history')throw Error('quota');return orig.call(this,k,v)};const result=confirmFinalSettlement();Storage.prototype.setItem=orig;closeThemeDialogV21727();return {ok:result.ok,same:before===JSON.stringify(state.groups)}});assert.deepEqual(quota,{ok:false,same:true});results.push({name:'file archive failure preserves state',status:'PASS'});
 const result=await p.evaluate(()=>importClassroomData({groups:[{id:9,name:'离线班级',score:123,members:['01 甲']}]}));assert.equal(result.ok,true);results.push({name:'file legacy import',status:'PASS'});
 const download=p.waitForEvent('download');await p.evaluate(()=>exportData());const d=await download;assert.ok(d.suggestedFilename().endsWith('.json'));results.push({name:'file JSON download',status:'PASS'});
 await p.screenshot({path:'artifacts/screenshots/chromium/file-offline.png'});assert.deepEqual(errors,[]);results.push({name:'file no uncaught errors',status:'PASS'});status='PASS';
}catch(e){error=e.stack;status=results.length?'FAIL':'BLOCKED';}
await writeFile('artifacts/file-results.json',JSON.stringify({status,error,browser:browser?.version(),offline:true,results},null,2));await browser?.close();console.log({status,results:results.length,error});if(status==='FAIL')process.exitCode=1;
