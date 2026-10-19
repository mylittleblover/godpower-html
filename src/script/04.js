
/* ===== V2.16.4：强力蘑菇可见分数 + 道具音效最终接管 ===== */

/*
 * 1. 强力蘑菇：
 * 旧逻辑实际上已经改了 g.score，但基础结算的 650ms 分数动画仍在继续，
 * 动画结束时又把 displayScore 写回“普通结算后的分数”，所以画面看起来像没触发。
 * 这里保留“先普通结算、再提升一名”的设计，在基础动画结束后再做第二段提升动画。
 */
/* Power round feedback is owned by ui/round-feedback.js. */

/*
 * 2. 道具音效：
 * V2.6 曾给抽取函数套音效包装，但后面的 V2.8/V2.9 又重写了 globalItemDraw / handDrawItem，
 * 等于把包装整个绕开了。
 * 另外 item_* 没有默认合成音时，未上传自定义音频就会彻底静音。
 * 这里在最终函数层重新接管，并为全部 9 类道具音效提供轻量 WebAudio 兜底。
 */
const ITEM_SOUND_IDS_V2164 = new Set([
  'item_draw_start','item_draw_tick','item_draw_reveal',
  'item_use','item_attack','item_defend','item_buff','item_status','item_steal'
]);

function itemFallbackToneV2164(freq, t, dur, type='sine', gainValue=.12, endFreq=null) {
  if (!audioCtx || !masterGainNode) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (endFreq && endFreq > 0) {
    try { osc.frequency.exponentialRampToValueAtTime(endFreq, t + dur); } catch (e) {}
  }
  gain.gain.setValueAtTime(Math.max(.001, gainValue), t);
  gain.gain.exponentialRampToValueAtTime(.001, t + dur);
  osc.connect(gain);
  gain.connect(getFxOutputV2176());
  osc.start(t);
  osc.stop(t + dur + .02);
}

function playItemFallbackSoundV2164(slotId) {
  if (!audioCtx || !masterGainNode) return;
  const now = audioCtx.currentTime + .005;

  switch (slotId) {
    case 'item_draw_start':
      itemFallbackToneV2164(330, now, .12, 'square', .10, 660);
      itemFallbackToneV2164(660, now + .11, .16, 'square', .09, 990);
      break;

    case 'item_draw_tick':
      itemFallbackToneV2164(1250, now, .035, 'square', .045, 1550);
      break;

    case 'item_draw_reveal':
      [523.25,659.25,783.99].forEach((f,i)=>
        itemFallbackToneV2164(f, now + i*.055, .28, 'triangle', .09)
      );
      break;

    case 'item_use':
      itemFallbackToneV2164(220, now, .18, 'sawtooth', .08, 880);
      break;

    case 'item_attack':
      itemFallbackToneV2164(180, now, .15, 'sawtooth', .13, 70);
      itemFallbackToneV2164(95, now + .035, .20, 'square', .08, 55);
      break;

    case 'item_defend':
      itemFallbackToneV2164(880, now, .16, 'triangle', .10, 1320);
      itemFallbackToneV2164(1320, now + .08, .20, 'triangle', .08, 1760);
      break;

    case 'item_buff':
      [523.25,659.25,783.99,1046.5].forEach((f,i)=>
        itemFallbackToneV2164(f, now + i*.045, .22, 'sine', .075)
      );
      break;

    case 'item_status':
      itemFallbackToneV2164(440, now, .34, 'triangle', .075, 880);
      itemFallbackToneV2164(660, now + .07, .34, 'sine', .055, 1320);
      break;

    case 'item_steal':
      itemFallbackToneV2164(900, now, .16, 'triangle', .075, 360);
      itemFallbackToneV2164(420, now + .13, .18, 'square', .06, 720);
      break;
  }
}

if (typeof playSound === 'function') {
  const _v2164PlaySoundBase = playSound;
  playSound = async function(slotId) {
    if (!ITEM_SOUND_IDS_V2164.has(slotId)) {
      return _v2164PlaySoundBase.call(this, slotId);
    }

    try {
      /* 先尝试加载用户上传/导入的自定义道具音效。 */
      if (!customFxBuffers?.[slotId] && !fxSoundsLoaded && typeof loadFxSounds === 'function') {
        await loadFxSounds();
      }
      await getAudioContext();

      const custom = customFxBuffers?.[slotId];
      if (custom) {
        const source = audioCtx.createBufferSource();
        source.buffer = custom;
        source.connect(getFxOutputV2176());
        source.start(0);
        return;
      }

      /* 没有自定义资源也必须有声音。 */
      playItemFallbackSoundV2164(slotId);
    } catch (e) {
      try {
        await getAudioContext();
        playItemFallbackSoundV2164(slotId);
      } catch (_) {}
    }
  };
}

/* 最终版本的全局抽取在 V2.6 之后被多次重写，因此重新包一次。 */
function startDrawSoundBedV2164(ms=3600) {
  playSound('item_draw_start');
  let n = 0;
  const interval = Math.max(150, ms / 15);
  const timer = setInterval(() => {
    if (n++ < 13) playSound('item_draw_tick');
    else clearInterval(timer);
  }, interval);
  setTimeout(() => {
    clearInterval(timer);
    playSound('item_draw_reveal');
  }, ms);
}

if (typeof globalItemDraw === 'function') {
  const _v2164GlobalItemDraw = globalItemDraw;
  globalItemDraw = function(...args) {
    const canStart = !itemDrawBusy &&
      state.groups.some(g => eligibleForItems(g) && Array.isArray(g.inventory) && g.inventory.length < 3) &&
      (typeof isCommunismMode !== 'function' || isCommunismMode());
    if (canStart) startDrawSoundBedV2164(3600);
    return _v2164GlobalItemDraw.apply(this, args);
  };
}

if (typeof handDrawItem === 'function') {
  const _v2164HandDrawItem = handDrawItem;
  handDrawItem = function(...args) {
    const g = state.groups.find(x => x.id === handRaiseGroupId);
    const canStart = !!g && !handItemDrawTimer &&
      eligibleForItems(g) && Array.isArray(g.inventory) && g.inventory.length < 3;
    if (canStart) startDrawSoundBedV2164(3600);
    return _v2164HandDrawItem.apply(this, args);
  };
}
