import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html"),
  root = "artifacts/classroom-feedback";
await mkdir(root, { recursive: true });
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
p.on("pageerror", (e) => errors.push(e.message));
p.setDefaultTimeout(20000);
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
  await p.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  await setup(p);
  await p.evaluate(() => {
    window.audBufferProbe = [];
    window.savedSourceStart = AudioBufferSourceNode.prototype.start;
    AudioBufferSourceNode.prototype.start = function (...args) {
      audBufferProbe.push(this.buffer);
      return savedSourceStart.apply(this, args);
    };
  });
  await test("Real WAV input uploads to custom button click slot and persists in IndexedDB", async () => {
    await p.evaluate(() => {
      currentUploadingSlot = "fx_ui_click";
    });
    await p
      .locator("#soundFileInput")
      .setInputFiles({
        name: "button.wav",
        mimeType: "audio/wav",
        buffer: wav(),
      });
    await p.waitForFunction(
      () => !!customFxBuffers.ui_click && soundIdCache.has("fx_ui_click"),
    );
    const stored = await p.evaluate(
      () =>
        new Promise((resolve, reject) => {
          const r = db
            .transaction("sounds")
            .objectStore("sounds")
            .get("fx_ui_click");
          r.onsuccess = () => resolve(r.result.arrayBuffer.byteLength);
          r.onerror = reject;
        }),
    );
    assert.equal(stored, wav().length);
    return { bytes: stored };
  });
  await test("Actual mouse and keyboard clicks each play one uploaded sample; opt-out and master mute work", async () => {
    await p.evaluate(() => {
      ClassroomFeedback.setOptions({ clickEnabled: true, clickVolume: 0.3 });
      window.clickSample = customFxBuffers.ui_click;
      audBufferProbe = [];
      const b = document.createElement("button");
      b.id = "audioRegressionButton";
      b.textContent = "测试按钮音效";
      b.onclick = () => playSound("ui_click");
      document.body.append(b);
    });
    await p.locator("#audioRegressionButton").click();
    await p.waitForFunction(
      () => audBufferProbe.filter((x) => x === clickSample).length === 1,
    );
    await p.locator("#audioRegressionButton").press("Space");
    await p.waitForFunction(
      () => audBufferProbe.filter((x) => x === clickSample).length === 2,
    );
    const before = await p.evaluate(
      () => audBufferProbe.filter((x) => x === clickSample).length,
    );
    await p.evaluate(() =>
      ClassroomFeedback.setOptions({ clickEnabled: false }),
    );
    await p.locator("#audioRegressionButton").click();
    await p.waitForTimeout(100);
    assert.equal(
      await p.evaluate(
        () => audBufferProbe.filter((x) => x === clickSample).length,
      ),
      before,
    );
    await p.evaluate(() => updateMasterVolume(0));
    await p.waitForFunction(() => masterGainNode.gain.value === 0);
    const muted = await p.evaluate(() => masterGainNode.gain.value);
    assert.equal(muted, 0);
    await p.evaluate(() => {
      updateMasterVolume(0.5);
      document.getElementById("audioRegressionButton").remove();
    });
    return { mouseAndKeyboardSamples: before, muted };
  });
  await test("Concurrent file reads cannot cross-write another sound slot", async () => {
    const a = wav(500),
      b = wav(900);
    await p.evaluate(
      ({ a, b }) => {
        delete customFxBuffers.score_add;
        delete customFxBuffers.score_sub;
        soundIdCache.delete("fx_score_add");
        soundIdCache.delete("fx_score_sub");
        currentUploadingSlot = "fx_score_add";
        handleSoundFileUpload({
          target: {
            files: [
              new File([Uint8Array.from(a)], "one.wav", { type: "audio/wav" }),
            ],
            value: "",
          },
        });
        currentUploadingSlot = "fx_score_sub";
        handleSoundFileUpload({
          target: {
            files: [
              new File([Uint8Array.from(b)], "two.wav", { type: "audio/wav" }),
            ],
            value: "",
          },
        });
      },
      { a: [...a], b: [...b] },
    );
    await p.waitForFunction(
      () =>
        !!customFxBuffers.score_add &&
        !!customFxBuffers.score_sub &&
        soundIdCache.has("fx_score_add") &&
        soundIdCache.has("fx_score_sub"),
    );
    const samples = await p.evaluate(async () => {
      const get = (id) =>
        new Promise((r) => {
          const req = db.transaction("sounds").objectStore("sounds").get(id);
          req.onsuccess = () =>
            r([...new Uint8Array(req.result.arrayBuffer)].slice(44, 64));
        });
      return Promise.all(["fx_score_add", "fx_score_sub"].map(get));
    });
    assert.deepEqual(samples[0], [...a].slice(44, 64));
    assert.deepEqual(samples[1], [...b].slice(44, 64));
    return samples;
  });
  await test("Storage abort keeps old uploaded audio on disk and explicitly warns unsaved", async () => {
    const original = await p.evaluate(
      () =>
        new Promise((r) => {
          const q = db
            .transaction("sounds")
            .objectStore("sounds")
            .get("fx_ui_click");
          q.onsuccess = () =>
            r([...new Uint8Array(q.result.arrayBuffer)].slice(44, 64));
        }),
    );
    await p.evaluate(() => {
      window.realAudioTransaction = db.transaction.bind(db);
      db.transaction = function (names, mode) {
        const tx = realAudioTransaction(names, mode);
        if (mode === "readwrite") queueMicrotask(() => tx.abort());
        return tx;
      };
      currentUploadingSlot = "fx_ui_click";
    });
    await p
      .locator("#soundFileInput")
      .setInputFiles({
        name: "unsaved.wav",
        mimeType: "audio/wav",
        buffer: wav(1300),
      });
    await p.waitForFunction(() =>
      document.getElementById("toast").textContent.includes("未保存"),
    );
    await p.evaluate(() => {
      db.transaction = realAudioTransaction;
    });
    const after = await p.evaluate(
      () =>
        new Promise((r) => {
          const q = db
            .transaction("sounds")
            .objectStore("sounds")
            .get("fx_ui_click");
          q.onsuccess = () =>
            r([...new Uint8Array(q.result.arrayBuffer)].slice(44, 64));
        }),
    );
    assert.deepEqual(after, original);
    return { diskPreserved: true };
  });
  await test("Corrupt audio preserves existing decoded custom slot", async () => {
    await p.evaluate(() => {
      window.previousUiClick = customFxBuffers.ui_click;
      currentUploadingSlot = "fx_ui_click";
    });
    await p
      .locator("#soundFileInput")
      .setInputFiles({
        name: "bad.wav",
        mimeType: "audio/wav",
        buffer: Buffer.from("invalid audio"),
      });
    await p.waitForSelector("#themeDialogV21727.active");
    assert.equal(
      await p.evaluate(() => previousUiClick === customFxBuffers.ui_click),
      true,
    );
    await p.keyboard.press("Escape");
    await p.locator("#themeDialogV21727").waitFor({ state: "hidden" });
  });
  await test("Default loop preview produces a fallback sound when no upload exists", async () => {
    const count = await p.evaluate(async () => {
      delete customFxBuffers.roll_loop;
      let n = 0;
      const create = audioCtx.createOscillator.bind(audioCtx);
      audioCtx.createOscillator = () => {
        n++;
        return create();
      };
      try {
        await playSound("roll_loop");
        return n;
      } finally {
        audioCtx.createOscillator = create;
      }
    });
    assert.ok(count > 0);
    return { oscillators: count };
  });
  assert.deepEqual(errors, []);
} finally {
  await c.close();
  await browser.close();
  server.close();
  await writeFile(
    `${root}/audio-results.json`,
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
