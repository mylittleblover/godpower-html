import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html"),
  results = [],
  errors = [],
  screenshots = [];
const server = createServer((_, res) => {
  res.setHeader("Content-Type", "text/html;charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(html);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch(),
  url = `http://127.0.0.1:${server.address().port}`;
await mkdir("artifacts/welcome-completion/screenshots", { recursive: true });
async function open({
  width = 1920,
  height = 1080,
  zoom = 1,
  prefs = {},
  reducedMotion = "no-preference",
} = {}) {
  const c = await browser.newContext({
    viewport: { width, height },
    reducedMotion,
  });
  await c.addInitScript(
    ({ zoom, prefs }) => {
      if (localStorage.getItem("politics_zoom_level") === null)
        localStorage.setItem("politics_zoom_level", String(zoom));
      if (localStorage.getItem("godpower_ui_preferences_v1") === null)
        localStorage.setItem(
          "godpower_ui_preferences_v1",
          JSON.stringify(prefs),
        );
    },
    { zoom, prefs },
  );
  const p = await c.newPage();
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(url, { waitUntil: "domcontentloaded" });
  return { c, p };
}
async function test(name, fn) {
  try {
    const evidence = await fn();
    results.push({ name, status: "PASS", evidence });
    console.log("PASS", name);
  } catch (error) {
    results.push({ name, status: "FAIL", error: error.stack });
    console.error("FAIL", name, error.message);
  }
}
async function shot(p, name) {
  const path = `artifacts/welcome-completion/screenshots/${name}.png`;
  await p.screenshot({ path, fullPage: true });
  screenshots.push(path);
}
async function skip(p) {
  await p.locator("#gpIntroSkip").click();
  await p.waitForFunction(() => WelcomeV2.getStatus().introFinished);
}
try {
  for (const [width, height] of [
    [1366, 768],
    [1920, 1080],
    [2560, 1440],
  ])
    for (const zoom of [0.8, 1, 1.25])
      await test(`Entrance geometry, actual pointer unlock and SVG FLIP ${width}x${height} app zoom ${zoom}`, async () => {
        const { c, p } = await open({ width, height, zoom });
        try {
          assert.equal(
            await p.evaluate(() => document.activeElement.id),
            "gpSlideTrack",
          );
          await p.evaluate(
            () =>
              (window.testLogo = document.querySelector("#gpIntroLogo svg")),
          );
          await p.keyboard.press("Shift+Tab");
          assert.equal(
            await p.evaluate(() => document.activeElement.id),
            "gpIntroSkip",
          );
          await p.keyboard.press("Tab");
          assert.equal(
            await p.evaluate(() => document.activeElement.id),
            "gpSlideTrack",
          );
          await p.waitForTimeout(800);
          const root = await p.locator("#gpIntro").boundingBox();
          assert.ok(Math.abs(root.x) < 2 && Math.abs(root.y) < 2);
          assert.ok(
            root.width >= width - 2 && root.height >= height - 2,
            "overlay covers viewport",
          );
          if (zoom === 1) await shot(p, `intro-${width}`);
          let box = await p.locator("#gpSlideTrack").boundingBox();
          await p.mouse.move(box.x + box.width * 0.1, box.y + box.height / 2);
          await p.mouse.down();
          await p.mouse.move(box.x + box.width * 0.4, box.y + box.height / 2, {
            steps: 6,
          });
          await p.mouse.up();
          assert.equal(
            await p.locator("#gpSlideTrack").getAttribute("aria-valuenow"),
            "0",
          );
          assert.equal(
            await p.evaluate(() => WelcomeV2.getStatus().introFinished),
            false,
          );
          await p.mouse.move(box.x + box.width * 0.1, box.y + box.height / 2);
          await p.mouse.down();
          await p.mouse.move(box.x + box.width - 5, box.y + box.height / 2, {
            steps: 10,
          });
          await p.mouse.up();
          const endpoint = await p.evaluate(() => {
            const logo = document.getElementById("gpIntroLogo"),
              all = logo.getAnimations();
            if (!all.length) throw Error("Expected actual logo animation");
            for (const animation of all) {
              animation.pause();
              animation.currentTime = animation.effect.getTiming().duration;
            }
            const a = logo.getBoundingClientRect(),
              b = document
                .getElementById("gpBrandMount")
                .getBoundingClientRect();
            return {
              dx: Math.abs(a.left + a.width / 2 - (b.left + b.width / 2)),
              dy: Math.abs(a.top + a.height / 2 - (b.top + b.height / 2)),
              width: Math.abs(a.width - b.width),
            };
          });
          assert.ok(
            endpoint.dx <= 2 && endpoint.dy <= 2 && endpoint.width <= 2,
            JSON.stringify(endpoint),
          );
          if (zoom === 1) await shot(p, `flip-endpoint-${width}`);
          await p.keyboard.press("Escape");
          await p.waitForFunction(() => WelcomeV2.getStatus().introFinished);
          assert.deepEqual(
            await p.evaluate(() => ({
              same:
                document.querySelector("#gpBrandMount svg") === window.testLogo,
              locks: WelcomeV2.getStatus().backgroundLocks,
              animations: WelcomeV2.getStatus().animations,
              visible: !document.getElementById("gpIntro").hidden,
            })),
            { same: true, locks: 0, animations: 0, visible: false },
          );
          assert.equal(
            await p.evaluate(() =>
              document.activeElement.classList.contains("welcome-enter-btn"),
            ),
            true,
          );
          await setup(p, 14);
          await p.evaluate(() => {
            switchView("welcome");
            renderAll();
          });
          const layout = await p.evaluate(() => ({
            width: innerWidth,
            scroll: document.documentElement.scrollWidth,
            rows: document.querySelectorAll(".gp-rank-row").length,
            groups: document.querySelectorAll(".ui-group-card").length,
          }));
          assert.equal(layout.rows, 14);
          assert.equal(layout.groups, 14);
          if (zoom === 1) {
            assert.ok(
              layout.scroll <= layout.width + 2,
              JSON.stringify(layout),
            );
            await shot(p, `dashboard-14-${width}`);
          }
          return {
            width,
            height,
            zoom,
            endpoint,
            overlay: root,
            dashboard: layout,
          };
        } finally {
          await c.close();
        }
      });
  await test("Keyboard full entrance, partial reset, repeated replay and view-switch interruption", async () => {
    const { c, p } = await open();
    try {
      await p.keyboard.press("ArrowRight");
      await p.keyboard.press("Home");
      assert.equal(
        await p.locator("#gpSlideTrack").getAttribute("aria-valuenow"),
        "0",
      );
      await p.keyboard.press("End");
      await p.keyboard.press("Enter");
      await p.waitForFunction(() => WelcomeV2.getStatus().introFinished);
      for (let i = 0; i < 5; i++) {
        await p.locator("#gpReplayIntro").click();
        await p.keyboard.press("End");
        await p.keyboard.press("Enter");
        await p.evaluate(() => switchView("settings"));
        assert.equal(await p.locator("#gpIntro").isVisible(), false);
        assert.equal(
          await p.evaluate(() => WelcomeV2.getStatus().backgroundLocks),
          0,
        );
        assert.equal(
          await p.evaluate(() => document.activeElement.dataset.view),
          "settings",
        );
        await p.evaluate(() => switchView("welcome"));
      }
      assert.equal(await p.locator("#gpBrandMount svg").count(), 1);
      await p.locator("#gpReplayIntro").click();
      await p.evaluate(() =>
        document
          .getElementById("gpSlideTrack")
          .addEventListener(
            "pointerdown",
            (e) => (window.fixturePointer = e.pointerId),
            { once: true },
          ),
      );
      const box = await p.locator("#gpSlideTrack").boundingBox();
      await p.mouse.move(box.x + 20, box.y + box.height / 2);
      await p.mouse.down();
      await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await p.evaluate(() =>
        document.getElementById("gpSlideTrack").dispatchEvent(
          new PointerEvent("pointercancel", {
            pointerId: window.fixturePointer,
            isPrimary: true,
          }),
        ),
      );
      await p.mouse.up();
      assert.equal(
        await p.locator("#gpSlideTrack").getAttribute("aria-valuenow"),
        "0",
      );
      assert.equal(
        await p.evaluate(() => WelcomeV2.getStatus().introFinished),
        false,
      );
      await p.keyboard.press("Escape");
    } finally {
      await c.close();
    }
  });
  for (const [name, prefs, reducedMotion, skipExpected] of [
    ["motion-off", { motion: "off" }, "no-preference", true],
    ["system-reduce", {}, "reduce", true],
    ["system-optout", { systemMotion: false }, "reduce", false],
    ["simple", { motion: "simple" }, "no-preference", false],
  ])
    await test(`Motion preferences: ${name}`, async () => {
      const { c, p } = await open({ prefs, reducedMotion });
      try {
        if (skipExpected) {
          await p.waitForFunction(() => WelcomeV2.getStatus().introFinished);
          assert.equal(await p.locator("#gpIntro").isVisible(), false);
          assert.equal(
            await p.evaluate(() => WelcomeV2.getStatus().animations),
            0,
          );
        } else {
          assert.equal(await p.locator("#gpIntro").isVisible(), true);
          await skip(p);
        }
      } finally {
        await c.close();
      }
    });
  await test("Live motion disable and resize cancel entrance without lingering focus/inert locks", async () => {
    const { c, p } = await open();
    try {
      await p.keyboard.press("End");
      await p.keyboard.press("Enter");
      await p.setViewportSize({ width: 1366, height: 768 });
      await p.waitForFunction(() => WelcomeV2.getStatus().introFinished);
      assert.equal(
        await p.evaluate(() => WelcomeV2.getStatus().backgroundLocks),
        0,
      );
      await p.locator("#gpReplayIntro").click();
      await p.keyboard.press("End");
      await p.keyboard.press("Enter");
      await p.emulateMedia({ reducedMotion: "reduce" });
      await p.waitForFunction(() => WelcomeV2.getStatus().introFinished);
      assert.equal(await p.locator("#gpBrandMount svg").count(), 1);
    } finally {
      await c.close();
    }
  });
  await test("Stable tie ranking, negative/large exact statistics, phase and live mutation consistency", async () => {
    const { c, p } = await open();
    try {
      await skip(p);
      await setup(p, 3);
      await p.evaluate(() => {
        state.groups[0].id = 9;
        state.groups[0].name = "先加入";
        state.groups[1].id = 2;
        state.groups[1].name = "后加入";
        state.groups[2].id = 5;
        state.groups[2].name = "<img src=x onerror=alert(1)>";
        state.groups.forEach((g) => (g.score = -10));
        state.evaluated = true;
        switchView("welcome");
        renderAll();
      });
      assert.deepEqual(
        await p.locator(".gp-rank-name").allTextContents(),
        await p.evaluate(() => ranking().map((g) => g.name)),
      );
      assert.equal(await p.locator("#wMaxScore").textContent(), "-10");
      assert.equal(await p.locator("#wLeaderName").textContent(), "先加入");
      assert.equal(await p.locator("#wTotalScore").textContent(), "-30");
      assert.match(await p.locator("#gpRoundTitle").textContent(), /已结算/);
      assert.equal(await p.locator("#gpRankList img").count(), 0);
      await p.evaluate(() => {
        state.groups[0].score = Number.MAX_SAFE_INTEGER;
        state.groups[1].score = Number.MAX_SAFE_INTEGER;
        state.groups[2].score = 1;
        updateWelcomeClock();
      });
      assert.equal(
        await p.locator("#wTotalScore").textContent(),
        "18014398509481983",
      );
      assert.equal(
        await p.locator("#wMaxScore").textContent(),
        "9007199254740991",
      );
      await p.evaluate(() => {
        state.evaluated = false;
        state.correctAns = "B";
        updateWelcomeClock();
      });
      assert.match(await p.locator("#gpRoundTitle").textContent(), /已选定/);
      assert.ok(
        (await p.locator("#topHeaderStats").textContent()).includes(
          "18014398509481983",
        ),
      );
      await shot(p, "statistics-large-negative-xss");
    } finally {
      await c.close();
    }
  });
  await test("Squid masks scores, ranks, ordering and KPI values, then restores exact state", async () => {
    const { c, p } = await open();
    try {
      await skip(p);
      await setup(p, 3);
      await p.evaluate(() => {
        switchView("welcome");
        state.itemGlobal.blooperUntil = Date.now() + 20000;
        renderAll();
      });
      assert.deepEqual(
        await p.locator(".gp-rank-name").allTextContents(),
        await p.evaluate(() => state.groups.map((g) => g.name)),
      );
      assert.deepEqual(await p.locator(".gp-rank-index").allTextContents(), [
        "—",
        "—",
        "—",
      ]);
      assert.deepEqual(await p.locator(".gp-rank-points").allTextContents(), [
        "???",
        "???",
        "???",
      ]);
      assert.equal(await p.locator("#wTotalScore").textContent(), "???");
      assert.equal(
        await p
          .locator("#wTotalScore")
          .evaluate((e) => e.classList.contains("squid-hidden-score")),
        true,
      );
      assert.match(
        await p.locator("#topHeaderStats").textContent(),
        /总积分:\s*\?{3}/,
      );
      await shot(p, "squid-masked");
      await p.evaluate(() => {
        state.itemGlobal.blooperUntil = 0;
        applyBlooperMask();
        updateWelcomeClock();
      });
      assert.equal(await p.locator("#wTotalScore").textContent(), "420");
      assert.match(
        await p.locator("#topHeaderStats").textContent(),
        /总积分:\s*420/,
      );
      assert.deepEqual(
        await p.locator(".gp-rank-name").allTextContents(),
        await p.evaluate(() => ranking().map((g) => g.name)),
      );
    } finally {
      await c.close();
    }
  });
  await test("Unchanged clock ticks preserve rank/feed nodes and reading position; new state updates them", async () => {
    const { c, p } = await open();
    try {
      await skip(p);
      await setup(p, 16);
      await p.evaluate(() => {
        switchView("welcome");
        recordHistory("fixture <b>");
        renderAll();
        window.rankNode = document.querySelector(".gp-rank-row");
        window.feedNode = document.querySelector(".gp-feed-row");
        for (let i = 0; i < 20; i++) updateWelcomeClock();
      });
      assert.equal(
        await p.evaluate(
          () =>
            document.querySelector(".gp-rank-row") === window.rankNode &&
            document.querySelector(".gp-feed-row") === window.feedNode,
        ),
        true,
      );
      await p.evaluate(() => {
        state.groups[0].score += 1000;
        updateWelcomeClock();
      });
      assert.equal(
        await p.evaluate(
          () => document.querySelector(".gp-rank-row") !== window.rankNode,
        ),
        true,
      );
    } finally {
      await c.close();
    }
  });
  await test("Cruise is opt-in, pauses for reading and stops off-page/reduced motion; preference saves", async () => {
    const { c, p } = await open();
    try {
      await skip(p);
      await setup(p, 16);
      await p.evaluate(() => switchView("welcome"));
      assert.equal(
        await p.locator("#gpCruiseToggle").getAttribute("aria-pressed"),
        "false",
      );
      assert.equal(
        await p.evaluate(() => WelcomeV2.getStatus().cruiseTimerActive),
        false,
      );
      await p.locator('[data-quiz-answer="0"]').click();
      const explanation = await p.locator(".ui-quiz-result").textContent();
      await p.locator("#gpCruiseToggle").click();
      await p.evaluate(() => updateWelcomeClock());
      assert.equal(
        await p.locator(".ui-quiz-result").textContent(),
        explanation,
      );
      assert.equal(
        await p.evaluate(() => DesktopUI.getPreferences().groupCruise),
        true,
      );
      assert.equal(
        await p.evaluate(() => WelcomeV2.getStatus().cruiseTimerActive),
        true,
      );
      await p.waitForFunction(
        () => document.getElementById("uiGroupTrack").scrollLeft > 0,
        null,
        { timeout: 8000 },
      );
      await p.locator("#uiGroupTrack").hover();
      assert.equal(
        await p.evaluate(() => WelcomeV2.getStatus().cruiseTimerActive),
        false,
      );
      await p.mouse.move(0, 0);
      await p.locator(".ui-group-card").first().focus();
      assert.equal(
        await p.evaluate(() => WelcomeV2.getStatus().cruiseTimerActive),
        false,
      );
      await p.evaluate(() => switchView("settings"));
      assert.equal(
        await p.evaluate(() => WelcomeV2.getStatus().cruiseTimerActive),
        false,
      );
      assert.equal(await p.locator("#uiPref-groupCruise").isChecked(), true);
      const nav = p.waitForNavigation({
        waitUntil: "domcontentloaded",
        timeout: 90000,
      });
      const session = await c.newCDPSession(p);
      await session.send("Page.reload", { ignoreCache: true });
      await nav;
      await session.detach();
      await skip(p);
      assert.equal(
        await p.evaluate(() => DesktopUI.getPreferences().groupCruise),
        true,
      );
      await p.emulateMedia({ reducedMotion: "reduce" });
      assert.equal(
        await p.evaluate(() => WelcomeV2.getStatus().cruiseTimerActive),
        false,
      );
    } finally {
      await c.close();
    }
  });
  await test("Welcome dashboard, SVG replay and quiz continue offline without external requests", async () => {
    const { c, p } = await open();
    try {
      await skip(p);
      await setup(p, 4);
      await c.setOffline(true);
      await p.evaluate(() => switchView("welcome"));
      const beforeQuiz = await p.evaluate(() => JSON.stringify(state.groups));
      await p.locator('[data-quiz-answer="0"]').click();
      assert.ok((await p.locator(".ui-quiz-result").textContent()).length > 4);
      assert.equal(
        await p.evaluate(() => JSON.stringify(state.groups)),
        beforeQuiz,
      );
      await p.locator("#gpReplayIntro").click();
      await p.keyboard.press("Escape");
      await p.locator(".welcome-enter-btn").click();
      assert.equal(await p.locator("#view-battle").isVisible(), true);
      await p.evaluate(() => {
        state.groups.forEach((g) => (g.selectedOpt = "A"));
        state.correctAns = "A";
        judgeRound();
      });
      assert.deepEqual(
        await p.evaluate(() => state.groups.map((g) => g.score)),
        [102, 142, 182, 222],
      );
    } finally {
      await c.close();
    }
  });
} finally {
  await writeFile(
    "artifacts/welcome-completion/results.json",
    JSON.stringify(
      {
        baseline: "674e12f",
        sha256: createHash("sha256").update(html).digest("hex"),
        browser: browser.version(),
        zoomMethod: "application CSS zoom, not native browser zoom",
        results,
        errors,
        screenshots,
      },
      null,
      2,
    ),
  );
  await browser.close();
  await new Promise((r) => server.close(r));
}
console.log({
  pass: results.filter((r) => r.status === "PASS").length,
  fail: results.filter((r) => r.status === "FAIL").length,
  errors,
});
if (errors.length || results.some((r) => r.status === "FAIL"))
  process.exitCode = 1;
