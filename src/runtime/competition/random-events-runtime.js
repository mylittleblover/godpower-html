/* Runtime bridge for deterministic random event state and persisted teacher rules config. */
(function installRandomEventsRuntime(root) {
  "use strict";
  const CONFIG_KEY = "politics_random_event_config_v1";

  function generateSeed() {
    try {
      if (root.crypto?.getRandomValues) {
        const buf = new Uint32Array(1);
        root.crypto.getRandomValues(buf);
        if (buf[0] !== 0) return buf[0];
      }
    } catch (_) {}
    return ((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0) || 0x5a0072f6;
  }

  function loadStoredConfig() {
    if (typeof root.RandomEvents === "undefined") return null;
    try {
      const raw =
        typeof root.STORAGE?.getJSON === "function"
          ? root.STORAGE.getJSON(CONFIG_KEY, null)
          : null;
      return root.RandomEvents.normalizeConfig(raw);
    } catch (_) {
      return root.RandomEvents.defaultConfig();
    }
  }

  function ensureRandomEventState() {
    if (typeof root.RandomEvents === "undefined" || typeof state === "undefined")
      return null;
    if (!state.randomEventConfig || typeof state.randomEventConfig !== "object")
      state.randomEventConfig = loadStoredConfig() || root.RandomEvents.defaultConfig();
    else
      state.randomEventConfig = root.RandomEvents.normalizeConfig(
        state.randomEventConfig,
      );
    if (!state.randomEvents || typeof state.randomEvents !== "object")
      state.randomEvents = root.RandomEvents.createState({
        seed: generateSeed(),
        config: state.randomEventConfig,
      });
    else
      state.randomEvents = root.RandomEvents.normalizeState(
        state.randomEvents,
        state.randomEventConfig,
      );
    return state.randomEvents;
  }

  function resetRandomEventSeason() {
    if (typeof root.RandomEvents === "undefined" || typeof state === "undefined")
      return null;
    state.randomEventConfig = root.RandomEvents.normalizeConfig(
      state.randomEventConfig || loadStoredConfig(),
    );
    state.randomEvents = root.RandomEvents.createState({
      seed: generateSeed(),
      config: state.randomEventConfig,
    });
    return state.randomEvents;
  }

  function updateRandomEventConfig(mutatorOrPatch) {
    if (typeof root.RandomEvents === "undefined" || typeof state === "undefined")
      return null;
    const current = root.RandomEvents.normalizeConfig(
      state.randomEventConfig || loadStoredConfig(),
    );
    const nextRaw =
      typeof mutatorOrPatch === "function"
        ? mutatorOrPatch(JSON.parse(JSON.stringify(current)))
        : { ...current, ...(mutatorOrPatch || {}) };
    const nextConfig = root.RandomEvents.normalizeConfig(nextRaw);
    state.randomEventConfig = nextConfig;
    try {
      if (typeof root.STORAGE?.setJSON === "function")
        root.STORAGE.setJSON(CONFIG_KEY, nextConfig);
    } catch (_) {}
    if (typeof state.randomEvents === "object" && state.randomEvents)
      state.randomEvents = root.RandomEvents.normalizeState(
        state.randomEvents,
        nextConfig,
      );
    else ensureRandomEventState();
    if (typeof saveState === "function" && root.classroomReady) saveState();
    root.RandomEventUI?.renderBattleStrip?.();
    root.RandomEventUI?.syncSettingsControls?.();
    return nextConfig;
  }

  root.ensureRandomEventState = ensureRandomEventState;
  root.resetRandomEventSeason = resetRandomEventSeason;
  root.updateRandomEventConfig = updateRandomEventConfig;
})(globalThis);
