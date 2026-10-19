/* Integer score plans only; manual changes never imply answer/item achievement facts. */
const ScoreAdjustments = (() => {
  function set(group, after) {
    const before = group.score;
    if (!Number.isSafeInteger(before) || !Number.isSafeInteger(after))
      throw new Error("积分必须保持在安全整数范围内");
    return {
      groupId: group.id,
      before,
      after,
      delta: after - before,
      milestone:
        Math.floor(Math.abs(after)).toString().length >
          Math.floor(Math.abs(before)).toString().length && after > before,
    };
  }
  function delta(group, points) {
    if (!Number.isSafeInteger(points))
      throw new Error("积分必须保持在安全整数范围内");
    return set(group, group.score + points);
  }
  return { set, delta };
})();
