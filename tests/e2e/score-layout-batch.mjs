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
  const result = await page.evaluate(() => {
    cancelScoreAnimationAndSync();
    const events = [];
    const originalAppend = Element.prototype.append,
      originalRect = Element.prototype.getBoundingClientRect;
    Element.prototype.append = function (...nodes) {
      if (nodes.some((n) => n.classList?.contains("score-card-number")))
        events.push("write");
      return originalAppend.apply(this, nodes);
    };
    Element.prototype.getBoundingClientRect = function () {
      if (this.matches(".group-row-card,.row-score")) events.push("read");
      return originalRect.call(this);
    };
    try {
      ScoreCardMotion.play(
        state.groups.map((g) => ({
          groupId: g.id,
          start: g.score,
          target: g.score + 2,
        })),
      );
    } finally {
      Element.prototype.append = originalAppend;
      Element.prototype.getBoundingClientRect = originalRect;
    }
    const firstWrite = events.indexOf("write");
    return {
      readsAfterWrite: events.slice(firstWrite).filter((x) => x === "read")
        .length,
      reads: events.filter((x) => x === "read").length,
      writes: events.filter((x) => x === "write").length,
    };
  });
  assert.equal(
    result.readsAfterWrite,
    0,
    "measure all score positions before inserting animated layers",
  );
  assert.equal(result.reads, 28);
  assert.equal(result.writes, 14);
  await mkdir("artifacts/score-layout-batch", { recursive: true });
  await writeFile(
    "artifacts/score-layout-batch/result.json",
    JSON.stringify({ status: "PASS", ...result }, null, 2),
  );
  console.log(
    "PASS score animation geometry reads form one batch before DOM writes",
  );
} finally {
  await browser.close();
  server.close();
}
