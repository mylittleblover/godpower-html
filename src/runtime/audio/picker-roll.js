let rollLoopNode = null;
let rollLoopGain = null;

function makeRollLoopBuffer() {
  if (!audioCtx) return null;
  const sr = audioCtx.sampleRate;
  const dur = 0.5;
  const buf = audioCtx.createBuffer(1, Math.floor(sr * dur), sr);
  const d = buf.getChannelData(0);
  const steps = 8;
  for (let i = 0; i < d.length; i++) {
    const t = i / sr;
    const step = Math.floor(t / (dur / steps));
    const inStep = t - step * (dur / steps);
    if (inStep < 0.03) {
      d[i] = (Math.random() * 2 - 1) * (1 - inStep / 0.03) * 0.6;
    } else {
      d[i] = (Math.random() * 2 - 1) * 0.08;
    }
  }
  return buf;
}

function startRollLoop() {
  if (!audioCtx) return;
  try {
    const buffer = selectFxBuffer("roll_loop") || makeRollLoopBuffer();
    if (!buffer) return;
    rollLoopGain = audioCtx.createGain();
    rollLoopGain.connect(getFxOutputV2176());
    const now = audioCtx.currentTime;
    rollLoopGain.gain.setValueAtTime(0, now);
    rollLoopGain.gain.linearRampToValueAtTime(0.5, now + 0.05);
    rollLoopNode = audioCtx.createBufferSource();
    rollLoopNode.buffer = buffer;
    rollLoopNode.loop = true;
    rollLoopNode.connect(rollLoopGain);
    rollLoopNode.start(now);
  } catch (e) {}
}

function stopRollLoop(cb) {
  if (!rollLoopNode || !audioCtx) {
    if (cb) cb();
    return;
  }
  try {
    const now = audioCtx.currentTime;
    rollLoopGain.gain.cancelScheduledValues(now);
    rollLoopGain.gain.setValueAtTime(
      Math.max(0.0001, rollLoopGain.gain.value || 0.5),
      now,
    );
    rollLoopGain.gain.linearRampToValueAtTime(0.0001, now + 0.1);
  } catch (e) {}
  setTimeout(() => {
    try {
      rollLoopNode.stop();
    } catch (e) {}
    rollLoopNode = null;
    rollLoopGain = null;
    if (cb) cb();
  }, 160);
}

/* ---------- 界面壁纸（独立 IndexedDB，避免混入音频包导出） ---------- */
