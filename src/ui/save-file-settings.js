/* Settings UI for the fixed desktop save file. Reads and writes stay in the
   Infrastructure bridge; this module only reflects state and asks for input. */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  let busy = false;

  function status(text, kind = "IDLE") {
    const node = $("saveFileStatus");
    if (!node) return;
    node.textContent = text;
    node.dataset.status = kind;
  }

  function paint(info) {
    const path = $("saveFilePath");
    const input = $("saveFilePathInput");
    if (!path) return;
    if (!info || !info.path) {
      path.textContent = "未初始化";
      if (input) input.value = "";
      return;
    }
    path.textContent = info.path;
    if (input && document.activeElement !== input) input.value = info.path;
    const size =
      info.bytes > 0 ? `${(info.bytes / 1024).toFixed(1)} KB` : "尚未写入";
    status(
      `${info.exists ? "文件存在" : "文件尚未创建"} · ${size}${info.isDefault ? " · 默认位置" : " · 自定义位置"}`,
      info.exists ? "OK" : "MISSING",
    );
  }

  async function refresh() {
    if (!globalThis.ClassroomSaveFile?.available?.()) {
      status("浏览器版把课堂保存在浏览器存储中，此项仅在桌面版可用。", "UNAVAILABLE");
      paint(null);
      return;
    }
    const info = await ClassroomSaveFile.refreshInfo();
    paint(info);
  }

  function guard() {
    if (busy) return false;
    if (!globalThis.ClassroomSaveFile?.available?.()) {
      status("此项仅在桌面版可用。", "UNAVAILABLE");
      return false;
    }
    return true;
  }

  globalThis.chooseSaveFileLocation = async () => {
    if (!guard()) return;
    busy = true;
    try {
      status("等待选择位置…", "PENDING");
      const result = await ClassroomSaveFile.choose();
      if (result?.ok) {
        paint(result.info);
        status("已切换存档位置：" + result.info.path, "OK");
      } else if (result?.canceled) status("已取消。", "IDLE");
      else status("无法使用该位置：" + (result?.error || "未知原因"), "ERROR");
    } finally {
      busy = false;
    }
  };

  globalThis.applySaveFileLocation = async () => {
    if (!guard()) return;
    const value = $("saveFilePathInput")?.value?.trim();
    if (!value) {
      status("请先填写完整的 .json 路径。", "ERROR");
      return;
    }
    busy = true;
    try {
      const result = await ClassroomSaveFile.setPath(value);
      if (result?.ok) {
        paint(result.info);
        status("已切换存档位置：" + result.info.path, "OK");
      } else status("无法使用该路径：" + (result?.error || "未知原因"), "ERROR");
    } finally {
      busy = false;
    }
  };

  globalThis.resetSaveFileLocation = async () => {
    if (!guard()) return;
    busy = true;
    try {
      const result = await ClassroomSaveFile.reset();
      if (result?.ok) {
        paint(result.info);
        status("已恢复默认位置。", "OK");
      } else status("恢复失败：" + (result?.error || "未知原因"), "ERROR");
    } finally {
      busy = false;
    }
  };

  globalThis.loadFromSaveFile = async () => {
    if (!guard()) return;
    const accepted = await programConfirmV28(
      "从存档文件读取会替换当前课堂（小组、积分、道具、历史）。\n建议先导出备份。确定继续？",
      { title: "从文件读取课堂", okText: "读取并替换", cancelText: "取消" },
    );
    if (!accepted) return;
    busy = true;
    try {
      status("正在读取…", "PENDING");
      const result = await ClassroomSaveFile.loadFromFile();
      if (result.status === "empty") {
        status("存档文件尚未创建。", "MISSING");
        return;
      }
      if (result.status !== "loaded") {
        status("读取失败：" + (result.error || "未知原因"), "ERROR");
        return;
      }
      applyClassroomBackup(result.data);
      saveState();
      renderAll();
      updatePickerPoolUI();
      status("已从文件恢复课堂。", "OK");
      showToast("已从存档文件恢复课堂");
    } catch (error) {
      status("恢复失败：" + error.message, "ERROR");
    } finally {
      busy = false;
    }
  };

  window.addEventListener(
    "DOMContentLoaded",
    () => {
      refresh();
      // The settings page may mount after this script runs.
      setTimeout(refresh, 600);
    },
    { once: true },
  );
})();
