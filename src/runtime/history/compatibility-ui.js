function openHistoryModal() {
  switchView("history");
}

function closeHistoryModal() {
  switchView("battle");
}

function renderHistoryList() {
  if (typeof DesktopUI !== "undefined") DesktopUI.renderHistory();
}

function toggleHistExpand(index) {
  const nodes = document.querySelectorAll("#historyListView .hist-node");
  const node = nodes[nodes.length - 1 - index];
  if (node) node.classList.toggle("expanded");
}

async function clearHistoryStack() {
  return HistoryCommands.clear();
}

function revertToHistory(index) {
  return HistoryCommands.revert(index);
}
