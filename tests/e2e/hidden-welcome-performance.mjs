import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { sourceAt } from "../fixtures/source-at.mjs";
import { launch, setup } from "../fixtures/browser.mjs";
await mkdir("artifacts/performance-3.0.68", { recursive: true });
const html = process.env.WELCOME_BASELINE
  ? sourceAt(process.env.WELCOME_BASELINE)
  : await readFile("dist/godpower.html");
const server = createServer((q, r) => r.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
try {
  const p = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  await p.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(p, 14);
  await p.waitForTimeout(300);
  const result = await p.evaluate(async () => {
    let mutations = 0,
      drawEvents = 0;
    const track = document.getElementById("uiGroupTrack");
    const observer = new MutationObserver(
      (records) => (mutations += records.length),
    );
    observer.observe(track, { childList: true, subtree: true });
    const listener = (e) => {
      if (e.detail.type === "ITEM_DRAW_REVEAL") drawEvents++;
    };
    document.addEventListener("godpower:visual", listener);
    state.groups[0].inventory = [{ key: "coin", uses: 1 }];
    const times = [];
    for (let batch = 0; batch < 5; batch++) {
      const t = performance.now();
      for (let i = 0; i < 20; i++) {
        state.groups[0].name = `性能验证-${batch}-${i}`;
        DesktopUI.renderWelcome();
      }
      times.push(performance.now() - t);
      await new Promise((r) => setTimeout(r, 50));
    }
    observer.disconnect();
    document.removeEventListener("godpower:visual", listener);
    return {
      mutations,
      drawEvents,
      times,
      finalName: state.groups[0].name,
      trackName: track.querySelector(".ui-group-title")?.textContent,
    };
  });
  console.log(JSON.stringify(result));
  await writeFile(
    `artifacts/performance-3.0.68/welcome-${process.env.WELCOME_RESULT || "result"}.json`,
    JSON.stringify(result, null, 2),
  );
  assert.equal(result.mutations, 0, "hidden welcome must not rebuild cards");
  assert.equal(
    result.drawEvents,
    1,
    "hidden-page optimization must preserve exactly one item reveal event",
  );
  await p.evaluate(() => switchView("welcome"));
  assert.equal(
    await p.locator("#uiGroupTrack .ui-group-title").first().textContent(),
    result.finalName,
  );
  await p.screenshot({
    path: "artifacts/performance-3.0.68/welcome-visible.png",
  });
  console.log(
    "PASS hidden rendering, item visual events and current data on page entry",
  );
} finally {
  await browser.close();
  server.close();
}
