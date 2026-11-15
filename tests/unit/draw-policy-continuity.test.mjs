import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync, existsSync } from "node:fs";

function load() {
  const c = vm.createContext({});
  if (existsSync("src/domain/items/mkw-tables.js"))
    vm.runInContext(readFileSync("src/domain/items/mkw-tables.js", "utf8"), c);
  if (existsSync("src/domain/items/draw-policy.js"))
    vm.runInContext(readFileSync("src/domain/items/draw-policy.js", "utf8"), c);
  const f = vm.runInContext(
    "typeof ItemDrawPolicy==='undefined'?null:ItemDrawPolicy",
    c,
  );
  assert.ok(f, "MKWorld Product.180 draw policy must exist");
  return f;
}

const high = ["star", "mega", "bullet", "lightning", "power", "spiny"];
const share = (w) => {
  const total = Object.values(w).reduce((a, b) => a + b, 0);
  return total > 0 ? high.reduce((s, k) => s + w[k], 0) / total : 0;
};

test("Product.180 standard 24-column matrix scales catch-up items monotonically by position", () => {
  const f = load();
  const front = f.weights({ position: 1, total: 24, score: 100 });
  const mid = f.weights({ position: 12, total: 24, score: 100 });
  const back = f.weights({ position: 24, total: 24, score: 100 });

  assert.equal(Object.keys(front).length, 28);
  assert.equal(Object.keys(back).length, 28);
  assert.equal(front.lightning, 0);
  assert.equal(front.bullet, 0);
  assert.ok(share(mid) > share(front));
  assert.ok(share(back) >= share(mid));
  assert.ok(mid.lightning > 0);
  assert.ok(back.bullet > 0);
  assert.equal(back.horn, 0);
});

test("held items, unique field caps, and ineligible negative scores are gated correctly", () => {
  const f = load();
  const w = f.weights({
    position: 20,
    total: 24,
    score: 100,
    field: ["lightning", "blooper", "spiny", "kamek", "item_box"],
    held: ["power"],
  });
  for (const k of [
    "lightning",
    "blooper",
    "spiny",
    "kamek",
    "item_box",
    "power",
  ])
    assert.equal(w[k], 0);
  assert.ok(
    Object.values(
      f.weights({ position: 2, total: 4, score: -1, leaderScore: 100 }),
    ).every((v) => v === 0),
  );
});

test("the build contains one ordinary draw weight entry and no old wrapper chain", () => {
  const blocks = JSON.parse(
    readFileSync("src/manifest.json", "utf8"),
  ).blocks.filter((b) => b.type === "script");
  const source = blocks
    .map((b) => readFileSync("src/" + b.path, "utf8"))
    .join("\n");
  assert.equal((source.match(/function itemDropWeights\(/g) || []).length, 1);
  assert.equal((source.match(/\bitemDropWeights\s*=/g) || []).length, 0);
  assert.equal(source.includes("_v218ItemDropWeights"), false);
});
