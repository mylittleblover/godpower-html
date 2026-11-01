import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";

/* Status rules:
   1. an active status cannot be stacked with another ordinary status,
   2. invincible and mega force-replace an ordinary status,
   3. invincible and mega never replace each other,
   4. a defensive state blocks ordinary (including negative) statuses. */
const html = await readFile("dist/godpower.html");
const server = createServer((_, res) => res.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const errors = [];
const root = process.env.STATUS_RULES_ARTIFACT_DIR || "artifacts/status-rules";
await mkdir(root, { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("dialog", (d) => d.accept());
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(page, 4);

  const run = (fn) => page.evaluate(fn);

  // Drive the real item path: put the item in slot 0 and use it. The status
  // blueprint decides whether the second use is rejected.
  const use = async (key) =>
    page.evaluate(async (key) => {
      const group = state.groups[0];
      // Each use is its own turn in these probes; the per-round guard would
      // otherwise mask the status rules under test.
      group.itemUsedThisRound = false;
      state.evaluated = false;
      group.inventory = [ItemModules.inventory(key)];
      const before = JSON.stringify(group.itemEffect);
      const accepted = useItem(group.id, 0);
      await classroomCommands.whenIdle();
      return {
        accepted: accepted !== false,
        changed: before !== JSON.stringify(group.itemEffect),
        effect: group.itemEffect,
      };
    }, key);

  const reset = (effect) =>
    page.evaluate((effect) => {
      const group = state.groups[0];
      group.itemEffect = effect;
      group.competitionEffects = {};
      group.inventory = [];
      saveState();
    }, effect);

  const out = {};
  // 1) an ordinary status cannot be stacked
  await reset({ type: "power", roundsLeft: 2 });
  out.ordinaryOverOrdinary = await use("power");

  // 2) a defensive status replaces an ordinary one
  await reset({ type: "power", roundsLeft: 2 });
  out.starOverOrdinary = await use("star");
  // 3) defensive statuses never replace each other
  out.starOverStar = await use("star");
  out.megaOverStar = await use("mega");
  out.afterMegaOverStar = await page.evaluate(
    () => state.groups[0].itemEffect?.type || null,
  );
  // mega replaces an ordinary status
  await reset({ type: "power", roundsLeft: 2 });
  out.megaOverOrdinary = await use("mega");
  out.starOverMega = await use("star");
  out.afterStarOverMega = await page.evaluate(
    () => state.groups[0].itemEffect?.type || null,
  );

  assert.equal(out.ordinaryOverOrdinary.accepted, false, "no status stacking");
  assert.equal(out.ordinaryOverOrdinary.changed, false);
  assert.equal(out.starOverOrdinary.accepted, true, "invincible replaces a status");
  assert.equal(out.starOverOrdinary.effect.type, "star");
  assert.equal(out.starOverStar.accepted, false, "invincible cannot re-apply");
  assert.equal(out.megaOverStar.accepted, false, "mega cannot replace invincible");
  assert.equal(out.afterMegaOverStar, "star", "invincible survives");
  assert.equal(out.megaOverOrdinary.accepted, true, "mega replaces a status");
  assert.equal(out.starOverMega.accepted, false, "invincible cannot replace mega");
  assert.equal(out.afterStarOverMega, "mega", "mega survives");

  // 4) negative statuses respect the defensive guard and never stack.
  const negative = await run(() => {
    const group = state.groups[1];
    group.itemEffect = null;
    group.competitionEffects = {};
    const out = {};
    out.first = CompetitionEffects.apply(group, "burn", 2);
    out.stack = CompetitionEffects.apply(group, "burn", 2);
    out.remaining = group.competitionEffects.burn.remaining;
    // Longest remaining wins instead of adding charges.
    CompetitionEffects.apply(group, "burn", 5);
    out.extended = group.competitionEffects.burn.remaining;
    // Defensive states block ordinary statuses.
    group.itemEffect = { type: "star", hitsLeft: 3 };
    out.blockedByStar = CompetitionEffects.apply(group, "freeze", 2);
    out.noFreeze = !CompetitionEffects.has(group, "freeze");
    group.itemEffect = { type: "mega", hitsLeft: 3 };
    out.blockedByMega = CompetitionEffects.apply(group, "poison", 3);
    return out;
  });
  assert.equal(negative.first, true);
  assert.equal(negative.stack, true, "re-applying refreshes rather than stacks");
  assert.equal(negative.remaining, 2, "duration is not added");
  assert.equal(negative.extended, 5, "the longer duration wins");
  assert.equal(negative.blockedByStar, false, "invincible blocks a negative status");
  assert.equal(negative.noFreeze, true);
  assert.equal(negative.blockedByMega, false, "mega blocks a negative status");

  // A defensive state must also clear negative statuses that are already
  // ticking, not merely block new ones.
  const cleared = await run(async () => {
    const group = state.groups[2];
    group.itemEffect = null;
    group.competitionEffects = {};
    CompetitionEffects.apply(group, "burn", 3);
    CompetitionEffects.apply(group, "poison", 3);
    const beforeKeys = Object.keys(group.competitionEffects).sort();
    group.inventory = [ItemModules.inventory("star")];
    group.itemUsedThisRound = false;
    useItem(group.id, 0);
    await classroomCommands.whenIdle();
    const afterStar = {
      keys: Object.keys(group.competitionEffects || {}).sort(),
      type: group.itemEffect?.type,
    };
    // Mega must do the same.
    group.itemEffect = null;
    group.competitionEffects = {};
    CompetitionEffects.apply(group, "dizziness", 3);
    group.inventory = [ItemModules.inventory("mega")];
    group.itemUsedThisRound = false;
    useItem(group.id, 0);
    await classroomCommands.whenIdle();
    const afterMega = {
      keys: Object.keys(group.competitionEffects || {}).sort(),
      type: group.itemEffect?.type,
    };
    return { beforeKeys, afterStar, afterMega };
  });
  assert.deepEqual(cleared.beforeKeys, ["burn", "poison"]);
  assert.equal(cleared.afterStar.type, "star");
  assert.deepEqual(
    cleared.afterStar.keys,
    [],
    "invincible clears every negative status",
  );
  assert.equal(cleared.afterMega.type, "mega");
  assert.deepEqual(
    cleared.afterMega.keys,
    [],
    "mega clears every negative status",
  );

  // A defensive aura must still render exactly one ring for its own state.
  const ring = await run(() => {
    const group = state.groups[2];
    group.competitionEffects = {};
    group.itemEffect = { type: "mega", hitsLeft: 3 };
    renderGrid();
    const card = document.querySelector(`.group-row-card[data-group-id="${group.id}"]`);
    return [...card.querySelectorAll(".persistent-aura-v213")].map(
      (a) => a.className,
    );
  });
  assert.equal(ring.length, 1, "one defensive status shows one ring");
  assert.match(ring[0], /aura-mega/);

  await page.screenshot({ path: `${root}/status-rules.png` });
  assert.deepEqual(errors, []);
  await writeFile(
    `${root}/results.json`,
    JSON.stringify({ status: "PASS", rules: out, negative }, null, 2),
  );
  console.log(JSON.stringify({ status: "PASS", rules: out, negative, ring }, null, 2));
} finally {
  await browser.close();
  server.close();
}
