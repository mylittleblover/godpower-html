function ranking() {
  return RankingRules.ordered(state.groups);
}
function rankIndex(id) {
  return ranking().findIndex((g) => g.id === id);
}
function roundQuarter(v) {
  return Math.round((Number(v) || 0) / 4);
}
function roundThird(v) {
  return Math.round((Number(v) || 0) / 3);
}
function roundHalf(v) {
  return Math.round((Number(v) || 0) / 2);
}
function eligibleForItems(g) {
  return g && Number(g.score) >= 0;
}
function consumeInventoryItem(g, index, amount = 1) {
  const it = g.inventory[index];
  if (!it) return;
  it.charges -= amount;
  if (it.charges <= 0) g.inventory.splice(index, 1);
}
function addItemToGroup(g, key) {
  if (!g || !ITEM_DEFS[key] || g.inventory.length >= 3 || !eligibleForItems(g))
    return false;
  g.inventory.push(
    globalThis.ItemModules
      ? ItemModules.inventory(key)
      : {
          key,
          charges: ITEM_DEFS[key].charges,
          acquiredAt: Date.now() + Math.random(),
        },
  );
  g.itemStats.draws++;
  state.itemGlobal.totalDraws++;
  return true;
}
function tinyDefenseToast(msg) {
  const d = document.createElement("div");
  d.className = "item-defense-toast";
  d.textContent = msg;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 1900);
}

function defenseCandidates(g, attackType) {
  const out = [];
  if (g.itemEffect && ["star", "mega", "bullet"].includes(g.itemEffect.type))
    out.push({ type: "effect", idx: -1, key: g.itemEffect.type });
  if (g.booShield > 0) out.push({ type: "boo", idx: -1, key: "boo" });
  {
    const it = g.inventory[0],
      idx = 0;
    if (it && ITEM_DEFENSE_KEYS.has(it.key)) {
      if (
        !(
          attackType === "spiny" &&
          !["green", "triple_green", "horn"].includes(it.key)
        )
      ) {
        out.push({
          type: "inventory",
          idx,
          key: it.key,
          at: it.acquiredAt || 0,
        });
      }
    }
  }
  out.sort((a, b) => {
    if (a.type === "effect") return -1;
    if (b.type === "effect") return 1;
    if (a.type === "boo") return -1;
    if (b.type === "boo") return 1;
    return (a.at || 0) - (b.at || 0);
  });
  return out;
}

function damageFraction(target, denom, sourceId, type = "normal") {
  const loss =
    denom === 2
      ? roundHalf(target.score)
      : denom === 3
        ? roundThird(target.score)
        : roundQuarter(target.score);
  return applyItemScore(target, -loss, sourceId, type);
}
function boostFraction(target, denom = 4) {
  if (!eligibleForItems(target)) return false;
  const base =
    denom === 4 ? roundQuarter(target.score) : Math.round(target.score / denom);
  const add = globalThis.ItemModules
    ? ItemModules.scoreDelta(null, base)
    : base;
  target.score += add;
  target.displayScore = target.score;
  return true;
}

function itemDropWeights(pos, total) {
  // V2.11.9：26 种道具全部正式接入排名权重池。
  // 依据 24人 / 12人道具分布图做百分位映射：
  // 1 位偏防守与基础道具，中游最丰富，后排逐渐增加追赶型与高影响道具。
  const p = total <= 1 ? 1 : (pos - 1) / (total - 1),
    virtual = 1 + p * 23;
  const W = {};
  const put = (k, w) => {
    W[k] = w;
  };

  if (virtual <= 5) {
    // 领先区：基础、防守、轻攻击为主。
    put("coin", 18);
    put("green", 18);
    put("banana", 18);
    put("question", 10);
    put("red", virtual >= 2 ? 12 : 0);
    put("horn", virtual >= 3 ? 7 : 0);
    put("bomb", virtual >= 3 ? 7 : 0);
    put("hammer", virtual >= 3 ? 5 : 0);
    put("mushroom", virtual >= 3 ? 7 : 0);
    put("triple_green", virtual >= 4 ? 4 : 0);
    put("triple_red", virtual >= 4 ? 3 : 0);
    put("triple_banana", virtual >= 4 ? 4 : 0);

    // 新四道具：前排可少量出现羽毛 / 火之花。
    put("feather", virtual >= 2 ? 5 : 2);
    put("fire_flower", virtual >= 4 ? 4 : 0);
    put("ice_flower", 0);
    put("boomerang_flower", virtual >= 4 ? 3 : 0);
  } else if (virtual <= 16) {
    // 中游区：道具种类最丰富，攻击、防守、控场均有。
    put("green", 8);
    put("banana", 8);
    put("red", 14);
    put("triple_red", 8);
    put("triple_green", 7);
    put("triple_banana", 7);
    put("horn", 10);
    put("bomb", 10);
    put("hammer", 8);
    put("mushroom", 14);
    put("triple_mushroom", 8);
    put("boo", 7);
    put("blooper", 7);
    put("coin_shell", 7);
    put("question", 7);
    put("mega", virtual >= 11 ? 4 : 1);
    put("power", virtual >= 11 ? 5 : 2);

    // 新四道具在中游成为主要常规奖池成员。
    put("feather", 8);
    put("fire_flower", 11);
    put("ice_flower", virtual >= 10 ? 9 : 6);
    put("boomerang_flower", 10);
  } else {
    // 落后区：追赶型、控场型、高影响道具权重增加。
    put("mushroom", 12);
    put("triple_mushroom", 15);
    put("boo", 10);
    put("blooper", 10);
    put("spiny", virtual <= 21 ? 9 : 5);
    put("lightning", virtual >= 19 ? 12 : 7);
    put("star", 13);
    put("mega", 12);
    put("bullet", virtual >= 19 ? 17 : 10);
    put("power", 14);
    put("horn", 6);
    put("bomb", 5);
    put("hammer", 4);
    put("red", 5);
    put("question", 7);

    // 新四道具：后排减少羽毛，增加冰花；火花/回旋镖保留中等追赶能力。
    put("feather", 5);
    put("fire_flower", 8);
    put("ice_flower", 11);
    put("boomerang_flower", 8);
  }

  // 前 20% 继续严格屏蔽最强追赶道具。
  if (p < 0.2) {
    W.spiny = 0;
    W.lightning = 0;
    W.star = 0;
    W.bullet = 0;
    W.power = 0;
  }

  return W;
}
function weightedPick(weights) {
  const arr = Object.entries(weights).filter(([, w]) => w > 0);
  let sum = arr.reduce((a, [, w]) => a + w, 0),
    r = Math.random() * sum;
  for (const [k, w] of arr) {
    r -= w;
    if (r <= 0) return k;
  }
  return arr[0]?.[0] || "coin";
}
function drawItemForGroup(g) {
  if (!eligibleForItems(g) || g.inventory.length >= 3) return null;
  const r = ranking(),
    pos = r.findIndex((x) => x.id === g.id) + 1;
  const weights = itemDropWeights(pos, r.length);
  return Object.values(weights).some((w) => w > 0)
    ? weightedPick(weights)
    : null;
}
