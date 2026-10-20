import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const context = vm.createContext({});
vm.runInContext(
  readFileSync("src/domain/items/impact-facts.js", "utf8") +
    "\nglobalThis.api=ItemImpactFacts;",
  context,
);
const scoreLosses = context.api.scoreLosses;

test("item impact facts report only actual losses to other stable groups", () => {
  const facts = scoreLosses(
    [
      { groupUid: "actor", score: 15 },
      { groupUid: "target", score: 20 },
      { groupUid: "unchanged", score: 8 },
    ],
    [
      { groupUid: "actor", score: 30 },
      { groupUid: "target", score: 10 },
      { groupUid: "unchanged", score: 8 },
    ],
    { actorGroupUid: "actor", itemKey: "spiny", seasonId: "season-1" },
  );
  assert.deepEqual(JSON.parse(JSON.stringify(facts)), [
    {
      aggregate: { type: "group", id: "target" },
      payload: {
        seasonId: "season-1",
        itemKey: "spiny",
        attackerGroupUid: "actor",
        scoreBefore: 20,
        scoreAfter: 10,
        scoreLost: 10,
      },
    },
  ]);
});

test("invalid identities, score values and no-op or beneficial changes emit no hit", () => {
  assert.deepEqual(
    JSON.parse(
      JSON.stringify(
        scoreLosses(
          [{ groupUid: "target", score: 1 }],
          [{ groupUid: "target", score: 0 }],
          { actorGroupUid: "", itemKey: "spiny" },
        ),
      ),
    ),
    [],
  );
  assert.deepEqual(
    JSON.parse(
      JSON.stringify(
        scoreLosses(
          [
            { groupUid: "same", score: 3 },
            { groupUid: "bad", score: Number.MAX_SAFE_INTEGER + 1 },
          ],
          [
            { groupUid: "same", score: 3 },
            { groupUid: "bad", score: 1 },
          ],
          { actorGroupUid: "actor", itemKey: "spiny" },
        ),
      ),
    ),
    [],
  );
});
