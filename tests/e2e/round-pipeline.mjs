import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
import { sourceAt } from "../fixtures/source-at.mjs";
const baseline = process.env.ROUND_BASELINE || "da00d1b";
const before = sourceAt(baseline),
  after = await readFile("dist/godpower.html");
const server = createServer((request, response) => {
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.end(request.url === "/before" ? before : after);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const browser = await launch();
const outputs = {};
try {
  for (const version of ["before", "after"]) {
    const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
    });
    await page.goto(`http://127.0.0.1:${server.address().port}/${version}`, {
      waitUntil: "domcontentloaded",
    });
    await setup(page);
    outputs[version] = await page.evaluate(async () => {
      renderAll = () => {};
      renderGrid = () => {};
      renderControls = () => {};
      captureCardRectsV21725 = () => ({});
      animateCardsFromSnapshotV21725 = () => {};
      showItemUseFx = () => {};
      showMilestoneBanner = () => {};
      let sounds = [],
        toasts = [],
        animations = [],
        scheduled = [];
      playSound = (key) => sounds.push(key);
      showToast = (text) => toasts.push(String(text));
      themeAlert = (text) => toasts.push(String(text));
      bgmTriggerVictory = (callback) => {
        sounds.push("victory");
        callback?.();
      };
      animateScores = (updates, done) => {
        animations.push(updates.map((row) => ({ ...row })));
        for (const row of updates) {
          const group = state.groups.find((group) => group.id === row.groupId);
          if (group) group.displayScore = row.target;
        }
        done?.();
      };
      window.setTimeout = (callback, delay) => {
        if (delay === 720) scheduled.push(callback);
        return 1;
      };
      Date.now = () => 1700000000000;
      let seed = 19;
      const random = () =>
        (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296;
      Math.random = random;
      const rows = [];
      for (let scenario = 0; scenario < 80; scenario++) {
        Reliability.invalidateDefenseDecisions();
        cancelScoreAnimationAndSync();
        sounds = [];
        toasts = [];
        animations = [];
        scheduled = [];
        const count = scenario % 10 === 0 ? 14 : 4;
        state.groups = normalizeAllGroups(
          Array.from({ length: count }, (_, index) => {
            const type = ["power", "ice", "boo", "none"][
              (scenario + index) % 4
            ];
            const effect =
              type === "power"
                ? { type: "power", roundsLeft: (scenario % 3) + 1 }
                : type === "ice"
                  ? { iceLock: 1, iceRoundsLeftV218: (scenario % 3) + 1 }
                  : null;
            const key =
              type === "power"
                ? "power"
                : (scenario + index) % 7 === 0
                  ? "banana"
                  : "coin";
            return {
              id: index + 1,
              groupUid: "round-group-" + index,
              groupNo: index + 1,
              name: "组" + index,
              score:
                scenario === 79
                  ? Number.MAX_SAFE_INTEGER
                  : Math.floor(random() * 120) - 10,
              members: [],
              selectedOpt: ["", "A", "B", "C", "D"][Math.floor(random() * 5)],
              allIn: random() < 0.3,
              inventory: [
                {
                  key,
                  charges: key === "power" ? 3 : 1,
                  acquiredAt: index,
                  itemInstanceId: "item-round-" + index,
                },
              ],
              itemEffect: effect,
              booShield: type === "boo" ? 1 : 0,
              booRoundsLeftV218: type === "boo" ? (scenario % 3) + 1 : 0,
              itemStats: { correct: index, wrong: 1, draws: 2, used: 1 },
              itemUsedThisRound: true,
              roundItemContinuationKeyV218: "triple_green",
            };
          }),
        );
        state.seasonId = "season-round-test";
        state.roundActive = true;
        state.evaluated = false;
        state.hasStartedOnce = true;
        state.correctAns = "ABCD"[scenario % 4];
        state.isLocked = false;
        state.itemGlobal = {
          pkTotal: scenario,
          totalDraws: 0,
          customIcons: {},
          blooperUntil: 0,
          pickerHistory: [],
          handRaiseHistory: [],
        };
        historyStack = [];
        ensureV2State();
        const result = judgeRound();
        if (typeof classroomCommands.whenIdle === "function")
          await classroomCommands.whenIdle();
        const timers = scheduled.length;
        scheduled.forEach((callback) => callback());
        rows.push({
          scenario,
          result,
          timers,
          groups: state.groups.map((group) => ({
            id: group.id,
            score: group.score,
            displayScore: group.displayScore,
            inventory: group.inventory,
            stats: group.itemStats,
            effect: group.itemEffect,
            booShield: group.booShield,
            booRounds: group.booRoundsLeftV218 || 0,
            continuation: group.roundItemContinuationKeyV218 || "",
            used: group.itemUsedThisRound,
            selectedOpt: group.selectedOpt,
            allIn: group.allIn,
            resultText: group.resultText,
          })),
          pkTotal: state.itemGlobal.pkTotal,
          evaluated: state.evaluated,
          lastAllIn: state.lastRoundAllIn,
          history: historyStack.length,
          sounds,
          toasts,
          animations,
        });
      }
      return rows;
    });
    await page.close();
  }
  const withoutPresentation = (rows) =>
    rows.map(({ animations, ...businessState }) => businessState);
  assert.deepEqual(
    withoutPresentation(outputs.after),
    withoutPresentation(outputs.before),
  );
  outputs.after.forEach((actual, index) => {
    const prior = outputs.before[index];
    assert.deepEqual(actual.animations[0], prior.animations[0]);
    assert.ok(
      actual.animations.length === prior.animations.length ||
        actual.animations.length === prior.animations.length + 1,
      `unexpected animation phase count in scenario ${actual.scenario}`,
    );
    if (actual.animations.length > prior.animations.length) {
      const settledScores = new Map(
        actual.groups.map((group) => [group.id, group.score]),
      );
      actual.animations
        .at(-1)
        .forEach((update) =>
          assert.equal(update.target, settledScores.get(update.groupId)),
        );
    }
  });
  await mkdir("artifacts/v3-round", { recursive: true });
  await writeFile(
    "artifacts/v3-round/differential.json",
    JSON.stringify(
      {
        baseline,
        browser: browser.version(),
        cases: outputs.after.length,
        status: "PASS",
        results: outputs.after,
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS round pipeline differential: 80 seeded scenarios, 4/14 groups, power/ice/boo, All In and overflow",
  );
} finally {
  await browser.close();
  server.close();
}
