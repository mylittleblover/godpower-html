
/* ===== V2.17.9：道具抽取冷却限制 =====
   1. 闪电 / 鱿鱿：全局冷却。抽中后必须间隔 4 次其他实际抽取，
      到第 5 次实际抽取才重新进入候选池。
   2. 炮弹刺客 / 强力蘑菇 / 巨大蘑菇 / 无敌星：
      对单组生效。任意一个被该组抽中后，该组“下一次实际抽取”
      会把这 4 个强力道具全部从候选池排除；再下一次恢复正常。
   3. 仅统计真正的最终抽取结果，不统计轮盘预览，不统计上帝模式追加。 */

const GLOBAL_FIVE_DRAW_ITEMS_V2179 = new Set(['lightning','blooper']);
const STRONG_GROUP_ITEMS_V2179 = new Set(['bullet','power','mega','star']);

function ensureDrawThrottleV2179(){
  ensureItemState();

  if(!state.itemGlobal.drawThrottleV2179 || typeof state.itemGlobal.drawThrottleV2179!=='object'){
    state.itemGlobal.drawThrottleV2179={
      sequence:0,
      nextEligible:{lightning:0,blooper:0},
      groupStrongSkip:{}
    };
  }

  const t=state.itemGlobal.drawThrottleV2179;

  if(!Number.isFinite(Number(t.sequence))) t.sequence=0;
  t.sequence=Math.max(0,Math.floor(Number(t.sequence)||0));

  if(!t.nextEligible || typeof t.nextEligible!=='object') t.nextEligible={};
  ['lightning','blooper'].forEach(k=>{
    if(!Number.isFinite(Number(t.nextEligible[k]))) t.nextEligible[k]=0;
    t.nextEligible[k]=Math.max(0,Math.floor(Number(t.nextEligible[k])||0));
  });

  if(!t.groupStrongSkip || typeof t.groupStrongSkip!=='object') t.groupStrongSkip={};

  return t;
}

function restrictedItemWeightsV2179(g){
  const r=ranking();
  const pos=Math.max(1,r.findIndex(x=>x.id===g.id)+1);
  const W={...itemDropWeights(pos,r.length)};
  const t=ensureDrawThrottleV2179();

  /* 当前即将产生的是第 sequence+1 次“实际最终抽取”。 */
  const drawNo=t.sequence+1;

  /* 全局五抽冷却。
     例如第 10 抽抽中闪电，则 11~14 抽禁用，15 抽重新开放。 */
  for(const k of GLOBAL_FIVE_DRAW_ITEMS_V2179){
    const next=Math.max(0,Number(t.nextEligible[k])||0);
    if(drawNo<next) W[k]=0;
  }

  /* 单组强力道具冷却：只封锁这个组的下一次实际抽取。 */
  if(Number(t.groupStrongSkip[g.id]||0)>0){
    STRONG_GROUP_ITEMS_V2179.forEach(k=>{W[k]=0});
  }

  return {weights:W,drawNo,throttle:t};
}

function commitDrawThrottleV2179(g,key,drawNo,t){
  /* 先消费“下一抽禁强力”的一次机会。 */
  const oldSkip=Math.max(0,Number(t.groupStrongSkip[g.id])||0);
  if(oldSkip>0){
    const left=oldSkip-1;
    if(left>0) t.groupStrongSkip[g.id]=left;
    else delete t.groupStrongSkip[g.id];
  }

  /* 本次如果又抽到了强力道具，则重新给该组挂上 1 次冷却。 */
  if(STRONG_GROUP_ITEMS_V2179.has(key)){
    t.groupStrongSkip[g.id]=1;
  }

  /* 闪电 / 鱿鱿：本次之后至少间隔 4 次其他抽取，第 5 次重新开放。 */
  if(GLOBAL_FIVE_DRAW_ITEMS_V2179.has(key)){
    t.nextEligible[key]=drawNo+5;
  }

  t.sequence=drawNo;
}

/* 完整替换最终挑选器，确保所有 fallback 都不能绕过新限制。
   之前的“防本组重复 / 同批次尽量不重复”仍保留。 */
pickItemForGroupV281=function(g,batchUsed=new Set()){
  const held=heldItemKeysV281(g);
  const {weights,drawNo,throttle}=restrictedItemWeightsV2179(g);

  /* 首选：本组不重复 + 同批次尽量不重复。 */
  let k=weightedPickNoRepeatV281(weights,new Set([...batchUsed,...held]));

  /* 候选耗尽时允许跨组重复，但仍避免本组背包重复。 */
  if(!k) k=weightedPickNoRepeatV281(weights,held);

  /* 极端情况：允许本组重复，但仍只从“受冷却限制后的权重”里选。
     绝不回退到原 itemDropWeights，否则冷却规则会被后门穿透。 */
  if(!k) k=weightedPick(weights);

  if(!k){
    /* 理论上只会在排名规则 + 背包状态极端组合时出现。
       为避免动画卡死，尝试任何不违反冷却的正权重道具。 */
    const fallback={};
    ITEM_KEYS.forEach(key=>{
      if(Number(weights[key])>0) fallback[key]=Number(weights[key]);
    });
    k=Object.keys(fallback).length?weightedPick(fallback):null;
  }

  if(k){
    commitDrawThrottleV2179(g,k,drawNo,throttle);
  }

  return k;
};

/* 百科说明同步冷却规则。 */
if(ITEM_DEFS.lightning){
  ITEM_DEFS.lightning.desc =
    '攻击所有排名高于自己的小组并大幅削减积分；无敌星、巨大蘑菇、害羞幽灵可防御。仅后30%可抽取；全局抽中后需间隔4次其他实际抽取，第5次才可再次出现；场上同时最多存在1个。';
}
if(ITEM_DEFS.blooper){
  ITEM_DEFS.blooper.desc =
    '使全场积分、领奖台与图表暂时被墨汁遮蔽。全局抽中后需间隔4次其他实际抽取，第5次才可再次出现；场上同时最多存在1个。';
}
if(ITEM_DEFS.bullet){
  ITEM_DEFS.bullet.desc =
    '强力追赶道具。若前方至少3组，积分直接提升到前方第3组+1；不足3组时追至第一名+1；已第一则+1。仅后30%可抽取；本组抽中后，下一次抽取不会再出现炮弹刺客、强力蘑菇、巨大蘑菇或无敌星。';
}
if(ITEM_DEFS.power){
  ITEM_DEFS.power.desc =
    '持续5个PK回合；答对时强制提升1名，第一名时不再提升。属于强力道具；本组抽中后，下一次抽取不会再出现炮弹刺客、强力蘑菇、巨大蘑菇或无敌星。';
}
if(ITEM_DEFS.mega){
  ITEM_DEFS.mega.desc =
    '占据主要道具栏，抵挡接下来3次攻击；巨大状态下超越上方小组时可压制并摧毁其主要基础防御道具。仅后30%可抽取；本组抽中后，下一次抽取不会再出现4种强力道具。';
}
if(ITEM_DEFS.star){
  ITEM_DEFS.star.desc =
    '使用后立即释放主要道具栏，无敌状态继续生效并抵挡接下来3次攻击；超越上方小组时可压制并摧毁其主要基础防御道具。仅后30%可抽取；本组抽中后，下一次抽取不会再出现4种强力道具。';
}

/* 给数据页的道具区补一个小状态说明，便于实际使用时判断冷却有没有工作。 */
function installDrawCooldownInfoV2179(){
  const host=document.getElementById('clearAllItemsV2172');
  if(!host || document.getElementById('drawCooldownInfoV2179'))return;

  const t=ensureDrawThrottleV2179();
  const info=document.createElement('div');
  info.id='drawCooldownInfoV2179';
  info.className='v2179-cooldown-note';
  info.innerHTML=`
    <b>抽取冷却规则</b>
    <span>闪电 / 鱿鱿：全局每次抽中后间隔 4 次其他抽取，第 5 次重新开放。</span>
    <span>炮弹刺客 / 强力蘑菇 / 巨大蘑菇 / 无敌星：某组抽中任意一个后，该组下一次抽取屏蔽全部 4 种。</span>
    <small>当前累计实际抽取序号：${t.sequence}</small>
  `;
  host.appendChild(info);
}

if(typeof installClearItemsSettingV2172==='function'){
  const _v2179InstallClearItems=installClearItemsSettingV2172;
  installClearItemsSettingV2172=function(...args){
    const r=_v2179InstallClearItems.apply(this,args);
    installDrawCooldownInfoV2179();
    return r;
  };
}

setTimeout(()=>{try{installDrawCooldownInfoV2179()}catch(e){}},300);
