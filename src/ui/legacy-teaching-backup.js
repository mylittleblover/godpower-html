/* Low-frequency compatibility backup; no timetable or resource editor is mounted. */
(function installLegacyTeachingBackupView(root) {
  "use strict";
  function mount(host) {
    if (!host || host.querySelector("[data-legacy-teaching-backup]")) return;
    const section = document.createElement("details");
    section.className = "ui-settings-disclosure";
    section.dataset.legacyTeachingBackup = "";
    section.innerHTML =
      '<summary><b>旧教学数据备份</b><span>兼容旧课程表与资源库，只读导出</span></summary><div class="ui-settings-detail-body"><p class="ui-muted">新版网页不再编辑旧课程表与资源库。原始数据仍保留在本机；课堂学生和头像请在“学生与小组管理”中维护。导出包含旧配置原文和全部校验通过的资源（上限 128 MiB），不会删除数据。</p><button type="button" class="btn" data-export-legacy-teaching>导出旧教学数据</button><p role="status" aria-live="polite"></p></div>';
    const button = section.querySelector("button"),
      status = section.querySelector("[role=status]");
    button.addEventListener("click", async () => {
      if (button.disabled || root.SaveTransferProgress?.isActive?.()) return;
      button.disabled = true;
      status.textContent = "正在读取并校验旧数据…";
      const runTask = root.SaveTransferProgress
        ? (fn) =>
            root.SaveTransferProgress.run(
              {
                title: "导出旧教学数据",
                badge: "archive",
                initialStage: "正在读取旧教学配置与资源…",
              },
              fn,
            )
        : (fn) =>
            fn({ update() {}, tick: async () => {}, finish: async () => {} });
      try {
        await runTask(async (progress) => {
          progress.update({ percent: 35, stage: "正在校验旧课程与资源数据…" });
          await progress.tick();
          const backup = await root.LegacyTeachingBackup.collect();
          progress.update({
            percent: 82,
            stage: `正在生成备份文件（${backup.resources.length} 个资源）…`,
          });
          await progress.tick();
          const blob = new Blob([JSON.stringify(backup)], {
              type: "application/json",
            }),
            url = URL.createObjectURL(blob),
            a = document.createElement("a");
          a.href = url;
          a.download = "godpower-legacy-teaching-backup.json";
          a.click();
          setTimeout(() => URL.revokeObjectURL(url), 30000);
          status.textContent = `已生成完整备份，含 ${backup.resources.length} 个资源。请在下载列表确认保存。`;
          await progress.finish("旧教学数据导出已完成");
        });
      } catch (error) {
        status.textContent = "导出失败：" + error.message + " 原数据未修改。";
      } finally {
        button.disabled = false;
      }
    });
    host.append(section);
  }
  root.LegacyTeachingBackupView = Object.freeze({ mount });
})(globalThis);
