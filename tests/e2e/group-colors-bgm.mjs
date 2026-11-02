import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html");
const server = createServer((_, res) => {
  res.setHeader("Content-Type", "text/html;charset=utf-8");
  res.end(html);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => {
    window.__audioEdges = [];
    const connect = AudioNode.prototype.connect;
    AudioNode.prototype.connect = function (destination, ...args) {
      window.__audioEdges.push([this, destination]);
      return connect.call(this, destination, ...args);
    };
  });
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(page, 14);
  for (const theme of ["classic", "marx"]) {
    const colors = await page.evaluate((theme) => {
      GodpowerTheme.set(theme, { animate: false });
      switchView("battle");
      const rects = () =>
        [...document.querySelectorAll("#groupList > .group-row-card")].map(
          (n) => {
            const r = n.getBoundingClientRect();
            return [r.x, r.y, r.width, r.height];
          },
        );
      renderGrid();
      const before = rects();
      const palette = [
        "#ffff00",
        "#fff2cc",
        "#aaffcc",
        "#ffffff",
        "#0f766e",
        "#ff6600",
      ];
      state.groups.forEach((g, i) => (g.color = palette[i % palette.length]));
      renderGrid();
      const after = rects();
      const records = state.groups.slice(0, 6).map((g) => {
        const card = document.querySelector(`[data-group-id="${g.id}"]`),
          badge = card.querySelector(".battle-group-number"),
          score = card.querySelector(".row-score");
        const rgb = GodpowerUIModel.badgeColors(g.color);
        return {
          color: g.color,
          badgeBg: getComputedStyle(badge).backgroundColor,
          badgeInk: getComputedStyle(badge).color,
          scoreBg: getComputedStyle(score).backgroundColor,
          scoreInk: getComputedStyle(score).color,
          light: score.classList.contains("row-score-light"),
        };
      });
      return { before, after, records };
    }, theme);
    assert.deepEqual(
      colors.after,
      colors.before,
      "paint must not change 14-group card geometry",
    );
    const expected = [
      "rgb(255, 255, 0)",
      "rgb(255, 242, 204)",
      "rgb(170, 255, 204)",
      "rgb(255, 255, 255)",
      "rgb(15, 118, 110)",
      "rgb(255, 102, 0)",
    ];
    colors.records.forEach((r, i) => {
      assert.equal(r.badgeBg, expected[i]);
      assert.equal(r.badgeInk, i < 4 ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)");
      assert.equal(r.light, i < 4);
      if (i < 4) {
        assert.equal(r.scoreBg, expected[i]);
        assert.equal(r.scoreInk, "rgb(255, 255, 255)");
      }
    });
    await mkdir("artifacts/web-transition", { recursive: true });
    await page.waitForTimeout(2200);
    await page.screenshot({
      path: `artifacts/web-transition/group-colors-${theme}-3.0.56.png`,
    });
  }
  await page.evaluate(async () => {
    switchView("settings");
    DesktopUI.selectSettings("sound");
    await getAudioContext();
    menuEnsureGraph();
    getFxOutputV2176();
  });
  assert.equal(await page.locator("#cfgBgmVolume").isVisible(), true);
  const audio = await page.evaluate(async () => {
    const original = { master: state.masterVolume, sfx: state.sfxVolume };
    const slider = document.getElementById("cfgBgmVolume");
    slider.value = 0.25;
    slider.dispatchEvent(new Event("input", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 250));
    const edges = window.__audioEdges;
    return {
      original,
      master: state.masterVolume,
      sfx: state.sfxVolume,
      gain: musicGainNode.gain.value,
      saved: localStorage.getItem("politics_bgm_volume"),
      graph: [
        bgmEngine.battleGain,
        bgmEngine.thinkingGain,
        menuBgm.outGain,
      ].every((node) =>
        edges.some(([from, to]) => from === node && to === musicGainNode),
      ),
      fx: edges.some(
        ([from, to]) => from === fxGainNodeV2176 && to === masterGainNode,
      ),
    };
  });
  assert.equal(audio.graph, true);
  assert.equal(audio.fx, true);
  assert.ok(Math.abs(audio.gain - 0.25) < 0.01);
  assert.equal(audio.master, audio.original.master);
  assert.equal(audio.sfx, audio.original.sfx);
  assert.equal(audio.saved, "0.25");
  await page.evaluate(() => updateBgmVolume(0));
  await page.waitForTimeout(250);
  assert.ok(await page.evaluate(() => musicGainNode.gain.value < 0.01));
  await page.reload();
  await setup(page, 14);
  await page.evaluate(() => {
    switchView("settings");
    DesktopUI.selectSettings("sound");
  });
  assert.equal(await page.locator("#cfgBgmVolume").inputValue(), "0");
  assert.equal(await page.locator("#bgmVolLabel").textContent(), "0%");
  assert.deepEqual(errors, []);
  console.log(
    "PASS two-theme exact group paint, pale badge black ink, pale score white rectangle, unchanged 14-card geometry; independent BGM graph, mute, persistence and untouched FX/master; errors=[]",
  );
} finally {
  await browser.close();
  server.close();
}
