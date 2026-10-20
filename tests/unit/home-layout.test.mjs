import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";

const scope = vm.createContext({});
vm.runInContext(
  readFileSync("src/domain/home-layout.js", "utf8") +
    "\nglobalThis.api = HomeLayout;",
  scope,
);

const card = (typeId, changes = {}) => ({
  typeId,
  source: "core",
  supportsMultipleInstances: true,
  size: { minW: 2, minH: 1, defaultW: 4, defaultH: 2, maxW: 12, maxH: 8 },
  configSchemaVersion: 1,
  ...changes,
});

test("validates bounded grid layouts and rejects overlaps and executable data", () => {
  const layout = {
    schemaVersion: 1,
    layoutId: "layout-main",
    name: "默认布局",
    revision: 1,
    gridProfile: "desktop-12",
    instances: [
      {
        instanceId: "instance-a",
        typeId: "core.ranking",
        position: { x: 0, y: 0, w: 6, h: 3 },
        visible: true,
        configVersion: 1,
        config: {},
      },
    ],
  };
  assert.deepEqual(
    JSON.parse(JSON.stringify(scope.api.validateLayout(layout))),
    layout,
  );
  assert.throws(
    () =>
      scope.api.validateLayout({
        ...layout,
        instances: [
          ...layout.instances,
          { ...layout.instances[0], instanceId: "instance-b" },
        ],
      }),
    /overlap/i,
  );
  assert.throws(
    () =>
      scope.api.validateLayout({
        ...layout,
        instances: [
          {
            ...layout.instances[0],
            config: JSON.parse('{"__proto__":{"polluted":true}}'),
          },
        ],
      }),
    /config|prototype/i,
  );
  assert.throws(
    () =>
      scope.api.validateLayout({
        ...layout,
        instances: Array(101).fill(layout.instances[0]),
      }),
    /layout|instance|duplicate/i,
  );
});

test("creates unique home instances and refuses duplicate single-instance card types", () => {
  const service = scope.api.createLayoutService({
    catalog: [
      card("core.ranking", { supportsMultipleInstances: false }),
      card("plugin.notice"),
    ],
    initial: scope.api.emptyLayout("layout-main", "默认布局"),
    makeInstanceId: (() => {
      let id = 0;
      return () => `instance-${++id}`;
    })(),
  });
  const first = service.add("core.ranking");
  assert.equal(first.instanceId, "instance-1");
  assert.throws(() => service.add("core.ranking"), /already exists|duplicate/i);
  const plugin1 = service.add("plugin.notice", { text: "A" });
  const plugin2 = service.duplicate(plugin1.instanceId);
  assert.equal(plugin2.typeId, "plugin.notice");
  assert.equal(plugin2.config.text, "A");
  plugin2.config.text = "B";
  assert.equal(
    service
      .getDraft()
      .instances.find((item) => item.instanceId === plugin1.instanceId).config
      .text,
    "A",
  );
});

test("moving and resizing uses deterministic collision resolution without overlap", () => {
  const layout = scope.api.createDefaultLayout(
    "layout-main",
    "默认布局",
    [
      {
        typeId: "core.a",
        size: { minW: 2, minH: 1, defaultW: 6, defaultH: 2, maxW: 12, maxH: 8 },
      },
      {
        typeId: "core.b",
        size: { minW: 2, minH: 1, defaultW: 6, defaultH: 2, maxW: 12, maxH: 8 },
      },
    ],
    (() => {
      let id = 0;
      return () => `instance-${++id}`;
    })(),
  );
  const service = scope.api.createLayoutService({
    catalog: [card("core.a"), card("core.b")],
    initial: layout,
    makeInstanceId: () => "instance-unused",
  });
  const before = service.getDraft();
  service.move(before.instances[1].instanceId, 0, 0);
  const moved = service.getDraft();
  assert.equal(moved.instances[1].position.x, 0);
  assert.ok(moved.instances[0].position.y > 0);
  assert.equal(scope.api.validateLayout(moved).instances.length, 2);
  const resized = service.resize(before.instances[1].instanceId, 1, 1, 12, 4);
  assert.equal(resized.position.w, 12);
  assert.equal(resized.position.h, 4);
  assert.doesNotThrow(() => scope.api.validateLayout(service.getDraft()));
});

test("draft undo redo, hide, cancel, and save never mutate initial layout", () => {
  const initial = scope.api.createDefaultLayout(
    "layout-main",
    "默认布局",
    [{ typeId: "core.a", size: card("core.a").size }],
    () => "instance-a",
  );
  const service = scope.api.createLayoutService({
    catalog: [card("core.a")],
    initial,
    makeInstanceId: () => "instance-unused",
  });
  const id = initial.instances[0].instanceId;
  service.hide(id, true);
  assert.equal(service.getDraft().instances[0].visible, false);
  service.undo();
  assert.equal(service.getDraft().instances[0].visible, true);
  service.redo();
  assert.equal(service.getDraft().instances[0].visible, false);
  service.cancel();
  assert.equal(service.getDraft().instances[0].visible, true);
  service.hide(id, true);
  const saved = service.save();
  assert.equal(saved.revision, 2);
  assert.equal(saved.instances[0].visible, false);
  assert.equal(initial.instances[0].visible, true);
});
