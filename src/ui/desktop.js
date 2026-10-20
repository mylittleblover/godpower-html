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
      .querySelectorAll(".card-fx-badge,.attack-hit-badge-v2116")
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
    $(".dock-humor-tip-v2185")?.classList.remove("show");
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
          plugins:
            ".plugin-center-header,.plugin-center-status,.plugin-center-grid > *,#pluginWorkspace > *",
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
    if (name === "welcome") renderWelcome();
    if (name === "settings") selectSettings(activeSettings, true);
  }
  function renderWelcome() {
    if (!ready) return;
    const track = $("#uiGroupTrack");
    if (!track) return;
    syncViewport();
    observeVisualState();
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
          if (quizAttempt.correct) {
            host.querySelector("#uiNextChallenge").disabled = false;
            host.querySelector("#uiNextChallenge").textContent = "下一题";
          }
          host.querySelector(".ui-quiz-result").textContent =
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
  const categories = [
    ["rules", "battle", "课堂与比赛规则", "沿用现有规则与即时保存方式"],
    ["appearance", "home", "外观与界面", "壁纸、显示模式与视图比例"],
    ["motion", "spark", "动画与特效", "可中断的界面动效，不影响业务结果"],
    [
      "sound",
      "sound",
      "音效与音乐",
      "日常音量在上方，音乐、音效和迁移维护按需展开",
    ],
    [
      "students",
      "users",
      "学生与小组管理",
      "查看并维护整班小组名单，重建前会再次确认",
    ],
    ["welcome", "book", "欢迎页内容管理", "完全离线、按自然日稳定轮换"],
    ["data", "shield", "数据与安全", "备份、恢复与防误操作管理口令"],
  ];
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
    for (const pane of sc.querySelectorAll(".settings-v26-pane")) {
      const id = pane.id.replace("settingsV26_", "");
      if (id === "items") pane.hidden = true;
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
    organizeSettings(sections, shell);
    GodpowerTheme.mount(sections.appearance);
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
  function renderBankEditor() {
    const host = $("#uiStructuredBank");
    if (!host) return;
    host.innerHTML = `<p class="ui-muted">知识 ${bank.knowledge.length} 条 · 挑战 ${bank.challenges.length} 条，合计最多 500 条。保存后立即生效，不影响课堂积分。</p><div class="ui-toolbar"><button class="btn" data-bank-add="knowledge">添加知识</button><button class="btn" data-bank-add="challenges">添加挑战</button><label class="btn" for="uiBankFile">导入 JSON 文件</label><input id="uiBankFile" type="file" accept=".json,application/json" aria-label="导入题库 JSON 文件"></div><div id="uiBankForm"></div>${["knowledge", "challenges"].map((kind) => `<section><h4>${kind === "knowledge" ? "知识卡片" : "课堂挑战"}</h4>${bank[kind].length ? bank[kind].map((row, index) => `<div class="ui-settings-row"><div><b>${E(row.title)}</b><p class="ui-muted">${E(row.subject)} · ${E(row.id)}</p></div><div class="ui-toolbar"><button class="btn btn-sm" data-bank-edit="${kind}" data-index="${index}">编辑</button><button class="btn btn-sm btn-danger" data-bank-delete="${kind}" data-index="${index}">删除</button></div></div>`).join("") : '<p class="ui-muted">暂无内容，点击上方按钮添加。</p>'}</section>`).join("")}`;
    host
      .querySelectorAll("[data-bank-add]")
      .forEach(
        (button) =>
          (button.onclick = () => editBankRow(button.dataset.bankAdd)),
      );
    host
      .querySelectorAll("[data-bank-edit]")
      .forEach(
        (button) =>
          (button.onclick = () =>
            editBankRow(button.dataset.bankEdit, Number(button.dataset.index))),
      );
    host.querySelectorAll("[data-bank-delete]").forEach(
      (button) =>
        (button.onclick = async () => {
          const kind = button.dataset.bankDelete,
            index = Number(button.dataset.index),
            row = bank[kind][index];
          if (
            !(await themeConfirm("删除“" + row.title + "”？", {
              title: "删除题库内容",
              danger: true,
            }))
          )
            return;
          try {
            const next = JSON.parse(JSON.stringify(bank));
            // Resolve by id after confirmation in case another edit changed ordering.
            next[kind] = next[kind].filter((value) => value.id !== row.id);
            saveContentBank(next);
            $("#uiBankStatus").textContent = "内容已删除。";
          } catch (error) {
            $("#uiBankStatus").textContent = "删除失败：" + error.message;
          }
        }),
    );
    $("#uiBankFile").onchange = async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        if (file.size > 16 * 1024 * 1024) throw Error("文件不能超过 16 MB");
        saveContentBank(JSON.parse(await file.text()));
        $("#uiBankStatus").textContent = "文件已验证并导入。";
      } catch (error) {
        $("#uiBankStatus").textContent =
          "未导入，现有题库保持原样：" + error.message;
        event.target.value = "";
      }
    };
  }
  function editBankRow(kind, index = -1) {
    const row =
      index < 0
        ? {
            id: "",
            subject: preferences.subject,
            title: "",
            source: "",
            options: ["", "", "", ""],
            answer: 0,
          }
        : bank[kind][index];
    const fields =
      kind === "knowledge"
        ? [
            ["id", "唯一 ID"],
            ["subject", "学科"],
            ["title", "知识标题"],
            ["module", "模块"],
            ["summary", "知识摘要"],
            ["mistake", "易错点"],
            ["detail", "详细解释"],
            ["source", "来源"],
          ]
        : [
            ["id", "唯一 ID"],
            ["subject", "学科"],
            ["title", "题目"],
            ["source", "来源"],
            ["explanation", "答案解析"],
          ];
    const host = $("#uiBankForm");
    host.innerHTML = `<form class="ui-panel" id="uiBankRowForm"><h4>${index < 0 ? "添加" : "编辑"}${kind === "knowledge" ? "知识" : "挑战"}</h4>${fields.map(([key, label]) => `<label class="ui-settings-row" for="uiBankField-${key}"><span>${label}</span><textarea class="ui-bank-field" style="width:65%;min-height:44px;resize:vertical" id="uiBankField-${key}" name="${key}" maxlength="10000" ${["id", "subject", "title", "source"].includes(key) ? "required" : ""}>${E(row[key] || "")}</textarea></label>`).join("")}${kind === "challenges" ? row.options.map((value, i) => `<label class="ui-settings-row" for="uiBankOption-${i}"><span>选项 ${"ABCD"[i]}</span><input id="uiBankOption-${i}" name="option${i}" value="${E(value)}" maxlength="10000" required></label>`).join("") + `<label class="ui-settings-row" for="uiBankAnswer"><span>正确答案</span><select id="uiBankAnswer" name="answer">${[0, 1, 2, 3].map((i) => `<option value="${i}" ${row.answer === i ? "selected" : ""}>${"ABCD"[i]}</option>`).join("")}</select></label>` : ""}<div class="ui-toolbar"><button class="btn btn-primary" type="submit">保存内容</button><button class="btn" type="button" id="uiBankCancel">取消</button></div><p id="uiBankFormStatus" role="status"></p></form>`;
    $("#uiBankCancel").onclick = () => host.replaceChildren();
    $("#uiBankRowForm").onsubmit = (event) => {
      event.preventDefault();
      try {
        const data = new FormData(event.target),
          edited = { ...row };
        fields.forEach(([key]) => (edited[key] = String(data.get(key)).trim()));
        if (kind === "challenges") {
          edited.options = [0, 1, 2, 3].map((i) =>
            String(data.get("option" + i)).trim(),
          );
          edited.answer = Number(data.get("answer"));
        }
        const next = JSON.parse(JSON.stringify(bank));
        if (index < 0) next[kind].push(edited);
        else next[kind][index] = edited;
        saveContentBank(next);
        $("#uiBankStatus").textContent = "内容已保存。";
      } catch (error) {
        $("#uiBankFormStatus").textContent = "未保存：" + error.message;
      }
    };
    $("#uiBankField-title").focus();
  }
  function organizeSettings(sections, shell) {
    function group(
      parent,
      id,
      title,
      description,
      nodes,
      collapsed = false,
      danger = false,
    ) {
      const box = document.createElement(collapsed ? "details" : "div");
      box.id = id;
      box.className = collapsed
        ? "ui-settings-disclosure"
        : "ui-settings-group";
      if (danger) box.classList.add("ui-danger-zone");
      box.innerHTML = collapsed
        ? `<summary><b>${E(title)}</b><span>${E(description)}</span></summary><div class="ui-settings-detail-body"></div>`
        : `<h4>${E(title)}</h4><p class="ui-muted">${E(description)}</p><div></div>`;
      const body = box.lastElementChild;
      nodes.filter(Boolean).forEach((node) => body.append(node));
      parent.append(box);
      return box;
    }
    const marked = (name) => [
      ...shell.querySelectorAll(`[data-settings-group="${name}"]`),
    ];
    group(
      sections.rules,
      "uiSettingsRules",
      "课堂行为",
      "沿用原道具开关与 All In 保留规则，修改后即时保存。",
      [$("#settingsV26_function"), ...marked("rules")],
    );
    group(
      sections.appearance,
      "uiSettingsWallpaper",
      "界面壁纸",
      "图片与浅色遮罩保存在本机。",
      marked("wallpaper"),
    );
    // The standalone legacy heading duplicated the new group title.
    $("#uiSettingsWallpaper .setting-section-title")?.remove();
    group(
      sections.appearance,
      "uiSettingsLayout",
      "比赛显示与空间",
      "沿用原分栏、缩放与可拖拽高度垫片，不改变比赛页尺寸。",
      marked("layout"),
    );
    const icons = $("#uiIconManagerV26")?.parentElement;
    if (icons)
      group(
        sections.appearance,
        "uiSettingsButtonIcons",
        "按钮图标自定义",
        "低频维护 · 导航与课堂工具图标",
        [icons],
        true,
      );
    group(
      sections.students,
      "uiSettingsRoster",
      "小组与成员名单",
      "按组名匹配已有小组；未列出的组不保留，重命名可能建立新组。请先备份后应用。",
      marked("roster"),
    );
    const rosterTitle = $(
      "#uiSettingsRoster [data-settings-group='roster']:not(.setting-item)",
    );
    rosterTitle?.remove();
    const sound = $("#settingsV26_sound");
    const itemSounds = $("#itemFxSoundListV26")?.parentElement;
    if (itemSounds) itemSounds.hidden = true;
    group(
      sound,
      "uiSettingsVolume",
      "日常音量",
      "主音量控制全部声音，音效音量在主音量基础上单独调整。",
      [...marked("volume"), $("#sfxVolumeRowV2176")],
    );
    group(
      sound,
      "uiSettingsMusic",
      "音乐套与音轨",
      "维护 8 套比赛配乐或菜单配乐 · 展开后选择音乐套",
      marked("music"),
      true,
    );
    group(
      sound,
      "uiSettingsBaseFx",
      "基础操作与欢庆音效",
      "试听、上传及还原各个基础音效",
      marked("basefx"),
      true,
    );
    // Gameplay-specific item audio is owned by the Miyamoto plugin workspace.
    // Keep transfer at the end and never promote it into the global header.
    sound.append($("#uiAudioTransfer"));
    const editor = $("#uiBankEditor");
    const bankNodes = [
      editor.previousElementSibling.previousElementSibling,
      editor.previousElementSibling,
      editor,
      editor.nextElementSibling,
      $("#uiBankStatus"),
    ];
    group(
      sections.welcome,
      "uiSettingsBank",
      "本地题库维护",
      "低频维护 · 编辑、导出或恢复内置示例",
      bankNodes,
      true,
    );
    const data = $("#settingsV26_data");
    group(
      data,
      "uiSettingsBackup",
      "课堂数据备份",
      "换设备或执行危险操作前，先导出课堂 JSON 备份。",
      marked("backup"),
    );
    group(
      data,
      "uiSettingsLock",
      "管理口令",
      "仅用于本机防误操作。",
      marked("lock"),
    );
    group(
      data,
      "uiSettingsDanger",
      "危险操作",
      "积分清零与道具清空 · 操作前请备份",
      [...marked("danger"), $("#clearAllItemsV2172")],
      true,
      true,
    );
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
        node.matches(".settings-v26-pane") ? [...node.children] : [node],
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
    if (id === "items") {
      switchView("plugins/official.miyamotos-power/items");
      return;
    }
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
  const disclosureMotions = new Map();
  function settleDisclosure(details) {
    const entry = disclosureMotions.get(details);
    if (!entry) return;
    disclosureMotions.delete(details);
    entry.animation?.cancel();
    details.style.overflow = entry.overflow;
    details.open = entry.open;
  }
  function settleDisclosures() {
    for (const details of disclosureMotions.keys()) settleDisclosure(details);
  }
  function setupDisclosures() {
    document.addEventListener("click", (event) => {
      const summary = event.target.closest("summary");
      const details = summary?.parentElement;
      if (
        !details ||
        details.tagName !== "DETAILS" ||
        details.classList.contains("ui-dock-menu")
      )
        return;
      if (event.target.closest("a,button,input,select,textarea")) return;
      if (!canAnimate()) return;
      event.preventDefault();
      const nextOpen = !(disclosureMotions.get(details)?.open ?? details.open);
      const from = details.getBoundingClientRect().height;
      settleDisclosure(details);
      const overflow = details.style.overflow;
      details.open = false;
      const collapsed = details.getBoundingClientRect().height;
      details.open = true;
      const expanded = details.getBoundingClientRect().height;
      details.style.overflow = "clip";
      const entry = { open: nextOpen, overflow, animation: null };
      disclosureMotions.set(details, entry);
      entry.animation = animate(
        details,
        [
          { height: from + "px" },
          { height: (nextOpen ? expanded : collapsed) + "px" },
        ],
        {
          duration:
            (preferences.motion === "simple" ? 140 : 280) / preferences.speed,
          easing: "cubic-bezier(.16,1,.3,1)",
        },
      );
      const finish = () => {
        if (disclosureMotions.get(details) === entry) settleDisclosure(details);
      };
      if (entry.animation) entry.animation.finished.then(finish, finish);
      else finish();
    });
  }
  const modalClosers = {
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
    aboutBackdrop: () => closeAbout(),
    batchImportModal: () => closeBatchImportModal(),
    themeDialogV21727: () => closeThemeDialogV21727(false),
    quickPersonBackdropV218: () => closeQuickPersonScoreV218(),
  };
  // Exit animations have one owner and one completion. No scoring or random decisions here.
  const closingWindows = new Map();
  function finishWindowClose(root) {
    const pending = closingWindows.get(root);
    if (!pending) return;
    closingWindows.delete(root);
    pending.animation?.cancel();
    pending.backdrop?.cancel();
    root.inert = pending.inert;
    delete root.dataset.uiClosing;
    pending.finish();
  }
  function cancelWindowClose(root) {
    const pending = closingWindows.get(root);
    if (!pending) return;
    closingWindows.delete(root);
    pending.animation?.cancel();
    pending.backdrop?.cancel();
    root.inert = pending.inert;
    delete root.dataset.uiClosing;
  }
  function dismissWindow(root, finish) {
    if (closingWindows.has(root)) return;
    const surface = root.querySelector(".ui-function-surface");
    if (
      !surface ||
      !root.getClientRects().length ||
      !canAnimate() ||
      !preferences.pageMotion
    ) {
      finish();
      return;
    }
    // Snapshot before cancelling entrance, so an early close never jumps to fully open.
    const visual = getComputedStyle(surface);
    const from = {
      opacity: visual.opacity,
      translate: visual.translate,
      scale: visual.scale,
    };
    const backdropOpacity = getComputedStyle(root).opacity;
    surface.getAnimations().forEach((a) => a.cancel());
    const pending = {
      finish,
      inert: root.inert,
      animation: null,
      backdrop: null,
    };
    closingWindows.set(root, pending);
    root.inert = true;
    root.dataset.uiClosing = "true";
    pending.animation = animate(
      surface,
      [
        from,
        {
          opacity: 0,
          translate: preferences.motion === "full" ? "0 64px" : "0 10px",
          scale: preferences.motion === "full" ? ".97" : "1",
        },
      ],
      {
        duration:
          (preferences.motion === "full" ? 280 : 120) / preferences.speed,
        easing: motionEase(),
        fill: "forwards",
      },
    );
    pending.backdrop = animate(
      root,
      [
        { opacity: root.tagName === "DIALOG" ? 1 : backdropOpacity },
        { opacity: 0 },
      ],
      {
        duration:
          (preferences.motion === "full" ? 280 : 120) / preferences.speed,
        easing: motionEase(),
        fill: "forwards",
        ...(root.tagName === "DIALOG" ? { pseudoElement: "::backdrop" } : {}),
      },
    );
    pending.animation.finished
      .catch(() => {})
      .finally(() => {
        if (closingWindows.get(root) === pending) finishWindowClose(root);
      });
  }
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
      if (!item?.el?.hasAttribute("data-native-detached")) cancelAnimations();
    }
    function scan() {
      for (const [id, close] of Object.entries(modalClosers)) {
        const el = document.getElementById(id);
        if (
          known.get(id) &&
          openStack.find((item) => item.id === id)?.el !== el
        )
          forgetModal(id);
        if (!el) continue;
        const visible =
          !el.hasAttribute("data-native-detached") &&
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
    new MutationObserver(scan).observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class", "style", "data-native-detached"],
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
  const pickerReelRestores = [];
  function clearPickerReveal() {
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
      ClassroomFeedback.clearLive();
      complete();
      return;
    }
    pickerRevealing = true;
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
      if (a) pending.push(a.finished.catch(() => {}));
    });
    ClassroomFeedback.clearLive();
    // clearLive restores the legacy name; keep it hidden behind the settling strip.
    pendingActual.forEach((e) => (e.style.visibility = "hidden"));
    Promise.all(pending).then(complete);
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
    const left = $(".picker-left-v2"),
      right = $(".picker-right-v2");
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
    document.querySelectorAll(".nav-tab").forEach((b, i) => {
      const text = ["欢迎", "比赛", "历史", "档案", "插件", "设置"][i];
      b.innerHTML =
        icon(
          ["home", "battle", "history", "archive", "plugin", "settings"][i],
        ) + `<span>${text}</span>`;
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
    getClosingWindowCount: () => closingWindows.size,
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
    getDisclosureMotionCount: () => disclosureMotions.size,
    isPickerRevealing: () => pickerRevealing,
  };
})();
window.addEventListener("DOMContentLoaded", DesktopUI.init, { once: true });
