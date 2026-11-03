import assert from "node:assert/strict";
import { legacy } from "../fixtures/save-v2.mjs";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, dismissStartup } from "../fixtures/browser.mjs";
await mkdir("artifacts/save-workspace", { recursive: true });
const html = await readFile("dist/godpower.html");
const server = createServer((_, r) => {
  r.setHeader("Content-Type", "text/html;charset=utf-8");
  r.end(html);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const errors = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  assert.equal(
    await page.evaluate(() => typeof SaveManager),
    "object",
    "save manager must be installed",
  );
  await page.evaluate(() => SaveManager.ready());
  await dismissStartup(page);
  await page.evaluate(() => {
    state.isLocked = false;
    switchView("settings");
    DesktopUI.selectSettings("students");
  });
  await page.locator("#saveWorkspace").waitFor({ state: "visible" });
  assert.equal(
    await page.locator("#saveWorkspaceStudentRows tr").count(),
    await page.evaluate(() => SaveManager.snapshot().roster.students.length),
  );
  await page.locator("#saveStudentName").fill("测试同学");
  await page.locator("#saveStudentNumber").fill("57");
  await page.locator("#saveStudentAdd").click();
  await page.waitForFunction(() =>
    SaveManager.snapshot().roster.students.some(
      (s) => s.displayName === "测试同学",
    ),
  );
  await page
    .locator("#saveWorkspace")
    .screenshot({ path: "artifacts/save-workspace/settings.png" });
  await page.locator('[data-avatar-type="student"]').first().click();
  await page.locator("[data-avatar-file]").setInputFiles({
    name: "avatar.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
      "base64",
    ),
  });
  await page.waitForFunction(
    () => !!SaveManager.snapshot().roster.students[0].avatarResourceId,
  );
  await page.evaluate(() => classroomCommands.whenIdle());
  await page.evaluate(async () => {
    const snapshot = SaveManager.snapshot();
    return SaveManager.edit("第二位同学头像", (doc) =>
      SaveRoster.setAvatar(
        doc,
        "student",
        doc.roster.students[1].studentUid,
        snapshot.roster.students[0].avatarResourceId,
      ),
    );
  });
  await page.locator('[data-avatar-type="group"]').first().click();
  await page.locator("[data-avatar-file]").setInputFiles({
    name: "group.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
      "base64",
    ),
  });
  await page.waitForFunction(
    () => !!SaveManager.snapshot().roster.groups[0].avatarResourceId,
  );
  await page.evaluate(() => classroomCommands.whenIdle());
  const avatarAdapter = await page.evaluate(async () => {
    await ClassroomAvatarDisplay.prepare(state.groups);
    const group = state.groups[0];
    return {
      student: ClassroomAvatarDisplay.studentDataUrl(
        group,
        group.members[0],
        0,
      ).startsWith("data:image/webp"),
      secondStudent: ClassroomAvatarDisplay.studentDataUrl(
        group,
        group.members[1],
        1,
      ).startsWith("data:image/webp"),
      group:
        ClassroomAvatarDisplay.groupDataUrlCached(group).startsWith(
          "data:image/webp",
        ),
    };
  });
  assert.deepEqual(avatarAdapter, {
    student: true,
    secondStudent: true,
    group: true,
  });
  const exported = await page.evaluate(() => SaveManager.exportCurrent());
  assert.equal(exported.kind, "godpower.save-bundle");
  assert.equal(exported.assets.length, 1);
  assert.equal(
    exported.documents[0].roster.students[0].avatarResourceId,
    exported.documents[0].roster.groups[0].avatarResourceId,
  );
  const result = await page.evaluate(async () => {
    const before = SaveManager.snapshot();
    await classroomCommands.whenIdle();
    const db = await SaveManager.repository().load(before.saveId);
    return {
      saveId: before.saveId,
      students: db.document.roster.students.length,
      added: db.document.roster.students.some(
        (s) => s.displayName === "测试同学",
      ),
      phase: SaveManager.status().phase,
    };
  });
  assert.equal(result.added, true);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.evaluate(() => SaveManager.ready());
  assert.equal(
    await page.evaluate(() =>
      SaveManager.snapshot().roster.students.some(
        (s) => s.displayName === "测试同学",
      ),
    ),
    true,
  );
  const pendingPreference = await page.evaluate(async () => {
    const accepted = runClassroomCommand(
      "设置与保存并发回归",
      () => {
        state.groups[0].score += 1;
        return true;
      },
      { source: "manual" },
    );
    state.masterVolume = 0.37;
    const deferred = saveState();
    await classroomCommands.whenIdle();
    await SaveManager.whenIdle();
    const saved = await SaveManager.repository().loadPreferences();
    return {
      accepted,
      deferred: deferred.deferred,
      volume: saved.preferences.values.masterVolume,
    };
  });
  assert.deepEqual(pendingPreference, {
    accepted: true,
    deferred: true,
    volume: 0.37,
  });
  const raw = legacy();
  raw.groups = Array.from({ length: 14 }, (_, i) => ({
    ...structuredClone(raw.groups[0]),
    id: i + 1,
    groupUid: "group-ui-" + i,
    groupNo: i + 1,
    name: "测试小组" + (i + 1),
    score: 100 + i,
    inventory: [],
    members: Array.from(
      { length: 4 },
      (_, j) =>
        String(i * 4 + j + 1).padStart(2, "0") + " 同学" + (i * 4 + j + 1),
    ),
  }));
  const imported = await page.evaluate(async (raw) => {
    state.isLocked = false;
    return SaveManager.importSource(
      await SaveManager.previewSource(JSON.stringify(raw), "14组回归"),
    );
  }, raw);
  assert.equal(imported.ok, true);
  await page.evaluate(() => {
    state.columnMode = "double";
    state.resizerEnabled = true;
    state.resizerHeight = 120;
    state.zoomLevel = 1;
    document.body.style.zoom = 1;
    switchView("battle");
    renderAll();
  });
  const fit = await page.evaluate(() => {
    const cards = [
      ...document.querySelectorAll("#groupList>.group-row-card"),
    ].map((e) => {
      const r = e.getBoundingClientRect();
      return {
        x: r.x,
        y: r.y,
        width: r.width,
        height: r.height,
        bottom: r.bottom,
      };
    });
    const dock = document.querySelector(".bottom-dock").getBoundingClientRect();
    return { cards, dockTop: dock.top };
  });
  assert.equal(fit.cards.length, 14);
  assert.ok(
    fit.cards.every((c) => c.bottom <= fit.dockTop),
    "14 groups must remain above the dock",
  );
  await writeFile(
    "artifacts/save-workspace/battle14-dom.json",
    JSON.stringify(fit, null, 2),
  );
  await page.screenshot({ path: "artifacts/save-workspace/battle14.png" });
  for (let id = 1; id <= 14; id++) {
    await page
      .locator(`.group-row-card[data-group-id="${id}"] .opt-btn`)
      .first()
      .click();
    await page.evaluate(() => classroomCommands.whenIdle());
  }
  await page.evaluate(() => judgeRound());
  const judged = await page.evaluate(() => classroomCommands.whenIdle());
  assert.equal(judged.persisted, true);
  assert.equal(await page.evaluate(() => state.groups[0].score), 102);
  const conflictCopy = await page.evaluate(async () => {
    const original = SaveManager.snapshot(),
      bundle = await SaveManager.exportCurrent();
    const result = await SaveManager.importSource(
      await SaveManager.previewSource(JSON.stringify(bundle), "导入已有课堂"),
    );
    const copy = SaveManager.snapshot();
    return {
      ok: result.ok,
      separate: copy.saveId !== original.saveId,
      sameScore: copy.match.groups[0].score === original.match.groups[0].score,
      originalPresent: (await SaveManager.repository().load(original.saveId))
        .ok,
    };
  });
  assert.deepEqual(conflictCopy, {
    ok: true,
    separate: true,
    sameScore: true,
    originalPresent: true,
  });
  const archiveFailure = await page.evaluate(async () => {
    const before = state.groups.map((g) => g.score),
      original = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (...args) {
      const req = original.apply(this, args);
      if (this.name === "documents") this.transaction.abort();
      return req;
    };
    let failed;
    try {
      failed = await confirmFinalSettlement();
    } finally {
      IDBObjectStore.prototype.put = original;
    }
    closeThemeDialogV21727();
    return {
      ok: failed.ok,
      before,
      after: state.groups.map((g) => g.score),
      archives: SaveManager.snapshot().archives.length,
    };
  });
  assert.equal(archiveFailure.ok, false);
  assert.deepEqual(archiveFailure.before, archiveFailure.after);
  assert.equal(archiveFailure.archives, 0);
  const resetFailure = await page.evaluate(async () => {
    const before = state.groups.map((g) => g.score),
      original = IDBObjectStore.prototype.put;
    let writes = 0;
    IDBObjectStore.prototype.put = function (...args) {
      const req = original.apply(this, args);
      if (this.name === "documents" && ++writes === 2) this.transaction.abort();
      return req;
    };
    let failed;
    try {
      failed = await confirmFinalSettlement();
    } finally {
      IDBObjectStore.prototype.put = original;
    }
    closeThemeDialogV21727();
    closeGrandSettlementModal();
    const attempted = runClassroomCommand("已归档赛季不得继续计分", () => {
      state.groups[0].score += 99;
      return true;
    });
    await classroomCommands.whenIdle();
    return {
      ok: failed.ok,
      attempted,
      before,
      after: state.groups.map((g) => g.score),
      archives: SaveManager.snapshot().archives.length,
    };
  });
  assert.equal(resetFailure.ok, false);
  assert.equal(resetFailure.archives, 1);
  assert.equal(
    resetFailure.attempted,
    false,
    "archive succeeded but reset failed: freeze that season until initialization resumes",
  );
  assert.deepEqual(resetFailure.after, resetFailure.before);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.evaluate(() => SaveManager.ready());
  await dismissStartup(page);
  assert.equal(
    await page.evaluate(() => SaveManager.pendingSettlement()),
    true,
  );
  const completed = await page.evaluate(() => {
    state.isLocked = false;
    return resumeFinalSettlement();
  });
  assert.equal(completed.ok, true);
  const archive = await page.evaluate(() => SaveManager.snapshot());
  assert.equal(archive.archives.length, 1);
  assert.ok(archive.match.groups.every((g) => g.score === 0));
  await page.evaluate(() => closeGrandSettlementModal());
  const managing = await page.evaluate(async () => {
    const original = SaveManager.snapshot().saveId;
    const copied = await SaveManager.create({ name: "复制课堂", copy: true });
    if (!copied.ok) return copied;
    const copy = SaveManager.snapshot();
    const renamed = await SaveManager.rename("新的课堂名称");
    const fresh = await SaveManager.create({ name: "空白课堂" });
    const blank = SaveManager.snapshot();
    const back = await SaveManager.switchTo(original);
    return {
      copied: copied.ok,
      separate: copy.saveId !== original,
      renamed: renamed.ok,
      fresh: fresh.ok,
      blankStudents: blank.roster.students.length,
      blankGroups: blank.roster.groups.length,
      back: back.ok,
      archives: SaveManager.snapshot().archives.length,
    };
  });
  assert.deepEqual(managing, {
    copied: true,
    separate: true,
    renamed: true,
    fresh: true,
    blankStudents: 0,
    blankGroups: 1,
    back: true,
    archives: 1,
  });
  const originalIndex = await page.evaluate(async () => {
    const list = await SaveManager.repository().list();
    return list.index;
  });
  await page.evaluate(
    () =>
      new Promise((resolve, reject) => {
        const open = indexedDB.open("godpower_save_library_v2");
        open.onsuccess = () => {
          const db = open.result,
            tx = db.transaction("meta", "readwrite");
          tx.objectStore("meta").put({ kind: "broken-index" }, "index");
          tx.oncomplete = () => {
            db.close();
            resolve();
          };
          tx.onabort = () => reject(tx.error);
        };
      }),
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  const blocked = await page.evaluate(async () => {
    const ready = await SaveManager.ready();
    const before = localStorage.getItem(Reliability.stateKey),
      score = state.groups[0].score;
    const accepted = runClassroomCommand("不可回退写入", () => {
      state.groups[0].score += 1000;
      return true;
    });
    const save = saveState();
    return {
      ok: ready.ok,
      blocked: SaveManager.blocked(),
      accepted,
      save: save.ok,
      unchanged:
        before === localStorage.getItem(Reliability.stateKey) &&
        state.groups[0].score === score,
    };
  });
  assert.deepEqual(blocked, {
    ok: false,
    blocked: true,
    accepted: false,
    save: false,
    unchanged: true,
  });
  await page.evaluate(
    (index) =>
      new Promise((resolve, reject) => {
        const open = indexedDB.open("godpower_save_library_v2");
        open.onsuccess = () => {
          const db = open.result,
            tx = db.transaction("meta", "readwrite");
          tx.objectStore("meta").put(index, "index");
          tx.oncomplete = () => {
            db.close();
            resolve();
          };
          tx.onabort = () => reject(tx.error);
        };
      }),
    originalIndex,
  );
  const retry = await page.evaluate(() => SaveManager.retry());
  assert.equal(retry.ok, true);
  assert.equal(
    await page.evaluate(() => SaveManager.snapshot().archives.length),
    1,
  );
  assert.deepEqual(errors, []);
  await writeFile(
    "artifacts/save-workspace/result.json",
    JSON.stringify({ status: "PASS", result, errors }, null, 2),
  );
  console.log(
    "PASS current save roster settings, student add, durable ACK and reload",
  );
} finally {
  await browser.close();
  server.close();
}
