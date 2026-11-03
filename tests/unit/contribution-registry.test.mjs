import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import test from "node:test";

const source = await readFile("src/ui/contribution-registry.js", "utf8");
function createRegistry() {
  const sandbox = { console, structuredClone };
  sandbox.globalThis = sandbox;
  vm.runInNewContext(source, sandbox, { filename: "contribution-registry.js" });
  return sandbox.GodPowerContributionRegistry.createContributionRegistry();
}

const pluginContext = (registry, pluginId = "official.example") =>
  registry.activate(
    pluginId,
    JSON.parse(
      JSON.stringify({
        scope: { teacherId: "teacher-1", classId: "class-1" },
        permissions: [
          "ui.page.register",
          "ui.card.register",
          "ui.panel.register",
          "ui.navigation.register",
          "ui.settings.register",
          "ui.commandShortcut.register",
          "ui.viewPreset.register",
          "ui.decoration.register",
        ],
      }),
    ),
  );
const register = (registry, batch, activation) =>
  registry.register(JSON.parse(JSON.stringify(batch)), activation);

test("registers immutable core routes once and does not let plugins shadow them", () => {
  const registry = createRegistry();
  const pages = JSON.parse(JSON.stringify(registry.listPages()));
  assert.deepEqual(
    pages.map(({ route }) => route),
    ["welcome", "battle", "gameplay", "history", "archives", "settings"],
  );
  const activation = pluginContext(registry);
  assert.throws(
    () =>
      register(
        registry,
        [
          {
            localId: "battle",
            kind: "page",
            descriptor: {
              titleKey: "x",
              renderer: "builtin.plugin-workspace",
              route: "battle",
            },
          },
        ],
        activation,
      ),
    /reserved|conflict|host-generated/i,
  );
  assert.equal(registry.listPages().length, 6);
});

test("validates a batch atomically and rejects duplicate IDs, unknown slots and executable descriptors", () => {
  const registry = createRegistry();
  const activation = pluginContext(registry);
  assert.throws(
    () =>
      register(
        registry,
        [
          {
            localId: "good",
            kind: "page",
            descriptor: {
              titleKey: "good",
              renderer: "builtin.plugin-workspace",
            },
          },
          {
            localId: "bad",
            kind: "panel",
            descriptor: {
              slot: "document.body",
              renderer: "builtin.plugin-workspace",
            },
          },
        ],
        activation,
      ),
    /slot/i,
  );
  assert.equal(registry.listByPlugin("official.example").length, 0);
  assert.throws(
    () =>
      register(
        registry,
        [
          {
            localId: "one",
            kind: "page",
            descriptor: { titleKey: "x", renderer: "builtin.plugin-workspace" },
          },
          {
            localId: "one",
            kind: "page",
            descriptor: { titleKey: "y", renderer: "builtin.plugin-workspace" },
          },
        ],
        activation,
      ),
    /duplicate/i,
  );
  assert.throws(
    () =>
      register(
        registry,
        [
          {
            localId: "html",
            kind: "page",
            descriptor: {
              titleKey: "x",
              renderer: "builtin.plugin-workspace",
              html: "<img onerror=alert(1)>",
            },
          },
        ],
        activation,
      ),
    /executable|html|field/i,
  );
  assert.equal(registry.listByPlugin("official.example").length, 0);
});

test("binds plugin identity and scope to host activation instead of trusting descriptors", () => {
  const registry = createRegistry();
  const activation = pluginContext(registry, "official.safe");
  assert.throws(
    () =>
      register(
        registry,
        [
          {
            pluginId: "official.impostor",
            localId: "page",
            kind: "page",
            descriptor: { titleKey: "x", renderer: "builtin.plugin-workspace" },
          },
        ],
        activation,
      ),
    /identity|pluginId/i,
  );
  assert.throws(
    () =>
      register(
        registry,
        [
          {
            localId: "page",
            kind: "page",
            scope: { teacherId: "teacher-2" },
            descriptor: { titleKey: "x", renderer: "builtin.plugin-workspace" },
          },
        ],
        activation,
      ),
    /scope/i,
  );
  assert.throws(
    () =>
      register(
        registry,
        [
          {
            localId: "page",
            kind: "page",
            requiredPermissions: ["classroom.write"],
            descriptor: { titleKey: "x", renderer: "builtin.plugin-workspace" },
          },
        ],
        activation,
      ),
    /permission/i,
  );
  assert.equal(registry.listByPlugin("official.safe").length, 0);
  assert.throws(
    () =>
      register(
        registry,
        [
          {
            localId: "path/escape",
            kind: "page",
            descriptor: { titleKey: "x", renderer: "builtin.plugin-workspace" },
          },
        ],
        activation,
      ),
    /local contribution id/i,
  );
  assert.throws(
    () => registry.activate("official..unsafe", { scope: {}, permissions: [] }),
    /identity/i,
  );
  assert.throws(
    () =>
      register(
        registry,
        [
          {
            localId: "page",
            kind: "page",
            descriptor: { titleKey: "x", renderer: "builtin.plugin-workspace" },
          },
        ],
        { activationId: activation.activationId },
      ),
    /inactive/i,
  );
});

test("disposes only the matching activation and makes repeated disposal safe", () => {
  const registry = createRegistry();
  const first = pluginContext(registry, "official.one");
  const second = pluginContext(registry, "official.two");
  const page = (localId) => ({
    localId,
    kind: "page",
    descriptor: { titleKey: localId, renderer: "builtin.plugin-workspace" },
  });
  const firstReceipt = register(registry, [page("one")], first);
  register(registry, [page("two")], second);
  registry.dispose(firstReceipt.activationId);
  registry.dispose(firstReceipt.activationId);
  assert.equal(registry.listByPlugin("official.one").length, 0);
  assert.equal(registry.listByPlugin("official.two").length, 1);
  assert.throws(
    () => register(registry, [page("late")], first),
    /inactive|disposed/i,
  );
});

test("returns cloned read-only data and rejects unknown kinds", () => {
  const registry = createRegistry();
  const activation = pluginContext(registry);
  const receipt = register(
    registry,
    [
      {
        localId: "dashboard",
        kind: "card",
        descriptor: {
          slot: "home.cards",
          renderer: "builtin.dashboard-card",
          titleKey: "demo",
        },
      },
    ],
    activation,
  );
  const listed = JSON.parse(
    JSON.stringify(registry.listByPlugin("official.example")),
  );
  listed[0].descriptor.titleKey = "changed";
  assert.equal(
    JSON.parse(JSON.stringify(registry.listByPlugin("official.example")))[0]
      .descriptor.titleKey,
    "demo",
  );
  assert.ok(receipt.revision > 0);
  assert.throws(
    () =>
      register(
        registry,
        [{ localId: "unknown", kind: "arbitrary-dom", descriptor: {} }],
        activation,
      ),
    /kind/i,
  );
});
