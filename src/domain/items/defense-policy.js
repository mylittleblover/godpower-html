/* Existing defense precedence only; consumption, effects and dialogs belong to application. */
const DefensePolicy = (() => {
  function choose(
    g,
    attackType,
    { eligible, shellAttack, ignorePrimary = false },
  ) {
    if (Number(g?.booRoundsLeftV218 || 0) > 0 && Number(g?.booShield || 0) > 0)
      return "timed-ghost";
    const main = ignorePrimary ? undefined : g?.inventory?.[0];
    if (
      attackType === "spiny" &&
      g?.__spinyHornDeclinedV218 &&
      main?.key === "horn"
    )
      return "none";
    if (!eligible) return "ineligible";
    if (g.itemEffect && Number(g.itemEffect.featherDodge || 0) > 0)
      return "feather";
    if (g.itemEffect?.type === "bullet") return "bullet";
    if (g.itemEffect && ["star", "mega"].includes(g.itemEffect.type))
      return "persistent";
    if (Number(g.booShield || 0) > 0) return "ghost";
    if (main?.key === "bomb" && shellAttack) return "bomb";
    if (
      main &&
      [
        "green",
        "triple_green",
        "red",
        "triple_red",
        "banana",
        "triple_banana",
        "horn",
      ].includes(main.key) &&
      (attackType !== "spiny" || main.key === "horn")
    )
      return "inventory";
    if (
      attackType === "spiny" &&
      main &&
      ["mushroom", "triple_mushroom"].includes(main.key) &&
      !g.__spinyMushroomDeclinedV21727
    )
      return "pending-mushroom";
    return "none";
  }
  return { choose };
})();
