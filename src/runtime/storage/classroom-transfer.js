async function exportData() {
  if(globalThis.SaveManager?.enabled()){
    const data=await SaveManager.exportCurrent(),url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"})),a=document.createElement("a");a.href=url;a.download="上帝的力量_完整存档_含头像.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return;
  }
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
  reader.onload = async () => {
    try {
      const result = globalThis.SaveManager?.enabled() ? await SaveManager.importSource(await SaveManager.previewSource(String(reader.result),file.name)) : await importClassroomData(JSON.parse(reader.result));
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
