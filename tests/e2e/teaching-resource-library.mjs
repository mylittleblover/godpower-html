import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdir, readFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";

const html = await readFile("dist/godpower.html");
const server = createServer((_, response) => {
  response.setHeader("Content-Type", "text/html;charset=utf-8");
  response.end(html);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const browser = await launch("chromium");
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  acceptDownloads: true,
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
await page.addInitScript(() => {
  window.__revokedResourceUrls = [];
  const revoke = URL.revokeObjectURL.bind(URL);
  URL.revokeObjectURL = (url) => {
    window.__revokedResourceUrls.push(url);
    revoke(url);
  };
});

try {
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await setup(page, 4);
  await page.evaluate(() => {
    const groups = StableIdentity.assignGroupUids(state.groups);
    const roster = ClassroomRoster.previewLegacyRoster({
      classroomId: "classroom-resource-test",
      userProfileId: "profile-resource-test",
      classroomName: "资源测试班",
      profileName: "资源教师",
      groups,
    });
    ClassroomRosterRepository.createClassroomRosterRepository({
      storage: localStorage,
    }).write(roster, { expectedRevision: 0 });
    switchView("settings");
    DesktopUI.selectSettings("students");
  });
  await page
    .locator("#teachingResourceWorkspace")
    .waitFor({ state: "visible" });
  await page.locator("#teachingResourceSubject").fill("政治");
  await page.locator("#teachingResourceTitle").fill("权利与义务");
  await page.locator("#teachingResourceTags").fill("复习，必修");
  await page.locator("#teachingResourceFiles").setInputFiles({
    name: "rights.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("课堂离线文本资源"),
  });
  await page.locator("#teachingResourceImport").click();
  await page
    .locator(".teaching-resource-card")
    .first()
    .waitFor({ state: "visible" });
  assert.match(
    await page.locator("#teachingResourceList").innerText(),
    /权利与义务/,
  );

  const pngBytes = await page.evaluate(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 2;
    canvas.height = 2;
    const context = canvas.getContext("2d");
    context.fillStyle = "#167f73";
    context.fillRect(0, 0, 2, 2);
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );
    return [...new Uint8Array(await blob.arrayBuffer())];
  });
  await page.locator("#teachingResourceTitle").fill("课堂插图");
  await page.locator("#teachingResourceFiles").setInputFiles({
    name: "board.png",
    mimeType: "image/png",
    buffer: Buffer.from(pngBytes),
  });
  await page.locator("#teachingResourceImport").click();
  await page.waitForFunction(
    () => document.querySelectorAll(".teaching-resource-card").length === 2,
  );
  await page
    .locator(".teaching-resource-card")
    .filter({ hasText: "课堂插图" })
    .locator("button", { hasText: "预览" })
    .click();
  const imagePreview = page.locator("dialog.teaching-resource-preview img");
  await imagePreview.waitFor({ state: "visible" });
  await imagePreview.evaluate((image) => image.decode());
  const objectUrl = await imagePreview.getAttribute("src");
  await page
    .locator(
      "dialog.teaching-resource-preview button[aria-label='关闭资源预览']",
    )
    .click();
  await page
    .locator("dialog.teaching-resource-preview")
    .waitFor({ state: "detached" });
  assert.equal(
    await page.evaluate(
      (url) => window.__revokedResourceUrls.includes(url),
      objectUrl,
    ),
    true,
    "closing an image preview must revoke its Blob URL",
  );

  await page.locator("#teachingResourceTitle").fill("课堂 PDF 讲义");
  await page.locator("#teachingResourceFiles").setInputFiles({
    name: "handout.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.7\n%%EOF"),
  });
  await page.locator("#teachingResourceImport").click();
  await page.waitForFunction(
    () => document.querySelectorAll(".teaching-resource-card").length === 3,
  );
  await page
    .locator(".teaching-resource-card")
    .filter({ hasText: "课堂 PDF 讲义" })
    .locator("button", { hasText: "预览" })
    .click();
  await page
    .locator("dialog.teaching-resource-preview")
    .waitFor({ state: "visible" });
  assert.match(
    await page.locator(".teaching-resource-preview-body").innerText(),
    /不会嵌入页面/,
  );
  assert.equal(
    await page
      .locator(
        ".teaching-resource-preview-body iframe, .teaching-resource-preview-body embed, .teaching-resource-preview-body object",
      )
      .count(),
    0,
  );
  await page
    .locator(
      "dialog.teaching-resource-preview button[aria-label='关闭资源预览']",
    )
    .click();
  await page
    .locator("dialog.teaching-resource-preview")
    .waitFor({ state: "detached" });

  await page.locator("#teachingResourceSearch").fill("必修");
  assert.equal(await page.locator(".teaching-resource-card").count(), 3);
  await page.locator("#teachingResourceSearch").fill("不存在");
  assert.equal(await page.locator(".teaching-resource-card").count(), 0);
  await page.locator("#teachingResourceSearch").fill("");

  await page
    .locator(".teaching-resource-card")
    .filter({ hasText: "权利与义务" })
    .locator("button", { hasText: "预览" })
    .click();
  await page
    .locator("dialog.teaching-resource-preview")
    .waitFor({ state: "visible" });
  assert.match(
    await page.locator(".teaching-resource-preview-body").innerText(),
    /课堂离线文本资源/,
  );
  await page
    .locator(
      "dialog.teaching-resource-preview button[aria-label='关闭资源预览']",
    )
    .click();
  await page
    .locator("dialog.teaching-resource-preview")
    .waitFor({ state: "detached" });

  const downloadEvent = page.waitForEvent("download");
  await page
    .locator(".teaching-resource-card")
    .filter({ hasText: "权利与义务" })
    .locator("button", { hasText: "下载" })
    .click();
  const download = await downloadEvent;
  const downloadedFile = await download.path();
  assert.equal(download.suggestedFilename(), "rights.txt");
  assert.equal((await readFile(downloadedFile)).toString(), "课堂离线文本资源");

  const backupEvent = page.waitForEvent("download");
  await page.locator("#teachingResourceExport").click();
  const backup = await backupEvent;
  const backupFile = await backup.path();
  const backupBytes = await readFile(backupFile);
  const pack = JSON.parse(backupBytes.toString());
  assert.equal(pack.format, "godpower-teaching-resources");
  assert.equal(pack.resources.length, 3);

  for (const title of ["权利与义务", "课堂插图", "课堂 PDF 讲义"]) {
    page.once("dialog", (dialog) => dialog.accept());
    await page
      .locator(".teaching-resource-card")
      .filter({ hasText: title })
      .locator("button", { hasText: "删除" })
      .click();
  }
  await page.waitForFunction(
    () => document.querySelectorAll(".teaching-resource-card").length === 0,
  );
  await page.locator("#teachingResourceRestoreFile").setInputFiles({
    name: "classroom.gpresources.json",
    mimeType: "application/json",
    buffer: backupBytes,
  });
  await page.locator("#teachingResourceRestore").click();
  await page
    .locator(".teaching-resource-card")
    .first()
    .waitFor({ state: "visible" });
  assert.match(
    await page.locator("#teachingResourceStatus").innerText(),
    /完整验证并恢复/,
  );
  await mkdir("artifacts/f2-teaching-schedule", { recursive: true });
  await page.locator("#teachingResourceWorkspace").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: "artifacts/f2-teaching-schedule/resource-library-1920x1080.png",
  });
  await page.locator("#teachingResourceWorkspace").screenshot({
    path: "artifacts/f2-teaching-schedule/resource-library-panel.png",
  });

  const corruptedPack = structuredClone(pack);
  corruptedPack.resources[0].sha256 = "0".repeat(64);
  await page.locator("#teachingResourceRestoreFile").setInputFiles({
    name: "corrupted.gpresources.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(corruptedPack)),
  });
  await page.locator("#teachingResourceRestore").click();
  await page.waitForFunction(
    () =>
      document.querySelector("#teachingResourceStatus").dataset.state ===
      "error",
  );
  assert.equal(await page.locator(".teaching-resource-card").count(), 3);
  assert.match(
    await page.locator("#teachingResourceStatus").innerText(),
    /现有资源保持不变/,
  );

  assert.deepEqual(errors, []);
  console.log(
    "PASS teaching resources import, search, safe preview, download, backup restore and failure rollback",
  );
} finally {
  await context.close();
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
