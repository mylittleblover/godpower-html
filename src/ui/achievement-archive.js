/* Archives achievement hall UI & non-blocking achievement unlock banner. */
const AchievementArchiveUI = (() => {
  const CAT_LABELS = Object.freeze({
    all: "全部 60",
    learning: "学习成长",
    competition: "竞技博弈",
    collection: "道具图鉴",
    tactics: "战术对抗",
    honors: "赛季荣誉",
    hidden: "隐藏挑战",
  });
  const CAT_ICONS = Object.freeze({
    learning: "book",
    competition: "trending_up",
    collection: "gift",
    tactics: "bolt",
    honors: "trophy",
    hidden: "lock",
  });

  let activeArchivesTab = "records";
  let selectedGroupUid = "__all__";
  let activeCategory = "all";
  let statusFilter = "all";
  let searchQuery = "";
  let revealHidden = false;
  let lastAchSwitchSig = "";
  let cachedTotalUnlocked = 0;

  let toastQueue = [];
  let toastActive = false;
  let toastTimer = null;

  const E = GodpowerUIModel.escapeHtml;

  const glyph = (name) =>
    globalThis.GodpowerTheme?.icon ? globalThis.GodpowerTheme.icon(name) : "";

  function safeLedger() {
    try {
      return typeof AchievementLedger !== "undefined"
        ? AchievementLedger.normalize(state?.achievementLedger)
        : { schemaVersion: 1, groups: {} };
    } catch {
      return { schemaVersion: 1, groups: {} };
    }
  }

  function groupList() {
    return Array.isArray(state?.groups)
      ? state.groups.filter((g) => g && g.groupUid)
      : [];
  }

  function resolveUnlockStatus(progress, id) {
    if (!progress) return null;
    if (progress.permanentUnlocks?.[id]) {
      return {
        kind: "permanent",
        label: "已永久解锁",
        at: progress.permanentUnlocks[id].unlockedAt || "",
      };
    }
    if (progress.seasonUnlocks?.[id]) {
      const pending = progress.seasonUnlocks[id].status === "pending-archive";
      return {
        kind: pending ? "pending" : "archived",
        label: pending ? "本届待归档" : "本届已达成",
        at: progress.seasonUnlocks[id].unlockedAt || "",
      };
    }
    if (progress.archivedUnlocks?.[id]) {
      const c = Number(progress.archivedUnlocks[id].count) || 1;
      return {
        kind: "archived",
        label: `历届已归档 ×${c}`,
        at: progress.archivedUnlocks[id].firstUnlockedAt || "",
      };
    }
    return null;
  }

  function computeProgressRatio(progress, id) {
    if (!progress) return null;
    const h = progress.historicalCounters || {};
    const s = progress.seasonProgress || {};
    const c = progress.competitionStats || {};
    const it = progress.itemProgress || {};
    const ho = progress.honorStats || {};
    const maxInstCount = (key, field) => {
      const vals = Object.values(it.byInstance || {})
        .filter((x) => x?.key === key)
        .map((x) => Number(x?.[field]) || 0);
      return vals.length ? Math.max(...vals) : 0;
    };
    const maxDefCount = (prefix) => {
      const vals = Object.entries(it.defensesByActivation || {})
        .filter(([k]) => k.startsWith(prefix + ":"))
        .map(([, v]) => Number(v) || 0);
      return vals.length ? Math.max(...vals) : 0;
    };
    const map = {
      "ACH-001": [h.correctAnswers || 0, 1],
      "ACH-002": [h.correctAnswers || 0, 10],
      "ACH-003": [h.correctAnswers || 0, 30],
      "ACH-004": [h.correctAnswers || 0, 100],
      "ACH-005": [s.correctStreak || 0, 3],
      "ACH-006": [s.correctStreak || 0, 5],
      "ACH-007": [s.correctStreak || 0, 10],
      "ACH-008": [s.answeredStreak || 0, 10],
      "ACH-009": [h.answeredRounds || 0, 50],
      "ACH-010": [Math.min(10, s.answered || 0), 10],
      "ACH-011": [Math.min(15, s.answered || 0), 15],
      "ACH-013": [c.positiveGainSeason || 0, 10],
      "ACH-014": [c.positiveGainLifetime || 0, 100],
      "ACH-016": [c.top3In5PlusLifetime || 0, 10],
      "ACH-020": [c.allInStreakSeason || 0, 3],
      "ACH-023": [it.formalAcquires || 0, 1],
      "ACH-024": [it.formalAcquires || 0, 20],
      "ACH-025": [(progress.itemDiscovery || []).length, 13],
      "ACH-026": [(progress.itemDiscovery || []).length, 28],
      "ACH-031": [maxInstCount("triple_mushroom", "gainUses"), 3],
      "ACH-034": [maxInstCount("triple_green", "damageUses"), 3],
      "ACH-036": [maxInstCount("triple_red", "damageUses"), 3],
      "ACH-043": [maxDefCount("star"), 3],
      "ACH-044": [maxDefCount("mega"), 3],
      "ACH-045": [ho.championCount || 0, 1],
      "ACH-046": [ho.championCount || 0, 3],
      "ACH-047": [ho.championCount || 0, 10],
      "ACH-048": [ho.runnerUpCount || 0, 1],
      "ACH-049": [ho.top3Count || 0, 5],
      "ACH-050": [ho.seasonsCompleted || 0, 5],
      "ACH-058": [maxInstCount("fire_flower", "damageUses"), 3],
    };
    const pair = map[id];
    if (!pair) return null;
    const [cur, target] = pair;
    return {
      current: Math.min(cur, target),
      target,
      pct: Math.max(0, Math.min(100, Math.round((cur / target) * 100))),
    };
  }

  function classUnlockedIds(ledger, catalog) {
    const uids = Object.keys(ledger.groups || {});
    const out = new Set();
    for (const entry of catalog) {
      if (uids.some((uid) => resolveUnlockStatus(ledger.groups[uid], entry.id)))
        out.add(entry.id);
    }
    return out;
  }

  function formatTime(iso) {
    if (!iso || typeof iso !== "string") return "";
    const d = new Date(iso);
    if (!Number.isFinite(d.getTime())) return "";
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }

  function renderHall() {
    const host = document.getElementById("achievementHallHost");
    if (!host || typeof AchievementCatalog === "undefined") return;

    const ledger = safeLedger();
    const groups = groupList();
    const catalog = AchievementCatalog.list();
    if (
      selectedGroupUid !== "__all__" &&
      !groups.some((g) => g.groupUid === selectedGroupUid) &&
      !ledger.groups[selectedGroupUid]
    ) {
      selectedGroupUid = "__all__";
    }

    const activeProgress =
      selectedGroupUid === "__all__"
        ? null
        : ledger.groups[selectedGroupUid] || null;
    const allUnlocked = classUnlockedIds(ledger, catalog);

    let permanentCount = 0;
    let pendingSeasonCount = 0;
    let hiddenUnlockedCount = 0;
    let totalUnlockedCount = 0;

    for (const entry of catalog) {
      let st = null;
      if (selectedGroupUid === "__all__") {
        for (const uid of Object.keys(ledger.groups)) {
          const found = resolveUnlockStatus(ledger.groups[uid], entry.id);
          if (found) {
            if (!st || found.kind === "permanent") st = found;
          }
        }
      } else {
        st = resolveUnlockStatus(activeProgress, entry.id);
      }
      if (st) {
        totalUnlockedCount++;
        if (st.kind === "permanent") permanentCount++;
        else if (st.kind === "pending") pendingSeasonCount++;
        if (entry.hidden) hiddenUnlockedCount++;
      }
    }

    const groupOptionsHtml = [
      `<option value="__all__" ${selectedGroupUid === "__all__" ? "selected" : ""}>全班总览 (${allUnlocked.size}/${catalog.length})</option>`,
      ...groups.map((g) => {
        const p = ledger.groups[g.groupUid];
        const count = p
          ? catalog.filter((e) => resolveUnlockStatus(p, e.id)).length
          : 0;
        return `<option value="${E(g.groupUid)}" ${selectedGroupUid === g.groupUid ? "selected" : ""}>${E(g.name)} (${count}/${catalog.length})</option>`;
      }),
    ].join("");

    const kpiHtml = `<div class="ui-overview ach-kpis">
      <div class="ui-panel"><span class="ui-muted">${glyph("trophy")}<span>总解锁进度</span></span><strong>${totalUnlockedCount} / ${catalog.length}</strong></div>
      <div class="ui-panel"><span class="ui-muted">${glyph("check")}<span>永久荣誉</span></span><strong>${permanentCount}</strong></div>
      <div class="ui-panel"><span class="ui-muted">${glyph("history")}<span>本届待归档</span></span><strong>${pendingSeasonCount}</strong></div>
      <div class="ui-panel"><span class="ui-muted">${glyph("lock")}<span>隐藏挑战</span></span><strong>${hiddenUnlockedCount} / 8</strong></div>
    </div>`;

    const catButtons = Object.entries(CAT_LABELS)
      .map(
        ([key, label]) =>
          `<button type="button" class="btn btn-sm ${activeCategory === key ? "btn-primary" : ""}" data-ach-cat="${key}">${E(label)}</button>`,
      )
      .join("");

    const filtered = catalog.filter((entry) => {
      if (activeCategory !== "all" && entry.category !== activeCategory)
        return false;
      const unlockedByFocus =
        selectedGroupUid === "__all__"
          ? allUnlocked.has(entry.id)
          : !!resolveUnlockStatus(activeProgress, entry.id);
      if (statusFilter === "unlocked" && !unlockedByFocus) return false;
      if (statusFilter === "locked" && unlockedByFocus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const masked = entry.hidden && !unlockedByFocus && !revealHidden;
        const hay = masked
          ? `${entry.id} ${entry.rarity} 隐藏`
          : `${entry.id} ${entry.name} ${entry.condition} ${entry.rarity}`;
        if (!hay.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    const cardsHtml = filtered.length
      ? `<div class="ach-grid">${filtered
          .map((entry) => {
            const unlockedGroups = groups
              .filter((g) =>
                resolveUnlockStatus(ledger.groups[g.groupUid], entry.id),
              )
              .map((g) => ({
                name: g.name,
                color: g.color || "#3b82f6",
                status: resolveUnlockStatus(
                  ledger.groups[g.groupUid],
                  entry.id,
                ),
              }));
            const focusStatus =
              selectedGroupUid === "__all__"
                ? unlockedGroups[0]?.status || null
                : resolveUnlockStatus(activeProgress, entry.id);
            const isUnlocked =
              selectedGroupUid === "__all__"
                ? unlockedGroups.length > 0
                : !!focusStatus;
            const masked = entry.hidden && !isUnlocked && !revealHidden;

            let ratio = null;
            if (selectedGroupUid !== "__all__") {
              ratio = computeProgressRatio(activeProgress, entry.id);
            } else if (groups.length) {
              const ratios = groups
                .map((g) =>
                  computeProgressRatio(ledger.groups[g.groupUid], entry.id),
                )
                .filter(Boolean);
              if (ratios.length) {
                ratios.sort((a, b) => b.current - a.current);
                ratio = ratios[0];
              }
            }

            const def = entry.itemKey && globalThis.ITEM_DEFS?.[entry.itemKey];
            const emblem =
              def && typeof itemVisual === "function"
                ? `<span class="ach-emblem ach-emblem-item">${itemVisual(entry.itemKey)}</span>`
                : `<span class="ach-emblem" data-ach-cat="${E(entry.category)}">${glyph(CAT_ICONS[entry.category] || "trophy")}</span>`;

            const badgeText = isUnlocked
              ? focusStatus?.label || "已解锁"
              : "未解锁";

            return `<article class="ui-panel ach-card ${isUnlocked ? "is-unlocked" : "is-locked"}" data-ach-id="${E(entry.id)}">
              <div class="ach-card-head">
                ${emblem}
                <div class="ach-card-titles">
                  <div class="ach-title-line">
                    <strong>${masked ? "隐藏挑战 · ???" : E(entry.name)}</strong>
                    <span class="ach-badges-inline">
                      <span class="ach-rarity" data-rarity="${E(entry.rarity)}">${E(entry.rarity)}</span>
                      <span class="ach-status-pill ${isUnlocked ? "unlocked" : ""}">${E(badgeText)}</span>
                    </span>
                  </div>
                </div>
              </div>
              <p class="ach-condition">${masked ? "在课堂正式对战或特殊道具交互中满足隐藏条件即可解锁。" : E(entry.condition)}</p>
              ${
                ratio && (!entry.hidden || isUnlocked || revealHidden)
                  ? `<div class="ach-progress-wrap">
                      <div class="ach-progress-track"><div class="ach-progress-fill" style="width:${ratio.pct}%"></div></div>
                      <span class="ach-progress-num">${ratio.current} / ${ratio.target}</span>
                    </div>`
                  : ""
              }
              ${
                selectedGroupUid === "__all__" && unlockedGroups.length
                  ? `<div class="ach-earners">${unlockedGroups
                      .map(
                        (u) =>
                          `<span class="ach-earner-chip"><i style="background:${E(u.color)}"></i>${E(u.name)}</span>`,
                      )
                      .join("")}</div>`
                  : focusStatus?.at
                    ? `<div class="ach-time">达成时间：${E(formatTime(focusStatus.at))}</div>`
                    : ""
              }
            </article>`;
          })
          .join("")}</div>`
      : `<div class="ui-empty"><strong>没有匹配的成就</strong><p class="ui-muted">尝试切换分类或调整筛选条件。</p></div>`;

    host.innerHTML = `${kpiHtml}
      <div class="ach-toolbar">
        <div class="ach-cat-pills" role="group" aria-label="成就分类">${catButtons}</div>
        <div class="ach-filter-right">
          <label class="ach-reveal-toggle"><input type="checkbox" id="achRevealHiddenCheck" ${revealHidden ? "checked" : ""}><span>显示隐藏成就条件</span></label>
          <select id="achGroupSelect" aria-label="按小组筛选成就">${groupOptionsHtml}</select>
          <select id="achStatusSelect" aria-label="解锁状态筛选">
            <option value="all" ${statusFilter === "all" ? "selected" : ""}>全部状态</option>
            <option value="unlocked" ${statusFilter === "unlocked" ? "selected" : ""}>仅已解锁</option>
            <option value="locked" ${statusFilter === "locked" ? "selected" : ""}>仅未解锁</option>
          </select>
          <input id="achHallSearch" type="search" value="${E(searchQuery)}" placeholder="搜索成就名称或条件" aria-label="搜索成就">
        </div>
      </div>
      ${cardsHtml}`;

    const grpSel = document.getElementById("achGroupSelect");
    if (grpSel)
      grpSel.onchange = () => {
        selectedGroupUid = grpSel.value || "__all__";
        renderHall();
      };
    host.querySelectorAll("[data-ach-cat]").forEach((btn) => {
      btn.onclick = () => {
        activeCategory = btn.dataset.achCat || "all";
        renderHall();
      };
    });
    const rev = document.getElementById("achRevealHiddenCheck");
    if (rev)
      rev.onchange = () => {
        revealHidden = !!rev.checked;
        renderHall();
      };
    const stSel = document.getElementById("achStatusSelect");
    if (stSel)
      stSel.onchange = () => {
        statusFilter = stSel.value || "all";
        renderHall();
      };
    const searchEl = document.getElementById("achHallSearch");
    if (searchEl)
      searchEl.oninput = () => {
        searchQuery = searchEl.value || "";
        const caret = searchEl.selectionStart;
        renderHall();
        const next = document.getElementById("achHallSearch");
        if (next) {
          next.focus();
          if (typeof caret === "number") next.setSelectionRange(caret, caret);
        }
      };
  }

  function syncSwitchButtons() {
    const catalog =
      typeof AchievementCatalog !== "undefined"
        ? AchievementCatalog.list()
        : [];
    const ledgerRef = state?.achievementLedger || null;
    const processedSig = ledgerRef?.groups
      ? Object.values(ledgerRef.groups)
          .map(
            (g) =>
              `${g?.processedEvents?.length || 0}:${Object.keys(g?.permanentUnlocks || {}).length}:${Object.keys(g?.seasonUnlocks || {}).length}:${Object.keys(g?.archivedUnlocks || {}).length}`,
          )
          .join(",")
      : "";
    if (processedSig !== lastAchSwitchSig) {
      lastAchSwitchSig = processedSig;
      const ledger = safeLedger();
      cachedTotalUnlocked = catalog.length
        ? classUnlockedIds(ledger, catalog).size
        : 0;
    }
    const totalUnlocked = cachedTotalUnlocked;
    document.querySelectorAll("[data-archives-tab]").forEach((btn) => {
      const target = btn.dataset.archivesTab;
      const isActive = target === activeArchivesTab;
      btn.classList.toggle("btn-primary", isActive);
      btn.setAttribute("aria-selected", String(isActive));
      if (target === "achievements" && catalog.length) {
        const label = btn.querySelector("span:last-child");
        if (label)
          label.textContent = `成就与荣誉殿堂 (${totalUnlocked}/${catalog.length})`;
      }
    });
    const statsEl = document.getElementById("archiveClassStats");
    const filterEl = document.querySelector(
      "#view-archives .ui-archive-filter",
    );
    const recordsEl = document.getElementById("settlementHistoryContainer");
    const hallEl = document.getElementById("achievementHallHost");
    const showHall = activeArchivesTab === "achievements";
    if (statsEl) statsEl.hidden = showHall;
    if (filterEl) filterEl.hidden = showHall;
    if (recordsEl) recordsEl.hidden = showHall;
    if (hallEl) {
      hallEl.hidden = !showHall;
      if (showHall) renderHall();
    }
  }

  function switchTab(tab = "records") {
    activeArchivesTab = tab === "achievements" ? "achievements" : "records";
    syncSwitchButtons();
  }

  function openHall(groupUid = "__all__") {
    if (groupUid) selectedGroupUid = groupUid;
    if (typeof switchView === "function") switchView("archives");
    switchTab("achievements");
  }

  function render() {
    syncSwitchButtons();
  }

  function ensureToastHost() {
    let el = document.getElementById("achievementUnlockToast");
    if (el) return el;
    el = document.createElement("aside");
    el.id = "achievementUnlockToast";
    el.className = "ach-unlock-toast";
    el.setAttribute("aria-live", "polite");
    el.hidden = true;
    document.body.appendChild(el);
    return el;
  }

  function resolveRarityRank(rarity) {
    return { 普通: 1, 进阶: 2, 史诗: 3, 传奇: 4 }[rarity] || 0;
  }

  function pumpToast() {
    const el = ensureToastHost();
    if (toastActive || !toastQueue.length) return;
    const item = toastQueue.shift();
    toastActive = true;
    const batch = Array.isArray(item?.batch) ? item.batch : [item];
    const resolved = batch
      .map((entryItem) => ({
        groupUid: entryItem?.groupUid || "",
        achievementId: entryItem?.achievementId || "",
        entry:
          typeof AchievementCatalog !== "undefined"
            ? AchievementCatalog.get(entryItem?.achievementId)
            : null,
      }))
      .filter((x) => x.entry);
    if (!resolved.length) {
      toastActive = false;
      pumpToast();
      return;
    }
    resolved.sort(
      (a, b) =>
        resolveRarityRank(b.entry.rarity) - resolveRarityRank(a.entry.rarity),
    );
    const lead = resolved[0];
    const uniqueAchievementIds = [
      ...new Set(resolved.map((x) => x.achievementId)),
    ];
    const uniqueGroupUids = [
      ...new Set(resolved.map((x) => x.groupUid).filter(Boolean)),
    ];
    const firstGroup =
      (state?.groups || []).find((g) => g.groupUid === lead.groupUid) || null;
    const isMulti = resolved.length > 1;
    const kicker =
      uniqueAchievementIds.length > 1
        ? `本轮成就达成 · 共 ${resolved.length} 项`
        : `成就解锁 · ${E(lead.entry.rarity)}`;
    const groupSummary =
      uniqueGroupUids.length > 1
        ? `${E(firstGroup?.name || "参赛小组")} 等 ${uniqueGroupUids.length} 组`
        : E(firstGroup?.name || "参赛小组");
    const titleText =
      uniqueAchievementIds.length > 1
        ? `${E(lead.entry.name)} 等 ${uniqueAchievementIds.length} 项成就`
        : E(lead.entry.name);
    const descText =
      isMulti && uniqueAchievementIds.length > 1
        ? `${uniqueGroupUids.length || 1} 个小组触发解锁，点击「殿堂」查看详情`
        : E(lead.entry.condition);
    const openTarget = uniqueGroupUids.length === 1 ? lead.groupUid : "__all__";

    el.innerHTML = `<div class="ach-toast-icon">${glyph("trophy")}</div>
      <div class="ach-toast-body">
        <div class="ach-toast-top"><span class="ach-toast-kicker">${kicker}</span><b>${groupSummary}</b></div>
        <div class="ach-toast-title">${titleText}</div>
        <div class="ach-toast-desc">${descText}</div>
      </div>
      <div class="ach-toast-actions">
        <button type="button" class="btn btn-sm btn-primary" data-ach-open="${E(openTarget)}">殿堂</button>
        <button type="button" class="btn btn-sm" data-ach-close aria-label="关闭成就提示">✕</button>
      </div>`;
    el.hidden = false;
    el.querySelector("[data-ach-open]").onclick = () => {
      clearTimeout(toastTimer);
      el.hidden = true;
      toastActive = false;
      openHall(openTarget);
    };
    el.querySelector("[data-ach-close]").onclick = () => {
      clearTimeout(toastTimer);
      el.hidden = true;
      toastActive = false;
      pumpToast();
    };
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.hidden = true;
      toastActive = false;
      pumpToast();
    }, 4200);
  }

  function notifyUnlocked(items) {
    if (!Array.isArray(items) || !items.length) return;
    const seen = new Set();
    const valid = [];
    for (const item of items) {
      if (!item?.achievementId) continue;
      const sig = `${item.groupUid || ""}:${item.achievementId}`;
      if (seen.has(sig)) continue;
      seen.add(sig);
      valid.push(item);
    }
    if (!valid.length) return;
    if (valid.length === 1) toastQueue.push(valid[0]);
    else toastQueue.push({ batch: valid });
    if (toastQueue.length > 6) toastQueue = toastQueue.slice(-6);
    pumpToast();
    if (activeArchivesTab === "achievements") renderHall();
  }

  function init() {
    document.querySelectorAll("[data-archives-tab]").forEach((btn) => {
      btn.addEventListener("click", () => switchTab(btn.dataset.archivesTab));
    });
    window.addEventListener("godpower:domain-commit", (event) => {
      const unlocked = event.detail?.unlockedAchievements;
      if (Array.isArray(unlocked) && unlocked.length) notifyUnlocked(unlocked);
      syncSwitchButtons();
    });
    window.addEventListener("godpower:achievements-unlocked", (event) => {
      const unlocked = event.detail?.unlocked;
      if (Array.isArray(unlocked) && unlocked.length) notifyUnlocked(unlocked);
      syncSwitchButtons();
    });
    window.addEventListener("godpower:active-save-changed", () => {
      syncSwitchButtons();
    });
    syncSwitchButtons();
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else setTimeout(init, 0);

  return { render, switchTab, openHall, notifyUnlocked };
})();
globalThis.AchievementArchiveUI = AchievementArchiveUI;
