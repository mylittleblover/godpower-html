/* Card DOM and decoration only. Rules and refresh scheduling have separate owners. */
function renderBattleGridCards() {
  const grid = document.getElementById("groupList");
  if (!grid) return;
  ensureGroupNumbersV213(true);
  const animateReorder =
    !v213SkipNextReorderAnimation && !v213SuppressReorderAnimation;
  v213SkipNextReorderAnimation = false;

  /* V2.17.22：记录旧 DOM 顺序。
     FLIP 只服务于“排名顺序 ↔ 编号顺序”这种真正的重排，
     不再把道具使用造成的行高变化误判成卡片位移动画。 */
  const oldOrderIds = [
    ...grid.querySelectorAll(".group-row-card[data-group-id]"),
  ].map((c) => String(c.dataset.groupId));

  const oldRects = new Map();
  if (animateReorder)
    grid.querySelectorAll(".group-row-card[data-group-id]").forEach((c) => {
      const rect = c.getBoundingClientRect();
      /* 页面隐藏时会留下 0×0 的无效坐标，不能拿来做进入比赛页的 FLIP 起点。 */
      if (rect.width > 1 && rect.height > 1)
        oldRects.set(String(c.dataset.groupId), rect);
    });
  grid.style.gridTemplateColumns =
    state.columnMode === "single"
      ? "1fr"
      : "repeat(auto-fill, minmax(380px, 1fr))";
  grid.dataset.columnMode = state.columnMode;
  grid.innerHTML = "";

  const ordered = desiredGroupsV213();
  const newOrderIds = ordered.map((g) => String(g.id));
  const orderActuallyChanged =
    animateReorder &&
    oldOrderIds.length === newOrderIds.length &&
    oldOrderIds.some((id, i) => id !== newOrderIds[i]);

  /* 非答题阶段是排名视图。这里明确恢复 0.75s 排名重排动画；
     答题阶段由于 desiredGroupsV213() 固定按编号，普通道具状态变化不会触发该条件。 */
  const rankReorderAnimationV21723 = orderActuallyChanged;

  ordered.forEach((g) => {
    const rowCard = document.createElement("div");
    rowCard.className = `group-row-card battle-card ${g.animState || ""}`;
    rowCard.dataset.groupId = g.id;
    rowCard.style.borderLeftColor = g.color;
    rowCard.style.setProperty("--group-color", g.color);
    const badge = GodpowerUIModel.badgeColors(g.color);
    rowCard.style.setProperty("--group-contrast", badge.foreground);
    rowCard.style.setProperty("--group-badge-color", badge.background);
    rowCard.innerHTML = GodPowerBattleCardView.render(
      g,
      {
        roundActive: state.roundActive,
        evaluated: state.evaluated,
        correctAns: state.correctAns,
        isLocked: state.isLocked,
        editingScoreId: state.editingScoreId,
        sortLabel: currentCardSortLabelV213(),
      },
      {
        badge,
        escapeHtml,
        itemVisual,
        itemName: (key) => ITEM_DEFS[key]?.name,
        groupNumber: groupNoTextV213,
      },
    );
    grid.appendChild(rowCard);
  });

  /* 复用既有队列/防御/持续状态逻辑，但把三点菜单控制权拿回来。 */
  try {
    enhanceItemCards();
  } catch (e) {
    console.warn("enhance item cards", e);
  }
  ordered.forEach((g) => {
    const card = grid.querySelector(`.group-row-card[data-group-id="${g.id}"]`);
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
  if (typeof ClassroomAvatarDisplay !== "undefined")
    ClassroomAvatarDisplay.decorateGroupCards(ordered);

  if (state.editingScoreId != null) {
    const input = document.getElementById(
      `input-score-${state.editingScoreId}`,
    );
    if (input) {
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
}

function decorateBattleRanks() {
  const ranks = new Map(ranking().map((g, i) => [g.id, i + 1]));
  document
    .querySelectorAll(".group-row-card.battle-card[data-group-id]")
    .forEach((card) => {
      const id = Number(card.dataset.groupId),
        wrap = card.querySelector(".battle-group-heading");
      if (!wrap) return;
      let badge = wrap.querySelector(".rank-badge");
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "rank-badge";
        wrap.appendChild(badge);
      }
      const rank = ranks.get(id);
      badge.dataset.rank = String(rank || "");
      const medal = {
        1: ["#fff2c2", "#805314", "#d8b55a"],
        2: ["#eef2f6", "#435364", "#b8c3ce"],
        3: ["#f6e4d6", "#79472c", "#cca17d"],
      }[rank];
      for (const [i, key] of [
        "--rank-background",
        "--rank-ink",
        "--rank-border",
      ].entries()) {
        if (medal) badge.style.setProperty(key, medal[i]);
        else badge.style.removeProperty(key);
      }
      badge.textContent = `第${rank || "-"}名`;
      const sub = wrap.querySelector(".battle-group-subtitle");
      if (sub) sub.textContent = `当前按${currentCardSortLabelV213()}排列`;
    });
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
