
/* ===== V2.18.13：封神榜把清零前的数据全部装进档案 ===== */

function snapshotGroupForSettlementV21813(g){
  return {
    id:g.id,
    name:g.name,
    color:g.color,
    members:clone(g.members||[]),
    score:Number(g.score)||0,
    displayScore:Number(g.displayScore)||0,
    allIn:!!g.allIn,
    selectedOpt:g.selectedOpt||'',
    resultText:g.resultText||'',
    animState:g.animState||'',
    inventory:clone(g.inventory||[]),
    itemStats:clone(g.itemStats||{}),
    itemEffect:clone(g.itemEffect||null),
    booShield:Number(g.booShield)||0,
    booRoundsLeftV218:Number(g.booRoundsLeftV218)||0,
    itemUsedThisRound:!!g.itemUsedThisRound,
    roundItemContinuationKeyV218:g.roundItemContinuationKeyV218||'',
    spinyHornDecisionPending:!!g.__spinyHornDecisionPendingV218,
    spinyHornDeclined:!!g.__spinyHornDeclinedV218
  };
}

function compactUndoHistoryV21813(){
  /* 保存历史节点的可读信息与当时每组状态。
     不塞进界面配置和图标这类长期设置，避免档案无意义膨胀。 */
  return (historyStack||[]).map(h=>({
    desc:h.desc||'',
    time:h.time||'',
    groups:(h.groups||[]).map(snapshotGroupForSettlementV21813),
    picker:clone(h.picker||null),
    correctAns:h.correctAns||'',
    evaluated:!!h.evaluated,
    roundActive:!!h.roundActive,
    hasStartedOnce:!!h.hasStartedOnce,
    lastRoundAllIn:clone(h.lastRoundAllIn||null),
    itemGlobal:h.itemGlobal ? clone(h.itemGlobal) : null
  }));
}

function buildSettlementClearedDataV21813(){
  const ig=state.itemGlobal||{};
  return {
    archivedAt:new Date().toLocaleString(),

    groups:state.groups.map(snapshotGroupForSettlementV21813),

    round:{
      roundActive:!!state.roundActive,
      evaluated:!!state.evaluated,
      correctAnswer:state.correctAnswer||'',
      correctAns:state.correctAns||'',
      roundNo:Number(state.roundNo)||0,
      hasStartedOnce:!!state.hasStartedOnce,
      lastRoundAllIn:clone(state.lastRoundAllIn||null)
    },

    itemGlobal:{
      blooperUntil:Number(ig.blooperUntil)||0,
      totalDraws:Number(ig.totalDraws)||0,
      pickerHistory:clone(ig.pickerHistory||[]),
      handRaiseHistory:clone(ig.handRaiseHistory||[]),
      handRaiseTotal:Number(ig.handRaiseTotal)||0,
      pkTotal:Number(ig.pkTotal)||0,
      drawThrottleV2179:clone(ig.drawThrottleV2179||null),
      drawSessionThrottleV21710:clone(ig.drawSessionThrottleV21710||null)
    },

    picker:{
      mode:state.picker?.mode||'',
      pickedStudentKeys:clone(state.picker?.pickedStudentKeys||[]),
      pickedGroupIds:clone(state.picker?.pickedGroupIds||[]),
      preselectedGroupIds:clone(state.picker?.preselectedGroupIds||[])
    },

    transient:{
      handRaiseGroupId:typeof handRaiseGroupId!=='undefined'?handRaiseGroupId:null,
      handItemDrawGroupId:typeof handItemDrawGroupId!=='undefined'?handItemDrawGroupId:null,
      handItemPendingKey:typeof handItemPendingKey!=='undefined'?handItemPendingKey:null,
      handItemDrawStartedAt:typeof handItemDrawStartedAt!=='undefined'?Number(handItemDrawStartedAt)||0:0,
      activeDrawSession:typeof activeDrawSessionV21710!=='undefined'?clone(activeDrawSessionV21710):null,
      itemDrawBusy:typeof itemDrawBusy!=='undefined'?!!itemDrawBusy:false,
      firstHandDrawPending:typeof firstHandDrawPendingV218!=='undefined'?!!firstHandDrawPendingV218:false,
      activeItemGroupId:typeof activeItemGroupId!=='undefined'?activeItemGroupId:null,
      pickerInfoTab:typeof pickerInfoTab!=='undefined'?pickerInfoTab:'',
      slotEngine:typeof slotEngine!=='undefined'?{
        isSpinning:!!slotEngine.isSpinning,
        spinning:!!slotEngine.spinning,
        chosenResult:clone(slotEngine.chosenResult||null)
      }:null
    },

    undoHistory:compactUndoHistoryV21813()
  };
}

/* saveSettlementRecord 调用发生在归零之前，因此在这里截取完整快照最稳妥。 */
function csvCellV21813(v){
  if(v===null||v===undefined)return '""';
  let text;
  if(typeof v==='object'){
    try{text=JSON.stringify(v)}catch(e){text=String(v)}
  }else text=typeof v==='string'?Reliability.csvText(v):String(v);
  return `"${text.replace(/"/g,'""')}"`;
}
function itemNameV21813(key){
  return ITEM_DEFS?.[key]?.name||key||'';
}
function inventoryTextV21813(inv){
  return (inv||[]).map(it=>{
    const n=itemNameV21813(it.key);
    const c=Number(it.charges)||1;
    return c>1?`${n} ×${c}`:n;
  }).join(' / ');
}
function effectTextV21813(g){
  const out=[];
  if(g.itemEffect?.type){
    const d=ITEM_DEFS?.[g.itemEffect.type]?.name||g.itemEffect.type;
    out.push(`${d}${Number(g.itemEffect.roundsLeft)>0?`（剩余${g.itemEffect.roundsLeft}次）`:''}`);
  }
  if(g.itemEffect?.iceLock)out.push(`冰冻（剩余${Number(g.itemEffect.iceRoundsLeftV218)||0}次答题）`);
  if(Number(g.itemEffect?.featherDodge)>0)out.push(`羽毛闪避 ×${g.itemEffect.featherDodge}`);
  if(Number(g.booShield)>0||Number(g.booRoundsLeftV218)>0)out.push(`害羞幽灵防护（剩余${Number(g.booRoundsLeftV218)||0}次答题）`);
  return out.join(' / ')||'无';
}

/* CSV 不再只导四列。整个档案按分区写进同一个 CSV。 */
exportSingleSettlementCSV=function(index){
  const list=getSettlementHistory();
  const record=list[index];
  if(!record)return;

  const snap=record.clearedData||{};
  const groups=snap.groups?.length?snap.groups:record.groups||[];
  const ig=snap.itemGlobal||{};
  const lines=[];

  /* 档案概要 */
  lines.push('【封神榜档案概要】');
  lines.push('字段,内容');
  [
    ['档案名称',record.title||'课堂结算'],
    ['归档日期',record.date||''],
    ['归档时间',record.time||''],
    ['第一名',record.champion||''],
    ['小组数量',record.totalGroups??groups.length],
    ['全班总分',record.totalScore??groups.reduce((n,g)=>n+(Number(g.score)||0),0)]
  ].forEach(r=>lines.push(`${csvCellV21813(r[0])},${csvCellV21813(r[1])}`));
  lines.push('');

  /* 本轮全局统计 */
  lines.push('【本轮课堂统计】');
  lines.push('项目,数值');
  const answers=groups.reduce((n,g)=>n+(Number(g.itemStats?.correct)||0)+(Number(g.itemStats?.wrong)||0),0);
  [
    ['课堂作答总次数',answers],
    ['答题轮次',Number(ig.pkTotal)||0],
    ['全局道具发放',Number(ig.totalDraws)||0],
    ['手动举手次数',Number(ig.handRaiseTotal)||0],
    ['随机点名记录数',(ig.pickerHistory||[]).length],
    ['手动举手记录数',(ig.handRaiseHistory||[]).length],
    ['撤销历史节点数',(snap.undoHistory||[]).length]
  ].forEach(r=>lines.push(`${csvCellV21813(r[0])},${csvCellV21813(r[1])}`));
  lines.push('');

  /* 小组最终状态 */
  lines.push('【各组最终状态】');
  lines.push([
    '排名','小组名称','最终得分','组员名单',
    '答对次数','答错次数','道具抽取次数','道具使用次数',
    '持有道具','持续状态','幽灵防护剩余','本题已使用道具','三重道具续用键',
    'All In','所选答案','结果文字'
  ].map(csvCellV21813).join(','));

  const ranked=[...groups].sort((a,b)=>(Number(b.score)||0)-(Number(a.score)||0));
  ranked.forEach((g,r)=>{
    lines.push([
      r+1,g.name,Number(g.score)||0,(g.members||[]).join(' / '),
      Number(g.itemStats?.correct)||0,Number(g.itemStats?.wrong)||0,
      Number(g.itemStats?.draws)||0,Number(g.itemStats?.used)||0,
      inventoryTextV21813(g.inventory),effectTextV21813(g),
      Number(g.booRoundsLeftV218)||0,g.itemUsedThisRound?'是':'否',
      g.roundItemContinuationKeyV218||'',
      g.allIn?'是':'否',g.selectedOpt||'',g.resultText||''
    ].map(csvCellV21813).join(','));
  });
  lines.push('');

  /* 道具全局状态 / 冷却 */
  lines.push('【道具与抽取状态】');
  lines.push('项目,内容');
  [
    ['鱿鱿遮蔽截止时间',Number(ig.blooperUntil)||0],
    ['抽取节流状态',ig.drawThrottleV2179||{}],
    ['抽取轮次与冷却',ig.drawSessionThrottleV21710||{}],
    ['第一次手动举手特殊抽取是否待触发',snap.transient?.firstHandDrawPending?'是':'否'],
    ['当前抽取会话',snap.transient?.activeDrawSession||null],
    ['当前是否正在抽取',snap.transient?.itemDrawBusy?'是':'否']
  ].forEach(r=>lines.push(`${csvCellV21813(r[0])},${csvCellV21813(r[1])}`));
  lines.push('');

  /* 随机点名 */
  lines.push('【随机点名与防重复记录】');
  lines.push('项目,内容');
  [
    ['点名模式',snap.picker?.mode||''],
    ['已抽学生键',snap.picker?.pickedStudentKeys||[]],
    ['已抽小组 ID',snap.picker?.pickedGroupIds||[]],
    ['预选小组 ID',snap.picker?.preselectedGroupIds||[]],
    ['当前抽取结果',snap.transient?.slotEngine?.chosenResult||null]
  ].forEach(r=>lines.push(`${csvCellV21813(r[0])},${csvCellV21813(r[1])}`));
  lines.push('');

  /* 随机点名历史 */
  lines.push('【随机点名历史】');
  lines.push('序号,时间,记录');
  (ig.pickerHistory||[]).forEach((x,i)=>{
    lines.push([i+1,x.time?new Date(x.time).toLocaleString():'',x.text||''].map(csvCellV21813).join(','));
  });
  if(!(ig.pickerHistory||[]).length)lines.push('1,"","无记录"');
  lines.push('');

  /* 举手历史 */
  lines.push('【手动举手历史】');
  lines.push('序号,时间,小组ID,小组名称,结果');
  (ig.handRaiseHistory||[]).forEach((x,i)=>{
    const g=groups.find(q=>q.id===x.groupId);
    lines.push([
      i+1,x.time?new Date(x.time).toLocaleString():'',x.groupId??'',
      g?.name||'',x.correct?'正确':'错误'
    ].map(csvCellV21813).join(','));
  });
  if(!(ig.handRaiseHistory||[]).length)lines.push('1,"","","","无记录"');
  lines.push('');

  /* 回合状态 */
  lines.push('【结算前回合状态】');
  lines.push('项目,内容');
  const rd=snap.round||{};
  [
    ['是否正在答题',rd.roundActive?'是':'否'],
    ['是否已判定',rd.evaluated?'是':'否'],
    ['正确答案',rd.correctAnswer||rd.correctAns||''],
    ['回合编号',Number(rd.roundNo)||0],
    ['是否曾开始过比赛',rd.hasStartedOnce?'是':'否'],
    ['上一轮 All In 状态',rd.lastRoundAllIn||null],
    ['当前举手小组 ID',snap.transient?.handRaiseGroupId??''],
    ['当前举手抽道具小组 ID',snap.transient?.handItemDrawGroupId??''],
    ['待定道具键',snap.transient?.handItemPendingKey??''],
    ['道具抽取开始时间',snap.transient?.handItemDrawStartedAt??0],
    ['当前道具详情小组 ID',snap.transient?.activeItemGroupId??'']
  ].forEach(r=>lines.push(`${csvCellV21813(r[0])},${csvCellV21813(r[1])}`));
  lines.push('');

  /* 撤销历史 */
  lines.push('【撤销 / 回溯历史】');
  lines.push('节点,时间,操作,小组状态快照,随机点名快照,道具全局快照');
  (snap.undoHistory||[]).forEach((h,i)=>{
    const groupSummary=(h.groups||[]).map(g=>({
      id:g.id,name:g.name,score:g.score,
      inventory:g.inventory,itemStats:g.itemStats,itemEffect:g.itemEffect,
      booShield:g.booShield,booRoundsLeftV218:g.booRoundsLeftV218,
      allIn:g.allIn,selectedOpt:g.selectedOpt
    }));
    lines.push([
      i+1,h.time||'',h.desc||'',groupSummary,h.picker||null,h.itemGlobal||null
    ].map(csvCellV21813).join(','));
  });
  if(!(snap.undoHistory||[]).length)lines.push('1,"","无历史节点","","",""');
  lines.push('');

  /* 最后放原始快照，确保未来即使新增字段，档案也不是只能看表面。 */
  lines.push('【原始清零前快照】');
  lines.push('说明,JSON');
  lines.push(`${csvCellV21813('以下 JSON 保存本次结算前、会被归零的数据快照')},${csvCellV21813(snap)}`);

  const csvContent="\uFEFF"+lines.join("\n");
  const blob=new Blob([csvContent],{type:'text/csv;charset=utf-8;'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download=`${(record.title||'封神榜档案').replace(/[\/\s:]/g,'_')}_完整档案.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('完整档案已导出，清零前的数据一个没落下');
};
