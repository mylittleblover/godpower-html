const CARD_ITEM_FX_CLASS = {
  green_shell: "cfx-green",
  triple_green: "cfx-green",
  red_shell: "cfx-red",
  triple_red: "cfx-red",
  spiny_shell: "cfx-spiny",
  banana: "cfx-banana",
  triple_banana: "cfx-banana",
  super_horn: "cfx-horn",
  bob_omb: "cfx-bomb",
  hammer: "cfx-hammer",
  coin: "cfx-coin",
  coin_shell: "cfx-rise",
  question_block: "cfx-rise",
  mushroom: "cfx-mushroom",
  triple_mushroom: "cfx-mushroom",
  boo: "cfx-boo",
  blooper: "cfx-blooper",
  lightning: "cfx-lightning",
  star: "cfx-star",
  giant_mushroom: "cfx-giant",
  bullet_bill: "cfx-bullet",
  power_mushroom: "cfx-power",
};
const CARD_HIT_COLOR = {
  green_shell: "#22c55e",
  triple_green: "#22c55e",
  red_shell: "#ef4444",
  triple_red: "#ef4444",
  spiny_shell: "#3b82f6",
  banana: "#eab308",
  triple_banana: "#eab308",
  super_horn: "#f97316",
  bob_omb: "#f97316",
  hammer: "#64748b",
  boo: "#8b5cf6",
  blooper: "#111827",
  lightning: "#facc15",
};
function battleCard(id) {
  return (
    document.querySelector(
      `#view-battle .group-row-card[data-group-id="${id}"]`,
    ) || document.querySelector(`.group-row-card[data-group-id="${id}"]`)
  );
}
function clearCardFx(card) {
  if (!card) return;
  [...card.classList]
    .filter(
      (x) =>
        x.startsWith("cfx-") ||
        [
          "card-use-fx",
          "card-hit-fx",
          "card-defend-fx",
          "card-heal-fx",
        ].includes(x),
    )
    .forEach((x) => card.classList.remove(x));
  card.querySelectorAll(".card-fx-badge").forEach((x) => x.remove());
  card.style.removeProperty("--hitc");
}
function playCasterCardFx(key, gid) {
  if (
    typeof DesktopUI !== "undefined" &&
    (!DesktopUI.getPreferences().itemFx ||
      DesktopUI.getPreferences().motion === "off")
  )
    return;
  const card = battleCard(gid),
    d = ITEM_DEFS[key];
  if (!card || !d) return;
  clearCardFx(card);
  void card.offsetWidth;
  card.classList.add("card-use-fx", CARD_ITEM_FX_CLASS[key] || "cfx-rise");
  const b = document.createElement("div");
  b.className = "card-fx-badge";
  b.innerHTML = `<span class="cfi">${itemVisual(key)}</span><span>${escapeHtml(d.name)}</span>`;
  card.appendChild(b);
  setTimeout(() => {
    card.classList.remove("card-use-fx", CARD_ITEM_FX_CLASS[key] || "cfx-rise");
    b.remove();
  }, 1850);
}
function playTargetCardFx(id, key, type = "hit") {
  if (typeof DesktopUI !== "undefined") {
    DesktopUI.visualEvent(type === "defend" ? "ITEM_DEFENDED" : "ITEM_HIT", {
      groupId: id,
      key,
    });
    if (
      !DesktopUI.getPreferences().itemFx ||
      DesktopUI.getPreferences().motion === "off"
    )
      return;
  }
  const card = battleCard(id);
  if (!card) return;
  /* 不抹掉持续状态 class，只清一次性命中特效 */
  card.classList.remove("card-hit-fx", "card-defend-fx", "card-heal-fx");
  void card.offsetWidth;
  card.style.setProperty(
    "--hitc",
    type === "defend"
      ? "#38bdf8"
      : type === "heal"
        ? "#22c55e"
        : CARD_HIT_COLOR[key] || "#ef4444",
  );
  card.classList.add(
    type === "defend"
      ? "card-defend-fx"
      : type === "heal"
        ? "card-heal-fx"
        : "card-hit-fx",
  );
  setTimeout(() => {
    card.classList.remove("card-hit-fx", "card-defend-fx", "card-heal-fx");
    card.style.removeProperty("--hitc");
  }, 1600);
}
function cardFxTargets(key, gid) {
  const r = ranking(),
    i = r.findIndex((g) => g.id === gid),
    ids = [],
    add = (g) => {
      if (g && g.id !== gid && !ids.includes(g.id)) ids.push(g.id);
    };
  if (["red_shell", "triple_red", "boo"].includes(key)) add(r[i - 1]);
  else if (["banana", "triple_banana"].includes(key)) add(r[i + 1]);
  else if (key === "super_horn") {
    add(r[i - 1]);
    add(r[i + 1]);
  } else if (key === "spiny_shell") add(r[0]);
  else if (key === "lightning") r.slice(0, Math.max(0, i)).forEach(add);
  else if (key === "coin_shell") r.slice(0, Math.max(0, i)).forEach(add);
  else if (key === "question_block") r.slice(i + 1).forEach(add);
  return ids;
}
/* 接到 V2.3/V2.2 已确认“实际成功发动”的 showItemUseFx 上。
   此时小组窗口已经关闭、renderAll 已刷新，因此动画直接落在最新分数的比赛卡片上。 */
const _v25ShowItemUseFx = showItemUseFx;
showItemUseFx = function (key, casterId = null, targetText = "") {
  try {
    if (casterId != null) {
      playCasterCardFx(key, casterId);
      const targets = cardFxTargets(key, casterId);
      const beneficial = ["coin_shell", "question_block"].includes(key);
      targets.forEach((id, n) =>
        setTimeout(
          () => playTargetCardFx(id, key, beneficial ? "heal" : "hit"),
          120 + n * 70,
        ),
      );
    }
  } catch (e) {
    console.warn("card item fx", e);
  }
  return _v25ShowItemUseFx(key, casterId, targetText);
};

/* ===== V2.6：持久化、设置页、窗口、菜单音乐、UI 图标、道具音效 ===== */

/* 1. 道具与历史跨关闭保存 */
