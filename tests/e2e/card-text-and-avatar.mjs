import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";

/* The card no longer prints "主要道具可直接点击使用" nor a small text hint after
   an item is used, and a custom avatar replaces the number box with the number
   moved underneath. Animations must still play. */
const html = await readFile("dist/godpower.html");
const server = createServer((_, res) => res.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const errors = [];
const root = "artifacts/card-cleanup";
await mkdir(root, { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("dialog", (d) => d.accept());
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(page, 6);

  const clean = await page.evaluate(() => {
    const card = document.querySelector(".group-row-card");
    const text = card.innerText;
    return {
      hint: text.includes("主要道具可直接点击使用"),
      hasResultRow: !!card.querySelector(".v213-result"),
      resultText: card.querySelector(".v213-result")?.textContent?.trim() ?? "",
    };
  });
  assert.equal(clean.hint, false, "the idle hint is gone");
  assert.equal(clean.hasResultRow, false, "no empty result row is drawn");

  // Using an item still animates but no longer prints the small text hint.
  const used = await page.evaluate(async () => {
    const g = state.groups[0];
    g.inventory = [ItemModules.inventory("green")];
    g.itemUsedThisRound = false;
    const beforeLayers = document.querySelectorAll(".bm-layer").length;
    useItem(g.id, 0);
    await classroomCommands.whenIdle();
    await new Promise((r) => setTimeout(r, 260));
    const card = document.querySelector(`.group-row-card[data-group-id="${g.id}"]`);
    return {
      animated: document.querySelectorAll(".bm-layer").length > beforeLayers,
      hasTargetLine: /目标：/.test(card.innerText),
      cardHasUseLine: /使用了|目标：/.test(card.innerText),
      resultRowGone: !card.querySelector(".v213-result"),
    };
  });
  assert.equal(used.animated, true, "the card animation still plays");
  assert.equal(used.hasTargetLine, false, "the small target line is gone");
  assert.equal(used.cardHasUseLine, false, "no use/target text on the card");
  assert.equal(used.resultRowGone, true, "the small hint row stays absent");

  // A custom avatar replaces the number box, number moves below it.
  const avatar = await page.evaluate(async () => {
    const g = state.groups[1];
    const url = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    g.groupAvatar = url;
    await renderAll();
    await new Promise((r) => setTimeout(r, 350));
    const card = document.querySelector(`.group-row-card[data-group-id="${g.id}"]`);
    const badge = card.querySelector(".v213-number");
    const img = badge.querySelector(".v213-group-avatar-single");
    const num = badge.querySelector(".v213-group-number-below-avatar");
    const imgRect = img?.getBoundingClientRect();
    const numRect = num?.getBoundingClientRect();
    return {
      hasImage: !!img,
      numberBelow: !!imgRect && !!numRect && numRect.top >= imgRect.bottom - 1,
      badgeHasAvatarClass: badge.classList.contains("v213-number-avatar"),
      numberText: num?.textContent?.trim() ?? "",
      imgSrc: img?.src?.slice(0, 21) ?? "",
    };
  });
  assert.equal(avatar.hasImage, true, "the avatar replaces the number box");
  assert.equal(avatar.numberBelow, true, "the number sits underneath the avatar");
  assert.equal(avatar.badgeHasAvatarClass, true);
  assert.equal(avatar.imgSrc, "data:image/png;base64");

  await page.screenshot({ path: `${root}/cards.png` });
  assert.deepEqual(errors, []);
  const results = [{ clean, used, avatar }];
  await writeFile(`${root}/results.json`, JSON.stringify({ status: "PASS", results }, null, 2));
  console.log(JSON.stringify({ status: "PASS", clean, used, avatar }, null, 2));
} finally {
  await browser.close();
  server.close();
}
