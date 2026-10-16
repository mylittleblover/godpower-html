
/* ===== V2.17.13：攻击动画 -> 积分重绘 -> 排名重排 =====
   旧问题：
   applyItemScore() 先修改积分，useItem() 紧接着 renderAll()，
   而受击动画要等约 110ms 才播放。
   结果就是卡片先因为新积分换了排名，蓝光/受击动画才追到新位置。

   新顺序：
   1. 先完成逻辑计算，但暂缓 DOM 排名重绘；
   2. 约 110ms 时在“原位置”播放受击/防御反馈；
   3. 给反馈约 230ms 的可见时间；
   4. 再一次性刷新积分并执行卡片排名重排。

   这样不改道具数值逻辑，只修正视觉因果顺序。 */

const ATTACK_REORDER_DELAY_V21713 = 340;

let attackRenderGateV21713 = false;
let attackRenderTimerV21713 = null;
let attackRenderFlushingV21713 = false;
let pendingRenderArgsV21713 = null;

/* 所有经过 applyItemScore 的负向攻击，都需要“先受击，再重排”。 */
const _v21713ApplyItemScore = applyItemScore;
applyItemScore = function(target,delta,sourceId,attackType='normal'){
  if(delta < 0 && target && eligibleForItems(target)){
    attackRenderGateV21713 = true;
  }
  return _v21713ApplyItemScore.call(this,target,delta,sourceId,attackType);
};

/* 闪电有自己的直接扣分入口，不经过 applyItemScore，也纳入同一时序。 */
const _v21713ApplyLightningHit = applyLightningHitV2116;
applyLightningHitV2116 = function(caster,target){
  if(target && eligibleForItems(target)){
    attackRenderGateV21713 = true;
  }
  return _v21713ApplyLightningHit.call(this,caster,target);
};

/* renderAll 最终守门：
   攻击发生后第一次 renderAll 不立即重建卡片，先让旧位置上的 hit FX 出现。
   同一批多目标攻击只合并成一次延迟刷新，不会每个目标各拖 340ms。 */
const _v21713RenderAll = renderAll;
renderAll = function(...args){
  if(attackRenderFlushingV21713){
    return _v21713RenderAll.apply(this,args);
  }

  if(attackRenderGateV21713){
    attackRenderGateV21713 = false;
    pendingRenderArgsV21713 = args;

    if(attackRenderTimerV21713){
      clearTimeout(attackRenderTimerV21713);
    }

    attackRenderTimerV21713 = setTimeout(()=>{
      attackRenderTimerV21713 = null;
      attackRenderFlushingV21713 = true;
      try{
        _v21713RenderAll.apply(this,pendingRenderArgsV21713 || []);
      }finally{
        pendingRenderArgsV21713 = null;
        attackRenderFlushingV21713 = false;
      }
    },ATTACK_REORDER_DELAY_V21713);

    return;
  }

  return _v21713RenderAll.apply(this,args);
};

/* 如果攻击动画期间又触发了纯 renderGrid（例如某些卡片排序包装），
   也暂缓到攻击反馈之后，避免它从侧门把卡片提前排走。 */
const _v21713RenderGrid = renderGrid;
renderGrid = function(...args){
  if(
    !attackRenderFlushingV21713 &&
    (attackRenderGateV21713 || attackRenderTimerV21713)
  ){
    return;
  }
  return _v21713RenderGrid.apply(this,args);
};
