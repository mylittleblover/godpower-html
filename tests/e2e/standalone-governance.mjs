import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { execFileSync } from "node:child_process";
import { launch, setup } from "../fixtures/browser.mjs";
const before = execFileSync(
  "git",
  [
    "show",
    `${process.env.GOVERNANCE_BASELINE || "b9c6276"}:dist/godpower.html`,
  ],
  {
    maxBuffer: 20e6,
  },
);
const after = await readFile("dist/godpower.html");
const root =
  process.env.GOVERNANCE_ARTIFACTS || "artifacts/ui-governance-3.0.59";
await mkdir(root, { recursive: true });
const server = createServer((q, r) => {
  r.setHeader("content-type", "text/html;charset=utf-8");
  r.end(q.url.startsWith("/before") ? before : after);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const results = {},
  errors = [];
try {
  for (const version of ["before", "after"]) {
    const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
    });
    page.on("pageerror", (e) => errors.push({ version, error: e.message }));
    await page.goto(`http://127.0.0.1:${server.address().port}/${version}`);
    await setup(page, 14);
    results[version] = {};
    for (const theme of ["classic", "marx"]) {
      await page.evaluate((theme) => {
        GodpowerTheme.set(theme, { animate: false });
        DesktopUI.cancelAnimations();
      }, theme);
      for (const view of [
        "welcome",
        "battle",
        "history",
        "archives",
        "settings",
      ]) {
        await page.evaluate((view) => {
          switchView(view);
          DesktopUI.cancelAnimations();
        }, view);
        // Allow legacy FLIP/decoration work to settle; compare stable geometry only.
        await page.waitForTimeout(900);
        results[version][`${theme}/${view}`] = await page.evaluate((view) => {
          const selectors =
            view === "battle"
              ? [
                  "#groupList > .group-row-card",
                  ".bottom-dock",
                  "#heightResizerDock",
                ]
              : [
                  view === "welcome" ? ".gp-hero" : `#view-${view}`,
                  "#view-settings .ui-settings-shell",
                  "#view-settings .ui-settings-nav",
                  "#view-settings .ui-settings-body",
                ];
          return selectors.flatMap((selector) =>
            [...document.querySelectorAll(selector)]
              .filter((n) => n.getClientRects().length)
              .map((n) => {
                const r = n.getBoundingClientRect(),
                  c = getComputedStyle(n);
                return {
                  selector,
                  box: [r.x, r.y, r.width, r.height].map(
                    (x) => Math.round(x * 100) / 100,
                  ),
                  background: c.backgroundColor,
                  color: c.color,
                  display: c.display,
                  gap: c.gap,
                  padding: c.padding,
                  border: c.borderRadius,
                };
              }),
          );
        }, view);
        if (theme === "classic")
          await page.screenshot({
            path: `${root}/${version}-${view}.png`,
            fullPage: true,
          });
      }
      for (const id of [
        "rules",
        "appearance",
        "motion",
        "sound",
        "items",
        "students",
        "teaching",
        "welcome",
        "data",
      ]) {
        await page.evaluate((id) => {
          DesktopUI.selectSettings(id);
          DesktopUI.cancelAnimations();
        }, id);
        assert.equal(
          await page.locator(`[data-category-panel="${id}"]`).isVisible(),
          true,
        );
      }
    }
    if (version === "after") {
      await page.evaluate(() => {
        switchView("welcome");
        DesktopUI.cancelAnimations();
      });
      for (let i = 0; i < 3; i++) {
        await page.locator("#uiNextKnowledge").click();
        assert.equal(await page.locator(".gp-daily-knowledge").count(), 1);
        assert.equal(await page.locator(".gp-daily-challenge").count(), 1);
        assert.equal(await page.locator(".gp-daily-item").count(), 1);
      }
      await page.screenshot({
        path: `${root}/after-daily-refresh.png`,
        fullPage: true,
      });
      await page.evaluate(() => switchView("settings"));
    }
    // Drafts are not rebuilt when switching categories; current preference behavior remains intact.
    await page.evaluate(() => {
      DesktopUI.selectSettings("welcome");
      document.querySelector("#uiBankEditor").value = "draft remains";
    });
    const node = await page.locator("#uiBankEditor").elementHandle();
    await page.evaluate(() => {
      DesktopUI.selectSettings("appearance");
      DesktopUI.selectSettings("welcome");
    });
    assert.equal(
      await page.locator("#uiBankEditor").inputValue(),
      "draft remains",
    );
    assert.equal(
      await page.evaluate(
        (node) => node === document.querySelector("#uiBankEditor"),
        node,
      ),
      true,
    );
    await page.close();
  }
  assert.deepEqual(results.after, results.before);
  assert.deepEqual(errors, []);
  console.log(
    "PASS five pages, two themes, nine settings categories, draft node retention and exact sampled geometry/styles at 1920x1080 1x",
  );
} finally {
  await browser.close();
  server.close();
  await writeFile(
    `${root}/comparison.json`,
    JSON.stringify({ results, errors }, null, 2),
  );
}
