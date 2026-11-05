import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
const c = vm.runInNewContext(
  readFileSync("src/resources/avatar-presets.js", "utf8") +
    "\nAvatarPresetCatalog",
);
test("all nine generations starter evolution lines and Pikachu/Raichu are offline official entries", () => {
  const ids = [
    ...[1, 152, 252, 387, 495, 650, 722, 810, 906].flatMap((start) =>
      Array.from({ length: 9 }, (_, i) => start + i),
    ),
    25,
    26,
  ];
  const entries = c.items.filter((x) => x.category === "宝可梦");
  assert.equal(entries.length, 83);
  assert.deepEqual(
    Array.from(entries, (x) => x.dex).sort((a, b) => a - b),
    ids.sort((a, b) => a - b),
  );
  for (const x of entries) {
    assert.match(x.name, /\p{Script=Han}/u);
    assert.match(x.nameSource, /^https:\/\/dex\.pokemon\.cn\//);
  }
});
test("Smash names carry official name evidence and Sonic has its own audited category", () => {
  for (const x of c.items.filter((x) => x.id.startsWith("smash-"))) {
    assert.ok(x.nameSource);
    assert.ok(x.officialName);
  }
  const sonic = c.items.filter((x) => x.category === "索尼克系列");
  assert.ok(sonic.length >= 25);
  for (const x of sonic) {
    assert.match(x.name, /\p{Script=Han}/u);
    assert.ok(x.nameSource);
    assert.ok(x.officialName);
  }
  assert.equal(c.categories.at(-1), "任天堂与大乱斗");
});

test("existing preset identities and thumbnail bytes remain unchanged", () => {
  const baseline = JSON.parse(
    readFileSync("tests/fixtures/avatar-presets-baseline.json", "utf8"),
  );
  const now = new Map(c.items.map((item) => [item.id, item]));
  for (const old of baseline.items) {
    assert.ok(now.has(old.id), `Existing preset missing: ${old.id}`);
    assert.equal(now.get(old.id).sha256, old.sha256);
  }
});
