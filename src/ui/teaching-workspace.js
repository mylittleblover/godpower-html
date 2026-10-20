(function installTeachingWorkspace(root) {
  "use strict";
  const ACTIVE_CLASSROOM_KEY = "godpower_active_classroom_context_v1";
  const DAY_NAMES = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ];
  const id = (host, value) => host.querySelector(`#${value}`);
  const text = (tag, value, className = "") => {
    const element = document.createElement(tag);
    element.textContent = value;
    if (className) element.className = className;
    return element;
  };
  const toMinute = (value) => {
    const [hour, minute] = value.split(":").map(Number);
    return hour * 60 + minute;
  };
  const toTime = (value) =>
    `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
  const refreshers = new Set();

  function mount(
    host,
    { storage = localStorage, getNow = () => new Date() } = {},
  ) {
    if (!host) throw new TypeError("teaching workspace host is required");
    const rosterRepository =
      root.ClassroomRosterRepository.createClassroomRosterRepository({
        storage,
      });
    const scheduleRepository =
      root.TeachingScheduleRepository.createTeachingScheduleRepository({
        storage,
      });
    const section = document.createElement("section");
    section.id = "teachingScheduleWorkspace";
    section.className = "ui-settings-group teaching-schedule-workspace";
    section.innerHTML = `<h4>每周课程表</h4><p class="ui-muted">课程时间按本机时钟显示建议；不会自动切换课堂，也不会改写正式比赛数据。</p><div class="teaching-current"><span id="teachingCurrentLesson" role="status">尚无可用课程安排</span><button id="teachingUseCurrent" type="button" class="btn" disabled>设为本机教学课堂</button><button id="teachingRefreshNow" type="button" class="btn">刷新当前时间</button></div><div class="teaching-schedule-toolbar"><label>教师档案<select id="teachingProfile" aria-label="课程表教师档案"></select></label></div><div class="teaching-schedule-form"><label>课堂<select id="teachingClassroom" aria-label="课程安排课堂"></select></label><label>星期<select id="teachingWeekday" aria-label="星期">${DAY_NAMES.map((name, day) => `<option value="${day}">${name}</option>`).join("")}</select></label><label>开始<input id="teachingStart" type="time" value="08:00"></label><label>结束<input id="teachingEnd" type="text" inputmode="numeric" pattern="(?:[01]\\d|2[0-3]):[0-5]\\d|24:00" value="08:45" aria-label="结束时间，可填24:00"></label><label>学科<input id="teachingSubject" maxlength="80" placeholder="例如：政治"></label><label>备注<input id="teachingNote" maxlength="500" placeholder="可选"></label><button id="teachingAddSlot" type="button" class="btn btn-primary">添加时段</button></div><div class="teaching-schedule-list" id="teachingScheduleList"></div><div class="teaching-schedule-actions"><button id="teachingSaveSchedule" type="button" class="btn btn-primary">保存课程表</button><span id="teachingScheduleStatus" class="ui-muted" role="status" aria-live="polite">本机保存</span></div><p class="ui-muted">更换教学上下文仅更新本机课堂选择提示。课堂名单与正式比赛小组之间尚未启用自动映射。</p>`;
    host.append(section);

    let rosterResult = null;
    let schedule = null;
    let revision = 0;
    let profileId = "";
    let editingScheduleId = "";

    function setStatus(message, error = false) {
      const element = id(section, "teachingScheduleStatus");
      element.textContent = message;
      element.dataset.state = error ? "error" : "ok";
    }
    function currentEntries() {
      return schedule.entries.filter(
        (entry) => entry.userProfileId === profileId,
      );
    }
    function cancelEdit() {
      editingScheduleId = "";
      id(section, "teachingAddSlot").textContent = "添加时段";
    }
    function refreshCurrent() {
      const now = getNow();
      let match = null;
      if (profileId && schedule)
        match = root.TeachingSchedule.findCurrentLesson(
          schedule,
          profileId,
          now.getDay(),
          now.getHours() * 60 + now.getMinutes(),
        );
      const classroom = rosterResult?.rosterData?.classrooms.find(
        (entry) => entry.classroomId === match?.classroomId,
      );
      id(section, "teachingCurrentLesson").textContent = match
        ? `当前建议：${classroom?.name || "课堂已删除"} · ${match.subjectId} · ${toTime(match.startMinute)}–${toTime(match.endMinute)}`
        : `现在没有安排课程 · ${DAY_NAMES[now.getDay()]} ${toTime(now.getHours() * 60 + now.getMinutes())}`;
      id(section, "teachingUseCurrent").disabled = !match || !classroom;
      id(section, "teachingUseCurrent").onclick = () => {
        if (!match || !classroom) return;
        const value = JSON.stringify({
          schemaVersion: 1,
          userProfileId: profileId,
          classroomId: classroom.classroomId,
          sourceScheduleId: match.scheduleId,
        });
        try {
          storage.setItem(ACTIVE_CLASSROOM_KEY, value);
          if (storage.getItem(ACTIVE_CLASSROOM_KEY) !== value)
            throw new Error("本机课堂上下文读回不一致");
          root.dispatchEvent(
            new CustomEvent("godpower:active-classroom-changed", {
              detail: JSON.parse(value),
            }),
          );
          setStatus(`本机教学课堂已设为“${classroom.name}”；比赛数据未更改。`);
        } catch (error) {
          setStatus(`课堂上下文未切换：${error.message}`, true);
        }
      };
    }
    function renderList() {
      const hostList = id(section, "teachingScheduleList");
      hostList.replaceChildren();
      const entries = currentEntries();
      if (!entries.length) {
        hostList.append(text("p", "此教师档案尚无课程安排。", "ui-muted"));
        refreshCurrent();
        return;
      }
      const table = document.createElement("table");
      table.className = "teaching-schedule-table";
      const header = document.createElement("tr");
      for (const label of ["星期", "时间", "学科", "课堂", "备注", "操作"])
        header.append(text("th", label));
      const thead = document.createElement("thead");
      thead.append(header);
      const tbody = document.createElement("tbody");
      for (const entry of entries) {
        const row = document.createElement("tr");
        const classroom = rosterResult.rosterData.classrooms.find(
          (item) => item.classroomId === entry.classroomId,
        );
        row.append(
          text("td", DAY_NAMES[entry.weekday]),
          text("td", `${toTime(entry.startMinute)}–${toTime(entry.endMinute)}`),
          text("td", entry.subjectId),
          text("td", classroom?.name || "课堂已删除"),
          text("td", entry.note || "—"),
        );
        const action = document.createElement("td");
        const edit = text("button", "编辑", "btn btn-sm");
        edit.type = "button";
        edit.setAttribute(
          "aria-label",
          `编辑${DAY_NAMES[entry.weekday]} ${entry.subjectId}`,
        );
        edit.onclick = () => {
          editingScheduleId = entry.scheduleId;
          id(section, "teachingClassroom").value = entry.classroomId;
          id(section, "teachingWeekday").value = String(entry.weekday);
          id(section, "teachingStart").value = toTime(entry.startMinute);
          id(section, "teachingEnd").value = toTime(entry.endMinute);
          id(section, "teachingSubject").value = entry.subjectId;
          id(section, "teachingNote").value = entry.note;
          id(section, "teachingAddSlot").textContent = "保存修改";
          id(section, "teachingStart").focus();
        };
        const remove = text("button", "删除", "btn btn-sm btn-danger");
        remove.type = "button";
        remove.setAttribute(
          "aria-label",
          `删除${DAY_NAMES[entry.weekday]} ${entry.subjectId}`,
        );
        remove.onclick = () => {
          schedule.entries = schedule.entries.filter(
            (item) => item.scheduleId !== entry.scheduleId,
          );
          if (editingScheduleId === entry.scheduleId) cancelEdit();
          renderList();
          setStatus("有未保存的课程安排更改");
        };
        action.append(edit, remove);
        row.append(action);
        tbody.append(row);
      }
      table.append(thead, tbody);
      hostList.append(table);
      refreshCurrent();
    }
    function fillProfilesAndClasses() {
      const profile = id(section, "teachingProfile");
      const classroom = id(section, "teachingClassroom");
      const previousProfile = profile.value || profileId;
      profile.replaceChildren();
      classroom.replaceChildren();
      for (const item of rosterResult.rosterData?.profiles || [])
        profile.append(new Option(item.displayName, item.userProfileId));
      for (const item of rosterResult.rosterData?.classrooms || [])
        classroom.append(new Option(item.name, item.classroomId));
      profileId = (rosterResult.rosterData?.profiles || []).some(
        (item) => item.userProfileId === previousProfile,
      )
        ? previousProfile
        : rosterResult.rosterData?.profiles[0]?.userProfileId || "";
      profile.value = profileId;
      profile.disabled = !profileId;
      classroom.disabled = !classroom.options.length;
      id(section, "teachingAddSlot").disabled =
        classroom.disabled || !profileId;
      if (!profileId)
        id(section, "teachingCurrentLesson").textContent =
          "请先在名单工作区创建教师档案和课堂。";
    }
    function refresh() {
      rosterResult = rosterRepository.read();
      const scheduleResult = scheduleRepository.read();
      if (!rosterResult.ok || !scheduleResult.ok) {
        setStatus("本地课程数据无法读取；没有覆盖任何已有数据。", true);
        return;
      }
      schedule = scheduleResult.schedule;
      revision = scheduleResult.revision;
      fillProfilesAndClasses();
      renderList();
    }

    id(section, "teachingProfile").onchange = () => {
      profileId = id(section, "teachingProfile").value;
      renderList();
    };
    id(section, "teachingRefreshNow").onclick = refreshCurrent;
    id(section, "teachingAddSlot").onclick = () => {
      const classroomId = id(section, "teachingClassroom").value;
      if (!profileId || !classroomId) return;
      try {
        const entry = {
          scheduleId: root.StableIdentity.createScheduleId(),
          userProfileId: profileId,
          classroomId,
          weekday: Number(id(section, "teachingWeekday").value),
          startMinute: toMinute(id(section, "teachingStart").value),
          endMinute: toMinute(id(section, "teachingEnd").value),
          subjectId: id(section, "teachingSubject").value.trim(),
          note: id(section, "teachingNote").value.trim(),
        };
        const entries = editingScheduleId
          ? schedule.entries.map((item) =>
              item.scheduleId === editingScheduleId
                ? { ...entry, scheduleId: editingScheduleId }
                : item,
            )
          : [...schedule.entries, entry];
        schedule = root.TeachingSchedule.validateDocument({
          schemaVersion: 1,
          entries,
        });
        cancelEdit();
        id(section, "teachingSubject").value = "";
        id(section, "teachingNote").value = "";
        renderList();
        refreshCurrent();
        setStatus("课程已加入草稿；请保存课程表。");
      } catch (error) {
        setStatus(`未添加课程：${error.message}`, true);
      }
    };
    id(section, "teachingSaveSchedule").onclick = () => {
      const result = scheduleRepository.write(schedule, {
        expectedRevision: revision,
      });
      if (!result.ok)
        return setStatus(
          `课程表保存失败：${result.message || result.code}`,
          true,
        );
      schedule = result.schedule;
      revision = result.revision;
      renderList();
      setStatus("课程表已验证并保存在本机。");
    };
    refresh();
    refreshers.add(refresh);
    return Object.freeze({ refresh, scheduleRepository });
  }

  root.TeachingWorkspace = Object.freeze({
    mount,
    refresh: () => refreshers.forEach((refresh) => refresh()),
  });
})(globalThis);
