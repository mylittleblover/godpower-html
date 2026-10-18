import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html"),
  root = "artifacts/visual-unification/warnings";
await mkdir(root, { recursive: true });
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
      await setup(p, 14);
      for (const zoom of [0.8, 1, 1.25]) {
        const row = { width, height, zoom };
        try {
          await p.evaluate((z) => {
            applyZoom(z);
            state.correctAns = "";
            state.groups.forEach((g) => (g.selectedOpt = ""));
            window.warningPromise = setCorrectAns("A");
          }, zoom);
          await p.waitForSelector("#programConfirmV28 [data-ui-window-close]");
          await p.waitForFunction(() => DesktopUI.getAnimationCount() === 0);
          row.bounds = await p
            .locator(".program-confirm-window")
            .evaluate((e) => e.getBoundingClientRect().toJSON());
          assert.ok(
            row.bounds.x >= 0 &&
              row.bounds.y >= 0 &&
              row.bounds.right <= width + 1 &&
              row.bounds.bottom <= height + 1,
          );
          assert.match(
            await p.locator(".program-confirm-text").textContent(),
            /14/,
          );
          assert.equal(
            await p
              .locator("#programConfirmV28 [data-ui-window-close]")
              .count(),
            1,
          );
          row.screenshot = `${root}/unfinished-${width}-${zoom}.png`;
          await p.screenshot({ path: row.screenshot });
          await p.locator("#programConfirmV28 [data-ui-window-close]").click();
          await p.evaluate(() => warningPromise);
          assert.equal(await p.evaluate(() => state.correctAns), "");
          await p.locator("#programConfirmV28").waitFor({ state: "detached" });
          assert.equal(await p.locator("#programConfirmV28").count(), 0);
          await p.evaluate(() => {
            window.warningPromise = setCorrectAns("B");
          });
          await p.waitForSelector("#pcOkV28");
          await p.locator("#pcOkV28").click();
          await p.evaluate(() => warningPromise);
          assert.equal(await p.evaluate(() => state.correctAns), "B");
          row.status = "PASS";
          console.log("PASS unfinished", width, zoom);
        } catch (e) {
          row.status = "FAIL";
          row.error = e.stack;
          console.error("FAIL unfinished", width, zoom, e.message);
        }
        results.push(row);
      }
      if (width === 1920) {
        for (const kind of ["replace", "escape", "enter", "view-change"]) {
          const row = { kind };
          try {
            await setup(p);
            await p.evaluate(() => applyZoom(1));
            await p.evaluate((kind) => {
              window.firstWarning = setCorrectAns("A");
              if (kind === "replace") window.secondWarning = setCorrectAns("C");
            }, kind);
            await p.waitForSelector(
              "#programConfirmV28 [data-ui-window-close]",
            );
            if (kind === "enter") await p.keyboard.press("Enter");
            else if (kind === "view-change")
              await p.evaluate(() => switchView("history"));
            else await p.keyboard.press("Escape");
            await p.evaluate(async () => {
              await firstWarning;
              if (window.secondWarning) await secondWarning;
            });
            assert.equal(
              await p.evaluate(() => state.correctAns),
              kind === "enter" ? "A" : "",
            );
            await p
              .locator("#programConfirmV28")
              .waitFor({ state: "detached" });
            assert.equal(await p.locator("#programConfirmV28").count(), 0);
            await p.waitForFunction(() => DesktopUI.getAnimationCount() === 0);
            row.status = "PASS";
            console.log("PASS", kind);
          } catch (e) {
            row.status = "FAIL";
            row.error = e.stack;
            console.error("FAIL", kind, e.message);
          }
          results.push(row);
        }
      }
    } finally {
      await c.close();
    }
  }
} finally {
  await browser.close();
  server.close();
  await writeFile(
    `${root}/results.json`,
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
  console.log({
    pass: results.filter((x) => x.status === "PASS").length,
    fail: results.filter((x) => x.status === "FAIL").length,
    errors,
  });
  if (results.some((x) => x.status === "FAIL") || errors.length)
    process.exitCode = 1;
}
