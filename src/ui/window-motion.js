/* Visual exit lifecycle only: no business state, scoring, or random decisions. */
const GodPowerWindowMotion = Object.freeze({
  create({ animate, canAnimate, motionEase, getPreferences }) {
    // Exit animations have one owner and one completion. No scoring or random decisions here.
    const closingWindows = new Map();
    function finishWindowClose(root) {
      const pending = closingWindows.get(root);
      if (!pending) return;
      closingWindows.delete(root);
      pending.animation?.cancel();
      pending.backdrop?.cancel();
      root.inert = pending.inert;
      delete root.dataset.uiClosing;
      pending.finish();
    }
    function cancelWindowClose(root) {
      const pending = closingWindows.get(root);
      if (!pending) return;
      closingWindows.delete(root);
      pending.animation?.cancel();
      pending.backdrop?.cancel();
      root.inert = pending.inert;
      delete root.dataset.uiClosing;
    }
    function dismissWindow(root, finish) {
      const preferences = getPreferences();
      if (closingWindows.has(root)) return;
      const surface = root.querySelector(".ui-function-surface");
      if (
        !surface ||
        !root.getClientRects().length ||
        !canAnimate() ||
        !preferences.pageMotion
      ) {
        finish();
        return;
      }
      // Snapshot before cancelling entrance, so an early close never jumps to fully open.
      const visual = getComputedStyle(surface);
      const from = {
        opacity: visual.opacity,
        translate: visual.translate,
        scale: visual.scale,
      };
      const backdropOpacity = getComputedStyle(root).opacity;
      surface.getAnimations().forEach((a) => a.cancel());
      const pending = {
        finish,
        inert: root.inert,
        animation: null,
        backdrop: null,
      };
      closingWindows.set(root, pending);
      root.inert = true;
      root.dataset.uiClosing = "true";
      pending.animation = animate(
        surface,
        [
          from,
          {
            opacity: 0,
            translate: preferences.motion === "full" ? "0 64px" : "0 10px",
            scale: preferences.motion === "full" ? ".97" : "1",
          },
        ],
        {
          duration:
            (preferences.motion === "full" ? 280 : 120) / preferences.speed,
          easing: motionEase(),
          fill: "forwards",
        },
      );
      pending.backdrop = animate(
        root,
        [
          { opacity: root.tagName === "DIALOG" ? 1 : backdropOpacity },
          { opacity: 0 },
        ],
        {
          duration:
            (preferences.motion === "full" ? 280 : 120) / preferences.speed,
          easing: motionEase(),
          fill: "forwards",
          ...(root.tagName === "DIALOG" ? { pseudoElement: "::backdrop" } : {}),
        },
      );
      pending.animation.finished
        .catch(() => {})
        .finally(() => {
          if (closingWindows.get(root) === pending) finishWindowClose(root);
        });
    }
    return Object.freeze({
      dismissWindow,
      cancelWindowClose,
      finishWindowClose,
      count: () => closingWindows.size,
      dispose() {
        for (const root of closingWindows.keys()) cancelWindowClose(root);
      },
    });
  },
});
