/* Real battle-card workload, isolated synthetic roster; no fullscreen substitution. */
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../tests/fixtures/browser.mjs";
import { sourceAt } from "../tests/fixtures/source-at.mjs";
const ref = process.env.PERF_SOURCE_REF || "worktree",
  out =
    process.env.PERF_ARTIFACTS || `artifacts/battle-item-performance/${ref}`;
await mkdir(out, { recursive: true });
const html =
  ref === "worktree" ? await readFile("dist/godpower.html") : sourceAt(ref);
const server = createServer((_, r) => {
  r.setHeader("content-type", "text/html;charset=utf-8");
  r.end(html);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  await page.evaluate(() => SaveManager.ready());
  await setup(page, 14);
  await page.evaluate(async () => {
    state.groups.forEach(
      (g, i) =>
        (g.members = Array.from(
          { length: 4 },
          (_, j) => `${i * 4 + j + 1} 测试学生`,
        )),
    );
    historyStack = Array.from({ length: 40 }, (_, i) =>
      HistorySnapshots.capture(state, "合成历史" + i, "10:00"),
    );
    await saveState();
    await SaveManager.whenIdle();
  });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Profiler.enable");
  await cdp.send("Profiler.start");
  const results = [];
  for (const key of ["coin", "green", "lightning", "star"]) {
    await page.evaluate((key) => {
      BattleMotion.clear();
      cancelScoreAnimationAndSync();
      for (const g of state.groups) {
        g.inventory = [];
        g.effects = {};
        g.itemUsedThisRound = false;
        g.roundItemContinuationKeyV218 = null;
        g.itemEffect = null;
        delete g.roundItemInstanceId;
        delete g.roundItemKey;
      }
      addItemToGroup(state.groups[6], key);
      renderAll();
    }, key);
    const row = await page.evaluate(async (key) => {
      const frames = [],
        longTasks = [];
      let running = true,
        last = performance.now();
      function frame(t) {
        frames.push(t - last);
        last = t;
        if (running) requestAnimationFrame(frame);
      }
      const observer = new PerformanceObserver((l) =>
        longTasks.push(...l.getEntries().map((e) => e.duration)),
      );
      observer.observe({ type: "longtask" });
      requestAnimationFrame(frame);
      const start = performance.now(),
        before = state.groups.map((g) => g.score);
      const ok = await useItem(state.groups[6].id, 0);
      await classroomCommands.whenIdle();
      await SaveManager.whenIdle();
      const ack = performance.now() - start;
      await new Promise((r) => setTimeout(r, 1900));
      running = false;
      observer.disconnect();
      frames.sort((a, b) => a - b);
      return {
        key,
        ok,
        ackMs: ack,
        frames: frames.length,
        p50: frames[Math.floor(frames.length * 0.5)],
        p95: frames[Math.floor(frames.length * 0.95)],
        max: frames.at(-1),
        longTasks,
        before,
        after: state.groups.map((g) => g.score),
        fullscreens: document.querySelectorAll(
          "#classroomShowcase[open],.hic-overlay",
        ).length,
        remainingLayers: document.querySelectorAll(".bm-layer").length,
      };
    }, key);
    results.push(row);
  }
  const { profile } = await cdp.send("Profiler.stop");
  await page.screenshot({ path: out + "/battle.png" });
  const data = {
    source: ref,
    browser: await browser.version(),
    environment: "Linux Chromium headless; not Windows FPS",
    viewport: "1920x1080 DPR1",
    groups: 14,
    students: 56,
    history: 40,
    results,
    errors,
  };
  await writeFile(out + "/measurements.json", JSON.stringify(data, null, 2));
  await writeFile(out + "/cpu-profile.json", JSON.stringify(profile));
  console.log(JSON.stringify(data, null, 2));
} finally {
  await browser.close();
  server.close();
}
