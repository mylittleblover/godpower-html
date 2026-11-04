import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, dismissStartup, setup } from "../fixtures/browser.mjs";
await mkdir("artifacts/audio-panel-reuse", { recursive: true });
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
    }),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:" + server.address().port, {
    waitUntil: "domcontentloaded",
  });
  await page.evaluate(() => SaveManager.ready());
  await dismissStartup(page);
  await setup(page, 14);
  const result = await page.evaluate(() => {
    switchView("settings");
    DesktopUI.selectSettings("sound");
    renderItemFxSoundListV26();
    const box = document.getElementById("itemFxSoundListV26"),
      button = box.querySelector("button");
    const before = performance.now();
    renderItemFxSoundListV26();
    const ms = performance.now() - before,
      reused = button === box.querySelector("button");
    const previous = customFxVariants.item_coin;
    customFxVariants.item_coin = [
      { id: "fx_item_coin::variant::fixture", name: "测试候选" },
    ];
    renderItemFxSoundListV26();
    const updated = box.textContent.includes("测试候选");
    customFxVariants.item_coin = previous;
    renderItemFxSoundListV26();
    return {
      reused,
      ms,
      updated,
      removed: !box.textContent.includes("测试候选"),
    };
  });
  assert.equal(
    result.reused,
    true,
    "unchanged audio settings must preserve controls instead of rebuilding 28 icon cards",
  );
  assert.equal(result.updated, true);
  assert.equal(result.removed, true);
  assert.deepEqual(errors, []);
  await writeFile(
    "artifacts/audio-panel-reuse/result.json",
    JSON.stringify({ status: "PASS", result, errors }, null, 2),
  );
  console.log(
    "PASS unchanged item audio controls reused; candidate additions/removals still update",
  );
} finally {
  await browser.close();
  server.close();
}
