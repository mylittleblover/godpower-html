import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html"),
  server = createServer((_, r) => r.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
try {
  const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
    }),
    errors = [],
    rows = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.evaluate(() => SaveManager.ready());
  await setup(page, 14);
  await page.evaluate(async () => {
    await saveState();
    await SaveManager.whenIdle();
  });
  for (const zoom of [0.8, 1, 1.25]) {
    await page.evaluate((zoom) => {
      closeHandRaise();
      document.body.style.zoom = String(zoom);
      state.zoomLevel = zoom;
      renderAll();
      openHandRaise();
    }, zoom);
    const geometry = await page.evaluate(() => {
      const svg = document.querySelector("#handFlowShade>svg"),
        rect = svg.querySelector("mask rect[rx]"),
        card = document
          .querySelector("#groupList>.group-row-card")
          .getBoundingClientRect();
      const point = new DOMPoint(
        +rect.getAttribute("x"),
        +rect.getAttribute("y"),
      ).matrixTransform(svg.getScreenCTM());
      return { hole: [point.x, point.y], expected: [card.x - 2, card.y - 2] };
    });
    assert.ok(
      Math.abs(geometry.hole[0] - geometry.expected[0]) < 1,
      `mask X aligns at ${zoom}: ${JSON.stringify(geometry)}`,
    );
    assert.ok(
      Math.abs(geometry.hole[1] - geometry.expected[1]) < 1,
      `mask Y aligns at ${zoom}`,
    );
    assert.match(
      await page.locator("[data-hand-close]").innerText(),
      /退出举手/,
    );
    await page.locator('.group-row-card[data-group-id="1"]').click();
    await page
      .locator('[data-hand-judge="correct"]')
      .waitFor({ state: "visible" });
    await page.locator('[data-hand-judge="correct"]').click();
    await page
      .locator('[data-hand-reward="score"]')
      .waitFor({ state: "visible" });
    assert.equal(await page.evaluate(() => HandFlowView.status().active), true);
    rows.push({ zoom, geometry });
  }
  await mkdir("artifacts/hand-flow-zoom", { recursive: true });
  await page.screenshot({ path: "artifacts/hand-flow-zoom/judged-125.png" });
  await page.evaluate(() => closeHandRaise());
  assert.equal(await page.evaluate(() => HandFlowView.status().active), false);
  assert.deepEqual(errors, []);
  await writeFile(
    "artifacts/hand-flow-zoom/result.json",
    JSON.stringify(
      { status: "PASS", viewport: [1920, 1080], dpr: 1, rows, errors },
      null,
      2,
    ),
  );
  console.log(
    "PASS hand masks align at app zoom .8/1/1.25, explicit exit and judged reward remains active",
  );
} finally {
  await browser.close();
  server.close();
}
