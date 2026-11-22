/* Read-only card markup presenter. No DOM, commands, timers, storage or business state writes. */
const GodPowerBattleCardView = Object.freeze({
  render(
    g,
    state,
    {
      badge,
      scorePalette = badge,
      escapeHtml,
      itemVisual,
      itemName,
      groupNumber,
    },
  ) {
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
        : `<span class="row-score score-capsule ${editCls}" id="score-val-${g.id}" style="color:${scorePalette.foreground};--score-capsule-bg:${scorePalette.background || g.color}" onclick="startDirectScoreEdit(${g.id})">${rawScore}分</span>`;
    const allInClass = g.allIn ? "allin-toggle-btn active" : "allin-toggle-btn";
    const allInText = g.allIn ? "🔥 ALL IN" : "ALL IN";

    const slotsHtml = [0, 1, 2]
      .map((i) => {
        const it = g.inventory?.[i];
        return it
          ? `<div class="item-slot ${i === 0 ? "queue-main-slot" : "queue-secondary-slot"}" title="${escapeHtml(itemName(it.key) || "道具")}">${itemVisual(it.key)}${it.charges > 1 ? `<span class="charges">${it.charges}</span>` : ""}</div>`
          : `<div class="item-slot ${i === 0 ? "queue-main-slot" : "queue-secondary-slot"} empty">＋</div>`;
      })
      .join("");

    return `
      <div class="milestone-banner-overlay">分数位数增加！</div>
      <div class="card-header-row">
        <div class="battle-group-number" title="小组编号">${groupNumber(g)}</div>
        <div class="battle-group-heading"><div class="battle-group-name" title="${escapeHtml(g.name)}">${escapeHtml(g.name)}</div></div>
        <div class="item-slots">${slotsHtml}</div>
        <div class="battle-score-container">${scoreHtml}</div>
        <button type="button" class="more-btn" onclick="event.stopPropagation();openItemWindow(${g.id},'detail')" title="打开小组详情">···</button>
      </div>
      <div class="card-action-row">${g.resultText || (typeof CompetitionEffects !== "undefined" && CompetitionEffects.labels(g).length) ? `<div class="battle-result">${g.resultText ? escapeHtml(g.resultText) : ""}${typeof CompetitionEffects !== "undefined" && CompetitionEffects.labels(g).length ? `<span class="competition-status" title="${escapeHtml(CompetitionEffects.labels(g).join("；"))}">${escapeHtml(CompetitionEffects.labels(g).join(" · "))}</span>` : ""}</div>` : ""}<div class="action-controls-col"><div class="opt-group">${optionsHtml}</div><button class="${allInClass} ${roundClass}" onclick="toggleAllInCard(${g.id})" ${state.evaluated ? "disabled" : ""}>${allInText}</button></div></div>`;
  },
});
