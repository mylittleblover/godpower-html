import assert from "node:assert/strict";
import { createServer } from "node:http";
import { execFileSync } from "node:child_process";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
import { renameStyleNames } from "../../scripts/rename-style-names.mjs";
const old = execFileSync("git", ["show", "bab0792:dist/godpower.html"], {
    maxBuffer: 20e6,
  }),
  current = await readFile("dist/godpower.html");
const server = createServer((q, r) => {
  r.setHeader("content-type", "text/html;charset=utf-8");
  r.end(q.url === "/before" ? old : current);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch(),
  results = {},
  errors = [];
try {
  for (const version of ["before", "after"]) {
    const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
    });
    page.on("pageerror", (e) => errors.push({ version, message: e.message }));
    await page.goto(`http://127.0.0.1:${server.address().port}/${version}`);
    await setup(page, 14);
    results[version] = await page.evaluate(() => {
      const out = {};
      for (const tab of ["info", "guide", "items", "unknown"]) {
        renderAbout(tab);
        out[tab] = {
          html: document.getElementById("aboutMain").innerHTML,
          selected: [...document.querySelectorAll("[data-about].active")].map(
            (e) => e.dataset.about,
          ),
        };
      }
      renderFxSlotList();
      out.audio = {
        categories: [
          ...document.querySelectorAll(
            "#soundListContainer > details > summary",
          ),
        ].map((node) => node.textContent),
      };
      return out;
    });
    if (version === "after") {
      const removals = JSON.parse(
        await readFile(
          "artifacts/semantic-governance-3.0.65/css-removals.json",
        ),
      );
      const validity = await page.evaluate(
        (rows) =>
          rows.map((row) => ({
            selector: row.selector,
            property: row.property,
            value: row.coveredBy.value,
            valid: CSS.supports(
              row.property,
              row.coveredBy.value.replace(/\s*!important\s*$/, ""),
            ),
          })),
        removals.removed,
      );
      assert.ok(
        validity.every((row) => row.valid),
        JSON.stringify(validity.filter((row) => !row.valid)),
      );
      await writeFile(
        "artifacts/semantic-governance-3.0.65/css-validity.json",
        JSON.stringify(validity, null, 2),
      );
      await page.evaluate(() => {
        document.getElementById("aboutBackdrop").classList.add("active");
        renderAbout("items");
      });
      await page.screenshot({
        path: "artifacts/semantic-governance-3.0.65/about-items.png",
      });
    }
    await page.close();
  }
  for (const tab of Object.keys(results.before))
    if (results.before[tab].html !== undefined)
      results.before[tab].html = renameStyleNames(results.before[tab].html);
  assert.deepEqual(results.after, results.before);
  assert.deepEqual(errors, []);
  await mkdir("artifacts/semantic-governance-3.0.65", { recursive: true });
  await writeFile(
    "artifacts/semantic-governance-3.0.65/about-comparison.json",
    JSON.stringify({ status: "PASS", results, errors }, null, 2),
  );
  console.log(
    "PASS exact about DOM for info/guide/items/unknown and all later CSS witness values supported; Chromium1920x1080 1x",
  );
} finally {
  await browser.close();
  server.close();
}
