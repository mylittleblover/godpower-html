import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html");
const server = createServer((_, res) => {
  res.setHeader("Content-Type", "text/html;charset=utf-8");
  res.end(html);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch(),
  page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
const results = [],
  errors = [];
page.on("pageerror", (e) => errors.push(e.message));
try {
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  for (const key of ["horn", "mushroom"]) {
    await setup(page, 4);
    const result = await page.evaluate(async (key) => {
      const confirm = themeConfirm,
        resolvers = [];
      themeConfirm = () => new Promise((resolve) => resolvers.push(resolve));
      const flag =
        key === "horn"
          ? "__spinyHornDecisionPendingV218"
          : "__spinyDecisionPendingV21727";
      state.groups[0].inventory = [ItemModules.inventory("spiny")];
      state.groups[3].inventory = [ItemModules.inventory(key)];
      saveState();
      historyStack = [];
      try {
        useItem(state.groups[0].id, 0);
        useItem(state.groups[0].id, 0);
        const before = !!state.groups[3][flag];
        resolvers[0](true);
        await new Promise((r) => setTimeout(r, 20));
        const afterStale = !!state.groups[3][flag];
        resolvers[1](true);
        await new Promise((r) => setTimeout(r, 20));
        return {
          before,
          afterStale,
          afterCurrent: !!state.groups[3][flag],
          prompts: resolvers.length,
          score: state.groups[3].score,
          inventory: state.groups[3].inventory.length,
          history: historyStack.length,
          pending: classroomCommands.isPending(),
        };
      } finally {
        themeConfirm = confirm;
      }
    }, key);
    results.push({ key, ...result });
    assert.deepEqual(result, {
      before: true,
      afterStale: true,
      afterCurrent: false,
      prompts: 2,
      score: 220,
      inventory: 0,
      history: 1,
      pending: false,
    });
  }
  assert.deepEqual(errors, []);
} finally {
  await mkdir("artifacts/v3-defense", { recursive: true });
  await writeFile(
    "artifacts/v3-defense/generations.json",
    JSON.stringify({ results, errors }, null, 2),
  );
  await browser.close();
  server.close();
}
console.log(
  "PASS stale defense completion preserves the newer pending decision",
  results,
);
