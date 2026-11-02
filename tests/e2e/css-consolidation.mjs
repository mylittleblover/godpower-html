import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createServer } from "node:http";
import { execFileSync } from "node:child_process";
import { launch, setup } from "../fixtures/browser.mjs";
const root = "artifacts/css-consolidation-3.0.66";
await mkdir(root, { recursive: true });
const original = execFileSync("git", ["show", "fc81d1f:dist/godpower.html"], {
    maxBuffer: 20e6,
  }),
  current = await readFile("dist/godpower.html");
const server = createServer((q, r) => {
  r.setHeader("content-type", "text/html;charset=utf-8");
  r.end(q.url === "/before" ? original : current);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch(),
  results = {},
  errors = [];
const scenarios = {
  single: [
    "#groupList .group-row-card",
    "#groupList .score-input",
    "#groupList .row-score",
    "#groupList",
  ],
  picker: [
    "#pickerModal .picker-layout",
    "#pickerModal .picker-center",
    "#pickerModal .picker-left",
    "#pickerModal .picker-right",
  ],
  inventory: [
    "#itemModalBackdrop .item-window",
    "#itemModalBackdrop .queue-main-card",
    "#itemModalBackdrop .queue-role-badge",
    "#itemModalBackdrop .god-item-grid",
  ],
  draw: [
    ".card-item-roulette",
    ".card-item-roulette .r-icon",
    ".card-item-roulette .r-name",
    "#groupList",
  ],
  hand: [".hand-item-draw-stage", ".hand-item-capsule", ".hand-item-progress"],
  warning: [".theme-dialog", ".theme-dialog-card", ".theme-dialog-btn"],
  focus: [".nav-tab:focus-visible"],
};
try {
  for (const version of ["before", "after"]) {
    const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
    });
    page.on("pageerror", (e) => errors.push({ version, message: e.message }));
    await page.goto(`http://127.0.0.1:${server.address().port}/${version}`);
    results[version] = {};
    for (const theme of ["classic", "marx"])
      for (const [scenario, selectors] of Object.entries(scenarios)) {
        await setup(page, 4);
        await page.evaluate((theme) => {
          GodpowerTheme.set(theme, { animate: false });
          DesktopUI.cancelAnimations();
        }, theme);
        await page.evaluate((scenario) => {
          if (scenario === "focus") switchView("settings");
          if (scenario === "single") {
            state.columnMode = "single";
            renderAll();
          }
          if (scenario === "picker") openPickerModal(true);
          if (scenario === "inventory") {
            state.groups[0].inventory = [
              { key: "coin", charges: 1, acquiredAt: 1 },
              { key: "green", charges: 1, acquiredAt: 2 },
            ];
            openItemWindow(1, "items");
          }
          if (scenario === "draw") globalItemDraw();
          if (scenario === "hand") {
            openHandRaise();
            selectHandGroup(1);
            handDrawItem();
          }
          if (scenario === "warning")
            void openThemeDialogV21727("尚有小组未作答", {
              confirm: true,
              danger: true,
            });
        }, scenario);
        await page.waitForTimeout(90);
        if (scenario === "focus") {
          await page.keyboard.press("Tab");
          await page.locator(".nav-tab").first().focus();
        }
        const snapshot = await page.evaluate((selectors) => {
          // Pause presentation only; DesktopUI.cancelAnimations also clears draw
          // nodes and would invalidate the scenario this test is measuring.
          document
            .querySelectorAll(".roulette-swap")
            .forEach((node) => node.classList.remove("roulette-swap"));
          for (const a of document.getAnimations()) {
            try {
              a.pause();
              a.currentTime = 200;
            } catch {}
          }
          const properties = [
            "display",
            "position",
            "top",
            "left",
            "right",
            "bottom",
            "width",
            "height",
            "min-width",
            "max-width",
            "max-height",
            "grid-template-columns",
            "gap",
            "padding",
            "margin",
            "overflow-x",
            "overflow-y",
            "contain",
            "color",
            "background-color",
            "background-image",
            "border-radius",
            "box-shadow",
            "font-size",
            "opacity",
            "z-index",
            "transform",
            "filter",
            "animation-name",
            "animation-duration",
            "transition-duration",
            "outline-style",
            "outline-width",
            "outline-color",
            "outline-offset",
          ];
          return selectors.flatMap((selector) =>
            [...document.querySelectorAll(selector)].map((node, i) => {
              const c = getComputedStyle(node),
                r = node.getBoundingClientRect();
              return {
                selector,
                index: i,
                rect: {
                  x: Math.round(r.x * 100) / 100,
                  y: Math.round(r.y * 100) / 100,
                  width: Math.round(r.width * 100) / 100,
                  height: Math.round(r.height * 100) / 100,
                },
                styles: Object.fromEntries(
                  properties.map((p) => [p, c.getPropertyValue(p)]),
                ),
              };
            }),
          );
        }, selectors);
        assert.ok(
          snapshot.some((r) => r.selector === selectors[0]),
          scenario + " must render a real component",
        );
        results[version][theme + "/" + scenario] = snapshot;
        if (theme === "classic")
          await page.screenshot({
            path: root + "/" + version + "-" + scenario + ".png",
          });
        await page.evaluate((scenario) => {
          if (scenario === "picker") closePickerModal();
          if (scenario === "inventory") closeItemWindow();
          if (scenario === "warning") closeThemeDialogV21727();
          if (scenario === "hand") {
            cancelHandItemDraw();
            closeHandRaise();
          }
        }, scenario);
        if (scenario === "draw")
          await page.waitForFunction(() => !itemDrawBusy);
        await page.waitForTimeout(650);
      }
    await page.close();
  }
  assert.deepEqual(results.after, results.before);
  assert.deepEqual(errors, []);
  console.log(
    "PASS 14 component states (two themes), exact sampled computed styles/geometry, real windows and draw stages; Chromium 1920x1080 1x",
  );
} finally {
  await writeFile(
    root + "/state-comparison.json",
    JSON.stringify({ results, errors }, null, 2),
  );
  await browser.close();
  server.close();
}
