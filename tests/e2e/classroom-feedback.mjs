import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html"),
  root = "artifacts/classroom-feedback";
await mkdir(root, { recursive: true });
const server = createServer((q, s) => {
  s.setHeader("Content-Type", "text/html;charset=utf-8");
  s.end(html);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch(),
  results = [],
  errors = [];
const c = await browser.newContext({ viewport: { width: 1920, height: 1080 } }),
  p = await c.newPage();
p.on("pageerror", (e) => errors.push(e.message));
p.setDefaultTimeout(12000);
async function test(name, fn) {
  try {
    await setup(p);
    const evidence = await fn();
    results.push({ name, status: "PASS", evidence });
    console.log("PASS", name);
  } catch (e) {
    results.push({ name, status: "FAIL", error: e.stack });
    console.error("FAIL", name, e.message);
    await p
      .screenshot({ path: `${root}/failure-${results.length}.png` })
      .catch(() => {});
    await p.evaluate(() => ClassroomFeedback.cancel()).catch(() => {});
  }
}
try {
  await p.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  await test("Shared six slots across all five scoring windows and persistent setting edit", async () => {
    await p.evaluate(() => {
      ClassroomFeedback.setOptions({ slots: [3, 6, 9, -3, -6, -9] });
      switchView("settings");
      DesktopUI.selectSettings("rules");
    });
    assert.equal(await p.locator("[data-cf-slot]").count(), 6);
    await p.locator('[data-cf-slot="0"]').fill("7");
    await p.locator('[data-cf-slot="0"]').press("Tab");
    assert.deepEqual(
      await p.evaluate(() => ClassroomFeedback.getOptions().slots),
      [7, 6, 9, -3, -6, -9],
    );
    await p.evaluate(() => {
      openItemWindow(1, "score");
    });
    assert.equal(
      await p.locator("#itemModalBackdrop [data-score-slot]").count(),
      6,
    );
    assert.equal(await p.locator("#itemCustomScore").count(), 1);
    await p.keyboard.press("Escape");
    await p.locator("#itemModalBackdrop").waitFor({ state: "hidden" });
    await p.evaluate(() => {
      openHandRaise();
      selectHandGroup(1);
      judgeHandRaise(true);
    });
    assert.equal(
      await p.locator("#handRaiseBackdrop [data-score-slot]").count(),
      6,
    );
    assert.equal(await p.locator("#handCustomScore").count(), 1);
    await p.keyboard.press("Escape");
    await p.locator("#handRaiseBackdrop").waitFor({ state: "hidden" });
    for (const [id, fn] of [
      ["pickerModal", "openPickerModal"],
      ["quickPersonBackdropV218", "openQuickPersonScoreV218"],
      ["scoreModalBackdrop", "openScoreModal"],
    ]) {
      await p.evaluate((fn) => window[fn](1), fn);
      assert.equal(await p.locator(`#${id} [data-score-slot]`).count(), 6);
      assert.deepEqual(
        await p.locator(`#${id} [data-score-slot]`).allTextContents(),
        ["+7", "+6", "+9", "−3", "−6", "−9"],
      );
      await p.keyboard.press("Escape");
      await p.locator("#" + id).waitFor({ state: "hidden" });
    }
    const saved = await p.evaluate(() =>
      JSON.parse(localStorage.getItem("godpower_score_feedback_v1")),
    );
    assert.deepEqual(saved.slots, [7, 6, 9, -3, -6, -9]);
    return saved;
  });
  await test("Slot invalid input cannot replace saved values", async () => {
    await p.evaluate(() => {
      switchView("settings");
      DesktopUI.selectSettings("rules");
    });
    const before = await p.evaluate(() => ClassroomFeedback.getOptions().slots);
    await p.locator('[data-cf-slot="1"]').fill("1.5");
    await p.locator('[data-cf-slot="1"]').press("Tab");
    assert.equal(
      await p.locator('[data-cf-slot="1"]').getAttribute("aria-invalid"),
      "true",
    );
    assert.deepEqual(
      await p.evaluate(() => ClassroomFeedback.getOptions().slots),
      before,
    );
    await p.locator('[data-cf-slot="1"]').fill("6");
    await p.locator('[data-cf-slot="1"]').press("Tab");
  });
  for (const [kind, open, selector, delta] of [
    [
      "group",
      () => {
        openItemWindow(1, "score");
      },
      '#itemModalBackdrop [data-score-slot="0"]',
      7,
    ],
    [
      "modal",
      () => openScoreModal(1),
      '#scoreModalBackdrop [data-score-slot="3"]',
      -3,
    ],
    [
      "hand",
      () => {
        openHandRaise();
        selectHandGroup(1);
        judgeHandRaise(true);
      },
      '#handRaiseBackdrop [data-score-slot="1"]',
      6,
    ],
  ])
    await test(`Actual ${kind} slot scores once; green/red full-screen and undo`, async () => {
      await p.evaluate(() =>
        ClassroomFeedback.setOptions(
          { scoreEffects: true, duration: 3600 },
          { persist: false },
        ),
      );
      await p.evaluate(open);
      const before = await p.evaluate(() => ({
        score: state.groups[0].score,
        history: historyStack.length,
      }));
      await p.locator(selector).click();
      await p.locator("#classroomShowcase[open]").waitFor();
      assert.equal(
        await p.evaluate(() => state.groups[0].score),
        before.score + delta,
      );
      assert.equal(
        await p.evaluate(() => historyStack.length),
        before.history + 1,
      );
      assert.equal(
        await p.locator("#classroomShowcase").getAttribute("data-kind"),
        delta > 0 ? "positive" : "negative",
      );
      await p.screenshot({ path: `${root}/score-${kind}.png` });
      await p.keyboard.press("Escape");
      await p.locator("#classroomShowcase").waitFor({ state: "hidden" });
      await p.evaluate(() => undoLast());
      assert.equal(await p.evaluate(() => state.groups[0].score), before.score);
    });
  await test("Manual hand score and invalid/locked commands: effects only on successful change", async () => {
    await p.evaluate(() => {
      ClassroomFeedback.setOptions({ scoreEffects: true }, { persist: false });
      openHandRaise();
      selectHandGroup(1);
      judgeHandRaise(true);
    });
    await p.locator("#handCustomScore").fill("-11");
    await p.locator(".cf-hand-custom button").click();
    await p.locator("#classroomShowcase[open]").waitFor();
    assert.equal(await p.evaluate(() => state.groups[0].score), 89);
    await p.evaluate(() => undoLast());
    assert.equal(await p.locator("#classroomShowcase").isVisible(), false);
    await p.evaluate(() => {
      state.isLocked = true;
      applyScoreDelta(1, 5);
    });
    assert.equal(await p.locator("#classroomShowcase").isVisible(), false);
    assert.equal(await p.evaluate(() => state.groups[0].score), 100);
  });
  for (const mode of ["individual", "group", "two_tier"])
    await test(`Slot ${mode}: actual vertical motion, continuous handoff and unchanged winner`, async () => {
      await p.evaluate((mode) => {
        ClassroomFeedback.setOptions(
          { pickEffects: true, duration: 3600 },
          { persist: false },
        );
        openPickerModal();
        setPickerMode(mode);
      }, mode);
      await p.locator("#btnSlotTrigger").click();
      await p.waitForFunction(() => slotEngine.isSpinning);
      await p.waitForTimeout(130);
      const before = await p.evaluate(() => ({
        chosen: JSON.stringify(slotEngine.chosenResult),
        transforms: [...document.querySelectorAll(".cf-live-reel")].map(
          (x) => getComputedStyle(x).transform,
        ),
        history: state.itemGlobal.pickerHistory.length,
      }));
      assert.ok(before.transforms.length);
      await p.waitForFunction(
        (previous) =>
          JSON.stringify(
            [...document.querySelectorAll(".cf-live-reel")].map(
              (x) => getComputedStyle(x).transform,
            ),
          ) !== JSON.stringify(previous),
        before.transforms,
      );
      assert.notDeepEqual(
        await p
          .locator(".cf-live-reel")
          .evaluateAll((es) => es.map((x) => getComputedStyle(x).transform)),
        before.transforms,
      );
      await p.locator("#btnSlotTrigger").click();
      assert.equal(await p.locator(".cf-live-reel").count(), 0);
      assert.ok((await p.locator(".ui-slot-deceleration").count()) > 0);
      await p.waitForSelector("#classroomShowcase[open]");
      assert.equal(
        await p.evaluate(() => JSON.stringify(slotEngine.chosenResult)),
        before.chosen,
      );
      assert.equal(
        await p.evaluate(() => state.itemGlobal.pickerHistory.length),
        before.history + 1,
      );
      assert.equal(
        await p.locator("#classroomShowcase").getAttribute("data-kind"),
        "pick",
      );
      await p.screenshot({ path: `${root}/picked-${mode}.png` });
      await p.keyboard.press("Escape");
      await p.locator("#classroomShowcase").waitFor({ state: "hidden" });
      assert.equal(await p.locator(".ui-slot-deceleration").count(), 0);
      assert.equal(
        await p
          .locator("#pickerModal .slot-reel-text")
          .first()
          .evaluate((e) => e.style.visibility),
        "",
      );
      return before;
    });
  await test("Effect off, reduced motion and page/undo interruptions clean overlays", async () => {
    await p.evaluate(() => {
      ClassroomFeedback.setOptions(
        { scoreEffects: false, pickEffects: false },
        { persist: false },
      );
      applyScoreDelta(1, 2);
    });
    assert.equal(await p.locator("#classroomShowcase").isVisible(), false);
    await p.emulateMedia({ reducedMotion: "reduce" });
    await p.evaluate(() => {
      ClassroomFeedback.setOptions({ scoreEffects: true }, { persist: false });
      applyScoreDelta(1, -2);
    });
    assert.equal(await p.locator("#classroomShowcase").isVisible(), false);
    await p.emulateMedia({ reducedMotion: "no-preference" });
    await p.evaluate(() => applyScoreDelta(1, 2));
    await p.locator("#classroomShowcase[open]").waitFor();
    await p.evaluate(() => switchView("history"));
    assert.equal(await p.locator("#classroomShowcase").isVisible(), false);
    assert.equal(
      await p.evaluate(() => ClassroomFeedback.status().timer),
      false,
    );
  });
  for (const [width, height] of [[1920, 1080]])
    await test(`Settings and full-screen bounds ${width}`, async () => {
      await p.setViewportSize({ width, height });
      await p.evaluate(() => {
        switchView("settings");
        DesktopUI.selectSettings("rules");
      });
      await p.waitForFunction(() => DesktopUI.getSettingsMotionCount() === 0);
      await p
        .locator(".cf-slot-editor")
        .screenshot({ path: `${root}/settings-slots-${width}.png` });
      await p.evaluate(() => {
        ClassroomFeedback.setOptions(
          { scoreEffects: true, style: "burst", duration: 3600 },
          { persist: false },
        );
        ClassroomFeedback.score("课堂之星", -25);
      });
      await p.locator("#classroomShowcase[open]").waitFor();
      const r = await p.locator("#classroomShowcase").boundingBox();
      assert.ok(
        r.x >= -1 &&
          r.y >= -1 &&
          r.x + r.width <= width + 1 &&
          r.y + r.height <= height + 1,
        JSON.stringify(r),
      );
      await p.screenshot({ path: `${root}/full-screen-${width}.png` });
      await p.keyboard.press("Escape");
      await p.locator("#classroomShowcase").waitFor({ state: "hidden" });
      return r;
    });
  await test("Every active sound slot has custom upload wiring and uploaded samples are played", async () => {
    await p.evaluate(async () => {
      await getAudioContext();
      window.fxProbe = [];
      const start = AudioBufferSourceNode.prototype.start;
      window.fxStartOriginal = start;
      AudioBufferSourceNode.prototype.start = function (...args) {
        fxProbe.push(this.buffer);
        return start.apply(this, args);
      };
    });
    const audit = await p.evaluate(async () => {
      renderFxSlotList();
      renderItemFxSoundListV26();
      const active = [
        ...FX_SOUND_SLOTS.map((x) => x.id),
        ...ITEM_FX_SOUND_SLOTS.filter(
          (x) => !GENERIC_ITEM_USE_SOUNDS_V2174.has(x.id),
        ).map((x) => x.id),
        ...PER_ITEM_SOUND_IDS_V2174,
      ];
      const before = customFxBuffers;
      const results = [];
      try {
        for (const id of active) {
          const buffer = audioCtx.createBuffer(1, 800, audioCtx.sampleRate);
          customFxBuffers[id] = buffer;
          const count = fxProbe.length;
          await playSound(id);
          results.push({
            id,
            played: fxProbe.slice(count).includes(buffer),
            listed: !!document.querySelector(
              `button[onclick="triggerUploadAudio('fx_${id}')"]`,
            ),
          });
        }
        return results;
      } finally {
        AudioBufferSourceNode.prototype.start = fxStartOriginal;
      }
    });
    assert.ok(
      audit.every((x) => x.played && x.listed),
      JSON.stringify(audit.filter((x) => !x.played || !x.listed)),
    );
    await writeFile(`${root}/audio-slots.json`, JSON.stringify(audit, null, 2));
    return audit;
  });
  await test("Global pointer and keyboard clicks use custom click sound once; disable suppresses it", async () => {
    const r = await p.evaluate(async () => {
      await getAudioContext();
      fxSoundsLoaded = true;
      const buffer = audioCtx.createBuffer(1, 800, audioCtx.sampleRate);
      customFxBuffers.ui_click = buffer;
      const start = AudioBufferSourceNode.prototype.start;
      let count = 0;
      AudioBufferSourceNode.prototype.start = function (...args) {
        if (this.buffer === buffer) count++;
        return start.apply(this, args);
      };
      try {
        ClassroomFeedback.setOptions(
          { clickEnabled: true },
          { persist: false },
        );
        const b = document.createElement("button");
        b.textContent = "test";
        b.onclick = () => playSound("ui_click");
        document.body.append(b);
        b.click();
        await new Promise((r) => setTimeout(r, 150));
        const first = count;
        ClassroomFeedback.setOptions(
          { clickEnabled: false },
          { persist: false },
        );
        b.click();
        await new Promise((r) => setTimeout(r, 50));
        b.remove();
        return { first, after: count };
      } finally {
        AudioBufferSourceNode.prototype.start = start;
      }
    });
    assert.deepEqual(r, { first: 1, after: 1 });
    return r;
  });
  assert.deepEqual(errors, []);
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
}
if (results.some((x) => x.status !== "PASS") || errors.length)
  process.exitCode = 1;
