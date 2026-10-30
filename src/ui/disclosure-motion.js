/* Interruptible disclosure motion. Native details behavior is retained when motion is disabled. */
const GodPowerDisclosureMotion = Object.freeze({
  create({ animate, canAnimate, getPreferences }) {
    let installed = false;
    let scope = null;
    const disclosureMotions = new Map();
    function settleDisclosure(details) {
      const entry = disclosureMotions.get(details);
      if (!entry) return;
      disclosureMotions.delete(details);
      entry.animation?.cancel();
      details.style.overflow = entry.overflow;
      details.open = entry.open;
    }
    function settleDisclosures() {
      for (const details of disclosureMotions.keys()) settleDisclosure(details);
    }
    function setupDisclosures() {
      if (installed) return;
      installed = true;
      scope = GodPowerDisposableScope.createDisposableScope("disclosures");
      scope.listen(document, "click", (event) => {
        const summary = event.target.closest("summary");
        const details = summary?.parentElement;
        if (
          !details ||
          details.tagName !== "DETAILS" ||
          details.classList.contains("ui-dock-menu")
        )
          return;
        if (event.target.closest("a,button,input,select,textarea")) return;
        if (!canAnimate()) return;
        event.preventDefault();
        const preferences = getPreferences();
        const nextOpen = !(
          disclosureMotions.get(details)?.open ?? details.open
        );
        const from = details.getBoundingClientRect().height;
        settleDisclosure(details);
        const overflow = details.style.overflow;
        details.open = false;
        const collapsed = details.getBoundingClientRect().height;
        details.open = true;
        const expanded = details.getBoundingClientRect().height;
        details.style.overflow = "clip";
        const entry = { open: nextOpen, overflow, animation: null };
        disclosureMotions.set(details, entry);
        entry.animation = animate(
          details,
          [
            { height: from + "px" },
            { height: (nextOpen ? expanded : collapsed) + "px" },
          ],
          {
            duration:
              (preferences.motion === "simple" ? 140 : 280) / preferences.speed,
            easing: "cubic-bezier(.16,1,.3,1)",
          },
        );
        const finish = () => {
          if (disclosureMotions.get(details) === entry)
            settleDisclosure(details);
        };
        if (entry.animation) entry.animation.finished.then(finish, finish);
        else finish();
      });
    }
    return Object.freeze({
      settleDisclosures,
      setupDisclosures,
      dispose() {
        scope?.dispose();
        scope = null;
        installed = false;
        settleDisclosures();
      },
      count: () => disclosureMotions.size,
    });
  },
});
