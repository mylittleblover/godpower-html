
/* ===== V2.18.0：手写方案完整实现 ===== */

/* ---------- 0. 通用学生学号解析 ---------- */
function parseStudentV218(raw){
  const text=String(raw??'').trim();
  /* 允许：12 张三 / 12-张三 / 12_张三 / 12张三 */
  const m=text.match(/^(\d{1,4})\s*[-_—–:：.]?\s*(.*)$/);
  if(!m)return {number:null,name:text,raw:text};
  return {number:Number(m[1]),numberText:m[1],name:(m[2]||'').trim()||text,raw:text};
}
function studentLabelHTMLV218(raw,g){
  const p=parseStudentV218(raw);
  if(p.number==null)return `<span class="student-name-v218">${escapeHtml(p.name)}</span>`;
  return `<span class="student-no-inline-v218" style="color:${g?.color||'#0f766e'}">${escapeHtml(p.numberText)}</span><span class="student-name-v218">${escapeHtml(p.name)}</span>`;
}
function pinyinInitialV218(raw){
  const name=parseStudentV218(raw).name.trim();
  if(!name)return '#';
  const ch=name[0];
  if(/[A-Za-z]/.test(ch))return ch.toUpperCase();
  if(/\d/.test(ch))return '#';
  const bounds=[
    ['A','阿'],['B','芭'],['C','擦'],['D','搭'],['E','蛾'],['F','发'],
    ['G','噶'],['H','哈'],['J','击'],['K','喀'],['L','垃'],['M','妈'],
    ['N','拿'],['O','哦'],['P','啪'],['Q','期'],['R','然'],['S','撒'],
    ['T','塌'],['W','挖'],['X','昔'],['Y','压'],['Z','匝']
  ];
  try{
    let result='A';
    for(const [letter,bound] of bounds){
      if(ch.localeCompare(bound,'zh-CN-u-co-pinyin')>=0)result=letter;
      else break;
    }
    return result;
  }catch(e){return '#'}
}

/* ---------- 1. 鱿鱿：榜单预览也遮蔽 ---------- */
if(ITEM_DEFS.blooper){
  ITEM_DEFS.blooper.name='鱿鱿';
  ITEM_DEFS.blooper.desc='全场比分遮蔽 2 分钟，积分、领奖台、图表与比赛页顶部排名预览均显示为 ???。';
}
const _v218RenderBattleRankPreview=renderBattleRankPreviewV21721;
renderBattleRankPreviewV21721=function(){
  const r=_v218RenderBattleRankPreview.apply(this,arguments);
  const active=Number(state.itemGlobal?.blooperUntil||0)>Date.now();
  if(active){
    document.querySelectorAll('#battleRankPreviewGridV21721 .battle-rank-score-v21721')
      .forEach(el=>el.textContent='???');
  }
  return r;
};

/* ---------- 2. 成员搜索优化：姓名 / 学号都可直接搜 ---------- */
searchMemberGroups=function(){
  const input=document.getElementById('memberSearchInput');
  const results=document.getElementById('memberSearchResults');
  if(!input||!results)return;
  const q=input.value.trim().toLowerCase();
  if(!q){results.innerHTML='<div class="member-search-empty">请输入姓名或学号开始查询</div>';return}

  const matches=[];
  state.groups.forEach(g=>(g.members||[]).forEach(member=>{
    const p=parseStudentV218(member);
    const numberHit=p.number!=null && String(p.number).includes(q.replace(/\D/g,''));
    const nameHit=p.name.toLowerCase().includes(q) || String(member).toLowerCase().includes(q);
    if(nameHit || (/\d/.test(q)&&numberHit))matches.push({member,p,group:g});
  }));

  if(!matches.length){
    results.innerHTML=`<div class="member-search-empty">没有找到“${escapeHtml(input.value.trim())}”</div>`;
    return;
  }
  results.innerHTML=matches.map(({member,p,group:g})=>`
    <div class="member-search-result">
      <div class="member-search-result-name">${studentLabelHTMLV218(member,g)}</div>
      <div class="member-search-result-group" style="color:${g.color}">${escapeHtml(g.name)}</div>
    </div>`).join('');
};
const memberSearchInputV218=document.getElementById('memberSearchInput');
if(memberSearchInputV218)memberSearchInputV218.placeholder='输入姓名或学号';

/* 随机点名右侧即时赋分也显示彩色学号。 */
if(typeof syncPickerScoreTarget==='function'){
  syncPickerScoreTarget=function(){
    const el=document.getElementById('pickerScoreTarget'),w=slotEngine.chosenResult;
    if(!el)return;
    if(typeof DesktopUI!=='undefined')DesktopUI.pickerChanged();
    if(!w){el.textContent='抽中学生或小组后，可直接给所属小组赋分。';return}
    const g=state.picker.mode==='group'?w:w.group;
    el.innerHTML=`<b style="color:${g.color}">${escapeHtml(g.name)}</b>${state.picker.mode==='group'?'':`<br>${studentLabelHTMLV218(w.memberName,g)}`}<br>当前 ${g.score} 分`;
  };
}

/* ---------- 3. 🤑 快速按人加分 ---------- */
const qpStateV218={selected:new Set(),bands:new Set(),groups:new Set(),letters:new Set()};
function allStudentsV218(){
  const out=[];
  state.groups.forEach(g=>(g.members||[]).forEach((member,index)=>{
    const p=parseStudentV218(member);
    out.push({key:`${g.id}__${index}__${member}`,group:g,member,p,initial:pinyinInitialV218(member)});
  }));
  return out;
}
function numberBandV218(n){
  if(!Number.isFinite(n))return null;
  if(n<=9)return '1-9';
  const start=Math.floor(n/10)*10;
  return `${start}-${start+9}`;
}
function openQuickPersonScoreV218(){
  qpStateV218.selected.clear();qpStateV218.bands.clear();qpStateV218.groups.clear();qpStateV218.letters.clear();
  const q=document.getElementById('qpSearchV218');if(q)q.value='';
  renderQuickPersonFiltersV218();renderQuickPersonListV218();
  document.getElementById('quickPersonBackdropV218')?.classList.add('active');
}
function closeQuickPersonScoreV218(){document.getElementById('quickPersonBackdropV218')?.classList.remove('active')}
function toggleQPSetV218(type,val){
  const set=qpStateV218[type];
  set.has(val)?set.delete(val):set.add(val);
  renderQuickPersonFiltersV218();renderQuickPersonListV218();
}
function renderQuickPersonFiltersV218(){
  const students=allStudentsV218();
  const bands=[...new Set(students.map(s=>numberBandV218(s.p.number)).filter(Boolean))]
    .sort((a,b)=>parseInt(a)-parseInt(b));
  const bandBox=document.getElementById('qpNumberBandsV218');
  if(bandBox)bandBox.innerHTML=bands.map(x=>`<button class="qp-chip-v218 ${qpStateV218.bands.has(x)?'active':''}" onclick="toggleQPSetV218('bands','${x}')">${x}</button>`).join(' ')||'<span style="font-size:11px;color:#94a3b8">名单未识别到学号</span>';

  const gb=document.getElementById('qpGroupFiltersV218');
  if(gb)gb.innerHTML=state.groups.map(g=>`<button class="qp-chip-v218 ${qpStateV218.groups.has(g.id)?'active':''}" style="${qpStateV218.groups.has(g.id)?`background:${g.color};border-color:${g.color}`:''}" onclick="toggleQPSetV218('groups',${g.id})">${escapeHtml(g.name)}</button>`).join(' ');

  const letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const lb=document.getElementById('qpLetterFiltersV218');
  if(lb)lb.innerHTML=letters.map(x=>`<button class="qp-chip-v218 qp-letter-v218 ${qpStateV218.letters.has(x)?'active':''}" onclick="toggleQPSetV218('letters','${x}')">${x}</button>`).join('');
}
function filteredStudentsV218(){
  const q=(document.getElementById('qpSearchV218')?.value||'').trim().toLowerCase();
  return allStudentsV218().filter(s=>{
    if(q){
      const qNum=q.replace(/\D/g,'');
      const hitName=s.p.name.toLowerCase().includes(q)||String(s.member).toLowerCase().includes(q);
      const hitNum=qNum && s.p.number!=null && String(s.p.number).includes(qNum);
      if(!hitName&&!hitNum)return false;
    }
    if(qpStateV218.bands.size && !qpStateV218.bands.has(numberBandV218(s.p.number)))return false;
    if(qpStateV218.groups.size && !qpStateV218.groups.has(s.group.id))return false;
    if(qpStateV218.letters.size && !qpStateV218.letters.has(s.initial))return false;
    return true;
  });
}
function renderQuickPersonListV218(){
  const box=document.getElementById('quickPersonListV218');if(!box)return;
  const list=filteredStudentsV218();
  box.innerHTML=list.length?list.map(s=>`
    <button class="quick-person-entry-v218 ${qpStateV218.selected.has(s.key)?'selected':''}" onclick="toggleQuickPersonV218('${escapeHtml(s.key).replace(/'/g,"&#39;")}')">
      ${s.p.number!=null?`<span class="student-no-v218" style="background:${s.group.color}">${escapeHtml(s.p.numberText)}</span>`:'<span class="student-no-v218" style="background:#94a3b8">—</span>'}
      <span class="student-name-v218">${escapeHtml(s.p.name)}</span>
      <span class="qp-group-v218">${escapeHtml(s.group.name)}</span>
    </button>`).join(''):'<div class="member-search-empty">当前筛选条件下没有学生</div>';
  const c=document.getElementById('qpSelectedCountV218');
  if(c)c.textContent=`已选择 ${qpStateV218.selected.size} 人`;
}
function toggleQuickPersonV218(key){
  qpStateV218.selected.has(key)?qpStateV218.selected.delete(key):qpStateV218.selected.add(key);
  renderQuickPersonListV218();
}
function applyQuickPersonScoreV218(points){
  if(state.isLocked){openPwdModal();return false}
  points=Number(points);
  if(!Number.isSafeInteger(points)||points===0){showToast('请输入非零整数分值');return false}
  const selected=allStudentsV218().filter(s=>qpStateV218.selected.has(s.key));
  if(!selected.length){showToast('请先选择学生');return false}
  const counts=new Map();
  selected.forEach(s=>counts.set(s.group.id,(counts.get(s.group.id)||0)+1));
  let updates;
  try{updates=Reliability.planBatchScoreChanges(state.groups,[...counts],points)}
  catch(error){showToast(error.message);return false}
  const description='快速按人加分：'+selected.length+' 人 · '+updates.map(u=>{
    const name=state.groups.find(g=>g.id===u.id)?.name||'小组';
    return name+' '+(u.delta>=0?'+':'')+u.delta;
  }).join('，');
  cancelScoreAnimationAndSync();
  const ok=runClassroomCommand(description,()=>{
    for(const u of updates)state.groups.find(g=>g.id===u.id).score=u.score;
    return true;
  });
  if(!ok)return false;
  animateScores(updates.map(u=>({groupId:u.id,start:u.old,target:u.score})));
  playSound(points>0?'score_add':'score_sub');
  showToast('已为 '+selected.length+' 名学生完成加分');
  return true;
}
function applyQuickPersonCustomV218(){
  const v=Number(document.getElementById('qpCustomScoreV218')?.value);
  if(!Number.isFinite(v)||v===0){showToast('请输入有效的自定义分值');return}
  applyQuickPersonScoreV218(v);
}
/* 插入底栏按钮 */
(function(){
  const right=document.querySelector('.bottom-dock .dock-right');
  if(right&&!document.getElementById('quickPersonBtnV218')){
    const b=document.createElement('button');
    b.id='quickPersonBtnV218';b.className='icon-btn';b.title='快速按人加分';b.textContent='🤑';
    b.onclick=openQuickPersonScoreV218;
    const hand=[...right.querySelectorAll('button')].find(x=>x.getAttribute('onclick')?.includes('openHandRaise'));
    right.insertBefore(b,hand||right.firstChild);
  }
})();

/* ---------- 4. 道具定义 / 平衡性 ---------- */
Object.assign(ITEM_DEFS,{
  blooper:{...ITEM_DEFS.blooper,name:'鱿鱿'},
  power:{...ITEM_DEFS.power,desc:'持续 3 次答题；每次答题都会消耗 1 次，答对时强制向前提升 1 名，答错则不发动效果。'},
  fire_flower:{...ITEM_DEFS.fire_flower,desc:'3 发火球；每次随机命中一个其他小组并扣除当前积分的 1/5。'},
  ice_flower:{...ITEM_DEFS.ice_flower,desc:'3 发冰球；每次随机命中一个其他小组并扣除当前积分的 1/5，同时冻结其主动道具。使用道具会强制解除；若一直不用，3 次答题后自动解除。'},
  boomerang_flower:{...ITEM_DEFS.boomerang_flower,desc:'3 次回旋镖；每次攻击当前排名紧邻自己的上一组和下一组，各扣当前积分的 1/5。'}
});

/* 火 / 冰 / 回旋镖最终行为直接在最外层接管，避免旧版 1/8 / 1/10 残留。 */
const _v218UseItemBalance=legacyUseItem;
const TRIPLE_KEYS_V218=new Set(['triple_green','triple_red','triple_banana','triple_mushroom']);
function consumeOneV218(g,index){
  const it=g.inventory?.[index];if(!it)return;
  it.charges=Math.max(0,(Number(it.charges)||1)-1);
  if(it.charges<=0)g.inventory.splice(index,1);
}
function attackOneFifthV218(caster,target,key){
  const amount=Math.round(Math.max(0,Number(target.score)||0)/5);
  if(amount<=0)return {changed:false};
  return applyItemScore(target,-amount,caster.id,key);
}
function finishOwnItemUseV218(g,key,index,targetText){
  g.itemStats=g.itemStats||{};g.itemStats.used=(Number(g.itemStats.used)||0)+1;
  recordHistory(`${g.name} 使用道具：${ITEM_DEFS[key].name}`);
  saveState();renderAll();showItemUseFx(key,g.id,targetText);showToast(`${g.name} 使用了 ${ITEM_DEFS[key].name}`);
  return true;
}

legacyUseItem=function(groupId,index,...rest){
  const g=state.groups.find(x=>x.id===groupId);
  let it=g?.inventory?.[index],key=it?.key;
  if(!g||!it)return _v218UseItemBalance.call(this,groupId,index,...rest);

  /* 答题中同一个三重道具可继续使用剩余次数；All In 仍保持锁定。 */
  const continuing=!!(
    state.roundActive&&!state.evaluated &&
    g.itemUsedThisRound &&
    g.roundItemContinuationKeyV218===key &&
    TRIPLE_KEYS_V218.has(key)
  );
  if(continuing)g.itemUsedThisRound=false;

  /* 红龟壳：没有上方排名时仍消耗，但不产生效果。 */
  if((key==='red'||key==='triple_red')){
    const r=ranking(),ri=r.findIndex(x=>x.id===g.id),above=r[ri-1];
    if(!above){
      consumeOneV218(g,index);
      finishOwnItemUseV218(g,key,index,'当前没有上方排名 · 道具已消耗');
      if(TRIPLE_KEYS_V218.has(key)&&g.inventory?.[index]?.key===key)g.roundItemContinuationKeyV218=key;
      else delete g.roundItemContinuationKeyV218;
      return true;
    }
  }

  /* 锤子：只从排名高于自己的组中随机抽最多 3 组。 */
  if(key==='hammer'){
    const r=ranking(),ri=r.findIndex(x=>x.id===g.id);
    const pool=r.slice(0,ri).filter(eligibleForItems).sort(()=>Math.random()-.5).slice(0,3);
    if(!pool.length){showToast('当前没有排名高于自己的可攻击小组');return false}
    pool.forEach(t=>damageFraction(t,4,g.id,'hammer'));
    consumeOneV218(g,index);
    return finishOwnItemUseV218(g,key,index,`目标：${pool.map(x=>x.name).join('、')}`);
  }

  /* 害羞幽灵：无上方排名 / 上方无道具 -> 自动获得一个蘑菇。 */
  if(key==='boo'){
    const r=ranking(),ri=r.findIndex(x=>x.id===g.id),above=r[ri-1];
    if(!above || !above.inventory?.length){
      consumeOneV218(g,index);
      if(!g.inventory.some(x=>x.key==='mushroom') && g.inventory.length<3){
        g.inventory.push({key:'mushroom',charges:1,acquiredAt:Date.now()+Math.random()});
      }
      g.booShield=1;g.booRoundsLeftV218=3;
      return finishOwnItemUseV218(g,key,index,!above?'没有上方排名 · 自动获得蘑菇':'上方无道具 · 自动获得蘑菇');
    }
  }

  /* 三种花：统一 -1/5。 */
  if(key==='fire_flower'||key==='ice_flower'){
    const pool=state.groups.filter(x=>x.id!==g.id&&eligibleForItems(x));
    if(!pool.length){showToast('没有可攻击的小组');return false}
    const t=pool[Math.floor(Math.random()*pool.length)];
    const result=attackOneFifthV218(g,t,key);
    if(key==='ice_flower'&&!result?.blocked){
      t.itemEffect={...(t.itemEffect||{}),iceLock:1,iceRoundsLeftV218:3};
    }
    consumeOneV218(g,index);
    return finishOwnItemUseV218(g,key,index,
      result?.blocked?`目标：${t.name} · 攻击被防御`:`目标：${t.name} · -1/5${key==='ice_flower'?' 并冻结':''}`);
  }
  if(key==='boomerang_flower'){
    const r=ranking(),ri=r.findIndex(x=>x.id===g.id);
    const targets=[r[ri-1],r[ri+1]].filter(x=>x&&eligibleForItems(x));
    if(!targets.length){showToast('当前没有可命中的相邻小组');return false}
    targets.forEach(t=>attackOneFifthV218(g,t,key));
    consumeOneV218(g,index);
    return finishOwnItemUseV218(g,key,index,`目标：${targets.map(x=>x.name).join('、')} · 各 -1/5`);
  }

  const beforeKey=key;
  const result=_v218UseItemBalance.call(this,groupId,index,...rest);

  /* 强力蘑菇从 5 改为 3 次答题。 */
  if(result!==false && beforeKey==='power' && g.itemEffect?.type==='power'){
    g.itemEffect.roundsLeft=3;
  }
  /* 幽灵从“1次防御”改成“3次答题内无限防御”。 */
  if(result!==false && beforeKey==='boo'){
    g.booShield=1;g.booRoundsLeftV218=3;
  }

  /* 三重道具第一次用后，剩余次数允许本题继续使用。 */
  if(result!==false && TRIPLE_KEYS_V218.has(beforeKey)){
    const still=g.inventory?.[0]?.key===beforeKey && Number(g.inventory[0].charges)>0;
    if(still)g.roundItemContinuationKeyV218=beforeKey;
    else delete g.roundItemContinuationKeyV218;
    g.itemUsedThisRound=true;
  }else if(continuing){
    g.itemUsedThisRound=true;
  }

  saveState();
  return result;
};

/* 道具窗口状态：同一个三重道具在本题剩余次数仍可继续点。 */
if(typeof queueUseStateV2120==='function'){
  const _v218QueueState=queueUseStateV2120;
  queueUseStateV2120=function(g,index){
    if(index===0 && state.roundActive&&!state.evaluated && g?.itemUsedThisRound &&
       TRIPLE_KEYS_V218.has(g.inventory?.[0]?.key) &&
       g.roundItemContinuationKeyV218===g.inventory?.[0]?.key){
      return {usable:true,label:`继续使用（剩余 ${g.inventory[0].charges}）`};
    }
    return _v218QueueState.call(this,g,index);
  };
}

/* 幽灵 3 题内无限防御，不因攻击消耗。 */



/* 超级喇叭防刺龟壳改为确认弹窗，机制参考蘑菇。 */



/* ---------- 5. 答题次数型状态 ---------- */
const _v218JudgeRound=legacyJudgeRound;
legacyJudgeRound=function(...args){
  if(!state.roundActive||state.evaluated||!state.correctAns)return false;
  const wasActive=state.roundActive&&!state.evaluated;
  const answeredBefore=new Map(state.groups.map(g=>[g.id,!!g.selectedOpt]));
  const result=_v218JudgeRound.apply(this,args);
  if(!wasActive)return result;

  state.groups.forEach(g=>{
    /* 冰冻：若不主动用道具，经历 3 次实际答题后自动解除。 */
    if(g.itemEffect?.iceLock && answeredBefore.get(g.id)){
      let left=Number(g.itemEffect.iceRoundsLeftV218||3)-1;
      g.itemEffect.iceRoundsLeftV218=left;
      if(left<=0){
        delete g.itemEffect.iceLock;delete g.itemEffect.iceRoundsLeftV218;
        if(Object.keys(g.itemEffect).length===0)g.itemEffect=null;
        showToast(`${g.name} 的冰冻状态已自然解除`);
      }
    }
    /* 害羞幽灵：持续 3 次答题，攻击不会消耗。 */
    if(Number(g.booRoundsLeftV218||0)>0 && answeredBefore.get(g.id)){
      g.booRoundsLeftV218=Math.max(0,Number(g.booRoundsLeftV218)-1);
      if(g.booRoundsLeftV218<=0){
        g.booShield=0;delete g.booRoundsLeftV218;
      }
    }
    delete g.roundItemContinuationKeyV218;
  });
  saveState();renderAll();
  return result;
};

/* 冰冻被主动使用触发时：立即解除，并继续沿用“本次使用被取消”的既有规则。 */
const _v218UseItemIceCleanup=legacyUseItem;
legacyUseItem=function(groupId,index,...rest){
  const g=state.groups.find(x=>x.id===groupId);
  const frozen=!!g?.itemEffect?.iceLock;
  const r=_v218UseItemIceCleanup.call(this,groupId,index,...rest);
  if(frozen && g?.itemEffect){
    delete g.itemEffect.iceRoundsLeftV218;
    if(Object.keys(g.itemEffect).length===0)g.itemEffect=null;
  }
  return r;
};

/* ---------- 6. 道具抽取：喇叭前 60%，第一名精确 10%；首次举手等概率池 ---------- */
const FIRST_HAND_POOL_V218=[
  'triple_mushroom','mushroom','triple_green','green',
  'triple_red','red','banana','triple_banana','horn'
];
let firstHandDrawPendingV218=true;
let suppressFirstHornV218=false;

const _v218ItemDropWeights=itemDropWeights;
itemDropWeights=function(pos,total){
  const W=_v218ItemDropWeights.call(this,pos,total);
  const cutoff=Math.max(1,Math.ceil(Math.max(1,total)*0.60));
  if(pos<=cutoff){
    W.horn=Math.max(Number(W.horn)||0,8);
  }else{
    W.horn=0;
  }
  if(pos===1 && suppressFirstHornV218)W.horn=0;
  return W;
};

const _v218PickItem=pickItemForGroupV281;
pickItemForGroupV281=function(g,batchUsed=new Set()){
  const inHand=handItemDrawGroupId===g?.id;

  /* 每次页面/课堂会话第一次手动举手抽取：九种道具等概率，仍禁止本组重复。 */
  if(inHand && firstHandDrawPendingV218){
    const held=new Set((g.inventory||[]).map(x=>x.key));
    const pool=FIRST_HAND_POOL_V218.filter(k=>ITEM_DEFS[k]&&!held.has(k));
    firstHandDrawPendingV218=false;
    if(pool.length){
      const k=pool[Math.floor(Math.random()*pool.length)];
      try{commitSessionDrawV21710(g,k)}catch(e){}
      return k;
    }
  }

  const pos=rankIndex(g.id)+1,total=state.groups.length;
  if(pos===1){
    /* 第一名超级喇叭最终概率精确 10%；未抽中时本次排除喇叭，避免叠加旧权重。 */
    const held=new Set((g.inventory||[]).map(x=>x.key));
    if(!held.has('horn') && Math.random()<0.10){
      try{commitSessionDrawV21710(g,'horn')}catch(e){}
      return 'horn';
    }
    suppressFirstHornV218=true;
    try{return _v218PickItem.call(this,g,batchUsed)}
    finally{suppressFirstHornV218=false}
  }
  return _v218PickItem.call(this,g,batchUsed);
};

/* ---------- 7. 手动举手：不关闭菜单；三重可单发 / 连发；中央效果结算 ---------- */
let handEffectSuppressV218=false;
function scoreSnapshotV218(){return new Map(state.groups.map(g=>[g.id,Number(g.score)||0]))}
function showHandEffectV218(key,before,note=''){
  const box=document.getElementById('handEffectCardV218'),overlay=document.getElementById('handEffectOverlayV218');
  if(!box||!overlay)return;
  const lines=[];
  state.groups.forEach(g=>{
    const old=before.get(g.id);if(old==null)return;
    const now=Number(g.score)||0,delta=now-old;
    if(delta)lines.push(`<div class="hand-effect-line-v218 ${delta>0?'pos':'neg'}">${escapeHtml(g.name)}：${delta>0?'+':''}${delta} 分</div>`);
  });
  if(!lines.length)lines.push(`<div class="hand-effect-line-v218 neutral">${escapeHtml(note||'本次道具未造成直接分数变化')}</div>`);
  box.innerHTML=`<div class="hand-effect-icon-v218">${itemVisual(key)}</div>
    <div class="hand-effect-name-v218">${escapeHtml(ITEM_DEFS[key]?.name||'道具')}</div>
    <div class="hand-effect-lines-v218">${lines.join('')}</div>`;
  overlay.classList.add('active');
  clearTimeout(showHandEffectV218._timer);
  showHandEffectV218._timer=setTimeout(()=>overlay.classList.remove('active'),2200);
}
function handUseOneV218(){
  const g=state.groups.find(x=>x.id===handRaiseGroupId),it=g?.inventory?.[0];
  if(!g||!it){showToast('该组当前没有主要道具');return}
  const key=it.key,before=scoreSnapshotV218();
  const ok=useItem(g.id,0);
  if(ok!==false)setTimeout(()=>showHandEffectV218(key,before),60);
  renderHandRewardControlsV218();
}
function handUseAllTripleV218(){
  const g=state.groups.find(x=>x.id===handRaiseGroupId),it=g?.inventory?.[0];
  if(!g||!it||!TRIPLE_KEYS_V218.has(it.key)){showToast('当前主要道具不是三重道具');return}
  const key=it.key,before=scoreSnapshotV218();
  let left=Math.min(3,Number(it.charges)||0);
  handEffectSuppressV218=true;
  const fire=()=>{
    const live=state.groups.find(x=>x.id===handRaiseGroupId);
    if(!live?.inventory?.[0]||live.inventory[0].key!==key||left<=0){
      handEffectSuppressV218=false;
      showHandEffectV218(key,before,'连发结束');
      renderHandRewardControlsV218();
      return;
    }
    useItem(live.id,0);
    left--;
    setTimeout(fire,520);
  };
  fire();
}
function renderHandRewardControlsV218(){
  const box=document.getElementById('handRewardBox');
  const g=state.groups.find(x=>x.id===handRaiseGroupId);if(!box||!g)return;
  const main=g.inventory?.[0],triple=main&&TRIPLE_KEYS_V218.has(main.key)&&Number(main.charges)>1;
  const drawDisabled=!eligibleForItems(g)||g.inventory.length>=3;
  box.innerHTML=`<div class="hand-rewards">
    <b style="width:100%">回答正确 · 选择奖励</b>
    <button class="btn btn-success" onclick="handQuickScore(1)">+1</button>
    <button class="btn btn-success" onclick="handQuickScore(2)">+2</button>
    <button class="btn btn-success" onclick="handQuickScore(5)">+5</button>
    <button class="btn btn-primary" onclick="handDrawItem()" ${drawDisabled?'disabled':''}>🎁 抽取道具</button>
    <button class="btn btn-warning" onclick="handUseOneV218()" ${!main?'disabled':''}>${main?`使用 1 次：${escapeHtml(ITEM_DEFS[main.key]?.name||'道具')}`:'无主要道具'}</button>
    ${triple?`<button class="btn btn-danger" onclick="handUseAllTripleV218()">连发剩余 ${main.charges} 次</button>`:''}
  </div>`;
}
renderHandRewardControlsV214=renderHandRewardControlsV218;
handUsePrimaryV214=handUseOneV218;

/* 正确判定后使用新版奖励栏 */
const _v218JudgeHandRaise=judgeHandRaise;
judgeHandRaise=function(correct){
  const r=_v218JudgeHandRaise.call(this,correct);
  if(correct)setTimeout(renderHandRewardControlsV218,0);
  return r;
};

/* 抽完道具仍留在手动举手菜单；只保留“完成”，完成也不强制关窗。 */
finishHandItemReward=function(){
  handItemDrawGroupId=null;handItemPendingKey=null;handItemDrawStartedAt=0;
  renderHandRewardControlsV218();
};

/* ---------- 8. 道具百科重新排序 + 使用技巧 ---------- */
const ITEM_ORDER_V218=[
  'mushroom','triple_mushroom','green','triple_green','red','triple_red',
  'banana','triple_banana','horn','feather',
  'fire_flower','ice_flower','boomerang_flower','bomb','hammer','spiny',
  'coin','coin_shell','question',
  'boo','blooper','lightning',
  'star','mega','bullet','power'
];
const ITEM_TIPS_V218={
  mushroom:'既能主动加分，也能在刺龟壳来袭时选择主动消耗闪避。',
  triple_mushroom:'答题期间第一次使用后不能 All In，但同一枚三重蘑菇的剩余次数仍可继续使用；手动举手可选择一次或连发。',
  green:'主要栏可作为防御资源；领先时不要急着主动丢掉。',
  triple_green:'三次耐久可用于进攻或逐次防御；答题中可以继续消耗同一枚三重道具。',
  red:'只攻击紧邻上位；已经第一名时也可主动丢弃，用后无效果。',
  triple_red:'连发时每一发都会重新读取最新排名，因此目标可能变化。',
  banana:'可攻击紧邻下位，同时作为主要栏基础防御。',
  triple_banana:'连发会按每一发发动时的最新排名重新计算下位目标。',
  horn:'前 60% 排名都可能获得；第一名每次正常抽取时获得概率为 10%。遭遇刺龟壳时会询问是否主动消耗。',
  feather:'适合保留到预期会遭受攻击时使用，触发后自动消失。',
  fire_flower:'每发随机攻击一个其他小组 -1/4，适合直接压低对手分数。',
  ice_flower:'命中后冻结目标；目标下一次尝试主动使用道具会解除冻结并取消该次使用，若不用则 3 次答题后自然解除。',
  boomerang_flower:'同时压制紧邻上下位；每次发动都会根据最新排名重新找目标。',
  bomb:'既能进攻又能防龟壳；被摧毁或用于防御时可能爆炸波及相邻组。',
  hammer:'只会从排名高于自己的组中随机选择最多 3 个目标。',
  spiny:'专门针对第一名；对方若主要栏有超级喇叭或蘑菇，可能主动选择防御。',
  coin:'稳定 +2，适合小分差时直接使用。',
  coin_shell:'会连带给所有领先组加分，使用前先确认是否真的有利。',
  question:'自己与所有落后组一起获得增益，适合领先组制造整体抬升。',
  boo:'若上方组无道具或自己已第一，会自动获得一个蘑菇；使用后获得持续 3 次答题的攻击防护，受攻击不减少持续次数。',
  blooper:'会遮蔽积分、图表、领奖台以及顶部排名预览，适合制造信息压力。',
  lightning:'影响所有领先组，但无敌星、巨大蘑菇和害羞幽灵等状态可能阻挡。',
  star:'立即释放主要栏并获得 3 次攻击防御，适合需要腾出道具槽时使用。',
  mega:'占据主要栏直到状态结束，能抵挡 3 次攻击。',
  bullet:'追赶效果依赖当前排名和前方组数，越靠后通常收益越明显。',
  power:'仅持续 3 次答题；答错也会消耗次数，因此最好在把握较高时启用。'
};
const _v218RenderAbout=renderAbout;
renderAbout=function(tab){
  if(tab!=='items')return _v218RenderAbout.call(this,tab);
  document.querySelectorAll('[data-about]').forEach(b=>b.classList.toggle('active',b.dataset.about===tab));
  const m=document.getElementById('aboutMain');if(!m)return;
  m.innerHTML=`<div class="v2170-ency-head">
    <div><h2>26 种道具百科</h2><div class="v2170-ency-sub">功能说明 + 实战使用技巧</div></div>
    <button class="btn btn-sm" onclick="closeAbout()">关闭</button>
  </div>
  <div class="v218-ency-general">
    <b>课堂小技巧：</b>
    每次打开课堂后，第一次“手动举手”道具抽取会从九种基础 / 防御道具中等概率获得，适合让最先答对的组争取更稳定的资源。
    答题期间一旦主动使用道具，就不能再 All In；但三重绿龟壳、三重红龟壳、三重香蕉皮、三重蘑菇在第一次使用后，可继续使用同一枚道具的剩余次数。
    同一小组抽取时不会重复获得已经持有的同种道具。
  </div>
  <div class="v2170-ency-list">
    ${ITEM_ORDER_V218.filter(k=>ITEM_DEFS[k]).map(k=>{
      const d=ITEM_DEFS[k],desc=(typeof ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715!=='undefined'&&ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715[k])||d.desc||'';
      return `<div class="v2170-ency-row">
        <div class="v2170-ency-icon">${itemVisual(k,'v2170-ency-img')}</div>
        <div class="v2170-ency-copy">
          <div class="v2170-ency-name">${escapeHtml(d.name)}</div>
          <div class="v2170-ency-desc">${escapeHtml(desc)}</div>
          <div class="v218-ency-tip"><b>使用技巧：</b>${escapeHtml(ITEM_TIPS_V218[k]||'根据当前排名、道具栏与答题阶段灵活使用。')}</div>
        </div>
      </div>`;
    }).join('')}
  </div>`;
};

/* 修正百科旧文案 */
if(typeof ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715!=='undefined'){
  ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715.blooper='暂时遮蔽全场积分、领奖台、图表以及比赛页顶部排名预览，使其显示为未知状态。';
  ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715.power='效果持续 3 次答题；每次答题都会消耗 1 次，答对时强制向前提升 1 个排名，答错不发动。';
  ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715.fire_flower='拥有 3 次火之花攻击次数；每次随机攻击一个其他小组，扣除其当前积分的 1/4。';
  ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715.ice_flower='拥有 3 次冰之花攻击次数；每次随机攻击一个其他小组，扣除其当前积分的 1/5，并冻结其主动道具使用。';
  ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715.boomerang_flower='拥有 3 次回旋镖攻击次数；每次攻击当前排名紧邻自己的上方和下方小组，各扣除其当前积分的 1/5。';
}

/* 初始化 / 兼容旧存档 */
state.groups.forEach(g=>{
  if(g.itemEffect?.iceLock && !Number.isFinite(Number(g.itemEffect.iceRoundsLeftV218)))g.itemEffect.iceRoundsLeftV218=3;
  if(Number(g.booShield||0)>0 && !Number.isFinite(Number(g.booRoundsLeftV218)))g.booRoundsLeftV218=3;
});
saveState();
