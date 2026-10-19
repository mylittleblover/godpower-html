import test from "node:test";
import assert from "node:assert/strict";
import { parse } from "acorn";
import { readFileSync, readdirSync } from "node:fs";
const canonical = new Map(
  [
    "renderAll",
    "renderGrid",
    "useItem",
    "legacyUseItem",
    "legacyJudgeRound",
    "applyItemScore",
    "tryDefend",
    "saveState",
    "recordHistory",
    "restoreStateFromSnapshot",
    "undoLast",
  ].map((k) => [k, []]),
);
function walk(n, fn) {
  if (!n || typeof n !== "object") return;
  fn(n);
  for (const v of Object.values(n)) {
    if (Array.isArray(v)) v.forEach((x) => walk(x, fn));
    else if (v?.type) walk(v, fn);
  }
}
for (const file of readdirSync("src", { recursive: true }).filter((f) =>
  f.endsWith(".js"),
)) {
  const path = "src/" + file;
  walk(parse(readFileSync(path, "utf8"), { ecmaVersion: "latest" }), (n) => {
    const name =
      n.type === "FunctionDeclaration"
        ? n.id?.name
        : n.type === "AssignmentExpression"
          ? n.left?.name
          : null;
    if (canonical.has(name))
      canonical.get(name).push({ file: path, type: n.type });
  });
}
for (const [name, entries] of canonical)
  test(`${name} has exactly one canonical definition and no override assignment`, () => {
    assert.equal(entries.length, 1, JSON.stringify(entries));
    assert.equal(entries[0].type, "FunctionDeclaration");
  });
