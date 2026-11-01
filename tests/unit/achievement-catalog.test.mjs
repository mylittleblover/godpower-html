import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";

const scope = vm.createContext({});
vm.runInContext(
  readFileSync("src/domain/achievements/catalog.js", "utf8") +
    "\nglobalThis.api = AchievementCatalog",
  scope,
);

test("contains exactly the 60 stable achievement IDs and six design categories", () => {
  const entries = scope.api.list();
  assert.equal(entries.length, 60);
  assert.deepEqual(
    Array.from(entries, (entry) => entry.id),
    Array.from(
      { length: 60 },
      (_, index) => `ACH-${String(index + 1).padStart(3, "0")}`,
    ),
  );
  assert.equal(new Set(entries.map((entry) => entry.category)).size, 6);
  assert.ok(
    entries.every((entry) => entry.name && entry.rarity && entry.condition),
  );
});

test("all 26 actual item keys have one exclusive achievement mapping", () => {
  const itemKeys = [
    "green",
    "triple_green",
    "red",
    "triple_red",
    "spiny",
    "banana",
    "triple_banana",
    "horn",
    "bomb",
    "hammer",
    "coin",
    "coin_shell",
    "question",
    "mushroom",
    "triple_mushroom",
    "boo",
    "blooper",
    "lightning",
    "star",
    "mega",
    "bullet",
    "power",
    "feather",
    "fire_flower",
    "ice_flower",
    "boomerang_flower",
  ];
  assert.deepEqual(
    [...scope.api.itemKeys()].sort(),
    [...itemKeys, "kamek", "item_box"].sort(),
  );
  const mapped = scope.api
    .list()
    .filter((entry) => entry.itemKey)
    .map((entry) => entry.itemKey);
  assert.deepEqual([...mapped].sort(), [...itemKeys].sort());
  assert.equal(new Set(mapped).size, 26);
});

test("hidden achievements are explicitly marked for student-facing masking", () => {
  const hidden = scope.api.list().filter((entry) => entry.hidden);
  assert.deepEqual(
    Array.from(hidden, (entry) => entry.id),
    [
      "ACH-053",
      "ACH-054",
      "ACH-055",
      "ACH-056",
      "ACH-057",
      "ACH-058",
      "ACH-059",
      "ACH-060",
    ],
  );
});
