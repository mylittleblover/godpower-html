import { sourceAt } from "../fixtures/source-at.mjs";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, dismissStartup, setup } from "../fixtures/browser.mjs";
await mkdir("artifacts/authoritative-save-performance", { recursive: true });
const html = process.env.SAVE_PERF_SOURCE
    ? sourceAt(process.env.SAVE_PERF_SOURCE)
    : await readFile("dist/godpower.html"),
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
  await setup(page, 14);
  const result = await page.evaluate(async () => {
    const before = state.groups[0].score,
      key = "godpower_state_v2",
      oldCache = localStorage.getItem(key),
      original = Storage.prototype.setItem;
    let writes = 0;
    Storage.prototype.setItem = function (k, v) {
      if (k === key) writes++;
      return original.call(this, k, v);
    };
    try {
      runClassroomCommand("持久化性能回归", () => {
        state.groups[0].score += 2;
        state.groups[0].displayScore = state.groups[0].score;
        return true;
      });
      await classroomCommands.whenIdle();
      await SaveManager.whenIdle();
    } finally {
      Storage.prototype.setItem = original;
    }
    return {
      writes,
      unchangedCache: localStorage.getItem(key) === oldCache,
      before,
      score: state.groups[0].score,
      stored: SaveManager.snapshot().match.groups[0].score,
    };
  });
  assert.equal(
    result.writes,
    0,
    "one authoritative commit must not synchronously rewrite a complete obsolete save cache",
  );
  assert.equal(result.unchangedCache, true);
  assert.equal(result.score, result.before + 2);
  assert.equal(result.stored, result.score);
  const small = await page.evaluate(() => {
    const v = SaveManager.rosterView();
    const original = v.roster.groups[0].name;
    v.roster.groups[0].name = "mutated local view";
    return {
      noMatch: !("match" in v),
      isolated: SaveManager.rosterView().roster.groups[0].name === original,
    };
  });
  assert.deepEqual(small, { noMatch: true, isolated: true });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.evaluate(() => SaveManager.ready());
  assert.equal(
    await page.evaluate(() => state.groups[0].score),
    result.score,
    "reload must read the confirmed authoritative document",
  );
  assert.deepEqual(errors, []);
  await writeFile(
    "artifacts/authoritative-save-performance/result.json",
    JSON.stringify({ status: "PASS", result, errors }, null, 2),
  );
  console.log(
    "PASS single authoritative save, no synchronous obsolete mirror, isolated small roster view and durable reload",
  );
} finally {
  await browser.close();
  server.close();
}
