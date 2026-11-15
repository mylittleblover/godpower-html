import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, dismissStartup, setup } from "../fixtures/browser.mjs";

const root = "artifacts/mkw-verify";
await mkdir(root, { recursive: true });
const html = await readFile("dist/godpower.html");
const server = createServer((_, res) => {
  res.setHeader("Content-Type", "text/html;charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(html);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const errors = [];

try {
  const context = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  await page.evaluate(() => SaveManager.ready());
  await dismissStartup(page);
  await setup(page, 6);

  // 1. Settings -> Items MKWorld engine configuration & persistence
  await page.locator('.nav-tab[data-view="settings"]').click();
  await page.waitForTimeout(300);
  await page.locator('[data-category="items"]').click();
  await page.waitForFunction(() => DesktopUI.getSettingsMotionCount() === 0);

  const panel = page.locator("#uiSettingsItemDrawPolicy");
  assert.equal(await panel.isVisible(), true, "ItemDrawSettings panel visible");
  await page.screenshot({ path: `${root}/settings-items-draw.png` });

  // Open simulator disclosure & verify 28-item table renders cleanly without horizontal overflow
  await panel.locator("details > summary").click();
  await page.locator('[data-idraw-sim="position"]').fill("4");
  await page.locator('[data-idraw-sim="position"]').dispatchEvent("change");
  await page.locator('[data-idraw-cfg="mode"]').selectOption("Dynamic");
  await page.locator('[data-idraw-cfg="switchPreset"]').selectOption("P08");
  await page.locator('[data-idraw-cfg="timingMode"]').selectOption("rounds");
  await page.locator('[data-idraw-bool="useComTable"]').check();
  await page.locator('[data-idraw-bool="enableSame"]').check();
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${root}/settings-items-preview.png` });

  const persistedBeforeReload = await page.evaluate(
    () => state.itemGlobal.drawConfig,
  );
  assert.equal(persistedBeforeReload.mode, "Dynamic");
  assert.equal(persistedBeforeReload.switchPreset, "P08");
  assert.equal(persistedBeforeReload.timingMode, "rounds");
  assert.equal(persistedBeforeReload.useComTable, true);
  assert.equal(persistedBeforeReload.enableSame, true);

  await page.evaluate(() => SaveManager.whenIdle?.() ?? SaveManager.ready());
  await page.reload({ waitUntil: "domcontentloaded", timeout: 60000 });
  await page.evaluate(() => SaveManager.ready());
  await dismissStartup(page);
  const reloadedCfg = await page.evaluate(
    () => state.itemGlobal?.drawConfig || null,
  );
  assert.equal(reloadedCfg?.mode, "Dynamic");
  assert.equal(reloadedCfg?.switchPreset, "P08");
  assert.equal(reloadedCfg?.timingMode, "rounds");

  // Reset config via UI button
  await page.locator('.nav-tab[data-view="settings"]').click();
  await page.locator('[data-category="items"]').click();
  await page.waitForFunction(() => DesktopUI.getSettingsMotionCount() === 0);
  await page
    .locator('#uiSettingsItemDrawPolicy [data-idraw-action="reset-config"]')
    .click();
  assert.equal(
    await page.evaluate(() => state.itemGlobal.drawConfig.mode),
    "24KartRace",
  );

  // 2. Gameplay Playbook -> Rules & Official Names verification
  await page.locator('.nav-tab[data-view="gameplay"]').click();
  await page.locator('[data-gameplay-tab="rules"]').click();
  assert.equal(await page.locator(".gameplay-rules").isVisible(), true);
  const rulesText = await page.locator(".gameplay-rules").innerText();
  assert.match(rulesText, /Product\.180/);
  assert.match(rulesText, /ItemParamByRankGParam/);
  assert.match(rulesText, /刺刺龟壳/);
  assert.match(rulesText, /？砖块/);

  await page
    .locator('.gameplay-rules [data-mkw-lookup="mode"]')
    .selectOption("Survival");
  await page.locator('.gameplay-rules [data-mkw-lookup="rank"]').fill("20");
  await page
    .locator('.gameplay-rules [data-mkw-lookup="rank"]')
    .dispatchEvent("change");
  const lookupCount = await page.locator(".gameplay-mkw-pill").count();
  assert.ok(lookupCount > 0, "quick rank lookup displays weights");
  await page.screenshot({
    path: `${root}/gameplay-rules-mkw.png`,
    fullPage: false,
  });

  await page.locator('[data-gameplay-tab="items"]').click();
  const itemTitles = await page
    .locator(
      "#gameplayContent > .item-reference-list > .item-reference-row .item-reference-name",
    )
    .allInnerTexts();
  const joinedTitles = itemTitles.join("\n");
  for (const official of [
    "冲刺蘑菇",
    "三重冲刺蘑菇",
    "强力冲刺蘑菇",
    "刺刺龟壳",
    "黄金龟壳",
    "？砖块",
  ]) {
    assert.ok(
      joinedTitles.includes(official),
      `Missing official title: ${official}`,
    );
  }
  await page.screenshot({ path: `${root}/gameplay-items-official.png` });

  // 3. Operation runtime InkLevel / KillerTargetRank / ThunderFrame metadata
  await setup(page, 6);
  const opMeta = await page.evaluate(async () => {
    ensureItemState();
    state.roundActive = false;
    state.evaluated = true;
    state.groups.forEach((g, idx) => {
      g.score = g.displayScore = 300 - idx * 20;
      g.inventory = [];
      g.itemEffect = null;
      g.competitionEffects = {};
      g.itemUsedThisRound = false;
    });

    // Leader casts blooper -> Rank 1 -> InkLevel 3 -> 120s duration
    state.groups[0].inventory = [ItemModules.inventory("blooper")];
    useItem(state.groups[0].id, 0);
    await classroomCommands.whenIdle();
    const afterLeaderBlooper = { ...state.itemGlobal.mkwState.lastParamEffect };

    // Last place casts bullet -> records killerTargetRank
    state.groups[5].inventory = [ItemModules.inventory("bullet")];
    useItem(state.groups[5].id, 0);
    await classroomCommands.whenIdle();
    const afterBullet = { ...state.itemGlobal.mkwState.lastParamEffect };

    // Last place casts lightning -> records thunderFrame targets
    state.groups[5].itemUsedThisRound = false;
    state.groups[5].inventory = [ItemModules.inventory("lightning")];
    useItem(state.groups[5].id, 0);
    await classroomCommands.whenIdle();
    const afterLightning = {
      effect: state.itemGlobal.mkwState.lastParamEffect,
      targets: state.itemGlobal.mkwState.lastLightningTargets,
    };

    return { afterLeaderBlooper, afterBullet, afterLightning };
  });

  assert.equal(opMeta.afterLeaderBlooper.key, "blooper");
  assert.equal(opMeta.afterLeaderBlooper.inkLevel, 3);
  assert.equal(opMeta.afterBullet.key, "bullet");
  assert.ok(opMeta.afterBullet.killerTargetRank >= 1);
  assert.equal(opMeta.afterLightning.effect.key, "lightning");
  assert.ok(opMeta.afterLightning.targets.length > 0);
  assert.ok(opMeta.afterLightning.targets[0].thunderFrame >= 45);

  assert.deepEqual(errors, []);
  await writeFile(
    `${root}/result.json`,
    JSON.stringify(
      { status: "PASS", persistedBeforeReload, opMeta, errors },
      null,
      2,
    ),
  );
  console.log(
    "PASS MKWorld Product.180 UI, persistence, official names & ParamByRank telemetry",
  );
} finally {
  await browser.close();
  server.close();
}
