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
    path: "artifacts/home-dashboard/v3.0.46-home-dashboard-1920x1080.png",
    fullPage: true,
  });
  console.log(
    "PASS unified homepage grid, plugin ownership and 14-group source data",
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
