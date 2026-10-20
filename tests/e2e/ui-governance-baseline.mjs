import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { launch, setup, dismissStartup } from "../fixtures/browser.mjs";
import { battle14, measure14 } from "../fixtures/battle14.mjs";

const html = await readFile("dist/godpower.html");
const server = createServer((_request, response) => {
  response.setHeader("Content-Type", "text/html;charset=utf-8");
  response.end(html);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const browser = await launch();
const evidenceDir =
  process.env.UI_GOVERNANCE_ARTIFACT_DIR || "artifacts/ui-governance-m0";
await mkdir(`${evidenceDir}/screenshots`, { recursive: true });
const pageErrors = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  await dismissStartup(page);
  await setup(page, 14);
  await page.evaluate(battle14, 1);
  await page.waitForTimeout(500);
  const battle = await page.evaluate(measure14);
  await page.screenshot({
    path: `${evidenceDir}/screenshots/battle-14.png`,
    fullPage: true,
  });
  assert.equal(battle.cards.length, 14);
  assert.ok(
    battle.cards.every((card) => card.bottom <= battle.dock.top),
    "all 14 cards must remain above bottom dock",
  );

  const views = {};
  for (const view of [
    "welcome",
    "battle",
    "history",
    "archives",
    "plugins",
    "settings",
  ]) {
    await page.evaluate((value) => switchView(value), view);
    await page.waitForTimeout(250);
    const element = page.locator(`#view-${view}`);
    assert.equal(
      await element.isVisible(),
      true,
      `${view} root should be visible`,
    );
    views[view] = await element.evaluate((node) => {
      const rect = node.getBoundingClientRect();
      return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        scrollHeight: node.scrollHeight,
        clientHeight: node.clientHeight,
        pageScrollHeight: document.documentElement.scrollHeight,
      };
    });
    await page.screenshot({
      path: `${evidenceDir}/screenshots/${view}.png`,
      fullPage: true,
    });
  }
  await page.evaluate(() => {
    switchView("battle");
    openPickerModal();
  });
  await page.waitForTimeout(250);
  await page.screenshot({
    path: `${evidenceDir}/screenshots/picker.png`,
    fullPage: true,
  });
  const result = {
    status: pageErrors.length ? "FAIL" : "PASS",
    environment: {
      browser: "Chromium",
      viewport: "1920x1080",
      deviceScaleFactor: 1,
      transport: "HTTP localhost",
    },
    sourceHtmlBytes: html.byteLength,
    pageErrors,
    views,
    battle14: battle,
    screenshots: [
      "welcome.png",
      "battle.png",
      "history.png",
      "archives.png",
      "plugins.png",
      "settings.png",
      "picker.png",
      "battle-14.png",
    ].map((name) => `${evidenceDir}/screenshots/${name}`),
  };
  await writeFile(
    `${evidenceDir}/browser-baseline.json`,
    `${JSON.stringify(result, null, 2)}\n`,
  );
  console.log(
    JSON.stringify({
      status: result.status,
      viewport: result.environment.viewport,
      deviceScaleFactor: result.environment.deviceScaleFactor,
      cards: battle.cards.length,
      pageErrors,
    }),
  );
  assert.equal(
    pageErrors.length,
    0,
    "browser should not report uncaught page errors",
  );
} finally {
  await browser.close();
  server.close();
}
