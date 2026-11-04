/* Same synthetic 14-group/56-student/40-history workload across released sources. */
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { sourceAt } from "../tests/fixtures/source-at.mjs";
import { launch, setup } from "../tests/fixtures/browser.mjs";
const ref = process.env.PERF_SOURCE_REF || "worktree",
  out = process.env.PERF_ARTIFACTS || "artifacts/classroom-regression/" + ref;
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
  await page.addInitScript(() => {
    window.__digestMetrics = [];
    const digest = SubtleCrypto.prototype.digest;
    SubtleCrypto.prototype.digest = async function (algorithm, data) {
      const t = performance.now();
      try {
        return await digest.call(this, algorithm, data);
      } finally {
        __digestMetrics.push({
          ms: performance.now() - t,
          bytes: data.byteLength,
        });
      }
    };
  });
  await page.goto("http://127.0.0.1:" + server.address().port, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForFunction(() => window.classroomReady);
  if (await page.evaluate(() => !!globalThis.SaveManager))
    await page.evaluate(() => SaveManager.ready());
  await setup(page, 14);
  await page.evaluate(async () => {
    state.groups.forEach((g, i) => {
      g.members = Array.from(
        { length: 4 },
        (_, j) =>
          String(i * 4 + j + 1).padStart(2, "0") +
          " 测试学生" +
          (i * 4 + j + 1),
      );
    });
    historyStack = Array.from({ length: 40 }, (_, i) =>
      HistorySnapshots.capture(state, "合成历史" + i, "10:00:00"),
    );
    await saveState();
    if (globalThis.SaveManager) await SaveManager.whenIdle();
    else await classroomCommands.whenIdle();
  });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Profiler.enable");
  await cdp.send("Profiler.start");
  const result = await page.evaluate(async () => {
    const phases = [],
      longTasks = [];
    const observer = new PerformanceObserver((list) =>
      longTasks.push(
        ...list
          .getEntries()
          .map((e) => ({ start: e.startTime, duration: e.duration })),
      ),
    );
    observer.observe({ type: "longtask" });
    async function measure(name, operation, count = 3) {
      const samples = [];
      for (let i = 0; i < count; i++) {
        const digestStart = __digestMetrics.length,
          t = performance.now();
        await operation(i);
        await classroomCommands.whenIdle();
        if (globalThis.SaveManager) await SaveManager.whenIdle();
        samples.push({
          ms: performance.now() - t,
          digests: __digestMetrics.slice(digestStart),
        });
        await new Promise((r) => setTimeout(r, 40));
      }
      phases.push({ name, samples });
    }
    await measure("score-command", () =>
      runClassroomCommand("合成加分", () => {
        state.groups[0].score++;
        state.groups[0].displayScore = state.groups[0].score;
        return true;
      }),
    );
    await measure("group-name-command", (i) =>
      runClassroomCommand("合成改名", () => {
        state.groups[0].name = "测试小组 " + i;
        return true;
      }),
    );
    await measure("renderAll", () => renderAll());
    await measure("settings-switch", () => {
      switchView("settings");
      DesktopUI.selectSettings("sound");
      switchView("battle");
    });
    const frameResults = [];
    for (const type of ["idle", "picker", "fullscreen"]) {
      if (type === "picker") {
        openPickerModal();
        startSlotSpin();
      }
      if (type === "fullscreen") {
        ClassroomFeedback.setOptions(
          { scoreEffects: true, duration: 3600 },
          { persist: false },
        );
        ClassroomFeedback.score("测试小组", 2);
      }
      const frames = [];
      await new Promise((resolve) => {
        let previous, start;
        function tick(t) {
          start ??= t;
          if (previous) frames.push(t - previous);
          previous = t;
          if (t - start < 1200) requestAnimationFrame(tick);
          else resolve();
        }
        requestAnimationFrame(tick);
      });
      frames.sort((a, b) => a - b);
      frameResults.push({
        type,
        count: frames.length,
        p50: frames[Math.floor(frames.length * 0.5)],
        p95: frames[Math.floor(frames.length * 0.95)],
        max: frames.at(-1),
      });
      if (type === "picker") closePickerModal();
      if (type === "fullscreen") ClassroomFeedback.cancel();
    }
    observer.disconnect();
    return {
      phases,
      frameResults,
      longTasks,
      groups: state.groups.length,
      students: state.groups.reduce((n, g) => n + g.members.length, 0),
      history: historyStack.length,
      dom: document.querySelectorAll("*").length,
    };
  });
  const { profile } = await cdp.send("Profiler.stop");
  const nodes = new Map(profile.nodes.map((n) => [n.id, n]));
  const counts = new Map();
  for (let i = 0; i < (profile.samples || []).length; i++) {
    const node = nodes.get(profile.samples[i]);
    const key = node.callFrame.functionName + " @" + node.callFrame.lineNumber;
    counts.set(key, (counts.get(key) || 0) + (profile.timeDeltas?.[i] || 0));
  }
  const top = [...counts]
    .map(([name, microseconds]) => ({ name, selfMs: microseconds / 1000 }))
    .sort((a, b) => b.selfMs - a.selfMs)
    .slice(0, 35);
  await writeFile(
    out + "/measurements.json",
    JSON.stringify(
      {
        source: ref,
        browser: await browser.version(),
        viewport: "1920x1080 DPR1",
        synthetic: true,
        ...result,
        top,
      },
      null,
      2,
    ),
  );
  await writeFile(out + "/cpu-profile.json", JSON.stringify(profile));
  console.log(
    JSON.stringify(
      {
        source: ref,
        phases: result.phases.map((p) => ({
          name: p.name,
          ms: p.samples.map((s) => Math.round(s.ms)),
          digestCalls: p.samples.map((s) => s.digests.length),
        })),
        frames: result.frameResults,
        top: top.slice(0, 8),
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
  server.close();
}
