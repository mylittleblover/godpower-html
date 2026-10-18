import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { launch, setup, dismissStartup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html");
const server = createServer((q, s) => {
  s.setHeader("Content-Type", "text/html;charset=utf-8");
  s.setHeader("Cache-Control", "no-store");
  s.end(html);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch(),
  context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
  }),
  p = await context.newPage(),
  results = [],
  errors = [];
p.on("pageerror", (e) => errors.push(e.message));
await mkdir("artifacts/desktop-ui", { recursive: true });
await p.goto("http://127.0.0.1:" + server.address().port, {
  waitUntil: "domcontentloaded",
});
await p.waitForTimeout(600);
async function test(name, fn) {
  try {
    await setup(p);
    await fn();
    results.push({ name, status: "PASS" });
    console.log("PASS", name);
  } catch (e) {
    results.push({ name, status: "FAIL", error: e.stack });
    console.log("FAIL", name, e.message);
    await p
      .evaluate(() => {
        closeThemeDialogV21727(false);
        closePickerModal();
        closeGrandSettlementModal();
      })
      .catch(() => {});
  }
}
try {
  await test("Stable settings navigation and all eight panel scroll bounds at minimum desktop", async () => {
    await p.evaluate(() => switchView("settings"));
    const positions = [];
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
      await p.locator(`[data-category="${category}"]`).click();
      positions.push(await p.locator(".ui-settings-nav").boundingBox());
      const bounds = await p.locator(".ui-settings-body").boundingBox();
      assert.ok(bounds.y + bounds.height <= 768, JSON.stringify(bounds));
      await p
        .locator(".ui-settings-body")
        .evaluate((e) => (e.scrollTop = e.scrollHeight));
      await p.screenshot({
        path: `artifacts/desktop-ui/settings-min-${category}.png`,
      });
    }
    assert.ok(positions.every((x) => Math.abs(x.x - positions[0].x) < 1));
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
  ];
  for (const [id, fn, arg] of modals)
    await test("Modal bounds, focus and Escape: " + id, async () => {
      await p.evaluate(({ fn, arg }) => window[fn](arg), { fn, arg });
      await p.waitForTimeout(150);
      const root = p.locator("#" + id);
      assert.equal(await root.isVisible(), true);
      assert.equal(
        await root.evaluate((e) => e.contains(document.activeElement)),
        true,
      );
      await p.screenshot({ path: `artifacts/desktop-ui/modal-${id}.png` });
      await p.keyboard.press("Escape");
      await root.waitFor({ state: "hidden" });
      assert.equal(await root.isVisible(), false);
    });
  await test("Score input rejects invalid integer without changing state and accepts signed score", async () => {
    const original = await p.evaluate(() => state.groups[0].score);
    await p.evaluate(() => openScoreModal(1));
    await p.locator("#modalCustomInput").fill("1.5");
    await p.locator("#modalCustomInput").press("Enter");
    assert.equal(await p.evaluate(() => state.groups[0].score), original);
    assert.ok(await p.locator("#scoreModalError").textContent());
    await p.locator("#modalCustomInput").fill("-5");
    await p.locator("#modalCustomInput").press("Enter");
    assert.equal(await p.evaluate(() => state.groups[0].score), original - 5);
  });
  await test("All item UI states and real use/hit/defense animations: 26 definitions", async () => {
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
        openItemWindow(1, "items");
      }, key);
      assert.equal(
        await p.locator(".queue-main-card .item-big-name").count(),
        1,
      );
      assert.equal(
        await p.locator(".queue-secondary-card button").first().isDisabled(),
        true,
      );
      await p.evaluate((key) => {
        closeItemWindow();
        playCasterCardFx(key, 1);
        playAttackTargetFxV2116(2, key);
        playTargetCardFx(3, key, "defend");
      }, key);
      if (
        [
          "green",
          "fire_flower",
          "ice_flower",
          "lightning",
          "star",
          "mega",
          "boo",
          "blooper",
          "bomb",
          "boomerang_flower",
        ].includes(key)
      )
        await p.screenshot({ path: `artifacts/desktop-ui/item-${key}.png` });
      await p.evaluate(() => DesktopUI.cancelAnimations());
      assert.equal(
        await p
          .locator(".card-fx-badge,.attack-hit-badge-v2116,.bm-layer")
          .count(),
        0,
        JSON.stringify(
          await p
            .locator(".bm-layer,.card-fx-badge,.attack-hit-badge-v2116")
            .evaluateAll((nodes) =>
              nodes.map((el) => ({
                class: el.className,
                key: el.dataset.bmKey,
                kind: el.dataset.kind,
                label: el.textContent,
              })),
            ),
        ),
      );
    }
    assert.equal(keys.length, 26);
  });
  await test("Animation preferences genuinely disable current item FX and clean interruptions", async () => {
    await p.evaluate(() => switchView("settings"));
    await p.locator('[data-category="motion"]').click();
    await p.locator("#uiPref-motion").selectOption("off");
    await p.evaluate(() => {
      switchView("battle");
      playCasterCardFx("fire_flower", 1);
      playAttackTargetFxV2116(2, "ice_flower");
      playTargetCardFx(3, "green", "defend");
    });
    assert.equal(
      await p
        .locator(".card-fx-badge,.attack-hit-badge-v2116,.bm-layer")
        .count(),
      0,
    );
    assert.equal(await p.evaluate(() => DesktopUI.getAnimationCount()), 0);
    await p.evaluate(() => switchView("settings"));
    await p.locator('[data-category="motion"]').click();
    await p.locator("#uiPref-motion").selectOption("full");
  });
  await test("Final settlement UI cannot clear on archive failure; success persists then skip only stops celebration", async () => {
    const before = await p.evaluate(() => {
      triggerFinalSettlement();
      const old = Storage.prototype.setItem;
      window.uiOriginalSetItem = old;
      Storage.prototype.setItem = function (k, v) {
        if (k === "politics_settlement_history")
          throw Error("injected archive quota");
        return old.call(this, k, v);
      };
      return JSON.stringify(state.groups);
    });
    await p
      .locator('#settlementNameModal button[onclick^="DesktopUI.settleFromUI"]')
      .click();
    await p.waitForFunction(
      () => !document.querySelector("#settlementNameModal [aria-busy=true]"),
    );
    assert.equal(await p.evaluate(() => JSON.stringify(state.groups)), before);
    await p.locator("#grandModalOverlay").waitFor({ state: "hidden" });
    assert.equal(await p.locator("#grandModalOverlay").isVisible(), false);
    await p.evaluate(() => {
      Storage.prototype.setItem = window.uiOriginalSetItem;
      closeThemeDialogV21727(false);
      triggerFinalSettlement();
    });
    await p
      .locator('#settlementNameModal button[onclick^="DesktopUI.settleFromUI"]')
      .click();
    await p.waitForFunction(() =>
      document.querySelector("#grandModalOverlay").classList.contains("active"),
    );
    assert.equal(await p.evaluate(() => getSettlementHistory().length), 1);
    assert.equal(
      await p.evaluate(() => state.groups.every((g) => g.score === 0)),
      true,
    );
    await p.screenshot({ path: "artifacts/desktop-ui/settlement-success.png" });
    await p.keyboard.press("Escape");
    await p.locator("#grandModalOverlay").waitFor({ state: "hidden" });
    assert.equal(await p.locator("#grandModalOverlay").isVisible(), false);
    assert.equal(await p.evaluate(() => getSettlementHistory().length), 1);
  });
  await test("Welcome score masking and ghost/feather status survive UI redesign and expire", async () => {
    await p.evaluate(() => {
      state.groups[0].booRoundsLeftV218 = 2;
      state.groups[1].itemEffect = { featherDodge: 1 };
      state.itemGlobal.blooperUntil = Date.now() + 20000;
      switchView("welcome");
      renderAll();
    });
    assert.ok(
      (await p.locator(".ui-group-card").first().textContent()).includes(
        "幽灵保护",
      ),
    );
    assert.ok(
      (await p.locator(".ui-group-card").nth(1).textContent()).includes(
        "羽毛闪避",
      ),
    );
    assert.equal(
      await p.locator(".ui-group-score").first().textContent(),
      "???",
    );
    assert.equal(
      await p
        .locator("#wTotalScore")
        .evaluate((e) => e.classList.contains("squid-hidden-score")),
      true,
    );
    await p.evaluate(() => {
      state.itemGlobal.blooperUntil = 0;
      applyBlooperMask();
      updateWelcomeClock();
    });
    assert.equal(
      await p.locator(".ui-group-score").first().textContent(),
      "100",
    );
    assert.equal(
      await p
        .locator("#wTotalScore")
        .evaluate((e) => e.classList.contains("squid-hidden-score")),
      false,
    );
  });
  await test("Custom navigation/dock icons preserve text, reset to SVG and survive startup", async () => {
    await p.evaluate(() => {
      const image =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jUTkAAAAASUVORK5CYII=";
      STORAGE.setJSON("politics_ui_icons_v26", {
        nav_welcome: image,
        dock_picker: image,
        dock_lock: image,
      });
      applyUiIconsV26();
      renderLockStatus();
    });
    assert.equal(
      await p.locator('.nav-tab[data-view="welcome"] .custom-ui-icon').count(),
      1,
    );
    assert.match(
      await p.locator('.nav-tab[data-view="welcome"]').textContent(),
      /欢迎/,
    );
    assert.match(
      await p.locator('button[onclick="openPickerModal()"]').textContent(),
      /点名/,
    );
    assert.equal(await p.locator("#lockBtn .custom-ui-icon").count(), 1);
    const navigation = p.waitForNavigation({
        waitUntil: "domcontentloaded",
        timeout: 90000,
      }),
      session = await context.newCDPSession(p);
    await session.send("Page.reload", { ignoreCache: true });
    await navigation;
    await session.detach();
    await p.waitForTimeout(300);
    await dismissStartup(p);
    assert.equal(
      await p.locator('.nav-tab[data-view="welcome"] .custom-ui-icon').count(),
      1,
    );
    assert.equal(
      await p
        .locator('button[onclick="openPickerModal()"] .custom-ui-icon')
        .count(),
      1,
    );
    await p.evaluate(() => resetUiIconV26("nav_welcome"));
    assert.equal(
      await p.locator('.nav-tab[data-view="welcome"] svg.ui-icon').count(),
      1,
    );
    assert.match(
      await p.locator('.nav-tab[data-view="welcome"]').textContent(),
      /欢迎/,
    );
    await p.evaluate(() => {
      resetUiIconV26("dock_picker");
      resetUiIconV26("dock_lock");
    });
  });
  await test("Cancelling and immediately reopening queued settlement never executes stale save", async () => {
    const result = await p.evaluate(async () => {
      triggerFinalSettlement();
      const before = JSON.stringify(state.groups),
        archives = getSettlementHistory().length;
      const pending = DesktopUI.settleFromUI(
        document.querySelector(
          '#settlementNameModal button[onclick^="DesktopUI.settleFromUI"]',
        ),
      );
      closeSettlementNameModal();
      triggerFinalSettlement();
      const result = await pending;
      return {
        result,
        unchanged: before === JSON.stringify(state.groups),
        archivesUnchanged: archives === getSettlementHistory().length,
        open: document
          .querySelector("#settlementNameModal")
          .classList.contains("active"),
        status: document.querySelector("#uiSettlementStatus").textContent,
      };
    });
    assert.equal(result.result.reason, "cancelled");
    assert.equal(result.unchanged, true);
    assert.equal(result.archivesUnchanged, true);
    assert.equal(result.open, true);
    assert.match(result.status, /先完整归档/);
    await p.evaluate(() => closeSettlementNameModal());
  });
  await test("Slow picker audio preparation cannot start a closed/reopened or changed-mode window", async () => {
    const result = await p.evaluate(async () => {
      openPickerModal();
      const original = getAudioContext,
        context = await original();
      let release;
      getAudioContext = () =>
        new Promise((resolve) => (release = () => resolve(context)));
      try {
        const pending = DesktopUI.togglePicker();
        const duplicate = await DesktopUI.togglePicker();
        closePickerModal();
        openPickerModal();
        release();
        const closed = await pending;
        let releaseMode;
        getAudioContext = () =>
          new Promise((resolve) => (releaseMode = () => resolve(context)));
        const stale = DesktopUI.togglePicker();
        setPickerMode("group");
        releaseMode();
        await stale;
        return {
          duplicate,
          closed,
          spinning: slotEngine.isSpinning,
          target: slotEngine.chosenResult,
          enabled: !document.querySelector("#btnSlotTrigger").disabled,
          mode: state.picker.mode,
        };
      } finally {
        getAudioContext = original;
        closePickerModal();
      }
    });
    assert.equal(result.duplicate, false);
    assert.equal(result.closed, false);
    assert.equal(result.spinning, false);
    assert.equal(result.target, null);
    assert.equal(result.enabled, true);
    assert.equal(result.mode, "group");
  });
  await test("Legacy archive missing/null/empty scores cannot invent a zero highest score", async () => {
    await p.evaluate(() => {
      STORAGE.setJSON("politics_settlement_history", [
        {
          title: "不完整旧档案",
          time: "时间未完整记录",
          groups: [
            { name: "甲", score: null },
            { name: "乙", score: -10 },
            { name: "丙", score: "" },
            { name: "丁" },
          ],
        },
      ]);
      switchView("archives");
    });
    const highest = await p
      .locator("#archiveClassStats .ui-panel")
      .nth(2)
      .locator("strong")
      .textContent();
    assert.equal(highest, "-10");
    await p.locator(".ui-archive-summary").click();
    assert.match(await p.locator(".ui-table").textContent(), /未记录/);
  });
  await test("All supplemental interactions have no uncaught errors", async () =>
    assert.deepEqual(errors, []));
} finally {
  await browser.close();
  server.close();
  await writeFile(
    "artifacts/desktop-ui/interactions.json",
    JSON.stringify({ results, errors }, null, 2),
  );
  console.log({
    pass: results.filter((x) => x.status === "PASS").length,
    fail: results.filter((x) => x.status === "FAIL").length,
  });
  if (results.some((x) => x.status === "FAIL")) process.exitCode = 1;
}
