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
