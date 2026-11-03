import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync, existsSync } from "node:fs";
import { webcrypto } from "node:crypto";
function load() {
  const c = vm.createContext({
    Blob,
    Uint8Array,
    TextEncoder,
    crypto: webcrypto,
    btoa: (s) => Buffer.from(s, "binary").toString("base64"),
  });
  if (existsSync("src/application/legacy-teaching-backup.js"))
    vm.runInContext(
      readFileSync("src/application/legacy-teaching-backup.js", "utf8"),
      c,
    );
  assert.ok(c.LegacyTeachingBackup, "read-only backup service must exist");
  return c.LegacyTeachingBackup;
}
const keys = [
  "godpower_teaching_schedule_v1",
  "godpower_active_classroom_context_v1",
  "godpower_classroom_roster_v1",
];
async function resource() {
  const blob = new Blob(["旧教学资料"]);
  return {
    resourceId: "resource-1",
    fileName: "old.txt",
    sha256: Buffer.from(
      await webcrypto.subtle.digest("SHA-256", await blob.arrayBuffer()),
    ).toString("hex"),
    byteSize: blob.size,
    blob,
  };
}
test("legacy export preserves exact raw strings and every verified resource without writes", async () => {
  const api = load(),
    entry = await resource(),
    original = new Map(
      keys.map((k, i) => [
        k,
        i === 0 ? " damaged{\n" : JSON.stringify({ old: i }),
      ]),
    );
  let closed = 0;
  const result = await api.collect({
    storage: { getItem: (k) => original.get(k) ?? null },
    openRepository: async () => ({
      exportAll: async () => [entry],
      close: () => closed++,
    }),
  });
  assert.equal(result.format, "godpower-legacy-teaching-backup");
  for (const k of keys) assert.equal(result.rawStorage[k], original.get(k));
  assert.equal(
    Buffer.from(result.resources[0].dataBase64, "base64").toString(),
    "旧教学资料",
  );
  assert.equal(closed, 1);
  assert.equal(original.size, 3);
});
test("missing or corrupt resources and quota bounds fail export instead of reporting partial success", async () => {
  const api = load(),
    entry = await resource();
  for (const rows of [[null], [{ ...entry, sha256: "0".repeat(64) }]]) {
    let closed = 0;
    await assert.rejects(
      api.collect({
        storage: { getItem: () => null },
        openRepository: async () => ({
          exportAll: async () => rows,
          close: () => closed++,
        }),
      }),
    );
    assert.equal(closed, 1);
  }
  await assert.rejects(
    api.collect({
      storage: { getItem: () => null },
      openRepository: async () => ({
        exportAll: async () => [entry],
        close() {},
      }),
      maxBytes: 1,
    }),
  );
});
test("storage failure is explicit and never falls back to an empty successful backup", async () => {
  await assert.rejects(
    load().collect({
      storage: {
        getItem() {
          throw Error("storage denied");
        },
      },
      openRepository: async () => {
        throw Error("must not open");
      },
    }),
    /storage denied/,
  );
});
