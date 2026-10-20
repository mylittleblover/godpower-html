import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { launch, dismissStartup, setup } from "../fixtures/browser.mjs";

const html = await readFile("dist/godpower.html");
const server = createServer((_request, response) => {
  response.setHeader("Content-Type", "text/html;charset=utf-8");
  response.end(html);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const browser = await launch();
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("dialog", (dialog) => dialog.accept());
await mkdir("artifacts/miyamoto-plugin", { recursive: true });
try {
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await dismissStartup(page);
  await setup(page, 4);
  await page.locator('.nav-tab[data-view="settings"]').click();
  assert.equal(
    await page.locator("#communismModeSetting").count(),
    0,
    "legacy main settings no longer expose the item feature toggle",
  );
  assert.equal(
    await page.evaluate(() => isCommunismMode()),
    true,
    "default legacy setting remains enabled",
  );

  await page.locator('.nav-tab[data-view="plugins"]').click();
  await page.waitForFunction(
    () =>
      GodPowerPluginCenter.platform?.get("official.miyamotos-power")?.state ===
      "active",
  );
  assert.equal(
    await page.evaluate(() =>
      GodPowerPageShell.listByPlugin("official.miyamotos-power").some(
        (item) => item.kind === "settings" && item.localId === "settings",
      ),
    ),
    true,
    "the gameplay settings entry is registered in the plugin registry",
  );
  await page.getByRole("button", { name: "打开：道具百科与玩法" }).click();
  await page.waitForSelector(".miyamoto-plugin-workspace");
  assert.equal(await page.locator(".miyamoto-item-card").count(), 26);
  assert.equal(
    await page
      .locator('.miyamoto-item-card[data-item-key="ice_flower"] h5')
      .textContent(),
    "冰之花",
  );
  await page.waitForTimeout(3200);
  await page.screenshot({
    path: "artifacts/miyamoto-plugin/workspace.png",
    fullPage: true,
  });

  const toggle = page.getByRole("checkbox", { name: "启用道具玩法" });
  await toggle.uncheck();
  assert.equal(
    await page.evaluate(() => localStorage.getItem("politics_communism_mode")),
    "false",
    "plugin control writes the existing compatibility key",
  );
  assert.equal(
    await page.evaluate(() =>
      document.body.classList.contains("items-disabled"),
    ),
    true,
    "the existing item feature gate responds to the plugin setting",
  );
  await page.reload();
  await dismissStartup(page);
  await page.evaluate(() =>
    switchView("plugins/official.miyamotos-power/items"),
  );
  await page.waitForSelector(".miyamoto-plugin-workspace");
  assert.equal(await toggle.isChecked(), false, "legacy value survives reload");
  await page.waitForTimeout(3200);
  await page.screenshot({
    path: "artifacts/miyamoto-plugin/disabled.png",
    fullPage: true,
  });
  await toggle.check();
  await page.evaluate(() => {
    GodPowerPluginCenter.platform.deactivate("official.miyamotos-power");
    GodPowerPluginCenter.render();
  });
  assert.equal(
    await page.evaluate(() => localStorage.getItem("politics_communism_mode")),
    "true",
    "plugin deactivation does not delete or rewrite the legacy feature setting",
  );
  assert.equal(errors.length, 0, errors.join("\n"));
  console.log(
    JSON.stringify({
      status: "PASS",
      items: 26,
      viewport: "1920x1080@1x",
      errors,
    }),
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
