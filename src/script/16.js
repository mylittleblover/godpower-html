
/* ===== V2.17.12：课堂快速道具流程 ===== */
const ITEM_DRAW_DURATION_V21712 = 1500;
const ITEM_DRAW_RESULT_HOLD_V21712 = 520;
const ITEM_DRAW_FADE_V21712 = 150;
const ITEM_FX_DURATION_V21712 = 760;

/* 抽取音效与新的 1.5s 抽取动画同步。 */
startDrawSoundBedV2164=function(){
  try{stopActiveDrawAudioV2171()}catch(e){}

  const generation=++drawAudioGenerationV2171;
  const duration=ITEM_DRAW_DURATION_V21712;

  playTrackedDrawSoundV2171('item_draw_start',generation);

  let tickCount=0;
  const tickInterval=110;
  drawTickTimerV2171=setInterval(()=>{
    if(generation!==drawAudioGenerationV2171){
      clearInterval(drawTickTimerV2171);
      drawTickTimerV2171=null;
      return;
    }
    if(tickCount++<11){
      playTrackedDrawSoundV2171('item_draw_tick',generation);
    }else{
      clearInterval(drawTickTimerV2171);
      drawTickTimerV2171=null;
    }
  },tickInterval);

  drawRevealTimerV2171=setTimeout(()=>{
    drawRevealTimerV2171=null;
    finishDrawAudioV2171(generation);
  },duration);
};

/* 全局抽取：
   原流程约 3.6s 滚动 + 3s 定格等待 + 淡出。
   新流程约 1.5s 滚动 + 0.52s 看结果 + 0.15s 淡出。 */
globalItemDraw=function(){
  ensureV2State();
  if(itemDrawBusy)return;

  const eligible=state.groups.filter(
    g=>eligibleForItems(g) && Array.isArray(g.inventory) && g.inventory.length<3
  );
  if(!eligible.length){
    showToast('没有可参与抽取的小组（满背包或负分组会自动跳过）');
    return;
  }

  /* 抽取入口可能先从其他页面切回比赛页；必须在 switchView/renderAll 之前
     就关闭布局 FLIP，否则切页生成的旧坐标仍会让卡片从下向上收紧。 */
  v213SuppressReorderAnimation=true;
  if(!document.getElementById('view-battle')?.classList.contains('active')){
    switchView('battle');
  }

  /* V2.17.10：一次按钮操作只算 1 个全局抽取轮次。 */
  if(typeof beginDrawSessionV21710==='function') beginDrawSessionV21710('global');
  if(typeof DesktopUI!=='undefined')DesktopUI.visualEvent('ITEM_DRAW_START',{scope:'global'});

  try{startDrawSoundBedV2164()}catch(e){}

  recordHistory('全局道具抽取');
  itemDrawBusy=true;
  renderGrid();

  const overlays=new Map();
  const start=performance.now();
  const total=ITEM_DRAW_DURATION_V21712;

  eligible.forEach(g=>{
    const c=document.querySelector(`.group-row-card[data-group-id="${g.id}"]`);
    if(!c)return;
    c.classList.add('item-draw-spinning');

    const o=document.createElement('div');
    o.className='card-item-roulette';
    o.innerHTML='<div class="r-icon">❔</div><div class="r-name">道具抽取中</div><div class="r-hint">ITEM ROULETTE</div>';
    c.appendChild(o);
    overlays.set(g.id,o);
  });

  const lastUpdate=new Map();

  function frame(now){
    const t=Math.min(1,(now-start)/total);

    /* 约 55ms -> 145ms，仍保留“先快后慢”，但不磨课堂时间。 */
    const interval=55 + 90*Math.pow(t,2.1);

    eligible.forEach(g=>{
      const prev=lastUpdate.get(g.id)||0;
      if(now-prev>=interval){
        lastUpdate.set(g.id,now);
        updateCardRouletteVisual(overlays.get(g.id),roulettePreviewPickV282());
      }
    });

    if(t<1){
      requestAnimationFrame(frame);
      return;
    }

    const batchUsed=new Set();
    eligible.forEach(g=>{
      const k=pickItemForGroupV281(g,batchUsed);
      if(k && addItemToGroup(g,k)){
        batchUsed.add(k);
        state.itemGlobal.totalDraws=(state.itemGlobal.totalDraws||0)+1;

        const o=overlays.get(g.id);
        if(o){
          updateCardRouletteVisual(o,k);
          o.classList.add('reveal');
          const hint=o.querySelector('.r-hint');
          if(hint)hint.textContent='获得道具';
        }
      }
    });

    saveState();

    setTimeout(()=>{
      eligible.forEach(g=>{
        const c=document.querySelector(`.group-row-card[data-group-id="${g.id}"]`);
        if(!c)return;

        const o=c.querySelector('.card-item-roulette');
        if(o){
          o.style.transition=`opacity ${ITEM_DRAW_FADE_V21712}ms ease`;
          o.style.opacity='0';
          o.style.removeProperty('transform');
        }

        setTimeout(()=>{
          c.classList.remove('item-draw-spinning');
          c.querySelector('.card-item-roulette')?.remove();
        },ITEM_DRAW_FADE_V21712+20);
      });

      setTimeout(()=>{
        itemDrawBusy=false;
        v213SkipNextReorderAnimation=true;
        renderAll();
        v213SuppressReorderAnimation=false;
      },ITEM_DRAW_FADE_V21712+35);
    },ITEM_DRAW_RESULT_HOLD_V21712);
  }

  requestAnimationFrame(frame);
};

/* 举手奖励抽取同样压缩到 1.5s。 */
handDrawItem=function(){
  ensureV2State();
  const g=state.groups.find(x=>x.id===handRaiseGroupId);
  if(!g)return;
  if(!eligibleForItems(g)){showToast('负分状态禁止获得任何道具');return}
  if(g.inventory.length>=3){showToast('该组的三个道具槽都已占用');return}
  if(handItemDrawTimer)return;

  if(typeof beginDrawSessionV21710==='function') beginDrawSessionV21710('hand');
  if(typeof DesktopUI!=='undefined')DesktopUI.visualEvent('ITEM_DRAW_START',{groupId:handRaiseGroupId,scope:'hand'});
  try{startDrawSoundBedV2164()}catch(e){}

  handItemDrawGroupId=g.id;
  handItemPendingKey=null;
  handItemDrawStartedAt=performance.now();

  const box=document.getElementById('handRewardBox');
  box.innerHTML=`<div class="hand-item-draw-stage v281-horizontal">
    <div class="hand-draw-head" style="font-weight:950;color:#0369a1">${escapeHtml(g.name)} · 道具抽取</div>
    <div id="handItemCapsule" class="hand-item-capsule spinning">❔</div>
    <div class="hand-draw-copy">
      <div id="handItemDrawName" class="hand-item-draw-name">道具滚动中…</div>
      <div class="hand-item-draw-sub">预览全部道具 · 最终结果按当前排名权重计算</div>
    </div>
    <div class="hand-item-progress"><div id="handItemProgressBar"></div></div>
  </div>`;

  let last=0;
  const total=ITEM_DRAW_DURATION_V21712;
  handItemDrawTimer={raf:true};

  function frame(now){
    if(!handItemDrawTimer)return;

    const t=Math.min(1,(now-handItemDrawStartedAt)/total);
    const interval=55+90*Math.pow(t,2.1);

    const bar=document.getElementById('handItemProgressBar');
    if(bar)bar.style.width=(t*100)+'%';

    if(now-last>=interval){
      last=now;
      const live=state.groups.find(x=>x.id===handItemDrawGroupId);
      if(!live)return;

      const k=roulettePreviewPickV282();
      const cap=document.getElementById('handItemCapsule');
      const name=document.getElementById('handItemDrawName');

      if(cap){
        cap.innerHTML=itemVisual(k);
        cap.animate(
          [{opacity:.45,transform:'scale(.84)'},{opacity:1,transform:'scale(1)'}],
          {duration:70,easing:'cubic-bezier(.2,.8,.3,1)'}
        );
      }
      if(name)name.textContent=ITEM_DEFS[k].name;
    }

    if(t<1){
      requestAnimationFrame(frame);
      return;
    }

    handItemDrawTimer=null;

    const live=state.groups.find(x=>x.id===handItemDrawGroupId);
    if(!live || !eligibleForItems(live) || live.inventory.length>=3){
      cancelHandItemDraw(true);
      showToast('抽取结束前该组已不满足获得条件');
      renderHandRaise();
      return;
    }

    const k=pickItemForGroupV281(live,new Set());
    handItemPendingKey=k;

    recordHistory(`${live.name} 举手奖励抽取 ${ITEM_DEFS[k].name}`);

    if(!addItemToGroup(live,k)){
      cancelHandItemDraw(true);
      showToast('道具加入失败');
      renderHandRaise();
      return;
    }

    state.itemGlobal.totalDraws=(state.itemGlobal.totalDraws||0)+1;
    saveState();
    v213SkipNextReorderAnimation=true;
    v213SuppressReorderAnimation=true;
    renderAll();
    v213SuppressReorderAnimation=false;

    const slot=live.inventory.length-1;
    box.innerHTML=`<div class="hand-item-draw-stage v281-horizontal">
      <div class="hand-draw-head" style="font-weight:950;color:#16a34a">🎁 获得道具</div>
      <div class="hand-item-capsule reveal">${itemVisual(k)}</div>
      <div class="hand-draw-copy">
        <div class="hand-item-draw-name">${ITEM_DEFS[k].name}</div>
        <div class="hand-item-draw-sub">已放入 ${escapeHtml(live.name)} 的${slot===0?'主要道具栏':'次要道具栏 '+slot}</div>
      </div>
      <div class="hand-item-result-actions">
        <button class="btn btn-primary" onclick="handUseNewItem()">🎒 查看道具</button>
        <button class="btn btn-success" onclick="finishHandItemReward()">✓ 完成</button>
      </div>
    </div>`;
  }

  requestAnimationFrame(frame);
};

/* 使用者卡片特效快速收束。 */
playCasterCardFx=function(key,gid){
  if(typeof DesktopUI!=='undefined'&&(!DesktopUI.getPreferences().itemFx||DesktopUI.getPreferences().motion==='off'))return;
  const card=battleCard(gid),d=ITEM_DEFS[key];
  if(!card||!d)return;

  clearCardFx(card);
  void card.offsetWidth;

  card.classList.add('card-use-fx',CARD_ITEM_FX_CLASS[key]||'cfx-rise');

  const b=document.createElement('div');
  b.className='card-fx-badge';
  b.innerHTML=`<span class="cfi">${itemVisual(key)}</span><span>${escapeHtml(d.name)}</span>`;
  card.appendChild(b);

  setTimeout(()=>{
    card.classList.remove('card-use-fx',CARD_ITEM_FX_CLASS[key]||'cfx-rise');
    b.remove();
  },ITEM_FX_DURATION_V21712);
};

/* 普通目标命中 / 防御 / 治疗快速收束。 */
playTargetCardFx=function(id,key,type='hit'){
  if(typeof DesktopUI!=='undefined'){DesktopUI.visualEvent(type==='defend'?'ITEM_DEFENDED':'ITEM_HIT',{groupId:id,key});if(!DesktopUI.getPreferences().itemFx||DesktopUI.getPreferences().motion==='off')return;}
  const card=battleCard(id);
  if(!card)return;

  card.classList.remove('card-hit-fx','card-defend-fx','card-heal-fx');
  void card.offsetWidth;

  card.style.setProperty(
    '--hitc',
    type==='defend'?'#38bdf8':
    type==='heal'?'#22c55e':
    (CARD_HIT_COLOR[key]||'#ef4444')
  );

  card.classList.add(
    type==='defend'?'card-defend-fx':
    type==='heal'?'card-heal-fx':
    'card-hit-fx'
  );

  setTimeout(()=>{
    card.classList.remove('card-hit-fx','card-defend-fx','card-heal-fx');
    card.style.removeProperty('--hitc');
  },700);
};

/* V2.11.6 的实际受击反馈也同步加速。 */
playAttackTargetFxV2116=function(groupId,key,defended=false){
  if(typeof DesktopUI!=='undefined'){DesktopUI.visualEvent(defended?'ITEM_DEFENDED':'ITEM_HIT',{groupId,key});if(!DesktopUI.getPreferences().itemFx||DesktopUI.getPreferences().motion==='off')return;}
  const card=battleCard(groupId);
  if(!card)return;

  clearAttackHitFxV2116(card);
  void card.offsetWidth;

  const cls=attackHitClassV2116(key);
  card.classList.add(cls);
  card.style.setProperty('--hitc',CARD_HIT_COLOR[key]||'#ef4444');

  if(defended)card.classList.add('card-defend-fx');

  const badge=document.createElement('div');
  badge.className='attack-hit-badge-v2116';
  const d=ITEM_DEFS[key];
  badge.innerHTML=`<span>${itemVisual(key)}</span><b>${defended?'已防御':'受到 '+(d?.name||'攻击')}</b>`;
  card.appendChild(badge);

  setTimeout(()=>{
    card.classList.remove(cls,'card-defend-fx');
    badge.remove();
    card.style.removeProperty('--hitc');
  },740);
};
