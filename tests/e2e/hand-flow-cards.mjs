import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
await mkdir("artifacts/hand-flow", { recursive: true });
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
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:" + server.address().port, {
    waitUntil: "domcontentloaded",
  });
  await page.evaluate(() => SaveManager.ready());
  await setup(page, 14);
  await page.evaluate(async () => {
    state.columnMode = "double";
    state.resizerEnabled = true;
    state.resizerHeight = 120;
    state.zoomLevel = 1;
    document.body.style.zoom = 1;
    switchView("battle");
    renderAll();
    await SaveManager.whenIdle();
  });
  const geometry = () =>
    page.locator("#groupList>.group-row-card").evaluateAll((es) =>
      es.map((e) => {
        const r = e.getBoundingClientRect();
        return [r.x, r.y, r.width, r.height];
      }),
    );
  const settle = () =>
    page.evaluate(async () => {
      await Promise.all(
        document
          .getAnimations()
          .filter(
            (a) =>
              a.effect?.getTiming().iterations !== Infinity &&
              a.effect?.target?.closest?.("#view-battle"),
          )
          .map((a) => a.finished.catch(() => {})),
      );
    });
  await page.mouse.move(0, 0);
  await settle();
  const before = await geometry();
  await page.evaluate(() => openHandRaise());
  assert.equal(
    await page.evaluate(() => document.body.dataset.handFlow),
    "SELECT_GROUP",
    "hand mode must select live cards without covering them with a group modal",
  );
  await page.screenshot({
    animations: "disabled",
    path: "artifacts/hand-flow/select-14.png",
  });
  await page.locator('.group-row-card[data-group-id="1"]').click();
  await page
    .locator('[data-hand-judge="correct"]')
    .waitFor({ state: "visible" });
  await page.screenshot({
    animations: "disabled",
    path: "artifacts/hand-flow/judge.png",
  });
  await page.locator('[data-hand-judge="correct"]').click();
  await page
    .locator('[data-hand-reward="score"]')
    .waitFor({ state: "visible" });
  assert.equal(await page.locator("[data-hand-reward]").count(), 3);
  await page.screenshot({
    animations: "disabled",
    path: "artifacts/hand-flow/reward.png",
  });
  await page.locator('[data-hand-reward="score"]').click();
  assert.equal(await page.locator("[data-hand-score]").count(), 6);
  await page.locator("#handFlowScoreInput").fill("3");
  await page.locator("[data-hand-score-submit]").click();
  await page.waitForFunction(
    () => document.body.dataset.handFlow === "SELECT_GROUP",
  );
  assert.equal(await page.evaluate(() => state.groups[0].score), 103);
  await page.evaluate(() => closeHandRaise());
  await page.mouse.move(0, 0);
  await settle();
  assert.deepEqual(
    await geometry(),
    before,
    "14 group card geometry must stay identical",
  );
  await page.evaluate(() => openHandRaise());
  await page.locator('.group-row-card[data-group-id="2"]').click();
  await page.locator('[data-hand-judge="correct"]').click();
  await page.locator('[data-hand-reward="draw"]').click();
  await page.locator("[data-hand-skip]").waitFor({ state: "visible" });
  const acquired = await page.evaluate(() => state.groups[1].inventory.length);
  assert.equal(acquired, 1);
  await page.locator("[data-hand-skip]").click();
  assert.equal(
    await page.evaluate(() => state.groups[1].inventory.length),
    acquired,
    "skipping reveal must not redraw",
  );
  await page.evaluate(() => closeHandRaise());
  assert.equal(
    await page.locator(".hand-flow-reel").count(),
    0,
    "closing cleans the infinite reel animation",
  );
  assert.deepEqual(errors, []);
  await writeFile(
    "artifacts/hand-flow/cards-result.json",
    JSON.stringify(
      {
        status: "PASS",
        groups: 14,
        score: 103,
        geometryUnchanged: true,
        errors,
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS live 14-group selection, judgment/reward/score cards, durable scoring and geometry",
  );
} finally {
  await browser.close();
  server.close();
}
