import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html");
assert.ok(!html.toString().includes("GodPowerPluginPlatform"));
const server = createServer((_, res) => {
  res.setHeader("Content-Type", "text/html;charset=utf-8");
  res.end(html);
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
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(page, 14);
  await page.evaluate(() => switchView("welcome"));
  await page.evaluate(() => {
    switchView("welcome");
    renderAll();
  });
  await page.waitForFunction(
    () => window.HomeDashboard?.getStatus().initialized,
  );
  assert.equal(await page.locator(".nav-tab").count(), 5);
  assert.equal(await page.locator("#view-plugins").count(), 0);
  assert.equal(
    await page.locator("#homeDashboardGrid [data-home-card-type]").count(),
    11,
  );
  const initial = await page.evaluate(() => ({
    layout: HomeDashboard.getStatus().layout,
    backup: JSON.stringify({
      groups: state.groups,
      picker: state.picker,
      ledger: state.achievementLedger,
    }),
  }));
  assert.ok(
    initial.layout.instances.every((i) => i.typeId.startsWith("core.")),
  );
  await mkdir("artifacts/web-transition", { recursive: true });
  await page.screenshot({
    path: "artifacts/web-transition/home-default-3.0.55.png",
    fullPage: true,
  });
  await page.locator('[data-home-action="edit"]').click();
  await page
    .locator(
      '[data-home-card-type="core.daily-item-tip"] [data-home-card-action="hide"]',
    )
    .click();
  assert.equal(
    await page.evaluate(() =>
      JSON.stringify({
        groups: state.groups,
        picker: state.picker,
        ledger: state.achievementLedger,
      }),
    ),
    initial.backup,
  );
  await page.locator('[data-home-action="save"]').click();
  await page.reload();
  await setup(page, 14);
  await page.evaluate(() => switchView("welcome"));
  await page.waitForFunction(
    () => window.HomeDashboard?.getStatus().initialized,
  );
  assert.equal(
    await page
      .locator('[data-home-card-type="core.daily-item-tip"]')
      .isVisible(),
    false,
  );
  await page.locator('[data-home-action="edit"]').click();
  await page
    .locator(
      '[data-home-card-type="core.leading-group"] [data-home-card-action="remove"]',
    )
    .click();
  await page.locator('[data-home-action="save"]').click();
  await page.evaluate(() => {
    const key = "godpower_home_layout_v1";
    const saved = JSON.parse(localStorage.getItem(key));
    const card = saved.layout.instances.find(
      (i) => i.typeId === "core.daily-item-tip",
    );
    card.typeId = "plugin.official.miyamotos.power.daily-item-tip";
    localStorage.setItem(key, JSON.stringify(saved));
  });
  await page.reload();
  await setup(page, 14);
  await page.evaluate(() => switchView("welcome"));
  await page.waitForFunction(
    () => window.HomeDashboard?.getStatus().initialized,
  );
  const migrated = await page.evaluate(() => HomeDashboard.getStatus().layout);
  assert.ok(
    !migrated.instances.some((i) => i.typeId === "core.leading-group"),
    "removed cards remain removed after reload",
  );
  assert.ok(
    migrated.instances.some(
      (i) => i.typeId === "core.daily-item-tip" && !i.visible,
    ),
    "legacy card ID maps to builtin and preserves visibility",
  );
  await page.evaluate(() => {
    switchView("settings");
    DesktopUI.selectSettings("items");
  });
  assert.equal(
    await page.locator('[data-category-panel="items"]').isVisible(),
    true,
  );
  assert.ok(await page.locator("#uiSettingsItemLibrary").count());
  await page.evaluate(() => DesktopUI.selectSettings("sound"));
  assert.equal(await page.locator("#uiSettingsItemFx").count(), 1);
  await page.evaluate(() => DesktopUI.selectSettings("students"));
  await page.evaluate(() => DesktopUI.selectSettings("teaching"));
  assert.equal(
    await page.locator('[data-category-panel="teaching"]').isVisible(),
    true,
  );
  await page.screenshot({
    path: "artifacts/web-transition/teaching-settings-3.0.55.png",
    fullPage: true,
  });
  for (const id of [
    "classroomRosterWorkspace",
    "teachingScheduleWorkspace",
    "teachingResourceWorkspace",
  ])
    assert.equal(await page.locator("#" + id).count(), 1);
  await page.evaluate(() => switchView("welcome"));
  await mkdir("artifacts/web-transition", { recursive: true });
  await page.screenshot({
    path: "artifacts/web-transition/home-3.0.55.png",
    fullPage: true,
  });
  assert.deepEqual(errors, []);
  console.log(
    "PASS standalone 11 built-in cards, hide/save/reload, five navigation entries, item/audio/roster/schedule/resource settings; errors=[]",
  );
} finally {
  await browser.close();
  server.close();
}
