import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html"),
  root = "artifacts/visual-unification/motion";
await mkdir(root, { recursive: true });
const server = createServer((q, s) => {
  s.setHeader("Content-Type", "text/html;charset=utf-8");
  s.end(html);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch(),
  c = await browser.newContext({ viewport: { width: 1920, height: 1080 } }),
  p = await c.newPage(),
  results = [],
  errors = [];
p.setDefaultTimeout(30000);
p.on("pageerror", (e) => errors.push(e.message));
async function test(name, fn) {
  try {
    await setup(p);
    results.push({ name, status: "PASS", evidence: await fn() });
    console.log("PASS", name);
  } catch (e) {
    results.push({ name, status: "FAIL", error: e.stack });
    console.error("FAIL", name, e.message);
    await p
      .screenshot({ path: `${root}/failure-${results.length}.png` })
      .catch(() => {});
    await p
      .evaluate(() => {
        closeThemeDialogV21727(false);
        closePickerModal();
        closeItemWindow();
        closeAbout();
        closeHandRaise();
        closeScoreModal();
        closeBatchImportModal();
      })
      .catch(() => {});
  }
}
async function shot(name) {
  const path = `${root}/${name}.png`;
  await p.screenshot({ path });
  return path;
}
try {
  await p.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await setup(p);
  await p.evaluate(() => {
    window.motionProbe = [];
    const original = Element.prototype.animate;
    Element.prototype.animate = function (...args) {
      const a = original.apply(this, args);
      window.motionProbe.push({
        id: this.id,
        classes: this.className,
        frames: a.effect.getKeyframes(),
        timing: a.effect.getTiming(),
      });
      return a;
    };
  });
  await test("All core pages produce layered, cancellable actual WAAPI entry animations", async () => {
    const evidence = [];
    for (const v of [
      "welcome",
      "battle",
      "history",
      "archives",
      "plugins",
      "settings",
    ]) {
      await p.evaluate((v) => {
        motionProbe = [];
        switchView(v);
      }, v);
      await p.waitForFunction(() => motionProbe.length > 0);
      const probe = await p.evaluate(() => motionProbe);
      assert.ok(probe.some((x) => x.frames.some((f) => f.opacity < 1)));
      evidence.push({ view: v, count: probe.length });
      await p.waitForFunction(() => DesktopUI.getAnimationCount() === 0);
    }
    return evidence;
  });
  for (const [id, fn, arg] of [
    ["scoreModalBackdrop", "openScoreModal", 1],
    ["memberSearchBackdrop", "openMemberSearchModal"],
    ["pwdModal", "openPwdModal"],
    ["settlementNameModal", "triggerFinalSettlement"],
    ["pickerModal", "openPickerModal"],
    ["itemModalBackdrop", "openItemWindow", 1],
    ["handRaiseBackdrop", "openHandRaise"],
    ["aboutBackdrop", "openAbout"],
    ["batchImportModal", "openBatchImportModal"],
    ["quickPersonBackdropV218", "openQuickPersonScoreV218"],
  ])
    await test(`Window ${id}: upward nonlinear entry and single canonical round close`, async () => {
      await p.evaluate(
        ({ fn, arg }) => {
          motionProbe = [];
          window[fn](arg);
        },
        { fn, arg },
      );
      await p.waitForFunction(() =>
        motionProbe.some((x) =>
          String(x.classes).includes("ui-function-surface"),
        ),
      );
      const probe = await p.evaluate(() =>
        motionProbe.find((x) =>
          String(x.classes).includes("ui-function-surface"),
        ),
      );
      assert.equal(probe.frames[0].translate, "0px 42px");
      assert.match(probe.timing.easing, /cubic-bezier/);
      assert.equal(probe.timing.duration, 420);
      const close = p.locator(`#${id} [data-ui-window-close]`);
      assert.equal(await close.count(), 1);
      assert.equal(
        await close.evaluate((e) => getComputedStyle(e).borderRadius),
        "50%",
      );
      await close.click();
      await p.locator("#" + id).waitFor({ state: "hidden" });
      assert.equal(await p.locator("#" + id).isVisible(), false);
      await p.waitForFunction(() => DesktopUI.getAnimationCount() === 0);
      return probe;
    });
  await test("Daily knowledge and all eight settings disclosure groups animate open/close, keyboard and rapid interruption", async () => {
    await p.evaluate(() => switchView("welcome"));
    await p.waitForFunction(() => DesktopUI.getAnimationCount() === 0);
    const knowledge = p.locator("#uiDailyGrid details").first();
    await knowledge.locator("summary").click();
    assert.equal(await knowledge.evaluate((e) => e.open), true);
    await p.waitForFunction(() => DesktopUI.getDisclosureMotionCount() === 0);
    await knowledge.locator("summary").focus();
    await p.keyboard.press("Enter");
    await p.waitForFunction(() => DesktopUI.getDisclosureMotionCount() === 0);
    assert.equal(await knowledge.evaluate((e) => e.open), false);
    const groups = [
      ["appearance", "uiSettingsButtonIcons"],
      ["sound", "uiSettingsMusic"],
      ["sound", "uiSettingsBaseFx"],
      ["sound", "uiSettingsItemFx"],
      ["sound", "uiAudioTransfer"],
      ["items", "uiSettingsItemLibrary"],
      ["welcome", "uiSettingsBank"],
      ["data", "uiSettingsDanger"],
    ];
    for (const [category, id] of groups) {
      await p.evaluate(() => switchView("settings"));
      await p.locator(`[data-category="${category}"]`).click();
      await p.waitForFunction(() => DesktopUI.getAnimationCount() === 0);
      const d = p.locator("#" + id);
      await d.locator(":scope > summary").click();
      await p.waitForFunction(() => DesktopUI.getDisclosureMotionCount() === 0);
      assert.equal(await d.evaluate((e) => e.open), true);
      await d.locator(":scope > summary").click();
      await p.waitForFunction(() => DesktopUI.getDisclosureMotionCount() === 0);
      assert.equal(await d.evaluate((e) => e.open), false);
    }
    await p.evaluate(() => {
      const d = document.getElementById("uiSettingsDanger");
      d.querySelector("summary").click();
      d.querySelector("summary").click();
      d.querySelector("summary").click();
      switchView("battle");
    });
    await p.waitForFunction(() => DesktopUI.getDisclosureMotionCount() === 0);
    assert.equal(
      await p.locator("#uiSettingsDanger").evaluate((e) => e.style.overflow),
      "",
    );
    return { groups: groups.length };
  });
  for (const mode of ["individual", "group", "two_tier"])
    await test(`SVG lever ${mode}: actual result, 1000ms deceleration, anti-repeat, reward and cleanup`, async () => {
      await p.evaluate((mode) => {
        state.picker.antiRepeat = true;
        setPickerMode(mode);
        openPickerModal();
      }, mode);
      assert.equal(await p.locator(".ui-slot-cabinet").count(), 1);
      await p.locator("#btnSlotTrigger").click();
      await p.waitForFunction(() => slotEngine.isSpinning);
      if (mode !== "group")
        await p.waitForSelector(
          "#reelFrameStudent .cf-live-reel .student-no-inline-v218",
        );
      const picked = await p.evaluate(() =>
        JSON.stringify(slotEngine.chosenResult),
      );
      const score = await p.evaluate(() => pickerTargetGroup().score);
      await p.locator("#btnSlotTrigger").click();
      await p.waitForFunction(() => DesktopUI.isPickerRevealing());
      assert.equal(await p.locator("#btnSlotTrigger").isDisabled(), true);
      assert.equal(
        await p.locator('button[onclick="scorePickerTarget(1)"]').isDisabled(),
        true,
      );
      const row = await p.evaluate(() => ({
        started: performance.now(),
        frames: [...document.querySelectorAll(".ui-slot-deceleration")].map(
          (e) => ({
            last: e.lastElementChild.textContent,
            timing: e.getAnimations()[0]?.effect.getTiming(),
          }),
        ),
        chosen: JSON.stringify(slotEngine.chosenResult),
        history: state.itemGlobal.pickerHistory.length,
      }));
      assert.equal(row.chosen, picked);
      assert.ok(row.frames.length > 0);
      assert.ok(row.frames.every((x) => x.timing.duration === 1000));
      if (mode !== "group") {
        const visual = await p.evaluate(() => {
          const winner = slotEngine.chosenResult;
          const number = document.querySelector(
            "#reelFrameStudent .ui-slot-deceleration > span:last-child .student-no-inline-v218",
          );
          const expected = document.createElement("span");
          expected.style.color = winner.group.color;
          document.body.append(expected);
          const color = getComputedStyle(expected).color;
          expected.remove();
          return {
            number: number?.textContent,
            color: number ? getComputedStyle(number).color : null,
            expected: color,
            height: document
              .getElementById("reelFrameStudent")
              .getBoundingClientRect().height,
          };
        });
        assert.ok(
          visual.number,
          "numbered test student retains student number during deceleration",
        );
        assert.equal(visual.color, visual.expected);
        assert.ok(visual.height < 125, "student reel remains compact");
      }
      const screenshot = await shot("slot-" + mode);
      await p.waitForFunction(() => !DesktopUI.isPickerRevealing());
      const duration = await p.evaluate(
        (t) => performance.now() - t,
        row.started,
      );
      assert.equal(await p.locator(".ui-slot-deceleration").count(), 0);
      assert.equal(
        await p.evaluate(() => JSON.stringify(slotEngine.chosenResult)),
        picked,
      );
      await p.locator('button[onclick="scorePickerTarget(1)"]').click();
      assert.equal(
        await p.evaluate(() => pickerTargetGroup().score),
        score + 1,
      );
      await p.locator("#pickerModal [data-ui-window-close]").click();
      return { durationAfterProbe: duration, row, screenshot };
    });
  await test("Compact SVG cabinet and lever fit three desktop sizes at 80/100/125 percent app zoom", async () => {
    const checks = [];
    for (const [width, height] of [
      [1366, 768],
      [1920, 1080],
      [2560, 1440],
    ]) {
      await p.setViewportSize({ width, height });
      for (const zoom of [0.8, 1, 1.25]) {
        await p.evaluate((z) => {
          applyZoom(z);
          openPickerModal();
          setPickerMode("two_tier");
        }, zoom);
        await p.waitForFunction(() => DesktopUI.getAnimationCount() === 0);
        const bounds = await p.evaluate(() => {
          const lever = document
            .getElementById("btnSlotTrigger")
            .getBoundingClientRect();
          const surface = document
            .querySelector("#pickerModal .modal-box")
            .getBoundingClientRect();
          return { lever: lever.toJSON(), surface: surface.toJSON() };
        });
        assert.ok(bounds.surface.y >= 0 && bounds.surface.bottom <= height + 1);
        assert.ok(
          bounds.lever.y >= bounds.surface.y &&
            bounds.lever.bottom <= bounds.surface.bottom,
        );
        if (zoom === 1) await shot("compact-cabinet-" + width);
        checks.push({ width, height, zoom, ...bounds });
        await p.keyboard.press("Escape");
      }
    }
    await p.setViewportSize({ width: 1920, height: 1080 });
    await p.evaluate(() => applyZoom(1));
    return checks;
  });
  await test("Theme confirmation and archived celebration use the same round close without changing dismissal semantics", async () => {
    await p.evaluate(() => {
      void themeConfirm("测试取消", { danger: true });
    });
    await p.locator("#themeDialogV21727 [data-ui-window-close]").click();
    await p.locator("#themeDialogV21727").waitFor({ state: "hidden" });
    assert.equal(await p.locator("#themeDialogV21727").isVisible(), false);
    await p.evaluate(() => confirmFinalSettlement());
    await p.locator("#grandModalOverlay [data-ui-window-close]").click();
    await p.locator("#grandModalOverlay").waitFor({ state: "hidden" });
    assert.equal(await p.locator("#grandModalOverlay").isVisible(), false);
    assert.ok(await p.evaluate(() => getSettlementHistory().length > 0));
  });
  await test("Closing and changing mode during slot deceleration cannot write stale UI or reward a previous target", async () => {
    await p.evaluate(() => openPickerModal());
    await p.locator("#btnSlotTrigger").click();
    await p.waitForFunction(() => slotEngine.isSpinning);
    await p.locator("#btnSlotTrigger").click();
    await p.evaluate(() => {
      closePickerModal();
      openPickerModal();
      setPickerMode("group");
    });
    await p.waitForTimeout(1150);
    assert.equal(await p.locator(".ui-slot-deceleration").count(), 0);
    assert.equal(await p.evaluate(() => slotEngine.chosenResult), null);
    assert.equal(
      await p.locator('button[onclick="scorePickerTarget(1)"]').isDisabled(),
      true,
    );
    await p.keyboard.press("Escape");
  });
} finally {
  await c.close();
  await browser.close();
  server.close();
  await writeFile(
    `${root}/results.json`,
    JSON.stringify(
      {
        sha256: createHash("sha256").update(html).digest("hex"),
        results,
        errors,
      },
      null,
      2,
    ),
  );
  console.log({
    pass: results.filter((x) => x.status === "PASS").length,
    fail: results.filter((x) => x.status === "FAIL").length,
    errors,
  });
  if (results.some((x) => x.status === "FAIL") || errors.length)
    process.exitCode = 1;
}
