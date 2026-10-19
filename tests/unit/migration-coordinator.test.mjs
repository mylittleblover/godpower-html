import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
const ctx = vm.createContext({});
vm.runInContext(
  readFileSync("src/application/migration-coordinator.js", "utf8") +
    "\nglobalThis.api=MigrationCoordinator;",
  ctx,
);
function fixture(options = {}) {
  const statuses = [];
  let closed = 0,
    checks = 0;
  const plan = {
    migrationId: "migration-a",
    aggregateId: "class-a",
    sourceOrigin: "http://local",
    sourceManifest: [],
    snapshot: { groups: [] },
    archives: [],
    resources: [],
  };
  const integrity = {
    ok: !options.corrupt,
    failures: options.corrupt ? ["bad byte"] : [],
    verifiedArchives: 0,
    verifiedResources: 0,
  };
  const inventory = {
    capture: async () => ({ ready: true }),
    prepare: async () => plan,
    verify: async () => ({
      ok: !(++checks === 2 && options.sourceChanged),
      conflicts: ["source changed"],
    }),
    verifyDestination: async () => integrity,
  };
  const repo = {
    importSnapshot: async () => ({ complete: true }),
    recordMigrationStatus: async (_, result) => {
      statuses.push(result.status);
      if (result.status === "VERIFIED") options.abortAtVerified?.();
      if (options.journalFails) throw Error("journal quota");
      return result;
    },
    close: () => closed++,
  };
  return {
    coordinator: ctx.api.create({
      inventory,
      openRepository: async () => repo,
    }),
    statuses,
    closed: () => closed,
  };
}
test("staging journals VERIFYING then VERIFIED only after both readbacks", async () => {
  const f = fixture(),
    preview = await f.coordinator.preview(),
    result = await f.coordinator.execute(preview);
  assert.equal(result.ok, true);
  assert.deepEqual(f.statuses, ["VERIFYING", "VERIFIED"]);
  assert.equal(result.journal.status, "VERIFIED");
  assert.equal(result.authorityChanged, false);
  assert.equal(f.closed(), 1);
});
test("target corruption cannot leave a verified journal", async () => {
  const f = fixture({ corrupt: true }),
    r = await f.coordinator.execute(await f.coordinator.preview());
  assert.equal(r.status, "DESTINATION_INVALID");
  assert.deepEqual(f.statuses, ["VERIFYING", "DESTINATION_INVALID"]);
  assert.equal(r.authorityChanged, false);
});
test("source change after import is durably distinguished from verified staging", async () => {
  const f = fixture({ sourceChanged: true }),
    r = await f.coordinator.execute(await f.coordinator.preview());
  assert.equal(r.status, "STAGED_SOURCE_CHANGED");
  assert.deepEqual(f.statuses, ["VERIFYING", "STAGED_SOURCE_CHANGED"]);
});
test("journal persistence failure never reports successful staging or changes authority", async () => {
  const f = fixture({ journalFails: true }),
    r = await f.coordinator.execute(await f.coordinator.preview());
  assert.equal(r.ok, false);
  assert.equal(r.status, "FAILED");
  assert.equal(r.authorityChanged, false);
  assert.match(r.error, /journal quota/);
  assert.equal(f.closed(), 1);
});

test("cancellation after durable verification cannot contradict its recorded outcome", async () => {
  const signal = { aborted: false };
  const f = fixture({
    abortAtVerified: () => {
      signal.aborted = true;
    },
  });
  const result = await f.coordinator.execute(await f.coordinator.preview(), {
    signal,
  });
  assert.equal(result.journal.status, "VERIFIED");
  assert.equal(result.ok, true);
  assert.equal(result.status, "STAGED_VERIFIED");
});
