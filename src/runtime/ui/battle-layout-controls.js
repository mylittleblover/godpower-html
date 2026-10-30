function applyZoom(level) {
  state.zoomLevel = Math.max(0.4, Math.min(2.0, level));
  document.body.style.zoom = state.zoomLevel;
  if (typeof DesktopUI !== "undefined") DesktopUI.syncViewport();
  STORAGE.set("politics_zoom_level", state.zoomLevel);
  showToast(`视图缩放比例: ${Math.round(state.zoomLevel * 100)}%`);
}

function zoomIn() {
  applyZoom(Math.round((state.zoomLevel + 0.1) * 10) / 10);
}

function zoomOut() {
  applyZoom(Math.round((state.zoomLevel - 0.1) * 10) / 10);
}

function zoomReset() {
  applyZoom(1.0);
}

function toggleResizerEnabled(enabled) {
  state.resizerEnabled = enabled;
  saveState();
  updateResizerUI();
}

function toggleSaveAllIn(enabled) {
  state.saveAllIn = enabled;
  saveState();
}

function updateColumnMode(mode) {
  state.columnMode = mode;
  saveState();
  renderGrid();
}

function updateResizerUI() {
  const dock = document.getElementById("heightResizerDock");
  if (!dock) return;
  dock.style.display = state.resizerEnabled ? "flex" : "none";
  dock.style.height = `${state.resizerHeight}px`;
}

function initResizerDrag() {
  const handle = document.getElementById("resizerHandle");
  const dock = document.getElementById("heightResizerDock");
  if (!handle || !dock) return;

  let startY = 0;
  let startH = 0;

  handle.onpointerdown = (e) => {
    startY = e.clientY;
    startH = dock.offsetHeight;
    handle.setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  handle.onpointermove = (e) => {
    if (!handle.hasPointerCapture(e.pointerId)) return;
    const deltaY = e.clientY - startY;
    const newH = Math.max(28, Math.min(600, startH + deltaY));
    dock.style.height = `${newH}px`;
    state.resizerHeight = newH;
  };

  handle.onpointerup = (e) => {
    if (handle.hasPointerCapture(e.pointerId)) {
      handle.releasePointerCapture(e.pointerId);
      saveState();
      showToast(`垫片高度已锁定: ${state.resizerHeight}px`);
    }
  };
}
