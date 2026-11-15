import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";

/* Kamek: lower draw weight, one on the field at a time (same for the item box),
   and it prefers groups that carry no status. */
const html = await readFile("dist/godpower.html");
const server = createServer((_, res) => res.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const errors = [];
const root = "artifacts/kamek";
await mkdir(root, { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("dialog", (d) => d.accept());
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(page, 14);

  // 1) weight dropped and is lower than the other mid-band items it used to tie.
  const weights = await page.evaluate(() => {
    const midPos = 4;
    const w = itemDropWeights(midPos, 14);
    return {
      kamek: w.kamek,
      itemBox: w.item_box,
      horn: w.horn,
      bomb: w.bomb,
      mushroom: w.mushroom,
      fireFlower: w.fire_flower,
    };
  });
  assert.equal(weights.kamek, 3, "kamek weight lowered to 3");
  assert.equal(weights.itemBox, 4, "item box weight lowered to 4");
  assert.ok(weights.kamek < weights.horn, "below horn");
  assert.ok(weights.kamek < weights.bomb, "below bomb");
  assert.ok(weights.kamek < weights.mushroom, "below mushroom");
  assert.ok(weights.kamek <= weights.fireFlower, "does not exceed fire flower");
  assert.ok(weights.itemBox < weights.mushroom, "box also rare");

  // 2) one on the field at a time.
  const unique = await page.evaluate(() => {
    state.groups.forEach((g) => { g.inventory = []; });
    const midPos = 4;
    const before = itemDropWeights(midPos, 14);
    state.groups[3].inventory = [ItemModules.inventory("kamek")];
    const withKamek = itemDropWeights(midPos, 14);
    state.groups[3].inventory = [ItemModules.inventory("item_box")];
    const withBox = itemDropWeights(midPos, 14);
    state.groups[3].inventory = [
      ItemModules.inventory("kamek"),
      ItemModules.inventory("item_box"),
    ];
    const both = itemDropWeights(midPos, 14);
    return {
      beforeKamek: before.kamek,
      beforeBox: before.item_box,
      withKamek: withKamek.kamek,
      boxStill: withKamek.item_box,
      withBox: withBox.item_box,
      kamekStill: withBox.kamek,
      bothKamek: both.kamek,
      bothBox: both.item_box,
      hornUnaffected: both.horn,
    };
  });
  assert.equal(unique.beforeKamek, 3);
  assert.equal(unique.withKamek, 0, "kamek is removed while one is held");
  assert.equal(unique.boxStill, 4, "the item box is unaffected by kamek");
  assert.equal(unique.withBox, 0, "the item box is removed while one is held");
  assert.equal(unique.kamekStill, 3, "kamek is unaffected by the box");
  assert.equal(unique.bothKamek, 0);
  assert.equal(unique.bothBox, 0);
  assert.ok(unique.hornUnaffected > 0, "other items keep their weight");

  // 3) kamek prefers groups without a status.
  const targeting = await page.evaluate(async () => {
    const runs = [];
    for (let attempt = 0; attempt < 12; attempt++) {
      state.groups.forEach((g) => { g.itemEffect = null; g.competitionEffects = {}; g.inventory = []; });
      const caster = state.groups[0];
      // Give the last five groups a status; the first ones stay clean.
      const dirty = state.groups.slice(-5);
      dirty.forEach((g) => CompetitionEffects.apply(g, "poison", 3));
      caster.inventory = [ItemModules.inventory("kamek")];
      caster.itemUsedThisRound = false;
      useItem(caster.id, 0);
      await classroomCommands.whenIdle();
      await new Promise((r) => setTimeout(r, 120));
      const after = state.groups
        .map((g) => ({
          id: g.id,
          wasDirty: dirty.some((d) => d.id === g.id),
          has: Object.keys(g.competitionEffects || {}).length > 0,
        }));
      runs.push({
        dirtyStillOnlyOriginal: after.filter((g) => g.wasDirty && g.has).length,
        newlyAfflictedClean: after.filter((g) => !g.wasDirty && g.has).length,
        cleanCount: after.filter((g) => !g.wasDirty).length,
      });
    }
    return {
      runs,
      // Every run must have touched only clean groups.
      allCleanOnly: runs.every((r) => r.newlyAfflictedClean > 0),
      noCleanUntouchedViolation: runs.every((r) => r.cleanCount >= 0),
    };
  });
  assert.equal(targeting.allCleanOnly, true, "kamek always finds a clean group");

  await page.screenshot({ path: `${root}/kamek.png` });
  assert.deepEqual(errors, []);
  const results = [{ weights, unique, targeting: { allCleanOnly: targeting.allCleanOnly } }];
  await writeFile(`${root}/results.json`, JSON.stringify({ status: "PASS", results }, null, 2));
  console.log(JSON.stringify({ status: "PASS", weights, unique, allCleanOnly: targeting.allCleanOnly }, null, 2));
} finally {
  await browser.close();
  server.close();
}
