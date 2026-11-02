import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";

const html = await readFile("dist/godpower.html");
const server = createServer((_, res) => res.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const errors = [];
const root = "artifacts/status-guide";
await mkdir(root, { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(page, 4);

  const info = await page.evaluate(() => {
    closeAbout?.();
    renderAbout("items");
    const main = document.getElementById("aboutMain");
    const guide = main.querySelector(".competition-status-guide");
    const itemList = main.querySelector(".item-reference-list:not(.competition-status-list)");
    const rows = [...guide.querySelectorAll(".item-reference-row")];
    const lastItemRow = itemList.querySelector(".item-reference-row:last-child");
    return {
      guideIsLast: main.lastElementChild.classList.contains("competition-status-guide"),
      guideAfterItems:
        !!(itemList.compareDocumentPosition(guide) & Node.DOCUMENT_POSITION_FOLLOWING),
      rows: rows.length,
      names: rows.map((r) => r.querySelector(".item-reference-name").textContent.replace(/\s+/g, " ").trim()),
      hasIcon: rows.every((r) => !!r.querySelector(".item-reference-icon")),
      hasExact: rows.every((r) => /实际效果：/.test(r.textContent)),
      hasTip: rows.every((r) => /使用要点：/.test(r.textContent)),
      hasHumourLink: rows.every((r) => !/百科阅读须知/.test(r.textContent)),
      firstRowStyle: getComputedStyle(rows[0]).display,
      itemRowStyle: getComputedStyle(lastItemRow).display,
      guideIcons: rows.map((r) => r.querySelector(".item-reference-icon").className),
      oldDlGone: !guide.querySelector("dl"),
      textLength: rows.map((r) => r.textContent.replace(/\s+/g, "").length),
    };
  });
  assert.equal(info.guideIsLast, true, "the guide sits at the bottom of the encyclopedia");
  assert.equal(info.guideAfterItems, true, "and after the item list");
  assert.equal(info.rows, 7, "seven status rows");
  assert.equal(info.hasIcon, true, "each row has an icon column");
  assert.equal(info.hasExact, true);
  assert.equal(info.hasTip, true);
  assert.equal(info.oldDlGone, true, "the old definition list is gone");
  assert.equal(info.firstRowStyle, info.itemRowStyle, "status rows reuse the item card grid");

  await page.screenshot({ path: `${root}/guide-bottom.png`, fullPage: true });
  assert.deepEqual(errors, []);
  await writeFile(`${root}/results.json`, JSON.stringify({ status: "PASS", info }, null, 2));
  console.log(JSON.stringify({ status: "PASS", info }, null, 2));
} finally {
  await browser.close();
  server.close();
}
