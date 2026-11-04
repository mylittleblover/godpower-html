import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
test("menu synthesis superseded by a tempo change cannot replace the newer buffer", async () => {
  const jobs = [];
  const ctx = {
    menuCfg: { bpm: 120, loopStartBeat: 1, loopEndBeat: 33, gainTrims: {} },
    audioCtx: { sampleRate: 44100 },
    menuBgm: { buffers: {}, uploadedKeys: new Set() },
    db: null,
    makeSynthMenuBuffer: () => new Promise((resolve) => jobs.push(resolve)),
    console,
  };
  ctx.globalThis = ctx;
  vm.runInNewContext(
    readFileSync("src/runtime/audio/menu-transport.js", "utf8"),
    ctx,
  );
  const a = ctx.menuLoadBuffer("welcome_1");
  ctx.menuCfg.bpm = 140;
  const b = ctx.menuLoadBuffer("welcome_1");
  assert.equal(jobs.length, 2, "new timing needs its own synthesis job");
  jobs[1]("new");
  assert.equal(await b, "new");
  jobs[0]("old");
  assert.equal(await a, null);
  assert.equal(ctx.menuBgm.buffers.welcome_1, "new");
});

test("same-config menu requests share work and preserve uploaded audio priority", async () => {
  let reads = 0,
    decodes = 0,
    synths = 0;
  const uploaded = { duration: 8, sampleRate: 44100 };
  const ctx = {
    menuCfg: { bpm: 120, loopStartBeat: 1, loopEndBeat: 33, gainTrims: {} },
    audioCtx: {
      sampleRate: 44100,
      decodeAudioData: async () => {
        decodes++;
        return uploaded;
      },
    },
    menuBgm: { buffers: {}, uploadedKeys: new Set() },
    normalizeWelcomeLoopBuffer: (_, buf) => buf,
    db: {
      transaction: () => ({
        objectStore: () => ({
          get: () => {
            reads++;
            const req = {};
            queueMicrotask(() => {
              req.result = { arrayBuffer: new ArrayBuffer(8) };
              req.onsuccess();
            });
            return req;
          },
        }),
      }),
    },
    makeSynthMenuBuffer: async () => {
      synths++;
      return "fallback";
    },
    console,
  };
  ctx.globalThis = ctx;
  vm.runInNewContext(
    readFileSync("src/runtime/audio/menu-transport.js", "utf8"),
    ctx,
  );
  const [a, b] = await Promise.all([
    ctx.menuLoadBuffer("welcome_1"),
    ctx.menuLoadBuffer("welcome_1"),
  ]);
  assert.equal(a, uploaded);
  assert.equal(b, uploaded);
  assert.equal(reads, 1);
  assert.equal(decodes, 1);
  assert.equal(synths, 0);
  assert.ok(ctx.menuBgm.uploadedKeys.has("welcome_1"));
  assert.equal(await ctx.menuLoadBuffer("welcome_1"), uploaded);
  assert.equal(reads, 1);
});

test("live menu volume trims do not rebuild an already loaded music buffer", async () => {
  let builds = 0;
  const buffer = { duration: 4 };
  const ctx = {
    menuCfg: {
      bpm: 120,
      loopStartBeat: 1,
      loopEndBeat: 33,
      gainTrims: { welcome_1: 1 },
    },
    audioCtx: { sampleRate: 44100 },
    menuBgm: { buffers: {}, uploadedKeys: new Set() },
    db: null,
    makeSynthMenuBuffer: async () => {
      builds++;
      return buffer;
    },
    console,
  };
  ctx.globalThis = ctx;
  vm.runInNewContext(
    readFileSync("src/runtime/audio/menu-transport.js", "utf8"),
    ctx,
  );
  assert.equal(await ctx.menuLoadBuffer("welcome_1"), buffer);
  ctx.menuCfg.gainTrims.welcome_1 = 0.5;
  assert.equal(await ctx.menuLoadBuffer("welcome_1"), buffer);
  assert.equal(builds, 1);
});

test("a sole pending menu request restarts with the latest tempo instead of going silent", async () => {
  const jobs = [];
  const ctx = {
    menuCfg: { bpm: 120, loopStartBeat: 1, loopEndBeat: 33, gainTrims: {} },
    audioCtx: { sampleRate: 44100 },
    menuBgm: { buffers: {}, uploadedKeys: new Set() },
    db: null,
    makeSynthMenuBuffer: () => new Promise((resolve) => jobs.push(resolve)),
    console,
  };
  ctx.globalThis = ctx;
  vm.runInNewContext(
    readFileSync("src/runtime/audio/menu-transport.js", "utf8"),
    ctx,
  );
  const result = ctx.menuLoadBuffer("welcome_1");
  ctx.menuCfg.bpm = 130;
  jobs[0]("obsolete");
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(jobs.length, 2);
  jobs[1]("latest");
  assert.equal(await result, "latest");
  assert.equal(ctx.menuBgm.buffers.welcome_1, "latest");
});

test("debounced tempo restart reuses the latest already prepared buffer", async () => {
  let builds = 0,
    scheduled;
  const ctx = {
    menuCfg: { bpm: 120, loopStartBeat: 1, loopEndBeat: 33, gainTrims: {} },
    audioCtx: { sampleRate: 44100, currentTime: 1 },
    menuBgm: {
      buffers: {},
      uploadedKeys: new Set(),
      active: true,
      currentKey: "welcome_1",
      voices: [],
    },
    db: null,
    makeSynthMenuBuffer: async () => ({ duration: ++builds }),
    setTimeout: (fn) => {
      scheduled = fn;
      return 1;
    },
    clearTimeout() {},
    console,
  };
  ctx.globalThis = ctx;
  vm.runInNewContext(
    readFileSync("src/runtime/audio/menu-transport.js", "utf8"),
    ctx,
  );
  ctx.menuSpawnVoice = () => ({});
  ctx.menuVoiceRamp = () => {};
  ctx.MENU_FADE_SEC = 0.1;
  await ctx.menuLoadBuffer("welcome_1");
  ctx.menuCfg.bpm = 140;
  await ctx.menuLoadBuffer("welcome_1");
  ctx.menuScheduleReload();
  await scheduled();
  assert.equal(
    builds,
    2,
    "tempo restart must not synthesize the same latest buffer twice",
  );
});
