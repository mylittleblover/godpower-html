/* ===== V2.17.3：基础防御限制前50% + 中游蘑菇/三重防御增权 ===== */

itemDropWeights = function (pos, total) {
  const safeTotal = Math.max(1, Number(total) || 1);
  const safePos = Math.max(1, Math.min(safeTotal, Number(pos) || 1));
  const band = itemRankBandV2172(safePos, safeTotal);

  /* “前50%”按实际名次计算。
     例如 16 组 = 第1~8名，8组 = 第1~4名。 */
  const topHalfEnd = Math.ceil(safeTotal * 0.5);
  const inTopHalf = safePos <= topHalfEnd;

  const W = {};
  const put = (k, w) => {
    W[k] = Math.max(0, Number(w) || 0);
  };
  ITEM_KEYS.forEach((k) => put(k, 0));

  if (band === "front") {
    /* 前三名：继续以基础防御、低收益和轻量资源为主。 */
    put("coin", 18);
    put("feather", 8);
    put("question", 10);

    put("green", 13);
    put("banana", 13);
    put("red", safePos >= 2 ? 7 : 3);
    put("horn", 6);
    put("mushroom", 9);
    put("coin_shell", 6);

    /* 三重防御仍低于单个基础防御，但略高于上一版。 */
    put("triple_green", 3);
    put("triple_banana", 3);
    put("triple_red", 2);
    put("triple_mushroom", 2);
  } else if (band === "mid") {
    /*
      中游：
      - 蘑菇显著增权；
      - 三重红/绿龟壳、三重香蕉明显增权；
      - 单个红/绿龟壳、香蕉只允许出现在整个排名的前50%。
    */
    if (inTopHalf) {
      put("green", 8);
      put("banana", 8);
      put("red", 11);
    }

    put("horn", 9);
    put("bomb", 10);
    put("hammer", 8);

    /* 蘑菇从上一版 10 提高到 16。 */
    put("mushroom", 16);

    put("boo", 7);
    put("blooper", 7);
    put("coin_shell", 6);
    put("power", 6);

    put("fire_flower", 11);
    put("ice_flower", 9);
    put("boomerang_flower", 10);

    const midProgress = safeTotal <= 1 ? 0 : (safePos - 1) / (safeTotal - 1);
    put("spiny", midProgress >= 0.45 ? 5 : 2);

    /* 三重基础防御显著提高。
       仍低于对应单体峰值，避免中游重新变成三重道具海。 */
    put("triple_green", 6);
    put("triple_red", 7);
    put("triple_banana", 6);

    /* 三重蘑菇也适度提高，增强中游追赶能力。 */
    put("triple_mushroom", 5);
  } else {
    /* 后30%：强追赶道具，不再出现单个红/绿龟壳和香蕉。 */
    put("mushroom", 12);
    put("boo", 9);
    put("blooper", 8);
    put("spiny", 9);
    put("lightning", 11);
    put("star", 11);
    put("mega", 10);
    put("bullet", 13);
    put("power", 12);
    put("horn", 5);

    /* 单个基础防御严格限制在前50%，后排全部为 0。 */

    /* 后排三重基础防御仍保持低概率，避免追赶池被防御道具挤占。 */
    put("triple_green", 1);
    put("triple_red", 1);
    put("triple_banana", 1);
    put("triple_mushroom", 4);
  }

  /* 前三名专属。 */
  if (band !== "front") {
    W.coin = 0;
    W.feather = 0;
    W.question = 0;
  }

  /* 后30%专属。 */
  if (band !== "rear") {
    W.star = 0;
    W.bullet = 0;
    W.mega = 0;
    W.lightning = 0;
  }

  /* 常规主动攻击主要限制在中游。 */
  if (band !== "mid") {
    W.fire_flower = 0;
    W.ice_flower = 0;
    W.boomerang_flower = 0;
    W.bomb = 0;
    W.hammer = 0;
  }

  /* 新规则：单个红/绿龟壳、香蕉绝不出现在后50%。 */
  if (!inTopHalf) {
    W.green = 0;
    W.red = 0;
    W.banana = 0;
  }

  /* 场上唯一性继续保留。 */
  if (itemExistsOnFieldV2172("blooper")) W.blooper = 0;
  if (itemExistsOnFieldV2172("lightning")) W.lightning = 0;

  return W;
};
