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
try {
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  await setup(page, 4);
  const successfulUse = await page.evaluate(async () => {
    state.isLocked = false;
    state.achievementLedger = AchievementLedger.empty();
    historyStack = [];
    const group = state.groups[0];
    group.score = 5;
    group.displayScore = 5;
    addItemToGroup(group, "coin");
    const events = [];
    window.addEventListener("godpower:domain-commit", (event) =>
      events.push(...event.detail.events),
    );
    const accepted = useItem(group.id, 0);
    const completion = await classroomCommands.whenIdle();
    return {
      accepted,
      completion,
      events,
      score: group.score,
      ledger: state.achievementLedger,
      persisted: JSON.parse(localStorage.getItem(Reliability.stateKey))
        .achievementLedger,
      groupUid: group.groupUid,
    };
  });
  assert.equal(successfulUse.accepted, true);
  assert.equal(successfulUse.completion.persisted, true);
  assert.equal(successfulUse.events.length, 1);
  assert.equal(successfulUse.events[0].type, "ITEM_USED");
  assert.equal(successfulUse.events[0].aggregate.id, successfulUse.groupUid);
  assert.equal(successfulUse.events[0].payload.itemKey, "coin");
  assert.equal(
    successfulUse.ledger.groups[successfulUse.groupUid].seasonCounters
      .ITEM_USED,
    1,
  );
  assert.deepEqual(successfulUse.persisted, successfulUse.ledger);

  const undone = await page.evaluate(async () => {
    const accepted = await undoLast();
    const completion = await classroomCommands.whenIdle();
    const group = state.groups[0];
    return {
      accepted,
      persisted: completion.persisted,
      score: group.score,
      inventory: group.inventory.map((item) => item.key),
      ledger: state.achievementLedger,
      savedLedger: JSON.parse(localStorage.getItem(Reliability.stateKey))
        .achievementLedger,
    };
  });
  assert.equal(undone.accepted, true);
  assert.equal(undone.persisted, true);
  assert.equal(undone.score, 5);
  assert.deepEqual(undone.inventory, ["coin"]);
  assert.deepEqual(undone.ledger, { schemaVersion: 1, groups: {} });
  assert.deepEqual(undone.savedLedger, undone.ledger);

  await setup(page, 4);
  const cancelledFreeze = await page.evaluate(async () => {
    state.isLocked = false;
    state.achievementLedger = AchievementLedger.empty();
    historyStack = [];
    const group = state.groups[0];
    group.itemEffect = { iceLock: 1, iceRoundsLeftV218: 1 };
    addItemToGroup(group, "ice_flower");
    const events = [];
    window.addEventListener("godpower:domain-commit", (event) =>
      events.push(...event.detail.events),
    );
    const accepted = useItem(group.id, 0);
    const completion = await classroomCommands.whenIdle();
    return {
      accepted,
      persisted: completion.persisted,
      events,
      inventory: group.inventory.map((item) => item.key),
      ledger: state.achievementLedger,
    };
  });
  assert.equal(cancelledFreeze.accepted, true);
  assert.equal(cancelledFreeze.persisted, true);
  assert.deepEqual(cancelledFreeze.events, []);
  assert.deepEqual(cancelledFreeze.inventory, ["ice_flower"]);
  assert.deepEqual(cancelledFreeze.ledger, { schemaVersion: 1, groups: {} });
  console.log(
    "PASS effective item use emits one durable ITEM_USED fact; undo removes it and cancelled ice use emits none",
  );
} finally {
  await browser.close();
  server.close();
}
