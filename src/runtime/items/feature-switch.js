const COMMUNISM_MODE_KEY = "politics_communism_mode";
function isCommunismMode() {
  return STORAGE.getJSON(COMMUNISM_MODE_KEY, true) !== false;
}
function setCommunismMode(enabled) {
  STORAGE.setJSON(COMMUNISM_MODE_KEY, !!enabled);
  applyCommunismMode();
  showToast(enabled ? "共产主义模式已开启" : "共产主义模式已关闭");
}
function applyCommunismMode() {
  const on = isCommunismMode();
  document.body.classList.toggle("items-disabled", !on);

  // Hide/show item-only dock controls and tabs whose legacy markup has no stable class.
  document
    .querySelectorAll('button,[role="button"],.dock-btn,.nav-btn')
    .forEach((el) => {
      const t = (el.textContent || "").trim();
      const oc = el.getAttribute("onclick") || "";
      const itemOnly =
        /道具抽取|抽取道具|道具百科|道具与图标/.test(t) ||
        /globalItemDraw|openItemEncyclopedia/.test(oc);
      if (itemOnly) {
        el.dataset.itemFeature = "1";
        el.style.display = on ? "" : "none";
      }
    });

  // Group cards: inventory/slots are handled by CSS; close item window if feature gets disabled.
  if (!on) {
    try {
      document.getElementById("itemWindow")?.classList.remove("active");
    } catch (e) {}
    try {
      document.getElementById("itemBackdrop")?.classList.remove("active");
    } catch (e) {}
  }
}

/* Hard guard: even stale buttons/hotkeys cannot invoke item functions while disabled. */

if (typeof openItemWindow === "function") {
  const _v291OpenItemWindow = openItemWindow;
  openItemWindow = function (...a) {
    if (!isCommunismMode()) {
      showToast("共产主义模式已关闭");
      return;
    }
    return _v291OpenItemWindow.apply(this, a);
  };
}

/* Add the switch to Function Settings using the same setting-card language. */
function installCommunismModeSetting() {
  /* UI moved to the built-in gameplay plugin; legacy key remains authoritative. */
  document.getElementById("communismModeSetting")?.remove();
}
window.addEventListener("DOMContentLoaded", () =>
  setTimeout(() => {
    installCommunismModeSetting();
    applyCommunismMode();
  }, 160),
);

/* ===== V2.9.4 大数显示辅助 ===== */
