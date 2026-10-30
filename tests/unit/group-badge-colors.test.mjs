import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
const c = vm.createContext({ Date });
vm.runInContext(readFileSync("src/ui/model.js", "utf8"), c);
test("saturated group badges retain exact selected fill and white ink", () => {
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
    assert.equal(r.background.toLowerCase(), color.toLowerCase());
  }
});
test("pale and invalid colors keep readable fallback", () => {
  assert.equal(c.GodpowerUIModel.badgeColors("#ffffff").foreground, "#000000");
  assert.equal(c.GodpowerUIModel.badgeColors("invalid").background, "#607773");
});
