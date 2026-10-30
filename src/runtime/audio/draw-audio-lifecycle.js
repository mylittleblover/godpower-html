/* ===== V2.17.1：道具定格瞬间停止抽取音效 =====
   实际全局/举手抽取都在 3000ms 定格，但 V2.16.4 的音效床按 3600ms 运行，
   因而画面已经定格，滚动音还会继续约 0.6 秒。
   现在音效完全以实际 3000ms 定格点为准，并主动停止仍在播放的自定义抽取音频。 */

let activeDrawSourcesV2171 = new Set();
let drawTickTimerV2171 = null;
let drawRevealTimerV2171 = null;
let drawAudioGenerationV2171 = 0;

function stopActiveDrawAudioV2171() {
  if (drawTickTimerV2171) {
    clearInterval(drawTickTimerV2171);
    drawTickTimerV2171 = null;
  }
  if (drawRevealTimerV2171) {
    clearTimeout(drawRevealTimerV2171);
    drawRevealTimerV2171 = null;
  }

  activeDrawSourcesV2171.forEach((src) => {
    try {
      src.stop(0);
    } catch (e) {}
    try {
      src.disconnect();
    } catch (e) {}
  });
  activeDrawSourcesV2171.clear();
}

/* 对“启动 / 滚动刻度”使用可主动停止的 BufferSource。
   若没有自定义音频，则继续使用原来的短 WebAudio 合成音。 */
async function playTrackedDrawSoundV2171(slotId, generation) {
  try {
    if (generation !== drawAudioGenerationV2171) return;

    if (
      !customFxBuffers?.[slotId] &&
      !fxSoundsLoaded &&
      typeof loadFxSounds === "function"
    ) {
      await loadFxSounds();
    }
    if (generation !== drawAudioGenerationV2171) return;

    await getAudioContext();
    if (generation !== drawAudioGenerationV2171) return;

    const custom = customFxBuffers?.[slotId];
    if (custom) {
      const source = audioCtx.createBufferSource();
      source.buffer = custom;
      source.connect(getFxOutputV2176());
      activeDrawSourcesV2171.add(source);
      source.onended = () => activeDrawSourcesV2171.delete(source);
      source.start(0);
      return;
    }

    /* fallback 音本身极短，不需要专门 stop。 */
    if (typeof playItemFallbackSoundV2164 === "function") {
      playItemFallbackSoundV2164(slotId);
    } else {
      playSound(slotId);
    }
  } catch (e) {}
}

function finishDrawAudioV2171(generation) {
  if (generation !== drawAudioGenerationV2171) return;

  /* 定格的这一刻先停掉所有抽取启动/滚动声。 */
  if (drawTickTimerV2171) {
    clearInterval(drawTickTimerV2171);
    drawTickTimerV2171 = null;
  }
  activeDrawSourcesV2171.forEach((src) => {
    try {
      src.stop(0);
    } catch (e) {}
    try {
      src.disconnect();
    } catch (e) {}
  });
  activeDrawSourcesV2171.clear();

  /* 然后只播放一次“定格”音效。 */
  playSound("item_draw_reveal");
}

/* 覆盖 V2.16.4 的音效床。
   忽略旧调用传入的 3600ms，因为实际视觉定格时间固定为 3000ms。 */
startDrawSoundBedV2164 = function () {
  stopActiveDrawAudioV2171();

  const generation = ++drawAudioGenerationV2171;
  const duration = 3000;

  playTrackedDrawSoundV2171("item_draw_start", generation);

  let tickCount = 0;
  const tickInterval = Math.max(150, duration / 15);
  drawTickTimerV2171 = setInterval(() => {
    if (generation !== drawAudioGenerationV2171) {
      clearInterval(drawTickTimerV2171);
      drawTickTimerV2171 = null;
      return;
    }
    if (tickCount++ < 13) {
      playTrackedDrawSoundV2171("item_draw_tick", generation);
    } else {
      clearInterval(drawTickTimerV2171);
      drawTickTimerV2171 = null;
    }
  }, tickInterval);

  drawRevealTimerV2171 = setTimeout(() => {
    drawRevealTimerV2171 = null;
    finishDrawAudioV2171(generation);
  }, duration);
};

/* 如果抽取过程被取消/关闭，也不要让滚动音留在后台。 */
if (typeof cancelHandItemDraw === "function") {
  const _v2171CancelHandItemDraw = cancelHandItemDraw;
  cancelHandItemDraw = function (...args) {
    stopActiveDrawAudioV2171();
    drawAudioGenerationV2171++;
    return _v2171CancelHandItemDraw.apply(this, args);
  };
}
