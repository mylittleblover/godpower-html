/* AI presentation and explicit teacher approvals; classroom state remains authoritative. */
const AIChat = (() => {
  let mounted = false,
    viewEpoch = 0,
    request = null,
    version = 0,
    config = null;
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
  function message(role, text) {
    const entry = document.createElement("article");
    entry.className = "ai-message";
    entry.dataset.role = role;
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
    if (request) return;
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
      shareScores = $("#aiShareScores").checked;
    if (cloud && !$("#aiConsent").checked) {
      message("receipt", "请先确认本次发送的数据范围。");
      return;
    }
    message("user", text);
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
          groups: shareScores ? gateway.publicContext() : [],
        });
        if (!response.ok) throw Error(response.error);
        result = AIToolGateway.parseReply(response.text);
        if (
          !shareScores &&
          result.actions.some((a) => a.intent === "adjustScore")
        )
          throw Error(
            "本次未授权小组上下文，无法准备改分；请勾选匿名积分或使用离线指令",
          );
      }
      if (ownVersion !== version) return;
      const now = capture();
      if (
        ["saveId", "generation", "revision", "viewEpoch"].some(
          (k) => snapshot[k] !== now[k],
        )
      )
        throw Error("课堂或页面已变化，响应已丢弃，请重新发送");
      message("assistant", result.reply);
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
        $("#aiRemember").disabled = !config.encryptedStorage;
      }
    }
    status();
  }
  function mount() {
    if (mounted) return;
    mounted = true;
    $("#aiHost").innerHTML =
      '<header class="ui-collection-header"><div><span class="ui-settings-eyebrow">CLASSROOM COPILOT</span><h2>AI 课堂助手</h2><div class="ui-collection-sub">先看清，再确认。课堂规则与数据始终由程序管理。</div></div><button type="button" class="btn" id="aiOpenSettings">模型连接设置</button></header><div class="ai-workspace"><section class="ai-conversation"><div class="ai-toolbar"><label>工作方式<select id="aiMode"><option value="offline">离线规则助手</option><option value="model">模型对话</option></select></label><span class="ui-muted" id="aiConnection"></span><button type="button" class="btn" id="aiClear">清空对话</button></div><div id="aiMessages" class="ai-messages" role="log" aria-live="polite"></div><form id="aiComposer"><label for="aiPrompt">发送消息</label><textarea id="aiPrompt" maxlength="4000" rows="3" placeholder="试试：查看小组积分；给第3组加5分"></textarea><div id="aiDataConsent" hidden><label><input id="aiShareScores" type="checkbox"> 附带当前小组的匿名编号和积分（不含组名、学生、学号、头像）</label><label><input id="aiConsent" type="checkbox"> 我确认本次将当前输入文字及所选数据发送给已配置的模型服务（不自动发送历史对话）</label></div><div class="ai-composer-actions"><span class="ui-muted">关闭页面不会自动执行待确认操作；对话仅保留本次页面会话。</span><button type="button" class="btn" id="aiStop" disabled>停止</button><button type="submit" class="btn btn-primary" id="aiSend">发送</button></div></form></section><aside class="ai-help ui-settings-group"><h3>你来决定每次操作</h3><p>查看积分和打开页面可直接完成。改分必须点击确认；导入、删除、道具和归档不对AI开放。</p><div class="ai-examples"><button type="button" class="btn" data-ai-example="查看小组积分">查看小组积分</button><button type="button" class="btn" data-ai-example="给第3组加5分">准备加分预览</button><button type="button" class="btn" data-ai-example="打开设置">打开设置</button></div><h4>操作审计</h4><pre id="aiAudit">尚无操作回执。</pre><button type="button" class="btn" id="aiExport">导出对话与回执</button><p class="ui-muted">模型回复是辅助内容，不是教材原文。没有模型时只处理明确的本地指令。</p></aside></div>';
    const panel = document.querySelector('[data-category-panel="ai"]');
    const box = document.createElement("section");
    box.className = "ui-settings-group ai-model-settings";
    box.innerHTML =
      '<h4>模型连接</h4><p id="aiModelState" class="ui-muted"></p><form id="aiSettingsForm"><label>服务提供商<select id="aiProvider"><option value="opencode">OpenCode（首选）</option><option value="opencode_go">OpenCode Go</option><option value="opencode_zen">OpenCode Zen（旧地址兼容）</option><option value="opencode_go_legacy">OpenCode Go（旧地址兼容）</option><option value="openai">OpenAI</option><option value="deepseek">DeepSeek</option><option value="openrouter">OpenRouter</option><option value="ollama">Ollama（本机127.0.0.1:11434）</option></select></label><label>模型标识（需在你的服务账户中可用）<input id="aiModel" value="glm-5.3-flash" maxlength="120" required></label><label>API密钥<input id="aiKey" type="password" maxlength="512" autocomplete="off" placeholder="同一提供商留空保留；切换提供商后重新输入"></label><label><input id="aiRemember" type="checkbox"> 使用系统安全存储记住密钥（不可用时禁用）</label><p class="ui-muted">配置连接不会自动发起模型请求。发送前逐次确认数据范围；请求可能由服务商计费。Ollama需另行安装并下载相应模型。</p><button class="btn btn-primary" type="submit">保存连接设置</button><button class="btn btn-danger" type="button" id="aiForget">清除模型密钥</button><button class="btn" type="button" id="aiReturn">返回AI助手</button><p id="aiSettingsResult" role="status"></p></form>';
    panel?.append(box);
    $("#aiComposer").onsubmit = send;
    $("#aiStop").onclick = () => {
      stop();
      message("receipt", "已停止请求，待确认操作已失效。");
    };
    $("#aiClear").onclick = () => {
      stop();
      $("#aiMessages").replaceChildren();
      message("assistant", "对话已清空。离线规则助手不会调用网络。");
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
    message(
      "assistant",
      "你好。当前默认为离线规则助手。可以查看积分、打开页面或准备改分预览；不会自动发送学生资料。",
    );
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
