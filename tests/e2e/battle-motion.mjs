import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html"),
  root = "artifacts/battle-motion";
await mkdir(root, { recursive: true });
const server = createServer((q, r) => {
  r.setHeader("Content-Type", "text/html;charset=utf-8");
  r.end(html);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch(),
  page = await browser.newPage({ viewport: { width: 1920, height: 1080 } }),
  results = [],
  errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.setDefaultTimeout(15000);
async function test(name, fn) {
  try {
    await setup(page);
    await page.evaluate(() => {
      cancelItemScoreAnimations();
      const motion = document.querySelector('[data-pref="motion"]');
      motion.value = "full";
      motion.dispatchEvent(new Event("change", { bubbles: true }));
      const item = document.querySelector('[data-pref="itemFx"]');
      item.checked = true;
      item.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await page.waitForFunction(() => DesktopUI.getAnimationCount() === 0);
    const evidence = await fn();
    results.push({ name, status: "PASS", evidence });
    console.log("PASS", name);
  } catch (e) {
    results.push({ name, status: "FAIL", error: e.stack });
    console.error("FAIL", name, e.message);
    await page.screenshot({ path: `${root}/failure-${results.length}.png` });
  }
}
try {
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  await test("All 26 item effects retain geometry, survive redraw, have a real fade tail and clean up", async () => {
    const keys = await page.evaluate(() => ITEM_KEYS);
    const audit = [];
    for (const key of keys) {
      const r = await page.evaluate((key) => {
        const card = document.querySelector('#groupList [data-group-id="1"]'),
          before = card.getBoundingClientRect().toJSON();
        playCasterCardFx(key, 1);
        playAttackTargetFxV2116(1, key, false);
        renderGrid();
        const live = document.querySelector('#groupList [data-group-id="1"]'),
          nodes = [...live.querySelectorAll(".bm-layer")];
        for (const el of nodes) {
          const a = el.getAnimations()[0];
          a.pause();
          a.currentTime = 1400;
        }
        return {
          before,
          after: live.getBoundingClientRect().toJSON(),
          count: nodes.length,
          opacities: nodes.map((el) => Number(getComputedStyle(el).opacity)),
          families: nodes.map((el) => el.dataset.family),
          duration: nodes[0]?.getAnimations()[0].effect.getTiming().duration,
        };
      }, key);
      assert.equal(r.count, 2, key);
      assert.equal(r.duration, 1700);
      assert.ok(
        r.opacities.every((x) => x > 0 && x < 1),
        JSON.stringify(r),
      );
      for (const k of ["x", "y", "width", "height"])
        assert.ok(Math.abs(r.before[k] - r.after[k]) < 1, key + " " + k);
      audit.push({ key, ...r });
      await page.evaluate(() => BattleMotion.clear());
    }
    await page.evaluate(() => playAttackTargetFxV2116(2, "ice_flower", true));
    await page.screenshot({ path: `${root}/item-defense.png` });
    await page.waitForFunction(() => BattleMotion.activeCount() === 0);
    assert.equal(await page.locator(".bm-layer").count(), 0);
    return audit;
  });
  await test("Score rolls preserve group color and right anchor at all application zooms and redraw mid-roll", async () => {
    const samples = [];
    for (const zoom of [0.8, 1, 1.25]) {
      const { before, mid, redrawCount } = await page.evaluate((z) => {
        cancelItemScoreAnimations();
        applyZoom(z);
        const g = state.groups[0];
        g.score = 999;
        g.displayScore = 99;
        g.color = "#b93b65";
        renderGrid();
        itemScoreDisplayHoldV21732.set("1", 99);
        rollThenCommitScoreV21732(1, 99, 999);
        const el = document.querySelector("#score-val-1"),
          r = el.getBoundingClientRect(),
          before = { x: r.x, y: r.y, width: r.width, height: r.height };
        for (const a of el.getAnimations({ subtree: true })) {
          a.pause();
          a.currentTime = 460;
        }
        const ghost = el.querySelector(".score-roll-new"),
          mid = {
            color: getComputedStyle(ghost).color,
            right: ghost.getBoundingClientRect().right,
            hostRight: el.getBoundingClientRect().right,
            minWidth: el.style.minWidth,
          };
        renderGrid();
        return {
          before,
          mid,
          redrawCount: document.querySelectorAll(
            "#score-val-1 .score-roll-new",
          ).length,
        };
      }, zoom);
      assert.equal(mid.color, "rgb(185, 59, 101)");
      assert.ok(Math.abs(mid.right - mid.hostRight) < 1);
      assert.equal(mid.minWidth, "");
      assert.equal(redrawCount, 1);
      await page.waitForFunction(
        () =>
          !document
            .querySelector("#score-val-1")
            .classList.contains("score-roll-host"),
      );
      const after = await page.locator("#score-val-1").boundingBox();
      assert.ok(
        Math.abs(before.x + before.width - after.x - after.width) < 1,
        JSON.stringify({ before, after, zoom }),
      );
      assert.equal(await page.locator("#score-val-1").textContent(), "999分");
      assert.equal(
        await page
          .locator("#score-val-1")
          .evaluate((el) => getComputedStyle(el).color),
        "rgb(185, 59, 101)",
      );
      samples.push({ zoom, before, mid, after });
    }
    return samples;
  });
  await test("Real global draw fades in, preserves the same overlay across renders, holds result and fades out", async () => {
    const entry = await page.evaluate(() => {
      applyZoom(1);
      window.drawFadeProbe = null;
      window.originalDrawFade = BattleMotion.fadeDraw;
      BattleMotion.fadeDraw = (node) => {
        originalDrawFade(node);
        const a = node
          .getAnimations()
          .find((a) => a.effect.getTiming().duration === 620);
        if (!a) throw Error("missing fade");
        a.pause();
        a.currentTime = 340;
        window.drawFadeProbe = {
          opacity: Number(getComputedStyle(node).opacity),
          inventory: state.groups.map((g) => g.inventory.length),
          duration: a.effect.getTiming().duration,
          fading: node.parentElement.classList.contains("bm-draw-fading"),
        };
      };
      globalItemDraw();
      const el = document.querySelector(".card-item-roulette"),
        a = el
          .getAnimations()
          .find((a) => a.effect.getTiming().duration === 380);
      if (!a) throw Error("missing entry");
      a.pause();
      a.currentTime = 140;
      window.drawEntryNode = el;
      return Number(getComputedStyle(el).opacity);
    });
    assert.ok(entry > 0 && entry < 1);
    await page.screenshot({ path: `${root}/draw-enter.png` });
    await page.evaluate(() => {
      drawEntryNode.getAnimations().forEach((a) => a.finish());
      renderGrid();
    });
    assert.equal(
      await page.evaluate(
        () => document.querySelector(".card-item-roulette") === drawEntryNode,
      ),
      true,
    );
    assert.equal(
      await page.evaluate(() =>
        drawEntryNode.parentElement.classList.contains("item-draw-spinning"),
      ),
      true,
    );
    await page.waitForSelector(".card-item-roulette.reveal");
    assert.equal(
      await page.locator("#groupList .queue-main-slot:not(.empty)").count(),
      4,
    );
    assert.equal(
      await page.locator("#groupList .item-draw-spinning").count(),
      4,
    );
    await page.screenshot({ path: `${root}/draw-reveal.png` });
    await page.waitForFunction(() => window.drawFadeProbe);
    const fade = await page.evaluate(() => drawFadeProbe);
    assert.equal(fade.duration, 620);
    assert.equal(fade.fading, true);
    assert.ok(fade.opacity > 0 && fade.opacity < 1, JSON.stringify(fade));
    await page.screenshot({ path: `${root}/draw-fade.png` });
    await page.waitForFunction(() => !itemDrawBusy);
    assert.equal(await page.locator(".card-item-roulette").count(), 0);
    assert.ok(
      (
        await page.evaluate(() => state.groups.map((g) => g.inventory.length))
      ).every((n) => n === 1),
    );
    await page.evaluate(() => {
      BattleMotion.fadeDraw = originalDrawFade;
    });
    return { entry, fade };
  });
  await test("Hand reward draw also enters smoothly and still awards exactly one item", async () => {
    const entry = await page.evaluate(() => {
      openHandRaise();
      selectHandGroup(1);
      judgeHandRaise(true);
      handDrawItem();
      const el = document.querySelector("#handRewardBox .hand-item-draw-stage"),
        a = el
          .getAnimations()
          .find((a) => a.effect.getTiming().duration === 380);
      if (!a) throw Error("hand entry missing");
      a.pause();
      a.currentTime = 140;
      return Number(getComputedStyle(el).opacity);
    });
    assert.ok(entry > 0 && entry < 1);
    await page.waitForSelector("#handRewardBox .hand-item-capsule.reveal");
    assert.equal(
      await page.evaluate(() => state.groups[0].inventory.length),
      1,
    );
    await page.screenshot({ path: `${root}/hand-draw-reveal.png` });
    await page.keyboard.press("Escape");
  });
  await test("Persistent auras do not transform cards, and cancellation/reduced motion leave no effect sessions", async () => {
    const r = await page.evaluate(() => {
      const g = state.groups[0];
      g.itemEffect = { type: "mega", hitsLeft: 3 };
      renderGrid();
      const card = document.querySelector('#groupList [data-group-id="1"]'),
        aura = card.querySelector(".persistent-aura");
      playCasterCardFx("mega", 1);
      return {
        transform: getComputedStyle(card).transform,
        animation: getComputedStyle(aura).animationName,
        duration: getComputedStyle(aura).animationDuration,
      };
    });
    assert.ok(
      r.transform === "none" || r.transform === "matrix(1, 0, 0, 1, 0, 0)",
      r.transform,
    );
    assert.equal(r.animation, "auraBreath");
    assert.equal(r.duration, "2.8s");
    await page.evaluate(() => switchView("history"));
    assert.equal(await page.locator(".bm-layer").count(), 0);
    assert.equal(await page.evaluate(() => BattleMotion.activeCount()), 0);
    await page.evaluate(() => {
      switchView("battle");
      const motion = document.querySelector('[data-pref="motion"]');
      motion.value = "off";
      motion.dispatchEvent(new Event("change", { bubbles: true }));
      playCasterCardFx("star", 1);
    });
    assert.equal(await page.locator(".bm-layer").count(), 0);
    return r;
  });
  await test("Rapid score updates and undo cancel stale visual commits", async () => {
    const r = await page.evaluate(() => {
      const g = state.groups[0];
      g.score = 200;
      g.displayScore = 100;
      renderGrid();
      itemScoreDisplayHoldV21732.set("1", 100);
      rollThenCommitScoreV21732(1, 100, 200);
      g.score = 350;
      itemScoreDisplayHoldV21732.set("1", 200);
      rollThenCommitScoreV21732(1, 200, 350);
      return { actual: g.score };
    });
    assert.equal(r.actual, 350);
    await page.waitForFunction(() => activeScoreRollsV21732.size === 0);
    assert.equal(await page.locator("#score-val-1").textContent(), "350分");
    await page.evaluate(() => {
      const g = state.groups[0];
      g.score = 400;
      g.displayScore = 350;
      itemScoreDisplayHoldV21732.set("1", 350);
      rollThenCommitScoreV21732(1, 350, 400);
      switchView("history");
      switchView("battle");
    });
    assert.equal(await page.locator(".score-roll-ghost").count(), 0);
    assert.equal(await page.locator("#score-val-1").textContent(), "400分");
    await page.evaluate(() => {
      recordHistory("动画中撤销");
      const g = state.groups[0];
      g.score = 450;
      g.displayScore = 400;
      itemScoreDisplayHoldV21732.set("1", 400);
      rollThenCommitScoreV21732(1, 400, 450);
      playCasterCardFx("star", 1);
      undoLast();
    });
    assert.equal(await page.locator("#score-val-1").textContent(), "400分");
    assert.equal(
      await page.locator(".bm-layer,.score-roll-ghost").count(),
      0,
    );
  });
  await test("Skipping acknowledges committed visual state without suppressing the next operation", async () => {
    await page.evaluate(() => {
      state.groups[0].inventory = [{ key: "green", charges: 1 }];
      renderAll();
      state.groups[0].inventory = [{ key: "coin", charges: 1 }];
      DesktopUI.cancelAnimations();
      renderAll();
    });
    assert.equal(await page.locator(".bm-layer").count(), 0);
    await page.evaluate(() => {
      state.groups[0].inventory = [{ key: "red", charges: 1 }];
      renderAll();
    });
    assert.ok((await page.locator(".bm-layer").count()) > 0);
  });
  await test("Independent button slots are categorized, customizable and same-event click sound stays singular", async () => {
    const audit = await page.evaluate(async () => {
      await getAudioContext();
      fxSoundsLoaded = true;
      ClassroomFeedback.setOptions(
        { clickEnabled: true, clickVolume: 0.4 },
        { persist: false },
      );
      window.buttonProbe = [];
      window.originalButtonStart = AudioBufferSourceNode.prototype.start;
      AudioBufferSourceNode.prototype.start = function (...args) {
        buttonProbe.push(this.buffer);
        return originalButtonStart.apply(this, args);
      };
      for (const s of ActionSounds.slots)
        customFxBuffers[s.id] = audioCtx.createBuffer(
          1,
          100,
          audioCtx.sampleRate,
        );
      window.clickDefault = audioCtx.createBuffer(1, 101, audioCtx.sampleRate);
      customFxBuffers.ui_click = clickDefault;
      const b = document.createElement("button");
      b.id = "buttonSlotProbe";
      b.dataset.soundSlot = "ui_button_positive";
      b.textContent = "测试";
      b.onclick = () => playSound("ui_click");
      document.body.append(b);
      switchView("settings");
      DesktopUI.selectSettings("sound");
      renderFxSlotList();
      return {
        categories: [
          ...document.querySelectorAll(
            "#soundListContainer > details > summary",
          ),
        ].map((x) => x.textContent),
        slots: ActionSounds.slots.map((s) => ({
          id: s.id,
          listed: !!document.querySelector(
            `button[onclick="triggerUploadAudio('fx_${s.id}')"]`,
          ),
        })),
      };
    });
    assert.equal(audit.slots.length, 22);
    assert.ok(audit.slots.every((x) => x.listed));
    assert.equal(audit.categories.length, 7);
    await page.locator("#buttonSlotProbe").click();
    await page.waitForFunction(() =>
      buttonProbe.includes(customFxBuffers.ui_button_positive),
    );
    assert.equal(
      await page.evaluate(
        () =>
          buttonProbe.filter((x) => x === customFxBuffers.ui_button_positive)
            .length,
      ),
      1,
    );
    assert.equal(
      await page.evaluate(() => buttonProbe.includes(clickDefault)),
      false,
    );
    await page.evaluate(() => {
      ClassroomFeedback.setOptions({ clickEnabled: false }, { persist: false });
      const el = document.querySelector(
        `button[onclick="playSound('ui_button_positive')"]`,
      );
      for (let p = el.parentElement; p; p = p.parentElement)
        if (p.tagName === "DETAILS") p.open = true;
    });
    await page
      .locator(`button[onclick="playSound('ui_button_positive')"]`)
      .click();
    await page.waitForFunction(
      () =>
        buttonProbe.filter((x) => x === customFxBuffers.ui_button_positive)
          .length === 2,
    );
    await page.evaluate(() => {
      AudioBufferSourceNode.prototype.start = originalButtonStart;
      document.querySelector("#buttonSlotProbe").remove();
    });
    await page.locator("#soundListContainer").evaluate((el) => {
      for (let p = el.parentElement; p; p = p.parentElement)
        if (p.tagName === "DETAILS") p.open = true;
      el.querySelector("details").open = true;
    });
    await page.screenshot({ path: `${root}/audio-categories.png` });
    return audit;
  });
} finally {
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
  await browser.close();
  server.close();
}
if (results.some((x) => x.status !== "PASS") || errors.length)
  process.exitCode = 1;
