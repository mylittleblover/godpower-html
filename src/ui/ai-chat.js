/* AI presentation and explicit teacher approvals; classroom state remains authoritative. */
const AIChat = (() => {
  let mounted = false,
    viewEpoch = 0,
    request = null,
    version = 0,
    config = null;
  let library = null,
    savedRevision = 0,
    saveQueue = Promise.resolve(),
    storageBlocked = false;
  const bridge = () => window.godpowerDesktop?.ai;
  const $ = (s) => document.querySelector(s);
  function capture() {
    const saveStatus = SaveManager.status(),
      context = SaveManager.context();
    return {
      saveId: context?.saveId,
      generation: context?.generation,
      revision: saveStatus.revision,
      viewEpoch,
      groups: state.groups.map((g, i) => ({
        uid: g.groupUid,
        id: g.id,
        no: g.groupNo || i + 1,
        label: g.name,
        score: g.score,
      })),
    };
  }
  const gateway = AIToolGateway.create({
    capture,
    id: () => crypto.randomUUID(),
    blocked: () =>
      state.isLocked
        ? "请先解除课堂管理锁"
        : ClassroomWriteBarrier.conflict()?.error ||
          (classroomCommands.isPending() ||
          SaveManager.status().phase === "saving"
            ? "课堂正在保存，请稍后重试"
            : null),
    execute: async (group, delta) => {
      if (ManualScoreCommands.adjust(group.id, delta) !== true)
        return { ok: false, error: "课堂拒绝该操作" };
      const result = await classroomCommands.whenIdle();
      return {
        ok: result.ok === true,
        persisted: result.persisted === true,
        error: result.error,
      };
    },
    navigate: (route) => switchView(route),
  });
  function activeConversation() {
    return library?.conversations.find((c) => c.id === library.activeId);
  }
  function persistConversation() {
    if (!library || storageBlocked) return Promise.resolve(false);
    const candidate = AIConversations.validate(library);
    $("#aiSavedState").textContent = "正在保存对话…";
    saveQueue = saveQueue.then(async () => {
      if (storageBlocked) return false;
      try {
        const saved = await AIConversationRepository.save(
          candidate,
          savedRevision,
        );
        savedRevision = saved.revision;
        library.revision = savedRevision;
        $("#aiSavedState").textContent = "对话已保存到此设备";
        return true;
      } catch (error) {
        storageBlocked = true;
        $("#aiSavedState").textContent =
          "对话未保存：" + error.message + "。请导出备份；原记录保持不变。";
        return false;
      }
    });
    return saveQueue;
  }
  function conversationList() {
    const list = $("#aiConversationList"),
      query = $("#aiSearch").value.trim().toLocaleLowerCase();
    list.replaceChildren();
    for (const c of library.conversations) {
      if (query && !c.title.toLocaleLowerCase().includes(query)) continue;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn ai-session";
      b.textContent = c.title;
      b.dataset.conversation = c.id;
      b.setAttribute("aria-current", String(c.id === library.activeId));
      b.onclick = () => {
        stop();
        viewEpoch++;
        library = AIConversations.select(library, c.id);
        renderConversation();
        void persistConversation();
      };
      list.append(b);
    }
  }
  function renderConversation() {
    $("#aiMessages").replaceChildren();
    const c = activeConversation();
    $("#aiConversationTitle").value = c.title;
    for (const m of c.messages)
      message(m.role, m.text, { restore: true, id: m.id });
    conversationList();
    $("#aiPrompt").value = "";
    $("#aiShareHistory").checked = false;
  }
  async function loadConversations() {
    try {
      library = await AIConversationRepository.load();
      savedRevision = library?.revision || 0;
      if (!library) {
        library = AIConversations.create({
          id: crypto.randomUUID(),
          time: new Date().toISOString(),
        });
        renderConversation();
        message(
          "assistant",
          "你好。默认使用离线规则助手；模型消息仅在你逐次确认后发送。",
        );
      } else renderConversation();
      if (!storageBlocked)
        $("#aiSavedState").textContent =
          "对话已从此设备恢复；旧操作不会自动执行";
    } catch (error) {
      storageBlocked = true;
      library = AIConversations.create({
        id: crypto.randomUUID(),
        time: new Date().toISOString(),
      });
      renderConversation();
      $("#aiSavedState").textContent =
        "原对话库无法读取，已禁止覆盖：" +
        error.message +
        "。本次记录仅保留在内存，可导出。";
    }
    $("#aiSend").disabled = false;
  }
  function message(role, text, options = {}) {
    const id = options.id || crypto.randomUUID();
    if (library && !options.restore) {
      try {
        library = AIConversations.append(library, library.activeId, {
          id,
          role,
          text,
          channel:
            options.channel || (role === "receipt" ? "receipt" : "offline"),
          complete: options.complete !== false,
        });
        void persistConversation();
      } catch (error) {
        $("#aiSavedState").textContent =
          "对话未记录：" + error.message + "。请先导出。";
        if (options.required) throw error;
      }
    }

    const entry = document.createElement("article");
    entry.className = "ai-message";
    entry.dataset.role = role;
    entry.dataset.messageId = id;
    const label = document.createElement("small");
    label.textContent =
      role === "user" ? "你" : role === "assistant" ? "课堂助手" : "操作回执";
    const body = document.createElement("p");
    body.textContent = text;
    entry.append(label, body);
    $("#aiMessages").append(entry);
    while ($("#aiMessages").children.length > 60)
      $("#aiMessages").firstElementChild.remove();
    if (currentView === "ai") {
      entry.scrollIntoView({ block: "nearest" });
      const p = DesktopUI.getPreferences();
      if (
        !options.restore &&
        p.motion !== "off" &&
        !(
          p.systemMotion &&
          matchMedia("(prefers-reduced-motion: reduce)").matches
        )
      )
        entry.animate(
          [
            { opacity: 0, translate: "0 8px" },
            { opacity: 1, translate: "0 0" },
          ],
          { duration: 180 / p.speed, easing: "cubic-bezier(.2,.8,.2,1)" },
        );
    }
    return entry;
  }
  function stop() {
    version++;
    if (request) void bridge()?.cancel(request);
    request = null;
    gateway.cancel();
    if (mounted) {
      $("#aiSend").disabled = false;
      $("#aiStop").disabled = true;
      $("#aiConsent").checked = false;
    }
  }
  function viewChanged() {
    viewEpoch++;
    if (request) {
      stop();
      message(
        "receipt",
        "页面已切换，请重新发送请求。待确认的操作不会自动执行。",
      );
    }
  }
  function receiptLog() {
    const node = $("#aiAudit");
    node.textContent =
      gateway
        .audit()
        .slice(-8)
        .map(
          (r) =>
            `${new Date(r.time).toLocaleTimeString()} · ${r.intent} · ${r.status}${r.persisted ? " · 已保存" : ""}`,
        )
        .join("\n") || "尚无操作回执。";
  }
  function proposal(action, snapshot) {
    const p = gateway.propose(action, snapshot);
    if (p.kind !== "score") {
      receiptLog();
      return;
    }
    const ownerConversation = library?.activeId;
    const node = message(
      "receipt",
      `${p.label}\n${p.before} → ${p.after} 分（${p.delta > 0 ? "+" : ""}${p.delta}）\n教师确认后调用原手动积分命令；可通过原历史功能撤销。`,
    );
    node.dataset.proposal = p.id;
    const approve = document.createElement("button"),
      reject = document.createElement("button");
    approve.type = reject.type = "button";
    approve.className = "btn btn-primary";
    reject.className = "btn";
    approve.textContent = "确认并执行";
    reject.textContent = "拒绝";
    approve.onclick = async () => {
      approve.disabled = reject.disabled = true;
      const r = await gateway.confirm(p.id, true);
      if (library?.activeId !== ownerConversation) return;
      const text = r.ok
        ? r.persisted
          ? "积分已更新并保存。"
          : "积分已更新但未持久保存，请立即导出备份。"
        : r.error;
      message("receipt", text);
      node.dataset.result = r.ok ? "done" : "failed";
      receiptLog();
    };
    reject.onclick = () => {
      approve.disabled = reject.disabled = true;
      node.dataset.result = "rejected";
      reject.textContent = "已拒绝";
      gateway.reject(p.id);
    };
    node.append(approve, reject);
  }
  async function send(event) {
    event.preventDefault();
    if (request || !library || $("#aiSend").disabled) return;
    if (activeConversation().messages.length > 90) {
      $("#aiSavedState").textContent =
        "当前对话接近100条上限，请导出并新建对话。";
      return;
    }
    const input = $("#aiPrompt"),
      text = input.value.trim();
    if (!text) return;
    if (text.length > 4000) {
      message("receipt", "输入不能超过4000字。");
      return;
    }
    const snapshot = capture(),
      ownVersion = ++version,
      cloud = $("#aiMode").value === "model",
      shareScores = $("#aiShareScores").checked,
      conversationId = library.activeId,
      history =
        cloud && $("#aiShareHistory").checked
          ? AIConversations.context(library, conversationId)
          : [];
    if (cloud && !$("#aiConsent").checked) {
      message("receipt", "请先确认本次发送的数据范围。");
      return;
    }
    const useLocal = cloud && $("#aiUseKnowledge").checked,
      useWeb = cloud && $("#aiUseWeb").checked;
    const research =
      useLocal || useWeb
        ? {
            local: useLocal,
            webQuery: useWeb ? $("#aiWebQuery").value.trim() : "",
            documents: [],
          }
        : undefined;
    if (useWeb && !research.webQuery) {
      $("#aiSavedState").textContent =
        "请输入本次联网关键词；不会自动将整段对话发给搜索站点。";
      return;
    }
    $("#aiSend").disabled = true;
    $("#aiStop").disabled = false;
    try {
      if (useLocal)
        research.documents = await AIKnowledgeUI.excerpts(
          text,
          $("#aiKnowledgeSubject").value,
        );
      if (ownVersion !== version) return;
      if (
        snapshot.viewEpoch !== viewEpoch ||
        library.activeId !== conversationId
      ) {
        stop();
        return;
      }
      if (useLocal && !research.documents.length && !useWeb)
        throw Error(
          "没有匹配的本地资料，请调整问题或学科，也可以取消引用资料后发送。",
        );
    } catch (error) {
      if (ownVersion === version) {
        $("#aiSavedState").textContent = error.message;
        $("#aiSend").disabled = false;
        $("#aiStop").disabled = true;
      }
      return;
    }
    let responseSources = [];
    let userMessage;
    try {
      userMessage = message("user", text, {
        channel: cloud ? "model" : "offline",
        complete: !cloud,
        required: true,
      });
    } catch {
      $("#aiSend").disabled = false;
      $("#aiStop").disabled = true;
      return;
    }
    $("#aiSend").disabled = true;
    $("#aiStop").disabled = false;
    await saveQueue;
    if (ownVersion !== version) return;
    if (
      snapshot.viewEpoch !== viewEpoch ||
      library.activeId !== conversationId
    ) {
      stop();
      return;
    }
    input.value = "";
    $("#aiSend").disabled = true;
    $("#aiStop").disabled = false;
    try {
      let result;
      if (!cloud) result = AIToolGateway.offline(text, snapshot);
      else {
        if (!bridge()) throw Error("模型连接仅在Electron中可用");
        request = crypto.randomUUID();
        const response = await bridge().request({
          id: request,
          text,
          consent: true,
          groups: !research && shareScores ? gateway.publicContext() : [],
          history,
          ...(research ? { research } : {}),
        });
        if (!response.ok) throw Error(response.error);
        result = AIToolGateway.parseReply(response.text);
        if (research) {
          result.actions = [];
          responseSources = Array.isArray(response.sources)
            ? response.sources
            : [];
        }
        if (
          !shareScores &&
          result.actions.some((a) => a.intent === "adjustScore")
        )
          throw Error(
            "本次未授权小组上下文，无法准备改分；请勾选匿名积分或使用离线指令",
          );
      }
      if (ownVersion !== version || library.activeId !== conversationId) return;
      const now = capture();
      if (
        ["saveId", "generation", "revision", "viewEpoch"].some(
          (k) => snapshot[k] !== now[k],
        )
      )
        throw Error("课堂或页面已变化，响应已丢弃，请重新发送");
      const answerNode = message("assistant", result.reply, {
        channel: cloud ? "model" : "offline",
        required: true,
      });
      if (cloud) {
        library = AIConversations.update(
          library,
          conversationId,
          userMessage.dataset.messageId,
          { complete: true },
        );
        void persistConversation();
      }
      if (responseSources.length) {
        AIKnowledgeUI.renderSources(answerNode, responseSources);
        message(
          "receipt",
          "本次提供给模型的来源（不代表全文核验）：\n" +
            responseSources
              .map(
                (s) =>
                  `[${s.id}] ${s.title} · ${s.kind === "local-excerpt" ? "本地摘录" : "搜索摘要"}${s.url ? "\n" + s.url : ""}`,
              )
              .join("\n"),
        );
      }
      for (const action of result.actions) proposal(action, snapshot);
    } catch (error) {
      if (ownVersion === version)
        message("receipt", error.message || "请求未完成");
    } finally {
      if (ownVersion === version) {
        request = null;
        $("#aiSend").disabled = false;
        $("#aiStop").disabled = true;
        $("#aiConsent").checked = false;
      }
    }
  }
  function status() {
    if (!mounted) return;
    $("#aiRemember").checked = config?.remembered === true;
    $("#aiConnection").textContent = config
      ? `${config.provider} · ${config.model}${config.keyPresent || config.provider === "ollama" ? " · 已配置" : " · 未配置密钥"}`
      : "离线规则助手 · 无网络请求";
    $("#aiModelState").textContent = bridge()
      ? config?.remembered
        ? "密钥由系统加密保存。"
        : "密钥仅本次进程可用；关闭程序后需重新输入。"
      : "网页离线版不保存模型密钥。模型连接需要Electron桌面版，离线课堂助手仍然可用。";
  }
  async function loadConfig() {
    if (bridge()) {
      const r = await bridge().status();
      if (r.ok) {
        config = r.config;
        $("#aiProvider").value = config.provider;
        $("#aiModel").value = config.model;
        $("#aiModel").readOnly = config.provider === "amr";
        $("#aiRemember").disabled = !config.encryptedStorage;
      }
    }
    status();
  }
  function mount() {
    if (mounted) return;
    mounted = true;
    const ic = (k) =>
      typeof GodpowerTheme !== "undefined" &&
      typeof GodpowerTheme.icon === "function"
        ? GodpowerTheme.icon(k)
        : "";
    $("#aiHost").innerHTML =
      `<header class="ui-collection-header"><div><span class="ui-settings-eyebrow">CLASSROOM COPILOT</span><h2>${ic("spark")}<span>AI 课堂助手</span></h2><div class="ui-collection-sub">先看清，再确认。课堂规则与数据始终由程序管理。</div></div><div class="ai-header-actions"><button type="button" class="btn" id="aiOpenKnowledge">${ic("book")}<span>高中学科资料</span></button><button type="button" class="btn" id="aiOpenSettings">${ic("settings")}<span>模型连接设置</span></button></div></header><div class="ai-workspace"><aside class="ai-session-sidebar ui-settings-group"><button type="button" class="btn btn-primary" id="aiNewConversation">${ic("add")}<span>新建对话</span></button><label>搜索对话<input id="aiSearch" type="search" placeholder="搜索标题"></label><nav id="aiConversationList" aria-label="对话列表"></nav><label>当前对话标题<input id="aiConversationTitle" maxlength="80"></label><button type="button" class="btn" id="aiRenameConversation">${ic("tune")}<span>重命名</span></button><button type="button" class="btn btn-danger" id="aiDeleteConversation">${ic("delete")}<span>删除当前对话</span></button></aside><section class="ai-conversation"><div class="ai-toolbar"><label>工作方式<select id="aiMode"><option value="offline">离线规则助手</option><option value="model">模型对话</option></select></label><span class="ui-muted" id="aiConnection"></span><button type="button" class="btn" id="aiClear">${ic("restart")}<span>清空对话</span></button></div><div id="aiMessages" class="ai-messages" role="log" aria-live="polite"></div><form id="aiComposer"><label for="aiPrompt">发送消息</label><textarea id="aiPrompt" maxlength="4000" rows="3" placeholder="试试：查看小组积分；给第3组加5分"></textarea><div id="aiDataConsent" hidden><label><input id="aiUseKnowledge" type="checkbox"> 引用本地学科资料（仅发送匹配摘录）<select id="aiKnowledgeSubject" aria-label="引用学科"><option value="">全部九科</option></select></label><label><input id="aiUseWeb" type="checkbox"> 联网查资料（搜索摘要，非网页全文）</label><label>联网关键词<input id="aiWebQuery" maxlength="300" placeholder="仅这些关键词会发送给搜索服务"></label><p class="ui-muted">资料问答只读，不执行课堂操作；联网关键词发给Bing及必要时的维基百科，相关摘录与结果摘要发给所选模型。</p><label><input id="aiShareScores" type="checkbox"> 附带当前小组的匿名编号和积分（不含组名、学生、学号、头像）</label><label><input id="aiShareHistory" type="checkbox"> 附带此对话最近的成功模型消息（最多12条、16000字；不含离线结果与操作回执）</label><label><input id="aiConsent" type="checkbox"> 我确认本次将当前输入文字及所选数据发送给已配置的模型服务（历史消息仅在上方勾选时发送）</label></div><div class="ai-composer-actions"><span class="ui-muted" id="aiSavedState" role="status">正在读取本机对话…</span><button type="button" class="btn" id="aiStop" disabled>${ic("stop")}<span>停止</span></button><button type="submit" class="btn btn-primary" id="aiSend" disabled>${ic("send")}<span>发送</span></button></div></form></section><aside class="ai-help ui-settings-group"><h3>${ic("shield")}<span>你来决定每次操作</span></h3><p>查看积分和打开页面可直接完成。改分必须点击确认；导入、删除、道具和归档不对AI开放。</p><div class="ai-examples"><button type="button" class="btn" data-ai-example="查看小组积分">查看小组积分</button><button type="button" class="btn" data-ai-example="给第3组加5分">准备加分预览</button><button type="button" class="btn" data-ai-example="打开设置">打开设置</button></div><h4>${ic("history")}<span>操作审计</span></h4><pre id="aiAudit">尚无操作回执。</pre><button type="button" class="btn" id="aiExport">${ic("download")}<span>导出对话与回执</span></button><p class="ui-muted">模型回复是辅助内容，不是教材原文。没有模型时只处理明确的本地指令。</p></aside></div>`;
    const panel = document.querySelector('[data-category-panel="ai"]');
    const box = document.createElement("section");
    box.className = "ui-settings-group ai-model-settings";
    box.innerHTML = `<h4>${ic("settings")}<span>模型连接</span></h4><p id="aiModelState" class="ui-muted"></p><form id="aiSettingsForm"><label>服务提供商<select id="aiProvider"><option value="amr">AMR · DeepSeek Flash</option><option value="opencode">OpenCode（首选）</option><option value="opencode_go">OpenCode Go</option><option value="opencode_zen">OpenCode Zen（旧地址兼容）</option><option value="opencode_go_legacy">OpenCode Go（旧地址兼容）</option><option value="openai">OpenAI</option><option value="deepseek">DeepSeek</option><option value="openrouter">OpenRouter</option><option value="ollama">Ollama（本机127.0.0.1:11434）</option></select></label><label>模型标识（需在你的服务账户中可用）<input id="aiModel" value="glm-5.3-flash" maxlength="120" required></label><label>API密钥<input id="aiKey" type="password" maxlength="512" autocomplete="off" placeholder="同一提供商留空保留；切换提供商后重新输入"></label><label><input id="aiRemember" type="checkbox"> 使用系统安全存储记住密钥（不可用时禁用）</label><p class="ui-muted">配置连接不会自动发起模型请求。发送前逐次确认数据范围；请求可能由服务商计费。Ollama需另行安装并下载相应模型。</p><div class="ai-settings-actions"><button class="btn btn-primary" type="submit">${ic("check")}<span>保存连接设置</span></button><button class="btn btn-danger" type="button" id="aiForget">${ic("delete")}<span>清除模型密钥</span></button><button class="btn" type="button" id="aiReturn">${ic("arrow")}<span>返回AI助手</span></button></div><p id="aiSettingsResult" role="status"></p></form>`;
    panel?.append(box);
    $("#aiComposer").onsubmit = send;
    $("#aiOpenKnowledge").onclick = () => AIKnowledgeUI.open();
    for (const subject of AIKnowledge.subjects) {
      const o = document.createElement("option");
      o.value = o.textContent = subject;
      $("#aiKnowledgeSubject").append(o);
    }
    $("#aiStop").onclick = () => {
      stop();
      message("receipt", "已停止请求，待确认操作已失效。");
    };
    $("#aiNewConversation").onclick = () => {
      if (!library) return;
      try {
        stop();
        viewEpoch++;
        library = AIConversations.add(library, {
          id: crypto.randomUUID(),
          time: new Date().toISOString(),
        });
        renderConversation();
        void persistConversation();
      } catch (e) {
        $("#aiSavedState").textContent = e.message;
      }
    };
    $("#aiSearch").oninput = () => {
      if (library) conversationList();
    };
    $("#aiRenameConversation").onclick = () => {
      try {
        library = AIConversations.rename(
          library,
          library.activeId,
          $("#aiConversationTitle").value,
        );
        conversationList();
        void persistConversation();
      } catch (e) {
        $("#aiSavedState").textContent = e.message;
      }
    };
    $("#aiDeleteConversation").onclick = async () => {
      if (!library) return;
      const id = library.activeId;
      if (
        !(await programConfirmV28(
          "仅删除当前对话记录，不影响课堂数据。此操作不能撤销。",
          { title: "删除对话", okText: "删除" },
        ))
      )
        return;
      if (library.activeId !== id) return;
      try {
        const next = AIConversations.remove(library, id);
        stop();
        viewEpoch++;
        library = next;
        renderConversation();
        void persistConversation();
      } catch (e) {
        $("#aiSavedState").textContent = e.message;
      }
    };
    $("#aiClear").onclick = async () => {
      if (!library) return;
      const id = library.activeId;
      if (
        !(await programConfirmV28("清空当前对话文字，课堂数据不受影响。", {
          title: "清空对话",
          okText: "清空",
        }))
      )
        return;
      if (library.activeId !== id) return;
      stop();
      viewEpoch++;
      library = AIConversations.validate({
        ...library,
        conversations: library.conversations.map((c) =>
          c.id === id ? { ...c, messages: [] } : c,
        ),
      });
      renderConversation();
      void persistConversation();
    };
    $("#aiMode").onchange = () => {
      stop();
      $("#aiDataConsent").hidden = $("#aiMode").value !== "model";
    };
    $("#aiOpenSettings").onclick = () => {
      switchView("settings");
      DesktopUI.selectSettings("ai");
    };
    $("#aiReturn").onclick = () => switchView("ai");
    $("#aiProvider").onchange = () => {
      $("#aiModel").value = {
        amr: "deepseek-v4.1-flash",
        opencode: "glm-5.3-flash",
        opencode_go: "glm-5.3-flash",
        opencode_zen: "glm-5.3-flash",
        opencode_go_legacy: "glm-5.3-flash",
        openai: "gpt-4o-mini",
        deepseek: "deepseek-chat",
        openrouter: "openai/gpt-4o-mini",
        ollama: "qwen2.5:7b",
      }[$("#aiProvider").value];
      $("#aiKey").value = "";
      $("#aiModel").readOnly = $("#aiProvider").value === "amr";
    };
    $("#aiSettingsForm").onsubmit = async (e) => {
      e.preventDefault();
      const btn = e.submitter;
      if (btn) btn.disabled = true;
      try {
        const apiKey = $("#aiKey").value;
        $("#aiKey").value = "";
        const r = await bridge().configure({
          provider: $("#aiProvider").value,
          model: $("#aiModel").value.trim(),
          apiKey,
          remember: $("#aiRemember").checked,
        });
        if (!r.ok) throw Error(r.error);
        config = r.config;
        status();
        $("#aiSettingsResult").textContent = "连接设置已保存，尚未发送请求。";
      } catch (error) {
        $("#aiSettingsResult").textContent = error.message;
      } finally {
        if (btn) btn.disabled = false;
      }
    };
    $("#aiForget").onclick = async () => {
      const r = await bridge().clear();
      if (r.ok) {
        config = r.config;
        $("#aiKey").value = "";
        status();
        $("#aiSettingsResult").textContent = "密钥已清除。";
      } else
        $("#aiSettingsResult").textContent =
          r.error || "密钥清除未完成，请重试";
    };
    $("#aiExport").onclick = () => {
      const blob = new Blob(
        [
          JSON.stringify(
            {
              schemaVersion: 1,
              messages: [...$("#aiMessages").children].map((n) => ({
                role: n.dataset.role,
                text: n.querySelector("p").textContent,
              })),
              audit: gateway.audit(),
              library,
            },
            null,
            2,
          ),
        ],
        { type: "application/json" },
      );
      const url = URL.createObjectURL(blob),
        a = document.createElement("a");
      a.href = url;
      a.download = "classroom-ai-session.json";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
    $("#aiHost").addEventListener("click", (e) => {
      const b = e.target.closest("[data-ai-example]");
      if (b) {
        $("#aiPrompt").value = b.dataset.aiExample;
        $("#aiPrompt").focus();
      }
    });
    if (!bridge()) {
      for (const n of $("#aiSettingsForm").elements)
        if (n.id !== "aiReturn") n.disabled = true;
      $('#aiMode option[value="model"]').disabled = true;
    }
    void loadConversations();
    void loadConfig();
    window.addEventListener("godpower:active-save-changed", () => {
      stop();
      viewEpoch++;
      message("receipt", "存档已切换，旧提案已失效。");
    });
    window.addEventListener("pagehide", stop);
  }
  window.addEventListener("DOMContentLoaded", () => setTimeout(mount, 0), {
    once: true,
  });
  return Object.freeze({ viewChanged });
})();
