import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html"),
  root = "artifacts/visual-unification/admin";
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
    const row = { width, height };
    try {
      await p.goto(`http://127.0.0.1:${server.address().port}`, {
        waitUntil: "domcontentloaded",
        timeout: 90000,
      });
      await setup(p);
      await p.evaluate(() => {
        state.isLocked = true;
        state.adminPin = "test-pin-42";
        renderAll();
      });
      const before = await p.evaluate(() => JSON.stringify(state.groups));
      await p.locator(".ui-dock-menu > summary").click();
      await p.locator("#lockBtn").click();
      await p.waitForFunction(() => document.activeElement.id === "pwdInput");
      assert.equal(await p.locator("#pwdInput").inputValue(), "");
      assert.equal(
        await p.locator("#pwdModal [data-ui-window-close]").count(),
        1,
      );
      await p.locator("#pwdInput").fill("wrong-pin");
      await p.keyboard.press("Enter");
      await p.waitForSelector("#themeDialogV21727.active");
      assert.equal(await p.evaluate(() => state.isLocked), true);
      row.layers = await p.evaluate(() => ({
        password: Number(
          getComputedStyle(document.getElementById("pwdModal")).zIndex,
        ),
        error: Number(
          getComputedStyle(document.getElementById("themeDialogV21727")).zIndex,
        ),
      }));
      assert.ok(row.layers.error > row.layers.password);
      row.screenshot = `${root}/password-error-${width}.png`;
      await p.screenshot({ path: row.screenshot });
      await p.locator("#themeDialogV21727 [data-ui-window-close]").click();
      await p.waitForFunction(() => document.activeElement.id === "pwdInput");
      assert.equal(await p.locator("#pwdInput").inputValue(), "");
      await p.locator("#pwdModal [data-ui-window-close]").click();
      assert.equal(await p.evaluate(() => state.isLocked), true);
      assert.equal(
        await p.evaluate(() => JSON.stringify(state.groups)),
        before,
      );
      await p.evaluate(() => toggleLock());
      await p.locator("#pwdInput").fill("test-pin-42");
      await p.keyboard.press("Enter");
      await p.waitForFunction(() => !state.isLocked);
      assert.equal(await p.locator("#pwdModal").isVisible(), false);
      assert.equal(
        await p.evaluate(() => JSON.stringify(state.groups)),
        before,
      );
      await p.evaluate(() => {
        toggleLock();
        toggleLock();
      });
      await p.keyboard.press("Escape");
      assert.equal(await p.evaluate(() => state.isLocked), true);
      assert.equal(await p.locator("#pwdModal").isVisible(), false);
      await p.waitForFunction(() => DesktopUI.getAnimationCount() === 0);
      row.status = "PASS";
      console.log("PASS admin", width);
    } catch (e) {
      row.status = "FAIL";
      row.error = e.stack;
      console.error("FAIL admin", width, e.message);
    } finally {
      await c.close();
    }
    results.push(row);
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
