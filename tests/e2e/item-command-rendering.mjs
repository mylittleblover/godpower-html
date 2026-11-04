import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, dismissStartup, setup } from "../fixtures/browser.mjs";
await mkdir("artifacts/item-command-rendering", { recursive: true });
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
  await page.evaluate(() => classroomCommands.whenIdle());
  const motion = await page.evaluate(() => {
    DesktopUI.visualEvent("ITEM_USE_START", {
      groupId: state.groups[0].id,
      key: "coin",
    });
    const node = document.querySelector(".bm-layer[data-kind=use]");
    return {
      use: !!node,
      expensive: node
        ?.getAnimations()
        .flatMap((a) => a.effect.getKeyframes())
        .some((f) => f.filter || f.clipPath),
    };
  });
  assert.equal(
    motion.use,
    true,
    "successful use event must mount the caster card effect",
  );
  assert.equal(
    motion.expensive,
    false,
    "caster animation should use compositor properties",
  );
  const result = await page.evaluate(async () => {
    const g = state.groups[6];
    g.inventory = [];
    addItemToGroup(g, "coin");
    const before = g.score,
      original = renderGrid;
    let renders = 0,
      fullDocumentScans = 0;
    const queryAll = document.querySelectorAll;
    document.querySelectorAll = function (selector) {
      if (selector === "*") fullDocumentScans++;
      return queryAll.call(this, selector);
    };
    renderGrid = function (...args) {
      renders++;
      return original.apply(this, args);
    };
    let ok;
    try {
      ok = await useItem(g.id, 0);
      await classroomCommands.whenIdle();
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );
    } finally {
      renderGrid = original;
      document.querySelectorAll = queryAll;
    }
    return {
      ok,
      renders,
      fullDocumentScans,
      before,
      after: g.score,
      used: g.itemStats.used,
      inventory: g.inventory.length,
    };
  });
  assert.equal(result.ok, true);
  assert.equal(result.after, result.before + 2);
  assert.equal(result.used, 1);
  assert.equal(result.inventory, 0);
  assert.equal(
    result.renders,
    1,
    "one item command needs one post-commit grid render, without a second pre-commit rebuild",
  );
  assert.equal(
    result.fullDocumentScans,
    0,
    "closed group window must not scan the full document after an item command",
  );
  const summaries = await page.evaluate(async () => {
    cancelItemScoreAnimations();
    await new Promise((r) => requestAnimationFrame(r));
    const original = renderDashboard;
    let count = 0;
    renderDashboard = function (...args) {
      count++;
      return original.apply(this, args);
    };
    try {
      ScoreCardMotion.play(
        state.groups
          .slice(0, 7)
          .map((g) => ({ groupId: g.id, start: g.score - 2, target: g.score })),
      );
      await new Promise((r) => setTimeout(r, 2600));
      return count;
    } finally {
      renderDashboard = original;
    }
  });
  assert.equal(
    summaries,
    1,
    "simultaneous score animations share one summary refresh",
  );
  assert.deepEqual(errors, []);
  await writeFile(
    "artifacts/item-command-rendering/result.json",
    JSON.stringify({ status: "PASS", result, errors }, null, 2),
  );
  console.log("PASS item commits once and refreshes battle grid once");
} finally {
  await browser.close();
  server.close();
}
