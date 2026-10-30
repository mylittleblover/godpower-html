function initDB() {
  if (dbInitPromise) return dbInitPromise;

  dbInitPromise = new Promise((resolve) => {
    try {
      const request = indexedDB.open("PoliticsScoreSoundDB_Unified", 1);

      request.onupgradeneeded = (e) => {
        const database = e.target.result;
        if (!database.objectStoreNames.contains("sounds")) {
          database.createObjectStore("sounds", { keyPath: "id" });
        }
      };

      request.onsuccess = async (e) => {
        db = e.target.result;
        await refreshSoundIdCache();
        resolve();
        scheduleBackgroundAudioInit();
      };

      request.onerror = () => resolve();
    } catch (_) {
      resolve();
    }
  });

  return dbInitPromise;
}

function scheduleBackgroundAudioInit() {
  if (backgroundAudioInitTimer !== null) return;

  backgroundAudioInitTimer = scheduleIdleTask(async () => {
    backgroundAudioInitTimer = null;
    const migrationDone =
      STORAGE.get("politics_audio_migration_v2", "0") === "1";
    if (!migrationDone) {
      try {
        await migrateOldDatabases();
      } catch (error) {
        console.warn("旧音频迁移未完成，来源保留以供重试", error);
        showToast("旧音频迁移未完成，原音频已保留，下次启动将重试。");
      }
      await refreshSoundIdCache();
    }

    try {
      await loadFxSounds();
    } catch (_) {}
  }, 1800);
}

async function migrateOldDatabases() {
  return LegacyAudioMigration.run({
    indexedDB,
    destination: db,
    storage: CLASSROOM_STORAGE,
  });
}

async function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
    masterGainNode = audioCtx.createGain();
    masterGainNode.gain.setValueAtTime(
      state.masterVolume,
      audioCtx.currentTime,
    );
    masterGainNode.connect(audioCtx.destination);

    musicGainNode = audioCtx.createGain();
    musicGainNode.gain.setValueAtTime(bgmVolume, audioCtx.currentTime);
    musicGainNode.connect(masterGainNode);
    bgmEngine.battleGain = audioCtx.createGain();
    bgmEngine.thinkingGain = audioCtx.createGain();
    bgmEngine.battleGain.connect(musicGainNode);
    bgmEngine.thinkingGain.connect(musicGainNode);
  }
  if (audioCtx.state === "suspended") {
    try {
      await Promise.race([
        audioCtx.resume(),
        new Promise((res) => setTimeout(() => res(), 1500)),
      ]);
    } catch (e) {}
  }
  return audioCtx;
}

async function loadFxSounds() {
  if (!db || fxSoundsLoaded) return;
  if (fxSoundsLoading) return fxSoundsLoading;

  fxSoundsLoading = (async () => {
    try {
      const records = await new Promise((resolve) => {
        const tx = db.transaction("sounds", "readonly");
        const store = tx.objectStore("sounds");
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });

      const ctx = await getAudioContext();
      const fxRecords = records.filter(
        (item) =>
          item &&
          typeof item.id === "string" &&
          item.id.startsWith("fx_") &&
          item.arrayBuffer &&
          item.arrayBuffer.byteLength > 0,
      );

      const variants = Object.create(null);
      await Promise.all(
        fxRecords.map(async (item) => {
          try {
            const decoded = await ctx.decodeAudioData(
              item.arrayBuffer.slice(0),
            );
            const key = item.id.slice(3),
              split = key.indexOf("::variant::");
            if (split >= 0) {
              const slot = key.slice(0, split);
              (variants[slot] ||= []).push({
                id: item.id,
                name: item.name || "候选音效",
                buffer: decoded,
              });
            } else customFxBuffers[key] = decoded;
          } catch (_) {}
        }),
      );

      Object.values(variants).forEach((list) =>
        list.sort((a, b) => a.id.localeCompare(b.id)),
      );
      customFxVariants = variants;
      fxSoundsLoaded = true;
    } catch (_) {
    } finally {
      fxSoundsLoading = null;
    }
  })();

  return fxSoundsLoading;
}

/* One selected sample per operation; separate entropy avoids consuming game randomness. */
function selectFxBuffer(
  slotId,
  random = () => crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296,
) {
  const candidates = [
    customFxBuffers[slotId],
    ...(customFxVariants[slotId] || []).map((x) => x.buffer),
  ].filter(Boolean);
  if (!candidates.length) return null;
  if (candidates.length === 1) return candidates[0];
  return candidates[
    Math.min(
      candidates.length - 1,
      Math.max(0, Math.floor(random() * candidates.length)),
    )
  ];
}
function renderFxChoices(slotId) {
  const choices = customFxVariants[slotId] || [],
    count = choices.length + (customFxBuffers[slotId] ? 1 : 0);
  return `<div class="cf-audio-choices"><button class="btn btn-sm" onclick="triggerUploadAudio('fx_${slotId}',true)">追加音效</button><span class="setting-note">${count ? count + " 个候选 · 每次随机播放" : "未上传 · 使用默认音效"}</span>${choices.length ? `<details><summary>管理候选音效</summary>${choices.map((x, i) => `<div class="cf-audio-choice"><span>${escapeHtml(x.name || "候选 " + (i + 1))}</span><button class="btn btn-sm" data-fx-remove="${escapeHtml(x.id)}" onclick="deleteFxCandidate(this.dataset.fxRemove)">移除</button></div>`).join("")}</details>` : ""}</div>`;
}
async function deleteFxCandidate(id) {
  if (!db || typeof id !== "string" || !id.includes("::variant::")) return;
  try {
    await new Promise((resolve, reject) => {
      const tx = db.transaction("sounds", "readwrite");
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
      tx.objectStore("sounds").delete(id);
    });
    const slot = id.slice(3, id.indexOf("::variant::"));
    customFxVariants[slot] = (customFxVariants[slot] || []).filter(
      (x) => x.id !== id,
    );
    soundIdCache.delete(id);
    renderFxSlotList();
    renderItemFxSoundListV26();
    showToast("候选音效已移除");
  } catch (error) {
    showToast("移除失败，原音效保留");
  }
}

function checkSetCompleteness(setIdx) {
  if (!db)
    return Promise.resolve({ isComplete: false, count: 0, hasCore: false });

  const doCheck = () => {
    const isMenuSet = setIdx === 8;
    const trackTypes = isMenuSet ? MENU_SET_TRACK_TYPES : SET_TRACK_TYPES;
    const prefix = isMenuSet ? "bgm_menu_" : `bgm_set_${setIdx}_`;

    let count = 0;
    let hasThinking = false;
    let hasBattle = false;

    for (const t of trackTypes) {
      const id = prefix + t.key;
      if (hasSound(id)) {
        count++;
        if (t.key === "thinking") hasThinking = true;
        if (t.key === "battle") hasBattle = true;
      }
    }

    return {
      isComplete: count === trackTypes.length,
      count,
      hasCore: hasThinking && hasBattle,
    };
  };

  if (soundIdCache.size === 0) {
    return refreshSoundIdCache().then(doCheck);
  }
  return Promise.resolve(doCheck());
}

async function getAllCompleteSetIndices() {
  const completeIndices = [];
  for (let i = 0; i < 8; i++) {
    const res = await checkSetCompleteness(i);
    if (res.isComplete) completeIndices.push(i);
  }
  return completeIndices;
}

async function getFallbackSetIndex() {
  for (let i = 0; i < 8; i++) {
    const res = await checkSetCompleteness(i);
    if (res.hasCore) return i;
  }
  return -1;
}

async function pickNextPlayableSetIndex() {
  const completeSets = await getAllCompleteSetIndices();
  if (completeSets.length > 0) {
    bgmShufflePool = bgmShufflePool.filter((idx) => completeSets.includes(idx));
    if (bgmShufflePool.length === 0) {
      bgmShufflePool = [...completeSets];
      for (let i = bgmShufflePool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bgmShufflePool[i], bgmShufflePool[j]] = [
          bgmShufflePool[j],
          bgmShufflePool[i],
        ];
      }
    }
    return { setIndex: bgmShufflePool.shift(), isFallback: false };
  }

  const fallbackIdx = await getFallbackSetIndex();
  if (fallbackIdx !== -1) {
    return { setIndex: fallbackIdx, isFallback: true };
  }

  return { setIndex: -1, isFallback: false };
}

async function fetchAndDecodeSetBuffers(setIdx, onProgress) {
  if (setIdx < 0 || !db) return {};

  try {
    const rawDict = await new Promise((resolve) => {
      const tx = db.transaction("sounds", "readonly");
      const store = tx.objectStore("sounds");
      const dict = {};
      let pending = SET_TRACK_TYPES.length;

      if (pending === 0) {
        resolve(dict);
        return;
      }

      SET_TRACK_TYPES.forEach((t) => {
        const id = `bgm_set_${setIdx}_${t.key}`;
        const req = store.get(id);
        req.onsuccess = () => {
          if (req.result && req.result.arrayBuffer)
            dict[t.key] = req.result.arrayBuffer;
          pending--;
          if (pending === 0) resolve(dict);
        };
        req.onerror = () => {
          pending--;
          if (pending === 0) resolve(dict);
        };
      });
    });

    const ctx = await getAudioContext();
    const entries = Object.entries(rawDict);
    const total = entries.length;

    if (total === 0) {
      if (onProgress) onProgress(80);
      return {};
    }

    let loadedCount = 0;
    const buffers = {};

    await Promise.all(
      entries.map(async ([key, ab]) => {
        try {
          buffers[key] = await ctx.decodeAudioData(ab.slice(0));
        } catch (_) {
        } finally {
          loadedCount++;
          if (onProgress)
            onProgress(Math.round(30 + (loadedCount / total) * 50));
        }
      }),
    );

    return buffers;
  } catch (_) {
    return {};
  }
}

async function bgmPreloadNextSet() {
  if (bgmEngine.isPreloading) return;
  bgmEngine.isPreloading = true;

  try {
    const { setIndex, isFallback } = await pickNextPlayableSetIndex();
    if (setIndex !== -1) {
      const buffers = await fetchAndDecodeSetBuffers(setIndex);
      bgmEngine.preloadedSet = { setIndex, isFallback, buffers };
    }
  } catch (e) {
  } finally {
    bgmEngine.isPreloading = false;
  }
}
