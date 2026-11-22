const AIKnowledgeUI = (() => {
  let own = [],
    failure = null,
    selected = null;
  const $ = (s) => document.querySelector(s);
  function safeUrl(value) {
    try {
      const u = new URL(value);
      if (
        !["https:", "http:"].includes(u.protocol) ||
        u.username ||
        u.password ||
        u.port ||
        !u.hostname.includes(".") ||
        /^[\d.]+$/.test(u.hostname) ||
        /[\[\]:]/.test(u.hostname) ||
        /(?:^|\.)(?:localhost|local|internal|invalid|test)$/.test(u.hostname)
      )
        return "";
      return u.href;
    } catch {
      return "";
    }
  }
  function sourceLink(url, label) {
    const u = safeUrl(url);
    if (!u) return document.createTextNode(label || "离线资料");
    const a = document.createElement("a");
    a.href = u;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = label || u;
    a.addEventListener("click", async (event) => {
      const desktop = window.godpowerDesktop?.ai;
      if (!desktop) return;
      event.preventDefault();
      if (typeof desktop.openSource !== "function") {
        showToast("当前桌面版未提供外部来源入口，请复制链接：" + u);
        return;
      }
      try {
        const result = await desktop.openSource(u);
        if (!result.ok) showToast("来源未打开，请复制链接：" + u);
      } catch {
        showToast("来源未打开，请复制链接：" + u);
      }
    });

    return a;
  }
  async function load() {
    try {
      own = await AIKnowledgeRepository.list();
      failure = null;
    } catch (e) {
      failure = e.message;
      throw e;
    }
  }
  async function excerpts(query, subject) {
    await load();
    return AIKnowledge.search([...SubjectLibrary, ...own], query, {
      subject,
    }).map(({ id, title, subject, text, sourceLabel, sourceUrl }) => ({
      id,
      title,
      subject,
      text,
      sourceLabel,
      sourceUrl,
    }));
  }
  function draw() {
    const root = $("#aiKnowledgeDialog");
    if (!root) return;
    const subject = $("#aiLibrarySubject").value,
      query = $("#aiLibrarySearch").value.trim().toLowerCase(),
      list = $("#aiKnowledgeList");
    list.replaceChildren();
    const all = [...SubjectLibrary, ...own],
      filtered = all.filter(
        (d) =>
          (!subject || d.subject === subject) &&
          (!query || (d.title + d.text).toLowerCase().includes(query)),
      );
    $("#aiKnowledgeCount").textContent =
      `内置原创参考27篇 · 九科教材入口9项 · 我的资料${own.length}项；不含未授权课本全文。` +
      (failure ? " 我的资料读取失败，原数据未改动。" : "");
    for (const d of filtered) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn ai-resource";
      b.textContent = `${d.subject} · ${d.title}`;
      b.setAttribute("aria-pressed", String(selected === d.id));
      b.onclick = () => {
        selected = d.id;
        show(d);
        draw();
      };
      list.append(b);
    }
    if (!filtered.length) list.textContent = "没有匹配资料。";
    if (selected && !all.some((d) => d.id === selected)) {
      selected = null;
      $("#aiKnowledgeDetail").replaceChildren();
    }
  }
  function show(d) {
    const panel = $("#aiKnowledgeDetail");
    panel.replaceChildren();
    const title = document.createElement("h3"),
      meta = document.createElement("p"),
      body = document.createElement("p");
    title.textContent = d.title;
    meta.className = "ui-muted";
    meta.textContent = `${d.subject} · ${d.kind === "textbook-link" ? "官方在线入口" : d.kind === "user-note" ? "用户导入" : "原创学习参考"} · ${d.license}`;
    body.className = "ai-resource-text";
    body.textContent = d.text;
    panel.append(title, meta, body, sourceLink(d.sourceUrl, d.sourceLabel));
    if (d.kind === "user-note") {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "btn btn-danger";
      remove.textContent = "删除这份资料";
      remove.onclick = async () => {
        if (
          !(await programConfirmV28("只删除这份导入资料，课堂数据不受影响。", {
            title: "删除资料",
            okText: "删除",
          }))
        )
          return;
        try {
          await AIKnowledgeRepository.remove(d.id);
          await load();
          if (!panel.isConnected) return;
          selected = null;
          panel.replaceChildren();
          draw();
        } catch (e) {
          if (panel.isConnected)
            $("#aiKnowledgeStatus").textContent = e.message;
        }
      };
      panel.append(remove);
    }
  }
  const download = (value) =>
    GodpowerTheme.downloadJson(value, "godpower-ai-knowledge.json");
  async function open() {
    if ($("#aiKnowledgeDialog")) return;
    const overlay = document.createElement("div");
    overlay.id = "aiKnowledgeDialog";
    overlay.className = "modal-backdrop ai-knowledge-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "aiKnowledgeHeading");
    overlay.innerHTML =
      '<section class="ai-knowledge-window ui-function-surface"><header class="ai-knowledge-header"><div><h2 id="aiKnowledgeHeading">高中学科资料</h2><p id="aiKnowledgeCount" class="ui-muted"></p></div></header><button type="button" class="item-close ui-window-close" data-ui-window-close="true" id="aiKnowledgeClose" aria-label="关闭学科资料">×</button><div class="ai-knowledge-controls"><label>学科<select id="aiLibrarySubject"><option value="">全部九科</option></select></label><label>搜索<input type="search" id="aiLibrarySearch" placeholder="教材、主题或关键词"></label><button type="button" class="btn" id="aiKnowledgeExport">导出我的资料</button></div><div class="ai-knowledge-body"><nav id="aiKnowledgeList" aria-label="资料列表"></nav><article id="aiKnowledgeDetail"><p>选择资料查看。官方教材条目为在线入口，离线可查看原创参考；导入你的教材文字后，可授权AI检索相关摘录。</p></article></div><footer class="ai-knowledge-import"><label>导入所属学科<select id="aiImportSubject"></select></label><label class="gp-file-picker"><span class="btn btn-sm">选择 TXT / Markdown / JSON</span><input type="file" id="aiKnowledgeFile" accept=".txt,.md,.json"></label><span id="aiKnowledgeStatus" role="status">最多2MB/文件；仅导入有权使用的资料。首期不解析PDF或扫描件。</span></footer></section>';
    document.body.append(overlay);
    const status = overlay.querySelector("#aiKnowledgeStatus");
    showClassroomWindow(overlay);
    const preferences = DesktopUI.getPreferences();
    if (preferences.motion === "off")
      overlay.firstElementChild.style.animation = "none";
    else
      overlay.firstElementChild.style.animationDuration =
        300 / preferences.speed + "ms";
    for (const s of AIKnowledge.subjects) {
      for (const id of ["#aiLibrarySubject", "#aiImportSubject"]) {
        const o = document.createElement("option");
        o.value = o.textContent = s;
        $(id).append(o);
      }
    }
    const focus = document.activeElement;
    const close = () =>
      hideClassroomWindow(overlay, () => {
        overlay.remove();
        focus?.focus?.();
      });
    $("#aiKnowledgeClose").onclick = close;
    overlay.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
      }
      if (e.key === "Tab") {
        const a = [
          ...overlay.querySelectorAll("button,input,select,a[href]"),
        ].filter((n) => !n.disabled && n.getClientRects().length);
        if (e.shiftKey && document.activeElement === a[0]) {
          e.preventDefault();
          a.at(-1)?.focus();
        } else if (!e.shiftKey && document.activeElement === a.at(-1)) {
          e.preventDefault();
          a[0]?.focus();
        }
      }
    });
    $("#aiLibrarySubject").onchange = draw;
    $("#aiLibrarySearch").oninput = draw;
    $("#aiKnowledgeExport").onclick = async () => {
      try {
        await load();
        download({
          format: "godpower.ai.knowledge",
          schemaVersion: 1,
          documents: own,
        });
      } catch (e) {
        status.textContent = e.message;
      }
    };
    $("#aiKnowledgeFile").onchange = async (e) => {
      const input = e.target,
        file = input.files?.[0],
        importSubject = overlay.querySelector("#aiImportSubject").value;
      if (!file) return;
      input.disabled = true;
      try {
        if (file.size > 2 * 1024 * 1024)
          throw Error("文件超过2MB，请按章节拆分导入");
        const text = await file.text();
        if (!overlay.isConnected) return;
        let documents;
        if (/\.json$/i.test(file.name)) {
          const raw = JSON.parse(text);
          if (
            !raw ||
            raw.format !== "godpower.ai.knowledge" ||
            raw.schemaVersion !== 1 ||
            Object.keys(raw).some(
              (k) => !["format", "schemaVersion", "documents"].includes(k),
            )
          )
            throw Error("资料JSON格式无效");
          documents = raw.documents;
        } else if (/\.(txt|md)$/i.test(file.name))
          documents = [
            {
              id: "import",
              title: file.name.slice(0, 160),
              subject: importSubject,
              text,
              kind: "user-note",
              sourceLabel: ("用户导入：" + file.name).slice(0, 200),
              sourceUrl: "",
              license: "用户提供，仅按其授权范围使用",
            },
          ];
        else throw Error("只支持TXT、Markdown或资料JSON");
        if (failure) throw Error("原资料库读取失败，禁止覆盖，请先恢复");
        await AIKnowledgeRepository.importDocuments(documents);
        await load();
        if (!overlay.isConnected) return;
        draw();
        status.textContent =
          "导入已保存；仅勾选引用资料并确认发送后才提供摘录给模型。";
      } catch (error) {
        status.textContent = error.message;
      } finally {
        input.value = "";
        input.disabled = false;
      }
    };
    try {
      await load();
    } catch {}
    if (!overlay.isConnected) return;
    draw();
    overlay.querySelector("#aiKnowledgeClose")?.focus();
  }
  function renderSources(entry, sources) {
    if (!sources?.length) return;
    const details = document.createElement("details"),
      summary = document.createElement("summary");
    summary.textContent = "本次提供给模型的来源（请核对引用）";
    details.append(summary);
    for (const s of sources) {
      const p = document.createElement("p");
      p.append(sourceLink(s.url, `[${s.id}] ${s.title}`));
      const note = document.createElement("small");
      note.textContent =
        s.kind !== "local-excerpt"
          ? ` 搜索摘要 · ${s.retrievedAt?.slice(0, 10) || ""}，非网页全文`
          : " 本地资料摘录";
      p.append(note);
      details.append(p);
    }
    entry.append(details);
  }
  return Object.freeze({ open, excerpts, renderSources, safeUrl });
})();
