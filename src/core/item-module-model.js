/* Typed item blocks: pure policy, no DOM or classroom mutations. */
(function (root) {
  "use strict";
  const KEY = "godpower_item_modules_v1";
  const SCORE_KEYS = new Set([
    "green",
    "triple_green",
    "red",
    "triple_red",
    "spiny",
    "banana",
    "triple_banana",
    "horn",
    "bomb",
    "hammer",
    "coin",
    "coin_shell",
    "question",
    "mushroom",
    "triple_mushroom",
    "lightning",
    "fire_flower",
    "ice_flower",
    "boomerang_flower",
  ]);
  const copy = (value) => JSON.parse(JSON.stringify(value));
  function create(definitions, storage = null, notify = () => {}) {
    const keys = Object.keys(definitions);
    const defaults = () => ({
      schemaVersion: 1,
      items: Object.fromEntries(
        keys.map((key) => [
          key,
          {
            draw: {
              enabled: true,
              weight: 1,
              charges: definitions[key].charges || 1,
            },
            operation: { enabled: true, scoreMultiplier: 1, feedback: true },
          },
        ]),
      ),
    });
    function validate(raw) {
      if (
        !raw ||
        raw.schemaVersion !== 1 ||
        !raw.items ||
        typeof raw.items !== "object" ||
        Array.isArray(raw.items)
      )
        throw Error("道具配置版本或结构无效");
      if (
        Object.keys(raw).some((k) => !["schemaVersion", "items"].includes(k)) ||
        Object.keys(raw.items).some((k) => !keys.includes(k))
      )
        throw Error("配置包含未识别的道具或字段");
      const result = defaults();
      for (const key of keys) {
        const item = raw.items[key];
        if (
          !item ||
          Object.keys(item).some((k) => !["draw", "operation"].includes(k))
        )
          throw Error("缺少道具配置：" + key);
        const d = item.draw,
          o = item.operation;
        if (
          !d ||
          !o ||
          Object.keys(d).some(
            (k) => !["enabled", "weight", "charges"].includes(k),
          ) ||
          Object.keys(o).some(
            (k) => !["enabled", "scoreMultiplier", "feedback"].includes(k),
          )
        )
          throw Error("道具积木字段无效：" + key);
        if (
          typeof d.enabled !== "boolean" ||
          typeof o.enabled !== "boolean" ||
          typeof o.feedback !== "boolean"
        )
          throw Error("开关必须是布尔值：" + key);
        if (
          typeof d.weight !== "number" ||
          !Number.isFinite(d.weight) ||
          d.weight < 0 ||
          d.weight > 100
        )
          throw Error("权重倍率须为0–100：" + key);
        if (
          !Number.isInteger(d.charges) ||
          d.charges < 1 ||
          d.charges > 99 ||
          (["mega", "power", "boo"].includes(key) &&
            d.charges !== definitions[key].charges)
        )
          throw Error("新道具次数须为1–99：" + key);
        if (
          typeof o.scoreMultiplier !== "number" ||
          !Number.isFinite(o.scoreMultiplier) ||
          o.scoreMultiplier < 0 ||
          o.scoreMultiplier > 10 ||
          (!SCORE_KEYS.has(key) && o.scoreMultiplier !== 1)
        )
          throw Error("积分倍率不支持或超出0–10范围：" + key);
        result.items[key] = { draw: { ...d }, operation: { ...o } };
      }
      return result;
    }
    let config = defaults(),
      activeKey = null,
      loadError = null;
    if (storage)
      try {
        const text = storage.getItem(KEY);
        if (text !== null) config = validate(JSON.parse(text));
      } catch (e) {
        loadError = String(e.message || e);
      }
    const forKey = (key) => config.items[key];
    function update(raw) {
      const next = validate(raw);
      if (storage) storage.setItem(KEY, JSON.stringify(next));
      config = next;
      notify();
      return copy(config);
    }
    function scoreDelta(key, delta) {
      const factor = forKey(key || activeKey)?.operation.scoreMultiplier ?? 1;
      if (!Number.isFinite(delta)) throw Error("道具积分变化必须是有限数值");
      const next =
        factor === 1
          ? delta
          : Math.sign(delta) * Math.round(Math.abs(delta) * factor);
      if (!Number.isSafeInteger(next)) throw Error("道具积分变化超出安全整数");
      return next;
    }
    return {
      defaults,
      validate,
      update,
      configuration: () => copy(config),
      loadError,
      catalog: () =>
        keys.map((key) => ({
          key,
          name: definitions[key].name,
          kind: definitions[key].kind,
          blocks: {
            draw: [
              "availability",
              "weight",
              ...(["mega", "power", "boo"].includes(key) ? [] : ["charges"]),
            ],
            operation: [
              "availability",
              ...(SCORE_KEYS.has(key) ? ["score"] : []),
              "feedback",
            ],
          },
        })),
      drawWeights: (weights) =>
        Object.fromEntries(
          Object.entries(weights).map(([key, value]) => [
            key,
            forKey(key)?.draw.enabled
              ? Math.max(0, Number(value) || 0) * forKey(key).draw.weight
              : 0,
          ]),
        ),
      canUse: (key) => forKey(key)?.operation.enabled === true,
      feedback: (key) => forKey(key)?.operation.feedback !== false,
      charges: (key) =>
        forKey(key)?.draw.charges || definitions[key]?.charges || 1,
      inventory(key, acquiredAt = Date.now() + Math.random()) {
        if (!forKey(key)) throw Error("未识别的道具");
        const charges = forKey(key).draw.charges;
        return {
          key,
          charges,
          acquiredAt,
          ...(charges !== definitions[key].charges
            ? { configuredCharges: charges }
            : {}),
        };
      },
      scoreDelta,
      execute(key, operation) {
        if (!forKey(key)?.operation.enabled) return false;
        const prev = activeKey;
        activeKey = key;
        try {
          return operation();
        } finally {
          activeKey = prev;
        }
      },
    };
  }
  root.ItemModuleModel = { create, storageKey: KEY };
})(globalThis);
