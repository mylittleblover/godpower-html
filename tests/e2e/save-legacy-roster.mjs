import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { legacyRoster } from "../fixtures/legacy-roster.mjs";
import { launch, dismissStartup } from "../fixtures/browser.mjs";
await mkdir("artifacts/save-legacy-roster", { recursive: true });
const html = await readFile("dist/godpower.html"),
  server = createServer((_, r) => {
    r.setHeader("content-type", "text/html;charset=utf-8");
    r.end(html);
  });
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
try {
  const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
    }),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const raw = JSON.stringify(legacyRoster());
  await page.addInitScript((raw) => {
    if (!localStorage.getItem("godpower_classroom_roster_v1"))
      localStorage.setItem("godpower_classroom_roster_v1", raw);
  }, raw);
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  await page.evaluate(() => SaveManager.ready());
  await dismissStartup(page);
  const migrated = await page.evaluate(async (raw) => {
    const list = await SaveManager.repository().list(),
      old = list.index.entries.filter(
        (e) => e.saveId !== list.index.activeSaveId,
      ),
      digest = await SaveMigration.textDigest(raw),
      source = await SaveManager.repository().getSource(digest);
    return {
      entries: list.index.entries.length,
      old: old.map((e) => e.saveId),
      rawUnchanged:
        localStorage.getItem("godpower_classroom_roster_v1") === raw,
      sourceUnchanged: source?.raw ? (await source.raw.text()) === raw : false,
      notice: SaveManager.status().legacyRosterMessage,
    };
  }, raw);
  console.log(JSON.stringify(migrated));
  assert.equal(migrated.entries, 4);
  assert.equal(migrated.old.length, 3);
  assert.equal(migrated.rawUnchanged, true);
  assert.equal(migrated.sourceUnchanged, true);
  const switched = await page.evaluate(async (id) => {
    state.isLocked = false;
    return SaveManager.switchTo(id);
  }, migrated.old[0]);
  assert.equal(switched.ok, true);
  await page.evaluate(() => {
    switchView("settings");
    DesktopUI.selectSettings("students");
  });
  assert.equal(await page.locator("#saveWorkspaceStudentRows tr").count(), 2);
  await page.locator("[data-members]").first().click();
  assert.equal(
    await page.locator("[data-member-options] input:checked").count(),
    1,
  );
  await page.locator("[data-member-search]").fill("02");
  assert.equal(
    await page.locator("[data-member-options] label:visible").count(),
    1,
    "member search must visually hide unmatched students",
  );
  await page.locator("[data-member-options] label:visible input").check();
  await page.locator("[data-member-search]").fill("");
  assert.equal(
    await page.locator("[data-member-options] input:checked").count(),
    2,
    "search preserves selections",
  );
  await page.locator("[data-member-save]").click();
  await page.evaluate(() => classroomCommands.whenIdle());
  assert.equal(
    await page.evaluate(() => SaveManager.snapshot().roster.assignments.length),
    2,
  );
  const deniedTrash = await page.evaluate(async () => {
    const doc = SaveManager.snapshot(),
      context = SaveManager.context();
    return SaveManager.setTrashed(doc.saveId, true, {
      context,
      revision: doc.revision,
    });
  });
  assert.equal(deniedTrash.code, "ACTIVE_SAVE");
  await page.locator("#saveWorkspace details summary").click();
  await page.locator("[data-save-inactive]").selectOption(migrated.old[1]);
  await page.locator("[data-save-trash]").click();
  await page.locator("#themeDialogActionsV21727 .danger").click();
  await page.waitForFunction(
    async () =>
      (await SaveManager.repository().list()).index.trashedEntries?.length ===
      1,
  );
  assert.equal(
    await page.evaluate(
      async (id) => (await SaveManager.repository().load(id)).ok,
      migrated.old[1],
    ),
    false,
  );
  const abortedRestore = await page.evaluate(async (id) => {
    const original = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (...args) {
      const req = original.apply(this, args);
      if (this.name === "meta") this.transaction.abort();
      return req;
    };
    let failed;
    try {
      failed = await SaveManager.repository().setTrashed(id, false, {
        expectedGeneration: SaveManager.context().generation,
        expectedRevision: 1,
      });
    } finally {
      IDBObjectStore.prototype.put = original;
    }
    return {
      ok: failed.ok,
      count: (await SaveManager.repository().list()).index.trashedEntries
        .length,
    };
  }, migrated.old[1]);
  assert.deepEqual(abortedRestore, { ok: false, count: 1 });
  await page.locator("[data-save-trash-list]").selectOption(migrated.old[1]);
  await page.locator("[data-save-restore]").click();
  await page.waitForFunction(
    async () =>
      (await SaveManager.repository().list()).index.trashedEntries?.length ===
      0,
  );
  assert.equal(
    await page.evaluate(
      async (id) => (await SaveManager.repository().load(id)).ok,
      migrated.old[1],
    ),
    true,
  );
  await page
    .locator("#saveWorkspace")
    .screenshot({ path: "artifacts/save-legacy-roster/current-roster.png" });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.evaluate(() => SaveManager.ready());
  assert.equal(
    await page.evaluate(
      async () => (await SaveManager.repository().list()).index.entries.length,
    ),
    4,
    "startup retry must not duplicate migrated saves",
  );
  assert.equal(
    await page.evaluate(() => SaveManager.snapshot().roster.assignments.length),
    2,
  );
  assert.deepEqual(errors, []);
  await writeFile(
    "artifacts/save-legacy-roster/result.json",
    JSON.stringify(
      { status: "PASS", migrated, trashRestore: "PASS", errors },
      null,
      2,
    ),
  );
  console.log(
    "PASS legacy profile/class migration preserves original bytes, stable identities, idempotency and searchable member selections",
  );
} finally {
  await browser.close();
  server.close();
}
