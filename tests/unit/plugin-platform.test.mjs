import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import test from "node:test";

const source = await readFile("src/application/plugin-platform.js", "utf8");
const registrySource = await readFile(
  "src/ui/contribution-registry.js",
  "utf8",
);
function setup(
  getScope = () => ({ teacherId: "teacher-1", classId: "class-1" }),
) {
  const root = { console, structuredClone };
  root.globalThis = root;
  vm.runInNewContext(registrySource, root);
  vm.runInNewContext(source, root);
  const records = new Map();
  const repository = {
    load: (id) => records.get(id) ?? null,
    save: (id, value) => records.set(id, structuredClone(value)),
    delete: (id) => records.delete(id),
    list: () => [...records.values()].map((value) => structuredClone(value)),
  };
  return {
    root,
    repository,
    platform: root.GodPowerPluginPlatform.createPluginPlatform({
      contributions:
        root.GodPowerContributionRegistry.createContributionRegistry(),
      repository,
      currentScope: getScope,
    }),
  };
}
const manifest = (overrides = {}) => ({
  manifestVersion: 1,
  id: "community.example",
  name: { "zh-CN": "示例插件" },
  description: { "zh-CN": "离线示例" },
  author: { name: "GodPower" },
  version: "1.0.0",
  sdk: ">=1.0.0 <2.0.0",
  types: ["tool"],
  subjects: [],
  platforms: ["html", "electron"],
  entry: { content: "content.json" },
  permissions: [
    { capability: "ui.page.register", required: true },
    { capability: "plugin.storage", required: true },
  ],
  dependencies: {},
  optionalDependencies: {},
  contributes: [
    {
      localId: "home",
      kind: "page",
      descriptor: {
        titleKey: "plugin.example.title",
        renderer: "builtin.plugin-workspace",
      },
    },
  ],
  data: { schemaVersion: 1 },
  ...overrides,
});

test("validates manifests and rejects executable entries, unsafe IDs and unknown capabilities", () => {
  const { platform } = setup();
  assert.throws(() => platform.install(manifest({ id: "../evil" })), /id/i);
  assert.throws(
    () => platform.install(manifest({ id: "official.fake" })),
    /official/i,
  );
  assert.throws(
    () => platform.install(manifest({ entry: { logic: "logic.js" } })),
    /executable|logic/i,
  );
  assert.throws(
    () =>
      platform.install(
        manifest({
          permissions: [{ capability: "electron.invoke", required: true }],
        }),
      ),
    /capability|permission/i,
  );
  assert.throws(
    () => platform.install(manifest({ sdk: ">=2.0.0 <3.0.0" })),
    /SDK|compatible/i,
  );
  assert.throws(
    () =>
      platform.install(
        manifest({ dependencies: { "community.provider": ">=1.0.0" } }),
      ),
    /invalid dependency/i,
  );
  assert.throws(
    () =>
      platform.install(
        manifest({
          dependencies: { "community.provider": "^1.0.0" },
          optionalDependencies: { "community.provider": "~1.0.0" },
        }),
      ),
    /both required and optional/i,
  );
});

test("required plugin dependencies enforce semantic version ranges and block unsafe uninstall", () => {
  const { platform } = setup();
  const provider = manifest({
    id: "community.provider",
    version: "2.4.1+build.7",
    permissions: [],
    contributes: [],
  });
  platform.install(provider);
  platform.install(
    manifest({
      id: "community.consumer",
      dependencies: { "community.provider": "^2.3.0" },
    }),
  );
  platform.grantPermissions("community.consumer", [
    "ui.page.register",
    "plugin.storage",
  ]);
  assert.throws(
    () => platform.activate("community.consumer"),
    /inactive in this scope/i,
  );
  platform.activate("community.provider");
  assert.equal(platform.activate("community.consumer").state, "active");
  platform.deactivate("community.consumer");
  platform.deactivate("community.provider");
  assert.throws(
    () => platform.uninstall("community.provider"),
    /required by community.consumer/i,
  );
  assert.throws(
    () => platform.activate("community.consumer"),
    /inactive in this scope/i,
  );
  platform.uninstall("community.consumer");
  assert.equal(platform.uninstall("community.provider"), true);
  platform.install(
    manifest({
      id: "community.consumer",
      dependencies: { "community.provider": "^2.3.0" },
    }),
  );
  platform.grantPermissions("community.consumer", [
    "ui.page.register",
    "plugin.storage",
  ]);
  assert.throws(
    () => platform.activate("community.consumer"),
    /not installed/i,
  );
});

test("semver dependency ranges handle zero-major caret, tilde and incompatible versions", () => {
  const { platform } = setup();
  const provider = (version) =>
    manifest({
      id: "community.provider",
      version,
      permissions: [],
      contributes: [],
    });
  platform.install(provider("0.2.4"));
  platform.activate("community.provider");
  platform.install(
    manifest({
      id: "community.consumer",
      dependencies: { "community.provider": "^0.2.3" },
    }),
  );
  platform.grantPermissions("community.consumer", [
    "ui.page.register",
    "plugin.storage",
  ]);
  assert.equal(platform.activate("community.consumer").state, "active");
  platform.deactivate("community.consumer");
  platform.uninstall("community.consumer");
  platform.install(
    manifest({
      id: "community.consumer",
      dependencies: { "community.provider": "~0.3.0" },
    }),
  );
  platform.grantPermissions("community.consumer", [
    "ui.page.register",
    "plugin.storage",
  ]);
  assert.throws(
    () => platform.activate("community.consumer"),
    /version mismatch/i,
  );
});

test("exact and bounded dependency ranges use inclusive lower and exclusive upper limits", () => {
  const { platform } = setup();
  const provider = manifest({
    id: "community.provider",
    version: "1.2.3",
    permissions: [],
    contributes: [],
  });
  platform.install(provider);
  platform.activate("community.provider");
  const consumer = (range) =>
    manifest({
      id: "community.consumer",
      dependencies: { "community.provider": range },
    });
  platform.install(consumer(">=1.2.3 <1.2.4"));
  platform.grantPermissions("community.consumer", [
    "ui.page.register",
    "plugin.storage",
  ]);
  assert.equal(platform.activate("community.consumer").state, "active");
  platform.deactivate("community.consumer");
  platform.uninstall("community.consumer");
  platform.install(consumer("1.2.3"));
  platform.grantPermissions("community.consumer", [
    "ui.page.register",
    "plugin.storage",
  ]);
  assert.equal(platform.activate("community.consumer").state, "active");
  platform.deactivate("community.consumer");
  platform.uninstall("community.consumer");
  assert.throws(
    () => platform.install(consumer(">=1.2.3 <1.2.3")),
    /invalid dependency/i,
  );
});

test("installation is inert; activation requires explicit grants and contributions commit atomically", () => {
  const { platform } = setup();
  const installed = platform.install(manifest());
  assert.equal(installed.state, "installed");
  assert.equal(platform.list().length, 1);
  assert.equal(platform.contributions.listPages().length, 6);
  assert.throws(() => platform.activate("community.example"), /permission/i);
  platform.grantPermissions("community.example", [
    "ui.page.register",
    "plugin.storage",
  ]);
  const active = platform.activate("community.example");
  assert.equal(active.state, "active");
  assert.equal(platform.contributions.listPages().length, 7);
  assert.equal(
    platform.contributions.resolvePage("plugins/community.example/home")
      .pluginId,
    "community.example",
  );
});

test("scope change and deactivate revoke the activation and all contributions", () => {
  let scope = { teacherId: "teacher-1", classId: "class-1" };
  const { platform } = setup(() => scope);
  platform.install(manifest());
  platform.grantPermissions("community.example", [
    "ui.page.register",
    "plugin.storage",
  ]);
  platform.activate("community.example", scope);
  scope = { teacherId: "teacher-2", classId: "class-2" };
  assert.equal(platform.reconcileScope(scope).length, 1);
  assert.equal(platform.get("community.example").state, "installed");
  assert.equal(platform.contributions.listPages().length, 6);
  platform.grantPermissions("community.example", [
    "ui.page.register",
    "plugin.storage",
  ]);
  platform.activate("community.example", scope);
  platform.deactivate("community.example");
  assert.equal(platform.contributions.listPages().length, 6);
});

test("private storage binds plugin and host scope, enforces revisions and keeps data on uninstall by default", () => {
  const { platform } = setup();
  platform.install(manifest());
  platform.grantPermissions("community.example", [
    "ui.page.register",
    "plugin.storage",
  ]);
  const activation = platform.activate("community.example");
  const store = platform.storage(activation.handle);
  assert.deepEqual(
    JSON.parse(JSON.stringify(store.set("notes", { text: "保留" }, 0))),
    { revision: 1 },
  );
  assert.deepEqual(JSON.parse(JSON.stringify(store.get("notes"))), {
    value: { text: "保留" },
    revision: 1,
  });
  assert.throws(() => store.set("notes", { text: "冲突" }, 0), /revision/i);
  platform.deactivate("community.example");
  platform.uninstall("community.example");
  platform.install(manifest());
  platform.grantPermissions("community.example", [
    "ui.page.register",
    "plugin.storage",
  ]);
  const next = platform.storage(platform.activate("community.example").handle);
  assert.equal(next.get("notes").value.text, "保留");
});

test("inactive uninstall can explicitly purge only its own namespace; active uninstall is refused", () => {
  const { platform } = setup();
  platform.install(manifest());
  platform.grantPermissions("community.example", [
    "ui.page.register",
    "plugin.storage",
  ]);
  const activation = platform.activate("community.example");
  const store = platform.storage(activation.handle);
  store.set("notes", "x", 0);
  assert.throws(() => platform.uninstall("community.example"), /deactivate/i);
  platform.deactivate("community.example");
  platform.uninstall("community.example", { purgeData: true });
  assert.equal(platform.list().length, 0);
  assert.throws(() => store.get("notes"), /inactive|stale/i);
});

test("a failed contribution batch leaves plugin installed and publishes no partial route", () => {
  const { platform } = setup();
  const invalid = manifest({
    permissions: [
      { capability: "ui.page.register", required: true },
      { capability: "plugin.storage", required: true },
      { capability: "ui.panel.register", required: false },
    ],
    contributes: [
      ...manifest().contributes,
      {
        localId: "bad",
        kind: "panel",
        descriptor: {
          slot: "document.body",
          renderer: "builtin.notice",
          titleKey: "plugin.bad",
        },
      },
    ],
  });
  platform.install(invalid);
  platform.grantPermissions("community.example", [
    "ui.page.register",
    "plugin.storage",
    "ui.panel.register",
  ]);
  assert.throws(() => platform.activate("community.example"), /slot/i);
  assert.equal(platform.get("community.example").state, "installed");
  assert.equal(platform.contributions.listPages().length, 6);
});

test("startup recovers persisted active state as inactive without replaying contributions", () => {
  const first = setup();
  first.platform.install(manifest());
  first.platform.grantPermissions("community.example", [
    "ui.page.register",
    "plugin.storage",
  ]);
  first.platform.activate("community.example");
  assert.equal(first.platform.get("community.example").state, "active");
  const secondRegistry =
    first.root.GodPowerContributionRegistry.createContributionRegistry();
  const recovered = first.root.GodPowerPluginPlatform.createPluginPlatform({
    contributions: secondRegistry,
    repository: first.repository,
    currentScope: () => ({ teacherId: "teacher-1", classId: "class-1" }),
  });
  assert.equal(recovered.get("community.example").state, "installed");
  assert.equal(secondRegistry.listPages().length, 6);
});
