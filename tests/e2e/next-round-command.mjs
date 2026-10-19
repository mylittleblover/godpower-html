import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html"),
  server = createServer((_, r) => {
    r.setHeader("Content-Type", "text/html;charset=utf-8");
    r.end(html);
  });
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch(),
  page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  }),
  results = [],
  errors = [];
page.on("pageerror", (e) => errors.push(e.message));
try {
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  await setup(page, 4);
  const out = await page.evaluate(async () => {
    state.evaluated = true;
    state.roundActive = true;
    state.correctAns = "A";
    state.groups.forEach((g) => (g.selectedOpt = "B"));
    saveState();
    const bgm = bgmStartNewRoundMusicWithProgress;
    let resolve;
    bgmStartNewRoundMusicWithProgress = () => new Promise((r) => (resolve = r));
    try {
      const pending = nextRound();
      applyScoreDelta(state.groups[0].id, 2);
      resolve();
      await pending;
      return {
        evaluated: state.evaluated,
        correct: state.correctAns,
        selected: state.groups[0].selectedOpt,
        score: state.groups[0].score,
      };
    } finally {
      bgmStartNewRoundMusicWithProgress = bgm;
    }
  });
  assert.deepEqual(out, {
    evaluated: true,
    correct: "A",
    selected: "B",
    score: 102,
  });
  results.push({
    name: "stale music completion cannot reset a newer classroom command",
    status: "PASS",
  });
  await setup(page, 4);
  const normal = await page.evaluate(async () => {
    state.evaluated = true;
    state.roundActive = true;
    state.correctAns = "A";
    state.saveAllIn = false;
    state.groups.forEach((g) => {
      g.selectedOpt = "B";
      g.allIn = true;
      g.itemUsedThisRound = true;
    });
    saveState();
    const bgm = bgmStartNewRoundMusicWithProgress;
    bgmStartNewRoundMusicWithProgress = async () => {};
    const set = Storage.prototype.setItem;
    let writes = 0;
    Storage.prototype.setItem = function (k, v) {
      if (k === Reliability.stateKey) writes++;
      return set.call(this, k, v);
    };
    try {
      const history = historyStack.length;
      await nextRound();
      return {
        evaluated: state.evaluated,
        correct: state.correctAns,
        selected: state.groups[0].selectedOpt,
        allIn: state.groups[0].allIn,
        itemUsed: state.groups[0].itemUsedThisRound,
        history: historyStack.length - history,
        writes,
        saved: JSON.parse(localStorage.getItem(Reliability.stateKey)).round
          .roundActive,
      };
    } finally {
      bgmStartNewRoundMusicWithProgress = bgm;
      Storage.prototype.setItem = set;
    }
  });
  assert.deepEqual(normal, {
    evaluated: false,
    correct: "",
    selected: "",
    allIn: false,
    itemUsed: false,
    history: 0,
    writes: 1,
    saved: true,
  });
  results.push({
    name: "normal next-round commit saves once and preserves legacy reset rules",
    status: "PASS",
  });
  assert.deepEqual(errors, []);
} catch (error) {
  results.push({
    name: "next round command cases",
    status: "FAIL",
    error: error.message,
  });
} finally {
  await mkdir("artifacts/v3-round-controls", { recursive: true });
  await writeFile(
    "artifacts/v3-round-controls/next-round-results.json",
    JSON.stringify({ results, errors }, null, 2),
  );
  await browser.close();
  server.close();
}
console.log(results);
if (results.some((x) => x.status !== "PASS") || errors.length)
  process.exitCode = 1;
