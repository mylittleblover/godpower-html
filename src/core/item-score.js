/* Single attack/defense entry. Migrated from 00/05/17/31/36 without changing
   damage fractions, defense priority or inventory consumption. */
function tryDefend(g,attackType){
  // V2.18 ghost lifetime and explicit horn refusal precede the older defenses.
  if(Number(g?.booRoundsLeftV218||0)>0 && Number(g?.booShield||0)>0){
    tinyDefenseToast(`对方持有防御：害羞幽灵保护（剩余 ${g.booRoundsLeftV218} 次答题）`);
    return true;
  }
  if(attackType==='spiny' && g?.__spinyHornDeclinedV218 && g.inventory?.[0]?.key==='horn')return false;

  if(!eligibleForItems(g))return true;

  /* 羽毛依然最优先。 */
  if(g.itemEffect && Number(g.itemEffect.featherDodge||0)>0){
    g.itemEffect.featherDodge=Math.max(0,Number(g.itemEffect.featherDodge||0)-1);
    if(g.itemEffect.featherDodge<=0) delete g.itemEffect.featherDodge;
    if(Object.keys(g.itemEffect).length===0) g.itemEffect=null;
    tinyDefenseToast(`${g.name} 使用羽毛跃起，闪避了本次攻击`);
    return true;
  }

  if(g.itemEffect?.type==='bullet'){
    tinyDefenseToast(`${g.name} 的炮弹刺客处于绝对防御`);
    return true;
  }

  /* 持续状态与害羞幽灵仍优先于道具栏。 */
  if(g.itemEffect && ['star','mega'].includes(g.itemEffect.type)){
    const type=g.itemEffect.type;
    tinyDefenseToast(`对方持有防御：${ITEM_DEFS[type]?.name||'持续状态'}`);
    g.itemEffect.hitsLeft=Math.max(0,Number(g.itemEffect.hitsLeft||0)-1);
    if(g.itemEffect.hitsLeft<=0){
      /* 无敌星已不在道具栏；巨大蘑菇仍是卡手主要道具，需要释放。 */
      if(type==='mega'){
        const ix=g.inventory.findIndex(x=>x.key==='mega');
        if(ix>=0)g.inventory.splice(ix,1);
      }
      g.itemEffect=null;
    }
    return true;
  }

  if(Number(g.booShield||0)>0){
    tinyDefenseToast(`对方持有防御：害羞幽灵保护`);
    g.booShield=Math.max(0,Number(g.booShield||0)-1);
    return true;
  }

  const main=g.inventory?.[0];

  /* 炸弹只防红/绿龟壳，并以自爆作为防御代价。 */
  if(main?.key==='bomb' && SHELL_ATTACK_KEYS_V2170.has(attackType)){
    g.inventory.splice(0,1);
    tinyDefenseToast(`${g.name} 用炸弹兵挡住了${ITEM_DEFS[attackType]?.name||'龟壳'}`);
    explodeDestroyedBombV2170(g,null,'防御龟壳时');
    return true;
  }

  /* 原有基础防御。刺龟壳只保留超级喇叭，基础防御会在命中前被直接摧毁。 */
  if(main && ['green','triple_green','red','triple_red','banana','triple_banana','horn'].includes(main.key)){
    const canBlock = attackType==='spiny'
      ? main.key==='horn'
      : true;
    if(canBlock){
      tinyDefenseToast(`对方持有防御：${ITEM_DEFS[main.key]?.name||'防御道具'}`);
      consumeInventoryItem(g,0,1);
      return true;
    }
  }

  /* 刺龟壳的蘑菇主动闪避仍保留。 */
  if(attackType==='spiny'){
    const mi=(g.inventory?.[0]&&['mushroom','triple_mushroom'].includes(g.inventory[0].key))?0:-1;
    if(mi===0 && !g.__spinyMushroomDeclinedV21727){
      return true;
    }
  }

  return false;

}

function requestSpinyDefense(target,key,continueAttack){
  const horn=key==='horn',flag=horn?'__spinyHornDecisionPendingV218':'__spinyDecisionPendingV21727';
  const declined=horn?'__spinyHornDeclinedV218':'__spinyMushroomDeclinedV21727';
  target[flag]=true;
  const decision=Reliability.captureDefenseDecision(state,target,key);
  const name=ITEM_DEFS[key]?.name||'蘑菇';
  const prompt=themeConfirm(
    `${target.name} 遭遇刺龟壳！\n是否主动消耗主要道具 ${name} 抵消本次攻击？`,
    {title:'刺龟壳来袭',confirmText:horn?'使用超级喇叭':'使用蘑菇闪避',cancelText:'承受攻击'}
  );
  const clear=()=>{target[flag]=false};
  deferClassroomDefense(prompt,useIt=>{
    clear();
    if(useIt){
      consumeInventoryItem(target,0,1);
      tinyDefenseToast(horn?`${target.name} 使用超级喇叭成功击碎刺龟壳`:`${target.name} 使用主要道具蘑菇成功闪避刺龟壳`);
      return;
    }
    target[declined]=true;
    try{continueAttack()}finally{delete target[declined]}
  },()=>Reliability.isDefenseDecisionCurrent(state,decision));
  Promise.resolve(prompt).then(clear,clear);
  return {changed:false,blocked:horn?'pending-horn-defense':'pending-defense'};
}

function commitItemScore(target,delta,sourceId,attackType){
  let result;
  if(!target||!eligibleForItems(target))result={changed:false,blocked:'negative'};
  else if(delta<0&&tryDefend(target,attackType))result={changed:false,blocked:'defense'};
  else{
    const before=target.score;
    target.score=Math.round((Number(target.score)||0)+delta);target.displayScore=target.score;
    result={changed:before!==target.score,before,after:target.score};
  }
  if(delta<0 && target && ITEM_DEFS[attackType]){
    const liveState=state;
    scheduleScoreEffect(()=>{
      if(state===liveState && state.groups.includes(target))playAttackTargetFxV2116(target.id,attackType,result.blocked==='defense');
    },110);
  }
  return result;
}

function applyItemScoreAfterHorn(target,delta,sourceId,attackType){
  const before=target?Number(target.score)||0:null;
  if(delta<0 && target && eligibleForItems(target))attackRenderGateV21713=true;
  let result;
  if(delta<0 && target && attackType==='spiny'){
    destroyPrimaryBasicDefenseV2170(target,sourceId,'刺龟壳');
    const main=target.inventory?.[0];
    if(main && ['mushroom','triple_mushroom'].includes(main.key) && !target.__spinyMushroomDeclinedV21727 && !target.__spinyDecisionPendingV21727){
      result=requestSpinyDefense(target,main.key,()=>commitItemScore(target,delta,sourceId,attackType));
    }
  }else if(delta<0 && target && attackType==='boomerang_flower'){
    destroyPrimaryBasicDefenseV2170(target,sourceId,'回旋镖');
  }
  result=result||commitItemScore(target,delta,sourceId,attackType);
  if(itemScoreBatchDepthV21732===0 && target && result.changed && before!==null && Number(target.score)!==before){
    queueItemScoreChangesV21732(new Map([[String(target.id),before]]));
  }
  return result;
}

function applyItemScore(target,delta,sourceId,attackType='normal'){
  if(delta<0 && attackType==='spiny' && target?.inventory?.[0]?.key==='horn' &&
    !target.__spinyHornDecisionPendingV218 && !target.__spinyHornDeclinedV218){
    return requestSpinyDefense(target,'horn',()=>applyItemScoreAfterHorn(target,delta,sourceId,attackType));
  }
  return applyItemScoreAfterHorn(target,delta,sourceId,attackType);
}
