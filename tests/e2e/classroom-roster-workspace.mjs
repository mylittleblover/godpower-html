import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
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
  const originalGroupMember = await page.evaluate(
    () => state.groups[0].members[0],
  );
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
    await page.evaluate(() => {
      const canvas = document.createElement("canvas");
      canvas.width = 96;
      canvas.height = 96;
      const context = canvas.getContext("2d");
      context.fillStyle = "#0f766e";
      context.fillRect(0, 0, 96, 96);
      context.fillStyle = "#f8c6a5";
      context.beginPath();
      context.arc(48, 38, 22, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "#153b49";
      context.fillRect(19, 64, 58, 32);
      return canvas.toDataURL("image/png").split(",")[1];
    }),
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

  await page.evaluate(() => {
    const roster = JSON.parse(
      localStorage.getItem("godpower_classroom_roster_v1"),
    ).rosterData;
    const context = {
      schemaVersion: 1,
      userProfileId: roster.profiles[0].userProfileId,
      classroomId: roster.classrooms[0].classroomId,
    };
    localStorage.setItem(
      "godpower_active_classroom_context_v1",
      JSON.stringify(context),
    );
    dispatchEvent(
      new CustomEvent("godpower:active-classroom-changed", { detail: context }),
    );
    state.groups[0].members[0] = "工作区测试姓名";
    switchView("battle");
    renderGrid();
  });
  const groupAvatar = page.locator(
    '.group-row-card[data-group-id="1"] .v213-number-avatar .v213-group-avatar-stack img',
  );
  await groupAvatar.waitFor({ state: "visible" });
  assert.match(await groupAvatar.getAttribute("src"), /^blob:/);
  assert.equal(
    await page
      .locator(
        '.group-row-card[data-group-id="1"] .v213-group-number-below-avatar',
      )
      .innerText(),
    "01",
  );
  await page.screenshot({
    path: "artifacts/f1-roster-workspace/avatar-group-card-1920x1080.png",
  });

  await page.evaluate(async () => {
    openPickerModal();
    setPickerMode("individual");
    window.__avatarTestRandom = Math.random;
    Math.random = () => 0;
    await startSlotSpin();
    stopSlotSpin();
  });
  const pickerAvatar = page.locator(
    "#reelTextStudent .picker-avatar-reel-content img",
  );
  await pickerAvatar.waitFor({ state: "visible" });
  assert.match(await pickerAvatar.getAttribute("src"), /^blob:/);
  assert.match(
    await page.locator("#reelTextStudent").innerText(),
    /工作区测试姓名/,
  );
  await page.screenshot({
    path: "artifacts/f1-roster-workspace/avatar-picker-slot-1920x1080.png",
  });
  await page.evaluate(() => {
    ClassroomFeedback.setOptions({ pickEffects: true }, { persist: false });
    ClassroomFeedback.picked(slotEngine.chosenResult, state.picker.mode);
  });
  const fullScreenAvatar = page.locator(
    "#classroomShowcase[open] .cf-show-avatar-stack img",
  );
  await fullScreenAvatar.waitFor({ state: "visible" });
  assert.match(await fullScreenAvatar.getAttribute("src"), /^blob:/);
  const compactAvatars = await page.evaluate(async () => {
    await ClassroomAvatarDisplay.prepare(state.groups);
    return {
      student: ClassroomAvatarDisplay.studentDataUrl(
        state.groups[0],
        "工作区测试姓名",
      ),
      group: ClassroomAvatarDisplay.groupDataUrlCached(state.groups[0]),
    };
  });
  assert.match(compactAvatars.student, /^data:image\/webp;base64,/);
  assert.match(compactAvatars.group, /^data:image\/webp;base64,/);
  await page.screenshot({
    path: "artifacts/f1-roster-workspace/avatar-fullscreen-1920x1080.png",
  });
  await page.evaluate(() => {
    Math.random = window.__avatarTestRandom;
    delete window.__avatarTestRandom;
    closePickerModal();
  });
  await page.evaluate((name) => {
    state.groups[0].members[0] = name;
    renderGrid();
  }, originalGroupMember);
  await page.evaluate(() => {
    switchView("settings");
    DesktopUI.selectSettings("students");
  });

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

  const tempDir = await mkdtemp(
    path.join(os.tmpdir(), "godpower-roster-backup-"),
  );
  try {
    const avatarExport = page.waitForEvent("download");
    await page.locator("#rosterExport").click();
    const download = await avatarExport;
    const backupPath = path.join(tempDir, download.suggestedFilename());
    await download.saveAs(backupPath);
    const bundle = JSON.parse(await readFile(backupPath, "utf8"));
    assert.equal(bundle.format, "godpower-classroom-roster-backup");
    assert.equal(bundle.schemaVersion, 1);
    assert.equal(bundle.avatars.length, 1);
    assert.equal(bundle.avatars[0].bytesBase64.length > 0, true);

    page.on("dialog", (dialog) => dialog.accept());
    await page.locator('[aria-label="清除 工作区测试姓名 头像"]').click();
    await page.getByText("头像引用已清除", { exact: false }).waitFor();
    const beforeBadBundle = await page.evaluate(() =>
      localStorage.getItem("godpower_classroom_roster_v1"),
    );
    const corrupted = structuredClone(bundle);
    const corruptedBytes = Buffer.from(
      corrupted.avatars[0].bytesBase64,
      "base64",
    );
    corruptedBytes[corruptedBytes.length - 1] ^= 0xff;
    corrupted.avatars[0].bytesBase64 = corruptedBytes.toString("base64");
    const corruptedPath = path.join(tempDir, "corrupt.gproster.json");
    await writeFile(corruptedPath, JSON.stringify(corrupted));
    await page.locator("#rosterImport").setInputFiles(corruptedPath);
    await page.getByText(/导入失败/, { exact: false }).waitFor();
    assert.equal(
      await page.evaluate(() =>
        localStorage.getItem("godpower_classroom_roster_v1"),
      ),
      beforeBadBundle,
    );

    await page.evaluate(async (resourceId) => {
      const resources = await TeachingResourceRepository.open();
      await resources.remove(resourceId);
      resources.close();
    }, avatarState.resourceId);
    await page.evaluate(() => {
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        if (key === "godpower_classroom_roster_v1")
          throw new Error("injected roster quota failure");
        return originalSetItem.call(this, key, value);
      };
      window.__restoreStorageSetItem = () => {
        Storage.prototype.setItem = originalSetItem;
        delete window.__restoreStorageSetItem;
      };
    });
    await page.locator("#rosterImport").setInputFiles(backupPath);
    await page.waitForFunction(() =>
      document
        .querySelector("#rosterStatus")
        ?.textContent.includes("injected roster quota failure"),
    );
    await page.evaluate(() => window.__restoreStorageSetItem());
    const afterFailedCommit = await page.evaluate(async () => {
      const resources = await TeachingResourceRepository.open();
      const count = (await resources.list({ subjectId: "student-avatar" }))
        .length;
      resources.close();
      return {
        roster: localStorage.getItem("godpower_classroom_roster_v1"),
        avatarCount: count,
      };
    });
    assert.equal(afterFailedCommit.roster, beforeBadBundle);
    assert.equal(afterFailedCommit.avatarCount, 0);

    const conflictingBytes = Buffer.from(avatarBytes);
    conflictingBytes[conflictingBytes.length - 1] ^= 0xff;
    await page.evaluate(
      async ({ resource, bytesBase64 }) => {
        const repo = await TeachingResourceRepository.open();
        const bytes = Uint8Array.from(atob(bytesBase64), (item) =>
          item.charCodeAt(0),
        );
        await repo.addBatch([
          {
            resourceId: resource.resourceId,
            file: new File([bytes], resource.fileName, {
              type: resource.mimeType,
            }),
            profileId: resource.profileId,
            classroomId: resource.classroomId,
            subjectId: resource.subjectId,
            title: "Conflicting avatar ID fixture",
          },
        ]);
        repo.close();
      },
      {
        resource: bundle.avatars[0],
        bytesBase64: conflictingBytes.toString("base64"),
      },
    );

    await page.locator("#rosterImport").setInputFiles(backupPath);
    await page.getByText("名单已校验并导入", { exact: false }).waitFor();
    const restoredAvatar = await page.evaluate(async () => {
      const current = JSON.parse(
        localStorage.getItem("godpower_classroom_roster_v1"),
      );
      const student = current.rosterData.students[0];
      const resources = await TeachingResourceRepository.open();
      const resource = await resources.get(student.avatarResourceId);
      return {
        avatarResourceId: student.avatarResourceId,
        bytes: resource?.blob.size,
        sha256: resource?.sha256,
        count: (await resources.list({ subjectId: "student-avatar" })).length,
      };
    });
    assert.notEqual(restoredAvatar.avatarResourceId, avatarState.resourceId);
    assert.ok(restoredAvatar.bytes > 0);
    assert.equal(restoredAvatar.sha256, bundle.avatars[0].sha256);
    assert.equal(restoredAvatar.count, 2);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }

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
  assert.match(
    (await downloadPromise).suggestedFilename(),
    /名单\.gproster\.json$/,
  );

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
