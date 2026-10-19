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
    const nativeSetTimeout = window.setTimeout.bind(window);
    let delayed;
    window.setTimeout = (callback, delay, ...args) => {
      if (delay === 720) {
        delayed = () => callback(...args);
        return 720;
      }
      return nativeSetTimeout(callback, delay, ...args);
    };
    let writes = 0;
    const originalSave = saveState;
    saveState = (...args) => {
      writes++;
      return originalSave(...args);
    };
    state.roundActive = true;
    state.evaluated = false;
    state.correctAns = "A";
    state.groups = normalizeAllGroups([
      {
        id: 1,
        groupUid: "feedback-1",
        groupNo: 1,
        name: "强力蘑菇组",
        score: 0,
        selectedOpt: "A",
        allIn: false,
        itemEffect: { type: "power", roundsLeft: 2 },
        members: [],
      },
    ]);
    historyStack = [];
    ensureV2State();
    const accepted = judgeRound();
    const completion = await classroomCommands.whenIdle();
    const before = {
      score: state.groups[0].score,
      displayScore: state.groups[0].displayScore,
      writes,
    };
    Reliability.invalidateDefenseDecisions();
    delayed?.();
    await Promise.resolve();
    return {
      accepted,
      completion,
      before,
      after: {
        score: state.groups[0].score,
        displayScore: state.groups[0].displayScore,
        writes,
      },
    };
  });
  assert.equal(result.accepted, true);
  assert.equal(result.completion.ok, true);
  assert.deepEqual(result.after, result.before);
  await mkdir("artifacts/v3-round-feedback", { recursive: true });
  await writeFile(
    "artifacts/v3-round-feedback/results.json",
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
    "PASS stale Power feedback cannot mutate or re-save a newer classroom phase",
  );
} finally {
  await browser.close();
  server.close();
}
