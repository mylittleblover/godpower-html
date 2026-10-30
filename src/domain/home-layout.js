/* Pure, versioned dashboard layout model. No classroom state or DOM access. */
(function installHomeLayout(root) {
  "use strict";
  const GRID_COLUMNS = 12;
  const MAX_INSTANCES = 100;
  const MAX_ROWS = 500;
  const TYPE_ID = /^[a-z][a-z0-9.-]{1,100}$/;
  const INSTANCE_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const fail = (message) => {
    throw new TypeError(message);
  };

  function validateJson(value, depth = 0, count = { value: 0 }) {
    if (depth > 8 || ++count.value > 2000) fail("config exceeds safe bounds");
    if (
      value === null ||
      typeof value === "boolean" ||
      (typeof value === "number" && Number.isFinite(value))
    )
      return;
    if (typeof value === "string") {
      if (value.length > 10000) fail("config string is too large");
      return;
    }
    if (Array.isArray(value)) {
      if (value.length > 100) fail("config array is too large");
      for (const item of value) validateJson(item, depth + 1, count);
      return;
    }
    if (!value || typeof value !== "object")
      fail("config must contain JSON values only");
    for (const key of Object.keys(value)) {
      if (["__proto__", "prototype", "constructor"].includes(key))
        fail("config contains a forbidden prototype key");
      validateJson(value[key], depth + 1, count);
    }
  }

  function validSize(size) {
    return !!(
      size &&
      Number.isInteger(size.minW) &&
      size.minW >= 1 &&
      size.minW <= GRID_COLUMNS &&
      Number.isInteger(size.minH) &&
      size.minH >= 1 &&
      Number.isInteger(size.defaultW) &&
      size.defaultW >= size.minW &&
      size.defaultW <= GRID_COLUMNS &&
      Number.isInteger(size.defaultH) &&
      size.defaultH >= size.minH &&
      Number.isInteger(size.maxW) &&
      size.maxW >= size.defaultW &&
      size.maxW <= GRID_COLUMNS &&
      Number.isInteger(size.maxH) &&
      size.maxH >= size.defaultH &&
      size.maxH <= 24
    );
  }

  function normalizeCatalog(catalog) {
    if (!Array.isArray(catalog) || catalog.length > 200)
      fail("card catalog must be a bounded array");
    const map = new Map();
    for (const definition of catalog) {
      if (
        !definition ||
        typeof definition.typeId !== "string" ||
        !TYPE_ID.test(definition.typeId) ||
        map.has(definition.typeId) ||
        !validSize(definition.size)
      )
        fail("invalid or duplicate card type definition");
      map.set(definition.typeId, {
        typeId: definition.typeId,
        source:
          typeof definition.source === "string" ? definition.source : "core",
        supportsMultipleInstances:
          definition.supportsMultipleInstances === true,
        size: clone(definition.size),
        configSchemaVersion: Number.isInteger(definition.configSchemaVersion)
          ? definition.configSchemaVersion
          : 1,
      });
    }
    return map;
  }

  function intersects(a, b) {
    return (
      a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
    );
  }

  function validateLayout(input) {
    if (
      !input ||
      typeof input !== "object" ||
      Array.isArray(input) ||
      input.schemaVersion !== 1 ||
      typeof input.layoutId !== "string" ||
      !INSTANCE_ID.test(input.layoutId) ||
      typeof input.name !== "string" ||
      !input.name.trim() ||
      input.name.length > 80 ||
      !Number.isSafeInteger(input.revision) ||
      input.revision < 1 ||
      input.gridProfile !== "desktop-12" ||
      !Array.isArray(input.instances) ||
      input.instances.length > MAX_INSTANCES
    )
      fail("invalid dashboard layout header");
    const ids = new Set();
    const instances = input.instances.map((instance) => {
      const p = instance?.position;
      if (
        !instance ||
        typeof instance.instanceId !== "string" ||
        !INSTANCE_ID.test(instance.instanceId) ||
        ids.has(instance.instanceId) ||
        typeof instance.typeId !== "string" ||
        !TYPE_ID.test(instance.typeId) ||
        !p ||
        !Number.isInteger(p.x) ||
        p.x < 0 ||
        p.x >= GRID_COLUMNS ||
        !Number.isInteger(p.y) ||
        p.y < 0 ||
        p.y > MAX_ROWS ||
        !Number.isInteger(p.w) ||
        p.w < 1 ||
        p.w > GRID_COLUMNS ||
        p.x + p.w > GRID_COLUMNS ||
        !Number.isInteger(p.h) ||
        p.h < 1 ||
        p.h > 24 ||
        typeof instance.visible !== "boolean" ||
        !Number.isInteger(instance.configVersion) ||
        instance.configVersion < 1 ||
        !instance.config ||
        typeof instance.config !== "object" ||
        Array.isArray(instance.config)
      )
        fail("invalid dashboard card instance");
      ids.add(instance.instanceId);
      validateJson(instance.config);
      return clone(instance);
    });
    for (let i = 0; i < instances.length; i++)
      for (let j = i + 1; j < instances.length; j++)
        if (
          instances[i].visible &&
          instances[j].visible &&
          intersects(instances[i].position, instances[j].position)
        )
          fail("dashboard card instances overlap");
    return {
      schemaVersion: 1,
      layoutId: input.layoutId,
      name: input.name.trim(),
      revision: input.revision,
      gridProfile: "desktop-12",
      instances,
      ...(typeof input.updatedAt === "string"
        ? { updatedAt: input.updatedAt }
        : {}),
    };
  }

  function emptyLayout(layoutId = "layout-default", name = "默认布局") {
    return validateLayout({
      schemaVersion: 1,
      layoutId,
      name,
      revision: 1,
      gridProfile: "desktop-12",
      instances: [],
    });
  }

  function createDefaultLayout(layoutId, name, cards, makeInstanceId) {
    if (!Array.isArray(cards) || typeof makeInstanceId !== "function")
      fail("cards and instance ID factory are required");
    const instances = [];
    let x = 0,
      y = 0,
      rowHeight = 0;
    for (const card of cards) {
      const size = card?.size;
      if (!card || typeof card.typeId !== "string" || !validSize(size))
        fail("default layout contains an invalid card type");
      if (x + size.defaultW > GRID_COLUMNS) {
        x = 0;
        y += rowHeight;
        rowHeight = 0;
      }
      const instanceId = makeInstanceId();
      instances.push({
        instanceId,
        typeId: card.typeId,
        position: { x, y, w: size.defaultW, h: size.defaultH },
        visible: true,
        configVersion: Number.isInteger(card.configSchemaVersion)
          ? card.configSchemaVersion
          : 1,
        config: {},
      });
      x += size.defaultW;
      rowHeight = Math.max(rowHeight, size.defaultH);
    }
    return validateLayout({
      schemaVersion: 1,
      layoutId,
      name,
      revision: 1,
      gridProfile: "desktop-12",
      instances,
    });
  }

  function createLayoutService({ catalog, initial, makeInstanceId }) {
    const types = normalizeCatalog(catalog);
    if (typeof makeInstanceId !== "function")
      fail("instance ID factory is required");
    let saved = validateLayout(initial || emptyLayout());
    let draft = clone(saved);
    let undoStack = [];
    let redoStack = [];
    const requireType = (typeId) => {
      const type = types.get(typeId);
      if (!type) fail("card type is unavailable");
      return type;
    };
    const requireInstance = (id) => {
      const value = draft.instances.find(
        (instance) => instance.instanceId === id,
      );
      if (!value) fail("card instance was not found");
      return value;
    };
    function apply(next) {
      const valid = validateLayout(next);
      undoStack.push(clone(draft));
      if (undoStack.length > 100) undoStack.shift();
      redoStack = [];
      draft = valid;
    }
    function freePosition(w, h, ignoredId = "") {
      for (let y = 0; y < MAX_ROWS; y++)
        for (let x = 0; x <= GRID_COLUMNS - w; x++) {
          const candidate = { x, y, w, h };
          if (
            !draft.instances.some(
              (item) =>
                item.visible &&
                item.instanceId !== ignoredId &&
                intersects(candidate, item.position),
            )
          )
            return candidate;
        }
      fail("no free dashboard grid position is available");
    }
    function repack(changedId, changedPosition) {
      const target = requireInstance(changedId);
      const instances = clone(draft.instances);
      const targetCopy = instances.find(
        (item) => item.instanceId === changedId,
      );
      targetCopy.position = changedPosition;
      const placed = targetCopy.visible ? [targetCopy] : [];
      const rest = instances
        .filter((item) => item.instanceId !== changedId && item.visible)
        .sort(
          (a, b) =>
            a.position.y - b.position.y ||
            a.position.x - b.position.x ||
            a.instanceId.localeCompare(b.instanceId),
        );
      for (const item of rest) {
        const preferred = { ...item.position };
        let candidate = preferred;
        while (
          placed.some((other) => intersects(candidate, other.position)) &&
          candidate.y < MAX_ROWS
        )
          candidate = { ...candidate, y: candidate.y + 1 };
        if (candidate.y > MAX_ROWS) fail("dashboard grid is full");
        item.position = candidate;
        placed.push(item);
      }
      apply({ ...draft, instances });
      return clone(targetCopy);
    }
    return Object.freeze({
      getSaved: () => clone(saved),
      getDraft: () => clone(draft),
      add(typeId, config = {}) {
        const type = requireType(typeId);
        if (
          !type.supportsMultipleInstances &&
          draft.instances.some((item) => item.typeId === typeId)
        )
          fail("card type already exists in this layout");
        if (draft.instances.length >= MAX_INSTANCES)
          fail("dashboard instance limit reached");
        validateJson(config);
        const instanceId = makeInstanceId();
        if (typeof instanceId !== "string" || !INSTANCE_ID.test(instanceId))
          fail("instance ID factory returned an invalid ID");
        const instance = {
          instanceId,
          typeId,
          position: freePosition(type.size.defaultW, type.size.defaultH),
          visible: true,
          configVersion: type.configSchemaVersion,
          config: clone(config),
        };
        apply({ ...draft, instances: [...draft.instances, instance] });
        return clone(instance);
      },
      remove(id) {
        requireInstance(id);
        apply({
          ...draft,
          instances: draft.instances.filter((item) => item.instanceId !== id),
        });
      },
      duplicate(id) {
        const source = requireInstance(id);
        const type = requireType(source.typeId);
        if (!type.supportsMultipleInstances)
          fail("card type does not support multiple instances");
        if (draft.instances.length >= MAX_INSTANCES)
          fail("dashboard instance limit reached");
        const instanceId = makeInstanceId();
        if (typeof instanceId !== "string" || !INSTANCE_ID.test(instanceId))
          fail("instance ID factory returned an invalid ID");
        const instance = {
          ...clone(source),
          instanceId,
          position: freePosition(source.position.w, source.position.h),
          config: clone(source.config),
        };
        apply({ ...draft, instances: [...draft.instances, instance] });
        return clone(instance);
      },
      move(id, x, y) {
        if (!Number.isInteger(x) || !Number.isInteger(y))
          fail("grid coordinates must be integers");
        const instance = requireInstance(id);
        const position = {
          ...instance.position,
          x: Math.max(0, Math.min(GRID_COLUMNS - instance.position.w, x)),
          y: Math.max(0, Math.min(MAX_ROWS, y)),
        };
        return repack(id, position);
      },
      resize(id, x, y, w, h) {
        const instance = requireInstance(id);
        const type = requireType(instance.typeId);
        if (![x, y, w, h].every(Number.isInteger))
          fail("grid size and position must be integers");
        const position = {
          x: Math.max(0, Math.min(GRID_COLUMNS - type.size.minW, x)),
          y: Math.max(0, Math.min(MAX_ROWS, y)),
          w: Math.max(type.size.minW, Math.min(type.size.maxW, w)),
          h: Math.max(type.size.minH, Math.min(type.size.maxH, h)),
        };
        position.x = Math.min(position.x, GRID_COLUMNS - position.w);
        return repack(id, position);
      },
      hide(id, hidden) {
        if (typeof hidden !== "boolean") fail("hidden state must be boolean");
        const instance = requireInstance(id);
        const instances = clone(draft.instances);
        instances.find((item) => item.instanceId === id).visible = !hidden;
        apply({ ...draft, instances });
        return clone(instance);
      },
      updateConfig(id, config, configVersion) {
        const instance = requireInstance(id);
        validateJson(config);
        if (!Number.isInteger(configVersion) || configVersion < 1)
          fail("config version is invalid");
        const instances = clone(draft.instances);
        const item = instances.find((entry) => entry.instanceId === id);
        item.config = clone(config);
        item.configVersion = configVersion;
        apply({ ...draft, instances });
      },
      replaceDraft(layout) {
        apply(validateLayout(layout));
        return clone(draft);
      },
      undo() {
        if (!undoStack.length) return false;
        redoStack.push(clone(draft));
        draft = undoStack.pop();
        return true;
      },
      redo() {
        if (!redoStack.length) return false;
        undoStack.push(clone(draft));
        draft = redoStack.pop();
        return true;
      },
      cancel() {
        draft = clone(saved);
        undoStack = [];
        redoStack = [];
      },
      save() {
        const next = validateLayout({ ...draft, revision: saved.revision + 1 });
        saved = next;
        draft = clone(next);
        undoStack = [];
        redoStack = [];
        return clone(saved);
      },
    });
  }

  root.HomeLayout = Object.freeze({
    GRID_COLUMNS,
    MAX_INSTANCES,
    validateLayout,
    emptyLayout,
    createDefaultLayout,
    createLayoutService,
  });
})(globalThis);
