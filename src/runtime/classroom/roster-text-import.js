function openBatchImportModal() {
  if (state.isLocked) {
    openPwdModal();
    return;
  }
  const sample = state.groups
    .map((g) => `${g.name}: ${g.members.join(", ")}`)
    .join("\n");
  document.getElementById("batchTextarea").value = sample;
  showClassroomWindow(document.getElementById("batchImportModal"));
}

function closeBatchImportModal() {
  hideClassroomWindow(document.getElementById("batchImportModal"));
}

function applyBatchImport() {
  const text = document.getElementById("batchTextarea").value.trim();
  if (!text) {
    closeBatchImportModal();
    return;
  }
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  let parsedCount = 0;

  lines.forEach((line) => {
    if (line.includes(":") || line.includes("：")) {
      const delimiter = line.includes(":") ? ":" : "：";
      const [grpName, membersStr] = line.split(delimiter);
      const targetGroup = state.groups.find(
        (g) =>
          g.name.trim() === grpName.trim() ||
          g.name.replace(/\s+/g, "") === grpName.replace(/\s+/g, ""),
      );
      if (targetGroup && membersStr) {
        const members = membersStr
          .split(/[,，、\s]+/)
          .map((m) => m.trim())
          .filter(Boolean);
        targetGroup.members = Array.from(new Set(members));
        parsedCount += targetGroup.members.length;
      }
    }
  });

  saveState();
  renderGrid();
  updatePickerPoolUI();
  closeBatchImportModal();
  showToast(`成功导入 ${parsedCount} 名学生`);
}
