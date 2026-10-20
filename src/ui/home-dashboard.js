/* Unified, host-owned home dashboard with isolated, undoable layout editing. */
(function installHomeDashboard(root) {
  "use strict";
  const SELECTORS = [
    ".gp-kpis",
    ".gp-section-heading",
    ".gp-main-grid",
    ".gp-group-section",
    ".gp-bottom-heading",
    "#uiDailyGrid",
  ];
  const TYPES = [
    ["core.group-count", "#wGroupCount", 3, 2],
    ["core.total-score", "#wTotalScore", 3, 2],
    ["core.top-score", "#wMaxScore", 3, 2],
    ["core.leading-group", "#wLeaderName", 3, 2],
    ["core.live-ranking", ".gp-rank-panel", 7, 7],
    ["core.recent-activity", ".gp-feed-panel", 5, 7],
    ["core.group-showcase", ".gp-group-section", 12, 4],
    ["core.history-honor", ".gp-daily-honors", 6, 6],
  ];
  const PLUGIN_CARD_DEFS = [
    {
      pluginId: "official.marx-politics",
      localId: "daily-knowledge",
      selector: ".gp-daily-knowledge",
      w: 6,
      h: 6,
      title: "政治知识点",
    },
    {
      pluginId: "official.miyamotos-power",
      localId: "daily-item-tip",
      selector: ".gp-daily-item",
      w: 6,
      h: 6,
      title: "道具小知识",
    },
    {
      pluginId: "official.marx-politics",
      localId: "daily-challenge",
      selector: ".gp-daily-challenge",
      w: 6,
      h: 6,
      title: "课堂挑战",
    },
  ];
  const SIZE = (w, h) => ({
    minW: w === 3 ? 2 : 4,
    minH: 2,
    defaultW: w,
    defaultH: h,
    maxW: 12,
    maxH: 12,
  });
  const typeForPluginCard = (card) =>
    `plugin.${card.pluginId.replace(/[^a-z0-9]+/g, ".")}.${card.localId}`;
  const catalog = [
    ...TYPES.map(([typeId, , w, h]) => ({
      typeId,
      source: "core",
      supportsMultipleInstances: false,
      configSchemaVersion: 1,
      size: SIZE(w, h),
    })),
    ...PLUGIN_CARD_DEFS.map((card) => ({
      typeId: typeForPluginCard(card),
      source: card.pluginId,
      supportsMultipleInstances: false,
      configSchemaVersion: 1,
      size: SIZE(card.w, card.h),
    })),
  ];
  function registeredPluginCards() {
    const registry = root.GodPowerPageShell;
    if (!registry?.listByPlugin) return [];
    return PLUGIN_CARD_DEFS.filter((card) =>
      registry
        .listByPlugin(card.pluginId)
        .some(
          (entry) =>
            entry.kind === "card" &&
            entry.localId === card.localId &&
            entry.descriptor.slot === "home.cards" &&
            entry.descriptor.renderer === "builtin.dashboard-card" &&
            entry.descriptor.dataSelector === card.selector,
        ),
    );
  }
  function activePluginCardTypes() {
    return new Set(registeredPluginCards().map(typeForPluginCard));
  }
  let initialized = false;
  let observer = null;
  let currentLayout = null;
  let repository = null;
  let repositoryRevision = 0;
  let layoutService = null;
  let editing = false;
  let gridElement = null;
  let pointerEdit = null;
  let statusTimer = null;
  let instanceSequence = 0;

  function moveIntoGrid() {
    const welcome = document.getElementById("view-welcome");
    const first = welcome?.querySelector(".gp-kpis");
    if (!welcome || !first) return null;
    let grid = welcome.querySelector("#homeDashboardGrid");
    if (grid) return grid;
    grid = document.createElement("section");
    grid.id = "homeDashboardGrid";
    grid.className = "home-dashboard-grid";
    grid.setAttribute("aria-label", "首页卡片");
    first.before(grid);
    for (const selector of SELECTORS) {
      const node = welcome.querySelector(selector);
      if (node && !grid.contains(node)) grid.append(node);
    }
    return grid;
  }

  function defaultLayout() {
    const createId = (() => {
      let sequence = 0;
      return () => `home-card-${++sequence}`;
    })();
    return root.HomeLayout.createDefaultLayout(
      "home-default",
      "默认布局",
      catalog,
      createId,
    );
  }

  function completeLegacyLayout(layout) {
    const present = new Set(layout.instances.map((item) => item.typeId));
    const service = root.HomeLayout.createLayoutService({
      catalog,
      initial: layout,
      makeInstanceId: () => `home-migrated-${++instanceSequence}`,
    });
    for (const card of PLUGIN_CARD_DEFS) {
      const typeId = typeForPluginCard(card);
      if (!present.has(typeId)) service.add(typeId);
    }
    return service.getDraft();
  }

  function createToolbar(grid) {
    let toolbar = document.getElementById("homeDashboardToolbar");
    if (toolbar) return toolbar;
    toolbar = document.createElement("div");
    toolbar.id = "homeDashboardToolbar";
    toolbar.className = "home-dashboard-toolbar";
    toolbar.innerHTML =
      '<div class="home-dashboard-toolbar-copy"><strong>课堂首页</strong><span>卡片布局保存在本机，不改变比赛数据</span></div><div class="home-dashboard-toolbar-actions"><button type="button" class="btn btn-sm" data-home-action="edit">自定义布局</button><button type="button" class="btn btn-sm" data-home-action="undo" hidden>撤销</button><button type="button" class="btn btn-sm" data-home-action="redo" hidden>重做</button><button type="button" class="btn btn-sm" data-home-action="add" hidden>添加卡片</button><button type="button" class="btn btn-sm" data-home-action="reset" hidden>恢复默认</button><button type="button" class="btn btn-sm" data-home-action="cancel" hidden>取消</button><button type="button" class="btn btn-sm btn-primary" data-home-action="save" hidden>保存布局</button></div><div id="homeDashboardAddPanel" class="home-dashboard-add-panel" hidden></div><p id="homeDashboardStatus" class="home-dashboard-status" role="status" aria-live="polite" hidden></p>';
    grid.before(toolbar);
    toolbar.addEventListener("click", onToolbarClick);
    toolbar.addEventListener("click", onAddCardClick);
    grid.addEventListener("click", onGridClick);
    grid.addEventListener("keydown", onGridKeydown);
    grid.addEventListener("pointerdown", onGridPointerDown);
    document.addEventListener("pointermove", onDocumentPointerMove);
    document.addEventListener("pointerup", onDocumentPointerUp);
    document.addEventListener("pointercancel", onDocumentPointerUp);
    document.addEventListener("keydown", onEscape, true);
    return toolbar;
  }

  function setStatus(message, kind = "info") {
    const node = document.getElementById("homeDashboardStatus");
    if (!node) return;
    node.textContent = message;
    node.dataset.kind = kind;
    node.hidden = !message;
    clearTimeout(statusTimer);
    if (message && !editing)
      statusTimer = setTimeout(() => {
        node.hidden = true;
      }, 3500);
  }

  function setToolbarMode(isEditing) {
    editing = isEditing;
    document.body.classList.toggle("home-layout-editing", editing);
    const toolbar = document.getElementById("homeDashboardToolbar");
    toolbar?.querySelectorAll("[data-home-action]").forEach((button) => {
      const action = button.dataset.homeAction;
      button.hidden = editing ? action === "edit" : action !== "edit";
    });
    if (editing) {
      setStatus(
        "编辑中的布局只影响首页展示，不会修改课堂数据。拖动手柄移动卡片，方向键也可移动。",
        "info",
      );
    } else {
      document
        .getElementById("homeDashboardAddPanel")
        ?.setAttribute("hidden", "");
      setStatus("");
    }
    renderEditorControls();
  }

  function renderEditorControls() {
    if (!gridElement) return;
    gridElement
      .querySelectorAll(".home-card-editor-controls")
      .forEach((node) => node.remove());
    if (!editing) return;
    for (const node of gridElement.querySelectorAll("[data-home-card-type]")) {
      const instanceId = node.dataset.homeCardInstance;
      if (!instanceId || node.hidden) continue;
      const controls = document.createElement("div");
      controls.className = "home-card-editor-controls";
      controls.innerHTML = `<button type="button" class="home-card-drag-handle" data-home-card-action="drag" data-instance-id="${instanceId}" aria-label="移动${node.getAttribute("aria-label") || node.dataset.homeCardType}" title="拖动或使用方向键移动">⠿</button><button type="button" data-home-card-action="hide" data-instance-id="${instanceId}" aria-label="隐藏卡片" title="隐藏卡片">◉</button><button type="button" data-home-card-action="remove" data-instance-id="${instanceId}" aria-label="移除卡片" title="移除卡片">×</button><button type="button" class="home-card-resize-handle" data-home-card-action="resize" data-instance-id="${instanceId}" aria-label="调整卡片大小" title="拖动调整大小">⤢</button>`;
      node.append(controls);
    }
    renderAddPanel();
  }

  function renderAddPanel() {
    const panel = document.getElementById("homeDashboardAddPanel");
    if (!panel || !editing) return;
    panel.replaceChildren();
    const draft = layoutService.getDraft();
    const current = new Set(draft.instances.map((item) => item.typeId));
    const availableCore = TYPES.filter(([typeId]) => !current.has(typeId));
    const activePluginCards = registeredPluginCards().filter(
      (card) => !current.has(typeForPluginCard(card)),
    );
    const heading = document.createElement("strong");
    heading.textContent = "可添加的主程序与插件卡片";
    panel.append(heading);
    const hidden = draft.instances.filter((item) => !item.visible);
    if (!availableCore.length && !activePluginCards.length && !hidden.length) {
      const note = document.createElement("span");
      note.textContent = "当前主程序卡片均已在布局中。插件卡片由对应插件提供。";
      panel.append(note);
      return;
    }
    for (const instance of hidden) {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.restoreCardId = instance.instanceId;
      button.textContent = `恢复 ${instance.typeId.replace("core.", "")}`;
      panel.append(button);
    }
    for (const [typeId] of availableCore) {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.addCardType = typeId;
      button.textContent = typeId.replace("core.", "");
      panel.append(button);
    }
    for (const card of activePluginCards) {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.addCardType = typeForPluginCard(card);
      button.dataset.pluginId = card.pluginId;
      button.textContent = `${card.title} · ${card.pluginId}`;
      panel.append(button);
    }
  }

  function refreshDraft() {
    applyLayout(gridElement, layoutService.getDraft());
    renderEditorControls();
  }

  function beginEdit() {
    if (editing || !currentLayout) return;
    layoutService = root.HomeLayout.createLayoutService({
      catalog,
      initial: currentLayout,
      makeInstanceId: () => `home-user-${++instanceSequence}`,
    });
    setToolbarMode(true);
  }

  function cancelEdit() {
    if (!layoutService) return;
    layoutService.cancel();
    applyLayout(gridElement, layoutService.getSaved());
    setToolbarMode(false);
    setStatus("已取消布局修改。", "success");
  }

  function saveEdit() {
    const draft = layoutService?.getDraft();
    if (!draft) return;
    const next = { ...draft, revision: Math.max(1, draft.revision + 1) };
    const result = repository.write(next, {
      expectedRevision: repositoryRevision,
    });
    if (!result.ok) {
      setStatus(
        `布局没有保存：${result.code}${result.message ? ` · ${result.message}` : ""}`,
        "error",
      );
      return;
    }
    repositoryRevision = result.revision;
    currentLayout = result.layout;
    applyLayout(gridElement, currentLayout);
    layoutService = null;
    setToolbarMode(false);
    setStatus("首页布局已保存。", "success");
  }

  function resetDraft() {
    if (!layoutService) return;
    const baseline = defaultLayout();
    baseline.layoutId = currentLayout.layoutId;
    baseline.name = currentLayout.name;
    baseline.revision = currentLayout.revision;
    layoutService.replaceDraft(baseline);
    refreshDraft();
    setStatus("已在草稿中恢复默认排列，保存后才会生效。", "info");
  }

  function toggleAddPanel() {
    const panel = document.getElementById("homeDashboardAddPanel");
    if (!panel) return;
    panel.hidden = !panel.hidden;
    if (!panel.hidden) panel.querySelector("button")?.focus();
  }

  function onToolbarClick(event) {
    const restore = event.target.closest("[data-restore-card-id]");
    if (restore && editing) {
      layoutService.hide(restore.dataset.restoreCardId, false);
      refreshDraft();
      document.getElementById("homeDashboardAddPanel").hidden = true;
      return;
    }
    const button = event.target.closest("[data-home-action]");
    if (!button) return;
    switch (button.dataset.homeAction) {
      case "edit":
        beginEdit();
        break;
      case "undo":
        if (layoutService.undo()) refreshDraft();
        break;
      case "redo":
        if (layoutService.redo()) refreshDraft();
        break;
      case "add":
        toggleAddPanel();
        break;
      case "reset":
        resetDraft();
        break;
      case "cancel":
        cancelEdit();
        break;
      case "save":
        saveEdit();
        break;
    }
  }

  function onAddCardClick(event) {
    const button = event.target.closest("[data-add-card-type]");
    if (!editing || !button) return;
    layoutService.add(button.dataset.addCardType);
    refreshDraft();
    document.getElementById("homeDashboardAddPanel").hidden = true;
    setStatus("卡片已加入草稿布局。", "info");
  }

  function onGridClick(event) {
    if (!editing) return;
    const button = event.target.closest("[data-home-card-action]");
    if (!button) return;
    const id = button.dataset.instanceId;
    if (button.dataset.homeCardAction === "hide") {
      layoutService.hide(id, true);
      refreshDraft();
      return;
    }
    if (button.dataset.homeCardAction === "show") {
      layoutService.hide(id, false);
      refreshDraft();
      return;
    }
    if (button.dataset.homeCardAction === "remove") {
      layoutService.remove(id);
      refreshDraft();
      return;
    }
    if (button.dataset.homeCardAction === "resize") {
      const item = layoutService
        .getDraft()
        .instances.find((entry) => entry.instanceId === id);
      layoutService.resize(
        id,
        item.position.x,
        item.position.y,
        item.position.w + 1,
        item.position.h + 1,
      );
      refreshDraft();
    }
  }

  function onGridKeydown(event) {
    if (!editing || !event.target.matches(".home-card-drag-handle")) return;
    const delta = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    }[event.key];
    if (!delta) return;
    event.preventDefault();
    event.stopPropagation();
    const item = layoutService
      .getDraft()
      .instances.find(
        (entry) => entry.instanceId === event.target.dataset.instanceId,
      );
    layoutService.move(
      item.instanceId,
      item.position.x + delta[0],
      item.position.y + delta[1],
    );
    refreshDraft();
    gridElement
      .querySelector(
        `[data-instance-id="${item.instanceId}"].home-card-drag-handle`,
      )
      ?.focus();
  }

  function onGridPointerDown(event) {
    const handle = event.target.closest(
      "[data-home-card-action='drag'],[data-home-card-action='resize']",
    );
    if (!editing || !handle || event.button !== 0) return;
    const item = layoutService
      .getDraft()
      .instances.find(
        (entry) => entry.instanceId === handle.dataset.instanceId,
      );
    if (!item) return;
    event.preventDefault();
    pointerEdit = {
      pointerId: event.pointerId,
      action: handle.dataset.homeCardAction,
      instanceId: item.instanceId,
      startX: event.clientX,
      startY: event.clientY,
      position: { ...item.position },
      moved: false,
    };
    handle.setPointerCapture?.(event.pointerId);
  }

  function onDocumentPointerMove(event) {
    if (!pointerEdit || event.pointerId !== pointerEdit.pointerId) return;
    if (
      Math.abs(event.clientX - pointerEdit.startX) +
        Math.abs(event.clientY - pointerEdit.startY) >
      5
    )
      pointerEdit.moved = true;
  }

  function onDocumentPointerUp(event) {
    const drag = pointerEdit;
    if (!drag || event.pointerId !== drag.pointerId) return;
    pointerEdit = null;
    if (!drag.moved) return;
    const gap = 14;
    const cellWidth = (gridElement.clientWidth - gap * 11) / 12;
    const cellHeight = 48;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (drag.action === "drag") {
      layoutService.move(
        drag.instanceId,
        drag.position.x + Math.round(dx / (cellWidth + gap)),
        drag.position.y + Math.round(dy / (cellHeight + gap)),
      );
    } else {
      layoutService.resize(
        drag.instanceId,
        drag.position.x,
        drag.position.y,
        drag.position.w + Math.round(dx / (cellWidth + gap)),
        drag.position.h + Math.round(dy / (cellHeight + gap)),
      );
    }
    refreshDraft();
  }

  function onEscape(event) {
    if (
      editing &&
      event.key === "Escape" &&
      document.getElementById("homeDashboardAddPanel")?.hidden === false
    ) {
      event.preventDefault();
      document.getElementById("homeDashboardAddPanel").hidden = true;
      document.querySelector('[data-home-action="add"]')?.focus();
    }
  }

  function bindLegacyNodes(grid) {
    for (const [typeId, selector] of TYPES) {
      if (selector.startsWith("#w")) {
        const valueId = selector.slice(1);
        const node = [...grid.querySelectorAll(".gp-kpi")].find((card) =>
          card.querySelector(`#${valueId}`),
        );
        if (node) node.dataset.homeCardType = typeId;
        continue;
      }
      const node = grid.querySelector(selector);
      if (node) node.dataset.homeCardType = typeId;
    }
    grid.querySelectorAll(".gp-kpi").forEach((node) => {
      const value = node.querySelector("strong")?.id;
      const match = TYPES.find(([, selector]) => selector === `#${value}`);
      if (match) node.dataset.homeCardType = match[0];
    });
    const daily = grid.querySelector("#uiDailyGrid");
    if (daily) {
      for (const node of [...daily.children]) {
        const pluginCard = PLUGIN_CARD_DEFS.find((card) =>
          node.matches(card.selector),
        );
        if (pluginCard) {
          node.dataset.homePluginOwner = pluginCard.pluginId;
          node.dataset.homePluginCardType = typeForPluginCard(pluginCard);
          node.classList.add("gp-reveal");
          grid.append(node);
        } else if (node.matches(".gp-daily-honors")) {
          node.dataset.homeCardType = "core.history-honor";
          grid.append(node);
        }
      }
      daily.hidden = true;
    }
  }

  function applyLayout(grid, layout) {
    const validated = root.HomeLayout.validateLayout(layout);
    const byType = new Map(
      validated.instances.map((instance) => [instance.typeId, instance]),
    );
    const activePluginTypes = activePluginCardTypes();
    grid
      .querySelectorAll(".home-plugin-inactive-placeholder")
      .forEach((node) => node.remove());
    grid.querySelectorAll("[data-home-plugin-card-type]").forEach((node) => {
      const typeId = node.dataset.homePluginCardType;
      const instance = byType.get(typeId);
      const active = activePluginTypes.has(typeId);
      node.removeAttribute("data-home-card-type");
      node.hidden = true;
      delete node.dataset.homeCardInstance;
      if (!instance) return;
      if (active) {
        node.dataset.homeCardType = typeId;
        node.hidden = !instance.visible;
        node.dataset.homeCardInstance = instance.instanceId;
        return;
      }
      const def = PLUGIN_CARD_DEFS.find(
        (card) => typeForPluginCard(card) === typeId,
      );
      if (!instance.visible || !def) return;
      const placeholder = document.createElement("article");
      placeholder.className = "ui-panel home-plugin-inactive-placeholder";
      placeholder.dataset.homeCardType = typeId;
      placeholder.dataset.homeCardInstance = instance.instanceId;
      placeholder.setAttribute("aria-label", def.title);
      const title = document.createElement("strong");
      title.textContent = def.title;
      const note = document.createElement("p");
      note.textContent = `${def.pluginId} 已停用；此卡片与布局设置已保留。`;
      placeholder.append(title, note);
      grid.append(placeholder);
    });
    grid.querySelectorAll("[data-home-card-type]").forEach((node) => {
      const instance = byType.get(node.dataset.homeCardType);
      if (!instance) {
        node.hidden = true;
        delete node.dataset.homeCardInstance;
        return;
      }
      const { x, y, w, h } = instance.position;
      node.style.gridColumn = `${x + 1} / span ${w}`;
      node.style.gridRow = `${y + 1} / span ${h}`;
      node.style.setProperty(
        "--home-enter-delay",
        `${Math.min(440, [...grid.querySelectorAll("[data-home-card-type]")].indexOf(node) * 45)}ms`,
      );
      node.classList.add("gp-reveal");
      node.hidden = !instance.visible;
      node.dataset.homeCardInstance = instance.instanceId;
    });
    currentLayout = validated;
    grid.dataset.layoutId = validated.layoutId;
    grid.dataset.layoutRevision = String(validated.revision);
  }

  function refreshPluginContributions() {
    if (!initialized || !gridElement || !currentLayout) return;
    bindLegacyNodes(gridElement);
    applyLayout(gridElement, currentLayout);
    renderEditorControls();
  }

  function init() {
    if (initialized || !root.HomeLayout || !root.HomeLayoutRepository) return;
    const grid = moveIntoGrid();
    if (!grid) return;
    initialized = true;
    gridElement = grid;
    createToolbar(grid);
    bindLegacyNodes(grid);
    try {
      repository = root.HomeLayoutRepository.createHomeLayoutRepository({
        storage: window.localStorage,
      });
    } catch (error) {
      grid.dataset.layoutStatus = "recovery-required";
      grid.dataset.layoutError = "STORAGE_UNAVAILABLE";
      repository = root.HomeLayoutRepository.createHomeLayoutRepository({
        storage: {
          getItem() {
            throw error;
          },
          setItem() {
            throw error;
          },
          removeItem() {
            throw error;
          },
        },
      });
    }
    const stored = repository.read();
    if (!stored.ok) {
      grid.dataset.layoutStatus = "recovery-required";
      grid.dataset.layoutError = stored.code;
      applyLayout(grid, defaultLayout());
    } else if (stored.layout) {
      repositoryRevision = stored.revision;
      applyLayout(grid, completeLegacyLayout(stored.layout));
    } else applyLayout(grid, defaultLayout());
    renderEditorControls();
    observer = new MutationObserver(() => {
      bindLegacyNodes(grid);
      if (currentLayout) applyLayout(grid, currentLayout);
    });
    const daily = grid.querySelector("#uiDailyGrid");
    if (daily)
      observer.observe(daily, {
        subtree: true,
        childList: true,
      });
    document.addEventListener(
      "godpower:plugin-contributions-changed",
      refreshPluginContributions,
    );
  }

  root.HomeDashboard = Object.freeze({
    init,
    beginEdit,
    getCardOwnership: () => ({
      core: TYPES.map(([typeId]) => typeId),
      plugin: registeredPluginCards().map((card) => ({
        pluginId: card.pluginId,
        localId: card.localId,
        selector: card.selector,
        typeId: typeForPluginCard(card),
      })),
    }),
    getStatus: () => ({
      initialized,
      activeObserver: !!observer,
      layout: currentLayout
        ? root.HomeLayout.validateLayout(currentLayout)
        : null,
    }),
    refreshPluginContributions,
  });
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})(globalThis);
