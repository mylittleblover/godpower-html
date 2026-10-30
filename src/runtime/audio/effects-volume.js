/* ===== V2.17.6：独立音效音量 =====
   音频链路：
   BGM --------------> masterGain -> 输出
   音效 -> fxGain ----> masterGain -> 输出
   因此“主音量”仍控制全部声音，而“音效音量”只控制音效。 */

if (!Number.isFinite(Number(state.sfxVolume))) {
  state.sfxVolume = parseFloat(STORAGE.get("politics_sfx_volume", "1"));
}
state.sfxVolume = Math.max(0, Math.min(1, Number(state.sfxVolume) || 0));

let fxGainNodeV2176 = null;

function getFxOutputV2176() {
  if (!audioCtx || !masterGainNode) return masterGainNode;

  if (!fxGainNodeV2176) {
    fxGainNodeV2176 = audioCtx.createGain();
    fxGainNodeV2176.gain.setValueAtTime(state.sfxVolume, audioCtx.currentTime);
    fxGainNodeV2176.connect(masterGainNode);
  }
  return fxGainNodeV2176;
}

function updateSfxVolumeV2176(vol) {
  state.sfxVolume = Math.max(0, Math.min(1, parseFloat(vol) || 0));

  const label = document.getElementById("sfxVolLabelV2176");
  if (label) label.textContent = `${Math.round(state.sfxVolume * 100)}%`;

  if (audioCtx && masterGainNode) {
    const node = getFxOutputV2176();
    if (node) {
      const now = audioCtx.currentTime;
      try {
        node.gain.cancelScheduledValues(now);
        node.gain.setValueAtTime(state.sfxVolume, now);
      } catch (e) {}
    }
  }

  STORAGE.set("politics_sfx_volume", state.sfxVolume);
}

/* 在“音效与音乐”页中，紧跟主音量增加独立音效音量。 */
function installSfxVolumeSliderV2176() {
  const pane = document.getElementById("settingsV26_sound");
  if (!pane || document.getElementById("cfgSfxVolumeV2176")) return;

  const master = document.getElementById("cfgMasterVolume");
  const masterRow = master?.closest(".setting-item");

  const row = document.createElement("div");
  row.className = "setting-item";
  row.id = "sfxVolumeRowV2176";
  row.innerHTML = `
    <span class="setting-label">
      音效音量
      (<span id="sfxVolLabelV2176">${Math.round(state.sfxVolume * 100)}%</span>)
    </span>
    <input
      type="range"
      id="cfgSfxVolumeV2176"
      min="0"
      max="1"
      step="0.05"
      value="${state.sfxVolume}"
      style="width:160px;"
      oninput="updateSfxVolumeV2176(this.value)"
    >
  `;

  if (masterRow && masterRow.parentNode === pane) {
    masterRow.insertAdjacentElement("afterend", row);
  } else {
    pane.prepend(row);
  }
}

/* 设置同步时也同步独立音效音量。 */
const _v2176SyncSettingsControls = syncSettingsControls;
syncSettingsControls = function (...args) {
  const r = _v2176SyncSettingsControls.apply(this, args);
  installSfxVolumeSliderV2176();

  const slider = document.getElementById("cfgSfxVolumeV2176");
  const label = document.getElementById("sfxVolLabelV2176");
  if (slider) slider.value = state.sfxVolume;
  if (label) label.textContent = `${Math.round(state.sfxVolume * 100)}%`;

  return r;
};

/* 设置页被重新组织后，确保滑条仍然存在。 */
if (typeof rebuildSettingsV26 === "function") {
  const _v2176RebuildSettingsV26 = rebuildSettingsV26;
  rebuildSettingsV26 = function (...args) {
    const r = _v2176RebuildSettingsV26.apply(this, args);
    setTimeout(installSfxVolumeSliderV2176, 0);
    return r;
  };
}

if (typeof showSettingsV26 === "function") {
  const _v2176ShowSettingsV26 = showSettingsV26;
  showSettingsV26 = function (which, ...args) {
    const r = _v2176ShowSettingsV26.call(this, which, ...args);
    if (which === "sound") setTimeout(installSfxVolumeSliderV2176, 0);
    return r;
  };
}

/* saveState 继续保存旧数据，同时补存音效音量。 */
if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    () => setTimeout(installSfxVolumeSliderV2176, 450),
    { once: true },
  );
} else {
  setTimeout(installSfxVolumeSliderV2176, 0);
}
