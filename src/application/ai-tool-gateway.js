/* AI can propose bounded actions; only the teacher-facing host can approve writes. */
const AIToolGateway = (() => {
  const routes = [
    "welcome",
    "battle",
    "gameplay",
    "history",
    "archives",
    "settings",
    "ai",
  ];
  function exact(value, keys) {
    if (
      !value ||
      typeof value !== "object" ||
      Array.isArray(value) ||
      Object.keys(value).some((key) => !keys.includes(key))
    )
      throw Error("不支持的操作格式");
  }
  function validate(action) {
    exact(action, ["intent", "params"]);
    exact(action.params, ["group", "delta", "route"]);
    const p = action.params;
    if (action.intent === "adjustScore") {
      exact(p, ["group", "delta"]);
      if (
        !/^G[1-9]\d{0,3}$/.test(p.group) ||
        !Number.isSafeInteger(p.delta) ||
        !p.delta ||
        Math.abs(p.delta) > 1000000
      )
        throw Error("请提供有效小组及非零整数，单次最多100万分");
    } else if (action.intent === "navigate") {
      exact(p, ["route"]);
      if (!routes.includes(p.route)) throw Error("不支持的页面");
    } else throw Error("该操作不在AI工具白名单中");
    return JSON.parse(JSON.stringify(action));
  }
  function create(host) {
    const proposals = new Map(),
      audit = [];
    const record = (entry) => {
      audit.push({ ...entry, time: Date.now() });
      if (audit.length > 100) audit.shift();
    };
    function publicContext() {
      return host
        .capture()
        .groups.map((g, i) => ({ group: "G" + (i + 1), score: g.score }));
    }
    function propose(input, snapshot = host.capture()) {
      const action = validate(input);
      for (const [id, proposal] of proposals) {
        if (
          proposal.status === "cancelled" ||
          (proposals.size > 100 &&
            ["done", "failed", "stale"].includes(proposal.status))
        )
          proposals.delete(id);
      }
      if (
        [...proposals.values()].filter((p) => p.status === "pending").length >=
        40
      )
        throw Error("待确认操作过多，请清空会话");
      if (action.intent === "navigate") {
        host.navigate(action.params.route);
        record({ intent: "navigate", status: "done" });
        return { kind: "navigation", route: action.params.route };
      }
      const group = snapshot.groups[Number(action.params.group.slice(1)) - 1];
      if (!group || !group.uid) throw Error("小组不存在，请刷新课堂上下文");
      const after = group.score + action.params.delta;
      if (!Number.isSafeInteger(after)) throw Error("积分超出安全整数范围");
      const p = {
        id: host.id(),
        kind: "score",
        groupUid: group.uid,
        label: group.label,
        before: group.score,
        after,
        delta: action.params.delta,
        saveId: snapshot.saveId,
        generation: snapshot.generation,
        revision: snapshot.revision,
        viewEpoch: snapshot.viewEpoch,
        created: Date.now(),
        status: "pending",
      };
      proposals.set(p.id, p);
      return { ...p };
    }
    function confirm(id, approved) {
      const p = proposals.get(id);
      if (!p || approved !== true)
        return Promise.resolve({ ok: false, error: "需要教师明确确认" });
      if (p.promise) return p.promise;
      if (p.status !== "pending")
        return Promise.resolve({ ok: false, error: "该操作已失效" });
      const now = host.capture(),
        group = now.groups.find((g) => g.uid === p.groupUid),
        blocked = host.blocked();
      if (
        blocked ||
        Date.now() - p.created > 120000 ||
        !group ||
        group.score !== p.before ||
        ["saveId", "generation", "revision", "viewEpoch"].some(
          (k) => now[k] !== p[k],
        )
      ) {
        p.status = "stale";
        return Promise.resolve({
          ok: false,
          error: blocked || "课堂或页面已变化，请重新生成预览",
        });
      }
      p.status = "executing";
      // Set the promise before invoking the command: duplicate gestures share one receipt.
      p.promise = Promise.resolve()
        .then(() => {
          const latest = host.capture(),
            current = latest.groups.find((g) => g.uid === p.groupUid),
            conflict = host.blocked();
          if (
            conflict ||
            !current ||
            current.score !== p.before ||
            ["saveId", "generation", "revision", "viewEpoch"].some(
              (k) => latest[k] !== p[k],
            )
          )
            return {
              ok: false,
              error: conflict || "课堂或页面已变化，请重新生成预览",
            };
          return host.execute(current, p.delta);
        })
        .then((result) => {
          p.status = result?.ok ? "done" : "failed";
          const receipt = {
            ok: result?.ok === true,
            persisted: result?.persisted === true,
            error:
              result?.error || (!result?.ok ? "课堂命令未完成" : undefined),
          };
          record({
            intent: "adjustScore",
            proposalId: p.id,
            delta: p.delta,
            status: p.status,
            persisted: receipt.persisted,
          });
          return receipt;
        })
        .catch(() => {
          p.status = "failed";
          record({ intent: "adjustScore", proposalId: p.id, status: "failed" });
          return { ok: false, error: "课堂命令未完成，请检查保存状态" };
        });
      return p.promise;
    }
    function cancel() {
      for (const p of proposals.values())
        if (p.status === "pending") p.status = "cancelled";
    }
    return Object.freeze({
      publicContext,
      propose,
      reject: (id) => {
        const p = proposals.get(id);
        if (p?.status === "pending") p.status = "cancelled";
      },
      confirm,
      cancel,
      audit: () => audit.map((x) => ({ ...x })),
      capture: host.capture,
    });
  }
  function offline(text, snapshot) {
    const score = text
      .trim()
      .match(
        /^(?:请)?(?:给)?(?:第)?(\d+)\s*(?:小组|组)\s*(加|减|扣)\s*(\d+)\s*分[。！!]?$/,
      );
    if (score) {
      const group = snapshot.groups.findIndex((g) => g.no === Number(score[1]));
      if (group < 0) return { reply: "没有找到这个编号的小组。", actions: [] };
      return {
        reply: "已准备积分调整。请核对下方预览，确认后才会执行。",
        actions: [
          {
            intent: "adjustScore",
            params: {
              group: "G" + (group + 1),
              delta: Number(score[3]) * (score[2] === "加" ? 1 : -1),
            },
          },
        ],
      };
    }
    const nav = text
      .trim()
      .match(
        /^(?:请)?(?:打开|进入|前往)(欢迎|首页|比赛|玩法|历史|档案|设置)(?:页|页面)?[。！!]?$/,
      );
    if (nav)
      return {
        reply: "已打开指定页面。",
        actions: [
          {
            intent: "navigate",
            params: {
              route: {
                欢迎: "welcome",
                首页: "welcome",
                比赛: "battle",
                玩法: "gameplay",
                历史: "history",
                档案: "archives",
                设置: "settings",
              }[nav[1]],
            },
          },
        ],
      };
    if (/积分|排名|得分/.test(text) && !/(?:加|减|扣)\s*\d/.test(text)) {
      const sorted = [...snapshot.groups].sort((a, b) => b.score - a.score);
      return {
        reply: sorted.length
          ? sorted
              .map((g, i) => `${i + 1}. ${g.label}：${g.score} 分`)
              .join("\n")
          : "当前没有小组。",
        actions: [],
      };
    }
    return {
      reply:
        "当前为离线规则助手，不是大模型。可以输入“查看小组积分”“给第3组加5分”或“打开设置”。使用模型对话请先在连接设置中配置。",
      actions: [],
    };
  }
  function parseReply(text) {
    if (typeof text !== "string" || text.length > 24000)
      throw Error("模型响应过大");
    let value;
    try {
      value = JSON.parse(text);
    } catch {
      return { reply: text, actions: [] };
    }
    exact(value, ["reply", "actions"]);
    if (
      typeof value.reply !== "string" ||
      !Array.isArray(value.actions) ||
      value.actions.length > 1
    )
      throw Error("模型操作格式不符合约定");
    return { reply: value.reply, actions: value.actions.map(validate) };
  }
  return Object.freeze({ create, offline, parseReply });
})();
