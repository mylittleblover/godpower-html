import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, dismissStartup, setup } from "../fixtures/browser.mjs";
await mkdir("artifacts/continuous-draw-policy", { recursive: true });
const html = await readFile("dist/godpower.html"),
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
  const result = await page.evaluate(() => {
    ItemModules.update(ItemModules.defaults());
    state.groups.forEach((g) => {
      g.inventory = [];
      g.score = g.displayScore = 100;
    });
    const g = state.groups[7],
      before = itemDropWeights(8, 14);
    state.groups[0].score = 200;
    const after = itemDropWeights(8, 14),
      high = ItemDrawPolicy.highImpact;
    const share = (w) =>
      high.reduce((n, k) => n + w[k], 0) /
      Object.values(w).reduce((n, v) => n + v, 0);
    addItemToGroup(g, "power");
    addItemToGroup(state.groups[1], "lightning");
    const filtered = itemDropWeights(8, 14);
    const config = ItemModules.configuration();
    config.items.coin.draw.enabled = false;
    ItemModules.update(config);
    const disabled = itemDropWeights(1, 14).coin;
    ItemModules.update(ItemModules.defaults());
    state.groups.forEach((g) => (g.inventory = []));
    const old = Math.random;
    let first, horn, nonHorn;
    try {
      handItemDrawGroupId = state.groups[0].id;
      firstHandDrawPendingV218 = true;
      Math.random = () => 0;
      first = ItemDrawBlocks.pick(state.groups[0]);
      handItemDrawGroupId = null;
      Math.random = () => 0.099;
      horn = ItemDrawBlocks.pick(state.groups[0]);
      Math.random = () => 0.101;
      nonHorn = ItemDrawBlocks.pick(state.groups[0]);
    } finally {
      Math.random = old;
      handItemDrawGroupId = null;
    }
    switchView("gameplay");
    return {
      keys: Object.keys(before).length,
      expected: Object.keys(ItemBlueprints).length,
      gapImproves: share(after) > share(before),
      power: filtered.power,
      lightning: filtered.lightning,
      disabled,
      first,
      horn,
      nonHorn,
      description: document
        .getElementById("gameplayContent")
        .textContent.includes(ItemDrawPolicy.version),
    };
  });
  assert.equal(result.keys, result.expected);
  assert.equal(result.keys, 28);
  assert.equal(result.gapImproves, true);
  assert.equal(result.power, 0);
  assert.equal(result.lightning, 0);
  assert.equal(result.disabled, 0);
  assert.equal(result.first, "triple_mushroom");
  assert.equal(result.horn, "horn");
  assert.notEqual(result.nonHorn, "horn");
  assert.equal(result.description, true);
  assert.deepEqual(errors, []);
  await writeFile(
    "artifacts/continuous-draw-policy/result.json",
    JSON.stringify({ status: "PASS", result, errors }, null, 2),
  );
  console.log(
    "PASS one continuous draw owner, 28 weights, positive-gap catch-up, held/field/config filters and first-hand/horn exceptions",
  );
} finally {
  await browser.close();
  server.close();
}
