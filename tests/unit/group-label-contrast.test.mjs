import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
import { parse } from "acorn";
const source = readFileSync("src/runtime/core/state-and-preferences.js", "utf8");
const node = parse(source, { ecmaVersion: "latest" }).body.find(
  (n) =>
    n.type === "FunctionDeclaration" && n.id.name === "readableTextOnColor",
);
const c = vm.createContext({});
vm.runInContext(source.slice(node.start, node.end), c);
function luminance(hex) {
  const rgb = hex
    .slice(1)
    .match(/../g)
    .map((x) => parseInt(x, 16) / 255)
    .map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}
function contrast(a, b) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
test("student number foreground meets AA on the existing blue group color", () => {
  assert.ok(contrast("#2f7dd1", c.readableTextOnColor("#2f7dd1")) >= 4.5);
});
test("short colors and invalid-color fallback preserve compatibility", () => {
  assert.equal(c.readableTextOnColor("#abc"), c.readableTextOnColor("#aabbcc"));
  assert.equal(c.readableTextOnColor("invalid"), "#FFFFFF");
});
test("group label text meets AA across 216 solid RGB samples without changing group colors", () => {
  for (const r of [0, 51, 102, 153, 204, 255])
    for (const g of [0, 51, 102, 153, 204, 255])
      for (const b of [0, 51, 102, 153, 204, 255]) {
        const bg =
          "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
        assert.ok(contrast(bg, c.readableTextOnColor(bg)) >= 4.5, bg);
      }
});
