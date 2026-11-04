import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync, existsSync } from "node:fs";
function load() {
  const c = vm.createContext({});
  if (existsSync("src/domain/items/draw-policy.js"))
    vm.runInContext(readFileSync("src/domain/items/draw-policy.js", "utf8"), c);
  const f = vm.runInContext(
    "typeof ItemDrawPolicy==='undefined'?null:ItemDrawPolicy",
    c,
  );
  assert.ok(f, "continuous production draw policy must exist");
  return f;
}
const high = ["star", "mega", "bullet", "lightning", "power", "spiny"];
const share = (w) =>
  high.reduce((s, k) => s + w[k], 0) /
  Object.values(w).reduce((a, b) => a + b, 0);
test("continuous rank blend removes old hard partitions while preserving exact explicit horn eligibility", () => {
  const f = load();
  let before = 0;
  for (let p = 1; p <= 20; p++) {
    const w = f.weights({
      position: p,
      total: 20,
      score: 100,
      leaderScore: 100,
    });
    assert.equal(Object.keys(w).length, 28);
    for (const [key, v] of Object.entries(w)) {
      assert.ok(Number.isFinite(v) && v >= 0, key);
      if (key !== "horn")
        assert.ok(v > 0, key + " must not disappear across an old band");
    }
    const s = share(w);
    assert.ok(
      s >= before - 1e-12,
      "catch-up share should not reverse with equal scores",
    );
    before = s;
    if (p > 12) assert.equal(w.horn, 0);
  }
});
test("two-fold positive gap increases catch-up probability, while unique and held items remain excluded", () => {
  const f = load(),
    small = f.weights({ position: 8, total: 14, score: 100, leaderScore: 100 }),
    large = f.weights({ position: 8, total: 14, score: 100, leaderScore: 200 });
  assert.ok(share(large) > share(small));
  const w = f.weights({
    position: 8,
    total: 14,
    score: 100,
    leaderScore: 200,
    field: ["lightning", "blooper", "kamek", "item_box"],
    held: ["power"],
  });
  for (const k of ["lightning", "blooper", "kamek", "item_box", "power"])
    assert.equal(w[k], 0);
  assert.ok(
    Object.values(
      f.weights({ position: 2, total: 4, score: -1, leaderScore: 100 }),
    ).every((w) => w === 0),
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
