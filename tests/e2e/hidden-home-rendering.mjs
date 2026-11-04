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
  const result = await page.evaluate(async () => {
    const host = document.querySelector(".gp-existing-metrics");
    let mutations = 0;
    const observer = new MutationObserver(
      (records) => (mutations += records.length),
    );
    observer.observe(host, {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
    });
    state.groups[0].score = 4321;
    state.groups[0].displayScore = 4321;
    renderAll();
    await new Promise((r) => requestAnimationFrame(r));
    observer.disconnect();
    switchView("welcome");
    return {
      mutations,
      home: document.querySelector(
        '#uiGroupTrack [data-group="1"] .ui-group-score',
      )?.textContent,
      score: state.groups[0].score,
    };
  });
  assert.equal(
    result.mutations,
    0,
    "permanently hidden legacy chart/podium mirrors must not rebuild",
  );
  assert.equal(
    result.home,
    "4321",
    "visible home refreshes from authoritative scores on entry",
  );
  assert.equal(result.score, 4321);
  await mkdir("artifacts/hidden-home-rendering", { recursive: true });
  await writeFile(
    "artifacts/hidden-home-rendering/result.json",
    JSON.stringify({ status: "PASS", ...result }, null, 2),
  );
  console.log("PASS no hidden mirror work, visible home stays current");
} finally {
  await browser.close();
  server.close();
}
