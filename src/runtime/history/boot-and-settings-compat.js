const V26_HISTORY_KEY = "politics_history_stack_v26";

try {
  const hs = STORAGE.getJSON(V26_HISTORY_KEY, []);
  if (Array.isArray(hs) && hs.length) historyStack = hs.slice(-MAX_HISTORY);
} catch (e) {}

window.addEventListener("pagehide", () => {
  if (globalThis.SaveManager?.enabled()) return;
  try {
    saveState();
    persistHistoryV26();
  } catch (e) {}
});
document.addEventListener("visibilitychange", () => {
  if (
    document.visibilityState === "hidden" &&
    !globalThis.SaveManager?.enabled()
  ) {
    try {
      saveState();
      persistHistoryV26();
    } catch (e) {}
  }
});

/* 2. 菜单音乐参数按样本固定，移除工程台 */
Object.assign(menuCfg, {
  bpm: 103,
  beatsPerBar: 4,
  loopStartBeat: 24,
  loopEndBeat: 192,
  transitionLeadBeats: 0,
  battleBaseBpm: 130,
  battleSet8Bpm: 135,
  battleTransitionLeadBeats: 0,
});
saveMenuCfg();
function removeBgmEngineeringConsoleV26() {
  document.getElementById("bgmEngineConsole")?.remove();
  document
    .querySelectorAll("#view-settings .setting-section-title")
    .forEach((x) => {
      if (x.textContent.includes("音乐设置")) x.remove();
    });
}

/* 3. 道具功能音效 */
