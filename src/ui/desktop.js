/* UI composition service. Existing business commands remain the only state writers. */
const DesktopUI = (() => {
  const M = GodpowerUIModel,
    E = escapeHtml,
    $ = (s) => document.querySelector(s),
    defaults = {
      motion: "full",
      speed: 1,
      pageMotion: true,
      itemFx: true,
      systemMotion: true,
      knowledge: true,
      itemTip: true,
      honors: true,
      challenge: true,
      subject: "politics",
      groupCruise: true,
      groupCruiseVersion: 2,
    };
  let preferences = { ...defaults },
    bank = M.examples,
    ready = false,
    activeSettings = "rules",
    archiveSearch = "",
    archiveSort = "new",
    lastWelcome = "",
    animations = new Set(),
    settingsAnimations = new Set();
  const paths = {
    home: "M3 10 12 3l9 7v11h-6v-7H9v7H3Z",
    battle: "m5 3 16 16m0-16L5 19M3 15l6 6m6-18 6 6",
    history: "M3 12a9 9 0 1 0 3-7M3 3v6h6m3-2v5l3 2",
    archive: "M4 5h16v5H4Zm2 5v11h12V10m-9 4h6",
    settings:
      "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8m-2-5h4l1 3 3 1 3 3v4l-3 1-1 3-3 3h-4l-1-3-3-1-3-3v-4l3-1 1-3Z",
    users:
      "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m14-13a4 4 0 0 1 0 8m5 5v-2a4 4 0 0 0-3-4M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8",
    spark: "m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z",
    sound: "m3 9 5 0 5-5v16l-5-5H3Zm14-2a7 7 0 0 1 0 10m3-13a11 11 0 0 1 0 16",
    book: "M12 5Q7 1 2 4v16q5-3 10 1 5-4 10-1V4q-5-3-10 1v16",
    shield: "M12 2 3 6v6q0 7 9 10 9-3 9-10V6Z",
    arrow: "m9 5 7 7-7 7",
    gift: "M3 9h18v5H3Zm2 5v8h14v-8M12 9v13M12 9C2 9 5 0 9 4Zm0 0c10 0 7-9 3-5Z",
  };
  function icon(name) {
    return GodpowerTheme.icon(name, paths[name] || paths.spark);
  }
  function empty(title, text) {
    return `<div class="ui-empty">${icon("archive")}<h3>${E(title)}</h3><p>${E(text)}</p><button class="btn btn-primary" onclick="switchView('battle')">进入比赛</button></div>`;
  }
  function persistPreferences() {
    try {
      localStorage.setItem(
        "godpower_ui_preferences_v1",
        JSON.stringify(preferences),
      );
      return true;
    } catch (e) {
      showToast("界面偏好未保存：浏览器存储不可用，本次设置仍生效");
      return false;
    }
  }
  function applyPreferences() {
    GodpowerTheme.cancel();
    settleDisclosures();
    cancelSettingsMotion();
    ClassroomFeedback.cancel();
    BattleMotion.clear();
    document.body.dataset.motion = preferences.motion;
    window.WelcomeV2?.preferencesChanged();
    document.body.dataset.itemFx = preferences.itemFx ? "on" : "off";
    document.body.dataset.systemMotion = String(preferences.systemMotion);
    if (!canAnimate()) {
      clearPickerReveal();
      cancelItemScoreAnimations();
      cancelScoreAnimationAndSync();
      cancelAnimations();
      document.getAnimations().forEach((a) => a.cancel());
    }
  }
  function canAnimate() {
    return (
      preferences.motion !== "off" &&
      !(
        preferences.systemMotion &&
        matchMedia("(prefers-reduced-motion: reduce)").matches
      )
    );
  }
  function motionEase() {
    return getComputedStyle(document.documentElement)
      .getPropertyValue("--motion-ease")
      .trim();
  }
  function animate(el, frames, options = {}) {
    if (!el || !canAnimate()) return;
    const a = el.animate(frames, {
      duration: 240 / preferences.speed,
      easing: motionEase(),
      ...options,
    });
    animations.add(a);
    a.finished.catch(() => {}).finally(() => animations.delete(a));
    return a;
  }
  let pageMotionFrame = null;
  function cancelAnimations() {
    BattleMotion.clear();
    observeVisualState(false);
    if (pageMotionFrame !== null) cancelAnimationFrame(pageMotionFrame);
    pageMotionFrame = null;
    settleDisclosures();
    cancelSettingsMotion();
    for (const a of animations) a.cancel();
    animations.clear();
    document.querySelectorAll("#groupList .group-row-card").forEach((card) => {
      if (typeof clearCardFx === "function") clearCardFx(card);
      if (typeof clearAttackHitFxV2116 === "function")
        clearAttackHitFxV2116(card);
    });
    document
      .querySelectorAll(".card-fx-badge,.attack-hit-badge")
      .forEach((el) => el.remove());
    document.querySelectorAll(".ui-fx-layer").forEach((x) => x.remove());
  }
  function visualEvent(type, detail = {}) {
    document.dispatchEvent(
      new CustomEvent("godpower:visual", { detail: { type, ...detail } }),
    );
    BattleMotion.event(type, detail);
  }

  let viewportSignature = "";
  function syncViewport() {
    const zoom = Number(getComputedStyle(document.body).zoom) || 1,
      value = `${innerWidth}/${innerHeight}/${zoom}`;
    if (value === viewportSignature) return;
    viewportSignature = value;
    document.body.style.setProperty(
      "--ui-viewport-height",
      `${innerHeight / zoom}px`,
    );
    document.body.style.setProperty(
      "--ui-viewport-width",
      `${innerWidth / zoom}px`,
    );
  }
  let historyEntryPending = false,
    archiveEntryPending = false;
  function viewChanged(name) {
    if (!ready) return;
    globalThis.HandItemCinematic?.dismiss();
    const pageScope = window.GodPowerPageLifecycle?.enter(name).scope;
    ClassroomFeedback.cancel();
    BattleMotion.clear();
    cancelItemScoreAnimations();
    cancelScoreAnimationAndSync();
    window.WelcomeV2?.viewChanged(name);
    for (const m of [...openStack].reverse()) {
      if (
        !["themeDialogV21727", "grandModalOverlay", "welcomeModal"].includes(
          m.id,
        )
      )
        m.close();
    }
    document.body.dataset.currentView = name;
    const dock = $(".bottom-dock");
    dock.hidden = name !== "battle";
    dock.inert = name !== "battle";
    dock.style.display = name === "battle" ? "" : "none";
    document.querySelectorAll(".nav-tab").forEach((b) => {
      b.setAttribute("aria-selected", String(b.dataset.view === name));
      b.setAttribute(
        "aria-current",
        b.dataset.view === name ? "page" : "false",
      );
    });
    $(".ui-dock-menu")?.removeAttribute("open");
    $(".dock-humor-tip")?.classList.remove("show");
    cancelAnimations();
    historyEntryPending = name === "history";
    archiveEntryPending = name === "archives";
    if (preferences.pageMotion && name !== "settings") {
      const enterPage = () => {
        pageMotionFrame = null;
        if (currentView !== name || !preferences.pageMotion) return;
        const selectors = {
          welcome:
            ".gp-hero,.gp-kpis,.gp-main-grid,.gp-group-section,.gp-daily-grid",
          battle:
            "#heightResizerDock,#groupList .group-row-card,#quickBatchBar",
          history: ".ui-collection-header",
          archives:
            ".ui-collection-header,#archiveClassStats,.ui-archive-filter",
        };
        const host = $(`#view-${name}`);
        const targets = [
          ...host.querySelectorAll(selectors[name] || ":scope"),
        ].slice(0, 18);
        targets.forEach((el, i) => {
          const animation = animate(
            el,
            [
              {
                opacity: 0,
                translate: preferences.motion === "full" ? "0 -10px" : "0 -3px",
              },
              { opacity: 1, translate: "0 0" },
            ],
            {
              delay: Math.min(i * 35, 210) / preferences.speed,
              duration: 260 / preferences.speed,
              fill: "backwards",
            },
          );
          if (pageScope && animation) pageScope.animation(animation);
        });
      };
      pageMotionFrame = pageScope
        ? pageScope.frame(enterPage)
        : requestAnimationFrame(enterPage);
    }
    if (name === "gameplay") GameplayPage.render();
    if (name === "welcome") renderWelcome();
    if (name === "settings") selectSettings(activeSettings, true);
  }
  function renderWelcome() {
    if (!ready) return;
    // Business feedback is observed on every refresh, even when home is hidden.
    // Home DOM/layout is presentation work and is rebuilt on the next entry.
    observeVisualState();
    if (currentView !== "welcome") return;
    const track = $("#uiGroupTrack");
    if (!track) return;
    syncViewport();
    if (!canAnimate()) document.getAnimations().forEach((a) => a.cancel());
    const groups = state.groups || [],
      sorted = [...groups].sort((a, b) => Number(b.score) - Number(a.score));
    const mask = Number(state.itemGlobal?.blooperUntil || 0) > Date.now();
    const signature =
      JSON.stringify(
        groups.map((g) => [
          g.id,
          g.name,
          g.score,
          g.color,
          g.inventory,
          g.itemEffect,
          g.booShield,
          g.booRoundsLeftV218,
        ]),
      ) + mask;
    if (signature !== lastWelcome) {
      lastWelcome = signature;
      const x = track.scrollLeft;
      track.innerHTML = groups.length
        ? groups
            .map((g) => {
              const item = g.inventory?.[0],
                states = Object.entries(g.itemEffect || {})
                  .filter(
                    ([k, v]) =>
                      (k === "type" && !!v) ||
                      (["iceLock", "featherDodge"].includes(k) &&
                        Number(v) > 0),
                  )
                  .map(
                    ([k, v]) =>
                      ({
                        bullet: "炮弹追击",
                        featherDodge: "羽毛闪避",
                        star: "无敌星",
                        mega: "巨大蘑菇",
                        boo: "幽灵保护",
                        ice: "冻结",
                        power: "强力蘑菇",
                        feather: "羽毛",
                      })[k === "type" ? v : k] ||
                      (k === "iceLock" ? "冻结" : k),
                  );
              if (g.booShield > 0 || g.booRoundsLeftV218 > 0)
                states.push("幽灵保护");
              return `<button class="ui-group-card" data-group="${Number(g.id)}" style="--group-color:${/^#[a-f\d]{3,8}$/i.test(g.color) ? g.color : "#0f766e"}" aria-label="查看${E(g.name)}的小组详情"><span class="ui-chip">第 ${E(g.groupNo || groups.indexOf(g) + 1)} 组</span><span class="ui-muted" style="float:right">排名 ${mask ? "—" : sorted.findIndex((x) => x.id === g.id) + 1}</span><span class="ui-group-title">${E(g.name)}</span><span class="ui-group-score">${mask ? "???" : E(g.score)}</span><span class="ui-muted"> 分</span><footer>${item ? itemVisual(item.key) : icon("gift")}<span>${E(item ? ITEM_DEFS[item.key]?.name || "未知道具" : "暂无主要道具")}</span></footer>${states.length ? `<div class="ui-muted">${E(states.join(" · "))}</div>` : ""}</button>`;
            })
            .join("")
        : empty(
            "课堂，准备就绪",
            "添加小组后，这里将展示实时积分、排名与道具。",
          );
      track.scrollLeft = x;
      track
        .querySelectorAll("[data-group]")
        .forEach(
          (el) =>
            (el.onclick = () =>
              openItemWindow(Number(el.dataset.group), "detail")),
        );
    }
    requestAnimationFrame(updateArrows);
    renderDaily();
    if (window.WelcomeV2 && typeof window.WelcomeV2.render === "function")
      window.WelcomeV2.render();
  }
  function updateArrows() {
    const t = $("#uiGroupTrack");
    if (!t) return;
    const overflow = t.scrollWidth > t.clientWidth + 2;
    t.classList.toggle("ui-few", !overflow);
    $("#uiGroupPrev").disabled = !overflow || t.scrollLeft <= 1;
    $("#uiGroupNext").disabled =
      !overflow || t.scrollLeft + t.clientWidth >= t.scrollWidth - 2;
  }
  let visualSnapshot = new Map();
  function observeVisualState(notify = true) {
    const next = new Map();
    for (const g of state.groups) {
      const current = {
        main: g.inventory?.[0]?.key || "",
        inventory: JSON.stringify(g.inventory || []),
        effect: JSON.stringify(g.itemEffect || null),
        count: g.inventory?.length || 0,
      };
      const prior = visualSnapshot.get(g.id);
      if (prior && notify) {
        if (
          prior.main &&
          current.main &&
          prior.main !== current.main &&
          current.count <= prior.count
        )
          visualEvent("ITEM_QUEUE_PROMOTED", {
            groupId: g.id,
            key: current.main,
          });
        if (current.count > prior.count)
          visualEvent("ITEM_DRAW_REVEAL", {
            groupId: g.id,
            key: g.inventory.at(-1)?.key,
          });
        if (current.effect !== prior.effect) {
          visualEvent(
            current.effect === "null"
              ? "ITEM_EFFECT_EXPIRED"
              : "ITEM_EFFECT_APPLIED",
            { groupId: g.id, key: g.itemEffect?.type },
          );
        }
      }
      next.set(g.id, current);
    }
    visualSnapshot = next;
  }
  let dailySignature = "";
  const dailyOffsets = { knowledge: 0, challenges: 0 };
  let quizAttempt = { key: "", answer: null, correct: false };
  function renderDaily() {
    const host = $("#uiDailyGrid");
    if (!host) return;
    const history = getSettlementHistory(),
      signature =
        M.dayIndex() +
        JSON.stringify([
          preferences.knowledge,
          preferences.itemTip,
          preferences.honors,
          preferences.challenge,
          preferences.subject,
          dailyOffsets.knowledge,
          dailyOffsets.challenges,
        ]) +
        JSON.stringify(history.map((x) => [x.title, x.champion, x.time])) +
        Object.keys(ITEM_DEFS).length;
    if (signature === dailySignature) return;
    dailySignature = signature;
    const knowledge = M.daily(
        bank.knowledge.filter((x) => x.subject === preferences.subject),
        new Date(),
        dailyOffsets.knowledge,
      ),
      quiz = M.daily(
        bank.challenges.filter((x) => x.subject === preferences.subject),
        new Date(),
        dailyOffsets.challenges,
      ),
      keys = Object.keys(ITEM_DEFS),
      key = M.daily(keys),
      item = ITEM_DEFS[key],
      last = history[0],
      winner = last?.groups?.[0];
    const quizKey = [
      M.dayIndex(),
      preferences.subject,
      dailyOffsets.challenges,
      quiz?.id,
    ].join(":");
    if (quizAttempt.key !== quizKey)
      quizAttempt = { key: quizKey, answer: null, correct: false };
    let html = "";
    if (preferences.knowledge)
      html += `<article class="ui-panel gp-daily-knowledge"><span class="ui-eyebrow">每日知识 · 教学示例</span><h3>${E(knowledge?.title || "本学科暂无知识卡")}</h3>${knowledge ? `<span class="ui-muted">${E(knowledge.module || knowledge.subject)}</span><p>${E(knowledge.summary || "")}</p><p class="ui-muted">易错点：${E(knowledge.mistake || "未提供")}</p><details><summary>展开详细解释</summary><p>${E(knowledge.detail || knowledge.summary || "")}</p><div class="ui-source">${E(knowledge.source)}</div></details><button class="btn btn-sm" id="uiNextKnowledge">下一条知识</button>` : '<p class="ui-muted">可在设置中导入本地审核题库。</p>'}</article>`;
    if (preferences.itemTip)
      html += `<article class="ui-panel gp-daily-item"><span class="ui-eyebrow">今日道具小知识</span><div class="ui-item-tip-icon">${itemVisual(key)}</div><h3>${E(item.name)}</h3><p>${E(item.desc)}</p><p class="ui-muted">使用条件：以当前比赛的主要道具队列及规则引擎校验为准；冻结、模式和每题限制均保留。</p><details><summary>使用技巧与完整规则</summary><p>先确认主要道具及可用目标，再使用。次要道具需等待晋升。</p><button class="btn btn-sm btn-primary" onclick="openItemEncyclopedia()">打开实际道具百科</button></details></article>`;
    if (preferences.honors)
      html += `<article class="ui-panel gp-daily-honors"><span class="ui-eyebrow">历史荣誉</span><h3>${E(last?.champion || winner?.name || "等待第一届冠军")}</h3><p>${winner ? E(winner.score) + " 分 · 最近归档冠军" : "每一届课堂，都值得被记住。"}</p><p class="ui-muted">已归档 ${history.length} 届</p><p class="ui-muted">${E(last?.title || "正式结算后在这里留下荣誉")}</p><button class="btn btn-sm btn-primary" onclick="switchView('archives')">走进封神榜</button></article>`;
    if (preferences.challenge)
      html += `<article class="ui-panel gp-daily-challenge"><span class="ui-eyebrow">每日课堂挑战 · 不计比赛积分</span><h3>${E(quiz?.title || "本学科暂无挑战")}</h3>${quiz ? `<div class="ui-quiz-options">${quiz.options.map((o, i) => `<button data-quiz-answer="${i}" aria-pressed="false">${"ABCD"[i]} · ${E(o)}</button>`).join("")}</div><div class="ui-quiz-result" role="status"></div><div class="ui-source">${E(quiz.source)}</div><button class="btn btn-sm" id="uiNextChallenge" disabled>答对后下一题</button>` : '<p class="ui-muted">请在设置中导入对应学科的题目。</p>'}</article>`;
    host.innerHTML = html;
    host.dataset.dailyRevision = String(
      Number(host.dataset.dailyRevision || 0) + 1,
    );
    host.dataset.cardCount = host.querySelectorAll("article").length;
    for (const [selector, kind] of [
      ["#uiNextKnowledge", "knowledge"],
      ["#uiNextChallenge", "challenges"],
    ]) {
      const next = host.querySelector(selector);
      if (next)
        next.onclick = () => {
          dailyOffsets[kind]++;
          renderDaily();
        };
    }
    host.querySelectorAll("[data-quiz-answer]").forEach(
      (b) =>
        (b.onclick = () => {
          b.parentElement
            .querySelectorAll("button")
            .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
          quizAttempt.answer = Number(b.dataset.quizAnswer);
          quizAttempt.correct ||= quizAttempt.answer === quiz.answer;
          const card = b.closest(".gp-daily-challenge");
          if (quizAttempt.correct) {
            card.querySelector("#uiNextChallenge").disabled = false;
            card.querySelector("#uiNextChallenge").textContent = "下一题";
          }
          card.querySelector(".ui-quiz-result").textContent =
            (Number(b.dataset.quizAnswer) === quiz.answer
              ? "回答正确。"
              : "再想一想，正确答案是 " + "ABCD"[quiz.answer] + "。") +
            quiz.explanation;
        }),
    );
    if (quizAttempt.answer !== null)
      host
        .querySelector(`[data-quiz-answer="${quizAttempt.answer}"]`)
        ?.onclick();
  }

  function historyKind(desc = "") {
    return /清零|恢复|撤销|回溯|删除/.test(desc)
      ? ["danger", "shield", "数据与恢复"]
      : /道具|攻击|龟壳|蘑菇/.test(desc)
        ? ["item", "gift", "道具操作"]
        : /题|回合|答题|结算/.test(desc)
          ? ["round", "battle", "回合操作"]
          : /成员|小组|名单/.test(desc)
            ? ["manage", "users", "小组管理"]
            : ["score", "history", "积分与操作"];
  }
  function inventory(items) {
    return (
      items
        .map((i) => `${ITEM_DEFS[i.key]?.name || i.key} ×${i.charges ?? 1}`)
        .join("、") || "空"
    );
  }
  function renderHistory() {
    if (!ready) return;
    const host = $("#historyListView");
    if (!host) return;
    host.className = "ui-timeline";
    $("#uiHistoryCount").textContent =
      `${historyStack.length} / ${MAX_HISTORY} 条记录`;
    if (!historyStack.length) {
      host.className = "";
      host.innerHTML = empty(
        "后悔药还没开封",
        "每次操作前的快照会留在这里。查看记录不会改变当前比赛。",
      );
      return;
    }
    host.innerHTML = historyStack
      .map((h, i) => {
        const next = historyStack[i + 1] || state,
          diffs = M.differences(h, next),
          [kind, glyph, label] = historyKind(h.desc),
          changed = diffs.filter(
            (d) =>
              d.delta ||
              d.added ||
              d.removed ||
              JSON.stringify(d.inventoryBefore) !==
                JSON.stringify(d.inventoryAfter) ||
              JSON.stringify(d.effectsBefore) !==
                JSON.stringify(d.effectsAfter),
          );
        return `<article class="ui-panel ui-history" data-kind="${kind}" style="--record-index:'${String(i + 1).padStart(2, "0")}'"><details><summary><div><span class="ui-chip">${icon(glyph)} ${label}</span><h3>${E(h.desc || "未命名操作")}</h3><span class="ui-muted">${E(h.time || "未记录时间")} · ${E(changed.map((g) => g.name).join("、") || "未发现可比较的小组变动")}</span></div><span class="ui-chip">${i === historyStack.length - 1 ? "最近操作前快照" : "查看快照"} ${icon("arrow")}</span></summary><div class="ui-snapshot-note">以下比较：此操作前快照 → ${i === historyStack.length - 1 ? "当前状态" : "下一条操作前快照"}。${i === historyStack.length - 1 ? "当前状态可能包含尚未记录的变化。" : "两次快照之间可能含未单独记录的操作。"}历史未保存的字段无法推断。</div><div class="ui-table-wrap"><table class="ui-table"><thead><tr><th>小组</th><th>积分变化</th><th>名次</th><th>道具队列</th><th>持续状态</th></tr></thead><tbody>${diffs.map((d) => `<tr><td>${E(d.name)}${d.added ? "（新增）" : d.removed ? "（移除）" : ""}</td><td>${d.before ?? "—"} → ${d.after ?? "—"} <strong class="${d.delta > 0 ? "ui-positive" : d.delta < 0 ? "ui-negative" : ""}">${d.delta === null ? "" : `(${d.delta > 0 ? "+" : ""}${d.delta})`}</strong></td><td>${d.rankBefore ?? "—"} → ${d.rankAfter ?? "—"}</td><td>${E(inventory(d.inventoryBefore))} → ${E(inventory(d.inventoryAfter))}</td><td>${E(JSON.stringify(d.effectsBefore))} → ${E(JSON.stringify(d.effectsAfter))}</td></tr>`).join("")}</tbody></table></div><p class="ui-muted">答题状态：${h.roundActive ? "答题中" : "未答题"} → ${next.roundActive ? "答题中" : "未答题"}；已结算：${h.evaluated ? "是" : "否"} → ${next.evaluated ? "是" : "否"}。名次按快照积分顺序展示，不改变比赛排序。</p><button class="btn btn-danger" data-restore="${i}">恢复此操作前的状态</button></details></article>`;
      })
      .reverse()
      .join("");
    if (historyEntryPending && preferences.pageMotion) {
      historyEntryPending = false;
      host.querySelectorAll(".ui-history:nth-child(-n+8)").forEach((el, i) =>
        animate(
          el,
          [
            { opacity: 0, translate: "0 -8px" },
            { opacity: 1, translate: "0 0" },
          ],
          {
            delay: 60 + i * 35,
            duration: 220 / preferences.speed,
            fill: "backwards",
          },
        ),
      );
    }
    host.querySelectorAll("[data-restore]").forEach(
      (b) =>
        (b.onclick = async () => {
          const index = Number(b.dataset.restore),
            target = historyStack[index];
          if (!target) return;
          const ok = await themeConfirm(
            `恢复到 ${target.time || "未记录时间"}「${target.desc || "未命名操作"}」之前？将恢复小组、积分、道具、持续状态与快照包含的回合字段，并丢弃此节点及其后 ${historyStack.length - index - 1} 条历史。查看不会恢复，确认才执行。`,
            {
              title: "确认恢复历史快照",
              danger: true,
              confirmText: "恢复快照",
            },
          );
          if (ok && historyStack[index] === target) revertToHistory(index);
        }),
    );
  }
  function renderArchives() {
    if (!ready) return;
    const records = getSettlementHistory();
    const all = records
      .flatMap((x) => (Array.isArray(x.groups) ? x.groups : []))
      .filter(
        (g) =>
          (typeof g.score === "number" ||
            (typeof g.score === "string" && g.score.trim() !== "")) &&
          Number.isFinite(Number(g.score)),
      );
    const best = all.length
      ? Math.max(...all.map((g) => Number(g.score)))
      : null;
    $("#archiveClassStats").innerHTML = `<div class="ui-overview">${[
      ["已归档届数", records.length],
      [
        "最近冠军",
        records[0]?.champion || records[0]?.groups?.[0]?.name || "暂无",
      ],
      ["历史最高积分", best ?? "暂无"],
      ["最近归档", records[0]?.time || "暂无"],
    ]
      .map(
        ([t, v]) =>
          `<div class="ui-panel"><span class="ui-muted">${t}</span><strong>${E(v)}</strong></div>`,
      )
      .join("")}</div>`;
    const host = $("#settlementHistoryContainer");
    host.className = "ui-archive-list";
    let list = records
      .map((r, index) => ({ r, index }))
      .filter(({ r }) =>
        [r.title, r.champion, ...(r.groups || []).map((g) => g.name)]
          .join(" ")
          .toLowerCase()
          .includes(archiveSearch.toLowerCase()),
      );
    if (archiveSort === "old") list.reverse();
    if (archiveSort === "score")
      list.sort(
        (a, b) =>
          Number(b.r.groups?.[0]?.score || 0) -
          Number(a.r.groups?.[0]?.score || 0),
      );
    $("#uiArchiveCount").textContent =
      `显示 ${list.length} / ${records.length} 届`;
    host.innerHTML = list.length
      ? list
          .map(({ r, index }) => {
            const groups = Array.isArray(r.groups) ? r.groups : [];
            return `<article class="ui-panel ui-archive-card"><details><summary class="ui-archive-summary"><span class="ui-archive-emblem" aria-hidden="true">${icon("archive")}</span><div><span class="ui-eyebrow">CLASSROOM ARCHIVE · ${E(r.time || "时间未记录")}</span><h3>${E(r.title || "未命名比赛")}</h3><span class="ui-muted">${groups.length} 个归档小组 · 冠军 ${E(r.champion || groups[0]?.name || "未记录")}</span></div><span class="ui-chip">查看完整档案 ${icon("arrow")}</span></summary><div class="ui-podium">${groups
              .slice(0, 3)
              .map(
                (g, i) =>
                  `<div><span class="ui-chip">第 ${i + 1} 名${i === 0 ? " · 冠军" : ""}</span><strong>${E(g.name || "未记录名称")}</strong><span>${E(g.score ?? "未记录")} 分</span></div>`,
              )
              .join(
                "",
              )}</div><div class="ui-table-wrap"><table class="ui-table"><thead><tr><th>原档案名次</th><th>小组</th><th>最终积分</th><th>成员</th><th>道具与答题统计</th></tr></thead><tbody>${groups.map((g, i) => `<tr><td>${i + 1}</td><td>${E(g.name || "未记录")}</td><td>${E(g.score ?? "未记录")}</td><td>${E((g.members || []).join("、") || "未记录")}</td><td>${E(g.itemStats ? JSON.stringify(g.itemStats) : "此版本未提供统计")}</td></tr>`).join("")}</tbody></table></div><p class="ui-muted">名次沿用归档顺序；同分保留原始次序。缺少的旧档案字段不作推测。</p><details><summary>完整原始归档数据</summary><pre style="white-space:pre-wrap;overflow-wrap:anywhere;max-height:300px;overflow:auto">${E(JSON.stringify(r, null, 2))}</pre></details><div class="ui-archive-actions"><button class="btn btn-primary" data-csv="${index}">导出完整 CSV</button><button class="btn" data-json="${index}">导出原始 JSON</button><button class="btn btn-danger" data-delete="${index}">删除档案</button></div></details></article>`;
          })
          .join("")
      : empty(
          records.length ? "没有匹配的档案" : "第一座奖杯，等待揭晓",
          records.length
            ? "试试其他比赛或小组名称。"
            : "正式结算成功后，这里会保存比赛排名、成员及归档数据。",
        );
    if (archiveEntryPending) {
      archiveEntryPending = false;
      if (preferences.pageMotion) {
        host
          .querySelectorAll(".ui-archive-card:nth-child(-n+8),.ui-empty")
          .forEach((el, i) =>
            animate(
              el,
              [
                { opacity: 0, translate: "0 -8px" },
                { opacity: 1, translate: "0 0" },
              ],
              {
                delay: 60 + i * 35,
                duration: 220 / preferences.speed,
                fill: "backwards",
              },
            ),
          );
      }
    }
    host
      .querySelectorAll("[data-csv]")
      .forEach(
        (b) =>
          (b.onclick = () => exportSingleSettlementCSV(Number(b.dataset.csv))),
      );
    host
      .querySelectorAll("[data-delete]")
      .forEach(
        (b) =>
          (b.onclick = () => deleteSettlementRecord(Number(b.dataset.delete))),
      );
    host
      .querySelectorAll("[data-json]")
      .forEach(
        (b) =>
          (b.onclick = () =>
            downloadJson(records[Number(b.dataset.json)], "课堂归档.json")),
      );
  }
  function downloadJson(value, name) {
    const url = URL.createObjectURL(
        new Blob([JSON.stringify(value, null, 2)], {
          type: "application/json",
        }),
      ),
      a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const categories = GodPowerSettingsLayout.categories;
  function setupSettings() {
    const sc = $("#view-settings .settings-scroll");
    if (!sc || $("#uiSettingsShell")) return;
    const shell = document.createElement("div");
    shell.className = "ui-settings-shell";
    shell.id = "uiSettingsShell";
    shell.innerHTML = `<nav class="ui-settings-nav" aria-label="设置分类">${categories.map(([id, glyph, title]) => `<button data-category="${id}">${icon(glyph)}${title}</button>`).join("")}</nav><main class="ui-settings-body">${categories.map(([id, , title, desc]) => `<section class="ui-settings-category" data-category-panel="${id}" hidden><header class="ui-settings-title"><h3>${title}</h3><div class="ui-muted">${desc}</div></header></section>`).join("")}</main>`;
    const sections = Object.fromEntries(
      [...shell.querySelectorAll("[data-category-panel]")].map((p) => [
        p.dataset.categoryPanel,
        p,
      ]),
    );
    // Complete delayed legacy UI installers before moving their existing nodes.
    installCommunismModeSetting();
    installSfxVolumeSliderV2176();
    installClearItemsSettingV2172();
    const classified = [...sc.querySelectorAll("[data-settings-category]")];
    for (const pane of sc.querySelectorAll(".legacy-settings-pane")) {
      const id = pane.id.replace("settingsV26_", "");

      (sections[id === "function" ? "rules" : id] || sections.rules).append(
        pane,
      );
      pane.classList.add("active");
    }
    for (const el of classified)
      sections[el.dataset.settingsCategory].append(el);
    const buttonIcons = $("#uiIconManagerV26")?.parentElement;
    if (buttonIcons) sections.appearance.append(buttonIcons);
    $("#settingsV26Tabs")?.remove();
    sc.append(shell);
    sc.classList.add("ui-settings-host");
    shell
      .querySelectorAll("[data-category]")
      .forEach((b) => (b.onclick = () => selectSettings(b.dataset.category)));
    sections.appearance.insertAdjacentHTML(
      "beforeend",
      '<div class="ui-settings-row" data-settings-group="layout"><span id="uiSettingsZoomLabel">比赛视图缩放</span><div role="group" aria-labelledby="uiSettingsZoomLabel"><button class="btn btn-sm" aria-label="缩小视图" onclick="zoomOut()">−</button> <button class="btn btn-sm" onclick="zoomReset()">复位 100%</button> <button class="btn btn-sm" aria-label="放大视图" onclick="zoomIn()">＋</button></div></div>',
    );
    function row(title, id, content) {
      return `<div class="ui-settings-row"><label for="${id}">${title}</label>${content}</div>`;
    }
    const check = (key) =>
      `<input id="uiPref-${key}" data-pref="${key}" type="checkbox" ${preferences[key] ? "checked" : ""}>`;
    sections.motion.insertAdjacentHTML(
      "beforeend",
      row(
        "动效模式",
        "uiPref-motion",
        `<select id="uiPref-motion" data-pref="motion"><option value="full">完整动效</option><option value="simple">简洁动效</option><option value="off">关闭非必要动效</option></select>`,
      ) +
        row(
          "新界面过渡速度",
          "uiPref-speed",
          '<select id="uiPref-speed" data-pref="speed"><option value="0.75">舒缓</option><option value="1">标准</option><option value="1.5">快速</option></select>',
        ) +
        row("页面切换", "uiPref-pageMotion", check("pageMotion")) +
        row("道具视觉反馈", "uiPref-itemFx", check("itemFx")) +
        row(
          "尊重系统减少动态效果",
          "uiPref-systemMotion",
          check("systemMotion"),
        ) +
        '<p class="ui-muted">关闭非必要动效会停用页面与持续光环动画；音效开关仍由音频设置控制。</p>',
    );
    sections.welcome.insertAdjacentHTML(
      "beforeend",
      [
        ["knowledge", "每日知识卡片"],
        ["itemTip", "每日道具小知识"],
        ["honors", "历史荣誉"],
        ["challenge", "每日课堂挑战"],
        ["groupCruise", "小组卡片连续巡航（默认开启）"],
      ]
        .map(([key, label]) => row(label, "uiPref-" + key, check(key)))
        .join("") +
        row(
          "展示学科",
          "uiPref-subject",
          '<select id="uiPref-subject" data-pref="subject"></select>',
        ) +
        '<h3 style="margin-top:24px">本地审核题库</h3><p class="ui-muted">导入完整 JSON：knowledge、challenges 数组；每项需 id、title、subject、source。题目需 4 个 options、0–3 的 answer 和 explanation。请仅使用已审核内容并标明来源。</p><textarea id="uiBankEditor" class="ui-bank-editor" aria-label="本地题库 JSON"></textarea><div class="ui-toolbar"><button class="btn btn-primary" id="uiSaveBank">验证并保存题库</button><button class="btn" id="uiExportBank">导出题库</button><button class="btn btn-warning" id="uiResetBank">恢复内置示例</button></div><p id="uiBankStatus" role="status" class="ui-muted"></p>',
    );
    sections.data
      .querySelector(".ui-settings-title")
      .insertAdjacentHTML(
        "afterend",
        '<div class="ui-snapshot-note">本地管理口令用于防止误操作，不能作为真正的身份认证或数据加密。课堂备份不包含自定义音频；音频包请到“音效与音乐”中的迁移区单独导出。</div>',
      );
    const danger = [...sections.data.querySelectorAll("button")].filter((b) =>
      /resetAllScores|clear/.test(b.getAttribute("onclick") || ""),
    );
    for (const b of danger) {
      b.classList.remove("btn-primary");
      b.classList.add("btn-danger");
    }
    for (const key of ["motion", "speed"])
      $("#uiPref-" + key).value = String(preferences[key]);
    refreshSubjects();
    $("#uiBankEditor").value = JSON.stringify(bank, null, 2);
    shell.querySelectorAll("[data-pref]").forEach(
      (el) =>
        (el.onchange = () => {
          const key = el.dataset.pref;
          preferences[key] =
            el.type === "checkbox"
              ? el.checked
              : key === "speed"
                ? Number(el.value)
                : el.value;
          persistPreferences();
          applyPreferences();
          dailySignature = "";
          renderDaily();
        }),
    );
    $("#uiExportBank").onclick = () =>
      downloadJson(bank, "欢迎页审核题库.json");
    $("#uiSaveBank").onclick = () => {
      try {
        saveContentBank(JSON.parse($("#uiBankEditor").value));
        $("#uiBankStatus").textContent = "验证成功，题库已保存。";
      } catch (e) {
        $("#uiBankStatus").textContent =
          "未保存，现有题库保持原样：" + e.message;
      }
    };
    $("#uiResetBank").onclick = async () => {
      if (
        !(await themeConfirm("恢复内置审核示例？建议先导出当前题库。", {
          title: "恢复欢迎页题库",
          danger: true,
        }))
      )
        return;
      try {
        localStorage.removeItem("godpower_ui_bank_v1");
        bank = M.examples;
        dailyOffsets.knowledge = dailyOffsets.challenges = 0;
        renderBankEditor();
        $("#uiBankEditor").value = JSON.stringify(bank, null, 2);
        dailySignature = "";
        refreshSubjects();
        renderDaily();
        $("#uiBankStatus").textContent = "已恢复内置示例";
      } catch (e) {
        $("#uiBankStatus").textContent = "恢复失败：" + e.message;
      }
    };
    GodPowerSettingsLayout.organize(sections, shell, { query: $, escape: E });
    installSettingsSafetyGuard();
    SaveWorkspace.mount(sections.students);
    GameplayPage.mountAbout(sections.about);
    TeachingWorkspace.mount(sections.teaching, { storage: localStorage });

    TeachingResourceWorkspace.mount(sections.teaching, {
      storage: localStorage,
    });

    GodpowerTheme.mount(sections.appearance);
    UIComponentLibrary.mount(sections.appearance);
    if (window.ItemModuleSettings) ItemModuleSettings.mount(sections.items);
    const bankBody = $("#uiSettingsBank .ui-settings-detail-body");
    const structured = document.createElement("div");
    structured.id = "uiStructuredBank";
    bankBody.prepend(structured);
    renderBankEditor();
    selectSettings(activeSettings);
  }
  function saveContentBank(candidate) {
    const next = M.validateBank(candidate);
    localStorage.setItem("godpower_ui_bank_v1", JSON.stringify(next));
    bank = next;
    dailyOffsets.knowledge = dailyOffsets.challenges = 0;
    dailySignature = "";
    $("#uiBankEditor").value = JSON.stringify(bank, null, 2);
    refreshSubjects();
    renderDaily();
    renderBankEditor();
  }
  const contentBankEditor = GodPowerContentBankEditor.create({
    query: $,
    escape: E,
    getBank: () => bank,
    getSubject: () => preferences.subject,
    saveContentBank,
    themeConfirm: (...args) => themeConfirm(...args),
  });
  const renderBankEditor = contentBankEditor.render;
  function installSettingsSafetyGuard() {
    // Two UI-only destructive shortcuts lacked a confirmation. Preserve their commands.
    document.addEventListener(
      "click",
      async (event) => {
        const button = event.target.closest("button");
        const action = button?.getAttribute("onclick");
        const confirm = {
          "applySettingsBatchMembers()": [
            "重建小组与名单",
            "将按文本重建全部小组。未列出的组会移除，改名可能建立新组。请先导出课堂备份。确认应用？",
            applySettingsBatchMembers,
          ],
          "resetAllItemIcons()": [
            "恢复全部道具图片",
            "将移除所有自定义道具图片并恢复默认图片。建议先导出图标包。确认恢复？",
            resetAllItemIcons,
          ],
        }[action];
        if (!confirm) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        if (button.disabled) return;
        if (state.isLocked) {
          openPwdModal();
          return;
        }
        button.disabled = true;
        try {
          if (
            await themeConfirm(confirm[1], { title: confirm[0], danger: true })
          )
            confirm[2]();
        } finally {
          button.disabled = false;
        }
      },
      true,
    );
  }
  function refreshSubjects() {
    const el = $("#uiPref-subject");
    if (!el) return;
    const subjects = [
      ...new Set([
        "politics",
        ...bank.knowledge.map((x) => x.subject),
        ...bank.challenges.map((x) => x.subject),
      ]),
    ];
    el.innerHTML = subjects
      .map(
        (s) =>
          `<option value="${E(s)}">${E({ politics: "政治", history: "历史", geography: "地理", english: "英语" }[s] || s)}</option>`,
      )
      .join("");
    if (!subjects.includes(preferences.subject))
      preferences.subject = "politics";
    el.value = preferences.subject;
  }
  function cancelSettingsMotion() {
    for (const animation of settingsAnimations) {
      animation.cancel();
      animations.delete(animation);
    }
    settingsAnimations.clear();
  }
  function revealSettings(entering) {
    cancelSettingsMotion();
    if (currentView !== "settings" || !preferences.pageMotion || !canAnimate())
      return;
    const panel = $(`[data-category-panel="${activeSettings}"]`);
    if (!panel) return;
    const content = [...panel.children]
      .flatMap((node) =>
        node.matches(".legacy-settings-pane") ? [...node.children] : [node],
      )
      .filter((node) => !node.hidden);
    const targets = entering
      ? [$(".ui-settings-header"), $(".ui-settings-nav"), ...content]
      : content;
    const simple = preferences.motion === "simple";
    targets.forEach((node, i) => {
      const animation = animate(
        node,
        [
          {
            opacity: simple ? 0.6 : 0,
            translate: simple ? "0 -4px" : "0 -12px",
          },
          { opacity: 1, translate: "0 0" },
        ],
        {
          duration: (simple ? 140 : 260) / preferences.speed,
          delay:
            Math.min(i * (simple ? 15 : 50), simple ? 60 : 280) /
            preferences.speed,
          fill: "backwards",
        },
      );
      if (!animation) return;
      settingsAnimations.add(animation);
      animation.finished.then(
        () => settingsAnimations.delete(animation),
        () => settingsAnimations.delete(animation),
      );
    });
  }
  function selectSettings(id, entering = false) {
    if (!$("#uiSettingsShell")) return;
    const aliases = { function: "rules" };
    activeSettings = aliases[id] || id;
    if (!categories.some((c) => c[0] === activeSettings))
      activeSettings = "rules";
    document
      .querySelectorAll("[data-category-panel]")
      .forEach((p) => (p.hidden = p.dataset.categoryPanel !== activeSettings));
    document
      .querySelectorAll(".ui-settings-nav button")
      .forEach((b) =>
        b.setAttribute(
          "aria-current",
          String(b.dataset.category === activeSettings),
        ),
      );
    $(".ui-settings-body").scrollTop = 0;
    // Category entry owns refresh; compatibility navigation delegates here once.
    if (activeSettings === "sound") {
      renderBgmSlotList();
      renderFxSlotList();
      renderItemFxSoundListV26();
    }
    if (activeSettings === "teaching") {
      TeachingWorkspace.refresh();
      TeachingResourceWorkspace.refresh();
    }
    revealSettings(entering);
  }
  function setupDock() {
    const right = $(".dock-right");
    const details = document.createElement("details");
    details.className = "ui-dock-menu";
    details.innerHTML =
      '<summary>管理与视图 ▴</summary><div class="ui-dock-menu-body"></div>';
    const menu = details.lastElementChild;
    for (const b of [...right.children]) {
      const action = b.getAttribute("onclick") || "";
      const keep = /globalItemDraw|openHandRaise|openPickerModal|undoLast/.test(
        action,
      );
      const label = /globalItemDraw/.test(action)
        ? "道具"
        : /openHandRaise/.test(action)
          ? "举手"
          : /openPickerModal/.test(action)
            ? "点名"
            : /undoLast/.test(action)
              ? "撤销"
              : UI_ICON_TARGETS.find(([, , selector]) =>
                  b.matches(selector),
                )?.[1] ||
                b.getAttribute("title") ||
                b.textContent;
      b.setAttribute("aria-label", label);
      b.setAttribute("title", label);
      if (keep) {
        b.style.width = "auto";
        b.style.padding = "0 8px";
        b.innerHTML =
          icon(
            /globalItemDraw/.test(action)
              ? "gift"
              : /undoLast/.test(action)
                ? "history"
                : "users",
          ) + `<span style="font-size:12px">${E(label)}</span>`;
      } else {
        b.innerHTML =
          icon(
            /zoom/.test(action)
              ? "home"
              : /Lock/.test(action)
                ? "shield"
                : /addGroup|Search/.test(action)
                  ? "users"
                  : "book",
          ) + `<span>${E(label)}</span>`;
        menu.append(b);
      }
    }
    right.append(details);
    const final = $("#btnFinalSettlement");
    final.setAttribute("title", "归档成功后清零；操作前需确认");
    document.addEventListener(
      "click",
      (e) => {
        if (e.target.closest(".bottom-dock") && currentView !== "battle") {
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }
        if (!e.target.closest(".ui-dock-menu")) details.open = false;
      },
      true,
    );
  }
  function refreshLockControl(button) {
    if (!ready) return;
    const label = state.isLocked ? "解锁管理口令" : "管理已解锁";
    const original = icon("shield") + `<span>${label}</span>`;
    button.dataset.v26Original = original;
    const image = Reliability.safeImage(uiIconsV26().dock_lock);
    button.innerHTML = image
      ? `<img class="custom-ui-icon" src="${image}" alt=""><span>${label}</span>`
      : original;
    button.setAttribute("aria-label", label);
  }
  const disclosureMotion = GodPowerDisclosureMotion.create({
    animate,
    canAnimate,
    getPreferences: () => preferences,
  });
  const { settleDisclosures, setupDisclosures } = disclosureMotion;
  const modalClosers = {
    componentLibraryModal: () => UIComponentLibrary.close(),
    classroomShowcase: () => ClassroomFeedback.dismiss(),
    programConfirmV28: () => document.getElementById("pcCancelV28")?.click(),
    welcomeModal: () => closeWelcomeModal(),
    scoreModalBackdrop: () => closeScoreModal(),
    pwdModal: () => closePwdModal(),
    memberSearchBackdrop: () => closeMemberSearchModal(),
    settlementNameModal: () => closeSettlementNameModal(),
    grandModalOverlay: () => closeGrandSettlementModal(),
    pickerModal: () => closePickerModal(),
    itemModalBackdrop: () => closeItemWindow(),
    handRaiseBackdrop: () => closeHandRaise(),
    batchImportModal: () => closeBatchImportModal(),
    themeDialogV21727: () => closeThemeDialogV21727(false),
    quickPersonBackdropV218: () => closeQuickPersonScoreV218(),
  };
  const windowMotion = GodPowerWindowMotion.create({
    animate,
    canAnimate,
    motionEase,
    getPreferences: () => preferences,
  });
  const { dismissWindow, cancelWindowClose, finishWindowClose } = windowMotion;
  window.addEventListener(
    "beforeunload",
    () => {
      disclosureMotion.dispose();
      windowMotion.dispose();
    },
    { once: true },
  );
  let openStack = [],
    modalLayer = 300000;
  function setupModals() {
    const known = new Map();
    function focusModal(top) {
      if (
        !top.el.getClientRects().length ||
        top.el.contains(document.activeElement)
      )
        return;
      const target = [
        ...top.el.querySelectorAll(
          'input:not([type=hidden]),button,select,textarea,[tabindex="0"]',
        ),
      ].find((el) => !el.disabled && el.getClientRects().length);
      if (target) target.focus({ preventScroll: true });
    }
    document.addEventListener(
      "focusin",
      (event) => {
        const top = openStack.at(-1);
        if (top && !top.el.contains(event.target)) focusModal(top);
      },
      true,
    );
    function forgetModal(id) {
      known.set(id, false);
      const item = openStack.find((x) => x.id === id);
      openStack = openStack.filter((x) => x.id !== id);
      if (item?.el) {
        delete item.el.dataset.uiModalOpen;
        item.el.style.zIndex = item.previousZ;
        if (item.previousLayer)
          item.el.style.setProperty("--ui-modal-layer", item.previousLayer);
        else item.el.style.removeProperty("--ui-modal-layer");
      }
      const top = openStack.at(-1);
      if (top) {
        if (item?.focus?.isConnected && top.el.contains(item.focus))
          item.focus.focus({ preventScroll: true });
        else focusModal(top);
      } else if (
        item?.focus?.isConnected &&
        !item.focus.closest(".view:not(.active)")
      )
        item.focus.focus({ preventScroll: true });
      cancelAnimations();
    }
    function scan(ids = Object.keys(modalClosers)) {
      for (const id of ids) {
        const close = modalClosers[id];
        const el = document.getElementById(id);
        if (
          known.get(id) &&
          openStack.find((item) => item.id === id)?.el !== el
        )
          forgetModal(id);
        if (!el) continue;
        const visible =
          !el.hasAttribute("data-external-picker") &&
          (el.open ||
            el.classList.contains("active") ||
            el.classList.contains("show") ||
            el.style.display === "flex" ||
            (id === "programConfirmV28" && el.getClientRects().length > 0));
        if (visible) {
          const surface =
            el.querySelector(".ui-function-surface") || el.firstElementChild;
          if (surface) {
            for (const old of surface.querySelectorAll(
              'button[onclick*="close"]',
            )) {
              if (!/取消|跳过|返回课堂/.test(old.textContent))
                old.hidden = true;
            }
            if (!surface.querySelector(":scope > [data-ui-window-close]")) {
              const button = document.createElement("button");
              button.type = "button";
              button.className = "item-close ui-window-close";
              button.dataset.uiWindowClose = "true";
              button.setAttribute("aria-label", "关闭窗口");
              button.title = "关闭窗口（Esc）";
              button.textContent = "×";
              button.onclick = close;
              surface.append(button);
            }
          }
        }
        if (visible && !known.get(id)) {
          const focus = document.activeElement;
          known.set(id, true);
          const previousZ = el.style.zIndex;
          const previousLayer = el.style.getPropertyValue("--ui-modal-layer");
          const layer = String(++modalLayer);
          el.style.zIndex = layer;
          el.style.setProperty("--ui-modal-layer", layer);
          openStack.push({ id, el, close, focus, previousZ, previousLayer });
          const dialog =
            el.firstElementChild?.tagName === "CANVAS"
              ? el.querySelector(".grand-card")
              : el.firstElementChild;
          dialog?.setAttribute("role", "dialog");
          dialog?.setAttribute("aria-modal", "true");
          if (
            dialog &&
            !dialog.getAttribute("aria-label") &&
            !dialog.getAttribute("aria-labelledby")
          )
            dialog.setAttribute(
              "aria-label",
              dialog.querySelector("h3,h2,[class*=title]")?.textContent ||
                "课堂操作窗口",
            );
          dialog?.classList.add("ui-function-surface");
          el.dataset.uiModalOpen = "true";
          if (dialog && id !== "grandModalOverlay" && preferences.pageMotion) {
            const zoom = Number(getComputedStyle(document.body).zoom) || 1;
            const travel = Math.min(
              preferences.motion === "full" ? 42 : 8,
              Math.max(
                0,
                (innerHeight - dialog.getBoundingClientRect().bottom) / zoom -
                  4,
              ),
            );
            animate(
              dialog,
              [
                {
                  opacity: 0,
                  translate: `0 ${travel}px`,
                  scale: preferences.motion === "full" ? ".97" : "1",
                },
                { opacity: 1, translate: "0 0", scale: "1" },
              ],
              {
                duration:
                  (preferences.motion === "full" ? 420 : 160) /
                  preferences.speed,
                easing: "cubic-bezier(.16,1,.3,1)",
                fill: "backwards",
              },
            );
          }
          if (id === "grandModalOverlay") {
            if (!canAnimate()) stopConfetti();
            el.querySelectorAll(".podium-col").forEach((col, i) =>
              animate(
                col,
                [
                  { opacity: 0, translate: "0 10px" },
                  { opacity: 1, translate: "0 0" },
                ],
                { delay: i * 100, duration: 220 },
              ),
            );
            animate(dialog, [
              { opacity: 0, translate: "0 12px" },
              { opacity: 1, translate: "0 0" },
            ]);
          }
          queueMicrotask(() => {
            const top = openStack.at(-1);
            if (top?.el === el) focusModal(top);
          });
        } else if (!visible && known.get(id)) {
          forgetModal(id);
        }
      }
    }
    const modalSelector = Object.keys(modalClosers)
      .map((id) => `#${id}`)
      .join(",");
    new MutationObserver((records) => {
      const ids = new Set();
      for (const record of records) {
        // Global visibility changes can affect an already-open window. Ordinary
        // card/reel/effect mutations must not scan every unrelated dialog.
        if (record.type === "attributes" && record.target === document.body) {
          Object.keys(modalClosers).forEach((id) => ids.add(id));
          continue;
        }
        const owner = record.target.closest?.(modalSelector);
        if (owner) ids.add(owner.id);
        if (record.type === "childList") {
          for (const node of [...record.addedNodes, ...record.removedNodes]) {
            if (node.matches?.(modalSelector)) ids.add(node.id);
            node
              .querySelectorAll?.(modalSelector)
              .forEach((el) => ids.add(el.id));
          }
        }
      }
      if (ids.size) scan(ids);
    }).observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class", "style", "open", "data-external-picker"],
    });
    document.addEventListener(
      "keydown",
      (e) => {
        const top = openStack.at(-1);
        if (!top) return;
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopImmediatePropagation();
          top.close();
          return;
        }
        if (e.key === "Tab") {
          const nodes = [
            ...top.el.querySelectorAll(
              'button,input,select,textarea,a[href],[tabindex="0"]',
            ),
          ].filter(
            (x) => !x.disabled && !x.hidden && x.getClientRects().length,
          );
          if (!nodes.length) {
            e.preventDefault();
            return;
          }
          const first = nodes[0],
            last = nodes.at(-1);
          if (
            e.shiftKey &&
            (document.activeElement === first ||
              !top.el.contains(document.activeElement))
          ) {
            e.preventDefault();
            last.focus();
          } else if (
            !e.shiftKey &&
            (document.activeElement === last ||
              !top.el.contains(document.activeElement))
          ) {
            e.preventDefault();
            first.focus();
          }
        }
      },
      true,
    );
    scan();
  }
  let pickerGeneration = 0,
    pickerPreparing = false,
    pickerRevealing = false;
  let pickerRevealDeadline = null;
  const pickerRevealAnimations = [];
  const pickerReelRestores = [];
  function clearPickerReveal() {
    if (pickerRevealDeadline) {
      clearTimeout(pickerRevealDeadline.timer);
      pickerRevealDeadline.resolve();
      pickerRevealDeadline = null;
    }
    for (const animation of pickerRevealAnimations.splice(0))
      animation.cancel();
    pickerRevealing = false;
    $("#pickerModal")?.removeAttribute("data-picker-reveal");
    for (const restore of pickerReelRestores.splice(0)) restore();
  }
  function cancelPickerPreparation() {
    pickerGeneration++;
    pickerPreparing = false;
    clearPickerReveal();
    ClassroomFeedback.clearLive();
    ClassroomFeedback.cancel();
    BattleMotion.clear();
    const button = $("#btnSlotTrigger");
    if (button) {
      button.disabled = false;
      button.removeAttribute("aria-busy");
      if (!slotEngine.isSpinning) button.textContent = "开始抽签";
    }
    const modal = $("#pickerModal");
    for (const a of animations)
      if (modal?.contains(a.effect?.target)) a.cancel();
  }
  function isPickerCurrent(generation) {
    return (
      generation === pickerGeneration &&
      $("#pickerModal").classList.contains("active")
    );
  }
  async function togglePicker() {
    if (pickerPreparing || pickerRevealing) return false;
    if (slotEngine.isSpinning) {
      stopSlotSpin();
      return true;
    }
    const generation = ++pickerGeneration;
    pickerPreparing = true;
    const button = $("#btnSlotTrigger");
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    button.textContent = "准备抽签…";
    try {
      await toggleSlotSpin();
      return slotEngine.isSpinning;
    } catch (error) {
      showToast("抽签未启动：" + error.message);
      return false;
    } finally {
      if (generation === pickerGeneration) {
        pickerPreparing = false;
        button.disabled = false;
        button.removeAttribute("aria-busy");
        if (!slotEngine.isSpinning) button.textContent = "开始抽签";
      }
    }
  }
  function pickerStopped() {
    const win = slotEngine.chosenResult,
      generation = pickerGeneration;
    const modal = $("#pickerModal"),
      badge = $("#slotSubBadge"),
      button = $("#btnSlotTrigger");
    if (!win || !modal.classList.contains("active")) return;
    clearPickerReveal();
    const label = badge.textContent;
    const complete = () => {
      if (
        !isPickerCurrent(generation) ||
        slotEngine.chosenResult !== win ||
        slotEngine.isSpinning
      )
        return;
      clearPickerReveal();
      button.disabled = false;
      button.textContent = "开始抽签";
      button.removeAttribute("aria-busy");
      badge.textContent = label + " · 抽取完成";
      pickerChanged();
      window.GodpowerPicker?.notify("revealed");
      ClassroomFeedback.picked(win, state.picker.mode);
    };
    if (!canAnimate()) {
      globalThis.HandItemCinematic?.dismiss();
      ClassroomFeedback.clearLive();
      complete();
      return;
    }
    pickerRevealing = true;
    // Native reels must not depend on WAAPI in the hidden/minimized main window.
    // Cancellation resolves animation.finished early; a paused timeline may never
    // resolve it. This owned deadline preserves the one-second reveal contract.
    const minimumReveal = new Promise((resolve) => {
      const owner = { resolve, timer: null };
      owner.timer = setTimeout(() => {
        if (pickerRevealDeadline === owner) pickerRevealDeadline = null;
        resolve();
      }, 1000);
      pickerRevealDeadline = owner;
    });
    modal.dataset.pickerReveal = "pending";
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    button.textContent = "减速中…";
    badge.textContent = "正在减速，结果即将揭晓…";
    pickerChanged();
    const pending = [],
      pendingActual = [];
    modal.querySelectorAll(".slot-reel-frame").forEach((frame) => {
      if (!frame.getClientRects().length) return;
      const actual = frame.querySelector(".slot-reel-text");
      const isGroup = frame.id === "reelFrameGroup";
      const live = ClassroomFeedback.takeLive(frame);
      const candidates = isGroup
        ? state.groups.map((g) => ({ raw: g.name, group: g }))
        : state.groups.flatMap((g) =>
            (g.members || []).map((raw) => ({ raw, group: g })),
          );
      const height = frame.clientHeight;
      const strip = document.createElement("div");
      strip.className = "ui-slot-deceleration";
      strip.setAttribute("aria-hidden", "true");
      // Display-only cycle: never consume or replace the business RNG.
      for (let i = 0; i < 7; i++) {
        const row = document.createElement("span");
        const list = live?.rows || candidates;
        const candidate =
          list[((live?.index || 0) + i) % Math.max(1, list.length)];
        if (i === 6 || !candidate) {
          for (const node of actual.childNodes)
            row.append(node.cloneNode(true));
        } else if (isGroup) {
          row.textContent = candidate.raw;
        } else {
          // Reuse the existing escaped student/colored-number renderer.
          row.innerHTML = studentLabelHTMLV218(candidate.raw, candidate.group);
        }
        row.style.height = height + "px";
        strip.append(row);
      }
      const visibility = live ? live.visibility : actual.style.visibility;
      pendingActual.push(actual);
      actual.style.visibility = "hidden";
      frame.append(strip);
      pickerReelRestores.push(() => {
        strip.remove();
        actual.style.visibility = visibility;
      });
      const a = animate(
        strip,
        [
          { transform: `translateY(-${(live?.fraction || 0) * height}px)` },
          { transform: `translateY(-${height * 6}px)` },
        ],
        {
          duration: 1000,
          easing: "cubic-bezier(.2,.4,.3,1)",
          fill: "forwards",
        },
      );
      if (a) {
        pickerRevealAnimations.push(a);
        pending.push(a.finished.catch(() => {}));
      }
    });
    ClassroomFeedback.clearLive();
    // clearLive restores the legacy name; keep it hidden behind the settling strip.
    pendingActual.forEach((e) => (e.style.visibility = "hidden"));
    (window.GodpowerPicker?.isExternalPresentation()
      ? minimumReveal
      : Promise.all([minimumReveal, ...pending])
    ).then(complete);
  }
  function pickerChanged() {
    const target = pickerTargetGroup();
    const valid =
      !!target &&
      state.groups.some((g) => g.id === target.id) &&
      !slotEngine.isSpinning &&
      !pickerRevealing;
    document
      .querySelectorAll('#pickerModal button[onclick^="scorePicker"]')
      .forEach((b) => (b.disabled = !valid));
    if (valid)
      animate(
        $("#slotResultPanel"),
        [
          { opacity: 0.4, scale: ".98" },
          { opacity: 1, scale: "1" },
        ],
        { duration: 250 },
      );
  }
  function setupPicker() {
    const left = $(".picker-left"),
      right = $(".picker-right");
    const options = $(".slot-options-row");
    left.append(options);
    const tabs = $(".picker-info-tabs"),
      info = $("#pickerInfoBox");
    right.append(tabs, info);
    const stats = $("#pickerStatsBtn");
    stats.hidden = false;
    stats.removeAttribute("aria-hidden");
    stats.removeAttribute("tabindex");
    $("#resultHeadline").style.fontSize = "26px";
    const target = $("#pickerScoreTarget");
    new MutationObserver(pickerChanged).observe(target, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    pickerChanged();
  }
  let settlementBusy = false,
    settlementGeneration = 0;
  function prepareSettlement() {
    settlementGeneration++;
    const status = $("#uiSettlementStatus");
    if (status) status.textContent = "先完整归档，保存成功后才会清零。";
  }
  function cancelSettlement() {
    settlementGeneration++;
  }
  async function settleFromUI(button) {
    if (settlementBusy) return { ok: false, reason: "busy" };
    const generation = settlementGeneration;
    settlementBusy = true;
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    const text = button.textContent;
    button.textContent = "正在保存完整档案…";
    const status = $("#uiSettlementStatus");
    if (status) status.textContent = "正在写入归档，保存成功后才会清零。";
    try {
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );
      if (
        generation !== settlementGeneration ||
        !$("#settlementNameModal").classList.contains("active")
      ) {
        if (generation === settlementGeneration && status)
          status.textContent = "已取消，未执行归档。";
        return { ok: false, reason: "cancelled" };
      }
      const result = confirmFinalSettlement();
      if (status)
        status.textContent = result?.ok
          ? "完整档案已保存。"
          : "保存未完成，课堂数据保留，请先导出备份。";
      return result;
    } finally {
      settlementBusy = false;
      button.disabled = false;
      button.removeAttribute("aria-busy");
      button.textContent = text;
    }
  }
  function init() {
    try {
      const value = JSON.parse(
        localStorage.getItem("godpower_ui_preferences_v1") || "{}",
      );
      for (const key of Object.keys(defaults)) {
        if (typeof value[key] === typeof defaults[key])
          preferences[key] = value[key];
      }
      // Older releases saved the old default false without recording an explicit choice.
      // Start the new continuous mode once; subsequent explicit opt-outs remain saved.
      if (value.groupCruiseVersion !== 2) preferences.groupCruise = true;
      preferences.groupCruiseVersion = 2;
      if (!["full", "simple", "off"].includes(preferences.motion))
        preferences.motion = "full";
      if (![0.75, 1, 1.5].includes(preferences.speed)) preferences.speed = 1;
      const saved = localStorage.getItem("godpower_ui_bank_v1");
      if (saved) bank = M.validateBank(JSON.parse(saved));
    } catch (e) {
      console.warn("UI preferences use defaults:", e.name);
    }
    applyPreferences();
    syncViewport();
    window.addEventListener("resize", syncViewport);
    matchMedia("(prefers-reduced-motion: reduce)").addEventListener(
      "change",
      () => {
        if (!canAnimate()) cancelAnimations();
      },
    );
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimations();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && currentView === "settings")
        cancelSettingsMotion();
    });
    ready = true;
    const navigation = {
      welcome: ["欢迎", "home"],
      battle: ["比赛", "battle"],
      gameplay: ["玩法", "gift"],
      history: ["历史", "history"],
      archives: ["档案", "archive"],
      settings: ["设置", "settings"],
    };
    document.querySelectorAll(".nav-tab").forEach((b) => {
      const [text, glyph] = navigation[b.dataset.view] || [
        b.textContent,
        "home",
      ];
      b.innerHTML = icon(glyph) + `<span>${text}</span>`;
      b.setAttribute("role", "tab");
    });
    setupDock();
    UI_ICON_TARGETS.forEach(([, , selector]) => {
      const el = $(selector);
      if (el) el.dataset.v26Original = el.innerHTML;
    });
    applyUiIconsV26();
    setupSettings();
    setupPicker();
    setupModals();
    ClassroomFeedback.init();
    setupDisclosures();
    $("#settlementHistoryContainer").addEventListener(
      "toggle",
      (event) => {
        const details = event.target;
        if (details.tagName !== "DETAILS") return;
        if (!details.open) {
          for (const a of animations)
            if (details.contains(a.effect?.target)) a.cancel();
          return;
        }
        details.querySelectorAll(".ui-podium>div").forEach((el, i) =>
          animate(
            el,
            [
              { opacity: 0, translate: "0 8px" },
              { opacity: 1, translate: "0 0" },
            ],
            { delay: i * 70, duration: 200 },
          ),
        );
      },
      true,
    );
    const t = $("#uiGroupTrack");
    t.addEventListener("scroll", updateArrows, { passive: true });
    t.addEventListener(
      "wheel",
      (e) => {
        if (
          t.scrollWidth <= t.clientWidth + 2 ||
          Math.abs(e.deltaX) > Math.abs(e.deltaY) ||
          e.ctrlKey
        )
          return;
        const next = Math.max(
          0,
          Math.min(t.scrollWidth - t.clientWidth, t.scrollLeft + e.deltaY),
        );
        if (next !== t.scrollLeft) {
          e.preventDefault();
          t.scrollLeft = next;
        }
      },
      { passive: false },
    );
    $("#uiGroupPrev").onclick = () =>
      t.scrollBy({ left: -600, behavior: canAnimate() ? "smooth" : "auto" });
    $("#uiGroupNext").onclick = () =>
      t.scrollBy({ left: 600, behavior: canAnimate() ? "smooth" : "auto" });
    new ResizeObserver(updateArrows).observe(t);
    $("#uiArchiveSearch").oninput = (e) => {
      archiveSearch = e.target.value;
      renderArchives();
    };
    $("#uiArchiveSort").onchange = (e) => {
      archiveSort = e.target.value;
      renderArchives();
    };
    viewChanged(currentView);
    renderWelcome();
    renderHistory();
    renderArchives();
    if (canAnimate()) {
      document
        .querySelectorAll(
          ".ui-welcome-head,.ui-group-card,.ui-daily-grid .ui-panel",
        )
        .forEach((el, i) =>
          animate(
            el,
            [
              { opacity: 0, translate: "0 10px" },
              { opacity: 1, translate: "0 0" },
            ],
            { delay: Math.min(i * 40, 550), duration: 250 },
          ),
        );
    }
    if (canAnimate())
      animate(
        $(".welcome-enter-btn"),
        [
          { opacity: 0.5, scale: ".98" },
          { opacity: 1, scale: "1" },
        ],
        { delay: 650, duration: 180 },
      );
    $("#uiSkipWelcome").onclick = () => cancelAnimations();
  }
  return {
    init,
    dismissWindow,
    cancelWindowClose,
    finishWindowClose,
    getClosingWindowCount: windowMotion.count,
    settleFromUI,
    prepareSettlement,
    cancelSettlement,
    syncViewport,
    refreshLockControl,
    renderDaily,
    renderWelcome,
    renderHistory,
    renderArchives,
    viewChanged,
    selectSettings,
    pickerChanged,
    togglePicker,
    pickerStopped,
    cancelPickerPreparation,
    getPickerGeneration: () => pickerGeneration,
    isPickerCurrent,
    visualEvent,
    cancelAnimations,
    icon,
    getPreferences: () => ({ ...preferences }),
    setGroupCruise: (enabled) => {
      preferences.groupCruise = !!enabled;
      const control = $("#uiPref-groupCruise");
      if (control) control.checked = preferences.groupCruise;
      const saved = persistPreferences();
      applyPreferences();
      return saved;
    },
    getAnimationCount: () =>
      animations.size + (pageMotionFrame !== null ? 1 : 0),
    getSettingsMotionCount: () => settingsAnimations.size,
    getDisclosureMotionCount: disclosureMotion.count,
    isPickerRevealing: () => pickerRevealing,
  };
})();
window.addEventListener("DOMContentLoaded", DesktopUI.init, { once: true });
