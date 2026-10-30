import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdir, readFile } from "node:fs/promises";
import { launch } from "../fixtures/browser.mjs";

const html = await readFile("dist/godpower.html");
const server = createServer((_, response) => {
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.end(html);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const browser = await launch();
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
  acceptDownloads: true,
});
const corruptRaw = '{"groups":[{"score":0}],"tampered":';
await context.addInitScript((raw) => {
  localStorage.setItem("godpower_state_v2", raw);
  localStorage.setItem(
    "godpower_state_v1",
    JSON.stringify({
      schemaVersion: 1,
      groups: [{ id: 1, name: "恢复候选组", score: 17, members: [] }],
    }),
  );
}, corruptRaw);
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
try {
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  await page.evaluate(() => {
    document.querySelector("#gpIntro")?.remove();
    document.body.classList.remove("gp-intro-active");
  });
  assert.equal(await page.locator("#classroomRecoveryTools").isVisible(), true);
  const beforeScan = await page.evaluate(() => ({
    raw: localStorage.getItem("godpower_state_v2"),
    groups: state.groups.map((g) => g.name),
  }));
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.evaluate(() =>
      document.querySelector("#classroomRecoveryExportRaw").click(),
    ),
  ]);
  assert.match(download.suggestedFilename(), /corrupt.*raw/i);
  assert.equal(await readFile(await download.path(), "utf8"), corruptRaw);
  await page.evaluate(() =>
    document.querySelector("#classroomRecoveryScan").click(),
  );
  await page.waitForFunction(
    () => document.querySelectorAll("[data-recovery-candidate]").length > 0,
  );
  assert.match(
    await page.locator("[data-recovery-candidate]").first().innerText(),
    /godpower_state_v1.*1.*17/,
  );
  await page.evaluate(() => {
    document.querySelector("[data-recovery-preview]").click();
  });
  await mkdir("artifacts/gp-016", { recursive: true });
  await page.screenshot({
    path: "artifacts/gp-016/classroom-recovery-1920x1080.png",
  });
  assert.deepEqual(
    await page.evaluate(() => ({
      raw: localStorage.getItem("godpower_state_v2"),
      groups: state.groups.map((g) => g.name),
    })),
    beforeScan,
    "scan and export must not mutate the corrupt source or live classroom",
  );
  await page.evaluate(() => {
    window.themeConfirm = async () => false;
  });
  await page.evaluate(() => {
    document.querySelector("#classroomRecoveryRestore").click();
  });
  assert.deepEqual(
    await page.evaluate(() => ({
      raw: localStorage.getItem("godpower_state_v2"),
      names: state.groups.map((g) => g.name),
    })),
    { raw: corruptRaw, names: beforeScan.groups },
    "cancel must keep all existing data",
  );
  await page.evaluate(() => {
    state.isLocked = false;
  }); // Recovery confirmation still obeys the existing teacher lock.
  await page.evaluate(() => {
    window.themeConfirm = async () => true;
  });
  await page.evaluate(() => {
    document.querySelector("[data-recovery-preview]").click();
    document.querySelector("#classroomRecoveryRestore").click();
  });
  await page.waitForFunction(
    () =>
      !window.classroomRecoveryRequired ||
      document
        .querySelector("#classroomRecoveryStatus")
        .textContent.includes("恢复失败"),
  );
  assert.equal(
    await page.evaluate(() => window.classroomRecoveryRequired),
    false,
    await page.locator("#classroomRecoveryStatus").innerText(),
  );
  assert.equal(await page.evaluate(() => state.groups[0].name), "恢复候选组");
  assert.match(
    await page.evaluate(() => localStorage.getItem(Reliability.stateKey)),
    /恢复候选组/,
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  assert.equal(await page.evaluate(() => state.groups[0].name), "恢复候选组");
  assert.deepEqual(errors, []);
  console.log(
    "PASS corrupt primary raw export, read-only mirror scan, cancel safety, explicit recovery and reload",
  );
} finally {
  await browser.close();
  server.close();
}
