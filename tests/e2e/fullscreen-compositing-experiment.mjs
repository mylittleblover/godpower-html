// Diagnostic-only style injection. No production quality switches or business changes.
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
await mkdir("artifacts/performance-3.0.68", { recursive: true });
const html = await readFile("dist/godpower.html");
const server = createServer((q, r) => r.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
try {
  const cdp = await browser.newBrowserCDPSession();
  const hardware = await cdp.send("SystemInfo.getInfo");
  const p = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  await p.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(p, 14);
  const results = await p.evaluate(async () => {
    ClassroomFeedback.setOptions(
      { scoreEffects: true, duration: 3600 },
      { persist: false },
    );
    const rows = [];
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    for (const variant of [
      "warmup",
      "baseline",
      "layers",
      "contain",
      "contain",
      "layers",
      "baseline",
    ]) {
      const style = document.createElement("style");
      style.textContent =
        variant === "layers"
          ? ".cf-show-orbit,.cf-show-copy,.cf-show-particles i{will-change:transform,opacity}"
          : variant === "contain"
            ? "#classroomShowcase .cf-show-surface{contain:layout paint}"
            : "";
      document.head.append(style);
      ClassroomFeedback.score("合成性能检查", 2);
      const values = [];
      let start, last;
      await new Promise((resolve) => {
        function tick(t) {
          start ??= t;
          if (last) values.push(t - last);
          last = t;
          if (t - start < 1900) requestAnimationFrame(tick);
          else resolve();
        }
        requestAnimationFrame(tick);
      });
      values.sort((a, b) => a - b);
      rows.push({
        variant,
        frames: values.length,
        p50: values[Math.floor(values.length * 0.5)],
        p95: values[Math.floor(values.length * 0.95)],
        max: values.at(-1),
      });
      ClassroomFeedback.cancel();
      style.remove();
      await sleep(350);
    }
    return rows;
  });
  const report = { browser: browser.version(), gpu: hardware.gpu, results };
  await writeFile(
    "artifacts/performance-3.0.68/compositing-experiment.json",
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
  server.close();
}
