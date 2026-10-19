import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
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
  const compatibility = await page.evaluate(() => {
    const oldBackup = buildClassroomBackup();
    delete oldBackup.achievementLedger;
    Reliability.validateBackup(oldBackup);
    const malformed = buildClassroomBackup();
    malformed.achievementLedger = { schemaVersion: 99, groups: {} };
    try {
      Reliability.validateBackup(malformed);
      return { oldBackupAccepted: true, malformedRejected: false };
    } catch {
      return { oldBackupAccepted: true, malformedRejected: true };
    }
  });
  assert.deepEqual(compatibility, {
    oldBackupAccepted: true,
    malformedRejected: true,
  });
  const beforeReload = await page.evaluate(async () => {
    state.isLocked = false;
    state.roundActive = true;
    state.evaluated = false;
    state.correctAns = "A";
    state.groups = normalizeAllGroups([
      {
        id: 1,
        groupUid: "ach-group-1",
        groupNo: 1,
        name: "答对组",
        score: 0,
        selectedOpt: "A",
        members: [],
      },
      {
        id: 2,
        groupUid: "ach-group-2",
        groupNo: 2,
        name: "未作答组",
        score: 3,
        selectedOpt: "",
        members: [],
      },
    ]);
    state.achievementLedger = AchievementLedger.empty();
    historyStack = [];
    ensureV2State();
    const committed = [];
    window.addEventListener("godpower:domain-commit", (event) =>
      committed.push(event.detail),
    );
    const accepted = judgeRound();
    const result = await classroomCommands.whenIdle();
    return {
      accepted,
      result,
      committed,
      ledger: state.achievementLedger,
      backup: JSON.parse(localStorage.getItem("godpower_state_v2")),
      scores: state.groups.map((group) => group.score),
    };
  });
  assert.equal(beforeReload.accepted, true);
  assert.equal(beforeReload.result.persisted, true);
  assert.equal(beforeReload.committed.length, 1);
  assert.equal(beforeReload.committed[0].events.length, 2);
  assert.ok(
    beforeReload.committed[0].events.every(
      (event) => event.source === "classroom",
    ),
  );
  assert.deepEqual(beforeReload.scores, [2, 3]);
  assert.equal(
    beforeReload.ledger.groups["ach-group-1"].seasonCounters.ROUND_SETTLED,
    1,
  );
  assert.equal(
    beforeReload.ledger.groups["ach-group-2"].seasonCounters.ROUND_SETTLED,
    1,
  );
  assert.deepEqual(beforeReload.backup.achievementLedger, beforeReload.ledger);

  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.classroomReady === true);
  const restored = await page.evaluate(() => ({
    groups: Object.keys(state.achievementLedger.groups).sort(),
    correct:
      state.achievementLedger.groups["ach-group-1"]?.historicalCounters
        .ROUND_SETTLED,
    unanswered:
      state.achievementLedger.groups["ach-group-2"]?.historicalCounters
        .ROUND_SETTLED,
  }));
  assert.deepEqual(restored, {
    groups: ["ach-group-1", "ach-group-2"],
    correct: 1,
    unanswered: 1,
  });

  const undo = await page.evaluate(async () => {
    state.isLocked = false;
    const accepted = await undoLast();
    const result = await classroomCommands.whenIdle();
    return { accepted, result, ledger: state.achievementLedger };
  });
  assert.equal(undo.accepted, true);
  assert.equal(undo.result.persisted, true);
  assert.deepEqual(undo.ledger, { schemaVersion: 1, groups: {} });
  console.log(
    "PASS confirmed round events persist once, reload, and roll back with history undo",
  );
} finally {
  await browser.close();
  server.close();
}
