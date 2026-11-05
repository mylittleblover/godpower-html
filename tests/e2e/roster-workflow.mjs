import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html"),
  server = createServer((_, r) => r.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.evaluate(() => SaveManager.ready());
  await setup(page, 14);
  const geometry = () =>
    page.locator("#groupList>.group-row-card").evaluateAll((nodes) =>
      nodes.map((n) => {
        const r = n.getBoundingClientRect();
        return [r.x, r.y, r.width, r.height];
      }),
    );
  await page.evaluate(async () => {
    await saveState();
    await SaveManager.whenIdle();
    cancelScoreAnimationAndSync();
  });
  await page.mouse.move(0, 0);
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((a) => a.effect?.getTiming().iterations !== Infinity)
        .map((a) => a.finished.catch(() => {})),
    ),
  );
  const baseline = await geometry();
  await page.evaluate(() => {
    switchView("settings");
    DesktopUI.selectSettings("students");
  });
  await mkdir("artifacts/roster-workflow", { recursive: true });
  await page.screenshot({ path: "artifacts/roster-workflow/workspace.png" });
  assert.equal(
    await page
      .locator('[data-category-panel="students"]')
      .evaluate((panel) =>
        panel.firstElementChild.classList.contains("ui-settings-title"),
      ),
    true,
    "roster category must retain the same heading placement as every settings page",
  );
  assert.equal(
    await page.locator(".save-roster-section.ui-settings-group").count(),
    2,
    "roster panels must use the existing settings group component",
  );
  assert.equal(
    await page.locator("#saveGroupForm").count(),
    1,
    "settings must allow creating groups directly",
  );
  assert.equal(
    await page.locator("#saveStudentGroup").count(),
    1,
    "adding a student should allow direct assignment",
  );
  const original = await page.evaluate(() => ({
    groups: state.groups.map((g) => ({
      id: g.id,
      score: g.score,
      inventory: g.inventory,
    })),
    groupUid: SaveManager.rosterView().roster.groups[0].groupUid,
  }));
  await page.locator("#saveStudentNumber").fill("99");
  await page.locator("#saveStudentName").fill("新增测试学员");
  await page.locator("#saveStudentGroup").selectOption(original.groupUid);
  const studentPending = await page.evaluate(() => {
    const form = document.getElementById("saveStudentForm");
    form.requestSubmit();
    document.querySelector("[data-edit-student]").click();
    return {
      locked: [...form.querySelectorAll("input,select,button")].every(
        (e) => e.disabled,
      ),
      name: document.getElementById("saveStudentName").value,
    };
  });
  assert.deepEqual(
    studentPending,
    { locked: true, name: "新增测试学员" },
    "pending student ACK must prevent another edit from replacing its form",
  );
  await page.waitForFunction(() =>
    SaveManager.rosterView().roster.students.some(
      (s) => s.number === "99" && s.displayName === "新增测试学员",
    ),
  );
  await page.evaluate(() => SaveManager.whenIdle());
  const assigned = await page.evaluate(() => {
    const r = SaveManager.rosterView().roster,
      s = r.students.find((s) => s.number === "99");
    return r.assignments.find((a) => a.studentUid === s.studentUid).groupUid;
  });
  assert.equal(assigned, original.groupUid);
  await page.locator("[data-student-search]").fill("新增测试学员");
  assert.equal(
    await page.locator("#saveWorkspaceStudentRows tr:visible").count(),
    1,
  );
  assert.equal(
    await page
      .locator("[data-student-search]")
      .evaluate((e) => document.activeElement === e),
    true,
    "filtering keeps keyboard focus",
  );
  await page
    .locator("[data-edit-student]")
    .filter({ visible: true })
    .first()
    .click();
  await page.locator("#saveStudentName").fill("取消的改名");
  const revision = await page.evaluate(() => SaveManager.snapshot().revision);
  await page.locator("[data-student-cancel]").click();
  assert.equal(
    await page.evaluate(() => SaveManager.snapshot().revision),
    revision,
  );
  assert.equal(await page.locator("#saveStudentName").inputValue(), "");
  await page.evaluate(() => switchView("battle"));
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((a) => a.effect?.getTiming().iterations !== Infinity)
        .map((a) => a.finished.catch(() => {})),
    ),
  );
  assert.deepEqual(
    await geometry(),
    baseline,
    "roster UI CSS cannot change 14-group geometry",
  );
  await page.evaluate(() => {
    switchView("settings");
    DesktopUI.selectSettings("students");
  });
  await page.locator("#saveGroupName").fill("设置新建小组");
  await page.locator("#saveGroupColor").fill("#ffcc88");
  await page.evaluate(() => {
    window.__rosterOriginalPut = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (...args) {
      if (this.name === "documents")
        throw new DOMException("roster test quota", "QuotaExceededError");
      return window.__rosterOriginalPut.apply(this, args);
    };
  });
  try {
    await page.locator("#saveGroupAdd").click();
    await page.waitForFunction(() =>
      document
        .querySelector("[data-save-message]")
        .textContent.includes("roster test quota"),
    );
    assert.equal(
      await page.locator("#saveGroupName").inputValue(),
      "设置新建小组",
      "failed save must keep input",
    );
    assert.equal(
      await page.evaluate(() => state.groups.length),
      14,
      "failed group save must roll back",
    );
  } finally {
    await page.evaluate(() => {
      IDBObjectStore.prototype.put = window.__rosterOriginalPut;
      delete window.__rosterOriginalPut;
    });
  }
  const groupPending = await page.evaluate(() => {
    const form = document.getElementById("saveGroupForm");
    form.requestSubmit();
    document.querySelector("[data-edit-group]").click();
    return {
      locked: [...form.querySelectorAll("input,select,button")].every(
        (e) => e.disabled,
      ),
      name: document.getElementById("saveGroupName").value,
    };
  });
  assert.deepEqual(
    groupPending,
    { locked: true, name: "设置新建小组" },
    "pending group ACK must prevent another edit from replacing its form",
  );
  await page.waitForFunction(() =>
    state.groups.some((g) => g.name === "设置新建小组"),
  );
  await page.evaluate(() => SaveManager.whenIdle());
  await page.locator("[data-group-search]").fill("设置新建小组");
  assert.equal(
    await page.locator("[data-save-groups] .save-group-row:visible").count(),
    1,
  );
  await page
    .locator("[data-save-groups] .save-group-row:visible [data-edit-group]")
    .click();
  await page.locator("#saveGroupName").fill("新小组改名");
  await page.locator("#saveGroupAdd").click();
  await page.waitForFunction(() =>
    state.groups.some((g) => g.name === "新小组改名"),
  );
  await page.evaluate(() => SaveManager.whenIdle());
  assert.deepEqual(
    await page.evaluate(() =>
      state.groups
        .slice(0, 14)
        .map((g) => ({ id: g.id, score: g.score, inventory: g.inventory })),
    ),
    original.groups,
  );
  await page.reload();
  await page.evaluate(() => SaveManager.ready());
  assert.equal(
    await page.evaluate(() =>
      state.groups.some(
        (g) => g.name === "新小组改名" && g.color === "#ffcc88",
      ),
    ),
    true,
  );
  await page.evaluate(() => {
    switchView("settings");
    DesktopUI.selectSettings("students");
  });
  await page.locator("[data-save-groups] [data-members]").first().click();
  await page.locator("#saveStudentName").fill("旧档未提交姓名");
  const switched = await page.evaluate(() => {
    state.isLocked = false;
    return SaveManager.create({ name: "隔离新档" });
  });
  assert.equal(switched.ok, true);
  await page.waitForFunction(
    () => document.getElementById("saveStudentName").value === "",
  );
  assert.equal(
    await page.locator("[data-member-editor]").evaluate((e) => e.hidden),
    true,
  );
  const nextRoster = await page.evaluate(() =>
    JSON.stringify(SaveManager.rosterView().roster),
  );
  await page.locator("[data-member-save]").evaluate((e) => e.click());
  await page.waitForFunction(() =>
    document
      .querySelector("[data-save-message]")
      .textContent.includes("存档已切换"),
  );
  assert.equal(
    await page.evaluate(() => JSON.stringify(SaveManager.rosterView().roster)),
    nextRoster,
    "stale member editor cannot write into a different save",
  );
  assert.deepEqual(errors, []);
  await writeFile(
    "artifacts/roster-workflow/result.json",
    JSON.stringify(
      {
        status: "PASS",
        viewport: [1920, 1080],
        groups: 15,
        assignment: assigned,
        geometryUnchanged: true,
        failedSaveRetainsInput: true,
        pendingStudentAndGroupFormsProtected: true,
        staleMemberFormRejected: true,
        errors,
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS direct student assignment, group create/edit, search/focus, cancel, reload and 14-group geometry",
  );
} finally {
  await browser.close();
  server.close();
}
