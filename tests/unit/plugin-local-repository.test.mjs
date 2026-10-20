import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import test from "node:test";

const source = await readFile(
  "src/infrastructure/plugin-local-repository.js",
  "utf8",
);
function load(storage) {
  const sandbox = { structuredClone };
  sandbox.globalThis = sandbox;
  vm.runInNewContext(source, sandbox);
  return sandbox.GodPowerPluginLocalRepository.createPluginLocalRepository(
    storage,
  );
}
function memoryStorage(initial = null) {
  const values = new Map(
    initial === null ? [] : [["godpower_plugins_v1", initial]],
  );
  return {
    values,
    getItem: (key) => (values.has(key) ? values.get(key) : null),
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

test("plugin records roundtrip independently by ID", () => {
  const storage = memoryStorage();
  const repository = load(storage);
  repository.save("community.one", { state: "installed", data: { x: 1 } });
  repository.save("community.two", { state: "installed", data: { x: 2 } });
  assert.deepEqual(
    JSON.parse(JSON.stringify(repository.load("community.one"))),
    { state: "installed", data: { x: 1 } },
  );
  assert.equal(repository.list().length, 2);
  repository.delete("community.one");
  assert.equal(repository.load("community.one"), null);
  assert.equal(repository.list().length, 1);
});

test("corrupt repository fails closed and preserves source bytes", () => {
  const storage = memoryStorage("{bad json");
  const repository = load(storage);
  assert.throws(() => repository.list(), /corrupt/i);
  assert.equal(storage.getItem("godpower_plugins_v1"), "{bad json");
});

test("storage write and readback failures are surfaced without claiming success", () => {
  const storage = memoryStorage();
  const repository = load(storage);
  repository.save("community.one", { state: "old" });
  const original = storage.getItem("godpower_plugins_v1");
  storage.setItem = () => {
    throw new Error("quota");
  };
  assert.throws(
    () => repository.save("community.one", { state: "new" }),
    /quota/i,
  );
  assert.equal(storage.getItem("godpower_plugins_v1"), original);
});

test("readback mismatch restores the previous plugin repository bytes", () => {
  const storage = memoryStorage();
  const repository = load(storage);
  repository.save("community.one", { state: "old" });
  const original = storage.getItem("godpower_plugins_v1");
  const getItem = storage.getItem;
  let mismatchOnce = true;
  storage.getItem = (key) => {
    const actual = getItem(key);
    if (mismatchOnce && actual !== original) {
      mismatchOnce = false;
      return "different bytes";
    }
    return actual;
  };
  assert.throws(
    () => repository.save("community.one", { state: "new" }),
    /readback/i,
  );
  assert.equal(getItem("godpower_plugins_v1"), original);
});
