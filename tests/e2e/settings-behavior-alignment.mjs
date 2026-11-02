import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html");
const server = createServer((req, res) => res.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch(),
  page = await browser.newPage();
const results = [],
  errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await mkdir("artifacts/classroom-feedback", { recursive: true });
try {
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(page);
  for (const [width, height] of [
    [1366, 768],
    [1920, 1080],
    [2560, 1440],
  ]) {
    await page.setViewportSize({ width, height });
    for (const zoom of [0.8, 1, 1.25]) {
      await page.evaluate((z) => {
        ClassroomFeedback.cancel();
        applyZoom(z);
        switchView("settings");
        DesktopUI.selectSettings("rules");
      }, zoom);
      await page.waitForFunction(
        () =>
          DesktopUI.getSettingsMotionCount() === 0 &&
          DesktopUI.getAnimationCount() === 0,
      );
      await page.locator("#uiSettingsRules").scrollIntoViewIfNeeded();
      const boxes = await page.evaluate(() =>
        [...document.querySelectorAll("#uiSettingsRules .ui-rule-card")].map(
          (el) => {
            const rect = (x) => {
              const r = x.getBoundingClientRect();
              return { x: r.x, y: r.y, width: r.width, height: r.height };
            };
            return {
              card: rect(el),
              title: rect(el.querySelector(".ui-rule-title")),
              switch: rect(el.querySelector(".ui-toggle-track")),
            };
          },
        ),
      );
      assert.equal(boxes.length, 2);
      for (const key of ["y", "width", "height"])
        assert.ok(
          Math.abs(boxes[0].card[key] - boxes[1].card[key]) < 1,
          JSON.stringify(boxes),
        );
      for (const key of ["y", "width", "height"])
        assert.ok(
          Math.abs(boxes[0].switch[key] - boxes[1].switch[key]) < 1,
          JSON.stringify(boxes),
        );
      assert.ok(Math.abs(boxes[0].title.y - boxes[1].title.y) < 1);
      if (zoom === 1)
        await page.locator("#uiSettingsRules").screenshot({
          path: `artifacts/classroom-feedback/settings-behavior-${width}.png`,
        });
      await page.evaluate(() => {
        ClassroomFeedback.setOptions(
          { pickEffects: true, duration: 3600 },
          { persist: false },
        );
        ClassroomFeedback.picked(
          { group: state.groups[0], memberName: "01 测试同学" },
          "individual",
        );
      });
      await page.waitForSelector("#classroomShowcase[open]");
      assert.equal(
        await page.locator(".cf-show-value").textContent(),
        "就是你",
      );
      const skip = await page
        .locator("#classroomShowcase > .ui-cinematic-skip")
        .boundingBox();
      assert.ok(
        skip.x > width / 2 && skip.y > height * 0.8,
        JSON.stringify(skip),
      );
      await page.evaluate(() => ClassroomFeedback.cancel());
      results.push({ width, height, zoom, status: "PASS", boxes, skip });
    }
  }
  await page.evaluate(() => {
    applyZoom(1);
    switchView("settings");
    DesktopUI.selectSettings("rules");
  });
  const before = await page.locator("#cfgSaveAllIn").isChecked();
  await page.locator("#cfgSaveAllIn").focus();
  await page.keyboard.press("Space");
  assert.equal(await page.locator("#cfgSaveAllIn").isChecked(), !before);
  assert.equal(await page.evaluate(() => state.saveAllIn), !before);
  await page.locator("#cfgSaveAllIn").focus();
  await page.keyboard.press("Space");
  assert.equal(await page.evaluate(() => state.saveAllIn), before);
  await page.evaluate(() => {
    ClassroomFeedback.cancel();
    document.getElementById("grandModalOverlay").classList.add("active");
  });
  for (const [root, selector] of [
    ["grandModalOverlay", "#grandModalOverlay > .ui-cinematic-skip"],
    ["gpIntro", "#gpIntroSkip"],
  ]) {
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      el.hidden = false;
      el.classList.remove("departing");
      el.classList.add("active", "ready");
    }, root);
    const box = await page.locator(selector).boundingBox();
    assert.ok(
      box.x > 1280 && box.y > 1440 * 0.8,
      JSON.stringify({ root, box }),
    );
    await page.screenshot({
      path: `artifacts/classroom-feedback/skip-${root}.png`,
    });
    await page.evaluate(
      (id) => document.getElementById(id).classList.remove("active"),
      root,
    );
  }
  assert.deepEqual(errors, []);
  console.log(
    `PASS ${results.length} desktop/zoom alignment and skip checks; keyboard toggle; no page errors`,
  );
} finally {
  await writeFile(
    "artifacts/classroom-feedback/settings-behavior-results.json",
    JSON.stringify({ results, errors }, null, 2),
  );
  await browser.close();
  server.close();
}
