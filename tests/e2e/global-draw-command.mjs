import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
import { sourceAt } from "../fixtures/source-at.mjs";
const root =
  process.env.GLOBAL_DRAW_ARTIFACT_DIR || "artifacts/global-draw-command";
const html = process.env.GLOBAL_DRAW_SOURCE_REF
  ? sourceAt(process.env.GLOBAL_DRAW_SOURCE_REF)
  : await readFile("dist/godpower.html");
const server = createServer((_, response) => response.end(html));
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const browser = await launch();
const results = [],
  errors = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.evaluate(() => SaveManager.ready());
  await setup(page, 4);
  await page.evaluate(async () => {
    await saveState();
    await SaveManager.whenIdle();
  });
  const success = await page.evaluate(async () => {
    const ledgerBeforeDraw = JSON.parse(
      JSON.stringify(state.achievementLedger),
    );
    const transactions = [];
    const listener = (event) => transactions.push(event.detail);
    window.addEventListener("godpower:domain-commit", listener);
    const original = IDBObjectStore.prototype.put;
    let writes = 0;
    IDBObjectStore.prototype.put = function (...args) {
      if (this.name === "documents") writes++;
      return original.apply(this, args);
    };
    try {
      const accepted = globalItemDraw();
      const duplicate = globalItemDraw();
      handRaiseGroupId = state.groups[0].id;
      const handAttempt = ClassroomHandSession.command("handDraw");
      const backup = buildClassroomBackup();
      const pending = {
        pending: classroomCommands.isPending(),
        writes,
        inventory: backup.groups.reduce(
          (sum, group) => sum + group.inventory.length,
          0,
        ),
        total: backup.itemGlobal.totalDraws,
      };
      const outcome = await classroomCommands.whenIdle();
      const transaction = transactions.find((transaction) =>
        transaction.events.some((event) => event.type === "ITEM_ACQUIRED"),
      );
      const ledger = JSON.stringify(state.achievementLedger);
      const repeated = AchievementLedger.apply(
        state.achievementLedger,
        transaction?.events || [],
        { seasonId: state.seasonId },
      ).ledger;
      return {
        accepted,
        ledgerBeforeDraw,
        duplicate,
        handAttempt: await handAttempt,
        pending,
        outcome,
        writes,
        events: transaction?.events.map((event) => ({
          type: event.type,
          group: event.aggregate.id,
          source: event.payload.source,
        })),
        total: state.itemGlobal.totalDraws,
        inventory: state.groups.reduce(
          (sum, group) => sum + group.inventory.length,
          0,
        ),
        ledgerBeforeReplay: JSON.parse(ledger),
        ledgerAfterReplay: repeated,
      };
    } finally {
      IDBObjectStore.prototype.put = original;
      window.removeEventListener("godpower:domain-commit", listener);
    }
  });
  assert.equal(success.accepted, true);
  assert.equal(success.duplicate, false);
  assert.deepEqual(success.handAttempt, { ok: false, error: "BUSY" });
  assert.deepEqual(success.pending, {
    pending: true,
    writes: 0,
    inventory: 0,
    total: 0,
  });
  assert.equal(success.outcome.ok, true);
  assert.equal(success.outcome.persisted, true);
  assert.equal(success.writes, 1);
  assert.equal(success.total, 4);
  assert.equal(success.inventory, 4);
  assert.equal(success.events.length, 4);
  assert.ok(
    success.events.every(
      (event) =>
        event.type === "ITEM_ACQUIRED" && event.source === "global-draw",
    ),
  );
  assert.equal(new Set(success.events.map((event) => event.group)).size, 4);
  assert.deepEqual(success.ledgerAfterReplay, success.ledgerBeforeReplay);
  results.push({
    scenario:
      "single durable command, safe pending backup and idempotent events",
    result: success,
  });
  const undone = await page.evaluate(async () => {
    await undoLast();
    return {
      ledger: state.achievementLedger,
      inventory: state.groups.reduce(
        (sum, group) => sum + group.inventory.length,
        0,
      ),
      total: state.itemGlobal.totalDraws,
    };
  });
  assert.deepEqual(undone.ledger, success.ledgerBeforeDraw);
  assert.equal(undone.inventory, 0);
  assert.equal(undone.total, 0);
  results.push({
    scenario: "real undo restores committed acquisition ledger receipts",
    result: undone,
  });
  await page.waitForFunction(() => !itemDrawBusy);
  await page.evaluate(() => SaveManager.ready());
  await setup(page, 4);
  await page.evaluate(async () => {
    await saveState();
    await SaveManager.whenIdle();
  });
  const failure = await page.evaluate(async () => {
    ensureV2State();
    const fingerprint = () =>
      JSON.stringify({
        groups: getPersistableGroups(),
        global: state.itemGlobal,
        ledger: state.achievementLedger,
        history: historyStack,
      });
    const before = fingerprint();
    const original = IDBObjectStore.prototype.put;
    let writes = 0,
      commits = 0;
    const listener = () => commits++;
    window.addEventListener("godpower:domain-commit", listener);
    IDBObjectStore.prototype.put = function (...args) {
      if (this.name === "documents") {
        writes++;
        throw new DOMException("test quota", "QuotaExceededError");
      }
      return original.apply(this, args);
    };
    try {
      globalItemDraw();
      const outcome = await classroomCommands.whenIdle();
      await Promise.resolve();
      return {
        outcome,
        writes,
        commits,
        restored: fingerprint() === before,
        busy: itemDrawBusy,
        overlays: document.querySelectorAll(".card-item-roulette").length,
      };
    } finally {
      IDBObjectStore.prototype.put = original;
      window.removeEventListener("godpower:domain-commit", listener);
    }
  });
  assert.equal(failure.outcome.ok, false);
  assert.equal(failure.writes, 1);
  assert.equal(failure.commits, 0);
  assert.equal(failure.restored, true);
  assert.equal(failure.busy, false);
  assert.equal(failure.overlays, 0);
  results.push({
    scenario: "quota failure restores all awards, ledger and history",
    result: failure,
  });
  assert.deepEqual(errors, []);
  await mkdir(root, { recursive: true });
  await writeFile(
    `${root}/command-browser.json`,
    JSON.stringify(
      { status: "PASS", browser: browser.version(), results, errors },
      null,
      2,
    ),
  );
  await page.screenshot({ path: `${root}/after-rollback.png` });
  console.log(JSON.stringify({ status: "PASS", results }));
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
