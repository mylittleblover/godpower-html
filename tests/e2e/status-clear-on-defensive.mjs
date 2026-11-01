import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";

/* 无敌/巨大化必须把已有的负面状态清掉，卡片上只留下自己的光环。 */
const html = await readFile("dist/godpower.html");
const server = createServer((_, res) => res.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const errors = [];
const root = "artifacts/status-clear";
await mkdir(root, { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(page, 14);

  const ringsOf = (id) =>
    page.evaluate((id) => {
      const card = document.querySelector(`.group-row-card[data-group-id="${id}"]`);
      return [...card.querySelectorAll(".persistent-aura-v213")].map((a) =>
        [...a.classList]
          .filter((c) => c.startsWith("aura-") && c !== "aura-stacked")
          .join(""),
      );
    }, id);

  const bench = await page.evaluate(() => {
    const g = state.groups[7];
    g.itemEffect = null;
    g.competitionEffects = {};
    CompetitionEffects.apply(g, "burn", 3);
    // Only one status may be active, so a second one is refused by design.
    const secondRefused = CompetitionEffects.apply(g, "dizziness", 3) === false;
    renderGrid();
    return {
      id: g.id,
      secondRefused,
      negatives: Object.keys(g.competitionEffects).sort(),
    };
  });
  assert.deepEqual(bench.negatives, ["burn"], "a single status is active");
  assert.equal(bench.secondRefused, true, "a second status cannot join");
  const before = await ringsOf(bench.id);
  assert.ok(before.includes("aura-burn"), "burn shows before the item");

  const star = await page.evaluate(async (id) => {
    const g = state.groups.find((x) => x.id === id);
    g.inventory = [ItemModules.inventory("star")];
    g.itemUsedThisRound = false;
    useItem(g.id, 0);
    await classroomCommands.whenIdle();
    await new Promise((r) => setTimeout(r, 300));
    return {
      type: g.itemEffect?.type,
      keys: Object.keys(g.competitionEffects || {}).sort(),
      text: document.querySelector(`.group-row-card[data-group-id="${id}"]`)?.innerText || "",
    };
  }, bench.id);
  assert.equal(star.type, "star");
  assert.deepEqual(star.keys, [], "negatives are gone from the data");
  const after = await ringsOf(bench.id);
  assert.deepEqual(after, ["aura-invincible"], "only the invincible ring remains");
  assert.doesNotMatch(star.text, /灼烧|眩晕/, "no negative status text remains");

  // Mega against a different group.
  const mega = await page.evaluate(async () => {
    const g = state.groups[9];
    g.itemEffect = null;
    g.competitionEffects = {};
    CompetitionEffects.apply(g, "poison", 3);
    renderGrid();
    g.inventory = [ItemModules.inventory("mega")];
    g.itemUsedThisRound = false;
    useItem(g.id, 0);
    await classroomCommands.whenIdle();
    await new Promise((r) => setTimeout(r, 300));
    const card = document.querySelector(`.group-row-card[data-group-id="${g.id}"]`);
    return {
      id: g.id,
      type: g.itemEffect?.type,
      keys: Object.keys(g.competitionEffects || {}).sort(),
      rings: [...card.querySelectorAll(".persistent-aura-v213")].map((a) =>
        [...a.classList].filter((c) => c.startsWith("aura-") && c !== "aura-stacked").join(""),
      ),
      text: card.innerText,
    };
  });
  assert.equal(mega.type, "mega");
  assert.deepEqual(mega.keys, []);
  assert.deepEqual(mega.rings, ["aura-mega"], "only the mega ring remains");
  assert.doesNotMatch(mega.text, /中毒/);

  await page.screenshot({ path: `${root}/cleared.png` });
  assert.deepEqual(errors, []);
  const results = [{ bench, before, star, after, mega }];
  await writeFile(`${root}/results.json`, JSON.stringify({ status: "PASS", results }, null, 2));
  console.log(JSON.stringify({ status: "PASS", before, after, megaRings: mega.rings }, null, 2));
} finally {
  await browser.close();
  server.close();
}
