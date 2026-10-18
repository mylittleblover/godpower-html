import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { launch, setup } from "../fixtures/browser.mjs";

const html = await readFile("dist/godpower.html");
const server = createServer((request, response) => {
  response.setHeader("Content-Type", "text/html;charset=utf-8");
  response.end(html);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const browser = await launch();
const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
try {
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(page, 14);
  assert.equal(
    await page.evaluate(() => typeof GodpowerTooltips),
    "object",
    "global tooltip service must be installed",
  );
  await page.evaluate(() => {
    const fixture = document.createElement("div");
    fixture.id = "tooltip-fixture";
    fixture.style.cssText =
      "position:fixed;inset:100px auto auto 600px;z-index:2147483000;background:white;padding:20px;display:flex;gap:30px";
    fixture.innerHTML =
      '<button id="tooltip-first" title="First helpful label" aria-label="Accessible name" aria-describedby="existing-description" style="padding:20px"><span id="tooltip-child-a">Left</span><span id="tooltip-child-b">Right</span></button><button id="tooltip-second" title="Second label" style="padding:20px">Second</button><span title="Ancestor label"><button id="tooltip-empty" title="">Empty</button></span><button id="tooltip-icon" title="Only title" style="width:40px;height:40px"></button><span id="existing-description">Existing description</span>';
    document.body.append(fixture);
  });
  await page.clock.install();
  const first = page.locator("#tooltip-first");
  const tooltip = page.locator('[role="tooltip"]');
  const visible = () => tooltip.evaluate((element) => !element.hidden);
  await first.hover();
  assert.equal(await visible(), true);
  assert.equal(await tooltip.textContent(), "First helpful label");
  await mkdir("artifacts/marx-theme", { recursive: true });
  await page.screenshot({ path: "artifacts/marx-theme/tooltip-visible.png" });
  assert.equal(await first.getAttribute("title"), "");
  assert.equal(await first.getAttribute("aria-label"), "Accessible name");
  assert.match(
    await first.getAttribute("aria-describedby"),
    /existing-description/,
  );
  await page.clock.runFor(2500);
  await page.locator("#tooltip-child-a").hover();
  await page.locator("#tooltip-child-b").hover();
  await page.clock.runFor(501);
  assert.equal(
    await visible(),
    false,
    "child movement must not extend the three second lifetime",
  );
  await page.locator("#tooltip-child-a").hover();
  assert.equal(await visible(), false, "expired hover must stay dismissed");
  assert.equal(
    await first.getAttribute("aria-describedby"),
    "existing-description",
  );
  await page.mouse.move(10, 10);
  assert.equal(await first.getAttribute("title"), "First helpful label");
  await first.hover();
  assert.equal(await visible(), true);
  await page.keyboard.press("Escape");
  assert.equal(await visible(), false);
  await page.locator("#tooltip-child-b").hover();
  assert.equal(await visible(), false);
  await page.mouse.move(10, 10);
  await first.hover();
  await page.clock.runFor(2000);
  await first.evaluate((element) => {
    element.title = '<img src=x onerror="window.tooltipXss=true">';
  });
  await page.waitForFunction(() =>
    document.querySelector('[role="tooltip"]').textContent.includes("<img"),
  );
  assert.equal(await tooltip.locator("img").count(), 0);
  assert.equal(await page.evaluate(() => window.tooltipXss), undefined);
  assert.equal(await first.getAttribute("title"), "");
  await page.clock.runFor(1001);
  assert.equal(
    await visible(),
    false,
    "dynamic titles must not reset the lifetime",
  );
  await page.mouse.move(10, 10);
  assert.match(await first.getAttribute("title"), /<img/);
  await page.locator("#tooltip-second").focus();
  assert.equal(await visible(), true, "keyboard focus shows tooltip");
  await page.clock.runFor(3001);
  assert.equal(await visible(), false);
  await first.focus();
  assert.equal(await visible(), true);
  await first.evaluate((element) => {
    element.title = "Latest renderer label";
    element.blur();
  });
  assert.equal(
    await first.getAttribute("title"),
    "Latest renderer label",
    "cleanup must preserve an unobserved renderer update",
  );
  await page.locator("#tooltip-empty").hover();
  assert.equal(await visible(), false, "empty titles suppress ancestor titles");
  await page.locator("#tooltip-second").hover();
  assert.equal(await visible(), true);
  await page.locator("#tooltip-second").click();
  assert.equal(await visible(), false);
  await page.mouse.move(10, 10);
  await first.hover();
  assert.equal(await visible(), true);
  await page.evaluate(() => GodpowerTooltips.cancel());
  assert.equal(await visible(), false);
  assert.equal(await first.getAttribute("title"), "Latest renderer label");
  assert.equal(await first.getAttribute("aria-label"), "Accessible name");
  await page.mouse.move(10, 10);
  const icon = page.locator("#tooltip-icon");
  await icon.hover();
  assert.match(
    await icon.ariaSnapshot(),
    /button "Only title"/,
    "title-only button keeps its accessible name during suppression",
  );
  await page.mouse.move(10, 10);
  assert.equal(await icon.getAttribute("aria-label"), null);
  await first.evaluate((element) => {
    element.style.cssText = "position:fixed;right:0;bottom:0;padding:10px";
  });
  await first.hover();
  const bounds = await tooltip.boundingBox();
  assert.ok(
    bounds.x >= 0 &&
      bounds.y >= 0 &&
      bounds.x + bounds.width <= 1920 &&
      bounds.y + bounds.height <= 1080,
    "tooltip stays inside the viewport at the bottom right edge",
  );
  await page.mouse.move(10, 10);
  assert.equal(await visible(), false, "pointer leave hides immediately");
  assert.deepEqual(errors, []);
  await writeFile(
    "artifacts/marx-theme/tooltip-results.json",
    JSON.stringify(
      {
        status: "PASS",
        viewport: "1920x1080@1",
        timer: "Playwright browser clock: 3000ms",
        checks: [
          "expiry",
          "no reappear while held",
          "child movement",
          "mouseleave",
          "Escape",
          "click",
          "dynamic title",
          "safe XSS text",
          "keyboard focus",
          "accessible name",
          "viewport bounds",
        ],
        errors,
      },
      null,
      2,
    ),
  );
  console.log("tooltip-lifetime: PASS (Chromium 1920x1080 @1)");
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
