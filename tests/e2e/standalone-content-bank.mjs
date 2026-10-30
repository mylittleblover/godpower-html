import assert from "node:assert/strict";
import { readFile, mkdir } from "node:fs/promises";
import { createServer } from "node:http";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html");
const server = createServer((req, res) => {
  res.setHeader("content-type", "text/html;charset=utf-8");
  res.end(html);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const bankRead = () =>
  page.evaluate(() =>
    JSON.parse(document.querySelector("#uiBankEditor").value),
  );
try {
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(page, 4);
  await page.evaluate(() => {
    closeAbout();
    switchView("settings");
    DesktopUI.selectSettings("welcome");
  });
  await page.locator("#uiSettingsBank summary").click();
  await page.locator('[data-bank-add="knowledge"]').click();
  for (const [key, value] of Object.entries({
    id: "class-test",
    title: "课堂知识",
    subject: "politics",
    source: "教师审核",
    summary: "新知识内容",
  }))
    await page.locator("#uiBankField-" + key).fill(value);
  await page.locator("#uiBankRowForm button[type=submit]").click();
  assert.equal((await bankRead()).knowledge.length, 3);
  await page.locator('[data-bank-edit="knowledge"]').last().click();
  await page.locator("#uiBankField-title").fill("已编辑知识");
  await page.locator("#uiBankRowForm button[type=submit]").click();
  assert.equal((await bankRead()).knowledge.at(-1).title, "已编辑知识");
  await page.locator('[data-bank-delete="knowledge"]').last().click();
  await page.locator("#themeDialogActionsV21727 button").last().click();
  assert.equal((await bankRead()).knowledge.length, 2);
  await page.locator('[data-bank-add="challenges"]').click();
  for (const [key, value] of Object.entries({
    id: "class-question",
    title: "新增挑战",
    subject: "politics",
    source: "教师审核",
    explanation: "解析",
  }))
    await page.locator("#uiBankField-" + key).fill(value);
  for (let i = 0; i < 4; i++)
    await page.locator("#uiBankOption-" + i).fill("选项" + i);
  await page.locator("#uiBankAnswer").selectOption("2");
  await page.locator("#uiBankRowForm button[type=submit]").click();
  assert.equal((await bankRead()).challenges.at(-1).answer, 2);
  await page.locator('[data-bank-edit="challenges"]').last().click();
  await page.locator("#uiBankOption-1").fill("编辑后的选项");
  await page.locator("#uiBankRowForm button[type=submit]").click();
  assert.equal((await bankRead()).challenges.at(-1).options[1], "编辑后的选项");
  await page.locator('[data-bank-delete="challenges"]').last().click();
  await page.locator("#themeDialogActionsV21727 button").last().click();
  assert.equal((await bankRead()).challenges.length, 2);
  const original = await bankRead();
  const invalid = structuredClone(original);
  invalid.challenges[0].options[0] = " ";
  await page.locator("#uiBankFile").setInputFiles({
    name: "invalid.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(invalid)),
  });
  await page.waitForFunction(() =>
    document.querySelector("#uiBankStatus").textContent.includes("未导入"),
  );
  assert.deepEqual(await bankRead(), original);
  const valid = structuredClone(original);
  valid.knowledge[0].title = "文件导入知识";
  await page.locator("#uiBankFile").setInputFiles({
    name: "valid.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(valid)),
  });
  await page.waitForFunction(() =>
    document.querySelector("#uiBankStatus").textContent.includes("文件已验证"),
  );
  assert.deepEqual(await bankRead(), valid);
  const downloadEvent = page.waitForEvent("download");
  await page.locator("#uiExportBank").click();
  const download = await downloadEvent;
  const stream = await download.createReadStream();
  let output = "";
  for await (const chunk of stream) output += chunk;
  assert.deepEqual(JSON.parse(output), valid);
  await mkdir("artifacts/ui-governance-3.0.59", { recursive: true });
  await page.screenshot({
    path: "artifacts/ui-governance-3.0.59/content-editor.png",
  });
  assert.deepEqual(errors, []);
  console.log(
    "PASS content bank knowledge/challenge CRUD, atomic invalid/valid import, export, no page errors, Chromium 1920x1080 1x",
  );
} finally {
  await browser.close();
  await new Promise((r) => server.close(r));
}
