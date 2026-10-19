import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
const scope = vm.createContext({});
vm.runInContext(
  readFileSync("src/domain/values.js", "utf8") +
    "\n" +
    readFileSync("src/domain/events.js", "utf8") +
    ";globalThis.domainEvents=DomainEvents;" +
    readFileSync("src/application/command-lifecycle.js", "utf8") +
    ";globalThis.api=CommandLifecycle",
  scope,
);
function fixture() {
  let score = 10,
    active = false,
    saves = 0,
    history = 0,
    result,
    warning,
    error,
    persisted,
    commits = [],
    presentationErrors = [],
    render = () => {},
    persistResult = { ok: true, eventsPersisted: true },
    invalidator = () => {};
  const controller = scope.api.create({
    active: () => active,
    commandId: (() => {
      let id = 0;
      return () => `command-${++id}`;
    })(),
    createEventScope: (options) =>
      scope.domainEvents.createScope({ ...options, now: () => new Date(0) }),
    setActive: (v) => (active = v),
    invalidate: () => invalidator(),
    snapshot: () => ({ score, history }),
    restore: (b) => {
      score = b.score;
      history = b.history;
    },
    record: () => history++,
    validate: () => {
      if (!Number.isSafeInteger(score)) throw Error("overflow");
    },
    persist: (transaction) => {
      saves++;
      persisted = transaction;
      return persistResult;
    },
    render: () => render(),
    postCommitError: (error) => presentationErrors.push(error.message),
    result: (r) => (result = r),
    warning: (e) => (warning = e),
    error: (e) => (error = e),
    committed: (batch) => commits.push(batch),
  });
  return {
    controller,
    get score() {
      return score;
    },
    set score(v) {
      score = v;
    },
    get saves() {
      return saves;
    },
    get history() {
      return history;
    },
    get result() {
      return result;
    },
    get error() {
      return error;
    },
    get persisted() {
      return persisted;
    },
    get commits() {
      return commits;
    },
    get presentationErrors() {
      return presentationErrors;
    },
    set render(value) {
      render = value;
    },
    set persistResult(value) {
      persistResult = value;
    },
    set invalidator(fn) {
      invalidator = fn;
    },
  };
}
const tick = () => new Promise((r) => setTimeout(r, 0));
test("synchronous command persists once and records once", () => {
  const f = fixture();
  assert.equal(
    f.controller.run("add", () => {
      f.score += 2;
    }),
    true,
  );
  assert.equal(f.score, 12);
  assert.equal(f.saves, 1);
  assert.equal(f.history, 1);
});
test("committed domain events are passed to persistence and published only after a successful save", () => {
  const f = fixture();
  f.controller.run("answer", (context) => {
    f.score += 2;
    context.onCommit((commit) =>
      commit.emit(
        "ROUND_SETTLED",
        { type: "group", id: "group-1" },
        { correct: true },
      ),
    );
    return true;
  });
  assert.equal(f.persisted.commandId, "command-1");
  assert.equal(f.persisted.events[0].type, "ROUND_SETTLED");
  assert.equal(f.commits.length, 1);
  assert.equal(f.commits[0].events[0].eventId, "command-1:1");
});
test("cancelled, rejected and unpersisted commands do not publish achievement events", () => {
  const f = fixture();
  f.controller.run("rejected", (context) => {
    context.emit(
      "ITEM_USED",
      { type: "group", id: "group-1" },
      { itemKey: "coin" },
    );
    return false;
  });
  assert.equal(f.commits.length, 0);
  f.persistResult = { ok: false, error: "quota" };
  f.controller.run("quota", (context) => {
    context.emit(
      "ITEM_USED",
      { type: "group", id: "group-1" },
      { itemKey: "coin" },
    );
    return true;
  });
  assert.equal(f.commits.length, 0);
  f.persistResult = { ok: true, eventsPersisted: false };
  f.controller.run("state-only", (context) => {
    context.emit(
      "ROUND_SETTLED",
      { type: "group", id: "group-1" },
      { correct: true },
    );
    return true;
  });
  assert.equal(f.commits.length, 0);
});
test("pending defense never persists a partial command; finish records one operation", async () => {
  const f = fixture();
  let answer;
  const p = new Promise((r) => (answer = r));
  f.controller.run("attack", (context) => {
    context.onCommit((commit) =>
      commit.emit(
        "ITEM_USED",
        { type: "group", id: "group-1" },
        { itemKey: "spiny" },
      ),
    );
    f.score--;
    f.controller.defer(p, (yes) => {
      f.score -= yes ? 0 : 5;
    });
  });
  assert.equal(f.saves, 0);
  assert.equal(f.commits.length, 0);
  assert.equal(f.result.pending, true);
  answer(false);
  await tick();
  assert.equal(f.score, 4);
  assert.equal(f.saves, 1);
  assert.equal(f.history, 1);
  assert.equal(f.commits.length, 1);
});
test("cancellation restores pre-operation score and history, ignores late resolution", async () => {
  const f = fixture();
  let answer;
  f.controller.run("attack", () => {
    f.score--;
    f.controller.defer(new Promise((r) => (answer = r)), () => {
      f.score -= 5;
    });
  });
  f.controller.cancel();
  answer(true);
  await tick();
  assert.equal(f.score, 10);
  assert.equal(f.history, 0);
  assert.equal(f.saves, 0);
});
test("new command cancels pending operation before its own snapshot", async () => {
  const f = fixture();
  let answer;
  f.controller.run("attack", () => {
    f.score--;
    f.controller.defer(new Promise((r) => (answer = r)), () => {
      f.score -= 5;
    });
  });
  f.controller.run("add", () => {
    f.score += 2;
  });
  answer(true);
  await tick();
  assert.equal(f.score, 12);
  assert.equal(f.saves, 1);
  assert.equal(f.history, 1);
});
test("rejected dialog rolls back instead of committing attacker consumption", async () => {
  const f = fixture();
  let reject;
  f.controller.run("attack", () => {
    f.score--;
    f.controller.defer(new Promise((_, r) => (reject = r)), () => {});
  });
  reject(Error("dialog closed"));
  await tick();
  assert.equal(f.score, 10);
  assert.equal(f.history, 0);
  assert.equal(f.saves, 0);
  assert.ok(f.error);
});
test("multiple asynchronous effects commit only when all decisions finish", async () => {
  const f = fixture();
  let a, b;
  f.controller.run("multi", () => {
    f.controller.defer(new Promise((r) => (a = r)), () => f.score--);
    f.controller.defer(new Promise((r) => (b = r)), () => f.score--);
  });
  a();
  await tick();
  assert.equal(f.saves, 0);
  b();
  await tick();
  assert.equal(f.score, 8);
  assert.equal(f.saves, 1);
});
test("invalid or overflowing commands never persist", () => {
  const f = fixture();
  assert.equal(
    f.controller.run("bad", () => {
      f.score = Number.MAX_SAFE_INTEGER + 1;
    }),
    false,
  );
  assert.equal(f.score, 10);
  assert.equal(f.history, 0);
  assert.equal(f.saves, 0);
});
test("stale defense cancels entire command", async () => {
  const f = fixture();
  let answer;
  f.controller.run("attack", () => {
    f.score--;
    f.controller.defer(
      new Promise((r) => (answer = r)),
      () => {
        f.score -= 5;
      },
      () => false,
    );
  });
  answer(true);
  await tick();
  assert.equal(f.score, 10);
  assert.equal(f.saves, 0);
});

test("render failure cannot roll back a successfully persisted command", () => {
  const f = fixture();
  f.render = () => {
    throw Error("renderer failed");
  };
  assert.equal(
    f.controller.run("add", () => {
      f.score += 2;
    }),
    true,
  );
  assert.equal(f.score, 12);
  assert.equal(f.history, 1);
  assert.equal(f.saves, 1);
  assert.equal(f.result.persisted, true);
  assert.deepEqual(f.presentationErrors, ["renderer failed"]);
  assert.equal(f.controller.isPending(), false);
});

test("non-history controls still get validation, one save and rollback without adding undo entries", () => {
  const f = fixture();
  assert.equal(
    f.controller.run(
      "answer selection",
      () => {
        f.score = 12;
        return true;
      },
      { recordHistory: false },
    ),
    true,
  );
  assert.equal(f.history, 0);
  assert.equal(f.saves, 1);
  assert.equal(f.result.persisted, true);
  assert.equal(
    f.controller.run(
      "invalid selection",
      () => {
        f.score = Infinity;
      },
      { recordHistory: false },
    ),
    false,
  );
  assert.equal(f.score, 12);
  assert.equal(f.history, 0);
  assert.equal(f.saves, 1);
});
