import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import vm from "node:vm";
const file = "src/domain/items/targets.js";
const ctx = vm.createContext({});
vm.runInContext(
  (existsSync(file) ? readFileSync(file, "utf8") : "") +
    '\nglobalThis.api=typeof ItemTargets==="undefined"?null:ItemTargets;',
  ctx,
);
const api = ctx.api;
const ranked = [
  { id: 1, score: 40 },
  { id: 2, score: 30 },
  { id: 3, score: 20 },
  { id: 4, score: 10 },
  { id: 5, score: -1 },
];
const context = {
  group: ranked[2],
  ranking: ranked,
  position: 2,
  others: ranked.filter((g) => g.id !== 3 && g.score >= 0),
};
const ids = (v) => Array.from(v, (g) => g.id);
const policy = { random: () => 0, eligible: (g) => g.score >= 0 };
test("item target selection is a separately injectable domain port", () =>
  assert.equal(typeof api?.select, "function"));
for (const [name, expected] of [
  ["self", [3]],
  ["above", [2]],
  ["below", [4]],
  ["leader", [1]],
  ["adjacent", [2, 4]],
  ["aheadInclusive", [1, 2, 3]],
  ["behindInclusive", [3, 4, 5]],
  ["allAhead", [1, 2]],
  ["threeAhead", [1]],
  ["randomOther", [1]],
  ["randomUnfrozen", [1]],
  ["blast", [1, 2]],
])
  test(
    name + " selects existing group references without mutating the ranking",
    () => {
      const before = JSON.stringify(context);
      const result = api.select(name, context, policy);
      assert.deepEqual(ids(result), expected);
      assert.ok(Array.from(result).every((g) => ranked.includes(g)));
      assert.equal(JSON.stringify(context), before);
    },
  );
test("empty and all-frozen pools consume no random values", () => {
  let calls = 0;
  const p = {
    ...policy,
    random: () => {
      calls++;
      return 0.8;
    },
  };
  assert.deepEqual(
    ids(api.select("randomOther", { ...context, others: [] }, p)),
    [],
  );
  assert.deepEqual(
    ids(
      api.select(
        "randomUnfrozen",
        { ...context, others: [{ id: 1, itemEffect: { iceLock: 1 } }] },
        p,
      ),
    ),
    [],
  );
  assert.equal(calls, 0);
});
test("random pool uses exactly one supplied value and preserves eligibility ordering", () => {
  let calls = 0;
  const result = api.select("randomOther", context, {
    ...policy,
    random: () => {
      calls++;
      return 0.99;
    },
  });
  assert.deepEqual(ids(result), [4]);
  assert.equal(calls, 1);
});
test("a first-ranked caster is not targeted by leader attacks", () =>
  assert.deepEqual(
    ids(
      api.select(
        "leader",
        { ...context, group: ranked[0], position: 0 },
        policy,
      ),
    ),
    [],
  ));
test("unknown selector is rejected rather than silently selecting a target", () =>
  assert.throws(() => api.select("unknown", context, policy), /Unknown/));
