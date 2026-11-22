const TRIPLE_KEYS_V218 = new Set([
  "triple_green",
  "triple_red",
  "triple_banana",
  "triple_mushroom",
]);

/* 主道具状态统一由queue-adapters与ItemRoundUse计算。 */
/* 幽灵 3 题内无限防御，不因攻击消耗。 */

/* 超级喇叭防刺刺龟壳改为确认弹窗，机制参考冲刺蘑菇。 */

/* ---------- 5. 答题次数型状态 ---------- */
/* Answered-round expiry is owned by items/round-effects.js. */

/* 冰冻被主动使用触发时：立即解除，并继续沿用“本次使用被取消”的既有规则。 */

/* ---------- 6. 道具抽取：由 MKWorld Product.180 ItemDrawPolicy 统一接管 ---------- */
