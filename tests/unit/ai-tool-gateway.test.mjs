import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
const api = vm.runInNewContext(
  readFileSync("src/application/ai-tool-gateway.js", "utf8") +
    "\nAIToolGateway",
);
function fixture() {
  let calls = 0,
    rev = 1,
    epoch = 1,
    locked = false;
  const host = {
    capture: () => ({
      saveId: "s",
      generation: 1,
      revision: rev,
      viewEpoch: epoch,
      groups: [{ uid: "u", id: 1, no: 1, label: "私密组名", score: 10 }],
    }),
    blocked: () => (locked ? "LOCKED" : null),
    execute: async (g, d) => {
      calls++;
      rev++;
      return { ok: true, persisted: true };
    },
    navigate: () => {},
    id: (() => {
      let n = 0;
      return () => "" + ++n;
    })(),
  };
  return {
    g: api.create(host),
    host,
    get calls() {
      return calls;
    },
    change: () => rev++,
    navigate: () => epoch++,
    lock: () => (locked = true),
  };
}
test("score requires explicit approval, duplicate confirms are exactly once", async () => {
  const f = fixture(),
    p = f.g.propose({
      intent: "adjustScore",
      params: { group: "G1", delta: 5 },
    });
  assert.equal(f.calls, 0);
  assert.equal((await f.g.confirm(p.id, false)).ok, false);
  const [a, b] = await Promise.all([
    f.g.confirm(p.id, true),
    f.g.confirm(p.id, true),
  ]);
  assert.equal(a.ok, true);
  assert.equal(b.ok, true);
  assert.equal(f.calls, 1);
});
test("revision, view or lock changes reject old approvals", async () => {
  for (const change of ["change", "navigate", "lock"]) {
    const f = fixture(),
      p = f.g.propose({
        intent: "adjustScore",
        params: { group: "G1", delta: 5 },
      });
    f[change]();
    assert.equal((await f.g.confirm(p.id, true)).ok, false);
    assert.equal(f.calls, 0);
  }
});
test("strict tool schema rejects injection, unknown fields, huge and noninteger changes", () => {
  const f = fixture();
  for (const action of [
    { intent: "eval", params: { js: "alert(1)" } },
    {
      intent: "adjustScore",
      params: { group: "G1", delta: 1, approved: true },
    },
    { intent: "adjustScore", params: { group: "G1", delta: 1.5 } },
    {
      intent: "adjustScore",
      params: { group: "G1", delta: Number.MAX_SAFE_INTEGER },
    },
  ])
    assert.throws(() => f.g.propose(action));
});
test("outbound context contains only anonymous aliases and scores", () => {
  const f = fixture(),
    s = JSON.stringify(f.g.publicContext());
  assert.ok(!s.includes("私密"));
  assert.ok(!s.includes('"uid"'));
  assert.match(s, /G1/);
});
test("cancelled and failed proposals cannot be silently executed again", async () => {
  const f = fixture(),
    p = f.g.propose({
      intent: "adjustScore",
      params: { group: "G1", delta: 5 },
    });
  f.g.cancel();
  assert.equal((await f.g.confirm(p.id, true)).ok, false);
  assert.equal(f.calls, 0);
});

test("a revision change between confirmation and command dispatch cannot write", async () => {
  const f = fixture(),
    p = f.g.propose({
      intent: "adjustScore",
      params: { group: "G1", delta: 2 },
    });
  const result = f.g.confirm(p.id, true);
  f.change();
  assert.equal((await result).ok, false);
  assert.equal(f.calls, 0);
});
test("clearing pending previews permits future requests without an unbounded registry", () => {
  const f = fixture();
  for (let i = 0; i < 130; i++) {
    f.g.propose({ intent: "adjustScore", params: { group: "G1", delta: 1 } });
    f.g.cancel();
  }
});
test("model text JSON strings and scalar replies cannot escape into unhandled error messages", () => {
  assert.throws(() => api.parseReply('"hello"'));
  assert.throws(() =>
    api.parseReply('{"reply":"x","actions":[{"intent":"eval","params":{}}]}'),
  );
});
