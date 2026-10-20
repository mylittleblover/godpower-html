import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { launch, setup, dismissStartup } from "../fixtures/browser.mjs";

const html = await readFile("dist/godpower.html");
const server = createServer((_request, response) => {
  response.setHeader("Content-Type", "text/html;charset=utf-8");
  response.end(html);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const browser = await launch();
const errors = [];
await mkdir("artifacts/ui-governance-m3", { recursive: true });
try {
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("dialog", (dialog) => dialog.accept());
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  await dismissStartup(page);
  await setup(page, 4);
  await page.locator('.nav-tab[data-view="plugins"]').click();
  assert.equal(await page.locator("#view-plugins").isVisible(), true);
  assert.equal(
    await page.locator('.nav-tab[data-view="plugins"]').innerText(),
    "插件",
  );
  assert.equal(
    await page.locator('.nav-tab[data-view="settings"]').innerText(),
    "设置",
  );
  assert.match(
    await page.locator(".plugin-safety-note").innerText(),
    /不会运行插件 JavaScript/,
  );

  const packageJson = {
    manifestVersion: 1,
    id: "community.sample",
    name: { "zh-CN": "离线示例插件" },
    description: { "zh-CN": "用于验证安全声明式扩展与工作区路由。" },
    author: { name: "Classroom" },
    version: "1.0.0",
    sdk: ">=1.0.0 <2.0.0",
    types: ["tool"],
    subjects: [],
    platforms: ["html"],
    entry: { content: "content.json" },
    permissions: [
      { capability: "ui.page.register", required: true },
      { capability: "plugin.storage", required: true },
      { capability: "audio.play", required: false },
    ],
    dependencies: {},
    optionalDependencies: {},
    contributes: [
      {
        localId: "workspace",
        kind: "page",
        descriptor: {
          titleKey: "plugin.sample.workspace",
          renderer: "builtin.plugin-workspace",
        },
      },
    ],
    data: { schemaVersion: 1 },
  };
  await page.locator("#pluginManifestFile").setInputFiles({
    name: "sample.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(packageJson)),
  });
  await page.waitForFunction(() =>
    GodPowerPluginCenter.platform?.get("community.sample"),
  );
  assert.match(await page.locator(".plugin-card").innerText(), /已安装/);
  assert.equal(
    await page.evaluate(() =>
      GodPowerPageShell.resolvePage("plugins/community.sample/workspace"),
    ),
    null,
  );

  await page
    .locator('[data-plugin-action="enable"][data-plugin-id="community.sample"]')
    .click();
  await page.waitForFunction(() =>
    Boolean(
      GodPowerPageShell.resolvePage("plugins/community.sample/workspace"),
    ),
  );
  assert.equal(await page.locator('[data-plugin-action="route"]').count(), 1);
  await page.locator('[data-plugin-action="route"]').click();
  await page.waitForFunction(
    () => document.querySelector("#pluginWorkspace")?.hidden === false,
  );
  assert.match(
    await page.locator("#pluginWorkspace").innerText(),
    /plugin\.sample\.workspace/,
  );
  await page.screenshot({
    path: "artifacts/ui-governance-m3/plugins-active.png",
    fullPage: true,
  });
  await page.locator('[data-plugin-action="disable"]').click();
  await page.waitForFunction(
    () =>
      GodPowerPageShell.resolvePage("plugins/community.sample/workspace") ===
      null,
  );
  await page.locator('[data-plugin-action="uninstall"]').click();
  await page.waitForFunction(
    () => GodPowerPluginCenter.platform?.get("community.sample") === null,
  );
  assert.deepEqual(errors, []);
  await page.screenshot({
    path: "artifacts/ui-governance-m3/plugins.png",
    fullPage: true,
  });
  console.log(
    JSON.stringify({
      status: "PASS",
      viewport: "1920x1080",
      deviceScaleFactor: 1,
      routes:
        "install -> grant -> activate -> navigate -> deactivate -> uninstall",
      pageErrors: errors,
    }),
  );
  await context.close();
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
