/* Shared free-score controls and display-only cinematics. Never choose winners or mutate scores. */
const ClassroomFeedback = (() => {
  "use strict";
  const KEY = "godpower_score_feedback_v1",
    defaults = {
      schemaVersion: 1,
      slots: [1, 2, 5, -1, -2, -5],
      pickEffects: true,
      scoreEffects: true,
      style: "aurora",
      duration: 1800,
      clickEnabled: true,
      clickVolume: 0.45,
    };
  let options = { ...defaults, slots: [...defaults.slots] },
    timer = null,
    generation = 0,
    initialized = false;
  const liveReels = new Map();
  function validate(raw) {
    if (!raw || typeof raw !== "object") throw Error("设置格式无效");
    const slots = raw.slots ?? defaults.slots;
    if (
      !Array.isArray(slots) ||
      slots.length !== 6 ||
      slots.some((x) => !Number.isSafeInteger(x) || x === 0)
    )
      throw Error("六个槽位必须全部填写非零安全整数");
    return {
      schemaVersion: 1,
      slots: [...slots],
      pickEffects:
        typeof raw.pickEffects === "boolean" ? raw.pickEffects : true,
      scoreEffects:
        typeof raw.scoreEffects === "boolean" ? raw.scoreEffects : true,
      style: ["aurora", "burst"].includes(raw.style) ? raw.style : "aurora",
      duration: [1200, 1800, 2600, 3600].includes(raw.duration)
        ? raw.duration
        : 1800,
      clickEnabled:
        typeof raw.clickEnabled === "boolean" ? raw.clickEnabled : true,
      clickVolume: Number.isFinite(raw.clickVolume)
        ? Math.max(0, Math.min(1, raw.clickVolume))
        : 0.45,
    };
  }
  function setOptions(next, { persist = true } = {}) {
    const value = validate({ ...options, ...next });
    options = value;
    if (persist)
      try {
        localStorage.setItem(KEY, JSON.stringify(value));
      } catch (e) {
        showToast("快捷赋分与特效设置仅在本页生效：" + e.name);
      }
    refreshSlots();
    syncSettings();
    if (!value.clickEnabled || !value.clickVolume) stopClickVoice();
    if (!value.scoreEffects && !value.pickEffects) cancel();
    return getOptions();
  }
  function getOptions() {
    return { ...options, slots: [...options.slots] };
  }
  function allowed() {
    const p = DesktopUI.getPreferences();
    return (
      p.motion !== "off" &&
      !(
        p.systemMotion && matchMedia("(prefers-reduced-motion: reduce)").matches
      )
    );
  }
  function slotMarkup(kind, id = "", disabled = false) {
    const commands = {
      picker: (n) => `scorePickerTarget(${n})`,
      hand: (n) => `handQuickScore(${n})`,
      group: (n) => `itemQuickScore(${Number(id)},${n})`,
      modal: (n) => `submitModalScore(${n})`,
      person: (n) => `applyQuickPersonScoreV218(${n})`,
    };
    if (!commands[kind]) throw Error("未知赋分入口");
    return `<div class="cf-score-slots" data-score-slots="${kind}" data-score-group="${Number(id) || 0}" role="group" aria-label="六个快捷赋分槽位">${options.slots.map((n, i) => `<button type="button" class="btn ${n > 0 ? "btn-success" : "btn-danger"}" data-score-slot="${i}" onclick="${commands[kind](n)}" ${disabled ? "disabled" : ""}>${n > 0 ? "+" : "−"}${Math.abs(n)}</button>`).join("")}</div>`;
  }
  function refreshSlots() {
    for (const host of document.querySelectorAll("[data-score-slots]")) {
      host.classList.add("cf-score-slots");
      const kind = host.dataset.scoreSlots,
        id = host.dataset.scoreGroup;
      const disabled = kind === "group" && state.isLocked;
      const temp = document.createElement("div");
      temp.innerHTML = slotMarkup(kind, id, disabled);
      host.replaceChildren(...temp.firstElementChild.childNodes);
    }
    if (typeof DesktopUI !== "undefined") DesktopUI.pickerChanged();
  }
  function customHand() {
    const input = document.getElementById("handCustomScore");
    const n = Number(input?.value);
    if (!input?.value.trim() || !Number.isSafeInteger(n) || n === 0) {
      showToast("请输入非零整数分值");
      return false;
    }
    handQuickScore(n);
    return true;
  }
  function dialog() {
    return document.getElementById("classroomShowcase");
  }
  function cancel() {
    generation++;
    clearTimeout(timer);
    timer = null;
    const root = dialog();
    if (root) {
      DesktopUI.cancelWindowClose(root);
      root.getAnimations({ subtree: true }).forEach((a) => a.cancel());
      root.close();
      root.classList.remove("active");
      root.querySelector(".cf-show-particles")?.replaceChildren();
    }
  }
  function dismiss() {
    clearTimeout(timer);
    timer = null;
    generation++;
    const root = dialog();
    if (root?.open)
      hideClassroomWindow(root, () => {
        root.close();
        root.classList.remove("active");
        root.querySelector(".cf-show-particles")?.replaceChildren();
      });
  }
  function show({ type, title, subtitle, value }) {
    if (
      !allowed() ||
      (type === "pick" ? !options.pickEffects : !options.scoreEffects)
    )
      return;
    cancel();
    const root = dialog();
    if (!root) return;
    const serial = generation;
    root.dataset.kind = type;
    root.dataset.effectStyle = options.style;
    root.querySelector(".cf-show-eyebrow").textContent =
      type === "pick"
        ? "课堂幸运时刻"
        : type === "positive"
          ? "精彩表现 · 积分增加"
          : "调整状态 · 积分扣除";
    root.querySelector(".cf-show-title").textContent = title;
    root.querySelector(".cf-show-subtitle").textContent = subtitle || "";
    root.querySelector(".cf-show-value").textContent = value || "";
    const particles = root.querySelector(".cf-show-particles");
    const simple = DesktopUI.getPreferences().motion === "simple";
    if (!simple)
      for (let i = 0; i < 24; i++) {
        const dot = document.createElement("i");
        const angle = (i / 24) * Math.PI * 2;
        dot.style.setProperty("--px", `${Math.cos(angle) * 42}vw`);
        dot.style.setProperty("--py", `${Math.sin(angle) * 42}vh`);
        dot.style.setProperty("--delay", `${(i % 6) * 35}ms`);
        particles.append(dot);
      }
    root.classList.toggle("cf-simple", simple);
    root.style.zoom = String(
      1 / (Number(getComputedStyle(document.body).zoom) || 1),
    );
    root.showModal();
    const toast = document.getElementById("toast");
    if (toast?.matches(":popover-open")) {
      toast.hidePopover();
      toast.showPopover();
    }
    root.classList.add("active");
    timer = setTimeout(() => {
      if (serial === generation) dismiss();
    }, options.duration);
  }
  function score(name, delta) {
    if (!Number.isSafeInteger(delta) || !delta) return;
    show({
      type: delta > 0 ? "positive" : "negative",
      title: name,
      subtitle: "实际积分调整",
      value: (delta > 0 ? "+" : "−") + Math.abs(delta),
    });
  }
  function picked(win, mode) {
    if (!win || window.GodpowerPicker?.isExternalPresentation()) return;
    const group = mode === "group" ? win : win.group;
    const student = mode === "group" ? null : parseStudentV218(win.memberName);
    show({
      type: "pick",
      title: student?.name || group?.name || win.memberName,
      subtitle:
        mode === "group"
          ? "本次抽中小组"
          : `${group?.name || ""}${student?.number != null ? " · 学号 " + student.number : ""}`,
      value: mode === "group" ? "LUCKY TEAM" : "就是你",
    });
  }
  function syncSettings() {
    document.querySelectorAll("[data-cf-slot]").forEach((e, i) => {
      if (document.activeElement !== e) e.value = options.slots[i];
    });
    document.querySelectorAll("[data-cf-option]").forEach((e) => {
      const v = options[e.dataset.cfOption];
      if (e.type === "checkbox") e.checked = v;
      else e.value = v;
    });
  }
  function settings() {
    document
      .querySelector('[data-category-panel="rules"]')
      .insertAdjacentHTML(
        "beforeend",
        `<section class="ui-panel cf-settings"><h3>六个快捷赋分槽位</h3><p class="ui-muted">抽取、举手、小组、独立赋分和按人赋分共用。修改后立即保存；各窗口保留手动输入。</p><div class="cf-slot-editor">${options.slots.map((n, i) => `<label>槽位 ${i + 1}<input type="number" step="1" data-cf-slot="${i}" aria-label="快捷赋分槽位 ${i + 1}" value="${n}"></label>`).join("")}</div><p id="cfSlotStatus" role="status" class="ui-muted">填写非零整数，正数加分，负数扣分。</p></section>`,
      );
    document
      .querySelector('[data-category-panel="motion"]')
      .insertAdjacentHTML(
        "beforeend",
        `<section class="ui-panel cf-settings"><h3>全屏课堂特效</h3><div class="ui-settings-row"><label for="cfPickEffects">抽中姓名全屏揭晓</label><input id="cfPickEffects" data-cf-option="pickEffects" type="checkbox"></div><div class="ui-settings-row"><label for="cfScoreEffects">自由加减分全屏反馈</label><input id="cfScoreEffects" data-cf-option="scoreEffects" type="checkbox"></div><div class="ui-settings-row"><label for="cfEffectStyle">视觉风格</label><select id="cfEffectStyle" data-cf-option="style"><option value="aurora">极光聚焦 · 光环与流光</option><option value="burst">星火绽放 · 放射粒子</option></select></div><div class="ui-settings-row"><label for="cfEffectDuration">自动收起时间</label><select id="cfEffectDuration" data-cf-option="duration"><option value="1200">1.2 秒</option><option value="1800">1.8 秒</option><option value="2600">2.6 秒</option><option value="3600">3.6 秒</option></select></div><p class="ui-muted">点击“继续课堂”或按 Escape 跳过。关闭非必要动效或系统减少动态效果时，不播放全屏演出；实际抽取、加分和扣分照常完成。</p></section>`,
      );
    document
      .querySelector('[data-category-panel="sound"] > .ui-settings-title')
      .insertAdjacentHTML(
        "afterend",
        `<section class="ui-panel cf-settings"><h3>按钮点击音效</h3><div class="ui-settings-row"><label for="cfClickEnabled">所有可操作按钮播放点击音效</label><input id="cfClickEnabled" data-cf-option="clickEnabled" type="checkbox"></div><div class="ui-settings-row"><label for="cfClickVolume">点击音量（叠加总音量与音效音量）</label><input id="cfClickVolume" data-cf-option="clickVolume" type="range" min="0" max="1" step=".05"></div><p class="ui-muted">上传、试听与还原：下方音效分类内，可分别为导航、答题、道具、赋分、确认等按钮设置声音；未单独上传时继承“通用按钮默认音效”。同一次点击只播放一次，不叠加旧按钮内的点选音效。</p></section>`,
      );
    document.querySelectorAll("[data-cf-slot]").forEach((e) =>
      e.addEventListener("change", () => {
        const values = [...document.querySelectorAll("[data-cf-slot]")].map(
          (x) => (x.value.trim() === "" ? NaN : Number(x.value)),
        );
        try {
          setOptions({ slots: values });
          document.getElementById("cfSlotStatus").textContent =
            "六个槽位已更新，所有赋分窗口同步生效。";
          e.removeAttribute("aria-invalid");
        } catch (error) {
          e.setAttribute("aria-invalid", "true");
          document.getElementById("cfSlotStatus").textContent = error.message;
        }
      }),
    );
    document.querySelectorAll("[data-cf-option]").forEach((e) =>
      e.addEventListener("change", () => {
        setOptions({
          [e.dataset.cfOption]:
            e.type === "checkbox"
              ? e.checked
              : ["duration", "clickVolume"].includes(e.dataset.cfOption)
                ? Number(e.value)
                : e.value,
        });
        cancel();
      }),
    );
    syncSettings();
  }
  let clickEvent = null,
    clickClaimed = false,
    clickPreview = false,
    clickCleanup = null;
  function allowClickSound() {
    if ((!clickPreview && !options.clickEnabled) || !options.clickVolume)
      return false;
    if (clickEvent) {
      if (clickClaimed) return false;
      clickClaimed = true;
    }
    return true;
  }
  let clickVoice = null;
  function stopClickVoice() {
    if (!clickVoice) return;
    try {
      clickVoice.source.stop();
    } catch {}
    clickVoice.source.disconnect();
    clickVoice.gain.disconnect();
    clickVoice = null;
  }
  function ownClickVoice(source, gain) {
    stopClickVoice();
    const voice = { source, gain };
    clickVoice = voice;
    source.onended = () => {
      source.disconnect();
      gain.disconnect();
      if (clickVoice === voice) clickVoice = null;
    };
  }
  function bindButtonSound() {
    document.addEventListener(
      "click",
      (e) => {
        const button = e.target.closest?.(
          "button,summary,[role=button],input[type=button],input[type=submit]",
        );
        if (!button || button.disabled || button.closest("[inert]")) return;
        stopClickVoice();
        clickEvent = e;
        clickClaimed = false;
        clickPreview = button.hasAttribute("data-sound-preview");
        clearTimeout(clickCleanup);
        clickCleanup = setTimeout(() => {
          clickEvent = null;
          clickPreview = false;
          clickCleanup = null;
        }, 0);
        if (!clickPreview) void playSound(ActionSounds.classify(button));
      },
      true,
    );
  }
  function init() {
    if (initialized) return;
    initialized = true;
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) options = validate(JSON.parse(saved));
    } catch (e) {
      console.warn("快捷赋分与特效设置使用默认值：", e.name);
    }
    document.body.insertAdjacentHTML(
      "beforeend",
      `<dialog id="classroomShowcase" aria-label="课堂结果特效"><section class="cf-show-surface ui-function-surface"><div class="cf-show-orbit" aria-hidden="true"></div><div class="cf-show-particles" aria-hidden="true"></div><div class="cf-show-copy"><p class="cf-show-eyebrow"></p><h2 class="cf-show-title"></h2><p class="cf-show-subtitle"></p><strong class="cf-show-value"></strong></div></section><button type="button" class="btn ui-cinematic-skip" onclick="ClassroomFeedback.dismiss()">继续课堂 · 跳过特效</button></dialog>`,
    );
    bindButtonSound();
    Reliability.onDefenseInvalidation(() => {
      cancel();
      BattleMotion.clear();
    });
    dialog().addEventListener("cancel", (e) => {
      e.preventDefault();
      dismiss();
    });
    settings();
    refreshSlots();
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancel();
        stopClickVoice();
        clearLive();
      }
    });
    matchMedia("(prefers-reduced-motion: reduce)").addEventListener(
      "change",
      () => {
        if (!allowed()) {
          cancel();
          clearLive();
        }
      },
    );
  }
  function candidates(frame) {
    const pre = state.picker.preselectedGroupIds || [];
    const groups =
      state.picker.mode === "two_tier"
        ? state.groups.filter(
            (g) => g.members?.length && (!pre.length || pre.includes(g.id)),
          )
        : state.groups;
    return frame.id === "reelFrameGroup"
      ? groups.map((g) => ({ group: g, raw: g.name }))
      : groups.flatMap((g) =>
          (g.members || []).map((raw) => ({ group: g, raw })),
        );
  }
  function rowMarkup(candidate, isGroup) {
    return isGroup
      ? escapeHtml(candidate?.raw || "待开奖")
      : studentLabelHTMLV218(candidate?.raw || "待开奖", candidate?.group);
  }
  function clearLive() {
    for (const [frame, live] of liveReels) {
      live.animation.cancel();
      live.strip.remove();
      live.actual.style.visibility = live.visibility;
    }
    liveReels.clear();
  }
  function startLive() {
    clearLive();
    if (!allowed()) return;
    document
      .querySelectorAll("#pickerModal .slot-reel-frame")
      .forEach((frame) => {
        if (!frame.getClientRects().length) return;
        const rows = candidates(frame);
        if (!rows.length) return;
        const actual = frame.querySelector(".slot-reel-text"),
          height = frame.clientHeight,
          strip = document.createElement("div");
        strip.className = "ui-slot-deceleration cf-live-reel";
        strip.setAttribute("aria-hidden", "true");
        for (const candidate of [...rows, rows[0]]) {
          const row = document.createElement("span");
          row.style.height = height + "px";
          row.innerHTML = rowMarkup(candidate, frame.id === "reelFrameGroup");
          strip.append(row);
        }
        const visibility = actual.style.visibility;
        actual.style.visibility = "hidden";
        frame.append(strip);
        const animation = strip.animate(
          [
            { transform: "translateY(0)" },
            { transform: `translateY(-${height * rows.length}px)` },
          ],
          {
            duration: 100 * rows.length,
            iterations: Infinity,
            easing: "linear",
          },
        );
        liveReels.set(frame, {
          animation,
          strip,
          actual,
          visibility,
          rows,
          height,
        });
      });
  }
  function takeLive(frame) {
    const live = liveReels.get(frame);
    if (!live) return null;
    const phase =
      ((Number(live.animation.currentTime) || 0) / 100) % live.rows.length;
    return {
      index: Math.floor(phase),
      fraction: phase % 1,
      rows: live.rows,
      visibility: live.visibility,
    };
  }
  return {
    init,
    allowClickSound,
    ownClickVoice,
    getOptions,
    setOptions,
    validate,
    slotMarkup,
    refreshSlots,
    customHand,
    score,
    picked,
    dismiss,
    cancel,
    startLive,
    clearLive,
    takeLive,
    rowMarkup,
    status: () => ({
      open: !!dialog()?.open,
      timer: timer !== null,
      liveReels: liveReels.size,
    }),
  };
})();
