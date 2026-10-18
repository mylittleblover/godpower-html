import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { launch, setup } from "../fixtures/browser.mjs";
import { battle14, measure14 } from "../fixtures/battle14.mjs";
const html = await readFile("dist/godpower.html");
const server = createServer((q, s) => {
  s.setHeader("Content-Type", "text/html;charset=utf-8");
  s.end(html);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch(),
  page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const root = "artifacts/marx-theme";
await mkdir(root, { recursive: true });
try {
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(page, 14);
  await page.evaluate(battle14, 1);
  await page.waitForTimeout(900);
  const baseline = await page.evaluate(measure14);
  await page.screenshot({ path: `${root}/classic-battle.png` });
  assert.equal(
    await page.evaluate(() => typeof window.GodpowerTheme),
    "object",
    "central theme service must exist",
  );
  const version = JSON.parse(await readFile("package.json", "utf8")).version;
  assert.equal(
    await page.evaluate(() => window.__GOD_POWER_VERSION__),
    "V" + version,
  );
  assert.equal(
    await page.locator(".gp-brand-label small").textContent(),
    "V" + version,
  );
  assert.match(
    await page
      .locator("#btnFinalSettlement")
      .evaluate((e) => getComputedStyle(e).backgroundImage),
    /linear-gradient/,
    "archive action must retain gold gradient in classic theme",
  );
  await page.evaluate(() => {
    switchView("settings");
    DesktopUI.selectSettings("appearance");
  });
  assert.equal(
    await page
      .locator("#cfgResizerEnabled")
      .evaluate((e) => getComputedStyle(e).appearance),
    "none",
    "spacer must use the shared switch",
  );
  await page.evaluate(() => switchView("battle"));
  assert.equal(
    await page.evaluate(() => buildClassroomBackup().appVersion),
    "V" + version,
  );
  const business = await page.evaluate(() => JSON.stringify(state));
  await page.evaluate(() => GodpowerTheme.set("marx"));
  await page.waitForFunction(() => !GodpowerTheme.isSwitching());
  assert.equal(await page.evaluate(() => GodpowerTheme.get()), "marx");
  const semanticColors = await page.evaluate(async () => {
    const button = document.querySelector(".opt-btn");
    button.classList.add("correct");
    await new Promise((resolve) => setTimeout(resolve, 300));
    const correct = getComputedStyle(button).backgroundColor;
    button.classList.remove("correct");
    const positive = document.createElement("span");
    positive.className = "ui-positive";
    document.body.append(positive);
    const gain = getComputedStyle(positive).color;
    positive.remove();
    return { correct, gain };
  });
  assert.equal(
    semanticColors.correct,
    "rgb(21, 128, 61)",
    "correct answers must stay green in Marx theme",
  );
  assert.equal(
    semanticColors.gain,
    "rgb(20, 115, 68)",
    "positive score deltas must stay green",
  );
  assert.equal(
    await page.evaluate(() =>
      getComputedStyle(document.body)
        .getPropertyValue("--window-side-bg")
        .trim(),
    ),
    "#f8f2f1",
    "window palette aliases resolve in the active theme scope",
  );
  assert.match(await page.title(), /马克思的力量/);
  assert.match(
    await page.locator(".gp-brand-label").textContent(),
    /马克思的力量/,
  );
  assert.equal(
    await page.evaluate(() => JSON.stringify(state)),
    business,
    "theme must not mutate classroom state",
  );
  const marx = await page.evaluate(measure14);
  assert.deepEqual(
    marx,
    baseline,
    "theme must preserve exact 14-group geometry",
  );
  assert.equal(
    await page.evaluate(() => GodpowerPicker.getSnapshot().theme),
    "marx",
  );
  const paths = await page
    .locator(".nav-tab .ui-icon path")
    .evaluateAll((es) => es.map((e) => e.getAttribute("d")));
  assert.equal(
    new Set(paths).size,
    5,
    "functional icons must remain distinguishable",
  );
  for (const view of ["welcome", "battle", "history", "archives", "settings"]) {
    await page.evaluate((view) => {
      switchView(view);
      if (view === "settings") DesktopUI.selectSettings("appearance");
    }, view);
    await page.waitForTimeout(850);
    await page.screenshot({ path: `${root}/marx-${view}.png` });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      `${view}: no horizontal overflow`,
    );
  }
  await page.locator("#gpTheme-classic").click();
  await page.waitForFunction(() => !GodpowerTheme.isSwitching());
  assert.match(await page.title(), /上帝的力量/);
  await page.locator("#gpTheme-marx").click();
  await page.waitForFunction(() => GodpowerTheme.isSwitching());
  await page.screenshot({ path: `${root}/theme-transition.png` });
  await page.locator("#gpThemeSkip").click();
  assert.equal(await page.locator("#gpThemeTransition").count(), 0);
  await page.reload();
  await page.waitForFunction(() => window.GodpowerTheme?.get() === "marx");
  assert.equal(
    await page.locator("#gpThemeTransition").count(),
    0,
    "restoration must not replay transition",
  );
  await setup(page, 14);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() => GodpowerTheme.set("classic"));
  assert.equal(await page.locator("#gpThemeTransition").count(), 0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.evaluate(() => {
    GodpowerTheme.set("marx");
    GodpowerTheme.set("classic");
    GodpowerTheme.set("marx");
  });
  await page.waitForFunction(() => !GodpowerTheme.isSwitching());
  assert.equal(await page.evaluate(() => GodpowerTheme.get()), "marx");
  await page.evaluate(() => {
    GodpowerTheme.set("classic");
    switchView("welcome");
  });
  await page.waitForFunction(() => !GodpowerTheme.isSwitching());
  assert.equal(await page.locator("#gpThemeTransition").count(), 0);
  await page.evaluate(() => GodpowerTheme.set("marx", { animate: false }));
  await page.evaluate(() => {
    openItemEncyclopedia();
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${root}/marx-encyclopedia.png` });
  await page.evaluate(() => {
    closeAbout();
    openPickerModal({ internal: true });
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${root}/marx-picker.png` });
  await page.evaluate(() => closePickerModal());
  // Storage denial affects appearance preference only, never classroom data.
  const failure = await page.evaluate(async () => {
    const original = Storage.prototype.setItem;
    const before = JSON.stringify(state);
    Storage.prototype.setItem = function (key, value) {
      if (key === "godpower_appearance_v1")
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      return original.call(this, key, value);
    };
    try {
      return {
        result: await GodpowerTheme.set("classic", { animate: false }),
        unchanged: JSON.stringify(state) === before,
      };
    } finally {
      Storage.prototype.setItem = original;
    }
  });
  assert.equal(failure.result.persisted, false);
  assert.equal(failure.unchanged, true);
  assert.equal(await page.evaluate(() => GodpowerTheme.get()), "classic");
  assert.deepEqual(errors, []);
  await writeFile(
    `${root}/results.json`,
    JSON.stringify(
      { status: "PASS", viewport: "1920x1080@1", baseline, marx, errors },
      null,
      2,
    ),
  );
  console.log(
    "PASS Marx theme: branding, persistence, 5 pages, unique icons, 14-group exact geometry, skip, reduced motion, rapid interruption, no classroom mutation",
  );
} finally {
  await browser.close();
  await new Promise((r) => server.close(r));
}
