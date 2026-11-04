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
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("https://**", (route) => route.abort());
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.evaluate(() => SaveManager.ready());
  await setup(page, 14);
  await page.evaluate(async () => {
    await saveState();
    await SaveManager.whenIdle();
    switchView("settings");
    DesktopUI.selectSettings("students");
  });
  await page
    .locator("#saveWorkspaceStudentRows [data-avatar-id]")
    .first()
    .click();
  await page.waitForSelector("#avatarPresetDialog[open]", { timeout: 2000 });
  assert.equal(
    await page.locator("#avatarPresetDialog [data-preset-card]").count(),
    24,
  );
  await mkdir("artifacts/avatar-presets", { recursive: true });
  await page.screenshot({ path: "artifacts/avatar-presets/chooser.png" });
  const surface = await page
    .locator("#avatarPresetDialog")
    .evaluate((dialog) => {
      const r = dialog.getBoundingClientRect();
      const face = dialog.querySelector(".avatar-preset-surface") || dialog;
      return {
        centerX: r.x + r.width / 2,
        centerY: r.y + r.height / 2,
        background: getComputedStyle(face).backgroundColor,
        width: r.width,
        height: r.height,
      };
    });
  assert.ok(
    Math.abs(surface.centerX - 960) <= 2,
    "chooser must be centered horizontally",
  );
  assert.ok(
    Math.abs(surface.centerY - 540) <= 2,
    "chooser must be centered vertically",
  );
  assert.notEqual(
    surface.background,
    "rgba(0, 0, 0, 0)",
    "chooser must have an opaque panel",
  );
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    () => !document.getElementById("avatarPresetDialog").open,
  );
  assert.equal(
    await page.evaluate(() => DesktopUI.getClosingWindowCount()),
    0,
    "exit animation must release its ownership",
  );
  await page
    .locator("#saveWorkspaceStudentRows [data-avatar-id]")
    .first()
    .click();
  await page.waitForSelector("#avatarPresetDialog[open]");
  assert.deepEqual(
    await page.locator("#avatarPresetDialog select option").allTextContents(),
    [
      "全部分类",
      "花草",
      "岩石",
      "近代政治人物",
      "现代政治人物",
      "任天堂与大乱斗",
    ],
  );
  for (const [category, count] of [
    ["近代政治人物", 6],
    ["现代政治人物", 9],
    ["花草", 8],
    ["岩石", 8],
  ]) {
    await page.locator("#avatarPresetDialog select").selectOption(category);
    assert.equal(
      await page.locator("#avatarPresetDialog [data-preset-card]").count(),
      count,
    );
    if (/政治人物$/.test(category)) {
      await page
        .locator("#avatarPresetDialog [data-preset-card] img")
        .evaluateAll((images) =>
          Promise.all(images.map((image) => image.decode())),
        );
      await page.screenshot({
        path: `artifacts/avatar-presets/${category === "近代政治人物" ? "historical" : "modern"}-figures.png`,
      });
    }
  }
  await page.locator("#avatarPresetDialog select").selectOption("");
  await page.locator("#avatarPresetSearch").fill("马力欧");
  assert.equal(
    await page.locator("#avatarPresetDialog [data-preset-card]").count(),
    1,
  );
  await page.locator("#avatarPresetDialog [data-preset-card]").click();
  await page.waitForFunction(
    () => !document.getElementById("avatarPresetDialog").open,
  );
  await page.evaluate(() => SaveManager.whenIdle());
  const resource = await page.evaluate(
    () => SaveManager.rosterView().roster.students[0].avatarResourceId,
  );
  assert.match(resource, /^asset-/);
  await page.reload();
  await page.evaluate(() => SaveManager.ready());
  assert.equal(
    await page.evaluate(
      () => SaveManager.rosterView().roster.students[0].avatarResourceId,
    ),
    resource,
  );
  await setup(page, 14);
  await page.evaluate(() => {
    switchView("settings");
    DesktopUI.selectSettings("students");
  });
  await page
    .locator("#saveWorkspaceStudentRows [data-avatar-id]")
    .first()
    .click();
  await page.locator("#avatarPresetDialog [data-avatar-clear]").click();
  await page.waitForFunction(
    () => !document.getElementById("avatarPresetDialog").open,
  );
  assert.equal(
    await page.evaluate(
      () => SaveManager.rosterView().roster.students[0].avatarResourceId,
    ),
    null,
  );
  assert.deepEqual(errors, []);
  await mkdir("artifacts/avatar-presets", { recursive: true });
  await writeFile(
    "artifacts/avatar-presets/result.json",
    JSON.stringify({ status: "PASS", resource, errors }, null, 2),
  );
  console.log(
    "PASS offline preset search, upload pipeline, durable reload and clear",
  );
} finally {
  await browser.close();
  server.close();
}
