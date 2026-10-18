import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
const c = vm.createContext({ Date });
vm.runInContext(readFileSync("src/ui/model.js", "utf8"), c);
function lum(hex) {
  const x = hex
    .slice(1)
    .match(/../g)
    .map((v) => parseInt(v, 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * x[0] + 0.7152 * x[1] + 0.0722 * x[2];
}
test("saturated group badges prefer white with AA contrast without changing stored color", () => {
  for (const color of [
    "#E5484D",
    "#2F7DD1",
    "#3A9D5D",
    "#F08C1A",
    "#18A6B8",
    "#159E91",
    "#D94F70",
  ]) {
    const r = c.GodpowerUIModel.badgeColors(color);
    assert.equal(r.foreground, "#FFFFFF");
    assert.ok(1.05 / (lum(r.background) + 0.05) >= 4.5, color);
  }
});
test("pale and invalid colors keep readable fallback", () => {
  assert.equal(c.GodpowerUIModel.badgeColors("#ffffff").foreground, "#17302D");
  assert.equal(c.GodpowerUIModel.badgeColors("invalid").background, "#607773");
});
