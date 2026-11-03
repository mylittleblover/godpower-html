import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { sourceAt } from "../fixtures/source-at.mjs";
import { launch, setup } from "../fixtures/browser.mjs";
const root = process.env.PERF_ARTIFACTS || "artifacts/performance-3.0.66";
await mkdir(root, { recursive: true });
const html = process.env.PERF_SOURCE_REF
  ? sourceAt(process.env.PERF_SOURCE_REF)
  : await readFile("dist/godpower.html");
const server = createServer((q, r) => r.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
});
await page.goto(`http://127.0.0.1:${server.address().port}`);
await setup(page, 14);
const cdp = await page.context().newCDPSession(page);
const profiling = process.env.PERF_PROFILE !== "0";
if (profiling) {
  await cdp.send("Profiler.enable");
  await cdp.send("Profiler.start");
}
const measurements = await page.evaluate(async () => {
  const rows = [],
    frames = [],
    longTasks = [];
  const obs = new PerformanceObserver((list) =>
    longTasks.push(
      ...list
        .getEntries()
        .map((e) => ({ start: e.startTime, duration: e.duration })),
    ),
  );
  obs.observe({ type: "longtask", buffered: false });
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  async function sample(name, fn, count = 5) {
    const times = [],
      settled = [];
    for (let i = 0; i < count; i++) {
      const t = performance.now();
      fn();
      times.push(performance.now() - t);
      await sleep(100);
      settled.push(performance.now() - t);
    }
    rows.push({ name, synchronousMs: times, including100msWait: settled });
  }
  async function frameSample(name, fn) {
    const deltas = [];
    let prev, start;
    fn();
    await new Promise((resolve) => {
      function tick(t) {
        start ??= t;
        if (prev) deltas.push(t - prev);
        prev = t;
        if (t - start < 2000) requestAnimationFrame(tick);
        else resolve();
      }
      requestAnimationFrame(tick);
    });
    deltas.sort((a, b) => a - b);
    frames.push({
      name,
      frames: deltas.length,
      p50: deltas[Math.floor(deltas.length * 0.5)],
      p95: deltas[Math.floor(deltas.length * 0.95)],
      max: deltas.at(-1),
      over33: deltas.filter((t) => t > 33.4).length,
    });
  }
  await sample("renderAll", () => renderAll());
  await sample("renderGrid", () => renderGrid());
  await sample("saveState", () => saveState());
  await sample("pickerOpenClose", () => {
    openPickerModal();
    closePickerModal();
  });
  await frameSample("battleIdle", () => {});
  await frameSample("pickerRolling", () => {
    openPickerModal();
    startSlotSpin();
  });
  closePickerModal();
  ClassroomFeedback.setOptions(
    { scoreEffects: true, duration: 3600 },
    { persist: false },
  );
  await frameSample("fullscreenScore", () =>
    ClassroomFeedback.score("测试小组", 2),
  );
  ClassroomFeedback.cancel();
  await frameSample("globalItemDraw", () => {
    state.groups.forEach((g) => (g.inventory = []));
    globalItemDraw();
  });
  await sleep(2000);
  await sample(
    "pageSwitch",
    () => {
      switchView("settings");
      switchView("battle");
    },
    3,
  );
  obs.disconnect();
  return {
    rows,
    frames,
    longTasks,
    nodes: document.querySelectorAll("*").length,
  };
});
const { profile } = profiling
  ? await cdp.send("Profiler.stop")
  : { profile: { nodes: [], samples: [], timeDeltas: [] } };
await writeFile(
  `${root}/${process.env.PERF_SOURCE_REF || "current"}-profile.json`,
  JSON.stringify(profile),
);
const hits = new Map();
const nodes = new Map(profile.nodes.map((n) => [n.id, n]));
for (let i = 0; i < (profile.samples || []).length; i++) {
  const n = nodes.get(profile.samples[i]);
  const f = n.callFrame;
  const k = f.functionName + ":" + f.lineNumber;
  hits.set(k, (hits.get(k) || 0) + (profile.timeDeltas[i] || 0));
}
const top = [...hits].sort((a, b) => b[1] - a[1]).slice(0, 35);
await writeFile(
  `${root}/${process.env.PERF_SOURCE_REF || "current"}-${profiling ? "diagnosis" : "unprofiled"}.json`,
  JSON.stringify({ measurements, top }, null, 2),
);
console.log(JSON.stringify({ measurements, top }, null, 2));
await browser.close();
server.close();
