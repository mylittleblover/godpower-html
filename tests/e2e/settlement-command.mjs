import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";

const html = await readFile("dist/godpower.html");
const server = createServer((request, response) => {
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.end(html);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const browser = await launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  await setup(page);
  const result = await page.evaluate(async () => {
    renderAll = () => {
      window.settlementRenderCount++;
    };
    window.settlementRenderCount = 0;
    const originalSaveState = saveState;
    window.settlementSaveCount = 0;
    saveState = (...args) => {
      window.settlementSaveCount++;
      return originalSaveState(...args);
    };
    state.roundActive = true;
    state.evaluated = false;
    state.correctAns = "A";
    state.itemGlobal.pkTotal = 0;
    state.groups = normalizeAllGroups([
      {
        id: 1,
        groupUid: "settle-1",
        groupNo: 1,
        name: "答对组",
        score: 0,
        selectedOpt: "A",
        allIn: false,
        members: [],
      },
      {
        id: 2,
        groupUid: "settle-2",
        groupNo: 2,
        name: "All In 组",
        score: 10,
        selectedOpt: "B",
        allIn: true,
        members: [],
      },
    ]);
    state.groups[0].itemEffect = { type: "power", roundsLeft: 2 };
    historyStack = [];
    ensureV2State();
    const accepted = judgeRound();
    const completion = await classroomCommands.whenIdle();
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      accepted,
      completion,
      history: historyStack.length,
      renders: window.settlementRenderCount,
      saves: window.settlementSaveCount,
      scores: state.groups.map((group) => group.score),
      evaluated: state.evaluated,
      pkTotal: state.itemGlobal.pkTotal,
    };
  });
  assert.equal(result.accepted, true);
  assert.equal(result.completion.ok, true);
  assert.equal(
    result.history,
    1,
    "one settlement must create exactly one undo point",
  );
  assert.equal(
    result.renders,
    1,
    "settlement renders only after its command finishes",
  );
  assert.equal(
    result.saves,
    1,
    "delayed item feedback must not persist the settlement again",
  );
  assert.deepEqual(result.scores, [2, 0]);
  assert.equal(result.evaluated, true);
  assert.equal(result.pkTotal, 1);
  await mkdir("artifacts/v3-settlement-command", { recursive: true });
  await writeFile(
    "artifacts/v3-settlement-command/results.json",
    JSON.stringify(
      {
        browser: browser.version(),
        viewport: "1920x1080@1x",
        status: "PASS",
        result,
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS one transactional round settlement: single history point and one post-command render",
  );
} finally {
  await browser.close();
  server.close();
}
