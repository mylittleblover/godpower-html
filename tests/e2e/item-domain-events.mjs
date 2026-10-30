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
  const acquiredReward = await page.evaluate(async () => {
    state.isLocked = false;
    state.achievementLedger = AchievementLedger.empty();
    historyStack = [];
    const group = state.groups[0];
    const groupUid = group.groupUid;
    const originalDraw = drawItemForGroup;
    const originalFinalPick = pickItemForGroupV281;
    drawItemForGroup = () => "coin";
    pickItemForGroupV281 = () => "coin";
    handRaiseGroupId = group.id;
    const events = [];
    window.addEventListener("godpower:domain-commit", (event) =>
      events.push(...event.detail.events),
    );
    handDrawItem();
    handItemDrawStartedAt = -10000;
    await new Promise((resolve) => setTimeout(resolve, 200));
    const completion = await classroomCommands.whenIdle();
    drawItemForGroup = originalDraw;
    pickItemForGroupV281 = originalFinalPick;
    return {
      completion,
      groupUid,
      inventory: group.inventory.map((item) => item.key),
      totalDraws: state.itemGlobal.totalDraws,
      events,
      ledger: state.achievementLedger,
      persisted: JSON.parse(localStorage.getItem(Reliability.stateKey))
        .achievementLedger,
    };
  });
  assert.equal(acquiredReward.completion.persisted, true);
  assert.deepEqual(acquiredReward.inventory, ["coin"]);
  assert.equal(
    acquiredReward.totalDraws,
    1,
    "the inventory helper counts the draw once",
  );
  assert.equal(acquiredReward.events.length, 1);
  assert.equal(acquiredReward.events[0].type, "ITEM_ACQUIRED");
  assert.equal(acquiredReward.events[0].aggregate.id, acquiredReward.groupUid);
  assert.equal(acquiredReward.events[0].payload.itemKey, "coin");
  assert.equal(
    acquiredReward.ledger.groups[acquiredReward.groupUid].seasonCounters
      .ITEM_ACQUIRED,
    1,
  );
  assert.deepEqual(acquiredReward.persisted, acquiredReward.ledger);
  const undoneAcquisition = await page.evaluate(async () => {
    const accepted = await undoLast();
    const completion = await classroomCommands.whenIdle();
    return {
      accepted,
      persisted: completion.persisted,
      inventory: state.groups[0].inventory.map((item) => item.key),
      totalDraws: state.itemGlobal.totalDraws,
      ledger: state.achievementLedger,
      savedLedger: JSON.parse(localStorage.getItem(Reliability.stateKey))
        .achievementLedger,
    };
  });
  assert.equal(undoneAcquisition.accepted, true);
  assert.equal(undoneAcquisition.persisted, true);
  assert.deepEqual(undoneAcquisition.inventory, []);
  assert.equal(undoneAcquisition.totalDraws, 0);
  assert.deepEqual(undoneAcquisition.ledger, { schemaVersion: 1, groups: {} });
  assert.deepEqual(undoneAcquisition.savedLedger, undoneAcquisition.ledger);
  console.log(
    "PASS formal hand-reward draw emits durable ITEM_ACQUIRED and undo restores its ledger",
  );

  await setup(page, 4);
  const failedAcquisition = await page.evaluate(async () => {
    state.isLocked = false;
    state.achievementLedger = AchievementLedger.empty();
    historyStack = [];
    const group = state.groups[0];
    const originalDraw = drawItemForGroup;
    const originalFinalPick = pickItemForGroupV281;
    const originalWrite = Reliability.writeVerified;
    drawItemForGroup = () => "coin";
    pickItemForGroupV281 = () => "coin";
    Reliability.writeVerified = () => ({ ok: false, error: "injected quota" });
    handRaiseGroupId = group.id;
    const events = [];
    window.addEventListener("godpower:domain-commit", (event) =>
      events.push(...event.detail.events),
    );
    handDrawItem();
    handItemDrawStartedAt = -10000;
    await new Promise((resolve) => setTimeout(resolve, 200));
    const completion = await classroomCommands.whenIdle();
    Reliability.writeVerified = originalWrite;
    drawItemForGroup = originalDraw;
    pickItemForGroupV281 = originalFinalPick;
    return {
      completion,
      inventory: group.inventory.map((item) => item.key),
      totalDraws: state.itemGlobal.totalDraws,
      ledger: state.achievementLedger,
      events,
      savedInventory: JSON.parse(localStorage.getItem(Reliability.stateKey))
        .groups[0].inventory.map((item) => item.key),
    };
  });
  assert.equal(failedAcquisition.completion.ok, false);
  assert.deepEqual(failedAcquisition.inventory, []);
  assert.equal(failedAcquisition.totalDraws, 0);
  assert.deepEqual(failedAcquisition.ledger, { schemaVersion: 1, groups: {} });
  assert.deepEqual(failedAcquisition.events, []);
  assert.deepEqual(failedAcquisition.savedInventory, []);
  console.log("PASS failed acquisition persistence rolls back without a false event");

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

  await setup(page, 4);
  const confirmedHit = await page.evaluate(async () => {
    state.isLocked = false;
    state.achievementLedger = AchievementLedger.empty();
    historyStack = [];
    state.groups.forEach((group, index) => {
      group.score = index * 10;
      group.displayScore = group.score;
    });
    const attacker = state.groups[0];
    const leader = state.groups[3];
    addItemToGroup(attacker, "spiny");
    const events = [];
    window.addEventListener("godpower:domain-commit", (event) =>
      events.push(...event.detail.events),
    );
    const accepted = useItem(attacker.id, 0);
    const completion = await classroomCommands.whenIdle();
    return {
      accepted,
      persisted: completion.persisted,
      attackerUid: attacker.groupUid,
      leaderUid: leader.groupUid,
      score: leader.score,
      events,
      ledger: state.achievementLedger,
    };
  });
  assert.equal(confirmedHit.accepted, true);
  assert.equal(confirmedHit.persisted, true);
  assert.equal(confirmedHit.score, 15);
  assert.deepEqual(
    confirmedHit.events.map((event) => [event.type, event.aggregate.id]),
    [
      ["ITEM_USED", confirmedHit.attackerUid],
      ["ITEM_HIT", confirmedHit.leaderUid],
    ],
  );
  assert.equal(
    confirmedHit.events[1].payload.scoreLost,
    15,
    "the spiny-shell score delta is the confirmed applied damage",
  );
  assert.equal(
    confirmedHit.ledger.groups[confirmedHit.leaderUid].seasonCounters.ITEM_HIT,
    1,
  );
  console.log(
    "PASS item use is durable, undo/cancel emits no false fact, and confirmed damage emits ITEM_HIT",
  );
} finally {
  await browser.close();
  server.close();
}
