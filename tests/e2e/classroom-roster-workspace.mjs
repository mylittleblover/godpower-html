import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdir, readFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";

const html = await readFile("dist/godpower.html");
const server = createServer((_, response) => {
  response.setHeader("Content-Type", "text/html;charset=utf-8");
  response.end(html);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const browser = await launch("chromium");
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  acceptDownloads: true,
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));

try {
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await setup(page, 14);
  await page.evaluate(() => {
    localStorage.removeItem("godpower_classroom_roster_v1");
    switchView("settings");
    DesktopUI.selectSettings("students");
  });

  const workspace = page.locator("#classroomRosterWorkspace");
  await workspace.waitFor({ state: "visible" });
  assert.match(await workspace.innerText(), /名单工作区/);
  assert.match(await workspace.innerText(), /不会修改当前比赛/);
  assert.equal(await page.locator("#rosterClassroomForm").isVisible(), false);
  assert.equal(await page.locator("#rosterProfileForm").isVisible(), false);
  assert.equal(
    await page.locator("#uiSettingsRoster").evaluate((e) => e.open),
    false,
  );
  await mkdir("artifacts/f1-roster-workspace", { recursive: true });
  const geometry = await workspace.evaluate((element) => ({
    width: element.getBoundingClientRect().width,
    right: element.getBoundingClientRect().right,
    viewport: innerWidth,
    scrollWidth: element.scrollWidth,
    clientWidth: element.clientWidth,
  }));
  assert.ok(geometry.right <= geometry.viewport + 1, JSON.stringify(geometry));
  assert.ok(
    geometry.scrollWidth <= geometry.clientWidth + 1,
    JSON.stringify(geometry),
  );
  await page.screenshot({
    path: "artifacts/f1-roster-workspace/1920x1080.png",
  });

  const liveBefore = await page.evaluate(() =>
    JSON.stringify({ groups: state.groups, roundActive: state.roundActive }),
  );
  await page.locator("#rosterCreateFromLive").click();
  await page.locator("#rosterProfileSelect").waitFor();
  assert.equal(await page.locator("#rosterStudentRows tr").count(), 28);

  await page.locator(".roster-student-name").first().fill("工作区测试姓名");
  await page
    .locator(".roster-student-group")
    .first()
    .selectOption({ index: 1 });
  await page.locator("#rosterSave").click();
  await page.getByText("名单已保存", { exact: false }).waitFor();

  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("godpower_classroom_roster_v1")),
  );
  assert.equal(saved.rosterData.students[0].displayName, "工作区测试姓名");
  assert.equal(saved.rosterData.assignments[0].groupAssignments.length, 28);

  const avatarBytes = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/6Y8AAAAASUVORK5CYII=",
    "base64",
  );
  await page.locator(".roster-avatar-upload").first().setInputFiles({
    name: "student-avatar.png",
    mimeType: "image/png",
    buffer: avatarBytes,
  });
  await page.getByText("头像已保存", { exact: false }).waitFor();
  const avatarState = await page.evaluate(async () => {
    const current = JSON.parse(
      localStorage.getItem("godpower_classroom_roster_v1"),
    );
    const student = current.rosterData.students[0];
    const resources = await TeachingResourceRepository.open();
    const resource = await resources.get(student.avatarResourceId);
    return {
      resourceId: student.avatarResourceId,
      valid: resource?.subjectId === "student-avatar" && resource.blob.size > 0,
      count: (await resources.list({ subjectId: "student-avatar" })).length,
    };
  });
  assert.ok(avatarState.resourceId);
  assert.equal(avatarState.valid, true);
  assert.equal(avatarState.count, 1);

  // If the roster link cannot commit, remove only the newly uploaded orphan blob.
  await page.evaluate(() => {
    window.__rosterSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === "godpower_classroom_roster_v1")
        throw new DOMException("quota", "QuotaExceededError");
      return window.__rosterSetItem.call(this, key, value);
    };
  });
  await page
    .locator(".roster-avatar-upload")
    .first()
    .setInputFiles({
      name: "student-avatar-2.png",
      mimeType: "image/png",
      buffer: Buffer.concat([avatarBytes, Buffer.from([0])]),
    });
  await page.getByText(/头像未保存/, { exact: false }).waitFor();
  await page.evaluate(() => {
    Storage.prototype.setItem = window.__rosterSetItem;
  });
  const afterAvatarFailure = await page.evaluate(async () => {
    const current = JSON.parse(
      localStorage.getItem("godpower_classroom_roster_v1"),
    );
    const resources = await TeachingResourceRepository.open();
    return {
      avatarResourceId: current.rosterData.students[0].avatarResourceId,
      count: (await resources.list({ subjectId: "student-avatar" })).length,
    };
  });
  assert.equal(afterAvatarFailure.avatarResourceId, avatarState.resourceId);
  assert.equal(afterAvatarFailure.count, 1);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    switchView("settings");
    DesktopUI.selectSettings("students");
  });
  await page
    .locator(".roster-student-avatar")
    .first()
    .waitFor({ state: "visible" });
  assert.match(
    await page.locator(".roster-student-avatar").first().getAttribute("src"),
    /^blob:/,
  );
  await page.screenshot({
    path: "artifacts/f1-roster-workspace/avatars-1920x1080.png",
  });

  await page.locator("#rosterAddProfile").click();
  await page.locator("#rosterProfileName").fill("第二位教师");
  await page.locator("#rosterSaveProfile").click();
  await page
    .locator("#rosterProfileSelect")
    .selectOption({ label: "第二位教师" });
  assert.equal(
    await page.locator(".roster-student-group").first().inputValue(),
    "",
  );
  await page
    .locator(".roster-student-group")
    .first()
    .selectOption({ index: 1 });
  await page.locator("#rosterSave").click();
  const profiled = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("godpower_classroom_roster_v1")),
  );
  assert.equal(profiled.rosterData.profiles.length, 2);
  assert.notEqual(
    profiled.rosterData.assignments[0].userProfileId,
    profiled.rosterData.assignments[1].userProfileId,
  );
  assert.equal(profiled.rosterData.assignments[1].groupAssignments.length, 1);

  await page.locator("#rosterAddClassroom").click();
  await page.locator("#rosterClassroomName").fill("第二课堂");
  await page.locator("#rosterSaveClassroom").click();
  assert.equal(await page.locator("#rosterStudentRows tr").count(), 0);
  await page.locator("#rosterAddStudent").click();
  await page.locator(".roster-student-name").fill("独立学生");
  await page.locator("#rosterAssignmentMode").selectOption("individual");
  await page.locator("#rosterSave").click();
  const individual = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("godpower_classroom_roster_v1")),
  );
  const individualAssignment = individual.rosterData.assignments.find(
    (assignment) =>
      assignment.classroomId ===
      individual.rosterData.classrooms[1].classroomId,
  );
  assert.equal(individualAssignment.mode, "individual");
  assert.deepEqual(individualAssignment.groupAssignments, []);
  const downloadPromise = page.waitForEvent("download");
  await page.locator("#rosterExport").click();
  assert.match((await downloadPromise).suggestedFilename(), /名单\.json$/);

  const beforeInvalidImport = await page.evaluate(() =>
    localStorage.getItem("godpower_classroom_roster_v1"),
  );
  await page.locator("#rosterImport").setInputFiles({
    name: "invalid-roster.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"schemaVersion":1,"profiles":[]}'),
  });
  await page.getByText("导入失败，现有数据未更改", { exact: false }).waitFor();
  assert.equal(
    await page.evaluate(() =>
      localStorage.getItem("godpower_classroom_roster_v1"),
    ),
    beforeInvalidImport,
  );
  assert.equal(
    await page.evaluate(() =>
      JSON.stringify({ groups: state.groups, roundActive: state.roundActive }),
    ),
    liveBefore,
    "roster workspace edits must not mutate the active competition",
  );
  assert.deepEqual(errors, []);
  console.log("PASS F1 classroom roster workspace at 1920x1080 Chromium");
} finally {
  await context.close();
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
