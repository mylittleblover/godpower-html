import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html"),
  server = createServer((_, r) => r.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.evaluate(() => SaveManager.ready());
  await setup(page, 14);
  const result = await page.evaluate(async () => {
    await saveState();
    await SaveManager.whenIdle();
    renderGrid();
    state.groups[6].inventory = [];
    addItemToGroup(state.groups[6], "coin");
    renderGrid();
    const before = [...document.querySelectorAll("#groupList>.group-row-card")];
    const ok = await useItem(state.groups[6].id, 0);
    await classroomCommands.whenIdle();
    const after = [...document.querySelectorAll("#groupList>.group-row-card")];
    const reused = before.filter((n, i) => n === after[i]).length;
    const count = after.length;
    const score = state.groups[6].score;
    state.groups[0].competitionEffects = { freeze: { remaining: 2 } };
    renderGrid();
    const changedStatus =
      before[0] !== document.querySelector("#groupList>.group-row-card");
    cancelScoreAnimationAndSync();
    for (const g of state.groups) {
      g.competitionEffects = {};
      g.itemEffect = null;
      g.selectedOpt = "A";
      g.allIn = false;
    }
    state.correctAns = "A";
    state.roundActive = true;
    state.evaluated = false;
    const beforeRound = state.groups.map((g) => g.score),
      historyBefore = historyStack.length;
    const judged = judgeRound();
    await classroomCommands.whenIdle();
    return {
      ok,
      reused,
      count,
      score,
      changedStatus,
      round: {
        judged,
        before: beforeRound,
        after: state.groups.map((g) => g.score),
        historyAdded: historyStack.length - historyBefore,
        evaluated: state.evaluated,
      },
    };
  });
  console.log(JSON.stringify(result));
  assert.equal(result.ok, true);
  assert.equal(
    result.reused,
    13,
    "only the coin user should need new card markup",
  );
  assert.equal(result.count, 14);
  assert.equal(result.round.judged, true);
  assert.equal(result.round.evaluated, true);
  assert.equal(result.round.historyAdded, 1);
  assert.deepEqual(
    result.round.after,
    result.round.before.map((n) => n + 2),
  );
  assert.equal(result.score, 342);
  assert.equal(
    result.changedStatus,
    true,
    "status-only changes must invalidate a reused card",
  );
  await mkdir("artifacts/battle-card-reuse", { recursive: true });
  await writeFile(
    "artifacts/battle-card-reuse/result.json",
    JSON.stringify({ status: "PASS", ...result }, null, 2),
  );
  console.log(
    "PASS unchanged battle cards retain DOM; inventory and status changes refresh their owners",
  );
} finally {
  await browser.close();
  server.close();
}
