function formatChartScoreV294(value) {
  const n = Number(value) || 0;
  const abs = Math.abs(n);
  // 条形图右侧最多显示 7 位整数；更大的数使用中文数量级，避免挤坏条形图。
  if (abs < 10000000) return String(Math.trunc(n));
  const sign = n < 0 ? "-" : "";
  const a = Math.abs(n);
  if (a >= 100000000) {
    const v = a / 100000000;
    return (
      sign +
      (v >= 100
        ? Math.round(v)
        : v.toFixed(v >= 10 ? 1 : 2).replace(/\.?0+$/, "")) +
      "亿"
    );
  }
  const v = a / 10000;
  return (
    sign +
    (v >= 100
      ? Math.round(v)
      : v.toFixed(v >= 10 ? 1 : 2).replace(/\.?0+$/, "")) +
    "万"
  );
}

/* ===== V2.9.9：持续状态道具重复使用 / 互斥 Toast =====
   持续型道具遵循“同一小组同一时间只能存在一种持续状态”。
   特别处理巨大蘑菇、炮弹刺客、强力蘑菇这类激活后仍留在道具槽中的道具：
   再次点击不会消耗、不会覆盖状态，只弹出阻止 Toast。
*/

/* ===== V2.11.3：羽毛 / 火之花 / 冰之花 / 回旋镖花统一最终处理器 =====
   旧版本这些道具由后追加 wrapper 接入，但随后又经历了多层 useItem 包装，
   导致功能与视觉演出存在断链。这里在最终 useItem 外再做一次权威分流。 */

/* ===== V2.11.6：攻击发动 / 受击视觉系统 + 闪电重制 ===== */

/* 旧 V2.5 的键名有一部分仍沿用早期别名，这里统一补上当前真实 ITEM_DEFS 键名。 */
Object.assign(CARD_ITEM_FX_CLASS, {
  green: "cfx-green",
  triple_green: "cfx-green",
  red: "cfx-red",
  triple_red: "cfx-red",
  spiny: "cfx-spiny",
  horn: "cfx-horn",
  bomb: "cfx-bomb",
  question: "cfx-rise",
  mega: "cfx-giant",
  bullet: "cfx-bullet",
  power: "cfx-power",
  feather: "cfx-feather",
  fire_flower: "cfx-fireflower",
  ice_flower: "cfx-iceflower",
  boomerang_flower: "cfx-boomerang",
});
Object.assign(CARD_HIT_COLOR, {
  green: "#22c55e",
  triple_green: "#22c55e",
  red: "#ef4444",
  triple_red: "#ef4444",
  spiny: "#2563eb",
  banana: "#eab308",
  triple_banana: "#eab308",
  horn: "#f97316",
  bomb: "#ea580c",
  hammer: "#64748b",
  lightning: "#facc15",
  fire_flower: "#f97316",
  ice_flower: "#38bdf8",
  boomerang_flower: "#3b82f6",
});

/* 每种攻击族拥有不同的“被命中”语言，不再全部只是换边框颜色。 */
