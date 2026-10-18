import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { launch, setup, dismissStartup } from "../fixtures/browser.mjs";
const root = "artifacts/settings-cleanup",
  html = await readFile("dist/godpower.html"),
  baseline = JSON.parse(await readFile(`${root}/before/inventory.json`));
const server = createServer((q, s) => {
  s.setHeader("Content-Type", "text/html;charset=utf-8");
  s.end(html);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch(),
  url = `http://127.0.0.1:${server.address().port}`,
  results = [],
  errors = [];
await mkdir(`${root}/screenshots`, { recursive: true });
async function open(width = 1920, height = 1080) {
  const c = await browser.newContext({
      viewport: { width, height },
      acceptDownloads: true,
    }),
    p = await c.newPage();
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
  await setup(p);
  await p.evaluate(() => switchView("settings"));
  await p.waitForTimeout(350);
  await p.waitForFunction(() => DesktopUI.getSettingsMotionCount() === 0);
  return { c, p };
}
async function test(name, fn) {
  if (process.env.SETTINGS_CASE && !name.includes(process.env.SETTINGS_CASE))
    return;
  try {
    const evidence = await fn();
    results.push({ name, status: "PASS", evidence });
    console.log("PASS", name);
  } catch (e) {
    results.push({ name, status: "FAIL", error: e.stack });
    console.error("FAIL", name, e.message);
  }
}
async function category(p, id) {
  await p.locator(`[data-category="${id}"]`).click();
  await p.waitForFunction(() => DesktopUI.getSettingsMotionCount() === 0);
}
async function expand(p, id) {
  if (!(await p.locator("#" + id).evaluate((e) => e.open)))
    await p.locator(`#${id} > summary`).click();
}
const categories = [
  "rules",
  "appearance",
  "motion",
  "sound",
  "items",
  "students",
  "welcome",
  "data",
];
try {
  await test("Settings entry and category staggered motion, rapid switching, Escape and reduced-motion cleanup", async () => {
    const { c, p } = await open();
    try {
      await p.locator('.nav-tab[data-view="welcome"]').click();
      await p.locator('.nav-tab[data-view="settings"]').click();
      const entry = await p.evaluate(() =>
        document
          .getAnimations()
          .filter((a) => a.effect?.target?.closest("#view-settings"))
          .map((a) => ({
            target: a.effect.target.className,
            delay: a.effect.getTiming().delay,
            frames: a.effect.getKeyframes(),
          })),
      );
      assert.ok(entry.some((a) => a.target === "ui-settings-header"));
      assert.ok(entry.some((a) => a.target === "ui-settings-nav"));
      assert.ok(entry.some((a) => a.delay > 0));
      assert.ok(entry.every((a) => JSON.stringify(a.frames).includes("-12px")));
      await p.screenshot({ path: `${root}/screenshots/motion-entry.png` });
      await p.locator('[data-category="sound"]').click();
      assert.equal(
        await p.evaluate(() =>
          [...document.getAnimations()]
            .filter((a) => a.effect?.target?.closest("#view-settings"))
            .every((a) => !!a.effect.target.closest(".ui-settings-body")),
        ),
        true,
      );
      await p.evaluate(() => {
        for (let i = 0; i < 20; i++)
          DesktopUI.selectSettings(i % 2 ? "sound" : "appearance");
      });
      await p.keyboard.press("Escape");
      assert.equal(
        await p.evaluate(() => DesktopUI.getSettingsMotionCount()),
        0,
      );
      await p.waitForFunction(
        () =>
          document.querySelectorAll("#bgmListContainer .sound-row").length ===
          SET_TRACK_TYPES.length,
      );
      await category(p, "motion");
      await p.locator("#uiPref-pageMotion").uncheck();
      await category(p, "sound");
      assert.equal(
        await p.evaluate(() => DesktopUI.getSettingsMotionCount()),
        0,
      );
      await category(p, "motion");
      await p.locator("#uiPref-pageMotion").check();
      await p.emulateMedia({ reducedMotion: "reduce" });
      await category(p, "sound");
      assert.equal(
        await p.evaluate(() => DesktopUI.getSettingsMotionCount()),
        0,
      );
      await p.emulateMedia({ reducedMotion: "no-preference" });
      await category(p, "motion");
      await p.locator("#uiPref-motion").selectOption("off");
      await category(p, "sound");
      assert.equal(
        await p.evaluate(() => DesktopUI.getSettingsMotionCount()),
        0,
      );
      await category(p, "motion");
      await p.locator("#uiPref-motion").selectOption("full");
      await p.locator('[data-category="appearance"]').click();
      await p.locator('.nav-tab[data-view="battle"]').click();
      assert.equal(
        await p.evaluate(() => DesktopUI.getSettingsMotionCount()),
        0,
      );
      return {
        entry,
        rapidSwitches: 20,
        escape: true,
        pageMotionOff: true,
        systemReduce: true,
        motionOff: true,
        viewExit: true,
      };
    } finally {
      await c.close();
    }
  });
  for (const [width, height] of [[1920, 1080]])
    await test(`Eight categories, normal and expanded maintenance, scrolling and keyboard ${width}x${height}`, async () => {
      const { c, p } = await open(width, height);
      const measurements = [];
      try {
        const before = await p.evaluate(() =>
          JSON.stringify({
            groups: state.groups,
            round: state.roundActive,
            correct: state.correctAns,
          }),
        );
        for (const id of categories) {
          await category(p, id);
          assert.equal(
            await p.locator(`[data-category-panel="${id}"]`).isVisible(),
            true,
          );
          assert.equal(await p.locator(".bottom-dock").isVisible(), false);
          const m = await p.evaluate(() => ({
            width: innerWidth,
            scrollWidth: document.documentElement.scrollWidth,
            header: document
              .querySelector(".ui-settings-header")
              .getBoundingClientRect()
              .toJSON(),
            shell: document
              .querySelector(".ui-settings-shell")
              .getBoundingClientRect()
              .toJSON(),
            nav: document
              .querySelector(".ui-settings-nav")
              .getBoundingClientRect()
              .toJSON(),
            body: document
              .querySelector(".ui-settings-body")
              .getBoundingClientRect()
              .toJSON(),
          }));
          assert.ok(m.scrollWidth <= width + 2, JSON.stringify(m));
          assert.ok(m.body.bottom <= height + 1);
          assert.ok(
            Math.abs(m.header.left - m.shell.left) <= 1 &&
              Math.abs(m.header.right - m.shell.right) <= 1,
            JSON.stringify(m),
          );
          assert.ok(
            m.header.left <= 26 && width - m.header.right <= 26,
            JSON.stringify(m),
          );
          measurements.push({ category: id, ...m });
          if (id !== "sound")
            assert.equal(
              await p
                .locator('button[onclick="triggerImportAudioBundle()"]')
                .isVisible(),
              false,
            );
          await p.screenshot({
            path: `${root}/screenshots/${id}-${width}.png`,
          });
          for (const details of await p
            .locator(`[data-category-panel="${id}"] details`)
            .all()) {
            await details.locator(":scope > summary").focus();
            await p.keyboard.press("Enter");
            assert.equal(await details.evaluate((e) => e.open), true);
          }
          await p
            .locator(".ui-settings-body")
            .evaluate((e) => (e.scrollTop = e.scrollHeight));
          const overflow = await p
            .locator(`[data-category-panel="${id}"]`)
            .evaluate((e) => ({
              client: e.clientWidth,
              scroll: e.scrollWidth,
            }));
          assert.ok(
            overflow.scroll <= overflow.client + 2,
            JSON.stringify({ id, overflow }),
          );
          await p.screenshot({
            path: `${root}/screenshots/${id}-expanded-${width}.png`,
          });
        }
        assert.equal(
          await p.evaluate(() =>
            JSON.stringify({
              groups: state.groups,
              round: state.roundActive,
              correct: state.correctAns,
            }),
          ),
          before,
        );
        return measurements;
      } finally {
        await c.close();
      }
    });
  await test("Aligned full-width settings at 1920x1080 and 100 percent application zoom", async () => {
    const { c, p } = await open();
    const measurements = [];
    try {
      for (const [width, height] of [[1920, 1080]]) {
        await p.setViewportSize({ width, height });
        for (const zoom of [1]) {
          await p.evaluate((zoom) => applyZoom(zoom), zoom);
          await category(p, "sound");
          const m = await p.evaluate(() => ({
            header: document
              .querySelector(".ui-settings-header")
              .getBoundingClientRect()
              .toJSON(),
            shell: document
              .querySelector(".ui-settings-shell")
              .getBoundingClientRect()
              .toJSON(),
            body: document
              .querySelector(".ui-settings-body")
              .getBoundingClientRect()
              .toJSON(),
            scroll: document.documentElement.scrollWidth,
            width: innerWidth,
            height: innerHeight,
          }));
          assert.ok(
            Math.abs(m.header.left - m.shell.left) <= 1 &&
              Math.abs(m.header.right - m.shell.right) <= 1,
            JSON.stringify(m),
          );
          assert.ok(
            m.header.left <= 26 * zoom + 1 &&
              width - m.header.right <= 26 * zoom + 1,
            JSON.stringify(m),
          );
          assert.ok(
            m.body.bottom <= height + 2 && m.scroll <= width + 2,
            JSON.stringify(m),
          );
          measurements.push({ width, height, zoom, ...m });
          await p.screenshot({
            path: `${root}/screenshots/alignment-${width}-${zoom}.png`,
          });
        }
      }
      return {
        method: "application CSS zoom, not native browser toolbar zoom",
        measurements,
      };
    } finally {
      await c.close();
    }
  });
  await test("Every original control and action survives exactly once; categories use explicit ownership", async () => {
    const { c, p } = await open();
    try {
      await category(p, "sound");
      await p.waitForFunction(
        () =>
          document.querySelectorAll("#bgmListContainer .sound-row").length ===
          SET_TRACK_TYPES.length,
      );
      const after = await p.evaluate(() =>
        [
          ...document.querySelectorAll(
            "#view-settings button,#view-settings input,#view-settings select,#view-settings textarea",
          ),
        ].map((e) => ({
          id: e.id,
          action:
            e.getAttribute("onclick") ||
            e.getAttribute("onchange") ||
            e.getAttribute("oninput") ||
            e.dataset.pref ||
            "",
          category: e.closest("[data-category-panel]")?.dataset.categoryPanel,
        })),
      );
      for (const old of baseline.controls) {
        if (old.id)
          assert.equal(after.filter((x) => x.id === old.id).length, 1, old.id);
        if (old.action)
          assert.equal(
            after.filter((x) => x.action === old.action).length,
            1,
            old.action,
          );
      }
      for (const id of ["cfgWallVeil", "cfgResizerEnabled", "cfgColumnMode"])
        assert.equal(after.find((x) => x.id === id).category, "appearance");
      assert.equal(
        await p
          .locator("#uiIconManagerV26")
          .evaluate(
            (e) => e.closest("[data-category-panel]").dataset.categoryPanel,
          ),
        "appearance",
      );
      assert.equal(
        await p
          .locator("#view-settings .settings-toolbar,#v2175FxBundleToolbar")
          .count(),
        0,
      );
      assert.equal(
        await p.locator("#uiAudioTransfer").evaluate((e) => e.open),
        false,
      );
      assert.equal(
        await p.locator('button[onclick="triggerImportAudioBundle()"]').count(),
        1,
      );
      const ids = await p
        .locator("[id]")
        .evaluateAll((es) => es.map((e) => e.id));
      assert.equal(new Set(ids).size, ids.length);
      return {
        originalControls: baseline.controls.length,
        originalActions: baseline.controls.filter((x) => x.action).length,
        currentControls: after.length,
      };
    } finally {
      await c.close();
    }
  });
  await test("Moved layout, rules, real wallpaper and veil save and restore without changing groups", async () => {
    const { c, p } = await open();
    try {
      const groups = await p.evaluate(() => JSON.stringify(state.groups));
      await category(p, "rules");
      await p.locator("#cfgSaveAllIn").uncheck();
      await p.locator("#communismModeToggle").uncheck();
      assert.equal(await p.locator("#communismModeToggle").isChecked(), false);
      await category(p, "appearance");
      await p.locator("#cfgColumnMode").selectOption("double");
      await p.locator("#cfgResizerEnabled").uncheck();
      assert.equal(await p.locator("#cfgWallVeil").isDisabled(), true);
      const data = await p.evaluate(() => {
        const c = document.createElement("canvas");
        c.width = 4;
        c.height = 4;
        c.getContext("2d").fillRect(0, 0, 4, 4);
        return c.toDataURL("image/png");
      });
      const [chooser] = await Promise.all([
        p.waitForEvent("filechooser"),
        p.locator(".wall-file-btn").click(),
      ]);
      await chooser.setFiles({
        name: "wallpaper.png",
        mimeType: "image/png",
        buffer: Buffer.from(data.split(",")[1], "base64"),
      });
      await p.waitForFunction(() => !!wallpaperUrl);
      await p.locator("#cfgWallVeil").focus();
      await p.keyboard.press("Home");
      for (let i = 0; i < 10; i++) await p.keyboard.press("ArrowRight");
      assert.equal(await p.evaluate(() => getWallVeil()), 0.5);
      await p.locator('#uiSettingsLayout button[onclick="zoomIn()"]').click();
      await p.reload({ waitUntil: "domcontentloaded", timeout: 90000 });
      await dismissStartup(p);
      await p.waitForFunction(() => !!wallpaperUrl);
      assert.deepEqual(
        await p.evaluate(() => ({
          allIn: state.saveAllIn,
          items: isCommunismMode(),
          column: state.columnMode,
          resizer: state.resizerEnabled,
          zoom: state.zoomLevel,
          veil: getWallVeil(),
        })),
        {
          allIn: false,
          items: false,
          column: "double",
          resizer: false,
          zoom: 1.1,
          veil: 0.5,
        },
      );
      assert.equal(
        await p.evaluate(() => JSON.stringify(state.groups)),
        groups,
      );
    } finally {
      await c.close();
    }
  });
  await test("Daily volume uses original live setters and persists across reload", async () => {
    const { c, p } = await open();
    try {
      await category(p, "sound");
      for (const [id, steps] of [
        ["cfgMasterVolume", 7],
        ["cfgSfxVolumeV2176", 13],
      ]) {
        await p.locator("#" + id).focus();
        await p.keyboard.press("Home");
        for (let i = 0; i < steps; i++) await p.keyboard.press("ArrowRight");
      }
      let values = await p.evaluate(() => [
        state.masterVolume,
        state.sfxVolume,
      ]);
      assert.deepEqual(values, [0.35, 0.65]);
      await p.reload({ waitUntil: "domcontentloaded", timeout: 90000 });
      await dismissStartup(p);
      values = await p.evaluate(() => [state.masterVolume, state.sfxVolume]);
      assert.deepEqual(values, [0.35, 0.65]);
      return values;
    } finally {
      await c.close();
    }
  });
  await test("All nine music choices and all 30 item sound editors remain available after repeated navigation", async () => {
    const { c, p } = await open();
    try {
      await category(p, "sound");
      await expand(p, "uiSettingsMusic");
      for (let i = 0; i < 9; i++) {
        await p.locator("#cfgSetSelector").selectOption(String(i));
        await p.waitForFunction((i) => {
          const prefix = i === 8 ? "bgm_menu_" : `bgm_set_${i}_`;
          return (
            [
              ...document.querySelectorAll(
                '#bgmListContainer button[onclick^="triggerUploadAudio"]',
              ),
            ].length ===
              (i === 8 ? MENU_SET_TRACK_TYPES : SET_TRACK_TYPES).length &&
            [
              ...document.querySelectorAll(
                '#bgmListContainer button[onclick^="triggerUploadAudio"]',
              ),
            ].every((b) => b.getAttribute("onclick").includes(prefix))
          );
        }, i);
      }
      await expand(p, "uiSettingsItemFx");
      assert.equal(
        await p
          .locator(
            '#itemFxSoundListV26 button[onclick^="triggerUploadAudio"]:not([onclick*=",true"])',
          )
          .count(),
        30,
      );
      assert.equal(
        await p
          .locator(
            '#itemFxSoundListV26 button[onclick^="triggerUploadAudio"][onclick*=",true"]',
          )
          .count(),
        30,
      );
      assert.equal(
        await p
          .locator('#itemFxSoundListV26 button[onclick^="triggerUploadAudio"]')
          .count(),
        60,
      );
      const keys = await p.evaluate(() => ITEM_KEYS);
      for (const key of keys)
        assert.equal(
          await p
            .locator(
              `#itemFxSoundListV26 button[onclick="triggerUploadAudio('fx_item_${key}')"]`,
            )
            .count(),
          1,
        );
      for (const id of [
        "item_draw_start",
        "item_draw_tick",
        "item_draw_reveal",
        "item_defend",
        ...keys.map((k) => "item_" + k),
      ]) {
        assert.equal(
          await p
            .locator(
              `#itemFxSoundListV26 button[onclick="triggerUploadAudio('fx_${id}',true)"]`,
            )
            .count(),
          1,
        );
        assert.equal(
          await p
            .locator(
              `#itemFxSoundListV26 button[onclick="triggerUploadAudio('fx_${id}')"]`,
            )
            .count(),
          1,
        );
      }
      for (let i = 0; i < 3; i++) {
        await category(p, "appearance");
        await category(p, "sound");
        await p.evaluate(() => showSettingsV26("sound"));
      }
      assert.equal(await p.locator("#v2175FxBundleToolbar").count(), 0);
      return { musicChoices: 9, itemEditors: 30, actualItems: keys };
    } finally {
      await c.close();
    }
  });
  await test("Roster rebuild requires confirmation; cancellation preserves groups, acceptance applies original command", async () => {
    const { c, p } = await open();
    try {
      await category(p, "students");
      const old = await p.evaluate(() => JSON.stringify(state.groups));
      await p.locator("#settingsBatchMemberText").fill("测试 1 组: 张三, 李四");
      await p.locator('button[onclick="applySettingsBatchMembers()"]').click();
      await p.locator("#themeDialogActionsV21727 .secondary").click();
      assert.equal(await p.evaluate(() => JSON.stringify(state.groups)), old);
      await p.locator('button[onclick="applySettingsBatchMembers()"]').click();
      await p.locator("#themeDialogActionsV21727 .danger").click();
      assert.deepEqual(
        await p.evaluate(() =>
          state.groups.map((g) => ({
            name: g.name,
            members: g.members,
            score: g.score,
          })),
        ),
        [{ name: "测试 1 组", members: ["张三", "李四"], score: 100 }],
      );
    } finally {
      await c.close();
    }
  });
  await test("Danger tools stay collapsed; cancel score and item clearing preserves all data", async () => {
    const { c, p } = await open();
    try {
      await p.evaluate(() => {
        state.groups[0].inventory = [{ key: "coin", uses: 1 }];
        saveState();
      });
      await category(p, "data");
      assert.equal(
        await p.locator('button[onclick="resetAllScores()"]').isVisible(),
        false,
      );
      const before = await p.evaluate(() => JSON.stringify(state.groups));
      await expand(p, "uiSettingsDanger");
      for (const action of ["resetAllScores()", "clearAllItemsV2172()"]) {
        await p.locator(`button[onclick="${action}"]`).click();
        await p.locator("#themeDialogActionsV21727 .secondary").click();
        assert.equal(
          await p.evaluate(() => JSON.stringify(state.groups)),
          before,
        );
      }
    } finally {
      await c.close();
    }
  });
  await test("All item icons retained; reset-all has confirmation and preserves custom image on cancel", async () => {
    const { c, p } = await open();
    try {
      await category(p, "items");
      await expand(p, "uiSettingsItemLibrary");
      const data =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==";
      await p.evaluate((data) => {
        state.itemGlobal.customIcons.coin = data;
        renderItemEncyclopedia();
      }, data);
      assert.equal(
        await p
          .locator('#v2ItemEncyclopedia button[onclick^="chooseItemIcon"]')
          .count(),
        26,
      );
      await p.locator('button[onclick="resetAllItemIcons()"]').click();
      await p.locator("#themeDialogActionsV21727 .secondary").click();
      assert.equal(
        await p.evaluate(() => state.itemGlobal.customIcons.coin),
        data,
      );
    } finally {
      await c.close();
    }
  });
  await test("Local bank maintenance is secondary, validates edits and exports real saved content", async () => {
    const { c, p } = await open();
    try {
      await category(p, "welcome");
      assert.equal(await p.locator("#uiBankEditor").isVisible(), false);
      await expand(p, "uiSettingsBank");
      const bank = await p.evaluate(() =>
        JSON.parse(document.getElementById("uiBankEditor").value),
      );
      bank.knowledge[0].title = "已审核课堂示例";
      await p.locator("#uiBankEditor").fill(JSON.stringify(bank));
      await p.locator("#uiSaveBank").click();
      assert.match(await p.locator("#uiBankStatus").textContent(), /验证成功/);
      const saved = await p.evaluate(() =>
        localStorage.getItem("godpower_ui_bank_v1"),
      );
      const [download] = await Promise.all([
        p.waitForEvent("download"),
        p.locator("#uiExportBank").click(),
      ]);
      await download.saveAs(`${root}/bank.json`);
      assert.deepEqual(
        JSON.parse(await readFile(`${root}/bank.json`)),
        JSON.parse(saved),
      );
      await p.locator("#uiBankEditor").fill("{bad");
      await p.locator("#uiSaveBank").click();
      assert.equal(
        await p.evaluate(() => localStorage.getItem("godpower_ui_bank_v1")),
        saved,
      );
      await p.locator("#uiResetBank").click();
      await p.locator("#themeDialogActionsV21727 .secondary").click();
      assert.equal(
        await p.evaluate(() => localStorage.getItem("godpower_ui_bank_v1")),
        saved,
      );
    } finally {
      await c.close();
    }
  });
  await test("Data backup and local management PIN keep existing behavior after moving controls", async () => {
    const { c, p } = await open();
    try {
      await category(p, "data");
      await p.locator("#newPwdInput").fill("test-pin-2026");
      await p.locator("#uiSettingsLock button").click();
      assert.equal(await p.evaluate(() => state.adminPin), "test-pin-2026");
      const [download] = await Promise.all([
        p.waitForEvent("download"),
        p.locator('#uiSettingsBackup button[onclick="exportData()"]').click(),
      ]);
      await download.saveAs(`${root}/classroom.json`);
      const backup = JSON.parse(await readFile(`${root}/classroom.json`));
      assert.equal(backup.groups.length, 4);
      assert.equal(backup.adminPin, "test-pin-2026");
      await p.reload({ waitUntil: "domcontentloaded", timeout: 90000 });
      await dismissStartup(p);
      assert.equal(await p.evaluate(() => state.adminPin), "test-pin-2026");
    } finally {
      await c.close();
    }
  });
  await test("Moved audio actions: real WAV upload, both BGMP exports, import into isolated storage and refreshed item status", async () => {
    const { c, p } = await open();
    let other;
    try {
      await category(p, "sound");
      await expand(p, "uiSettingsItemFx");
      const wav = Buffer.alloc(44 + 4096);
      wav.write("RIFF");
      wav.writeUInt32LE(wav.length - 8, 4);
      wav.write("WAVEfmt ", 8);
      wav.writeUInt32LE(16, 16);
      wav.writeUInt16LE(1, 20);
      wav.writeUInt16LE(1, 22);
      wav.writeUInt32LE(44100, 24);
      wav.writeUInt32LE(88200, 28);
      wav.writeUInt16LE(2, 32);
      wav.writeUInt16LE(16, 34);
      wav.write("data", 36);
      wav.writeUInt32LE(4096, 40);
      const [chooser] = await Promise.all([
        p.waitForEvent("filechooser"),
        p
          .locator(`button[onclick="triggerUploadAudio('fx_item_coin')"]`)
          .click(),
      ]);
      await chooser.setFiles({
        name: "coin-test.wav",
        mimeType: "audio/wav",
        buffer: wav,
      });
      await p.waitForFunction(() => !!customFxBuffers.item_coin);
      await expand(p, "uiAudioTransfer");
      let archive;
      for (const [action, file] of [
        ["exportAudioBundle()", "audio-all.bin"],
        ["exportFxBundleV2175()", "audio-fx.bin"],
      ]) {
        const [download] = await Promise.all([
          p.waitForEvent("download"),
          p.locator(`button[onclick="${action}"]`).click(),
        ]);
        await download.saveAs(`${root}/${file}`);
        const bytes = await readFile(`${root}/${file}`);
        assert.equal(bytes.subarray(0, 4).toString(), "BGMP");
        const count = bytes.readUInt32LE(4),
          index = JSON.parse(bytes.subarray(8, 8 + count));
        assert.ok(index.some((x) => x.id === "fx_item_coin"));
        archive = bytes;
      }
      other = await open();
      await category(other.p, "sound");
      await expand(other.p, "uiAudioTransfer");
      const [picked] = await Promise.all([
        other.p.waitForEvent("filechooser"),
        other.p.locator('button[onclick="triggerImportAudioBundle()"]').click(),
      ]);
      await picked.setFiles({
        name: "audio-fx.bin",
        mimeType: "application/octet-stream",
        buffer: archive,
      });
      await other.p.waitForFunction(
        () => hasSound("fx_item_coin") && !!customFxBuffers.item_coin,
      );
      const row = other.p.locator("#itemFxSoundListV26 .sound-row").filter({
        has: other.p.locator(
          `button[onclick="triggerUploadAudio('fx_item_coin')"]`,
        ),
      });
      await expand(other.p, "uiSettingsItemFx");
      await row
        .locator('button[onclick^="deleteFxTrack"]')
        .waitFor({ state: "visible", timeout: 4000 });
      assert.equal(
        (await row.locator(".sound-tag").textContent()).trim(),
        "已载入独立音频",
      );
      return {
        wavBytes: wav.length,
        exportFiles: ["audio-all.bin", "audio-fx.bin"],
        freshContextImport: true,
      };
    } finally {
      await c.close();
      await other?.c.close();
    }
  });
} finally {
  await writeFile(
    `${root}/results.json`,
    JSON.stringify(
      {
        sha256: createHash("sha256").update(html).digest("hex"),
        browser: browser.version(),
        results,
        errors,
      },
      null,
      2,
    ),
  );
  await browser.close();
  await new Promise((r) => server.close(r));
}
console.log({
  pass: results.filter((x) => x.status === "PASS").length,
  fail: results.filter((x) => x.status === "FAIL").length,
  errors,
});
if (results.some((x) => x.status === "FAIL") || errors.length)
  process.exitCode = 1;
