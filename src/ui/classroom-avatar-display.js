/* Read-only presentation adapter for locally stored roster avatars. */
(function installClassroomAvatarDisplay(root) {
  "use strict";

  const urls = new Map();
  const compactImages = new Map();
  const compactGroups = new Map();
  let contextKey = "";
  let avatarIndex = new Map();
  let generation = 0;
  const ownGroupAvatars = new Map();
  let saveIndexPending = null;

  function currentContext() {
    try {
      const value = JSON.parse(
        root.localStorage.getItem("godpower_active_classroom_context_v1") ||
          "null",
      );
      if (
        value?.schemaVersion !== 1 ||
        !root.StableIdentity.isValidUserProfileId(value.userProfileId) ||
        !root.StableIdentity.isValidClassroomId(value.classroomId)
      )
        return null;
      return value;
    } catch (_) {
      return null;
    }
  }

  function clearUrls() {
    for (const url of urls.values()) root.URL.revokeObjectURL(url);
    urls.clear();
    compactImages.clear();
    compactGroups.clear();
    avatarIndex = new Map();
    ownGroupAvatars.clear();
  }

  function canvasImage(source, width, height) {
    const canvas = root.document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return "";
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    const scale = Math.max(width / source.width, height / source.height);
    const drawWidth = source.width * scale;
    const drawHeight = source.height * scale;
    context.drawImage(
      source,
      (width - drawWidth) / 2,
      (height - drawHeight) / 2,
      drawWidth,
      drawHeight,
    );
    return canvas.toDataURL("image/webp", 0.82);
  }

  async function compactImage(url) {
    if (compactImages.has(url)) return compactImages.get(url);
    const imageGeneration = generation;
    const pending = (async () => {
      try {
        const image = new Image();
        image.src = url;
        if (typeof image.decode === "function") await image.decode();
        else
          await new Promise((resolve, reject) => {
            image.onload = resolve;
            image.onerror = reject;
          });
        return canvasImage(image, 256, 256);
      } catch (_) {
        return "";
      }
    })();
    compactImages.set(url, pending);
    pending.then((value) => {
      if (imageGeneration === generation) compactImages.set(url, value);
    });
    return pending;
  }

  async function readSaveIndex() {
    const context = root.SaveManager.rosterContext();
    if (!context) return;
    const nextKey = `save:${context.saveId}:${context.generation}:${context.rosterRevision}`;
    if (nextKey === contextKey) return saveIndexPending;
    const doc = root.SaveManager.rosterView();
    generation++;
    clearUrls();
    contextKey = nextKey;
    const localGeneration = generation;
    const byStudent = new Map(
      doc.roster.students.map((s) => [s.studentUid, s]),
    );
    for (const group of doc.roster.groups) {
      const entries = doc.roster.assignments
        .filter((a) => a.groupUid === group.groupUid)
        .map((a) => byStudent.get(a.studentUid))
        .filter(Boolean)
        .map((s) => ({
          name: root.SaveRoster.label(s),
          resourceId: s.avatarResourceId || "",
        }));
      avatarIndex.set(group.groupUid, entries);
      if (group.avatarResourceId)
        ownGroupAvatars.set(group.groupUid, group.avatarResourceId);
    }
    const ids = new Set(
      [...avatarIndex.values()]
        .flatMap((rows) => rows.map((r) => r.resourceId))
        .filter(Boolean),
    );
    for (const id of ownGroupAvatars.values()) ids.add(id);
    saveIndexPending = (async () => {
      await Promise.all(
        [...ids].map(async (id) => {
          try {
            const asset = await root.SaveManager.repository().getAsset(id);
            if (localGeneration !== generation || !asset?.raw) return;
            urls.set(id, root.URL.createObjectURL(asset.raw));
          } catch (error) {
            console.warn("可选存档头像读取失败", error.message);
          }
        }),
      );
      if (localGeneration === generation)
        await Promise.all([...urls.values()].map(compactImage));
    })();
    return saveIndexPending;
  }
  async function readIndex() {
    if (root.SaveManager?.enabled()) return readSaveIndex();
    const context = currentContext();
    const nextKey = context
      ? `${context.userProfileId}\u0000${context.classroomId}`
      : "";
    if (nextKey !== contextKey) {
      generation++;
      clearUrls();
      contextKey = nextKey;
    }
    if (!context) return;
    const indexGeneration = generation;

    const repository =
      root.ClassroomRosterRepository.createClassroomRosterRepository({
        storage: root.localStorage,
      });
    const saved = repository.read();
    if (!saved.ok || !saved.rosterData) return;
    const roster = saved.rosterData;
    const assignment = roster.assignments.find(
      (entry) =>
        entry.userProfileId === context.userProfileId &&
        entry.classroomId === context.classroomId,
    );
    if (!assignment || assignment.mode !== "group") return;

    const students = new Map(
      roster.students.map((student) => [student.studentUid, student]),
    );
    const byGroup = new Map();
    for (const item of assignment.groupAssignments) {
      const student = students.get(item.studentUid);
      if (!student || student.classroomId !== context.classroomId) continue;
      const entries = byGroup.get(item.groupUid) || [];
      entries.push({
        name: student.displayName,
        resourceId: student.avatarResourceId || "",
      });
      byGroup.set(item.groupUid, entries);
    }
    avatarIndex = byGroup;

    const resourceIds = new Set();
    for (const entries of byGroup.values())
      for (const entry of entries)
        if (entry.resourceId) resourceIds.add(entry.resourceId);
    if (!resourceIds.size) return;

    let resourceRepository;
    try {
      resourceRepository = await root.TeachingResourceRepository.open();
    } catch (_) {
      return;
    }
    await Promise.all(
      [...resourceIds].map(async (resourceId) => {
        if (urls.has(resourceId)) return;
        try {
          const resource = await resourceRepository.get(resourceId);
          if (
            indexGeneration !== generation ||
            !resource ||
            resource.profileId !== context.userProfileId ||
            resource.classroomId !== context.classroomId ||
            resource.subjectId !== "student-avatar" ||
            !["image/png", "image/jpeg", "image/webp"].includes(
              resource.mimeType,
            )
          )
            return;
          urls.set(resourceId, root.URL.createObjectURL(resource.blob));
        } catch (_) {
          // Missing or unavailable optional avatars never block the classroom UI.
        }
      }),
    );
    await Promise.all([...urls.values()].map(compactImage));
  }

  function studentUrl(group, name, memberIndex = 0) {
    const entries = avatarIndex.get(group?.groupUid) || [];
    // Picker callers pass the student's absolute position in the group, not
    // the occurrence count among identical names.
    const indexed = entries[memberIndex];
    if (indexed?.name === name)
      return indexed.resourceId ? urls.get(indexed.resourceId) || "" : "";
    const matches = entries.filter((entry) => entry.name === name);
    if (matches.length === 1)
      return matches[0].resourceId ? urls.get(matches[0].resourceId) || "" : "";
    if (group?.members?.[memberIndex] === name) {
      const occurrence = group.members
        .slice(0, memberIndex)
        .filter((label) => label === name).length;
      const match = matches[occurrence];
      return match?.resourceId ? urls.get(match.resourceId) || "" : "";
    }
    return "";
  }

  function ownGroupUrl(group) {
    return urls.get(ownGroupAvatars.get(group?.groupUid)) || "";
  }
  async function populateGroupPreview(group, node) {
    const identity = root.SaveManager.context();
    await readIndex();
    const current = root.SaveManager.context();
    if (
      !node?.isConnected ||
      identity?.saveId !== current?.saveId ||
      identity?.generation !== current?.generation
    )
      return;
    const url = ownGroupUrl(group);
    if (!url) return;
    const image = root.document.createElement("img");
    image.src = url;
    image.alt = group.name + " 头像";
    node.replaceChildren(image);
    node.classList.remove("empty");
  }
  function groupUrls(group) {
    const own = urls.get(ownGroupAvatars.get(group?.groupUid));
    if (own) return [own];
    const entries = avatarIndex.get(group?.groupUid) || [];
    const seen = new Set();
    const result = [];
    for (const entry of entries) {
      const url = entry.resourceId ? urls.get(entry.resourceId) : "";
      if (!url || seen.has(url)) continue;
      seen.add(url);
      result.push(url);
      if (result.length === 4) break;
    }
    return result;
  }

  async function groupDataUrl(group) {
    const cached = compactGroups.get(group?.groupUid);
    if (cached) return cached;
    const images = groupUrls(group);
    if (!images.length) return "";
    const imageGeneration = generation;
    const pending = (async () => {
      const sources = await Promise.all(
        images.map(async (url) => {
          const image = new Image();
          image.src = url;
          if (typeof image.decode === "function") await image.decode();
          else
            await new Promise((resolve, reject) => {
              image.onload = resolve;
              image.onerror = reject;
            });
          return image;
        }),
      );
      const canvas = root.document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const context = canvas.getContext("2d");
      if (!context) return "";
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, 256, 256);
      const cell = sources.length === 1 ? 256 : 127;
      sources.forEach((image, index) => {
        const x = sources.length === 1 ? 0 : (index % 2) * 129;
        const y = sources.length === 1 ? 0 : Math.floor(index / 2) * 129;
        const scale = Math.max(cell / image.width, cell / image.height);
        const width = image.width * scale;
        const height = image.height * scale;
        context.save();
        context.beginPath();
        context.rect(x, y, cell, cell);
        context.clip();
        context.drawImage(
          image,
          x + (cell - width) / 2,
          y + (cell - height) / 2,
          width,
          height,
        );
        context.restore();
      });
      return canvas.toDataURL("image/webp", 0.82);
    })().catch(() => "");
    compactGroups.set(group.groupUid, pending);
    pending.then((value) => {
      if (imageGeneration === generation)
        compactGroups.set(group.groupUid, value);
    });
    return pending;
  }

  function studentDataUrl(group, name, occurrence = 0) {
    const url = studentUrl(group, name, occurrence);
    const value = url ? compactImages.get(url) : "";
    return typeof value === "string" ? value : "";
  }

  function ownGroupDataUrlCached(group) {
    const value = compactImages.get(ownGroupUrl(group));
    return typeof value === "string" ? value : "";
  }
  function groupDataUrlCached(group) {
    const value = compactGroups.get(group?.groupUid);
    return typeof value === "string" ? value : "";
  }

  function decorateGroupCards(groups) {
    const taskGeneration = generation;
    // A teacher-chosen group avatar wins over the member stack.
    for (const group of groups) {
      const ownAvatar =
        group.groupAvatar || urls.get(ownGroupAvatars.get(group.groupUid));
      if (!ownAvatar) continue;
      const card = root.document.querySelector(
        `.group-row-card[data-group-id="${CSS.escape(String(group.id))}"]`,
      );
      const badge = card?.querySelector(".battle-group-number");
      if (!badge || badge.dataset.avatarDecorated === "group") continue;
      badge.dataset.avatarDecorated = "group";
      badge.classList.add("battle-number-avatar");
      badge.replaceChildren();
      const image = root.document.createElement("img");
      image.className = "battle-group-avatar-single";
      image.src = ownAvatar;
      image.alt = `${group.name} 头像`;
      image.draggable = false;
      const number = root.document.createElement("span");
      number.className = "battle-group-number-below-avatar";
      number.textContent = groupNoTextV213(group);
      badge.append(image, number);
    }
    readIndex().then(() => {
      if (taskGeneration !== generation && taskGeneration !== generation - 1)
        return;
      for (const group of groups) {
        if (group.groupAvatar) continue;
        const card = root.document.querySelector(
          `.group-row-card[data-group-id="${CSS.escape(String(group.id))}"]`,
        );
        const badge = card?.querySelector(".battle-group-number");
        if (!badge || badge.dataset.avatarDecorated === "true") continue;
        const images = groupUrls(group);
        if (!images.length) continue;
        badge.dataset.avatarDecorated = "true";
        badge.classList.add("battle-number-avatar");
        badge.replaceChildren();
        const stack = root.document.createElement("span");
        stack.className = `battle-group-avatar-stack count-${images.length}`;
        stack.setAttribute("aria-label", `${group.name} 小组头像`);
        for (const url of images) {
          const image = root.document.createElement("img");
          image.src = url;
          image.alt = "";
          image.draggable = false;
          stack.append(image);
        }
        const number = root.document.createElement("span");
        number.className = "battle-group-number-below-avatar";
        number.textContent = groupNoTextV213(group);
        badge.append(stack, number);
      }
    });
  }

  function renderRaffleReel(element, group, studentName = "", occurrence = 0) {
    if (!element) return;
    const imageUrl = studentName
      ? studentUrl(group, studentName, occurrence)
      : groupUrls(group)[0] || "";
    element.replaceChildren();
    const wrapper = root.document.createElement("span");
    wrapper.className = "picker-avatar-reel-content";
    const label = root.document.createElement("span");
    if (studentName && typeof root.parseStudentV218 === "function") {
      const parsed = root.parseStudentV218(studentName);
      if (parsed.numberText) {
        const number = root.document.createElement("span");
        number.className = "student-no-inline";
        number.style.color = group?.color || "#0f766e";
        number.textContent = parsed.numberText;
        label.append(number);
      }
      const name = root.document.createElement("span");
      name.className = "student-name";
      name.textContent = parsed.name;
      label.append(name);
    } else label.textContent = group?.name || "";
    if (imageUrl) {
      const image = root.document.createElement("img");
      image.src = imageUrl;
      image.alt = "";
      image.draggable = false;
      wrapper.append(image);
    }
    wrapper.append(label);
    element.append(wrapper);
  }

  root.addEventListener("godpower:active-classroom-changed", () => {
    contextKey = "!refresh!";
    readIndex();
  });
  root.addEventListener("godpower:active-save-changed", () => {
    readIndex().then(() =>
      decorateGroupCards(typeof state !== "undefined" ? state.groups : []),
    );
  });
  root.addEventListener("pagehide", clearUrls, { once: true });

  root.ClassroomAvatarDisplay = Object.freeze({
    async prepare(groups = []) {
      return readIndex()
        .then(() => {
          return Promise.all(groups.map(groupDataUrl));
        })
        .then(() => {
          decorateGroupCards(groups);
        });
    },
    decorateGroupCards,
    groupUrls,
    ownGroupUrl,
    ownGroupDataUrlCached,
    populateGroupPreview,
    groupDataUrl,
    groupDataUrlCached,
    renderRaffleReel,
    studentDataUrl,
    studentUrl,
  });
})(globalThis);
