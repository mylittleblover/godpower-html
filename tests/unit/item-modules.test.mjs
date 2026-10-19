import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
const c = vm.createContext({});
vm.runInContext(readFileSync("src/core/item-module-model.js", "utf8"), c);
const defs = {
  coin: { name: "金币", charges: 1, kind: "boost" },
  star: { name: "星", charges: 1, kind: "status" },
  fire_flower: { name: "火之花", charges: 3, kind: "attack" },
};
const make = (storage) => c.ItemModuleModel.create(defs, storage);
test("default blocks preserve weights, score and charges; independent flow settings", () => {
  const m = make();
  assert.equal(m.scoreDelta("coin", 2), 2);
  assert.equal(m.charges("fire_flower"), 3);
  const v = m.configuration();
  v.items.coin.draw.enabled = false;
  v.items.star.operation.enabled = false;
  m.update(v);
  assert.equal(m.drawWeights({ coin: 18, star: 0 }).coin, 0);
  assert.equal(m.canUse("coin"), true);
  assert.equal(m.canUse("star"), false);
});
test("weight multiplier preserves zero eligibility and no hidden fallback", () => {
  const m = make(),
    v = m.configuration();
  v.items.coin.draw.weight = 2;
  m.update(v);
  assert.equal(m.drawWeights({ coin: 18, star: 0 }).coin, 36);
  assert.equal(m.drawWeights({ coin: 0 }).coin, 0);
});
test("invalid import and failed storage preserve live configuration", () => {
  const m = make({
      getItem: () => null,
      setItem: () => {
        throw Error("quota");
      },
    }),
    v = m.configuration();
  v.items.coin.draw.weight = 2;
  assert.throws(() => m.update(v), /quota/);
  assert.equal(m.configuration().items.coin.draw.weight, 1);
  const n = make(),
    bad = n.configuration();
  bad.items.coin.operation.scoreMultiplier = Infinity;
  assert.throws(() => n.update(bad));
  assert.throws(() => n.update({ ...n.configuration(), schemaVersion: 99 }));
});
test("operation context ends after throw and multiplier rounded once", () => {
  const m = make(),
    v = m.configuration();
  v.items.coin.operation.scoreMultiplier = 2;
  m.update(v);
  assert.equal(
    m.execute("coin", () => m.scoreDelta(null, 2)),
    4,
  );
  assert.throws(() =>
    m.execute("coin", () => {
      throw Error("no");
    }),
  );
  assert.equal(m.scoreDelta(null, 2), 2);
});
test("new inventory carries bounded configured charges; defaults unchanged", () => {
  const m = make(),
    v = m.configuration();
  v.items.fire_flower.draw.charges = 7;
  m.update(v);
  const it = m.inventory("fire_flower", 123);
  assert.equal(it.charges, 7);
  assert.equal(it.configuredCharges, 7);
  assert.equal(m.inventory("coin", 123).configuredCharges, undefined);
  assert.match(m.inventory("coin", 123).itemInstanceId, /^item-/);
  assert.notEqual(m.inventory("coin", 123).itemInstanceId, m.inventory("coin", 123).itemInstanceId);
  v.items.coin.draw.charges = 100;
  assert.throws(() => m.update(v));
});
test("persistent slot and stealing modules reject unsupported repeat counts", () => {
  const m = c.ItemModuleModel.create({
    mega: { charges: 1 },
    power: { charges: 1 },
    boo: { charges: 1 },
  });
  for (const key of ["mega", "power", "boo"]) {
    const v = m.configuration();
    v.items[key].draw.charges = 2;
    assert.throws(() => m.update(v));
    assert.ok(
      !m
        .catalog()
        .find((x) => x.key === key)
        .blocks.draw.includes("charges"),
    );
  }
});
