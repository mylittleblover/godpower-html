import { chromium } from "playwright";
import assert from "node:assert/strict";
import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { dismissStartup } from "../fixtures/browser.mjs";
import { legacy } from "../fixtures/save-v2.mjs";
await mkdir("artifacts/save-offline", { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox"],
});
try {
  const context = await browser.newContext({
      offline: true,
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
      acceptDownloads: true,
    }),
    page = await context.newPage(),
    errors = [],
    remote = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("dialog", async (dialog) => {
    console.log("browser dialog:", dialog.type());
    await dialog.accept();
  });
  page.on("requestfailed", (r) =>
    console.log(
      "request failed:",
      r.url().split(":")[0],
      r.failure()?.errorText,
    ),
  );
  page.on("request", (r) => {
    if (/^https?:/.test(r.url())) remote.push(r.url());
  });
  await page.goto(pathToFileURL(path.resolve("dist/godpower.html")).href, {
    waitUntil: "domcontentloaded",
  });
  const ready = await page.evaluate(() => SaveManager.ready());
  assert.equal(ready.ok, true);
  await dismissStartup(page);
  const raw = legacy();
  raw.groups[0].groupAvatar =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
  const imported = await page.evaluate(async (raw) => {
    state.isLocked = false;
    return SaveManager.importSource(
      await SaveManager.previewSource(JSON.stringify(raw), "离线存档"),
    );
  }, raw);
  assert.equal(imported.ok, true);
  const saved = await page.evaluate(async () => {
    const ok = runClassroomCommand("离线保存回归", () => {
      state.groups[0].score += 2;
      return true;
    });
    const ack = await classroomCommands.whenIdle();
    return { ok, persisted: ack.persisted, score: state.groups[0].score };
  });
  assert.deepEqual(saved, { ok: true, persisted: true, score: 102 });
  const doc = await page.evaluate(() => SaveManager.snapshot());
  console.log(
    "before reload",
    await page.evaluate(() => ({
      ready: document.readyState,
      unsaved: classroomUnsavedChanges,
      status: SaveManager.status().phase,
    })),
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  assert.equal((await page.evaluate(() => SaveManager.ready())).ok, true);
  assert.equal(await page.evaluate(() => state.groups[0].score), 102);
  const loaded = await page.evaluate(() => SaveManager.exportCurrent());
  assert.equal(loaded.assets.length, 1);
  assert.equal(loaded.documents[0].saveId, doc.saveId);
  const download = page.waitForEvent("download");
  await page.evaluate(() => exportData());
  const d = await download;
  await d.saveAs("artifacts/save-offline/export.godpower-save.json");
  assert.equal(
    JSON.parse(
      await readFile(
        "artifacts/save-offline/export.godpower-save.json",
        "utf8",
      ),
    ).kind,
    "godpower.save-bundle",
  );
  await page.screenshot({ path: "artifacts/save-offline/file.png" });
  assert.deepEqual(errors, []);
  assert.deepEqual(remote, []);
  await writeFile(
    "artifacts/save-offline/result.json",
    JSON.stringify(
      {
        status: "PASS",
        protocol: "file:",
        offline: true,
        score: 102,
        assets: 1,
        errors,
        remoteRequests: remote.length,
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS file:// offline save, score ACK, reload, avatar bundle and JSON download without network",
  );
} finally {
  await browser.close();
}
