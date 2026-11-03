import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
import { saveCore } from "../fixtures/save-v2.mjs";
test("desktop chooses the bounded native backend without opening a second authoritative database", async () => {
  const { context } = saveCore();
  const calls = [];
  context.godpowerDesktop = {
    role: "main",
    saveVault: {
      list: async () => ({ ok: true, index: { generation: 4 } }),
      load: async (id) => {
        calls.push(id);
        return { ok: true, document: { saveId: id } };
      },
      getSource: async () => ({
        sourceDigest: "test",
        sourceText: "unchanged原文",
      }),
      getAsset: async () => ({
        mimeType: "image/png",
        dataBase64: "AAAA",
        byteLength: 3,
      }),
    },
  };
  vm.runInContext(
    readFileSync("src/infrastructure/save-repository.js", "utf8"),
    context,
  );
  const repo = await context.SaveRepository.open();
  assert.equal(repo.backend, "native");
  assert.equal((await repo.list()).index.generation, 4);
  assert.equal((await repo.load("save-test")).document.saveId, "save-test");
  assert.deepEqual(calls, ["save-test"]);
  assert.equal(
    await (await repo.getSource("test")).raw.text(),
    "unchanged原文",
  );
  assert.equal((await repo.getAsset("test")).raw.size, 3);
  repo.close();
});
test("native failures are returned without silently falling back to an empty browser library", async () => {
  const { context } = saveCore();
  context.godpowerDesktop = {
    role: "main",
    saveVault: { list: async () => ({ ok: false, code: "DISK_UNAVAILABLE" }) },
  };
  vm.runInContext(
    readFileSync("src/infrastructure/save-repository.js", "utf8"),
    context,
  );
  const repo = await context.SaveRepository.open();
  assert.equal((await repo.list()).code, "DISK_UNAVAILABLE");
});
