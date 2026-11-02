/* Keeps the floating hand menu and the dock hand panel on the same selection.
   The dock owns the group choice; the floating window must re-select so its
   session token stays valid instead of failing with STALE_HAND_SESSION. */
globalThis.ClassroomHandSync = (() => {
  "use strict";
  const listeners = new Set();
  let current = null;

  function notify(value) {
    current =
      value && Number.isSafeInteger(value.groupId)
        ? { groupId: value.groupId }
        : null;
    for (const fn of [...listeners]) {
      try {
        fn(current);
      } catch (error) {
        console.warn("Hand sync listener failed", error);
      }
    }
  }

  function subscribe(fn) {
    if (typeof fn !== "function") return () => {};
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  return {
    notify,
    subscribe,
    current: () => current,
  };
})();
