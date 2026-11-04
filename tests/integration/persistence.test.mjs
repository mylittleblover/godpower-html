import test from "node:test";
import assert from "node:assert/strict";
import { core, memoryStorage } from "../fixtures/core.mjs";
test("verified write roundtrip", () => {
  const s = memoryStorage();
  assert.equal(
    core.writeVerified(s, core.stateKey, { groups: [{ score: 1 }] }).ok,
    true,
  );
  assert.equal(JSON.parse(s.getItem(core.stateKey)).groups[0].score, 1);
});
for (const failure of ["quota", "security"])
  test(`write ${failure} surfaced`, () => {
    assert.equal(
      core.writeVerified(
        {
          setItem() {
            throw Error(failure);
          },
        },
        "x",
        {},
      ).ok,
      false,
    );
  });
test("readback mismatch surfaced", () =>
  assert.equal(
    core.writeVerified(
      {
        setItem() {},
        getItem() {
          return "wrong";
        },
      },
      "x",
      {},
    ).ok,
    false,
  ));
test("archive success preserves complete snapshot", () => {
  const s = memoryStorage();
  const r = {
    id: 1,
    clearedData: {
      groups: [{ score: 100, inventory: [{ key: "ice_flower", charges: 2 }] }],
    },
  };
  assert.equal(core.appendArchive(s, r).ok, true);
  assert.deepEqual(JSON.parse(s.getItem("politics_settlement_history")), [r]);
});
test("archive quota failure leaves old archive unchanged", () => {
  const s = memoryStorage();
  s.setItem("politics_settlement_history", '[{"id":1}]');
  s.setItem = () => {
    throw Error("quota");
  };
  assert.equal(core.appendArchive(s, { id: 2 }).ok, false);
  assert.equal(s.getItem("politics_settlement_history"), '[{"id":1}]');
});
test("corrupt archive not overwritten", () => {
  const s = memoryStorage();
  s.setItem("politics_settlement_history", "BROKEN");
  assert.equal(core.appendArchive(s, { id: 2 }).ok, false);
  assert.equal(s.getItem("politics_settlement_history"), "BROKEN");
});
test("archive retry deduplicates same id", () => {
  const s = memoryStorage();
  core.appendArchive(s, { id: 1 });
  core.appendArchive(s, { id: 1 });
  assert.equal(JSON.parse(s.getItem("politics_settlement_history")).length, 1);
});
test("same-season archive retry is idempotent and conflicting retries preserve the official record", () => {
  const s = memoryStorage();
  const first = {
    id: 1,
    seasonId: "season-a",
    title: "first",
    clearedData: {
      groups: [{ score: 20 }],
      round: { evaluated: true },
      itemGlobal: { pkTotal: 2 },
      picker: { mode: "individual" },
    },
  };
  assert.equal(core.appendArchive(s, first).ok, true);
  const retry = {
    ...first,
    id: 2,
    title: "retry",
    clearedData: structuredClone(first.clearedData),
  };
  assert.equal(core.appendArchive(s, retry).idempotent, true);
  assert.equal(
    core.appendArchive(s, {
      ...retry,
      clearedData: { ...retry.clearedData, groups: [{ score: 99 }] },
    }).ok,
    false,
  );
  const list = JSON.parse(s.getItem("politics_settlement_history"));
  assert.equal(list.length, 1);
  assert.equal(list[0].title, "first");
});
test("separate seasons with the same timestamp ID remain separate archives", () => {
  const s = memoryStorage();
  core.appendArchive(s, { id: 1, seasonId: "season-a" });
  core.appendArchive(s, { id: 1, seasonId: "season-b" });
  assert.equal(JSON.parse(s.getItem("politics_settlement_history")).length, 2);
});
test("more than 40 archives retained", () => {
  const s = memoryStorage();
  for (let id = 0; id < 45; id++)
    assert.equal(core.appendArchive(s, { id }).ok, true);
  assert.equal(JSON.parse(s.getItem("politics_settlement_history")).length, 45);
});
for (const [g, i, on] of [
  [null, 0, true],
  [{ inventory: [{ key: "fire_flower" }], score: 0 }, 1, true],
  [{ inventory: [{ key: "ice_flower" }], score: -1 }, 0, true],
  [{ inventory: [{ key: "coin" }], score: 0 }, 0, false],
])
  test(`common item guard ${JSON.stringify(g)} ${i} ${on}`, () =>
    assert.ok(core.validateItem({}, g, i, on)));
test("same triple continuation allowed", () =>
  assert.equal(
    core.validateItem(
      { roundActive: true },
      {
        inventory: [
          { key: "triple_red", itemInstanceId: "item-red", charges: 2 },
        ],
        score: 0,
        itemUsedThisRound: true,
        roundItemInstanceId: "item-red",
      },
      0,
      true,
    ),
    null,
  ));
test("different second item blocked", () =>
  assert.ok(
    core.validateItem(
      { roundActive: true },
      { inventory: [{ key: "coin" }], score: 0, itemUsedThisRound: true },
      0,
      true,
    ),
  ));
