import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import vm from "node:vm";
const file = "src/domain/competition/ranking.js",
  ctx = vm.createContext({});
vm.runInContext(
  (existsSync(file) ? readFileSync(file, "utf8") : "") +
    '\nglobalThis.api=typeof RankingRules==="undefined"?null:RankingRules;',
  ctx,
);
const api = ctx.api;
test("ranking exposes an independent domain port", () =>
  assert.equal(typeof api?.ordered, "function"));
test("ranking preserves stable source order for ties and never reorders input", () => {
  const groups = Object.freeze(
    [
      { id: 9, score: 0 },
      { id: 4, score: 100 },
      { id: 6, score: 100 },
      { id: 3, score: -1 },
    ].map(Object.freeze),
  );
  assert.deepEqual(
    Array.from(api.ordered(groups), (g) => g.id),
    [4, 6, 9, 3],
  );
  assert.deepEqual(
    groups.map((g) => g.id),
    [9, 4, 6, 3],
  );
});
test("seeded characterization agrees with pre-refactor ordering including imported score values", () => {
  let seed = 12479;
  const random = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32;
  const choices = [
    0,
    -1,
    1,
    100,
    Number.MAX_SAFE_INTEGER,
    -Number.MAX_SAFE_INTEGER,
    "12",
    null,
    undefined,
    "invalid",
  ];
  for (let run = 0; run < 200; run++) {
    const groups = Array.from({ length: run % 31 }, (_, id) => ({
      id,
      score: choices[Math.floor(random() * choices.length)],
    }));
    const old = groups
      .slice()
      .sort(
        (a, b) =>
          (Number(b.score) || 0) - (Number(a.score) || 0) ||
          groups.indexOf(a) - groups.indexOf(b),
      );
    assert.deepEqual(
      Array.from(api.ordered(groups), (g) => g.id),
      old.map((g) => g.id),
    );
  }
});
