import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createServer } from "node:http";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html");
const server = createServer((q, s) => {
  s.setHeader("Content-Type", "text/html;charset=utf-8");
  s.setHeader("Cache-Control", "no-store");
  s.end(html);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch(),
  results = [],
  errors = [];
await mkdir("artifacts/desktop-ui/modals", { recursive: true });
const modals = [
  ["scoreModalBackdrop", "openScoreModal", 1],
  ["memberSearchBackdrop", "openMemberSearchModal"],
  ["pwdModal", "openPwdModal"],
  ["settlementNameModal", "triggerFinalSettlement"],
  ["pickerModal", "openPickerModal"],
  ["itemModalBackdrop", "openItemWindow", 1],
  ["handRaiseBackdrop", "openHandRaise"],
  ["aboutBackdrop", "openAbout"],
  ["batchImportModal", "openBatchImportModal"],
  ["quickPersonBackdropV218", "openQuickPersonScoreV218"],
  ["grandModalOverlay", "confirmFinalSettlement"],
];
try {
  for (const [width, height] of [[1920, 1080]]) {
    const context = await browser.newContext({ viewport: { width, height } });
    await context.route("**/*", (r) => r.continue());
    const p = await context.newPage();
    p.setDefaultTimeout(8000);
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto("http://127.0.0.1:" + server.address().port, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await setup(p);
    for (const zoom of [1]) {
      await p.evaluate((z) => applyZoom(z), zoom);
      for (const [id, fn, arg] of modals) {
        const row = { id, width, height, zoom };
        try {
          if (id === "grandModalOverlay") await setup(p);
          await p.evaluate(({ fn, arg }) => window[fn](arg), { fn, arg });
          await p.waitForTimeout(60);
          row.bounds = await p.locator("#" + id).evaluate((e) => {
            const c =
                e.id === "grandModalOverlay"
                  ? e.querySelector(".grand-card")
                  : e.firstElementChild,
              r = c.getBoundingClientRect();
            return {
              x: r.x,
              y: r.y,
              right: r.right,
              bottom: r.bottom,
              width: r.width,
              height: r.height,
            };
          });
          const r = row.bounds;
          assert.ok(
            r.x >= -1 &&
              r.y >= -1 &&
              r.right <= width + 1 &&
              r.bottom <= height + 1,
            JSON.stringify(r),
          );
          await p.keyboard.press("Tab");
          assert.equal(
            await p
              .locator("#" + id)
              .evaluate((e) => e.contains(document.activeElement)),
            true,
          );
          row.screenshot = `artifacts/desktop-ui/modals/${id}-${width}-${zoom}.png`;
          await p.screenshot({ path: row.screenshot });
          row.status = "PASS";
        } catch (e) {
          row.status = "FAIL";
          row.error = e.message;
        }
        await p.keyboard.press("Escape");
        await p.locator("#" + id).waitFor({ state: "hidden" });
        results.push(row);
        console.log(row.status, id, width, zoom, row.error || "");
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
  await writeFile(
    "artifacts/desktop-ui/modal-matrix.json",
    JSON.stringify(
      {
        results,
        errors,
        zoomMethod: "program CSS zoom (not browser toolbar zoom)",
      },
      null,
      2,
    ),
  );
  console.log({
    pass: results.filter((x) => x.status === "PASS").length,
    fail: results.filter((x) => x.status === "FAIL").length,
    errors,
  });
  if (results.some((x) => x.status === "FAIL") || errors.length)
    process.exitCode = 1;
}
