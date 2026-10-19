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
const errors = [],
  results = [];
page.on("pageerror", (e) => errors.push(e.message));
try {
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  await setup(page, 14);
  const scored = await page.evaluate(() => {
    animateScores = () => {};
    ClassroomFeedback.score = () => {};
    const g = state.groups[0];
    g.score = 10;
    g.displayScore = 10;
    saveState();
    historyStack = [];
    window.lastClassroomCommandResult = null;
    applyScoreDelta(g.id, 5);
    return {
      score: g.score,
      before: historyStack.at(-1)?.groups[0].score,
      history: historyStack.length,
      result: window.lastClassroomCommandResult,
      saved: JSON.parse(localStorage.getItem(Reliability.stateKey)).groups[0]
        .score,
    };
  });
  assert.equal(scored.score, 15);
  assert.equal(scored.before, 10);
  assert.equal(scored.history, 1);
  assert.equal(scored.result?.persisted, true);
  assert.equal(scored.saved, 15);
  results.push(
    "manual delta joins one pre-operation snapshot and persisted result",
  );
  const reverted = await page.evaluate(() => {
    undoLast();
    return state.groups[0].score;
  });
  assert.equal(reverted, 10);
  results.push("undo restores the pre-command score");
  const invalid = await page.evaluate(() => {
    const before = JSON.stringify({
      groups: state.groups,
      history: historyStack,
    });
    applyScoreDelta(state.groups[0].id, Number.MAX_SAFE_INTEGER);
    return (
      JSON.stringify({ groups: state.groups, history: historyStack }) === before
    );
  });
  assert.equal(invalid, true);
  results.push("overflow refuses all mutations");
  const transient = await page.evaluate(() => {
    const set = Storage.prototype.setItem;
    const old = JSON.parse(localStorage.getItem(Reliability.stateKey)).groups[0]
      .score;
    Storage.prototype.setItem = function (k, v) {
      if (k === Reliability.stateKey)
        throw new DOMException("isolated quota", "QuotaExceededError");
      return set.call(this, k, v);
    };
    try {
      applyScoreDelta(state.groups[0].id, -3);
    } finally {
      Storage.prototype.setItem = set;
    }
    return {
      score: state.groups[0].score,
      old,
      saved: JSON.parse(localStorage.getItem(Reliability.stateKey)).groups[0]
        .score,
      result: window.lastClassroomCommandResult,
      unsaved: window.classroomUnsavedChanges,
    };
  });
  assert.equal(transient.score, 7);
  assert.equal(transient.saved, transient.old);
  assert.equal(transient.result.ok, true);
  assert.equal(transient.result.persisted, false);
  assert.equal(transient.unsaved, true);
  results.push(
    "quota keeps explicit unsaved RAM state without false persistence",
  );
  const direct = await page.evaluate(() => {
    saveState();
    startDirectScoreEdit(state.groups[0].id);
    const input = document.querySelector("#input-score-" + state.groups[0].id);
    input.value = "-20";
    window.lastClassroomCommandResult = null;
    finishDirectScoreEdit(state.groups[0].id);
    return {
      score: state.groups[0].score,
      result: window.lastClassroomCommandResult,
      prior: historyStack.at(-1).groups[0].score,
    };
  });
  assert.equal(direct.score, -20);
  assert.equal(direct.result.persisted, true);
  assert.equal(direct.prior, 7);
  results.push("direct score edit uses the same lifecycle");
  await setup(page, 4);
  const defense = await page.evaluate(async () => {
    const confirm = themeConfirm;
    let resolve;
    themeConfirm = () =>
      new Promise((done) => {
        resolve = done;
      });
    state.groups[0].inventory = [ItemModules.inventory("spiny")];
    state.groups[3].inventory = [ItemModules.inventory("horn")];
    saveState();
    historyStack = [];
    try {
      useItem(state.groups[0].id, 0);
      const pending = classroomCommands.isPending();
      applyScoreDelta(state.groups[3].id, 5);
      resolve(true);
      await new Promise((done) => setTimeout(done, 20));
      return {
        pending,
        score: state.groups[3].score,
        attack: state.groups[0].inventory[0]?.key,
        defense: state.groups[3].inventory[0]?.key,
        history: historyStack.length,
      };
    } finally {
      themeConfirm = confirm;
    }
  });
  assert.deepEqual(defense, {
    pending: true,
    score: 225,
    attack: "spiny",
    defense: "horn",
    history: 1,
  });
  results.push(
    "manual command cancels stale defense without consuming attack or defense",
  );
  const presentation = await page.evaluate(() => {
    const render = renderAll;
    renderAll = () => {
      throw Error("isolated presentation failure");
    };
    try {
      applyScoreDelta(state.groups[0].id, 2);
      return {
        score: state.groups[0].score,
        saved: JSON.parse(localStorage.getItem(Reliability.stateKey)).groups[0]
          .score,
        result: window.lastClassroomCommandResult,
      };
    } finally {
      renderAll = render;
    }
  });
  assert.equal(presentation.score, 102);
  assert.equal(presentation.saved, 102);
  assert.equal(presentation.result.persisted, true);
  results.push("presentation failure cannot undo a persisted manual command");
  assert.deepEqual(errors, []);
} finally {
  await mkdir("artifacts/v3-manual", { recursive: true });
  await writeFile(
    "artifacts/v3-manual/results.json",
    JSON.stringify({ results, errors }, null, 2),
  );
  await browser.close();
  server.close();
}
console.log("PASS manual command lifecycle", results);
