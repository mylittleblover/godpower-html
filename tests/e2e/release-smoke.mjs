import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html"),
  sha256 = createHash("sha256").update(html).digest("hex"),
  server = createServer((q, s) => {
    if (q.url === "/favicon.ico") {
      s.writeHead(204).end();
      return;
    }
    s.setHeader("Content-Type", "text/html;charset=utf-8");
    s.setHeader("Cache-Control", "no-store");
    s.end(html);
  });
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch(),
  context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  }),
  p = await context.newPage(),
  consoleLogs = [],
  pageErrors = [],
  results = [],
  network = [];
p.on("console", (msg) =>
  consoleLogs.push({ type: msg.type(), text: msg.text() }),
);
p.on("pageerror", (e) => pageErrors.push(e.message));
p.on("request", (q) => network.push(q.url()));
await p.goto("http://127.0.0.1:" + server.address().port, {
  waitUntil: "domcontentloaded",
});
await p.waitForLoadState("load");
await p.waitForTimeout(300);
async function test(name, fn) {
  try {
    await fn();
    results.push({ name, status: "PASS" });
    console.log("PASS", name);
  } catch (e) {
    results.push({ name, status: "FAIL", error: e.stack });
    console.log("FAIL", name, e.message);
  }
}
try {
  await test("HTTP document continues offline: five page navigation and actual correct-answer scoring", async () => {
    await setup(p);
    await context.setOffline(true);
    for (const view of [
      "welcome",
      "history",
      "archives",
      "settings",
      "battle",
    ]) {
      await p.locator(`[data-view="${view}"]`).click();
      assert.equal(await p.locator("#view-" + view).isVisible(), true);
    }
    for (const id of [1, 2, 3, 4])
      await p
        .locator(`.group-row-card[data-group-id="${id}"] .opt-btn`)
        .first()
        .click();
    await p.locator(".ans-btn").first().click();
    await p.locator("#btnMainAction").click();
    await p.waitForFunction(() => state.evaluated);
    assert.deepEqual(
      await p.evaluate(() => state.groups.map((g) => g.score)),
      [102, 142, 182, 222],
    );
  });
  await test("Offline representative major modal lifecycle has no console errors", async () => {
    for (const [fn, arg] of [
      ["openScoreModal", 1],
      ["openMemberSearchModal"],
      ["openPwdModal"],
      ["openPickerModal"],
      ["openItemWindow", 1],
      ["openHandRaise"],
      ["openAbout"],
      ["openBatchImportModal"],
      ["openQuickPersonScoreV218"],
      ["triggerFinalSettlement"],
    ]) {
      await p.evaluate(({ fn, arg }) => window[fn](arg), { fn, arg });
      await p.waitForTimeout(70);
      await p.keyboard.press("Escape");
    }
  });
  await test("Actual archived four-group podium centers champion, preserves ties, full names and CSV offline", async () => {
    await setup(p);
    const result = await p.evaluate(() => {
      state.groups[0].name =
        "冠军甲 · 很长的小组名称也应该在荣誉卡片中完整显示";
      state.groups[0].score = 9876543;
      state.groups[1].score = 9876543;
      state.groups[2].score = 1;
      state.groups[3].score = -10;
      triggerFinalSettlement();
      return confirmFinalSettlement();
    });
    assert.equal(result.ok, true);
    await p.locator("#grandModalOverlay button").last().click();
    await p.locator('[data-view="archives"]').click();
    await p.locator(".ui-archive-summary").first().click();
    await p.waitForLoadState("load");
    await p.waitForTimeout(300);
    const podium = await p.locator(".ui-podium>div").all();
    assert.equal(podium.length, 3);
    const first = await podium[0].boundingBox(),
      second = await podium[1].boundingBox(),
      third = await podium[2].boundingBox();
    assert.ok(second.x < first.x && first.x < third.x);
    assert.match(await podium[0].textContent(), /完整显示/);
    assert.deepEqual(
      await p.evaluate(() =>
        getSettlementHistory()[0]
          .groups.slice(0, 2)
          .map((g) => g.score),
      ),
      [9876543, 9876543],
    );
    await p.screenshot({
      path: "artifacts/desktop-ui/archives-podium-details-1920.png",
    });
    const download = p.waitForEvent("download");
    await p.locator("[data-csv]").first().click();
    await (await download).saveAs("artifacts/desktop-ui/offline-archive.csv");
    assert.ok(
      (
        await readFile("artifacts/desktop-ui/offline-archive.csv", "utf8")
      ).includes("9876543"),
    );
  });
  await test("Representative release has no uncaught errors, console.error or external runtime requests", async () => {
    assert.deepEqual(pageErrors, []);
    assert.deepEqual(
      consoleLogs.filter((x) => x.type === "error"),
      [],
    );
    assert.deepEqual(
      network.filter(
        (u) =>
          !u.startsWith("http://127.0.0.1:") &&
          !u.startsWith("data:") &&
          !u.startsWith("blob:"),
      ),
      [],
    );
  });
} finally {
  await browser.close();
  server.close();
  await writeFile(
    "artifacts/desktop-ui/release-smoke.json",
    JSON.stringify(
      {
        sha256,
        results,
        consoleLogs,
        pageErrors,
        network,
        offlineMethod:
          "HTTP loaded document then context.setOffline(true); initial file:// is separately BLOCKED",
      },
      null,
      2,
    ),
  );
  console.log({
    pass: results.filter((x) => x.status === "PASS").length,
    fail: results.filter((x) => x.status === "FAIL").length,
  });
  if (results.some((x) => x.status === "FAIL")) process.exitCode = 1;
}
