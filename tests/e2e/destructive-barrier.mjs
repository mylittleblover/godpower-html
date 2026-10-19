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
  await setup(page, 4);
  const clear = await page.evaluate(async () => {
    applyScoreDelta(state.groups[0].id, 2);
    const confirm = themeConfirm;
    themeConfirm = async () => true;
    try {
      await clearHistoryStack();
      return {
        memory: historyStack.length,
        saved: JSON.parse(localStorage.getItem(Reliability.stateKey)).history
          .length,
      };
    } finally {
      themeConfirm = confirm;
    }
  });
  assert.deepEqual(clear, { memory: 0, saved: 0 });
  results.push("history clear persists the authoritative envelope");
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.classroomReady);
  assert.equal(
    await page.evaluate(() => {
      state.isLocked = false;
      return historyStack.length;
    }),
    0,
  );
  results.push("cleared history stays empty after an actual reload");
  const late = await page.evaluate(async () => {
    applyScoreDelta(state.groups[0].id, 2);
    let resolve;
    const confirm = themeConfirm;
    themeConfirm = () =>
      new Promise((r) => {
        resolve = r;
      });
    try {
      const request = clearHistoryStack();
      applyScoreDelta(state.groups[0].id, 3);
      resolve(true);
      await request;
      return { history: historyStack.length, score: state.groups[0].score };
    } finally {
      themeConfirm = confirm;
    }
  });
  assert.deepEqual(late, { history: 2, score: 107 });
  results.push("late confirmation cannot clear newly changed history");
  const relocked = await page.evaluate(async () => {
    let resolve;
    const confirm = themeConfirm;
    themeConfirm = () =>
      new Promise((done) => {
        resolve = done;
      });
    const before = historyStack.length;
    try {
      const request = clearHistoryStack();
      state.isLocked = true;
      resolve(true);
      await request;
      return { before, after: historyStack.length };
    } finally {
      state.isLocked = false;
      themeConfirm = confirm;
      closePwdModal();
    }
  });
  assert.equal(relocked.after, relocked.before);
  results.push("history clear rechecks the local lock after confirmation");
  const blocked = await page.evaluate(async () => {
    cancelScoreAnimationAndSync();
    saveState();
    const original = classroomCommands.isCommitting,
      confirm = themeConfirm;
    classroomCommands.isCommitting = () => true;
    themeConfirm = async () => true;
    const snapshot = clone(historyStack[0]),
      backup = buildClassroomBackup();
    backup.groups[0].score = 999;
    const before = JSON.stringify({
      state,
      history: historyStack,
      raw: localStorage.getItem(Reliability.stateKey),
      archives: localStorage.getItem("politics_settlement_history"),
    });
    try {
      const imported = importClassroomData(backup);
      undoLast();
      revertToHistory(0);
      restoreStateFromSnapshot(snapshot);
      await clearHistoryStack();
      const settlement = confirmFinalSettlement();
      const after = JSON.stringify({
        state,
        history: historyStack,
        raw: localStorage.getItem(Reliability.stateKey),
        archives: localStorage.getItem("politics_settlement_history"),
      });
      return { unchanged: before === after, imported, settlement };
    } finally {
      classroomCommands.isCommitting = original;
      themeConfirm = confirm;
    }
  });
  assert.equal(blocked.unchanged, true);
  assert.equal(blocked.imported.ok, false);
  assert.equal(blocked.settlement.ok, false);
  results.push(
    "import undo restore clear and final archive refuse mutation during commit",
  );
  const quota = await page.evaluate(async () => {
    const confirm = themeConfirm,
      set = Storage.prototype.setItem;
    themeConfirm = async () => true;
    const before = historyStack.length;
    Storage.prototype.setItem = function (k, v) {
      if (k === Reliability.stateKey)
        throw new DOMException("isolated history quota", "QuotaExceededError");
      return set.call(this, k, v);
    };
    try {
      await clearHistoryStack();
      return {
        before,
        memory: historyStack.length,
        saved: JSON.parse(localStorage.getItem(Reliability.stateKey)).history
          .length,
      };
    } finally {
      Storage.prototype.setItem = set;
      themeConfirm = confirm;
    }
  });
  assert.equal(quota.memory, quota.before);
  assert.equal(quota.saved, quota.before);
  results.push("history clear save failure restores the existing records");
  assert.deepEqual(errors, []);
} finally {
  await mkdir("artifacts/v3-barrier", { recursive: true });
  await writeFile(
    "artifacts/v3-barrier/results.json",
    JSON.stringify({ results, errors }, null, 2),
  );
  await browser.close();
  server.close();
}
console.log("PASS destructive operation barriers", results);
