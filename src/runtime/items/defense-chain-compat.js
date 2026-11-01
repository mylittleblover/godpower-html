/* ===== V2.17.0：基础防御道具破坏 / 炸弹连锁 / 百科重构 ===== */

const BASIC_DEFENSE_KEYS_V2170 = new Set([
  "green",
  "triple_green",
  "red",
  "triple_red",
  "banana",
  "triple_banana",
  "bomb",
]);
const SHELL_ATTACK_KEYS_V2170 = new Set([
  "green",
  "triple_green",
  "red",
  "triple_red",
]);

/* 同步百科说明。 */
Object.assign(ITEM_DEFS, {
  green: {
    ...ITEM_DEFS.green,
    desc: "随机攻击其他小组 -1/4；作为主要道具可抵挡常规攻击。遭刺龟壳或回旋镖破坏时会直接消失。",
  },
  triple_green: {
    ...ITEM_DEFS.triple_green,
    desc: "3 次绿龟壳攻击/防御，每次 -1/4；作为主要道具时可逐次防御，遭刺龟壳或回旋镖破坏时直接失去整组。",
  },
  red: {
    ...ITEM_DEFS.red,
    desc: "攻击排名正上方一组 -1/3；作为主要道具可抵挡常规攻击。遭刺龟壳或回旋镖破坏时会直接消失。",
  },
  triple_red: {
    ...ITEM_DEFS.triple_red,
    desc: "3 次红龟壳攻击/防御；作为主要道具时可逐次防御，遭刺龟壳或回旋镖破坏时直接失去整组。",
  },
  banana: {
    ...ITEM_DEFS.banana,
    desc: "攻击排名正下方一组 -1/4；作为主要道具可抵挡常规攻击。遭刺龟壳或回旋镖破坏时会直接消失。",
  },
  triple_banana: {
    ...ITEM_DEFS.triple_banana,
    desc: "3 次向后攻击/常规防御；遭刺龟壳或回旋镖破坏时直接失去整组。",
  },
  bomb: {
    ...ITEM_DEFS.bomb,
    desc: "随机目标及其实际排名相邻组各 -1/4。作为主要道具时可抵挡红/绿龟壳；无论用于防御还是被特殊效果摧毁，都会立刻爆炸并攻击自身排名相邻组，自身不受爆炸影响。",
  },
  spiny: {
    ...ITEM_DEFS.spiny,
    desc: "攻击当前第一名 -1/2。命中前会直接摧毁第一名主要栏中的红/绿龟壳、香蕉皮或炸弹兵；若摧毁炸弹兵会触发爆炸。持续状态、害羞幽灵、超级喇叭或蘑菇闪避仍可继续化解本体攻击。",
  },
  star: {
    ...ITEM_DEFS.star,
    desc: "使用后立即释放主要道具栏，无敌状态持续 3 轮答题，期间抵挡全部攻击。无敌状态下超越上方小组时，对方 -1/4，并直接摧毁其主要栏中的基础防御道具；炸弹兵被摧毁时会爆炸。",
  },
  mega: {
    ...ITEM_DEFS.mega,
    desc: "占据主要道具栏，巨大化持续 3 轮答题，期间抵挡全部攻击。巨大状态下超越上方小组时，对方 -1/4，并直接摧毁其主要栏中的基础防御道具；炸弹兵被摧毁时会爆炸。",
  },
  boomerang_flower: {
    ...ITEM_DEFS.boomerang_flower,
    desc: "3 次回旋镖。每次攻击当前排名紧邻自己的上一组和下一组，各扣当前积分 1/8；命中前会直接摧毁目标主要栏中的基础防御道具，炸弹兵被摧毁时会爆炸。",
  },
});

/* 炸弹被摧毁时，按当前真实排名炸到持有者的上下相邻组；不伤持有者自己。 */
function explodeDestroyedBombV2170(
  holder,
  sourceId = null,
  reason = "炸弹兵被摧毁",
) {
  if (!holder) return [];
  const r = ranking();
  const i = r.findIndex((x) => x.id === holder.id);
  if (i < 0) return [];
  const targets = [r[i - 1], r[i + 1]].filter(
    (t) => t && t.id !== holder.id && eligibleForItems(t),
  );
  if (!targets.length) {
    tinyDefenseToast(`${holder.name} 的炸弹兵爆炸，但附近没有可波及的小组`);
    return [];
  }

  tinyDefenseToast(`${holder.name} 的炸弹兵被摧毁并爆炸`);
  targets.forEach((t, n) => {
    const loss = roundQuarter(t.score);
    if (loss > 0) applyItemScore(t, -loss, sourceId ?? holder.id, "bomb");
    try {
      setTimeout(() => flashBomb(t.id), 40 + n * 80);
    } catch (e) {}
  });
  return targets;
}

/* 直接摧毁“当前主要栏”的基础防御道具。三重道具也是整组摧毁，不只扣 1 次耐久。 */
function destroyPrimaryBasicDefenseV2170(
  target,
  sourceId = null,
  reason = "特殊攻击",
) {
  const main = target?.inventory?.[0];
  if (!main || !BASIC_DEFENSE_KEYS_V2170.has(main.key)) return null;

  const destroyedKey = main.key;
  target.inventory.splice(0, 1);
  const name = ITEM_DEFS[destroyedKey]?.name || "基础防御道具";
  tinyDefenseToast(`${target.name} 的主要道具「${name}」被${reason}摧毁`);

  if (destroyedKey === "bomb") {
    explodeDestroyedBombV2170(target, sourceId, reason);
  }
  return destroyedKey;
}

/* 炸弹兵加入主要道具被动防御：
   - 只挡红 / 绿龟壳；
   - 防御时炸弹本身被消耗并立刻爆炸；
   - 不挡刺龟壳，因为刺龟壳会先直接摧毁它。 */
try {
  ITEM_DEFENSE_KEYS.add("bomb");
} catch (e) {}

/* 刺龟壳 / 回旋镖：在真正进行伤害判定之前，先摧毁目标当前主要基础防御。
   随后才继续走原防御系统，因此星星、巨大蘑菇、害羞幽灵、喇叭等仍有效。 */

/* 星星 / 巨大蘑菇超越：
   保留原 -1/4 压制，并在结算前直接摧毁被超组当前主要基础防御。
   如果摧毁炸弹，爆炸可能反过来波及附近小组，包括超车者。 */
detectOvertakePunish = function (actorId, beforeOrder) {
  const actor = state.groups.find((g) => g.id === actorId);
  if (
    !actor ||
    !actor.itemEffect ||
    !["star", "mega"].includes(actor.itemEffect.type)
  )
    return;

  const after = ranking().map((g) => g.id);
  const beforeIdx = beforeOrder.indexOf(actorId),
    afterIdx = after.indexOf(actorId);
  if (afterIdx < 0 || beforeIdx < 0 || afterIdx >= beforeIdx) return;

  const passed = beforeOrder
    .slice(afterIdx, beforeIdx)
    .filter((id) => id !== actorId);
  passed.forEach((id) => {
    const t = state.groups.find((g) => g.id === id);
    if (!t || !eligibleForItems(t)) return;

    destroyPrimaryBasicDefenseV2170(
      t,
      actorId,
      actor.itemEffect.type === "star" ? "无敌星超车" : "巨大蘑菇超车",
    );

    /* 继续保留旧版超车 -1/4 压制。 */
    if (!tryDefend(t, "normal")) {
      t.score -= roundQuarter(t.score);
      t.displayScore = t.score;
    }
  });
};

/* 队列规则：无敌星不再属于“卡手持续道具”；巨大蘑菇与强力蘑菇保持原样。 */
isQueuePersistentActiveV2120 = function (g, it = null) {
  const main = it || g?.inventory?.[0];
  if (!g?.itemEffect?.type || !main) return false;
  return (
    ["mega", "power"].includes(g.itemEffect.type) &&
    main.key === g.itemEffect.type
  );
};

/* 闪电消耗星星次数时不再尝试从背包删除星星。 */
tryDefendLightningV2116 = function (target) {
  if (Number(target?.booShield || 0) > 0) {
    target.booShield = Math.max(0, Number(target.booShield || 0) - 1);
    tinyDefenseToast(`${target.name} 的害羞幽灵保护阻挡了闪电`);
    setTimeout(
      () => playAttackTargetFxV2116(target.id, "lightning", true),
      120,
    );
    return true;
  }

  const type = target?.itemEffect?.type;
  if (!["star", "mega"].includes(type)) return false;

  const name = ITEM_DEFS[type]?.name || "持续状态";
  // 防御按答题轮次计时，挡下闪电不消耗轮次。
  tinyDefenseToast(`${target.name} 的${name}阻挡了闪电`);
  setTimeout(() => playAttackTargetFxV2116(target.id, "lightning", true), 120);
  return true;
};

/* 百科重新接管为固定左图 + 右文。 */
const _v2170RenderAboutFallback = renderAbout;
renderAbout = function (tab) {
  document
    .querySelectorAll("[data-about]")
    .forEach((b) => b.classList.toggle("active", b.dataset.about === tab));
  const m = document.getElementById("aboutMain");
  if (!m) return;

  if (tab !== "items") {
    return _v2170RenderAboutFallback.call(this, tab);
  }

  m.innerHTML = `<div class="v2170-ency-head">
      <div>
        <h2>28 种道具百科</h2>
        <div class="v2170-ency-sub">图标固定尺寸展示，下方直接说明实际效果。</div>
      </div>
      <button class="btn btn-sm" onclick="closeAbout()">关闭</button>
    </div>
    <div class="v2170-ency-list">
      ${ITEM_KEYS.map((k) => {
        const d = ITEM_DEFS[k];
        return `<div class="v2170-ency-row">
          <div class="v2170-ency-icon">${itemVisual(k, "v2170-ency-img")}</div>
          <div class="v2170-ency-copy">
            <div class="v2170-ency-name">${escapeHtml(d.name)}</div>
            <div class="v2170-ency-desc">${escapeHtml(d.desc || "")}</div>
          </div>
        </div>`;
      }).join("")}
    </div>`;
};

/* 已打开百科时即时刷新一次。 */
try {
  if (
    document.getElementById("aboutBackdrop")?.classList.contains("active") &&
    document.querySelector('[data-about="items"]')?.classList.contains("active")
  ) {
    renderAbout("items");
  }
} catch (e) {}
