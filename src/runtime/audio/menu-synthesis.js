function menuSecPerBeat() {
  return 60 / Math.max(40, Number(menuCfg.bpm) || 130);
}

function menuLoopSpan() {
  const startBeat = Math.max(1, Number(menuCfg.loopStartBeat) || 1);
  const endBeat = Math.max(startBeat + 4, Number(menuCfg.loopEndBeat) || 33);
  return {
    startBeat,
    endBeat,
    startSec: (startBeat - 1) * menuSecPerBeat(),
    endSec: (endBeat - 1) * menuSecPerBeat(),
  };
}

/* 欢迎页的 6 条音轨是同一首音乐的分阶段 stem，必须共享完全一致的循环终点。
   浏览器解码 MP3/AAC 时，个别文件可能比工程设定短几十毫秒；旧逻辑会把那一轨的
   loopEnd 单独提前到文件末尾，经过一次循环后再切换阶段便会出现轻微抢拍。
   这里只补齐“接近标准长度”的欢迎音轨，不影响历史、档案、设置或比赛 BGM。 */
function normalizeWelcomeLoopBuffer(key, buf) {
  if (!buf || !/^welcome_[1-6]$/.test(key) || !audioCtx) return buf;
  const targetEnd = menuLoopSpan().endSec;
  const missing = targetEnd - buf.duration;
  const maxRepair = Math.min(0.35, menuSecPerBeat() * 0.75);
  if (!(missing > 0.0005 && missing <= maxRepair)) return buf;

  try {
    const sampleRate = buf.sampleRate || audioCtx.sampleRate;
    const targetLength = Math.ceil(targetEnd * sampleRate) + 1;
    const fixed = audioCtx.createBuffer(
      buf.numberOfChannels,
      targetLength,
      sampleRate,
    );
    for (let ch = 0; ch < buf.numberOfChannels; ch++) {
      fixed.getChannelData(ch).set(buf.getChannelData(ch));
    }
    return fixed;
  } catch (_) {
    return buf;
  }
}

function menuEnsureGraph() {
  if (!audioCtx) return false;
  if (!menuBgm.outGain) {
    menuBgm.outGain = audioCtx.createGain();
    menuBgm.outGain.gain.setValueAtTime(0.7, audioCtx.currentTime);
    menuBgm.outGain.connect(musicGainNode);
  }
  return true;
}

/* 合成兜底：按工程台 BPM/拍号/循环拍数离线渲染一轨同拍循环 buffer（未上传该轨音频时使用） */
async function makeSynthMenuBuffer(key) {
  const sr = audioCtx.sampleRate;
  const bpm = Math.max(40, Number(menuCfg.bpm) || 130);
  const beats = Math.max(
    4,
    (Number(menuCfg.loopEndBeat) || 33) - (Number(menuCfg.loopStartBeat) || 1),
  );
  const bars = Math.max(8, Math.ceil(beats / 4));
  const totalSteps = bars * 16;
  const stepSec = 60 / bpm / 16;
  const dur = totalSteps * stepSec;
  const len = Math.max(1, Math.floor(sr * dur));
  const offline = new OfflineAudioContext(1, len, sr);
  const pat = buildMenuPattern(key, bars);
  const trim = Math.max(0, Math.min(3, Number(menuCfg.gainTrims[key]) || 1));
  let hatFilter = null;
  for (let step = 0; step < totalSteps; step++) {
    if (step > 0 && step % 8 === 0) {
      if (globalThis.scheduler?.yield) await globalThis.scheduler.yield();
      else await new Promise((resolve) => setTimeout(resolve, 0));
    }
    const time = step * stepSec;
    const bassMidi = pat.bass[step];
    const leadMidi = pat.lead[step];
    const hatOn = pat.hat[step];
    if (bassMidi) {
      const osc = offline.createOscillator();
      const g = offline.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(midiToFreq(bassMidi), time);
      g.gain.setValueAtTime(0.001, time);
      g.gain.exponentialRampToValueAtTime(0.24 * trim, time + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, time + stepSec * 3.4);
      osc.connect(g);
      g.connect(offline.destination);
      osc.start(time);
      osc.stop(time + stepSec * 3.6);
    }
    if (leadMidi) {
      const osc = offline.createOscillator();
      const g = offline.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(midiToFreq(leadMidi), time);
      g.gain.setValueAtTime(0.001, time);
      g.gain.exponentialRampToValueAtTime(0.12 * trim, time + 0.012);
      g.gain.exponentialRampToValueAtTime(0.001, time + stepSec * 0.9);
      osc.connect(g);
      g.connect(offline.destination);
      osc.start(time);
      osc.stop(time + stepSec);
    }
    if (hatOn) {
      const buf = offline.createBuffer(1, Math.floor(sr * 0.05), sr);
      const dd = buf.getChannelData(0);
      for (let i = 0; i < dd.length; i++) dd[i] = Math.random() * 2 - 1;
      const src = offline.createBufferSource();
      src.buffer = buf;
      const g = offline.createGain();
      g.gain.setValueAtTime(0.07 * trim, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.035);
      if (!hatFilter) {
        hatFilter = offline.createBiquadFilter();
        hatFilter.type = "highpass";
        hatFilter.frequency.value = 6000;
        hatFilter.connect(offline.destination);
      }
      src.connect(g);
      g.connect(hatFilter);
      src.start(time);
    }
  }
  return offline.startRendering();
}

/* 加载一轨：优先 IndexedDB 用户上传音频（bgm_menu_<key>），无则合成兜底；并发加载去重 */
