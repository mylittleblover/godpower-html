let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }
  t.innerText = String(msg);
  if (typeof t.showPopover === "function") {
    try {
      t.showPopover();
    } catch (e) {
      console.warn("Toast top-layer unavailable", e.name);
    }
  }
  t.classList.add("show");
  toastTimer = setTimeout(() => {
    t.classList.remove("show");
    if (t.matches(":popover-open")) t.hidePopover();
    toastTimer = null;
  }, 3800);
}
