import { readFileSync } from "node:fs";
import vm from "node:vm";
import test from "node:test";
import assert from "node:assert/strict";
const load = () => {
  const c = vm.createContext({});
  vm.runInContext(
    readFileSync("src/domain/competition/effects.js", "utf8") +
      ";globalThis.api=CompetitionEffects",
    c,
  );
  return c.api;
};
test("only one status is active at a time; the same one refreshes", () => {
  const e = load(),
    g = {};
  assert.equal(e.apply(g, "burn"), true, "the first status applies");
  assert.equal(e.apply(g, "poison"), false, "a second status is refused");
  assert.deepEqual(Object.keys(g.competitionEffects), ["burn"]);
  // Re-applying the same status keeps it and refreshes to the longer duration.
  assert.equal(e.apply(g, "burn", 1), true);
  assert.equal(g.competitionEffects.burn.remaining, 2);
  e.cleanse(g);
  assert.deepEqual(Object.keys(g.competitionEffects), []);

  // Invincible and mega force-replace ordinary statuses: while either is active
  // a new negative status is refused outright.
  const guarded = { itemEffect: { type: "star", hitsLeft: 3 } };
  assert.equal(e.apply(guarded, "burn"), false);
  assert.equal(e.has(guarded, "burn"), false);
  assert.equal(guarded.itemEffect.type, "star", "the defensive state survives");
  const mega = { itemEffect: { type: "mega", hitsLeft: 3 } };
  assert.equal(e.apply(mega, "freeze"), false);
  assert.equal(e.has(mega, "freeze"), false);

  assert.equal(e.has(guarded, "invincible"), true);
  assert.equal(e.has({}, "burn"), false);
  assert.equal(e.apply(g, "unknown"), false);
});
test("freeze caps the answer gain it is the only active status", () => {
  const e = load(),
    g = { score: 10 };
  // Defensive states are refused by apply(); negative ones are exclusive.
  e.apply(g, "freeze");
  const result = e.answer(g, 10, 20, () => 0);
  assert.equal(result.answerDelta, 1, "freeze caps the gain at +1");
  assert.equal(result.postDelta, 0, "no burn or poison while frozen");
  assert.equal(result.score, 11);
  assert.equal(g.competitionEffects.freeze.remaining, 1);
  e.answer(g, 11, 12, () => 0);
  assert.equal(e.has(g, "freeze"), false, "freeze expires after two answers");
});
test("paralysis cancels answer only and unanswered does not expire", () => {
  const e = load(),
    g = {};
  e.apply(g, "paralysis");
  // A different status cannot join it.
  assert.equal(e.apply(g, "poison"), false);
  const r = e.answer(g, 10, 0, () => 0);
  assert.equal(r.score, 10, "paralysis has no damage of its own");
  assert.equal(r.answerDelta, 0);
});
test("star and mega multiply total score 2x/3x and preserve wrong-answer scores until defenses expire", () => {
  const e = load();
  for (const type of ["star", "mega"])
    for (const allIn of [true, false])
      for (const correct of [true, false]) {
        const g = { itemEffect: { type, hitsLeft: 3 } };
        assert.equal(
          e.answer(g, 20, correct ? 22 : 0, () => 0, { correct, allIn }).score,
          correct ? (allIn ? 60 : 40) : 20,
        );
        assert.equal(g.itemEffect.hitsLeft, 3);
        g.itemEffect = null;
        assert.equal(
          e.answer(g, 20, 22, () => 0, { correct: true, allIn }).score,
          22,
        );
      }
});
test("freeze cancellation and dizziness consume attempts without consuming inventory", () => {
  const e = load(),
    g = { inventory: [{ key: "green" }] };
  e.apply(g, "freeze");
  assert.equal(e.cancelUse(g), true);
  assert.equal(e.cancelUse(g), false);
  assert.equal(g.inventory.length, 1);
  e.apply(g, "dizziness");
  assert.equal(
    e.redirect(g, false, () => 0),
    false,
  );
  assert.equal(g.competitionEffects.dizziness.remaining, 2);
  assert.equal(
    e.redirect(g, true, () => 0),
    true,
  );
  assert.equal(
    e.redirect(g, true, () => 0.9),
    false,
  );
  assert.equal(e.has(g, "dizziness"), false);
});
