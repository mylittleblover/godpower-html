import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, dismissStartup, setup } from "../fixtures/browser.mjs";
await mkdir("artifacts/battle-scroll-space", { recursive: true });
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
  const padding = await page
    .locator("#view-battle .main-viewport")
    .evaluate((n) => parseFloat(getComputedStyle(n).paddingBottom));
  assert.ok(
    padding <= 24,
    "battle content must not reserve the old 200px empty tail",
  );
  await setup(page, 40);
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  await page.waitForTimeout(100);
  const result = await page.evaluate(() => {
    const cards = [...document.querySelectorAll("#groupList>.group-row-card")],
      last = cards.at(-1).getBoundingClientRect(),
      dock = document.querySelector(".bottom-dock").getBoundingClientRect();
    return {
      scrollY,
      scrollHeight: document.documentElement.scrollHeight,
      viewport: innerHeight,
      lastBottom: last.bottom,
      dockTop: dock.top,
      count: cards.length,
    };
  });
  assert.equal(result.count, 40);
  assert.ok(result.scrollY > 0, "overflow remains scrollable");
  assert.ok(
    result.lastBottom < result.dockTop,
    "last group stays reachable above fixed controls",
  );
  assert.deepEqual(errors, []);
  await writeFile(
    "artifacts/battle-scroll-space/result.json",
    JSON.stringify({ status: "PASS", padding, result, errors }, null, 2),
  );
  console.log("PASS compact battle tail and scrollable overflowing group list");
} finally {
  await browser.close();
  server.close();
}
