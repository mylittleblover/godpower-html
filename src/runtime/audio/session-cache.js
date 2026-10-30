let soundIdCache = new Set();
let fxSoundsLoaded = false;
let fxSoundsLoading = null;
let backgroundAudioInitTimer = null;
let dbInitPromise = null;

function scheduleIdleTask(fn, timeout = 1500) {
  if ("requestIdleCallback" in window) {
    return window.requestIdleCallback(fn, { timeout });
  }
  return window.setTimeout(fn, Math.min(timeout, 800));
}

function refreshSoundIdCache() {
  return new Promise((resolve) => {
    if (!db) {
      resolve(soundIdCache);
      return;
    }
    try {
      const tx = db.transaction("sounds", "readonly");
      const store = tx.objectStore("sounds");
      const req = store.getAllKeys();
      req.onsuccess = () => {
        soundIdCache = new Set(req.result || []);
        resolve(soundIdCache);
      };
      req.onerror = () => resolve(soundIdCache);
    } catch (_) {
      resolve(soundIdCache);
    }
  });
}

function hasSound(slotId) {
  return soundIdCache.has(slotId);
}

const bgmEngine = {
  state: "IDLE",
  syncStartTime: 0,
  battleGain: null,
  thinkingGain: null,
  activeNodes: [],
  victoryNode: null,
  preloadedSet: null,
  isPreloading: false,
  victoryTimer: null,
  victoryFadeTimer: null,
  transitionTimer: null,
};

function getSecPerBeat() {
  const effectiveBpm =
    currentSetIndex === 7
      ? Number(menuCfg.battleSet8Bpm) || 135
      : Number(menuCfg.battleBaseBpm) || Number(state.bpm) || 130;
  return 60 / Math.max(1, effectiveBpm);
}
function getSecPerBar() {
  return getSecPerBeat() * Math.max(1, Number(state.beatsPerBar) || 4);
}

function getTrackCurrentBeat() {
  if (!audioCtx || bgmEngine.syncStartTime === 0) return 0;
  const now = audioCtx.currentTime;
  const elapsed = Math.max(0, now - bgmEngine.syncStartTime);
  const secPerBeat = getSecPerBeat();
  const loopStartSec = 8 * secPerBeat;
  const loopEndSec = 184 * secPerBeat;
  const loopDurationSec = loopEndSec - loopStartSec;

  let currentSecInTrack;
  if (elapsed < loopEndSec) {
    currentSecInTrack = elapsed;
  } else {
    currentSecInTrack =
      loopStartSec + ((elapsed - loopEndSec) % loopDurationSec);
  }
  return currentSecInTrack / secPerBeat;
}
