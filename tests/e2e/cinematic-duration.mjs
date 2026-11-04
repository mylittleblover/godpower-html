import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, dismissStartup, setup } from "../fixtures/browser.mjs";
await mkdir("artifacts/cinematic-duration", { recursive: true });
const html = await readFile("dist/godpower.html"),
  server = createServer((_, r) => {
    r.setHeader("content-type", "text/html;charset=utf-8");
    r.end(html);
  });
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
try {
  const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
    }),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:" + server.address().port, {
    waitUntil: "domcontentloaded",
  });
  await page.evaluate(() => SaveManager.ready());
  await dismissStartup(page);
  await setup(page, 14);
  const start = await page.evaluate(() => {
    ClassroomFeedback.setOptions({ duration: 1200 }, { persist: false });
    HandItemCinematic.present({
      key: "coin",
      caster: state.groups[0],
      targets: state.groups.slice(0, 4).map((g) => ({ ...g, delta: 2 })),
    });
    return performance.now();
  });
  assert.equal(
    await page.locator(".hic-target-grid article").count(),
    4,
    "all outcomes are shown together",
  );
  await page.waitForFunction(
    () => !document.querySelector(".hand-item-cinematic"),
  );
  const elapsed = await page.evaluate(
    (start) => performance.now() - start,
    start,
  );
  assert.ok(
    elapsed >= 1100 && elapsed < 2100,
    "configured 1200ms closes without target-count multiplication",
  );
  await page.evaluate(() => {
    ClassroomFeedback.setOptions({ duration: 3600 }, { persist: false });
    HandItemCinematic.present({
      key: "coin",
      caster: state.groups[0],
      targets: [{ ...state.groups[0], delta: 2 }],
    });
  });
  await page.locator(".hand-item-cinematic button").click();
  assert.equal(
    await page.locator(".hand-item-cinematic").count(),
    0,
    "skip closes immediately without changing outcomes",
  );
  const result = { elapsed };
  assert.deepEqual(errors, []);
  await writeFile(
    "artifacts/cinematic-duration/result.json",
    JSON.stringify({ status: "PASS", result, errors }, null, 2),
  );
  console.log(
    "PASS configured item cinematic duration, simultaneous outcomes and skip",
  );
} finally {
  await browser.close();
  server.close();
}
