import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html");
const server = createServer((_, res) => {
  res.setHeader("Content-Type", "text/html;charset=utf-8");
  res.end(html);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch(),
  page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
const errors = [],
  results = [];
page.on("pageerror", (e) => errors.push(e.message));
try {
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  await setup(page, 14);
  const answers = await page.evaluate(() => {
    historyStack = [];
    const id = state.groups[0].id,
      out = [];
    for (const opt of ["A", "B", "C", "D", "D"]) {
      window.lastClassroomCommandResult = null;
      selectGroupOpt(id, opt);
      out.push({
        answer: state.groups[0].selectedOpt,
        result: window.lastClassroomCommandResult,
        history: historyStack.length,
      });
    }
    return out;
  });
  assert.deepEqual(
    answers.map((x) => x.answer),
    ["A", "B", "C", "D", ""],
  );
  assert.ok(
    answers.every((x) => x.history === 0 && x.result?.persisted === true),
  );
  results.push(
    "A-D selection, replacement and cancellation persist without new undo entries",
  );
  const allIn = await page.evaluate(() => {
    const g = state.groups[0];
    toggleAllInCard(g.id);
    const enabled = g.allIn;
    toggleAllInCard(g.id);
    const disabled = !g.allIn;
    g.itemUsedThisRound = true;
    const blocked = toggleAllInCard(g.id) === false;
    return {
      enabled,
      disabled,
      blocked,
      value: g.allIn,
      history: historyStack.length,
    };
  });
  assert.deepEqual(allIn, {
    enabled: true,
    disabled: true,
    blocked: true,
    value: false,
    history: 0,
  });
  results.push("All In toggles and item-used restriction are preserved");
  const phase = await page.evaluate(() => {
    state.evaluated = true;
    const g = state.groups[0],
      before = JSON.stringify(g);
    selectGroupOpt(g.id, "A");
    toggleAllInCard(g.id);
    return JSON.stringify(g) === before;
  });
  assert.equal(phase, true);
  results.push("settled phase rejects controls without mutation");
  await setup(page, 4);
  const pending = await page.evaluate(async () => {
    const confirm = themeConfirm;
    let resolve;
    themeConfirm = () =>
      new Promise((done) => {
        resolve = done;
      });
    state.groups[0].inventory = [ItemModules.inventory("spiny")];
    state.groups[3].inventory = [ItemModules.inventory("horn")];
    saveState();
    historyStack = [];
    try {
      useItem(state.groups[0].id, 0);
      selectGroupOpt(state.groups[1].id, "D");
      resolve(true);
      await new Promise((r) => setTimeout(r, 20));
      return {
        pending: classroomCommands.isPending(),
        score: state.groups[3].score,
        attack: state.groups[0].inventory[0]?.key,
        defense: state.groups[3].inventory[0]?.key,
        answer: state.groups[1].selectedOpt,
        history: historyStack.length,
        saved: JSON.parse(localStorage.getItem(Reliability.stateKey)).groups[1]
          .selectedOpt,
      };
    } finally {
      themeConfirm = confirm;
    }
  });
  assert.deepEqual(pending, {
    pending: false,
    score: 220,
    attack: "spiny",
    defense: "horn",
    answer: "D",
    history: 0,
    saved: "D",
  });
  results.push(
    "a new answer cancels stale pending defense and persists the selected answer",
  );
  assert.deepEqual(errors, []);
} finally {
  await mkdir("artifacts/v3-controls", { recursive: true });
  await writeFile(
    "artifacts/v3-controls/results.json",
    JSON.stringify({ results, errors }, null, 2),
  );
  await browser.close();
  server.close();
}
console.log("PASS answer command controls", results);
