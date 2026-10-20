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
    const groups = StableIdentity.assignGroupUids(state.groups);
    const roster = ClassroomRoster.previewLegacyRoster({
      classroomId: "classroom-schedule-test",
      userProfileId: "profile-schedule-test",
      classroomName: "课程表测试班",
      profileName: "课程表教师",
      groups,
    });
    ClassroomRosterRepository.createClassroomRosterRepository({
      storage: localStorage,
    }).write(roster, { expectedRevision: 0 });
    switchView("settings");
    DesktopUI.selectSettings("students");
  });

  const workspace = page.locator("#teachingScheduleWorkspace");
  await workspace.waitFor({ state: "visible" });
  const match = await page.evaluate(() => {
    const now = new Date();
    const minute = now.getHours() * 60 + now.getMinutes();
    const endOfDay = minute === 1439;
    return {
      day: endOfDay ? (now.getDay() + 1) % 7 : now.getDay(),
      start: endOfDay ? 480 : Math.max(0, minute - 1),
      end: endOfDay ? 525 : Math.min(1440, minute + 2),
      shouldMatch: !endOfDay,
      contestBytes: localStorage.getItem("godpower_state_v2"),
      contest: JSON.stringify({
        groups: state.groups,
        score: state.groups.map((g) => g.score),
      }),
    };
  });
  const time = (minute) =>
    `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
  await page.locator("#teachingWeekday").selectOption(String(match.day));
  await page.locator("#teachingStart").fill(time(match.start));
  await page.locator("#teachingEnd").fill(time(match.end));
  await page.locator("#teachingSubject").fill("政治");
  await page.locator("#teachingAddSlot").click();
  assert.equal(
    await page.locator(".teaching-schedule-table tbody tr").count(),
    1,
  );
  await page.locator("#teachingStart").fill(time(match.start));
  await page.locator("#teachingEnd").fill(time(match.end));
  await page.locator("#teachingSubject").fill("重叠测试");
  await page.locator("#teachingAddSlot").click();
  assert.equal(
    await page.locator(".teaching-schedule-table tbody tr").count(),
    1,
  );
  assert.match(
    await page.locator("#teachingScheduleStatus").innerText(),
    /overlap/i,
  );
  await page
    .locator("#teachingScheduleList button[aria-label^='编辑']")
    .click();
  await page.locator("#teachingSubject").fill("政治·已编辑");
  await page.locator("#teachingAddSlot").click();
  assert.match(
    await page.locator(".teaching-schedule-table tbody").innerText(),
    /政治·已编辑/,
  );
  await page
    .locator("#teachingWeekday")
    .selectOption(String((match.day + 1) % 7));
  await page.locator("#teachingStart").fill("10:00");
  await page.locator("#teachingEnd").fill("10:45");
  await page.locator("#teachingSubject").fill("待删除课程");
  await page.locator("#teachingAddSlot").click();
  assert.equal(
    await page.locator(".teaching-schedule-table tbody tr").count(),
    2,
    "a non-overlapping slot should be added",
  );
  await page
    .locator("#teachingScheduleList button[aria-label^='删除']")
    .last()
    .click();
  assert.equal(
    await page.locator(".teaching-schedule-table tbody tr").count(),
    1,
    "a selected slot should be removable from the draft",
  );
  assert.doesNotMatch(
    await page.locator("#teachingScheduleList").innerText(),
    /待删除课程/,
  );
  await page.locator("#teachingWeekday").selectOption(String(match.day));
  if (match.shouldMatch) {
    assert.match(
      await page.locator("#teachingCurrentLesson").innerText(),
      /当前建议/,
    );
    await page.locator("#teachingUseCurrent").click();
  }
  await mkdir("artifacts/f2-teaching-schedule", { recursive: true });
  await workspace.screenshot({
    path: "artifacts/f2-teaching-schedule/1920x1080.png",
  });
  await page.locator("#teachingSaveSchedule").click();

  if (match.shouldMatch) {
    const active = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("godpower_active_classroom_context_v1")),
    );
    assert.equal(active.classroomId, "classroom-schedule-test");
    assert.equal(
      await page.locator("#rosterClassroomSelect").inputValue(),
      "classroom-schedule-test",
      "explicit schedule selection must update the local roster workspace",
    );
  }
  assert.equal(
    await page.evaluate(() =>
      JSON.stringify({
        groups: state.groups,
        score: state.groups.map((g) => g.score),
      }),
    ),
    match.contest,
    "schedule selection must not change competition state",
  );
  assert.equal(
    await page.evaluate(() => localStorage.getItem("godpower_state_v2")),
    match.contestBytes,
    "schedule persistence must not write the authoritative competition snapshot",
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    switchView("settings");
    DesktopUI.selectSettings("students");
  });
  await page.waitForFunction(
    () =>
      document.querySelectorAll(".teaching-schedule-table tbody tr").length ===
      1,
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS weekly schedule and explicit teaching context at Chromium 1920x1080",
  );
} finally {
  await context.close();
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
