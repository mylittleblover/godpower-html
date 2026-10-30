import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createServer } from "node:http";
import { launch, setup, dismissStartup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html");
const server = createServer((q, s) => {
  s.setHeader("Content-Type", "text/html;charset=utf-8");
  s.setHeader("Cache-Control", "no-store");
  s.end(html);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch(),
  results = [],
  errors = [],
  screenshots = [];
await mkdir("artifacts/desktop-ui", { recursive: true });
const url = `http://127.0.0.1:${server.address().port}`;
async function test(name, fn) {
  try {
    const evidence = await fn();
    results.push({ name, status: "PASS", evidence });
    console.log("PASS", name);
  } catch (e) {
    results.push({ name, status: "FAIL", error: e.stack });
    console.log("FAIL", name, e.message);
  }
}
async function open(viewport = { width: 1920, height: 1080 }) {
  const context = await browser.newContext({ viewport }),
    p = await context.newPage();
  await context.route("**/*", (r) => r.continue());
  p.setDefaultTimeout(30000);
  p.on("pageerror", (e) => errors.push({ message: e.message, stack: e.stack }));
  await p.goto(url, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(650);
  await setup(p, 4);
  return { context, p };
}
async function shot(p, name) {
  const path = `artifacts/desktop-ui/${name}.png`;
  await p.screenshot({ path, fullPage: false });
  screenshots.push(path);
}
try {
  const { context, p } = await open();
  await test("UI boot and five-page dock isolation (including programmatic stale-button clicks)", async () => {
    assert.equal(await p.locator("#uiSettingsShell").count(), 1);
    for (const view of [
      "welcome",
      "history",
      "archives",
      "settings",
      "battle",
    ]) {
      await p.evaluate((v) => switchView(v), view);
      await p.waitForTimeout(200);
      assert.equal(
        await p.locator(".bottom-dock").isVisible(),
        view === "battle",
      );
      if (view !== "battle") {
        const r = await p.evaluate(() => {
          const before = JSON.stringify(state);
          document.querySelector("#btnMainAction").click();
          document.querySelector(".ans-btn").click();
          return before === JSON.stringify(state);
        });
        assert.equal(r, true);
      }
    }
  });
  await test("Toast stays in native top layer above functional and confirmation modals", async () => {
    await p.evaluate(() => {
      switchView("battle");
      openPickerModal();
      showToast("全局置顶测试");
    });
    assert.equal(
      await p.locator("#toast").evaluate((e) => e.matches(":popover-open")),
      true,
    );
    await p.evaluate(() => {
      void themeConfirm("确认层测试");
    });
    await p.evaluate(() => showToast("确认层之上的提示"));
    assert.equal(
      await p.locator("#toast").evaluate((e) => e.matches(":popover-open")),
      true,
    );
    assert.ok((await p.locator("#toast").boundingBox()).width > 0);
    await shot(p, "toast-over-confirmation");
    await p.evaluate(() => {
      closeThemeDialogV21727(false);
      closePickerModal();
    });
  });
  for (const count of [0, 1, 2, 4, 8, 16])
    await test(`Welcome ${count} real groups, long names and large scores`, async () => {
      await setup(p, Math.max(count, 1));
      await p.evaluate((n) => {
        if (n === 0) state.groups = [];
        else {
          state.groups[0].name = "特别长的小组名称 · 在欢迎页应当完整换行显示";
          state.groups[0].score = 123456789;
          state.groups[0].displayScore = 123456789;
        }
        switchView("welcome");
        renderAll();
      }, count);
      await p.waitForTimeout(150);
      assert.equal(await p.locator(".ui-group-card").count(), count);
      if (count) {
        await p.locator(".ui-group-card").first().click();
        assert.equal(await p.locator("#itemModalBackdrop").isVisible(), true);
        await p.evaluate(() => closeItemWindow());
      }
      const overflow = await p
        .locator("#uiGroupTrack")
        .evaluate((e) => e.scrollWidth > e.clientWidth + 2);
      assert.equal(await p.locator("#uiGroupNext").isEnabled(), overflow);
      if (overflow) {
        await p.locator("#uiGroupNext").click();
        await p.waitForTimeout(600);
        assert.ok(
          await p.locator("#uiGroupTrack").evaluate((e) => e.scrollLeft > 0),
        );
      }
      if (count === 16) await shot(p, "welcome-16-groups");
      return { overflow };
    });
  await test("Daily quiz answer/explanation match; formal state remains unchanged", async () => {
    await setup(p);
    await p.evaluate(() => switchView("welcome"));
    const content = await p.locator("#uiDailyGrid").textContent();
    const before = await p.evaluate(() =>
      JSON.stringify({ groups: state.groups, history: historyStack }),
    );
    await p.locator('[data-quiz-answer="0"]').click();
    assert.ok((await p.locator(".ui-quiz-result").textContent()).length > 4);
    assert.equal(
      await p.evaluate(() =>
        JSON.stringify({ groups: state.groups, history: historyStack }),
      ),
      before,
    );
    await p.reload({ waitUntil: "domcontentloaded", timeout: 90000 });
    await dismissStartup(p);
    await p.waitForTimeout(700);
    assert.equal(await p.locator("#uiDailyGrid").textContent(), content);
  });
  // Keep each failure isolated; subsequent checks regenerate synthetic state.
  for (const count of [0, 1, 40])
    await test(`History ${count} snapshots and genuine score/inventory differences`, async () => {
      await setup(p);
      await p.evaluate((n) => {
        historyStack = [];
        for (let i = 0; i < n; i++) {
          recordHistory(
            `第 ${i + 1} 次积分与道具操作 · 较长操作描述用于桌面时间轴检查`,
          );
          state.groups[0].score += 2;
          state.groups[0].inventory =
            i % 2 ? [{ key: "coin", charges: 1 }] : [];
        }
        switchView("history");
      }, count);
      assert.equal(await p.locator(".ui-history").count(), count);
      if (count) {
        await p
          .locator(".ui-history details")
          .first()
          .locator("summary")
          .click();
        await p.locator("[data-restore]").first().click();
        assert.equal(await p.locator("#themeDialogV21727").isVisible(), true);
        await shot(p, `history-${count}-restore-confirm`);
        await p.evaluate(() => closeThemeDialogV21727(false));
        assert.equal(await p.evaluate(() => historyStack.length), count);
      }
      await shot(p, `history-${count}`);
    });
  await test("History restore retains exact original pre-action semantics", async () => {
    await setup(p);
    await p.evaluate(() => {
      recordHistory("加分前");
      state.groups[0].score += 9;
      recordHistory("第二次加分前");
      state.groups[0].score += 8;
      switchView("history");
    });
    await p.locator(".ui-history details").first().locator("summary").click();
    await p.locator('[data-restore="1"]').click();
    await p.locator("#themeDialogActionsV21727 .danger").click();
    assert.equal(await p.evaluate(() => state.groups[0].score), 109);
    assert.equal(await p.evaluate(() => historyStack.length), 1);
  });
  await test("All eight setting categories expose preserved controls; preferences persist", async () => {
    await setup(p);
    await p.evaluate(() => switchView("settings"));
    const controls = [];
    for (const id of [
      "rules",
      "appearance",
      "motion",
      "sound",
      "items",
      "students",
      "welcome",
      "data",
    ]) {
      await p.locator(`[data-category="${id}"]`).click();
      assert.equal(
        await p.locator(`[data-category-panel="${id}"]`).isVisible(),
        true,
      );
      controls.push(
        ...(await p
          .locator(
            `[data-category-panel="${id}"] input,[data-category-panel="${id}"] select,[data-category-panel="${id}"] textarea,[data-category-panel="${id}"] button`,
          )
          .evaluateAll((es) =>
            es.map((e) => ({
              id: e.id,
              type: e.type,
              text: e.textContent.slice(0, 80),
              handler:
                e.getAttribute("onclick") ||
                e.getAttribute("onchange") ||
                e.getAttribute("oninput"),
            })),
          )),
      );
      await shot(p, "settings-" + id);
    }
    await writeFile(
      "artifacts/desktop-ui/settings-controls.json",
      JSON.stringify(controls, null, 2),
    );
    const before = JSON.parse(
      await readFile("artifacts/ui-baseline/settings-controls.json", "utf8"),
    );
    const important = before.filter(
      (x) => x.id && !/^settingsV26Tabs/.test(x.id),
    );
    const ids = await p
      .locator("#view-settings [id]")
      .evaluateAll((es) => es.map((e) => e.id));
    for (const c of important)
      assert.ok(ids.includes(c.id), `missing existing control ${c.id}`);
    await p.locator('[data-category="motion"]').click();
    await p.locator("#uiPref-motion").selectOption("simple");
    await p.locator("#uiPref-speed").selectOption("1.5");
    await p.reload({ waitUntil: "domcontentloaded", timeout: 90000 });
    await dismissStartup(p);
    await p.waitForTimeout(700);
    await dismissStartup(p);
    assert.equal(
      await p.evaluate(() => DesktopUI.getPreferences().motion),
      "simple",
    );
    assert.equal(await p.evaluate(() => DesktopUI.getPreferences().speed), 1.5);
    return {
      originalControls: before.length,
      currentControls: controls.length,
    };
  });
  await test("Local bank rejects malformed JSON without changing saved content; category toggle works", async () => {
    await p.evaluate(() => switchView("settings"));
    await p.locator('[data-category="welcome"]').click();
    await p.locator("#uiSettingsBank > summary").click();
    await p.locator("#uiBankEditor").fill("{invalid");
    await p.locator("#uiSaveBank").click();
    assert.match(await p.locator("#uiBankStatus").textContent(), /未保存/);
    assert.equal(
      await p.evaluate(() => localStorage.getItem("godpower_ui_bank_v1")),
      null,
    );
    await p.locator("#uiPref-knowledge").uncheck();
    await p.evaluate(() => switchView("welcome"));
    assert.equal(await p.locator("#uiDailyGrid article").count(), 3);
    await p.evaluate(() => switchView("settings"));
    await p.locator('[data-category="welcome"]').click();
    await p.locator("#uiPref-knowledge").check();
  });
  for (const count of [0, 1, 24])
    await test(`Archives ${count} events, original ties/order and incomplete legacy fields`, async () => {
      await setup(p);
      await p.evaluate((n) => {
        STORAGE.setJSON(
          "politics_settlement_history",
          Array.from({ length: n }, (_, i) => ({
            title: `第${i + 1}届长名称课堂竞技档案`,
            time: "2026/10/16 10:00:00",
            champion: "冠军甲",
            groups:
              i % 2
                ? [
                    { name: "旧版同分甲", score: 500, members: [] },
                    { name: "旧版同分乙", score: 500 },
                  ]
                : [
                    {
                      name: "冠军甲",
                      score: 9999999,
                      members: ["张三", "李四"],
                    },
                    { name: "第二名", score: -100, members: [] },
                  ],
          })),
        );
        switchView("archives");
      }, count);
      assert.equal(await p.locator(".ui-archive-list>article").count(), count);
      if (count) {
        await p.locator(".ui-archive-summary").first().click();
        assert.match(
          await p.locator(".ui-podium").first().textContent(),
          /第 1 名/,
        );
        const download = p.waitForEvent("download");
        await p.locator("[data-csv]").first().click();
        await (
          await download
        ).saveAs(`artifacts/desktop-ui/archive-${count}.csv`);
        await p.locator("#uiArchiveSearch").fill("不存在的档案");
        assert.equal(await p.locator(".ui-archive-list>article").count(), 0);
        await p.locator("#uiArchiveSearch").fill("");
        await p.locator("#uiArchiveSort").selectOption("old");
      }
      await shot(p, `archives-${count}`);
    });
  await test("Picker all three modes, stop results and exact target reward", async () => {
    for (const mode of ["individual", "group", "two_tier"]) {
      await setup(p);
      await p.evaluate((mode) => {
        switchView("battle");
        openPickerModal();
        setPickerMode(mode);
      }, mode);
      assert.equal(
        await p.locator('button[onclick="scorePickerTarget(1)"]').isDisabled(),
        true,
      );
      await p.locator("#btnSlotTrigger").click();
      await p.waitForFunction(() => slotEngine.isSpinning);
      await p.locator("#btnSlotTrigger").click();
      await p.waitForFunction(() => !slotEngine.isSpinning);
      const result = await p.evaluate(() => ({
        id: pickerTargetGroup().id,
        score: pickerTargetGroup().score,
      }));
      await p.locator('button[onclick="scorePickerTarget(1)"]').click();
      assert.equal(
        await p.evaluate(
          (id) => state.groups.find((g) => g.id === id).score,
          result.id,
        ),
        result.score + 1,
      );
      await shot(p, "picker-" + mode);
      await p.keyboard.press("Escape");
      await p.waitForFunction(
        () =>
          !document.querySelector("#pickerModal")?.classList.contains("active"),
      );
      assert.equal(await p.locator("#pickerModal").isVisible(), false);
    }
  });
  await test("All actual item definitions render main/secondary queues, real descriptions and visual event cleanup", async () => {
    await setup(p);
    const keys = await p.evaluate(() => Object.keys(ITEM_DEFS));
    for (const key of keys) {
      await p.evaluate((key) => {
        const g = state.groups[0];
        g.inventory = [
          { key, charges: ITEM_DEFS[key].charges },
          { key: key === "coin" ? "banana" : "coin", charges: 1 },
        ];
        g.itemUsedThisRound = false;
        g.itemEffect = null;
        openItemWindow(g.id, "items");
      }, key);
      assert.equal(
        await p.locator(".queue-main-card .item-big-name").count(),
        1,
      );
      assert.equal(
        await p.locator(".queue-secondary-card button").first().isDisabled(),
        true,
      );
      assert.ok(
        (await p.locator(".queue-main-card .item-big-desc").textContent())
          .length > 0,
      );
      await p.evaluate((key) => {
        closeItemWindow();
        DesktopUI.visualEvent("ITEM_USE_START", { groupId: 1, key });
        DesktopUI.visualEvent("ITEM_HIT", { groupId: 2, key });
        DesktopUI.visualEvent("ITEM_DEFENDED", { groupId: 3, key });
      }, key);
    }
    await p.evaluate(() => switchView("welcome"));
    // The requested layered page entrance now has several finite animations.
    // Wait for that entrance, then retain the strict zero-residual assertion.
    await p.waitForFunction(() => DesktopUI.getAnimationCount() === 0, null, {
      timeout: 5000,
    });
    assert.equal(await p.evaluate(() => DesktopUI.getAnimationCount()), 0);
    return { itemDefinitions: keys };
  });
  await test("Modal keyboard focus, nested Escape and reopen/close cleanup", async () => {
    await setup(p);
    await p.evaluate(() => {
      switchView("battle");
      openPickerModal();
    });
    await p.waitForTimeout(80);
    assert.equal(
      await p.evaluate(() =>
        document.querySelector("#pickerModal").contains(document.activeElement),
      ),
      true,
    );
    await p.evaluate(() => {
      void themeConfirm("嵌套确认");
    });
    await p.waitForTimeout(80);
    await p.keyboard.press("Escape");
    await p.waitForFunction(
      () =>
        !document
          .querySelector("#themeDialogV21727")
          ?.classList.contains("active"),
    );
    assert.equal(await p.locator("#themeDialogV21727").isVisible(), false);
    assert.equal(await p.locator("#pickerModal").isVisible(), true);
    await p.keyboard.press("Escape");
    await p.waitForFunction(
      () =>
        !document.querySelector("#pickerModal")?.classList.contains("active"),
    );
    assert.equal(await p.locator("#pickerModal").isVisible(), false);
    for (let i = 0; i < 10; i++) {
      await p.evaluate(() => {
        openItemWindow(1);
        closeItemWindow();
      });
    }
    await p.waitForFunction(
      () =>
        document.querySelectorAll('[data-ui-modal-open="true"]').length === 0,
    );
    assert.equal(await p.locator("[data-ui-modal-open=true]").count(), 0);
  });
  await context.close();
  // Desktop acceptance uses CSS application zoom, recorded separately from browser UI zoom.
  for (const [width, height] of [[1920, 1080]])
    for (const zoom of [1]) {
      const { context, p } = await open({ width, height });
      await test(`Desktop ${width}x${height} app zoom ${zoom} five pages bounds/navigation`, async () => {
        await p.evaluate((z) => {
          applyZoom(z);
        }, zoom);
        for (const view of [
          "welcome",
          "battle",
          "history",
          "archives",
          "settings",
        ]) {
          await p.locator(`.nav-tab[data-view="${view}"]`).click();
          await p.waitForTimeout(200);
          const r = await p.evaluate(() => ({
            scroll: document.documentElement.scrollWidth,
            viewport: innerWidth,
            nav: [...document.querySelectorAll(".nav-tab")].map((e) => {
              const r = e.getBoundingClientRect();
              return { x: r.x, y: r.y, right: r.right, bottom: r.bottom };
            }),
            header: document
              .querySelector(".app-topnav")
              .getBoundingClientRect()
              .toJSON(),
          }));
          assert.ok(r.scroll <= r.viewport + 2, JSON.stringify(r));
          assert.ok(
            r.nav.every(
              (n) =>
                n.x >= 0 && n.right <= width && n.bottom <= r.header.bottom + 1,
            ),
            JSON.stringify(r),
          );
          if (view !== "battle")
            assert.equal(await p.locator(".bottom-dock").isVisible(), false);
          await shot(p, `${view}-${width}-zoom${zoom}`);
        }
      });
      await context.close();
    }
  await test("No uncaught browser errors across complete desktop acceptance", async () =>
    assert.deepEqual(errors, []));
} finally {
  await browser.close();
  server.close();
  await writeFile(
    "artifacts/desktop-ui/results.json",
    JSON.stringify(
      {
        browser: "Chromium",
        zoomMethod:
          "existing applyZoom (CSS body zoom), not browser chrome UI zoom",
        results,
        errors,
        screenshots,
      },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify({
      pass: results.filter((x) => x.status === "PASS").length,
      fail: results.filter((x) => x.status === "FAIL").length,
    }),
  );
  if (results.some((x) => x.status === "FAIL")) process.exitCode = 1;
}
