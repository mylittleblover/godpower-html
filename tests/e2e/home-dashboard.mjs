import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { launch, setup } from "../fixtures/browser.mjs";

const html = await readFile("dist/godpower.html");
const server = createServer((request, response) => {
  response.setHeader("Content-Type", "text/html;charset=utf-8");
  response.end(html);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const browser = await launch();
const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
try {
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  await page.locator("#gpIntroSkip").click();
  await page.waitForFunction(
    () => window.HomeDashboard?.getStatus().initialized,
  );
  await setup(page, 14);
  await page.evaluate(() => {
    switchView("welcome");
    renderAll();
  });
  await page.waitForFunction(
    () => document.querySelectorAll("#uiDailyGrid > article").length >= 3,
  );

  const state = await page.evaluate(() => {
    const grid = document.getElementById("homeDashboardGrid");
    const hero = document.querySelector("#view-welcome .gp-hero");
    const core = [...grid.querySelectorAll("[data-home-card-type]")].map(
      (node) => ({
        type: node.dataset.homeCardType,
        parent: node.parentElement.id,
      }),
    );
    const plugin = [...grid.querySelectorAll("[data-home-plugin-owner]")].map(
      (node) => ({
        owner: node.dataset.homePluginOwner,
        type: node.dataset.homeCardType || null,
      }),
    );
    return {
      gridDisplay: getComputedStyle(grid).display,
      heroInGrid: grid.contains(hero),
      core,
      plugin,
      groupCount: grid.querySelectorAll(".gp-kpi").length,
      rankingRows: grid.querySelectorAll("#gpRankList .gp-rank-row").length,
      dailyCount: grid.querySelectorAll("#uiDailyGrid article").length,
      pageWidth: document.documentElement.scrollWidth,
      viewportWidth: innerWidth,
      layoutRevision: grid.dataset.layoutRevision,
    };
  });
  assert.equal(state.gridDisplay, "grid");
  assert.equal(
    state.heroInGrid,
    false,
    "green hero remains fixed outside layout",
  );
  assert.equal(state.groupCount, 4);
  assert.equal(state.rankingRows, 14);
  assert.ok(state.dailyCount >= 3);
  assert.ok(state.core.some((item) => item.type === "core.live-ranking"));
  assert.ok(state.core.some((item) => item.type === "core.group-showcase"));
  assert.ok(
    state.plugin.some((item) => item.owner === "official.miyamotos-power"),
    "item-tip card belongs to gameplay plugin",
  );
  assert.ok(
    state.plugin.some((item) => item.owner === "official.marx-politics"),
    "knowledge/subject question cards belong to the subject plugin",
  );
  assert.ok(
    state.plugin.filter((item) => item.owner === "official.marx-politics")
      .length >= 2,
  );
  assert.ok(
    state.plugin.every((item) => item.type === null),
    "plugin-owned content is not misregistered as a core card",
  );
  assert.ok(state.pageWidth <= state.viewportWidth + 1);
  assert.deepEqual(errors, []);
  await mkdir("artifacts/home-dashboard", { recursive: true });
  await page.screenshot({
    path: "artifacts/home-dashboard/v3.0.47-home-dashboard-1920x1080.png",
    fullPage: true,
  });

  const classroomBefore = await page.evaluate(() =>
    localStorage.getItem("godpower_state_v2"),
  );
  const ranking = page.locator(".gp-rank-panel");
  const start = await ranking.evaluate((node) => ({
    column: getComputedStyle(node).gridColumnStart,
    row: getComputedStyle(node).gridRowStart,
  }));
  await page.locator('[data-home-action="edit"]').click();
  const drag = page.locator(".home-card-drag-handle").nth(4);
  await drag.focus();
  await drag.press("ArrowRight");
  const moved = await ranking.evaluate((node) => ({
    column: getComputedStyle(node).gridColumnStart,
    row: getComputedStyle(node).gridRowStart,
  }));
  assert.notDeepEqual(moved, start, "keyboard can move a core card");
  await page.locator('[data-home-action="undo"]').click();
  assert.deepEqual(
    await ranking.evaluate((node) => ({
      column: getComputedStyle(node).gridColumnStart,
      row: getComputedStyle(node).gridRowStart,
    })),
    start,
    "undo restores card placement",
  );
  const dragHandle = ranking.locator(".home-card-drag-handle");
  const dragBox = await dragHandle.boundingBox();
  const cellWidth = await page
    .locator("#homeDashboardGrid")
    .evaluate((node) => (node.clientWidth - 14 * 11) / 12);
  await page.mouse.move(dragBox.x + 10, dragBox.y + 10);
  await page.mouse.down();
  await page.mouse.move(dragBox.x + cellWidth + 24, dragBox.y + 10, {
    steps: 4,
  });
  await page.mouse.up();
  assert.notEqual(
    await ranking.evaluate((node) => getComputedStyle(node).gridColumnStart),
    start.column,
    "pointer drag moves a card in the layout grid",
  );
  await page.locator('[data-home-action="undo"]').click();
  assert.equal(
    await ranking.evaluate((node) => getComputedStyle(node).gridColumnStart),
    start.column,
  );
  const originalSpan = await ranking.evaluate(
    (node) => getComputedStyle(node).gridColumnEnd,
  );
  await ranking.locator(".home-card-resize-handle").click();
  assert.notEqual(
    await ranking.evaluate((node) => getComputedStyle(node).gridColumnEnd),
    originalSpan,
    "resize handle changes card size",
  );
  await page.locator('[data-home-action="undo"]').click();
  const groupCard = page.locator(".gp-group-section");
  await groupCard.locator('[data-home-card-action="hide"]').click();
  assert.equal(await groupCard.evaluate((node) => node.hidden), true);
  await page.locator('[data-home-action="add"]').click();
  await page.locator("[data-restore-card-id]").click();
  assert.equal(await groupCard.evaluate((node) => node.hidden), false);
  const honorCard = page.locator(".gp-daily-honors");
  if (await honorCard.count()) {
    await honorCard.locator('[data-home-card-action="remove"]').click();
    assert.equal(await honorCard.evaluate((node) => node.hidden), true);
    await page.locator('[data-home-action="add"]').click();
    await page.locator('[data-add-card-type="core.history-honor"]').click();
    assert.equal(await honorCard.evaluate((node) => node.hidden), false);
  }
  await page.locator('[data-home-action="save"]').click();
  const persisted = await page.evaluate(() => ({
    classroom: localStorage.getItem("godpower_state_v2"),
    layout: JSON.parse(localStorage.getItem("godpower_home_layout_v1")),
  }));
  assert.equal(
    persisted.classroom,
    classroomBefore,
    "layout editing never writes classroom state",
  );
  assert.equal(persisted.layout.schemaVersion, 1);
  assert.equal(persisted.layout.revision, 1);
  assert.equal(persisted.layout.layout.revision, 2);
  const savedLayoutBytes = JSON.stringify(persisted.layout);
  await page.locator('[data-home-action="edit"]').click();
  const secondDrag = page.locator(".home-card-drag-handle").nth(4);
  await secondDrag.focus();
  await secondDrag.press("ArrowDown");
  await page.locator('[data-home-action="cancel"]').click();
  assert.equal(
    await page.evaluate(() => localStorage.getItem("godpower_home_layout_v1")),
    savedLayoutBytes,
    "cancel discards the draft without rewriting the saved layout",
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator("#gpIntroSkip").click();
  await page.waitForFunction(
    () => window.HomeDashboard?.getStatus().initialized,
  );
  assert.equal(
    await page.locator(".gp-group-section").evaluate((node) => node.hidden),
    false,
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS unified grid, plugin ownership, edit/undo/restore, persistence and classroom isolation",
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
