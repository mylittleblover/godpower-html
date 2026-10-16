/* Stable public APIs. Legacy item executors remain isolated until their rule
   matrix is complete; new features must not add another override layer. */
function buildClassroomBackup(){
  return {
    schemaVersion:Reliability.schemaVersion,appVersion:'V2.18.14',timestamp:new Date().toISOString(),
    groups:getPersistableGroups(),picker:clone(state.picker),itemGlobal:clone(state.itemGlobal||{}),
    round:{roundActive:state.roundActive,evaluated:state.evaluated,correctAns:state.correctAns,
      hasStartedOnce:state.hasStartedOnce,lastRoundAllIn:state.lastRoundAllIn},
    history:clone(historyStack),firstHandDrawPending:firstHandDrawPendingV218,
    adminPin:state.adminPin,masterVolume:state.masterVolume,sfxVolume:state.sfxVolume,
    zoomLevel:state.zoomLevel,resizerEnabled:state.resizerEnabled,resizerHeight:state.resizerHeight,
    columnMode:state.columnMode,saveAllIn:state.saveAllIn
  };
}
function applyClassroomBackup(raw){
  const data=Reliability.validateBackup(raw);
  state.groups=normalizeAllGroups(data.groups);
  if(data.picker){
    const p=data.picker;
    state.picker={mode:['individual','group','two_tier'].includes(p.mode)?p.mode:'individual',antiRepeat:p.antiRepeat!==false,
      pickedStudentKeys:Array.isArray(p.pickedStudentKeys)?p.pickedStudentKeys:[],
      pickedGroupIds:Array.isArray(p.pickedGroupIds)?p.pickedGroupIds:[],preselectedGroupIds:Array.isArray(p.preselectedGroupIds)?p.preselectedGroupIds:[]};
  }
  if(data.itemGlobal){
    state.itemGlobal=clone(data.itemGlobal);
    for(const k of ['blooperUntil','totalDraws','handRaiseTotal','pkTotal'])state.itemGlobal[k]=Reliability.count(state.itemGlobal[k]);
    for(const k of ['pickerHistory','handRaiseHistory'])if(!Array.isArray(state.itemGlobal[k]))state.itemGlobal[k]=[];
    state.itemGlobal.customIcons=Object.fromEntries(Object.entries(state.itemGlobal.customIcons||{}).filter(([k,v])=>ITEM_DEFS[k]&&Reliability.safeImage(v)));
  }
  if(data.round){
    const r=data.round;
    state.roundActive=!!r.roundActive;state.evaluated=!!r.evaluated;
    state.hasStartedOnce=!!r.hasStartedOnce;state.correctAns=['A','B','C','D'].includes(r.correctAns)?r.correctAns:'';
    state.lastRoundAllIn=r.lastRoundAllIn||null;
  }else{
    // Unversioned V2 backups have no round metadata. Resume as an idle classroom.
    state.roundActive=false;state.evaluated=false;state.hasStartedOnce=false;state.correctAns='';
    state.groups.forEach(g=>{g.selectedOpt='';g.allIn=false;g.itemUsedThisRound=false});
  }
  if(data.adminPin!=null)state.adminPin=String(data.adminPin);
  for(const [k,min,max]of [['masterVolume',0,1],['sfxVolume',0,1],['zoomLevel',.4,2],['resizerHeight',0,2000]]){
    if(Number.isFinite(Number(data[k])))state[k]=Math.max(min,Math.min(max,Number(data[k])));
  }
  for(const k of ['saveAllIn','resizerEnabled'])if(typeof data[k]==='boolean')state[k]=data[k];
  if(['single','double'].includes(data.columnMode))state.columnMode=data.columnMode;
  if(typeof data.firstHandDrawPending==='boolean')firstHandDrawPendingV218=data.firstHandDrawPending;
  if(Array.isArray(data.history))historyStack=data.history.filter(h=>h&&Array.isArray(h.groups)).slice(-MAX_HISTORY);
  ensureV2State();ensureGroupNumbersV213(false);
}
function importClassroomData(data){
  if(state.isLocked)return {ok:false,error:'请先解锁'};
  const old=clone(state),history=clone(historyStack),first=firstHandDrawPendingV218;
  try{
    Reliability.validateBackup(data);
    cancelScoreAnimationAndSync();
    applyClassroomBackup(data);
    const result=saveState();
    if(!result.ok)throw Error(result.error);
    document.body.style.zoom=state.zoomLevel;
    renderAll();return {ok:true};
  }catch(error){
    state=old;historyStack=history;firstHandDrawPendingV218=first;
    renderAll();return {ok:false,error:String(error.message||error)};
  }
}
function itemCommandSnapshot(){return JSON.stringify({groups:state.groups,itemGlobal:state.itemGlobal})}
function runClassroomCommand(description,operation){
  if(window.itemCommandActive)return false;
  const before=clone(state),oldHistory=clone(historyStack);
  window.classroomRecordingCommand=true;
  try{recordHistory(description)}finally{window.classroomRecordingCommand=false}
  window.itemCommandActive=true;
  try{
    const result=operation();
    if(result===false){
      state=before;historyStack=oldHistory;cancelItemScoreAnimations();return false;
    }
    if(state.groups.some(g=>!Number.isSafeInteger(g.score)))throw Error('操作结果超出安全整数范围');
    window.itemCommandActive=false;
    const saved=saveState();
    if(!saved.ok)throw Error(saved.error);
    renderAll();return true;
  }catch(error){
    state=before;historyStack=oldHistory;cancelScoreAnimationAndSync();
    renderAll();showToast('操作未完成，已回滚，请导出备份：'+error.message);
    return false;
  }finally{window.itemCommandActive=false;}
}
function useItem(groupId,index){
  if(window.itemCommandActive)return false;
  const g=state.groups.find(x=>x.id===groupId);
  const reason=Reliability.validateItem(state,g,index,isCommunismMode());
  closeItemWindowForFx();
  if(reason){showToast(reason);return false}
  const key=g.inventory[index].key;
  return runClassroomCommand(`${g.name} 使用道具：${ITEM_DEFS[key]?.name||key}`,()=>{
    ensureV2State();
    const beforeValue=itemCommandSnapshot();
    if(g.itemEffect?.iceLock){
      delete g.itemEffect.iceLock;delete g.itemEffect.iceRoundsLeftV218;
      if(!Object.keys(g.itemEffect).length)g.itemEffect=null;
      markItemUsedThisRoundV2177(groupId);
      showToast(`${g.name} 冰冻已解除，本次道具使用取消`);
      return true;
    }
    const result=legacyUseItem(groupId,index);
    if(result===false||itemCommandSnapshot()===beforeValue)return false;
    markItemUsedThisRoundV2177(groupId);
    return true;
  });
}
// Restore only after legacy startup adapters exist; never auto-save during boot.
try{
  const raw=localStorage.getItem(Reliability.stateKey);
  if(raw)applyClassroomBackup(JSON.parse(raw));
}catch(error){
  console.error('主存档读取失败，未覆盖原存档',error);
  window.classroomRecoveryRequired=true;
  setTimeout(()=>themeAlert('主存档损坏或无法读取。未自动覆盖原数据；请导出备份并检查存储权限。'),1000);
}
window.classroomReady=!window.classroomRecoveryRequired;

function judgeRound(){
  if(!state.roundActive||state.evaluated||!state.correctAns)return false;
  try{Reliability.calculateRoundScores(state)}catch(error){themeAlert(error.message);return false}
  return runClassroomCommand(`自动判定结算 (正解: ${state.correctAns})`,()=>{legacyJudgeRound();return true});
}

const classroomDock=document.querySelector('.bottom-dock');
if(classroomDock&&typeof ResizeObserver==='function'){
  new ResizeObserver(()=>document.body.style.setProperty('--dock-height',classroomDock.getBoundingClientRect().height+'px')).observe(classroomDock);
}
