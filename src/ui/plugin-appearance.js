/* Host-owned, reversible appearance extensions. Contributions can select only fixed host tokens and text keys. */
(function installPluginAppearance(root) {
  "use strict";
  const KEY = "godpower_plugin_appearance_v1";
  const TOKEN_KEYS = new Set([
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
  const TEXT_TARGETS = new Map([["home.description", ".gp-hero-description"]]);
  const defaults = new Map();
  let applied = null;

  function selection() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "null");
    } catch {
      return null;
    }
  }
  function restoreTexts() {
    for (const [key, selector] of TEXT_TARGETS) {
      const node = document.querySelector(selector);
      if (node && defaults.has(key)) node.textContent = defaults.get(key);
    }
  }
  function restore() {
    for (const key of TOKEN_KEYS) {
      document.documentElement.style.removeProperty(key);
      document.body?.style.removeProperty(key);
    }
    document.documentElement.removeAttribute("data-plugin-theme");
    restoreTexts();
    applied = null;
  }
  function apply(
    pluginId,
    localId,
    contributions = root.GodPowerPageShell?.listByPlugin(pluginId) || [],
  ) {
    const record = contributions.find(
      (item) => item.id === `${pluginId}/${localId}` && item.kind === "theme",
    );
    if (!record) throw new Error("主题贡献不存在或插件未启用");
    restore();
    const tokens = record.descriptor.tokens || {};
    for (const [key, value] of Object.entries(tokens)) {
      if (!TOKEN_KEYS.has(key) || !/^#[0-9a-f]{6}$/i.test(value))
        throw new Error(`宿主拒绝不安全主题令牌：${key}`);
      document.documentElement.style.setProperty(key, value);
      document.body?.style.setProperty(key, value);
    }
    document.documentElement.dataset.pluginTheme = `${pluginId}/${localId}`;
    applied = { pluginId, localId };
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({ schemaVersion: 1, ...applied }),
      );
    } catch {
      window.showToast?.("主题已临时应用，偏好保存失败");
    }
    return { ok: true, pluginId, localId };
  }
  function applyText(
    pluginId,
    contributions = root.GodPowerPageShell?.listByPlugin(pluginId) || [],
  ) {
    const bundles = contributions.filter((item) => item.kind === "textBundle");
    for (const bundle of bundles) {
      for (const [key, value] of Object.entries(
        bundle.descriptor.messages || {},
      )) {
        const selector = TEXT_TARGETS.get(key);
        if (!selector || typeof value !== "string" || /[<>]/.test(value))
          continue;
        const node = document.querySelector(selector);
        if (!node) continue;
        if (!defaults.has(key)) defaults.set(key, node.textContent);
        node.textContent = value;
      }
    }
    return { ok: true, count: bundles.length };
  }
  function sync() {
    restore();
    restoreTexts();
    const saved = selection();
    if (saved?.schemaVersion === 1 && saved.pluginId && saved.localId) {
      const contributions =
        root.GodPowerPageShell?.listByPlugin(saved.pluginId) || [];
      if (
        contributions.some(
          (item) => item.kind === "theme" && item.localId === saved.localId,
        )
      ) {
        try {
          apply(saved.pluginId, saved.localId, contributions);
        } catch {
          restore();
        }
      } else {
        try {
          localStorage.removeItem(KEY);
        } catch {
          /* Appearance preference only. */
        }
      }
    }
    for (const plugin of root.GodPowerPluginCenter?.platform?.list?.() || [])
      if (plugin.state === "active") applyText(plugin.id);
  }
  root.GodPowerPluginAppearance = Object.freeze({
    apply,
    applyText,
    restore,
    sync,
    get applied() {
      return applied && { ...applied };
    },
  });
  window.addEventListener("DOMContentLoaded", sync, { once: true });
})(globalThis);
