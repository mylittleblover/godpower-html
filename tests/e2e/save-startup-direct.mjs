import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
const original = await readFile("dist/godpower.html", "utf8");
// Observe legacy entry points without replacing their behavior.
const instrumented = original
  .replace(
    "const ClassroomRepository = (() => {",
    "window.legacyStartupReads=0; const ClassroomRepository = (() => {",
  )
  .replace(
    "function loadOrMigrate(storage, options) {",
    "function loadOrMigrate(storage, options) { window.legacyStartupReads++;",
  );
const server = createServer((q, r) => r.end(instrumented));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const b = await launch();
try {
  const page = await b.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));

  await page.addInitScript(() => {
    let manager;
    window.startupSaveStacks = [];
    Object.defineProperty(window, "SaveManager", {
      configurable: true,
      get: () => manager,
      set: (value) => {
        manager = {
          ...value,
          persist: (...args) => {
            startupSaveStacks.push(new Error().stack);

            return value.persist(...args);
          },
        };
      },
    });
  });
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.evaluate(() => SaveManager.ready());
  await setup(page, 14);
  await page.evaluate(async () => {
    await saveState();
    await SaveManager.whenIdle();
  });
  const before = await page.evaluate(async () => ({
    doc: SaveManager.snapshot(),
    index: (await SaveManager.repository().list()).index,
  }));
  await page.evaluate(() => {
    localStorage.setItem("godpower_state_v2", '{"broken old mirror":true}');
    localStorage.setItem("godpower_classroom_roster_v1", '{"broken":true}');
  });
  for (let i = 0; i < 2; i++) {
    await page.reload();
    const result = await page.evaluate(() => SaveManager.ready());
    await page.waitForTimeout(550);
    await page.evaluate(() => SaveManager.whenIdle());
    assert.equal(
      result.ok,
      true,
      "valid canonical library must not depend on old mirrors",
    );
    assert.equal(
      await page.evaluate(() => window.legacyStartupReads),
      0,
      "new saves must bypass legacy startup conversion",
    );
    const after = await page.evaluate(async () => ({
      doc: SaveManager.snapshot(),
      index: (await SaveManager.repository().list()).index,
    }));

    assert.deepEqual(
      after,
      before,
      "opening a new-format save must not rewrite revisions, roster identities or import receipts",
    );
  }
  assert.deepEqual(errors, []);
  await page.evaluate(() => {
    switchView("settings");
    DesktopUI.selectSettings("students");
  });
  await mkdir("artifacts/save-startup-direct", { recursive: true });
  await page.screenshot({ path: "artifacts/save-startup-direct/reopened.png" });
  await writeFile(
    "artifacts/save-startup-direct/result.json",
    JSON.stringify(
      { status: "PASS", reloads: 2, legacyReads: 0, unchanged: true, errors },
      null,
      2,
    ),
  );
  console.log(
    "PASS canonical saves reopen twice without legacy reads or rewriting the library",
  );
} finally {
  await b.close();
  server.close();
}
