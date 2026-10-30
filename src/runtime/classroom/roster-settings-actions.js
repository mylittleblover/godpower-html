function applySettingsBatchMembers() {
  if (state.isLocked) {
    openPwdModal();
    return;
  }
  const text = document.getElementById("settingsBatchMemberText").value.trim();
  if (!text) {
    themeAlert("请输入要导入的成员文本");
    return;
  }
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  let newGroups = [];
  lines.forEach((line, index) => {
    if (line.includes(":") || line.includes("：")) {
      const delimiter = line.includes(":") ? ":" : "：";
      const parts = line.split(delimiter);
      const grpName = parts[0].trim();
      const membersStr = parts.slice(1).join(delimiter).trim();
      const members = membersStr
        .split(/[,，、\s]+/)
        .map((m) => m.trim())
        .filter(Boolean);

      const existing = state.groups.find((g) => g.name.trim() === grpName);
      newGroups.push({
        id: existing ? existing.id : Date.now() + index,
        name: grpName || `第 ${index + 1} 组`,
        color: existing
          ? existing.color
          : DEFAULT_COLORS[index % DEFAULT_COLORS.length],
        score: existing ? existing.score : 0,
        displayScore: existing ? existing.score : 0,
        selectedOpt: existing ? existing.selectedOpt : "",
        allIn: existing ? existing.allIn : false,
        resultText: existing ? existing.resultText : "",
        animState: "",
        members: Array.from(new Set(members)),
      });
    }
  });

  if (newGroups.length > 0) {
    state.groups = newGroups;
    saveState();
    renderAll();
    updatePickerPoolUI();
    showToast(`成功导入 ${newGroups.length} 个小组`);
    closeSoundModal();
  } else {
    themeAlert("解析失败，请检查格式是否正确");
  }
}

function batchSelectOption(opt) {
  return AnswerCommands.batchSelect(opt);
}
function batchToggleAllIn() {
  return AnswerCommands.batchToggleAllIn();
}
