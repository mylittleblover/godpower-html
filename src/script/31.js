let scoreAnimationEpoch=0;
function scheduleScoreEffect(fn,delay){
  const epoch=scoreAnimationEpoch;
  return setTimeout(()=>{if(epoch===scoreAnimationEpoch)fn()},delay);
}
function cancelItemScoreAnimations(){
  scoreAnimationEpoch++;
  clearTimeout(attackRenderTimerV21713);
  attackRenderTimerV21713=null;attackRenderGateV21713=false;pendingRenderArgsV21713=null;
  clearTimeout(queueItemScoreChangesV21732._timer);
  pendingItemScoreAnimationsV21732.length=0;
  itemScoreDisplayHoldV21732.clear();
}

/* ===== V2.17.32：先播放分数变化提示，再更新实际显示分数 =====
   时序：
   道具动画 -> +N/-N 提示 -> 旧分数向上滚走 / 新分数滚入 -> 正式显示新分数。
   真实 score 仍立即结算，只延迟卡片上的 displayScore，避免规则判断被动画影响。
*/

let itemScoreBatchDepthV21732=0;
let pendingItemScoreAnimationsV21732=[];
const ITEM_SCORE_AFTER_FX_DELAY_V21732=820;
const ITEM_DELTA_DURATION_V21732=780;
const ITEM_SCORE_ROLL_DURATION_V21732=620;

/* 正在“视觉冻结”的小组：renderGrid 无论被谁调用，都先显示旧分数。 */
const itemScoreDisplayHoldV21732=new Map();

function snapshotScoresV21732(){
  return new Map(state.groups.map(g=>[String(g.id),Number(g.score)||0]));
}

function getScoreElementV21732(groupId){
  return document.getElementById(`score-val-${groupId}`);
}

function applyHeldDisplayScoresV21732(){
  itemScoreDisplayHoldV21732.forEach((old,key)=>{
    const g=state.groups.find(x=>String(x.id)===String(key));
    if(g)g.displayScore=old;
  });
}

function showDeltaOnlyV21732(groupId,delta){
  const scoreEl=getScoreElementV21732(groupId);
  if(!scoreEl||!delta)return;

  scoreEl.querySelectorAll('.item-score-delta-v21730').forEach(x=>x.remove());

  const deltaEl=document.createElement('span');
  deltaEl.className=`item-score-delta-v21730 ${delta>0?'gain':'loss'}`;
  deltaEl.textContent=delta>0?`+${delta}`:`${delta}`;
  scoreEl.appendChild(deltaEl);
  requestAnimationFrame(()=>deltaEl.classList.add('play'));

  scheduleScoreEffect(()=>{
    if(deltaEl.isConnected)deltaEl.remove();
  },ITEM_DELTA_DURATION_V21732+80);
}

function rollThenCommitScoreV21732(groupId,from,to){
  const scoreEl=getScoreElementV21732(groupId);
  const g=state.groups.find(x=>String(x.id)===String(groupId));
  if(!scoreEl||!g){
    itemScoreDisplayHoldV21732.delete(String(groupId));
    if(g)g.displayScore=to;
    return;
  }

  /* 卡片在整个滚动期间仍保持旧 displayScore。
     新值只作为可见的“幽灵数字”从下方滚入，动画完成后才正式写入。 */
  scoreEl.querySelectorAll('.score-roll-ghost-v21730').forEach(x=>x.remove());

  scoreEl.textContent=`${from}分`;

  /* 锁住动画前尺寸，避免 9分→10分 之类位数变化造成横向抖动。 */
  const rect=scoreEl.getBoundingClientRect();
  if(rect.width>0) scoreEl.style.minWidth=`${Math.ceil(rect.width)}px`;
  if(rect.height>0) scoreEl.style.minHeight=`${Math.ceil(rect.height)}px`;

  scoreEl.classList.add('score-roll-host-v21730');

  const oldGhost=document.createElement('span');
  oldGhost.className='score-roll-ghost-v21730 score-roll-old-v21730';
  oldGhost.textContent=`${from}分`;
  oldGhost.style.color='#17302D';

  const newGhost=document.createElement('span');
  newGhost.className='score-roll-ghost-v21730 score-roll-new-v21730';
  newGhost.textContent=`${to}分`;
  newGhost.style.color='#17302D';

  scoreEl.append(oldGhost,newGhost);

  scheduleScoreEffect(()=>{
    itemScoreDisplayHoldV21732.delete(String(groupId));
    g.displayScore=to;

    if(scoreEl.isConnected){
      scoreEl.classList.remove('score-roll-host-v21730');
      scoreEl.style.removeProperty('min-width');
      scoreEl.style.removeProperty('min-height');
      scoreEl.textContent=`${to}分`;
    }

    try{
      renderChart();
      renderDashboard();
      updateHeaderStats();
      if(typeof renderBattleRankPreviewV21721==='function'){
        renderBattleRankPreviewV21721();
      }
    }catch(e){}
  },ITEM_SCORE_ROLL_DURATION_V21732+40);
}

function queueItemScoreChangesV21732(beforeMap){
  if(!(beforeMap instanceof Map))return;

  const changes=[];
  state.groups.forEach(g=>{
    const old=beforeMap.get(String(g.id));
    if(old===undefined)return;
    const now=Number(g.score)||0;
    if(now!==old){
      changes.push({groupId:g.id,old,now});
      /* 立即冻结“显示分数”，真实 score 已经是最终值。 */
      itemScoreDisplayHoldV21732.set(String(g.id),old);
      g.displayScore=old;

      const el=getScoreElementV21732(g.id);
      if(el)el.textContent=`${old}分`;
    }
  });
  if(!changes.length)return;

  pendingItemScoreAnimationsV21732.push(...changes);

  /* 同一轮多次命中同一组：保留最早旧值 + 最终新值。 */
  const merged=new Map();
  pendingItemScoreAnimationsV21732.forEach(c=>{
    const key=String(c.groupId);
    if(!merged.has(key))merged.set(key,{...c});
    else merged.get(key).now=c.now;
  });
  pendingItemScoreAnimationsV21732=[...merged.values()];

  clearTimeout(queueItemScoreChangesV21732._timer);
  queueItemScoreChangesV21732._timer=scheduleScoreEffect(()=>{
    const batch=pendingItemScoreAnimationsV21732.splice(0);

    batch.forEach(c=>{
      const g=state.groups.find(x=>String(x.id)===String(c.groupId));
      const finalScore=g?Number(g.score)||0:c.now;
      const delta=finalScore-c.old;
      if(!delta){
        itemScoreDisplayHoldV21732.delete(String(c.groupId));
        if(g)g.displayScore=finalScore;
        return;
      }

      /* 先只显示 +N / -N，卡片分数仍停留在旧值。 */
      showDeltaOnlyV21732(c.groupId,delta);

      /* 提示动画播放结束后，才让数字滚到新值。 */
      scheduleScoreEffect(()=>{
        rollThenCommitScoreV21732(c.groupId,c.old,finalScore);
      },ITEM_DELTA_DURATION_V21732);
    });
  },ITEM_SCORE_AFTER_FX_DELAY_V21732);
}

/* 道具主入口 */
const _v21732UseItem=legacyUseItem;
legacyUseItem=function(groupId,index,...rest){
  const before=snapshotScoresV21732();
  itemScoreBatchDepthV21732++;
  let result;
  try{
    result=_v21732UseItem.call(this,groupId,index,...rest);
  }finally{
    itemScoreBatchDepthV21732=Math.max(0,itemScoreBatchDepthV21732-1);
    queueItemScoreChangesV21732(before);
  }
  return result;
};

/* 异步攻击兜底，例如刺龟壳确认后才真正扣分。 */



/* 关键：旧逻辑在道具动画期间可能多次 renderGrid，并把 displayScore 又写成真实 score。
   每次刷新前重新套用视觉冻结值，确保新分数不会提前露出来。 */
const _v21732RenderGrid=renderGrid;
renderGrid=function(...args){
  applyHeldDisplayScoresV21732();
  const result=_v21732RenderGrid.apply(this,args);
  applyHeldDisplayScoresV21732();

  itemScoreDisplayHoldV21732.forEach((old,key)=>{
    const el=getScoreElementV21732(key);
    if(el && !el.classList.contains('score-roll-host-v21730')){
      el.textContent=`${old}分`;
    }
  });

  return result;
};
