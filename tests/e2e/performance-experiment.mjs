import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html");
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
await cdp.send("Profiler.enable");
await cdp.send("Profiler.start");
const measurements = await page.evaluate(async () => {
  const rows = [];
  async function frames() {
    const out = [];
    let prev, start;
    await new Promise((resolve) => {
      function tick(t) {
        start ??= t;
        if (prev) out.push(t - prev);
        prev = t;
        if (t - start < 1700) requestAnimationFrame(tick);
        else resolve();
      }
      requestAnimationFrame(tick);
    });
    out.sort((a, b) => a - b);
    return {
      frames: out.length,
      p50: out[Math.floor(out.length * 0.5)],
      p95: out[Math.floor(out.length * 0.95)],
    };
  }
  ClassroomFeedback.setOptions(
    { scoreEffects: true, duration: 3600 },
    { persist: false },
  );
  for (const variant of [
    "baseline",
    "no-backdrop",
    "baseline",
    "no-backdrop",
  ]) {
    const style = document.createElement("style");
    if (variant === "no-backdrop")
      style.textContent =
        "#classroomShowcase::backdrop,#classroomShowcase{backdrop-filter:none !important}";
    document.head.append(style);
    ClassroomFeedback.score("测试小组", 2);
    rows.push({ variant, ...(await frames()) });
    ClassroomFeedback.cancel();
    style.remove();
    await new Promise((r) => setTimeout(r, 250));
  }
  const costs = [];
  for (const name of [
    "renderLockStatus",
    "renderControls",
    "renderGrid",
    "updateHeaderStats",
    "renderChart",
    "renderDashboard",
    "updateResizerUI",
    "renderWelcomePage",
    "updateWelcomeTrackIfNeeded",
  ]) {
    const times = [];
    for (let i = 0; i < 5; i++) {
      const t = performance.now();
      window[name]();
      times.push(performance.now() - t);
    }
    costs.push({ name, times });
  }
  return { rows, costs };
});
const { profile } = await cdp.send("Profiler.stop");
await writeFile(
  "artifacts/performance-3.0.66/experiment-profile.json",
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
  "artifacts/performance-3.0.66/experiment.json",
  JSON.stringify({ measurements, top }, null, 2),
);
console.log(JSON.stringify({ measurements, top }, null, 2));
await browser.close();
server.close();
