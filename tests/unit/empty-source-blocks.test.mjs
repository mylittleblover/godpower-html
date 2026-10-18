import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { parse } from "acorn";
test("production template contains no empty legacy scripts", () => {
  const files = readdirSync("src/script").filter((x) => x.endsWith(".js"));
  const empty = files.filter(
    (f) =>
      parse(readFileSync("src/script/" + f, "utf8"), { ecmaVersion: "latest" })
        .body.length === 0,
  );
  assert.deepEqual(
    empty,
    [],
    "Remove empty source blocks and synchronize the manifest",
  );
});
