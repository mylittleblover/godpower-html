import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createServer } from "node:http";
import { launch, setup, dismissStartup } from "../fixtures/browser.mjs";
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
const controls = [],
  pages = [],
  errors = [];
page.on("pageerror", (e) => errors.push(e.message));
try {
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(page, 14);
  for (const theme of ["classic", "marx"]) {
    await page.evaluate((t) => GodpowerTheme.set(t, { animate: false }), theme);
    await page.evaluate(() => switchView("battle"));
    assert.equal(
      await page
        .locator("#btnForceEnd")
        .evaluate((e) => getComputedStyle(e).color),
      "rgb(255, 255, 255)",
      "end-round text needs high contrast white",
    );
    const gold = await page.locator("#btnFinalSettlement").evaluate((e) => ({
      bg: getComputedStyle(e).backgroundImage,
      glow: getComputedStyle(e).boxShadow,
      text: getComputedStyle(e).color,
    }));
    assert.match(gold.bg, /255, 228, 154/);
    assert.notEqual(gold.glow, "none");
    await page.locator("#btnFinalSettlement").hover();
    assert.match(
      await page
        .locator("#btnFinalSettlement")
        .evaluate((e) => getComputedStyle(e).backgroundImage),
      /255, 228, 154/,
    );
    for (const view of [
      "welcome",
      "battle",
      "history",
      "archives",
      "settings",
    ]) {
      await page.evaluate((v) => switchView(v), view);
      await page.waitForTimeout(500);
      pages.push({
        theme,
        view,
        checkboxes: await page
          .locator(`#view-${view} input[type=checkbox]`)
          .count(),
      });
    }
    for (const category of [
      "rules",
      "appearance",
      "motion",
      "sound",
      "items",
      "students",
      "welcome",
      "data",
    ]) {
      await page.evaluate((c) => DesktopUI.selectSettings(c), category);
      await page.waitForTimeout(300);
      const found = await page
        .locator(`[data-category-panel="${category}"] input[type=checkbox]`)
        .evaluateAll((inputs) =>
          inputs.map((e) => {
            const track = e
              .closest(".ui-toggle")
              ?.querySelector(".ui-toggle-track");
            const paint = track || e,
              cs = getComputedStyle(paint);
            return {
              id: e.id || e.name,
              kind: track ? "shared-track" : "native-switch",
              width: parseFloat(cs.width),
              height: parseFloat(cs.height),
              appearance: getComputedStyle(e).appearance,
              checked: e.checked,
              disabled: e.disabled,
            };
          }),
        );
      for (const input of found) {
        assert.equal(input.width, 52, `${theme}/${category}/${input.id}`);
        assert.equal(input.height, 28);
        if (input.kind === "native-switch")
          assert.equal(input.appearance, "none");
      }
      controls.push({ theme, category, controls: found });
      if (["rules", "motion", "sound"].includes(category))
        await page.screenshot({
          path: `artifacts/marx-theme/${theme}-switches-${category}.png`,
        });
    }
  }
  await page.evaluate(() => DesktopUI.selectSettings("appearance"));
  await page.waitForTimeout(300);
  const spacer = page.locator("#cfgResizerEnabled");
  await spacer.focus();
  await page.keyboard.press("Space");
  const value = await spacer.isChecked();
  assert.equal(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("politics_resizer_enabled")),
    ),
    value,
  );
  await page.reload();
  await dismissStartup(page);
  assert.equal(
    await page.evaluate(() => state.resizerEnabled),
    value,
    "switch remains persisted after reload",
  );
  await page.evaluate(() => {
    openPickerModal({ internal: true });
  });
  await page.waitForTimeout(300);
  assert.equal(
    await page
      .locator("#chkAntiRepeat")
      .evaluate((e) => getComputedStyle(e).appearance),
    "none",
  );
  assert.deepEqual(errors, []);
  await mkdir("artifacts/marx-theme", { recursive: true });
  await writeFile(
    "artifacts/marx-theme/control-inventory.json",
    JSON.stringify(
      { status: "PASS", viewport: "1920x1080@1", pages, controls, errors },
      null,
      2,
    ),
  );
  console.log(
    "PASS controls: two themes, five pages, eight settings categories, gold default+hover, shared switches, keyboard and persistence",
  );
} finally {
  await browser.close();
  await new Promise((r) => server.close(r));
}
