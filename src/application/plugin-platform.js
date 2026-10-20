/* Host-owned declarative plugin lifecycle. It never evaluates plugin code. */
(function installGodPowerPluginPlatform(root) {
  "use strict";

  const KNOWN_CAPABILITIES = new Set([
    "classroom.read",
    "students.read",
    "groups.read",
    "competition.stats.read",
    "competition.commands.request",
    "rules.register",
    "resources.read",
    "resources.write",
    "plugin.storage",
    "network.request",
    "files.open",
    "files.save",
    "audio.play",
    "audio.capture",
    "midi.access",
    "camera.capture",
    "microphone.capture",
    "native.device",
    "ui.page.register",
    "ui.navigation.register",
    "ui.card.register",
    "ui.panel.register",
    "ui.settings.register",
    "ui.commandShortcut.register",
    "ui.viewPreset.register",
    "ui.decoration.register",
    "ui.theme.register",
    "ui.text.register",
  ]);
  const TYPES = new Set([
    "gameplay",
    "subject",
    "theme",
    "tool",
    "resource",
    "native",
  ]);
  const SUBJECTS = new Set([
    "chinese",
    "math",
    "english",
    "physics",
    "chemistry",
    "biology",
    "history",
    "politics",
    "geography",
    "art",
    "music",
  ]);
  const PLATFORMS = new Set(["html", "electron"]);
  const ID = /^[a-z0-9]+(?:[.-][a-z0-9]+)+$/;
  const LOCAL_ID = /^[a-z0-9][a-z0-9._-]{0,63}$/;
  const SEMVER =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|[0-9A-Za-z-]*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|[0-9A-Za-z-]*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+[0-9A-Za-z.-]+)?$/;
  const SAFE_KEY = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,95}$/;
  const MANIFEST_FIELDS = new Set([
    "manifestVersion",
    "id",
    "name",
    "description",
    "author",
    "version",
    "sdk",
    "types",
    "subjects",
    "platforms",
    "entry",
    "permissions",
    "dependencies",
    "optionalDependencies",
    "contributes",
    "data",
  ]);
  const clone = (value) => JSON.parse(JSON.stringify(value));
  // A conservative UTF-8 upper bound that also works in the isolated test VM.
  const bytes = (value) => JSON.stringify(value).length * 3;
  const fail = (message) => {
    throw new TypeError(message);
  };

  function parseSemver(value) {
    if (typeof value !== "string" || !SEMVER.test(value)) return null;
    const [buildless] = value.split("+");
    const [core, prerelease = ""] = buildless.split("-");
    return {
      core: core.split(".").map(Number),
      prerelease: prerelease ? prerelease.split(".") : [],
    };
  }
  function compareSemver(left, right) {
    const a = parseSemver(left),
      b = parseSemver(right);
    if (!a || !b) fail("invalid semantic version");
    for (let i = 0; i < 3; i++)
      if (a.core[i] !== b.core[i]) return a.core[i] < b.core[i] ? -1 : 1;
    if (!a.prerelease.length || !b.prerelease.length)
      return a.prerelease.length === b.prerelease.length
        ? 0
        : a.prerelease.length
          ? -1
          : 1;
    const length = Math.max(a.prerelease.length, b.prerelease.length);
    for (let i = 0; i < length; i++) {
      if (a.prerelease[i] === undefined || b.prerelease[i] === undefined)
        return a.prerelease[i] === undefined ? -1 : 1;
      const an = /^(0|[1-9]\d*)$/.test(a.prerelease[i]),
        bn = /^(0|[1-9]\d*)$/.test(b.prerelease[i]);
      if (an && bn && Number(a.prerelease[i]) !== Number(b.prerelease[i]))
        return Number(a.prerelease[i]) < Number(b.prerelease[i]) ? -1 : 1;
      if (an !== bn) return an ? -1 : 1;
      if (a.prerelease[i] !== b.prerelease[i])
        return a.prerelease[i] < b.prerelease[i] ? -1 : 1;
    }
    return 0;
  }
  function dependencyRange(value) {
    if (typeof value !== "string" || value.length > 80) return null;
    const exact = value.match(
      /^((?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?)$/,
    );
    if (exact && SEMVER.test(exact[1]))
      return { lower: exact[1], upper: exact[1], exact: true };
    const operator = value.match(
      /^([~^])((?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?)$/,
    );
    if (operator && SEMVER.test(operator[2])) {
      const [major, minor, patch] = operator[2]
        .split("-")[0]
        .split(".")
        .map(Number);
      let upper;
      if (operator[1] === "~") upper = `${major}.${minor + 1}.0`;
      else if (major > 0) upper = `${major + 1}.0.0`;
      else if (minor > 0) upper = `0.${minor + 1}.0`;
      else upper = `0.0.${patch + 1}`;
      return { lower: operator[2], upper };
    }
    const bounds = value.match(
      /^>=(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?) <(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/,
    );
    if (
      bounds &&
      SEMVER.test(bounds[1]) &&
      SEMVER.test(bounds[2]) &&
      compareSemver(bounds[1], bounds[2]) < 0
    )
      return { lower: bounds[1], upper: bounds[2] };
    return null;
  }
  function satisfiesRange(version, range) {
    const parsed = dependencyRange(range);
    if (!parsed || !parseSemver(version)) return false;
    if (parsed.exact) return compareSemver(version, parsed.lower) === 0;
    return (
      compareSemver(version, parsed.lower) >= 0 &&
      compareSemver(version, parsed.upper) < 0
    );
  }

  function plainJson(value, path = "value", depth = 0) {
    if (depth > 32) fail(`${path} exceeds maximum JSON depth`);
    if (
      value === null ||
      typeof value === "string" ||
      typeof value === "boolean"
    )
      return;
    if (typeof value === "number") {
      if (!Number.isFinite(value)) fail(`${path} contains non-finite number`);
      return;
    }
    if (Array.isArray(value)) {
      if (value.length > 1000) fail(`${path} contains too many entries`);
      value.forEach((item, i) => plainJson(item, `${path}[${i}]`, depth + 1));
      return;
    }
    const prototype = value && Object.getPrototypeOf(value);
    if (
      !value ||
      Object.prototype.toString.call(value) !== "[object Object]" ||
      (prototype !== null && Object.getPrototypeOf(prototype) !== null)
    )
      fail(`${path} must be plain JSON`);
    for (const [key, item] of Object.entries(value)) {
      if (["__proto__", "constructor", "prototype"].includes(key))
        fail(`${path} has unsafe key`);
      plainJson(item, `${path}.${key}`, depth + 1);
    }
  }

  function localized(value, required, label) {
    if (!value || typeof value !== "object" || Array.isArray(value))
      fail(`${label} must be localized text`);
    const result = {};
    for (const [locale, text] of Object.entries(value)) {
      if (
        !/^[a-z]{2,3}(?:-[A-Z]{2})?$/.test(locale) ||
        typeof text !== "string" ||
        !text.trim() ||
        text.length > 200
      )
        fail(`${label} contains invalid locale text`);
      result[locale] = text.trim();
    }
    if (!result["zh-CN"] && !result.en) fail(`${label} requires zh-CN or en`);
    if (required && !Object.keys(result).length) fail(`${label} is required`);
    return result;
  }

  function safePackagePath(value, label) {
    if (
      typeof value !== "string" ||
      !value ||
      value.length > 200 ||
      value.includes("\\") ||
      value.includes("\0") ||
      value.startsWith("/") ||
      /^[a-z]+:/i.test(value)
    )
      fail(`${label} must be a package-relative JSON path`);
    const parts = value.split("/");
    if (parts.some((part) => !part || part === "." || part === ".."))
      fail(`${label} contains unsafe path segments`);
    if (!value.toLowerCase().endsWith(".json"))
      fail(`${label} must reference declarative JSON, not executable code`);
    return value;
  }

  function validateManifest(input, platform = "html") {
    plainJson(input, "manifest");
    if (bytes(input) > 65536) fail("manifest exceeds 64 KiB");
    if (!input || input.manifestVersion !== 1)
      fail("unsupported manifestVersion");
    for (const key of Object.keys(input))
      if (!MANIFEST_FIELDS.has(key)) fail(`unsupported manifest field: ${key}`);
    if (
      typeof input.id !== "string" ||
      input.id.length > 120 ||
      !ID.test(input.id)
    )
      fail("invalid reverse-domain plugin id");
    const name = localized(input.name, true, "name");
    const description = localized(
      input.description || { "zh-CN": "" },
      false,
      "description",
    );
    const version = input.version;
    if (typeof version !== "string" || !SEMVER.test(version))
      fail("invalid plugin version");
    const sdk = input.sdk;
    const sdkMatch =
      typeof sdk === "string" &&
      sdk.match(
        /^>=((?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)) <((?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*))$/,
      );
    if (!sdkMatch) fail("SDK range must use the supported >=x.y.z <x.y.z form");
    const parseVersion = (v) => v.split(".").map(Number);
    const current = [1, 0, 0];
    const compare = (a, b) => {
      for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] - b[i];
      return 0;
    };
    if (
      compare(current, parseVersion(sdkMatch[1])) < 0 ||
      compare(current, parseVersion(sdkMatch[2])) >= 0
    )
      fail("plugin SDK is incompatible");
    if (
      !input.author ||
      typeof input.author.name !== "string" ||
      !input.author.name.trim() ||
      input.author.name.length > 120
    )
      fail("author.name is required");
    if (
      !Array.isArray(input.types) ||
      !input.types.length ||
      input.types.some((v) => !TYPES.has(v)) ||
      new Set(input.types).size !== input.types.length
    )
      fail("invalid plugin types");
    if (
      !Array.isArray(input.subjects || []) ||
      (input.subjects || []).some((v) => !SUBJECTS.has(v))
    )
      fail("invalid subject list");
    if (
      !Array.isArray(input.platforms) ||
      !input.platforms.includes(platform) ||
      input.platforms.some((v) => !PLATFORMS.has(v))
    )
      fail("plugin does not support this platform");
    if (
      !input.entry ||
      typeof input.entry !== "object" ||
      Array.isArray(input.entry) ||
      !Object.keys(input.entry).length
    )
      fail("entry is required");
    for (const [kind, path] of Object.entries(input.entry)) {
      if (!["content", "theme", "views", "rules"].includes(kind))
        fail(`unsupported declarative entry: ${kind}`);
      safePackagePath(path, `entry.${kind}`);
    }
    if (!Array.isArray(input.permissions) || input.permissions.length > 64)
      fail("permissions must be an array");
    const seenPermissions = new Set();
    const permissions = input.permissions.map((grant) => {
      if (
        !grant ||
        !KNOWN_CAPABILITIES.has(grant.capability) ||
        typeof grant.required !== "boolean" ||
        seenPermissions.has(grant.capability)
      )
        fail("invalid or duplicate permission capability");
      seenPermissions.add(grant.capability);
      return { capability: grant.capability, required: grant.required };
    });
    for (const field of ["dependencies", "optionalDependencies"]) {
      if (input[field] !== undefined) {
        if (
          !input[field] ||
          typeof input[field] !== "object" ||
          Array.isArray(input[field])
        )
          fail(`${field} must be an object`);
        for (const [id, range] of Object.entries(input[field]))
          if (!ID.test(id) || id === input.id || !dependencyRange(range))
            fail(`${field} contains invalid dependency`);
      }
    }
    if (
      Object.keys(input.dependencies || {}).some((id) =>
        Object.hasOwn(input.optionalDependencies || {}, id),
      )
    )
      fail("dependency cannot be both required and optional");
    if (
      !Array.isArray(input.contributes || []) ||
      (input.contributes || []).length > 100
    )
      fail("contributes must be a bounded array");
    const contributes = clone(input.contributes || []);
    const localIds = new Set();
    for (const contribution of contributes) {
      if (
        !contribution ||
        !LOCAL_ID.test(contribution.localId || "") ||
        localIds.has(contribution.localId)
      )
        fail("invalid or duplicate contribution localId");
      localIds.add(contribution.localId);
      if (
        !Array.isArray(contribution.requiredPermissions || []) ||
        (contribution.requiredPermissions || []).some(
          (cap) => !KNOWN_CAPABILITIES.has(cap),
        )
      )
        fail("contribution requests unknown permission");
    }
    if (
      !input.data ||
      !Number.isSafeInteger(input.data.schemaVersion) ||
      input.data.schemaVersion < 1
    )
      fail("data.schemaVersion must be a positive integer");
    return Object.freeze({
      manifestVersion: 1,
      id: input.id,
      name,
      description,
      author: { name: input.author.name.trim() },
      version,
      sdk,
      types: [...input.types],
      subjects: [...(input.subjects || [])],
      platforms: [...input.platforms],
      entry: clone(input.entry),
      permissions,
      dependencies: clone(input.dependencies || {}),
      optionalDependencies: clone(input.optionalDependencies || {}),
      contributes,
      data: { schemaVersion: input.data.schemaVersion },
    });
  }

  function canonical(value) {
    if (Array.isArray(value)) return value.map(canonical);
    if (value && typeof value === "object")
      return Object.fromEntries(
        Object.keys(value)
          .sort()
          .map((key) => [key, canonical(value[key])]),
      );
    return value;
  }
  function scopeKey(scope) {
    plainJson(scope, "scope");
    if (!scope || typeof scope !== "object" || Array.isArray(scope))
      fail("host scope must be an object");
    return JSON.stringify(canonical(scope));
  }

  function createPluginPlatform(options = {}) {
    const registry = options.contributions;
    const repository = options.repository;
    const currentScope =
      options.currentScope || (() => ({ teacherId: "local" }));
    const platform = options.platform || "html";
    const isTrustedBuiltin = options.isTrustedBuiltin || (() => false);
    if (
      !registry ||
      !repository ||
      typeof repository.load !== "function" ||
      typeof repository.save !== "function"
    )
      fail("plugin registry and repository are required");
    const records = new Map();
    const capabilities = new WeakMap();
    const pending = new Map();
    if (repository.list) {
      for (const persisted of repository.list()) {
        if (persisted.state === "active" || persisted.state === "paused") {
          const recovered = {
            ...persisted,
            state: "installed",
            activationId: null,
            activeScopeKey: null,
          };
          repository.save(persisted.manifest.id, clone(recovered));
          records.set(persisted.manifest.id, recovered);
        }
      }
    }
    const read = (id) =>
      records.has(id)
        ? records.get(id)
        : (records.set(id, repository.load(id)), records.get(id));
    const save = (record) => {
      repository.save(record.manifest.id, clone(record));
      records.set(record.manifest.id, record);
    };
    const assertHandle = (handle) => {
      const capability = capabilities.get(handle);
      if (!capability || !capability.active)
        fail("plugin activation is inactive or stale");
      if (scopeKey(currentScope()) !== capability.scopeKey)
        fail("plugin activation scope is stale");
      return capability;
    };
    function install(input, config = {}) {
      const manifest = validateManifest(input, platform);
      if (
        manifest.id.startsWith("official.") &&
        (config.source !== "builtin" || !isTrustedBuiltin(manifest))
      )
        fail("unsigned package cannot claim an official plugin id");
      const prior = read(manifest.id);
      if (prior && prior.state !== "uninstalled")
        fail("plugin is already installed");
      const record = prior
        ? {
            ...prior,
            manifest: clone(manifest),
            state: "installed",
            activationId: null,
            grantsByScope: {},
          }
        : {
            manifest: clone(manifest),
            state: "installed",
            activationId: null,
            grantsByScope: {},
            privateData: {},
          };
      save(record);
      return publicRecord(record);
    }
    function publicRecord(record) {
      return Object.freeze({
        id: record.manifest.id,
        name: clone(record.manifest.name),
        version: record.manifest.version,
        state: record.state,
        types: [...record.manifest.types],
        grantedPermissions: Object.keys(
          record.grantsByScope[scopeKey(currentScope())] || {},
        ),
      });
    }
    function inspect(id) {
      const record = read(id);
      return record && record.state !== "uninstalled"
        ? Object.freeze({
            manifest: clone(record.manifest),
            state: record.state,
          })
        : null;
    }
    function get(id) {
      const record = read(id);
      return record && record.state !== "uninstalled"
        ? publicRecord(record)
        : null;
    }
    function list() {
      return repository.list
        ? repository
            .list()
            .filter((r) => r.state !== "uninstalled")
            .map(publicRecord)
        : [...records.values()]
            .filter((r) => r.state !== "uninstalled")
            .map(publicRecord);
    }
    function grantPermissions(id, requested) {
      const record = read(id);
      if (!record || record.state === "uninstalled")
        fail("plugin is not installed");
      if (record.state === "active" || record.state === "paused")
        fail("deactivate plugin before changing permissions");
      if (!Array.isArray(requested)) fail("permission grant must be an array");
      const declared = new Map(
        record.manifest.permissions.map((p) => [p.capability, p]),
      );
      const grants = {};
      for (const capability of requested) {
        if (!declared.has(capability))
          fail(`permission was not declared: ${capability}`);
        grants[capability] = true;
      }
      const missing = record.manifest.permissions.filter(
        (p) => p.required && !grants[p.capability],
      );
      if (missing.length)
        fail(
          `required permission not granted: ${missing.map((p) => p.capability).join(", ")}`,
        );
      const candidate = {
        ...record,
        grantsByScope: {
          ...record.grantsByScope,
          [scopeKey(currentScope())]: grants,
        },
      };
      save(candidate);
      return publicRecord(candidate);
    }
    function activate(id, scope = currentScope()) {
      const record = read(id);
      if (!record || record.state === "uninstalled")
        fail("plugin is not installed");
      if (record.state === "active") fail("plugin is already active");
      if (record.state === "quarantined")
        fail("quarantined plugin requires explicit restore");
      const key = scopeKey(scope);
      const grants = record.grantsByScope[key] || {};
      const missing = record.manifest.permissions.filter(
        (p) => p.required && !grants[p.capability],
      );
      if (missing.length)
        fail(
          `required permission not granted: ${missing.map((p) => p.capability).join(", ")}`,
        );
      for (const dependency of Object.keys(record.manifest.dependencies)) {
        const provider = read(dependency);
        const range = record.manifest.dependencies[dependency];
        if (!provider || provider.state === "uninstalled")
          fail(`required dependency is not installed: ${dependency}`);
        if (!satisfiesRange(provider.manifest.version, range))
          fail(
            `required dependency version mismatch: ${dependency} ${range} does not include ${provider.manifest.version}`,
          );
        if (provider.state !== "active" || provider.activeScopeKey !== key)
          fail(`required dependency is inactive in this scope: ${dependency}`);
      }
      const activation = registry.activate(record.manifest.id, {
        scope,
        permissions: Object.keys(grants),
      });
      let registration;
      try {
        if (record.manifest.contributes.length)
          registration = registry.register(
            record.manifest.contributes.map((contribution) => ({
              ...clone(contribution),
              requiredPermissions: [
                ...(contribution.requiredPermissions || []),
              ],
            })),
            activation,
          );
        const candidate = {
          ...record,
          state: "active",
          activationId: activation.activationId,
          activeScopeKey: key,
        };
        save(candidate);
        const handle = Object.freeze({
          pluginId: id,
          activationId: activation.activationId,
        });
        capabilities.set(handle, {
          pluginId: id,
          activationId: activation.activationId,
          scopeKey: key,
          grants,
          active: true,
        });
        pending.set(id, { activation, handle });
        return Object.freeze({
          ...publicRecord(candidate),
          registered: registration?.registeredIds || [],
          handle,
        });
      } catch (error) {
        registry.dispose(activation.activationId);
        throw error;
      }
    }
    function deactivate(id, nextState = "installed") {
      const record = read(id);
      if (
        !record ||
        !["active", "paused", "quarantined"].includes(record.state)
      )
        return false;
      const active = pending.get(id);
      if (active) {
        const capability = capabilities.get(active.handle);
        if (capability) capability.active = false;
      }
      registry.dispose(record.activationId);
      pending.delete(id);
      save({
        ...record,
        state: nextState,
        activationId: null,
        activeScopeKey: null,
      });
      return true;
    }
    function pause(id) {
      const record = read(id);
      if (record?.state !== "active") fail("plugin is not active");
      deactivate(id, "paused");
      return get(id);
    }
    function resume(id) {
      if (read(id)?.state !== "paused") fail("plugin is not paused");
      return activate(id);
    }
    function quarantine(id, reason = "runtime-error") {
      const record = read(id);
      if (!record || record.state === "uninstalled")
        fail("plugin is not installed");
      deactivate(id, "quarantined");
      if (record.state !== "quarantined")
        save({
          ...read(id),
          state: "quarantined",
          diagnostic: String(reason).slice(0, 160),
        });
      return get(id);
    }
    function restore(id) {
      const record = read(id);
      if (record?.state !== "quarantined") fail("plugin is not quarantined");
      save({ ...record, state: "installed", diagnostic: null });
      return get(id);
    }
    function reconcileScope(scope = currentScope()) {
      const key = scopeKey(scope);
      const stopped = [];
      for (const record of [...records.values()])
        if (record.state === "active" && record.activeScopeKey !== key) {
          deactivate(record.manifest.id);
          stopped.push(record.manifest.id);
        }
      return stopped;
    }
    function uninstall(id, config = {}) {
      const record = read(id);
      if (!record || record.state === "uninstalled") return false;
      if (["active", "paused"].includes(record.state))
        fail("deactivate plugin before uninstall");
      for (const other of [...records.values()])
        if (other.state !== "uninstalled" && other.manifest.dependencies[id])
          fail(`plugin is required by ${other.manifest.id}`);
      if (config.purgeData === true) {
        repository.delete?.(id);
        records.delete(id);
      } else
        save({
          ...record,
          state: "uninstalled",
          activationId: null,
          activeScopeKey: null,
        });
      return true;
    }
    function storage(handle) {
      const capability = assertHandle(handle);
      if (!capability.grants["plugin.storage"])
        fail("permission denied: plugin.storage");
      const privateKey = `${capability.pluginId}:${capability.scopeKey}`;
      const readData = () => {
        const record = read(capability.pluginId);
        return record.privateData[privateKey] || {};
      };
      return Object.freeze({
        get(key) {
          assertHandle(handle);
          if (!SAFE_KEY.test(key)) fail("invalid plugin storage key");
          const entry = readData()[key];
          return entry
            ? Object.freeze({
                value: clone(entry.value),
                revision: entry.revision,
              })
            : null;
        },
        set(key, value, expectedRevision = 0) {
          assertHandle(handle);
          if (!SAFE_KEY.test(key)) fail("invalid plugin storage key");
          plainJson(value, "plugin storage value");
          const record = read(capability.pluginId);
          const priorData = record.privateData[privateKey] || {};
          const prior = priorData[key];
          const revision = prior?.revision || 0;
          if (revision !== expectedRevision)
            fail("plugin storage revision conflict");
          const valueCopy = clone(value);
          const nextData = {
            ...priorData,
            [key]: { value: valueCopy, revision: revision + 1 },
          };
          if (bytes(nextData) > 10 * 1024 * 1024)
            fail("plugin scope storage exceeds 10 MiB quota");
          const candidate = {
            ...record,
            privateData: { ...record.privateData, [privateKey]: nextData },
          };
          save(candidate);
          return Object.freeze({ revision: revision + 1 });
        },
        remove(key, expectedRevision) {
          assertHandle(handle);
          if (!SAFE_KEY.test(key)) fail("invalid plugin storage key");
          const record = read(capability.pluginId);
          const data = record.privateData[privateKey] || {};
          const prior = data[key];
          if (!prior) return false;
          if (prior.revision !== expectedRevision)
            fail("plugin storage revision conflict");
          const nextData = { ...data };
          delete nextData[key];
          save({
            ...record,
            privateData: { ...record.privateData, [privateKey]: nextData },
          });
          return true;
        },
      });
    }
    return Object.freeze({
      install,
      get,
      list,
      inspect,
      grantPermissions,
      activate,
      deactivate,
      pause,
      resume,
      quarantine,
      restore,
      reconcileScope,
      uninstall,
      storage,
      contributions: registry,
      validateManifest: (value) => validateManifest(value, platform),
    });
  }
  root.GodPowerPluginPlatform = Object.freeze({
    createPluginPlatform,
    validateManifest: (manifest, platform) =>
      validateManifest(manifest, platform),
  });
})(globalThis);
