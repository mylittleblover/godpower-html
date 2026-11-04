/* Reviewed rank/positive-gap blend. Anchors preserve legacy weight shapes, not hard eligibility bands. */
const ItemDrawPolicy = (() => {
  const anchors = [
    {
      kamek: 0,
      item_box: 0,
      green: 13,
      triple_green: 3,
      red: 7,
      triple_red: 2,
      spiny: 0,
      banana: 13,
      triple_banana: 3,
      horn: 6,
      bomb: 0,
      hammer: 0,
      coin: 18,
      coin_shell: 6,
      question: 10,
      mushroom: 9,
      triple_mushroom: 2,
      boo: 0,
      blooper: 0,
      lightning: 0,
      star: 0,
      mega: 0,
      bullet: 0,
      power: 0,
      feather: 8,
      fire_flower: 0,
      ice_flower: 0,
      boomerang_flower: 0,
    },
    {
      kamek: 3,
      item_box: 4,
      green: 8,
      triple_green: 6,
      red: 11,
      triple_red: 7,
      spiny: 5,
      banana: 8,
      triple_banana: 6,
      horn: 9,
      bomb: 10,
      hammer: 8,
      coin: 0,
      coin_shell: 6,
      question: 0,
      mushroom: 16,
      triple_mushroom: 5,
      boo: 7,
      blooper: 7,
      lightning: 0,
      star: 0,
      mega: 0,
      bullet: 0,
      power: 6,
      feather: 0,
      fire_flower: 11,
      ice_flower: 9,
      boomerang_flower: 10,
    },
    {
      kamek: 0,
      item_box: 0,
      green: 0,
      triple_green: 1,
      red: 0,
      triple_red: 1,
      spiny: 9,
      banana: 0,
      triple_banana: 1,
      horn: 5,
      bomb: 0,
      hammer: 0,
      coin: 0,
      coin_shell: 0,
      question: 0,
      mushroom: 12,
      triple_mushroom: 4,
      boo: 9,
      blooper: 8,
      lightning: 11,
      star: 11,
      mega: 10,
      bullet: 13,
      power: 12,
      feather: 0,
      fire_flower: 0,
      ice_flower: 0,
      boomerang_flower: 0,
    },
  ];
  const keys = Object.freeze(Object.keys(anchors[0]));
  const highImpact = Object.freeze([
    "star",
    "mega",
    "bullet",
    "lightning",
    "power",
    "spiny",
  ]);
  const unique = Object.freeze(["lightning", "blooper", "kamek", "item_box"]);
  const version = "continuous-rank-gap-1";
  const summary =
    "名次与正向分差连续调节追赶道具；首次举手特殊池保留，第一名喇叭为10%且仅前60%可抽；场上唯一、库存去重、冷却和自定义开关仍生效。";
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function weights({
    position,
    total,
    score = 0,
    leaderScore = score,
    field = [],
    held = [],
  } = {}) {
    const n = Math.max(1, Number(total) || 1),
      p = clamp(Number(position) || 1, 1, n),
      x = n <= 1 ? 0 : (p - 1) / (n - 1),
      segment = x <= 0.5 ? 0 : 1,
      t = x <= 0.5 ? x * 2 : x * 2 - 1,
      smooth = t * t * (3 - 2 * t),
      gap =
        leaderScore > 0 && score >= 0
          ? clamp(
              Math.log2(Math.max(1, leaderScore / Math.max(1, score))) / 2,
              0,
              1,
            )
          : 0;
    const blocked = new Set(held),
      present = new Set(field),
      result = {};
    for (const key of keys) {
      const a = Math.max(0.5, anchors[segment][key] || 0),
        b = Math.max(0.5, anchors[segment + 1][key] || 0);
      let weight = a + (b - a) * smooth;
      if (highImpact.includes(key)) weight *= 1 + x * 0.5 + gap * 1.5;
      if (key === "horn") {
        if (p > Math.max(1, Math.ceil(n * 0.6))) weight = 0;
        else weight = Math.max(weight, 8);
      }
      if (
        score < 0 ||
        blocked.has(key) ||
        (unique.includes(key) && present.has(key))
      )
        weight = 0;
      result[key] = weight;
    }
    return result;
  }
  return Object.freeze({ version, summary, keys, highImpact, unique, weights });
})();
