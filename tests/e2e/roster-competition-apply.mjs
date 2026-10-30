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
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));

try {
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await setup(page, 4);
  await page.evaluate(() => {
    localStorage.removeItem("godpower_classroom_roster_v1");
    state.isLocked = false;
    state.groups.forEach((group, index) => {
      group.groupUid ||= StableIdentity.createGroupUid();
      group.members = [`旧成员${index + 1}`];
      group.score = (index + 1) * 3;
      group.inventory = [ItemModules.inventory("coin")];
    });
    switchView("settings");
    DesktopUI.selectSettings("students");
  });

  // TDD red: application must be an explicit preview-confirm transaction.
  await page.locator("#rosterPreviewApply").waitFor({ state: "visible" });
  await page.locator("#rosterCreateFromLive").click();
  await page.locator("#rosterStudentRows tr").first().waitFor();
  await page.locator(".roster-student-name").nth(0).fill("重复姓名");
  await page.locator(".roster-student-name").nth(1).fill("重复姓名");
  await page.locator(".roster-student-group").nth(1).selectOption({ index: 1 });
  await page.locator("#rosterSave").click();
  await page.getByText("名单已保存", { exact: false }).waitFor();
  const initialControls = await page.evaluate(() => ({
    disabled: document.querySelector("#rosterPreviewApply").disabled,
    status: document.querySelector("#rosterStatus").textContent,
    profiles: document.querySelector("#rosterProfileSelect").options.length,
    classrooms: document.querySelector("#rosterClassroomSelect").options.length,
    groups: state.groups.length,
    roster: localStorage.getItem("godpower_classroom_roster_v1"),
  }));
  assert.equal(
    initialControls.disabled,
    false,
    JSON.stringify(initialControls),
  );
  const before = await page.evaluate(() => ({
    state: JSON.stringify(state),
    persisted: localStorage.getItem("godpower_state_v2"),
    roster: localStorage.getItem("godpower_classroom_roster_v1"),
    history: JSON.stringify(historyStack),
  }));
  await page.locator("#rosterPreviewApply").click();
  await page.locator("#rosterApplyPreview").waitFor({ state: "visible" });
  assert.match(
    await page.locator("#rosterApplyPreview").innerText(),
    /积分、道具、答题与回合状态保持不变/,
  );
  await mkdir("artifacts/f1-roster-workspace", { recursive: true });
  await page.screenshot({
    path: "artifacts/f1-roster-workspace/apply-preview-1920x1080.png",
  });
  assert.equal(await page.evaluate(() => JSON.stringify(state)), before.state);
  assert.equal(
    await page.evaluate(() => localStorage.getItem("godpower_state_v2")),
    before.persisted,
  );
  await page.locator("#rosterApplyCancel").click();
  assert.equal(
    await page.evaluate(() =>
      localStorage.getItem("godpower_classroom_roster_v1"),
    ),
    before.roster,
  );

  // Storage failure must roll back state and history; no partial membership update.
  await page.locator("#rosterPreviewApply").click();
  await page.locator("#rosterApplyConfirm").click();
  await page.evaluate(() => {
    window.__originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === "godpower_state_v2")
        throw new DOMException("quota", "QuotaExceededError");
      return window.__originalSetItem.call(this, key, value);
    };
  });
  await page.locator("#themeDialogActionsV21727 button.danger").click();
  await page.evaluate(() => {
    Storage.prototype.setItem = window.__originalSetItem;
  });
  await page
    .locator("#rosterStatus")
    .getByText(/应用失败|保存失败/, { exact: false })
    .waitFor();
  assert.equal(await page.evaluate(() => JSON.stringify(state)), before.state);
  assert.equal(
    await page.evaluate(() => JSON.stringify(historyStack)),
    before.history,
  );
  assert.equal(
    await page.evaluate(() => localStorage.getItem("godpower_state_v2")),
    before.persisted,
  );
  assert.equal(
    await page.evaluate(() =>
      localStorage.getItem("godpower_classroom_roster_v1"),
    ),
    before.roster,
  );

  await page.locator("#rosterPreviewApply").click();
  await page.locator("#rosterApplyConfirm").click();
  await page.locator("#themeDialogV21727").waitFor({ state: "visible" });
  await page.locator("#themeDialogActionsV21727 button.danger").click();
  await page.waitForFunction(() =>
    /已应用|应用失败|预览已过期/.test(
      document.querySelector("#rosterStatus").textContent,
    ),
  );
  assert.match(
    await page.locator("#rosterStatus").innerText(),
    /已应用/,
    "membership command must durably commit after confirmation",
  );
  await page.evaluate(() => classroomCommands.whenIdle());
  const applied = await page.evaluate(() => ({
    groups: state.groups.map((group) => ({
      members: group.members,
      score: group.score,
      inventory: group.inventory,
    })),
    history: historyStack.length,
    persisted: localStorage.getItem("godpower_state_v2"),
    roster: localStorage.getItem("godpower_classroom_roster_v1"),
  }));
  assert.deepEqual(applied.groups[0], {
    members: ["重复姓名", "重复姓名"],
    score: 3,
    inventory: JSON.parse(before.state).groups[0].inventory,
  });
  assert.deepEqual(applied.groups[1], {
    members: [],
    score: 6,
    inventory: JSON.parse(before.state).groups[1].inventory,
  });
  assert.equal(
    applied.history,
    before.history ? JSON.parse(before.history).length + 1 : 1,
  );
  assert.notEqual(applied.persisted, before.persisted);
  assert.equal(applied.roster, before.roster);
  await page.reload({ waitUntil: "domcontentloaded" });
  assert.deepEqual(
    await page.evaluate(() =>
      state.groups.slice(0, 2).map((group) => group.members),
    ),
    [["重复姓名", "重复姓名"], []],
    "duplicate names and membership order must survive reload",
  );
  await page.evaluate(() => {
    state.isLocked = false;
  });
  await page.evaluate(() => HistoryCommands.undo());
  await page.evaluate(() => classroomCommands.whenIdle());
  assert.equal(
    await page.evaluate(() => state.groups[0].members[0]),
    "旧成员1",
  );
  await page.evaluate(() => {
    switchView("settings");
    DesktopUI.selectSettings("students");
  });

  // A preview is invalidated if the selected roster changes before confirmation.
  await page.locator("#rosterPreviewApply").click();
  await page.evaluate(() => {
    const repository =
      ClassroomRosterRepository.createClassroomRosterRepository({
        storage: localStorage,
      });
    const current = repository.read();
    current.rosterData.students[0].displayName = "已变更的名单";
    repository.write(current.rosterData, {
      expectedRevision: current.revision,
    });
  });
  await page.locator("#rosterApplyConfirm").click();
  await page.locator("#themeDialogActionsV21727 button.danger").click();
  await page.getByText(/预览已过期|名单已变化/, { exact: false }).waitFor();
  assert.equal(
    await page.evaluate(() => state.groups[0].members[0]),
    "旧成员1",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS safe roster application and rollback at Chromium 1920x1080",
  );
} finally {
  await context.close();
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
