import vm from "node:vm";
import { readFileSync } from "node:fs";
import { webcrypto } from "node:crypto";
export function saveCore() {
  const context = vm.createContext({
    console,
    crypto: webcrypto,
    TextEncoder,
    TextDecoder,
    Uint8Array,
    ArrayBuffer,
    Blob,
    atob,
    btoa,
    structuredClone,
  });
  for (const file of [
    "domain/identity.js",
    "domain/save-document.js",
    "domain/save-roster.js",
    "application/save-migration.js",
  ])
    vm.runInContext(readFileSync("src/" + file, "utf8"), context);
  return {
    schema: context.SaveSchema,
    migration: context.SaveMigration,
    context,
  };
}
export function legacy() {
  return {
    schemaVersion: 2,
    appVersion: "V3.0.64",
    seasonId: "season-test",
    timestamp: "2026-11-03T00:00:00Z",
    groups: [
      {
        id: 1,
        groupUid: "group-one",
        name: "第一组",
        score: 100,
        members: ["01 甲", "02 同名"],
        color: "#123456",
        inventory: [
          { key: "triple_green", charges: 2, itemInstanceId: "item-one" },
        ],
      },
      {
        id: 2,
        groupUid: "group-two",
        name: "第二组",
        score: -5,
        members: ["03 同名"],
        color: "#dddddd",
        inventory: [],
      },
    ],
    round: {
      hasStartedOnce: true,
      roundActive: true,
      evaluated: false,
      correctAns: "A",
    },
    picker: { mode: "individual", antiRepeat: true, pickedStudentKeys: [] },
    history: [],
    itemGlobal: { totalDraws: 3 },
    achievementLedger: { schemaVersion: 1, groups: {} },
    masterVolume: 0.4,
    zoomLevel: 0.8,
    adminPin: "fixture-only",
    firstHandDrawPending: false,
  };
}
