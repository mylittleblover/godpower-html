import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html"),
  server = createServer((q, r) => {
    r.setHeader("Content-Type", "text/html");
    r.end(html);
  });
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
try {
  const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
    }),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("https://**", (r) => r.abort());
  await page.addInitScript(() => {
    window.aiFixture = {
      sent: [],
      config: {
        provider: "opencode",
        model: "glm-5.3-flash",
        keyPresent: true,
        encryptedStorage: false,
        remembered: false,
      },
    };
    window.godpowerDesktop = {
      ai: {
        status: async () => ({ ok: true, config: aiFixture.config }),
        configure: async (v) => ({
          ok: true,
          config: { ...aiFixture.config, provider: v.provider, model: v.model },
        }),
        clear: async () => ({
          ok: true,
          config: { ...aiFixture.config, keyPresent: false },
        }),
        cancel: async () => ({ ok: true }),
        request: async (value) => {
          aiFixture.sent.push(value);
          if (aiFixture.hold)
            await new Promise((resolve) => (aiFixture.resume = resolve));
          return {
            ok: true,
            text: JSON.stringify({
              reply: '<img src=x onerror="window.injected=true"> 模拟模型回复',
              actions: [
                { intent: "adjustScore", params: { group: "G3", delta: 2 } },
              ],
            }),
          };
        },
      },
    };
  });
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.evaluate(() => SaveManager.ready());
  await setup(page, 14);
  await page.evaluate(async () => {
    await saveState();
    await SaveManager.whenIdle();
    switchView("ai");
  });
  assert.equal(await page.locator("#view-ai").isVisible(), true);
  const before = await page.evaluate(() => ({
    score: state.groups[2].score,
    history: historyStack.length,
  }));
  async function send(text) {
    await page.locator("#aiPrompt").fill(text);
    await page.locator("#aiSend").click();
  }
  await send("给第3组加5分");
  const proposal = page.locator("[data-proposal]").last();
  await proposal.waitFor();
  assert.equal(
    await page.evaluate(() => state.groups[2].score),
    before.score,
    "no score before explicit approval",
  );
  await proposal.getByRole("button", { name: "拒绝", exact: true }).click();
  assert.equal(await page.evaluate(() => state.groups[2].score), before.score);
  await send("给第3组加5分");
  const approved = page.locator("[data-proposal]").last();
  await approved.getByRole("button", { name: "确认并执行" }).click();
  await page.waitForFunction(
    (score) => state.groups[2].score === score,
    before.score + 5,
  );
  await page.evaluate(() => classroomCommands.whenIdle());
  assert.equal(
    await page.evaluate(() => historyStack.length),
    before.history + 1,
  );
  await send("给第3组加5分");
  const stale = page.locator("[data-proposal]").last();
  await page.evaluate(async () => {
    ManualScoreCommands.adjust(state.groups[0].id, 1);
    await classroomCommands.whenIdle();
  });
  await stale.getByRole("button", { name: "确认并执行" }).click();
  await page.waitForFunction(() =>
    document
      .getElementById("aiMessages")
      .textContent.includes("课堂或页面已变化"),
  );
  assert.equal(
    await page.evaluate(() => state.groups[2].score),
    before.score + 5,
  );
  await mkdir("artifacts/ai-assistant", { recursive: true });
  await page.screenshot({
    path: "artifacts/ai-assistant/offline-confirmation.png",
  });
  await page.locator("#aiMode").selectOption("model");
  await send("请给第三组加2分");
  assert.equal(
    await page.evaluate(() => aiFixture.sent.length),
    0,
    "network requires per-request consent",
  );
  await page.locator("#aiShareScores").check();
  await page.locator("#aiConsent").check();
  await send("请给第三组加2分");
  assert.equal(await page.evaluate(() => aiFixture.sent.length), 1);
  const sent = await page.evaluate(() => aiFixture.sent[0]);
  assert.equal(sent.groups.length, 14);
  assert.ok(
    sent.groups.every((g) => Object.keys(g).sort().join(",") === "group,score"),
  );
  assert.equal(
    await page.locator("#aiMessages img").count(),
    0,
    "model markup is text only",
  );
  assert.equal(await page.evaluate(() => window.injected), undefined);
  assert.equal(
    await page.evaluate(() => state.groups[2].score),
    before.score + 5,
    "model cannot write before approval",
  );
  await page
    .locator("[data-proposal]")
    .last()
    .getByRole("button", { name: "确认并执行" })
    .click();
  await page.evaluate(() => classroomCommands.whenIdle());
  assert.equal(
    await page.evaluate(() => state.groups[2].score),
    before.score + 7,
  );
  assert.equal(
    await page.locator("#aiConsent").isChecked(),
    false,
    "consent resets after each request",
  );
  await page.screenshot({
    path: "artifacts/ai-assistant/model-confirmation.png",
  });
  const proposalsBeforeRace = await page.locator("[data-proposal]").count();
  await page.evaluate(() => (aiFixture.hold = true));
  await page.locator("#aiShareScores").uncheck();
  await page.locator("#aiConsent").check();
  await send("准备积分提案");
  await page.waitForFunction(() => aiFixture.sent.length === 2);
  await page.locator("#aiShareScores").check();
  await page.evaluate(() => {
    aiFixture.hold = false;
    aiFixture.resume();
  });
  await page.waitForFunction(() => !document.getElementById("aiSend").disabled);
  assert.equal(
    await page.locator("[data-proposal]").count(),
    proposalsBeforeRace,
    "changing context checkbox after sending cannot authorize unshared aliases",
  );
  await page.locator("#aiConsent").check();
  await page.locator("#aiMode").selectOption("offline");
  await page.locator("#aiMode").selectOption("model");
  assert.equal(
    await page.locator("#aiConsent").isChecked(),
    false,
    "switching modes must invalidate previous send consent",
  );
  await page.evaluate(() => (aiFixture.hold = true));
  await page.locator("#aiShareScores").check();
  await page.locator("#aiConsent").check();
  await send("停止测试");
  await page.waitForFunction(() => aiFixture.sent.length === 3);
  const proposalsBeforeStop = await page.locator("[data-proposal]").count();
  await page.locator("#aiStop").click();
  await page.evaluate(() => {
    aiFixture.hold = false;
    aiFixture.resume();
  });
  await page.waitForTimeout(60);
  assert.equal(
    await page.locator("[data-proposal]").count(),
    proposalsBeforeStop,
    "stopped response cannot create an action",
  );
  assert.equal(await page.locator("#aiConsent").isChecked(), false);
  await page.locator("#aiOpenSettings").click();
  assert.equal(await page.locator("#aiProvider").inputValue(), "opencode");
  await page.locator("#aiKey").fill("TEST_ONLY_KEY");
  await page.locator("#aiSettingsForm button[type=submit]").click();
  assert.equal(await page.locator("#aiKey").inputValue(), "");
  await page.screenshot({
    path: "artifacts/ai-assistant/opencode-settings.png",
  });
  await page.locator("#aiForget").click();
  await page.waitForFunction(() =>
    document
      .getElementById("aiSettingsResult")
      .textContent.includes("密钥已清除"),
  );
  await page.evaluate(() => {
    state.columnMode = "double";
    state.resizerEnabled = true;
    state.resizerHeight = 120;
    state.zoomLevel = 1;
    document.body.style.zoom = "1";
    switchView("battle");
    renderAll();
  });
  await page.waitForFunction(() =>
    document
      .getAnimations()
      .every(
        (a) =>
          a.playState !== "running" ||
          a.effect.getComputedTiming().endTime === Infinity,
      ),
  );
  const measure = () =>
    [...document.querySelectorAll("#groupList>.group-row-card")].map((node) => {
      const r = node.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height, b: r.bottom };
    });
  const beforeAI = await page.evaluate(measure);
  await page.locator('[data-view="ai"]').click();
  await page.locator('[data-view="battle"]').click();
  await page.waitForFunction(() =>
    document
      .getAnimations()
      .every(
        (a) =>
          a.playState !== "running" ||
          a.effect.getComputedTiming().endTime === Infinity,
      ),
  );
  const afterAI = await page.evaluate(measure);
  assert.deepEqual(
    afterAI,
    beforeAI,
    "AI navigation cannot alter battle geometry",
  );
  const dockTop = await page
    .locator(".bottom-dock")
    .evaluate((n) => n.getBoundingClientRect().top);
  assert.equal(afterAI.length, 14);
  assert.ok(
    afterAI.every((c) => c.b <= dockTop),
    "14 cards must remain above the dock in the tested configuration",
  );
  await page.screenshot({ path: "artifacts/ai-assistant/battle14.png" });
  const file = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  let fileStatus = "PASS",
    fileReason = null;
  try {
    await file.goto(new URL("../../dist/godpower.html", import.meta.url).href);
    await file.evaluate(() => SaveManager.ready());
    await setup(file, 2);
    await file.evaluate(() => switchView("ai"));
    await file.locator("#aiPrompt").fill("查看小组积分");
    await file.locator("#aiSend").click();
    await file.waitForFunction(() =>
      document.querySelector("#aiMessages").textContent.includes("100 分"),
    );
    assert.equal(
      await file.locator('#aiMode option[value="model"]').isDisabled(),
      true,
    );
    await file.screenshot({ path: "artifacts/ai-assistant/file-offline.png" });
  } catch (error) {
    if (!String(error.message).includes("ERR_BLOCKED_BY_ADMINISTRATOR"))
      throw error;
    fileStatus = "BLOCKED";
    fileReason = "Chromium managed policy blocked file:// navigation";
  } finally {
    await file.close();
  }
  assert.deepEqual(errors, []);
  await writeFile(
    "artifacts/ai-assistant/result.json",
    JSON.stringify(
      {
        status: "PASS",
        errors,
        before,
        finalScore: before.score + 7,
        network: "mock only",
        fileStatus,
        fileReason,
        viewport: "1920x1080 DPR1",
      },
      null,
      2,
    ),
  );
  console.log("file://", fileStatus, fileReason || "");
  console.log(
    "PASS offline proposals, explicit approval, stale revisions, model consent, private context, XSS and OpenCode settings",
  );
} finally {
  await browser.close();
  server.close();
}
