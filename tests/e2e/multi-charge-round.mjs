import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, dismissStartup, setup } from "../fixtures/browser.mjs";
await mkdir("artifacts/multi-charge-round", { recursive: true });
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
  const results = [];
  for (const key of [
    "triple_green",
    "triple_red",
    "triple_banana",
    "triple_mushroom",
    "fire_flower",
    "ice_flower",
    "boomerang_flower",
  ]) {
    const row = await page.evaluate(async (key) => {
      state.groups.forEach((g) => {
        g.score = g.displayScore = 300;
        g.inventory = [];
        g.itemEffect = null;
        g.competitionEffects = {};
        g.booShield = 0;
        ItemRoundUse.reset(g);
      });
      const g = state.groups[6];
      addItemToGroup(g, key);
      addItemToGroup(g, "coin");
      state.roundActive = true;
      state.evaluated = false;
      state.correctAns = "";
      state.isLocked = false;
      const id = g.inventory[0].itemInstanceId;
      const accepted = [];
      for (let i = 0; i < 3; i++) {
        const before = queueUseStateV2120(g, 0);
        if (!before.usable)
          throw Error(key + " unexpectedly disabled: " + before.label);
        accepted.push(await useItem(g.id, 0));
        await classroomCommands.whenIdle();
        if (!g.itemUsedThisRound)
          throw Error("successful use must prohibit All In");
      }
      const before = g.score,
        blocked = await useItem(g.id, 0);
      await classroomCommands.whenIdle();
      const otherBlocked = !queueUseStateV2120(g, 0).usable;
      g.inventory = [];
      addItemToGroup(g, key);
      const sameTypeNew = Reliability.validateItem(state, g, 0, true);
      return {
        key,
        id,
        accepted,
        blocked,
        otherBlocked,
        scoreUnchanged: g.score === before,
        sameTypeNew,
        used: g.itemStats.used,
      };
    }, key);
    assert.deepEqual(row.accepted, [true, true, true], key);
    assert.equal(row.blocked, false, key + " second item is forbidden");
    assert.equal(row.otherBlocked, true);
    assert.equal(row.scoreUnchanged, true);
    assert.ok(row.sameTypeNew, "same key with a new identity must be blocked");
    results.push(row);
  }
  await page.evaluate(async () => {
    const g = state.groups[0];
    g.inventory = [];
    g.score = g.displayScore = 300;
    g.itemEffect = null;
    g.competitionEffects = {};
    ItemRoundUse.reset(g);
    addItemToGroup(g, "fire_flower");
    await useItem(g.id, 0);
    await classroomCommands.whenIdle();
    await saveState();
    await classroomCommands.whenIdle();
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.evaluate(() => SaveManager.ready());
  assert.equal(
    await page.evaluate(() =>
      ItemRoundUse.canContinue(state.groups[0], state.groups[0].inventory[0]),
    ),
    true,
    "remaining charges retain same instance across reload",
  );
  assert.deepEqual(errors, []);
  await writeFile(
    "artifacts/multi-charge-round/result.json",
    JSON.stringify({ status: "PASS", results, errors }, null, 2),
  );
  console.log(
    "PASS seven multi-charge items, same-instance continuation, other instance blocked, durable reload",
  );
} finally {
  await browser.close();
  server.close();
}
