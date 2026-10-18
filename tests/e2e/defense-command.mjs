import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
const server = createServer(async (_, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(await readFile("dist/godpower.html"));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const page = await browser.newPage();
const results = [],
  pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(e.message));
try {
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  for (const key of ["mushroom", "triple_mushroom", "horn"])
    for (const scenario of [
      "accept",
      "decline",
      "undo",
      "round",
      "new-command",
      "import",
      "reject",
      "quota",
      "reload",
    ]) {
      try {
        await setup(page);
        const r = await page.evaluate(
          async ({ key, scenario }) => {
            const oldConfirm = themeConfirm,
              oldSet = Storage.prototype.setItem;
            let answer, reject;
            themeConfirm = () =>
              new Promise((a, b) => {
                answer = a;
                reject = b;
              });
            const target = state.groups[3],
              attacker = state.groups[0];
            target.inventory = [
              {
                key,
                charges: key === "triple_mushroom" ? 3 : 1,
                acquiredAt: 123,
              },
            ];
            attacker.inventory = [
              { key: "spiny", charges: 1, acquiredAt: 456 },
            ];
            saveState();
            const start = target.score,
              before = JSON.stringify(getPersistableGroups()),
              persisted = localStorage.getItem(Reliability.stateKey);
            try {
              const ok = useItem(attacker.id, 0);
              if (!answer) throw Error("missing real command defense");
              const pending = window.lastClassroomCommandResult?.pending;
              const savedWhilePending = saveState();
              const untouched =
                localStorage.getItem(Reliability.stateKey) === persisted;
              const exportedGroups = buildClassroomBackup().groups,
                baselineGroups = JSON.parse(before);
              const exported = JSON.stringify(exportedGroups) === before;
              // Actual render/normalization must not make the held main item stale.
              renderAll();
              ensureV2State();
              if (scenario === "undo") undoLast();
              if (scenario === "round") finishStartRound();
              if (scenario === "new-command")
                runClassroomCommand("new", () => {
                  state.groups[0].score += 2;
                  return true;
                });
              if (scenario === "import") {
                const data = JSON.parse(persisted);
                data.groups[0].score = 999;
                importClassroomData(data);
              }
              if (scenario === "quota")
                Storage.prototype.setItem = function () {
                  throw Error("quota-test");
                };
              if (scenario === "reject") reject(Error("dialog-test"));
              else if (scenario !== "reload") answer(scenario !== "decline");
              await new Promise((r) => setTimeout(r, 40));
              const live = state.groups.find((g) => g.id === target.id),
                actor = state.groups.find((g) => g.id === attacker.id);
              const after = {
                exportedGroups,
                baselineGroups,
                ok,
                pending,
                untouched,
                exported,
                deferred: savedWhilePending.deferred,
                score: live.score,
                start,
                defense: live.inventory[0]?.key || null,
                charges: live.inventory[0]?.charges || 0,
                attack: actor.inventory[0]?.key || null,
                actorScore: actor.score,
                history: historyStack.length,
                result: window.lastClassroomCommandResult,
                unsaved: !!window.classroomUnsavedChanges,
              };
              if (scenario === "accept" || scenario === "decline") {
                undoLast();
                after.undoRestored =
                  JSON.stringify(getPersistableGroups()) === before;
              }
              return after;
            } finally {
              themeConfirm = oldConfirm;
              Storage.prototype.setItem = oldSet;
            }
          },
          { key, scenario },
        );
        assert.equal(r.ok, true);
        assert.equal(r.pending, true);
        assert.equal(r.untouched, true);
        assert.equal(r.exported, true);
        assert.equal(r.deferred, true);
        if (["accept", "quota"].includes(scenario)) {
          assert.equal(r.score, r.start);
          assert.equal(r.attack, null);
          assert.equal(r.defense, key === "triple_mushroom" ? key : null);
          assert.equal(r.charges, key === "triple_mushroom" ? 2 : 0);
          assert.equal(r.history, 1);
          if (scenario === "quota") {
            assert.equal(r.result.persisted, false);
            assert.equal(r.unsaved, true);
          }
        } else if (scenario === "decline") {
          assert.equal(r.score, r.start - Math.round(r.start / 2));
          assert.equal(r.defense, key);
          assert.equal(r.attack, null);
          assert.equal(r.history, 1);
        } else if (scenario !== "reload") {
          assert.equal(r.score, r.start);
          assert.equal(r.defense, key);
          assert.equal(r.attack, "spiny");
          assert.equal(r.history, scenario === "new-command" ? 1 : 0);
          if (scenario === "import") assert.equal(r.actorScore, 999);
        }
        if (["accept", "decline"].includes(scenario))
          assert.equal(r.undoRestored, true);
        if (scenario === "reload") {
          const nav = page.waitForNavigation({
            waitUntil: "domcontentloaded",
            timeout: 90000,
          });
          const cdp = await page.context().newCDPSession(page);
          await cdp.send("Page.reload", { ignoreCache: true });
          await nav;
          await cdp.detach();
          await page.waitForFunction(() => window.classroomReady);
          const live = await page.evaluate(() => ({
            score: state.groups[3].score,
            attack: state.groups[0].inventory[0]?.key,
            defense: state.groups[3].inventory[0]?.key,
            history: historyStack.length,
          }));
          assert.equal(live.score, r.start);
          assert.equal(live.attack, "spiny");
          assert.equal(live.defense, key);
          assert.equal(live.history, 0);
        }
        results.push({ key, scenario, status: "PASS" });
        console.log("PASS", key, scenario);
      } catch (error) {
        results.push({ key, scenario, status: "FAIL", error: error.stack });
        console.error("FAIL", key, scenario, error.message);
      }
    }
  // Real, unmocked confirmation buttons, not just injected Promise answers.
  for (const [key, accept] of [
    ["mushroom", true],
    ["triple_mushroom", false],
    ["horn", true],
  ]) {
    await setup(page);
    await page.evaluate((key) => {
      state.groups[3].inventory = [
        { key, charges: key === "triple_mushroom" ? 3 : 1, acquiredAt: 123 },
      ];
      state.groups[0].inventory = [
        { key: "spiny", charges: 1, acquiredAt: 456 },
      ];
      saveState();
      useItem(1, 0);
    }, key);
    await page.locator("#themeDialogV21727.active").waitFor();
    await page.screenshot({ path: `artifacts/refactor/defense-${key}.png` });
    await page
      .locator("#themeDialogActionsV21727 button")
      .nth(accept ? 1 : 0)
      .click();
    await page.waitForFunction(() => !classroomCommands.isPending());
    const actual = await page.evaluate(() => ({
      score: state.groups[3].score,
      attack: state.groups[0].inventory.length,
      history: historyStack.length,
    }));
    assert.equal(actual.score, accept ? 220 : 110);
    assert.equal(actual.attack, 0);
    assert.equal(actual.history, 1);
    results.push({
      key,
      scenario: "real-dialog-" + (accept ? "accept" : "decline"),
      status: "PASS",
    });
  }
  assert.deepEqual(pageErrors, []);
} finally {
  await mkdir("artifacts/refactor", { recursive: true });
  await writeFile(
    "artifacts/refactor/defense-command.json",
    JSON.stringify({ results, pageErrors }, null, 2),
  );
  await browser.close();
  await new Promise((r) => server.close(r));
}
if (results.some((r) => r.status === "FAIL")) process.exitCode = 1;
