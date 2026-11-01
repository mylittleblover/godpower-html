import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";

/* A roster imported through the settings dialog must produce fully normalized
   groups. Without a groupUid every domain event is rejected, which used to
   surface as "道具抽取未能提交" after any import. */
const html = await readFile("dist/godpower.html");
const roster = await readFile("../测试名单-14组-4人.txt", "utf8");
const server = createServer((_, res) => res.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const errors = [];
const root = process.env.ROSTER_IMPORT_ARTIFACT_DIR || "artifacts/roster-import";
await mkdir(root, { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("dialog", (d) => d.accept());
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(page, 4);

  const imported = await page.evaluate((roster) => {
    document.getElementById("settingsBatchMemberText").value = roster;
    applySettingsBatchMembers();
    return {
      groups: state.groups.length,
      total: state.groups.reduce((n, g) => n + g.members.length, 0),
      missingUid: state.groups.filter(
        (g) => typeof g.groupUid !== "string" || !g.groupUid,
      ).length,
      uniqueUid: new Set(state.groups.map((g) => g.groupUid)).size,
      safeIds: state.groups.every((g) => Number.isSafeInteger(g.id)),
      normalized: state.groups.every(
        (g) =>
          Array.isArray(g.inventory) &&
          g.itemStats &&
          g.itemEffect !== undefined &&
          g.competitionEffects,
      ),
    };
  }, roster);
  assert.equal(imported.groups, 14);
  assert.equal(imported.total, 56);
  assert.equal(imported.missingUid, 0, "every imported group has a stable uid");
  assert.equal(imported.uniqueUid, 14, "uids are unique");
  assert.equal(imported.safeIds, true);
  assert.equal(imported.normalized, true, "imported groups carry persisted fields");

  // A global draw after import must commit: it emits ITEM_ACQUIRED events.
  const draw = await page.evaluate(async () => {
    const log = [];
    const toast = window.showToast;
    window.showToast = (t) => {
      log.push(String(t));
      return toast(t);
    };
    const shown = globalItemDraw();
    // The roulette runs 1.5s and holds the result ~0.9s before releasing.
    for (let i = 0; i < 120 && itemDrawBusy; i++)
      await new Promise((r) => setTimeout(r, 100));
    return {
      shown,
      log,
      busy: itemDrawBusy,
      awarded: state.groups.filter((g) => g.inventory.length === 1).length,
      unsaved: !!window.classroomUnsavedChanges,
    };
  });
  assert.equal(draw.shown, true);
  assert.deepEqual(draw.log, [], "no toast, so no rollback message");
  assert.equal(draw.busy, false, "the draw finishes");
  assert.equal(draw.awarded, 14, "every group receives one item");
  assert.equal(draw.unsaved, false);

  // The same groups must survive a reload with their uids intact.
  const before = await page.evaluate(() =>
    state.groups.map((g) => ({ uid: g.groupUid, name: g.name, n: g.members.length })),
  );
  await page.reload({ waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForFunction(() => window.classroomReady);
  const after = await page.evaluate(() =>
    state.groups.map((g) => ({ uid: g.groupUid, name: g.name, n: g.members.length })),
  );
  assert.deepEqual(after, before, "uids and rosters survive reload");

  // Also cover the dock batch import path, which edits groups in place.
  const dock = await page.evaluate(() => {
    const before = state.groups.map((g) => g.groupUid);
    document.getElementById("batchTextarea").value = state.groups
      .map((g) => `${g.name}: ${[...g.members, "新增同学"].join(", ")}`)
      .join("\n");
    applyBatchImport();
    const after = state.groups.map((g) => g.groupUid);
    return {
      kept: JSON.stringify(before) === JSON.stringify(after),
      sizes: [...new Set(state.groups.map((g) => g.members.length))],
    };
  });
  assert.equal(dock.kept, true, "the dock import keeps existing identities");
  assert.deepEqual(dock.sizes, [5]);

  await page.screenshot({ path: `${root}/after-import.png` });
  assert.deepEqual(errors, []);
  const results = [{ name: "roster-import-then-draw", imported, draw }];
  await writeFile(
    `${root}/results.json`,
    JSON.stringify({ status: "PASS", results }, null, 2),
  );
  console.log(JSON.stringify({ status: "PASS", results }, null, 2));
} finally {
  await browser.close();
  server.close();
}
