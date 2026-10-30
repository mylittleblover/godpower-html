function openPickerModal({ internal = false } = {}) {
  if (!internal && window.godpowerDesktop?.role === "main") {
    window.godpowerDesktop.openPicker();
    return;
  }
  if (
    document.getElementById("pickerModal").classList.contains("active") &&
    !document.getElementById("pickerModal").dataset.uiClosing
  )
    return;
  if (typeof DesktopUI !== "undefined") DesktopUI.cancelPickerPreparation();
  showClassroomWindow(document.getElementById("pickerModal"));
  updatePickerView();
  updatePickerPoolUI();
  resetSlotDisplay();
}

function closePickerModal() {
  if (slotEngine.isSpinning) stopSlotSpin();
  if (typeof DesktopUI !== "undefined") DesktopUI.cancelPickerPreparation();
  window.GodpowerPicker?.notify("idle");
  hideClassroomWindow(document.getElementById("pickerModal"));
  document.getElementById("slotResultPanel").classList.remove("show");
}

function setPickerMode(mode) {
  if (slotEngine.isSpinning || window.GodpowerPicker?.isSettling()) return;
  if (typeof DesktopUI !== "undefined") DesktopUI.cancelPickerPreparation();
  state.picker.mode = mode;
  ["btnModeInd", "btnModeGrp", "btnModeTwo"].forEach((id) =>
    document.getElementById(id).classList.remove("active"),
  );
  if (mode === "individual")
    document.getElementById("btnModeInd").classList.add("active");
  if (mode === "group")
    document.getElementById("btnModeGrp").classList.add("active");
  if (mode === "two_tier")
    document.getElementById("btnModeTwo").classList.add("active");
  updatePickerView();
  updatePickerPoolUI();
  resetSlotDisplay();
}

function updatePickerView() {
  const reelGrp = document.getElementById("reelFrameGroup");
  const reelStu = document.getElementById("reelFrameStudent");
  const selBox = document.getElementById("twoTierGroupSelect");
  if (state.picker.mode === "group") {
    reelGrp.style.display = "block";
    reelStu.style.display = "none";
  } else if (state.picker.mode === "two_tier") {
    reelGrp.style.display = "block";
    reelStu.style.display = "block";
  } else {
    reelGrp.style.display = "none";
    reelStu.style.display = "block";
  }
  if (selBox) {
    if (state.picker.mode === "two_tier") {
      selBox.style.display = "block";
      renderTwoTierChips();
    } else selBox.style.display = "none";
  }
}

function renderTwoTierChips() {
  const wrap = document.getElementById("twoTierGroupChips");
  if (!wrap) return;
  const pre = Array.isArray(state.picker.preselectedGroupIds)
    ? state.picker.preselectedGroupIds
    : [];
  const groups = state.groups.filter(
    (g) => Array.isArray(g.members) && g.members.length > 0,
  );
  wrap.innerHTML =
    groups
      .map((g) => {
        const on = pre.includes(g.id);
        const style = on
          ? "border-color:" +
            g.color +
            "; color:#fff; background:" +
            g.color +
            ";"
          : "";
        return (
          '<button type="button" class="two-tier-chip ' +
          (on ? "active" : "") +
          '" style="' +
          style +
          '" onclick="toggleGroupPreselect(' +
          g.id +
          ')">' +
          escapeHtml(g.name) +
          '<span style="opacity:.75; font-size:11px; margin-left:4px;">' +
          g.members.length +
          "人</span></button>"
        );
      })
      .join("") ||
    '<div style="color:#94a3b8; font-size:12px;">暂无含成员的小组，请先在小组卡片中导入名单</div>';
}

function toggleGroupPreselect(gid) {
  if (slotEngine.isSpinning) return;
  let pre = Array.isArray(state.picker.preselectedGroupIds)
    ? state.picker.preselectedGroupIds.slice()
    : [];
  const idx = pre.indexOf(gid);
  if (idx >= 0) pre.splice(idx, 1);
  else pre.push(gid);
  state.picker.preselectedGroupIds = pre;
  saveState();
  renderTwoTierChips();
  updatePickerPoolUI();
  resetSlotDisplay();
}

function resetSlotDisplay() {
  window.GodpowerPicker?.notify("idle");
  slotEngine.chosenResult = null;
  document.getElementById("reelTextGroup").innerText = "待开奖";
  document.getElementById("reelTextStudent").innerText = "待开奖";
  document.getElementById("slotSubBadge").innerText = "就绪";
  document.getElementById("slotResultPanel").classList.remove("show");
  const btn = document.getElementById("btnSlotTrigger");
  btn.className = "btn-slot-action start";
  btn.innerText = "开始抽签";
}

function toggleAntiRepeat(checked) {
  state.picker.antiRepeat = checked;
  saveState();
  updatePickerPoolUI();
}

function resetPickerPool() {
  state.picker.pickedStudentKeys = [];
  state.picker.pickedGroupIds = [];
  saveState();
  updatePickerPoolUI();
  showToast("点名奖池已重置");
}

function getAvailablePool() {
  if (state.picker.mode === "group") {
    let grps = state.groups;
    if (state.picker.antiRepeat) {
      grps = grps.filter((g) => !state.picker.pickedGroupIds.includes(g.id));
      if (grps.length === 0 && state.groups.length > 0) {
        state.picker.pickedGroupIds = [];
        grps = state.groups;
      }
    }
    return { type: "groups", list: grps };
  }

  if (state.picker.mode === "two_tier") {
    let grps = state.groups.filter(
      (g) => Array.isArray(g.members) && g.members.length > 0,
    );
    const pre = Array.isArray(state.picker.preselectedGroupIds)
      ? state.picker.preselectedGroupIds
      : [];
    if (pre.length > 0) {
      const selected = grps.filter((g) => pre.includes(g.id));
      if (selected.length > 0) grps = selected;
    }
    let students = [];
    grps.forEach((g) => {
      (g.members || []).forEach((m, index) =>
        students.push({
          group: g,
          memberName: m,
          memberIndex: index,
          key: `${g.id}__${index}__${m}`,
          legacyKey: `${g.id}__${m}`,
        }),
      );
    });
    if (state.picker.antiRepeat) {
      const filtered = students.filter(
        (s) =>
          !state.picker.pickedStudentKeys.includes(s.key) &&
          !state.picker.pickedStudentKeys.includes(s.legacyKey),
      );
      if (filtered.length === 0 && students.length > 0) {
        state.picker.pickedStudentKeys = [];
        return { type: "students", list: students, total: students.length };
      }
      return { type: "students", list: filtered, total: students.length };
    }
    return { type: "students", list: students, total: students.length };
  }

  let students = [];
  state.groups.forEach((g) => {
    (g.members || []).forEach((m, index) => {
      students.push({
        group: g,
        memberName: m,
        memberIndex: index,
        key: `${g.id}__${index}__${m}`,
        legacyKey: `${g.id}__${m}`,
      });
    });
  });
  if (state.picker.antiRepeat) {
    let filtered = students.filter(
      (s) =>
        !state.picker.pickedStudentKeys.includes(s.key) &&
        !state.picker.pickedStudentKeys.includes(s.legacyKey),
    );
    if (filtered.length === 0 && students.length > 0) {
      state.picker.pickedStudentKeys = [];
      filtered = students;
    }
    return { type: "students", list: filtered, total: students.length };
  }
  return { type: "students", list: students, total: students.length };
}

function updatePickerPoolUI() {
  const pool = getAvailablePool();
  const label = document.getElementById("poolStatusText");
  if (!label) return;
  if (pool.type === "groups") {
    label.innerText = `剩余: ${pool.list.length}组`;
  } else {
    label.innerText = `剩余: ${pool.list.length}人`;
  }
}

function toggleSlotSpin() {
  if (!slotEngine.isSpinning) return startSlotSpin();
  return stopSlotSpin();
}

async function startSlotSpin() {
  const uiGeneration =
    typeof DesktopUI !== "undefined" ? DesktopUI.getPickerGeneration() : null;
  const pool = getAvailablePool();
  if (pool.list.length === 0) {
    themeAlert("奖池空了");
    return;
  }
  await window.ClassroomAvatarDisplay?.prepare(state.groups);
  await getAudioContext();
  if (
    slotEngine.isSpinning ||
    (uiGeneration !== null && !DesktopUI.isPickerCurrent(uiGeneration))
  )
    return false;
  startRollLoop();
  slotEngine.isSpinning = true;
  document.getElementById("slotResultPanel").classList.remove("show");
  const btn = document.getElementById("btnSlotTrigger");
  btn.className = "btn-slot-action stop";
  btn.innerText = "停止";

  const winnerIndex = Math.floor(Math.random() * pool.list.length);

  if (state.picker.mode === "two_tier") {
    slotEngine.chosenResult = pool.list[winnerIndex];
  } else {
    slotEngine.chosenResult = pool.list[winnerIndex];
  }

  const allGroups = state.groups;
  let allStudents = [];
  state.groups.forEach((g) => {
    (g.members || []).forEach((m, memberIndex) =>
      allStudents.push({ group: g, name: m, memberIndex }),
    );
  });
  if (allGroups.length === 0) allGroups.push({ name: "默认组" });
  if (allStudents.length === 0)
    allStudents = [{ group: { name: "默认组" }, name: "学生" }];

  // 双层联动：转轮在预选组及其组内学生中滚动（未预选则全部有成员组）
  let reelGrps = allGroups;
  let reelStus = allStudents;
  if (state.picker.mode === "two_tier") {
    const pre = Array.isArray(state.picker.preselectedGroupIds)
      ? state.picker.preselectedGroupIds
      : [];
    const grpWithMembers = state.groups.filter(
      (g) => Array.isArray(g.members) && g.members.length > 0,
    );
    if (pre.length > 0) {
      const chosen = allGroups.filter((g) => pre.includes(g.id));
      if (chosen.length > 0) reelGrps = chosen;
      const chosenStus = allStudents.filter((s) => pre.includes(s.group.id));
      if (chosenStus.length > 0) reelStus = chosenStus;
    } else if (grpWithMembers.length > 0) {
      reelGrps = grpWithMembers;
      reelStus = allStudents.filter((s) =>
        grpWithMembers.some((g) => g.id === s.group.id),
      );
    }
  }

  const reelGrpText = document.getElementById("reelTextGroup");
  if (reelGrpText) {
    slotEngine.timerGroup = setInterval(() => {
      const randomGrp = reelGrps[Math.floor(Math.random() * reelGrps.length)];
      window.ClassroomAvatarDisplay?.renderRaffleReel(reelGrpText, randomGrp);
    }, 70);
  }

  const reelStuText = document.getElementById("reelTextStudent");
  if (reelStuText) {
    slotEngine.timerStudent = setInterval(() => {
      const randomStu = reelStus[Math.floor(Math.random() * reelStus.length)];
      window.ClassroomAvatarDisplay?.renderRaffleReel(
        reelStuText,
        randomStu.group,
        randomStu.name,
        randomStu.memberIndex,
      );
      if (typeof window.ClassroomAvatarDisplay === "undefined")
        reelStuText.textContent = randomStu.name;
    }, 50);
  }
  ClassroomFeedback.startLive();
  window.GodpowerPicker?.notify("rolling");
}

function stopSlotSpin() {
  if (!slotEngine.isSpinning) return false;
  slotEngine.isSpinning = false;
  clearInterval(slotEngine.timerGroup);
  clearInterval(slotEngine.timerStudent);

  const btn = document.getElementById("btnSlotTrigger");
  btn.className = "btn-slot-action start";
  btn.innerText = "开始抽签";

  const win = slotEngine.chosenResult;
  stopRollLoop(() => playSound("roll_win"));

  const reelGrpText = document.getElementById("reelTextGroup");
  const reelStuText = document.getElementById("reelTextStudent");
  const badge = document.getElementById("slotSubBadge");
  const resultHeadline = document.getElementById("resultHeadline");

  if (state.picker.mode === "group") {
    window.ClassroomAvatarDisplay?.renderRaffleReel(reelGrpText, win);
    if (typeof window.ClassroomAvatarDisplay === "undefined")
      reelGrpText.textContent = win.name;
    badge.innerText = `小组抽签`;
    resultHeadline.innerText = `抽中：${win.name}`;
    if (state.picker.antiRepeat) state.picker.pickedGroupIds.push(win.id);
  } else if (state.picker.mode === "two_tier") {
    window.ClassroomAvatarDisplay?.renderRaffleReel(reelGrpText, win.group);
    window.ClassroomAvatarDisplay?.renderRaffleReel(
      reelStuText,
      win.group,
      win.memberName,
      win.memberIndex,
    );
    if (typeof window.ClassroomAvatarDisplay === "undefined") {
      reelGrpText.textContent = win.group.name;
      reelStuText.innerHTML = studentLabelHTMLV218(win.memberName, win.group);
    }
    badge.innerText = `双层联动：${win.group.name}`;
    resultHeadline.innerHTML = `抽中：${studentLabelHTMLV218(win.memberName, win.group)} <span style="color:#64748b">(${escapeHtml(win.group.name)})</span>`;
    if (state.picker.antiRepeat) {
      state.picker.pickedStudentKeys.push(win.key);
    }
  } else {
    window.ClassroomAvatarDisplay?.renderRaffleReel(
      reelStuText,
      win.group,
      win.memberName,
      win.memberIndex,
    );
    if (typeof window.ClassroomAvatarDisplay === "undefined")
      reelStuText.innerHTML = studentLabelHTMLV218(win.memberName, win.group);
    badge.innerText = `所属：${win.group.name}`;
    resultHeadline.innerHTML = `抽中：${studentLabelHTMLV218(win.memberName, win.group)} <span style="color:#64748b">(${escapeHtml(win.group.name)})</span>`;
    if (state.picker.antiRepeat) state.picker.pickedStudentKeys.push(win.key);
  }
  ensureV2State();
  const target = state.picker.mode === "group" ? win : win.group;
  const text =
    state.picker.mode === "group"
      ? `抽中 ${target.name}`
      : `抽中 ${win.memberName}（${target.name}）`;
  state.itemGlobal.pickerHistory.push({ time: Date.now(), text });
  if (state.itemGlobal.pickerHistory.length > 100)
    state.itemGlobal.pickerHistory.shift();
  saveState();
  syncPickerScoreTarget();
  renderPickerInfo();
  updatePickerPoolUI();
  window.GodpowerPicker?.notify("settling");
  document.getElementById("slotResultPanel").classList.add("show");
  if (typeof DesktopUI !== "undefined") DesktopUI.pickerStopped();
}

function rewardPickedStudent(points) {
  cancelScoreAnimationAndSync();
  const win = slotEngine.chosenResult;
  if (!win) return;
  const targetGroup = state.picker.mode === "group" ? win : win.group;
  const g = state.groups.find((x) => x.id === targetGroup.id);
  if (!g) return;

  recordHistory(`${g.name} 点名回答加分 (+${points})`);
  const oldScore = g.score;
  g.score = oldScore + points;
  saveState();
  animateScores([{ groupId: g.id, start: oldScore, target: g.score }]);
  playSound("score_add");

  showToast(`${g.name} 表现分 +${points}`);
  document.getElementById("slotResultPanel").classList.remove("show");
}
