import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
const html=await readFile(process.env.PICKER_HTML || 'dist/godpower.html');
const server=createServer((q,s)=>{s.setHeader('Content-Type','text/html; charset=utf-8');s.end(html)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
import { launch, setup } from '../fixtures/browser.mjs';
const browser=await launch();
const page=await browser.newPage({viewport:{width:1920,height:1080}});
const results=[];
try {
 await page.goto(`http://127.0.0.1:${server.address().port}`);
 await setup(page,4);
 assert.equal(await page.evaluate(()=>typeof window.GodpowerPicker),'object','authoritative picker API exists');
 for(const mode of ['individual','group','two_tier']){
  await page.evaluate(()=>{state.isLocked=false;ClassroomFeedback.setOptions({pickEffects:false,scoreEffects:false});});
  await page.evaluate(mode=>GodpowerPicker.command('mode',{mode}),mode);
  const start=await page.evaluate(()=>GodpowerPicker.command('start'));
  assert.equal(start.ok,true);
  assert.equal(await page.evaluate(()=>GodpowerPicker.getSnapshot().result),null,'hidden outcome while spinning');
  const len=await page.evaluate(()=>state.itemGlobal.pickerHistory.length);
  await page.evaluate(()=>GodpowerPicker.command('stop'));
  await page.evaluate(()=>GodpowerPicker.command('stop'));
  await page.waitForFunction(()=>GodpowerPicker.getSnapshot().phase==='revealed');
  const snap=await page.evaluate(()=>GodpowerPicker.getSnapshot());
  assert.equal(snap.mode,mode); assert.ok(snap.result.groupId);
  assert.equal(snap.history.length,len+1,'stop commits history once');
  const bad=await page.evaluate(()=>GodpowerPicker.command('score',{resultId:'stale',delta:5}));
  assert.equal(bad.ok,false);
  const scored=await page.evaluate(async id=>{
   const g=pickerTargetGroup();const before=g.score;
   const r=await GodpowerPicker.command('score',{resultId:id,delta:3});
   return {ok:r.ok,change:g.score-before};
  },snap.result.id);
  assert.deepEqual(scored,{ok:true,change:3});
  results.push({mode,status:'PASS'});
 }
 const cancelled=await page.evaluate(async()=>{
  const before=state.itemGlobal.pickerHistory.length;
  await GodpowerPicker.command('start');await GodpowerPicker.command('cancel');
  return {phase:GodpowerPicker.getSnapshot().phase,history:state.itemGlobal.pickerHistory.length===before,spinning:slotEngine.isSpinning};
 });
 assert.deepEqual(cancelled,{phase:'idle',history:true,spinning:false});

 // Existing automatic pool rollover and two-tier preselection rules remain authoritative.
 await page.evaluate(()=>GodpowerPicker.command('mode',{mode:'group'}));
 await page.evaluate(()=>GodpowerPicker.command('resetPool'));
 const ids=[];
 for(let i=0;i<4;i++){
  await page.evaluate(()=>GodpowerPicker.command('start'));await page.evaluate(()=>GodpowerPicker.command('stop'));
  await page.waitForFunction(()=>GodpowerPicker.getSnapshot().phase==='revealed');
  ids.push(await page.evaluate(()=>GodpowerPicker.getSnapshot().result.groupId));
 }
 assert.equal(new Set(ids).size,4,'anti-repeat visits each group before original pool rollover');
 await page.evaluate(()=>GodpowerPicker.command('mode',{mode:'two_tier'}));
 await page.evaluate(()=>{state.picker.preselectedGroupIds=[];return GodpowerPicker.command('preselect',{groupId:2})});
 await page.evaluate(()=>GodpowerPicker.command('start'));await page.evaluate(()=>GodpowerPicker.command('stop'));
 await page.waitForFunction(()=>GodpowerPicker.getSnapshot().phase==='revealed');
 assert.equal(await page.evaluate(()=>GodpowerPicker.getSnapshot().result.groupId),2);
 const duplicate=await page.evaluate(async()=>{
  const responses=await Promise.all([GodpowerPicker.command('start'),GodpowerPicker.command('start')]);
  await GodpowerPicker.command('cancel');return responses.map(x=>x.ok);
 });assert.deepEqual(duplicate,[true,false]);
 const asyncCancel=await page.evaluate(async()=>{
  const old=getAudioContext;let release;getAudioContext=()=>new Promise(r=>release=r);
  const starting=GodpowerPicker.command('start');await new Promise(r=>setTimeout(r,30));
  await GodpowerPicker.command('cancel');release();await starting;getAudioContext=old;
  return {spinning:slotEngine.isSpinning,phase:GodpowerPicker.getSnapshot().phase};
 });assert.deepEqual(asyncCancel,{spinning:false,phase:'idle'});
 results.push({scenario:'anti-repeat, two-tier subset, duplicate start, async cancellation',status:'PASS'});

 const replaced=await page.evaluate(async()=>{
  await GodpowerPicker.command('start');await GodpowerPicker.command('stop');
  await new Promise(r=>setTimeout(r,1150));
  const id=GodpowerPicker.getSnapshot().result.id;
  state.groups=normalizeAllGroups(JSON.parse(JSON.stringify(state.groups)));
  return {result:GodpowerPicker.getSnapshot().result,score:await GodpowerPicker.command('score',{resultId:id,delta:1})};
 });assert.equal(replaced.result,null);assert.equal(replaced.score.ok,false);
 const importCancel=await page.evaluate(async()=>{
  await GodpowerPicker.command('start');const backup=buildClassroomBackup();
  const result=importClassroomData(backup);return {ok:result.ok,phase:GodpowerPicker.getSnapshot().phase,spinning:slotEngine.isSpinning};
 });assert.deepEqual(importCancel,{ok:true,phase:'idle',spinning:false});
 await page.evaluate(()=>GodpowerPicker.command('start'));await page.evaluate(()=>GodpowerPicker.command('stop'));
 await page.waitForFunction(()=>GodpowerPicker.getSnapshot().phase==='revealed');
 const undo=await page.evaluate(async()=>{const r=GodpowerPicker.getSnapshot().result;await GodpowerPicker.command('score',{resultId:r.id,delta:2});undoLast();return {phase:GodpowerPicker.getSnapshot().phase,score:state.groups.find(g=>g.id===r.groupId).score,expected:r.score}});
 assert.equal(undo.phase,'idle');assert.equal(undo.score,undo.expected);
 results.push({scenario:'replacement rejects stale target; import/undo cancel transient picker',status:'PASS'});
 await mkdir('artifacts/electron-picker',{recursive:true});
 await writeFile('artifacts/electron-picker/results.json',JSON.stringify(results,null,2));
 console.log('PASS three modes, hidden result, exactly-once stop/history, stale score, scoring, cancellation');
} finally {await browser.close();server.close();}
