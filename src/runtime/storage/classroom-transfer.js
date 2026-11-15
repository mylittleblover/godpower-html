async function exportData() {
  if (globalThis.SaveTransferProgress?.isActive?.()) return;
  const runTask = globalThis.SaveTransferProgress
    ? (fn) =>
        globalThis.SaveTransferProgress.run(
          {
            title: "导出课堂备份",
            badge: "download",
            initialStage: "正在准备备份数据…",
          },
          fn,
        )
    : (fn) => fn({ update() {}, tick: async () => {}, finish: async () => {} });
  await runTask(async (progress) => {
    if (globalThis.SaveManager?.enabled()) {
      const data = await SaveManager.exportCurrent({
        onProgress: (p) => progress.update(p),
      });
      progress.update({ percent: 88, stage: "正在生成备份文件…" });
      await progress.tick();
      const url = URL.createObjectURL(
        new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = "上帝的力量_完整存档_含头像.json";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      await progress.finish("完整备份导出成功");
      return;
    }
    progress.update({ percent: 45, stage: "正在打包课堂数据与历史记录…" });
    await progress.tick();
    const blob = new Blob([JSON.stringify(buildClassroomBackup(), null, 2)], {
      type: "application/json",
    });
    progress.update({ percent: 85, stage: "正在生成备份文件…" });
    await progress.tick();
    const url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = "上帝的力量_完整课堂备份.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    await progress.finish("课堂备份导出成功");
  });
}

function triggerImport() {
  if (globalThis.SaveTransferProgress?.isActive?.()) {
    showToast("当前有导入或导出任务正在进行，请稍候");
    return;
  }
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
  const runTask = globalThis.SaveTransferProgress
    ? (fn) =>
        globalThis.SaveTransferProgress.run(
          {
            title: "恢复课堂数据备份",
            badge: "upload",
            initialStage: "正在读取备份文件…",
          },
          fn,
        )
    : (fn) => fn({ update() {}, tick: async () => {}, finish: async () => {} });
  void runTask(async (progress) => {
    try {
      const text = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onprogress = (ev) => {
          if (ev.lengthComputable && ev.total > 0) {
            progress.update({
              percent: 5 + Math.round((ev.loaded / ev.total) * 23),
              stage: "正在读取备份文件…",
            });
          }
        };
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(Error("文件读取失败，原数据已保留"));
        reader.readAsText(file);
      });
      progress.update({ percent: 30, stage: "正在解析并校验数据…" });
      await progress.tick();
      let result;
      if (globalThis.SaveManager?.enabled()) {
        const preview = await SaveManager.previewSource(text, file.name, {
          onProgress: (p) => progress.update(p),
        });
        result = await SaveManager.importSource(preview, {
          onProgress: (p) => progress.update(p),
        });
      } else {
        progress.update({ percent: 65, stage: "正在导入恢复课堂数据…" });
        await progress.tick();
        result = await importClassroomData(JSON.parse(text));
      }
      if (result.ok) {
        await progress.finish("数据恢复成功");
        showToast("数据恢复成功");
      } else {
        themeAlert("导入失败，原数据已保留：" + result.error);
      }
    } catch (error) {
      themeAlert(
        (error?.message?.includes("文件读取失败")
          ? ""
          : "JSON 无效，原数据已保留：") + error.message,
      );
    } finally {
      event.target.value = "";
    }
  });
}
