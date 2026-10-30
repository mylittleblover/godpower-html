import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { parse } from "acorn";
const baseline = "48c199f";
const targets = new Set(["globalItemDraw", "handDrawItem"]);
const aliases = new Set([
  "_v26GlobalDraw",
  "_v26HandDraw",
  "_v291GlobalItemDraw",
  "_v2164GlobalItemDraw",
  "_v2164HandDrawItem",
  "_v21710GlobalItemDraw",
  "_v21710HandDrawItem",
]);
function scripts(html) {
  return [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)].map(
    ([, attributes, source]) => ({ attributes, source }),
  );
}
function normalized(value) {
  if (Array.isArray(value))
    return value.filter((v) => v?.type !== "EmptyStatement").map(normalized);
  if (!value || typeof value !== "object")
    return typeof value === "string"
      ? value.replaceAll("3.0.59", "3.0.60")
      : value;
  const result = {};
  for (const [key, v] of Object.entries(value)) {
    if (["start", "end", "raw", "loc"].includes(key)) continue;
    result[key] = normalized(v);
  }
  if (
    result.type === "Property" &&
    !result.computed &&
    result.key.type === "Literal" &&
    typeof result.key.value === "string" &&
    /^[a-zA-Z_$][\w$]*$/.test(result.key.value)
  )
    result.key = { type: "Identifier", name: result.key.value };
  return result;
}
test("all 117 script execution units preserve their AST except the explicitly retired draw chain", () => {
  const before = scripts(
    execFileSync("git", ["show", baseline + ":dist/godpower.html"], {
      encoding: "utf8",
      maxBuffer: 20e6,
    }),
  );
  const after = scripts(readFileSync("dist/godpower.html", "utf8"));
  assert.equal(before.length, 117);
  assert.equal(after.length, before.length);
  let retired = 0;
  for (let i = 0; i < before.length; i++) {
    assert.equal(after[i].attributes, before[i].attributes);
    const old = parse(before[i].source, { ecmaVersion: "latest" }),
      current = parse(after[i].source, { ecmaVersion: "latest" });
    old.body = old.body.flatMap((n) => {
      if (
        before[i].attributes.includes("v21712FastItemFlow") &&
        n.type === "ExpressionStatement" &&
        n.expression.type === "AssignmentExpression" &&
        targets.has(n.expression.left.name)
      )
        return [
          {
            ...n.expression.right,
            type: "FunctionDeclaration",
            id: n.expression.left,
          },
        ];
      let drop =
        n.type === "FunctionDeclaration" &&
        (targets.has(n.id.name) ||
          [
            "updateAllRoulettePreviewLogicV282",
            "startDrawSoundBedV26",
          ].includes(n.id.name));
      drop ||=
        n.type === "ExpressionStatement" &&
        n.expression.type === "AssignmentExpression" &&
        targets.has(n.expression.left.name);
      drop ||=
        n.type === "VariableDeclaration" &&
        n.declarations.every((d) => aliases.has(d.id.name));
      drop ||=
        before[i].attributes.includes("v2164PowerAndItemAudioFix") &&
        n.type === "IfStatement" &&
        [...targets].some((name) =>
          before[i].source
            .slice(n.test.start, n.test.end)
            .includes("typeof " + name),
        );
      if (drop) {
        retired++;
        return [];
      }
      return [n];
    });
    assert.deepEqual(
      normalized(current),
      normalized(old),
      "execution unit " + i + " " + before[i].attributes,
    );
  }
  assert.equal(retired, 24);
});
