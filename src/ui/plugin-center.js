(function installPluginCenter(root) {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const labels = {
    "classroom.read": "课堂只读",
    "students.read": "学生信息",
    "groups.read": "小组信息",
    "competition.stats.read": "竞技统计",
    "competition.commands.request": "申请竞技命令",
    "rules.register": "注册规则",
    "resources.read": "读取资源",
    "resources.write": "写入资源",
    "plugin.storage": "插件私有存储",
    "network.request": "网络访问",
    "files.open": "打开文件",
    "files.save": "保存文件",
    "audio.play": "播放音频",
    "audio.capture": "音频采集",
    "midi.access": "MIDI设备",
    "camera.capture": "摄像头",
    "microphone.capture": "麦克风",
    "native.device": "原生设备",
    "ui.page.register": "注册插件页面",
    "ui.navigation.register": "注册导航",
    "ui.card.register": "主页卡片",
    "ui.panel.register": "功能面板",
    "ui.settings.register": "插件设置",
    "ui.commandShortcut.register": "命令快捷入口",
    "ui.viewPreset.register": "页面预设",
    "ui.decoration.register": "页面装饰",
  };
  let platform;
  let route = null;
  let readyError = null;
  function status(message, kind = "info") {
    const node = $("#pluginCenterStatus");
    if (node) {
      node.textContent = message;
      node.dataset.kind = kind;
    }
  }
  function safeStore() {
    const repository =
      root.GodPowerPluginLocalRepository.createPluginLocalRepository(
        root.localStorage,
      );
    return root.GodPowerPluginPlatform.createPluginPlatform({
      contributions: root.GodPowerPageShell,
      repository,
      platform: "html",
      currentScope: () => ({ classroomId: "local-classroom" }),
    });
  }
  function addButton(parent, text, action, id, extra = "") {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.dataset.pluginAction = action;
    button.dataset.pluginId = id || "";
    if (extra) button.className = extra;
    parent.append(button);
    return button;
  }
  function renderWorkspace() {
    const host = $("#pluginWorkspace");
    if (!host) return;
    if (!route) {
      host.hidden = true;
      host.replaceChildren();
      return;
    }
    const page = root.GodPowerPageShell.resolvePage(route);
    if (!page || page.core) {
      route = null;
      host.hidden = true;
      host.replaceChildren();
      return;
    }
    host.hidden = false;
    host.replaceChildren();
    const title = document.createElement("h3");
    title.textContent = page.descriptor.titleKey;
    const body = document.createElement("p");
    body.textContent = `扩展页面 ${route} 由宿主的受限工作区承载。插件代码不会在主页面执行。`;
    const code = document.createElement("code");
    code.textContent = page.pluginId;
    host.append(title, body, code);
  }
  function render() {
    const host = $("#pluginCenterContent");
    if (!host) return;
    if (readyError) {
      host.replaceChildren();
      const p = document.createElement("p");
      p.className = "plugin-center-empty";
      p.textContent = `插件存储暂不可用：${readyError}`;
      host.append(p);
      return;
    }
    const plugins = platform.list();
    host.replaceChildren();
    if (!plugins.length) {
      const empty = document.createElement("div");
      empty.className = "plugin-center-empty";
      const title = document.createElement("h3");
      title.textContent = "插件空间已经准备好";
      const copy = document.createElement("p");
      copy.textContent =
        "导入 JSON 声明清单来安装受限插件。当前版本不会执行外部脚本。";
      empty.append(title, copy);
      host.append(empty);
    }
    for (const plugin of plugins) {
      const record = platform.inspect(plugin.id);
      const card = document.createElement("article");
      card.className = "plugin-card";
      const head = document.createElement("div");
      head.className = "plugin-card-head";
      const identity = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = plugin.name["zh-CN"] || plugin.name.en || plugin.id;
      const id = document.createElement("div");
      id.className = "plugin-id";
      id.textContent = `${plugin.id} · v${plugin.version}`;
      identity.append(title, id);
      const badge = document.createElement("span");
      badge.className = "plugin-state";
      badge.dataset.state = plugin.state;
      badge.textContent =
        {
          installed: "已安装 · 未启用",
          active: "已启用",
          paused: "已暂停",
          quarantined: "已隔离",
        }[plugin.state] || plugin.state;
      head.append(identity, badge);
      card.append(head);
      const description = document.createElement("p");
      description.textContent =
        record.manifest.description["zh-CN"] ||
        record.manifest.description.en ||
        "";
      card.append(description);
      const permissions = document.createElement("div");
      permissions.className = "plugin-card-permissions";
      permissions.textContent = `权限声明：${record.manifest.permissions.map((p) => `${labels[p.capability] || p.capability}${p.required ? "（必需）" : "（可选）"}`).join("、") || "无"}`;
      card.append(permissions);
      const actions = document.createElement("div");
      actions.className = "plugin-card-actions";
      if (plugin.state === "active")
        addButton(actions, "停用", "disable", plugin.id);
      else if (plugin.state === "installed" || plugin.state === "paused")
        addButton(
          actions,
          plugin.state === "paused" ? "恢复" : "启用",
          "enable",
          plugin.id,
        );
      if (plugin.state !== "active" && plugin.state !== "paused")
        addButton(actions, "卸载", "uninstall", plugin.id, "danger");
      for (const page of root.GodPowerPageShell.listPages().filter(
        (item) => !item.core && item.pluginId === plugin.id,
      ))
        addButton(
          actions,
          `打开：${page.descriptor.titleKey}`,
          "route",
          page.route,
        );
      card.append(actions);
      host.append(card);
    }
    renderWorkspace();
  }
  async function importManifest(file) {
    const text = await file.text();
    if (text.length > 65536) throw new Error("清单超过 64 KiB");
    const manifest = JSON.parse(text);
    platform.install(manifest);
    status(`已安装 ${manifest.id}。插件保持停用，启用前请审阅权限。`);
    render();
  }
  async function onClick(event) {
    const button = event.target.closest("[data-plugin-action]");
    if (!button) return;
    const action = button.dataset.pluginAction;
    const id = button.dataset.pluginId;
    try {
      if (action === "import") {
        $("#pluginManifestFile")?.click();
        return;
      }
      if (action === "disable") {
        platform.deactivate(id);
        status("插件已停用；其私有数据仍保留。");
      } else if (action === "enable") {
        const entry = platform.inspect(id);
        const required = entry.manifest.permissions
          .filter((p) => p.required)
          .map((p) => p.capability);
        const approved = window.confirm(
          `启用 ${entry.manifest.name["zh-CN"] || id}？\n\n必需权限：${required.map((p) => labels[p] || p).join("、") || "无"}\n\n仅受限 JSON 贡献会启用，不会执行外部 JavaScript。`,
        );
        if (!approved) return;
        platform.grantPermissions(id, required);
        platform.activate(id);
        status("插件已启用；授权绑定到本地课堂范围。");
      } else if (action === "uninstall") {
        if (!window.confirm(`卸载 ${id} 并保留其私有数据？`)) return;
        platform.uninstall(id);
        status("插件已卸载，数据保留；重新安装相同 ID 可恢复。");
      } else if (action === "route") {
        root.switchView(id);
        return;
      }
      render();
    } catch (error) {
      status(error.message || String(error), "error");
      render();
    }
  }
  function init() {
    try {
      platform = safeStore();
    } catch (error) {
      readyError = error.message || String(error);
    }
    $("#view-plugins")?.addEventListener("click", onClick);
    $("#pluginManifestFile")?.addEventListener("change", async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        await importManifest(file);
      } catch (error) {
        status(error.message || String(error), "error");
      } finally {
        event.target.value = "";
      }
    });
    render();
  }
  root.GodPowerPluginCenter = Object.freeze({
    init,
    render,
    showRoute(value) {
      route = value;
    },
    get platform() {
      return platform;
    },
  });
  window.addEventListener("DOMContentLoaded", init, { once: true });
})(globalThis);
