import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,writeFile} from 'node:fs/promises';
import {launch,setup} from '../fixtures/browser.mjs';
import {sourceAt} from '../fixtures/source-at.mjs';
const baseline='079df316a999ced4f598a3c3d0495786f9f8d0e8',before=sourceAt(baseline),after=await readFile('dist/godpower.html');
const server=createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(req.url==='/before'?before:after)});await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await launch();const pages={};const outputs={};
try{for(const version of ['before','after']){
 const page=await browser.newPage();pages[version]=page;await page.goto(`http://127.0.0.1:${server.address().port}/${version}`,{waitUntil:'domcontentloaded'});await setup(page);
 outputs[version]=await page.evaluate(()=>{
  // Characterization of business effects only; UI and audio have their own suites.
  renderAll=()=>{};renderGrid=()=>{};showItemUseFx=()=>{};playSound=()=>{};themeConfirm=()=>Promise.reject(Error('unexpected asynchronous fixture'));Math.random=()=>0;Date.now=()=>1700000000000;
  const defenses=['none','green','triple_green','red','banana','horn','bomb','mushroom','triple_mushroom','star','mega','timed-boo','boo','feather','bullet','ice','green-horn','banana-mushroom'];
  const rows=[];
  for(const key of ITEM_KEYS)for(const defense of defenses){
   // These baseline async defects are independently reproduced and fixed, not golden behavior.
   if(key==='spiny'&&['horn','mushroom','triple_mushroom','banana-mushroom'].includes(defense))continue;
   if(typeof classroomCommands!=='undefined')Reliability.invalidateDefenseDecisions();
   cancelItemScoreAnimations();
   state.groups=normalizeAllGroups(Array.from({length:4},(_,i)=>({id:i+1,groupNo:i+1,name:`G${i+1}`,score:100+i*40,members:[]})));
   state.itemGlobal={blooperUntil:0,totalDraws:0,pickerHistory:[],handRaiseHistory:[],handRaiseTotal:0,pkTotal:0,customIcons:{}};
   state.roundActive=true;state.evaluated=false;state.hasStartedOnce=true;state.correctAns='';historyStack=[];
   for(const g of state.groups.filter(g=>g.id!==2)){
    if(ITEM_DEFS[defense]&&!['star','mega','bullet'].includes(defense))g.inventory=[{key:defense,charges:ITEM_DEFS[defense].charges,acquiredAt:123}];
    if(['star','mega'].includes(defense)){g.itemEffect={type:defense,hitsLeft:3};if(defense==='mega')g.inventory=[{key:'mega',charges:1,acquiredAt:123}]}
    if(defense==='bullet')g.itemEffect={type:'bullet',roundsLeft:1};
    if(defense==='timed-boo'){g.booShield=1;g.booRoundsLeftV218=3}
    if(defense==='boo')g.booShield=1;
    if(defense==='feather')g.itemEffect={featherDodge:1};
    if(defense==='ice')g.itemEffect={iceLock:1,iceRoundsLeftV218:3};
    if(defense==='green-horn')g.inventory=[{key:'green',charges:1,acquiredAt:123},{key:'horn',charges:1,acquiredAt:124}];
    if(defense==='banana-mushroom')g.inventory=[{key:'banana',charges:1,acquiredAt:123},{key:'mushroom',charges:1,acquiredAt:124}];
   }
   state.groups[1].inventory=[{key,charges:ITEM_DEFS[key].charges,acquiredAt:999}];state.groups[1].allIn=true;
   const ok=useItem(2,0);
   rows.push({key,defense,ok,groups:state.groups.map(g=>({id:g.id,score:g.score,inventory:g.inventory.map(({key,charges})=>({key,charges})),effect:g.itemEffect,boo:g.booShield,booRounds:g.booRoundsLeftV218,used:g.itemStats.used,allIn:g.allIn,itemUsed:g.itemUsedThisRound,continuation:g.roundItemContinuationKeyV218})),masked:state.itemGlobal.blooperUntil>Date.now(),history:historyStack.length});
  }
  return rows;
 });await page.close();
}
const results=outputs.after.map((actual,i)=>{const expected=outputs.before[i];try{assert.deepEqual(actual,expected);return {key:actual.key,defense:actual.defense,status:'PASS'}}catch(error){return {key:actual.key,defense:actual.defense,status:'FAIL',error:error.message,expected,actual}}});
assert.equal(new Set(outputs.after.map(r=>r.key)).size,26);
await writeFile('artifacts/refactor/legacy-differential.json',JSON.stringify({baseline,scope:'business-only; render/audio stubbed; asynchronous bug cases separately tested',results},null,2));const fails=results.filter(r=>r.status==='FAIL');console.log({pass:results.length-fails.length,fail:fails.length});if(fails.length){console.error(JSON.stringify(fails.slice(0,3),null,2));process.exitCode=1}
}finally{await browser.close();await new Promise(r=>server.close(r))}
