import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";

/* Invincible and mega last three ANSWER ROUNDS. Absorbing attacks must not
   shorten them, and a state that is never attacked still expires. */
const html = await readFile("dist/godpower.html");
const server = createServer((_, res) => res.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const errors = [];
const root = "artifacts/defense-rounds";
await mkdir(root, { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("dialog", (d) => d.accept());
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(page, 14);

  const start = await page.evaluate(async () => {
    const g = state.groups[3];
    g.itemEffect = null;
    g.competitionEffects = {};
    g.inventory = [ItemModules.inventory("star")];
    g.itemUsedThisRound = false;
    useItem(g.id, 0);
    await classroomCommands.whenIdle();
    return {
      type: g.itemEffect?.type,
      roundsLeft: g.itemEffect?.roundsLeft,
      hasHits: "hitsLeft" in (g.itemEffect || {}),
      label: CompetitionEffects.labels(g),
    };
  });
  assert.equal(start.type, "star");
  assert.equal(start.roundsLeft, 3, "armed for three rounds");
  assert.equal(start.hasHits, false, "no attack-count field remains");
  assert.match(start.label[0], /无敌 · 剩余 3 轮$/);

  // Absorbing attacks must not consume rounds.
  const absorbed = await page.evaluate(async () => {
    const g = state.groups[3];
    const attacker = state.groups[5];
    attacker.inventory = [ItemModules.inventory("green")];
    attacker.itemUsedThisRound = false;
    useItem(attacker.id, 0);
    await classroomCommands.whenIdle();
    await new Promise((r) => setTimeout(r, 200));
    return { roundsLeft: g.itemEffect?.roundsLeft, type: g.itemEffect?.type };
  });
  assert.equal(absorbed.type, "star", "the state survives an attack");
  assert.equal(absorbed.roundsLeft, 3, "blocking an attack costs no round");

  // Three answered rounds expire it.
  const rounds = [];
  for (let i = 0; i < 3; i++) {
    const step = await page.evaluate(async () => {
      const g = state.groups[3];
      // One answered round through the real settlement path.
      CompetitionEffects.answer(
        g,
        g.score,
        g.score + 2,
        () => 0.99,
        { correct: true, allIn: false },
      );
      return { type: g.itemEffect?.type ?? null, roundsLeft: g.itemEffect?.roundsLeft ?? null };
    });
    rounds.push(step);
  }
  assert.equal(rounds[0].roundsLeft, 2, "first round leaves two");
  assert.equal(rounds[1].roundsLeft, 1, "second leaves one");
  assert.equal(rounds[2].type, null, "third round ends the state");

  // Mega behaves the same and releases its slot on expiry.
  const mega = await page.evaluate(async () => {
    const g = state.groups[6];
    g.itemEffect = null;
    g.competitionEffects = {};
    g.inventory = [ItemModules.inventory("mega")];
    g.itemUsedThisRound = false;
    useItem(g.id, 0);
    await classroomCommands.whenIdle();
    const armed = { type: g.itemEffect?.type, roundsLeft: g.itemEffect?.roundsLeft };
    const slotHeld = g.inventory.some((x) => x.key === "mega");
    for (let i = 0; i < 3; i++)
      CompetitionEffects.answer(g, g.score, g.score + 1, () => 0.99, { correct: true, allIn: false });
    return {
      armed,
      slotHeld,
      after: g.itemEffect,
      slotFreed: !g.inventory.some((x) => x.key === "mega"),
    };
  });
  assert.deepEqual(mega.armed, { roundsLeft: 3, type: "mega" });
  assert.equal(mega.slotHeld, true, "mega occupies the main slot while active");
  assert.equal(mega.after, null, "mega expires after three rounds");
  assert.equal(mega.slotFreed, true, "its slot is released on expiry");

  await page.screenshot({ path: `${root}/rounds.png` });
  assert.deepEqual(errors, []);
  const results = [{ start, absorbed, rounds, mega }];
  await writeFile(`${root}/results.json`, JSON.stringify({ status: "PASS", results }, null, 2));
  console.log(JSON.stringify({ status: "PASS", start, absorbed, rounds, mega }, null, 2));
} finally {
  await browser.close();
  server.close();
}
