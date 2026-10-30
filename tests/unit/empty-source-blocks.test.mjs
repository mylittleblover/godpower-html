import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { parse } from "acorn";
test("production template contains no empty legacy scripts", () => {
  const files = JSON.parse(readFileSync("src/manifest.json", "utf8"))
    .blocks.filter((b) => b.type === "script")
    .map((b) => "src/" + b.path);
  const empty = files.filter(
    (f) =>
      parse(readFileSync(f, "utf8"), { ecmaVersion: "latest" }).body.length ===
      0,
  );
  assert.deepEqual(
    empty,
    [],
    "Remove empty source blocks and synchronize the manifest",
  );
});
