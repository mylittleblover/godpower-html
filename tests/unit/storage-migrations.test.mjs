import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const context = vm.createContext({
  console,
  Date,
  Math,
  Object,
  Array,
  Set,
  Map,
  String,
  Number,
  JSON,
  TypeError,
  Error,
  RegExp,
  parseInt,
});
vm.runInContext(
  [
    readFileSync("src/domain/identity.js", "utf8"),
    readFileSync("src/infrastructure/legacy/classroom-repository.js", "utf8"),
    readFileSync("src/infrastructure/legacy/schema-migrations.js", "utf8"),
    readFileSync("src/core/reliability.js", "utf8"),
    "globalThis.api = { Identity: StableIdentity, Repository: ClassroomRepository, Migrations: SchemaMigrations, Reliability };",
  ].join("\n"),
  context,
);
const { Identity, Repository, Migrations, Reliability } = context.api;

function storage(seed = {}) {
  const values = new Map(Object.entries(seed));
  return {
    values,
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      if (this.failWrite) throw new Error("quota exceeded");
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
  };
}

function legacyBackup() {
  return {
    schemaVersion: 1,
    timestamp: "2026-10-18T12:00:00.000Z",
    groups: [
      {
        id: 1,
        name: "第1组",
        score: 12,
        members: ["甲", "乙"],
        inventory: [{ key: "coin", charges: 1 }],
      },
    ],
    picker: {
      mode: "individual",
      antiRepeat: true,
      pickedStudentKeys: ["1:甲"],
    },
    itemGlobal: { totalDraws: 4 },
    round: { roundActive: false, evaluated: true, correctAns: "A" },
    history: [
      {
        desc: "previous",
        time: "09:00",
        groups: [{ id: 1, name: "第1组", score: 10, members: ["甲", "乙"] }],
      },
    ],
  };
}

test("season archive retry is idempotent and never replaces a conflicting official result", () => {
  const db = storage();
  const first = {
    seasonId: "season-archive-1", id: 1, title: "Original", time: "09:00",
    clearedData: {groups:[{groupUid:"group-a",score:20}],round:{evaluated:true},itemGlobal:{pkTotal:5},picker:{mode:"individual"}},
  };
  assert.equal(Repository.appendArchive(db, first).ok, true);
  const archived = db.getItem("politics_settlement_history");
  const sameSeasonRetry = {...first,id:2,title:"Retry",time:"10:00",clearedData:JSON.parse(JSON.stringify(first.clearedData))};
  const retry = Repository.appendArchive(db, sameSeasonRetry);
  assert.equal(retry.ok, true);
  assert.equal(retry.idempotent, true);
  assert.equal(db.getItem("politics_settlement_history"), archived);
  const changedResult = {...sameSeasonRetry,clearedData:{...sameSeasonRetry.clearedData,groups:[{groupUid:"group-a",score:99}]}};
  assert.equal(Repository.appendArchive(db, changedResult).ok, false);
  assert.equal(db.getItem("politics_settlement_history"), archived);
});

test("an older archive with matching season identity but no comparable snapshot is protected", () => {
  const original = JSON.stringify([{seasonId:"season-archive-2",title:"Legacy archived result"}]);
  const db = storage({politics_settlement_history:original});
  const result = Repository.appendArchive(db,{seasonId:"season-archive-2",id:2,clearedData:{groups:[],round:{},itemGlobal:{},picker:{}}});
  assert.equal(result.ok,false);
  assert.equal(db.getItem("politics_settlement_history"),original);
});

test("v1 to v2 migration preserves classroom data and adds stable identities without mutating input", () => {
  const raw = legacyBackup();
  const before = JSON.stringify(raw);
  const migrated = Migrations.migrateBackup(raw, {
    identity: Identity,
    now: () => new Date("2026-10-19T00:00:00Z"),
  });
  assert.equal(migrated.schemaVersion, 2);
  assert.equal(migrated.groups[0].score, 12);
  assert.deepEqual(JSON.parse(JSON.stringify(migrated.groups[0].members)), [
    "甲",
    "乙",
  ]);
  assert.equal(typeof migrated.groups[0].groupUid, "string");
  assert.equal(typeof migrated.groups[0].inventory[0].itemInstanceId, "string");
  assert.equal(typeof migrated.history[0].groups[0].groupUid, "string");
  assert.equal(
    migrated.history[0].groups[0].groupUid,
    migrated.groups[0].groupUid,
  );
  assert.equal(typeof migrated.seasonId, "string");
  assert.equal(JSON.stringify(raw), before);
});

test("migration copies and verifies the new envelope, writes receipt last, and retains the old source", () => {
  const source = JSON.stringify(legacyBackup());
  const db = storage({ godpower_state_v1: source });
  const result = Repository.loadOrMigrate(db, {
    currentKey: "godpower_state_v2",
    legacyKey: "godpower_state_v1",
    receiptKey: "godpower_migration_v2_receipt",
    migrate: (raw) =>
      Migrations.migrateBackup(raw, {
        identity: Identity,
        now: () => new Date("2026-10-19T00:00:00Z"),
      }),
    validate: (data) => Reliability.validateBackup(data),
    now: () => new Date("2026-10-19T00:00:00Z"),
  });
  assert.equal(result.status, "migrated");
  assert.equal(db.getItem("godpower_state_v1"), source);
  assert.equal(JSON.parse(db.getItem("godpower_state_v2")).schemaVersion, 2);
  assert.equal(
    JSON.parse(db.getItem("godpower_migration_v2_receipt")).status,
    "complete",
  );
});

test("migration is idempotent and never rewrites an already-current envelope", () => {
  const db = storage({ godpower_state_v1: JSON.stringify(legacyBackup()) });
  const options = {
    currentKey: "godpower_state_v2",
    legacyKey: "godpower_state_v1",
    receiptKey: "godpower_migration_v2_receipt",
    migrate: (raw) => Migrations.migrateBackup(raw, { identity: Identity }),
    validate: (data) => Reliability.validateBackup(data),
  };
  Repository.loadOrMigrate(db, options);
  const current = db.getItem("godpower_state_v2");
  db.removeItem("godpower_migration_v2_receipt");
  const second = Repository.loadOrMigrate(db, options);
  assert.equal(second.status, "current");
  assert.equal(db.getItem("godpower_state_v2"), current);
  assert.equal(db.getItem("godpower_state_v1"), JSON.stringify(legacyBackup()));
});

test("write or verification failure rolls back only the destination and preserves source bytes", () => {
  const source = JSON.stringify(legacyBackup());
  const db = storage({ godpower_state_v1: source });
  db.failWrite = true;
  const result = Repository.loadOrMigrate(db, {
    currentKey: "godpower_state_v2",
    legacyKey: "godpower_state_v1",
    receiptKey: "godpower_migration_v2_receipt",
    migrate: (raw) => Migrations.migrateBackup(raw, { identity: Identity }),
    validate: (data) => Reliability.validateBackup(data),
  });
  assert.equal(result.status, "failed");
  assert.equal(db.getItem("godpower_state_v1"), source);
  assert.equal(db.getItem("godpower_state_v2"), null);
  assert.equal(db.getItem("godpower_migration_v2_receipt"), null);
});

test("a corrupt current envelope is surfaced instead of silently falling back to older data", () => {
  const db = storage({
    godpower_state_v2: "{bad",
    godpower_state_v1: JSON.stringify(legacyBackup()),
  });
  const result = Repository.loadOrMigrate(db, {
    currentKey: "godpower_state_v2",
    legacyKey: "godpower_state_v1",
    receiptKey: "godpower_migration_v2_receipt",
    migrate: (raw) => Migrations.migrateBackup(raw, { identity: Identity }),
    validate: (data) => Reliability.validateBackup(data),
  });
  assert.equal(result.status, "failed");
  assert.equal(db.getItem("godpower_state_v2"), "{bad");
  assert.equal(db.getItem("godpower_state_v1"), JSON.stringify(legacyBackup()));
});

test("legacy mirror migration imports only classroom keys and leaves unrelated IndexedDB assets alone", () => {
  const db = storage({
    politics_groups_data: JSON.stringify([
      { id: 1, name: "一组", score: 3, members: ["甲"] },
    ]),
    politics_picker_state: JSON.stringify({ mode: "group", antiRepeat: false }),
    politics_item_global: JSON.stringify({ totalDraws: 2 }),
    politics_history_stack_v26: JSON.stringify([]),
    politics_zoom_level: "1.25",
    indexedDbMarker: "must-not-touch",
  });
  const raw = Migrations.fromLegacyKeys(db, {
    identity: Identity,
    now: () => new Date("2026-10-19T00:00:00Z"),
  });
  assert.equal(raw.schemaVersion, 1);
  assert.equal(raw.groups[0].score, 3);
  assert.equal(raw.picker.mode, "group");
  assert.equal(raw.zoomLevel, 1.25);
  const result = Repository.loadOrMigrate(db, {
    currentKey: "godpower_state_v2",
    legacyKey: "godpower_state_v1",
    receiptKey: "godpower_migration_v2_receipt",
    fallbackData: raw,
    fallbackSource: "legacy-mirror-keys",
    migrate: (data) => Migrations.migrateBackup(data, { identity: Identity }),
    validate: (data) => Reliability.validateBackup(data),
  });
  assert.equal(result.status, "migrated");
  assert.equal(db.getItem("indexedDbMarker"), "must-not-touch");
  assert.equal(db.getItem("politics_groups_data") !== null, true);
});

test("malformed legacy content is rejected before any destination write", () => {
  const db = storage({
    godpower_state_v1: JSON.stringify({ schemaVersion: 1, groups: [] }),
  });
  const result = Repository.loadOrMigrate(db, {
    currentKey: "godpower_state_v2",
    legacyKey: "godpower_state_v1",
    receiptKey: "godpower_migration_v2_receipt",
    migrate: (raw) => Migrations.migrateBackup(raw, { identity: Identity }),
    validate: (data) => Reliability.validateBackup(data),
  });
  assert.equal(result.status, "failed");
  assert.equal(db.getItem("godpower_state_v1") !== null, true);
  assert.equal(db.getItem("godpower_state_v2"), null);
});

test("invalid candidates are not exposed as validated recovery data", () => {
  const db = storage({
    godpower_state_v1: JSON.stringify({
      schemaVersion: 1,
      groups: [{ score: 1.5 }],
    }),
  });
  const result = Repository.loadOrMigrate(db, {
    currentKey: "godpower_state_v2",
    legacyKey: "godpower_state_v1",
    receiptKey: "receipt",
    migrate: (raw) => Migrations.migrateBackup(raw, { identity: Identity }),
    validate: (data) => Reliability.validateBackup(data),
  });
  assert.equal(result.sourceValidated, false);
  assert.equal(result.data, null);
});

test("a valid current envelope never reads damaged fallback mirrors", () => {
  const current = Migrations.migrateBackup(legacyBackup(), {
    identity: Identity,
  });
  const db = storage({ godpower_state_v2: JSON.stringify(current) });
  const result = Repository.loadOrMigrate(db, {
    currentKey: "godpower_state_v2",
    legacyKey: "godpower_state_v1",
    receiptKey: "receipt",
    fallbackData: () => {
      throw Error("damaged obsolete mirror");
    },
    migrate: (raw) => Migrations.migrateBackup(raw, { identity: Identity }),
    validate: (data) => Reliability.validateBackup(data),
  });
  assert.equal(result.status, "current");
});

test("v1 mistakenly placed in the current slot is durably upgraded once", () => {
  const db = storage({ godpower_state_v2: JSON.stringify(legacyBackup()) });
  const result = Repository.loadOrMigrate(db, {
    currentKey: "godpower_state_v2",
    legacyKey: "godpower_state_v1",
    receiptKey: "receipt",
    migrate: (raw) => Migrations.migrateBackup(raw, { identity: Identity }),
    validate: (data) => Reliability.validateBackup(data),
  });
  assert.equal(result.status, "migrated-in-place");
  assert.equal(JSON.parse(db.getItem("godpower_state_v2")).schemaVersion, 2);
});

test("absent legacy preferences preserve application defaults rather than becoming zero or false", () => {
  const db = storage({
    politics_groups_data: JSON.stringify([{ id: 1, score: 0 }]),
  });
  const data = Migrations.fromLegacyKeys(db);
  assert.equal(data.masterVolume, undefined);
  assert.equal(data.zoomLevel, undefined);
  assert.equal(data.saveAllIn, undefined);
});

test("failed destination rollback is reported without touching the legacy source", () => {
  const source = JSON.stringify(legacyBackup());
  const db = storage({ godpower_state_v1: source });
  const get = db.getItem;
  db.getItem = (key) =>
    key === "godpower_state_v2" && db.values.has(key)
      ? "unexpected readback"
      : get(key);
  db.removeItem = () => {
    throw Error("rollback denied");
  };
  const result = Repository.loadOrMigrate(db, {
    currentKey: "godpower_state_v2",
    legacyKey: "godpower_state_v1",
    receiptKey: "receipt",
    migrate: (raw) => Migrations.migrateBackup(raw, { identity: Identity }),
    validate: Reliability.validateBackup,
  });
  assert.equal(result.status, "failed");
  assert.match(result.rollbackError, /rollback denied/);
  assert.equal(db.getItem("godpower_state_v1"), source);
});
