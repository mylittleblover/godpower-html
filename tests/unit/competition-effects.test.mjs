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
test("statuses refresh and normalize old data, and defensive states block them", () => {
  const e = load(),
    g = {};
  e.apply(g, "burn");
  e.apply(g, "poison");
  e.apply(g, "burn", 1);
  // Re-applying refreshes to the longer duration instead of stacking counts.
  assert.equal(g.competitionEffects.burn.remaining, 2);
  assert.equal(Object.keys(g.competitionEffects).length, 2);
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
test("bonus uses independent base; freeze caps before poison and burn", () => {
  const e = load(),
    g = { score: 10 };
  for (const k of ["invincible", "mega", "freeze", "burn", "poison"])
    e.apply(g, k);
  const result = e.answer(g, 10, 20, () => 0);
  assert.equal(result.answerDelta, 1);
  assert.equal(result.postDelta, -3);
  assert.equal(result.score, 8);
  assert.equal(g.competitionEffects.freeze.remaining, 1);
  e.answer(g, 8, 10, () => 0);
  assert.equal(e.has(g, "freeze"), false);
  assert.equal(g.competitionEffects.poison.remaining, 1);
});
test("paralysis cancels answer only and unanswered does not expire", () => {
  const e = load(),
    g = {};
  e.apply(g, "paralysis");
  e.apply(g, "poison");
  const r = e.answer(g, 10, 0, () => 0);
  assert.equal(r.score, 8);
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
