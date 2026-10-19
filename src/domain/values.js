/* Shared JSON value boundary for domain events and application commands. */
const DomainValues = (() => {
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
      for (const key of Object.keys(value).sort()) {
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

  return { cloneJson, deepFreeze };
})();
