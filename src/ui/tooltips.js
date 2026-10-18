/* Delegated title tooltips. Business renderers retain ownership of their labels. */
(() => {
  "use strict";
  if (window.GodpowerTooltips) return;
  const id = "godpower-hover-tooltip";
  let pointerOwner = null;
  let focusOwner = null;
  let active = null;
  let tooltip = null;

  function titleOwner(target) {
    return target instanceof Element ? target.closest("[title]") : null;
  }

  function getTooltip() {
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.id = id;
      tooltip.className = "gp-hover-tooltip";
      tooltip.setAttribute("role", "tooltip");
      tooltip.hidden = true;
      document.body.append(tooltip);
    }
    return tooltip;
  }

  function removeDescription(owner) {
    const current = owner.getAttribute("aria-describedby");
    if (current === active.describedWithTooltip) {
      if (active.describedBy === null)
        owner.removeAttribute("aria-describedby");
      else owner.setAttribute("aria-describedby", active.describedBy);
      return;
    }
    if (!current) return;
    const tokens = current
      .split(/\s+/)
      .filter((token) => token && token !== id);
    if (tokens.length) owner.setAttribute("aria-describedby", tokens.join(" "));
    else owner.removeAttribute("aria-describedby");
  }

  function dismiss() {
    if (!active) return;
    clearTimeout(active.timer);
    active.dismissed = true;
    if (tooltip) tooltip.hidden = true;
    removeDescription(active.owner);
  }

  function position() {
    if (!active || !tooltip || tooltip.hidden) return;
    if (!active.owner.isConnected) {
      cancel();
      return;
    }
    const rect = active.owner.getBoundingClientRect();
    const margin = 8;
    const width = tooltip.offsetWidth;
    const height = tooltip.offsetHeight;
    const left = Math.max(
      margin,
      Math.min(
        rect.left + (rect.width - width) / 2,
        window.innerWidth - width - margin,
      ),
    );
    const below = rect.bottom + margin;
    const preferredTop =
      below + height <= window.innerHeight - margin
        ? below
        : Math.max(margin, rect.top - height - margin);
    const top = Math.max(
      margin,
      Math.min(preferredTop, window.innerHeight - height - margin),
    );
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  function suppressTitle() {
    active.observer.disconnect();
    active.owner.setAttribute("title", "");
    active.observer.observe(active.owner, {
      attributes: true,
      attributeFilter: ["title"],
    });
  }

  function refreshTitle() {
    if (!active) return;
    active.savedTitle = active.owner.getAttribute("title");
    if (
      active.temporaryLabel !== null &&
      active.owner.getAttribute("aria-label") === active.temporaryLabel
    ) {
      active.temporaryLabel = active.savedTitle || "";
      active.owner.setAttribute("aria-label", active.temporaryLabel);
    }
    suppressTitle();
    if (!active.dismissed) {
      tooltip.textContent = active.savedTitle || "";
      if (!active.savedTitle) dismiss();
      else position();
    }
  }

  function release() {
    if (!active) return;
    const previous = active;
    dismiss();
    previous.observer.disconnect();
    // A renderer may have changed the title before its observer callback ran.
    if (previous.owner.getAttribute("title") === "") {
      if (previous.savedTitle === null) previous.owner.removeAttribute("title");
      else previous.owner.setAttribute("title", previous.savedTitle);
    }
    if (
      previous.temporaryLabel !== null &&
      previous.owner.getAttribute("aria-label") === previous.temporaryLabel
    )
      previous.owner.removeAttribute("aria-label");
    active = null;
  }

  function reconcile() {
    const owner = pointerOwner || focusOwner;
    if (active?.owner === owner) return;
    release();
    if (!owner || !owner.getAttribute("title")) return;
    const bubble = getTooltip();
    active = {
      owner,
      savedTitle: owner.getAttribute("title"),
      describedBy: owner.getAttribute("aria-describedby"),
      dismissed: false,
      observer: new MutationObserver(refreshTitle),
      timer: null,
      temporaryLabel: null,
    };
    // Empty icon buttons can derive their accessible name entirely from title.
    // Preserve that name until the title is restored, without replacing text names.
    if (
      owner.matches("button,a,[role='button']") &&
      !owner.hasAttribute("aria-label") &&
      !owner.hasAttribute("aria-labelledby") &&
      !owner.textContent.trim() &&
      !owner.querySelector("img[alt],svg title")
    ) {
      active.temporaryLabel = active.savedTitle;
      owner.setAttribute("aria-label", active.temporaryLabel);
    }
    bubble.textContent = active.savedTitle;
    suppressTitle();
    active.describedWithTooltip = `${active.describedBy ? `${active.describedBy} ` : ""}${id}`;
    owner.setAttribute("aria-describedby", active.describedWithTooltip);
    bubble.hidden = false;
    position();
    active.timer = setTimeout(dismiss, 3000);
  }

  function cancel() {
    release();
    pointerOwner = null;
    focusOwner = null;
  }

  document.addEventListener("pointerover", (event) => {
    const owner = titleOwner(event.target);
    if (owner === pointerOwner) return;
    pointerOwner = owner;
    reconcile();
  });
  document.addEventListener("pointerout", (event) => {
    if (
      !pointerOwner ||
      (event.relatedTarget instanceof Node &&
        pointerOwner.contains(event.relatedTarget))
    )
      return;
    pointerOwner = titleOwner(event.relatedTarget);
    reconcile();
  });
  document.addEventListener("focusin", (event) => {
    focusOwner = titleOwner(event.target);
    reconcile();
  });
  document.addEventListener("focusout", (event) => {
    focusOwner = titleOwner(event.relatedTarget);
    reconcile();
  });
  document.addEventListener("click", dismiss, true);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") dismiss();
  });
  window.addEventListener("blur", cancel);
  window.addEventListener("resize", position);
  document.addEventListener("scroll", position, true);
  window.GodpowerTooltips = { dismiss, cancel, reset: cancel };
})();
