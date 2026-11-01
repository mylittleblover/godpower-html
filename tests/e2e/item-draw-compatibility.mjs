import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { sourceAt } from "../fixtures/source-at.mjs";
import { launch, setup } from "../fixtures/browser.mjs";
const baseline =
    process.env.DRAW_BASELINE || "d97b44dfff2a3c647d3e9f4b34ebbffc31122deb",
  before = sourceAt(baseline),
  after = await readFile("dist/godpower.html");
const server = createServer((q, r) => {
  r.setHeader("Content-Type", "text/html;charset=utf-8");
  r.end(q.url === "/before" ? before : after);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch(),
  results = {};
try {
  for (const version of ["before", "after"]) {
    const p = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
    });
    await p.goto(`http://127.0.0.1:${server.address().port}/${version}`);
    await setup(p, 14);
    results[version] = await p.evaluate(() => {
      // Explicit approved extensions change the live pool. This differential
      // proves unchanged legacy draws when the two new modules are disabled;
      // items-status.mjs separately tests their enabled midfield behavior.
      if (globalThis.ItemModules) {
        const config = ItemModules.configuration();
        for (const key of ["kamek", "item_box"])
          if (config.items[key]) config.items[key].draw.enabled = false;
        ItemModules.update(config);
      }
      const output = [];
      const rng = Math.random;
      const original = JSON.parse(JSON.stringify(state.groups));
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
              const key = pickItemForGroupV281(g, new Set(["green"]));
              output.push({
                seed,
                index,
                hand,
                held,
                key,
                first: firstHandDrawPendingV218,
                session: state.itemGlobal.drawSessionThrottleV21710,
                throttle: state.itemGlobal.drawThrottleV2179,
              });
            }
      Math.random = rng;
      return output;
    });
    await p.close();
  }
  assert.deepEqual(results.after, results.before);
  const artifactRoot = process.env.DRAW_ARTIFACTS || "artifacts/item-modules";
  await mkdir(artifactRoot, { recursive: true });
  await writeFile(
    `${artifactRoot}/draw-compatibility.json`,
    JSON.stringify(
      {
        status: "PASS",
        baseline,
        extensionsDisabled: ["kamek", "item_box"],
        cases: results.after.length,
        viewport: "1920x1080 1x",
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS legacy draw compatibility with new extensions disabled",
    results.after.length,
    "seeded cases",
  );
} finally {
  await browser.close();
  server.close();
}
