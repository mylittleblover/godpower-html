import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { existsSync, readFileSync } from "node:fs";
function load() {
  const c = vm.createContext({});
  if (existsSync("src/application/hand-flow.js"))
    vm.runInContext(readFileSync("src/application/hand-flow.js", "utf8"), c);
  assert.equal(
    typeof c.HandFlow,
    "object",
    "shared hand-flow reducer must exist",
  );
  return c.HandFlow;
}
const context = { saveId: "save-A", generation: 3, revision: 7 };
function selected(f) {
  let s = f.reduce(f.initial(), { type: "ENTER", context }).next;
  return f.reduce(s, {
    type: "SELECT",
    groupId: 1,
    selectionId: "hand-1",
    context,
  }).next;
}
test("one judged selection chooses a reward and completes without another business intent", () => {
  const f = load(),
    s = selected(f);
  assert.equal(s.phase, "JUDGE");
  const judged = f.reduce(s, {
    type: "JUDGE_OK",
    selectionId: "hand-1",
    context,
  });
  assert.equal(judged.commandIntent.action, "handJudge");
  assert.equal(judged.commandIntent.payload.correct, true);
  assert.equal(judged.next.phase, "REWARD_CHOICE");
  for (const [type, phase, action] of [
    ["SELECT_SCORE", "SCORE", "handScore"],
    ["SELECT_DRAW", "DRAW", "handDraw"],
    ["SELECT_USE", "USE", "handUse"],
  ]) {
    const picked = f.reduce(judged.next, {
      type,
      selectionId: "hand-1",
      context,
    });
    assert.equal(picked.next.phase, phase);
    const complete = f.reduce(picked.next, {
      type: "COMPLETE",
      selectionId: "hand-1",
      context,
    });
    assert.equal(complete.next.phase, "SELECT_GROUP");
    assert.equal(complete.commandIntent, null);
    assert.equal(
      f.reduce(complete.next, { type, selectionId: "hand-1", context }).ok,
      false,
    );
  }
});
test("wrong answer returns to groups, cancellation preserves an unspent reward", () => {
  const f = load(),
    s = selected(f);
  const wrong = f.reduce(s, {
    type: "JUDGE_WRONG",
    selectionId: "hand-1",
    context,
  });
  assert.equal(wrong.commandIntent.payload.correct, false);
  assert.equal(wrong.next.phase, "SELECT_GROUP");
  const reward = f.reduce(s, {
    type: "JUDGE_OK",
    selectionId: "hand-1",
    context,
  }).next;
  const score = f.reduce(reward, {
    type: "SELECT_SCORE",
    selectionId: "hand-1",
    context,
  }).next;
  const back = f.reduce(score, { type: "CANCEL" });
  assert.equal(back.next.phase, "REWARD_CHOICE");
  assert.equal(back.commandIntent, null);
  assert.equal(f.reduce(back.next, { type: "EXIT" }).next.phase, "CLOSED");
});
test("stale selection and another save generation cannot create a command", () => {
  const f = load(),
    s = selected(f);
  for (const action of [
    { type: "JUDGE_OK", selectionId: "old", context },
    {
      type: "JUDGE_OK",
      selectionId: "hand-1",
      context: { ...context, generation: 4 },
    },
    {
      type: "JUDGE_OK",
      selectionId: "hand-1",
      context: { ...context, saveId: "save-B" },
    },
  ]) {
    const r = f.reduce(s, action);
    assert.equal(r.ok, false);
    assert.equal(r.commandIntent, null);
    assert.equal(JSON.stringify(r.next), JSON.stringify(s));
  }
  assert.equal(JSON.stringify(s), JSON.stringify(selected(f)));
});
