import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html");
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
  await page.addInitScript(() => {
    window.testDialogPublish = 0;
    window.testPickerOpen = 0;
    window.godpowerDesktop = {
      role: "main",
      onExecute() {},
      onShellState() {},
      onUnlockRequest() {},
      publish() {},
      reply() {},
      ready() {},
      showScore() {},
      publishDialogs() {
        window.testDialogPublish++;
      },
      onDialogEvent() {},
      openPicker() {
        window.testPickerOpen++;
        return Promise.resolve();
      },
    };
  });
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(page, 14);
  await page.evaluate(() => openPwdModal());
  await page.waitForTimeout(600);
  const input = page.locator("#pwdInput");
  await input.focus();
  await page.evaluate(() => (window.typedNode = document.activeElement));
  for (const c of "test123") {
    await page.keyboard.insertText(c);
    await page.waitForTimeout(180);
    assert.equal(
      await page.evaluate(
        () =>
          document.activeElement === window.typedNode &&
          window.typedNode.isConnected,
      ),
      true,
    );
  }
  assert.equal(await input.inputValue(), "test123");
  assert.equal(await page.locator("[data-native-detached]").count(), 0);
  assert.equal(await page.evaluate(() => window.testDialogPublish), 0);
  await page.evaluate(() => {
    closePwdModal();
    switchView("settings");
    DesktopUI.selectSettings("welcome");
  });
  await page.waitForTimeout(600);
  assert.equal(
    await page.locator('[data-category-panel="welcome"]').isVisible(),
    true,
  );
  await page.evaluate(() => openPickerModal());
  await page.waitForTimeout(200);
  assert.ok(await page.evaluate(() => window.testPickerOpen > 0));
  await page.evaluate(() => {
    switchView("settings");
    DesktopUI.selectSettings("welcome");
    document.getElementById("uiSettingsBank").open = true;
  });
  await page.waitForTimeout(600);
  await page.locator("#uiBankEditor").focus();
  await page.keyboard.insertText("test");
  assert.equal(
    await page.evaluate(
      () => document.activeElement === document.getElementById("uiBankEditor"),
    ),
    true,
    "hidden external picker cannot trap focus away from settings",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS live internal password input survives every character, no clone publication, settings navigation and external picker entry",
  );
} finally {
  await browser.close();
  server.close();
}
