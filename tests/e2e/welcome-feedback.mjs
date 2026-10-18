import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html"),
  root = "artifacts/welcome-feedback";
await mkdir(root, { recursive: true });
const server = createServer((q, s) => {
  s.setHeader("Content-Type", "text/html;charset=utf-8");
  s.end(html);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch(),
  results = [],
  errors = [];
async function test(name, fn) {
  try {
    const evidence = await fn();
    results.push({ name, status: "PASS", evidence });
    console.log("PASS", name);
  } catch (e) {
    results.push({ name, status: "FAIL", error: e.stack });
    console.error("FAIL", name, e.message);
  }
}
try {
  const c = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
    }),
    p = await c.newPage();
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  await setup(p, 16);
  await test("Encyclopedia title and subtitle contrast meet 4.5:1", async () => {
    await p.evaluate(() => {
      openAbout();
      renderAbout("items");
    });
    await p.waitForSelector("#aboutMain h2");
    const colors = await p.locator(".v2170-ency-head").evaluate((e) => ({
      bg: getComputedStyle(e).backgroundImage,
      title: getComputedStyle(e.querySelector("h2")).color,
      sub: getComputedStyle(e.querySelector(".v2170-ency-sub")).color,
    }));
    const ratio = (a, b) => {
      const lum = (s) => {
        const rgb = s
          .match(/[\d.]+/g)
          .slice(0, 3)
          .map((x) => {
            x = Number(x) / 255;
            return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
          });
        return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
      };
      return (
        (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05)
      );
    };
    const stops = colors.bg.match(/rgb\([^)]*\)/g);
    assert.ok(stops?.length);
    colors.minimumRatio = Math.min(
      ...stops.flatMap((bg) => [
        ratio(colors.title, bg),
        ratio(colors.sub, bg),
      ]),
    );
    assert.ok(colors.minimumRatio >= 4.5, JSON.stringify(colors));
    await p.screenshot({ path: `${root}/encyclopedia-1920.png` });
    await p.evaluate(() => closeAbout());
    await p.waitForSelector("#aboutBackdrop", { state: "hidden" });
    return colors;
  });
  await test("Continuous default cruise advances in every sample and wraps without a blank edge", async () => {
    await p.evaluate(() => switchView("welcome"));
    await p.mouse.move(0, 0);
    assert.equal(
      await p.evaluate(() => DesktopUI.getPreferences().groupCruise),
      true,
    );
    await p.waitForTimeout(2700);
    const samples = [];
    for (let i = 0; i < 8; i++) {
      await p.waitForTimeout(120);
      samples.push(
        await p.locator("#uiGroupTrack").evaluate((e) => e.scrollLeft),
      );
    }
    for (let i = 1; i < samples.length; i++)
      assert.ok(samples[i] > samples[i - 1], JSON.stringify(samples));
    const period = await p.locator("#uiGroupTrack").evaluate((e) => {
      const start = e.querySelector(".ui-group-card"),
        copy = e.querySelector(".ui-group-repeat");
      const period = copy.offsetLeft - start.offsetLeft;
      e.scrollLeft = period - 3;
      return period;
    });
    await p.waitForTimeout(350);
    const after = await p
      .locator("#uiGroupTrack")
      .evaluate((e) => e.scrollLeft);
    assert.ok(after < 30, { after, period });
    assert.equal(await p.locator(".ui-group-repeat").count(), 16);
    assert.equal(
      await p
        .locator('.ui-group-repeat[tabindex="-1"][aria-hidden="true"]')
        .count(),
      16,
    );
    await p.locator("#uiGroupTrack").hover();
    const paused = await p
      .locator("#uiGroupTrack")
      .evaluate((e) => e.scrollLeft);
    await p.waitForTimeout(250);
    assert.equal(
      await p.locator("#uiGroupTrack").evaluate((e) => e.scrollLeft),
      paused,
    );
    await p.mouse.move(0, 0);
    await p.evaluate(() => switchView("history"));
    assert.equal(
      await p.evaluate(() => WelcomeV2.getStatus().cruiseTimerActive),
      false,
    );
    return { samples, period, after };
  });
  for (const n of [0, 1, 2, 4, 8, 16])
    await test(`Carousel ${n} groups: bounded clones, actual data and reduced motion`, async () => {
      await setup(p, n);
      await p.evaluate(() => switchView("welcome"));
      await p.mouse.move(0, 0);
      await p.waitForTimeout(100);
      assert.equal(await p.locator(".ui-group-card").count(), n);
      assert.ok((await p.locator(".ui-group-repeat").count()) <= n);
      if (n <= 2) assert.equal(await p.locator(".ui-group-repeat").count(), 0);
      if (n) {
        await p.locator(".ui-group-card").first().click();
        await p.waitForSelector("#itemModalBackdrop.active");
        assert.equal(await p.evaluate(() => activeItemGroupId), 1);
        await p.keyboard.press("Escape");
        await p.waitForSelector("#itemModalBackdrop", { state: "hidden" });
      }
      await p.emulateMedia({ reducedMotion: "reduce" });
      await p.waitForTimeout(50);
      assert.equal(
        await p.evaluate(() => WelcomeV2.getStatus().cruiseTimerActive),
        false,
      );
      await p.emulateMedia({ reducedMotion: "no-preference" });
    });
  for (const [width, height] of [
    [1366, 768],
    [1920, 1080],
    [2560, 1440],
  ])
    await test(`Dashboard ${width}: equal KPI fonts, uniform cards, quiz and disclosure`, async () => {
      await p.setViewportSize({ width, height });
      await setup(p, 16);
      await p.evaluate(() => {
        state.groups[0].name = "很长的小组名称用于检查排版与积分一致性";
        state.groups[0].score = 123456789012345;
        switchView("welcome");
        renderAll();
      });
      await p.waitForTimeout(500);
      const data = await p.evaluate(() => {
        const fonts = [...document.querySelectorAll(".gp-kpi strong")].map(
          (e) => getComputedStyle(e).fontSize,
        );
        const cards = [
          ...document.querySelectorAll("#uiDailyGrid article"),
        ].map((e) => {
          const r = e.getBoundingClientRect();
          return {
            class: e.className,
            x: r.x,
            y: r.y,
            right: r.right,
            bottom: r.bottom,
            width: r.width,
            height: r.height,
            overflow: e.scrollWidth > e.clientWidth + 1,
          };
        });
        return {
          fonts,
          cards,
          viewport: innerWidth,
          page: document.documentElement.scrollWidth,
        };
      });
      assert.equal(new Set(data.fonts).size, 1);
      assert.equal(data.cards.length, 4);
      assert.ok(
        data.cards.every((x) => !x.overflow && x.x >= 0 && x.right <= width),
      );
      assert.ok(data.page <= width + 1);
      assert.ok(
        Math.max(...data.cards.map((x) => x.width)) -
          Math.min(...data.cards.map((x) => x.width)) <=
          1,
        JSON.stringify(data.cards),
      );
      assert.ok(
        Math.max(...data.cards.map((x) => x.height)) -
          Math.min(...data.cards.map((x) => x.height)) <=
          1,
        JSON.stringify(data.cards),
      );
      await p.locator('[data-quiz-answer="0"]').click();
      assert.ok((await p.locator(".ui-quiz-result").textContent()).length > 10);
      const result = await p.locator(".ui-quiz-result").textContent();
      await p.evaluate(() => updateWelcomeClock());
      assert.equal(await p.locator(".ui-quiz-result").textContent(), result);
      if (
        await p.locator(".gp-daily-knowledge details").evaluate((e) => e.open)
      ) {
        await p.locator(".gp-daily-knowledge summary").click();
        await p.waitForFunction(
          () => DesktopUI.getDisclosureMotionCount() === 0,
        );
      }
      await p.locator(".gp-daily-knowledge summary").click();
      await p.waitForFunction(() => DesktopUI.getDisclosureMotionCount() === 0);
      assert.equal(
        await p.locator(".gp-daily-knowledge details").evaluate((e) => e.open),
        true,
      );
      await p.evaluate(() => window.scrollTo(0, 0));
      await p.screenshot({
        path: `${root}/welcome-${width}.png`,
        fullPage: true,
      });
      await p
        .locator("#uiDailyGrid")
        .screenshot({ path: `${root}/recommendations-${width}.png` });
      return data;
    });
  await p.setViewportSize({ width: 1920, height: 1080 });
  await setup(p);
  // Freeze exit WAAPI only while inspecting it; real clicks can take >280ms
  // under concurrent browser load. Resume and require real completion below.
  await p.evaluate(() => {
    window.feedbackAnimate = Element.prototype.animate;
    Element.prototype.animate = function (frames, options) {
      const a = window.feedbackAnimate.call(this, frames, options);
      if (Array.isArray(frames) && frames.at(-1)?.translate === "0 64px")
        a.pause();
      return a;
    };
  });
  const modals = [
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
    ["themeDialogV21727", "themeAlert", "动画测试"],
    ["grandModalOverlay", "confirmFinalSettlement"],
  ];
  for (const [id, fn, arg] of modals)
    await test(`Window ${id}: nonlinear downward exit, inert controls and cleanup`, async () => {
      if (id === "grandModalOverlay") await setup(p);
      await p.evaluate(
        ({ fn, arg }) => {
          window[fn](arg);
        },
        { fn, arg },
      );
      await p.waitForSelector(`#${id}[data-ui-modal-open]`);
      await p.waitForFunction(() => DesktopUI.getAnimationCount() === 0);
      await p.locator(`#${id} [data-ui-window-close]`).click();
      const motion = await p.locator("#" + id).evaluate((e) => ({
        inert: e.inert,
        closing: e.dataset.uiClosing,
        animation: e
          .querySelector(".ui-function-surface")
          .getAnimations()
          .map((a) => ({
            frames: a.effect.getKeyframes(),
            timing: a.effect.getTiming(),
          })),
      }));
      assert.equal(motion.inert, true);
      assert.equal(motion.closing, "true");
      assert.ok(
        motion.animation.some(
          (a) =>
            a.frames.at(-1).translate === "0px 64px" &&
            a.timing.easing.includes("cubic-bezier"),
        ),
      );
      if (id === "pickerModal")
        await p.screenshot({ path: `${root}/picker-exit.png` });
      await p.locator("#" + id).evaluate((e) =>
        e
          .querySelector(".ui-function-surface")
          .getAnimations()
          .forEach((a) => a.play()),
      );
      await p.waitForSelector("#" + id, { state: "hidden" });
      await p.waitForFunction(() => DesktopUI.getClosingWindowCount() === 0);
      assert.equal(await p.locator("#" + id).evaluate((e) => e.inert), false);
      return motion;
    });
  await p.evaluate(() => {
    Element.prototype.animate = window.feedbackAnimate;
  });
  await test("Dynamic warning closes with exit and repeated confirmation cannot fire twice", async () => {
    await p.evaluate(() => {
      window.confirmResult = [];
      programConfirmV28("测试警告").then((v) => confirmResult.push(v));
    });
    await p.waitForSelector("#programConfirmV28[data-ui-modal-open]");
    await p.locator("#pcCancelV28").click();
    assert.equal(
      await p.locator("#programConfirmV28").getAttribute("data-ui-closing"),
      "true",
    );
    await p.waitForSelector("#programConfirmV28", { state: "detached" });
    assert.deepEqual(await p.evaluate(() => confirmResult), [false]);
  });
  await test("Rapid reopen cancels stale close; reduced motion closes immediately", async () => {
    await p.evaluate(() => openPwdModal());
    await p.waitForSelector("#pwdModal[data-ui-modal-open]");
    await p.evaluate(() => {
      closePwdModal();
      openPwdModal();
    });
    await p.waitForTimeout(400);
    assert.equal(await p.locator("#pwdModal").isVisible(), true);
    assert.equal(
      await p.locator("#pwdModal").getAttribute("data-ui-closing"),
      null,
    );
    await p.emulateMedia({ reducedMotion: "reduce" });
    await p.evaluate(() => closePwdModal());
    assert.equal(await p.locator("#pwdModal").isVisible(), false);
    await p.emulateMedia({ reducedMotion: "no-preference" });
  });
  assert.deepEqual(errors, []);
  await c.close();
} finally {
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
}
if (results.some((x) => x.status !== "PASS") || errors.length)
  process.exitCode = 1;
