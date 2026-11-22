/* Settings panel for Mario Kart World (Product.180) item draw configuration and live simulator. */
const ItemDrawSettings = (() => {
  "use strict";
  const mounts = new WeakMap();
  const GATE_LABELS = Object.freeze({
    switch_preset: "预设已禁用",
    disabled: "预设已禁用",
    start_delay: "开局延迟中",
    cooldown: "全局冷却中",
    field_cap: "场上/持有达上限",
    held: "本组已持有(EnableSame关)",
    batch: "同批抽中防重",
    module_disabled: "模块流程已关闭",
    module_zero_weight: "自定义权重为0",
  });

  const E = GodpowerUIModel.escapeHtml;

  function readConfig() {
    if (typeof getMkwDrawConfig === "function") return getMkwDrawConfig();
    if (typeof ItemDrawPolicy === "undefined") return {};
    return ItemDrawPolicy.normalizeConfig(state?.itemGlobal?.drawConfig);
  }

  function writeConfig(patch, announceText) {
    if (typeof ItemDrawPolicy === "undefined") return;
    if (typeof ensureItemState === "function") ensureItemState();
    const current = readConfig();
    const next = ItemDrawPolicy.normalizeConfig({ ...current, ...patch });
    state.itemGlobal.drawConfig = next;
    try {
      if (typeof saveState === "function") saveState();
    } catch (_) {}
    if (typeof refreshDrawCooldownInfoV21710 === "function") {
      try {
        refreshDrawCooldownInfoV21710();
      } catch (_) {}
    }
    if (announceText && typeof showToast === "function") {
      showToast(announceText);
    }
    return next;
  }

  function formatItemIcon(key) {
    if (typeof itemVisual === "function") {
      return itemVisual(key, "idraw-item-img");
    }
    return E(ITEM_DEFS?.[key]?.icon || "✦");
  }

  function renderSimulation(panelState) {
    const { container } = panelState;
    if (!container || typeof ItemDrawPolicy === "undefined") return;
    const cfg = readConfig();
    const mkw =
      typeof ensureMkwDrawState === "function"
        ? ensureMkwDrawState()
        : state?.itemGlobal?.mkwState || {
            matchStartedAt: Date.now(),
            lastUsedAt: {},
            lastUsedSession: {},
          };
    const elapsedSec = Math.max(
      0,
      Math.round(
        (Date.now() - (Number(mkw.matchStartedAt) || Date.now())) / 1000,
      ),
    );
    const sessionNo = Number(
      state?.itemGlobal?.drawSessionThrottleV21710?.sessionNo || 0,
    );
    const groups = Array.isArray(state?.groups) ? state.groups : [];
    const total = Math.max(1, Number(panelState.total) || groups.length || 12);
    const pos = Math.max(1, Math.min(total, Number(panelState.position) || 1));

    const heldKeys = new Set();
    const selectedGroup = groups.find(
      (g) => String(g.id) === String(panelState.groupId),
    );
    if (selectedGroup && Array.isArray(selectedGroup.inventory)) {
      for (const slot of selectedGroup.inventory) {
        if (slot?.key) heldKeys.add(slot.key);
      }
    }

    const fieldCounts =
      typeof collectMkwFieldCounts === "function"
        ? collectMkwFieldCounts()
        : {};
    const evaluation = ItemDrawPolicy.evaluate({
      config: cfg,
      position: pos,
      total,
      score: selectedGroup ? selectedGroup.score : 100,
      held: [...heldKeys],
      field: fieldCounts,
      moduleConfig: globalThis.ItemModules
        ? ItemModules.configuration().items
        : null,
      lastUsedAt: mkw.lastUsedAt || {},
      lastUsedSession: mkw.lastUsedSession || {},
      sessionNo: Math.max(1, sessionNo),
      matchStartedAt: Number(mkw.matchStartedAt) || Date.now(),
      nowMs: Date.now(),
      strictPreview: true,
      ...(panelState.liveTiming ? {} : { elapsedFrames: Infinity }),
    });

    const tableNameEl = container.querySelector("[data-idraw-table-name]");
    if (tableNameEl && tableNameEl.textContent !== evaluation.tableName)
      tableNameEl.textContent = evaluation.tableName;

    const summaryEl = container.querySelector("[data-idraw-summary]");
    if (summaryEl) {
      summaryEl.innerHTML = `
        <span class="idraw-stat-pill">本局已运行 ${elapsedSec}s（${elapsedSec * 60} 帧）</span>
        <span class="idraw-stat-pill">累计全局抽取轮次：第 ${sessionNo} 轮</span>
        <span class="idraw-stat-pill">当前试算列：第 ${evaluation.column} 列 · Rank ${evaluation.rank + 1}</span>
        <span class="idraw-stat-pill">生效墨汁等级 InkLevel：${evaluation.paramsForRank?.inkLevel || 1}</span>
        <span class="idraw-stat-pill">闪电缩小帧：${evaluation.paramsForRank?.thunderFrame || 180}f</span>
      `;
    }

    const groupSelect = container.querySelector('[data-idraw-sim="groupId"]');
    if (groupSelect) {
      const groupSig = groups
        .map((g) => `${g.id}:${g.name || ""}:${g.score || 0}`)
        .join("|");
      if (groupSelect.dataset.groupSig !== groupSig) {
        groupSelect.dataset.groupSig = groupSig;
        groupSelect.innerHTML = [
          `<option value="">按自定义模拟顺位 (${pos}/${total})</option>`,
          ...groups.map(
            (g, idx) =>
              `<option value="${E(String(g.id))}">第 ${idx + 1} 位 · ${E(g.name || `小组 ${g.groupNo || g.id}`)} (${g.score || 0} 分)</option>`,
          ),
        ].join("");
      } else if (groupSelect.options[0]) {
        groupSelect.options[0].textContent = `按自定义模拟顺位 (${pos}/${total})`;
      }
      groupSelect.value = selectedGroup ? String(selectedGroup.id) : "";
    }
    const posInput = container.querySelector('[data-idraw-sim="position"]');
    if (posInput && String(posInput.value) !== String(pos))
      posInput.value = String(pos);
    const totalInput = container.querySelector('[data-idraw-sim="total"]');
    if (totalInput && String(totalInput.value) !== String(total))
      totalInput.value = String(total);
    const liveInput = container.querySelector('[data-idraw-sim="liveTiming"]');
    if (liveInput) liveInput.checked = !!panelState.liveTiming;

    const totalWeight = Object.values(evaluation.weights).reduce(
      (sum, v) => sum + (Number(v) || 0),
      0,
    );
    const tbody = container.querySelector("[data-idraw-tbody]");
    if (tbody) {
      const customIcons = state?.itemGlobal?.customIcons;
      let iconSig = "";
      if (customIcons) {
        for (const k of Object.keys(customIcons)) {
          const v = customIcons[k];
          if (v) iconSig += `${k}:${v.length},`;
        }
      }
      const emptyRow = tbody.querySelector("[data-idraw-empty-row]");
      const blockedItems = [];
      let visibleCount = 0;
      if (
        !tbody.querySelector("tr[data-idraw-key]") ||
        tbody.dataset.iconSig !== iconSig
      ) {
        tbody.dataset.iconSig = iconSig;
        const frag = document.createDocumentFragment();
        for (const key of ItemDrawPolicy.keys) {
          const def = ITEM_DEFS?.[key];
          const tr = document.createElement("tr");
          tr.dataset.idrawKey = key;
          tr.innerHTML = `<td><span class="idraw-item-cell"><span class="idraw-item-icon">${formatItemIcon(key)}</span><span>${E(def?.name || key)}</span></span></td><td><code>0</code></td><td><strong>0</strong></td><td>0.0%</td><td><span class="idraw-gate-pill">权重 0</span></td>`;
          frag.appendChild(tr);
        }
        const noneTr = document.createElement("tr");
        noneTr.dataset.idrawEmptyRow = "1";
        noneTr.innerHTML = `<td colspan="5">当前预设与门控下暂无可用候选</td>`;
        noneTr.hidden = true;
        frag.appendChild(noneTr);
        tbody.replaceChildren(frag);
      }
      for (const rowEl of tbody.querySelectorAll("tr[data-idraw-key]")) {
        const key = rowEl.dataset.idrawKey;
        const raw = Number(evaluation.rawWeights?.[key] || 0);
        const eff = Number(evaluation.weights?.[key] || 0);
        const reasons = Array.isArray(evaluation.blockedReasons?.[key])
          ? evaluation.blockedReasons[key]
          : [];
        if (raw <= 0 && !reasons.length) {
          rowEl.hidden = true;
          continue;
        }
        rowEl.hidden = false;
        visibleCount++;
        if (reasons.length) blockedItems.push({ key, reasons });
        const pct =
          totalWeight > 0 ? ((eff / totalWeight) * 100).toFixed(1) : "0.0";
        const badgeClass =
          eff > 0
            ? "idraw-gate-pill idraw-gate-open"
            : "idraw-gate-pill idraw-gate-blocked";
        const statusText =
          eff > 0
            ? "可抽取"
            : reasons.map((r) => GATE_LABELS[r] || r).join(" · ") || "权重 0";
        const cells = rowEl.children;
        const rawEl = cells[1]?.firstElementChild;
        if (rawEl && rawEl.textContent !== String(raw))
          rawEl.textContent = String(raw);
        const effEl = cells[2]?.firstElementChild;
        if (effEl && effEl.textContent !== String(eff))
          effEl.textContent = String(eff);
        const pctText = `${pct}%`;
        if (cells[3] && cells[3].textContent !== pctText)
          cells[3].textContent = pctText;
        const pill = cells[4]?.firstElementChild;
        if (pill) {
          if (pill.className !== badgeClass) pill.className = badgeClass;
          if (pill.textContent !== statusText) pill.textContent = statusText;
        }
      }
      if (emptyRow) emptyRow.hidden = visibleCount > 0;
      else {
        const dynEmpty = tbody.querySelector("[data-idraw-empty-row]");
        if (dynEmpty) dynEmpty.hidden = visibleCount > 0;
      }
      const gatesEl = container.querySelector("[data-idraw-gates]");
      if (gatesEl) {
        gatesEl.innerHTML = blockedItems.length
          ? blockedItems
              .map(({ key, reasons }) => {
                const name = ITEM_DEFS?.[key]?.name || key;
                const kindLabel = reasons
                  .map((r) => GATE_LABELS[r] || r)
                  .join(" · ");
                return `<div class="idraw-gate-card"><strong>${E(name)}</strong><span>${E(kindLabel)}</span></div>`;
              })
              .join("")
          : `<p class="ui-muted">当前试算条件下无道具处于冷却、开局延迟或场上限锁定。</p>`;
      }
    }
  }

  function syncConfigControls(panelState) {
    const { container } = panelState;
    const cfg = readConfig();
    const modes = ItemDrawPolicy.modes();
    const modeSpec = ItemDrawPolicy.modeSpec(cfg.mode);
    const timingDesc = ItemDrawPolicy.describeGateTiming(
      cfg.mode,
      cfg.timingMode,
    );
    const modeNoteEl = container.querySelector("[data-idraw-mode-notes]");
    if (modeNoteEl) {
      const note = modeSpec.notes || modeSpec.name || "";
      modeNoteEl.textContent = note ? `${note} · ` : "";
    }
    const statusEl = container.querySelector("[data-idraw-status]");
    if (statusEl) {
      statusEl.textContent =
        panelState.status ||
        `已加载 Mario Kart World Product.180（28 种道具 · 12 张权重表 · ${modes.length} 种模式 · 15 套开关预设）。`;
    }
    const timingNoteEl = container.querySelector("[data-idraw-timing-note]");
    if (timingNoteEl) timingNoteEl.textContent = timingDesc.note || "";
    for (const key of [
      "mode",
      "switchPreset",
      "timingMode",
      "positionMapping",
    ]) {
      const el = container.querySelector(`[data-idraw-cfg="${key}"]`);
      if (el && el.value !== String(cfg[key])) el.value = String(cfg[key]);
    }
    for (const key of [
      "useComTable",
      "enableSame",
      "ignorePenalty",
      "applyPostDrawRankParams",
    ]) {
      const el = container.querySelector(`[data-idraw-bool="${key}"]`);
      if (el) el.checked = !!cfg[key];
    }
    renderSimulation(panelState);
  }

  function renderPanel(panelState) {
    const { container } = panelState;
    if (!container || typeof ItemDrawPolicy === "undefined") return;
    if (container.querySelector(".idraw-settings")) {
      syncConfigControls(panelState);
      return;
    }
    const cfg = readConfig();
    const modes = ItemDrawPolicy.modes();
    const presets = ItemDrawPolicy.switchPresets();
    const modeSpec = ItemDrawPolicy.modeSpec(cfg.mode);
    const timingDesc = ItemDrawPolicy.describeGateTiming(
      cfg.mode,
      cfg.timingMode,
    );
    const modeOptions = modes
      .map(
        (m) =>
          `<option value="${E(m.id)}" ${cfg.mode === m.id ? "selected" : ""}>${E(m.id)} — ${E(m.name)}</option>`,
      )
      .join("");
    const presetOptions = [
      `<option value="ALL" ${cfg.switchPreset === "ALL" ? "selected" : ""}>ALL — 全部官方道具开放</option>`,
      ...presets.map(
        (p) =>
          `<option value="${E(p.id)}" ${cfg.switchPreset === p.id ? "selected" : ""}>${E(p.id)} — ${E(p.desc)} (${p.keys?.length || 0}/28)</option>`,
      ),
    ].join("");
    const statusLine =
      panelState.status ||
      `已加载 Mario Kart World Product.180（28 种道具 · 12 张权重表 · ${modes.length} 种模式 · 15 套开关预设）。`;

    container.innerHTML = `
      <div class="idraw-settings">
        <div class="idraw-header">
          <div>
            <h4>Mario Kart World (Product.180) 道具抽取引擎</h4>
            <p><span data-idraw-mode-notes>${E(modeSpec.notes || modeSpec.name ? `${modeSpec.notes || modeSpec.name} · ` : "")}</span>权重表：<code data-idraw-table-name></code></p>
          </div>
          <div class="idraw-header-actions">
            <button type="button" class="btn btn-sm" data-idraw-action="reset-timers">重置开局计时与冷却</button>
            <button type="button" class="btn btn-sm" data-idraw-action="reset-config">恢复默认抽取配置</button>
          </div>
        </div>
        <p class="idraw-status" data-idraw-status role="status" aria-live="polite">${E(statusLine)}</p>
        <div class="idraw-controls-grid">
          <label class="idraw-field">
            <span class="idraw-field-label">抽取模式 (ItemGParam)</span>
            <select data-idraw-cfg="mode">${modeOptions}</select>
            <small>标准 24 车竞速 / 淘汰 / 气球与金币对战 / 纯蘑菇等 12 套规则。</small>
          </label>
          <label class="idraw-field">
            <span class="idraw-field-label">道具开关预设 (SwitchPreset)</span>
            <select data-idraw-cfg="switchPreset">${presetOptions}</select>
            <small>按官网预设 P00–P14 一键启停 28 个正式道具。</small>
          </label>
          <label class="idraw-field">
            <span class="idraw-field-label">开局延迟与冷却计时基准</span>
            <select data-idraw-cfg="timingMode">
              <option value="realtime" ${cfg.timingMode === "realtime" ? "selected" : ""}>realtime — 实时秒数换算 60fps 帧率</option>
              <option value="rounds" ${cfg.timingMode === "rounds" ? "selected" : ""}>rounds — 课堂抽取轮次（每轮约 600 帧）</option>
            </select>
            <small data-idraw-timing-note>${E(timingDesc.note || "")}</small>
          </label>
          <label class="idraw-field">
            <span class="idraw-field-label">课堂顺位映射 (24 列矩阵)</span>
            <select data-idraw-cfg="positionMapping">
              <option value="auto" ${cfg.positionMapping === "auto" ? "selected" : ""}>auto — 按小组总数等比例铺满 1～24 列</option>
              <option value="exact" ${cfg.positionMapping === "exact" ? "selected" : ""}>exact — 按精确名次直查前 N 列</option>
            </select>
            <small>课堂 4～16 组建议使用 auto，才能触发后段补偿列。</small>
          </label>
        </div>
        <div class="idraw-toggles-grid">
          <label class="idraw-toggle-card">
            <input type="checkbox" data-idraw-bool="useComTable" ${cfg.useComTable ? "checked" : ""}>
            <span class="idraw-toggle-copy"><strong>启用 COM 简化权重表</strong><span>将标准赛/简洁赛切换至 RaceCom / SimpleCom 权重分布。</span></span>
          </label>
          <label class="idraw-toggle-card">
            <input type="checkbox" data-idraw-bool="enableSame" ${cfg.enableSame ? "checked" : ""}>
            <span class="idraw-toggle-copy"><strong>允许手持重复道具 (EnableSame)</strong><span>关闭时优先过滤本组手牌中已持有的道具，避免重复。</span></span>
          </label>
          <label class="idraw-toggle-card">
            <input type="checkbox" data-idraw-bool="ignorePenalty" ${cfg.ignorePenalty ? "checked" : ""}>
            <span class="idraw-toggle-copy"><strong>忽略开局延迟与惩罚门控</strong><span>跳过 startFrame 与间隔冷却，适合课堂快速调试演示。</span></span>
          </label>
          <label class="idraw-toggle-card">
            <input type="checkbox" data-idraw-bool="applyPostDrawRankParams" ${cfg.applyPostDrawRankParams ? "checked" : ""}>
            <span class="idraw-toggle-copy"><strong>应用 Rank 动态参数 (Product.180)</strong><span>按当前 Rank 自动调整 鱿鱿 InkLevel、杀手目标名次与 闪电 缩小帧。</span></span>
          </label>
        </div>
        <div class="idraw-summary-strip" data-idraw-summary></div>
        <details class="ui-settings-disclosure" ${panelState.previewOpen ? "open" : ""}>
          <summary><b>实时权重与门控试算表</b><span>查看当前模式下各顺位 28 种道具概率、Rank 映射与实时冷却状态</span></summary>
          <div class="ui-settings-detail-body idraw-preview">
            <div class="idraw-preview-toolbar">
              <label>小组选择 <select data-idraw-sim="groupId"></select></label>
              <label>模拟名次 <input type="number" min="1" max="24" value="${Math.max(1, Number(panelState.position) || 1)}" data-idraw-sim="position"></label>
              <label>小组总数 <input type="number" min="1" max="24" value="${Math.max(1, Number(panelState.total) || 12)}" data-idraw-sim="total"></label>
              <label><input type="checkbox" data-idraw-sim="liveTiming" ${panelState.liveTiming ? "checked" : ""}> 带入当前开局计时与冷却门控</label>
            </div>
            <div class="idraw-table-wrap">
              <table class="idraw-table">
                <thead>
                  <tr><th>道具</th><th>表原始权重</th><th>实际权重</th><th>抽中概率</th><th>门控状态</th></tr>
                </thead>
                <tbody data-idraw-tbody></tbody>
              </table>
            </div>
            <div class="idraw-gates-list" data-idraw-gates></div>
          </div>
        </details>
      </div>
    `;

    container.querySelectorAll("[data-idraw-cfg]").forEach((el) => {
      el.addEventListener("change", () => {
        const key = el.dataset.idrawCfg;
        writeConfig({ [key]: el.value });
        panelState.status = `已保存抽取配置：${key} = ${el.value}`;
        syncConfigControls(panelState);
      });
    });

    container.querySelectorAll("[data-idraw-bool]").forEach((el) => {
      el.addEventListener("change", () => {
        const key = el.dataset.idrawBool;
        writeConfig({ [key]: !!el.checked });
        panelState.status = `已更新开关：${key} = ${el.checked ? "开启" : "关闭"}`;
        syncConfigControls(panelState);
      });
    });

    container.querySelectorAll("[data-idraw-sim]").forEach((el) => {
      el.addEventListener("change", () => {
        const key = el.dataset.idrawSim;
        const groups = Array.isArray(state?.groups) ? state.groups : [];
        if (key === "liveTiming") {
          panelState.liveTiming = !!el.checked;
        } else if (key === "groupId") {
          panelState.groupId = el.value;
          const idx = groups.findIndex((g) => String(g.id) === el.value);
          if (idx >= 0) {
            panelState.position = idx + 1;
            panelState.total = Math.max(1, groups.length);
          }
        } else {
          panelState[key] = Math.max(1, Math.min(24, Number(el.value) || 1));
        }
        panelState.previewOpen = true;
        const detailsEl = container.querySelector("details");
        if (detailsEl && !detailsEl.open) detailsEl.open = true;
        renderSimulation(panelState);
      });
    });

    const detailsEl = container.querySelector("details");
    detailsEl?.addEventListener("toggle", () => {
      panelState.previewOpen = detailsEl.open;
    });

    container
      .querySelector('[data-idraw-action="reset-timers"]')
      ?.addEventListener("click", () => {
        if (typeof ensureItemState === "function") ensureItemState();
        state.itemGlobal.mkwState = {
          matchStartedAt: Date.now(),
          lastUsedAt: {},
          lastUsedSession: {},
        };
        if (state.itemGlobal.drawSessionThrottleV21710) {
          state.itemGlobal.drawSessionThrottleV21710.nextEligibleSession = {
            lightning: 0,
            blooper: 0,
            spiny: 0,
          };
        }
        try {
          if (typeof saveState === "function") saveState();
        } catch (_) {}
        panelState.status = "已重置本局开局计时与全部全局冷却。";
        syncConfigControls(panelState);
      });

    container
      .querySelector('[data-idraw-action="reset-config"]')
      ?.addEventListener("click", () => {
        writeConfig(
          ItemDrawPolicy.defaultConfig(),
          "已恢复 MKWorld Product.180 默认抽取配置",
        );
        panelState.status =
          "已恢复默认配置（24KartRace · 预设 ALL · realtime）。";
        syncConfigControls(panelState);
      });

    syncConfigControls(panelState);
  }

  function mount(host) {
    if (!host || typeof ItemDrawPolicy === "undefined") return;
    const existing = mounts.get(host);
    if (existing) {
      renderPanel(existing);
      return;
    }
    const group = document.createElement("div");
    group.id = "uiSettingsItemDrawPolicy";
    group.className = "ui-settings-group idraw-group";
    const heading = host.querySelector(":scope > .ui-settings-title");
    if (heading) heading.after(group);
    else host.prepend(group);
    const panelState = {
      container: group,
      groupId: "",
      position: 1,
      total: Math.max(
        4,
        Array.isArray(state?.groups) ? state.groups.length : 12,
      ),
      liveTiming: false,
      previewOpen: false,
      status: "",
    };
    mounts.set(host, panelState);
    renderPanel(panelState);
  }

  function sync() {
    const host = document.getElementById(
      "uiSettingsItemDrawPolicy",
    )?.parentElement;
    const existing = host && mounts.get(host);
    if (existing) renderPanel(existing);
  }

  return Object.freeze({ mount, sync });
})();
globalThis.ItemDrawSettings = ItemDrawSettings;
