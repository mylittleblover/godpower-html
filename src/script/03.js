
/* ===== V2.16.0：欢迎页统计与稳定道具演出 ===== */
(function(){
  function renderWelcomeAllV216(){
    try{ renderWelcomePage(); }catch(e){}
    try{ renderChart(); }catch(e){}
    try{ renderDashboard(); }catch(e){}
  }

  /* welcome 切入时确保三个栏目都是最新数据。 */
  if(typeof switchView==='function'){
    const oldSwitchV216=switchView;
    switchView=function(name){
      const r=oldSwitchV216.call(this,name);
      if(name==='welcome') requestAnimationFrame(renderWelcomeAllV216);
      return r;
    };
  }
  if(typeof renderAll==='function'){
    const oldRenderAllV216=renderAll;
    renderAll=function(...args){
      const r=oldRenderAllV216.apply(this,args);
      /* chartWrapper/podiumDeck 已经搬到欢迎页，仍需持续更新。 */
      try{renderWelcomeAllV216()}catch(e){}
      return r;
    };
  }

  /* 最终统一的道具使用演出。
     旧 showItemUseFx 的全屏舞台不再调用，避免超大图标和多个 overlay 叠加。
     卡片发动/真实受击动画继续保留。 */
  showItemUseFx=function(key,casterId=null,targetText=''){
    const d=ITEM_DEFS?.[key];
    if(!d)return;

    document.querySelectorAll('.item-use-banner-v216').forEach(x=>x.remove());

    try{
      if(typeof playSound==='function'){
        playSound('item_use');
        if(typeof itemSoundCategoryV26==='function') setTimeout(()=>playSound(itemSoundCategoryV26(key)),55);
      }
    }catch(e){}

    try{
      if(casterId!=null && typeof playCasterCardFx==='function') playCasterCardFx(key,casterId);
      /* 攻击类真实受击由 V2.11.6 applyItemScore 捕获，避免重复造两个目标动画。
         仅补充非攻击型群体增益和幽灵目标提示。 */
      if(casterId!=null && typeof cardFxTargets==='function'){
        const special=['coin_shell','question','question_block','boo'];
        if(special.includes(key)){
          const heal=['coin_shell','question','question_block'].includes(key);
          cardFxTargets(key,casterId).forEach((id,n)=>setTimeout(()=>{
            try{playTargetCardFx(id,key,heal?'heal':'hit')}catch(e){}
          },100+n*60));
        }
      }
    }catch(e){console.warn('item fx v216',e)}

    const caster=state.groups?.find(g=>g.id===casterId);
    const banner=document.createElement('div');
    banner.className='item-use-banner-v216';
    banner.innerHTML=`<span class="iub-icon">${itemVisual(key)}</span><span style="min-width:0"><div class="iub-main">${caster?escapeHtml(caster.name)+' 使用了 ':''}${escapeHtml(d.name)}</div>${targetText?`<div class="iub-sub">${escapeHtml(targetText)}</div>`:''}</span>`;
    document.body.appendChild(banner);
    const remove=()=>banner.isConnected&&banner.remove();
    banner.addEventListener('animationend',remove,{once:true});
    setTimeout(remove,3800);
  };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(renderWelcomeAllV216,120),{once:true});
  else setTimeout(renderWelcomeAllV216,120);
})();
