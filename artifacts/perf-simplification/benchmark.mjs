import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

if (!process.env.CHROMIUM_PATH) {
  const defaultEdge =
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  if (fs.existsSync(defaultEdge)) process.env.CHROMIUM_PATH = defaultEdge;
}

import {
  launch,
  dismissStartup,
  setup,
} from "../../tests/fixtures/browser.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const distPath = path.join(repoRoot, "dist/godpower.html");
const manifestPath = path.join(repoRoot, "src/manifest.json");
const outArg = process.argv.find((a) => a.startsWith("--out="));
const outPath = path.resolve(
  __dirname,
  outArg ? outArg.slice(6) : "baseline.json",
);

function stats(samples) {
  if (!samples.length)
    return { n: 0, min: 0, median: 0, mean: 0, p95: 0, max: 0, stddev: 0 };
  const sorted = [...samples].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = sorted.reduce((a, b) => a + b, 0) / n;
  const median =
    n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
  const p95Idx = Math.min(n - 1, Math.ceil(n * 0.95) - 1);
  const variance = sorted.reduce((acc, x) => acc + (x - mean) ** 2, 0) / n;
  const round = (v) => Number(v.toFixed(3));
  return {
    n,
    min: round(sorted[0]),
    median: round(median),
    mean: round(mean),
    p95: round(sorted[p95Idx]),
    max: round(sorted[n - 1]),
    stddev: round(Math.sqrt(variance)),
  };
}

function collectBundleMetrics() {
  const html = fs.readFileSync(distPath, "utf8");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const styles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi)];
  const scripts = [
    ...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi),
  ];
  const dataUris = [
    ...html.matchAll(
      /data:[a-zA-Z0-9.+/-]+(?:;[a-zA-Z0-9=.+-]+)*;base64,[a-zA-Z0-9+/=\s]+/g,
    ),
  ];

  let srcLogicScriptBytes = 0;
  let srcResourceScriptBytes = 0;
  let srcStyleBytes = 0;
  let scriptFileCount = 0;
  let styleFileCount = 0;
  const largestSourceFiles = [];

  for (const b of manifest.blocks) {
    const full = path.join(repoRoot, "src", b.path);
    const bytes = fs.statSync(full).size;
    if (b.type === "style") {
      srcStyleBytes += bytes;
      styleFileCount++;
    } else if (b.type === "script") {
      scriptFileCount++;
      if (
        b.path.startsWith("resources/") ||
        b.path === "ui/component-catalog.js"
      ) {
        srcResourceScriptBytes += bytes;
      } else {
        srcLogicScriptBytes += bytes;
      }
      largestSourceFiles.push({ path: "src/" + b.path, bytes });
    }
  }
  largestSourceFiles.sort((a, b) => b.bytes - a.bytes);

  return {
    distHtmlBytes: fs.statSync(distPath).size,
    styleBlockCount: styles.length,
    styleFileCount,
    totalStyleBytes: styles.reduce(
      (a, m) => a + Buffer.byteLength(m[1], "utf8"),
      0,
    ),
    srcStyleBytes,
    scriptBlockCount: scripts.length,
    scriptFileCount,
    totalScriptBytes: scripts.reduce(
      (a, m) => a + Buffer.byteLength(m[1], "utf8"),
      0,
    ),
    srcLogicScriptBytes,
    srcResourceAndCatalogScriptBytes: srcResourceScriptBytes,
    embeddedDataUriCount: dataUris.length,
    embeddedDataUriBytes: dataUris.reduce(
      (a, m) => a + Buffer.byteLength(m[0], "utf8"),
      0,
    ),
    topScriptBlocks: largestSourceFiles.slice(0, 12),
  };
}

const INIT_PROBE_SCRIPT = `(() => {
  const activeIntervals = new Set();
  const activeTimeouts = new Set();
  let windowIntervalCallbacks = 0;
  let windowTimeoutCallbacks = 0;
  let windowRafCallbacks = 0;
  const longTasks = [];

  try {
    const obs = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        longTasks.push({
          name: entry.name || "self",
          startTime: Number(entry.startTime.toFixed(2)),
          duration: Number(entry.duration.toFixed(2)),
        });
      }
    });
    obs.observe({ type: "longtask", buffered: true });
  } catch {}

  const origSetInterval = window.setInterval.bind(window);
  const origClearInterval = window.clearInterval.bind(window);
  const origSetTimeout = window.setTimeout.bind(window);
  const origClearTimeout = window.clearTimeout.bind(window);
  const origRaf = window.requestAnimationFrame.bind(window);

  window.setInterval = function (fn, delay, ...args) {
    if (typeof fn !== "function") {
      const id = origSetInterval(fn, delay, ...args);
      activeIntervals.add(id);
      return id;
    }
    let id;
    const wrapped = function (...cbArgs) {
      windowIntervalCallbacks++;
      return fn.apply(this, cbArgs);
    };
    id = origSetInterval(wrapped, delay, ...args);
    activeIntervals.add(id);
    return id;
  };
  window.clearInterval = function (id) {
    activeIntervals.delete(id);
    return origClearInterval(id);
  };
  window.setTimeout = function (fn, delay, ...args) {
    if (typeof fn !== "function") {
      const id = origSetTimeout(fn, delay, ...args);
      activeTimeouts.add(id);
      return id;
    }
    let id;
    const wrapped = function (...cbArgs) {
      activeTimeouts.delete(id);
      windowTimeoutCallbacks++;
      return fn.apply(this, cbArgs);
    };
    id = origSetTimeout(wrapped, delay, ...args);
    activeTimeouts.add(id);
    return id;
  };
  window.clearTimeout = function (id) {
    activeTimeouts.delete(id);
    return origClearTimeout(id);
  };
  window.requestAnimationFrame = function (fn) {
    return origRaf(function (ts) {
      windowRafCallbacks++;
      return fn(ts);
    });
  };

  window.__perfProbe = {
    resetWindowCounters() {
      windowIntervalCallbacks = 0;
      windowTimeoutCallbacks = 0;
      windowRafCallbacks = 0;
      longTasks.length = 0;
    },
    snapshot() {
      return {
        activeIntervals: activeIntervals.size,
        activeTimeouts: activeTimeouts.size,
        windowIntervalCallbacks,
        windowTimeoutCallbacks,
        windowRafCallbacks,
        longTasksCount: longTasks.length,
        longTasksMaxMs: longTasks.length ? Math.max(...longTasks.map((t) => t.duration)) : 0,
        longTasksTotalMs: Number(longTasks.reduce((a, t) => a + t.duration, 0).toFixed(2)),
        longTasks: longTasks.slice(-20),
      };
    },
  };
})();`;

async function measureStartup(browser, runs = 5) {
  const gotoMs = [];
  const saveReadyMs = [];
  const startupInteractiveMs = [];
  const dclMs = [];
  const loadMs = [];
  const fcpMs = [];
  const jsHeapMB = [];

  for (let i = 0; i < runs; i++) {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.addInitScript(INIT_PROBE_SCRIPT);
    const url = "file:///" + distPath.replace(/\\/g, "/");
    const t0 = performance.now();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    const tGoto = performance.now() - t0;
    await page.waitForFunction(
      () =>
        window.SaveManager &&
        typeof window.SaveManager.ready === "function" &&
        window.classroomReady === true,
      { timeout: 15000 },
    );
    await page.evaluate(async () => {
      await window.SaveManager.ready();
      await new Promise((r) =>
        requestAnimationFrame(() => requestAnimationFrame(r)),
      );
    });
    const tReady = performance.now() - t0;

    const timing = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0];
      const paint = performance.getEntriesByName("first-contentful-paint")[0];
      return {
        dcl: nav ? nav.domContentLoadedEventEnd - nav.startTime : 0,
        load: nav ? nav.loadEventEnd - nav.startTime : 0,
        fcp: paint ? paint.startTime : 0,
        heap: performance.memory
          ? performance.memory.usedJSHeapSize / (1024 * 1024)
          : 0,
      };
    });

    gotoMs.push(tGoto);
    saveReadyMs.push(tReady);
    startupInteractiveMs.push(tReady);
    dclMs.push(timing.dcl);
    loadMs.push(timing.load);
    if (timing.fcp > 0) fcpMs.push(timing.fcp);
    if (timing.heap > 0) jsHeapMB.push(timing.heap);

    await context.close();
  }

  return {
    runs,
    domContentLoadedWaitMs: stats(gotoMs),
    saveReadyAndFirstFrameMs: stats(startupInteractiveMs),
    navDomContentLoadedEventEndMs: stats(dclMs),
    navLoadEventEndMs: stats(loadMs),
    firstContentfulPaintMs: stats(fcpMs),
    initialJsHeapMB: stats(jsHeapMB),
  };
}

async function getCdpMetricsMap(cdp) {
  const { metrics } = await cdp.send("Performance.getMetrics");
  return Object.fromEntries(metrics.map((m) => [m.name, m.value]));
}

function diffCdp(before, after) {
  const num = (k) => Number(((after[k] || 0) - (before[k] || 0)).toFixed(6));
  return {
    layoutCount: Math.round(num("LayoutCount")),
    layoutDurationMs: Number((num("LayoutDuration") * 1000).toFixed(3)),
    recalcStyleCount: Math.round(num("RecalcStyleCount")),
    recalcStyleDurationMs: Number(
      (num("RecalcStyleDuration") * 1000).toFixed(3),
    ),
    scriptDurationMs: Number((num("ScriptDuration") * 1000).toFixed(3)),
    taskDurationMs: Number((num("TaskDuration") * 1000).toFixed(3)),
    nodesAfter: after.Nodes || 0,
    jsHeapUsedMB: Number(
      ((after.JSHeapUsedSize || 0) / (1024 * 1024)).toFixed(2),
    ),
  };
}

async function seed14Groups30History(page) {
  return page.evaluate(async () => {
    const avatarPool =
      typeof AvatarPresetCatalog !== "undefined" &&
      Array.isArray(AvatarPresetCatalog.items)
        ? AvatarPresetCatalog.items.map((a) => a.dataUrl).filter(Boolean)
        : [];
    const fallbackSvg = (idx) =>
      "data:image/svg+xml;base64," +
      btoa(
        `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><circle cx="32" cy="32" r="30" fill="#0f766e"/><text x="32" y="38" text-anchor="middle" fill="#fff" font-size="22">G${idx}</text></svg>`,
      );

    const itemKeys = Object.keys(
      typeof ITEM_DEFS !== "undefined" ? ITEM_DEFS : {},
    ).filter((k) => {
      if (k === "item_box") return false;
      try {
        return !!ItemModules?.inventory(k);
      } catch {
        return false;
      }
    });
    const fallbackItemKeys = ["green", "red", "banana", "mushroom"];
    const poolKeys = itemKeys.length ? itemKeys : fallbackItemKeys;
    const negStatuses = ["burn", "freeze", "stun", "poison", "paralysis"];
    const defTypes = ["star", "mega", "power"];

    const seededRosterStudents = [];
    const seededRosterGroups = [];
    const seededAssignments = [];

    for (let i = 0; i < state.groups.length; i++) {
      const g = state.groups[i];
      g.score = 15 + ((i * 7) % 85);
      g.displayScore = g.score;
      g.avatarDataUrl = avatarPool.length
        ? avatarPool[i % avatarPool.length]
        : fallbackSvg(i + 1);
      g.inventory = [];
      for (let slot = 0; slot < 3; slot++) {
        const key = poolKeys[(i * 3 + slot) % poolKeys.length];
        if (window.ItemModules?.inventory) {
          g.inventory.push(ItemModules.inventory(key));
        } else {
          g.inventory.push({ key, uid: `seed-${i}-${slot}` });
        }
      }
      g.competitionEffects = {};
      if (i % 3 === 0) {
        g.itemEffect = {
          type: defTypes[i % defTypes.length],
          roundsLeft: 2,
          startedAt: Date.now(),
        };
      } else {
        g.itemEffect = null;
        if (i % 2 === 1) {
          const st = negStatuses[i % negStatuses.length];
          if (window.CompetitionEffects?.apply) CompetitionEffects.apply(g, st);
          else g.competitionEffects[st] = 2;
        }
      }
      if (i === 4 || i === 10) g.iceLock = 1;

      const s1 =
        typeof StableIdentity !== "undefined"
          ? StableIdentity.createStudentUid()
          : `student-seed-${i}-a`;
      const s2 =
        typeof StableIdentity !== "undefined"
          ? StableIdentity.createStudentUid()
          : `student-seed-${i}-b`;
      g.groupUid =
        typeof StableIdentity !== "undefined" &&
        StableIdentity.isValidGroupUid(g.groupUid)
          ? g.groupUid
          : typeof StableIdentity !== "undefined"
            ? StableIdentity.createGroupUid()
            : `group-seed-${i}`;
      const label1 = `${String(i * 2 + 1).padStart(2, "0")} 成员${i + 1}A`;
      const label2 = `${String(i * 2 + 2).padStart(2, "0")} 成员${i + 1}B`;
      g.members = [label1, label2];
      g.memberStudentUids = [s1, s2];
      seededRosterStudents.push(
        {
          studentUid: s1,
          displayName: `成员${i + 1}A`,
          number: String(i * 2 + 1).padStart(2, "0"),
          legacyLabel: label1,
          avatarResourceId: null,
        },
        {
          studentUid: s2,
          displayName: `成员${i + 1}B`,
          number: String(i * 2 + 2).padStart(2, "0"),
          legacyLabel: label2,
          avatarResourceId: null,
        },
      );
      seededRosterGroups.push({
        groupUid: g.groupUid,
        name: g.name,
        groupNo: g.groupNo || i + 1,
        avatarResourceId: null,
      });
      seededAssignments.push(
        { studentUid: s1, groupUid: g.groupUid },
        { studentUid: s2, groupUid: g.groupUid },
      );
    }

    state.rosterSnapshot = {
      revision: (state.rosterSnapshot?.revision || 0) + 1,
      groups: seededRosterGroups,
      students: seededRosterStudents,
      assignments: seededAssignments,
    };

    historyStack.length = 0;
    for (let h = 0; h < 30; h++) {
      state.groups[h % state.groups.length].score += h % 2 === 0 ? 1 : -1;
      state.groups[h % state.groups.length].displayScore =
        state.groups[h % state.groups.length].score;
      const snap = HistorySnapshots.capture(
        state,
        `Seed Round ${h + 1}`,
        `10:${String(h).padStart(2, "0")}:00`,
      );
      historyStack.push(snap);
    }

    if (typeof ClassroomFeedback !== "undefined") {
      ClassroomFeedback.cancel();
      ClassroomFeedback.setOptions(
        { pickEffects: false, scoreEffects: false },
        { persist: false },
      );
    }
    state.soundEnabled = false;

    if (typeof switchView === "function") switchView("battle");
    renderAll();
    if (window.SaveManager?.persist) {
      await SaveManager.persist("benchmark-seed", buildClassroomBackup());
    }
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r)),
    );

    return {
      groupCount: state.groups.length,
      historyCount: historyStack.length,
      rosterStudentCount: state.rosterSnapshot?.students?.length || 0,
      firstGroupInventoryLen: state.groups[0]?.inventory?.length || 0,
    };
  });
}

async function runBenchmarks() {
  const bundle = collectBundleMetrics();
  const browser = await launch();

  try {
    const startup = await measureStartup(browser, 5);

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.addInitScript(INIT_PROBE_SCRIPT);
    const cdp = await context.newCDPSession(page);
    await cdp.send("Performance.enable");

    await page.goto("file:///" + distPath.replace(/\\/g, "/"), {
      waitUntil: "load",
    });
    await page.waitForFunction(() => window.classroomReady === true, {
      timeout: 15000,
    });
    await setup(page, 14);
    const seedInfo = await seed14Groups30History(page);

    // Wait briefly so startup pending timers finish before measuring warm hot paths
    await page.waitForTimeout(450);

    // 1. Battle hot paths: renderAll, renderGrid, itemCommandSnapshot, scoreUpdate, SaveProjection + validateV2
    const battleCdpBefore = await getCdpMetricsMap(cdp);
    await page.evaluate(() => window.__perfProbe.resetWindowCounters());

    const battleResults = await page.evaluate(async () => {
      const rafWait = () => new Promise((r) => requestAnimationFrame(r));
      const runLoop = async (warmup, iterations, fn) => {
        const sync = [];
        const frame = [];
        for (let i = 0; i < warmup + iterations; i++) {
          const t0 = performance.now();
          await fn(i);
          const tSync = performance.now() - t0;
          await rafWait();
          const tFrame = performance.now() - t0;
          if (i >= warmup) {
            sync.push(tSync);
            frame.push(tFrame);
          }
        }
        return { sync, frame };
      };

      const renderAllSamples = await runLoop(5, 25, () => {
        renderAll();
      });

      const renderGridSamples = await runLoop(5, 25, () => {
        renderGrid();
      });

      const snapshotSamples = [];
      for (let i = 0; i < 5 + 25; i++) {
        const t0 = performance.now();
        itemCommandSnapshot();
        const dt = performance.now() - t0;
        if (i >= 5) snapshotSamples.push(dt);
      }

      const historyCaptureSamples = [];
      for (let i = 0; i < 5 + 25; i++) {
        const t0 = performance.now();
        HistorySnapshots.capture(state);
        const dt = performance.now() - t0;
        if (i >= 5) historyCaptureSamples.push(dt);
      }

      const scoreAndSnapshotSyncSamples = [];
      const scoreAndSnapshotFullSamples = [];
      const scoreAdjustOnlySamples = [];
      let scoreChangesObserved = 0;
      const g0 = state.groups[0];
      for (let i = 0; i < 5 + 25; i++) {
        const prevScore = g0.score;
        const delta = i % 2 === 0 ? 1 : -1;
        if (typeof classroomCommands?.whenIdle === "function")
          await classroomCommands.whenIdle();
        const t0 = performance.now();
        await ManualScoreCommands.adjust(g0.id, delta);
        const tAdjust = performance.now() - t0;
        itemCommandSnapshot();
        const tSyncAndSnap = performance.now() - t0;
        if (typeof classroomCommands?.whenIdle === "function")
          await classroomCommands.whenIdle();
        const tFull = performance.now() - t0;
        if (g0.score !== prevScore) scoreChangesObserved++;
        if (historyStack.length > 30) historyStack.length = 30;
        await rafWait();
        if (i >= 5) {
          scoreAdjustOnlySamples.push(tAdjust);
          scoreAndSnapshotSyncSamples.push(tSyncAndSnap);
          scoreAndSnapshotFullSamples.push(tFull);
        }
      }

      const saveProjTotalSamples = [];
      const saveProjOnlySamples = [];
      const validateV2Samples = [];
      const curDoc = SaveManager.snapshot();
      const rawPayload = buildClassroomBackup();
      for (let i = 0; i < 5 + 25; i++) {
        const t0 = performance.now();
        const projected = await SaveProjection.fromRuntime(curDoc, rawPayload);
        const tProj = performance.now() - t0;
        const tVal0 = performance.now();
        SaveSchema.validateV2(projected.document);
        const tVal = performance.now() - tVal0;
        const tTotal = performance.now() - t0;
        if (i >= 5) {
          saveProjOnlySamples.push(tProj);
          validateV2Samples.push(tVal);
          saveProjTotalSamples.push(tTotal);
        }
      }

      return {
        renderAllSamples,
        renderGridSamples,
        snapshotSamples,
        historyCaptureSamples,
        scoreAdjustOnlySamples,
        scoreAndSnapshotSyncSamples,
        scoreAndSnapshotFullSamples,
        scoreChangesObserved,
        saveProjOnlySamples,
        validateV2Samples,
        saveProjTotalSamples,
        probe: window.__perfProbe.snapshot(),
      };
    });

    const battleCdpAfter = await getCdpMetricsMap(cdp);

    // 2. Navigation across all 7 views + per-view DOM node & animation counts
    const views = [
      "welcome",
      "battle",
      "gameplay",
      "history",
      "archives",
      "ai",
      "settings",
    ];
    await page.evaluate(() => window.__perfProbe.resetWindowCounters());
    const navCdpBefore = await getCdpMetricsMap(cdp);

    const viewSwitchData = {
      perViewSync: Object.fromEntries(views.map((v) => [v, []])),
      perViewFrame: Object.fromEntries(views.map((v) => [v, []])),
      cycleSyncTotals: [],
      cycleFrameTotals: [],
      domByView: {},
    };

    const navCycles = 10;
    const navWarmup = 2;
    for (let c = 0; c < navWarmup + navCycles; c++) {
      let cycleSync = 0;
      let cycleFrame = 0;
      for (const v of views) {
        const res = await page.evaluate(async (viewName) => {
          const btn = document.querySelector(
            `.nav-tab[data-view="${viewName}"]`,
          );
          const t0 = performance.now();
          if (btn) btn.click();
          else switchView(viewName);
          const syncMs = performance.now() - t0;
          await new Promise((r) => requestAnimationFrame(r));
          const frameMs = performance.now() - t0;
          const viewEl = document.getElementById(`view-${viewName}`);
          return {
            syncMs,
            frameMs,
            totalNodes: document.querySelectorAll("*").length,
            viewNodes: viewEl ? viewEl.querySelectorAll("*").length : 0,
            animations: document.getAnimations
              ? document.getAnimations().length
              : 0,
          };
        }, v);
        if (c >= navWarmup) {
          viewSwitchData.perViewSync[v].push(res.syncMs);
          viewSwitchData.perViewFrame[v].push(res.frameMs);
          cycleSync += res.syncMs;
          cycleFrame += res.frameMs;
        }
        if (c === navWarmup) {
          viewSwitchData.domByView[v] = {
            totalNodes: res.totalNodes,
            viewNodes: res.viewNodes,
            animationsOnEnter: res.animations,
          };
        }
      }
      if (c >= navWarmup) {
        viewSwitchData.cycleSyncTotals.push(cycleSync);
        viewSwitchData.cycleFrameTotals.push(cycleFrame);
      }
    }
    const navCdpAfter = await getCdpMetricsMap(cdp);
    const navProbe = await page.evaluate(() => window.__perfProbe.snapshot());

    // 3. Gameplay 5 tabs
    await page.evaluate(async () => {
      document.querySelector('.nav-tab[data-view="gameplay"]')?.click();
      await new Promise((r) => requestAnimationFrame(r));
      window.__perfProbe.resetWindowCounters();
    });
    const gpCdpBefore = await getCdpMetricsMap(cdp);
    const gpTabs = ["items", "statuses", "events", "achievements", "rules"];
    const gameplayData = {
      perTabSync: Object.fromEntries(gpTabs.map((t) => [t, []])),
      perTabFrame: Object.fromEntries(gpTabs.map((t) => [t, []])),
      cycleFrameTotals: [],
    };
    for (let c = 0; c < 2 + 15; c++) {
      let sum = 0;
      for (const tab of gpTabs) {
        const res = await page.evaluate(async (tName) => {
          const btn = document.querySelector(`[data-gameplay-tab="${tName}"]`);
          const t0 = performance.now();
          btn?.click();
          const syncMs = performance.now() - t0;
          await new Promise((r) => requestAnimationFrame(r));
          const frameMs = performance.now() - t0;
          return { syncMs, frameMs };
        }, tab);
        if (c >= 2) {
          gameplayData.perTabSync[tab].push(res.syncMs);
          gameplayData.perTabFrame[tab].push(res.frameMs);
          sum += res.frameMs;
        }
      }
      if (c >= 2) gameplayData.cycleFrameTotals.push(sum);
    }
    const gpCdpAfter = await getCdpMetricsMap(cdp);

    // 4. Settings categories + ItemDrawSettings simulator updates
    await page.evaluate(async () => {
      document.querySelector('.nav-tab[data-view="settings"]')?.click();
      await new Promise((r) => requestAnimationFrame(r));
      window.__perfProbe.resetWindowCounters();
    });
    const settingsCats = await page.evaluate(() =>
      [...document.querySelectorAll("#view-settings [data-category]")].map(
        (el) => el.dataset.category,
      ),
    );
    const settingsCdpBefore = await getCdpMetricsMap(cdp);
    const settingsData = {
      categories: settingsCats,
      perCatSync: Object.fromEntries(settingsCats.map((c) => [c, []])),
      perCatFrame: Object.fromEntries(settingsCats.map((c) => [c, []])),
      cycleFrameTotals: [],
    };
    for (let c = 0; c < 2 + 10; c++) {
      let sum = 0;
      for (const cat of settingsCats) {
        const res = await page.evaluate(async (catId) => {
          const btn = document.querySelector(
            `#view-settings [data-category="${catId}"]`,
          );
          const t0 = performance.now();
          btn?.click();
          const syncMs = performance.now() - t0;
          await new Promise((r) => requestAnimationFrame(r));
          const frameMs = performance.now() - t0;
          return { syncMs, frameMs };
        }, cat);
        if (c >= 2) {
          settingsData.perCatSync[cat].push(res.syncMs);
          settingsData.perCatFrame[cat].push(res.frameMs);
          sum += res.frameMs;
        }
      }
      if (c >= 2) settingsData.cycleFrameTotals.push(sum);
    }
    const settingsCdpAfter = await getCdpMetricsMap(cdp);

    // ItemDrawSettings simulator updates inside Settings -> "items"
    await page.evaluate(async () => {
      document.querySelector('#view-settings [data-category="items"]')?.click();
      await new Promise((r) => requestAnimationFrame(r));
    });
    const simCdpBefore = await getCdpMetricsMap(cdp);
    const simSamples = await page.evaluate(async () => {
      const sync = [];
      const frame = [];
      for (let i = 0; i < 3 + 20; i++) {
        const posEl = document.querySelector('[data-idraw-sim="position"]');
        const nextPos = String((i % 14) + 1);
        const t0 = performance.now();
        if (posEl) {
          posEl.value = nextPos;
          posEl.dispatchEvent(new Event("input", { bubbles: true }));
          posEl.dispatchEvent(new Event("change", { bubbles: true }));
        }
        const syncMs = performance.now() - t0;
        await new Promise((r) => requestAnimationFrame(r));
        const frameMs = performance.now() - t0;
        if (i >= 3) {
          sync.push(syncMs);
          frame.push(frameMs);
        }
      }
      return {
        foundSimulatorControl: !!document.querySelector(
          '[data-idraw-sim="position"]',
        ),
        sync,
        frame,
      };
    });
    const simCdpAfter = await getCdpMetricsMap(cdp);

    // 5. Idle measurements (2000ms on Welcome, 2000ms on Battle)
    async function measureIdle(viewName) {
      await page.evaluate(async (v) => {
        document.querySelector(`.nav-tab[data-view="${v}"]`)?.click();
        await new Promise((r) => setTimeout(r, 350));
        window.__perfProbe.resetWindowCounters();
      }, viewName);
      const before = await getCdpMetricsMap(cdp);
      await page.waitForTimeout(2000);
      const after = await getCdpMetricsMap(cdp);
      const snapshot = await page.evaluate(() => ({
        ...window.__perfProbe.snapshot(),
        animationsIdle: document.getAnimations
          ? document.getAnimations().length
          : 0,
        domNodes: document.querySelectorAll("*").length,
      }));
      return {
        windowMs: 2000,
        ...snapshot,
        cdpDelta: diffCdp(before, after),
      };
    }

    const idleWelcome = await measureIdle("welcome");
    const idleBattle = await measureIdle("battle");

    await context.close();

    const result = {
      generatedAt: new Date().toISOString(),
      environment: {
        node: process.version,
        browserBinary: process.env.CHROMIUM_PATH || "default",
        viewport: "1920x1080@1x",
        seededState: seedInfo,
      },
      bundle,
      startup,
      battleHotPath: {
        renderAll: {
          syncMs: stats(battleResults.renderAllSamples.sync),
          frameMs: stats(battleResults.renderAllSamples.frame),
        },
        renderGrid: {
          syncMs: stats(battleResults.renderGridSamples.sync),
          frameMs: stats(battleResults.renderGridSamples.frame),
        },
        itemCommandSnapshotMs: stats(battleResults.snapshotSamples),
        historySnapshotCaptureMs: stats(battleResults.historyCaptureSamples),
        scoreUpdateAdjustMs: stats(battleResults.scoreAdjustOnlySamples),
        scoreUpdatePlusItemCommandSnapshotMs: stats(
          battleResults.scoreAndSnapshotSyncSamples,
        ),
        scoreUpdatePlusCommandIdleSaveMs: stats(
          battleResults.scoreAndSnapshotFullSamples,
        ),
        scoreChangesObserved: battleResults.scoreChangesObserved,
        saveProjectionFromRuntimeMs: stats(battleResults.saveProjOnlySamples),
        saveSchemaValidateV2Ms: stats(battleResults.validateV2Samples),
        saveProjectionPlusValidateV2Ms: stats(
          battleResults.saveProjTotalSamples,
        ),
        cdpDelta: diffCdp(battleCdpBefore, battleCdpAfter),
        longTasks: battleResults.probe.longTasksCount,
        longTasksMaxMs: battleResults.probe.longTasksMaxMs,
      },
      navigationAndUi: {
        sevenViewCycle: {
          cycleSyncTotalMs: stats(viewSwitchData.cycleSyncTotals),
          cycleFrameTotalMs: stats(viewSwitchData.cycleFrameTotals),
          perViewSyncMs: Object.fromEntries(
            views.map((v) => [v, stats(viewSwitchData.perViewSync[v])]),
          ),
          perViewFrameMs: Object.fromEntries(
            views.map((v) => [v, stats(viewSwitchData.perViewFrame[v])]),
          ),
          domByView: viewSwitchData.domByView,
          cdpDelta: diffCdp(navCdpBefore, navCdpAfter),
          longTasks: navProbe.longTasksCount,
          longTasksMaxMs: navProbe.longTasksMaxMs,
        },
        gameplayTabs: {
          cycleFrameTotalMs: stats(gameplayData.cycleFrameTotals),
          perTabSyncMs: Object.fromEntries(
            gpTabs.map((t) => [t, stats(gameplayData.perTabSync[t])]),
          ),
          perTabFrameMs: Object.fromEntries(
            gpTabs.map((t) => [t, stats(gameplayData.perTabFrame[t])]),
          ),
          cdpDelta: diffCdp(gpCdpBefore, gpCdpAfter),
        },
        settingsCategories: {
          categories: settingsCats,
          cycleFrameTotalMs: stats(settingsData.cycleFrameTotals),
          perCategorySyncMs: Object.fromEntries(
            settingsCats.map((c) => [c, stats(settingsData.perCatSync[c])]),
          ),
          perCategoryFrameMs: Object.fromEntries(
            settingsCats.map((c) => [c, stats(settingsData.perCatFrame[c])]),
          ),
          cdpDelta: diffCdp(settingsCdpBefore, settingsCdpAfter),
        },
        itemDrawSimulatorUpdate: {
          foundSimulatorControl: simSamples.foundSimulatorControl,
          syncMs: stats(simSamples.sync),
          frameMs: stats(simSamples.frame),
          cdpDelta: diffCdp(simCdpBefore, simCdpAfter),
        },
      },
      idle: {
        welcome: idleWelcome,
        battle: idleBattle,
      },
    };

    fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
    console.log("Wrote baseline metrics to", outPath);
    console.log(
      JSON.stringify(
        {
          distHtmlBytes: bundle.distHtmlBytes,
          startupInteractiveMedianMs: startup.saveReadyAndFirstFrameMs.median,
          renderAllFrameMedianMs: result.battleHotPath.renderAll.frameMs.median,
          renderGridFrameMedianMs:
            result.battleHotPath.renderGrid.frameMs.median,
          scorePlusSnapMedianMs:
            result.battleHotPath.scoreUpdatePlusItemCommandSnapshotMs.median,
          scorePlusSaveIdleMedianMs:
            result.battleHotPath.scoreUpdatePlusCommandIdleSaveMs.median,
          scoreChangesObserved: result.battleHotPath.scoreChangesObserved,
          saveProjPlusValidateMedianMs:
            result.battleHotPath.saveProjectionPlusValidateV2Ms.median,
          sevenViewCycleMedianMs:
            result.navigationAndUi.sevenViewCycle.cycleFrameTotalMs.median,
          gameplayCycleMedianMs:
            result.navigationAndUi.gameplayTabs.cycleFrameTotalMs.median,
          settingsCycleMedianMs:
            result.navigationAndUi.settingsCategories.cycleFrameTotalMs.median,
          simulatorFrameMedianMs:
            result.navigationAndUi.itemDrawSimulatorUpdate.frameMs.median,
          idleWelcomeRafIn2s: idleWelcome.windowRafCallbacks,
          idleBattleRafIn2s: idleBattle.windowRafCallbacks,
        },
        null,
        2,
      ),
    );
  } finally {
    await browser.close();
  }
}

runBenchmarks().catch((err) => {
  console.error(err);
  process.exit(1);
});
