import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html"),
  server = createServer((_, r) => r.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.evaluate(() => SaveManager.ready());
  await setup(page, 14);
  await page.evaluate(() => openPickerModal());
  await page.waitForSelector("#pickerModal.active");
  await page.waitForTimeout(500);
  const count = await page.evaluate(async () => {
    const original = Element.prototype.querySelectorAll;
    let scans = 0;
    Element.prototype.querySelectorAll = function (selector) {
      if (
        selector === 'button[onclick*="close"]' &&
        this.closest("#pickerModal")
      )
        scans++;
      return original.call(this, selector);
    };
    try {
      const reel = document.getElementById("reelTextStudent");
      for (let i = 0; i < 8; i++) {
        reel.textContent = "测试同学" + i;
        await new Promise((r) => setTimeout(r, 20));
      }
      return scans;
    } finally {
      Element.prototype.querySelectorAll = original;
    }
  });
  assert.equal(count, 0, "rolling text must not rerun modal lifecycle scans");
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    () => !document.getElementById("pickerModal").classList.contains("active"),
  );
  await page.evaluate(() => openPickerModal());
  await page.waitForSelector("#pickerModal.active");
  assert.equal(
    await page.locator("#pickerModal [data-ui-window-close]").count(),
    1,
  );
  await page.evaluate(() => {
    openScoreModal(1);
    window.originalScoreSurface =
      document.getElementById("scoreModalBackdrop").firstElementChild.innerHTML;
  });
  await page.waitForSelector("#scoreModalBackdrop.active");
  await page.evaluate(() => {
    document.getElementById("scoreModalBackdrop").firstElementChild.innerHTML =
      '<h3>测试重建表单</h3><button type="button">测试</button>';
  });
  await page.waitForFunction(
    () =>
      document.querySelectorAll("#scoreModalBackdrop [data-ui-window-close]")
        .length === 1,
  );
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    () =>
      !document
        .getElementById("scoreModalBackdrop")
        .classList.contains("active"),
  );
  assert.equal(
    await page
      .locator("#pickerModal")
      .evaluate((n) => n.classList.contains("active")),
    true,
  );
  await page.evaluate(
    () =>
      (document.getElementById(
        "scoreModalBackdrop",
      ).firstElementChild.innerHTML = window.originalScoreSurface),
  );
  await mkdir("artifacts/modal-observer-work", { recursive: true });
  await writeFile(
    "artifacts/modal-observer-work/result.json",
    JSON.stringify(
      {
        status: "PASS",
        textUpdates: 8,
        lifecycleScans: count,
        escapeAndReopen: true,
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS reel updates avoid modal rescans; Escape and reopening still work",
  );
} finally {
  await browser.close();
  server.close();
}
