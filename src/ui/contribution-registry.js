/* Host-owned, declarative UI contributions. Plugin code never receives DOM callbacks here. */
(function installGodPowerContributionRegistry(root) {
  "use strict";

  const KINDS = new Set([
    "navigation",
    "page",
    "panel",
    "card",
    "settings",
    "commandShortcut",
    "viewPreset",
    "decoration",
    "theme",
    "textBundle",
  ]);
  const SLOTS = new Set([
    "home.cards",
    "plugins.overview",
    "plugins.workspace",
    "resources.tools",
    "settings.pluginLinks",
    "competition.transientOverlay",
  ]);
  const RENDERERS = new Set([
    "builtin.plugin-workspace",
    "builtin.dashboard-card",
    "builtin.notice",
    "builtin.command-shortcut",
    "builtin.decoration",
  ]);
  const CORE_PAGES = [
    "welcome",
    "battle",
    "history",
    "archives",
    "plugins",
    "settings",
  ];
  const REQUIRED = {
    page: "ui.page.register",
    navigation: "ui.navigation.register",
    card: "ui.card.register",
    panel: "ui.panel.register",
    settings: "ui.settings.register",
    commandShortcut: "ui.commandShortcut.register",
    viewPreset: "ui.viewPreset.register",
    decoration: "ui.decoration.register",
    theme: "ui.theme.register",
    textBundle: "ui.text.register",
  };
  const EXECUTABLE_FIELD =
    /^(?:html|markup|script|module|mount|handler|callback|function|css|csstext|javascript|__proto__|prototype|constructor)$/i;
  const IDENTIFIER = /^[a-z0-9][a-z0-9._-]{0,63}$/;
  const DESCRIPTOR_FIELDS = {
    page: new Set([
      "titleKey",
      "iconResource",
      "renderer",
      "route",
      "emptyState",
      "errorState",
    ]),
    navigation: new Set(["titleKey", "iconResource", "pageId"]),
    card: new Set([
      "slot",
      "renderer",
      "titleKey",
      "iconResource",
      "dataSelector",
      "configSchema",
      "minSize",
      "maxSize",
      "recommendedSize",
      "refreshPolicy",
      "action",
      "emptyState",
      "errorState",
    ]),
    panel: new Set([
      "slot",
      "renderer",
      "titleKey",
      "priority",
      "sizeConstraints",
      "emptyState",
      "errorState",
    ]),
    settings: new Set(["slot", "renderer", "titleKey", "schema"]),
    commandShortcut: new Set(["commandId", "titleKey", "renderer", "schema"]),
    viewPreset: new Set(["presetId", "titleKey", "renderer", "tokens"]),
    decoration: new Set(["slot", "renderer", "titleKey", "asset"]),
    theme: new Set(["displayNameKey", "tokens"]),
    textBundle: new Set(["locale", "messages"]),
  };
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const equal = (left, right) => JSON.stringify(left) === JSON.stringify(right);
  const fail = (message) => {
    throw new TypeError(message);
  };

  function assertSafeJson(value, path = "descriptor", depth = 0) {
    if (depth > 12) fail(`${path} exceeds maximum nesting`);
    if (
      value === null ||
      ["string", "number", "boolean"].includes(typeof value)
    ) {
      if (typeof value === "number" && !Number.isFinite(value))
        fail(`${path} contains a non-finite number`);
      if (typeof value === "string" && value.length > 4096)
        fail(`${path} string is too long`);
      return;
    }
    if (Array.isArray(value)) {
      if (value.length > 256) fail(`${path} contains too many entries`);
      value.forEach((entry, index) =>
        assertSafeJson(entry, `${path}[${index}]`, depth + 1),
      );
      return;
    }
    if (
      typeof value !== "object" ||
      Object.prototype.toString.call(value) !== "[object Object]"
    ) {
      fail(`${path} must contain JSON data only`);
    }
    for (const [key, entry] of Object.entries(value)) {
      if (EXECUTABLE_FIELD.test(key) || /^on[a-z]+$/i.test(key))
        fail(`${path}.${key} is an executable or markup field`);
      assertSafeJson(entry, `${path}.${key}`, depth + 1);
    }
  }

  function createContributionRegistry() {
    let revision = 0;
    let nextActivation = 1;
    const activations = new WeakMap();
    const activationsById = new Map();
    const contributions = new Map();
    const pages = new Map();

    for (const route of CORE_PAGES) {
      pages.set(
        route,
        Object.freeze({
          id: `godpower.core/${route}`,
          pluginId: "godpower.core",
          localId: route,
          kind: "page",
          route,
          renderer: "core.view",
          core: true,
          descriptor: Object.freeze({
            titleKey: `core.page.${route}`,
            viewId: `view-${route}`,
          }),
        }),
      );
    }

    function activate(pluginId, options = {}) {
      if (
        typeof pluginId !== "string" ||
        pluginId.length > 128 ||
        !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*$/.test(
          pluginId,
        )
      ) {
        fail("invalid host-bound plugin identity");
      }
      if (!Array.isArray(options.permissions || []))
        fail("activation permissions must be an array");
      if (
        !options.scope ||
        typeof options.scope !== "object" ||
        Array.isArray(options.scope)
      )
        fail("activation scope must be an object");
      assertSafeJson(options.scope);
      const activationId = `activation-${nextActivation++}`;
      const activation = Object.freeze({ activationId });
      const record = {
        pluginId,
        activationId,
        scope: clone(options.scope || {}),
        permissions: new Set(options.permissions || []),
        active: true,
        ids: new Set(),
      };
      activations.set(activation, record);
      activationsById.set(activationId, record);
      return activation;
    }

    function validateContribution(input, activationRecord) {
      if (!input || typeof input !== "object" || Array.isArray(input))
        fail("contribution must be an object");
      if (
        input.pluginId !== undefined &&
        input.pluginId !== activationRecord.pluginId
      )
        fail("pluginId does not match host-bound identity");
      if (!IDENTIFIER.test(input.localId || "") || input.localId.includes(".."))
        fail("invalid local contribution id");
      if (!KINDS.has(input.kind))
        fail(`unknown contribution kind: ${input.kind}`);
      if (
        !input.descriptor ||
        typeof input.descriptor !== "object" ||
        Array.isArray(input.descriptor)
      )
        fail("descriptor is required");
      if (
        input.scope !== undefined &&
        !equal(input.scope, activationRecord.scope)
      )
        fail("contribution scope exceeds host activation scope");
      if (
        input.requiredPermissions !== undefined &&
        (!Array.isArray(input.requiredPermissions) ||
          input.requiredPermissions.some(
            (permission) => typeof permission !== "string",
          ))
      )
        fail("requiredPermissions must be a string array");
      const needed = new Set([
        REQUIRED[input.kind],
        ...(input.requiredPermissions || []),
      ]);
      for (const permission of needed) {
        if (!activationRecord.permissions.has(permission))
          fail(`permission denied: ${permission}`);
      }
      assertSafeJson(input.descriptor);
      const descriptor = clone(input.descriptor);
      for (const key of Object.keys(descriptor)) {
        if (!DESCRIPTOR_FIELDS[input.kind].has(key))
          fail(`unknown ${input.kind} descriptor field: ${key}`);
      }
      if (input.kind === "page") {
        if (descriptor.route !== undefined)
          fail("page route is host-generated");
        if (!/^[a-z][a-zA-Z0-9_.-]{0,127}$/.test(descriptor.titleKey || ""))
          fail("page titleKey is required");
        if (descriptor.renderer !== "builtin.plugin-workspace")
          fail("page renderer is not allowed");
      }
      if (["card", "panel", "settings", "decoration"].includes(input.kind)) {
        if (!SLOTS.has(descriptor.slot))
          fail(`unknown contribution slot: ${descriptor.slot}`);
        if (!RENDERERS.has(descriptor.renderer))
          fail(`renderer is not allowed: ${descriptor.renderer}`);
      }
      if (
        [
          "card",
          "panel",
          "settings",
          "navigation",
          "commandShortcut",
          "viewPreset",
          "decoration",
        ].includes(input.kind) &&
        !/^[a-z][a-zA-Z0-9_.-]{0,127}$/.test(descriptor.titleKey || "")
      ) {
        fail(`${input.kind} titleKey is required`);
      }
      if (
        input.kind === "navigation" &&
        !IDENTIFIER.test(descriptor.pageId || "")
      )
        fail("navigation pageId is required");
      if (input.kind === "card" && descriptor.slot !== "home.cards")
        fail("cards may only register in home.cards");
      if (
        input.kind === "card" &&
        !["builtin.dashboard-card", "builtin.notice"].includes(
          descriptor.renderer,
        )
      )
        fail("card renderer is not allowed");
      if (
        input.kind === "panel" &&
        !["builtin.plugin-workspace", "builtin.notice"].includes(
          descriptor.renderer,
        )
      )
        fail("panel renderer is not allowed");
      if (
        input.kind === "settings" &&
        descriptor.renderer !== "builtin.plugin-workspace"
      )
        fail("settings renderer is not allowed");
      if (
        input.kind === "decoration" &&
        descriptor.renderer !== "builtin.decoration"
      )
        fail("decoration renderer is not allowed");
      if (input.kind === "commandShortcut") {
        if (!/^[a-z][a-zA-Z0-9_.-]{0,127}$/.test(descriptor.commandId || ""))
          fail("command shortcut requires a host commandId");
        if (
          descriptor.renderer !== undefined &&
          descriptor.renderer !== "builtin.command-shortcut"
        )
          fail("renderer is not allowed");
      }
      if (
        ["navigation", "viewPreset"].includes(input.kind) &&
        descriptor.renderer !== undefined &&
        !RENDERERS.has(descriptor.renderer)
      ) {
        fail("renderer is not allowed");
      }
      if (
        input.kind === "panel" &&
        descriptor.slot === "competition.transientOverlay" &&
        descriptor.renderer !== "builtin.notice"
      ) {
        fail("competition overlay must use the transient notice renderer");
      }
      if (input.kind === "theme") {
        if (
          !/^[a-z][a-zA-Z0-9_.-]{0,127}$/.test(descriptor.displayNameKey || "")
        )
          fail("theme displayNameKey is required");
        const allowedTokens = new Set([
          "--ui-primary",
          "--ui-primary-hover",
          "--ui-accent",
          "--ui-accent-hover",
          "--ui-bg",
          "--ui-panel",
          "--ui-soft",
          "--ui-soft-2",
          "--ui-text",
          "--ui-muted",
          "--ui-border",
          "--ui-border-strong",
        ]);
        if (
          !descriptor.tokens ||
          typeof descriptor.tokens !== "object" ||
          Array.isArray(descriptor.tokens)
        )
          fail("theme tokens must be a token map");
        for (const [token, value] of Object.entries(descriptor.tokens)) {
          if (!allowedTokens.has(token))
            fail(`theme token is not allowed: ${token}`);
          if (typeof value !== "string" || !/^#[0-9a-f]{6}$/i.test(value))
            fail(`theme token ${token} must be a six-digit hex color`);
        }
        if (!Object.keys(descriptor.tokens).length)
          fail("theme tokens are empty");
      }
      if (input.kind === "textBundle") {
        if (!/^[a-z]{2,3}(?:-[A-Z]{2})?$/.test(descriptor.locale || ""))
          fail("text bundle locale is invalid");
        const allowedKeys = new Set([
          "app.name",
          "nav.welcome",
          "nav.battle",
          "nav.history",
          "nav.archives",
          "nav.plugins",
          "nav.settings",
          "home.description",
        ]);
        if (
          !descriptor.messages ||
          typeof descriptor.messages !== "object" ||
          Array.isArray(descriptor.messages)
        )
          fail("text bundle messages must be a map");
        const keys = Object.keys(descriptor.messages);
        if (!keys.length || keys.length > 32)
          fail("text bundle message count is invalid");
        for (const [key, value] of Object.entries(descriptor.messages)) {
          if (
            !allowedKeys.has(key) ||
            /^(safety|permissions|dataLoss|transaction)\./.test(key)
          )
            fail(`text key is not allowed: ${key}`);
          if (
            typeof value !== "string" ||
            !value.trim() ||
            value.length > 120 ||
            /[<>]/.test(value)
          )
            fail(`text value for ${key} must be plain bounded text`);
        }
      }
      return {
        id: `${activationRecord.pluginId}/${input.localId}`,
        pluginId: activationRecord.pluginId,
        localId: input.localId,
        kind: input.kind,
        scope: clone(input.scope || activationRecord.scope),
        requiredPermissions: [...needed],
        descriptor,
        ...(input.kind === "page"
          ? {
              route: `plugins/${activationRecord.pluginId}/${input.localId}`,
              renderer: descriptor.renderer,
            }
          : {}),
      };
    }

    function register(batch, activation) {
      const activationRecord = activations.get(activation);
      if (!activationRecord?.active) fail("activation is inactive or disposed");
      if (!Array.isArray(batch) || batch.length < 1 || batch.length > 100)
        fail("contribution batch must contain 1 to 100 entries");

      const staged = batch.map((item) =>
        validateContribution(item, activationRecord),
      );
      const stagedIds = new Set();
      const stagedRoutes = new Set();
      for (const item of staged) {
        if (stagedIds.has(item.id) || contributions.has(item.id))
          fail(`duplicate contribution id: ${item.id}`);
        stagedIds.add(item.id);
        if (item.kind === "page") {
          if (pages.has(item.route) || stagedRoutes.has(item.route))
            fail(`page route conflict: ${item.route}`);
          stagedRoutes.add(item.route);
        }
      }
      for (const item of staged) {
        contributions.set(item.id, item);
        if (item.kind === "page") pages.set(item.route, item);
        activationRecord.ids.add(item.id);
      }
      revision += 1;
      return Object.freeze({
        activationId: activationRecord.activationId,
        registeredIds: staged.map((item) => item.id),
        revision,
      });
    }

    function dispose(activationId) {
      const record = activationsById.get(activationId);
      if (!record || !record.active) return false;
      record.active = false;
      for (const id of record.ids) {
        const item = contributions.get(id);
        if (item?.kind === "page") pages.delete(item.route);
        contributions.delete(id);
      }
      record.ids.clear();
      revision += 1;
      return true;
    }

    function listByPlugin(pluginId) {
      return [...contributions.values()]
        .filter((item) => item.pluginId === pluginId)
        .map(clone);
    }
    function listPages() {
      return [...pages.values()].map(clone);
    }
    function resolvePage(route) {
      const page = pages.get(route);
      return page ? clone(page) : null;
    }
    function navigate(route, sourceInstanceId = null) {
      const page = pages.get(route);
      if (!page) return Object.freeze({ status: "missing", route });
      if (page.core) {
        if (typeof root.switchView === "function") root.switchView(route);
        return Object.freeze({ status: "navigated", route, sourceInstanceId });
      }
      return Object.freeze({
        status: "workspace-required",
        route,
        page: clone(page),
        sourceInstanceId,
      });
    }

    return Object.freeze({
      activate,
      register,
      dispose,
      listByPlugin,
      listPages,
      resolvePage,
      navigate,
      get revision() {
        return revision;
      },
    });
  }

  const api = Object.freeze({ createContributionRegistry });
  root.GodPowerContributionRegistry = api;

  if (typeof document !== "undefined" && !root.GodPowerPageShell) {
    const registry = createContributionRegistry();
    root.GodPowerPageShell = Object.freeze({
      activate: (...args) => registry.activate(...args),
      register: (...args) => registry.register(...args),
      dispose: (...args) => registry.dispose(...args),
      listByPlugin: (...args) => registry.listByPlugin(...args),
      navigate: (route, sourceInstanceId) =>
        registry.navigate(route, sourceInstanceId),
      resolvePage: (route) => registry.resolvePage(route),
      listPages: () => registry.listPages(),
      get revision() {
        return registry.revision;
      },
    });
  }
})(globalThis);
