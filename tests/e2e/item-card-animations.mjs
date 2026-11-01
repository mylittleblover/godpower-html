import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";

/* Every shipped item must map to a distinct, actually-running card animation. */
const html = await readFile("dist/godpower.html");
const server = createServer((_, res) => res.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const errors = [];
const root = process.env.ITEM_FX_ARTIFACT_DIR || "artifacts/item-fx";
await mkdir(root, { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("dialog", (d) => d.accept());
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(page, 4);
  await page.evaluate(() => {
    if (typeof DesktopUI !== "undefined") DesktopUI.setGroupCruise(false);
    state.groups.forEach((g, i) => { g.score = 100 + i * 10; });
    renderGrid();
  });

  const keys = await page.evaluate(() => ITEM_KEYS.slice());
  const seen = [];
  for (const key of keys) {
    const probe = await page.evaluate(async (key) => {
      const card = document.querySelector(`.group-row-card[data-group-id="${state.groups[0].id}"]`);
      card.querySelectorAll(".bm-layer").forEach((n) => n.remove());
      BattleMotion.show("hit", state.groups[0].id, key, "测试");
      await new Promise((r) => setTimeout(r, 260));
      const layer = card.querySelector(".bm-layer");
      if (!layer) return { key, missing: true };
      const before = getComputedStyle(layer, "::before");
      const wave = layer.querySelector(".bm-wave");
      const shards = layer.querySelector(".bm-shards");
      return {
        key,
        family: layer.dataset.family,
        beforeBg: before.backgroundImage.slice(0, 46),
        beforeAnim: before.animationName,
        filter: before.filter.slice(0, 30),
        clip: before.clipPath.slice(0, 30),
        hasWave: !!wave,
        waveAnim: wave ? getComputedStyle(wave).animationName : null,
        shardCount: shards ? shards.children.length : 0,
      };
    }, key);
    seen.push(probe);
    await page.evaluate(() => {
      document.querySelectorAll(".bm-layer").forEach((n) => n.remove());
    });
    await page.waitForTimeout(40);
  }

  const families = new Set(seen.map((s) => s.family));
  const missing = seen.filter((s) => s.missing || !s.hasWave);
  const pulse = seen.filter((s) => s.family === "pulse");
  console.log(JSON.stringify({
    items: seen.length,
    families: [...families].sort(),
    missing: missing.map((m) => m.key),
    fellBackToPulse: pulse.map((p) => p.key),
    allAnimated: seen.every((s) => s.beforeAnim && s.beforeAnim !== "none"),
    allHaveShards: seen.every((s) => s.shardCount === 10),
  }, null, 2));

  assert.equal(seen.length, 28, "all shipped items covered");
  assert.deepEqual(missing, [], "every item mounts a full layer");
  assert.deepEqual(pulse, [], "no item falls back to the generic pulse");
  assert.ok(seen.every((s) => s.beforeAnim && s.beforeAnim !== "none"),
    "every family has its own keyframe animation");
  assert.ok(seen.every((s) => s.shardCount === 10), "shards on every effect");
  assert.equal(families.size, 16, "distinct families, got " + families.size);

  // A card screenshot with one effect for visual evidence.
  await page.evaluate(() => {
    BattleMotion.show("hit", state.groups[0].id, "kamek", "卡美克");
  });
  await page.waitForTimeout(280);
  await page.screenshot({ path: `${root}/item-fx.png` });
  assert.deepEqual(errors, []);
  await writeFile(`${root}/results.json`,
    JSON.stringify({ status: "PASS", items: seen.length, families: [...families].sort(), seen }, null, 2));
  console.log("PASS item animations");
} finally {
  await browser.close();
  server.close();
}
