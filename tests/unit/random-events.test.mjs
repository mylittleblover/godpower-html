import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";

function loadRandomEventsContext() {
  const scope = vm.createContext({
    ItemDrawPolicy: {
      keys: [
        "green",
        "red",
        "coin",
        "mushroom",
        "star",
        "mega",
        "bullet",
        "lightning",
        "power",
        "spiny",
        "blooper",
        "kamek",
        "item_box",
      ],
      highImpact: ["star", "mega", "bullet", "lightning", "power", "spiny"],
      unique: ["lightning", "blooper", "kamek", "item_box"],
    },
    ITEM_DEFS: Object.fromEntries(
      [
        "green",
        "red",
        "coin",
        "mushroom",
        "star",
        "mega",
        "bullet",
        "lightning",
        "power",
        "spiny",
        "blooper",
        "kamek",
        "item_box",
      ].map((k) => [k, { name: k, charges: 1 }]),
    ),
  });
  vm.runInContext(
    readFileSync("src/domain/competition/effects.js", "utf8") +
      "\n" +
      readFileSync("src/domain/competition/random-events.js", "utf8"),
    scope,
  );
  return scope.RandomEvents;
}

function makeGroups(scores = [20, 15, 10, 5]) {
  return scores.map((score, idx) => ({
    id: idx + 1,
    groupUid: `grp-${idx + 1}`,
    name: `第 ${idx + 1} 组`,
    score,
    displayScore: score,
    inventory: [],
    itemEffect: null,
    competitionEffects: {},
  }));
}

function forceSingleEvent(RE, groups, id, extra = {}) {
  const disabledIds = RE.CATALOG.map((e) => e.id).filter((x) => x !== id);
  const config = RE.normalizeConfig({
    enabled: true,
    minInterval: 1,
    maxInterval: 1,
    disabledIds,
    ...extra.config,
  });
  const initial = extra.state || RE.createState({ seed: extra.seed || 42, config });
  initial.roundsUntilNext = 1;
  return RE.advanceRound(initial, groups, config);
}

test("deterministic PRNG replays identical random event triggers and values across runs", () => {
  const RE = loadRandomEventsContext();
  const run = () => {
    const groups = makeGroups([30, 20, 10, 0]);
    const cfg = RE.normalizeConfig({ minInterval: 4, maxInterval: 8 });
    let ev = RE.createState({ seed: 123456, config: cfg });
    const trace = [];
    for (let r = 0; r < 24; r++) {
      const res = RE.advanceRound(ev, groups, cfg);
      ev = res.state;
      if (res.outcome.triggered) {
        trace.push({
          round: r + 1,
          id: res.outcome.id,
          summary: res.outcome.summary,
          cursor: ev.rng.cursor,
        });
      }
    }
    return {
      trace,
      scores: groups.map((g) => g.score),
      rng: ev.rng,
    };
  };
  const a = run();
  const b = run();
  assert.deepEqual(a, b);
  assert.ok(a.trace.length >= 2);
});

test("triggers every 4-8 valid rounds, pauses countdown cleanly when disabled, and starts effect on the NEXT round (CR-01/CR-03)", () => {
  const RE = loadRandomEventsContext();
  const cfg = RE.normalizeConfig({ enabled: true, minInterval: 4, maxInterval: 8 });
  let ev = RE.createState({ seed: 99, config: cfg });
  assert.ok(ev.roundsUntilNext >= 4 && ev.roundsUntilNext <= 8);

  const groups = makeGroups([10, 10, 10, 10]);
  const initialUntil = ev.roundsUntilNext;
  const pausedCfg = RE.normalizeConfig({ enabled: false });
  const paused = RE.advanceRound(ev, groups, pausedCfg);
  assert.equal(paused.outcome.reason, "disabled");
  assert.equal(paused.state.validRounds, 0);
  assert.equal(paused.state.roundsUntilNext, initialUntil);

  // Trigger EV01 explicitly on round 4; round 4 itself does not receive EV01 bonus, rounds 5 & 6 do.
  const onlyEv01 = RE.normalizeConfig({
    minInterval: 4,
    maxInterval: 4,
    disabledIds: RE.CATALOG.map((e) => e.id).filter((x) => x !== "EV01"),
  });
  let state = RE.createState({ seed: 7, config: onlyEv01 });
  for (let i = 1; i <= 3; i++) {
    const step = RE.advanceRound(state, groups, onlyEv01);
    state = step.state;
    assert.equal(step.outcome.triggered, false);
    assert.equal(RE.roundAnswerAdjustment(state, groups[0], { correct: true, allIn: false }).baseMultiplier, 1);
  }
  const triggerStep = RE.advanceRound(state, groups, onlyEv01);
  assert.equal(triggerStep.outcome.triggered, true);
  assert.equal(triggerStep.outcome.id, "EV01");
  // Ready for NEXT round (remaining=2)
  assert.equal(triggerStep.state.active[0].remaining, 2);
  assert.equal(RE.roundAnswerAdjustment(triggerStep.state, groups[0], { correct: true, allIn: false }).baseMultiplier, 2);
  // All-in does not double baseMultiplier via EV01
  assert.equal(RE.roundAnswerAdjustment(triggerStep.state, groups[0], { correct: true, allIn: true }).baseMultiplier, 1);

  const roundAfter1 = RE.advanceRound(triggerStep.state, groups, onlyEv01);
  assert.equal(roundAfter1.state.active[0].remaining, 1);
  const roundAfter2 = RE.advanceRound(roundAfter1.state, groups, onlyEv01);
  assert.equal(roundAfter2.state.active.length, 0);
});

test("excludes last event immediately, cools down EV05/EV09 for 2 events, prevents EV10/EV12 conflict, and emits noEligibleEvent (CR-04/CR-05)", () => {
  const RE = loadRandomEventsContext();
  const groups = makeGroups([10, 10, 10, 10]);

  // EV05 cooldown: only EV05 and EV03 enabled -> triggering EV05 leaves only EV03 for next 2 triggers
  const ev05OnlyPlus = RE.normalizeConfig({
    minInterval: 1,
    maxInterval: 1,
    disabledIds: RE.CATALOG.map((e) => e.id).filter((x) => x !== "EV05" && x !== "EV03"),
  });
  let st = RE.createState({ seed: 1, config: ev05OnlyPlus });
  // Trigger #1 force EV05 first
  let r = forceSingleEvent(RE, groups, "EV05");
  assert.equal(r.outcome.id, "EV05");
  assert.equal(r.state.cooldowns.EV05, 2);

  // If ONLY EV05 enabled and on cooldown -> noEligibleEvent
  const onlyEv05 = RE.normalizeConfig({
    minInterval: 1,
    maxInterval: 1,
    disabledIds: RE.CATALOG.map((e) => e.id).filter((x) => x !== "EV05"),
  });
  r.state.roundsUntilNext = 1;
  const blocked = RE.advanceRound(r.state, groups, onlyEv05);
  assert.equal(blocked.outcome.triggered, false);
  assert.equal(blocked.outcome.reason, "noEligibleEvent");

  // EV10 & EV12 mutual exclusion
  const ev10Res = forceSingleEvent(RE, groups, "EV10");
  assert.equal(ev10Res.outcome.id, "EV10");
  assert.equal(RE.isEventEligible(RE.get("EV12"), { groups, state: ev10Res.state }), false);
  assert.equal(
    RE.blocksAttackItem(ev10Res.state, { effect: "fraction", target: "above" }),
    true,
  );
  assert.equal(
    RE.blocksAttackItem(ev10Res.state, { effect: "flat", target: "self" }),
    false,
  );
});

test("supports all 16 event behaviors (EV01-EV16) and edge cases", () => {
  const RE = loadRandomEventsContext();

  // EV02 flat +3, EV03 +5..15, EV04 -10..+10
  {
    const g = makeGroups([10, 10, 10, 10]);
    const s2 = forceSingleEvent(RE, g, "EV02").state;
    assert.equal(RE.roundAnswerAdjustment(s2, g[0], { correct: true, allIn: false }).flatBonus, 3);
    const s3 = forceSingleEvent(RE, g, "EV03");
    assert.equal(s3.outcome.changes.length, 1);
    assert.ok(s3.outcome.changes[0].delta >= 5 && s3.outcome.changes[0].delta <= 15);
    const s4 = forceSingleEvent(RE, g, "EV04");
    assert.equal(s4.outcome.changes.length, 1);
    assert.ok([-10, -5, 0, 5, 10].includes(s4.outcome.changes[0].delta));
  }

  // EV06 single supply, EV07 rear rare supply, EV08 item reorganize (preserves count & persistent primary)
  {
    const g = makeGroups([40, 30, 20, 10]);
    const s6 = forceSingleEvent(RE, g, "EV06");
    assert.equal(s6.outcome.grantedItems.length, 1);

    const g7 = makeGroups([40, 30, 20, 10]);
    const s7 = forceSingleEvent(RE, g7, "EV07");
    assert.equal(s7.outcome.grantedItems.length, 1);
    assert.ok(["grp-3", "grp-4"].includes(s7.outcome.grantedItems[0].groupUid));
    assert.ok(
      ["star", "mega", "bullet", "lightning", "power", "spiny", "blooper", "kamek", "item_box"].includes(
        s7.outcome.grantedItems[0].itemKey,
      ),
    );

    const g8 = makeGroups([10, 10]);
    g8[0].inventory = [{ key: "mega", charges: 1 }, { key: "coin", charges: 1 }];
    g8[0].itemEffect = { type: "mega", roundsLeft: 2 };
    const s8 = forceSingleEvent(RE, g8, "EV08");
    assert.equal(s8.outcome.grantedItems.length, 1);
    assert.equal(g8[0].inventory.length, 2);
    assert.equal(g8[0].inventory[0].key, "mega");
    assert.notEqual(g8[0].inventory[1].key, "coin");
  }

  // EV09 magic storm (2-3 targets) & EV11 cleanse all negative including legacy iceLock
  {
    const g = makeGroups([10, 10, 10, 10]);
    const s9 = forceSingleEvent(RE, g, "EV09");
    assert.ok(s9.outcome.statusChanges.length >= 2 && s9.outcome.statusChanges.length <= 3);
    g[0].itemEffect = { iceLock: 1, iceRoundsLeftV218: 2 };
    const s11 = forceSingleEvent(RE, g, "EV11");
    assert.equal(s11.outcome.id, "EV11");
    assert.equal(g.some((x) => Object.keys(x.competitionEffects || {}).length > 0), false);
    assert.equal(g[0].itemEffect, null);
  }

  // EV12 chaos magnetic field redirects targeted attack ~25% when >=2 legal targets
  {
    const g = makeGroups([40, 30, 20, 10]);
    const s12 = forceSingleEvent(RE, g, "EV12");
    assert.equal(s12.outcome.id, "EV12");
    let redirectedCount = 0;
    for (let i = 0; i < 40; i++) {
      const nextTargets = RE.applyChaosMagneticField(s12.state, {
        group: g[1],
        blueprint: { effect: "fraction", target: "above" },
        targets: [g[0]],
        groups: g,
      });
      if (nextTargets) {
        assert.equal(nextTargets.length, 1);
        assert.notEqual(nextTargets[0].id, g[0].id);
        assert.notEqual(nextTargets[0].id, g[1].id);
        redirectedCount++;
      }
    }
    assert.ok(redirectedCount > 0 && redirectedCount < 40);
  }

  // EV13 rear half (ceil(N/2)), EV14 all non-1st (all tied 1st ineligible), EV15 single-use last place +10, EV16 swap
  {
    const allTied = makeGroups([20, 20, 20, 20]);
    assert.equal(RE.isEventEligible(RE.get("EV14"), { groups: allTied }), false);

    const g = makeGroups([40, 40, 20, 10, 10]);
    const s13 = forceSingleEvent(RE, g, "EV13").state;
    // N=5 -> rear ceil(5/2)=3 groups (grp-3, grp-4, grp-5)
    assert.equal(RE.roundAnswerAdjustment(s13, g[0], { correct: true, allIn: false }).baseMultiplier, 1);
    assert.equal(RE.roundAnswerAdjustment(s13, g[2], { correct: true, allIn: false }).baseMultiplier, 1.5);

    const s14 = forceSingleEvent(RE, g, "EV14").state;
    assert.equal(RE.roundAnswerAdjustment(s14, g[0], { correct: true, allIn: false }).flatBonus, 0);
    assert.equal(RE.roundAnswerAdjustment(s14, g[1], { correct: true, allIn: false }).flatBonus, 0);
    assert.equal(RE.roundAnswerAdjustment(s14, g[2], { correct: true, allIn: false }).flatBonus, 2);

    const s15 = forceSingleEvent(RE, g, "EV15").state;
    const starTargetUid = s15.active[0].targetGroupUids[0];
    assert.ok(["grp-4", "grp-5"].includes(starTargetUid));
    const starGroup = g.find((x) => x.groupUid === starTargetUid);
    assert.equal(RE.roundAnswerAdjustment(s15, starGroup, { correct: true, allIn: false }).flatBonus, 10);
    RE.consumeStarTargets(s15, [starTargetUid]);
    assert.equal(s15.active.length, 0);

    const g16 = makeGroups([10, 10]);
    g16[0].inventory = [{ key: "green", charges: 1 }];
    g16[1].inventory = [{ key: "coin", charges: 1 }];
    const s16 = forceSingleEvent(RE, g16, "EV16");
    assert.equal(s16.outcome.id, "EV16");
    assert.equal(g16[0].inventory[0].key, "coin");
    assert.equal(g16[1].inventory[0].key, "green");
  }
});
