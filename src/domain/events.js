/* Immutable domain-event envelopes shared by browser commands and future consumers. */
const DomainEvents = (() => {
  const SCHEMA_VERSION = 1;
  const SOURCES = new Set(["classroom", "manual", "import", "system", "test"]);
  const TYPES = new Set([
    "ROUND_SETTLED",
    "ITEM_ACQUIRED",
    "ITEM_USED",
    "ITEM_HIT",
    "DEFENSE_RESOLVED",
    "EFFECT_APPLIED",
    "EFFECT_EXPIRED",
    "RANK_CHANGED",
    "SEASON_ARCHIVED",
    "SCORE_CHANGED",
  ]);
  const MAX_PAYLOAD_BYTES = 64 * 1024;

  function requiredText(value, label, max = 160) {
    if (typeof value !== "string" || !value.trim() || value.length > max)
      throw new TypeError(`${label} must be a non-empty string`);
    return value.trim();
  }

  function cloneJson(value, seen = new Set(), depth = 0) {
    if (depth > 24)
      throw new TypeError("event payload exceeds JSON depth limit");
    if (
      value === null ||
      typeof value === "string" ||
      typeof value === "boolean"
    )
      return value;
    if (typeof value === "number") {
      if (!Number.isFinite(value))
        throw new TypeError("event payload must contain finite JSON numbers");
      return value;
    }
    if (!value || typeof value !== "object" || seen.has(value))
      throw new TypeError("event payload must contain JSON values only");
    if (!Array.isArray(value)) {
      const prototype = Object.getPrototypeOf(value);
      if (prototype !== null && Object.getPrototypeOf(prototype) !== null)
        throw new TypeError("event payload must contain plain JSON objects");
    }
    seen.add(value);
    let output;
    if (Array.isArray(value)) {
      if (value.length > 2000)
        throw new TypeError("event payload array is too large");
      output = value.map((entry) => cloneJson(entry, seen, depth + 1));
    } else {
      output = {};
      for (const key of Object.keys(value)) {
        if (["__proto__", "prototype", "constructor"].includes(key))
          throw new TypeError("event payload contains a reserved key");
        const descriptor = Object.getOwnPropertyDescriptor(value, key);
        if (!descriptor || !Object.hasOwn(descriptor, "value"))
          throw new TypeError(
            "event payload cannot contain accessor properties",
          );
        output[key] = cloneJson(descriptor.value, seen, depth + 1);
      }
    }
    seen.delete(value);
    return output;
  }

  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value))
      return value;
    for (const child of Object.values(value)) deepFreeze(child);
    return Object.freeze(value);
  }

  function normalizeTime(value) {
    const date = value instanceof Date ? value : new Date(value);
    if (!Number.isFinite(date.getTime()))
      throw new TypeError("event occurredAt must be a valid date");
    return date.toISOString();
  }

  function createScope({
    commandId,
    actorId = null,
    source = "classroom",
    now = () => new Date(),
  } = {}) {
    const id = requiredText(commandId, "commandId");
    if (!SOURCES.has(source))
      throw new TypeError("unsupported domain event source");
    if (actorId !== null) actorId = requiredText(actorId, "actorId");
    if (typeof now !== "function")
      throw new TypeError("event clock must be a function");
    let sequence = 0;
    let closed = false;
    const records = [];

    function emit(type, aggregate, payload = {}, options = {}) {
      if (closed) throw new Error("domain event scope is closed");
      if (!TYPES.has(type))
        throw new TypeError(`unsupported domain event: ${type}`);
      if (!aggregate || typeof aggregate !== "object")
        throw new TypeError("event aggregate is required");
      const aggregateType = requiredText(aggregate.type, "aggregate.type", 64);
      const aggregateId = requiredText(
        String(aggregate.id ?? ""),
        "aggregate.id",
      );
      const safePayload = cloneJson(payload);
      if (
        !safePayload ||
        Array.isArray(safePayload) ||
        typeof safePayload !== "object"
      )
        throw new TypeError("event payload must be a JSON object");
      const serialized = JSON.stringify(safePayload);
      const utf8Bytes = encodeURIComponent(serialized).replace(
        /%[0-9A-F]{2}/gi,
        "x",
      ).length;
      if (utf8Bytes > MAX_PAYLOAD_BYTES)
        throw new TypeError("event payload exceeds 64 KiB");
      const nextSequence = sequence + 1;
      const event = deepFreeze({
        schemaVersion: SCHEMA_VERSION,
        eventId: `${id}:${nextSequence}`,
        commandId: id,
        sequence: nextSequence,
        type,
        occurredAt: normalizeTime(options.occurredAt ?? now()),
        source,
        actorId,
        causationId:
          options.causationId == null
            ? null
            : requiredText(options.causationId, "causationId"),
        aggregate: { type: aggregateType, id: aggregateId },
        payload: safePayload,
      });
      sequence = nextSequence;
      records.push(event);
      return event;
    }

    return {
      emit,
      list: () => records.slice(),
      close: () => {
        closed = true;
      },
      isClosed: () => closed,
    };
  }

  function isAchievementEligible(event) {
    return (
      !!event &&
      event.schemaVersion === SCHEMA_VERSION &&
      event.source === "classroom" &&
      TYPES.has(event.type) &&
      event.type !== "SCORE_CHANGED"
    );
  }

  return {
    schemaVersion: SCHEMA_VERSION,
    types: [...TYPES],
    createScope,
    isAchievementEligible,
  };
})();
