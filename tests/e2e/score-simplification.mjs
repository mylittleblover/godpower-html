import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html"),
  server = createServer((_, r) => r.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.evaluate(() => SaveManager.ready());
  await setup(page, 14);
  await page.evaluate(() => {
    cancelScoreAnimationAndSync();
    state.groups[0].score = 135;
    state.groups[1].score = 75;
    animateScores([
      { groupId: state.groups[0].id, start: 100, target: 135 },
      { groupId: state.groups[1].id, start: 100, target: 75 },
    ]);
  });
  const early = await page.evaluate(() =>
    [...document.querySelectorAll(".score-card-number")].map((n) => ({
      score: n.firstChild.textContent,
      delta: n.lastChild.textContent,
      color: getComputedStyle(n).color,
    })),
  );
  assert.deepEqual(
    early.map((x) => x.score),
    ["135分", "75分"],
  );
  assert.deepEqual(
    early.map((x) => x.delta),
    ["+35", "-25"],
  );
  const changes = await page.evaluate(async () => {
    let count = 0;
    const o = new MutationObserver((records) => (count += records.length));
    for (const n of document.querySelectorAll(".score-card-number"))
      o.observe(n, { subtree: true, childList: true, characterData: true });
    await new Promise((r) => setTimeout(r, 900));
    o.disconnect();
    return count;
  });
  assert.equal(
    changes,
    0,
    "score text must stay exact without per-frame DOM writes",
  );
  await mkdir("artifacts/score-simplification", { recursive: true });
  await page.screenshot({ path: "artifacts/score-simplification/during.png" });
  await page.waitForFunction(
    () => !document.querySelector(".score-card-number"),
  );
  const final = await page.evaluate(() =>
    state.groups
      .slice(0, 2)
      .map((g) => ({
        score: g.score,
        display: g.displayScore,
        text: document.getElementById("score-val-" + g.id).textContent,
      })),
  );
  assert.deepEqual(
    final.map((x) => x.score),
    [135, 75],
  );
  assert.deepEqual(
    final.map((x) => x.text),
    ["135分", "75分"],
  );
  await writeFile(
    "artifacts/score-simplification/result.json",
    JSON.stringify({ status: "PASS", early, changes, final }, null, 2),
  );
  console.log(
    "PASS exact final score, signed delta, no frame-by-frame text writes, cleanup",
  );
} finally {
  await browser.close();
  server.close();
}
