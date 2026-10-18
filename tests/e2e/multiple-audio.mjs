import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { launch, setup } from "../fixtures/browser.mjs";
function wav(freq = 440) {
  const n = 1600,
    b = Buffer.alloc(44 + n * 2);
  b.write("RIFF");
  b.writeUInt32LE(b.length - 8, 4);
  b.write("WAVEfmt ", 8);
  b.writeUInt32LE(16, 16);
  b.writeUInt16LE(1, 20);
  b.writeUInt16LE(1, 22);
  b.writeUInt32LE(16000, 24);
  b.writeUInt32LE(32000, 28);
  b.writeUInt16LE(2, 32);
  b.writeUInt16LE(16, 34);
  b.write("data", 36);
  b.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++)
    b.writeInt16LE(
      Math.round(Math.sin((i / 16000) * freq * Math.PI * 2) * 3000),
      44 + i * 2,
    );
  return b;
}

const html = await readFile("dist/godpower.html"),
  server = createServer((q, r) => r.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch(),
  page = await browser.newPage({ viewport: { width: 1366, height: 768 } }),
  results = [],
  errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.setDefaultTimeout(15000);
page.setDefaultNavigationTimeout(60000);
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
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  await setup(page);
  await test("Multiple WAV upload keeps legacy primary and appends two persistent candidates", async () => {
    const primaryChooser = page.waitForEvent("filechooser");
    await page.evaluate(() => {
      ClassroomFeedback.setOptions({ clickEnabled: false }, { persist: false });
      triggerUploadAudio("fx_ui_click");
    });
    await (
      await primaryChooser
    ).setFiles({
      name: "primary.wav",
      mimeType: "audio/wav",
      buffer: wav(220),
    });
    await page.waitForFunction(() => soundIdCache.has("fx_ui_click"));
    const appendChooser = page.waitForEvent("filechooser");
    await page.evaluate(() => triggerUploadAudio("fx_ui_click", true));
    await (
      await appendChooser
    ).setFiles([
      { name: "second.wav", mimeType: "audio/wav", buffer: wav(440) },
      {
        name: "<img src=x onerror=alert(1)>.wav",
        mimeType: "audio/wav",
        buffer: wav(880),
      },
    ]);
    await page.waitForFunction(
      () =>
        customFxVariants.ui_click?.length === 2 &&
        [...soundIdCache].filter((x) => x.startsWith("fx_ui_click::variant::"))
          .length === 2,
    );
    await page.evaluate(() => {
      switchView("settings");
      DesktopUI.selectSettings("sound");
      renderFxSlotList();
      renderItemFxSoundListV26();
    });
    assert.equal(await page.locator(".cf-audio-choices").count(), 41);
    assert.equal(await page.locator(".cf-audio-choices img").count(), 0);
    return await page.evaluate(() => ({
      primary: !!customFxBuffers.ui_click,
      candidates: customFxVariants.ui_click.map((x) => x.name),
    }));
  });
  await test("Actual playback randomly selects exactly one sample without consuming game Math.random", async () =>
    page.evaluate(async () => {
      const pool = [
        customFxBuffers.ui_click,
        ...customFxVariants.ui_click.map((x) => x.buffer),
      ];
      const deterministic = [0, 0.5, 0.999999].map((n) =>
        pool.indexOf(selectFxBuffer("ui_click", () => n)),
      );
      if (JSON.stringify(deterministic) !== "[0,1,2]")
        throw Error("selection bounds");
      const originalStart = AudioBufferSourceNode.prototype.start,
        originalRandom = Math.random,
        originalCrypto = crypto.getRandomValues.bind(crypto),
        played = [];
      AudioBufferSourceNode.prototype.start = function (...args) {
        played.push(this.buffer);
        return originalStart.apply(this, args);
      };
      Math.random = () => {
        throw Error("game random must not be consumed");
      };
      let index = 0;
      crypto.getRandomValues = (a) => {
        a[0] = [0, 2147483648, 4294967295][index++ % 3];
        return a;
      };
      try {
        for (let i = 0; i < 3; i++) await _v2174PlaySound("ui_click");
      } finally {
        Math.random = originalRandom;
        crypto.getRandomValues = originalCrypto;
        AudioBufferSourceNode.prototype.start = originalStart;
      }
      const selected = played.map((b) => pool.indexOf(b));
      if (JSON.stringify(selected) !== "[0,1,2]")
        throw Error(JSON.stringify(selected));
      return { deterministic, selected };
    }));
  await test("Real reload restores primary, candidate count and filenames", async () => {
    await page.reload({ waitUntil: "domcontentloaded", timeout: 60000 });
    await setup(page);
    await page.evaluate(async () => {
      await getAudioContext();
      fxSoundsLoaded = false;
      await loadFxSounds();
    });
    assert.equal(
      await page.evaluate(() => customFxVariants.ui_click.length),
      2,
    );
    assert.equal(await page.evaluate(() => !!customFxBuffers.ui_click), true);
  });
  await test("Audio BIN export and import preserve all choices and old primary format", async () => {
    const [file] = await Promise.all([
      page.waitForEvent("download"),
      page.evaluate(() => exportAudioBundle()),
    ]);
    const path = await file.path(),
      buffer = await readFile(path);
    const count = JSON.parse(
      buffer.subarray(8, 8 + buffer.readUInt32LE(4)).toString(),
    );
    assert.equal(count.length, 3);
    assert.ok(count.find((x) => x.id === "fx_ui_click"));
    await page.evaluate(() => deleteFxTrack("fx_ui_click", "ui_click"));
    assert.equal(await page.evaluate(() => !!customFxVariants.ui_click), false);
    await page.locator("#bundleFileInput").setInputFiles({
      name: "choices.bin",
      mimeType: "application/octet-stream",
      buffer,
    });
    await page.waitForFunction(() => customFxVariants.ui_click?.length === 2);
    assert.equal(
      await page.evaluate(() =>
        customFxVariants.ui_click.some((x) => x.name === "second.wav"),
      ),
      true,
    );
    return { records: count.length };
  });
  await test("Per-item and looping sounds share selection; removing one candidate preserves others", async () => {
    const checks = await page.evaluate(async () => {
      const keys = [...PER_ITEM_SOUND_IDS_V2174],
        base = customFxBuffers.ui_click,
        extra = customFxVariants.ui_click[0].buffer;
      const original = crypto.getRandomValues.bind(crypto),
        start = AudioBufferSourceNode.prototype.start,
        played = [];
      crypto.getRandomValues = (a) => {
        a[0] = 4294967295;
        return a;
      };
      AudioBufferSourceNode.prototype.start = function (...args) {
        played.push(this.buffer);
        return start.apply(this, args);
      };
      try {
        for (const key of keys) {
          customFxBuffers[key] = base;
          customFxVariants[key] = [{ buffer: extra }];
          await playSound(key);
        }
        customFxBuffers.roll_loop = base;
        customFxVariants.roll_loop = [{ buffer: extra }];
        startRollLoop();
        stopRollLoop();
      } finally {
        crypto.getRandomValues = original;
        AudioBufferSourceNode.prototype.start = start;
      }
      if (played.length !== 27 || played.some((x) => x !== extra))
        throw Error("per-item or loop selection failed");
      await deleteFxCandidate(customFxVariants.ui_click[0].id);
      if (customFxVariants.ui_click.length !== 1 || !customFxBuffers.ui_click)
        throw Error("individual remove damaged primary");
      return { perItem: keys.length, loop: 1, remaining: 2 };
    });
    return checks;
  });
  await test("Failed restore transaction retains the primary and remaining candidate", async () =>
    page.evaluate(async () => {
      const original = db.transaction.bind(db);
      db.transaction = function (names, mode) {
        const tx = original(names, mode);
        if (mode === "readwrite") queueMicrotask(() => tx.abort());
        return tx;
      };
      try {
        await deleteFxTrack("fx_ui_click", "ui_click");
      } finally {
        db.transaction = original;
      }
      if (!customFxBuffers.ui_click || customFxVariants.ui_click.length !== 1)
        throw Error("failed restore changed live choices");
      const records = await new Promise((resolve) => {
        const req = db.transaction("sounds").objectStore("sounds").getAll();
        req.onsuccess = () =>
          resolve(
            req.result.filter(
              (x) =>
                x.id === "fx_ui_click" ||
                x.id.startsWith("fx_ui_click::variant::"),
            ).length,
          );
      });
      if (records !== 2) throw Error("failed restore changed disk choices");
      return { records };
    }));
  await page.evaluate(() => {
    switchView("settings");
    DesktopUI.selectSettings("sound");
    renderFxSlotList();
  });
  const row = page.locator("#soundListContainer .sound-row").filter({
    has: page.locator("[onclick=\"triggerUploadAudio('fx_ui_click',true)\"]"),
  });
  await row.evaluate((el) => {
    for (let p = el.parentElement; p; p = p.parentElement)
      if (p.tagName === "DETAILS") p.open = true;
  });
  await row.locator("details").evaluate((el) => (el.open = true));
  await row.screenshot({
    path: "artifacts/classroom-feedback/multiple-audio-settings.png",
  });
  assert.deepEqual(errors, []);
} finally {
  await mkdir("artifacts/classroom-feedback", { recursive: true });
  await writeFile(
    "artifacts/classroom-feedback/multiple-audio-results.json",
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
if (results.some((x) => x.status === "FAIL") || errors.length)
  process.exitCode = 1;
