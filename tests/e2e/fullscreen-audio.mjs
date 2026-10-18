import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
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

const server = createServer(async (q, r) =>
  r.end(await readFile("dist/godpower.html")),
);
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch(),
  page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  }),
  results = [],
  errors = [];
page.on("pageerror", (e) => errors.push(e.message));
try {
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  await setup(page);
  for (const slot of [
    "fullscreen_pick",
    "fullscreen_score_add",
    "fullscreen_score_sub",
  ]) {
    const chooser = page.waitForEvent("filechooser");
    await page.evaluate((slot) => triggerUploadAudio("fx_" + slot, true), slot);
    await (
      await chooser
    ).setFiles([
      { name: slot + "-1.wav", mimeType: "audio/wav", buffer: wav(220) },
      { name: slot + "-2.wav", mimeType: "audio/wav", buffer: wav(660) },
    ]);
    await page
      .waitForFunction((slot) => customFxVariants[slot]?.length === 2, slot, {
        timeout: 10000,
      })
      .catch(async (e) => {
        console.error(
          "Audio upload diagnostics",
          await page.evaluate(() => ({
            keys: Object.keys(customFxVariants),
            ids: [...soundIdCache],
            loaded: fxSoundsLoaded,
            loading: !!fxSoundsLoading,
            db: !!db,
            toast: document.getElementById("toast")?.textContent,
          })),
        );
        throw e;
      });
    const detail = await page.evaluate(async (slot) => {
      const pool = customFxVariants[slot].map((x) => x.buffer);
      const bounds = [0, 0.9999].map((n) =>
        pool.indexOf(selectFxBuffer(slot, () => n)),
      );
      const start = AudioBufferSourceNode.prototype.start,
        played = [];
      AudioBufferSourceNode.prototype.start = function (...args) {
        played.push(this.buffer);
        return start.apply(this, args);
      };
      try {
        await playSound(slot);
      } finally {
        AudioBufferSourceNode.prototype.start = start;
      }
      return {
        bounds,
        played: played.length,
        belongs: played.every((b) => pool.includes(b)),
      };
    }, slot);
    assert.deepEqual(detail, { bounds: [0, 1], played: 1, belongs: true });
    results.push({ slot, status: "PASS", detail });
  }
  await page.evaluate(() => {
    switchView("settings");
    DesktopUI.selectSettings("sound");
    renderFxSlotList();
  });
  for (const label of ["全屏点名揭晓", "全屏加分展示", "全屏扣分展示"])
    assert.ok(await page.getByText(label, { exact: true }).count());
  await mkdir("artifacts/fullscreen-audio", { recursive: true });
  await page.screenshot({ path: "artifacts/fullscreen-audio/settings.png" });
  await page.reload({ waitUntil: "domcontentloaded" });
  await setup(page);
  await page.evaluate(async () => {
    await getAudioContext();
    fxSoundsLoaded = false;
    await loadFxSounds();
  });
  for (const slot of [
    "fullscreen_pick",
    "fullscreen_score_add",
    "fullscreen_score_sub",
  ])
    assert.equal(
      await page.evaluate((s) => customFxVariants[s]?.length, slot),
      2,
    );
  assert.deepEqual(errors, []);
  await writeFile(
    "artifacts/fullscreen-audio/results.json",
    JSON.stringify(
      { status: "PASS", results, reload: "PASS", errors },
      null,
      2,
    ),
  );
  console.log(
    "PASS: 3 fullscreen sound slots, uploads, random playback, settings and real reload",
  );
} finally {
  await browser.close();
  server.close();
}
