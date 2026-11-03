import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
await mkdir("artifacts/hand-flow", { recursive: true });
const html = await readFile("dist/godpower.html"),
  server = createServer((_, r) => {
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
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:" + server.address().port, {
    waitUntil: "domcontentloaded",
  });
  await page.evaluate(() => SaveManager.ready());
  await setup(page, 4);
  await page.evaluate(() => SaveManager.whenIdle());
  const result = await page.evaluate(async () => {
    const service = ClassroomHandSession,
      before = state.groups[0].score;
    await service.command("handSelect", { groupId: 1 });
    const selected = service.getSnapshot();
    const judged = await service.command("handJudge", {
      groupId: 1,
      selectionId: selected.selectionId,
      correct: true,
    });
    const reward = service.getSnapshot();
    const scored = await service.command("handScore", {
      groupId: 1,
      selectionId: selected.selectionId,
      delta: 2,
    });
    const completed = service.getSnapshot();
    const repeated = await service.command("handScore", {
      groupId: 1,
      selectionId: selected.selectionId,
      delta: 2,
    });
    const loaded = await SaveManager.repository().load(
      SaveManager.snapshot().saveId,
    );
    await service.command("handSelect", { groupId: 2 });
    const stale = service.getSnapshot().selectionId;
    service.invalidate();
    const cancelled = await service.command("handJudge", {
      groupId: 2,
      selectionId: stale,
      correct: false,
    });
    return {
      phase: selected.phase,
      judged: judged.persisted,
      rewardPhase: reward.phase,
      scored: scored.persisted,
      completedPhase: completed.phase,
      repeated: repeated.ok,
      delta: state.groups[0].score - before,
      stored: loaded.document.match.groups[0].score === state.groups[0].score,
      cancelled: cancelled.ok,
    };
  });
  assert.deepEqual(result, {
    phase: "JUDGE",
    judged: true,
    rewardPhase: "REWARD_CHOICE",
    scored: true,
    completedPhase: "SELECT_GROUP",
    repeated: false,
    delta: 2,
    stored: true,
    cancelled: false,
  });
  assert.deepEqual(errors, []);
  await writeFile(
    "artifacts/hand-flow/session-result.json",
    JSON.stringify({ status: "PASS", result, errors }, null, 2),
  );
  console.log(
    "PASS shared HTML hand session, one reward, persisted score and stale token rejection",
  );
} finally {
  await browser.close();
  server.close();
}
