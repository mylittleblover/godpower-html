import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";

/* The rendered encyclopedia must describe the shipped rules: exclusive statuses
   and defensive states measured in answer rounds, never in absorbed attacks. */
const html = await readFile("dist/godpower.html");
const server = createServer((_, res) => res.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const errors = [];
const root = "artifacts/encyclopedia-copy";
await mkdir(root, { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(page, 4);

  const audit = await page.evaluate(() => {
    closeAbout?.();
    renderAbout("items");
    const main = document.getElementById("aboutMain");
    const guide = main.querySelector(".competition-status-guide");
    const rows = [...guide.querySelectorAll(".item-reference-row")];
    const byName = (name) =>
      rows.find((r) => r.querySelector(".item-reference-name").textContent.includes(name));
    const starRow = byName("无敌");
    const megaRow = byName("巨大化");
    // The item list is the 28 道具 cards.
    const itemList = main.querySelector(".item-reference-list:not(.competition-status-list)");
    const itemRow = (name) =>
      [...itemList.querySelectorAll(".item-reference-row")].find((r) =>
        r.querySelector(".item-reference-name").textContent.includes(name),
      );
    const starItem = itemRow("无敌星");
    const megaItem = itemRow("巨大蘑菇");
    return {
      guideSub: guide.querySelector(".competition-status-guide-sub").textContent.trim(),
      starExact: starRow.querySelector(".item-reference-tip").textContent.trim(),
      starTip: starRow.querySelectorAll(".item-reference-tip")[1].textContent.trim(),
      megaExact: megaRow.querySelector(".item-reference-tip").textContent.trim(),
      megaTip: megaRow.querySelectorAll(".item-reference-tip")[1].textContent.trim(),
      starItemExact: starItem.querySelector(".item-reference-tip").textContent.trim(),
      starItemTip: starItem.querySelectorAll(".item-reference-tip")[1].textContent.trim(),
      megaItemExact: megaItem.querySelector(".item-reference-tip").textContent.trim(),
      megaItemTip: megaItem.querySelectorAll(".item-reference-tip")[1].textContent.trim(),
      burnTip: byName("灼烧").querySelectorAll(".item-reference-tip")[1].textContent.trim(),
      paralysisTip: byName("麻痹").querySelectorAll(".item-reference-tip")[1].textContent.trim(),
      allText: main.innerText,
    };
  });

  // No stale wording anywhere in the rendered encyclopedia.
  assert.doesNotMatch(audit.allText, /并存/, "statuses no longer coexist");
  assert.doesNotMatch(audit.allText, /3 次攻击|三次防御|防御耗尽|防御次数/,
    "no attack-count wording remains");
  assert.match(audit.guideSub, /只能有一种状态/);
  assert.match(audit.starExact, /3 轮答题/);
  assert.match(audit.megaExact, /3 轮答题/);
  assert.match(audit.starItemExact, /3 轮答题/);
  assert.match(audit.megaItemExact, /3 轮答题/);
  // Effect and tip must differ, otherwise the rule is printed twice.
  assert.notEqual(audit.starItemExact, audit.starItemTip);
  assert.notEqual(audit.megaItemExact, audit.megaItemTip);
  assert.match(audit.starItemTip, /腾槽|双倍/);

  await page.screenshot({ path: `${root}/encyclopedia.png`, fullPage: true });
  assert.deepEqual(errors, []);
  await writeFile(`${root}/results.json`, JSON.stringify({ status: "PASS", audit }, null, 2));
  const { allText, ...shown } = audit;
  console.log(JSON.stringify({ status: "PASS", shown }, null, 2));
} finally {
  await browser.close();
  server.close();
}
