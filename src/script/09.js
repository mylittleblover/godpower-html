
/* ===== V2.17.4：26 种道具独立音效 =====
   抽取启动 / 滚动 / 定格和“防御成功”仍保留为公共事件音效；
   每一种具体道具的发动音效则完全拆分，可分别上传、试听、还原。 */

const PER_ITEM_SOUND_IDS_V2174 = new Set(
  ITEM_KEYS.map(k=>`item_${k}`)
);

const GENERIC_ITEM_USE_SOUNDS_V2174 = new Set([
  'item_use','item_attack','item_buff','item_status','item_steal'
]);

/* 每个道具没有自定义音频时，也给一个彼此不同的合成兜底声。
   不是拿 26 个“哔”复制粘贴，只是做人类能分辨的最小差异。 */
function playPerItemFallbackV2174(key){
  if(!audioCtx || !masterGainNode)return;

  const idx=Math.max(0,ITEM_KEYS.indexOf(key));
  const now=audioCtx.currentTime+.005;
  const kind=ITEM_DEFS[key]?.kind||'tactic';

  const base=180 + (idx%13)*36;
  const octave=(idx%2)?1.5:1;
  const f1=base*octave;
  const f2=f1*(1.25 + (idx%4)*.08);

  const tone=(freq,t,dur,type='triangle',gain=.075,endFreq=null)=>{
    try{
      const osc=audioCtx.createOscillator();
      const g=audioCtx.createGain();
      osc.type=type;
      osc.frequency.setValueAtTime(Math.max(40,freq),t);
      if(endFreq && endFreq>0){
        try{osc.frequency.exponentialRampToValueAtTime(Math.max(40,endFreq),t+dur)}catch(e){}
      }
      g.gain.setValueAtTime(gain,t);
      g.gain.exponentialRampToValueAtTime(.001,t+dur);
      osc.connect(g);g.connect(getFxOutputV2176());
      osc.start(t);osc.stop(t+dur+.02);
    }catch(e){}
  };

  if(kind==='attack'){
    tone(f1,now,.13,'square',.07,f1*.58);
    tone(f2,now+.055,.16,'sawtooth',.055,f2*.48);
  }else if(kind==='boost'){
    tone(f1,now,.16,'sine',.07,f1*1.45);
    tone(f2,now+.07,.20,'triangle',.06,f2*1.35);
  }else if(kind==='status'){
    tone(f1,now,.28,'triangle',.065,f1*1.7);
    tone(f2,now+.09,.30,'sine',.05,f2*1.55);
  }else if(kind==='instant'){
    tone(f1*.8,now,.18,'sawtooth',.075,f1*2.1);
    tone(f2,now+.06,.15,'square',.055,f2*1.7);
  }else{
    tone(f1,now,.18,'triangle',.065,f2);
    tone(f2,now+.08,.22,'sine',.05,f1*.72);
  }
}

/* 最终音效入口：
   1. 具体 item_xxx -> 读取该道具独立上传音频；
   2. 没上传 -> 播放该道具自己的合成兜底；
   3. 旧的“发动通用/攻击/强化/状态/偷取”不再叠加播放。 */
const _v2174PlaySound = playSound;
playSound = async function(slotId){
  if(slotId==='ui_click' && typeof ClassroomFeedback!=='undefined' && !ClassroomFeedback.allowClickSound())return;
  if(GENERIC_ITEM_USE_SOUNDS_V2174.has(slotId)){
    return;
  }

  if(PER_ITEM_SOUND_IDS_V2174.has(slotId)){
    try{
      if(!customFxBuffers?.[slotId] && !fxSoundsLoaded && typeof loadFxSounds==='function'){
        await loadFxSounds();
      }
      await getAudioContext();

      const custom=customFxBuffers?.[slotId];
      if(custom){
        const source=audioCtx.createBufferSource();
        source.buffer=custom;
        source.connect(getFxOutputV2176());
        source.start(0);
        return;
      }

      playPerItemFallbackV2174(slotId.slice(5));
      return;
    }catch(e){
      try{
        await getAudioContext();
        playPerItemFallbackV2174(slotId.slice(5));
      }catch(_){}
      return;
    }
  }

  return _v2174PlaySound.call(this,slotId);
};

/* 最终 showItemUseFx 前播放对应道具自己的音效。
   内层旧包装仍然会尝试 item_use / item_attack 等，但上面的 playSound 已将它们静音。 */
const _v2174ShowItemUseFx = showItemUseFx;
showItemUseFx = function(key,casterId=null,targetText=''){
  if(ITEM_DEFS[key]){
    try{playSound(`item_${key}`)}catch(e){}
  }
  return _v2174ShowItemUseFx.call(this,key,casterId,targetText);
};

/* 设置页重做：
   公共事件音效仅留下抽取三件套 + 防御成功；
   下面单独列出 26 个道具，每一个都可独立试听 / 上传 / 还原。 */
renderItemFxSoundListV26=function(){
  const box=document.getElementById('itemFxSoundListV26');
  if(!box)return;

  const common=[
    {id:'item_draw_start',name:'道具抽取 · 启动',desc:'所有道具共用'},
    {id:'item_draw_tick',name:'道具抽取 · 滚动刻度',desc:'所有道具共用'},
    {id:'item_draw_reveal',name:'道具抽取 · 定格',desc:'所有道具共用'},
    {id:'item_defend',name:'道具防御 · 成功',desc:'统一防御提示音'}
  ];

  const rowHtml=(id,name,desc,visual='')=>{
    const custom=!!customFxBuffers[id] || hasSound('fx_'+id);
    const itemClass=visual?' v2174-item-sound-card':'';
    const description=visual
      ? `<div class="sound-desc v2174-item-sound-desc">
          ${visual}
          <div class="v2174-item-sound-copy">
            <div class="sound-name">${escapeHtml(name)}</div>
            <div class="sound-tag">${custom?'已载入独立音频':escapeHtml(desc)}</div>
          </div>
        </div>`
      : `<div class="sound-desc">
          <div class="sound-name v2174-sound-name">${escapeHtml(name)}</div>
          <div class="sound-tag">${custom?'已载入独立音频':escapeHtml(desc)}</div>
        </div>`;
    return `<div class="sound-row v2174-sound-row${itemClass}">
      ${description}
      <div class="sound-controls">
        <button class="btn btn-sm" onclick="playSound('${id}')">试听</button>
        <button class="btn btn-sm btn-primary" onclick="triggerUploadAudio('fx_${id}')">上传</button>
        ${custom?`<button class="btn btn-sm btn-danger" onclick="deleteFxTrack('fx_${id}','${id}');setTimeout(renderItemFxSoundListV26,100)">还原</button>`:''}
      </div>
    </div>`;
  };

  box.innerHTML=`
    <div class="v2174-audio-head">
      <b>公共道具事件</b>
      <span>抽取过程与统一防御提示</span>
    </div>
    ${common.map(x=>rowHtml(x.id,x.name,x.desc)).join('')}

    <div class="v2174-audio-head v2174-item-head">
      <b>26 种道具独立发动音效</b>
      <span>每个道具使用自己的音频槽，不再共享“攻击 / 强化 / 状态”等通用音效。</span>
    </div>
    <div class="v2174-item-sound-grid">
      ${ITEM_KEYS.map(k=>{
        const d=ITEM_DEFS[k];
        const visual=`<span class="v2174-item-audio-icon">${itemVisual(k,'v2174-item-audio-img')}</span>`;
        return rowHtml(`item_${k}`,d.name,'默认：该道具独立合成音',visual);
      }).join('')}
    </div>
  `;
};

/* 上传 / 删除后立即刷新独立道具音效列表。 */
const _v2174HandleSoundFileUpload=handleSoundFileUpload;
handleSoundFileUpload=function(event){
  const result=_v2174HandleSoundFileUpload.call(this,event);
  setTimeout(()=>{try{renderItemFxSoundListV26()}catch(e){}},180);
  return result;
};

const _v2174DeleteFxTrack=deleteFxTrack;
deleteFxTrack=function(idbKey,fxKey){
  const result=_v2174DeleteFxTrack.call(this,idbKey,fxKey);
  setTimeout(()=>{try{renderItemFxSoundListV26()}catch(e){}},120);
  return result;
};
