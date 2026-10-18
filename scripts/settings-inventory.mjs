import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { launch, setup } from "../tests/fixtures/browser.mjs";
const output = process.argv[2] || "artifacts/settings-cleanup/after";
await mkdir(output, { recursive: true });
const html = await readFile("dist/godpower.html");
const server = createServer((q, s) => s.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch(),
  page = await browser.newPage({ viewport: { width: 1920, height: 1080 } }),
  errors = [];
page.on("pageerror", (e) => errors.push(e.message));
try {
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  await setup(page);
  await page.evaluate(() => switchView("settings"));
  await page.waitForTimeout(900);
  await page.locator('[data-category="sound"]').click();
  await page.waitForFunction(
    () =>
      document.querySelectorAll("#bgmListContainer .sound-row").length ===
      SET_TRACK_TYPES.length,
  );
  await page.locator('[data-category="rules"]').click();
  const inventory = await page.evaluate(() => ({
    header: document.querySelector(
      "#view-settings .ui-settings-header,#view-settings .fullview-header",
    ).innerText,
    controls: [
      ...document.querySelectorAll(
        "#view-settings button,#view-settings input,#view-settings select,#view-settings textarea,#view-settings summary",
      ),
    ].map((e) => ({
      tag: e.tagName,
      id: e.id,
      type: e.type || "",
      text: (
        e.innerText ||
        e.getAttribute("aria-label") ||
        e.closest("label")?.innerText ||
        e.closest(".setting-item,.ui-settings-row")?.innerText ||
        ""
      ).trim(),
      action:
        e.getAttribute("onclick") ||
        e.getAttribute("onchange") ||
        e.getAttribute("oninput") ||
        e.dataset.pref ||
        "",
      category:
        e.closest("[data-category-panel]")?.dataset.categoryPanel || "global",
      details: e.closest("details")?.id || "",
      disabled: e.disabled || false,
    })),
    sections: [...document.querySelectorAll("[data-category-panel]")].map(
      (p) => ({
        category: p.dataset.categoryPanel,
        children: [...p.children].map((e) => ({
          tag: e.tagName,
          id: e.id,
          text: e.innerText?.slice(0, 600),
        })),
        text: p.innerText,
        structure: p.innerHTML,
      }),
    ),
    soundDefinitions: {
      base: FX_SOUND_SLOTS,
      item: ITEM_FX_SOUND_SLOTS,
      icons: UI_ICON_TARGETS,
    },
  }));
  for (const id of [
    "rules",
    "appearance",
    "sound",
    "items",
    "students",
    "welcome",
    "data",
  ]) {
    await page.locator(`[data-category="${id}"]`).click();
    await page.waitForFunction(() => !DesktopUI.getSettingsMotionCount || DesktopUI.getSettingsMotionCount() === 0);
    await page.screenshot({ path: `${output}/${id}.png` });
  }
  await writeFile(
    `${output}/inventory.json`,
    JSON.stringify(
      { browser: browser.version(), ...inventory, errors },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify({
      output,
      controls: inventory.controls.length,
      categories: inventory.sections.length,
      errors,
    }),
  );
} finally {
  await browser.close();
  await new Promise((r) => server.close(r));
}
