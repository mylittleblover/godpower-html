import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {launch,setup} from '../fixtures/browser.mjs';
import {sourceAt} from '../fixtures/source-at.mjs';
const baseline='3b3d7bc',before=sourceAt(baseline),after=await readFile('dist/godpower.html');
const server=createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(req.url==='/before'?before:after);});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await launch(),outputs={};
try{
 for(const version of ['before','after']){
  const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
  await page.goto(`http://127.0.0.1:${server.address().port}/${version}`,{waitUntil:'domcontentloaded'});await setup(page,4);
  outputs[version]=await page.evaluate(async()=>{
   Date.now=()=>1700000000000;
   const results=[];
   for(const count of [1,4,14])for(let seed=0;seed<6;seed++){
    clearInterval(bulletTimer);bulletTimer=null;
    const groups=Array.from({length:count},(_,i)=>({id:i+1,groupUid:`history-group-${i}`,groupNo:i+1,name:`小组 ${i+1}`,color:'#2F7DD1',members:[`0${i+1} 同学`],score:(i%2?-1:1)*(100+seed*7+i),selectedOpt:['A','B','C','D',''][i%5],allIn:i%3===0,inventory:[{key:['coin','green','fire_flower'][i%3],charges:2,acquiredAt:1700000000000+i,itemInstanceId:`item-history-${seed}-${i}`}],itemStats:{correct:seed,wrong:i,used:1,draws:2},itemEffect:i%3===0?{type:'star',hitsLeft:2}:i%3===1?{iceLock:1,iceRoundsLeftV218:2}:{featherDodge:1},booShield:i%2,booRoundsLeftV218:i%2?2:0,itemUsedThisRound:i%2===0,roundItemContinuationKeyV218:i%2?'triple_green':''}));
    const snapshot={desc:`fixture${seed}`,time:'12:30',groups,picker:{mode:'individual',antiRepeat:true,pickedGroupIds:[1],pickedStudentKeys:[],preselectedGroupIds:[]},itemGlobal:{totalDraws:seed,blooperUntil:0,pickerHistory:[],handRaiseHistory:[],handRaiseTotal:0,pkTotal:seed,customIcons:{}},correctAns:['','A','D'][seed%3],roundActive:seed%2===0,evaluated:seed%2!==0,hasStartedOnce:true,lastRoundAllIn:{wins:seed,losses:1},resizerHeight:80+seed,masterVolume:.99};
    state.seasonId='season-history';state.masterVolume=.25;
    state.groups=normalizeAllGroups(groups.map(g=>({...g,score:g.score+10})));
    historyStack=[clone(snapshot)];
    await restoreStateFromSnapshot(snapshot);
    clearInterval(bulletTimer);bulletTimer=null;
    const backup=buildClassroomBackup();delete backup.timestamp;delete backup.appVersion;
    results.push({count,seed,backup});
   }
   return results;
  });
  await page.close();
 }
 assert.deepEqual(outputs.after,outputs.before);
 await mkdir('artifacts/v3-history',{recursive:true});await writeFile('artifacts/v3-history/differential.json',JSON.stringify({baseline,cases:outputs.after.length,status:'PASS',results:outputs.after},null,2));
 console.log('PASS history snapshot differential',outputs.after.length,'real-rendered cases, 1/4/14 groups');
}finally{await browser.close();server.close();}
