(function installClassroomRosterWorkspace(root) {
  "use strict";
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const text = (tag, value, className = "") => {
    const element = document.createElement(tag);
    element.textContent = value;
    if (className) element.className = className;
    return element;
  };

  function mount(host, { storage = localStorage, getGroups }) {
    if (!host || typeof getGroups !== "function")
      throw new TypeError(
        "roster workspace host and group source are required",
      );
    const repository =
      root.ClassroomRosterRepository.createClassroomRosterRepository({
        storage,
      });
    const section = document.createElement("section");
    section.id = "classroomRosterWorkspace";
    section.className = "ui-settings-group roster-workspace";
    section.innerHTML = `<h4>课堂名单工作区</h4><p class="ui-muted">本地档案用于整理教师、课堂与稳定学号。编辑和保存不会修改当前比赛；应用到比赛时仅更新成员姓名，其他比赛数据保持不变。</p><div class="roster-workspace-toolbar"><label>教师档案<select id="rosterProfileSelect" aria-label="教师档案"></select></label><label>课堂<select id="rosterClassroomSelect" aria-label="课堂"></select></label><button type="button" class="btn" id="rosterAddProfile">新增教师档案</button><button type="button" class="btn" id="rosterCreateFromLive">从当前比赛创建副本</button><button type="button" class="btn" id="rosterExport">导出名单</button><label class="btn roster-import-label">导入名单<input id="rosterImport" type="file" accept=".json,application/json" hidden></label></div><div id="rosterProfileForm" class="roster-profile-form" hidden><label>档案名称<input id="rosterProfileName" maxlength="80" autocomplete="off"></label><button type="button" class="btn btn-primary" id="rosterSaveProfile">创建档案</button><button type="button" class="btn" id="rosterCancelProfile">取消</button></div><div class="roster-table-wrap"><table class="roster-table"><thead><tr><th>学生姓名</th><th>小组归属</th><th aria-label="操作"></th></tr></thead><tbody id="rosterStudentRows"></tbody></table></div><div class="roster-workspace-footer"><button type="button" class="btn" id="rosterAddStudent">添加学生</button><button type="button" class="btn" id="rosterSave">保存名单</button><button type="button" class="btn btn-primary" id="rosterPreviewApply">预览并应用到比赛</button></div><p id="rosterStatus" class="ui-muted" role="status" aria-live="polite">尚未创建本地课堂名单。</p>`;
    host.append(section);

    const profileSelect = section.querySelector("#rosterProfileSelect");
    const classroomSelect = section.querySelector("#rosterClassroomSelect");
    const modeSelect = document.createElement("select");
    modeSelect.id = "rosterAssignmentMode";
    modeSelect.setAttribute("aria-label", "参与模式");
    modeSelect.innerHTML =
      '<option value="group">按小组参与</option><option value="individual">个人参与</option>';
    const modeLabel = document.createElement("label");
    modeLabel.append(text("span", "参与模式"), modeSelect);
    section
      .querySelector(".roster-workspace-toolbar")
      .insertBefore(modeLabel, section.querySelector("#rosterAddProfile"));
    const addClassroom = text("button", "新增课堂", "btn");
    addClassroom.type = "button";
    addClassroom.id = "rosterAddClassroom";
    section
      .querySelector(".roster-workspace-toolbar")
      .insertBefore(
        addClassroom,
        section.querySelector("#rosterCreateFromLive"),
      );
    const classroomForm = document.createElement("div");
    classroomForm.id = "rosterClassroomForm";
    classroomForm.className = "roster-profile-form";
    classroomForm.hidden = true;
    classroomForm.innerHTML =
      '<label>课堂名称<input id="rosterClassroomName" maxlength="100" autocomplete="off"></label><button type="button" class="btn btn-primary" id="rosterSaveClassroom">创建课堂</button><button type="button" class="btn" id="rosterCancelClassroom">取消</button>';
    section.querySelector(".roster-workspace-toolbar").after(classroomForm);
    const rows = section.querySelector("#rosterStudentRows");
    const status = section.querySelector("#rosterStatus");
    let documentData = null;
    let revision = 0;
    let selectedProfile = "";
    let selectedClassroom = "";
    let activeClassroomContext = null;
    try {
      const savedContext = JSON.parse(
        storage.getItem("godpower_active_classroom_context_v1") || "null",
      );
      if (
        savedContext?.schemaVersion === 1 &&
        root.StableIdentity.isValidUserProfileId(savedContext.userProfileId) &&
        root.StableIdentity.isValidClassroomId(savedContext.classroomId)
      )
        activeClassroomContext = savedContext;
    } catch (_) {
      activeClassroomContext = null;
    }

    function setStatus(message, error = false) {
      status.textContent = message;
      status.dataset.state = error ? "error" : "ok";
    }
    function writeDocument(next, message = "名单已保存") {
      const result = repository.write(next, { expectedRevision: revision });
      if (!result.ok) {
        setStatus(`保存失败：${result.message || result.code}`, true);
        return false;
      }
      documentData = result.rosterData;
      revision = result.revision;
      render();
      setStatus(message);
      return true;
    }
    function assignmentFor(profileId, classroomId) {
      let assignment = documentData.assignments.find(
        (item) =>
          item.userProfileId === profileId && item.classroomId === classroomId,
      );
      if (!assignment) {
        assignment = {
          userProfileId: profileId,
          classroomId,
          mode: "group",
          groupAssignments: [],
        };
        documentData.assignments.push(assignment);
      }
      return assignment;
    }
    function renderRows() {
      rows.replaceChildren();
      const classroom = documentData?.classrooms.find(
        (item) => item.classroomId === selectedClassroom,
      );
      if (!classroom) return;
      const studentMap = new Map(
        documentData.students.map((student) => [student.studentUid, student]),
      );
      const assignment = assignmentFor(selectedProfile, selectedClassroom);
      modeSelect.value = assignment.mode;
      const assigned = new Map(
        assignment.groupAssignments.map((item) => [
          item.studentUid,
          item.groupUid,
        ]),
      );
      const groups = getGroups().map((group, index) => ({
        id: group.groupUid,
        label: group.name || `第 ${index + 1} 组`,
      }));
      for (const studentUid of classroom.studentIds) {
        const student = studentMap.get(studentUid);
        if (!student) continue;
        const row = document.createElement("tr");
        row.dataset.studentUid = studentUid;
        const nameCell = document.createElement("td");
        const name = document.createElement("input");
        name.className = "roster-student-name";
        name.setAttribute("aria-label", `${student.displayName} 姓名`);
        name.maxLength = 120;
        name.value = student.displayName;
        nameCell.append(name);
        const groupCell = document.createElement("td");
        const group = document.createElement("select");
        group.className = "roster-student-group";
        group.setAttribute("aria-label", `${student.displayName} 小组`);
        group.append(new Option("未分组", ""));
        for (const item of groups)
          group.append(new Option(item.label, item.id));
        group.value = assigned.get(studentUid) || "";
        if (assignment.mode === "individual") {
          group.replaceChildren(new Option("个人参与", ""));
          group.disabled = true;
        }
        groupCell.append(group);
        const actionCell = document.createElement("td");
        const remove = text("button", "移除", "btn btn-sm btn-danger");
        remove.type = "button";
        remove.setAttribute("aria-label", `移除 ${student.displayName}`);
        remove.onclick = () => {
          classroom.studentIds = classroom.studentIds.filter(
            (id) => id !== studentUid,
          );
          documentData.students = documentData.students.filter(
            (item) => item.studentUid !== studentUid,
          );
          assignment.groupAssignments = assignment.groupAssignments.filter(
            (item) => item.studentUid !== studentUid,
          );
          renderRows();
          setStatus("有未保存的名单更改");
        };
        actionCell.append(remove);
        row.append(nameCell, groupCell, actionCell);
        rows.append(row);
      }
    }
    function render() {
      const read = repository.read();
      if (!read.ok) {
        setStatus("本地名单数据无法读取，请先导出或恢复有效备份。", true);
        return;
      }
      documentData =
        read.rosterData || root.ClassroomRoster.createRosterDocument({});
      revision = read.revision;
      profileSelect.replaceChildren();
      classroomSelect.replaceChildren();
      for (const profile of documentData.profiles)
        profileSelect.append(
          new Option(profile.displayName, profile.userProfileId),
        );
      for (const classroom of documentData.classrooms)
        classroomSelect.append(
          new Option(classroom.name, classroom.classroomId),
        );
      selectedProfile = documentData.profiles.some(
        (item) => item.userProfileId === selectedProfile,
      )
        ? selectedProfile
        : documentData.profiles.some(
              (item) =>
                item.userProfileId === activeClassroomContext?.userProfileId,
            )
          ? activeClassroomContext.userProfileId
          : documentData.profiles[0]?.userProfileId || "";
      selectedClassroom = documentData.classrooms.some(
        (item) => item.classroomId === selectedClassroom,
      )
        ? selectedClassroom
        : documentData.classrooms.some(
              (item) =>
                item.classroomId === activeClassroomContext?.classroomId,
            )
          ? activeClassroomContext.classroomId
          : documentData.classrooms[0]?.classroomId || "";
      profileSelect.value = selectedProfile;
      classroomSelect.value = selectedClassroom;
      const hasRoster = Boolean(selectedProfile && selectedClassroom);
      modeSelect.disabled = !hasRoster;
      section.querySelector("#rosterAddClassroom").disabled = !selectedProfile;
      section.querySelector("#rosterAddStudent").disabled = !hasRoster;
      section.querySelector("#rosterSave").disabled = !hasRoster;
      section.querySelector("#rosterExport").disabled = !hasRoster;
      section.querySelector("#rosterPreviewApply").disabled =
        !hasRoster || !getGroups().length;
      renderRows();
    }
    function serializeRows() {
      const classroom = documentData.classrooms.find(
        (item) => item.classroomId === selectedClassroom,
      );
      const assignment = assignmentFor(selectedProfile, selectedClassroom);
      assignment.mode = modeSelect.value;
      const names = new Map();
      const memberships = new Map();
      for (const row of rows.querySelectorAll("tr")) {
        const studentUid = row.dataset.studentUid;
        const displayName = row.querySelector("input").value.trim();
        if (!displayName) throw new TypeError("学生姓名不能为空");
        names.set(studentUid, displayName);
        const groupUid = row.querySelector("select").value;
        if (groupUid && assignment.mode === "group")
          memberships.set(studentUid, groupUid);
      }
      documentData.students = documentData.students.map((student) =>
        names.has(student.studentUid)
          ? { ...student, displayName: names.get(student.studentUid) }
          : student,
      );
      assignment.groupAssignments = [...memberships].map(
        ([studentUid, groupUid]) => ({ studentUid, groupUid }),
      );
      classroom.studentIds = [...rows.querySelectorAll("tr")].map(
        (row) => row.dataset.studentUid,
      );
      documentData.assignments = documentData.assignments.filter(
        (item) =>
          item.userProfileId !== selectedProfile ||
          item.classroomId !== selectedClassroom,
      );
      documentData.assignments.push(assignment);
      return root.ClassroomRoster.validateRosterDocument(documentData);
    }
    function download() {
      const payload = JSON.stringify(documentData, null, 2);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(
        new Blob([payload], { type: "application/json" }),
      );
      link.download = "上帝的力量-课堂名单.json";
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    }

    function closeApplyPreview() {
      const overlay = document.getElementById("rosterApplyPreview");
      if (!overlay) return;
      if (overlay._onKeydown)
        document.removeEventListener("keydown", overlay._onKeydown);
      overlay.remove();
      section.querySelector("#rosterPreviewApply")?.focus();
    }
    function openApplyPreview() {
      if (state.isLocked) {
        openPwdModal();
        return;
      }
      if (!ClassroomWriteBarrier.allow()) return;
      if (!selectedProfile || !selectedClassroom) {
        setStatus("请先选择教师档案和课堂名单。", true);
        return;
      }
      const persisted = repository.read();
      if (!persisted.ok || !persisted.rosterData) {
        setStatus("名单档案尚未可靠保存，不能应用到正式比赛。", true);
        return;
      }
      let workingRoster;
      try {
        const liveDocument = documentData;
        documentData = clone(documentData);
        try {
          workingRoster = serializeRows();
        } finally {
          documentData = liveDocument;
        }
        if (
          JSON.stringify(workingRoster) !== JSON.stringify(persisted.rosterData)
        ) {
          setStatus("名单有未保存的编辑，请先保存再预览应用。", true);
          return;
        }
        const liveGroups = getGroups();
        const plan = root.ClassroomRoster.planCompetitionMemberUpdate({
          groups: liveGroups,
          rosterData: persisted.rosterData,
          userProfileId: selectedProfile,
          classroomId: selectedClassroom,
        });
        if (!plan.changedGroups) {
          setStatus("比赛成员与此课堂名单一致，无需应用。", false);
          return;
        }
        const stateFingerprint = JSON.stringify(state);
        const stateReference = state;
        const selection = {
          profileId: selectedProfile,
          classroomId: selectedClassroom,
        };
        const rosterBytes = storage.getItem(repository.key);
        const snapshot = Object.freeze({
          plan,
          stateFingerprint,
          stateReference,
          seasonId: state.seasonId,
          selection,
          rosterBytes,
          revision: persisted.revision,
          before: JSON.stringify(buildClassroomBackup()),
        });
        const overlay = document.createElement("div");
        overlay.id = "rosterApplyPreview";
        overlay.className = "roster-apply-backdrop";
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute("aria-labelledby", "rosterApplyTitle");
        const changed = plan.groupChanges.filter((item) => item.changed);
        const rowsHtml = plan.groupChanges
          .map(
            (item) =>
              `<tr><th>${root.escapeHtml(item.groupName)}</th><td>${root.escapeHtml(item.before.join("、") || "（无）")}</td><td>${root.escapeHtml(item.after.join("、") || "（无）")}</td><td>${item.changed ? "将更新" : "不变"}</td></tr>`,
          )
          .join("");
        overlay.innerHTML = `<section class="roster-apply-card"><button type="button" class="ui-window-close" id="rosterApplyClose" aria-label="关闭">❌</button><p class="ui-eyebrow">正式比赛数据预览</p><h3 id="rosterApplyTitle">应用课堂名单</h3><p>仅按稳定小组 ID 更新成员姓名。小组顺序、积分、道具、答题与回合状态保持不变。</p><div class="roster-apply-summary">将变更 ${changed.length} / ${plan.groupChanges.length} 个小组 · ${plan.beforeMemberCount} 名 → ${plan.afterMemberCount} 名</div><div class="roster-apply-table-wrap"><table class="roster-apply-table"><thead><tr><th>小组</th><th>比赛当前成员</th><th>名单应用后</th><th>结果</th></tr></thead><tbody>${rowsHtml}</tbody></table></div><p class="roster-apply-warning">继续后会将此变更记录到操作历史。若保存失败，比赛状态会自动回滚；本地名单档案不会被修改。应用后仍可通过“历史”撤销。</p><div class="roster-apply-actions"><button type="button" class="btn" id="rosterApplyCancel">取消</button><button type="button" class="btn btn-primary" id="rosterApplyConfirm">确认应用</button></div></section>`;
        document.body.append(overlay);
        const closeButton = overlay.querySelector("#rosterApplyClose");
        overlay.querySelector("#rosterApplyCancel").onclick = closeApplyPreview;
        closeButton.onclick = closeApplyPreview;
        overlay.addEventListener("click", (event) => {
          if (event.target === overlay) closeApplyPreview();
        });
        const onKeydown = (event) => {
          if (
            event.key === "Escape" &&
            document.getElementById("rosterApplyPreview") === overlay
          ) {
            event.preventDefault();
            closeApplyPreview();
            document.removeEventListener("keydown", onKeydown);
          }
        };
        overlay._onKeydown = onKeydown;
        document.addEventListener("keydown", onKeydown);
        closeButton.focus();
        overlay.querySelector("#rosterApplyConfirm").onclick = async (
          event,
        ) => {
          const confirmButton = event.currentTarget;
          if (confirmButton.disabled) return;
          confirmButton.disabled = true;
          const confirmed = await root.themeConfirm(
            `即将更新 ${changed.length} 个小组的成员名单。比赛积分、道具与回合状态不变，且本次操作可从历史撤销。`,
            {
              title: "确认应用课堂名单",
              danger: true,
              confirmText: "应用名单",
            },
          );
          if (!confirmed) {
            if (document.getElementById("rosterApplyPreview") === overlay)
              confirmButton.disabled = false;
            return;
          }
          closeApplyPreview();
          document.removeEventListener("keydown", onKeydown);
          const latest = repository.read();
          const stillCurrent = () =>
            state === snapshot.stateReference &&
            state.seasonId === snapshot.seasonId &&
            JSON.stringify(state) === snapshot.stateFingerprint &&
            selectedProfile === snapshot.selection.profileId &&
            selectedClassroom === snapshot.selection.classroomId &&
            storage.getItem(repository.key) === snapshot.rosterBytes &&
            latest.ok;
          if (!stillCurrent() || latest.revision !== snapshot.revision) {
            setStatus("预览已过期：比赛或名单已变化，请重新预览。", true);
            return;
          }
          if (!ClassroomWriteBarrier.allow()) return;
          if (state.isLocked) {
            openPwdModal();
            return;
          }
          const accepted = runClassroomCommand(
            `应用课堂名单：${documentData.classrooms.find((item) => item.classroomId === selectedClassroom)?.name || "课堂"}`,
            () => {
              const currentRoster = repository.read();
              if (
                !stillCurrent() ||
                !currentRoster.ok ||
                currentRoster.revision !== snapshot.revision ||
                storage.getItem(repository.key) !== snapshot.rosterBytes
              )
                throw new Error("预览已过期：比赛或名单已变化，请重新预览");
              for (const change of snapshot.plan.groupChanges) {
                const group = state.groups.find(
                  (item) => item.groupUid === change.groupUid,
                );
                if (!group) throw new Error("小组结构已变化，请重新预览");
                group.members = [...change.after];
              }
              return true;
            },
            { source: "manual", retainOnPersistenceFailure: false },
          );
          if (!accepted) {
            setStatus("应用失败，比赛状态已回滚。请检查存储空间后重试。", true);
            return;
          }
          const outcome = await classroomCommands.whenIdle();
          if (!outcome?.ok || outcome.persisted !== true) {
            setStatus(
              `应用失败，比赛状态已回滚：${outcome?.error || "未收到持久化确认"}`,
              true,
            );
            return;
          }
          setStatus(
            `名单已应用到比赛（${changed.length} 个小组有变化）；积分、道具与回合状态未改变。`,
          );
        };
      } catch (error) {
        setStatus(`无法生成名单预览：${error.message}`, true);
      }
    }

    profileSelect.onchange = () => {
      selectedProfile = profileSelect.value;
      renderRows();
      setStatus("已切换教师档案；更改仍需手动保存");
    };
    classroomSelect.onchange = () => {
      selectedClassroom = classroomSelect.value;
      renderRows();
      setStatus("已切换课堂；更改仍需手动保存");
    };
    modeSelect.onchange = () => {
      const assignment = assignmentFor(selectedProfile, selectedClassroom);
      assignment.mode = modeSelect.value;
      if (assignment.mode === "individual") assignment.groupAssignments = [];
      renderRows();
      setStatus("参与模式已更改，保存后生效");
    };
    section.querySelector("#rosterCreateFromLive").onclick = () => {
      if (documentData.profiles.length || documentData.classrooms.length) {
        setStatus(
          "已有本地名单；请使用导入或新增档案，不会覆盖已有数据。",
          true,
        );
        return;
      }
      try {
        const groups = root.StableIdentity.assignGroupUids(getGroups());
        const migrated = repository.previewMigration({
          classroomId: root.StableIdentity.createClassroomId(),
          userProfileId: root.StableIdentity.createUserProfileId(),
          classroomName: "当前课堂副本",
          profileName: "教师",
          groups,
        });
        writeDocument(
          migrated,
          "已从当前比赛创建本地副本；可编辑后保存。比赛数据未更改。",
        );
      } catch (error) {
        setStatus(`创建副本失败：${error.message}`, true);
      }
    };
    section.querySelector("#rosterAddProfile").onclick = () => {
      section.querySelector("#rosterProfileForm").hidden = false;
      section.querySelector("#rosterProfileName").focus();
    };
    addClassroom.onclick = () => {
      classroomForm.hidden = false;
      section.querySelector("#rosterClassroomName").focus();
    };
    section.querySelector("#rosterCancelClassroom").onclick = () => {
      classroomForm.hidden = true;
    };
    section.querySelector("#rosterSaveClassroom").onclick = () => {
      const name = section.querySelector("#rosterClassroomName").value.trim();
      if (!name) return setStatus("请输入课堂名称。", true);
      const next = clone(documentData);
      const classroomId = root.StableIdentity.createClassroomId();
      next.classrooms.push({ classroomId, name, studentIds: [] });
      next.assignments.push({
        userProfileId: selectedProfile,
        classroomId,
        mode: "group",
        groupAssignments: [],
      });
      if (writeDocument(next, "课堂已创建。")) {
        selectedClassroom = classroomId;
        section.querySelector("#rosterClassroomName").value = "";
        classroomForm.hidden = true;
        render();
      }
    };
    section.querySelector("#rosterCancelProfile").onclick = () => {
      section.querySelector("#rosterProfileForm").hidden = true;
    };
    section.querySelector("#rosterSaveProfile").onclick = () => {
      const name = section.querySelector("#rosterProfileName").value.trim();
      if (!name) return setStatus("请输入教师档案名称。", true);
      const next = clone(documentData);
      const userProfileId = root.StableIdentity.createUserProfileId();
      next.profiles.push({ userProfileId, displayName: name, subjectId: null });
      if (selectedClassroom)
        next.assignments.push({
          userProfileId,
          classroomId: selectedClassroom,
          mode: "group",
          groupAssignments: [],
        });
      if (writeDocument(next, "教师档案已创建。")) {
        selectedProfile = userProfileId;
        section.querySelector("#rosterProfileName").value = "";
        section.querySelector("#rosterProfileForm").hidden = true;
        render();
      }
    };
    section.querySelector("#rosterAddStudent").onclick = () => {
      const classroom = documentData.classrooms.find(
        (item) => item.classroomId === selectedClassroom,
      );
      if (!classroom) return;
      const studentUid = root.StableIdentity.createStudentUid();
      documentData.students.push({
        studentUid,
        classroomId: selectedClassroom,
        displayName: "新学生",
        number: null,
        avatarResourceId: null,
      });
      classroom.studentIds.push(studentUid);
      renderRows();
      const added = rows.lastElementChild?.querySelector("input");
      added?.focus();
      added?.select();
      setStatus("有未保存的名单更改");
    };
    section.querySelector("#rosterSave").onclick = () => {
      try {
        writeDocument(serializeRows());
      } catch (error) {
        setStatus(`名单未保存：${error.message}`, true);
      }
    };
    section.querySelector("#rosterExport").onclick = download;
    section.querySelector("#rosterPreviewApply").onclick = openApplyPreview;
    section.querySelector("#rosterImport").onchange = async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const imported = root.ClassroomRoster.validateRosterDocument(
          JSON.parse(await file.text()),
        );
        if (
          (documentData.profiles.length ||
            documentData.classrooms.length ||
            documentData.students.length) &&
          !root.confirm(
            "导入名单将替换本地名单档案。请确认已导出现有备份。继续？",
          )
        )
          return;
        if (writeDocument(imported, "名单已校验并导入。"))
          setStatus("名单已校验并导入。当前比赛数据未更改。");
      } catch (error) {
        setStatus(`导入失败，现有数据未更改：${error.message}`, true);
      } finally {
        event.target.value = "";
      }
    };
    root.addEventListener("godpower:active-classroom-changed", (event) => {
      activeClassroomContext = event.detail;
      selectedProfile = event.detail.userProfileId;
      selectedClassroom = event.detail.classroomId;
      render();
    });
    render();
    return Object.freeze({ refresh: render, repository });
  }

  root.ClassroomRosterWorkspace = Object.freeze({ mount });
})(globalThis);
