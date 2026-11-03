import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
await mkdir("artifacts/picker-lifecycle", { recursive: true });
const html = await readFile("dist/godpower.html");
const server = createServer((_, r) => {
  r.setHeader("content-type", "text/html;charset=utf-8");
  r.end(html);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  await page.goto("http://127.0.0.1:" + server.address().port, {
    waitUntil: "domcontentloaded",
  });
  await page.evaluate(() => SaveManager.ready());
  await setup(page, 4);
  await page.evaluate(() => {
    ClassroomFeedback.setOptions({ pickEffects: false, scoreEffects: false });
    openPickerModal({ internal: true });
  });
  await page.locator("#btnSlotTrigger").click();
  await page.waitForFunction(() => slotEngine.isSpinning);
  const before = await page.evaluate(
    () => state.itemGlobal.pickerHistory.length,
  );
  await page.evaluate(() => {
    window.testStopAt = performance.now();
    document.getElementById("btnSlotTrigger").click();
    document.getAnimations().forEach((a) => a.cancel());
  });
  await page.waitForTimeout(160);
  assert.equal(
    await page.evaluate(() => GodpowerPicker.getSnapshot().phase),
    "settling",
    "cancelled hidden-window WAAPI must not skip the visible floating reel slowdown",
  );
  await page.waitForFunction(
    () => GodpowerPicker.getSnapshot().phase === "revealed",
  );
  const after = await page.evaluate(() => ({
    elapsed: performance.now() - testStopAt,
    history: state.itemGlobal.pickerHistory.length,
  }));
  assert.ok(after.elapsed >= 900);
  assert.equal(after.history, before + 1);
  const scoreAck = await page.evaluate(async () => {
    const result = GodpowerPicker.getSnapshot().result;
    const reply = await GodpowerPicker.command("score", {
      delta: 2,
      resultId: result.id,
    });
    const loaded = await SaveManager.repository().load(
      SaveManager.snapshot().saveId,
    );
    const stored = loaded.document.match.groups.find(
      (g) => g.id === result.groupId,
    );
    const live = state.groups.find((g) => g.id === result.groupId);
    return {
      ok: reply.ok,
      persisted: reply.persisted,
      stored: stored.score,
      live: live.score,
    };
  });
  assert.equal(scoreAck.ok, true);
  assert.equal(scoreAck.persisted, true);
  assert.equal(
    scoreAck.stored,
    scoreAck.live,
    "floating score reply must follow durable storage ACK",
  );
  await writeFile(
    "artifacts/picker-lifecycle/result.json",
    JSON.stringify({ status: "PASS", ...after, scoreAck }, null, 2),
  );
  console.log(
    "PASS deceleration survives WAAPI cancellation; one result and one history entry",
  );
} finally {
  await browser.close();
  server.close();
}
