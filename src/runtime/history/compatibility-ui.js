function renderHistoryList() {
  if (typeof DesktopUI !== "undefined") DesktopUI.renderHistory();
}

async function clearHistoryStack() {
  return HistoryCommands.clear();
}

function revertToHistory(index) {
  return HistoryCommands.revert(index);
}
