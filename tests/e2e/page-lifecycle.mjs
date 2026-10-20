import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { launch, dismissStartup } from "../fixtures/browser.mjs";

const html = await readFile("dist/godpower.html");
const server = createServer((_request, response) => {
  response.setHeader("Content-Type", "text/html;charset=utf-8");
  response.end(html);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const browser = await launch();
const errors = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  await dismissStartup(page);

  const lifecycleReady = await page.evaluate(() => ({
    current: window.GodPowerPageLifecycle?.current()?.route,
    testView: typeof switchView,
  }));
  assert.equal(lifecycleReady.current, "welcome");
  assert.equal(lifecycleReady.testView, "function");

  const released = await page.evaluate(async () => {
    const first = window.GodPowerPageLifecycle.current();
    const target = new EventTarget();
    let events = 0;
    let timeoutRan = false;
    first.listen(target, "test", () => events++);
    first.timeout(() => {
      timeoutRan = true;
    }, 100);
    const before = JSON.stringify(state);
    switchView("history");
    const disposedImmediately = first.disposed;
    target.dispatchEvent(new Event("test"));
    await new Promise((resolve) => setTimeout(resolve, 150));
    return {
      disposedImmediately,
      events,
      timeoutRan,
      route: window.GodPowerPageLifecycle.current()?.route,
      unchangedBusinessState: before === JSON.stringify(state),
    };
  });
  assert.equal(released.disposedImmediately, true);
  assert.equal(released.events, 0);
  assert.equal(released.timeoutRan, false);
  assert.equal(released.route, "history");
  assert.equal(released.unchangedBusinessState, true);

  await page.evaluate(() => switchView("battle"));
  await page.evaluate(() => openPickerModal());
  await page.evaluate(() => void themeConfirm("退出动画兼容"));
  await page.waitForTimeout(80);
  await page.keyboard.press("Escape");
  assert.equal(
    await page.locator("#themeDialogV21727").getAttribute("aria-hidden"),
    "true",
  );
  await page.waitForFunction(
    () =>
      !document
        .querySelector("#themeDialogV21727")
        ?.classList.contains("active"),
  );
  assert.equal(await page.locator("#pickerModal").isVisible(), true);
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    () => !document.querySelector("#pickerModal")?.classList.contains("active"),
  );
  assert.equal(await page.locator("#pickerModal").isVisible(), false);
  assert.equal(
    await page.evaluate(() => GodPowerPageLifecycle.current()?.route),
    "battle",
  );
  assert.deepEqual(errors, []);
  console.log(
    JSON.stringify({
      status: "PASS",
      browser: "Chromium",
      viewport: "1920x1080",
      deviceScaleFactor: 1,
      lifecycle: released,
      pageErrors: errors,
    }),
  );
} finally {
  await browser.close();
  server.close();
}
