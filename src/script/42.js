
/* ===== V2.18.9：火之花加强 / 冰之花禁止重复冻结 ===== */

/* 文案统一 */
if(ITEM_DEFS.fire_flower){
  ITEM_DEFS.fire_flower.desc='3 发火球；每次随机攻击一个其他小组，扣除其当前积分的 1/4。';
}
if(ITEM_DEFS.ice_flower){
  ITEM_DEFS.ice_flower.desc='3 发冰球；每次只会从尚未被冻结的小组中随机选择目标，扣除其当前积分的 1/5 并冻结其主动道具。若所有可攻击小组都已被冻结，本次使用仍会消耗 1 发，但不产生效果。';
}
if(typeof GROUP_ITEM_DESC_V2182!=='undefined'){
  GROUP_ITEM_DESC_V2182.fire_flower='3 次火球；每次随机攻击一个其他小组，扣除其当前积分的 1/4。';
  GROUP_ITEM_DESC_V2182.ice_flower='3 次冰球；只会随机攻击尚未被冻结的小组，扣除其当前积分的 1/5 并冻结其主动道具。目标尝试使用道具时强制解除并取消该次使用；若一直不用，3 次答题后自动解除。若所有可攻击小组均已冻结，本次使用消耗 1 发但无效果。';
}
if(typeof ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715!=='undefined'){
  ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715.fire_flower='拥有 3 次火之花攻击次数；每次随机攻击一个其他小组，扣除其当前积分的 1/4。';
  ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715.ice_flower='拥有 3 次冰之花攻击次数；每次只会随机攻击尚未被冻结的小组，扣除其当前积分的 1/5 并冻结其主动道具。若所有可攻击小组都已被冻结，本次使用会消耗 1 发但不产生效果。';
}
if(typeof ITEM_FUNNY_COPY_V2184!=='undefined'){
  ITEM_FUNNY_COPY_V2184.fire_flower='没有冻结，没有偷窃，没有哲学思考。随机找一组直接扣掉四分之一。火之花不讲控制，不讲绕弯，四分之一直接蒸发。工作方式简单得令人安心。';
  ITEM_FUNNY_COPY_V2184.ice_flower='先扣五分之一，再把对方的道具按钮冻住。但它拒绝反复冻同一个人，毕竟冷冻柜也讲究容量管理；要是全场都冻上了，这一发就只能表演空气制冷。';
}
if(typeof ITEM_TIPS_V218!=='undefined'){
  ITEM_TIPS_V218.fire_flower='纯伤害为 -1/4，适合直接压低对手分数，不附带额外控制。';
  ITEM_TIPS_V218.ice_flower='不会选择已经冻结的小组，因此控制会自然分散到不同目标；若全场可攻击目标都已被冻结，再用只会白白消耗 1 发。';
}

/* 最外层接管两种花，确保不会被旧版 1/5 逻辑抢回去。 */
const _v2189UseItem = legacyUseItem;
legacyUseItem = function(groupId,index,...rest){
  const g=state.groups.find(x=>x.id===groupId);
  const it=g?.inventory?.[index];
  const key=it?.key;
  if(!g||!it||(key!=='fire_flower'&&key!=='ice_flower')){
    return _v2189UseItem.call(this,groupId,index,...rest);
  }

  /* 沿用每题主动道具限制；如果旧包装器已处理冻结/限制，就让它接管。 */
  if(state.roundActive && !state.evaluated && g.itemUsedThisRound){
    showToast(`${g.name} 本题已经使用过主动道具`);
    return false;
  }

  if(g.itemEffect?.iceLock){
    /* 交回旧逻辑处理“尝试使用 -> 解冻但本次作废”的机制。 */
    return _v2189UseItem.call(this,groupId,index,...rest);
  }

  const allTargets=state.groups.filter(x=>x.id!==g.id && eligibleForItems(x));

  if(key==='ice_flower'){
    const pool=allTargets.filter(t=>!t.itemEffect?.iceLock);

    /* 所有目标均被冻结：消耗 1 发，但无效果。 */
    if(!pool.length){
      consumeOneV218(g,index);
      g.itemStats=g.itemStats||{};
      g.itemStats.used=(Number(g.itemStats.used)||0)+1;
      recordHistory(`${g.name} 使用道具：${ITEM_DEFS.ice_flower.name}（所有可攻击目标均已冻结，无效果）`);
      saveState();renderAll();
      showItemUseFx('ice_flower',g.id,'所有可攻击目标均已冻结 · 本次无效果');
      showToast(`${g.name} 的冰之花没有找到未冻结目标`);
      return true;
    }

    const t=pool[Math.floor(Math.random()*pool.length)];
    const result=attackOneFifthV218(g,t,'ice_flower');
    if(!result?.blocked){
      t.itemEffect={...(t.itemEffect||{}),iceLock:1,iceRoundsLeftV218:3};
    }
    consumeOneV218(g,index);
    g.itemStats=g.itemStats||{};
    g.itemStats.used=(Number(g.itemStats.used)||0)+1;
    recordHistory(`${g.name} 使用道具：${ITEM_DEFS.ice_flower.name}`);
    saveState();renderAll();
    showItemUseFx('ice_flower',g.id,result?.blocked?`目标：${t.name} · 攻击被防御`:`目标：${t.name} · -1/5 并冻结`);
    showToast(`${g.name} 使用了 ${ITEM_DEFS.ice_flower.name}`);
    return true;
  }

  /* 火之花：-1/4 */
  if(!allTargets.length){
    showToast('没有可攻击的小组');
    return false;
  }
  const t=allTargets[Math.floor(Math.random()*allTargets.length)];
  const amount=Math.round(Math.max(0,Number(t.score)||0)/4);
  const result=amount>0 ? applyItemScore(t,-amount,g.id,'fire_flower') : {changed:false};

  consumeOneV218(g,index);
  g.itemStats=g.itemStats||{};
  g.itemStats.used=(Number(g.itemStats.used)||0)+1;
  recordHistory(`${g.name} 使用道具：${ITEM_DEFS.fire_flower.name}`);
  saveState();renderAll();
  showItemUseFx('fire_flower',g.id,result?.blocked?`目标：${t.name} · 攻击被防御`:`目标：${t.name} · -1/4`);
  showToast(`${g.name} 使用了 ${ITEM_DEFS.fire_flower.name}`);
  return true;
};
