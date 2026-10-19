import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {launch,setup} from '../fixtures/browser.mjs';
const html=await readFile('dist/godpower.html'),server=createServer((_,r)=>{r.setHeader('Content-Type','text/html;charset=utf-8');r.end(html);});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await launch(),page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});const results=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
async function scenario(name,run){try{await setup(page,4);await run();results.push({name,status:'PASS'});console.log('PASS',name);}catch(error){results.push({name,status:'FAIL',error:error.message});console.log('FAIL',name,error.message);}}
try{
 await page.goto(`http://127.0.0.1:${server.address().port}`,{waitUntil:'domcontentloaded'});
 await scenario('undo commits one snapshot restore and one primary save',async()=>{
  const result=await page.evaluate(async()=>{
   applyScoreDelta(state.groups[0].id,2);applyScoreDelta(state.groups[0].id,3);window.lastClassroomCommandResult=null;
   const set=Storage.prototype.setItem;let writes=0;Storage.prototype.setItem=function(k,v){if(k===Reliability.stateKey)writes++;return set.call(this,k,v);};
   try{await undoLast();return{score:state.groups[0].score,history:historyStack.length,writes,result:window.lastClassroomCommandResult,saved:JSON.parse(localStorage.getItem(Reliability.stateKey)).groups[0].score};}finally{Storage.prototype.setItem=set;}
  });assert.equal(result.score,102);assert.equal(result.history,1);assert.equal(result.saved,102);assert.equal(result.writes,1);assert.equal(result.result?.persisted,true);
 });
 await scenario('history revert cancels defense before trimming its reliable history',async()=>{
  const result=await page.evaluate(async()=>{
   applyScoreDelta(state.groups[0].id,2);applyScoreDelta(state.groups[0].id,3);const uid=state.groups[0].groupUid;
   state.groups[0].inventory=[ItemModules.inventory('spiny')];state.groups[3].inventory=[ItemModules.inventory('horn')];saveState();
   const confirm=themeConfirm;let resolve;themeConfirm=()=>new Promise(r=>{resolve=r;});
   try{useItem(state.groups[0].id,0);await revertToHistory(0);resolve(true);await new Promise(r=>setTimeout(r,20));return{score:state.groups[0].score,history:historyStack.length,savedHistory:JSON.parse(localStorage.getItem(Reliability.stateKey)).history.length,pending:classroomCommands.isPending(),sameUid:state.groups[0].groupUid===uid};}finally{themeConfirm=confirm;}
  });assert.deepEqual(result,{score:100,history:0,savedHistory:0,pending:false,sameUid:true});
 });
 await scenario('undo under quota preserves the explicit RAM-only compatibility policy',async()=>{
  const result=await page.evaluate(async()=>{
   applyScoreDelta(state.groups[0].id,2);applyScoreDelta(state.groups[0].id,3);const set=Storage.prototype.setItem;
   Storage.prototype.setItem=function(k,v){if(k===Reliability.stateKey)throw new DOMException('isolated undo quota','QuotaExceededError');return set.call(this,k,v);};
   try{await undoLast();return{score:state.groups[0].score,history:historyStack.length,saved:JSON.parse(localStorage.getItem(Reliability.stateKey)).groups[0].score,result:window.lastClassroomCommandResult,unsaved:window.classroomUnsavedChanges};}finally{Storage.prototype.setItem=set;}
  });assert.equal(result.score,102);assert.equal(result.history,1);assert.equal(result.saved,105);assert.equal(result.unsaved,true);assert.equal(result.result?.persisted,false);
 });
 await scenario('pending attack undo cancels only that attack, preserving earlier history',async()=>{
  const result=await page.evaluate(async()=>{
   applyScoreDelta(state.groups[0].id,2);
   state.groups[0].inventory=[ItemModules.inventory('spiny')];state.groups[3].inventory=[ItemModules.inventory('horn')];saveState();
   const confirm=themeConfirm;let resolve;themeConfirm=()=>new Promise(r=>{resolve=r;});
   try{useItem(state.groups[0].id,0);await undoLast();resolve(true);await new Promise(r=>setTimeout(r,20));return {score:state.groups[0].score,history:historyStack.length,pending:classroomCommands.isPending()};}finally{themeConfirm=confirm;}
  });assert.deepEqual(result,{score:102,history:1,pending:false});
 });
 await scenario('consecutive undo restores original scores without new history nodes',async()=>{
  const result=await page.evaluate(async()=>{
   applyScoreDelta(state.groups[0].id,2);applyScoreDelta(state.groups[0].id,3);
   await undoLast();await undoLast();await undoLast();
   return {score:state.groups[0].score,history:historyStack.length,saved:JSON.parse(localStorage.getItem(Reliability.stateKey)).groups[0].score};
  });assert.deepEqual(result,{score:100,history:0,saved:100});
 });
 assert.deepEqual(errors,[]);
}finally{await mkdir('artifacts/v3-history',{recursive:true});await writeFile('artifacts/v3-history/results.json',JSON.stringify({results,errors},null,2));await browser.close();server.close();}
if(results.some(r=>r.status==='FAIL'))process.exitCode=1;
