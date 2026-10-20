import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";

const scope = vm.createContext({});
vm.runInContext(
  readFileSync("src/domain/home-layout.js", "utf8") +
    readFileSync("src/infrastructure/home-layout-repository.js", "utf8"),
  scope,
);
const { HomeLayout, HomeLayoutRepository } = scope;
const layout = () => HomeLayout.emptyLayout("layout-main", "默认布局");

function memoryStorage() {
  const values = new Map();
  return {
    values,
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
  };
}

test("isolated layout repository previews legacy fixed home without writing", () => {
  const storage = memoryStorage();
  const repo = HomeLayoutRepository.createHomeLayoutRepository({ storage });
  const preview = repo.previewLegacyMigration(layout());
  assert.equal(preview.ok, true);
  assert.equal(preview.source, "legacy-fixed-home");
  assert.equal(preview.requiresConfirmation, true);
  assert.equal(JSON.stringify(preview.layout), JSON.stringify(layout()));
  assert.equal(storage.values.size, 0);
  assert.equal(repo.read().revision, 0);
});

test("layout writes verify, advance revision, and reject stale writers", () => {
  const storage = memoryStorage();
  const repo = HomeLayoutRepository.createHomeLayoutRepository({ storage });
  const first = repo.write(layout(), { expectedRevision: 0 });
  assert.equal(first.ok, true);
  assert.equal(first.revision, 1);
  assert.equal(repo.read().revision, 1);
  const stale = repo.write(layout(), { expectedRevision: 0 });
  assert.deepEqual(JSON.parse(JSON.stringify(stale)), {
    ok: false,
    code: "REVISION_CONFLICT",
    revision: 1,
  });
});

test("corrupt data and storage failures never silently replace saved layouts", () => {
  const storage = memoryStorage();
  const repo = HomeLayoutRepository.createHomeLayoutRepository({ storage });
  storage.setItem(HomeLayoutRepository.KEY, "not-json");
  assert.equal(repo.read().code, "CORRUPT_REPOSITORY");
  assert.equal(repo.write(layout(), { expectedRevision: 0 }).ok, false);

  const failing = memoryStorage();
  const failRepo = HomeLayoutRepository.createHomeLayoutRepository({
    storage: {
      getItem: failing.getItem.bind(failing),
      removeItem: failing.removeItem.bind(failing),
      setItem() {
        throw new Error("quota exceeded");
      },
    },
  });
  assert.equal(
    failRepo.write(layout(), { expectedRevision: 0 }).code,
    "STORAGE_WRITE_FAILED",
  );
  assert.equal(failing.values.size, 0);
});

test("migration preview prefers saved layout and leaves bytes untouched", () => {
  const storage = memoryStorage();
  const repo = HomeLayoutRepository.createHomeLayoutRepository({ storage });
  const saved = repo.write(layout(), { expectedRevision: 0 });
  const bytes = storage.getItem(HomeLayoutRepository.KEY);
  const preview = repo.previewLegacyMigration({
    ...layout(),
    name: "不应覆盖已保存布局",
  });
  assert.equal(saved.ok, true);
  assert.equal(preview.source, "saved");
  assert.equal(preview.requiresConfirmation, false);
  assert.equal(preview.layout.name, "默认布局");
  assert.equal(storage.getItem(HomeLayoutRepository.KEY), bytes);
});
