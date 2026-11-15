/* Non-blocking battle status strip, outcome toast banner, and settings panel for EV01-EV16. */
(function installRandomEventUI(root) {
  "use strict";
  const E = (value) =>
    typeof escapeHtml === "function"
      ? escapeHtml(value)
      : String(value ?? "").replace(
          /[&<>"]/g,
          (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
        );

  const CATEGORY_META = Object.freeze({
    score: { label: "得分狂欢", tone: "score", glyph: "trending_up" },
    item: { label: "道具补给", tone: "item", glyph: "gift" },
    status: { label: "状态与防护", tone: "status", glyph: "shield" },
    comeback: { label: "追赶逆转", tone: "comeback", glyph: "bolt" },
    special: { label: "特殊机制", tone: "special", glyph: "spark" },
  });

  let bannerTimer = null;
  let historyDrawerOpen = false;
  let settingsHost = null;

  function icon(name) {
    return typeof GodpowerTheme !== "undefined" &&
      typeof GodpowerTheme.icon === "function"
      ? GodpowerTheme.icon(name)
      : "";
  }

  function renderBattleStrip() {
    const strip = document.getElementById("battleRandomEventStrip");
    if (!strip || typeof RandomEvents === "undefined") return;
    if (typeof ensureRandomEventState === "function") ensureRandomEventState();
    const cfg = state?.randomEventConfig || RandomEvents.defaultConfig();
    const ev = state?.randomEvents;
    if (!cfg.enabled || !ev) {
      strip.hidden = true;
      strip.innerHTML = "";
      historyDrawerOpen = false;
      return;
    }
    strip.hidden = false;
    const active = Array.isArray(ev.active) ? ev.active : [];
    const recent = Array.isArray(ev.history)
      ? ev.history.slice(-6).reverse()
      : [];
    const badges = active.length
      ? active
          .map((item) => {
            const cat = CATEGORY_META[item.category] || CATEGORY_META.special;
            return `<span class="re-active-pill" data-re-cat="${E(cat.tone)}" title="${E(item.description)}">${icon(cat.glyph)}<b>${E(item.name)}</b><span>${E(item.scope)} · 剩 ${item.remaining} 轮</span></span>`;
          })
          .join("")
      : `<span class="re-idle-note">当前无持续事件生效</span>`;

    const historyRows = recent.length
      ? recent
          .map((h) => {
            if (h.reason === "noEligibleEvent") {
              return `<div class="re-history-row"><span class="re-tag" data-re-cat="special">跳过</span><div><strong>第 ${h.roundNumber} 轮 · 暂无合适事件</strong><p>本轮无可满足条件的随机事件，已重排至 ${h.roundsUntilNext} 轮后。</p></div></div>`;
            }
            const cat = CATEGORY_META[h.category] || CATEGORY_META.special;
            return `<div class="re-history-row"><span class="re-tag" data-re-cat="${E(cat.tone)}">${E(cat.label)}</span><div><strong>第 ${h.roundNumber} 轮 · ${E(h.name)}</strong><p>${E(h.summary || "")}</p></div></div>`;
          })
          .join("")
      : `<p class="ui-muted">本局尚未触发过随机事件（每 ${cfg.minInterval}～${cfg.maxInterval} 轮正式判题自动触发）。</p>`;

    strip.innerHTML = `
      <div class="re-strip-row">
        <div class="re-strip-lead">
          ${icon("casino")}
          <span class="re-countdown-chip">随机事件 · 约 <b>${ev.roundsUntilNext}</b> 轮后触发</span>
        </div>
        <div class="re-active-list">${badges}</div>
        <div class="re-strip-actions">
          <button type="button" class="btn btn-sm re-history-btn" data-re-toggle-history>${icon("history")}<span>近期事件 (${recent.length})</span></button>
          <button type="button" class="btn btn-sm re-rule-btn" onclick="switchView('gameplay');GameplayPage.openTab?.('events')">${icon("book")}<span>说明</span></button>
        </div>
      </div>
      <div class="re-history-drawer" ${historyDrawerOpen ? "" : "hidden"}>${historyRows}</div>
    `;
    strip
      .querySelector("[data-re-toggle-history]")
      ?.addEventListener("click", () => {
        historyDrawerOpen = !historyDrawerOpen;
        renderBattleStrip();
      });
  }

  function presentOutcome(outcome) {
    if (!outcome) return;
    const banner = document.getElementById("randomEventBanner");
    if (!banner) return;
    if (bannerTimer) {
      clearTimeout(bannerTimer);
      bannerTimer = null;
    }
    if (!outcome.triggered) {
      if (
        outcome.reason === "noEligibleEvent" &&
        typeof showToast === "function"
      )
        showToast(`第 ${outcome.roundNumber} 轮无合适随机事件，已重新安排`);
      return;
    }
    const cat = CATEGORY_META[outcome.category] || CATEGORY_META.special;
    banner.dataset.reCat = cat.tone;
    banner.innerHTML = `
      <div class="re-banner-icon">${icon(cat.glyph)}</div>
      <div class="re-banner-copy">
        <div class="re-banner-meta"><span>随机事件 · ${E(cat.label)}</span><span>${E(outcome.id)}</span></div>
        <strong>${E(outcome.name)}</strong>
        <p>${E(outcome.summary || "")}</p>
      </div>
      <button type="button" class="re-banner-close" aria-label="关闭通知">${icon("close")}</button>
    `;
    banner.hidden = false;
    banner.querySelector(".re-banner-close")?.addEventListener("click", () => {
      banner.hidden = true;
    });
    if (typeof playSound === "function") {
      try {
        playSound("item_get");
      } catch (_) {}
    }
    bannerTimer = setTimeout(() => {
      banner.hidden = true;
    }, 5200);
  }

  function renderSettingsBody(card) {
    if (!card || typeof RandomEvents === "undefined") return;
    if (typeof ensureRandomEventState === "function") ensureRandomEventState();
    const cfg = state?.randomEventConfig || RandomEvents.defaultConfig();
    const disabled = new Set(cfg.disabledIds || []);

    const categoryInputs = RandomEvents.CATEGORIES.map(
      (cat) => `
      <label class="re-weight-chip">
        <span>${E(cat.name)}</span>
        <input type="number" min="0" max="500" step="5" data-re-cat-weight="${E(cat.id)}" value="${cfg.categoryWeights[cat.id] ?? cat.weight}">
      </label>`,
    ).join("");

    const eventToggles = RandomEvents.CATALOG.map((ev) => {
      const cat = CATEGORY_META[ev.category] || CATEGORY_META.special;
      const checked = !disabled.has(ev.id);
      return `
        <label class="re-event-check">
          <input type="checkbox" data-re-ev-toggle="${E(ev.id)}" ${checked ? "checked" : ""}>
          <div>
            <strong>${E(ev.id)} · ${E(ev.name)} <small>[${E(cat.label)}]</small></strong>
            <span>${E(ev.description)}</span>
          </div>
        </label>`;
    }).join("");

    card.innerHTML = `
      <h4>${icon("casino")}<span>全自动随机事件（EV01–EV16）</span></h4>
      <p class="ui-muted">每 ${cfg.minInterval}～${cfg.maxInterval} 轮正式判题自动触发，无阻塞弹窗；撤销答题会同步回滚随机状态与 RNG。</p>
      <div class="re-settings-controls">
        <div class="setting-item ui-rule-card">
          <div class="ui-rule-copy">
            <label class="ui-rule-title" for="cfgRandomEventsEnabled">启用随机事件机制</label>
            <p class="setting-note">关闭后暂停倒计时，不会在后台暗中触发；重新开启继续累计。</p>
          </div>
          <label class="ui-toggle" title="启用随机事件">
            <input type="checkbox" id="cfgRandomEventsEnabled" ${cfg.enabled ? "checked" : ""}>
            <span class="ui-toggle-track"><span class="ui-toggle-knob"></span></span>
          </label>
        </div>
        <div class="setting-item ui-rule-card">
          <div class="ui-rule-copy">
            <span class="ui-rule-title">触发回合间隔（正式判题轮数）</span>
            <p class="setting-note">跳过题目、仅使用道具或撤销均不计入回合间隔。</p>
          </div>
          <div class="re-interval-inputs">
            <label>最短 <input type="number" id="cfgRandomEventMin" min="1" max="20" value="${cfg.minInterval}"> 轮</label>
            <label>最长 <input type="number" id="cfgRandomEventMax" min="1" max="30" value="${cfg.maxInterval}"> 轮</label>
          </div>
        </div>
        <div class="re-weight-grid">
          <div class="re-weight-head">
            <span>分类抽取权重</span>
            <button type="button" class="btn btn-sm" id="cfgRandomEventResetBtn">${icon("restart")}<span>恢复默认配置</span></button>
          </div>
          <div class="re-weight-row">${categoryInputs}</div>
        </div>
        <details class="ui-settings-disclosure re-pool-disclosure">
          <summary><b>事件池开关 (${RandomEvents.CATALOG.length - disabled.size} / ${RandomEvents.CATALOG.length} 已启用)</b><span>按课堂需要启停单个随机事件（仅对下一次抽取生效）</span></summary>
          <div class="re-event-check-grid">${eventToggles}</div>
        </details>
      </div>
    `;

    card
      .querySelector("#cfgRandomEventsEnabled")
      ?.addEventListener("change", (e) => {
        updateRandomEventConfig({ enabled: !!e.target.checked });
      });
    const commitIntervals = () => {
      const minVal = Math.max(
        1,
        Math.min(
          20,
          Number(card.querySelector("#cfgRandomEventMin")?.value) || 4,
        ),
      );
      const maxVal = Math.max(
        minVal,
        Math.min(
          30,
          Number(card.querySelector("#cfgRandomEventMax")?.value) || 8,
        ),
      );
      updateRandomEventConfig({ minInterval: minVal, maxInterval: maxVal });
    };
    card
      .querySelector("#cfgRandomEventMin")
      ?.addEventListener("change", commitIntervals);
    card
      .querySelector("#cfgRandomEventMax")
      ?.addEventListener("change", commitIntervals);
    card.querySelectorAll("[data-re-cat-weight]").forEach((input) => {
      input.addEventListener("change", () => {
        const key = input.dataset.reCatWeight;
        const val = Math.max(
          0,
          Math.min(500, Math.round(Number(input.value) || 0)),
        );
        updateRandomEventConfig((draft) => {
          draft.categoryWeights[key] = val;
          return draft;
        });
      });
    });
    card.querySelectorAll("[data-re-ev-toggle]").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const id = checkbox.dataset.reEvToggle;
        updateRandomEventConfig((draft) => {
          const next = new Set(draft.disabledIds || []);
          if (checkbox.checked) next.delete(id);
          else next.add(id);
          draft.disabledIds = [...next];
          return draft;
        });
      });
    });
    card
      .querySelector("#cfgRandomEventResetBtn")
      ?.addEventListener("click", () => {
        updateRandomEventConfig(RandomEvents.defaultConfig());
        if (typeof showToast === "function")
          showToast("随机事件配置已恢复默认（4～8 轮，全事件启用）");
      });
  }

  function mountSettings(rulesSection) {
    if (!rulesSection || document.getElementById("uiSettingsRandomEvents"))
      return;
    settingsHost = document.createElement("div");
    settingsHost.id = "uiSettingsRandomEvents";
    settingsHost.className = "ui-settings-group";
    rulesSection.append(settingsHost);
    renderSettingsBody(settingsHost);
  }

  function syncSettingsControls() {
    if (settingsHost && document.contains(settingsHost))
      renderSettingsBody(settingsHost);
  }

  root.RandomEventUI = Object.freeze({
    renderBattleStrip,
    presentOutcome,
    mountSettings,
    syncSettingsControls,
  });
})(globalThis);
