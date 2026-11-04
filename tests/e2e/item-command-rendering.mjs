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
  const result = await page.evaluate(async () => {
    const g = state.groups[6];
    g.inventory = [];
    addItemToGroup(g, "coin");
    const before = g.score,
      original = renderGrid;
    let renders = 0;
    renderGrid = function (...args) {
      renders++;
      return original.apply(this, args);
    };
    let ok;
    try {
      ok = await useItem(g.id, 0);
      await classroomCommands.whenIdle();
    } finally {
      renderGrid = original;
    }
    return {
      ok,
      renders,
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
