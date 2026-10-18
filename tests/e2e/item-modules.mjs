import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
const server = createServer(async (_, res) => {
  res.setHeader("Content-Type", "text/html;charset=utf-8");
  res.end(await readFile("dist/godpower.html"));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch(),
  page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("dialog", async (dialog) => {
  console.log("Browser dialog:", dialog.type(), dialog.message());
  await dialog.accept();
});
try {
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(page, 14);
  await page.evaluate(() => {
    legacyUseItem = () => {
      throw Error("public pipeline must not call legacy dispatcher");
    };
  });
  assert.equal(await page.evaluate(() => ItemModules.catalog().length), 26);
  await page.evaluate(() => {
    switchView("settings");
    DesktopUI.selectSettings("items");
  });
  assert.equal(await page.locator(".im-settings").count(), 1);
  assert.equal(
    await page
      .locator('[data-category-panel="items"] .ui-settings-title')
      .count(),
    1,
  );
  await page.locator('[data-item-key="coin"]').click();
  await page.locator('[name="coin.draw.weight"]').fill("2");
  await page.locator('[name="coin.draw.weight"]').dispatchEvent("change");
  assert.equal(
    await page.evaluate(
      () => ItemModules.configuration().items.coin.draw.weight,
    ),
    2,
  );
  await page.locator("#im-tab-operation").click();
  await page.locator('[name="coin.operation.scoreMultiplier"]').fill("3");
  await page
    .locator('[name="coin.operation.scoreMultiplier"]')
    .dispatchEvent("change");
  const coin = await page.evaluate(() => {
    const g = state.groups[0];
    g.inventory = [];
    g.score = 100;
    addItemToGroup(g, "coin");
    const ok = useItem(g.id, 0);
    return { ok, score: g.score };
  });
  assert.deepEqual(coin, { ok: true, score: 106 });
  await page.evaluate(() => {
    const v = ItemModules.defaults();
    v.items.fire_flower.draw.charges = 7;
    v.items.fire_flower.operation.scoreMultiplier = 2;
    ItemModules.update(v);
  });
  await setup(page, 4);
  const fire = await page.evaluate(() => {
    const original = Math.random;
    Math.random = () => 0;
    const a = state.groups[1],
      t = state.groups[0];
    addItemToGroup(a, "fire_flower");
    const ok = useItem(a.id, 0);
    Math.random = original;
    const charges = a.inventory[0].charges;
    const v = ItemModules.configuration();
    v.items.fire_flower.draw.charges = 1;
    ItemModules.update(v);
    ensureItemState();
    repairFlowerChargesV21719();
    return {
      ok,
      score: t.score,
      charges,
      afterChange: a.inventory[0].charges,
      marker: a.inventory[0].configuredCharges,
    };
  });
  assert.deepEqual(fire, {
    ok: true,
    score: 50,
    charges: 6,
    afterChange: 6,
    marker: 7,
  });
  const gate = await page.evaluate(() => {
    const v = ItemModules.configuration();
    v.items.fire_flower.operation.enabled = false;
    ItemModules.update(v);
    state.groups[1].itemUsedThisRound = false;
    const before = JSON.stringify(getPersistableGroups()),
      h = historyStack.length;
    const ok = useItem(state.groups[1].id, 0);
    return {
      ok,
      unchanged: JSON.stringify(getPersistableGroups()) === before,
      historyUnchanged: h === historyStack.length,
    };
  });
  assert.deepEqual(gate, {
    ok: false,
    unchanged: true,
    historyUnchanged: true,
  });

  await setup(page, 4);
  const zero = await page.evaluate(() => {
    const v = ItemModules.defaults();
    v.items.ice_flower.operation.scoreMultiplier = 0;
    ItemModules.update(v);
    const a = state.groups[1],
      t = state.groups[0];
    state.groups[2].score = -1;
    state.groups[3].score = -1;
    t.inventory = [{ key: "green", charges: 1, acquiredAt: 123 }];
    addItemToGroup(a, "ice_flower");
    useItem(a.id, 0);
    return {
      score: t.score,
      defense: t.inventory.length,
      ice: !!t.itemEffect?.iceLock,
    };
  });
  assert.deepEqual(zero, { score: 100, defense: 0, ice: false });
  await setup(page, 4);
  const starFire = await page.evaluate(() => {
    ItemModules.update(ItemModules.defaults());
    const a = state.groups[1];
    a.itemEffect = { type: "star", hitsLeft: 3 };
    a.inventory = [ItemModules.inventory("fire_flower")];
    const prev = Math.random;
    Math.random = () => 0.6;
    useItem(a.id, 0);
    Math.random = prev;
    return state.groups[2].score;
  });
  assert.equal(starFire, 135);
  const empty = await page.evaluate(() => {
    const v = ItemModules.configuration();
    for (const x of Object.values(v.items)) x.draw.enabled = false;
    ItemModules.update(v);
    return {
      single: drawItemForGroup(state.groups[0]),
      session: pickItemForGroupV281(state.groups[0]),
    };
  });
  assert.deepEqual(empty, { single: null, session: null });
  await page.reload({ waitUntil: "domcontentloaded" });
  await setup(page);
  assert.equal(
    await page.evaluate(
      () => ItemModules.configuration().items.coin.draw.enabled,
    ),
    false,
  );
  await page.evaluate(() => {
    ItemModules.update(ItemModules.defaults());
    switchView("settings");
    DesktopUI.selectSettings("items");
    ItemModuleSettings.mount(
      document.querySelector('[data-category-panel="items"]'),
    );
  });
  await page.waitForFunction(() => DesktopUI.getSettingsMotionCount() === 0);
  assert.equal(await page.locator(".im-settings").isVisible(), true);
  assert.equal(
    await page.locator('[name="green.draw.enabled"]').isChecked(),
    true,
  );
  await mkdir("artifacts/item-modules", { recursive: true });
  await page.screenshot({ path: "artifacts/item-modules/settings.png" });
  await writeFile(
    "artifacts/item-modules/result.json",
    JSON.stringify(
      {
        status: "PASS",
        viewport: "1920x1080 1x",
        checks: [
          "26 independent configs",
          "two pipeline settings",
          "weight save",
          "coin multiplier",
          "fire multiplier",
          "configured charges preserved",
          "disabled use no state/history change",
          "all disabled pools empty",
          "reload persistence",
        ],
        errors,
      },
      null,
      2,
    ),
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS item modules: real configured use, separate flows, inventory, empty pool, reload and settings",
  );
} finally {
  await browser.close();
  server.close();
}
