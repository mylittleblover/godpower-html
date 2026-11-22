/* Advanced maintenance presentation; the coordinator owns all migration work. */
const MigrationPanel = (() => {
  let selected = null,
    report = null,
    busy = false,
    cancellation = null;
  const coordinator = MigrationCoordinator.create({
    inventory: LegacyStorageInventory,
    openRepository: (plan) =>
      TransactionalRepository.open({
        name: "godpower-staging-" + plan.migrationId,
        validateSnapshot: Reliability.validateBackup,
      }),
  });
  const element = (id) => document.getElementById(id);
  function status(code, message) {
    const output = element("v3MigrationStatus");
    if (!output) return;
    output.dataset.status = code;
    output.textContent = message;
  }
  function refresh() {
    element("v3MigrationInspect").disabled = busy;
    element("v3MigrationStage").disabled = busy || !selected;
    element("v3MigrationDownload").disabled = busy || !report;
    element("v3MigrationTools").setAttribute("aria-busy", String(busy));
  }
  function available(staging) {
    if (window.classroomUnsavedChanges || window.classroomRecoveryRequired) {
      showToast(
        "当前有尚未保存或需要恢复的课堂数据。请先导出备份，再进行迁移检查。",
      );
      return false;
    }
    if (staging && state.isLocked) {
      openPwdModal();
      return false;
    }
    if (
      staging &&
      (classroomCommands.isPending() ||
        itemDrawBusy ||
        slotEngine.isSpinning ||
        isStartingRound ||
        isSwitchingRound ||
        (state.roundActive && !state.evaluated))
    ) {
      showToast("请完成本题和当前抽取后，再创建迁移副本。");
      return false;
    }
    return true;
  }
  async function inspect() {
    if (busy || !available(false)) return;
    busy = true;
    selected = null;
    report = null;
    refresh();
    status("INSPECTING", "正在检查本机课堂、档案与自定义资源…");
    try {
      const preview = await coordinator.preview();
      if (!preview.ok) {
        status(preview.status, preview.conflicts.join("；"));
        return;
      }
      selected = preview;
      report = { appVersion: window.__GOD_POWER_VERSION__, preview };
      status(
        "PREVIEW",
        `${preview.counts.groups} 个小组 · ${preview.counts.archives} 届档案 · ${preview.counts.resources} 项数据与资源记录。可创建副本并验证，当前课堂不会被替换。`,
      );
    } catch (error) {
      status("FAILED", "检查未完成，原数据保持不变：" + error.message);
    } finally {
      busy = false;
      refresh();
    }
  }
  async function stage() {
    if (busy || !selected || !available(true)) return;
    busy = true;
    cancellation = new AbortController();
    refresh();
    status("STAGING", "正在创建本机迁移副本并核对数据，请稍候…");
    try {
      const result = await coordinator.execute(selected, {
        signal: cancellation.signal,
      });
      report = {
        appVersion: window.__GOD_POWER_VERSION__,
        preview: selected,
        result,
      };
      if (result.ok) {
        status(
          result.status,
          `副本验证通过：${selected.counts.groups} 个小组、${result.integrity.verifiedArchives} 届档案、${result.integrity.verifiedResources} 项数据与资源记录。当前课堂仍使用原存储，未执行切换。`,
        );
      } else {
        selected = null;
        const reason =
          result.error ||
          result.conflicts?.join("；") ||
          result.integrity?.failures.join("；") ||
          "验证未完成";
        status(result.status, "未切换课堂，原数据保持不变。" + reason);
      }
    } catch (error) {
      status("FAILED", "未切换课堂，原数据保持不变：" + error.message);
    } finally {
      busy = false;
      cancellation = null;
      refresh();
    }
  }
  function download() {
    if (report)
      GodpowerTheme.downloadJson(report, "GodPower_迁移校验报告.json");
  }
  function init() {
    if (!element("v3MigrationTools")) return;
    element("v3MigrationInspect").addEventListener("click", inspect);
    element("v3MigrationStage").addEventListener("click", stage);
    element("v3MigrationDownload").addEventListener("click", download);
    window.addEventListener("beforeunload", () => cancellation?.abort(), {
      once: true,
    });
    refresh();
  }
  return { init };
})();
window.addEventListener("DOMContentLoaded", MigrationPanel.init, {
  once: true,
});
