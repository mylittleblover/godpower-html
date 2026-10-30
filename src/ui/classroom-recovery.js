/* Read-only discovery and explicit recovery for a protected corrupt snapshot. */
const ClassroomRecovery = (() => {
  let candidates = [];
  let selected = null;
  const byId = (id) => document.getElementById(id);
  const setStatus = (text) => {
    byId("classroomRecoveryStatus").textContent = text;
  };

  function validCandidate(source, raw) {
    try {
      const data = Reliability.validateBackup(raw);
      return {
        source,
        data,
        groups: data.groups.length,
        score: data.groups.reduce(
          (sum, group) => sum + Number(group.score || 0),
          0,
        ),
      };
    } catch {
      return null;
    }
  }

  function collect() {
    const found = [];
    for (const key of [Reliability.legacyStateKey]) {
      try {
        const raw = localStorage.getItem(key);
        if (raw != null) {
          const item = validCandidate(key, JSON.parse(raw));
          if (item) found.push(item);
        }
      } catch {
        /* Keep scanning other independent recovery sources. */
      }
    }
    try {
      const legacy = SchemaMigrations.fromLegacyKeys(localStorage);
      if (legacy) {
        const item = validCandidate("旧版分散存储镜像", legacy);
        if (item) found.push(item);
      }
    } catch {
      /* A broken legacy key does not make other sources unusable. */
    }
    try {
      const preserved = JSON.parse(
        localStorage.getItem("godpower_recovery_before_import_v2") || "null",
      );
      if (preserved && typeof preserved.raw === "string") {
        const item = validCandidate(
          "上次恢复前保留副本",
          JSON.parse(preserved.raw),
        );
        if (item) found.push(item);
      }
    } catch {
      /* Invalid preserved data is shown only through raw export. */
    }
    const seen = new Set();
    candidates = found.filter((item) => {
      const signature = JSON.stringify(item.data);
      if (seen.has(signature)) return false;
      seen.add(signature);
      return true;
    });
    return candidates;
  }

  function renderCandidates() {
    const host = byId("classroomRecoveryCandidates");
    host.replaceChildren();
    for (const [index, item] of candidates.entries()) {
      const card = document.createElement("article");
      card.dataset.recoveryCandidate = String(index);
      const summary = document.createElement("p");
      summary.textContent = `${item.source} · ${item.groups} 个小组 · 合计 ${item.score} 分`;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn btn-secondary";
      button.dataset.recoveryPreview = String(index);
      button.textContent = "查看摘要";
      button.addEventListener("click", () => preview(index));
      card.append(summary, button);
      host.append(card);
    }
  }

  function scan() {
    if (!window.classroomRecoveryRequired) return;
    byId("classroomRecoveryPreview").hidden = true;
    selected = null;
    collect();
    renderCandidates();
    setStatus(
      candidates.length
        ? `发现 ${candidates.length} 个有效副本。扫描没有修改任何数据。`
        : "没有发现可直接恢复的有效副本。原始存档仍可导出；可从备份文件导入。扫描没有修改任何数据。",
    );
  }

  function preview(index) {
    selected = candidates[index] || null;
    if (!selected) return;
    const currentGroups = Array.isArray(state.groups) ? state.groups : [];
    const currentScore = currentGroups.reduce(
      (sum, group) => sum + Number(group.score || 0),
      0,
    );
    byId("classroomRecoveryPreviewText").textContent =
      `候选来源：${selected.source}。当前页面内存副本：${currentGroups.length} 组、合计 ${currentScore} 分；候选副本：${selected.groups} 组、合计 ${selected.score} 分（小组数差 ${selected.groups - currentGroups.length}，积分差 ${selected.score - currentScore}）。确认后会替换本页课堂状态并写入主存档；应用会先保留损坏原文，取消则不修改数据。`;
    byId("classroomRecoveryPreview").hidden = false;
  }

  async function restore() {
    if (!selected || !window.classroomRecoveryRequired) return;
    const accepted = await themeConfirm(
      "此操作会用选中的副本恢复当前课堂。损坏原文会另行保留，是否继续？",
      { title: "恢复课堂存档", danger: true },
    );
    if (!accepted) return;
    byId("classroomRecoveryRestore").disabled = true;
    try {
      const result = importClassroomData(selected.data);
      if (!result?.ok) throw new Error(result?.error || "恢复未完成");
      byId("classroomRecoveryTools").hidden = true;
      setStatus("课堂已恢复并完成主存档写入。");
      showToast("课堂存档已恢复。");
    } catch (error) {
      setStatus(`恢复失败，原始数据仍已保留：${error.message}`);
    } finally {
      byId("classroomRecoveryRestore").disabled = false;
    }
  }

  function exportRaw() {
    let raw;
    try {
      raw = localStorage.getItem(Reliability.stateKey);
    } catch (error) {
      setStatus(`读取损坏原文失败：${error.message}`);
      return;
    }
    if (raw == null) {
      setStatus("主存档键当前为空，没有可导出的原文。");
      return;
    }
    const url = URL.createObjectURL(
      new Blob([raw], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "godpower-corrupt-primary-raw.txt";
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus(
      `已导出原始主存档文本（${new Blob([raw]).size} 字节）；内容未解析或修改。`,
    );
  }

  function init() {
    const tools = byId("classroomRecoveryTools");
    if (!tools) return;
    tools.hidden = !window.classroomRecoveryRequired;
    byId("classroomRecoveryScan").addEventListener("click", scan);
    byId("classroomRecoveryExportRaw").addEventListener("click", exportRaw);
    byId("classroomRecoveryRestore").addEventListener("click", restore);
    byId("classroomRecoveryCancel").addEventListener("click", () => {
      selected = null;
      byId("classroomRecoveryPreview").hidden = true;
    });
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
  return { scan, collect, preview };
})();
