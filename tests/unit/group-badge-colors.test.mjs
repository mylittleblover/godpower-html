import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
const c = vm.createContext({ Date });
vm.runInContext(readFileSync("src/ui/model.js", "utf8"), c);
test("all group fills stay exact and badge/score ink shares sufficient contrast", () => {
  const luminance = (hex) =>
    hex
      .slice(1)
      .match(/../g)
      .map((v) => parseInt(v, 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
      .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
  for (const color of [
    "#E5484D",
    "#2F7DD1",
    "#3A9D5D",
    "#F08C1A",
    "#18A6B8",
    "#159E91",
    "#D94F70",
    "#ff6600",
  ]) {
    const r = c.GodpowerUIModel.badgeColors(color),
      l = luminance(color),
      ink = luminance(r.foreground);
    assert.equal(r.background.toLowerCase(), color.toLowerCase());
    assert.ok((Math.max(l, ink) + 0.05) / (Math.min(l, ink) + 0.05) >= 4.5);
    assert.equal(
      JSON.stringify(r),
      JSON.stringify(c.GodpowerUIModel.scoreColors(color)),
    );
  }
});
test("pale and invalid colors keep readable fallback", () => {
  assert.equal(c.GodpowerUIModel.badgeColors("#ffffff").foreground, "#000000");
  assert.equal(c.GodpowerUIModel.badgeColors("invalid").background, "#607773");
});
