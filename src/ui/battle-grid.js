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
    rowCard.className = `group-row-card v213-card ${g.animState || ""}`;
    rowCard.dataset.groupId = g.id;
    rowCard.style.borderLeftColor = g.color;
    rowCard.style.setProperty("--group-color", g.color);
    const badge = GodpowerUIModel.badgeColors(g.color);
    rowCard.style.setProperty("--group-contrast", badge.foreground);
    rowCard.style.setProperty("--group-badge-color", badge.background);
    const roundClass =
      state.roundActive && !state.evaluated ? "" : "round-disabled";
    const optionsHtml = ["A", "B", "C", "D"]
      .map((opt) => {
        let cls = "opt-btn";
        if (g.selectedOpt === opt) cls += " active";
        if (state.evaluated && g.selectedOpt === opt) {
          cls +=
            " flip-reveal " + (opt === state.correctAns ? "correct" : "wrong");
        }
        return `<button class="${cls} ${roundClass}" onclick="selectGroupOpt(${g.id},'${opt}')" ${state.evaluated ? "disabled" : ""}>${opt}</button>`;
      })
      .join("");

    const rawScore = g.displayScore !== undefined ? g.displayScore : g.score;
    const editCls = state.isLocked ? "" : "editable";
    const scoreHtml =
      state.editingScoreId === g.id
        ? `<input type="number" class="score-input" id="input-score-${g.id}" value="${g.score}" onblur="finishDirectScoreEdit(${g.id})" onkeydown="handleScoreInputKey(event,${g.id})">`
        : `<span class="row-score ${editCls}" id="score-val-${g.id}" style="color:${g.color}" onclick="startDirectScoreEdit(${g.id})">${rawScore}分</span>`;
    const allInClass = g.allIn ? "allin-toggle-btn active" : "allin-toggle-btn";
    const allInText = g.allIn ? "🔥 ALL IN" : "ALL IN";
    const lockAttr = state.isLocked ? "locked-disabled" : "";

    const slotsHtml = [0, 1, 2]
      .map((i) => {
        const it = g.inventory?.[i];
        return it
          ? `<div class="item-slot ${i === 0 ? "queue-main-slot" : "queue-secondary-slot"}" title="${escapeHtml(ITEM_DEFS[it.key]?.name || "道具")}">${itemVisual(it.key)}${it.charges > 1 ? `<span class="charges">${it.charges}</span>` : ""}</div>`
          : `<div class="item-slot ${i === 0 ? "queue-main-slot" : "queue-secondary-slot"} empty">＋</div>`;
      })
      .join("");

    rowCard.innerHTML = `
      <div class="milestone-banner-overlay">分数位数增加！</div>
      <div class="card-header-row">
        <div class="v213-number" title="小组编号">${groupNoTextV213(g)}</div>
        <div class="v213-name-wrap"><div class="v213-name" title="${escapeHtml(g.name)}">${escapeHtml(g.name)}</div><div class="v213-name-sub">小组名称 · 当前按${currentCardSortLabelV213()}排列</div></div>
        <div class="item-slots">${slotsHtml}</div>
        <div class="v213-score-wrap">${scoreHtml}</div>
        <button type="button" class="more-btn" onclick="event.stopPropagation();openItemWindow(${g.id},'detail')" title="打开小组详情">···</button>
      </div>
      <div class="card-action-row"><div class="v213-result">${g.resultText ? escapeHtml(g.resultText) : `主要道具可直接点击使用`}</div><div class="action-controls-col"><div class="opt-group">${optionsHtml}</div><button class="${allInClass} ${roundClass}" onclick="toggleAllInCard(${g.id})" ${state.evaluated ? "disabled" : ""}>${allInText}</button></div></div>`;
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
    card.querySelectorAll(".persistent-aura-v213").forEach((x) => x.remove());
    let aura = "";
    if (g.itemEffect?.type === "star") aura = "star";
    else if (g.itemEffect?.type === "mega") aura = "mega";
    else if (g.itemEffect?.type === "power") aura = "power";
    else if (g.itemEffect?.iceLock) aura = "ice";
    if (aura) {
      const a = document.createElement("div");
      a.className = `persistent-aura-v213 aura-${aura}`;
      card.appendChild(a);
    }
    if (typeof BattleMotion !== "undefined") BattleMotion.restore(card, g.id);
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
    .querySelectorAll(".group-row-card.v213-card[data-group-id]")
    .forEach((card) => {
      const id = Number(card.dataset.groupId),
        wrap = card.querySelector(".v213-name-wrap");
      if (!wrap) return;
      let badge = wrap.querySelector(".v214-rank-badge");
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "v214-rank-badge";
        wrap.appendChild(badge);
      }
      badge.textContent = `第${ranks.get(id) || "-"}名`;
      const sub = wrap.querySelector(".v213-name-sub");
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
        allIn.classList.add("v2177-round-locked");
        allIn.title = "本题已经使用过道具，不能再 All In";
      }

      const main = card.querySelector(".v213-main-item");
      if (main) {
        main.classList.add("v2177-round-item-locked");
        main.title = "本题已经使用过一次道具";
      }
    });
  }
}
