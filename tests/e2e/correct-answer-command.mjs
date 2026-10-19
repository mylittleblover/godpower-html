import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {launch,setup} from '../fixtures/browser.mjs';
const html=await readFile('dist/godpower.html'),server=createServer((_,r)=>{r.setHeader('Content-Type','text/html;charset=utf-8');r.end(html);});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await launch(),page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1}),results=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
async function scenario(name,run){try{await setup(page,4);await run();results.push({name,status:'PASS'});}catch(e){results.push({name,status:'FAIL',error:e.message});}console.log(results.at(-1));}
try{
 await page.goto(`http://127.0.0.1:${server.address().port}`,{waitUntil:'domcontentloaded'});
 await scenario('deselecting correct answer persists the cleared choice',async()=>{
  const out=await page.evaluate(async()=>{state.groups.forEach(g=>g.selectedOpt='A');await setCorrectAns('A');const selected=JSON.parse(localStorage.getItem(Reliability.stateKey)).round.correctAns;await setCorrectAns('A');return {selected,current:state.correctAns,saved:JSON.parse(localStorage.getItem(Reliability.stateKey)).round.correctAns};});assert.deepEqual(out,{selected:'A',current:'',saved:''});
 });
 await scenario('stale early-answer confirmation cannot overwrite a newer settled round',async()=>{
  const out=await page.evaluate(async()=>{state.groups.forEach(g=>g.selectedOpt='');const confirm=programConfirmV28;let resolve;programConfirmV28=()=>new Promise(r=>resolve=r);try{const pending=setCorrectAns('B');state.evaluated=true;state.correctAns='D';saveState();resolve(true);await pending;return {current:state.correctAns,saved:JSON.parse(localStorage.getItem(Reliability.stateKey)).round.correctAns};}finally{programConfirmV28=confirm;}});assert.deepEqual(out,{current:'D',saved:'D'});
 });
 await scenario('declining early confirmation leaves current and saved answers unchanged',async()=>{
  const out=await page.evaluate(async()=>{state.groups.forEach(g=>g.selectedOpt='');saveState();const confirm=programConfirmV28;programConfirmV28=async()=>false;try{await setCorrectAns('C');return {current:state.correctAns,saved:JSON.parse(localStorage.getItem(Reliability.stateKey)).round.correctAns,history:historyStack.length};}finally{programConfirmV28=confirm;}});assert.deepEqual(out,{current:'',saved:'',history:0});
 });
 await scenario('another committed classroom action invalidates an older confirmation',async()=>{
  const out=await page.evaluate(async()=>{state.groups.forEach(g=>g.selectedOpt='');const confirm=programConfirmV28;let resolve;programConfirmV28=()=>new Promise(r=>resolve=r);try{const pending=setCorrectAns('B');selectGroupOpt(state.groups[0].id,'C');resolve(true);await pending;return {correct:state.correctAns,selected:state.groups[0].selectedOpt};}finally{programConfirmV28=confirm;}});assert.deepEqual(out,{correct:'',selected:'C'});
 });
 await scenario('correct-answer save failure reports its own RAM-only outcome',async()=>{
  const out=await page.evaluate(async()=>{state.groups.forEach(g=>g.selectedOpt='A');saveState();const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k===Reliability.stateKey)throw new DOMException('isolated quota','QuotaExceededError');return set.call(this,k,v);};try{await setCorrectAns('C');return {current:state.correctAns,saved:JSON.parse(localStorage.getItem(Reliability.stateKey)).round.correctAns,persisted:window.lastClassroomCommandResult.persisted,history:historyStack.length};}finally{Storage.prototype.setItem=set;}});assert.deepEqual(out,{current:'C',saved:'',persisted:false,history:0});
 });
 assert.deepEqual(errors,[]);
}finally{await mkdir('artifacts/v3-round-controls',{recursive:true});await writeFile('artifacts/v3-round-controls/results.json',JSON.stringify({results,errors},null,2));await browser.close();server.close();}if(results.some(r=>r.status==='FAIL'))process.exitCode=1;
