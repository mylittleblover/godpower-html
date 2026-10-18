import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createServer } from "node:http";
import { createHash } from "node:crypto";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html"),
  root = process.env.SURFACES_ARTIFACT_DIR || "artifacts/visual-unification";
await mkdir(`${root}/screenshots`, { recursive: true });
const server = createServer((q, s) => {
  s.setHeader("Content-Type", "text/html;charset=utf-8");
  s.end(html);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch(),
  results = [],
  errors = [];
try {
  for (const [width, height] of [
    [1366, 768],
    [1920, 1080],
    [2560, 1440],
  ]) {
    const c = await browser.newContext({ viewport: { width, height } }),
      p = await c.newPage();
    p.setDefaultTimeout(30000);
    p.on("pageerror", (e) => errors.push(e.message));
    try {
      await p.goto(`http://127.0.0.1:${server.address().port}`, {
        waitUntil: "domcontentloaded",
        timeout: 90000,
      });
      await setup(p);
      for (const zoom of [0.8, 1, 1.25]) {
        const row = { width, height, zoom };
        try {
          await p.evaluate((z) => {
            STORAGE.setJSON("politics_settlement_history", []);
            applyZoom(z);
            switchView("archives");
            renderAll();
          }, zoom);
          await p.waitForFunction(() => DesktopUI.getAnimationCount() === 0);
          row.bounds = await p.evaluate(() => {
            const filter = document.querySelector(".ui-archive-filter"),
              input = document.getElementById("uiArchiveSearch"),
              sort = document.getElementById("uiArchiveSort"),
              empty = document.querySelector("#view-archives .ui-empty"),
              text = empty.querySelector("p").getBoundingClientRect(),
              button = empty.querySelector("button").getBoundingClientRect();
            return {
              filter: filter.getBoundingClientRect().toJSON(),
              input: input.getBoundingClientRect().toJSON(),
              sort: sort.getBoundingClientRect().toJSON(),
              gap: button.top - text.bottom,
              radius: getComputedStyle(sort).borderRadius,
              overflow: document.documentElement.scrollWidth > innerWidth + 1,
            };
          });
          assert.ok(row.bounds.gap >= 23 * zoom);
          assert.equal(row.bounds.radius, "11px");
          assert.equal(row.bounds.overflow, false);
          assert.ok(row.bounds.filter.right <= width + 1);
          assert.ok(row.bounds.input.height >= 43 * zoom);
          assert.ok(row.bounds.sort.height >= 43 * zoom);
          await p.locator("#uiArchiveSearch").fill("测试");
          await p.locator("#uiArchiveSearch").fill("");
          await p.locator("#uiArchiveSort").selectOption("score");
          row.screenshot = `${root}/screenshots/archive-controls-${width}-${zoom}.png`;
          await p.screenshot({ path: row.screenshot });
          const before = await p.evaluate(() => JSON.stringify(state.groups));
          await p.locator("#view-archives .ui-empty button").click();
          assert.equal(await p.locator("#view-battle").isVisible(), true);
          assert.equal(
            await p.evaluate(() => JSON.stringify(state.groups)),
            before,
          );
          row.status = "PASS";
          console.log("PASS", width, zoom);
        } catch (e) {
          row.status = "FAIL";
          row.error = e.stack;
          console.error("FAIL", width, zoom, e.message);
        }
        results.push(row);
      }
    } finally {
      await c.close();
    }
  }
} finally {
  await browser.close();
  server.close();
  await writeFile(
    `${root}/archive-controls.json`,
    JSON.stringify(
      {
        sha256: createHash("sha256").update(html).digest("hex"),
        results,
        errors,
      },
      null,
      2,
    ),
  );
  if (results.some((x) => x.status === "FAIL") || errors.length)
    process.exitCode = 1;
  console.log({
    pass: results.filter((x) => x.status === "PASS").length,
    fail: results.filter((x) => x.status === "FAIL").length,
    errors,
  });
}
