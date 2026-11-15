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
    ensureItemState();
    state.itemGlobal.drawConfig = ItemDrawPolicy.defaultConfig();
    state.itemGlobal.mkwState = {
      matchStartedAt: Date.now() - 600_000,
      lastUsedAt: {},
      lastUsedSession: {},
    };
    state.groups.forEach((g, idx) => {
      g.inventory = [];
      g.score = g.displayScore = 200 - idx * 5;
    });
    const front = itemDropWeights(1, 14),
      back = itemDropWeights(14, 14),
      high = ItemDrawPolicy.highImpact;
    const share = (w) =>
      high.reduce((n, k) => n + w[k], 0) /
      Object.values(w).reduce((n, v) => n + v, 0);
    addItemToGroup(state.groups[13], "power");
    addItemToGroup(state.groups[1], "lightning");
    const filtered = itemDropWeights(14, 14);
    const config = ItemModules.configuration();
    config.items.coin.draw.enabled = false;
    ItemModules.update(config);
    const disabled = itemDropWeights(1, 14).coin;
    ItemModules.update(ItemModules.defaults());
    state.groups.forEach((g) => (g.inventory = []));

    // Verify SwitchPreset filtering via drawConfig
    state.itemGlobal.drawConfig = {
      ...ItemDrawPolicy.defaultConfig(),
      mode: "24KartRace",
      switchPreset: "P05",
    };
    const presetPicked = ItemDrawBlocks.pick(state.groups[0]);
    const presetWeights = itemDropWeights(8, 14);
    const nonZeroPresetKeys = Object.entries(presetWeights)
      .filter(([, w]) => w > 0)
      .map(([k]) => k);

    state.itemGlobal.drawConfig = ItemDrawPolicy.defaultConfig();
    switchView("gameplay");
    return {
      keys: Object.keys(front).length,
      expected: Object.keys(ItemBlueprints).length,
      frontHighShare: share(front),
      backHighShare: share(back),
      catchUpImproves: share(back) > share(front),
      power: filtered.power,
      lightning: filtered.lightning,
      disabled,
      presetPicked,
      nonZeroPresetKeys,
      allowedP05: [...MKWProduct180Data.SWITCH_PRESETS.P05],
      officialNames: {
        mushroom: ITEM_DEFS.mushroom.name,
        triple_mushroom: ITEM_DEFS.triple_mushroom.name,
        power: ITEM_DEFS.power.name,
        spiny: ITEM_DEFS.spiny.name,
        coin_shell: ITEM_DEFS.coin_shell.name,
        question: ITEM_DEFS.question.name,
      },
      description: document
        .getElementById("gameplayContent")
        .textContent.includes(ItemDrawPolicy.version),
    };
  });
  assert.equal(result.keys, result.expected);
  assert.equal(result.keys, 28);
  assert.equal(result.catchUpImproves, true);
  assert.equal(result.power, 0);
  assert.equal(result.lightning, 0);
  assert.equal(result.disabled, 0);
  assert.ok(result.presetPicked, "P05 preset should yield a valid item");
  assert.ok(
    result.nonZeroPresetKeys.every((k) => result.allowedP05.includes(k)),
  );
  assert.equal(result.officialNames.mushroom, "冲刺蘑菇");
  assert.equal(result.officialNames.triple_mushroom, "三重冲刺蘑菇");
  assert.equal(result.officialNames.power, "强力冲刺蘑菇");
  assert.equal(result.officialNames.spiny, "刺刺龟壳");
  assert.equal(result.officialNames.coin_shell, "黄金龟壳");
  assert.equal(result.officialNames.question, "？砖块");
  assert.equal(result.description, true);
  assert.deepEqual(errors, []);
  await writeFile(
    "artifacts/continuous-draw-policy/result.json",
    JSON.stringify({ status: "PASS", result, errors }, null, 2),
  );
  console.log(
    "PASS MKWorld Product.180 runtime draw policy, 28 weights, mode/preset gates, held/field/config filters and official item names",
  );
} finally {
  await browser.close();
  server.close();
}
