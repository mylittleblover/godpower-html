import {existsSync} from 'node:fs';
import {chromium,firefox,webkit} from 'playwright';
export async function launch(kind='chromium'){
 const driver={chromium,firefox,webkit}[kind];
 const opts={headless:true};
 if(kind==='chromium'){
   const browserPath=process.env.CHROMIUM_PATH||(process.platform==='linux'&&existsSync('/usr/bin/chromium')?'/usr/bin/chromium':null);
   if(browserPath)opts.executablePath=browserPath;
   if(process.platform==='linux'&&typeof process.getuid==='function'&&process.getuid()===0)opts.args=['--no-sandbox'];
 }
 return driver.launch(opts);
}
export async function setup(page,n=4){
 await page.evaluate(n=>{
   closeWelcomeModal();document.getElementById('gpIntroSkip')?.click();state.isLocked=false;state.soundEnabled=false;
   setCommunismMode(true);cancelScoreAnimationAndSync();
   state.groups=normalizeAllGroups(Array.from({length:n},(_,i)=>({id:i+1,groupNo:i+1,name:`测试 ${i+1} 组`,color:'#2F7DD1',members:[`0${i+1} 同学`,`${i+1} 甲`],score:100+i*40})));
   state.itemGlobal={blooperUntil:0,totalDraws:0,pickerHistory:[],handRaiseHistory:[],handRaiseTotal:0,pkTotal:0,customIcons:{}};
   state.picker={mode:'individual',antiRepeat:true,pickedStudentKeys:[],pickedGroupIds:[],preselectedGroupIds:[]};slotEngine.chosenResult=null;
   state.roundActive=true;state.evaluated=false;state.hasStartedOnce=true;state.correctAns='';historyStack=[];
   ensureV2State();switchView('battle');renderAll();
 },n);
}
