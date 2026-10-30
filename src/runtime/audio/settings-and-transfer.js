function openSoundSettings() {
  if (state.isLocked) {
    themeAlert("这按钮不是普通人类权限。先解锁上帝模式。");
    openPwdModal();
    return;
  }
  syncSettingsControls();
  renderBgmSlotList();
  renderFxSlotList();
  renderBgmEngineConsole();
  switchView("settings");
}

function closeSoundModal() {
  switchView("battle");
}

function syncSettingsControls() {
  document.getElementById("cfgResizerEnabled").checked = state.resizerEnabled;
  document.getElementById("cfgSaveAllIn").checked = state.saveAllIn;
  document.getElementById("cfgColumnMode").value = state.columnMode;
  document.getElementById("cfgBgmVolume").value = bgmVolume;
  document.getElementById("bgmVolLabel").textContent =
    `${Math.round(bgmVolume * 100)}%`;
  document.getElementById("cfgMasterVolume").value = state.masterVolume;
  document.getElementById("volLabel").innerText =
    `${Math.round(state.masterVolume * 100)}%`;
  const summaryText = state.groups
    .map((g) => `${g.name}: ${(g.members || []).join(", ")}`)
    .join("\n");
  document.getElementById("settingsBatchMemberText").value = summaryText;
}

function updateMasterVolume(vol) {
  state.masterVolume = parseFloat(vol);
  document.getElementById("volLabel").innerText =
    `${Math.round(state.masterVolume * 100)}%`;
  if (masterGainNode && audioCtx) {
    masterGainNode.gain.setValueAtTime(
      state.masterVolume,
      audioCtx.currentTime,
    );
  }
  saveState();
}

function updateBgmVolume(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return false;
  bgmVolume = Math.max(0, Math.min(1, parsed));
  document.getElementById("cfgBgmVolume").value = bgmVolume;
  document.getElementById("bgmVolLabel").textContent =
    `${Math.round(bgmVolume * 100)}%`;
  if (musicGainNode && audioCtx)
    musicGainNode.gain.setTargetAtTime(bgmVolume, audioCtx.currentTime, 0.025);
  if (!STORAGE.set("politics_bgm_volume", bgmVolume))
    showToast("音乐音量仅在本次生效，偏好保存失败");
  return true;
}

let bgmSlotRenderGeneration = 0;
async function renderBgmSlotList() {
  const container = document.getElementById("bgmListContainer");
  if (!container) return;
  const generation = ++bgmSlotRenderGeneration;
  const setIdx = parseInt(document.getElementById("cfgSetSelector").value, 10);
  const isMenuSet = setIdx === 8;
  const trackTypes = isMenuSet ? MENU_SET_TRACK_TYPES : SET_TRACK_TYPES;
  container.innerHTML = "";

  const bpmDesc = document.getElementById("cfgSetBpmDesc");
  if (bpmDesc) {
    if (isMenuSet) {
      bpmDesc.innerText = `菜单配乐套：BPM ${Number(menuCfg.bpm) || 130} · ${menuCfg.beatsPerBar}/4 拍 · 循环: 第 ${menuCfg.loopStartBeat} 拍 至 第 ${menuCfg.loopEndBeat} 拍`;
    } else {
      const effBpm =
        setIdx === 7
          ? Number(menuCfg.battleSet8Bpm) || 135
          : Number(menuCfg.battleBaseBpm) || 130;
      bpmDesc.innerText = `BPM ${effBpm} · 4/4 拍 · 循环: 第 9 拍 至 第 184 拍 (无尾音)`;
    }
  }

  await refreshSoundIdCache();
  const { isComplete, count } = await checkSetCompleteness(setIdx);

  const currentIdxAfter = parseInt(
    document.getElementById("cfgSetSelector").value,
    10,
  );
  if (generation !== bgmSlotRenderGeneration || currentIdxAfter !== setIdx)
    return;

  const compLabel = document.getElementById("cfgSetCompleteness");
  if (compLabel) {
    const total = trackTypes.length;
    compLabel.innerText = `${count} / ${total} 就绪 ${isComplete ? "(完整)" : "(未完整)"}`;
    compLabel.style.color = isComplete ? "#059669" : "#d97706";
  }

  try {
    for (const track of trackTypes) {
      const slotId = isMenuSet
        ? `bgm_menu_${track.key}`
        : `bgm_set_${setIdx}_${track.key}`;
      const isLoaded = hasSound(slotId);

      const row = document.createElement("div");
      row.className = "sound-row";
      row.innerHTML = `
        <div class="sound-desc">
          <div class="sound-name">${track.name}</div>
          <div class="sound-tag">${isLoaded ? "已载入音频" : track.desc}</div>
        </div>
        <div class="sound-controls">
          ${isLoaded ? `<button class="btn btn-sm" style="background:#e2e8f0; color:#1e293b;" data-sound-preview onclick="previewBgmTrack('${slotId}')">试听</button>` : ""}
          <button class="btn btn-sm btn-primary" onclick="triggerUploadAudio('${slotId}')">上传</button>
          ${isLoaded ? `<button class="btn btn-sm btn-danger" onclick="deleteBgmTrack('${slotId}')">清除</button>` : ""}
        </div>
      `;
      container.appendChild(row);
    }
  } catch (_) {}
}

function renderFxSlotList() {
  const fxContainer = document.getElementById("soundListContainer");
  if (!fxContainer) return;
  fxContainer.innerHTML = "";
  const categories = new Map();
  FX_SOUND_SLOTS.forEach((slot) => {
    const category =
      slot.category ||
      (["roll_tick", "roll_loop", "roll_win"].includes(slot.id)
        ? "点名过程与结果"
        : slot.id === "ui_click"
          ? "通用按钮默认音效"
          : "计分与比赛结果");
    if (!categories.has(category)) categories.set(category, []);
    categories.get(category).push(slot);
  });
  for (const [category, slots] of categories) {
    const section = document.createElement("details");
    section.className = "cf-sound-category";
    section.open = false;
    const summary = document.createElement("summary");
    summary.textContent = category + " · " + slots.length + " 个音效槽";
    section.append(summary);
    for (const slot of slots) {
      const isCustom =
        !!customFxBuffers[slot.id] || !!customFxVariants[slot.id]?.length;
      const row = document.createElement("div");
      row.className = "sound-row";
      row.dataset.soundId = slot.id;
      row.innerHTML = `<div class="sound-desc"><div class="sound-name">${escapeHtml(slot.name)}</div><div class="sound-tag">${isCustom ? "已加载外部音频" : escapeHtml(slot.desc)}</div></div><div class="sound-controls"><button class="btn btn-sm" data-sound-preview onclick="playSound('${slot.id}')">试听</button><button class="btn btn-sm btn-primary" onclick="triggerUploadAudio('fx_${slot.id}')">上传</button>${isCustom ? `<button class="btn btn-sm btn-danger" onclick="deleteFxTrack('fx_${slot.id}','${slot.id}')">还原</button>` : ""}</div>${renderFxChoices(slot.id)}`;
      section.append(row);
    }
    fxContainer.append(section);
  }
}

async function previewBgmTrack(slotId) {
  if (!db) return;
  try {
    const tx = db.transaction("sounds", "readonly");
    const store = tx.objectStore("sounds");
    const req = store.get(slotId);
    req.onsuccess = async () => {
      if (req.result && req.result.arrayBuffer) {
        const ctx = await getAudioContext();
        try {
          const decoded = await ctx.decodeAudioData(
            req.result.arrayBuffer.slice(0),
          );
          const src = ctx.createBufferSource();
          src.buffer = decoded;
          src.connect(musicGainNode);
          src.start(0);
        } catch (e) {}
      }
    };
  } catch (e) {}
}

function triggerUploadAudio(slotId, append = false) {
  currentUploadingGeneration++;
  currentUploadingSlot = slotId;
  currentUploadingAppend = append && slotId.startsWith("fx_");
  const input = document.getElementById("soundFileInput");
  input.multiple = slotId.startsWith("fx_");
  input.click();
}
function handleSoundFileUpload(event) {
  const files = Array.from(event.target.files || []),
    slotId = currentUploadingSlot,
    append = currentUploadingAppend,
    uploadGeneration = currentUploadingGeneration;
  if (!files.length || !slotId) return;
  const fxKey = slotId.startsWith("fx_") ? slotId.slice(3) : null;
  // First file replaces the primary unless explicitly appending; additional files are candidates.
  return Promise.all(
    files.map(
      (file, index) =>
        new Promise((resolve) => {
          const candidate = !!fxKey && (append || index > 0),
            key = candidate
              ? slotId + "::variant::" + crypto.randomUUID()
              : slotId;
          const reader = new FileReader();
          reader.onerror = () => {
            showToast("音频文件读取失败，原音频保留");
            resolve(false);
          };
          reader.onload = async function (e) {
            let decoded;
            try {
              const ctx = await getAudioContext();
              decoded = await ctx.decodeAudioData(e.target.result.slice(0));
            } catch (error) {
              themeAlert("解析失败，请确保格式为 MP3/WAV");
              resolve(false);
              return;
            }
            if (fxKey) {
              if (candidate)
                (customFxVariants[fxKey] ||= []).push({
                  id: key,
                  name: file.name || "候选音效",
                  buffer: decoded,
                });
              else customFxBuffers[fxKey] = decoded;
            }
            let saved = false;
            try {
              if (!db) throw Error("浏览器音频存储不可用");
              await new Promise((done, reject) => {
                const tx = db.transaction("sounds", "readwrite");
                tx.oncomplete = done;
                tx.onerror = () => reject(tx.error || Error("音频保存失败"));
                tx.onabort = () => reject(tx.error || Error("音频保存中止"));
                tx.objectStore("sounds").put({
                  id: key,
                  name: file.name || "",
                  arrayBuffer: e.target.result,
                });
              });
              soundIdCache.add(key);
              saved = true;
            } catch (error) {
              showToast(
                fxKey
                  ? "音效仅在本页生效，未保存：" + error.message
                  : "音频未保存，原已保存文件保留：" + error.message,
              );
            }
            bgmEngine.preloadedSet = null;
            bgmShufflePool = [];
            if (saved)
              showToast(
                candidate ? "候选音效已追加，播放时随机选择" : "音频已保存",
              );
            renderBgmSlotList();
            renderFxSlotList();
            renderItemFxSoundListV26();
            resolve(saved);
          };
          reader.readAsArrayBuffer(file);
        }),
    ),
  ).finally(() => {
    if (uploadGeneration === currentUploadingGeneration) {
      event.target.value = "";
      currentUploadingAppend = false;
    }
  });
}

function deleteBgmTrack(slotId) {
  if (!db) return;
  try {
    const tx = db.transaction("sounds", "readwrite");
    const store = tx.objectStore("sounds");
    store.delete(slotId);
    soundIdCache.delete(slotId);
    bgmEngine.preloadedSet = null;
    bgmShufflePool = [];
    showToast("已清除");
    renderBgmSlotList();
  } catch (e) {}
}

async function deleteFxTrack(idbKey, fxKey) {
  if (!db) return;
  try {
    await new Promise((resolve, reject) => {
      const tx = db.transaction("sounds", "readwrite"),
        store = tx.objectStore("sounds");
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
      const req = store.getAllKeys();
      req.onsuccess = () =>
        req.result
          .filter(
            (key) =>
              key === idbKey || String(key).startsWith(idbKey + "::variant::"),
          )
          .forEach((key) => store.delete(key));
    });
    for (const key of [...soundIdCache])
      if (key === idbKey || key.startsWith(idbKey + "::variant::"))
        soundIdCache.delete(key);
    delete customFxBuffers[fxKey];
    delete customFxVariants[fxKey];
    showToast("已还原全部候选音效");
    renderFxSlotList();
    renderItemFxSoundListV26();
  } catch (error) {
    showToast("还原失败，原音效保留");
  }
}

async function exportAudioBundle() {
  if (!db) return;
  showToast("正在打包音频...");

  try {
    const tx = db.transaction("sounds", "readonly");
    const store = tx.objectStore("sounds");
    const allRecords = await new Promise((resolve) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });

    if (allRecords.length === 0) {
      themeAlert("没有音频可导出");
      return;
    }

    let currentOffset = 0;
    const fileIndex = [];
    const audioBuffersToPack = [];

    for (const record of allRecords) {
      const ab = record.arrayBuffer;
      fileIndex.push({
        id: record.id,
        name: record.name || "",
        offset: currentOffset,
        length: ab.byteLength,
      });
      audioBuffersToPack.push(ab);
      currentOffset += ab.byteLength;
    }

    const indexBytes = new TextEncoder().encode(JSON.stringify(fileIndex));
    const headerBuffer = new ArrayBuffer(8);
    const headerView = new DataView(headerBuffer);
    headerView.setUint8(0, 0x42);
    headerView.setUint8(1, 0x47);
    headerView.setUint8(2, 0x4d);
    headerView.setUint8(3, 0x50);
    headerView.setUint32(4, indexBytes.byteLength, true);

    const bundleBlob = new Blob(
      [headerBuffer, indexBytes, ...audioBuffersToPack],
      { type: "application/octet-stream" },
    );
    const downloadUrl = URL.createObjectURL(bundleBlob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `政治课堂音频包_${allRecords.length}轨.bin`;
    a.click();
    URL.revokeObjectURL(downloadUrl);
    showToast("打包导出成功");
  } catch (e) {
    themeAlert("导出失败");
  }
}

function triggerImportAudioBundle() {
  if (state.isLocked) {
    openPwdModal();
    return;
  }
  document.getElementById("bundleFileInput").click();
}

function handleBundleFilePicked(event) {
  const file = event.target.files[0];
  if (!file) return;
  showToast("正在导入音频包...");

  const reader = new FileReader();
  reader.onload = async function (e) {
    try {
      const fullBuffer = e.target.result;
      const dataView = new DataView(fullBuffer);
      if (dataView.getUint8(0) !== 0x42 || dataView.getUint8(1) !== 0x47) {
        themeAlert("非法音频包文件");
        return;
      }

      const indexLength = dataView.getUint32(4, true);
      const fileIndex = JSON.parse(
        new TextDecoder().decode(new Uint8Array(fullBuffer, 8, indexLength)),
      );
      const binaryStart = 8 + indexLength;

      const tx = db.transaction("sounds", "readwrite");
      const store = tx.objectStore("sounds");

      fileIndex.forEach((item) => {
        store.put({
          id: item.id,
          name: item.name || "",
          arrayBuffer: fullBuffer.slice(
            binaryStart + item.offset,
            binaryStart + item.offset + item.length,
          ),
        });
      });

      tx.oncomplete = async () => {
        await refreshSoundIdCache();
        fxSoundsLoaded = false;
        bgmEngine.preloadedSet = null;
        bgmShufflePool = [];
        await loadFxSounds();
        renderBgmSlotList();
        renderFxSlotList();
        renderItemFxSoundListV26();
        showToast("音频包导入成功");
      };
    } catch (err) {
      themeAlert("导入失败");
    }
    event.target.value = "";
  };
  reader.readAsArrayBuffer(file);
}
