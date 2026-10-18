import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
import { sourceAt } from "../fixtures/source-at.mjs";
const baseline =
    process.env.REFACTOR_BASELINE || "079df316a999ced4f598a3c3d0495786f9f8d0e8",
  before = sourceAt(baseline),
  after = await readFile("dist/godpower.html");
const server = createServer((req, res) => {
  res.setHeader("Content-Type", "text/html;charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(req.url === "/before" ? before : after);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const results = [];
try {
  for (const version of ["before", "after"]) {
    const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
    });
    await page.goto(`http://127.0.0.1:${server.address().port}/${version}`, {
      waitUntil: "domcontentloaded",
    });
    const navigation = await page.evaluate(() =>
      performance.getEntriesByType("navigation")[0].toJSON(),
    );
    for (const rounds of [20, 50, 100]) {
      await setup(page);
      const sample = await page.evaluate((rounds) => {
        const nodesBefore = document.querySelectorAll("*").length,
          started = performance.now();
        for (let i = 0; i < rounds; i++) {
          finishStartRound();
          state.groups.forEach((g) => (g.selectedOpt = "A"));
          state.correctAns = "A";
          if (!judgeRound()) throw Error("round rejected");
        }
        cancelScoreAnimationAndSync();
        return {
          rounds,
          durationMs: performance.now() - started,
          nodesBefore,
          nodesAfter: document.querySelectorAll("*").length,
          history: historyStack.length,
          scores: state.groups.map((g) => g.score),
          heapBytes: performance.memory?.usedJSHeapSize ?? null,
        };
      }, rounds);
      assert.deepEqual(
        sample.scores,
        [100, 140, 180, 220].map((x) => x + rounds * 2),
      );
      assert.equal(sample.history, Math.min(rounds, 40));
      assert.ok(sample.nodesAfter <= sample.nodesBefore + 150);
      results.push({ version, status: "PASS", navigation, sample });
      console.log(version, rounds, sample.durationMs);
    }
    await page.close();
  }
} finally {
  await writeFile(
    "artifacts/refactor/performance-comparison.json",
    JSON.stringify(
      {
        baseline,
        browser: browser.version(),
        note: "One ordered sample per case; not a benchmark or long-term leak proof",
        results,
      },
      null,
      2,
    ),
  );
  await browser.close();
  await new Promise((r) => server.close(r));
}
