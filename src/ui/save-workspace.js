/* Current-save management; no parallel classroom/teacher roster is edited here. */
(function installSaveWorkspace(root) {
  "use strict";
  const E = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  let mounted = null,
    lastRoster = "",
    saveId = "",
    avatarTarget = null,
    batchContext = null;
  const urls = new Map();
  function message(text) {
    if (mounted)
      mounted.querySelector("[data-save-message]").textContent = text;
  }
  function revoke() {
    for (const url of urls.values()) URL.revokeObjectURL(url);
    urls.clear();
  }
  function download(value, name) {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function thumbnails() {
    const id = saveId;
    for (const image of mounted.querySelectorAll("img[data-asset]")) {
      const assetId = image.dataset.asset;
      try {
        if (!urls.has(assetId)) {
          const asset = await SaveManager.repository().getAsset(assetId);
          if (id !== saveId) return;
          if (!asset?.raw) continue;
          urls.set(assetId, URL.createObjectURL(asset.raw));
        }
        image.src = urls.get(assetId);
      } catch (error) {
        image.alt = "头像暂不可用";
        console.warn("读取可选头像失败", error.message);
      }
    }
  }
  function avatar(row, type) {
    const id = type === "student" ? row.studentUid : row.groupUid;
    return `<button type="button" class="save-avatar-button" data-avatar-type="${type}" data-avatar-id="${E(id)}" aria-label="为${E(row.displayName || row.name)}设置头像">${row.avatarResourceId ? `<img data-asset="${E(row.avatarResourceId)}" alt="头像">` : "<span>＋头像</span>"}</button>`;
  }
  async function render() {
    if (!mounted) return;
    const doc = SaveManager.snapshot();
    const status = SaveManager.status();
    mounted.querySelector("[data-save-state]").textContent = doc
      ? `${doc.name} · 修订 ${doc.revision} · ${status.phase === "saving" ? "保存中…" : status.phase === "error" ? "保存失败，保留当前数据" : "本地保存"}`
      : status.error || "正在读取当前存档…";
    mounted.querySelector("[data-save-retry]").hidden = !SaveManager.blocked();
    mounted.querySelector("[data-legacy-roster-status]").textContent =
      status.legacyRosterMessage || "";
    if (!doc) return;
    if (saveId !== doc.saveId) {
      saveId = doc.saveId;
      lastRoster = "";
      mounted.querySelector("[data-member-editor]").hidden = true;
      delete mounted.querySelector("#saveStudentForm").dataset.editing;
      mounted.querySelector("#saveStudentName").value = "";
      mounted.querySelector("#saveStudentNumber").value = "";
      mounted.querySelector("#saveStudentAdd").textContent = "新增学生";
      revoke();
    }
    const signature = doc.saveId + ":" + doc.roster.revision;
    if (signature === lastRoster) return;
    lastRoster = signature;
    const groups = new Map(doc.roster.groups.map((g) => [g.groupUid, g]));
    mounted.querySelector("#saveWorkspaceStudentRows").innerHTML =
      doc.roster.students
        .map((s) => {
          const a = doc.roster.assignments.find(
            (a) => a.studentUid === s.studentUid,
          );
          return `<tr><td>${avatar(s, "student")}</td><td><b>${E(s.number || "—")}</b></td><td>${E(s.displayName)}</td><td>${E(groups.get(a?.groupUid)?.name || "未分组")}</td><td><button type="button" class="btn" data-edit-student="${E(s.studentUid)}">编辑</button></td></tr>`;
        })
        .join("") ||
      '<tr><td colspan="5">暂无学生，可在上方新增学生，或导入课堂存档。</td></tr>';
    mounted.querySelector("[data-save-students-count]").textContent =
      `学生 ${doc.roster.students.length} 人`;
    mounted.querySelector("[data-save-groups]").innerHTML =
      doc.roster.groups
        .map(
          (g) =>
            `<article class="save-group-row">${avatar(g, "group")}<div><b>${E(g.name)}</b><p>${doc.roster.assignments.filter((a) => a.groupUid === g.groupUid).length} 名成员</p></div><button type="button" class="btn" data-members="${E(g.groupUid)}">选择成员</button></article>`,
        )
        .join("") || "<p>暂无小组，可从比赛页添加小组。</p>";
    const listed = await SaveManager.repository().list();
    if (listed.ok) {
      mounted.querySelector("[data-save-inactive]").innerHTML =
        '<option value="">选择其他存档</option>' +
        listed.index.entries
          .filter((e) => e.saveId !== doc.saveId)
          .map(
            (e) =>
              `<option value="${E(e.saveId)}" data-revision="${e.revision}">${E(e.name)}</option>`,
          )
          .join("");
      mounted.querySelector("[data-save-trash-list]").innerHTML =
        '<option value="">选择已移除存档</option>' +
        (listed.index.trashedEntries || [])
          .map(
            (e) =>
              `<option value="${E(e.saveId)}" data-revision="${e.revision}">${E(e.name)}</option>`,
          )
          .join("");
    }
    if (listed.ok)
      mounted.querySelector("[data-save-select]").innerHTML =
        listed.index.entries
          .map(
            (e) =>
              `<option value="${E(e.saveId)}" ${e.saveId === doc.saveId ? "selected" : ""}>${E(e.name)}</option>`,
          )
          .join("");
    thumbnails();
  }
  async function assetFromFile(file) {
    if (
      file.size > 12 * 1024 * 1024 ||
      !/^image\/(png|jpeg|webp)$/.test(file.type)
    )
      throw Error("头像需为12MB以内的PNG、JPG或WebP");
    const url = URL.createObjectURL(file);
    let image;
    try {
      image = new Image();
      image.src = url;
      await image.decode();
      if (image.naturalWidth * image.naturalHeight > 40e6)
        throw Error("头像分辨率过大");
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 320;
      const c = canvas.getContext("2d");
      if (!c) throw Error("无法处理图片");
      const scale = Math.max(
          320 / image.naturalWidth,
          320 / image.naturalHeight,
        ),
        w = image.naturalWidth * scale,
        h = image.naturalHeight * scale;
      c.drawImage(image, (320 - w) / 2, (320 - h) / 2, w, h);
      const dataBase64 = canvas.toDataURL("image/webp", 0.86).split(",")[1],
        bytes = Uint8Array.from(atob(dataBase64), (c) => c.charCodeAt(0));
      const sha256 = [
        ...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)),
      ]
        .map((n) => n.toString(16).padStart(2, "0"))
        .join("");
      return {
        resourceId: "asset-" + sha256,
        sha256,
        mimeType: "image/webp",
        dataBase64,
        byteLength: bytes.length,
      };
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  async function setAvatarFiles(files, target) {
    const before = SaveManager.snapshot(),
      context = SaveManager.context();
    if (!before) throw Error("存档未就绪");
    const expected = target?.context || batchContext;
    if (
      expected &&
      (expected.saveId !== before.saveId ||
        expected.generation !== context.generation)
    )
      throw Error("头像选择窗口属于旧存档，已取消");
    const updates = [],
      assets = [];
    let unmatched = 0;
    for (const file of files) {
      let row = target;
      if (!row) {
        const name = file.name.replace(/\.[^.]+$/, "").trim();
        const matches = before.roster.students.filter(
          (s) => s.displayName === name || SaveRoster.label(s) === name,
        );
        if (matches.length !== 1) {
          unmatched++;
          continue;
        }
        row = { type: "student", id: matches[0].studentUid };
      }
      const asset = await assetFromFile(file);
      assets.push(asset);
      updates.push({ ...row, resourceId: asset.resourceId });
    }
    if (
      SaveManager.snapshot().saveId !== before.saveId ||
      SaveManager.context().generation !== context.generation
    )
      throw Error("处理图片时存档已切换，已取消");
    if (!updates.length) {
      message("没有找到唯一匹配的学生；请逐人选择头像。");
      return;
    }
    const result = await SaveManager.edit(
      "更新名单头像",
      (doc) => {
        doc.assetReferences = [
          ...new Set([
            ...doc.assetReferences,
            ...assets.map((a) => a.resourceId),
          ]),
        ];
        for (const row of updates)
          doc = SaveRoster.setAvatar(doc, row.type, row.id, row.resourceId);
        return doc;
      },
      { assets },
    );
    if (!result.ok || !result.persisted)
      throw Error(result.error || "头像未保存");
    message(
      `已保存 ${updates.length} 张头像${unmatched ? `，${unmatched} 张未唯一匹配，未自动填写` : ""}`,
    );
    await render();
  }
  function editStudent(id) {
    const student = SaveManager.snapshot()?.roster.students.find(
      (s) => s.studentUid === id,
    );
    if (!student) return;
    mounted.querySelector("#saveStudentName").value = student.displayName;
    mounted.querySelector("#saveStudentNumber").value = student.number || "";
    mounted.querySelector("#saveStudentForm").dataset.editing = id;
    mounted.querySelector("#saveStudentAdd").textContent = "保存学生";
    mounted.querySelector("#saveStudentName").focus();
  }
  function openMembers(groupUid) {
    const doc = SaveManager.snapshot(),
      group = doc?.roster.groups.find((g) => g.groupUid === groupUid);
    if (!group) return;
    const body = mounted.querySelector("[data-member-options]");
    mounted.querySelector("[data-member-search]").value = "";
    mounted.querySelector("[data-member-title]").textContent =
      group.name + " · 选择成员";
    body.innerHTML =
      doc.roster.students
        .map((s) => {
          const a = doc.roster.assignments.find(
            (a) => a.studentUid === s.studentUid,
          );
          const other = doc.roster.groups.find(
            (g) => g.groupUid === a?.groupUid,
          );
          return `<label><input type="checkbox" value="${E(s.studentUid)}" ${a?.groupUid === groupUid ? "checked" : ""}>${s.avatarResourceId ? `<img data-asset="${E(s.avatarResourceId)}" alt="头像">` : ""}<span>${E(SaveRoster.label(s))}</span><small>${E(other && other.groupUid !== groupUid ? "将从" + other.name + "移入" : "")}</small></label>`;
        })
        .join("") || "<p>请先新增学生。</p>";
    const panel = mounted.querySelector("[data-member-editor]");
    panel.hidden = false;
    panel.dataset.groupUid = groupUid;
    panel.dataset.saveId = doc.saveId;
    panel.scrollIntoView({ block: "nearest", behavior: "smooth" });
    thumbnails();
  }
  function mount(parent) {
    if (mounted) return mounted;
    mounted = document.createElement("section");
    mounted.id = "saveWorkspace";
    mounted.className = "ui-settings-card save-workspace";
    mounted.innerHTML = `<header><h3>当前存档 · 学生与小组</h3><p data-save-state role="status">正在读取…</p><button type="button" class="btn" hidden data-save-retry>重试存档读取</button></header>
   <div class="save-workspace-toolbar"><select aria-label="切换存档" data-save-select></select><button type="button" class="btn" data-save-import>导入新存档</button><button type="button" class="btn" data-save-export>导出完整存档（含头像）</button><button type="button" class="btn" data-batch-avatar>批量添加头像</button></div>
   <details class="ui-settings-disclosure"><summary>更多存档管理</summary><div class="save-workspace-toolbar"><input data-save-name aria-label="存档名称" placeholder="存档名称" maxlength="100"><button type="button" class="btn" data-save-new>新建空白课堂</button><button type="button" class="btn" data-save-copy>复制当前存档</button><button type="button" class="btn" data-save-rename>重命名当前存档</button></div><p>只移除非当前存档；请先切换到其他存档。回收站保留完整文件、头像及来源，恢复前会校验，暂不提供永久删除。</p><div class="save-workspace-toolbar"><select aria-label="选择待移除存档" data-save-inactive></select><button type="button" class="btn btn-danger" data-save-trash>移入回收站</button><select aria-label="回收站存档" data-save-trash-list></select><button type="button" class="btn" data-save-restore>恢复存档</button></div></details>
   <p class="save-workspace-help">姓名和头像保存在当前存档中。批量头像按文件名唯一匹配姓名；不匹配或重名时不自动猜测。更改后立即保存。</p>
   <p data-legacy-roster-status class="save-workspace-help"></p>
   <p data-save-message role="status"></p>
   <form id="saveStudentForm" class="save-student-form"><label>学号<input id="saveStudentNumber" autocomplete="off" maxlength="30"></label><label>姓名<input id="saveStudentName" autocomplete="off" maxlength="200" required></label><button class="btn btn-primary" type="submit" id="saveStudentAdd">新增学生</button></form>
   <div class="save-roster-columns"><section><h4 data-save-students-count>学生</h4><table class="save-student-table"><thead><tr><th>头像</th><th>学号</th><th>姓名</th><th>小组</th><th>管理</th></tr></thead><tbody id="saveWorkspaceStudentRows"></tbody></table></section><section><h4>小组列表</h4><div data-save-groups></div></section></div>
   <section data-member-editor hidden><h4 data-member-title></h4><p>学生同一时间只属于一个小组；未勾选的原成员会保留在未分组名单中。</p><label>搜索学生（学号或姓名）<input type="search" data-member-search autocomplete="off" placeholder="输入学号或姓名"></label><div data-member-options class="save-member-options"></div><button type="button" class="btn btn-primary" data-member-save>保存成员</button><button type="button" class="btn" data-member-close>取消</button></section>
   <input hidden type="file" accept=".json" data-save-file><input hidden type="file" accept="image/png,image/jpeg,image/webp" data-avatar-file><input hidden multiple type="file" accept="image/png,image/jpeg,image/webp" data-batch-file>`;
    parent.prepend(mounted);
    mounted
      .querySelector("[data-member-search]")
      .addEventListener("input", (event) => {
        const query = event.target.value.trim().toLocaleLowerCase();
        for (const label of mounted.querySelectorAll(
          "[data-member-options] label",
        ))
          label.hidden = !label.textContent.toLocaleLowerCase().includes(query);
      });
    const handle = (fn) => async (event) => {
      try {
        await fn(event);
      } catch (error) {
        message(error.message);
        console.error("存档工作区操作失败", error);
      }
    };
    mounted.querySelector("#saveStudentForm").addEventListener(
      "submit",
      handle(async (event) => {
        event.preventDefault();
        const name = mounted.querySelector("#saveStudentName"),
          number = mounted.querySelector("#saveStudentNumber");
        const editing = event.target.dataset.editing;
        const result = await SaveManager.edit(
          editing ? "编辑学生" : "新增学生",
          (doc) =>
            editing
              ? SaveRoster.editStudent(doc, editing, {
                  displayName: name.value,
                  number: number.value,
                })
              : SaveRoster.addStudent(doc, {
                  displayName: name.value,
                  number: number.value,
                }),
        );
        if (!result.ok || !result.persisted)
          throw Error(result.error || "未保存");
        name.value = "";
        number.value = "";
        delete event.target.dataset.editing;
        mounted.querySelector("#saveStudentAdd").textContent = "新增学生";
        render();
      }),
    );
    mounted.addEventListener(
      "click",
      handle(async (event) => {
        const button = event.target.closest("button");
        if (!button) return;
        if (
          button.hasAttribute("data-save-trash") ||
          button.hasAttribute("data-save-restore")
        ) {
          const trash = button.hasAttribute("data-save-trash"),
            select = mounted.querySelector(
              trash ? "[data-save-inactive]" : "[data-save-trash-list]",
            ),
            option = select.selectedOptions[0];
          if (!select.value) throw Error("请先选择存档");
          const id = select.value,
            revision = Number(option.dataset.revision),
            context = SaveManager.context();
          if (
            trash &&
            !(await themeConfirm(
              `将「${option.textContent}」移入回收站？原文件和头像将保留，可以恢复。`,
              { title: "移除存档", danger: true, confirmText: "移入回收站" },
            ))
          )
            return;
          const result = await SaveManager.setTrashed(id, trash, {
            context,
            revision,
          });
          if (!result.ok)
            throw Error(result.error || result.message || result.code);
          message(
            trash
              ? "已移入回收站，原文件仍保留。"
              : "存档已恢复，可以切换使用。",
          );
        }
        if (button.hasAttribute("data-save-retry")) {
          await SaveManager.retry();
          lastRoster = "";
          await render();
        }
        if (button.dataset.avatarId) {
          avatarTarget = {
            type: button.dataset.avatarType,
            id: button.dataset.avatarId,
            context: SaveManager.context(),
          };
          mounted.querySelector("[data-avatar-file]").click();
        }
        if (button.dataset.editStudent)
          await editStudent(button.dataset.editStudent);
        if (button.dataset.members) openMembers(button.dataset.members);
        if (button.hasAttribute("data-save-import"))
          mounted.querySelector("[data-save-file]").click();
        if (button.hasAttribute("data-batch-avatar")) {
          batchContext = SaveManager.context();
          mounted.querySelector("[data-batch-file]").click();
        }
        if (
          button.hasAttribute("data-save-new") ||
          button.hasAttribute("data-save-copy")
        ) {
          const result = await SaveManager.create({
            name: mounted.querySelector("[data-save-name]").value || "新课堂",
            copy: button.hasAttribute("data-save-copy"),
          });
          if (!result.ok)
            throw Error(result.error || result.message || result.code);
          lastRoster = "";
          await render();
        }
        if (button.hasAttribute("data-save-rename")) {
          const result = await SaveManager.rename(
            mounted.querySelector("[data-save-name]").value,
          );
          if (!result.ok)
            throw Error(result.error || result.message || result.code);
          lastRoster = "";
          await render();
        }
        if (button.hasAttribute("data-save-export"))
          download(
            await SaveManager.exportCurrent(),
            SaveManager.snapshot().name + ".godpower-save.json",
          );
        if (button.hasAttribute("data-member-close"))
          mounted.querySelector("[data-member-editor]").hidden = true;
        if (button.hasAttribute("data-member-save")) {
          const panel = mounted.querySelector("[data-member-editor]");
          if (panel.dataset.saveId !== SaveManager.snapshot().saveId)
            throw Error("存档已切换，请重新选择");
          const ids = [...panel.querySelectorAll("input:checked")].map(
            (i) => i.value,
          );
          const result = await SaveManager.edit("调整小组成员", (doc) =>
            SaveRoster.assign(doc, panel.dataset.groupUid, ids),
          );
          if (!result.ok || !result.persisted)
            throw Error(result.error || "未保存");
          panel.hidden = true;
          render();
        }
      }),
    );
    mounted.querySelector("[data-avatar-file]").addEventListener(
      "change",
      handle(async (event) => {
        const files = [...event.target.files];
        event.target.value = "";
        if (files.length) await setAvatarFiles(files, avatarTarget);
      }),
    );
    mounted.querySelector("[data-batch-file]").addEventListener(
      "change",
      handle(async (event) => {
        const files = [...event.target.files];
        event.target.value = "";
        if (files.length) await setAvatarFiles(files, null);
      }),
    );
    mounted.querySelector("[data-save-file]").addEventListener(
      "change",
      handle(async (event) => {
        const file = event.target.files[0];
        event.target.value = "";
        if (!file) return;
        if (file.size > 128 * 1024 * 1024) throw Error("存档文件超过128MB");
        const preview = await SaveManager.previewSource(
          await file.text(),
          file.name.replace(/\.json$/, ""),
        );
        const info = preview.report;
        if (
          !(await themeConfirm(
            `导入 ${preview.documents.length} 份存档、${info.students} 名学生。当前存档会保留，成功保存后切换。`,
            { title: "导入存档", confirmText: "导入并切换" },
          ))
        )
          return;
        const result = await SaveManager.importSource(preview);
        if (!result.ok)
          throw Error(result.error || result.message || result.code);
        lastRoster = "";
        render();
      }),
    );
    mounted.querySelector("[data-save-select]").addEventListener(
      "change",
      handle(async (event) => {
        const result = await SaveManager.switchTo(event.target.value);
        if (!result.ok)
          throw Error(result.error || result.message || result.code);
        lastRoster = "";
        render();
      }),
    );
    root.addEventListener("godpower:save-status", render);
    root.addEventListener("godpower:save-library-changed", () => {
      lastRoster = "";
      render();
    });
    root.addEventListener("pagehide", revoke, { once: true });
    SaveManager.ready().then(render);
    return mounted;
  }
  root.SaveWorkspace = Object.freeze({ mount, openMembers });
})(globalThis);
