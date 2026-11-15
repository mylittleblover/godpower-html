import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";

const after = await readFile("dist/godpower.html");
const server = createServer((q, r) => {
  r.setHeader("Content-Type", "text/html;charset=utf-8");
  r.end(after);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const results = {};
try {
  for (const runner of ["ItemDrawBlocks.pick", "pickItemForGroupV281"]) {
    const p = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
    });
    await p.goto(`http://127.0.0.1:${server.address().port}/`);
    await setup(p, 14);
    results[runner] = await p.evaluate((mode) => {
      if (globalThis.ItemModules) {
        const config = ItemModules.configuration();
        for (const key of ["kamek", "item_box"])
          if (config.items[key]) config.items[key].draw.enabled = false;
        ItemModules.update(config);
      }
      const output = [];
      const rng = Math.random;
      const original = JSON.parse(JSON.stringify(state.groups));
      const fixedNow = 1_700_600_000_000;
      const realNow = Date.now;
      Date.now = () => fixedNow;
      try {
        for (let seed = 1; seed <= 8; seed++)
          for (let index = 0; index < 14; index++)
            for (const hand of [false, true])
              for (const held of [false, true]) {
                state.groups = normalizeAllGroups(
                  JSON.parse(JSON.stringify(original)),
                );
                state.groups.forEach((g) => (g.inventory = []));
                state.itemGlobal = {
                  blooperUntil: 0,
                  totalDraws: 0,
                  customIcons: {},
                  drawConfig: {
                    ...ItemDrawPolicy.defaultConfig(),
                    mode: "24KartRace",
                    switchPreset: "ALL",
                  },
                  mkwState: {
                    matchStartedAt: fixedNow - 300_000,
                    lastUsedAt: {},
                    lastUsedSession: {},
                  },
                };
                ensureV2State();
                const g = state.groups[index];
                if (held)
                  g.inventory = [{ key: "horn", charges: 1, acquiredAt: 123 }];
                let value = seed;
                Math.random = () => {
                  value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
                  return value / 4294967296;
                };
                handItemDrawGroupId = hand ? g.id : null;
                firstHandDrawPendingV218 = hand;
                activeDrawSessionV21710 = null;
                beginDrawSessionV21710(hand ? "hand" : "global");
                const key =
                  mode === "ItemDrawBlocks.pick"
                    ? ItemDrawBlocks.pick(g, new Set(["green"]))
                    : pickItemForGroupV281(g, new Set(["green"]));
                output.push({
                  seed,
                  index,
                  hand,
                  held,
                  key,
                  session: state.itemGlobal.drawSessionThrottleV21710,
                });
              }
      } finally {
        Date.now = realNow;
        Math.random = rng;
      }
      return output;
    }, runner);
    await p.close();
  }
  assert.deepEqual(
    results["pickItemForGroupV281"],
    results["ItemDrawBlocks.pick"],
  );
  assert.ok(
    results["ItemDrawBlocks.pick"].every(
      (r) => r.key && r.key !== "kamek" && r.key !== "item_box",
    ),
  );
  const artifactRoot = process.env.DRAW_ARTIFACTS || "artifacts/item-modules";
  await mkdir(artifactRoot, { recursive: true });
  await writeFile(
    `${artifactRoot}/draw-compatibility.json`,
    JSON.stringify(
      {
        status: "PASS",
        engine: "MKWorld Product.180",
        extensionsDisabled: ["kamek", "item_box"],
        cases: results["ItemDrawBlocks.pick"].length,
        viewport: "1920x1080 1x",
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS MKWorld Product.180 draw entrypoint compatibility & determinism across",
    results["ItemDrawBlocks.pick"].length,
    "seeded cases",
  );
} finally {
  await browser.close();
  server.close();
}
