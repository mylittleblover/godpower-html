/* Additive status state; legacy itemEffect owns defense charges independently. */
globalThis.CompetitionEffects = (() => {
  const definitions = Object.freeze({
    burn: { name: "灼烧", duration: 2, negative: true },
    freeze: { name: "冰冻", duration: 2, negative: true },
    paralysis: { name: "麻痹", duration: 2, negative: true },
    poison: { name: "中毒", duration: 3, negative: true },
    dizziness: { name: "眩晕", duration: 2, negative: true },
    invincible: { name: "无敌", duration: 3 },
    mega: { name: "巨大化", duration: 3 },
  });
  /* Invincible and mega last a fixed number of answer rounds, not a number of
     attacks absorbed: a defense that never gets attacked still expires. */
  const DEFENSIVE_ROUNDS = 3;
  const defensiveType = (key) => (key === "invincible" ? "star" : key === "mega" ? "mega" : null);
  const negative = Object.keys(definitions).filter(
    (k) => definitions[k].negative,
  );
  function normalize(group) {
    const raw = group.competitionEffects;
    const effects = {};
    for (const key of Object.keys(definitions)) {
      if (key === "invincible" || key === "mega") continue;
      const remaining = Number(raw?.[key]?.remaining);
      if (Number.isSafeInteger(remaining) && remaining > 0)
        effects[key] = { remaining: Math.min(remaining, 999) };
    }
    group.competitionEffects = effects;
    return effects;
  }
  function has(group, key) {
    if (key === "invincible" || key === "mega")
      return group?.itemEffect?.type === defensiveType(key);
    return Number(group?.competitionEffects?.[key]?.remaining) > 0;
  }
  function apply(group, key, duration = definitions[key]?.duration) {
    if (key === "invincible" || key === "mega") return false; // Only the corresponding inventory item grants these states.
    if (!definitions[key] || !Number.isSafeInteger(duration) || duration <= 0)
      return false;
    // Invincible and mega block every ordinary status, including negative ones.
    if (has(group, "invincible") || has(group, "mega")) return false;
    const effects = normalize(group);
    /* Only one status may be active at a time: a different status is refused
       rather than coexisting. Re-applying the same one refreshes its timer. */
    const others = Object.keys(effects).filter((name) => name !== key);
    if (others.length) return false;
    effects[key] = {
      remaining: Math.max(
        effects[key]?.remaining || 0,
        Math.min(duration, 999),
      ),
    };
    if (key === "freeze" || key === "paralysis") group.allIn = false;
    return true;
  }
  /* Grants a defensive state on the round-based clock. */
  function arm(group, type) {
    const rounds = DEFENSIVE_ROUNDS;
    group.itemEffect = {
      ...(group.itemEffect || {}),
      type,
      roundsLeft: rounds,
      startedAt: Date.now(),
    };
    delete group.itemEffect.hitsLeft;
    return group.itemEffect;
  }
  /* Ends a defensive state, releasing the mega item it keeps in the main slot. */
  function release(group) {
    const type = group?.itemEffect?.type;
    if (type !== "star" && type !== "mega") return false;
    if (type === "mega") {
      const ix = (group.inventory || []).findIndex((x) => x.key === "mega");
      if (ix >= 0) group.inventory.splice(ix, 1);
    }
    group.itemEffect = null;
    return true;
  }
  function tick(group, key) {
    if (key === "invincible" || key === "mega") return;
    if (!has(group, key)) return;
    if (--group.competitionEffects[key].remaining <= 0)
      delete group.competitionEffects[key];
  }
  /* One answer round passes for a defensive state. */
  function tickDefensive(group) {
    const type = group?.itemEffect?.type;
    if (type !== "star" && type !== "mega") return;
    const left = Number(group.itemEffect.roundsLeft);
    const next = (Number.isSafeInteger(left) && left > 0 ? left : DEFENSIVE_ROUNDS) - 1;
    if (next <= 0) return release(group);
    group.itemEffect.roundsLeft = next;
  }
  function cleanse(group) {
    const effects = normalize(group);
    negative.forEach((key) => delete effects[key]);
  }
  function blockedAllIn(group) {
    return (
      has(group, "freeze") ||
      has(group, "paralysis") ||
      !!group?.itemEffect?.iceLock
    );
  }
  function cancelUse(group) {
    if (!has(group, "freeze")) return false;
    delete group.competitionEffects.freeze;
    return true;
  }
  function redirect(group, targeted, random) {
    if (!targeted || !has(group, "dizziness")) return false;
    const redirect = random() < 0.5;
    tick(group, "dizziness");
    return redirect;
  }
  function answer(group, before, after, random, facts = {}) {
    if (has(group, "invincible") || has(group, "mega")) {
      if (facts.correct === true) after = before * (facts.allIn ? 3 : 2);
      else if (facts.correct === false) after = before;
    }
    let answerDelta = after - before,
      postDelta = 0;
    if (has(group, "freeze") || group.itemEffect?.iceLock)
      answerDelta = Math.min(1, answerDelta);
    if (has(group, "paralysis") && random() < 0.5) answerDelta = 0;
    if (has(group, "burn")) postDelta -= 1 + Math.floor(random() * 3);
    if (has(group, "poison")) postDelta -= 2;
    for (const key of Object.keys(definitions))
      if (key !== "dizziness") tick(group, key);
    // The defensive clock advances once per answered round.
    tickDefensive(group);
    return { answerDelta, postDelta, score: before + answerDelta + postDelta };
  }
  /* Card and tooltip labels stay minimal: a status is its name plus how long it
     has left. The full rules live in the encyclopedia, not on the card. */
  function labels(group) {
    return Object.entries(definitions)
      .filter(([key]) => has(group, key))
      .map(([key, d]) => {
        if (key === "invincible" || key === "mega") {
          const left = Number(group.itemEffect?.roundsLeft);
          return `${d.name} · 剩余 ${Number.isSafeInteger(left) && left > 0 ? left : DEFENSIVE_ROUNDS} 轮`;
        }
        return `${d.name} · 剩余 ${group.competitionEffects[key].remaining} 次`;
      });
  }
  return {
    definitions,
    negative,
    DEFENSIVE_ROUNDS,
    normalize,
    has,
    apply,
    arm,
    release,
    tickDefensive,
    cleanse,
    blockedAllIn,
    cancelUse,
    redirect,
    answer,
    labels,
  };
})();
