import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, dismissStartup, setup } from "../fixtures/browser.mjs";
await mkdir("artifacts/power-round", { recursive: true });
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
  await setup(page, 4);
  const result = await page.evaluate(async () => {
    const g = state.groups[1];
    addItemToGroup(g, "power");
    await useItem(g.id, 0);
    await classroomCommands.whenIdle();
    const rounds = [];
    for (let i = 0; i < 5; i++) {
      await RoundSettlement.start();
      state.groups.forEach((x) => {
        x.selectedOpt = "A";
      });
      state.correctAns = "A";
      const ok = runClassroomCommand(
        "power test official score calculation",
        () => RoundSettlement.execute(),
      );
      await classroomCommands.whenIdle();
      if (!ok) throw Error("settlement rejected");
      rounds.push({ left: g.itemEffect?.roundsLeft || 0, score: g.score });
    }
    return rounds;
  });
  assert.deepEqual(
    result.map((r) => r.left),
    [4, 3, 2, 1, 0],
  );
  await setup(page, 14);
  const empty = await page.evaluate(async () => {
    const g = state.groups[6];
    state.groups.forEach((x, i) => {
      x.score = x.displayScore = x.id === g.id ? 100 : -1;
    });
    addItemToGroup(g, "green");
    const item = g.inventory[0].itemInstanceId;
    const used = await useItem(g.id, 0);
    await classroomCommands.whenIdle();
    return {
      used,
      unchanged: g.inventory[0].itemInstanceId === item,
      charges: g.inventory[0].charges,
      roundUsed: g.itemUsedThisRound,
    };
  });
  assert.deepEqual(empty, {
    used: false,
    unchanged: true,
    charges: 1,
    roundUsed: false,
  });
  assert.deepEqual(errors, []);
  await writeFile(
    "artifacts/power-round/result.json",
    JSON.stringify({ status: "PASS", result, empty, errors }, null, 2),
  );
  console.log(
    "PASS five valid power answers expire correctly and empty random scope does not consume",
  );
} finally {
  await browser.close();
  server.close();
}
