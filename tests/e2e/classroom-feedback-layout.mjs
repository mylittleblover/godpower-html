import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
const h = await readFile("dist/godpower.html");
const s = createServer((q, r) => r.end(h));
await new Promise((r) => s.listen(0, "127.0.0.1", r));
const b = await launch(),
  p = await b.newPage({ viewport: { width: 1366, height: 768 } });
await p.goto(`http://127.0.0.1:${s.address().port}`);
await setup(p);
const results = [];
try {
  for (const [width, height] of [
    [1366, 768],
    [1920, 1080],
    [2560, 1440],
  ]) {
    await p.setViewportSize({ width, height });
    await p.evaluate(() => {
      applyZoom(1);
      switchView("settings");
      DesktopUI.selectSettings("rules");
    });
    await p.waitForFunction(
      () =>
        DesktopUI.getAnimationCount() === 0 &&
        DesktopUI.getSettingsMotionCount() === 0,
    );
    await p.waitForFunction(
      () => !document.getElementById("toast").classList.contains("show"),
    );
    await p.locator(".cf-slot-editor").scrollIntoViewIfNeeded();
    await p.screenshot({
      path: `artifacts/classroom-feedback/settings-full-${width}.png`,
    });
    await p.locator(".cf-slot-editor").screenshot({
      path: `artifacts/classroom-feedback/settings-slots-${width}.png`,
    });
    for (const zoom of [0.8, 1, 1.25]) {
      await p.evaluate((z) => {
        applyZoom(z);
        ClassroomFeedback.setOptions(
          { scoreEffects: true, duration: 3600 },
          { persist: false },
        );
        ClassroomFeedback.score("缩放验收", 5);
      }, zoom);
      await p.waitForSelector("#classroomShowcase[open]");
      const rect = await p.locator("#classroomShowcase").boundingBox();
      if (
        Math.abs(rect.x) > 1 ||
        Math.abs(rect.y) > 1 ||
        Math.abs(rect.width - width) > 1 ||
        Math.abs(rect.height - height) > 1
      )
        throw Error(JSON.stringify({ width, height, zoom, rect }));
      results.push({ width, height, zoom, rect });
      await p.evaluate(() => ClassroomFeedback.cancel());
    }
  }
  await (
    await import("node:fs/promises")
  ).writeFile(
    "artifacts/classroom-feedback/fullscreen-zoom.json",
    JSON.stringify(results, null, 2),
  );
  console.log(JSON.stringify(results));
} finally {
  await b.close();
  s.close();
}
