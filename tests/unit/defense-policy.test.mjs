import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import vm from "node:vm";
const file = "src/domain/items/defense-policy.js",
  context = vm.createContext({});
vm.runInContext(
  (existsSync(file) ? readFileSync(file, "utf8") : "") +
    '\nglobalThis.api=typeof DefensePolicy==="undefined"?null:DefensePolicy;',
  context,
);
const api = context.api;
const cases = [
  [
    "timed ghost precedes all effects",
    { booRoundsLeftV218: 1, booShield: 1, itemEffect: { featherDodge: 1 } },
    "spiny",
    true,
    false,
    "timed-ghost",
  ],
  [
    "horn refusal precedes feather",
    {
      inventory: [{ key: "horn" }],
      __spinyHornDeclinedV218: true,
      itemEffect: { featherDodge: 1 },
    },
    "spiny",
    true,
    false,
    "none",
  ],
  [
    "timed ghost precedes horn refusal",
    {
      booRoundsLeftV218: 1,
      booShield: 1,
      inventory: [{ key: "horn" }],
      __spinyHornDeclinedV218: true,
    },
    "spiny",
    true,
    false,
    "timed-ghost",
  ],
  [
    "ineligible group precedes feather",
    { itemEffect: { featherDodge: 1 } },
    "green",
    false,
    true,
    "ineligible",
  ],
  [
    "feather precedes bullet",
    { itemEffect: { featherDodge: 1, type: "bullet" } },
    "green",
    true,
    true,
    "feather",
  ],
  [
    "bullet absolute defense",
    { itemEffect: { type: "bullet" } },
    "spiny",
    true,
    false,
    "bullet",
  ],
  [
    "star counts even last hit",
    { itemEffect: { type: "star", hitsLeft: 1 } },
    "green",
    true,
    true,
    "persistent",
  ],
  [
    "mega with zero remaining keeps legacy final defense",
    { itemEffect: { type: "mega", hitsLeft: 0 } },
    "red",
    true,
    true,
    "persistent",
  ],
  [
    "untimed ghost precedes inventory",
    { booShield: 1, inventory: [{ key: "green" }] },
    "green",
    true,
    true,
    "ghost",
  ],
  [
    "bomb blocks shell",
    { inventory: [{ key: "bomb" }] },
    "green",
    true,
    true,
    "bomb",
  ],
  [
    "bomb cannot block spiny",
    { inventory: [{ key: "bomb" }] },
    "spiny",
    true,
    false,
    "none",
  ],
  [
    "basic inventory blocks normal attack",
    { inventory: [{ key: "triple_banana" }] },
    "fire_flower",
    true,
    false,
    "inventory",
  ],
  [
    "basic inventory cannot block spiny",
    { inventory: [{ key: "green" }] },
    "spiny",
    true,
    false,
    "none",
  ],
  [
    "horn blocks spiny",
    { inventory: [{ key: "horn" }] },
    "spiny",
    true,
    false,
    "inventory",
  ],
  [
    "mushroom requests spiny decision",
    { inventory: [{ key: "triple_mushroom" }] },
    "spiny",
    true,
    false,
    "pending-mushroom",
  ],
  [
    "mushroom refused",
    { inventory: [{ key: "mushroom" }], __spinyMushroomDeclinedV21727: true },
    "spiny",
    true,
    false,
    "none",
  ],
  [
    "secondary inventory is not defense",
    { inventory: [{ key: "coin" }, { key: "horn" }] },
    "green",
    true,
    true,
    "none",
  ],
];
test("defense priority is an independent pure domain port", () =>
  assert.equal(typeof api?.choose, "function"));
for (const [name, group, attackType, eligible, shellAttack, kind] of cases)
  test(name, () => {
    const before = JSON.stringify(group);
    assert.equal(
      api.choose(group, attackType, { eligible, shellAttack }),
      kind,
    );
    assert.equal(JSON.stringify(group), before);
  });
