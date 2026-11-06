import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html"),
  server = createServer((_q, r) => r.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => {
    window.sent = [];
    window.godpowerDesktop = {
      ai: {
        status: async () => ({
          ok: true,
          config: {
            provider: "amr",
            model: "deepseek-v4.1-flash",
            keyPresent: true,
          },
        }),
        cancel: async () => ({ ok: true }),
        request: async (v) => {
          sent.push(v);
          return {
            ok: true,
            text: JSON.stringify({
              reply: "光合作用把光能转为化学能[R1][W1]。",
              actions: [
                { intent: "adjustScore", params: { group: "G3", delta: 9 } },
              ],
            }),
            sources: [
              { id: "R1", title: "细胞代谢", url: "", kind: "local-excerpt" },
              {
                id: "W1",
                title: "Photosynthesis",
                url: "https://en.wikipedia.org/wiki/Photosynthesis",
                kind: "web-snippet",
                retrievedAt: new Date().toISOString(),
              },
            ],
          };
        },
      },
    };
  });
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.evaluate(() => SaveManager.ready());
  await setup(page, 14);
  await page.evaluate(() => switchView("ai"));
  await page.waitForFunction(
    () =>
      document.querySelector("#aiSend") &&
      !document.querySelector("#aiSend").disabled,
  );
  await page.locator("#aiOpenKnowledge").click();
  await page.waitForFunction(
    () => document.querySelectorAll("#aiKnowledgeList button").length === 36,
  );
  assert.equal(await page.locator("#aiKnowledgeClose").count(), 1);
  assert.equal(
    await page.locator("#aiKnowledgeDialog [data-ui-window-close]").count(),
    1,
  );
  await page.locator("#aiLibrarySubject").selectOption("生物");
  assert.equal(await page.locator("#aiKnowledgeList button").count(), 4);
  await page.locator("#aiKnowledgeList button").first().click();
  assert.ok(
    (await page.locator("#aiKnowledgeDetail").textContent()).includes(
      "光合作用",
    ),
  );
  await mkdir("artifacts/ai-research", { recursive: true });
  await page.screenshot({ path: "artifacts/ai-research/biology-library.png" });
  await page.locator("#aiImportSubject").selectOption("物理");
  await page
    .locator("#aiKnowledgeFile")
    .setInputFiles({
      name: "测试教材摘录.txt",
      mimeType: "text/plain",
      buffer: Buffer.from(
        "这是测试用原创内容：光子的能量E=hν，频率越高，单个光子的能量越大。",
      ),
    });
  await page.waitForFunction(() =>
    document
      .querySelector("#aiKnowledgeStatus")
      .textContent.includes("导入已保存"),
  );
  assert.equal(
    await page.evaluate(() =>
      AIKnowledgeRepository.list().then((d) => d.length),
    ),
    1,
  );
  const before = await page.evaluate(() => AIKnowledgeRepository.list());
  await page
    .locator("#aiKnowledgeFile")
    .setInputFiles({
      name: "测试教材摘录.txt",
      mimeType: "text/plain",
      buffer: Buffer.from(
        "这是测试用原创内容：光子的能量E=hν，频率越高，单个光子的能量越大。",
      ),
    });
  await page.waitForFunction(() =>
    document.querySelector("#aiKnowledgeStatus").textContent.includes("重复"),
  );
  assert.deepEqual(
    await page.evaluate(() => AIKnowledgeRepository.list()),
    before,
  );
  // A batch containing a duplicate may not partially import another document.
  const extra = {
    ...before[0],
    id: "extra",
    title: "不应半导入",
    text: "另一份测试资料",
  };
  await assert.rejects(() =>
    page.evaluate(
      async (docs) => AIKnowledgeRepository.importDocuments(docs),
      [extra, before[0]],
    ),
  );
  assert.deepEqual(
    await page.evaluate(() => AIKnowledgeRepository.list()),
    before,
  );
  await page.locator("#aiLibrarySubject").selectOption("物理");
  await page.locator("#aiLibrarySearch").fill("测试教材");
  await page.locator("#aiKnowledgeList button").click();
  await page.screenshot({
    path: "artifacts/ai-research/imported-material.png",
  });
  await page.locator("#aiKnowledgeClose").click();
  await page.waitForFunction(
    () => !document.querySelector("#aiKnowledgeDialog"),
  );
  await page.locator("#aiMode").selectOption("model");
  await page.locator("#aiUseKnowledge").check();
  await page.locator("#aiKnowledgeSubject").selectOption("生物");
  await page.locator("#aiUseWeb").check();
  await page.locator("#aiWebQuery").fill("photosynthesis chloroplast");
  await page.locator("#aiConsent").check();
  await page.locator("#aiPrompt").fill("解释叶绿体中的光合作用");
  const score = await page.evaluate(() => state.groups[2].score);
  await page.locator("#aiSend").click();
  await page.waitForFunction(() => !document.querySelector("#aiSend").disabled);
  const request = await page.evaluate(() => sent[0]);
  assert.equal(request.research.webQuery, "photosynthesis chloroplast");
  assert.ok(request.research.documents.length > 0);
  assert.ok(request.research.documents.every((d) => d.subject === "生物"));
  assert.deepEqual(request.groups, []);
  assert.equal(await page.locator("#aiMessages [data-proposal]").count(), 0);
  assert.equal(await page.evaluate(() => state.groups[2].score), score);
  assert.ok(
    (await page.locator("#aiMessages").textContent()).includes(
      "本次提供给模型的来源",
    ),
  );
  await page.locator("#aiMessages details summary").click();
  await page.screenshot({ path: "artifacts/ai-research/cited-answer.png" });
  await page.reload();
  await page.evaluate(() => SaveManager.ready());
  assert.equal(
    await page.evaluate(() =>
      AIKnowledgeRepository.list().then((d) => d.length),
    ),
    1,
  );
  await page.evaluate(() => switchView("ai"));
  await page.waitForFunction(() => document.querySelector("#aiOpenKnowledge"));
  await page.locator("#aiOpenKnowledge").click();
  await page.waitForFunction(() =>
    document
      .querySelector("#aiKnowledgeCount")
      ?.textContent.includes("我的资料1"),
  );
  await page.locator("#aiLibrarySearch").fill("测试教材");
  await page.locator("#aiKnowledgeList button").click();
  await page.locator("#aiKnowledgeDetail .btn-danger").click();
  await page.locator("#pcOkV28").click();
  await page.waitForFunction(() =>
    document
      .querySelector("#aiKnowledgeCount")
      ?.textContent.includes("我的资料0"),
  );
  assert.equal(
    await page.evaluate(() =>
      AIKnowledgeRepository.list().then((d) => d.length),
    ),
    0,
  );
  assert.deepEqual(errors, []);
  await writeFile(
    "artifacts/ai-research/result.json",
    JSON.stringify(
      {
        status: "PASS",
        resolution: "1920x1080@1",
        checks: [
          "nine-subjects",
          "single-close",
          "import",
          "duplicate-atomicity",
          "reload",
          "confirmed-delete",
          "scoped-excerpts",
          "source-cards",
          "research-read-only",
        ],
        errors,
      },
      null,
      2,
    ),
  );
  console.log("PASS knowledge library and cited read-only research");
} finally {
  await browser.close();
  await new Promise((r) => server.close(r));
}
