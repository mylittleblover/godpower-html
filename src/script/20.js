
/* ===== V2.17.17：刺龟壳 3 个抽取轮次冷却 =====
   规则：某个抽取轮次抽中刺龟壳后，
   接下来 3 个抽取轮次不再出现刺龟壳，
   到第 4 个后续抽取轮次重新开放。
   例如第 10 轮抽中 -> 第 11/12/13 轮禁用 -> 第 14 轮恢复。 */

function ensureSpinyCooldownV21717(){
  const t=ensureDrawSessionThrottleV21710();
  if(!Number.isFinite(Number(t.nextEligibleSession.spiny))){
    t.nextEligibleSession.spiny=0;
  }
  t.nextEligibleSession.spiny=Math.max(
    0,
    Math.floor(Number(t.nextEligibleSession.spiny)||0)
  );
  return t;
}

/* 在最终权重生成阶段加入刺龟壳冷却。 */
const _v21717SessionRestrictedWeights=sessionRestrictedWeightsV21710;
sessionRestrictedWeightsV21710=function(g){
  const W=_v21717SessionRestrictedWeights.call(this,g);
  const t=ensureSpinyCooldownV21717();
  const sessionNo=activeDrawSessionV21710?.no || t.sessionNo;
  const next=Math.max(0,Number(t.nextEligibleSession.spiny)||0);

  if(sessionNo<next){
    W.spiny=0;
  }
  return W;
};

/* 抽中刺龟壳后写入冷却。
   +4 的含义是：完整跳过后续 3 轮。 */
const _v21717CommitSessionDraw=commitSessionDrawV21710;
commitSessionDrawV21710=function(g,key){
  _v21717CommitSessionDraw.call(this,g,key);

  if(key==='spiny'){
    const t=ensureSpinyCooldownV21717();
    const sessionNo=activeDrawSessionV21710?.no || t.sessionNo;
    t.nextEligibleSession.spiny=sessionNo+4;
  }
};

/* 数据与管理页的冷却状态说明同步增加刺龟壳。 */
const _v21717RefreshCooldownInfo=refreshDrawCooldownInfoV21710;
refreshDrawCooldownInfoV21710=function(){
  _v21717RefreshCooldownInfo.call(this);

  const host=document.getElementById('drawCooldownInfoV2179');
  if(!host)return;

  const t=ensureSpinyCooldownV21717();
  const next=Number(t.nextEligibleSession.spiny||0);
  const text=(!next || t.sessionNo>=next)
    ? '刺龟壳：当前可抽取'
    : `刺龟壳：第 ${next} 个抽取轮次重新开放（当前第 ${t.sessionNo} 轮）`;

  const extra=document.createElement('small');
  extra.id='spinyCooldownLineV21717';
  extra.textContent=text;
  host.appendChild(extra);
};

/* 道具百科仍只显示功能效果，不写抽取规则；这里只改实际逻辑和管理页。 */
setTimeout(()=>{
  try{refreshDrawCooldownInfoV21710()}catch(e){}
},350);
