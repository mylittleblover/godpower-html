(function installTeachingResourceWorkspace(root) {
  "use strict";

  const ACTIVE_KEY = "godpower_active_classroom_context_v1";
  const REFRESH_EVENT = "godpower:active-classroom-changed";
  const refreshers = new Set();
  const byId = (host, id) => host.querySelector(`#${id}`);
  const make = (tag, value, className = "") => {
    const node = document.createElement(tag);
    node.textContent = value;
    if (className) node.className = className;
    return node;
  };

  function safeFileName(value) {
    return value.replace(/[\\/\0]/g, "_").slice(0, 255) || "resource";
  }

  function toBase64(bytes) {
    let binary = "";
    const chunkSize = 0x8000;
    for (let offset = 0; offset < bytes.length; offset += chunkSize)
      binary += String.fromCharCode(
        ...bytes.subarray(offset, offset + chunkSize),
      );
    return btoa(binary);
  }

  function fromBase64(value) {
    if (
      typeof value !== "string" ||
      !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
        value,
      )
    )
      throw new TypeError("资源备份中的 Base64 数据无效");
    const binary = atob(value);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  }

  function mount(host, { storage = localStorage } = {}) {
    if (!host)
      throw new TypeError("teaching resource workspace host is required");
    const rosterRepository =
      root.ClassroomRosterRepository.createClassroomRosterRepository({
        storage,
      });
    const section = document.createElement("section");
    section.id = "teachingResourceWorkspace";
    section.className = "ui-settings-group teaching-resource-workspace";
    section.innerHTML = `<h4>离线学科资源库</h4><p class="ui-muted">资源保存在本机 IndexedDB。仅接受 PDF、TXT、JSON、PNG、JPEG、WebP；单文件最大 20 MiB。PDF 只显示元信息并下载，不嵌入页面预览。</p><div class="teaching-resource-scope"><label>教师档案<select id="teachingResourceProfile" aria-label="资源教师档案"></select></label><label>课堂<select id="teachingResourceClassroom" aria-label="资源所属课堂"></select></label><label>学科<input id="teachingResourceSubject" maxlength="80" placeholder="例如：政治"></label></div><div class="teaching-resource-import"><label>资源标题（单文件可自定义）<input id="teachingResourceTitle" maxlength="160" placeholder="留空时使用文件名"></label><label>标签（逗号分隔）<input id="teachingResourceTags" maxlength="500" placeholder="复习，必修"></label><label class="teaching-resource-file-label">选择本地资源<input id="teachingResourceFiles" type="file" accept=".pdf,.txt,.json,.png,.jpg,.jpeg,.webp,application/pdf,text/plain,application/json,image/png,image/jpeg,image/webp" multiple></label><button id="teachingResourceImport" type="button" class="btn btn-primary">导入资源</button><label class="teaching-resource-file-label">恢复资源备份<input id="teachingResourceRestoreFile" type="file" accept=".gpresources.json,application/json"></label><button id="teachingResourceRestore" type="button" class="btn">验证并恢复</button><button id="teachingResourceExport" type="button" class="btn">导出当前范围</button></div><div class="teaching-resource-filters"><label>搜索<input id="teachingResourceSearch" type="search" placeholder="标题、学科、文件名或标签"></label><label>学科筛选<input id="teachingResourceSubjectFilter" maxlength="80" placeholder="全部学科"></label><span id="teachingResourceCount" class="ui-muted" role="status">0 项资源</span></div><p id="teachingResourceStatus" class="ui-muted" role="status" aria-live="polite">正在打开本地资源库…</p><div id="teachingResourceList" class="teaching-resource-list"><p class="ui-muted">加载中…</p></div>`;
    host.append(section);

    let rosterResult = null;
    let repository = null;
    let resources = [];
    let activeObjectUrl = "";

    function setStatus(message, error = false) {
      const status = byId(section, "teachingResourceStatus");
      status.textContent = message;
      status.dataset.state = error ? "error" : "ok";
    }

    function fillScope() {
      const profile = byId(section, "teachingResourceProfile");
      const classroom = byId(section, "teachingResourceClassroom");
      const previousProfile = profile.value;
      const previousClassroom = classroom.value;
      profile.replaceChildren();
      classroom.replaceChildren();
      const profiles = rosterResult?.rosterData?.profiles || [];
      const classrooms = rosterResult?.rosterData?.classrooms || [];
      for (const item of profiles)
        profile.append(new Option(item.displayName, item.userProfileId));
      for (const item of classrooms)
        classroom.append(new Option(item.name, item.classroomId));
      let context = null;
      try {
        context = JSON.parse(storage.getItem(ACTIVE_KEY) || "null");
      } catch {
        /* invalid context is ignored */
      }
      profile.value = profiles.some(
        (item) => item.userProfileId === previousProfile,
      )
        ? previousProfile
        : profiles.some((item) => item.userProfileId === context?.userProfileId)
          ? context.userProfileId
          : profiles[0]?.userProfileId || "";
      classroom.value = classrooms.some(
        (item) => item.classroomId === previousClassroom,
      )
        ? previousClassroom
        : classrooms.some((item) => item.classroomId === context?.classroomId)
          ? context.classroomId
          : classrooms[0]?.classroomId || "";
      profile.disabled = !profiles.length;
      classroom.disabled = !classrooms.length;
      for (const id of [
        "teachingResourceImport",
        "teachingResourceRestore",
        "teachingResourceExport",
      ])
        byId(section, id).disabled =
          !repository || !profile.value || !classroom.value;
    }

    function matchingResource(resource, search, subject) {
      const subjectMatches =
        !subject || resource.subjectId.toLocaleLowerCase().includes(subject);
      const queryMatches =
        !search ||
        [
          resource.title,
          resource.subjectId,
          resource.fileName,
          ...resource.tags,
        ].some((value) => value.toLocaleLowerCase().includes(search));
      return subjectMatches && queryMatches;
    }

    function download(resource, fileName = resource.fileName) {
      const url = URL.createObjectURL(resource.blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = safeFileName(fileName);
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function releasePreview(dialog) {
      dialog.remove();
      if (activeObjectUrl) URL.revokeObjectURL(activeObjectUrl);
      activeObjectUrl = "";
    }

    function closePreview(dialog) {
      if (dialog.dataset.closing === "true") return;
      dialog.dataset.closing = "true";
      dialog.classList.add("is-closing");
      setTimeout(() => {
        if (dialog.open) dialog.close();
        releasePreview(dialog);
      }, 220);
    }

    async function preview(resource) {
      const dialog = document.createElement("dialog");
      dialog.className = "teaching-resource-preview ui-function-surface";
      dialog.setAttribute("aria-labelledby", "teachingResourcePreviewTitle");
      const header = document.createElement("header");
      const title = make("h3", resource.title);
      title.id = "teachingResourcePreviewTitle";
      const close = make("button", "❌", "ui-window-close");
      close.type = "button";
      close.setAttribute("aria-label", "关闭资源预览");
      close.onclick = () => closePreview(dialog);
      header.append(title, close);
      const body = document.createElement("div");
      body.className = "teaching-resource-preview-body";
      if (
        resource.mimeType === "text/plain" ||
        resource.mimeType === "application/json"
      ) {
        const pre = document.createElement("pre");
        const text = await resource.blob.text();
        if (resource.mimeType === "application/json") {
          try {
            pre.textContent = JSON.stringify(JSON.parse(text), null, 2);
          } catch {
            pre.textContent = text;
          }
        } else pre.textContent = text;
        body.append(pre);
      } else if (resource.mimeType.startsWith("image/")) {
        const image = document.createElement("img");
        activeObjectUrl = URL.createObjectURL(resource.blob);
        image.src = activeObjectUrl;
        image.alt = resource.title;
        body.append(image);
      } else {
        body.append(
          make(
            "p",
            "PDF 不会嵌入页面运行；可以下载后使用本机 PDF 阅读器打开。",
            "ui-muted",
          ),
        );
      }
      const footer = document.createElement("footer");
      footer.append(
        make(
          "span",
          `${resource.fileName} · ${(resource.byteSize / 1024).toFixed(1)} KiB`,
        ),
      );
      const save = make("button", "下载文件", "btn btn-primary");
      save.type = "button";
      save.onclick = () => download(resource);
      footer.append(save);
      dialog.append(header, body, footer);
      dialog.addEventListener("cancel", (event) => {
        event.preventDefault();
        closePreview(dialog);
      });
      dialog.addEventListener("close", () => releasePreview(dialog), {
        once: true,
      });
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) closePreview(dialog);
      });
      document.body.append(dialog);
      dialog.showModal();
    }

    function renderList() {
      const list = byId(section, "teachingResourceList");
      list.replaceChildren();
      const search = byId(section, "teachingResourceSearch")
        .value.trim()
        .toLocaleLowerCase();
      const subject = byId(section, "teachingResourceSubjectFilter")
        .value.trim()
        .toLocaleLowerCase();
      const visible = resources.filter((item) =>
        matchingResource(item, search, subject),
      );
      byId(section, "teachingResourceCount").textContent =
        `${visible.length} 项资源（当前课堂共 ${resources.length} 项）`;
      if (!visible.length) {
        list.append(
          make(
            "p",
            resources.length ? "没有匹配的资源。" : "此教师和课堂尚无资源。",
            "ui-muted",
          ),
        );
        return;
      }
      for (const item of visible) {
        const card = document.createElement("article");
        card.className = "teaching-resource-card";
        const info = document.createElement("div");
        info.className = "teaching-resource-card-info";
        info.append(
          make("strong", item.title),
          make(
            "span",
            `${item.subjectId} · ${item.fileName} · ${(item.byteSize / 1024).toFixed(1)} KiB`,
          ),
        );
        if (item.tags.length)
          info.append(
            make(
              "span",
              item.tags.map((tag) => `#${tag}`).join("  "),
              "teaching-resource-tags",
            ),
          );
        const actions = document.createElement("div");
        actions.className = "teaching-resource-card-actions";
        const previewButton = make("button", "预览", "btn btn-sm");
        previewButton.type = "button";
        previewButton.onclick = async () =>
          repository
            .get(item.resourceId)
            .then((fullResource) => preview(fullResource))
            .catch((error) => setStatus(`预览失败：${error.message}`, true));
        const downloadButton = make("button", "下载", "btn btn-sm");
        downloadButton.type = "button";
        downloadButton.onclick = async () => {
          try {
            download(await repository.get(item.resourceId));
          } catch (error) {
            setStatus(`下载失败：${error.message}`, true);
          }
        };
        const removeButton = make("button", "删除", "btn btn-sm btn-danger");
        removeButton.type = "button";
        removeButton.onclick = async () => {
          if (
            !root.confirm(
              `确认删除“${item.title}”吗？删除前请先导出需要保留的资源。`,
            )
          )
            return;
          try {
            await repository.remove(item.resourceId);
            await refresh();
            setStatus("资源已删除。");
          } catch (error) {
            setStatus(`删除失败：${error.message}`, true);
          }
        };
        actions.append(previewButton, downloadButton, removeButton);
        card.append(info, actions);
        list.append(card);
      }
    }

    async function refresh() {
      rosterResult = rosterRepository.read();
      if (!rosterResult.ok) {
        setStatus("本机教师与课堂名单无法读取；资源未修改。", true);
        return;
      }
      try {
        repository ||= await root.TeachingResourceRepository.open();
        fillScope();
        resources = await repository.list({
          profileId: byId(section, "teachingResourceProfile").value,
          classroomId: byId(section, "teachingResourceClassroom").value,
        });
        renderList();
        setStatus("资源仅保存在本机；没有上传到网络。");
      } catch (error) {
        setStatus(
          `本机资源库不可用：${error.message}。名单和比赛数据未更改。`,
          true,
        );
        byId(section, "teachingResourceList").replaceChildren(
          make("p", "IndexedDB 不可用时，本地资源管理已停用。", "ui-muted"),
        );
      }
      fillScope();
    }

    async function importFiles() {
      const input = byId(section, "teachingResourceFiles");
      const files = [...input.files];
      if (!files.length) return setStatus("请先选择资源文件。", true);
      if (
        files.length > 100 ||
        files.reduce((sum, item) => sum + item.size, 0) > 100 * 1024 * 1024
      )
        return setStatus("单次最多导入 100 个文件，合计不超过 100 MiB。", true);
      const profileId = byId(section, "teachingResourceProfile").value;
      const classroomId = byId(section, "teachingResourceClassroom").value;
      const subjectId = byId(section, "teachingResourceSubject").value.trim();
      if (!subjectId) return setStatus("请填写资源学科。", true);
      const title = byId(section, "teachingResourceTitle").value.trim();
      const tags = byId(section, "teachingResourceTags")
        .value.split(/[，,]/)
        .map((value) => value.trim())
        .filter(Boolean);
      setStatus(`正在验证 ${files.length} 个文件…`);
      try {
        await repository.addBatch(
          files.map((file) => ({
            file,
            profileId,
            classroomId,
            subjectId,
            title: files.length === 1 && title ? title : undefined,
            tags,
          })),
        );
        input.value = "";
        byId(section, "teachingResourceTitle").value = "";
        await refresh();
        setStatus(`已验证并导入 ${files.length} 个资源。`);
      } catch (error) {
        setStatus(`资源未导入：${error.message}。现有资源保持不变。`, true);
      }
    }

    async function exportPack() {
      try {
        const entries = await repository.exportAll({
          profileId: byId(section, "teachingResourceProfile").value,
          classroomId: byId(section, "teachingResourceClassroom").value,
        });
        const packed = [];
        for (const entry of entries) {
          const { blob, ...metadata } = entry;
          packed.push({
            ...metadata,
            dataBase64: toBase64(new Uint8Array(await blob.arrayBuffer())),
          });
        }
        const blob = new Blob(
          [
            JSON.stringify(
              {
                format: "godpower-teaching-resources",
                schemaVersion: 1,
                resources: packed,
              },
              null,
              2,
            ),
          ],
          { type: "application/json" },
        );
        download(
          { blob, fileName: "godpower-resources.gpresources.json" },
          "godpower-resources.gpresources.json",
        );
        setStatus(`已导出 ${packed.length} 个资源的本地备份。`);
      } catch (error) {
        setStatus(`资源备份导出失败：${error.message}`, true);
      }
    }

    async function restorePack() {
      const input = byId(section, "teachingResourceRestoreFile");
      const file = input.files[0];
      if (!file) return setStatus("请先选择资源备份文件。", true);
      if (file.size > 150 * 1024 * 1024)
        return setStatus("备份文件超过 150 MiB 上限。", true);
      try {
        const pack = JSON.parse(await file.text());
        if (
          pack?.format !== "godpower-teaching-resources" ||
          pack.schemaVersion !== 1 ||
          !Array.isArray(pack.resources) ||
          !pack.resources.length
        )
          throw new TypeError("资源备份版本或结构无效");
        if (pack.resources.length > 500)
          throw new TypeError("单个备份最多包含 500 项资源");
        if (
          pack.resources.reduce(
            (sum, entry) => sum + (Number(entry?.byteSize) || 0),
            0,
          ) >
          100 * 1024 * 1024
        )
          throw new TypeError("备份中的资源合计超过 100 MiB");
        const records = pack.resources.map((entry) => {
          const bytes = fromBase64(entry.dataBase64);
          const content = new Blob([bytes], { type: entry.mimeType });
          const restoredFile = new File([content], entry.fileName, {
            type: entry.mimeType,
          });
          return {
            file: restoredFile,
            resourceId: entry.resourceId,
            profileId: entry.profileId,
            classroomId: entry.classroomId,
            subjectId: entry.subjectId,
            title: entry.title,
            tags: entry.tags,
            importedAt: entry.importedAt,
            expectedSha256: entry.sha256,
            expectedByteSize: entry.byteSize,
          };
        });
        setStatus(`正在预检 ${records.length} 个资源；校验完成前不会写入…`);
        await repository.addBatch(records);
        input.value = "";
        await refresh();
        setStatus(`已完整验证并恢复 ${records.length} 个资源。`);
      } catch (error) {
        setStatus(`备份未恢复：${error.message}。现有资源保持不变。`, true);
      }
    }

    byId(section, "teachingResourceProfile").onchange = () =>
      refresh().catch((error) => setStatus(error.message, true));
    byId(section, "teachingResourceClassroom").onchange = () =>
      refresh().catch((error) => setStatus(error.message, true));
    byId(section, "teachingResourceSearch").oninput = renderList;
    byId(section, "teachingResourceSubjectFilter").oninput = renderList;
    byId(section, "teachingResourceImport").onclick = () => importFiles();
    byId(section, "teachingResourceRestore").onclick = () => restorePack();
    byId(section, "teachingResourceExport").onclick = () => exportPack();
    root.addEventListener(REFRESH_EVENT, () => refresh());
    refreshers.add(refresh);
    refresh();
    return Object.freeze({ refresh, repository: () => repository });
  }

  root.TeachingResourceWorkspace = Object.freeze({
    mount,
    refresh: () => refreshers.forEach((refresh) => refresh()),
  });
})(globalThis);
