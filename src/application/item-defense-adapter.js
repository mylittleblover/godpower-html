const defenseCollectorStack = [];
function pushDefenseCollector(collector) {
  defenseCollectorStack.push(collector);
}
function popDefenseCollector() {
  defenseCollectorStack.pop();
}
function currentDefenseCollector() {
  return defenseCollectorStack[defenseCollectorStack.length - 1] || null;
}
function recordDefenseOutcome(collector, outcome) {
  if (!Array.isArray(collector) || !outcome?.defenderGroupUid) return;
  collector.push({ blocked: true, ...outcome });
}

/* Application adapter applies the pure defense decision, preserving legacy side effects. */
function tryDefend(g, attackType) {
  const kind = DefensePolicy.choose(g, attackType, {
    eligible: eligibleForItems(g),
    ignorePrimary: !!globalThis.RedirectedItemInstances?.has(g?.inventory?.[0]),
    shellAttack:
      g?.inventory?.[0]?.key === "bomb" &&
      SHELL_ATTACK_KEYS_V2170.has(attackType),
  });
  const main = g?.inventory?.[0];
  const collector = currentDefenseCollector();
  switch (kind) {
    case "timed-ghost": {
      tinyDefenseToast(
        `对方持有防御：害羞幽灵保护（剩余 ${g.booRoundsLeftV218} 次答题）`,
      );
      recordDefenseOutcome(collector, {
        defenderGroupUid: g.groupUid,
        defenderKey: "boo",
        attackerItemKey: attackType,
      });
      return true;
    }
    case "feather": {
      g.itemEffect.featherDodge = Math.max(
        0,
        Number(g.itemEffect.featherDodge || 0) - 1,
      );
      if (g.itemEffect.featherDodge <= 0) delete g.itemEffect.featherDodge;
      if (Object.keys(g.itemEffect).length === 0) g.itemEffect = null;
      tinyDefenseToast(`${g.name} 使用羽毛跃起，闪避了本次攻击`);
      recordDefenseOutcome(collector, {
        defenderGroupUid: g.groupUid,
        defenderKey: "feather",
        attackerItemKey: attackType,
      });
      return true;
    }
    case "bullet": {
      tinyDefenseToast(`${g.name} 的炮弹刺客处于绝对防御`);
      recordDefenseOutcome(collector, {
        defenderGroupUid: g.groupUid,
        defenderKey: "bullet",
        attackerItemKey: attackType,
      });
      return true;
    }
    case "persistent": {
      const type = g.itemEffect.type;
      tinyDefenseToast(`对方持有防御：${ITEM_DEFS[type]?.name || "持续状态"}`);
      /* 无敌与巨大化按答题轮次计时，抵挡攻击本身不再扣减次数：
         只要还在有效期内，每次攻击都会被挡下。 */
      recordDefenseOutcome(collector, {
        defenderGroupUid: g.groupUid,
        defenderKey: type,
        effectActivationId: g.itemEffect?.activationId || type,
        attackerItemKey: attackType,
      });
      return true;
    }
    case "ghost": {
      tinyDefenseToast(`对方持有防御：害羞幽灵保护`);
      g.booShield = Math.max(0, Number(g.booShield || 0) - 1);
      recordDefenseOutcome(collector, {
        defenderGroupUid: g.groupUid,
        defenderKey: "boo",
        attackerItemKey: attackType,
      });
      return true;
    }
    case "bomb": {
      g.inventory.splice(0, 1);
      tinyDefenseToast(
        `${g.name} 用炸弹兵挡住了${ITEM_DEFS[attackType]?.name || "龟壳"}`,
      );
      recordDefenseOutcome(collector, {
        defenderGroupUid: g.groupUid,
        defenderKey: "bomb",
        attackerItemKey: attackType,
      });
      explodeDestroyedBombV2170(g, null, "防御龟壳时");
      return true;
    }
    case "inventory": {
      const usedDefKey = main.key;
      tinyDefenseToast(
        `对方持有防御：${ITEM_DEFS[usedDefKey]?.name || "防御道具"}`,
      );
      consumeInventoryItem(g, 0, 1);
      recordDefenseOutcome(collector, {
        defenderGroupUid: g.groupUid,
        defenderKey: usedDefKey,
        attackerItemKey: attackType,
      });
      return true;
    }
    case "ineligible":
    case "pending-mushroom":
      return true;
    default:
      return false;
  }
}

// Weak ownership is transient: no tokens enter storage, backups or game rules.
const spinyDefenseRequests = new WeakMap();
function requestSpinyDefense(target, key, continueAttack) {
  const horn = key === "horn",
    flag = horn
      ? "__spinyHornDecisionPendingV218"
      : "__spinyDecisionPendingV21727";
  const declined = horn
    ? "__spinyHornDeclinedV218"
    : "__spinyMushroomDeclinedV21727";
  let requests = spinyDefenseRequests.get(target);
  if (!requests) {
    requests = new Map();
    spinyDefenseRequests.set(target, requests);
  }
  const requestToken = {};
  requests.set(flag, requestToken);
  target[flag] = true;
  const decision = Reliability.captureDefenseDecision(state, target, key);
  const collector = currentDefenseCollector();
  const name = ITEM_DEFS[key]?.name || "冲刺蘑菇";
  const prompt = themeConfirm(
    `${target.name} 遭遇刺刺龟壳！\n是否主动消耗主要道具 ${name} 抵消本次攻击？`,
    {
      title: "刺刺龟壳来袭",
      confirmText: horn ? "使用超级喇叭" : "使用冲刺蘑菇闪避",
      cancelText: "承受攻击",
    },
  );
  const clear = () => {
    // A superseded promise may settle after another request for the same group.
    // Only the current request owns that flag; clearing an older token is a no-op.
    if (requests.get(flag) !== requestToken) return;
    requests.delete(flag);
    target[flag] = false;
    if (!requests.size) spinyDefenseRequests.delete(target);
  };
  deferClassroomDefense(
    prompt,
    (useIt) => {
      clear();
      if (useIt) {
        consumeInventoryItem(target, 0, 1);
        recordDefenseOutcome(collector, {
          defenderGroupUid: target.groupUid,
          defenderKey: horn ? "horn" : "mushroom",
          attackerItemKey: "spiny",
        });
        tinyDefenseToast(
          horn
            ? `${target.name} 使用超级喇叭成功击碎刺刺龟壳`
            : `${target.name} 使用主要道具冲刺蘑菇成功闪避刺刺龟壳`,
        );
        return;
      }
      target[declined] = true;
      try {
        continueAttack();
      } finally {
        delete target[declined];
      }
    },
    () => Reliability.isDefenseDecisionCurrent(state, decision),
  );
  Promise.resolve(prompt).then(clear, clear);
  return {
    changed: false,
    blocked: horn ? "pending-horn-defense" : "pending-defense",
  };
}
