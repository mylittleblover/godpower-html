import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
test("default menu synth shares the hat filter and yields without changing note timing", async () => {
  const log = { filters: 0, yields: 0, notes: [], gains: [] };
  class Offline {
    constructor() {
      this.destination = {};
    }
    createOscillator() {
      return {
        frequency: { setValueAtTime: (...v) => log.notes.push(["freq", ...v]) },
        connect() {},
        start: (t) => log.notes.push(["start", t]),
        stop: (t) => log.notes.push(["stop", t]),
      };
    }
    createGain() {
      return {
        gain: {
          setValueAtTime: (...v) => log.gains.push(["set", ...v]),
          exponentialRampToValueAtTime: (...v) =>
            log.gains.push(["ramp", ...v]),
        },
        connect() {},
      };
    }
    createBiquadFilter() {
      log.filters++;
      return { frequency: {}, connect() {} };
    }
    createBuffer(ch, len) {
      return { getChannelData: () => new Float32Array(len) };
    }
    createBufferSource() {
      return { connect() {}, start() {} };
    }
    startRendering() {
      return Promise.resolve("buffer");
    }
  }
  const ctx = {
    audioCtx: { sampleRate: 1000 },
    menuCfg: { bpm: 120, loopEndBeat: 33, loopStartBeat: 1, gainTrims: {} },
    OfflineAudioContext: Offline,
    buildMenuPattern: () => ({
      bass: Array(128).fill(60),
      lead: Array(128).fill(72),
      hat: Array(128).fill(true),
    }),
    midiToFreq: (n) => n,
    scheduler: {
      yield: async () => {
        log.yields++;
      },
    },
    Math,
    console,
    setTimeout,
  };
  ctx.globalThis = ctx;
  vm.runInNewContext(
    readFileSync("src/runtime/audio/menu-synthesis.js", "utf8"),
    ctx,
  );
  assert.equal(await ctx.makeSynthMenuBuffer("test"), "buffer");
  assert.equal(
    log.filters,
    1,
    "one linear high-pass filter is shared by hat voices",
  );
  assert.ok(log.yields > 0, "node construction must let UI tasks run");
  assert.equal(log.notes.filter((x) => x[0] === "start").length, 256);
  assert.deepEqual(log.notes.filter((x) => x[0] === "start").slice(0, 4), [
    ["start", 0],
    ["start", 0],
    ["start", 0.03125],
    ["start", 0.03125],
  ]);
});
