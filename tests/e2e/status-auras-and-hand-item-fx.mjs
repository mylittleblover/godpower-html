import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";

/* Every persistent status gets its own card ring in that state's colour, and a
   hand-panel "use item" reaches the same presentation path as the dock button. */
const html = await readFile("dist/godpower.html");
const server = createServer((_, res) => res.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const results = [];
const errors = [];
const root = process.env.STATUS_AURA_ARTIFACT_DIR || "artifacts/status-auras";
await mkdir(root, { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("dialog", (d) => d.accept());
  await page.addInitScript(() => {
    window.__gpItemFx = [];
    window.__gpExec = null;
    window.__gpPublished = [];
    window.__gpReplies = [];
    window.godpowerDesktop = {
      role: "main",
      publish(snapshot) {
        window.__gpPublished.push(snapshot);
      },
      reply(message) {
        window.__gpReplies.push(message);
      },
      ready() {},
      openPicker() {},
      showScore() {},
      showItemFx(value) {
        window.__gpItemFx.push(value);
      },
      onExecute(fn) {
        window.__gpExec = fn;
      },
      onShellState() {},
      onUnlockRequest() {},
    };
  });
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(page, 4);
  await page.waitForFunction(() => window.__gpExec !== null);

  const aurA = await page.evaluate(() => {
    const group = state.groups[0];
    group.competitionEffects = {};
    CompetitionEffects.apply(group, "burn", 2);
    CompetitionEffects.apply(group, "poison", 2);
    group.itemEffect = { type: "star", hitsLeft: 2 };
    renderGrid();
    const card = document.querySelector(`.group-row-card[data-group-id="${group.id}"]`);
    return [...card.querySelectorAll(".persistent-aura")].map((a) => ({
      cls: a.className,
      border: getComputedStyle(a).borderTopColor,
      inset: a.style.inset,
    }));
  });
  assert.equal(aurA.length, 3, "invincible + burn + poison each add a ring");
  const classes = aurA.map((a) => a.cls);
  assert.ok(classes.some((c) => c.includes("aura-invincible")));
  assert.ok(classes.some((c) => c.includes("aura-burn")));
  assert.ok(classes.some((c) => c.includes("aura-poison")));
  const borders = aurA.map((a) => a.border);
  assert.equal(
    new Set(borders).size,
    3,
    "each status uses a distinct colour",
  );
  assert.deepEqual(
    aurA.map((a) => a.inset),
    ["-4px", "-9px", "-14px"],
    "stacked rings nest outward",
  );

  const all = await page.evaluate(() => {
    const group = state.groups[1];
    group.competitionEffects = {};
    group.itemEffect = null;
    for (const key of ['burn', 'freeze', 'paralysis', 'poison', 'dizziness'])
      CompetitionEffects.apply(group, key, 2);
    renderGrid();
    const card = document.querySelector(`.group-row-card[data-group-id="${group.id}"]`);
    const rings = [...card.querySelectorAll(".persistent-aura")];
    return {
      count: rings.length,
      colors: rings.map((a) => getComputedStyle(a).borderTopColor),
      animated: rings.every(
        (a) => getComputedStyle(a).animationName === "auraBreath",
      ),
    };
  });
  assert.equal(all.count, 5, "all five timed negative states get a ring");
  assert.equal(new Set(all.colors).size, 5, "no two states share a colour");
  assert.equal(all.animated, true, "rings keep the shared breathing animation");

  const stacked = await page.evaluate(() => {
    state.groups.forEach((group) => {
      group.competitionEffects = {};
      group.itemEffect = null;
    });
    const group = state.groups[2];
    group.itemEffect = { type: "mega", hitsLeft: 3 };
    CompetitionEffects.apply(group, "freeze", 2);
    renderGrid();
    const card = document.querySelector(`.group-row-card[data-group-id="${group.id}"]`);
    return [...card.querySelectorAll(".persistent-aura")].map(
      (a) => getComputedStyle(a).borderTopColor,
    );
  });
  assert.equal(stacked.length, 2);
  assert.equal(new Set(stacked).size, 2, "mega and freeze stay distinguishable");
  await page.screenshot({ path: `${root}/status-auras.png` });

  const beforeClear = await page.evaluate(() => {
    state.groups.forEach((group) => {
      group.competitionEffects = {};
      group.itemEffect = null;
    });
    renderGrid();
    return document.querySelectorAll(".persistent-aura").length;
  });
  assert.equal(beforeClear, 0, "clearing all statuses removes every ring");

  // Hand-panel item use reaches the cinematic presentation path.
  const used = await page.evaluate(async () => {
    const group = state.groups[0];
    group.inventory = [ItemModules.inventory("green")];
    group.score = 50;
    saveState();
    await window.__gpExec({
      id: "fxs-1",
      action: "handSelect",
      payload: { groupId: group.id },
    });
    const token = window.__gpPublished.at(-1).hand.selectionId;
    await window.__gpExec({
      id: "fxs-2",
      action: "handJudge",
      payload: { groupId: group.id, selectionId: token, correct: true },
    });
    const snap = window.__gpPublished.at(-1).hand;
    const useResult = await window.__gpExec({
      id: "fxs-3",
      action: "handUse",
      payload: { groupId: group.id, selectionId: token },
    });
    await new Promise((r) => setTimeout(r, 400));
    return {
      canUse: snap.canUse,
      mainItemName: snap.mainItemName,
      useOk: window.__gpReplies.at(-1)?.result?.ok,
      used: window.__gpReplies.at(-1)?.result?.used,
      itemFx: window.__gpItemFx.at(-1) || null,
      inventory: state.groups[0].inventory.length,
      usedStat: state.groups[0].itemStats.used,
      useResult,
    };
  });
  assert.equal(used.canUse, true, "the hand snapshot exposes a usable main item");
  assert.equal(used.mainItemName, "绿龟壳");
  assert.equal(used.useOk, true, "hand use succeeds");
  assert.equal(used.used, "绿龟壳");
  assert.ok(used.itemFx, "the item cinematic is sent to the native surface");
  assert.equal(used.itemFx.itemName, "绿龟壳");
  assert.ok(
    ["#", "data:image"].some((p) => used.itemFx.icon.startsWith(p)),
    "the icon travels as a bounded local data URL",
  );
  assert.ok(used.itemFx.targets.length >= 1, "targets are reported");
  assert.equal(used.inventory, 0, "the used item left the inventory");
  assert.equal(used.usedStat, 1);

  assert.deepEqual(errors, []);
  results.push({
    name: "status-auras-and-hand-item-fx",
    distinctStatusRings: 7,
    stacked: true,
    handItemFx: used.itemFx.itemName,
  });
  await writeFile(
    `${root}/results.json`,
    JSON.stringify({ status: "PASS", results }, null, 2),
  );
  console.log(JSON.stringify({ status: "PASS", results }, null, 2));
} finally {
  await browser.close();
  server.close();
}
