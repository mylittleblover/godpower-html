import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {launch,setup} from '../fixtures/browser.mjs';
const html=await readFile('dist/godpower.html'),server=createServer((_,r)=>{r.setHeader('Content-Type','text/html;charset=utf-8');r.end(html);});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await launch(),page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1}),results=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
async function scenario(name,run){try{await setup(page,4);await run();results.push({name,status:'PASS'});}catch(e){results.push({name,status:'FAIL',error:e.message});}console.log(results.at(-1));}
try{await page.goto(`http://127.0.0.1:${server.address().port}`,{waitUntil:'domcontentloaded'});
 await scenario('late force-end confirmation cannot terminate a newer answered phase',async()=>{const out=await page.evaluate(async()=>{const confirm=themeConfirm;let resolve;themeConfirm=()=>new Promise(r=>resolve=r);try{const pending=forceEndRound();state.groups[0].selectedOpt='B';saveState();resolve(true);await pending;return {active:state.roundActive,evaluated:state.evaluated,answer:state.groups[0].selectedOpt,history:historyStack.length};}finally{themeConfirm=confirm;}});assert.deepEqual(out,{active:true,evaluated:false,answer:'B',history:0});});
 await scenario('accepted force end records one undo point and persists',async()=>{const out=await page.evaluate(async()=>{const confirm=themeConfirm;themeConfirm=async()=>true;try{window.lastClassroomCommandResult=null;const before=historyStack.length;await forceEndRound();return {active:state.roundActive,evaluated:state.evaluated,history:historyStack.length-before,saved:JSON.parse(localStorage.getItem(Reliability.stateKey)).round.evaluated,persisted:window.lastClassroomCommandResult?.persisted};}finally{themeConfirm=confirm;}});assert.deepEqual(out,{active:true,evaluated:true,history:1,saved:true,persisted:true});});
 assert.deepEqual(errors,[]);
}finally{await mkdir('artifacts/v3-round-controls',{recursive:true});await writeFile('artifacts/v3-round-controls/force-end-results.json',JSON.stringify({results,errors},null,2));await browser.close();server.close();}if(results.some(r=>r.status==='FAIL'))process.exitCode=1;
