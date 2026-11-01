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
      return (
        group?.itemEffect?.type === (key === "invincible" ? "star" : "mega") &&
        Number(group.itemEffect.hitsLeft) > 0
      );
    return Number(group?.competitionEffects?.[key]?.remaining) > 0;
  }
  function apply(group, key, duration = definitions[key]?.duration) {
    if (key === "invincible" || key === "mega") return false; // Only the corresponding inventory item grants these states.
    if (!definitions[key] || !Number.isSafeInteger(duration) || duration <= 0)
      return false;
    const effects = normalize(group);
    effects[key] = {
      remaining: Math.max(
        effects[key]?.remaining || 0,
        Math.min(duration, 999),
      ),
    };
    if (key === "freeze" || key === "paralysis") group.allIn = false;
    return true;
  }
  function tick(group, key) {
    if (key === "invincible" || key === "mega") return;
    if (!has(group, key)) return;
    if (--group.competitionEffects[key].remaining <= 0)
      delete group.competitionEffects[key];
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
    return { answerDelta, postDelta, score: before + answerDelta + postDelta };
  }
  function labels(group) {
    return Object.entries(definitions)
      .filter(([key]) => has(group, key))
      .map(([key, d]) =>
        key === "invincible" || key === "mega"
          ? `${d.name} · 剩余 ${group.itemEffect.hitsLeft} 次防御 · 答对总分×2 / All In答对×3 · 答错保分`
          : `${d.name} · 剩余 ${group.competitionEffects[key].remaining} 次${key === "dizziness" ? "定向道具尝试" : "答题"}`,
      );
  }
  return {
    definitions,
    negative,
    normalize,
    has,
    apply,
    cleanse,
    blockedAllIn,
    cancelUse,
    redirect,
    answer,
    labels,
  };
})();
