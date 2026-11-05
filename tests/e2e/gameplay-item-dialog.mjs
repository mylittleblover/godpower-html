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
    }),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.evaluate(() => SaveManager.ready());
  await setup(page, 14);
  await page.evaluate(async () => {
    await saveState();
    await SaveManager.whenIdle();
    switchView("gameplay");
  });
  assert.equal(
    await page.locator("[data-item-details]").count(),
    28,
    "item descriptions open a modal instead of an accordion",
  );
  const before = await page.evaluate(() =>
    JSON.stringify({
      groups: state.groups,
      itemGlobal: state.itemGlobal,
      history: historyStack,
      ledger: state.achievementLedger,
    }),
  );
  await page.locator('[data-item-details="green"]').click();
  await page.waitForSelector("#gameplayItemDialog[open]");
  assert.match(
    await page.locator("#gameplayItemDialog").innerText(),
    /绿龟壳|实际效果|使用技巧/,
  );
  await page.locator("[data-item-preview-play]").click();
  await page.waitForSelector("#gameplayItemDialog .bm-layer");
  assert.equal(
    await page.locator("#gameplayItemDialog .battle-card [onclick]").count(),
    0,
    "demo cards cannot invoke real commands",
  );
  await mkdir("artifacts/gameplay-item-dialog", { recursive: true });
  await page.screenshot({
    path: "artifacts/gameplay-item-dialog/green-preview.png",
  });
  await page.locator("[data-item-dialog-close]").click();
  await page.waitForFunction(
    () => !document.getElementById("gameplayItemDialog").open,
  );
  assert.equal(await page.locator("#gameplayItemDialog .bm-layer").count(), 0);
  const previews = await page.evaluate(() =>
    ITEM_KEYS.map((key) => {
      GameplayItemDialog.open(key);
      GameplayItemDialog.replay();
      const node = document.querySelector("#gameplayItemDialog .bm-layer");
      const entry = { key, rendered: !!node, family: node?.dataset.family };
      GameplayItemDialog.close();
      DesktopUI.finishWindowClose(
        document.getElementById("gameplayItemDialog"),
      );
      return entry;
    }),
  );
  assert.equal(previews.length, 28);
  assert.ok(
    previews.every((p) => p.rendered),
    "all existing items use their real motion family",
  );
  const after = await page.evaluate(() =>
    JSON.stringify({
      groups: state.groups,
      itemGlobal: state.itemGlobal,
      history: historyStack,
      ledger: state.achievementLedger,
    }),
  );
  assert.equal(after, before, "all previews leave classroom data unchanged");
  assert.equal(
    await page.evaluate(() => BattleMotion.activeCount()),
    0,
    "previews cannot register as live battle effects",
  );
  await page.evaluate(() => {
    GameplayItemDialog.open("star");
    switchView("battle");
  });
  assert.equal(
    await page.locator("#gameplayItemDialog").evaluate((dialog) => dialog.open),
    false,
    "page scope owns and closes its dialog when navigation changes",
  );
  assert.equal(await page.locator("#gameplayItemDialog .bm-layer").count(), 0);
  assert.deepEqual(errors, []);
  await writeFile(
    "artifacts/gameplay-item-dialog/result.json",
    JSON.stringify(
      { status: "PASS", previews, unchanged: true, errors },
      null,
      2,
    ),
  );
  console.log(
    "PASS28 isolated real-motion item previews, modal lifecycle and unchanged scores/inventory/history",
  );
} finally {
  await browser.close();
  server.close();
}
