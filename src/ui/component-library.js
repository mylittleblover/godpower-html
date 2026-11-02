/* Read-only reference surface. No command, persistence or native-window authority. */
const UIComponentLibrary = (() => {
  const definitions = [
    [
      "buttons",
      "基础控件",
      "按钮与危险操作",
      ".btn",
      "ui/application-surfaces.css",
      "buttons",
    ],
    [
      "inputs",
      "基础控件",
      "输入框、下拉与滑动条",
      ".ui-settings-row",
      "ui/desktop.css",
      "inputs",
    ],
    [
      "switches",
      "基础控件",
      "统一开关及禁用状态",
      ".ui-toggle",
      "ui/desktop.css",
      "switches",
    ],
    [
      "chips",
      "基础控件",
      "状态标签与提示",
      ".ui-chip",
      "ui/desktop.css",
      "chips",
    ],
    ["empty", "基础控件", "空状态", ".ui-empty", "ui/desktop.css", "empty"],
    [
      "navigation",
      "页面与导航",
      "顶部导航",
      ".app-topnav",
      "ui/application-surfaces.css",
    ],
    [
      "dock",
      "页面与导航",
      "比赛底栏",
      ".bottom-dock",
      "ui/application-surfaces.css",
    ],
    ["hero", "主页", "欢迎标题卡", ".gp-hero", "ui/welcome-dashboard.css"],
    [
      "home-layout",
      "主页",
      "自定义卡片网格",
      "#homeDashboardGrid",
      "ui/home-dashboard.js",
    ],
    [
      "battle-card",
      "比赛与道具",
      "小组卡片与答题按钮",
      ".group-row-card",
      "ui/battle-card-view.js",
    ],
    [
      "rank-preview",
      "比赛与道具",
      "排名预览与垫片",
      "#heightResizerDock",
      "runtime/ui/rank-preview.js",
    ],
    [
      "batch-bar",
      "比赛与道具",
      "批量操作",
      "#quickBatchBar",
      "runtime/ui/competition-summary.js",
    ],
    [
      "inventory",
      "比赛与道具",
      "主要和次要道具槽",
      ".item-slots",
      "ui/battle-grid.js",
    ],
    [
      "item-settings",
      "比赛与道具",
      "道具积木设置",
      ".im-settings",
      "ui/item-modules.js",
    ],
    [
      "item-encyclopedia",
      "比赛与道具",
      "道具百科",
      "#aboutMain",
      "runtime/items/encyclopedia-rules.js",
    ],
    ["picker", "课堂工具", "老虎机与拉杆", "#pickerModal", "ui/desktop.js"],
    [
      "hand",
      "课堂工具",
      "举手与奖励",
      "#handRaiseBackdrop",
      "runtime/classroom/hand-reward-controls.js",
    ],
    [
      "quick-person",
      "课堂工具",
      "学生筛选与赋分",
      "#quickPersonBackdropV218",
      "runtime/classroom/quick-person-score.js",
    ],
    [
      "history",
      "历史与档案",
      "历史时间轴",
      "#historyListView",
      "ui/desktop.js",
    ],
    [
      "archives",
      "历史与档案",
      "档案概览",
      "#archiveClassStats",
      "ui/desktop.js",
    ],
    [
      "archive-list",
      "历史与档案",
      "档案列表与领奖台",
      "#settlementHistoryContainer",
      "ui/desktop.js",
    ],
    [
      "settings-shell",
      "设置与资源",
      "设置导航与面板",
      "#uiSettingsShell",
      "ui/settings-layout.js",
    ],
    [
      "disclosure",
      "设置与资源",
      "可展开设置分组",
      "#uiSettingsMusic",
      "ui/disclosure-motion.js",
    ],
    [
      "sound",
      "设置与资源",
      "音效、音乐与音量",
      "#settingsV26_sound",
      "runtime/audio/settings-and-transfer.js",
    ],
    [
      "score-slots",
      "设置与资源",
      "六个固定赋分槽",
      ".cf-score-slots",
      "ui/classroom-feedback.js",
    ],
    [
      "roster",
      "设置与资源",
      "名单与头像工作区",
      "#classroomRosterWorkspace",
      "ui/classroom-roster-workspace.js",
    ],
    [
      "schedule",
      "设置与资源",
      "课程表与课堂上下文",
      "#teachingScheduleWorkspace",
      "ui/teaching-workspace.js",
    ],
    [
      "resources",
      "设置与资源",
      "教学资源库",
      "#teachingResourceWorkspace",
      "ui/teaching-resource-workspace.js",
    ],
    [
      "bank",
      "设置与资源",
      "知识与题目编辑",
      "#uiStructuredBank",
      "ui/content-bank-editor.js",
    ],
    [
      "recovery",
      "设置与资源",
      "存储与迁移恢复",
      "#classroomRecoveryTools",
      "ui/classroom-recovery.js",
    ],
    [
      "score-window",
      "窗口与反馈",
      "积分输入窗口",
      "#scoreModalBackdrop",
      "runtime/ui/score-dialog-and-animation.js",
    ],
    [
      "password-window",
      "窗口与反馈",
      "管理口令窗口",
      "#pwdModal",
      "runtime/ui/admin-lock.js",
    ],
    [
      "member-window",
      "窗口与反馈",
      "成员搜索窗口",
      "#memberSearchBackdrop",
      "runtime/ui/member-search.js",
    ],
    [
      "group-window",
      "窗口与反馈",
      "小组详情与道具仓库",
      "#itemModalBackdrop",
      "runtime/items/group-window.js",
    ],
    [
      "settlement-name",
      "窗口与反馈",
      "结算命名窗口",
      "#settlementNameModal",
      "runtime/archives/settlement-actions.js",
    ],
    [
      "settlement-show",
      "窗口与反馈",
      "封神榜结算演出",
      "#grandModalOverlay",
      "runtime/archives/full-settlement.js",
    ],
    [
      "import-window",
      "窗口与反馈",
      "名单导入窗口",
      "#batchImportModal",
      "runtime/classroom/roster-text-import.js",
    ],
    [
      "about-window",
      "窗口与反馈",
      "说明与百科窗口",
      "#aboutBackdrop",
      "runtime/ui/settings-and-about.js",
    ],
    [
      "welcome-window",
      "窗口与反馈",
      "启动欢迎窗口",
      "#welcomeModal",
      "ui/welcome-dashboard.js",
    ],
    [
      "theme-confirm",
      "窗口与反馈",
      "统一确认与警告",
      "#themeDialogV21727",
      "runtime/ui/theme-dialog.js",
    ],
    [
      "program-confirm",
      "窗口与反馈",
      "兼容确认窗口",
      "#programConfirmV28",
      "runtime/ui/program-confirmation.js",
    ],
    [
      "fullscreen",
      "窗口与反馈",
      "全屏点名与赋分",
      "#classroomShowcase",
      "ui/classroom-feedback.js",
    ],
    ["toast", "窗口与反馈", "全局Toast", "#toast", "runtime/ui/toast.js"],
    [
      "tooltip",
      "窗口与反馈",
      "悬停提示",
      "#godpower-hover-tooltip",
      "ui/tooltips.js",
    ],
    [
      "defense-notice",
      "窗口与反馈",
      "防御通知",
      "#topNoticeStackV21735",
      "runtime/ui/defense-notices.js",
    ],
  ].map(([id, category, name, selector, source, sample]) => ({
    id,
    category,
    name,
    selector,
    sources: ["src/" + source],
    sample,
  }));
  const home = [
    ["core.group-count", "参赛小组"],
    ["core.total-score", "班级总积分"],
    ["core.top-score", "最高小组积分"],
    ["core.leading-group", "当前领跑"],
    ["core.live-ranking", "实时排名"],
    ["core.recent-activity", "赛场动态"],
    ["core.group-showcase", "小组竞技场"],
    ["core.history-honor", "历史荣誉"],
    ["core.daily-knowledge", "每日知识"],
    ["core.daily-item-tip", "道具小知识"],
    ["core.daily-challenge", "课堂挑战"],
  ].map(([type, name]) => ({
    id: "home-" + type,
    category: "主页卡片",
    name,
    selector: `[data-home-card-type="${type}"]`,
    sources: ["src/ui/home-dashboard.js"],
  }));
  const conflicts = [
    {
      id: "switch-skin",
      category: "已统一",
      name: "旧渐变轨道与新扁平开关",
      description:
        "保留现行扁平配色、52×28内容区和同一边框；旧v292结构只做兼容，不再维护另一套渐变皮肤。",
    },
    {
      id: "switch-focus",
      category: "已统一",
      name: "开关重复焦点框",
      description:
        "只保留轨道上的可见焦点框，移除同时出现在外层与轨道的双重描边。",
    },
    {
      id: "switch-disabled",
      category: "已统一",
      name: "隐藏输入框的禁用透明度冲突",
      description:
        "兼容开关的透明输入保持隐藏，禁用态施加于轨道；普通偏好开关仍使用相同的半透明禁用反馈。",
    },
    {
      id: "selection-semantics",
      category: "保留语义",
      name: "选择框与布尔开关",
      description:
        "批量选择仍为选择操作；不把语义不同的控件强行替换为开关，不改原事件和存储键。",
    },
  ];
  const settings = GodPowerSettingsLayout.categories.map(([id, , name]) => ({
    id: "settings-" + id,
    category: "设置分类",
    name,
    selector: `[data-category-panel="${id}"]`,
    sources: ["src/ui/settings-layout.js"],
  }));
  let expandedPreview = false;
  let root = null,
    shadow = null,
    selected = null,
    mode = "components",
    previewTheme = "current",
    styleCache = null;
  let nodeEntries = [];
  const $ = (selector) => root?.querySelector(selector);
  const create = (tag, text, className) => {
    const n = document.createElement(tag);
    if (text !== undefined) n.textContent = text;
    if (className) n.className = className;
    return n;
  };
  const entries = () => {
    if (mode === "styles")
      return GodPowerComponentCatalog.classes.map((x) => ({
        ...x,
        id: "class-" + x.name,
        name: "." + x.name,
        category: "完整样式索引（含兼容）",
        selector: "." + CSS.escape(x.name),
        sample: "class",
      }));
    if (mode === "animations")
      return GodPowerComponentCatalog.animations.map((x) => ({
        ...x,
        id: "animation-" + x.name,
        category: "动效定义（含兼容）",
        sample: "animation",
      }));
    if (mode === "tokens")
      return GodPowerComponentCatalog.tokens.map((x) => ({
        ...x,
        id: x.name,
        category: "设计变量",
      }));
    if (mode === "nodes") return nodeEntries;
    if (mode === "conflicts") return conflicts;
    const items = Object.entries(ITEM_DEFS).map(([key, item]) => ({
      id: "item-" + key,
      name: item.name,
      category: "26种道具",
      sources: ["src/runtime/items/definitions-and-state.js"],
      sample: "item",
      key,
    }));
    return [...definitions, ...home, ...settings, ...items];
  };
  function nodeIndex() {
    return [...document.querySelectorAll("[id]")]
      .filter((n) => !n.closest("#componentLibraryModal"))
      .map((n) => ({
        id: "node-" + n.id,
        name: "#" + n.id,
        category: "当前页面节点",
        selector: "#" + CSS.escape(n.id),
        sources: ["当前实际DOM"],
      }));
  }
  function safeUrl(value) {
    return /^(?:data:|blob:|#)/i.test(value.trim());
  }
  function sanitize(tree) {
    const blocked =
      /^(SCRIPT|IFRAME|OBJECT|EMBED|LINK|STYLE|AUDIO|VIDEO|SOURCE|BASE|META|FOREIGNOBJECT|ANIMATE|SET|ANIMATEMOTION|ANIMATETRANSFORM)$/i;
    if (blocked.test(tree.tagName))
      return create(
        "p",
        "脚本、嵌入或资源节点只列出来源，不执行预览。",
        "ui-snapshot-note",
      );
    for (const node of [tree, ...tree.querySelectorAll("*")]) {
      if (blocked.test(node.tagName)) {
        node.remove();
        continue;
      }
      for (const attr of [...node.attributes]) {
        if (attr.name.toLowerCase() === "style")
          node.setAttribute("style", resourceSafeCss(attr.value));
        if (
          /^on/i.test(attr.name) ||
          [
            "action",
            "formaction",
            "target",
            "srcdoc",
            "srcset",
            "autofocus",
          ].includes(attr.name.toLowerCase())
        )
          node.removeAttribute(attr.name);
        else if (
          ["src", "href", "xlink:href", "poster"].includes(
            attr.name.toLowerCase(),
          ) &&
          !safeUrl(attr.value)
        )
          node.removeAttribute(attr.name);
      }
      if (node.matches("a")) node.removeAttribute("href");
      if (node.matches('input[type="password"],input[type="file"]')) {
        node.removeAttribute("value");
        node.value = "";
      }
      if (node.matches("form")) node.setAttribute("inert", "");
    }
    tree.inert = true;
    return tree;
  }
  function resourceSafeCss(text) {
    return text
      .replace(/@import[\s\S]*?;/gi, "")
      .replace(
        /url\(\s*(?:(["'])(.*?)\1|([^)]*))\s*\)/gi,
        (_, quote, quoted, raw) => {
          const url = (quoted ?? raw ?? "").trim();
          return safeUrl(url) ? "url(" + JSON.stringify(url) + ")" : "none";
        },
      );
  }
  function previewStyles() {
    if (styleCache !== null) return styleCache;
    const parts = [];
    for (const style of document.querySelectorAll("style")) {
      // Keep raw declarations: CSSOM reserialization can drop a var() background
      // shorthand when the same rule also sets background-image.
      parts.push(
        ComponentPreviewStyle.scope(resourceSafeCss(style.textContent)),
      );
    }
    styleCache = parts.join("\n");
    return styleCache;
  }
  function liveSample(entry) {
    const node = entry.selector
      ? [...document.querySelectorAll(entry.selector)].find(
          (n) => !n.closest("#componentLibraryModal"),
        )
      : null;
    if (!node || node === document.body || node === document.documentElement)
      return null;
    let tree = node.cloneNode(true);
    // Capture input presentation only; password and file data are never copied.
    const originals = [node, ...node.querySelectorAll("input,textarea,select")];
    const copies = [tree, ...tree.querySelectorAll("input,textarea,select")];
    originals.forEach((n, i) => {
      const copy = copies[i];
      if (!copy) return;
      if (n.matches("input:not([type=password]):not([type=file])")) {
        copy.setAttribute("value", n.value);
        copy.toggleAttribute("checked", n.checked);
      }
      if (n.matches("textarea")) copy.textContent = n.value;
    });
    tree.hidden = false;
    if (expandedPreview)
      for (const details of [tree, ...tree.querySelectorAll("details")])
        if (details.tagName === "DETAILS") details.open = true;
    if (
      /窗口|演出|老虎机|举手|全屏/.test(entry.name) ||
      node.matches(
        '.modal-overlay,[class$="-backdrop"],.grand-modal-overlay,.about-backdrop',
      )
    ) {
      tree.classList.add("active", "show");
      tree.style.display = "flex";
    } else if (getComputedStyle(node).display === "none")
      tree.style.display = "block";
    let parent = node.parentElement;
    while (
      parent &&
      parent !== document.body &&
      parent !== document.documentElement
    ) {
      const wrapper = parent.cloneNode(false);
      wrapper.hidden = false;
      if (wrapper.classList.contains("view")) {
        wrapper.classList.add("active");
        wrapper.style.removeProperty("display");
      }
      if (wrapper.tagName === "DETAILS") wrapper.open = true;
      wrapper.append(tree);
      tree = wrapper;
      parent = parent.parentElement;
    }
    return {
      tree: sanitize(tree),
      view: node.closest(".view")?.id.replace("view-", "") || "battle",
      kind: "真实DOM只读快照；不执行原操作",
    };
  }
  function sample(entry) {
    const wrap = create("section");
    wrap.className = "ui-panel";
    if (entry.sample === "buttons")
      wrap.innerHTML =
        '<div class="ui-toolbar"><button class="btn">普通按钮</button><button class="btn btn-primary">主要操作</button><button class="btn btn-success">成功</button><button class="btn btn-warning">警告</button><button class="btn btn-danger">危险操作</button><button class="btn btn-primary" disabled>禁用</button><button class="btn btn-sm">小按钮</button><button class="btn" aria-busy="true">处理中…</button></div>';
    else if (entry.sample === "inputs")
      wrap.innerHTML =
        '<section id="view-settings"><div class="ui-settings-row"><label>文本输入</label><input placeholder="请输入内容"></div><div class="ui-settings-row"><label>数值输入</label><input type="number" value="5"></div><div class="ui-settings-row"><label>下拉选择</label><select><option>标准</option><option>舒缓</option></select></div><div class="ui-settings-row"><label>音量滑条</label><input type="range" value="65"></div><textarea aria-label="多行输入">多行文本示例</textarea></section>';
    else if (entry.sample === "switches")
      wrap.innerHTML =
        '<section id="view-settings"><div class="ui-settings-row"><span>原生偏好开关 · 开</span><input type="checkbox" checked></div><div class="ui-settings-row"><span>兼容结构 · 开</span><label class="ui-toggle"><input type="checkbox" checked><span class="ui-toggle-track"><span class="ui-toggle-knob"></span></span></label></div><div class="ui-settings-row"><span>原生开关 · 关/禁用</span><input type="checkbox" disabled></div><div class="ui-settings-row"><span>兼容结构 · 关/禁用</span><label class="ui-toggle"><input type="checkbox" disabled><span class="ui-toggle-track"><span class="ui-toggle-knob"></span></span></label></div></section>';
    else if (entry.sample === "chips")
      wrap.innerHTML =
        '<span class="ui-chip">状态标签</span><p class="ui-snapshot-note">提示信息示例</p><p class="ui-positive">+5 分</p><p class="ui-negative">−5 分</p>';
    else if (entry.sample === "empty")
      wrap.innerHTML =
        '<div class="ui-empty"><h3>暂无内容</h3><p>空状态样式预览，不创建课堂数据。</p><button class="btn btn-primary">主要入口</button></div>';
    else if (entry.sample === "item") {
      const item = ITEM_DEFS[entry.key];
      const src =
        Reliability.safeImage(state.itemGlobal?.customIcons?.[entry.key]) ||
        BUILTIN_ITEM_ICONS_V2121[entry.key];
      if (src) {
        const image = create("img");
        image.src = src;
        image.alt = item.name;
        image.width = 64;
        image.height = 64;
        image.style.objectFit = "contain";
        wrap.append(image);
      } else wrap.append(create("span", item.icon));
      wrap.append(
        create("h3", item.name),
        create("p", item.desc),
        create("p", "库存、使用限制与实际效果由原道具引擎负责。", "ui-muted"),
      );
    } else if (entry.sample === "animation") {
      wrap.textContent = "现行动效 · " + entry.name;
      wrap.style.animation = `${entry.name} 1600ms var(--motion-ease) both`;
      wrap.style.minHeight = "120px";
    } else {
      wrap.className = entry.name?.startsWith(".")
        ? entry.name.slice(1)
        : "ui-panel";
      wrap.append(create("p", entry.name + " · 结构示例"));
      if (/^(effect-|cfx-|hit-|bm-)/.test(wrap.className))
        wrap.classList.add("group-row-card", "battle-card");
    }
    return {
      tree: sanitize(wrap),
      view: "settings",
      kind: "结构样例；没有创建或触发业务状态",
    };
  }
  function showPreview(entry) {
    const host = create("div", undefined, "component-library-preview");
    host.setAttribute("aria-label", "只读组件预览");
    $("#componentLibraryDetail").append(host);
    shadow = host.attachShadow({ mode: "closed" });
    const style = create("style");
    style.textContent = previewStyles();
    const html = document.createElement("html"),
      body = document.createElement("body");
    body.className = document.body.className;
    for (const [key, value] of Object.entries(document.body.dataset))
      body.dataset[key] = value;
    const theme =
      previewTheme === "current" ? GodpowerTheme.get() : previewTheme;
    body.classList.toggle("theme-marx", theme === "marx");
    body.dataset.theme = html.dataset.theme = theme;
    const source =
      entry.sample && entry.sample !== "class"
        ? sample(entry)
        : liveSample(entry) || sample(entry);
    body.dataset.currentView = source.view;
    body.style.margin = "0";
    body.style.padding = "18px";
    body.style.minHeight = "100%";
    body.append(source.tree);
    html.append(body);
    shadow.append(style, html);
    $("#componentLibraryDetail").append(
      create(
        "p",
        source.kind + "。切换预览主题不会保存或改变应用主题。",
        "component-library-note",
      ),
    );
    return source.kind;
  }
  function detail(entry) {
    selected = entry;
    const panel = $("#componentLibraryDetail");
    shadow?.replaceChildren();
    shadow = null;
    panel.replaceChildren();
    panel.append(create("h3", entry.name));
    panel.append(
      create(
        "p",
        (entry.sources || []).join(" · ") || entry.category,
        "component-library-source",
      ),
    );
    if (mode === "tokens") {
      const value = getComputedStyle(document.body)
        .getPropertyValue(entry.name)
        .trim();
      panel.append(create("code", entry.name));
      const card = create(
        "p",
        value || "当前主题或组件上下文尚未解析。",
        "component-library-note",
      );
      if (value && CSS.supports("color", value)) {
        const swatch = create("span", undefined, "component-library-swatch");
        swatch.style.background = value;
        card.prepend(swatch);
      }
      panel.append(card);
    } else if (mode === "conflicts")
      panel.append(create("p", entry.description, "component-library-note"));
    else showPreview(entry);
    for (const button of $("#componentLibraryList").querySelectorAll("button"))
      button.setAttribute(
        "aria-current",
        String(button.dataset.componentId === entry.id),
      );
  }
  function renderList() {
    const query = $("#componentLibrarySearch").value.trim().toLowerCase();
    const list = entries().filter((e) =>
      [e.name, e.category, ...(e.sources || [])]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
    const fragment = document.createDocumentFragment();
    for (const entry of list) {
      const button = create("button");
      button.type = "button";
      button.dataset.componentId = entry.id;
      button.append(
        create("span", entry.name),
        create("small", entry.category),
      );
      button.onclick = () => detail(entry);
      fragment.append(button);
    }
    $("#componentLibraryList").replaceChildren(fragment);
    $("#componentLibraryCount").textContent = `${list.length} 项`;
    if (!list.length) {
      shadow?.replaceChildren();
      shadow = null;
      $("#componentLibraryDetail").replaceChildren(
        create(
          "p",
          "没有匹配项，请尝试其他名称或源文件。",
          "component-library-note",
        ),
      );
      return;
    }
    detail(list.find((e) => e.id === selected?.id) || list[0]);
  }
  function ensureRoot() {
    if (root) return;
    root = create("div", undefined, "modal-overlay component-library-overlay");
    root.id = "componentLibraryModal";
    root.innerHTML =
      '<section class="component-library-surface ui-function-surface" role="dialog" aria-modal="true" aria-labelledby="componentLibraryTitle"><header class="component-library-header"><h2 id="componentLibraryTitle">现行 UI 组件库</h2><p>真实组件与完整样式索引 · 只读预览，不影响课堂数据</p><button type="button" class="item-close ui-window-close" data-ui-window-close aria-label="关闭组件库">×</button></header><div class="component-library-toolbar"><select id="componentLibraryMode" aria-label="目录类型"><option value="components">现行组件</option><option value="styles">完整样式索引</option><option value="animations">现行动效</option><option value="tokens">设计变量</option><option value="nodes">当前节点索引</option><option value="conflicts">冲突与统一记录</option></select><input id="componentLibrarySearch" type="search" placeholder="搜索名称、类别或源文件" aria-label="搜索组件"><label>预览主题<select id="componentLibraryTheme"><option value="current">当前主题</option><option value="classic">经典</option><option value="marx">马克思</option></select></label><button type="button" class="btn btn-sm" id="componentLibraryExpand" aria-pressed="false">展开示例</button><button type="button" class="btn btn-sm" id="componentLibraryRefresh">刷新预览</button><span id="componentLibraryCount" class="component-library-count"></span></div><div class="component-library-content"><nav id="componentLibraryList" class="component-library-list" aria-label="组件列表"></nav><main id="componentLibraryDetail" class="component-library-detail"></main></div></section>';
    document.body.append(root);
    root.firstElementChild.append(root.querySelector("[data-ui-window-close]"));
    root.querySelector("[data-ui-window-close]").onclick = close;
    root.addEventListener("click", (event) => {
      if (event.target === root) close();
    });
    $("#componentLibrarySearch").oninput = renderList;
    $("#componentLibraryMode").onchange = (event) => {
      mode = event.target.value;
      renderList();
    };
    $("#componentLibraryTheme").onchange = (event) => {
      previewTheme = event.target.value;
      if (selected) detail(selected);
    };
    $("#componentLibraryExpand").onclick = () => {
      expandedPreview = !expandedPreview;
      $("#componentLibraryExpand").setAttribute(
        "aria-pressed",
        String(expandedPreview),
      );
      $("#componentLibraryExpand").textContent = expandedPreview
        ? "还原展开状态"
        : "展开示例";
      if (selected) detail(selected);
    };
    $("#componentLibraryRefresh").onclick = () => {
      styleCache = null;
      nodeEntries = nodeIndex();
      renderList();
    };
  }
  function open() {
    ensureRoot();
    styleCache = null;
    nodeEntries = nodeIndex();
    showClassroomWindow(root);
    renderList();
    requestAnimationFrame(() =>
      $("#componentLibrarySearch")?.focus({ preventScroll: true }),
    );
  }
  function close() {
    if (!root) return;
    hideClassroomWindow(root, () => {
      root.classList.remove("active");
      shadow?.replaceChildren();
      shadow = null;
      $("#componentLibraryDetail").replaceChildren();
      styleCache = null;
    });
  }
  function mount(host) {
    if (!host || host.querySelector("#uiComponentLibraryEntry")) return;
    const details = create("details", undefined, "ui-settings-disclosure");
    details.id = "uiComponentLibraryEntry";
    details.innerHTML =
      '<summary><b>界面维护参考</b><span>组件与样式 · 低频维护</span></summary><div class="ui-settings-detail-body"><p class="ui-muted">只读查看现行组件、样式来源与设计变量。</p><button type="button" class="btn btn-sm" id="openComponentLibrary">打开组件库</button></div>';
    host.append(details);
    details.querySelector("button").onclick = open;
  }
  return Object.freeze({
    mount,
    open,
    close,
    getStatus: () => ({
      components:
        definitions.length +
        home.length +
        settings.length +
        Object.keys(ITEM_DEFS).length,
      styles: GodPowerComponentCatalog.classes.length,
      animations: GodPowerComponentCatalog.animations.length,
      tokens: GodPowerComponentCatalog.tokens.length,
      mode,
      selected: selected?.id || null,
      previewActive: !!shadow,
      closedShadow: true,
    }),
  });
})();
