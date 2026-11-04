import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { launch } from "../fixtures/browser.mjs";
const old = execFileSync(
    "git",
    ["show", "9cf88f1:src/runtime/audio/menu-synthesis.js"],
    { encoding: "utf8" },
  ),
  next = await readFile("src/runtime/audio/menu-synthesis.js", "utf8"),
  browser = await launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const result = await page.evaluate(
    async ({ old, next }) => {
      const cfg = {
          bpm: 120,
          loopStartBeat: 1,
          loopEndBeat: 33,
          gainTrims: { test: 1 },
        },
        audio = { sampleRate: 44100 };
      const pattern = () => ({
        bass: Array.from({ length: 128 }, (_, i) => (i % 4 === 0 ? 48 : 0)),
        lead: Array.from({ length: 128 }, (_, i) => (i % 2 === 0 ? 72 : 0)),
        hat: Array(128).fill(true),
      });
      const factory = (source) =>
        new Function(
          "audioCtx",
          "menuCfg",
          "buildMenuPattern",
          "midiToFreq",
          source + "\nreturn makeSynthMenuBuffer;",
        )(audio, cfg, pattern, (n) => 440 * 2 ** ((n - 69) / 12));
      const previousRandom = Math.random;
      function seed() {
        let x = 12345;
        Math.random = () => (x = (1664525 * x + 1013904223) >>> 0) / 4294967296;
      }
      try {
        seed();
        const a = await factory(old)("test");
        seed();
        const b = await factory(next)("test");
        const x = a.getChannelData(0),
          y = b.getChannelData(0);
        let max = 0,
          sum = 0,
          energy = 0;
        for (let i = 0; i < x.length; i++) {
          const d = x[i] - y[i];
          max = Math.max(max, Math.abs(d));
          sum += d * d;
          energy += x[i] * x[i];
        }
        return {
          lengths: [x.length, y.length],
          sampleRates: [a.sampleRate, b.sampleRate],
          maxDifference: max,
          rmsDifference: Math.sqrt(sum / x.length),
          rms: Math.sqrt(energy / x.length),
        };
      } finally {
        Math.random = previousRandom;
      }
    },
    { old, next },
  );
  assert.equal(result.lengths[0], result.lengths[1]);
  assert.deepEqual(result.sampleRates, [44100, 44100]);
  assert.ok(result.rms > 0.001);
  assert.ok(result.maxDifference < 0.00001, JSON.stringify(result));
  await mkdir("artifacts/menu-synth-performance", { recursive: true });
  await writeFile(
    "artifacts/menu-synth-performance/pcm-equivalence.json",
    JSON.stringify(
      {
        status: "PASS",
        environment:
          "Chromium actual OfflineAudioContext; not a human listening test",
        ...result,
      },
      null,
      2,
    ),
  );
  console.log(JSON.stringify(result));
} finally {
  await browser.close();
}
