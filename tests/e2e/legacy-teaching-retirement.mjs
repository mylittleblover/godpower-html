import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, dismissStartup } from "../fixtures/browser.mjs";
await mkdir("artifacts/legacy-teaching-retirement", { recursive: true });
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
  await page.evaluate(async () => {
    localStorage.setItem("godpower_teaching_schedule_v1", " old broken{\n");
    const repo = await TeachingResourceRepository.open();
    try {
      await repo.addBatch([
        {
          file: new File(["legacy backup fixture"], "legacy.txt", {
            type: "text/plain",
          }),
          profileId: "profile-legacy-fixture",
          classroomId: "classroom-legacy-fixture",
          subjectId: "test",
          tags: [],
        },
      ]);
    } finally {
      repo.close();
    }
    switchView("settings");
    DesktopUI.selectSettings("data");
  });
  assert.equal(await page.locator('[data-category="teaching"]').count(), 0);
  assert.equal(
    await page
      .locator("#teachingResourceWorkspace, #teachingScheduleWorkspace")
      .count(),
    0,
  );
  await page.locator("[data-legacy-teaching-backup] summary").click();
  const pending = page.waitForEvent("download");
  await page.locator("[data-export-legacy-teaching]").click();
  const download = await pending;
  const backup = JSON.parse(await readFile(await download.path(), "utf8"));
  assert.equal(
    backup.rawStorage.godpower_teaching_schedule_v1,
    " old broken{\n",
  );
  assert.equal(backup.resources.length, 1);
  assert.equal(
    Buffer.from(backup.resources[0].dataBase64, "base64").toString(),
    "legacy backup fixture",
  );
  assert.equal(
    await page.evaluate(() =>
      localStorage.getItem("godpower_teaching_schedule_v1"),
    ),
    " old broken{\n",
  );
  assert.equal(
    await page.evaluate(async () => {
      const r = await TeachingResourceRepository.open();
      try {
        return (await r.list()).length;
      } finally {
        r.close();
      }
    }),
    1,
  );
  await page.screenshot({
    path: "artifacts/legacy-teaching-retirement/settings.png",
    animations: "disabled",
  });
  assert.deepEqual(errors, []);
  await writeFile(
    "artifacts/legacy-teaching-retirement/result.json",
    JSON.stringify(
      { status: "PASS", resources: backup.resources.length, errors },
      null,
      2,
    ),
  );
  console.log(
    "PASS retired teaching UI, exact raw backup, verified resources and unchanged original storage",
  );
} finally {
  await browser.close();
  server.close();
}
