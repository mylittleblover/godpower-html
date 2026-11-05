import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, dismissStartup } from "../fixtures/browser.mjs";
await mkdir("artifacts/gameplay-page", { recursive: true });
const html = await readFile("dist/godpower.html"),
  server = createServer((_, r) => {
    r.setHeader("content-type", "text/html;charset=utf-8");
    r.end(html);
  });
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
try {
  const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
    }),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:" + server.address().port, {
    waitUntil: "domcontentloaded",
  });
  await page.evaluate(() => SaveManager.ready());
  await dismissStartup(page);
  assert.equal(
    await page.locator('.nav-tab[data-view="gameplay"]').count(),
    1,
    "gameplay must be a first-level page",
  );
  await page.locator('.nav-tab[data-view="gameplay"]').click();
  assert.equal(await page.locator("#view-gameplay").isVisible(), true);
  const counts = await page.evaluate(() => ({
    expected: ITEM_ORDER_V218.filter((k) => ITEM_DEFS[k]).length,
    items: document.querySelectorAll(
      "#gameplayContent > .item-reference-list > .item-reference-row",
    ).length,
    statuses: document.querySelectorAll(
      "#gameplayContent .competition-status-list>.item-reference-row",
    ).length,
  }));
  assert.equal(counts.items, counts.expected);
  assert.equal(counts.statuses, 7);
  assert.equal(
    await page.locator("#gameplaySearch").count(),
    1,
    "gameplay reference needs a consistent search toolbar",
  );
  await page.locator("#gameplaySearch").fill("金币");
  assert.ok(
    (await page
      .locator(
        "#gameplayContent>.item-reference-list>.item-reference-row:visible",
      )
      .count()) > 0,
  );
  await page.locator("#gameplaySearch").fill("不存在的道具名称");
  assert.equal(
    await page
      .locator(
        "#gameplayContent>.item-reference-list>.item-reference-row:visible",
      )
      .count(),
    0,
  );
  assert.equal(await page.locator("#gameplayEmpty").isVisible(), true);
  await page.locator("#gameplaySearch").fill("");
  await page.locator('[data-gameplay-tab="statuses"]').click();
  assert.equal(
    await page
      .locator(
        "#gameplayContent .competition-status-list>.item-reference-row:visible",
      )
      .count(),
    7,
  );
  await page.locator('[data-gameplay-tab="rules"]').click();
  assert.equal(await page.locator(".gameplay-rules").isVisible(), true);
  assert.doesNotMatch(
    await page.locator("#gameplayContent").innerText(),
    /下一次抽取屏蔽|下一次抽取不会再出现/,
  );
  await page.locator('[data-gameplay-tab="items"]').click();
  const imageBox = await page
    .locator("#gameplayContent .item-reference-icon img")
    .first()
    .boundingBox();
  assert.ok(
    imageBox.width <= 120 && imageBox.height <= 120,
    "encyclopedia icon must stay inside its bounded component",
  );
  await page.screenshot({
    path: "artifacts/gameplay-page/encyclopedia.png",
    animations: "disabled",
  });
  await page.evaluate(() => {
    openAbout();
  });
  assert.equal(await page.locator("#view-settings").isVisible(), true);
  assert.equal(
    await page.locator('[data-category-panel="about"]').isVisible(),
    true,
  );
  assert.equal(
    await page.locator("#aboutBackdrop").count(),
    0,
    "retired about modal must not remain a hidden duplicate",
  );
  await page.evaluate(() => renderAbout("items"));
  assert.equal(
    await page.locator("#view-gameplay").isVisible(),
    true,
    "legacy encyclopedia deep links go to the real page",
  );
  assert.deepEqual(errors, []);
  await writeFile(
    "artifacts/gameplay-page/result.json",
    JSON.stringify({ status: "PASS", counts, errors }, null, 2),
  );
  console.log(
    "PASS six core pages, live item/status encyclopedia and about settings redirects",
  );
} finally {
  await browser.close();
  server.close();
}
