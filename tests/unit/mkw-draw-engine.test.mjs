import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";

function loadMkw() {
  const ctx = vm.createContext({});
  vm.runInContext(readFileSync("src/domain/items/mkw-tables.js", "utf8"), ctx);
  vm.runInContext(readFileSync("src/domain/items/draw-policy.js", "utf8"), ctx);
  return {
    data: vm.runInContext("MKWProduct180Data", ctx),
    policy: vm.runInContext("ItemDrawPolicy", ctx),
  };
}

test("MKWorld Product.180 official Simplified Chinese item names are intact", () => {
  const { data } = loadMkw();
  assert.equal(data.OFFICIAL_ITEMS.mushroom.name, "冲刺蘑菇");
  assert.equal(data.OFFICIAL_ITEMS.triple_mushroom.name, "三重冲刺蘑菇");
  assert.equal(data.OFFICIAL_ITEMS.power.name, "强力冲刺蘑菇");
  assert.equal(data.OFFICIAL_ITEMS.spiny.name, "刺刺龟壳");
  assert.equal(data.OFFICIAL_ITEMS.coin_shell.name, "黄金龟壳");
  assert.equal(data.OFFICIAL_ITEMS.question.name, "？砖块");
});

test("all 12 weight tables and 24x24 RANK_TABLE load completely", () => {
  const { data, policy } = loadMkw();
  const tableNames = Object.keys(data.WEIGHT_TABLES);
  assert.equal(tableNames.length, 12);
  for (const name of tableNames) {
    const tbl = data.WEIGHT_TABLES[name];
    assert.ok(tbl && typeof tbl === "object", name);
    for (const key of Object.keys(tbl)) {
      assert.equal(tbl[key].length, 24, `${name}.${key} must have 24 cols`);
    }
  }
  assert.equal(data.RANK_TABLE.length, 24);
  for (let i = 0; i < data.RANK_TABLE.length; i++) {
    assert.equal(data.RANK_TABLE[i].length, i + 1);
  }
  assert.equal(policy.modes().length, 12);
});

test("all modes produce valid positive weight distributions", () => {
  const { policy } = loadMkw();
  for (const mode of policy.modes()) {
    const res = policy.evaluate({
      config: { mode: mode.id, switchPreset: "ALL" },
      position: 8,
      total: 12,
      elapsedFrames: Infinity,
    });
    const sum = Object.values(res.weights).reduce((a, b) => a + b, 0);
    assert.ok(sum > 0, `Mode ${mode.id} must yield positive weight sum`);
    assert.equal(Object.keys(res.weights).length, 28);
  }
});

test("SwitchPreset P00..P10 restrict candidates accurately", () => {
  const { data, policy } = loadMkw();
  for (const presetId of ["P00", "P01", "P04", "P05", "P08", "P09", "P10"]) {
    const allowed = new Set(data.SWITCH_PRESETS[presetId]);
    assert.ok(allowed.size > 0, `${presetId} must be non-empty`);
    const res = policy.evaluate({
      config: { mode: "24KartRace", switchPreset: presetId },
      position: 10,
      total: 12,
      elapsedFrames: Infinity,
    });
    for (const [k, w] of Object.entries(res.weights)) {
      if (!allowed.has(k)) {
        assert.equal(w, 0, `${presetId} must disable ${k}`);
      }
    }
  }
});

test("startDelay and IntervalLimit cooldown work across realtime & rounds modes and relax in back pack at t=0", () => {
  const { policy } = loadMkw();
  const now = 1_000_000;
  // Column 6/24 has spiny > 0: at t=0, startFrame 2100f blocks spiny
  const startBlocked = policy.evaluate({
    config: { mode: "24KartRace", timingMode: "realtime" },
    position: 6,
    total: 24,
    matchStartedAt: now,
    nowMs: now,
  });
  assert.equal(startBlocked.weights.spiny, 0);
  assert.ok(startBlocked.blockedReasons.spiny.includes("start_delay"));

  // Rear position 24/24 at t=0 still yields positive fallback weights (no deadlock)
  const backStart = policy.evaluate({
    config: { mode: "24KartRace", timingMode: "realtime" },
    position: 24,
    total: 24,
    matchStartedAt: now,
    nowMs: now,
  });
  const backSum = Object.values(backStart.weights).reduce((a, b) => a + b, 0);
  assert.ok(backSum > 0, "rear positions at t=0 must remain drawable");

  // After startDelay elapsed, spiny cooldown after use blocks for 5400f (90s)
  const cooled = policy.evaluate({
    config: { mode: "24KartRace", timingMode: "realtime" },
    position: 6,
    total: 24,
    matchStartedAt: now - 300_000,
    nowMs: now,
    lastUsedAt: { spiny: now - 10_000 },
  });
  assert.equal(cooled.weights.spiny, 0);
  assert.ok(cooled.blockedReasons.spiny.includes("cooldown"));

  // Rounds timing mode blocks during interval rounds
  const roundsCooled = policy.evaluate({
    config: { mode: "24KartRace", timingMode: "rounds" },
    position: 6,
    total: 24,
    sessionNo: 10,
    lastUsedSession: { spiny: 9 },
  });
  assert.equal(roundsCooled.weights.spiny, 0);
  assert.ok(roundsCooled.blockedReasons.spiny.includes("cooldown"));

  // Ignoring penalty bypasses cooldown
  const ignored = policy.evaluate({
    config: { mode: "24KartRace", timingMode: "realtime", ignorePenalty: true },
    position: 6,
    total: 24,
    matchStartedAt: now - 300_000,
    nowMs: now,
    lastUsedAt: { spiny: now - 10_000 },
  });
  assert.ok(ignored.weights.spiny > 0);
});

test("NumLimit field caps, EnableSame toggle, and ItemParamByRankGParam lookups work accurately", () => {
  const { policy } = loadMkw();
  const spinyCapped = policy.evaluate({
    config: { mode: "24KartRace" },
    position: 6,
    total: 24,
    elapsedFrames: Infinity,
    field: { spiny: 1 },
  });
  assert.equal(spinyCapped.weights.spiny, 0);
  assert.ok(spinyCapped.blockedReasons.spiny.includes("field_cap"));

  const lightningCapped = policy.evaluate({
    config: { mode: "24KartRace" },
    position: 12,
    total: 24,
    elapsedFrames: Infinity,
    field: { lightning: 3 },
  });
  assert.equal(lightningCapped.weights.lightning, 0);
  assert.ok(lightningCapped.blockedReasons.lightning.includes("field_cap"));

  const sameOff = policy.evaluate({
    config: { mode: "24KartRace", enableSame: false },
    position: 4,
    total: 24,
    elapsedFrames: Infinity,
    held: ["mushroom"],
  });
  assert.equal(sameOff.weights.mushroom, 0);
  assert.ok(sameOff.blockedReasons.mushroom.includes("held"));

  const sameOn = policy.evaluate({
    config: { mode: "24KartRace", enableSame: true },
    position: 4,
    total: 24,
    elapsedFrames: Infinity,
    held: ["mushroom"],
  });
  assert.ok(sameOn.weights.mushroom > 0);

  const pFirst = policy.paramByRank(0);
  const pLast = policy.paramByRank(23);
  assert.equal(pFirst.inkLevel, 3);
  assert.equal(pLast.inkLevel, 1);
  assert.equal(pFirst.thunderFrame, 180);
  assert.equal(pLast.thunderFrame, 45);
  assert.equal(pFirst.killerTargetRank, 1);
  assert.equal(pLast.killerTargetRank, 12);
});
