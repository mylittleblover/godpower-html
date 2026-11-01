import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";

/* The desktop bridge is stubbed with an in-memory file so the renderer side of
   the fixed save file can be exercised without Electron. */
const html = await readFile("dist/godpower.html");
const server = createServer((_, res) => res.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const errors = [];
const root = process.env.SAVE_FILE_ARTIFACT_DIR || "artifacts/save-file";
await mkdir(root, { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("dialog", (d) => d.accept());
  await page.addInitScript(() => {
    window.__save = { path: "C:\\GodPower\\saves\\classroom-save.json", data: null, writes: 0, exists: false };
    window.__chooseResult = null;
    const info = () => ({
      path: window.__save.path,
      directory: window.__save.path.replace(/[\\/][^\\/]+$/, ""),
      defaultPath: "C:\\GodPower\\saves\\classroom-save.json",
      isDefault: window.__save.path === "C:\\GodPower\\saves\\classroom-save.json",
      exists: window.__save.exists,
      bytes: window.__save.data ? JSON.stringify(window.__save.data).length : 0,
      modifiedAt: null,
    });
    window.godpowerDesktop = {
      role: "main",
      publish() {},
      reply() {},
      ready() {},
      openPicker() {},
      showScore() {},
      showItemFx() {},
      onExecute() {},
      onShellState() {},
      onUnlockRequest() {},
      saveFileInfo: async () => info(),
      saveFileRead: async () =>
        window.__save.data
          ? { ok: true, present: true, data: window.__save.data, bytes: info().bytes, sha256: "x" }
          : { ok: true, present: false, data: null },
      saveFileWrite: async (payload) => {
        window.__save.data = payload;
        window.__save.exists = true;
        window.__save.writes++;
        return { ok: true, bytes: info().bytes, info: info() };
      },
      saveFileChoose: async () =>
        window.__chooseResult || { ok: false, canceled: true },
      saveFileSet: async (value) => {
        if (!/^[A-Za-z]:[\\/]/.test(value))
          return { ok: false, error: "INVALID_PATH" };
        if (!/\.json$/i.test(value)) return { ok: false, error: "INVALID_EXTENSION" };
        window.__save.path = value;
        return { ok: true, info: info() };
      },
      saveFileReset: async () => {
        window.__save.path = "C:\\GodPower\\saves\\classroom-save.json";
        return { ok: true, info: info() };
      },
    };
  });
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(page, 4);

  // Every classroom change mirrors the envelope to the file.
  const mirrored = await page.evaluate(async () => {
    state.groups[0].score = 42;
    saveState();
    await new Promise((r) => setTimeout(r, 250));
    return {
      writes: window.__save.writes,
      groups: window.__save.data?.groups?.length ?? 0,
      score: window.__save.data?.groups?.[0]?.score,
      schema: window.__save.data?.schemaVersion,
      hasUid: typeof window.__save.data?.groups?.[0]?.groupUid === "string",
    };
  });
  assert.ok(mirrored.writes >= 1, "a classroom change writes the file");
  assert.equal(mirrored.groups, 4);
  assert.equal(mirrored.score, 42);
  assert.ok(mirrored.schema >= 1, "the file stores the same envelope");
  assert.equal(mirrored.hasUid, true, "identities are persisted");

  // The settings panel reflects the live path and can change it.
  const panel = await page.evaluate(async () => {
    const shown = document.getElementById("saveFilePath");
    const before = shown.textContent;
    document.getElementById("saveFilePathInput").value =
      "D:\\课堂存档\\七年级.json";
    await applySaveFileLocation();
    return {
      before,
      after: document.getElementById("saveFilePath").textContent,
      status: document.getElementById("saveFileStatus").dataset.status,
    };
  });
  assert.match(panel.before, /classroom-save\.json$/);
  assert.equal(panel.after, "D:\\课堂存档\\七年级.json");
  assert.equal(panel.status, "OK");

  const rejected = await page.evaluate(async () => {
    document.getElementById("saveFilePathInput").value = "relative.json";
    await applySaveFileLocation();
    return {
      status: document.getElementById("saveFileStatus").dataset.status,
      text: document.getElementById("saveFileStatus").textContent,
      path: document.getElementById("saveFilePath").textContent,
    };
  });
  assert.equal(rejected.status, "ERROR", "relative paths are refused");
  assert.match(rejected.text, /INVALID_PATH/);
  assert.equal(rejected.path, "D:\\课堂存档\\七年级.json", "the path is unchanged");

  // Reloading from the file replaces the classroom.
  const reloaded = await page.evaluate(async () => {
    window.__save.data = JSON.parse(JSON.stringify(buildClassroomBackup()));
    window.__save.data.groups[1].score = 777;
    window.__save.exists = true;
    const before = state.groups[1].score;
    // The panel confirms through the in-page dialog; answer it as a user would.
    const pending = loadFromSaveFile();
    for (let i = 0; i < 60; i++) {
      const ok = document.getElementById("pcOkV28");
      if (ok) {
        ok.click();
        break;
      }
      await new Promise((r) => setTimeout(r, 50));
    }
    await pending;
    return {
      before,
      after: state.groups[1].score,
      status: document.getElementById("saveFileStatus").dataset.status,
    };
  });
  assert.notEqual(reloaded.before, 777);
  assert.equal(reloaded.after, 777, "the file value is applied");
  assert.equal(reloaded.status, "OK");

  await page.screenshot({ path: `${root}/save-file-settings.png` });
  assert.deepEqual(errors, []);
  const results = [{ name: "save-file", mirrored, panel, rejected, reloaded }];
  await writeFile(
    `${root}/results.json`,
    JSON.stringify({ status: "PASS", results }, null, 2),
  );
  console.log(JSON.stringify({ status: "PASS", results }, null, 2));
} finally {
  await browser.close();
  server.close();
}
