/* Only the picker has an external window; functional dialogs keep their live DOM. */
(() => {
  const desktop = window.godpowerDesktop;
  if (!desktop || desktop.role !== "main") return;
  function install() {
    const picker = document.getElementById("pickerModal");
    if (!picker) return;
    const style = document.createElement("style");
    style.textContent =
      "#pickerModal[data-external-picker]{visibility:hidden!important;pointer-events:none!important}";
    document.head.append(style);
    let opened = false;
    const sync = () => {
      const visible =
        picker.classList.contains("active") || picker.style.display === "flex";
      picker.toggleAttribute("data-external-picker", visible);
      if (visible && !opened) desktop.openPicker();
      opened = visible;
    };
    // Repeated presses must reopen a collapsed picker even if the hidden
    // legacy picker modal was already active and its class does not change.
    const fromControl = (event) => {
      if (event.target.closest('[onclick*="openPickerModal"]'))
        void desktop.openPicker();
    };
    document.addEventListener("click", fromControl);
    const observer = new MutationObserver(sync);
    observer.observe(picker, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    sync();
    window.addEventListener(
      "beforeunload",
      () => {
        observer.disconnect();
        document.removeEventListener("click", fromControl);
      },
      {
        once: true,
      },
    );
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", install, { once: true });
  else install();
})();
