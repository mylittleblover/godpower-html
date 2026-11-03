import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
const server = createServer(async (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(await readFile("dist/godpower.html"));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const p = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
});
await p.goto(`http://127.0.0.1:${server.address().port}`, {
  waitUntil: "domcontentloaded",
});
await p.waitForTimeout(400);
// The original 26 public commands (newer two have separate integration coverage) must work without entering the superseded dispatcher.
await p.evaluate(() => {
  legacyUseItem = () => {
    throw Error("public pipeline entered superseded dispatcher");
  };
});
const expected = {
  green: [67, 140, 180, 220],
  triple_green: [67, 140, 180, 220],
  red: [100, 140, 120, 220],
  triple_red: [100, 140, 120, 220],
  spiny: [100, 140, 180, 110],
  banana: [75, 140, 180, 220],
  triple_banana: [75, 140, 180, 220],
  horn: [75, 140, 135, 220],
  bomb: [75, 140, 180, 220],
  hammer: [100, 140, 135, 165],
  coin: [100, 142, 180, 220],
  coin_shell: [100, 175, 225, 275],
  question: [125, 175, 180, 220],
  mushroom: [100, 187, 180, 220],
  triple_mushroom: [100, 187, 180, 220],
  boo: [100, 140, 180, 220],
  blooper: [100, 140, 180, 220],
  lightning: [100, 140, 90, 110],
  star: [100, 140, 180, 220],
  mega: [100, 140, 180, 220],
  bullet: [100, 221, 180, 220],
  power: [100, 140, 180, 220],
  feather: [100, 140, 180, 220],
  fire_flower: [75, 140, 180, 220],
  ice_flower: [80, 140, 180, 220],
  boomerang_flower: [80, 140, 144, 220],
};
const results = [];
for (const [key, scores] of Object.entries(expected)) {
  await p.evaluate(() => classroomCommands.whenIdle());
  await setup(p);
  try {
    const r = await p.evaluate(async (key) => {
      const rng = Math.random;
      Math.random = () => 0;
      const g = state.groups[1];
      addItemToGroup(g, key);
      g.allIn = true;
      const ok = await useItem(g.id, 0);
      await classroomCommands.whenIdle();
      const allIn = g.allIn;
      toggleAllInCard(g.id);
      await classroomCommands.whenIdle();
      Math.random = rng;
      return {
        ok,
        allIn,
        allInBlocked: !g.allIn,
        used: g.itemStats.used,
        scores: state.groups.map((g) => g.score),
        inventory: g.inventory,
        effect: g.itemEffect,
        ghost: g.booRoundsLeftV218,
        targetEffect: state.groups[0].itemEffect,
        targetStatuses: state.groups[0].competitionEffects,
        masked: state.itemGlobal.blooperUntil > Date.now(),
      };
    }, key);
    assert.equal(r.ok, true);
    assert.deepEqual(r.scores, scores);
    assert.equal(r.allIn, false);
    assert.equal(r.allInBlocked, true);
    assert.equal(r.used, 1);
    if (["mega", "power"].includes(key)) {
      assert.equal(r.inventory[0].key, key);
      assert.equal(r.inventory[0].charges, 1);
    } else if (key === "boo") {
      assert.equal(r.inventory[0].key, "mushroom");
      assert.equal(r.inventory[0].charges, 1);
    } else if (
      key.startsWith("triple_") ||
      ["fire_flower", "ice_flower", "boomerang_flower"].includes(key)
    ) {
      assert.equal(r.inventory[0].key, key);
      assert.equal(r.inventory[0].charges, 2);
    } else assert.equal(r.inventory.length, 0);
    if (key === "ice_flower") {
      assert.equal(r.targetStatuses.freeze.remaining, 2);
    }
    if (["star", "mega"].includes(key)) assert.equal(r.effect.roundsLeft, 3);
    if (key === "power") assert.equal(r.effect.roundsLeft, 5);
    if (key === "boo") assert.equal(r.ghost, 3);
    if (key === "feather") assert.equal(r.effect.featherDodge, 1);
    if (key === "blooper") assert.equal(r.masked, true);
    results.push({ key, status: "PASS", actual: r });
  } catch (e) {
    results.push({ key, status: "FAIL", error: e.stack });
    console.log("FAIL", key, e.message);
  }
}
await writeFile(
  "artifacts/rule-oracles.json",
  JSON.stringify(results, null, 2),
);
await browser.close();
server.close();
console.log({
  pass: results.filter((x) => x.status === "PASS").length,
  fail: results.filter((x) => x.status === "FAIL").length,
});
if (results.some((x) => x.status === "FAIL")) process.exitCode = 1;
