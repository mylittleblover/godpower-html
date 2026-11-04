/* The only compatibility entry for ordinary draw weights; the pure policy owns calculation. */
function itemDropWeights(pos, total) {
  const ordered = ranking(),
    position = Math.max(
      1,
      Math.min(Math.max(1, Number(total) || 1), Math.trunc(Number(pos) || 1)),
    ),
    group = ordered[position - 1];
  const W = ItemDrawPolicy.weights({
    position,
    total,
    score: group?.score || 0,
    leaderScore: ordered[0]?.score || 0,
    held: group?.inventory?.map((item) => item.key) || [],
    field: ItemDrawPolicy.unique.filter((key) => itemExistsOnFieldV2172(key)),
  });
  if (position === 1 && suppressFirstHornV218) W.horn = 0;
  return globalThis.ItemModules ? ItemModules.drawWeights(W) : W;
}
