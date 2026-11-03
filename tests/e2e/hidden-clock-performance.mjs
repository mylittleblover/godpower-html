import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { sourceAt } from "../fixtures/source-at.mjs";
import { launch, setup } from "../fixtures/browser.mjs";
const before = sourceAt("d735925"),
  after = await readFile("dist/godpower.html");
const server = createServer((q, r) =>
  r.end(q.url === "/before" ? before : after),
);
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch(),
  rows = [];
try {
  for (const version of ["before", "after"]) {
    const p = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
    });
    await p.goto(`http://127.0.0.1:${server.address().port}/${version}`);
    await setup(p, 14);
    const result = await p.evaluate(() => {
      let count = 0;
      const original = DesktopUI.renderWelcome;
      DesktopUI.renderWelcome = function (...args) {
        count++;
        return original.apply(this, args);
      };
      const times = [];
      for (let r = 0; r < 5; r++) {
        const t = performance.now();
        for (let i = 0; i < 20; i++) updateWelcomeClock();
        times.push(performance.now() - t);
      }
      DesktopUI.renderWelcome = original;
      return { count, times, scores: state.groups.map((g) => g.score) };
    });
    assert.equal(result.count, version === "before" ? 100 : 0);
    rows.push({ version, ...result });
    await p.close();
  }
  assert.deepEqual(rows[0].scores, rows[1].scores);
  console.log(JSON.stringify(rows, null, 2));
  await writeFile(
    "artifacts/performance-3.0.67/clock-comparison.json",
    JSON.stringify(rows, null, 2),
  );
} finally {
  await browser.close();
  server.close();
}
