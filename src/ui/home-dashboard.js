/* Unifies every legacy welcome-page card into one read-only grid surface. */
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
  const PLUGIN_CARDS = [
    ["official.marx-politics", ".gp-daily-knowledge"],
    ["official.miyamotos-power", ".gp-daily-item"],
    ["official.marx-politics", ".gp-daily-challenge"],
  ];
  const SIZE = (w, h) => ({
    minW: w === 3 ? 2 : 4,
    minH: 2,
    defaultW: w,
    defaultH: h,
    maxW: 12,
    maxH: 12,
  });
  const catalog = TYPES.map(([typeId, , w, h]) => ({
    typeId,
    source: "core",
    supportsMultipleInstances: false,
    configSchemaVersion: 1,
    size: SIZE(w, h),
  }));
  let initialized = false;
  let observer = null;
  let currentLayout = null;

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
    grid.querySelectorAll("#uiDailyGrid > article").forEach((node) => {
      const pluginOwner = PLUGIN_CARDS.find(([, selector]) =>
        node.matches(selector),
      );
      if (pluginOwner) {
        node.dataset.homePluginOwner = pluginOwner[0];
        node.classList.add("gp-reveal");
      } else if (node.matches(".gp-daily-honors")) {
        node.dataset.homeCardType = "core.history-honor";
      }
    });
  }

  function applyLayout(grid, layout) {
    const validated = root.HomeLayout.validateLayout(layout);
    const byType = new Map(
      validated.instances.map((instance) => [instance.typeId, instance]),
    );
    grid.querySelectorAll("[data-home-card-type]").forEach((node) => {
      const instance = byType.get(node.dataset.homeCardType);
      if (!instance) return;
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

  function init() {
    if (initialized || !root.HomeLayout || !root.HomeLayoutRepository) return;
    const grid = moveIntoGrid();
    if (!grid) return;
    initialized = true;
    bindLegacyNodes(grid);
    const repository = root.HomeLayoutRepository.createHomeLayoutRepository({
      storage: window.localStorage,
    });
    const stored = repository.read();
    if (!stored.ok) {
      grid.dataset.layoutStatus = "recovery-required";
      grid.dataset.layoutError = stored.code;
      applyLayout(grid, defaultLayout());
    } else if (stored.layout) applyLayout(grid, stored.layout);
    else applyLayout(grid, defaultLayout());
    observer = new MutationObserver(() => {
      bindLegacyNodes(grid);
      if (currentLayout) applyLayout(grid, currentLayout);
    });
    observer.observe(grid.querySelector("#uiDailyGrid"), {
      subtree: true,
      childList: true,
    });
  }

  root.HomeDashboard = Object.freeze({
    init,
    getCardOwnership: () => ({
      core: TYPES.map(([typeId]) => typeId),
      plugin: PLUGIN_CARDS.map(([pluginId, selector]) => ({
        pluginId,
        selector,
      })),
    }),
    getStatus: () => ({
      initialized,
      activeObserver: !!observer,
      layout: currentLayout
        ? root.HomeLayout.validateLayout(currentLayout)
        : null,
    }),
  });
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})(globalThis);
