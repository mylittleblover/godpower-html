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

  const { cloneJson, deepFreeze } = DomainValues;

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
    isValidSource: (value) => SOURCES.has(value),
    createScope,
    isAchievementEligible,
  };
})();
