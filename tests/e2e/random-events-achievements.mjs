import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdir, readFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";

const html = await readFile("dist/godpower.html");
const server = createServer((_, res) => {
  res.setHeader("Content-Type", "text/html;charset=utf-8");
  res.end(html);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));

const shotDir = process.env.M6_SCREENSHOT_DIR || "";
if (shotDir) await mkdir(shotDir, { recursive: true });

const browser = await launch();
const errors = [];
try {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  await setup(page, 5);

  // 1. Trigger a formal round while countdown is at 1 to verify Random Event trigger, banner & undo
  const evRes = await page.evaluate(async () => {
    state.isLocked = false;
    state.achievementLedger = AchievementLedger.empty();
    state.randomEventConfig = RandomEvents.normalizeConfig({
      disabledIds: RandomEvents.CATALOG.filter((e) => e.id !== "EV01").map(
        (e) => e.id,
      ),
    });
    state.randomEvents = RandomEvents.normalizeState(
      {
        ...RandomEvents.createState(state.randomEventConfig),
        roundsUntilNext: 1,
      },
      state.randomEventConfig,
    );
    state.roundActive = true;
    state.evaluated = false;
    state.correctAns = "A";
    state.groups.forEach((g, idx) => {
      g.score = (idx + 1) * 10;
      g.displayScore = g.score;
      g.selectedOpt = idx === 0 ? "A" : "B";
      g.allIn = false;
    });
    const accepted = judgeRound();
    const completion = await classroomCommands.whenIdle();
    return {
      accepted,
      completion,
      bannerVisible: !document.getElementById("randomEventBanner")?.hidden,
      bannerText:
        document.getElementById("randomEventBanner")?.textContent || "",
      stripText:
        document.getElementById("battleRandomEventStrip")?.textContent || "",
      toastVisible: !document.getElementById("achievementUnlockToast")?.hidden,
      toastText:
        document.getElementById("achievementUnlockToast")?.textContent || "",
      activeCount: state.randomEvents.active.length,
      unlockedG1: Object.keys(
        state.achievementLedger.groups[state.groups[0].groupUid]
          ?.permanentUnlocks || {},
      ),
    };
  });
  assert.equal(evRes.accepted, true);
  assert.equal(evRes.completion.persisted, true);
  assert.equal(evRes.bannerVisible, true);
  assert.ok(evRes.bannerText.includes("双倍狂欢") && evRes.activeCount >= 1);
  assert.equal(evRes.toastVisible, true);
  assert.ok(evRes.unlockedG1.includes("ACH-001"));
  if (shotDir)
    await page.screenshot({ path: `${shotDir}/01-battle-random-event.png` });

  // Verify undo rolls back BOTH random event trigger and unlocked achievement cleanly
  const afterUndo = await page.evaluate(async () => {
    const ok = await undoLast();
    const res = await classroomCommands.whenIdle();
    return {
      ok,
      persisted: res.persisted,
      roundsUntilNext: state.randomEvents.roundsUntilNext,
      activeCount: state.randomEvents.active.length,
      ledgerGroups: Object.keys(state.achievementLedger.groups),
    };
  });
  assert.equal(afterUndo.ok, true);
  assert.equal(afterUndo.persisted, true);
  assert.equal(afterUndo.roundsUntilNext, 1);
  assert.equal(afterUndo.activeCount, 0);
  assert.deepEqual(afterUndo.ledgerGroups, []);

  // Re-run round + use coin item for clean screenshot & UI checks in Gameplay/Archives/Settings
  await page.evaluate(async () => {
    state.groups.forEach((g) => {
      g.selectedOpt = "A";
    });
    state.roundActive = true;
    state.evaluated = false;
    state.correctAns = "A";
    judgeRound();
    await classroomCommands.whenIdle();
    addItemToGroup(state.groups[0], "coin");
    useItem(state.groups[0].id, 0);
    await classroomCommands.whenIdle();
  });

  // 2. Gameplay Playbook tabs: events & achievements
  await page.evaluate(() => switchView("gameplay"));
  await page.locator('[data-gameplay-tab="events"]').click();
  await page.waitForFunction(() =>
    document.getElementById("gameplayContent")?.textContent.includes("EV16"),
  );
  await page.waitForTimeout(300);
  if (shotDir)
    await page.screenshot({ path: `${shotDir}/02-gameplay-events.png` });

  await page.locator('[data-gameplay-tab="achievements"]').click();
  await page.waitForFunction(() =>
    document
      .getElementById("gameplayContent")
      ?.textContent.includes("初露锋芒"),
  );
  await page.waitForTimeout(300);
  // Hidden achievement ACH-059 must stay masked in student playbook when un-unlocked
  const gameplayText = await page.locator("#gameplayContent").textContent();
  assert.ok(gameplayText.includes("60"));
  assert.equal(gameplayText.includes("冰封禁令"), false);
  if (shotDir)
    await page.screenshot({ path: `${shotDir}/03-gameplay-achievements.png` });

  // 3. Settings -> Rules random event configuration
  await page.evaluate(() => switchView("settings"));
  await page.locator('[data-category="rules"]').click();
  await page.waitForSelector("#uiSettingsRandomEvents");
  await page
    .locator("#uiSettingsRandomEvents .re-pool-disclosure > summary")
    .click();
  const ruleCheckboxes = await page.locator(".re-event-check").count();
  assert.equal(ruleCheckboxes, 16);
  if (shotDir)
    await page.screenshot({ path: `${shotDir}/04-settings-rules.png` });

  // 4. Archives -> Achievements & Honors hall (Classic + Marx themes)
  await page.evaluate(() => switchView("archives"));
  await page.locator('[data-archives-tab="achievements"]').click();
  await page.waitForSelector(".ach-card");
  assert.equal(await page.locator(".ach-card").count(), 60);
  // Verify hidden reveal toggle
  const maskedCount = await page
    .locator('.ach-card:has-text("隐藏挑战 · ???")')
    .count();
  assert.equal(maskedCount, 8);
  await page.locator("#achRevealHiddenCheck").check();
  await page.waitForFunction(() =>
    document
      .getElementById("achievementHallHost")
      ?.textContent.includes("冰封禁令"),
  );
  // Ensure no manual grant/cheat buttons exist
  const suspiciousButtons = await page
    .locator(
      '#achievementHallHost button:has-text("授予"), #achievementHallHost button:has-text("测试解锁")',
    )
    .count();
  assert.equal(suspiciousButtons, 0);
  if (shotDir)
    await page.screenshot({
      path: `${shotDir}/05-archives-achievements-classic.png`,
    });

  // Marx theme check
  await page.evaluate(() => {
    GodpowerTheme.set("marx", { animate: false });
    DesktopUI.renderArchives();
  });
  await page.waitForTimeout(250);
  if (shotDir)
    await page.screenshot({
      path: `${shotDir}/06-archives-achievements-marx.png`,
    });

  assert.deepEqual(errors, []);
  console.log("PASS random events & achievements live E2E + screenshots");
} finally {
  await browser.close();
  server.close();
}
