import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import test from "node:test";

const source = await readFile("src/ui/disposable-scope.js", "utf8");
function api() {
  const sandbox = { console, setTimeout, clearTimeout, AbortController };
  sandbox.globalThis = sandbox;
  vm.runInNewContext(source, sandbox, { filename: "disposable-scope.js" });
  return sandbox.GodPowerDisposableScope;
}

test("disposal is idempotent and runs every cleanup in reverse registration order", () => {
  const { createDisposableScope } = api();
  const scope = createDisposableScope("test");
  const order = [];
  scope.add(() => order.push("first"));
  scope.add(() => order.push("second"));
  assert.deepEqual(JSON.parse(JSON.stringify(scope.dispose())), []);
  assert.deepEqual(JSON.parse(JSON.stringify(scope.dispose())), []);
  assert.deepEqual(order, ["second", "first"]);
  assert.equal(scope.disposed, true);
});

test("reports cleanup errors but still releases the remaining resources", () => {
  const { createDisposableScope } = api();
  const scope = createDisposableScope("failure");
  let released = false;
  scope.add(() => {
    released = true;
  });
  scope.add(() => {
    throw new Error("cleanup failed");
  });
  const errors = scope.dispose();
  assert.equal(errors.length, 1);
  assert.match(errors[0].message, /cleanup failed/);
  assert.equal(released, true);
});

test("listeners, timeout, frame, observers and animations are canceled on dispose", async () => {
  const pendingFrames = new Map();
  let frameId = 0;
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    AbortController,
    requestAnimationFrame(callback) {
      const id = ++frameId;
      pendingFrames.set(id, callback);
      return id;
    },
    cancelAnimationFrame(id) {
      pendingFrames.delete(id);
    },
  };
  sandbox.globalThis = sandbox;
  vm.runInNewContext(source, sandbox, { filename: "disposable-scope.js" });
  const scope =
    sandbox.GodPowerDisposableScope.createDisposableScope("resources");
  const target = new EventTarget();
  let events = 0;
  let timed = false;
  let framed = false;
  let disconnected = false;
  let canceled = false;
  scope.listen(target, "change", () => events++);
  scope.timeout(() => {
    timed = true;
  }, 20);
  scope.frame(() => {
    framed = true;
  });
  scope.observe(
    {
      observe() {},
      disconnect() {
        disconnected = true;
      },
    },
    {},
  );
  scope.animation({
    finished: Promise.resolve(),
    cancel() {
      canceled = true;
    },
  });
  scope.dispose();
  target.dispatchEvent(new Event("change"));
  await new Promise((resolve) => setTimeout(resolve, 30));
  assert.equal(events, 0);
  assert.equal(timed, false);
  assert.equal(framed, false);
  assert.equal(pendingFrames.size, 0);
  assert.equal(disconnected, true);
  assert.equal(canceled, true);
});

test("page lifecycle replaces the previous route scope exactly once", () => {
  const { createPageLifecycle } = api();
  const lifecycle = createPageLifecycle();
  const first = lifecycle.enter("welcome");
  const same = lifecycle.enter("welcome");
  assert.equal(first.scope, same.scope);
  assert.equal(same.changed, false);
  let cleaned = false;
  first.scope.add(() => {
    cleaned = true;
  });
  const next = lifecycle.enter("history");
  assert.equal(next.changed, true);
  assert.equal(first.scope.disposed, true);
  assert.equal(cleaned, true);
  assert.equal(lifecycle.current().route, "history");
  lifecycle.dispose();
  assert.equal(lifecycle.current(), null);
});
