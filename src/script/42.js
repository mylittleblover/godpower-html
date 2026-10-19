
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

/* Runtime execution is owned by items/operation.js; this block only supplies legacy copy. */


