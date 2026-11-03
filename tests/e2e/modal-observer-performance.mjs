import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { sourceAt } from "../fixtures/source-at.mjs";
import { launch, setup } from "../fixtures/browser.mjs";
await mkdir("artifacts/performance-3.0.68", { recursive: true });
const html = process.env.MODAL_BASELINE
  ? sourceAt(process.env.MODAL_BASELINE)
  : await readFile("dist/godpower.html");
const server = createServer((q, r) => r.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch(),
  results = {};
try {
  const p = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  await p.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(p, 14);
  await p.waitForTimeout(500);
  results.unrelated = await p.evaluate(async () => {
    const ids = new Set([
      "componentLibraryModal",
      "classroomShowcase",
      "programConfirmV28",
      "welcomeModal",
      "scoreModalBackdrop",
      "pwdModal",
      "memberSearchBackdrop",
      "settlementNameModal",
      "grandModalOverlay",
      "pickerModal",
      "itemModalBackdrop",
      "handRaiseBackdrop",
      "aboutBackdrop",
      "batchImportModal",
      "themeDialogV21727",
      "quickPersonBackdropV218",
    ]);
    const original = document.getElementById;
    let lookups = 0;
    document.getElementById = function (id) {
      if (ids.has(id)) lookups++;
      return original.call(this, id);
    };
    const target = document.querySelector("#groupList .group-row-card");
    const t = performance.now();
    try {
      for (let i = 0; i < 100; i++) {
        target.style.setProperty("--observer-probe", String(i));
        await Promise.resolve();
        await Promise.resolve();
      }
      return { lookups, ms: performance.now() - t };
    } finally {
      document.getElementById = original;
      target.style.removeProperty("--observer-probe");
    }
  });
  console.log(JSON.stringify(results.unrelated));
  assert.equal(
    results.unrelated.lookups,
    0,
    "unrelated battle mutations must not rescan modal registry",
  );
  await p.evaluate(() => {
    window.probeConfirm = programConfirmV28("窗口观察器回归检查");
  });
  await p.locator("#programConfirmV28 [data-ui-window-close]").waitFor();
  assert.equal(
    await p.locator("#programConfirmV28 [data-ui-window-close]").count(),
    1,
  );
  await p.evaluate(() => {
    const surface = document.querySelector(
      "#programConfirmV28 .ui-function-surface",
    );
    surface.querySelector("[data-ui-window-close]").remove();
    surface.append(document.createElement("span"));
  });
  await p.locator("#programConfirmV28 [data-ui-window-close]").waitFor();
  await p.keyboard.press("Escape");
  assert.equal(await p.evaluate(() => probeConfirm), false);
  await p.locator("#programConfirmV28").waitFor({ state: "detached" });
  await p.evaluate(() => openPickerModal());
  await p.locator("#pickerModal [data-ui-window-close]").waitFor();
  await p.keyboard.press("Escape");
  await p.waitForFunction(
    () =>
      !document.querySelector("#pickerModal").classList.contains("show") &&
      !document.querySelector("#pickerModal").classList.contains("active"),
  );
  await p.screenshot({
    path: "artifacts/performance-3.0.68/modal-regression.png",
  });
  results.lifecycle = "PASS";
  await writeFile(
    "artifacts/performance-3.0.68/modal-result.json",
    JSON.stringify(results, null, 2),
  );
  console.log(
    "PASS unrelated mutations, dynamic modal insertion, close-button replacement, Escape and picker",
  );
} finally {
  await browser.close();
  server.close();
}
