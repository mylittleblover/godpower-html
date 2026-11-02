/* Floating hand controls operate the main classroom; no renderer-owned scores.
   The host owns classroom state, transactions and persistence; this port only
   validates the hand session token and orders one atomic command per gesture. */
globalThis.HandRaisePort = (() => {
  "use strict";
  function create(host) {
    let session = null,
      running = false;
    function current() {
      let state;
      try {
        state = host.getState();
      } catch {
        session = null;
        return null;
      }
      const group = state.groups.find((g) => g.id === session?.groupId);
      if (
        !session ||
        session.owner !== state ||
        session.season !== state.seasonId ||
        !group ||
        (session.groupUid && group.groupUid !== session.groupUid)
      ) {
        session = null;
        return null;
      }
      return group;
    }
    function busy() {
      return running || !!host.busy();
    }
    function getSnapshot() {
      const state = host.getState();
      const group = current();
      const isBusy = busy();
      const locked = !!state.isLocked;
      const inventoryCount = group?.inventory?.length || 0;
      const answerCorrect = session?.correct === true;
      const mainItem = group?.inventory?.[0] || null;
      return {
        selectionId: session?.id || null,
        groupId: group?.id ?? null,
        groupName: group?.name || "",
        correct: session?.correct ?? null,
        itemRewarded: !!session?.itemRewarded,
        busy: isBusy,
        locked,
        inventoryCount,
        canUse: !!(
          mainItem &&
          answerCorrect &&
          !isBusy &&
          !locked &&
          host.enabled() &&
          host.eligible(group)
        ),
        mainItemName: mainItem?.key
          ? host.itemName?.(mainItem.key) || mainItem.key
          : "",
        canDraw: !!(
          group &&
          answerCorrect &&
          !session.itemRewarded &&
          !isBusy &&
          !locked &&
          host.enabled() &&
          host.eligible(group) &&
          inventoryCount < 3
        ),
        canScore: !!(group && answerCorrect && !isBusy && !locked),
        itemName: session?.itemName || "",
      };
    }
    async function command(action, payload = {}) {
      if (busy()) return { ok: false, error: "BUSY" };
      const state = host.getState();
      if (action === "handSelect") {
        if (!Number.isSafeInteger(payload.groupId))
          return { ok: false, error: "INVALID_GROUP" };
        const group = state.groups.find((g) => g.id === payload.groupId);
        if (!group) return { ok: false, error: "INVALID_GROUP" };
        session = {
          owner: state,
          season: state.seasonId,
          groupId: group.id,
          groupUid: group.groupUid,
          id: host.id(),
          correct: null,
          itemRewarded: false,
          itemName: "",
        };
        return {
          ok: true,
          session: { selectionId: session.id, groupId: group.id },
        };
      }
      /* The dock already performed the raise. Adopting its session keeps the
         floating menu usable without recording a second history entry. */
      if (action === "handAdopt") {
        if (!Number.isSafeInteger(payload.groupId))
          return { ok: false, error: "INVALID_GROUP" };
        const group = state.groups.find((g) => g.id === payload.groupId);
        if (!group) return { ok: false, error: "INVALID_GROUP" };
        session = {
          owner: state,
          season: state.seasonId,
          groupId: group.id,
          groupUid: group.groupUid,
          id:
            typeof payload.selectionId === "string"
              ? payload.selectionId
              : host.id(),
          correct:
            payload.correct === true
              ? true
              : payload.correct === false
                ? false
                : null,
          itemRewarded: false,
          itemName: "",
        };
        return {
          ok: true,
          session: { selectionId: session.id, groupId: group.id },
        };
      }
      const group = current();
      const expected = session;
      if (!group || payload.groupId !== group.id)
        return { ok: false, error: "STALE_HAND_SESSION" };
      if (action !== "handSelect" && payload.selectionId !== session.id)
        return { ok: false, error: "STALE_HAND_SESSION" };
      if (state.isLocked) return { ok: false, error: "LOCKED" };
      if (action === "handJudge") {
        if (typeof payload.correct !== "boolean")
          return { ok: false, error: "INVALID_VALUE" };
        if (session.correct !== null)
          return { ok: false, error: "ALREADY_JUDGED" };
      } else if (
        action === "handScore" ||
        action === "handDraw" ||
        action === "handUse"
      ) {
        if (session.correct !== true)
          return { ok: false, error: "ANSWER_NOT_CORRECT" };
        if (
          action === "handScore" &&
          (!Number.isSafeInteger(payload.delta) || !payload.delta)
        )
          return { ok: false, error: "INVALID_SCORE" };
        if (action === "handDraw" && !getSnapshot().canDraw)
          return {
            ok: false,
            error: session.itemRewarded ? "REWARD_ALREADY_GIVEN" : "NO_DRAW",
          };
        if (action === "handUse") {
          if (!group.inventory?.length) return { ok: false, error: "NO_ITEM" };
          if (!host.enabled() || !host.eligible(group))
            return { ok: false, error: "NO_ITEM" };
        }
      } else return { ok: false, error: "UNKNOWN_COMMAND" };
      let plan,
        itemName = "",
        runtime;
      try {
        if (action === "handScore") plan = host.planScore(group, payload.delta);
      } catch {
        return { ok: false, error: "INVALID_SCORE" };
      }
      // Using an item is its own classroom transaction on the host side, so it
      // must not be nested inside a second one here.
      if (action === "handUse") {
        if (!group.inventory?.length) return { ok: false, error: "NO_ITEM" };
        running = true;
        try {
          const used = host.use(group);
          if (!used)
            return { ok: false, persisted: false, error: "ITEM_NOT_USED" };
          const result = await host.whenIdle();
          if (!result?.ok || result.persisted !== true)
            return { ok: false, persisted: false, error: "SAVE_FAILED" };
          try {
            host.feedback?.(action, group, null, null, used);
          } catch {}
          return { ok: true, persisted: true, used: used.name || "" };
        } finally {
          running = false;
        }
      }
      if (action === "handDraw") runtime = host.captureRuntime?.();
      running = true;
      try {
        let drawn = null;
        const accepted = host.run(
          `${group.name} 悬浮举手：${
            action === "handJudge"
              ? payload.correct
                ? "回答正确"
                : "回答错误"
              : action === "handScore"
                ? "积分奖励"
                : "道具奖励"
          }`,
          (context) => {
            if (action === "handJudge") {
              group.itemStats ||= { correct: 0, wrong: 0, draws: 0, used: 0 };
              const key = payload.correct ? "correct" : "wrong";
              group.itemStats[key] = (Number(group.itemStats[key]) || 0) + 1;
              state.itemGlobal.handRaiseTotal =
                (Number(state.itemGlobal.handRaiseTotal) || 0) + 1;
              state.itemGlobal.handRaiseHistory ||= [];
              state.itemGlobal.handRaiseHistory.push({
                time: Date.now(),
                groupId: group.id,
                correct: payload.correct,
              });
              return true;
            }
            if (action === "handScore") {
              group.score = plan.after;
              group.displayScore = group.score;
              return true;
            }
            drawn = host.draw(group, context);
            if (!drawn) return false;
            itemName = drawn.name || "";
            return true;
          },
          { retainOnPersistenceFailure: false, source: "manual" },
        );
        if (!accepted) {
          if (action === "handDraw") host.restoreRuntime?.(runtime);
          return { ok: false, persisted: false, error: "COMMAND_REJECTED" };
        }
        const result = await host.whenIdle();
        if (!result?.ok || result.persisted !== true) {
          if (action === "handDraw") host.restoreRuntime?.(runtime);
          return {
            ok: false,
            persisted: false,
            error: action === "handDraw" && !drawn ? "NO_DRAW" : "SAVE_FAILED",
          };
        }
        if (session === expected && current()) {
          if (action === "handJudge") session.correct = payload.correct;
          if (action === "handDraw") {
            session.itemRewarded = true;
            session.itemName = itemName;
          }
        }
        try {
          host.feedback?.(action, group, plan, drawn);
        } catch {}
        return {
          ok: true,
          persisted: true,
          ...(drawn ? { itemName } : {}),
        };
      } finally {
        running = false;
      }
    }
    return {
      command,
      getSnapshot,
      invalidate() {
        session = null;
      },
    };
  }
  return { create };
})();
