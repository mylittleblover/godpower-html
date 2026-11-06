/* Text-only transcripts. No proposal, credential or classroom state is restored. */
const AIConversations = (() => {
  const clone = (v) => JSON.parse(JSON.stringify(v));
  function exact(v, keys) {
    if (
      !v ||
      typeof v !== "object" ||
      Array.isArray(v) ||
      Object.keys(v).some((k) => !keys.includes(k))
    )
      throw Error("对话格式不受支持");
  }
  function string(v, max) {
    if (typeof v !== "string" || !v.length || v.length > max)
      throw Error("对话文字长度无效");
  }
  function validate(value) {
    exact(value, [
      "kind",
      "schemaVersion",
      "revision",
      "activeId",
      "conversations",
    ]);
    if (
      value.kind !== "godpower.ai.conversations" ||
      value.schemaVersion !== 1 ||
      !Number.isSafeInteger(value.revision) ||
      value.revision < 0 ||
      !Array.isArray(value.conversations) ||
      !value.conversations.length ||
      value.conversations.length > 50
    )
      throw Error("对话库格式或数量无效");
    const ids = new Set();
    for (const c of value.conversations) {
      exact(c, ["id", "title", "createdAt", "messages"]);
      string(c.id, 100);
      string(c.title, 80);
      string(c.createdAt, 40);
      if (
        ids.has(c.id) ||
        !Number.isFinite(Date.parse(c.createdAt)) ||
        !Array.isArray(c.messages) ||
        c.messages.length > 100
      )
        throw Error("对话记录无效");
      ids.add(c.id);
      const mids = new Set();
      for (const m of c.messages) {
        exact(m, ["id", "role", "text", "channel", "complete"]);
        string(m.id, 100);
        string(m.text, 24000);
        if (
          mids.has(m.id) ||
          !["user", "assistant", "receipt"].includes(m.role) ||
          !["offline", "model", "receipt"].includes(m.channel) ||
          typeof m.complete !== "boolean"
        )
          throw Error("消息格式无效");
        mids.add(m.id);
      }
    }
    if (!ids.has(value.activeId)) throw Error("当前对话不存在");
    if (JSON.stringify(value).length > 4 * 1024 * 1024)
      throw Error("对话库已满，请先导出并删除不需要的对话");
    return clone(value);
  }
  function create({ id, time }) {
    return validate({
      kind: "godpower.ai.conversations",
      schemaVersion: 1,
      revision: 0,
      activeId: id,
      conversations: [{ id, title: "新对话", createdAt: time, messages: [] }],
    });
  }
  function change(lib, fn) {
    const next = validate(lib);
    fn(next);
    return validate(next);
  }
  function find(lib, id) {
    const c = lib.conversations.find((c) => c.id === id);
    if (!c) throw Error("对话不存在");
    return c;
  }
  function add(lib, { id, time }) {
    return change(lib, (n) => {
      n.conversations.push({
        id,
        title: "新对话",
        createdAt: time,
        messages: [],
      });
      n.activeId = id;
    });
  }
  function select(lib, id) {
    return change(lib, (n) => {
      find(n, id);
      n.activeId = id;
    });
  }
  function rename(lib, id, title) {
    return change(lib, (n) => (find(n, id).title = title.trim()));
  }
  function remove(lib, id) {
    return change(lib, (n) => {
      find(n, id);
      if (n.conversations.length === 1) throw Error("请至少保留一个对话");
      n.conversations = n.conversations.filter((c) => c.id !== id);
      if (n.activeId === id) n.activeId = n.conversations[0].id;
    });
  }
  function append(lib, id, message) {
    return change(lib, (n) => find(n, id).messages.push(clone(message)));
  }
  function update(lib, id, messageId, patch) {
    exact(patch, ["complete"]);
    return change(lib, (n) => {
      const m = find(n, id).messages.find((m) => m.id === messageId);
      if (!m) throw Error("消息不存在");
      Object.assign(m, patch);
    });
  }
  function context(lib, id) {
    const source = find(validate(lib), id).messages.filter(
      (m) =>
        m.channel === "model" &&
        m.complete &&
        ["user", "assistant"].includes(m.role),
    );
    const result = [];
    let count = 0;
    for (const m of source.slice(-12).reverse()) {
      const content = m.text.slice(0, 4000);
      if (count + content.length > 16000) break;
      result.unshift({ role: m.role, content });
      count += content.length;
    }
    while (result.length && result[0].role !== "user") result.shift();
    return result;
  }
  return Object.freeze({
    create,
    validate,
    add,
    select,
    rename,
    remove,
    append,
    update,
    context,
  });
})();
