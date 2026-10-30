import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";

const html = await readFile("dist/godpower.html");
const server = createServer((_, response) => {
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.end(html);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const browser = await launch();
const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
});
const failures = [];
try {
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  await setup(page, 4);
  const outcomes = await page.evaluate(async () => {
    const originalRandom = Math.random;
    const originalConfirm = themeConfirm;
    Math.random = () => 0;
    themeConfirm = async () => true;
    const results = [];
    const stable = (value) =>
      JSON.stringify(value, (key, item) =>
        item && typeof item === "object" && !Array.isArray(item)
          ? Object.fromEntries(
              Object.entries(item).sort(([a], [b]) => a.localeCompare(b)),
            )
          : item,
      );
    try {
      for (const key of ITEM_KEYS) {
        state.groups.forEach((group, index) => {
          group.score = 100 + index * 40;
          group.displayScore = group.score;
          group.inventory = [];
          group.itemEffect = null;
          group.booShield = 0;
          group.booRoundsLeftV218 = 0;
          group.itemUsedThisRound = false;
          delete group.roundItemContinuationKeyV218;
        });
        state.itemGlobal = {
          blooperUntil: 0,
          totalDraws: 0,
          pickerHistory: [],
          handRaiseHistory: [],
          handRaiseTotal: 0,
          pkTotal: 0,
          customIcons: {},
        };
        historyStack = [];
        state.roundActive = true;
        state.evaluated = false;
        state.hasStartedOnce = true;
        state.correctAns = "";
        state.groups = normalizeAllGroups(state.groups);
        ensureV2State();
        const actor = state.groups[1];
        addItemToGroup(actor, key);
        const before = JSON.stringify({
          groups: getPersistableGroups(),
          itemGlobal: state.itemGlobal,
          picker: state.picker,
          round: [
            state.roundActive,
            state.evaluated,
            state.hasStartedOnce,
            state.correctAns,
          ],
        });
        const accepted = useItem(actor.id, 0);
        const committed = accepted ? await classroomCommands.whenIdle() : null;
        let undoAccepted = false;
        let undoCommit = null;
        if (committed?.ok) {
          undoAccepted = await undoLast();
          undoCommit = await classroomCommands.whenIdle();
        }
        const after = JSON.stringify({
          groups: getPersistableGroups(),
          itemGlobal: state.itemGlobal,
          picker: state.picker,
          round: [
            state.roundActive,
            state.evaluated,
            state.hasStartedOnce,
            state.correctAns,
          ],
        });
        const beforeState = JSON.parse(before);
        const afterState = JSON.parse(after);
        results.push({
          key,
          accepted: accepted === true,
          committed: committed?.ok === true && committed.persisted === true,
          undoAccepted: undoAccepted === true,
          undoCommitted:
            undoCommit?.ok === true && undoCommit.persisted === true,
          restored: stable(beforeState) === stable(afterState),
          history: historyStack.length,
        });
      }
    } finally {
      Math.random = originalRandom;
      themeConfirm = originalConfirm;
    }
    return results;
  });
  for (const result of outcomes) {
    try {
      assert.equal(result.accepted, true, `${result.key}: item use accepted`);
      assert.equal(result.committed, true, `${result.key}: item use persisted`);
      assert.equal(result.undoAccepted, true, `${result.key}: undo accepted`);
      assert.equal(result.undoCommitted, true, `${result.key}: undo persisted`);
      assert.equal(
        result.restored,
        true,
        `${result.key}: all operation state restored`,
      );
      assert.equal(result.history, 0, `${result.key}: history node removed`);
    } catch (error) {
      failures.push({ key: result.key, error: error.message, result });
    }
  }
  assert.deepEqual(failures, []);
  console.log(
    `PASS all ${outcomes.length} items commit and undo exact snapshots`,
  );
} finally {
  await browser.close();
  server.close();
}
