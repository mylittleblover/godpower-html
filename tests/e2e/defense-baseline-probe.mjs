import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {writeFile} from 'node:fs/promises';
import {sourceAt} from '../fixtures/source-at.mjs';
import {launch,setup} from '../fixtures/browser.mjs';
const ref='079df316a999ced4f598a3c3d0495786f9f8d0e8',html=sourceAt(ref);
const server=createServer((_,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(html)});await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await launch();const page=await browser.newPage();const results=[];
try{await page.goto(`http://127.0.0.1:${server.address().port}`,{waitUntil:'domcontentloaded'});
for(const key of ['mushroom','horn']){await setup(page);const result=await page.evaluate(async key=>{state.groups[3].inventory=[{key,charges:1,acquiredAt:123}];state.groups[0].inventory=[{key:'spiny',charges:1,acquiredAt:456}];saveState();const persisted=localStorage.getItem(Reliability.stateKey),confirm=themeConfirm;let answer;themeConfirm=()=>new Promise(r=>answer=r);try{useItem(1,0);const partialWritten=localStorage.getItem(Reliability.stateKey)!==persisted;answer(true);await new Promise(r=>setTimeout(r,0));return {partialWritten,attacker:state.groups[0].inventory[0]?.key||null,defender:state.groups[3].inventory[0]?.key||null,score:state.groups[3].score}}finally{themeConfirm=confirm}},key);assert.equal(result.partialWritten,true);assert.equal(result.attacker,null);assert.equal(result.defender,key);results.push({key,status:'REPRODUCED',...result});console.log('REPRODUCED',key,result)}
}finally{await writeFile('artifacts/refactor/defense-baseline-probe.json',JSON.stringify({baseline:ref,buildBytes:Buffer.byteLength(html),results},null,2));await browser.close();await new Promise(r=>server.close(r))}
