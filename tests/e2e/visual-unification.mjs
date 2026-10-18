import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createServer } from "node:http";
import { createHash } from "node:crypto";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html");
const root =
  process.env.SURFACES_ARTIFACT_DIR || "artifacts/visual-unification";
await mkdir(`${root}/screenshots`, { recursive: true });
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
    results.push({ name, status: "PASS", evidence: await fn() });
    console.log("PASS", name);
  } catch (e) {
    results.push({ name, status: "FAIL", error: e.stack });
    console.error("FAIL", name, e.message);
  }
}
async function open(width = 1920, height = 1080, prefs = {}) {
  const c = await browser.newContext({ viewport: { width, height } });
  await c.addInitScript(
    (p) =>
      localStorage.setItem("godpower_ui_preferences_v1", JSON.stringify(p)),
    prefs,
  );
  const p = await c.newPage();
  p.on("pageerror", (e) => errors.push(e.message));
  p.setDefaultTimeout(30000);
  await p.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  return { c, p };
}
async function shot(p, n) {
  const path = `${root}/screenshots/${n}.png`;
  await p.screenshot({ path });
  return path;
}
try {
  await test("Startup: five actual tab animations descend with increasing delays; skip cancels and restores controls", async () => {
    const { c, p } = await open();
    try {
      await p.waitForFunction(() => WelcomeV2.getStatus().introBusy === false);
      // Pause only newly created nav WAAPI animations so CPU scheduling cannot
      // finish their short timelines before inspection. Escape must cancel them.
      await p.evaluate(() => {
        const original = Element.prototype.animate;
        window.restoreNavAnimationProbe = () => {
          Element.prototype.animate = original;
        };
        Element.prototype.animate = function (...args) {
          const animation = original.apply(this, args);
          if (this.matches(".app-topnav .nav-tab")) animation.pause();
          return animation;
        };
      });
      await p.locator("#gpSlideTrack").focus();
      await p.keyboard.press("End");
      await p.keyboard.press("Enter");
      const animations = await p.locator(".nav-tab").evaluateAll((els) =>
        els
          .map((el) =>
            el.getAnimations().map((a) => ({
              frames: a.effect.getKeyframes(),
              delay: a.effect.getTiming().delay,
            })),
          )
          .flat(),
      );
      assert.equal(animations.length, 5);
      for (let i = 0; i < 5; i++) {
        assert.ok(animations[i].frames[0].translate.includes("-22"));
        assert.equal(animations[i].delay, i * 75);
      }
      await p.evaluate(() => {
        restoreNavAnimationProbe();
        document.querySelectorAll(".nav-tab").forEach((tab) =>
          tab.getAnimations().forEach((a) => {
            a.currentTime = 260;
          }),
        );
      });
      const screenshot = await shot(p, "startup-tabs");
      await p.keyboard.press("Escape");
      await p.waitForFunction(() => WelcomeV2.getStatus().introFinished);
      assert.equal(
        await p
          .locator(".nav-tab")
          .evaluateAll((els) => els.flatMap((el) => el.getAnimations()).length),
        0,
      );
      assert.equal(
        await p.locator(".app-topnav").evaluate((el) => el.inert),
        false,
      );
      return { animations, screenshot };
    } finally {
      await c.close();
    }
  });
  await test("Startup motion-off creates no tab animation and leaves all tabs usable", async () => {
    const { c, p } = await open(1366, 768, { motion: "off" });
    try {
      await p.waitForFunction(() => WelcomeV2.getStatus().introFinished);
      assert.equal(
        await p
          .locator(".nav-tab")
          .evaluateAll((es) => es.flatMap((e) => e.getAnimations()).length),
        0,
      );
      await p.locator(".nav-tab[data-view=history]").click();
      assert.equal(await p.locator("#view-history").isVisible(), true);
    } finally {
      await c.close();
    }
  });
  for (const [width, height] of [
    [1366, 768],
    [1920, 1080],
    [2560, 1440],
  ]) {
    const { c, p } = await open(width, height);
    await setup(p, 14);
    try {
      for (const n of [0, 1, 40])
        await test(`History ${n} snapshots ${width}: visible diff, view-only state preservation, scroll`, async () => {
          await p.evaluate((n) => {
            historyStack = [];
            for (let i = 0; i < n; i++) {
              recordHistory("测试积分变化 · 很长的操作说明及小组名称 " + i);
              state.groups[0].score += 5;
            }
            switchView("history");
            renderAll();
          }, n);
          await p.waitForFunction(() => DesktopUI.getAnimationCount() === 0);
          assert.equal(await p.locator(".ui-history").count(), n);
          const before = await p.evaluate(() => JSON.stringify(state));
          if (n) {
            await p.locator(".ui-history summary").first().click();
            assert.equal(
              await p
                .locator(".ui-history")
                .first()
                .locator(".ui-table tbody tr")
                .count(),
              14,
            );
            assert.equal(await p.evaluate(() => JSON.stringify(state)), before);
          }
          assert.equal(await p.locator(".bottom-dock").isVisible(), false);
          const bounds = await p
            .locator("#view-history .ui-collection-body")
            .boundingBox();
          assert.ok(bounds.y >= 0 && bounds.y + bounds.height <= height + 1);
          return { screenshot: await shot(p, `history-${n}-${width}`), bounds };
        });
      for (const n of [0, 1, 24])
        await test(`Archives ${n} records ${width}: real stats, old fields, search, details`, async () => {
          await p.evaluate((n) => {
            STORAGE.setJSON(
              "politics_settlement_history",
              Array.from({ length: n }, (_, i) => ({
                title: "第" + (i + 1) + "届课堂竞技 · 较长的档案名称",
                time: "2026/10/17 09:00",
                champion: "青绿课堂冠军小组",
                groups: [
                  {
                    name: "青绿课堂冠军小组",
                    score: 99999999,
                    members: ["测试甲"],
                  },
                  { name: "并列分数组", score: 99999999 },
                  { name: "第三组", score: -10 },
                ],
              })),
            );
            switchView("archives");
            renderAll();
          }, n);
          await p.waitForFunction(() => DesktopUI.getAnimationCount() === 0);
          assert.equal(await p.locator(".ui-archive-card").count(), n);
          if (n) {
            await p.locator(".ui-archive-summary").first().click();
            assert.equal(
              await p
                .locator(".ui-archive-card")
                .first()
                .locator(".ui-podium>div")
                .count(),
              3,
            );
            assert.match(
              await p.locator("#archiveClassStats").textContent(),
              /99999999/,
            );
          }
          const screenshot = await shot(p, `archives-${n}-${width}`);
          if (n) {
            await p.locator("#uiArchiveSearch").fill("没有这样的比赛");
            assert.equal(await p.locator(".ui-archive-card").count(), 0);
            await p.locator("#uiArchiveSearch").fill("");
            assert.equal(await p.locator(".ui-archive-card").count(), n);
          }
          assert.equal(await p.locator(".bottom-dock").isVisible(), false);
          return { screenshot };
        });
      await test(`Chrome ${width}: dock exclusivity, card selection, dimensions, function surface tokens`, async () => {
        await setup(p, 14);
        await p.waitForFunction(() => DesktopUI.getAnimationCount() === 0);
        const sizes = await p
          .locator("#groupList .group-row-card")
          .evaluateAll((es) =>
            es.map((e) => ({ height: e.offsetHeight, width: e.offsetWidth })),
          );
        await p.locator("#groupList .opt-btn").first().click();
        assert.equal(await p.evaluate(() => state.groups[0].selectedOpt), "A");
        const r = await p.locator(".app-topnav").evaluate((e) => {
          const r = e.getBoundingClientRect();
          return { height: r.height, width: r.width };
        });
        assert.equal(r.height, 59);
        const screenshot = await shot(p, `battle-${width}`);
        await p.evaluate(() => openItemWindow(1));
        await p.waitForFunction(() => DesktopUI.getAnimationCount() === 0);
        assert.equal(
          await p
            .locator(".item-window")
            .evaluate((e) => getComputedStyle(e).borderRadius),
          "20px",
        );
        await p.keyboard.press("Escape");
        await p.waitForFunction(() => DesktopUI.getAnimationCount() === 0);
        for (const v of ["welcome", "history", "archives", "settings"]) {
          await p.evaluate((v) => switchView(v), v);
          assert.equal(await p.locator(".bottom-dock").isVisible(), false);
        }
        return { sizes, nav: r, screenshot };
      });
    } finally {
      await c.close();
    }
  }
  const { c, p } = await open();
  await setup(p);
  try {
    await test("Every group window tab, every about tab, and all picker modes share surfaces without state mutations", async () => {
      const before = await p.evaluate(() => JSON.stringify(state.groups)),
        screens = [];
      await p.evaluate(() => openItemWindow(1));
      for (const tab of ["detail", "items", "score"]) {
        await p.locator(`[data-item-tab="${tab}"]`).click();
        await p.waitForFunction(() => DesktopUI.getAnimationCount() === 0);
        screens.push(await shot(p, `group-window-${tab}`));
      }
      await p.keyboard.press("Escape");
      await p.evaluate(() => openAbout());
      for (const tab of ["info", "guide", "items"]) {
        await p.locator(`[data-about="${tab}"]`).click();
        await p.waitForFunction(() => DesktopUI.getAnimationCount() === 0);
        screens.push(await shot(p, `about-${tab}`));
      }
      await p.keyboard.press("Escape");
      await p.evaluate(() => openPickerModal());
      for (const mode of ["Ind", "Grp", "Two"]) {
        await p.locator(`#btnMode${mode}`).click();
        await p.waitForFunction(() => DesktopUI.getAnimationCount() === 0);
        screens.push(await shot(p, `picker-${mode}`));
      }
      await p.keyboard.press("Escape");
      assert.equal(
        await p.evaluate(() => JSON.stringify(state.groups)),
        before,
      );
      return { screens };
    });
    await test("Confirmation window nested above a function window: toast, focus, Escape and cleanup", async () => {
      await p.evaluate(() => {
        openItemWindow(1);
        void themeConfirm("测试危险操作，取消不影响积分", {
          danger: true,
          title: "测试确认",
        });
      });
      await p.waitForFunction(() => DesktopUI.getAnimationCount() === 0);
      await p.evaluate(() => showToast("提示始终置顶"));
      assert.equal(
        await p.locator("#toast").evaluate((e) => e.matches(":popover-open")),
        true,
      );
      const screenshot = await shot(p, "confirmation");
      await p.keyboard.press("Escape");
      assert.equal(await p.locator("#itemModalBackdrop").isVisible(), true);
      await p.keyboard.press("Escape");
      await p.waitForFunction(() => DesktopUI.getAnimationCount() === 0);
      assert.equal(await p.locator("[data-ui-modal-open=true]").count(), 0);
      return { screenshot };
    });
  } finally {
    await c.close();
  }
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
  console.log({
    pass: results.filter((x) => x.status === "PASS").length,
    fail: results.filter((x) => x.status === "FAIL").length,
    errors,
  });
  if (results.some((x) => x.status === "FAIL") || errors.length)
    process.exitCode = 1;
}
