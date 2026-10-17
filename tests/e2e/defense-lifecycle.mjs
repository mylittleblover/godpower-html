import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {launch,setup} from '../fixtures/browser.mjs';
const server=createServer(async(_req,res)=>{try{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(await readFile('dist/godpower.html'))}catch{res.writeHead(500).end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await launch();const page=await browser.newPage();const errors=[];
try{await page.goto('http://127.0.0.1:'+server.address().port,{waitUntil:'domcontentloaded'});
for(const key of ['mushroom','horn'])for(const scenario of ['accepted','declined','stale-command','stale-state','changed-item']){
await setup(page);const r=await page.evaluate(async ({key,scenario})=>{
const target=state.groups[3];target.inventory=[{key,charges:1,acquiredAt:1}];
const attacker=state.groups[0],start=target.score,old=themeConfirm;let answer;
themeConfirm=()=>new Promise(resolve=>answer=resolve);
try{const pending=applyItemScore(target,-50,attacker.id,'spiny');
if(!answer)throw Error('Expected defense prompt missing');
if(scenario==='stale-command')Reliability.invalidateDefenseDecisions();
if(scenario==='stale-state')state=clone(state);
if(scenario==='changed-item')target.inventory[0]={key:'coin',charges:1};
answer(scenario!=='declined');await new Promise(r=>setTimeout(r,0));
const live=state.groups.find(g=>g.id===target.id);return {blocked:pending?.blocked,start,score:live.score,
key:live.inventory[0]?.key||null,pending:!!(target.__spinyDecisionPendingV21727||target.__spinyHornDecisionPendingV218)};
}finally{themeConfirm=old;}},{key,scenario});
try{assert.ok(r.blocked?.startsWith('pending-'));assert.equal(r.pending,false);
if(scenario==='accepted'){assert.equal(r.score,r.start);assert.equal(r.key,null)}
else if(scenario==='declined'){assert.equal(r.score,r.start-50)}
else{assert.equal(r.score,r.start);assert.equal(r.key,scenario==='changed-item'?'coin':key)}
console.log('PASS',key,scenario)}catch(e){errors.push({key,scenario,result:r,error:e.message});console.error('FAIL',key,scenario,e.message)}
}}finally{await browser.close();await new Promise(r=>server.close(r))}
if(errors.length){console.error(JSON.stringify(errors,null,2));process.exitCode=1}
