import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createServer } from "node:http";
import { launch, setup } from "../fixtures/browser.mjs";
import { sourceAt } from "../fixtures/source-at.mjs";
import { battle14, measure14 } from "../fixtures/battle14.mjs";
const artifactRoot = process.env.BATTLE_ARTIFACT_DIR;
const baselineCommit =
    process.env.BATTLE_BASELINE_COMMIT ||
    "378f2d23d180802171a8e7d237fe1fb631ee3318",
  before = process.env.BATTLE_BASELINE_COMMIT
    ? Buffer.from(sourceAt(baselineCommit))
    : execFileSync("git", ["show", baselineCommit + ":dist/godpower.html"], {
        maxBuffer: 16e6,
      }),
  after = await readFile("dist/godpower.html");
const server = createServer((q, s) =>
  s.end(q.url.startsWith("/before") ? before : after),
);
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch(),
  results = [];
await mkdir("artifacts/desktop-ui", { recursive: true });
if (artifactRoot) {
  await mkdir(`${artifactRoot}/before`, { recursive: true });
  await mkdir(`${artifactRoot}/after`, { recursive: true });
}
try {
  for (const [width, height, zoom] of [
    [1366, 768, 0.8],
    [1920, 1080, 1],
    [2560, 1440, 1],
  ]) {
    const measurements = {};
    for (const version of ["before", "after"]) {
      const p = await browser.newPage({ viewport: { width, height } });
      await p.goto(`http://127.0.0.1:${server.address().port}/${version}`, {
        waitUntil: "domcontentloaded",
      });
      await setup(p, 14);
      await p.evaluate(battle14, zoom);
      await p.waitForTimeout(850);
      measurements[version] = await p.evaluate(measure14);
      await p.screenshot({
        path: artifactRoot
          ? `${artifactRoot}/${version}/battle-14-${width}.png`
          : `artifacts/${version === "before" ? "ui-baseline" : "desktop-ui"}/battle-14-${width}.png`,
        fullPage: true,
      });
      await p.close();
    }
    const a = measurements.before,
      b = measurements.after;
    let failure = null;
    try {
      assert.equal(a.cards.length, 14);
      assert.equal(b.cards.length, 14);
      assert.ok(
        a.cards.every((c) => c.bottom <= a.dock.top),
        "original 14-group fit must be demonstrated",
      );
      assert.ok(
        b.cards.every((c) => c.bottom <= b.dock.top),
        "all 14 groups must remain above dock",
      );
      for (const card of b.cards)
        for (const button of card.buttons || [])
          assert.ok(
            button.x >= card.x - 1 &&
              button.x + button.width <= card.x + card.width + 1 &&
              button.top >= card.top - 1 &&
              button.bottom <= card.bottom + 1,
            "necessary group controls must remain inside the card",
          );
      for (let i = 0; i < 14; i++)
        for (const prop of ["x", "y", "width", "height"])
          assert.ok(
            Math.abs(a.cards[i][prop] - b.cards[i][prop]) <= 1,
            `card ${i + 1} ${prop}: ${a.cards[i][prop]} -> ${b.cards[i][prop]}`,
          );
      assert.ok(Math.abs(a.dock.height - b.dock.height) <= 1);
      assert.ok(Math.abs(a.spacer.height - b.spacer.height) <= 1);
      assert.ok(
        b.scrollHeight <= a.scrollHeight + 1,
        "no additional page scrolling",
      );
    } catch (e) {
      failure = e.message;
      process.exitCode = 1;
    }
    results.push({
      id: "BATTLE_14_GROUPS_BASELINE",
      baselineCommit,
      width,
      height,
      zoom,
      columnMode: "double",
      resizerHeight: 120,
      userActualConfigurationVerified: false,
      status: failure ? "FAIL" : "PASS",
      failure,
      ...measurements,
    });
    console.log(width, failure || "PASS");
  }
} finally {
  await browser.close();
  server.close();
  await writeFile(
    artifactRoot
      ? `${artifactRoot}/battle-14-comparison.json`
      : "artifacts/desktop-ui/battle-14-comparison.json",
    JSON.stringify(results, null, 2),
  );
}
