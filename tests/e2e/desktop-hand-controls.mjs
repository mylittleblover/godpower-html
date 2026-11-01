import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";

/* Desktop hand control end-to-end: a stubbed desktop bridge drives the same
   main-renderer port the Electron preload calls, so the classroom rules,
   transactions and persistence run exactly as shipped. */
const html = await readFile("dist/godpower.html");
const server = createServer((_, res) => res.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const results = [];
const errors = [];
const root = process.env.HAND_ARTIFACT_DIR || "artifacts/hand-controls";
await mkdir(root, { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("dialog", (d) => d.accept());
  // Install the desktop bridge before any page script observes it.
  await page.addInitScript(() => {
    window.__gpExec = null;
    window.__gpReplies = [];
    window.__gpPublished = [];
    window.godpowerDesktop = {
      role: "main",
      publish(snapshot) {
        window.__gpPublished.push(snapshot);
      },
      reply(message) {
        window.__gpReplies.push(message);
      },
      ready() {},
      openPicker() {},
      showScore() {},
      onExecute(fn) {
        window.__gpExec = fn;
      },
      onShellState() {},
      onUnlockRequest() {},
    };
  });
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(page, 4);
  await page.waitForFunction(() => window.__gpExec !== null);
  const exec = async (action, payload) =>
    page.evaluate(
      async ([action, payload]) => {
        const id = `t-${Math.random().toString(36).slice(2)}`;
        await window.__gpExec({ id, action, payload });
        return window.__gpReplies.at(-1)?.result || null;
      },
      [action, payload],
    );

  const before = await page.evaluate(() => ({
    score: state.groups[0].score,
    inventory: state.groups[0].inventory.length,
    correct: state.groups[0].itemStats.correct,
    wrong: state.groups[0].itemStats.wrong,
  }));

  const selected = await exec("handSelect", { groupId: 1 });
  assert.equal(selected.ok, true, "select a hand group");
  const snap = await page.evaluate(
    () => window.__gpPublished.at(-1)?.hand || null,
  );
  assert.ok(snap?.selectionId, "floating window receives a hand token");
  assert.equal(snap.groupId, 1);
  assert.equal(snap.correct, null);
  assert.equal(snap.canDraw, false, "no reward before a correct answer");
  const token = snap.selectionId;

  assert.equal(
    (await exec("handScore", { groupId: 1, selectionId: token, delta: 2 })).ok,
    false,
    "scoring before judgment is refused",
  );
  assert.equal(
    (
      await exec("handJudge", {
        groupId: 1,
        selectionId: "stale",
        correct: true,
      })
    ).ok,
    false,
    "a stale token is refused",
  );
  assert.equal(
    (
      await exec("handJudge", {
        groupId: 1,
        selectionId: token,
        correct: true,
      })
    ).ok,
    true,
    "judging runs one classroom command",
  );
  assert.equal(
    (
      await exec("handJudge", {
        groupId: 1,
        selectionId: token,
        correct: false,
      })
    ).ok,
    false,
    "a second judgment is refused",
  );
  assert.equal(
    (await exec("handScore", { groupId: 1, selectionId: token, delta: 5 })).ok,
    true,
  );
  const scored = await page.evaluate(() => ({
    score: state.groups[0].score,
    correct: state.groups[0].itemStats.correct,
    wrong: state.groups[0].itemStats.wrong,
    total: state.itemGlobal.handRaiseTotal,
    history: state.itemGlobal.handRaiseHistory.length,
    persisted: !!localStorage.getItem("godpower_state_v2"),
    unsaved: !!window.classroomUnsavedChanges,
  }));
  assert.equal(scored.score, before.score + 5, "score applies through the port");
  assert.equal(scored.correct, before.correct + 1);
  assert.equal(scored.wrong, before.wrong);
  assert.equal(scored.total, 1);
  assert.equal(scored.history, 1);
  assert.equal(scored.persisted, true, "the classroom saved the change");
  assert.equal(scored.unsaved, false, "no unsaved warning after the command");

  const draw = await exec("handDraw", { groupId: 1, selectionId: token });
  assert.equal(draw.ok, true, "draw awards one item");
  assert.ok(draw.itemName, "the awarded item name is reported");
  const drawn = await page.evaluate(() => ({
    inventory: state.groups[0].inventory.length,
    draws: state.groups[0].itemStats.draws,
  }));
  assert.equal(drawn.inventory, before.inventory + 1);
  assert.equal(drawn.draws, 1);
  assert.equal(
    (await exec("handDraw", { groupId: 1, selectionId: token })).ok,
    false,
    "the same hand session cannot draw twice",
  );

  const filled = await page.evaluate(async () => {
    state.groups[0].inventory = [
      ItemModules.inventory("mushroom"),
      ItemModules.inventory("green"),
      ItemModules.inventory("red"),
    ];
    saveState();
    return true;
  });
  assert.equal(filled, true);
  await exec("handSelect", { groupId: 1 });
  const second = await page.evaluate(
    () => window.__gpPublished.at(-1)?.hand?.selectionId || null,
  );
  await exec("handJudge", {
    groupId: 1,
    selectionId: second,
    correct: true,
  });
  const quota = await exec("handDraw", { groupId: 1, selectionId: second });
  assert.equal(quota.ok, false, "a full inventory cannot draw");
  assert.equal(quota.error, "NO_DRAW");
  assert.deepEqual(
    await page.evaluate(() => state.groups[0].inventory.length),
    3,
    "a refused draw leaves the inventory untouched",
  );

  const locked = await page.evaluate(() => {
    state.isLocked = true;
    saveState();
    return true;
  });
  assert.equal(locked, true);
  await exec("handSelect", { groupId: 2 });
  const third = await page.evaluate(
    () => window.__gpPublished.at(-1)?.hand?.selectionId || null,
  );
  assert.equal(
    (await exec("handJudge", { groupId: 2, selectionId: third, correct: true }))
      .error,
    "LOCKED",
    "a locked classroom refuses hand changes",
  );

  const closeReload = await page.evaluate(() => {
    state.isLocked = false;
    ClassroomFeedback.cancel();
    saveState();
    return { score: state.groups[0].score };
  });
  await page.reload({ waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForFunction(() => window.classroomReady);
  const restored = await page.evaluate(() => ({
    score: state.groups[0].score,
    inventory: state.groups[0].inventory.length,
    total: state.itemGlobal.handRaiseTotal,
  }));
  assert.equal(restored.score, closeReload.score, "hand score survives reload");
  assert.equal(restored.inventory, 3);
  // Two accepted judgments (the quota probe and the score probe); the locked
  // attempt was refused and must not count.
  assert.equal(restored.total, 2);

  await page.screenshot({ path: `${root}/hand-controls.png` });
  results.push({
    name: "desktop-hand-port",
    selected: true,
    scoreDelta: 5,
    drawnItem: draw.itemName,
    quotaRollback: true,
    lockedDenied: true,
    reloadPreserved: true,
  });
  assert.deepEqual(errors, []);
  await writeFile(
    `${root}/results.json`,
    JSON.stringify({ status: "PASS", results, errors }, null, 2),
  );
  console.log(JSON.stringify({ status: "PASS", results }, null, 2));
} finally {
  await browser.close();
  server.close();
}
