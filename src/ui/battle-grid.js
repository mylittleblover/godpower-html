/* Card DOM and decoration only. Rules and refresh scheduling have separate owners. */
const battleCardRenderState = new WeakMap();
function serializeBattleShallowList(items, mapper) {
  if (!Array.isArray(items) || !items.length) return "";
  return items.map(mapper).join("\x1f");
}
function buildBattleCardFastKey(g, badge, globalCardKey, editingThisCard) {
  const inv = serializeBattleShallowList(g.inventory, (it) =>
    it ? `${it.key}:${it.charges || 1}:${it.acquiredAt || 0}` : "",
  );
  const compFx = g.competitionEffects
    ? JSON.stringify(g.competitionEffects)
    : "";
  const itemFx = g.itemEffect ? JSON.stringify(g.itemEffect) : "";
  const uids = serializeBattleShallowList(g.memberStudentUids, (x) => x || "");
  const members = serializeBattleShallowList(g.members, (x) =>
    typeof x === "string" ? x : JSON.stringify(x),
  );
  return [
    globalCardKey,
    editingThisCard ? `1:${g.score}` : "0",
    g.groupNo,
    g.name,
    g.selectedOpt || "",
    g.displayScore === undefined ? "" : g.displayScore,
    g.score,
    g.allIn ? 1 : 0,
    g.resultText || "",
    g.color,
    badge.foreground,
    badge.background,
    g.animState || "",
    g.booShield ? 1 : 0,
    g.itemUsedThisRound ? 1 : 0,
    g.roundItemInstanceId || "",
    g.avatarResourceId || "",
    inv,
    itemFx,
    compFx,
    uids,
    members,
  ].join("\x1e");
}
let lastBattleRankDecorateSig = "";
function renderBattleGridCards() {
  const grid = document.getElementById("groupList");
  if (!grid) return 0;
  ensureGroupNumbersV213(true);
  const animateReorder =
    !v213SkipNextReorderAnimation && !v213SuppressReorderAnimation;
  v213SkipNextReorderAnimation = false;

  /* V2.17.22：记录旧 DOM 顺序。
     FLIP 只服务于“排名顺序 ↔ 编号顺序”这种真正的重排，
     不再把道具使用造成的行高变化误判成卡片位移动画。 */
  const oldOrderIds = [];
  const oldCards = new Map();
  for (let i = 0; i < grid.children.length; i++) {
    const c = grid.children[i];
    const gid = c.dataset?.groupId;
    if (gid !== undefined) {
      const key = String(gid);
      oldOrderIds.push(key);
      oldCards.set(key, c);
    }
  }

  const ordered = desiredGroupsV213();
  const orderActuallyChanged =
    animateReorder &&
    oldOrderIds.length === ordered.length &&
    ordered.some((g, i) => String(g.id) !== oldOrderIds[i]);

  const oldRects = new Map();
  if (orderActuallyChanged)
    for (let i = 0; i < grid.children.length; i++) {
      const c = grid.children[i];
      if (!c.dataset?.groupId) continue;
      const rect = c.getBoundingClientRect();
      /* 页面隐藏时会留下 0×0 的无效坐标，不能拿来做进入比赛页的 FLIP 起点。 */
      if (rect.width > 1 && rect.height > 1)
        oldRects.set(String(c.dataset.groupId), rect);
    }
  const nextGridCols =
    state.columnMode === "single"
      ? "1fr"
      : "repeat(auto-fill, minmax(380px, 1fr))";
  if (grid.style.gridTemplateColumns !== nextGridCols)
    grid.style.gridTemplateColumns = nextGridCols;
  if (grid.dataset.columnMode !== state.columnMode)
    grid.dataset.columnMode = state.columnMode;
  const cards = [],
    changedGroups = [],
    cardById = new Map();

  /* 非答题阶段是排名视图。这里明确恢复 0.75s 排名重排动画；
     答题阶段由于 desiredGroupsV213() 固定按编号，普通道具状态变化不会触发该条件。 */
  const rankReorderAnimationV21723 = orderActuallyChanged;

  const sortLabel = currentCardSortLabelV213();
  const customIconsObj = state.itemGlobal?.customIcons;
  let customIconSig = "";
  if (customIconsObj) {
    for (const k of Object.keys(customIconsObj)) {
      const v = customIconsObj[k];
      if (v) customIconSig += `${k}:${v.length},`;
    }
  }
  const globalCardKey = [
    state.roundActive ? 1 : 0,
    state.evaluated ? 1 : 0,
    state.correctAns || "",
    state.isLocked ? 1 : 0,
    sortLabel,
    state.rosterSnapshot?.revision || 0,
    customIconSig,
  ].join("\x1f");

  ordered.forEach((g) => {
    const badge = (GodpowerUIModel.crestColors || GodpowerUIModel.badgeColors)(
      g.color,
    );
    const editingThisCard = state.editingScoreId === g.id;
    const fastKey = buildBattleCardFastKey(
      g,
      badge,
      globalCardKey,
      editingThisCard,
    );
    const keyId = String(g.id),
      previous = oldCards.get(keyId),
      cache = previous && battleCardRenderState.get(previous);
    if (
      !orderActuallyChanged &&
      cache?.group === g &&
      cache.fastKey === fastKey
    ) {
      cards.push(previous);
      cardById.set(keyId, previous);
      return;
    }
    const markup = GodPowerBattleCardView.render(
      g,
      {
        roundActive: state.roundActive,
        evaluated: state.evaluated,
        correctAns: state.correctAns,
        isLocked: state.isLocked,
        editingScoreId: state.editingScoreId,
        sortLabel,
      },
      {
        badge,
        scorePalette: GodpowerUIModel.scoreColors(g.color),
        escapeHtml,
        itemVisual,
        itemName: (key) => ITEM_DEFS[key]?.name,
        groupNumber: groupNoTextV213,
      },
    );
    const rowCard = document.createElement("div");
    rowCard.className = `group-row-card battle-card ${g.animState || ""}`;
    rowCard.dataset.groupId = g.id;
    rowCard.style.borderLeftColor = g.color;
    rowCard.style.setProperty("--group-color", g.color);
    rowCard.style.setProperty("--group-contrast", badge.foreground);
    rowCard.style.setProperty("--group-badge-color", badge.background);
    rowCard.innerHTML = markup;
    battleCardRenderState.set(rowCard, { group: g, fastKey });
    cards.push(rowCard);
    cardById.set(keyId, rowCard);
    changedGroups.push(g);
  });

  if (
    changedGroups.length ||
    grid.children.length !== cards.length ||
    orderActuallyChanged
  ) {
    const retained = new Set(cards);
    for (const card of [...grid.children])
      if (!retained.has(card)) card.remove();
    cards.forEach((card, index) => {
      if (grid.children[index] !== card)
        grid.insertBefore(card, grid.children[index] || null);
    });
  }

  /* 复用既有队列/防御/持续状态逻辑，但把三点菜单控制权拿回来。 */
  try {
    enhanceItemCards(changedGroups, cardById);
  } catch (e) {
    console.warn("enhance item cards", e);
  }
  changedGroups.forEach((g) => {
    const card = cardById.get(String(g.id));
    if (!card) return;
    const main = card.querySelector(".queue-main-slot");
    if (main) {
      main.onclick = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (g.inventory?.[0]) useItem(g.id, 0);
        else showToast("当前没有主要道具");
      };
    }
    const more = card.querySelector(".more-btn");
    if (more) {
      more.onclick = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        openItemWindow(g.id, "detail");
      };
    }
    card.querySelectorAll(".persistent-aura").forEach((x) => x.remove());
    /* Every active status gets its own ring in that item's colour. The first
       ring keeps the classic band; extra rings stack just outside it. */
    const auras = [];
    if (
      g.itemEffect?.type === "star" ||
      CompetitionEffects.has(g, "invincible")
    )
      auras.push("invincible");
    if (g.itemEffect?.type === "mega" || CompetitionEffects.has(g, "mega"))
      auras.push("mega");
    if (g.itemEffect?.type === "power") auras.push("power");
    if (g.itemEffect?.iceLock) auras.push("ice");
    for (const key of CompetitionEffects.negative)
      if (CompetitionEffects.has(g, key)) auras.push(key);
    auras.forEach((aura, index) => {
      const a = document.createElement("div");
      a.className = `persistent-aura aura-${aura}${index ? " aura-stacked" : ""}`;
      a.style.inset = `${-4 - index * 5}px`;
      card.appendChild(a);
    });
    if (typeof BattleMotion !== "undefined") BattleMotion.restore(card, g.id);
    globalThis.ScoreCardMotion?.restore(card, g.id);
  });
  if (changedGroups.length && typeof ClassroomAvatarDisplay !== "undefined")
    ClassroomAvatarDisplay.decorateGroupCards(changedGroups);

  if (state.editingScoreId != null) {
    const input = document.getElementById(
      `input-score-${state.editingScoreId}`,
    );
    if (input && document.activeElement !== input) {
      input.focus();
      input.select();
    }
  }

  /* FLIP：旧位置 → 新位置。
     V2.17.20：恢复稳定的 transform FLIP，只把时长改为 0.75s。
     Codex 版本改成 CSS individual translate 后，和多次 renderGrid / 清理时序组合会
     出现跳动、回弹或直接没有位移动画。 */
  const moved = [];
  if (rankReorderAnimationV21723 || (orderActuallyChanged && v213ForceRankSort))
    grid.querySelectorAll(".group-row-card[data-group-id]").forEach((card) => {
      const old = oldRects.get(String(card.dataset.groupId));
      if (!old) return;
      const now = card.getBoundingClientRect();
      const dx = old.left - now.left,
        dy = old.top - now.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;

      /* 先瞬间放回旧位置。最终主题存在 !important transition，所以这里也用 important。 */
      card.style.setProperty("transition", "none", "important");
      card.style.transform = `translate(${dx}px,${dy}px)`;
      moved.push(card);
    });

  if (moved.length) {
    /* 提交起点，再隔两帧启动动画，避免浏览器把起点/终点合并。 */
    moved.forEach((card) => void card.offsetWidth);
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        moved.forEach((card) => {
          card.style.setProperty(
            "transition",
            `transform ${V213_CARD_REORDER_MS}ms cubic-bezier(.2,.8,.2,1),box-shadow .3s ease,border-color .35s ease`,
            "important",
          );
          card.style.transform = "translate(0px,0px)";

          setTimeout(() => {
            /* 在“0 位移”状态下无动画清理内联 transform，避免清理动作被识别成第二段动画。 */
            card.style.setProperty("transition", "none", "important");
            card.style.removeProperty("transform");
            void card.offsetWidth;
            requestAnimationFrame(() =>
              card.style.removeProperty("transition"),
            );
          }, V213_CARD_REORDER_SETTLE_MS);
        }),
      ),
    );
  }
  return changedGroups.length;
}

function decorateBattleRanks(forceRefresh = true) {
  const grid = document.getElementById("groupList");
  if (!grid) return;
  const rankedList = ranking();
  const nextSubText = `当前按${currentCardSortLabelV213()}排列`;
  let rankSig = nextSubText + "|" + grid.children.length + "|";
  const ranks = new Map();
  for (let i = 0; i < rankedList.length; i++) {
    const id = rankedList[i].id;
    ranks.set(id, i + 1);
    rankSig += `${id}:${i + 1},`;
  }
  if (!forceRefresh && rankSig === lastBattleRankDecorateSig) return;
  lastBattleRankDecorateSig = rankSig;
  for (let i = 0; i < grid.children.length; i++) {
    const card = grid.children[i];
    if (!card.classList.contains("battle-card")) continue;
    const id = Number(card.dataset.groupId),
      wrap = card.querySelector(".battle-group-heading");
    if (!wrap) continue;
    let badge = wrap.querySelector(".rank-badge");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "rank-badge";
      wrap.appendChild(badge);
    }
    const rank = ranks.get(id);
    const nextRank = String(rank || "");
    if (badge.dataset.rank !== nextRank) {
      badge.dataset.rank = nextRank;
      const medal = {
        1: ["#fff2c2", "#805314", "#d8b55a"],
        2: ["#eef2f6", "#435364", "#b8c3ce"],
        3: ["#f6e4d6", "#79472c", "#cca17d"],
      }[rank];
      for (const [idx, key] of [
        "--rank-background",
        "--rank-ink",
        "--rank-border",
      ].entries()) {
        if (medal) badge.style.setProperty(key, medal[idx]);
        else badge.style.removeProperty(key);
      }
    }
    const nextBadgeText = `第${rank || "-"}名`;
    if (badge.textContent !== nextBadgeText) badge.textContent = nextBadgeText;
    const sub = wrap.querySelector(".battle-group-subtitle");
    if (sub && sub.textContent !== nextSubText) sub.textContent = nextSubText;
  }
}

function decorateRoundItemLocks() {
  if (state.roundActive && !state.evaluated) {
    state.groups.forEach((g) => {
      if (!g.itemUsedThisRound) return;

      const card = document.querySelector(
        `.group-row-card[data-group-id="${g.id}"]`,
      );
      if (!card) return;

      const allIn = card.querySelector(".allin-toggle-btn");
      if (allIn) {
        allIn.disabled = true;
        allIn.classList.add("round-action-locked");
        allIn.title = "本题已经使用过道具，不能再 All In";
      }

      const main = card.querySelector(".battle-main-item");
      if (main) {
        const continuation = ItemRoundUse.canContinue(g, g.inventory?.[0]);
        main.classList.toggle("round-item-locked", !continuation);
        main.title = continuation
          ? `继续使用同一道具（剩余 ${g.inventory[0].charges} 次）`
          : "本题已经使用过另一枚道具";
      }
    });
  }
}
