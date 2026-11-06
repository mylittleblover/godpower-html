import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
const M = vm.runInNewContext(
  readFileSync("src/domain/ai-conversations.js", "utf8") + ";AIConversations",
);
const opts = { id: "one", time: "2026-11-06T00:00:00.000Z" };
test("conversations remain independent and selection survives validation", () => {
  let l = M.create(opts);
  l = M.append(l, "one", {
    id: "m",
    role: "user",
    text: "first",
    channel: "offline",
    complete: true,
  });
  l = M.add(l, { ...opts, id: "two" });
  assert.equal(l.activeId, "two");
  assert.equal(l.conversations[1].messages.length, 0);
  assert.equal(M.validate(l).conversations[0].messages[0].text, "first");
});
test("history only includes complete model messages from the selected conversation", () => {
  let l = M.create(opts);
  for (const [id, role, channel, complete] of [
    ["a", "user", "model", true],
    ["b", "assistant", "model", true],
    ["c", "assistant", "offline", true],
    ["d", "receipt", "model", true],
    ["e", "user", "model", false],
  ])
    l = M.append(l, "one", { id, role, text: id, channel, complete });
  assert.equal(
    JSON.stringify(M.context(l, "one")),
    JSON.stringify([
      { role: "user", content: "a" },
      { role: "assistant", content: "b" },
    ]),
  );
});
test("unsupported fields and oversized input are rejected without changing source", () => {
  let l = M.create(opts);
  assert.throws(() => M.validate({ ...l, apiKey: "secret" }));
  assert.throws(() =>
    M.append(l, "one", {
      id: "x",
      role: "system",
      text: "evil",
      channel: "model",
      complete: true,
    }),
  );
  assert.throws(() =>
    M.append(l, "one", {
      id: "x",
      role: "user",
      text: "x".repeat(24001),
      channel: "model",
      complete: true,
    }),
  );
  assert.equal(l.conversations[0].messages.length, 0);
});
test("rename and remove preserve a usable active conversation", () => {
  let l = M.add(M.create(opts), { ...opts, id: "two" });
  l = M.rename(l, "two", "  函数问题  ");
  assert.equal(l.conversations[1].title, "函数问题");
  l = M.remove(l, "two");
  assert.equal(l.activeId, "one");
  assert.throws(() => M.remove(l, "one"));
});
test("context is bounded and interrupted messages stay excluded after roundtrip", () => {
  let l = M.create(opts);
  for (let i = 0; i < 16; i++)
    l = M.append(l, "one", {
      id: "m" + i,
      role: i % 2 ? "assistant" : "user",
      text: "x".repeat(2000),
      channel: "model",
      complete: true,
    });
  const h = M.context(l, "one");
  assert.ok(h.length <= 12);
  assert.ok(h.reduce((n, m) => n + m.content.length, 0) <= 16000);
  l = M.update(l, "one", "m15", { complete: false });
  assert.equal(
    M.validate(JSON.parse(JSON.stringify(l))).conversations[0].messages.at(-1)
      .complete,
    false,
  );
});
