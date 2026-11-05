import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html"),
  server = createServer((_, r) => {
    // Match Electron's strict connect policy: embedded avatars must not use fetch(data:).
    r.setHeader(
      "Content-Security-Policy",
      "default-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' data:; img-src 'self' data: blob:; font-src 'self' data:; media-src 'self' data: blob:; connect-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'none'; form-action 'none'; frame-src 'none'",
    );
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
      "宝可梦",
      "索尼克系列",
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
  const decoded = await page.evaluate(async () => {
    let count = 0;
    for (const item of AvatarPresetCatalog.items) {
      const image = new Image();
      image.src = item.dataUrl;
      await image.decode();
      if (image.naturalWidth !== 160 || image.naturalHeight !== 160)
        throw Error(`Invalid preset dimensions: ${item.id}`);
      count++;
    }
    return count;
  });
  assert.equal(
    decoded,
    236,
    "all embedded images decode with external network blocked",
  );
  for (const [category, total, slug] of [
    ["宝可梦", 83, "pokemon"],
    ["索尼克系列", 38, "sonic"],
    ["任天堂与大乱斗", 84, "smash-official"],
  ]) {
    await page.locator("#avatarPresetDialog select").selectOption(category);
    const seen = [];
    for (let n = 0; n < Math.ceil(total / 24); n++) {
      await page
        .locator("#avatarPresetDialog [data-preset-card] img")
        .evaluateAll((images) =>
          Promise.all(images.map((image) => image.decode())),
        );
      seen.push(
        ...(await page
          .locator("#avatarPresetDialog [data-preset-card]")
          .evaluateAll((nodes) =>
            nodes.map((node) => node.dataset.presetCard),
          )),
      );
      await page.screenshot({
        path: `artifacts/avatar-presets/${slug}-${n + 1}.png`,
      });
      if (n + 1 < Math.ceil(total / 24))
        await page.locator("[data-preset-next]").click();
    }
    assert.equal(seen.length, total);
    assert.equal(
      new Set(seen).size,
      total,
      "pagination must not omit or duplicate presets",
    );
    assert.equal(await page.locator("[data-preset-next]").isDisabled(), true);
  }
  await page.locator("#avatarPresetDialog select").selectOption("宝可梦");
  await page.locator("#avatarPresetSearch").fill("魔幻假面喵");
  assert.equal(
    await page.locator('[data-preset-card="pokemon-0908"]').count(),
    1,
  );
  await page.locator("#avatarPresetDialog select").selectOption("索尼克系列");
  await page.locator("#avatarPresetSearch").fill("塔尔斯");
  assert.equal(
    await page.locator("#avatarPresetDialog [data-preset-card]").count(),
    2,
  );
  assert.match(
    await page.locator('[data-preset-card="sonic-classic-tails"]').innerText(),
    /经典版/,
  );
  await page.locator("#avatarPresetDialog select").selectOption("");
  await page.locator("#avatarPresetSearch").fill("马力欧");
  assert.equal(
    await page.locator("#avatarPresetDialog [data-preset-card]").count(),
    2,
    "official names also match 马力欧医生",
  );
  await page.locator('[data-preset-card="smash-mario"]').click();
  await page.waitForFunction(() => {
    const dialog = document.getElementById("avatarPresetDialog");
    return (
      !dialog.open ||
      dialog.querySelector("[role=status]").textContent.trim().length > 0
    );
  });
  assert.equal(
    await page.locator("#avatarPresetDialog").evaluate((dialog) => dialog.open),
    false,
    "embedded preset must save under Electron connect-src self without Failed to fetch",
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
    JSON.stringify({ status: "PASS", resource, decoded, errors }, null, 2),
  );
  console.log(
    "PASS offline preset search, upload pipeline, durable reload and clear",
  );
} finally {
  await browser.close();
  server.close();
}
