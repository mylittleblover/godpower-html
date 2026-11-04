const menuLoading = {};
const menuBufferOwners = {};
function menuBufferSignature(key) {
  return JSON.stringify([
    menuCfg.bpm,
    menuCfg.loopStartBeat,
    menuCfg.loopEndBeat,
    menuCfg.gainTrims?.[key],
    audioCtx?.sampleRate,
  ]);
}
async function menuLoadBuffer(key) {
  const signature = menuBufferSignature(key),
    context = audioCtx;
  if (menuBgm.buffers[key] && menuBufferOwners[key] === signature)
    return menuBgm.buffers[key];
  if (menuLoading[key]?.signature === signature)
    return menuLoading[key].promise;
  const owner = { signature, promise: null };
  menuLoading[key] = owner;
  const current = () =>
    menuLoading[key] === owner &&
    audioCtx === context &&
    signature === menuBufferSignature(key);
  const p = (async () => {
    let buf = null,
      uploaded = false;
    if (db) {
      try {
        const ab = await new Promise((res) => {
          const tx = db.transaction("sounds", "readonly"),
            req = tx.objectStore("sounds").get("bgm_menu_" + key);
          req.onsuccess = () => res(req.result?.arrayBuffer || null);
          req.onerror = () => res(null);
        });
        if (!current()) return null;
        if (ab?.byteLength) {
          buf = normalizeWelcomeLoopBuffer(
            key,
            await context.decodeAudioData(ab.slice(0)),
          );
          uploaded = true;
        }
      } catch (error) {
        console.warn("自定义菜单音乐读取失败，将使用默认音乐", key, error);
      }
    }
    if (!current()) return null;
    if (!buf) {
      try {
        buf = await makeSynthMenuBuffer(key);
      } catch (error) {
        console.warn("默认菜单音乐合成失败", key, error);
        return null;
      }
    }
    if (!current()) return null;
    if (buf) {
      menuBgm.buffers[key] = buf;
      menuBufferOwners[key] = signature;
      if (uploaded) menuBgm.uploadedKeys.add(key);
      else menuBgm.uploadedKeys.delete(key);
    }
    return buf;
  })();
  owner.promise = p;
  try {
    return await p;
  } finally {
    if (menuLoading[key] === owner) delete menuLoading[key];
  }
}

function menuLoopParams(buf, key) {
  const span = menuLoopSpan();
  if (menuBgm.uploadedKeys.has(key)) {
    const startSec = Math.min(span.startSec, Math.max(0, buf.duration - 0.05));
    const endSec = Math.min(span.endSec, buf.duration);
    return { startSec, endSec };
  }
  return { startSec: 0, endSec: buf.duration };
}

function menuTrimFor(key) {
  const t = Number(menuCfg.gainTrims[key]);
  return Math.max(0, Math.min(3, Number.isFinite(t) ? t : 1));
}

/* 音乐位置 → 某轨 buffer 内的起播秒数：未到循环终点前线性推进（含前奏区），越过后在循环区间内回绕 */
function menuPosForKey(key, buf, t) {
  const lp = menuLoopParams(buf, key);
  const elapsed = Math.max(0, t - menuBgm.origin);
  if (elapsed < lp.endSec) return elapsed;
  const dur = lp.endSec - lp.startSec;
  if (dur <= 0.001) return Math.min(elapsed, Math.max(0, buf.duration - 0.02));
  return lp.startSec + ((elapsed - lp.startSec) % dur);
}

function menuVoiceGainAt(v, t) {
  const r = v.ramp;
  if (t <= r.t0) return r.v0;
  if (t >= r.t1) return r.v1;
  return r.v0 + (r.v1 - r.v0) * ((t - r.t0) / (r.t1 - r.t0));
}

/* 从「当前真实音量」开始线性渐变到 target，可随时被新的渐变打断 */
function menuVoiceRamp(v, target, dur) {
  const now = audioCtx.currentTime;
  const cur = menuVoiceGainAt(v, now);
  const g = v.gain.gain;
  g.cancelScheduledValues(now);
  g.setValueAtTime(cur, now);
  g.linearRampToValueAtTime(target, now + dur);
  v.ramp = { v0: cur, v1: target, t0: now, t1: now + dur };
}

function menuSpawnVoice(key, buf, startAt) {
  const lp = menuLoopParams(buf, key);
  const src = audioCtx.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  src.loopStart = Math.min(lp.startSec, Math.max(0, buf.duration - 0.02));
  src.loopEnd = Math.min(lp.endSec, buf.duration);
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  src.connect(gain);
  gain.connect(menuBgm.outGain);
  const offset = Math.min(
    menuPosForKey(key, buf, startAt),
    Math.max(0, buf.duration - 0.02),
  );
  const v = {
    key,
    src,
    gain,
    ramp: { v0: 0, v1: 0, t0: 0, t1: 0 },
    stopping: false,
    loopStart: src.loopStart,
    loopEnd: src.loopEnd,
  };
  src.onended = () => {
    try {
      src.disconnect();
    } catch (e) {}
    try {
      gain.disconnect();
    } catch (e) {}
    const i = menuBgm.voices.indexOf(v);
    if (i >= 0) menuBgm.voices.splice(i, 1);
  };
  src.start(startAt, offset);
  menuBgm.voices.push(v);
  return v;
}

/* 淡出并由音频时钟预约销毁；已在退场的 voice 不重复处理 */
function menuRetireVoice(v, fadeSec) {
  if (v.stopping) return;
  const dur = fadeSec == null ? MENU_FADE_SEC : fadeSec;
  v.stopping = true;
  try {
    menuVoiceRamp(v, 0, dur);
    v.src.stop(audioCtx.currentTime + dur + 0.02);
  } catch (e) {
    try {
      v.src.stop();
    } catch (e2) {}
  }
}

function menuSwitchNow(key, buf) {
  const now = audioCtx.currentTime;
  const startAt = now + 0.03;
  if (!menuBgm.active) {
    if (menuBgm.pausedPos === null) {
      menuBgm.origin = startAt; // 首次启动：从整曲起点
    } else if (now >= menuBgm.pausedAt) {
      menuBgm.origin = startAt - menuBgm.pausedPos; // 断点续播
    } // 否则：淡出未结束即切回，时间线连续，沿用 origin
    menuBgm.pausedPos = null;
    menuBgm.active = true;
  }
  const live = menuBgm.voices.find((v) => v.key === key && !v.stopping);
  menuBgm.voices.slice().forEach((v) => {
    if (v !== live) menuRetireVoice(v);
  });
  const target = menuTrimFor(key);
  if (live) {
    if (
      Math.abs(menuVoiceGainAt(live, now) - target) > 0.001 ||
      live.ramp.v1 !== target
    )
      menuVoiceRamp(live, target, MENU_FADE_SEC);
  } else {
    menuVoiceRamp(menuSpawnVoice(key, buf, startAt), target, MENU_FADE_SEC);
  }
  menuBgm.currentKey = key;
}

function menuStartOrSwitch(key) {
  if (!menuCfg.enabled || !key) return;
  menuBgm.pendingKey = key;
  const token = ++menuBgm.opToken;
  ensureAudioUnlocked().then(async () => {
    try {
      if (token !== menuBgm.opToken) return;
      if (bgmEngine.state !== "IDLE" || currentView === "battle") return;
      if (!menuEnsureGraph()) return;
      const buf = await menuLoadBuffer(key);
      if (!buf || token !== menuBgm.opToken) return;
      if (bgmEngine.state !== "IDLE" || currentView === "battle") return;
      menuSwitchNow(key, buf);
    } catch (e) {}
  });
}

/* 进入比赛页：0.5s 淡出，记录淡出完成瞬间的音乐位置作为断点 */
function menuFadeOut() {
  menuBgm.opToken++;
  menuBgm.pendingKey = null;
  if (!menuBgm.active || !audioCtx) return;
  const endT = audioCtx.currentTime + MENU_FADE_SEC;
  const cur = menuBgm.currentKey;
  const buf = cur ? menuBgm.buffers[cur] : null;
  menuBgm.pausedPos = buf
    ? menuPosForKey(cur, buf, endT)
    : Math.max(0, endT - menuBgm.origin);
  menuBgm.pausedAt = endT;
  menuBgm.voices.slice().forEach((v) => menuRetireVoice(v));
  menuBgm.active = false;
  menuBgm.currentKey = null;
}

function menuStop() {
  menuBgm.opToken++;
  menuBgm.pendingKey = null;
  menuBgm.voices.slice().forEach((v) => {
    v.stopping = true;
    try {
      v.src.stop();
    } catch (e) {}
  });
  menuBgm.active = false;
  menuBgm.currentKey = null;
  menuBgm.pausedPos = null;
}

/* 拍号/循环区间变化：按新区间在同一音乐位置重建当前轨（0.5s 自身交叉淡化） */
function menuResyncGrid() {
  if (!menuBgm.active || !audioCtx) return;
  const cur = menuBgm.currentKey;
  const buf = cur ? menuBgm.buffers[cur] : null;
  if (!buf) return;
  const lp = menuLoopParams(buf, cur);
  const ls = Math.min(lp.startSec, Math.max(0, buf.duration - 0.02));
  const le = Math.min(lp.endSec, buf.duration);
  const live = menuBgm.voices.find((v) => v.key === cur && !v.stopping);
  if (
    live &&
    Math.abs(live.loopStart - ls) < 0.001 &&
    Math.abs(live.loopEnd - le) < 0.001
  )
    return;
  if (live) menuRetireVoice(live);
  menuVoiceRamp(
    menuSpawnVoice(cur, buf, audioCtx.currentTime + 0.03),
    menuTrimFor(cur),
    MENU_FADE_SEC,
  );
}

let menuReloadTimer = null;
function menuScheduleReload() {
  if (menuReloadTimer) clearTimeout(menuReloadTimer);
  menuReloadTimer = setTimeout(async () => {
    menuReloadTimer = null;
    const key = menuBgm.currentKey;
    if (!key || !menuBgm.active) return;
    delete menuBgm.buffers[key];
    menuBgm.uploadedKeys.delete(key);
    const buf = await menuLoadBuffer(key);
    if (!buf || key !== menuBgm.currentKey || !menuBgm.active) return;
    // BPM 变化后旧的时间原点失去意义：从整曲起点重新开始
    menuBgm.voices.slice().forEach((v) => menuRetireVoice(v));
    const startAt = audioCtx.currentTime + 0.03;
    menuBgm.origin = startAt;
    menuVoiceRamp(
      menuSpawnVoice(key, buf, startAt),
      menuTrimFor(key),
      MENU_FADE_SEC,
    );
  }, 250);
}

function updateWelcomeTrackIfNeeded() {
  if (!menuBgm.active || currentView !== "welcome") return;
  const key = getWelcomeTrackKey();
  if (key !== menuBgm.currentKey) menuStartOrSwitch(key);
}

/* ---------- 音乐设置（现已停用） ---------- */
