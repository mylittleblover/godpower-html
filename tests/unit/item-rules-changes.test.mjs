import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync, existsSync } from "node:fs";
function load() {
  const c = vm.createContext({});
  for (const path of [
    "src/items/catalog.js",
    "src/domain/items/targets.js",
    "src/domain/items/power-round.js",
  ])
    if (existsSync(path)) vm.runInContext(readFileSync(path, "utf8"), c);
  return {
    blueprints: c.ItemBlueprints,
    targets: vm.runInContext("ItemTargets", c),
    power: vm.runInContext(
      "typeof PowerRound === 'undefined'?null:PowerRound",
      c,
    ),
  };
}
test("approved thirds apply only to green shells and normal mushrooms; new power lasts five answers", () => {
  const { blueprints: b } = load();
  for (const key of ["green", "triple_green", "mushroom", "triple_mushroom"])
    assert.equal(b[key].denominator, 3, key);
  assert.equal(b.power.rounds, 5);
  for (const k of [
    "banana",
    "bomb",
    "horn",
    "fire_flower",
    "coin_shell",
    "question",
  ])
    assert.equal(b[k].denominator, 4, k);
});
test("random target range is top three union bottom two, deduplicated and excluding self and illegal targets", () => {
  const { targets: t } = load(),
    groups = Array.from({ length: 14 }, (_, i) => ({
      id: i + 1,
      score: 100 - i,
    }));
  const c = {
    group: groups[6],
    ranking: groups,
    position: 6,
    others: groups.filter((g) => g.id !== 7),
  };
  for (let i = 0; i < 50; i++) {
    const [g] = t.select("randomOther", c, {
      random: () => i / 50,
      eligible: (g) => g.score >= 0,
    });
    assert.ok([1, 2, 3, 13, 14].includes(g.id));
  }
  const tiny = {
    group: groups[0],
    ranking: groups.slice(0, 2),
    position: 0,
    others: [groups[1]],
  };
  assert.equal(
    t.select("randomOther", tiny, { random: () => 0, eligible: () => true })
      .length,
    1,
  );
  assert.equal(
    t.select("randomOther", tiny, { random: () => 0, eligible: () => false })
      .length,
    0,
  );
});
test("power uses frozen pre-answer upper neighbor and post-base score snapshot, independent of group traversal", () => {
  const { power: p } = load();
  assert.ok(p, "pure power score stage must exist");
  const before = [
      { id: 1, score: 20 },
      { id: 2, score: 15 },
      { id: 3, score: 10 },
    ],
    after = [
      { id: 1, score: 22 },
      { id: 2, score: 17 },
      { id: 3, score: 12 },
    ];
  const run = (rows) =>
    p.calculate({
      before,
      after: rows,
      answers: [
        { id: 2, answered: true, correct: true },
        { id: 3, answered: true, correct: true },
      ],
      activeIds: [2, 3],
    });
  let r = run(after);
  assert.deepEqual(JSON.parse(JSON.stringify(r)), [
    { id: 2, score: 23 },
    { id: 3, score: 18 },
  ]);
  assert.deepEqual(
    JSON.parse(JSON.stringify(run(after.toReversed()))),
    JSON.parse(JSON.stringify(r)),
  );
  assert.deepEqual(
    after.map((g) => g.score),
    [22, 17, 12],
  );
  assert.equal(
    p.calculate({
      before,
      after: [
        { id: 1, score: 22 },
        { id: 2, score: 40 },
        { id: 3, score: 12 },
      ],
      answers: [{ id: 2, answered: true, correct: true }],
      activeIds: [2],
    })[0].score,
    40,
  );
  assert.equal(
    p.calculate({
      before: [
        { id: 1, score: 10 },
        { id: 2, score: 10 },
      ],
      after: [
        { id: 1, score: 12 },
        { id: 2, score: 12 },
      ],
      answers: [{ id: 2, answered: true, correct: true }],
      activeIds: [2],
    }).length,
    0,
  );
});
