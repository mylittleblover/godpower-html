/* Presentation state and validated command intents; business commits stay in HandRaisePort. */
(function installHandFlow(root) {
  "use strict";
  const copy = (value) => JSON.parse(JSON.stringify(value));
  function initial() {
    return { phase: "CLOSED", groupId: null, selectionId: null, context: null };
  }
  const sameContext = (a, b) =>
    a?.saveId === b?.saveId &&
    a?.generation === b?.generation &&
    a?.revision === b?.revision;
  function reduce(input, action) {
    const state = copy(input || initial());
    const reject = (error) => ({
      ok: false,
      error,
      next: state,
      commandIntent: null,
      presentationIntent: null,
    });
    const done = (next, commandIntent = null) => ({
      ok: true,
      next,
      commandIntent,
      presentationIntent: { phase: next.phase },
    });
    const clear = (phase) => ({ ...initial(), phase, context: state.context });
    if (action?.type === "EXIT") return done(initial());
    if (action?.type === "ENTER")
      return state.phase === "CLOSED"
        ? done({
            ...initial(),
            phase: "SELECT_GROUP",
            context: copy(action.context || null),
          })
        : reject("ALREADY_OPEN");
    if (action?.type === "CANCEL") {
      if (["SCORE", "DRAW", "USE"].includes(state.phase))
        return done({ ...state, phase: "REWARD_CHOICE" });
      return state.phase === "CLOSED"
        ? reject("CLOSED")
        : done(clear("SELECT_GROUP"));
    }
    if (action?.type === "SELECT") {
      if (!["SELECT_GROUP", "JUDGE", "REWARD_CHOICE"].includes(state.phase))
        return reject("INVALID_PHASE");
      if (
        !Number.isSafeInteger(action.groupId) ||
        action.groupId <= 0 ||
        typeof action.selectionId !== "string" ||
        !action.selectionId
      )
        return reject("INVALID_SELECTION");
      if (!sameContext(state.context, action.context))
        return reject("STALE_CONTEXT");
      return done({
        ...state,
        phase: "JUDGE",
        groupId: action.groupId,
        selectionId: action.selectionId,
      });
    }
    if (
      !state.selectionId ||
      action?.selectionId !== state.selectionId ||
      !sameContext(state.context, action.context)
    )
      return reject("STALE_SELECTION");
    const intent = (name, payload = {}) => ({
      action: name,
      payload: {
        groupId: state.groupId,
        selectionId: state.selectionId,
        ...payload,
      },
    });
    if (action.type === "JUDGE_OK" || action.type === "JUDGE_WRONG") {
      if (state.phase !== "JUDGE") return reject("ALREADY_JUDGED");
      const correct = action.type === "JUDGE_OK";
      return done(
        correct ? { ...state, phase: "REWARD_CHOICE" } : clear("SELECT_GROUP"),
        intent("handJudge", { correct }),
      );
    }
    const choices = {
      SELECT_SCORE: "SCORE",
      SELECT_DRAW: "DRAW",
      SELECT_USE: "USE",
    };
    if (choices[action.type]) {
      if (state.phase !== "REWARD_CHOICE") return reject("INVALID_PHASE");
      const phase = choices[action.type];
      return done(
        { ...state, phase },
        phase === "DRAW"
          ? intent("handDraw")
          : phase === "USE"
            ? intent("handUse")
            : null,
      );
    }
    if (action.type === "SUBMIT_SCORE") {
      if (
        state.phase !== "SCORE" ||
        !Number.isSafeInteger(action.delta) ||
        action.delta === 0
      )
        return reject("INVALID_SCORE");
      return done(state, intent("handScore", { delta: action.delta }));
    }
    if (action.type === "COMPLETE")
      return ["SCORE", "DRAW", "USE"].includes(state.phase)
        ? done(clear("SELECT_GROUP"))
        : reject("INVALID_PHASE");
    return reject("UNKNOWN_ACTION");
  }
  root.HandFlow = Object.freeze({ initial, reduce });
})(globalThis);
