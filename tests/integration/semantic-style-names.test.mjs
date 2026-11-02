import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { renameStyleNames } from "../../scripts/rename-style-names.mjs";
const names = JSON.parse(readFileSync("scripts/semantic-style-names.json"));
const manifest = JSON.parse(readFileSync("src/manifest.json"));
test("semantic style names are unique and contain no release numbers", () => {
  const values = Object.values({ ...names.classes, ...names.animations });
  assert.equal(new Set(values).size, values.length);
  assert.ok(values.every((x) => !/[vV]\d/.test(x)));
  for (const { path, type } of manifest.blocks)
    if (type === "style") {
      const css = readFileSync("src/" + path, "utf8");
      assert.deepEqual(
        [...css.matchAll(/\.([a-zA-Z_][\w-]*)/g)]
          .map((m) => m[1])
          .filter((x) => /[vV]\d/.test(x)),
        [],
        path,
      );
      assert.deepEqual(
        [...css.matchAll(/@keyframes\s+([\w-]+)/g)]
          .map((m) => m[1])
          .filter((x) => /[vV]\d/.test(x)),
        [],
        path,
      );
    }
});
test("naming checkpoint 645ea0f preserves all original scripts outside the declared style-name migration", () => {
  const baseline = JSON.parse(
    execFileSync("git", ["show", names.baseline + ":src/manifest.json"], {
      encoding: "utf8",
    }),
  );
  for (const { path, type } of baseline.blocks) {
    if (type !== "script" || path === "ui/component-catalog.js") continue;
    const original = execFileSync(
      "git",
      ["show", names.baseline + ":src/" + path],
      { encoding: "utf8", maxBuffer: 2e6 },
    );
    assert.equal(
      execFileSync("git", ["show", "645ea0f:src/" + path], {
        encoding: "utf8",
        maxBuffer: 2e6,
      }),
      renameStyleNames(original),
      path,
    );
  }
});
