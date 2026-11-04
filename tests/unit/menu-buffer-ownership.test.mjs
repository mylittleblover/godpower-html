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
