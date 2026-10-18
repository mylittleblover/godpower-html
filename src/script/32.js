
/* ===== V2.17.31：小组信息状态 undefined 修复 ===== */
function normalizeItemEffectForStatusV21731(g){
  if(!g || !g.itemEffect || typeof g.itemEffect!=='object')return;

  const ef=g.itemEffect;

  /* 非法/空 type 不再参与状态名显示。 */
  if(ef.type!=null && !ITEM_DEFS[ef.type]){
    delete ef.type;
  }

  /* 清理已经归零的临时字段。 */
  if(Number(ef.featherDodge||0)<=0) delete ef.featherDodge;
  if(Number(ef.iceLock||0)<=0) delete ef.iceLock;

  if(ef.hitsLeft!=null && Number(ef.hitsLeft)<=0) delete ef.hitsLeft;
  if(ef.roundsLeft!=null && Number(ef.roundsLeft)<=0) delete ef.roundsLeft;

  /* 如果没有任何有效状态字段，就彻底还原为 null。 */
  if(Object.keys(ef).length===0){
    g.itemEffect=null;
  }
}

function repairAllItemEffectsV21731(){
  let changed=false;
  state.groups.forEach(g=>{
    const before=JSON.stringify(g.itemEffect??null);
    normalizeItemEffectForStatusV21731(g);
    const after=JSON.stringify(g.itemEffect??null);
    if(before!==after)changed=true;
  });
  if(changed){
    try{saveState()}catch(e){}
  }
}

const _v21731EnsureItemState=ensureItemState;
ensureItemState=function(...args){
  const result=_v21731EnsureItemState.apply(this,args);
  try{repairAllItemEffectsV21731()}catch(e){}
  return result;
};

window.addEventListener('DOMContentLoaded',()=>{
  setTimeout(()=>{
    try{
      repairAllItemEffectsV21731();
      renderAll();
    }catch(e){}
  },100);
});
