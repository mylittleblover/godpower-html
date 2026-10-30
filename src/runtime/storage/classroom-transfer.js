function exportData() {
  const blob = new Blob([JSON.stringify(buildClassroomBackup(), null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = "上帝的力量_完整课堂备份.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function triggerImport() {
  if (state.isLocked) {
    openPwdModal();
    return;
  }
  document.getElementById("importFileInput").click();
}

function handleFileImport(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (file.size > 50 * 1024 * 1024) {
    themeAlert("备份超过 50 MB，请检查文件");
    event.target.value = "";
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const result = importClassroomData(JSON.parse(reader.result));
      if (result.ok) showToast("数据恢复成功");
      else themeAlert("导入失败，原数据已保留：" + result.error);
    } catch (error) {
      themeAlert("JSON 无效，原数据已保留：" + error.message);
    }
    event.target.value = "";
  };
  reader.onerror = () => {
    themeAlert("文件读取失败，原数据已保留");
    event.target.value = "";
  };
  reader.readAsText(file);
}
