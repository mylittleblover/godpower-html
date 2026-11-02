import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html");
const server = createServer((_, res) => {
  res.setHeader("Content-Type", "text/html;charset=utf-8");
  res.end(html);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch(),
  root = process.env.ITEM_STATUS_ARTIFACT_DIR || "artifacts/items-status";
await mkdir(root, { recursive: true });
const errors = [],
  results = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(page, 4);
  await page.evaluate(() => {
    const motion = document.querySelector('[data-pref="motion"]');
    motion.value = "full";
    motion.dispatchEvent(new Event("change", { bubbles: true }));
    for (const g of state.groups) {
      g.inventory = [];
      g.score = 100;
      g.displayScore = 100;
      g.itemEffect = null;
      g.competitionEffects = {};
      g.booShield = 0;
      g.booRoundsLeftV218 = 0;
    }
    state.roundActive = false;
    state.evaluated = true;
    state.groups[0].inventory = [ItemModules.inventory("green")];
    openHandRaise();
    selectHandGroup(state.groups[0].id);
    handUseItem();
    useItem(state.groups[0].id, 0);
  });
  await page.waitForSelector(".hand-item-cinematic[open]");
  await page.waitForFunction(
    () =>
      !document
        .getElementById("itemModalBackdrop")
        .classList.contains("active"),
  );
  const hand = await page.evaluate(() => ({
    left: document.querySelector(".hic-attacker h2").textContent,
    right: document.querySelector(".hic-targets h2").textContent,
    banners: document.querySelectorAll(".item-use-banner").length,
    modal: document
      .getElementById("itemModalBackdrop")
      .classList.contains("active"),
  }));
  assert.equal(hand.left, "测试 1 组");
  assert.notEqual(hand.right, hand.left);
  assert.equal(hand.banners, 0);
  assert.equal(hand.modal, false);
  await page.screenshot({ path: root + "/hand-item.png" });
  results.push({ name: "hand-fullscreen-left-right-no-popup", ...hand });
  await page.locator(".hand-item-cinematic .ui-cinematic-skip").click();
  assert.equal(await page.locator(".hand-item-cinematic").count(), 0);
  await page.evaluate(() => {
    cancelScoreAnimationAndSync();
    state.groups[0].color = "#ffff99";
    state.groups[1].color = "#132343";
    renderAll();
  });
  const light = await page.evaluate(() => {
    const el = document.getElementById("score-val-" + state.groups[0].id),
      s = getComputedStyle(el);
    return {
      color: s.color,
      background: s.backgroundColor,
      stroke: s.webkitTextStrokeWidth,
    };
  });
  assert.equal(light.color, "rgb(255, 255, 153)");
  assert.equal(light.background, "rgba(0, 0, 0, 0)");
  assert.equal(light.stroke, "1px");
  await page.evaluate(() => {
    const first = state.groups[0],
      second = state.groups[1];
    first.score = 135;
    second.score = 75;
    animateScores([
      { groupId: first.id, start: 100, target: 135 },
      { groupId: second.id, start: 100, target: 75 },
    ]);
  });
  await page.waitForTimeout(800);
  const during = await page.evaluate(() =>
    [...document.querySelectorAll(".score-card-number")].map((n) => {
      const card = n.closest("[data-group-id]"),
        r = n.getBoundingClientRect(),
        c = card.getBoundingClientRect();
      return {
        ink: getComputedStyle(n).color,
        delta: n.querySelector("small").textContent,
        centerX: Math.abs(r.left + r.width / 2 - (c.left + c.width / 2)),
        centerY: Math.abs(r.top + r.height / 2 - (c.top + c.height / 2)),
      };
    }),
  );
  await page.screenshot({ path: root + "/score-center.png" });
  console.log(JSON.stringify({ during }));
  assert.equal(during.length, 2);
  assert.ok(during.every((x) => x.centerX < 3 && x.centerY < 3));
  assert.deepEqual(
    during.map((x) => x.ink),
    ["rgb(0, 0, 0)", "rgb(255, 255, 255)"],
  );
  await page.evaluate(() => renderGrid());
  await page.waitForTimeout(1400);
  const after = await page.evaluate(() => ({
    overlays: document.querySelectorAll(
      ".score-card-wash,.score-card-number,.score-motion-hidden",
    ).length,
    values: state.groups.slice(0, 2).map((g) => ({
      actual: g.score,
      shown: document.getElementById("score-val-" + g.id).textContent,
      display: g.displayScore,
    })),
  }));
  assert.equal(after.overlays, 0);
  assert.deepEqual(after.values, [
    { actual: 135, shown: "135分", display: 135 },
    { actual: 75, shown: "75分", display: 75 },
  ]);
  await page.evaluate(() => {
    const g = state.groups[0];
    g.score = 155;
    animateScores([{ groupId: g.id, start: 135, target: 155 }]);
    g.score = 150;
    animateScores([{ groupId: g.id, start: 155, target: 150 }]);
    cancelScoreAnimationAndSync();
  });
  assert.equal(
    await page
      .locator(".score-card-wash,.score-card-number,.score-motion-hidden")
      .count(),
    0,
  );
  results.push({
    name: "theme-wash-centered-score-delta-contrast-rerender-cancel",
    light,
    during,
    after,
  });
  await page.evaluate(() => {
    openAbout();
    renderAbout("items");
  });
  const encyclopedia = await page.evaluate(() => ({
    count: document.querySelectorAll(".item-reference-row").length,
    text: document.getElementById("aboutMain").textContent,
    keys: ITEM_KEYS,
  }));
  assert.equal(encyclopedia.count, 28);
  assert.ok(
    encyclopedia.text.includes("七种状态效果") &&
      encyclopedia.text.includes("总分 ×3") &&
      encyclopedia.text.includes("卡美克") &&
      encyclopedia.text.includes("道具箱"),
  );
  assert.deepEqual(errors, []);
  await writeFile(
    root + "/cinematics.json",
    JSON.stringify({ results, encyclopedia, errors }, null, 2),
  );
  console.log(JSON.stringify(results));
} finally {
  await browser.close();
  server.close();
}
