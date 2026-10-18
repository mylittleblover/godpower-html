/* Per-item settings editor. The ItemModules core owns validation and persistence. */
const ItemModuleSettings = (() => {
  "use strict";
  const mounts = new WeakMap();
  const kinds = {
    attack: "攻击",
    boost: "增益",
    tactic: "战术",
    status: "持续状态",
    instant: "即时",
  };
  function node(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }
  function itemIcon(item, className) {
    const wrapper = node("span", className);
    if (typeof itemVisual === "function")
      wrapper.innerHTML = itemVisual(item.key, "im-item-image");
    else wrapper.textContent = item.icon || "✦";
    return wrapper;
  }
  function button(text, action, className = "btn btn-sm") {
    const el = node("button", className, text);
    el.type = "button";
    el.addEventListener("click", action);
    return el;
  }
  function mount(host) {
    if (!host || typeof ItemModules === "undefined") return;
    const existing = mounts.get(host);
    if (existing) {
      existing.refresh();
      return;
    }
    const catalog = ItemModules.catalog();
    let selected = catalog[0]?.key,
      pipeline = "draw",
      query = "",
      busy = false;
    const shell = node("section", "im-settings"),
      title = node("div", "im-heading"),
      actions = node("div", "im-actions"),
      status = node("p", "im-status", "每个道具独立保存，修改后立即生效。"),
      layout = node("div", "im-layout"),
      sidebar = node("div", "im-sidebar"),
      search = node("input", "im-search"),
      count = node("p", "im-count"),
      list = node("div", "im-list"),
      editor = node("div", "im-editor"),
      file = node("input");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    title.append(
      node("h3", "", "道具模块工作台"),
      node("p", "im-muted", "逐个配置抽取与操作，两条流程分别控制。"),
    );
    search.type = "search";
    search.placeholder = "搜索道具名称或类型";
    search.setAttribute("aria-label", "搜索道具");
    search.addEventListener("input", () => {
      query = search.value.trim().toLowerCase();
      renderList();
    });
    file.type = "file";
    file.accept = ".json,application/json";
    file.hidden = true;
    file.addEventListener("change", async () => {
      const picked = file.files?.[0];
      if (!picked || busy) return;
      busy = true;
      try {
        if (picked.size > 1024 * 1024) throw Error("配置文件不能超过 1 MB");
        const imported = JSON.parse(await picked.text());
        ItemModules.update(imported);
        refresh();
        announce("已导入全部道具模块配置。");
      } catch (e) {
        announce("导入失败，原配置保持不变：" + e.message, true);
      } finally {
        busy = false;
        file.value = "";
      }
    });
    actions.append(
      button("导出配置", () => {
        try {
          const blob = new Blob(
            [JSON.stringify(ItemModules.configuration(), null, 2)],
            { type: "application/json" },
          );
          const url = URL.createObjectURL(blob),
            link = node("a");
          link.href = url;
          link.download = "godpower-item-modules.json";
          document.body.append(link);
          link.click();
          link.remove();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          announce("已导出当前道具配置。");
        } catch (e) {
          announce("导出失败：" + e.message, true);
        }
      }),
      button("导入配置", () => {
        if (!busy) file.click();
      }),
      button("恢复全部默认", async () => {
        if (busy) return;
        busy = true;
        try {
          if (
            !(await confirmReset(
              "恢复全部道具的抽取和操作默认设置？建议先导出当前配置。",
            ))
          )
            return;
          ItemModules.update(ItemModules.defaults());
          refresh();
          announce("已恢复全部道具的默认设置。");
        } catch (e) {
          announce("恢复失败：" + e.message, true);
        } finally {
          busy = false;
        }
      }),
    );
    sidebar.append(search, count, list);
    layout.append(sidebar, editor);
    shell.append(title, actions, status, layout, file);
    const categoryTitle = host.querySelector(".ui-settings-title");
    if (categoryTitle) categoryTitle.insertAdjacentElement("afterend", shell);
    else host.append(shell);
    function announce(message, error = false) {
      status.textContent = message;
      status.classList.toggle("im-error", error);
    }
    function metadata(item = {}) {
      const defs = typeof ITEM_DEFS !== "undefined" ? ITEM_DEFS : {};
      return { ...item, ...defs[item.key], key: item.key };
    }
    function renderList() {
      const config = ItemModules.configuration();
      const filtered = catalog
        .map(metadata)
        .filter((item) =>
          [item.name, item.key, kinds[item.kind] || item.kind]
            .join(" ")
            .toLowerCase()
            .includes(query),
        );
      count.textContent = `显示 ${filtered.length} / ${catalog.length} 种道具`;
      list.replaceChildren();
      for (const item of filtered) {
        const row = button(
          "",
          () => {
            selected = item.key;
            refresh();
          },
          "im-item",
        );
        row.dataset.itemKey = item.key;
        row.classList.toggle("is-selected", item.key === selected);
        row.setAttribute("aria-pressed", String(item.key === selected));
        const enabled = config.items[item.key];
        row.append(
          itemIcon(item, "im-item-icon"),
          node("span", "im-item-name", item.name),
          node(
            "small",
            "im-item-state",
            `抽取${enabled.draw.enabled ? "开" : "关"} · 操作${enabled.operation.enabled ? "开" : "关"}`,
          ),
        );
        list.append(row);
      }
      if (!filtered.length)
        list.append(
          node("p", "im-muted im-empty", "没有匹配的道具，请更换关键词。"),
        );
    }
    function saveField(field, value, input) {
      try {
        const next = ItemModules.configuration();
        next.items[selected][pipeline][field] = value;
        ItemModules.update(next);
        input.removeAttribute("aria-invalid");
        renderList();
        announce(
          `已保存${metadata(catalog.find((item) => item.key === selected)).name}的${pipeline === "draw" ? "抽取" : "操作"}设置。`,
        );
      } catch (e) {
        if (input.type === "checkbox")
          input.checked =
            ItemModules.configuration().items[selected][pipeline][field];
        input.setAttribute("aria-invalid", "true");
        announce("保存失败：" + e.message, true);
      }
    }
    function fieldBlock(index, label, help, field, settings, numeric) {
      const block = node("label", "im-block"),
        text = node("span", "im-block-copy"),
        input = node("input");
      text.append(
        node("span", "im-block-number", `模块 ${index}`),
        node("strong", "", label),
        node("small", "im-muted", help),
      );
      input.name = `${selected}.${pipeline}.${field}`;
      input.setAttribute("aria-label", label);
      if (numeric) {
        input.type = "number";
        input.min = String(numeric.min);
        input.max = String(numeric.max);
        input.step = String(numeric.step);
        input.value = String(settings[field]);
        input.addEventListener("change", () => {
          if (input.value.trim() === "" || !input.checkValidity()) {
            input.setAttribute("aria-invalid", "true");
            announce(
              `${label}须为 ${numeric.min}–${numeric.max} 范围内的${numeric.step === 1 ? "整数" : "数值"}。`,
              true,
            );
            return;
          }
          saveField(field, Number(input.value), input);
        });
      } else {
        input.type = "checkbox";
        input.checked = settings[field];
        input.addEventListener("change", () =>
          saveField(field, input.checked, input),
        );
      }
      if (numeric) block.append(text, input);
      else {
        const toggle = node("span", "v292-switch");
        const track = node("span", "v292-switch-track");
        track.setAttribute("aria-hidden", "true");
        track.append(node("span", "v292-switch-knob"));
        toggle.append(input, track);
        block.append(text, toggle);
      }
      return block;
    }
    function renderEditor() {
      const item = metadata(catalog.find((entry) => entry.key === selected));
      if (!item.key) {
        editor.replaceChildren(node("p", "im-muted", "暂无可配置道具。"));
        return;
      }
      const settings = ItemModules.configuration().items[selected][pipeline],
        header = node("div", "im-editor-header"),
        details = node("div"),
        tabs = node("div", "im-tabs"),
        panel = node("div", "im-blocks");
      details.append(
        node("span", "im-kind", kinds[item.kind] || item.kind || "道具"),
        node("h3", "", item.name),
      );
      header.append(
        itemIcon(item, "im-editor-icon"),
        details,
        button("恢复此道具", async () => {
          if (busy) return;
          const key = selected;
          busy = true;
          try {
            if (
              !(await confirmReset(
                `恢复「${item.name}」的抽取和操作默认设置？`,
              ))
            )
              return;
            const next = ItemModules.configuration();
            next.items[key] = ItemModules.defaults().items[key];
            ItemModules.update(next);
            refresh();
            announce(`已恢复${item.name}的默认设置。`);
          } catch (e) {
            announce("恢复失败：" + e.message, true);
          } finally {
            busy = false;
          }
        }),
      );
      tabs.setAttribute("role", "tablist");
      tabs.setAttribute("aria-label", "道具流程");
      for (const [key, label] of [
        ["draw", "抽取流程"],
        ["operation", "操作流程"],
      ]) {
        const tab = button(
          label,
          () => {
            pipeline = key;
            renderEditor();
            editor.querySelector('[aria-selected="true"]').focus();
          },
          "im-tab",
        );
        tab.id = `im-tab-${key}`;
        tab.setAttribute("role", "tab");
        tab.setAttribute("aria-selected", String(pipeline === key));
        tab.setAttribute("aria-controls", "im-pipeline-panel");
        tab.tabIndex = pipeline === key ? 0 : -1;
        tab.addEventListener("keydown", (event) => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
            return;
          event.preventDefault();
          pipeline =
            event.key === "Home"
              ? "draw"
              : event.key === "End"
                ? "operation"
                : pipeline === "draw"
                  ? "operation"
                  : "draw";
          renderEditor();
          editor.querySelector('[aria-selected="true"]').focus();
        });
        tabs.append(tab);
      }
      panel.id = "im-pipeline-panel";
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", `im-tab-${pipeline}`);
      if (pipeline === "draw") {
        panel.append(
          fieldBlock(
            1,
            "允许抽取",
            "关闭后，此道具不参与随机抽取。已有道具的操作设置独立生效。",
            "enabled",
            settings,
          ),
          fieldBlock(
            2,
            "抽取权重倍率",
            "默认 1；范围 0–100。0 表示不参与抽取；原有排名与冷却等限制仍然生效。",
            "weight",
            settings,
            { min: 0, max: 100, step: "any" },
          ),
          ...(item.blocks?.draw?.includes("charges")
            ? [
                fieldBlock(
                  3,
                  "新获得道具的次数",
                  "范围 1–99，仅影响之后新获得的道具，不修改当前道具栏。",
                  "charges",
                  settings,
                  { min: 1, max: 99, step: 1 },
                ),
              ]
            : []),
        );
      } else {
        panel.append(
          fieldBlock(
            1,
            "主动使用",
            "关闭后禁止主动使用；已有道具的被动防御保留。队列、冻结和模式等原有使用条件仍生效。",
            "enabled",
            settings,
          ),
          ...(item.blocks?.operation?.includes("score")
            ? [
                fieldBlock(
                  2,
                  "积分效果倍率",
                  "默认 1；范围 0–10。仅调整此道具产生的积分效果，不改变状态持续时间与目标规则。",
                  "scoreMultiplier",
                  settings,
                  { min: 0, max: 10, step: "any" },
                ),
              ]
            : []),
          fieldBlock(
            3,
            "发动演出",
            "控制此道具发动时的动画；不控制音效与持续光环，仍遵循全局动效设置。",
            "feedback",
            settings,
          ),
        );
      }
      const reference = node("details", "im-reference");
      reference.append(
        node("summary", "", "查看实际道具说明"),
        node(
          "p",
          "im-muted",
          item.desc || "此道具的使用条件以当前规则引擎为准。",
        ),
      );
      editor.replaceChildren(
        header,
        tabs,
        node(
          "p",
          "im-pipeline-note",
          pipeline === "draw"
            ? "进入抽取池 → 权重倍率 → 新获得次数"
            : item.blocks?.operation?.includes("score")
              ? "主动使用 → 积分效果 → 发动演出"
              : "主动使用 → 发动演出",
        ),
        panel,
        reference,
      );
      const prefs =
        typeof DesktopUI !== "undefined" ? DesktopUI.getPreferences() : {};
      if (
        prefs.motion !== "off" &&
        !(
          prefs.systemMotion &&
          matchMedia("(prefers-reduced-motion: reduce)").matches
        )
      )
        panel.animate(
          [
            { opacity: 0, translate: "0 12px" },
            { opacity: 1, translate: "0 0" },
          ],
          {
            duration: 220 / (prefs.speed || 1),
            easing: "cubic-bezier(.16,1,.3,1)",
          },
        );
    }
    function refresh() {
      renderList();
      renderEditor();
    }
    mounts.set(host, { refresh });
    refresh();
    if (ItemModules.loadError)
      announce(
        "原配置无法读取，当前使用默认值；原存储未覆盖：" +
          ItemModules.loadError,
        true,
      );
  }
  async function confirmReset(message) {
    if (typeof themeConfirm === "function")
      return themeConfirm(message, { title: "恢复道具默认设置", danger: true });
    return window.confirm(message);
  }
  return { mount };
})();

globalThis.ItemModuleSettings = ItemModuleSettings;
